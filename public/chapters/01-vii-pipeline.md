## Setting Up Your Evaluation Pipeline

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
