# site-language Specification

## Purpose
Defines which language each page renders in, how a visitor's language choice persists, and how the document declares its language to browsers and assistive technology.

## Requirements

### Requirement: Content visible without JavaScript
Every page's main content SHALL be visible in the server-rendered HTML, with no wrapper that hides it until client JavaScript runs.

#### Scenario: JavaScript disabled
- **WHEN** a visitor loads `/events` with JavaScript disabled
- **THEN** the page heading and navigation are visible

### Requirement: Document language matches content
The `lang` attribute of `<html>` SHALL equal the language of the text currently shown (`es` or `en`), including after the visitor switches language.

#### Scenario: Switch to English
- **WHEN** a visitor switches the toggle to English
- **THEN** `<html lang>` becomes `en` without a reload

### Requirement: Language choice persists
A visitor's explicit language choice SHALL persist across pages and visits. Without a choice, Spanish SHALL be the default unless the browser prefers English.

#### Scenario: Return visit
- **WHEN** a visitor who chose English returns the next day
- **THEN** pages show English text
