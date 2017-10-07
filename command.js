'use strict'
let ask = require('./ask.js').ask
let Game = require('./game').Game
let ResultDb= new require('./results.js').Results
let resultDb = new ResultDb('./file.js')

function results() {
  let list = resultDb.getResults()
  console.log('Best results so far:')
  console.log('')
  for (let result of list) {
    for (let key in result) {
      console.log(key + ':' + result[key]) 
    }
    console.log('')
  }
}


function Command() {
  var commands = {
    'play': 'play',
    'save': 'save',
    'results': 'results',
    'quit': 'exit',
    'exit': 'exit'
  }
  var gameResult
  
  this.help = function() {
    console.log('Possible command are:')
    for (let key in commands) {
      console.log(key)
    }
  }
  this.run = function() {
    let quit = false
    //this.play()
    do {
      let input = ask('What we do next: ', /.*/)
      if (commands.hasOwnProperty(input)) {
        let result = this[commands[input]]()
        if (input == 'play') {
          gameResult = result
          console.log(result)
        }
      } else {
        this.help()
      }
    } while(quit == false)
  }
  this.save = () => {
    if (typeof(gameResult) === 'object') {
      resultDb.save(gameResult)
    } 
  }
  this.play = () => {
    let game = new Game()
    return game.play()
  }
  this.results = () => {
    results()
  }
  
  this.exit = () => {
    process.exit(0)
  }
}

module.exports.Command = Command

