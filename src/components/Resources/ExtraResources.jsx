import React from 'react';
import { RESOURCES_DATA } from '../../data/resourcesData';

export const ExtraResources = () => {
  return (
    <div className="extraResources">
      <p>{RESOURCES_DATA.title}</p>
      <ul>
        {RESOURCES_DATA.links.map((link, index) => (
          <li key={index}>
            <span>{link.action}</span>
            <a target="_blank" rel="noopener noreferrer" href={link.url}>
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
