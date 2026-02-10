# Vibhasha - Interactive Flowchart

The interactive flowchart is your fast path to clarity. Instead of reading the entire playbook front to back, you can use the flowchart to identify the right multilingual strategy for your needs in a matter of minutes. It guides you through the most important decision points: the type of task you are building, your languages, your performance requirements, and your data constraints. 

The goal is simple: help you choose the strategy that will work best for your product right now, while pointing you to the sections of this playbook that explain how to implement it. 

<div style="display: flex; gap: 15px; align-items: flex-start; margin: 20px 0;">
  <div id="flowchart-container" style="height: 700px; flex: 1; border: 2px solid var(--md-default-fg-color--lighter); border-radius: 8px; background-color: var(--md-default-bg-color); box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;"></div>
  
  <!-- Zoom controls positioned next to flowchart -->
  <div id="zoom-controls" style="display: flex; flex-direction: column; gap: 8px; padding: 10px 0;">
    <button id="fit-view-btn" style="padding: 10px 14px; background: var(--md-primary-fg-color); color: var(--md-primary-bg-color); border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); white-space: nowrap;">📍 Fit to View</button>
    <div id="zoom-level" style="padding: 8px 12px; background: var(--md-code-bg-color); border: 1px solid var(--md-default-fg-color--lighter); border-radius: 4px; font-size: 12px; text-align: center; min-width: 70px;">100%</div>
  </div>
</div>

<div style="text-align: center; margin: 10px 0; font-size: 14px; color: var(--md-default-fg-color--light);">
  🖱️ <strong>Click</strong> nodes to navigate • 🔍 <strong>Scroll</strong> to zoom • ✋ <strong>Drag</strong> to pan • � <strong>Fit to View</strong> button resets zoom
</div>

<!-- Load libraries in correct order -->
<script src="https://unpkg.com/dagre@0.8.5/dist/dagre.min.js"></script>
<script src="https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js"></script>
<script src="https://unpkg.com/cytoscape-dagre@2.5.0/cytoscape-dagre.js"></script>

