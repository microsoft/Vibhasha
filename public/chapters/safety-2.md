# Safety Assessments

Ensuring safety in multilingual LLM applications is a multifaceted challenge. Many safety mechanisms and alignment efforts have been English-centric, leaving dangerous blind spots for other languages. Studies show that popular models often produce more unsafe responses in non-English queries than in English.

!!! danger "Critical Safety Gap"
    **GPT-4's rate of harmful content was roughly three times higher** in certain low-resource languages than in high-resource ones. This chapter examines key safety risks and provides strategies to mitigate them.

This chapter examines key safety risks (toxicity, jailbreaking, hallucinations, bias, privacy, etc.) in a multilingual context and provides strategies, tools, and best practices to mitigate them.

## Taxonomy of Model Safety

It's helpful to categorize safety issues that may arise when deploying LLMs globally:

Jailbreaking Attacks: Adversarial prompts that trick models into bypassing refusal policies or content filters
ar5iv.labs.arxiv.org
. (E.g., a cleverly phrased non-English request that elicits disallowed content.)

Toxicity and Bias: Generation of hateful, harassing, or biased content. This includes slurs, insults, or stereotypes that may be missed in less-studied languages
ar5iv.labs.arxiv.org
.

Factuality and Hallucination: Production of false or nonsensical information. Hallucinations can be exacerbated in low-resource languages where models lack knowledge and may “guess” answers.

AI Privacy (Data Leakage): Revealing sensitive personal data that was memorized in training. Multilingual models might inadvertently leak private info (e.g. phone numbers, addresses) from non-English web text.

Policy and Ethics: Ensuring compliance with local laws, cultural norms, and ethical guidelines. What’s acceptable in one culture may be harmful in another.

LLM Alignment: Overall alignment of the model’s behavior with human values and intent. This spans the above categories (e.g. RLHF training to reduce all kinds of harmful outputs). Proper alignment becomes harder when extending to many languages and cultures
ar5iv.labs.arxiv.org
ar5iv.labs.arxiv.org
.

These categories (adapted from Yong et al. 2025) cover the broad scope of LLM safety concerns
ar5iv.labs.arxiv.org
. Next, we focus on how these issues manifest in multilingual settings.

## Multilingual Safety Challenges

Safety is not one-size-fits-all across languages. Languages differ in slang, taboos, and cultural context, so an innocuous phrase in one language might be deeply offensive in another
ar5iv.labs.arxiv.org
. For instance, the term “banana” is a derogatory slur in some Asian contexts, while conversely a literal profanity in one language might be harmless slang in another
ar5iv.labs.arxiv.org
. An English-trained toxicity detector may completely miss such culturally specific slurs. This means toxic content filters and safety policies must be localized – simply translating an English list of banned words is insufficient
ar5iv.labs.arxiv.org
.

 

There is also a pronounced coverage gap in safety: even high-resource languages beyond English (like Arabic, Hindi, etc.) have been understudied in LLM safety research
ar5iv.labs.arxiv.org
. As a result, popular models tend to have weaker safety guardrails in non-English inputs, sometimes yielding content that would have been filtered out in English
ar5iv.labs.arxiv.org
. Empirical evaluations confirm this gap. For example, Deng et al. (2024) found that when users query in low-resource languages, both ChatGPT and GPT-4 are far more likely to produce disallowed content
arxiv.org
. Similarly, Wang et al. (2024) demonstrated that certain multilingual prompts combined with malicious instructions cause an alarmingly high rate of unsafe outputs (over 80% for ChatGPT)
arxiv.org
. These findings highlight how safety alignment often fails to transfer evenly across languages, posing higher risks to users in under-represented language communities.

 

Cross-lingual inconsistencies can also undermine safety. If a user asks a sensitive question in French versus Swahili, do they get equally safe and correct answers? Often not. A model might refuse a request in English but comply in another language that its filters don’t recognize. Moreover, code-switching (mixing languages or scripts) can confuse safety systems. Attackers may exploit this by inserting a few non-English words or Unicode characters to evade content filters (e.g., an English disallowed phrase spelled partially in Cyrillic). Robust guardrails must account for such multilingual evasions.

 

