import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { SCORE_TIERS } from '../../data/questionBank';
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
    timeTaken,
  } = useQuiz();

  // Mobile Bottom Sheet expanded state: default expanded so mobile users can easily read questions
  const [isMobileExpanded, setIsMobileExpanded] = useState(true);

  // Auto-expand sheet when navigating to a new question or result page
  useEffect(() => {
    setIsMobileExpanded(true);
  }, [currentPage]);

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

  // ==========================================
  // PAGE 8: RESULT SCREEN (Desktop & Mobile Sheet)
  // ==========================================
  if (currentPage === 8) {
    const currentTierObj = SCORE_TIERS.find((t) => score >= t.minScore && score <= t.maxScore) || SCORE_TIERS[0];

    return (
      <>
        {/* Desktop Transparent Hotspot directly over the on-paper "Play Again →" button on the 3D book */}
        <div
          className="quiz-transparent-hotspot-container desktop-only"
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
            <div className="quiz-hotspot-right p8-hotspot-right">
              <button
                type="button"
                className="p8-paper-play-again-hotspot"
                data-clickable="true"
                title="Play Again"
                onClick={(e) => {
                  stopCapture(e);
                  restartQuiz();
                }}
                onMouseDown={stopCapture}
                onPointerDown={stopCapture}
                onTouchStart={stopCapture}
              />
            </div>
          </div>
        </div>

        {/* Desktop Floating Bottom Navigation Bar */}
        <div
          className="quiz-bottom-bar-wrapper desktop-only"
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
              ← Back to Questions
            </button>

            <div className="quiz-bar-score-display">
              <span>Final Score: <strong>{score}/5</strong></span>
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
              <span>Play Again ↺</span>
            </button>
          </div>
        </div>

        {/* Mobile Collapsible Result Bottom Sheet */}
        <div
          className={`mobile-bottom-sheet ${isMobileExpanded ? 'expanded' : 'collapsed'}`}
          data-clickable="true"
          onClick={stopCapture}
          onMouseDown={stopCapture}
          onMouseUp={stopCapture}
          onPointerDown={stopCapture}
          onPointerUp={stopCapture}
          onTouchStart={stopCapture}
          onTouchEnd={stopCapture}
        >
          {/* Header Peek Bar */}
          <div
            className="mbs-peek-bar"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            title="Tap to Expand / Collapse Result Sheet"
          >
            <div className="mbs-drag-handle" />
            <div className="mbs-peek-content">
              <span className="mbs-peek-title">
                🏆 <strong>Final Result Ready</strong> ({score}/5)
              </span>
              <span className="mbs-peek-toggle-hint">
                {isMobileExpanded ? '▼ Tap to Hide' : '▲ Tap to Read'}
              </span>
            </div>
          </div>

          {/* Expanded Result Sheet Body */}
          {isMobileExpanded && (
            <div className="mbs-expanded-body">
              <div className="mbs-result-top-badge">
                <span>🎓 TEACHERS' DAY SPECIAL EDITION</span>
              </div>

              <div className="mbs-result-hero">
                <span className="mbs-result-prefix">
                  {userName ? `${userName}, You're a` : "You're a"}
                </span>
                <div className="mbs-result-tier-pill">
                  {resultData.label}!
                </div>
              </div>

              <p className="mbs-result-desc">
                {resultData.desc || resultData.message}
              </p>

              {/* Stats Row */}
              <div className="mbs-result-stats-row">
                <div className="mbs-stat-box">
                  <span className="mbs-stat-icon">🏆</span>
                  <div className="mbs-stat-text">
                    <small>FINAL SCORE</small>
                    <strong>{score} / 5</strong>
                  </div>
                </div>
                <div className="mbs-stat-box">
                  <span className="mbs-stat-icon">⏱</span>
                  <div className="mbs-stat-text">
                    <small>TIME TAKEN</small>
                    <strong>{timeTaken}</strong>
                  </div>
                </div>
              </div>

              {/* Active Tier Card */}
              <div className="mbs-active-tier-card">
                <div className="mbs-tier-card-left">
                  <span className="mbs-tier-icon">{currentTierObj.icon}</span>
                </div>
                <div className="mbs-tier-card-right">
                  <div className="mbs-tier-card-title-row">
                    <strong>{currentTierObj.label}</strong>
                    <span className="mbs-tier-range">• {currentTierObj.scoreDisplay}</span>
                  </div>
                  <p>{currentTierObj.desc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mbs-actions-row">
                <button
                  type="button"
                  className="mbs-btn prev"
                  onClick={() => goToPage(7)}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  className="mbs-btn restart-cta"
                  onClick={() => restartQuiz()}
                >
                  Play Again ↺
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ==========================================
  // QUIZ QUESTIONS FOR PAGES 3..7 (Desktop & Mobile Sheet)
  // ==========================================
  const questionIndex = currentPage - 3; // 0, 1, 2, 3, 4
  const question = questions[questionIndex];
  if (!question) return null;

  const selectedOptionIndex = answers[questionIndex];
  const isAnswered = selectedOptionIndex !== undefined;
  const isLastQuestion = questionIndex === 4;

  // Score of questions submitted before current question
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
      {/* Desktop Transparent Hotspot Zones over the 4 Textured Options on the 3D Book */}
      <div
        className="quiz-transparent-hotspot-container desktop-only"
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

      {/* Desktop Bottom Circle Selector (1) (2) (3) (4) & Navigation Toolbar */}
      <div
        className="quiz-bottom-bar-wrapper desktop-only"
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

          {/* Score Counter */}
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

      {/* ==================================================== */}
      {/* MOBILE COLLAPSIBLE BOTTOM SHEET ("Slide to Read")   */}
      {/* ==================================================== */}
      <div
        className={`mobile-bottom-sheet ${isMobileExpanded ? 'expanded' : 'collapsed'}`}
        data-clickable="true"
        onClick={stopCapture}
        onMouseDown={stopCapture}
        onMouseUp={stopCapture}
        onPointerDown={stopCapture}
        onPointerUp={stopCapture}
        onTouchStart={stopCapture}
        onTouchEnd={stopCapture}
      >
        {/* Peek Header Bar */}
        <div
          className="mbs-peek-bar"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          title="Tap to Expand / Collapse Quiz Sheet"
        >
          <div className="mbs-drag-handle" />
          <div className="mbs-peek-content">
            <span className="mbs-peek-title">
              📖 <strong>Q0{questionIndex + 1} / 05</strong> • {isAnswered ? 'Option Selected ✓' : 'Tap to Read & Answer'}
            </span>
            <div className="mbs-peek-right">
              <span className="mbs-peek-score">⭐ {visibleScore}/5</span>
              <span className="mbs-peek-toggle-hint">
                {isMobileExpanded ? '▼ Hide' : '▲ Read'}
              </span>
            </div>
          </div>
        </div>

        {/* Expanded Sheet Body */}
        {isMobileExpanded && (
          <div className="mbs-expanded-body">
            {/* Question Tag & Score */}
            <div className="mbs-q-meta-row">
              <span className="mbs-q-tag">QUESTION 0{questionIndex + 1} OF 05</span>
              <span className="mbs-q-score-badge">⭐ Score: {visibleScore}/5</span>
            </div>

            {/* Question Text (Large & Crisp for Mobile) */}
            <div className="mbs-q-text">
              "{question.scenario}"
            </div>

            {/* Option Cards (1 - 4) */}
            <div className="mbs-options-list">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`mbs-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => handleOptionSelect(e, idx)}
                  >
                    <span className="mbs-opt-badge">{idx + 1}</span>
                    <span className="mbs-opt-text">{opt.text}</span>
                    {isSelected && <span className="mbs-opt-check">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons Row */}
            <div className="mbs-actions-row">
              {currentPage > 3 && (
                <button
                  type="button"
                  className="mbs-btn prev"
                  onClick={handlePrev}
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                className={`mbs-btn next ${!isAnswered ? 'disabled' : ''}`}
                disabled={!isAnswered}
                onClick={handleNext}
              >
                {isLastQuestion ? 'View Result (Page 8) →' : 'Next Question →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};





