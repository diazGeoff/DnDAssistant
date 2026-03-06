---
name: join-campaign
description: Use this skill when the user wants to add a character to a campaign, join a campaign with a character, set their active character for a campaign, or swap characters in a campaign. Triggers on phrases like "join campaign", "add Rytlock to this campaign", "play this character in", "set my character", "swap character", or any request to link a character to a campaign and set up their in-game state.
---

# Join Campaign

Link an existing character to a campaign and set up their in-game state. This is the bridge between the base character profile (in `characters/`) and the live campaign (in `campaigns/`).

## Workflow

### Step 1: Identify the character and campaign

Figure out which character and which campaign to link. Check what's available:
- Look in `characters/` for existing character profiles
- Look in `campaigns/` for existing campaigns
- Check CLAUDE.md for the current active campaign

If the user doesn't specify, ask. If either the character or campaign doesn't exist yet, point them to the add-character or add-campaign skill first.

### Step 2: Read the character's base profile

Read the character's `profile.md` to pull in relevant stats for the initial state:
- Max HP → set as both Current and Max
- Hit Dice → set as both Current and Max
- Spell slots (if any) → set totals with 0 used
- Starting equipment that counts as campaign inventory (consumables, packs, ammo)
- Starting currency (ask the user — this may differ from what's in the base profile since campaign starting gold varies)

### Step 3: Set up Character State in the campaign

Add a new character block under the **Character States** section in the campaign's `campaign.md`. Each character gets its own `### [Character Name]` subsection with their own resources, currency, inventory, and conditions.

If the Character States section doesn't exist yet, create it. If there are already other characters in the section, add the new one after the last character block.

### Step 4: Update CLAUDE.md

Update the active campaign pointer in CLAUDE.md if this is the user's current game:
```
- **Campaign:** [Campaign Name] → `campaigns/<campaign-name>/campaign.md`
```

### Step 5: Confirm

Show the user what was set up — character name, campaign, starting resources, and currency.

## Character State Template

The campaign file has a single `## Character States` section. Each character gets their own `### [Name]` subsection within it.

```markdown
## Character States

### [Character Name]

> `characters/<character-folder>/profile.md`

#### Resources

| Resource   | Current | Max  |
|------------|---------|------|
| HP         |         |      |
| Temp HP    | 0       | —    |
| Hit Dice   |         |      |

#### Spell Slots (if applicable)

| Level | Used | Total |
|-------|------|-------|
| 1st   | 0    |       |

#### Currency

| PP | GP | EP | SP | CP |
|----|----|----|----|----|
|    |    |    |    |    |

#### Inventory (campaign-acquired)

- [Starting consumables/gear]

#### Conditions & Temporary Effects

- None
```

Omit the Spell Slots table if the character isn't a spellcaster.

## Removing a Character

If the user retires a character, remove that character's `### [Name]` subsection from Character States. Add a note in the campaign's Notes section recording the change (e.g., "Rytlock retired at session 5").
