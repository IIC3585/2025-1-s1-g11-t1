import { parseCSV, serializeCSV } from '../utils/parsing.js';
import { swap, columndelete, insertcolumn } from '../transformations/columns.js';
import { rowdelete, insertrow } from '../transformations/rows.js';
import { rowstocolumns, columnstorows } from '../transformations/transpose.js';
import { tohtmltable } from '../formatters/html.js';
import { pipe } from '../utils/functional.js';

describe('CSV Parsing and Serialization', () => {
  const csvData = "A,B,C\nD,E,F\nG,H,I";
  const matrix = [
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['G', 'H', 'I']
  ];

  test('parseCSV convierte una cadena CSV en una matriz', () => {
    expect(parseCSV(csvData)).toEqual(matrix);
  });

  test('serializeCSV convierte una matriz en una cadena CSV', () => {
    // Se espera que serializeCSV genere la cadena sin espacios adicionales
    const expected = "A,B,C\nD,E,F\nG,H,I";
    expect(serializeCSV(matrix)).toEqual(expected);
  });
});

describe('Operaciones sobre columnas', () => {
  const matrix = [
    ['A', 'B', 'C'],
    ['D', 'E', 'F']
  ];

  test('swap intercambia las columnas especificadas (1-indexado)', () => {
    // swap(1,3) intercambia la primera y la tercera columna
    const result = swap(1, 3)(matrix);
    const expected = [
      ['C', 'B', 'A'],
      ['F', 'E', 'D']
    ];
    expect(result).toEqual(expected);
  });

  test('columndelete elimina la columna indicada (1-indexado)', () => {
    // Eliminar la columna 2
    const result = columndelete(2)(matrix);
    const expected = [
      ['A', 'C'],
      ['D', 'F']
    ];
    expect(result).toEqual(expected);
  });

  test('insertcolumn inserta una columna después del índice indicado (1-indexado)', () => {
    // Insertar nueva columna después de la columna 1
    const newColumn = ['X', 'Y'];
    const result = insertcolumn(1, newColumn)(matrix);
    // Se espera que se inserte la nueva columna en la posición 2 (índice 1 en 0-indexado)
    const expected = [
      ['A', 'X', 'B', 'C'],
      ['D', 'Y', 'E', 'F']
    ];
    expect(result).toEqual(expected);
  });
});

describe('Operaciones sobre filas', () => {
  const matrix = [
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['G', 'H', 'I']
  ];

  test('rowdelete elimina la fila indicada (1-indexado)', () => {
    // Eliminar la fila 2
    const result = rowdelete(2)(matrix);
    const expected = [
      ['A', 'B', 'C'],
      ['G', 'H', 'I']
    ];
    expect(result).toEqual(expected);
  });

  test('insertrow inserta una fila después del índice indicado (1-indexado)', () => {
    // Insertar nueva fila después de la fila 1
    const newRow = ['X', 'Y', 'Z'];
    const result = insertrow(1, newRow)(matrix);
    const expected = [
      ['A', 'B', 'C'],
      ['X', 'Y', 'Z'],
      ['D', 'E', 'F'],
      ['G', 'H', 'I']
    ];
    expect(result).toEqual(expected);
  });
});

describe('Operaciones de Transposición', () => {
  const matrix = [
    ['A', 'B'],
    ['C', 'D'],
    ['E', 'F']
  ];

  test('rowstocolumns transpone filas a columnas', () => {
    const result = rowstocolumns(matrix);
    const expected = [
      ['A', 'C', 'E'],
      ['B', 'D', 'F']
    ];
    expect(result).toEqual(expected);
  });

  test('columnstorows transpone columnas a filas (inversa de rowstocolumns)', () => {
    const transposed = rowstocolumns(matrix);
    const result = columnstorows(transposed);
    expect(result).toEqual(matrix);
  });
});

describe('Conversión a HTML', () => {
  const matrix = [
    ['A', 'B'],
    ['C', 'D']
  ];

  test('tohtmltable genera una cadena HTML que contiene la tabla', () => {
    const html = tohtmltable(matrix);
    expect(html).toContain('<table');
    expect(html).toContain('<tr>');
    expect(html).toContain('<td>A</td>');
    expect(html).toContain('<td>B</td>');
    expect(html).toContain('<td>C</td>');
    expect(html).toContain('<td>D</td>');
  });
});



describe('Composición de funciones con pipe', () => {
  const csvData = "A,B\nC,D";
  
  test('pipe compone funciones de transformación', () => {
    // Pipeline: parseCSV -> swap columnas 1 y 2 -> serializeCSV
    const transform = pipe(
      parseCSV,
      swap(1, 2),
      serializeCSV
    );
    // Para "A,B\nC,D", al intercambiar columnas se espera "B,A\nD,C"
    const expected = "B,A\nD,C";
    expect(transform(csvData)).toEqual(expected);
  });
});