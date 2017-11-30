const { buildSelectMany, buildRaw } = require('../redshift-executer')
const sampleQueries = require('./sample')


// just to make the buildQuery more readable
const noQueryParameters = {} ;

// :: Redshift -> Future <e r>
const insertSomeSamples = buildRaw(
  sampleQueries.insertSome,
  noQueryParameters
) ;

// :: Redshift -> Future <e r>
const createSomeSamplesTable = buildRaw(
  sampleQueries.create,
  noQueryParameters
) ;

// :: Redshift -> Future <e r>
const selectAllSamples = buildSelectMany(
 sampleQueries.selectAll,
 noQueryParameters
) ;

module.exports = Object.freeze({
  insertSomeSamples,
  selectAllSamples
})
