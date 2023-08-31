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
        this.x = 100;
        this.y = 0;
        this.xv = -100;
        this.yv = 0;
        this.xa = 0;
        this.ya = 0;
    }

};


export default function Ob(props:any) {
    const obj = props.obj;
    const stylesheet = {
        position: 'relative',
        top: obj.y,
        left: obj.x - SCREEN_WIDTH/2,
        filter: `blur(${Math.sqrt(Math.abs(obj.xv+obj.yv)/5)}px)`
      } as any;
  return (
    <div style={stylesheet}>{JSON.stringify(props.obj)}</div>
  )
}
