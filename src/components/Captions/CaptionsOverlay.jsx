import React from 'react';

export const CaptionsOverlay = () => {
  // Maintain 8 dummy caption divs so Three.js GSAP animation timeline stays synced without text collision
  const dummyPages = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="captions" style={{ pointerEvents: 'none', visibility: 'hidden', opacity: 0 }}>
      {dummyPages.map((idx) => (
        <div key={idx} className="caption" />
      ))}
    </div>
  );
};

