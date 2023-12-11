import React, { useState, useEffect } from "react";
import sendRequest from "../components/utilFetch";
import { isWithinInterval, isToday } from 'date-fns';
import NavBar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  const [enquestes, setEnquestes] = useState([]);


  useEffect(() => {
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
        result[1].nom = "Cuestionario Estudio RADONCOM"
        result[1].tags =  [
          { name: 'Cáncer', color: '#2F9E09', backgroundColor: '#D9FFC4' },	
          { name: 'Pulmón', color: '#6558d3', backgroundColor: '#f1eeff' },
        ]; 
        result[0].tags =  [
          { name: 'Otros', color: '#FF2D2D', backgroundColor: '#FFE4E1' },
        ]; 
        result[2].tags =  [
          { name: 'Cáncer', color: '#2F9E09', backgroundColor: '#D9FFC4' },	
          { name: 'Pulmón', color: '#6558d3', backgroundColor: '#f1eeff' },
        ]; 
        result[0].duracio = '⌛ Duración: 5 minutos';
        result[1].duracio = '⌛ Duración: 30 minutos';
        result[1].descripcio += " Añado un poco más de información para que parezca más realista. Una única línea de descripción no es demasiado típico. Aquí se debería añadir una pequeña introducción sobre la temática del estudio y la información que se espera obtener."
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
    navigate(`/${enquestaId}/InfoPage`);
  };

  // const tags = [
  //   { name: 'Cáncer', color: '#2F9E09', backgroundColor: '#D9FFC4' },	
  //   { name: 'Pulmón', color: '#6558d3', backgroundColor: '#f1eeff' },
  //   // Add more tags as needed
  // ];
  

  return (
    <div className="screen">
    <> 
      <NavBar  />
      <div className="contenidor">
        <p className="titolHome"> Selecciona una encuesta </p>
        <div className="cards">
          {enquestes.map((enquesta) => (
            <div key={enquesta.id}>
              {enquestaDisponible(enquesta) ? (
                  <div className="information [ cardEnquesta ]">
                    <div className='tags'>
                      {enquesta.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="tag"
                          style={{
                            color: tag.color,
                            backgroundColor: tag.backgroundColor,
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <h2 className="titleHome">{enquesta.nom}</h2>
                    <p className="infoHome">{enquesta.descripcio}</p>
                    <p className="duracio">{enquesta.duracio}</p> 
                    <button className="button" onClick={() => handleStart(enquesta.id)}>
                      <span>Empezar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
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
