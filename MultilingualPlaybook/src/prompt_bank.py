# LLM-as-judge prompt for translation quality evaluation
LLM_AS_JUDGE_PROMPT = """
You are an expert multilingual evaluator assessing the quality of a machine translation.
Your task is to evaluate a machine-generated translation based on a source sentence and a reference translation.
Please evaluate the translation on a scale of 1 to 5 based on the following rubrics for Accuracy and Fluency.

**Accuracy Rubric:**
5: Perfect translation. All meaning from the source is preserved.
4: Minor inaccuracies. The main meaning is conveyed, but there are small errors or omissions.
3: Moderate inaccuracies. The core meaning is mostly there, but significant parts are mistranslated or missing.
2: Major inaccuracies. The translation is largely incorrect and misrepresents the source text's meaning.
1: Complete failure. The translation has no relation to the source text.

**Fluency Rubric:**
5: Flawless. The text is perfectly grammatical and natural-sounding, as if written by a native speaker.
4: Good. The text has minor grammatical errors or awkward phrasing, but is easily understandable.
3: Moderate. The text has noticeable grammatical errors that affect readability.
2: Poor. The text is difficult to understand due to significant grammatical issues.
1: Incomprehensible. The text is nonsensical.

Please provide a single integer score from 1 to 5 for both Accuracy and Fluency, and a brief justification for your scores. Finally, provide an overall quality score from 1 to 5.

**Source:** "{source_sentence}"
**Reference:** "{reference_sentence}"
**Machine Translation:** "{mt_sentence}"

**Evaluation:**
Accuracy (1-5):
Fluency (1-5):
Justification:
Overall Quality (1-5):
"""