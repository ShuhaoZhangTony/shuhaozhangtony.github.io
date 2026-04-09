# Coverage Notes

- The raw `research_papers` directory currently contains 60 markdown items.
- This summary tracks 54 venue-level publication records.
- Thesis materials, draft manuscripts, and duplicate source versions in the raw directory are not counted separately here.

# 0. 最新工作补充（2025–2026）

### 0.1 FlowRAG: Continual Learning for Dynamic Retriever in Retrieval-Augmented Generation

**Venue:** WWW - The Web Conference  
**Year:** 2026  
**Authors:** Senlei Zhang, Tongjun Shi, Dandan Song, Luan Zhang, Shuhao Zhang, Xiaofei Liao, Hai Jin  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Retrieval-Augmented Generation (RAG) enhances large language models by leveraging external knowledge, but retrieval quality degrades when corpora evolve continuously and distribution shift accumulates. FlowRAG addresses this challenge by enabling lightweight continual retriever adaptation in evolving corpora. The framework augments the encoder with layer-wise prompt embeddings, introduces cross-layer fusion to capture hierarchical semantic representations, and employs a generator-guided loss to align retrieval decisions with generation likelihoods. Experiments across four domains show that by updating only about 0.64% of the model parameters, FlowRAG consistently improves retrieval accuracy, generation quality, and robustness to forgetting under non-stationary settings.

### 0.2 StreamFP: Fingerprint-guided Data Selection for Efficient Stream Learning

**Venue:** WWW - The Web Conference  
**Year:** 2026  
**Authors:** Changwu Li, Tongjun Shi, Shuhao Zhang, Binbin Chen, Bingsheng He, Xiaofei Liao, Hai Jin  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Stream learning is a natural paradigm for adaptive AI services over evolving user data streams, but it remains challenged by redundant training samples and catastrophic forgetting. StreamFP introduces fingerprints, a set of compact learnable parameter vectors that summarize model state and guide both coreset selection and buffer update. By scoring similarity between incoming data and model fingerprints, StreamFP prioritizes informative new samples while retaining representative historical ones. A lightweight fingerprint attunement plugin further improves accuracy with negligible overhead. The resulting framework improves adaptability and efficiency for stream learning workloads under continuously changing data distributions.

### 0.3 GRACE: Alleviating Reconstruction Cost in Dynamic Graph Processing Systems

**Venue:** ICDE - IEEE 42nd International Conference on Data Engineering  
**Year:** 2026  
**Authors:** Hongru Gao, Shuhao Zhang, Xiaofei Liao, Hai Jin  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Efficient dynamic graph processing is increasingly important for real-time applications, yet existing PMA-based CSR systems suffer from costly reconstruction and frequent rebalancing under intensive updates. GRACE is a lightweight extension that exploits graph structural properties to reduce reconstruction overhead while preserving layout contiguity. It combines a property-guided reservation strategy with cousin-aware rebalancing to reduce copying, traversal, and redundant relocation during updates. Implemented as a modular plugin atop representative dynamic graph systems, GRACE substantially accelerates reconstruction and graph updating while maintaining comparable computing performance.

### 0.4 CANDOR-Bench: Benchmarking In-Memory Continuous ANNS under Dynamic Open-World Streams

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2026  
**Authors:** Mingqi Wang, Jun Liu, Ruicheng Zhang, Jianjun Zhao, Ruipeng Wan, Xinyan Lei, Shuhao Zhang, Bolong Zheng, Haikun Liu, Xiaofei Liao, Hai Jin  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Continuous approximate nearest neighbor search over streaming vector data is increasingly important in open-world settings where distributions drift, noise accumulates, and concurrent access is common. Existing benchmarks focus on static or simplified streaming scenarios and therefore fail to capture the dynamic behavior of real-world workloads. CANDOR-Bench addresses this gap by building a benchmarking framework for in-memory ANNS under dynamic open-world streams, enabling systematic evaluation of ingestion latency, retrieval quality, and update efficiency under high-churn, continuously evolving workloads. The framework provides a reusable basis for studying dynamic vector retrieval systems beyond static ANN settings.

### 0.5 Data-Aware Adaptive Compression for Stream Processing

**Venue:** TKDE - IEEE Transactions on Knowledge and Data Engineering  
**Year:** 2025  
**Authors:** Yu Zhang, Feng Zhang, Hourun Li, Shuhao Zhang, Xiaoguang Guo, Yuxing Chen, Anqun Pan, Xiaoyong Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** This work extends the compressed stream processing line by designing a compression-based stream engine that performs adaptive fine-grained query processing directly on compressed data. The system integrates nine compression methods and a cost model for automatic compression-scheme selection, enabling significantly higher throughput and lower latency than uncompressed stream processing baselines. Compared with prior stream solutions on uncompressed inputs, the framework improves average performance by 3.84×, reduces delay by 68.0%, and saves 68.7% space. Edge trials further show substantial throughput-price and throughput-power gains over cloud-oriented designs.

### 0.6 Scalable Transactional Stream Processing on Multicore Processors

**Venue:** TKDE - IEEE Transactions on Knowledge and Data Engineering  
**Year:** 2025  
**Authors:** Jianjun Zhao, Yancan Mao, Zhonghao Yang, Haikun Liu, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** This journal version further develops MorphStream into a more general transactional stream processing engine for multicores. In addition to adaptive scheduling, it supports non-deterministic state access through a stateful task precedence graph and incorporates a generalized framework for window-based operations via multi-versioned state management. These extensions broaden the applicability of transactional stream processing to dynamic and irregular workloads while preserving strong semantics. Experimental results show up to 3.4× higher throughput and 69.1% lower latency than state-of-the-art alternatives.

### 0.7 Select Edges Wisely: Monotonic Path Aware Graph Layout Optimization for Disk-Based ANN Search

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2026  
**Authors:** Ziyang Yue, Bolong Zheng, Ling Xu, Kanru Xu, Shuhao Zhang, Yajuan Du, Yunjun Gao, Xiaofang Zhou, Christian S. Jensen  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Approximate nearest neighbor (ANN) search is a critical primitive in modern retrieval systems, but disk-based graph indexes often suffer from poor locality and inefficient layout optimization. This work proposes MARGO, a monotonic path-aware graph layout optimization method for disk-based ANN search. It formalizes graph layout quality through an objective that emphasizes edges important to monotonic paths, introduces a greedy optimization strategy to preserve more effective search paths, and further improves efficiency with a two-stage decoupling design. The resulting method improves locality and search efficiency for disk-resident ANN indexes under memory-constrained settings.

# 1. 高效感知与近似计算机制

### 1.1 CompressStreamDB: Fine-Grained Adaptive Stream Processing without Decompression

**Venue:** ICDE - IEEE 39rd International Conference on Data Engineering  
**Year:** 2023  
**Authors:** Yu Zhang, Feng Zhang, Hourun Li, Shuhao Zhang, Xiaoyong Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Stream processing prevails and SQL query on streams has become one of  the most popular application scenarios. For example, in 2021, the global number of active IoT endpoints reaches 12.3 billion. Unfortunately, the increasing scale of data and strict user requests place much pressure  on existing stream processing systems, requiring high processing  throughput with low latency. To further improve the performance of  current stream processing systems, we propose a compression-based stream processing engine, called CompressStreamDB, which enables adaptive  fine-grained stream processing directly on compressed streams, without  decompression. Particularly, CompressStreamDB involves eight compression methods targeting various data types in streams, and it also provides a cost model for dynamically selecting the appropriate compression  methods. By exploring data redundancy among streams, CompressStreamDB  not only saves space in data transmission between client and server, but also achieves high throughput with low latency in SQL query on stream  processing. Our experimental results show that compared to the  state-of-the-art stream processing system on uncompressed streams,  CompressStreamDB achieves 3.24× throughput improvement and 66.0% lower  latency on average. Besides, CompressStreamDB saves 66.8% space.

### 1.2 A Hardware-Conscious Stateful Stream Compression Framework for IoT Applications (Vision)

**Venue:** DEBS - International Conference on Distributed and Event-Based Systems  
**Year:** 2023  
**Authors:** Xianzhi Zeng, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Data stream compression has attracted vast interest in emerging IoT  (Internet of Things) applications. However, adopting stream compression  on IoT applications is non-trivial due to the divergent demands, i.e.,  low energy consumption, high throughput, low latency, high  compressibility, and tolerable information loss, which sometimes  conflict with each other. This is particularly challenging when adopting stateful stream compression algorithms, which rely on *states*,  e.g., a dictionary or model. This paper presents our vision of CStream, a hardware-conscious stateful stream compression framework for IoT  applications. Through careful hardware-conscious optimizations, CStream  will minimize energy consumption while striving to satisfy the divergent performance demands for parallelizing complex stateful stream  compression algorithms for IoT applications.

