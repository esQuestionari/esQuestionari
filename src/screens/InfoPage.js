import React from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from 'react-router-dom';

const InfoPage = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();
  const info2 = (
    <>
      Estimado participante,
      <br /><br />
      Esta investigación busca estudiar el conocimiento y percepción de riesgo en relación con la exposición al RADÓN en nuestra sociedad, todo ello dentro del proyecto REBORN.
      <br /><br />
      No usaremos su nombre en ninguna fase de la gestión de datos. En todo momento puede retirarse o no responder a alguna pregunta. La información que proporcione será utilizada únicamente para esta encuesta y será guardada de forma anónima y confidencial. De acuerdo con el Reglamento General de Protección de Datos (GDPR), todos los datos de los participantes se destruirán tan pronto se finalice el análisis de datos.
    </>
  );

  const info = [
    "Estimado participante,",
    "Esta investigación busca estudiar el conocimiento y percepción de riesgo en relación con la exposición al RADÓN en nuestra sociedad, todo ello dentro del proyecto REBORN.",
    "No usaremos su nombre en ninguna fase de la gestión de datos. En todo momento puede retirarse o no responder a alguna pregunta. La información que proporcione será utilizada únicamente para esta encuesta y será guardada de forma anónima y confidencial. De acuerdo con el Reglamento General de Protección de Datos (GDPR), todos los datos de los participantes se destruirán tan pronto se finalice el análisis de datos."
  ];

  const handleStart = () => {
    navigate(`/${enquestaId}/TermsConditions`);
  }


  return (
    <div className="screen">
      < >  <NavBar />
      <div className="contenidor">
        <div className="cards">
          <div>
            <div className="information [ cardEnquesta ]">
              <h2 className="titleHome">Encuesta sobre el gas radón</h2>
              <p className="infoHome" style={{color:'#5E5E5E'}}>{info2}</p>
              <button className="button" onClick={() => handleStart()}>
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
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#f5f4f2",
    minHeight: "100vh"
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    marginTop: "30px",
    margin: "20px",
    boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.15)"
  },

  titleContainer: {
    backgroundColor: "#30CE7A",
    padding: "10px",
    height: "75px",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px"
  },

  titleText: {
    fontSize: "25px",
    fontWeight: "bold",
    color: "#333333",
    marginTop: "10px"
  },

  infoContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: "2px",
    borderTopColor: "#e0e0e0",
    borderBottomRightRadius: "20px",
    borderBottomLeftRadius: "20px",
    padding: "10px"
  },

  infoText: {
    fontSize: "15px",
    textAlign: "justify",
    marginVertical: "10px"
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
    justifyContent: "center",
    cursor: "pointer",
  },

  button: {
    backgroundColor: "green",
    borderRadius: "10px",
    padding: "10px",
    margin: "10px",
    minWidth: "100px",
    cursor: "pointer",
  },

  buttonText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  }
};

export default InfoPage;