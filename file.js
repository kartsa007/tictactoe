'use strict'
const fs = require('fs')
const fname = './TicTacToeResults'

function SaveToFile() {
  this.getResults = function() {
    if (!fs.existsSync(fname)) {
      return {}
    }
    return JSON.parse(fs.readFileSync(fname))
  }
  
  this.saveResults = function(results) {
    fs.writeFileSync(fname, JSON.stringify(results))
  }
  
  this.getResult = function(player) {
    let results = this.getResults()
    if (results.hasOwnProperty(player)) {
      return results[player]
    } else {
      return {}
    }
  }
}

module.exports.Db = SaveToFile
