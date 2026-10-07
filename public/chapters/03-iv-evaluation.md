## 3.4 Testing and validating your approach

A prompting strategy that works in English may fail in Yoruba. A model that excels on a benchmark may underperform on your specific task. The only way to know what works is to test systematically. This section provides a practical framework for evaluating multilingual prompting configurations.

### 3.4.1 Build a representative test set

Your test set should reflect the actual inputs your system will encounter in production. This means going beyond generic benchmark data and creating examples specific to your domain, user base, and language mix.

**Guidelines for building your test set:**

- **Size** — 50–100 examples per language is a practical starting point for comparing models and prompting strategies. Larger sets (200+) are better for production readiness decisions.
- **Diversity** — Include a range of topics, difficulty levels, and edge cases. Avoid over-representing any single pattern.
- **Cultural relevance** — Include examples that test cultural knowledge specific to each target language (local names, customs, units of measurement, date formats).
- **Realistic distribution** — Match the topic and complexity distribution of your actual use case. If 80% of your queries are simple and 20% are complex, your test set should reflect that.

!!! warning "Avoid English-translated test sets"
    Do not create test examples in English and translate them into the target language. Translated test sets miss language-specific patterns, idioms, and cultural references. Whenever possible, have native speakers create or review test examples directly in the target language.

### 3.4.2 What to compare

When evaluating multilingual prompting, you should vary three dimensions independently:

| **Dimension** | **Options to test** |
|---|---|
| **Model** | 2–3 candidate models with different strengths |
| **Prompting strategy** | Monolingual, cross-lingual, translate-test, and variants |
| **Number of examples** | Zero-shot, 3-shot, 5-shot |

A systematic comparison across these dimensions yields a matrix of results that reveals the best configuration for your specific use case.

**What to measure:**

=== "Accuracy metrics"
    - Task-specific accuracy (exact match, F1, BLEU, etc.)
    - Consistency across languages — does the model perform similarly across all target languages, or are some much weaker?
    - Edge case handling — how well does the model handle ambiguous or unusual inputs?

=== "Quality metrics"
    - Fluency — is the output grammatically correct and natural in the target language?
    - Cultural appropriateness — does the output respect cultural norms and conventions?
    - Factual accuracy — does the model hallucinate or produce incorrect information?

=== "Operational metrics"
    - Latency — how long does each prompting strategy take, including any translation steps?
    - Cost — what is the per-query cost, accounting for differences in tokenization efficiency across languages?
    - Token count — how many tokens does each prompt require? Languages with less efficient tokenization consume more tokens for the same content.

### 3.4.3 A practical evaluation workflow

Follow this workflow to find the best prompting configuration for your multilingual application:

**Step 1 — Baseline in English.** Run your task with an English test set and your default prompt. This establishes the quality ceiling the model can achieve in its strongest language.

**Step 2 — Direct monolingual test.** Run the test set in each target language using monolingual prompting (English instruction + native examples). This shows you how much quality drops from the English baseline.

**Step 3 — Cross-lingual test.** Repeat with cross-lingual prompting (English instruction + English examples + native input). Compare against the monolingual results.

**Step 4 — Translate-test (if applicable).** For languages with strong MT support, run the translate-test pipeline and compare. Note the added latency and cost.

**Step 5 — CoT variants (for reasoning tasks).** Test both native-CoT and En-CoT. For complex tasks, also test cross-thought prompting.

**Step 6 — Human evaluation on top candidates.** Take the top 2–3 configurations from automated evaluation and run human evaluation. Ask native speakers to rate outputs for fluency, accuracy, and cultural appropriateness.

!!! success "What good looks like"
    A well-validated prompting configuration achieves:
    
    - Accuracy within 5–15% of the English baseline for high-resource languages
    - Consistent performance across all target languages (no single language is dramatically worse)
    - Fluent, natural output that native speakers rate highly
    - Acceptable latency and cost for your production constraints

---

### 3.4.4 Common failure modes

Watch for these patterns during evaluation — they indicate that your prompting strategy needs adjustment:

- **Language collapse** — The model responds in English even when prompted in another language. This often happens with cross-lingual prompting when the English examples dominate. Fix: add an explicit instruction for the output language, or include one native-language example.
- **Cultural hallucination** — The model produces culturally incorrect information (wrong holidays, inappropriate names, incorrect social norms). Fix: include culturally grounded examples in your prompt, or use native-language examples.
- **Inconsistent safety** — The model's safety behaviors are weaker in non-English languages. Fix: test safety prompts in all target languages and consider adding multilingual safety instructions.
- **Tokenization cost explosion** — The prompt consumes far more tokens in some languages than others, leading to unexpected cost increases. Fix: test tokenization efficiency early and budget accordingly.

!!! warning "Safety must be tested per-language"
    Models often have weaker safety guardrails in non-English languages. Jailbreaks that fail in English may succeed in other languages. Always test safety behaviors in each target language independently. For more guidance, see the [Safety chapter](/playbook/05-safety).

---

### 3.4.5 Iterating and adapting

Multilingual prompting is not a one-shot process. Plan for ongoing iteration:

- **Monitor per-language metrics in production.** Quality can drift over time, especially after model updates.
- **Collect user feedback per language.** Low-resource language users are especially likely to encounter issues that automated metrics miss.
- **Re-evaluate when you add new languages.** A prompting strategy that works for Spanish and Hindi may not work for Quechua or Tigrinya without modification.
- **Consider automated prompt selection.** Frameworks like [LEAP (Nambi et al., 2023)](https://arxiv.org/abs/2307.07295) dynamically select the optimal prompting configuration based on the specific task and language, achieving approximately 15% improvement across languages compared to any single fixed strategy.

!!! info "Source"
    The evaluation workflows and failure modes described in this section draw on findings from the [ACL 2023 tutorial on multilingual prompting](https://www.microsoft.com/en-us/research/people/susitara/) and practical guidelines from [Vatsal & Huang (2025)](https://arxiv.org/abs/2505.11665), which surveyed 39 prompting techniques across 250 languages and 30 NLP tasks.
