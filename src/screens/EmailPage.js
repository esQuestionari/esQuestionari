import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import sendRequestWithStatus from "../components/utilFetchMarc";
import NavBar from "../components/NavBar";
import '../style//EmailPage.css';


const EmailPage = () => {
  const [ user, setUser ] = useState(null);
  const [ profile, setProfile ] = useState(null);
  const { enquestaId } = useParams();
  const [ email, setEmail] = useState('');
  const navigate = useNavigate();

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => {
        setUser(codeResponse);
        console.log(codeResponse)
        localStorage.setItem('user', JSON.stringify({
          access_token: codeResponse.access_token
        }));
      },
      onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
      () => {
          //const user = localStorage.getItem('user');
          console.log('user:', user);
          if (user && user.access_token !== undefined) {
            axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                    console.log("res", res);
                      setProfile(res.data);
                      setEmail(res.data.email);
                      localStorage.setItem('profile', JSON.stringify({
                        id: res.data.id,
                        email: res.data.email,
                        verified_email: res.data.verified_email,
                        name: res.data.name,
                        given_name: res.data.given_name,
                        family_name: res.data.family_name,
                        picture: res.data.picture,
                        locale: res.data.locale,
                        hd: res.data.hd
                      }));
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
        const savedUser = localStorage.getItem('user');
        const userObject = savedUser ? JSON.parse(savedUser) : null;
        console.log('user:', userObject ? userObject.access_token : null);
        if (userObject) {
          axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userObject.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${userObject.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    setEmail(res.data.email);
                    localStorage.setItem('profile', JSON.stringify({
                      id: res.data.id,
                      email: res.data.email,
                      verified_email: res.data.verified_email,
                      name: res.data.name,
                      given_name: res.data.given_name,
                      family_name: res.data.family_name,
                      picture: res.data.picture,
                      locale: res.data.locale,
                      hd: res.data.hd
                    }));
                    //handleContinue(res.data.email)
                })
                .catch((err) => console.log(err));
        }
        if (savedUser && savedUser.name) {
          setUser(JSON.parse(savedUser));
          const savedProfile = localStorage.getItem('profile');
          setProfile(JSON.parse(savedProfile));
        }
        else {
          setUser(null);
          setProfile(null);
        }
      }
      else {
        console.log('saved user');
      }
    }, []);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
      googleLogout();
      setProfile(null);
      setUser(null);
      setEmail('');
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
  };

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== '' && emailRegex.test(email);
  };
  
  const handleContinue = () => {
    if (isEmailValid()) {
      if (enquestaId) {
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
            console.log("response", response);
            if (response.status === 201) {
              console.log("status 201");
              // Server returned a 201 status code
              const result = response.data;
    
              // Check if the response includes a unique ID
              if (result.id) {
                // Navigate to the form page with the unique ID as a query parameter
                //navigate(`/form?id=${result.id}`);
                console.log("id returned: ", result.id);
                localStorage.setItem('userId', String(result.id));
                navigate(`/${enquestaId}/FormPage`);
              } else {
                // Handle the case where the server response is missing the expected ID
                alert('Unexpected response from the server. Please try again.');
              }
            } else if (response.status === 400) {
              // Handle specific status code 400 (Bad Request)
              const userWantsToGoToFinal = window.confirm(
                'Este correo ya ha completado la encuesta. ¿Quiere ver información relacionada con la encuesta? (si le das a Cancelar podrás contestar de nuevo la encuesta)'
              );
      
              if (userWantsToGoToFinal) {
                navigate(`/encuestas/${enquestaId}/detalles`); 
              }
              else {
                navigate(`/encuestas/${enquestaId}/`);
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
        //navigate(`encuestas/${enquestaId}/`);
      }
      else {
        navigate(-2);
      }
    } 
    else {
      // Handle invalid email case, show an error message or take appropriate action
      alert('Por favor, introduzca una dirección de correo válida.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="contenidor" style = {{paddingTop: '20px'}}>
        <div className="information [ cardEnquesta ]">
          <h2 className="email-title">Correo Electrónico</h2>
          
          <div className="login-options">
  
            {/* Google Login Card */}
            <div className="login-card google-login">
              {profile ? (
                <div>
                  <img src={profile.picture} alt="user" style={{marginTop: '25px'}}/>
                  <h3>Hola, {profile.given_name}!</h3>
                  <button className="google-logout" onClick={logOut}>
                    Log out
                  </button>
                </div>
              ) : (
                <div>
                  <p className='title'>Regístrate con Google</p>
                  <button className="google-login" onClick={() => login()}>
                    Regístrate con Google 🚀
                  </button>
                </div>
              )}
            </div>
            {!profile && enquestaId && (
              <>
                <div className="or-separator">
                  <span>OR</span>
                </div>
      
                
                <div className="login-card manual-email">
                  <p className='title'>Introduce un correo manualmente</p>
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
              </>
            )}
          </div>
  
          <div className="email-buttonContainer">
            <button 
              className="button" 
              onClick={handleContinue}
              disabled={!isEmailValid() && !profile}
            >
              <span>Continuar</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 20" width="24px" fill="none">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailPage;