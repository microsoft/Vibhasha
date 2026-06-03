## 3.1 Multilingual prompting strategies

There are three core paradigms for structuring prompts when working across languages. Each one makes different assumptions about which language should be used for instructions, examples, and input. Understanding these paradigms is the foundation for effective multilingual prompt engineering.

### 3.1.1 Monolingual prompting

In monolingual prompting, the instruction and label format (verbalizer) are in English, while the few-shot examples, test input, and expected output are all in the target language. This is the most straightforward approach and often works well for medium- and high-resource languages.

**How it works:**

| **Component** | **Language** |
|---|---|
| Instruction | English |
| Few-shot examples | Target language |
| Verbalizer / labels | English |
| Test input | Target language |
| Output | Target language |

**Example — Sentiment classification in Hindi:**

```
Classify the sentiment of the following review as Positive, Negative, or Neutral.

Review: यह फ़ोन बहुत अच्छा है, बैटरी लंबे समय तक चलती है।
Sentiment: Positive

Review: कैमरा क्वालिटी बहुत खराब है, पैसे बर्बाद हो गए।
Sentiment: Negative

Review: डिलीवरी में थोड़ी देरी हुई लेकिन प्रोडक्ट ठीक है।
Sentiment:
```

!!! success "When to use monolingual prompting"
    - The target language is medium- or high-resource in the model's training data
    - You have access to native-language examples for your task
    - Cultural nuance and natural phrasing matter in the output
    - You want a simple, reliable baseline

---

### 3.1.2 Translate-test prompting

Translate-test prompting takes the opposite approach: the non-English test input is first translated into English, and the entire prompt operates in English. For generation tasks, the English output can be back-translated into the original language.

This strategy capitalizes on the fact that most LLMs perform best in English. However, it introduces a dependency on translation quality.

**How it works:**

| **Component** | **Language** |
|---|---|
| Instruction | English |
| Few-shot examples | English |
| Test input | English (translated from target) |
| Output | English (optionally back-translated) |

!!! warning "Translation quality is the bottleneck"
    Translate-test is only as good as your translation pipeline. For languages with strong machine-translation support (French, Spanish, German, Chinese), this approach can work well. For low-resource languages where translation quality is poor, errors propagate into the model's reasoning and the results may be worse than direct prompting.

**Trade-offs:**

- **Advantage** — Leverages the model's strongest capabilities in English
- **Advantage** — Works well when English-language examples are abundant
- **Disadvantage** — Adds latency and cost from translation steps
- **Disadvantage** — Cultural nuance and idiomatic expressions are often lost in translation
- **Disadvantage** — Translation errors compound, especially for low-resource languages

---

### 3.1.3 Cross-lingual prompting

Cross-lingual prompting uses English (or a pivot language) for the instruction and few-shot examples, while the test input remains in its native language. The output is expected in the native language as well.

This approach is particularly powerful when you have labeled examples only in English but need to apply the model to other languages. It relies on the cross-lingual transfer capabilities that multilingual LLMs develop during pre-training.

**How it works:**

| **Component** | **Language** |
|---|---|
| Instruction | English |
| Few-shot examples | English (or pivot language) |
| Test input | Target language |
| Output | Target language |

**Example — Cross-lingual NER for Swahili:**

```
Extract all person names from the following text.

Text: John Smith met Sarah Johnson at the conference in New York.
Names: John Smith, Sarah Johnson

Text: The report was prepared by Dr. Maria Chen and reviewed by Prof. Ahmed Hassan.
Names: Dr. Maria Chen, Prof. Ahmed Hassan

Text: Rais Samia Suluhu Hassan alikutana na Waziri Mkuu Kassim Majaliwa mjini Dodoma.
Names:
```

!!! info "Why cross-lingual prompting works"
    Multilingual LLMs encode shared representations across languages during pre-training. When you show the model a task pattern in English, it can often transfer that pattern to other languages — even ones it has seen relatively little of during training. The strength of this transfer depends on the model size, the linguistic similarity between English and the target language, and the amount of target-language data in pre-training.

---

### 3.1.4 Comparing the three strategies

| **Strategy** | **Instruction** | **Examples** | **Test input** | **Output** | **Best for** |
|---|---|---|---|---|---|
| Monolingual | English | Target | Target | Target | Medium/high-resource languages with native examples available |
| Translate-test | English | English | English (translated) | English | Languages with strong MT support; reasoning-heavy tasks |
| Cross-lingual | English | English/pivot | Target | Target | No labeled data in target language; rapid multi-language deployment |

!!! success "Practical recommendation"
    Start with monolingual prompting if you have native-language examples. If that underperforms, try cross-lingual prompting with English examples. Reserve translate-test for cases where translation quality is high and the task demands strong English-language reasoning.

---

### 3.1.5 The full prompt in the target language

An alternative that practitioners often try is writing the entire prompt — instruction, examples, and all — in the target language. This can work, but research suggests it is usually not the best approach.

=== "When it works"
    - The language is high-resource (Spanish, French, German, Chinese, Japanese) and the model has strong instruction-following ability in that language
    - The task is culturally specific and the English framing would introduce bias
    - You are working with a model that was explicitly fine-tuned for the target language

=== "When it underperforms"
    - Most LLMs follow English instructions more reliably than instructions in other languages
    - For low- and mid-resource languages, model comprehension of complex instructions drops significantly
    - English instructions activate stronger reasoning pathways in the model, even when the rest of the prompt is in another language

!!! warning "A common misconception"
    Many developers assume that matching the prompt language to the user's language will produce the best results. In practice, keeping the instruction in English while using native-language examples and input usually outperforms a fully native prompt. Test both configurations on your specific task before committing to one approach.

---

### 3.1.6 Selective translation of prompt components

Rather than translating everything or nothing, you can selectively choose which prompt components to translate. This gives you fine-grained control over the language mix.

The four components of a prompt that can be independently translated are:

- **Instruction** — The task directive (e.g., "Classify the sentiment")
- **Context** — Background information the model needs
- **Examples** — Demonstration input-output pairs
- **Output format** — The expected response structure

Research shows that selectively translating instructions into English while keeping context and examples in the target language can outperform both full translation and fully native prompts by 100–200% in some low-resource scenarios.

| **What to translate** | **When** |
|---|---|
| Instruction only → English | Default recommendation for most languages |
| Instruction + examples → English | When no native-language examples are available |
| Everything → English | Only when MT quality is very high and the task is reasoning-heavy |
| Nothing (all native) | Only for high-resource languages with strong model support |

!!! info "Source"
    The strategies described in this section are based on research from the [ACL 2023 tutorial on prompting strategies for multilingual LLMs](https://www.microsoft.com/en-us/research/people/susitara/) by Sunayana Sitaram, and studies including [Shi et al. (2022)](https://arxiv.org/abs/2210.03057), [Huang et al. (2023)](https://arxiv.org/abs/2305.07004), and [Nambi et al. (2023)](https://arxiv.org/abs/2307.07295).
