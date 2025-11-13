## Parameter-Efficient Methods: Layer Freezing and LoRA Techniques

Parameter-efficient methods enable large models to adapt effectively without retraining the entire network. The focus here is on reducing the number of trainable parameters or selectively unfreezing layers in pretrained foundational models.

### Layer Freezing

Layer freezing (or partial fine-tuning) is used when the pretrained model already provides strong representations. Most layers are kept frozen while only the output projection or top encoder layers are trained. This reduces computational cost and memory usage, making it well-suited for domain adaptation tasks or scenarios with limited training data.

- **phi-4-multimodal:** Since it is not natively an ASR model, freezing the majority of its layers and fine-tuning only a lightweight speech adapter or projection head enables efficient cross-modal transfer without disrupting its core capabilities.
- **Wav2Vec 2.0:** Layer freezing is commonly used to retain the powerful self-supervised audio representations learned during pretraining. Fine-tuning only the final transformer layers or the output classifier significantly reduces training time and overfitting, especially when labelled data is scarce.
- **Whisper:** Layer freezing is useful, especially when adapting to new domains or accents. By freezing the encoder and decoder layers and fine-tuning only the final projection or language-specific heads, Whisper can be efficiently adapted to new ASR domains or accents while preserving its robust multilingual and multitask capabilities.

### LoRA

[Low-Rank Adaptation (LoRA)](https://arxiv.org/abs/2106.09685) and adapter-based methods allow rapid adaptation across domains or languages by freezing the base model and introducing a small number of trainable parameters, such as low-rank matrices or lightweight bottleneck layers. These techniques retain the advantages of the pretrained model while enabling efficient fine-tuning, making them particularly useful for multilingual ASR and resource-constrained environments.

- **phi-4-multimodal:** LoRA can be used to inject trainable low-rank matrices into the attention layers of the model, enabling it to learn speech-text alignment or audio-conditioned generation with minimal parameter updates.
- **Whisper:** LoRA enables the model to adapt to new languages or noisy environments by injecting small trainable modules into its transformer layers. This allows for rapid fine-tuning with minimal computational overhead.
- **Wav2Vec 2.0:** LoRA modules can be inserted into the transformer blocks to enable efficient domain adaptation, such as switching from broadcast speech to conversational audio. This approach allows the model to learn new acoustic patterns without modifying the core encoder, preserving generalisation.
- **MMS adapters:** This approach involves inserting small, trainable modules (adapter layers) between the pre-existing layers of a Massive Multilingual Speech (MMS) model, keeping the original base model frozen. Careful selection of layers to unfreeze can be performed. For example, studies with the Facebook MMS model showed that finetuning in the middle layers (e.g., layers 13–24 or 25–36) produced better performance than training on top or bottom models. ([MMS adapters reference](https://huggingface.co/blog/mms_adapters))