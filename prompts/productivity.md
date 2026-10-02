# Productivity prompts

Less busywork. More room for what matters.

## A week with a little more focus

Turn a long to-do list into a plan you can actually follow.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Planning, Focus, Time management

```text
Act as a realistic planning partner. Help me plan a week with {{hours}} available working hours. My priorities are {{priorities}}. Fixed commitments: {{commitments}}. Energy pattern: {{energy}}. Create a Monday–Friday time-blocked plan with breaks, a 20% buffer, and at most three daily priorities. Separate must-do tasks from nice-to-have tasks. End with a Friday reflection and explain what to defer if time runs short.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{hours}}` | Available hours | 30 |
| `{{priorities}}` | This week’s priorities | launch a portfolio, finish a client proposal, and study a new skill |
| `{{commitments}}` | Fixed commitments | team meetings on Tuesday and Thursday at 10 AM |
| `{{energy}}` | Energy pattern | most focused in the morning |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## From meeting to momentum

Leave the meeting with clarity, owners, and next steps.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Meetings, Action items, Communication

```text
Turn these meeting notes into a practical follow-up:

{{notes}}

Provide a brief summary, decisions made, open questions, and an action-item table with task, owner, due date, and dependency. Do not invent owners, dates, or decisions; mark missing information as “not specified.” Draft a concise follow-up email in a {{tone}} tone. Keep sensitive information limited to what is necessary.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{notes}}` | Meeting notes | Paste your meeting notes or transcript here. |
| `{{tone}}` | Follow-up tone | warm and professional |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## The email you meant to write

Say what matters with a little less back and forth.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Email, Communication, Clarity

```text
Rewrite this email for {{recipient}}:

{{draft}}

Goal: {{goal}}. Use a {{tone}} tone and keep it under {{length}} words. Preserve facts and do not add commitments. Include a clear subject line and one specific call to action. Provide one concise version and one slightly warmer version. Flag any ambiguous facts that I should verify.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{recipient}}` | Recipient | a project collaborator |
| `{{draft}}` | Your draft | Paste your rough email here. |
| `{{goal}}` | Goal | confirm the timeline and agree on the next step |
| `{{tone}}` | Tone | friendly and direct |
| `{{length}}` | Word limit | 150 |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Untangle a tricky decision

Weigh the trade-offs without going around in circles.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Decisions, Strategy, Planning

```text
Help me decide between {{options}} for {{decision}}. My criteria are {{criteria}} and my constraints are {{constraints}}. Build a weighted decision matrix with clearly labeled assumptions. Explain trade-offs, uncertainty, reversibility, and what new evidence could change the recommendation. Do not invent factual data about options. Finish with a small next step to test the most important assumption.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{options}}` | Options | freelancing part-time, taking a full-time role, or launching a small studio |
| `{{decision}}` | Decision | my next career step |
| `{{criteria}}` | Criteria | income stability, learning, autonomy, and time |
| `{{constraints}}` | Constraints | three months of savings and 30 working hours per week |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Big project, small next step

Find a clear path through an overwhelming project.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Projects, Execution, Planning

```text
Break {{project}} into a practical execution plan. Desired result: {{outcome}}. Deadline: {{deadline}}. Resources: {{resources}}. Define milestones, small tasks, dependencies, realistic estimates, risks, and a minimum viable version. Mark assumptions. Finish with the first three actions I can take today, each under 30 minutes.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{project}}` | Project | relaunching my personal website |
| `{{outcome}}` | Success looks like | a fast, accessible portfolio with three case studies |
| `{{deadline}}` | Deadline | four weeks |
| `{{resources}}` | Resources | one person, evenings, and a modest hosting budget |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Build your repeatable routine

Document a process once and make every run easier.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Systems, SOP, Organization

```text
Create a simple standard operating procedure for {{process}}. Audience: {{audience}}. Existing approach: {{steps}}. Include purpose, prerequisites, numbered steps, quality checks, common mistakes, exceptions, and a completion checklist. Keep it easy to scan and use during the task. Do not add tools or approvals that are not needed.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{process}}` | Process | publishing a weekly newsletter |
| `{{audience}}` | Who uses it | a small creative team |
| `{{steps}}` | Current approach | collect ideas, draft, review links, schedule, and check delivery |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.


---

Generated from `src/data/prompts.js`. Edit the catalog and run `npm run generate:docs` to update this file.
