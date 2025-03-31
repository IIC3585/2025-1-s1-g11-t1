export { parseCSV, serializeCSV } from './utils/parsing.js';
export { pipe } from './utils/functional.js';
export { swap, columndelete, insertcolumn } from './transformations/columns.js';
export { rowdelete, insertrow } from './transformations/rows.js';
export { rowstocolumns, columnstorows } from './transformations/transpose.js';
export { tohtmltable } from './formatters/html.js';

export { 
  swapColumns, 
  deleteRow, 
  deleteColumn, 
  transpose 
} from './transformations/csvTransformations.js';

if (import.meta.url === `file://${process.argv[1]}`) {
  const { parseCSV, serializeCSV } = await import('./utils/parsing.js');
  const { swap, columndelete, insertcolumn } = await import('./transformations/columns.js');
  const { rowdelete, insertrow } = await import('./transformations/rows.js');
  const { rowstocolumns } = await import('./transformations/transpose.js');
  const { tohtmltable } = await import('./formatters/html.js');
  const { pipe } = await import('./utils/functional.js');

  // Test data
  const sampleCSV = `name,age,city,country
John,30,New York,USA
Alice,25,London,UK
Bob,35,Paris,France
Carol,28,Tokyo,Japan`;

  console.log('\n=== Testing CSV Parsing and Serialization ===');
  const matrix = parseCSV(sampleCSV);
  console.log('Parsed Matrix:');
  console.log(matrix);
  console.log('\nRe-serialized CSV:');
  console.log(serializeCSV(matrix));

  console.log('\n=== Testing Column Operations ===');
  console.log('\nSwapping columns 1 and 3 (name and city):');
  const swapped = swap(1, 3)(matrix);
  console.log(serializeCSV(swapped));

  console.log('\nDeleting column 2 (age):');
  const withoutAge = columndelete(2)(matrix);
  console.log(serializeCSV(withoutAge));

  console.log('\nInserting new column at position 2:');
  const newColumn = ['occupation', 'developer', 'designer', 'manager', 'engineer'];
  const withNewColumn = insertcolumn(2, newColumn)(matrix);
  console.log(serializeCSV(withNewColumn));

  console.log('\n=== Testing Row Operations ===');
  console.log('\nDeleting row 2 (Alice):');
  const withoutAlice = rowdelete(2)(matrix);
  console.log(serializeCSV(withoutAlice));

  console.log('\nInserting new row at position 2:');
  const newRow = ['Eve', '27', 'Berlin', 'Germany'];
  const withNewRow = insertrow(2, newRow)(matrix);
  console.log(serializeCSV(withNewRow));

  console.log('\n=== Testing Transposition ===');
  console.log('\nTransposing rows to columns:');
  const transposed = rowstocolumns(matrix);
  console.log(serializeCSV(transposed));

  console.log('\n=== Testing HTML Conversion ===');
  console.log('\nConverting to HTML table:');
  console.log(tohtmltable(matrix));

  console.log('\n=== Testing Function Composition ===');
  console.log('\nPipeline: parse -> swap columns 1,3 -> delete row 2 -> convert to HTML');
  const transform = pipe(
    parseCSV,
    swap(1, 3),
    rowdelete(2),
    tohtmltable
  );
  console.log(transform(sampleCSV));
} 