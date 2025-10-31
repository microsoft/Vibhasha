# Translation Strategies for Multilingual LLM Deployment

!!! quote "The Translation Dilemma"
    While translation can unlock powerful English-centric LLM capabilities for global use, it's a double-edged sword: you gain reasoning power but risk losing cultural nuance and propagating errors.

---

## The English-Centric Reality of LLMs

The development of Large Language Models (LLMs) has been overwhelmingly dominated by the English language. The vast majority of research, development, and, most critically, pretraining data is English-centric.[^1][^2][^3][^4][^5][^6]

!!! info "The Data Imbalance"
    - **GPT-3**: ~92.65% English tokens in training corpus
    - **Llama 2**: ~89.70% English tokens in pretraining data
    
    This creates a profound "resourcedness gap" and systemic "language gap in AI".[^6]

**The Real-World Impact:**

This imbalance means that automated systems increasingly mediating global online interactions—from content moderation platforms and search engines to customer support chatbots—are designed for and function far more effectively in English than in the world's other 7,000 languages.[^1][^3]

!!! danger "Beyond Technical Limitations"
    This disparity perpetuates and amplifies existing biases, reflecting Anglo-centric and North American cultural perspectives while marginalizing others.[^4][^11] The consequence? State-of-the-art models exhibit **sharp performance degradation** on non-English tasks, particularly acute for low-resource languages (LRLs).[^1][^6][^9][^10]

### Translation as a Bridge Strategy

In this context, automatic translation emerges as a **pragmatic, powerful, and often necessary strategy** to bridge this capability gap. By translating non-English inputs into English using either dedicated machine translation (MT) services (like Google Translate or Azure Translate) or the translation capabilities of other LLMs, practitioners can leverage the formidable reasoning and generation capabilities of English-dominant models for global applications before translating the output back to the source language.[^12][^2][^13]

!!! warning "The Trade-offs"
    Translation is **not a universal solution**. It introduces complex trade-offs:
    
    - ⚠️ Risk of propagating translation errors
    - 🎭 Potential loss of cultural and idiomatic meaning
    - 💰 Increased latency and cost
    
    This chapter provides a comprehensive framework for navigating these challenges.

## The Strategic Crossroads: Direct Inference vs. Pre-translation

The foundational decision for any multilingual workflow is whether to engage the LLM directly in the source language or to first translate the query into English. This choice is not static; it depends on the specific capabilities of the model, the characteristics of the language, and the quality of available translation tools.

### The Default: Direct Inference

Modern multilingual LLMs are engineered with **cross-lingual transfer capabilities**. During pretraining on vast, multilingual corpora, they learn to infer connections between languages, allowing them to apply grammatical structures and semantic associations from high-resource languages like English to lower-resource ones.[^10]

!!! success "Direct Inference: The Strong Default"
    For many applications, the most effective approach is **direct inference**—prompting the model directly in the non-English source language.
    
    **Key Finding**: Analysis of PaLM2-L performance revealed that approximately **85% of low-resource languages benefit from direct inference**.[^2][^14]

**Why Direct Inference Works:**

- ✅ Leverages intrinsic cross-lingual capabilities
- ✅ Avoids translation error propagation
- ✅ Preserves cultural and linguistic nuance
- ✅ Validated by empirical research for QA tasks

### The Exception: When Pre-translation Prevails

Despite the general superiority of direct inference, a **consistent and important exception** exists for specific low-resource languages.

!!! warning "Seven Critical Exception Languages"
    Research with PaLM2-L identified languages where pre-translation **consistently outperforms** direct inference:
    
    **Bambara** · **Cusco-Collao Quechua** · **Lingala** · **Oromo** · **Punjabi** · **Tigrinya** · **Tsonga**
    
    *Note: Four of these seven are African languages, potentially indicating regional patterns in data representation.*

**Root Causes for Pre-translation Success:**

<div class="grid cards" markdown>

-   **📊 Severe Data Underrepresentation**

    ---

    These languages are so sparsely represented in pretraining that the model's internal representations are too weak for complex reasoning.[^6][^15][^16]

-   **🔤 Tokenization Inefficiency**

    ---

    Standard tokenizers optimized for Latin scripts create longer, more expensive, and less semantically coherent token sequences.[^4]

-   **🌐 Linguistic Divergence**

    ---

    Languages typologically distant from English benefit less from cross-lingual transfer, making translation a more reliable bridge.[^4]

</div>

### Data-Driven Decision Framework

!!! important "Dynamic Strategy Selection"
    The optimal strategy is **not a fixed property** of a language but shifts based on the specific model being used. As new models with more diverse pretraining data emerge, continuous re-evaluation is essential.[^4]

#### Three Key Performance Determinants

=== "1. Model Size"
    **Impact**: Larger models generally possess more robust multilingual capabilities
    
    - Better candidates for direct inference
    - Translation quality improves with size due to greater pretraining exposure[^17][^18][^19]
    - **Caveat**: Size alone doesn't eliminate performance disparities[^20]

