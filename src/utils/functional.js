/**
 * Creates a pipeline of transformations
 * @param {...Function} fns - The functions to compose
 * @returns {Function} The composed function
 */
export const pipe = (...fns) => (value) => 
  fns.reduce((acc, fn) => fn(acc), value); 