import React from "react";
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import './App.css';


import Home from "./screens/Home";
import FormPage from "./screens/FormPage";
import TermsConditions from "./screens/TermsConditions";
import InfoPage from "./screens/InfoPage";
import FinalPage from "./screens/FinalPage";
import EmailPage from "./screens/EmailPage";
import LoginScreen from "./screens/LoginScreen";
import AdminPage from "./screens/AdminPage";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil" element={<EmailPage/>} />
          <Route path="/encuestas/:enquestaId/" element={<FormPage/>} />
          <Route path="/encuestas/:enquestaId/termsconditions" element={<TermsConditions/>} />
          <Route path="/encuestas/:enquestaId/perfil" element={<EmailPage/>} />
          <Route path="/encuestas/:enquestaId/info" element={<InfoPage/>} />
          <Route path="/encuestas/:enquestaId/detalles" element={<FinalPage/>} />
          <Route path="/encuestas/:enquestaId/login" element={<LoginScreen/>} />
          <Route path="/encuestas/:enquestaId/admin" element={<AdminPage />} />
        </Routes>
    </Router>
  );
}

export default App;
