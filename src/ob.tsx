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
        this.ya = 0;
    }


    accl(){
      this.xv += this.xa;
      this.yv += this.ya;
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
      this.xa = (-100000)/((mag.x - this.x)**2)
      this.ya = (-100000)/((mag.y - this.y)**2)
      console.log(this.xa)

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
