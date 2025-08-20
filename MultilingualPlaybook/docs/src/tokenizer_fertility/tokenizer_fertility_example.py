# Import necessary libraries
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from transformers import AutoTokenizer, LlamaTokenizerFast
import re

# Define the models and their corresponding Hugging Face names
# The user's provided models are used here
models = {
    "Llama-3.1": "meta-llama/Llama-3.1-8B-Instruct",
    "Gemma-3": "google/gemma-3-270m",
    "GPT-OSS": "openai/gpt-oss-20b",
}

# Define a list of 10 equivalent sentences for each of the five languages
# These are simple, parallel sentences to ensure a fair comparison
language_sentences = {
    "English": [
        "Hello, how are you?", "The sun is shining today.", "I like to read books.",
        "Where is the library?", "This is a great city.", "She is a kind person.",
        "Can you help me?", "The cat is sleeping.", "Let's go for a walk.",
        "What time is it?"
    ],
    "Hindi": [
        "नमस्ते, आप कैसे हैं?", "आज सूरज चमक रहा है।", "मुझे किताबें पढ़ना पसंद है।",
        "पुस्तकालय कहाँ है?", "यह एक महान शहर है।", "वह एक दयालु इंसान है।",
        "क्या आप मेरी मदद कर सकते हैं?", "बिल्ली सो रही है।", "चलो सैर के लिए चलते हैं।",
        "कितना समय हुआ है?"
    ],
    "Swahili": [
        "Habari, hujambo?", "Jua linaangaza leo.", "Ninapenda kusoma vitabu.",
        "Maktaba iko wapi?", "Huu ni mji mzuri sana.", "Yeye ni mtu mwenye fadhili.",
        "Unaweza kunisaidia?", "Paka analala.", "Twende kwa matembezi.",
        "Saa ngapi?"
    ],
    "Tamil": [
        "வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?", "இன்று சூரியன் பிரகாசிக்கிறது.", "எனக்கு புத்தகங்கள் படிக்கப் பிடிக்கும்.",
        "நூலகம் எங்கே இருக்கிறது?", "இது ஒரு சிறந்த நகரம்.", "அவள் ஒரு கனிவான நபர்.",
        "நீங்கள் எனக்கு உதவ முடியுமா?", "பூனை தூங்குகிறது.", "நடைபயிற்சிக்கு செல்வோம்.",
        "இப்போது என்ன நேரம்?"
    ],
    "Spanish": [
        "Hola, cómo estás?", "El sol brilla hoy.", "Me gusta leer libros.",
        "Dónde está la biblioteca?", "Esta es una gran ciudad.", "Ella es una persona amable.",
        "Puedes ayudarme?", "El gato está durmiendo.", "Vamos a dar un paseo.",
        "Qué hora es?"
    ]
}

# A dictionary to store the final fertility scores (languages as rows, models as columns)
fertility_scores = {model_name: {} for model_name in models.keys()}

print("Calculating fertility scores...")

# Loop through each model and its tokenizer
for model_name, model_path in models.items():
    print(f"Loading tokenizer for {model_name}...")
    try:
        # Load the appropriate tokenizer based on the model path
        if "llama" in model_path.lower():
            tokenizer = LlamaTokenizerFast.from_pretrained(model_path)
        else:
            tokenizer = AutoTokenizer.from_pretrained(model_path)
    except Exception as e:
        print(f"Could not load tokenizer for {model_name}: {e}")
        continue

    # Loop through each language to calculate its average fertility score
    for language, sentences in language_sentences.items():
        total_tokens = 0
        total_words = 0
        for sentence in sentences:
            # Tokenize the sentence and get the number of tokens
            tokens = tokenizer.tokenize(sentence)
            total_tokens += len(tokens)

            # Count the number of words in the sentence (simple split by space)
            # Use regex to handle punctuation and multiple spaces
            words = re.findall(r'\b\w+\b', sentence.lower())
            total_words += len(words)

        # Calculate the average fertility for the language (tokens per word)
        if total_words > 0:
            avg_fertility = total_tokens / total_words
            fertility_scores[model_name][language] = avg_fertility
        else:
            fertility_scores[model_name][language] = 0

# Create a pandas DataFrame from the collected fertility scores
# Transpose the DataFrame so languages are rows and models are columns
df = pd.DataFrame.from_dict(fertility_scores, orient='index').T

# Plot the heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(df, annot=True, fmt=".2f", cmap="YlGnBu", linewidths=.5, cbar_kws={'label': 'Average Tokens per Word'})

# Set plot titles and labels
plt.title("Average Token Fertility Heatmap by Language and Model", fontsize=16)
plt.xlabel("Model", fontsize=12)
plt.ylabel("Language", fontsize=12)

plt.savefig("tokenizer_fertility_heatmap.png")

