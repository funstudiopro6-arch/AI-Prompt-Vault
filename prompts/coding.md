# Coding prompts

From your first function to your next big build.

## Your next great React component

From a rough idea to clean, accessible, working code.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** React, Frontend, Accessible

```text
Act as a senior front-end engineer. Build {{component}} using {{stack}}. Requirements: {{requirements}}. Prioritize accessible semantics, keyboard interaction, responsive layouts, and clear component boundaries. Explain assumptions before coding. Return the complete implementation, any necessary styles, and tests for the important interactions. Avoid unnecessary dependencies. Explain how to run it and note any edge cases or limitations.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{component}}` | Component | a searchable command palette |
| `{{stack}}` | Tech stack | React and plain CSS |
| `{{requirements}}` | Requirements | keyboard navigation, Escape to close, grouped results, and an empty state |

**Tip:** Paste your existing interfaces or design tokens for an implementation that fits your project. Run and review any generated code before using it.

---

## Your patient debugging partner

Find the root cause, not another temporary workaround.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Debugging, Problem-solving, Testing

```text
Act as a debugging partner for {{language}}. I am seeing {{symptom}}. Here is the relevant code and error output:

{{code}}

Expected behavior: {{expected}}. First identify missing information. Rank likely causes using evidence, then propose the smallest safe fix. Explain why it works, show a minimal diff, and suggest a regression test. Do not invent APIs or assume the error is resolved without a test.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{language}}` | Language or stack | JavaScript / React |
| `{{symptom}}` | What went wrong | the search results do not update after typing |
| `{{code}}` | Code and error output | Paste the smallest reproducible example here. |
| `{{expected}}` | Expected behavior | results update as the search query changes |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## A second pair of eyes

Review your code for clarity, safety, and maintainability.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Code review, Security, Quality

```text
Review the following {{language}} code as a constructive senior engineer:

{{code}}

Context: {{context}}. Prioritize correctness, security, accessibility where relevant, and maintainability. Separate blockers from optional improvements. For each finding provide severity, evidence, impact, and a small actionable fix. Do not flag hypothetical issues without explaining the condition that would trigger them. Finish with a concise test checklist.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{language}}` | Language | TypeScript |
| `{{code}}` | Code to review | Paste your code here. |
| `{{context}}` | Project context | a production web app with user-submitted data |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Design a thoughtful API

Build a practical contract before writing the endpoints.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Advanced  
**Tags:** API, Backend, Architecture

```text
Design a REST API for {{domain}} using {{stack}}. Core use cases: {{use_cases}}. Provide resource definitions, endpoint methods and paths, request and response examples, validation rules, pagination, authentication and authorization boundaries, and consistent error shapes. Address idempotency where relevant. Include an OpenAPI-style outline and a pragmatic implementation plan. State assumptions and avoid unnecessary microservices.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{domain}}` | Product or domain | a team task manager |
| `{{stack}}` | Backend stack | Node.js and PostgreSQL |
| `{{use_cases}}` | Core use cases | create tasks, assign members, comment, and filter by status |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Tests that actually matter

Cover the happy path, the edge cases, and the surprises.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Testing, Quality, Edge cases

```text
Write meaningful {{framework}} tests for this function or component:

{{code}}

Behavior contract: {{contract}}. Include happy paths, boundary cases, invalid input, and a regression scenario. Prefer testing public behavior over internal details. Explain what each test protects and any setup needed. Flag untestable assumptions and suggest minimal refactors only when necessary.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{framework}}` | Test framework | Vitest |
| `{{code}}` | Implementation | Paste the function or component here. |
| `{{contract}}` | Expected contract | Describe the inputs, outputs, and important behavior. |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Make your database query click

Turn tricky data questions into clear, efficient SQL.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** SQL, Database, Analytics

```text
Help write a {{dialect}} SQL query for {{question}}. Database schema:
{{schema}}

Explain the joins, filters, aggregations, and null handling. Provide a readable query, then discuss relevant indexes and how to inspect the query plan. Show example output using clearly labeled fictional data. Do not assume table names or columns not in the schema. If information is missing, ask before producing the final query.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{dialect}}` | SQL dialect | PostgreSQL |
| `{{question}}` | Data question | which customers placed more than three orders last month? |
| `{{schema}}` | Database schema | customers(id, name); orders(id, customer_id, created_at, total) |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.


---

Generated from `src/data/prompts.js`. Edit the catalog and run `npm run generate:docs` to update this file.
