import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";


const InfoPage = () => {
  const info = [
    "Estimado participante,",
    "Esta investigación busca estudiar el conocimiento y percepción de riesgo en relación con la exposición al RADÓN en nuestra sociedad, todo ello dentro del proyecto REBORN.",
    "No usaremos su nombre en ninguna fase de la gestión de datos. En todo momento puede retirarse o no responder a alguna pregunta. La información que proporcione será utilizada únicamente para esta encuesta y será guardada de forma anónima y confidencial. De acuerdo con el Reglamento General de Protección de Datos (GDPR), todos los datos de los participantes se destruirán tan pronto se finalice el análisis de datos."
  ];

  return (
    <div className="screen">
      < >  <NavBar />
      <div className="container">
        <div style={styles.card}>
          <div style={styles.titleContainer}>
            <h1 style={styles.titleText}>Encuesta Radón</h1>
          </div>
          <div style={styles.infoContainer}>
            {info.map((item, index) => (
              <p key={index} style={styles.infoText}>
                {item}
              </p>
            ))}
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button style={styles.button}>
            <Link to="/TermsConditions" className="button buttonText" > Empezar </Link>
          </button>
        </div>
      </div>
      </>
    </div>
  );
};

const styles = {

  // screen: {
  //   display: "flex",
  //   flexDirection: "column",
  //   height: "10vh",
  // },

  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#b9fbc0",
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
    justifyContent: "center"
  },

  button: {
    backgroundColor: "green",
    borderRadius: "10px",
    padding: "10px",
    margin: "10px",
    minWidth: "100px"
  },

  buttonText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  }
};

export default InfoPage;
