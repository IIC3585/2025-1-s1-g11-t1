# CSV Transformation Program

A functional programming-based CSV transformation library that provides various operations for manipulating CSV data while maintaining immutability and following functional programming principles.

## Features

- Pure functional transformations
- Immutable data handling
- Curried functions for partial application
- Function composition and piping
- Comprehensive CSV operations
- Sort operations to order CSV rows by column values
- HTML conversion
- Modular architecture

## Project Structure

```
src/
├── utils/
│   ├── parsing.js      # CSV parsing and serialization
│   └── functional.js   # Functional programming utilities
├── transformations/
│   ├── columns.js      # Column operations
│   ├── rows.js         # Row operations
│   └── sort.js         # Sort operations
│   └── transpose.js    # Transposition operations
├── formatters/
│   └── html.js         # HTML formatting
|   └── htmlConvert.js  # HTML file generation
├── test/
│   └── index.test.js   # Testing Functions
└── index.js            # Main entry point
```

## Installation

```bash
npm install
```

## Usage

```javascript
import { parseCSV, swap, rowdelete, tohtmltable, pipe } from './src/index.js';

// Example CSV string
const csv = `name,age,city
John,30,New York
Jane,25,London`;

// Parse CSV
const matrix = parseCSV(csv);

// Swap columns 1 and 3
const swapped = swap(1, 3)(matrix);

// Delete row 2
const withoutRow = rowdelete(2)(matrix);

// Create a transformation pipeline
const transform = pipe(
  parseCSV,
  swap(1, 3),
  rowdelete(2),
  tohtmltable
);

const result = transform(csv);
```

## Available Functions

### Parsing (src/utils/parsing.js)
- `parseCSV(csv)`: Parses CSV string to matrix
- `serializeCSV(matrix)`: Serializes matrix to CSV string

### Column Operations (src/transformations/columns.js)
- `swap(n, m)(matrix)`: Swaps columns n and m
- `columndelete(n)(matrix)`: Deletes column n
- `insertcolumn(n, column)(matrix)`: Inserts column after position n

### Row Operations (src/transformations/rows.js)
- `rowdelete(n)(matrix)`: Deletes row n
- `insertrow(n, row)(matrix)`: Inserts row after position n

### Transposition (src/transformations/transpose.js)
- `rowstocolumns(matrix)`: Transposes rows to columns
- `columnstorows(matrix)`: Transposes columns to rows

### Sort Operations (src/transformations/sort.js)
- `sortByColumn(col, direction)(matrix)`: Sorts the rows (excluding the header) by the specified column (1-indexed) in ascending ('asc') or descending ('desc') order.

### Formatting (src/formatters/html.js)
- `tohtmltable(matrix)`: Converts matrix to HTML table

### HTML Conversion (src/formatters/htmlConvert.js)
- `showInBrowser(matrix)`: Generates a complete HTML document from a matrix and opens it in the default browser

### Functional Utilities (src/utils/functional.js)
- `pipe(...fns)`: Creates a pipeline of transformations


## Convert CSV to HTML

### Usage
From the project root, run the following command:

```bash
node src/formatters/htmlConvert.js [inputCsvPath] [outputHtmlPath]
```

- inputCsvPath (optional): Path to the input CSV file. If not specified, sample.csv located in the project root will be used.

- outputHtmlPath (optional): Path to the output HTML file. If not specified, output.html will be generated in the project root.

### Examples
Convert the default file (sample.csv) to HTML:

```bash
node src/formatters/htmlConvert.js
```
Convert a custom CSV file and generate an HTML file at a specific location:

```bash
node src/formatters/htmlConvert.js data/myData.csv results/myTable.html
```

## Functional Programming Features

- Pure functions with no side effects
- Immutable data structures
- Curried functions for partial application
- Function composition using `pipe`
- Lodash FP utilities integration

## Testing

This project uses Jest for unit testing. A sample test suite covering parsing, transformations, and formatting functions is provided.

### Run the tests:

```bash
npm test
```

## Dependencies

- lodash
- lodash-fp

