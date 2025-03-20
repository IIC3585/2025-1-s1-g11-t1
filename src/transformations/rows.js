import _ from 'lodash';

/**
 * @typedef {string[][]} Matrix
 */

/**
 * Deletes a specific row from the matrix
 * @param {number} n - Row index to delete (1-based)
 * @param {Matrix} matrix - The matrix to transform
 * @returns {Matrix} The transformed matrix
 */
export const rowdelete = _.curry((n, matrix) => 
  matrix.filter((_, index) => index !== n - 1)
);

/**
 * Inserts a row at a specific position
 * @param {number} n - Position to insert after (1-based)
 * @param {string[]} row - The row to insert
 * @param {Matrix} matrix - The matrix to transform
 * @returns {Matrix} The transformed matrix
 */
export const insertrow = _.curry((n, row, matrix) => {
  const result = [...matrix];
  result.splice(n, 0, row);
  return result;
}); 