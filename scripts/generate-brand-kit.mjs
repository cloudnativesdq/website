// Builds brand-kit/: logos, social media templates and slide backgrounds as SVG + PNG,
// plus brand-kit/slides/plantilla.pptx. Run with `pnpm brand:kit` after changing the mark.
// Text is converted to outlines (Satori), so the SVGs render the same without the fonts installed.
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pptxgen from 'pptxgenjs';
import satori from 'satori';
import sharp from 'sharp';

const path = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const OUT = 'brand-kit';

const NAVY = '#090d16';
const CYAN = '#0ea8e6';
const ULTRAMARINE = '#002d72';
const VERMILLION = '#ce1126';
const LIGHT_BG = '#f7f9fc';
const THEMES = {
  dark: { bg: NAVY, text: '#ffffff', muted: '#a5b4c8', glow: 'rgba(14,168,230,0.18)', faint: 0.08 },
  light: { bg: LIGHT_BG, text: NAVY, muted: '#475569', glow: 'rgba(3,105,161,0.10)', faint: 0.07 },
};

const markSvg = await readFile(path('public/brand/mark.svg'), 'utf8');
const monoSvg = await readFile(path('public/brand/mark-mono.svg'), 'utf8');
const iconSvg = await readFile(path('public/brand/icon.svg'), 'utf8');
const markInner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const dataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const MARK = dataUri(markSvg);
const ICON = dataUri(iconSvg);

const fonts = [
  { name: 'Space Grotesk', data: await readFile(path('src/lib/og-fonts/SpaceGrotesk-Bold.ttf')), weight: 700 },
  { name: 'Inter', data: await readFile(path('src/lib/og-fonts/Inter-Regular.ttf')), weight: 400 },
  { name: 'Inter', data: await readFile(path('src/lib/og-fonts/Inter-SemiBold.ttf')), weight: 600 },
];

// Tiny element helper for Satori: h('div', style, ...children).
const h = (type, style, ...children) => ({ type, props: { style: { display: 'flex', ...style }, children } });
const img = (size, style = {}, src = MARK) => ({ type: 'img', props: { src, width: size, height: size, style } });

// Satori embeds <img> as a base64 <image>; inline the mark's paths instead so the SVG stays editable vector.
function inlineMarks(svg) {
  return svg.replace(
    /<image x="([\d.-]+)" y="([\d.-]+)" width="([\d.]+)" height="[\d.]+" href="data:image\/svg\+xml;base64,([^"]+)"([^>]*)\/>/g,
    (_, x, y, w, b64, rest) => {
      const attrs = rest.replace(/\s*preserveAspectRatio="[^"]*"/, '');
      const inner = markInner(Buffer.from(b64, 'base64').toString());
      return `<g${attrs}><g transform="translate(${x} ${y}) scale(${w / 64})" fill="none">${inner}</g></g>`;
    },
  );
}

const render = async (node, width, height) => inlineMarks(await satori(node, { width, height, fonts }));

async function save(dir, name, svg, pngWidth) {
  await mkdir(path(`${OUT}/${dir}`), { recursive: true });
  await writeFile(path(`${OUT}/${dir}/${name}.svg`), svg);
  const png = sharp(Buffer.from(svg), { density: 72 * (pngWidth / Number(svg.match(/width="([\d.]+)"/)[1])) });
  await png.png().toFile(path(`${OUT}/${dir}/${name}.png`));
}

// Renders a transparent logo once, measures the ink with sharp, then re-renders cropped to it plus padding.
async function fitted(build, pad) {
  const probe = await render(h('div', { width: 3000, height: 1500, alignItems: 'flex-start' }, build()), 3000, 1500);
  const { info } = await sharp(Buffer.from(probe)).trim().toBuffer({ resolveWithObject: true });
  const [left, top] = [-info.trimOffsetLeft, -info.trimOffsetTop];
  const [w, h2] = [info.width + 2 * pad, info.height + 2 * pad];
  return render(h('div', { width: w, height: h2, alignItems: 'flex-start', paddingLeft: pad - left, paddingTop: pad - top }, build()), w, h2);
}

