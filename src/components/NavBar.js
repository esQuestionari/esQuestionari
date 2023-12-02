import React, {useState} from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.jpeg";
import logoClinic from "../img/logoClinic.png";


function NavBar() {
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleLogoClick = () => {
    const userConfirmed = window.confirm("¿Seguro que deseas ir a la página inicial?");
    
    if (userConfirmed) {
      setRedirectToHome(true);
      <Link to="/"><img src={logo} id="logo" alt=" Logo" /></Link>
    }
  };

  const handleClinicClick = () => {
    const userConfirmed = window.confirm("¿Seguro que deseas ir a la web del Hospital Clínic?");
    
    if (userConfirmed) {
      window.location.href = "https://www.clinicbarcelona.org/";
    }
  };


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
            </>
          )}
        </nav>
    </header>
  );
};

export default NavBar;