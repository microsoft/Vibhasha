## 1.4 Advisory for effective MT evaluation

Effective MT evaluation, particularly in low-resource settings, requires a strategic approach that combines various methodologies.

### 1.4.1 When to use which metric: a practical guide

!!! info "Fundamental Principle"
    No single metric provides a complete picture of MT quality. The most effective and reliable evaluation strategy **almost always involves a judicious combination** of automated metrics complemented by targeted human review.

This multi-faceted approach helps to triangulate results and mitigate the limitations of individual methods.

#### Strategic metric selection

<div class="grid" markdown>

!!! info "Early-Stage Development & Rapid Prototyping"
    **Metric**: N-gram metrics (BLEU)
    
    **Use When**: Quick feedback needed for large-scale experiments
    
    **⚠️ Caution**: Inherent limitations in low-resource settings must be explicitly acknowledged; should **not** be sole arbiter of quality

!!! success "Semantic Accuracy & Low-Resource Languages"
    **Metrics**: Embedding-based (BERTScore, MoverScore)
    
    **Use When**: 
    - Semantic accuracy is paramount
    - Robustness to lexical variation needed
    - Dealing with low-resource languages where reference diversity is inherently limited
    
    **✅ Recommended**: Significantly more reliable indicators of quality in challenging contexts

!!! success "Large-Scale Quality Assessment"
    **Metric**: LLM-as-judge
    
    **Use When**: Approximate human-like judgments needed at scale and resources for comprehensive human evaluation are severely constrained
    
    **⚠️ Prerequisites**: Must be preceded by rigorous calibration, proactive bias mitigation, and thorough validation against high-quality human baseline

</div>

#### The paradigm shift for low-resource MT

!!! warning "Re-evaluating Traditional Approaches"
    Historically, BLEU has been the de facto standard for automated MT evaluation. However:
    
    **❌ BLEU Limitations Amplified**  
    Sensitivity to lexical variation and dependence on diverse references are amplified in low-resource settings
    
    **✅ Semantic Metrics Excel**  
    Offer superior capabilities in capturing meaning and are more robust to lexical differences, directly addressing BLEU's weaknesses
    
    **🆕 LLM-as-Judge Emergence**  
    Introduces new dimension of scalability and nuanced feedback, albeit with its own challenges

!!! info "New Best Practice"
    For low-resource MT, the traditional evaluation paradigm where n-gram metrics are primary should be **fundamentally re-evaluated**:
    
    1. **Semantic metrics should become the default** automated choice for meaningful progress tracking and system comparison
    2. **LLM-as-judge should complement** (strategically and carefully managed)
    3. **Always ground** with essential human evaluation
    
    This implies a necessary shift in best practices for low-resource MT development. Researchers and practitioners should prioritize implementing, reporting, and interpreting semantic metrics alongside traditional ones.

### 1.4.2 The role of human evaluation

!!! info "The Ultimate Arbiter"
    Despite advancements in automated metrics, human evaluation **unequivocally remains the ultimate arbiter** of translation quality. Human annotators are uniquely capable of assessing nuances, cultural appropriateness, stylistic quality, and overall fluency and adequacy that automated metrics often fail to capture.

#### Best practices for human evaluation

=== "Clear Guidelines & Rubrics"
    - Provide annotators with unambiguous guidelines
    - Use comprehensive error taxonomies (e.g., MQM - Multidimensional Quality Metrics)
    - Implement precise scoring rubrics to ensure consistency and objectivity

=== "Multiple Annotators"
    - Employ multiple independent annotators for each translation segment
    - Ensure reliability through inter-annotator agreement calculation
    - Validate the quality of human judgments

=== "Strategic Targeting"
    Given the cost, human evaluation should be strategically targeted:
    
    - Focus on critical samples
    - Challenging linguistic phenomena
    - Specific domains
    - Long-form content where automated metrics struggle

=== "Domain Expertise"
    For domain-specific content (medical, legal, technical):
    
    - Engage human evaluators with deep domain expertise
    - Accurately assess terminology correctness
    - Ensure contextual appropriateness

#### Integration with automated methods

Human evaluation results are indispensable for:

<div class="grid cards" markdown>

-   :material-tune-vertical:{ .lg .middle } __Calibration__

    ---

    Calibrating and validating automated metrics, especially newer approaches like LLM-as-judge

-   :material-shield-check:{ .lg .middle } __Bias Detection__

    ---

    Ensuring automated scores align with human perception and are free from unintended biases

