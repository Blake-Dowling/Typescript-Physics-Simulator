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



let ticks = 0;
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


  const T = .01;
  ticks += T;




  function move(){
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(const obj of [newObList[0]]){

        obj.accl(T);
        if(!bounds(obj, T)){

          obj.move(T);
        }
        
      }

    return newObList;
    });
  }




  function bounds(obj: ob, T: number){

    let time_remaining = T;
    let time_until_collision = obj.calcTDY(SCREEN_HEIGHT - obj.y);


    // console.log(obj.calcDDY(time_until_collision))
    
    
    // console.log(time_until_collision)
    if(time_until_collision < T){

      while(time_until_collision > 0.0000001){
        console.log("td", time_until_collision)
        time_remaining -= time_until_collision;
        obj.yv -= obj.ya*(time_remaining)
        obj.move(time_until_collision)
        
        obj.accl(time_remaining)
        time_until_collision = obj.calcTDY(SCREEN_HEIGHT - obj.y);
      }

      obj.yv = -Math.abs(obj.yv)
      obj.yv += obj.ya*time_remaining
      obj.move(time_remaining);


      return true;
    }

    return false;
  }
  


    obList.map(ob => {
      magList.map(mag => {
        // ob.calcMag(mag);
        // ob.obCol(mag);
      });
    });

  
  function tick(){

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