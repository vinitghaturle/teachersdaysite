import React from 'react';
import { Header } from './components/Header/Header';
import { ThreeBookCanvas } from './components/BookEngine/ThreeBookCanvas';
import { NameInputOverlay } from './components/NameInputOverlay/NameInputOverlay';
import { FooterLinks } from './components/Footer/FooterLinks';
import './styles/fonts.css';
import './styles/main.css';

export default function App() {
  return (
    <>
      {/* 3D Interactive Flipbook Stage */}
      <ThreeBookCanvas />

      {/* Top Left Title & Hello Monday Branding */}
      <Header />

      {/* Interactive Name Input & Let's Begin button for Page 1 */}
      <NameInputOverlay />

      {/* Bottom Right Share & Typography Attribution */}
      <FooterLinks />

      {/* Invisible Viewport Height Calculator used by engine */}
      <div id="CALC_HEIGHT_DIV" />
    </>
  );
}
