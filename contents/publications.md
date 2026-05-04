论文标记说明：[First Author]、[Corresponding Author]、[CCF-A]。

如果下列论文暂时没有直接链接，说明对应 PDF 尚未上传到当前仓库。

## 首页导读

近期工作可以从一个统一视角理解：围绕复杂系统中的共享状态管理展开，并逐步收束到大模型推理基础设施。对非本方向读者来说，可以直接把它理解成三类更具体的问题：请求如何排队、怎样 `batching`、`prefill / decode` 如何组织，以及这些机制怎样影响吞吐和 P99；`KV cache`、算子执行、并行通信和硬件适配怎样决定端到端收益；以及长上下文、RAG 和记忆增强推理中的信息怎样被写入、保留、检索并在后续轮次复用。

## 代表性论文

首页这里先放一组按研究主线整理的代表作入口，便于快速扫读；这些工作共同构成了我当前走向大模型推理基础设施研究的能力底座。完整列表保留在后面。

### 一、共享状态访问、调度与运行时管理
这一类工作主要想解决的是：共享状态访问中的冲突、热点和排队为什么会扩散成系统级性能退化，以及这些问题怎样从“看不见、调不动”推进到“可观测、可建模、可管理”。我们的方案是沿着一条方法链逐步推进：先做路径级冲突观测与共享执行路径优化，再把状态热点、局部性和 NUMA/拓扑代价统一建模，最后沉淀为兼顾稳态执行与恢复控制的运行时调度框架。效果上，这条线把原本依赖经验判断的共享状态访问问题推进成了可计算、可优化、可验证的系统方法，并在代表性工作中实现了显著性能提升与更稳定的运行时控制。

- [TKDE 2025] **Scalable Transactional Stream Processing on Multicore Processors**. Jianjun Zhao, Yancan Mao, Zhonghao Yang, Haikun Liu, Shuhao Zhang. IEEE Transactions on Knowledge and Data Engineering (TKDE), 37(7): 4254-4269, 2025. [Corresponding Author] [CCF-A]
- [SIGMOD 2023] **MorphStream: Adaptive Scheduling for Scalable Transactional Stream Processing on Multicores**. Yancan Mao, Jianjun Zhao, Shuhao Zhang, Haikun Liu, Volker Markl. Proc. ACM Manag. Data (SIGMOD), 1(1), Article 59, 1-26, 2023. [Corresponding Author] [CCF-A]
- [VLDBJ 2024] **A Survey on Transactional Stream Processing**. Shuhao Zhang, Juan Soto, Volker Markl. The VLDB Journal, 33(2): 451-479, 2024. [First Author] [CCF-A]

### 二、状态感知执行优化与软硬件协同设计
这一类工作主要想解决的是：状态相关执行一旦落到复杂硬件上，吞吐、时延、能耗、精度和质量边界会同时耦合，为什么很多局部提速很难稳定兑现为端到端收益。我们的方案是把状态组织、数据通路与执行映射放进同一个协同优化框架里，并进一步把效率边界、质量边界和硬件代价联合建模，而不是只优化单个算子或单个指标。效果上，这条线逐步建立了硬件拓扑协同与多维边界建模的方法体系；在代表性工作中，既验证了质量补偿与误差控制能够支撑稳定收益，也验证了在非对称多核等场景下可以同时显著提升吞吐并降低能耗。

- [NeurIPS 2024] **LibAMM: Empirical Insights into Approximate Computing for Accelerating Matrix Multiplication**. Xianzhi Zeng, Wenchao Jiang, and Shuhao Zhang. Conference on Neural Information Processing Systems (NeurIPS). [Corresponding Author] [CCF-A]
- [SIGMOD 2024] **PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation**. Xianzhi Zeng, Shuhao Zhang, Hongbin Zhong, Hao Zhang, Mian Lu, Zhao Zheng, Yuqiang Chen. Proc. ACM Manag. Data (SIGMOD), 2(1): 1-24, 2024. [Corresponding Author] [CCF-A]
- [TKDE 2024] **CStream: Parallel Data Stream Compression on Multicore Edge Devices**. Xianzhi Zeng, Shuhao Zhang. IEEE Transactions on Knowledge and Data Engineering, 36(11): 5889-5904, 2024. [Corresponding Author] [CCF-A]

