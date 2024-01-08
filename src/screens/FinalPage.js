import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from 'react-router-dom';
import sendRequest from "../components/utilFetch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,  PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Map from "../components/Map";

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
        console.error("falla final", error);
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


  return (
    <div className="screen">
      < >
      <NavBar />
      <div className="contenidor">
        <p className="titolHome">¡Gracias por completar el cuestionario!</p>
        <div className="cards">
          <div className='cardsHome' style={{gridTemplateColumns: 'repeat(auto-fit, minmax(min(28rem, 100%), 1fr))',margin: '0px 20px 20px 20px', width: 'auto'}}>
            {estadistiques.map((grafic, index) => grafic.tipusGrafic !== 'Mapa' && (
            <div key={index}>
              <div className="information [ cardEnquesta ]" style={{margin: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
                <h2 className="titleHome" style={{textAlign:'center'}}>{grafic.nom}</h2>
                {grafic.tipusGrafic === 'Barplot' && 
                <ResponsiveContainer width="95%" height={300}>
                  <BarChart data={transformarResultados(grafic.resultats)}  barCategoryGap={10} >    
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      interval={0}
                      dy={15}
                      tick={(props) => {
                        const maxLength = window.innerWidth > 768 ? 10 : 4; ; // Número máximo de caracteres a mostrar
                        const truncatedValue = props.payload.value.length > maxLength
                            ? `${props.payload.value.substring(0, maxLength)}...`
                            : props.payload.value;
                
                        return (
                            <text {...props}>
                                {truncatedValue}
                            </text>
                        );
                    }}
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
                  <LineChart data={transformarResultados(grafic.resultats, grafic.tipusGrafic)}>
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
                }
              </div>
            </div>
            ))}
          </div>

          <div className='cardsHome' style={{marginBottom: '10px'}}>
            {estadistiques.map((grafic, index) => (
              grafic.tipusGrafic === 'Mapa' &&
              (<div key={index}>
                <div className="information [ cardEnquesta ]" style={{paddingLeft: '0px', paddingRight: '0px'}}>
                  <h2 className="titleHome" style={{textAlign:'center'}}>{grafic.nom}</h2>
                    <Map info={grafic.resultats} /> 
                </div>
              </div>)
            ))}
          </div>
        </div>
      </div>
    </>
    </div>
  );
};

export default FinalPage;
