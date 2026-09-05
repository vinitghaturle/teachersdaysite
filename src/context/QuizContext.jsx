import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getRandomQuestions, RESULT_MESSAGES } from '../data/questionBank';
import { renderAllQuizTextures } from '../utils/pageTextureRenderer';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState(() => getRandomQuestions(5));
  const [answers, setAnswers] = useState({}); // { [questionIndex: 0..4]: selectedOptionIndex }
  const [currentPage, setCurrentPage] = useState(0);
  const [isBookEntered, setIsBookEntered] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('htwkr_userName') || '');
  const [showResultModal, setShowResultModal] = useState(false);
  const [timeTaken, setTimeTaken] = useState('00 : 45');
  const startTimeRef = useRef(Date.now());
  const isEngineReadyRef = useRef(false);

  // Compute total score based on selected answers
  const score = Object.entries(answers).reduce((acc, [qIdxStr, optIdx]) => {
    const qIdx = parseInt(qIdxStr, 10);
    const q = questions[qIdx];
    if (q && q.options[optIdx]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const resultData = RESULT_MESSAGES[score] || RESULT_MESSAGES[0];

  useEffect(() => {
    const handlePageChange = (e) => {
      const page = e.detail?.page;
      const entered = e.detail?.entered;
      if (typeof page === 'number') {
        setCurrentPage(page);
        if (page === 8) {
          const elapsedSec = Math.max(12, Math.floor((Date.now() - startTimeRef.current) / 1000));
          const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
          const secs = String(elapsedSec % 60).padStart(2, '0');
          setTimeTaken(`${mins} : ${secs}`);
        }
      }
      if (entered !== undefined) {
        setIsBookEntered(entered);
        if (entered) {
          startTimeRef.current = Date.now();
        }
      }
    };

    const handleUserNameSaved = (e) => {
      if (e.detail?.name) {
        setUserName(e.detail.name);
      }
    };

    window.addEventListener('htwkr:pageChange', handlePageChange);
    window.addEventListener('htwkr:userNameSaved', handleUserNameSaved);

    // Initial and periodic check to wait for Three.js engine pageMaterials ready
    const timer = setInterval(() => {
      if (window.Main && window.Main.maskRevealView && window.Main.maskRevealView.pageMaterials && window.Main.maskRevealView.pageMaterials.length >= 8) {
        isEngineReadyRef.current = true;
        renderAllQuizTextures(questions, answers, score, userName, resultData, timeTaken);
        clearInterval(timer);
      }
    }, 500);

    return () => {
      window.removeEventListener('htwkr:pageChange', handlePageChange);
      window.removeEventListener('htwkr:userNameSaved', handleUserNameSaved);
      clearInterval(timer);
    };
  }, []);

  // Update textures whenever questions, answers, score, username, or timeTaken change
  useEffect(() => {
    if (isEngineReadyRef.current || (window.Main && window.Main.maskRevealView && window.Main.maskRevealView.pageMaterials)) {
      renderAllQuizTextures(questions, answers, score, userName, resultData, timeTaken);
    }
  }, [questions, answers, score, userName, timeTaken]);

  const selectAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const restartQuiz = () => {
    const newQuestions = getRandomQuestions(5);
    setQuestions(newQuestions);
    setAnswers({});
    setShowResultModal(false);
    // Turn back to page 3 (first question)
    if (window.Main && window.Main.maskRevealView) {
      window.Main.maskRevealView.setCurrentPage(3);
    }
  };

  const goToPage = (pageIndex) => {
    if (window.Main && window.Main.maskRevealView) {
      window.Main.maskRevealView.setCurrentPage(pageIndex);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        answers,
        score,
        currentPage,
        isBookEntered,
        userName,
        selectAnswer,
        restartQuiz,
        goToPage,
        showResultModal,
        setShowResultModal,
        resultData,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

