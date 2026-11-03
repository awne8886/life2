import { LifeHistory } from './types';

/**
 * Renders an editorial Birth & Death memorial card onto an HTML5 Canvas and exports a PNG Data URL.
 */
export async function generateMemorialCardPng(life: LifeHistory): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 630; // standard 1.91:1 social card aspect ratio
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Background - warm parchment
  ctx.fillStyle = '#f7f5ef';
  ctx.fillRect(0, 0, width, height);

  // Subtle interior border
  ctx.strokeStyle = '#dfdac8';
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 32, width - 64, height - 64);

  // Top header category
  ctx.font = '500 16px "Inter", sans-serif';
  ctx.fillStyle = '#8b3822';
  ctx.letterSpacing = '3px';
  ctx.fillText('LIFE RECORD  •  1 IN 8 BILLION', 64, 80);

  // Big Person Name & Flag
  ctx.font = '700 48px "Fraunces", Georgia, serif';
  ctx.fillStyle = '#181816';
  ctx.fillText(`${life.name} ${life.flag}`, 64, 150);

  // Lifespan & Country
  ctx.font = '400 24px "Inter", sans-serif';
  ctx.fillStyle = '#3d3c37';
  const deathYear = life.deathYear ?? (life.birthYear + life.finalAge);
  ctx.fillText(
    `${life.countryName}  |  ${life.birthYear} — ${deathYear}  (Lived ${life.finalAge} years)`,
    64,
    195
  );

  // Divider line
  ctx.strokeStyle = '#dfdac8';
  ctx.beginPath();
  ctx.moveTo(64, 225);
  ctx.lineTo(width - 64, 225);
  ctx.stroke();

  // Cause of death callout box
  ctx.fillStyle = '#efece0';
  ctx.fillRect(64, 255, width - 128, 80);
  ctx.strokeStyle = '#c5bfa7';
  ctx.strokeRect(64, 255, width - 128, 80);

  ctx.font = '600 14px "Inter", sans-serif';
  ctx.fillStyle = '#8b3822';
  ctx.fillText('CAUSE OF PASSING', 88, 285);

  ctx.font = '400 20px "Fraunces", Georgia, serif';
  ctx.fillStyle = '#181816';
  const causeText = life.causeOfDeath || 'Senescence and natural decline';
  ctx.fillText(causeText, 88, 315);

  // Demographic details columns
  const colY = 380;
  // Col 1: Socioeconomics
  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = '#8b3822';
  ctx.fillText('ECONOMIC STANDING', 64, colY);
  ctx.font = '500 18px "Inter", sans-serif';
  ctx.fillStyle = '#181816';
  ctx.fillText(
    `${life.incomeTier.toUpperCase()} tier (${life.wealthPpp.toLocaleString()} PPP $)`,
    64,
    colY + 28
  );
  ctx.font = '400 15px "Inter", sans-serif';
  ctx.fillStyle = '#3d3c37';
  ctx.fillText(`Occupation: ${life.occupation}`, 64, colY + 54);

  // Col 2: Final Stats
  const col2X = 420;
  ctx.font = '600 13px "Inter", sans-serif';
  ctx.fillStyle = '#8b3822';
  ctx.fillText('FINAL HEALTH & STATS', col2X, colY);
  ctx.font = '400 16px "Inter", sans-serif';
  ctx.fillStyle = '#181816';
  ctx.fillText(`Health: ${life.finalStats.health}/100`, col2X, colY + 28);
  ctx.fillText(`Happiness: ${life.finalStats.happiness}/100`, col2X, colY + 54);

  const col3X = 640;
  ctx.font = '400 16px "Inter", sans-serif';
  ctx.fillStyle = '#181816';
  ctx.fillText(`Knowledge: ${life.finalStats.knowledge}/100`, col3X, colY + 28);
  ctx.fillText(`Relationships: ${life.finalStats.relationships}/100`, col3X, colY + 54);

  // Parting words quote if available
  if (life.partingWords) {
    ctx.font = 'italic 16px "Fraunces", Georgia, serif';
    ctx.fillStyle = '#3d3c37';
    const quote = `“${life.partingWords}”`;
    ctx.fillText(quote.length > 90 ? quote.slice(0, 90) + '...' : quote, 64, 495);
  }

  // Mini Life Map row preview
  const squareSize = 10;
  const gap = 3;
  const mapStartX = 64;
  const mapStartY = 525;
  const maxSquares = Math.min(85, life.finalAge + 1);

  for (let i = 0; i < maxSquares; i++) {
    const mapYear = life.lifeMap[i];
    let color = '#dfdac8'; // neutral
    if (mapYear) {
      if (mapYear.tone === 'positive') color = '#5c7860'; // sage
      else if (mapYear.tone === 'hardship') color = '#d97706'; // amber
      else if (mapYear.tone === 'crisis') color = '#8b3822'; // rust
    }
    ctx.fillStyle = color;
    ctx.fillRect(mapStartX + i * (squareSize + gap), mapStartY, squareSize, squareSize);
  }

  // Footer branding
  ctx.font = '500 13px "Inter", sans-serif';
  ctx.fillStyle = '#888270';
  ctx.fillText('Simulated life based on real UN WPP, World Bank & WHO health statistics.', 64, 575);
  ctx.fillText('1in8b.life', width - 140, 575);

  return canvas.toDataURL('image/png');
}

/**
 * Triggers browser download of the generated card
 */
export async function downloadMemorialCard(life: LifeHistory): Promise<void> {
  const dataUrl = await generateMemorialCardPng(life);
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = `life-record-${life.name.toLowerCase()}-${life.countryCode.toLowerCase()}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
