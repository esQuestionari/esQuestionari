import React, { useState, useEffect, useRef } from "react";
import sendRequest from "../components/utilFetch";
import sendRequestWithStatus from "../components/utilFetchMarc";
import { isWithinInterval, isToday } from 'date-fns';
import NavBar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';

import "../style/W3.css"


const Home = () => {
  const navigate = useNavigate();
  const [enquestes, setEnquestes] = useState([]);
  const [infoUser, setInfoUser] = useState(null);
  const scrollContainerRef = useRef(null);

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
      return result;
    } catch (error) {
      console.error("falla home", error);
    }
  };

  const initializeData = async () => {
    const enquestes = await handleEnquestes();
    await setProgres(enquestes);
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    initializeData();
  }, []);

  const updateUserInfo = async (email) => {
    try {
      const response = await sendRequestWithStatus({
        url: `http://nattech.fib.upc.edu:40511/api/usuaris?email=${email}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log("response", response);
      return response;

    } catch (error) {
      console.error("falla email", error);
    }
  }


  const setProgres = async (enquestes) => {
    const info = JSON.parse(localStorage.getItem('infoUser'));
    console.log('infoUser: ', info);

    let progres = {};

    if (info && info.email) {
      const response = await updateUserInfo(info.email);

      if (response.status === 200) {
        let result = response.data;
  
        // Check if the response includes a unique ID
        if (result.length > 0) {
          result = result[0];
          localStorage.setItem('infoUser', JSON.stringify(result));
          setInfoUser(result);
          progres = result.progres;
        } 
      }
      else {
        // Handle other status codes
        alert('Server error2. Please try again.');
      }
      console.log("progres: ", progres)
    }
    updateprogres(progres, enquestes);  
  };


  const updateprogres = (progresArray, enquestes) => {
    const updatedData = enquestes.map((item) => {
      const id = item.id;
      const progres = progresArray[id]
      if (progres) {
        if (progres === "ACABADA") {
          item.progres = 100;
        }
        else {
          item.progres = progres*100 /item.apartats.length;
        }
      }

      else {
        item.progres = 0;
      }

      return item;
    });
    console.log("updated enquestes amb progres: ", updatedData);
  
    setEnquestes(updatedData);
  };


  const enquestaDisponible = (enquesta) => {
    const fechaHoy = new Date();
    const fechaInicio = new Date(enquesta.dataInici);
    const fechaFin = new Date(enquesta.dataFi);
    return isWithinInterval(fechaHoy, { start: fechaInicio, end: fechaFin }) || isToday(fechaInicio) || isToday(fechaFin);
  };

  const handleStart = (enquesta) => {
    if (infoUser && enquesta.progres > 0) {
      navigate(`/encuestas/${enquesta.id}`);
    }
    else {
      navigate(`/encuestas/${enquesta.id}/Info`);
    }
  };

  const handleResultats = (enquestaId) => {
    navigate(`/encuestas/${enquestaId}/admin`);
  };  

  const getColorProgresBar = (progres) => {
    let color = 'green';
    if (progres < 26) color = 'red';
    else if (progres < 51) color = 'orange';
    else if (progres < 76) color = 'yellow';
    return `w3-container w3-${color} w3-round-xlarge`;
  }

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
                    {enquesta.progres !== 0 && 
                    (<div style={{paddingBottom: '15px'}}>
                      <div className="w3-light-grey w3-round-xlarge" style={{height: '8px'}}>
                        <div className={getColorProgresBar(enquesta.progres)} style={{width: `calc(${enquesta.progres} * 0.9%)`, height: '8px', fontSize: '10px'}}></div>
                      </div>
                    </div>)}
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
                    {enquesta.progres !== 100 && (<button className="button" onClick={() => handleStart(enquesta)}>
                      <span>{enquesta.progres > 0 ? "Reanudar" : "Empezar" }</span>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 20" width="24px" fill="none">
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                      </svg>
                    </button>)}
                    {infoUser && infoUser.esAdmin && (<button className="buttonResultats" onClick={() => handleResultats(enquesta.id)}>
                      <span>Resultados</span>
                      <svg className="svg-icon" viewBox="0 0 20 20" width="24px" fill="none">
                      <path d="M17.431,2.156h-3.715c-0.228,0-0.413,0.186-0.413,0.413v6.973h-2.89V6.687c0-0.229-0.186-0.413-0.413-0.413H6.285c-0.228,0-0.413,0.184-0.413,0.413v6.388H2.569c-0.227,0-0.413,0.187-0.413,0.413v3.942c0,0.228,0.186,0.413,0.413,0.413h14.862c0.228,0,0.413-0.186,0.413-0.413V2.569C17.844,2.342,17.658,2.156,17.431,2.156 M5.872,17.019h-2.89v-3.117h2.89V17.019zM9.587,17.019h-2.89V7.1h2.89V17.019z M13.303,17.019h-2.89v-6.651h2.89V17.019z M17.019,17.019h-2.891V2.982h2.891V17.019z" fill="currentColor" stroke="currentColor" strokeWidth="0.6"></path>
                      </svg>
                    </button>)}
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
