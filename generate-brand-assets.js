const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const primary = "#3F8B6E";
const dark = "#27634D";
const assetsPath = path.join(__dirname, "assets");

const drawMark = (context, centerX, centerY, size) => {
  context.fillStyle = "#FFFFFF";
  context.beginPath();
  context.arc(centerX, centerY - size * 0.16, size * 0.42, Math.PI, 0);
  context.lineTo(centerX + size * 0.42, centerY - size * 0.1);
  context.quadraticCurveTo(centerX + size * 0.32, centerY + size * 0.42, centerX, centerY + size * 0.62);
  context.quadraticCurveTo(centerX - size * 0.32, centerY + size * 0.42, centerX - size * 0.42, centerY - size * 0.1);
  context.closePath();
  context.fill();
  context.save();
  context.translate(centerX, centerY - size * 0.15);
  context.rotate(-Math.PI / 4);
  context.fillStyle = primary;
  context.beginPath();
  context.roundRect(-size * 0.16, -size * 0.08, size * 0.32, size * 0.16, size * 0.08);
  context.fill();
  context.restore();
};

const saveIcon = (size, name) => {
  const canvas = createCanvas(size, size);
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#56A984");
  gradient.addColorStop(1, dark);
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  drawMark(context, size / 2, size / 2, size * 0.58);
  fs.writeFileSync(path.join(assetsPath, name), canvas.toBuffer("image/png"));
};

const saveSplash = () => {
  const canvas = createCanvas(1284, 2778);
  const context = canvas.getContext("2d");
  context.fillStyle = "#F8FAF8";
  context.fillRect(0, 0, 1284, 2778);
  drawMark(context, 642, 1200, 360);
  context.fillStyle = dark;
  context.font = "bold 64px sans-serif";
  context.textAlign = "center";
  context.fillText("Remédio Já", 642, 1590);
  fs.writeFileSync(path.join(assetsPath, "splash.png"), canvas.toBuffer("image/png"));
};

fs.mkdirSync(assetsPath, { recursive: true });
saveIcon(1024, "icon.png");
saveIcon(1024, "adaptive-icon.png");
saveIcon(64, "favicon.png");
saveSplash();
console.log("Brand assets generated.");