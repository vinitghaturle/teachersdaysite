import { SCORE_TIERS } from '../data/questionBank';

const PAGE_BG_MAP = {
  2: '/images/03/03_Privilege_0005_Layer-0.png', // Page 3 (0-indexed material 2)
  3: '/images/04/04_Heroes_0005_Layer-658.png',  // Page 4 (material 3)
  4: '/images/05/05_Friends_0006_Layer-36.png',   // Page 5 (material 4)
  5: '/images/06/06_Something_0006_Layer-0.png',  // Page 6 (material 5)
  6: '/images/07/07_Responsibility_lasse_edit_0005_Layer-0.png', // Page 7 (material 6)
  7: '/images/08/08_Tolerance_0005_bg.png',       // Page 8 (material 7)
};

const loadedImages = {};

function loadImage(src) {
  if (loadedImages[src]) return Promise.resolve(loadedImages[src]);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImages[src] = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(Math.max(0, radius || 0), width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

let transparentTexture = null;
function getTransparentTexture() {
  if (!transparentTexture && typeof document !== 'undefined' && window.THREE) {
    const c = document.createElement('canvas');
    c.width = 16;
    c.height = 16;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 16, 16);
    transparentTexture = new window.THREE.CanvasTexture(c);
    transparentTexture.needsUpdate = true;
  }
  return transparentTexture;
}

/**
 * Replace material map with dynamic canvas texture and silence parallax foreground layers
 */
function applyTextureToMaterial(mat, canvas) {
  if (!mat || !window.THREE) return;
  const canvasTex = new window.THREE.CanvasTexture(canvas);
  canvasTex.flipY = false;
  canvasTex.anisotropy = 8;
  canvasTex.premultiplyAlpha = false;
  canvasTex.needsUpdate = true;

  if (window.Main && window.Main.maskRevealView && window.Main.maskRevealView.renderer) {
    try {
      window.Main.maskRevealView.renderer.initTexture(canvasTex);
    } catch (_) {}
  }

  mat.map = canvasTex;
  mat._customCanvasTexture = canvasTex;
  const emptyTex = getTransparentTexture();

  if (Array.isArray(mat.textures)) {
    mat.textures[0] = canvasTex;
    if (emptyTex) {
      for (let i = 1; i < mat.textures.length; i++) {
        mat.textures[i] = emptyTex;
      }
    }
  }

  // Disable parallax sprite layers so nothing obscures the canvas
  if (mat.userData && mat.userData.shader && mat.userData.shader.uniforms) {
    const u = mat.userData.shader.uniforms;
    if (u.map) u.map.value = canvasTex;
    if (emptyTex) {
      if (u.map2) u.map2.value = emptyTex;
      if (u.map3) u.map3.value = emptyTex;
      if (u.map4) u.map4.value = emptyTex;
      if (u.map5) u.map5.value = emptyTex;
      if (u.map6) u.map6.value = emptyTex;
    }
    const offscreen = new window.THREE.Vector4(99999, 99999, 0.001, 0.001);
    if (u.map2Dimensions) u.map2Dimensions.value = offscreen;
    if (u.map3Dimensions) u.map3Dimensions.value = offscreen;
    if (u.map4Dimensions) u.map4Dimensions.value = offscreen;
    if (u.map5Dimensions) u.map5Dimensions.value = offscreen;
    if (u.map6Dimensions) u.map6Dimensions.value = offscreen;
  }

  const originalOnBefore = mat.onBeforeCompile;
  mat.onBeforeCompile = function(shader, renderer) {
    if (originalOnBefore) {
      originalOnBefore.call(this, shader, renderer);
    }
    if (this._customCanvasTexture) {
      shader.uniforms.map.value = this._customCanvasTexture;
      const empty = getTransparentTexture();
      if (empty) {
        if (shader.uniforms.map2) shader.uniforms.map2.value = empty;
        if (shader.uniforms.map3) shader.uniforms.map3.value = empty;
        if (shader.uniforms.map4) shader.uniforms.map4.value = empty;
        if (shader.uniforms.map5) shader.uniforms.map5.value = empty;
        if (shader.uniforms.map6) shader.uniforms.map6.value = empty;
      }
    }
  };

  mat.needsUpdate = true;
}

/**
 * Render a single quiz page directly onto the material's texture in Three.js
 */
export async function renderQuizPageTexture(materialIndex, questionData, questionNumber, totalQuestions, selectedOptionIndex, score, userName) {
  const bgSrc = PAGE_BG_MAP[materialIndex];
  if (!bgSrc) return;

  try {
    const bgImg = await loadImage(bgSrc);
    const canvas = document.createElement('canvas');
    canvas.width = bgImg.naturalWidth || 1600;
    canvas.height = bgImg.naturalHeight || 914;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // 1. Draw base background artwork
    ctx.drawImage(bgImg, 0, 0, W, H);

    const scale = W / 1600;

    const drawStrokedText = (text, x, y) => {
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4 * scale;
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeText(text, x, y);
      ctx.fillStyle = '#000000';
      ctx.fillText(text, x, y);
    };

    // ==========================================
    // LEFT SPREAD: QUESTION (x: 140 to 720)
    // ==========================================
    const leftX = 140 * scale;
    const leftW = 580 * scale;

    // Tag: QUESTION 0X / 05
    ctx.font = `800 ${16 * scale}px sans-serif`;
    const qnumText = `QUESTION 0${questionNumber} / 05`;
    const tagW = ctx.measureText(qnumText).width + 20 * scale;
    const tagH = 30 * scale;
    
    drawRoundedRect(ctx, leftX, 120 * scale, tagW, tagH, 6 * scale);
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawStrokedText(qnumText, leftX + 10 * scale, 120 * scale + tagH / 2);

    // Question Prompt (Canela / Georgia Serif)
    ctx.font = `600 ${28 * scale}px "Canela Web", Georgia, serif`;
    const qLines = wrapText(ctx, `"${questionData.scenario}"`, leftW);
    const qLineH = 40 * scale;
    const qStartY = 240 * scale;
    qLines.forEach((line, idx) => {
      drawStrokedText(line, leftX, qStartY + idx * qLineH);
    });

    // Left Footer: Score & Teacher Name
    const footerY = H - 120 * scale;
    ctx.beginPath();
    ctx.moveTo(leftX, footerY - 20 * scale);
    ctx.lineTo(leftX + leftW, footerY - 20 * scale);
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.font = `700 ${18 * scale}px sans-serif`;
    drawStrokedText(`⭐ Score: ${score} / 5`, leftX, footerY);

    if (userName) {
      const teacherText = `Teacher: ${userName}`;
      ctx.textAlign = 'right';
      drawStrokedText(teacherText, leftX + leftW, footerY);
      ctx.textAlign = 'left';
    }

    // ==========================================
    // RIGHT SPREAD: 4 OPTIONS (x: 880 to 1460)
    // ==========================================
    const rightX = 880 * scale;
    const rightW = 580 * scale;
    const optionLabels = ['1', '2', '3', '4'];

    ctx.font = `800 ${16 * scale}px sans-serif`;
    drawStrokedText('CHOOSE AN OPTION (1 - 4):', rightX, 135 * scale);

    ctx.textAlign = 'right';
    drawStrokedText('+1 pt', rightX + rightW, 135 * scale);
    ctx.textAlign = 'left';

    const cardH = 68 * scale;
    const cardGap = 16 * scale;
    const cardStartY = 175 * scale;

    questionData.options.forEach((opt, idx) => {
      const cardY = cardStartY + idx * (cardH + cardGap);
      const isSelected = selectedOptionIndex === idx;

      drawRoundedRect(ctx, rightX, cardY, rightW, cardH, 12 * scale);
      if (isSelected) {
        ctx.fillStyle = 'rgba(232, 167, 53, 0.22)';
        ctx.fill();
        ctx.lineWidth = 3 * scale;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      } else {
        ctx.lineWidth = 2 * scale;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      }

      const circleX = rightX + 28 * scale;
      const circleY = cardY + cardH / 2;
      const circleR = 16 * scale;

      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
      if (isSelected) {
        ctx.fillStyle = '#E8A735';
        ctx.fill();
        ctx.lineWidth = 2 * scale;
        ctx.strokeStyle = '#000000';
        ctx.stroke();

        ctx.font = `900 ${16 * scale}px sans-serif`;
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(optionLabels[idx], circleX, circleY);
      } else {
        ctx.lineWidth = 2 * scale;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.font = `800 ${16 * scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawStrokedText(optionLabels[idx], circleX, circleY);
      }

      ctx.textAlign = 'left';
      ctx.font = `700 ${18 * scale}px sans-serif`;
      const textX = rightX + 56 * scale;
      const optLines = wrapText(ctx, opt.text, rightW - 90 * scale);
      
      if (optLines.length === 1) {
        drawStrokedText(optLines[0], textX, cardY + cardH / 2);
      } else {
        const lineH = 22 * scale;
        const totalTextH = optLines.length * lineH;
        const startTextY = cardY + (cardH - totalTextH) / 2 + 10 * scale;
        optLines.forEach((l, lIdx) => {
          drawStrokedText(l, textX, startTextY + lIdx * lineH);
        });
      }

      if (isSelected) {
        ctx.font = `900 ${22 * scale}px sans-serif`;
        ctx.textAlign = 'right';
        drawStrokedText('✓', rightX + rightW - 16 * scale, cardY + cardH / 2);
        ctx.textAlign = 'left';
      }
    });

    if (window.Main && window.Main.maskRevealView && window.Main.maskRevealView.pageMaterials) {
      const mat = window.Main.maskRevealView.pageMaterials[materialIndex];
      applyTextureToMaterial(mat, canvas);
    }
  } catch (err) {
    console.error('Error rendering quiz page texture:', err);
  }
}

/**
 * Render the Page 8 Score & Compliment directly onto the 3D Page 8 texture
 * Embedded across the 2-page open book spread
 */
export async function renderResultPageTexture(resultData, score, userName, timeTaken = '00 : 45') {
  const materialIndex = 7; // Page 8 is index 7
  const bgSrc = PAGE_BG_MAP[materialIndex];
  if (!bgSrc) return;

  try {
    const bgImg = await loadImage(bgSrc);
    const canvas = document.createElement('canvas');
    canvas.width = bgImg.naturalWidth || 2100;
    canvas.height = bgImg.naturalHeight || 1200;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // 1. Base background: warm yellow theme matching Teachers Day Special
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#FEFDF8');
    bgGrad.addColorStop(0.3, '#FEFCE8');
    bgGrad.addColorStop(0.7, '#FEF9C3');
    bgGrad.addColorStop(1, '#FDE68A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.12;
    ctx.drawImage(bgImg, 0, 0, W, H);
    ctx.globalAlpha = 1.0;

    const scale = W / 2100;

    // Helper functions
    const drawDoodleRays = (cx, cy, r, len, count, startAngle, endAngle, color = '#EAB308', width = 3 * scale) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      const step = (endAngle - startAngle) / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        const ang = startAngle + i * step;
        const x1 = cx + Math.cos(ang) * r;
        const y1 = cy + Math.sin(ang) * r;
        const x2 = cx + Math.cos(ang) * (r + len);
        const y2 = cy + Math.sin(ang) * (r + len);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawDotGrid = (startX, startY, cols, rows, spacing, radius = 3 * scale, color = '#F59E0B') => {
      ctx.save();
      ctx.fillStyle = color;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(startX + c * spacing, startY + r * spacing, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    // Helper for stroking 3px outline + black fill
    const drawStrokedText = (text, x, y, outlineColor = '#FFFFFF', fillColor = '#0F172A', outlineW = 4 * scale) => {
      ctx.lineJoin = 'round';
      ctx.lineWidth = outlineW;
      ctx.strokeStyle = outlineColor;
      ctx.strokeText(text, x, y);
      ctx.fillStyle = fillColor;
      ctx.fillText(text, x, y);
    };

    // ==============================================================
    // LEFT SPREAD (x: 0 to 1050) — HERO SCORE & HEADLINE & STATS
    // ==============================================================
    const leftMidX = 525 * scale;

    // Top-Left Yellow Corner Wave
    ctx.save();
    ctx.fillStyle = '#FDE047';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(220 * scale, 0);
    ctx.bezierCurveTo(200 * scale, 120 * scale, 120 * scale, 180 * scale, 0, 240 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Top-Left Dot Grid
    drawDotGrid(50 * scale, 260 * scale, 6, 4, 18 * scale, 3 * scale, '#F59E0B');

    // Left Side Doodle: "Good Teachers Brighter Tomorrows ♡"
    ctx.save();
    ctx.font = `700 ${20 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'left';
    ctx.fillText('Good Teachers', 70 * scale, 380 * scale);
    ctx.fillText('Brighter Tomorrows ♡', 70 * scale, 410 * scale);
    drawDoodleRays(290 * scale, 375 * scale, 8 * scale, 14 * scale, 3, -0.4, 0.4, '#EAB308');
    ctx.restore();

    // Header Tag: — TEACHERS' DAY SPECIAL —
    ctx.font = `800 ${16 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawStrokedText('—  T E A C H E R S \'  D A Y  S P E C I A L  —', leftMidX, 100 * scale, '#FFFFFF', '#64748B', 3 * scale);

    // "Your Result" with Sunshine Rays
    ctx.font = `700 ${44 * scale}px "Caveat", "Playpen Sans", cursive, sans-serif`;
    drawStrokedText('Your Result', leftMidX, 160 * scale, '#FFFFFF', '#0F172A', 5 * scale);
    
    // Rays beside "Your Result"
    const yrW = ctx.measureText('Your Result').width;
    drawDoodleRays(leftMidX - yrW / 2 - 20 * scale, 160 * scale, 10 * scale, 18 * scale, 3, Math.PI * 0.75, Math.PI * 1.25, '#EAB308');
    drawDoodleRays(leftMidX + yrW / 2 + 20 * scale, 160 * scale, 10 * scale, 18 * scale, 3, -Math.PI * 0.25, Math.PI * 0.25, '#EAB308');

    // Teal underline swoosh
    ctx.beginPath();
    ctx.moveTo(leftMidX - 90 * scale, 192 * scale);
    ctx.quadraticCurveTo(leftMidX, 202 * scale, leftMidX + 90 * scale, 192 * scale);
    ctx.lineWidth = 4 * scale;
    ctx.strokeStyle = '#14B8A6';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Headline: "You're a"
    ctx.font = `800 ${36 * scale}px sans-serif`;
    ctx.textAlign = 'center';
    const teacherPrefix = userName ? `${userName}, You're a` : "You're a";
    drawStrokedText(teacherPrefix, leftMidX, 255 * scale, '#FFFFFF', '#0F172A', 4 * scale);

    // Yellow Highlighter Box for Tier Label
    const tierLabel = `${resultData.label}!`;
    ctx.font = `900 ${48 * scale}px sans-serif`;
    const tierTextW = ctx.measureText(tierLabel).width;
    const badgeW = tierTextW + 60 * scale;
    const badgeH = 72 * scale;
    const badgeY = 295 * scale;
    const badgeX = leftMidX - badgeW / 2;

    drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 16 * scale);
    ctx.fillStyle = '#FDE047';
    ctx.fill();
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tierLabel, leftMidX, badgeY + badgeH / 2);

    // Subtitle Description
    ctx.font = `600 ${20 * scale}px sans-serif`;
    const descLines = wrapText(ctx, resultData.desc || resultData.message, 680 * scale);
    descLines.forEach((l, idx) => {
      drawStrokedText(l, leftMidX, 410 * scale + idx * 28 * scale, '#FFFFFF', '#475569', 3 * scale);
    });

    // Center Stats Pill (Score + Time Taken)
    const pillW = 540 * scale;
    const pillH = 88 * scale;
    const pillY = 500 * scale;
    const pillX = leftMidX - pillW / 2;

    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 44 * scale);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    // Left Stat: Score
    const pillCenterY = pillY + pillH / 2;
    const leftStatX = pillX + 50 * scale;

    // Checkmark Circle
    ctx.beginPath();
    ctx.arc(leftStatX + 22 * scale, pillCenterY, 26 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    ctx.font = `900 ${24 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('✓', leftStatX + 22 * scale, pillCenterY);

    // Score text
    ctx.textAlign = 'left';
    ctx.font = `700 ${15 * scale}px sans-serif`;
    ctx.fillStyle = '#64748B';
    ctx.fillText('SCORE', leftStatX + 62 * scale, pillCenterY - 14 * scale);
    ctx.font = `900 ${28 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.fillText(`${score} / 5`, leftStatX + 62 * scale, pillCenterY + 16 * scale);

    // Divider Line in Pill
    ctx.beginPath();
    ctx.moveTo(leftMidX, pillY + 16 * scale);
    ctx.lineTo(leftMidX, pillY + pillH - 16 * scale);
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();

    // Right Stat: Time Taken
    const rightStatX = leftMidX + 50 * scale;

    // Clock Circle
    ctx.beginPath();
    ctx.arc(rightStatX + 22 * scale, pillCenterY, 26 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#2DD4BF';
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    ctx.font = `900 ${20 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('🕒', rightStatX + 22 * scale, pillCenterY);

    // Time text
    ctx.textAlign = 'left';
    ctx.font = `700 ${15 * scale}px sans-serif`;
    ctx.fillStyle = '#64748B';
    ctx.fillText('TIME TAKEN', rightStatX + 62 * scale, pillCenterY - 14 * scale);
    ctx.font = `900 ${28 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.fillText(timeTaken, rightStatX + 62 * scale, pillCenterY + 16 * scale);

    // Bottom Left 3 Stacked Books
    ctx.save();
    const bookX = 80 * scale;
    const bookBaseY = 880 * scale;
    const bookW = 240 * scale;
    const bookH = 44 * scale;

    const books = [
      { name: 'Impact', bg: '#FFFFFF', text: '#0F172A', yOff: 2 * bookH },
      { name: 'Kindness', bg: '#FBBF24', text: '#0F172A', yOff: 1 * bookH },
      { name: 'Curiosity', bg: '#2DD4BF', text: '#0F172A', yOff: 0 },
    ];

    books.forEach((b) => {
      const by = bookBaseY + b.yOff;
      drawRoundedRect(ctx, bookX, by, bookW, bookH - 3 * scale, 8 * scale);
      ctx.fillStyle = b.bg;
      ctx.fill();
      ctx.lineWidth = 2.5 * scale;
      ctx.strokeStyle = '#0F172A';
      ctx.stroke();

      // Spine line
      ctx.beginPath();
      ctx.moveTo(bookX + 34 * scale, by);
      ctx.lineTo(bookX + 34 * scale, by + bookH - 3 * scale);
      ctx.stroke();

      // Book Name
      ctx.font = `800 ${18 * scale}px sans-serif`;
      ctx.fillStyle = b.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.name, bookX + bookW / 2 + 14 * scale, by + bookH / 2);
    });
    ctx.restore();

    // ==============================================================
    // RIGHT SPREAD (x: 1050 to 2100) — TIER CARDS & POST-IT & PLAY AGAIN
    // ==============================================================
    const rightMidX = 1575 * scale;

    // Top-Right Sticky Note (Post-it)
    ctx.save();
    const postX = W - 320 * scale;
    const postY = 60 * scale;
    const postW = 240 * scale;
    const postH = 190 * scale;
    ctx.translate(postX + postW / 2, postY + postH / 2);
    ctx.rotate(0.06);

    // Sticky Note Body
    drawRoundedRect(ctx, -postW / 2, -postH / 2, postW, postH, 8 * scale);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    // Teal Tape
    drawRoundedRect(ctx, -40 * scale, -postH / 2 - 12 * scale, 80 * scale, 24 * scale, 4 * scale);
    ctx.fillStyle = '#2DD4BF';
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    // Text inside Sticky Note
    ctx.font = `700 ${20 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Great Teachers', 0, -40 * scale);
    ctx.fillText('Make a', 0, -10 * scale);
    ctx.fillText('Bigger World', 0, 20 * scale);
    ctx.fillText('♡', 0, 52 * scale);
    ctx.restore();

    // Section Title: "Here's what your score means:"
    ctx.textAlign = 'center';
    ctx.font = `800 ${22 * scale}px sans-serif`;
    drawStrokedText("Here's what your score means:", rightMidX, 100 * scale, '#FFFFFF', '#1E293B', 3 * scale);

    // 5 Tier Breakdown Stacked Cards
    const tierCardW = 760 * scale;
    const tierCardH = 110 * scale;
    const tierCardGap = 16 * scale;
    const tierCardStartY = 145 * scale;
    const tierCardX = rightMidX - tierCardW / 2;

    SCORE_TIERS.forEach((tierObj, idx) => {
      const cy = tierCardStartY + idx * (tierCardH + tierCardGap);
      const isCurrentTier = score >= tierObj.minScore && score <= tierObj.maxScore;

      // Card Background
      drawRoundedRect(ctx, tierCardX, cy, tierCardW, tierCardH, 16 * scale);
      if (isCurrentTier) {
        ctx.fillStyle = '#FEF9C3';
        ctx.fill();
        ctx.lineWidth = 3.5 * scale;
        ctx.strokeStyle = '#F59E0B';
        ctx.stroke();
      } else {
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2 * scale;
        ctx.strokeStyle = '#CBD5E1';
        ctx.stroke();
      }

      // Icon on Left of Card
      const iconCircleX = tierCardX + 55 * scale;
      const iconCircleY = cy + tierCardH / 2;
      ctx.beginPath();
      ctx.arc(iconCircleX, iconCircleY, 32 * scale, 0, Math.PI * 2);
      ctx.fillStyle = isCurrentTier ? '#FDE047' : '#F1F5F9';
      ctx.fill();
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = isCurrentTier ? '#0F172A' : '#94A3B8';
      ctx.stroke();

      ctx.font = `${32 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tierObj.icon, iconCircleX, iconCircleY);

      // Tier Name Badge Pill
      const contentLeftX = tierCardX + 110 * scale;
      const titlePillW = ctx.measureText(tierObj.label).width + 60 * scale;
      const titlePillH = 28 * scale;
      const titlePillY = cy + 18 * scale;

      drawRoundedRect(ctx, contentLeftX, titlePillY, titlePillW, titlePillH, 14 * scale);
      ctx.fillStyle = isCurrentTier ? '#FDE047' : '#FEF3C7';
      ctx.fill();
      ctx.lineWidth = 1.5 * scale;
      ctx.strokeStyle = isCurrentTier ? '#0F172A' : '#FDE68A';
      ctx.stroke();

      ctx.font = `900 ${15 * scale}px sans-serif`;
      ctx.fillStyle = '#0F172A';
      ctx.textAlign = 'left';
      ctx.fillText(tierObj.label, contentLeftX + 14 * scale, titlePillY + titlePillH / 2);

      // Score Range (e.g. 5/5)
      ctx.font = `800 ${15 * scale}px sans-serif`;
      ctx.fillStyle = isCurrentTier ? '#D97706' : '#64748B';
      ctx.textAlign = 'left';
      ctx.fillText(`• ${tierObj.scoreDisplay}`, contentLeftX + titlePillW + 12 * scale, titlePillY + titlePillH / 2);

      // Description lines
      ctx.font = `600 ${15 * scale}px sans-serif`;
      ctx.fillStyle = isCurrentTier ? '#0F172A' : '#64748B';
      ctx.fillText(tierObj.desc, contentLeftX, cy + 74 * scale);

      // Active Checkmark on Far Right of Card
      if (isCurrentTier) {
        ctx.font = `900 ${28 * scale}px sans-serif`;
        ctx.fillStyle = '#D97706';
        ctx.textAlign = 'right';
        ctx.fillText('✓ YOUR TIER', tierCardX + tierCardW - 24 * scale, cy + tierCardH / 2);
      }
    });

    // Bottom-Right Yellow Corner Wave & Note
    ctx.save();
    ctx.fillStyle = '#FDE047';
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3 * scale;
    ctx.beginPath();
    ctx.moveTo(W, H - 240 * scale);
    ctx.bezierCurveTo(W - 140 * scale, H - 200 * scale, W - 220 * scale, H - 120 * scale, W - 280 * scale, H);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.font = `700 ${20 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you for being you ♡', W - 140 * scale, H - 40 * scale);
    ctx.restore();

    // Play Again CTA Button on Right Page
    const btnW = 320 * scale;
    const btnH = 68 * scale;
    const btnY = H - 140 * scale;
    const btnX = rightMidX - btnW / 2;

    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 34 * scale);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    ctx.font = `900 ${24 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Play Again →', rightMidX, btnY + btnH / 2);

    // Rays beside Play Again
    drawDoodleRays(btnX - 16 * scale, btnY + btnH / 2, 8 * scale, 16 * scale, 3, Math.PI * 0.75, Math.PI * 1.25, '#EAB308');
    drawDoodleRays(btnX + btnW + 16 * scale, btnY + btnH / 2, 8 * scale, 16 * scale, 3, -Math.PI * 0.25, Math.PI * 0.25, '#EAB308');

    // Update Three.js textures across all page meshes in the 3D scene
    if (window.Main && window.Main.maskRevealView) {
      if (window.Main.maskRevealView.pageMaterials) {
        const mat = window.Main.maskRevealView.pageMaterials[materialIndex];
        if (mat) applyTextureToMaterial(mat, canvas);
      }
      if (window.Main.maskRevealView.pages) {
        const pages = window.Main.maskRevealView.pages;
        if (pages[7] && pages[7].children) {
          if (pages[7].children[0]) applyTextureToMaterial(pages[7].children[0].material, canvas);
          if (pages[7].children[1]) applyTextureToMaterial(pages[7].children[1].material, canvas);
        }
        if (pages[6] && pages[6].children && pages[6].children[1]) {
          applyTextureToMaterial(pages[6].children[1].material, canvas);
        }
      }
    }
  } catch (err) {
    console.error('Error rendering result page texture:', err);
  }
}

/**
 * Render all 5 quiz pages and page 8 to 3D page textures
 */
export async function renderAllQuizTextures(questions, answers, score, userName, resultData, timeTaken = '00 : 45') {
  for (let i = 0; i < 5; i++) {
    const matIdx = i + 2; // 2..6 -> Pages 3..7
    const q = questions[i];
    if (q) {
      const prevScore = questions.slice(0, i).reduce((acc, prevQ, prevIdx) => {
        const chosen = answers[prevIdx];
        if (chosen !== undefined && prevQ.options[chosen]?.isCorrect) {
          return acc + 1;
        }
        return acc;
      }, 0);

      await renderQuizPageTexture(
        matIdx,
        q,
        i + 1,
        5,
        answers[i],
        prevScore,
        userName
      );
    }
  }

  // Render Page 8 with total final score and Teachers Day Special layout
  await renderResultPageTexture(resultData, score, userName, timeTaken);
}
