# Off-the-Shelf Prompting

## Overview

This strategy involves using **pretrained general-purpose LLMs** (e.g., GPT-4, Claude, Phi, Llama) without additional training — relying instead on smart **prompt engineering** to handle multilingual or multicultural requirements.

## When to Use

* You need a **fast prototype** or **proof-of-concept**
* The target language is **reasonably supported** by the model
* You can invest in **prompt design**, **few-shot examples**, or **retrieval augmentation**

## Pros

* **No training or labeling needed** — rapid time-to-market
* Works across many **mid- to high-resource languages**
* Easy to experiment with **cultural framing** (e.g., personas, tones)
* Effective for **zero-shot** and **few-shot** tasks

## Cons

* **Prompting is fragile** — performance can vary widely
* **Inconsistent behavior** in low-resource languages
* Hard to control **tone and style** over long conversations
* May underperform on **sensitive or domain-specific tasks**

## Prompting Techniques

* **Prompt Sensitivity**: test how different phrasings affect performance
* **Multilingual Prompting**:

  * Prompt in English or native language
  * Use hybrid prompts
* **Cultural Prompting**:

  * Frame answers using local context
  * e.g., "Answer as if you're a journalist from Japan"
* Use **prompt programming frameworks** to iterate and test

## Key Considerations

* **Language Coverage**: which languages does the LLM support reliably?
* **Latency & Cost**: does your setup require real-time responses?
* **Domain Fit**: how well does the LLM generalize to your task?

## Summary

Prompting off-the-shelf LLMs is a fast, versatile approach for multilingual tasks — especially when infrastructure is limited. However, the effectiveness hinges on thoughtful prompt design, language support, and robust testing.
