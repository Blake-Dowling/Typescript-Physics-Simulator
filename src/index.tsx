import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Text from './text'
import { ob } from './ob'
import Ob from './ob'
import { time } from 'console'

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
      newObList.push(new ob(500, 500));
      return newObList;
    });
    setMagList((prevObList) => {
      const newObList = [...prevObList]
      newObList.push(new ob(300, 300));
      return newObList;
    });

  }, []);


  const T = .1;

  let ticks = 0;
  function move(){

//     500
// 570.511141929491
// 637.0981420390118
// 699.883527131691
// 759.8968960322061
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(const obj of newObList){
        // if(Math.abs(obj.yv) < 50){
        //   // console.log(obj.y)
        // }
        obj.accl(T);
        // console.log(obj.yv);
        if(!bounds(obj, T)){

          obj.move(T);
        }
        
      }
    return newObList;
    });
  }
  function bounds(obj: ob, T: number){
    // if(obj.x < 0){
    //   // obj.x = Math.max(0, obj.x);
    //   obj.xv = Math.abs(obj.xv);
    // }
    // if(obj.x >= SCREEN_WIDTH){
    //   // obj.x = Math.min(SCREEN_WIDTH, obj.x);
    //   obj.xv = -Math.abs(obj.xv);
    // }
    // if(obj.y < 0){
    //   // obj.y = Math.max(0, obj.y);
    //   obj.yv = Math.abs(obj.yv);
    // }
    const time_until_collision = Math.sqrt(2* (SCREEN_HEIGHT - obj.y) / obj.ya);//obj.calcTDY(SCREEN_HEIGHT - obj.y);


    console.log(time_until_collision)
    // console.log("td", time_until_collision)
    
    // console.log(time_until_collision)
    if(time_until_collision < T){
      obj.yv -= obj.ya*(T-time_until_collision)
      obj.move(time_until_collision);
      
      obj.yv += obj.ya*(T-time_until_collision)
      obj.yv = -Math.abs(obj.yv)

      obj.move(T - time_until_collision);


      return true;
    }

    return false;
  }
  // function bounds(){
  //   setObList(prevObList => {
  //     const newObList = [...prevObList]
  //     for(const obj of newObList){
  //       if(obj.x < 0){
  //         // obj.x = Math.max(0, obj.x);
  //         obj.xv = Math.abs(obj.xv);
  //       }
  //       if(obj.x >= SCREEN_WIDTH){
  //         // obj.x = Math.min(SCREEN_WIDTH, obj.x);
  //         obj.xv = -Math.abs(obj.xv);
  //       }
  //       if(obj.y < 0){
  //         // obj.y = Math.max(0, obj.y);
  //         obj.yv = Math.abs(obj.yv);
  //       }
  //       if(obj.y >= SCREEN_HEIGHT){
  //         const p = obj.y;
  //         // obj.y = Math.min(SCREEN_HEIGHT, obj.y);
  //         obj.yv = -Math.abs(obj.yv);
  //         // console.log(p - obj.y);
  //       }  
  //   }
  //   return newObList;
  //   });

  // }


    obList.map(ob => {
      magList.map(mag => {
        // ob.calcMag(mag);
        // ob.obCol(mag);
      });
    });

  
  function tick(){
    // mag();

    move();

    
    


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