=== "2. Language Representation"
    **Impact**: **Most critical determinant** of performance
    
    - Strong positive correlation between pretraining corpus proportion and performance[^6][^15][^21]
    - Greater representation → direct inference more likely to succeed
    - Check model documentation for language coverage details

=== "3. Translator Proficiency"
    **Impact**: Quality of MT system determines pre-translation success
    
    - High-fidelity translation is **prerequisite** for pre-translation workflows[^12][^22]
    - Poor MT introduces cascading errors through entire pipeline[^13][^23][^24][^25]
    - **Guideline**: If MT quality is weak, direct inference may be less risky

#### Strategy Comparison Matrix

| Strategy | Best For (Language Profile) | Best For (Task Type) | Key Dependencies | Primary Risk |
|----------|----------------------------|---------------------|------------------|--------------|
| **Direct Inference** | High- and Medium-Resource Languages; Majority of Low-Resource Languages | All Tasks | Robust multilingual LLM with strong cross-lingual transfer | Suboptimal performance if model's native support is weak |
| **Full Pre-translation** | Very Low-Resource Languages with poor native LLM support (e.g., Bambara, Quechua) | General tasks where cultural nuance is not critical | High-quality, reliable MT API | Loss of cultural nuance and translation error propagation |
| **Selective Pre-translation** | All non-English languages, especially Low- and Medium-Resource | Extractive and Generative tasks requiring precision and nuance | High-quality MT API and well-structured prompt architecture | Increased implementation complexity |

---

## Advanced Translation Architectures

Once the decision to use translation has been made, practitioners face a second choice: **how** to integrate translation into the workflow. The strategies range from simple full-translation pipelines to sophisticated, modular approaches that treat translation as a dynamic component of the reasoning process.

### Full Pre-translation: The Baseline Approach

The most straightforward implementation of a translation-based strategy is **full pre-translation**, involving three distinct steps:

!!! info "Full Pre-translation Workflow"
    1. **Translate** the entire non-English input prompt into English
    2. **Process** the resulting English prompt using a powerful, English-centric LLM
    3. **Translate back** the English output into the original source language[^2][^13][^14]

**Advantages:**

- ⚡ Fast to set up using off-the-shelf components
- 🔌 Works with commercial APIs (Google Translate, Azure Translate, etc.)[^12]
- ✅ Viable when native LLM support is weak or non-existent

**Critical Limitations:**

!!! warning "Full Pre-translation Risks"
    - 🎭 **High risk of losing critical information, cultural nuance, and idiomatic meaning**[^2][^10]
    - ⚠️ **Two distinct points of failure** where errors can be introduced and propagated[^26]
    - 🔄 Blunt instrument approach—translates everything without discrimination

### Selective Pre-translation: A Superior Modular Strategy

A more advanced and effective approach is **selective pre-translation**, which recognizes that an LLM prompt is not monolithic but composed of distinct functional components.

!!! success "Key Insight: Modular Prompt Architecture"
    Instead of translating the entire prompt, selectively translate only specific components:
    
    - **Instruction**: The task directive
    - **Context**: The information to process
    - **Examples**: In-context learning demonstrations
    - **Output**: The desired response format

**Empirical Evidence:**

!!! tip "Research-Backed Performance"
    Comprehensive studies demonstrate that selective pre-translation **consistently and significantly outperforms** both full pre-translation and direct inference across various tasks and languages.[^14][^27]
    
    **Performance Improvements:**
    - Particularly dramatic for LRLs
    - Relative gains can exceed **100-200%** compared to baseline methods[^14]

**Strategic Advantages:**

<div class="grid cards" markdown>

-   **🎯 Precision Risk Management**

    ---

    Surgically isolate vulnerable prompt components and protect their integrity

-   **🛡️ Minimize Error Surface**

    ---

    Reduce "attack surface" for translation errors while accessing superior reasoning

-   **⚖️ Balanced Approach**

    ---

    Keep culturally specific content in source language, translate reasoning instructions

</div>

#### Task-Specific Configuration Guidelines

=== "Extractive Tasks (Q&A, NER)"
    **Goal**: Extract information directly from provided text
    
    !!! important "Keep Context in Source Language"
        - **Context & Examples**: Source language (preserves facts)
        - **Instruction**: English (clear task directive)
        - **Output Format**: Source language
    
    **Rationale**: Models are highly effective at following English instructions while operating on source-language content.[^2][^14]

=== "Generative Tasks (Summarization, Content Creation)"
    **Goal**: Deep reasoning, synthesis, and fluent generation
    
    !!! important "Generate in English, Then Translate"
        - **Instruction**: English
        - **Context**: English or Source (task-dependent)
        - **Examples**: Source language
        - **Output**: English → then back-translate
    
    **Rationale**: Leverages model's superior coherence and reasoning in its strongest language.[^14]

#### Prompt Component Translation Matrix

