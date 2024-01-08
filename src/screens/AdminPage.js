import React, {useState, useEffect} from "react";
import NavBar from "../components/NavBar";
import Tabla from "../components/Tabla";
import sendRequest from "../components/utilFetch";
import BarChartPro from "../components/BarChartPro";
import LineChartPro from "../components/LineChartPro";
import PieChartPro from "../components/PieChartPro";
import { useParams } from 'react-router-dom';
import Map from "../components/Map";


const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [preguntes, setPreguntes] = useState(null);
  const [respostes, setRespostes] = useState(null);
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

  useEffect(() => {
    const handlePreguntes = async () => {
      try {
        const result = await sendRequest({
          url: `http://nattech.fib.upc.edu:40511/api/preguntes/?apartat__enquesta__in=${enquestaId}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const formattedPreguntes = result.map((pregunta) => {
          const formattedPregunta = {};
          formattedPregunta[pregunta.id] = pregunta.text;
          return formattedPregunta;
        });
        setPreguntes(formattedPreguntes);
      } catch (error) {
        console.error("falla admin preguntes", error);
      }
    };

    const handleRespostes = async () => {
      try {
        const result = await sendRequest({
          url: `http://nattech.fib.upc.edu:40511/api/respostes/?pregunta__apartat__enquesta=${enquestaId}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        const info = {};
        result.forEach((resposta) => {
          if (!info[resposta.usuari]) {
            info[resposta.usuari] = {
              usuari: resposta.usuari,
              data: resposta.data,
            };
          }
          info[resposta.usuari][resposta.pregunta] = resposta.valor;
        });
        const infoArray = Object.values(info);

        setRespostes(infoArray);
      } catch (error) {
        console.error("falla admin preguntes", error);
      }
    };

    handlePreguntes();
    handleRespostes();
  }, [enquestaId]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInfo = respostes?.filter((item) => {
    return Object.entries(item)
      .filter(([key]) => key !== 'usuari') 
      .some(([key, value]) => value.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
      < >  <NavBar />
      <div className="contenidor">
      <div className="cards">
        <div className="cardsTabla" >
          <div>
            <div className="information [ cardEnquesta ]">
              <h2 className="titleHome">Descarga respuestas</h2>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {(preguntes !== null && respostes !== null) ? (
                <Tabla preguntes={preguntes} info={filteredInfo} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
          <div className='cardsHome' style={{gridTemplateColumns: 'repeat(auto-fit, minmax(min(28rem, 100%), 1fr))',margin: '0px 20px 20px 20px', width: 'auto'}}>
            {estadistiques.map((grafic, index) => grafic.tipusGrafic !== 'Mapa' && (
            <div key={index}>
              <div className="information [ cardEnquesta ]" style={{margin: '0px', paddingLeft: '0px', paddingRight: '0px'}}>
                <h2 className="titleHome" style={{textAlign:'center'}}>{grafic.nom}</h2>
                {grafic.tipusGrafic === 'Barplot' && 
                  <BarChartPro grafic={grafic}/>
                }
                {grafic.tipusGrafic === 'Temporal' &&
                  <LineChartPro grafic={grafic}/>
                }
                {grafic.tipusGrafic === 'Piechart' &&
                  <PieChartPro grafic={grafic}/>
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
      </div>
      </>
    </div>
  );
};


export default AdminPage;