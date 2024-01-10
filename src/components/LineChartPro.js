import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const BarChartPro = ({ grafic }) => {


      const encontrarMesConMayorCambio = (resultadosTransformados) => {
        let mesMayorCambio = null;
        let mayorCambio = 0;
      
        resultadosTransformados.forEach(({ name, cambioRespuestas }) => {
          if (cambioRespuestas > mayorCambio) {
            mayorCambio = cambioRespuestas;
            mesMayorCambio = name;
          }
        });
      
        return mesMayorCambio;
      };

      const encontrarMesConMenosRespuestas = (resultadosTransformados) => {
        let mesMenosRespuestas = null;
        let menosRespuestas = Number.MAX_SAFE_INTEGER;
      
        resultadosTransformados.forEach(({ name, respuestas }) => {
          if (respuestas < menosRespuestas) {
            menosRespuestas = respuestas;
            mesMenosRespuestas = name;
          }
        });
      
        return mesMenosRespuestas;
      };
      

      const transformarResultados = (resultados, tipus) => {
        if (tipus === 'Temporal') {
          const resultadosArray = Object.entries(resultados);
          const inici = [{ name: 'Inicio', respuestas:0, cambioRespuestas:0 }];
          let acumulado = 0;

          const resultadosTransformados = resultadosArray.map(([clave, valor], index) => {
            acumulado += valor;
      
            let cambioRespuestas = resultadosArray[index][1];
            if (index > 0) {
              cambioRespuestas =  acumulado - resultadosArray[index - 1][1];
            }

            return {
              name: clave,
              respuestas: acumulado,
              cambioRespuestas,
            };
          });
      
          return inici.concat(resultadosTransformados);
        }
      return Object.keys(resultados).map((key, index) => ({
        name: key,
        respuestas: resultados[key],
        cambioRespuestas: resultados[key],
      }));
    };


      
  const resultadosTransformados = transformarResultados(grafic.resultats);
  const mesMayorCambio = encontrarMesConMayorCambio(resultadosTransformados);
  const mesMenosRespuestas = encontrarMesConMenosRespuestas(resultadosTransformados);

  return (
    <div >
        <ResponsiveContainer width="95%" height={300}>
            <LineChart data={transformarResultados(grafic.resultats, grafic.tipusGrafic)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="respuestas" stroke="#8884d8"  />
            </LineChart>
        </ResponsiveContainer>
      <h2 className="titleHome" style={{textAlign:'center'}}>Resumen</h2>
      <div className="resumen" style={{margin: '10px'}}>
        <p>
            <strong>Mes con más respuestas: </strong>
            {mesMayorCambio}
          </p>
          <p>
            <strong>Mes con menos respuestas: </strong>
            {mesMenosRespuestas}
          </p>
      </div>

    </div>
  );
};

export default BarChartPro;