Finally, safety in evaluation is tricky for multilingual models. As noted in Chapter 1 (Evaluation), many benchmarks end up in training data, and this contamination can mask a model’s true behavior
arxiv.org
. This is especially true for multilingual safety benchmarks – a model might appear to handle a certain language’s toxic content well simply because it memorized the test examples. Recent work has revealed widespread test data leakage in multilingual LLM evaluation
arxiv.org
. To address this, researchers use methods like black-box permutation tests to detect contaminated benchmarks. Practitioners should similarly ensure their safety tests aren’t compromised by training data leakage (see the MEGAVERSE study’s findings on this issue
arxiv.org
).

 

Key takeaway: Multilingual LLM builders must assume that safety vulnerabilities will be language-specific. We need targeted datasets, evaluations, and mitigations for each locale, rather than expecting an English-tuned safety system to work everywhere.

## Multilingual Safety Benchmarks & Datasets

A number of new benchmarks and datasets have been introduced to measure and stress-test LLM safety across languages:

RTP-LX: “Can LLMs Evaluate Toxicity in Multilingual Scenarios?” – A human-transcreated, human-annotated corpus of over 1,000 toxic prompts (and model outputs) in 28 languages, derived from the English RealToxicityPrompts set
arxiv.org
arxiv.org
. Crucially, part of RTP-LX was crafted to include culturally specific toxic language (e.g. insults, slurs unique to a culture)
arxiv.org
. This dataset was used to evaluate 7 models’ ability to detect toxicity. The results were sobering: models achieved decent accuracy overall, but showed low agreement with human judgments on nuanced cases and struggled with context-dependent harms like microaggressions or subtle bias
arxiv.org
arxiv.org
. Even GPT-4, which led in accuracy, often failed to fully grasp harmful context that human annotators caught. RTP-LX highlights the need for culturally-aware toxicity detection rather than one-size-fits-all classifiers.

PolygloToxicityPrompts (PTP): A large-scale multilingual toxicity evaluation set of 425k naturally-occurring prompts in 17 languages
arxiv.org
. Unlike earlier benchmarks (often small or translation-based), PTP collected native toxic content from the web in many languages
arxiv.org
. This allows testing LLMs on more realistic prompts a user might actually enter. Using PTP to probe dozens of models, Jain et al. (2024) found that toxicity in model outputs increases as language resources decrease – i.e. the less data a language has, the more toxic degeneration was observed
arxiv.org
. They also noted an inverse relationship with model size: larger models can produce more toxicity unless properly aligned
arxiv.org
. Instruction tuning and RLHF did reduce toxic output rates, but interestingly the method of alignment (different preference-tuning techniques) didn’t significantly change the outcome
arxiv.org
. This suggests that simply scaling up models will not inherently solve toxicity in under-represented languages – we need better training data and safety fine-tuning for those languages.

Multilingual Jailbreak Challenge: Deng et al. (2024) compiled adversarial prompts in 10 languages to test models’ refusal mechanisms
arxiv.org
arxiv.org
. They considered two scenarios: “unintentional” – a normal user asks something in a different language that inadvertently bypasses safeguards, and “intentional” – an attacker deliberately uses multilingual inputs to break the model
arxiv.org
. In unintentional cases, they observed the rate of unsafe content shot up as language resource level went down (low-resource prompts were about 3× more likely to yield policy violations than high-resource)
arxiv.org
. In intentional attacks, mixing languages or using translation tricks led to extremely high success rates in causing disallowed outputs (81% of prompts bypassed ChatGPT’s safety)
arxiv.org
. This benchmark underscores the need to test models with multilingual red-teaming – many models that are safe in English can be jailbroken in other languages. As a remedy, the authors proposed a “Self-Defense” fine-tuning approach: automatically generate multilingual adversarial examples and fine-tune the LLM on them
arxiv.org
. A safety-tuned ChatGPT trained on this data had substantially lower unsafe output rates across languages
arxiv.org
.

AYA Redteaming (Multilingual Alignment Prism): A dataset from Cohere AI that collects human-written harmful prompts in 8 languages (English, Hindi, French, Spanish, Russian, Arabic, Serbian, Filipino), with annotations distinguishing “global” vs “local” harms
arxiv.org
arxiv.org
. Global harms are those considered unacceptable universally (e.g. explicit hate speech), while local harms depend on cultural context (e.g. religious blasphemy may be more or less harmful depending on locale). The AYA dataset (7,419 prompts total) covers 9 harm categories and was used to evaluate how well models align with both broad and culture-specific safety preferences
arxiv.org
. Such data is invaluable for examining questions like: If we align a model to a certain culture’s sensitivities, does it maintain global norms? Early findings suggest preference-based training can reduce harm across languages by ~37% on average, and aligning on “local” harms can also transfer to improvements on global harms
arxiv.org
. The AYA prompts are publicly available
arxiv.org
 and serve as a unique benchmark for cultural alignment – ensuring AI is safe and respectful in each society it serves.

