## Core Fine-Tuning Methodologies

Finetuning multilingual models can be approached in several ways, each with different levels of control, cost, and complexity. The methodologies in this section focus on helping you get the highest-quality results with the least overhead, while preserving stability across languages. 

The goal is to select the right tuning technique for your languages, your domain, and your constraints, rather than defaulting to a single approach for everything. 

### Parameter-Efficient Fine-Tuning (PEFT)

Parameter efficient finetuning updates only a small number of model parameters instead of modifying the entire model. This makes training faster, cheaper, and easier to scale across languages. It also allows you to maintain a single base model with multiple language- or domain-specific adapters. 

#### LoRA

LowRank Adaptation (LoRA) adds lightweight, trainable matrices to specific layers of the model.

**Why LoRA works well:**

- It dramatically reduces compute requirements
- It avoids catastrophic forgetting
- It allows plug-and-play adapters for each language or domain
- It is easy to revert or swap models without retraining
- It offers strong performance on instruction-following and style tuning

#### QLoRA

QLoRA extends LoRA with quantization. It shrinks the memory footprint while maintaining quality.

**When to choose QLoRA:**

- You need to train on limited GPU resources
- You need many adapters for many languages
- You want to deploy multilingual models on edge devices

QLoRA typically delivers near-full precision quality at a fraction of the cost.

### Full finetuning

Full finetuning updates all model weights. It is the most powerful and most expensive option.

**Choose full finetuning when:**

- The domain shift is very large
- PEFT does not reach your required accuracy
- You need the deepest possible cultural, linguistic, or domain alignment
- You are training models for a single highly specialized purpose

**Tradeoffs:**

- Higher compute and training time
- Higher risk of destabilizing reasoning ability
- Harder to maintain multiple language versions
- Greater chance of overfitting without careful data balance

Full tuning is best reserved for mission-critical tasks or extremely specialized workflows.

### Continued pretraining

Continued pretraining adapts the model to a specific language or domain using large amounts of unlabeled text. It comes *before* instruction finetuning.

**Why it works**

Models trained mostly on English often struggle with morphology, orthography, and syntax in low-resource languages. Continued pretraining strengthens the model's representation of these languages, so the instruction-tuning phase has a better foundation.

**Use continued pretraining when:**

- Your target language is underrepresented
- You need better fluency before doing task-specific tuning
- You are expanding the tokenizer with new vocabulary
- Your domain uses specialized terminology rarely seen online

It is especially powerful for languages with complex grammar or unique writing systems.

### Instruction finetuning

Instruction finetuning trains the model to follow commands, respond with the right tone, and exhibit consistent behavior across tasks and languages.

**Key elements of good instruction-tuning data:**

- Clear tasks and expected outputs
- Native-language examples
- Culturally appropriate phrasing and tone
- Safety examples, including refusals
- Domain-specific terminology

Instruction finetuning is where the model learns "how to behave," so quality matters more than quantity.

### Reward-model alignment

Reward-model alignment helps the model internalize human preferences, especially around tone, politeness, and safety.

**Crosslingual reward transfer**

This approach starts with an English reward model, then adapts it using small amounts of high-quality native-language preference data.

**Benefits include:**

- Faster, cheaper alignment
- More consistent behavior across languages
- Higher-quality responses for low-resource languages
- Better refusal behavior and safety control

Reward-model alignment is essential when your model interacts directly with end users.

### Stabilization through training schedules

Multilingual finetuning can be unstable if training is not carefully managed.

**Recommended stabilization practices:**

- Use lower learning rates for multilingual data
- Mix languages to avoid overfitting one at the expense of others
- Gradually increase task difficulty
- Apply early stopping based on per-language performance
- Include a small amount of original pretraining distribution to prevent drift

These techniques help models retain general reasoning skills while learning new behaviors.

### Cultural and safety alignment during finetuning

Cultural alignment must be built intentionally. Safety cannot be assumed to transfer.

Add examples that teach:

- Politeness and formality conventions per language
- Respectful handling of sensitive topics
- Regional norms (for example, preferred greetings, sign-offs, or honorifics)
- Safe refusal patterns in each target language
- Phrasings that avoid ambiguity or misunderstanding

These data points significantly reduce cultural errors, misinterpretations, and safety violations.

### Adapters as modular building blocks

Adapters are small tuning layers you can toggle on or off. They make multilingual systems modular and easier to scale.

You can maintain:

- A **language adapter** (for example, Arabic)
- A **domain adapter** (for example, customer support)
- A **safety adapter** (for global refusal behavior)

Then combine them as needed for each region or product.

This modularity speeds up experimentation and ensures changes in one area do not break others.

### Choosing the right methodology

To decide between PEFT, full finetuning, continued pretraining, or alignment, consider:

- **Language resources:** The lower the resource level, the more pretraining you need.
- **Domain complexity:** The more specialized your content, the more aggressive the tuning.
- **Compute budget:** PEFT and QLoRA outperform almost everything in efficiency.
- **Deployment environment:** On-prem, edge, or cloud will shape your model size needs.
- **Cultural sensitivity:** Tasks involving people require more alignment data and review.

Most teams use a blend:

- Continued pretraining
- PEFT-based instruction tuning
- Reward-model alignment
- Modular adapters

This combination delivers high performance with low operational overhead.

---