### 1.3 Parallelizing Stream Compression for IoT Applications on Asymmetric Multicores

**Venue:** ICDE - IEEE 39rd International Conference on Data Engineering  
**Year:** 2023  
**Authors:** Xianzhi Zeng, Shuhao Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Data stream compression attracts much attention recently due to the rise of IoT applications. Thanks to the balanced computational power and  energy consumption, asymmetric multicores are widely used in IoT  devices. This paper introduces CStream, a novel framework for  parallelizing stream compression on asymmetric multicores to minimize  energy consumption without violating the user-specified compressing  latency constraint. Existing works cannot effectively utilize asymmetric multicores for stream compression, primarily due to the non-trivial  asymmetric computation and asymmetric communication effects. To this  end, CStream is developed with the following two novel designs: 1)  fine-grained decomposition, which decomposes a stream compression  procedure into multiple fine-grained tasks to better expose the  task-core affinities under the asymmetric computation effects; and 2)  asymmetry-aware task scheduling, which schedules the decomposed tasks  based on a novel cost model to exploit the exposed task-core affinities  while considering asymmetric communication effects. To validate our  proposal, we evaluate CStream with five competing mechanisms of  parallelizing stream compression algorithms on a recent asymmetric  multicore processor. We evaluate CStream with five competing mechanisms  of parallelizing stream compression algorithms to validate our proposal  on a recent asymmetric multicore processor. Our extensive experiments  based on a benchmark of three algorithms and four datasets show that  CStream outperforms alternative approaches by up to 53% lower energy  consumption without compressing latency constraint violation.

### 1.4 CStream: Parallel Data Stream Compression on Multicore Edge Devices

**Venue:** TKDE - IEEE Transactions on Knowledge and Data Engineering  
**Year:** 2024  
**Authors:** Xianzhi Zeng, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** In the burgeoning realm of Internet of Things (IoT) applications on edge devices, data stream compression has become increasingly pertinent. The integration of added compression overhead and limited hardware  resources on these devices calls for a nuanced software-hardware  co-design. This paper introduces CStream, a pioneering framework crafted for parallelizing stream compression on multicore edge devices. CStream grapples with the distinct challenges of delivering a high compression  ratio, high throughput, low latency, and low energy consumption.  Notably, CStream distinguishes itself by accommodating an array of  stream compression algorithms, a variety of hardware architectures and  configurations, and an innovative set of parallelization strategies,  some of which are proposed herein for the first time. Our evaluation  showcases the efficacy of a thoughtful co-design involving a lossy  compression algorithm, asymmetric multicore processors, and our novel,  hardware-conscious parallelization strategies. This approach achieves a 2.8× compression ratio with only marginal information loss, 4.3× throughput, 65% latency reduction and 89% energy consumption reduction, compared to designs lacking such strategic integration.

### 1.5 PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2024  
**Authors:** Xianzhi Zeng, Shuhao Zhang, Hongbin Zhong, Hao Zhang, Mian Lu, Zhao Zheng, Yuqiang Chen  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Stream Window Join (SWJ), a vital operation in stream analytics,  struggles with achieving a balance between accuracy and latency due to  out-of-order data arrivals. Existing methods predominantly rely on  adaptive buffering, but often fall short in performance, thereby  constraining practical applications. We introduce PECJ, a solution that  proactively incorporates unobserved data to enhance accuracy while  reducing latency, thus requiring robust predictive modeling of stream  oscillation. At the heart of PECJ lies a mathematical formulation of the posterior distribution approximation (PDA) problem using variational  inference (VI). This approach circumvents error propagation while  meeting the low-latency demands of SWJ. We detail the implementation of  PECJ, striking a balance between complexity and generality, and discuss  both analytical and learning-based approaches. Experimental evaluations  reveal PECJ's superior performance. The successful integration of PECJ  into a multi-threaded SWJ benchmark testbed further establishes its  practical value, demonstrating promising advancements in enhancing data  stream processing capabilities amidst out-of-order data.

### 1.6 LibAMM: Empirical Insights into Approximate Computing for Accelerating Matrix Multiplication

**Venue:** NeurIPS - Conference on Neural Information Processing Systems  
**Year:** 2024  
**Authors:** Xianzhi Zeng, Wenchao Jiang, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Matrix multiplication (MM) is pivotal in fields from deep learning to scientific computing, driving the quest for improved computational efficiency. Accelerating MM encompasses strategies like complexity reduction, parallel and distributed computing, hardware acceleration, and approximate computing techniques, namely AMM algorithms. Amidst growing concerns over the resource demands of large language models (LLMs), AMM has garnered renewed focus. However, understanding the nuances that govern AMM’s effectiveness remains incomplete. This study delves into AMM by examining algorithmic strategies, operational specifics, dataset characteristics, and their application in real-world tasks. Through comprehensive testing across diverse datasets and scenarios, we analyze how these factors affect AMM’s performance, uncovering that the selection of AMM approaches significantly influences the balance between efficiency and accuracy, with factors like memory access playing a pivotal role. Additionally, dataset attributes are shown to be vital for the success of AMM in applications. Our results advocate for tailored algorithmic approaches and careful strategy selection to enhance AMM’s effectiveness. To aid in the practical application and ongoing research of AMM, we introduce LibAMM —a toolkit offering a wide range of AMM algorithms, benchmarks, and tools for experiment management. LibAMM aims to facilitate research and application in AMM, guiding future developments towards more adaptive and context-aware computational solutions.

### 1.7 Predictive and Near-Optimal Sampling for View Materialization in Video Databases

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2024  
**Authors:** Yanchao Xu, Dongxiang Zhang, Shuhao Zhang, Sai Wu, Zexu Feng, Gang Chen  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Scalable video query optimization has re-emerged as an attractive research topic in recent years. The OTIF system, a video database with cutting-edge efficiency, has introduced a new paradigm of utilizing view materialization to facilitate online query processing. Specifically, it stores the results of multi-object tracking queries to answer common video queries with sub-second latency. However, the cost associated with view materialization in OTIF is prohibitively high for supporting large-scale video streams.In this paper, we study efficient MOT-based view materialization in video databases. We first conduct a theoretical analysis and establish two types of optimality measures that serve as lower bounds for video frame sampling. In order to minimize the number of processed video frames, we propose a novel predictive sampling framework, namely LEAP, exhibits near-optimal sampling performance. Its efficacy relies on a data-driven motion manager that enables accurate trajectory prediction, a compact object detection model via knowledge distillation, and a robust cross-frame associator to connect moving objects in two frames with a large time gap.Extensive experiments are conducted in 7 real datasets, with 7 baselines and a comprehensive query set, including selection, aggregation and top-k queries. The results show that with comparable query accuracy to OTIF, our LEAP can reduce the number of processed video frames by up to 9× and achieve 5× speedup in query processing time. Moreover, LEAP demonstrates impressive throughput when handling large-scale video streams, as it leverages a single NVIDIA RTX 3090ti GPU to support real-time MOT-based view materialization from 160 video streams simultaneously.

### 1.8 Enabling Adaptive Sampling for Intra-Window Join: Simultaneously Optimizing Quantity and Quality

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2025  
**Authors:** Xilin Tang, Feng Zhang, Shuhao Zhang, Yani Liu, Bingsheng He, Xiaoyong Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Sampling is one of the most widely employed approximations in big data processing. Among various challenges in sampling design, sampling for join is particularly intriguing yet complex. This perplexing problem starts with a classical case where the join of two Bernoulli samples shrinks its output size quadratically and exhibits a strong dependency on the input data, presenting a unique challenge that necessitates adaptive sampling to guarantee both the quantity and quality of the sampled data. The community has made strides in achieving this goal by constructing offline samples and integrating support from indexes or key frequencies. However, when dealing with stream data, due to the need for real-time processing and high-quality analysis, methods developed for processing static data become unavailable. Consequently, a fundamental question arises: Is it possible to achieve adaptive sampling in stream data without relying on offline techniques?To address this problem, we propose FreeSam, which couples hybrid sampling with intra-window join, a key stream join operator. Our focus lies on two widely used metrics: output size, ensuring quantity, and variance, ensuring quality. FreeSam enables adaptability in both the desired quantity and quality of data sampling by offering control on the two-dimensional space spanned by these metrics. Meanwhile, adjustable trade-offs between quality and performance make FreeSam practical for use. Our experiments show that, for every 1% increase in latency limitation, FreeSam can yield a 3.83% increase in the output size while maintaining the level of the estimator's variance. Additionally, we give FreeSam a multi-core implementation and ensure predictability of its latency through both an analytic model and a neural network model. The accuracy of these models is 88.05% and 96.75% respectively.

