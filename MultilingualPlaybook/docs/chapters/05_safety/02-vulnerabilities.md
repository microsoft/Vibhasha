## Multilingual Vulnerability Analysis: Adversarial and Factuality Failure Modes
Rigorous safety assessment requires an understanding of how linguistic diversity serves as a vector for exploiting known LLM vulnerabilities, specifically through adversarial manipulation and the introduction of factual instability.

### Advanced Adversarial Attacks in Polyglot Systems
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

