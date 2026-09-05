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

export const DEFAULT_LAYOUT_SETTINGS = {
  widthPercent: 71,
  heightPercent: 53,
  offsetY: -46,
  questionFontSize: 20,
  optionFontSize: 11,
  spreadGap: 30,
  optionPadding: 4,
  borderWidth: 2.5,
};

export function getLayoutSettings() {
  try {
    const saved = localStorage.getItem('htwkr_quiz_dev_settings');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_LAYOUT_SETTINGS;
}

/**
 * Render a single quiz page directly onto the material's texture in Three.js
 */
export async function renderQuizPageTexture(materialIndex, questionData, questionNumber, totalQuestions, selectedOptionIndex, score, userName, customSettings) {
  const bgSrc = PAGE_BG_MAP[materialIndex];
  if (!bgSrc) return;

  const settings = customSettings || getLayoutSettings();

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
    const strokeWidth = (settings.borderWidth || 2.5) * scale;

    // Helper for stroking 2px white outline + black fill
    const drawStrokedText = (text, x, y, customStroke = strokeWidth) => {
      ctx.lineJoin = 'round';
      ctx.lineWidth = customStroke + 1.5 * scale;
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeText(text, x, y);
      ctx.fillStyle = '#000000';
      ctx.fillText(text, x, y);
    };

    // Calculate layout boundaries based on spread width & height & offsetY
    const totalSpreadW = W * (settings.widthPercent / 100);
    const gapW = settings.spreadGap * scale;
    const pageW = (totalSpreadW - gapW) / 2;
    const leftMargin = (W / 2 - gapW / 2 - pageW);
    const rightMargin = W / 2 + gapW / 2;

    const baseTopY = (H * 0.16) + (settings.offsetY * 1.3 * scale);

    // ==========================================
    // LEFT SPREAD: QUESTION
    // ==========================================
    const leftX = Math.max(80 * scale, leftMargin);
    const leftW = Math.min(pageW, 600 * scale);

    // Tag: QUESTION 0X / 05
    const qnumFontSize = Math.max(13, settings.optionFontSize * 1.3) * scale;
    ctx.font = `800 ${qnumFontSize}px sans-serif`;
    const qnumText = `QUESTION 0${questionNumber} / 05`;
    const tagW = ctx.measureText(qnumText).width + 20 * scale;
    const tagH = 28 * scale;
    
    // Draw Tag Border
    drawRoundedRect(ctx, leftX, baseTopY, tagW, tagH, 6 * scale);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawStrokedText(qnumText, leftX + 10 * scale, baseTopY + tagH / 2);

    // Question Prompt (Canela / Georgia Serif)
    const promptFontSize = Math.max(18, settings.questionFontSize * 1.2) * scale;
    ctx.font = `600 ${promptFontSize}px "Canela Web", Georgia, serif`;
    const qLines = wrapText(ctx, `"${questionData.scenario}"`, leftW);
    const qLineH = promptFontSize * 1.4;
    const qStartY = baseTopY + 54 * scale;
    qLines.forEach((line, idx) => {
      drawStrokedText(line, leftX, qStartY + idx * qLineH);
    });

    // Left Footer: Score & Teacher Name
    const footerY = baseTopY + 360 * scale;
    ctx.beginPath();
    ctx.moveTo(leftX, footerY - 16 * scale);
    ctx.lineTo(leftX + leftW, footerY - 16 * scale);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.font = `700 ${16 * scale}px sans-serif`;
    drawStrokedText(`⭐ Score: ${score} / 5`, leftX, footerY);

    if (userName) {
      const teacherText = `Teacher: ${userName}`;
      ctx.textAlign = 'right';
      drawStrokedText(teacherText, leftX + leftW, footerY);
      ctx.textAlign = 'left';
    }

    // ==========================================
    // RIGHT SPREAD: 4 OPTIONS
    // ==========================================
    const rightX = rightMargin;
    const rightW = Math.min(pageW, 600 * scale);
    const optionLetters = ['A', 'B', 'C', 'D'];

    // Header Title
    ctx.font = `800 ${14 * scale}px sans-serif`;
    drawStrokedText('SELECT THE BEST COMPLETION:', rightX, baseTopY + 12 * scale);

    // Points Badge (+1 pt)
    ctx.textAlign = 'right';
    drawStrokedText('+1 pt', rightX + rightW, baseTopY + 12 * scale);
    ctx.textAlign = 'left';

    // 4 Option Cards (with 5-10px extra vertical gap)
    const cardH = 56 * scale;
    const cardGap = (14 + 8) * scale; // Extra vertical gap
    const cardStartY = baseTopY + 38 * scale;
    const optFontSize = Math.max(12, settings.optionFontSize * 1.3) * scale;

    questionData.options.forEach((opt, idx) => {
      const cardY = cardStartY + idx * (cardH + cardGap);
      const isSelected = selectedOptionIndex === idx;

      // Card Outline (Double border: White outer, Black inner)
      drawRoundedRect(ctx, rightX, cardY, rightW, cardH, 10 * scale);
      ctx.lineWidth = isSelected ? strokeWidth * 1.5 : strokeWidth;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Option Letter Badge (Circle)
      const circleX = rightX + 24 * scale;
      const circleY = cardY + cardH / 2;
      const circleR = 14 * scale;

      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2);
      if (isSelected) {
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
      } else {
        ctx.lineWidth = strokeWidth * 0.8;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.fillStyle = '#000000';
      }

      ctx.font = `800 ${14 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (isSelected) {
        ctx.fillText(optionLetters[idx], circleX, circleY);
      } else {
        drawStrokedText(optionLetters[idx], circleX, circleY);
      }

      // Option Text
      ctx.textAlign = 'left';
      ctx.font = `700 ${optFontSize}px sans-serif`;
      const textX = rightX + 48 * scale;
      const optLines = wrapText(ctx, opt.text, rightW - 80 * scale);
      
      if (optLines.length === 1) {
        drawStrokedText(optLines[0], textX, cardY + cardH / 2);
      } else {
        const lineH = optFontSize * 1.25;
        const totalTextH = optLines.length * lineH;
        const startTextY = cardY + (cardH - totalTextH) / 2 + 8 * scale;
        optLines.forEach((l, lIdx) => {
          drawStrokedText(l, textX, startTextY + lIdx * lineH);
        });
      }

      // Checkmark for selected
      if (isSelected) {
        ctx.font = `900 ${20 * scale}px sans-serif`;
        ctx.textAlign = 'right';
        drawStrokedText('✓', rightX + rightW - 14 * scale, cardY + cardH / 2);
        ctx.textAlign = 'left';
      }
    });

    // Right Page Footer: Next & Back Buttons
    const btnRowY = footerY;
    ctx.beginPath();
    ctx.moveTo(rightX, btnRowY - 16 * scale);
    ctx.lineTo(rightX + rightW, btnRowY - 16 * scale);
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Back Button (if questionNumber > 1)
    if (questionNumber > 1) {
      drawRoundedRect(ctx, rightX, btnRowY - 12 * scale, 90 * scale, 32 * scale, 16 * scale);
      ctx.lineWidth = strokeWidth * 0.8;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      ctx.font = `800 ${13 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawStrokedText('← Back', rightX + 45 * scale, btnRowY + 4 * scale);
    }

    // Next Button (Right aligned)
    const nextBtnW = 170 * scale;
    const nextBtnH = 34 * scale;
    const nextBtnX = rightX + rightW - nextBtnW;
    const isAnswered = selectedOptionIndex !== undefined;
    const isLastQ = questionNumber === totalQuestions;

    drawRoundedRect(ctx, nextBtnX, btnRowY - 13 * scale, nextBtnW, nextBtnH, 17 * scale);
    if (isAnswered) {
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.lineWidth = strokeWidth * 0.8;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `800 ${13 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isLastQ ? 'Next → (Page 8) 🎉' : 'Next Question →', nextBtnX + nextBtnW / 2, btnRowY + 4 * scale);
    } else {
      ctx.lineWidth = strokeWidth * 0.8;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      ctx.font = `800 ${13 * scale}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      drawStrokedText(isLastQ ? 'Next → (Page 8)' : 'Next Question →', nextBtnX + nextBtnW / 2, btnRowY + 4 * scale);
    }
    ctx.textAlign = 'left';

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
export async function renderResultPageTexture(resultData, score, userName, customSettings) {
  const materialIndex = 7; // Page 8 is index 7
  const bgSrc = PAGE_BG_MAP[materialIndex];
  if (!bgSrc) return;

  const settings = customSettings || getLayoutSettings();

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
    const strokeWidth = (settings.borderWidth || 2.5) * scale;

    const drawStrokedText = (text, x, y, customStroke = strokeWidth) => {
      ctx.lineJoin = 'round';
      ctx.lineWidth = customStroke + 1.5 * scale;
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeText(text, x, y);
      ctx.fillStyle = '#000000';
      ctx.fillText(text, x, y);
    };

    const baseTopY = (H * 0.16) + (settings.offsetY * 1.3 * scale);

    // Left Page (Score & Title)
    const leftCenterX = 440 * scale;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = `${52 * scale}px sans-serif`;
    ctx.fillText(resultData.badge || '🏆', leftCenterX, baseTopY + 40 * scale);

    ctx.font = `800 ${18 * scale}px sans-serif`;
    drawStrokedText(resultData.score, leftCenterX, baseTopY + 110 * scale);

    ctx.font = `700 ${32 * scale}px "Canela Web", Georgia, serif`;
    drawStrokedText(resultData.label, leftCenterX, baseTopY + 165 * scale);

    if (userName) {
      ctx.font = `700 ${20 * scale}px sans-serif`;
      drawStrokedText(`Dedicated to: ${userName}`, leftCenterX, baseTopY + 220 * scale);
    }

    // Right Page (Compliment Message)
    const rightCenterX = 1180 * scale;
    ctx.font = `800 ${20 * scale}px sans-serif`;
    drawStrokedText("THE TEACHER'S DAY COMPLIMENT", rightCenterX, baseTopY + 40 * scale);

    ctx.font = `600 ${24 * scale}px "Canela Web", Georgia, serif`;
    const msgLines = wrapText(ctx, `"${resultData.message}"`, 560 * scale);
    msgLines.forEach((l, lIdx) => {
      drawStrokedText(l, rightCenterX, baseTopY + 110 * scale + lIdx * 38 * scale);
    });

    // Page 8 Action Buttons (Printed on 3D paper)
    const p8BtnY = baseTopY + 360 * scale;
    // Retry Button
    const retryW = 230 * scale;
    const retryH = 40 * scale;
    const retryX = rightCenterX - retryW / 2;
    drawRoundedRect(ctx, retryX, p8BtnY, retryW, retryH, 20 * scale);
    ctx.fillStyle = '#000000';
    ctx.fill();
    ctx.lineWidth = strokeWidth * 0.8;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${15 * scale}px sans-serif`;
    ctx.fillText('🔄 Try 5 New Questions', rightCenterX, p8BtnY + retryH / 2);

    // Review Button
    ctx.font = `700 ${13 * scale}px sans-serif`;
    ctx.fillStyle = '#000000';
    drawStrokedText('← Review Questions', rightCenterX, p8BtnY + retryH + 26 * scale);

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
export async function renderAllQuizTextures(questions, answers, score, userName, resultData, customSettings) {
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
        userName,
        customSettings
      );
    }
  }

  // Render Page 8
  await renderResultPageTexture(resultData, score, userName, customSettings);
}
