# Translation

## Overview

One common strategy for multilingual deployment is to use **automatic translation**:

* Translate non-English input to English
* Use an English-centric LLM
* Translate the output back to the original language

This approach leverages the strength of English-dominant LLMs without requiring native multilingual support.

## When to Use

* Your language has **reliable machine translation** to/from English
* You lack resources to fine-tune models
* **Accuracy** is more important than **cultural fluency**

## Pros

* Works with **off-the-shelf translators** and English LLMs
* Fast to set up
* Useful when **native-language LLM support is weak**

## Cons

* **Cultural nuance** may be lost
* Translation errors can **propagate** to final output
* Limited **personalization** (e.g., forms of address, dialects)

## Translation Strategies

### Full Translation

Translate entire input and output to/from English.

### Selective Translation

Translate only parts of the prompt:

* Keep examples or instructions in original language
* Translate only the query or expected output

This modular approach helps balance **fidelity** and **model compatibility**.

### Scratchpad Techniques

Use translation as an internal reasoning tool:

* Translate input to English, reason in English, then translate back
* Effective in **very low-resource** languages

### Fine-Tuning Translators

Train or adapt translation systems:

* Generate **synthetic data** to expand training
* Use **instruction fine-tuning (IFT)** with LoRA
* Post-process outputs to improve fluency and tone

## Risks & Caveats

* **Dependency on translation quality**
* Loss of **idiomatic** or **culturally embedded** meaning
* Introduces **two points of failure** (input and output)

## Summary

Translation is a powerful strategy — especially when paired with robust English LLMs — but requires careful design and evaluation to preserve meaning, tone, and cultural context.
