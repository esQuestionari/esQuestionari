import React from 'react';
import { useTable, useSortBy } from 'react-table';

const TuTabla = ({ preguntes, info }) => {
  // Construir columnas dinámicamente basándonos en las preguntas
  const columns = React.useMemo(() => {
    const preguntasColumns = preguntes[0];
    return Object.keys(preguntasColumns).map((key) => ({
      Header: preguntasColumns[key],
      accessor: key,
    }));
  }, [preguntes]);

  // Construir datos de filas basándonos en la información de usuarios
  const data = React.useMemo(() => info, [info]);

  // Configurar la tabla con las columnas y los datos, incluyendo useSortBy
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div style={{ overflowX: 'auto', width: '100%', maxWidth: '100%' }}>
      {/* Contenedor adicional para el desplazamiento vertical */}
      <div style={{ overflowY: 'auto', maxHeight: '63vh' }}>
        {/* Utiliza maxHeight con un porcentaje (70vh en este caso) */}
        <table {...getTableProps()} style={{ borderCollapse: 'collapse',  width: '100%' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>
            <tr>
              <th colSpan={columns.length} style={{ borderBottom: '1px solid black' }}>
                {/* Línea separadora entre el encabezado y la primera fila */}
              </th>
            </tr>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} style={{ borderBottom: '1px solid black' }}>
                {headerGroup.headers.map((column) => (
                 <th  {...column.getHeaderProps(column.getSortByToggleProps())} style={{ padding: '8px', textAlign: 'center', position: 'relative', minWidth: '80px' }} >
                 {column.render('Header')}
                 <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', color: 'rgba(128, 128, 128, 0.7)'}}>
                   {column.isSorted ? (column.isSortedDesc ? 'X' : '▲') : '▼'}
                 </div>
               </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              const isLastRow = index === rows.length - 1;
              return (
                <tr {...row.getRowProps()} style={{ borderBottom: isLastRow ? 'none' : '1px solid black' }}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} style={{ padding: '8px', textAlign: 'left' }}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TuTabla;
