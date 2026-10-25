# Design

## Context

- Next 16.4.1 docs (`01-metadata/opengraph-image.md`, `04-functions/image-response.md`): `opengraph-image.tsx` default-exports a function returning a `Response`. It may export `alt`, `size` and `contentType`, and Next emits `og:image`, `og:image:alt`, `og:image:type`, `og:image:width` and `og:image:height`. With no request-time APIs it is prerendered at build. File-based metadata overrides `openGraph.images` from the `metadata` object. A segment's image also applies to child routes that lack their own.
- `ImageResponse` uses Satori and Resvg: flexbox and absolute positioning only, no grid, fonts as `ttf`/`otf`/`woff` passed as `ArrayBuffer`. The docs' 500KB bundle limit covers what is bundled. Files read with `readFile` at module scope on the Node runtime are not bundled.
- The mockup (`og.html`) uses CSS that Satori does not support as written: `::after` pseudo-elements, `inset`, the `font` shorthand, background `url()` with position and `cover`, and multi-stop hard-edge gradients. The port must restate these as plain elements and longhand styles.
- Satori reads fonts with opentype.js. It is not known to apply variable-font axes, so `SpaceGrotesk-var.ttf` and `Inter-var.ttf` may render only their default instance whatever weight is requested.
- Measured on the mockup: `og-home.png` re-encoded as full-color PNG at compression level 9 is 909KB, 236KB after `sharp` palette quantization (`png({ palette: true, quality: 80, effort: 10 })`) with no visible banding, and 104KB as JPEG. Inner pages are flat navy with one glow and a faint mark, so they compress well.
- Home photo: `public/images/gallery/drive-153gkemtahu2.jpg`, 1600x1200, 437KB.
- After `seo-metadata-fixes`, `src/lib/seo.ts` holds `sharedOpenGraph.images` and `sharedTwitter.images` pointing at `/og-image.jpg`.

## Goals / Non-Goals

**Goals:**
- One render module. Each route file stays a few lines of data.
- Images built once at deploy, not per request.

**Non-Goals:**
- Per-event images for external event pages (we do not host them).
- English variants. Metadata is Spanish only (see `seo-metadata-fixes`).
- Changing on-screen UI.
- Preview images for the 404 and error pages. They are `noindex` and not shared. They inherit the home image through the root segment, which is acceptable.

## Decisions

**Module shape.** `src/lib/og-image.tsx` exports `size` (`{ width: 1200, height: 630 }`), `contentType` (`'image/png'`), `renderHomeImage()` and `renderPageImage({ eyebrow, title, path })`. Both renderers build JSX, call `new ImageResponse(jsx, { ...size, fonts })`, then pass the bytes through `sharp(...).png({ palette: true, quality: 80, effort: 10 })` and return `new Response(buf, { headers: { 'content-type': 'image/png' } })`. Each route file is:

```tsx
import { size, contentType, renderPageImage } from '@/lib/og-image';
export { size, contentType };
export const alt = 'Cloud Native Santo Domingo · Eventos: próximos meetups y charlas';
export default () => renderPageImage({ eyebrow: 'Eventos', title: 'Próximos meetups y charlas', path: '/events' });
```

Next reads `size` and `contentType` statically, so if Next rejects re-exports at build, each file declares the two constants literally. That is a two-line fallback.

**Quantize every image, not only home.** One code path is simpler than a size check. A flat inner image loses nothing at 256 colors. Alternative: JPEG for home. Rejected because the requirement is PNG, and the quantized PNG already fits at 236KB.

**Static assets read at module scope.** Fonts are read from `_ds/style-guide/assets/fonts/`. The mark comes from `public/brand/mark.svg` as a data URL for `<img>`. The photo is cropped and resized by `sharp` to the right panel's 600x630 (focus near the mockup's `72% 30%`) and inlined as a JPEG data URL, so Satori decodes about 60KB instead of 437KB. All are read with `readFile(join(process.cwd(), …))`. The submodule is already a build dependency because `globals.css` imports its tokens.

