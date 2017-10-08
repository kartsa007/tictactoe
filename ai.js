'use strict'

function Ai(computer) {

  this.tictactoe = computer.tictactoe
  this.move = function() {
    let rowInd
    let colInd
    let index = Math.floor(Math.random() *
                           (this.tictactoe.totalCnt - this.tictactoe.moveCnt))
    index++
    rowInd = 0
    for (let row of this.tictactoe.board) {
      colInd = 0
      for (let column of row) {
        if (column.isEmpty()) {
          index--
        }
        if (index == 0) {
          break
        }
        colInd++
      }
      if (index == 0) {
        break
      }
      rowInd++
    }
    return {row: rowInd,
            column: colInd}
  }
}

module.exports.Ai = Ai
