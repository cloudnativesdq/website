# Spec Delta

## Purpose

Defines the title, description, canonical URL and link-preview tags that each page publishes, so search results and shared links describe the page that was shared.

## ADDED Requirements

### Requirement: Canonical host is the bare domain
Every canonical URL, `og:url` and absolute metadata URL SHALL use `https://cloudnativesdq.org`. Requests to `https://www.cloudnativesdq.org` SHALL answer with a 308 redirect to the same path on the bare domain.

#### Scenario: Canonical tag
- **WHEN** any page's HTML is fetched
- **THEN** its `<link rel="canonical">` starts with `https://cloudnativesdq.org/` or equals `https://cloudnativesdq.org`

#### Scenario: www redirect
- **WHEN** a client requests `https://www.cloudnativesdq.org/events`
- **THEN** the response is 308 with `Location: https://cloudnativesdq.org/events`

### Requirement: Page-specific Open Graph tags
Each of these routes SHALL publish its own `og:title`, `og:description` and `og:url`, where `og:url` equals the route's canonical URL: `/`, `/events`, `/gallery`, `/team`, `/map`, `/programs`, `/resources`, `/start-a-chapter`, `/contact`. Every route SHALL also publish `og:site_name` "Cloud Native Santo Domingo", `og:locale` `es_DO`, `og:type` `website` and at least one `og:image`.

#### Scenario: Inner page does not inherit home tags
- **WHEN** the HTML of `/programs` is fetched
- **THEN** `og:title` and `og:description` match the page's own title and description, and `og:url` is `https://cloudnativesdq.org/programs`

#### Scenario: Every route has an image
- **WHEN** the HTML of any listed route is fetched, including `/gallery` and `/team`
- **THEN** it contains an `og:image` tag whose URL returns an image with status 200

### Requirement: Page-specific Twitter tags
Each listed route SHALL publish `twitter:card` `summary_large_image` and its own `twitter:title` and `twitter:description`, matching that page's Open Graph title and description.

#### Scenario: Twitter tags follow the page
- **WHEN** the HTML of `/contact` is fetched
- **THEN** `twitter:title` and `twitter:description` describe the contact page, not the home page

### Requirement: Metadata in Spanish
Every page title, meta description, Open Graph text and Twitter text SHALL be written in Spanish.

#### Scenario: Contact description
- **WHEN** the HTML of `/contact` is fetched
- **THEN** its meta description is Spanish text

### Requirement: No keywords meta tag
Pages SHALL NOT publish a `<meta name="keywords">` tag.

#### Scenario: Home head
- **WHEN** the HTML of `/` is fetched
- **THEN** it contains no `meta name="keywords"` tag

### Requirement: No hreflang alternates
Pages SHALL NOT publish `hreflang` alternate links while no separate English URLs exist.

#### Scenario: No alternate languages
- **WHEN** any page's HTML is fetched
- **THEN** it contains no `<link rel="alternate" hreflang=...>` tag
