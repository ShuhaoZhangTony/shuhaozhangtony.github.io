# 大模型推理系统与实践课程材料

这里汇总《大模型推理系统与实践》课程 2026 年公开版材料。课程以 vLLM-HUST 真实开源开发为主线，组织学生围绕 issue 认领、环境复现、代码阅读、benchmark 补充、CI 验证、PR 提交和 review 迭代完成实践任务。

共 35 份：讲义与导论 handout 16 份，tutorial 13 份，实验单与课程项目说明 6 份。

材料按三类组织：

- `slides/`：课堂讲义、导论 handout 与实践案例
- `tutorials/`：逐讲 tutorial 题单
- `experiments/`：实验单、课程项目说明与 vLLM-HUST 实践任务

## 讲义与导论

- 课程导论讲义：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/handouts/大模型推理基础设施_课程导论讲义.pdf)
- vLLM-HUST 实践案例与练习补充：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/handouts/大模型推理基础设施_案例与练习补充.pdf)
- 第 1 讲 课程导论：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第01讲_课程导论.pdf)
- 第 2 讲 工作负载与评价指标：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第02讲_工作负载与评价指标.pdf)
- 第 3 讲 请求生命周期：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第03讲_请求生命周期.pdf)
- 第 4 讲 请求调度：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第04讲_请求调度.pdf)
- 第 5 讲 KV 缓存：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第05讲_KV缓存.pdf)
- 第 6 讲 状态管理与记忆组织：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第06讲_状态管理与记忆组织.pdf)
- 第 7 讲 推理系统架构与 vLLM-HUST 代码阅读：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第07讲_推理系统架构.pdf)
- 第 8 讲 执行优化与异构路径：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第08讲_执行优化与异构路径.pdf)
- 第 9 讲 异构平台适配：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第09讲_异构平台适配.pdf)
- 第 10 讲 论文比较方法：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第10讲_论文比较方法.pdf)
- 第 11 讲 实验方法与验证：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第11讲_实验方法与验证.pdf)
- 第 12 讲 vLLM-HUST 开源开发与 PR 工作流：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第12讲_开源系统实践.pdf)
- 第 13 讲 vLLM-HUST 课程项目工作坊：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第13讲_课程项目工作坊.pdf)
- 第 14 讲 PR 汇报与课程总结：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/slides/lectures/大模型推理基础设施_第14讲_课程总结与汇报.pdf)

## 实践主线

课程项目优先来自 vLLM-HUST、vLLM-Ascend-HUST、vLLM-HUST benchmark、dev-hub 等真实仓库的 issue、PR 需求、benchmark 缺口和文档改进任务。学生以 2-3 人为一组，完成 issue 分析、代码路径说明、实验脚本、测试结果、PR 链接或 patch、review 处理记录。评价重点不是孤立 demo，而是是否进入真实开发流程，是否能解释系统瓶颈和代码路径，是否有可复现实验，是否遵守开源协作和工程规范。

## Tutorials

- Tutorial 1 工作负载与评价指标：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_01_工作负载与评价指标.pdf)
- Tutorial 2 请求生命周期与 Prefill / Decode：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_02_请求生命周期与PrefillDecode.pdf)
- Tutorial 3 调度与连续批处理观察：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_03_调度与连续批处理观察.pdf)
- Tutorial 4 KV Cache 与状态组织：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_04_KV_Cache与状态组织.pdf)
- Tutorial 5 状态管理与记忆组织：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_05_状态管理与记忆组织.pdf)
- Tutorial 6 推理系统架构：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_06_推理系统架构.pdf)
- Tutorial 7 执行优化与异构路径：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_07_执行优化与异构路径.pdf)
- Tutorial 8 异构平台适配：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_08_异构平台适配.pdf)
- Tutorial 9 论文比较方法：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_09_论文比较方法.pdf)
- Tutorial 10 实验方法与验证：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_10_实验方法与验证.pdf)
- Tutorial 11 vLLM-HUST 开源开发与 PR 工作流：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_11_开源系统实践.pdf)
- Tutorial 12 vLLM-HUST 课程项目工作坊：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_12_课程项目工作坊.pdf)
- Tutorial 13 PR 汇报与课程总结：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/tutorials/Tutorial_13_课程总结与汇报.pdf)

## 实验单与项目说明

- 实验 1 最小运行与代码地图：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/experiments/nano-vLLM实验课/experiment_1_最小运行与代码地图/sheet.pdf)
- 实验 2 请求生命周期观察：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/experiments/nano-vLLM实验课/experiment_2_请求生命周期观察/sheet.pdf)
- 实验 3 调度与连续批处理实验：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/experiments/nano-vLLM实验课/experiment_3_调度与连续批处理实验/sheet.pdf)
- 实验 4 KV 状态与缓存组织实验：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/experiments/nano-vLLM实验课/experiment_4_KV状态与缓存组织实验/sheet.pdf)
- 实验 5 指标观测与最小复现实验：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/experiments/nano-vLLM实验课/experiment_5_指标观测与最小复现实验/sheet.pdf)
- vLLM-HUST 课程项目实验说明：[PDF](contents/teaching/intro-to-llm-inference-engines/2026/experiments/nano-vLLM实验课/project_课程项目实验说明/sheet.pdf)
