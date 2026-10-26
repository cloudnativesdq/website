import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import type { ReactElement } from 'react';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const NAVY = '#090d16';
const CYAN = '#0ea8e6';
// Static instances: Satori's font parser throws on the variable files in _ds/style-guide.
const [spaceGroteskBold, interRegular, interSemiBold, markSvg, photoSrc] = await Promise.all([
  readFile(join(process.cwd(), 'src/lib/og-fonts/SpaceGrotesk-Bold.ttf')),
  readFile(join(process.cwd(), 'src/lib/og-fonts/Inter-Regular.ttf')),
  readFile(join(process.cwd(), 'src/lib/og-fonts/Inter-SemiBold.ttf')),
  readFile(join(process.cwd(), 'public/brand/mark.svg')),
  readFile(join(process.cwd(), 'public/images/gallery/drive-153gkemtahu2.jpg')),
]);

const fonts = [
  { name: 'Space Grotesk', data: spaceGroteskBold, weight: 700 as const, style: 'normal' as const },
  { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: interSemiBold, weight: 600 as const, style: 'normal' as const },
];

const mark = `data:image/svg+xml;base64,${markSvg.toString('base64')}`;

// Crop the photo to the right panel (600x630), focused near 72% 30% like the mockup's background-position.
const PHOTO = { width: 600, height: 630 };
const photo = await (async () => {
  const { width = 0, height = 0 } = await sharp(photoSrc).metadata();
  const scale = Math.max(PHOTO.width / width, PHOTO.height / height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const jpeg = await sharp(photoSrc)
    .resize(w, h)
    .extract({
      left: Math.round((w - PHOTO.width) * 0.72),
      top: Math.round((h - PHOTO.height) * 0.3),
      ...PHOTO,
    })
    .jpeg({ quality: 85 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
})();

const brand = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <img src={mark} width={64} height={64} alt="" />
    <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 28, letterSpacing: -0.56, color: '#fff' }}>
      Cloud Native Santo Domingo
    </div>
  </div>
);

// Cyan, ultramarine and vermillion with navy gaps so ultramarine and vermillion never touch.
const strip = (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, display: 'flex' }}>
    {[
      [CYAN, '80%'],
      [NAVY, '1%'],
      ['#002d72', '9%'],
      [NAVY, '1%'],
      ['#ce1126', '9%'],
    ].map(([background, width], i) => (
      <div key={i} style={{ background, width, height: 8 }} />
    ))}
  </div>
);

const column = (width: number, children: ReactElement[]) => (
  <div
    style={{
      position: 'absolute',
      left: 72,
      top: 0,
      bottom: 0,
      width,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 24,
    }}
  >
    {children}
  </div>
);

const headline = (fontSize: number) => ({
  fontFamily: 'Space Grotesk',
  fontWeight: 700,
  fontSize,
  lineHeight: 1.02,
  letterSpacing: -0.035 * fontSize,
  color: '#fff',
});

const subline = { fontFamily: 'Inter', fontWeight: 400, fontSize: 24, color: '#8992a6' };

async function render(body: ReactElement): Promise<Response> {
  const raw = new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden', background: NAVY }}>
      {body}
      {strip}
    </div>,
    { ...size, fonts },
  );
  const png = await sharp(Buffer.from(await raw.arrayBuffer()))
    // quality 100, not 80: at 80 the flat inner images drop to so few colours that the mark's light
    // cyan turns grey and ultramarine drifts. Home already uses the full 256 and is unchanged (~237KB).
    .png({ palette: true, quality: 100, effort: 10 })
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'content-type': contentType } });
}

export function renderHomeImage(): Promise<Response> {
  return render(
    <>
      <img src={photo} width={600} height={630} alt="" style={{ position: 'absolute', left: 600, top: 0, objectFit: 'cover' }} />
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 0,
          width: 600,
          height: 630,
          backgroundImage: `linear-gradient(90deg, ${NAVY} 0%, rgba(9,13,22,0) 22%)`,
        }}
      />
      {column(540, [
        <div key="b" style={{ display: 'flex' }}>{brand}</div>,
        // U+00A0 binds "de RD" so "RD" never sits alone on the last line.
        <div key="h" style={{ ...headline(60), display: 'flex', flexWrap: 'wrap' }}>
          <span>La comunidad&nbsp;</span>
          <span style={{ color: CYAN }}>Cloud Native</span>
          <span>&nbsp;de{' '}RD</span>
        </div>,
        <div key="p" style={subline}>Meetups, charlas y networking sobre Kubernetes y el ecosistema CNCF.</div>,
      ])}
    </>,
  );
}

export function renderPageImage({ eyebrow, title, path }: { eyebrow: string; title: string; path: string }): Promise<Response> {
  return render(
    <>
      <div
        style={{
          position: 'absolute',
          // The mockup's radial-gradient(600px 400px at 0 0), which Satori misreads. A farthest-corner
          // ellipse in a 600x400 box has radii 600√2 x 400√2, so ending at 70.7% gives radii 600 x 400.
          left: 0,
          top: 0,
          width: 600,
          height: 400,
          backgroundImage: 'radial-gradient(ellipse at 0 0, rgba(14,168,230,.18) 0%, rgba(14,168,230,0) 70.7%)',
        }}
      />
      <img
        src={mark}
        width={520}
        height={520}
        alt=""
        // right -90, bottom -110 restated as left/top: Satori misplaces an <img> anchored by right/bottom.
        style={{ position: 'absolute', left: 1200 + 90 - 520, top: 630 + 110 - 520, opacity: 0.12 }}
      />
      {column(1000, [
        <div key="b" style={{ display: 'flex' }}>{brand}</div>,
        <div
          key="e"
          style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 18, letterSpacing: 2.52, textTransform: 'uppercase', color: CYAN }}
        >
          {eyebrow}
        </div>,
        // Bind one- and two-letter words to the next word so none ends a line ("meetups y / charlas").
        <div key="t" style={headline(84)}>{title.replace(/(?<=^|\s)(\S{1,2}) /g, '$1 ')}</div>,
        <div key="p" style={subline}>{`cloudnativesdq.org${path}`}</div>,
      ])}
    </>,
  );
}
