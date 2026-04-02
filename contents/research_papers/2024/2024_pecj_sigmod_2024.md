PDF Download
3639268.pdf
13 March 2026
Total Citations: 2
Total Downloads: 711

Published: 26 March 2024

Citation in BibTeX format

Latest updates: hps://dl.acm.org/doi/10.1145/3639268

RESEARCH-ARTICLE
PECJ: Stream Window Join on Disorder Data Streams
with Proactive Error Compensation

XIANZHI ZENG, Singapore University of Technology and Design,
Singapore City, Singapore

SHUHAO ZHANG, Nanyang Technological University, Singapore City,
Singapore

HONGBIN ZHONG, 4Paradigm Inc., Beijing, China

HAO ZHANG, 4Paradigm Inc., Beijing, China

MIAN LU, 4Paradigm Inc., Beijing, China

ZHAO ZHENG, 4Paradigm Inc., Beijing, China

View all

Open Access Support provided by:

4Paradigm Inc.

Singapore University of Technology and Design

Nanyang Technological University

.

Proceedings of the ACM on Management of Data, Volume 2, Issue 1 (March 2024)
hps://doi.org/10.1145/3639268
EISSN: 2836-6573

.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
.
PECJ: Stream Window Join on Disorder Data Streams with
Proactive Error Compensation

XIANZHI ZENG, Singapore University of Technology and Design, Singapore
SHUHAO ZHANG, Nanyang Technological University, Singapore
HONGBIN ZHONG, 4paradigm Inc., Beijing
HAO ZHANG, 4paradigm Inc., Singapore
MIAN LU, 4paradigm Inc., Singapore
ZHAO ZHENG, 4paradigm Inc., Beijing
YUQIANG CHEN, 4paradigm Inc., Beijing

Stream Window Join (SWJ), a vital operation in stream analytics, struggles with achieving a balance between
accuracy and latency due to out-of-order data arrivals. Existing methods predominantly rely on adaptive
buffering, but often fall short in performance, thereby constraining practical applications. We introduce
PECJ, a solution that proactively incorporates unobserved data to enhance accuracy while reducing latency,
thus requiring robust predictive modeling of stream oscillation. At the heart of PECJ lies a mathematical
formulation of the posterior distribution approximation (PDA) problem using variational inference (VI). This
approach circumvents error propagation while meeting the low-latency demands of SWJ. We detail the
implementation of PECJ, striking a balance between complexity and generality, and discuss both analytical
and learning-based approaches. Experimental evaluations reveal PECJ’s superior performance. The successful
integration of PECJ into a multi-threaded SWJ benchmark testbed further establishes its practical value,
demonstrating promising advancements in enhancing data stream processing capabilities amidst out-of-order
data.

CCS Concepts: • Information systems → Stream management; • Mathematics of computing →
Variational methods.

Additional Key Words and Phrases: data stream, variational methods, out-of-order arrival, error compensation

ACM Reference Format:
Xianzhi Zeng, Shuhao Zhang, Hongbin Zhong, Hao Zhang, Mian Lu, Zhao Zheng, and Yuqiang Chen. 2024.
PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation. Proc. ACM Manag.
Data 2, 1 (SIGMOD), Article 13 (February 2024), 24 pages. https://doi.org/10.1145/3639268

1 INTRODUCTION

Stream Window Join (SWJ) is an operation for joining two input streams within distinct, finite
subsets, or ‘windows’, of infinite streams. SWJ, a crucial component of data stream analytics [49],
departs from traditional relational join operations. Rather than waiting for the full input data
to become available, SWJ is tasked with generating join results in real-time. This requirement

Zeng,

addresses: Xianzhi

Singapore,
Authors’
xianzhi_xianzhi@mymail.sutd.edu.sg;
Singapore,
shuhao.zhang@ntu.edu.sg; Hongbin Zhong, 4paradigm Inc., Beijing, zhonghongbin@4paradigm.com; Hao Zhang,
4paradigm Inc., Singapore, zhanghao@4paradigm.com; Mian Lu, 4paradigm Inc., Singapore, lumian@4paradigm.com;
Zhao Zheng, 4paradigm Inc., Beijing, zhengzhao@4paradigm.com; Yuqiang Chen, 4paradigm Inc., Beijing,
chenyuqiang@4paradigm.com.

Singapore University
Zhang,

and Design,
University,

Technology
Technological

of
Nanyang

Shuhao

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike
International 4.0 License.

© 2024 Copyright held by the owner/author(s).
ACM 2836-6573/2024/2-ART13
https://doi.org/10.1145/3639268

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:2

Xianzhi Zeng et al.

arises from its essential role across various sectors, such as financial markets [13], fraud detection
systems [2], and sensor networks [35].

One of the challenges complicating SWJ is the disorderly arrival of data, primarily due to factors
like network delays, often termed as stream oscillation [6, 7, 9]. The management of these disordered
data streams typically involves buffering input data [22, 23], providing a more comprehensive
view of in-window data, thereby facilitating higher accuracy results from running SWJ directly
on potentially disordered data streams. However, the additional buffering time needed to gain
this comprehensive view often leads to substantial latency costs. These costs become particularly
pronounced when waiting for straggling tuples, a situation exacerbated by the non-linear nature of
SWJ [22, 49].

To address these issues, we propose a novel solution: PECJ (Proactive Error Compensation-Join)
algorithm, designed to proactively manage disordered data streams. Unlike existing methods,
which rely exclusively on already-arrived data (i.e., in-window data), PECJ actively takes into
account the contributions of future, disordered data to enhance join accuracy. This innovative
approach to disorder management introduces a promising avenue for achieving significant accuracy
enhancements without corresponding increases in latency. Notably, while subjects such as disorder
handling parallelization [27, 29, 34] and efficient buffer structures [11] have been thoroughly
explored in prior studies, these aspects are orthogonal to our work.

Application Example: Consider a sophisticated online anomaly detection system deployed in a
stock exchange data center [3]. This system aims to identify irregular trading behaviors, such as
“malicious short-selling” [15], through routine evaluations. It functions within designated time-
based windows and employs intra-window joins1 [49] to establish correlations between quotes and
trades. Subsequent to this correlation, an aggregation function, commonly 𝐶𝑂𝑈 𝑁𝑇 (), generates a
scalar output that acts as the basis for issuing alerts. The complexity escalates when factoring in
stream oscillations, which can be induced by network latencies, data source inconsistencies, and
even geopolitical events affecting the timeliness of data streams. For example, consider an overseas
transaction potentially aimed at malicious short-selling; it would ideally be processed within a
latency as low as 200ms [14]. However, due to the unpredictable effects of stream oscillations,
this transaction might experience significant delays, potentially as long as 800ms or more [17].
Traditional methods [9, 22, 23, 29] present two undesirable options: either wait for the delayed data,
risking further latency, or proceed with incomplete data, which risks inaccuracy. Both options are
problematic in a high-stakes financial environment. PECJ offers a proactive approach for identifying
suspect trading activities by integrating predictive analytics for delayed data. By utilizing variational
inference methods for estimating the posterior distribution of unobserved data, PECJ achieves a
balance between computational efficiency and prediction accuracy unparalleled by existing methods.
This enables the system to operate effectively even in latency-sensitive financial contexts.

Contributions and Outline: PECJ aims to augment the reliability of SWJ by proactively accounting
for the yet-to-arrive disordered data, without incurring additional latency. The architecture of
PECJ is founded on a three-stage approach. In the first stage, we redefine the problem of SWJ
with disordered data streams as a Posterior Distribution Approximation (PDA) problem. This avoids
the pitfalls of single data-point predictions and instead focuses on the collective impact of all
unobserved data. This framework is compatible with any scalar-output aggregation functions, such
as 𝑆𝑈 𝑀 (), and 𝐶𝑂𝑈 𝑁𝑇 (), without requiring per-tuple decompositions. The second stage focuses
on the optimization of our probabilistic model’s parameters. Instead of utilizing the conventional
but impractical brute-force parameterization, we propose to employ Variational Inference (VI)

1This is a specific type of SWJ; see Section 2.1 for more details.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:3

techniques to enhance efficiency [21, 42]. The final stage translates these concepts into practice
through two implementations: PECJ analytical for simpler cases and PECJ learning for more complex
scenarios. PECJ analytical employs low-overhead linear modeling, while PECJ learning uses neural
networks for improving posterior distribution accuracy.

The efficacy of PECJ is principally evaluated through a comprehensive algorithmic comparison,
substantiating its advantages over existing methods [9, 22]. As a supplementary validation, PECJ
is also integrated into AllianceDB, a multi-threaded SWJ benchmark testbed [49]. This additional
evaluation demonstrates PECJ’s robustness in mitigating out-of-order processing errors while
upholding scalability. Although our primary experiments focus on intra-window joins with 𝑆𝑈 𝑀 ()
and 𝐶𝑂𝑈 𝑁𝑇 () as example aggregations, PECJ’s mathematical formulation accommodates a wide
array of scalar-output aggregations. Its flexibility also allows for future adaptability to other SWJ
variants. Issues concerning computational reuse in alternative types of SWJ are designated for
future research [37, 39, 43].

• Section 3 introduces the PECJ algorithm, tailored to balance both accuracy and latency in SWJ
operations amid disordered data. The distinct advantage of PECJ lies in its proactive approach
of incorporating the impact of yet-to-be-seen data for join error compensation.

• In Section 4, we delve into the mathematical formulation of how PECJ addresses the challenge
of forecasting the effects of stream oscillation. The disorder SWJ handling is initially abstracted
into a posterior distribution approximation (PDA) problem, which is followed by optimizing the
parameterization of its probability model via variational inference (VI).

• Section 5 presents two practical implementations of PECJ, demonstrating its adaptability.
We begin with a straightforward, analytical implementation suitable for less severe stream
oscillation and gradually progress to a more generalized form (learning-based) that employs
machine learning for handling complex oscillation cases.

• Our experimental results, highlighted in Section 6, offer a comprehensive comparison between
PECJ and the existing state-of-the-art methods. We provide data from both standalone tests and
system integration tests, underscoring the superior performance of PECJ.

2 PRELIMINARY

This section provides a detailed introduction to Stream Window Join (SWJ), including the buffering
mechanisms for handling disorder prevalent in existing research. Afterwards, we introduce a better
strategy than state-of-art and discuss its technical challenges.

2.1 Stream Window Join and Key Definitions

Table 1 summarizes the notations used in this paper. For the purposes of this paper, we define a
tuple 𝑦 as 𝑦 = 𝜏𝑒𝑣𝑒𝑛𝑡 ,𝜅,𝑣,𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 ,𝜏𝑒𝑚𝑖𝑡 , where 𝜏𝑒𝑣𝑒𝑛𝑡 , 𝜅, and 𝑣 represent the event timestamp, key, and
payload of the tuple, respectively. The tuple’s arrival time at a system is denoted by 𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 , while
𝜏𝑒𝑚𝑖𝑡 signifies the moment the final result incorporating 𝑦 is released to the user. An input stream,
referred to as 𝑅 or 𝑆, is a sequence of tuples arriving at the system (e.g., a query processor), which
may arrive out-of-order with respect to their event timestamp.

We adopt the windows concept from Zhang et al. [49] to handle infinite stream joins over
limited subsets of data. Here, a window is defined as an arbitrary time range [𝑡1, 𝑡2], denoted
as W = [𝑡1, 𝑡2]. A tuple 𝑦 is considered part of W if its timestamp 𝑡𝑒 falls within this range. The
length of the window is represented as |W|. As discussed in the motivating example in Section 1,
we use intra-window joins [49] as an example SWJ in this work. For given input streams 𝑅 and 𝑆
and a window W, the intra-window join, hereafter referred to simply as SWJ, is represented as
𝑅 (cid:90)W 𝑆 = (𝑟 ∪ 𝑠)|𝑟 ∈ 𝑅, 𝑠 ∈ 𝑆, 𝑟 ∈ W, 𝑠 ∈ W. The result of 𝑅 (cid:90)W 𝑆 is subsequently condensed into a
scalar output, 𝑂, via an aggregation function, which commonly either counts the joined tuples—i.e.,

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:4

Xianzhi Zeng et al.

Table 1. Notations used in this paper

Type

Tuple property

Stream property

PDA abstraction

VI optimization

𝑅, 𝑆
W
𝑂
𝜖
𝑙
𝜔
𝑛
𝜎
𝛼
¯𝑟𝑛
Δ

𝜇𝑤

𝜑𝑤

𝑈

