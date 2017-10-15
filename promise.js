'use strict'

var Position = require('./position.js').Position

function hasSquareReference(promise) {
  let retval = false
  let board = promise.smart.board
  for (let i = 0; i < promise.smart.rows; i++) {
    for (let j = 0; j < promise.smart.columns; j++) {
      let promise2 = findPromiseOfType(board[i][j],
        promise.directionInd, promise.value)
      if (promise2 === promise) {
        return true
      }
    }
  }
  return retval
}

function dumpPromises() {
  for (let i = 0; i < this.promisesArray.length; i++) {
    let promises = this.promisesArray[i]
    let direction = Position.directions[i]
    console.log('Promises for direction ' +
      direction.row + ' ' + direction.column)
    for (let promise of promises) {
      console.log('row ' + promise.start.row + 
      ' column ' + promise.start.column +
      ' length ' + promise.length +
      ' value ' + promise.value +
      ' reference ' + hasSquareReference(promise))
    }
    console.log('--------------')
  }
}

function deletePromise(promise) {

  let arr = promise.promises.promisesArray[promise.directionInd]
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === promise) {
      arr.splice(i,1)
      break
    }
  }
  promise.updateLength(-1)
}

function squaresToTest() {
  let squareList = []

  for (let promises of  this.promisesArray) {
    for (let promise of promises) {
      let point = promise.start
      let length = promise.length
      for (let i = 0; i <= length; i++) {
        let square = promise.smart.board[point.row][point.column]
        if (square.isEmpty() && !squareList.includes(square)) {
          squareList.push(square)
        }
        point = Position.moveToUpDirection(point, promise.direction)
      }
    }
  }
  return squareList
}

function updatePromises(square) {
  for (let i = 0; i < Position.directions.length; i++) {
    let promise = createPromise(square, i)
    updatePromiseToSquares(promise)
  }
}

function updatePromiseToSquares(promise)
{
  let board = promise.smart.board
  let position = promise.start

  for (let i = 0; i <= promise.length; i++) {
    let newPromise = addPromiseToSquare(board[position.row][position.column], promise)
    position = Position.moveToUpDirection(position, newPromise.direction)
    // promise merge effect to counter
    let dist = Position.distance(promise.start, newPromise.start)
    if (dist < 0) {
      i -=dist
    } 
    promise = newPromise
  }
  return promise
}

function createPromise(square, directionInd) {
  let smart = square.smart
  let toWinLength = square.smart.toWinLength
  let direction = Position.directions[directionInd]
  let currentPosition = Position.create(square.row, square.column)
  let position = currentPosition
  let startPoint = currentPosition
  let endPoint = currentPosition
  let promise = null

  for (let len = 1; len < toWinLength; len++) {
    position = Position.moveToDownDirection(position, direction)
    if (!Position.onBoard(position, smart)) {
      break
    }
    if (!Position.free(position, smart.board)) {
      break
    }
    startPoint = position
  }
  position = currentPosition
  for (let len = 1; len < toWinLength; len++) {
    position = Position.moveToUpDirection(position, direction)
    if (!Position.onBoard(position, smart)) {
      break
    }
    if (!Position.free(position, smart.board)) {
      break
    }
    endPoint = position
  }
  let distance = Position.distance(startPoint, endPoint)
  promise = new Promise(startPoint, 
    distance, 
    directionInd, 
    smart, 
    square.value)
  return promise
}

function calculatePromiseStrength(promise) {
  let str = promiseToString(promise)
  /*
  console.log('calculate promise:' + str + ':')
  console.log(promise.start)
  console.log(promise.direction)
  console.log(promise.length)
  */
  if (str.length < promise.smart.toWinLength) {
    return 0
  }
  //  console.log('calculated str :' + str + ':')
  let strs = str.split(' ')
  //  console.log('splitted' + strs)
  let total = 0
  for (let item of strs) {
    total += Math.pow(item.length, 3)
    if (item.length == promise.smart.toWinLength) {
      total += 10000
    }
  }
  return total
}

