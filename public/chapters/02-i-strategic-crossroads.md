## 2.1 The strategic crossroads: direct inference vs. pre-translation

Choosing whether to translate, prompt directly, or fine-tune is not just a technical decision. It is a strategic one. Each path comes with strengths, weaknesses, and implications for accuracy, cost, culture, and safety. This section helps you decide which direction to take for your multilingual application. 

**Why the choice matters**: A model that performs flawlessly in English may behave unpredictably in a low-resource language. Some languages benefit from direct prompting, while others perform better when the task is translated into English. Still others require fine-tuning to achieve even baseline reliability. 

Understanding where your target languages fall on this spectrum can save you significant time, money, and engineering effort.

### 2.1.1 The surprising strength of direct inference 

Despite the dominance of English in model pretraining, many multilingual LLMs handle non-English text better than expected. In fact, research on PaLM 2 suggests that about 85% of low-resource languages perform best with direct inference. That means prompting directly in the source language can often outperform translation-based workflows. 


**Why Direct Inference Works:**

- ✅ Models have strong cross-lingual transfer from high-resource languages. 
- ✅ Native scripts can carry contextual cues that translations lose. 
- ✅ Direct prompting avoids translation artifacts and ambiguity. 
- ✅ It preserves voice, tone, and cultural nuance. 

But there is a catch: this pattern does not hold for all languages. 

### 2.1.2 The exception: when pre-translation prevails

A small but important group of languages consistently performs better with pre-translation. In studies of multilingual models, languages such as Bambara, Quechua (Cusco-Collao), Lingala, Oromo, Punjabi, Tigrinya, and Tsonga showed significantly stronger outcomes when inputs were translated into English before reasoning. 

Why these languages behave differently: 
- Severe underrepresentation in pretraining data 
- Tokenization inefficiency when scripts or morphology do not align with English-centric tokenizers 
- Sparse digital presence, which limits model exposure 
- Linguistic distance from high-resource languages the model understands well 

Understanding whether your target languages fall into this “exception” category is key to choosing the right pipeline. 


#### Three key performance determinants

Your workflow should be based on three core considerations. These factors influence whether direct prompting, translation, or fine-tuning will give you the strongest results. 

=== "1. Model Size"
    Larger models generally perform better across languages because they have richer internal representations and stronger reasoning skills. Bigger models also tend to have more robust multilingual capability. 

    Impact on your decision 
    - Large models are more likely to succeed with direct inference. 
    - Smaller models may need translation help or fine-tuning to handle linguistic complexity. 
    
    Model size is important, but it is not the only thing that matters. 

=== "2. Language Representation"
    This is the single most important factor in multilingual performance. 

    Languages with strong presence in the model’s training data tend to deliver: 
    - Higher accuracy 
    - Better cultural alignment 
    - Stronger safety performance 
    - More stable responses across tasks 

    Languages with poor representation require more support through translation, retrieval, or fine-tuning. 

    Tip: Check a model’s documentation for language coverage. Most vendors now publish language-support statements. 

=== "3. Translator Proficiency"
    Even the best model cannot overcome a bad translation pipeline. 

    High-quality translation improves: 
    - Accuracy 
    - Faithfulness to the source 
    - Safety 
    - Consistency 

    Low-quality translation introduces: 
    - Meaning drift 
    - Cultural distortion 
    - Error chains 
    - Higher hallucination rates 

    If your translation quality is weak, direct inference may outperform any translation-based workflow. 

#### Comparing the three strategies

Below is a high-level guide to help you choose the right path based on your task and language profile.

| **Strategy** | **Best For** | **Watch Out For** |
|----------|----------|---------------|
| **Direct Inference** | High-resource and mid-resource languages; Conversations or tasks that require tone, style, and cultural nuance; Low-latency applications; Scenarios with poor machine-translation quality | Performance drops in underrepresented languages, inconsistent tone, and safety gaps |
| **Full Pre-translation** | Quick prototypes; Languages with excellent machine-translation support; Straightforward tasks that do not depend heavily on nuance | Layered translation errors, value drift, and unnatural output phrasing |
| **Selective Pre-translation** | Low-resource languages; Tasks that require precision and nuance; Scenarios where context must remain intact; Balancing performance with cultural fidelity | Additional implementation complexity and the need for careful prompt design |

**Quick Decision Guide**

- ➡️ Choose **direct inference** if you want natural, culturally aligned responses and the language has moderate-to-strong support.
- ➡️ Choose **selective pre-translation** if you need stronger reasoning or accuracy in a low-resource language without losing context.
- ➡️ Choose **full pre-translation** if you are in the early prototyping phase or working with well-supported languages and simple tasks.

**The Bottom Line**

There is no single "best" strategy for multilingual deployment. The right choice depends on:

- The languages you support
- The complexity of your task
- The translation quality available
- The performance characteristics of your model

By understanding these factors, you can select the strategy that delivers the best mix of accuracy, cultural relevance, and reliability for your users.

