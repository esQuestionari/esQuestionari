import React, {useState, useEffect } from 'react';
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
      const result = await sendRequest({
        url: `http://nattech.fib.upc.edu:40511/api/enquestes/${enquestaId}/apartats/${apartats[idx]}/`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
  
      console.log(result); 
      setSection(result);
      setAnswers(Array(section.preguntes.length).fill([]));

    } catch (error) {
      console.error("falla formPage info apartat", error); 
    }
  };
  
  const navigate = useNavigate();
  const {enquestaId} = useParams(); 
  const [isLoading, setLoading] = useState(true);
  const [infoEnquesta, setInfoEnquesta] = useState({});
  const [apartatsIds, setApartatsIds] = useState(null);
  const [section, setSection] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sectionValid, setSectionValid] = useState(true);

  const initializeData = async () => {
    setCurrentSection(3);
    const result = await handleInfoEnquesta();
    const apartats = await handleApartatsEnquesta();
    const seccio = await handleInfoApartat(apartats, currentSection);

  };

useEffect(() => {
  initializeData();
}, [])

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('profile'));
  console.log("user", user.given_name); //aqui tots els atributs que vulguis
  if(apartatsIds) {
    setLoading(false);
  }
}, [apartatsIds])

  
  const handleSelectOption = (questionIndex, option) => {
    let newAnswers = [...answers];
    newAnswers[questionIndex] = option;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };

  const handleScaleAnswer = (questionIndex, selectedColor) => {
    let newAnswers = [...answers];
    newAnswers[questionIndex] = selectedColor;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };

  const handleTrueFalseAnswer = (questionIndex, isTrue) => {
    let newAnswers = [...answers];
    newAnswers[questionIndex] = isTrue;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };

  const handleTextAnswer = (questionIndex, text) => {
    let newAnswers = [...answers];
    newAnswers[questionIndex] =  text;
    setAnswers(newAnswers);
    checkSectionCompletion(newAnswers);
  };

  const checkSectionCompletion = (sectionAnswers) => {
    const questionsInCurrentSection = section.preguntes.length;
    return true;
    // Create a set of answered questions that are not dependent on other questions
    const independentQuestions = new Set(
      Object.keys(sectionAnswers).filter(
        (questionIndex) =>
          section.preguntes[questionIndex].enCasDe === null
      )
    );
  
    // Count the number of dependent questions that are currently hidden
    const hiddenDependentQuestions = new Set(
      Object.keys(questionsInCurrentSection).filter(
        (questionIndex) =>
          section.preguntes[questionIndex].enCasDe !== null &&
          (section.preguntes[questionIndex].enCasDe !==
            section.preguntes[questionIndex].opcioEnCasDe)
      )
    );
  
    // Count the number of dependent questions that have been answered and are currently visible
    const answeredVisibleDependentQuestions = new Set(
      Object.keys(sectionAnswers).filter(
        (questionIndex) =>
          section.preguntes[questionIndex].enCasDe !== null &&
          section.preguntes[questionIndex].opcioEnCasDe !== null &&
          sectionAnswers[section.preguntes[questionIndex].enCasDe] ===
          section.preguntes[questionIndex].opcioEnCasDe &&
          !hiddenDependentQuestions.has(questionIndex)
      )
    );
  
    console.log(independentQuestions.size, answeredVisibleDependentQuestions.size, questionsInCurrentSection, hiddenDependentQuestions.size);
    // Check if the sum of answered questions and dependent questions is equal to or greater than the total questions
    if (
      independentQuestions.size + answeredVisibleDependentQuestions.size ===
      questionsInCurrentSection - hiddenDependentQuestions.size
    ) {
      setSectionValid(true);
    } else {
      setSectionValid(true);
    }
  };
  
  const handleSelectMultipleOption = (questionIndex, option) => {
    let newAnswers = [...answers];
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
  

  const handleNextSection = () => {
    if (currentSection < infoEnquesta.numApartats - 1) {
      console.log("next section: ", currentSection+1);
      console.log("apartats: ", apartatsIds);
      console.log("next section id: ", apartatsIds[currentSection + 1])
      handleInfoApartat(apartatsIds, currentSection + 1);
      setCurrentSection(currentSection + 1);
      setSectionValid(true);
      window.scrollTo({
          top: 0,
      });
    }
  };

  const isFormComplete = () => {
    return currentSection === infoEnquesta.numApartats - 1 && sectionValid;
  };

  const handleFinishForm = () => {
    //alert('You have completed the form. Thank you for your feedback.');
    const newAnswers = Array(section.preguntes.length).fill({});
    setAnswers(newAnswers);
    setCurrentSection(0);
    setSectionValid(false);
    navigate(`/${enquestaId}/end`);
  };

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

  if  (isLoading) {
    return (
      <>
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
    );
  }

  return (
    <>
      <NavBar />
      <div className="contenidor">
        <div className="cards">
          <div className="information [ cardEnquesta ]">
            {<p className='sectionNumber'>Sección {currentSection + 1} de {infoEnquesta.numApartats}</p>}
            <h2 className='titol'>{section.titol}</h2>
            {section.introduccio !== undefined && (
              <div className='infoSection'>
                <p className='infoText'>{section.introduccio}</p>
                {/* Handle image rendering if needed */}
              </div>
            )}
            {section.preguntes && section.preguntes.map((question, questionIndex) => (
              <div key={questionIndex}>
                {question.tipus !== 'escala' && question.tipus !== 'certofals' && (question.enCasDe === null ||
                  (answers[question.enCasDe] === question.opcioEnCasDe)) && <p className='questionText'>{question.text}</p>}
                {(
                  question.enCasDe === null ||
                  (answers[question.enCasDe] === question.opcioEnCasDe) ? (
                    question.tipus === 'opcions' ? (
                      <div className='optionContainer'>
                        {question.opcions.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            className={answers[questionIndex] === option ? 'selectedOption' : 'option'}
                            onClick={() => handleSelectOption(questionIndex, option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      question.tipus === 'certofals' ? (
                        <div className='scaleQuestion'>
                          <p className='questionText'>{question.text}</p>
                          <div className='trueFalseButtons'>
                            <button
                              className="trueFalseButton"
                              onClick={() => handleTrueFalseAnswer(questionIndex, true)}
                            >
                              <svg class="svg-icon" viewBox="0 0 20 20">
                                <path fill="green" stroke={answers[questionIndex] === true ? 'green' : 'grey'} stroke-width='1' d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                              </svg>
                              
                            </button>
                            <button
                              className="trueFalseButton"
                              onClick={() => handleTrueFalseAnswer(questionIndex, false)}
                            >
                              <svg class="svg-icon" viewBox="0 0 20 20">
                                <path fill="red" stroke={answers[questionIndex] === false ? 'red' : 'grey'} stroke-width='1' d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        question.tipus === 'escala' ? (
                          <div className='scaleQuestion' 
                              style={(section.preguntes[questionIndex-1] && section.preguntes[questionIndex-1].tipus !== 'escala') ? {borderTop: "2px solid #e0e0e0"} : 
                              (section.preguntes[questionIndex+1] && section.preguntes[questionIndex+1].tipus !== 'escala') ? {paddingBottom: '5px', borderBottom: "2px solid #e0e0e0"} : {}}>
                            <p className='questionText' style={{marginBottom: '2px', textAlign: 'right'}}>{question.text}</p>
                            <div className='scaleOptions'>
                              {getColors(question.opcions.size).map((color, colorIndex) => (
                                <button
                                  key={colorIndex}
                                  className={answers[questionIndex] === color ? 'scaleOptionSelected' : 'scaleOption'}
                                  style={answers[questionIndex] === color
                                    ? { backgroundColor: color, opacity: 1 }
                                    : { backgroundColor: color, opacity: 0.4 }}
                                  onClick={() => handleScaleAnswer(questionIndex, color)}
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
                              onChange={(e) => handleTextAnswer(questionIndex, e.target.value)}
                            />
                          ) : (
                            question.tipus === 'multiple' ? (
                              <div className='optionContainer'>
                                {question.opcions.map((option, optionIndex) => (
                                  <button
                                      key={optionIndex}
                                      className={`multipleChoiceOption${answers[questionIndex] && answers[questionIndex].includes(option) ? 'Selected' : ''}`}
                                      onClick={() => handleSelectMultipleOption(questionIndex, option)}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={answers[questionIndex] && answers[questionIndex].includes(option)}
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
                  ) : null
                )}
              </div>
            ))}
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
      </div>
    </>
  );
};
  

export default FormPage;
