# Automation prompts

Build helpful systems that do the heavy lifting.

## Make the busywork disappear

Design a reliable workflow before connecting the dots.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Workflows, n8n, No-code

```text
Act as an automation architect. Design a workflow that {{goal}} using {{tools}}. Trigger: {{trigger}}. Input data: {{inputs}}. Return a step-by-step flow with field mappings, conditions, validation, retries, duplicate prevention, failure alerts, and a human approval step where needed. Explain required permissions and secret storage. Include a test plan with sample data. Do not assume a connector exists; mark anything that must be verified.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{goal}}` | What to automate | turns approved form submissions into tasks and sends a summary |
| `{{tools}}` | Tools | n8n, Google Sheets, and Slack |
| `{{trigger}}` | Trigger | a new approved row in a spreadsheet |
| `{{inputs}}` | Input fields | name, email, request, priority, approval_status |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## A tidier folder, safely

Automate file organization without risking the originals.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Scripts, Files, Python

```text
Write a {{language}} script to organize files in {{folder}} by {{rule}}. Default to dry-run mode and print planned changes. Avoid overwriting files, skip symlinks, validate paths, and keep a reversible operation log. Do not delete any files. Include instructions, example output, and tests for duplicate filenames and missing directories. Require explicit confirmation before applying changes.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{language}}` | Language | Python |
| `{{folder}}` | Folder path | ./downloads |
| `{{rule}}` | Organization rule | file extension, then year and month of modification |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Let your spreadsheet help

Transform repetitive spreadsheet work into reliable formulas.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Spreadsheets, Formulas, Workflow

```text
Help automate {{task}} in {{tool}}. Sheet structure:
{{structure}}

Provide the simplest reliable formula or script, explain each part, and include sample input and expected output. Handle blank rows, missing values, duplicates, and locale differences where relevant. Avoid changing source data. Explain any authorization required and how to test on a copy first.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{task}}` | Task | flagging duplicate email addresses and summarizing requests by status |
| `{{tool}}` | Spreadsheet tool | Google Sheets |
| `{{structure}}` | Sheet structure | A: name, B: email, C: request, D: status, E: created_at |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Webhooks without the guesswork

Connect systems with a clear, secure event contract.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Advanced  
**Tags:** Webhooks, Integration, Security

```text
Design a webhook integration between {{sender}} and {{receiver}} for {{event}}. Provide a JSON payload schema, signature verification approach, idempotency strategy, retry handling, timeout behavior, and logging that avoids sensitive data. Show a minimal receiver in {{stack}} with tests. Treat incoming data as untrusted and keep secrets in environment variables. State any assumptions about provider support.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{sender}}` | Event source | an online order service |
| `{{receiver}}` | Destination | an internal fulfillment app |
| `{{event}}` | Event | an order is paid |
| `{{stack}}` | Implementation stack | Node.js / Express |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Reports on autopilot

Plan repeatable reporting that people can actually trust.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Reports, Operations, Data

```text
Design a recurring {{frequency}} report for {{audience}} using {{sources}}. Report should include {{metrics}}. Specify ingestion, validation, aggregation, generation, and delivery steps. Define a data freshness check, failure alert, and approval process for unusual changes. Include a report outline and test checklist. Do not invent real metrics or require access credentials in the prompt.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{frequency}}` | Frequency | weekly |
| `{{audience}}` | Audience | a small operations team |
| `{{sources}}` | Data sources | a sales CSV and a support spreadsheet |
| `{{metrics}}` | Metrics | orders, revenue, refund rate, and unresolved tickets |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Find your next time-saver

Spot repetitive work that is genuinely worth automating.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Audit, Efficiency, Systems

```text
Review this workflow:
{{workflow}}

Identify repetitive steps, estimate effort using clearly labeled assumptions, and score automation opportunities by frequency, time saved, risk, and implementation complexity. Separate quick wins from larger projects. Recommend a first pilot with success measures, rollback steps, and tasks that should retain human judgment. Available tools: {{tools}}.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{workflow}}` | Current workflow | Describe your process, who does each step, and how often it happens. |
| `{{tools}}` | Available tools | Google Workspace, Slack, and a small Python script runner |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.


---

Generated from `src/data/prompts.js`. Edit the catalog and run `npm run generate:docs` to update this file.