| Prompt Component | Extractive Q&A | Named Entity Recognition (NER) | Abstractive Summarization | Natural Language Inference (NLI) |
|------------------|----------------|--------------------------------|---------------------------|----------------------------------|
| **Instruction** | English | English | English | English |
| **Context** | Source Language | Source Language | English or Source Language | English or Source Language |
| **Examples** | Source Language | Source Language | Source Language | English |
| **Output Format** | Source Language | Source Language | English (with back-translation) | English |

---

## Enhancing Performance through System Adaptation

A translation-based workflow is a complex system with multiple components. Optimizing performance and ensuring reliability requires proactive adaptation of these components and robust strategies for mitigating inevitable errors.

!!! tip "Mature System Architecture"
    Treat your translation component as a **first-class, adaptable model** integral to your MLOps lifecycle, not as a static, black-box API.

### Fine-Tuning Translation Systems

Off-the-shelf MT systems—whether dedicated services like Amazon Translate or general-purpose LLMs—are general-purpose tools.[^41] For applications requiring specialized terminology, specific stylistic conventions, or consistent brand voice (e.g., corporate, legal, or medical domains), their performance can be **substantially improved through fine-tuning**.[^62][^63][^64]

#### Fine-Tuning Approaches

=== "Instruction Fine-Tuning (IFT)"
    **Purpose**: Adapt the general-purpose model to specialized tasks
    
    **Method**: Train on curated datasets demonstrating precisely how to handle:
    - Specific terms
    - Tones and styles
    - Domain-specific conventions
    
    **Process**: Supervised training on examples[^62]

=== "Parameter-Efficient Fine-Tuning (PEFT)"
    **Purpose**: Resource-efficient adaptation for multiple domains
    
    **Method**: **Low-Rank Adaptation (LoRA)** technique
    - Train only a small set of additional parameters ("adapters")
    - Keep base model unchanged
    - Load domain-specific adapters as needed
    
    **Advantage**: Deploy multiple specialized translators (marketing, technical, legal) from single base model[^63][^65][^66]

=== "Synthetic Data Generation"
    **Purpose**: Address data scarcity for LRLs and specialized domains
    
    **Method**: Use LLMs to generate training data
    
    **Critical Requirement**: Careful quality control to avoid reinforcing model biases[^26][^67]

### Mitigating Error Propagation

!!! danger "The Cascade Effect"
    In translation-based systems, errors are **not isolated**—they cascade. A mistake in initial translation can be misinterpreted and amplified by the LLM, leading to severely flawed final output.

Modern approaches shift from simple post-processing to building **correction mechanisms directly into the generation workflow**, creating more robust and autonomous systems.

#### Error Mitigation Strategies

<div class="grid cards" markdown>

-   **📚 Domain-Specific Glossaries**

    ---

    **Problem**: Errors from lack of specialized knowledge
    
    **Solution**: Create domain-specific knowledge base of approved terms
    
    **Workflow**:
    1. Build glossary (technical terms, product names, legal definitions)
    2. Retrieve relevant entries when query received
    3. Provide to LLM as prompt context
    
    **Impact**: Grounds LLM generation in factual data, reduces hallucinations and incorrect terminology[^68][^69]

-   **🔄 Iterative Debugging Loops**

    ---

    **Problem**: Complex, multi-step task errors
    
    **Solution**: Implement "simulation-error localization-correction" cycle
    
    **Workflow**:
    1. Generate initial LLM output
    2. Pass to automated verification (simulator, rules, another LLM)
    3. If error detected, provide structured feedback
    4. LLM revises output based on feedback
    
    **Impact**: Catches and corrects errors before final output[^68]

</div>

---

## Evaluation and Quality Assurance

Measuring the success of a multilingual, translation-based system is a non-trivial challenge. It requires a **multi-stage evaluation framework** that can diagnose issues at different points in the pipeline and account for qualitative aspects of language that automated metrics often miss.

### Establishing Ground Truth: A Fundamental Choice

A critical decision in the evaluation process is the choice of the **ground truth (GT)**—the human-created reference against which the system's output is compared.

!!! question "Two Evaluation Approaches"
    The choice between these approaches reflects the core objective of your system.

=== "Source Language Ground Truth"
    **What**: Compare final output (back-translated) against human reference in source language
    
    **Measures**: Holistic end-to-end user experience
    
    **Pros**:
    - ✅ User-centric evaluation
    - ✅ Captures real user experience
    
    **Cons**:
    - ⚠️ Conflates LLM reasoning errors with back-translation errors
    - ⚠️ Difficult to isolate problem sources

=== "English Ground Truth"
    **What**: Compare intermediate English output against professionally translated English reference
    
    **Measures**: Core reasoning step and input translation quality
    
    **Pros**:
    - ✅ Isolates LLM performance
    - ✅ Better for optimization
    
    **Cons**:
    - ⚠️ Doesn't assess final back-translation quality
    - ⚠️ Not fully user-centric

