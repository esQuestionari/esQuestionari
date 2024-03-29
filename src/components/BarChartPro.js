import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

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

  const obtenerOpcionMasEscogidaConPorcentaje = () => {
    const totalRespuestas = resultadosTransformados.reduce((total, current) => total + current.respuestas, 0);
  
    // Encuentra la opción más escogida
    const opcionMasEscogida = resultadosTransformados.reduce((max, current) =>
      current.respuestas > max.respuestas ? current : max
    );
  
    // Calcula el porcentaje
    const porcentajeEscogida = (opcionMasEscogida.respuestas / totalRespuestas) * 100;
  
    return {
      opcion: opcionMasEscogida.name,
      porcentaje: porcentajeEscogida.toFixed(2), // Limita el resultado a dos decimales
    };
  };


  // Función para obtener la opción menos escogida
  const obtenerOpcionMenosEscogida = () => {
    const totalRespuestas = resultadosTransformados.reduce((total, current) => total + current.respuestas, 0);

    const opcionMenosEscogida = resultadosTransformados.reduce((min, current) =>
      current.respuestas < min.respuestas ? current : min
    );
    const porcentajeEscogida = (opcionMenosEscogida.respuestas / totalRespuestas) * 100;

    console.log("opcionMenosEscogida", opcionMenosEscogida.name, "porcentajeEscogida", porcentajeEscogida.toFixed(2));
    return {
      opcion2: opcionMenosEscogida.name,
      porcentaje2: porcentajeEscogida.toFixed(2),
    }
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


  const { opcion, porcentaje } = obtenerOpcionMasEscogidaConPorcentaje();
  const { opcion2, porcentaje2 } = obtenerOpcionMenosEscogida();


  return (
    <div >
    <ResponsiveContainer width="95%" height={300}>
      <BarChart data={resultadosTransformados} barCategoryGap={10}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          interval={0}
          dy={15}
          tick={(props) => {
            const maxLength = window.innerWidth > 768 ? 10 : 4;
            const truncatedValue =
              props.payload.value.length > maxLength
                ? `${props.payload.value.substring(0, maxLength)}...`
                : props.payload.value;

            return <text {...props}>{truncatedValue}</text>;
          }}
        />
        <YAxis />
        <Tooltip />

        <Bar dataKey="respuestas">
          {resultadosTransformados.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={obtenerColorUnico(grafic.id, index)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
      <h2 className="titleHome" style={{textAlign:'center'}}>Resumen</h2>
      <div className="resumen" style={{margin: '10px'}}>
        <p>
          <strong>Opción más escogida: </strong>
          {opcion}  ({porcentaje}%)
        </p>
        <p>
          <strong>Opción menos escogida: </strong>
          {opcion2} ({porcentaje2}%)
        </p>
      </div>
    </div>
  );
};

export default BarChartPro;
