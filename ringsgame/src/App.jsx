import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tile from './Tile'
import Board from './Board'
import Tray from './Tray'

function App() {
  const [count, setCount] = useState(0)
  const [board, setBoard] = useState(defaultBoard())
  const [curSelected, setSelected] = useState([null,null,null]) // biggest to smallest

  function defaultBoard() {
    let b = []
    let empties = [2, 1, 0, 1, 2]
    for (let i = 0; i < 5; i++) {
      let row = []
      for (let j = 0; j < empties[i]; j++) {
        row.push(null)
      }
      for (let j = 0; j < 5 - empties[i]*2; j++) {
        row.push([null, null, null])
      }
      for (let j = 0; j < empties[i]; j++) {
        row.push(null)
      }
      b.push(row)
    }
    return b
  }

  function onTrayClick(ring) {
    setSelected(ring)
  }

  function onBoardClick(i, j) {
    setSelected([null,null,null])
    let newBoard = [...board]
    newBoard[i][j] = curSelected
    setBoard(newBoard)
  }

  function getPoints(points) {
    setCount(count + points)
  }


  return (
    <>
      <div>
        <Board click={onBoardClick} board={board}></Board>
      </div>
      <div>
        <p>Currently Selected off to the side</p>
        <Tile ring={curSelected}></Tile>
      </div>
      <div>
        <Tray click={onTrayClick}></Tray>
      </div>
    </>
  )
}

export default App
