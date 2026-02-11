## 4.1 The fine-tuning pipeline

Fine-tuning is a multistep process. It is a pipeline that strengthens a base model’s language representations, teaches it task behavior, stabilizes training, and validates quality before release. The goal is simple: ship a smaller, faster model that speaks your users’ languages, reflects your domain, and behaves consistently across markets. 

Below is a practical, production-ready pipeline you can implement end to end. 

### 4.1.1 Phase 1: linguistic priming (make the model speak the language well)

Before you teach tasks, teach language. Multilingual bases often underrepresent target scripts, dialects, or morphology. Priming fixes that.

!!! warning "The Curse of Multilinguality"
    When a model's fixed capacity is shared across many languages, per-language performance degrades — a phenomenon known as the **curse of multilinguality** ([Conneau et al., ACL 2020](https://arxiv.org/abs/1911.02116)). Adding languages improves cross-lingual transfer up to a point, after which capacity dilution causes under-resourced languages to suffer most. Recent work such as [ATLAS (2025)](https://arxiv.org/abs/2510.22037) provides scaling laws that help predict and mitigate this trade-off. Linguistic priming — continued pretraining on target-language corpora and tokenizer expansion — directly addresses this by dedicating model capacity to your priority languages.

**What to do**

- **Continue pretraining on native corpora.** Feed the model large, unlabeled text in target languages to strengthen orthography, morphology, and syntax.
- **Fix tokenization pain.** If the tokenizer splits words into too many pieces, add high-frequency subwords and expand embeddings. Excess tokenization inflates sequence length and hurts quality and cost.
- **Balance the mix.** Include multiple domains and registers (news, support chats, documentation) so the model learns everyday style, not just formal text.

**Inputs**

Native corpora per language, tokenizer stats, high-frequency vocabulary lists.

**Outputs**

A linguistically stronger base, plus an updated tokenizer when needed.

### 4.1.2 Phase 2: behavioral alignment (teach tasks, tone, and policy)

Once the model "speaks," teach it what to do and how to sound.

**What to do**

- **Instruction-tune with high-quality examples.** Use real prompts and gold responses that reflect your domain, your style, and your policies.
- **Prefer PEFT adapters.** LoRA or QLoRA adapters let you maintain one base with many per-language or per-domain adapters. This keeps training fast and flexible.
- **Encode cultural and safety rules early.** Include refusal exemplars, politeness markers, honorifics, and regulated-content patterns in every target language.
- **Structure for reuse.** Consider separate adapters for language, domain, and safety so you can compose them as your product grows.

**Inputs**

Per-language instruction datasets, tone and style guides, safety exemplars.

**Outputs**

Task-ready adapters that follow instructions, respect tone, and apply safety norms.

### 4.1.3 Phase 3: stability control (keep what works, avoid regressions)

Multilingual training can forget earlier abilities or destabilize reasoning if you push too hard.

**What to do**

- **Use less-forgetting schedules.** Mix a small portion of the original training distribution during tuning so the model retains general skills.
- **Tune conservatively.** Lower learning rates, gradient clipping, and mixed-difficulty curricula reduce spikes and collapse.
- **Batch across languages.** Interleave high-resource and low-resource languages to avoid overfitting.
- **Early stopping with multilingual monitors.** Stop on the first sign of degradation in any priority language.

**Inputs**

Stability dashboards, per-language dev sets, training logs.

**Outputs**

Adapters that are steady across languages and resilient to prompt variation.

### 4.1.4 Phase 4: evaluation and release gates (prove it works before you ship)

Measure what users will see. Pass only models that clear clear gates.

**What to do**

- **Human-in-the-loop review.** Native speakers evaluate fluency, adequacy, cultural fit, and safety for every supported language.
- **Task-aligned metrics.** Pair automated metrics with human scores and real task success.
- **Safety stress tests.** Run multilingual red-team prompts. Harm rates can be much higher in low-resource languages, so test accordingly.
- **Regression tests.** Freeze small, high-signal suites per language to catch tone and terminology drift before release.

**Gate example**

A model ships only if it meets target accuracy, clears safety thresholds, and shows no regressions against the previous release in any language.

### 4.1.5 Phase 5: packaging and rollout (make it operable at scale)

Treat fine-tuned artifacts like product components.

**What to do**

- **Version adapters.** Name by language, domain, and date. Keep a manifest of data sources and training settings.
- **Feature-flag rollouts.** Enable per language and ramp traffic from 1–5% to wider audiences as quality holds.
- **Set fallbacks.** If confidence drops or safety triggers, fall back to retrieval-augmented answers or selective translation.
- **Monitor per language.** Track accuracy, refusal quality, and safety rates by market.

**Outputs**

A controlled release that is reversible, observable, and easy to iterate.

### 4.1.6 Data flow: from raw text to production

1. **Collect and clean** native corpora and instruction data per language.
2. **Prime** with continued pretraining and tokenizer updates where needed.
3. **Align** with instruction-tuning, using PEFT adapters for speed and modularity.
4. **Stabilize** with conservative schedules and multilingual monitoring.
5. **Evaluate** with human reviewers, automated checks, and safety stress tests.
6. **Package and ship** with versioned adapters, flags, and fallbacks.
7. **Monitor and improve** through feedback loops and periodic refreshes.

### 4.1.7 Risks to watch and how to mitigate them

- **Translationese in training data.** Overreliance on translated English creates unnatural outputs. Mitigate with native, in-situ examples and cultural review.
- **Tokenizer inefficiency.** Oversegmented scripts raise cost and lower quality. Audit fertility and expand vocabulary where needed.
- **Safety drift across languages.** Good English behavior does not guarantee good behavior elsewhere. Bake in multilingual safety from Phase 2 and test hard in Phase 4.
- **Monolithic weights.** One giant model for all languages and domains slows iteration. Prefer modular adapters you can compose.

### 4.1.8 Success metrics you can trust

- **Task success rate** per language and scenario
- **Human scores** for fluency, adequacy, tone, and cultural fit
- **Safety pass rate** across multilingual red-team suites
- **Latency and cost** improvements vs. larger general models
- **Regression stability** across releases and markets

### 4.1.9 Quickstart checklist

- Native corpora and instruction data per language
- Tokenizer audit and vocabulary plan
- PEFT setup with per-language or per-domain adapters
- Multilingual stability settings and monitors
- Human evaluation panels and safety stress tests
- Versioning, rollout flags, and fallbacks

