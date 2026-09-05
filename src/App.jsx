import React from 'react';
import { Header } from './components/Header/Header';
import { ThreeBookCanvas } from './components/BookEngine/ThreeBookCanvas';
import { NameInputOverlay } from './components/NameInputOverlay/NameInputOverlay';
import { QuizPageOverlay } from './components/QuizOverlay/QuizPageOverlay';
import { Page8UIController } from './components/DevController/Page8UIController';
import { QuizProvider } from './context/QuizContext';
import './styles/fonts.css';
import './styles/main.css';

export default function App() {
  return (
    <QuizProvider>
      {/* 3D Interactive Flipbook Stage */}
      <ThreeBookCanvas />

      {/* Top Left Title & Hello Monday Branding */}
      <Header />

      {/* Interactive Name Input & Let's Begin button for Page 1 */}
      <NameInputOverlay />

      {/* Interactive Quiz Question (Left) & Options (Right) for Pages 3 to 7 */}
      <QuizPageOverlay />

      {/* Real-time Visual UI Controls for Page 8 */}
      <Page8UIController />

      {/* Invisible Viewport Height Calculator used by engine */}
      <div id="CALC_HEIGHT_DIV" />
    </QuizProvider>
  );
}

