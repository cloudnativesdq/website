# structured-data Specification

## Purpose
Defines the schema.org JSON-LD the home page publishes for the community, the website and its upcoming events, so search engines can show accurate rich results.

## Requirements

### Requirement: Top-level graph
The home page SHALL publish one JSON-LD script whose `@graph` holds an `Organization`, a `WebSite` and one `Event` per upcoming event as sibling top-level nodes. Events SHALL NOT be nested inside the Organization.

#### Scenario: Graph shape
- **WHEN** the home page has two upcoming events
- **THEN** its JSON-LD `@graph` contains one `Organization`, one `WebSite` and two `Event` nodes, and the Organization has no `event` property

#### Scenario: No upcoming events
- **WHEN** there are no upcoming events
- **THEN** the `@graph` contains the `Organization` and `WebSite` only and still parses as valid JSON-LD

### Requirement: Organization logo is a raster image
The Organization `logo` SHALL be an absolute URL to a PNG of at least 112x112 pixels on the site's host.

#### Scenario: Logo URL
- **WHEN** the JSON-LD is parsed
- **THEN** `logo` is `https://cloudnativesdq.org/brand/icon-512.png`, and that URL returns a 512x512 PNG

### Requirement: Organization names
The Organization SHALL have `name` "Cloud Native Santo Domingo" and `alternateName` "Cloud Native SDQ".

#### Scenario: Typo removed
- **WHEN** the JSON-LD is parsed
- **THEN** `alternateName` is "Cloud Native SDQ" and the string "CNCD" appears nowhere

### Requirement: WebSite node
The `WebSite` node SHALL state the site name "Cloud Native Santo Domingo", URL `https://cloudnativesdq.org`, `inLanguage` `es` and a `publisher` reference to the Organization.

#### Scenario: Publisher reference
- **WHEN** the JSON-LD is parsed
- **THEN** the WebSite's `publisher` `@id` equals the Organization's `@id`

### Requirement: Event organizer and offers
Each `Event` SHALL reference the Organization as `organizer` and include an `offers` object with `price` `0`, a `priceCurrency`, the event URL and `availability` `https://schema.org/SoldOut` when the event is sold out, else `https://schema.org/InStock`.

#### Scenario: Sold-out event
- **WHEN** an upcoming event is marked sold out
- **THEN** its `offers.availability` is `https://schema.org/SoldOut`

#### Scenario: Organizer reference
- **WHEN** the JSON-LD is parsed
- **THEN** each Event's `organizer` `@id` equals the Organization's `@id`

### Requirement: Event dates
An Event's `startDate` SHALL be the event's real start: an ISO 8601 date-time with offset when the source provides a time, otherwise a date-only value. `endDate` SHALL be the real end time when the source provides one and SHALL be omitted otherwise. `endDate` SHALL NOT equal `startDate`.

#### Scenario: Source with end time
- **WHEN** a Luma event starts 2026-11-12T18:00-04:00 and ends 2026-11-12T21:00-04:00
- **THEN** its `startDate` and `endDate` carry those instants

#### Scenario: Source without end time
- **WHEN** an event's source gives only a start date
- **THEN** the Event has a `startDate` and no `endDate`

### Requirement: Attendance mode matches location
An Event whose location mentions "virtual" or "online" (case-insensitive) SHALL use `eventAttendanceMode` `https://schema.org/OnlineEventAttendanceMode` and a `VirtualLocation` with the event URL. Any other event SHALL use `https://schema.org/OfflineEventAttendanceMode` and a `Place` with a Santo Domingo, DO postal address.

#### Scenario: Virtual event
- **WHEN** an event's location is "Virtual"
- **THEN** its attendance mode is `OnlineEventAttendanceMode` and its location is a `VirtualLocation`

#### Scenario: In-person event
- **WHEN** an event's location is "Banreservas, Santo Domingo"
- **THEN** its attendance mode is `OfflineEventAttendanceMode` and its location is a `Place`