All Languages Matter (ALM) Bench: A massive multilingual, multimodal benchmark introduced in 2025 to test vision-and-language models across 100 languages
github.com
mbzuai-oryx.github.io
. While not purely a “safety” dataset, ALM-Bench focuses on cultural and linguistic inclusivity in tasks like visual question answering (VQA). It covers 13 cultural aspects (heritage, customs, literature, etc.) plus generic visual skills, with 22.7k Q&A pairs manually curated by native speakers
mbzuai-oryx.github.io
mbzuai-oryx.github.io
. By evaluating state-of-the-art multimodal models on such a diverse set, researchers have exposed large performance gaps: current models perform much worse on the low-resource languages and often fail on culture-specific questions
mbzuai-oryx.github.io
mbzuai-oryx.github.io
. For safety, this implies that models might misunderstand images or questions in ways that could be offensive or harmful in those cultures. ALM-Bench’s emphasis on culturally diverse content acts as a stress test for AI behavior – it pushes models toward better cultural understanding and can reveal latent biases or blind spots. For example, if an image description in an African language consistently yields misinterpretations, it may indicate the model is not safe/reliable for that community’s use without further tuning.

!!! tip "Quick Assessment"
    Before deployment, check: How does my model respond to toxic prompts in all target languages? Will it refuse disallowed requests consistently across languages? Does it hallucinate or err more in some languages? These datasets can help get those answers.

## Open-Source Tools and Frameworks

Fortunately, the community has released several tools and frameworks to help developers assess and improve LLM safety in a multilingual context:

### 🔍 garak (Generative AI Red-teaming & Assessment Kit)

**Developer**: NVIDIA  
**Purpose**: Open-source LLM vulnerability scanner

#### Key Features:
- Suite of static and dynamic probes to "attack" your model and find failure modes
- Multilingual prompt templates for testing vulnerabilities:
    - Prompt injections
    - Jailbreaks  
    - Toxicity elicitation
    - Privacy leaks
- Adaptively generates adversarial inputs in different languages
- Programmable custom scenarios

!!! example "Use Case"
    Test if your model reveals private info when asked in French versus English

**Think of garak as**: A safety audit tool that will surface problematic behaviors before release

### 🎯 DeepEval (DeepTeam Red-Teaming Framework)

**Developer**: Confident AI  
**Purpose**: Systematic LLM red-teaming and evaluation

#### Key Features:
- Define attack scenarios and performance metrics
- Supports multilingual attacks out-of-the-box
- Automated evaluation with quantified failure rates
- Library of known red-teaming prompts
- Easy integration of new attack patterns

!!! example "Use Cases"
    - Attempt XSS injection prompts in 5 languages
    - Test political misinformation queries in multiple scripts

**Think of DeepEval as**: A safety regression test harness – re-run whenever you update your model or add a new language

## Open-Source Tools and Frameworks

Fortunately, the community has released several tools and frameworks to help developers assess and improve LLM safety in a multilingual context:

garak (Generative AI Red-teaming & Assessment Kit): An open-source LLM vulnerability scanner developed by NVIDIA
garak.ai
. Garak provides a suite of static and dynamic probes to “attack” your model and find failure modes (much like penetration testing for security)
github.com
. It includes multilingual prompt templates for testing vulnerabilities like prompt injections, jailbreaks, toxicity elicitation, privacy leaks, etc. Garak can adaptively generate adversarial inputs in different languages and analyze model responses for policy violations. Because it’s programmable, you can script custom scenarios – for example, test if your model reveals private info when asked in French versus English. Using garak early in development is like a safety audit: it will surface problematic behaviors (e.g., the model happily provides violence instructions in Spanish) so you can address them before release. Garak is available as a Python package and has integration hooks for popular LLM APIs
garak.ai
.

