## Multilingual Safety Evaluation: Benchmarks and Datasets

Rigorously assessing multilingual safety requires standardized benchmarks built on authentic, localized content. Several key datasets have emerged to quantify multilingual safety vulnerabilities:

### Key Multilingual Safety Datasets

#### RTP-LX: Multilingual Toxicity Evaluation
- **Coverage**: 1,000+ toxic prompts in **28 languages**
- **Methodology**: Human-transcreated and annotated, includes culturally specific toxic language
- **Key Finding**: Models showed low agreement with human judgments on nuanced cases and context-dependent harms

#### PolygloToxicityPrompts (PTP)
- **Scale**: **425K naturally occurring prompts** in **17 languages**
- **Source**: [https://github.com/kpriyanshu256/polyglo-toxicity-prompts](https://github.com/kpriyanshu256/polyglo-toxicity-prompts)
- **Methodology**: Native toxic content from web (not translation-based)
- **Key Findings**: 
  - Toxicity increases as language resources decrease
  - Larger models can produce more toxicity unless properly aligned
  - Different preference-tuning methods don't significantly change outcomes

#### Aya Red Teaming Dataset
- **Coverage**: Harmful prompts in **8 languages** across **9 harm categories**
- **Unique Feature**: Distinguishes between "global" vs "local" harms
- **Impact**: Preference-based training reduces harm by ~37% on average across languages

#### ALM-Bench (All Languages Matter)
- **Scale**: Multimodal benchmark across **100 languages**
- **Focus**: Cultural and linguistic inclusivity with 22.7K Q&A pairs
- **Safety Implications**: Reveals bias and misunderstanding in culturally diverse contexts

#### Multilingual Jailbreak Challenge
- **Coverage**: Adversarial prompts in **10 languages**
- **Key Results**:
  - Unintentional: Low-resource prompts 3× more likely to yield policy violations
  - Intentional: 81% success rate bypassing ChatGPT's safety

#### LinguaSafe
- **Coverage**: Comprehensive safety benchmark for **12 languages** including under-represented languages (e.g., Hungarian, Malay)
- **Dataset URL**: [https://huggingface.co/datasets/zhiyuan-ning/linguasafe](https://huggingface.co/datasets/zhiyuan-ning/linguasafe)
- **Methodology**: Includes Translated, Transcreated, and Native-sourced content
- **Key Feature**: Native content exhibits higher levels of toxicity and nuance than purely translated data

### Data Collection Methodology

!!! important "Key Principle"
    **Native content** exhibits significantly higher toxicity levels and more nuanced harm expressions than translated content.

#### Data Type Hierarchy:
=== "Translated Data"
    Simple translation of English safety datasets into target languages

=== "Transcreated Data"
    Localized data ensuring cultural equivalence and linguistic authenticity - **crucial for capturing local harm**

=== "Native Data"
    Content directly sourced and curated in the target language

#### Practical Workflow:
1. **Initial Translation**: Use tools like NLLB for preliminary translation
2. **Human Review**: Essential transcreation step with culturally aware annotators
3. **Quality Control**: Require verified linguistic proficiency and cultural sensitivity training

#### Comparative Analysis of Datasets

| Dataset | Primary Focus | Languages | Source Methodology | Critical Feature |
|---------|--------------|-----------|-------------------|------------------|
| **RTP-LX** | Toxicity Detection | 28 | Human-transcreated | Culturally specific toxic language |
| **PTP** | Toxicity Elicitation | 17 | Native web content | Naturally occurring prompts |
| **Aya Red Teaming** | Harmful Prompts | 8 | Human annotations | Global vs. local harm distinction |
| **ALM-Bench** | Cultural Inclusivity | 100 | Native speaker curation | Multimodal cultural content |


