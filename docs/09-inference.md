## Inference

### ASR Evaluation Metrics
The standard metrics for measuring perfomance of ASR models are **Word Error Rate (WER)** and **Character Error Rate (CER)**. Defining evaluation objectives is essential. Ontop of the evaluation metrics, these can include:

- Assessing how well the pretrained model performs on the target language and/or the domain 
- Measuring **latency** or real-time performance
- Assessing other capabilities such as **Language Identification(LID)**
- Assessing model robustness to code-mixing & code-switching
- Conducting a qualitative analysis of failure modes to identify common error patterns.

---

### Benchmarking Pre-Training

Pre-training or pre-fine-tuning benchmarking establishes the **baseline performance** of a pretrained ASR model on the target dataset or domain. This step provides a crucial reference point for evaluating the impact of subsequent training or adaptation, helping to determine whether further optimisation is necessary, which aspects to prioritise, and how much improvement future training cycles achieve.

- The benchmark dataset should consist of samples held out from the fine-tuning or training split.
- It should be diverse and representative, covering a range of speakers, accents, acoustic conditions, and speaking styles to ensure that the baseline accurately reflects real-world performance.

---

### Evaluation Post-Training

Post-training or post-fine-tuning evaluation measures how effectively the training process improved model performance compared to the initial benchmark. It validates the success of the adaptation, checks whether poor perfomance was introduced to pre-trained languages, and informs future optimisation cycles.

- The objective is to quantify performance improvements using the same metrics applied during benchmarking.
- Supplement your evaluation with samples from high resource languages to detect signs of **catastrophic forgetting**, especially if the model was fine-tuned on a new language or domain. 

Evaluation is best done using the same held-out benchmark dataset used to ensure comparability. Additional testing on out-of-domain samples may also be included to assess generalisation and robustness.

The results should include:
- Before-and-after metrics (e.g., WER, CER, and latency)
- Examples of improved and degraded samples
- Insights into error trends
- Recommendations for further optimisation such as additional fine-tuning, data augmentation, or multi-domain training.

---

### Human Centred Evaluation

Unlike training data, evaluation datasets should retain natural speech features and variations—such as hesitations, background noise, overlapping speech, pauses and varying speech rates—to better test model performance. Evaluating ASR models on the test split is not sufficient to measure the model robustness to real world settings as this dataset split highly mimics the training set

To develop a human centred evaluation:
- Curate a dataset that reflects real-world scenarios in the target language. This may include code-mixed with other languages, more accents asnd including natural speech variations mentioned above
- Capture language variations including accent diversity across regions
- When adapting the model to a domain, conduct a usecase evaluation in the domain across speakers
- Include multi-speaker data to measure diarization
- Where possible, conduct a user study to test the model's performance on the key metrics including the qualitative measures as well. This will also create a gold standard evaluation dataset for model assessment.
- Other model capabilities can be evaluated using this dataset such as language identification, noise robustness, and timestamp prediction.