**Fonts.** First try the variable files at the weights used (Space Grotesk 700; Inter 400 and 600). If the render shows the default instance instead (thin headline), commit static instances `SpaceGrotesk-Bold.ttf`, `Inter-Regular.ttf` and `Inter-SemiBold.ttf` from the upstream OFL releases into `src/lib/og-fonts/`, with their OFL license files. They are font files, not packages. This is decided by looking at the first render, not in advance.

**Porting the mockup.**
- Photo: absolute `<img>` at left 600, `objectFit: 'cover'`, plus a sibling absolute div with `linear-gradient(90deg, #090d16 0%, rgba(9,13,22,0) 22%)` in place of `::after`.
- Inner glow: absolute div with `radial-gradient(600px 400px at 0 0, rgba(14,168,230,.18), transparent)`. If Satori misreads the size syntax, use `radial-gradient(circle at 0 0, …)` sized by the div.
- Strip: a flex row 8px high at the bottom: cyan 80%, navy 1%, ultramarine 9%, navy 1%, vermillion 9%. Plain divs avoid relying on Satori's handling of hard gradient stops, and keep the navy gaps exact.
- Faint mark: `<img>` 520px at right -90, bottom -110, `opacity: 0.12`.

**Headline orphan.** "La comunidad <span>Cloud Native</span> de RD" with a non-breaking space binds "de RD", so the last line can never be "RD" alone. At 60px in the 540px column it sets as "La comunidad / Cloud Native de RD". At worst it sets as "… / Cloud Native / de RD", which still has no single-word line. The size is tuned from the first render. Satori is expected to honor U+00A0 in its line breaking. If the render shows it does not, wrap "de RD" in a `whiteSpace: 'nowrap'` span.

**Inner page copy (Spanish).** The user can edit this in review without changing the spec, except for the events line, which the spec fixes from the mockup.

| Route | Eyebrow | Title |
|---|---|---|
| `/events` | Eventos | Próximos meetups y charlas |
| `/team` | Equipo | Las personas detrás de la comunidad |
| `/gallery` | Galería | Fotos de nuestros encuentros |
| `/programs` | Programas | Hazte Kubestronaut o CNCF Ambassador |
| `/resources` | Recursos | Cursos, descuentos y certificaciones |
| `/map` | Mapa | Cloud Native en el mundo |
| `/start-a-chapter` | Capítulos | Abre un capítulo en tu ciudad |
| `/contact` | Contacto | Hablemos |

Home subline: "Meetups, charlas y networking sobre Kubernetes y el ecosistema CNCF." Home alt: "Cloud Native Santo Domingo: la comunidad Cloud Native de República Dominicana". "CNCF" and "Kubernetes" appear as words only, never as marks.

**Twitter image.** Next copies `openGraph` images into `twitter` when `twitter.images` is unset. Removing `images` from `sharedTwitter` lets the file-convention image flow to `twitter:image`. If the built HTML lacks `twitter:image`, add `twitter-image.tsx` files that re-export the same module (one line each).

**Retire the static image.** Drop `images` from `sharedOpenGraph` and `sharedTwitter` and delete `public/og-image.jpg`. `_ds/style-guide/assets/og-image.jpg` belongs to the design-system repo and is left alone.

## Risks / Trade-offs

- [Satori ignores variable-font weights] → Covered by the static-instance fallback above. Check it on the first render.
- [Palette quantization bands the photo gradient] → The measured mockup output shows none. If banding appears, raise `colours` or add `dither`, staying under 300KB.
- [The build depends on the `_ds/style-guide` submodule being checked out] → Already true for CSS. A missing font file fails the build loudly, which is preferable to a silent fallback font.
- [Build time grows by nine renders] → Each takes well under a second. Accepted.
- [Crawlers cache old previews] → After deploy, re-scrape key URLs in the Facebook Sharing Debugger and LinkedIn Post Inspector.

## Migration Plan

Apply after `brand-identity-assets` and `seo-metadata-fixes`. One PR. Rollback = revert, which restores `og-image.jpg` and the static `images` entries.
