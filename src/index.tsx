import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;

const BOX_WIDTH = 100;


function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



export default function Index() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [xV, setXV] = useState(0);
  const [yV, setYV] = useState(10);
  const GRAV = 1;
  const stylesheet = {
    position: 'relative',
    top: y,
    left: x,
  } as any;


  function move(){
    setX(prevX => {return prevX+xV});
    console.log(yV)
    setY(prevY => {
      if(SCREEN_HEIGHT-BOX_WIDTH <= prevY+yV){
        setYV(prevYV => {return -Math.abs(prevYV)})
      }
      return prevY+yV;
    });
  }
  function accel(){
    setYV(prevYV => {console.log(prevYV);return prevYV+GRAV});

  }
  function loop(){
    accel();
      
    move();
  }
  useEffect(() => {
    const interval = setInterval(() =>{ move();accel();}, 10);
    return () => clearInterval(interval);
  }, [yV]);


  return (
    <div className="container">
      <div className="shape" style={stylesheet}>

      </div>
    </div>
  )
}

ReactDOM.render(<Index/>, document.getElementById('root'))