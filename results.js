'use strict'

function Results(storage) {
  let Db = new require(storage).Db
  let db = new Db()  
  this.save = function (result) {
    let results = db.getResults()
    if (typeof results[result.player] == 'undefined') {
      results[result.player] = result
      db.saveResults(results)
    } else {
      if (result.time < results[result.player].time) {
        results[result.player] = result
        db.saveResults(results)
      }
    }
  }
  
  this.getResults = function() {
    let results = Object.values(db.getResults())
    results = results.sort(function(a, b) {a.time - b.time})
    return results
  }

}

module.exports.Results = Results