### 1.9 MAST: Towards Efficient Analytical Query Processing on Point Cloud Data

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2025  
**Authors:** Jiangneng Li, Haitao Yuan, Gao Cong, Han Mao Kiah, Shuhao Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** The proliferation of 3D scanning technology, particularly within autonomous driving, has led to an exponential increase in the volume of Point Cloud (PC) data. Given the rich semantic information contained in PC data, deep learning models are commonly employed for tasks such as object queries. However, current query systems that support PC data types do not process queries on semantic information. Consequently, there is a notable gap in research regarding the efficiency of invoking deep models for each PC data query, especially when dealing with large-scale models and datasets. To address this issue, this work aims to design an efficient approximate approach for supporting PC analysis queries, including PC retrieval and aggregate queries. In particular, we propose a novel framework that delivers approximate query results efficiently by sampling core PC frames within a constrained budget, thereby minimizing the reliance on deep learning models. This framework is underpinned by rigorous theoretical analysis, providing error-bound guarantees for the approximate results if the sampling policy is preferred. To achieve this, we incorporate a multi-agent reinforcement learning-based approach to optimize the sampling procedure, along with an innovative reward design leveraging spatio-temporal PC analysis. Furthermore, we exploit the spatio-temporal characteristics inherent in PC data to construct an index that accelerates the query process. Extensive experimental evaluations demonstrate that our proposed method, MAST, not only achieves accurate approximate query results but also maintains low query latency, ensuring high efficiency.

# 2. 持续演化的流式推理与学习机制

### 2.1 SentiStream: A Co-Training Framework for Adaptive Online Sentiment Analysis in Evolving Data Streams

**Venue:** EMNLP - Empirical Methods in Natural Language Processing (main track)  
**Year:** 2023  
**Authors:** Yuhao Wu, Karthick Sharma, Chun Wei Seah, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Online sentiment analysis has emerged as a crucial component in  numerous data-driven applications, including social media monitoring,  customer feedback analysis, and online reputation management. Despite  their importance, current methodologies falter in effectively managing  the continuously evolving nature of data streams, largely due to their  reliance on substantial, pre-existing labelled datasets. This paper  presents **sentistream**, a  novel co-training framework specifically designed for efficient  sentiment analysis within dynamic data streams. Comprising unsupervised, semi-supervised, and stream merge modules, **sentistream** guarantees constant adaptability to evolving data landscapes. This  research delves into the continuous adaptation of language models for  online sentiment analysis, focusing on real-world applications.  Experimental evaluations using data streams derived from three benchmark sentiment analysis datasets confirm that our proposed methodology  surpasses existing approaches in terms of both accuracy and  computational efficiency.

### 2.2 Data Stream Clustering: An In-depth Empirical Study

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2023  
**Authors:** Xin Wang, Zhengru Wang, Zhenyu Wu, Shuhao Zhang, Xuanhua Shi, Li Lu  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Data Stream Clustering (DSC) plays an important role in mining continuous and unlabeled data streams in real-world applications. Over the last decades, numerous DSC algorithms have been proposed with promising clustering accuracy and efficiency. Despite the significant differences among existing DSC algorithms, they are commonly built around four key design aspects: summarizing data structure, window model, outlier detection mechanism, and offline refinement strategy. However, there is a lack of empirical studies on these key design aspects in the same codebase using real-world workloads with distinct characteristics. As a result, it is difficult for researchers to improve upon the state-of-the-art. In this paper, we conduct such a study of DSC on its four key design aspects. We implemented state-of-the-art variants of all of these design choices in an open-sourced platform from scratch and evaluated them using both real-world and synthetic workloads. Our analysis identifies the fundamental issues and trade-offs of each design choice in terms of both accuracy and efficiency. We even find that combining flexible design choices led to the development of a new algorithm called Benne, which can be tuned to achieve either better accuracy or better efficiency compared to the state-of-the-art.

### 2.3 A Framework of Knowledge Graph-Enhanced Large Language Model Based on Question Decomposition and Atomic Retrieval

**Venue:** EMNLP - Empirical Methods in Natural Language Processing (Findings)  
**Year:** 2024  
**Authors:** Yading Li, Dandan Song, Changzhi Zhou, Yuhang Tian, Hao Wang, Ziyi Yang, Shuhao Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Knowledge graphs (KGs) can provide ex-plainable reasoning for large language models(LLMs), alleviating their hallucination problem.Knowledge graph question answering (KGQA)is a typical benchmark to evaluate the methodsenhancing LLMs with KG. Previous methodson KG-enhanced LLM for KGQA either en-hance LLMs with KG retrieval in a single roundor perform multi-hop KG reasoning in multi-ple rounds with LLMs. Both of them conductretrieving and reasoning based solely on thewhole original question, without any process-ing to the question. To tackle this limitation,we propose a framework of KG-enhanced LLMbased on question decomposition and atomic re-trieval, called KELDaR. We introduce questiondecomposition tree as the framework for LLMreasoning. This approach extracts the implicitinformation of reasoning steps within complexquestions, serving as a guide to facilitate atomicretrieval on KG targeting the atomic-level sim-ple questions at leaves of the tree. Additionally,we design strategies for atomic retrieval, whichextract and retrieve question-relevant KG sub-graphs to assist the few-shot LLM in answeringatomic-level questions. Experiments on KGQAdatasets demonstrate that our framework out-performs existing reasoning-based baselines.And in a low-cost setting without additionaltraining or fine-tuning, our framework achievescompetitive or superior results compared tomost existing training-based baselines.

### 2.4 MOStream: A Modular and Self-Optimizing Data Stream Clustering Algorithm

**Venue:** ICDM - International Conference on Data Mining  
**Year:** 2024  
**Authors:** Zhengru Wang, Xin Wang, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Data stream clustering is a critical operation in various real-world  applications, ranging from the Internet of Things (IoT) to social media  and financial systems. Existing data stream clustering algorithms often  lack the flexibility and self-optimization capabilities needed to adapt  to diverse workload characteristics such as outlier, cluster evolution  and changing dimensions in data points. These limitations manifest in  suboptimal clustering accuracy and computational inefficiency. In this  paper, we introduce MOStream, a modular and self-optimizing data stream  clustering algorithm to dynamically balance clustering accuracy and  computational efficiency at runtime. MOStream distinguishes itself by  its adaptivity, clearly demarcating four pivotal design dimensions: the  summarizing data structure, the window model for handling data  temporality, the outlier detection mechanism, and the refinement  strategy for improving cluster quality. This clear separation  facilitates flexible adaptation to varying design choices and enhances  its adaptability to a wide array of application contexts. We conduct a  rigorous performance evaluation of MOStream, employing diverse  configurations and benchmarking it against 9 representative data stream  clustering algorithms on 4 real-world datasets and 3 synthetic datasets. Our empirical results demonstrate that MOStream consistently surpasses  competing algorithms in terms of clustering accuracy, processing  throughput, and adaptability to varying data stream characteristics.

### 2.5 Scalable Machine Learning for Real-Time Fault Diagnosis in Industrial IoT Cooling Roller Systems

**Venue:** ICDE - IEEE 40rd International Conference on Data Engineering  
**Year:** 2025  
**Authors:** Dandan Zhao, Karthick Sharma, Yuxin Qi, Qixun Liu, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** The CISDI Hot Rolled Strip Cooling Roller Health Monitoring System (HRSCR-HMS) is a platform widely deployed in hot rolled steel manufacturing, providing real-time monitoring, fault diagnosis, and health management for cooling rollers. Operating in industrial IoT environments with high data velocity and volume, the system faces challenges in scaling real-time fault diagnosis due to evolving fault patterns, severe data imbalance, and the need for both diagnostic accuracy and efficiency. Evaluations of state-of-the-art fault diagnosis (FD) methods, including online continual learning (OCL) algorithms like Camel, reveal their limitations in meeting the real-time adaptability and data processing demands of HRSCR-HMS. To address these challenges, we propose SRTFD, a scalable framework tailored for real-time fault diagnosis in industrial IoT systems. SRTFD processes high-velocity data streams using three core innovations: Retrospect Coreset Selection (RCS) for optimizing training efficiency by reducing redundant data, Global Balance Technique (GBT) for robust performance with imbalanced data streams, and Confidence and Uncertainty-driven Pseudo-label Learning (CUPL) for adaptive updates with unlabeled data. Experiments on industrial datasets demonstrate that SRTFD outperforms competing methods, addressing challenges of imbalance, redundancy, and scalability. Integration within HRSCR-HMS validates SRTFD as a practical, scalable solution aligned with the stringent demands of stream data processing in industrial IoT environments.

