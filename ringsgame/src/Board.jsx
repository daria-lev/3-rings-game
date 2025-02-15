import { useState } from 'react'
import Tile from './Tile'

function Board(props) {

  function createBoard() {
    let output = []
    for (let i = 0; i < props.board.length; i++) {
      let row = []
      for (let j = 0; j < props.board[0].length; j++) {
        if (props.board[i][j] === null) {
          row.push(<button className='unusable'></button>)
        } else {
          row.push(<Tile type={'board'} ring={props.board[i][j]} clicked={props.clicked} id={[i,j]}></Tile>)
        }
      }
      output.push(<div>{row}</div>)
    }
    return output
  }

  return (
    <div>
      {createBoard()}
    </div>
  )
}

export default Board