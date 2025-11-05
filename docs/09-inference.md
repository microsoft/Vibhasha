## Inference

### ASR Evaluation Metrics

Clearly defining benchmarking objectives is essential. These typically include:
- Assessing how well the pretrained model performs on the target language or domain using standard metrics such as **Word Error Rate (WER)** and **Character Error Rate (CER)**
- Measuring latency or real-time performance
- Conducting a qualitative review of failure cases to identify common error patterns.

---

### Benchmarking Pre-Training

Pre-training or pre-fine-tuning benchmarking establishes the **baseline performance** of a pretrained ASR model on the target dataset or domain. This step provides a crucial reference point for evaluating the impact of subsequent training or adaptation, helping to determine whether further optimisation is necessary, which aspects to prioritise, and how much improvement future training cycles achieve.

- The benchmark dataset should consist of samples held out from the fine-tuning or training split.
- It should be diverse and representative, covering a range of speakers, accents, acoustic conditions, and speaking styles to ensure that the baseline accurately reflects real-world performance.

---

### Evaluation Post-Training

Post-training or post-fine-tuning evaluation measures how effectively the training process improved model performance compared to the initial benchmark. It validates the success of the adaptation, identifies remaining weaknesses, and informs future optimisation cycles.

- The objective is to quantify performance improvements using the same metrics applied during benchmarking.
- A key evaluation also: detect signs of **catastrophic forgetting**, especially if the model was fine-tuned on a new language or domain, or conduct manual analysis to understand failure modes.
- Supplement your evaluation with samples from high resource languages.

Evaluation is done by using the same held-out benchmark set used before training to ensure comparability. Additional testing on out-of-domain samples may also be included to assess generalisation and robustness.

The results should include:
- Before-and-after metrics (e.g., WER, CER, and latency)
- Examples of improved and degraded samples
- Insights into error trends
- Recommendations for further optimisation such as additional fine-tuning, data augmentation, or multi-domain training.

---

### Human Centred Evaluation

Unlike training data, evaluation datasets should retain features like pauses and natural speech variations—such as hesitations, background noise, overlapping speech, and varying speech rates—to better test model performance. Evaluation on the test split is not sufficient as this dataset highly mimics the training set and is not sufficient to evaluate model robustness to real world settings.

To develop a human centred evaluation:
- Curate a dataset that reflects real-world scenarios in the target language. This may include code-mixed with other languages, noisy, overlapping speech, hesitations, and captures more accents.
- Capture language variations including accent diversity across regions and domain-specific data across speakers, multi-speaker data.
- Usecase evaluation.
- Where possible, conduct a user study to test the model's performance—measure the key metrics defined above. This will also create a gold standard evaluation dataset for model assessment.
- Other model capabilities can be evaluated using this dataset such as diarization, noise robustness, and timestamp prediction.