𝑋
𝑝 ()
E(𝑘)
𝑍
𝑞()
E𝑗 (𝑘)

Key of a tuple
Payload of a tuple
The time of event occurrence of an input tuple

Notations Description
𝜅
𝑣
𝜏𝑒𝑣𝑒𝑛𝑡
𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 The input tuple arrival time
𝜏𝑒𝑚𝑖𝑡
𝛿

The time to emit an output tuple
The delay from event occurrence (𝜏𝑒𝑣𝑒𝑛𝑡 ) to event
arrival (𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 ) of an input tuple
Two input streams to join
A bounded subset of data stream to join
The aggregated results of 𝑅 (cid:90)W 𝑆
The relative error of output
The processing latency
The assumed time point of window completeness
The number of tuples
The join selectivity, as defined by [22]
The average payload of joined tuples
Window-averaged tuple rate corresponding to 𝑛
Maximum delay among all events from the time of
occurrence (𝜏𝑒𝑣𝑒𝑛𝑡 ) to the time of arrival (𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 ).

A global variable for describing window-averaged
contribution
A variable for describing other global information of
a window
The set of global variables, including the interested
𝜇𝑤 and 𝜑𝑤
The set of observations made on acquired tuples
The probability distribution
The expectation of 𝑘
The set of latent variables
The approximation function in variational family [21]
The expectation of 𝑘, regarding on 𝑗 (i.e., replace 𝑗 by
E( 𝑗) during estimating E(𝑘) )

𝐸𝐿𝐵𝑂𝑞 The evidence lower bound
𝐻

The set of remapped parameters in 𝑈 , 𝑍

Δ = max
∀𝑖

(𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 − 𝜏𝑒𝑣𝑒𝑛𝑡 )

𝐶𝑂𝑈 𝑁𝑇 ()—or performs a sum operation on 𝑅.𝑣 and 𝑆.𝑣, denoted as 𝑆𝑈 𝑀 (). When 𝑂 is dispatched
to the user at the time point 𝜏𝑒𝑚𝑖𝑡 , we consider the following two performance metrics:
• Accuracy: This metric assesses the precision of 𝑂 and is quantified by its relative error 𝜖.
Specifically, 𝜖 = |𝑂𝑜𝑝𝑟 −𝑂𝑒𝑥𝑝 |
, where 𝑂𝑜𝑝𝑟 represents the aggregated value produced by an
algorithm and 𝑂𝑒𝑥𝑝 is the expected value. A larger 𝜖 means that the 𝑂𝑜𝑝𝑟 is further from the
expected outcome 𝑂𝑒𝑥𝑝 .

𝑂𝑒𝑥𝑝

• Latency: For all tuples contributing to the generation of 𝑂, their 𝜏𝑒𝑚𝑖𝑡 is defined as the moment
when 𝑂 is produced, and the latency 𝑙 for each tuple is calculated as 𝑙 =𝜏𝑒𝑚𝑖𝑡 -𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 . In this study,
we report the 95th percentile of the worst-case latency, a commonly used measure, referring to
it as 95% 𝑙. A larger 𝑙 indicates more time to process SWJ and its follow-up aggregation function.
It should be noted that while this paper predominantly employs 𝐶𝑂𝑈 𝑁𝑇 () and 𝑆𝑈 𝑀 () as
example aggregation functions due to their widespread use, PECJ is versatile enough to support
any aggregation function yielding a scalar result. Additionally, other variants of SWJ, such as
sliding window joins [37, 39], are also worth mentioning. These alternate approaches often
introduce additional computational challenges, particularly in the realm of computational reuse for
overlapping windows. While important, these aspects are outside the purview of this paper and
are designated as topics for future investigation [37, 39, 43].

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:5

Fig. 1. Disorder handling of SWJ (𝑅 (cid:90)|W|=10𝑚𝑠 𝑆)

2.2 Limitations of Current Approaches

The optimal condition for SWJ is when data arrives in sequence—meaning, the ordering defined
by 𝜏𝑒𝑣𝑒𝑛𝑡 perfectly aligns with the one determined by 𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 as depicted in Figure 1(a). In this
situation, all data is fully accessible to the system, enabling the completion of the calculated window.
However, this idealistic case is rare in the real world due to the stream oscillation [47, 48].

In contrast, a disordered arrival is more common and the 𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 sequence diverges from that
defined by 𝜏𝑒𝑣𝑒𝑛𝑡 . Figures 1(b) and (c) illustrate the example scenarios of the disordered arrival.
Under these circumstances, ensuring window completeness becomes challenging due to the late-
arriving tuples, e.g., 𝑅1 and 𝑆2, highlighted in red. Ignoring such unobserved data compromises
accuracy. Conversely, waiting for this late data to arrive induces an indeterminate rise in processing
latency, given the unpredictable arrival times of these tuples.

Existing methodologies attempt to combat disordered arrivals using a buffering mechanism,
where observed data is retained in buffers while the system awaits a more complete set of window
data. The longer the system waits, the fewer unobserved data points there are. To prevent infinite
waiting, these systems often designate a certain point in time, 𝜔, at which they assume the window
is complete and all data has been observed, marking the end of data buffering. Join result 𝑂 is then
emitted at 𝜏𝑒𝑚𝑖𝑡 , where 𝜏𝑒𝑚𝑖𝑡 equals 𝜔 plus the processing time. Given that 𝜔 tends to be smaller
than the 𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 of late tuples, it effectively decreases the overall processing latency. Previous
studies [9, 22, 23, 29] have proposed both explicit and implicit methodologies for determining 𝜔.
Despite providing potentially autonomous and adaptable 𝜔 decisions, these approaches still
frequently neglect the impact of unobserved data—data arriving post-𝜔 —on the results. For example,
in Figure 1(b), a 𝜔 of 10𝑚𝑠 causes 𝑅1 and 𝑆2 to be missed, leading to an inaccurate output. To rectify
this, 𝜔 can be extended to ensure 𝑅1 and 𝑆2 are included, as shown by the 50𝑚𝑠 𝜔 in Figure 1(c).
However, increasing 𝜔 from 10𝑚𝑠 to 50𝑚𝑠 significantly raises latency, creating an inescapable
sub-optimal trade-off between accuracy and latency.

2.3 Proactive Incorporation: A Better Strategy?

To avoid the sub-optimal trade-off encountered in the state-of-art, a natural idea is to proactively
incorporate the unobserved data into the processing workflow of SWJ ahead of its arrival, as
showcased in Figure 1(d), rather than merely waiting. This strategy enables improved accuracy
under the same 𝜔 compared to Figure 1(b), without needing to increase 𝜔 as in Figure 1(c). The most
straightforward approach to realize such an idea might suggest leveraging time series prediction
techniques to anticipate the contributions from each unseen tuple [45]. However, this approach can
potentially lead to inconsistent accuracy levels. The prediction of individual tuple contributions
is contingent on the estimation of the tuple volume, which further amplifies the risk of error
propagation. Moreover, individual estimation of tuples’ contribution itself enforces an assumption
that the aggregation function is decomposable, which limits the applicability.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

= 10ms(c) Buffering mechanismwith large  (i.e., 50 ms)R1S2R4 R3 R2 R1S4 S3 S2 S1= 10ms(d) Proactively leveragesunobserved data (i.e., R1, S2)R1S2R4 R3 R2 R1S4 S3 S2 S1𝟙𝟚= 10ms(b) Buffering mechanismwith small  (i.e., 10 ms)R1S2R4 R3 R2 R1S4 S3 S2 S1= 10ms(a) Ideal scenario ofin-order arrivalR4 R3 R2 R1S4 S3 S2 S113:6

Xianzhi Zeng et al.

Further compounding the problem is the escalating complexity associated with time series
predictions. As the length of the data increases, the complexity of predicting attributes of a specific
and predetermined number of future data points can scale super-linearly [45]. This brings about
substantial predictive overhead, which becomes increasingly pronounced when a large number
of tuples remain unobserved. Furthermore, the challenges are not solely limited to predictive
accuracy and computational overhead. The need to keep latency within permissible thresholds
adds another layer of complexity. The interplay between accuracy, computational efficiency, and
latency management needs to be carefully navigated, requiring a more innovative and sophisticated
approach than traditional methods can offer. Those challenges motivate our proposal of PECJ.

3 OVERVIEW OF PECJ
This section commences with the preliminary theoretical foundations for PECJ. Subsequently, it
offers an overview of PECJ’s conceptual framework, accompanied by illustrative examples.

3.1 Theoretical Foundations for PECJ

To realize the proactive incorporation of unobserved data and address the difficulties discussed
in Section 2.3, PECJ solves a posterior distributions approximation (PDA) problem, optimized via
variational inference (VI).

Posterior Distribution Approximation (PDA) is a fundamental problem in Bayesian analysis [10],
aiming to update beliefs about probability models’ parameters (i.e., the so-called model
parameterization process) in response to observations, thereby understanding and interpreting
uncertainties. Despite its straightforward concept, deriving the exact posterior distribution
analytically can be highly challenging or even impossible when dealing with high-dimensional or
nonlinear relationships within probability models. This is because exponential growth complexity
of summation and integration will be involved.

Variational Inference [8, 21, 42] (VI) is an optimization technique for simplifying model
parameterization in PDA. Rather than brutal force computation, it approximates the true posterior
distribution with a tractable distribution family of functions (each denoted as 𝑞()), known as the
variational family, and a popular choice of variational family is the mean-field variational family.
Specifically, VI brings the variational family close to the truth by maximizing the evidence lower
bound (𝐸𝐿𝐵𝑂𝑞) with the gathered pieces of evidence, leading to significantly improved computation
efficiency. VI is superior to traditional approaches in four major aspects. First, VI is less prone
to overfitting compared to Maximum Likelihood Estimation (MLE) [10]. MLE often struggles to
estimate latent variables in complex models accurately. Second, VI incurs less computational
overhead than Markov Chain Monte Carlo (MCMC)) [10], making it more suitable for latency-
sensitive applications. Third, unlike regularization methods like L1 and L2 [19], VI can robustly
handle evolving observations without the need for additional hyperparameter tuning. Lastly,
VI is capable of incrementally integrating new observations into the existing distributions [12]
and enables continual learning. Therefore, VI is widely used in latent dirichlet allocation [20],
autoencoder construction [44], and concept drift detection [8], etc.

3.2 Conceptual Framework of PECJ
Designed to actively incorporate unobserved data, PECJ compensates for errors that arise in SWJ
when dealing with disordered data streams. This subsection outlines the conceptual framework of
PECJ, as depicted in Figure 2.

Abstraction: The first step involves directly abstracting the accurate SWJ result by extracting
essential information from the disordered data streams to avoid the error propagation caused
by per-tuple estimation (discussed in detail in Section 4.1). This phase essentially constitutes a

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:7

Fig. 2. Conceptual framework of PECJ.

Fig. 3. Running Example of PECJ.

PDA problem, requiring the development of a probability model that is conscious of the stream
oscillation.

Optimization: Given the inherent challenges of efficient PDA parameterization, we turn to the
VI approach for theoretical optimization (explained in Section 4.2). As discussed in Section 3.1, VI
drastically reduces the parameterization overhead of PDA, and inherently facilitates the evolution
of the probability model in parallel with the data streams.

Implementation: Bridging the gap between the mathematical formulations of the previous
stages and practical application, we provide both analytical and learning-based approaches of
VI instantiations in Section 5. The analytical approach (Section 5.1) offers ultra-low overhead
while accommodating relatively straightforward stream oscillation patterns. We realize it using
both Stochastic Variational Inference [21] (SVI) iterations and an Adaptive Exponential Moving
Average Filter [18, 36] (AEMA) in PECJ. SVI offers a general way of conducting analytical approach
by utilizing gradient descent, while AEMA involves much lower complexity. The learning-based
approach (Section 5.2) seeks to depict various stream dynamics in a more generalized manner. We
accomplish this by incorporating VI principles with PECJ’s parameters of interest to formulate a
loss function and use a simple Multilayer Perceptron (MLP) to implement the core ideas.

3.3 Running Examples of PECJ
To further elucidate the application of PECJ, we present a running example. The tuples to be joined
are outlined in Figure 3(a), with a window length of 6𝑚𝑠. These consist of 6 tuples from streams 𝑅
and 𝑆, formatted as ‘Key (𝜅), Payload (𝑣), Event Time (𝜏𝑒𝑣𝑒𝑛𝑡 , in ms)’. Intriguingly, tuples 𝑅4 and 𝑆1
have not been observed at a certain 𝜔 (e.g., 5.1𝑚𝑠).

