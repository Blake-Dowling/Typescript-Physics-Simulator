import React from 'react'

const SCREEN_HEIGHT = window.innerHeight;
const SCREEN_WIDTH = window.innerWidth;
export enum Dir{
  x, y
}


export class ob{
    id: number;
    collided : boolean = false;
    pos: [number, number];
    vel: [number, number];
    acc: [number, number];
    mass: number;
    volume: [number, number];
    constructor(id: number, pos: [number, number], vel: [number, number], acc: [number, number], mass: number, volume: [number, number]){
        this.id = id;
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
// console.log("1 - ",obj1.vel)
      for(let i=0; i<obj1.pos.length; i++){
        v1 = obj1.vel[i];
        v2 = obj2.vel[i];
      

        const mass1 = obj1.mass;
        const mass2 = obj2.mass;
        const M = (mass1 * v1) + (mass2 * v2);
        const K = (.5*mass1) * (v1**2) + (0.5*mass2) * (v2**2)
      // M = -M
      
      let vf1_plus = (
                  (
                    2*M*mass1 + Math.sqrt(
                                          ((-2*M*mass1)**2) - (4*(mass1**2 + mass1*mass2)*(-2*K*mass2 + (M**2)))
                                          )
                  )
                  / (2 * ((mass1**2) + mass1*mass2))
                )
                
      let vf1_minus = (
        (
          2*M*mass1 - Math.sqrt(
                                ((-2*M*mass1)**2) - (4*(mass1**2 + mass1*mass2)*(-2*K*mass2 + (M**2)))
                                )
        )
        / (2 * ((mass1**2) + mass1*mass2))
      )
      // if(obj1.id === 2){
      //   console.log(obj1.vel[i])
      //   console.log(vf1_plus,vf1_minus)
      // }
      let vf1 = vf1_plus;
      // Select side of quadratic opposite to starting velocity
      if(Math.abs(vf1 - obj1.vel[i]) < 0.0001){
        vf1 = vf1_minus;
      } 
      let vf2 = (M - (mass1*vf1)) / mass2
      // console.log("-",vf1)
      // console.log(v1, v2)
      // console.log(vf1-v1,vf2-v2)
      obj1.vel[i] = vf1;
      obj2.vel[i] = vf2;
      
    }
    }
    calcTD2(obj1: ob, obj2: ob){


        let d = [0, 0];
        let v = [0, 0];
        let a = [0, 0];
        // Calculate distance magnitude
        for(let i=0; i<obj1.pos.length; i++){
          if(obj2.pos[i] >= obj1.pos[i]){
            d[i] += ( (obj2.pos[i] - (0.5*obj2.volume[i])) - (obj1.pos[i] + (0.5*obj1.volume[i])) );
          }
          else if(obj2.pos[i] < obj1.pos[i]){
            d[i] += ( (obj2.pos[i] + (0.5*obj2.volume[i])) - (obj1.pos[i] - (0.5*obj1.volume[i])) );
          }
          
        }
        // d = Math.sqrt(d);
        if(this.id===1){
          // console.log(obj1.pos)
          console.log(d)
        }
        for(let i=0; i<obj1.vel.length; i++){
          v[i] += (obj2.vel[i] - obj1.vel[i]);
        }
        // v = Math.sqrt(v);

        for(let i=0; i<obj1.acc.length; i++){
          a[i] += (obj2.acc[i] - obj1.acc[i]);
          a[i] = Math.max(a[i], .001)
        }
        // a = Math.sqrt(a);
        
      
      // Positive direction
      let td_plus = NaN;
      let td_minus = NaN;
      let td = [0, 0];
      for(let i=0; i<obj1.acc.length; i++){
        td_plus = (
          (-v[i] + (
                                    Math.sqrt(
                                      (v[i]**2) - (2*a[i] * (d[i]))
                                    )
                                ) 
          )                    
        / a[i]
        )
        // Negative direction
        td_minus = (
          (-v[i] - (
                                      Math.sqrt(
                                        (v[i]**2) - (2*a[i] * (d[i]))
                                      )
                                  ) 
          )                    
        / a[i]
        )
      
      // console.log(td_plus, td_minus)
        // Calculate minimum positive output
        td[i] = td_plus >= 0 && td_minus < 0 ? td_plus :
              td_minus >= 0 && td_plus < 0 ? td_minus :
              td_plus >= 0 && td_minus >= 0 ? Math.min(td_plus, td_minus):
              // Number.isNaN(td_plus) || Number.isNaN(td_minus) ? NaN :
              NaN;
        
      }


      // if(obj1.id === 1){
      // console.log(td)
      // }
      return Math.min(...td);
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
      for(let i=0; i<this.pos.length; i++){
        this.pos[i] += (0.5 * (this.acc[i] * (t ** 2))) + (this.vel[i] * t);
      }
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
    let top = 0;
    let left = 0;
    if(!Number.isNaN(obj.pos[0]) && !Number.isNaN(obj.pos[1])){
      top = obj.pos[1];
      left = obj.pos[0];
    }
    const stylesheet = {
        position: 'absolute',
        top: top-(0.5*obj.volume[1]),
        left: left-(0.5*obj.volume[0]),
        width: obj.volume[0],
        height: obj.volume[1],
        border: 'solid 1px black',
        // filter: `blur(${Math.sqrt(Math.abs(obj.xv+obj.yv)/500)}px)`
      } as any;
      
  return (
    <div style={stylesheet}>{JSON.stringify(props.obj)}</div>
  )
}