DeepEval (DeepTeam Red-Teaming Framework): An open-source framework by Confident AI for systematic LLM red-teaming and evaluation
trydeepteam.com
. DeepEval (often referenced with its “DeepTeam” module) lets you define attack scenarios and performance metrics, then runs your model through them in an automated way
trydeepteam.com
. It supports multilingual attacks out-of-the-box. For example, you can instruct it to attempt XSS injection prompts in 5 languages, or test political misinformation queries in multiple scripts. DeepEval also incorporates evaluation metrics to quantify how often the model fails (e.g. a “success rate” for jailbreak attempts)
trydeepteam.com
. A key feature is its library of known red-teaming prompts and the ability to plug in new ones. This makes it easier to simulate diverse adversarial user inputs without having to craft each manually. Think of DeepEval as a safety regression test harness – you can re-run the suite whenever you update your model or add a new language, to ensure no new vulnerabilities have appeared.

Do-Not-Answer Dataset & Filters: Wang et al. (2024) introduced Do-Not-Answer (DNA), a benchmark specifically to evaluate whether an LLM properly refuses inappropriate requests
github.com
. It consists of a curated set of prompts that should be answered with a refusal (covering self-harm, illicit behavior, personal data queries, etc.), and it tracks if models comply. The DNA dataset (open-sourced on Hugging Face
huggingface.co
) is useful for multilingual apps: you can translate those prompts or use similar ones in different languages to test your model’s refusal consistency. Some organizations also release “do not answer” libraries – basically lists or classifiers for questions that should trigger a safe completion. For instance, Anthropic’s latest models are trained with an internal “Constitution” of principles including not disclosing private data; DNA-style prompts help verify such rules hold across languages. When building your app, consider implementing a secondary guardrail that catches if the model’s answer should have been a refusal. This can be as simple as a keyword filter on the model’s output (checking for phrases like “I’m sorry, I cannot…” in the target language) or as complex as a separate moderation model scoring the exchange.

Multilingual Content Moderation APIs/Models: If your application will handle user-generated text, you need moderation tools that speak all necessary languages. Relying on an English-only moderation API (like OpenAI’s) will leave gaps. Projects like PolyglotAI and Perspective API offer some multilingual support, but coverage can be limited. Recently, research teams have open-sourced dedicated multilingual safety classifiers. For example, PolyGuard (2025) released a state-of-the-art safety moderation model covering 17 languages
ar5iv.org
. PolyGuard was trained on nearly 2 million multilingual examples and can detect harmful content (and even unsafe model responses) with higher accuracy than generic English-based detectors
ar5iv.org
ar5iv.org
. Such models can be run locally or via an API to flag toxic or disallowed content in any supported language. Another example is Meta AI’s Unsafe Language Detector, which supports dozens of languages for content filtering. When deploying a chatbot globally, it’s wise to integrate one of these multi-language filters as a first line of defense – for instance, check every model reply with PolyGuard and refuse output that is classified as harmful
ar5iv.org
. This approach caught many issues in practice that would slip by an English filter (e.g. extremist slogans in Indonesian). Always verify that the moderation tool itself has been evaluated on each language/dialect you need; if not, you may need to add custom rules or supplementary detection for those cases.

Libraries for Bias and Fairness Testing: Beyond toxicity, safety includes avoiding unfair bias. There are toolkits like CrowS-Pairs Multilingual (for bias in specific languages) and IBM’s AI Fairness 360, which can be adapted to evaluate bias in generated text. While not multilingual out-of-the-box, the concepts can be applied if you have or create parallel prompts representing different demographics in various languages. For example, one might test if the model’s sentiment towards a job applicant’s resume changes if the name is European vs. Arabic – and do this in French, Arabic, etc. Sociodemographic prompting (as a research method) has been used to study this: prompting the model with “As a [demographic], I think…” to see if it mirrors stereotypes. However, recent findings suggest this technique can be unreliable and sensitive to random prompt wording
arxiv.org
arxiv.org
. It turns out models (except GPT-4) varied their outputs even when given nonsense demographic cues, casting doubt on how well we can probe cultural bias via prompting alone
arxiv.org
arxiv.org
. The takeaway for practitioners is to use robust evaluation – multiple prompt methods, human review, and statistical checks – to audit for bias, rather than trusting a single “persona prompt” test.

In summary, a strong safety toolkit might involve: garak for probing weaknesses, DeepEval/DeepTeam for automating red-team tests, the DNA dataset for refusal behavior, a PolyGuard-like classifier for content moderation, and custom bias evaluations for fairness. All of these tools are continually evolving; consult their docs and communities for the latest multilingual support.

## Recent Advances in Multilingual LLM Safety

The research community has ramped up efforts to both measure and improve safety across languages. Here we highlight a few notable developments (beyond those datasets and tools already mentioned):

