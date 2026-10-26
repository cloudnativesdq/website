# sitemap Specification

## Purpose
Defines which URLs `/sitemap.xml` lists, so search engines discover every public page on the site's own host and nothing outside it.

## Requirements

### Requirement: Sitemap lists every public page
`/sitemap.xml` SHALL list exactly these URLs: `https://cloudnativesdq.org`, and `https://cloudnativesdq.org` followed by `/events`, `/gallery`, `/team`, `/map`, `/programs`, `/resources`, `/start-a-chapter` and `/contact`.

#### Scenario: New pages present
- **WHEN** a client fetches `/sitemap.xml`
- **THEN** it contains `<loc>` entries for `/events`, `/gallery` and `/team`

### Requirement: Sitemap lists only own-host URLs
Every `<loc>` in `/sitemap.xml` SHALL start with `https://cloudnativesdq.org`. Event pages hosted on other domains SHALL NOT appear.

#### Scenario: External events excluded
- **WHEN** a client fetches `/sitemap.xml` while upcoming events exist on luma.com and ocgroups.dev
- **THEN** no `<loc>` contains `luma.com`, `lu.ma` or `ocgroups.dev`

#### Scenario: Event source offline
- **WHEN** the event data source fails during sitemap generation
- **THEN** `/sitemap.xml` still returns status 200 with the full list of own pages
