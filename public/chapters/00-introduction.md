# Getting started

!!! info "The Global Language Gap"
    The world speaks more than 7,000 languages, yet most large language models are trained on data that is almost entirely English. In many cases, more than 90% of the training corpus is English. This imbalance creates a massive gap that leaves billions of people at a disadvantage. 

    Models built on English heavy datasets struggle to understand or generate text in languages with limited digital presence. This affects accuracy, reliability, cultural fit, and safety. 

---

## The multilingual AI challenge

If you are building LLM powered applications for global audiences, you face a fundamental reality: the models you rely on are overwhelmingly optimized for English. GPT-3's training data is approximately 92.65% English, and Llama 2's data is nearly 90% English. Researchers call this imbalance the resourcedness gap, and it systematically disadvantages languages with low online representation.

!!! warning "The Real-World Impact"
    This gap appears in three critical ways:
    
    - **📉 Lower accuracy**. Non-English tasks often perform dramatically worse.
    - **🌍 Cultural Misalignment**. AI systems miss local context, tone, conventions, and norms. 
    - **⚠️ Safety Risks**: Filters that block harmful content in English fail in other languages, sometimes by a factor of three or more. 

For developers building chatbots, customer support systems, content moderation tools, or coding assistants, this creates difficult decisions. Should you translate everything into English? Prompt in the user's language? Fine-tune your own model? **The wrong choice can waste resources, create poor user experiences, or cause real harm.**

---

## Why you need a structured framework

Building multilingual applications is inherently challenging and can involve trial and error in development, potentially wasting time and introducing risks. Teams that are new to multilingual development may try different methods without fully understanding the consequences. The common pitfalls may include  


!!! success "The Vibhasha Solution"
    That is why this playbook exists. Vibhasha provides a research grounded decision making framework that helps you move from guesswork to clarity. It does not prescribe a single “best” approach. Instead, it helps you understand: 
    
    - ✅ When each strategy works best
    - ✅ What resources each strategy requires
    - ✅ What tradeoffs you accept with each choice 
    

### Common development pitfalls

!!! warning "Without a framework, multilingual development often leads to predictable problems: "
    
    **❌ Inconsistent results**  
    A technique that works for French may fail completely for Swahili or Tamil. 
    
    **💸 Hidden costs**  
    Translation pipelines that look simple at first can multiply API calls and latency. 
    
    **🎭 Cultural blindness**  
    Systems may “work” technically but produce awkward, confusing, or offensive outputs. 
    
    **🔓 Safety gaps**  
    A model may refuse harmful requests in English but comply when asked in another language. 
    
    **🔄 Wasted iterations**  
    Teams test options without clear success criteria or guidance on when to pivot. 

Vibhasha provides a principled decision-making framework grounded in empirical research and real-world deployments. Rather than offering one-size-fits-all solutions, this playbook helps you understand:  

---

## Three implementation strategies

Based on research conducted over 20 years at Microsoft Research India and the multilingual NLP research community, and production deployments, multilingual systems typically rely on one of three core strategies. Each offers a different way to bridge the gap between English optimized models and global users. 

!!! info "Strategy 1: 🌐 Translation-Based Approaches"
    
    **Leverage translation as a bridge to English-centric model capabilities**
    
    This strategy translates user inputs to English, processes them with a strong English model, then translates outputs back to the user’s language. 

    Modern versions use selective translation, where only certain parts of a prompt are translated. In many cases, selective translation outperforms full translation or direct prompting for under-resourced languages. 
    
    **Best for:** Quick prototyping and languages supported by high quality machine translation. 

    **How selective translation works:**

    - **Extractive tasks** (Q&A, NER): Keep the context in the source language and translate only the instructions.
    - **Generative tasks** (summarization): Generate the response in English, then translate it back.
    - **Direct inference**: In some cases, prompting directly in the source language yields better results.

    **Tradeoffs:**

    - Potential loss of cultural nuance
    - Compounding translation errors
    - Increased latency and cost from extra translation steps 
    
    [→ Learn more](/playbook/02-translation)

!!! info "Strategy 2: 💬 Off-the-Shelf Prompting"
    
    **Use pretrained multilingual models through strategic prompt engineering**
    
    This strategy uses multilingual models directly, relying on careful prompt engineering. Modern LLMs such as GPT-4, Claude, and open models like Llama offer built in multilingual capabilities. 

    This approach uses techniques such as few shot examples, cultural framing, persona prompts, and retrieval augmented generation (RAG). 

    **Advantages:**

    - Fastest to deploy with no training infrastructure
    - Quick iteration across languages and prompt styles
    - Strong potential for cultural adaptation through prompt design

    **Limitations:**

    - Performance declines significantly for under-resourced languages
    - Fragile prompts where small changes lead to inconsistent outputs
    - No persistent learning because each interaction starts fresh 
    
    **Best for:** Rapid prototyping and medium to high resource languages.
    
    [→ Learn more](/playbook/02-translation)

