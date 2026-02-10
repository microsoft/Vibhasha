## Multilingual Safety Evaluation: Benchmarks and Datasets

Safety benchmarks provide the structure and visibility needed to test multilingual behavior consistently. They act as the foundation for release gates, regression tracking, and safety audits. 

### Recommended multilingual safety benchmarks

A strong suite combines native, adversarial, and culturally nuanced datasets:

- **RTPLX.** Native multilingual toxicity prompts.
- **PolyglotToxicityPrompts.** Real-world toxic prompts across languages.
- **Aya Red Teaming.** Curated multilingual harms with difficulty levels.
- **ALMBench.** Culturally grounded multilingual evaluation.
- **Multilingual Jailbreak Challenge.** Stress tests for safety controls.
- **LinguaSafe.** Underrepresented language prompts and sensitive content.

Use at least one natural dataset, one adversarial dataset, and one cultural dataset.

### Building a practical benchmark suite

**1. Select languages by tier**

- Tier A: `high‑resource`
- Tier B: `mid‑resource`
- Tier C: `low‑resource` and culturally sensitive

**2. Assign datasets per tier**

Pair datasets to maximize coverage.

**3. Size the test sets**

- 1,000–3,000 prompts per language for automated evaluation
- 200–400 frozen regression samples per language

**4. Add product‑specific slices**

Include domain‑specific harms and culturally sensitive prompts.

### Scoring and release gates

Define thresholds before testing:

- **Unsafe‑response rate:** for example, ≤ 1% Tier A; ≤ 2–3% Tier B; ≤ 3–5% Tier C
- **Jailbreak success rate:** ≤ 1–3% depending on tier
- **Refusal‑quality score:** target ≥ 4.0 average
- **Cultural‑sensitivity violations:** zero critical cases
- **Consistency index:** ensure stable behavior across languages

A build ships only when all languages pass their gates.

### Running the benchmark workflow

1. Prepare prompts by dataset, harm type, and language.
2. Generate outputs with consistent model settings.
3. Score automatically first.
4. Use LLM‑as‑a‑judge for triage.
5. Conduct human review for a sampled set.
6. Aggregate and compare results per language.
7. Gate the build based on thresholds.
8. Publish a one‑page safety report.

### Extending with in‑house datasets

- Collect native prompts from real interactions (with PII removed).
- Transcreate English harms into culturally realistic examples.
- Label with clear rubrics.
- Version, freeze, and maintain sets over time.
- Ensure coverage across dialects and cultural groups.

### Key benchmark takeaways

- Multilingual safety demands structured, reproducible test suites.
- Combine native, adversarial, and cultural datasets for full coverage.
- Track metrics and regressions per language.
- Gate releases on safety metrics just like functional metrics.
- Maintain in‑house sets for domain- and culture-specific risks.

<!-- ### Key Multilingual Safety Datasets

#### RTP-LX: Multilingual Toxicity Evaluation
- **Coverage**: 1,000+ toxic prompts in **28 languages**
- **Methodology**: Human-transcreated and annotated, includes culturally specific toxic language
- **Key Finding**: Models showed low agreement with human judgments on nuanced cases and context-dependent harms

#### PolygloToxicityPrompts (PTP)
- **Scale**: **425K naturally occurring prompts** in **17 languages**
- **Source**: [https://github.com/kpriyanshu256/polyglo-toxicity-prompts](https://github.com/kpriyanshu256/polyglo-toxicity-prompts)
- **Methodology**: Native toxic content from web (not translation-based)
- **Key Findings**: 
  - Toxicity increases as language resources decrease
  - Larger models can produce more toxicity unless properly aligned
  - Different preference-tuning methods don't significantly change outcomes

#### Aya Red Teaming Dataset
- **Coverage**: Harmful prompts in **8 languages** across **9 harm categories**
- **Unique Feature**: Distinguishes between "global" vs "local" harms
- **Impact**: Preference-based training reduces harm by ~37% on average across languages

#### ALM-Bench (All Languages Matter)
- **Scale**: Multimodal benchmark across **100 languages**
- **Focus**: Cultural and linguistic inclusivity with 22.7K Q&A pairs
- **Safety Implications**: Reveals bias and misunderstanding in culturally diverse contexts

#### Multilingual Jailbreak Challenge
- **Coverage**: Adversarial prompts in **10 languages**
- **Key Results**:
  - Unintentional: Low-resource prompts 3× more likely to yield policy violations
  - Intentional: 81% success rate bypassing ChatGPT's safety

#### LinguaSafe
- **Coverage**: Comprehensive safety benchmark for **12 languages** including under-represented languages (e.g., Hungarian, Malay)
- **Dataset URL**: [https://huggingface.co/datasets/zhiyuan-ning/linguasafe](https://huggingface.co/datasets/zhiyuan-ning/linguasafe)
- **Methodology**: Includes Translated, Transcreated, and Native-sourced content
- **Key Feature**: Native content exhibits higher levels of toxicity and nuance than purely translated data

### Data Collection Methodology

!!! important "Key Principle"
    **Native content** exhibits significantly higher toxicity levels and more nuanced harm expressions than translated content.

#### Data Type Hierarchy:
=== "Translated Data"
    Simple translation of English safety datasets into target languages

=== "Transcreated Data"
    Localized data ensuring cultural equivalence and linguistic authenticity - **crucial for capturing local harm**

=== "Native Data"
    Content directly sourced and curated in the target language

#### Practical Workflow:
1. **Initial Translation**: Use tools like NLLB for preliminary translation
2. **Human Review**: Essential transcreation step with culturally aware annotators
3. **Quality Control**: Require verified linguistic proficiency and cultural sensitivity training

#### Comparative Analysis of Datasets

| Dataset | Primary Focus | Languages | Source Methodology | Critical Feature |
|---------|--------------|-----------|-------------------|------------------|
| **RTP-LX** | Toxicity Detection | 28 | Human-transcreated | Culturally specific toxic language |
| **PTP** | Toxicity Elicitation | 17 | Native web content | Naturally occurring prompts |
| **Aya Red Teaming** | Harmful Prompts | 8 | Human annotations | Global vs. local harm distinction |
| **ALM-Bench** | Cultural Inclusivity | 100 | Native speaker curation | Multimodal cultural content |

 -->
