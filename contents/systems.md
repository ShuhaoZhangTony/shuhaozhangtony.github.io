# 并行执行、状态管理与推理系统

## 当前重点：vLLM-HUST 推理引擎

研究目标是构建面向国产算力的极致性能推理引擎，围绕请求调度、KV 驻留与复用、长上下文和 MoE 执行、异构通信与数据通路开展优化。

[vLLM-HUST](https://github.com/vLLM-HUST/vllm-hust) 是基于 vLLM 的研究与工程载体；配套 [Benchmark](https://github.com/vLLM-HUST/vllm-hust-benchmark) 和 [Dev Hub](https://github.com/vLLM-HUST/vllm-hust-dev-hub) 支撑负载、评测和开发协作。

**代表机制：BidKV** 研究 KV 压力下基于效用的抢占调度，属于推理运行时。阅读 [BidKV 作者版本](contents/research_papers/2026/2026_bidkv_sc_2026.pdf)。具体性能收益应结合论文中的硬件、模型、负载和基线理解。

## 推理工作流、外部记忆与动态检索

下面按研究对象介绍代表性工作。工作流组织、外部记忆、检索与动态图维护分别解决不同层次的问题；它们为智能体应用提供相互关联的系统能力。

### SAGE · 编排与观测

以数据流组织模块化、可控制、可观测的 LLM 推理流程，连接检索、记忆、工具与模型调用。它扩展推理服务的流程组织能力。

[公开代码](https://github.com/RIDE-Lab/SAGE) · [SAGE 论文（ICML 2026）](contents/research_papers/2026/2026_sage_icml_2026.pdf)

### Neuromem · 外部记忆生命周期

分解外部记忆的流式生命周期，研究写入、维护、检索与跨轮使用，为长期交互提供持续状态。这里的外部记忆与引擎内部的 KV cache 分别承担不同职责。

[Neuromem-Benchmark](https://github.com/RIDE-Lab/neuromem-bench) · [Neuromem 论文（ICML 2026）](contents/research_papers/2026/2026_neuromem_icml_2026.pdf)

### FlowRAG · 动态检索器更新

研究 RAG 场景中动态检索器的持续学习，使检索能力随数据演化，为后续推理提供相关上下文。

[FlowRAG 论文（WWW 2026）](contents/research_papers/2026/2026_flowrag_www_2026.pdf)

### StreamFP · 流式数据选择

通过指纹引导的数据选择提高流学习效率，关注持续到来的数据中哪些样本值得用于更新，为数据维护与学习环节提供方法。

[StreamFP 论文（WWW 2026）](contents/research_papers/2026/2026_streamfp_www_2026.pdf)

### GRACE · 动态图维护

降低动态图处理系统中的重构成本，优化持续更新下的数据结构维护，为变化中的图数据提供系统能力。

[GRACE 论文（ICDE 2026）](contents/research_papers/2026/2026_grace_icde_2026.pdf)

### CANDOR-Bench · 动态检索评测

评测动态开放数据流下的内存连续近似最近邻检索，关注写入、检索质量和更新效率之间的权衡。它为持续数据组件提供评测依据，与引擎吞吐和延迟评测共同构成系统验证的不同侧面。

[CANDOR-Bench 论文（SIGMOD 2026）](contents/research_papers/2026/2026_candor_bench_sigmod_2026.pdf)

### BriskSeed · 持续检索中的历史复用

**ICDE 2027 Research First Round 已接收。** 持续插入与删除会使 ANNS 搜索辅助信息失效。BriskSeed 将历史成功搜索结果保存为轻量 seeds，结合按效用管理的两层存储、精确键与签名检索、轻量接受和回退策略，在线加速动态搜索。

它不修改底层 ANNS 索引，也不假设特定图后端。CANDOR-Bench 的统一插件接口提供多后端评测，BriskSeed 则提供优化机制：在高更新率下改善搜索效率并保持有竞争力的召回。该工作属于持续检索与数据状态维护。

[完整题录与研究摘要](contents/research_papers/2027/2027_briskseed_icde_2027.md) · 公开作者版暂未提供。

## 应用与实验入口

[教师数字分身](https://twin.sage.org.ai/) 提供知识问答与成员入口。围绕持续知识问答与长期交互，考察推理性能、状态更新成本和检索质量。欢迎通过 [邮件](mailto:shuhao_zhang@hust.edu.cn) 讨论应用负载与国产算力上的实验合作。

## 共享状态的并发、迁移与恢复

### Spacker · 分布式流处理的状态迁移

将迁移规划与执行解耦，分别控制迁移顺序、推进粒度与副本策略。在 Flink 中统一这些机制，研究时延峰值、迁移完成时间和稳态开销之间的取舍。

[Spacker 论文（ICDCS 2025）](contents/research_papers/2025/2025_spacker_icdcs_2025.pdf)

### RTSFaaS · 有状态 Serverless 工作流

合作研究结合访问亲和性、对象租约与依赖图，通过单边 RDMA 减少远程协调，并维持事务执行约束。

[论文与报告（USENIX ATC 2025）](https://www.usenix.org/conference/atc25/presentation/zhao-jianjun)

### MorphStream

- 面向事务型流处理的系统原型，围绕动态负载下的调度、执行与故障恢复展开。
- 公开入口：[GitHub](https://github.com/intellistream/MorphStream)
- 代表性论文：[MorphStream (SIGMOD 2023)](contents/research_papers/2023/2023_morphstream_sigmod_2023.pdf), [MorphStream Demo (ICDE 2024)](contents/research_papers/2024/2024_morphstream_icde_demo_2024.pdf), [MorphStream (TKDE 2025)](contents/research_papers/2025/2025_morphstream_tkde.pdf)

## 硬件感知执行与流处理

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

## 延伸阅读

这些流处理、异构计算与状态管理工作构成当前系统研究的积累。

[完整论文档案](publications.html) · [研究架构](index.html#research) · [团队与合作](index.html#team)