Applying PECJ to the observed data enables us to enumerate the tuples in 𝑅, 𝑆. This yields 𝑛𝑆 = 5
and 𝑛𝑅 = 5 respectively (as displayed in Figure 3(b)). Additionally, PECJ detects 4 matches, of which
two are under 𝜅 = 𝐴 and the other two fall under 𝜅 = 𝐵. This leads to a join selectivity [22] 𝜎
computed as 4/25. In the case of a 𝐽𝑂𝐼 𝑁 − 𝐶𝑂𝑈 𝑁𝑇 () query where the payload 𝑣 doesn’t affect

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

Brutal force  or  ?ProbabilityValueImplementationR1S2R4 R3 R2 R1S4 S3 S2 S1𝟙𝟚 ,equivlant to:3Mathmatical Formulation......Learning-based.../5+1AnalyticalR1S2R4 R3 R2 R1S4 S3 S2 S1The disorder datastreamsProbabilityValue......12ProbabilityValue......AbstractionVariational Inference (VI)Optimization12generalitycomplexityvs.Estimate based on collectiveimpact, not individual tupleprediction.VI Instantiation(ms)(ms)𝟙𝟙𝟜𝟜𝟡𝟡Observed matchesObservedObserved(a) The disordered datastreams(b) The observationsObservered:(JOIN-COUNT)(JOIN-SUM)(c) Solving the PDA problem with VI(d) Estimated result with error compensatedObservationsDistortion effectsin streamingThe totalcontribution,-1-14/225-1(6,0.2)（2/9,1）(6,0.2)Value......Value60.8ProbabilityAbstraction1Implementation3Optimization2𝟞𝟚𝟡Estimated:𝟞(JOIN-COUNT)(JOIN-SUM)𝟞.........Individual tuplesshown for illustrativepurposes only𝟡𝟡Estimated matches with error compensation13:8

Xianzhi Zeng et al.

results, 𝑂 aligns with the number of matches, resulting in a count of 4. For a 𝐽𝑂𝐼 𝑁 − 𝑆𝑈 𝑀 (𝑅.𝑣)
query where the 𝑣 of the joined 𝑅 is accumulated, we get 𝑂 = 20. Moreover, the mean 𝑣 of the
joined 𝑅 results in 𝛼𝑅 = 20/4 = 5. Nonetheless, these results do not reflect the true outcome as they
exclude contributions from 𝑅4 and 𝑆1 who have not arrived by the 𝜔.

To address the discrepancy of unobserved data, PECJ proposes to answer the question, ‘what
would 𝑂 appear like if the contributions from unobserved data were factored in?’ To do this, PECJ
tackles a PDA problem using a VI approach, as shown in Figure 3(c). In this context, the PDA problem
involves using patterns and hidden tendencies within data streams as evidence to estimate 𝑛𝑅, 𝑛𝑆 ,
𝜎, and 𝛼𝑅. This represents an effort to account for the effects of stream oscillation on the observed
data, which often distorts the true picture.

Unfortunately, exhaustively computing every potential scenario of stream oscillation via brute-
force methods is computationally infeasible. For this reason, PECJ adopts the VI approach and
maximizes the evidence lower bound (Section 3.1) of describing stream oscillation. This theoretical
optimization is practically implemented under the analytical or learning-based approaches,
effectively tailoring the posterior distributions of the estimated values.

As an example, PECJ might detect a high probability of a distortion of approximately −1 for
𝑛𝑆, 𝑛𝑅. This would suggest that the estimated 𝑛𝑆, 𝑛𝑅 should conform to a Gaussian Distribution of
N (6, 0.2), allowing us to use the expected value of 6 to estimate 𝑛𝑆, 𝑛𝑅. Upon amalgamating these
estimated values of 𝑛𝑅, 𝑛𝑆 , 𝜎, and 𝛼𝑅, PECJ can compute the rectified 𝑂. The calculation for the
𝐽𝑂𝐼 𝑁 − 𝐶𝑂𝑈 𝑁𝑇 () query would result in

𝑂 = 𝜎 × 𝑛𝑆 × 𝑛𝑅,

and for the 𝐽𝑂𝐼 𝑁 − 𝑆𝑈 𝑀 (𝑅.𝑣) query it would be

𝑂 = 𝜎 × 𝑛𝑆 × 𝑛𝑅 × 𝛼𝑅.

These computations integrate the contributions as if 𝑅4 and 𝑆1 had been present at the time of
computation, as illustrated in Figure 3(d).

3.4 Assumptions and Limitations
PECJ is built upon the theoretical framework of VI, and it shares the common assumption that there
exists a variational family of functions, typically the mean-field family, applicable to PDA [8, 12]. In
addition, the analytical approach makes the further assumption that the mean-field family should
converge to a specific analytical form, which reflects the distortion effects of stream oscillation as
a reverse linear effect on the central limit theorem. However, as demonstrated in Figure 12, this
assumption of a reverse linear distortion to the central limit theorem proves to be quite restrictive
and struggles to accommodate situations with severe stream oscillations. In contrast, learning-based
approach relaxes this assumption and only requires that the mean-field family converges within
the capacity defined by the universal approximation theorem [10], i.e., the foundation of artificial
neural networks. To summarize, our solution is not intended to handle the cases where mean-field
family approximation and the universal approximation theorem do not hold, which still remains
an untapped territory in the literature.

4 MATHEMATICAL FORMULATION
This section illustrates the detailed mathematical formulation of PECJ. We begin by extracting critical
information from the oscillating data streams and formulating a streaming-aware probability model
to minimize error propagation (Section 4.1). We then employ VI for efficient model parameterization,
ensuring our solution caters to the low-latency demands of SWJ (Section 4.2).

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:9

Fig. 4. Probability model.

Fig. 5. Parameterization as continual
learning.

4.1 Formulating the Probability Model
PECJ approximates the posterior distribution of the total contribution from all tuples within
a window, encompassing both observed and unobserved data. This strategy diverges from the
approach of predicting individual tuples via time-series predictions [45]. Our solution eliminates the
need for per-tuple approximation or compensation, thereby reducing potential error propagation.
This propagation originates from the interdependent prediction of tuple number (𝑛𝑆, 𝑛𝑅) and the
contribution of each tuple to 𝛼𝑅, 𝜎 (as discussed in Section 2.3). Specifically, PECJ estimates the
parameters of the window-averaged total contribution (𝜇𝑤) directly, perpetually learning from the
𝑓 (W). Here, 𝑓 (W) is a scalar function to
data stream observations. 𝜇𝑤 is defined as 𝜇𝑤 = 1
|W|
represent an arbitrary process of the whole W, and it’s then normalized by the windowlength |W|
to define a 𝜇𝑤. 𝑓 (W) does not have to be decomposable per tuple, in order to support an arbitrary
window aggregation with scalar result. Each 𝜇𝑤 encapsulates a certain type of averaged global
information within a window, such as join selectivity (𝜎) or average payload (𝛼) in Section 3.3. For
the accumulated effects, represented by the 𝑛 notation, we convert it by the corresponding window
average, e.g., 𝑛 = ¯𝑟𝑛 × |W|, where ¯𝑟𝑛 refers to the averaged tuple rate and can also be viewed as
a parameter of the window-averaged total contribution. It is crucial to note that 𝜎, 𝛼𝑅, and ¯𝑟𝑛
are abstracted in a manner similar to the 𝜇𝑤 notation as each of them describes a certain type of
window-averaged total contribution. Furthermore, they can be estimated independently, avoiding
the prediction dependency mentioned in Section 2.3.

PECJ employs specific 𝜇𝑤 variables such as 𝜎 to calculate the join aggregation output 𝑂 (as
defined in Section 3.3), thereby facilitating proactive compensation for disorder handling errors.
With the corresponding observations 𝑋 = {𝑥1, 𝑥2, ...}, we can estimate 𝜇𝑤 by approximate the
the posterior distribution 𝑝 (𝜇𝑤 |𝑋 ). We might also desire additional parameters 𝜑𝑤, such as the
inverse variance of 𝜇𝑤 estimation, which is connected to the credible interval. Both 𝜇𝑤 and 𝜑𝑤
form part of a window’s global information 𝑈 , i.e., 𝜇𝑤, 𝜑 𝑤 ∈ 𝑈 . For a general illustration, we utilize
the 𝑝 (𝑈 |𝑋 ) notation, as it encompasses both 𝑝 (𝜇𝑤 |𝑋 ) and 𝑝 (𝜑 𝑤 |𝑋 ). In summary, we are to achieve
the following approximation objective:

Objective 1. Approximate the 𝑝 (𝑈 |𝑋 ), estimating the 𝑈 by utilizing its expectation given 𝑋 , i.e.,

ˆ𝑈 = E(𝑈 |𝑋 ).

The dynamics and randomness caused by stream oscillation can cause significant deviations in the
observations 𝑋 from the global 𝑈 [8]. Unlike evaluating a static dataset [28, 46], a straightforward
statistics approximation will be inaccurate due to the highly distorted observations under stream
oscillation. To achieve a better reflection on the effects of stream oscillation, we employ latent
variables 𝑍 = {𝑧1, 𝑧2, ...} in our model. We use directed arrows to denote probabilistic dependencies
in our model, as shown in Figure 4. Specifically, our observations 𝑋 depend on both the global
variables 𝑈 and the latent variables 𝑍 , while the latent variables 𝑍 may also be influenced by the

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

......ZZ...Z...13:10

Xianzhi Zeng et al.

global variables 𝑈 . Each variable 𝑧𝑖 in 𝑍 directly influences specific observations in 𝑋 , embodying
temporal or local dynamics of the stream oscillation. For instance, in Figure 4, 𝑧1 impacts both
𝑥1 and 𝑥2, while 𝑧2 only affects 𝑥3. To encapsulate a wide spectrum of oscillation patterns, we
emphasize that 𝑍 : 1) does not necessarily have to correspond to 𝑋 in length, 2) can contain variables
(𝑧𝑖 ) of any dimension, and 3) might include variables that are influenced by 𝑈 or other latent
variables. By introducing 𝑍 , we can expose patterns and trends in the data streams that might not
be immediately noticeable when examining 𝑋 alone, providing a better reflection on the stream
oscillation and therefore achieving more accurate 𝑈 estimation.

4.2 Optimizing Model Parameterization with VI
Despite the better reflection of stream oscillation, latent variables entail undesirable exponential
computational complexity for parameterizing the probability model, as discussed in Section 3.1.
Moreover, we continuously need to update the model parameters to handle new incoming data
and promptly make inferences. Therefore, we employ VI [8, 21, 42] for model parameterization.
VI is advantageous for PECJ compared with traditional approaches in both accuracy and latency,
and it inherently supports continual learning on stream oscillation (Section 3.1). Specifically, PECJ
utilizes VI to approximate the true posterior 𝑝 (𝑈 |𝑋 ) in Objective 1, without resorting to brute-
force integration or summation on analyzing 𝑈 and 𝑍 . Although the successful use of VI in other
problems is acknowledged [8, 20, 44], these existing works aren’t designed for the PDA process
involved in SWJ. These works are meant for different probability models where estimating the
global information 𝑈 from data streams isn’t required. In the following sections, we delve deeper
into our VI approach’s mechanics.

Approximation of 𝑝 (𝑈 |𝑋 ). We use variation family of 𝑞() functions (Section 3.1) to approximate
the 𝑝 () distributions, and use the ≈ symbol to indicate an approximation process. We illustrate the
approximations to our target distribution 𝑝 (𝑈 |𝑋 ) (Objective 1), conditional prior distribution of
𝑍 |𝑈 , and joint distribution of 𝑈 , 𝑍 in Equations 1 to 3, respectively. By decomposing each variable
into separate distributions during the approximation, we can apply divide and conquer to each
variable and avoid brute force summation or integration.

𝑞(𝑈 ) =

(cid:214)

𝑞(𝜇𝑤) ×

(cid:214)

𝜑 𝑤 ∈𝑈

𝑞(𝜑 𝑤) ≈ 𝑝 (𝑈 |𝑋 )

𝜇𝑤 ∈𝑈
(cid:214)

𝑞(𝑍 |𝑈 ) =

𝑞(𝑧𝑖 ) ≈ 𝑝 ((𝑍 |𝑈 )|𝑋 )

(1)

(2)

𝑧𝑖 ∈𝑍

