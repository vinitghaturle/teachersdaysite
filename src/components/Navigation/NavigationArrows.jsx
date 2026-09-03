import React from 'react';

export const NavigationArrows = () => {
  return (
    <>
      <button className="left navArrow" data-clickable="true" aria-label="Previous page">
        <span>Previous page</span>
      </button>
      <button className="navArrow" data-clickable="true" aria-label="Next page">
        <span>Next page</span>
      </button>
    </>
  );
};