<script>
// Wait for all scripts to load
function initFlowchart() {
  // Check if libraries are loaded
  if (typeof cytoscape === 'undefined') {
    console.error('Cytoscape.js not loaded');
    document.getElementById('flowchart-container').innerHTML = '<p style="text-align: center; padding: 50px;">Failed to load interactive flowchart. Please refresh the page.</p>';
    return;
  }

  try {
    const cy = cytoscape({
      container: document.getElementById('flowchart-container'),
      
      // Better zoom and pan settings
      wheelSensitivity: 0.2,
      minZoom: 0.5,
      maxZoom: 3.0,
      
      // Smoother interactions
      motionBlur: true,
      pixelRatio: 'auto',
      
      // User interaction settings
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      selectionType: 'single',
      autoungrabify: false, // We'll control this per-node
      
      // Touch and interaction settings
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      
      elements: [
        // Nodes
        { data: { id: 'start', label: 'Start: Define Your\nMultilingual Task', type: 'start', chapter: '/chapters/00-introduction/' } },
        
        // Evaluation Phase
        { data: { id: 'eval', label: 'Evaluation Strategy', type: 'process', chapter: '/chapters/01-evaluation/' } },
        { data: { id: 'eval-data', label: 'Do you have\nevaluation data?', type: 'decision' } },
        { data: { id: 'synthetic-data', label: 'Create Synthetic\nDataset', type: 'process', chapter: '/chapters/06-synthetic-data/' } },
        { data: { id: 'eval-protocol', label: 'Run Evaluation\nProtocol', type: 'process', chapter: '/chapters/01-evaluation/' } },
        
        // Strategy Selection
        { data: { id: 'strategy', label: 'Choose Core Strategy', type: 'decision' } },
        
        // Translation Strategy (mapped to off-the-shelf since 03-off-the-shelf doesn't exist)
        { data: { id: 'translation', label: 'Translation\nStrategy', type: 'strategy', chapter: '/chapters/02-translation/' } },
        { data: { id: 'mt-quality', label: 'Check MT Quality\nfor Your Language', type: 'process', chapter: '/chapters/02-translation/' } },
        { data: { id: 'cultural-loss', label: 'Assess Cultural\nLoss Risk', type: 'process', chapter: '/chapters/02-translation/' } },
        
        // Off-the-Shelf Strategy (restored to proper off-the-shelf chapter)
        { data: { id: 'off-shelf', label: 'Off-the-Shelf\nPrompting', type: 'strategy', chapter: '/chapters/03-off-the-shelf/' } },
        { data: { id: 'prompt-design', label: 'Design Multilingual\nPrompts', type: 'process', chapter: '/chapters/03-off-the-shelf/' } },
        { data: { id: 'prompt-sensitivity', label: 'Test Prompt\nSensitivity', type: 'process', chapter: '/chapters/03-off-the-shelf/' } },
        
        // Fine-tuning Strategy
        { data: { id: 'fine-tune', label: 'Fine-Tune Small\nModel', type: 'strategy', chapter: '/chapters/04-fine-tuning/' } },
        { data: { id: 'data-collection', label: 'Collect Domain-Specific\nMultilingual Data', type: 'process', chapter: '/chapters/04-fine-tuning/' } },
        { data: { id: 'peft', label: 'Apply PEFT\nTechniques', type: 'process', chapter: '/chapters/04-fine-tuning/' } },
        { data: { id: 'cultural-align', label: 'Align with Cultural\nValues', type: 'process', chapter: '/chapters/04-fine-tuning/' } },
        
        // Safety and Deployment
        { data: { id: 'safety', label: 'Safety Assessment', type: 'process', chapter: '/chapters/05-safety/' } },
        { data: { id: 'safety-check', label: 'Multilingual Safety\nValidation', type: 'decision', chapter: '/chapters/05-safety/' } },
        { data: { id: 'deploy', label: 'Deploy & Monitor', type: 'end' } },
        { data: { id: 'iterate', label: 'Refine & Iterate', type: 'process' } },
        
        // Edges
        { data: { source: 'start', target: 'eval' } },
        { data: { source: 'eval', target: 'eval-data' } },
        { data: { source: 'eval-data', target: 'synthetic-data' } },
        { data: { source: 'eval-data', target: 'eval-protocol' } },
        { data: { source: 'synthetic-data', target: 'eval-protocol' } },
        { data: { source: 'eval-protocol', target: 'strategy' } },
        
        { data: { source: 'strategy', target: 'translation' } },
        { data: { source: 'strategy', target: 'off-shelf' } },
        { data: { source: 'strategy', target: 'fine-tune' } },
        
        { data: { source: 'translation', target: 'mt-quality' } },
        { data: { source: 'mt-quality', target: 'cultural-loss' } },
        
        { data: { source: 'off-shelf', target: 'prompt-design' } },
        { data: { source: 'prompt-design', target: 'prompt-sensitivity' } },
        
        { data: { source: 'fine-tune', target: 'data-collection' } },
        { data: { source: 'data-collection', target: 'peft' } },
        { data: { source: 'peft', target: 'cultural-align' } },
        
        { data: { source: 'cultural-loss', target: 'safety' } },
        { data: { source: 'prompt-sensitivity', target: 'safety' } },
        { data: { source: 'cultural-align', target: 'safety' } },
        
        { data: { source: 'safety', target: 'safety-check' } },
        { data: { source: 'safety-check', target: 'deploy' } },
        { data: { source: 'safety-check', target: 'iterate' } },
        { data: { source: 'iterate', target: 'strategy' } }
      ],
      
      layout: {
        name: 'dagre',
        directed: true,
        spacingFactor: 1.4,
        nodeDimensionsIncludeLabels: true,
        rankSep: 80,
        nodeSep: 60,
        edgeSep: 15,
        rankDir: 'TB'
      },
      
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'var(--md-default-bg-color)',
            'border-color': 'var(--md-default-fg-color--lighter)',
            'border-width': 3,
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': 'var(--md-default-fg-color)',
            'font-size': '16px',
            'font-weight': 'bold',
            'font-family': 'var(--md-text-font-family)',
            'text-wrap': 'wrap',
            'text-max-width': '180px',
            'width': '200px',
            'height': '110px',
            'shape': 'roundrectangle',
            'cursor': 'pointer',
            'transition-property': 'border-width, border-color, background-color',
            'transition-duration': '0.2s',
            'box-shadow': '0 4px 8px rgba(0,0,0,0.15)',
            'events': 'yes'
          }
        },
        {
          selector: 'node[type="start"]',
          style: {
            'background-color': '#28a745',
            'color': '#ffffff',
            'border-color': '#1e7e34',
            'border-width': 4,
            'width': '220px',
            'height': '120px',
            'font-size': '17px'
          }
        },
        {
          selector: 'node[type="end"]',
          style: {
            'background-color': '#dc3545',
            'color': '#ffffff',
            'border-color': '#c82333',
            'border-width': 4,
            'width': '210px',
            'height': '115px',
            'font-size': '16px'
          }
        },
        {
          selector: 'node[type="decision"]',
          style: {
            'background-color': '#ffc107',
            'color': '#212529',
            'border-color': '#e0a800',
            'border-width': 4,
            'shape': 'diamond',
            'width': '220px',
            'height': '130px',
            'font-size': '15px'
          }
        },
        {
          selector: 'node[type="strategy"]',
          style: {
            'background-color': '#007bff',
            'color': '#ffffff',
            'border-color': '#0056b3',
            'border-width': 4,
            'width': '220px',
            'height': '120px',
            'font-size': '16px'
          }
        },
        {
          selector: 'node[type="process"]',
          style: {
            'background-color': '#17a2b8',
            'color': '#ffffff',
            'border-color': '#117a8b',
            'border-width': 3,
            'font-size': '15px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 4,
            'line-color': 'var(--md-default-fg-color--lighter)',
            'target-arrow-color': 'var(--md-default-fg-color--lighter)',
            'target-arrow-shape': 'triangle',
            'target-arrow-size': 15,
            'curve-style': 'bezier',
            'control-point-step-size': 50,
            'opacity': 0.9
          }
        },
        {
          selector: 'node:hover',
          style: {
            'border-width': 4,
            'border-color': '#007bff',
            'background-opacity': 0.9,
            'transform': 'scale(1.05)',
            'z-index': 999
          }
        },
        {
          selector: 'node:active',
          style: {
            'transform': 'scale(0.95)'
          }
        }
      ]
    });

    // Simple zoom level indicator and fit button
    const zoomLevelDisplay = document.getElementById('zoom-level');
    const fitViewBtn = document.getElementById('fit-view-btn');

    // Update zoom level display
    function updateZoomLevel() {
      const zoomPercent = Math.round(cy.zoom() * 100);
      zoomLevelDisplay.textContent = zoomPercent + '%';
    }

    // Fit to view button functionality
    fitViewBtn.addEventListener('click', function() {
      cy.fit(cy.nodes(), 40);
      cy.center();
      updateZoomLevel();
    });

    // Update zoom level on zoom changes
    cy.on('zoom', updateZoomLevel);

    // Initial zoom level
    setTimeout(() => {
      updateZoomLevel();
    }, 500);

    // Improved hover effects
    cy.on('mouseover', 'node', function(evt) {
      const node = evt.target;
      const chapter = node.data('chapter');
      
      if (chapter) {
        node.style('content', node.data('label') + '\n\n🖱️ Click to navigate');
        // Highlight connected edges with better visibility
        node.connectedEdges().style({
          'line-color': '#007bff',
          'target-arrow-color': '#007bff',
          'width': 6,
          'opacity': 1
        });
      }
    });

    cy.on('mouseout', 'node', function(evt) {
      const node = evt.target;
      node.style('content', node.data('label'));
      // Reset edge styles to improved defaults
      node.connectedEdges().style({
        'line-color': 'var(--md-default-fg-color--lighter)',
        'target-arrow-color': 'var(--md-default-fg-color--lighter)',
        'width': 4,
        'opacity': 0.9
      });
    });

    // Better initial positioning and zoom
    setTimeout(() => {
      // First fit with minimal padding to show more content
      cy.fit(cy.nodes(), 40);
      cy.center();
      
      // Disable grabbing for nodes with chapters to prevent drag behavior
      // Do this after layout is complete
      cy.nodes().forEach(function(node) {
        const chapter = node.data('chapter');
        if (chapter) {
          node.ungrabify(); // This disables dragging for this node
        }
      });
      
      // Then zoom in moderately for better readability while showing more nodes
      setTimeout(() => {
        const currentZoom = cy.zoom();
        const targetZoom = Math.min(currentZoom * 1.2, 1.3); // Less aggressive zoom to show more content
        
        cy.zoom({
          level: targetZoom,
          renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
        });
        
        // Center on the start node for better initial view
        const startNode = cy.getElementById('start');
        if (startNode.length > 0) {
          cy.center(startNode);
        }
        
        // Initialize zoom level display
        updateZoomLevel();
        
        // Setup click events after graph is fully initialized
        cy.off('tap click'); // Remove any existing handlers
        
        // Try multiple event types for better compatibility
        cy.on('tap click', 'node', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          
          console.log('Event type:', evt.type, 'Node:', evt.target.id());
          const node = evt.target;
          const chapter = node.data('chapter');
          console.log('Chapter data:', chapter);
          
          if (chapter) {
            console.log('Immediate navigation to:', chapter);
            // Direct navigation without animation
            window.location.href = chapter;
            return false;
          } else {
            console.log('No chapter found for node:', evt.target.id());
          }
        });
        
        // Fallback: Add DOM event listeners directly to the container
        const container = document.getElementById('flowchart-container');
        if (container) {
          container.addEventListener('click', function(e) {
            console.log('DOM click event on container');
            // Check if click was on a cytoscape node
            const cy_node = cy.nodes().find(node => {
              const bb = node.renderedBoundingBox();
              return e.offsetX >= bb.x1 && e.offsetX <= bb.x2 && 
                     e.offsetY >= bb.y1 && e.offsetY <= bb.y2;
            });
            
            if (cy_node.length > 0) {
              const chapter = cy_node.data('chapter');
              if (chapter) {
                console.log('DOM fallback navigation to:', chapter);
                window.location.href = chapter;
              }
            }
          });
        }
      }, 400);
    }, 300);

    console.log('Flowchart initialized successfully');
  } catch (error) {
    console.error('Error initializing flowchart:', error);
    document.getElementById('flowchart-container').innerHTML = '<p style="text-align: center; padding: 50px;">Error loading flowchart: ' + error.message + '</p>';
  }
}

