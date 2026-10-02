# Research prompts

Ask better questions. Discover deeper answers.

## Go beyond the first answer

Build a grounded research brief, with the gaps left visible.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Research, Evidence, Deep dive

```text
Act as a careful research assistant. Prepare a brief on {{question}} for {{audience}} using these sources:

{{sources}}

Separate established findings, interpretations, and unresolved questions. Cite each factual claim to an identifiable provided source. Compare conflicting evidence, note source dates and limitations, and summarize practical implications. If sources are missing, produce a research plan and search queries instead of invented findings or citations. Finish with the three most useful next questions.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{question}}` | Research question | how does a four-day workweek affect small-team productivity? |
| `{{audience}}` | Audience | a small business considering a pilot |
| `{{sources}}` | Sources or source excerpts | Paste source URLs with excerpts, or write “no sources yet.” |

**Tip:** Supply actual sources or use an AI tool with browsing. Always open and verify citations before relying on a research result.

---

## A clearer research paper

Understand what a paper says, and what it does not.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Intermediate  
**Tags:** Papers, Analysis, Critical thinking

```text
Analyze the following research paper text:

{{paper}}

For a {{audience}} audience, explain the research question, methodology, sample, main results, limitations, and what cannot be concluded. Distinguish correlation from causation. Quote key supporting passages and do not infer results from the title alone. End with a plain-language summary and five questions for critical discussion.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{paper}}` | Paper text | Paste the abstract and relevant sections here. |
| `{{audience}}` | Audience | non-specialist graduate student |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Map the conversation

See the themes, tensions, and gaps across your sources.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Advanced  
**Tags:** Literature review, Synthesis, Evidence

```text
Create a literature synthesis for {{topic}} from these source summaries:

{{sources}}

Organize by theme rather than one paragraph per paper. Provide a source comparison matrix with methods, findings, limitations, and relevance. Identify agreement, disagreement, and research gaps. Use only the supplied evidence and label missing information. Propose three precise follow-up research questions.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{topic}}` | Research area | AI-assisted learning |
| `{{sources}}` | Source summaries | Paste source titles, dates, methods, and key findings here. |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Ask questions that open doors

Plan useful interviews without leading people to an answer.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** User research, Interviews, Discovery

```text
Design a {{duration}}-minute semi-structured interview about {{topic}} with {{participants}}. Research goal: {{goal}}. Include an introduction with consent language, warm-up questions, open-ended core questions, neutral follow-up probes, and a closing. Avoid leading, double-barreled, or judgmental wording. Suggest how to record observations and protect participant privacy.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{duration}}` | Minutes | 30 |
| `{{topic}}` | Topic | how people organize personal creative projects |
| `{{participants}}` | Participants | freelance designers |
| `{{goal}}` | Goal | understand current workflows and unmet needs |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## From dataset to discovery

Know what to ask before reaching for a chart.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Advanced  
**Tags:** Data, Analysis, Statistics

```text
Create an exploratory analysis plan for {{dataset}} to answer {{question}}. Columns and data types:
{{schema}}

Describe data-quality checks, descriptive statistics, useful visualizations, potential confounders, and appropriate analysis methods. Distinguish descriptive insights from causal claims. Suggest reproducible steps in {{tool}} and explain the limitations. Do not invent numerical results without the data.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{dataset}}` | Dataset | a customer feedback survey |
| `{{question}}` | Question | which experiences are associated with repeat purchases? |
| `{{schema}}` | Columns | customer_id, satisfaction_score, delivery_days, repeat_purchase, segment |
| `{{tool}}` | Analysis tool | Python / pandas |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.

---

## Put a claim under the lens

Separate what is supported from what still needs checking.

**Compatible tools:** ChatGPT, Claude, Gemini  
**Level:** Beginner  
**Tags:** Fact-checking, Sources, Critical thinking

```text
Evaluate this claim: {{claim}}. Evidence supplied:

{{evidence}}

Break it into testable subclaims. For each, assess what the evidence supports, source reliability, missing context, and alternative explanations. Use the labels supported, contradicted, or insufficient evidence. Do not fabricate facts or citations. If browsing is unavailable, provide a verification checklist and suggested search queries.
```

### Make it yours

| Field | Description | Example |
| --- | --- | --- |
| `{{claim}}` | Claim to evaluate | remote work always improves productivity |
| `{{evidence}}` | Evidence | Paste source excerpts and dates here, or write “none provided.” |

**Tip:** Start with the example values, then change one detail at a time. Review the result and ask for a specific improvement.


---

Generated from `src/data/prompts.js`. Edit the catalog and run `npm run generate:docs` to update this file.
