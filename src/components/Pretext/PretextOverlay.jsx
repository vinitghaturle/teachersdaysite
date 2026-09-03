import React from 'react';
import { SITE_DATA } from '../../data/siteData';

export const PretextOverlay = () => {
  const { dedication } = SITE_DATA;

  return (
    <div className="pretext">
      <div className="wrapper">
        <div className="text">
          <a href="#page-1" className="enterButton">
            <span>{dedication.enterButtonText}</span>
          </a>
          <p>
            <span>To:</span>
            <br />
            <span className="love">{dedication.to}</span>
            <br />
            {dedication.message}
            <br />
            <span className="mondayteers">{dedication.authors}</span>
            <br />
            <span>{dedication.authorRole}</span>
          </p>
          <p className="loading">Loading...</p>
        </div>
      </div>
    </div>
  );
};
