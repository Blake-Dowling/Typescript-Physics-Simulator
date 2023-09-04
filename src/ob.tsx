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
    collided : boolean = false;
    pos: [number, number];
    vel: [number, number];
    acc: [number, number];
    mass: number;
    volume: [number, number];
    constructor(pos: [number, number], vel: [number, number], acc: [number, number], mass: number, volume: [number, number]){
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
        this.mass = mass;
        this.volume = volume;
    }


    accl(t: number){
      this.vel[0] += this.acc[0]*t;
      this.vel[1] += this.acc[1]*t;
    }

    calcDDY(td: number){
      return ((0.5 * (this.acc[1] * (td ** 2))) + (this.vel[1] * td));
    }
    // Calculates and sets new velocities for obj1 and obj2 using
    // conservation of momentum and kinetic energy through
    // substitution and quadratic factoring.
    collision(dir: Dir, obj1: ob, obj2: ob){
      let v1 = 0;
      let v2 = 0;
      if(dir === Dir.x){
        v1 = obj1.vel[0];
        v2 = obj2.vel[0];
      }
      else if(dir === Dir.y){
        v1 = obj1.vel[1];
        v2 = obj2.vel[1];
      }
      else{
        return;
      }
      const mass1 = obj1.mass;
      const mass2 = obj2.mass;
      const M = (mass1 * v1) + (mass2 * v1);
      const K = (.5*mass1) * (v1**2) + (0.5*mass2) * (v2**2)

      let vf2_plus = (
                  (
                    2*M*mass2 + Math.sqrt(
                                          ((-2*M*mass2)**2) - (4*(mass2**2 + mass2)*(-2*K*mass1 + (M**2)))
                                          )
                  )
                  / (2 * ((mass2**2) + mass2))
                )
      let vf2_minus = (
        (
          2*M*mass2 - Math.sqrt(
                                ((-2*M*mass2)**2) - (4*(mass2**2 + mass2)*(-2*K*mass1 + (M**2)))
                                )
        )
        / (2 * ((mass2**2) + mass2))
      )
      console.log(vf2_minus, vf2_plus)
      let vf2 = Math.min(vf2_minus, vf2_plus)
      let vf1 = (M - (mass2*vf2)) / mass1

      // console.log(v1, v2)
      // console.log(vf1-v1,vf2-v2)
      obj1.vel[1] = vf1;
      obj2.vel[1] = vf2;
      
    }
    calcTD2(dir: Dir, obj1: ob, obj2: ob, dd: number){

      let d = 0;
      let v = 0;
      let a = 0;
      if(dir === Dir.x){
        d = obj2.pos[0] - obj1.pos[0] + obj1.volume[0] - obj2.volume[0];
        v = obj2.vel[0] - obj1.vel[0];
        a = .001
      }
      else if(dir === Dir.y){
        d = obj2.pos[1] - obj1.pos[1] + obj1.volume[1] - obj2.volume[1];
        v = obj2.vel[1] - obj1.vel[1];
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
        dd = pos - this.pos[0];
        d = this.pos[0];
        v = this.vel[0];
        a = this.acc[0];
      }
      else if(dir === Dir.y){
        dd = pos - this.pos[1];
        d = this.pos[1];
        v = this.vel[1];
        a = this.acc[1];
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
              NaN;
      return td;
    }

    //******************** Check and Handle Collision ********************/
  bounds(dir: Dir, T: number, bound: number){
    const time_until_collision = this.calcTD(dir, bound );
    
    if(Number.isNaN(time_until_collision)){
      return false;
    }
    if(time_until_collision < T){
      
      this.move(time_until_collision)
      this.accl(time_until_collision)
      if(dir === Dir.x){
        this.vel[0] = -this.vel[0]
      }
      else if(dir === Dir.y){
        this.vel[1] = -this.vel[1]
      }
      
      this.move(T - time_until_collision)
      this.accl(T - time_until_collision)
      return true;
    }
    return false;
  }

  
    move(t: number){

      this.pos[0] += (0.5 * (this.acc[0] * (t ** 2))) + (this.vel[0] * t);
      this.pos[1] += (0.5 * (this.acc[1] * (t ** 2))) + (this.vel[1] * t);
    }

    // calcMag(mag: ob){
    //   //F = k * [(q1*q2)/r**2]
    //   try{
    //     this.xa = (10000000)/((mag.x - this.x)**2)
    //     this.ya = (10000000)/((mag.y - this.y)**2)
    //     // console.log(this.xa)
    //   } catch{

    //   }
    }
    

//******************** Ob Component Styling and Rendering ********************/
export default function Ob(props:any) {
    const obj = props.obj;
    const stylesheet = {
        position: 'absolute',
        top: obj.pos[1],
        left: obj.pos[0],
        // filter: `blur(${Math.sqrt(Math.abs(obj.xv+obj.yv)/500)}px)`
      } as any;
  return (
    <div style={stylesheet}>{JSON.stringify(props.obj)}</div>
  )
}
