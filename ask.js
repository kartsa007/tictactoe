!function () {
  'use strict'
  
  let readline = require('readline-sync')

  function Ask(question, reExp, errMsg) {
    let success = false
    let value = ""
    do {
      value = readline.question(question)
      if (value.length) {
        if (reExp.test(value)) {
          success = true
        } else {
          console.log(errMsg)
        }
      } else {
        success = true
      }      
    } while (success !== true)
    return value
  }
  module.exports.ask = Ask
}()
