# The Cultural Dimension of Multilingual NLP: Strategies for Alignment and Equity

!!! quote "The Cultural Imperative"
    True multilingual AI requires more than linguistic fluency—it demands deep cultural competence that respects diverse worldviews, values, and social norms. **Cultural awareness transforms LLMs from mere translation tools into culturally intelligent systems.**

---

## Overview

Cultural awareness in Natural Language Processing (NLP) represents a fundamental shift away from merely achieving linguistic competence toward mastering socio-pragmatic behavioral alignment. For large language models (LLMs) to serve global populations effectively, they must internalize and appropriately express the complex systems of shared beliefs, norms, and behavioral standards that define human societies.

!!! danger "Cultural Bias Risks"
    - **Algorithmic Monoculture**: Western-centric training data creates inherent cultural bias; Single set of values imposed as universal standards
    - **Cultural Homogenization**: "WEIRD" perspectives marginalize diverse worldviews
    - **Language Loss**: 40% of world's languages missing from AI systems

This chapter provides comprehensive strategies for building culturally aware multilingual systems, from quantification frameworks and data creation methodologies to modeling techniques and evaluation protocols.

---

## 1. Establishing the Cultural Imperative in Global NLP

### Delineating Culture and Multilinguality in the NLP Context

While multilinguality addresses the surface-level variations of language—grammar, syntax, and vocabulary—cultural awareness necessitates recognizing and adapting to shared human knowledge and complex social rules. 

!!! info "The Critical Challenge"
    Moving beyond surface-level representations requires addressing significant resource deficiencies concerning deep cultural elements, such as norms, morals, aesthetics, social associations, and different types of value perceptions.

A comprehensive analysis of cultural awareness efforts across the NLP community confirms that inclusion must span various modalities, including text and vision, requiring explicit focus on:

- **Benchmark creation**
- **Training data development** 
- **Advanced alignment methodologies**
- **Robust evaluation protocols**

Many models, while linguistically proficient, struggle with context-dependent tasks because they lack the necessary socio-pragmatic reasoning required for true cultural relevance. The goal of cultural adaptation is not just ensuring the model speaks the right language, but ensuring it behaves (makes decisions, interacts, and complies) like an informed member of the target culture.

!!! warning "Cross-Cultural Modeling Challenge"
    Most existing studies examine cultural elements in isolation, failing to analyze similarities and differences between groups. This isolated approach hinders genuine multicultural dataset development and risks flattening distinct cultural identities through over-generalization.

### The Ethical and Societal Risks of Monocultural AI Systems

The widespread deployment of LLMs, which are predominantly trained on vast quantities of English-language and Western-centric data, introduces profound ethical and societal hazards.

!!! danger "The Algorithmic Monoculture Problem"
    This foundation fosters an **algorithmic monoculture**, leading to systems that exhibit inherent cultural value bias directly attributable to:
    
    - **Training Data Dominance**: Primarily English corpora
    - **Fine-tuning Methods**: Western-centric alignment techniques  
    - **Market Uniformity**: Homogeneous LLM development approaches

#### Digital Colonialism Through AI

This monolithic development trajectory risks a new form of **digital colonialism**, where a single set of values, frequently emphasizing individualism and Anglo-Saxon norms, is inadvertently promoted as the universal standard or "correct" way of thought.

!!! failure "The WEIRD Problem"
    Researchers identify this as cultural homogenization or "global weirdization"—where Western, Educated, Industrialized, Rich, and Democratic (WEIRD) perspectives are reinforced, creating systems that marginalize non-WEIRD ways of conceptualizing fundamental concepts like time, space, and causality.

#### Severe Consequences of Cultural Bias

