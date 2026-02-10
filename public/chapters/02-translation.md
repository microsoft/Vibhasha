# Translation Strategies & Prompting for Multilingual LLM
Many modern LLMs are trained on multilingual data and are thus capable of understanding and generating text in multiple languages. When building multilingual applications, there are two major approaches to leveraging these capabilities:

1. **Using the LLM directly in the target language** — relying on the model's native multilingual abilities to process and respond in the user's language without any intermediate step.
2. **Using translation as a bridge** — translating user input into a high-resource language (typically English), processing it there, and translating the output back.

The right choice depends on the model's proficiency in the target language, the complexity of the task, and the acceptable trade-offs in latency, cost, and cultural fidelity. This chapter focuses on when and how to use translation effectively, and when direct multilingual use may be sufficient.
Most LLMs perform strongest in English because English dominates their training data. That imbalance leads to the “language gap,” where models succeed in English but struggle as language resources decrease. Translation can help bridge that gap, especially when the target language has limited digital presence. 

!!! quote "The Translation Dilemma"
    Translation is a powerful tool, but it is not always the best choice. It introduces tradeoffs that developers must understand. This section outlines how translation can be used effectively and when it may be unnecessary. 

---

## The English-Centric Reality of LLMs

Even the most advanced multilingual models draw much of their strength from English. For example:  
    - **GPT-3**: ~92.65% English tokens in training corpus
    - **Llama 2**: ~89.70% English tokens in pretraining data
    
When a model’s pretraining corpus is overwhelmingly English, its reasoning abilities, safety filters, and general knowledge are strongest in English. That imbalance affects how reliably it performs across other languages, especially lowresource ones. 

The result is a resourcedness gap: high-resource languages like French, German, or Spanish are handled reasonably well, while languages with limited online presence or complex morphology see a steep drop in performance. 

This gap shows up clearly in production systems. Tasks that require precision, cultural knowledge, or safety awareness often fail more frequently in nonEnglish languages. Without careful design, this leads to inconsistent user experiences across regions. 


### Translation as a Bridge Strategy

Translation offers a practical way to access the model’s strongest reasoning abilities without abandoning multilingual users. When you translate nonEnglish text into English, the model can operate in the language where it performs best. 

!!! warning "The Trade-offs"
    However, translation is not a universal solution. It introduces risks such as: 
    
    - Loss of nuance 
    - Cultural distortion 
    - Compounding translation errors 
    - Higher latency 
    - Higher API costs 
    
    Used well, translation can dramatically improve quality on lowresource languages. Used poorly, it can reduce clarity, flatten tone, or introduce unintended meaning. 




### Translation-Based Approaches

There are two primary ways to incorporate translation into a multilingual workflow: **Full translation** vs. **Selective translation**.

#### Full Translation

Translate the entire user input into English, process it with an English-optimized model, and translate the output back.

!!! success "Strengths"
    - Simple to implement
    - Works well for languages with strong machine-translation support
    - Useful for early prototypes

!!! failure "Weaknesses"
    - Risk of losing cultural or contextual meaning
    - Errors can accumulate across multiple translation steps
    - Not ideal for tasks that depend on tone, style, or domain nuance

Full translation is a good starting point, but it rarely offers the best long-term results.

#### Selective Translation

Selective translation is more flexible. Instead of translating everything, translate only the parts that benefit most from English reasoning.

A prompt is structured around four components:

1. **Instruction**
2. **Context**
3. **Examples**
4. **Output format**

Selective translation means choosing which of these components to translate into English and which to keep in the original language.

!!! info "Performance"
    This method has been shown to outperform full translation by **100–200%** in some low-resource language scenarios.

**Why it works:**

- It preserves meaning by keeping the source-language context intact
- It limits the number of translation steps
- It allows the model to reason in English while respecting the user's language
- It reduces cultural distortion
- It balances clarity and performance

Selective translation provides structure without stripping away linguistic or cultural richness.

#### How to Choose the Right Pattern

The best translation pattern depends on the task. Below are the recommended patterns for the most common multilingual tasks.

##### Extractive Tasks

Examples include question answering and named entity recognition.

**Recommended pattern:**

- Keep the context in the source language
- Keep examples in the source language
- Translate the instruction into English
- Produce the output in the source language

!!! tip "Why it works"
    The model reasons about instructions in English, where its instruction-following skills are strongest, while avoiding distortion from translating user content.

##### Generative Tasks

Examples include summarization, rewriting, or content generation.

**Recommended pattern:**

- Translate the instruction into English
- Translate the context into English (depending on model strength and translation quality)
- Keep examples in the source language when tone or cultural style matters
- Generate the output in English and translate it back

!!! tip "Why it works"
    Generative tasks rely heavily on reasoning, coherence, and longer-form planning. Models typically perform that work more effectively in English.

#### When Translation Helps vs. Hurts

Below is a quick guide for deciding whether to translate or prompt natively.

=== "Use Direct Prompting"
    - The target language is medium- or high-resource
    - Tone, style, or cultural nuance is critical
    - Machine-translation quality is unreliable
    - You need fast, low-latency responses

=== "Use Full Translation"
    - You are building a quick proof of concept
    - The target language has strong machine-translation support
    - The task does not depend heavily on nuance

=== "Use Selective Translation"
    - The language is low-resource
    - The task requires accuracy and nuance
    - You need to balance performance, cost, and cultural fidelity
    - The user content cannot risk distortion through translation

Selective translation is often the best choice for global deployments.

#### Examples of Selective Translation Patterns

=== "Extractive Q&A"
    | Component | Language |
    |---|---|
    | User's content | Source language |
    | Context | Source language |
    | Instruction | English |
    | Output | Source language |

=== "Summarization"
    | Component | Language |
    |---|---|
    | User's content | Source language |
    | Context | Translate to English |
    | Instruction | English |
    | Output | English, then translate back |

=== "Classification"
    | Component | Language |
    |---|---|
    | Labels | Source language |
    | Instruction | English |
    | Reasoning (optional) | English |

#### Tips for Implementing Translation-Based Workflows

- **Experiment with multiple patterns.** There is no single universal recipe; testing pays off.
- **Use high-quality translation tools.** Bad translation leads to bad reasoning.
- **Minimize translation steps.** Each additional translation introduces risk and extra cost.
- **Document your prompt patterns.** Clear documentation prevents confusion and ensures consistent performance.
- **Evaluate outputs carefully.** Watch for missing details, mistranslations, and cultural mismatches. See the [Evaluation chapter](/playbook/01-evaluation) for detailed metric rubrics and assessment pipelines.

#### Key Takeaways

!!! abstract "Summary"
    - Translation is a powerful tool for bridging the multilingual gap created by English-heavy training data.
    - Full translation is easy to use but often insufficient for nuanced tasks.
    - Selective translation offers a balanced, high-performing approach across resource levels.
    - The effectiveness of translation depends on the task, the language, and the type of content.
    - Thoughtful design leads to more accurate, culturally aligned results for users around the world.
