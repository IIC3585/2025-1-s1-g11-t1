import _ from 'lodash';

/**
 * @typedef {string[][]} Matrix
 * @typedef {string} CSV
 */

/**
 * Parses a CSV string into a matrix
 * @param {CSV} csv - The CSV string to parse
 * @returns {Matrix} The parsed matrix
 */
export const parseCSV = (csv) => _.split(csv, '\n').map(row => _.split(row, ','));

/**
 * Serializes a matrix back to CSV string
 * @param {Matrix} matrix - The matrix to serialize
 * @returns {CSV} The serialized CSV string
 */
export const serializeCSV = (matrix) => matrix.map(row => _.join(row, ',')).join('\n'); 