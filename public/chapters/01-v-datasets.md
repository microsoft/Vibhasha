## Dataset Discovery and Creation

!!! quote "The Foundation of Evaluation"
    Effective LLM evaluation relies on high-quality, representative datasets. This section explores leveraging existing benchmarks and systematically creating new ones, with special emphasis on multilingual and multicultural contexts.

### Navigating Existing Benchmarks

Initial LLM evaluation typically involves surveying and using existing benchmarks. These provide a convenient starting point with structured tasks and predefined metrics. However, their utility, especially in complex multilingual evaluation, faces significant constraints.

!!! success "Advantages of Existing Benchmarks"
    - **Broad Foundation**: Cover diverse NLP tasks and languages
    - **Common Ground**: Enable model comparison across research efforts
    - **Quick Start**: Provide structured tasks with predefined metrics

!!! failure "Critical Limitations"
    **Contamination**  
    Many popular benchmarks are inadvertently or intentionally included in LLM training data, making them unsuitable for fair assessment—performance may reflect memorization rather than true capability
    
    **Linguistic Imbalance**  
    Significant imbalance in linguistic representation: Indo-European and Latin-script languages are overrepresented, while benchmarks for low-resource or non-Latin script languages are scarce
    
    **Cultural Context Loss**  
    Many multilingual benchmarks are direct translations of English originals, leading to loss of critical linguistic and cultural context—reduces LLM evaluator agreement with human judgments on culturally sensitive evaluations
    
    **Task Coverage Gaps**  
    Deficiency in benchmarks designed to simulate real-world LLM usage, especially for complex tasks like abstract reasoning, conversational dialogue, and nuanced chat interactions across diverse languages
    
    **Ceiling Effects**  
    Older benchmarks are often too simplistic for current state-of-the-art models, leading to models achieving near-perfect scores—hinders meaningful performance differentiation

#### Key Multilingual LLM Evaluation Benchmarks

The following table summarizes key multilingual benchmarks, detailing their task types, language coverage, and notable characteristics. This is essential for navigating the current landscape and identifying appropriate datasets for specific global evaluation needs.

| Benchmark Name | Task Type(s) | Language Coverage | Key Characteristics/Challenges |
|----------------|--------------|-------------------|-------------------------------|
| **XNLI** | Natural Language Inference | 15 languages | Translated |
| **IndicXNLI** | Natural Language Inference | 11 Indic languages | Culturally-nuanced, Indic languages |
| **GLUECOS NLI** | Natural Language Inference | 2 (English-Hindi) | Code-mixed |
| **PAWS-X** | Paraphrase Identification | 7 languages | ⚠️ High contamination risk |
| **XCOPA** | Commonsense Reasoning | 10 languages | ⚠️ High contamination risk |
| **XStoryCloze** | Commonsense Reasoning | 11 languages | ✅ Low contamination risk |
| **TyDiQA-GoldP** | Question Answering | 9 languages | ⚠️ High contamination risk |
| **MLQA** | Question Answering | 6 languages | ⚠️ High contamination risk |
| **XQUAD** | Question Answering | 11 languages | ⚠️ High contamination risk |
| **IndicQA** | Question Answering | 10 Indic languages | Indic languages |
| **AfriQA** | Question Answering | 10 African languages | African languages, no context passage |
| **MaRVL** | Visual Question Answering | 5 languages | Multimodal, culturally-driven concepts |
| **UDPOS** | Part of Speech Tagging | 38 languages | ✅ Low contamination risk |
| **PAN-X** | Name Entity Recognition | 48 languages | ⚠️ High contamination risk |
| **XRISAWOZ** | Task-Oriented Dialogue | 6 languages | Dialogue, code-mixed, ⚠️ high contamination |
| **WinoMT** | Responsible AI (Gender Bias) | 8 languages | Gender bias assessment |
| **GLUECOS Sentiment** | Sentiment Analysis | 2 (English-Spanish) | Code-mixed |
| **Jigsaw** | Toxicity Classification | 6 languages | ✅ Low contamination risk |
| **XLSum** | Summarization | 44 languages | ✅ Low contamination risk |
| **IN22** | Machine Translation | 14 evaluated / 22 total Indic | General & conversational domains |
| **XM-3600** | Image Captioning | 20 evaluated / 36 total | Multimodal, geographically diverse |
| **Belebele** | Reading Comprehension | 23 evaluated / 122 total | Parallel, discriminates comprehension levels |