MEGAVERSE Benchmarking (2024): In a large-scale study, Ahuja et al. compared GPT-4, PaLM-2, Llama-2, and other models on 22 multilingual tasks, including two Responsible AI tasks (toxicity detection and bias)
ar5iv.labs.arxiv.org
. They observed that larger models (GPT-4) generally outperform smaller ones on low-resource languages
ar5iv.labs.arxiv.org
ar5iv.labs.arxiv.org
, but this gap is partly due to evaluation artifacts. Importantly, MEGAVERSE revealed that many models had likely memorized popular test sets, calling into question their true safety capabilities
arxiv.org
. The authors performed contamination testing and found that almost all the multilingual benchmarks they tried were “seen” by at least some models
arxiv.org
. For practitioners, this serves as a warning: don’t over-index on benchmark scores – a model might ace an Arabic toxicity test simply because it had those examples in training. We need new, unknown test cases (or real user trials) to genuinely evaluate multilingual safety. MEGAVERSE’s contamination analysis approach (shuffling test data to see if model performance drops) can be applied to your own evaluation to detect this issue.

sPhinX Instruction Tuning (2025): Sanchit Ahuja et al. proposed sPhinX, a method for sample-efficient multilingual fine-tuning that maintains model safety alignment
arxiv.org
arxiv.org
. They create a 51-language synthetic instruction dataset by selectively translating parts of English instructions (using GPT-4 to preserve diversity) rather than naïvely translating everything
arxiv.org
. They also introduce a technique called LANG-IT (N-shot guided prompting during fine-tuning) to inject relevant examples on the fly
arxiv.org
. The result is that relatively small models (7–13B) fine-tuned with sPhinX achieve on average ~40% better multilingual performance on tasks without catastrophic forgetting of English abilities
arxiv.org
. In other words, sPhinX was able to boost non-English skill while retaining prior alignment (the models didn’t suddenly start producing unsafe output in English, for example)
arxiv.org
. For safety, this approach is promising because it suggests we can extend a model’s multilingual competence without undoing its English safety training. Many practitioners worry that fine-tuning on new data (especially user-generated content in other languages) might degrade a model’s alignment; sPhinX demonstrates ways to mitigate that via careful data augmentation and training strategies. If you plan to fine-tune for multilingual scenarios, consider adopting similar practices – e.g. augment training data selectively and include some original alignment data in the mix to avoid forgetting.

CultureLLM (2024): Li et al. tackled the problem of cultural knowledge and biases in LLMs
arxiv.org
. They noted models favor dominant cultures due to English-centric training data. CultureLLM employs a clever data augmentation: using the World Values Survey (WVS) as seed texts and a semantic augmentation method to generate additional culturally nuanced Q&A data
arxiv.org
. With only 50 human-written seed examples per culture, they fine-tuned separate models for 9 cultural groups (covering both high- and low-resource languages) and also a unified model “CultureLLM-One”
arxiv.org
. The results on 60 culture-specific evaluation datasets showed significant gains: CultureLLM-One outperformed GPT-3.5 by ~8% and even rivaled GPT-4 on many culture questions
arxiv.org
. In practical terms, this means injecting a small amount of curated multicultural data can make your model much more culturally aware and sensitive, potentially reducing offensive mistakes or biases. CultureLLM’s approach is cost-effective and could be replicated: if your application will serve, say, Japanese and Swahili users, you might take a small set of culturally relevant texts (proverbs, common opinions, etc.), use a similar semantic augmentation to expand them, and fine-tune or prompt-train your model. This can help the model respect local norms – a critical aspect of safety (e.g. avoiding outputs that inadvertently violate social taboos). In short, cultural customization of LLMs is emerging as a viable step toward safer AI for all communities.