!!! warning "Systemic Impact"
    **Beyond Simple Inaccuracy**: The problem transcends factual errors like misidentifying popular activities—it involves imposing Western cognitive frameworks upon global users.
    
    **Amplified Inequalities**: LLMs risk not only reflecting but amplifying existing systemic biases, resulting in:
    - Biased hiring decisions
    - Wrongful identification systems
    - Deepened societal inequalities
    
    **Linguistic Loss**: Absence of over 40% of the world's languages from AI systems accelerates their disappearance and reinforces Western technological dominance.

Currently, documented negative impacts of LLM-driven homogenization significantly outweigh evidence of successfully fostering diversity. This gap requires urgent, explicit attention to inclusivity in the AI design, data, and development pipeline.

---

## 2. Frameworks for Cultural Quantification and Measurement

Effective mitigation of cultural bias necessitates a systematic method for measuring and quantifying the cultural values ingrained within LLMs. Geert Hofstede's cultural dimensions framework has emerged as a primary diagnostic tool for this purpose, offering a quantifiable and explanatory mechanism for cross-cultural comparison.

### The Hofstede Model as an NLP Diagnostic Tool

Hofstede's foundational work provides a structured framework for conceptualizing complex differences, such as the spectrum between individualism and collectivism or variations in power distance.

!!! info "Cultural Alignment Test (CAT)"
    Researchers have developed the **Cultural Alignment Test (CAT)**, which quantifies cultural alignment using Hofstede's dimensions, evaluating major LLMs against cultural dimensions of specific regions like the United States, China, and Arab countries.

**Key Research Findings**: While all LLMs exhibit difficulty grasping complex cultural values consistently, higher-performing models show varying levels of adaptation:

- **GPT-4**: Demonstrates unique capability to adapt to certain cultural nuances (e.g., Chinese settings)
- **Challenges**: Struggles significantly with aligning to American and Arab cultures

### The Impact of Language-Specific Training on Model Values

!!! success "Critical Discovery"
    A crucial finding from Hofstede-based evaluations reveals a **strong, demonstrable link** between the language used in fine-tuning and the resulting cultural value expression of the model.

**Language as Cultural Proxy**: Research confirms that language serves as a proxy for value incorporation—fine-tuning LLMs with different languages causes measurable shifts in their responses to cultural questions.

!!! note "Strategic Implication"
    Even highly capable models like GPT-4 struggle to align perfectly with American culture despite likely dominance of US data in pre-training. This suggests alignment requires **explicit cultural adaptation** through specific prompts or fine-tuning, not just data ingestion.

#### Hofstede's Dimensions Applied to LLM Behavior

| **Dimension** | **Core Concept** | **Potential NLP Impact (Bias/Misalignment)** |
|---------------|------------------|-----------------------------------------------|
| **Individualism vs. Collectivism** | Degree of integration into groups and reliance on self vs. community | Prioritizing individual achievement narratives; misinterpreting group-oriented social norms or family hierarchy structures |
| **Power Distance Index (PDI)** | Acceptance of power distribution inequality in institutions and organizations | Generating inappropriate levels of formality, deference, or challenge in dialogue; misinterpreting authority cues |
| **Uncertainty Avoidance (UAI)** | Tolerance for ambiguity and unstructured situations, need for rules and clarity | Affecting response style, favoring certainty or definitive answers over nuanced possibilities; reacting poorly to vague prompts |
| **Masculinity vs. Femininity** | Preference for achievement, heroism (Masculine) vs. cooperation, modesty (Feminine) | Gender stereotyping in task assignment; skewed interpretation of emotional or collaborative language |
| **Long-Term Orientation** | Degree to which societies prioritize tradition over pragmatic adaptation | Biases in predictive or planning tasks; misrepresenting historical context or social change dynamics |

---

## 3. The Data Layer Blueprint: Building Culturally Aware Benchmarks and Datasets

The cornerstone of any culturally aligned system is the quality and representativeness of its data. Addressing cultural bias demands scalable, cost-effective methods for generating culturally rich datasets, especially training data, where a significant deficit currently exists.

### Current Gaps and the Need for Training Data