function updatePromiseStrength(promise) {
  // Calculates new strength and updates smart total
  //  console.log('Strength before ' + promise.strength)
  let strength = calculatePromiseStrength(promise)
  promise.smart.strength += ((strength - promise.strength) * promise.value)    
  promise.strength = strength
  //console.log('Strength after ' + promise.strength)
}

function valueToChar(value) {
  if (value < 0) {
    return 'X'
  }
  if (value > 0) {
    return 'O'
  }
  return ' '
}

function promiseToString(promise) {
  let board = promise.smart.board
  let position = promise.start
  let str = ''
  for (let i = 0; i <= promise.length; i++) { 
    str += valueToChar(board[position.row][position.column].value)
    position = Position.moveToUpDirection(position, promise.direction)
  }
  return str
}

function truePromise(promise) {
  return (promise.length >= (promise.smart.toWinLength - 1))
}

function findPromiseOfType(square, directionInd, value) {
  let promises = square.promises[directionInd]
  
  if (Array.isArray(promises)) {
    for (let promise of promises) {
      if (promise && promise.value == value) {
        return promise
      }
    }
  } else {
    if (promises.value == value) {
      return promises
    }
  }
  return null
}

function updatePromiseOfType(square, promise) {
  let promises = square.promises[promise.directionInd]
  let freeInd = -1

  /*
    console.log('updatePromiseOfType')
    console.log(square.row)
    console.log(square.column)
    console.log(promise.directionInd)
  */
  if (square.isEmpty() || !square.isEmpty()) {
    for (let i = 0; i < promises.length; i++) {
      if (promises[i]  == null) {
        if (freeInd < 0) {
          freeInd = i
        }
      } else  if (promises[i].value == promise.value) {
        // Update only if start point of new promise
        // Merge will later combine ovelapping
        // promises
        if (Position.distance(promises[i].start, promise.start) < 0) {
          promises[i] = promise
        }
        return
      }
    }
    promises[freeInd] = promise
  } else {
    square.promises[promise.directionInd] = promise
  }
  return
}

function clearPromiseOfType(square, promise) {
  let promises = square.promises[promise.directionInd]

  if (square.isEmpty() || !square.isEmpty()) {
    for (let i = 0; i < promises.length; i++) {
      //if (promises[i]  && promises[i].value == promise.value) {
      if (promises[i]) {
        if (promises[i] == promise) {
          promises[i] = null
          return
        } else {
          if (promises[i].value == promise.value) {
            // console.log('Tried to destroy modified promise')
            return
          }
        }
      }
      else {
        square.promises[promise.directionInd] = [null, null]
      }
    }
  }
  return
}

function mergePromises(current, promise) {
  let dist =  Position.distance(current.start, promise.start)
  if (dist < 0) {
    promise.updateLength(current.length - dist)
    deletePromise(current)
    //console.log(promise)
    return promise
  }
  if (dist == 0) {
    if (promise.length > current.length) {
      current.updateLength(promise.length)
    } else {
      updatePromiseStrength(current)
    }
    deletePromise(promise)
    return current
  }
  
  if (dist > 0) {
    if (promise.length + dist > current.length) {
      current.updateLength(promise.length + dist)
    } else {
      updatePromiseStrength(current)
    }
    deletePromise(promise)
    //console.log(current)
    return current
  }
}