### 2.6 Ferret: An Efficient Online Continual Learning Framework under Varying Memory Constraints

**Venue:** CVPR - Conference on Computer Vision and Pattern Recognition  
**Year:** 2025  
**Authors:** Yuhao Zhou, Yuxin Tian, Jindi Lv, Mingjia Shi, Yuanxi Li, Qing Ye, Shuhao Zhang, Jiancheng Lv  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** In the realm of high-frequency data streams, achieving real-time  learning within varying memory constraints is paramount. This paper  presents Ferret, a comprehensive framework designed to enhance online  accuracy of Online Continual Learning (OCL) algorithms while dynamically adapting to varying memory budgets. Ferret employs a fine-grained  pipeline parallelism strategy combined with an iterative gradient  compensation algorithm, ensuring seamless handling of high-frequency  data with minimal latency, and effectively counteracting the challenge  of stale gradients in parallel training. To adapt to varying memory  budgets, its automated model partitioning and pipeline planning  optimizes performance regardless of memory limitations. Extensive  experiments across 20 benchmarks and 5 integrated OCL algorithms show  Ferret's remarkable efficiency, achieving up to 3.7\times lower memory overhead to reach the same online accuracy compared to  competing methods. Furthermore, Ferret consistently outperforms these  methods across diverse memory budgets, underscoring its superior  adaptability. These findings position Ferret as a premier solution for  efficient and adaptive OCL framework in real-time environments.    

### 2.7 Detecting Hallucination in Large Language Models through Deep Internal Representation Analysis

**Venue:** IJCAI - International Joint Conference on Artificial Intelligence  
**Year:** 2025  
**Authors:** N/A  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Large language models (LLMs) have demonstrated exceptional performance  across various domains. However, LLMs are prone to hallucinate facts and generate non-factual responses, which can undermine their reliability  in real-world applications. Current hallucinate detection methods suffer from external resource demands, substantial time overhead, difficulty  overcoming LLMs' intrinsic limitation, and insufficient modeling. In  this paper, we propose MHAD, a novel internal-representation-based  hallucination detection method. MHAD utilizes linear probing to select  neurons and layers within LLMs. The selected neurons and layers are  demonstrated with significant awareness of hallucinations at the initial and final generation steps. By concatenating the outputs from these  selected neurons of selected layers at the initial and final generation  steps, a hallucination awareness vector is formed, enabling precise  hallucination detection via a multi-layer perceptron (MLP).  Additionally, we introduce SOQHD, a novel benchmark for evaluating  hallucination detection in Open-Domain QA (ODQA). Extensive experiments  show that MHAD outperforms existing hallucination detection methods  across multiple LLMs, demonstrating superior effectiveness. 

### 2.8 A Framework of Knowledge Graph-Enhanced Large Language Model Based on Global Planning

**Venue:** TKDE - IEEE Transactions on Knowledge and Data Engineering  
**Year:** 2025  
**Authors:** Yading Li, Dandan Song, Yuhang Tian, Hao Wang, Changzhi Zhou, Shuhao Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Knowledge graphs can provide structured support for large language model reasoning, but existing KG-enhanced LLM methods either rely on the original question alone or alternate retrieval and reasoning without sufficient planning. This work proposes KELGoP, a framework of KG-enhanced LLM reasoning based on global planning. It introduces fine-grained question categorization and category-driven decomposition for complex questions, supports controllable atomic retrieval over KG subgraphs, and adapts reasoning strategies according to question-answering performance. Experiments on KGQA workloads show that the framework improves controllability, robustness, and answer quality over existing baselines.

# 3. 高性能流处理系统架构与调度优化

### 3.1 Revisiting the Design of Data Stream Processing Systems on Multi-Core Processors

**Venue:** ICDE - IEEE 33rd International Conference on Data Engineering  
**Year:** 2017  
**Authors:** Shuhao Zhang, B. He, D. Dahlmeier, A. C. Zhou, T. Heinze  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** Driven by the rapidly increasing demand for handling real-time data streams, many data stream processing (DSP) systems have been proposed. Regardless of the different architectures of those DSP systems, they are mostly aiming at scaling out using a cluster of commodity machines and built around a number of key design aspects: a) pipelined processing with message passing, b) on-demand data parallelism, and c) JVM based implementation. However, there lacks a study on those key design aspects on modern scale-up architectures, where more CPU cores are being put on the same die, and the on chip cache hierarchies are getting larger, deeper, and complex. Multiple sockets bring non-uniform memory access (NUMA) effort. In this paper, we revisit the aforementioned design aspects on a modern scale-up server. Specifically, we use a series of applications as micro benchmark to conduct detailed profiling studies on Apache Storm and Flink. From the profiling results, we observe two major performance issues: a) the massively parallel execution model causes serious front-end stalls, which are a major performance bottleneck issue on a single CPU socket, b) the lack of NUMA-aware mechanism causes major drawback on the scalability of DSP systems on multi-socket architectures. Addressing these issues should allow DSP systems to exploit modern scale-up architectures, which also benefits scaling out environments. We present our initial efforts on resolving the above-mentioned performance issues, which have shown up to 3.2x and 3.1x improvement on the performance of Storm and Flink, respectively.

---

### 3.2 Multi-Query Optimization for Complex Event Processing in SAP ESP

**Venue:** ICDE - IEEE 33rd International Conference on Data Engineering  
**Year:** 2017  
**Authors:** Shuhao Zhang, H. T. Vo, D. Dahlmeier, B. He  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** SAP Event Stream Processor (ESP) platform aims at delivering real-time  stream processing and analytics in many time-critical areas such as  Capital Markets, Internet of Things (IoT) and Data Center Intelligence.  SAP ESP allows users to realize complex event processing (CEP) in the  form of pattern queries. In this paper, we present MOTTO - a multi-query optimizer in SAP ESP in order to improve the performance of many  concurrent pattern queries. This is motivated by the observations that  many real-world applications usually have concurrent pattern queries  working on the same data streams, leading to tremendous sharing  opportunities among queries. In MOTTO, we leverage three major sharing  techniques, namely merge, decomposition and operator transformation  sharing, to reduce redundant computation among pattern queries. In  addition, MOTTO supports nested pattern queries as well as pattern  queries with different window sizes. The experiments demonstrate the  efficiency of the MOTTO with real-world application scenarios and  sensitivity studies.

---

### 3.3 BriskStream: Scaling Data Stream Processing on Shared-Memory Multicore Architectures

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2019  
**Authors:** Shuhao Zhang, Jiong He, Amelie Chi Zhou, Bingsheng He  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** We introduce BriskStream, an in-memory data streamprocessing system (DSPSs) specifically designed for modernshared-memory multicore architectures. BriskStream’s keycontribution is an execution plan optimization paradigm,namely RLAS, which takes relative-location (i.e., NUMAdistance) of each pair of producer-consumer operatorsinto consideration. We propose a branch and boundbased approach with three heuristics to resolve theresulting nontrivial optimization problem. The experimentalevaluations demonstrate that BriskStream yields muchhigher throughput and better scalability than existing DSPSson multi-core architectures when processing different typesof workloads.

---

### 3.4 Towards Concurrent Stateful Stream Processing on Multicore Processors

**Venue:** ICDE - IEEE 36th International Conference on Data Engineering  
**Year:** 2020  
**Authors:** Shuhao Zhang, Yingjun Wu, Feng Zhang, Bingsheng He  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** Recent data stream processing systems (DSPSs) can achieve excellent  performance when processing large volumes of data under tight latency  constraints. However, they sacrifice support for concurrent state access that eases the burden of developing stateful stream applications.  Recently, some have proposed managing concurrent state access during  stream processing by modeling state accesses as transactions. However,  these are realized with locks involving serious contention overhead. The coarse-grained processing paradigm adopted in these proposals magnify  contention issues and does not exploit modern multicore architectures to their full potential. This paper introduces TStream, a novel DSPS  supporting efficient concurrent state access on multicore processors.  Transactional semantics is employed like previous work, but scalability  is greatly improved due to two novel designs: 1) dual-mode scheduling,  which exposes more parallelism opportunities, 2) dynamic restructuring  execution, which aggressively exploits the parallelism opportunities  from dual-mode scheduling without centralized lock contentions. To  validate our proposal, we evaluate TStream with a benchmark of four  applications on a modern multicore machine. Experimental results show  that 1) TStream achieves up to 4.8 times higher throughput with similar  processing latency compared to the state-of-the-art and 2) unlike prior  solutions, TStream is highly tolerant of varying application workloads  such as key skewness and multi-partition state accesses.

