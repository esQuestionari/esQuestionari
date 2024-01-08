import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

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

  // Función para obtener la opción más escogida
  const obtenerOpcionMasEscogida = () => {
    const opcionMasEscogida = resultadosTransformados.reduce((max, current) =>
      current.respuestas > max.respuestas ? current : max
    );
    return opcionMasEscogida.name;
  };

  // Función para obtener la opción menos escogida
  const obtenerOpcionMenosEscogida = () => {
    const opcionMenosEscogida = resultadosTransformados.reduce((min, current) =>
      current.respuestas < min.respuestas ? current : min
    );
    return opcionMenosEscogida.name;
  };

  // Función para obtener la cantidad de opciones únicas
  const obtenerCantidadOpcionesUnicas = () => {
    return resultadosTransformados.length;
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
            <LineChart data={transformarResultados(grafic.resultats, grafic.tipusGrafic)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="respuestas" stroke="#8884d8"  />
            </LineChart>
        </ResponsiveContainer>
    <div className="information [ cardEnquesta ]" style={{margin: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
      <h2 className="titleHome" style={{textAlign:'center'}}>Resumen</h2>
      <div className="resumen">
        <p>
          <strong>Opción más escogida: </strong>
          {obtenerOpcionMasEscogida()}
        </p>
        <p>
          <strong>Opción menos escogida: </strong>
          {obtenerOpcionMenosEscogida()}
        </p>
        <p>
          <strong>Cantidad de opciones únicas: </strong>
          {obtenerCantidadOpcionesUnicas()}
        </p>
        <p>
          <strong>Porcentaje de valores faltantes: </strong>
          {obtenerPorcentajeValoresFaltantes()}%
        </p>
      </div>

    </div>
    </div>
  );
};

export default BarChartPro;
