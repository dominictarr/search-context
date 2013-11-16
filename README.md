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

## License

MIT
