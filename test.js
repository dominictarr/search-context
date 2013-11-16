
var fs = require('fs')
var context = require('./')
console.log(
  context(fs.readFileSync(__dirname + '/index.js', 'utf-8'), process.argv.slice(2), 160)
)

