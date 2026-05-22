const fs = require('node:fs');
const path = require('node:path');

if (fs.existsSync(path.join(__dirname, '..', 'src', 'assets', 'logo-source.png'))) {
  process.exit(0);
}

const size = 256;
const pixels = Buffer.alloc(size * size * 4);

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= size || y >= size) {
    return;
  }
  const index = ((size - 1 - y) * size + x) * 4;
  pixels[index] = b;
  pixels[index + 1] = g;
  pixels[index + 2] = r;
  pixels[index + 3] = a;
}

function roundRect(x, y, width, height, radius, color) {
  const [r, g, b, a] = color;
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      const dx = Math.max(x - px, 0, px - (x + width - 1));
      const dy = Math.max(y - py, 0, py - (y + height - 1));
      const cornerX = px < x + radius ? x + radius : px >= x + width - radius ? x + width - radius - 1 : px;
      const cornerY = py < y + radius ? y + radius : py >= y + height - radius ? y + height - radius - 1 : py;
      const cd = Math.hypot(px - cornerX, py - cornerY);
      if ((dx === 0 && dy === 0) || cd <= radius) {
        setPixel(px, py, r, g, b, a);
      }
    }
  }
}

function line(x1, y1, x2, y2, width, color) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const x = Math.round(x1 + (x2 - x1) * t);
    const y = Math.round(y1 + (y2 - y1) * t);
    for (let oy = -width; oy <= width; oy += 1) {
      for (let ox = -width; ox <= width; ox += 1) {
        if (Math.hypot(ox, oy) <= width) {
          setPixel(x + ox, y + oy, ...color);
        }
      }
    }
  }
}

function fillRect(x, y, width, height, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      setPixel(px, py, ...color);
    }
  }
}

roundRect(0, 0, size, size, 56, [7, 16, 21, 255]);
roundRect(20, 20, 216, 216, 46, [18, 54, 59, 245]);
roundRect(34, 34, 188, 188, 38, [7, 18, 23, 248]);

for (let i = 0; i < 70; i += 1) {
  const alpha = Math.max(0, 90 - i);
  roundRect(36 + i, 36 + i, 184 - i * 2, 184 - i * 2, Math.max(8, 36 - i / 2), [92, 255, 214, alpha]);
}

line(55, 142, 86, 142, 6, [92, 255, 214, 255]);
line(86, 142, 102, 99, 6, [92, 255, 214, 255]);
line(102, 99, 127, 176, 6, [92, 255, 214, 255]);
line(127, 176, 154, 82, 6, [92, 255, 214, 255]);
line(154, 82, 174, 142, 6, [92, 255, 214, 255]);
line(174, 142, 203, 142, 6, [92, 255, 214, 255]);

fillRect(67, 76, 25, 104, [245, 255, 252, 255]);
fillRect(92, 76, 23, 32, [245, 255, 252, 255]);
line(93, 78, 146, 178, 13, [245, 255, 252, 255]);
fillRect(145, 76, 25, 104, [245, 255, 252, 255]);

const dibHeader = Buffer.alloc(40);
dibHeader.writeUInt32LE(40, 0);
dibHeader.writeInt32LE(size, 4);
dibHeader.writeInt32LE(size * 2, 8);
dibHeader.writeUInt16LE(1, 12);
dibHeader.writeUInt16LE(32, 14);
dibHeader.writeUInt32LE(0, 16);
dibHeader.writeUInt32LE(pixels.length, 20);

const mask = Buffer.alloc((size / 8) * size);
const imageData = Buffer.concat([dibHeader, pixels, mask]);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);

const directory = Buffer.alloc(16);
directory.writeUInt8(0, 0);
directory.writeUInt8(0, 1);
directory.writeUInt8(0, 2);
directory.writeUInt8(0, 3);
directory.writeUInt16LE(1, 4);
directory.writeUInt16LE(32, 6);
directory.writeUInt32LE(imageData.length, 8);
directory.writeUInt32LE(header.length + directory.length, 12);

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
fs.writeFileSync(path.join(assetsDir, 'logo.ico'), Buffer.concat([header, directory, imageData]));
