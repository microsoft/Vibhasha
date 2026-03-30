## 2.6 Summary and strategic recommendations

Choosing the right multilingual strategy is not about finding a single perfect method. It is about selecting the approach that fits your languages, your users, your constraints, and your goals. This section brings together everything covered so far and translates it into practical, actionable guidance. 

These recommendations help you build multilingual systems that are accurate, culturally aligned, and ready for real-world use. 

### 2.6.1 Adopt a dynamic, layered strategy

There is no universal best choice for multilingual AI. Instead, treat multilingual work as a set of adaptable tactics. Start with the simplest approach, evaluate its strengths and weaknesses, then layer in more advanced strategies when needed.

Most teams use a combination of:

- Direct prompting for mid to high-resource languages
- Selective translation for low-resource languages
- Fine-tuning for domain depth
- Guardrails and evaluation for stability

Approaching multilingual development as a flexible ecosystem will make your system more resilient and easier to evolve over time.

### 2.6.2 Prioritize selective translation over full translation

Full translation is easy to implement, but it often weakens accuracy, tone, and cultural alignment. Selective translation offers a more balanced and reliable approach by letting you:

- Keep context in the original language
- Translate only instructions
- Let the model reason in English without distorting source content

Selective translation consistently outperforms full translation for tasks involving nuance, cultural meaning, or long-form reasoning.

Use full translation only for fast prototypes or well-supported languages.

### 2.6.3 Treat translation as a core component, not an afterthought

If translations are part of your workflow, invest in their quality. Better translation leads directly to better model performance.

Strengthen your translation pipeline by:

- Fine-tuning translation models for your domain
- Creating multilingual glossaries and terminology lists
- Adding validation steps to catch early errors
- Pairing translations with native-speaker review when possible

High-quality translation is a force multiplier for every downstream model task.

### 2.6.4 Use evaluation at multiple stages

Do not wait until the end of development to test multilingual quality. Instead, evaluate often and across languages.

Strong multilingual evaluation includes:

- Native-speaker review for high-importance tasks
- Automated checks for consistency and format
- LLM-based judging calibrated against human evaluations
- Stress tests for low-resource languages
- Safety-specific testing in every supported language

This layered approach helps you detect issues early and prevents quality regressions.

### 2.6.5 Build for safety across languages

Safety mechanisms built for English do not automatically transfer to other languages. Rates of harmful content can be significantly higher in low-resource languages, and jailbreak attempts succeed more often when prompts mix languages.

To guard against these failures:

- Test safety responses in every language
- Use multilingual adversarial prompts
- Apply cross-lingual safety filters
- Include native speakers in red-team reviews
- Avoid relying solely on English safety behavior

Safety must be implemented with cultural knowledge, not simply translated rules.

### 2.6.6 Use fine-tuning when you need cultural depth or domain accuracy

Off-the-shelf prompting and translation can get you far. But when your system must understand culturally specific expressions, specialized terminology, or regulated content, fine-tuning provides unmatched control.

Fine-tune when you need:

- Consistent brand voice
- Precise terminology
- Industry-specific knowledge
- Cultural sensitivity
- Privacy or on-prem operation

Fine-tuning smaller models with LoRA or similar methods is cost-efficient and often outperforms much larger general-purpose models on targeted tasks.

### 2.6.7 Leverage synthetic data carefully and purposefully

Synthetic data can fill gaps for low-resource languages, but it must be used thoughtfully.

Best practices include:

- Generate synthetic data with clear guidelines
- Validate with native-speaker review
- Avoid over-reliance that reinforces model bias
- Pair synthetic data with real examples when possible

Synthetic data is a supplement, not a substitute.

### 2.6.8 Document your patterns and workflows

Multilingual AI introduces complexity across prompts, languages, translation rules, evaluation, and guardrails. Documenting your decisions helps:

- Maintain consistency across teams
- Share best practices
- Avoid regressions
- Scale to new languages
- Enable fast iteration

