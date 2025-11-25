## The Strategic Crossroads: Direct Inference vs. Pre-translation

The foundational decision for any multilingual workflow is whether to engage the LLM directly in the source language or to first translate the query into English. This choice is not static; it depends on the specific capabilities of the model, the characteristics of the language, and the quality of available translation tools.

### The Default: Direct Inference

Modern multilingual LLMs are engineered with **cross-lingual transfer capabilities**. During pretraining on vast, multilingual corpora, they learn to infer connections between languages, allowing them to apply grammatical structures and semantic associations from high-resource languages like English to lower-resource ones.[^10]

!!! success "Direct Inference: The Strong Default"
    For many applications, the most effective approach is **direct inference**—prompting the model directly in the non-English source language.
    
    **Key Finding**: Analysis of PaLM2-L performance revealed that approximately **85% of low-resource languages benefit from direct inference**.[^2][^14]

**Why Direct Inference Works:**

- ✅ Leverages intrinsic cross-lingual capabilities
- ✅ Avoids translation error propagation
- ✅ Preserves cultural and linguistic nuance
- ✅ Validated by empirical research for QA tasks

### The Exception: When Pre-translation Prevails

Despite the general superiority of direct inference, a **consistent and important exception** exists for specific low-resource languages.

!!! warning "Seven Critical Exception Languages"
    Research with PaLM2-L identified languages where pre-translation **consistently outperforms** direct inference:
    
    **Bambara** · **Cusco-Collao Quechua** · **Lingala** · **Oromo** · **Punjabi** · **Tigrinya** · **Tsonga**
    
    *Note: Four of these seven are African languages, potentially indicating regional patterns in data representation.*

**Root Causes for Pre-translation Success:**

<div class="grid cards" markdown>

-   **📊 Severe Data Underrepresentation**

    ---

    These languages are so sparsely represented in pretraining that the model's internal representations are too weak for complex reasoning.[^6][^15][^16]

-   **🔤 Tokenization Inefficiency**

    ---

    Standard tokenizers optimized for Latin scripts create longer, more expensive, and less semantically coherent token sequences.[^4]

-   **🌐 Linguistic Divergence**

    ---

    Languages typologically distant from English benefit less from cross-lingual transfer, making translation a more reliable bridge.[^4]

</div>

### Data-Driven Decision Framework

!!! important "Dynamic Strategy Selection"
    The optimal strategy is **not a fixed property** of a language but shifts based on the specific model being used. As new models with more diverse pretraining data emerge, continuous re-evaluation is essential.[^4]

#### Three Key Performance Determinants

=== "1. Model Size"
    **Impact**: Larger models generally possess more robust multilingual capabilities
    
    - Better candidates for direct inference
    - Translation quality improves with size due to greater pretraining exposure[^17][^18][^19]
    - **Caveat**: Size alone doesn't eliminate performance disparities[^20]

=== "2. Language Representation"
    **Impact**: **Most critical determinant** of performance
    
    - Strong positive correlation between pretraining corpus proportion and performance[^6][^15][^21]
    - Greater representation → direct inference more likely to succeed
    - Check model documentation for language coverage details

=== "3. Translator Proficiency"
    **Impact**: Quality of MT system determines pre-translation success
    
    - High-fidelity translation is **prerequisite** for pre-translation workflows[^12][^22]
    - Poor MT introduces cascading errors through entire pipeline[^13][^23][^24][^25]
    - **Guideline**: If MT quality is weak, direct inference may be less risky

#### Strategy Comparison Matrix

| Strategy | Best For (Language Profile) | Best For (Task Type) | Key Dependencies | Primary Risk |
|----------|----------------------------|---------------------|------------------|--------------|
| **Direct Inference** | High- and Medium-Resource Languages; Majority of Low-Resource Languages | All Tasks | Robust multilingual LLM with strong cross-lingual transfer | Suboptimal performance if model's native support is weak |
| **Full Pre-translation** | Very Low-Resource Languages with poor native LLM support (e.g., Bambara, Quechua) | General tasks where cultural nuance is not critical | High-quality, reliable MT API | Loss of cultural nuance and translation error propagation |
| **Selective Pre-translation** | All non-English languages, especially Low- and Medium-Resource | Extractive and Generative tasks requiring precision and nuance | High-quality MT API and well-structured prompt architecture | Increased implementation complexity |

---

