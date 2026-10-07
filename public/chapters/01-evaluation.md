# Evaluation

!!! info "The Evaluation Challenge"
    High-quality multilingual evaluation is essential for any system that aims to work across languages. Large language models have impressive capabilities in English, but their performance in other languages is far less predictable. Traditional English-focused benchmarks do not reveal how well a model handles linguistic diversity, cultural nuance, or safety concerns in low-resource settings. 
    
    **To build a system that behaves consistently and fairly for all users, evaluation must be thorough, multilingual, and grounded in real-world use cases.**

---

## Why multilingual evaluation is different

Evaluating LLMs across languages brings challenges that do not appear in English-only testing. These challenges come from differences in data availability, writing systems, cultural expectations, and the uneven distribution of model training resources.

!!! warning "Key Challenges"
    - **Benchmark saturation**: Many popular NLP benchmarks are already included in the training data of modern LLMs, which inflates scores and masks true performance
    - **Metric limitations**: Metrics such as BLEU or ROUGE measure surface-level similarity and often fail to capture meaning, fluency, or cultural appropriateness
    - **Cultural loss**: Directly translating English benchmarks into other languages removes important linguistic nuance and context
    - **Data contamination**: When test sets overlap with pretraining data, performance appears stronger than it actually is

The result is a misleading picture of multilingual capability. A model that looks strong on familiar benchmarks may still perform poorly in real-world, non-English scenarios.

### Why traditional metrics fall short

Conventional reference-based metrics struggle with multilingual evaluation for several reasons:

!!! warning "Limitations of Traditional Metrics"
    - They rely heavily on specific word choices that may not directly translate
    - They penalize legitimate paraphrasing or idiomatic phrasing
    - They do not measure factual accuracy, cultural fit, tone, or stylistic preference
    - They perform especially poorly in low-resource languages where reference data is scarce

!!! info "Key Takeaway"
    Because of these limitations, automated scores alone are not enough for multilingual quality assessment.
