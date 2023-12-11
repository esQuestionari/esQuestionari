import React, { useState, useEffect} from "react";
import NavBar from "../components/NavBar";
import '../style/Toggle.css';
import { useNavigate, useParams } from 'react-router-dom';
import sendRequest from "../components/utilFetch";

const Terms = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();

  useEffect(() => {
    const handleTerms = async () => {
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
        setTermsConditions(result.condicions)
      } catch(error) {
        console.error("Falla terms&conditions(mai falla ;)", error);
      }
    };
    handleTerms();
  }, []);

  const [isEnabled, setIsEnabled] = useState(false);
  const [termsConditions, setTermsConditions] = useState([]);
  const handleContinue = () => {
    navigate(`/${enquestaId}/email`);
  }

  return (
    <div className="screen">
      < > 
    <NavBar  />
    <div className="contenidor">
        <div className="cards">
          <div>
            <div className="information [ cardEnquesta ]">
              <h2 className="titleHome">Términos y condiciones</h2>
              
              
              {termsConditions.map((item, index) => (
                <div key={index} className="infoHome" style={{color:'#5E5E5E'}}>
                  {index === 0 && (
                    <p style={styles.info}> {item} </p>
                  )}

                  {(index !== 0 && index !== 4) && (
                    <div style={styles.listContainer}>
                      <li style={styles.info}> {item} </li>
                    </div>
                  )}
                </div>
              ))}
              
              <div style={{display:"flex", alignItems:"center", justifyContent: "center", flexDirection: 'row', borderTop: "1px solid #e0e0e0",}}>
                <div className="switch-checkbox">
                  <label className="switch">
                    <input type="checkbox" onChange={() => setIsEnabled(!isEnabled)} />
                    <span className="slider round"> </span>
                  </label>
                </div>
                <p className="infoHome" style={{color:'#5E5E5E'}}>{termsConditions[termsConditions.length - 1]}</p>
              </div>


              <button className="button" disabled={!isEnabled} onClick={() => handleContinue()}>
                <span>Empezar</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
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

const styles = {
  info: {
    fontSize: "15px",
    textAlign: "justify",
    lineHeight: "1.5",
  },

  listContainer: {
    width: "100%",
  },
};

export default Terms;