𝑞(𝑈 , 𝑍 ) = 𝑞(𝑈 ) × 𝑞(𝑍 |𝑈 ) ≈ 𝑝 (𝑈 , 𝑍 |𝑋 )

(3)
VI solves an optimization problem of bringing 𝑞() close to 𝑝 (), by maximizing the evidence lower
bound (𝐸𝐿𝐵𝑂𝑞), as defined in Equation 4. The key insight of Equation 4 is to optimize the utilization
on the 𝑋 (i.e., used as the evidence) by finding the balance between explaining the observations and
retaining uncertainty. The first term, E𝑞(𝑙𝑜𝑔((𝑝(𝑈 ,𝑍 ,𝑋 ))), represents the expected log-likelihood
of our observations given the model. It encourages the model to explain the 𝑋 well. The second
term, E𝑞(𝑙𝑜𝑔((𝑞(𝑈 ,𝑍 )))), is the entropy of the approximation function 𝑞(). This term encourages the
model to remain uncertain and not commit to a single explanation prematurely. In this way, we
can find a good approximation of the posterior 𝑝 (𝑈 |𝑋 ).

Objective 2. maximize 𝐸𝐿𝐵𝑂𝑞

𝑠.𝑡 ., 𝐸𝐿𝐵𝑂𝑞 = E𝑞 (𝑙𝑜𝑔((𝑝 (𝑈 , 𝑍, 𝑋 ))) − E𝑞 (𝑙𝑜𝑔((𝑞(𝑈 , 𝑍 ))))

(4)

Continual Learning from Observations. The uncertainties and distortion effects brought
by stream oscillation further require the capacity of continual learning, i.e., to assimilate new

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:11

information progressively, while retaining previously learned knowledge. However, effectively
implementing continual learning in the face of endless data streams poses its challenges. Specifically,
it’s impractical to store the complete history of 𝑋 and execute VI for every new addition to 𝑋 . Thus,
we treat model parameterization as a continual learning process as illustrated in Figure 5.

Assume that we have drawn insights from a previous observation 𝑋1 and have established
approximations for 𝑈 and 𝑍 . These approximations can then be updated with the new observation
𝑋2, eliminating the need to recompute using the entire 𝑋 = {𝑋1, 𝑋2}. In line with the method
proposed in [12], we employ the prior distribution of 𝑈 (i.e., 𝑝 (𝑈 )) as the initial conditions, with
“starting” not indicating a clean slate. The following equation, Equation 5, illustrates this process. The
𝑞(𝑈1), derived from old observation 𝑋1, can act as the new prior distribution. This prior can then be
integrated with the impacts from the new observation (i.e., 𝑝 (𝑋2|𝑈 )) to update our approximation.
We acknowledge the complexity of continual learning optimization methodologies such as coreset
selection [32] and designate them as subjects for future research.

𝑝 (𝑈 |𝑋 ) = 𝑝 (𝑈 |𝑋1, 𝑋2) ∝ 𝑝 (𝑋2|𝑈 )𝑝 (𝑈 |𝑋1) ≈ 𝑝 (𝑋2|𝑈 )𝑞(𝑈1)

(5)

5 INSTANTIATION OF VI
Implementing PECJ necessitates the instantiation of the VI equations as delineated in Section 4.2.
However, the precise organization and interrelationships between 𝑈 and 𝑍 have substantial
implications for PECJ’s overhead and versatility, requiring a judicious design approach. This
section explores two pragmatic instantiations, initially focusing on the analytical method [21],
and subsequently examining the learning-based approach [8, 42]. For each approach, we present
an overview at the beginning, then introduce its 1) key derivation steps, 2) conclusions, and 3)
implementation usage.

5.1 Analytical Instantiation

The analytical instantiation is designed to provide a straightforward interpretation of stream
oscillation, and it relies on several assumptions about the oscillation patterns to simplify the
instantiation process. In particular, we enforce that the latent variable set 𝑍 matches the size of
the observations 𝑋 , and each 𝑧𝑖 is treated as a scalar. Furthermore, 𝑧𝑖 is typically correlated with a
certain physical quantity that causes the stream oscillation.

Derivation Steps. We undertake a three-step process to extend the central limit theorem’s
(CLT) applicability to the context of handling stream oscillation with an intuitive example. First,
if stream oscillation does not exist, our observations 𝑋 = {𝑥1, 𝑥2, ..., 𝑥𝑛 } should approximately
match a Gaussian Distribution with mean 𝜇𝑤 and inverse variance 𝜑𝑤. This can be expressed as
𝑥𝑖 ∼ 𝑁 (𝜇𝑤, 1/𝜑 𝑤) according to the CLT. Several factors as discussed in Section 4.1 support this
approximation: 1) We have defined 𝜇𝑤 as one factor of the window-averaged total contribution,
and 2) Each 𝑥𝑖 observes the same entity, 𝜇𝑤, and these observations are independently made. To
illustrate, suppose 𝜇𝑤 = 1, i.e., 1𝐾 transactions happening at the remote source per second in
Section 1’s example. If transaction reporting monopolizes the whole bandwidth, each 𝑥𝑖 should be
observed as 1 on average by the online anomaly detection system.

Second, we introduce three assumptions of reflecting the stream oscillation: 1) stream oscillation
independently affects each observation 𝑥𝑖 , 2) it is independent of the set of concerned global variables
𝑈 , and 3) it can be reflected by single-dimension. For example, let’s assume stream oscillation
occurs as the number of stock services (using 𝑧𝑖 to describe) varies over time, and the bandwidth is
equally shared by all services. In this case, 𝑥𝑖 will be observed to be 1/2 on average if 𝑧𝑖 = 2, as only
half of the bandwidth is used for transaction reporting. In essence, we are characterizing stream
oscillations by incorporating a reverse linear distortion of 𝑍 into the CLT-based approximation.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:12

Xianzhi Zeng et al.

Specifically, we have 𝑥𝑖 × 𝑧𝑖 ∼ 𝑁 (𝜇𝑤, 1/𝜑 𝑤), or equivalently 𝑥𝑖 ∼ N (𝜇𝑤/𝑧𝑖, 1/(𝑧2
𝑖 𝜑 𝑤)). Therefore,
the conditional probability function of 𝑥𝑖 is formulated as Equation 6, and it implies that 𝑥𝑖 is
influenced not solely by the global mean 𝜇𝑤 and global variance 1/𝜑 𝑤 of a Gaussian Distribution,
but also by the stream oscillations (i.e., reflected under 𝑧𝑖 ). When we couple Equation 6 with
the prior distribution of 𝜇𝑤, 𝜑 𝑤, 𝑧𝑖 , denoted as 𝑝 (𝜇𝑤), 𝑝 (𝜑 𝑤), 𝑝 (𝑧𝑖 ) respectively, we can derive the
joint distribution function 𝑝 (𝑈 , 𝑍, 𝑋 ) for all variables in Equation 7, where 𝑍 = {𝑧1, 𝑧2, ...𝑧𝑛 } and
𝑋 = {𝑥1, 𝑥2, ..., 𝑥𝑛 }. Noted that, the 𝑈 |𝑍 notations in Equation 2 are simplified into disjoint parts, as
we have independent 𝑈 , 𝑧𝑖 here.

𝑓 (𝑥𝑖 |𝜇𝑤, 𝜑 𝑤, 𝑧𝑖 ) = 𝑒 − (𝑧𝑖 ×𝑥𝑖 −𝜇𝑤 ) 2∗𝜑 𝑤 /2 ×

𝑝 (𝑈 , 𝑍, 𝑋 ) = 𝑐𝑜𝑛𝑠𝑡 × 𝜑𝑛/2
𝑛
(cid:214)

𝑝 (𝜇𝑤)𝑝 (𝜑 𝑤)

𝑤 × 𝑒(cid:205)𝑛

𝑝 (𝑧𝑖 )

√

𝜑 𝑤 × 𝑐𝑜𝑛𝑠𝑡
𝑖=1 (𝑧𝑖 ×𝑥𝑖 −𝜇𝑤 ) 2 ×𝜑 𝑤 /2×

𝑞(𝜇𝑤) = E𝜑 𝑤,𝑍 (𝑓 (𝑈 , 𝑍, 𝑋 ))

𝑖=1

= 𝑐𝑜𝑛𝑠𝑡 × 𝑝 (𝜇𝑤)𝑒 − (𝜇𝑤 −𝑔 (𝑋 ,𝑍 ) ) 2 × (𝑛E(𝜑 𝑤 )/2)

where 𝑔(𝑋, 𝑍 ) =

𝑛
(cid:213)

𝑖=1

E(𝑧𝑖 ) ∗ 𝑥𝑖
𝑛

∃vector 𝐾 and scalar 𝑏, 𝑠.𝑡 ., ¯𝜇𝑤 = E(𝜇𝑤 |𝑋 ) = 𝐾𝑋 + 𝑏

where 𝐾𝑋 =

𝑛𝑔(𝑋, 𝑍 )
𝜏0 + 𝑛
∀credible interval 𝛿 ∈ (0, 1),

, 𝑏 =

𝜏0𝜇0
𝜏0 + 𝑛

(6)

(7)

(8)

(9)

¯𝜇𝑤 − 𝑖 (𝛿)

≤𝜇𝑤 ≤ ¯𝜇𝑤 + 𝑖 (𝛿)

1
(cid:112)(𝜏0 + 𝑛)E(𝜑 𝑤)

