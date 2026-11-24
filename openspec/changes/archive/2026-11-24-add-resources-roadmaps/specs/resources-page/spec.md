# Spec Delta

## Purpose

Defines the learning resources grid on `/resources`: which categories of links it offers and how its cards behave, so visitors can find courses, certifications, learning paths and communities in one place.

## ADDED Requirements

### Requirement: Resources grid groups links by category
The `/resources` page SHALL show a "Learn Cloud Native" ("Aprende Cloud Native") grid of link cards with a tab per category: Videos, Free courses, Certifications, Where to learn, Contribute to Kubernetes, Kubernetes blogs and Communities, plus an "All" tab. A tab SHALL be shown only when its category has at least one card, and SHALL show its card count.

#### Scenario: Visitor opens the resources page
- **WHEN** a visitor opens `/resources`
- **THEN** the grid shows the "All" tab and a tab for each category that has cards, each with its count

#### Scenario: Visitor picks a category
- **WHEN** the visitor selects a category tab
- **THEN** the grid shows only that category's cards and the tab is marked selected

### Requirement: Videos tab opens by default
The resources grid SHALL select the Videos tab on load, and SHALL fall back to "All" when there are no videos.

#### Scenario: Videos available
- **WHEN** a visitor opens `/resources` and freeCodeCamp videos are available
- **THEN** the Videos tab is selected

### Requirement: External resource cards open in a new tab
Every card that links outside the site SHALL open in a new tab with `rel="noopener noreferrer"`. Cards that link to a page of this site SHALL open in the same tab.

#### Scenario: External card
- **WHEN** a visitor activates a card that links to another site
- **THEN** the link opens in a new tab

### Requirement: Roadmaps category lists learning paths
The resources grid SHALL include a "Roadmaps" category, labeled "Rutas de aprendizaje" in Spanish, placed after Certifications. It SHALL contain one card per learning path below, each with a one-line description in the visitor's language and its source site as footer.

#### Scenario: Visitor opens the Roadmaps tab
- **WHEN** a visitor selects the Roadmaps tab
- **THEN** the grid shows nine cards linking to `https://roadmap.sh/kubernetes`, `https://roadmap.sh/devops`, `https://roadmap.sh/docker`, `https://roadmap.sh/linux`, `https://roadmap.sh/terraform`, `https://github.com/cncf/trailmap`, `https://maturitymodel.cncf.io/`, `https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/` and `https://landscape.cncf.io/guide`

#### Scenario: Visitor switches language
- **WHEN** the visitor switches between Spanish and English
- **THEN** the tab label and each card's description change to that language

### Requirement: Roadmap cards use only licensed logos
Roadmap cards SHALL show the logo of their project (Kubernetes, CNCF) when the site already hosts it, and a neutral route icon otherwise. The site SHALL NOT show the roadmap.sh mark.

#### Scenario: roadmap.sh card without a project logo
- **WHEN** the visitor views the DevOps, Docker, Linux or Terraform roadmap card
- **THEN** the card shows the neutral route icon
