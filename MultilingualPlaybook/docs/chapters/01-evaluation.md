# Evaluation

## Should You Evaluate?

Before choosing or adapting a model for a multilingual task, ask:

* Does an **evaluation dataset or benchmark** already exist for your language or task?
* Can you **trust the existing benchmarks** (i.e., check for contamination)?

If no dataset exists, you’ll need to create one — either manually or synthetically.

## Types of Evaluation

### Intrinsic Evaluation

Evaluate model behavior independent of downstream tasks.

* Compute **perplexity** using a domain/language-specific corpus
* Design or select **prompt templates** for consistent measurement

Key Questions:

* How large should the corpus be?
* How do you calibrate prompt templates?

### Human Annotation

Collect human judgments for quality, relevance, or cultural alignment.

* Estimate **costs** fairly (e.g., hourly wage)
* Define **skill requirements** and provide **guidelines**
* Ensure **demographic diversity** of annotators

### Evaluation Protocols

Choose appropriate evaluation methods:

* **LLM-as-a-judge**:

  * Define prompts, rubrics, references
  * Calibrate by language, task, or domain
  * Run sanity checks before deployment
* **Model-based metrics** (e.g., BERTScore, COMET)

  * Consider calibration for multilingual settings
* Use frameworks like `lm-evaluation-harness`

## Quantitative and Qualitative Signals

### Quantitative

* N-gram overlap (BLEU, ROUGE)
* Embedding-based (COMET, BERTScore)
* With or without reference

### Qualitative

* Style and fluency (e.g., formal vs informal)
* Contextual appropriateness
* Domain-specific terminology usage
* Cultural sensitivity and alignment

## Summary

Evaluation is not just a technical step — it ensures your model aligns with linguistic, cultural, and domain expectations. Design your evaluation with care, especially in low-resource or cross-cultural settings.
