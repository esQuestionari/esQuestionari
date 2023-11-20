import React, { useState } from 'react';
import NavBar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,  PieChart, Pie, Cell } from 'recharts';

const FinalPage = () => {
  const navigate = useNavigate();
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(false);
  const [email2, setEmail2] = useState('');

  const [chartData, setChartData] = useState([
    { name: 'Opción 1', respuestas: 6 },
    { name: 'Opción 2', respuestas: 0 },
  ]);

  const [lineChartData, setLineChartData] = useState([
    { name: 'Semana 1', respuestas: 0 },
    { name: 'Semana 2', respuestas: 3 },
    { name: 'Semana 3', respuestas: 7 },
    // Puedes ajustar los datos según tus necesidades
  ]);

  const [pieChartData, setPieChartData] = useState([
    { name: 'Opción 1', respuestas: 1 },
    { name: 'Opción 2', respuestas: 2 },
  ]);


  const handleCheckbox1Change = () => {
    setCheckbox1(!checkbox1);
  };

  const handleCheckbox2Change = () => {
    setCheckbox2(!checkbox2);
  };

  const handleEmail2Change = (e) => {
    setEmail2(e.target.value);
  };

  const handleSave = () => {
    console.log("checkbox1", checkbox1);
    console.log("checkbox2", checkbox2);
    console.log("email2", email2);
    navigate("/");
  };

  return (
    <div className='h-full' style={{ backgroundColor: '#b9fbc0', height: '100%', width: '100%' }}>
      <NavBar />
      <div className='h-full' style={{ marginLeft: '20px' }}>
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
        {(checkbox2 || checkbox1) && (
          <div>
            <label>
              Correo:
              <input type="text" value={email2} onChange={handleEmail2Change} />
            </label>
          </div>
        )}
        <br />
        <button className='buttonini' onClick={handleSave}>Guardar</button>
        <div>
          <BarChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="respuestas" fill="#8884d8" />
          </BarChart>
        </div>
        <div>
          <LineChart width={400} height={300} data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="respuestas" stroke="#8884d8" />
          </LineChart>
        </div>
        <div>
          <PieChart width={400} height={300}>
            <Pie
              data={pieChartData}
              cx={200}
              cy={150}
              startAngle={90}
              endAngle={-90}
              outerRadius={80}
              fill="#8884d8"
              dataKey="respuestas"
            >
              <Cell fill="#FF6384" />
              <Cell fill="#36A2EB" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default FinalPage;
