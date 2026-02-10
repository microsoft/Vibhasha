## Evaluation and Quality Assurance

Quality assurance is one of the most important parts of building a multilingual system. Strong translation patterns and thoughtful prompting help, but they are not enough on their own. You need a process that ensures outputs are accurate, culturally appropriate, safe, and consistent across languages. This section explains how to evaluate and refine multilingual quality before your system reaches real users.

!!! tip "See also"
    For a broader and more detailed treatment of multilingual evaluation—covering LLM-as-judge pipelines, metric rubrics, calibration, dataset discovery, and common challenges—refer to the [Evaluation chapter](/playbook/01-evaluation). 

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

