# Fine-Tuning

## Overview

Fine-tuning involves adapting a **lightweight open-source LLM** (e.g., Mistral, Phi-2, Gemma) on **domain-specific and culturally relevant multilingual data**.

This strategy is suitable for building highly customized, culturally aware, and privacy-preserving systems.

## When to Use

* You have access to **domain-specific data**
* You need **full control** over tone, behavior, or cultural alignment
* You’re deploying in **low-resource**, **private**, or **air-gapped** environments

## Pros

* Highly **customizable and controllable** outputs
* Works well for **niche domains** and **local dialects**
* Supports **offline or private deployment**
* Enables **value alignment** through custom objectives

## Cons

* Requires **labeled data** or curated corpora
* Demands **training infrastructure** and model expertise
* Smaller models may struggle with **complex reasoning**
* Cultural generalization is challenging with **limited data**

## Training Techniques

### Parameter-Efficient Fine-Tuning (PEFT)

* e.g., LoRA, QLoRA
* **Pros**: minimal changes to core model, efficient adaptation
* **Cons**: managing multiple adapters can complicate deployment

### Full Fine-Tuning

* Complete retraining of the model for maximum alignment
* More resource-intensive, but useful when PEFT falls short

### Continued Pretraining

* Language/domain adaptation via additional unlabeled text
* Can precede or complement fine-tuning

## Data Preparation

* Collect or augment with:

  * **Parallel texts**, **glossaries**, **instruction datasets**
  * **Local stories**, **FAQs**, **proverbs** for cultural grounding

* Generate **synthetic data** when resources are limited

  * Translate English IFT datasets
  * Apply **selective translation** or **cultural augmentation**

## Cultural Alignment

* Fine-tune with culturally diverse data
* Avoid overfitting to narrow perspectives
* Explore **self-pluralizing alignment**:

  * Teach models to present **multiple cultural viewpoints**

## Summary

Fine-tuning offers maximum control and cultural alignment, but requires careful planning around data, infrastructure, and deployment. It’s ideal when your application demands high fidelity to local language, norms, or values.


## Adaptation to New Languages - https://github.com/tjunlp-lab/Awesome-Multilingual-LLMs-Papers


Adaptation to New Languages
"Efficient and Effective Text Encoding for Chinese LLaMA and Alpaca".

Yiming Cui et al. arXiv 2023. [Paper] [Github]

"Efficient and Effective Vocabulary Expansion Towards Multilingual Large Language Models".

Seungduk Kim et al. arXiv 2024. [Paper]

"Continual Pre-Training for Cross-Lingual LLM Adaptation: Enhancing Japanese Language Capabilities".

Kazuki Fujii et al. COLM 2024. [Paper]

"MaLA-500: Massive Language Adaptation of Large Language Models".

Peiqin Lin et al. arXiv 2024. [Paper]

"SeaLLMs -- Large Language Models for Southeast Asia".

Xuan-Phi Nguyen et al. ACL 2024 DEMO TRACK. [Paper] [Github]

"LangBridge: Multilingual Reasoning Without Multilingual Supervision".

Dongkeun Yoon et al. ACL 2024. [Paper] [Github]

"RomanSetu: Efficiently unlocking multilingual capabilities of Large Language Models via Romanization".

Jaavid Aktar Husain et al. ACL 2024. [Paper] [Github]

"BLOOM+1: Adding Language Support to BLOOM for Zero-Shot Prompting".

Zheng Xin Yong et al. ACL 2023. [Paper] [Github]

"LLaMA Beyond English: An Empirical Study on Language Capability Transfer".

Jun Zhao et al. arXiv 2024. [Paper]

"Rethinking LLM language adaptation: A case study on chinese mixtral".

Yiming Cui et al. arXiv 2024. [Paper] [Github]


MultiFiT: Efficient Multi-lingual Language Model Fine-tuning - https://aclanthology.org/D19-1572.pdf

adaptMLLM: Fine-Tuning Multilingual Language Models on  Low-Resource Languages with Integrated LLM Playgrounds - https://arxiv.org/pdf/2403.02370

Towards Modular Fine-tuning of LLM-based Multilingual Neural Machine Translation - https://openreview.net/pdf?id=6SFgylV3q2

HowManyLanguages Make Good Multilingual Instruction Tuning?
 ACase Study on BLOOM - https://aclanthology.org/2025.coling-main.175.pdf

 Less-forgetting multi-lingual fine-tuning - https://dl.acm.org/doi/10.5555/3600270.3601355


Improving Multilingual Instruction Finetuning via Linguistically Natural and Diverse Datasets - https://aclanthology.org/2024.findings-emnlp.128/


KS-Lottery: Finding Certified Lottery Tickets for Multilingual Transfer in Large Language Models - https://aclanthology.org/2025.naacl-long.458/

Is Translation All You Need? A Study on Solving Multilingual Tasks with Large Language Models - https://aclanthology.org/2025.naacl-long.485/

Cross-lingual Transfer of Reward Models in Multilingual Alignment - https://aclanthology.org/2025.naacl-short.8/

A Fair Comparison without Translationese: English vs. Target-language Instructions for Multilingual LLMs - https://aclanthology.org/2025.naacl-short.55/

ProxyLM: Predicting Language Model Performance on Multilingual Tasks via Proxy Models - https://aclanthology.org/2025.findings-naacl.106/


ATLAS : ADAPTIVE TRANSFER SCALING LAWS FOR MULTILINGUAL PRETRAINING, FINETUNING, AND DECODING THE CURSE OF MULTILINGUALITY - https://arxiv.org/pdf/2510.22037

