# 张书豪

> 华中科技大学计算机学院教授｜面向大模型推理引擎、推理服务系统与记忆智能体中间件招收硕士/博士/实习生

张书豪，华中科技大学计算机科学与技术学院教授（[个人主页](http://faculty.hust.edu.cn/ZHANG_SHUHAO/zh_CN/index.htm)）。我的研究聚焦 **复杂硬件与动态负载下的高效状态管理**，重点关注并行分布式系统，尤其是大模型推理服务中的访问调度、执行优化与状态复用问题。加入 HUST 前，曾于新加坡南洋理工大学（NTU）任[助理教授](https://openreview.net/profile?id=%7EShuhao_Zhang4)，并在德国柏林工业大学（TUB）从事博士后研究。

当前工作的主要落点是 **大模型推理引擎、推理服务系统与记忆智能体中间件**。目前重点围绕三类问题展开：共享状态的观测、建模与调度；状态感知执行与复杂硬件、服务指标的协同优化；以及上下文、KV cache 与检索记忆的写入、演化与复用。

---

## 核心科学问题

如何在复杂硬件与动态负载下统一管理共享状态的 **访问、执行与演化**，从而支撑并行分布式系统，尤其是大模型推理服务的稳定、高效、可控运行。

---

## 研究板块

我的工作目前主要分为三个相互衔接的板块：

- **共享状态访问与运行时调度**：观测、建模并优化共享状态访问与运行时调度
- **状态感知执行优化**：面向 CPU/GPU/异构硬件的执行协同与性能优化
- **共享状态演化与复用**：围绕上下文、KV 与检索记忆的持续写入、演化与跨轮复用

---

## 当前聚焦

在大模型推理服务方向，我目前重点关注：

- 国产异构算力上的推理引擎与推理服务平台
- 长上下文、KV cache 与多级记忆的统一状态管理
- 面向 online serving 的调度编排、批处理与尾时延控制
- 记忆检索中间件与稳定推理服务
- 推理系统的可观测性、profiling 与端到端性能优化

---

## 当前系统建设

课题组当前的系统工作主要包括三组相互衔接的系统线：

- **[SAGE](https://github.com/intellistream/SAGE)**：面向国产异构算力的大模型推理服务系统，重点覆盖在线 serving、调度编排、可观测性与端到端性能优化
- **Neuromem**（当前开源的是 [Neuromem-Benchmark](https://github.com/intellistream/neruomem-bench)）：面向大模型记忆智能体的中间件系列，重点覆盖流式记忆组织、向量检索、长期记忆写入与跨轮复用
- **[vLLM-HUST](https://github.com/intellistream/vllm-hust)**（含 [Benchmark](https://github.com/intellistream/vllm-hust-benchmark)、[Dev Hub](https://github.com/intellistream/vllm-hust-dev-hub) 等系列仓库）：面向国产算力的华科自研推理引擎底座与插件生态，重点覆盖共享 workload、KV 状态管理、插件化优化与评测工具链

---

## 招生与合作

我们长期招收对 **系统研究 + 工程落地** 感兴趣的硕士、博士和长期实习生，方向聚焦 **大模型推理引擎、推理服务系统与记忆智能体中间件**。

我尤其欢迎具备下面一类或多类特点的同学：

- 对系统研究有兴趣，愿意围绕真实负载做可复现实验与指标设计
- 喜欢性能工程与原型实现，熟悉 Python/C++、分布式系统或 GPU/异构优化
- 想做推理引擎核心问题，例如 batching、scheduling、KV cache 与记忆状态管理、observability 与 benchmarking

如果你做过数据库、操作系统、分布式系统、编译、体系结构、GPU/异构优化，或较硬核的开源系统项目，这些经验通常都很契合。联系我时，建议附上简历、研究/项目经历（含代码链接）以及你最想做的 1–2 个问题。

---

## Publications

完整论文列表见 [Publications](publications)。近期工作发表于 ACL, WWW, SIGMOD, ICDE, TKDE, CVPR, NeurIPS, EMNLP 等会议与期刊。

---

## 联系方式

- Email：shuhao_zhang[at]hust.edu.cn
- 团队主页：https://intellistream.github.io/
