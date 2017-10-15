'use strict'

function Computer(tictactoe, ai) {
  let Ai = require(ai).Ai
  this.tictactoe = tictactoe
  this.ai = new Ai(this)
  this.name = 'Computer'
  this.move = function() {
    let next = this.ai.move()
    //console.log('indeksit ' + next.row + ' ' + next.column)

    return this.tictactoe.move(next.row, next.column, this.value)
  }
}


module.exports.Computer = Computer
