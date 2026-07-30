# Large Language Model Inference Systems

This directory contains the English teaching edition of the LLM inference systems course. It is organized as a reusable three-hour class rather than an event-specific short talk.

## Materials

- `llm_inference_systems.tex`: editable LaTeX Beamer source
- `llm_inference_systems.pdf`: compiled 83-slide classroom deck

## Three-hour teaching flow

1. **Session 1 — model to request**
   - tokens, embeddings, attention, causal masking, and value mixing
   - Transformer blocks and autoregressive generation
   - prefill, decode, request lifecycle, and user-visible metrics
2. **Session 2 — serving engine**
   - iteration-level scheduling and continuous batching
   - KV capacity, paging, ownership, sharing, and request state
   - worked scheduler and KV examples
3. **Session 3 — systems evidence**
   - long context, RAG, MoE, agents, and heterogeneous execution
   - arithmetic intensity, Amdahl's law, correctness contracts
   - controlled A/B experiments, metadata, and open engineering

Two ten-minute breaks are included in the deck.

## Build

```bash
tectonic llm_inference_systems.tex --keep-logs
```

The source uses Helvetica Neue and Menlo on macOS. Substitute locally available fonts if compiling on another platform.

