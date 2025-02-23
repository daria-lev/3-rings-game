import { useState } from 'react'
import ringImg from './assets/ring2.png' 

function Tile(props) {
  // const colorVals = new Map()
  // colorVals.set("red", 0)
  // colorVals.set("blue", 100)
  // colorVals.set("green", 100)
  // colorVals.set("yellow", 100)
  // colorVals.set("purple", 100)
  // colorVals.set(null, 0)
  let oClass = props.ring[0] === null ? 'none' : props.ring[0]
  let outerRing = 'outer ring ' + oClass
  let mClass = props.ring[1] === null ? 'none' : props.ring[1];
  let midRing = 'mid ring ' + mClass
  let iClass = props.ring[2] === null ? 'none' : props.ring[2];
  let inRing = "inner ring " + iClass;

  function onTileClick() {
    if (props.type === "tray") {
      props.clicked(props.ring, props.id)
    } else {
      props.clicked(props.id[0], props.id[1])
    }
  }

  return(
    <button style={{backgroundColor: 'lightgray'}} 
    className='empty ringBox' onClick={onTileClick}>
      {/* <div className='ringBox'> */}
        <img className={outerRing} src={ringImg}></img>
        <img className={midRing} src={ringImg}></img>
        <img className={inRing} src={ringImg}></img>
      {/* </div> */}
    </button>
  )
}

export default Tile