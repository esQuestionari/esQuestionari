import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from 'react-router-dom';
import sendRequest from "../components/utilFetch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,  PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
    <>
      <NavBar />
      <div className="contenidor">
        <p className="titolHome">¡Gracias por completar el cuestionario!</p>


        <div className="cards">
          <div className="information [ cardEnquesta ]" style={{flexDirection: 'row'}}>
            <h2 className="titleHome" style={{fontSize: '20px'}}>Selecciona las opciones deseadas</h2>
            <div style={{margin: '15px 0 15px 0'}}>
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
                <div style={{marginTop: '15px'}}>
                  <label>
                    Correo:   
                    <input type="text" value={email2} onChange={handleEmail2Change} />
                  </label>
                </div>
              )}
            </div>
            <button className="button" onClick={handleSave}>
              <span>Guardar</span>
              <svg class="svg-icon" height="24px" viewBox="0 0 24 20" width="24px" fill="none">
                <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" fill="currentColor" stroke="currentColor" stroke-width="1"></path>
              </svg>
            </button>
          </div>







          {estadistiques.map((grafic, index) => (
            <div className="information [ cardEnquesta ]" style={{width: 'calc(100% - 40px)'}}>
              <h2 className="titleHome" style={{textAlign:'center'}}>{grafic.nom}</h2>
              {grafic.tipusGrafic === 'Barplot' && 
              <ResponsiveContainer width="95%" height={300}>
                <BarChart data={transformarResultados(grafic.resultats)}  barCategoryGap={10} >    
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
              </ResponsiveContainer>
              }
              {grafic.tipusGrafic === 'Temporal' &&
              <ResponsiveContainer width="95%" height={300}>
                <LineChart width={400} height={300} data={transformarResultados(grafic.resultats, grafic.tipusGrafic)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="respuestas" stroke="#8884d8"  />
                </LineChart>
                </ResponsiveContainer>
              }
              {grafic.tipusGrafic === 'Piechart' &&
              <ResponsiveContainer width="95%" height={300}>
                <PieChart width={400} height={300}>
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
                </ResponsiveContainer>
              }
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FinalPage;
