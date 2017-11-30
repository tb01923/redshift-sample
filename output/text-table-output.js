const {create, env} = require('sanctuary');
const {map, curry3} = create({checkTypes: false, env: env});

// :: String -> String -> (String -> b) -> b
const handleRow = curry3((x, y, sideEffect) => sideEffect('' + x + '\t' + y)) ;

// :: (String -> b) -> b
const handleHeaders = handleRow('id', 'description') ;

// ::  (String -> b) -> [Object] -> unit
const handleArray = sideEffect => map(x =>
  handleRow(x.sampleid, x.description, sideEffect)
)

// :: (a -> b) -> Either <_, [Object]> -> unit
const handleRight = sideEffect => map(arr => {
  handleHeaders(sideEffect);
  handleArray(sideEffect)(arr);
  return arr
}) ;

const textTableOutput = handleRight

module.exports = Object.freeze({
   textTableOutput
})
