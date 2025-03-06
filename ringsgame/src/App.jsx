import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tile from './Tile'
import Tray from './Tray'

function App() {
  const [count, setCount] = useState(0)
  const [board, setBoard] = useState(defaultBoard())
  const [curSelected, setSelected] = useState([null,null,null]) // biggest to smallest
  const [timer, setTime] = useState(-1)
  const [clear, setClear] = useState(false)
  const [bestScores, setBest] = useState([])
  const directions = [[-1,-1], [-1,0], [-1,1], [0,-1]] // these and reverse these

  useEffect(() => {
      // console.log(props.clear)
      if (timer === 0) {
        updateBest()
        console.log(bestScores)
      } else if (timer > 0) {
        let countdown = setInterval(() => {
          setTime(timer-1)
        }, 1000);
    
        return () => {clearInterval(countdown)}
      }
    }, [timer]);

  function updateBest() {
    let newBest = [...bestScores]
    newBest.push(count)
    newBest.sort((a,b)=>b-a)
    if (bestScores.length > 5) {
      newBest = newBest.slice(0, 5)
    } 
    setBest(newBest)
  }

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
    if (curSelected[0] !== null || curSelected[1] !== null || curSelected[2] !== null) { //checks that selected act has ring
      for (let temp = 0; temp < 3; temp++) {
        if (curSelected[temp] !== null && board[i][j][temp] !== null) {return}
      }
      setSelected([null,null,null])
      let newRing = [...board[i][j]]
      for (let temp = 0; temp < 3; temp++) {
        if (curSelected[temp] !== null) {newRing[temp] = curSelected[temp]}
      }
      let newBoard = [...board]
      newBoard[i][j] = newRing
      // also need to check for 3x in one spot
      let toClear = [] 
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
        //console.log("pos dir")
        let backOne = matchTile(i-dir[0], j-dir[1], color)
        if (backOne.length !== 0) {
          //console.log("neg dir")
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
          //console.log("pos 2 dir")
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
        //console.log("only neg dir")
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
          row.push(<Tile type={'board'} ring={board[i][j]} clicked={onBoardClick} id={[i,j]} time={timer}></Tile>)
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

  function onTimedClick() {
    setTime(60)
    onClearClick()
  }

  function onFreeClick() {
    setTime(-1)
    onClearClick()
  }

  function showTime() {
    if (timer === -1) {
      return <p>Freeplay Mode</p>
    } else {
      return <p>Time Remaining: {timer}</p>
    }
  }

  function showBest() {
    const listItems = bestScores.map(score => <li>{score}</li>)
    return (<div>
      <p>Best Scores</p>
      <ol>{listItems.slice(0,5)}</ol>
    </div>)
  }

  return (
    <>
    <div style={{textAlign: 'left'}}>
      {showTime()}
      <p>Points: {count}</p>
    </div>
    <div className='parent'>
      <div className='bestBox'>
        {showBest()}
      </div>
      <div className='boardBox'>
        {createBoard()}
      </div>
      <div className='selBox'>
        <p>Currently Selected</p>
        <Tile ring={curSelected}></Tile>
      </div>
      
    </div>
    <div className='trayBox'>
      <Tray click={onTrayClick} selected={curSelected} clear={clear} time={timer}></Tray>
    </div>
    <div>
      <button style={{marginTop: '15px'}} onClick={onClearClick}>Clear Board</button>
      <button style={{marginTop: '15px', marginLeft:'15px'}} onClick={onTimedClick}>Timed</button>
      <button style={{marginTop: '15px', marginLeft:'15px'}} onClick={onFreeClick}>Freeplay</button>
    </div>
    
      
    </>
  )
}

export default App
