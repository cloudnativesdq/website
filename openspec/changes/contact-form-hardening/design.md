# Design

## Context

- `sendEmail(formData)` is a server action called from `ContactView` (client). It reads `name`, `email` and `message` with `as string`, checks only that they are non-empty, and sends with Resend's `html` option, interpolating raw input. On failure it returns `{ error: <raw text> }`, which `ContactView` shows through `setErrorMessage(result.error)`.
- Labels in `ContactView` are sibling `<label>` elements with no `htmlFor`. Inputs have `required` only.
- Server actions are public POST endpoints at the page URL (`/contact`) carrying a `Next-Action` header. Any client can call one directly, bypassing the form.
- No dependencies for validation or CAPTCHA are installed. `zod` was removed in an earlier cleanup and `resend` is present.

## Goals / Non-Goals

**Goals:**
- Close the injection with the least code.
- Stop casual bots without adding a third-party widget for visitors.

**Non-Goals:**
- CAPTCHA or Turnstile. Add it if the honeypot, timing check and rate limit prove insufficient.
- Storing messages, or confirmation emails to the visitor.

## Decisions

**Plain text instead of escaping.** Resend accepts `text`. Sending `text` with lines `Nombre: …`, `Email: …`, a blank line, then the message removes every HTML context, so no escape helper is needed. Alternative: escape `& < > " '` into the HTML. Rejected because it is more code for a worse failure mode (one missed field reopens the hole).

**Validation inline in the action.** A `field(formData, key)` helper returns a trimmed string (non-string becomes `''`), followed by length checks and one regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. That is about 15 lines and needs no schema library. The email regex is deliberately loose: Resend rejects undeliverable addresses anyway, and the goal is to stop junk in `replyTo`.

**Honeypot and timing.** The form adds `<input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true">` inside a wrapper with `className="absolute -left-[9999px]"` (not `display:none`, which some bots skip), and `<input type="hidden" name="t" value={renderedAt}>`. `renderedAt` is `Date.now()` captured with `useState(() => Date.now())` on mount. The server answers `{ success: true }` without sending when `company` is non-empty or `Date.now() - Number(t) < 3000`. A missing or non-numeric `t` also counts as a bot. Answering success avoids teaching bots which check they failed. A real visitor cannot type a valid 10-character message in under 3 seconds, so the threshold has margin. `t` comes from the client and a scripted bot can forge it; the rate limit covers that case. `// ponytail:` comment in code: timing and honeypot stop naive bots only; add Turnstile if spam gets through.

**Rate limit at the edge, not in code.** A Vercel Firewall custom rule: path `/contact`, method `POST`, header `next-action` present, rate limit 5 requests per 10 minutes per IP, action deny (429). It blocks traffic before it reaches the function and needs no code or store. Alternative: an in-memory per-instance counter. Rejected because Fluid Compute runs several instances, so the counter would leak, and a durable store would add a dependency. The rule is a dashboard setting, so the task records exactly what to enter.

**Error codes.** The action returns `{ success: true } | { error: 'invalid' | 'unavailable' }` and logs details with `console.error` first. `ContactView` shows `t.contactErrors[result.error] ?? t.errorMessage`. New strings:
- es: `invalid` "Revisa los campos: nombre, un correo válido y un mensaje de al menos 10 caracteres."; `unavailable` "No pudimos enviar tu mensaje ahora. Escríbenos a organizers@cloudnativesdq.org."
- en: equivalent English strings.

**Form attributes.** `id`/`htmlFor` pairs (`contact-name`, `contact-email`, `contact-message`), plus `maxLength={100}`, `maxLength={254}`, `minLength={10} maxLength={5000}`, matching the server limits.

## Risks / Trade-offs

- [Organizers lose HTML formatting] → The old HTML was three labels and paragraphs. Plain text with labels carries the same information.
- [Forged timing field] → Covered by the edge rate limit. Turnstile is the next step.
- [Firewall rule availability depends on the Vercel plan] → Custom rules with rate limiting exist on current plans. If the plan lacks it, the task notes that, and the code-level checks still apply.
- [Visitors with JavaScript disabled] → The form already requires JavaScript (`onSubmit` + server action call). Unchanged.

## Migration Plan

One PR. After deploy, the maintainer adds the firewall rule and sends one test message from the live site. Rollback = revert. The firewall rule can stay.