// Initialize when DOM is ready and scripts are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initFlowchart, 500);
  });
} else {
  setTimeout(initFlowchart, 500);
}
</script>

### How the flowchart works

The flowchart asks a series of questions in this order:

1. **What task are you building?**
   Extraction, generation, classification, dialogue, or search.

2. **What languages do you need to support?**
   High‑resource, mid‑resource, or low‑resource.

3. **How quickly do you need a working prototype?**
   Immediate, fast, or production‑grade.

4. **How important is cultural nuance and tone?**
   Low, medium, or high importance.

5. **Do you have training data?**
   None, limited, or robust and native.

6. **Do you require privacy, on‑prem deployment, or regulated behavior?**
   Yes or no.

Based on these answers, the flowchart routes you to one of the three main strategies:

- **Translation‑based approaches (Section 2.3)**

- **Off‑the‑shelf prompting (Section 2.3)**

- **Fine‑tuning specialized models (Section 2.4)**

Along the way, it suggests when to incorporate selective translation, RAG, safety filters, or cultural alignment patterns.

### Using the flowchart effectively

The interactive version is built so that teams can walk through it together. It is especially helpful for:

- Product teams scoping multilingual launches
- Localization teams choosing where to add native content
- Engineering teams deciding which pipeline to implement
- Research teams planning model evaluation and experiments
- Safety teams prioritizing languages for red‑teaming
- Leaders deciding where to invest exploration vs. fine‑tuning resources

