## MODIFIED Requirements

### Requirement: Event organizer and offers
Each `Event` SHALL reference the Organization as `organizer`, except partner community events, whose `organizer` SHALL be an `Organization` with the partner's name and URL. Each `Event` SHALL include an `offers` object with `price` `0`, a `priceCurrency`, the event URL and `availability` `https://schema.org/SoldOut` when the event is sold out, else `https://schema.org/InStock`.

#### Scenario: Sold-out event
- **WHEN** an upcoming event is marked sold out
- **THEN** its `offers.availability` is `https://schema.org/SoldOut`

#### Scenario: Organizer reference
- **WHEN** the JSON-LD is parsed
- **THEN** each Event that is not a partner event has an `organizer` `@id` equal to the Organization's `@id`

#### Scenario: Partner event organizer
- **WHEN** an upcoming event comes from the AAIF Community Santo Domingo calendar
- **THEN** its `organizer` is an `Organization` named "AAIF Community Santo Domingo" with `url` `https://luma.com/aaif-santodomingo`