### 三、共享状态演化、复用与稳定推理
这一类工作主要想解决的是：在动态场景下，共享状态怎样同时做到持续写入、稳定保留、跨轮复用，并最终支撑长期稳定推理。我们的方案是从在线更新与写入感知出发，逐步推进到写入代价与保留代价协同优化，再进一步把记忆对象组织成可更新、可检索、可复用的中间层，形成“写得进、留得住、用得稳”的跨轮复用链路。效果上，这条线把原本分散的在线更新、历史保留和稳定推理问题收束成了同一条方法链，为长上下文、RAG 和记忆增强推理提供了更低扰动写入、更稳定跨轮复用和更一致的推理支撑。

- [ICML 2026] **Neuromem: A Granular Decomposition of the Streaming Lifecycle in External Memory for LLMs**. Ruicheng Zhang, Xinyi Li, Tianyi Xu, Shuhao Zhang, Xiaofei Liao, Hai Jin. International Conference on Machine Learning (ICML). [CCF-A]
- [ICML 2026] **SAGE: A Dataflow-Native Framework for Modular, Controllable, and Transparent LLM-Augmented Reasoning**. Jun Liu, Peilin Liu, Ruicheng Zhang, Senlei Zhang, Yanbo Chen, Ziao Wang, Jinyun Yang, Mingqi Wang, Shuhao Zhang, Xiaofei Liao, Hai Jin. International Conference on Machine Learning (ICML). [CCF-A]
- [WWW 2026] **FlowRAG: Continual Learning for Dynamic Retriever in Retrieval-Augmented Generation**. Senlei Zhang, Tongjun Shi, Dandan Song, Luan Zhang, Shuhao Zhang, Xiaofei Liao, and Hai Jin. The Web Conference (WWW). [Corresponding Author] [CCF-A]
- [WWW 2026] **StreamFP: Fingerprint-guided Data Selection for Efficient Stream Learning**. Changwu Li, Tongjun Shi, Shuhao Zhang, Binbin Chen, Bingsheng He, Xiaofei Liao, and Hai Jin. The Web Conference (WWW). [Corresponding Author] [CCF-A]
- [ICDM 2024] **MOStream: A Modular and Self-Optimizing Data Stream Clustering Algorithm**. Zhengru Wang, Xin Wang, Shuhao Zhang. International Conference on Data Mining (ICDM). [Corresponding Author]
- [EMNLP 2023] **SentiStream: A Co-Training Framework for Adaptive Online Sentiment Analysis in Evolving Data Streams**. Yuhao Wu, Karthick Sharma, Chun Wei Seah, Shuhao Zhang. Empirical Methods in Natural Language Processing (long paper, main track). [Corresponding Author]

## 完整论文列表

下列列表按研究主题分组，主要覆盖共享状态访问与调度、状态感知执行优化、共享状态演化与复用，以及相关应用与系统研究。