!!! success "Best Practice: Multi-Stage Evaluation"
    A mature evaluation strategy employs **both methods**:
    
    - **English GT**: Intrinsic, system-internal measure for optimizing core LLM and prompt engineering[^72][^73]
    - **Source GT**: Extrinsic, user-centric measure for validating final product quality[^72][^73]

### Automated Evaluation Metrics

Automated metrics provide scalable performance tracking during development, but understanding their limitations is crucial.

#### Metric Categories

=== "Lexical Overlap Metrics"
    **Examples**: BLEU, ROUGE
    
    **How They Work**: Measure overlap of n-grams (word sequences) between machine output and reference
    
    !!! warning "Significant Limitations"
        - ❌ Fast and simple but fundamentally flawed
        - ❌ Poor at capturing semantic meaning
        - ❌ Unfairly penalize valid paraphrasing
        - ❌ Not suitable for modern fluent translation systems[^73][^74][^75]

=== "Embedding-Based Metrics"
    **Examples**: BERTScore, COMET
    
    **How They Work**: Leverage contextual embeddings from language models to measure semantic similarity
    
    !!! success "State-of-the-Art Performance"
        - ✅ Correlate strongly with human judgment
        - ✅ Better assess preservation of meaning
        - ✅ More suitable for modern LLM outputs[^74][^75][^76]

#### The Fluency Illusion Problem

!!! danger "Critical Limitation of Automated Metrics"
    Modern LLMs excel at producing **fluent, grammatically correct, plausible-sounding text**.[^76]
    
    **The Problem**: Metrics like COMET (themselves based on LLMs) can be biased towards fluency, assigning high scores to translations that are:
    
    - ✍️ Beautifully written
    - ❌ Factually incorrect
    - ❌ Semantically divergent
    - ❌ Containing subtle hallucinations
    
    **Conclusion**: Human oversight is **more critical than ever**, as only humans with real-world knowledge can reliably detect these nuanced failures.[^72][^77]

### Human-in-the-Loop Evaluation

!!! important "The Gold Standard"
    Given the limitations of automated metrics, **human evaluation remains essential** for assessing translation quality, especially for high-stakes or user-facing content.

**What Automated Metrics Cannot Reliably Measure:**

- 🎭 Cultural appropriateness
- 🗣️ Tone and formality
- 🎯 Preservation of subtle meaning
- 🌍 Local customs and sensitivities[^72][^78][^79]

#### Human Evaluation Criteria

A robust human evaluation process involves **native speakers** judging outputs based on well-defined criteria:

<div class="grid cards" markdown>

-   **📝 Fluency**

    ---

    Is the output grammatically correct, well-formed, and natural-sounding to a native speaker of the target language?[^72]

-   **✅ Adequacy**

    ---

    Does the output accurately preserve the essential meaning and intent of the original source text?[^72]

-   **🌍 Cultural Appropriateness**

    ---

    Does the translation respect local customs, social norms, and sensitivities, avoiding potentially offensive or confusing language?[^79][^80]

</div>

---

## Managing the Loss of Cultural Nuance

The most significant and insidious risk in any automated translation workflow is the degradation of meaning that goes beyond simple factual inaccuracy. Machine translation systems lack the "lived experience" and embodied understanding necessary to grasp the deep cultural context embedded within human language.[^80][^81]

### The "Lost in Translation" Problem

This lack of cultural grounding leads to consistent loss of key linguistic elements, which can have **severe consequences**.

!!! danger "Real-World Translation Failures"
    Famous marketing blunders illustrate the stakes:
    
    - **KFC in China**: "Finger-Lickin' Good" → "Eat Your Fingers Off"
    - **Pepsi**: Slogan became "Pepsi brings your ancestors back from the dead"
    - **Facebook incident**: "Good morning" mistranslated to "attack them" in Hebrew, leading to wrongful arrest[^79][^80][^81]

#### Key Areas of Translation Failure

<div class="grid cards" markdown>

-   **💬 Idiomatic Expressions & Slang**

    ---

    **Problem**: Phrases with non-literal meanings ("kick the bucket," "break a leg") translated literally
    
    **Result**: Nonsensical or bizarre outputs[^78][^79][^82][^83]

-   **🎭 Formality & Tone**

    ---

    **Problem**: Crucial distinctions between formal and informal address lost
    
    **Examples**: "vous" vs. "tu" (French), Keigo (Japanese)
    
    **Result**: Disrespectful, overly familiar, or inappropriate outputs[^79][^82]

-   **😄 Humor & Wordplay**

    ---

    **Problem**: Culture-specific humor, puns, and shared references don't survive literal translation
    
    **Result**: Complete loss of intended effect[^78][^79]

-   **🏛️ Culturally Embedded Concepts**

    ---

    **Problem**: Ideas rooted in specific cultural philosophy have no direct equivalent
    
    **Examples**: *Wabi-sabi* (Japanese beauty of imperfection), "saving face" (Asian cultures)
    
    **Result**: Cannot be captured by simple translation[^81][^82]

