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

For point-group objects, points will be represented by pos, vel, acc vectors in each dimension. Collisions are detected by calculating the normal vector for each surface of an object and comparing it with the normal vector of the plane with each point of each other object. This will be parameterized by time, which, with inversion, allows calculation of the time at which a point will collide with a plane.

Collision Handling:
New velocities for two objects are calculated using
conservation of momentum and kinetic energy through
substitution and quadratic factoring.

Functional Collision Detection:
Rather than a function, an array of points.    




