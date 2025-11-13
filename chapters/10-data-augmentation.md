## Dataset Augmentation
> Add intro here

### SpecAugment

SpecAugment is a simple yet powerful method that augments speech data directly in the feature space by warping time and masking parts of the spectrogram. This approach forces your ASR model to learn more robust representations, especially when local acoustic cues are missing. It’s easy to implement, requires minimal tuning, and has shown to consistently improve word error rates (WER) on standard benchmarks. Consider combining it with other augmentation methods for even better results.

- [SpecAugment Publication](https://arxiv.org/abs/1904.08779)
- [Copy Code](to do)

assets/specaugment.png
---

### Adopt mix-speech augmentation for low-resource scenarios

MixSpeech blends two utterances at the feature level and optimises the model using a weighted sum of their recognition losses. This injects a contrastive signal that helps the model generalise better, especially when training data is scarce. Mix-style augmentation is straightforward to tune and can outperform the masking-only approach in low-resource settings.

- [Read the Paper](https://arxiv.org/abs/2102.12664)
- [Copy Code](to do)

assets/mix-style-augmentation.png

---

### Enhance code-switching ASR with targeted augmentation

For code-switching tasks, enrich your training data by splicing audio segments from different languages or generating synthetic code-switched utterances using text-to-speech (TTS). These strategies create more realistic code-switching patterns and, when combined with SpecAugment, can significantly reduce WER compared to using masking alone.

- [Read the Paper](to do)
- [Copy Code](to do)
assets/mix-style-augmentation.png

assets/code-switching-augmentation.png

---

### Acoustic diversity for out-of-domain robustness

Explicitly increasing acoustic diversity—such as varying pitch, amplitude, and vowel duration—during pretraining leads to models that are more robust to accents, children’s speech, and other out-of-distribution (OOD) conditions. These acoustic perturbations have a greater impact on OOD performance than linguistic diversity alone and can yield substantial WER reductions.

- [Read the Paper](https://arxiv.org/pdf/2505.20606)
- [Copy Code](https://arxiv.org/pdf/2505.20606)

assets/acoustic-diversity-augmentation.png

---

### Leverage unsupervised TTS for accented speech recognition

When working with accented speech, train an unsupervised TTS model on available accented audio to generate large amounts of synthetic, accent-conditioned speech. Fine-tuning your ASR model with this data can improve recognition accuracy on accented benchmarks without sacrificing performance on standard datasets.

- [Read the Paper](to do)
- [Copy Code](to do)

assets/unsupervised-tts-accented-speech.png