import React, { useState, useEffect, useRef } from "react";
import sendRequest from "../components/utilFetch";
import { isWithinInterval, isToday } from 'date-fns';
import NavBar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  const [enquestes, setEnquestes] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    const handleEnquestes = async () => {
      try {
        const result = await sendRequest({
          url: 'http://nattech.fib.upc.edu:40511/api/enquestes/',
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log(result)
        result.sort((a, b) => a.id - b.id);
        setEnquestes(result);
      } catch (error) {
        console.error("falla home", error);
      }
    };

    handleEnquestes();
  }, []);


  const enquestaDisponible = (enquesta) => {
    const fechaHoy = new Date();
    const fechaInicio = new Date(enquesta.dataInici);
    const fechaFin = new Date(enquesta.dataFi);
    return isWithinInterval(fechaHoy, { start: fechaInicio, end: fechaFin }) || isToday(fechaInicio) || isToday(fechaFin);
  };

  const handleStart = (enquestaId) => {
    navigate(`/encuestas/${enquestaId}/Info`);
  };

  const handleResultats = (enquestaId) => {
    navigate(`/encuestas/${enquestaId}/admin`);
  };  

  return (
    <div className="screen">
    <> 
      <NavBar  />
      <div className="contenidor">
        <p className="titolHome"> Selecciona una encuesta </p>
        <div className="cards" ref={scrollContainerRef}>
          {enquestes.map((enquesta) => (
            <div key={enquesta.id}>
              {enquestaDisponible(enquesta) ? (
                  <div className="information [ cardEnquesta ]">
                    <div className='tags'>
                      {enquesta.etiquetes.map((tag, index) => (
                        <span
                          key={index}
                          className="tag"
                          style={{
                            color: tag.color,
                            backgroundColor: tag.colorFons,
                          }}
                        >
                          {tag.nom}
                        </span>
                      ))}
                    </div>
                    <h2 className="titleHome">{enquesta.nom}</h2>
                    <p className="infoHome">{enquesta.descripcio}</p>
                    <p className="duracio">⌛ Duración: {enquesta.durada}</p> 
                    <button className="button" onClick={() => handleStart(enquesta.id)}>
                      <span>Empezar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 20" width="24px" fill="none">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                      </svg>
                    </button>
                    <button className="buttonResultats" onClick={() => handleResultats(enquesta.id)}>
                      <span>Resultados</span>
                      <svg className="svg-icon" viewBox="0 0 20 20" width="24px" fill="none">
                      <path d="M17.431,2.156h-3.715c-0.228,0-0.413,0.186-0.413,0.413v6.973h-2.89V6.687c0-0.229-0.186-0.413-0.413-0.413H6.285c-0.228,0-0.413,0.184-0.413,0.413v6.388H2.569c-0.227,0-0.413,0.187-0.413,0.413v3.942c0,0.228,0.186,0.413,0.413,0.413h14.862c0.228,0,0.413-0.186,0.413-0.413V2.569C17.844,2.342,17.658,2.156,17.431,2.156 M5.872,17.019h-2.89v-3.117h2.89V17.019zM9.587,17.019h-2.89V7.1h2.89V17.019z M13.303,17.019h-2.89v-6.651h2.89V17.019z M17.019,17.019h-2.891V2.982h2.891V17.019z" fill="currentColor" stroke="currentColor" strokeWidth="0.6"></path>
                      </svg>
                    </button>
                  </div>
            ) : null}
          </div>
        ))}
        </div>
       
      </div>
    </>
    </div>
  );
};

export default Home;
