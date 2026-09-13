# BriskSeed: Online History-Guided Reuse for Accelerating Dynamic Approximate Nearest Neighbor Search

**Authors:** Hongru Gao, Shuhao Zhang, Haikun Liu, Xiaofei Liao, Hai Jin

**Corresponding author:** Shuhao Zhang

**Venue:** 43rd IEEE International Conference on Data Engineering (ICDE 2027)

**Track:** Research First Round

**Status:** Accepted

## Research summary

Frequent insertions and deletions make auxiliary search information stale in dynamic ANNS. BriskSeed retains successful past search results as lightweight seeds and reuses them online through utility-managed two-tier storage, exact-key and signature lookup, and lightweight acceptance and fallback policies. It neither modifies the underlying ANNS index nor assumes a specific graph backend. Evaluation through the unified CANDOR-Bench plugin interface spans multiple backends and shows improved search efficiency under high update rates while maintaining competitive recall.

## 系统定位

BriskSeed 属于持续检索与数据状态维护：将历史成功搜索结果转化为可在线复用的 seeds。CANDOR-Bench 提供统一插件接口和动态负载评测，BriskSeed 提供具体优化机制。它不修改底层 ANNS 索引，不限定特定图后端。

## Availability

A public author version is not yet available on this website. This entry provides the bibliographic record and a research summary.