1
(cid:112)(𝜏0 + 𝑛)E(𝜑 𝑤)
where 𝑖 (𝛿) is the 𝛿 interval quantile of a standard Gaussian.
(10)
Third, when VI converges to a mean-field family of 𝑞() and Equation 4 is achieved, an analytical
solution [10, 21] exists for 𝑞(𝜇𝑤), as shown in Equation 8. The notation E𝜑 𝑤,𝑍 indicates that the
approximations of 𝜇𝑤 can be facilitated by the expectations of other variables, specifically 𝜑 𝑤 and
𝑍 , rather than performing exhaustive computation of their integration or summation. This is a
consequence of the decoupling property inherent to the mean-field family. Moreover, if the prior
distribution of 𝜇𝑤 is a Gaussian N (𝜇0, 1/𝜏0), 𝑞(𝜇𝑤) culminates in a Gaussian posterior distribution
(𝜏0+𝑛)E(𝜑 𝑤 ) ). Suppose we have observed 𝑥1 = 1/2 and
of 𝜇𝑤 expressed as 𝜇𝑤 ∼ N (
1
𝑥2 = 1/3, obtained that E(𝑧1) = 2, E(𝑧2) = 3 through the converging process of the VI, and initially
held a prior knowledge that 𝜇0 = 𝜏0 = 1. In this context, we can construct the posterior distribution
of 𝜇𝑤 and conclude it should be 1 on average, which aligns well with the truth.
Conclusions. We can deduce two crucial insights from the derivation above:
(1) The estimated value of 𝜇𝑤 (denoted as ¯𝜇𝑤) behaves like a linear function of 𝑋 as shown in
Equation 9. Notably, the coefficient vector 𝐾 correlates with the expectations of each latent
variable, represented as E(𝑧𝑖 ).

𝜏0𝜇0+𝑛𝑔 (𝑋 ,𝑍 )
𝜏0+𝑛

(2) The credible interval for estimating 𝜇𝑤 is related to E(𝜑 𝑤), as depicted in Equation 10. For

,

example, the 95% credible interval is calculated as ¯𝜇𝑤 ± 1.96

1
(cid:112)(𝜏0+𝑛)E(𝜑 𝑤 )

.

Implementation Usage. We can use Stochastic Variational Inference (SVI) [21] to conduct
the analytical instantiation by extending Equation 8 to calculate 𝜑 𝑤 and 𝑧𝑖 . We then employ
gradient descent to maximize 𝐸𝐿𝐵𝑂𝑞. Technically, gradient descent minimizes functions, but by

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:13

applying it to the negative of 𝐸𝐿𝐵𝑂𝑞, we can effectively maximize 𝐸𝐿𝐵𝑂𝑞. Alternatively, given the
straightforward linear form, techniques such as the Exponential Moving Average (EMA) or the
ARIMA model [18, 36] can also be applied. However, a distinguishing aspect of our scenario is that
the parameters of the filter should dynamically evolve with the data streams, rather than being
preset. This dynamic adaptability ensures accurate on-the-fly approximation of E(𝑧𝑖 ).

By default, PECJ employs a variant of the EMA, which we term as an Adaptive EMA (AEMA).
In AEMA, the decay parameter of the EMA is not fixed but continuously updated based on rule-
based learning from the data streams. This choice is motivated by the expectation that an adaptive
approach will incur significantly less overhead compared to SVI, while also being simpler to design
and adjust.

5.2 Learning-based Instantiation
Although more intricate 𝑈 , 𝑍 relationships are possible to represent more complex patterns of
stream oscillation, this approach demands significant manual effort and potentially leads to an
impractical implementation (see Appendix for details). To overcome the challenges of capturing
complex stream oscillation, we refer back to the abstract ELBO definition in Equation 4 for a more
universal solution. This approach eliminates the need for prior knowledge or additional assumptions
about 𝑍 and its interactions with 𝑈 . Instead, we treat 𝑍 as a learnable black box, without knowing
about its size, element dimensions, or dependency relationships.

Derivation Steps. We prove the learnable effects of stream oscillation by four major steps of
parameter remapping and the divide-and-conquer policy as follows. First, we remap the entire
parameter space of 𝑈 and 𝑍 into another space, 𝐻 = {ℎ1, ℎ2, ..., ℎ𝑚 }, i.e., 𝑈 , 𝑍 → 𝐻 . Hence,
Equation 4 can be rewritten as Equation 11. Second, we further constrain 𝐻 by ensuring 1)
the independent 𝜇𝑤 and 𝜑 𝑤 presented in Equation 6 and Equation 7 are assigned to ℎ1 and ℎ2,
respectively, and 2) the remaining factors ℎ3, ℎ4, ...ℎ𝑚 form an Orthogonal Basis (i.e., they are
independent of each other) given ℎ1, ℎ2. As a result, the 𝑙𝑜𝑔((𝑝 (𝐻, 𝑋 )) term can be decomposed
as shown in Equations 12∼ 13. Note that 𝑙𝑜𝑔((𝑝 (𝑋 |𝐻 ))) is the log-likelihood of 𝑋 in the 𝐻 space,
and 𝑙𝑜𝑔((𝑝 (ℎ𝑖 ))) is the log-prior-distribution of ℎ𝑖 . As both are irrelevant to 𝑞() functions, we
can conveniently remove the E𝑞 notations. Third, based on the mean-field property [10, 21],
E𝑞 (𝑙𝑜𝑔(𝑞(𝐻 ))) can be further decomposed as per Equation 14. Finally, by separating 𝑞(𝜇𝑤) and
𝑞(𝜑 𝑤) from the other 𝑞(ℎ𝑖 ), we can derive Equation 15, and each item in Equation 15 is a scalar
value.

𝐸𝐿𝐵𝑂𝑞 = E𝑞 (𝑙𝑜𝑔((𝑝 (𝐻, 𝑋 ))) − E𝑞 (𝑙𝑜𝑔((𝑞(𝐻 )))

= E𝑞 (𝑙𝑜𝑔((𝑝 (𝑋 |𝐻 )𝑝 (𝐻 )))) − E𝑞 (𝑙𝑜𝑔((𝑞(𝐻 )))
= 𝑙𝑜𝑔(𝑝 (𝑋 |𝐻 )) + 𝑙𝑜𝑔(𝑝 (𝜇𝑤)) + 𝑙𝑜𝑔(𝑝 (𝜑 𝑤))

+

𝑚
(cid:213)

𝑖=3

𝑙𝑜𝑔(𝑝 (ℎ𝑖 |𝜇𝑤, 𝜑 𝑤)) − E𝑞 (𝑙𝑜𝑔(𝑞(𝐻 )))

= 𝑙𝑜𝑔(𝑝 (𝑋 |𝐻 )) + 𝑙𝑜𝑔(𝑝 (𝜇𝑤)) + 𝑙𝑜𝑔(𝑝 (𝜑 𝑤))

+

𝑚
(cid:213)

𝑖=3

𝑙𝑜𝑔(𝑝 (ℎ𝑖 |𝜇𝑤, 𝜑 𝑤)) − (

E𝑞 (𝑙𝑜𝑔(𝑞(ℎ𝑖 ))))

(cid:213)

𝑖

= 𝑙𝑜𝑔(𝑝 (𝑋 |𝐻 )) + 𝑙𝑜𝑔(𝑝 (𝜇𝑤)) + 𝑙𝑜𝑔(𝑝 (𝜑 𝑤))

+

𝑚
(cid:213)

𝑖=3

𝑙𝑜𝑔(𝑝 (ℎ𝑖 |𝜇𝑤, 𝜑 𝑤)) − (

𝑚
(cid:213)

𝑖=3

E𝑞 (𝑙𝑜𝑔(𝑞(ℎ𝑖 )))

+ 𝑙𝑜𝑔(E(𝜇𝑤 |𝑋 )) + 𝑙𝑜𝑔(E(𝜑 𝑤 |𝑋 ))

(11)

(12)

(13)

(14)

(15)

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:14

Xianzhi Zeng et al.

Conclusions. Similar to Section 5.1’s case, the resulting E(𝜇𝑤 |𝑋 ) and E(𝜑 𝑤 |𝑋 ) can be directly
utilized for the estimated value in PECJ’s error compensation, as discussed in Section 4.1. Moreover,
Equation 15 can further be leveraged to regulate the behavior of neural networks (NNs), enabling
them to conform to the PDA process through an ELBO-driven learning process as follows:

(1) Construct an NN for function fitting, ensuring that the final output is at least seven-

dimensional to correspond with the seven scalars depicted in Equation 15.

(2) Conduct supervised pre-training over the entire NN so that each dimension accurately
estimates the target scalar, such as 𝑙𝑜𝑔(E(𝜇𝑤 |𝑋 )). Given that pre-training is fundamentally a
function-fitting process, loss functions that have been originally designed for fitting, such as
the mean square error, are appropriately suitable for this task.

(3) During continual learning in a streaming environment, the whole Equation 15 can be
employed to optimize NN loss. For example, if gradient descent is implemented via ADAM or
SGD [4], the loss function can be designed to decrease monotonically with 𝐸𝐿𝐵𝑂𝑞. Note that,
if the NN is overly ‘confident,’ the numerical evaluation of 𝐸𝐿𝐵𝑂𝑞 could potentially be ∞. In
such instances, we use bounded functions such as −𝑠𝑖𝑔𝑚𝑜𝑖𝑑 (𝐸𝐿𝐵𝑂𝑞) as the loss function.
Implementation Usage. In PECJ, we implemented a straightforward multilayer perceptron
(MLP) to briefly illustrate this concept, leaving more powerful structures like LSTM [8] or
transformer [42] for future exploration. Furthermore, given the necessity for NNs to meet low
latency requirements, it’s critical to efficiently perform their inference and learning processes. As a
result, an effective solution for deploying PECJ across various dynamic situations is to integrate a
well-structured NN with high-performance computing. Pursuing this combination represents an
important area of ongoing work.

6 EVALUATION
In this section, we present a comprehensive evaluation of PECJ in comparison with other state-
of-the-art techniques. In summary, across various aspects of our investigation, we have made the
following key observations.

• PECJ has consistently proven superior in managing disordered data. From an end-to-end
comparison with two popular state-of-art algorithms [9, 22], PECJ emerged as more effective,
maintaining lower error rates even under intricate disorder arrival patterns and lenient
real-time requirements (Section 6.3).

• The efficiency of PECJ was further validated under different workload conditions and
algorithm configurations. In particular, PECJ can handle a severe stream oscillation (i.e.,
where the arrival delay of tuples oscillates from 0 ∼ 1000𝑚𝑠) with low error (i.e., 4.2%) by
using learning-based instantiation, i.e., PECJ learning (Section 6.4).

• Lastly, the integration of PECJ into PRJ and SHJ demonstrated substantial error rate reductions

without significantly impacting latency or scalability (Section 6.5).

6.1 Experimental Setup
We established a robust experimental setup to thoroughly evaluate the performance of PECJ. The
various components of this setup are detailed below.

Server: The experiments were conducted on a state-of-the-art multicore server powered by
Intel Xeon Gold 6252 processors, which feature 24 cores and support 2 threads per core through
HyperThreading. The server has a considerable L3 cache size of 35.75MB and a massive memory
capacity of 384GB. It operates on the Ubuntu 22.04 system and uses the g++ 11.3.0 compiler for the
compilation of the source codes.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:15

Datasets: The evaluation was carried out using a diverse collection of four widely-used real-world
datasets - Stock, Rovio, Logistics, Retail, and a synthetic dataset known as Micro. Stock is
based on a real-world stock exchange dataset [3]. Micro and Rovio are from recent benchmark
studies [26, 49]. Logistics and Retail datasets were obtained from a recent open source project [48].
Stock are the streams of financial quotes and trades, while Rovio continuously monitors user
actions within a specific game. Additionally, Logistics and Retail involve streams of online
decision augmentation labels and actions in logistics and retail applications, respectively. For more
detailed characteristics, please consult Table 3 in [49] and Table 3 in [48]. To simulate a realistic
scenario of stream oscillation, we introduced disorder in the data arrival by reordering the arrival
timestamps 𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 differently from the event timestamps 𝜏𝑒𝑚𝑖𝑡 (as mentioned in Section 2). The
difference between 𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 and 𝜏𝑒𝑚𝑖𝑡 , i.e., 𝛿, was set randomly for all tuples. We kept the event
rate (controlled by event timestamp 𝜏𝑒𝑚𝑖𝑡 ) of both R and S streams consistent at 100𝐾𝑡𝑢𝑝𝑙𝑒𝑠/𝑠
unless stated otherwise. By default, we employ the Stock datasets, which align with the motivating
example presented in Section 1. To ensure a thorough evaluation, other datasets are utilized.

Queries: Three different queries were employed in our evaluation. Q1: This query entails a SWJ
aggregated by COUNT (Section 3.3), with a |W| of 10𝑚𝑠, and a maximum value of 𝛿 among all
tuples, i.e., Δ, set as 5𝑚𝑠. The small Δ is representative of a scenario where the stream processing is
geographically close to the data source, such as on the edge of a cloud network [47] . Q2: This query
modifies Q1 by changing the aggregation function to SUM (Section 3.3), with all other settings
retained as per Q1. Q3: This query extends Q1 by altering the disordered arrival pattern of data
and setting the Δ to 1000𝑚𝑠. The significant Δ simulates situations where the stream analytic is
situated far from the data source, such as during multiple intercontinental communications within
a TOR network [16].

While Q1 and Q2 are tailored to require ultra-low latency processing, typically tens of
milliseconds or less [1], Q3 cannot expect such low latency due to the large arrival delay.
Nonetheless, the goal is to achieve a latency below 200𝑚𝑠 as discussed in our motivating example
in Section 1.

6.2 Implementation Details
In our evaluation, we scrutinize the performance of PECJ using two distinct setups: standalone
and integrated implementations. Each setup facilitates a comprehensive comparison with different
existing approaches. Note that, while the automatic determination of suitable 𝜔 is orthogonal to
this work, it serves as a tuning knob for all mechanisms during the experiments. Specifically, we
set 𝜔 to |W| of three queries, i.e., 10𝑚𝑠 by default and manually tune it in the experiments.

A) Standalone Implementation: In the standalone implementation setup, we’re aiming for an
algorithmic comparison between PECJ and two existing methodologies, namely K-Slack-Join
(KSJ ) [22] and Watermark-Join (WMJ ) [9]. For these standalone implementations, we employed
the same C++ codebase for KSJ , WMJ , and PECJ.

Our implementation of PECJ included three separate approaches for the analytical and learning-
based approaches. For the former (discussed in Section 5.1), we utilized both the Adaptive
Exponential Moving Average (AEMA) and Stochastic Variational Inference (SVI) instantiations. For
learning-based (Section 5.2), we opted for a simple learning approach of Multi-Layer Perceptron
(MLP). The AEMA instantiation served as the default configuration for PECJ’s analytical approach.
KSJ uses a k-slack buffer approach to manage the disorder in data streams. After data streams
are preprocessed through the k-slack buffer, KSJ conducts a standard hash-join operation, treating
the data as ordered. Importantly, our tuning parameter, 𝜔, is tied to the k-slack buffer’s control
conditions, as discussed in Section 2. On the other hand, WMJ applies the watermark mechanism [9]

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:16

Xianzhi Zeng et al.

(a) 95% latency

(b) 𝜖 comparison

(c) Latency CDF under 𝜔 =
12𝑚𝑠

Fig. 6. End-to-end comparison of Q1.

Fig. 7. 𝜖 comparison of
Q2.

(a) 95% latency

(b) 𝜖 comparison

(c) Latency CDF under 𝜔 =
600𝑚𝑠

(d) Trade-off space.

Fig. 8. End-to-end comparison of Q3. PECJ (𝜔-100) refers to subtracting the 𝜔 of PECJ by 100𝑚𝑠.

(a) 𝜖 by varying key number

(b) 95% latency of varying
event rate

(c) 𝜖 by varying event rate

Fig. 9. Evaluation under
in-order data.

Fig. 10. Impacts of key number and event rate.

for data preprocessing, eliminating the need for a k-slack buffer. Each watermark indicates the
arrival of tuples with 𝜏𝑒𝑣𝑒𝑛𝑡 < 𝑇 , enabling the computation to commence early upon watermarks’
arrival. However, the emission of 𝑂 waits until the 𝜔 is reached.

B) Integrated Implementations: This setup is designed to assess PECJ’s performance when
incorporated into an existing multi-threaded stream processing system AllianceDB [49], which is a
recent multi-threaded SWJ testbed and serves as our integration platform. In this environment, we
selected two representative parallel SWJ algorithms, Parallel Radix Join (PRJ) and Symmetric Hash
Join (SHJ), to perform our assessment.

PRJ adopts a ‘lazy’ approach, delaying the join operation until all tuples have arrived. Conversely,
SHJ pursues an ’eager’ strategy, initiating the join process as soon as a portion of tuples arrives. Both
PRJ and SHJ operate under the assumption of in-order arrival, and consider a window complete
when the first tuple’s arrival timestamp (𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 ) surpasses the window’s boundary.

6.3 End-to-End Comparison
We initiate our analysis by juxtaposing PECJ, KSJ , and WMJ under the conditions stipulated by
Q1∼Q3 using the Stock dataset. The assumed time point of window completeness 𝜔 is fine-tuned
to 7𝑚𝑠, 10𝑚𝑠, and 12𝑚𝑠 for each methodology under Q1 and Q2, and to 200𝑚𝑠, 300𝑚𝑠, and 600𝑚𝑠
under Q3. We further include an in-order case for a more comprehensive comparison.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

71012Tuning knob ω (ms)0.02.65.17.710.295% latency (ms)WMJKSJPECJ71012Tuning knob ω (ms)0.020.841.562.383.1Error (%)0246810Latency (ms)0255075100Probability (%)95%WMJKSJPECJ71012Tuning knob ω (ms)0.021.943.865.687.5Error (%)WMJKSJPECJ200300600Tuning knob ω (ms)0.0171.5343.0514.5686.095% latency (ms)WMJKSJPECJPECJ(ω−100)200300600Tuning knob ω (ms)0.024.849.674.499.2Error (%)0100200300400500600700Latency (ms)0255075100Probability (%)95%WMJKSJPECJPECJ(ω−100)0200400600800100095% latency (ms)020406080100Error (%)≤200ms≤20%WMJKSJPECJTheoretical BestUser DemandWMJKSJPECJ0.02.85.68.311.1ms0.000.030.060.090.12%95% latency (ms)Error (%)101102103#Key02040Error (%)WMJKSJPECJ0100200300400Event Rate (KTuple/s)5101595% latency (ms)0100200300400Event Rate (KTuple/s)020406080Error (%)PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:17

(a) Q1

(b) Q3

Fig. 11. Impacts of Algorithm Configuration.

Fig. 12. Impacts of stream
oscillation. The larger Δ, the
severer oscillation.

Comparison under Q1. We apply the analytical instantiation in PECJ, i.e., PECJ analytical is
deployed. We elucidate the ensuing 95% processing latency (95% 𝑙) and relative error (𝜖) in
Figures 6(a) and 6(b). We also report the cumulative distribution function (CDF) of processing
latency under 𝜔 = 12𝑚𝑠 in Figure 6(c). Three critical insights emerge from this comparative analysis.
Initially, it is observed that for the same 𝜔, each strategy incurs a similar latency, as depicted in
Figures 6(a) and 6(c). This congruity arises mainly due to the similar overhead incurred from
waiting for a more comprehensive window of data. Relative to this waiting overhead, the specific
overheads engendered by WMJ , KSJ , and PECJ are marginal. The extra overhead of PECJ analytical
to conduct error compensation and update its model is within 1𝑚𝑠 in total, thanks to the proven
straightforward linear form (Equations 8, 9, and 10). Secondly, as anticipated, the error generated
by WMJ and KSJ exhibits similarity and consistently decreases with larger 𝜔 values. Despite their
distinct mechanisms for handling disordered data, they have an identical level of data completeness
within a given window under the same 𝜔. Consequently, their ignorance extent towards unobserved
data also aligns. Most notably, PECJ manifests its superior performance in significantly lower errors
compared to WMJ and KSJ . For instance, when 𝜔 is set to 7𝑚𝑠, PECJ can maintain an error as
low as ≤ 16% with a 95% 𝑙 of ≤ 5.5𝑚𝑠. In contrast, WMJ and KSJ register an error in excess of
20%, even when the 95% 𝑙 escalates above 9.5𝑚𝑠 by setting 𝜔 to 12𝑚𝑠. As expounded earlier, this
improved performance is attributed to PECJ’s proactive strategy of incorporating the contributions
of unobserved data, unlike the passive waiting approach of WMJ and KSJ (Section 3).

Comparison under Q2. Given the similar latency patterns across PECJ, KSJ , and WMJ , we
primarily present the resulting relative error (𝜖) in Figure 7. Despite Q2 demanding a more intricate
syntax and involving additional parameters compared to Q1 (Section 3.3), PECJ retains its superior
performance, evident through its significantly reduced error. For instance, when the 𝜔 is adjusted
to 10𝑚𝑠, the error incurred by PECJ is as low as 25.0%, compared to a substantial 52% for WMJ
and 51.5% for KSJ . The minor 0.5% 𝜖 reduction of KSJ compared with WMJ is due to the partial
re-ordering inherent in the k-slack methodology.

Comparison under Q3. Q3 involves much severer stream oscillation than Q1 and Q2, and
we adjust PECJ from analytical to learning-based. The corresponding 95% 𝑙 and 𝜖 are shown in
Figures 8(a) and 8(b), and we report the latency CDF under 𝜔 = 600𝑚𝑠 in Figure 8(c). Our findings
show that WMJ and KSJ fall short in adapting to this scenario, where stream oscillation and its
resulting data disordering manifests in an extreme fashion. Notably, even with 𝜔 set to a lenient
600𝑚𝑠, allowing for a latency of around 530𝑚𝑠, they still yield an unacceptably high error over
70%. Contrarily, PECJ consistently maintains the error within 3%, leveraging the learning-based
PDA to compensate for the error (Section 5.2). It’s important to acknowledge that the learning-based
approach of PECJ introduces an additional latency of around 90𝑚𝑠 (Figure 8(a)). However, as this
extra latency is a by-product of a constant inference process, it can be circumvented by reducing
𝜔 by 100𝑚𝑠, i.e., the PECJ (𝜔-100) configuration. Consequently, the PECJ (𝜔-100) still manages to
maintain the error within 5%.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

56789101112Tuning knob ω (ms)0255075100Error (%)WMJKSJPECJanalyticalPECJlearning100200300400500600700Tuning knob ω (ms)0255075100Error (%)2004006008001000Δ (ms)0255075100Error (%)13:18

Xianzhi Zeng et al.

(a) 95% latency

(b) 𝜖 comparison

Fig. 13. Single thread assessment of integrated implementation, using four real-world datasets.

(a) 95% latency

(b) 𝜖 comparison

(c) Throughput

Fig. 14. Scaling-up evaluation of integrated implementation, using Stock dataset.

In aligning with the motivation example in Section 1, we vary 𝜔 from 50 ∼ 1100𝑚𝑠 in order to
examine the trade-off space of latency and accuracy offered by PECJ, KSJ , and WMJ , as depicted
in Figure 8(d). For a clearer reference, we also plot the user demand (within 200𝑚𝑠 𝑙 [14] and
20% 𝜖 [24, 41]) and the theoretical best condition, i.e., when PECJ uses a perfect learning-based
instantiation with zero overhead, in Figure 8(d). Note that, the maximum oscillation magnitude
of tuples’ arrival delay is 1000𝑚𝑠, and each mechanism can observe all data in a window when
𝜔 > 1010𝑚𝑠. In the case where KSJ and WMJ can access all data of a window, their accuracy
approaches 100% but latency is too high (i.e., exceeds 800𝑚𝑠) to meet the user’s demands (i.e.,
within 200𝑚𝑠 latency). In contrast, PECJ outputs earlier (e.g., about 160𝑚𝑠) with marginal errors
(e.g., 4.2%). In other words, the tradeoff provided by PECJ is much more practically useful than
alternative solutions.

Comparison under In-order data. We evaluate PECJ, KSJ , and WMJ under a query with
in-order data. This query shares the same settings with Q1, except for Δ = 0𝑚𝑠, i.e., the event time
(𝜏𝑒𝑣𝑒𝑛𝑡 ) and arrival time (𝜏𝑎𝑟𝑟𝑖𝑣𝑎𝑙 ) of each tuple remain consistently synchronized, eliminating any
issues related to disordered arrivals or stream oscillations. We allow up to 1𝑚𝑠 processing delay for
the benchmark program to ingest tuples and set 𝜔 to 11𝑚𝑠 for each mechanism, the resulting 95% 𝑙
and 𝜖 are demonstrated in Figure 9. There are two key observations: 1) The latency of KSJ , WMJ ,
and PECJ remains comparable. 2) KSJ and WMJ lead to zero error while PECJ results in minor,
about 0.1% overcompensation, i.e., it may mistakenly think there are still some tuples missing. This
over-compensation phenomenon is caused by a lagged response to analyzing stream tendencies,
and the impact of historical observation is incrementally fading in PECJ instead of immediately
removed. We acknowledge that addressing the challenge of continually learning new tendencies
while preventing the catastrophic forgetting of historical observations is a fundamental research
challenge, as discussed in [32]. We envision future work aimed at resolving this issue.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

StockRovioLogisticsRetailDatasets0.05.511.116.622.295% latency (ms)SHJPRJPECJ-SHJPECJ-PRJStockRovioLogisticsRetailDatasets0.012.725.538.250.9Error (%)0510152025#Threads 20.325.530.635.840.995% latency (ms)SHJPRJPECJ-SHJPECJ-PRJ0510152025#Threads 0.025.050.075.0100.0Error (%)0510152025#Threads 0.0950.01900.02850.03800.0Throughput (KTuple/s)PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:19

6.4 Sensitivity Study
This subsection of the sensitivity study aims to contrast PECJ with the baseline models, WMJ and
KSJ , under a range of characteristics, including 1) the number of join keys, 2) the event rate, and 3)
the algorithm configurations, and 4) the magnitude of stream oscillations. By default, we fix 𝜔 to
10𝑚𝑠 and operate under a SWJ with a window length of 10𝑚𝑠, followed by 𝑆𝑈 𝑀 () aggregation.

