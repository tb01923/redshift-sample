const logError = console.error.bind(null, 'Future Error:') ;
const logSuccess  = console.log.bind(null, 'Future Success:') ;

// Run some function for side-effect (ignore result), then exit the process
// :: (x -> unit) -> unit
const beforeExit = f => x => {
  f(x) ;
  process.exit()
}

// :: ((a -> unit), (b -> unit)) -> Future -> _end_
const forkWith = (errorF, successF) => future =>
  future.fork(
    beforeExit(errorF),
    beforeExit(successF)
  );

// :: Future -> _end_
const resolveFutureThenExit = forkWith(
  logError,
  logSuccess
)

module.exports = Object.freeze({
  resolveFutureThenExit
})
