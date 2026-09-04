import React, { useEffect } from 'react';
import { NavigationArrows } from '../Navigation/NavigationArrows';
import { ExtraResources } from '../Resources/ExtraResources';
import { CaptionsOverlay } from '../Captions/CaptionsOverlay';
import { PretextOverlay } from '../Pretext/PretextOverlay';
import { NameInputOverlay } from '../NameInputOverlay/NameInputOverlay';
import { initBookEngine } from './engine';

export const ThreeBookCanvas = () => {
  useEffect(() => {
    // Mount and initialize the 3D book physics & rendering engine
    initBookEngine();
  }, []);

  return (
    <div id="canvasContainer">
      <div className="draggable">
        <NavigationArrows />
        <ExtraResources />
      </div>

      <CaptionsOverlay />
      <PretextOverlay />

      {/* Interactive Name Input & Let's Begin button for Page 1 */}
      <NameInputOverlay />
    </div>
  );
};
