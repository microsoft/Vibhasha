# Safety Assessments for Multilingual Large Language Model Applications

## Overview

Ensuring safety in multilingual LLM applications is a multifaceted challenge that requires comprehensive assessment protocols addressing linguistic and cultural variability. Many safety mechanisms and alignment efforts have been English-centric, leaving dangerous blind spots for other languages.

!!! danger "Critical Safety Gap"
    Safety mechanisms developed in English often **fail catastrophically** in non-English environments. **GPT-4's rate of harmful content was roughly 3× higher** in certain low-resource languages than in high-resource ones. This is not gradual degradation but a fundamental structural vulnerability.

## 1. Foundational Concepts: The Multilingual Threat Landscape

### 1.1. Taxonomy of LLM Harms and Cross-Cultural Sensitivity

LLM failure modes can be categorized into two broad areas with distinct manifestations in multilingual contexts:

#### Content Harms
- **Toxicity**: Generation of offensive or harmful content including culturally-specific slurs
- **Bias**: Unfair treatment or representation of groups, often missed in under-studied languages  
- **False Information**: Factually incorrect content, exacerbated in low-resource languages
- **Hallucinations**: Models "guessing" answers when they lack knowledge in certain languages

#### Behavioral Harms
- **Jailbreaking**: Bypassing safety mechanisms through multilingual prompt crafting
- **Prompt Injection**: Manipulation through crafted inputs across language boundaries
- **PII Leakage**: Revealing sensitive data memorized from non-English training text
- **Cross-lingual Inconsistencies**: Different safety responses across languages

!!! info "Global vs. Local Harm"
    A critical distinction in multilingual safety assessment:
    
    - **Global Harm**: Content universally recognized as unsafe (e.g., explicit violence)
    - **Local Harm**: Context-specific content dependent on cultural norms and sociolinguistic context

### 1.2. The Low-Resource Vulnerability Gap: Empirical Evidence

Safety alignment mechanisms like **RLHF** and preference tuning are primarily trained on high-resource English data. When deployed globally, generalization to linguistically distinct, low-density data spaces is often incomplete.

!!! warning "The 3× Risk Multiplier"
    **Low-resource languages exhibit approximately 3× the likelihood of encountering harmful content** compared to high-resource languages across models like ChatGPT and GPT-4.

#### Key Empirical Findings:
- **Unintentional bypass**: Users querying in low-resource languages are ~3× more likely to receive policy violations
- **Intentional attacks**: Multilingual jailbreaking achieves 80.92% success rate on ChatGPT, 40.71% on GPT-4
- **Cultural context matters**: Terms like "banana" can be derogatory slurs in some Asian contexts while harmless elsewhere

### 1.3. Multilingual Safety Challenges

#### Cultural and Linguistic Variability
Languages differ in slang, taboos, and cultural context. An innocuous phrase in one language might be deeply offensive in another. Simply translating English safety filters is insufficient.

#### Coverage Gaps
Even high-resource languages beyond English (Arabic, Hindi, etc.) have been understudied in LLM safety research, resulting in weaker guardrails for non-English inputs.

#### Cross-lingual Evasion Techniques
- **Language switching**: Models may refuse requests in English but comply in other languages
- **Code-switching**: Mixing languages or scripts confuses safety systems
- **Unicode evasion**: Using non-English characters to bypass content filters

## 2. Multilingual Vulnerability Analysis: Adversarial and Factuality Failure Modes
Rigorous safety assessment requires an understanding of how linguistic diversity serves as a vector for exploiting known LLM vulnerabilities, specifically through adversarial manipulation and the introduction of factual instability.

### 2.1. Advanced Adversarial Attacks in Polyglot Systems
Adversarial attacks in multilingual environments can be differentiated based on user intent. The unintentional scenario involves non-malicious users inadvertently bypassing guardrails simply by querying in non-English languages. The intentional scenario involves malicious users who deliberately combine explicit malicious instructions with multilingual prompts to craft effective attack payloads.   

The convergence of malicious intent and multilingual context significantly amplifies the negative impact. Intentional multilingual prompts function not merely as a translated attack but as an obfuscation and destabilization vector. The extreme attack success rates (ASR) observed in these scenarios confirm that multilingual phrasing bypasses safety mechanisms reliant on surface-level keyword detection or simple sentiment analysis trained in English, targeting the failure of the model’s internal safety representation space. Experimental data revealed astonishingly high rates of unsafe output: 80.92% ASR for ChatGPT and 40.71% ASR for GPT-4 when targeted with intentional multilingual jailbreaking attacks. This evidence mandates that assessment processes must explicitly test prompts that are linguistically complex or contextually ambiguous across language boundaries.   

