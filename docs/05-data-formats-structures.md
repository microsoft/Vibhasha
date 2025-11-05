### Dataset Formats & Structure

#### Sampling Frequency
For ASR datasets, audio should be recorded at a sampling frequency of **16 kHz** in single-channel (mono) format. This setup is widely supported by modern speech recognition models and helps maintain consistency across datasets.

#### Audio Format
The preferred audio format is **uncompressed .wav files**, which preserve audio fidelity and avoid compression artifacts. High-quality signals give the models a cleaner input and improve recognition performance.

#### Audio Samples Length
Audio samples should be kept short, ideally **10–15 seconds** and not exceeding **30 seconds**. Shorter clips improve alignment between speech and text, reduce memory usage during training, and lead to more stable model convergence.

#### Transcript Format
**SRT format** is the preferred label format. Each caption block should maintain proper timing alignment and concise line lengths, ensuring that text fits naturally within the displayed duration and adheres to standard [SRT guidelines](https://docs.fileformat.com/video/srt/). Numbers should be written out in full

Example:`“twenty-five” instead of “25”` to ensure clarity and consistency.

#### Non-speech Sounds
Finally, non-speech sounds should be explicitly tagged to distinguish them from spoken content. Common labels include:
- Silence: `[SIL]`
- Noise: `[NOISE]`
- Music: `[MUSIC]`
- Laughter: `[LAUGHTER]`
- Cough: `[COUGH]`

These annotations help the model learn to separate speech from background sounds and handle interruptions more effectively.