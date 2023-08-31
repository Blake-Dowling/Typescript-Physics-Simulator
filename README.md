Concerns:

Purely using React states did not allow dynamic instantiation. Moved to class instances.

Was concerned about closure captures within same render. Turns out the closure within state setter is consistent with state changes that happen within a single render, whereas direct accessing of the state uses the closure at the time of rendering.

In implementing a physics engine, faced dilemma of deciding between accuracy and simplicity. The accuracy approach would involve calculating the time delta of a colision from the tick start, then reversing velocity, then calculating the final position given the remaining tick time. This can be later implemented, but current measurements for a 'teleporting' approach to dealing with collisions shows position inaccuracies of ~< 2 pixels. Added calculations and exponential complexity of n objects led me to decide to implement accurate collision position changes later.