## 3.2 Choosing the right model

Not all models are equally capable across languages. Picking the right model for your target language and task is one of the most impactful decisions you can make — often more impactful than prompt engineering alone. This section walks through a systematic approach to model selection for multilingual applications.

![Model selection workflow](/assets/03_prompting/model-selection-workflow.svg)

### 3.2.1 Check explicit language support

The first step is to determine which languages a model officially supports. Models vary widely in their multilingual capabilities, and this information is usually available in three places:

- **Model cards and documentation** — Most model providers publish a list of supported languages. For example, [Aya by Cohere](https://cohere.com/research/aya) explicitly lists 101 languages, while [GPT-4](https://openai.com/index/gpt-4-research/) demonstrates broad multilingual capability without an explicit language list.
- **Training data composition** — Some providers disclose the languages and proportions in their pre-training data. This is the most reliable signal for how well a model will perform in a given language. A model trained on 5% Hindi data will almost certainly outperform one trained on 0.1% Hindi data, all else being equal.
- **Tokenizer coverage** — A model's tokenizer determines how efficiently it encodes text in different languages. Poor tokenization leads to longer sequences, higher costs, and degraded performance. If a language requires 3–4x as many tokens as English for the same text, the model likely has weak support for that language.

!!! info "Explicit vs. implicit support"
    Some models explicitly list supported languages (e.g., "supports 101 languages"). Others reveal implicit support through training data composition — the model may work in languages it does not officially list, simply because those languages appeared in the training corpus. When official documentation is sparse, look for community benchmarks and third-party evaluations.

### 3.2.2 Use leaderboards to narrow your options

Multilingual leaderboards and benchmarks provide objective performance comparisons across models and languages. Use them to shortlist candidate models before running your own evaluation.

**Key leaderboards and benchmarks to consult:**

| **Benchmark** | **What it measures** | **Languages** | **Link** |
|---|---|---|---|
| **Open LLM Leaderboard** | General LLM capabilities across tasks | Primarily English, some multilingual | [huggingface.co/spaces/open-llm-leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) |
| **MEGA** | Multilingual evaluation across generation and understanding tasks | 70+ languages | [microsoft/Multilingual-Evaluation-of-Generative-AI-MEGA](https://github.com/microsoft/Multilingual-Evaluation-of-Generative-AI-MEGA) |
| **Belebele** | Reading comprehension | 122 languages | [facebook/belebele](https://github.com/facebookresearch/belebele) |
| **Flores-200** | Machine translation quality | 200 languages | [facebook/flores](https://github.com/facebookresearch/flores) |
| **XTREME / XTREME-UP** | Cross-lingual understanding and generation | 40+ languages | [google-research/xtreme](https://github.com/google-research/xtreme) |
| **SIB-200** | Topic classification | 200+ languages | [SIB-200](https://github.com/dadelani/sib-200) |
| **MGSM** | Multilingual arithmetic reasoning | 10 languages | [MGSM benchmark](https://github.com/google-research/url-nlp) |

!!! warning "Benchmark limitations"
    - **Benchmark saturation** — Strong performance on a benchmark does not guarantee strong real-world performance. Some benchmarks have become saturated or contaminated through inclusion in training data.
    - **Task mismatch** — A model that excels at reading comprehension may struggle at generation. Match the benchmark to your actual task.
    - **Language coverage gaps** — Many benchmarks cover only a fraction of the world's languages. If your target language is not represented, you will need to rely on proxy signals.

### 3.2.3 When there is no benchmark for your language

For many of the world's 7,000+ languages, no benchmark exists. In this case, use proxy signals to estimate model performance.

=== "Language family similarity"
    If your target language belongs to the same language family as a well-benchmarked language, performance is likely to transfer. For example:
    
    - A model that scores well on Hindi (Indo-Aryan) is more likely to perform well on Marathi or Bengali
    - Strong performance on Swahili (Bantu) suggests reasonable capability on related Bantu languages
    - Romance language performance (Spanish, French) often predicts Italian and Portuguese performance
    
    Linguistic similarity in script, morphology, and syntax all contribute to cross-lingual transfer.

=== "Training data presence"
    Check whether your target language appears in the model's training data at all. Signals include:
    
    - The model can generate coherent text in the language
    - The tokenizer produces reasonable token counts (not dramatically longer than English)
    - The model recognizes the language when asked to identify it
    
    Even a small amount of training data can enable meaningful cross-lingual transfer from related high-resource languages.

=== "Script and tokenizer analysis"
    Tokenizer efficiency is a strong predictor of model capability. Compare the number of tokens required to encode a paragraph of text in your target language vs. English:
    
    - **1–2x English tokens** — Good support likely
    - **2–3x English tokens** — Moderate support; test carefully
    - **3x+ English tokens** — Weak support; consider fine-tuning or translation

### 3.2.4 Evaluate on your own data

Benchmarks and language lists can narrow your options, but the only way to know how a model will perform on your specific task is to test it yourself. This is the most important step in model selection.

**How to run a practical model evaluation:**

1. **Create a representative test set** — Assemble 50–100 examples that reflect your actual use case. Include edge cases, diverse topics, and examples that test cultural knowledge.

2. **Test 2–3 candidate models** — Choose models that scored well on relevant benchmarks and have reasonable language support for your targets.

3. **Try multiple prompting strategies per model** — For each model, test at least monolingual prompting and cross-lingual prompting. The best prompting strategy varies by model.

4. **Include human evaluation** — Automated metrics are useful for scale, but human evaluation catches issues with fluency, cultural appropriateness, and factual accuracy that metrics miss.

5. **Compare across dimensions** — Do not optimize for accuracy alone. Consider:

| **Dimension** | **What to check** |
|---|---|
| Accuracy | Does the model produce correct answers? |
| Fluency | Does the output read naturally in the target language? |
| Cultural fit | Are cultural references and conventions appropriate? |
| Safety | Does the model avoid harmful outputs in the target language? |
| Latency | How fast is the model for your use case? |
| Cost | What is the per-token cost, accounting for tokenizer efficiency? |

!!! success "The gold standard"
    **Test multiple models on a small set of representative samples from your target application.** This single step provides more reliable guidance than any leaderboard or language list. Models that look similar on benchmarks can diverge significantly on real-world tasks — especially in non-English languages.

---

### 3.2.5 Model selection heuristics

When time is limited, use these heuristics to make a reasonable first choice:

- **High-resource language (Spanish, French, German, Chinese, Japanese, Korean)** — Most large models will perform well. Start with the model that best fits your cost and latency constraints.
- **Mid-resource language (Hindi, Arabic, Turkish, Thai, Vietnamese, Swahili)** — Prefer models that explicitly list the language in their documentation. Test with monolingual prompting first.
- **Low-resource language (minority languages, indigenous languages, less-digitized languages)** — Look for models specifically trained on multilingual data (Aya, BLOOM, multilingual Llama variants). Be prepared to use cross-lingual or translate-test prompting. Consider fine-tuning if prompting alone does not meet your quality bar.

!!! info "Models that disclose training data composition"
    Some models provide detailed breakdowns of their training data by language. This transparency is valuable for multilingual practitioners:
    
    - **BLOOM** — Published detailed language proportions for all 46 languages in its training data
    - **Llama** — Disclosed approximate English/non-English ratios
    - **Aya** — Published coverage for 101 languages with data sourcing methodology
    
    When available, training data composition is the strongest predictor of per-language performance.
