# Spec Delta

## Purpose

Defines the branded image each public route publishes for link previews, so a shared link shows the community's identity and the page it opens, within the size limits of messaging apps.

## ADDED Requirements

### Requirement: Every route publishes its own preview image
Each of `/`, `/events`, `/team`, `/gallery`, `/programs`, `/resources`, `/map`, `/start-a-chapter` and `/contact` SHALL publish `og:image`, `og:image:width` 1200, `og:image:height` 630, `og:image:type` `image/png` and a non-empty `og:image:alt`, plus a `twitter:image` with the same URL. Each route's image SHALL be distinct from every other route's.

#### Scenario: Inner route has its own image
- **WHEN** the HTML of `/team` is fetched
- **THEN** its `og:image` URL belongs to the team route and differs from the home `og:image` URL

#### Scenario: Twitter image matches
- **WHEN** the HTML of any listed route is fetched
- **THEN** `twitter:image` equals `og:image`

### Requirement: Image format and weight
Every preview image SHALL be a PNG of exactly 1200x630 pixels and SHALL be smaller than 300KB.

#### Scenario: Under WhatsApp limit
- **WHEN** a client downloads the `og:image` of any listed route
- **THEN** the body is a 1200x630 PNG of fewer than 307200 bytes

### Requirement: Home preview content
The home image SHALL show, on a navy left panel, the mark, the name "Cloud Native Santo Domingo", the headline "La comunidad Cloud Native de RD" with "Cloud Native" in the accent cyan, and a one-line description; the right side SHALL show the consented community photo. Its alt text SHALL describe the community in Spanish.

#### Scenario: Home layout
- **WHEN** a reviewer opens the home preview image
- **THEN** the mark, name, headline and description are on the left over navy, and the community photo fills the right side

### Requirement: Home headline has no orphan word
No line of the rendered home headline SHALL contain only one word.

#### Scenario: Last line
- **WHEN** a reviewer opens the home preview image
- **THEN** "RD" shares its line with at least one other word

### Requirement: Inner page preview content
Each inner route image SHALL show the mark and name, an uppercase eyebrow naming the section, the page title in Spanish, the page URL without protocol (for example `cloudnativesdq.org/events`), and a large low-opacity mark at the bottom right, on navy.

#### Scenario: Events image
- **WHEN** a reviewer opens the `/events` preview image
- **THEN** it shows the eyebrow "EVENTOS", the title "Próximos meetups y charlas" and `cloudnativesdq.org/events`

### Requirement: Brand strip
Every preview image SHALL end with a thin bottom strip of cyan, ultramarine and vermillion in that order, with a navy gap between cyan and ultramarine and between ultramarine and vermillion, so ultramarine and vermillion never touch.

#### Scenario: Strip colors
- **WHEN** a reviewer samples the bottom row of any preview image from left to right
- **THEN** it reads cyan, navy, ultramarine, navy, vermillion

### Requirement: Brand constraints
Preview images SHALL NOT contain CNCF or Kubernetes marks, the Dominican flag's cross or quarters, the coat of arms or the island outline.

#### Scenario: Asset review
- **WHEN** a reviewer inspects all nine images
- **THEN** none contains any listed symbol

### Requirement: Static default image retired
The site SHALL NOT serve `/og-image.jpg`, and no metadata SHALL reference it.

#### Scenario: Old URL gone
- **WHEN** a client fetches `/og-image.jpg`
- **THEN** the response status is 404
