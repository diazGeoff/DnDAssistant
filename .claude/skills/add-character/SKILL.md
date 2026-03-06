---
name: add-character
description: Use this skill whenever the user wants to add, create, or register a new D&D character (PC or NPC). Triggers on phrases like "add a character", "new character", "create a character sheet", "store this NPC", "register my PC", or any request to save character stats and details. Also use when the user provides character information and wants it recorded in the project.
---

# Add Character

Create and store a D&D character profile by walking the user through a guided interview. Supports both Player Characters (PCs) and NPCs. Each character gets its own folder under `characters/` with a `profile.md` and any uploaded attachments.

## Workflow

### Step 1: Determine character type

Ask the user whether this is a **PC** (Player Character) or an **NPC** (Non-Player Character).

- **PC**: Full character sheet — all sections below
- **NPC**: Lighter profile — basic info, core stats, combat stats, and notes. Skip proficiency details, personality traits, and spellcasting unless the user offers them.

### Step 2: Guided interview

Walk through the sections below one at a time. Ask for each section conversationally. The user can provide as much or as little as they have — leave unknown fields as "—" so they can be filled in later.

Don't be robotic about it. Group related questions naturally. If the user volunteers info ahead of time, capture it and skip those questions later.

**Sections to gather:**

1. **Basic Info** — Name, race, class, subclass, level, background, alignment, player name (PC only)
2. **Ability Scores** — STR, DEX, CON, INT, WIS, CHA (scores and modifiers)
3. **Combat Stats** — Armor Class (AC), initiative modifier, speed, max HP, current HP, temp HP, hit dice
4. **Proficiency** — Proficiency bonus, saving throw proficiencies, skill proficiencies (note expertise if applicable)
5. **Features & Traits** — Racial traits, class features, feats
6. **Equipment & Inventory** — Weapons, armor, gear, currency (gp/sp/cp/ep/pp)
7. **Spellcasting** (if applicable) — Spellcasting ability, spell save DC, spell attack bonus, spell slots per level, known/prepared spells
8. **Personality** (PC only) — Personality traits, ideals, bonds, flaws
9. **Notes** — Backstory, appearance, allies, organizations, any extra info

### Step 3: Accept file uploads (optional)

If the user wants to attach files (character art, backstory documents, PDFs, screenshots of a character sheet, etc.), read and parse any text-based files to extract additional details for the profile. Save all uploaded files into the character's folder.

### Step 4: Save the character

1. Create the character folder: `characters/<character-name>/` (use kebab-case for the folder name)
2. Write `profile.md` using the template below
3. Save any uploaded attachments into the same folder
4. Confirm to the user what was saved, summarizing the key stats

## Profile Template

Use this Markdown template for `profile.md`. Omit sections that don't apply (e.g., spellcasting for a fighter, personality for an NPC). Use "—" for unknown fields.

```markdown
# [Character Name]

> **Type:** PC / NPC
> **Race:** [Race]
> **Class:** [Class] ([Subclass]) — Level [X]
> **Background:** [Background]
> **Alignment:** [Alignment]
> **Player:** [Player Name]

---

## Ability Scores

| Ability | Score | Modifier |
|---------|-------|----------|
| STR     |       |          |
| DEX     |       |          |
| CON     |       |          |
| INT     |       |          |
| WIS     |       |          |
| CHA     |       |          |

## Combat

| Stat       | Value |
|------------|-------|
| AC         |       |
| Initiative |       |
| Speed      |       |
| Max HP     |       |
| Current HP |       |
| Temp HP    |       |
| Hit Dice   |       |

## Proficiency

- **Proficiency Bonus:** +[X]
- **Saving Throws:** [list]
- **Skills:** [list, mark expertise with (E)]

## Features & Traits

- [Feature 1]
- [Feature 2]

## Equipment & Inventory

### Weapons
- [Weapon]: [damage] [type]

### Armor
- [Armor]: [AC contribution]

### Gear
- [Item 1]
- [Item 2]

### Currency
| PP | GP | EP | SP | CP |
|----|----|----|----|----|
|    |    |    |    |    |

## Spellcasting

- **Spellcasting Ability:** [Ability]
- **Spell Save DC:** [X]
- **Spell Attack Bonus:** +[X]

### Spell Slots

| Level | Slots | Used |
|-------|-------|------|
| 1st   |       |      |
| 2nd   |       |      |
| 3rd   |       |      |

### Spells Known / Prepared

#### Cantrips
- [Spell]

#### 1st Level
- [Spell]

## Personality

- **Traits:** [traits]
- **Ideals:** [ideals]
- **Bonds:** [bonds]
- **Flaws:** [flaws]

## Notes

### Appearance
[Description]

### Backstory
[Backstory]

### Allies & Organizations
- [Ally/Org]

### Additional Notes
- [Any extra info]
```

## File attachments

When the user provides files:
- **Images** (character art, screenshots): Save as-is into the character folder. If it's a character sheet screenshot, try to extract visible stats and incorporate them into the profile.
- **PDFs / text files** (backstory docs, exported sheets): Read the content, extract relevant character details, and merge them into the appropriate profile sections. Save the original file too.
- **Reference the attachments** in the Notes section of the profile so it's clear what's in the folder.
