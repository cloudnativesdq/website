# Spec Delta

## Purpose

Defines how the contact form accepts, validates and delivers a visitor's message to the organizers, and how it resists injection and automated abuse.

## ADDED Requirements

### Requirement: Plain-text delivery
The organizers' email SHALL be plain text containing the visitor's name, email and message exactly as submitted after trimming, with no HTML part. The visitor's email SHALL be the reply-to address.

#### Scenario: HTML in message
- **WHEN** a visitor submits a message containing `<a href="https://evil.example">Verify account</a>`
- **THEN** the organizers receive that text literally, not a rendered link

### Requirement: Server-side validation
The server SHALL reject a submission unless, after trimming: the name has 1–100 characters, the email has at most 254 characters and matches `local@domain.tld`, and the message has 10–5000 characters. Line breaks in the name SHALL be replaced by spaces before the name is used in the subject. Rejected submissions SHALL send nothing.

#### Scenario: Oversized message
- **WHEN** a submission carries a 6000-character message
- **THEN** no email is sent and the response is the `invalid` error

#### Scenario: Malformed email
- **WHEN** the email field is `not-an-email`
- **THEN** no email is sent and the response is the `invalid` error

#### Scenario: Newline in name
- **WHEN** the name is `Ana\r\nBcc: x@y.z`
- **THEN** the subject contains `Ana Bcc: x@y.z` on one line

### Requirement: Bot friction
A submission whose hidden honeypot field is non-empty, or that arrives less than 3 seconds after the form was rendered, SHALL send nothing and SHALL receive the same success response as a real submission.

#### Scenario: Honeypot filled
- **WHEN** a bot fills every field including the hidden one
- **THEN** the response is success and no email is sent

#### Scenario: Instant submit
- **WHEN** a submission arrives 500 ms after the form rendered
- **THEN** the response is success and no email is sent

#### Scenario: Real visitor
- **WHEN** a visitor fills the visible fields and submits after 10 seconds
- **THEN** the email is sent

### Requirement: Rate limit
Contact form submissions SHALL be rate-limited per client IP at the edge, at most 5 per 10 minutes, with excess requests rejected before they reach the server action.

#### Scenario: Burst
- **WHEN** one IP submits the form 6 times within 10 minutes
- **THEN** the sixth request is rejected with status 429 and no email is sent

### Requirement: Generic error responses
The server SHALL answer failures with a code only: `invalid` for validation failures and `unavailable` for configuration or delivery failures. The form SHALL show a translated message for each code and SHALL never display server error text. Details SHALL be logged on the server.

#### Scenario: Missing API key
- **WHEN** `RESEND_API_KEY` is unset and a valid message is submitted
- **THEN** the visitor sees the translated "unavailable" message, the page shows no mention of the key, and the server log records the cause

### Requirement: Accessible form fields
Each visible input SHALL have a programmatically associated label, and SHALL declare the same length limits as the server, so the browser validates before submitting. The honeypot SHALL be hidden from sighted users and assistive technology and SHALL be skipped by keyboard focus.

#### Scenario: Screen reader
- **WHEN** a screen reader focuses the name input
- **THEN** it announces the field's label

#### Scenario: Keyboard
- **WHEN** a keyboard user tabs through the form
- **THEN** focus never lands on the honeypot
