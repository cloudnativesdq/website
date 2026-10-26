# Spec Delta

## Purpose

Defines the icons, web app manifest and theme color that browsers, search engines and operating systems read from the site, so every tab, bookmark and home-screen shortcut shows the community mark.

## ADDED Requirements

### Requirement: Browser favicon
The site SHALL serve `/favicon.ico` containing the small-size icon at 16x16, 32x32 and 48x48, and the small-size icon as SVG, both announced in the document head of every page.

#### Scenario: ICO sizes
- **WHEN** a client fetches `/favicon.ico`
- **THEN** the response is an ICO file with exactly three images: 16x16, 32x32 and 48x48

#### Scenario: SVG icon link
- **WHEN** any page's HTML is fetched
- **THEN** the head contains a `rel="icon"` link with `type="image/svg+xml"` that resolves to the small-size icon SVG with status 200

### Requirement: Apple touch icon
The site SHALL serve a 180x180 PNG apple touch icon showing the small-size icon on a solid, fully opaque navy (`#090d16`) background, announced with `rel="apple-touch-icon"`.

#### Scenario: Opaque background
- **WHEN** a client fetches the apple touch icon
- **THEN** it is a 180x180 PNG whose every pixel has full alpha

### Requirement: Web app manifest
The site SHALL serve a web app manifest linked from every page, with name "Cloud Native Santo Domingo", short name "CN SDQ" (at most 12 characters, so launchers do not truncate it), `start_url` `/`, a navy background color, and icons at 192x192 and 512x512 with purpose `any` plus one 512x512 icon with purpose `maskable`.

#### Scenario: Manifest content
- **WHEN** a client fetches the manifest URL from the page's `rel="manifest"` link
- **THEN** the JSON lists the 192 and 512 `any` icons and the 512 `maskable` icon, and every icon URL returns a PNG of the declared size

### Requirement: Maskable icon safe zone
The maskable icon SHALL keep the entire mark inside the central circle whose diameter is 80% of the icon, on a fully opaque navy background.

#### Scenario: Circular mask
- **WHEN** the maskable icon is cropped to a centered circle of 409.6px diameter
- **THEN** no part of the mark is cut off

### Requirement: Theme color
Every page SHALL declare `theme-color` meta tags: navy `#090d16` for the dark color scheme and `#f7f9fc` for the light color scheme.

#### Scenario: Meta tags present
- **WHEN** any page's HTML is fetched
- **THEN** the head contains `<meta name="theme-color">` tags with `media="(prefers-color-scheme: dark)"` set to `#090d16` and `media="(prefers-color-scheme: light)"` set to `#f7f9fc`

### Requirement: Placeholder assets removed
The site SHALL NOT serve the placeholder favicon or the generic community-group logo, and SHALL NOT declare icons other than those in this spec.

#### Scenario: Old URLs gone
- **WHEN** a client fetches `/favicon.svg` or `/images/logo.png`
- **THEN** the response status is 404

#### Scenario: No stale references
- **WHEN** a reviewer searches the source for `favicon.svg` and `images/logo.png`
- **THEN** no code references either path, and image fallbacks that used `images/logo.png` show a brand asset instead (see the event image placeholder requirement in `brand-identity`)
