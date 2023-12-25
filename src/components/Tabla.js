import React, {useState} from 'react';
import { useTable, useSortBy } from 'react-table';
import { saveAs } from 'file-saver';

const Tabla = ({ preguntes, info }) => {
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const columns = React.useMemo(() => {
    const columnas = preguntes.map((pregunta) => {
      const key = Object.keys(pregunta)[0];
      const value = pregunta[key];

      return {
        Header: value,
        accessor: key,
      };
    });

    return columnas;
  }, [preguntes]);
  
  const data = React.useMemo(() => info, [info]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  const downloadCSV = () => {
    const csvData = rows.map((row) =>
      row.cells.map((cell) => {
        return typeof cell.value === 'object' ? JSON.stringify(cell.value) : cell.value;
      }).join(',')
    );

    const csvString = [columns.map((column) => column.Header), ...csvData].join('\n');

    const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });

    saveAs(csvBlob, 'respostes.csv');
  };

  return (
    <>
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
                 <th  {...column.getHeaderProps(column.getSortByToggleProps())} 
                      style={{ padding: '8px', textAlign: 'center', position: 'relative', minWidth: '130px', cursor: 'pointer' }} 
                      onMouseEnter={() => setHoveredColumn(column.id)}
                      onMouseLeave={() => setHoveredColumn(null)}
                  >
                  <div className="header-cell-content" style={{ maxHeight: hoveredColumn === column.id ? 'none' : '100px', overflow: 'hidden' }}>
                    {column.render('Header')}
                  </div>
                  <div className="sort-indicator" style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', color: 'rgba(128, 128, 128, 0.7)' }}>
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
                    <td {...cell.getCellProps()} style={{ padding: '8px', textAlign: 'left', height: '100px', overflow:'hidden'}}>
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
    <br/>
    <button className="button" onClick={downloadCSV}>
      <span>Descargar</span>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
      </svg>
    </button>
   </>
  );
};

export default Tabla;
