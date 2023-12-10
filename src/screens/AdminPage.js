import React from "react";
import NavBar from "../components/NavBar";
import Tabla from "../components/Tabla";
import { useNavigate, useParams } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const { enquestaId } = useParams();

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
              <Tabla preguntes={preguntes} info={info} />
              <br/>
              <button className="button" disabled={true} onClick={() => handleStart()}>
                <span>Descargar</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="none">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    </div>
  );
};


export default AdminPage;