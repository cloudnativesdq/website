# Spec Delta

## Purpose

Defines what the `/resources` page offers visitors. This change covers its certification discounts block: the current Linux Foundation coupon and time-limited Linux Foundation sales.

## ADDED Requirements

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
