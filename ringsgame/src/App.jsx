import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tile from './Tile'
import Tray from './Tray'

function App() {
  const [count, setCount] = useState(0)
  const [board, setBoard] = useState(defaultBoard())
  const [curSelected, setSelected] = useState([null,null,null]) // biggest to smallest
  const [selectedID, setSelID] = useState(null)
  const [clear, setClear] = useState(false)

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

  function onTrayClick(ring, id) {
    setSelected(ring)
    setClear(false)
    //setSelID(id)
  }

  function onBoardClick(i, j) {
    //console.log(curSelected)
    setClear(false)
    if (curSelected[0] !== null || curSelected[1] !== null || curSelected[2] !== null) {
      setSelected([null,null,null])
      let newBoard = [...board]
      newBoard[i][j] = curSelected
      console.log("set board")
      setBoard(newBoard)
      // check for points
    }
  }

  function getPoints(points) {
    setCount(count + points)
  }

  function createBoard() {
    let output = []
    for (let i = 0; i < board.length; i++) {
      let row = []
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === null) {
          row.push(<button className='unusable'></button>)
        } else {
          row.push(<Tile type={'board'} ring={board[i][j]} clicked={onBoardClick} id={[i,j]}></Tile>)
        }
      }
      output.push(<div key={i}>{row}</div>)
    }
    return output
  }

  function onClearClick() {
    setClear(true)
    setBoard(defaultBoard())
    setSelected([null, null, null])
    //clearing = false
  }

  return (
    <>
    <div className='parent'>
      <div className='boardBox'>
        {createBoard()}
      </div>
      <div className='selBox'>
        <p>Currently Selected</p>
        <Tile ring={curSelected}></Tile>
      </div>
      
    </div>
    <div className='trayBox'>
      <Tray click={onTrayClick} selected={curSelected} clear={clear}></Tray>
    </div>
    <button onClick={onClearClick}>Clear Board</button>
      
    </>
  )
}

export default App
