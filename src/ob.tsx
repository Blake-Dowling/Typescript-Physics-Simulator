import React from 'react'

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;
export enum Dir{
  x, y
}
function round(x: number, places: number) : number{
  x = Math.round(x * (10 ** places));
  x = x / (10 ** places);
  return x;
}


export class ob{

    x: number;
    y: number;
    xv: number;
    yv: number;
    xa: number;
    ya: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.xa = 0;
        this.ya = 10000;
    }


    accl(t: number){

      this.xv += this.xa*t;
      this.yv += this.ya*t;
    }

    calcDDY(td: number){
      return ((0.5 * (this.ya * (td ** 2))) + (this.yv * td));
    }

    calcTD2(dir: Dir, obj1: ob, obj2: ob, dd: number){

      let d = 0;
      let v = 0;
      let a = 0;
      if(dir === Dir.x){
        d = obj2.x - obj1.x + dd;
        v = obj2.xv - obj1.xv;
        a = .001
      }
      else if(dir === Dir.y){
        d = obj2.y - obj1.y;
        v = obj2.yv - obj1.yv + dd;
        a = .001
      }
      
      else{
        return NaN;
      }

      let td = 0;
      // Positive direction
      let td_plus = (
        (-v - (
                                  Math.sqrt(
                                    (v**2) - (2*a * (d))
                                  )
                              ) 
        )                    
      / a
      )
      // Negative direction
      let td_minus = (
        (-v + (
                                  Math.sqrt(
                                    (v**2) - (2*a * (d))
                                  )
                              ) 
        )                    
      / a
      )

      // console.log(td_plus, td_minus)
        // Calculate minimum positive output
        td = td_plus >= 0 && td_minus < 0 ? td_plus :
              td_minus >= 0 && td_plus < 0 ? td_minus :
              td_plus >= 0 && td_minus >= 0 ? Math.min(td_plus, td_minus):
              Number.isNaN(td_plus) || Number.isNaN(td_minus) ? NaN :
              NaN;
      return td;
    }
    // Sideways trajectory projection - Calculates time at which 
    // Ob will be at passed distance delta. It uses the quadratic
    // formula to piece together the + and - results of the
    // inverse distance function, projecting forward in time (returns
    // the minimum positive output of the + and - curves, for the
    // given distance input). When the sign of the distance
    // is opposite to the velocity, the object will either
    // change direction due to acceleration (i.e. change output
    // curves) or never reach dd (td = infinity). Because we are
    // detecting collisions, however, simply using the minimum
    // positive result provides the correct output.
    calcTD(dir: Dir, pos: number){
      let dd = 0; 
      let d = 0;
      let v = 0;
      let a = 0;
      if(dir === Dir.x){
        dd = pos - this.x;
        d = this.x;
        v = this.xv;
        a = this.xa;
      }
      else if(dir === Dir.y){
        dd = pos - this.y;
        d = this.y;
        v = this.yv;
        a = this.ya;
      }
      else{
        return NaN;
      }
      let td = 0;
      // Positive direction
        let td_plus = (
          (-v - (
                                    Math.sqrt(
                                      (v**2) - (2*a * (-dd))
                                    )
                                ) 
          )                    
        / a
        )
      
      // Negative direction
        let td_minus = (
          (-v + (
                                    Math.sqrt(
                                      (v**2) - (2*a * (-dd))
                                    )
                                ) 
          )                    
        / a
        )
        // Calculate minimum positive output
        td = td_plus >= 0 && td_minus < 0 ? td_plus :
              td_minus >= 0 && td_plus < 0 ? td_minus :
              td_plus >= 0 && td_minus >= 0 ? Math.min(td_plus, td_minus):
              Number.isNaN(td_plus) || Number.isNaN(td_minus) ? NaN :
              0;
      return td;
    }

    //******************** Check and Handle Collision ********************/
  bounds(dir: Dir, T: number, bound: number){
    const time_until_collision = this.calcTD(dir, bound );
    // console.log(time_until_collision)
    if(Number.isNaN(time_until_collision)){
      return false;
    }
    if(time_until_collision < T){
      
      this.move(time_until_collision)
      this.accl(time_until_collision)
      if(dir === Dir.x){
        this.xv = -this.xv
      }
      else if(dir === Dir.y){
        this.yv = -this.yv
      }
      
      this.move(T - time_until_collision)
      this.accl(T - time_until_collision)
      return true;
    }
    return false;
  }

  
    move(t: number){
      this.x = (0.5 * (this.xa * (t ** 2))) + (this.xv * t) + this.x;
      this.y = (0.5 * (this.ya * (t ** 2))) + (this.yv * t) + this.y;
    }

    calcMag(mag: ob){
      //F = k * [(q1*q2)/r**2]
      try{
        this.xa = (10000000)/((mag.x - this.x)**2)
        this.ya = (10000000)/((mag.y - this.y)**2)
        // console.log(this.xa)
      } catch{

      }
    }
    obCol(obj: ob){
      const obsize = 50;
      // from left
      
      if(obj.x - this.x <= obsize && obj.x - this.x >= 0){
        console.log(Math.sqrt(this.xv**2 + this.yv**2))
        this.xv = -Math.abs(this.xv);
        // this.x = obj.x - obsize;
      }
      // from right
      if(this.x - obj.x <= obsize && this.x - obj.x >= 0){
        console.log(Math.sqrt(this.xv**2 + this.yv**2))
        this.xv = Math.abs(this.xv);
        // this.x = obj.x + obsize;
      }
      // from top
      if(obj.y - this.y <= obsize && obj.y - this.y >=0 ){
        console.log(Math.sqrt(this.xv**2 + this.yv**2))
        this.yv = -Math.abs(this.yv);
        // this.y = obj.y - obsize;
      }
      // from bottom
      if(this.y - obj.y <= obsize && this.y - obj.y >= 0){
        console.log(Math.sqrt(this.xv**2 + this.yv**2))
        this.yv = Math.abs(this.yv);
        // this.y = obj.y + obsize;
      }
    }
};

//******************** Ob Component Styling and Rendering ********************/
export default function Ob(props:any) {
    const obj = props.obj;
    const stylesheet = {
        position: 'absolute',
        top: obj.y,
        left: obj.x,
        filter: `blur(${Math.sqrt(Math.abs(obj.xv+obj.yv)/500)}px)`
      } as any;
  return (
    <div style={stylesheet}>{JSON.stringify(props.obj)}</div>
  )
}