Automated methods for generating these high-efficacy harmful inputs often leverage specialized machine learning frameworks. For instance, Reinforcement Learning with Adversarial Feedback (RLAF) is a framework designed for reward-driven refinement to elicit toxic responses from target LLMs. Additionally, techniques such as translation averaging and subject-predicate permutations are employed to create robust, cross-lingual adversarial payloads that ensure persistence across linguistic variants.   

#### Empirical Attack Success Rates

| Model | Scenario | Language Resource Level | Example ASR (%) | Key Implication for Assessment |
|-------|----------|------------------------|-----------------|------------------------------|
| ChatGPT/GPT-4 | Unintentional Prompt Bypass | Low-Resource Languages | ∼3× higher vs. High-Resource | Need to prioritize LRL probing in initial safety scans |
| ChatGPT | Intentional Jailbreaking | Multilingual Prompt Payload | 80.92 | Standard single-turn filtering is grossly insufficient |
| GPT-4 | Intentional Jailbreaking | Multilingual Prompt Payload | 40.71 | State-of-the-art closed models require specialized defenses |


### 2.2. Multilingual Hallucination and Factuality Gaps

Hallucination, the generation of factually unsupported or incorrect information, is fundamentally intertwined with safety, especially in low-resource environments. Research indicates that models struggle with hallucinations primarily in low-resource directions and, critically, when translating out of English.

!!! warning "Multilingual Hallucination Gap"
    In these scenarios, the resulting hallucinated translations may introduce **toxic patterns traceable back to low-quality or unfiltered segments** of the training data.

This phenomenon creates a measurable **Multilingual Hallucination Gap**, reflecting differences in the frequency of hallucinated answers depending on the prompt and language used. Experiments conducted on various LLM families (LLaMA, Qwen, Aya) generating content in up to 19 languages demonstrate significant variations in hallucination rates, particularly pronounced between high- and low-resource languages.

For an LLM application developer, this means **factuality testing in low-resource languages becomes an indirect safety assessment**, as factually inaccurate output can simultaneously introduce harmful bias or toxicity derived from training data remnants.

#### Evaluation Metrics and Mitigation

To address this challenge, specialized evaluation metrics are required:

**mFACT** - A multilingual factuality metric designed to evaluate hallucinations beyond English:

- Achieves cross-lingual assessment by translating supervision signals from existing English factuality metrics
- Can be incorporated into training loops via loss-weighted training
- Reduces hallucinations and improves summary quality across multiple languages

**Cross-lingual Chain-of-Thought (COT)**: Leverages reasoning performed in high-resource languages to improve factual consistency and reliability in low-resource language outputs.

## 3. Multilingual Safety Evaluation: Benchmarks and Datasets

Rigorously assessing multilingual safety requires standardized benchmarks built on authentic, localized content. Several key datasets have emerged to quantify multilingual safety vulnerabilities:

### 3.1. Key Multilingual Safety Datasets

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

### 3.2. Data Collection Methodology

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


## 4. Automated Red Teaming and Assessment Frameworks

Human red teaming, while valuable for intelligence gathering and creative attack generation, is expensive and does not scale sufficiently to cover the vast linguistic and conversational state space of a global LLM application. High-throughput, automated red teaming (ART) frameworks are therefore mandatory for comprehensive safety validation.

!!! info "Why Automated Red Teaming?"
    **Scale**: Testing across dozens of languages and thousands of attack vectors
    **Consistency**: Reproducible, systematic vulnerability assessment
    **Coverage**: Multi-turn conversational attacks that human testing often misses
    **Cost-Effectiveness**: Continuous monitoring without prohibitive manual effort

### 4.1. Architecture and Requirements for Automated Red Teaming
The ART process is modeled as an adversarial loop comprising three core components: the Generator, the Target, and the Detector (or JUDGE). The adversarial Generator attempts to generate prompts (P) that, when processed by the Target LLM, result in a response (R) fulfilling a predefined harmful goal (G).   

The efficacy of the ART system relies on the JUDGE Classifier, formally defined as JUDGE:T 
⋆
 ×T 
⋆
 →{True,False}, which returns True if and only if the response R meets the criteria of the harmful goal G given the input and goal. The adversary’s objective, and thus the ART framework’s goal, is to maximize the probability that the Target LLM generates responses classified as successful jailbreaks. Given the common deployment constraint, ART frameworks typically assume a black-box threat model, requiring only prompt input and output observation without access to internal model parameters. The validity of the entire ART output rests on the JUDGE's accuracy, necessitating that it be continuously validated and retrained using human-annotated, transcreated data to detect nuanced Local Harm.   