### 一、共享状态访问、调度与运行时管理
- [TKDE] **Scalable Transactional Stream Processing on Multicore Processors**. Jianjun Zhao, Yancan Mao, Zhonghao Yang, Haikun Liu, Shuhao Zhang. IEEE Transactions on Knowledge and Data Engineering (TKDE), 37(7): 4254-4269, 2025. [Corresponding Author] [CCF-A]
- [ICDCS] **Spacker: Unified State Migration for Distributed Streaming**. Yancan Mao, Shuhao Zhang, Richard Ma. International Conference on Distributed Computing Systems.
- [ICDE] **Fast Parallel Recovery for Transactional Stream Processing on Multicores**. Jianjun Zhao, Haikun Liu, Shuhao Zhang, Zhuohui Duan, Xiaofei Liao, Hai Jin, and Yu Zhang. IEEE 40th International Conference on Data Engineering (ICDE). [CCF-A]
- [ICDE] **MorphStream: Scalable Processing of Transactions over Streams**. Siqi Xiang, Zhonghao Yang, Shuhao Zhang, Jianjun Zhao, and Yancan Mao. IEEE 40th International Conference on Data Engineering (ICDE Demo). [Corresponding Author] [CCF-A]
- [VLDBJ] **A Survey on Transactional Stream Processing**. Shuhao Zhang, Juan Soto, Volker Markl. The VLDB Journal, 33(2): 451-479, 2024. [First Author] [CCF-A]
- [ICDE] **Scalable Online Interval Join on Modern Multicore Processors in OpenMLDB**. Hao Zhang, Xianzhi Zeng, Shuhao Zhang, Xinyi Liu, Mian Lu, and Zhao Zheng. IEEE 39th International Conference on Data Engineering (ICDE). [CCF-A]
- [SIGMOD] **MorphStream: Adaptive Scheduling for Scalable Transactional Stream Processing on Multicores**. Yancan Mao, Jianjun Zhao, Shuhao Zhang, Haikun Liu, Volker Markl. Proc. ACM Manag. Data (SIGMOD), 1(1), Article 59, 1-26, 2023. [Corresponding Author] [CCF-A]
- [SIGMOD] **Parallelizing Intra-Window Join on Multicores: An Experimental Study**. Shuhao Zhang, Yancan Mao, Jiong He, Philipp M. Grulich, Steffen Zeuch, Bingsheng He, Richard T. B. Ma, Volker Markl. International Conference on Management of Data (SIGMOD). [First Author] [CCF-A]
- [ICDE] **Towards Concurrent Stateful Stream Processing on Multicore Processors**. Shuhao Zhang, Yingjun Wu, Feng Zhang, Bingsheng He. IEEE 36th International Conference on Data Engineering. [First Author] [CCF-A]
- [SIGMOD] **BriskStream: Scaling Data Stream Processing on Shared-Memory Multicore Architectures**. Shuhao Zhang, Jiong He, Amelie Chi Zhou, Bingsheng He. International Conference on Management of Data (SIGMOD). [First Author] [CCF-A]
- [ICDE] **Multi-Query Optimization for Complex Event Processing in SAP ESP**. Shuhao Zhang, H. T. Vo, D. Dahlmeier, B. He. IEEE 33rd International Conference on Data Engineering. [First Author] [CCF-A]
- [ICDE] **Revisiting the Design of Data Stream Processing Systems on Multi-Core Processors**. Shuhao Zhang, B. He, D. Dahlmeier, A. C. Zhou, T. Heinze. IEEE 33rd International Conference on Data Engineering. [First Author] [CCF-A]

