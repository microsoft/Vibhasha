## Model Selection

### Model Architecture

Model architecture provides varying accuracy, latency, and adaptability to finetuning. Model architecture determines how the model processes audio and text. Different architectures vary in accuracy, latency, and adaptability to fine-tuning. Choosing the right one ensures better performance for your use case.

#### Traditional Hybrid Systems
This approach dominated the field for many years, and it breaks down the ASR tasks into several distinct layers with each layer being a separate trained model.  
They typically use Hidden Markov Models (HMMs) to model the sequence of speech, with the output probabilities predicted by Gaussian Mixture Models or, more recently, Deep Neural Networks (DNNs) (e.g., HMM-DNN hybrid systems).

#### End-to-End Systems

- **Connectionist Temporal Classification (CTC):**  
  This is an encoder-only model with outputs character predictions per frame.

- **Recurrent Neural Network Transducer (RNN-T):**  
  This uses an Encoder—which is a transcription network—and a prediction network. It outputs sequences of labels terminated by a blank symbol.

- **Recurrent Neural Aligner (RNA):**  
  It generalises the RNN-T by incorporating the exact alignment frames of previous non-blank labels into its prediction state.

- **Attention-based Encoder-Decoder (AED) / Listen, Attend and Spell (LAS) / Transformer-based Architectures (e.g., CTC/RNN-T with Transformer Encoder):**  
  This architecture uses an Encoder (Listener) and a sequence-generating Decoder (Speller). The decoder uses an attention mechanism to generate a context vector by calculating the weighted sum over all encoder outputs to predict the next output symbol.

- **Conformer:**  
  This is a Convolution-Augmented Transformer block that combines self-attention (for global context) with convolution (for local feature extraction).

---

### Model Size

Larger models often achieve higher accuracy but require more compute and memory. Smaller models are faster and cheaper but may compromise accuracy.

| Model                                         | Size (parameters) | Minimum Compute |
|-----------------------------------------------|-------------------|-----------------|
| [ibm-granite/granite-speech-3.3-8b](https://huggingface.co/ibm-granite/granite-speech-3.3-8b)         | 8B               |                 |
| [microsoft/Phi-4-multimodal-instruct](https://huggingface.co/microsoft/Phi-4-multimodal-instruct)     | 5.6B             |                 |
| [ibm-granite/granite-speech-3.3-2b](https://huggingface.co/ibm-granite/granite-speech-3.3-2b)         | 2B               |                 |
| [openai/whisper-large-v3](https://huggingface.co/openai/whisper-large-v3)                             | 2B               |                 |
| [nvidia/parakeet-tdt-0.6b-v2](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v2)                     | 0.6B             |                 |
| [openai/whisper-medium](https://huggingface.co/openai/whisper-medium)                                 | 0.8B             |                 |
| [openai/whisper-small](https://huggingface.co/openai/whisper-small)                                   | 0.2B             |                 |

---

### Model Licenses

Licensing dictates how you can use, modify, and distribute the model. Some licenses are permissive for commercial use while others restrict use as defined in the license. License compliance is paramount and should be dictated by potential model use.  
- See https://choosealicense.com/ for more information and examples.

---

### Language Robustness

- **Language detection, languages trained on, multilingual support:**  
  Selecting a model with more language support—especially for low resource languages—allows the model to learn and adapt to the new language faster than if the language characteristics do not exist in the base model supported languages. It can also allow better parameter-efficient finetuning.
- When considering low resource languages, a model with robust language detection and with multilingual support offers better capability and robustness to code-mixing and code-switching.

---

### Dataset Size

The size and quality of the dataset used for pre-training influence model generalisation. Models trained on large, diverse datasets typically perform better across varied accents and domains. For low resource languages, dataset limitation may influence model selection based on the language robustness or proximities the model has to the language of use.  
- #dataset-preprocessing-for-asr

---

### Available Compute & Compute Requirements

Matching the model’s compute requirements with your available infrastructure helps estimate reasonable training time and avoids bottlenecks and cost overruns. Look out for the model card minimum compute requirements.

---

### Community Support – Code Availability & Troubleshooting

Strong community support means better documentation, pre-built code scripts, and active forums for troubleshooting, which enables active knowledge sharing. As ecosystems evolve, tools and plugins to improve the existing models accelerate development and reduce the risk of getting stuck. Also, active discussions and community reviews help validate the quality of code and models, significantly reducing the risk of taking up poorly maintained solutions.  
For example, https://huggingface.co/docs/transformers/index has strong community support, tutorials, and pre-built scripts for ASR.

**Examples of communities:**
- [Phi-4 community discussion](https://huggingface.co/microsoft/Phi-4-multimodal-instruct/discussions)
- [Whisper community discussion](https://huggingface.co/openai/whisper-large-v3/discussions)

---

### Capabilities – Diarization, Noise Robustness, Punctuation Restoration, Timestamp Prediction

Beyond transcription, some models offer more robustness on key features like speaker diarization, punctuation restoration, or noise robustness.  
Most ASR models do not support speaker diarization out of the box. [pyannote-audio](https://github.com/pyannote/pyannote-audio) is a well-supported Python open-source toolkit that supports speaker diarization with easy integration to existing models. Existing ASR leaderboards do not showcase benchmarks on the majority of these features and primarily focus on ASR metrics such as word/character error rate (WER/CER) as well as performance across languages and long-form audios. To evaluate model robustness to these capabilities, running a zero-shot evaluation with your dataset on these features across various models is a best practice to determine model selection.