import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();
  const lista = [
    "He leído y entendido la hoja de información del participante.",
    "Entiendo de qué se trata el proyecto y para qué se utilizarán los resultados.",
    "Sé que mi participación es voluntaria y que puedo retirarme del proyecto en cualquier momento sin dar el motivo.",
    "Soy consciente de que mi información y mis respuestas se mantendrán confidenciales."
  ];

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const handleContinue = () => {
    navigate(`/${enquestaId}/FormPage`);
  }

  return (
    <div className='h-full' style={{ backgroundColor: '#b9fbc0', height: '100%', width: '100%' }}>  
    <NavBar />
    <div style={styles.termscontainer} >
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
            className="button buttonText"
            style={{
              ...styles.button,
              backgroundColor: isEnabled ? "#08693e" : "gray"
            }}
            disabled={!isEnabled}
            onClick={handleContinue}
            >
             Continuar        
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

const styles = {
  termscontainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#b9fbc0",
    overflowX: "hidden",
  },

  card: {
    backgroundColor: "white",
    margin: "20px",
    border: "1px solid white",
    borderRadius: "20px",
    boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.30)",
    minWidth: "95%"
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
    fontSize: "15px",
    textAlign: "justify"
  },

  listContainer: {
    width: "100%"
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
    margin: "8px",
  },
  
  bullet: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "black",
    marginRight: "8px",
    marginTop: "18px",
    flexShrink: 0, 
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
    cursor: "pointer",
  },

  buttonText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center"
  },
  '@media (max-width: 768px)': {
    titleText: {
      fontSize: "24px", // Reducir el tamaño del título para pantallas más pequeñas
    },
    listItem: {
      width: "100%", // Hacer que los elementos de la lista ocupen el 100% del ancho
    },
    button: {
      width: "100%", // Hacer que el botón ocupe el 100% del ancho
    },
  },
};

export default Terms;