import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;

const BOX_WIDTH = 200;
const FRIC = 0.98;


function sleep(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



export default function Index() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [xV, setXV] = useState(-100);
  const [yV, setYV] = useState(100);
  const GRAV = 2;
  const stylesheet = {
    position: 'relative',
    top: y,
    left: x,
    filter: `blur(${Math.sqrt(Math.abs(xV+yV)/5)}px)`
  } as any;

  function handleImpact(){

  }
  function fric(){
    setXV(prevXV => {return prevXV*FRIC});
    setYV(prevYV => {return prevYV*FRIC});
  }
  function move(){
    setX(prevX => {
      if(-SCREEN_WIDTH/2 > prevX+xV){
        setXV(prevXV => {return Math.abs(prevXV)});
        fric();
      }
      return Math.max(-SCREEN_WIDTH/2, prevX+xV);
    });
    setX(prevX => {
      if((SCREEN_WIDTH/2)-(BOX_WIDTH/2) <= prevX+xV){
        setXV(prevXV => {return -Math.abs(prevXV)});
        fric();
      }
      return Math.min((SCREEN_WIDTH/2)-(BOX_WIDTH/2), prevX+xV);
    });

    setY(prevY => {
      if(0 > prevY+yV){
        setYV(prevYV => {return Math.abs(prevYV)});
        fric();
      }
      return Math.max(0, prevY+yV);
    });
    setY(prevY => {
      if(SCREEN_HEIGHT-BOX_WIDTH <= prevY+yV){
        setYV(prevYV => {return -Math.abs(prevYV)});
        fric();
      }
      return Math.min(SCREEN_HEIGHT-BOX_WIDTH, prevY+yV);
    });
  }
  function accel(){
    setYV(prevYV => {return prevYV+GRAV});

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