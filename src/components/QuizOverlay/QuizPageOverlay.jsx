import React, { useState } from 'react';
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

  // Page 8: Full Teachers' Day Special Result Sheet rendered embedded on Page 8
  if (currentPage === 8) {
    const activeTier = resultData || SCORE_TIERS[1];
    const displayTime = timeTaken || '00 : 42';

    return (
      <>
        <div
          className="p8-modal-root-wrapper"
          data-clickable="true"
          onClick={stopCapture}
          onMouseDown={stopCapture}
          onMouseUp={stopCapture}
          onPointerDown={stopCapture}
          onPointerUp={stopCapture}
          onTouchStart={stopCapture}
          onTouchEnd={stopCapture}
        >
          <div className="p8-modal-card" data-clickable="true">
            {/* Top Left Yellow Wave & Dot Grid */}
            <div className="p8-corner-wave top-left" />
            <div className="p8-dot-grid-decor top-left" />

            {/* Top Right Post-it Sticky Note */}
            <div className="p8-sticky-note-card">
              <div className="p8-tape" />
              <div className="p8-sticky-text">
                <span>Great</span>
                <span>Teachers</span>
                <span>Make a</span>
                <span>Bigger World</span>
                <span className="p8-heart">♡</span>
              </div>
            </div>

            {/* Doodles Left & Right */}
            <div className="p8-doodle-text left-side">
              <span>Good<br/>Teachers<br/>Brighter<br/>Tomorrows<br/>♡</span>
            </div>

            <div className="p8-doodle-text right-side">
              <span>Same<br/>Classrooms<br/>New Perspectives</span>
            </div>

            {/* Bottom Left 3 Stacked Books */}
            <div className="p8-books-stack">
              <div className="p8-single-book book-cyan">Curiosity</div>
              <div className="p8-single-book book-yellow">Kindness</div>
              <div className="p8-single-book book-white">Impact</div>
            </div>

            {/* Bottom Right Wave & Note */}
            <div className="p8-corner-wave bottom-right" />
            <div className="p8-bottom-right-note">
              <span>Thank you<br/>for being you<br/>♡</span>
            </div>

            {/* Main Center Content */}
            <div className="p8-center-body">
              {/* Header Tag */}
              <div className="p8-special-tag">— TEACHERS' DAY SPECIAL —</div>

              {/* "Your Result" with Sunshine Sparkles */}
              <div className="p8-result-title-row">
                <span className="p8-sun-ray">✨</span>
                <h2 className="p8-your-result-text">Your Result</h2>
                <span className="p8-sun-ray">✨</span>
              </div>
              <div className="p8-teal-swoosh" />

              {/* Main Headline with Yellow Highlighter Banner */}
              <div className="p8-headline-wrap">
                <div className="p8-prefix-text">
                  {userName ? `${userName}, You're a` : "You're a"}
                </div>
                <div className="p8-tier-highlighter-badge">
                  {activeTier.label}!
                </div>
              </div>

              {/* Personalized Subtitle */}
              <p className="p8-desc-subtitle">
                {activeTier.desc || activeTier.message}
              </p>

              {/* Stats Pill (Score & Time Taken) */}
              <div className="p8-stats-pill-container">
                <div className="p8-stat-col">
                  <div className="p8-stat-circle yellow">✓</div>
                  <div className="p8-stat-labels">
                    <span className="p8-stat-title">Score</span>
                    <span className="p8-stat-val">{score} / 5</span>
                  </div>
                </div>

                <div className="p8-stat-divider" />

                <div className="p8-stat-col">
                  <div className="p8-stat-circle teal">🕒</div>
                  <div className="p8-stat-labels">
                    <span className="p8-stat-title">Time Taken</span>
                    <span className="p8-stat-val">{displayTime}</span>
                  </div>
                </div>
              </div>

              {/* Section: Here's what your score means */}
              <div className="p8-means-heading">Here's what your score means:</div>

              {/* 5 Tier Cards Horizontal Row */}
              <div className="p8-cards-grid">
                {SCORE_TIERS.map((tierObj) => {
                  const isCurrentTier = score >= tierObj.minScore && score <= tierObj.maxScore;
                  return (
                    <div
                      key={tierObj.label}
                      className={`p8-tier-box ${isCurrentTier ? 'active' : ''}`}
                    >
                      <div className="p8-box-icon">{tierObj.icon}</div>
                      <div className="p8-box-pill">{tierObj.label}</div>
                      <div className="p8-box-score">{tierObj.scoreDisplay}</div>
                      <p className="p8-box-desc">{tierObj.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Play Again Button */}
              <button
                type="button"
                className="p8-play-again-cta"
                data-clickable="true"
                onClick={(e) => {
                  stopCapture(e);
                  restartQuiz();
                }}
                onMouseDown={stopCapture}
                onPointerDown={stopCapture}
                onTouchStart={stopCapture}
              >
                <span>Play Again →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Toolbar */}
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