!!! failure "Primary Limitation"
    Most existing cultural resources have been constructed for evaluation (benchmarks and test sets), creating an urgent need for large-scale, culturally diverse training data.

**Specific Coverage Deficiencies**:

- **Abstract Concepts**: Lack of multilingual data for aesthetics and spatial relations across unimodal and multimodal contexts
- **Monocultural Focus**: Resources for norms and morals predominantly in English, reflecting narrow perspectives
- **Geographic Inequity**: Persistent underrepresentation of diverse geographical regions and cultures

### Methodologies for Culturally Inclusive Data Creation

To acquire culturally rich data, methodologies must balance scalability with fidelity, leading to categorization based on their reliance on human labor and computational resources.

#### Traditional Data Pipelines and Their Limitations

Traditional methods, while foundational, face inherent scaling challenges when dealing with cultural complexity:

!!! example "Automatic Pipelines"
    **Approach**: Curate cultural knowledge quickly by leveraging large-scale, publicly available multilingual corpora
    
    **Limitations**: 
    - Inherit and amplify existing biases from source material
    - Limited depth of cultural knowledge captured
    - High scalability but moderate cost

!!! example "Semi-Automatic Pipelines"
    **Approach**: Source data from web platforms (Wikipedia, social media) with human annotation/validation
    
    **Examples**: CUNIT, CAMeL, EnCBP
    
    **Limitations**:
    - Expensive and slow due to human validation requirements
    - Challenging to scale internationally
    - Dependent on expert annotators

#### Synthetic Data Generation via Simulation (CulturePark)

The constraints of traditional, human-labeled data collection have driven innovation toward synthetic data generation.

!!! success "CulturePark Framework"
    **Innovation**: Utilizes LLM-powered multi-agent simulation to efficiently create high-quality cross-cultural dialogues
    
    **Mechanism**: 
    - LLM-based agents assigned roles corresponding to different cultures (8 cultures, 2 genders)
    - Simulates both in-cultural and cross-cultural communication
    - Generates dialogues encapsulating specific human beliefs, customs, and norms
    
    **Proven Effectiveness**: Models fine-tuned on 41,000 synthetic samples surpassed GPT-4's performance on Hofstede's VSM 13 framework

#### Culturally Aware Data Creation Methodologies Comparison

| **Methodology** | **Mechanism/Goal** | **Scalability/Cost** | **Key Challenges** | **Example** |
|-----------------|-------------------|----------------------|-------------------|-------------|
| **Automatic Pipelines** | Curation from multilingual corpora | High Scalability; Moderate Cost | Inherits biases; limited depth | Model-in-the-Loop Curation |
| **Semi-Automatic Pipelines** | Web data + human annotation | Moderate Scalability; High Cost | Human dependency; slow adaptation | CUNIT, CAMeL, EnCBP |
| **Synthetic Simulation** | LLM multi-agent frameworks | High Scalability; Low-Moderate Cost | Framework complexity; quality dependent on LLM knowledge | CulturePark |
| **Semantic Augmentation** | Culture-specific data from seed datasets | High Scalability; Low Cost | Seed data quality dependency | CultureLLM (WVS Seed Data) |

### Best Practices for Culturally Aware Annotation

While synthetic methods address scale, culturally sensitive tasks still require robust human validation and high-quality initial seed data.

!!! tip "Key Best Practices"
    **Expert and Native Engagement**: Employ expert annotators and linguists who are native speakers of the target language, particularly critical for low-resource languages
    
    **Process Rigor**: Provide comprehensive training and detailed guidelines with iterative quality control processes
    
    **Ethical Oversight**: Adhere to ethical considerations including user privacy and consent for fairer, more dependable systems

---

## 4. Modeling Strategies for Deep Cultural Alignment

Achieving deep cultural alignment requires moving beyond generalized multilingual pre-training and implementing targeted fine-tuning and knowledge injection techniques designed to enable LLMs to process socio-pragmatic concepts and exhibit appropriate cultural behavior.

