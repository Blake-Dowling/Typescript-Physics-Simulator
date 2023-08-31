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
  const [obList, setObList] = useState<ob[]>([]);
  const [magList, setMagList] = useState<ob[]>([]);
  useEffect(() => {
    setObList((prevObList) => {
      const newObList = [...prevObList]
      newObList.push(new ob(200, 200));
      return newObList;
    });
    setMagList((prevObList) => {
      const newObList = [...prevObList]
      newObList.push(new ob(300, 300));
      return newObList;
    });

  }, []);


  const T = .001;


  function move(){
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(const obj of newObList){
        obj.move(T);
      }
    return newObList;
    });
  }
  function bounds(){
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(const obj of newObList){
        if(obj.x < 0){
          // obj.x = Math.max(0, obj.x);
          obj.xv = Math.abs(obj.xv);
        }
        if(obj.x >= SCREEN_WIDTH){
          // obj.x = Math.min(SCREEN_WIDTH, obj.x);
          obj.xv = -Math.abs(obj.xv);
        }
        if(obj.y < 0){
          // obj.y = Math.max(0, obj.y);
          obj.yv = Math.abs(obj.yv);
        }
        if(obj.y >= SCREEN_HEIGHT){
          const p = obj.y;
          // obj.y = Math.min(SCREEN_HEIGHT, obj.y);
          obj.yv = -Math.abs(obj.yv);
          console.log(p - obj.y);
        }  
    }
    return newObList;
    });

  }


    obList.map(ob => {
      magList.map(mag => {
        ob.calcMag(mag);
      });
    });

  
  function tick(){
    // mag();
    move();
    bounds();
    
    


  }
  useEffect(() => {
    const interval = setInterval(tick, T*10000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="container">
      {/* {JSON.stringify(obList)} */}
      {obList.map(obj => {return (
        <Ob obj={obj}/>
      )}
      )}
      {/* {JSON.stringify(obList)} */}
      {magList.map(obj => {return (
        <Ob obj={obj}/>
      )}
      )}
      
    </div>
  )
}

ReactDOM.render(<Index/>, document.getElementById('root'))