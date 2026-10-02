# Video creation prompts

Every great film starts with a little imagination.

## A cinematic space odyssey

Make a few seconds feel like an entirely new universe.

**Compatible tools:** Runway, Sora, Kling  
**Level:** Beginner  
**Tags:** Cinematic, Sci-fi, Storytelling

```text
A {{duration}}-second continuous cinematic shot of {{subject}} on {{location}}. Begin with a wide establishing frame. The camera {{movement}}, revealing a massive hazy planet on the horizon. The subject moves slowly and naturally; fine dust drifts in the wind. Low golden sunlight, rust-orange sand, atmospheric depth, subtle film grain, restrained science-fiction aesthetic. Keep the subject’s appearance consistent throughout. No cuts, no text, no logos. Aspect ratio {{ratio}}.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Duration in seconds | 8 |
| `{{subject}}` | Subject | a lone astronaut in an off-white spacesuit |
| `{{location}}` | Location | sweeping desert dunes |
| `{{movement}}` | Camera movement | slowly pushes forward from behind |
| `{{ratio}}` | Aspect ratio | 16:9 |

**Tip:** Keep one clear action and one camera movement per clip. Set duration and aspect ratio in your video tool if it provides separate controls.

---

## The slow-motion product reveal

Create a polished hero moment for your next launch.

**Compatible tools:** Runway, Sora, Kling  
**Level:** Beginner  
**Tags:** Product, Slow motion, Commercial

```text
A {{duration}}-second studio product video of {{product}}. Start with a tight detail shot, then smoothly pull back to reveal the full product on {{surface}}. Soft {{lighting}} lighting sweeps across the surface. Slow, physically plausible motion, realistic material reflections, elegant {{mood}} art direction. Keep product geometry stable. No hands, no invented lettering, no cuts. Landscape composition.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Seconds | 6 |
| `{{product}}` | Product | a matte-black wireless headphone |
| `{{surface}}` | Surface | a dark stone plinth |
| `{{lighting}}` | Lighting | cool blue rim |
| `{{mood}}` | Mood | premium minimalist |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## A moment of calm

Let gentle natural motion tell a quieter story.

**Compatible tools:** Runway, Sora, Kling  
**Level:** Beginner  
**Tags:** Nature, Ambient, Loop

```text
A locked-off {{duration}}-second shot of {{scene}}. Only {{motion}} moves, with slow subtle natural dynamics. {{lighting}} light and a {{palette}} color palette. Photorealistic details, meditative pacing, no camera shake, no abrupt changes, no people or text. Aim for a smooth loop by keeping lighting and composition stable from first to last frame.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Seconds | 8 |
| `{{scene}}` | Scene | a mossy stone beside a still mountain stream |
| `{{motion}}` | Natural motion | the water and a few fern leaves |
| `{{lighting}}` | Lighting | soft overcast morning |
| `{{palette}}` | Palette | forest green and cool gray |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## A tiny animated adventure

Give a charming original character a moment to shine.

**Compatible tools:** Runway, Sora, Kling  
**Level:** Beginner  
**Tags:** Animation, Characters, 3D

```text
A {{duration}}-second original {{style}} animated scene. {{character}} performs this one action: {{action}}. The setting is {{setting}}. Expressive but subtle character animation, clear staging, consistent proportions, a warm inviting palette, soft lighting, smooth movement. One continuous shot with a static camera. No dialogue, text, or logos.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Seconds | 6 |
| `{{style}}` | Animation style | clay-like 3D |
| `{{character}}` | Character | a small round robot with a glass face |
| `{{action}}` | Action | waters a tiny flower, then tilts its head with delight |
| `{{setting}}` | Setting | a cozy greenhouse |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Postcards in motion

Capture the feeling of a place, not just the view.

**Compatible tools:** Runway, Sora, Kling  
**Level:** Beginner  
**Tags:** Travel, B-roll, Cinematic

```text
A {{duration}}-second cinematic travel B-roll shot of {{location}} at {{time}}. The camera makes a slow {{movement}}. Emphasize {{detail}}, natural light, realistic environmental motion, and a {{mood}} atmosphere. Documentary travel photography aesthetic, believable perspective, subtle film grain, no text overlays or logos.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Seconds | 8 |
| `{{location}}` | Location | a quiet coastal village in a fictional Mediterranean setting |
| `{{time}}` | Time of day | early morning |
| `{{movement}}` | Camera move | lateral tracking movement |
| `{{detail}}` | Focus detail | sunlight on weathered walls and laundry moving in a breeze |
| `{{mood}}` | Mood | unhurried |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## From idea to storyboard

Shape your concept into a shot-by-shot creative plan.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Storyboard, Planning, Storytelling

```text
Act as a thoughtful film director. Create a storyboard for a {{duration}}-second video about {{concept}} for {{audience}}. The tone is {{tone}}. Return a table with shot number, duration, framing, camera movement, subject action, audio suggestion, and a standalone AI video prompt. Keep continuity and describe consistent characters. Total shot durations must equal the requested runtime. Explain which parts need editing or sound design rather than generation.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Total seconds | 30 |
| `{{concept}}` | Concept | finding small moments of creativity in an ordinary day |
| `{{audience}}` | Audience | young creative professionals |
| `{{tone}}` | Tone | hopeful and cinematic |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.


---

Generated from `src/data/prompts.js`. Edit the catalog and run `npm run generate:docs` to update this file.