### Instruction Tuning and Multilingual Generalization

!!! info "Instruction Tuning Power"
    Training models on instruction-response pairs is a powerful technique for refining LLM reasoning capabilities. Diversifying instruction tuning with even minimal languages (2-4) significantly improves cross-lingual generalization and performance.

**Nuanced Landscape**: While language-specific tuning enhances cultural understanding, it can simultaneously uncover and amplify existing inconsistencies and biases, especially in non-Western cultures. This complexity confirms that relying solely on linguistic fluency is insufficient—explicit cultural instruction is required.

!!! example "CRAFT Methodology"
    **CRAFT (Extracting and Tuning Cultural Instructions from the Wild)**: Focuses on curating and tuning LLMs with culturally related questions and responses to enhance explicit reasoning capabilities across multiple cultures in conversational contexts.

### Knowledge Incorporation Techniques: Data-Efficient Alignment

Two cutting-edge methodologies—CultureLLM and CultureSPA—demonstrate the feasibility of achieving profound cultural shifts efficiently, without requiring vast external cultural data.

#### CultureLLM: Semantic Data Augmentation

!!! success "Cost-Effective Cultural Adaptation"
    **CultureLLM Framework**: Offers a cost-effective solution to address knowledge gaps in low-resource cultures
    
    **Methodology**:
    - Uses World Value Survey (WVS) as seed dataset
    - Employs semantic data augmentation to generate large quantities of culture-specific training data from as few as 50 initial samples
    - Fine-tunes culture-specific and unified models
    
    **Proven Results**: Significantly outperforms generic LLMs:
    - **GPT-3.5**: +8.1% improvement
    - **Gemini Pro**: +9.5% improvement
    - Tested on 60 cultural alignment datasets

#### CultureSPA: Self-Pluralizing Alignment

!!! info "Internal Knowledge Activation"
    **CultureSPA (Self-Pluralising Culture Alignment)**: Operates on the principle that LLMs possess substantial internal, latent knowledge about diverse cultures and aims to enhance cultural alignment by activating this pre-existing knowledge.

**Four-Step Mechanism**:

1. **Question Generation**: Generate diverse culture-related questions from WVS seeds
2. **Dual Prompting**: Collect LLM outputs under culture-unaware and culture-aware prompting (CAP) conditions
3. **Sample Selection**: Identify samples showing significant output shifts between prompting scenarios
4. **Fine-Tuning**: Use culture-related QA pairs for culture-joint or culture-specific Supervised Fine-Tuning (SFT)

!!! note "Key Insight"
    Simple Culture-Aware Prompting (CAP) is an effective way to immediately enhance alignment, demonstrating that LLM internal knowledge can be robustly harnessed and refined.

### Modeling Evolving Culture

!!! warning "Dynamic Challenge"
    A critical and underexplored challenge is the **dynamic nature of culture**. Cultural norms, slang, and associations constantly evolve, requiring systems that can adapt rapidly.

**Requirements**: Developing specific architectures supporting continuous learning and rapid adaptation methods grounded in updated cultural knowledge and safety values data to ensure LLMs remain relevant and appropriate over time.

---

## 5. Dynamic Mitigation: Prompt Engineering as a Control Mechanism

For developers and end-users seeking immediate, parameter-free control over an LLM's cultural output, prompt engineering provides the most accessible and versatile mitigation strategy.

!!! success "Proven Effectiveness"
    Studies focusing on bias mitigation against specific cultural groups (e.g., Arabs and Muslims) show that cultural prompting can achieve **71% to 81% better cultural alignment**.

### Advanced Prompting Strategies for Bias Mitigation

Prompt engineering approaches can be categorized based on their mechanism and complexity:

#### 1. Cultural Prompting
**Fundamental Strategy**: Explicit instruction for the model to adopt a particular cultural persona, viewpoint, or set of norms before generating a response.

