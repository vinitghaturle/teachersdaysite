import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { QuizSizeController } from '../DevController/QuizSizeController';
import './QuizPageOverlay.css';

const DEFAULT_SETTINGS = {
  widthPercent: 71,
  heightPercent: 80,
  offsetY: 14,
  questionFontSize: 20,
  optionFontSize: 13,
  spreadGap: 30,
  optionPadding: 7,
  borderWidth: 2.5,
};

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

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('htwkr_quiz_dev_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Only active when book is opened and on quiz pages 3 to 8
  if (!isBookEntered || currentPage < 3 || currentPage > 8) {
    return null;
  }

  const stopCapture = (e) => {
    e.stopPropagation();
  };

  // Page 8: Result Screen embedded on book page
  if (currentPage === 8) {
    return (
      <>
        <div
          className="quiz-page-container quiz-result-page-container"
          data-clickable="true"
          onMouseDown={stopCapture}
          onPointerDown={stopCapture}
          onTouchStart={stopCapture}
          style={{
            width: `calc(var(--bookPixelWidth, 880px) * ${settings.widthPercent / 100})`,
            minHeight: `calc(var(--bookPixelWidth, 880px) * 0.57143 * ${settings.heightPercent / 100})`,
            transform: `translate(-50%, calc(-50% + ${settings.offsetY}px))`,
          }}
        >
          <div
            className="quiz-book-spread"
            style={{ gap: `${settings.spreadGap}px` }}
          >
            {/* LEFT PAGE: Score & Badges */}
            <div className="quiz-left-page quiz-result-left" data-clickable="true">
              <div className="quiz-header-meta">
                <span
                  className="quiz-qnum-tag"
                  style={{ borderWidth: `${settings.borderWidth}px` }}
                >
                  FINAL RESULT
                </span>
                <span
                  className="quiz-difficulty-tag"
                  style={{ borderWidth: `${settings.borderWidth}px` }}
                >
                  {resultData.score}
                </span>
              </div>

              <div className="quiz-result-score-block">
                <div className="quiz-result-icon">{resultData.badge}</div>
                <h2 className="quiz-result-title">{resultData.label}</h2>
                {userName && (
                  <p className="quiz-result-teacher-name">
                    Dedicated to: <strong>{userName}</strong>
                  </p>
                )}
              </div>

              <div
                className="quiz-result-stats-row"
                style={{ borderTopWidth: `${settings.borderWidth}px` }}
              >
                <div className="quiz-stat-pill" style={{ borderWidth: `${settings.borderWidth}px` }}>
                  <span>Correct: <strong>{score}/5</strong></span>
                </div>
                <div className="quiz-stat-pill" style={{ borderWidth: `${settings.borderWidth}px` }}>
                  <span>Accuracy: <strong>{Math.round((score / 5) * 100)}%</strong></span>
                </div>
              </div>
            </div>

            {/* RIGHT PAGE: Message & Actions */}
            <div className="quiz-right-page quiz-result-right" data-clickable="true">
              <div className="quiz-options-header">
                <span className="quiz-options-title">The Compliment</span>
                <span
                  className="quiz-points-badge"
                  style={{ borderWidth: `${settings.borderWidth}px` }}
                >
                  Teacher's Day
                </span>
              </div>

              <div className="quiz-result-message-box">
                <p className="quiz-result-description">
                  "{resultData.message}"
                </p>
              </div>

              <div
                className="quiz-actions-row"
                style={{ borderTopWidth: `${settings.borderWidth}px` }}
              >
                <button
                  type="button"
                  className="quiz-prev-btn"
                  data-clickable="true"
                  onClick={() => goToPage(7)}
                  onMouseDown={stopCapture}
                  onPointerDown={stopCapture}
                  onTouchStart={stopCapture}
                  style={{ borderWidth: `${settings.borderWidth}px` }}
                >
                  ← Review Q5
                </button>

                <button
                  type="button"
                  className="quiz-next-btn"
                  data-clickable="true"
                  onClick={restartQuiz}
                  onMouseDown={stopCapture}
                  onPointerDown={stopCapture}
                  onTouchStart={stopCapture}
                  style={{ borderWidth: `${settings.borderWidth}px` }}
                >
                  <span>🔄 Try 5 New Questions</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Dev Controller for Live Tuning */}
        <QuizSizeController settings={settings} setSettings={setSettings} />
      </>
    );
  }

  // Quiz questions for Pages 3..7
  const questionIndex = currentPage - 3; // 0, 1, 2, 3, 4
  const question = questions[questionIndex];
  if (!question) return null;

  const selectedOptionIndex = answers[questionIndex];
  const isAnswered = selectedOptionIndex !== undefined;
  const isLastQuestion = questionIndex === 4;

  const handleOptionSelect = (optionIdx) => {
    selectAnswer(questionIndex, optionIdx);
  };

  const handleNext = () => {
    // Go to next page (Page 7 -> Page 8 for results)
    goToPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 3) {
      goToPage(currentPage - 1);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <>
      <div
        className="quiz-page-container"
        data-clickable="true"
        onMouseDown={stopCapture}
        onPointerDown={stopCapture}
        onTouchStart={stopCapture}
        style={{
          width: `calc(var(--bookPixelWidth, 880px) * ${settings.widthPercent / 100})`,
          minHeight: `calc(var(--bookPixelWidth, 880px) * 0.57143 * ${settings.heightPercent / 100})`,
          transform: `translate(-50%, calc(-50% + ${settings.offsetY}px))`,
        }}
      >
        {/* Two-page book spread: Left is Question, Right is Options */}
        <div
          className="quiz-book-spread"
          style={{ gap: `${settings.spreadGap}px` }}
        >
          {/* LEFT SIDE: Question prompt & Info */}
          <div className="quiz-left-page" data-clickable="true">
            <div className="quiz-header-meta">
              <span
                className="quiz-qnum-tag"
                style={{ borderWidth: `${settings.borderWidth}px` }}
              >
                QUESTION 0{questionIndex + 1} / 05
              </span>
              <span
                className="quiz-difficulty-tag"
                style={{ borderWidth: `${settings.borderWidth}px` }}
              >
                {question.difficulty === 'Easy' ? 'Classroom Moment' : 'Real-Life Scenario'}
              </span>
            </div>

            <div className="quiz-question-box">
              <p
                className="quiz-question-prompt"
                style={{ fontSize: `${settings.questionFontSize}px` }}
              >
                "{question.scenario}"
              </p>
            </div>

            <div
              className="quiz-left-footer"
              style={{ borderTopWidth: `${settings.borderWidth}px` }}
            >
              <div className="quiz-score-indicator">
                <span>⭐ Score: <strong>{score}</strong> / 5</span>
              </div>
              {userName && (
                <span
                  className="quiz-teacher-pill"
                  style={{ borderWidth: `${settings.borderWidth}px` }}
                >
                  Teacher: {userName}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: 4 Selectable Options with only text & black border */}
          <div className="quiz-right-page" data-clickable="true">
            <div className="quiz-options-header">
              <span className="quiz-options-title">Select the best completion:</span>
              <span
                className="quiz-points-badge"
                style={{ borderWidth: `${settings.borderWidth}px` }}
              >
                +1 pt
              </span>
            </div>

            <div className="quiz-options-list">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                let cardClass = 'quiz-option-card';
                if (isSelected) {
                  cardClass += ' selected';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={cardClass}
                    data-clickable="true"
                    onClick={() => handleOptionSelect(idx)}
                    onMouseDown={stopCapture}
                    onPointerDown={stopCapture}
                    onTouchStart={stopCapture}
                    aria-label={`Option ${optionLetters[idx]}: ${opt.text}`}
                    style={{
                      borderWidth: `${isSelected ? settings.borderWidth + 1.5 : settings.borderWidth}px`,
                      padding: `${settings.optionPadding}px 14px`,
                    }}
                  >
                    <span
                      className="quiz-option-letter"
                      style={{ borderWidth: `${settings.borderWidth}px` }}
                    >
                      {optionLetters[idx]}
                    </span>
                    <span
                      className="quiz-option-text"
                      style={{ fontSize: `${settings.optionFontSize}px` }}
                    >
                      {opt.text}
                    </span>
                    {isSelected && (
                      <span className="quiz-option-check">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation Actions on Right Page */}
            <div
              className="quiz-actions-row"
              style={{ borderTopWidth: `${settings.borderWidth}px` }}
            >
              {currentPage > 3 && (
                <button
                  type="button"
                  className="quiz-prev-btn"
                  data-clickable="true"
                  onClick={handlePrev}
                  onMouseDown={stopCapture}
                  onPointerDown={stopCapture}
                  onTouchStart={stopCapture}
                  style={{ borderWidth: `${settings.borderWidth}px` }}
                >
                  ← Back
                </button>
              )}

              <button
                type="button"
                className={`quiz-next-btn ${!isAnswered ? 'disabled' : ''}`}
                disabled={!isAnswered}
                data-clickable="true"
                onClick={handleNext}
                onMouseDown={stopCapture}
                onPointerDown={stopCapture}
                onTouchStart={stopCapture}
                style={{ borderWidth: `${settings.borderWidth}px` }}
              >
                <span>
                  {isLastQuestion ? 'Next → (Page 8 Result)' : 'Next Question →'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Dev Controller for Live Tuning */}
      <QuizSizeController settings={settings} setSettings={setSettings} />
    </>
  );
};



