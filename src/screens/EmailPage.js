import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import sendRequestWithStatus from "../components/utilFetchMarc";
import NavBar from "../components/NavBar";
import '../style//EmailPage.css';


const EmailPage = () => {
  const [email, setEmail] = useState('');
  const { enquestaId } = useParams();
  const navigate = useNavigate();

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== '' && emailRegex.test(email);
  };
  
  const handleContinue = () => {
    if (isEmailValid) {
      const handleUser = async () => {
        try {
          const response = await sendRequestWithStatus({
            url: 'http://nattech.fib.upc.edu:40511/api/usuaris/',
            method: 'POST',
            body: JSON.stringify({ email: email }),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });
          console.log(response);
          if (response.status === 201) {
            console.log("status 201");
            // Server returned a 201 status code
            const result = response.data;
  
            // Check if the response includes a unique ID
            if (result.id) {
              // Navigate to the form page with the unique ID as a query parameter
              //navigate(`/form?id=${result.id}`);
              console.log("id returned: ", result.id);
              navigate(`/${enquestaId}/FormPage`);
            } else {
              // Handle the case where the server response is missing the expected ID
              alert('Unexpected response from the server. Please try again.');
            }
          } else if (response.status === 400) {
            // Handle specific status code 400 (Bad Request)
            const userWantsToGoToFinal = window.confirm(
              'Este correo ya ha completado la encuesta. ¿Quiere ver información relacionada con la encuesta?'
            );
    
            if (userWantsToGoToFinal) {
              navigate(`/${enquestaId}/end`); // Replace with the actual path to your final page
            }
          } else {
            // Handle other status codes
            alert('Server error. Please try again.');
          }
        } catch (error) {
          console.error("falla email", error);
        }
      };
      handleUser();
      //navigate(`/${enquestaId}/FormPage`);
    } else {
      // Handle invalid email case, show an error message or take appropriate action
      alert('Por favor, introduzca una dirección de correo válida.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="email-container">
        <div className="email-card">
          <h2 className="email-title">Correo Electrónico</h2>
          <div className="email-input-container">
            <input
              type="email"
              className={`email-inputField ${isEmailValid() ? 'valid' : 'invalid'}`}
              placeholder="clinic@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="email-buttonContainer">
            <button
              className="email-continueButton"
              onClick={handleContinue}
              disabled={!isEmailValid()}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailPage;
