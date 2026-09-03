import React from 'react';
import { SITE_DATA } from '../../data/siteData';

export const FooterLinks = () => {
  const { social, credits } = SITE_DATA;

  return (
    <div className="rightLinks">
      <div className="social">
        <span>Share</span>
        {social.map((item, index) => (
          <a
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            href={item.url}
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="typefaceCredit">
        <span>Typeface</span>{' '}
        <a target="_blank" rel="noopener noreferrer" href={credits.typefaceUrl}>
          {credits.typefaceName}
        </a>{' '}
        by{' '}
        <a target="_blank" rel="noopener noreferrer" href={credits.foundryUrl}>
          {credits.foundryName}
        </a>
      </div>
    </div>
  );
};
