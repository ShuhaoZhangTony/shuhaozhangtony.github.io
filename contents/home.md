# 张书豪

> 华中科技大学计算机学院教授｜大模型推理基础设施（sagellm）与大模型推理服务系统（SAGE）

张书豪，华中科技大学计算机科学与技术学院教授（[个人主页](http://faculty.hust.edu.cn/ZHANG_SHUHAO/zh_CN/index.htm)）。研究聚焦面向大模型时代的系统基础设施：在流数据处理、数据库系统与高性能并行/异构计算的交叉处，构建可扩展、可控、可观测的推理与数据编排框架，支撑检索增强生成（RAG）与多智能体（Multi-Agent）等数据密集型应用。

加入 HUST 之前，曾于新加坡南洋理工大学（NTU）任[助理教授](https://dr.ntu.edu.sg/cris/rp/rp02324/)，并在德国柏林工业大学（TUB）从事博士后研究，长期与分布式数据管理与高效流计算方向的国际团队合作。

**快速入口**

- sagellm：内部推理基础设施项目（暂时为私有仓库，面向合作与课题组同学开放）
- SAGE：https://github.com/intellistream/SAGE
- IntelliStream：https://intellistream.github.io/
- SAGE 文档：https://intellistream.github.io/SAGE-Pub/

---

## 当前研究主线

我更关注“把 AI 应用做成可复用的系统能力”，而不仅是单点模型效果。

### 1) sagellm：大模型推理基础设施

围绕推理服务的可落地性与可运营性，我们推进 **sagellm** 等组件化工程与系统研究，重点包括：

- **多租户推理调度与资源编排**：吞吐/延迟（尤其 p99）/成本之间的系统级权衡
- **请求路由与批处理聚合**：面向真实在线负载的工程策略与评测方法
- **可观测性与稳定性**：指标、日志、追踪、回放/对比实验，面向故障诊断与持续优化
- **面向 RAG/Agent 的服务化接口**：让“记忆-检索-压缩-推理”链路可组合、可替换、可评估

说明：**sagellm 为内部项目（私有仓库）**，用于承载核心工程实现与实验基准。

### 2) SAGE：面向 RAG 与 Multi-Agent 的数据流原生编排框架

我们也在推进系统框架 **SAGE**（Streaming-Augmented Generative Execution）：以声明式数据流与可观测运行时为核心，把 RAG、Agent、Memory、工具调用等复杂工作流变成透明、可优化、可复现的端到端系统。

- 项目仓库：https://github.com/intellistream/SAGE
- 文档站点：https://intellistream.github.io/SAGE-Pub/

---

## 我关注的关键问题

- 向量检索与近似搜索（ANN / Vector DB / Filtering & Hybrid Search）
- 智能体记忆管理与检索增强（Memory / Long-context / Forgetting & Compression）
- 多租户推理调度与系统优化（Serving / Scheduling / SLO / Tail Latency）
- 并行与异构计算的性能工程（CPU/GPU 协同、系统瓶颈定位与优化）

---

## 招生与合作

我们长期招收对“系统研究 + 工程落地”感兴趣的同学加入（硕士/博士/实习生均可）。我们更欢迎：

- 希望做 **系统方向研究** 的同学：围绕真实工作负载，建立可复现实验与清晰指标（吞吐、p95/p99 延迟、成本、稳定性）
- 对 **性能工程与工程实现** 有热情的同学：Python/C++，分布式系统，GPU/异构优化，profiling 与系统调参
- 对 **RAG/Agent** 不满足于“调包”，更想解决检索、记忆、状态、调度等系统瓶颈的同学

如果你准备联系我，建议在邮件中附上：个人简历、研究/项目经历（含代码链接）、你最想做的 1–2 个系统问题（以及你预计如何验证与评估）。

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