Impacts of Join Keys. We utilize the synthetic dataset Micro [49] and set the Δ as 5𝑚𝑠. The
number of keys of both R and S randomly and vary the number of keys from 10 to 5000, while
maintaining the event rate at our default setting of 100𝐾𝑡𝑢𝑝𝑙𝑒/𝑠. Since the number of join keys has
virtually no impact on the latency of PECJ, WMJ , and KSJ (with a fluctuation of approximately
±0.6% around 8.25𝑚𝑠 at most), we present the relative error in Figure 10(a). In general, PECJ
outperforms the baseline models across a wide range of the number of keys. However, when the
number of keys increases to as high as 5000, the likelihood of encountering a join match diminishes,
which leads to fewer observations on join selectivity 𝜎 and slightly elevates its error.

Impacts of Event Rate. We hold the number of join keys at 10, and adjust the event rate from
10𝐾𝑇𝑢𝑝𝑙𝑒/𝑠 to 400𝐾𝑇𝑢𝑝𝑙𝑒/𝑠. The resulting 95% 𝑙 and 𝜖 are displayed in Figure 10. Our findings
show that KSJ experiences a latency 50% higher than either WMJ or PECJ when the event rate
reaches 200𝐾𝑇𝑢𝑝𝑙𝑒/𝑠, and its 𝜖 also begins to escalate under such high event rate. This phenomenon
occurs because 1) the k-slack overhead swells with a larger number of tuples processed per unit of
time (i.e., the higher event rate), causing KSJ to overload much more readily than WMJ or PECJ,
and 2) when an overload transpires, the partial reorder in KSJ becomes asynchronous, further
increasing its error. Compared to WMJ , PECJ is slightly more prone to overload, particularly at
event rates as high as 400𝐾𝑡𝑢𝑝𝑙𝑒/𝑠 due to the extra overhead involved in making observations
and executing compensations. Nonetheless, PECJ consistently achieves the smallest error under a
non-overload rate, and even under a mild overload.

