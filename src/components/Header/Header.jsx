import React from 'react';
import { SITE_DATA } from '../../data/siteData';

export const Header = () => {
  return (
    <>
      <div className="logo">{SITE_DATA.title}</div>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={SITE_DATA.agency.url}
        className="helloMondayLink"
      >
        {SITE_DATA.edition} by <span>{SITE_DATA.agency.name}</span>
      </a>
    </>
  );
};
