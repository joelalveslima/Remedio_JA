const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

// Função para criar ícone com design glassmorphism moderno
function createIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  const scale = size / 1024;
  const centerX = size / 2;
  const centerY = size / 2;

  // Background com gradiente sofisticado
  const bgGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    size / 2
  );
  bgGradient.addColorStop(0, "#4CAF50"); // Verde mais vibrante
  bgGradient.addColorStop(0.6, "#2E7D32");
  bgGradient.addColorStop(1, "#1B5E20");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, size, size);

  // Efeito de textura sutil
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const opacity = Math.random() * 0.1;
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.fillRect(x, y, 1 * scale, 1 * scale);
  }

  // Base da cruz com glassmorphism
  const glassGradient = ctx.createLinearGradient(0, 0, size, size);
  glassGradient.addColorStop(0, "rgba(255,255,255,0.25)");
  glassGradient.addColorStop(0.5, "rgba(255,255,255,0.35)");
  glassGradient.addColorStop(1, "rgba(255,255,255,0.15)");

  // Sombra externa da cruz
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 25 * scale;
  ctx.shadowOffsetX = 8 * scale;
  ctx.shadowOffsetY = 8 * scale;

  // Função para desenhar formas com bordas suaves
  function drawRoundedCross() {
    const crossSize = 320 * scale;
    const thickness = 100 * scale;
    const radius = 20 * scale;

    ctx.fillStyle = glassGradient;

    // Cruz vertical
    ctx.beginPath();
    ctx.roundRect(
      centerX - thickness / 2,
      centerY - crossSize / 2,
      thickness,
      crossSize,
      radius
    );
    ctx.fill();

    // Cruz horizontal
    ctx.beginPath();
    ctx.roundRect(
      centerX - crossSize / 2,
      centerY - thickness / 2,
      crossSize,
      thickness,
      radius
    );
    ctx.fill();
  }

  drawRoundedCross();

  // Resetar sombra
  ctx.shadowColor = "transparent";

  // Borda interna da cruz com brilho
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 3 * scale;
  const crossSize = 320 * scale;
  const thickness = 100 * scale;
  const radius = 20 * scale;

  ctx.beginPath();
  ctx.roundRect(
    centerX - thickness / 2,
    centerY - crossSize / 2,
    thickness,
    crossSize,
    radius
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(
    centerX - crossSize / 2,
    centerY - thickness / 2,
    crossSize,
    thickness,
    radius
  );
  ctx.stroke();

  // Pílulas 3D com reflexos
  const modernPills = [
    {
      x: 250 * scale,
      y: 250 * scale,
      color: "#E91E63",
      size: 30 * scale,
      rotation: -45,
    },
    {
      x: 774 * scale,
      y: 774 * scale,
      color: "#00BCD4",
      size: 28 * scale,
      rotation: 45,
    },
    {
      x: 774 * scale,
      y: 250 * scale,
      color: "#FF9800",
      size: 26 * scale,
      rotation: 30,
    },
    {
      x: 250 * scale,
      y: 774 * scale,
      color: "#8BC34A",
      size: 24 * scale,
      rotation: -30,
    },
    {
      x: 150 * scale,
      y: 512 * scale,
      color: "#9C27B0",
      size: 22 * scale,
      rotation: 60,
    },
    {
      x: 874 * scale,
      y: 512 * scale,
      color: "#F44336",
      size: 20 * scale,
      rotation: -60,
    },
  ];

  modernPills.forEach((pill) => {
    ctx.save();
    ctx.translate(pill.x, pill.y);
    ctx.rotate((pill.rotation * Math.PI) / 180);

    // Sombra da pílula
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 15 * scale;
    ctx.shadowOffsetX = 5 * scale;
    ctx.shadowOffsetY = 5 * scale;

    // Gradiente da pílula
    const pillGrad = ctx.createLinearGradient(
      -pill.size,
      -pill.size / 2,
      pill.size,
      pill.size / 2
    );
    pillGrad.addColorStop(0, pill.color);
    pillGrad.addColorStop(0.5, pill.color + "DD");
    pillGrad.addColorStop(1, pill.color + "BB");

    ctx.fillStyle = pillGrad;

    // Corpo da pílula
    ctx.beginPath();
    ctx.arc(-pill.size / 2, 0, pill.size / 2, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.arc(pill.size / 2, 0, pill.size / 2, (3 * Math.PI) / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "transparent";

    // Reflexo da pílula
    const reflectGrad = ctx.createLinearGradient(
      -pill.size / 2,
      -pill.size / 3,
      pill.size / 4,
      pill.size / 3
    );
    reflectGrad.addColorStop(0, "rgba(255,255,255,0.6)");
    reflectGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = reflectGrad;

    ctx.beginPath();
    ctx.ellipse(
      0,
      -pill.size / 4,
      pill.size / 3,
      pill.size / 6,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Linha divisória
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(0, -pill.size / 2);
    ctx.lineTo(0, pill.size / 2);
    ctx.stroke();

    ctx.restore();
  });

  // Efeito de brilho final
  const finalGlow = ctx.createRadialGradient(
    centerX,
    centerY - 100 * scale,
    0,
    centerX,
    centerY - 100 * scale,
    300 * scale
  );
  finalGlow.addColorStop(0, "rgba(255,255,255,0.2)");
  finalGlow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = finalGlow;
  ctx.fillRect(0, 0, size, size);

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(__dirname, "assets", filename), buffer);
  console.log(`✅ ${filename} criado (${size}x${size})`);
}

function createSplash() {
  const canvas = createCanvas(1284, 2778);
  const ctx = canvas.getContext("2d");

  // Background com gradiente elegante
  const bgGradient = ctx.createLinearGradient(0, 0, 0, 2778);
  bgGradient.addColorStop(0, "#4CAF50");
  bgGradient.addColorStop(0.5, "#2E7D32");
  bgGradient.addColorStop(1, "#1B5E20");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1284, 2778);

  // Efeito de partículas/pontos decorativos
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 1284;
    const y = Math.random() * 2778;
    const radius = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Center the logo
  const centerX = 642;
  const centerY = 1200;
  const scale = 1.5; // Maior para splash

  // Sombra principal do logo
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 8;
  ctx.shadowOffsetY = 8;

  // Base da cruz com glassmorphism
  const glassGradient = ctx.createLinearGradient(0, 0, 1284, 2778);
  glassGradient.addColorStop(0, "rgba(255,255,255,0.25)");
  glassGradient.addColorStop(0.5, "rgba(255,255,255,0.35)");
  glassGradient.addColorStop(1, "rgba(255,255,255,0.15)");
  ctx.fillStyle = glassGradient;

  // Cruz vertical
  ctx.beginPath();
  ctx.roundRect(
    centerX - 75 * scale,
    centerY - 200 * scale,
    150 * scale,
    400 * scale,
    30 * scale
  );
  ctx.fill();

  // Cruz horizontal
  ctx.beginPath();
  ctx.roundRect(
    centerX - 200 * scale,
    centerY - 75 * scale,
    400 * scale,
    150 * scale,
    30 * scale
  );
  ctx.fill();

  ctx.shadowColor = "transparent";

  // Borda da cruz
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.roundRect(
    centerX - 75 * scale,
    centerY - 200 * scale,
    150 * scale,
    400 * scale,
    30 * scale
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(
    centerX - 200 * scale,
    centerY - 75 * scale,
    400 * scale,
    150 * scale,
    30 * scale
  );
  ctx.stroke();

  // Pílulas decorativas melhoradas
  const pillData = [
    {
      x: centerX - 350,
      y: centerY - 350,
      color1: "#E91E63",
      color2: "#C2185B",
      rotation: -Math.PI / 4,
      size: 1.4,
    },
    {
      x: centerX + 380,
      y: centerY + 380,
      color1: "#00BCD4",
      color2: "#0097A7",
      rotation: -Math.PI / 4,
      size: 1.3,
    },
    {
      x: centerX + 420,
      y: centerY - 320,
      color1: "#FF9800",
      color2: "#F57C00",
      rotation: Math.PI / 6,
      size: 1.2,
    },
    {
      x: centerX - 380,
      y: centerY + 320,
      color1: "#8BC34A",
      color2: "#689F38",
      rotation: Math.PI / 3,
      size: 1.1,
    },
    {
      x: centerX - 450,
      y: centerY - 100,
      color1: "#9C27B0",
      color2: "#7B1FA2",
      rotation: Math.PI / 8,
      size: 1.0,
    },
    {
      x: centerX + 480,
      y: centerY + 80,
      color1: "#F44336",
      color2: "#D32F2F",
      rotation: -Math.PI / 3,
      size: 0.9,
    },
  ];

  pillData.forEach((pill) => {
    ctx.save();
    ctx.translate(pill.x, pill.y);
    ctx.rotate(pill.rotation);

    const pillSize = pill.size * 35; // Tamanho base das pílulas

    // Sombra da pílula
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;

    // Gradiente da pílula
    const pillGradient = ctx.createLinearGradient(
      -pillSize,
      -pillSize / 2,
      pillSize,
      pillSize / 2
    );
    pillGradient.addColorStop(0, pill.color1);
    pillGradient.addColorStop(1, pill.color2);

    ctx.fillStyle = pillGradient;

    // Desenhar pílula
    ctx.beginPath();
    ctx.arc(-pillSize / 2, 0, pillSize / 2, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.arc(pillSize / 2, 0, pillSize / 2, (3 * Math.PI) / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // Detalhes da pílula
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -pillSize / 2);
    ctx.lineTo(0, pillSize / 2);
    ctx.stroke();

    // Brilho na pílula
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.arc(-pillSize / 4, -pillSize / 4, pillSize / 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  });

  // Nome do app elegante (sem "RJ")
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = "white";
  ctx.font = "300 64px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Remédio Já", centerX, centerY + 450);

  // Subtítulo
  ctx.shadowBlur = 3;
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "300 36px Arial, sans-serif";
  ctx.fillText("Encontre medicamentos próximos", centerX, centerY + 520);

  // Efeito de brilho geral
  const highlight = ctx.createRadialGradient(
    centerX - 200,
    centerY - 300,
    0,
    centerX - 200,
    centerY - 300,
    500
  );
  highlight.addColorStop(0, "rgba(255,255,255,0.15)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, 1284, 2778);

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(path.join(__dirname, "assets", "splash.png"), buffer);
  console.log("✅ splash.png criado (1284x2778)");
}

async function generateAllIcons() {
  console.log("🎨 Gerando ícones modernos sem texto RJ...");

  try {
    const assetsDir = path.join(__dirname, "assets");
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir);
    }

    // Gerar todos os ícones
    createIcon(1024, "icon.png");
    createIcon(1024, "adaptive-icon.png");
    createIcon(64, "favicon.png");
    createSplash();

    console.log("🎉 Todos os ícones foram gerados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao gerar ícones:", error.message);
  }
}

if (require.main === module) {
  generateAllIcons();
}

module.exports = { createIcon, createSplash, generateAllIcons };