---

### 3.5 NebulaStream: Complex Analytics Beyond the Cloud

**Venue:** OJIOT - Open Journal of Internet of Things  
**Year:** 2020  
**Authors:** Steffen Zeuch, Eleni Tzirita Zacharatou, Shuhao Zhang, Xenofon Chatziliadis, Ankit Chaudhary, Bonaventura Del Monte, Dimitrios Giouroukis, Philipp M. Grulich, Ariane Ziehn, Volker Markl  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** The arising Internet of Things (IoT) will require significant changes to current stream processing engines (SPEs) to enable large-scale IoT applications. In this paper, we present challenges and opportunities for an IoT data management system to enable complex analytics beyond the cloud. As one of the most important upcoming IoT applications, we focus on the vision of a smart city. The goal of this paper is to bridge the gap between the requirements of upcoming IoT applications and the supported features of an IoT data management system. To this end, we outline how state-of-the-art SPEs have to change to exploit the new capabilities of the IoT and showcase how we tackle IoT challenges in our own system, NebulaStream. This paper lays the foundation for a new type of system that leverages the IoT to enable large-scale applications over millions of IoT devices in highly dynamic and geo-distributed environments. 

---

### 3.6 Hardware-Conscious Stream Processing: A Survey

**Venue:** SIGMOD Rec. - SIGMOD Record  
**Year:** 2020  
**Authors:** Shuhao Zhang, Feng Zhang, Yingjun Wu, Bingsheng He, Paul Johns  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** Data stream processing systems (DSPSs) enable users to express and run  stream applications to continuously process data streams. To achieve  realtime data analytics, recent researches keep focusing on optimizing  the system latency and throughput. Witnessing the recent great  achievements in the computer architecture community, researchers and  practitioners have investigated the potential of adoption  hardware-conscious stream processing by better utilizing modern hardware capacity in DSPSs. In this paper, we conduct a systematic survey of  recent work in the field, particularly along with the following three  directions: 1) computation optimization, 2) stream I/O optimization, and 3) query deployment. Finally, we advise on potential future research  directions.

---

### 3.7 FineStream: Fine-Grained Window-Based Stream Processing on CPU-GPU Integrated Architectures

**Venue:** USENIX ATC - USENIX Annual Technical Conference  
**Year:** 2020  
**Authors:** Feng Zhang, Lin Yang, Shuhao Zhang, Bingsheng He, Wei Lu, Xiaoyong Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Accelerating SQL queries on stream processing by utilizing heterogeneous coprocessors, such as GPUs, has shown to be an effective approach. Most works show that heterogeneous coprocessors bring significant performance improvement because of their high parallelism and computation capacity. However, the discrete memory architectures with relatively low PCI-e bandwidth and high latency have dragged down the benefits of heterogeneous coprocessors. Recently, hardware vendors propose CPU-GPU integrated architectures that integrate CPU and GPU on the same chip. This integration provides new opportunities for fine-grained cooperation between CPU and GPU for optimizing SQL queries on stream processing. In this paper, we propose a data stream system, called FineStream, for efficient window-based stream processing on integrated architectures. Particularly, FineStream performs fine-grained workload scheduling between CPU and GPU to take advantage of both architectures, and it also provides efficient mechanism for handling dynamic stream queries. Our experimental results show that 1) on integrated architectures, FineStream achieves an average 52% throughput improvement and 36% lower latency over the state-of-the-art stream processing engine; 2) compared to the stream processing engine on the discrete architecture, FineStream on the integrated architecture achieves 10.4x price-throughput ratio, 1.8x energy efficiency, and can enjoy lower latency benefits.

---

### 3.8 Fine-Grained Multi-Query Stream Processing on Integrated Architectures

**Venue:** TPDS - IEEE Transactions on Parallel and Distributed Systems  
**Year:** 2021  
**Authors:** Feng Zhang, Chenyang Zhang, Lin Yang, Cheng Yang, Shuhao Zhang, Bingsheng He, Wei Lu, Xiaoyong Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Exploring the sharing opportunities among multiple stream queries is crucial for high-performance stream processing. Modern stream processing necessitates accelerating multiple queries by utilizing heterogeneous coprocessors, such as GPUs, and this has shown to be an effective method. Emerging CPU-GPU integrated architectures 6integrate CPU and GPU on the same chip and eliminate PCI-e bandwidth bottleneck. Such a novel architecture provides new opportunities for improving multi-query performance in stream processing but has not been fully explored by existing systems. We introduce a stream processing engine, called FineStream, for efficient multi-query window-based stream processing on CPU-GPU integrated architectures. FineStream's key contribution is a novel fine-grained workload scheduling mechanism between CPU and GPU to take advantage of both architectures. Particularly, FineStream is able to efficiently handle multiple queries in both static and dynamic streams. Our experimental results show that 1) on integrated architectures, FineStream achieves an average 52 percent throughput improvement and 36 percent lower latency over the state-of-the-art stream processing engine; 2) compared to the coarse-grained strategy of applying different devices for multiple queries, FineStream achieves 32 percent throughput improvement; 3) compared to the stream processing engine on the discrete architecture, FineStream on the integrated architecture achieves 10.4× price-throughput ratio, 1.8× energy efficiency, and can enjoy lower latency benefits.

### 3.9 Parallelizing Intra-Window Join on Multicores: An Experimental Study

**Venue:** SIGMOD - International Conference on Management of Data  
**Year:** 2021  
**Authors:** Shuhao Zhang, Yancan Mao, Jiong He, Philipp M. Grulich, Steffen Zeuch, Bingsheng He, Richard T. B. Ma, Volker Markl  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** The intra-window join (IaWJ), i.e., joining two input streams overa single window, is a core operation in modern stream processingapplications. This paper presents the first comprehensive studyon parallelizing the IaWJ on modern multicore architectures.In particular, we classify IaWJ algorithms into lazy and eagerexecution approaches. For each approach, there are furtherdesign aspects to consider, including different join methods andpartitioning schemes, leading to a large design space. Our resultsshow that none of the algorithms always performs the best, and thechoice of the most performant algorithm depends on: (i) workloadcharacteristics, (ii) application requirements, and (iii) hardwarearchitectures. Based on the evaluation results, we propose a decisiontree that can guide the selection of an appropriate algorithm.

---

### 3.10 Scalable Online Interval Join on Modern Multicore Processors in OpenMLDB

**Venue:** ICDE - IEEE 39rd International Conference on Data Engineering  
**Year:** 2023  
**Authors:** Hao Zhang, Xianzhi Zeng, Shuhao Zhang, Xinyi Liu, Mian Lu, Zhao Zheng  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** OpenMLDB is an open-source machine learning database, that provides a feature platform computing consistent features for training and inference. The online interval join(OIJ ), i.e., joining two input streams over relative time intervals,is becoming a core operation in OpenMLDB. Its costly natureand intrinsic parallelism opportunities have created significant interest in accelerating OIJ on modern multicore processors. In this work, we first present an in-depth empirical study on an existing parallel OIJ algorithm (Key-OIJ ), which applies a key-partitioned parallelization strategy. Key-OIJ has been implemented in Apache Flink and used in real-world applications. However, our study points out the limitations of Key-OIJ ,and reveals that Key-OIJ is not capable of fully exploiting modern multicore processors. Based on our analysis, we propose a new approach, the Scale-OIJ algorithm with a set of optimization techniques. Compared with Key-OIJ , Scale-OIJ is particularly efficient for handling workloads involving fewer keys, large time intervals, and large lateness configurations. The extensive experiments using real workloads have demonstrated the superior performance of Scale-OIJ . Furthermore, we have partially integrated and tested Scale-OIJ in the latest version of OpenMLDB, demonstrating its practicality in a machine learning database.

### 3.11 A Survey on Transactional Stream Processing

**Venue:** VLDBJ - The International Journal on Very Large Data Bases Journal (VLDBJ)  
**Year:** 2023  
**Authors:** Shuhao Zhang, Juan Soto, Volker Markl  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** Transactional stream processing (TSP) strives to create a cohesive model that merges the advantages of both transactional and stream-oriented guarantees. Over the past decade, numerous endeavors have contributed to the evolution of TSP solutions, uncovering similarities and distinctions among them. Despite these advances, a universally accepted standard approach for integrating transactional functionality with stream processing remains to be established. Existing TSP solutions predominantly concentrate on specific application characteristics and involve complex design trade-offs. This survey intends to introduce TSP and present our perspective on its future progression. Our primary goals are twofold: to provide insights into the diverse TSP requirements and methodologies, and to inspire the design and development of groundbreaking TSP systems.

---

### 3.12 MorphStream: Adaptive Scheduling for Scalable Transactional Stream Processing on Multicores

