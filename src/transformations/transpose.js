import _ from 'lodash';

/**
 * @typedef {string[][]} Matrix
 */

/**
 * Transposes rows to columns
 * @param {Matrix} matrix - The matrix to transpose
 * @returns {Matrix} The transposed matrix
 */
export const rowstocolumns = (matrix) => {
  const maxCols = Math.max(...matrix.map(row => row.length));
  return _.range(maxCols).map(colIndex => 
    matrix.map(row => row[colIndex] || '')
  );
};

/**
 * Transposes columns to rows (reverse of rowstocolumns)
 * @param {Matrix} matrix - The matrix to transpose
 * @returns {Matrix} The transposed matrix
 */
export const columnstorows = rowstocolumns; 