const name = (size, color, style = {}) =>
  h('div', { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: size, letterSpacing: -size * 0.02, color, ...style }, 'Cloud Native Santo Domingo');

const brandRow = (markSize, color) =>
  h('div', { alignItems: 'center', gap: markSize * 0.3 }, img(markSize), name(markSize * 0.45, color));

// Cyan, ultramarine and vermillion with navy gaps so ultramarine and vermillion never touch.
const strip = (height) =>
  h(
    'div',
    { position: 'absolute', left: 0, right: 0, bottom: 0, height },
    ...[
      [CYAN, '80%'],
      [NAVY, '1%'],
      [ULTRAMARINE, '9%'],
      [NAVY, '1%'],
      [VERMILLION, '9%'],
    ].map(([background, width]) => h('div', { background, width, height })),
  );

// Shared canvas: glow, faint oversized mark at the bottom right, strip at the bottom.
function canvas(w, h2, theme, { faint = true, withStrip = true, faintScale = 0.62 } = {}, ...children) {
  const t = THEMES[theme];
  const big = Math.round(Math.min(w, h2) * faintScale * (w / h2 > 2.5 ? 1.6 : 1));
  return h(
    'div',
    {
      width: w,
      height: h2,
      position: 'relative',
      background: t.bg,
      backgroundImage: `radial-gradient(circle at 15% 10%, ${t.glow}, transparent 60%)`,
    },
    ...(faint ? [img(big, { position: 'absolute', right: -big * 0.12, bottom: -big * 0.14, opacity: t.faint })] : []),
    ...children,
    ...(withStrip ? [strip(Math.max(8, Math.round(h2 * 0.0125)))] : []),
  );
}

// 1. Logos
const mono = (color) => monoSvg.replaceAll('currentColor', color);
await mkdir(path(`${OUT}/logo`), { recursive: true });
for (const [file, svg] of [
  ['mark', markSvg],
  ['icon', iconSvg],
  ['mark-white', mono('#ffffff')],
  ['mark-black', mono('#000000')],
]) {
  await writeFile(path(`${OUT}/logo/${file}.svg`), svg);
  await sharp(Buffer.from(svg), { density: 72 * 16 }).png().toFile(path(`${OUT}/logo/${file}.png`));
}
for (const theme of ['dark', 'light']) {
  const color = THEMES[theme].text;
  // "-dark" = for dark backgrounds (white text); "-light" = for light backgrounds (navy text).
  await save('logo', `lockup-horizontal-${theme}`, await fitted(() => brandRow(120, color), 24), 2400);
  const stacked = () =>
    h(
      'div',
      { flexDirection: 'column', alignItems: 'center', gap: 28 },
      img(200),
      h('div', { flexDirection: 'column', alignItems: 'center' }, ...['Cloud Native', 'Santo Domingo'].map((line) =>
        h('div', { fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 84, letterSpacing: -1.7, lineHeight: 1.05, color }, line),
      )),
    );
  await save('logo', `lockup-stacked-${theme}`, await fitted(stacked, 24), 1600);
}
// Profile picture: opaque navy, the small-size icon inside the circle crop every network applies.
await save('logo', 'avatar', await render(h('div', { width: 1080, height: 1080, background: NAVY, alignItems: 'center', justifyContent: 'center' }, img(640, {}, ICON)), 1080, 1080), 1080);

// 2. Social media templates (empty middle for your own text and photos)
const SOCIAL = {
  'post-square': [1080, 1080],
  'post-portrait': [1080, 1350],
  story: [1080, 1920],
  'link-preview': [1200, 630],
  'linkedin-banner': [1584, 396],
  'x-header': [1500, 500],
  'youtube-thumbnail': [1280, 720],
};
for (const [file, [w, h2]] of Object.entries(SOCIAL)) {
  const banner = w / h2 > 2.5;
  const pad = Math.round(Math.min(w, h2) * (banner ? 0.16 : 0.07));
  const markSize = Math.round(Math.min(w, h2) * (banner ? 0.22 : 0.085));
  for (const theme of ['dark', 'light']) {
    // Banners keep the lockup on the right: LinkedIn and X cover the bottom left with the profile photo.
    const position = banner
      ? { position: 'absolute', right: pad, top: 0, bottom: 0, alignItems: 'center' }
      : { position: 'absolute', left: pad, top: pad };
    const node = canvas(w, h2, theme, {}, h('div', position, brandRow(markSize, THEMES[theme].text)));
    await save('social', `${file}-${theme}`, await render(node, w, h2), w);
  }
}