Sociodemographic Prompting Studies (2024): A line of research has tried to evaluate LLM biases by explicitly prompting the model with different demographic personas (age, gender, nationality, etc.). One might ask an AI math problem with the preamble “You are a 9-year-old boy in Nigeria…” versus “You are a 40-year-old woman in Japan…” and see if the correctness or style changes. If it does, that could indicate bias or at least differential behavior. However, a comprehensive study by Mukherjee et al. (2024) found that models below GPT-4 showed significant output variance even for non-cultural prompt changes, suggesting a kind of “placebo effect”
arxiv.org
arxiv.org
. In their experiments, Llama-2 and Mistral models changed their answers as much for nonsense attributes (“favorite color: blue”) as for actual cultural attributes
arxiv.org
arxiv.org
. GPT-4 was more stable, but the upshot is that we must be cautious in interpreting sociodemographic prompts. These models might not have a true internal notion of “German vs. Indian perspective” – they might just be reacting to token patterns. For application builders, this means that simply prompting your model to adjust for a user’s culture (e.g. “respond as someone from X culture”) may not reliably yield a safer or culturally-appropriate response unless the model is very advanced or explicitly trained for that. You should test such features carefully. On the flip side, if you observe your model giving inconsistent answers when you add irrelevant attributes to the prompt, that’s a red flag for prompt sensitivity which could impact safety (it may indicate the model is not robust and could be triggered by odd inputs). Robustness and consistency testing are thus part of safety evaluation.

Shiksha Copilot (2025, Microsoft Research India): This is a real-world deployment of an LLM-powered assistant for teachers in India, noteworthy for how it addressed multilingual safety and accuracy. Shiksha Copilot helps teachers generate lesson plans and quizzes in English and Kannada (a low-resource language)
themoonlight.io
. Under the hood, it uses a human-in-the-loop workflow: curriculum content is ingested and retrieved (via RAG) to ground the LLM, GPT-4 generates a draft lesson in English, it’s reviewed and corrected by human curators, then translated to Kannada by a fine-tuned model (Sarvam-1) and again human-edited for linguistic quality
themoonlight.io
themoonlight.io
. Only then are the materials distributed to teachers. This multi-stage design was chosen to ensure factual accuracy, cultural appropriateness, and linguistic clarity – essentially building guardrails at each step. Interestingly, they found the English drafts were largely reliable (96% of content blocks required no content fixes) whereas the Kannada translations needed edits in 94% of blocks
themoonlight.io
. Most Kannada issues were grammar/terminology errors from literal translation, and some factual alignment problems
themoonlight.io
. The takeaway here is twofold: (1) Localized review is essential – even with a strong base model, the localized output (Kannada) wasn’t safe to use without native-speaker correction. Automated translation alone wasn’t sufficient for a high-stakes domain like education. (2) Combining retrieval augmentation + human oversight can yield safe outcomes. After deployment, over 1,000 teachers used Shiksha Copilot, and the feedback was very positive: the AI-generated lesson plans were rated “Very Good” 85% of the time, and teachers saved on average 2 hours per week on paperwork
themoonlight.io
themoonlight.io
. This case study demonstrates a practical blueprint for multilingual LLM applications: use LLMs to generate content, but never in isolation – integrate verification steps, especially for languages where the model might be weaker. Also, tailor the pipeline for the language (Shiksha fine-tuned a translator on educational data and had separate English vs. Kannada workflows). By doing so, they avoided any major safety incidents (no reports of problematic content reaching classrooms). As you build your app, consider if a similar staged approach (draft -> review -> translate -> review) is warranted for safety-critical content.

## Conclusion: Checklist for Multilingual Safety Readiness

Building a safety-first multilingual application requires a thorough, structured approach. Below is a checklist of questions and best practices to ensure your LLM system is ready for deployment across languages:

### Essential Safety Checks

#### ✅ Evaluate Toxicity in All Target Languages

Have you run toxicity tests for each language your app supports?

**Actions to take:**
- Use benchmarks like PolygloToxicityPrompts and RTP-LX
- Create your own prompt sets with culturally relevant slurs/insults
- Measure the model's toxic output rate in each language

!!! warning "Red Flag"
    If toxicity rates are high or unknown in some language, **do not launch blind**. Mitigate by fine-tuning on detoxified data or implementing stricter moderation.

✅ Test Refusal and Jailbreak Robustness: Does the model adhere to safety instructions equally in each language? Leverage the Do-Not-Answer dataset (translated as needed) to see if the model properly refuses disallowed requests
github.com
. Conduct red-team attacks (via garak or DeepEval) for both unintentional bypass (e.g. asking a forbidden thing in another language) and intentional jailbreaks
arxiv.org
. If, say, your model refuses “How to make a bomb” in English but gives an answer in Spanish, you have a serious gap – improve training with multilingual safety data or add a rule-based filter for Spanish queries about explosives. Consider code-switched prompts too: mixed-language inputs should also be refused. Any successful jailbreak in testing is a sign to postpone deployment until fixed.

