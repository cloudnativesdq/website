# Proposal

## Why

The contact form (`src/app/actions/send-email.ts`) can be abused today:
- It puts the visitor's name, email and message into the email HTML without escaping, so anyone can send organizers@cloudnativesdq.org email with arbitrary HTML and links (phishing that looks internal).
- It has no spam protection, so a bot can drain the Resend quota or flood the inbox.
- It does not check length or email format before using the address as `replyTo`.
- It returns raw server errors such as "Server configuration error: Missing API Key" to the browser, and `ContactView` displays them verbatim.

## What Changes

- Send the email as plain text instead of HTML. That removes the injection with no escaping code.
- Validate on the server: trim every field. Name 1–100 characters, email at most 254 characters and shaped like an address, message 10–5000 characters. Remove line breaks from the name before it goes into the subject.
- Add bot friction with no new dependency:
  - A hidden honeypot field. A filled honeypot is answered "success" and nothing is sent.
  - A minimum fill time of 3 seconds, carried in a hidden field.
  - A Vercel Firewall rate-limit rule on contact form submissions, set by the maintainer in the dashboard.
- Return error codes only (`invalid`, `unavailable`). `ContactView` maps them to translated messages. Details are logged on the server.
- Associate each form label with its input (`htmlFor`/`id`) and set `maxLength`/`minLength` so the browser enforces the same limits.

## Capabilities

### New Capabilities

- `contact-form`: how the site accepts a contact message, validates it, resists automated abuse and delivers it to the organizers.

### Modified Capabilities

None. No specs exist yet.

## Impact

- Edited: `src/app/actions/send-email.ts`, `src/components/ContactView.tsx`, `src/lib/translations.ts` (new error strings, es and en).
- External: Vercel Firewall custom rule (manual, maintainer).
- Email format changes from HTML to plain text for the organizers. The content is the same.
- Independent of the other pending changes. `brand-identity-assets` also edits the sender display name in `send-email.ts`. Whichever lands second rebases a one-line conflict. Recommended order: right after `contributor-workflow`, because this one fixes a live risk.
