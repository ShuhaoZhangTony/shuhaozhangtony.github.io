# 系统建设与代表项目

这里整理目前适合公开展示的系统工作。内容聚焦系统目标、问题边界、公开仓库与代表性论文，不包含申报材料中的项目编号、经费信息或时效性较强的统计口径。

## 当前系统建设

### SAGE

- 面向国产异构算力的大模型推理服务系统，重点关注在线 serving、调度编排、可观测性与端到端性能优化。
- 公开入口：[GitHub](https://github.com/intellistream/SAGE)
- 代表性论文：[SAGE (ICML 2026)](contents/research_papers/2026/2026_sage_icml_2026.pdf)

### Neuromem

- 面向大模型记忆智能体的中间件系列，重点覆盖流式记忆组织、向量检索、长期记忆写入与跨轮复用。
- 当前公开仓库：[Neuromem-Benchmark](https://github.com/intellistream/neruomem-bench)
- 代表性论文：[Neuromem (ICML 2026)](contents/research_papers/2026/2026_neuromem_icml_2026.pdf)

### vLLM-HUST

- 面向国产算力的自研推理引擎底座与插件生态，重点覆盖共享 workload、KV 状态管理、插件化优化与评测工具链。
- 公开入口：[vLLM-HUST](https://github.com/vLLM-HUST/vllm-hust), [Benchmark](https://github.com/vLLM-HUST/vllm-hust-benchmark), [Dev Hub](https://github.com/vLLM-HUST/vllm-hust-dev-hub)

## 代表性系统积累

### MorphStream

- 面向事务型流处理的系统原型，围绕动态负载下的调度、执行与故障恢复展开。
- 公开入口：[GitHub](https://github.com/intellistream/MorphStream)
- 代表性论文：[MorphStream (SIGMOD 2023)](contents/research_papers/2023/2023_morphstream_sigmod_2023.pdf), [MorphStream Demo (ICDE 2024)](contents/research_papers/2024/2024_morphstream_icde_demo_2024.pdf), [MorphStream (TKDE 2025)](contents/research_papers/2025/2025_morphstream_tkde.pdf)

### BriskStream

- 面向共享内存多核与 NUMA 架构的流处理平台，围绕执行计划优化与硬件感知调度进行系统设计。
- 公开入口：[GitHub](https://github.com/Xtra-Computing/briskstream)
- 代表性论文：[BriskStream (SIGMOD 2019)](contents/research_papers/2019/2019_briskstream.pdf)

### CStream

- 面向 IoT 与边缘设备的流数据压缩系统，关注在非对称多核约束下同时平衡吞吐、时延与能耗。
- 公开入口：[GitHub](https://github.com/intellistream/CStream)
- 代表性论文：[CStream (ICDE 2023)](contents/research_papers/2023/2023_cstream_icde.pdf), [CStream (TKDE 2024)](contents/research_papers/2024/2024_cstream_tkde_2024.pdf)

### FineStream

- 面向 CPU-GPU 集成架构的流处理系统，重点探索细粒度 CPU/GPU 协同调度与窗口计算优化。
- 代表性论文：[FineStream (USENIX ATC 2020)](contents/research_papers/2020/2020_finestream.pdf), [FineStream MQ (TPDS 2021)](contents/research_papers/2021/2021_tpds_finestream_paper_0224v1.pdf)

### OmniDB

- 面向并行 CPU/GPU 架构的可移植查询处理原型，通过 kernel-adapter 设计降低跨硬件适配成本。
- 代表性论文：[OmniDB (VLDB 2013)](contents/research_papers/2013/2013_omnidb_vldb_2013.pdf)

### MOTTO

- 面向复杂事件处理的多查询优化器，围绕查询分解、共享与转换降低冗余计算。
- 代表性论文：[MOTTO (ICDE 2017)](contents/research_papers/2017/2017_motto.pdf)

### OpenMLDB Online Interval Join

- 面向机器学习数据库 OpenMLDB 的在线 interval join 优化工作，聚焦现代多核处理器上的并行执行与算法选择。
- 代表性论文：[OpenMLDB OIJ (ICDE 2023)](contents/research_papers/2023/2023_openmldb_icde_2023.pdf)

## 说明

- 上述系统覆盖从多核/异构硬件上的状态管理与流处理，到大模型推理服务与记忆中间件的持续演进脉络。
- 如需更完整的论文列表，可参见主页中的 Publications 栏目。