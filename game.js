'use strict'
var Stopwatch = require("node-stopwatch").Stopwatch
let ask = require('./ask.js').ask
let TicTacToe = require('./tictactoe.js').TicTacToe
let view = require('./view.js').view
let Human = require('./human.js').Human
let Computer = require('./computer.js').Computer

const reSize = new RegExp('^[0-9]{1,2},[0-9]{1,2}$')
const reToWin = new RegExp('^[3-5]$')
const MaxRows = 30
const MaxCols = 30

function askPlayerName() {
  return ask('What Is Your Name (computer for computer): ', /.*/, '')
}

function askBoardSize() {
  return ask(
    'Give board size (columns,rows)',
    reSize,
    'Check your input format, it is not right')
 
}

function askToWin() {
  return ask(
    'Give winning straight length (3-5)',
    reToWin,
    '3 - 5')
 
}
function initGame() {
  let sizeOk = false
  let cols
  let rows
  do {
    let size = askBoardSize()
    let split = size.split(',')
    cols = +split[0]
    rows = +split[1]
    if (cols > MaxCols) {
      console.log('Column max is ' + MaxCols)
      continue
    }
    if (rows > MaxRows) {
      console.log('Column max is ' + MaxRows)
      continue
    }
    sizeOk = true
  } while (!sizeOk)
  this.toWin = +askToWin()
  this.name = []
  this.name[0] = askPlayerName()
  this.name[1] = askPlayerName()
  this.colCnt = cols
  this.rowCnt = rows
}

function Game() {

  this.init = initGame
  this.init()
  //this.colCnt = 5
  //this.rowCnt = 5
  //this.toWin = 3
  //this.name = []
  //this.name[0] = 'Kari'
  //this.name[1] = 'computer'
  
  this.tictactoe = new TicTacToe(this.colCnt, this.rowCnt, this.toWin)
  this.player = []
  this.stopwatch =[]
  for (let i = 0; i < 2; i++) {
    if (this.name[i] == 'computer') {
      this.player[i] = new Computer(this.tictactoe, './ai2.js')
    } else {
      this.player[i] = new Human(this.name[i], this.tictactoe, view)
    }
    this.stopwatch[i] = Stopwatch.create() 
  }

  this.tictactoe.registerBoardUdate(view.drawBoard)
  this.tictactoe.registerSquareUdate(view.drawSquare)
  //
  // Draw first move maker
  //
  let index = Math.floor(Math.random() * 2)
  this.player[index].value = 1
  this.player[(index + 1) % 2].value = -1


  this.play = function() {
    if (this.player[index] instanceof  Human) {
      this.tictactoe.draw()
      console.log('You may start')
    }

    let response
    do {
      this.stopwatch[index].start()
      response = this.player[index].move()
      this.stopwatch[index].stop()
      if (response.isWinningPosition) {
        console.log('Game End')
        break
      }
      if (typeof response.result != 'undefined' &&
        response.result == 'draw') {
        console.log('Game End')
        break
      }

      index = (index + 1) % 2
      //console.log(response)
    } while(response.ok == true)
    delete(response.ok)
    delete(response.winninPosition)
    response.player = this.player[index].name
    response.time = this.stopwatch[index].elapsedMilliseconds
    response.columns = this.colCnt
    response.rows = this.rowCnt
    response.straightToWin = this.toWin
    return response
  }
}

module.exports.Game = Game
