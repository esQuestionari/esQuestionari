import React from "react";
import { Link } from "react-router-dom";
import logo from "../img/logo.jpeg";

function NavBar() {

  return (
    <header>
        <nav>
          <Link to="/"><img src={logo} id="logo" alt=" Logo" /></Link>
        </nav>
    </header>
  );
};

export default NavBar;