## 5.4 Safety toolkits and frameworks for multilingual applications

As an application builder, moving from abstract safety policies to concrete, verifiable deployment requires specialized toolkits. For multilingual LLMs, this necessitates tools that can simulate sophisticated cross-lingual attacks and integrate continuous monitoring into your MLOps pipeline, extending beyond simple commercial APIs.

!!! info "Essential Toolkits Overview"
    The following toolkits, frameworks, and research repositories provide the essential technical capabilities for systematic multilingual LLM safety assessment and alignment.

### 5.4.1 Automated red teaming (ART) frameworks

Automated Red Teaming (ART) frameworks are crucial for scaling vulnerability detection across numerous languages and conversational scenarios, which human red teaming cannot feasibly cover. They simulate adversarial attacks, allowing you to test your LLM's guardrails under pressure.

#### Core ART framework comparison

| **Toolkit/Framework** | **Primary Use Case** | **Multilingual Capabilities & Focus** | **Key Attack Methodology** |
|-------------------|------------------|-----------------------------------|------------------------|
| **garak** | Comprehensive LLM vulnerability scanner and baseline probing | Designed to discover general weaknesses and unwanted behaviors across models. Utilizes the `art` module, including plugins like `art.Tox`, to provoke specific failure modes via iterative conversation with the target LLM | Responsive Auto-Prompt, Conversational Probes (fixed turns) for toxicity |
| **DeepTeam** (via deepeval) | End-to-end automated red teaming workflow and metric-driven evaluation | Automates the entire red teaming workflow for safety risks and security vulnerabilities (bias, toxicity, PII leakage, misinformation) for various LLM applications. Provides a structured, metric-driven evaluation of defense efficacy | Adversarial Attack Generation (Prompt Injection, Jailbreaking) |
| **MM-ART** (Methodology/Codebase) | Advanced Multi-turn, Multi-lingual Red Teaming | This methodology and its associated code are vital for replicating the most dangerous multilingual vulnerabilities. It focuses on conversational (multi-turn) and multilingual operations, confirming that non-English, multi-turn attacks show up to 195% more safety vulnerabilities than standard single-turn English testing | Multi-lingual Multi-turn Conversational Attacks (e.g., 5-turn sequences) |

!!! warning "MM-ART Implementation Critical Note"
    The severity of multi-turn attacks in non-English languages (up to **195% increase in failure rate**) mandates that application builders configure their ART pipelines to prioritize conversational depth (e.g., 5-turn sequences) in low-resource language testing. Research-associated repositories often include tools like `jailbreak.py` for inference and utilities for translating datasets using tools like NLLB (No Language Left Behind).

### 5.4.2 Safety alignment and defense toolkits

Once vulnerabilities are identified by ART, these frameworks and patterns provide the means to create defensive countermeasures and improve model alignment.

#### Defense framework comparison

| **Framework/Pattern** | **Alignment Function** | **Multilingual Utility** | **Technical Principle** |
|-------------------|-------------------|---------------------|---------------------|
| **Self-Defense Framework** | Generates adversarial training data for safety fine-tuning | Automatically generates multilingual training data from real-world failures identified during the ART loop. Fine-tuning with this data achieves a substantial reduction in unsafe content generation across languages | Uses the model's own failure modes (detected jailbreaks) to generate high-quality, targeted negative preference data for alignment |
| **SelfDefend** (Architectural Pattern) | Runtime jailbreak defense and performance optimization | Generic defense framework that protects against indirect and multilingual jailbreaks while aiming to incur negligible latency delays | Establishes a **Shadow LLM** (a defense instance in detection state) that concurrently monitors and collaborates with the **Target LLM** (in the answering state) using checkpoint-based access control |
| **Adaptive Multi-Stage Reasoning** | Runtime layered, training-free defense mechanism | Validated defense pattern against jailbreaks that simulates human reasoning logic during inference. Critical for handling novel or complex multilingual threats | Sequential logic involving three stages: 1) **Intention Inference** (identifying obvious risks); 2) **Self-Introspection** (evaluating its own response against policy); and 3) **Self-Revision** (rewriting uncertain responses to maintain intent while mitigating risk) |



<!-- Multilingual Alignment Evaluation
Multilingual Ethics Evaluation
"Ethical Reasoning and Moral Value Alignment of LLMs Depend on the Language we Prompt them in".

Utkarsh Agarwal, Kumar Tanmay, and Aditi Khandelwal et al. LREC-COLING 2024. [Paper]

Multilingual Toxicity Evaluation
"RTP-LX: Can LLMs Evaluate Toxicity in Multilingual Scenarios?".

Adrian de Wynter et al. arXiv 2024. [Paper] [GitHub]

"PolygloToxicityPrompts: Multilingual Evaluation of Neural Toxic Degeneration in Large Language Models".

Devansh Jain and Priyanshu Kumar et al. COLM 2024. [Paper] [GitHub]

Multilingual Bias Evaluation
"On Evaluating and Mitigating Gender Biases in Multilingual Settings".

Aniket Vashishtha and Kabir Ahuja et al. ACL (Findings) 2021. [Paper] [GitHub]

Multilingual Safety Evaluation
Multilingual Safety Benchmarks
"All Languages Matter: On the Multilingual Safety of LLMs".

Wenxuan Wang et al. ACL (Findings) 2024. [Paper] [GitHub]

Multilingual Jailbreaking/Red-Teaming
"Low-Resource Languages Jailbreak GPT-4".

Zheng-Xin Yong et al. NeurIPS (Workshop) 2023. [Paper]

"Multilingual Jailbreak Challenges in Large Language Models".

Yue Deng et al. ICLR 2024. [Paper] [GitHub]

"A Cross-Language Investigation into Jailbreak Attacks in Large Language Models".

Jie Li et al. arXiv 2024. [Paper] 

"The Language Barrier: Dissecting Safety Challenges of LLMs in Multilingual Contexts".

Lingfeng Shen et al. ACL Findings 2024. [Paper] [Github]

SHADES: Towards a Multilingual Assessment of Stereotypes in Large Language Models - https://aclanthology.org/2025.naacl-long.600/

Towards Understanding the Fragility of Multilingual LLMs against Fine-Tuning Attacks - https://aclanthology.org/2025.findings-naacl.126/

Multilingual Blending: Large Language Model Safety Alignment Evaluation with Language Mixture - https://aclanthology.org/2025.findings-naacl.191/

The Multilingual Divide and Its Impact on Global AI Safety - https://arxiv.org/pdf/2505.21344


-->

