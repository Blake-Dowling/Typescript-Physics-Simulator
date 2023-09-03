import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Text from './text'
import { ob } from './ob'
import Ob from './ob'
import { time } from 'console'

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;
const T = .01;

//******************** Index Component Difinition ********************/
export default function Index() {
  const [obList, setObList] = useState<ob[]>([]);
  const [magList, setMagList] = useState<ob[]>([]);
  //******************** Initialize Object List States ********************/
  useEffect(() => {
    setObList((prevObList) => {
      const newObList = [...prevObList]
      newObList.push(new ob(500, 500));
      // newObList.push(new ob(500, 500));
      return newObList;
    });
    setMagList((prevObList) => {
      const newObList = [...prevObList]
      newObList.push(new ob(300, 300));
      return newObList;
    });
  }, []);




//******************** Move ********************/
  function move(){
    //******************** Iterate Objects, Update Velocity and Position ********************/
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(const obj of newObList){
        //******************** Check and Handle Collision ********************/
        if(!boundsY(obj, T, SCREEN_HEIGHT)
          && !boundsY(obj, T, 0)
          && !boundsX(obj, T, SCREEN_WIDTH)
          && !boundsX(obj, T, 0)
          ){
          //******************** Otherwise Simply Move ********************/
          obj.move(T);
          obj.accl(T);
        }
      }
    return newObList;
    });
  }
  //******************** Check and Handle Collision ********************/
  function boundsX(obj: ob, T: number, bound: number){
    const time_until_collision = obj.calcTDX(bound - obj.x);
    console.log(time_until_collision)
    if(Number.isNaN(time_until_collision)){
      return false;
    }
    if(time_until_collision < T){
      
      obj.move(time_until_collision)
      obj.accl(time_until_collision)
      obj.xv = -obj.xv
      obj.move(T - time_until_collision)
      obj.accl(T - time_until_collision)
      return true;
    }
    return false;
  }
  function boundsY(obj: ob, T: number, bound: number){
    const time_until_collision = obj.calcTDY(bound - obj.y);
    console.log(time_until_collision)
    if(Number.isNaN(time_until_collision)){
      return false;
    }
    if(time_until_collision < T){
      
      obj.move(time_until_collision)
      obj.accl(time_until_collision)
      obj.yv = -obj.yv
      obj.move(T - time_until_collision)
      obj.accl(T - time_until_collision)
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

  //******************** Event Loop ********************/
  function tick(){
    // mag();

    move();

  }
  //******************** Start an interval to iterate an event frame once per 'T' period ********************/
  useEffect(() => {
    const interval = setInterval(tick, T*10000);
    return () => clearInterval(interval);
  }, []);


//******************** Index Component Rendering ********************/
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