!!! info "Strategy 3: ⚙️ Fine-Tuning Specialized Models"
    
    **Adapt lightweight models on domain-specific, culturally relevant data**
    
    This strategy adapts lightweight open-source models using domain specific, culturally relevant, or language specific data. 

    Fine-tuning enables deep customization. The model can learn domain terminology, cultural norms, local idioms, and preferred communication styles. Techniques like LoRA make fine-tuning cost efficient by updating only a small percentage of the model’s parameters. 

    **Advantages:**

    - Maximum control and cultural fidelity
    - Ability to run in private or air-gapped environments
    - Long-term cost savings after the initial training investment

    **Tradeoffs:**

    - Requires high-quality training data
    - Requires infrastructure for training and evaluation
    - Smaller models may struggle with complex reasoning tasks 
    
    **Best for:** Domain specific applications, under-resourced languages, and environments with strict privacy or security needs.
    
    [→ Learn more](/playbook/04-fine-tuning)

---
<!-- 


[→ Master Fine-Tuning Strategies](/playbook/04-fine-tuning){ .md-button }
--- -->


## Cross-cutting concerns: evaluation and safety

!!! warning "Critical: These Apply to ALL Strategies"
    No matter which strategy you choose, evaluation and safety checks are essential. 

### 📊 Robust multilingual evaluation

English centric benchmarks are not reliable indicators of multilingual performance, and safety systems trained mostly on English create significant blind spots. Harmful content rates can be three times higher in under-resourced languages, and multilingual jailbreaking attacks succeed far more often than monolingual ones. 


**What You Must Do:**

- ✅ Test safety across all target languages (especially under-resourced)
- ✅ Use multilingual adversarial benchmarks
- ✅ Implement cross-lingual safety filters
- ✅ Monitor for cultural context-specific harms

[→ Comprehensive Safety Assessments](/playbook/05-safety){ .md-button }

---

### Addressing data scarcity: synthetic data generation

!!! info "The Under-Resourced Language Problem"
    Across all strategies, a recurring challenge is the **lack of high-quality data** for under-resourced languages. Synthetic data has become a practical solution. 

A typical approach includes:

- Translating established English datasets
- Using LLMs to generate multilingual examples
- Validating data with automated checks and human reviewers
- Adapting examples to reflect local culture and values 

Synthetic data does not replace real data, but it can meaningfully supplement it when created purposefully. 

<!-- **What Synthetic Data Enables:**

| Use Case | Description |
|----------|-------------|
| 🧪 **Evaluation Datasets** | Generate test cases for languages lacking benchmarks |
| 💡 **Few-Shot Examples** | Create in-context examples for prompt engineering |
| 📚 **Training Data** | Build instruction-following datasets for fine-tuning |
| 🌍 **Cultural Grounding** | Adapt examples to reflect local context and norms |

**Systematic Framework:**

1. **Generation Strategies** - Translate English datasets, use LLMs to generate multilingual content
2. **Quality Checks** - Automatic metrics + human-in-the-loop validation
3. **Cultural Adaptation** - Ensure examples reflect local values and context
4. **Downstream Evaluation** - Verify synthetic data actually improves model performance

!!! tip "Practical Application"
    Translate and culturally adapt English instruction-following datasets (e.g., Alpaca, Dolly) to create training data for underrepresented languages. -->

[→ Synthetic Data Generation Framework](/playbook/06-synthetic-data){ .md-button }

---

## How to navigate this playbook

!!! info "Choose Your Path"
    This playbook is designed to be read in whichever order fits your needs. 

### 🚀 If you are just getting started:

Use the [Interactive Flowchart](/playbook/flowchart) for a quick overview of recommended strategies.

### ⚡ If you need quick results:

<!-- - [Translation](/playbook/02-translation) for leveraging existing MT services
- [Off-the-Shelf Prompting](/playbook/02-translation) for rapid prototyping -->

[Translation](/playbook/02-translation) and [Off-the-Shelf Prompting](/playbook/02-translation) offer the fastest path to a working prototype.


### 🏭 If you are building for production:

Start with [Evaluation](/playbook/01-evaluation) and [Safety](/playbook/05-safety), then choose an approach that balances your goals with available resources.

### 🎯 Have specialized needs?


[Fine-Tuning](/playbook/04-fine-tuning) and [Synthetic Data](/playbook/06-synthetic-data) provide the strongest performance for culturally specific or domain heavy applications.


Each chapter stands alone but connects to others where concepts overlap. The guidance combines research insights and lessons from real world deployments, supported by decision matrices and concrete, step-by-step instructions. 