-   **🎨 Non-Textual Nuance**

    ---

    **Problem**: Visual and modal elements carry culture-specific meaning
    
    **Examples**: Color symbolism (white = purity vs. mourning), hand gestures
    
    **Result**: Neutral in one culture, offensive in another[^79]

</div>

### Strategic Mitigation and Best Practices

Preserving cultural nuance requires a **deliberate, multi-pronged strategy** beyond simple translation accuracy. Architectural choices in workflow design are the primary defense against qualitative failures that automated metrics cannot detect.

#### Mitigation Strategies

!!! tip "Best Practices for Cultural Preservation"

    === "1. Embrace Selective Pre-translation"
        **Most Effective Defense**: Keep culturally rich components in original source language
        
        **What to Preserve**:
        - User-generated context
        - Examples containing idioms
        - Culturally specific information
        
        **Benefit**: Allows LLM to reason about culturally specific information directly, even if it cannot be perfectly translated

    === "2. Utilize Glossaries & Style Guides"
        **Purpose**: Maintain consistency and prevent brand-damaging errors
        
        **Implementation**:
        - Pre-approved, human-vetted translations for key terms
        - Brand terms and product names
        - Industry-specific jargon
        
        **Benefit**: Essential for brand consistency[^64][^84]

    === "3. Employ Contextual Prompting"
        **Purpose**: Provide explicit cultural context and constraints
        
        **Example Prompt**:
        ```
        "Translate this customer support response.
        The target audience is German business professionals.
        Ensure the tone is formal and uses the 'Sie' form of address."
        ```
        
        **Benefit**: Guides LLM to culturally appropriate output[^85]

    === "4. Prioritize Transcreation"
        **When**: High-value creative and persuasive content
        
        **What**: Recreate intended emotional impact for new cultural audience (not literal translation)
        
        **Examples**: Marketing campaigns, advertising slogans
        
        **Requirement**: Human linguists and cultural specialists[^79]

---

## Summary and Strategic Recommendations

Leveraging translation to unlock the power of English-centric LLMs for global applications is a potent but complex strategy. Successful implementation requires nuanced understanding of trade-offs, sophisticated workflow architecture, and rigorous commitment to evaluation and cultural adaptation.

!!! success "Key Strategic Recommendations"

    === "1. Adopt a Dynamic, Tiered Strategy"
        **Principle**: No single "best" approach for all languages and tasks
        
        **Framework**:
        - ✅ Begin with **direct inference** as the default
        - ⚠️ For poor-performing languages (especially identified LRLs like Bambara, Quechua), pivot to translation
        - 🔄 Continuously re-evaluate as more capable multilingual models emerge

    === "2. Prioritize Selective Pre-translation"
        **Principle**: Avoid blunt full-translation approach
        
        **Implementation**:
        - 🧩 Adopt **modular prompt architecture**
        - 📋 Separate: instructions, context, examples, output
        - 🎯 Tailor translation based on task type:
            - **Extractive**: Keep context in source language
            - **Abstractive**: Generate output in English
        
        **Result**: 100-200% performance gains for LRLs

    === "3. Treat Translation as Core Component"
        **Principle**: Translation is not a static external dependency
        
        **Actions**:
        - 🔧 **Fine-tune MT models** using LoRA for key domains
        - 📊 Integrate into **MLOps lifecycle**
        - 🔄 Dedicated processes for training, versioning, evaluation
        
        **Benefit**: Substantial performance improvements for specialized domains

    === "4. Implement Multi-Stage Evaluation"
        **Principle**: Automated metrics alone are insufficient
        
        **Framework**:
        - 🤖 Use **COMET** for continuous performance tracking
        - 👥 Implement rigorous **human-in-the-loop review**
        - ✅ Validate: adequacy, fluency, cultural nuance
        - 📊 Evaluate both intermediate English and final source-language outputs
        
        **Goal**: Diagnose entire pipeline effectively

    === "5. Architect for Resilience"
        **Principle**: Proactively mitigate error propagation
        
        **Strategies**:
        - 📚 Implement **RAG with domain-specific knowledge bases**
        - 🎯 Ground outputs in factual data
        - 🔄 Design **iterative debugging loops**
        - ⚡ Self-correct in-process vs. costly post-editing
        
        **Result**: Reduced hallucinations and terminology errors

    === "6. Never Underestimate Cultural Context"
        **Principle**: Most damaging errors escape automated detection
        
        **Critical Actions**:
        - 🎯 Use selective translation to protect culturally rich content
        - 📝 Provide explicit contextual cues in prompts
        - 👥 Engage **transcreation experts** for high-value creative content
        - 🌍 Ensure messages resonate correctly and respectfully globally
        
        **Priority**: Paramount for user-facing applications

---

## Next Steps

