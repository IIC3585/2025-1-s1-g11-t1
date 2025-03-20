import _ from 'lodash';

/**
 * @typedef {string[][]} Matrix
 */

/**
 * Swaps two columns in the matrix
 * @param {number} n - First column index (1-based)
 * @param {number} m - Second column index (1-based)
 * @param {Matrix} matrix - The matrix to transform
 * @returns {Matrix} The transformed matrix
 */
export const swap = _.curry((n, m, matrix) => {
  const nIndex = n - 1;
  const mIndex = m - 1;
  return matrix.map(row => {
    const newRow = [...row];
    [newRow[nIndex], newRow[mIndex]] = [newRow[mIndex], newRow[nIndex]];
    return newRow;
  });
});

/**
 * Deletes a specific column from the matrix
 * @param {number} n - Column index to delete (1-based)
 * @param {Matrix} matrix - The matrix to transform
 * @returns {Matrix} The transformed matrix
 */
export const columndelete = _.curry((n, matrix) => 
  matrix.map(row => row.filter((_, index) => index !== n - 1))
);

/**
 * Inserts a column at a specific position
 * @param {number} n - Position to insert after (1-based)
 * @param {string[]} column - The column to insert
 * @param {Matrix} matrix - The matrix to transform
 * @returns {Matrix} The transformed matrix
 */
export const insertcolumn = _.curry((n, column, matrix) => 
  matrix.map((row, index) => {
    const newRow = [...row];
    newRow.splice(n, 0, column[index] || '');
    return newRow;
  })
); 