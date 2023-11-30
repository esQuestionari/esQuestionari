import React, {useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import { useNavigate, useParams} from 'react-router-dom';
import sendRequest from "../components/utilFetch";

import '../style/FormPage.css'; 

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
      setAnswers(Array(result.preguntes.length).fill({}));
    } catch (error) {
      console.error("falla formPage info apartat", error); 
    }
  };
  
  const navigate = useNavigate();
  const {enquestaId} = useParams(); 
  const [isLoading, setLoading] = useState(true);
  const [infoEnquesta, setInfoEnquesta] = useState({});
  const [apartatsIds, setApartatsIds] = useState([]);
  const [section, setSection] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sectionValid, setSectionValid] = useState(true);

  const initializeData = async () => {
    setCurrentSection(0);
    const result = await handleInfoEnquesta();
    //setInfoEnquesta(result);
    const apartats = await handleApartatsEnquesta();
    //setApartatsIds(apartats);
    const seccio = await handleInfoApartat(apartats, currentSection);
    //setSection(seccio);
    setLoading(false);
  };

useEffect(() => {
  initializeData();
}, [])

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       window.scrollTo(0, 0);
//       setCurrentSection(0);
//       const result = await handleInfoEnquesta();
//       setInfoEnquesta(result);
//       setLoadingEnquesta(false);
//     } catch (error) {
//       console.error("Error fetching info enquesta:", error);
//     }
//   };
//   fetchData();
//   console.log("info enquesta: ", infoEnquesta);
// }, [setInfoEnquesta]);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const apartats = await handleApartatsEnquesta();
//       setApartatsIds(apartats);
//       setLoadingApartatsIds(false);
//     } catch (error) {
//       console.error("Error fetching apartats:", error);
//     }
//   };
//   fetchData();
//   console.log("apartats: ", apartatsIds);
// }, [setApartatsIds]);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const seccio = await handleInfoApartat(apartatsIds, currentSection);
//       setSection(seccio);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching info apartat:", error);
//     }
//   };
//   fetchData();
//   console.log("preguntes apartat: ", section);
// }, [apartatsIds]);


  
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


  return (
    <>
      <NavBar />
      <div className="container">
        <div key={currentSection} className="card">
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
                        <p className='questionText'>{question.question}</p>
                        <div className='trueFalseButtons'>
                          <button
                            className={`trueFalseButton ${answers[questionIndex] === true ? 'true' : ''}`}
                            onClick={() => handleTrueFalseAnswer(questionIndex, true)}
                          >
                            True
                          </button>
                          <button
                            className={`trueFalseButton ${answers[questionIndex] === false ? 'false' : ''}`}
                            onClick={() => handleTrueFalseAnswer(questionIndex, false)}
                          >
                            False
                          </button>
                        </div>
                      </div>
                    ) : (
                      question.tipus === 'escala' ? (
                        <div className='scaleQuestion'>
                          <p className='questionText'>{question.question}</p>
                          <div className='scaleOptions'>
                            {question.opcions.map((color, colorIndex) => (
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
                            placeholder="Your Answer"
                            onChange={(e) => handleTextAnswer(questionIndex, e.target.value)}
                          />
                        ) : null
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
    </>
  );
};
  

export default FormPage;
