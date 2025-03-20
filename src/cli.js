import fs from 'fs/promises';
import path from 'path';
import { parseCSV, serializeCSV } from './utils/parsing.js';
import { swap, columndelete, insertcolumn } from './transformations/columns.js';
import { rowdelete, insertrow } from './transformations/rows.js';
import { rowstocolumns } from './transformations/transpose.js';
import { tohtmltable } from './formatters/html.js';
import { pipe } from './utils/functional.js';

/**
 * Generates a default output path based on input path and format
 * @param {string} inputPath - Path to the input file
 * @param {boolean} isHtml - Whether the output is HTML
 * @returns {string} Default output path
 */
const getDefaultOutputPath = (inputPath, isHtml) => {
  const dir = path.dirname(inputPath);
  const filename = path.basename(inputPath, '.csv');
  const extension = isHtml ? '.html' : '.csv';
  return path.join(dir, `${filename}_processed${extension}`);
};

/**
 * Processes a CSV file according to the specified operations
 * @param {string} inputPath - Path to the input CSV file
 * @param {Object} options - Processing options
 * @param {boolean} options.toHtml - Whether to convert to HTML
 * @param {number[]} options.swap - Columns to swap [n, m]
 * @param {number} options.deleteRow - Row to delete
 * @param {number} options.deleteColumn - Column to delete
 * @param {string} options.outputPath - Path for the output file
 * @returns {Promise<string>} Processed content
 */
const processCSV = async (inputPath, options = {}) => {
  try {
    // Read the input file
    const csvContent = await fs.readFile(inputPath, 'utf-8');
    
    // Create transformation pipeline based on options
    const transformations = [parseCSV];
    
    if (options.swap) {
      transformations.push(swap(options.swap[0], options.swap[1]));
    }
    if (options.deleteRow) {
      transformations.push(rowdelete(options.deleteRow));
    }
    if (options.deleteColumn) {
      transformations.push(columndelete(options.deleteColumn));
    }
    if (options.transpose) {
      transformations.push(rowstocolumns);
    }
    if (options.toHtml) {
      transformations.push(tohtmltable);
    } else {
      transformations.push(serializeCSV);
    }

    // Apply transformations
    const transform = pipe(...transformations);
    return transform(csvContent);
  } catch (error) {
    console.error('Error processing CSV:', error.message);
    throw error;
  }
};

/**
 * Main CLI function
 * @param {string[]} args - Command line arguments
 */
export const runCLI = async (args) => {
  try {
    // Parse command line arguments
    const inputPath = args[2];
    if (!inputPath) {
      console.error('Please provide an input CSV file path');
      console.log('Usage: node src/cli.js <input.csv> [options]');
      console.log('\nOptions:');
      console.log('  --swap <n> <m>        Swap columns n and m');
      console.log('  --delete-row <n>      Delete row n');
      console.log('  --delete-column <n>   Delete column n');
      console.log('  --transpose           Transpose the matrix');
      console.log('  --to-html            Convert to HTML');
      console.log('  --output <path>      Specify output file path');
      process.exit(1);
    }

    // Parse options
    const options = {};
    for (let i = 3; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case '--swap':
          options.swap = [parseInt(args[++i]), parseInt(args[++i])];
          break;
        case '--delete-row':
          options.deleteRow = parseInt(args[++i]);
          break;
        case '--delete-column':
          options.deleteColumn = parseInt(args[++i]);
          break;
        case '--transpose':
          options.transpose = true;
          break;
        case '--to-html':
          options.toHtml = true;
          break;
        case '--output':
          options.outputPath = args[++i];
          break;
        default:
          console.error(`Unknown option: ${arg}`);
          process.exit(1);
      }
    }

    // Process the CSV file
    const result = await processCSV(inputPath, options);

    // Determine output path
    const outputPath = options.outputPath || getDefaultOutputPath(inputPath, options.toHtml);

    // Write the result
    await fs.writeFile(outputPath, result);
    console.log(`Successfully processed ${inputPath}`);
    console.log(`Output written to ${outputPath}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

// Execute CLI if this file is run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runCLI(process.argv);
} 