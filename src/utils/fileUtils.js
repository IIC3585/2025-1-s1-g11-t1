import _ from 'lodash';
import { parseCSV, serializeCSV } from './parsing.js';

/**
 * Parses a CSV file into a structured data format
 * @param {File} file - CSV file to parse
 * @returns {Promise} - Promise that resolves with parsed data or rejects with error
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvContent = event.target.result;
        const matrix = parseCSV(csvContent);
        
        if (matrix.length <= 1) {
          resolve([]);
          return;
        }
        
        const headers = matrix[0];
        const data = matrix.slice(1).map((row, index) => {
          const obj = { id: index };
          
          headers.forEach((header, i) => {
            obj[header] = row[i] || '';
          });
          
          return obj;
        });
        
        resolve(data);
      } catch (error) {
        reject(new Error('Error parsing CSV file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Creates a downloadable blob from content
 * @param {string} content - Content to download
 * @param {string} filename - Name of the file to download
 * @param {string} type - MIME type of the content
 */
export const downloadContent = (content, filename, type = 'text/html') => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Calculates the total size of files
 * @param {Array} files - Array of files
 * @returns {number} - Total size in bytes
 */
export const calculateTotalSize = (files) => {
  return _.sumBy(files, 'size');
};

/**
 * Calculates size percentage against maximum
 * @param {number} size - Current size in bytes
 * @param {number} maxSize - Maximum size in bytes
 * @returns {number} - Percentage (0-100)
 */
export const calculateSizePercent = _.curry((maxSize, size) => {
  return (size / maxSize) * 100;
});

/**
 * Converts data to CSV format
 * @param {Array} data - Data to convert to CSV
 * @returns {string} CSV string
 */
export const convertToCSV = (data) => {
  if (!data || !data.length) return '';
  
  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  const matrix = [headers];
  
  data.forEach(row => {
    const csvRow = headers.map(header => {
      const val = row[header];
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    matrix.push(csvRow);
  });
  
  return serializeCSV(matrix);
};