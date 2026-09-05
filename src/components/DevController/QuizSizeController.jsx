import React, { useState, useEffect } from 'react';
import './QuizSizeController.css';

const DEFAULT_SETTINGS = {
  widthPercent: 71,
  heightPercent: 53,
  offsetY: -46,
  questionFontSize: 20,
  optionFontSize: 11,
  spreadGap: 30,
  optionPadding: 4,
  borderWidth: 2.5,
};

export const QuizSizeController = ({ settings, setSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: Number(value) };
    setSettings(newSettings);
    localStorage.setItem('htwkr_quiz_dev_settings', JSON.stringify(newSettings));
    window.dispatchEvent(new CustomEvent('htwkr:settingsChanged', { detail: newSettings }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('htwkr_quiz_dev_settings', JSON.stringify(DEFAULT_SETTINGS));
    window.dispatchEvent(new CustomEvent('htwkr:settingsChanged', { detail: DEFAULT_SETTINGS }));
  };

  const handleCopy = () => {
    const cssText = `
/* Custom Layout Values */
Width: ${settings.widthPercent}% of book
Height: ${settings.heightPercent}% of book
Vertical Offset: ${settings.offsetY}px
Question Font Size: ${settings.questionFontSize}px
Option Font Size: ${settings.optionFontSize}px
Spread Gap: ${settings.spreadGap}px
Option Padding: ${settings.optionPadding}px
Border Width: ${settings.borderWidth}px
    `.trim();

    navigator.clipboard.writeText(cssText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stopCapture = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="quiz-dev-controller-wrapper"
      data-clickable="true"
      onMouseDown={stopCapture}
      onPointerDown={stopCapture}
      onTouchStart={stopCapture}
    >
      {/* Floating Toggle Button */}
      <button
        type="button"
        className={`quiz-dev-toggle-btn ${isOpen ? 'active' : ''}`}
        data-clickable="true"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle On-Screen Size & Text Controller"
      >
        <span className="quiz-dev-gear">⚙️</span>
        <span>{isOpen ? 'Close Controller' : 'Adjust Size & Text'}</span>
      </button>

      {/* Control Panel Drawer */}
      {isOpen && (
        <div className="quiz-dev-panel" data-clickable="true">
          <div className="quiz-dev-header">
            <h3>📏 On-Screen Layout Controller</h3>
            <p>Adjust 80% background fit, text sizes & spacing in real-time</p>
          </div>

          <div className="quiz-dev-controls">
            {/* Width Slider */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Spread Width:</span>
                <strong>{settings.widthPercent}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={settings.widthPercent}
                onChange={(e) => updateSetting('widthPercent', e.target.value)}
              />
            </div>

            {/* Height Slider */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Spread Height:</span>
                <strong>{settings.heightPercent}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="1"
                value={settings.heightPercent}
                onChange={(e) => updateSetting('heightPercent', e.target.value)}
              />
            </div>

            {/* Vertical Offset */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Vertical Offset (Y):</span>
                <strong>{settings.offsetY}px</strong>
              </div>
              <input
                type="range"
                min="-120"
                max="120"
                step="2"
                value={settings.offsetY}
                onChange={(e) => updateSetting('offsetY', e.target.value)}
              />
            </div>

            {/* Question Font Size */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Question Font Size:</span>
                <strong>{settings.questionFontSize}px</strong>
              </div>
              <input
                type="range"
                min="14"
                max="36"
                step="1"
                value={settings.questionFontSize}
                onChange={(e) => updateSetting('questionFontSize', e.target.value)}
              />
            </div>

            {/* Option Font Size */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Options Font Size:</span>
                <strong>{settings.optionFontSize}px</strong>
              </div>
              <input
                type="range"
                min="11"
                max="22"
                step="1"
                value={settings.optionFontSize}
                onChange={(e) => updateSetting('optionFontSize', e.target.value)}
              />
            </div>

            {/* Spread Gap */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Left / Right Gap:</span>
                <strong>{settings.spreadGap}px</strong>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="2"
                value={settings.spreadGap}
                onChange={(e) => updateSetting('spreadGap', e.target.value)}
              />
            </div>

            {/* Option Card Padding */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Option Padding:</span>
                <strong>{settings.optionPadding}px</strong>
              </div>
              <input
                type="range"
                min="4"
                max="20"
                step="1"
                value={settings.optionPadding}
                onChange={(e) => updateSetting('optionPadding', e.target.value)}
              />
            </div>

            {/* Border Width */}
            <div className="quiz-dev-field">
              <div className="quiz-dev-label-row">
                <span>Border Width:</span>
                <strong>{settings.borderWidth}px</strong>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="0.5"
                value={settings.borderWidth}
                onChange={(e) => updateSetting('borderWidth', e.target.value)}
              />
            </div>
          </div>

          <div className="quiz-dev-footer">
            <button
              type="button"
              className="quiz-dev-btn copy"
              onClick={handleCopy}
            >
              {copied ? '✓ Copied!' : '📋 Copy Values'}
            </button>
            <button
              type="button"
              className="quiz-dev-btn reset"
              onClick={handleReset}
            >
              🔄 Reset 80%
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
