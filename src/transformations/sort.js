/**
 * Ordena las filas de una matriz CSV basándose en una columna específica.
 * La primera fila se asume que es el encabezado y se mantiene sin ordenar.
 *
 * @param {string[][]} matrix - La matriz CSV.
 * @param {number} col - Número de columna (1-indexado) a usar para la comparación.
 * @param {string} [direction='asc'] - Dirección de orden: 'asc' para ascendente, 'desc' para descendente.
 * @returns {string[][]} Matriz con las filas ordenadas.
 */
export const sortByColumn = (col, direction = 'asc') => (matrix) => {
    // Si la matriz está vacía o solo tiene una fila (encabezado), no se ordena.
    if (matrix.length <= 1) return matrix;
  
    // Se copia la cabecera y se separa el resto de filas.
    const [header, ...rows] = matrix;
    
    // Ajustar el índice a 0-indexado.
    const index = col - 1;
  
    // Ordenar las filas
    rows.sort((a, b) => {
      // Convertir a números si es posible, de lo contrario comparar como strings.
      const aValue = isNaN(a[index]) ? a[index] : parseFloat(a[index]);
      const bValue = isNaN(b[index]) ? b[index] : parseFloat(b[index]);
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  
    // Recombinar la cabecera con las filas ordenadas
    return [header, ...rows];
  };
  