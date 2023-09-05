import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Text from './text'
import { ob, Dir } from './ob'
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
      // left wall
      // newObList.push(new ob(newObList.length, [0*SCREEN_WIDTH, .5*SCREEN_HEIGHT], [0, 0], [0, 0], 100000000, [SCREEN_WIDTH/4, SCREEN_HEIGHT/4]));
      // //bottom wall
      

      // newObList.push(new ob(newObList.length, [.5*SCREEN_WIDTH, 1*SCREEN_HEIGHT], [0, 0], [0, 0], 100000000, [SCREEN_WIDTH/4, SCREEN_HEIGHT/4]));
      // //right wall
      // newObList.push(new ob(newObList.length, [1.5*SCREEN_WIDTH, .5*SCREEN_HEIGHT], [0, 0], [0, 0], 100000000, [SCREEN_WIDTH/2, SCREEN_HEIGHT/2]));
      // //top wall
      newObList.push(new ob(newObList.length, [.5*SCREEN_WIDTH, 0*SCREEN_HEIGHT], [0, 0], [0, 0], 100000000, [SCREEN_WIDTH/2, SCREEN_HEIGHT/2]));
      
      
      newObList.push(new ob(newObList.length, [500, 500], [0, 0], [0, -10000], 1, [30, 30]));
      
      // newObList.push(new ob([500, 200], [0, 0], [0, -10000], 1, [30, 30]));


      return newObList;
    });
    // setMagList((prevObList) => {
    //   const newObList = [...prevObList]
    //   // newObList.push(new ob([300, 300]));
    //   return newObList;
    // });
  }, []);




//******************** Move ********************/
  function move(){
    //******************** Iterate Objects, Update Velocity and Position ********************/
    setObList(prevObList => {
      const newObList = [...prevObList]
      for(let i=0; i<newObList.length; i++){
        const obj = newObList[i];
        
        obj.collided = false;
        //******************** Check and Handle Bound Collision ********************/
        // obj.collided = obj.bounds(Dir.y, T, SCREEN_HEIGHT)
        //   || obj.bounds(Dir.y, T, 0)
        //   || obj.bounds(Dir.x, T, SCREEN_WIDTH)
        //   || obj.bounds(Dir.x, T, 0);
        //******************** Check and Handle Object Collision ********************/
        if(!obj.collided){

          for(let j=0; j<newObList.length; j++){

            if(j != i){
              const obj_other = newObList[j];
              
//               if(obj_other.collided === true){
// continue;
//               }
if(obj.id===1){break}
              let ttcd = obj.calcTD2(obj, obj_other)
              // if(obj.id === 1){
                let ttc = Math.min(...ttcd)
                console.log(obj.id, ttcd)
              // }

              // let col = true;
              // for(let k=0; k<ttcd.length; k++){
              //   if( (ttcd[k] >= T) ){
                  
              //     col = false;
              //   }
              //   else{
              //     console.log(ttc)

              //   }
              // }
              
              if(ttc < T){
                // console.log(col)
                // console.log(ttc)
                // let ttc = Math.min(...ttcd)
                obj.move(ttc)
                obj.accl(ttc)
                obj_other.move(ttc)
                obj_other.accl(ttc)
                // console.log(":::",obj.pos)
                // console.log(":::",obj_other.pos)
                obj.collision(Dir.y, obj, obj_other)
                // console.log(obj.vel[1])
                obj.move(T-ttc)
                obj.accl(T-ttc)
                obj_other.move(T-ttc)
                obj_other.accl(T-ttc)
                obj.collided = true;
                obj_other.collided = true;

              }

            }
          }
        }
          //******************** Otherwise Simply Move ********************/
          if(!obj.collided){
            obj.move(T);
            obj.accl(T);
          }
          
      }
    return newObList;
    });
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