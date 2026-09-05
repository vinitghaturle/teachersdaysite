import React, { useState } from 'react';
import { useQuiz } from '../../context/QuizContext';
import './QuizPageOverlay.css';

export const QuizPageOverlay = () => {
  const {
    questions,
    answers,
    score,
    currentPage,
    isBookEntered,
    userName,
    selectAnswer,
    restartQuiz,
    goToPage,
    resultData,
  } = useQuiz();

  // Only active when book is opened and on quiz pages 3 to 8
  if (!isBookEntered || currentPage < 3 || currentPage > 8) {
    return null;
  }

  const stopCapture = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
  };

  // Page 8: Dedicated bottom action controls for Result page
  if (currentPage === 8) {
    return (
      <div
        className="quiz-bottom-bar-wrapper"
        data-clickable="true"
        onClick={stopCapture}
        onMouseDown={stopCapture}
        onMouseUp={stopCapture}
        onPointerDown={stopCapture}
        onPointerUp={stopCapture}
        onTouchStart={stopCapture}
        onTouchEnd={stopCapture}
      >
        <div className="quiz-bottom-bar" data-clickable="true">
          <button
            type="button"
            className="quiz-bar-btn prev"
            data-clickable="true"
            onClick={(e) => {
              stopCapture(e);
              goToPage(7);
            }}
            onMouseDown={stopCapture}
            onPointerDown={stopCapture}
            onTouchStart={stopCapture}
          >
            ← Review Q5
          </button>

          <div className="quiz-bar-score-display">
            <span>Score: <strong>{score} / 5</strong></span>
          </div>

          <button
            type="button"
            className="quiz-bar-btn restart"
            data-clickable="true"
            onClick={(e) => {
              stopCapture(e);
              restartQuiz();
            }}
            onMouseDown={stopCapture}
            onPointerDown={stopCapture}
            onTouchStart={stopCapture}
          >
            <span>🔄 Try 5 New Questions</span>
          </button>
        </div>
      </div>
    );
  }

  // Quiz questions for Pages 3..7
  const questionIndex = currentPage - 3; // 0, 1, 2, 3, 4
  const question = questions[questionIndex];
  if (!question) return null;

  const selectedOptionIndex = answers[questionIndex];
  const isAnswered = selectedOptionIndex !== undefined;
  const isLastQuestion = questionIndex === 4;

  // Score of questions submitted before the current question (so current question does not reveal right/wrong)
  const visibleScore = questions.slice(0, questionIndex).reduce((acc, prevQ, prevIdx) => {
    const chosenOpt = answers[prevIdx];
    if (chosenOpt !== undefined && prevQ.options[chosenOpt]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleOptionSelect = (e, optionIdx) => {
    stopCapture(e);
    selectAnswer(questionIndex, optionIdx);
  };

  const handleNext = (e) => {
    stopCapture(e);
    goToPage(currentPage + 1);
  };

  const handlePrev = (e) => {
    stopCapture(e);
    if (currentPage > 3) {
      goToPage(currentPage - 1);
    }
  };

  const optionNumbers = [1, 2, 3, 4];

  return (
    <>
      {/* Transparent Clickable Hotspot Zones over the 4 Textured Options on the 3D Book */}
      <div
        className="quiz-transparent-hotspot-container"
        data-clickable="true"
        onClick={stopCapture}
        onMouseDown={stopCapture}
        onMouseUp={stopCapture}
        onPointerDown={stopCapture}
        onPointerUp={stopCapture}
        onTouchStart={stopCapture}
        onTouchEnd={stopCapture}
      >
        <div className="quiz-hotspot-spread">
          <div className="quiz-hotspot-left" />
          <div className="quiz-hotspot-right">
            {question.options.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`quiz-hotspot-card ${selectedOptionIndex === idx ? 'selected' : ''}`}
                data-clickable="true"
                onClick={(e) => handleOptionSelect(e, idx)}
                onMouseDown={stopCapture}
                onMouseUp={stopCapture}
                onPointerDown={stopCapture}
                onTouchStart={stopCapture}
                onTouchEnd={stopCapture}
                title={`Click to select Option ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Circle Selector (1) (2) (3) (4) & Navigation Toolbar */}
      <div
        className="quiz-bottom-bar-wrapper"
        data-clickable="true"
        onClick={stopCapture}
        onMouseDown={stopCapture}
        onMouseUp={stopCapture}
        onPointerDown={stopCapture}
        onPointerUp={stopCapture}
        onTouchStart={stopCapture}
        onTouchEnd={stopCapture}
      >
        <div className="quiz-bottom-bar" data-clickable="true">
          {/* Back button */}
          {currentPage > 3 && (
            <button
              type="button"
              className="quiz-bar-btn prev"
              data-clickable="true"
              onClick={handlePrev}
              onMouseDown={stopCapture}
              onPointerDown={stopCapture}
              onTouchStart={stopCapture}
            >
              ← Back
            </button>
          )}

          {/* 1, 2, 3, 4 inside Circles for Option Selection */}
          <div className="quiz-circle-selector-group">
            <span className="quiz-selector-label">Choose Option:</span>
            <div className="quiz-circle-buttons">
              {optionNumbers.map((num, idx) => {
                const isSelected = selectedOptionIndex === idx;
                return (
                  <button
                    key={num}
                    type="button"
                    className={`quiz-circle-num-btn ${isSelected ? 'selected' : ''}`}
                    data-clickable="true"
                    onClick={(e) => handleOptionSelect(e, idx)}
                    onMouseDown={stopCapture}
                    onMouseUp={stopCapture}
                    onPointerDown={stopCapture}
                    onTouchStart={stopCapture}
                    onTouchEnd={stopCapture}
                    aria-label={`Select Option ${num}`}
                  >
                    <span className="quiz-circle-num">{num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Score Counter: shows previous submitted score until next question is clicked */}
          <div className="quiz-bar-score-display">
            <span>Score: <strong>{visibleScore}/5</strong></span>
          </div>

          {/* Next button */}
          <button
            type="button"
            className={`quiz-bar-btn next ${!isAnswered ? 'disabled' : ''}`}
            disabled={!isAnswered}
            data-clickable="true"
            onClick={handleNext}
            onMouseDown={stopCapture}
            onPointerDown={stopCapture}
            onTouchStart={stopCapture}
          >
            <span>{isLastQuestion ? 'View Result (Page 8) →' : 'Next Question →'}</span>
          </button>
        </div>
      </div>
    </>
  );
};




