import { useState } from 'react'

function Tile(props) {

  function onTileClick() {
    if (props.type === "tray") {
      props.clicked(props.ring, props.id)
    } else {
      if (props.ring[0] === null && props.ring[1] === null && props.ring[2] === null) {
        props.clicked(props.id[0], props.id[1])
      }
    }
  }

  return(
    <button style={{backgroundColor: props.ring[0] === null ? 'lightgray' : props.ring[0]}} 
    className='empty' onClick={onTileClick}></button>
  )
}

export default Tile