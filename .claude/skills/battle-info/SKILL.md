---
name: battle-info
description: Use this skill when the user wants a quick combat reference or battle status for a specific character. Triggers on "battle info", "combat stats", "what can I do in combat", "show my character", "what are my options", "my attacks", "what abilities do I have left", "status check", "battle screen", "character info for combat", or any request to see a character's weapons, attack bonuses, available actions, traits, or remaining resources during gameplay. The user must specify which character. This is read-only — it gathers and displays information, never modifies files.
---

# Battle Info

Display a concise combat reference card for a character — their weapons, attack bonuses, damage dice, available features, traits, current resources, and conditions. This is a read-only skill that pulls data from the character profile and the campaign's character state section, then formats it for quick reference during combat.

## Why This Exists

During combat, a player needs to quickly see what they can do — their attack options, remaining resources, active conditions, and key features. Scrolling through a full character sheet wastes time. This skill compiles everything combat-relevant into one tight summary the player can glance at.

## Character Requirement

The user must specify which character they want info for. If they don't, ask. This matters because the project supports multiple characters and campaigns, and you need to know which profile and which campaign state to read.

## Workflow

### Step 1: Identify the character and campaign

- The user will name a character (e.g., "Rytlock", "battle info for Rytlock Brimstone")
- Find the character's profile at `characters/<character-name>/profile.md`
- Identify the active campaign from CLAUDE.md or conversation context
- Find the character's state in the campaign file (`campaigns/<campaign-name>/campaign.md`) under `## Character States`

If you can't find the character or they don't have a state section in the active campaign, let the user know.

### Step 2: Read both sources

Read the character profile for:
- Ability scores and modifiers
- Combat stats (AC, Initiative, Speed)
- Proficiency bonus
- Saving throws and skill proficiencies
- Weapons (name, attack bonus, damage dice, properties)
- Features and traits (racial, class, feats)

Read the campaign character state for:
- Current HP / Max HP / Temp HP
- Remaining Hit Dice
- Currency (quick reference)
- Campaign-acquired inventory
- Active conditions or temporary effects

### Step 3: Output the battle card

Format everything into a clean, scannable reference. Readability is the top priority — this gets used mid-combat when the player needs info fast.

Use this structure. Use a **hybrid approach** for formatting: simple 2-column tables work well for quick-reference data where every cell is short (a number, a single word). Use lists and headers for anything descriptive (weapons, abilities). Never put long text or full sentences inside table cells.

```
## ⚔️ [Character Name] — Battle Info

### At a Glance

| Stat           | Value                    |
|----------------|--------------------------|
| **Class**      | [class] (Level [X])      |
| **HP**         | [current] / [max]        |
| **Temp HP**    | [temp]                   |
| **AC**         | [value] ([source])       |
| **Speed**      | [speed]                  |
| **Initiative** | [init]                   |
| **Hit Dice**   | [remaining]              |
| **Prof Bonus** | [bonus]                  |

### Saving Throws

| Save | Mod  |
|------|------|
| STR  | +X   |
| DEX  | +X   |
| CON  | +X   |
| INT  | +X   |
| WIS  | +X   |
| CHA  | +X   |

(Bold the proficient ones.)

### Attacks

#### [Weapon Name] (primary)
- **To Hit:** +X
- **Damage:** XdY+Z [type]
- **Note:** [relevant properties, fighting style interactions]

#### [Weapon Name]
- **To Hit:** +X
- **Damage:** XdY+Z [type]
- **Range:** X/Y ft. (if ranged)

(One section per weapon. List-based, not a table — weapon details vary too much in length for tables.)

### Combat Resources

| Resource          | Uses | Remaining | Recovery        |
|-------------------|------|-----------|-----------------|
| **Second Wind**   | 1    | Available | Short/Long Rest |
| **Action Surge**  | 1    | Available | Short/Long Rest |
| **Daunting Roar** | 1    | Available | Short/Long Rest |

(Keep cell values short — just "Available" or "Used". This table works because every cell is 1-2 words.)

### Key Abilities

#### [Ability Name] ([Action Type])
[One-line mechanical description with the important numbers.]

(One section per ability. Describe what it does in a short sentence — not in a table.)

### Action Economy

| Type              | Options                                                           |
|-------------------|-------------------------------------------------------------------|
| **Action**        | Attack, [class-specific], Dodge, Dash, Disengage, Help, Hide, Ready |
| **Bonus Action**  | [list available bonus actions]                                    |
| **Reaction**      | Opportunity Attack, [others]                                      |
| **Free**          | [if any, like Action Surge]                                       |

### Conditions & Temporary Effects

None active.

### Current Status

- **HP:** [current] / [max] (full/wounded/critical)
- **Resources:** All available / [list what's been used]
- [Any other relevant notes]
```

### Formatting Guidelines

- **Hybrid tables + lists.** Use simple tables where data is naturally columnar and every cell value is short (numbers, single words, brief phrases). Use list-based sections with headers for anything that needs description or varies in length (weapons, abilities). This gives the clean visual grid of a table where it helps, without the mess of long text crammed into cells.
- The **At a Glance**, **Saving Throws**, **Combat Resources**, and **Action Economy** sections work as tables because their values are short and uniform.
- The **Attacks** and **Key Abilities** sections use list-based headers because weapon properties and ability descriptions vary too much in length.
- Lead with HP/AC/Speed since those are checked most often
- For weapons, include the full attack bonus and damage formula (e.g., "+5 to hit, 2d6+3 slashing")
- For features that are once-per-rest, note whether they've been used if you can tell from the campaign state — otherwise mark them as "available" by default
- Keep descriptions tight — one line per feature with the mechanical effect
- Skip personality traits, backstory, and non-combat info entirely
- If there are conditions or temporary effects active, highlight them prominently
- Include all six saving throw modifiers — highlight which are proficient

## What This Skill Does NOT Do

- Does not modify any files
- Does not track initiative order or manage combat rounds
- Does not look up spell lists (if the character is a caster, just note the spellcasting ability and refer them to their spell list)
- Does not calculate damage or resolve attacks