Impacts of Algorithm Configurations. We delve into a sensitivity analysis aimed at evaluating
the accuracy of PECJ when implemented using varying strategies, specifically the analytical
(referred to as PECJ analytical henceforth, which demonstrates PECJ analytical via the minimum error
of SVI-based and AEMA-based methodologies) that leans on the central limit theorem as detailed
in Section 5.1, and the learning-based (referred to as PECJ learning henceforth), which prioritizes
generalization and the capture of unobserved data as elaborated in Section 5.2. Initially, we examine
the Q1 scenario, characterized by relatively slight stream oscillation and observation distortion.
As illustrated in Figure 11(a), we perform a comparative analysis of the relative error (𝜖) between
PECJ analytical, PECJ learning, and two baseline methods, WMJ and KSJ , while adjusting the 𝜔 within
the range of 5𝑚𝑠 to 12𝑚𝑠.

Our analysis yields several key insights. First, as anticipated in Section 2, both WMJ and
KSJ display similar error profiles across different 𝜔 values and consistently record higher errors
compared to PECJ analytical or PECJ learning. Second, while PECJ analytical adeptly corrects errors and
mirrors the arrival pattern in Q1, its accuracy is enhanced with a larger 𝜔, reflecting its reliance on
the central limit theorem (refer to Section 5.1). In essence, a larger 𝜔 provides a more significant
pool of observational data, hence boosting PECJ analytical’s accuracy. Finally, PECJ learning, engineered
for broad applicability, extracts latent information from the data streams and rectifies errors more
effectively than PECJ analytical. Notably, this robustness persists even when the pool of observational
data is curtailed by a smaller 𝜔.

We then proceed to evaluate the Q3 scenario, which introduces severer stream oscillation due
to a larger Δ. The 𝜔 is tuned from 50𝑚𝑠 to 700𝑚𝑠, and the relative errors (𝜖) of all methods are
illustrated in Figure 11(b). Generally, PECJ analytical struggles to accurately reflect Q3’s arrival pattern
and provides sub-optimal error compensation. Each observation on join selectivity or event rate

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:20

Xianzhi Zeng et al.

is heavily biased, violating the preconditions for applying the central limit theorem (Section 5.1).
While this bias can be reduced with a larger volume of observations, it necessitates a larger 𝜔.
Contrarily, PECJ learning is equipped to recognize these biases, overcoming the constraints of the
central limit theorem, and thus delivers superior error compensations as a general instantiation
method.

Impacts of Stream Oscillation. We conducted an investigation into the varying magnitudes
of stream oscillation based on the different outcomes observed with PECJ analytical and PECJ learning
under mild (Q1) and severe (Q3) stream oscillation scenarios. Specifically, we set the 𝜔 to 100𝑚𝑠,
gradually increase the maximum magnitude of tuples’ arrival delay (Δ) from 90𝑚𝑠 to 1000𝑚𝑠,
and keep other settings the same as Q1. It’s important to note that increasing Δ results in larger
magnitudes of stream oscillation. The resulting error is depicted in Figure 12. It is evident that the
error of PECJ analytical increases gradually with Δ, surpassing 50% when Δ reaches 150𝑚𝑠 or higher.
Eventually, it matches the high error levels of WMJ or KSJ when Δ becomes sufficiently large.
This behavior occurs because a large magnitude of stream oscillation, such as Δ = 500𝑚𝑠, renders
the central limit theorem unsuitable, and the relatively simple analytic forms in Equations 8, 9,
and 10 struggle to converge. In contrast, PECJ learning is capable of handling more severe stream
oscillation scenarios (e.g., 4.2% error when Δ = 1000𝑚𝑠). This capability is attributed to Equation 15,
which offers a proven general approach to dealing with stream oscillation. Theoretically, it will
only fail when mean-field family approximation and the universal approximation theorem do not
hold, which is a research area yet to be thoroughly explored in the literature. In this evaluation,
our neural network was pre-trained within a mere 2 minutes and required no further modification
after deployment. However, we acknowledge the potential need for more complex scenarios in
the future, where continuous retraining of the learning-based model may be necessary to further
enhance our understanding of this study.

6.5 Integrated Implementation Evaluation

In this evaluation, we contrast the original parallel SHJ and PRJ in AllianceDB with their
corresponding modifications under PECJ, namely, PECJ-SHJ and PECJ-PRJ. It is important to note
that the assumed time point of window completeness 𝜔 doesn’t impact SHJ and PRJ as they do
not handle disordered data streams. For both PECJ-SHJ and PECJ-PRJ, we set it to 10𝑚𝑠. We first
conduct a single-thread assessment on four real-world datasets, followed by a scaling-up evaluation
by using Stock as an example.

Single-thread Assessment. In this assessment, we report the 95% 𝑙 and 𝜖 of handling Stock,
Rovio, Logistics, and Retail datasets under Q1, as illustrated in Figure 13. Three key observations
stand out. Firstly, both PRJ and SHJ produce high error rates, for instance, a substantial 47% on
the Stock dataset when faced with disordered arrivals. Secondly, PECJ-PRJ and PECJ-SHJ notably
decrease these errors while managing to maintain similar latency to their counterparts, PRJ and SHJ.
This outcome attests to the robust efficiency in the optimization and implementation of PECJ. Lastly,
PECJ-SHJ showcases a lower 𝜖 than PECJ-PRJ, specifically, 1% versus 13% in the Stock dataset. This
improvement is a consequence of PECJ-SHJ’s real-time data stream analysis approach. In contrast
to PECJ-PRJ which waits for a window of tuples before starting the processing, PECJ-SHJ promptly
processes each input tuple upon arrival. This strategy enables PECJ-SHJ to rapidly detect and adapt
to immediate and ongoing changes in the data streams.

Scaling-up Evaluation. In the scaling-up evaluation, we keep the Q1 query, gradually increase
the number of Stock tuples in each window and ensure that the event rate of both 𝑅 and 𝑆 surpasses
1600𝐾𝑇𝑢𝑝𝑙𝑒𝑠/𝑠. By varying the number of threads from 1 to 24, we depict the 95% 𝑙, 𝜖, and system
throughput of each mechanism in Figure 14. It becomes clear that the lazy approaches, namely
PRJ and PECJ-PRJ, consistently outshine their eager counterparts (SHJ and PECJ-SHJ), in terms

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:21

of latency reduction and throughput improvement. This result aligns with previous studies [49]
conducted under in-order arrival scenarios, reaffirming the enduring challenges faced by eager
approaches such as cache thrashing, particularly when scaling up.

Moreover, PECJ-PRJ matches PRJ in terms of efficient scalability, largely thanks to its reduced
overhead in managing disorder. This reaffirms the efficacy of our theoretical optimization for
the PDA problem, using VI as outlined in Section 4. The integration of low-overhead AEMA VI
instantiation further contributes to an enhanced execution efficiency (Section 5.1). On the other
hand, despite its earlier successes, PECJ-SHJ incurs higher errors than PECJ-PRJ under a heavy
input workload, as illustrated in Figure 13(b). This can be attributed to distortions resulting from
eager disorder handling, which can potentially mislead PECJ by providing inaccurate information
for error compensation. Nonetheless, these findings collectively underscore PECJ’s practicality in
scaling up SWJ algorithms under challenging conditions of disordered data arrival.

7 RELATED WORK
This section discusses related research in Stream Window Join, Buffer-based Disorder Handling, and
Approximate Query Processing.

Stream Window Join (SWJ). The predominant aim in optimizing stream window join operations
has traditionally centred around enhancing efficiency and facilitating incremental processing. For
example, both the Handshake Join [43] and the Split Join [37] use a dataflow model to achieve
scalability on modern multicore architectures, whereas the IBWJ [39] utilizes a shared index
structure to expedite tuple matching. An exhaustive experimental study conducted by Zhang et
al. [49] contrasts these techniques across a wide spectrum of workload characteristics, application
necessities, and hardware designs. This study also underscores the successful adaptation of relational
join algorithms to hasten SWJ. Typically, these methodologies presume that data arrives in an
ordered manner and is fully accessible. Our work, however, ventures into investigating ways to
offset errors induced by incomplete data in the face of disorderly conditions.

Buffer-based Disorder Handling. A number of studies have delved into the accuracy-latency
tradeoff utilizing buffers. To prevent potential infinite buffering, existing research employs different
mechanisms for controlling buffer flushing and for making assumptions about the temporary
completeness of incoming data. These mechanisms include k-slack [23, 31], watermarks [6, 9, 40],
and punctuations [29]. For example, Ji et al. [22] introduced a k-slack-based disordered SWJ, which
regards the tradeoff between accuracy and latency as a crucial factor. They highlight that joins
inherently possess more complexity than single-stream linear operators, such as summation or
average, when handling disordered data. This complexity stems from the mutual and non-linear
relationships existing among multiple streams. Despite the variations in specific tradeoff rules and
methodologies, these approaches rely on data that has already arrived to generate results, thus
overlooking the contributions of future data. PECJ stands out by proactively compensating for this
yet-to-be-received data.

Approximate Query Processing (AQP). The goal of AQP is to reduce computational overhead
by selecting a data subset to approximate the result of the whole dataset [25, 30]. As data
selection is system-controlled, error compensation can be predefined and is relatively stable in AQP.
Compensation can use either linear [38] or non-linear formulas [5], depending on the algorithm’s
subset selection. More advanced AQP approaches employ machine learning [33] and bootstrap
methods [46] to tackle ubiquitous queries under static data, albeit with higher computational costs.
To address this issue, the Wander Join algorithm [28] applies stochastic and graph optimizations to
reduce overhead and optimize online aggregation for joins. Our work addresses a different and more

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:22

Xianzhi Zeng et al.

challenging problem—handling of disordered SWJ where observation distortion cannot be system-
controlled. Therefore, we propose to solve a PDA problem by VI and discuss its implementations for
disordered SWJ (Sections 4 and 5).

8 CONCLUSION
In this paper, we have introduced PECJ, a novel solution for executing SWJ, a critical operation in
stream analytics, amidst the challenges posed by disordered data. What sets PECJ apart is its unique
ability to proactively incorporate unobserved data, thereby enhancing the accuracy-latency tradeoff.
This feat is achieved by leveraging a sophisticated approach to PDA using efficient VI instantiations.
As evidenced by the successful implementation of PECJ in the multi-threaded SWJ benchmark
testbed, this method presents a promising advancement for enhancing data stream processing
capabilities under disordered data arrival conditions. Particularly, it has successfully reduced the
relative error from 47% to a remarkable 1%, while maintaining constant latency. Looking ahead, an
exciting prospect lies in expanding the applicability of PECJ and exploring how its principles can
integrate with approximate computing methodologies. This includes techniques such as sampling
and compression, which deliberately introduce data distortion to strike a balance between accuracy
and latency. The integration of these approaches would certainly open up new avenues for future
research.

Appendix: The data, results, code, scripts and an appendix with more discussions of this work

can be downloaded from https://anonymous.4open.science/r/PECJ.

REFERENCES
[1] [n. d.]. A Benchmark for Real-Time Relational Data Feature Extraction. https://github.com/decis-bench/febench. Last

Accessed: 2023-01-03.

[2] [n. d.]. OpenMLDB Use Cases. https://openmldb.ai/docs/en/main/use_case/index.html. Last Accessed: 2022-09-23.
[3] 2018. Shanghai Stock Exchange, http:// english.sse.com.cn/ . Last Accessed: 2020-06-29.
[4] 2023. Pytorch homepage, https:// pytorch.org/ .
[5] Sameer Agarwal, Barzan Mozafari, Aurojit Panda, Henry Milner, Samuel Madden, and Ion Stoica. 2013. BlinkDB:
queries with bounded errors and bounded response times on very large data. In Proceedings of the 8th ACM European
conference on computer systems. 29–42.

