import { useState } from 'react'
import Tile from './Tile'
import { useEffect } from 'react'

function Tray(props) {
  const colors = ["red", "blue", "green", "yellow", "purple"]
  const [rings, setRings] = useState([createRing(), createRing(), createRing()])
  const [selectedID, setID] = useState(null)
  

  //use effect, pass in selected, if it's all null AND selectedID isn't null then createRing at selectedID
  useEffect(() => {
    // console.log(props.clear)
    if (!props.clear && props.selected[0] == null && props.selected[1] == null && props.selected[2] == null 
        && selectedID != null) {
      let newRings = [...rings]
      newRings[selectedID] = createRing();
      setRings(newRings)
      setID(null)
    }
  }, [props.clear, props.selected, selectedID]);
  

  function tileClicked(ring, id) {
    props.click(ring, id)
    setID(id)
  }
  
  function createRing() {
    // const vals = [randint(0,2), randint(0,2), randint(0,2)]
    // let ring = [null, null, null]
    // for (let i = 0; i < 3; i++) {
    //   ring[vals[i]] = colors[randint(0, colors.length-1)]
    // }
    //temp
    let ring = [colors[randint(0, colors.length-1)], null, null]
    return ring
    // let newRings = [...rings]
    // newRings[selectedID] = ring
    // setRings(newRings)
  }

  function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <div>
      <Tile id={0} ring={rings[0]} type={"tray"} clicked={tileClicked}></Tile>
      <Tile id={1} ring={rings[1]} type={"tray"} clicked={tileClicked}></Tile>
      <Tile id={2} ring={rings[2]} type={"tray"} clicked={tileClicked}></Tile>
    </div>
  );
}

export default Tray