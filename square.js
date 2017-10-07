'use strict'

let square = {
  Square: function(board, row, column) {
    this.value = 0
    this.board = board
    this.row = row
    this.column = column
    
    this.getValue = function() {
      return this.value
    }
    this.setValue = function(newValue) {
      this.value = newValue
      this.update()
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
      this.board.view.updateBoard(this.board.board)
    }
  }
}


module.exports = square
