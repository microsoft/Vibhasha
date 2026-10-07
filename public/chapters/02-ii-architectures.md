## 2.2 Advanced translation architectures

Translation can be woven into a multilingual workflow in several ways. The right architecture depends on how much control you need, how much nuance your task requires, and how reliably your target languages are supported. This section breaks down the three main translation architectures and how to choose between them. 

### 2.2.1 Full pre-translation

Full pre-translation is the most straightforward approach. In this architecture, every part of the user request is translated into English, processed by an English-optimized model, and then translated back into the target language. 

!!! info "How it works "
    1. **Translate** the entire non-English input prompt into English
    2. **Process** the resulting English prompt using a powerful, English-centric LLM
    3. **Translate back** the English output into the original source language

**Strengths :**

- ⚡ Easy to implement 
- 🔌 Works well when translation quality is high 
- ✅ Ideal for early testing or quick prototypes

**Limitations :**

!!! warning "Full Pre-translation Risks"
    - 🎭 High risk of meaning drift 
    - ⚠️ Cultural nuance can be flattened 
    - 🔄 Errors compound across multiple translation steps 
    - Output often feels translated rather than native 

Full pre-translation is often a useful starting point, but it rarely produces the best results for production systems. 

### 2.2.2 Selective pre-translation

Selective pre-translation is a more advanced and reliable strategy. Instead of translating everything, you translate only the components that benefit from English processing. 

Instead of translating the entire prompt, selectively translate only specific components:

- **Instruction**: The task directive
- **Context**: The information to process
- **Examples**: In-context learning demonstrations
- **Output**: The desired response format

Selective pre-translation lets you mix and match languages. For example, keep the context in the user’s language, translate only the instructions into English, and have the model produce an English response that you later translate back. 

This approach consistently outperforms full translation and often surpasses direct prompting, especially for low-resource languages. 


**Why Selective Translation Works**

- Protects meaning by keeping the most sensitive content in the original language 
- Gives the model English instructions, improving task clarity 
- Reduces translation steps and error chains 
- Supports tone, cultural nuance, and accuracy 

Selective translation is flexible, powerful, and ideal for complex tasks that require both precision and natural language flow. 



### 2.2.3 Dynamic translation pipelines 

Some applications benefit from treating translation as a dynamic component within the reasoning process. In this architecture, translation is not a single step at the beginning or end. Instead, the system calls translation tools at multiple points as needed. 

**Examples of Dynamic Workflows**

- Translating retrieved context for RAG systems 
- Switching languages mid-prompt for better reasoning 
- Translating intermediate outputs before combining them 
- Using translation selectively only when the model shows uncertainty 

**When to Use Dynamic Translation**

- When the model performs unevenly across languages 
- When you need the best possible accuracy for low-resource languages 
- When context must be preserved exactly, but instructions must be processed in English 
- When your task requires multiple reasoning stages

This architecture gives you maximum control and adaptability but requires additional orchestration. 

### 2.2.4 Choosing the right architecture 

Here’s a quick guide to help you choose.

**Use full pre-translation when:**

- You are testing an early prototype 
- Translation quality for your languages is strong 
- Your tasks rely more on reasoning than nuance 
- Cost and simplicity matter more than precision 

**Use selective pre-translation when:**

- You need a balance of meaning, tone, and accuracy 
- Language resources are limited 
- You want to keep user content intact 
- You want to reduce translation errors 

**Use dynamic translation when:**

- You need maximum performance in low-resource languages 
- Your system includes retrieval, multiple reasoning stages, or complex workflows 
- Tasks require both English reasoning and native-language fidelity 

Selective and dynamic approaches often produce the highest-quality multilingual systems. 



 