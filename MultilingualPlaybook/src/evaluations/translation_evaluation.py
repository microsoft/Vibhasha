import sacrebleu
from typing import List
import os
from litellm import completion
from ..prompt_bank import LLM_AS_JUDGE_PROMPT

#load environment variables from .env file in the parent 'src' directory
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

def compute_bleu(hypotheses: List[str], references: List[List[str]]) -> float:
    """
    Computes the BLEU score for a set of hypotheses and references.

    Args:
        hypotheses: A list of translated sentences.
        references: A list of lists of reference sentences.

    Returns:
        The BLEU score.
    """
    if len(hypotheses) != len(references):
        raise ValueError("The number of hypotheses and references must be the same.")

    # Sacrebleu expects references to be a list of lists of strings,
    # where each inner list is the set of references for a single hypothesis.
    # However, the common use case is one reference per hypothesis.
    # This code is structured for the multi-reference case.
    
    bleu = sacrebleu.corpus_bleu(hypotheses, references)
    return bleu.score

def compute_chrf(hypotheses: List[str], references: List[List[str]]) -> float:
    """
    Computes the chrF score for a set of hypotheses and references.

    Args:
        hypotheses: A list of translated sentences.
        references: A list of lists of reference sentences.

    Returns:
        The chrF score.
    """
    if len(hypotheses) != len(references):
        raise ValueError("The number of hypotheses and references must be the same.")
    
    chrf = sacrebleu.corpus_chrf(hypotheses, references)
    return chrf.score

def compute_comet(sources: List[str], hypotheses: List[str], references: List[str]) -> float:
    """
    Computes the COMET score for a set of sources, hypotheses, and references.

    Args:
        sources: A list of source sentences.
        hypotheses: A list of translated sentences.
        references: A list of reference sentences.

    Returns:
        The COMET score.
    """
    try:
        from unbabel_comet import download_model, load_from_checkpoint
        import torch
    except ImportError:
        print("unbabel-comet or torch is not installed. Please install it using 'pip install unbabel-comet torch'")
        return None

    # Download and load the default COMET model
    # This will download the model if it's not already cached
    model_path = download_model("unbabel-comet/wmt22-comet-da")
    model = load_from_checkpoint(model_path)
    
    data = [{"src": src, "mt": mt, "ref": ref} for src, mt, ref in zip(sources, hypotheses, references)]
    
    # Check for GPU availability
    gpus = 1 if torch.cuda.is_available() else 0
    
    model_output = model.predict(data, batch_size=8, gpus=gpus)
    
    # The output is a list of scores, one for each sample. 
    # We can return the average score.
    return model_output.system_score

def evaluate_with_llm(source_sentence: str, 
                        reference_sentence: str,
                        mt_sentence: str, 
                        model: str = "openai/gpt-oss-20b:free"):
    """
    Uses an LLM to evaluate the quality of a machine translation via OpenRouter.

    Args:
        source_sentence: The source sentence.
        reference_sentence: The reference translation.
        mt_sentence: The machine-generated translation to evaluate.
        model: The name of the model to use via litellm (defaults to a free OpenRouter model).

    Returns:
        The LLM's evaluation response.
    """
    if not os.environ.get("OPENROUTER_API_KEY"):
        return "OPENROUTER_API_KEY environment variable not set. Please set it to use the LLM-as-judge with OpenRouter."

    prompt = LLM_AS_JUDGE_PROMPT.format(
        source_sentence=source_sentence,
        reference_sentence=reference_sentence,
        mt_sentence=mt_sentence
    )
    
    messages = [{"role": "user", "content": prompt}]
    
    try:
        # LiteLLM will use the OPENROUTER_API_KEY environment variable
        response = completion(model=model, messages=messages)
        return response.choices[0].message.content
    except Exception as e:
        return f"An error occurred while querying the LLM via OpenRouter: {e}"


def main():
    """
    Example usage of the translation evaluation functions.
    """
    # Example from a machine translation task
    hypotheses = [
        "The cat sat on the mat.",
        "The dog ate my homework."
    ]
    
    # Note: sacrebleu supports multiple references per hypothesis
    references = [
        ["The cat is on the mat."],
        ["The dog has eaten my homework."]
    ]
    
    sources = [
        "Le chat s'est assis sur le tapis.",
        "Le chien a mangé mes devoirs."
    ]

    # --- BLEU Score ---
    # Ensure you have the sacrebleu library installed:
    # pip install sacrebleu
    
    bleu_score = compute_bleu(hypotheses, references)
    print(f"BLEU score: {bleu_score:.2f}")

    # --- chrF Score ---
    chrf_score = compute_chrf(hypotheses, references)
    print(f"chrF score: {chrf_score:.2f}")

    # --- COMET Score ---
    # Ensure you have the unbabel-comet and torch libraries installed:
    # pip install unbabel-comet torch
    # Note: The first time you run this, it will download the COMET model.
    print("\nComputing COMET score... (this may take a while during the first run)")
    comet_score = compute_comet(sources, hypotheses, [ref[0] for ref in references])
    if comet_score is not None:
        print(f"COMET score: {comet_score:.4f}")

    # --- LLM-as-judge (via OpenRouter) ---
    print("\n--- LLM-as-judge (OpenRouter) prompt example ---")
    # Make sure to set the OPENROUTER_API_KEY environment variable
    # For example, in your terminal: export OPENROUTER_API_KEY='your-openrouter-api-key'
    # You can get a free key from https://openrouter.ai
    llm_evaluation = evaluate_with_llm(sources[0], references[0][0], hypotheses[0])
    print("LLM Evaluation:")
    print(llm_evaluation)


if __name__ == "__main__":
    try:
        import sacrebleu
        import litellm
    except ImportError:
        print("One or more required libraries (sacrebleu, litellm) are not installed.")
        print("Please install them using 'pip install sacrebleu litellm openai'")
    else:
        main()