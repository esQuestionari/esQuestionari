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
        {termsConditions.map((item, index) => (
          <div key={index} style={styles.infoContainer}>
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
        <div style={styles.endContainer}>
          {termsConditions.map((item, index) => (
            <div key={index}>
              {index === termsConditions.length - 1 ? (
                <p style={styles.info}>{item}</p>
              ) : null}
            </div>
          ))}
        </div>
          <div style={{display:"flex", lignItems:"center", justifyContent: "center"}}>
            <div className="switch-checkbox">
              <label className="switch">
                <input type="checkbox" onChange={() => setIsEnabled(!isEnabled)} />
                <span className="slider round"> </span>
              </label>
            </div>
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
    display: "flex",
    flexDirection: "column",
    margin: "20px",
    border: "1px solid white",
    borderRadius: "20px",
    boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.35)",
    minWidth: "95%",
  },

  titleContainer: {
    padding: "10px",
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
    flexDirection: "row",
    padding: "5px",
    marginRight: "5px",
    marginLeft: "5px"
  },

  info: {
    fontSize: "15px",
    textAlign: "justify",
    lineHeight: "1.5",
  },

  listContainer: {
    width: "100%",
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
  },

  endContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTop: "1px solid #e0e0e0",
    margin: 0,
    padding: "5px",
  },

  button: {
    borderRadius: "10px",
    padding: "10px",
    margin: "10px",
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