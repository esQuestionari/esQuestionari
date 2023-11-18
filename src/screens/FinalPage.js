import React, { useState } from 'react';
import NavBar from "../components/NavBar";

const FinalPage = () => {
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);

  const handleCheckbox1Change = () => {
    setCheckbox1(!checkbox1);
  };

  const handleCheckbox2Change = () => {
    setCheckbox2(!checkbox2);
  };

  return (
    < div  className='h-full' style={{ backgroundColor: '#b9fbc0', height: '100%', width: '100%' }} >  
    <NavBar />
    <div  style={{ marginLeft: '20px' }}>
      <h2>¡Gracias por completar el cuestionario!</h2>
      <p>Selecciona las opciones deseadas:</p>
      <label>
        <input
          type="checkbox"
          checked={checkbox1}
          onChange={handleCheckbox1Change}
        />
        Opción 1
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={checkbox2}
          onChange={handleCheckbox2Change}
        />
        Opción 2
      </label>
    </div>
    </div >
  );
};

export default FinalPage;
