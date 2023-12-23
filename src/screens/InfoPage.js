import React, { useState, useEffect} from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from 'react-router-dom';
import sendRequest from "../components/utilFetch";



const InfoPage = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();

  const [titleText, setTitletext] = useState("");
  const [infoText, setInfotext] = useState("");

  useEffect(() => {
    const handleInfo = async () => {
      try {
        const result = await sendRequest({
          url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json',
          },
        });
        console.log(result);
        setInfotext(result.introduccio)
        setTitletext(result.nom)
      } catch(error) {
        console.error("Falla InfoPage(mai falla ;)", error);
      }
    };
    handleInfo();
  }, []);

  const handleStart = () => {
    navigate(`/encuestas/${enquestaId}/TermsConditions`);
  }

  const lineas = infoText.split('\\n');
  console.log(lineas)

  return (
    <div className="screen">
      < >  <NavBar />
      <div className="contenidor">
        <div className="cards">
          <div>
            <div className="information [ cardEnquesta ]">
              <h2 className="titleHome">{titleText}</h2>
              {lineas.map((linea, index) => (
                <p key={index} style={{color:'#5E5E5E', textAlign: "justify" }}>{linea}</p>
              ))}
              <button className="button" onClick={() => handleStart()}>
                <span>Empezar</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 20" width="24px" fill="none">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
      </div>
     
      </>
    </div>
  );
};

export default InfoPage;