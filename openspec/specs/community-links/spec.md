# community-links Specification

## Purpose
TBD - created by archiving change slack-channel-link. Update Purpose after archive.

## Requirements

### Requirement: Slack links open the chapter channel
The Slack entries in the navbar "Join" menu and in the footer SHALL link to `https://cloud-native.slack.com/archives/C08HTR95K17` and SHALL be labeled "Slack: #cloud-native-santo-domingo" in Spanish and English.

#### Scenario: Navbar Slack entry
- **WHEN** a visitor opens the navbar "Join" menu
- **THEN** the Slack entry reads "Slack: #cloud-native-santo-domingo" and links to `https://cloud-native.slack.com/archives/C08HTR95K17`

### Requirement: Workspace invite stays available
The Resources page SHALL link to `https://slack.cncf.io/` so visitors without a CNCF Slack account can join the workspace.

#### Scenario: Visitor without Slack account
- **WHEN** a visitor opens `/resources`
- **THEN** a "Join the CNCF Slack" card links to `https://slack.cncf.io/`
