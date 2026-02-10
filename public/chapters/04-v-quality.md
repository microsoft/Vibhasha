## Verification and Quality Assurance

Finetuning raises the ceiling on multilingual performance, but quality does not take care of itself. You need a repeatable process that proves your finetuned model is accurate, culturally aligned, safe, and stable across languages. This section gives you a practical framework for qualifying multilingual models before and after release.

!!! tip "See also"
    For foundational evaluation concepts—including LLM-as-judge pipelines, metric rubrics, calibration with human judgments, and dataset selection—see the [Evaluation chapter](/playbook/01-evaluation). 

### What multilingual QA must prove

A rigorous QA program answers six questions:

1. **Fluency.** Do outputs read naturally to native speakers in each target language?
2. **Adequacy.** Does meaning match the source input with no omissions or distortions?
3. **Cultural fit.** Is tone, formality, and phrasing appropriate for the audience and scenario?
4. **Factuality.** Are statements grounded, verifiable, and free of hallucinations, especially in low-resource languages?
5. **Safety.** Do responses avoid harmful, biased, or disallowed content across all languages at acceptable rates?
6. **Consistency.** Does behavior remain stable across languages, prompts, and releases?

A model ships only when you can answer "yes" for the languages and tasks in scope.

### A layered QA pipeline that works

Build QA as a set of complementary checks rather than a single metric.

**1) Automated checks for fast feedback**

Use machine checks to catch obvious problems early.

- Format and schema validation
- Terminology enforcement against per-language glossaries
- Length, list, and structure checks
- Simple profanity and PII flags per language
- Basic semantic similarity to detect severe drift

Automated checks are your first screen, not your final gate.

**2) Human-in-the-loop review as the gold standard**

Native-speaker panels evaluate high-impact samples for:

- **Fluency** and readability
- **Adequacy** against the source
- **Cultural fit** for tone and politeness
- **Safety** in context
- **Task success** for real scenarios

Calibrate reviewers with guidelines, exemplars, and short pilot runs. Track inter-annotator agreement and retrain reviewers if agreement drops.

**3) Calibrated LLM-as-a-judge for scale**

Use LLM-based judging to triage large batches once you have calibrated prompts against human labels. Limit each scoring call to a single criterion, log rationales, and regularly re-anchor to a human-labeled control set.

**4) Multilingual red-team safety tests**

Probe refusal quality, content filters, and jailbreak resilience in every language. Include code-switching, transliteration, homoglyphs, and unicode obfuscation. Track unsafe-response rate per language and keep it below a defined threshold.

**5) Regression suites per language**

Freeze small, high-signal test sets that catch tone drift, terminology changes, and formatting regressions. Run on every adapter update and block release on failures.

### Designing strong human evaluations

Human evaluation is most effective when it is systematic.

- **Sampling.** Stratify by language, task, risk level, and channel. Oversample low-resource languages and safety-sensitive scenarios.
- **Rubrics.** Score 1 to 5 for fluency, adequacy, cultural fit, and safety. Require short text justifications for scores of 1 to 2.
- **Agreement.** Track percentage agreement and use simple spot checks with seeded duplicates. Investigate when agreement falls.
- **Confidence.** Ask reviewers to mark "low confidence" when inputs are ambiguous; route those cases to product owners for policy decisions.

Aim for smaller, higher-quality panels rather than large, noisy ones.

### Acceptance criteria and release gates

Define clear pass/fail thresholds before testing begins.

- **Fluency.** Mean human score ≥ 4.0 with ≤ 5% of samples below 3, per language.
- **Adequacy.** Mean score ≥ 4.0; no critical omissions on safety or compliance content.
- **Cultural fit.** Mean score ≥ 4.0; zero critical tone violations in customer-facing scenarios.
- **Factuality.** Hallucination rate ≤ target (set a tighter target for regulated domains).
- **Safety.** Unsafe-response rate ≤ threshold per language and ≤ threshold overall; no redline violations.
- **Consistency.** No statistically significant regressions against the previous release for priority languages.

Block the release if any gate fails. Publish a short QA report so decisions are auditable.

### Factuality and hallucination control

Multilingual hallucinations often rise as language resources fall. Use multiple lines of defense.

- **Grounding.** Prefer retrieval-augmented answers for facts that should match a source of truth.
- **Attribution.** Require sources for claims in regulated flows.
- **Roundtrip checks.** Backtranslate outputs to spot meaning drift.
- **Cross-language spot checks.** Ask two languages the same factual question and compare claims for contradictions.
- **LLM-as-a-judge prompts.** Score factuality per sentence, but always revalidate with humans for critical content.

Track hallucination rate and top error types in a per-language dashboard.

### Cultural and style verification

Ensure the model adheres to per-language style guides.

- Honorifics and polite forms where required
- Region-appropriate greetings and closings
- Register control for support vs. marketing vs. legal
- Local measurement units, dates, and currency formats
- Sensitive-topic phrasing that avoids accidental offense

Add lightweight rule checks for these items and escalate mismatches to human review.

### Safety QA across languages

Safety cannot be assumed to transfer from English.

- **Test sets.** Maintain per-language sets that include global harms and local harms that are culture-specific.
- **Adversarial prompts.** Include slang, code-switching, and script variations.
- **Refusal quality.** Evaluate whether refusals are polite, clear, and helpful in the local norm.
- **Escalations.** Route uncertain or sensitive cases to policy owners with language expertise.

Track unsafe-response rate and refusal-quality score by language and scenario.

### Production monitoring and feedback loops

QA does not end at release. Watch live signals and feed them back into tuning.

- **Sampling in production.** Randomly sample outputs per language and rescore with human panels.
- **User feedback signals.** Monitor thumbs up or down, recontact rates, and transfer-to-human metrics.
- **Drift detection.** Alert when response length, refusal rate, or terminology usage shifts beyond bands.
- **Hotfix playbook.** If a language regresses, reduce traffic, switch to a previous adapter, or fall back to selective translation plus RAG while you retrain.

Document each remediation with a short post-release note.

### Tooling that saves time

You do not need a heavy stack to get reliable QA.

- Lightweight annotation tools for panel reviews
- Prompt libraries for LLM-as-a-judge with versioned templates
- Per-language dashboards that track accuracy, safety, and tone
- Simple scripts for glossary enforcement and format validation
- Canary and feature-flag controls for staged rollouts

Choose tools that your localization and product teams can use without engineering help.

### Key metrics to track

- Human scores for fluency, adequacy, and cultural fit per language
- Unsafe-response rate and refusal-quality score per language
- Hallucination rate on factual tasks
- Task success rate and error-type distribution
- Regression failures on frozen suites
- Latency and cost per request after finetuning vs. baseline

Make these metrics visible and review them in release meetings.

### Quickstart checklist

- Per-language style guides and glossaries in place
- Layered QA pipeline with automated checks, human panels, and calibrated LLM-judging
- Red-team safety tests for each language
- Clear acceptance gates and a block-on-fail policy
- Production sampling, drift alerts, and a hotfix plan
- A short QA report attached to every release

---

