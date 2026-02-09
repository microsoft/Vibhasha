## Evaluation in Practice

Once you've identified relevant datasets, establishing a robust evaluation setup ensures consistent and reliable results.

### Multiple-Choice Question (MCQ) Evaluation

MCQ evaluation typically uses one of two approaches: **log-likelihood scoring** or **answer generation**.

=== "1. Log-Likelihood Scoring"

    This approach compares the model's predicted probabilities for each answer option:

    - For each question with options A, B, C, D, the model computes log-likelihood for each option
    - The option with highest likelihood is selected as the answer
    - This method is more reliable for multiple-choice as it directly assesses model's confidence in each choice

=== "2. Answer Generation Approach"

    Alternatively, generate the answer and match it against the correct option.

!!! warning "MCQ Evaluation Considerations"
    - **Position bias**: Models may favor certain positions (e.g., option A). Evaluate with shuffled options if possible.
    - **Language of options**: Ensure option labels (A/B/C/D) match your prompt format.
    - **Few-shot examples**: Number and selection of examples can significantly impact scores.

### Generative Task Evaluation

For open-ended generation tasks, evaluation requires comparing generated text with reference answers. However, assessing similarity between generated text and reference answers is not straight forward. N-gram overlap metrics (BLEU, ROUGE etc) are easy to implement metrics but do not consider semantics.

---

### Human-Centric Evaluation

!!! success "Why Human Evaluation Matters"
    Human evaluation remains the **gold standard** for assessing LLM quality. It uniquely captures subtle nuances of language, context, and subjective quality often missed by automated metrics—particularly for complex, open-ended text generation and diverse cultural expressions.

#### Pairwise Comparison and Elo Ratings

<div class="grid cards" markdown>

