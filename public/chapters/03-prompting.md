# Prompting for multilingual LLMs

Modern LLMs are trained on massive multilingual corpora and can understand and generate text in dozens — sometimes hundreds — of languages out of the box. Before investing in fine-tuning or building custom pipelines, it is worth exploring how far you can get by simply prompting an existing model well.

This chapter covers how to use LLMs off-the-shelf for multilingual tasks through effective prompting. It focuses on three key areas: how to structure prompts across languages, how to pick the right model for your language and task, and how to validate that your prompting approach actually works.

!!! info "The Core Question"
    When working with a multilingual LLM, every component of your prompt — the instruction, the examples, the input, and the expected output — can be in a different language. The choice of language for each component has a measurable impact on performance. Getting this right is one of the highest-leverage decisions you can make before writing any training code.

---

## Why prompting matters for multilingual applications

Prompting is the fastest and most cost-effective way to deploy multilingual capabilities. Unlike fine-tuning, which requires labeled data and compute resources for each language, prompt engineering lets you iterate quickly across languages without modifying model weights.

But multilingual prompting is not as simple as translating an English prompt into the target language. Research consistently shows that the language of each prompt component — instruction, examples, reasoning chain, and output — affects model behavior in different ways. A well-designed multilingual prompt can outperform a naively translated one by a wide margin.

### What you will learn in this chapter

- **Prompting strategies** — The three core paradigms for structuring multilingual prompts: monolingual, translate-test, and cross-lingual prompting
- **Model selection** — How to identify the best model for your language and task using leaderboards, language support data, and hands-on evaluation
- **Few-shot design and chain-of-thought** — How the language and number of examples affect performance, and why English-language reasoning often outperforms native-language reasoning even for non-English tasks
- **Practical evaluation** — How to test multiple models and prompting strategies on representative samples from your target application


## The anatomy of a multilingual prompt

A prompt has four core components. In a multilingual setting, each one can be in a different language, and the combination matters.

| **Component** | **What it does** | **Language choice matters because…** |
|---|---|---|
| **Instruction** | Tells the model what task to perform | English instructions tend to work best, even for non-English tasks |
| **Examples** | Shows the model the expected input-output pattern | Native-language examples often outperform English-only examples |
| **Input** | The actual text the model needs to process | Usually stays in the target language |
| **Output** | The format and language of the model's response | Depends on your application requirements |

!!! success "Key Insight"
    Keeping the instruction in English while providing examples and test inputs in the target language is a robust default that works well across many settings. This leverages the model's strong English instruction-following ability while grounding it in the target language.

![Multilingual prompting strategies](/assets/03_prompting/prompting-strategies-overview.svg)

---

## When to use prompting vs. other approaches

Prompting is not always the answer. Use this chapter's guidance when:

=== "Prompting is a strong fit"
    - You are building a proof of concept or early prototype
    - The target language is medium- to high-resource
    - Your task is well-defined (classification, extraction, summarization, Q&A)
    - You need to support many languages without per-language training data
    - Speed of iteration matters more than squeezing out the last few percentage points of accuracy

=== "Consider fine-tuning instead"
    - The target language is severely low-resource and the model struggles even with good prompts
    - You need domain-specific terminology or style that the model does not produce naturally
    - Safety or compliance requirements demand tighter behavioral control
    - You have labeled data and the budget for training

=== "Consider translation pipelines"
    - The model performs poorly in the target language but has strong machine-translation support
    - Your task is reasoning-heavy and the model's English capabilities far exceed its multilingual ones
    - You need consistent quality across many languages and are willing to accept translation artifacts

!!! warning "No Single Best Strategy"
    Research consistently shows that no single prompting strategy works best for all tasks, languages, and models. The optimal approach depends on the specific combination of language, task, and model you are working with. This chapter gives you the tools to find the right configuration for your use case.
