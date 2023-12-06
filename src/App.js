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

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/email" element={<EmailPage/>} />
          <Route path="/:enquestaId/formpage" element={<FormPage/>} />
          <Route path="/:enquestaId/termsconditions" element={<TermsConditions/>} />
          <Route path="/:enquestaId/email" element={<EmailPage/>} />
          <Route path="/:enquestaId/infopage" element={<InfoPage/>} />
          <Route path="/:enquestaId/end" element={<FinalPage/>} />
          <Route path="/:enquestaId/login" element={<LoginScreen/>} />
        </Routes>
    </Router>
  );
}

export default App;
