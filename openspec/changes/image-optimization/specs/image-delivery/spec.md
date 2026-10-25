# Spec Delta

## Purpose

Defines how the site sizes, encodes and serves images so each device downloads only what it displays, without breaking images from sources that need special headers.

## ADDED Requirements

### Requirement: Responsive image sizes
Images rendered by the site from local files or allowed remote hosts SHALL be served at a width close to their displayed size for the device, in a modern format (AVIF or WebP) when the browser supports it.

#### Scenario: Gallery on a phone
- **WHEN** a Pixel 7-sized browser loads `/gallery`
- **THEN** no gallery image response is wider than 2x its displayed CSS width, and the page's total image transfer is under 1.5MB

### Requirement: OCG images keep loading
Event and organizer images from ocgroups.dev SHALL keep loading after optimization is enabled.

#### Scenario: OCG event image
- **WHEN** the home page shows an upcoming OCG event with an image
- **THEN** the image loads with status 200 and does not fall back to the placeholder