### 二、状态感知执行优化与软硬件协同设计
- [TKDE] **Data-Aware Adaptive Compression for Stream Processing**. Yu Zhang, Feng Zhang, Hourun Li, Shuhao Zhang, Xiaoguang Guo, Yuxing Chen, Anqun Pan, and Xiaoyong Du. IEEE Transactions on Knowledge and Data Engineering (TKDE), 36(9): 4531-4549, 2024. [CCF-A]
- [SIGMOD] **Enabling Adaptive Sampling for Intra-Window Join: Simultaneously Optimizing Quantity and Quality**. Xilin Tang, Feng Zhang, Shuhao Zhang, Yani Liu, Bingsheng He, Xiaoyong Du. Proc. ACM Manag. Data (SIGMOD), 2(4): 1-31, 2024. [CCF-A]
- [SIGMOD] **MAST: Towards Efficient Analytical Query Processing on Point Cloud Data**. Jiangneng Li, Haitao Yuan, Gao Cong, Han Mao Kiah, Shuhao Zhang. Proc. ACM Manag. Data (SIGMOD), 3(1): 1-27, 2025. [CCF-A]
- [NeurIPS] **LibAMM: Empirical Insights into Approximate Computing for Accelerating Matrix Multiplication**. Xianzhi Zeng, Wenchao Jiang, and Shuhao Zhang. Conference on Neural Information Processing Systems (NeurIPS). [Corresponding Author] [CCF-A]
- [SIGMOD] **PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation**. Xianzhi Zeng, Shuhao Zhang, Hongbin Zhong, Hao Zhang, Mian Lu, Zhao Zheng, Yuqiang Chen. Proc. ACM Manag. Data (SIGMOD), 2(1): 1-24, 2024. [Corresponding Author] [CCF-A]
- [TKDE] **CStream: Parallel Data Stream Compression on Multicore Edge Devices**. Xianzhi Zeng, Shuhao Zhang. IEEE Transactions on Knowledge and Data Engineering, 36(11): 5889-5904, 2024. [Corresponding Author] [CCF-A]
- [SIGMOD] **Predictive and Near-Optimal Sampling for View Materialization in Video Databases**. Yanchao Xu, Dongxiang Zhang, Shuhao Zhang, Sai Wu, Zexu Feng, Gang Chen. Proc. ACM Manag. Data (SIGMOD), 2(1): 1-27, 2024. [CCF-A]
- [DEBS] **A Hardware-Conscious Stateful Stream Compression Framework for IoT Applications (Vision)**. Xianzhi Zeng, Shuhao Zhang. International Conference on Distributed and Event-Based Systems (DEBS). [Corresponding Author]
- [ICDE] **Parallelizing Stream Compression for IoT Applications on Asymmetric Multicores**. Xianzhi Zeng and Shuhao Zhang. IEEE 39th International Conference on Data Engineering (ICDE). [CCF-A]
- [ICDE] **CompressStreamDB: Fine-Grained Adaptive Stream Processing without Decompression**. Yu Zhang, Feng Zhang, Hourun Li, Shuhao Zhang, and Xiaoyong Du. IEEE 39th International Conference on Data Engineering (ICDE). [CCF-A]
- [ICDE] **Scalable Machine Learning for Real-Time Fault Diagnosis in Industrial IoT Cooling Roller Systems (SRTFD)**. Dandan Zhao, Karthick Sharma, Yuxin Qi, Qixun Liu, and Shuhao Zhang. IEEE 41st International Conference on Data Engineering (ICDE). [Corresponding Author] [CCF-A]
- [TPDS] **Fine-Grained Multi-Query Stream Processing on Integrated Architectures**. Feng Zhang, Chenyang Zhang, Lin Yang, Cheng Yang, Shuhao Zhang, Bingsheng He, Wei Lu, Xiaoyong Du. IEEE Transactions on Parallel and Distributed Systems (TPDS), 32(9), 2021. [CCF-A]
- [USENIX ATC] **FineStream: Fine-Grained Window-Based Stream Processing on CPU-GPU Integrated Architectures**. Feng Zhang, Lin Yang, Shuhao Zhang, Bingsheng He, Wei Lu, Xiaoyong Du. USENIX Annual Technical Conference (USENIX ATC 20). [CCF-A]
- [SIGMOD Rec.] **Hardware-Conscious Stream Processing: A Survey**. Shuhao Zhang, Feng Zhang, Yingjun Wu, Bingsheng He, Paul Johns. SIGMOD Record, 48(4), 2020. [First Author]

### 三、共享状态演化、复用与稳定推理

