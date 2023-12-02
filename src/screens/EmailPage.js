import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import sendRequestWithStatus from "../components/utilFetchMarc";
import NavBar from "../components/NavBar";
import '../style//EmailPage.css';


const EmailPage = () => {
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);
  const { enquestaId } = useParams();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
      () => {
          if (user && user.access_token !== undefined) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                      setProfile(res.data);
                      setEmail(res.data.email);
                      //handleContinue(res.data.email)
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );

  useEffect(
    () => {
      if (!user || user.access_token === undefined) {
        setUser([]);
        setProfile(null)
      }
    }, []);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
      googleLogout();
      setProfile(null);
  };

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
          
          <div className="login-options">
  
            {/* Google Login Card */}
            <div className="login-card google-login">
              <p className='title'>Sign in with Google</p>
              {profile ? (
                <div>
                  <img src={profile.picture} alt="user image" />
                  <h3>Hola, {String(profile.name).split(' ')[0]}!</h3>
                  <button className="google-logout" onClick={logOut}>
                    Log out
                  </button>
                </div>
              ) : (
                <button className="google-login" onClick={() => login()}>
                  Sign in with Google 🚀
                </button>
              )}
            </div>
  
            {/* OR Separator */}
            <div className="or-separator">
              <span>OR</span>
            </div>
  
            {/* Manual Email Input Card */}
            <div className="login-card manual-email">
              <p className='title'>Enter Email Manually</p>
              <div className="email-input-container">
                <input
                  type="email"
                  className={`email-inputField ${isEmailValid() ? 'valid' : 'invalid'}`}
                  placeholder="clinic@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
  
          <div className="email-buttonContainer">
            <button
              className="email-continueButton"
              onClick={handleContinue}
              disabled={!isEmailValid() || !profile}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailPage;