import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from 'react-router-dom';
import sendRequest from "../components/utilFetch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,  PieChart, Pie, Cell } from 'recharts';

const FinalPage = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();
  const [estadistiques, setEstadistiques] = useState([]);

  useEffect(() => {
    const handleEnquestes = async () => {
      try {
        const result = await sendRequest({
          url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}/estadistiques`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        console.log(result);
        setEstadistiques(result);
      } catch (error) {
        console.error("falla home", error);
      }
    };

    handleEnquestes();
  }, [enquestaId]);

  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [email2, setEmail2] = useState('');

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

  const transformarResultados = (resultados, tipus) => {
    if (tipus === 'Lineplot') {
      let acumulado = 0;

      return resultados.map((resultado) => {
        acumulado += resultado.respuestas;
        return {
          ...resultado,
          respuestas: acumulado,
        };
      });
    }
    return Object.keys(resultados).map((key) => ({
      name: key,
      respuestas: resultados[key],
    }));
  };


  const handleCheckbox1Change = () => {
    setCheckbox1(!checkbox1);
  };

  const handleCheckbox2Change = () => {
    setCheckbox2(!checkbox2);
  };

  const handleEmail2Change = (e) => {
    setEmail2(e.target.value);
  };

  const handleSave = () => {
    console.log("checkbox1", checkbox1);
    console.log("checkbox2", checkbox2);
    console.log("email2", email2);
    navigate("/");
  };

  return (
    <div className='h-full' style={{ backgroundColor: '#b9fbc0', height: '100%', width: '100%' }}>
      <NavBar />
      <div className='h-full' style={{ marginLeft: '20px' }}>
        <h2>¡Gracias por completar el cuestionario!</h2>
        <p>Selecciona las opciones deseadas:</p>
        <label>
          <input
            type="checkbox"
            checked={checkbox1}
            onChange={handleCheckbox1Change}
          />
          Opción 1
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={checkbox2}
            onChange={handleCheckbox2Change}
          />
          Opción 2
        </label>
        {(checkbox2 || checkbox1) && (
          <div>
            <label>
              Correo:
              <input type="text" value={email2} onChange={handleEmail2Change} />
            </label>
          </div>
        )}
        <br />
        <button className='buttonini' onClick={handleSave}>Guardar</button>
        
        {estadistiques.map((grafic, index) => (
          <div key={index}>
            {grafic.tipusGrafic === 'Barplot' && 
            <div >
               <text x={20} y={5} textAnchor="middle" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {grafic.nom}
              </text>
              <BarChart width={400} height={300} data={transformarResultados(grafic.resultats)}  barCategoryGap={10} >    
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  dy={15}
                  tick={(props) => (
                    <text {...props} >
                      {props.payload.value.length > 10 ? `${props.payload.value.substring(0, 10)}...` : props.payload.value}
                    </text>
                  )}
                />
                <YAxis />
                <Tooltip />
                
                <Bar dataKey="respuestas"  >
                {transformarResultados(grafic.resultats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={obtenerColorUnico(grafic.id, index)} />
                ))}
                </Bar>
              </BarChart> 
              </div>
            }
            {grafic.tipusGrafic === 'Lineplot' &&
            <div >
              <text x={20} y={5} textAnchor="middle" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {grafic.nom}
                </text>
              <LineChart width={400} height={300} data={transformarResultados(grafic.resultats, grafic.tipusGrafic)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="respuestas" stroke="#8884d8" />
              </LineChart>
              </div>
            }
            {grafic.tipusGrafic === 'Piechart' &&
            <div >
              <PieChart width={400} height={300}>
                <text  x={0} y={50} style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {grafic.nom}
                </text>
                <Pie
                  data={transformarResultados(grafic.resultats)}
                  cx={200}
                  cy={150}
                  startAngle={0}
                  endAngle={360}
                  outerRadius={80}
                  dataKey="respuestas"
                >
                  {transformarResultados(grafic.resultats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={obtenerColorUnico(grafic.id, index)} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinalPage;
