# Safety

Safety is the backbone of any multilingual AI system. A model that behaves responsibly in English may behave unpredictably in other languages, especially low-resource ones. Safety performance varies widely across languages, and multilingual models often fail in ways that are invisible until tested: polite refusals disappear, unsafe outputs increase, and harmful prompts slip through undetected. 

This chapter helps you build a multilingual safety program that is proactive, consistent, and grounded in real-world behavior across regions. 

## Safety assessments

Safety assessments reveal how your system behaves across languages, cultures, and use cases. Many teams assume that safety guardrails built for English will transfer automatically. They do not. Failure rates can increase dramatically in low-resource languages, and multilingual jailbreaking attacks are more successful in languages the model was not heavily trained on.

A safety assessment should uncover blind spots, measure risks accurately, and guide improvements before deployment.

### Why multilingual safety is harder than English-only safety

Multilingual safety faces several unique challenges that require a dedicated strategy.

**1. Uneven training data across languages**

Models learn safety behavior largely from English text because English dominates the training mix. Safety-related examples in other languages are sparse, uneven, or completely absent. This leads to:

- Weak refusal behavior
- Poor detection of harmful intent
- Inconsistent handling of sensitive topics

**2. Linguistic complexity**

Some languages encode politeness, harm, or intent differently. Direct translation is not enough to detect meaning accurately.

**3. Higher vulnerability to attacks**

Jailbreak attempts that fail in English may succeed in:

- Code-switched prompts
- Non-Latin scripts
- Dialect variants
- Homoglyph or unicode tricks

Attackers use these linguistic gaps to bypass safety filters.

**4. Cultural differences in what constitutes harm**

What is considered offensive, sensitive, or inappropriate varies widely across cultures. Safety must reflect those cultural definitions, not just English ones.

### Core components of a multilingual safety assessment

Your assessment should include five parallel evaluations. Each contributes a different signal.

**1. Harmful content detection**

Test whether the model produces harmful or sensitive content across languages.

Categories to test:

- Violence
- Hate or harassment
- Self-harm
- Extremism
- Mis/disinformation
- Adult content
- Medical or legal misinformation
- Cultural or religious sensitivity

Track harmful-output rates per language. Expect higher rates in low-resource languages unless you intervene.

**2. Refusal quality tests**

Safety is not only about refusing harmful prompts. It is also about *refusing well*.

Effective refusals should be:

- Polite
- Clear
- Supportive
- Culturally appropriate
- Helpful when redirecting the user to safe alternatives

A refusal that sounds cold or accusatory can damage trust.

**3. Jailbreak vulnerability tests**

Evaluate resilience to attacks that attempt to bypass safety guardrails.

Attack types to include:

- Prompt obfuscation
- Multi-language prompts
- Code-switching
- Homoglyph use
- Script variations (for example, Cyrillic, Arabic, Devanagari)
- Indirect prompting
- Emotion or empathy-based manipulation
- Role-play scenarios
- Logic-override attacks

Track jailbreak success rate per language. A model with a 1% jailbreak rate in English may show 10 to 20% in low-resource languages.

**4. Cultural-sensitivity evaluation**

Some harms are culturally specific. A model must understand culturally sensitive topics, taboo areas, and local norms.

Examples include:

- Politically sensitive entities
- Religious references
- Regionally taboo terms
- Sensitive historical events
- Social-identity references
- Honorific norms and politeness systems

Include native speakers in evaluation to capture nuance.

**5. Safety in multilingual RAG systems**

When using retrieval-augmented generation, assess:

- Whether the model pulls inappropriate or outdated content in the target language
- Whether summarized content maintains tone and meaning
- Whether hallucinations occur when mixed languages appear in the retrieved text

RAG improves safety when grounded correctly, but can amplify harm if retrieval is not carefully curated.

### How to structure a multilingual safety test suite

Below is a practical blueprint for building a comprehensive assessment.

**1. Build a shared taxonomy**

Define harms and severity levels globally.
Add regional and cultural extensions as needed.

**2. Create per-language test sets**

Aim for:

- High-resource languages
- Low-resource languages
- Dialect variants
- Code-switched examples

**3. Use multiple prompt types**

Include:

