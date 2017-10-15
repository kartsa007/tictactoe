'use strict'

var square = require('./square.js')
var Position = require('./position.js').Position

function updateBoard() {
  console.log('I am not defined yet (updateBoard)')
}

function updateSquare() {
  console.log('I am not defined yet (updateSquare)')
}

function winOnDirection(currentPosition, direction, tictactoe) {
  let status = false
  let position = currentPosition
  let startPoint = Position.copy(position)
  let endPoint = Position.copy(position)
  let currentValue = Position.valueOfPosition(currentPosition, tictactoe.board)
  for (let len = 1; len <= tictactoe.toWin; len++) {
    position = Position.moveToDownDirection(position, direction)
    if (!Position.onBoard(position, tictactoe)) {
      break
    }
    if (!Position.sameColor(currentValue, position, tictactoe.board)) {
      break
    }
    startPoint = position
  }
  for (let len = 1; len <= tictactoe.toWin; len++) {
    position = Position.moveToUpDirection(position, direction)
    if (!Position.onBoard(position, tictactoe)) {
      break
    }
    if (!Position.sameColor(currentValue, position, tictactoe.board)) {
      break
    }
    endPoint = position
  }
  /* How many choices we have to check
     if checkCnt zero or negative none
 */
  let distance = Position.distance(startPoint, endPoint)
  
  return (distance + 1 >= tictactoe.toWin)
}

function winningPosition(row, column, tictactoe) {
  let result = false
  for (let direction of Position.directions) {
    let position = Position.create(row, column)
    result = winOnDirection(position, direction, tictactoe)
    if (result == true) {
      break
    }
  }
  return result
}

function TicTacToe(rows, columns, towin) {
  var board = []
  this.view = {
    'updateBoard': updateBoard,
    'updateSquare': updateSquare}
  
  this.rows = rows
  this.columns = columns
  this.totalCnt = rows * columns
  this.moveCnt = 0
  this.history = []
  this.toWin = towin
  this.total = 0  // Keep count of the position on the board
  for (let j = 0; j < rows; j++) {
    let row = []
    for (let i = 0; i < columns; i++) {
      row.push(new square.Square(this, j, i))
    }
    board.push(row)
  }
  this.board = board
  this.registerBoardUdate = function(func) {
    this.view.updateBoard = func
  }

  this.registerSquareUdate = function(func) {
    this.view.updateSquare = func
  }

  this.draw = function() {
    this.view.updateBoard(board)
  }
  
  this.move = function(row, column, value) {
    let response = {
      'ok': true,
      'value': value,
      'row': row,
      'column': column,
      'isWinningPosition': false}

    if (row >= this.rows) {
      response.ok = false
      response.errMsg = 'There is not  ' + row + ' rows in the board'
      return response
    }
    if (column >= this.columns) {
      response.ok = false
      response.errMsg = 'There is not  ' + column + ' columns in the board'
      return response
    }
    if (this.board[row][column].isEmpty()) {
      this.board[row][column].move(value)
      this.moveCnt++
      if (winningPosition(row, column, this)) {
        response.isWinningPosition = true
      } else if (this.moveCnt == this.totalCnt) {
        response.result = 'draw'
      }
      this.history.push(response)
    } else {
      response.ok = false
      response.errMsg = 'Not a free square'
    }
    return response
  }
  
  this.unMove = function() {
    let response = this.history[this.history.length - 1]
    this.board[response.row][response.column].move(0)
    this.history = this.history.splice(-1, 1)
  }
}

module.exports.TicTacToe = TicTacToe
