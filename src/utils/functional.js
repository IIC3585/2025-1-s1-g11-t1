/**
 * Creates a sequence of transformation functions that processes data in order
 * @param {...Function} fns - The functions to apply in sequence
 * @returns {Function} A combined function that applies all transformations
 */
export const pipe = (...fns) => (value) => 
  fns.reduce((acc, fn) => fn(acc), value); 