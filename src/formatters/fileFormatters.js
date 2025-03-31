import _ from 'lodash';
import { tohtmltable } from './html.js';

/**
 * Formats file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size with unit
 */
export const formatFileSize = _.curry((bytes) => {
  if (!bytes) return '0 B';
  
  const k = 1024;
  const dm = 2;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  
  return `${formattedSize} ${sizes[i]}`;
});

/**
 * Formats CSV data to HTML
 * @param {Array} data - Array of CSV data
 * @returns {string} - HTML string
 */
export const formatToHTML = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]).filter(key => key !== 'id');
  const matrix = [headers];
  
  data.forEach(row => {
    const rowArray = headers.map(header => String(row[header] || ''));
    matrix.push(rowArray);
  });
  
  const tableHtml = tohtmltable(matrix);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
          font-family: Arial, sans-serif;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
      </style>
    </head>
    <body>
      ${tableHtml}
    </body>
    </html>
  `;
};