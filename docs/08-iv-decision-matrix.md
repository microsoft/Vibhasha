## Fine-Tuning Decision Tree for Low-Resource Languages

This decision tree helps select the appropriate fine-tuning strategy based on project requirements, leveraging the strengths of different models and techniques.

---

### Start: Low-Resource Language ASR Project

1. **Are computational resources or memory constrained?**
    - **YES** → Proceed to **Parameter-Efficient Tuning (PEFT) Path**.
    - **NO** → Proceed to **General Fine-Tuning Path**.

---

### Parameter-Efficient Tuning (PEFT) Path (Focus on Efficiency and LRL Robustness)

1A. **Is robustness across thousands of languages and speed of convergence the highest priority?**  
(e.g., building a rapid, broad coverage multilingual system)
   - **YES** → Select **MMS (Massive Multilingual Speech) Adapter Fine-Tuning**.
     - *Rationale*: MMS Adapter training is strongly recommended for LRLs, offering superior robustness, memory efficiency, and faster convergence (e.g., < 30 minutes) compared to models requiring full fine-tuning. Adapters are language-specific and minimally invasive (approx. 2.5M weights per language).
     - *Recommendation*: Use [LoRA](https://arxiv.org/abs/2106.09685) or Language-Specific Adapters and Heads (LSAH) applied to the base model (e.g., mms-1b-all). Consider Partial Fine-Tuning of key upstream layers if performance gains are needed (e.g., middle layers of MMS-1B showed optimal performance).
   - **NO** → Select **LLM/Encoder-Decoder PEFT** (e.g., [Whisper](https://huggingface.co/openai/whisper-large-v3)/[Phi-4](https://huggingface.co/microsoft/Phi-4-multimodal-instruct)).
     - *Rationale*: Use LoRA/PEFT on a supervised pre-trained model like Whisper or a lightweight multimodal model like Phi-4 for efficiency while retaining strong generalization benefits.
     - *Recommendation*: Apply LoRA to the model (e.g., Phi-4). Proceed to Step 2A (Data Handling) to preserve key capabilities like segmentation.

---

### General Fine-Tuning Path (Focus on Performance and Specific Capabilities)

1B. **Is the target task ASR (Speech-to-Text)?**
   - **YES** → Proceed to **Model Selection** (Whisper vs. MMS/CTC).
   - **NO** → (The playbook primarily focuses on ASR/AST/LID/TTS; other tasks are not comprehensively covered in this playbook.)

1C. **Is maintaining segmentation (timestamp prediction) for long-form audio critical?**  
(e.g., for subtitling)
   - **YES** → Select **Whisper** or Speech-Aware LLM.
     - *Rationale*: Encoder-decoder models like Whisper inherently handle sequence-to-sequence mapping and segmentation. The drawback is that standard fine-tuning on short, sentence-level LRL data risks losing these segmentation capabilities.
     - *Recommendation*: Use Whisper (LoRA/PEFT recommended for efficiency, as in Step 1A) or a speech-aware LLM like Granite-speech (if focusing on languages it supports, or leveraging its methodology). Proceed immediately to Step 2A (Data Handling).
   - **NO** → Select **MMS/CTC-based model**.
     - *Rationale*: If timestamps are not critical, CTC-based models fine-tuned with adapters (MMS) are highly effective and data-efficient for LRL ASR.

---

### 2A. Data Handling and Augmentation (Critical for LRLs)

2. **Is the available labeled data primarily short (sentence-level) or is the dataset size small (few-shot)?**
   - **YES** → Implement Data Generation Pipeline & Augmentation.
     - *If using Whisper/LLM (to prevent segmentation forgetting)*: Synthetically generate long-form audio by concatenating short sentences. Incorporate techniques such as Voice Activity Detection (VAD) for timestamp correction, controlled silence overlap, and speaker retention (if speaker IDs available) to simulate realistic speech patterns.
     - *If few-shot (very limited data)*: Augment the official training set with additional data from public multilingual corpora (e.g., [Common Voice](https://commonvoice.mozilla.org/en/datasets)) for underperforming languages to boost performance and robustness.
   - **NO** → Use the existing labeled data, ensuring proper cleaning and normalization (e.g., removing special characters, normalizing case, handling specific scripts/transliteration like https://github.com/isi-nlp/uroman for acoustic models).

3. **Does the training data cover diverse speakers or dialects, or is the model prone to overfitting?**
   - **YES** → Apply Regularization Techniques.
     - *Recommendation*: Use an auxiliary loss function, such as LID Connectionist Temporal Classification (CTC) loss, during fine-tuning. This regularizes the model and enhances generalization, particularly on unseen dialects.
     - Also apply standard data augmentation techniques like [SpecAugment](https://arxiv.org/abs/1904.08779).
   - **NO** → Proceed to final step.

---

### Final Step: Train and Evaluate

- Train the selected model using optimal hyperparameters (e.g., LoRA rank 16 for MMS; linear warm-up/decay schedule).
- **Crucial Evaluation Step for LRL:** Evaluate performance not only on in-distribution test sets (e.g., sentence-level test split) but also explicitly on out-of-distribution (OOD) or real-world long-form audio (using metrics like SubER or testing timestamp prediction) to ensure robust generalization.