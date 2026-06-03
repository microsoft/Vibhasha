## 3.3 Few-shot examples and chain-of-thought prompting

The number, language, and structure of in-context examples have a significant impact on multilingual performance. This section covers how to design effective few-shot prompts and how chain-of-thought reasoning interacts with language choice.

### 3.3.1 How many examples to provide

More few-shot examples generally improve performance across languages, but the gains diminish after a certain point. The right number depends on your task complexity, context window limits, and the cost of assembling examples.

- **Zero-shot** — Works well for simple tasks when the instruction is clear. Performance varies widely across languages.
- **1–3 examples** — A significant improvement over zero-shot for most tasks. Often sufficient for classification and extraction.
- **5–8 examples** — Recommended for tasks that require understanding output format, handling edge cases, or producing structured output.
- **8+ examples** — Diminishing returns for most tasks, but can help for complex generation or reasoning tasks.

!!! info "Context window trade-off"
    Each example consumes tokens from the context window. In languages with less efficient tokenization, examples cost more tokens than they would in English. If your target language requires 2–3x the tokens of English, you may need to reduce the number of examples to stay within context limits.

### 3.3.2 Which language for few-shot examples

The language of your examples matters as much as their content. Research has identified clear patterns:

**Ranked from strongest to weakest:**

1. **Native-language examples + English instruction** — The most effective combination in most settings
2. **Multilingual examples (mixed languages)** — Surprisingly competitive; helps the model generalize across languages
3. **English-only examples** — Works through cross-lingual transfer but misses language-specific patterns
4. **Full native-language prompt (including instruction)** — Often underperforms option 1, except for high-resource languages

=== "Use native-language examples when"
    - You have access to labeled data in the target language
    - The task requires language-specific patterns (e.g., named entity recognition, code-switching)
    - Output fluency and naturalness matter

=== "Use English-only examples when"
    - No labeled data exists in the target language
    - You are deploying to many languages simultaneously and cannot create per-language example sets
    - The task is language-agnostic (e.g., logic puzzles, arithmetic, code generation)

=== "Use multilingual examples when"
    - You support multiple languages and want a single prompt template
    - You want the model to understand that the task applies across languages
    - You have labeled data in some but not all target languages

!!! warning "Example quality matters more than quantity"
    A small number of high-quality, representative examples will outperform a large set of noisy or off-topic examples. Prioritize examples that demonstrate the exact task format, cover important edge cases, and reflect realistic inputs.

---

### 3.3.3 Chain-of-thought prompting across languages

Chain-of-thought (CoT) prompting — where the model is asked to show its reasoning step by step before giving a final answer — is especially powerful in multilingual settings. Research on the MGSM benchmark across 10 typologically diverse languages has revealed a surprising and consistent finding.

![Chain-of-thought variants for multilingual tasks](/assets/03_prompting/chain-of-thought-variants.svg)

**Four CoT variants for multilingual tasks:**

| **Variant** | **Question language** | **Reasoning language** | **Performance** |
|---|---|---|---|
| Direct | Target | None (no reasoning) | Weakest |
| Native-CoT | Target | Target | Good |
| En-CoT | Target | English | Best |
| Cross-thought | Target | Rephrase to English, then reason | Best for complex tasks |

!!! success "The key finding"
    **English chain-of-thought (En-CoT) outperforms native-language chain-of-thought (Native-CoT)** across all tested languages. Even when the input question is in Hindi, Swahili, or Thai, prompting the model to reason in English produces better results than reasoning in the question's language. This holds because the model's reasoning capabilities are strongest in English, the language that dominates its training data.

### 3.3.4 How to use En-CoT in practice

To apply English chain-of-thought prompting to a non-English task:

1. Present the question in the target language
2. Instruct the model to think step by step in English
3. Request the final answer in the target language (if needed for your application)

**Example — Math reasoning in Bengali:**

```
Solve the following math problem step by step. 
Think through each step in English, then give the final answer.

Problem: একটি দোকানে ১২টি আপেল আছে। যদি ৫টি বিক্রি হয়ে যায় এবং 
তারপর ৮টি নতুন আসে, তাহলে এখন কতটি আপেল আছে?

Let me think step by step:
```

The model will reason in English ("Starting with 12 apples, sell 5 to get 7, add 8 new ones to get 15") and produce a more accurate answer than if it reasoned in Bengali.

### 3.3.5 Cross-thought prompting

Cross-thought prompting goes one step further: it instructs the model to first rephrase the non-English question in English, then reason step by step in English, and finally produce the answer.

This technique forces the model to engage in explicit cross-lingual reasoning, which can improve accuracy beyond standard En-CoT. Studies by [Huang et al. (2023)](https://arxiv.org/abs/2305.07004) showed that cross-thought prompting outperforms both monolingual and translate-test approaches.

**Cross-thought template:**

```
You are given a request in [language]. Follow these steps:
1. Rephrase the request in English
2. Solve the problem step by step in English
3. Provide the final answer in [language]

Request: [non-English input]
```

!!! info "When to use cross-thought prompting"
    Cross-thought prompting adds overhead (longer outputs, more tokens) but pays off for:
    
    - Complex reasoning tasks (math, logic, multi-step analysis)
    - Low-resource languages where the model's native-language reasoning is unreliable
    - Tasks where accuracy is more important than latency or cost

---

### 3.3.6 Aggregating across prompting strategies

When maximum accuracy matters, you can run multiple prompting strategies in parallel and combine their outputs. [Nambi et al. (2023)](https://arxiv.org/abs/2307.07295) demonstrated this approach on the IndicQA dataset:

1. Run the same question through monolingual, cross-lingual, and translate-test prompting
2. Use the LLM itself as a meta-aggregator: feed it all three responses and ask it to select or synthesize the best answer
3. The aggregated response consistently outperformed any individual strategy, especially for low-resource Indic languages

!!! warning "Cost trade-off"
    Aggregation requires multiple LLM calls per query (typically 3–4x the cost). Use this approach selectively — for high-stakes tasks, low-resource languages where no single strategy dominates, or as a quality ceiling during evaluation to understand how much headroom exists.

---

### 3.3.7 Practical recommendations for few-shot and CoT

- **Start with 3–5 native-language examples and an English instruction.** This is the strongest default configuration for most tasks and languages.
- **Use En-CoT for reasoning tasks.** Instruct the model to think in English, even when the input and desired output are in another language.
- **Try cross-thought prompting for complex tasks in low-resource languages.** The extra rephrasing step adds cost but improves accuracy.
- **Experiment with multilingual example sets** when supporting many languages. Mixed-language examples can be surprisingly effective and eliminate the need for per-language prompt engineering.
- **Always compare zero-shot, few-shot, and CoT on your specific task.** The optimal approach depends on the language, model, and task complexity.

!!! info "Source"
    The chain-of-thought findings in this section are based on [Shi et al. (2022)](https://arxiv.org/abs/2210.03057) and [Huang et al. (2023)](https://arxiv.org/abs/2305.07004). The aggregation approach is from [Nambi et al. (2023)](https://arxiv.org/abs/2307.07295). A comprehensive survey of multilingual prompting techniques is available in [Vatsal & Huang (2025)](https://arxiv.org/abs/2505.11665).
