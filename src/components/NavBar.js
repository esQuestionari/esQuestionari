import React, {useState} from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.jpeg";

function NavBar() {
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleLogoClick = () => {
    const userConfirmed = window.confirm("¿Seguro que deseas ir a la página inicial?");
    
    if (userConfirmed) {
      setRedirectToHome(true);
      <Link to="/"><img src={logo} id="logo" alt=" Logo" /></Link>
    }
  };


  return (
    <header>
        <nav>
          {redirectToHome ? (
            // Redireccionar a la página principal
            window.location.assign("/")
          ) : (
            // Mostrar el logo con el evento onClick
            <img
              src={logo}
              id="logo"
              alt="Logo"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            />
          )}
        </nav>
    </header>
  );
};

export default NavBar;