- [ICML] **Neuromem: A Granular Decomposition of the Streaming Lifecycle in External Memory for LLMs**. Ruicheng Zhang, Xinyi Li, Tianyi Xu, Shuhao Zhang, Xiaofei Liao, Hai Jin. International Conference on Machine Learning (ICML). [CCF-A]
- [ICML] **SAGE: A Dataflow-Native Framework for Modular, Controllable, and Transparent LLM-Augmented Reasoning**. Jun Liu, Peilin Liu, Ruicheng Zhang, Senlei Zhang, Yanbo Chen, Ziao Wang, Jinyun Yang, Mingqi Wang, Shuhao Zhang, Xiaofei Liao, Hai Jin. International Conference on Machine Learning (ICML). [CCF-A]
- [EMNLP] **SentiStream: A Co-Training Framework for Adaptive Online Sentiment Analysis in Evolving Data Streams**. Yuhao Wu, Karthick Sharma, Chun Wei Seah, Shuhao Zhang. Empirical Methods in Natural Language Processing (long paper, main track). [Corresponding Author]
- [ICDM] **MOStream: A Modular and Self-Optimizing Data Stream Clustering Algorithm**. Zhengru Wang, Xin Wang, Shuhao Zhang. International Conference on Data Mining (ICDM). [Corresponding Author]
- [SIGMOD] **Data Stream Clustering: An In-depth Empirical Study**. Xin Wang, Zhengru Wang, Zhenyu Wu, Shuhao Zhang, Xuanhua Shi, Li Lu. International Conference on Management of Data (SIGMOD). [Corresponding Author] [CCF-A]
- [CVPR] **Ferret: An Efficient Online Continual Learning Framework under Varying Memory Constraints**. Yuhao Zhou, Yuxin Tian, Jindi Lv, Mingjia Shi, Yuanxi Li, Qing Ye, Shuhao Zhang, and Jiancheng Lv. Conference on Computer Vision and Pattern Recognition (CVPR). [CCF-A]
- [WWW] **StreamFP: Fingerprint-guided Data Selection for Efficient Stream Learning**. Changwu Li, Tongjun Shi, Shuhao Zhang, Binbin Chen, Bingsheng He, Xiaofei Liao, and Hai Jin. The Web Conference (WWW). [Corresponding Author] [CCF-A]
- [EMNLP] **A Framework of Knowledge Graph-Enhanced Large Language Model Based on Question Decomposition and Atomic Retrieval**. Yading Li, Dandan Song, Changzhi Zhou, Yuhang Tian, Hao Wang, Ziyi Yang, and Shuhao Zhang. Empirical Methods in Natural Language Processing (Findings).
- [TKDE] **A Framework of Knowledge Graph-Enhanced Large Language Model Based on Global Planning**. Yading Li, Dandan Song, Yuhang Tian, Hao Wang, Changzhi Zhou, and Shuhao Zhang. IEEE Transactions on Knowledge and Data Engineering (TKDE), 38(2), 2025. [CCF-A]
- [WWW] **FlowRAG: Continual Learning for Dynamic Retriever in Retrieval-Augmented Generation**. Senlei Zhang, Tongjun Shi, Dandan Song, Luan Zhang, Shuhao Zhang, Xiaofei Liao, and Hai Jin. The Web Conference (WWW). [Corresponding Author] [CCF-A]
- [SIGMOD] **CANDOR-Bench: Benchmarking In-Memory Continuous ANNS under Dynamic Open-World Streams [Experiments & Analysis]**. Mingqi Wang, Jun Liu, Ruicheng Zhang, Jianjun Zhao, Ruipeng Wan, Xinyan Lei, Shuhao Zhang, Bolong Zheng, Haikun Liu, Xiaofei Liao, and Hai Jin. International Conference on Management of Data (SIGMOD). [Corresponding Author] [CCF-A]

