## 5.1 Vulnerabilities
Multilingual systems introduce safety vulnerabilities that often do not appear in English-only deployments. These vulnerabilities emerge from gaps in training data, differences in cultural norms, and the varied ways language encodes harmful intent. Understanding these weaknesses is essential for building systems that behave safely across all supported languages. 

This section outlines the primary categories of multilingual vulnerabilities and explains how to address them. 

### 5.1.1 Why multilingual models have unique vulnerabilities

At their core, large language models learn from patterns in text. Because English dominates available training data, multilingual safety is inherently uneven. In practice, this means:

- The model knows how to refuse harmful requests in English, but may fail to recognize the same request in Zulu or Nepali.
- Jailbreak prompts succeed more easily in languages the model has not seen often.
- Cultural or regional harms may not be well defined in the training corpus.
- Safety tools built on English assumptions miss danger in other languages.

These weaknesses create real risks for global deployments.

### 5.1.2 Major vulnerability categories

**1. Uneven refusal behavior across languages**

Refusal patterns learned in English do not automatically generalize to other languages. This can result in:

- Inconsistent safety thresholds
- Polite refusals in English but blunt or confusing refusals elsewhere
- Successful harmful completions in low-resource languages
- Incorrect acceptance of dangerous prompts
- Safe outputs that sound rude or culturally inappropriate

This inconsistency erodes trust and increases risk.

**2. Meaning drift through translation**

Translation introduces safety risks when key details are lost or distorted.

Common forms of drift include:

- Harmful intent becoming ambiguous
- Warnings becoming softer or less clear
- Phrasing that appears harmless after translation
- Sensitive or taboo content becoming diluted
- User questions being misinterpreted

Meaning drift is especially dangerous when the system relies on translation to detect harmful intent.

**3. Code-switching and mixed-script attacks**

Attackers use language mixing to bypass safety filters. Examples include:

- Alternating between languages in the same sentence
- Embedding harmful phrases in transliterated form (for example, Arabic written in Latin script)
- Mixing scripts with similar-looking characters (homoglyph attacks)
- Switching mid-prompt to confuse intent detection
- Using slang or regional dialects unfamiliar to the model

These attacks often succeed because English-oriented safety filters cannot parse mixed-language input.

**4. Underspecified cultural harms**

Many harms are culturally specific. What is offensive, taboo, or dangerous varies across regions.
Examples:

- References to sensitive historical events
- Religious or spiritual content
- Political commentary
- Terms related to caste, ethnicity, or regional identity
- Local health misinformation or dangerous home remedies

If a model is unaware of these sensitivities, it may produce harmful or offensive content unintentionally.

**5. Jailbreak vulnerabilities in low-resource languages**

Low-resource languages often have limited representation in safety datasets. This makes them fertile ground for jailbreaks.

Patterns include:

- Direct instructions to bypass safety controls
- Harmful requests phrased politely
- Emotional manipulation in local phrasing
- Dialect variations that safety filters do not recognize
- Indirect requests that English-trained classifiers miss

Studies show that jailbreak success rates can be many times higher in low-resource languages than in English.

**6. Hallucination amplification**

Hallucinations tend to increase when:

- Training data is sparse
- Translation quality is uneven
- Cultural context is missing
- Tokenization works poorly for a specific script
- A prompt mixes multiple languages

Hallucinations in multilingual settings are harder to detect, especially when evaluators are not native speakers.

**7. Safety gaps introduced by RAG systems**

Retrieval-augmented generation (RAG) can improve reliability, but also introduces multilingual risks.

Potential failures include:

- Pulling outdated or unverified information in the target language
- Summarizing harmful text without recognizing its risk
- Mixing languages in ways that confuse safety classifiers
- Producing unsafe content when retrieved text includes culturally sensitive topics

RAG must be evaluated and monitored per language just like the model itself.

### 5.1.3 Where these vulnerabilities appear in the pipeline

Multilingual safety failures tend to occur at predictable points:

- **Input stage:** harmful intent hidden through script tricks, slang, or code-switching
- **Translation stage:** meaning drift hiding harmful elements
- **Generation stage:** weak refusal patterns in some languages
- **Post-processing stage:** English-only safety filters missing non-English risks
- **RAG stage:** unsafe or outdated content entering the context
- **Fallback stage:** inconsistent handling of uncertain or ambiguous prompts

Understanding where failures originate helps you design targeted defenses.

### 5.1.4 How to mitigate multilingual vulnerabilities

**1. Expand safety data per language**

Do not rely on English data. Build multilingual safety datasets that include:

- Native-language harmful requests
- Dialects and slang
- Cultural harms
- Indirect unsafe intent
- Code-switched prompts

