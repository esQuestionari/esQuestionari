import React from "react";
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import './App.css';


import Home from "./screens/Home";
import FormPage from "./screens/FormPage";
import TermsConditions from "./screens/TermsConditions";
import InfoPage from "./screens/InfoPage";
import FinalPage from "./screens/FinalPage";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/formpage" element={<FormPage/>} />
          <Route path="/termsconditions" element={<TermsConditions/>} />
          <Route path="/infopage" element={<InfoPage/>} />
          <Route path="/end" element={<FinalPage/>} />
        </Routes>
    </Router>
  );
}

export default App;
