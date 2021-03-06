import React, { useState, useEffect } from 'react'
import ScoreBoard from './components/ScoreBoard'
import sergia from './images/sergia-min.jpg'
import spidy from './images/spiderman-min.jpg'
import sazamtro from './images/wtmln.png'
import billgates from './images/bill-gates-min.png'
import banana from './images/banana-min.png'
import kuchnawlavi from './images/kuchnawlavi-min.jpg'
import nothing from './images/white.jpg'
import sergiasSound from './sounds/sergias-sound.wav'
import success from './sounds/success.wav'

const width = 8;

const candyColors = [
  sergia, kuchnawlavi, 
  billgates, spidy, 
  banana, sazamtro
]

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([])
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0);
  let sergiasAudio = new Audio(sergiasSound)
  let successAudio = new Audio(success)

  // check for columns
  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, , i + (width * 2), i + (width * 3)]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === nothing

      if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(score => score + 4)
        columnOfFour.forEach(square => currentColorArrangement[square] = nothing)
        return true
      }
    }
  }

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + (width * 2)]
      const decidedColor = currentColorArrangement[i]
      const isBlank = currentColorArrangement[i] === nothing

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(score => score + 3)
        columnOfThree.forEach(square => currentColorArrangement[square] = nothing)
        return true
      }
    }
  }

  // check for rows
  const checkForRowOfFour = () => {
    for (let i = 0; i <= 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3]
      const decidedColor = currentColorArrangement[i]
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
      const isBlank = currentColorArrangement[i] === nothing

      if (notValid.includes(i)) continue

      if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(score => score + 4)
        rowOfFour.forEach(square => currentColorArrangement[square] = nothing)
        return true
      }
    }
  }
  
  const checkForRowOfThree = () => {
    for (let i = 0; i <= 64; i++) {
      const rowOfThree = [i, i + 1, i + 2]
      const decidedColor = currentColorArrangement[i]
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
      const isBlank = currentColorArrangement[i] === nothing

      if (notValid.includes(i)) continue

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        setScoreDisplay(score => score + 3)
        rowOfThree.forEach(square => currentColorArrangement[square] = nothing)
        return true
      }
    }
  }

  // moving functions
  const moveIntoSquareBelow = () => {
    for (let i = 0; i < 56; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArrangement[i] === nothing) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArrangement[i] = candyColors[randomNumber]
      }

      if (currentColorArrangement[i + width] === nothing) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = nothing
      }
    }
  }

  const dragStart = (e) => {
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = (e) => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
    currentColorArrangement[squareBeingDraggedId] =squareBeingReplaced.getAttribute('src')

    const validMoves = [
      squareBeingDraggedId - 1, squareBeingDraggedId - width, 
      squareBeingDraggedId + 1, squareBeingDraggedId + width
    ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isColOfFour = checkForColumnOfFour()
    const isRowOfFour = checkForRowOfFour()
    const isColOfThree = checkForColumnOfThree()
    const isRowOfThree = checkForRowOfThree()

    if (squareBeingReplacedId &&
        validMove &&
        (isRowOfThree || isRowOfFour || isColOfFour || isColOfThree)
    ) {
        setSquareBeingDragged(null)
        setSquareBeingReplaced(null)
        squareBeingDragged.getAttribute('src') === sergia ? sergiasAudio.play() : (() => {sergiasAudio.pause(); successAudio.play()})()
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
      setCurrentColorArrangement([...currentColorArrangement])
    }
  }


  // random items 64 times
  const createBoard = () => {
    const randomColorArrangement = []

    for (let i = 0; i < 64; i++) {
      let randNum = Math.floor(Math.random() * candyColors.length)
      const randomColor = candyColors[randNum]

      randomColorArrangement.push(randomColor)
    }

    setCurrentColorArrangement(randomColorArrangement)
  }

  useEffect(() => {
    createBoard()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour()
      checkForRowOfFour()

      checkForColumnOfThree()
      checkForRowOfThree()

      moveIntoSquareBelow()

      setCurrentColorArrangement([...currentColorArrangement])
    }, 50)
    return () => clearInterval(timer) 
  }, [
    checkForColumnOfFour, checkForRowOfFour,
    checkForColumnOfThree, checkForRowOfThree,
    moveIntoSquareBelow, currentColorArrangement
  ])


  return (
    <div className="app">
      <div className="game">
        {
          currentColorArrangement.map((candyColor, index) => (
            <img 
              key={index}
              data-id={index}
              style={{ backgroundColor: candyColor }}
              src={candyColor}
              alt={candyColor}
              draggable={true}
              onDragStart={dragStart}
              onDragOver={e => e.preventDefault()}
              onDragEnter={e => e.preventDefault()}
              onDragLeave={e => e.preventDefault()}
              onDrop={dragDrop}
              onDragEnd={dragEnd}
            />
          ))
        }
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  )
}

export default App