**Venue:** SIGMOD - International Conference on Management of Data (SIGMOD)  
**Year:** 2023  
**Authors:** Yancan Mao, Jianjun Zhao, Shuhao Zhang, Haikun Liu, Volker Markl  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Transactional stream processing engines (TSPEs) differ significantly in their designs, but all rely on non- adaptive scheduling strategies for processing concurrent state transactions. Subsequently, none exploit multicore parallelism to its full potential due to complex workload dependencies. This paper introduces MorphStream, which adopts a novel approach by decomposing scheduling strategies into three dimensions and then strives to make the right decision along each dimension, based on analyzing the decision trade-offs under varying workload characteristics. Compared to the state-of-the-art, MorphStream achieves up to 3.4 times higher throughput and 69.1% lower processing latency for handling real-world use cases with complex and dynamically changing workload dependencies.

---

### 3.13 MorphStream: Scalable Processing of Transactions over Streams

**Venue:** ICDE - IEEE 39rd International Conference on Data Engineering (ICDE Demo)  
**Year:** 2024  
**Authors:** Siqi Xiang, Zhonghao Yang, Shuhao Zhang, Jianjun Zhao, Yancan Mao  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Transactional Stream Processing Engines (TSPEs) form the backbone of modern stream applications handling shared mutable states. Yet, the full potential of these systems, specifically in exploiting parallelism and implementing dynamic scheduling strategies, is largely unexplored. We present MorphStream, a TSPE designed to optimize parallelism and performance for transactional stream processing on multicores. Through a unique three-stage execution paradigm (i.e., planning, scheduling, and execution), MorphStream enables dynamic scheduling and parallel processing in TSPEs. Our experiment showcased MorphStream outperforms current TSPEs across various scenarios and offers support for windowed state transactions and non-deterministic state access, demonstrating its potential for broad applicability.

---

### 3.14 Fast Parallel Recovery for Transactional Stream Processing on Multicores

**Venue:** ICDE - IEEE 39rd International Conference on Data Engineering  
**Year:** 2024  
**Authors:** Jianjun Zhao, Haikun Liu, Shuhao Zhang, Zhuohui Duan, Xiaofei Liao, Hai Jin, Yu Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Transactional stream processing engines (TSPEs) have gained increasing attention due to their capability of processing real-time stream applications with transactional semantics. However, TSPEs remain susceptible to system failures and power outages. Existing TSPEs mainly focus on performance improvement, but still face a significant challenge to guarantee fault tolerance while offering high-performance services. We revisit commonly-used fault tolerance approaches in stream processing and database systems, and find that these approaches do not work well on TSPEs due to complex data dependencies. In this paper, we propose a novel TSPE called MorphStreamR to achieve fast failure recovery while guaranteeing low performance overhead at runtime. The key idea of MorphStreamR is to record intermediate results of resolved dependencies at runtime, and thus eliminate data dependencies to improve task parallelism during failure recovery. MorphStreamR further mitigates the runtime overhead by selectively tracking data dependencies and incorporating workload-aware log commitment. Experimental results show that MorphStreamR can significantly reduce the recovery time by up to 3.1 x while experiencing much less performance slowdown at runtime, compared with other applicable fault tolerance approaches.

### 3.15 PREACT: Predictive Resource Allocation for Bursty Workloads in a Co-located Data Center

**Venue:** ICPP - International Conference in Parallel Processing (ICPP)  
**Year:** 2024  
**Authors:** Ziyang Xiao, Dongxiang Zhang, Dingyu Yang, Shuhao Zhang, Jian Cao, Gang Chen  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Co-locating online latency-critical (LC) services with best-effort (BE) batch jobs in the same server has been widely adopted by modern data centers to improve resource utilization. Various approaches have been proposed to maximize the resources allocated to the BE jobs without SLO (service level objective) violation. However, when facing bursty workloads, existing solutions suffer from poor performance because they cannot react promptly to the sudden and sharp increase of LC service requests. Consequently, these methods result in either a high violation rate of the SLO constraint or low resource utilization caused by conservative allocation strategies. In this paper, we propose PREACT as a predictive and agile resource allocation manager to support bursty workloads in a co-located data center. We devise an accurate and lightweight predictor based on a decomposable time series model to estimate the QPS (queries per second) for LC services in the next time window. Given the predicted QPS, we propose an SLO profiling model based on queuing theory and optimize it with multilayer perceptrons. The model is able to determine the maximum amount of resources that can be allocated to the BE jobs without any SLO violation. We conduct extensive experiments using real trace logs of multiple LC services with bursty workload patterns in a major E-commerce promotion campaign in 2021. The results establish the superiority of PREACT when handling bursty workloads — it incurs the lowest SLO violation and achieves comparable or higher CPU utilization than prior resource managers in a co-located data center.

---

### 3.16 Low-Latency Video Conferencing via Optimized Packet Routing and Reordering

**Venue:** IWQoS - IEEE International Symposium on Quality of Service  
**Year:** 2024  
**Authors:** Yao Xiao, Amelie Chi Zhou, Sitian Chen, Shuhao Zhang, Yi Wang, Rui Mao, Xuan Yang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** In the face of rising global demand for video meetings, managing traffic across geographically distributed (geo-distributed) data centers presents a significant challenge due to the dynamic and limited nature of inter-DC network performance. Facing these issues, this paper introduces two novel techniques, VCRoute and WMJitter, to optimize the performance of geo-distributed video conferencing systems. VCRoute is a routing method designed for audio data packets of video conferences. It treats the routing problem as a Multi-Armed Bandit issue, and utilizes a tailored Thompson Sampling algorithm for resolution. Unlike traditional approaches, VCRoute considers transmitting latency and its variance simultaneously by using Thompson Sampling algorithm, which leads to effective end-to-end latency optimization. In conjunction with VCRoute, we present WMJitter, a watermark-based mechanism for managing network jitter, which can further reduce the end-to-end delay and keep an improved balance between latency and loss rate. Evaluations based on real geo-distributed network performance demonstrate the effectiveness and scalability of VCRoute and WMJitter, offering robust solutions for optimizing video conferencing systems in geo-distributed settings.

---

### 3.17 Scalable Transactional Stream Processing on Multicore Processors

**Venue:** TKDE - IEEE Transactions on Knowledge and Data Engineering (TKDE)  
**Year:** 2025  
**Authors:** Jianjun Zhao, Yancan Mao, Zhonghao Yang, Haikun Liu, Shuhao Zhang  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** Transactional stream processing engines (TSPEs) are central to modern stream applications handling shared mutable states. However, their full potential, particularly in adaptive scheduling, remains largely unexplored. We present MorphStream, a TSPE designed to optimize parallelism and performance for transactional stream processing on multicores. Through a unique three-stage execution paradigm (i.e., planning, scheduling, and execution), MorphStream enables adaptive scheduling under varying workload characteristics. Building on this foundation, MorphStream is further enhanced with support for non-deterministic state access, employing a stateful task precedence graph to handle undefined read/write sets at runtime while guaranteeing transaction semantics. Additionally, MorphStream incorporates a generalized framework for managing window-based operations, enabling efficient tracking and maintenance of overlapping windows using multi-versioned state management. These extensions enhance the system’s ability to process dynamic and irregular workloads. Experimental results demonstrate up to 3.4 times higher throughput and 69.1% lower latency compared to state-of-the-art TSPEs, validating its scalability and adaptability in real-world streaming scenarios.

---

### 3.18 Spacker: Unified State Migration for Distributed Streaming

**Venue:** ICDCS - International Conference on Distributed Computing Systems  
**Year:** 2025  
**Authors:** Yancan Mao, Shuhao Zhang, Richard Ma  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** State migration is a crucial aspect of managing stateful stream processing applications, enabling load balancing, fault tolerance, and dynamic scaling. Existing state migration solutions make performance trade-offs between completion time, latency spike, and system overhead; however, they lack the flexibility to adjust these trade-offs across different application scenarios. In this paper, we propose Spacker, a unified framework that enables configurable state migration for flexible performance trade-offs. Spacker decomposes state migration into fine-grained key-level operations and introduces an abstraction of planning strategy, featuring three tuning knobs, that allow for flexible planning of operations. To further improve the efficiency, we design a non-disruptive migration protocol that minimizes the blocking of data processing during state migration. We have integrated Spacker with Apache Flink and implemented an adaptive planning strategy as an example that realizes the abstraction. Our results show that Spacker, with the planning strategy, can make adaptive planning decisions, based on analyzing the decision trade-offs under varying workload characteristics. It can reduce latency spikes while maintaining appropriate completion time and system overhead compared to statically configured migration solutions.

