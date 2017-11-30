var Fl = require('fluture');

const Redshift = require('node-redshift') ;

// :: (String, Number, String, String, String) ->
//                                  {String, Number, String, String, String}
const getConfig = (host, port, database, user, password) => {
  return {
    user, database, password, port, host
  };
}

// :: (boolean, {String, Number, String, String, String}) -> Redshift
const fromConfig = (pool, config) =>
  new Redshift(config, {rawConnection: !pool}) ;

// Any failure in connecting will be encapulated in the future error state (left),
//  any sucessful connection will be in the success state (right)
// :: (String, Number, String, String, String) -> Future <e Redshift>
module.exports.from = (host, port, database, user, password) => {
  const config = getConfig(host, port, database, user, password) ;
  // => {host, port, database, user, password}

  const redshiftClient = fromConfig(false, config) ;
  // => Redshift

  // partially apply the "this" conext
  const connect = redshiftClient.connect.bind(redshiftClient) ;

  return Fl.node(connect) ;
  // => Future <e Redshit>
}
