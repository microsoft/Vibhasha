## The Fine-Tuning Pipeline

The fine-tuning process consists of three critical phases that build upon each other to achieve optimal multilingual performance.

### Phase 1: Linguistic Priming (Pre-Training Adaptation)

Before instruction tuning begins, the model must be linguistically prepared through **Continued Pretraining** (CPT). This phase bridges the gap between the base model's capabilities and your target domain/language requirements.

#### Addressing the Curse of Multilinguality

!!! danger "The Multilinguality Challenge"
    The **curse of multilinguality** describes performance degradation when a model's fixed capacity is spread thinly across many languages. Strategic adaptation mitigates this by dedicating model capacity to high-quality language representation.

#### Vocabulary Expansion (VE)

Standard English-centric vocabularies often lead to poor performance for non-Latin scripts or morphologically rich languages due to excessive subword fragmentation.

!!! tip "Vocabulary Expansion Strategy"
    **Process**: Retrain the tokenizer on large, representative target language corpora and add high-frequency tokens to the model's embedding matrix
    
    **Critical Impact**: Poor tokenization inflates sequence length, and since attention mechanisms scale with $O(L^2)$, this dramatically increases computational costs and erodes the advantages of lightweight LLMs
    
    **Best Practice**: Use subword tokenization (SentencePiece, Unigram models) for smaller vocabulary size and faster training

#### Continued Pretraining (CPT)

!!! success "The CPT Foundation"
    **Purpose**: Expose the model to massive amounts of unlabeled text specific to your target language or domain
    
    **Focus**: Pure representation learning—teaching orthographic, syntactic, and semantic patterns
    
    **Sequence**: Must precede instruction tuning, which focuses on behavior learning
    
    **Validation**: Successfully demonstrated in Mixtral's language adaptation pipeline

---

