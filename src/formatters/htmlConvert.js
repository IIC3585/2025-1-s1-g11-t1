import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Parsea el contenido de un CSV y lo convierte en una matriz (array de arrays)
 * @param {string} csvContent - Contenido del archivo CSV
 * @returns {string[][]} Matriz con los datos
 */
const parseCSV = (csvContent) =>
  csvContent
    .trim()
    .split('\n')
    .map(line => line.split(',').map(cell => cell.trim()));

/**
 * Convierte una matriz a una tabla HTML simple
 * @param {string[][]} matrix - La matriz a convertir
 * @returns {string} Cadena con la tabla HTML
 */
const toHTMLTable = (matrix) => {
  const tableRows = matrix
    .map(row => {
      const cells = row.map(cell => `<td>${cell}</td>`).join('');
      return `  <tr>${cells}</tr>`;
    })
    .join('\n');
  return `<table border="1">\n${tableRows}\n</table>`;
};

/**
 * Crea un documento HTML completo dado el contenido de la tabla
 * @param {string} tableHtml - La tabla HTML en forma de cadena
 * @returns {string} Documento HTML completo
 */
const createHtmlDocument = (tableHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CSV a Tabla HTML</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      background-color: #fff;
    }
    td, th {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
    tr:nth-child(even) {
      background-color: #eee;
    }
  </style>
</head>
<body>
${tableHtml}
</body>
</html>
`;

/**
 * Función principal que convierte un CSV en un archivo HTML.
 * Lee el archivo CSV especificado y genera el archivo HTML en la ubicación indicada.
 */
async function convertCsvToHtml() {
  try {
    // Obtener argumentos: [node, script, inputCsvPath, outputHtmlPath]
    const inputArg = process.argv[2];
    const outputArg = process.argv[3];
    
    // Si no se proporcionan, se usan los valores por defecto en el directorio raíz.
    const inputCsvPath = inputArg
      ? path.resolve(process.cwd(), inputArg)
      : path.join(process.cwd(), 'sample.csv');
    const outputHtmlPath = outputArg
      ? path.resolve(process.cwd(), outputArg)
      : path.join(process.cwd(), 'output.html');

    console.log(`Convirtiendo el archivo CSV: ${inputCsvPath}`);
    
    const csvContent = await fs.readFile(inputCsvPath, 'utf-8');

    const matrix = parseCSV(csvContent);
    const tableHtml = toHTMLTable(matrix);
    const htmlDocument = createHtmlDocument(tableHtml);

    console.log(`Generando el archivo HTML: ${outputHtmlPath}`);
    await fs.writeFile(outputHtmlPath, htmlDocument, 'utf-8');

    console.log(`¡Archivo HTML generado exitosamente en: ${outputHtmlPath}`);
  } catch (error) {
    console.error('Error al convertir CSV a HTML:', error);
  }
}

// Ejecuta la conversión cuando se corre este archivo desde la terminal
convertCsvToHtml();


