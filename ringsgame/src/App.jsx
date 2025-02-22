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
  const directions = [[-1,-1], [-1,0], [-1,1], [0,-1]] // these and reverse these

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
    if (curSelected[0] !== null || curSelected[1] !== null || curSelected[2] !== null) { // change when three ring setup
      setSelected([null,null,null])
      let newBoard = [...board]
      newBoard[i][j] = curSelected
      // console.log("set board")
      let toClear = [] //check per non null color, set of colors checked? also check each ring individually
      let color = curSelected[0]
      let seenColors = []
      for (let ringNum = 0; ringNum < 3; ringNum++) {
        if (curSelected[ringNum] == null || seenColors.includes(curSelected[ringNum])) {continue}
        seenColors.push(curSelected[ringNum])
        let ringClears = processOneRing(i, j, curSelected[ringNum])
        for (let temp = 0; temp < ringClears.length; temp++) {
          toClear.push(ringClears[temp])
        }
        if (ringClears.length > 0) {
          for (let temp = 0; temp < 3; temp++) {
            if (curSelected[temp] === curSelected[ringNum]) {
              toClear.push([i,j,temp])
            }
          }
        }
      }
      
      let pts = 0
      for (let t = 0; t < toClear.length; t++) {
        let tile = toClear[t]
        let newTile = [...board[tile[0]][tile[1]]]
        newTile[tile[2]] = null
        newBoard[tile[0]][tile[1]] = newTile
        pts++
      }
      // if (toClear.length > 0) {
      //   newBoard[i][j] = [null,null,null]
      //   pts++
      // }
      setBoard(newBoard)
      setCount(pts+count)
      // check for points
    }
  }


  function processOneRing(i, j, color) {
    let toClear = []
    for (let d = 0; d < directions.length; d++) {
      let dir = directions[d]
      // console.log("dir " + dir[0], dir[1])
      let forwardOne = matchTile(i+dir[0], j+dir[1], color)
      if (forwardOne.length !== 0) {
        console.log("pos dir")
        let backOne = matchTile(i-dir[0], j-dir[1], color)
        if (backOne.length !== 0) {
          console.log("neg dir")
          for (let temp = 0; temp < forwardOne.length; temp++) {
            toClear.push([i+dir[0], j+dir[1], forwardOne[temp]])
          }
          for (let temp = 0; temp < backOne.length; temp++) {
            toClear.push([i-dir[0], j-dir[1], backOne[temp]])
          }
          let backTwo = matchTile(i-2*dir[0], j-2*dir[1], color)
          for (let temp = 0; temp < backTwo.length; temp++) {
            toClear.push([i-2*dir[0], j-2*dir[1], backTwo[temp]])
          }
          let forTwo = matchTile(i+2*dir[0], j+2*dir[1], color)
          for (let temp = 0; temp < forTwo.length; temp++) {
            toClear.push([i+2*dir[0], j+2*dir[1], forTwo[temp]])
          }
        } 
        else if (matchTile(i+2*dir[0], j+2*dir[1], color).length !== 0) {
          console.log("pos 2 dir")
          let forwardOne = matchTile(i+dir[0], j+dir[1], color)
          for (let temp = 0; temp < forwardOne.length; temp++) {
            toClear.push([i+dir[0], j+dir[1], forwardOne[temp]])
          }
          let forTwo = matchTile(i+2*dir[0], j+2*dir[1], color)
          for (let temp = 0; temp < forTwo.length; temp++) {
            toClear.push([i+2*dir[0], j+2*dir[1], forTwo[temp]])
          }
        }
      } else if (matchTile(i-dir[0], j-dir[1], color).length > 0 && matchTile(i-2*dir[0], j-2*dir[1], color).length > 0) {
        console.log("only neg dir")
        let backTwo = matchTile(i-2*dir[0], j-2*dir[1], color)
          for (let temp = 0; temp < backTwo.length; temp++) {
            toClear.push([i-2*dir[0], j-2*dir[1], backTwo[temp]])
          }
          let backOne = matchTile(i-dir[0], j-dir[1], color)
          for (let temp = 0; temp < backOne.length; temp++) {
            toClear.push([i-dir[0], j-dir[1], backOne[temp]])
          }
      }
    }
    return toClear
  }

  function matchTile(i, j, color) {
    let matchInds = []
    if (i >= board.length || j >= board[0].length || i < 0 || j < 0) {return matchInds}
    if (board[i][j] === null) {return matchInds}
    // console.log(i, j)
    // console.log(board[i][j])
    for (let ind = 0; ind < 3; ind++) {
      if (board[i][j][ind] === color) {matchInds.push(ind)}
    }
    return matchInds
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
    setCount(0)
    setSelected([null, null, null])
    //clearing = false
  }

  return (
    <>
    <div style={{textAlign: 'left'}}>
      <p>Points: {count}</p>
    </div>
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