-   :material-compare:{ .lg .middle } __Pairwise Comparison__

    ---

    Present annotators with two responses from different models for the same prompt, asking them to select the superior response or indicate a tie

    [:octicons-arrow-right-24: Implementation Details](#pairwise-details)

-   :material-trophy:{ .lg .middle } __Elo Rating System__

    ---

    Adapted from chess, Elo ratings rank models based on pairwise comparison outcomes, providing robust relative performance measures

    [:octicons-arrow-right-24: Calculate Elo Scores](#elo-calculation)

</div>

This comparative approach directly assesses relative performance. The process involves generating comparisons, including duplicates with flipped response orders to verify annotator consistency and detect positional biases.

!!! example "PARIKSHA Study"
    The [PARIKSHA study](https://aclanthology.org/2024.emnlp-main.451.pdf) conducted **90,000 human evaluations** across 10 Indic languages using a pairwise comparison setting (inspired by LMSys ChatbotArena) to systematically compare 30 models.

**Resources for Implementation:**

- [LMSYS Org's Chatbot Arena Leaderboard](https://lmsys.org/blog/2023-05-25-leaderboard/) - Methodology and implementation
- [Archived Elo Rating Calculation Notebook](../../src/elo/Chatbot_Arena_Elo_Rating_Calculation_(July_17,_2023).ipynb) - Reference implementation

**Annotation Guidelines Example:**

Clear guidelines are essential for effective pairwise comparisons. The image below shows task instructions from the PARIKSHA study:

![Task instructions provided to the annotators for pair wise comparisons.](/assets/01_evaluation/Guidelines_PairWiseEvaluations.png){ width="480" }

#### Direct Assessment (Metric-based Scoring)

Direct assessment involves human annotators rating a single query-response pair against predefined metrics, providing granular understanding of model performance across quality dimensions.

**Key Evaluation Metrics:**

| Metric | Description |
|--------|-------------|
| **Linguistic Acceptability (LA)** | Evaluates if text sounds natural to a native speaker, checking for mechanical translation or non-idiomatic expressions |
| **Task Quality (TQ)** | Measures adherence to prompt instructions and incorporation of key input information |
| **Hallucination (H)** | Assesses factual grounding in input and consistency with general knowledge, identifying fabricated or counterfactual claims |
| **Output Content Quality (OCQ)** | Evaluates overall content standard, checking for repetition, non-native elements, or scraped text |
| **Problematic Content (PC)** | Identifies offensive, inappropriate, or harmful content |

!!! example "PARIKSHA Direct Assessment"
    The study involved direct assessment of **8,640 data points** by human annotators scoring responses on LA, TQ, and H using a comprehensive rubric across multiple languages.

**Annotation Guidelines Example:**

![Task instructions provided to the annotators for direct assessments.](/assets/01_evaluation/Instructions_DirectAssessment.png){ width="480" }

#### Ethical Considerations in Human Annotation

!!! warning "Critical Ethical Requirements"
    Human evaluation is resource-intensive, requiring significant financial investment and time. **Ethical considerations are paramount**, especially with diverse cultural groups.

**Essential Ethical Practices:**

| Consideration | Requirement |
|--------------|-------------|
| **Fair Compensation** | Annotators must receive fair compensation, often above local minimum wage, ensuring dignified digital labor |
| **Annotator Demographics** | Must be native speakers of assessed languages; understanding demographics is crucial for identifying/mitigating biases |
| **Training & Guidelines** | Rigorous training and clear, detailed guidelines essential; refined through pilot studies for cultural sensitivity |
| **Annotator Safety** | For toxic/sensitive content, protect annotators; LLM evaluators can perform preliminary safety assessments |

!!! danger "The Evaluation Paradox"
    Achieving high-quality, ethical, and scalable human-centric evaluation is inherently challenging. Human evaluation is precise but costly and time-consuming. This tension necessitates **hybrid evaluation systems** and LLM-as-a-judge approaches—which must be rigorously validated against human performance and adhere to strict ethical guidelines.

---

### LLM-as-a-Judge Evaluation

LLMs capable of evaluating other LLMs' outputs offer significant advancements in evaluation scalability and cost-effectiveness, making them particularly appealing for broad multilingual assessments.

!!! tip "Key Advantages"
    - **Enhanced Scalability**: Evaluate large datasets without prohibitive human annotation costs
    - **Subjective Criteria**: Quantify coherence, relevance, tone, and helpfulness beyond traditional metrics
    - **Cost Reduction**: Significantly lower costs compared to human evaluation at scale

#### Prompting Strategies for LLM Evaluators

The effectiveness of LLM evaluators is highly dependent on prompt design, which can significantly alter performance across languages and cultures.

<div class="grid" markdown>

!!! note "Zero-shot vs. Few-shot"
    While few-shot examples commonly enhance general LLM tasks, studies on LLM-as-a-judge suggest they **may not substantially improve** evaluator performance or human agreement—differing from general industry assertions.

!!! note "Single vs. Compound Calls"
    Evaluating a **single metric per LLM call** generally yields superior results and higher human concordance than evaluating multiple metrics in one "compound call." Accuracy comes at the cost of increased API calls.

!!! note "Simple vs. Detailed Instructions"
    Highly detailed, rubric-like instructions can **paradoxically slightly reduce** percentage agreement with human judgments, though they may lead to less skewed score distributions.

!!! warning "Language Consideration"
    Evaluation prompts are often in **English**, as native language instructions can sometimes diminish performance for evaluators.

</div>

#### Implementation Example: OpenEvals for Hallucination Detection

The following code demonstrates using [LangChain's OpenEvals](https://github.com/langchain-ai/openevals/tree/main) for judging hallucinations with OpenAI models:

??? example "View Code: Hallucination Detection with OpenEvals"

    ```python
    from openevals.llm import create_llm_as_judge

    # Hallucination detection prompt
    HALLUCINATION_PROMPT = """You are an expert data labeler evaluating model outputs for hallucinations. Your task is to assign a score based on the following rubric:

    <Rubric>
      A response without hallucinations:
      - Contains only verifiable facts that are directly supported by the input context
      - Makes no unsupported claims or assumptions
      - Does not add speculative or imagined details
      - Maintains perfect accuracy in dates, numbers, and specific details
      - Appropriately indicates uncertainty when information is incomplete
    </Rubric>

    <Instructions>
      - Read the input context thoroughly
      - Identify all claims made in the output
      - Cross-reference each claim with the input context
      - Note any unsupported or contradictory information
      - Consider the severity and quantity of hallucinations
    </Instructions>

    <Reminder>
      Focus solely on factual accuracy and support from the input context. Do not consider style, grammar, or presentation in scoring. A shorter, factual response should score higher than a longer response with unsupported claims.
    </Reminder>

    Use the following context to help you evaluate for hallucinations in the output:

    <context>
    {context}
    </context>

    <input>
    {inputs}
    </input>

    <output>
    {outputs}
    </output>

    If available, you may also use the reference outputs below to help you identify hallucinations in the response:

    <reference_outputs>
    {reference_outputs}
    </reference_outputs>
    """

    # Example usage
    inputs = "What is a doodad?"
    outputs = "I know the answer. A doodad is a kitten."
    context = """
              A doodad is a self-replicating swarm of nanobots. \
              They are extremely dangerous and should be avoided at all costs. \
              Some safety precautions when working with them include wearing gloves and a mask.
              """

    llm_as_judge = create_llm_as_judge(
        prompt=HALLUCINATION_PROMPT,
        feedback_key="hallucination",
        model="openai:o3-mini",
    )

    eval_result = llm_as_judge(
        inputs=inputs,
        outputs=outputs,
        context=context,
        reference_outputs="",
    )

    print(eval_result)
    # Output: {'key': 'hallucination', 'score': False, 'comment': '...'}
    ```

#### The Critical Need for Calibration with Human Judgments

!!! danger "Calibration is Non-Negotiable"
    Despite their scalability, LLM evaluators' reliability **hinges on rigorous calibration** against human judgments. This is crucial in multilingual settings and for low-resource languages, where linguistic and cultural nuances significantly impact accuracy.

LLM judgments can be inconsistent and susceptible to various influences. **Calibration involves comparing LLM scores with aggregated human scores** using metrics like:

- **Percentage Agreement (PA)**: Raw agreement proportion
- **Fleiss' Kappa (κ)**: Chance-adjusted agreement measure
- **Kendall's Tau (τ)**: Correlation between rankings

This ensures LLM evaluations reflect human perception across languages.

#### Identifying and Mitigating Biases in LLM-as-a-Judge

LLM evaluators are prone to systemic biases that compromise assessment integrity, especially in diverse linguistic and cultural contexts.

!!! warning "Common LLM Evaluator Biases"

    **1. Positive Score Bias (Over-optimistic Nature)** LLMs often assign higher scores in direct assessment than humans. They may fail to detect hallucinations accurately and assign high LA and TQ scores even when human annotators deem quality unsatisfactory. **This bias is more pronounced in non-Latin script and low-resource languages.**

    **2. Self-Bias** LLMs can favor their own outputs or those from their architectural family. GPT-based evaluators, for instance, consistently rank GPT's outputs more favorably.

    **3. Verbosity Bias** Both human and LLM evaluators may favor longer responses, particularly for moderate length differences (40-100 words). This bias typically diminishes with excessively long responses containing irrelevant content.

    **4. Position Bias** Response order can influence LLM judgments. However, some studies report low position bias when options are flipped.

    **5. Decisiveness (Fewer Ties)** LLM evaluators are more definitive, choosing fewer "tie" outcomes than humans in pairwise comparisons. They are also more likely to select a response even if both options contain hallucinations (e.g., 87% for LLMs vs. 53% for humans in one study).

    **6. Cultural Nuance Bias** LLM evaluators show lower agreement with human judgments on culturally nuanced responses. This suggests **insufficient cultural context**, particularly evident in direct assessment for languages like Bengali and Odia.

!!! danger "The Illusion of Competence"
    The biases of LLM-as-a-judge—such as overly positive scoring and reduced hallucination detection—can create a **misleading perception of superior performance**. An LLM might confidently assign high scores, implying strong quality, even if content is questionable or human evaluators disagree.
    
    This is exacerbated in multilingual and culturally nuanced contexts where LLMs may lack deep understanding. The inconsistency of few-shot learning's utility in LLM evaluation further indicates that common LLM optimization strategies may not apply to nuanced evaluation tasks.
    
    **This risk of misrepresentation necessitates stringent and continuous calibration** against human judgments, particularly in critical applications, ensuring scalability does not compromise reliability.

---
