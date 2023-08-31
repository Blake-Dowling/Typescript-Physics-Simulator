import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Text from './text'
import { ob } from './ob'
import Ob from './ob'

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;

const BOX_WIDTH = 200;
const FRIC = 0.98;


// const mag = new ob();

// const obList: ob[] = [];
// obList.push(mag);

export default function Index() {
  const [obList, setObList] = useState<ob[]>([])
  useEffect(() => {
    setObList((prevObList) => {
      const newObList = [...prevObList]
      const newOb :ob = new ob();
      newObList.push(newOb);
      return newObList;
    });

  }, []);



  const GRAV = 20;

  function move(){
    console.log(JSON.stringify(obList))
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(const obj of newObList){
        if(obj.x + obj.xv < 0){
          obj.xv = Math.abs(obj.xv);
        }
        if(obj.x + obj.xv >= SCREEN_WIDTH){
          obj.xv = -Math.abs(obj.xv);
        }
        if(obj.y + obj.yv < 0){
          obj.yv = Math.abs(obj.yv);
        }
        if(obj.y + obj.yv >= SCREEN_HEIGHT){
          obj.yv = -Math.abs(obj.yv);
        }
        obj.x += obj.xv;
        obj.y += obj.yv;
    }
    return newObList;
    });

  }
  function grav(){
    
    setObList(prevObList => {
      
      const newObList = [...prevObList]
      for(const obj of newObList){
        obj.yv += GRAV;
    }

    return newObList;
    });
  }
  function accel(){
    // grav();
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(const obj of newObList){
        obj.xv += obj.xa;
        obj.yv += obj.ya;
    }
    return newObList;
    });

  }
  function tick(){
    grav();
    
    // accel();
    // move();

  }
  useEffect(() => {
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    move()
  }, [obList]);

  return (
    <div className="container">
      {JSON.stringify(obList)}
      {obList.map(obj => {return (
        <Ob obj={obj}/>
      )}
      )}
    </div>
  )
}

ReactDOM.render(<Index/>, document.getElementById('root'))