[6] Tyler Akidau, Edmon Begoli, Slava Chernyak, Fabian Hueske, Kathryn Knight, Kenneth Knowles, Daniel Mills, and
Dan Sotolongo. 2021. Watermarks in Stream Processing Systems: Semantics and Comparative Analysis ofApache Flink
and Google Cloud Dataflow. Technical Report. Oak Ridge National Lab.(ORNL), Oak Ridge, TN (United States).
[7] Tyler Akidau, Robert Bradshaw, Craig Chambers, Slava Chernyak, Rafael J Fernández-Moctezuma, Reuven Lax, Sam
McVeety, Daniel Mills, Frances Perry, Eric Schmidt, et al. 2015. The dataflow model: a practical approach to balancing
correctness, latency, and cost in massive-scale, unbounded, out-of-order data processing. (2015).

[8] Abdullah Alsaedi, Nasrin Sohrabi, Redowan Mahmud, and Zahir Tari. 2023. RADAR: Reactive Concept Drift
Management with Robust Variational Inference for Evolving IoT Data Streams. In Proceedings of the 39th IEEE
International Conference on Data Engineering (ICDE2023). IEEE.

[9] Ahmed Awad, Jonas Traub, and Sherif Sakr. 2019. Adaptive Watermarks: A Concept Drift-based Approach for Predicting

Event-Time Progress in Data Streams.. In EDBT. 622–625.

[10] Christopher M Bishop and Nasser M Nasrabadi. 2006. Pattern recognition and machine learning. Vol. 4. Springer.
[11] Savong Bou, Hiroyuki Kitagawa, and Toshiyuki Amagasa. 2021. Cpix: real-time analytics over out-of-order data
streams by incremental sliding-window aggregation. IEEE Transactions on Knowledge and Data Engineering 34, 11
(2021), 5239–5250.

[12] Tamara Broderick, Nicholas Boyd, Andre Wibisono, Ashia C Wilson, and Michael I Jordan. 2013. Streaming variational

bayes. Advances in neural information processing systems 26 (2013).

[13] Badrish Chandramouli, Mohamed Ali, Jonathan Goldstein, Beysim Sezgin, and Balan Sethu Raman. 2010. Data stream

management systems for computational finance. Computer 43, 12 (2010), 45–52.

[14] Martijn de Heus, Kyriakos Psarakis, Marios Fragkoulis, and Asterios Katsifodimos. 2021. Distributed transactions on
serverless stateful functions. In Proceedings of the 15th ACM International Conference on Distributed and Event-based
Systems. 31–42.

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

PECJ: Stream Window Join on Disorder Data Streams with Proactive Error Compensation

13:23

[15] Kangqi Ding. 2022. Analysis of Short Selling. In 2022 7th International Conference on Financial Innovation and Economic

Development (ICFIED 2022). Atlantis Press, 2030–2034.

[16] Roger Dingledine, Nick Mathewson, Paul F Syverson, et al. 2004. Tor: The second-generation onion router.. In USENIX

security symposium, Vol. 4. 303–320.

[17] Hua Fan and Wojciech Golab. 2021. Gossip-based visibility control for high-performance geo-distributed transactions.

The VLDB Journal 30, 1 (2021), 93–114.

[18] Behrouz A Forouzan. 2002. TCP/IP protocol suite. McGraw-Hill Higher Education.
[19] Tom Goldstein and Stanley Osher. 2009. The split Bregman method for L1-regularized problems. SIAM journal on

imaging sciences 2, 2 (2009), 323–343.

[20] Matthew D. Hoffman, David M. Blei, and Francis Bach. 2010. Online Learning for Latent Dirichlet Allocation. In
Proceedings of the 23rd International Conference on Neural Information Processing Systems - Volume 1 (Vancouver, British
Columbia, Canada) (NIPS’10). Curran Associates Inc., Red Hook, NY, USA, 856–864.

[21] Matthew D Hoffman, David M Blei, Chong Wang, and John Paisley. 2013. Stochastic variational inference. Journal of

Machine Learning Research (2013).

[22] Yuanzhen Ji, Jun Sun, Anisoara Nica, Zbigniew Jerzak, Gregor Hackenbroich, and Christof Fetzer. 2016. Quality-
driven disorder handling for m-way sliding window stream joins. In 2016 IEEE 32nd International Conference on Data
Engineering (ICDE). IEEE, 493–504.

[23] Yuanzhen Ji, Hongjin Zhou, Zbigniew Jerzak, Anisoara Nica, Gregor Hackenbroich, and Christof Fetzer. 2015. Quality-
driven continuous query execution over out-of-order data streams. In Proceedings of the 2015 ACM SIGMOD International
Conference on Management of Data. 889–894.

[24] Rasmus Kær Jørgensen and Christian Igel. 2021. Machine learning for financial transaction classification across
Intelligent Systems in Accounting, Finance and

companies using character-level word embeddings of text fields.
Management 28, 3 (2021), 159–172.

[25] Srikanth Kandula, Anil Shanbhag, Aleksandar Vitorovic, Matthaios Olma, Robert Grandl, Surajit Chaudhuri, and
Bolin Ding. 2016. Quickr: Lazily approximating complex adhoc queries in bigdata clusters. In Proceedings of the 2016
international conference on management of data. 631–646.

[26] Jeyhun Karimov, Tilmann Rabl, Asterios Katsifodimos, Roman Samarev, Henri Heiskanen, and Volker Markl. 2018.
Benchmarking distributed stream data processing systems. In 2018 IEEE 34th International Conference on Data
Engineering (ICDE). Ieee, 1507–1518.

[27] Nikos R Katsipoulakis, Alexandros Labrinidis, and Panos K Chrysanthis. 2020. Spear: Expediting stream processing

with accuracy guarantees. In 2020 IEEE 36th International Conference on Data Engineering (ICDE). IEEE, 1105–1116.

[28] Feifei Li, Bin Wu, Ke Yi, and Zhuoyue Zhao. 2016. Wander join: Online aggregation via random walks. In Proceedings

of the 2016 International Conference on Management of Data. 615–629.

[29] Jin Li, Kristin Tufte, Vladislav Shkapenyuk, Vassilis Papadimos, Theodore Johnson, and David Maier. 2008. Out-of-Order
Processing: A New Architecture for High-Performance Stream Systems. Proc. VLDB Endow. 1, 1 (aug 2008), 274–288.
https://doi.org/10.14778/1453856.1453890

[30] Kaiyu Li, Yong Zhang, Guoliang Li, Wenbo Tao, and Ying Yan. 2018. Bounded approximate query processing. IEEE

Transactions on Knowledge and Data Engineering 31, 12 (2018), 2262–2276.

[31] Ming Li, Mo Liu, Luping Ding, Elke A Rundensteiner, and Murali Mani. 2007. Event stream processing with out-of-order
data arrival. In 27th International Conference on Distributed Computing Systems Workshops (ICDCSW’07). IEEE, 67–67.
[32] Yiming Li, Yanyan Shen, and Lei Chen. 2022. Camel: Managing Data for Efficient Stream Learning. In Proceedings of

the 2022 International Conference on Management of Data. 1271–1285.

[33] Qingzhi Ma and Peter Triantafillou. 2019. Dbest: Revisiting approximate query processing engines with machine

learning models. In Proceedings of the 2019 International Conference on Management of Data. 1553–1570.

[34] Hongyu Miao, Heejin Park, Myeongjae Jeon, Gennady Pekhimenko, Kathryn S McKinley, and Felix Xiaozhu Lin. 2017.
Streambox: Modern stream processing on a multicore machine. In 2017 USENIX Annual Technical Conference (USENIX
ATC 17) (Santa Clara, CA, USA) (Usenix Atc ’17). USENIX Association, Berkeley, CA, USA, 617–629.

[35] Adrian Michalke, Philipp M Grulich, Clemens Lutz, Steffen Zeuch, and Volker Markl. 2021. An energy-efficient stream
join for the Internet of Things. In Proceedings of the 17th International Workshop on Data Management on New Hardware
(DaMoN 2021). 1–6.

[36] Douglas C Montgomery, Cheryl L Jennings, and Murat Kulahci. 2015. Introduction to time series analysis and forecasting.

John Wiley & Sons.

[37] Mohammadreza Najafi, Mohammad Sadoghi, and Hans-Arno Jacobsen. 2016. SplitJoin: A Scalable, Low-latency
Stream Join Architecture with Adjustable Ordering Precision. In 2016 USENIX Annual Technical Conference (USENIX
ATC 16). USENIX Association, Denver, CO, 493–505. https://www.usenix.org/conference/atc16/technical-sessions/
presentation/najafi

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

13:24

Xianzhi Zeng et al.

[38] Do Le Quoc, Ruichuan Chen, Pramod Bhatotia, Christof Fetzer, Volker Hilt, and Thorsten Strufe. 2017. Streamapprox:
Approximate computing for stream analytics. In Proceedings of the 18th ACM/IFIP/USENIX Middleware Conference.
185–197.

[39] Amirhesam Shahvarani and Hans-Arno Jacobsen. 2020. Parallel Index-Based Stream Join on a Multicore CPU. In
Proceedings of the 2020 ACM SIGMOD International Conference on Management of Data (Portland, OR, USA) (SIGMOD
’20). Association for Computing Machinery, New York, NY, USA, 2523–2537. https://doi.org/10.1145/3318464.3380576
[40] Yang Song, Yunchun Li, Hailong Yang, Jun Xu, Zerong Luan, and Wei Li. 2021. Adaptive watermark generation
mechanism based on time series prediction for stream processing. Frontiers of Computer Science 15 (2021), 1–15.
[41] Salvatore Stolfo, David W Fan, Wenke Lee, Andreas Prodromidis, and Philip Chan. 1997. Credit card fraud detection
using meta-learning: Issues and initial results. In AAAI-97 Workshop on Fraud Detection and Risk Management. 83–90.
[42] Binh Tang and David S Matteson. 2021. Probabilistic transformer for time series analysis. Advances in Neural

Information Processing Systems 34 (2021), 23592–23608.

[43] Jens Teubner and Rene Mueller. 2011. How Soccer Players Would Do Stream Joins. In Proceedings of the 2011 ACM
SIGMOD International Conference on Management of Data (Athens, Greece) (Sigmod ’11). Acm, New York, NY, USA,
625–636. https://doi.org/10.1145/1989323.1989389

[44] Arash Vahdat and Jan Kautz. 2020. NVAE: A deep hierarchical variational autoencoder. Advances in neural information

processing systems 33 (2020), 19667–19679.

[45] Sifan Wu, Xi Xiao, Qianggang Ding, Peilin Zhao, Ying Wei, and Junzhou Huang. 2020. Adversarial sparse transformer

for time series forecasting. Advances in neural information processing systems 33 (2020), 17105–17115.

[46] Kai Zeng, Shi Gao, Barzan Mozafari, and Carlo Zaniolo. 2014. The analytical bootstrap: a new method for fast error
estimation in approximate query processing. In Proceedings of the 2014 ACM SIGMOD international conference on
Management of data. 277–288.

[47] Steffen Zeuch, Ankit Chaudhary, Bonaventura Del Monte, Haralampos Gavriilidis, Dimitrios Giouroukis, Philipp M.
Grulich, Sebastian Breß, Jonas Traub, and Volker Markl. 2020. The NebulaStream Platform for Data and Application
Management in the Internet of Things. In CIDR 2020, 10th Conference on Innovative Data Systems Research, Amsterdam,
The Netherlands, January 12-15, 2020, Online Proceedings. www.cidrdb.org. http://cidrdb.org/cidr2020/papers/p7-zeuch-
cidr20.pdf

[48] Hao Zhang, Xianzhi Zeng, Shuhao Zhang, Xinyi Liu, Mian Lu, Zhao Zheng, and Yuqiang Chen. 2023. Scalable Online
Interval Join on Modern Multicore Processors in OpenMLDB. In Proceedings of the 39th IEEE International Conference
on Data Engineering (ICDE2023). IEEE.

[49] Shuhao Zhang, Yancan Mao, Jiong He, Philipp M Grulich, Steffen Zeuch, Bingsheng He, Richard TB Ma, and Volker
Markl. 2021. Parallelizing intra-window join on multicores: An experimental study. In Proceedings of the 2021
International Conference on Management of Data. 2089–2101.

ACKNOWLEDGMENTS

This work is partially supported by a MoE AcRF Tier 2 grant (MOE-T2EP20122-0010), and a
startup grant of NTU (023452-00001). Any opinions, findings and conclusions or recommendations
expressed in this material are those of the author(s) and do not reflect the views of the Ministry of
Education, Singapore. Corresponding author is Shuhao Zhang.

Received July 2023; revised October 2023; accepted November 2023

Proc. ACM Manag. Data, Vol. 2, No. 1 (SIGMOD), Article 13. Publication date: February 2024.