!!! tip "Enhancement Technique"
    **Anthropological Prompting**: Incorporating elements of anthropological reasoning into the prompt further improves cultural alignment.

#### 2. Affective Priming
**Purpose**: Setting emotional or relational tone within prompts to influence the model's affective output, ensuring responses adhere to cultural display rules or emotional norms.

#### 3. Self-Debiasing Techniques
**Mechanism**: Leverage the LLM's capacity for meta-cognition through methods such as:
- **Collective**: Group-based reasoning approaches
- **Critique**: Self-reflection on cultural appropriateness
- **Self-Voting**: Internal validation of cultural sensitivity

#### 4. Structured Multi-Step Pipelines

!!! success "Highest Effectiveness"
    These complex approaches achieve **up to 87.7% reduction in bias** through structured problem-solving with iterative steps forcing transparent, structured reasoning on sensitive topics.

**Components**:
- **Iterative Decomposition**: Breaking complex cultural questions into verifiable sub-statements
- **Factual Consistency Check**: Systematically evaluating reasoning steps against internal knowledge
- **Refinement and Synthesis**: Using verified steps to synthesize contextually appropriate responses

!!! warning "Risk Management"
    If early reasoning steps are flawed, this method can unintentionally amplify errors, leading to "hallucination snowballing". Chain-of-Thought (CoT) and self-correction techniques serve as primary defense mechanisms.

#### 5. Parameter-Optimized Continuous Prompts
**Advanced Technique**: Parameter-level prompts requiring specific optimization related to the model's embedding layer, offering persistent yet subtle control over model behavior.

### Developing Neutral and Inclusive Prompts

!!! tip "Design Guidelines"
    **Inclusive Language**: Use gender-neutral terms (e.g., "team member" instead of "salesman"), avoid unnecessary age references, incorporate diverse names and scenarios
    
    **Validation Integration**: Define specific requirements for language balance, avoiding regional slang, maintaining consistent formality levels

#### Cultural Bias Mitigation Strategies Comparison

| **Strategy Category** | **Mechanism** | **Technical Complexity** | **Effectiveness Scope** |
|----------------------|---------------|-------------------------|------------------------|
| **Modeling (Fine-Tuning)** | Instruction Tuning, SFT on Augmented Data | High (requires computational resources and model weights access) | Deep, permanent behavioral and knowledge adaptation |
| **Prompt Engineering (Cultural)** | Explicitly instructing cultural lens adoption | Low (accessible to end-users and developers) | Context-specific, dynamic mitigation (71–81% alignment improvement) |
| **Prompt Engineering (Structured)** | Decomposition, iterative verification, synthesis via multi-step CoT | Moderate-to-High (requires complex prompt design expertise) | Highest bias reduction effectiveness (up to 87.7%) |
| **Data Simulation** | Generating synthetic cross-cultural data using LLM agents | Moderate (requires framework implementation) | Scalable, high-fidelity data generation for low-resource cultures |

---

## 6. Evaluating Cultural Competence in Multilingual Systems

Evaluation is the final critical step, requiring a move away from measures of linguistic accuracy toward quantifying cultural appropriateness, behavioral faithfulness, and output diversity.

### The Need for Standardized Cultural Metrics

!!! failure "Current Deficit"
    The NLP community faces a significant deficit in standardized evaluation methods for cultural awareness, leading individual studies to select independent metrics.

**Traditional Metric Inadequacy**: BLEU and ROUGE focus on lexical overlap and linguistic structure, failing to capture:
- Cultural relevance
- Context-dependent appropriateness  
- Socio-pragmatic fidelity

!!! warning "Multimodal Complexity"
    In multimodal systems (VQA, Text-to-Image), metrics must also account for cultural relevance of visual properties, symbolic elements, and spatial relations.

### Advanced Evaluation Benchmarks and LLM-Based Metrics

