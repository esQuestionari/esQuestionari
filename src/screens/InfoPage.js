import React from "react";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import sendRequest from "../components/utilFetch";

const InfoPage = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();
  const [info, setInfo] = useState("");

  const handleStart = () => {
    navigate(`/${enquestaId}/TermsConditions`);
  }

  useEffect(() => {
    const handleInfo = async () => {
      try {
        const result = await sendRequest({
          url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          });

          console.log(result);
          if (typeof result.introduccio === 'string') {
            setInfo(result.introduccio);
          }
        } catch (error) {
        console.error("Falla infoPage", error)
      }
    };
    handleInfo();
  }, []);


  return (
    <div className="screen">
      < >  <NavBar />
      <div className="container">
        <div style={styles.card}>
          <div style={styles.titleContainer}>
            <h1 style={styles.titleText}>Encuesta Radón</h1>
          </div>
          <div style={styles.infoContainer}>
              <p style={styles.infoText}> {info}</p>
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button className="button buttonText" style={styles.button} onClick={handleStart}>
              Empezar 
          </button>
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
