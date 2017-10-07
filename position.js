'use strict'

function valueOfPosition(position, board) {
  return board[position.row][position.column].getValue()
}

function squareOfPosition(position, board) {
  return board[position.row][position.column]
}

function onBoard(position, smart) {
  if (position.row < 0 || position.row >= smart.rows) {
    return false
  }
  if (position.column < 0 || position.column >= smart.columns) {
    return false
  }
  return true
}

function moveToUpDirection(position, direction, cnt) {
  if (typeof(cnt) == 'undefined') {
    cnt = 1
  }
  return {
    'row': position.row + direction.row * cnt,
    'column': position.column + direction.column*cnt}
}
function moveToDownDirection(position, direction, cnt) {
  if (typeof(cnt) == 'undefined') {
    cnt = 1
  }
  return {
    'row': position.row - direction.row * cnt,
    'column': position.column - direction.column * cnt}
}

function freeOrSameColor(myValue, position, board) {
  let value = valueOfPosition(position, board)
  return (myValue == value || value == 0)
}

function free(position, board) {
  return (valueOfPosition(position, board) == 0)
}

function sameColor(myValue, position, board) {
  let value = valueOfPosition(position, board)
  return (myValue == value)
  
}

function distance(pos1, pos2) {
  let rowDist = pos2.row - pos1.row
  let colDist =  pos2.column - pos1.column
  if (colDist) {
    return colDist
  } else {
    return rowDist
  }
}

let Position = {
  directions:  [
    { 'row': 1,
      'column': 0 },
    { 'row': 1,
      'column': 1 },
    { 'row': 0,
      'column': 1 },
    { 'row': -1,
      'column': 1 }
  ],
  onBoard: onBoard,
  moveToUpDirection: moveToUpDirection,
  moveToDownDirection: moveToDownDirection,
  valueOfPosition: valueOfPosition,
  freeOrSameColor: freeOrSameColor,
  free: free,
  sameColor: sameColor,
  squareOfPosition: squareOfPosition,
  
  create: function(row, column) {
    return {row: row, column: column}
  },
  copy: function(position) {
    return {row: position.row, column: position.column}
  },
  distance: distance
}

module.exports.Position = Position
