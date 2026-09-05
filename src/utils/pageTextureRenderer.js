/**
 * 3D Book Page Texture Renderer
 * Paints questions, options, and scores directly onto the Three.js 3D page textures
 * so text deforms, bends, curls, and rotates in 3D seamlessly with the page.
 */

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
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
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
    const optionLetters = ['A', 'B', 'C', 'D'];

    // Header Title
    ctx.font = `800 ${16 * scale}px sans-serif`;
    drawStrokedText('SELECT THE BEST COMPLETION:', rightX, 135 * scale);

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

      // Card Outline (Double border: White outer, Black inner)
      drawRoundedRect(ctx, rightX, cardY, rightW, cardH, 12 * scale);
      ctx.lineWidth = isSelected ? 4 * scale : 2.5 * scale;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Option Letter Badge (Circle)
      const circleX = rightX + 28 * scale;
      const circleY = cardY + cardH / 2;
      const circleR = 16 * scale;

      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
      if (isSelected) {
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
      } else {
        ctx.lineWidth = 2 * scale;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.fillStyle = '#000000';
      }

      ctx.font = `800 ${16 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (isSelected) {
        ctx.fillText(optionLetters[idx], circleX, circleY);
      } else {
        drawStrokedText(optionLetters[idx], circleX, circleY);
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

    // Update Three.js Texture directly on the 3D book material
    if (window.Main && window.Main.maskRevealView && window.Main.maskRevealView.pageMaterials) {
      const mat = window.Main.maskRevealView.pageMaterials[materialIndex];
      if (mat && window.THREE) {
        const canvasTex = new window.THREE.CanvasTexture(canvas);
        canvasTex.flipY = false;
        canvasTex.anisotropy = 8;
        canvasTex.premultiplyAlpha = false;
        mat.map = canvasTex;
        mat.textures[0] = canvasTex;
        mat.needsUpdate = true;
      }
    }
  } catch (err) {
    console.error('Error rendering quiz page texture:', err);
  }
}

/**
 * Render the Page 8 Score & Compliment directly onto the 3D Page 8 texture
 */
export async function renderResultPageTexture(resultData, score, userName) {
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

    // Left Page (Score & Title)
    const leftCenterX = 440 * scale;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = `${60 * scale}px sans-serif`;
    ctx.fillText(resultData.badge || '🏆', leftCenterX, 220 * scale);

    ctx.font = `800 ${20 * scale}px sans-serif`;
    drawStrokedText(resultData.score, leftCenterX, 300 * scale);

    ctx.font = `700 ${36 * scale}px "Canela Web", Georgia, serif`;
    drawStrokedText(resultData.label, leftCenterX, 360 * scale);

    if (userName) {
      ctx.font = `700 ${22 * scale}px sans-serif`;
      drawStrokedText(`Dedicated to: ${userName}`, leftCenterX, 420 * scale);
    }

    // Right Page (Compliment Message)
    const rightCenterX = 1180 * scale;
    ctx.font = `800 ${22 * scale}px sans-serif`;
    drawStrokedText("THE TEACHER'S DAY COMPLIMENT", rightCenterX, 220 * scale);

    ctx.font = `600 ${26 * scale}px "Canela Web", Georgia, serif`;
    const msgLines = wrapText(ctx, `"${resultData.message}"`, 560 * scale);
    msgLines.forEach((l, lIdx) => {
      drawStrokedText(l, rightCenterX, 300 * scale + lIdx * 44 * scale);
    });

    ctx.textAlign = 'left';

    // Update Three.js texture
    if (window.Main && window.Main.maskRevealView && window.Main.maskRevealView.pageMaterials) {
      const mat = window.Main.maskRevealView.pageMaterials[materialIndex];
      if (mat && window.THREE) {
        const canvasTex = new window.THREE.CanvasTexture(canvas);
        canvasTex.flipY = false;
        canvasTex.anisotropy = 8;
        canvasTex.premultiplyAlpha = false;
        mat.map = canvasTex;
        mat.textures[0] = canvasTex;
        mat.needsUpdate = true;
      }
    }
  } catch (err) {
    console.error('Error rendering result page texture:', err);
  }
}

/**
 * Render all 5 quiz pages and page 8 to 3D page textures
 */
export async function renderAllQuizTextures(questions, answers, score, userName, resultData) {
  for (let i = 0; i < 5; i++) {
    const matIdx = i + 2; // 2..6 -> Pages 3..7
    const q = questions[i];
    if (q) {
      await renderQuizPageTexture(
        matIdx,
        q,
        i + 1,
        5,
        answers[i],
        score,
        userName
      );
    }
  }

  // Render Page 8
  await renderResultPageTexture(resultData, score, userName);
}
