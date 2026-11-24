# resources-page Specification

## Purpose
Defines the `/resources` page: the certification discounts card at the top (the current LF coupon and time-limited LF promotions) and the learning resources grid below it (which categories of links it offers and how its cards behave), so visitors can find discounts, courses, certifications, learning paths and communities in one place.

## Requirements

### Requirement: Resources grid groups links by category
The `/resources` page SHALL show a "Learn Cloud Native" ("Aprende Cloud Native") grid of link cards with a tab per category: Videos, Free courses, Certifications, Where to learn, Contribute to Kubernetes, Kubernetes blogs and Communities, plus an "All" tab. A tab SHALL be shown only when its category has at least one card, and SHALL show its card count.

#### Scenario: Visitor opens the resources page
- **WHEN** a visitor opens `/resources`
- **THEN** the grid shows the "All" tab and a tab for each category that has cards, each with its count

#### Scenario: Visitor picks a category
- **WHEN** the visitor selects a category tab
- **THEN** the grid shows only that category's cards and the tab is marked selected

### Requirement: Videos tab opens by default
The resources grid SHALL select the Videos tab on load, and SHALL fall back to "All" when there are no videos.

#### Scenario: Videos available
- **WHEN** a visitor opens `/resources` and freeCodeCamp videos are available
- **THEN** the Videos tab is selected

### Requirement: External resource cards open in a new tab
Every card that links outside the site SHALL open in a new tab with `rel="noopener noreferrer"`. Cards that link to a page of this site SHALL open in the same tab.

#### Scenario: External card
- **WHEN** a visitor activates a card that links to another site
- **THEN** the link opens in a new tab

### Requirement: Roadmaps category lists learning paths
The resources grid SHALL include a "Roadmaps" category, labeled "Rutas de aprendizaje" in Spanish, placed after Certifications. It SHALL contain one card per learning path below, each with a one-line description in the visitor's language and its source site as footer.

#### Scenario: Visitor opens the Roadmaps tab
- **WHEN** a visitor selects the Roadmaps tab
- **THEN** the grid shows nine cards linking to `https://roadmap.sh/kubernetes`, `https://roadmap.sh/devops`, `https://roadmap.sh/docker`, `https://roadmap.sh/linux`, `https://roadmap.sh/terraform`, `https://github.com/cncf/trailmap`, `https://maturitymodel.cncf.io/`, `https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/` and `https://landscape.cncf.io/guide`

#### Scenario: Visitor switches language
- **WHEN** the visitor switches between Spanish and English
- **THEN** the tab label and each card's description change to that language

### Requirement: Roadmap cards use only licensed logos
Roadmap cards SHALL show the logo of their project (Kubernetes, CNCF) when the site already hosts it, and a neutral route icon otherwise. The site SHALL NOT show the roadmap.sh mark.

#### Scenario: roadmap.sh card without a project logo
- **WHEN** the visitor views the DevOps, Docker, Linux or Terraform roadmap card
- **THEN** the card shows the neutral route icon

### Requirement: Current LF coupon
The discounts block on `/resources` SHALL show the title and code of the current sale from the techiescamp/linux-foundation-coupon README, with a "Get discount" link to the Linux Foundation certification catalog, and a link to the README as its source.

#### Scenario: Coupon available
- **WHEN** a visitor opens `/resources` and the README lists a sale with a coupon code
- **THEN** the discounts block shows the sale title, the code, and a "Get discount" link to `https://training.linuxfoundation.org/certification-catalog/` that opens in a new tab

### Requirement: Coupon fallback
When the README cannot be fetched or parsed, the discounts block SHALL show a fallback text pointing to the current Linux Foundation coupons instead of a code, and the page SHALL still render.

#### Scenario: README unavailable
- **WHEN** the README request fails or has no coupon in the expected format
- **THEN** the discounts block shows "See the current Linux Foundation coupons." (Spanish: "Consulta los cupones vigentes de la Linux Foundation.") and no "Get discount" button

### Requirement: LF Black Friday 2026 promotion
Until 2026-12-04 23:59:59 in Santo Domingo (UTC-4), the discounts block SHALL show the Linux Foundation Black Friday sale: title, "up to 65% off", the dates Nov 27 – Dec 4, 2026, the official LF poster with descriptive alt text, and a link to `https://training.linuxfoundation.org/` that opens in a new tab. Every string SHALL be available in Spanish and English.

#### Scenario: Before the sale starts
- **WHEN** a visitor opens `/resources` before 2026-11-27 00:00 Santo Domingo time
- **THEN** the promotion says the sale is coming soon ("Próximamente" / "Coming soon") and shows the dates and the link

#### Scenario: During the sale
- **WHEN** a visitor opens `/resources` between 2026-11-27 00:00 and 2026-12-04 23:59 Santo Domingo time
- **THEN** the promotion says the sale is live ("Ya disponible" / "On now") and shows the dates and the link

#### Scenario: Coupon shown alongside
- **WHEN** the promotion is visible and the README lists a coupon
- **THEN** the coupon title, code and "Get discount" link are still shown

### Requirement: Promotion expires
The promotion SHALL NOT be shown from 2026-12-05T04:00:00Z (December 5, 00:00 in Santo Domingo), even when the page HTML was generated before that instant.

#### Scenario: After the sale
- **WHEN** a visitor opens `/resources` at or after 2026-12-05T04:00:00Z
- **THEN** the promotion is not shown and the coupon or its fallback is shown as before
