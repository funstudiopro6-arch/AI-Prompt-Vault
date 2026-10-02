# Education prompts

Make learning your next favorite adventure.

## Make the complicated click

Learn a tricky idea with simple explanations and good analogies.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Learning, Analogies, Explainer

```text
Teach me {{topic}} at a {{level}} level. Begin with a plain-language overview, then a concrete analogy using {{interest}}. Break the topic into three key ideas. Work through one example step by step, identify a common misconception, and ask three short questions to check my understanding. Wait for my answers before revealing solutions. Keep analogies accurate and explain where they stop working.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{topic}}` | What do you want to learn? | how neural networks learn |
| `{{level}}` | Your level | curious beginner |
| `{{interest}}` | An interest for the analogy | cooking |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Your personal learning roadmap

Turn curiosity into a habit with a plan that fits your life.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Study plan, Skills, Learning

```text
Create a {{weeks}}-week learning plan for {{subject}}. Starting knowledge: {{baseline}}. Available study time: {{time}}. Goal: {{goal}}. For each week give learning objectives, practice tasks, a small project, and a checkpoint. Use spaced repetition and retrieval practice. Suggest types of resources rather than inventing links. Include a catch-up plan and a final assessment.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{weeks}}` | Number of weeks | 6 |
| `{{subject}}` | Subject | Python programming |
| `{{baseline}}` | Starting knowledge | comfortable with spreadsheets, new to coding |
| `{{time}}` | Weekly study time | four hours |
| `{{goal}}` | Learning goal | build a useful small automation script |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## A tutor, not an answer key

Build understanding one thoughtful question at a time.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Tutoring, Socratic, Practice

```text
Act as a patient Socratic tutor for {{subject}}. I am working on {{problem}}. My current thinking is {{attempt}}. Ask one guiding question at a time, wait for my response, and adapt your next question. Offer a small hint if I am stuck. Do not give the complete solution unless I explicitly ask. Gently identify misconceptions and help me explain the reasoning in my own words.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{subject}}` | Subject | algebra |
| `{{problem}}` | Problem | solve 2x + 7 = 19 |
| `{{attempt}}` | Your attempt | I know I need to isolate x, but I am not sure what to do first. |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Practice that makes it stick

Create useful questions that reveal what you really understand.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Quiz, Assessment, Practice

```text
Create a {{count}}-question practice quiz on {{topic}} for {{level}} learners, using the following source material:

{{material}}

Mix recall, application, and reasoning questions. Include plausible distractors for multiple-choice items. Put the answer key and explanations in a separate final section. Reference only the provided material, flag gaps, and identify the skill tested by each question.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{count}}` | Question count | 10 |
| `{{topic}}` | Topic | the water cycle |
| `{{level}}` | Learner level | middle-school |
| `{{material}}` | Source notes | Paste the lesson notes or source text here. |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## A lesson worth leaning into

Design an engaging lesson with a clear learning outcome.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Teaching, Lesson plan, Critical thinking

```text
Design a {{duration}}-minute lesson on {{topic}} for {{audience}}. Outcome: {{outcome}}. Available materials: {{materials}}. Include a hook, prior-knowledge check, short explanation, active-learning exercise, differentiation ideas, formative assessment, and exit ticket. Provide approximate timing for each part and an accessible low-tech alternative.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Minutes | 45 |
| `{{topic}}` | Topic | recognizing misinformation online |
| `{{audience}}` | Learners | high-school students |
| `{{outcome}}` | Learning outcome | evaluate a claim using source quality and corroboration |
| `{{materials}}` | Materials | a projector and printed example articles |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Small cards, lasting knowledge

Turn dense notes into focused active-recall prompts.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Flashcards, Recall, Revision

```text
Convert these notes into {{count}} useful flashcards:

{{notes}}

Use one concept per card. Prefer questions that require understanding over word-for-word memorization. Include concise answers and a brief explanation only where needed. Return a table with front, back, and topic tag. Add a suggested spaced-repetition review schedule. Do not introduce facts not supported by the notes.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{count}}` | Card count | 15 |
| `{{notes}}` | Study notes | Paste your study notes here. |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.


---

Generated from `src/data/prompts.js`. Edit the catalog and run `npm run generate:docs` to update this file.
