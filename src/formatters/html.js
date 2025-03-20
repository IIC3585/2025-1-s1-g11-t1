/**
 * @typedef {string[][]} Matrix
 */

// HTML tag constants
const HTML_TAGS = {
  TABLE: {
    OPEN: '<table>',
    CLOSE: '</table>'
  },
  ROW: {
    OPEN: '<tr>',
    CLOSE: '</tr>'
  },
  CELL: {
    OPEN: '<td>',
    CLOSE: '</td>'
  }
};

// Indentation constants
const INDENTATION = {
  ROW: '    ',
  CELL: '      '
};

/**
 * Creates an HTML table row from an array of cells
 * @param {string[]} row - Array of cell values
 * @returns {string} Formatted HTML row
 */
const createRow = (row) => 
  `${INDENTATION.ROW}${HTML_TAGS.ROW.OPEN}\n` +
  `${row.map(cell => `${INDENTATION.CELL}${HTML_TAGS.CELL.OPEN}${cell}${HTML_TAGS.CELL.CLOSE}`).join('\n')}\n` +
  `${INDENTATION.ROW}${HTML_TAGS.ROW.CLOSE}`;

/**
 * Converts a matrix to an HTML table
 * @param {Matrix} matrix - The matrix to convert
 * @returns {string} The HTML table string
 */
export const tohtmltable = (matrix) => {
  const rows = matrix.map(createRow).join('\n');
  return `${HTML_TAGS.TABLE.OPEN}\n${rows}\n${HTML_TAGS.TABLE.CLOSE}`;
}; 