Advanced evaluation strategies combine sociological frameworks with novel, automated metrics that better reflect complex human judgment.

#### Sociological Benchmarks
**Hofstede Frameworks**: Cultural Alignment Test (CAT) and VSM 13 framework provide quantifiable targets for measuring internalization of cultural values.

!!! success "Validation Success"
    Models trained using simulation techniques like CulturePark have demonstrated ability to surpass commercial models on these complex frameworks.

#### LLM-Based Evaluation (LAVE)
**Innovation**: Recognizing limitations of corpus-overlap metrics, researchers increasingly adopt LLM-based evaluation metrics like LAVE, which align more accurately with human reasoning when assessing culturally nuanced outputs.

#### Diversity Quantification
**Metric**: Quality-weighted Vendi Score (qVS) proposed for generative tasks to quantify overall cultural diversity in generated content, especially for multimodal contexts.

### Culturally Grounded Human Protocols

!!! info "The Emic vs. Etic Challenge"
    While quantitative metrics are essential, human judgment remains paramount for verifying cultural fidelity, requiring rigorous protocols managing inherent differences in cultural truth perspectives.

**Core Assessment Aspects**: Cultural relevance, faithfulness, and realism

**Perspective Management**:
- **Etic Perspective (External)**: Who defines initial input parameters and overall cultural frame (typically researcher/developer)
- **Emic Perspective (Internal)**: Who judges ultimate cultural fidelity of output—**must be the native cultural participant**

!!! note "Evaluation Priority"
    Comprehensive protocols must prioritize the Emic perspective through culturally grounded human feedback, expert review checklists, and statistical sampling of results.

#### Key Evaluation Criteria for Cultural Competence

| **Evaluation Focus** | **Goal** | **Measurement Tool/Methodology** | **Key Perspective** |
|---------------------|----------|-----------------------------------|-------------------|
| **Value Alignment** | Quantify internalized cultural values and biases | Hofstede's CAT, VSM 13 Framework | Etic/Diagnostic |
| **Pragmatic Accuracy** | Assess context-dependent appropriateness and fidelity | Culturally Grounded Human Protocols | Emic (Internal Cultural View) |
| **Cognitive Fidelity** | Measure reasoning alignment with expected human judgment | LLM-based Metrics (LAVE) | Automated Human-Aligned |
| **Diversity/Coverage** | Quantify breadth of cultural variation in generated content | Quality-weighted Vendi Score (qVS) | Etic/Statistical |

---

## 7. Conclusion

The integration of culture into multilingual NLP is a strategic imperative that moves beyond linguistic parity to demand behavioral and socio-pragmatic alignment. The current technological landscape is marked by inherent cultural bias rooted in training data that reinforces Western cognitive styles, risking homogenization and digital exclusion.

### Multi-Layered Mitigation Approach

Successfully addressing these risks requires adopting a comprehensive strategy:

!!! success "Strategic Framework"
    **Quantification**: Utilize sociological frameworks like Hofstede's dimensions to quantify cultural "genes" and measure fine-tuning impact
    
    **Scalable Data Generation**: Shift toward synthetic, high-fidelity data generation (CulturePark) to overcome cost and scale limitations
    
    **Targeted Adaptation**: Employ data-efficient techniques (CultureLLM, CultureSPA) to activate internal knowledge and inject specific cultural values
    
    **Dynamic Control**: Leverage prompt engineering, particularly Structured Multi-Step Pipelines, for transparent, culturally aware reasoning
    
    **Rigorous Evaluation**: Adopt advanced LLM-based evaluation (LAVE) and human protocols prioritizing the Emic perspective

### Future Direction

!!! quote "The Path Forward"
    The future success of global NLP deployment depends on integrating these prescriptive strategies to ensure that LLMs become equitable, inclusive tools that serve all communities, rather than amplifying existing global digital and cultural divides.

