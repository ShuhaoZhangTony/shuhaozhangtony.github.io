# Large Language Model Inference Systems

This directory publishes the single-file English quick introduction to the LLM inference systems course. It is a concise, reusable two-hour overview rather than one of the eight Chinese course lectures.

## Materials

- `llm_inference_systems.pptx`: 124-slide PowerPoint edition with incremental build-up sequences for the worked examples and a complete read-aloud English script in the speaker notes

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

The public English edition is intentionally kept as one PPTX file so that the course page and repository expose one unambiguous download.