✅ Bias and Fairness Audit: Have you checked for glaring biases or hate content against particular groups in various languages? Test prompts that could trigger stereotypes (e.g. “Why are [ethnic group] ...” in different languages) and see how the model responds. Involve native speakers from different communities to review outputs for microaggressions or bias. If issues are found, you may need to fine-tune on bias-reduced data or insert debiasing prompts. Ensure your content policy covers all languages – e.g. zero tolerance for racist terms in any language – and that your model knows those policies. If the model defaults to a Western perspective in other languages (a common issue), consider injecting culturally diverse training data (as in CultureLLM) to balance it
arxiv.org
.

✅ Factual Accuracy & Hallucinations: Are you providing tools for the model to be factual across languages? Users will expect correct answers, whether in English or Thai. If your model tends to hallucinate answers about local topics, mitigate this by using Retrieval-Augmented Generation (provide a knowledge base per language) or restrict certain queries. In Shiksha Copilot, factual grounding via curriculum data was key to prevent misinformation in lesson plans
themoonlight.io
. Plan for human review in languages where you lack evaluation data on the model’s accuracy. Remember that a hallucination in a less resourced language can be harder to detect automatically (since English-trained fact checkers might not work on it). Incorporate multilingual fact-checking if available.

✅ Privacy and Data Protection: Could the model output personal data (addresses, IDs, etc.) more readily in certain languages? Ensure compliance with privacy standards like GDPR for each locale. For instance, if users might input personal info in French, does your model have a mechanism to avoid regurgitating it later? Use prompts to test this (e.g. feed a fake phone number in Italian and later ask for it). Ideally, implement a repetition block – the model should be instructed not to reveal anything verbatim from user prompts (unless it’s a valid use-case like translation). Also, verify that any integrated translation systems or APIs handle user data securely and don’t log it without consent (this is part of deployment policy, not the model itself, but crucial for safety perceptions).

✅ Content Moderation Pipeline: Is there a moderation layer for both user inputs and model outputs in every language? This could be automated (using a model like PolyGuard
ar5iv.org
 or Perspective API where available) or manual for certain high-risk content. Define action thresholds per language – e.g. you might flag any output above a certain toxicity score, and either mask it or send to a human moderator. Also prepare cultural guidelines for moderators: what counts as hate speech or extremist content can vary by region. Your safety team or policies should reflect local norms (consult experts if needed). Cross-reference your moderation results with user feedback once live; if users report offensive content that moderation missed, update your filters or model promptly.

✅ Human in the Loop: Do you have humans in the loop at appropriate stages? For high-stakes uses (medical, legal, education as with Shiksha Copilot), a human review step is strongly recommended, at least until you gain trust in the model’s multilingual performance. This might involve volunteer community translators, professional moderators, or domain experts who double-check outputs in their language. Even crowd-sourced evaluation before launch is valuable – e.g. run a beta test with speakers of each language to catch issues. Plan how users can report harmful outputs post-deployment and ensure you can respond (by correcting the model or adding new guardrails).

✅ Iterative Testing and Monitoring: Safety is not “one and done.” Set up a schedule (e.g. monthly) to re-run red-team tests on your model, especially if you update the model or its knowledge. Monitor production logs for anomalies – if suddenly a certain language starts yielding strange or unsafe answers, investigate immediately. Employ analytics: track the frequency of content violations by language. This can alert you to drift or new attack patterns. As new multilingual benchmarks and tools emerge (the field is moving fast), integrate them into your evaluation. For example, new code-switched challenge sets or dialect-specific toxicity tests might become available – use them. Consider an on-call safety engineer who is familiar with the multilingual aspects of your system to handle incidents.

By following this checklist and the guidance in this chapter, application builders can greatly enhance the safety of multilingual LLM systems. In practice, the most robust deployments use a defense-in-depth approach: multiple layers of safety (model tuning, external filters, user interface safeguards, human oversight) working together. The multilingual dimension means these defenses must be localized and validated per language – a challenging but achievable task with the right resources. Finally, always remember the ethical duty to all your users: no language community should be a second-class citizen in AI safety. Prioritize inclusive design and testing so that your AI is helpful and harmless in every tongue. (For further reading on multilingual safety and evaluation, see Yong et al. 2025
ar5iv.labs.arxiv.org
 and the ACL 2025 tutorial materials on LLM guardrails
llm-guardrails-security.github.io
llm-guardrails-security.github.io
, which offer extensive references and tools.)