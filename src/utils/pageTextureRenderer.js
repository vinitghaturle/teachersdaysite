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

    // Helper for stroking 2px white outline + black fill
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
    
    // Draw Tag Border
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

    // Header Title
    ctx.font = `800 ${16 * scale}px sans-serif`;
    drawStrokedText('CHOOSE AN OPTION (1 - 4):', rightX, 135 * scale);

    // Points Badge (+1 pt)
    ctx.textAlign = 'right';
    drawStrokedText('+1 pt', rightX + rightW, 135 * scale);
    ctx.textAlign = 'left';

    // 4 Option Cards
    const cardH = 68 * scale;
    const cardGap = 16 * scale;
    const cardStartY = 175 * scale;

    questionData.options.forEach((opt, idx) => {
      const cardY = cardStartY + idx * (cardH + cardGap);
      const isSelected = selectedOptionIndex === idx;

      // Card Background & Outline (Clean highlight without blurry glow)
      drawRoundedRect(ctx, rightX, cardY, rightW, cardH, 12 * scale);
      if (isSelected) {
        // Clean warm highlight fill
        ctx.fillStyle = 'rgba(232, 167, 53, 0.22)';
        ctx.fill();

        // Crisp solid border
        ctx.lineWidth = 3 * scale;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      } else {
        ctx.lineWidth = 2 * scale;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      }

      // Option Number Badge (Circle)
      const circleX = rightX + 28 * scale;
      const circleY = cardY + cardH / 2;
      const circleR = 16 * scale;

      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
      if (isSelected) {
        // Solid Orange badge with black text
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

      // Option Text
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

      // Checkmark for selected
      if (isSelected) {
        ctx.font = `900 ${22 * scale}px sans-serif`;
        ctx.textAlign = 'right';
        drawStrokedText('✓', rightX + rightW - 16 * scale, cardY + cardH / 2);
        ctx.textAlign = 'left';
      }
    });

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
  if (Array.isArray(mat.textures) && mat.textures.length > 0) {
    mat.textures[0] = canvasTex;
  }

  // Shift layer offsets offscreen so old art doesn't overlay canvas
  if (mat.userData && mat.userData.shader && mat.userData.shader.uniforms) {
    const u = mat.userData.shader.uniforms;
    if (u.map) {
      u.map.value = canvasTex;
    }
    const offscreen = new window.THREE.Vector4(99999, 99999, 0.001, 0.001);
    if (u.map2Dimensions) u.map2Dimensions.value = offscreen;
    if (u.map3Dimensions) u.map3Dimensions.value = offscreen;
    if (u.map4Dimensions) u.map4Dimensions.value = offscreen;
    if (u.map5Dimensions) u.map5Dimensions.value = offscreen;
    if (u.map6Dimensions) u.map6Dimensions.value = offscreen;
  }

  mat.needsUpdate = true;
}

    // Update Three.js Texture directly on the 3D book material
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
 * Exactly matching the Teachers' Day Special result reference design
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
    bgGrad.addColorStop(0, '#FEFCE8');
    bgGrad.addColorStop(0.5, '#FEF9C3');
    bgGrad.addColorStop(1, '#FDE68A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.15;
    ctx.drawImage(bgImg, 0, 0, W, H);
    ctx.globalAlpha = 1.0;

    const scale = W / 1600;

    // Helper functions
    const drawDoodleRays = (cx, cy, r, len, count, startAngle, endAngle, color = '#EAB308', width = 2.5 * scale) => {
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

    const drawDotGrid = (startX, startY, cols, rows, spacing, radius = 2.5 * scale, color = '#94A3B8') => {
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

    // 2. Corner Organic Blobs (Top-Left & Bottom-Right)
    // Top-Left Yellow Blob
    ctx.save();
    ctx.fillStyle = '#FDE047';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(160 * scale, 0);
    ctx.bezierCurveTo(140 * scale, 80 * scale, 80 * scale, 120 * scale, 40 * scale, 160 * scale);
    ctx.bezierCurveTo(10 * scale, 190 * scale, 0, 220 * scale, 0, 240 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Bottom-Right Yellow Blob with "Thank you for being you ♡"
    ctx.save();
    ctx.fillStyle = '#FDE047';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.moveTo(W, H - 220 * scale);
    ctx.bezierCurveTo(W - 120 * scale, H - 180 * scale, W - 200 * scale, H - 100 * scale, W - 240 * scale, H);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Text inside Bottom-Right Blob
    ctx.save();
    ctx.font = `700 ${16 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you', W - 80 * scale, H - 75 * scale);
    ctx.fillText('for being you', W - 80 * scale, H - 55 * scale);
    ctx.fillText('♡', W - 80 * scale, H - 35 * scale);
    ctx.restore();

    // 3. Dot grids (Top-Left & Top-Right)
    drawDotGrid(40 * scale, 260 * scale, 6, 4, 16 * scale, 2.5 * scale, '#FBBF24');
    drawDotGrid(W - 140 * scale, 40 * scale, 6, 4, 16 * scale, 2.5 * scale, '#94A3B8');

    // 4. Top-Right Sticky Note (Post-it)
    ctx.save();
    const postX = W - 260 * scale;
    const postY = 80 * scale;
    const postW = 180 * scale;
    const postH = 170 * scale;
    ctx.translate(postX + postW / 2, postY + postH / 2);
    ctx.rotate(0.06); // slight rotation

    // Sticky Note Body
    drawRoundedRect(ctx, -postW / 2, -postH / 2, postW, postH, 6 * scale);
    ctx.fillStyle = '#FEF08A';
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    // Washi Tape on top of post-it
    drawRoundedRect(ctx, -30 * scale, -postH / 2 - 10 * scale, 60 * scale, 20 * scale, 3 * scale);
    ctx.fillStyle = '#2DD4BF';
    ctx.fill();
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    // Post-it Text
    ctx.font = `700 ${16 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Great', 0, -40 * scale);
    ctx.fillText('Teachers', 0, -18 * scale);
    ctx.fillText('Make a', 0, 4 * scale);
    ctx.fillText('Bigger World', 0, 26 * scale);
    ctx.fillText('♡', 0, 48 * scale);
    ctx.restore();

    // 5. Left & Right Handwritten Doodles
    // Left: "Good Teachers Brighter Tomorrows ♡"
    ctx.save();
    ctx.font = `700 ${15 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'center';
    ctx.fillText('Good', 140 * scale, 180 * scale);
    ctx.fillText('Teachers', 140 * scale, 200 * scale);
    ctx.fillText('Brighter', 140 * scale, 220 * scale);
    ctx.fillText('Tomorrows', 140 * scale, 240 * scale);
    ctx.fillText('♡', 140 * scale, 260 * scale);
    drawDoodleRays(180 * scale, 175 * scale, 6 * scale, 10 * scale, 3, -0.6, 0.4, '#EAB308');
    ctx.restore();

    // Mid-Left: "More Curious Minds ♡"
    ctx.save();
    ctx.font = `700 ${15 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'center';
    ctx.fillText('More', 90 * scale, 500 * scale);
    ctx.fillText('Curious Minds', 90 * scale, 520 * scale);
    ctx.fillText('♡', 90 * scale, 540 * scale);
    ctx.restore();

    // Right: "Same Classrooms New Perspectives"
    ctx.save();
    ctx.font = `700 ${15 * scale}px "Caveat", "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'center';
    ctx.fillText('Same', W - 140 * scale, 360 * scale);
    ctx.fillText('Classrooms', W - 140 * scale, 380 * scale);
    ctx.fillText('New Perspectives', W - 140 * scale, 400 * scale);
    drawDoodleRays(W - 100 * scale, 340 * scale, 6 * scale, 10 * scale, 3, -0.8, -0.2, '#EAB308');
    ctx.restore();

    // 6. Bottom-Left Stack of 3 Books
    ctx.save();
    const bookX = 40 * scale;
    const bookY = H - 180 * scale;
    const bookW = 160 * scale;
    const bookH = 34 * scale;

    const books = [
      { name: 'Impact', bg: '#FFFFFF', text: '#0F172A', yOff: 2 * bookH },
      { name: 'Kindness', bg: '#FBBF24', text: '#0F172A', yOff: 1 * bookH },
      { name: 'Curiosity', bg: '#2DD4BF', text: '#0F172A', yOff: 0 },
    ];

    books.forEach((b) => {
      const by = bookY + b.yOff;
      drawRoundedRect(ctx, bookX, by, bookW, bookH - 2 * scale, 6 * scale);
      ctx.fillStyle = b.bg;
      ctx.fill();
      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = '#0F172A';
      ctx.stroke();

      // Book Spine line
      ctx.beginPath();
      ctx.moveTo(bookX + 24 * scale, by);
      ctx.lineTo(bookX + 24 * scale, by + bookH - 2 * scale);
      ctx.stroke();

      // Book Title
      ctx.font = `700 ${13 * scale}px sans-serif`;
      ctx.fillStyle = b.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.name, bookX + bookW / 2 + 10 * scale, by + bookH / 2);
    });
    ctx.restore();

    // ==========================================
    // CENTER CONTENT
    // ==========================================
    const centerX = W / 2;

    // A. "— TEACHERS' DAY SPECIAL —"
    ctx.font = `800 ${14 * scale}px sans-serif`;
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '2px';
    ctx.fillText('—  T E A C H E R S \'  D A Y  S P E C I A L  —', centerX, 48 * scale);

    // B. "Your Result" with doodle sunshine rays
    ctx.font = `700 ${32 * scale}px "Caveat", "Playpen Sans", cursive, sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Your Result', centerX, 88 * scale);
    
    // Doodle rays on left & right of "Your Result"
    const yrW = ctx.measureText('Your Result').width;
    drawDoodleRays(centerX - yrW / 2 - 12 * scale, 88 * scale, 6 * scale, 12 * scale, 3, Math.PI * 0.75, Math.PI * 1.25, '#EAB308');
    drawDoodleRays(centerX + yrW / 2 + 12 * scale, 88 * scale, 6 * scale, 12 * scale, 3, -Math.PI * 0.25, Math.PI * 0.25, '#EAB308');

    // Teal underline doodle swoosh under "Your Result"
    ctx.beginPath();
    ctx.moveTo(centerX - 60 * scale, 106 * scale);
    ctx.quadraticCurveTo(centerX, 114 * scale, centerX + 60 * scale, 106 * scale);
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#14B8A6';
    ctx.lineCap = 'round';
    ctx.stroke();

    // C. Headline: "You're a"
    ctx.font = `800 ${34 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    const teacherPrefix = userName ? `${userName}, You're a` : "You're a";
    ctx.fillText(teacherPrefix, centerX, 150 * scale);

    // D. Yellow highlighter brush banner behind Tier Name
    const tierLabel = `${resultData.label}!`;
    ctx.font = `900 ${44 * scale}px sans-serif`;
    const tierW = ctx.measureText(tierLabel).width + 50 * scale;
    const tierH = 58 * scale;
    const tierY = 178 * scale;

    drawRoundedRect(ctx, centerX - tierW / 2, tierY, tierW, tierH, 14 * scale);
    ctx.fillStyle = '#FDE047';
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.textBaseline = 'middle';
    ctx.fillText(tierLabel, centerX, tierY + tierH / 2);

    // E. Subtitle
    ctx.font = `600 ${17 * scale}px sans-serif`;
    ctx.fillStyle = '#475569';
    ctx.fillText(resultData.desc || resultData.message, centerX, 260 * scale);

    // F. Center Stats Pill (Score + Time Taken)
    const pillW = 440 * scale;
    const pillH = 68 * scale;
    const pillY = 295 * scale;
    const pillX = centerX - pillW / 2;

    drawRoundedRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = '#FFFDF5';
    ctx.fill();
    ctx.lineWidth = 1.5 * scale;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.stroke();

    // Left Stat: Score
    const leftStatX = pillX + 36 * scale;
    const statCenterY = pillY + pillH / 2;

    // Yellow Circle with Checkmark
    ctx.beginPath();
    ctx.arc(leftStatX + 16 * scale, statCenterY, 20 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.font = `800 ${18 * scale}px sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('✓', leftStatX + 16 * scale, statCenterY);

    // Score Text
    ctx.textAlign = 'left';
    ctx.font = `600 ${13 * scale}px sans-serif`;
    ctx.fillStyle = '#64748B';
    ctx.fillText('Score', leftStatX + 46 * scale, statCenterY - 10 * scale);
    ctx.font = `900 ${22 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.fillText(`${score} / 5`, leftStatX + 46 * scale, statCenterY + 12 * scale);

    // Divider Line
    ctx.beginPath();
    ctx.moveTo(centerX, pillY + 12 * scale);
    ctx.lineTo(centerX, pillY + pillH - 12 * scale);
    ctx.lineWidth = 1 * scale;
    ctx.strokeStyle = '#CBD5E1';
    ctx.stroke();

    // Right Stat: Time Taken
    const rightStatX = centerX + 36 * scale;

    // Teal Circle with Clock
    ctx.beginPath();
    ctx.arc(rightStatX + 16 * scale, statCenterY, 20 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#5EEAD4';
    ctx.fill();
    ctx.font = `800 ${16 * scale}px sans-serif`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText('🕒', rightStatX + 16 * scale, statCenterY);

    // Time Taken Text
    ctx.textAlign = 'left';
    ctx.font = `600 ${13 * scale}px sans-serif`;
    ctx.fillStyle = '#64748B';
    ctx.fillText('Time Taken', rightStatX + 46 * scale, statCenterY - 10 * scale);
    ctx.font = `900 ${22 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.fillText(timeTaken, rightStatX + 46 * scale, statCenterY + 12 * scale);

    // G. "Here's what your score means:"
    ctx.textAlign = 'center';
    ctx.font = `700 ${17 * scale}px sans-serif`;
    ctx.fillStyle = '#475569';
    ctx.fillText("Here's what your score means:", centerX, 395 * scale);

    // H. Five Tier Cards in a Row
    const cardRowW = 1260 * scale;
    const cardGap = 16 * scale;
    const cardW = (cardRowW - 4 * cardGap) / 5; // ~235 scale each
    const cardH = 200 * scale;
    const cardStartY = 420 * scale;
    const rowStartX = centerX - cardRowW / 2;

    SCORE_TIERS.forEach((tierObj, idx) => {
      const cx = rowStartX + idx * (cardW + cardGap);
      const isCurrentTier = score >= tierObj.minScore && score <= tierObj.maxScore;

      // Card Box
      drawRoundedRect(ctx, cx, cardStartY, cardW, cardH, 16 * scale);
      if (isCurrentTier) {
        // Highlighted active card
        ctx.fillStyle = '#FEF9C3';
        ctx.fill();
        ctx.lineWidth = 3 * scale;
        ctx.strokeStyle = '#F59E0B';
        ctx.stroke();
      } else {
        // Inactive Card
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.lineWidth = 1.5 * scale;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.stroke();
      }

      // Tier Icon
      ctx.font = `${30 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(tierObj.icon, cx + cardW / 2, cardStartY + 38 * scale);

      if (isCurrentTier) {
        // Sparkle rays around current tier icon
        drawDoodleRays(cx + cardW / 2, cardStartY + 35 * scale, 22 * scale, 8 * scale, 4, -Math.PI * 0.8, -Math.PI * 0.2, '#F59E0B');
      }

      // Tier Name Badge (Pill)
      const pillNameH = 24 * scale;
      const pillNameW = cardW - 30 * scale;
      drawRoundedRect(ctx, cx + 15 * scale, cardStartY + 64 * scale, pillNameW, pillNameH, 12 * scale);
      ctx.fillStyle = isCurrentTier ? '#FDE047' : '#FEF3C7';
      ctx.fill();

      ctx.font = `800 ${14 * scale}px sans-serif`;
      ctx.fillStyle = '#0F172A';
      ctx.fillText(tierObj.label, cx + cardW / 2, cardStartY + 76 * scale);

      // Score Range
      ctx.font = `800 ${13 * scale}px sans-serif`;
      ctx.fillStyle = '#475569';
      ctx.fillText(tierObj.scoreDisplay, cx + cardW / 2, cardStartY + 104 * scale);

      // Description lines
      ctx.font = `500 ${11.5 * scale}px sans-serif`;
      ctx.fillStyle = '#64748B';
      const descLines = wrapText(ctx, tierObj.desc, cardW - 24 * scale);
      descLines.forEach((line, lIdx) => {
        ctx.fillText(line, cx + cardW / 2, cardStartY + 128 * scale + lIdx * 15 * scale);
      });
    });

    // I. "Play Again →" Bottom Button
    const btnW = 240 * scale;
    const btnH = 50 * scale;
    const btnY = H - 90 * scale;

    drawRoundedRect(ctx, centerX - btnW / 2, btnY, btnW, btnH, btnH / 2);
    ctx.fillStyle = '#FBBF24';
    ctx.fill();
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = '#0F172A';
    ctx.stroke();

    ctx.font = `800 ${18 * scale}px sans-serif`;
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Play Again →', centerX, btnY + btnH / 2);

    // Rays on sides of Play Again
    drawDoodleRays(centerX - btnW / 2 - 10 * scale, btnY + btnH / 2, 6 * scale, 10 * scale, 3, Math.PI * 0.75, Math.PI * 1.25, '#EAB308');
    drawDoodleRays(centerX + btnW / 2 + 10 * scale, btnY + btnH / 2, 6 * scale, 10 * scale, 3, -Math.PI * 0.25, Math.PI * 0.25, '#EAB308');

    // Update Three.js texture
    if (window.Main && window.Main.maskRevealView && window.Main.maskRevealView.pageMaterials) {
      const mat = window.Main.maskRevealView.pageMaterials[materialIndex];
      applyTextureToMaterial(mat, canvas);

      // Also ensure pages[7] and pages[6].children[1] receive the material
      if (window.Main.maskRevealView.pages) {
        const p7 = window.Main.maskRevealView.pages[7];
        if (p7 && p7.children && p7.children[0]) {
          applyTextureToMaterial(p7.children[0].material, canvas);
        }
        const p6 = window.Main.maskRevealView.pages[6];
        if (p6 && p6.children && p6.children[1]) {
          applyTextureToMaterial(p6.children[1].material, canvas);
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
      // Calculate score of previous questions (0 to i - 1) so current question does not reveal right/wrong until moving next
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
