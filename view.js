'use strict'

let ask = require('./ask.js').ask
const reMove = new RegExp('^[0-9]{1,2},[0-9]{1,2}$')

var sprintf = require('sprintf-js').sprintf

function brdHdr(columns, offsetStr) {
  let str = ''
  if (columns >= 10) {
    str += offsetStr
    for (let i = 0; i < columns; i++) {
      str += ' '
      let result = Math.floor(i / 10)
      if (result) {
        str += result
      } else {
        str += ' '
      }
    }
    str += '\n'
  }
  str += offsetStr
  for (let i = 0; i < columns; i++) {
    str += ' ' + (i % 10)
  }
  str += '\n'
  return str
}

function hr(size) {
  let str = ''
  for (let i = 0; i < size; i++) {
    str += '--'
  }
  str += '-\n'
  return str
}

function hdata(row) {
  let str = ''
  for (let i = 0; i < row.length; i++) {
    str += '|' + row[i].print()
  }
  str += '|\n'
  return str
}

function drawBoard(board) {
  let rows = board.length
  let columns = board[0].length
  let offset = String(rows - 1).length
  let hrOffset = '  '.slice(0, offset)
  let str = brdHdr(columns, hrOffset)
  str += hrOffset + hr(columns)
  let format = '%' + offset + 'd'
  for (let i = 0; i < rows; i++) {
    str += sprintf(format, i) + hdata(board[i])
    str += hrOffset + hr(columns)
  }
  console.log(str)
  return str
}

function drawSquare(square) {
  if (square.value < 0) {
    return 'X'
  } else if (square.value > 0) {
    return 'O'
  }
  return ' '
}

function askMove(name) {
  return ask(
    `Your move ${name}(column,row): `,
    reMove,
    'Check your input format, it is not right')
}

let view = {
  drawBoard: drawBoard,
  drawSquare: drawSquare,
  askMove: askMove
}

module.exports.view = view
