# Spec Delta

## Purpose

Defines the Cloud Native Santo Domingo mark, its approved variants and lockup, where the site shows them, and the color rules that keep the brand distinct from CNCF and Dominican national symbols.

## ADDED Requirements

### Requirement: Mark vector source
The repository SHALL contain the approved wave mark as an SVG with a 64x64 viewBox, using cyan `#0ea8e6` for the curl and end node, light cyan `#7ad8fa` for the inner swell and vermillion `#ce1126` for the crest dot. Every raster brand asset SHALL be generated from this file.

#### Scenario: Source file present and unchanged in color
- **WHEN** a reviewer opens the mark SVG
- **THEN** its viewBox is `0 0 64 64` and its only fills and strokes are `#0ea8e6`, `#7ad8fa` and `#ce1126`

#### Scenario: Rasters trace back to the source
- **WHEN** the icon generation command runs after the SVG changes
- **THEN** every brand PNG and the ICO are rewritten from the SVG with no manual editing step

### Requirement: One-color mark variant
The repository SHALL contain a one-color variant of the mark that uses `currentColor` for every shape, so it takes the color of the surrounding text.

#### Scenario: Variant follows text color
- **WHEN** the one-color SVG is inlined inside an element with `color: #ffffff`
- **THEN** every shape of the mark renders white

### Requirement: Lockup in navbar and footer
The navbar and the footer SHALL show the lockup: the mark followed by "Cloud Native Santo Domingo" set in Space Grotesk weight 700. The lockup SHALL link to `/` and expose the accessible name "Cloud Native Santo Domingo".

#### Scenario: Navbar shows the lockup
- **WHEN** any page loads
- **THEN** the navbar's home link contains the mark and the text "Cloud Native Santo Domingo", and the old "Cloud Native SDQ" wordmark is gone

#### Scenario: Footer shows the lockup
- **WHEN** any page is scrolled to the footer
- **THEN** the footer's home link contains the mark and the text "Cloud Native Santo Domingo"

#### Scenario: Narrow viewport
- **WHEN** the page is viewed at 360px wide
- **THEN** the navbar lockup causes no horizontal page scroll

#### Scenario: Mark is decorative inside the link
- **WHEN** a screen reader reads the navbar home link
- **THEN** it announces "Cloud Native Santo Domingo" once, not the mark as a separate image

### Requirement: Community name usage
Every visible surface (lockup, footer copyright, email sender name, page titles) SHALL use the name "Cloud Native Santo Domingo". The short form "Cloud Native SDQ" (or "CN SDQ" where at most 12 characters fit) SHALL appear only where a short name is required, such as the manifest `short_name` or a schema.org `alternateName`. No variant such as "CNCD SDQ" SHALL appear.

#### Scenario: Footer copyright
- **WHEN** any page's footer renders
- **THEN** the copyright line reads "© <year> Cloud Native Santo Domingo"

#### Scenario: Contact email sender
- **WHEN** the contact form sends an email
- **THEN** the sender display name is "Cloud Native Santo Domingo"

#### Scenario: No stray variants
- **WHEN** a reviewer searches `src/` for "CNCD"
- **THEN** there are no matches

### Requirement: Event image placeholder
When an event has no image or its image fails to load, the event card SHALL show a placeholder of the mark centered on navy that is not cropped at any card size. Organizer avatars without a photo SHALL show the mark icon.

#### Scenario: Wide mobile card
- **WHEN** an event card without an image renders full width on a 412px-wide viewport
- **THEN** the whole mark is visible, centered on navy, with no part cut off

#### Scenario: Broken image URL
- **WHEN** an event image URL returns 404
- **THEN** the card switches to the placeholder

### Requirement: Branded 404 and error pages
The not-found page and the route error page SHALL render inside the same navbar and footer as other pages, with Spanish copy (English when the visitor chose English), a link back to `/`, and no console error logged for a not-found visit. The route error page SHALL offer a retry action.

#### Scenario: Unknown URL
- **WHEN** a visitor opens `/no-existe`
- **THEN** the response is 404, the page shows the navbar lockup, a Spanish "page not found" message and a link to `/`, and the browser console has no error from the site

#### Scenario: Render error
- **WHEN** a page throws during rendering
- **THEN** the error page shows the navbar, a Spanish message and a "Reintentar" button that re-renders the route

### Requirement: Skip to content
Every page SHALL start with a keyboard-focusable "Saltar al contenido" link that becomes visible on focus and moves focus to the main content.

#### Scenario: Keyboard user
- **WHEN** a keyboard user presses Tab once on any page
- **THEN** the skip link is visible and focused, and pressing Enter moves focus to the page's `<main>`

### Requirement: Protected symbols excluded
No brand asset SHALL contain CNCF or Kubernetes marks, the Dominican flag's cross or quarters, the coat of arms, or the island outline.

#### Scenario: Asset review
- **WHEN** a reviewer inspects the mark, its variant, the lockup and every generated icon
- **THEN** none of them contains any of the listed symbols

### Requirement: Ultramarine and vermillion never touch
Brand assets SHALL NOT place heritage ultramarine `#002d72` directly adjacent to heritage vermillion `#ce1126`; another color or empty space SHALL separate them.

#### Scenario: Icon on navy background
- **WHEN** a generated icon places the mark on a navy background
- **THEN** the vermillion dot touches only navy, never ultramarine

### Requirement: Accent tokens meet contrast floor
Text on the accent color SHALL have a contrast ratio of at least 4.5:1 in both themes. The dark theme `--text-on-accent` SHALL be `#04202f` on accent `#0ea8e6`. The light theme `--accent` SHALL be `#0369a1` with white text, and the light `--accent-hover` SHALL differ from `--accent`. The site stylesheet and the design-system tokens SHALL hold the same values.

#### Scenario: Dark theme primary button
- **WHEN** a primary button renders in the dark theme
- **THEN** its label color is `#04202f` on `#0ea8e6` (6.20:1)

#### Scenario: Light theme primary button
- **WHEN** a primary button renders in the light theme
- **THEN** its background is `#0369a1` and its white label measures 5.93:1

#### Scenario: Light hover stays visible
- **WHEN** a primary button is hovered in the light theme
- **THEN** its background changes to a color other than `#0369a1`

#### Scenario: Tokens stay in sync
- **WHEN** a reviewer compares `src/app/globals.css` with `_ds/style-guide/tokens/colors.css`
- **THEN** both resolve the accent and on-accent tokens to the same hex values in each theme