- Direct harmful requests
- Subtle, indirect intent
- Emotional manipulation
- Requests disguised as educational queries
- Adversarial obfuscation

**4. Evaluate at three layers**

- Model output
- Post-processing filters
- Final user-facing response

**5. Track metrics per language**

Minimum metrics include:

- Unsafe-response rate
- Jailbreak success rate
- Refusal quality score
- Cultural sensitivity violations
- Misclassification rate for harmful intent

These metrics become your ongoing safety dashboard.

### Human reviewers are essential

Native-language reviewers catch failures that automated tests cannot. Prioritize regions where harm risk is highest or language resources are lowest.

Reviewers should assess:

- Tone of refusals
- Cultural appropriateness
- Accuracy of harm detection
- Completeness of harmful-content refusal
- Potential unintended harms

Set up a reviewer panel that covers multiple dialects rather than a single monolithic language sample.

### Automated and LLM-based judging

Automated safety classifiers are useful but must be calibrated per language.

- Do not assume English classifiers generalize.
- Add per-language keyword lists for sensitive topics.
- Use multilingual embeddings for semantic harm detection.
- Validate classifier behavior against human labels.

LLM-as-a-judge can help with triage, but must be anchored to human-reviewed examples.

### Key takeaways

- Safety varies dramatically across languages.
- Low-resource languages often show higher harm and jailbreak rates.
- Safety assessments must include cultural nuance, not just direct harm detection.
- Test with adversarial methods across scripts, dialects, and code-switched prompts.
- Track safety metrics per language to detect hidden risks.
- Native-speaker review is essential for culturally aligned safety.


<!-- ## Foundational Concepts: The Multilingual Threat Landscape

### Taxonomy of LLM Harms and Cross-Cultural Sensitivity

LLM failure modes can be categorized into two broad areas with distinct manifestations in multilingual contexts:

#### Content Harms
- **Toxicity**: Generation of offensive or harmful content including culturally-specific slurs
- **Bias**: Unfair treatment or representation of groups, often missed in under-studied languages  
- **False Information**: Factually incorrect content, exacerbated in low-resource languages
- **Hallucinations**: Models "guessing" answers when they lack knowledge in certain languages

#### Behavioral Harms
- **Jailbreaking**: Bypassing safety mechanisms through multilingual prompt crafting
- **Prompt Injection**: Manipulation through crafted inputs across language boundaries
- **PII Leakage**: Revealing sensitive data memorized from non-English training text
- **Cross-lingual Inconsistencies**: Different safety responses across languages

!!! info "Global vs. Local Harm"
    A critical distinction in multilingual safety assessment:
    
    - **Global Harm**: Content universally recognized as unsafe (e.g., explicit violence)
    - **Local Harm**: Context-specific content dependent on cultural norms and sociolinguistic context

### The Low-Resource Vulnerability Gap: Empirical Evidence

Safety alignment mechanisms like **RLHF** and preference tuning are primarily trained on high-resource English data. When deployed globally, generalization to linguistically distinct, low-density data spaces is often incomplete.

!!! warning "The 3× Risk Multiplier"
    **Low-resource languages exhibit approximately 3× the likelihood of encountering harmful content** compared to high-resource languages across models like ChatGPT and GPT-4.

#### Key Empirical Findings:
- **Unintentional bypass**: Users querying in low-resource languages are ~3× more likely to receive policy violations
- **Intentional attacks**: Multilingual jailbreaking achieves 80.92% success rate on ChatGPT, 40.71% on GPT-4
- **Cultural context matters**: Terms like "banana" can be derogatory slurs in some Asian contexts while harmless elsewhere

### Multilingual Safety Challenges

#### Cultural and Linguistic Variability
Languages differ in slang, taboos, and cultural context. An innocuous phrase in one language might be deeply offensive in another. Simply translating English safety filters is insufficient.

#### Coverage Gaps
Even high-resource languages beyond English (Arabic, Hindi, etc.) have been understudied in LLM safety research, resulting in weaker guardrails for non-English inputs.

#### Cross-lingual Evasion Techniques
- **Language switching**: Models may refuse requests in English but comply in other languages
- **Code-switching**: Mixing languages or scripts confuses safety systems
- **Unicode evasion**: Using non-English characters to bypass content filters
 -->