You can also use the flowchart as a recurring checkpoint when:

- Adding new languages
- Introducing new features or tasks
- Seeing degraded quality or safety in a region
- Migrating to a new model family
- Rethinking your multilingual architecture

### What outputs the flowchart gives you

By the end of the flowchart, you will know:

- **Which strategy to use first**
- **When to combine strategies** (for example, selective translation plus RAG)
- **Whether fine‑tuning is necessary**
- **How to handle low‑resource languages**
- **Recommended evaluation steps**
- **Safety requirements for your languages**
- **Where to find the guidance in this playbook**

It also points you to the appropriate subsections, such as:

- **2.3.1 Translation strategies**
- **2.3.3 Translation architectures**
- **2.4.1 Fine‑tuning strategies**
- **2.4.4 Data engineering**
- **2.5.1 Safety assessments**

This gives teams a shared vocabulary and set of decision criteria.



### Examples of flowchart outcomes

Here are three typical outcomes from running the flowchart:

**Outcome 1: Mid‑resource language, fast prototype**

- Task: summarization
- Languages: Spanish and Portuguese
- Data: minimal
- Cultural nuance: medium
- Privacy needs: none

**Recommended strategy:**
Use **off‑the‑shelf prompting** with light RAG and selective translation only when needed.

**Outcome 2: Low‑resource language, high cultural requirements**

