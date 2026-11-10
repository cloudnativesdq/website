# Proposal

## Why

The site links to the CNCF Slack workspace in general, not to the chapter's channel. Visitors who join Slack then have to find `#cloud-native-santo-domingo` themselves.

## What Changes

- Add `links.slackChannel` (`https://cloud-native.slack.com/archives/C08HTR95K17`) in `src/lib/links.ts`.
- The Slack entries in the navbar "Join" menu and the footer link to the channel and are labeled "Slack: #cloud-native-santo-domingo" in both languages.
- The Resources page keeps the workspace invite (`https://slack.cncf.io/`) so people without an account can join.

## Capabilities

### New Capabilities

- `community-links`: where the site's community links (Slack) point and how they are labeled.

### Modified Capabilities

None.

## Impact

- Edited: `src/lib/links.ts`, `src/lib/translations.ts`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`.
