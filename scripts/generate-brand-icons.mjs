// Regenerates every raster brand asset from public/brand/mark.svg.
// Run with `pnpm brand:icons` after changing the mark, then commit the outputs.
import assert from 'node:assert/strict';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const path = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const NAVY = '#090d16';
const NAVY_RGB = [0x09, 0x0d, 0x16];
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

const MARK_SVG = path('public/brand/mark.svg');
const PADDING = 0.08; // icon-192/512 and favicon: transparent, 8% padding per side
const MASKABLE_SCALE = 0.56; // mark box as a share of the icon; must fit the 80% circle
const APPLE_SCALE = 0.7;
const PLACEHOLDER_SCALE = 0.22;

// Render the SVG large and trim it, so sizing works on the visible mark, not the viewBox margins.
const mark = await sharp(await readFile(MARK_SVG), { density: 72 * 32 }).trim().png().toBuffer();

const fitMark = (box) =>
  sharp(mark).resize(Math.round(box), Math.round(box), { fit: 'contain', background: CLEAR }).toBuffer();

async function icon(width, height, scale, background) {
  const png = await sharp({ create: { width, height, channels: 4, background: background ?? CLEAR } })
    .composite([{ input: await fitMark(width * scale), gravity: 'center' }])
    .png()
    .toBuffer();
  // Opaque icons drop the alpha channel entirely (iOS paints transparency black).
  return background ? sharp(png).removeAlpha().png().toBuffer() : png;
}

const transparent = (size) => icon(size, size, 1 - 2 * PADDING);

// ICO container: 6-byte header, one 16-byte directory entry per image, then the PNG payloads.
function packIco(pngs) {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size, entry);
    header.writeUInt8(size, entry + 1);
    header.writeUInt16LE(1, entry + 4); // color planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

const icoSizes = [16, 32, 48];
const outputs = {
  'public/brand/icon-192.png': await transparent(192),
  'public/brand/icon-512.png': await transparent(512),
  'public/brand/icon-maskable-512.png': await icon(512, 512, MASKABLE_SCALE, NAVY),
  'public/brand/event-placeholder.png': await icon(1200, 800, PLACEHOLDER_SCALE, NAVY),
  'src/app/apple-icon.png': await icon(180, 180, APPLE_SCALE, NAVY),
  'src/app/favicon.ico': packIco(
    await Promise.all(icoSizes.map(async (size) => ({ size, data: await transparent(size) }))),
  ),
};
for (const [file, data] of Object.entries(outputs)) await writeFile(path(file), data);
await copyFile(MARK_SVG, path('src/app/icon.svg'));

// Self-checks: re-read the written files.

// Bounding box of every pixel that differs from the navy background.
async function markBox(file) {
  const { data, info } = await sharp(path(file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let [x0, y0, x1, y1] = [Infinity, Infinity, -1, -1];
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (NAVY_RGB.some((c, k) => Math.abs(data[i + k] - c) > 8)) {
        [x0, y0, x1, y1] = [Math.min(x0, x), Math.min(y0, y), Math.max(x1, x + 1), Math.max(y1, y + 1)];
      }
    }
  }
  assert.ok(x1 > 0, `${file}: no mark pixels found`);
  return { x0, y0, x1, y1, width: info.width, height: info.height };
}

const ico = await readFile(path('src/app/favicon.ico'));
assert.equal(ico.readUInt16LE(2), 1, 'favicon.ico: not an icon file');
assert.equal(ico.readUInt16LE(4), icoSizes.length, 'favicon.ico: wrong image count');
for (const [i, size] of icoSizes.entries()) {
  const entry = 6 + 16 * i;
  assert.deepEqual([ico[entry], ico[entry + 1]], [size, size], `favicon.ico: entry ${i} size`);
  const png = ico.subarray(ico.readUInt32LE(entry + 12), ico.readUInt32LE(entry + 12) + ico.readUInt32LE(entry + 8));
  const meta = await sharp(png).metadata();
  assert.deepEqual([meta.format, meta.width, meta.height], ['png', size, size], `favicon.ico: payload ${i}`);
}

const maskable = await markBox('public/brand/icon-maskable-512.png');
for (const [x, y] of [[maskable.x0, maskable.y0], [maskable.x1, maskable.y0], [maskable.x0, maskable.y1], [maskable.x1, maskable.y1]]) {
  const distance = Math.hypot(x - 256, y - 256);
  assert.ok(distance <= 0.4 * 512, `icon-maskable-512.png: corner (${x},${y}) is ${distance.toFixed(1)}px from center, outside the 80% circle`);
}

const apple = await sharp(path('src/app/apple-icon.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
assert.deepEqual([apple.info.width, apple.info.height], [180, 180], 'apple-icon.png: size');
for (let i = 3; i < apple.data.length; i += 4) assert.equal(apple.data[i], 255, 'apple-icon.png: transparent pixel');

// object-cover crops the centre: 1:1 (compact card), 16:9, and 3:1 (widest phone card, ~600x192).
const placeholder = await markBox('public/brand/event-placeholder.png');
for (const ratio of [1, 16 / 9, 3]) {
  const w = Math.min(placeholder.width, placeholder.height * ratio);
  const h = Math.min(placeholder.height, placeholder.width / ratio);
  const [cx0, cy0] = [(placeholder.width - w) / 2, (placeholder.height - h) / 2];
  assert.ok(
    placeholder.x0 >= cx0 && placeholder.x1 <= cx0 + w && placeholder.y0 >= cy0 && placeholder.y1 <= cy0 + h,
    `event-placeholder.png: mark cut off by a centered ${ratio.toFixed(2)}:1 crop`,
  );
}

assert.ok((await readFile(path('src/app/icon.svg'))).equals(await readFile(MARK_SVG)), 'icon.svg differs from mark.svg');

console.log(`brand icons written and checked: ${[...Object.keys(outputs), 'src/app/icon.svg'].join(', ')}`);
