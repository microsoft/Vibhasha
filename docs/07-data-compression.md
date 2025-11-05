
## Dataset Compression
Audio compression is used to reduce the storage requirements and transmission bandwidth of audio data. It mostly involves psychoacoustics which exploit characteristics of human perception (e.g., mp3) to achieve high compression rates while attempting to maintain signal quality.

#### Impact of Compression on Downstream Tasks

##### Impact on ASR
The effect of compression on ASR mainly depends on the bitrate and whether there was a mismatch between training and test data.

- **Training on compressed audio data:**
  - **Low Bitrates** – this is high compression and at very low bitrates such as 16 kbps and 24 kbps, there is a significant degradation in ASR performance. This is because there is a loss of useful spectral information. See: [The Influence of Audio Compression on Speech Recognition Systems](https://scispace.com/pdf/the-influence-of-audio-compression-on-speech-recognition-lldhdemz4p.pdf)
  - **High bitrates (Low compression)** – Shows very low degradation on 32 kbps or higher. For MP3 compression at 64 kbps, no significant differences in word accuracy rates were observed compared to uncompressed baseline results. See: [The Influence of Audio Compression on Speech Recognition Systems](https://scispace.com/pdf/the-influence-of-audio-compression-on-speech-recognition-lldhdemz4p.pdf)

##### ASR Robustness Against Noise
- When regular (non-adversarial) noise (i.e., white noise) is present in the input audio during inference, MP3 compression worsens ASR performance. [arXiv:2007.12892](https://arxiv.org/pdf/2007.12892)
- The lower the Signal-to-Noise ratio (i.e., the higher the noise level), the more error prone the system becomes. [arXiv:2007.12892](https://arxiv.org/pdf/2007.12892)

##### Impact on TTS
TTS systems aim for high quality and high naturalness. An ideal TTS dataset must have a high sampling rate (at least 24 kHz) to be useful for modern TTS models. The effectiveness of training with clean, high-fidelity data is evident in models like ManaTTS, which achieve Mean Opinion Scores (MOS) as high as 3.76—remarkably close to the natural speech MOS of 4.01. This demonstrates that using uncompressed, high-quality datasets is crucial for producing natural and high-quality TTS output, and that compression or lower quality audio would likely compromise this level of performance.