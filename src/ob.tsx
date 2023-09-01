import React from 'react'

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;

type obType = {
  x: number;
  y: number;
  xv: number;
  yv: number;
  xa: number;
  ya: number;
}
export class ob implements obType{
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
        this.ya = 10;
    }


    accl(){
      this.xv += this.xa;
      this.yv += this.ya;
    }
    calcTDY(dd: number){
      console.log(((-this.y + Math.sqrt(Math.abs(this.yv) + 2*Math.abs(this.ya)*Math.abs(dd))) / this.ya));
      return ((-this.y + Math.sqrt(Math.abs(this.yv) + 2*Math.abs(this.ya)*Math.abs(dd))) / this.ya)
    }
    move(t: number){

      
      this.x = (0.5 * (this.xa * (t ** 2))) + (this.xv * t) + this.x;
      this.y = (0.5 * (this.ya * (t ** 2))) + (this.yv * t) + this.y;
      this.accl();

    }
    print(){
      console.log(JSON.stringify(this));
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
