---
name: add-campaign
description: Use this skill whenever the user wants to create, start, or register a new D&D campaign. Triggers on phrases like "new campaign", "start a campaign", "add a campaign", "create campaign", "set up a campaign", or when the user describes a new game they're joining. Also use when the user wants to update a campaign's status (mark as completed, on hold, abandoned) or link a character to a campaign.
---

# Add Campaign

Create and store a D&D campaign profile. Each campaign gets its own subfolder under `campaigns/` with a `campaign.md` file that tracks the game's key details, active character, story, map, and status. Designed for quick setup so you can get a campaign registered fast and fill in details over time.

## Workflow

### Step 1: Gather campaign basics

Ask the user for the core info. Keep it conversational — they might not have everything yet, and that's fine. Use "—" for anything unknown.

**Required (or close to it):**
- Campaign name
- DM name
- Which character is being played (link to existing character in `characters/` if available)

**Good to have:**
- Setting / world (e.g., "Forgotten Realms", "homebrew world called Erathis")
- Edition / ruleset
- Play schedule (e.g., "Fridays 7pm", "biweekly")
- Session format (in-person, online, platform used)

### Step 2: Story and world details

Ask what they know so far about the campaign's story and world. This section grows over time as sessions happen, so don't stress about filling it all in upfront.

- Current story arc or hook (what's happening right now?)
- Known locations / map notes
- Active quests or objectives
- Key NPCs encountered so far
- Factions or organizations in play

### Step 3: Save the campaign

1. Create the campaign folder: `campaigns/<campaign-name>/` (kebab-case)
2. Write `campaign.md` using the template below
3. Confirm to the user what was saved

## Campaign Template

```markdown
# [Campaign Name]

> **Status:** Active
> **DM:** [DM Name]
> **Setting:** [World / Setting]
> **Edition:** [Edition]
> **Character:** [Character Name] → `characters/<character-folder>/profile.md`
> **Schedule:** [When you play]
> **Format:** [In-person / Online / Platform]

---

## Story

### Current Arc
[What's happening right now in the campaign]

### Background
[How the campaign started, initial hook, premise]

## Quests

### Active
- [ ] [Quest 1]
- [ ] [Quest 2]

### Completed
- [x] [Quest 1]

## World

### Locations
- **[Location Name]:** [Brief description, what happened here]

### Map Notes
[Any map-related info — regions, travel routes, notable landmarks]

### Factions
- **[Faction Name]:** [Allegiance, goals, relationship with the party]

## NPCs

- **[NPC Name]:** [Role, relationship, last seen]

## Session Log

| # | Date | Title | Notes File |
|---|------|-------|------------|
| 1 |      |       |            |

## Notes

[Anything else — house rules for this campaign, party composition, loot splits, etc.]
```

## Status Management

Campaigns have one of these statuses:

- **Active** — Currently playing
- **Completed** — Campaign finished (reached an ending)
- **On Hold** — Paused, might resume
- **Abandoned** — Left the campaign, not returning

When the user wants to change a campaign's status, update the Status field in `campaign.md` and add a note at the bottom with when and why.

## Linking Characters

The Character field in the campaign header should point to the character's profile with a relative path. If the character already exists in `characters/`, link to it. If not, mention that they can use the add-character skill to create the profile.

A character can be in multiple campaigns (different tables, same character) and a campaign can have the character swapped out if the user retires one and brings in another — just update the Character field.

## Campaign Folder Structure

Over time a campaign folder might grow to include:
```
campaigns/
  curse-of-strahd/
    campaign.md        — Main campaign file
    maps/              — Map images or notes
    handouts/          — DM handouts, letters, puzzles
```

Create subfolders only when the user actually has files to put in them — don't pre-create empty folders.
