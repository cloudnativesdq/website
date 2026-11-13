## ADDED Requirements

### Requirement: Partners page
The site SHALL serve `/partners`, listing each partner community with its logo, name, a description in the visitor's language and a link that opens the community's site in a new tab. The partners are AAIF Community Santo Domingo (`https://luma.com/aaif-santodomingo`) and Hard Devs Community (`https://community.harddevs.com/`).

#### Scenario: Visitor opens the page
- **WHEN** a visitor opens `/partners`
- **THEN** the page shows a card with the logo, name, description and link for AAIF Community Santo Domingo and for Hard Devs Community

#### Scenario: Navigation
- **WHEN** a visitor opens the navbar "Community" menu or reads the footer
- **THEN** both contain a link to `/partners`

#### Scenario: Join as a partner
- **WHEN** a visitor clicks "Join as a partner community" on `/partners`
- **THEN** their mail client opens a message to organizers@cloudnativesdq.org with a partner-community subject

#### Scenario: Luma link
- **WHEN** a partner has a Luma calendar separate from its website
- **THEN** its card also links to that calendar (Hard Devs: `https://luma.com/harddevscommunity`)

### Requirement: Partners page SEO
`/partners` SHALL have its own title, description, canonical URL `https://cloudnativesdq.org/partners` and Open Graph image, SHALL be listed in the sitemap, and SHALL publish JSON-LD with one `Organization` per partner giving its name, URL and an absolute logo URL.

#### Scenario: Structured data
- **WHEN** the JSON-LD of `/partners` is parsed
- **THEN** it contains an `Organization` named "AAIF Community Santo Domingo" with `url` `https://luma.com/aaif-santodomingo`, and one named "Hard Devs Community" with `url` `https://community.harddevs.com/`

### Requirement: Partner events
The site SHALL merge the upcoming events listed on the AAIF Community Santo Domingo Luma calendar into its upcoming events, badged "AAIF". Hard Devs events SHALL NOT be loaded. A failed calendar fetch SHALL NOT break the page; that partner's events are omitted.

#### Scenario: AAIF event
- **WHEN** the AAIF calendar lists an upcoming event
- **THEN** it appears in the site's upcoming events with the "AAIF" badge and a link to its Luma page

#### Scenario: Calendar unavailable
- **WHEN** a partner's Luma calendar returns an error
- **THEN** the events page renders with the other events and no partner events from that calendar

### Requirement: Luma event images are resized
Event images hosted on `images.lumacdn.com` SHALL be requested through Luma's image CDN at a width of at most 800px in a browser-negotiated format, not as the original upload.

#### Scenario: Event cover
- **WHEN** an event card shows a Luma cover
- **THEN** its image URL starts with `https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=scale-down,quality=75,width=800/`
