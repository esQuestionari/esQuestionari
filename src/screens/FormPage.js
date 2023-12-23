import React, {useState, useEffect, useRef } from 'react';
import NavBar from "../components/NavBar";
import { useNavigate, useParams} from 'react-router-dom';
import sendRequest from "../components/utilFetch";

import '../style/FormPage.css'; 
import '../index.css'; 

const FormPage = () => {
  const handleInfoEnquesta = async () => {
    try {
      const result = await sendRequest({
        url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      console.log("enquesta: ", result); 
      setInfoEnquesta(result);
      return(result);
    } catch (error) {
      console.error("falla formPage info enquesta", error); 
    }
  };
  
  const handleApartatsEnquesta = async () => {
    try {
      const result = await sendRequest({
        url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}/apartats/`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      console.log("apartats enquesta: ", result); 
      let apartats = result.map(it => it.id); 
      console.log("apartats:", apartats);
      setApartatsIds(apartats);
      handleInfoApartat(apartats, currentSection);
    } catch (error) {
      console.error("falla formPage get apartats", error); 
    }
  };

  const handleInfoApartat = async (apartats, idx) => {
    console.log("apartatsIds after setApartats:", apartats);
    try {
      let result = await sendRequest({
        url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}/apartats/${apartats[idx]}/`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      console.log(result); 
      const preguntesOrdenades = result.preguntes.sort((a, b) => a.id - b.id);
      result.preguntes = preguntesOrdenades.reduce((acc, obj) => {
        acc[obj.id] = obj;
        return acc;
      }, {});
      console.log("preguntesOrdenades", preguntesOrdenades);
      setSection(result);
      setAnswers({});
    } catch (error) {
      console.error("falla formPage info apartat", error); 
    }
  };
  
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const {enquestaId} = useParams(); 
  const [isLoading, setLoading] = useState(true);
  const [infoEnquesta, setInfoEnquesta] = useState({});
  const [apartatsIds, setApartatsIds] = useState(null);
  const [section, setSection] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sectionValid, setSectionValid] = useState(false);
  const [invalidUser, setInvalidUser] = useState(false);
  const [userId, setUserId] = useState(null);

  const initializeData = async () => {
    setCurrentSection(0); 
    const result = await handleInfoEnquesta();
    const apartats = await handleApartatsEnquesta();
    const seccio = await handleInfoApartat(apartats, currentSection);

    window.scrollTo({ top: 0 });
  };

useEffect(() => {
  initializeData();
}, [])

useEffect(() => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    setInvalidUser(true);
  }
  else {
    console.log("userId:", userId); //aqui tots els atributs que vulguis
    setUserId(userId);
    if(apartatsIds) {
      setLoading(false);
    }
  }
}, [apartatsIds])
  
  const handleSelectOption = (questionIndex, option) => {
    let newAnswers = {...answers};
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };

  const handleScaleAnswer = (questionIndex, selectedColor) => {
    let newAnswers = {...answers};;
    newAnswers[questionIndex] = selectedColor;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };

  const handleTrueFalseAnswer = (questionIndex, isTrue) => {
    let newAnswers = {...answers};
    newAnswers[questionIndex] = isTrue ? 'cierto' : 'falso';
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };

  const handleTextAnswer = (questionIndex, text) => {
    let newAnswers = {...answers};
    newAnswers[questionIndex] =  text;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };
  
  const handleNumericAnswer = (e, questionIndex) => {
    let number = e.target.value;

    if (number.length > 4) {
      number = number.slice(0, 4);
    }

    let newAnswers = {...answers};
    newAnswers[questionIndex] =  number;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  }

  const handleSelectMultipleOption = (questionIndex, option) => {
    let newAnswers = {...answers};
    if (!newAnswers[questionIndex]) {
      newAnswers[questionIndex] = [option];
    } else {
      const selectedIndex = newAnswers[questionIndex].indexOf(option);
      if (selectedIndex === -1) {
        newAnswers[questionIndex].push(option);
      } else {
        newAnswers[questionIndex].splice(selectedIndex, 1);
      }
    }
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };
  

  const checkSectionCompletion = (newAnswers) => {
    const visibleQuestions = Object.entries(section.preguntes)
      .filter(([id, question]) => shouldBeAnswered(question, newAnswers))
      .reduce((accumulator, [key, value]) => {
        accumulator.push(value.id);
        return accumulator;
      }, []);

    console.log("visible questions: ", visibleQuestions);

    let missingQuestions = false;
  
    for (let i = 0; i < visibleQuestions.length && !missingQuestions; i++) {
      if (!isAnswered(newAnswers, visibleQuestions[i])) {
        missingQuestions = true;
        console.log("pregunta no resposta: ", section.preguntes[visibleQuestions[i]].text);
      }
    }

    setSectionValid(!missingQuestions);
  };

  const isAnswered = (newAnswers, questionId) => {
    console.log("question id: ", questionId);
    const question = section.preguntes[questionId];
    if (!newAnswers[questionId]) return false;
    if (question.tipus !== 'multiple' && newAnswers[questionId]) return true;
    if (question.tipus === 'multiple' && newAnswers[questionId].length > 0) {
      console.log("length: ", newAnswers[questionId].length);
      return true;
    }
    return false;
  }

  const handleNextSection = () => {
    sendAnswers();
    if (currentSection < infoEnquesta.numApartats - 1) {
      console.log("next section: ", currentSection+1);
      console.log("apartats: ", apartatsIds);
      console.log("next section id: ", apartatsIds[currentSection + 1])
      handleInfoApartat(apartatsIds, currentSection + 1);
      setCurrentSection(currentSection + 1);
      setSectionValid(false);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  };

  const sendAnswers = async () => {
    console.log("comença")
    const visibleQuestions = Object.entries(section.preguntes)
      .filter(([id, question]) => shouldBeAnswered(question, answers))
      .reduce((accumulator, [key, value]) => {
        accumulator.push(value.id);
        return accumulator;
      }, []);

      console.log("acaba ", visibleQuestions)
    let answersArray = [];
  
    for (let id in visibleQuestions) {
      answersArray.push(createAnswer(visibleQuestions[id]));
    }

    let template = {
      usuari: userId,
      respostes: answersArray
    }

    console.log("template: ", template);
    
    await postAnswers(template);
  }

  const createAnswer = (id) => {
    console.log("id: ", id);
    if (section.preguntes[id].tipus !== 'multiple') {
      return {
        pregunta: id,
        valor: answers[id]
      };
    }
    else {
      return {
        pregunta: id,
        valor: answers[id].join(', ')
      };
    }
  }

  const postAnswers = async (template) => {
    try {
      const response = await sendRequest({
        url: `http://nattech.fib.upc.edu:40511/api/respostes/bulk/`,
        method: 'POST',
        body: JSON.stringify(template),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log("response", response);
      if (response.status >= 200 && response.status <= 299) {
        console.log("Section posted correctly jeje");
      }
      else {
        console.log("There has been a problem posting the answers");
      }
    } catch (error) {
      console.error("falla formPage al enviar respostes", error); 
    }
  }

  const isFormComplete = () => {
    return currentSection === infoEnquesta.numApartats - 1 && sectionValid;
  };

  const handleFinishForm = () => {
    //alert('You have completed the form. Thank you for your feedback.');
    const newAnswers = Array(section.preguntes.length).fill({});
    setAnswers(newAnswers);
    setCurrentSection(0);
    setSectionValid(false);
    navigate(`/encuestas/${enquestaId}/detalles`);
  };

  const shouldBeAnswered = (question, newAnswers) => {
    if (question.enCasDe === null) {
      return true;
    }
    if (section.preguntes[question.enCasDe].tipus !== 'multiple') {
      return (newAnswers[question.enCasDe] === question.opcioEnCasDe);
    }
    else {
      if (!newAnswers[question.enCasDe]) return false;
      return newAnswers[question.enCasDe].map(str => str.toLowerCase()).includes(question.opcioEnCasDe.toLowerCase());
    }
  }

  const shouldShowQuestion = (question) => {
    if (question.enCasDe === null) {
      return true;
    }
    if (section.preguntes[question.enCasDe].tipus !== 'multiple') {
      return (answers[question.enCasDe] === question.opcioEnCasDe);
    }
    else {
      if (!answers[question.enCasDe]) return false;
      return answers[question.enCasDe].map(str => str.toLowerCase()).includes(question.opcioEnCasDe.toLowerCase());
    }
  }

  const getColors = (colors) => {
    if (colors === 3) {
      return ['red', 'orange', 'green'];
    }
    else if (colors === 4) {
      return ['red', 'orange', 'yellow', 'green'];
    }
    else {
      return ['red', 'orange', 'yellow', 'greenyellow', 'green'];
    }
  }

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
     object.target.value = object.target.value.slice(0, object.target.maxLength)
      }
    }

  if (invalidUser) {
    return  (
      <>
        <NavBar />
        <div className="container">
          <div key={currentSection} className="card">
            <h2>Invalid User</h2>
          </div>
        </div>
      </>
    );
  }

  if  (isLoading) {
    return (
      <div className="screen">
      < >
        <NavBar />
        <div className="container">
          <div key={currentSection} className="card">
            <h2>Loading...</h2>
          </div>
          <div className='buttonContainer'>
            {!isFormComplete() && (<button
              className={`nextButton${(sectionValid || isFormComplete()) ? '' : ' disabled'}`}
              onClick={handleNextSection}
              disabled={!sectionValid || isFormComplete()}
            >
              Siguiente
            </button>)}
            {isFormComplete() && (
              <button className="nextButton" onClick={handleFinishForm}>
                Finalizar
              </button>
            )}
          </div>
        </div>
      </>
      </div>
    );
  }

  return (
    <div className="screen">
      < >
      <NavBar />
      <div className="contenidor">
        <div className="cards" ref={scrollContainerRef} >
          <div className="information [ cardEnquesta ]">
            {<p className='sectionNumber'>Sección {currentSection + 1} de {infoEnquesta.numApartats}</p>}
            <h2 className='titol'>{section.titol}</h2>
            {section.introduccio !== undefined && (
              <div className='infoSection'>
                <p className='infoText'>{section.introduccio}</p>
                {/* Handle image rendering if needed */}
              </div>
            )}
            {section.preguntes && Object.values(section.preguntes).map((question, questionIndex) => (
              <div key={questionIndex}>
                {question.tipus !== 'escala' && question.tipus !== 'certofals' && shouldShowQuestion(question) && <p className='questionText'>{question.text}</p>}
                {(
                  shouldShowQuestion(question) ? (
                    question.tipus === 'opcions' ? (
                      <div className='optionContainer'>
                        {question.opcions.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            className={answers[question.id] === option ? 'selectedOption' : 'option'}
                            onClick={() => handleSelectOption(question.id, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      question.tipus === 'certofals' ? (
                        <div className='scaleQuestion'>
                          <p className='questionText' style={{marginTop: '2px'}}>{question.text}</p>
                          <div className='trueFalseButtons'>
                            <button
                              className="trueFalseButton"
                              onClick={() => handleTrueFalseAnswer(question.id, true)}
                            >
                              <svg class="svg-icon" viewBox="0 0 20 20">
                                <path fill="green" stroke={answers[question.id] === 'cierto' ? 'green' : 'grey'} stroke-width='1' d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                              </svg>
                              
                            </button>
                            <button
                              className="trueFalseButton"
                              onClick={() => handleTrueFalseAnswer(question.id, false)}
                            >
                              <svg class="svg-icon" viewBox="0 0 20 20">
                                <path fill="red" stroke={answers[question.id] === 'falso' ? 'red' : 'grey'} stroke-width='1' d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        question.tipus === 'escala' ? (
                          <div className='scaleQuestion' 
                              style={(section.preguntes[question.id-1] && section.preguntes[question.id-1].tipus !== 'escala') ? {borderTop: "2px solid #e0e0e0", borderBottom: "2px solid #e0e0e0"} : 
                              (section.preguntes[question.id+1] && section.preguntes[question.id+1].tipus !== 'escala') ? {paddingBottom: '5px', borderBottom: "2px solid #e0e0e0"} : {borderBottom: "2px solid #e0e0e0"}}>
                            <p className='questionText' style={{marginBottom: '2px', marginTop: '2px', textAlign: 'right'}}>{question.text}</p>
                            <div className='scaleOptions'>
                              {getColors(question.opcions.size).map((color, colorIndex) => (
                                <button
                                  key={colorIndex}
                                  className={answers[question.id] === color ? 'scaleOptionSelected' : 'scaleOption'}
                                  style={answers[question.id] === color
                                    ? { backgroundColor: color, opacity: 1 }
                                    : { backgroundColor: color, opacity: 0.4 }}
                                  onClick={() => handleScaleAnswer(question.id, color)}
                                />
                              ))}
                            </div>
                          </div>
                        ) : (
                          question.tipus === 'text' ? (
                            <input
                              type="text"
                              className="inputField"
                              placeholder=" Tu respuesta"
                              onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                            />
                          ) : (
                             question.tipus === 'numeric' ? (
                              <input
                                type="number"
                                className="inputField"
                                maxLength = "4"
                                placeholder="2024"
                                onInput={maxLengthCheck}
                                onChange={(e) => handleNumericAnswer(e, question.id)}
                              />
                            ) : (
                              question.tipus === 'multiple' ? (
                                <div className='optionContainer'>
                                  {question.opcions.map((option, optionIndex) => (
                                    <button
                                        key={optionIndex}
                                        className={`multipleChoiceOption${answers[question.id] && answers[question.id].includes(option) ? 'Selected' : ''}`}
                                        onClick={() => handleSelectMultipleOption(question.id, option)}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={answers[question.id] && answers[question.id].includes(option)}
                                          onChange={() => {}}
                                        />
                                        <p style={{marginLeft: '10px'}}>{option}</p>
                                      </button>
                                  ))}
                                </div>
                              ) : null
                            )
                          )
                        )
                      )
                    )
                  ) : null
                )}
              </div>
            ))}
          </div>
          <div className='buttonContainer'>
            {!isFormComplete() && (            
            <button 
              className="button" 
              onClick={handleNextSection}
              disabled={!sectionValid}
            >
              <span>Siguiente</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 20" width="24px" fill="none">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M16.01 11H4v2h12.01v3L20 12l-3.99-4v3z" fill="currentColor" />
              </svg>
            </button>)}
            {isFormComplete() && (
              <button className="nextButton" onClick={handleFinishForm}>
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </>
    </div>
  );
};
  

export default FormPage;
