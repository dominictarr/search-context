var indexes = require('indexes-of')
              require('colors')

function compare (a, b) {
  return a - b
}

function diff (a, b) {
  return a < b ? b - a : a - b
}

function closest (matches, target) {
  return min(matches, function (v, k) {
    return diff(v, target)
  })
}

// THOUGHTS: rank results by:
// * how tightly the terms are grouped.
// * how close a group is to the start.
// * how uncomon those terms are in the corpus,
//   but how common they are in the document...
//   (how surprising it is that document has those words)

function stddev(indexes) {
  var N = indexes.length
  var avg = indexes.reduce(function (a, b) {return a + b}, 0) / N
  return Math.sqrt(indexes.reduce(function (v, e) {
    return v + Math.pow(e - avg, 2)
  }, 0) / N)
}

function min(ary, test) {
  var M, best
  for(var i in ary) {
    var m = test(ary[i])
    if(M == null || m < M)
      M = m, best = i
  }
  return best
}


function highlight (string, query, hi) {
  hi = hi || function (w) {
    return w.bold
  }
  return query.reduce(function (string, term) {
    return string.split(new RegExp(term, 'i')).join(hi(term))
  }, string)
}

function context (doc, _best, length, query) {
  
  if(!_best)
    return doc.substring(0, length)
  var best = _best.slice().sort()
  length = length || 80
  var f = best.shift()
  var l = best.pop() || f
  var w = l - f
  var s = f - (Math.max(length - w, 0)/2)
  if(w < length)
    return doc.substring(s, s + length)
  //how much space either side
  var dotdotdot = (query.length + 1) * 3
  var tl = (length - query.join('').length - dotdotdot) / (query.length * 2)

  return _best.map(function (q, i) {
    return doc.substring(q - tl, q + query[i].length + tl)
  }).join('...')

}


function bestGroup (doc, query) {
  var DOC = doc.toUpperCase()
  var QUERY = query.map(function (e) { return e.toUpperCase() })

  var matches = QUERY.map(function (q) { return indexes(DOC, q) })
  //find a close matching group.
  //for each match of the first term
  //find the best groups around that...
  var first = matches.shift()
  var groups = first.map(function (q, i) {
    return [q].concat(
      matches.filter(function (e) {
        return e.length
      }).map(function (list) {
        var l = closest(list, q)
        return list[l]
      })
    )
  })
  return groups[min(groups, stddev)]
}

module.exports = function (doc, query, length) {
  return highlight(
    context(doc, bestGroup(doc, query), length, query)
  , query)
}

