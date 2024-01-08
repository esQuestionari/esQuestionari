import React, {useState, useEffect} from "react";
import { Link, useNavigate, useParams} from "react-router-dom";
import logo from "../img/logo.jpeg";
import logoClinic from "../img/logoClinic.png";
import userIcon from "../img/user.png";
import sendRequest from "../components/utilFetch";

function NavBar() {
  const navigate = useNavigate();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const user = JSON.parse(localStorage.getItem('profile'));
  const savedUser = localStorage.getItem('user');
  const userObject = savedUser ? JSON.parse(savedUser) : null;
  const [logoHospital, setLogo] = useState(null);
  const {enquestaId} = useParams();  

  useEffect(() => {
    getHospital();
  }, [enquestaId]);

  const getHospital = async () => {
      try {
        const result = await sendRequest({
          url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}`,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json',
          },
        });
        //console.log(result);
        setLogo(result.creador.imatge)
      } catch(error) {
        console.error("Falla logo", error);
      }
    };

  


  const handleLogoClick = () => {
    const userConfirmed = window.confirm("¿Seguro que deseas ir a la página inicial?");
    
    if (userConfirmed) {
      setRedirectToHome(true);
      <Link to="/"><img src={logo} id="logo" alt=" Logo" /></Link>
    }
  };

  const handleClinicClick = () => {
      window.open("https://www.clinicbarcelona.org/", "_blank");
  };

  const handleLoginClick = () => {
    // Redirect to the email page
    navigate("/perfil");
  };

  useEffect(() => {
    getImage();
  }, [savedUser]);

  const getImage = () => {

    if (!user || !userObject || userObject.expires_at < Date.now() || !user.picture) {
      console.log("usuari caducat")
      return userIcon;  
    }
    else return user.picture || userIcon;
  }

  return (
    <header>
        <nav style={{zIndex: '20'}}>
          {redirectToHome ? (
            // Redireccionar a la página principal
            window.location.assign("/")
          ) : (
            <>
            <img
              src={logo}
              id="logo"
              alt="Logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
            {/*logo clinic*/}
            {logoHospital ? (
            <img
              src={logoHospital} 
              id="hospitalClinic"
              alt="Hospital Clínic"
              onClick={handleClinicClick}
              style={{ cursor: "pointer" }}
            />
            ) : ( null )}
             <Link to="/perfil">
              <img
                src={getImage()}
                id="userLogo"
                alt="Login"
                onClick={handleLoginClick}
                style={{ cursor: "pointer"}}
              />
            </Link>
            </>
          )}
        </nav>
    </header>
  );
};

export default NavBar;