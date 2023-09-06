Collision Detection:
Sideways trajectory projection - Calculates time at which 
Ob will be at passed distance delta. It uses the quadratic
equation to piece together the + and - results of the
inverse distance function, projecting forward in time (returns
the minimum positive output of the + and - curves, for the
given distance input). When the sign of the distance
is opposite to the velocity, the object will either
change direction due to acceleration (i.e. change output
curves) or never reach dd (td = infinity). Because we are
detecting collisions, however, simply using the minimum
positive result provides the correct output.

Collision Handling:
New velocities for two objects are calculated using
conservation of momentum and kinetic energy through
substitution and quadratic factoring.

Functional Collision Detection:
-          ---------       y1(x)
  \____/_\/
______/   \_________       y2(x)


--\        /---------      [y1-y2](x)
0_ \---\__/
        --
            0              [x](y1-y2)
            |  |           f = [x](y1-y2), (y1-y2) < 0
            |  |           f = +- sqrt(x+2)
            |  |           if f(0) = undefined: no collision
            | /            else: collision
           /|
          | |    <f
           \|
                           
                                


