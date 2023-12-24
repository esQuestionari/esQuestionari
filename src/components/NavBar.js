import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../img/logo.jpeg";
import logoClinic from "../img/logoClinic.png";
import userIcon from "../img/user.png";


function NavBar() {
  const navigate = useNavigate();
  const [redirectToHome, setRedirectToHome] = useState(false);

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

  const getImage = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    if (!user) return userIcon;
    if (user.picture) return user.picture;
    return userIcon;
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