### 其他论文
- [ACL Findings] **Multi-Hop Knowledge Editing via Critic-Guided Multi-Agent Reasoning**. Xudong Li, Yuhang Tian, Dandan Song, Zhijing Wu, Shuhao Zhang, Jun Yang, Yongyu Huo, Changzhi Zhou, Xinyu Zhang, Chenhao Li, Huipeng Ma, Luan Zhang, Yan Xu, Qian Liu. Findings of the Association for Computational Linguistics (ACL 2026 Findings).
- [ACL] **FusionFlow: Enabling Deep Structural Exploration for Automated Agentic Workflow Generation**. Xiang Wang, Zongtao Yang, Zhuojian Hong, Shuhao Zhang, Wei Wei. Annual Meeting of the Association for Computational Linguistics (ACL 2026 Main Conference). [CCF-A]
- [ICDE] **GRACE: Alleviating Reconstruction Cost in Dynamic Graph Processing Systems**. Hongru Gao, Shuhao Zhang, Xiaofei Liao, and Hai Jin. IEEE 42nd International Conference on Data Engineering (ICDE). [Corresponding Author] [CCF-A]
- [SIGMOD] **Select Edges Wisely: Monotonic Path Aware Graph Layout Optimization for Disk-Based ANN Search**. Ziyang Yue, Bolong Zheng, Ling Xu, Kanru Xu, Shuhao Zhang, Yajuan Du, Yunjun Gao, Xiaofang Zhou, and Christian S. Jensen. SIGMOD. [CCF-A]
- [IJCAI] **Detecting Hallucination in Large Language Models through Deep Internal Representation Analysis**. Luan Zhang, Dandan Song, Zhijing Wu, Yuhang Tian, Changzhi Zhou, Jing Xu, Ziyi Yang, and Shuhao Zhang. International Joint Conference on Artificial Intelligence (IJCAI). [CCF-A]
- [NC] **MatSwarm: Trusted Swarm Transfer Learning Driven Materials Computation for Secure Big Data Sharing**. Cheng Xu, Ran Wang, Shuhao Zhang, Fangwen Ye, Yusen Tang, Sisui Tang, Hangning Zhang, Wendi Du, and Xiaotong Zhang. Nature Communications, 15(1), 2024.
- [ICPP] **PREACT: Predictive Resource Allocation for Bursty Workloads in a Co-located Data Center**. Ziyang Xiao, Dongxiang Zhang, Dingyu Yang, Shuhao Zhang, Jian Cao, Gang Chen. International Conference in Parallel Processing (ICPP).
- [IWQoS] **Low-Latency Video Conferencing via Optimized Packet Routing and Reordering**. Yao Xiao, Amelie Chi Zhou, Sitian Chen, Shuhao Zhang, Yi Wang, Rui Mao, Xuan Yang. IEEE International Symposium on Quality of Service.
- [VLDBJ] **Payment Behavior Prediction on Shared Parking Lots with TR-GCN**. Qingyu Xu, Feng Zhang, Mingde Zhang, Jidong Zhai, Bingsheng He, Cheng Yang, Shuhao Zhang, Jiazao Lin, Haidi Liu, Xiaoyong Du. The VLDB Journal, 31(5), 2022. [CCF-A]
- [MDPI Algorithms] **Revisiting the Design of Parallel Stream Joins on Trusted Execution Environments**. Souhail Meftah, Shuhao Zhang, Bharadwaj Veeravalli, Khin Mi Mi Aung. MDPI Algorithms.
- [TKDE] **Periodic Weather-Aware LSTM with Event Mechanism for Parking Behavior Prediction**. F. Zhang, Y. Liu, N. Feng, C. Yang, J. Zhai, Shuhao Zhang, B. He, J. Lin, X. Zhang, X. Du. IEEE Transactions on Knowledge and Data Engineering (TKDE), 34(12), 2022. [CCF-A]
- [OJIOT] **NebulaStream: Complex Analytics Beyond the Cloud**. Steffen Zeuch, Eleni Tzirita Zacharatou, Shuhao Zhang, Xenofon Chatziliadis, Ankit Chaudhary, Bonaventura Del Monte, Dimitrios Giouroukis, Philipp M. Grulich, Ariane Ziehn, Volker Markl. Open Journal of Internet Of Things (OJIOT).
- [IJCAI] **PewLSTM: Periodic LSTM with Weather-Aware Gating Mechanism for Parking Behavior Prediction**. Feng Zhang, Ningxuan Feng, Yani Liu, Cheng Yang, Jidong Zhai, Shuhao Zhang, Bingsheng He, Jiazao Lin, Xiaoyong Du. International Joint Conference on Artificial Intelligence (IJCAI). [CCF-A]
- [BigMM] **TraV: An Interactive Exploration System for Massive Trajectory Data**. J. Ang, T. Fu, J. Paul, Shuhao Zhang, B. He, T. S. D. Wenceslao, S. Y. Tan. IEEE Fifth International Conference on Multimedia Big Data (BigMM). [Corresponding Author]
- [TPDS] **Understanding Co-Running Behaviors on Integrated CPU/GPU Architectures**. F. Zhang, J. Zhai, B. He, Shuhao Zhang, W. Chen. IEEE Transactions on Parallel and Distributed Systems (TPDS). [CCF-A]
- [SC] **Elastic Multi-resource Fairness: Balancing Fairness and Efficiency in Coupled CPU/GPU Architectures**. S. Tang, B. He, Shuhao Zhang, Z. Niu. International Conference for High Performance Computing, Networking, Storage and Analysis (SC). [CCF-A]
- [TPDS] **Melia: A MapReduce Framework on OpenCL-Based FPGAs**. Zeke Wang, Shuhao Zhang, Bingsheng He, Wei Zhang. IEEE Transactions on Parallel and Distributed Systems (TPDS), 27(12): 3547-3560, 2016. [CCF-A]
- [MASCOTS] **To Co-run, or Not to Co-run: A Performance Study on Integrated Architectures**. Feng Zhang, Jidong Zhai, Wenguang Chen, Bingsheng He, Shuhao Zhang. IEEE 23rd International Symposium on Modeling, Analysis, and Simulation of Computer and Telecommunication Systems (MASCOTS).
- [VLDB] **In-Cache Query Co-Processing on Coupled CPU-GPU Architectures**. Jiong He, Shuhao Zhang, Bingsheng He. Proceedings of the VLDB Endowment (PVLDB), 8(4): 329-340, 2014. [CCF-A]
- [VLDB] **OmniDB: Towards Portable and Efficient Query Processing on Parallel CPU/GPU Architectures**. Shuhao Zhang, Jiong He, Bingsheng He, Mian Lu. Proceedings of the VLDB Endowment (PVLDB), 6(12): 1374-1377, 2013. [First Author] [CCF-A]

