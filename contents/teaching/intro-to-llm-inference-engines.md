# 大模型推理系统与实践课程材料

这里发布《大模型推理系统与实践》2027 年首次开课使用的统一课程 PPT。正式课程共 8 讲，每讲 2 小时；另提供中文和英文两个单文件两小时快速介绍版。

## 两小时快速介绍

- 中文速览：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/quick-intro/LLM推理系统_两小时快速介绍.pptx)
- English overview：[PPTX](contents/teaching/llm-inference-systems-english/llm_inference_systems.pptx)

## 2027 课程 PPT（8 讲）

1. 课程导论与评价指标：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第01讲_课程导论与评价指标.pptx)
2. 请求生命周期与 Prefill / Decode：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第02讲_请求生命周期与PrefillDecode.pptx)
3. 请求调度与连续批处理：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第03讲_请求调度与连续批处理.pptx)
4. KV 缓存与状态管理：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第04讲_KV缓存与状态管理.pptx)
5. 推理系统架构与代码阅读：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第05讲_推理系统架构与代码阅读.pptx)
6. 执行优化与异构平台适配：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第06讲_执行优化与异构平台适配.pptx)
7. 论文比较与实验验证：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第07讲_论文比较与实验验证.pptx)
8. 开源实践与课程项目：[PPTX](contents/teaching/intro-to-llm-inference-engines/2027/slides/lectures/第08讲_开源实践与课程项目.pptx)

## 教学组织

8 讲按初学者的认知顺序展开，从请求与指标进入完整推理链路，再覆盖调度、KV 缓存、系统架构、执行优化、实验验证和开源实践。课件通过定义、数字例子、易混淆点和课堂问题逐步解释推理全过程，并穿插 2024–2026 年公开研究案例。

## 近期系统优化研究方向

课程结合公开研究进展，关注推理后端选择、KV 状态管理、上下文复用、异构执行、数据局部性与可复现实验等问题。

| 研究线索 | 研究问题 |
| --- | --- |
| adaptive decode backend selection | 不同 decode 后端在工作负载、模型和硬件条件下的适用边界，以及为什么端到端收益必须用真实请求路径验证 |
| KV plane / agent state | agent 类请求带来的跨步骤状态、KV 生命周期和共享状态管理问题 |
| segment reuse / prefix sharing | 相似上下文、system prompt 和文档片段如何转化为真实运行时复用 |
| KV-Delta | 全量搬运、增量搬运和重新 prefill 对应的系统约束 |
| tiered KV cache | KV 在显存、主机内存和外部介质之间移动时，延迟、容量与调度如何耦合 |
| MLP materialization / small GEMM | 异构硬件上的算子路径、shape、graph capture 和 kernel fallback 如何影响实验可信度 |
| data-parallel locality | prefill / decode 分离和多卡拓扑下的放置决策如何影响尾延迟与资源利用率 |
| workflow-compliant optimization repo | 优化想法如何从问题定义、运行时边界、工作负载来源和证据标签组织成可复现研究 artifact |

课程项目优先来自 vLLM-HUST、vLLM-Ascend-HUST、benchmark 与开发协作中的真实问题。学生需要说明代码路径、实验设置、证据边界和复现方法；尚未完成端到端验证的优化只作为问题分析或实验设计案例，不写成已证明的性能收益。