-   :material-bug:{ .lg .middle } __Error Analysis__

    ---

    Providing rich, qualitative error analysis identifying systemic issues and recurring patterns

-   :material-wrench:{ .lg .middle } __Targeted Improvements__

    ---

    Informing targeted model improvements with detailed feedback that aggregate scores might obscure

</div>

!!! success "Optimal Strategy: Hybrid Approach"
    The most effective strategy combines:
    
    - **Automated metrics** for large-scale initial screening, progress tracking, and identifying outliers
    - **Targeted human evaluation** for in-depth analysis, error classification, and final quality assurance

!!! info "Strategic Investment Perspective"
    Human evaluation is recognized as the gold standard but is inherently expensive and time-consuming. Automated metrics, while efficient, have significant limitations, particularly in low-resource settings.
    
    **In low-resource settings**, human evaluation should not be viewed as an **optional luxury** to be minimized, but rather as a **strategic, targeted investment**.
    
    Even a small, meticulously curated set of human evaluations can be profoundly valuable for:
    
    - Validating the reliability of automated metrics
    - Understanding the true nature of errors
    - Guiding development efforts
    
    This shifts the perspective from simply minimizing the cost to **maximizing the impact and value** derived from limited human evaluation resources.

### 1.4.3 Data considerations

The quality, quantity, and diversity of evaluation data are paramount for reliable assessment.

#### Reference quality

!!! warning "Critical Bottleneck"
    The quality, quantity, and diversity of human reference translations are paramount for the reliability of any automated evaluation metric. In low-resource settings, where obtaining high-quality references is a significant challenge, this becomes a **critical bottleneck**.

**Mitigation Strategies:**

| **Strategy** | **Description** | **Trade-offs** |
|----------|-------------|-----------|
| **Meticulous Curation** | Focus on creating small sets of exceptionally high-quality references | Prioritize accuracy and naturalness over volume |
| **Multiple References** | Obtain multiple human references for each source segment | Accounts for linguistic variability but often difficult in low-resource contexts |
| **Post-Edited MT** | Consider high-quality human post-edited MT outputs as references | Introduces potential biases towards MT system's style or errors |

#### Test set creation

!!! warning "Representativeness is Key"
    Test sets must be highly representative of the actual target domain, style, and content that the MT system will encounter in real-world deployment. **Misaligned test sets lead to misleading evaluation results.**

**Best Practices:**

- ✅ **Quality over quantity**: Smaller, expertly crafted test set with high-quality, relevant references is far more valuable than a large, noisy, or unrepresentative one
- ✅ **Include challenges**: Deliberately incorporate challenging linguistic phenomena, domain-specific terminology, and longer-form content
- ✅ **Stress testing**: Thoroughly test the MT system's capabilities and reveal its limitations

#### Domain adaptation

!!! info "Domain-Specific Performance"
    MT systems are known to perform poorly on out-of-domain text without specific domain adaptation. This principle **applies equally to evaluation**.

**Requirements:**

- Evaluation should ideally be conducted on test sets that precisely reflect the specific domain(s) for which the MT system is intended
- Often necessitates creating or adapting specialized domain-specific test sets and their corresponding references
- Accurate translation and consistent usage of domain-specific terms are critical for specialized texts (legal, medical, technical)
- Even minor errors can be highly detrimental

!!! info "Evaluation Data as Strategic Resource"
    Low-resource settings are fundamentally characterized by data scarcity. This scarcity directly impacts the availability of high-quality reference translations for evaluation.
    
    The reliability and discriminative power of any automated metric—regardless of its sophistication—are **fundamentally dependent** on the quality and representativeness of the test sets and references.
    
    **In low-resource contexts, evaluation data is not merely a prerequisite**—it is a **highly valuable and scarce strategic resource**.
    
    Flawed or insufficient evaluation data will inevitably lead to misleading results, irrespective of the metric used, hindering accurate assessment and effective system improvement.

**Strategic Implications:**

A significant portion of the effort in low-resource MT development must be dedicated to:

- ✅ Intelligent data acquisition
- ✅ Meticulous curation
- ✅ Rigorous annotation strategies specifically for evaluation sets

This also suggests that evaluation approaches that are **less dependent on perfect, abundant references** will gain increasing prominence:

- Targeted human error analysis
- Specific LLM-as-judge applications
- Reference-free methods
