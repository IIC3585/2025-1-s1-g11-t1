# CSV Transformation Tool

A CSV transformation tool built with Vue.js and PrimeVue. Upload, transform, and export CSV files with a modern and user-friendly interface.

## Features

* Upload and process CSV files
* Apply transformations with a clean data flow architecture
* Export to CSV or HTML formats
* Modern and responsive UI built with PrimeVue
* Real-time data preview with DataTable
* Column and row operations
* Transpose data functionality

## Implementation Architecture

This project is structured around transformation functions that operate on data:

* **Pure Functions**: All transformations are implemented as pure functions with no side effects
* **Immutability**: Data is never modified in-place; new copies are returned after each transformation
* **Function Composition**: Transformations can be composed using the `pipe` utility
* **Currying**: Several functions use currying to enable partial application
* **Higher-Order Functions**: Functions that take functions as arguments or return functions
* **Separation of Concerns**: Code is organized by functionality into modules

## Project Structure

```
src/
├── App.vue                    # Main application component and layout
├── main.js                    # Application entry and plugin setup
├── style.css                  # Global styles and theme customization
├── cli.js                     # Command-line interface functionality
├── index.js                   # Main entry point and exports
│
├── utils/
│   ├── fileUtils.js          # File handling and download operations
│   ├── functional.js         # Utility functions for function composition
│   └── parsing.js            # CSV parsing and data conversion
│
├── transformations/
│   ├── csvTransformations.js # Main CSV transformation operations
│   ├── columns.js           # Column-specific transformations
│   ├── rows.js              # Row-specific transformations
│   └── transpose.js         # Matrix transposition operations
│
└── formatters/
    ├── fileFormatters.js    # File size and data formatting
    └── html.js              # HTML table generation utilities
```

## Implementation Details

### Data Transformation Architecture

The application is designed around a series of transform functions that operate on data:

1. **Column Operations** (`columns.js`):
   - `swap(n, m)`: Swaps columns n and m, returning a new matrix
   - `columndelete(n)`: Removes column n, returning a new matrix
   - `insertcolumn(n, column)`: Inserts a column after position n

2. **Row Operations** (`rows.js`):
   - `rowdelete(n)`: Removes row n, returning a new matrix
   - `insertrow(n, row)`: Inserts a row after position n

3. **Transpose Operations** (`transpose.js`):
   - `rowstocolumns`: Transposes rows to columns
   - `columnstorows`: Transposes columns to rows (alias to rowstocolumns)

4. **Adapter Layer** (`csvTransformations.js`):
   - Provides adapter functions that bridge between the UI components and core transformation functions
   - Handles conversion between UI data format and matrix format

### Core Utilities

The project uses several utility functions to support the transformations:

- **Pipe Function**: Enables function composition by passing the result of one function to the next
- **Curry**: Implemented using Lodash's curry function for partial application
- **Matrix Conversions**: Functions to convert between matrix format and object format for UI rendering

### Data Flow Architecture

The application follows a clear data flow:

1. **Input**: CSV files are uploaded and parsed into a structured data format
2. **Transformation**: Pure functions are applied to transform data without side effects
3. **UI State**: Vue's reactive system manages the state of the transformed data
4. **Output**: Data is formatted and exported to CSV or HTML

### UI Integration

The Vue.js frontend integrates with the transformation core:

- UI components trigger transformations by calling adapter functions
- All data transformations are performed through pure functions
- State management is handled by Vue's reactive system
- Confirmation dialogs protect destructive operations

## File Operations

- **Upload**: Drag & drop or select CSV files
- **Transform**: Swap columns, transpose, delete rows/columns
- **Export**: Download as CSV or HTML table

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/IIC3585/2025-1-s1-g11-t1.git
cd 2025-1-s1-g11-t1
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

## Testing

This project uses Jest for unit testing. A sample test suite covering parsing, transformations, and formatting functions is provided.

### Run the tests:

```bash
npm run test
```

## Technologies

- Vue.js 3 (Composition API)
- PrimeVue component library
- Vite for fast development
- PrimeFlex for responsive layout
- PrimeIcons for consistent iconography
- Lodash for utility functions

## Command Line Interface

The application also provides a CLI interface for processing CSV files:

```bash
node src/cli.js input.csv --output=transformed.csv --swap=1,2 --delete-row=3
```

## Implementation Examples

### Function Composition with Pipe

```javascript
// The pipe function allows composing multiple transformations in sequence
export const pipe = (...fns) => (value) => 
  fns.reduce((acc, fn) => fn(acc), value);

// Usage in CLI:
const transformations = createTransformationPipeline(options);
const transform = pipe(...transformations);
const result = transform(csvContent);
```

### Curried Transformation Functions

```javascript
// Column swap with currying allows partial application
export const swap = _.curry((n, m, matrix) => {
  const nIndex = n - 1;
  const mIndex = m - 1;
  return matrix.map(row => {
    const newRow = [...row];
    [newRow[nIndex], newRow[mIndex]] = [newRow[mIndex], newRow[nIndex]];
    return newRow;
  });
});

// Usage:
const swapFirstAndThird = swap(1, 3);
const transformed = swapFirstAndThird(matrix);
```

### Matrix Transformations

```javascript
// Transpose rows to columns
export const rowstocolumns = (matrix) => {
  const maxCols = Math.max(...matrix.map(row => row.length));
  return _.range(maxCols).map(colIndex => 
    matrix.map(row => row[colIndex] || '')
  );
};
```

## Citation

This project was documented and developed with assistance from ChatGPT for structuring content, refining explanations, and improving clarity.

## Authors

Manuel Espinoza
Pedro del Río