// 3. Slide backgrounds, 1920x1080 (16:9). The text lives in the .pptx as editable placeholders.
const [SW, SH] = [1920, 1080];
const slides = {
  'portada': canvas(SW, SH, 'dark', {}, h('div', { position: 'absolute', left: 120, top: 110 }, brandRow(88, '#ffffff'))),
  'seccion': canvas(SW, SH, 'dark', { faintScale: 0.95 }, h('div', { position: 'absolute', left: 120, top: 110 }, img(72))),
  'contenido': canvas(SW, SH, 'light', { faint: false, withStrip: false }, h('div', { position: 'absolute', left: 120, bottom: 56 }, brandRow(44, NAVY))),
  'cierre': canvas(SW, SH, 'dark', { faint: false }, h('div', { position: 'absolute', left: 0, right: 0, top: 170, justifyContent: 'center' }, img(220))),
};
for (const [file, node] of Object.entries(slides)) await save('slides', file, await render(node, SW, SH), SW);

// 4. PowerPoint / Google Slides / Keynote template on those backgrounds.
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in = 1920 x 1080 at 144 px/in
pres.title = 'Plantilla Cloud Native Santo Domingo';
pres.author = 'Cloud Native Santo Domingo';
pres.theme = { headFontFace: 'Space Grotesk', bodyFontFace: 'Inter' };
const bg = (file) => ({ path: path(`${OUT}/slides/${file}.png`) });
const px = (v) => v / 144;
const hex = (c) => c.slice(1);
const L = px(120);
const slideNumber = (color) => ({ x: 12.2, y: 6.85, w: 0.8, h: 0.35, fontFace: 'Inter', fontSize: 12, color, align: 'right' });