# 4. 其他课题

---

### 4.1 OmniDB: Towards Portable and Efficient Query Processing on Parallel CPU/GPU Architectures

**Venue:** VLDB - Proceedings of the VLDB Endowment  
**Year:** 2013  
**Authors:** Shuhao Zhang, Jiong He, Bingsheng He, Mian Lu  
**Corresponding Author:** No | **First Author:** Yes  
**Abstract:** Driven by the rapid hardware development of parallel CPU/GPUarchitectures, we have witnessed emerging relational queryprocessing techniques and implementations on those parallelarchitectures. However, most of those implementations arenot portable across different architectures, because theyare usually developed from scratch and target at a specificarchitecture. This paper proposes a kernel-adapter baseddesign (OmniDB), a portable yet efficient query processoron parallel CPU/GPU architectures. OmniDB attemptsto develop an extensible query processing kernel (qKernel)based on an abstract model for parallel architectures, andto leverage an architecture-specific layer (adapter ) to makeqKernel be aware of the target architecture. The goal of Om-niDB is to maximize the common functionality in qKernel sothat the development and maintenance efforts for adaptersare minimized across different architectures. In this demo,we demonstrate our initial efforts in implementing OmniDB,and present the preliminary results on the portability andefficiency.

---

### 4.2 In-Cache Query Co-Processing on Coupled CPU-GPU Architectures

**Venue:** VLDB - Proceedings of the VLDB Endowment  
**Year:** 2014  
**Authors:** Jiong He, Shuhao Zhang, Bingsheng He  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Recently, there have been some emerging processor designs that the CPU and the GPU (Graphics Processing Unit) are integrated in a single chip and share Last Level Cache (LLC). However, the main memory bandwidth of such coupled CPU-GPU architectures can be much lower than that of a discrete GPU. As a result, current GPU query co-processing paradigms can severely suffer from memory stalls. In this paper, we propose a novel in-cache query co-processing paradigm for main memory On-Line Analytical Processing (OLAP) databases on coupled CPU-GPU architectures. Specifically, we adapt CPU-assisted prefetching to minimize cache misses in GPU query co-processing and CPU-assisted decompression to improve query execution performance. Furthermore, we develop a cost model guided adaptation mechanism for distributing the workload of prefetching, decompression, and query execution between CPU and GPU. We implement a system prototype and evaluate it on two recent AMD APUs A8 and A10. The experimental results show that 1) in-cache query co-processing can effectively improve the performance of the state-of-the-art GPU co-processing paradigm by up to 30% and 33% on A8 and A10, respectively, and 2) our workload distribution adaption mechanism can significantly improve the query performance by up to 36% and 40% on A8 and A10, respectively.

---

### 4.3 To Co-run, or Not to Co-run: A Performance Study on Integrated Architectures

**Venue:** MASCOTS - IEEE 23rd International Symposium on Modeling  Analysis  and Simulation of Computer and Telecommunication Systems (MASCOTS)  
**Year:** 2015  
**Authors:** Feng Zhang, Jidong Zhai, Wenguang Chen, Bingsheng He, Shuhao Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Architecture designers tend to integrate both CPUand GPU on the same chip to deliver energy-efﬁcient designs.To effectively leverage the power of both CPUs and GPUs onintegrated architectures, researchers have recently put substantialefforts into co-running a single application on both the CPU andthe GPU of such architectures. However, few studies have beenperformed to analyze a wide range of parallel computation pat-terns on such architectures. In this paper, we port all programsin Rodinia benchmark suite and co-run these programs on theintegrated architecture. We ﬁnd that co-running results are notalways better than running the application on the CPU only orthe GPU only. Among the 20 programs, 3 programs can beneﬁtfrom co-running, 12 programs using GPU only and 2 programsusing CPU only achieve the best performance. The remaining 3programs show no performance preference for different devices.We also characterize the workload and summarize the patternsfor the system insights of co-running on integrated architectures.

---

### 4.4 Elastic Multi-resource Fairness: Balancing Fairness and Efficiency in Coupled CPU-GPU Architectures

**Venue:** SC - International Conference for High Performance Computing  Networking  Storage and Analysis (SC)  
**Year:** 2016  
**Authors:** S. Tang, B. He, Shuhao Zhang, Z. Niu  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Fairness and efficiency are two important concerns for users in a shared computer system, and there tends to be a tradeoff between them. Heterogeneous computing poses new challenging issues on the fair allocation of computational resources among users due to the availability of different kinds of computing devices (e.g., CPU and GPU). Prior work either considers the fair resource allocation separately for each computing device or is unable to balance flexibly the tradeoff between the fairness and system utilization.In this work, we consider an emerging heterogeneous computing system with coupled CPU and GPU into a single chip. We first show that it is essential to have a new fair policy for coupled CPU-GPU architectures that is capable of considering both the CPU and the GPU as a whole in fair resource allocation and being aware of the system utilization maximization. We then propose a fair policy called Elastic Multi-Resource Fairness (EMRF) for coupled CPU-GPU architectures, by modeling CPU and GPU as two resource types and viewing the resource fairness problem as a multi-resource fairness problem. It extends DRF by adding a knob that allows users to tune and balance fairness and performance flexibly, and considers the fair allocation of computational resources as a whole for CPU and GPU devices. We show that EMRF satisfies fairness properties of sharing incentive, envy-freeness and pareto efficiency. Finally, we evaluate EMRF using real experiments, and the results show that EMRF can achieve better performance and fairness.

---

### 4.5 Melia: A MapReduce Framework on OpenCL-Based FPGAs

**Venue:** TPDS - IEEE Transactions on Parallel and Distributed Systems (TPDS)  
**Year:** 2016  
**Authors:** Zeke Wang, Shuhao Zhang, Bingsheng He, Wei Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** MapReduce, originally developed by Google for search applications, has recently become a popular programming framework for parallel and distributed environments. This paper presents an energy-efficient architecture design for MapReduce on Field Programmable Gate Arrays (FPGAs). The major goal is to enable users to program FPGAs with simple MapReduce interfaces, and meanwhile to embrace automatic performance optimizations within the MapReduce framework. Compared to other processors like CPUs and GPUs, FPGAs are (re-)programmable hardware and have very low energy consumption. However, the design and implementation of MapReduce on FPGAs can be challenging: firstly, FPGAs are usually programmed with hardware description languages, which hurts the programmability of the MapReduce design to its users; secondly, since MapReduce has irregular access patterns (especially in the reduce phase) and needs to support user-defined functions, careful designs and optimizations are required for efficiency. In this paper, we design, implement and evaluate Melia, a MapReduce framework on FPGAs. Melia takes advantage of the recent OpenCL programming framework developed for Altera FPGAs, and abstracts FPGAs behind the simple and familiar MapReduce interfaces in C. We further develop a series of FPGA-centric optimization techniques to improve the efficiency of Melia, and a costand resource-based approach to automate the parameter settings for those optimizations. We evaluate Melia on a recent Altera Stratix V GX FPGA with a number of commonly used MapReduce benchmarks. Our results demonstrate that 1) the efficiency and effectiveness of our optimizations and automated parameter setting approach, 2) Melia can achieve promising energy efficiency in comparison with its counterparts on CPUs/GPUs on both single-FPGA and cluster settings.

### 4.6 TraV: An Interactive Exploration System for Massive Trajectory Data

**Venue:** BigMM - IEEE Fifth International Conference on Multimedia Big Data (BigMM)  
**Year:** 2019  
**Authors:** J. Ang, T. Fu, J. Paul, Shuhao Zhang, B. He, T. S. D. Wenceslao, S. Y. Tan  
**Corresponding Author:** Yes | **First Author:** No  
**Abstract:** The proliferation of modern GPS-enabled devices like smartphones have led to significant research interest in large-scale trajectory exploration, which aims to identify all nearby trajectories of a given input trajectory. Trajectory exploration is useful in many scenarios, for example, in identifying incorrect road network information or in assisting users when traveling in unfamiliar geographical regions as it can reveal the popularity of certain routes/trajectories. In this study, we develop an interactive trajectory exploration system, named TraV. TraV allows users to easily plot and explore trajectories using an interactive Graphical User Interface (GUI) containing a map of the geographical region. TraV applies the Hidden Markov Model to calibrate the user input trajectory and then makes use of the massively parallel execution capabilities of modern hardware to quickly identify nearby trajectories to the input provided by the user. In order to ensure a seamless user experience, TraV adopts a progressive execution model that contrasts to the conventional query-before-process model. Demonstration participants will gain experience with TraV and its ability to calibrate user input and analyze billions of trajectories obtained from Grab drivers in Singapore.

---

