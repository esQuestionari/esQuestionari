import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";


const Terms = () => {
  const lista = [
    "He leído y entendido la hoja de información del participante.",
    "Entiendo de qué se trata el proyecto y para qué se utilizarán los resultados.",
    "Sé que mi participación es voluntaria y que puedo retirarme del proyecto en cualquier momento sin dar el motivo.",
    "Soy consciente de que mi información y mis respuestas se mantendrán confidenciales."
  ];

  const [isEnabled, setIsEnabled] = useState(false);
  const [text, setText] = useState("Rechazar");

  const toggleSwitch = () => {
    if (isEnabled) {
      setText("Rechazar");
    } else {
      setText("Aceptar");
    }

    setIsEnabled((previousState) => !previousState);
  };

  return (
    <>  <NavBar />
    <div className="container">
      <div style={styles.card}>
        <div style={styles.titleContainer}>
          <h2 style={styles.titleText}>Términos y condiciones</h2>
        </div>
        <div style={styles.infoContainer}>
          <p style={styles.info}>
            Lea las siguientes declaraciones antes de aceptar participar en la
            encuesta.
          </p>
          <div style={styles.listContainer}>
            {lista.map((item, index) => (
              <div key={index} style={styles.listItem}>
                <div style={styles.bullet} />
                <p style={styles.info}>{item}</p>
              </div>
            ))}
          </div>
          <p style={styles.info}>
            Habiendo leído la información anterior, ¿consiente participar en el
            cuestionario?
          </p>
        </div>
        <div style={styles.switchContainer}>
          <input type="checkbox" onChange={toggleSwitch} checked={isEnabled} />
          <button
            style={{
              ...styles.button,
              backgroundColor: isEnabled ? "#08693e" : "gray"
            }}
            disabled={!isEnabled}
            >
            <Link to="/FormPage" className="button buttonText" > Continuar </Link>          
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#b9fbc0",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },

  card: {
    backgroundColor: "white",
    margin: "20px",
    border: "1px solid white",
    borderRadius: "20px",
    boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.30)"
  },

  titleContainer: {
    padding: "10px",
    boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.15)"
  },

  titleText: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#333333",
    marginTop: "10px",
    marginBottom: "4px",
    justifyContent: "flex-start"
  },

  infoContainer: {
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: "10px",
    marginRight: "15px"
  },

  info: {
    fontSize: "18px",
    textAlign: "justify"
  },

  listContainer: {
    width: "200%"
  },

  listItem: {
    display: "flex",
    flexDirection: "row", // Cambiado de "row" a "column"
    flexWrap: "wrap",
    alignItems: "flex-start",
    margin: "8px",
    width: "50%"
  },

  bullet: {
    width: "8px",
    height: "8px",
    borderRadius: "4px",
    backgroundColor: "black",
    margin: "15px"
  },

  switchContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    borderTop: "1px solid #e0e0e0"
  },

  button: {
    borderRadius: "10px",
    padding: "10px",
    marginLeft: "10px",
    width: "30%", 
  },

  buttonText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  }
};

export default Terms;