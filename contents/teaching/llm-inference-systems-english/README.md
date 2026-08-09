# Large Language Model Inference Systems

This directory contains the English teaching edition of the LLM inference systems course. It is organized as a reusable two-hour class in two complete halves rather than an event-specific short talk.

## Materials

- `llm_inference_systems.tex`: editable LaTeX Beamer source
- `llm_inference_systems.pdf`: compiled classroom deck
- `llm_inference_systems.pptx`: 120-slide PowerPoint edition with incremental build-up sequences for the worked examples and a complete read-aloud English script in the speaker notes

## Two-hour teaching flow

1. **First half — model to request (55 minutes)**
   - tokens, embeddings, attention, causal masking, and value mixing
   - Transformer blocks and autoregressive generation
   - prefill, decode, request lifecycle, and user-visible metrics
2. **Break (10 minutes)**
3. **Second half — engine to evidence (55 minutes)**
   - iteration-level scheduling and continuous batching
   - KV capacity, paging, ownership, sharing, and request state
   - long context, RAG, MoE, agents, and heterogeneous execution
   - arithmetic intensity, Amdahl's law, correctness contracts
   - controlled A/B experiments, metadata, and open engineering

The deck is self-contained: definitions, worked calculations, transitions, classroom prompts, answer keys, synthesis, and the reading path are all included. Every PowerPoint slide also contains a clean, read-aloud English script in the speaker notes, without timing labels, production prompts, or source blocks. The instructor can add personal examples, but does not need to invent missing teaching content during class.

## Build

```bash
tectonic llm_inference_systems.tex --keep-logs
```

The source prefers Helvetica Neue and Menlo, with Arial and Consolas as automatic cross-platform fallbacks.
