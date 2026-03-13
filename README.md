# DnD Game Assistant

A personal D&D session assistant powered by [Claude Code](https://docs.anthropic.com/en/docs/claude-code). Track characters, campaigns, sessions, loot, and maps — all stored as plain Markdown files and managed through natural language.

Built for **players** (not DMs). The assistant helps with rules lookups, combat tracking, session recaps, roleplay, and keeping your campaign data organized.

## Features

- **Character management** — Full character sheets stored as Markdown with support for file attachments (art, PDFs, backstory docs)
- **Campaign tracking** — Story arcs, quests, NPCs, factions, loot, and per-character in-session state (HP, spell slots, inventory)
- **Session notes** — Per-session recaps with plot threads and open questions
- **Combat support** — Quick battle reference cards, tactical suggestions, resource tracking
- **Map generation** — SVG maps created from text descriptions or reference images
- **Rules lookups** — Quick answers to rules questions with source citations
- **Web viewer** — Local browser UI to browse campaign data with an embedded chat widget
- **No spoilers** — The assistant never reveals enemy stats or plot details the player hasn't learned in-game

## Requirements

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (with an active Claude subscription)
- [Node.js](https://nodejs.org/) (for the web viewer)
- Git

## Getting Started

### 1. Clone the repo

```bash
git clone <your-repo-url> DnDGameAssistant
cd DnDGameAssistant
```

### 2. Set your player name

Open `CLAUDE.md` and update the **Player Name** field in the User Context section.

### 3. Create your first campaign

Launch Claude Code in the project directory:

```bash
claude
```

Then tell it to create a campaign:

```
Add a new campaign called "Curse of Strahd", DM is Alex, we play on Fridays
```

This triggers the **add-campaign** skill, which walks you through setup and creates the campaign files.

### 4. Add your character

```
Add a new character — Thordak, Level 3 Human Fighter
```

The **add-character** skill guides you through a conversational interview to build the full character sheet. You can also upload PDFs or images of existing character sheets.

### 5. Join the campaign

```
Add Thordak to Curse of Strahd
```

The **join-campaign** skill links your character to the campaign and sets up in-session state tracking (HP, spell slots, inventory, currency).

### 6. Play

You're ready. During sessions, the assistant can:

- Track HP, spell slots, and resources as you play
- Look up spells, abilities, and conditions
- Record session notes and loot
- Generate maps of locations your DM describes
- Show a quick combat reference card with all your attack options

## Project Structure

```
characters/              — Character profiles (PCs and notable NPCs)
  <character-name>/
    profile.md           — Main character sheet
    (attachments)        — Art, PDFs, backstory docs

campaigns/               — Campaign data
  <campaign-name>/
    campaign.md          — Story, quests, NPCs, character states, loot
    sessions/            — Per-session notes (session-01.md, etc.)
    maps/                — Map images and SVGs
    handouts/            — DM handouts, letters, puzzles

references/              — House rules, homebrew, rule references

web/                     — Local web viewer with embedded chat
  config.json            — Active campaign setting
  server.js              — Express server
  public/                — Frontend assets
```

All data is plain Markdown — no databases, no lock-in. Everything is version-controlled with git.

## Skills

Skills are specialized workflows that Claude Code uses to handle specific tasks. You can trigger them naturally in conversation or by name.

### `/add-character` — Create or update a character

Walks you through a guided interview to build a full character profile. Supports both PCs and NPCs. Accepts file uploads (character art, PDF sheets, backstory docs) and extracts stats automatically.

**Trigger phrases:** "add a character", "new character", "create a character sheet", "store this NPC"

### `/add-campaign` — Create a new campaign

Sets up a new campaign folder with a `campaign.md` tracking story, quests, NPCs, factions, and session logs. Can also update campaign status (active, completed, on hold, abandoned).

**Trigger phrases:** "new campaign", "start a campaign", "add a campaign", "create campaign"

### `/join-campaign` — Link a character to a campaign

Connects an existing character to a campaign and initializes their in-session state (HP, spell slots, currency, inventory). This is what makes a character "active" in a specific game.

**Trigger phrases:** "join campaign", "add Thordak to this campaign", "set my character", "swap character"

### `/battle-info` — Combat reference card

Displays a concise combat summary for a character: attacks, damage, AC, HP, available resources, action economy, and conditions. Read-only — designed for quick mid-combat reference.

**Trigger phrases:** "battle info", "combat stats", "what can I do in combat", "what are my options", "my attacks"

### `/generate-map` — Create SVG maps

Generates SVG map images from text descriptions or reference images. Supports dungeons, caves, towns, buildings, and battle maps. Maps are saved to the campaign's `maps/` folder.

**Trigger phrases:** "draw a map", "make a map", "sketch this room", "map that", "battle map", "dungeon map"

### `/commit` — Save changes to git

Commits your current changes with a descriptive message categorized by type (character updates, campaign progress, session notes, etc.).

**Trigger phrases:** "commit", "save changes", "checkpoint", "push"

## Web Viewer

The project includes a local web viewer for browsing campaign and character data in a browser.

```bash
./start.sh
```

This launches:
- **Port 3000** — Markdown viewer (renders campaign files, character sheets, maps)
- **Port 3456** — Claude API proxy (powers the embedded chat widget)

The chat widget assembles context from your active campaign and characters, giving you a quick in-browser assistant during sessions. The active campaign can be switched from the chat UI.

## How Data is Organized

The assistant separates **base character data** from **campaign state**:

- **`characters/<name>/profile.md`** — The permanent character sheet (race, class, stats, features, equipment). This never changes during a session.
- **`campaigns/<name>/campaign.md`** — In-session state (current HP, spell slots used, temporary effects, loot, currency). This changes every session.

This means the same character can exist in multiple campaigns with independent state in each one.

## License

MIT
