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
    constructor(){
        this.x = 0;
        this.y = 0;
        this.xv = 0;
        this.yv = 0;
        this.xa = 0;
        this.ya = 10;
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
};


export default function Ob(props:any) {
    const obj = props.obj;
    const stylesheet = {
        position: 'relative',
        top: obj.y,
        left: obj.x - SCREEN_WIDTH/2,
        filter: `blur(${Math.sqrt(Math.abs(obj.xv+obj.yv)/500)}px)`
      } as any;
  return (
    <div style={stylesheet}>{JSON.stringify(props.obj)}</div>
  )
}
