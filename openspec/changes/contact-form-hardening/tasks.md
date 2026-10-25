# Tasks

## 1. Server action

- [ ] 1.1 Switch `send-email.ts` from `html` to `text` (labels + message) and strip line breaks from the name in the subject; verify by sending a test message containing `<a href=…>` from local dev with a Resend test key and seeing the literal text in the inbox
- [x] 1.2 Add trimmed-field reading, length limits and the email regex; return `{ error: 'invalid' }` with nothing sent on failure; verify a temporary assertion-based `demo()` (or e2e call) rejects a 6000-char message, `not-an-email` and an empty name, and accepts a valid submission
- [x] 1.3 Add the honeypot (`hp`) and timing (`t`, 3 s) checks returning `{ success: true }` without sending, with a `ponytail:` comment naming the ceiling; verify both bot cases send nothing and a 10-second real submit sends
- [x] 1.4 Replace raw error returns with `'unavailable'` plus a server `console.error`; verify with `RESEND_API_KEY` unset that the response body contains no key name

## 2. Form

- [x] 2.1 In `ContactView.tsx`: add `id`/`htmlFor` pairs, `maxLength`/`minLength` matching the server, the off-screen honeypot (`tabIndex={-1}`, `aria-hidden`, `autoComplete="off"`), and the hidden `t` field from `useState(() => Date.now())`; verify keyboard Tab skips the honeypot and a screen reader (or the DevTools accessibility tree) shows each input's label
- [x] 2.2 Map `result.error` codes to new `t.contactErrors.invalid` / `t.contactErrors.unavailable` strings (es and en) and never render server text; verify each code shows its translated message in both languages

## 3. Tests

- [x] 3.1 Add e2e tests in `tests/e2e/site.spec.ts` for `/contact`: labels are associated (`getByLabel` finds each input), the honeypot is not focusable, and a submission with the honeypot filled shows success without calling Resend (no `RESEND_API_KEY` in CI makes a real send impossible, so success proves the short-circuit); verify `pnpm test:e2e` passes

## 4. Edge rate limit (maintainer, manual)

- [ ] 4.1 Maintainer: in Vercel → Firewall → Custom rules, add "Contact form rate limit": path equals `/contact`, method `POST`, header `next-action` exists, rate limit 5 per 10 minutes per IP, action deny; verify six quick submissions from one IP on production return 429 on the sixth

## 5. Integration

- [x] 5.1 Run `pnpm lint`, `pnpm exec tsc --noEmit -p .`, `pnpm build` and `pnpm test:e2e`; all pass
- [ ] 5.2 After deploy, send one real message from the live site; verify organizers@ receives a plain-text email with the correct reply-to
- [ ] 5.3 As the last commit of this PR, run `pnpm exec openspec archive contact-form-hardening`; verify `openspec list --specs` shows `contact-form` and strict validation passes