### 4.2. Tooling and Experimental Setup Configurations
Deployment of ART requires selecting and configuring frameworks based on the desired level of depth and coverage:

Using garak for Baseline Probing: garak is an open-source LLM vulnerability scanner designed to discover weaknesses and unwanted behaviors. For automated red teaming, the art module is utilized, which includes plugins like art.Tox aimed at provoking toxic output. The core workflow involves loading a "red-teaming model" (the Generator) to conduct a fixed-turn "conversation" with the target LLM. The red-team model is prompted iteratively with the generator's previous output, attempting to provoke a specific failure mode. garak is best suited for initial, wide-ranging baseline scans across multiple failure categories.   

DeepTeam for Comprehensive Workflow Integration: DeepTeam, powered by the deepeval evaluation framework, is an open-source framework dedicated to automating the entire red teaming workflow. It works by generating adversarial attacks (e.g., prompt injection, jailbreaking) and then evaluating the Target LLM's outputs using specialized red teaming metrics. DeepTeam covers essential vulnerabilities like bias, toxicity, PII leakage, and misinformation , providing a structured, metric-driven result set.   

Deploying Multi-lingual Multi-turn ART (MM-ART): The most critical finding in adversarial research is that static, single-prompt jailbreaking significantly undercounts vulnerability . The automated conversational approach is mandatory for thorough assessment. Multi-lingual Multi-turn Automated Red Teaming (MM-ART) is a specialized methodology designed to fully automate conversational, multi-lingual operations. Experimental replication of MM-ART highlights extreme vulnerabilities: models are 71% more vulnerable after a 5-turn conversation in English than after the initial turn. Crucially, in non-English conversations, models display up to 195% more safety vulnerabilities compared to the standard single-turn English approach. ared to the standard single-turn English approach. Assessment pipelines must therefore be configured to prioritize MM-ART-style conversational probes (e.g., 5-turn sequences) translated across resource levels, as deployment decisions should fundamentally hinge on the low-resource, multi-turn Attack Success Rate (ASR).

!!! warning "MM-ART Implementation Critical Note"
    The severity of multi-turn attacks in non-English languages (up to **195% increase in failure rate**) mandates that application builders configure their ART pipelines to prioritize conversational depth (e.g., 5-turn sequences) in low-resource language testing. Research-associated repositories often include tools like `jailbreak.py` for inference and utilities for translating datasets using tools like NLLB (No Language Left Behind).

#### Comparative Analysis of Automated Red Teaming Frameworks

| Framework | Core Function | Multilingual Support Focus | Key Attack Methodology | Utility vs. Depth |
|-----------|---------------|----------------------------|------------------------|-------------------|
| **garak** | LLM Vulnerability Scanner | General Probing, modular | Direct Probes, Automated Conversation (`art.Tox`) | High utility for baseline scanning; depth depends on probe selection |
| **DeepTeam** | End-to-End Red Teaming Workflow | Focus on standard LLM risks (Toxicity, PII) | Adversarial Attack Generation (Prompt Injection, Jailbreaking) | Comprehensive workflow integration; metric-driven results |
| **MM-ART** | Multi-lingual Multi-turn ART | Explicitly targets cross-lingual conversational risk | Multi-turn Conversational Attacks (e.g., 5-turn sequences) | Highest depth for identifying conversational, cross-lingual vulnerabilities |

!!! tip "Framework Selection Guide"
    - **garak**: Best for initial baseline vulnerability scanning across multiple categories
    - **DeepTeam**: Ideal for comprehensive workflow integration with metric-driven results  
    - **MM-ART**: Essential for deep conversational and cross-lingual vulnerability detection

### 4.3. Assessment Metrics: Balancing Safety and Utility

Safety assessment requires a dual-metric approach to ensure robustness without compromising usability.

#### Key Metrics Definitions

=== "Attack Success Rate (ASR)"
    **Definition**: Traditional adversary's metric quantifying successful attempts to bypass guardrails and generate harmful content
    
    **Objective**: Minimizing ASR is the primary safety goal
    
    **Measurement**: Percentage of malicious prompts that successfully elicit harmful responses

=== "Over-Refusal Rate"
    **Definition**: Critical counter-metric measuring inappropriate rejection of benign, non-harmful prompts
    
    **Impact**: High over-refusal severely compromises system utility, leading to poor user experience and potential distrust
    
    **Risk**: Some defense approaches yield alarmingly high over-refusal rates, sometimes reaching 100%

#### Safety-Utility Trade-off Framework

!!! important "Balanced Assessment Requirement"
    Assessments must quantify the **Safety-Utility trade-off** using a comprehensive evaluation framework analogous to comparing binary classifiers.

