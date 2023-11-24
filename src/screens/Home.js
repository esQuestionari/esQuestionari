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

        console.log(result);
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

  return (
    <>
      <NavBar />
      <div className="enquestes">
        <h2> Selecciona una encuesta </h2>
        {enquestes.map((enquesta) => (
          <div key={enquesta.id}>
            {enquestaDisponible(enquesta) ? (
              <div className="surveyBox" style={{ display: 'flex', flexDirection: 'column', background: enquesta.color }}>
                <p className="titol">{enquesta.nom}</p>
                <p className="questionText">{enquesta.descripcio}</p>
                <div className="buttonContainer">
                  <button className='buttonini' onClick={() => handleStart(enquesta.id)}>
                    Start
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
