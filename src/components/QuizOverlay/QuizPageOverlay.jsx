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

  // Page 8: Clickable hitboxes for Page 8 Result Spread
  if (currentPage === 8) {
    return (
      <>
        <div
          className="quiz-page-container quiz-interactive-hitbox-container"
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
            {/* LEFT PAGE: Visual only on 3D paper */}
            <div className="quiz-left-page-hitbox" />

            {/* RIGHT PAGE: Clickable Actions over 3D paper */}
            <div className="quiz-right-page-hitbox" data-clickable="true">
              <div className="quiz-page-8-actions">
                <button
                  type="button"
                  className="quiz-paper-btn-hitbox prev-btn-hitbox"
                  data-clickable="true"
                  onClick={() => goToPage(7)}
                  onMouseDown={stopCapture}
                  onPointerDown={stopCapture}
                  onTouchStart={stopCapture}
                  title="Review Question 5"
                />

                <button
                  type="button"
                  className="quiz-paper-btn-hitbox retry-btn-hitbox"
                  data-clickable="true"
                  onClick={restartQuiz}
                  onMouseDown={stopCapture}
                  onPointerDown={stopCapture}
                  onTouchStart={stopCapture}
                  title="Try 5 New Questions"
                />
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

  return (
    <>
      <div
        className="quiz-page-container quiz-interactive-hitbox-container"
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
        {/* Two-page book spread: Left is Question (on 3D paper), Right has Option Click Hitboxes */}
        <div
          className="quiz-book-spread"
          style={{ gap: `${settings.spreadGap}px` }}
        >
          {/* LEFT SIDE: Pure 3D Paper Texture (No duplicate HTML text) */}
          <div className="quiz-left-page-hitbox" />

          {/* RIGHT SIDE: 4 Clickable Option Card Hitboxes + Navigation */}
          <div className="quiz-right-page-hitbox" data-clickable="true">
            {/* 4 Invisible Clickable Cards directly over the 3D paper options */}
            <div className="quiz-options-hitbox-list">
              {question.options.map((opt, idx) => {
                return (
                  <button
                    key={idx}
                    type="button"
                    className="quiz-option-hitbox"
                    data-clickable="true"
                    onClick={() => handleOptionSelect(idx)}
                    onMouseDown={stopCapture}
                    onPointerDown={stopCapture}
                    onTouchStart={stopCapture}
                    aria-label={`Option ${idx + 1}: ${opt.text}`}
                    title={`Click to choose Option ${['A', 'B', 'C', 'D'][idx]}`}
                  />
                );
              })}
            </div>

            {/* Navigation Hitboxes */}
            <div className="quiz-actions-hitbox-row">
              {currentPage > 3 && (
                <button
                  type="button"
                  className="quiz-paper-btn-hitbox prev-btn-hitbox"
                  data-clickable="true"
                  onClick={handlePrev}
                  onMouseDown={stopCapture}
                  onPointerDown={stopCapture}
                  onTouchStart={stopCapture}
                  title="Back to Previous Page"
                />
              )}

              <button
                type="button"
                className={`quiz-paper-btn-hitbox next-btn-hitbox ${!isAnswered ? 'disabled' : ''}`}
                disabled={!isAnswered}
                data-clickable="true"
                onClick={handleNext}
                onMouseDown={stopCapture}
                onPointerDown={stopCapture}
                onTouchStart={stopCapture}
                title={isLastQuestion ? 'Go to Page 8 Result' : 'Go to Next Question'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Dev Controller for Live Tuning */}
      <QuizSizeController settings={settings} setSettings={setSettings} />
    </>
  );
};