**Implementation Approach**:

- **Plot ASR reduction** against acceptable utility degradation (Over-Refusal)
- **Define operational safety envelope** for your specific application context
- **Enable ML engineers** to measure and optimize the system's safety-utility balance
- **Establish thresholds** for acceptable risk vs. usability in production environments

**Practical Guidelines**:

- Monitor both metrics continuously in production
- Set application-specific thresholds based on use case criticality
- Implement A/B testing to optimize the safety-utility balance
- Regular reassessment as threat landscape evolves

#### Comparative Analysis of Automated Red Teaming Frameworks

| Framework | Core Function | Multilingual Support Focus | Key Attack Methodology | Utility vs. Depth |
|-----------|---------------|----------------------------|------------------------|-------------------|
| **garak** | LLM Vulnerability Scanner | General Probing, modular | Direct Probes, Automated Conversation (`art.Tox`) | High utility for baseline scanning; depth depends on probe selection |
| **DeepTeam** | End-to-End Red Teaming Workflow | Focus on standard LLM risks (Toxicity, PII) | Adversarial Attack Generation (Prompt Injection, Jailbreaking) | Comprehensive workflow integration; metric-driven results |
| **MM-ART** | Multi-lingual Multi-turn ART | Explicitly targets cross-lingual conversational risk | Multi-turn Conversational Attacks (e.g., 5-turn sequences) | Highest depth for identifying conversational, cross-lingual vulnerabilities |

!!! tip "Framework Selection Guide"
    - **garak**: Best for initial baseline vulnerability scanning across multiple categories
    - **DeepTeam**: Ideal for comprehensive workflow integration with metric-driven results  
    - **MM-ART**: Essential for deep conversational and cross-lingual vulnerability detection

### 4.3. Assessment Metrics: ASR vs. Over-Refusal

Safety assessment requires a dual-metric approach to ensure robustness without compromising usability.

#### Key Metrics Definitions

=== "Attack Success Rate (ASR)"
    **Definition**: Traditional adversary's metric quantifying successful attempts to bypass guardrails and generate harmful content
    
    **Objective**: Minimizing ASR is the primary safety goal
    
    **Measurement**: Percentage of malicious prompts that successfully elicit harmful responses

=== "Over-Refusal Rate"
    **Definition**: Critical counter-metric measuring inappropriate rejection of benign, non-harmful prompts
    
    **Impact**: High over-refusal severely compromises system utility, leading to poor user experience and potential distrust
    
    **Risk**: Some defense approaches yield alarmingly high over-refusal rates, sometimes reaching 100%

#### Safety-Utility Trade-off Framework

!!! important "Balanced Assessment Requirement"
    Assessments must quantify the **Safety-Utility trade-off** using a comprehensive evaluation framework analogous to comparing binary classifiers.

**Implementation Approach**:

- **Plot ASR reduction** against acceptable utility degradation (Over-Refusal)
- **Define operational safety envelope** for your specific application context
- **Enable ML engineers** to measure and optimize the system's safety-utility balance
- **Establish thresholds** for acceptable risk vs. usability in production environments

**Practical Guidelines**:

- Monitor both metrics continuously in production
- Set application-specific thresholds based on use case criticality
- Implement A/B testing to optimize the safety-utility balance
- Regular reassessment as threat landscape evolves   

Table: Comparative Analysis of Automated Red Teaming Frameworks

Framework	Core Function	Multilingual Support Focus	Key Attack Methodology	Utility vs. Depth
garak	LLM Vulnerability Scanner	
General Probing, modular    

Direct Probes, Automated Conversation (art.Tox)    

High utility for baseline scanning; depth depends on probe selection.
DeepTeam	End-to-End Red Teaming Workflow	
Focus on standard LLM risks (Toxicity, PII)    

Adversarial Attack Generation (Prompt Injection, Jailbreaking)    

Comprehensive workflow integration; metric-driven results.
MM-ART	Multi-lingual Multi-turn ART	
Explicitly targets cross-lingual conversational risk    

Multi-turn Conversational Attacks (e.g., 5-turn sequences)    

Highest depth for identifying conversational, cross-lingual vulnerabilities.


### 4.3. Assessment Metrics: ASR vs. Over-Refusal
Safety assessment requires a dual-metric approach to ensure robustness without compromising usability.

Attack Success Rate (ASR): This is the traditional adversary's metric, quantifying successful attempts to bypass guardrails and generate harmful content . Minimizing ASR is the primary safety goal.

Over-Refusal: This critical counter-metric measures the inappropriate rejection of benign, non-harmful prompts . High over-refusal severely compromises system utility, leading to poor user experience and potential distrust.