function splitPromise(promise, position) {
  let board = promise.smart.board
  let str = promiseToString(promise)
  let value = board[position.row][position.column].getValue()
  let charAt = valueToChar(value)

  let parts = str.split(charAt)
  charAt = valueToChar(-value)
  
  let ind0 = parts[0].indexOf(charAt)
  let ind1 = parts[1].indexOf(charAt)
  let point = Position.moveToUpDirection(promise.start,
    promise.direction,
    parts[0].length + 1)
  if (ind0 >= 0 && ind1 >= 0) {
    // Both splitted parts stays alive (contains our mark)
    promise.updateLength(parts[0].length - 1)
    new Promise(point, 
      parts[1].length - 1,
      promise.directionInd, 
      promise.smart, 
      promise.value)
    return
  }
  if (ind1 < 0) {
    promise.updateLength(parts[0].length - 1)
    // And we are ready with the slit
    return
  }
  if (ind0 < 0) {
    // Start of promise moves part.length
    promise.updateStart(point)
  }
}

function addPromiseToSquare(square, promise) {
  /* Square with value can have only one Promise
     for each direction
     and an empty square may have two Promises
     per direction
  */
  if (square.hasOwnProperty('promises') == false) {
    square.promises = [
      [null, null],
      [null, null],
      [null, null],
      [null, null]
    ]
  }

  if (square.getValue()) {    
    // Check of opponent's promises to update
    let opposite = findPromiseOfType(square, promise.directionInd, -promise.value)
    if (opposite) {
      splitPromise(opposite, {row: square.row, column: square.column})
    }
  }
  let current = findPromiseOfType(square, promise.directionInd, promise.value)
  if (current == null) {
    updatePromiseOfType(square, promise)
    return promise    
  }
  if (current === promise) { // Everything OK
    return promise
  }
  promise = mergePromises(current, promise)
  if (promise !== current) {
    updatePromiseOfType(square, promise)
  }
  return promise
}

function revertPromise(promise) {
  let str = promiseToString(promise)
  
  let splitted = str.split(valueToChar(promise.value))
  if (splitted.length == 1) {
    // This means that we can destroy the promise
    deletePromise(promise)
    return
  }

  let skipCnt = splitted[0].length - promise.smart.toWinLength + 1
  if (skipCnt > 0) {
    // Here we test the start part of the promise
    // Update start point according skip count
    promise.updateStart(Position.moveToUpDirection(
      promise.start,
      promise.direction,
      skipCnt))
    return
  }
  
  for (let i = 1; i < splitted.length - 1; i++) {
    let orgLen = promise.length

    // If match here,
    //  1) promise may split, then split and quit
    //  2) if not splitted then continue
    if (splitted[i].length > (promise.smart.toWinLength - 1)*2) {
      // Split promise
      // Update the original
      let soFar = 0
      let j
      for (j = 0; j < i; j++) {
        soFar += splitted[j].length + 1
      }
      soFar += promise.smart.toWinLength - 1
      promise.updateLength(soFar - 1)
      
      // And create a new from the other part of the split
      soFar = promise.smart.toWinLength - 1
      for (j = j + 1; j < splitted.length; j++) {
        soFar += splitted[j].length + 1        
      }
      
      // Using original length to count
      // new staring point
      let point = Position.moveToUpDirection(
        promise.start,
        promise.direction,
        orgLen - soFar + 1)
      new Promise(point, 
        soFar - 1, 
        promise.directionInd, 
        promise.smart, 
        promise.value)
      return
    } 
  }
  // If we come here then try to split from the end
  skipCnt = splitted.pop().length - promise.smart.toWinLength + 1
  if (skipCnt > 0) {
    promise.updateLength(promise.length - skipCnt)
  }
  // To be sure
  updatePromiseStrength(promise)
}