pres.defineSlideMaster({
  title: 'Portada',
  background: bg('portada'),
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: L, y: 2.6, w: 9, h: 2.2, fontFace: 'Space Grotesk', fontSize: 54, bold: true, color: 'FFFFFF', valign: 'bottom', margin: 0 }, text: 'Título de la charla' } },
    { placeholder: { options: { name: 'body', type: 'body', x: L, y: 5.0, w: 9, h: 0.9, fontFace: 'Inter', fontSize: 20, color: hex(THEMES.dark.muted), valign: 'top', margin: 0 }, text: 'Nombre del ponente · Fecha' } },
  ],
});
pres.defineSlideMaster({
  title: 'Seccion',
  background: bg('seccion'),
  objects: [
    { placeholder: { options: { name: 'eyebrow', type: 'body', x: L, y: 2.75, w: 8, h: 0.5, fontFace: 'Inter', fontSize: 16, bold: true, color: hex(CYAN), charSpacing: 2, margin: 0 }, text: 'SECCIÓN 01' } },
    { placeholder: { options: { name: 'title', type: 'title', x: L, y: 3.3, w: 8.5, h: 1.8, fontFace: 'Space Grotesk', fontSize: 48, bold: true, color: 'FFFFFF', valign: 'top', margin: 0 }, text: 'Título de la sección' } },
  ],
  slideNumber: slideNumber('A5B4C8'),
});
pres.defineSlideMaster({
  title: 'Contenido',
  background: bg('contenido'),
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: L, y: 0.6, w: 11.6, h: 0.9, fontFace: 'Space Grotesk', fontSize: 36, bold: true, color: hex(NAVY), valign: 'top', margin: 0 }, text: 'Título de la diapositiva' } },
    { placeholder: { options: { name: 'body', type: 'body', x: L, y: 1.75, w: 11.6, h: 4.6, fontFace: 'Inter', fontSize: 18, color: '1F2937', valign: 'top', margin: 0 }, text: 'Contenido' } },
  ],
  slideNumber: slideNumber('475569'),
});
pres.defineSlideMaster({
  title: 'Dos columnas',
  background: bg('contenido'),
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: L, y: 0.6, w: 11.6, h: 0.9, fontFace: 'Space Grotesk', fontSize: 36, bold: true, color: hex(NAVY), valign: 'top', margin: 0 }, text: 'Título de la diapositiva' } },
    { placeholder: { options: { name: 'left', type: 'body', x: L, y: 1.75, w: 5.6, h: 4.6, fontFace: 'Inter', fontSize: 18, color: '1F2937', valign: 'top', margin: 0 }, text: 'Columna izquierda' } },
    { placeholder: { options: { name: 'right', type: 'body', x: L + 6, y: 1.75, w: 5.6, h: 4.6, fontFace: 'Inter', fontSize: 18, color: '1F2937', valign: 'top', margin: 0 }, text: 'Columna derecha' } },
  ],
  slideNumber: slideNumber('475569'),
});
pres.defineSlideMaster({
  title: 'Cierre',
  background: bg('cierre'),
  objects: [
    { placeholder: { options: { name: 'title', type: 'title', x: 1, y: 3.35, w: 11.333, h: 1.2, fontFace: 'Space Grotesk', fontSize: 60, bold: true, color: 'FFFFFF', align: 'center', margin: 0 }, text: '¡Gracias!' } },
    { placeholder: { options: { name: 'body', type: 'body', x: 1, y: 4.7, w: 11.333, h: 1.0, fontFace: 'Inter', fontSize: 20, color: hex(THEMES.dark.muted), align: 'center', valign: 'top', margin: 0 }, text: 'cloudnativesdq.org' } },
  ],
});

const bullets = (items) => items.map((text, i) => ({ text, options: { bullet: true, paraSpaceAfter: 10, breakLine: i < items.length - 1 } }));
let s = pres.addSlide({ masterName: 'Portada' });
s.addText('Título de la charla', { placeholder: 'title' });
s.addText('Nombre del ponente · Meetup Cloud Native Santo Domingo · Fecha', { placeholder: 'body' });
s = pres.addSlide({ masterName: 'Contenido' });
s.addText('Agenda', { placeholder: 'title' });
s.addText(bullets(['Bienvenida y anuncios de la comunidad', 'Charla principal', 'Demo', 'Preguntas y networking']), { placeholder: 'body' });
s = pres.addSlide({ masterName: 'Seccion' });
s.addText('SECCIÓN 01', { placeholder: 'eyebrow' });
s.addText('Título de la sección', { placeholder: 'title' });
s = pres.addSlide({ masterName: 'Dos columnas' });
s.addText('Comparación', { placeholder: 'title' });
s.addText(bullets(['Punto uno', 'Punto dos', 'Punto tres']), { placeholder: 'left' });
s.addText(bullets(['Punto uno', 'Punto dos', 'Punto tres']), { placeholder: 'right' });
s = pres.addSlide({ masterName: 'Cierre' });
s.addText('¡Gracias!', { placeholder: 'title' });
s.addText('cloudnativesdq.org', { placeholder: 'body' });
await pres.writeFile({ fileName: path(`${OUT}/slides/plantilla.pptx`) });

// 5. Fonts, so the template and any new artwork can use the brand type.
await mkdir(path(`${OUT}/fonts`), { recursive: true });
for (const f of ['SpaceGrotesk-Bold.ttf', 'Inter-Regular.ttf', 'Inter-SemiBold.ttf', 'OFL-SpaceGrotesk.txt', 'OFL-Inter.txt']) {
  await copyFile(path(`src/lib/og-fonts/${f}`), path(`${OUT}/fonts/${f}`));
}
console.log(`Wrote ${OUT}/`);
