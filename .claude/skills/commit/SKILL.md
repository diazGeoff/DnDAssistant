---
name: commit
description: Use this skill whenever the user wants to commit, save, or checkpoint their D&D Game Assistant data to git. Triggers on "commit", "save changes", "checkpoint", "push", or any request to persist the current state of characters, campaigns, sessions, or other project files to version control.
user_invocable: true
---

# Commit

Commit changes to the DnD Game Assistant git repo with clear, descriptive messages that reflect what D&D content was added or changed.

## Workflow

### Step 1: Check what changed

Run `git status` and `git diff` (staged + unstaged) to understand what's been modified. Categorize the changes by type:

- **Characters** — new profiles, stat updates, level ups, inventory changes
- **Campaigns** — new campaigns, story updates, quest progress, NPC additions
- **Sessions** — new session notes, recaps
- **References** — rules, house rules, homebrew
- **Config** — CLAUDE.md, skills, project structure changes

### Step 2: Stage files

Stage all relevant changed files. This project is a data repo (markdown, PDFs, images) so it's generally safe to stage everything — but skip any files that look temporary or accidental (e.g., `.DS_Store`, swap files).

Use specific file paths rather than `git add -A` to be explicit about what's being committed.

### Step 3: Write the commit message

Use this format:

```
<type>(<scope>): <short description>

<optional body with details>
```

**Types** (pick the most fitting):
- `add` — new content (new character, new campaign, new session notes)
- `update` — changes to existing content (stat changes, story progress, quest updates)
- `fix` — corrections (wrong stats, typos, restructuring)
- `config` — project config changes (CLAUDE.md, skills, gitignore)

**Scope** — the area affected: `character`, `campaign`, `session`, `reference`, `project`

**Examples:**
- `add(character): create Rytlock Brimstone profile`
- `update(campaign): progress Princes of the Apocalypse story after session 3`
- `add(session): session 5 recap - the mines of Grimhollow`
- `update(character): level up Rytlock to level 4, add ASI`
- `config(project): add campaign instantiation skill`

If multiple areas changed, use the most significant one as the scope and mention others in the body.

### Step 4: Commit

Create the commit. Show the user the commit message and a summary of what was included.

Do not push to remote unless the user explicitly asks.

## Multi-change commits

If there are many unrelated changes (e.g., a new character AND a campaign update AND a config change), ask the user whether they want:
1. **One commit** covering everything (simpler)
2. **Separate commits** for each logical change (cleaner history)

Default to a single commit unless the changes are clearly unrelated and the user seems to care about commit hygiene.