- Task: customer support
- Languages: Amharic and Oromo
- Data: limited
- Cultural nuance: high
- Safety constraints: strong

**Recommended strategy:**
Use **selective translation** plus **fine‑tuning** with native data and cultural alignment examples.

**Outcome 3: Regulated domain**

- Task: medical assistance workflow
- Languages: French, Hindi, Arabic
- Data: robust
- Privacy: on‑prem preferred
- Safety risk: high

**Recommended strategy:**
Use a **small fine‑tuned model** with modular adapters (language + domain + safety), plus multilingual RAG.

### Why the flowchart accelerates multilingual development

Teams often lose weeks experimenting with translation patterns, prompt variations, and fine‑tuning decisions without a clear framework. The flowchart provides a structured, evidence‑based approach that dramatically reduces this exploration time.

It helps you avoid:

- Overinvesting in fine‑tuning too early
- Relying solely on translation
- Ignoring safety differences across languages
- Using English‑centric evaluation metrics
- Treating all languages the same despite resource differences

Instead, you get a tailored strategy that matches your languages, resources, and goals.

### Next steps after using the flowchart

Once you complete the flowchart:

1. **Review the recommended strategy** (Sections 2.3, 2.4, or both).
2. **Check** the **evaluation requirements** in Section 2.2.
3. **Review safety considerations** in Section 2.5.
4. **Build a small pilot** in one language per tier.
5. **Expand to additional languages** after successful QA.
6. **Plan for cultural alignment and data engineering** if fine‑tuning is required.

The flowchart is an entry point, not an endpoint. It tells you where to start and how to scale safely.


<!-- ## Navigation Guide

!!! info "Interactive Flowchart Guide"
    This interactive flowchart provides a bird's-eye view of the **Vibhasha** multilingual LLM playbook.

### 🎮 How to interact:

- 🖱️ **Click any colored node** to navigate directly to the relevant chapter
- 🔍 **Scroll wheel** to zoom in/out smoothly
- ✋ **Click and drag** to pan around the flowchart
- 📖 **Follow the arrows** to understand the decision-making process
- 🎯 **Hover over nodes** to see navigation hints and highlight connections
- � **"Fit to View" button** (top-right) returns to full flowchart view
- � **Zoom level indicator** shows current zoom percentage

### 🎨 Visual Legend:

| Color | Type | Description |
|-------|------|-------------|
| 🟢 | **Start Point** | Beginning of the workflow |
| 🔶 | **Decision Points** | Key decision nodes |
| 🔵 | **Core Strategies** | Main approach strategies |
| 🔷 | **Process Steps** | Implementation steps |
| 🔴 | **End Goal** | Deployment target |

### 📋 Quick Navigation:
Jump directly to chapters by clicking these flowchart sections:
- **� Start** → [Introduction](../chapters/00-introduction/)
- **🔷 Evaluation** → [Evaluation Strategies](../chapters/01-evaluation/)
- **🔵 Translation** → [Translation Strategies](../chapters/02-translation/)
- **🔵 Off-the-Shelf** → [Prompting Techniques](../chapters/03-off-the-shelf/)
- **🔵 Fine-tuning** → [Model Fine-tuning](../chapters/04-fine-tuning/)
- **🔷 Safety** → [Safety Assessments](../chapters/05-safety/)
- **🔷 Synthetic Data** → [Data Generation](../chapters/06-synthetic-data/) -->
