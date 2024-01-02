import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.jpeg";
import logoClinic from "../img/logoClinic.png";
import logoHGT from "../img/logoHGT.png";
import userIcon from "../img/user.png";


function NavBar() {
  const navigate = useNavigate();
  const [redirectToHome, setRedirectToHome] = useState(false);
  const user = JSON.parse(localStorage.getItem('profile'));
  const savedUser = localStorage.getItem('user');
  const userObject = savedUser ? JSON.parse(savedUser) : null;
  //const hospital = JSON.parse(localStorage.getItem('hospital'));

 /* useEffect(() => {
    getHospital();
  }, [hospital]);

  const getHospital = () => {

    if (hospital === "Hospital Germans Trias") {
      return logoHGT;  
    }
    else return logoClinic;
  }
*/

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
        <nav>
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
            <img
              src={logoClinic} 
              id="hospitalClinic"
              alt="Hospital Clínic"
              onClick={handleClinicClick}
              style={{ cursor: "pointer" }}
            />
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