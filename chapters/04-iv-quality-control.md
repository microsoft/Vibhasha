## Quality Control

- **Pre-recording vetting** – when participants submit samples, only clear, intelligible recordings closely matching the target text should be retained.
- **In-Recording Supervision** – Participants should be permitted to re-record any prompt they misread or hesitated.
- **Denoising** – enhancement models can be used to remove background, stationary and non-stationary noises, reverb. For ASR systems, exposure to noisy, real-world conditions is particularly beneficial in making the models more robust. While noise is valuable for ASR robustness, denoising is essential for preparing data for high-quality TTS systems. The goal is to achieve high naturalness and high quality in the resulting synthetic voices. For TTS, the degree of processing is high, aiming for maximal clarity while for ASR, the degree of denoising should be carefully managed to retain acoustic diversity.
- **Quality Normalization** – You can apply a bandwidth extension model to improve the quality of highly degraded utterances, such as those with low resolution or clipping distortion.
- **Voice Activity Detection (VAD)** – Use a VAD tool to eliminate long pauses from the speech recordings e.g. Silero VAD, py-webrtcvad and PyDub.
- **Objective Signal Quality** – by computing the signal to noise ratio, ensure samples call within the clean audio threshold.
- **Final Alignment Check** – Run an automated text–audio alignment tool and manually spot-check all flagged utterances for major errors

#### Resources
- [The Esethu Framework: Reimagining Sustainable Dataset Governance and
Curation for Low-Resource Languages](https://arxiv.org/pdf/2502.15916)