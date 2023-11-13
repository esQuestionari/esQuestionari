import React,  { useState, useEffect }  from "react";
import { Link } from "react-router-dom";
import sendRequest from "../components/utilFetch";
import { isWithinInterval, parse, isToday } from 'date-fns';
import NavBar from "../components/NavBar";

const Home = () => {
    const [enquestes, setEnquestes] = useState([]);

    useEffect(() => {
      const handleEnquestes = async () => {

        try {
          const result = await sendRequest({
            url: 'http://hattech.fib.upc.edu:40511/api/enquestes/',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          console.log(result); 
           //setEnquestes(data);
        } catch (error) {
          console.error("falla home", error); 
        }
       
        const enq = [
          { id: 1, nom: 'Encuesta 1', descripcio: 'prova 0', dataInici: '12-12-2022', dataFi: '12-12-2023', color: '#4CAF50'},
          { id: 2, nom: 'Encuesta 2', descripcio: 'prova 1', dataInici: '12-12-2022', dataFi: '12-11-2023', color: '#4CAF54'},
          { id: 3, nom: 'Encuesta 3', descripcio: 'prova 2', dataInici: '12-12-2023', dataFi: '12-12-2023', color: '#4CAF58'},
        ];
        setEnquestes(enq);
      };
  
    handleEnquestes();
    }, []);

    const enquestaDisponible = (enquesta) => {
        const fechaHoy = new Date();
        const fechaInicio = parse(enquesta.dataInici, 'dd-MM-yyyy', new Date());
        const fechaFin = parse(enquesta.dataFi, 'dd-MM-yyyy', new Date());
        return isWithinInterval(fechaHoy, { start: fechaInicio, end: fechaFin }) || isToday(fechaInicio) || isToday(fechaFin);
      };


  return (
    <>  <NavBar />
    <div className="enquestes" >
        <h2> Selecciona una encuesta </h2>
        {enquestes.map((enquesta) => (
          <div key={enquesta.id}>
            {enquestaDisponible(enquesta) ? (
                <div className="surveyBox" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3>{enquesta.nom}</h3>
                    <p>{enquesta.descripcio}</p>
                    <Link to="/formPage" className="buttonini" > Start </Link>
                </div>
            ): null }
          </div>
        ))}
    </div>
    </>
  );
};

export default Home;