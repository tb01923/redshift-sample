const { create, env } = require('sanctuary');
const { map } = create({checkTypes: false, env: env});

const redshift = require('./data-access/redshift-connect') ;
const { executeSingleWithConnection, executeInSeriesWithConnection } =
  require('./data-access/redshift-executer') ;
const { selectAllSamples } = require('./data-access/samples/crud') ;
const { resolveFutureThenExit } = require('./output/handle-results') ;
const { textTableOutput } = require('./output/text-table-output') ;

// connect to redshift cluster
// const redshiftClient = redshift.from(
//   'host_dns',
//   5439,
//   'database_name',
//   'user_name',
//   'pwd'
// ) ;
const redshiftClient = redshift.from(
  'testrscluster.ctoywwwvr8fe.us-east-2.redshift.amazonaws.com',
  5439,
  'testrsdatabase',
  'adminmaster',
  'Test01923'
) ;
// => Future <e Redshift>



/*************************************************************************
SAMPLE 1: run a single query, output to a single text table
*************************************************************************/

// :: Redshift -> Future <e, Either <e, [Object]> >
const executeSelectAllSamples = executeSingleWithConnection(selectAllSamples) ;

// :: Either <e, [Object]=> -> Either <e, [Object]>
const textTableOutputToConsole  = textTableOutput(console.log) ;

const program1 = redshiftClient.
  chain(executeSelectAllSamples).
  map(textTableOutputToConsole) ;
// => Future <e, Either <e, [Object]> >

/*************************************************************************
SAMPLE 2: run multiple queries, and output each to an independent text table
*************************************************************************/

// :: Redshift -> Future <e, Either <e, [[Object]]> >
const executeMultipleSelectAllSamples = executeInSeriesWithConnection([
  selectAllSamples,
  selectAllSamples
]) ;

// :: Either <e, [[Object]]> -> Either <e, [[Object]]>
const textTableOutputToConsoleAllTables = map(textTableOutput(console.log))

const program2 = redshiftClient.
  chain(executeMultipleSelectAllSamples).
  map(textTableOutputToConsoleAllTables);
// => Future <e, Either <e, [[Object]]> >

/*************************************************************************
execute either sample (program1 or program2)
*************************************************************************/
resolveFutureThenExit(program1) ;
