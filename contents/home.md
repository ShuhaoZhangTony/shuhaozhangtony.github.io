# 张书豪

> 华中科技大学计算机学院教授｜面向大模型推理引擎与推理系统招收硕士/博士/实习生

张书豪，华中科技大学计算机科学与技术学院教授（[个人主页](http://faculty.hust.edu.cn/ZHANG_SHUHAO/zh_CN/index.htm)）。我目前的核心兴趣是 **大模型推理引擎与推理服务系统**。如果你想做的不只是 prompt engineering 或模型调用封装，而是想真正研究和实现 **高性能、低成本、可观测、可扩展** 的推理系统底座，这里会比较适合你。

加入 HUST 之前，曾于新加坡南洋理工大学（NTU）任[助理教授](https://dr.ntu.edu.sg/cris/rp/rp02324/)，并在德国柏林工业大学（TUB）从事博士后研究，长期与分布式数据管理、高性能流计算和数据系统方向的国际团队合作。我的背景更偏系统研究，因此我尤其欢迎希望把大模型推理做成严肃系统问题的同学加入，例如：**serving engine、KV cache / state 管理、调度与 batching、profiling 与性能优化**。

一句话概括我现在最想做的事情：**把大模型从“能跑”变成“能高效、稳定、可观测、可持续演进地运行”。**

**快速入口**

- sagellm：内部推理基础设施项目（暂时为私有仓库，面向合作与课题组同学开放）
- IntelliStream：https://intellistream.github.io/

---

## 当前研究主线

我更关注“把 AI 应用做成可复用的系统能力”，而不仅是单点模型效果。对我来说，大模型的价值不只在模型本身，更在于能否把它们做成 **可部署、可复现、可优化、可长期演进** 的系统。

如果你对下面这些问题感兴趣，那么我们的方向大概率是匹配的：为什么同一个模型在不同 runtime 上表现差异很大？为什么线上吞吐、时延、成本和稳定性很难同时做好？为什么 KV cache、batching、调度、长上下文和可观测性会决定推理系统的上限？这些问题本质上都不是“调参问题”，而是 **系统问题**。

### sagellm：大模型推理基础设施

围绕推理服务的可落地性与可运营性，我们推进 **sagellm** 等组件化工程与系统研究，重点包括：

- **多租户推理调度与资源编排**：吞吐/延迟（尤其 p99）/成本之间的系统级权衡
- **请求路由与批处理聚合**：面向真实在线负载的工程策略与评测方法
- **可观测性与稳定性**：指标、日志、追踪、回放/对比实验，面向故障诊断与持续优化
- **推理状态管理**：KV cache、前缀复用、长上下文、分离式 prefill/decode、冷热分层与生命周期控制
- **面向国产硬件的推理优化**：算子瓶颈分析、吞吐-时延-成本协同优化、runtime 机制设计

说明：**sagellm 为内部项目（私有仓库）**，用于承载核心工程实现、实验基准与系统原型。如果你希望做的是类似 vLLM / SGLang / TensorRT-LLM 背后的那类问题，但希望把研究问题做得更系统、更可发表，也欢迎联系我。

---

## 我关注的关键问题

- 多租户推理调度与系统优化（Serving / Scheduling / SLO / Tail Latency）
- 大模型推理引擎与运行时（Prefill/Decode、KV Cache、Disaggregated Serving、State Management）
- 并行与异构计算的性能工程（CPU/GPU 协同、系统瓶颈定位与优化）

---

## 招生与合作

我们长期招收对“系统研究 + 工程落地”感兴趣的同学加入（硕士/博士/实习生均可）。如果你想做 **大模型推理引擎与推理服务系统**，欢迎直接联系我。

我尤其希望招到两类同学：一类是愿意把问题抽象清楚、把实验做扎实的系统研究型同学；另一类是愿意把原型真正做出来、把性能打透的工程型同学。最好两者兼具。

我们更欢迎：

- 希望做 **系统方向研究** 的同学：围绕真实工作负载，建立可复现实验与清晰指标（吞吐、p95/p99 延迟、成本、稳定性）
- 对 **性能工程与工程实现** 有热情的同学：Python/C++，分布式系统，GPU/异构优化，profiling 与系统调参
- 想做 **推理引擎核心问题** 的同学：例如 batching、scheduling、cache/state 管理、prefix reuse、disaggregation、observability、benchmarking

你在组里做的事情，通常不会只是“把某个模型跑起来”，而会更接近下面这些问题：

- 如何把真实在线负载抽象成可研究、可验证的系统问题
- 如何为推理引擎设计指标、基线、benchmark 和可复现实验
- 如何在性能、成本、稳定性和效果之间做系统级权衡
- 如何把原型系统做成别人可以复用、对比、扩展的研究资产

如果你已经做过数据库、操作系统、分布式系统、编译、体系结构、GPU/异构优化，或者做过较硬核的开源系统项目，那么这些经验通常都能很自然地迁移到这里。

如果你准备联系我，建议在邮件中附上：个人简历、研究/项目经历（含代码链接）、你最想做的 1–2 个系统问题（以及你预计如何验证与评估）。

---

## Prospective Students

如果你希望申请硕士、博士或长期实习，并且对 **LLM inference engines / serving systems** 感兴趣，可以直接给我发邮件。

### 我通常更看重什么

- 是否对 **系统问题** 本身有兴趣，而不只是“把模型跑起来”
- 是否愿意自己定义问题、设计指标、搭建 baseline、分析 bottleneck、完成 end-to-end 验证
- 是否写过较完整的项目代码，尤其是数据库、操作系统、分布式系统、编译、GPU/异构优化、检索系统或高性能服务系统相关项目
- 是否能把一个想法落成可运行、可测试、可复现的原型系统

### 你加入后大概率会做什么

- LLM inference engine：batching、scheduling、KV cache、prefix reuse、state management、disaggregated serving
- Performance engineering：profiling、trace analysis、bottleneck localization、CPU/GPU/heterogeneous optimization

### 联系我时建议附上什么

- 一页左右的简历
- 你做过的 1–3 个最能代表你的项目或研究，最好附 GitHub / code / demo / technical report 链接
- 你最想做的 1–2 个问题，以及你打算如何验证它
- 如果有，也欢迎附上成绩单、论文、比赛、开源贡献或技术博客

### 一封邮件最好能让我快速看见这三件事

- 你为什么想做 **推理引擎 / 推理系统**，而不是泛 AI 应用
- 你已经具备哪些系统能力
- 你来了之后最想先做哪个问题

如果你的背景更偏系统而不是算法，这通常不是短板，反而很可能是优势。对这个方向来说，**把复杂 AI workload 做成高质量系统** 的能力往往比单点模型调参更稀缺。

---

## 代表性学术与社区服务（Selected）

- VLDB 2027 Review Board
- SC 2023, 2025，2026 Program Committee Member
- KDD 2025, 2026 Program Committee Member
- ICDE 2024 TKDE Poster Track Chair
- CIKM 2024 Program Committee Member
- DASFAA 2024 Program Committee Member
- SDM 2024 Program Committee Member

---

## 主持与参与项目（摘要）

- 国家科技部重大项目：课题负责人
- 国家级优秀青年人才项目
- 华为东湖青年学者项目
- （已结题）新加坡国立研究基金会项目
- （已结题）新加坡教育部 Tier 2 基金项目
- （已结题）多项校企合作项目

---

## 联系方式

- Email：shuhao_zhang[at]hust.edu.cn
- 团队主页：https://intellistream.github.io/
