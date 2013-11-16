# search-context

Show where a query matches a document.

# example

``` js
var context = require('search-context')
var fs = require('fs')
var README = fs.readFileSync(__dirname + '/README.md', 'utf-8')
console.log(
  context(README, ['query', 'document', 'search'], 80)
)

```

## output

`search-context` finds the tightest occurance of the terms in the query.
If the terms are far apart, the context around each term is displayed
with ... joining them.

## License

MIT
