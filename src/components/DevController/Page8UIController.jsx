import React, { useState, useEffect } from 'react';
import { useQuiz } from '../../context/QuizContext';
import { DEFAULT_PAGE8_SETTINGS, renderResultPageTexture } from '../../utils/pageTextureRenderer';
import './Page8UIController.css';

export const Page8UIController = () => {
  const { score, userName, resultData, timeTaken, currentPage } = useQuiz();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('left'); // 'left' | 'right' | 'theme'
  const [copied, setCopied] = useState(false);

  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('htwkr_page8_ui_settings');
      return saved ? { ...DEFAULT_PAGE8_SETTINGS, ...JSON.parse(saved) } : DEFAULT_PAGE8_SETTINGS;
    } catch (_) {
      return DEFAULT_PAGE8_SETTINGS;
    }
  });

  // Whenever settings change, save to localStorage and trigger real-time re-render
  useEffect(() => {
    localStorage.setItem('htwkr_page8_ui_settings', JSON.stringify(settings));
    if (currentPage === 8) {
      renderResultPageTexture(resultData, score, userName, timeTaken, settings);
    }
  }, [settings, score, userName, resultData, timeTaken, currentPage]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_PAGE8_SETTINGS);
    localStorage.setItem('htwkr_page8_ui_settings', JSON.stringify(DEFAULT_PAGE8_SETTINGS));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(settings, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stopCapture = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
  };

  // Only display when on Page 8 or when opened
  if (currentPage !== 8 && !isOpen) {
    return null;
  }

  const badgeColorPresets = [
    { label: 'Yellow', color: '#FDE047' },
    { label: 'Gold', color: '#FBBF24' },
    { label: 'Mint', color: '#2DD4BF' },
    { label: 'Rose', color: '#FDA4AF' },
    { label: 'Purple', color: '#D8B4FE' },
  ];

  return (
    <div
      className="p8-dev-wrapper"
      data-clickable="true"
      onClick={stopCapture}
      onMouseDown={stopCapture}
      onMouseUp={stopCapture}
      onPointerDown={stopCapture}
      onTouchStart={stopCapture}
    >
      {/* Floating Toggle Button */}
      <button
        type="button"
        className={`p8-dev-toggle-btn ${isOpen ? 'active' : ''}`}
        data-clickable="true"
        onClick={() => setIsOpen(!isOpen)}
        title="Customize Page 8 UI Elements"
      >
        <span className="p8-dev-gear">⚙️</span>
        <span>{isOpen ? 'Close UI Controls' : 'Page 8 Controls'}</span>
      </button>

      {/* Control Drawer */}
      {isOpen && (
        <div className="p8-dev-drawer" data-clickable="true">
          {/* Header */}
          <div className="p8-dev-header">
            <h3>🎨 Page 8 UI Customizer</h3>
            <button
              type="button"
              className="p8-dev-close-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="p8-dev-tabs">
            <button
              type="button"
              className={`p8-dev-tab-btn ${activeTab === 'left' ? 'active' : ''}`}
              onClick={() => setActiveTab('left')}
            >
              Left Page
            </button>
            <button
              type="button"
              className={`p8-dev-tab-btn ${activeTab === 'right' ? 'active' : ''}`}
              onClick={() => setActiveTab('right')}
            >
              Right Page
            </button>
            <button
              type="button"
              className={`p8-dev-tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              Theme & Doodles
            </button>
          </div>

          {/* Form Body */}
          <div className="p8-dev-body">
            {/* TAB 1: LEFT PAGE */}
            {activeTab === 'left' && (
              <>
                {/* Score Simulator */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Score Simulator (0 to 5):</span>
                    <strong>{settings.scoreOverride === -1 ? `Real (${score})` : settings.scoreOverride}</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="-1"
                    max="5"
                    step="1"
                    value={settings.scoreOverride}
                    onChange={(e) => updateSetting('scoreOverride', Number(e.target.value))}
                  />
                </div>

                {/* Top Edition Tag */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Edition Tag Header:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.headerTag}
                    onChange={(e) => updateSetting('headerTag', e.target.value)}
                    placeholder="e.g. 🎓 TEACHERS' DAY SPECIAL EDITION 🎓"
                  />
                </div>

                {/* Result Title */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Main Title:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.resultTitle}
                    onChange={(e) => updateSetting('resultTitle', e.target.value)}
                    placeholder="e.g. Your Result ✨"
                  />
                </div>

                {/* Title Font Size */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Title Font Size:</span>
                    <strong>{settings.titleFontSize}px</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="36"
                    max="64"
                    step="1"
                    value={settings.titleFontSize}
                    onChange={(e) => updateSetting('titleFontSize', Number(e.target.value))}
                  />
                </div>

                {/* Teacher Headline Prefix */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Headline Prefix:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.teacherPrefix}
                    onChange={(e) => updateSetting('teacherPrefix', e.target.value)}
                    placeholder="Leave empty for '[Name], You\'re a'"
                  />
                </div>

                {/* Custom Badge Text */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Badge Text Override:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.customBadgeText}
                    onChange={(e) => updateSetting('customBadgeText', e.target.value)}
                    placeholder="Leave empty to use tier name (e.g. CERTIFIED ICON)"
                  />
                </div>

                {/* Badge Font Size */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Badge Font Size:</span>
                    <strong>{settings.badgeFontSize}px</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="34"
                    max="60"
                    step="1"
                    value={settings.badgeFontSize}
                    onChange={(e) => updateSetting('badgeFontSize', Number(e.target.value))}
                  />
                </div>

                {/* Badge Color Preset Swatches */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Badge Highlight Color:</span>
                  </div>
                  <div className="p8-dev-swatches">
                    {badgeColorPresets.map((swatch) => (
                      <div
                        key={swatch.color}
                        className={`p8-dev-swatch ${settings.badgeColor === swatch.color ? 'active' : ''}`}
                        style={{ backgroundColor: swatch.color }}
                        onClick={() => updateSetting('badgeColor', swatch.color)}
                        title={swatch.label}
                      />
                    ))}
                    <input
                      type="color"
                      value={settings.badgeColor}
                      onChange={(e) => updateSetting('badgeColor', e.target.value)}
                      style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer' }}
                      title="Custom Color"
                    />
                  </div>
                </div>

                {/* Description Text */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Custom Subtitle Description:</span>
                  </div>
                  <textarea
                    className="p8-dev-textarea"
                    value={settings.customDescText}
                    onChange={(e) => updateSetting('customDescText', e.target.value)}
                    placeholder="Leave empty to use automatic tier description"
                  />
                </div>

                {/* Stats Pill Scale */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Stats Pill Size Scale:</span>
                    <strong>{settings.statsPillScale.toFixed(2)}x</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="0.75"
                    max="1.25"
                    step="0.05"
                    value={settings.statsPillScale}
                    onChange={(e) => updateSetting('statsPillScale', Number(e.target.value))}
                  />
                </div>
              </>
            )}

            {/* TAB 2: RIGHT PAGE */}
            {activeTab === 'right' && (
              <>
                {/* Section Title */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Section Title:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.sectionTitle}
                    onChange={(e) => updateSetting('sectionTitle', e.target.value)}
                    placeholder="e.g. YOUR PERFORMANCE TIERS"
                  />
                </div>

                {/* Tier Card Height */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Tier Cards Height:</span>
                    <strong>{settings.tierCardHeight}px</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="80"
                    max="135"
                    step="2"
                    value={settings.tierCardHeight}
                    onChange={(e) => updateSetting('tierCardHeight', Number(e.target.value))}
                  />
                </div>

                {/* Tier Card Gap */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Cards Spacing / Gap:</span>
                    <strong>{settings.tierCardGap}px</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="8"
                    max="28"
                    step="1"
                    value={settings.tierCardGap}
                    onChange={(e) => updateSetting('tierCardGap', Number(e.target.value))}
                  />
                </div>

                {/* Tier Card Font Size */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Card Text Font Size:</span>
                    <strong>{settings.tierCardFontSize}px</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="12"
                    max="20"
                    step="1"
                    value={settings.tierCardFontSize}
                    onChange={(e) => updateSetting('tierCardFontSize', Number(e.target.value))}
                  />
                </div>

                {/* Post-It Note Text */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Sticky Note Lines:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    style={{ marginBottom: 4 }}
                    value={settings.postItLine1}
                    onChange={(e) => updateSetting('postItLine1', e.target.value)}
                    placeholder="Line 1"
                  />
                  <input
                    type="text"
                    className="p8-dev-input"
                    style={{ marginBottom: 4 }}
                    value={settings.postItLine2}
                    onChange={(e) => updateSetting('postItLine2', e.target.value)}
                    placeholder="Line 2"
                  />
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.postItLine3}
                    onChange={(e) => updateSetting('postItLine3', e.target.value)}
                    placeholder="Line 3"
                  />
                </div>

                {/* Post-It Angle */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Sticky Note Tilt Angle:</span>
                    <strong>{(settings.postItAngle * 57.3).toFixed(1)}°</strong>
                  </div>
                  <input
                    type="range"
                    className="p8-dev-slider"
                    min="-0.2"
                    max="0.2"
                    step="0.01"
                    value={settings.postItAngle}
                    onChange={(e) => updateSetting('postItAngle', Number(e.target.value))}
                  />
                </div>

                {/* Play Again Button Text */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Play Again Button Text:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.playAgainBtnText}
                    onChange={(e) => updateSetting('playAgainBtnText', e.target.value)}
                    placeholder="e.g. Play Again ↺"
                  />
                </div>

                {/* Play Again Button Color */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Play Again Button Color:</span>
                  </div>
                  <div className="p8-dev-swatches">
                    {badgeColorPresets.map((swatch) => (
                      <div
                        key={swatch.color}
                        className={`p8-dev-swatch ${settings.playAgainBtnColor === swatch.color ? 'active' : ''}`}
                        style={{ backgroundColor: swatch.color }}
                        onClick={() => updateSetting('playAgainBtnColor', swatch.color)}
                        title={swatch.label}
                      />
                    ))}
                    <input
                      type="color"
                      value={settings.playAgainBtnColor}
                      onChange={(e) => updateSetting('playAgainBtnColor', e.target.value)}
                      style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer' }}
                      title="Custom Color"
                    />
                  </div>
                </div>

                {/* Bottom Right Note */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Bottom Right Handwritten Note:</span>
                  </div>
                  <input
                    type="text"
                    className="p8-dev-input"
                    value={settings.bottomRightNote}
                    onChange={(e) => updateSetting('bottomRightNote', e.target.value)}
                    placeholder="e.g. Thank you for shaping tomorrow ♡"
                  />
                </div>
              </>
            )}

            {/* TAB 3: THEME & DOODLES */}
            {activeTab === 'theme' && (
              <>
                {/* Background Theme Presets */}
                <div className="p8-dev-field">
                  <div className="p8-dev-label-row">
                    <span>Background Palette Preset:</span>
                  </div>
                  <div className="p8-dev-presets-row">
                    {[
                      { id: 'sunshine', name: 'Sunshine', bg: '#FEF08A' },
                      { id: 'vanilla', name: 'Vanilla', bg: '#FEF6E4' },
                      { id: 'mint', name: 'Mint', bg: '#D1FAE5' },
                      { id: 'rose', name: 'Rose', bg: '#FECDD3' },
                      { id: 'lavender', name: 'Lavender', bg: '#E9D5FF' },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        className={`p8-dev-preset-btn ${settings.bgTheme === theme.id ? 'active' : ''}`}
                        style={{ background: theme.bg, color: '#0F172A' }}
                        onClick={() => updateSetting('bgTheme', theme.id)}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <label className="p8-dev-checkbox-row">
                  <span>Show Hand-Drawn Doodles & Rays</span>
                  <input
                    type="checkbox"
                    checked={settings.showDoodles}
                    onChange={(e) => updateSetting('showDoodles', e.target.checked)}
                  />
                </label>

                <label className="p8-dev-checkbox-row">
                  <span>Show Magic Sparkles (✦)</span>
                  <input
                    type="checkbox"
                    checked={settings.showSparkles}
                    onChange={(e) => updateSetting('showSparkles', e.target.checked)}
                  />
                </label>

                <label className="p8-dev-checkbox-row">
                  <span>Show Stacked Illustrated Books</span>
                  <input
                    type="checkbox"
                    checked={settings.showBooks}
                    onChange={(e) => updateSetting('showBooks', e.target.checked)}
                  />
                </label>

                <label className="p8-dev-checkbox-row">
                  <span>Show 3D Center Spine Crease</span>
                  <input
                    type="checkbox"
                    checked={settings.showSpineCrease}
                    onChange={(e) => updateSetting('showSpineCrease', e.target.checked)}
                  />
                </label>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p8-dev-footer">
            <button
              type="button"
              className="p8-dev-btn copy"
              onClick={handleCopy}
            >
              {copied ? '✓ Copied JSON!' : '📋 Copy Config'}
            </button>
            <button
              type="button"
              className="p8-dev-btn reset"
              onClick={handleReset}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