**2. Apply per-language safety filters**

Use safety classifiers trained or adapted for each target language.

**3. Incorporate multilingual refusal examples into fine-tuning**

Include high-quality, polite refusal patterns during instruction-tuning.

**4. Test with multilingual red-team prompts**

Simulate attacks using:

- Slang
- Mixed scripts
- Unicode tricks
- Politeness misdirection
- Multiple dialects

**5. Monitor safety by language**

Track:

- Unsafe-response rate
- Jailbreak success rate
- Refusal-quality score
- Cultural-sensitivity violations

per language, not globally.

### 5.1.5 Key takeaways

- Multilingual models introduce safety risks that English-only systems never encounter.
- Code-switching, mixed scripts, and slang create major gaps in safety filters.
- Meaning drift in translation can hide harmful intent.
- Low-resource languages are more vulnerable to jailbreaks and harmful completions.
- Cultural harms must be treated as first-class safety concerns.
- Strong defenses require per-language data, evaluation, and monitoring.

<!-- ### Advanced Adversarial Attacks in Polyglot Systems
Adversarial attacks in multilingual environments can be differentiated based on user intent. The unintentional scenario involves non-malicious users inadvertently bypassing guardrails simply by querying in non-English languages. The intentional scenario involves malicious users who deliberately combine explicit malicious instructions with multilingual prompts to craft effective attack payloads.   

The convergence of malicious intent and multilingual context significantly amplifies the negative impact. Intentional multilingual prompts function not merely as a translated attack but as an obfuscation and destabilization vector. The extreme attack success rates (ASR) observed in these scenarios confirm that multilingual phrasing bypasses safety mechanisms reliant on surface-level keyword detection or simple sentiment analysis trained in English, targeting the failure of the model’s internal safety representation space. Experimental data revealed astonishingly high rates of unsafe output: 80.92% ASR for ChatGPT and 40.71% ASR for GPT-4 when targeted with intentional multilingual jailbreaking attacks. This evidence mandates that assessment processes must explicitly test prompts that are linguistically complex or contextually ambiguous across language boundaries.   

Automated methods for generating these high-efficacy harmful inputs often leverage specialized machine learning frameworks. For instance, Reinforcement Learning with Adversarial Feedback (RLAF) is a framework designed for reward-driven refinement to elicit toxic responses from target LLMs. Additionally, techniques such as translation averaging and subject-predicate permutations are employed to create robust, cross-lingual adversarial payloads that ensure persistence across linguistic variants.   

#### Empirical Attack Success Rates

| Model | Scenario | Language Resource Level | Example ASR (%) | Key Implication for Assessment |
|-------|----------|------------------------|-----------------|------------------------------|
| ChatGPT/GPT-4 | Unintentional Prompt Bypass | Low-Resource Languages | ∼3× higher vs. High-Resource | Need to prioritize LRL probing in initial safety scans |
| ChatGPT | Intentional Jailbreaking | Multilingual Prompt Payload | 80.92 | Standard single-turn filtering is grossly insufficient |
| GPT-4 | Intentional Jailbreaking | Multilingual Prompt Payload | 40.71 | State-of-the-art closed models require specialized defenses |


### Multilingual Hallucination and Factuality Gaps

Hallucination, the generation of factually unsupported or incorrect information, is fundamentally intertwined with safety, especially in low-resource environments. Research indicates that models struggle with hallucinations primarily in low-resource directions and, critically, when translating out of English.

!!! warning "Multilingual Hallucination Gap"
    In these scenarios, the resulting hallucinated translations may introduce **toxic patterns traceable back to low-quality or unfiltered segments** of the training data.

This phenomenon creates a measurable **Multilingual Hallucination Gap**, reflecting differences in the frequency of hallucinated answers depending on the prompt and language used. Experiments conducted on various LLM families (LLaMA, Qwen, Aya) generating content in up to 19 languages demonstrate significant variations in hallucination rates, particularly pronounced between high- and low-resource languages.

For an LLM application developer, this means **factuality testing in low-resource languages becomes an indirect safety assessment**, as factually inaccurate output can simultaneously introduce harmful bias or toxicity derived from training data remnants.

#### Evaluation Metrics and Mitigation

To address this challenge, specialized evaluation metrics are required:

**mFACT** - A multilingual factuality metric designed to evaluate hallucinations beyond English:

- Achieves cross-lingual assessment by translating supervision signals from existing English factuality metrics
- Can be incorporated into training loops via loss-weighted training
- Reduces hallucinations and improves summary quality across multiple languages

**Cross-lingual Chain-of-Thought (COT)**: Leverages reasoning performed in high-resource languages to improve factual consistency and reliability in low-resource language outputs.
 -->