The goal is not just multilingual competence, but genuine multicultural intelligence that respects, understands, and appropriately responds to the rich diversity of human cultural expression worldwide.

---

## References

1. Survey of Cultural Awareness in Language Models: Text and Beyond - MIT Press Direct
2. Culturally Aware and Adapted NLP: A Taxonomy ... - ACL Anthology  
3. Tokenising culture: causes and consequences of cultural misalignment in large language models | Ada Lovelace Institute
4. CultureLLM: Incorporating Cultural Differences into Large Language Models
5. The Cultural Gene of Large Language Models: A Study on the Impact of Cross-Corpus Training on Model Values and Biases - ResearchGate
6. Ethical Considerations and Potential Risks in the Deployment of Large Language Models in Diverse Societal Contexts
7. The Homogenizing Effect of Large Language Models on Human Expression and Thought
8. Entangled in Representations: Mechanistic Investigation of Cultural Biases in Large Language Models
9. Bias in AI: Examples and 6 Ways to Fix it - Research AIMultiple
10. Western Bias in AI: Why Global Perspectives Are Missing - Unite.AI
11. Cultural Alignment in Large Language Models: An Explanatory Analysis Based on Hofstede's Cultural Dimensions - ACL Anthology
12. Self-Pluralising Culture Alignment for Large Language Models - ResearchGate
13. CulturePark: Boosting Cross-cultural Understanding in Large Language Models
14. Cultural Nuances in AI Data Annotation Explained
15. 10 Best Practices for Speech Data Annotation in African Languages
16. Multilingual Instruction Tuning With Just a Pinch of Multilinguality - Google Research
17. Global Gallery: The Fine Art of Painting Culture Portraits through Multilingual Instruction Tuning - ACL Anthology
18. CRAFT: Extracting and Tuning Cultural Instructions from the Wild - ResearchGate
19. CRAFT: Extracting and Tuning Cultural Instructions from the Wild - ACL Anthology
20. Self-Pluralising Culture Alignment for Large Language Models
21. Prompt Engineering Techniques for Mitigating Cultural Bias Against Arabs and Muslims in Large Language Models: A Systematic Review
22. From Illusion to Insight: A Taxonomic Survey of Hallucination Mitigation Techniques in LLMs
23. How to Reduce Bias in AI with Prompt Engineering - Ghost
24. LLM Evaluation Metrics: The Ultimate LLM Evaluation Guide - Confident AI
25. Evaluation of Cultural Competence of Vision-Language Models

<!-- Culturally Aware and Adapted NLP: A Taxonomy and a Survey of the State of the Art : https://aclanthology.org/2025.tacl-1.31.pdf 

Cultural Adaptation
"CultureLLM: Incorporating Cultural Differences into Large Language Models".

Cheng Li et al. NeurIPS 2024. [Paper] [Github]

"CulturePark: Boosting Cross-cultural Understanding in Large Language Models".

Cheng Li et al. NeurIPS 2024. [Paper][Github]

"Self-Pluralising Culture Alignment for Large Language Models".

Shaoyang Xu et al. arXiv 2024. [Paper] [Github]

"Global Gallery: The Fine Art of Painting Culture Portraits through Multilingual Instruction Tuning".

Anjishnu Mukherjee et al. NAACL 2024. [Paper] [Github]

"The Echoes of Multilinguality: Tracing Cultural Value Shifts during LM Fine-tuning".

Rochelle Choenni et al. ACL 2024. [Paper]

"CRAFT: Extracting and Tuning Cultural Instructions from the Wild".

Bin Wang et al. ACL 2024 Workshop - C3NLP. [Paper] [Github]


Socially Aware Language Technologies: Perspectives and Practices - https://aclanthology.org/2025.cl-2.10/

Survey of Cultural Awareness in Language Models: Text and Beyond  - https://direct.mit.edu/coli/article/51/3/907/130804/Survey-of-Cultural-Awareness-in-Language-Models -->