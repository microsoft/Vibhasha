### Background: ASR for Low Resource Languages

The development of automatic speech recognition (ASR) for low resource languages faces several challenges.

**Data scarcity and domain bias** remain critical issues, with only a few hours of labelled speech available per language, often concentrated in narrow domains such as news, religious content, or broadcast media. This limitation restricts model generalisation and transfer, and while community-driven curation efforts exist, they are still small in scale ([AfricaNLP, 2025](https://aclanthology.org/2025.africanlp-1.13.pdf)).

**Linguistic complexity** further complicates system development, as many African languages exhibit tonal contrasts (e.g., Yorùbá), rich morphology and agglutination (common in Bantu languages), and extensive use of diacritics, all of which present difficulties for end-to-end models and text normalization ([AfricaNLP, 2025](https://aclanthology.org/2025.africanlp-1.13.pdf)).

Another significant challenge is **code-switching and multilinguality** ([Oreoluwa Boluwatife, Victor Tolulope, Emmanuel, Kausar Yetunde, & Chris Chinenye, 2025](#)). Speakers frequently switch intra- and inter-sententially between local languages, English, or regional lingua francas, reducing recognition accuracy ([Astik, Emre, Ewald, Febe, & Thomas, 2021](#)). Solutions such as robust language identification, shared lexicons, and training on mixed-speech data remain underdeveloped. Dialect and accent variation also impact performance, as substantial intra-language diversity and regional accents create mismatches between training and deployment conditions.

**Acoustic variability** is an additional obstacle. Speech collected from mobile phones, messaging applications, or rural environments often contains channel noise, reverberation, and non-speech events, which current models do not handle well without targeted augmentation.

**Computational constraints** further hinder progress; training and decoding large-scale models (e.g., Whisper-Large) require significant resources, and on-device or offline deployment demands parameter-efficient adaptations and lightweight decoders.

**Orthographic and standardisation issues** also pose challenges. Non-standard spellings, inconsistent or omitted diacritics, and evolving orthographies complicate the construction of lexicons, grapheme-to-phoneme models, and evaluation pipelines ([AfricaNLP, 2025](https://aclanthology.org/2025.africanlp-1.13.pdf)).

Moreover, **benchmarking and evaluation** are still limited, with few publicly available datasets or standardised benchmarks—particularly for code-switching, tone, diacritics, and noisy speech. Conventional word error rate (WER) metrics often fail to capture these complexities, motivating the need for specialised evaluation metrics ([Zitha Sasindran et al., 2022](https://arxiv.org/pdf/2211.01722v3)).

Finally, **data rights, licensing, and ethical considerations** constrain access to speech corpora, with copyright, privacy, and consent requirements presenting persistent obstacles ([Chijioke & Vukosi, 2024](https://arxiv.org/pdf/2502.15916)).