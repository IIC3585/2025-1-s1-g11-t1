import _ from 'lodash';
import { swap, columndelete } from './columns.js';
import { rowdelete } from './rows.js';
import { rowstocolumns } from './transpose.js';

/**
 * Swaps two columns in the data array
 * @param {number} col1 - Index of the first column (0-based)
 * @param {number} col2 - Index of the second column (0-based)
 * @returns {Function} - Function that takes data and returns transformed data
 */
export const swapColumns = (col1, col2) => (data) => {
  if (!data || data.length === 0) return [];
  
  const { matrix, idMap } = dataToMatrix(data);
  
  const transformedMatrix = swap(col1 + 1, col2 + 1)(matrix);
  
  return matrixToData(transformedMatrix, idMap);
};

/**
 * Deletes a row in the data array
 * @param {number} rowIndex - Index of the row to delete (0-based)
 * @returns {Function} - Function that takes data and returns transformed data
 */
export const deleteRow = (rowIndex) => (data) => {
  if (!data || data.length === 0) return [];
  
  const { matrix, idMap } = dataToMatrix(data);
  
  const transformedMatrix = rowdelete(rowIndex + 1)(matrix);
  
  return matrixToData(transformedMatrix, idMap);
};

/**
 * Deletes a column in the data array
 * @param {string} field - Name of the field to delete
 * @returns {Function} - Function that takes data and returns transformed data
 */
export const deleteColumn = (field) => (data) => {
  if (!data || data.length === 0) return [];
  
  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  const colIndex = headers.indexOf(field);
  
  if (colIndex === -1) return data;
  
  const { matrix, idMap } = dataToMatrix(data);
  
  const transformedMatrix = columndelete(colIndex + 1)(matrix);
  
  return matrixToData(transformedMatrix, idMap);
};

/**
 * Transposes data, converting rows to columns and columns to rows
 * @param {Array} data - Array of data to transpose
 * @returns {Array} - Transposed data
 */
export const transpose = (data) => {
  if (!data || data.length === 0) return [];
  
  const { matrix } = dataToMatrix(data);
  
  const transposedMatrix = rowstocolumns(matrix);
  
  return matrixToTransposedData(transposedMatrix);
};

/**
 * Converts an array of objects to a matrix (including headers)
 * @param {Array} data - Array of objects
 * @returns {Object} - Resulting matrix and ID map
 */
const dataToMatrix = (data) => {
  if (!data || data.length === 0) return { matrix: [[]], idMap: [] };
  
  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  const matrix = [headers];
  
  const idMap = [];
  
  data.forEach(row => {
    idMap.push(row.id);
    
    const rowArray = headers.map(header => String(row[header] || ''));
    matrix.push(rowArray);
  });
  
  return { matrix, idMap };
};

/**
 * Converts a matrix to an array of objects
 * @param {string[][]} matrix - Matrix with data (first row as headers)
 * @param {Array} idMap - Original ID map
 * @returns {Array} - Array of objects
 */
const matrixToData = (matrix, idMap = []) => {
  if (!matrix || matrix.length <= 1) return [];
  
  const headers = matrix[0];
  const data = [];
  
  for (let i = 1; i < matrix.length; i++) {
    const row = matrix[i];
    const obj = {};
    
    obj.id = (idMap.length >= i && idMap[i-1] !== undefined) ? idMap[i-1] : (i-1);
    
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    
    data.push(obj);
  }
  
  return data;
};

/**
 * Converts a transposed matrix to an array of objects
 * @param {string[][]} matrix - Transposed matrix
 * @returns {Array} - Array of objects
 */
const matrixToTransposedData = (matrix) => {
  if (!matrix || matrix.length === 0) return [];
  
  return matrix.map((row, rowIndex) => {
    const obj = { id: rowIndex };
    
    row.forEach((value, colIndex) => {
      obj[colIndex] = value;
    });
    
    return obj;
  });
};