### 4.7 PewLSTM: Periodic LSTM with Weather-Aware Gating Mechanism for Parking Behavior Prediction

**Venue:** IJCAI - International Joint Conference on Artificial Intelligence (IJCAI)  
**Year:** 2020  
**Authors:** Feng Zhang, Ningxuan Feng, Yani Liu, Cheng Yang, Jidong Zhai, Shuhao Zhang, Bingsheng He, Jiazao Lin, Xiaoyong Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** In big cities, there are plenty of parking spaces, but we often find nowhere to park. For example, New York has 1.4 million cars and 4.4 million on-street parking spaces, but it is still not easy to find a parking place near our destination, especially during peak hours. The reason is the lack of prediction of parking behavior. If we could provide parking behavior in advance, we can ease this parking problem that affects human well-being. We observe that parking lots have periodic parking patterns, which is an important factor for parking behavior prediction. Unfortunately, existing work ignores such periodic parking patterns in parking behavior prediction, and thus incurs low accuracy. To solve this problem, we propose PewLSTM, a novel periodic weather-aware LSTM model that successfully predicts the parking behavior based on historical records, weather, environments, and weekdays. PewLSTM has been successfully integrated into a real parking space reservation system, ThsParking, which is one of the top smart parking platforms in China. Based on 452,480 real parking records in 683 days from 10 parking lots, PewLSTM yields 85.3% parking prediction accuracy, which is about 20% higher than the state-of-the-art parking behavior prediction method. The code and data can be obtained from https://github.com/NingxuanFeng/PewLSTM.

---

### 4.8 Periodic Weather-Aware LSTM with Event Mechanism for Parking Behavior Prediction

**Venue:** TKDE - IEEE Transactions on Knowledge and Data Engineering (TKDE)  
**Year:** 2021  
**Authors:** F. Zhang, Y. Liu, N. Feng, C. Yang, J. Zhai, Shuhao Zhang, B. He, J. Lin, X. Zhang, X. Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** There are plenty of parking spaces in big cities, but we often find nowhere to park. For example, New York has 1.4 million cars and 4.4 million on-street parking spaces, but it is still not easy to find a parking place near our destination, especially during peak hours. The reason is the lack of prediction of parking behavior. If we could provide parking behavior in advance, we can ease this parking problem that affects human well-being. We observe that parking lots have periodic parking patterns, which is an important factor for parking behavior prediction. Unfortunately, existing work ignores such periodic parking patterns in parking behavior prediction, and thus incurs low accuracy. To solve this problem, we propose PewLSTM, a novel periodic weather-aware LSTM model that successfully predicts the parking behavior based on historical records, weather, environments, weekdays, and events. PewLSTM includes a periodic weather-aware LSTM prediction module and an event prediction module, for predicting parking behaviors in regular days and events. PewLSTM is extremely useful for drivers and parking lot owners to improve customer experience. For example, the probability of parking space that will be available soon can be provided even if the parking lot is full. Based on 910,477 real parking records in 904 days from 13 parking lots, PewLSTM yields 93.84% parking prediction accuracy, which is about 30% higher than the state-of-the-art parking behavior prediction method. Additionally, we have analyzed parking behaviors in events like holidays and COVID-19. PewLSTM can handle parking behavior prediction in events and reaches 90.68 percent accuracy.

---

### 4.9 Revisiting the Design of Parallel Stream Joins on Trusted Execution Environments

**Venue:** MDPI Algorithms - MDPI Algorithms  
**Year:** 2022  
**Authors:** Souhail Meftah, Shuhao Zhang, Bharadwaj Veeravalli, Khin Mi Mi Aung  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** The appealing properties of secure hardware solutions such as trusted execution environment (TEE) including low computational overhead, confidentiality guarantee, and reduced attack surface have prompted considerable interest in adopting them for secure stream processing applications. In this paper, we revisit the design of parallel stream join algorithms on multicore processors with TEEs. In particular, we conduct a series of profiling experiments to investigate the impact of alternative design choices to parallelize stream joins on TEE including: (1) execution approaches, (2) partitioning schemes, and (3) distributed scheduling strategies. From the profiling study, we observe three major high-performance impediments: (a) the computational overhead introduced with cryptographic primitives associated with page swapping operations, (b) the restrictive Enclave Page Cache (EPC) size that limits the supported amount of in-memory processing, and (c) the lack of vertical scalability to support the increasing workload often required for near real-time applications. Addressing these issues allowed us to design SecJoin, a more efficient parallel stream join algorithm that exploits modern scale-out architectures with TEEs rendering no trade-offs on security whilst optimizing performance. We present our model-driven parameterization of SecJoin and share our experimental results which have shown up to 4-folds of improvements in terms of throughput and latency.

---

### 4.10 Payment Behavior Prediction on Shared Parking Lots with TR-GCN

**Venue:** VLDBJ - The VLDB Journal  
**Year:** 2022  
**Authors:** Qingyu Xu, Feng Zhang, Mingde Zhang, Jidong Zhai, Bingsheng He, Cheng Yang, Shuhao Zhang, Jiazao Lin, Haidi Liu, Xiaoyong Du  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Shared parking lots are new types of sharing economy and generate a large social impact in our daily lives. Post-use payment is a hallmark method in the shared parking lots: it reflects trust in users and brings convenience to everyone. Accordingly, payment behavior prediction via data science technology becomes extremely important. We cooperate with a real intelligent parking platform, ThsParking, which is one of the top smart parking platforms in China, to study payment prediction, and encounter three challenges. First, we need to process a large volume of data generated every day. Second, a variety of parking related data shall be utilized to build the prediction model. Third, we need to consider the temporal characteristics of input data. In response, we propose TR-GCN, a temporal relational graph convolutional network for payment behavior prediction on shared parking lots, and we build a reminder to remind unpaid users. TR-GCN addresses the aforementioned challenges with three modules. 1) We develop an efficient data preprocessing module to extract key information from big data. 2) We build a GCN-based module with user association graphs from three different perspectives to describe the diverse hidden relations among data, including relations between user profile, temporal relations between parking patterns, and spatial relations between different parking lots. 3) We build an LSTM-based module to capture the temporal information from historical events. Experiments based on 50 real parking lots show that our TR-GCN achieves 91.2% accuracy, which is about 7% higher than the state-of-the-art and the reminder service makes more than half of the late-payment users pay, saving 1.9% loss for shared parking lots.

---

### 4.11 MatSwarm: Trusted Swarm Transfer Learning Driven Materials Computation for Secure Big Data Sharing

**Venue:** NC - Nature Communication  
**Year:** 2024  
**Authors:** Cheng Xu, Ran Wang, Shuhao Zhang, Fangwen Ye, Yusen Tang, Sisui Tang, Hangning Zhang, Wendi Du, Xiaotong Zhang  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** The rapid advancement of Industry 4.0 necessitates close collaboration among material research institutions to accelerate the development of novel materials. However, multi-institutional cooperation faces significant challenges in protecting sensitive data, leading to data silos. Additionally, the heterogeneous and non-independent and identically distributed (non-i.i.d.) nature of material data hinders model accuracy and generalization in collaborative computing. In this paper, we introduce the MatSwarm framework, built on swarm learning, which integrates federated learning with blockchain technology. MatSwarm features two key innovations: a swarm transfer learning method with a regularization term to enhance the alignment of local model parameters, and the use of Trusted Execution Environments (TEE) with Intel SGX for heightened security. These advancements significantly enhance accuracy, generalization, and ensure data confidentiality throughout the model training and aggregation processes. Implemented within the National Material Data Management and Services (NMDMS) platform, MatSwarm has successfully aggregated over 14 million material data entries from more than thirty research institutions across China. The framework has demonstrated superior accuracy and generalization compared to models trained independently by individual institutions.

---

### 4.12 Understanding Co-running Behaviors on Integrated CPU/GPU Architectures

**Venue:** TPDS - IEEE Transactions on Parallel and Distributed Systems (TPDS)  
**Year:** 2016  
**Authors:** Feng Zhang, Jidong Zhai, Bingsheng He, Shuhao Zhang, Wenguang Chen  
**Corresponding Author:** No | **First Author:** No  
**Abstract:** Integrated CPU/GPU architectures make co-running a promising execution mode, but not all programs benefit from jointly using both processors. This work studies co-running behaviors on AMD and Intel integrated architectures across Rodinia, Parboil, and Polybench workloads. The analysis shows that architectural differences between CPUs and GPUs together with limited shared memory bandwidth are the two main constraints on co-running efficiency. Based on these observations, the work further develops a decision-tree-based predictor for co-run friendliness and a profiling-based model for workload partitioning, enabling more effective use of integrated architectures.