Assessments must quantify the Safety-Utility trade-off. Current defense approaches have been observed to yield alarmingly high over-refusal rates, sometimes reaching 100% . To provide a practical definition of "safety alignment" for a given application, assessment results must utilize a comprehensive evaluation framework analogous to comparing binary classifiers. This involves plotting ASR reduction against acceptable utility degradation (Over-Refusal) , allowing ML engineers to define and measure the system's operational safety envelope.






## 7. Safety Toolkits and Frameworks for Multilingual Applications

As an application builder, moving from abstract safety policies to concrete, verifiable deployment requires specialized toolkits. For multilingual LLMs, this necessitates tools that can simulate sophisticated cross-lingual attacks and integrate continuous monitoring into your MLOps pipeline, extending beyond simple commercial APIs.

!!! info "Essential Toolkits Overview"
    The following toolkits, frameworks, and research repositories provide the essential technical capabilities for systematic multilingual LLM safety assessment and alignment.

### 7.1. Automated Red Teaming (ART) Frameworks

Automated Red Teaming (ART) frameworks are crucial for scaling vulnerability detection across numerous languages and conversational scenarios, which human red teaming cannot feasibly cover. They simulate adversarial attacks, allowing you to test your LLM's guardrails under pressure.

#### Core ART Framework Comparison

| Toolkit/Framework | Primary Use Case | Multilingual Capabilities & Focus | Key Attack Methodology |
|-------------------|------------------|-----------------------------------|------------------------|
| **garak** | Comprehensive LLM vulnerability scanner and baseline probing | Designed to discover general weaknesses and unwanted behaviors across models. Utilizes the `art` module, including plugins like `art.Tox`, to provoke specific failure modes via iterative conversation with the target LLM | Responsive Auto-Prompt, Conversational Probes (fixed turns) for toxicity |
| **DeepTeam** (via deepeval) | End-to-end automated red teaming workflow and metric-driven evaluation | Automates the entire red teaming workflow for safety risks and security vulnerabilities (bias, toxicity, PII leakage, misinformation) for various LLM applications. Provides a structured, metric-driven evaluation of defense efficacy | Adversarial Attack Generation (Prompt Injection, Jailbreaking) |
| **MM-ART** (Methodology/Codebase) | Advanced Multi-turn, Multi-lingual Red Teaming | This methodology and its associated code are vital for replicating the most dangerous multilingual vulnerabilities. It focuses on conversational (multi-turn) and multilingual operations, confirming that non-English, multi-turn attacks show up to 195% more safety vulnerabilities than standard single-turn English testing | Multi-lingual Multi-turn Conversational Attacks (e.g., 5-turn sequences) |

!!! warning "MM-ART Implementation Critical Note"
    The severity of multi-turn attacks in non-English languages (up to **195% increase in failure rate**) mandates that application builders configure their ART pipelines to prioritize conversational depth (e.g., 5-turn sequences) in low-resource language testing. Research-associated repositories often include tools like `jailbreak.py` for inference and utilities for translating datasets using tools like NLLB (No Language Left Behind).

### 7.2. Safety Alignment and Defense Toolkits

Once vulnerabilities are identified by ART, these frameworks and patterns provide the means to create defensive countermeasures and improve model alignment.

#### Defense Framework Comparison

| Framework/Pattern | Alignment Function | Multilingual Utility | Technical Principle |
|-------------------|-------------------|---------------------|---------------------|
| **Self-Defense Framework** | Generates adversarial training data for safety fine-tuning | Automatically generates multilingual training data from real-world failures identified during the ART loop. Fine-tuning with this data achieves a substantial reduction in unsafe content generation across languages | Uses the model's own failure modes (detected jailbreaks) to generate high-quality, targeted negative preference data for alignment |
| **SelfDefend** (Architectural Pattern) | Runtime jailbreak defense and performance optimization | Generic defense framework that protects against indirect and multilingual jailbreaks while aiming to incur negligible latency delays | Establishes a **Shadow LLM** (a defense instance in detection state) that concurrently monitors and collaborates with the **Target LLM** (in the answering state) using checkpoint-based access control |
| **Adaptive Multi-Stage Reasoning** | Runtime layered, training-free defense mechanism | Validated defense pattern against jailbreaks that simulates human reasoning logic during inference. Critical for handling novel or complex multilingual threats | Sequential logic involving three stages: 1) **Intention Inference** (identifying obvious risks); 2) **Self-Introspection** (evaluating its own response against policy); and 3) **Self-Revision** (rewriting uncertain responses to maintain intent while mitigating risk) |



