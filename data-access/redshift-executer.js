const {create, env} = require('sanctuary');
const {env: flutureEnv} = require('fluture-sanctuary-types');
const F = require('fluture');
const {Left, Right, curry4, I, T, map, pipe} =
  create({checkTypes: false, env: env.concat(flutureEnv)});

// :: (String, Object) -> Error -> Either { Left }
const rejectOf = (query, bindings) => (e) => {
    const err = {};
    err.message = e.message;
    err.stack = e.stack;
    err.query = query;
    err.bindings = bindings;
    return F.reject(err);
};

// :: ([a] -> [b]) -> String -> Object -> Reshift -> Future <e, Result>
const executeRedshift = curry4((formatter, query, bindings, connection) => {
  const boundQueryCps = connection.query.bind(connection, query)
  // => () -> Nodeback <e r> -> x

  return F.node(boundQueryCps).
    map(formatter).
    chainRej(
      rejectOf(query, bindings)
    ) ;
})

const withConnection = (connection) => {

  const executeSingle = pipe([
    T(connection),
    F.fold(Left, Right)
  ])

  const executeInSeries = pipe([
    // use thrush combinator to apply connection to all statements
    map(T(connection)), //=> [Future{ResultSet}]
    // executes one at a time
    F.parallel(1),
    // handle errors in the query
    F.fold(Left, Right) // wrap rejected future result in Left. on Succes, transform future result from [Either error resultSet] to Either error [resultSet]
  ]);

  return Object.freeze({
    executeSingle,
    executeInSeries
  })
}

const formatRaw = I
const formatSelectMany = o => o.rows

// :: String -> Object -> Reshift -> Future <e, Result>
const buildSelectMany = executeRedshift(formatSelectMany)
const buildRaw = executeRedshift(formatSelectMany)

// Used to inverse the realtionship between specifying the connection and the
//    the query, for situations where the connection is in deferred state
// :: (Reshift -> Future <e, Result>) -> Reshift -> Future <e, Result>
const executeSingleWithConnection = statement => connection =>
  withConnection(connection).
    executeSingle(statement) ;

const executeInSeriesWithConnection = statements => connection =>
  withConnection(connection).
    executeInSeries(statements) ;


module.exports = Object.freeze({
   buildRaw,
   buildSelectMany,
   withConnection,
   executeSingleWithConnection,
   executeInSeriesWithConnection
 })