function revertPromises(square, value) {
  // This is used when unmove is done
  // and promise must be recounted

  // Check this square first
  for (let i = 0; i < Position.directions.length; i++) {
    let promises = square.promises[i]
    for (let i = 0; i < promises.length; i++) {
      if (promises[i]) {
        revertPromise(promises[i])
        // promises[i] = null
      }  
    }
  //  square.promises[i] = [null, null]
  }
  // And we must check also the neighborhood
  // and update found promises for opponent
  let checkLen = square.smart.toWinLength
  let directionInd = 0
  let smart = square.smart
  let board = smart.board
  for (let direction of Position.directions) {
    let position = Position.create(square.row, square.column)
    for (let i = 0; i < checkLen; i++) {
      position = Position.moveToDownDirection(position, direction)
      if (!Position.onBoard(position, smart)) {
        break
      }
      if (Position.sameColor(value, position, board)) {
        break
      }
      if (!Position.freeOrSameColor(value, position, board)) {
        let promise = createPromise(
          board[position.row][position.column],
          directionInd)
        updatePromiseToSquares(promise)
        break
      }
    }
    position = Position.create(square.row, square.column) 
    for (let i = 0; i < checkLen; i++) {
      position = Position.moveToUpDirection(position, direction)
      if (!Position.onBoard(position, smart)) {
        break
      }
      if (Position.sameColor(value, position, board)) {
        break
      }
      if (!Position.freeOrSameColor(value, position, board)) {
        let promise = createPromise(
          board[position.row][position.column],
          directionInd)
        updatePromiseToSquares(promise)
        break
      }
    }
    directionInd++    
  }
}

function Promise(start, length, directionInd, smart, value) {
  this.start = start
  this.length = length
  this.smart = smart
  this.value = value
  this.directionInd = directionInd
  this.direction = Position.directions[directionInd] 
  this.strength = calculatePromiseStrength(this)
  this.smart.strength += (this.strength * this.value)
  this.promises = smart.promises
  this.promises.promisesArray[this.directionInd].push(this)
  //  console.log('Promise create')
  //  console.log(start)
  // console.log(this.direction)
  let board = this.smart.board
  let point = this.start  
  for (let i = 0; i <= this.length; i++) {
    updatePromiseOfType(board[point.row][point.column], this)
    point = Position.moveToUpDirection(this.start, this.direction, i)
  }
  
  this.endPoint = () => {
    return Position.moveToUpDirection(
      this.start,
      this.direction,
      this.length + 1)
  }

  this.updateStart = (start) => {
    //let board = this.smart.board
    let distance = Position.distance(this.start, start)
    let point
    if (distance > 0) {
      point = this.start
      for (let i = 0; i < distance; i++) {
        clearPromiseOfType(board[point.row][point.column], this)
        point = Position.moveToUpDirection(point, this.direction)
      }
    } else {
      point = start
      for (let i = 0; i < -distance; i++) {
        updatePromiseOfType(board[point.row][point.column], this)
        point = Position.moveToUpDirection(point, this.direction)
      }
    }
    this.length -= distance
    this.start = start
    updatePromiseStrength(this)
  }

  this.updateLength = (length) => {
    //let board = this.smart.board
    let update = length - this.length
    let point
    if (update > 0) {
      point = this.endPoint()
      for (let i = 0; i < update; i++) {
        updatePromiseOfType(board[point.row][point.column], this)
        point = Position.moveToUpDirection(point, this.direction)
      }
      this.length = length
    } else {
      this.length = length
      point = this.endPoint()
      for (let i = 0; i < -update; i++) {
        clearPromiseOfType(board[point.row][point.column], this)
        point = Position.moveToUpDirection(point, this.direction)
      }
    }
    updatePromiseStrength(this)
  }
}

function Promises() {
  this.totalValue = 0 
  this.promisesArray= []
  for (let i = 0; i < Position.directions.length; i++) {
    this.promisesArray[i] = []
  }
  this.updatePromises = updatePromises,
  this.revertPromises = revertPromises,
  this.getPromiseArray = getArray,
  this.squaresToTest = squaresToTest,
  this.dumpPromises = dumpPromises
}

function getArray() {
  return promiseArray
}

/*
module.exports.Promises = {
  updatePromises: updatePromises,
  revertPromises: revertPromises,
  getPromiseArray: getArray,
  squaresToTest: squaresToTest,
  dumpPromises: dumpPromises
}
*/
module.exports.Promises = Promises
