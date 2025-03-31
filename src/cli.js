import fs from 'fs/promises';
import path from 'path';
import { parseCSV, serializeCSV } from './utils/parsing.js';
import { swap, columndelete } from './transformations/columns.js';
import { rowdelete } from './transformations/rows.js';
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
 * Creates and returns a transformation pipeline based on options
 * @param {Object} options - Processing options
 * @returns {Function[]} Array of transformation functions
 */
const createTransformationPipeline = (options) => {
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
  
  // Final output format
  if (options.toHtml) {
    transformations.push(tohtmltable);
  } else {
    transformations.push(serializeCSV);
  }
  
  return transformations;
};

/**
 * Processes a CSV file according to the specified operations
 * @param {string} inputPath - Path to the input CSV file
 * @param {Object} options - Processing options
 * @returns {Promise<string>} Processed content
 */
const processCSV = async (inputPath, options = {}) => {
  try {
    // Read the input file
    const csvContent = await fs.readFile(inputPath, 'utf-8');
    
    // Create and apply transformation pipeline
    const transformations = createTransformationPipeline(options);
    const transform = pipe(...transformations);
    
    return transform(csvContent);
  } catch (error) {
    console.error('Error processing CSV:', error.message);
    throw error;
  }
};

/**
 * Displays usage information for the CLI
 */
const showUsage = () => {
  console.log('Usage: node src/cli.js <input.csv> [options]');
  console.log('\nOptions:');
  console.log('  --swap <n> <m>        Swap columns n and m');
  console.log('  --delete-row <n>      Delete row n');
  console.log('  --delete-column <n>   Delete column n');
  console.log('  --transpose           Transpose the matrix');
  console.log('  --to-html             Convert to HTML');
  console.log('  --output <path>       Specify output file path');
};

/**
 * Parses command line arguments into an options object
 * @param {string[]} args - Command line arguments
 * @returns {Object} Parsed options
 */
const parseOptions = (args) => {
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
  
  return options;
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
      showUsage();
      process.exit(1);
    }

    // Parse options
    const options = parseOptions(args);

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