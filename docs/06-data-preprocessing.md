### Dataset Preprocessing for ASR

#### General Formats & Structures
The recommended format for storing ASR datasets is **Parquet**, as it efficiently handles large audio and text data while preserving schema consistency. Each audio recording should be saved with a unique identifier, and the corresponding transcription or translation should reference the same ID to maintain alignment. A **CSV or Excel file** should be used to store metadata such as the audio file path, transcription text, translation, speaker information, language, and other relevant attributes. The **Hugging Face Datasets** framework is recommended, as it supports streaming and memory-efficient access to Parquet files.

#### Dataset Splits
The dataset should be divided into training, validation, and test sets. A common split is **80% for training, 10% for validation, and 10% for testing**, which is ideal when data is limited and maximising training samples is important. Alternatively, a **70% training, 20% validation, and 10% testing** split can be used when more validation data is needed for tasks such as hyperparameter tuning or performance benchmarking.

#### Pre-processing
The preprocessing pipeline typically involves converting raw audio into model-compatible input features and aligning transcripts as target labels. Audio is transformed into **spectrograms**, **log-Mel features**, or **raw waveform embeddings** depending on the model architecture.

Simultaneously, transcripts are tokenised, using character-level, subword (e.g., BPE), or word-level tokenisers, and mapped to numerical label sequences.

- For models like **phi-4-multimodal**, each audio sample is paired with its transcription and passed through a chat template to form a prompt. The text and audio are tokenised, and the prompt and response tokens are concatenated. Prompt tokens are masked so only the response contributes to the loss. The collator pads input IDs and labels to equal lengths and generates attention masks for both text and audio.
- For **Whisper models**, audio is standardised to 30 seconds using the `WhisperFeatureExtractor`, which pads shorter clips with silence and truncates longer ones. The audio is then converted into a log-Mel spectrogram for model input, while the `WhisperTokenizer` encodes transcriptions into numerical labels.
- For **Wav2Vec 2.0 models**, a character-level vocabulary is created from cleaned transcriptions in both training and test sets. Special tokens (`|`, `[UNK]`, `[PAD]`) are added and the vocabulary is saved as a JSON file. The `Wav2Vec2CTCTokenizer` uses this vocabulary, and the `Wav2Vec2Processor` handles audio normalisation and encodes text transcriptions into label IDs.