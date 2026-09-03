import React from 'react';
import { CHAPTERS_DATA } from '../../data/chaptersData';

export const CaptionsOverlay = () => {
  return (
    <div className="captions">
      {CHAPTERS_DATA.map((chapter) => (
        <div key={chapter.id} className="caption">
          <h2>{chapter.title}</h2>
          {chapter.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      ))}
    </div>
  );
};
