# Brand kit

Logos, social media templates and slide templates for Cloud Native Santo Domingo.
Every SVG has its text converted to outlines, so it looks the same without the fonts installed.

Regenerate everything with `pnpm brand:kit` (source: `scripts/generate-brand-kit.mjs`, mark: `public/brand/mark.svg`).
Do not edit these files by hand; change the script and rerun it.

## logo/

| File | Use |
|---|---|
| `mark.svg/.png` | The tambora mark in full color. Works on dark and light backgrounds. |
| `icon.svg/.png` | Simplified tambora for small sizes (favicons, app icons, avatars, 16-64 px). |
| `mark-white`, `mark-black` | One-color mark for single-ink surfaces (stickers, print, embossing). |
| `lockup-horizontal-dark` | Mark + name on one line, white text, for dark backgrounds. |
| `lockup-horizontal-light` | Same, navy text, for light backgrounds. |
| `lockup-stacked-dark` / `-light` | Mark above the name on two lines, for square spaces. |
| `avatar` | 1080x1080 profile picture with the small-size icon, inside the circle crop. |

## social/

Empty templates with the brand row, a faint mark and the color strip. Add your text and photos in the middle
(Canva, Figma, Keynote, etc.). Each comes in `-dark` and `-light`.

| File | Size |
|---|---|
| `post-square` | 1080x1080 (Instagram, LinkedIn, Facebook) |
| `post-portrait` | 1080x1350 (Instagram feed) |
| `story` | 1080x1920 (Instagram/WhatsApp stories, Reels cover). Keep text out of the top and bottom 250px. |
| `link-preview` | 1200x630 (shared links, event pages) |
| `youtube-thumbnail` | 1280x720 |
| `linkedin-banner` | 1584x396. The name sits on the right because the profile photo covers the bottom left. |
| `x-header` | 1500x500 |

## slides/

- `plantilla.pptx`: 16:9 template with editable layouts **Portada**, **Contenido**, **Dos columnas**, **Seccion** and **Cierre**,
  and one sample slide each. Opens in PowerPoint, Keynote and Google Slides (File > Import slides).
- `portada`, `seccion`, `contenido`, `cierre` (.svg/.png, 1920x1080): the same backgrounds, for tools that can't open .pptx.

## fonts/

Space Grotesk Bold (headings) and Inter (body), under the SIL Open Font License. Install them before editing the
slide template, or PowerPoint will substitute another font.

## Rules

- Never use CNCF or Kubernetes marks, the Dominican flag's cross or quarters, the coat of arms, or the island outline.
- Ultramarine (`#002d72`) and vermillion (`#ce1126`) never touch; keep navy between them, as the strip does.
- Don't recolor, stretch, rotate or add effects to the mark.

## Colors

| Name | Hex |
|---|---|
| Navy (background) | `#090d16` |
| Cyan (primary) | `#0ea8e6` |
| Light cyan | `#7ad8fa` |
| Ultramarine | `#002d72` |
| Vermillion | `#ce1126` |
| Light background | `#f7f9fc` |
| Accent on light | `#0369a1` |
