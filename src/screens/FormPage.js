import React, { useState } from 'react';
import NavBar from "../components/NavBar";

import '../style/FormPage.css'; // Import your CSS file

let formData = [
  {
    titol: 'Per què és perillós el radó?',
    tipus: 'info',
    info: {
      // You can add information and an image here
      text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vulputate sed quam ut sollicitudin. Sed ante erat, tempus nec ipsum at, ultricies sollicitudin lorem. Maecenas lacinia purus et sodales porttitor. Donec convallis nibh ornare, egestas lacus eget, varius enim. Proin lobortis dolor sed turpis fringilla, ac cursus ligula hendrerit. Aliquam in ipsum sit amet ante egestas ultrices malesuada sed turpis. Integer tempus rhoncus lectus sit amet elementum. Etiam sodales nisi nunc, nec pretium lectus placerat id. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras quis pretium urna. Proin laoreet dictum orci ac vulputate. Vestibulum in nisi quis ipsum accumsan dictum.

Nam in dapibus nunc, in convallis augue. Nam sed bibendum tortor, in dapibus metus. Ut blandit aliquam nisi, in accumsan velit accumsan non. Vivamus consequat mattis lorem in convallis. Sed nulla mi, varius ac vehicula vitae, finibus eget libero. Etiam dolor odio, sollicitudin sed blandit non, ultrices non eros. Duis vestibulum sollicitudin ipsum eget pretium. Quisque at faucibus justo. Duis vitae mauris turpis. Quisque et sapien metus. Sed sed velit in nulla suscipit rutrum vel rhoncus massa. Maecenas condimentum ac odio sit amet imperdiet. Vestibulum aliquam elit eget leo dapibus, vitae ullamcorper urna condimentum. Phasellus mattis lacinia eros, ac aliquam metus egestas sed. Maecenas accumsan neque at egestas dapibus.
      
Fusce nec lectus imperdiet, ullamcorper arcu nec, iaculis risus. Etiam aliquam nisl leo, vel finibus justo interdum a. Integer aliquam vitae nibh id malesuada. Donec arcu nisl, malesuada sed justo ut, ullamcorper laoreet mi. Maecenas eu orci ante. Nam mollis vel est eu congue. Integer et lacus congue, aliquet lorem non, aliquet diam. Praesent a nunc mauris.`,
    },
    questions: [
      // Include any questions specific to this section
      {
        question: 'What do you think of the new section?',
        tipus: 'options',
        options: ['Great', 'Not bad', 'Meh'],
      },
    ],
  },
  {
    titol: 'Personal Information',
    questions: [
      {
        question: 'Do you have a pet?',
        tipus: 'options',
        options: ['Yes', 'No'],
      },
      {
        question: 'What type of pet do you have?',
        tipus: 'options',
        options: ['Dog', 'Cat', 'Other'],
        dependsOn: 0, // Depends on the answer to the previous question
        dependsOnValue: 'Yes', // Depends on the answer being 'Yes'
      },
      {
        question: 'And would you like to have a pet?',
        tipus: 'options',
        options: ['Yes', 'No'],
        dependsOn: 0, // Depends on the answer to the previous question
        dependsOnValue: 'No', // Depends on the answer being 'No'
      },
      {
        question: 'What is your name?',
        tipus: 'text',
      },
      {
        question: 'What is your email address?',
        tipus: 'text',
      },
      {
        question: 'This is a large question and answer to see what happens with long texts and how it behaves in small screens',
        tipus: 'options',
        options: ['For the first option I am using a random text', 
        'The second possible answer will be a little short but long enough to see if it displays the answer properly when the width is small',
        'This is another answer but please do not select it if you would like to win, is just to show what happens with an even larger answer. I was thinking to use lorem ipsum dolore but I prefer to write some weird stuff. I am adding more text to see if it wraps properly, otherwise all the text will appear in one line and we do not want that', 
        'Last but not least this answer is the shortest one :('],
      },
      {
        question: 'Is this a true or false question?',
        tipus: 'trueFalse',
      },
      {
        question: 'How satisfied are you with our service?',
        tipus: 'scale',
        scaleOptions: ['red', 'orange', 'yellow', 'green'],
      },
      {
        question: 'You can use only three colors :)',
        tipus: 'scale',
        scaleOptions: ['red', 'orange', 'green'],
      },
      {
        question: 'And other colors jeje',
        tipus: 'scale',
        scaleOptions: ['purple', 'pink', 'yellow', 'blue', 'black'],
      },
      {
        question: 'What is the capital of Spain?',
        options: ['Madrid', 'Barcelona', 'Seville', 'Valencia'],
        tipus: 'options',
      },
      // {
      //   question: 'Who is the author of Don Quixote?',
      //   options: ['Miguel de Cervantes', 'Gabriel García Márquez', 'Federico García Lorca', 'Pablo Neruda'],
      //   tipus: 'options',
      // },
      // {
      //   question: 'What is the name of the Spanish currency before the euro?',
      //   options: ['Peso', 'Lira', 'Peseta', 'Franc'],
      //   tipus: 'options',
      // },
      // {
      //   question: 'What is the most spoken language in Spain?',
      //   options: ['Spanish', 'Catalan', 'Basque', 'Galician'],
      //   tipus: 'options',
      // },
    ],
  },
  {
    titol: 'Feedback',
    questions: [
      {
        question: 'How satisfied are you with our service?',
        tipus: 'options',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
      },
      {
        question: 'Any additional comments or feedback?',
        tipus: 'text',
      },
    ],
  }, 
];


const FormPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState(Array(formData.length).fill({}));
  const [sectionValid, setSectionValid] = useState(formData[0].tipus === 'info');

  const handleSelectOption = (sectionIndex, questionIndex, option) => {
    const newAnswers = [...answers];
    newAnswers[sectionIndex] = {
      ...newAnswers[sectionIndex],
      [questionIndex]: option,
    };
    setAnswers(newAnswers);
    checkSectionCompletion(sectionIndex, newAnswers);
  };

  const handleScaleAnswer = (sectionIndex, questionIndex, selectedColor) => {
    const newAnswers = [...answers];
    newAnswers[sectionIndex] = {
      ...newAnswers[sectionIndex],
      [questionIndex]: selectedColor,
    };
    setAnswers(newAnswers);
    checkSectionCompletion(sectionIndex, newAnswers);
  };

  const handleTrueFalseAnswer = (sectionIndex, questionIndex, isTrue) => {
    const newAnswers = [...answers];
    newAnswers[sectionIndex] = {
      ...newAnswers[sectionIndex],
      [questionIndex]: isTrue,
    };
    setAnswers(newAnswers);
    checkSectionCompletion(sectionIndex, newAnswers);
  };

  const handleTextAnswer = (sectionIndex, questionIndex, text) => {
    const newAnswers = [...answers];
    newAnswers[sectionIndex] = {
      ...newAnswers[sectionIndex],
      [questionIndex]: text,
    };
    setAnswers(newAnswers);
    checkSectionCompletion(sectionIndex, newAnswers);
  };

  const checkSectionCompletion = (sectionIndex, currentAnswers) => {
    const questionsInCurrentSection = formData[sectionIndex].questions.length;
    const sectionAnswers = currentAnswers[sectionIndex];
  
    // Create a set of answered questions that are not dependent on other questions
    const independentQuestions = new Set(
      Object.keys(sectionAnswers).filter(
        (questionIndex) =>
          !formData[sectionIndex].questions[questionIndex].dependsOn
      )
    );
  
    // Count the number of dependent questions that are currently hidden
    const hiddenDependentQuestions = new Set(
      Object.keys(sectionAnswers).filter(
        (questionIndex) =>
          formData[sectionIndex].questions[questionIndex].dependsOn !== undefined &&
          (sectionAnswers[formData[sectionIndex].questions[questionIndex].dependsOn] !==
            formData[sectionIndex].questions[questionIndex].dependsOnValue)
      )
    );
  
    // Count the number of dependent questions that have been answered and are currently visible
    const answeredVisibleDependentQuestions = new Set(
      Object.keys(sectionAnswers).filter(
        (questionIndex) =>
          formData[sectionIndex].questions[questionIndex].dependsOn !== undefined &&
          formData[sectionIndex].questions[questionIndex].dependsOnValue !== undefined &&
          sectionAnswers[formData[sectionIndex].questions[questionIndex].dependsOn] ===
          formData[sectionIndex].questions[questionIndex].dependsOnValue &&
          !hiddenDependentQuestions.has(questionIndex)
      )
    );
  
    // Check if the sum of answered questions and dependent questions is equal to or greater than the total questions
    if (
      independentQuestions.size + answeredVisibleDependentQuestions.size ===
      questionsInCurrentSection - hiddenDependentQuestions.size
    ) {
      setSectionValid(true);
    } else {
      setSectionValid(false);
    }
  };
  
  
  

  const handleNextSection = () => {
    if (currentSection < formData.length - 1) {
      const nextSection = formData[currentSection + 1];
      if (nextSection.tipus !== 'info') {
        setCurrentSection(currentSection + 1);
        setSectionValid(false);
      } else {
        setCurrentSection(currentSection + 1);
        setSectionValid(true);
      }
    }
  };

  const isFormComplete = () => {
    return currentSection === formData.length - 1 && sectionValid;
  };

  const handleFinishForm = () => {
    alert('You have completed the form. Thank you for your feedback.');
    const newAnswers = Array(formData.length).fill({});
    setAnswers(newAnswers);
    setCurrentSection(0);
    setSectionValid(false);
  };

  return (
    <>
      <NavBar />
      <div className="container">
        {formData.map((section, sectionIndex) => (
          sectionIndex === currentSection && (
            <div key={sectionIndex} className="card">
              {section.tipus !== 'info' && <p className='sectionNumber'>Section {sectionIndex + 1} of {formData.length}</p>}
              <h2 className='titol'>{section.titol}</h2>
              {section.tipus === 'info' && (
                <div className='infoSection'>
                  <p className='infoText'>{section.info.text}</p>
                  {/* Handle image rendering if needed */}
                </div>
              )}
              {section.tipus !== 'info' && section.questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  {question.tipus !== 'scale' && question.tipus !== 'trueFalse' && (question.dependsOn === undefined ||
                    (answers[sectionIndex][question.dependsOn] === question.dependsOnValue)) && <p className='questionText'>{question.question}</p>}
                  {sectionIndex === currentSection && (
                    question.dependsOn === undefined ||
                    (answers[sectionIndex][question.dependsOn] === question.dependsOnValue) ? (
                      question.tipus === 'options' ? (
                        <div className='optionContainer'>
                          {question.options.map((option, optionIndex) => (
                            <button
                              key={optionIndex}
                              className={answers[sectionIndex][questionIndex] === option ? 'selectedOption' : 'option'}
                              onClick={() => handleSelectOption(sectionIndex, questionIndex, option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : (
                        question.tipus === 'trueFalse' ? (
                          <div className='scaleQuestion'>
                            <p className='questionText'>{question.question}</p>
                            <div className='trueFalseButtons'>
                              <button
                                className={answers[sectionIndex][questionIndex] === true ? 'trueButtonSelected' : 'trueFalseButton'}
                                onClick={() => handleTrueFalseAnswer(sectionIndex, questionIndex, true)}
                              >
                                True
                              </button>
                              <button
                                className={answers[sectionIndex][questionIndex] === false ? 'falseButtonSelected' : 'trueFalseButton'}
                                onClick={() => handleTrueFalseAnswer(sectionIndex, questionIndex, false)}
                              >
                                False
                              </button>
                            </div>
                          </div>
                        ) : (
                          question.tipus === 'scale' ? (
                            <div className='scaleQuestion'>
                              <p className='questionText'>{question.question}</p>
                              <div className='scaleOptions'>
                                {question.scaleOptions.map((color, colorIndex) => (
                                  <button
                                    key={colorIndex}
                                    className={answers[sectionIndex][questionIndex] === color ? 'scaleOptionSelected' : 'scaleOption'}
                                    style={answers[sectionIndex][questionIndex] === color
                                      ? { backgroundColor: color, opacity: 1 }
                                      : { backgroundColor: color, opacity: 0.4 }}
                                    onClick={() => handleScaleAnswer(sectionIndex, questionIndex, color)}
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
                                onChange={(e) => handleTextAnswer(sectionIndex, questionIndex, e.target.value)}
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
          )
        ))}
        <div className='buttonContainer'>
          {!isFormComplete() && (<button
            className={(!sectionValid || isFormComplete()) ? 'nextButtonDisabled' : 'nextButton'}
            onClick={handleNextSection}
            disabled={!sectionValid || isFormComplete()}
          >
            Next
          </button>)}
          {isFormComplete() && (
            <button className="finishButton" onClick={handleFinishForm}>
              Finish
            </button>
          )}
        </div>
      </div>
    </>
  );
};
  

export default FormPage;