!!! info "Continue Your Journey"
    
    **📊 Learn How to Evaluate Your System**  
    [Evaluation Methodologies →](01-evaluation.md){ .md-button }
    
    **⚙️ Explore Fine-Tuning Approaches**  
    [Fine-Tuning Strategies →](04-fine-tuning.md){ .md-button }
    
    **🛡️ Ensure Safety Across Languages**  
    [Safety Assessments →](05-safety.md){ .md-button }

---

## References

[^1]:
    (https://www.researchgate.net/publication/371536976\_Lost\_in\_Translation\_Large\_Language\_Models\_in\_Non-English\_Content\_Analysis)

[^2]:
    [https://aclanthology.org/2025.loresmt-1.9.pdf](https://aclanthology.org/2025.loresmt-1.9.pdf)

[^3]:
    (https://www.researchgate.net/publication/371536976\_Lost\_in\_Translation\_Large\_Language\_Models\_in\_Non-English\_Content\_Analysis)

[^4]:
    [https://cohere.com/research/papers/the-ai-language-gap.pdf](https://cohere.com/research/papers/the-ai-language-gap.pdf)

[^5]:
    [https://arxiv.org/html/2502.09331v1](https://arxiv.org/html/2502.09331v1)

[^6]:
    [https://arxiv.org/html/2404.11553v1](https://arxiv.org/html/2404.11553v1)

[^7]:
    [https://hai-production.s3.amazonaws.com/files/hai-taf-pretoria-white-paper-mind-the-language-gap.pdf](https://hai-production.s3.amazonaws.com/files/hai-taf-pretoria-white-paper-mind-the-language-gap.pdf)

[^8]:
    [https://www.business-humanrights.org/en/latest-news/new-report-highlights-the-shortcomings-of-large-language-models-in-analysing-non-english-content/](https://www.business-humanrights.org/en/latest-news/new-report-highlights-the-shortcomings-of-large-language-models-in-analysing-non-english-content/)

[^9]:
    [https://www.scribd.com/document/696326882/2306-07377](https://www.scribd.com/document/696326882/2306-07377)

[^10]:
    [https://policycommons.net/artifacts/4779416/kbyr-fy-thlyl-lmhtw-gyr-lfshl-fy-lttbyq/5615712/](https://policycommons.net/artifacts/4779416/kbyr-fy-thlyl-lmhtw-gyr-lfshl-fy-lttbyq/5615712/)

[^11]:
    [https://cohere.com/research/papers/translating-safety.pdf](https://cohere.com/research/papers/translating-safety.pdf)

[^12]:
    [https://www.science.co.jp/en/nmt/blog/39708/](https://www.science.co.jp/en/nmt/blog/39708/)

[^13]:
    [https://lfaidata.foundation/blog/2024/05/21/translation-augmented-generation-breaking-language-barriers-in-llm-ecosystem/](https://lfaidata.foundation/blog/2024/05/21/translation-augmented-generation-breaking-language-barriers-in-llm-ecosystem/)

[^14]:
    [https://aclanthology.org/2025.loresmt-1.9.pdf](https://aclanthology.org/2025.loresmt-1.9.pdf)

[^15]:
    [https://arxiv.org/html/2402.11537v3](https://arxiv.org/html/2402.11537v3)

[^16]:
    (https://www.google.com/search?q=https://openreview.net/pdf%3Fid%3DmpTIzK4Zca)

[^17]:
    [https://arxiv.org/html/2406.15625v1](https://arxiv.org/html/2406.15625v1)

[^18]:
    [https://pmc.ncbi.nlm.nih.gov/articles/PMC11783891/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11783891/)

[^19]:
    [https://www.leewayhertz.com/comparison-of-llms/](https://www.leewayhertz.com/comparison-of-llms/)

[^20]:
    [https://medium.com/@vbsowmya/multilingual-evaluations-in-llms-a-comparison-1d58b0fd9848](https://medium.com/@vbsowmya/multilingual-evaluations-in-llms-a-comparison-1d58b0fd9848)

[^21]:
    [https://aclanthology.org/2024.findings-acl.559/](https://aclanthology.org/2024.findings-acl.559/)

[^22]:
    [https://www.g2.com/compare/azure-translator-text-api-vs-deepl](https://www.g2.com/compare/azure-translator-text-api-vs-deepl)

[^23]:
    [https://arxiv.org/abs/2402.04177](https://arxiv.org/abs/2402.04177)

[^24]:
    ([https://openreview.net/forum?id=vPOMTkmSiu](https://openreview.net/forum?id=vPOMTkmSiu))

[^25]:
    (https://openreview.net/pdf?id=vPOMTkmSiu)

[^26]:
    [https://arxiv.org/html/2508.05266v1](https://arxiv.org/html/2508.05266v1)

[^27]:
    [https://arxiv.org/html/2502.09331v1](https://arxiv.org/html/2502.09331v1)

[^28]:
    [https://aclanthology.org/2024.americasnlp-1.25.pdf](https://aclanthology.org/2024.americasnlp-1.25.pdf)

[^29]:
    [https://medium.com/@vishal025/investigating-techniques-for-adapting-llms-to-work-effectively-in-low-resource-languages-and-ba3037b2567b](https://medium.com/@vishal025/investigating-techniques-for-adapting-llms-to-work-effectively-in-low-resource-languages-and-ba3037b2567b)

[^30]:
    [https://arxiv.org/html/2411.11295v1](https://arxiv.org/html/2411.11295v1)

[^31]:
    [https://aclanthology.org/2024.lrec-main.1362.pdf](https://aclanthology.org/2024.lrec-main.1362.pdf)

[^32]:
    [https://arxiv.org/html/2409.04512v1](https://arxiv.org/html/2409.04512v1)

[^33]:
    [https://arxiv.org/abs/2409.04512](https://arxiv.org/abs/2409.04512)

[^34]:
    [https://slator.com/translating-input-in-prompts-improves-llm-performance-for-low-resource-languages/](https://slator.com/translating-input-in-prompts-improves-llm-performance-for-low-resource-languages/)

[^35]:
    [https://aclanthology.org/2023.emnlp-main.163.pdf](https://aclanthology.org/2023.emnlp-main.163.pdf)

[^36]:
    (https://www.researchgate.net/publication/391878863\_Multilingual\_Prompt\_Engineering\_in\_Large\_Language\_Models\_A\_Survey\_Across\_NLP\_Tasks)

[^37]:
    [https://www.researchgate.net/publication/386436285\_Multilingual\_Prompting\_in\_LLMs\_Investigating\_the\_Accuracy\_and\_Performance](https://www.researchgate.net/publication/386436285_Multilingual_Prompting_in_LLMs_Investigating_the_Accuracy_and_Performance)

[^38]:
    [https://www.promptingguide.ai/](https://www.promptingguide.ai/)

[^39]:
    [https://www.educative.io/blog/prompt-engineering-vs-fine-tuning](https://www.educative.io/blog/prompt-engineering-vs-fine-tuning)

[^40]:
    [https://lilt.com/blog/tips-to-write-effective-llm-prompts-and-generate-multilingual-content](https://lilt.com/blog/tips-to-write-effective-llm-prompts-and-generate-multilingual-content)

[^41]:
    [https://aws.amazon.com/blogs/machine-learning/evaluate-large-language-models-for-your-machine-translation-tasks-on-aws/](https://aws.amazon.com/blogs/machine-learning/evaluate-large-language-models-for-your-machine-translation-tasks-on-aws/)

[^42]:
    [https://aws.amazon.com/what-is/prompt-engineering/](https://aws.amazon.com/what-is/prompt-engineering/)

[^43]:
    [https://openreview.net/pdf/e05ca9c349ec663d29b9130dd3c9b74469b2bb2e.pdf](https://openreview.net/pdf/e05ca9c349ec663d29b9130dd3c9b74469b2bb2e.pdf)

[^44]:
    [https://aclanthology.org/2024.findings-emnlp.108.pdf](https://aclanthology.org/2024.findings-emnlp.108.pdf)

[^45]:
    [https://aclanthology.org/2023.paclic-1.1.pdf](https://aclanthology.org/2023.paclic-1.1.pdf)

[^46]:
    [https://arxiv.org/html/2502.04134v2](https://arxiv.org/html/2502.04134v2)

[^47]:
    [https://arxiv.org/html/2505.11665v1](https://arxiv.org/html/2505.11665v1)

[^48]:
    [https://www.ibm.com/think/topics/large-language-models](https://www.ibm.com/think/topics/large-language-models)

[^49]:
    (https://www.youtube.com/watch?v=H0FMsRZ7f\_A)

[^50]:
    [https://aclanthology.org/2024.acl-long.671.pdf](https://aclanthology.org/2024.acl-long.671.pdf)

[^51]:
    [https://academic.oup.com/pnasnexus/article/3/9/pgae346/7756548](https://academic.oup.com/pnasnexus/article/3/9/pgae346/7756548)

[^52]:
    [https://mbzuai.ac.ae/news/what-llms-get-wrong-about-culture-and-how-to-fix-them-two-studies-from-naacl/](https://mbzuai.ac.ae/news/what-llms-get-wrong-about-culture-and-how-to-fix-them-two-studies-from-naacl/)

[^53]:
    [https://arxiv.org/html/2505.15229v1](https://arxiv.org/html/2505.15229v1)

[^54]:
    [https://mbzuai.ac.ae/news/culture-and-bias-in-llms-defining-the-challenge-and-mitigating-risks/](https://mbzuai.ac.ae/news/culture-and-bias-in-llms-defining-the-challenge-and-mitigating-risks/)

[^55]:
    [https://arxiv.org/html/2407.16891](https://arxiv.org/html/2407.16891)

[^56]:
    [https://pmc.ncbi.nlm.nih.gov/articles/PMC11097685/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11097685/)

[^57]:
    (https://www.neurology.org/doi/10.1212/WNL.0000000000209497)

[^58]:
    [https://www.reddit.com/r/LocalLLaMA/comments/1fbkbu6/prompting\_in\_multilingual\_models/](https://www.reddit.com/r/LocalLLaMA/comments/1fbkbu6/prompting_in_multilingual_models/)

[^59]:
    [https://arxiv.org/html/2403.02567v1](https://arxiv.org/html/2403.02567v1)

[^60]:
    [https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/](https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/)

[^61]:
    [https://arxiv.org/html/2406.01771v1](https://arxiv.org/html/2406.01771v1)

[^62]:
    [https://www.superannotate.com/blog/llm-fine-tuning](https://www.superannotate.com/blog/llm-fine-tuning)

[^63]:
    [https://developer.nvidia.com/blog/improving-translation-quality-with-domain-specific-fine-tuning-and-nvidia-nim/](https://developer.nvidia.com/blog/improving-translation-quality-with-domain-specific-fine-tuning-and-nvidia-nim/)

[^64]:
    [https://medium.com/@hastur/embracing-ai-in-localization-a-2025-2028-roadmap-a5e9c4cd67b0](https://medium.com/@hastur/embracing-ai-in-localization-a-2025-2028-roadmap-a5e9c4cd67b0)

[^65]:
    [https://www.datacamp.com/tutorial/fine-tuning-large-language-models](https://www.datacamp.com/tutorial/fine-tuning-large-language-models)

[^66]:
    [https://www.mdpi.com/2227-7390/12/19/3149](https://www.mdpi.com/2227-7390/12/19/3149)

[^67]:
    [https://aclanthology.org/2024.acl-long.192/](https://aclanthology.org/2024.acl-long.192/)

[^68]:
    (https://www.jmir.org/2025/1/e71521/PDF)

[^69]:
    [https://arxiv.org/html/2411.11295v1](https://arxiv.org/html/2411.11295v1)

[^70]:
    [https://arxiv.org/abs/2410.07054](https://arxiv.org/abs/2410.07054)

[^71]:
    [https://aclanthology.org/2024.emnlp-main.879.pdf](https://aclanthology.org/2024.emnlp-main.879.pdf)

[^72]:
    [https://www.cs.cmu.edu/\~alavie/papers/GALE-book-Ch5.pdf](https://www.cs.cmu.edu/~alavie/papers/GALE-book-Ch5.pdf)

[^73]:
    [https://aclanthology.org/2023.acl-long.730.pdf](https://aclanthology.org/2023.acl-long.730.pdf)

[^74]:
    [https://arxiv.org/html/2306.13041v2](https://arxiv.org/html/2306.13041v2)

[^75]:
    [https://aclanthology.org/2024.emnlp-main.214.pdf](https://aclanthology.org/2024.emnlp-main.214.pdf)

[^76]:
    [https://imminent.translated.com/llm-based-machine-translation](https://imminent.translated.com/llm-based-machine-translation)

[^77]:
    [https://arxiv.org/html/2502.14338v4](https://arxiv.org/html/2502.14338v4)

[^78]:
    [https://alwaseemtranslation.com/cultural-nuances-in-translation/](https://alwaseemtranslation.com/cultural-nuances-in-translation/)

[^79]:
    [https://unbabel.com/5-cultural-nuances-when-writing-for-machine-translation/](https://unbabel.com/5-cultural-nuances-when-writing-for-machine-translation/)

[^80]:
    [https://www.appen.com/blog/ai-translation-preserving-cultural-nuance](https://www.appen.com/blog/ai-translation-preserving-cultural-nuance)

[^81]:
    [https://translated.com/resources/the-impact-of-cultural-nuances-on-machine-translation/](https://translated.com/resources/the-impact-of-cultural-nuances-on-machine-translation/)

[^82]:
    [https://ad-astrainc.com/blog/the-impact-of-cultural-nuances-on-translation-accuracy](https://ad-astrainc.com/blog/the-impact-of-cultural-nuances-on-translation-accuracy)

[^83]:
    [https://www.richtmann.org/journal/index.php/ajis/article/download/13705/13265/47218](https://www.richtmann.org/journal/index.php/ajis/article/download/13705/13265/47218)

[^84]:
    [https://www.scheduleinterpreter.com/ai-translation-white-papers.html](https://www.scheduleinterpreter.com/ai-translation-white-papers.html)

[^85]:
    [https://www.reddit.com/r/LocalLLaMA/comments/1lklzav/tips\_that\_might\_help\_you\_using\_your\_llm\_to\_do/](https://www.reddit.com/r/LocalLLaMA/comments/1lklzav/tips_that_might_help_you_using_your_llm_to_do/)



Beyond English: The Impact of Prompt Translation Strategies across Languages and Tasks in Multilingual LLMs - https://aclanthology.org/2025.findings-naacl.73/