### Systematic Creation of New Evaluation Datasets

When existing benchmarks are inadequate due to contamination, insufficient language coverage, or task irrelevance, systematically creating new, high-quality evaluation datasets becomes essential.

!!! important "When to Create New Datasets"
    - Existing benchmarks show contamination
    - Insufficient coverage for your target languages
    - Task requirements not met by existing resources
    - Need for culturally-appropriate evaluation content

#### Principles of Prompt Curation

Robust evaluation datasets are built on carefully curated prompts that capture the richness of human language and culture.

<div class="grid cards" markdown>

-   :material-account-group:{ .lg .middle } __Native Speaker Involvement__

    ---

    Active participation of native speakers is paramount for capturing intricate linguistic and cultural nuances
    
    **Critical**: Prompts should be developed independently for each language, not translated

-   :material-format-list-bulleted:{ .lg .middle } __Diverse Content Categories__

    ---

    Cover diverse domains (health, finance, culturally-specific topics) for comprehensive evaluation
    
    Ensures assessment of LLM capabilities across knowledge areas and cultural sensitivities

-   :material-quality-high:{ .lg .middle } __Varying Quality Levels__

    ---

    For meta-evaluation, create balanced datasets with "good-quality" and "bad-quality" samples
    
    Systematically prompt LLMs with varied temperature settings and adversarial instructions

</div>

#### Designing Human Annotation Protocols

The integrity of a new dataset relies heavily on well-defined human annotation protocols and clear, unambiguous guidelines.

=== "Clear Task Definition"
    Annotators must precisely understand:
    
    - The evaluation task
    - The metrics to be assessed
    - Expected outcomes

=== "Detailed Metric Rubrics"
    Comprehensive rubrics for each metric (LA, TQ, H, OCQ, PC) are essential:
    
    - Clear scoring ranges
    - Illustrative examples in target language
    - Consistent interpretation across annotators and cultural contexts

=== "Evaluation Settings"
    Implement both:
    
    - **Pairwise comparison**: Comparing two responses
    - **Direct assessment**: Rating a single response
    
    This captures different facets of LLM quality across languages

=== "Quality Controls"
    **Blinding**: Annotators should be blinded to model names
    
    **Justification**: Require annotators to provide justifications for valuable qualitative data
    
    **Consistency Checks**: Duplicate pairings with flipped response orders
    
    **Gibberish Check**: Initial filter for nonsensical outputs

#### Inter-Annotator Agreement Metrics

!!! info "Ensuring Annotation Quality"
    To confirm the reliability and quality of human annotations, rigorous measurement of inter-annotator agreement (IAA) is indispensable.

| Metric | Description | When to Use |
|--------|-------------|-------------|
| **Percentage Agreement (PA)** | Straightforward raw measure of agreement proportion | Quick assessment (doesn't account for chance agreement) |
| **Fleiss' Kappa (κ)** | Robust measure factoring out chance agreement | Per-datapoint agreement among multiple annotators (κ > 0.6 indicates substantial agreement) |
| **Kendall's Tau (τ)** | Non-parametric statistic for assessing correlation between rankings | Comparing human and LLM evaluator leaderboards |

!!! danger "The Calibration Dependency"
    Creating evaluation datasets, especially for subjective judgments, involves constructing a reliable approximation of human judgment. This relies on meticulous prompt curation, detailed annotation guidelines, and rigorous inter-annotator agreement checks.
    
    **Critical Point**: The primary goal is to minimize noise and bias in the human-labeled "gold standard," as this standard calibrates LLM evaluators. **If the human-derived "gold truth" is compromised, any calibrated LLM evaluator will inherit those flaws**, undermining the entire evaluation—particularly in complex multilingual scenarios.

---

