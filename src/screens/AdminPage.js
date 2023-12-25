import React, {useState, useEffect} from "react";
import NavBar from "../components/NavBar";
import Tabla from "../components/Tabla";
import sendRequest from "../components/utilFetch";
import { useParams } from 'react-router-dom';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [preguntes, setPreguntes] = useState(null);
  const [respostes, setRespostes] = useState(null);
  const { enquestaId } = useParams();

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



  return (
    <div className="screen">
      < >  <NavBar />
      <div className="contenidor">
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
                <Tabla preguntes={preguntes} info={respostes} />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </>
    </div>
  );
};


export default AdminPage;