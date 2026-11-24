# Design

## Context

`ResourcesView` builds a flat list of cards and a list of categories and hands both to the shared `CardGrid`. Static links live in `src/lib/links.ts`; strings in `src/lib/translations.ts`. A card without `image` shows its category's logo.

## Goals / Non-Goals

**Goals:** add the Roadmaps category with the same card pattern, no new UI.

**Non-Goals:** fetching roadmaps dynamically, translating the resources' proper names, a separate roadmaps page.

## Decisions

- **Same pattern as the platforms and certs cards.** Each roadmap is a static `CardItem` with `category: "roadmaps"`. URLs go in `links.ts`, descriptions in `translations.ts` under `resourcesGrid.roadmapNotes`. Titles are the resources' own names ("Kubernetes Roadmap", "CNCF Trail Map"), like "KodeKloud" or "Killercoda", so they are not translated.
- **No roadmap.sh logo.** The developer-roadmap repository reserves all rights to its images, so the site does not host its mark. roadmap.sh cards without a project logo omit `image` and fall back to the category logo, a Lucide "route" icon (ISC, already a dependency through `lucide-react`) saved as `public/logos/route.svg`: the primary color (`#0ea8e6`) on a dark rounded tile, since `<img>` cannot use `currentColor` and a bare cyan icon disappears on the selected (primary) tab. Alternative considered: reuse `cncf.svg` or `kubernetes.png`, rejected because it would attribute Docker, Linux and Terraform roadmaps to the wrong project.
- **Placement after Certifications.** Learning paths sit between "what to certify" and "where to learn".

## Risks / Trade-offs

- [The route icon has fixed colors for both themes] → the dark tile keeps it readable on dark, light and selected-tab backgrounds; it is decorative (`alt=""`).
- [Third-party URLs move] → They are plain links in `links.ts`, one line each to fix.
