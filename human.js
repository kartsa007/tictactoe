


function Human(name, tictactoe, view) {
  this.name = name
  this.tictactoe = tictactoe
  this.move = function() {
    let response
    do {
      //Move format: column,row
      let answer = view.askMove()      
      let values = answer.split(',')
      let column = +values[0]
      let row = +values[1]
      
      response = this.tictactoe.move(row, column, this.value)
      if (response.ok == false) {
        console.log(response.errMsg)
      }
      
    } while (response.ok == false)
    return response
  }
}

module.exports.Human = Human
