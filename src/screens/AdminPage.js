import React, {useState} from "react";
import NavBar from "../components/NavBar";
import Tabla from "../components/Tabla";
import { useNavigate, useParams } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const preguntes = [
    {
        1: "¿Ha oído hablar del gas radón?",
        2: "¿menjar preferit?",
        3: "¿estado?",
        4: "aquesta pregunta la fare bastant llarga per probar que pasa?",
        5: "curta pero important",
        6: "aixo es fa fent petit i no funcional",
        7: "pq no es crea el scroollroll",
        8: "no hi ha manera",
        9: "porque",
        10: 'no quierw',
        11: 'ara no hi ha'
    }
  ]

  const info = [
    {
        usuari: '1',
        1: "no",
        2: "patata", 
        3: "estado",
        4: "no funciona be la resposta es molt llarga"
    },
    {
        usuari: '2',
        1: "si",
        2: "patata2",
        3: "estado2",
        4: "be"
    },
    {
        usuari: '3',
        1: "no",
        2: "patata2",
        3: "estado3 pero la faig mes llarga perque puc",
        4: "malament"
    },
    {
        usuari: '4',
        1: "no",
        2: "patata2",
        3: "estado3 pero la faig mes llarga perque puc",
        4: "malament"
        
    },
    {
        usuari: '5',
        1: "no",
        2: "patata2",
        3: "estado3 pero la faig mes llarga perque puc",
        4: "malament"
    },

  ];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredInfo = info.filter((item) => {
    return Object.entries(item)
      .filter(([key]) => key !== 'usuari') // Excluir el campo 'usuari'
      .some(([key, value]) => value.toLowerCase().includes(searchTerm.toLowerCase()));
  });

    const handleStart = () => {
      navigate(`/${enquestaId}/TermsConditions`);
    }
  


  return (
    <div className="screen">
      < >  <NavBar />
      <div className="contenidor">
        <div className="cardsTabla" >
          <div>
            <div className="information [ cardEnquesta ]">
              <h2 className="titleHome">Descarga respuestas</h2>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Tabla preguntes={preguntes} info={filteredInfo} />
            </div>
          </div>
        </div>
      </div>
      </>
    </div>
  );
};


export default AdminPage;