Clear documentation becomes especially important as your multilingual system grows.

### 2.6.9 Key takeaways

- Multilingual development requires flexible, layered strategies.
- Selective translation is often the best balance of performance and cultural fidelity.
- Translation quality directly affects system quality.
- Evaluation must be multilingual, frequent, and human-in-the-loop.
- Safety must be tested across languages, not assumed from English behavior.
- Fine-tuning is essential for domain depth and cultural alignment.
- Synthetic data helps fill gaps but must be validated.
- Documentation keeps systems reliable as they scale.

These recommendations help ensure that your multilingual system remains accurate, culturally appropriate, safe, and sustainable as it expands.

---

## Next steps

!!! info "Continue Your Journey"
    
    **📊 Learn How to Evaluate Your System**  
    [Evaluation Methodologies →](/playbook/01-evaluation-overview){ .md-button }
    
    **⚙️ Explore Fine-Tuning Approaches**  
    [Fine-Tuning Strategies →](/playbook/04-fine-tuning-overview){ .md-button }
    
    **🛡️ Ensure Safety Across Languages**  
    [Safety Assessments →](/playbook/05-safety-overview){ .md-button }

---

## References

[^1]:
    (https://www.researchgate.net/publication/371536976\_Lost\_in\_Translation\_Large\_Language\_Models\_in\_Non-English\_Content\_Analysis)

[^2]:
    [https://aclanthology.org/2025.loresmt-1.9.pdf](https://aclanthology.org/2025.loresmt-1.9.pdf)

[^3]:
    (https://www.researchgate.net/publication/371536976\_Lost\_in\_Translation\_Large\_Language\_Models\_in\_Non-English\_Content\_Analysis)

[^4]:
    [https://cohere.com/research/papers/the-ai-language-gap.pdf](https://cohere.com/research/papers/the-ai-language-gap.pdf)

[^5]:
    [https://arxiv.org/html/2502.09331v1](https://arxiv.org/html/2502.09331v1)

[^6]:
    [https://arxiv.org/html/2404.11553v1](https://arxiv.org/html/2404.11553v1)

[^7]:
    [https://hai-production.s3.amazonaws.com/files/hai-taf-pretoria-white-paper-mind-the-language-gap.pdf](https://hai-production.s3.amazonaws.com/files/hai-taf-pretoria-white-paper-mind-the-language-gap.pdf)

[^8]:
    [https://www.business-humanrights.org/en/latest-news/new-report-highlights-the-shortcomings-of-large-language-models-in-analysing-non-english-content/](https://www.business-humanrights.org/en/latest-news/new-report-highlights-the-shortcomings-of-large-language-models-in-analysing-non-english-content/)

[^9]:
    [https://www.scribd.com/document/696326882/2306-07377](https://www.scribd.com/document/696326882/2306-07377)

[^10]:
    [https://policycommons.net/artifacts/4779416/kbyr-fy-thlyl-lmhtw-gyr-lfshl-fy-lttbyq/5615712/](https://policycommons.net/artifacts/4779416/kbyr-fy-thlyl-lmhtw-gyr-lfshl-fy-lttbyq/5615712/)

[^11]:
    [https://cohere.com/research/papers/translating-safety.pdf](https://cohere.com/research/papers/translating-safety.pdf)

[^12]:
    [https://www.science.co.jp/en/nmt/blog/39708/](https://www.science.co.jp/en/nmt/blog/39708/)

[^13]:
    [https://lfaidata.foundation/blog/2024/05/21/translation-augmented-generation-breaking-language-barriers-in-llm-ecosystem/](https://lfaidata.foundation/blog/2024/05/21/translation-augmented-generation-breaking-language-barriers-in-llm-ecosystem/)

[^14]:
    [https://aclanthology.org/2025.loresmt-1.9.pdf](https://aclanthology.org/2025.loresmt-1.9.pdf)

[^15]:
    [https://arxiv.org/html/2402.11537v3](https://arxiv.org/html/2402.11537v3)

[^16]:
    (https://www.google.com/search?q=https://openreview.net/pdf%3Fid%3DmpTIzK4Zca)

[^17]:
    [https://arxiv.org/html/2406.15625v1](https://arxiv.org/html/2406.15625v1)

[^18]:
    [https://pmc.ncbi.nlm.nih.gov/articles/PMC11783891/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11783891/)

[^19]:
    [https://www.leewayhertz.com/comparison-of-llms/](https://www.leewayhertz.com/comparison-of-llms/)

[^20]:
    [https://medium.com/@vbsowmya/multilingual-evaluations-in-llms-a-comparison-1d58b0fd9848](https://medium.com/@vbsowmya/multilingual-evaluations-in-llms-a-comparison-1d58b0fd9848)

[^21]:
    [https://aclanthology.org/2024.findings-acl.559/](https://aclanthology.org/2024.findings-acl.559/)

[^22]:
    [https://www.g2.com/compare/azure-translator-text-api-vs-deepl](https://www.g2.com/compare/azure-translator-text-api-vs-deepl)

[^23]:
    [https://arxiv.org/abs/2402.04177](https://arxiv.org/abs/2402.04177)

[^24]:
    ([https://openreview.net/forum?id=vPOMTkmSiu](https://openreview.net/forum?id=vPOMTkmSiu))

[^25]:
    (https://openreview.net/pdf?id=vPOMTkmSiu)

[^26]:
    [https://arxiv.org/html/2508.05266v1](https://arxiv.org/html/2508.05266v1)

[^27]:
    [https://arxiv.org/html/2502.09331v1](https://arxiv.org/html/2502.09331v1)

[^28]:
    [https://aclanthology.org/2024.americasnlp-1.25.pdf](https://aclanthology.org/2024.americasnlp-1.25.pdf)

[^29]:
    [https://medium.com/@vishal025/investigating-techniques-for-adapting-llms-to-work-effectively-in-low-resource-languages-and-ba3037b2567b](https://medium.com/@vishal025/investigating-techniques-for-adapting-llms-to-work-effectively-in-low-resource-languages-and-ba3037b2567b)

[^30]:
    [https://arxiv.org/html/2411.11295v1](https://arxiv.org/html/2411.11295v1)

[^31]:
    [https://aclanthology.org/2024.lrec-main.1362.pdf](https://aclanthology.org/2024.lrec-main.1362.pdf)

[^32]:
    [https://arxiv.org/html/2409.04512v1](https://arxiv.org/html/2409.04512v1)

[^33]:
    [https://arxiv.org/abs/2409.04512](https://arxiv.org/abs/2409.04512)

[^34]:
    [https://slator.com/translating-input-in-prompts-improves-llm-performance-for-low-resource-languages/](https://slator.com/translating-input-in-prompts-improves-llm-performance-for-low-resource-languages/)

[^35]:
    [https://aclanthology.org/2023.emnlp-main.163.pdf](https://aclanthology.org/2023.emnlp-main.163.pdf)

[^36]:
    (https://www.researchgate.net/publication/391878863\_Multilingual\_Prompt\_Engineering\_in\_Large\_Language\_Models\_A\_Survey\_Across\_NLP\_Tasks)

[^37]:
    [https://www.researchgate.net/publication/386436285\_Multilingual\_Prompting\_in\_LLMs\_Investigating\_the\_Accuracy\_and\_Performance](https://www.researchgate.net/publication/386436285_Multilingual_Prompting_in_LLMs_Investigating_the_Accuracy_and_Performance)

[^38]:
    [https://www.promptingguide.ai/](https://www.promptingguide.ai/)

[^39]:
    [https://www.educative.io/blog/prompt-engineering-vs-fine-tuning](https://www.educative.io/blog/prompt-engineering-vs-fine-tuning)

[^40]:
    [https://lilt.com/blog/tips-to-write-effective-llm-prompts-and-generate-multilingual-content](https://lilt.com/blog/tips-to-write-effective-llm-prompts-and-generate-multilingual-content)

[^41]:
    [https://aws.amazon.com/blogs/machine-learning/evaluate-large-language-models-for-your-machine-translation-tasks-on-aws/](https://aws.amazon.com/blogs/machine-learning/evaluate-large-language-models-for-your-machine-translation-tasks-on-aws/)

[^42]:
    [https://aws.amazon.com/what-is/prompt-engineering/](https://aws.amazon.com/what-is/prompt-engineering/)

[^43]:
    [https://openreview.net/pdf/e05ca9c349ec663d29b9130dd3c9b74469b2bb2e.pdf](https://openreview.net/pdf/e05ca9c349ec663d29b9130dd3c9b74469b2bb2e.pdf)

[^44]:
    [https://aclanthology.org/2024.findings-emnlp.108.pdf](https://aclanthology.org/2024.findings-emnlp.108.pdf)

[^45]:
    [https://aclanthology.org/2023.paclic-1.1.pdf](https://aclanthology.org/2023.paclic-1.1.pdf)

[^46]:
    [https://arxiv.org/html/2502.04134v2](https://arxiv.org/html/2502.04134v2)

[^47]:
    [https://arxiv.org/html/2505.11665v1](https://arxiv.org/html/2505.11665v1)

[^48]:
    [https://www.ibm.com/think/topics/large-language-models](https://www.ibm.com/think/topics/large-language-models)

[^49]:
    (https://www.youtube.com/watch?v=H0FMsRZ7f\_A)

[^50]:
    [https://aclanthology.org/2024.acl-long.671.pdf](https://aclanthology.org/2024.acl-long.671.pdf)

[^51]:
    [https://academic.oup.com/pnasnexus/article/3/9/pgae346/7756548](https://academic.oup.com/pnasnexus/article/3/9/pgae346/7756548)

[^52]:
    [https://mbzuai.ac.ae/news/what-llms-get-wrong-about-culture-and-how-to-fix-them-two-studies-from-naacl/](https://mbzuai.ac.ae/news/what-llms-get-wrong-about-culture-and-how-to-fix-them-two-studies-from-naacl/)

[^53]:
    [https://arxiv.org/html/2505.15229v1](https://arxiv.org/html/2505.15229v1)

[^54]:
    [https://mbzuai.ac.ae/news/culture-and-bias-in-llms-defining-the-challenge-and-mitigating-risks/](https://mbzuai.ac.ae/news/culture-and-bias-in-llms-defining-the-challenge-and-mitigating-risks/)

[^55]:
    [https://arxiv.org/html/2407.16891](https://arxiv.org/html/2407.16891)

[^56]:
    [https://pmc.ncbi.nlm.nih.gov/articles/PMC11097685/](https://pmc.ncbi.nlm.nih.gov/articles/PMC11097685/)

[^57]:
    (https://www.neurology.org/doi/10.1212/WNL.0000000000209497)

[^58]:
    [https://www.reddit.com/r/LocalLLaMA/comments/1fbkbu6/prompting\_in\_multilingual\_models/](https://www.reddit.com/r/LocalLLaMA/comments/1fbkbu6/prompting_in_multilingual_models/)

[^59]:
    [https://arxiv.org/html/2403.02567v1](https://arxiv.org/html/2403.02567v1)

[^60]:
    [https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/](https://www.parloa.com/knowledge-hub/prompt-engineering-frameworks/)

[^61]:
    [https://arxiv.org/html/2406.01771v1](https://arxiv.org/html/2406.01771v1)

[^62]:
    [https://www.superannotate.com/blog/llm-fine-tuning](https://www.superannotate.com/blog/llm-fine-tuning)

[^63]:
    [https://developer.nvidia.com/blog/improving-translation-quality-with-domain-specific-fine-tuning-and-nvidia-nim/](https://developer.nvidia.com/blog/improving-translation-quality-with-domain-specific-fine-tuning-and-nvidia-nim/)

[^64]:
    [https://medium.com/@hastur/embracing-ai-in-localization-a-2025-2028-roadmap-a5e9c4cd67b0](https://medium.com/@hastur/embracing-ai-in-localization-a-2025-2028-roadmap-a5e9c4cd67b0)

[^65]:
    [https://www.datacamp.com/tutorial/fine-tuning-large-language-models](https://www.datacamp.com/tutorial/fine-tuning-large-language-models)

[^66]:
    [https://www.mdpi.com/2227-7390/12/19/3149](https://www.mdpi.com/2227-7390/12/19/3149)

[^67]:
    [https://aclanthology.org/2024.acl-long.192/](https://aclanthology.org/2024.acl-long.192/)

[^68]:
    (https://www.jmir.org/2025/1/e71521/PDF)

[^69]:
    [https://arxiv.org/html/2411.11295v1](https://arxiv.org/html/2411.11295v1)

[^70]:
    [https://arxiv.org/abs/2410.07054](https://arxiv.org/abs/2410.07054)

[^71]:
    [https://aclanthology.org/2024.emnlp-main.879.pdf](https://aclanthology.org/2024.emnlp-main.879.pdf)

[^72]:
    [https://www.cs.cmu.edu/\~alavie/papers/GALE-book-Ch5.pdf](https://www.cs.cmu.edu/~alavie/papers/GALE-book-Ch5.pdf)

[^73]:
    [https://aclanthology.org/2023.acl-long.730.pdf](https://aclanthology.org/2023.acl-long.730.pdf)

[^74]:
    [https://arxiv.org/html/2306.13041v2](https://arxiv.org/html/2306.13041v2)

[^75]:
    [https://aclanthology.org/2024.emnlp-main.214.pdf](https://aclanthology.org/2024.emnlp-main.214.pdf)

[^76]:
    [https://imminent.translated.com/llm-based-machine-translation](https://imminent.translated.com/llm-based-machine-translation)

[^77]:
    [https://arxiv.org/html/2502.14338v4](https://arxiv.org/html/2502.14338v4)

[^78]:
    [https://alwaseemtranslation.com/cultural-nuances-in-translation/](https://alwaseemtranslation.com/cultural-nuances-in-translation/)

[^79]:
    [https://unbabel.com/5-cultural-nuances-when-writing-for-machine-translation/](https://unbabel.com/5-cultural-nuances-when-writing-for-machine-translation/)

[^80]:
    [https://www.appen.com/blog/ai-translation-preserving-cultural-nuance](https://www.appen.com/blog/ai-translation-preserving-cultural-nuance)

[^81]:
    [https://translated.com/resources/the-impact-of-cultural-nuances-on-machine-translation/](https://translated.com/resources/the-impact-of-cultural-nuances-on-machine-translation/)

[^82]:
    [https://ad-astrainc.com/blog/the-impact-of-cultural-nuances-on-translation-accuracy](https://ad-astrainc.com/blog/the-impact-of-cultural-nuances-on-translation-accuracy)

[^83]:
    [https://www.richtmann.org/journal/index.php/ajis/article/download/13705/13265/47218](https://www.richtmann.org/journal/index.php/ajis/article/download/13705/13265/47218)

[^84]:
    [https://www.scheduleinterpreter.com/ai-translation-white-papers.html](https://www.scheduleinterpreter.com/ai-translation-white-papers.html)

[^85]:
    [https://www.reddit.com/r/LocalLLaMA/comments/1lklzav/tips\_that\_might\_help\_you\_using\_your\_llm\_to\_do/](https://www.reddit.com/r/LocalLLaMA/comments/1lklzav/tips_that_might_help_you_using_your_llm_to_do/)



Beyond English: The Impact of Prompt Translation Strategies across Languages and Tasks in Multilingual LLMs - https://aclanthology.org/2025.findings-naacl.73/