## 论文下载（PDF）
以下链接提供的是作者保存的作者版本（如 preprint、accepted manuscript 或 author copy），不是期刊、会议论文集或出版社网站上的正式出版版本。

已上传论文的直接下载链接：

- 2026: [FlowRAG (WWW 2026)](contents/research_papers/2026/2026_flowrag_www_2026.pdf), [StreamFP (WWW 2026)](contents/research_papers/2026/2026_streamfp_www_2026.pdf), [GRACE (ICDE 2026)](contents/research_papers/2026/2026_grace_icde_2026.pdf), [CANDOR-Bench (SIGMOD 2026)](contents/research_papers/2026/2026_candor_bench_sigmod_2026.pdf), [Select Edges Wisely (SIGMOD 2026)](contents/research_papers/2026/2026_select_edges_wisely_sigmod_2026.pdf)
- 2025: [Adaptive Sampling (SIGMOD 2025 CR)](contents/research_papers/2024/2024_adaptive_sampling_sigmod_2025_cr.pdf), [SRTFD (ICDE 2025)](contents/research_papers/2025/2025_srtfd_icde_2025.pdf), [Ferret (CVPR 2025)](contents/research_papers/2025/2025_ferret_cvpr_2025.pdf), [Detecting Hallucination (IJCAI 2025)](contents/research_papers/2025/2025_detecting_hallucination_ijcai_2025.pdf), [MorphStream (TKDE 2025)](contents/research_papers/2025/2025_morphstream_tkde.pdf), [Data-Aware Adaptive Compression (TKDE 2025)](contents/research_papers/2025/2025_data_aware_adaptive_compression_tkde_2025.pdf), [Spacker (ICDCS 2025)](contents/research_papers/2025/2025_spacker_icdcs_2025.pdf), [Global Planning KG-LLM (TKDE 2025)](contents/research_papers/2025/2025_global_planning_kg_llm_tkde_2025.pdf), [MAST (SIGMOD 2025)](contents/research_papers/2025/2025_mast_sigmod_2025.pdf)
- 2024: [MOStream (ICDM 2024)](contents/research_papers/2024/2024_mostream_icdm_2024.pdf), [PECJ (SIGMOD 2024)](contents/research_papers/2024/2024_pecj_sigmod_2024.pdf), [PREACT (ICPP 2024)](contents/research_papers/2024/2024_preact.pdf), [LLVC (IWQoS 2024)](contents/research_papers/2024/2024_llvc.pdf), [CStream (TKDE 2024)](contents/research_papers/2024/2024_cstream_tkde_2024.pdf), [MatSwarm (NC 2024)](contents/research_papers/2024/2024_matswarm_nc_2024.pdf), [KELDaR (EMNLP Findings 2024)](contents/research_papers/2024/2024_keldar_emnlp_findings_2024.pdf), [LibAMM (NeurIPS 2024)](contents/research_papers/2024/2024_libamm_neurips_2024.pdf), [Fast Parallel Recovery (ICDE 2024)](contents/research_papers/2024/2024_fast_parallel_recovery_icde_2024.pdf), [MorphStream Demo (ICDE 2024)](contents/research_papers/2024/2024_morphstream_icde_demo_2024.pdf), [Predictive Sampling for Video DB (SIGMOD 2024)](contents/research_papers/2024/2024_predictive_sampling_video_db_sigmod_2024.pdf)
- 2023: [CStream (ICDE 2023)](contents/research_papers/2023/2023_cstream_icde.pdf), [CStream (DEBS 2023)](contents/research_papers/2023/2023_cstream_debs.pdf), [CStream (TKDE 2023)](contents/research_papers/2023/2023_cstream_tkde.pdf), [CompressStreamDB (ICDE 2023)](contents/research_papers/2023/2023_compressstreamdb_icde_2023.pdf), [TSP Survey (VLDBJ 2023)](contents/research_papers/2023/2023_vldbj_tsp_survey.pdf), [MorphStream (SIGMOD 2023)](contents/research_papers/2023/2023_morphstream_sigmod_2023.pdf), [OpenMLDB OIJ (ICDE 2023)](contents/research_papers/2023/2023_openmldb_icde_2023.pdf), [Sesame (SIGMOD 2023)](contents/research_papers/2023/2023_sesame_sigmod_2023.pdf), [SentiStream (EMNLP 2023)](contents/research_papers/2023/2023_sentistream_emnlp_2023.pdf)
- 2022: [Payment Behavior Prediction (VLDBJ 2022)](contents/research_papers/2022/2022_payment_behavior_trgcn_vldbj_2022.pdf), [Parallel Stream Joins on TEE (Algorithms 2022)](contents/research_papers/2022/2022_tee_parallel_stream_joins_algorithms_2022.pdf)
- 2021: [Intra-Window Join (SIGMOD 2021)](contents/research_papers/2021/2021_intra_window_join_sigmod_2021.pdf), [FineStream MQ (TPDS 2021)](contents/research_papers/2021/2021_tpds_finestream_paper_0224v1.pdf), [Periodic Weather-Aware LSTM (TKDE 2021)](contents/research_papers/2021/2021_periodic_weather_aware_lstm_tkde_2021.pdf)
- 2020: [TStream (ICDE 2020)](contents/research_papers/2020/2020_tstream.pdf), [FineStream (USENIX ATC 2020)](contents/research_papers/2020/2020_finestream.pdf), [NebulaStream (OJIOT 2020)](contents/research_papers/2020/2020_nebulastream_ojiot_2020.pdf), [Hardware-Conscious Survey (SIGMOD Rec. 2020)](contents/research_papers/2020/2020_hardware_conscious_stream_processing_survey_sigmod_record_2020.pdf), [PewLSTM (IJCAI 2020)](contents/research_papers/2020/2020_pewlstm_ijcai_2020.pdf)
- 2019: [BriskStream (SIGMOD 2019)](contents/research_papers/2019/2019_briskstream.pdf), [TraV (BigMM 2019)](contents/research_papers/2019/2019_trav_bigmm_2019.pdf)
- 2017: [MOTTO (ICDE 2017)](contents/research_papers/2017/2017_motto.pdf), [Profiling DSP (ICDE 2017)](contents/research_papers/2017/2017_profiling_final.pdf), [Melia (TPDS 2017)](contents/research_papers/2017/2017_melia_tpds_2017.pdf)
- 2016: [SC Paper (SC 2016)](contents/research_papers/2016/2016_sc_paper_sc_2016.pdf), [Co-Run Study (TPDS 2016)](contents/research_papers/2016/2016_co_run_study_tpds_2016.pdf)
- 2015: [To Co-run, or Not to Co-run (MASCOTS 2015)](contents/research_papers/2015/2015_to_co_run_or_not_mascots_2015.pdf)
- 2014: [In-Cache Query Co-Processing (VLDB 2014)](contents/research_papers/2014/2014_in_cache_query_co_processing_vldb_2014.pdf)
- 2013: [OmniDB (VLDB 2013)](contents/research_papers/2013/2013_omnidb_vldb_2013.pdf)
