'use strict'

let Promises = require('./promise.js').Promises
let Ai = require('./ai.js').Ai

function Square(smart, row, column) {
  this.value = 0
  this.row = row
  this.column = column
  this.smart = smart
  this.promises = [
    [null, null],
    [null, null],
    [null, null],
    [null, null]
  ]

  this.getValue = function() {
    return this.value
  }
  this.setValue = function(newValue) {
    this.value = newValue
  }
  this.print = function() {
    if (this.value < 0) {
      return 'X'
    } else if (this.value > 0) {
      return 'O'
    }
    return ' '
  }

  this.isEmpty = function() {
    return (this.value == 0)
  }
  
  this.move = function(value) {
    this.value = value
    //console.log('move ' + this.row + this.column + this.value)
    this.smart.promises.updatePromises(this)
    //Promise.dumpPromises()
  }
  
  this.unMove = function() {
    let value = this.value
    this.value = 0
    //console.log('unMove ' + this.row + this.column + value)
    this.smart.promises.revertPromises(this, value)
    //Promise.dumpPromises()
  }

  this.promiseLess = function() {
    return (!this.hasOwnProperty('promises'))
  }
}


function findBest(value, depth) {

  if (depth == 0 || Math.abs(this.strength) > this.limit) {
    // console.log('Strength ' + this.strength)
    return {strength: this.strength}
  }

  let squares = this.promises.squaresToTest()
  if (squares.length == 0) {
    return this.dummy.move()
  }
  let bestStrength
  let best
  

  for (let square of squares) {
    let strength
    square.move(value)
    strength = this.findBest(-value, depth - 1).strength
    if (value > 0) {
      if (typeof(bestStrength) == 'undefined' ||
        strength > bestStrength) {
        bestStrength = strength
        best = square
        // console.log('Best set to ' + bestStrength)
      }
    } else {
      if (typeof(bestStrength) == 'undefined' ||
        strength < bestStrength) {
        bestStrength = strength
        best = square
        //console.log('Best set to ' + bestStrength)
      }
    }
    square.unMove()
  }
  //console.log('depth ' + depth)
  let retval = {
    column: best.column,
    row: best.row,
    strength: bestStrength
  } 
  //console.log(retval)
  return retval
}


function Smart(computer) {
  
  let board = []
  this.dummy = new Ai(computer)
  this.promises = new Promises()
  this.strength = 0
  this.board = board
  this.computer = computer
  this.columns = computer.tictactoe.columns
  this.rows = computer.tictactoe.rows
  this.toWinLength = computer.tictactoe.toWin
  this.linit = 1000
  for (let j = 0; j < this.rows; j++) {
    let row = []
    for (let i = 0; i < this.columns; i++) {
      row.push(new Square(this, j, i))
    }
    board.push(row)
  }

  this.tictactoe = computer.tictactoe
  this.name = 'Smart'
  this.move = function() {
    // Update opponents move to own board
    if (this.tictactoe.history.length) {
      // Update opponents last move to owm board 
      let lastMove = this.tictactoe.history[this.tictactoe.history.length - 1]
      board[lastMove.row][lastMove.column].move(lastMove.value)
    }
    let move = this.findBest(this.computer.value, 3)
    board[move.row][move.column].move(this.computer.value)
    console.log('Strength ' + this.strength)
    //Promise.dumpPromises()
    return move
  }
  this.findBest = findBest

}


module.exports.Ai = Smart
