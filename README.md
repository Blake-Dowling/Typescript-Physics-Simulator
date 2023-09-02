Concerns:

Purely using React states did not allow dynamic instantiation. Moved to class instances.

Was concerned about closure captures within same render. Turns out the closure within state setter is consistent with state changes that happen within a single render, whereas direct accessing of the state uses the closure at the time of rendering.

In implementing a physics engine, faced dilemma of deciding between accuracy and simplicity. The accuracy approach would involve calculating the time delta of a colision from the tick start, then reversing velocity, then calculating the final position given the remaining tick time. This can be later implemented, but current measurements for a 'teleporting' approach to dealing with collisions shows position inaccuracies of ~< 2 pixels. Added calculations and exponential complexity of n objects led me to decide to implement accurate collision position changes later.

Collision handling:
E.g. ground collision:

     ()
     v
-------------
xxxxxxxxxxxxx
xxxx"()"xxxxx
Move Function:
1. Collision detection 
a. calculate time delta at which y = bound (dd = bound - y): 
    bound - y = dd = (a/2)(t**2) + (v * t) + y
    td = (-v (+) sqrt(v**2 * 2a(-dd))) / a


b. if td < TICK:
    i. move obj using time-parameterized motion function d = (a/2)(t**2)+vt+y
    with td
    ii. reverse v
    iii. move obj using TICK-td
1. ELSE
    i. move obj using time-parameterized motion function d = (a/2)(t**2)+vt+y
    with t

Imperfect collision elasticity:
All parameter changes must be done in order of descending degree.
Collisions continue to lose elasticity. I believe this may be a precision error. In principle, the function that calculates distance delta with respect to time must be precisely inverse to the function that calculates time delta with respect to distance delta.
It seems that doing quadratic calculations is not possible without significant floating point error on small distance deltas. Therefore, time-parameterized calculations may not be used inversely to distance-parameterized calculations in such programs, unless this precision error may be solved.
After graphing quadratics, precision does not seem to be an issue. However, inversion is required for delta calculations, when the delta is invertible.
Velocity was not being adjusted for collision intervals. Fixed, but elasticity loss is still ocurring. The principle is that error can occur from recursively applying differentials. If you calculate the velocity based on a time slice, but then need to change the velocity mid-time-slice, you must recalculate the velocity for that time slice, which in turn will alter the time slice again. With more precise time slices come more precision required by the distance calulations, and more errors occur due to limited precision.
For collision detection:
What we need to do is find out, over what interval will the integral of the acceleration equal to distance delta?
So, simply figure out
(a/2)(tf**2) - (a/2)(t0**2) = dd
(tf**2) = dd/(a/2)
tf = sqrt(2*dd/a)


If less than tick, ...
For normal movement over a tick:
Find distance delta by taking double definite integral of acceleration over tick