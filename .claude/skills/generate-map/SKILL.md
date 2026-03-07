---
name: generate-map
description: Use this skill whenever the user wants to create, draw, or generate a map for their D&D campaign. Triggers on phrases like "draw a map", "make a map", "generate a map", "create a dungeon map", "sketch this area", "map this room", or when the user describes a location layout and wants it visualized. Also triggers when the user shares a screenshot or image of a hand-drawn map and wants it turned into a clean SVG. This skill creates SVG map images and saves them to the campaign's maps folder. Use this even if the user just says something like "can you map that?" or describes a room layout during a session.
---

# Generate Map

Create SVG map images for D&D locations based on text descriptions or reference images. Maps are saved to the active campaign's `maps/` folder and linked in the campaign file under Map Notes.

## When This Skill Activates

- The user describes a location and wants it visualized (dungeon rooms, caves, towns, buildings)
- The user shares/uploads an image of a hand-drawn or rough map and wants a clean version
- The user asks to "draw", "map", "sketch", or "generate" a location map
- During a session, the user describes a room or area layout and wants it captured visually

## Workflow

### Step 1: Understand the map

Figure out what needs to be drawn. The input could be:

**Text description:** The user describes a location loosely — "a star-shaped cavern with 3 exits" or "a tavern with a bar, tables, and a back room." Extract the key features: shape, size, notable objects, entrances/exits, enemies, traps.

**Image input:** The user shares a screenshot or photo of a hand-drawn map, a whiteboard sketch, or a reference image. Study it and identify the layout, rooms, labels, and connections. Recreate it faithfully as a clean SVG.

**Hybrid:** Sometimes the user describes changes to an existing map — "add a secret door on the east wall." Read the existing SVG and modify it.

Ask clarifying questions only if the description is too vague to draw anything useful. For simple requests, just go ahead and draw.

### Step 2: Determine the campaign and filename

- Check CLAUDE.md or the conversation context for the active campaign
- Default path: `campaigns/<campaign-name>/maps/`
- Generate a kebab-case filename based on the location: e.g., `lance-rock-entrance.svg`, `tavern-back-room.svg`
- If a map for this location already exists, confirm whether to replace or create a new variant

### Step 3: Draw the SVG

Create an SVG map following these conventions:

#### Canvas & Style
- Use a dark background (`#2a2218` or similar dark earth tone) to represent solid rock/walls
- Floor areas use warm stone gradients (`#c4a882` to `#a08060`)
- Tunnels/passages use a slightly different shade to distinguish from rooms
- Wall outlines in `#6a5a40`, 2-3px stroke
- Overall dimensions: aim for 800x800 to 900x1100 depending on the map shape

#### Rooms & Areas
- Use `<path>` elements with curves for organic cave shapes
- Use `<rect>` or `<polygon>` for constructed rooms (buildings, dungeons)
- Label each room/area with a name or identifier (e.g., "L1", "Great Hall", "Kitchen")
- Add a short description under the label in smaller text
- Connect rooms with clear passages

#### Points of Interest
- Use colored circles for creatures/NPCs:
  - Red (`#8b0000`) for enemies/undead
  - Purple (`#4a0066`) for bosses/named NPCs
  - Blue (`#224488`) for friendly NPCs
  - Gray (`#666`) for neutral creatures
- Use small shapes for objects: rectangles for tables/furniture, circles for pillars, triangles for traps
- Label important items near their markers

#### Map Furniture
- Include a title at the top (location name, campaign context)
- Add a legend box explaining symbols used
- Include a rough scale bar if dimensions are known
- Add entrance/exit labels with directional hints

#### No-Spoiler Rule
Remember the no-spoiler rule from CLAUDE.md — do not label NPCs or locations with names the player hasn't learned in-game. Use generic labels like "unknown figure", "the guardian", etc.

### Step 4: Save and link

1. Write the SVG to `campaigns/<campaign-name>/maps/<filename>.svg`
2. Update the campaign's `campaign.md` under `### Map Notes` with a link:
   ```
   - **<Location Name>:** [map](maps/<filename>.svg)
   ```
3. Tell the user the file is saved and suggest they open it in a browser to view

### Step 5: Iterate

The user may want adjustments — "make the room bigger", "add a door on the north side", "put the treasure chest in the corner." Read the existing SVG and edit it. Use the Edit tool for small changes, Write for major rewrites.

## Tips for Good Maps

- **Organic vs constructed:** Caves should have irregular, curvy walls. Built structures should have straighter lines and right angles.
- **Scale matters:** A typical dungeon room is 20-40 feet across. Corridors are 5-10 feet wide. Keep proportions reasonable.
- **Don't overcrowd:** Leave empty space. Not every square foot needs a label.
- **Use the z-axis:** If there are elevation changes (stairs, pits, ledges), note them with text labels or hatching patterns.
- **Color sparingly:** Too many colors make the map noisy. Stick to the earth-tone palette with accent colors only for markers.
