## 1.1 Core evaluation methodologies

<!-- Assessing LLMs requires a multifaceted approach that combines the irreplaceable insights of human judgment with the scalability of automated systems. This section delineates the primary methodologies for LLM evaluation, highlighting their strengths, practical considerations, and inherent complexities in multilingual and multicultural settings.


### Three Main Approaches to LLM Evaluation -->

A strong multilingual evaluation program uses multiple approaches. Each method brings unique strengths and helps balance the weaknesses of the others. 

!!! info "Evaluation Approaches Overview"

    **1. Automated Benchmarking** Automated benchmarks provide fast, reproducible scores for specific tasks such as question answering, classification, or summarization. They are useful for: 

    - Comparing models 
    - Tracking progress over time 
    - Running large-scale tests 
    
    However, automated scores must be interpreted carefully. They do not fully represent quality, and their reliability decreases in low-resource languages. 

    **2. Human-as-a-Judge** Human evaluation remains the gold standard. Native speakers can assess: 

    - Fluency 
    - Adequacy 
    - Cultural alignment 
    - Tone and style 
    - Factual accuracy 
    - Safety concerns 

    Human evaluation is more time-consuming, but it is essential for high-stakes applications, culturally sensitive content, or low-resource languages where automated metrics are unreliable. 

    **3. Model-as-a-Judge** Using an LLM to evaluate another LLM has become more common. When calibrated against human judgments, LLM-as-a-judge evaluation can help: 

    - Scale large datasets
    - Provide quick comparisons 
    - Measure subjective qualities such as helpfulness or clarity 

    However, it introduces risks such as model bias, verbosity bias, and overgeneralization. It should always be validated using human data. 

!!! success "Learn More"
    For an in-depth exploration of these evaluation paradigms and their philosophical implications, see [LLM Evaluation: Why, What, and How](https://huggingface.co/blog/clefourrier/llm-evaluation) by Clémentine Fourrier at Hugging Face.

### 1.1.1 Automated benchmark evaluation: standardized assessment

!!! info "Why Automated Benchmarks Matter"
    Automated benchmarks provide **standardized, reproducible, and scalable** evaluation of LLM performance across well-defined tasks. They enable consistent comparison across models and are essential for tracking training progress and non-regression testing.

Automated benchmarking evaluates models on predefined datasets with established metrics, offering objective performance measurements across various capabilities—from question answering and reasoning to language understanding and generation.

#### Discovering datasets for your language and domain

Finding appropriate evaluation datasets is the first critical step in automated benchmarking, especially for multilingual and domain-specific applications. When selecting benchmarks, prioritize those that most closely match the target application you are building. For example, if your application is a chatbot that answers user questions, a question-answering benchmark will be more informative than a summarization benchmark, even if it does not perfectly capture your scenario. Aligning benchmark tasks with your real-world use case gives you a much more reliable signal of how the model will actually perform in production.

!!! success "Starting Point: LM Evaluation Harness"
    The [EleutherAI LM Evaluation Harness](https://github.com/EleutherAI/lm-evaluation-harness), [Hugging Face LightEval](https://github.com/huggingface/lighteval) are excellent starting point for discovering and running benchmarks. [Open Benchmark Index](https://huggingface.co/spaces/OpenEvals/open_benchmark_index) is a good starting point for discovering evaluation datasets by language, task, and domain. 