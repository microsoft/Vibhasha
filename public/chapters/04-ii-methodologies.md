## Core Fine-Tuning Methodologies


### Parameter-Efficient Fine-Tuning (PEFT)

PEFT methods enable comprehensive model adaptation while minimizing computational requirements and parameter updates.

#### LoRA and QLoRA

!!! success "Low-Rank Adaptation Benefits"
    **LoRA**: Introduces small, trainable adapter matrices for efficient adaptation
    
    **QLoRA**: Extends LoRA with quantization (e.g., 4-bit NormalFloat) to dramatically reduce VRAM requirements
    
    **Advantages**:
    - ✅ Minimal storage overhead
    - ✅ Rapid convergence
    - ✅ Consumer-grade hardware compatibility
    - ✅ Multiple language support through adapter switching

!!! warning "PEFT Considerations"
    **Deployment Complexity**: Managing multiple adapter weights for various languages/domains requires efficient dynamic loading mechanisms

### Full Fine-Tuning (FFT)

Complete parameter retraining is resource-intensive but necessary in specific scenarios:

!!! info "When FFT is Required"
    - **PEFT Limitations**: When parameter-efficient methods fail to achieve required performance fidelity
    - **Extreme Domain Shifts**: Fundamental model knowledge requires reshaping
    - **Cultural Realignment**: Correcting severe inherent biases demands complete model transformation


---

