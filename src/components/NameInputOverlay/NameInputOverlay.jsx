import React, { useState, useEffect, useRef } from 'react';
import './NameInputOverlay.css';

export const NameInputOverlay = () => {
  const [userName, setUserName] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load previously saved name if available
    const saved = localStorage.getItem('htwkr_userName');
    if (saved) {
      setUserName(saved);
    }

    const handlePageChange = (e) => {
      const page = e.detail?.page;
      const entered = e.detail?.entered;
      // Show only when on page 1 and the book has been opened
      if (page === 1) {
        setIsActive(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 300);
      } else {
        setIsActive(false);
        setHasError(false);
      }
    };

    window.addEventListener('htwkr:pageChange', handlePageChange);

    // Initial check if window.Main is already on page 1
    const checkInterval = setInterval(() => {
      if (window.Main && window.Main.maskRevealView) {
        const p = window.Main.maskRevealView.currPageIndex;
        const entered = window.Main.maskRevealView.ENTERED;
        if (p === 1 && entered) {
          setIsActive(true);
        }
      }
    }, 400);

    return () => {
      window.removeEventListener('htwkr:pageChange', handlePageChange);
      clearInterval(checkInterval);
    };
  }, []);

  const handleBegin = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const trimmed = userName.trim();
    if (!trimmed) {
      setHasError(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // Save name to localStorage and dispatch custom event
    localStorage.setItem('htwkr_userName', trimmed);
    window.dispatchEvent(new CustomEvent('htwkr:userNameSaved', { detail: { name: trimmed } }));

    setHasError(false);
    setIsActive(false);

    // Turn to next page (Page 2)
    if (window.Main && window.Main.maskRevealView) {
      window.Main.maskRevealView.setCurrentPage(2);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleBegin(e);
    }
  };

  const stopCapture = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`name-input-overlay-container ${!isActive ? 'hidden' : ''}`}
      data-clickable="true"
      onMouseDown={stopCapture}
      onPointerDown={stopCapture}
      onTouchStart={stopCapture}
    >
      <form
        onSubmit={handleBegin}
        className="w-full flex flex-col items-center"
        data-clickable="true"
        onMouseDown={stopCapture}
        onPointerDown={stopCapture}
        onTouchStart={stopCapture}
      >
        <div
          className={`name-input-box-wrapper ${hasError ? 'error' : ''}`}
          data-clickable="true"
          onClick={() => {
            if (inputRef.current) inputRef.current.focus();
          }}
          onMouseDown={stopCapture}
          onPointerDown={stopCapture}
          onTouchStart={stopCapture}
        >
          {/* User Icon */}
          <svg
            className="name-input-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>

          {/* Real interactive input field */}
          <input
            ref={inputRef}
            type="text"
            className="name-real-input"
            placeholder="Enter your name"
            value={userName}
            data-clickable="true"
            onChange={(e) => {
              setUserName(e.target.value);
              if (hasError && e.target.value.trim()) {
                setHasError(false);
              }
            }}
            onKeyDown={handleKeyDown}
            onMouseDown={stopCapture}
            onPointerDown={stopCapture}
            onTouchStart={stopCapture}
            aria-label="Enter your name"
            autoComplete="name"
          />
        </div>

        {hasError && (
          <p className="name-error-hint">Please enter your name to continue</p>
        )}

        {/* Real interactive Let's Begin button */}
        <button
          type="button"
          className="name-begin-button"
          aria-label="Let's Begin"
          data-clickable="true"
          onClick={handleBegin}
          onMouseDown={stopCapture}
          onPointerDown={stopCapture}
          onTouchStart={stopCapture}
        >
          <span>Let's Begin</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};
