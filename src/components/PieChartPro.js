import React from 'react';
import { PieChart, Pie, Legend, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const BarChartPro = ({ grafic }) => {

    const transformarResultados = (resultados, tipus) => {
        if (tipus === 'Temporal') {
          const resultadosArray = Object.entries(resultados);
          const inici = [{ name: 'Inicio', respuestas: 0 }];
          let acumulado = 0;
          const resultadosTransformados = resultadosArray.map(([clave, valor, index]) => {
            acumulado += valor;
            return {
              name: clave,
              respuestas:  acumulado,
            };
          });
          const datosTransformados = inici.concat(resultadosTransformados);
          return datosTransformados;   
        }
        return Object.keys(resultados).map((key) => ({
          name: key,
          respuestas: resultados[key],
        }));
      };

      
  const resultadosTransformados = transformarResultados(grafic.resultats);

  const obtenerOpcionMasEscogida = () => {
    const totalRespuestas = resultadosTransformados.reduce((total, current) => total + current.respuestas, 0);

    const opcionMasEscogida = resultadosTransformados.reduce((max, current) =>
      current.respuestas > max.respuestas ? current : max
    );

    const porcentajeEscogida = (opcionMasEscogida.respuestas / totalRespuestas) * 100;
  
    return (
      <>
        {opcionMasEscogida.name}
        <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
          ({porcentajeEscogida}%)
        </span>
      </>
    );
  };
  
  const obtenerOpcionMenosEscogida = () => {
    const totalRespuestas = resultadosTransformados.reduce((total, current) => total + current.respuestas, 0);

    const opcionMenosEscogida = resultadosTransformados.reduce((min, current) =>
      current.respuestas < min.respuestas ? current : min
    );

    const porcentajeEscogida = (opcionMenosEscogida.respuestas / totalRespuestas) * 100;

    return (
      <>
        {opcionMenosEscogida.name}
        <span style={{ marginLeft: '5px', fontWeight: 'normal' }}>
          ({(porcentajeEscogida).toFixed(2)}%)
        </span>
      </>
    );
  };


  // Función para obtener el porcentaje de valores faltantes
  const obtenerPorcentajeValoresFaltantes = () => {
    const totalRespuestas = resultadosTransformados.reduce((total, current) => total + current.respuestas, 0);
    const totalPosiblesRespuestas = resultadosTransformados.length * (resultadosTransformados.length + 1) / 2;
    const porcentajeFaltante = ((totalPosiblesRespuestas - totalRespuestas) / totalPosiblesRespuestas) * 100;

    return porcentajeFaltante.toFixed(2); // Limita el resultado a dos decimales
  };

  function obtenerColorUnico(graficoIndex, entryIndex) {
    const base = 150;
    const factor = 50;
  
    const red = (base + (graficoIndex ) * factor) % 256;
    const green = (base + (graficoIndex ) * factor * 2) % 256;
    const blue = (base + (graficoIndex ) * factor * 3) % 256;
  
    const entryFactor = 20;
    const adjustedEntryIndex = (entryIndex + 1) * entryFactor;
  
    const finalRed = (red + adjustedEntryIndex) % 256;
    const finalGreen = (green + adjustedEntryIndex * 2) % 256;
    const finalBlue = (blue + adjustedEntryIndex * 3) % 256;
  
    return `rgb(${finalRed}, ${finalGreen}, ${finalBlue})`;
  }


  return (
    <div className="information [ cardEnquesta ]" style={{margin: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
        <ResponsiveContainer width="95%" height={300}>
                  <PieChart>
                    <Pie
                      data={transformarResultados(grafic.resultats)}

                      startAngle={0}
                      endAngle={360}
                      outerRadius={80}
                      dataKey="respuestas"
                      label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
                    >
                      {transformarResultados(grafic.resultats).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={obtenerColorUnico(grafic.id, index)} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                  </ResponsiveContainer>
    <div className="information [ cardEnquesta ]" style={{margin: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
      <h2 className="titleHome" style={{textAlign:'center'}}>Resumen</h2>
      <div className="resumen" style={{margin: '10px'}}>
        <p>
          <strong>Opción más escogida: </strong>
          {obtenerOpcionMasEscogida()}
        </p>
        <p>
          <strong>Opción menos escogida: </strong>
          {obtenerOpcionMenosEscogida()}
        </p>
      </div>

    </div>
    </div>
  );
};

export default BarChartPro;
