SCALING DATA STREAM PROCESSING ON
MULTICORE ARCHITECTURES

SHU HAO ZHANG

Bachlor of Engineering (Computer Engineering, ﬁrst class honor)

Nanyang Technological University

A THESIS SUBMITTED

FOR THE DEGREE OF DOCTOR OF PHILOSOPHY

SCHOOL OF COMPUTING

NATIONAL UNIVERSITY OF SINGAPORE

2019

Supervisor:

Associate Professor Bing Sheng He

Examiners:

Associate Professor Chee Yong Chan

Associate Professor Yong Meng Teo

Assistant Professor Felix Xiao Zhu Lin, Purdue University

Declaration

I hereby declare that this thesis is my original work and it has been

written by me in its entirety. I have duly acknowledged all the sources of

information which have been used in the thesis.

This thesis has also not been submitted for any degree in any university

previously.

Shu hao Zhang

September 26, 2019

iii

Acknowledgments

This thesis will never have been completed without the generous assistance

offered by many people to whom I owe a lot. While it is difﬁcult for me to

enumerate all the people to whom I appreciate, I would like to list a few of

them below to acknowledge their selﬂess help.

First and foremost, I would like to thank my PhD advisor Bingsheng He. I

will always remember the warm afternoon when I was an undergraduate

year 3 student at NTU. I knocked and walked in Prof.He’s ofﬁce and ask “Hi

professor, I sincerely enjoyed your teaching of operating system course, can I

do a Final-Year-Project with you regarding system research?” That turns out

to be the beginning of my research journey under the supervising of Prof.He

of almost 7 years. I thank him for continuously encouraging me to explore

any research topic that I am interested in and selﬂess help and guidance from

him. I also thank him for always encouraging me to continue my research

whenever I feel frustrated about paper rejection. Beyond the discussion of

technical questions, Prof.He had also kindly share with me many advice and

lessons, which are insightful for my whole life. I feel extremely grateful for

having him standing by me whenever I confront any problems or troubles in

either research or career planning. I will never have enough guts to continue

my PhD journey without his continuous encouragement.

During the ﬁrst four years of my PhD study, I am fortunate to work as a

research trainee in SAP Innovation Center network, Singapore, where I have

been supervised by Dr. Falk Brauer, Dr. Hoang Tam Vo and Dr. Daniel

Dahlmeier at a different period. I would like to thank them for their patience

in teaching me the basic knowledge of doing research and sharing their past

experiences of purchasing the PhD. I feel grateful to have them to be my

mentors who always encouraged me whenever I face difﬁculties during

v

vi

research and works. I also need to thank Steve Lee, the director of SAP ICN

at that time for agreeing to offer me the great SAP PhD Scholarships. Their

professional attitude on doing research has undoubtedly encouraged me to

dive deeper into the research world.

I feel extremely fortunate to have Prof.Chee Yong Chan, Prof.Yong Meng

Teo and Prof.Felix Xiao Zhu Lin to be my thesis examiners. I also thank

Prof.Xiao Kui Xiao for being the head of department (HOD) represent of my

oral defense. Their insightful comments helped signiﬁcantly improve the

quality of this thesis.

There are many others that I need to appreciate during my PhD journey. I

am lucky to be a member of the Xtra Computing Group lead by Prof.He,

where I made a wonderful friendship with the group members. I’m also

glad to have been working with my seniors, Thomas Heinze, Jiong He, Chi

Zhou, Zeke Wang, Feng Zhang, and Yingjun Wu. Their continuously kind

advice and feedback greatly help me to improve my research skills.

Abstract

Data stream processing systems (DSPSs) enable users to express and run

stream applications to continuously process data streams. Witnessing

the emergence of modern commodity machines with massively parallel

processors, researchers and practitioners ﬁnd shared-memory multicore

architectures an attractive platform for DSPSs. However, fully exploiting the

computation power delivered by multicore architectures can be challenging,

and scaling DSPSs on modern multicore architectures remains to be

notoriously challenging. This is because processing massive amounts of

data can confront several performance bottlenecks inherited from different

DSPS components, which altogether put a strict constraint on the scalability

of the DSPSs on multicore architectures.

In this thesis, we present the evaluation, design and implementation

of DSPSs aiming at high-performance stream processing on multicore

architectures.

First, as modern DSPSs are mainly designed and

optimized for scaling-out using a cluster of low-end servers, we present

a comprehensive performance study of popular DSPSs (e.g., Apache

Storm, Flink) on multicore architectures and try to identify whether the

current implementation matches with modern hardware (e.g., non-uniform

memory access – NUMA, multicore). Second, our detailed proﬁling study

shows that existing DSPSs severely underutilized the underlying complex

hardware micro-architecture and especially show poor scalability due to the

unmanaged resource competition and unaware of NUMA effect. We hence

present our efforts on a complete revolution in designing next-generation

stream processing platform, namely BriskStream, speciﬁcally optimized for

shared-memory multicore architectures. A novel NUMA-aware execution

plan optimization scheme, namely Relative-Location-Aware-Scheduling

(RLAS) is proposed to address the NUMA effect for stream computation.

vii

viii

Third, DSPS with transactional state management relieves users from

managing state consistency by themselves. We introduce TStream, a DSPS

with built-in efﬁcient transactional state management. Compared to previous

works, it guarantees the same consistency properties while judiciously

exploits more parallelism opportunities – both within the processing of

each input event and among a (tunable) batch of input events. To conﬁrm

the effectiveness of our proposal, we compared TStream against three prior

solutions on a four-socket multicore machine. Our extensive experiment

evaluations show that TStream yields up to 6.8 times higher throughput

comparing with existing approaches with similar or even lower end-to-end

processing latency for varying application workloads.

Contents

List of Figures

List of Tables

1

Introduction

2 Preliminaries

2.1 Multi-Socket Multi-core Processors

2.1.1 Complex execution pipelines of modern processor

2.1.2 Non-uniform memory access (NUMA)

2.2 Data Stream Processing Systems

2.3 Data Stream Processing Benchmark

2.4 Consistent Stateful Stream Processing

3 Literature Review

3.1 DSPSs on Modern Hardware

3.1.1 Multicore Stream Processing

3.1.2 GPU-Enabled Stream Processing

3.1.3

FPGA-Enabled Stream Processing

3.2 Key Issues of Data Stream Processing

3.2.1 Execution Optimization Techniques

3.2.2 Out-of-order handling

3.2.3

State Management in DSPSs

3.3 Performance Evaluation for DSPSs

4 Revisiting the Design of Data Stream Processing Systems on Multi-Core

Processors

4.1

Introduction

4.2 Methodology

4.2.1 Evaluation Goals

xiii

xv

1

5

5

5

6

7

10

14

19

19

20

21

22

23

23

25

26

28

29

29

32

32

ix

Contents

4.2.2 Proﬁling Tools

4.3 Performance Evaluation

4.4 Study the impact of common designs

4.4.1 Execution time breakdown

4.4.2 Massively parallel execution model

4.4.3 Message passing and stream partitioning

4.4.4

JVM Runtime Environment

4.5 Towards more efﬁcient DSP systems

4.5.1 Non-blocking Tuple Batching

4.5.2 NUMA-Aware Executor Placement

4.5.3 Put It All Together

5 BriskStream:

Scaling Data Stream Processing on Shared-Memory

Multicore Architectures

5.1

Introduction

5.2 Execution Plan Optimization

5.2.1 The Performance Model

5.2.2 Problem Formulation

5.3 Optimization Algorithm Design

5.4 Algorithm Details

5.4.1 Discussion

5.4.2 Extension with other optimization techniques

5.5 BriskStream System

5.5.1

Improving Execution Efﬁciency

5.5.2

Improving Communication Efﬁciency

5.5.3 Discussion on Elasticity

5.6

Implementation details

5.7 Evaluation

5.7.1 Experimental Setup

5.7.2 Performance Model Evaluation

5.7.3 Evaluation of Execution Efﬁciency

5.7.4 Evaluation of RLAS algorithms

5.7.5

Factor Analysis

x

32

33

36

37

37

40

42

43

44

46

48

51

51

53

54

60

61

65

66

69

70

71

71

72

73

73

74

77

78

84

89

Contents

6 Scaling Consistent Stateful Stream Processing on Shared-Memory

Multicore Architectures

6.1

Introduction

6.2 Existing Solutions Revisited

6.3 TStream Overview

6.4 TStream Design

6.4.1 Programming model

6.4.2 Punctuation Signal Slicing Scheduling

6.4.3

Fine-grained Parallel State Access

6.4.4 More Processing Optimizations

6.5 Discussion

6.6 Evaluation

6.6.1 Experimental Setup

6.6.2 Benchmark Workloads

6.6.3 Overall Performance Comparison

6.6.4 Workload Sensitivity Study

6.6.5

System Sensitivity Study

7 Conclusion

7.1 Contributions

7.2 Discussions

8 Future Directions

9 Publications

9.1 Selected Publications

9.2 Other Publications

xi

91

91

94

95

97

97

98

100

103

104

105

105

106

108

111

115

117

117

118

121

123

123

123

List of Figures

2.1 Pipeline execution components of processor: (left) various stalls caused in

the pipeline, (middle) pipelines interactions with cache and memory systems

and (right) the interactions among the cache, TLB, and memory systems.

2.2 NUMA topology and peak bandwidth of our four-sockets server.

2.3

Interconnect topology for our eight-sockets servers.

2.4 Message passing mechanism.

2.5 Word-count execution graph.

2.6 Topologies of seven applications in our benchmark. DataSource can be further

divided into a linear chain of Spout and Parser operators.

2.7 Toll Processing (TP ).

4.1 Performance evaluation results on Storm and Flink.

4.2 Execution time breakdown.

4.3 Front-end stall breakdown.

6

7

8

8

9

12

15

36

37

38

4.4

Instruction footprint between two consecutive invocations of the same function. 39

4.5 Varying number of executors of Map-Matcher operator of TM when running

Storm with four CPU sockets.

4.6 Back-end stall breakdown.

4.7 Normalized throughput of tuple batching optimization.

4.8 Normalized latency of tuple batching optimization.

4.9 NUMA-aware executor placement.

4.10 Normalized throughput with all optimizations enabled.

5.1 Word Count (WC) as an example application.

5.2 CDF of proﬁled average execution cycles of different operators of WC.

5.3 RLAS Optimization example.

42

43

47

47

48

49

54

58

62

xiii

List of Figures

5.4 Placement optimization at runtime. Light colored rectangle represents a live

node that still violates resource constraints. Dark colored rectangle stands

for a solution node contains a valid plan.

5.5 Example job overview in BriskStream.

5.6 Throughput speedup.

5.7 End-to-end latency of WC on different DSPSs.

5.8 Scalability evaluation.

5.9 Gaps to ideal.

5.10 Execution time breakdown.

5.11 Comparing with StreamBox.

5.12 RLAS w/ and w/o considering varying RMA cost.

5.13 Placement strategy comparison under the same replication conﬁguration.

5.14 CDF of random plans.

5.15 Communication pattern matrices of WC on two Servers.

5.16 A factor analysis for BriskStream. Changes are added left to right and are

cumulative.

6.1

Issues of prior solutions.

6.2 AUX_Tuple maintenance.

6.3 Example workﬂow of switching between phases.

6.4 Transaction decomposition example.

6.5 Three more applications in our benchmark workloads.

6.6 Throughput (log-scale) comparison of different applications under different

execution schemes. There are 25% multi-partition transactions for GS, SL

and OB.

6.7 Runtime breakdown per state transaction of TP.

6.8 Multi-partition transaction evaluation.

6.9 Varying application workload conﬁgurations of GS.

6.10 Effect of varying punctuation interval.

6.11 99th percentile end-to-end processing latency.

6.12 Effect of work-stealing.

6.13 Varying processing conﬁgurations.

xiv

64

74

79

80

81

81

81

83

85

86

87

88

90

96

99

100

102

106

109

111

111

112

112

113

113

113

List of Tables

2.1 Summary of Terminologies

4.1

JVM proﬁle ﬂags

4.2 Processor measurement components

4.3 Detailed speciﬁcation on our testing environment

4.4 CPU and memory bandwidth utilization on a single CPU socket

4.5 LLC miss stalls when running Storm with four CPU sockets

5.1 Summary of terminologies

5.2 Operator selectivity of LR

5.3 Characteristics of the two servers we use

5.4 Average processing time per tuple (T ) under varying NUMA distance. The

unit is nanoseconds/tuple

5.5 Model accuracy evaluation of all applications. The performance unit is K

events/sec

5.6

99-percentile end-to-end latency (ms)

5.7 Placement strategies

5.8 Tuning compression ratio (r)

14

33

34

34

35

41

56

75

76

78

78

80

85

89

xv

CHAPTER 1

Introduction

Data stream processing system (DSPS) is a software that allows users to run their

streaming applications which continuously process inﬁnite data streams in real-

time. Unlike conventional database management systems (DBMSs), modern DSPSs

are featured in supporting continuous lower-latency analytics over real-time data

streams. Due to its unique characteristics, a large body of system research [CFMKP13,

WT15, GSHW14, GSS15, CKE+15, TTS+14, KBF+15] has focused on designing and

implementing new DSPSs to to meet the fast increasing and more and more diverging

application demands. Arguably starting from 2000’s, DSPSs have been investigated by

a large number of research groups in the database community [ACc+03, CCD+03,

AAB+05, NRNK10, TTS+14, KBF+15, CKE+15, DZSS14, NPP+17, NRNK10], and

leading enterprises including SAP [ZVDH17], IBM [GAW+08], Google [ABB+08] and

Microsoft [CGB+14]. With the proliferation of high-rate streaming sources, numerous

streaming applications are deployed in real-world use cases [Tra18] that involves

continuously low-latency, complex analytics over massive data streams. This trend has

accelerated the development of next-generation performance-critical DSPSs.

Most existing DSPSs are designed and optimized for scaling out using a cluster of

low-end machines (e.g., [TTS+14, CKE+15, XCTS14, GSHW14, ABQ13, PHH+15]). In

particular, substantial research efforts have been devoted on providing mechanisms

to handle the inherent challenges from the distributed environment settings, such

as dueling with network communication overhead [XCTS14, ABQ13, PLS+06], fault-

tolerance [WT15, DZSS14, CFMKP13, CEF+08] and elastic scaling [GSHW14, HJHF14].

Despite the successes achieved during the last several decades, these DSPSs are

now facing great challenges when supporting a wide range of emerging time-critical

1

Chapter 1. Introduction

2

applications, which generally require the underlying DSPSs to achieve low end-to-end

latency when processing huge volumes of data. Any unpredictable latency spikes

(e.g., in TCP/IP network) inside the distributed DSPS can cause serious issues in

those applications such as hospital infection-control monitoring and online abnormally

trajectory detection.

Witnessing the emergence of modern commodity machines with massively parallel

processors, researchers and practitioners ﬁnd shared-memory multicore architectures

an attractive alternative platform [ZHD+04, CDW17], and several in-memory single-

node DSPSs are recently proposed [KWCF+16, MPJ+17, ZHZH19]. One of the key

beneﬁts of single-node DSPSs is the completely avoidance of network communication

latency among multi-node inside the DSPSs. In addition to that, several heavyweight

components, such as (de)serialization can be completely avoided, which both simplify

the system development and improve execution efﬁciency. Furthermore, optimizing

the performance of stream processing on a single-node is critical even in a distributed

conﬁguration for an obvious reason – it reduces the number of machines required to

achieve the same performance objective.

Thanks to the great achievements made in the hardware community, modern commodity

machines are now equipped with massively parallel processors and larger memory

capacity and demonstrated superior performance for real-world applications [AGN+13].

For example, recent scale-up servers can accommodate even hundreds of CPU cores

and multi-terabytes of memory [MF17] providing abundant computing resources and

emerging network technologies such as Remote Direct Memory Access (RDMA) and

10Gb Ethernet signiﬁcantly improve system ingress rate making I/O no longer a

bottleneck in many practical scenarios [MPJ+17, CDW17]. However, fully exploiting

the computation power delivered by multicore architectures can be challenging. On

one hand, the on-chip cache hierarchies that support large core counts are getting larger,

deeper, and more complex to utilize. Furthermore, as modern machines scale to multiple

sockets, non-uniform memory access (NUMA) becomes an important performance

factor for data management systems (e.g., [LBKN14, LPM+13]). On the other hand,

little work has been done on studying common design aspects of modern DSPSs on

shared-memory multicore architectures.

Chapter 1. Introduction

3

To fully understand the potential difﬁculties that may be confronted when building

modern multicore main-memory DSPSs, we study the performance bottlenecks inherited

from three common design aspects in different modern DSPSs. Then, we discuss a novel

execution plan optimization scheme addressing NUMA effect to improve scalability

of DSPSs on multicore architectures. After that, we discuss a new scalable design of

transactional state management in DSPSs.

The discussion on the different aspects discussed above illustrate the challenges we

may confront in building a high performance DSPSs that can effectively utilize modern

multicore architectures. These aspects are tightly coupled with each other, and the

redesign of a single component can directly affect the effectiveness of others. Witnessing

these problems, in this thesis, we study the problem of building scalable multicore DSPSs

from a systematic perspective. In particular, we discuss the design and implementation

of two core components of DSPSs, including execution plan optimization and state

management. Throughout this thesis, we conduct comprehensive performance study

and propose novel mechanisms to address the issues identiﬁed above. In addition,

we also point out future directions in designing and implementing next-generation

high-performance DSPSs.

The road map of the proposed thesis are listed as follows.

• Revisiting the Design of Data Stream Processing Systems on Multi-Core

Processors. This work has been published in a conference paper [ZHD+04]. We

revisit three common design aspects of modern DSPSs on modern multi-socket

multi-core architectures, including a) pipelined processing with message passing,

b) on-demand data parallelism, and c) JVM-based implementation. Particularly,

we conduct detailed proﬁling studies with micro benchmark on Apache Storm

and Flink. Our results show that those designs have underutilized the scale-up

architectures in these two key aspects: a) The design of supporting both pipelined

and data parallel processing results in a very complex massively parallel execution

model in DSPSs, which causes high front-end stalls on a single CPU socket; b) The

design of continuous message passing mechanisms between operators severely

limits the scalability of DSPSs on multi-socket multi-core architectures. We further

present two optimizations to address those performance issues and demonstrate

Chapter 1. Introduction

4

promising performance improvements.

• BriskStream: Scaling Data Stream Processing on Shared-Memory Multicore

Architectures. This work has been published in a conference paper [ZHZH19].

We introduce BriskStream, a new data stream processing system with a new

streaming execution plan optimization paradigm, namely Relative-Location Aware

Scheduling (RLAS). BriskStream scales stream computation towards a hundred of

cores under NUMA effect. The experiments on eight-sockets machines conﬁrm

that BriskStream signiﬁcantly outperforms existing DSPSs up to an order of

magnitude even without the tedious tuning process. We hope our study on relative-

location aware scheduling could shed lights on other NUMA-aware execution

plan optimization research.

• Scaling Consistent Stateful Stream Processing on Shared-Memory Multicore

Architectures. This work is submitted to a conference [ZWZH19]. We introduce

TStream with a new design for scaling transactional state management in stream

processing.

In order to take advantage of multicore architectures, TStream

detaches the state management from the streaming computation logic, and

performs its internal state maintenance asynchronously. By eliminating the

expensive synchronization primitives, TStream aggressively extracts parallelism

opportunities by revealing the operation dependencies at runtime. Our

experimental results show that TStream achieves up to 6.8x higher throughput

over existing solutions with similar or even smaller end-to-end processing latency

at the scale of millisecond.

The outline of this thesis is listed as follows. We begin in Chapter 2 a preliminary

background information of DSPSs and multicore architectures we are targeting at.

Chapter 3 covers a comprehensive literature review of the state-of-the-art mechanisms

in the design and implementation of DSPSs. In Chapter 4, we then provide a detailed

evaluation of modern DSPSs on shared-memory multicore architectures. In Chapter 5,

we present BriskStream with a novel NUMA-aware execution plan optimization scheme.

We next discuss TStream in Chapter 6, a new DSPS with built-in scalable transactional

state management on multicores. We summarize this thesis in Chapter 7. In Chapter 8,

we provide some suggestions in future work of enhancing DSPSs.

CHAPTER 2

Preliminaries

In this section, we ﬁrst introduce the background of the multi-socket multi-core

processors. Then, we introduce three design aspects of two DSPSs we studied,

namely Apache Storm [TTS+14] and Flink [CKE+15]. After that, we introduce our

designed micro-benchmark for data stream processing systems covering seven popular

applications. Finally, we motivate consistent stateful stream processing with a running

example.

2.1 Multi-Socket Multi-core Processors

2.1.1 Complex execution pipelines of modern processor

Modern processors consist of multiple different hardware components with deep

execution pipelines, as shown in Figure 2.1. We also illustrate the stalls and the

interactions among pipelines and memory systems in the ﬁgure. The pipeline can

be divided into the front-end component and the back-end component [Int19].

The front-end is responsible for fetching instructions and decodes them into micro-

operations (µops). It feeds the next pipeline stages with a continuous stream of micro-

ops from the path that the program will most likely execute, with the help of the branch

prediction unit. The front-end component is composed of the following parts. First,

the instruction fetch units are responsible for instruction prefetching from L1-ICache.

Second, the Instruction Length Decoder (ILD) performs pre-decoding on the fetched

instructions. Third, the instruction queue (IQ) is used to store pre-decoded instructions.

Fourth, the instruction decode units, i.e., instruction decoders and instruction decode

queue (IDQ), are responsible for decoding instructions stored in IQ into µops.

5

Chapter 2. Preliminaries

6

Figure 2.1: Pipeline execution components of processor: (left) various stalls caused in
the pipeline, (middle) pipelines interactions with cache and memory systems and (right)
the interactions among the cache, TLB, and memory systems.

Starting from Sandy Bridge micro-architecture, Intel introduces a special component

called Decoded ICache (D-ICache), which is essentially an accelerator of the traditional

front-end pipeline. D-ICache maintains up to 1.5k of decoded µops. Future references

to the same µops can be served by it without performing the fetch and decode stages.

D-ICache is continuously enhanced in terms of size and throughput in the successor

generations of Intel processors. Note that, every µops stored in D-ICache is associated

with its corresponding instruction in L1-ICache. An L1-ICache miss also causes D-ICache

to be invalidated.

The back-end is where the actual instruction execution happens.

It detects the

dependency chains among the decoded µops (from IDQ or the D-ICache), and executes

them in an out-of-order manner while maintaining the correct data ﬂow.

2.1.2 Non-uniform memory access (NUMA)

Modern machines scale to multiple sockets with non-uniform-memory-access (NUMA)

architecture. Each socket has its own “local" memory and is connected to other sockets

and, hence to their memory, via one or more links. Therefore, access latency and

Instruction Fetch UnitsInstruction Length Decoder (ILD)Instruction Queue (IQ)Instruction DecodersITLB1.5k D-ICacheInstruction Decode Queue (IDQ)L2 CacheLLCRenamerRetirementDTLBL1-DCacheMemoryFront endBack endSchedulerExecution CoreITLB miss Stalls& L1-I cache miss stallsLCP StallsIQ full stallsILD StallsIDQ StallsDTLB miss Stalls& Data miss stallsL1-ICacheµops issuedµops dispatchedµops executedChapter 2. Preliminaries

7

Figure 2.2: NUMA topology and peak bandwidth of our four-sockets server.

bandwidth vary depending on whether a core in a socket is accessing “local" or “remote"

memory. Such NUMA effect requires ones to carefully align the communication patterns

accordingly to get good performance. Figure 2.2 illustrates the NUMA topology of our

sever with four sockets. Each CPU socket has its local memory, which is uniformly

shared by the cores on the socket. Sockets are connected by a much slower (compared

to local memory access) channel called Quick Path Interface (QPI).

Different NUMA conﬁgurations exist nowadays market, which further complicates the

software optimization on them. Figure 2.3 illustrates the NUMA topologies of two of

our eight-sockets servers. In the following, we use “Server A” to denote the ﬁrst, and

“Server B” to denote the second. Server A can be categorized into the glue-less NUMA

server, where CPUs are connected directly/indirectly through QPI or vendor custom

data interconnects. Server B employs an eXternal Node Controller (called XNC [HPE18])

that interconnects upper and lower CPU tray (each tray contains 4 CPU sockets). The

XNC maintains a directory of the contents of each processors cache and signiﬁcantly

reduces remote memory access latency. The detailed speciﬁcations of our two servers

are shown in our experimental setup (Section 5.7).

2.2 Data Stream Processing Systems

In the following, we introduce three design aspects of Storm and Flink: 1) pipelined

processing with message passing, 2) on-demand data parallelism, and 3) JVM-based

implementation.

Socket 0(8 Cores)DRAM(128 GB)16 GB/S(bidirectional)51.2 GB/SDRAM(128 GB)DRAM(128 GB)DRAM(128 GB)Socket 1(8 Cores)Socket 2(8 Cores)Socket 3(8 Cores)QPIChapter 2. Preliminaries

8

(a) Server A (glue-less)

(b) Server B (glue-assisted)

Figure 2.3: Interconnect topology for our eight-sockets servers.

Figure 2.4: Message passing mechanism.

Pipelined processing with message passing. We describe the execution model with a

general deﬁnition [GSS15]. A streaming application is represented by a graph, where

nodes in the graph represent either data source operators or data processing operators,

and edges represent the data ﬂow between operators. In general, there are two types of

operators deﬁned in the topology. 1) a data source operator generates (or receives from the

external environment) events to feed into the topology, and 2) a data processor operator

encapsulates speciﬁc processing logics such as ﬁltering, transforming or user-deﬁned

function.

In a shared-memory environment, an operator (continuously) writes its output data into

the local memory. For each output data, the operator also pushes a tuple consisting of

a reference (i.e., pointer) of the output data into its output queue. The corresponding

consumer (continuously) fetches the tuple from the queue, and then accesses on the

CPU 3CPU 2CPU 0CPU 1CPU 4CPU 5CPU 7CPU 6Upper CPU trayLower CPU trayCPU 3CPU 2CPU 0CPU 1Upper CPU trayLower CPU trayXNCCPU 4CPU 5CPU 6CPU 7XNCPass valuePass referenceMemorySocket 0Socket 1queueProducerConsumerQPI1234xStep xChapter 2. Preliminaries

9

Figure 2.5: Word-count execution graph.

output data generated by the producer operator through memory fetches. In other

words, the communication between two operators are through the data reference.

This pass-by-reference message passing approach avoids duplicating data in a shared-

memory environment and is the common approach adopted by most modern DSP

systems. Figure 2.4 illustrates an example of message passing between operators in

a shared-memory environment, where the producer and consumer are scheduled to

CPU socket 0 and socket 1, respectively. The producer ﬁrst writes its output data to the

local memory of socket 0 (step 1) and emits a tuple containing a reference to the output

data to its output queue (step 2). The consumer fetches from the corresponding queue

to obtain the tuple (step 3) and then accesses the data by the reference (step 4). This

example also demonstrates remote memory accesses across sockets during message

passing in DSP systems, which we will study in details in Section 4.4.3.

On-demand data parallelism. Modern DSP systems such as Storm and Flink are

designed to support task pipeline and data parallelism at the same time. The actual

execution of an operator is carried out by one or more physical threads, which are

referred to as executors. Input stream of an operator is (continuously) partitioned

among its executors. The number of executors for a certain operator is referred to

as the parallelism level and can be conﬁgured by users in the topology conﬁguration.

A topology at the executor level is called an execution graph. An example execution

graph of the word-count application is shown in Figure 2.5. In this example, the split,

count, and sink operators have three, two and one executors, respectively. Streams are

partitioned and delivered to speciﬁc destination executors according to the grouping

Data SourceSinkSplitCountSplitSplitShuffle groupingCountGlobal groupingFields groupingChapter 2. Preliminaries

10

strategy speciﬁed by the user. In the previous example, the shufﬂe grouping strategy

used in the data source operator uniformly distributes the tuples to each split executor.

Meanwhile, each spilt executor sends tuples to count executors according to the attribute

of the tuple (speciﬁed as ﬁeld grouping) so that the same key (i.e., the same word) is

always delivered to the same count executor.

JVM-based implementation. Both Storm and Flink are implemented with JVM-based

programming languages (i.e., Closure, Java, and Scala), and their execution relies on

JVM. Two aspects of JVM runtime are discussed as follows.

Data reference: As we have mentioned before, message passing in DSP systems always

involves passing the reference. That is, operators access the data through the reference

in the tuple, which may lead to pointer chasing and stress the cache and TLB of the

processor heavily.

Garbage collection (GC): Another important aspect of the JVM-based system is the built-in

memory management. Modern JVM implements generational garbage collection which

uses separate memory regions for different ages of objects. The signiﬁcant overhead

of GC has been reported in many existing studies (e.g., [SP14, ABVA15]). To this end,

some DSP systems have even implemented its own memory management besides JVM

(e.g., Flink).

2.3 Data Stream Processing Benchmark

In order to examine existing DSP systems as well as to verify the effectiveness of our

proposed optimization techniques, we design our streaming benchmark according to

the four criteria proposed by Jim Gray [Gra92]. As a start, we design the benchmark

consisting of seven streaming applications including Stateful Word Count (WC), Fraud

Detection (FD), Spike Detection (SD), Trafﬁc Monitoring (TM), Log Processing (LG),

Spam Detection in VoIP (VS), and Linear Road (LR).

We brieﬂy describe how they achieve the four criteria. 1) Relevance: the applications

cover a wide range of memory and computational behaviors, as well as different

application complexities so that they can capture the DSP systems on scale-up

architectures; 2) Portability: we describe the high-level functionality of each application,

Chapter 2. Preliminaries

11

and they can be easily applied to other DSP systems; 3) Scalability: the benchmark

includes different data sizes; 4) Simplicity: we choose the applications with simplicity in

mind so that the benchmark is understandable.

Our benchmark covers different aspects of application features. First, our applications

cover different runtime characteristics. Speciﬁcally, TM has highest CPU resource

demand, followed by LR, VS and LG. CPU resource demand of FD and SD is relatively

low. The applications also have variety of memory bandwidth demands. Second,

topologies of the applications have various structural complexities. Speciﬁcally, WC,

FD, SD, and TM have single chain topologies, while LG, VS, and LR have complex

topologies. Figure 2.6 shows the topologies of the seven applications.

In the following, we describe each application including its application scenario,

implementation details and input setup.

In all applications, we use a simple sink

operator to measure the throughput.

Stateful Word Count (WC): The stateful word-count counts and remembers the frequency

of each received word unless the application is killed. The topology of WC is a single

chain composed of a Split operator and a Count operator. The Split operator parses

sentences into words and the Count operator reports the number of occurrences for

each word by maintaining a hashmap. This hashmap is once created in the initialization

phase and is updated for each receiving word. The input data of WC is a stream of

string texts generated according to a Zipf-Mandelbrot distribution (skew set to 0) with a

vocabulary based on the dictionary of Linux kernel (3.13.0-32-generic).

Fraud Detection (FD): Fraud detection is a particular use case for a type of problems

known as outliers detection. Given a transaction sequence of a customer, there is a

probability associated with each path of state transition, which indicates the chances of

fraudulent activities. We use a detection algorithm called missProbability [Gho13] with

sequence window size of 2 events. The topology of FD has only one operator, named

as Predict, which is used to maintain and update the state transition of each customer.

We use a sample transaction with 18.5 million records for testing. Each record includes

customer ID, transaction ID, and transaction type.

Log Processing (LG): Log processing represents the streaming application of performing

real-time analyzing on system logs. The topology of LG consists of four operators. The

Chapter 2. Preliminaries

12

(a) Stateful Word Count (WC)

(b) Fraud Detection (FD)

(c) Spike Detection (SD)

(d) Trafﬁc Monitoring (TM)

(e) Log Processing (LG)

(f) Spam Detection in VoIP (VS)

(g) Linear Road (LR)

Figure 2.6: Topologies of seven applications in our benchmark. DataSource can be further
divided into a linear chain of Spout and Parser operators.

Geo-Finder operator ﬁnds out the country and city where an IP request is from, and

the Geo-Status operator maintains all the countries and cities that have been found so

far. The Status-Counter operator performs statistics calculations on the status codes of

HTTP logs. The Volume-Counter operator counts the number of log events per minute.

We use a subset of the web request data (with 4 million events) from the 1998 World

Cup Web site [AJ00]. For data privacy protection, each actual IP address in the requests

is mapped to randomly generated but ﬁxed IP address.

Spike Detection (SD): Spike detection tracks measurements from a set of sensor devices

SinkCountSplitData SourceData SourceSinkPredictData SourceSinkSpikeDetectionMovingAverageData SourceSinkSpeedCalculateMapMatchData SourceCountSinkStatusSinkGeoStatusVolume CounterStatusCounterGeoFinderGeoSinkData SourceScoreURLGlobalACDFoFIRACDCT24ECR24ENCRECRFRCRFVoice DispatcherSinkAccountBalanceLast Average SpeedTollNotificationAccident NotificationDaily ExpensesCount VehiclesAccident DetectionAverageSpeedDispatcherData SourceSinkChapter 2. Preliminaries

13

and performs moving aggregation calculations. The topology of SD has two operators.

The Moving-Average operator calculates the average of input data within a moving

distance. The Spike-Detection operator checks the average values and triggers an alert

whenever the value has exceeded a threshold. We use the Intel lab data (with 2 million

tuples) [Mad04] for this application. The detection threshold of moving average values

is set to 0.03.

Spam Detection in VoIP (VS): Similar to fraud detection, spam detection is a use case of

outlier detection. The topology of VS is composed of a set of ﬁlters and modules that

are used to detect telemarketing spam in Call Detail Records (CDRs). It operates on

the ﬂy on incoming call events (CDRs), and keeps track of the past activity implicitly

through a number of on-demand time-decaying bloom ﬁlters. A detailed description

of its implementation can be found at [BdN11]. We use a synthetic data set with 10

million records for this application. Each record contains data on a calling number,

called number, calling date, answer time, call duration, and call established.

Trafﬁc Monitoring (TM): Trafﬁc monitoring performs real-time road trafﬁc condition

analysis, with real-time mass GPS data collected from taxis and buses1. TM contains

a Map-Match operator which receives traces of an object (e.g., GPS loggers and GPS-

phones) including altitude, latitude, and longitude, to determine the location (regarding

a road ID) of this object in real-time. The Speed-Calculate operator uses the road ID

result generated by Map-Match to update the average speed record of the corresponding

road. We use a subset (with 75K events) of GeoLife GPS Trajectories [ZZXM09] for this

application.

Linear Road (LR): Linear Road (LR) is used for measuring how well a DSP system can

meet real-time query response requirements in processing a large volume of streaming

and historical data [ACG+04, JAA+06]. It models a road toll network, in which tolls

depend on the time of the day and level of congestions. Linear Road has been used by

many DSP systems, e.g., Aurora [ACc+03], Borealis [AAB+05], and System S [GAW+08].

LR produces reports of the account balance, assessed tolls on a given expressway on

a given day, or estimates cost for a journey on an expressway. We have followed the

implementation of the previous study [SC14] for LR. Several queries speciﬁed in LR

1A real deployment at http://210.75.252.140:8080/infoL/sslk_weibo.html.

Chapter 2. Preliminaries

14

Table 2.1: Summary of Terminologies

are implemented as operators and integrated into a single topology. The input to LR

is a continuous stream of position reports and historical query requests. We merge the

two data sets obtained from [ACG+04] resulting in 30.2 million input records (including

both position reports and query requests) and 28.3 million historical records.

2.4 Consistent Stateful Stream Processing

In this section, we use a simpliﬁed toll processing query (TP ) from the Linear Road

Benchmark [ACG+04] as a running example to motivate consistent stateful stream

processing. TP calculates a toll every time a vehicle reports a position in a new road

segment, in which tolls depend on the level of congestion of the road. The congestion

status (i.e., average speed and count of vehicles) of a road segment are maintained and

updated for every vehicle position report (i.e., input events).

One common way to implement TP is illustrated in Figure 2.7a. Each vertex denotes

an operator, and edge denotes data ﬂow between operators. Parser parses each input

event into position report containing <timestamp, geographic position, speed>. Each

position report is broadcast to three downstream operators: 1) Road Speed computes

average trafﬁc speed of a road segment; 2) Vehicle Cnt computes the average number

TermDefinitionEventInput stream event with a monotonically increasing timestampPunctuationSpecial tuple embedded in a data stream that indicates the end of a subset of the streamOperatorBasic unit of a stream application, continuously process event streamsExecutorEach operator can be carried by multiple executors (i.e., threads)Shared statesMutable states that are concurrently accessible by multiple executors of an operatorState transactionA set of state accesses triggered by processing of a single input eventACID+OA consistency property satisfying ACID properties and event timestamp orderingChapter 2. Preliminaries

15

(a) conventional implementation

(b) implementation with shared-state consistentcy guarantee

Figure 2.7: Toll Processing (TP ).

of unique vehicles of a road segment; 3) The computed road statistics are passing to

Toll Notification, which computes the toll of a vehicle referencing to the trafﬁc

speed and number of unique vehicles of the road segment, where the vehicle is. The toll

report is continuously send to Sink for output.

The congestion status (i.e., speed and count) of road segments are application states,

which need to be maintained for future reference during processing. In most of today’s

DSPSs, there are two challenges requiring the application developer to handle by

themselves. Firstly, to sustain high input stream ingress rate, each operator need to be

carried in multiple executors (e.g., Java threads), which handle multiple input events

concurrently. Subsequently, in order to ensure state consistency, report of the same road

must be always handled by the same executor of Road Speed, Vehicle Cnt and

Toll Notification operator, respectively. This is commonly achieved by key-based

stream partitioning (e.g., using geo-position value of each position report as the key to

partition position report stream) and is not generally suitable. For example, suppose the

processing of one position report needs to access not only the road segment of where

the current report belonging, but also other road segments information (e.g., if nearby

roads are empty, pay extra penalty for driving on the current road segment) which may

ParserSinkToll NotiﬁcationpositionreportVehicle CntbroadcastRoad SpeedSortTrafﬁc condition (vehicle cnt)                          cnt (HashSet)SegID (100 unique)Trafﬁc condition (average speed)                          speed (double)SegID (100 unique)ParserSinkToll NotiﬁcationpositionreportVehicle CntRoad SpeedChapter 2. Preliminaries

16

be maintained by other executors. Then, the executor needs to access application states

maintained by other executors (e.g., through status broadcasting), which involves costly

synchronization and communication overhead. A skewed stream will further worse

the performance [KLC08]. Secondly, the system needs to always ensure that the position

report passed to any executor of Toll Notification is processed only after it receives

the updated road congestion status from Road Speed and Vehicle Cnt operators.

Unfortunately, as all operators (and their executors) are running independently, such

ordering constraint is challenging to preserve. Most existing DSPSs left such burden

to developer, and it is commonly achieved by manually embedding tuple buffering

and sorting operations (i.e., the Sort operation in Figure 2.7a) inside the operator

logic [SC14], which is error prone and involves signiﬁcant performance penalty.

To relieve users from managing state consistency by themselves, consistent shared state

management [AMC17] are recently emerged. We follow previous works [MTZ+15,

AMC17] of employing transactional semantics [BG81] on managing shared state access.

Speciﬁcally, we adopt the following two deﬁnitions from previous studies.

Deﬁnition 1 (state transaction). We deﬁne the set of state accesses triggered by processing of

a single input event ets at one executor as one state transaction, denoted as txnts. Timestamp

ts of a state transaction is deﬁned as the same as its triggering event.

Concurrent accesses to shared state can cause data inconsistency.

Previous

studies [AMC17, BFKT12, MTZ+15] advocate that the execution of multiple state

transactions concurrently should satisfy ACID properties. In addition, it is also required

that state access order follows event timestamp ordering (please refer to [AMC17] for a

detailed description).

Deﬁnition 2 (consistent property). We deﬁne a consistency property satisfying both ACID

properties and ordering constraint as ACID+O properties. A DSPS under ACID+O needs to

ensure the state transaction schedule must be conﬂict equivalent to txn1 ≺ ... ≺ txnn.

An implementation of TP utilizing consistent shared state management is illustrated

in Figure 2.7b. It is implemented with the same operators but road congestion status

are shared among all operators (and their executors). Speciﬁcally, the road status

are maintained in two tables, one for maintaining average road speed, and one for

count of unique vehicles. Both tables are read- and write-able by all executors of Road

Chapter 2. Preliminaries

17

Speed, Vehicle Cnt and Toll Notification operators. The key of both table is

the road segment ID. Input events can be round-robin shufﬂed among all executors

to process concurrently to ensure load balancing, and the state consistency is enforced

by the system through wisely managing concurrent state accesses to shared states and

enforcing the aforementioned ACID+O properties.

CHAPTER 3

Literature Review

The design and implementation of DSPSs have attracted a great amount of effort from

both the research and the industry communities during the last decade. In this chapter,

we provide a comprehensive and multidisciplinary literature review on DSPSs. Instead

of performing a survey of all related works, we focus on those closely related to our

works.

3.1 DSPSs on Modern Hardware

In the last decade, a great number of different academic prototypes as well as commercial

products of DSPSs have been built. The ﬁrst-generation of DSPSs were often built as

extensions of existing database engines. Representatives of those earlier DSPSs including

TelegraphCQ [CCD+03], Aurora [ACc+03] and STREAM [G+03, ABW06]. SQL-variant

programming language (e.g., CQL [ABW06]) is proposed together with the system.

Due to the hardware limitation, ﬁrst-generation DSPSs primarily focus on single-core

execution. Driven by new demands of streaming applications, second-generation

DSPSs, such as Borealis [AAB+05], System-S [GAW+08], are equipped with advanced

features such as fault tolerance [AAB+05], adaptive query processing [RDS+04] and

more complex query expressions [BCM06] (e.g., complex event processing). Modern

DSPSs (i.e., third-generation) are strongly driven by the trend towards cloud computing.

Two key features of them are scaling over a cluster of machines and highly robustness

on faults. Some important examples including Apache Storm [TTS+14], Flink [CKE+15],

Spark Streaming [DZSS14], Samza [NPP+17] and S4 [NRNK10]. Despite their different

architectures and design focuses, majority of them are designed with the aim of

optimizing the performance of DSPSs in a distributed environment.

19

Chapter 3. Literature Review

20

Great achievements have been made in the computer architecture community. Modern

commodity machines are now equipped with hundreds-cores processors [MF17],

massively parallel accelerators, multi-terabytes of memory capacity [ZHZH19], and

gigabytes per second network bandwidth [CDW17]. To fulﬁll the fast growing demand

in handling real-time streams, researchers and practitioners have investigated and

proposed many hardware-conscious DSPSs in exploiting the potential of accelerating

stream processing on modern hardware. However, fully utilizing hardware capacity

is notoriously challenging, and a large number of studies were proposed in recent

years (e.g., [CGB+14, KWCF+16, NSJ16, GBY09, KCDP16, SAG+10, ZHD+04, MPJ+17,

ZHZH19, ZMK+01]). This thesis aims to push further the state-of-the-art of hardware-

conscious DSPSs. In the following, we survey related works on accelerating stream

processing by utilizing multicore CPUs, GPUs and FPGAs.

3.1.1 Multicore Stream Processing

Language and Compiler. Multicore architectures have been ubiquitous. However,

programming models and compiler techniques for employing multicore features are

still lag behind hardware improvements. Kudlur et al. [KM08] were among the ﬁrst

to develop a compiler technique to map stream application to a multicore processor.

By taking the Cell processor as an example, they study how to compile and run a

stream application expressed in their proposed language StreamIt. The compiler

works in two steps, 1) operator ﬁssion optimization (i.e., split one operator into multiple

ones) and 2) assignment optimization (i.e., assign each operator to a core). The two-

step mapping is formulated as an integer linear programming (ILP) problem and

requires a commercial ILP solver. Noting its NP-Hardness, Farhad et al. [FKBS11]

later presented an approximation algorithm to solve the mapping problem. Note

that, the mapping problem from Kudlur et al. [KM08] considers only CPU loads, and

ignores communications bandwidth. In response, Carpenter et al. [CRA09] developed

an algorithm that maps a streaming program onto a heterogeneous target, further

taking communication into consideration. To utilize a SIMD-enabled multicore system,

Hormati et al. [HCW+10] proposed to vectorize stream applications. Relying on high-

level information, such as the relationship between operators, they were able to achieve

better performance than general vectorization techniques. Agrawal et al. [AFK+12]

Chapter 3. Literature Review

21

proposed a cache-conscious scheduling algorithm for mapping stream application on

multicore processors. Particularly, they developed the theoretical lower bounds on cache

misses when scheduling a streaming pipeline on multiple processors, and the upper

bound of the proposed cache-based partitioning algorithm called seg_cache. They also

experimentally found that scheduling solely based on the modelled cache effects can be

often more effective than the conventional load-balancing (based on computation cost)

approaches.

Multicore-aware DSPSs. Recently, there has been a fast growing interest in building

multicore-friendly DSPSs.

Instead of statically compiling a program as done

in StreamIt [KM08, FKBS11, CRA09], these DSPSs provide better elasticity for

application execution. They also allow the usage of general purpose programming

languages (e.g., Java, Scala) to express stream applications. Tang et al. [TG13] studied

the data ﬂow graph to explore the potential parallelism in a DSPS and proposed an

auto-pipelining solution that can utilize multicore processors to improve the throughput

of stream processing applications. For economic reasons, power efﬁciency has become

more and more important in recent years, especially in HPC domains. Kanoun et

al. [KRAVDS14] proposed a multicore scheme for stream processing that takes power

constraint into consideration. Trill [CGB+14] is a single-node query processor for

temporal or streaming data. Contrary to most distributed DSPSs (e.g., Storm, Flink)

adopting continuous operator model, Trill runs the whole query only on the thread that

feeds data to it. Such an approach has shown to be especially effective when applications

contain no synchronization barriers [ZMK+01].

3.1.2 GPU-Enabled Stream Processing

GPUs are the most popular heterogeneous processors due to their high compute capacity

and cost-effectiveness. However, due to their unique execution model, special designs

are required to efﬁciently adapt stream processing to GPUs.

Single-GPU. Verner et al. [VSS11] presented a general algorithm for processing data

streams with real-time stream scheduling constraint on GPUs. This algorithm assigns

data streams to CPUs and GPUs based on their incoming rates. It tries to provide an

assignment that can satisfy different requirements from various data streams. Zhang

et al. [ZHH15] developed a holistic approach to build DSPSs using GPUs. They

Chapter 3. Literature Review

22

design a latency-driven GPU-based framework, which mainly focuses on real-time

stream processing. Due to the limited memory capacity of GPUs, the window size

of the stream operator plays an important role in system performance. Pinnecke et

al. [PBS15] studied the inﬂuence of window size, and proposed a partitioning method

for splitting large windows into different batches, considering both time and space

efﬁciency. SABER [KWCF+16] is a window-based hybrid stream processing framework

using GPUs.

Multi-GPUs. Multi-GPUs systems provide tremendous computation capacity, but also

pose challenges like how to partition or scheduling among different GPUs. Verner et

al. [VSSM12] extend their method [VSS11] to a single node with multiple GPUs. A

scheduler manipulates stream placement and guarantees that the requirements among

different streams can be met. GStream [ZM11] is the ﬁrst data streaming framework for

GPU clusters. GStream supports stream processing applications in the form of a C++

library; it uses MPI to implement the data communication between different nodes, and

uses CUDA to conduct stream operations on GPUs. In addition, GStream includes a

language abstraction for users to describe different applications. Alghabi et al. [ASK15]

ﬁrst introduced the concept of stateful stream data processing on a node with multiple

GPUs. This work describes processing graph-like arrangements of different processing

modules. Nguyen et al. [NL16] considered the scalability with the number of GPUs on a

single node, and developed a GPU performance model for stream workload partitioning

in multi-GPU platforms with high scalability. Chen et al. [CXT+15] proposed G-Storm,

which enables Storm [TTS+14] to utilize GPUs and can be applied to various applications

that Storm has already supported.

3.1.3 FPGA-Enabled Stream Processing

FPGAs are programmable integrated circuits whose hardware interconnections can be

conﬁgured by users. Due to their low latency, high energy efﬁciency, and low hardware

engineering cost, FPGAs have been explored in various application scenarios, including

stream processing.

Hagiescu et al. [HWBR09] ﬁrst elaborated challenges to implementing stream processing

on FPGAs, and proposed algorithms that optimizes processing throughput and latency

for FPGAs. Mueller et al. [MTA09] provided Glacier, which is an FPGA-based query

Chapter 3. Literature Review

23

engine that can process queries from streaming networks. The operations in Glacier

include selection, aggregation, grouping, and windowing. Experiments show that

using FPGAs help achieve much better performance than using conventional CPUs. A

common limitation of an FPGA-based system is its intensive synthesis process, which

takes signiﬁcant time to compile the application into hardware designs for FPGAs. This

makes FPGA-based systems inﬂexible in adapting to query changes. In response, Najaﬁ

et al. [NSJ13] demonstrated Flexible Query Processor (FQP), an online reconﬁgurable

event stream query processor that can accept new queries without disrupting other

queries under execution.

3.2 Key Issues of Data Stream Processing

In this section, we discuss a few key issues in data stream processing, and especially

highlights prior works related to our proposed techniques.

3.2.1 Execution Optimization Techniques

Various research communities have greatly inﬂuenced the development of DSPSs

including database, operating systems, and complex event processing. They have

independently developed optimizations for stream processing. A detailed survey is

provided at [HSS+03]. We now focus on the following two categories that are closely

related to our works.

Tuple Batching. The general idea of batching in stream processing is straightforward.

Instead of transmit and process one data item at one time, process multiple data times in

a single batch. The beneﬁts are mainly two folds. First, batching can amortize the cost of

bringing the execution instructions into cache over multiple data items. Second, it also

amortizes the cost of communication over operators. Sax et al. [SC14] proposed to create

an independent batching buffer for each consumer in order to batch all tuples that will

be processed by the same consumer to avoid wrong ﬁelds grouping problem. However,

the additional explicit buffering delay in every executor may introduce serious negative

impact on the system latency. Das et al.[DZSS14] studies the effect of batch sizes and

other parameters on the throughput and end-to-end latency of the system, and proposes

an algorithm based on Fixed-Point Iteration to automatically adapt batch sizes as the

Chapter 3. Literature Review

24

circumstance varies, which targets to minimize the end-to-end latency while keeping

the system stable. In our proﬁling study, we also found batching is particularly helpful

in improving DSPS performance by reducing L1-ICache miss stalls.

Operator Placement and Parallelism. Operator placement in a distributed DSPS

determines its scalability to a greater extent. Many algorithms and mechanisms [ABQ13,

XCTS14, PHH+15, CGLPN16, CGLPN17, Kha09] are developed to allocate (i.e.,

schedule) operators of a job into physical resources (e.g., compute node) in order

to achieve certain optimization goal, such as maximizing throughput, minimizing

latency or minimizing resource consumption, etc. Aniello et al. [ABQ13] propose two

schedulers for Storm. The ﬁrst scheduler is used in an ofﬂine manner prior to executing

the topology and the second scheduler is used in an online fashion to reschedule after

a topology has been running for a duration. Similarly, T-Storm [XCTS14] dynamically

assigns/reassigns operators according to run-time statistics in order to minimize inter-

node and inter-process trafﬁc while ensuring load balance. R-Storm [PHH+15] focuses

on resource awareness operator placement, which tries to improve the performance

of Storm by assigning operators according to their resource demand and the resource

availability of computing nodes. Cardellini et al. [CGLPN16, CGLPN17] propose a

general mathematical formulation of the problem of optimizing operator placement

for distributed data stream processing. Recently, Li et al. [LXTW18] present a machine-

learning based framework for minimizing end-to-end processing latency on DSPSs.

However, based on our study, executor placement inside a single machine also needs to

be considered due to the NUMA effect.

Many DSPSs, such as Storm [TTS+14], Heron [KBF+15], Flink [CKE+15] and

Seep [CFMKP13], share similar architectures including pipelined processing and operator

replication designs. Speciﬁcally, an application is expressed as a DAG (directed acyclic

graph) where vertexes correspond to continuously running operators, and edges

represent data streams ﬂowing between operators. To sustain high input stream

ingress rate, each operator can be replicated into multiple instances running in parallel.

A streaming execution plan determines the number of replicas of each operator (i.e.,

operator replication), as well as the way of allocating each operator to the underlying

physical resources (i.e., operator placement). A natural question raised in deploying

DSPSs on multicore architecture is how to ﬁnd a streaming execution plan that

Chapter 3. Literature Review

25

maximizes processing throughput of DSPSs under NUMA effect. Due to NUMA,

operator experiences additional remote memory access (RMA) penalty during input

data fetch when it is allocated in different CPU sockets to its producers. As a result,

the processing speed and resource demand of an operator is not ﬁxed but related to

how it is allocated in different execution plans. An algorithm ignoring such varying

properties of the concerned problem either over-estimates resource demand of operators

that results in resource underutilization or under-estimates resource demand that results

in severely thread interference. Both leads to suboptimal performance. Although

NUMA-awareness system optimization has been previously studied in the context of

relational database [GARH14, PSM+16, LBKN14], those works are either 1) focused

on different optimization goals (e.g., better load balancing [PSM+16] and minimizing

resource usage [GARH14]) or 2) based on different system architectures [LBKN14]. They

provide highly valuable techniques, mechanisms and execution models but none of

them uses the knowledge at hand to solve the problem we address, that is how to ﬁnd a

streaming execution plan that maximizes processing throughput of DSPSs under NUMA

effect.

3.2.2 Out-of-order handling

In a real production environment, out-of-order1 input data is not uncommon. A stream

operator is considered order-sensitive if it requires input events to be processed in a

certain predeﬁned order (e.g., chronological order). Handling out-of-order input data

in order-sensitive operator often turns out to be a performance bottleneck as there is a

fundamental conﬂict between data parallelism and order-sensitive – the former seeks

to improve the throughput of an operator by letting more than one thread operate on

different events concurrently, possibly out-of-order.

Gulisano et al. [GNPT15] are among the ﬁrst to handle out-of-order for high-

performance stream join on multicores. The proposed algorithm called scalejoin ﬁrst

merges all incoming tuples into one stream (through a data structure called scalegate) and

then distributes them to processing threads (PTs) to perform join. The output also needs

to be merged and sorted before exiting the system. StreamBox [MPJ+17] handles out-of-

1other issues such as delay and missing can be seen as special cases of out-of-order.

Chapter 3. Literature Review

26

order with punctuation based technique on multicore processors. Relying on a novel

data structure called cascading container to track dependencies between epochs (a group

of tuples delineated by punctuations), StreamBox is able to maintain the processing

order among multiple concurrently executing containers that exploit the parallelism of

modern multicore hardware. Kuralenok et al. [KMTN18] attempt to balance the conﬂict

between order-sensitive and multicore parallelism with an optimistic approach falling

in the third approach. The basic idea is to conduct process without any regulations, but

apologize (i.e., sending amending signals) when processing order is violated. They show

that the performance of the proposed approach depends on how often reorderings are

observed during runtime. In the case when the input order naturally preserved, there is

almost no overhead. However, it leads to extra network trafﬁc and computations when

reorderings are frequent. To apply such an approach in practical use-cases, it is hence

necessary to predict the probability of reordering, which could be interesting future

work. Despite the signiﬁcant efforts, existing DSPSs are still far from ideal in exploiting the

potential of modern hardware. For example, as observed in our experiments [ZHZH19],

the same DSPS (i.e., StreamBox) delivers several times lower performance as a result of

enabling ordering-guarantee. In this thesis, we hence assume applications are ordering-

insensitive and we focus on mitigate the gaps between stream processing and modern

hardwares while allowing out-of-order processing.

3.2.3 State Management in DSPSs

Emerging stream applications often require the underlying DSPS to maintain large

application state so as to support complex real-time analytics [TSM18] – a feature often

being called as state management. Representative example states kept during stream

processing include graph data structure [ZCC17] and transaction records [MTZ+15].

Researchers are exploring efﬁcient approaches to support analytical query workload

on Non-Volatile Memory (NVM) [PSK18]. An NVM-aware storage layout for tables is

presented based on a multi-dimensional clustering approach and a block-like structure

to utilize the entire memory stack. The storage structure designed on NVM may serve as

the foundation in supporting features like transactional stream processing system [Sat19].

Recent works [LES+18] have also investigated the performance limitations of current

state management approaches on SSDs and show that query-aware optimizations can

Chapter 3. Literature Review

27

signiﬁcantly improve the performance of stateful query processing on SSDs.

Concurrency Control.

An operator may need to manage shared mutable

states [AMC17], where the same application state may be concurrently accessed

(read/write) by multiple instances of the operator (called executors) running in

different threads.

In order to maintain the consistency of shared states and to

guarantee the correctness of stream computation results, a DSPS that attempts to

concurrently manipulate the shared states must perform access operations with ACID

guarantees. Concurrency control (CC) protocols have been investigated widely in

decades [BG81, FTA14, YBP+14, WCT16] for guaranteeing ACID properties. To improve

the transaction processing performance, several works have been proposed to improve

the effectiveness of concurrency control protocols. Transaction chopping [SLSV95],

a widely adopted technique to partition transactions, have been applied to several

modern database applications. Faleiro et al. [FTA14] proposed a technique for lazily

evaluating transactions, and this technique improves database performance for certain

kinds of workloads. Based on a similar design principle, the same authors improved

the MVCC performance by decoupling concurrency control protocol and version

management from transaction execution [FA15]. Wang et al. [WMC+16] presented

a method for decomposing transaction and evaluate them in a ﬁne-grained manner

while still guaranteeing state consistency. Different from the traditional database

architectures, several deterministic DBMSs, including H-Store [SMA+], Hyper [KN11],

and Calvin [TA10], have been proposed. These DBMSs divide the underlying storage

into multiple partitions, each of which is protected by a lock and is assigned a single-

threaded execution engine with exclusive access.

Transactional State Management. More than simply guaranteeing the ACID properties,

DSPSs further need to guarantee the state access order follows the input event timestamp

order [CDK+14] (e.g., a write request shall not affect read request of earlier event with a

smaller timestamp). Wang et al. [WRE11] conducted an early study on the importance

of supporting transactional state management. In their proposal, DSPSs must support

a new computing paradigm, called active complex event processing (ACEP), to enable

complex interactive real-time analytics. Subsequently, different rules are maintained and

shared by multiple concurrently running stream operators, which has to be guaranteed

with transactional semantics. To this end, two types of locking based algorithms for

Chapter 3. Literature Review

28

concurrent state transaction execution are described. Botan et al. [BFKT12] presented

an uniﬁed transactional model for streaming applications, called UTM. MeeHan et

al. [MTZ+15] attempted to fuse OLTP and streaming processing together and developed

the S-Store system. Affetti et al. [AMC17] proposed a state consistency model with

ACID+O properties guaranteed. However, prior works commonly heavily rely on locks

in guaranteeing state consistency during state transaction execution. There is also a

recent launch of a commercial system, called Streaming Ledger [Tra18] for extending

Flink with transactional state management capability. However, it is unfortunately

close-sourced and little information has been exposed to the public.

3.3 Performance Evaluation for DSPSs

Despite the successes achieved during the last decade, DSPSs are now facing great

challenges when supporting a wide range of emerging time-critical applications, which

generally require the underlying DSPSs to achieve low end-to-end latency when

processing huge volumes of data. Witnessing the emergence of modern commodity

machines with massively parallel processors, researchers and practitioners ﬁnd shared-

memory multicore architectures an attractive alternative platform [CDW17], and

several in-memory single-node DSPSs are recently proposed [KWCF+16, MPJ+17].

Unfortunately, there is no one “standard” implementation of DSPSs, and there have been

a few studies on comparing different DSPSs. A comparison of S4 and Storm [MBM09]

uses a micro-benchmark to understand the performance issues of the systems regarding

scalability, execution time and fault tolerance. A similar study [CCM12] has been

conducted to compare the performance characteristics of three DSPSs, including System-

S, S4, and Esper. A recent study [SC] comparing Flink, Storm, and Spark Streaming has

shown that, Storm and Flink have sub-second latency with relatively low throughputs,

while Spark streaming has higher throughput at a relatively high latency. However,

those evaluation study treat each DSPS as a black box, and little attention has been paid

to the research on the key and common design aspects of various DSPSs on modern

multi-core processors.

CHAPTER 4

Revisiting the Design of Data Stream Processing

Systems on Multi-Core Processors

4.1 Introduction

Many data stream processing systems (DSPSs) have recently been proposed to meet the

increasing demand of processing streaming data, such as Apache Storm [TTS+14],

Flink [CKE+15], Spark Streaming [DZSS14], Samza [NPP+17] and S4 [NRNK10].

Regardless of the different architectures of those DSP systems, they are mainly

designed and optimized for scaling out using a cluster of commodity machines

(e.g., [XCTS14, ABQ13, PHH+15]). We observe the following three common design

aspects in building those existing DSPSs:

a) Pipelined processing with message passing: A streaming application is usually

implemented as multiple operators with data dependencies, and each operator

performs three basic tasks continuously, i.e., receive, process and output. Such a

pipelined processing design enables DSPSs to support very low latency processing,

which is one of the key requirements in many real applications that cannot be well

supported in batch-processing systems.

b) On-demand data parallelism: Fine-grained data parallelism conﬁguration is

supported in many DSP systems. Speciﬁcally, users can conﬁgure the number of

threads in each operator (or function) independently in the streaming application.

Such an on-demand data parallelism design aims at helping DSP systems scale for

high throughput.

c) JVM-based implementation: Recent DSP systems are mostly built on top of JVM (Java

29

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

30

Virtual Machine). Although the use of JVM-based programming language makes

the system development more productive (e.g., built-in memory management),

many JVM runtime performance issues such as data reference and garbage

collection are transparent to programmers.

Modern servers are being deployed in the cluster environment. More CPU cores are

being put on the same die. Subsequently, the on-chip cache hierarchies that support

these cores are getting larger, deeper, and more complex. Furthermore, as modern

machines scale to multiple sockets, non-uniform memory access (NUMA) becomes an

important performance factor for data management systems (e.g., [LBKN14, LPM+13]).

For example, recent NUMA systems have already supported hundreds of CPU cores

and multi-terabytes of memory [MF17]. However, there is a lack of detailed studies on

proﬁling the above common design aspects of DSP systems on modern architectures.

In this work, we experimentally revisit those common design aspects on a modern

machine with multiple CPU sockets. We aim to offer a better understanding of how

current design aspects of modern DSP systems interact with modern processors when

running different types of applications. We use two DSP systems (i.e., Apache

Storm [TTS+14] and Flink [CKE+15]) as the evaluation targets. Note that the major

goal of this study is to evaluate the common design aspects of DSP systems on scale-up

architectures using proﬁled results so that our results and ﬁndings can be applicable to

many other DSP systems, rather than to compare the absolute performance of individual

systems. There has been no standard benchmark for DSP systems, especially on scale-up

architectures. Thus, we design our micro benchmark with seven streaming applications

according to the four criteria proposed by Jim Gray [Gra92].

Through detailed proﬁling studies with our benchmark on a four-socket machine, we

make the following key observations.

First, the design of supporting both pipelined and data parallel processing leads to a

very complex massively parallel execution model in DSP systems, which poorly utilizes

modern multi-core processors. Based on our proﬁling results, a signiﬁcant portion

(∼40%) of the total execution time is wasted due to L1-instruction cache (L1-ICache)

misses. The signiﬁcant L1-ICache misses are mainly due to the large instruction footprint

between two consecutive invocations of the same function.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

31

Second, the design of continuous message passing between operators causes a

serious performance degradation to DSP systems running on multiple CPU sockets.

Furthermore, the current design of data parallelism in DSP systems tends to equally

partition input streams regardless of the location of executors (i.e., they may be

scheduled on different CPU sockets), which overlooks the NUMA effect. The throughput

of both Storm and Flink on four CPU sockets is only slightly higher or even lower than

that on a single socket for all applications in our benchmark. The costly memory accesses

across sockets severely limit the scalability of DSP systems.

Third, the JVM runtime brings two folds of overhead to the execution, and they

are moderate in DSP systems. 1) The translation lookaside buffer (TLB) stalls take

5∼10% and 3∼8% of the total execution time for most applications on Storm and Flink,

respectively. The major causes include the frequent pointer referencing issues in data

accesses and Java execution. 2) The overhead from garbage collection (GC) accounts

for only 1 ∼ 3% of the total execution time. The observed minor impact of GC is very

different from previous studies on other data-intensive platforms with large memory

footprints (e.g., [ABVA15, SP14]).

Addressing the above-mentioned issues should allow DSPSs to exploit modern scale-up

architectures. As initial attempts, we evaluate two optimizations: 1) non-blocking tuple

batching to reduce the instruction footprint for processing a tuple so that the instruction

cache performance can be improved; 2) NUMA-aware executor placement to make thread

placement aware of remote memory accesses across sockets. The evaluation results

show that both optimizations are effective in improving the performance of DSPSs

on multi-socket multi-core processors. Putting them altogether achieves 1.3∼3.2x and

1.2∼3.1x throughput improvement on Storm and Flink, respectively.

To the best of our knowledge, this is the ﬁrst detailed study of common design aspects

of DSPSs on scale-up architectures with a wide range of applications. Improving DSPSs

on the scale-up architectures is also beneﬁcial for the scale-out setting, by either offering

a better performance with the same number of machines or reducing the number of

machines to achieve the same performance requirement.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

32

4.2 Methodology

We conduct an extensive set of experiments to proﬁle the performance of Storm and

Flink on a modern scale-up server using different applications. In this section, we

ﬁrst present the evaluation goals of this study. Next, we introduce our proﬁling tools,

followed by our benchmark.

4.2.1 Evaluation Goals

This study has the following design goals.

First, we aim to identify the common designs of modern DSP systems, and to understand

how those designs (i.e., pipelined processing with message passing, on-demand data

parallelism, and JVM-based implementation) interact with modern processors when

running different types of applications. Second, with the detailed proﬁling study, we

hope to identify some hardware and software approaches to resolving the bottleneck

and point out the directions for the design and implementation of future DSP systems.

4.2.2 Proﬁling Tools

JVM proﬁle. Table 4.1 lists the JVM ﬂags that we use to monitor the performance of

JVM. We are mainly interested in two kinds of activities, including those in just-in-time

(JIT) compilation and GC. We only enable those trace logs when we need to analyze the

corresponding activities. Otherwise, the trace logs are disabled. We use Performance

Inspector [CC] for gathering detailed instruction-tracing information. We measure the

size of the objects created at runtime using the MemoryUtil tool from the Classmexer

library [Cof08].

Processor proﬁle. We systematically categorize where the processor time is spent for

executing Storm and Flink to identify common bottlenecks of their system designs when

running on multi-socket multi-core processors. We use Intel Vtune [Vtu18] for proﬁling

at the processor level.

Similar to the recent study [SP14], we break down the total execution time to the

following components: 1) computation time, which is contributed by the issued µops

that subsequently be executed and retired; 2) branch misprediction stall time (TBr),

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

33

Table 4.1: JVM proﬁle ﬂags

Flags

JIT Logging

Description

Trace just-in-time compilation activities

UnlockDiagnosticVMOptions

Enable processing of ﬂags

relating to ﬁeld diagnostics

TraceClassLoading

Trace all classes loaded

LogCompilation

PrintAssembly

Enable log compilation activity

Print assembly code

GC Logging

Trace garbage collection activities

PrintGCTimeStamps

Print timestamps of garbage collection

PrintGCDetails

Print more details of GC including size of

collected objects, time of objects promotion

which is mainly due to the executed µops that will however never be retired; 3) front-

end stall time (TF e), which is due to the µops that were not issued because of the stalls in

any components in the front-end; 4) back-end stall time (TBe), which is due to the µops

that were available in the IDQ but were not issued because of resources being held-up

in the back-end.

Table 4.2 shows the measurement components for individual stalls. We have conducted

an extensive measurement on stalls from front-end, back-end, and branch misprediction.

All our experiments are carried out on a four-sockets server with the Intel Xeon Sandy

Bridge EP-8 processors. Table 4.3 shows the detailed speciﬁcation of our server and

relevant settings in Storm and Flink.

4.3 Performance Evaluation

In this section, we present the performance evaluation results of different applications on

Storm and Flink on multi-core processors. We tune each application on both Storm and

Flink according to their speciﬁcations such as the number of threads in each operator.

Throughput and resource utilization on a single socket. Figure 4.1a shows the

throughput and Table 4.4 illustrates the CPU and memory bandwidth utilizations of

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

34

Table 4.2: Processor measurement components

Variable

Description

TC

TBr

TF e

Effective computation time

Branch misprediction stall time

Front-end stall time

ITLB stalls

Stall time due to ITLB misses that causes

STLB hit or further cause page walk

L1-I cache stalls

Stall time due to L1 instruction cache misses

ILD stalls

IDQ stalls

Instruction Length Decoder stalls

Instruction Decoder Unit stalls

TBe

Back-end stall time

DTLB stalls

L1-D Stalls

Stall time due to DTLB misses, which causes

STLB hit or further cause page walk

Stall time due to L1 data cache

misses that hit L2-Cache

L2-Cache Stalls

Stall time due to L2-Cache misses that hit in LLC

LLC stalls (local)

Stall time due to LLC misses that hit in

local memory

LLC stalls (remote)

Stall time due to LLC misses that hit in

memory of other socket

Table 4.3: Detailed speciﬁcation on our testing environment

Component

Description

Processor

Intel Xeon E5-4640, Sandy Bridge EP

Cores (per socket)

8 * 2.4GHz (hyper-threading disabled)

Sockets

L1 cache

L2-Cache

4

32KB Instruction, 32KB Data per core

256KB per core

Last level cache

20MB per socket

Memory

4 * 128GB, Quard DDR3 channels, 800 MHz

Apache Flink

version 1.0.2 (checkpoint enabled)

Apache Storm

version 1.0.0 (acknowledge enabled)

Java HotSpot VM

java 1.8.0_77, 64-Bit Server VM, (mixed mode)

-server -XX:+UseG1GC -XX:+UseNUMA

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

35

Table 4.4: CPU and memory bandwidth utilization on a single CPU socket

WC

FD

LG

SD

VS

TM LR

CPU Utilization

62% 39% 61% 28% 75% 98% 71%

Storm

Memory Utilization

20% 16% 10% 7%

19% 60% 31%

CPU Utilization

75% 27% 31% 13% 92% 97% 78%

Flink

Memory Utilization

53% 16% 18% 6%

17% 52% 20%

running different applications on Storm and Flink on a single CPU socket. We measure

the overall resource utilization during stable execution by avoiding the beginning and

ending phases of each application. We have two observations. First, the comparison

between Storm and Flink is inconclusive. Flink has higher throughput than Storm on

WC, FD, and SD, while Storm outperforms Flink on VS and LR. The two systems have

similar throughput on TM and LG. Second, our benchmark covers different runtime

characteristics. Speciﬁcally, VS and TM have high CPU utilization. CPU utilization of

LG and LR is median, and that of WC and SD is low.

It is noteworthy that the major goal of this study is to identify the issues in common

designs of DSP systems on scale-up architectures, rather than to compare the absolute

performance of different DSP systems. We present the normalized performance results

in the rest of this work.

Scalability on varying number of CPU cores. We vary the number of CPU cores from 1

to 8 on the same CPU socket and then vary the number of sockets from 2 to 4 (the number

of CPU cores from 16 to 32). Figures 4.1b and 4.1c show the normalized throughput

of running different applications with varying number of cores/sockets on Storm and

Flink, respectively. The performance results are normalized to their throughputs on a

single core.

We have the following observations. First, on a single socket, most of the applications

scale well with the increasing number of CPU cores for both Storm and Flink. Second,

most applications perform only slightly better or even worse on multiple sockets than

on a single socket. FD and SD become even worse on multiple sockets than on a single

socket, due to their relatively low compute resource demand. Enabling multiple sockets

only brings additional overhead of remote memory accesses. WC, LG and VS perform

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

36

(a) Evaluation of seven applications on a single socket.

(b) Storm with varying number of cores/sockets.

(c) Flink with varying number of cores/sockets.

Figure 4.1: Performance evaluation results on Storm and Flink.

similarly for different numbers of sockets. The throughput of LR increases marginally

with the increasing number of sockets. Third, TM has a signiﬁcantly higher throughput

in both systems on four sockets than on a single socket. This is because TM has high

resource demands on both CPU and memory bandwidth.

4.4 Study the impact of common designs

In the following section, we investigate the underlying reasons for the performance

degradation and how the three design aspects (i.e., pipelined processing with message

passing, on-demand data parallelism, and JVM-based implementation) interact with

multi-socket multi-core processors. Speciﬁcally, we ﬁrst show an execution time

breakdown on running different applications on Storm and Flink on a single socket.

Then, we study the impact of massively parallel execution model, message passing and

stream partitioning and JVM runtime environment.

050100150200250300WCFDLGSDVSTMLRThroughput (k events/s)StormFlink1025.60.200.260%500%1000%1500%2000%2500%1 core2 cores4 cores8 cores16 cores32 coresNormalized throughputWCFDLGSDVSTMLR0%500%1000%1500%2000%2500%1 core2 cores4 cores8 cores16 cores32 coresNormalized throughputWCFDLGSDVSTMLRChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

37

(a) Storm

(b) Flink

Figure 4.2: Execution time breakdown.

4.4.1 Execution time breakdown

Finding (1): During execution of most applications (except TM) on both Storm and

Flink, ∼ 70% of their execution times are spent on processor stalls.

Figure 4.2 shows the execution time breakdown of Storm and Flink running on a

single socket on different processor components as introduced in Section 2.1. We ﬁnd

that 59∼77% and 58∼69% of the overall execution time are spent on stalls (Branch

misprediction stalls, Front-end stalls, Back-end stalls) for all applications running on

Storm and Flink, respectively.

Front-end stalls account for 35∼55% and 25∼56% of the total execution time of Storm

and Flink, respectively. This result is signiﬁcantly different from the batch processing

framework (e.g., [ABVA15]). Back-end stalls account for approximately 13∼40% and

7∼40% of the total execution time of Storm and Flink, respectively. Branch misprediction

stalls are low, ranging from 3 ∼ 4% for all applications.

In the following, we examine the processor stalls in more details with respect to the three

designs of DSP systems (i.e., pipelined processing with message passing, on-demand

data parallelism, and JVM-based implementation).

4.4.2 Massively parallel execution model

Finding (2): The design of supporting both pipelined and data parallel processing

results in a very complex massively parallel execution model in DSP systems. Our

investigation reveals that the high front-end stalls are mainly caused by this execution

model.

0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of different componentsComputationFront-end stallsBack-end stallsBad speculation0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of different componentsComputationFront-end stallsBack-end stallsBad speculationChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

38

(a) Storm

(b) Flink

Figure 4.3: Front-end stall breakdown.

Figure 4.3 illustrates the breakdown of the front-end stalls in running Storm and Flink

on a single socket. Each of the L1 instruction cache (L1-ICache) miss and instruction

decoding (I-Decoding) stalls contributes nearly a half of the front-end stalls.

L1-ICache miss stalls: Our investigation reveals that there are two primary sources

responsible for the high L1-ICache miss. First, due to the lack of a proper thread

scheduling mechanism, the massive threading execution runtime of both Storm and

Flink produces frequent thread context switching. Second, each thread has a large

instruction footprint. By logging JIT compilation activities, we found that the average

size of the native machine code generated per executor thread goes up to 20KB. As

the size of current L1-ICache (32KB per core) is still fairly limited, it cannot hold those

instructions at runtime, which eventually leads to L1-ICache thrashing.

We now study the details of the instruction footprints between two consecutive

invocations of the same function. In order to isolate the impact of user-deﬁned functions,

we test a “null" application, which performs nothing in both Storm and Flink (labeled

as “null"). Figure 4.4 illustrates the cumulative density function (CDF) of instruction

footprints on a log scale, which stands for the percentage that instruction footprint is no

larger than a certain number of distinct instructions.

We add three solid vertical arrows to indicate the size of L1-ICache (32KB), L2-Cache

(256KB), and LLC (20MB). With the detailed analysis on the instruction footprint, we

make three observations. First, two turning points on the CDF curves are observed

at x=1KB and x=10MB for Storm and x=1KB and x=1MB for Flink, which reﬂects the

0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Front-end components stall timeI-Decoding stallsL1-I cache miss stallsITLB stalls0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Front-end components stall timeI-Decoding stallsL1-I cache miss stallsITLB stallsChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

39

(a) Storm

(b) Flink

Figure 4.4: Instruction footprint between two consecutive invocations of the same
function.

common range of their instruction footprints during execution. Second, the cross-over

points of L1-ICache line and different CDF curves are between 0.5 ∼ 0.7 for Storm

and 0.6 ∼ 0.8 for Flink. It means, around 30 ∼ 50% and 20 ∼ 40% of the instruction

footprints between two consecutive calls to the same functions are larger than the L1-

ICache in Storm and Flink, respectively. This causes severe L1-ICache stalls. It also

shows that Flink has a better instruction locality than Storm on L1-ICache. Third, Storm

has similar tracing on instruction footprint with or without running user applications.

This indicates that many of the instruction cache misses may come from Storm platform

itself. This also explains the reason that different applications show similar L1-ICache

miss in Storm. In contrast, the platform of Flink has a smaller instruction footprint.

I-Decoding stalls: The high instruction decoding (I-Decoding) stalls are related to the high

L1-ICache miss issue. The I-Decoding stalls can be further broken down into instruction

length decoder (ILD) stalls and instruction decoding queue (IDQ) stalls.

The ILD stalls further consist of instruction queue (IQ) full stalls and length change

preﬁx (LCP) stalls. IQ is used to store the pre-fetched instructions in a separate buffer

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

40

while the processor is executing the current instruction. Due to the large footprint

between two consecutive invocation of the same function, IQ full stalls are frequent and

contribute nearly 20% of front-end component stall time for all applications on both

Storm and Flink. On the other hand, the LCP stalls are negligible, with less than 0.05%

for all applications according to our measurement.

Another important aspect of I-Decoding stalls is the IDQ stalls, which consist mainly of

decoded instruction cache (D-ICache) stalls. D-ICache enables skipping the fetch and

decode stages if the same µops are referenced later. However, two aspects of D-ICache

may offset its beneﬁts, or even degrade the performance. First, when L1-ICache miss

occurs, the D-ICache also needs to be invalidated, which subsequently causes a switch

penalty (i.e., the back-end has to re-fetch instructions from the legacy decoder pipeline).

Second, if a hot region of code is too large to ﬁt in the D-ICache (up to 1.5k µops), the

front-end incurs a penalty when µop issues switch from the D-ICache to the legacy

decoder pipeline. As we have shown earlier that L1-ICache misses are high during

Storm and Flink execution, this issue propagates to a later stage, which causes frequent

misses in the D-ICache and eventually causes high IDQ stalls.

4.4.3 Message passing and stream partitioning

Finding (3): The design of message passing between operators causes a severe

performance degradation to the DSPSs running on multiple CPU sockets. During

execution, operators may be scheduled into different sockets and experience frequent

costly remote memory accesses during the fetching of input data. Furthermore, the

current design of data parallelism has overlooked the NUMA effect.

Recently, the NUMA-aware allocator has already been implemented in the Java HotSpot

Virtual Machine to take advantage of such infrastructures, which provides automatic

memory placement optimizations for Java applications. We enable this optimization

in our JVM by specifying the useNUMA ﬂag. However, our experiments have already

shown that this ﬂag is insufﬁcient for reducing the NUMA impact and we have observed

poor scalability in both Storm and Flink on multiple sockets. The main problem is

the high remote memory access overhead due to the heavy pipelined message passing

design. During execution, each executor needs to fetch data from the corresponding

producer continuously. On the multi-socket and multi-core architectures, an executor

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

41

Table 4.5: LLC miss stalls when running Storm with four CPU sockets

WC FD

LG

SD

VS

TM LR

LLC Miss (local)

0% 5% 3% 4% 4% 1% 7%

LLC miss (remote)

6% 16% 17% 13% 17% 24% 22%

can have three kinds of data accesses. (1) In cache: the input data is accessed in the cache.

This comes with minimum access penalty. (2) In local memory: access data with a miss

in the cache but a hit in its local memory. This happens when producer and consumer

executors are located in the same CPU socket, and it comes with a cost of local memory

read. (3) In remote memory: access data with a miss in the cache and a further miss

in its local memory. This comes with very high access penalty, and it happens when

producer and consumer executors are located in different CPU sockets.

As a result, the data access cost is depending on the location of the producer and

consumer, which creates signiﬁcant performance divergence among parallel executors of

even the same operator. However, neither Storm nor Flink is aware of such performance

heterogeneity issues and continuously distributes equal amounts (in the case of shufﬂe

grouping) of tuples among executors. Table 4.5 shows the LLC miss stalls for executing

on Storm with four CPU sockets. We have similar observations when running the

applications on Flink with four CPU sockets enabled.

We take TM on Storm as an example to further study the impact of stream partitioning.

We start with the tuned number of threads (i.e., 32) of Map-Matcher operator of TM on

four sockets, and further increase the number of threads up to 56. Figure 4.5a shows a

signiﬁcant increase in the standard derivation of executors’ latencies with the increasing

of the number of executors when running Storm on four CPU sockets. Those executors

experience up to 3 times difference in the average execution latency in the case of 56

Map-Matcher executors, which reafﬁrms our analysis on performance heterogeneity

in NUMA. Further, due to the signiﬁcant overhead caused by remote memory access,

the mean execution latency also increases along with the growing number of executors.

Figure 4.5b shows that the back-end stalls gradually become worse with the increase

in the number of executors. This indicates the remote memory access penalty prevents

DSP systems from scaling well.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

42

(a) Average execution time per event.

(b) Back-end stalls.

Figure 4.5: Varying number of executors of Map-Matcher operator of TM when running
Storm with four CPU sockets.

4.4.4

JVM Runtime Environment

Finding (4): The overhead of JVM runtime contains two major and moderate

components. First, TLB stalls account for 5 ∼ 10% and 3 ∼ 8% on Storm and Flink,

respectively. This is caused by frequent pointer referencing in data accesses and Java

execution. Second, the overhead of GC in running streaming applications (1 ∼ 3%) is

insigniﬁcant.

Both Storm and Flink are implemented using JVM-based programming language. The

efﬁciency of JVM runtime is crucial to the performance of Storm and Flink. As we have

mentioned before, the back-end of the processor is where the actual execution happens.

Figure 4.6 breaks down the back-end stalls into L1-DCache stalls, L2-Cache stalls, LLC

stalls, and DTLB stalls when running Storm and Flink on a single socket.

Data cache stalls: Stalls in L1-DCache and L2-Cache dominate the back-end stalls in both

systems. We measure the size of intermediate results generated during execution of

all streaming applications in our benchmark, and we have the following observations.

First, the private data structures accessed during execution do not often ﬁt into L1-

DCache (32KB) but can ﬁt into L2-Cache (256KB), which causes frequent L1-DCache

stalls. Second, the output data for message passing mostly ﬁt into the LLC, and cannot

ﬁt into L2 cache. As a result, data passing among executors in a single socket usually

get served by the shared LLC (20MB).

TLB stalls: Tuples are passed with reference (instead of the actual data) in both systems.

Upon a class loading in java, the invokevirtual instruction is triggered to search the

024681012141618010203040506070809032404856Standard deviationProcess latency (ms/event)Mean executionlatencyStandard deviation0%10%20%30%40%50%60%70%80%90%100%32404856Percentage of Back end stall  OthersLLC Miss (local)LLC Miss (remote)Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

43

(a) Storm

(b) Flink

Figure 4.6: Back-end stall breakdown.

method table and identify the speciﬁc method implementation, which may cause

random accesses on method tables. As a result, the frequent pointer references lead to

stress on TLB on both systems. Our further investigation found that enabling huge page

improves the performance of both Storm and Flink marginally for all seven applications.

Garbage collection overhead: We use G1GC [DFHP04] as the garbage collector in our JVM.

The garbage collection (GC) is infrequent in running all applications on both Storm

and Flink, and the same observation is made even if we run the benchmark for hours.

Based on GC logs, we ﬁnd that no major GC occurs during the execution and minor GC

contributes only 1 ∼ 3% to the total execution time across all the applications for both

Storm and Flink. As a sanity check, we also study the impact of using an older version

of GC named parallelGC. When the parallelGC mechanism is used, the overhead of GC

increases to around 10 ∼ 15%, which indicates the effectiveness of G1GC. Nevertheless,

we plan to evaluate the impact of GC with more extensive applications.

4.5 Towards more efﬁcient DSP systems

In this section, we present our initial attempt to address the performance issues found in

the previous section. We present two optimization techniques, including non-blocking

tuple batching (to reduce instruction cache stalls) and NUMA-aware executor placement

(to reduce remote memory accesses). We evaluate the effectiveness of the techniques by

ﬁrst studying their individual impacts and then combining both techniques together.

We note that, the two optimization techniques address the efﬁciency issues of the two

0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Back-end components stall timeL1-DCache StallsL2 cache StallsLLC stallsDTLB stalls0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Back-end components stall timeL1-DCache StallsL2 cache StallsLLC stallsDTLB stallsChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

44

common designs (i.e., pipelined processing with message passing and on-demand data

parallelism), and we conjecture that the optimizations can be applied to other DSP

systems with the same designs.

4.5.1 Non-blocking Tuple Batching

Our proﬁling results suggest that the large instruction footprints between two

consecutive invocations of the same function cause severely performance issues

including L1-ICache miss and I-Decoding stalls, which lead to high front-end stalls. One

of the solutions is batching multiple tuples together before passing to the consumer

executor for processing. In this way, each function invocation can process multiple

tuples so that the instruction footprint between two consecutive invocations of the same

function is reduced. Similar ideas of tuple batching are already proposed [SC14] or in use

in some DSP systems [CKE+15]. However, those techniques rely on a buffering stage,

which introduces wait delay in execution. For example, Sax et al. [SC14] proposed to

create an independent batching buffer for each consumer in order to batch all tuples that

will be processed by the same consumer. Tuples are not emitted until the corresponding

buffer becomes full. However, the additional explicit buffering delay in every executor

may introduce serious negative impact on the system latency. In order to preserve low

latency processing feature of DSP system, we develop a simple yet effective non-blocking

tuple batching strategy to address this issue.

The basic idea of our solution is as follows. Consider an executor processes a batch

of tuples and outputs multiple tuples, we try to put its output tuples together as a

batch, or multiple batches each containing tuples belonging to the same key. Once the

corresponding consumer receives such a batch, it can then process multiple tuples from

the batch with a single function invocation and further batching its output tuples in

a similar manner. Our solution requires that the data producer to prepare the initial

batches of tuples, where the size of batch S is a parameter that we will tune in later

experiments. When the Data Producer of an application generates multiple tuples (more

than S) each time, it simply groups them into batches with size up to S and feeds to the

topology. Otherwise, we can let the data producer accumulate S tuples before feeding

to the topology. As Data Producer is usually relatively light-weight compared to other

operators in an application, this kind of batching has little overhead.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

45

It is rather straightforward to implement the non-blocking tuple batching algorithm for

any grouping policy (Section 2.2) except the key-grouping policy (i.e., ﬁelds grouping),

as we can simply group together all the output tuples of an executor. However, if an

executor uses ﬁelds grouping, simply putting output tuples into one batch may cause

errors [SC14] due to wrongly sending output tuples targeting at different consumers

based key in each tuple. Existing batching techniques rely on a buffering stage in order

to resolve such issue [SC14]. In contrast, we develop an algorithm for non-blocking

tuple batching of ﬁelds grouping, as illustrated in Algorithm 4.1.

The basic idea is to store multiple output tuples into a multi-valued hash map (at lines

10-12), and the ﬁelds (i.e., keys) used in choosing consumer are re-computed based on

the ﬁelds originally declared (at lines 10-11). At line 4, the HashMultimap is the multi-

value hash map used to batch multiple values with the same key (implemented based

on org.apache.storm.guava.collect.HashMultimap). At line 10, we use a concatenate function

to combine the original multiple ﬁelds. In this way, we guarantee the correctness by

always generating the same new key from the same original ﬁelds while batching as

many tuples as possible (i.e., it may generate the same new key for tuples with different

original ﬁelds which are can be safely batched together).

We now study the impact of tuple batching optimization by varying S. Figure

4.7 illustrates the normalized throughput of Storm and Flink with tuple batching

optimization for different applications on a single CPU socket. Results are normalized to

the original non-batch setting of Storm and Flink (denoted as non-batch). As expected,

tuple batching can signiﬁcantly reduce instruction cache misses and hence improve the

performance of most applications.

With tuple batching, the processing latency of each tuple may be increased as they

are not emitted until all tuples in the same batch are processed. Figure 4.8 shows the

normalized average latency per tuple under different batch sizes. Comparing Figures 4.7

and 4.8, we observe a clear trade-off between the throughput and latency. Meanwhile,

our non-blocking tuple batching scheme preserves a sublinear increase in process latency

for most applications, which is due to the much-improved performance and no explicit

buffering delay.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

46

Algorithm 4.1: Non-blocking tuple batching for ﬁelds grouping

Data: batch B
Data: to: temporary output tuple
Data: to.attributeList: ﬁelds grouping attributes
Data: n: the number of executors of the consumer
Initialize cache as an empty HashMultimap
Initialize newkey as an empty object
for each tuple ti of B do

// Perform custom function of the operator.

to ← function_process (ti); // Combine the values of fields

grouping attributes of to into temp.

temp ← Combine(to.attributeList); newkey ← (hash value of temp) mod n;
Store the < newkey, to > pair in cache, where the values of the same key are
maintained in a list L
foreach each key Ki of the key sets of cache do

Get the < Ki, L > pair from cache; // Emit multiple tuples of

the same key as a batch.

emit(< Ki, L >);

1

2

3

4

5

6

7

8

4.5.2 NUMA-Aware Executor Placement

In order to reduce the remote memory accesses among sockets, the executors in a

topology should be placed in an NUMA-aware manner. To this end, we develop a

simple yet effective NUMA-aware executor placement approach.

Deﬁnition 3. Executor placement. Given a topology execution graph T and the set of

executors W in T , an executor placement P (T, k) represents a plan of placing W onto k CPU

sockets. k can be any integer smaller than or equal to the total number of sockets in a NUMA

machine.

Deﬁnition 4. We denote the remote memory access penalty per unit as R, and the total size

of tuples transmitted between any two executors w and w(cid:48) (w, w(cid:48) ∈ W ) as T rans(w, w(cid:48)).

Each placement P (T, k) has an associated cross-socket communication cost, denoted by

Cost(P (T, k)) as shown in Equation 4.1. We denote the set of executors placed onto socket x as

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

47

(a) Storm

(b) Flink

Figure 4.7: Normalized throughput of tuple batching optimization.

(a) Storm

(b) Flink

Figure 4.8: Normalized latency of tuple batching optimization.

ξx, where x = 1, . . . , k.

Cost(P (T, k)) =

k−1
(cid:88)

k
(cid:88)

(cid:88)

i=1

j=i+1

w∈ξi,w(cid:48)∈ξj

R ∗ T rans(w, w(cid:48))

(4.1)

Deﬁnition 5. The optimal executor placement, denoted by Popt,

is deﬁned as

Cost(Popt(T, k)) ≤ Cost(P (T, k)), ∀P ∈ Q, where Q is the set of all feasible executor

placement solutions.

Our optimization problem is to ﬁnd Popt(T, k) for a given topology T and a number of

enabled sockets k. In our experiment, we consider k from one to four on the four-socket

server. We now illustrate that this problem can be mapped into the minimum k-cut

problem [GH].

0%50%100%150%200%250%300%350%400%450%500%WCFDLGSDVSTMLRNormalized throughputnon-batchbatch size (S)=2batch size (S)=4batch size (S)=80%50%100%150%200%250%300%350%400%WCFDLGSDVSTMLRNormalized throughputnon-batchbatch size (S)=2batch size (S)=4batch size (S)=80%100%200%300%400%500%600%700%800%WCFDLGSDVSTMLRNormalized latencynon-batchbatch size (S)=2batch size (S)=4batch size (S)=80%100%200%300%400%500%600%700%800%WCFDLGSDVSTMLRNormalized latencynon-batchbatch size (S)=2batch size (S)=4batch size (S)=8Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

48

(a) Storm

(b) Flink

Figure 4.9: NUMA-aware executor placement.

Deﬁnition 6. The minimum k-cut on weighted graph G = (V, E) produces a vertex placement

plan (Copt) such that V is partitioned into k non-empty disjoint sets, and the total weight of

edges across disjoint sets is minimized.

Given a topology execution graph T , we can map it to a directed weighted graph G. A

mapping from T to G is deﬁned as follows: (I) ∀ executor w ∈ W , there is a one-to-one

mapping from w to a vertex in G. (II) For any producer-consumer (< w, w(cid:48) >, w, w(cid:48) ∈ W )

message passing relationships in T , there is a one-to-one mapping to one edge in G. The

communication cost (R ∗ T rans(w, w(cid:48))) is assigned as the edge weight. The cross-socket

communication cost corresponds to the total weight of all edges crossing the disjoint

sets. Thus, optimizing Copt is equivalent to optimizing Popt.

We use the state-of-the-art polynomial algorithm [GH] for solving this problem by ﬁxing

k from one to the number of sockets in the machine. Then, from the results optimized

for different k values, we test and select the plan with the best performance.

Figure 4.9 shows the effectiveness of the NUMA-aware executor placement. Results are

normalized to four sockets without optimization. The placement strategy improves the

throughput of all applications by 7∼32% and 7∼31% for Storm and Flink, respectively.

4.5.3 Put It All Together

Finally, we put both optimizations, namely non-blocking tuple batching (S = 8) and

NUMA-aware executor placement together. Figure 4.10 illustrates the optimization

effectiveness on a single socket and four sockets. Results are normalized to four sockets

0%40%80%120%160%200%240%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (executor grouping)0%40%80%120%160%200%240%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (executor grouping)Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

49

(a) Storm

(b) Flink

Figure 4.10: Normalized throughput with all optimizations enabled.

without optimization. With four sockets, our optimizations can achieve 1.3∼3.2x and

1.2∼3.1x improvement on the performance for Storm and Flink, respectively. Although

our initial attempts have signiﬁcantly improved the performance, there is still a large

room to linear scale-up.

0%100%200%300%400%500%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (w/ both optimizations)0%50%100%150%200%250%300%350%400%450%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (w/ both optimizations)CHAPTER 5

BriskStream: Scaling Data Stream Processing on

Shared-Memory Multicore Architectures

5.1 Introduction

Modern multicore processors have demonstrated superior performance for real-world

applications [AGN+13] with their increasing computing capability and larger memory

capacity. For example, recent scale-up servers can accommodate even hundreds of

CPU cores and multi-terabytes of memory [MF17]. Witnessing the emergence of

modern commodity machines with massively parallel processors, researchers and

practitioners ﬁnd shared-memory multicore architectures an attractive streaming

platform [ZHD+04, MPJ+17]. Optimizing stream processing in a single node is even

mandatory for distributed stream processing – reduce the number of machines required

for the same application requirement. However, fully exploiting the computation

power delivered by multicore architectures can be challenging. Prior studies [ZHD+04]

have shown that existing DSPS underutilize the underlying complex hardware micro-

architecture and especially show poor scalability due to the unmanaged resource

competition and unaware of non-uniform memory access (NUMA) effect.

Many DSPSs, such as Storm [TTS+14], Heron [KBF+15], Flink [CKE+15] and

Seep [CFMKP13], share similar architectures including pipelined processing and operator

replication designs. Speciﬁcally, an application is expressed as a DAG (directed acyclic

graph) where vertexes correspond to continuously running operators, and edges

represent data streams ﬂowing between operators. To sustain high input stream ingress

rate, each operator can be replicated into multiple instances running in parallel. A

streaming execution plan determines the number of replicas of each operator (i.e., operator

51

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

52

replication), as well as the way of allocating each operator to the underlying physical

resources (i.e., operator placement). In this work, we address the question of how to

ﬁnd a streaming execution plan that maximizes processing throughput of DSPSs under

NUMA effect.

NUMA-awareness system optimization has been previously studied in the context of

relational database [GARH14, PSM+16, LBKN14]. However, those works are either 1)

based on cardinality estimation [GARH14], which is unknown in executing queries over

potentially inﬁnite input streams, 2) focused on different optimization goals (e.g., better

load balancing [PSM+16]) or 3) based on different system architectures [LBKN14]. They

provide highly valuable techniques, mechanisms and execution models but none of

them uses the knowledge at hand to solve the problem we address.

The key challenge of optimizing streaming execution plan on multicore architectures is

that there is a varying processing capability and resource demand of each operator due

to varying remote memory access penalty under different execution plans. Witnessing

this problem, we present a novel NUMA-aware streaming execution plan optimization

paradigm, called Relative-Location Aware Scheduling (RLAS). RLAS takes the relative

location (i.e., NUMA distance) of each pair of producer-consumer into consideration

during optimization. In this way, it is able to determine the correlation between a

solution and its objective value, e.g., predict the throughput of each operator for a given

execution plan. This is very different to some related work [VN02, GARH14, Kha09],

which assume a predeﬁned and ﬁxed processing capability (or cost) of each operator.

While RLAS provides a more accurate estimation of the application behavior under

the NUMA effect, the resulting placement optimization problem becomes much harder

to solve. In particular, stochasticity is introduced into the problem as the objective

value (e.g., throughput) or weight (e.g., resource demand) of each operator is variable

and depends on all previous decisions. This makes classical approaches like dynamic

programming not applicable as it is hard to ﬁnd common sub-problem. Additionally,

the placement decisions may conﬂict with each other and ordering is introduced into

the problem. For instance, scheduling of an operator at one iteration may prohibit some

other operators to be scheduled to the same socket later.

We propose a branch and bound based approach to solve the concerned placement

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

53

optimization problem. In order to reduce the size of the solution space, we further

introduce three heuristics. The ﬁrst switches the placement consideration from vertex to

edge, and avoids many placement decisions that have little or no impact on the objective

value. The second reduces the size of the problem in special cases by applying best-ﬁt

policy and also avoids identical sub-problems through redundancy elimination. The

third provides a mechanism to tune the trade-off between optimization granularity and

searching space.

RLAS optimizes both replication and placement at the same time. The key to optimize

replication conﬁguration of a streaming application is to remove bottlenecks in its

streaming pipeline. As each operator’s throughput and resource demand may vary

in different placement plans due to the NUMA effect, removing bottlenecks has to be

done together with placement optimization. To achieve this, RLAS iteratively increases

replication level of bottleneck operator that is identiﬁed during placement optimization.

We implemented RLAS in BriskStream, a new DSPS supporting the same APIs as Storm

and Heron. Our extensive experimental study on two eight-sockets modern multicores

servers show that BriskStream achieves much higher throughput and lower latency

than existing DSPSs.

5.2 Execution Plan Optimization

Streaming application is expressed as a DAG (directed acyclic graph) where vertexes

correspond to continuously running operators, and edges represent data streams ﬂowing

between operators. Figure 5.1(a) illustrates word count (WC) as an example application

containing ﬁve operators as follows. Spout continuously generates new tuple containing

a sentence with ten random words. P arser drops tuple with a null value. In our testing

workload, the selectivity of the parser is one. Splitter processes each tuple by splitting

the sentence into words and emits each word as a new tuple to Counter. Counter

maintains and updates a hashmap with the key as the word and value as the number of

occurrence of the corresponding word. Every time it receives a word from Splitter, it

updates the hashmap and emits a tuple containing the word and its current occurrence.

Sink increments a counter each time it receives tuple from Counter, which we use to

monitor the performance of the application.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

54

(a) Logical view of WC.

(b) One example execution plan of WC. Three CPU
sockets are used.

Figure 5.1: Word Count (WC) as an example application.

There are two important aspects of runtime designs of modern DSPSs [ZHD+04]. First,

the common wisdom of designing the execution runtime of DSPSs is to treat each

operator as a single execution unit (e.g., a Java thread) and runs multiple operators

in a DAG in a pipelining way. Second, for scalability, each operator may be executed

independently in multiple threads. Such design is well known for its advantage of

low processing latency and being adopted by many DSPSs such as Storm [TTS+14],

Flink [CKE+15], Seep [CFMKP13], and Heron [KBF+15]. Figure 5.1(b) illustrates one

example execution plan of WC, where parser, splitter and counter are replicated into 2,

3 and 3 instances, and they are placed in three CPU sockets (represented as coloured

rectangles).

A streaming execution plan concerns how to allocate each operator to underlying

physical resources, as well as the number of replicas that each operator should have.

Operator experiences additional remote memory access (RMA) penalty during input

data fetch when it is allocated in different CPU sockets to its producers. A bad execution

plan may introduce unnecessary RMA communication overhead and/or oversubscribe a

few CPU sockets that induces signiﬁcant resource contention. In this section, we discuss

the performance model that guides optimization process and the formal deﬁnition of

our concerned optimization problem.

5.2.1 The Performance Model

Model guided deployment of query plans has been previously studied in relational

databases on multi-core architectures, for example [GARH14]. Yet, those works are

based on cardinality estimation, which is unknown in streaming workloads. Due to

SpoutParser“a boy and a girl”SplitterCounterSink“a”, “boy”…(“boy”,1), (“a”,2) …SpoutParserSplitterCounterSinkParserSplitterSplitterCounterCounterSocket 0Socket 2Socket 1Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

55

the difference in problem assumptions, we adopt the rate-based optimization (RBO)

approach [VN02], where output rate of each operator is estimated. However, the original

RBO assumes processing capability of an operator is predeﬁned and independent of

different execution plans, which is not suitable under the NUMA effect.

We summarize the main terminologies of our performance model in Table 5.1. We group

them into the following four types, including machine speciﬁcations, operator speciﬁcations,

plan inputs and model outputs. For the sake of simplicity, we refer a replica instance

of an operator simply as an “operator”. Machine speciﬁcations are the information

of the underlying hardware. Operator speciﬁcations are the information speciﬁc to

an operator, which need to be directly proﬁled (e.g., T e) or indirectly estimated with

proﬁled information and model inputs (e.g., T f ). Plan inputs are the speciﬁcation of the

execution plan including both placement and replication plans as well as external input

rate to the source operator. Model outputs are the ﬁnal results form the performance

model that we are interested in. To simplify the presentation, we omit and assume

selectivity is one in the following discussion. In our experiment, the selectivity statistics

of each operator is pre-proﬁled before the optimization applies. In practice, they can be

periodically collected during the application running and the optimization needs to be

re-performed accordingly.

Model overview. In the following, we refer to the output rate of an operator by using

the symbol ro, while ri refers to its input rate. The throughput (R) of the application

is modelled as the summation of ro of all “sink" operators (i.e., operators with no
consumer). That is, R = (cid:80)

sink ro. To estimate R, we hence need to estimate ro of each

“sink” operator. The output rate of an operator is not only related to its input rate but

also the execution plan due to NUMA effect, which is quite different from previous

studies [VN02].

We deﬁne ri of an operator as number of tuples available for it to process. As BriskStream

adopted the pass-by-reference message passing approach (See Section 5.6) to utilize

shared-memory environment, the reference passing delay is negligible. Hence, ri of an

operator is simply ro of the corresponding producer and ri of spout (i.e., source operator)

is given as I (i.e., external input stream ingress rate). Conversely, upon obtaining the

reference, operator then needs to fetch the actual data during its processing, where the

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

56

Table 5.1: Summary of terminologies

actual data fetch delay depends on NUMA distance of it and its producer. Subsequently,

the varying efforts spend in data fetching affects ro in varying execution plans. We

hence estimate ro of an operator as a function of its input rate ri and execution plan p.

Estimating ro. Consider a time interval t, denote the number of tuples to be processed

during t as num and actual time needed to process them as tp. Further, denote T (p) as

the average time spent on handling each tuple for a given execution plan p. Let us ﬁrst

assume input rate to the operator is sufﬁciently large and the operator is always busy

during t (i.e., tp > t), and we discuss the case of tp ≤ t at the end of this paragraph.

Then, the general formula of ro can be expressed in Formula 5.1. Speciﬁcally, num is the

aggregation of input tuples from all producers arrived during t, and tp is the total time

TypeNotationDefinitionsMachine	specific.𝐂Maximum	attainable	unit	CPU	cycles	per	socket𝐁Maximum	attainable	local	DRAM	bandwidth𝐐𝐢,𝐣Maximum	attainable	remote	channel	bandwidth	from	socket	𝑖to	socket	𝑗𝐋𝐢,𝐣Worst	case	memory	access	latency	from	socket	𝑖to	socket	𝑗SCache	line	sizeOperator	specific.𝐌Average	memory	bandwidth	consumption	per	tuple𝑻Average	time	spent	on	handling	each	tuple𝑻𝐟Average	fetching	time	per	tuple𝑻𝒆Average	execution	time	per	tuple𝑵Average	size	per	tuplePlan	inputs𝐩Input	execution	plan𝐈External	input	stream	ingress	rate	to	source	operatorModel	outputs𝐫𝐨Output	rate	of	an	operator𝐫𝐨Expected	output	rate	of	an	operator𝐫𝐨(𝐬)Output	rate	of	an	operator	specifically	to	producer	``s”𝐫𝐢Input	rate	of	an	operator.	𝑟7of	a	non-source	operator	is	𝑟8of	its	producer	and	𝑟7of	source	operator	is	external	input	rate	𝐼𝑹Application	throughputChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

57

spent on processing those input tuples.

ro =

where num =

,

num
tp
(cid:88)

ri ∗ t

tp =

producers
(cid:88)

producers

ri ∗ t ∗ T (p).

(5.1)

We breakdown T (p) into the following two non-overlapping components, T e and T f .

T e stands for time required in actual function execution and emitting outputs tuples per

input tuple. For operators that have a constant workload for each input tuple, we simply

measure its average execution time per tuple with one execution plan to obtain its T e.

Otherwise, we can use machine learning techniques (e.g., linear regression) to train

a prediction model to predict its T e under varying execution plans. Prediction of an

operator with more complex behaviour has been studied in previous works [AcR+12],

and we leave it as future work to enhance our system.

T f stands for time required to fetch (local or remotely) the actual data per input

tuple. It is determined by its fetched tuple size and its relative distance to its producer

(determined by p), which can be represented as follows,



0

T f =

if collocated with producer



(cid:100)N/S(cid:101) ∗ L(i, j) otherwise

, where i and j are determined by p.

(5.2)

When the operator is collocated with its producer, the data fetch cost is already covered

by T e and hence T f is 0. Conversely, it experiences memory access across CPU sockets

per tuple. It is generally difﬁcult to accurately estimate the actual data transfer cost as it

is affected by multiple factors such as memory access patterns and hardware prefetcher

units. We use a simple formula based on prior work from Surendra and et al. [BXGT04]

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

58

Figure 5.2: CDF of proﬁled average execution cycles of different operators of WC.

as illustrated in Formula 5.2. Speciﬁcally, we estimate the cross socket communication

cost based on the total size of data transfer N bytes per input tuple, cache line size S and

the worst case memory access latency (L(i, j)) that operator and its producer allocated

(i (cid:54)= j). Despite its simplicity, applications in our testing benchmark roughly follow

Formula 5.2 as we show in our experiments later.

Finally, let us remove the assumption that input rate to an operator is larger than its

capacity, and denote the expected output rate as ro. There are two cases that we have to

consider:

Case 1: We have essentially made an assumption that the operator is in general over-

supplied, i.e., tp > t.

In this case, input tuples are accumulated and ro = ro.

As tuples from all producers are processed in a cooperative manner with equal

priority, tuples will be processed in a ﬁrst come ﬁrst serve manner 1. Therefore,

ro(s) is proportional to the proportion of the corresponding input (ri(s)), that is,
ro(s) = ro ∗ ri(s)
ri

.

Case 2: In contrast, operator may need less time to ﬁnish processing all tuples arrived

during observation time t, i.e., tp ≤ t.
ro ≥ (cid:80)

producers ri. This effectively means the operator is under-supplied (or
just fulﬁlled), and its output rate is limited by its input rates, i.e., ro = ri, and

In this case, we can derived that

ro(s) = ri(s) ∀ producer s.

1It is possible to conﬁgure different priorities among different operators here, but is out of the scope of

this work.

00.20.40.60.81050010001500Cumulative percent CPU_CYCLES (Te)SinkSpoutParserCounterSplitterChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

59

Given an execution plan, we can then identify operators that are over-supplied by

comparing its input rate and output rate. Those over-supplied operators are essentially

the “bottlenecks” of the corresponding execution plan. Our scaling algorithm tries to

increase the replication level of those operators to remove bottlenecks. After the scaling,

we need to again search for the optimal placement plan of the new DAG. This iterative

optimization process formed our optimization framework, which will be discussed

shortly later in Section 5.3.

Model instantiation. Machine speciﬁcations of the model including C, B, Qi,j, Li,j and

S are given as statistics information of the targeting machine (e.g., measured by Intel

Memory Latency Checker [int18]). Similar to the previous work [CAMM13], we need

to proﬁle the application to determine operator speciﬁcations. To prevent interference,

we sequentially proﬁle each operator. Speciﬁcally, we ﬁrst launch a proﬁling thread of

the operator to proﬁle on one core. Then, we feed sample input tuples (stored in local

memory) to it. Information including T e (execution time per tuple), M (average memory

bandwidth consumption per tuple) and N (size of input tuple) is then gathered during

its execution.

The sample input is prepared by pre-executing all upstream operators. As they are not

running during proﬁling, they will not interfere with the proﬁling thread. To speed up

the instantiation process, multiple operators can be proﬁled at the same time as long

as there is no interference among the proﬁling threads (e.g., launch them on different

CPU sockets). The statistics gathered without interference are used in the model as

our execution plan optimization (RLAS) avoids interference (see Section 5.2.2). Task

oversubscribing has been studied in some earlier work [IHBZ10], but it is not the focus

of this work.

We use the overseer library [Pea11] to measure T e, M , and use classmexer library [Cof08]

to measure N . Figure 5.2 shows the proﬁling results of T e of different operators of WC.

The major takeaway from Figure 5.2 is that operators show stable behaviour in general,

and the statistics can be used as model input. Selecting a lower (resp. higher) percentile

proﬁled results essentially corresponds to a more (resp. less) optimistic performance

estimation. Nevertheless, we use the proﬁled statistics at the 50th percentile as the input

of the model, which successfully guides our system to scale in multi-socket multicores.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

60

5.2.2 Problem Formulation

The goal of our optimization is to maximize the application processing throughput

under given input stream ingress rate, where we search for the optimal replication level

and placement of each operator. Note that, each replica is considered as an operator

to be scheduled. For one CPU socket, denote its available CPU cycles as C cycles/sec,

the maximum attainable local DRAM bandwidth as B bytes/sec, and the maximum

attainable remote channel bandwidth from socket Si to Sj as Qi,j bytes/sec. Further,

denote average tuple size, memory bandwidth consumption and processing time spent

per tuple of an operator as N bytes, M bytes/sec and T cycles, respectively, The problem

can be mathematically formulated as Equation 5.5.

As the formulas show, we consider three categories of resource constraints that the

optimization algorithm needs to make sure the execution plan satisﬁes. Constraint 5.3

enforces that the aggregated demand of CPU resource requested to anyone CPU socket

must be smaller than the available CPU resource. Constraint 5.4 enforces that the

aggregated amount of bandwidth requested to a CPU socket must be smaller than

the maximum attainable local DRAM bandwidth. Constraint 5.5 enforces that the

aggregated data transfer from one socket to another per unit of time must be smaller

than the corresponding maximum attainable remote channel bandwidth. In addition, it

is also constrained that one operator will be and only be allocated exactly once. This

matters because an operator may have multiple producers that are allocated at different

places. In this case, the operator may be collocated with only a subset of its producers.

maximize

(cid:88)

sink

ro

s.t., ∀i, j ∈ 1, .., n,

(cid:88)

ro ∗ T ≤ C,

operators at Si
(cid:88)

operators at Si
(cid:88)

ro ∗ M ≤ B,

(cid:88)

ro(s) ∗ N ≤ Qi,j,

operators at Sj

producers at Si

(5.3)

(5.4)

(5.5)

Assuming each operator (in total |o| excluding replicas) can be replicated at most k

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

61

replicas, we have to consider in total k|o| different replication conﬁgurations. In addition,

for each replication conﬁguration, there are mn different placements, where m is the

number of CPU sockets and n stands for the total number of replicas (n ≥ |o|). Such a

large solution space makes brute-force unpractical.

5.3 Optimization Algorithm Design

We propose a novel optimization paradigm called Relative-Location Aware Scheduling

(RLAS) to optimize replication level and placement (i.e., CPU afﬁnity) of each operator

at the same time guided by our performance modelling. The key to optimize replication

conﬁguration of a stream application is to remove bottlenecks in its streaming pipeline.

As each operator’s throughput and resource demand may vary in different placement

plans, removing bottlenecks has to be done together with placement optimization.

The key idea of our optimization process is to iteratively optimize operator placement

under a given replication level setting and then try to increase replication level of

the bottleneck operator, which are determined during placement optimization. The

bottleneck operator is deﬁned as the operator that has a larger input rate than its

processing capability (see Section 5.2.1 case 1). Figure 5.3 shows an optimization example

of a simple application consisting of two operators. The initial execution plan with no

operator replication is labelled with 0. First, RLAS optimizes its placement (labelled with

1) with placement algorithm, which also identiﬁes bottleneck operators. The operators’

placement to CPU sockets are indicated by the dotted arrows in the Figure. Subsequently,

it tries to increase the replication level of the bottleneck operator, i.e., the hollow circle,

with scaling algorithm (labelled with 2). It continues to optimize its placement given the

new replication level setting (labelled with 3). Finally, the application with an optimized

execution plan (labelled with 4) is submitted to execute.

The details of scaling and placement optimization algorithms are presented in Section 5.4.

In the following, we discuss how the Branch and Bound based technique [MJSS16] is

applied to solve our placement optimization problem assuming operator replication is

given and ﬁxed. We focus on discussing our bounding function and unique heuristics

that improve the searching efﬁciency.

Branch and Bound Overview. B&B systematically enumerates a tree of candidate

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

62

Figure 5.3: RLAS Optimization example.

solutions, based on a bounding function. There are two types of nodes in the tree:

live nodes and solution nodes. In our context, a node represents a placement plan

and the value of a node stands for the estimated throughput under the corresponding

placement. A live node contains the placement plan that violates some constraints and

they can be expanded into other nodes that violate fewer constraints. The value of a live

node is obtained by evaluating the bounding function. A solution node contains a valid

placement plan without violating any constraint. The value of a solution node comes

directly from the performance model. The algorithm may reach multiple solution nodes

as it explores the solution space. The solution node with the best value is the output of

the algorithm.

Algorithm complexity: Naively in each iteration, there are (cid:0)n

(cid:1) ∗ (cid:0)m
1

1

(cid:1) = n ∗ m possible

solutions to branch, i.e., schedule which operator to which socket and an average n depth

as one operator is allocated in each iteration. In other words, it will still need to examine

on average (n ∗ m)n candidate solutions [LC99]. In order to further reduce the complexity

of the problem, heuristics have to be applied.

The bounding function. If the bounding function value of an intermediate node is

worse than the solution node obtained so far, we can safely prune it and all of its

children nodes. This does not affect the optimality of the algorithm because the value of

a live node must be better than all its children node after further exploration. In other

words, the value of a live node is the theoretical upper bound of the subtree of nodes. The

bounded problem that we used in our optimizer originates from the same optimization

problem with relaxed constraints. Speciﬁcally, the bounded value of every live node

is obtained by ﬁxing the placement of valid operators and let remaining operators to be

Recursion terminateApplication DAGPlacement optimized DAGScaling optimized DAGSocket 0(1)(2)Socket 0Socket 1(3)Optimal DAGSocket 0Socket 1(0)(4)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

63

collocated with all of its producers, which may violate resource constraints as discussed

before, but gives the upper bound of the output rate that the current node can achieve.

Consider a simple application with operators A, A’ (replica of A) and B, where A and A’

are producers of B. Assume at one iteration, A and A’ are scheduled to socket 0 and 1,

respectively (i.e., they become valid). We want to calculate the bounding function value

assuming B is the sink operator, which remains to be scheduled. In order to calculate the

bounding function value, we simply let B be collocated with both A and A’ at the same

time, which is certainly invalid. In this way, its output rate is maximized, which is the

bounding value of the live node. The calculating of our bounding function has the same

cost as evaluating the performance model since we only need to mark T f (Formula 5.2)

to be 0 for those operators remaining to be scheduled.

The branching heuristics. We introduce three heuristics that work together to

signiﬁcantly reduce the solution space as follows.

1) Collocation heuristic: The ﬁrst heuristic switches the placement consideration from

vertex to edge, i.e., only consider placement decision of each pair of directly connected

operators. This avoids many placement decisions of a single operator that have little or

no impact on the output rate of other operators. Speciﬁcally, the algorithm considers a

list of collocation decisions involving a pair of directly connected producer and consumer.

During the searching process, collocation decisions are gradually removed from the list

once they become no longer relevant. For instance, it can be safely discarded (i.e., do not

need to consider anymore) if both producer and consumer in the collocation decision

are already allocated.

2) Best-ﬁt & Redundant-elimination heuristic: The second reduces the size of the problem in

special cases by applying best-ﬁt policy and also avoids identical sub-problems through

redundancy elimination. Consider an operator to be scheduled, if all predecessors (i.e.,

upstream operators) of it are already scheduled, then the output rate of it can be safely

determined without affecting any of its predecessors. In this case, we select only the

best way to schedule it to maximize its output rate. Furthermore, in case that there are

multiple sockets that it can achieve maximum output rate, we only consider the socket

with least remaining resource. If there are multiple equal choice, we only branch to one

of them to reduce problem size.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

64

Figure 5.4: Placement optimization at runtime. Light colored rectangle represents a live
node that still violates resource constraints. Dark colored rectangle stands for a solution
node contains a valid plan.

3) Compress graph: The third provides a mechanism to tune the trade-off between

optimization granularity and searching space. Under large replication level setting, the

execution graph becomes very large and the searching space is huge. We compress

the execution graph by grouping multiple (determined by compress ratio) replicas of an

operator into a single large instance that is scheduled together. Essentially, the compress

ratio trade off the optimization granularity and searching space. By setting the ratio to

be one, we have the most ﬁne-grained optimization but it takes more time to solve. In

our experiment, we set the ratio to be 5, which produces a good trade-off.

We use the scheduling of WC as a concrete example to illustrate the algorithm. For

the sake of simplicity, we consider only an intermediate iteration of scheduling of a

subset of WC. Speciﬁcally, two replicas of the parser (denoted as A and A(cid:48)), one replica

of the splitter (denoted as B), and one replica of count (denoted as C) are remaining

unscheduled as shown in the top-left of Figure 5.4.

In this example, we assume the aggregated resource demands of any combinations of

grouping three operators together exceed the resource constraint of a socket, and the

only optimal scheduling plan is shown beside the topology. The bottom-left of Figure 5.4

shows how our algorithm explores the searching space by expanding nodes, where the

label on the edge represents the collocation decision considered in the current iteration.

RootallocationDecisions(A,B)(A’,B)(B,C)A----A’----B-11-C---1(A,B)RootNode	#1Node	#1allocationDecisions(A,B)(A’,B)(B,C)AS0---A’----BS011-C---1Node	#2(B,C)SolutionAS0A’S0BS1CS1A’ABCNode	#3(A’,B)Node	#3allocationDecisions(A,B)(A’,B)(B,C)AS0---A’S1---BS010-C---1pruneNode	#2allocationDecisions(A,B)(A’,B)(B,C)AS0---A’----BS011-CS1--0Node	#4(B,C)Node	#5(A,B)Valid	andoptimal(A’,B)Valid	but	subopt(B,C)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

65

The detailed states of four nodes are illustrated on the right-hand side of the ﬁgure,

where the state of each node is represented by a two-dimensional matrix. The ﬁrst

(horizontal) dimension describes a list of collocation decisions, while the second one the

operators that interests in this decision. A value of ‘-’ means that the respective operator

is not interested in this collocation decision. A value of ‘1’ means that the collocation

decision is made in this node, although it may violate resource constraints. An operator

is interested in the collocation decision involving itself to minimize its remote memory

access penalty. A value of ‘0’ means that the collocation decision is not satisﬁed and the

involved producer and consumer are separately located.

At root node, we consider a list of scheduling decisions involving each pair of producer

and consumer. At Node #1, the collocation decision of A and B is going to be satisﬁed,

and assume they are collocated to S0. Note that, S1 is identical to S0 at this point and

does not need to repeatedly consider. The bounding value of this node is essentially

collocating all operators into the same socket, and it is larger than solution node hence

we need to further explore. At Node #2, we try to collocate A’ and B, which however

cannot be satisﬁed (due to the assumed resource constraint). As its bounding value is

worse than the solution (if obtained), it can be pruned safely. Node #3 will eventually

lead to a valid yet bad placement plan. One of the searching processes that leads to the

solution node is Root→Node #4→Node #5→Solution.

5.4 Algorithm Details

In this section, we ﬁrst present the detailed algorithm implementations including

operator replication optimization (shown in Algorithm 5.1) and operator placement

(shown in Algorithm 5.2). After that, we discuss observations made in applying

algorithms in optimizing our workload and their runtime (Section 5.4.1). We further

elaborate how our optimization paradigm can be extended with other optimization

techniques (Section 5.4.2).

Algorithm 5.1 illustrates our scaling algorithm based on topological sorting. Initially, we

set replication of each operator to be one (Lines 1∼2). The algorithm proceeds with this

and it optimizes its placement with Algorithm 5.2 (Line 6). Then, it stores the current

plan if it ends up with better performance (Lines 7∼8). At Lines 11∼17, we iterate over

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

66

all the sorted list from reversely topologically sorting on the execution graph in parallel

(scaling from sink towards spout). At Line 15, it tries to increase the replication level of

the identiﬁed bottleneck operator (i.e., this is identiﬁed during placement optimization).
The size of increasing step depends on the ratio of over-supply, i.e., (cid:100) ri
ro

(cid:101). It starts new

iteration to search for better execution plan at Line 17. The iteration loop ensures that

we have gone through all the way of scaling the topology bottlenecks. We can set an

upper limit on the total replication level (e.g., set to the total number of CPU cores) to

terminate the procedure earlier. At Lines 9&19, either the algorithm fails to ﬁnd a plan

satisfying resource constraint or hits the scaling upper limit will cause the searching to

terminate.

Algorithm 5.2 illustrates our Branch and Bound based Placement algorithm. Initially, no

solution node has been found so far and we initialize a root node with a plan collocating

all operators (Line 1∼5). At Line 7∼14, the algorithm explores the current node. If it

has better bounding value than the current solution, we update the solution node (Line

10∼11) if it is valid (i.e., all operators are allocated), or we need to further explore it

(Line 13). Otherwise, we prune it at Line 14 (this also effectively prunes all of its children

nodes). The branching function (Line 15∼32) illustrates how the searching process

branches and generates children nodes to explore. For each collocation decision in the

current node (Line 16), we apply the best ﬁt heuristic (Line 17∼23) and one new node

is created. Otherwise, at Line 25∼27, we have to create new nodes for each possible
(cid:1)). At Line 28∼ 31, we update the
way of placing the two operators (i.e., up to (cid:0)m

(cid:1) ∗ (cid:0)2
1

1

number of valid operators and bounding value of each newly created nodes in parallel.

Finally, the newly created children nodes are pushed back to the stack.

5.4.1 Discussion

In this section, we discuss some observations made in applying algorithms in optimizing

our workload and their optimization runtime.

Observations. We have made some counter-intuitive observations in optimizing our

workload. First, placement algorithm (Algorithm 5.2) start with no initial solution (i.e.,

the solution.value is 0 initially at Line 9) by default, and we have tried to use a simple

ﬁrst-ﬁt (FF) placement algorithm to determine an initial solution node to potentially

speed up the searching process. In some cases, it accelerates the searching process

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

67

Algorithm 5.1: Topologically sorted iterative scaling

Data: Execution Plan: p // the current visiting plan
Data: List of operators: sortedLists
Result: Execution Plan: opt // the solution plan
p.parallelism ← set parallelism of all operators to be 1
p.graph ← creates execution graph according to p.parallelism
opt.R ← 0
return Searching(p);
Function Searching(p):

p.placement ← placement optimization of p.graph
if p.R > opt.R then

opt ← p // update the solution plan

if failed to ﬁnd valid placement satisfying resource constraint then

return opt

sortedLists ← reverse TopologicalSort (p.graph)// scale start from sink
foreach list ∈ sortedLists do

foreach Operator o ∈ list do
if o is bottleneck then

p.parallelism ← try to increase the replication of o by (cid:100) ri
ro
if suceessfully increased p.parallelism then

(cid:101)

return Searching(p) // start another iteration

else

return opt

return opt

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

19

20

by earlier pruning and makes the algorithm converges faster, but in other cases, the

overhead of running the FF algorithm offsets the gains. Second, the placement algorithm

may fail to ﬁnd any valid plan as not able to allocate one or more operators due to

resource constraints, which causes scaling algorithm to terminate. It is interesting

to note that this may not indicates the saturation of the underlying resources but the

operator itself is too coarse-grained. The scaling algorithm can, instead of terminate

(at Algorithm 5.1 Line 10), try to further increase the replication level of operator that

“failed-to-allocate”. After that, workloads are essentially further partitioned among more

replicas and the placement algorithm may be able to ﬁnd a valid plan. This procedure,

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

68

Algorithm 5.2: B&B based placement optimization

Data: Stack stack // stors all live nodes
Data: Node solution // stores the best plan found so far
Data: Node e// the current visiting node
Result: Placement plan of solution node
// Initilization

solution.R ← 0 // No solution yet

1

2

3

4

5

e.decisions ← a list contains all possible collocation decisions
e.plan ← all operators are collocated into the same CPU socket
e.R ← BoundingFunction(e.plan)
e.validOperators ← 0
Push(stack,e)

6
7 while ¬IsEmpty(stack)// Branch and Bound process

8

9

10

11

12

13

14

15

do

e ← Pop(stack)
if e.R > solution.R then

if e.validOperators == totalOperators then

solution ← e

else

Branching(e)

else

// the current node has worse bounded value than

solution, and can be safely pruned.

however, introduces more complexity to the algorithm.

Optimization runtime. The concerned placement optimization problem is difﬁcult to

solve as the solution space increase rapidly with large replication conﬁguration. Besides

the three proposed heuristics, we also apply a list of optimization tricks to further

increase the searching efﬁciency including 1) memorization in evaluating performance

model under a given execution plan (e.g., an operator should behave the same if its

relative placement with all of its producers are the same in different plans), 2) instead of

starting from scaling with replication set to one for all operators, we can start from a

reasonable large DAG conﬁguration to reduce the number of scaling iteration and 3)

the algorithm is highly optimized for higher concurrency (e.g., concurrently generate

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

69

Algorithm 5.3: Branching function

1

2

3

4

5

6

7

8

9

10

11

12

13

14

15

16

17

18

Function Branching(e):
Data: Node[] children
foreach pair of Os and Oc in e.decisions do

if all predecessors of them are already allocated except Os to Oc then

#newAllocate ← 2
if they can be collocated into one socket then

create a Node n with a plan collocating them to one socket

else

create a Node n with a plan separately allocating them to two sockets

add n to children

else

#newAllocate ← 1
foreach valid way of placing Os and Oc do

create a new Node and add it to children;

foreach Node c ∈ children// update in parallel

do

c.validOperators ← e.validOperators + #newAllocate
c.R ← BoundingFunction(c.plan)

PushAll(stack, children)

branching children nodes). Overall, the placement algorithm needs less than 5 seconds

to optimize placement for a large DAG, and overall scaling takes less than 30 seconds,

which is acceptable, given the size of the problem and the fact that the generated plan can

be used for the whole lifetime of the application. As the streaming application potentially

runs forever, the overhead of generating a plan is not included in our measurement.

5.4.2 Extension with other optimization techniques

A number of optimization techniques are available in the literature [HSS+03]. Many

of them can be potentially applied to further improve the performance of BriskStream.

Our performance model is general enough such that it can be extended to capture other

optimization techniques.

Taking operator fusion as an example, operator fusion trades communication cost

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

70

against pipeline parallelism and is in particular helpful if operators share little in

common computing resource. In our context, let T e

f used and T f

f used to denote the average

execution time and fetch time per tuple of the fused operator, respectively. Then, T e
can be estimated as a summation of T e of all fused operators. T f
the T f of the upstream operator (Oup) to be fused. That is,

f used can be estimated as

f used

T e
f used =

(cid:88)

T e

all fused operators

T f
f used = T f

up

(5.6)

The similar idea has been explored in recent work [GARH14]. In this work, we focus

on operator scheduling and replication optimization, and we leave the evaluation of

extension to other optimization techniques as future work.

5.5 BriskStream System

Applying RLAS to existing DSPSs (e.g., Storm, Flink, Heron) is insufﬁcient to make them

scale on shared-memory multicore architectures. As they are not designed for multicore

environment [ZHD+04] , much of the overhead come from the system design itself. For

example, T e may be signiﬁcantly larger than T f , and NUMA effect has a minor impact

in the plan optimization. This is further validated in our experiments later.

We integrate RLAS optimization framework into BriskStream2, a new DSPS

implemented from the ground up supporting the same APIs as Storm and Heron. Its

architecture shares many similarities to existing DSPSs including pipelined processing

and operator replication designs. To avoid reinventing the wheel, we reuse many

components found in existing DSPSs such as Storm, Heron and Flink, notably including

API design, application topology compiler, pipelined execution engine with communication

queue and back-pressure mechanism. Implementation details of BriskStream are given in

Section 5.6. According to Equation 5.1, both T e and T f shall be reduced in order to

2The source code of BriskStream is publicly available at https://github.com/Xtra-Computing/

briskstream

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

71

improve output rate of an operator and subsequently improve application throughput.

In the following, we discuss two design aspects of BriskStream that are speciﬁcally

optimized for shared-memory architectures that reduce T e and T f signiﬁcantly. We also

discuss the extension of BriskStream with elasticity in Section 5.5.3.

5.5.1

Improving Execution Efﬁciency

As shown in the previous work [ZHD+04],

instruction footprint between two

consecutive invocations of the same function in existing DSPSs is large and resulting in

signiﬁcant instruction cache misses stalls. We avoid many unnecessary components to

reduce the instruction footprint, notably including (de)serialization, cross-process and

network-related communication mechanism, and condition checking (e.g., exception

handling). Note that, those components may not actually be executed in existing

DSPSs running in shared-memory environment. For example, during execution,

Storm/Flink checks whether the targeting consumer is in the same or different processes

(e.g., in another machine). It applies different transmission approaches accordingly,

and (de)serialization is not actually involved. Nevertheless, those unnecessary

components bring many conditional branch instructions, which are completely avoided

in BriskStream. Furthermore, we carefully revise the critical execution path to not create

unnecessary/duplicate temporary objects. For example, as an output tuple is exclusively

accessible by its targeted consumer and all operators share the same memory address,

we do not need to create a new instance of the tuple when the consumer obtains it.

5.5.2

Improving Communication Efﬁciency

Most modern DSPSs [TTS+14, CKE+15, ZHD+04] employ buffering strategy to

accumulate multiple tuples before sending to improve the application throughput.

BriskStream follows the similar idea of buffering output tuples, but accumulated tuples

are combined into one “jumbo tuple” (see the example in Section 5.6). This approach

has several beneﬁts for scalability. First, since we know tuples in the same jumbo tuple

are targeting at the same consumer from the same producer in the same process, we can

eliminate duplicate tuple header (e.g., metadata, context information) hence reduces

communication costs. In addition, the insertion of a jumbo tuple (containing multiple

output tuple) requires only one-time access to the communication queue and effectively

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

72

amortizing the insertion overhead. As a result, both T e and T f are signiﬁcantly reduced.

5.5.3 Discussion on Elasticity

To examine the maximum system capacity, we assume input stream ingestion rate (I)

is sufﬁciently large and keeps the system busy. Further, we assume input streams are

unbounded without delay, miss, or out-of-order issues – the handling of such is by

itself another important line of research. Hence, the model instantiation and subsequent

execution plan optimization are conducted at the same over-supplied conﬁguration.

In practical scenarios, stream rate as well as its characteristics can vary over time.

Application needs to be re-optimized in response to workload changes [CNL16,

GSHW14, GSHW14]. In our context, the model instantiation may not have to be re-

performed as operator speciﬁcation, such as average time spent on handling each tuple,

does not vary if only input rates change. It needs to be re-performed, however, if

characteristics, such as tuple size, change in the input data stream. In both cases, the

execution plan needs to be re-optimized. As a result, both operator replication and

placement may vary over time – system elasticity is needed.

Elasticity of BriskStream can be easily achieved for stateless operators. Speciﬁcally, to

achieve operator re-replication and re-placement, we only need to consolidate or re-

spawn operator replicas to targeting CPU sockets. Conversely, state migration is needed

for stateful operators, which requires state movement and synchronization [GSHW14].

Both can bring considerable overhead to the system. As a result, execution plan

optimization needs to incorporate 1) the overhead of state migration, and 2) runtime of

re-optimization including potential model re-instantiation into consideration. As it may

be harmful if the overhead outweigh the gain in deploying a new execution plan, adding

elasticity to BriskStream is, by itself, a nontrivial question. Previous study [HJHF14]

introduces a model to estimate the movement cost in terms of end-to-end latency.

Similar techniques may be applied, which we leave as future work to further enhance

our system.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

73

5.6 Implementation details

BriskStream avoids designs that are not suitable for shared-memory multicore

architectures. For example, Heron has an operator-per-process execution environment,

where each operator in an application is launched as a dedicated JVM process. In

contrast, an application in BriskStream is launched in a JVM process, and operators

are launched as Java threads inside the same JVM process, which avoids cross-

process communication and allows the pass-by-reference message passing mechanism

(discussed in the end of this section).

Figure 5.5 presents an example job overview of BriskStream. Each operator (or the

replica) of the application is mapped to one task. The task is the fundamental processing

unit (i.e., executed by a Java thread), which consists of an executor and a partition

controller. The core logic for each executor is provided by the corresponding operator

of the application. Executor operates by taking a tuple from the output queues of its

producers and invokes the core logic on the obtained input tuple. After the function

execution ﬁnishes, it dispatches zero or more tuples by sending them to its partition

controller. The partition controller decides in which output queue a tuple should be

enqueued according to application speciﬁed partition strategies such as shufﬂe partition.

Furthermore, each task maintains output buffers for each of its consumers. Speciﬁcally,

the output tuple is ﬁrst enqueued into a local buffer (buffering into jumbo tuple), which

will then be emitted only when it is ﬁlled up to the threshold size.

BriskStream adopted the pass-by-reference message passing approach to avoid

duplicating data in a shared-memory environment [ZHD+04]. Speciﬁcally, tuples

produced by operator are stored locally, and pointers as reference to tuple are inserted

into a communication queue. Together with the aforementioned junbo tuple design,

reference passing delay is minimized and becomes negligible.

5.7 Evaluation

Our experiments are conducted in following aspects. First, our proposed performance

model accurately predict the application throughput under different execution plans

(Section 5.7.2). Second, BriskStream signiﬁcantly outperforms three existing open-

sourced DSPSs on multicores (Section 5.7.3). Third, our RLAS optimization approach

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

74

Figure 5.5: Example job overview in BriskStream.

performs signiﬁcantly better than competing techniques (Section 5.7.4). We also show in

Section 5.7.5 the relative importance of several of BriskStream’s optimization techniques.

5.7.1 Experimental Setup

We pick four common applications from the previous study [ZHD+04] with different

characteristics to evaluate BriskStream. These tasks are word-count (WC), fraud-

detection (FD), spike-detection (SD), and linear-road (LR) with different topology

complexity and varying compute and memory bandwidth demand.

Operator selectivity. As mentioned in Section 5.2.1, we omit and assume selectivity to be

one in our presentation of cost model. The selectivity is affected by both input workloads

and application logic. Parser and Sink have a selectivity of one in all applications. Splitter

has a output selectivity of ten in WC. That is, each input sentence contains 10 words.

Count has a output selectivity of one, thus it emits the counting results of each input

word to Sink. Operators have an output selectivity of one in both FD and SD. That

is, we conﬁgure that a signal is passed to Sink in both predictor operator of FD and

Spike detection operator of SD regardless of whether detection is triggered for an input

tuple. Operators may contain multiple output streams in LR. If an operator has only

Output	queuesPartition	strategyBufferingPartition	ControllerExecutor(parser)FetchDataSourceParserParser	(replica)Operator	as	a	taskCommunication	between	tasks……Be	fetchedJumbo	tuple	with	common	headerA	tuple	with	header……Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

75

Table 5.2: Operator selectivity of LR

one output stream, we denote its stream as default stream. We show the selectivity of

each output stream of them of LR in Table 5.2.

To examine the maximum system capacity under given hardware resources, we tune the

input stream ingress rate (I) to its maximum attainable value (Imax) to keep the system

busy and report the stable system performance 3. To minimize interference of operators,

we use OpenHFT Thread Afﬁnity Library [pl18] with core isolation (i.e., conﬁgure

isolcpus to avoid the isolated cores being used by Linux kernel general scheduler) to

bind operators to cores based on the given execution plan.

Table 5.3 shows the detailed speciﬁcation of our two eight-socket servers. NUMA

characteristics, such as local and inter-socket idle latencies and peak memory

bandwidths, are measured with Intel Memory Latency Checker [int18]. These two

machines have different NUMA topologies, which lead to different access latencies

and throughputs across CPU sockets. The three major takeaways from Table 5.3 are

as follows. First, due to NUMA, both Servers have signiﬁcantly high remote memory

3Back-pressure mechanism will eventually slow down spout so that the system is stably running at its

best achievable throughput.

OperatorNameInput streamsOutput streamsSelectivityDispatcherdefaultposition report≈0.99balance_stream≈0.0daliy_exp_request≈0.0Avg_speedposition reportavg_stream1.0Las_avg_speedavg_streamlas_stream1.0Accident_detectposition reportdetect_stream0.0Count_vehicleposition reportcounts_stream1.0Accident_notifydetect_stream,position reportnotify_stream0.0Toll_notifydetect_streamtoll_nofity_stream0.0position reporttoll_nofity_stream1.0counts_streamtoll_nofity_stream1.0las_streamtoll_nofity_stream1.0Daily_expendaliy_exp_requestdefault0.0Account_balancebalance_streamdefault0.0Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

76

Table 5.3: Characteristics of the two servers we use

access latency, which is up to 10 times higher than local cache access. Second, different

interconnect and NUMA topologies lead to quite different bandwidth characteristics on

these two servers. In particular, remote memory access bandwidth is similar regardless

of the NUMA distance in Server B. In contrast, it is signiﬁcantly lower across long

NUMA distance than smaller distance on Server A. Third, there is a signiﬁcant increase

in remote memory access latency from within the same CPU tray (e.g., 1 hop latency) to

between different CPU tray (max hops latency) on both servers.

We use Server A in Section 5.7.2, 5.7.3 and 5.7.5. We study our RLAS optimization

algorithms in detail on different NUMA architectures with both two servers in

Section 5.7.4.

In addition to runtime statistics evaluation, we also report how much time each tuple

spends in different components of the system. We classify these work as follows: 1)

Execute refers to the average time spent in core function execution. Besides the actual

user function execution, it also includes various processor stalls such as instruction

cache miss stalls. 2) RMA refers to the time spend due to remote memory access. This is

only involved when the operator is scheduled to different sockets to its producers, and

it varies depending on the relative location between operators. 3) Others consist of all

other time spent in the critical execution path and considered as overhead. Examples

HUAWEI	KunLunServers(Server	A)HPProLiant	DL980	G7	(Server	B)Processor	(HT	disabled)8x18	Intel	Xeon	E7-8890	at	1.2	GHz	8x8	Intel	Xeon	E7-2860at	2.27	GHz	Power	governorspowersaveperformanceMemory	per	socket1TB256	GBLocal	Latency	(LLC)50	ns50	ns1	hop	latency307.7	ns185.2	nsMax	hops	latency548.0	ns349.6	nsLocal	B/W54.3	GB/s24.2	GB/s1	hop	B/W13.2	GB/s10.6GB/sMax	hops	B/W5.8	GB/s10.8	GB/sTotal	local	B/W434.4	GB/s193.6	GB/sStatisticMachineChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

77

include temporary object creation, exception condition checking, communication queue

accessing and context switching overhead.

To measure Execute and Others, we allocate the operator to be collocated with its producer.

The time spend in user function per tuple is then measured as Execute. We measure

the gap between the subsequent call of the function as round-trip delay. Others is then

derived as the subtraction from round-trip delay by Execute that represents additional

overhead. Note that, the measurement only consists of contiguous successful execution

and exclude the time spend in queue blocking (e.g., the queue is empty or full). To

measure RMA cost, we allocate the operator remotely to its producer and measures the

new round-trip delay under such conﬁguration. The RMA cost is then derived as the

subtraction from the new round-trip delay by the original round-trip delay.

5.7.2 Performance Model Evaluation

In this section, we evaluate the accuracy of our performance model. We ﬁrst evaluate

the estimation of the cost of remote memory access. We take Split and Count operators

of WC as an example. Table 5.4 compares the measured and estimated process time per

tuple (T ) of each operator. Our estimation generally captures the correlations between

remote memory access penalty and NUMA distance. The estimation is larger than

measurement, especially for Splitter. When the input tuple size is large (in case of

Splitter), the memory accesses have better locality and the hardware prefetcher helps in

reducing communication cost [LKV12]. Another observation is that there is a signiﬁcant

increase of RMA cost from between sockets from the same CPU tray (e.g., S0 to S1) to

between sockets from different CPU tray (e.g., S0 to S4). Such non-linear increasing of

RMA cost has a major impact on the system scalability as we need to pay signiﬁcantly

more communication overhead for using more than 4 sockets.

To validate the overall effectiveness of our performance model, we show the relative

error associated with estimating the application throughput by our analytical model.
The relative error is deﬁned as relative_error = |Rmeas−Rest|

, where Rmeas is the

Rmeas

measured application throughput and Rest is the estimated application throughput

by our performance model for the same application.

The model accuracy evaluation of all applications under the optimal execution plan

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

78

Table 5.4: Average processing time per tuple (T ) under varying NUMA distance. The
unit is nanoseconds/tuple

Splitter

Counter

From-to

Measured Estimated From-to

Measured Estimated

S0-S0(local)

1612.8

1612.8

S0-S0(local)

612.3

S0-S1

S0-S3

S0-S4

S0-S7

1666.53

1991.14

1708.2

1994.85

2050.63

2923.65

2371.31

3196.35

S0-S1

S0-S3

S0-S4

S0-S7

611.4

623.07

889.92

870.23

612.3

665.23

665.92

837.92

888.42

Table 5.5: Model accuracy evaluation of all applications. The performance unit is K
events/sec

WC

FD

SD

LR

Measured

96390.8

7172.5

12767.6

8738.3

Estimated

104843.3

8193.9

12530.2

9298.7

Relative error

0.08

0.14

0.02

0.06

on eight CPU sockets is shown in Table 5.5. Overall, our estimation approximates the

measurement well for the performance of all four applications. It is able to produce the

optimal execution plan and predict the relative performance with the differences less

than 2%.

5.7.3 Evaluation of Execution Efﬁciency

This section shows that BriskStream signiﬁcantly outperforms existing DSPSs on shared-

memory multicores. We compare BriskStream with two open-sourced DSPSs including

Apache Storm (version 1.1.1) and Flink (version 1.3.2). For a better performance, we

disable the fault-tolerance mechanism in all comparing systems. We use Flink with

NUMA-aware conﬁguration (i.e., one task manager per CPU socket), and as a sanity

check, we have also tested Flink with single task manager, which shows even worse

performance. We also compare BriskStream with StreamBox, a recent single-node DSPS

at the end of this section.

Throughput and Latency comparison. Figure 5.6 shows the signiﬁcant throughput

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

79

Figure 5.6: Throughput speedup.

speedup of BriskStream compared to Storm and Flink. Overall, Storm and Flink

show comparable performance for three applications including WC, FD and SD. Flink

performs poorly for LR compared to Storm. A potential reason is that Flink requires

additional stream merger operator (implemented as the co-ﬂat map) that merges

multiple input stream before feeding to an operator with multi-input streams (commonly

found in LR). Neither Storm nor BriskStream has such additional overhead.

Following the previous work [DZSS14], we deﬁne the end-to-end latency of a streaming

workload as the duration between the time when an input event enters the system

and the time when the results corresponding to that event is generated. This is one

of the key metrics in DSPS that signiﬁcantly differentiate itself to traditional batch

based system such as MapReduce. We compare the end-to-end process latency among

different DSPSs on Server A. Figure 5.7 shows the detailed CDF of end-to-end processing

latency of WC comparing different DSPSs and Table 5.6 shows the overall 99-percentile

end-to-end processing latency comparison of different applications. The end-to-end

latency of BriskStream is signiﬁcantly smaller than both Flink and Storm. Despite

that our optimization focuses on maximizing system throughput, the much-improved

throughput reduces queueing delay [DZSS14] and consequently reduces latency.

Evaluation of scalability on varying CPU sockets. Our next experiment shows that

BriskStream scales effectively as we increase the numbers of sockets. RLAS re-optimizes

0510152025WCFDSDLRSpeedUpBriskStream/StormBriskStream/Flink20.24.63.218.711.28.42.812.8Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

80

Table 5.6: 99-percentile end-to-
end latency (ms)

Brisk

Stream

Storm Flink

WC 21.9

37881.3

5689.2

FD 12.5

14949.8

261.3

SD 13.5

12733.8

350.5

LR

204.8

16747.8

4886.2

Figure 5.7: End-to-end latency of WC on different
DSPSs.

the execution plan under a different number of sockets enabled. Figure 5.8a shows

the better scalability of BriskStream than existing DSPSs on multi-socket servers by

taking LR as an example. Both unmanaged thread interference and unnecessary

remote memory access penalty prevent existing DSPSs from scaling well on the modern

multi-sockets machine. We show the scalability evaluation of different applications of

BriskStream in Figure 5.8b. There is an almost linear scale up from 1 to 4 sockets for

all applications. However, the scalability becomes poor when more than 4 sockets are

used. This is because of a signiﬁcant increase of RMA penalty between upper and lower

CPU tray. In particular, RMA latency is about two times higher between sockets from

different tray than the other case.

To better understand the effect of RMA overhead during scaling, we compare the

theoretical bounded performance without RMA (denoted as “W/o rma“) and ideal

performance if the application is linearly scaled up to eight sockets (denoted as “Ideal”)

in Figure 5.9. The bounded performance is obtained by evaluating the same execution

plan on eight CPU sockets by substituting RMA cost to be zero. There are two major

insights taking from Figure 5.9. First, theoretically removing RMA cost (i.e., “W/o rma“)

achieves 89 ∼ 95% of the ideal performance, and it hence conﬁrms that the signiﬁcant

increase of RMA cost is the main reason that BriskStream is not able to scale linearly

on 8 sockets. Furthermore, we still need to re-optimize the execution plan to achieve

00.20.40.60.810.1101000100000Cumulative percentEnd-to-end process latency (ms)BriskFlinkStormChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

81

(a) Systems

(b) Applications

Figure 5.8: Scalability evaluation.

Figure 5.9: Gaps to ideal.

Figure 5.10: Execution time breakdown.

optimal performance in the presence of changing RMA cost (e.g., in this extreme case, it

is reduced to zero).

Per-tuple execution time breakdown. To better understand the source of performance

improvement, we show the per-tuple execution time breakdown by comparing

BriskStream and Storm. Figure 5.10 shows the breakdown of all non-source operators

of WC, which we use as the example application in this study for its simplicity. We

perform analysis in two groups: local stands for allocating all operators to the same

socket, and remote stands for allocating each operator max-hop away from its producer

to examine the cost of RMA.

In the local group, we compare execution efﬁciency between BriskStream and Storm.

0250050007500100000510Throughput (k event /s)Number of CPU socketsBriskStreamStormFlink0%100%200%300%400%500%600%WCFDSDLRNormalized Throughput1 socket2 sockets4 sockets8 sockets020000400006000080000100000120000WCFDSDLRThroughput (k events /s)MeasuredIdealW/o rma020004000600080001000012000Processing time per tuple (ns)RMAOthersExecuteStorm (local)Brisk (remote)Brisk (local)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

82

The “others” overhead of each operator is commonly reduced to about 10% of that of

Storm. The function execution time is also signiﬁcantly reduced to only 5 ∼ 24% of that

of Storm. There are two main reasons for this improvement. First, the instruction cache

locality is signiﬁcantly improved due to much smaller code footprint. In particular, our

further proﬁling results reveal that BriskStream is no longer front-end stalls dominated

(less than 10%), while Storm and Flink are (more than 40%). Second, our “jumbo

tuple” design eliminates duplicate metadata creation and successfully amortizing the

communication queue access overhead.

In the remote group, we compare the execution of the same operator in BriskStream with

or without remote memory access overhead. In comparison with the locally allocated

case, the total round trip time of an operator is up to 9.4 times higher when it is remotely

allocated to its producer. In particular, Parser has little in computation but has to

pay a lot for remote memory access overhead (T e << T f ). The signiﬁcant varying of

processing capability of the same operator when it is under different placement plan

reafﬁrms the necessity of our RLAS optimization.

Another takeaway is that Execute in Storm is much larger than RMA, which means

T e >> T f and NUMA effect may have a minor impact in its plan optimizing. In

contrast, BriskStream signiﬁcantly reduces T e (discussed in Section 5.5) and the NUMA

effect, as a result of improving efﬁciency of other components, becomes a critical issue to

optimize. In the future, on one hand, T e may be further reduced with more optimization

techniques deployed. On the other hand, servers may scale to even more CPU sockets

(with potentially larger max-hop remote memory access penalty). We expect that those

two trends make the NUMA effect continues to play an important role in optimizing

streaming computation on shared-memory multicores.

Comparing with single-node DSPS. Streambox [MPJ+17] is a recently proposed DSPS

based on a morsel-driven like execution model – a different processing model of

BriskStream. We compare BriskStream with StreamBox [MPJ+17] using WC application.

Results in Figure 5.11 demonstrate that BriskStream outperforms StreamBox signiﬁcantly

regardless of number of CPU cores used in the system. Note that, StreamBox focuses

on solving out-of-order processing problem, which requires more expensive processing

mechanisms such as locks and container design. Due to a different system design

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

83

Figure 5.11: Comparing with StreamBox.

objective, BriskStream currently does not provide ordered processing guarantee and

consequently does not bear such overhead.

For a better comparison, we modify StreamBox to disable its order-guaranteeing feature,

denoted as StreamBox (out-of-order), so that tuples are processed out-of-order in both

systems. Despite its efﬁciency at smaller core counts, it scales poorly when multi-sockets

are used. There are two main reasons. First, StreamBox relies on a centralized task

scheduling/distribution mechanism with locking primitives, which brings signiﬁcant

overhead under large core counts. Second, WC needs the same word being counted by

the same counter, which requires a data shufﬂing operation in StreamBox. Such data

shufﬂing operation introduces signiﬁcant remote memory access under large core counts,

which is sub-optimized for NUMA overhead in its current stage. We compare their

NUMA overhead during execution using Intel Vtune Ampliﬁer [Vtu18]. We observe

that, under 8 sockets (144 cores), BriskStream issues in average 0.09 cache misses served

remotely per k events (misses/k events), which is only 1.5% of StreamBox’s 6 misses/k

events.

0100002000030000400005000060000700008000090000248163272144Throughput (k events/s)BriskStreamStreamBoxStreamBox (out-of-order)on 1 socket(soc.)2soc.4soc.8soc.471.2Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

84

5.7.4 Evaluation of RLAS algorithms

In this section, we study the effectiveness of RLAS optimization and compare it with

competing techniques.

The necessity of considering varying processing capability.

To gain a better

understanding of the importance of relative-location awareness, we consider an

alternative algorithm that utilizes the same searching process of RLAS but assumes

each operator has a ﬁxed processing capability. Such approach essentially falls back

to the original RBO model, and is also similar to some previous works in a high level

point of view [GARH14, Kha09]. In our context, we need to ﬁx T f of each operator to

a constant value. We consider two extreme cases. First, the lower bound case, namely

RLAS_f ix(L), assumes each operator pessimistically always includes remote access

overhead. That is, T f is calculated by anti-collocating an operator to all of its producers.

Second, the upper bound case, namely RLAS_f ix(U ), completely ignores RMA, and

T f is set to 0 regardless the relative location of an operator to its producers.

The comparison results are shown in Figure 5.12. RLAS shows a 19% ∼ 39%

improvement over RLAS_f ix(L). We observe that RLAS_f ix(L) often results in

smaller replication conﬁguration of the same application compared to RLAS and hence

underutilize the underlying resources. This is because it over-estimates the resource

demand of operators that are collocated with producers. Conversely, RLAS_f ix(U )

under-estimates the resource demands of operators that are anti-collocated and misleads

optimization process to involve severely thread interference. Over the four workloads,

RLAS shows a 119% ∼ 455% improvement over RLAS_f ix(U ). Potentially, RLAS_f ix

may perform well if it applies a suitable T f of each operator, but it requires tedious

tuning process.

In contrast, RLAS automatically determines the optimal operator

parallelism and placement addressing the NUMA effect.

Comparing different placement strategies. We now study the effect of different

placements under the same replication conﬁguration. In this experiment, the replication

conﬁguration is ﬁxed to be the same as the optimized plan generated by RLAS and

only the placement is varied under different techniques. Three alternative placement

strategies are shown in Table 5.7. Both FF and RR are enforced to guarantee resource

constraints as much as possible. In case they cannot ﬁnd any plan satisfying resource

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

85

Figure 5.12: RLAS w/ and w/o considering varying RMA cost.

Table 5.7: Placement strategies

constraints, they will gradually relax constraints (i.e., using an increased, yet faked, total

resource per socket during determining if the give execution plan satisfying constraints)

until a plan is obtained. We also conﬁgure external input rate (I) to just overfeed the

system on Server A, and using the same I to test on Server B. The results are shown in

Figure 5.13. There are two major takeaways.

First, RLAS generally outperforms other placement techniques on both two Servers. FF

can be view as a minimizing trafﬁc heuristic-based approach as it greedily allocates

neighbor operators (i.e., directly connected) together due to its topologically sorting

step. Several related work [XCTS14, ABQ13] adopt a similar approach of FF in duelling

with operator placement problem in the distributed environment. However, it performs

poorly, and we ﬁnd that during its searching for optimal placements, it often falls into

020000400006000080000100000120000WCFDSDLRThroughput (k events/s)RLASRLAS_fix(L)RLAS_fix(U)NamePlacement strategy detailsOSthe placement is left to the operating system (Both our servers use Linux-based OS)FFoperators are first topologically sorted and then placed in a first-fit manner (start placing from Spout)RRoperators are placed in a round-robin manner on each CPU socketChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

86

(a) Server A

(b) Server B

Figure 5.13: Placement strategy comparison under the same replication conﬁguration.

“not-able-to-progress" situation as it cannot allocate the current item (i.e, operator) into

any of the sockets because of the violation of resource constraints. This is due to its

greedy nature that leads to a local optimal state. Then, it has to relax the resource

constraints and repack the whole topology, which often ends up with oversubscribing

of a few CPU sockets. The major drawback of RR is that it does not take remote memory

communication overhead into consideration, and the resulting plans often involve

unnecessary cross sockets communication.

Second, RLAS performs generally better than other placement strategies on Server B.

We observe that Server B is underutilized for all applications under the given testing

input loads. This indicates that although the total computing power (aggregated CPU

frequency) of Server A is higher, its maximum attainable system capacity is actually

smaller. As a result, RLAS choices to use only a subset of the underlying hardware

resource of Server B to achieve the maximum application throughput. In contrast, other

heuristic based placement strategies unnecessarily involve more RMA cost by launching

operators to all CPU sockets.

Correctness of heuristics. Due to a very large search space, it is almost impossible

to examine all execution plans of our test workloads to verify the correctness of our

heuristics. Instead, we utilize Monte-Carlo simulations by generating 1000 random

execution plans, and compare against our optimized execution plan. Speciﬁcally, the

replication level of each operator is randomly increased until the total replication level

00.20.40.60.81WCFDSDLRNormalized ThroughputOSFFRR00.20.40.60.81WCFDSDLRNormalized ThroughputOSFFRRChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

87

Figure 5.14: CDF of random plans.

hits the scaling limits. All operators (incl. replicas) are then randomly placed. Results of

Figure 5.14 show that none of the random plans is better than RLAS. It demonstrates that

random plans hurt the performance in a high probability due to the huge optimization

space.

We further observe two properties of optimized plans of RLAS, which are also found

in randomly generated plans with relatively good performance. First, operators of

FD and LR are completely avoided being remotely allocated across different CPU-

tray to their producers. This indicates that the RMA overhead, of across CPU-tray,

should be aggressively avoided in these two applications. Second, resources are highly

appreciated in RLAS. Most operators (incl. replicas) end up with being “just fulﬁlled”,

i.e., ro = ro = ri. This effectively reveals the shortcoming of existing heuristics based

approach – maximizing an operator’s performance may be worthless or even harmful

to the overall system performance as it may already overfeed its downstream operators.

Further increasing its performance (e.g., scaling it up or making it allocated together

with its producers) is just a waste of the precious computing resource.

Communication pattern.

In order to understand the impact of different NUMA

architectures on RLAS optimization, we show communication pattern matrices of

running WC with an optimal execution plan in Figure 5.15. The same conclusion

applies to other applications and hence omitted. Each point in the ﬁgure indicates the

00.20.40.60.81200020000200000Cumulative percent Throughput (k events/s)WC (random)FD (random)SD (random)LR (random)WC (RLAS)FD (RLAS)SD (RLAS)LR (RLAS)WC (random)WC (RLAS)SD (RLAS)LR (RLAS)FD (RLAS)FD (random)LR (random)SD (random)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

88

Figure 5.15: Communication pattern matrices of WC on two Servers.

summation of data fetch cost (i.e., T f ) of all operators from the x-coordinate (Si) to

y-coordinate (Sj). The major observation is that the communication requests are mostly

sending from one socket (S0) to other sockets in Server A, and they are, in contrast, much

more uniformly distributed among different sockets in Server B. The main reason is

that the remote memory access bandwidth is almost identical to local memory access in

Server B thanks to its glue-assisted component as discussed in Section 2.4, and operators

are hence more uniformly placed at different sockets.

Varying the compression ratio (r). RLAS allows to compress the execution graph (with

a ratio of r) to tune the trade-off between optimization granularity and searching space.

We use WC as an example to show its impact as shown in Table 5.8. Similar trend is

observed in other three applications. Note that, a compressed graph contains heavy

operators (multiple operators grouped into one), which may fail to be allocated and

requires re-optimize. This procedure introduces more complexity to the algorithm,

which leads to higher runtime as shown in Table 5.8. A detailed discussion is presented

in Section 5.4.1.

Server AServer BChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

89

Table 5.8: Tuning compression ratio (r)

throughput

runtime

10140.2

10079.5

96390.8

84955.9

77773.6

(sec)

93.4

48.3

23.0

46.5

45.3

r

1

3

5

10

15

5.7.5 Factor Analysis

To understand in greater detail the overheads and beneﬁts of various aspects of

BriskStream, we show a factor analysis in Figure 5.16 that highlights the key factors

for performance. Simple refers to running Storm (version 1.1.1) directly on shared-

memory multicores. -Instr.footprint refers to BriskStream with much smaller instruction

footprint and avoiding unnecessary/duplicate objects as described in Section 5.5.1.

+JumboTuple further allows BriskStream to reduce the cross-operator communication

overhead as described in Section 5.5.2. In the ﬁrst three cases, the system is optimized

under RLAS_f ix(L) scheme without considering varying RMA cost. +RLAS adds

our NUMA aware execution plan optimization as described in Section 5.2. The major

takeaways from Figure 5.16 are that jumbo tuple design is important to optimize existing

DSPSs on shared-memory multicore architecture and our RLAS optimization paradigm

is critical for DSPSs to scale different applications on modern multicores environment

addressing NUMA effect.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

90

Figure 5.16: A factor analysis for BriskStream. Changes are added left to right and are
cumulative.

0100002000030000400005000060000700008000090000100000WCFDSDLRThroughput (k events/s)simple-Instr.footprint+JumboTuple+RLASCHAPTER 6

Scaling Consistent Stateful Stream Processing on

Shared-Memory Multicore Architectures

6.1 Introduction

The recent advances in data stream processing system (DSPS) [CFMKP13, WT15,

GSS15, CKE+15, TTS+14, KBF+15] in terms of performance, elasticity, and scalability

have accelerated their adoption in many emerging use cases. To meet the increasing

performance demand, optimizing stream processing on a single multicore machine is

critical [ZHD+04], even in a distributed environment. Recent efforts have demonstrated

ultra-fast stream processing on large-scale multicore architectures [KWCF+16, MPJ+17,

ZHZH19, ZMK+01].

However, a potential weakness of most existing DSPSs is the missing or inadequate

support of consistent stateful stream processing, where the application state is globally

shared among multiple threads (called executors) of an operator, and state consistency

is guaranteed by the system. Until now, state-of-the-art stateful DSPSs such as

Storm [TTS+14], Heron [KBF+15], Flink [CKE+15] still left such burden to the

application developer to handle – often through key-based stream partitioning to try to

completely avoid state sharing [SC14], which is error prone and sometimes impossible.

For example, the processing of an input event at one executor may need to access

multiple states that are already partitioned and located at different executors.

Efﬁciently support consistent stateful stream processing is however challenging. First,

there is a fundamental conﬂict between operator parallelism and shared state consistency.

In particular, as the shared application state may be read and updated at the same

time by different executors, any uncoordinated concurrent access will result in state

91

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

92

inconsistency [BFKT12]. Second, the system needs to ensure any executor is able to see

an exact “current” application state whenever it accesses to the state during processing

of an input event [CDK+14]. For example, a read to the same state shall never be affected

by a write, which is triggered by an event with a larger timestamp. This requires the

state access order follows exactly the input event timestamp order [MTZ+15, AMC17]

and again contrasts with high operator parallelism, which aim to processing different

events concurrently, possibly out-of-order.

Serially processing each input event eliminates the challenge of preserving state

consistency but restricts system concurrency [WRE11]. Subsequently, several solutions

have been proposed [WRE11, BFKT12, MTZ+15, CDK+14, AMC17] to improve system

concurrency while preserving shared state consistency by employing transactional

schematics. Speciﬁcally, the set of state accesses triggered by processing of a single

input event is deﬁned as a state transaction and the concurrent execution of multiple state

transactions are managed by the system using varies concurrency control mechanisms.

However, they are still poorly utilizing modern multicore architectures. First, they

commonly follow a synchronous scheduling paradigm, where an executor must ﬁnish

all tasks of processing one input event before work on more input events. Despite

its implementation simplicity, it restricts intra-event processing parallelism. Second,

although multiple different concurrent execution schemes to ensure state consistency

were proposed, we ﬁnd that they are still not able scale different workloads at a large

core counts due to severely contention and interference.

In this work, we present TStream, a novel DSPS supporting consistent stateful stream

processing that is speciﬁcally designed in the context of main-memory multicore

architectures. TStream follows previous works [MTZ+15, AMC17] of employing

transactional semantics on managing shared state accesses but with much better

scalability. The design of TStream is inspired by two observations. First, stream

query is predeﬁned and repeatedly invoked on each input event.

This prior

knowledge allows TStream to perform efﬁcient processing logic decomposition to

overlapping stream processing and state transaction processing efﬁciently. Second, state

transaction commitment order is explicitly determined by corresponding input event

timestamp. This allows TStream to parallelize state accesses by carefully leveraging

the dependencies within and across different input events with minimized thread

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

93

contention.

TStream abstracts consistent stateful stream processing as a recurrent three-step procedure.

Speciﬁcally, when an executor obtains an input event, it (1) processes (e.g., ﬁlter,

count) on the event; then (2) optionally issues a state transaction to access shared

states; Finally, (3) optionally invoke further process that may depend on state access

results (e.g., aggregate the state values). Subsequently, by efﬁciently decoupling the

second step from the processing logic, TStream allows an executor to skip and postpone

state transaction processing and immediately process more input events. Issued state

transactions are hence accumulated and evaluated as a batch periodically, triggered

by punctuation signals [TMSF03]. By exploiting the availability of parameter values of

issued state transaction, TStream can decompose a collection of issued state transactions

into multiple conﬂict-free atomic operations, which are dynamically organized into

multiple operation chains sorted by operation timestamp. This allows TStream to

process a batch of transactions with a much higher degree of parallelism under the same

consistency requirement.

In summary, we make the following contributions in this work:

• We propose punctuation signal slicing scheduling that allows computation and state

access to be efﬁciently overlapped.

• Leveraging on the availability of parameter values of issued state transaction,

TStream adopts a ﬁne-grained parallel processing model to take advantage of multicore

resources for evaluating a collection of state transactions. We also discuss several

optimization techniques to further improve system performance.

• We implement TStream as well as several state-of-the-art alternative schemes in

BriskStream [ZHZH19], a fully functional DSPS optimized for high-performance

multicore stream processing. We also experimentally pointed out scalability

bottlenecks of prior solutions.

• Overall, this work is the ﬁrst to provide a practical solution for scaling

consistent stateful stream processing on modern multicore architectures. We

open source full code of TStream at https://github.com/Xtra-Computing/

briskstream/tree/TStream.

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

94

6.2 Existing Solutions Revisited

Due to the unique features of consistent stateful stream processing, a number of prior

solutions have been proposed [WRE11, AMC17, BFKT12, Tra18, MTZ+15].

In the

following, we discuss a few representative ones.

Ordering-lock-based approach (LAL): An earlier study from Wang et al. [WRE11] described

a strict two-phase locking (S2PL) based algorithm that allows multiple state transactions

to run concurrently while maintaining state consistency. To ensure the ACID+O

properties, it employs a lockAhead process that compares each transaction’s timestamp

against a centralized process (e.g., global counter) to ensure it can proceed to insert locks

of that transaction.

Multi-versioning-based approach (LWM): The same author [WRE11] propose to improve

processing concurrency by leveraging on a multi-versioning storage management,

where multiple copies of the same application state modiﬁed at different timestamp

are maintained by the system. It further maintains a counter (i.e., lwm) of each state

to guard the state access ordering (i.e., ACID+O). Speciﬁcally, transactions that need to

access a state need to compare their timestamp with the lwm counter of that state. Write

lock is permitted only if the transaction’s timestamp is equal to lwm; while read lock is

permitted as long as the transaction’s timestamp is larger than lwm so that it can read a

readily version of the state. During commits, a transaction needs to update lwm of all its

modiﬁed states.

Static-partition-based approach (PAT): S-Store [MTZ+15] splits the shared application

states into multiple disjoint partitions, and hence only needs to guard accessing order

in each partition. We name such approach as PAT, and the system maintains an array

of global counters, one for each partition. Each transaction needs ﬁrst compare its

timestamp with global counters of its targeting partitions (may be more than one)

to synchronize the accesses to those partitions. It is noteworthy that, despite being

partitioned, all executors of an operator may still access any partitions of shared states

during stream processing, which is fundamentally different from key-based stream

partitioning [KLC08]. Obviously, two transactions still conﬂict if they need to access the

same partition.

We take TP [ACG+04] as an example to validate the effectiveness of prior solutions,

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

95

Figure 6.1(a) reveals that abundant parallelism opportunities (denoted as Theoretical

bound) are overlooked under prior solutions (denoted as Sync execution) with increasing

number of concurrently issued transactions (N ). N is up to 40 (on a 40 core machine)

under prior schemes, which puts a hard limit on their processing concurrency. Similar

observations are made in other existing solutions, hence there is a need for a more

scalable solution. In Figure 6.1(b), we further take PAT as an example and evaluate

how well it processes under varying available processor resources. We measure the

average time spend in each executor on state access, which stands for actual time spent in

accessing shared states, access overhead primarily due to lock acquisition and contention

during state access, and others including actual processing time on input event and all

other system overheads (e.g., context switching). With the increasing number of cores,

the access overhead quickly dominates runtime due to the serious contention overhead.

As mentioned before, in order to guarantee the ordering consistency requirement

(ACID+O), prior approaches compare timestamp of state transactions with a (or a set of)

global counter(s) to ensure locks are granted strictly in the correct order, which results

in centralized contention points and severely degrades system performance.

In Summary: There are two common scalability limitations in prior solutions. Firstly,

they commonly adopt a simple synchronous scheduling paradigm, where an executor is

scheduled to process one input event at one time, and only when all tasks of processing

that event is completed, the executor is available for other input events. Despite its

implementation simplicity, the parallelism opportunities inside the same event are

overlooked (Figure 6.1(a)). Secondly, despite different types of concurrency control

schemes were proposed, they either unnecessarily block more state accesses than

required (LAL) or involve high maintenance overhead (LWM). Although PAT (i.e.,

S-Store) can potentially reduce such overhead by careful partitioning shared states

beforehand, it quickly falls back to LAL with more multi-partition transactions – a

common problem for all partition-based approaches [PCZ12] (Figure 6.1(b)).

6.3 TStream Overview

TStream models consistent stateful stream processing as a recurrent three-step procedure:

(1) process input event (e.g., ﬁlter, count) and extract parameter values which are used

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

96

a) Overlooked parallelism opportunity.

b) Severely contention.

Figure 6.1: Issues of prior solutions.

in next step; (2) optionally issue a state transaction with determined parameter values

(Section 6.5); Finally, (3) conduct further process (e.g., aggregate the state values) that

may depend on state access results. Instead of conducting such three-step procedure

synchronously as done in previous works, TStream decouples the second step from

the processing procedure and postpones the state transaction to be evaluated later.

The processing of each event is hence split into two processing phases, including a

computation phase and a state access phase.

A punctuation signal [TMSF03] is used to trigger TStream to switch between two

processing phases. By tuning the interval of punctuation signals, TStream is able to

achieve high throughput with comparable latency compared to existing works. The

resulting alternative periodic execution between stream processing and transaction

processing is analogy to timeslicing scheduling technique [MEB88] widely adopted

in operating systems. However, the difference in system assumptions and designs

require us to revisit the problem. For example, TStream needs to handle on-the-ﬂy

events at different threads and tracking state access results (details will be discussed in

Section 6.4).

State access phase is often the performance bottleneck due to the strict consistency

requirements, and TStream aims to improve system concurrency for evaluating a

collection of state transactions. TStream adopts a sorting-based lock-free design for

processing state transactions. By exploiting the availability of parameter values among a

collection of postponed transactions, TStream decompose each transaction into multiple

100101102101102103102103103Num. of concurrently issued txns (N)04080120160200Num. of parallelizable operationsN is up to 40 under SyncTheoritical boundSync execution110203040Number of Cores0.00.20.40.60.81.0Access OverheadState AccessOthersChapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

97

atomic operations and regroup operations targeting at the same state together. The

formed group is sorted by timestamp and is called operation chain. Subsequently,

multiple operation chains can be evaluated independently and concurrently without

any centralized contention points.

6.4 TStream Design

TStream achieves speedy consistent stateful stream processing with a combination of

static query reﬁnement and dynamic runtime optimization. In this section, we discuss

the design of TStream in detail.

6.4.1 Programming model

Inline with many popular DSPSs, TStream expresses an application as a DAG with an

API similar to that of Storm [TTS+14]. In addition to that, in each vertex (i.e., operator),

user can declare a transaction manager (TXNMANAGER) as the interface of accessing

shared states without worrying state consistency violation. This is exempliﬁed by

Algorithm 1 that describes how Toll Notification processes input position reports

as discussed previously in Section 2.4.

Algorithm 1 Code template of Toll Notification operator
TM ← create TXNMANAGER (RoadSpeed_Table, VehicalCnt_Table);// supporting different

algorithms

foreach input event e in input stream do

t ← create AUX_Tuple(e);// AUX_Tuple is a thread-local auxiliary structure for

internal usage
RoadID ← process

(t);// extract the ID of road segment where the current

position report belonging

<Speed, Cnt> ← TM.access1(RoadID, t);// obtain average speed and unique vehical

count of that road

post_process (t, Speed, Cnt);// compute toll based on obtained road statistics

19

20

21

22

23

Query Reﬁnement. Thanks to the usage of shared states, TStream do not need to

rely on key-based stream partitioning [KLC08] as each executor is allowed to access

any part of application states. During query compilation, TStream can hence fuse all

operators into a single joint operator [ZMK+01, HSS+03] to eliminate the impact of

cross-operator communication, which is known to be a serious performance issue of

1In this work, we focus on single- and multi-keys point query, and devote a separate work for supporting

more complex query types.

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

98

stream processing on modern multicore architectures [ZHD+04, ZHZH19, PGJ+18]. In

this way, input data are simply passed to each executor of the joint operator in a round-

robin manner and we can use a switch-case statement in the joint operator to handle

different types of input events targeting at different original operators. For example,

Road Speed, Vehicle Cnt and Toll Notification operator can be fused into

one joint operator, Process. Subsequently, TStream allows Process to be scaled to

any number of executors without worrying state consistency violation. This has both

greatly simpliﬁed the developing of application logic and also ease the complexity

of execution plan optimization [ZMK+01, ZHZH19] with much simpler application

topology.

6.4.2 Punctuation Signal Slicing Scheduling

As discussed before, TStream adopts an non-conventional way of processing input

events, where state transaction processing is postponed. There are three key components

to support such postponing efﬁciently and correctly.

1) Timestamp Generation. For simplicity, we assign each input event (and punctuation)

a unique monotonically increasing timestamp.

In fact, TStream only requires

punctuation’s timestamp to be monotonically increasing in order to progress correctly.

Speciﬁcally, input events between two subsequent punctuations may arrive arbitrarily

with out-of-order timestamp sequence as their issued transactions will be decomposed

and sorted automatically during operation chain construction, which are discussed

subsequently.

2) AUX_Tuple Maintenance. A key design decision in TStream is to maintain a thread-

local auxiliary data structure, called AUX_Tuple, to track information (e.g., parameter

values and processing results) of each postponed transaction. The AUX_Tuple is

automatically created when an input event is received by the executor. Once a state

transaction is issued, parameter values of it are extracted from the input event and

are subsequently recorded into AUX_Tuple for tracking purpose. Figure 6.2 illustrates

an example process of creating three AUX_Tuple during processing of three events

at two executors of Process operator (i.e., the joint operator of TP ). There are two

key points to highlight. First, in this example, parameter values of each transaction

are directly extracted from the input position report (i.e., key is the road segment ID,

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

99

Figure 6.2: AUX_Tuple maintenance.

values are the vehicle identiﬁer and vehicle speed). We discuss the case when parameter

values are not directly extractable in Section 6.5. Second, events may need to be stored

temporarily. This is because they may require further process depending on evaluation

results of corresponding state transaction. For example, e2 has to be marked as unﬁnished

and stored locally with the executor since it requires the value of state B for further

computation. TStream stores such events by maintaining their AUX_Tuple structure

locally with the executor, whose “return value” will be updated during transaction

execution to support further stream computation.

3) Processing Phases Switching. A punctuation [TMSF03] is a special type of event

guaranteeing that no subsequent input events have a timestamp smaller than any events

a prior of it. In TStream, punctuation is periodically injected (as done in [CGB+14])

into the input queue of the source operator (e.g., the Parser). When the source

operator receives the punctuation event, it broadcasts the punctuation to all its

downstream operators. Executor, which declares transaction manager, is switched

from computation to state access phase when it receives punctuation from all of

its producers. Subsequently, when all state transactions are processed, executors are

resumed to computation phase to process further input events. Such a design effectively

amortized synchronization overhead among a batch of events and also enlarge inter-event

parallelism opportunities (Section 6.4.3).

To ensure correctness, TStream artiﬁcially adds the following two synchronization

barriers. First, only when all executors of the same operator are in state access phase,

they can proceed to process postponed transactions. This is to ensure all on-the-ﬂy events

before the current punctuation are processed at this operator, and issued transactions

from all executors are registered to the system. Second, recall that events may be stored

EventTransactionParametersReturn valuee1txn1: write(K1,V1), write(K2,V2)K1:A, K2:B, V1:+10, V2:-8N.A.e2txn2: read(K1)K1:BTo be fillede3txn3: read(K1)K1:CTo be filledAUX_Tuplestructuree1e2ProcessProcess(replica)e3e3Events may be temporarily stored for post-processing.e2Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

100

Figure 6.3: Example workﬂow of switching between phases.

at executors for further processing that depends on state access results. To ensure

correctness of the post-processing step, all executors are not resume to stream processing

until all postponed transactions are fully processed.

Both synchronization points are implemented as a Cyclicbarrier [Cen19b] in TStream.

Such synchronously switching between stream processing and transaction processing

introduces synchronization overhead among executors in TStream. However, as

we demonstrate later in experiments, batching and ﬁne-grained parallel transaction

processing signiﬁcantly improves system throughput and successfully amortizes such

synchronization overhead.

Figure 6.3 shows an example workﬂow of switching between phases. (a) punctuations

with a timestamp of 5 are received by every executor of Process; (b) all executors

are paused and no further input events (e.g., e6, e7) are allowed to enter the system.

Subsequently, actual transaction processing is started to process all postponed state

transactions; (c) when all postponed transactions are processed, executors will be

notiﬁed to process all stored unﬁnished events, whose AUX_Tuple now contain the

value of desired states; (d) ﬁnally, executors are switch back to computation phase to

process more input events.

6.4.3 Fine-grained Parallel State Access

Guaranteeing the aforementioned ACID+O properties while concurrently processing

multiple state transactions is challenging, especially it needs to enforce the external

timestamp sequence (i.e., ACID+O) – ensuring sequential processing is in fundamental

conﬂict with concurrent processing by letting more than one thread operate on different

events concurrently, possibly out-of-order. The key spirit of existing solutions is that

ProcessProcess(replica)e1e3e2e4pun5pun5(a)receive punctuationProcessProcess(replica)e1e3e2e4pausedpaused(b)state access processinge6e7ProcessProcess(replica)(d)continue stream processe6e7e4ProcessProcess(replica)e3(c)post-process on stored eventse6e7e1e2Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

101

they need to block any future transactions while allowing the current one with correct

(i.e., smallest) timestamp to acquire locks. This model is simple to realize but introduces

signiﬁcant synchronization overhead. By adopting punctuation technique [TMSF03],

TStream relax the constraint from synchronizing one transaction to a collection of

transactions, and hence amortizing the synchronization overheads. Subsequently, it

concentrates on improving processing throughput of every batch of state transactions

issued during processing all input events arrived between two consecutive punctuations.

To achieve that, there are two key components designed in TStream.

1) Transaction Decomposition. The transaction processing in TStream relies on a

key data structure, called operation chain. Speciﬁcally, once an event’s AUX_Tuple

is constructed and initialized, the executor is ready to postpone the issued transaction.

To do that, it decomposes the transaction into multiple primitive state access operations

and each operation targets at one application state (e.g., one road segment of TP ). Those

operations are then dynamically partitioned and inserted into lists (called operation

chains), where each list is responsible for one state (e.g., one record of the table).

Furthermore, operations on one state is automatically sorted by their timestamps.

Intuitively, any concurrent ordered data structure (e.g., self-balancing trees) can be used

to implement the operation chain. However, inappropriate implementation can lead to

huge overhead in construction and processing. We consider two properties in operation

chain. First, it must allow insertion from multiple executors simultaneously while still

guaranteeing operations (of the same chain) are ordered by timestamp. Second, it only

requires a sequential look up rather than random searches during processing. We hence

adopt ConcurrentSkipList [Cen19a] due to its much higher insertion performance and

simpler design with smaller constant overhead compared to other alternative designs,

such as balance trees [Pug89].

Figure 6.4 illustrates the decomposition process involving processing of three

transactions (the same example of Figure 6.2). txn1 (issued during processing of e1)

is decomposed into two operations, O1 and O2. Each operation is annotated with

timestamp (ts) of its original transaction, targeting state (state), access type (type), and

parameters (e.g., O1 is to increase the value of A by 10). O2 and O3 are grouped together

to form an operation chain as they target at the same state B. As O2 has a smaller

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

102

Figure 6.4: Transaction decomposition example.

timestamp than O3, the chain is sorted as O2 → O3. Similarly, O1 and O4 form another

two chains as they target at different states. Note that, events need to be embedded (by

a reference/pointer) to the operation so that their AUX_Tuple structure can be tracked

and updated during transaction processing.

2) Transaction Processing. Transactions are processed by evaluating the operation

chains and there are two cases that we need to consider. (Case 1): there is no data

dependency among operations. Each operation’s parameter values are extracted from

input events (e.g., in the case of TP ). In such case, we can simply sequentially walk

(i.e., evaluate) through each operation chain starting from the top (i.e., operation with

the smallest timestamp), and different operation chains can be processed concurrently.

(Case 2): an operation may depend on other operations. For example, a write operation

of one state is dependent on a read operation of another state. The general idea of

handling data dependency is to process operations without data dependency on others

ﬁrst. Then, process other operations depend on (processed) operations until no one left.

However, to keep track of the data dependency while maintaining access ordering at

such operation level is too costly and we propose to process at operation-chain level

utilizing multi-versioning, as illustrated as follows.

Given a collection of operation chains, TStream ﬁrst concurrently process all operation

chains with no data dependency on others (we can tag those operation chains during

transaction decomposition). Then, it processes operation chains with dependency on

the previously processed ones. This iteration process continue until no operation chains

optsstatetypepara.eventO11AWrite-only+10e1O21BWrite-only-8e1O32BRead-onlynulle2O43CRead-onlynulle3e1e2ProcessProcess(replica)e3O1→O2→O3→O4…A collection of constructed operation-chainsDecomposed operationsChapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

103

are left unprocessed. Such a design has low overhead at tracking data dependencies

(only at operation chain level), but operations may be processed out-of-order: depended

operations that have larger timestamp may be processed earlier. To handle this issue,

TStream has to record multiple versions (updated by different operations with different

timestamp) of a state during process if the state is to be read by other operations (i.e.,

with data dependency). This allows it to ensure subsequent read operations are able

to read the correct version (not necessary the latest version) of targeting state. After

the current batch of transactions is processed, all versions except the latest version are

expired and can be safely garbage collected (i.e., return to single-version store).

Intuitively, TStream performs the best when there is no data dependency among

operations in the workload (e.g., TP ). In our experiments, we show that TStream is able

to perform better or at least similar to previous solutions when the workload heavily

contains data dependencies (e.g., SL ).

6.4.4 More Processing Optimizations

Transaction Batching. TStream focuses on achieving a reasonable latency level, with

high throughput. Compared to existing approaches, TStream do not immediately

process each issued state transaction. Instead, it processes a batch of state transactions

periodically. The interval size of two subsequent punctuations (i.e., punctuation interval)

hence plays an important role in tuning system throughput and processing latency.

Having a large interval, the system needs to wait for a longer period of time to start

transaction processing, which increases worst-case processing latency since some events

are waiting (i.e., stored with executor) for their issued transactions to be actually

processed. Conversely, having a small interval size, the system throughput may drop

with insufﬁcient parallelism to amortize synchronization overhead. We evaluate the

effect of punctuation interval in our experiments.

NUMA-Aware Processing. Following previous works [PPB+12, PLTA03], we consider

three different design options for processing operation chains targeting on multi-sockets

multicore architectures. 1) Shared-nothing: In this case, we maintain a task pool of

operation chains per core. Essentially, operations are dynamically routed to predeﬁned

cores by hash partitioning. Then, only one executor is responsible for processing

operation chains in one core. The beneﬁts of such conﬁguration are that it minimizes

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

104

cross-core/socket communication during execution but it may result in workload

unbalance. 2) Shared-everything: In this case, we maintain a centralized task pool of

operation chains, which is shared among all executors to work with. 3) Shared-per-

socket: In this case, we maintain a task pool of operation chains per socket. Executors

of the same socket can hence share their workloads, but not share across different

sockets. Workloads are shared among multiple executors under shared-everything

and shared-per-socket conﬁguration. A simple strategy is to statically assign an equal

number of operation chains (as tasks) to every executor. Such static approach may not

always achieve good load balancing. Dynamic work-stealing [BL99] can be applied to

achieve better load balancing, where multiple executors (in the same sharing group)

continuously fetch and process operation chain as a task from the shared task pool.

Such conﬁguration achieves better workload balancing but pays more for cross-core

(and cross-socket in case of shared-everything conﬁguration) communication overhead

compared to shared-nothing conﬁguration. In our experiments, we evaluate TStream

with different conﬁgurations.

6.5 Discussion

TStream introduces shared states consistency guarantee to state-of-the-art DSPS, and is

able to achieve excellent scalability and efﬁciency using a mostly single-versioned store

(it only records multi-versioning of state that are dependent by others in each batch

of transactions) without any centrally contented locks as compared to prior solutions.

TStream’s transaction processing is also differentiated from many transaction processing

systems in its assumptions and hence in its design.

Determined parameter values. In all of our testing applications, the parameter values

(including read/write sets) of a state transaction are directly deduced from the ﬁrst

step processing of the input event. This seems a widely accepted assumption in

all applications found in prior works [BFKT12, MTZ+15, WRE11]. When this is not

applicable, a potential approach is to analysis the read/write sets of the transaction at

runtime as done in previous work [RTA14]. However, this adds additional overhead in

transaction processing, and subsequently worse overall stream processing performance.

In future work, we plan to study a more optimistic approach [WCT16] to relive such

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

105

overhead in order to handle more extensive use cases.

Abort and redo. A state transaction may need to be aborted because of a write operation

causing state consistency violation. When an operation is aborted, the corresponding

transaction (and all of its operations) has to be aborted as well. Subsequently, TStream

needs to rollback the effect of all operations of that particular transaction from potentially

multiple operation chains. After the rollback, TStream re-evaluates affected operation

chains with operations of aborting transaction eliminated. This process has to repeat

until all operations are evaluated. Such rollback and redo process can be simply achieved

by adopting multi-version storage [WAL+03] but it brings considerable overhead. In

this work, we assume application workloads do not have to abort transactions or the

aborting transaction only contains single write operation and we can hence simply reject

that operation with no cascading effect on other operations.

6.6 Evaluation

In this section, we show that TStream manages to better exploit hardware resources

compared to the state-of-the-art by a detailed experimental evaluation.

6.6.1 Experimental Setup

We conduct the experiment on a 4-socket Intel Xeon E7-4820 server with 128 GB

DRAM. Each socket contains ten 1.9GHz cores and 25MB of L3 cache. The operating

system is Linux 4.11.0-rc2. The number of cores devoted to the system and the size of

the punctuation interval are system parameters, which can be varied by the system

administrator. We vary both parameters in our experiments. We pin each executor on

one core and initialize the shared states evenly in each executor. We hence devote 1 to

40 cores to evaluate the system scalability.

Evaluation overview. We ﬁrst show the overall performance comparison of different

algorithms on different applications (Section 6.6.3). Then, we further compare different

algorithms under varying workload conﬁgurations (Section 6.6.4). We use shared-

nothing as the default execution conﬁguration in Section 6.6.3 and 6.6.4. We perform

sensitivity study to understand the design trade-off in TStream in Section 6.6.5.

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

106

(a) Grep and Sum (GS )

(b) Streaming Ledger (SL )

(c) Online Bidding (OB )

Figure 6.5: Three more applications in our benchmark workloads.

6.6.2 Benchmark Workloads

To the best of our knowledge, there is no standard benchmark for consistent stateful

stream processing. Prior works typically rely on one to two applications for performance

evaluation [BFKT12, WRE11, MTZ+15]. According to the four criteria proposed by Jim

Gray [Gra92] (i.e., relevance, portability, scalability and simplicity), we design our own

benchmark including both simple application (GS ) to be used as microbenchmark

and three applications (OB, SL and TP ) used in prior works [BFKT12, Tra18] covering

different aspects of application features.

Grep and Sum (GS): Figure 6.5(a) shows the topology of GS containing four operators.

Parser continuously feeds input events to Grep operator. Grep issues a state

transaction (read-only or write-only) to access a table of records. If an event triggers a

Record TableParserGrepSumSink𝑒1𝑒2Record (10k unique): Key (32 bytes String) +Value (32 bytes String)Account Table10k unique recordsAsset Table10k unique recordsParserSinkAnalysise1e2Bidding items           Price    QtyID             190       2             10        1...Auth.ParserProcessSinke1e2txn1txn2AB: Write (A), Write (B).txn1: Read(B) -> compareprice and quantity -> Write (B)txn2: top up quantity ofitem A and B by 2.e1: buy 3 item B withprice 11e2Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

107

read-only transaction, Grep forward the input event with the returned state values to

Sum; otherwise, it updates the state and forwards the input event to Sink. Sum performs

a summation of the returned state values from Grep. After Sum ﬁnishes computation, it

emits the computation results as one event to Sink. We use Sink to record the output

stream from Sum and Grep to monitor system performance. A table of 10k unique

records is shared among all executors of Grep. Each record has a size of 64 bytes, and

every state transaction access 10 records. Despite its simplicity, GS shall be applicable to

cover a wide range of different workloads by varying parameters such as the Zipﬁan

skew factor of keys (theta), read-write ratio of state access and state partition. We

vary all those factors in our experiments in Section 6.6.4 to study different workload

conﬁgurations.

Streaming Ledger (SL): SL is suggested by a commercial DSPS, namely Streaming

Ledger [Tra18].

It processes events describing wiring money and assets between

different user accounts. Detailed descriptions can be found in the white paper [Tra18]

and are omitted here for brevity. We implement it with three operators as depicted in

Figure 6.5(b). Parser parses received input events and forward to Analysis, which

updates user accounts (and/or asset records) based on the received events. The process

results are further passed to Sink. Sink reports the processing results to end users. The

account and asset tables (each has 10k unique records) are shared among all executors

of Analysis. We set a balanced ratio of transfer and deposit requests (i.e., 50% for

each) in Parser. Transaction length is four for transfer request (i.e., each touches four

records) and is two for deposit request.

Online Bidding (OB): Figure 6.5(c) represents a simpliﬁed bidding system [TZ05], where

users bid or sell items online. There are three types of trade requests as input events

to process. (1) bid request reduces the quantity of an item if the bid price is larger or

equal to the asking price, otherwise rejected. If the item has an insufﬁcient quantity,

the bid request is also rejected. (2) alter request modiﬁes prices of a list of items. (3) top

request increases the quantity of a list of items. The application can be implemented with

the following four streaming operators. Parser continuously emits events describing

trade requests from either buyers or sellers. Auth. authenticates the requests such as

validating the request’s IP address and dispatches valid requests for further process.

Process handles the aforementioned three types of requests. Sink records the output

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

108

stream from Process. During the processing of each event, Process may need to

read/update item table, which contains item id, price and quantity information.

Auth. and Process have a selectivity of one, that is, they always generate one output

for each input event. The length of both the alter and the top request is 20 so that each

request accesses 20 items. The length of the bid request is one. The price and quantity

of each item are randomly initialized before execution and is kept the same among

different tests. The ratio of the bid, alter, and top requests is conﬁgured as 6:1:1.

Toll Processing (TP): we use the dataset from previous work [ACG+04], which accesses

100 different road segments with a skew factor of around 0.2. Transaction length of TP is

one for each table, hence there is no multi-partition transaction. However, transactions

access each road segment non-consecutively, and hence the counter of each partition need

to be increased multiple times after each transaction commits under previous solutions.

In summary: Our benchmark covers different aspects of application features. First,

our applications cover different runtime characteristics. Speciﬁcally, TP spends 39%

of total time (run at a single core) in stream processing, and this ratio is 29% and

22% for SL and OB, respectively. GS spends relatively less time in stream processing

(13%), and more time is spent in shared state access. Second, they cover different

types of state transactions. Speciﬁcally, GS has read-only and write-only request. SL

has write-only and read-modify-write (w/ cross states dependency) request. OB has

write-only, read-modify-write (w/o cross states dependency) request. TP has read-

modify-write (w/o cross states dependency) request. It is noteworthy that key-based

stream partition [KLC08] are not applicable here as processing of each input event may

request to access arbitrary states and events are randomly shufﬂed among all executors

running concurrently in different threads. As a result, any uncoordinated accesses (i.e.,

update and read) to the same state can cause state inconsistencies.

6.6.3 Overall Performance Comparison

We ﬁrst compare TStream with other schemes on different applications with varying

physical resources. Besides three competing schemes, we also examine the system

performance when locks are completely removed from LAL scheme, which is denoted

as No-Lock representing the system performance upper bound without consistency

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

109

(a) GS (50% read requests)

(b) SL

(c) OB

(d) TP

Figure 6.6: Throughput (log-scale) comparison of different applications under different
execution schemes. There are 25% multi-partition transactions for GS, SL and OB.

guarantee. For GS, SL and OB, we set state access skew factor to be 0.6, and the length

and ratio of multi-partition transaction is set to 4 and 25%, respectively under PAT.

That is, each multi-partition transaction needs to access four different partitions, and

25% transactions are multi-partition transactions. We also conﬁgure their state accesses

to each partition with monotonically increasing timestamp of one so that the global

counter of each partition is increased exactly once after each access.

Performance comparison. The throughput comparison results are shown in Figure 6.6,

and there are three major observations. First, TStream outperforms all other schemes

while preserving the same consistency properties at large core counts for all applications

except SL. However, there is still large room to further improve TStream to achieve the

performance upper bound indicated by No-Lock scheme. Second, there is a signiﬁcantly

increased synchronization overhead due to data dependency handling in TStream for

SL and it performs similar to prior solutions. Optimistic execution strategy [WCT16]

may be adopted to reduce such synchronization overhead and further improve system

No-LockLOCKMVLKPATTStream1510152025303540Number of Cores101102103102103104103104104Throughput (K events/sec)1510152025303540Number of Cores101102103102103104103104104Throughput (K events/sec)1510152025303540Number of Cores101102103102103104103104104Throughput (K events/sec)1510152025303540Number of Cores101102103102103104103104104Throughput (K events/sec)Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

110

performance. Due to its considerable complexity, we defer it as future work. Third, PAT

performs generally better than LAL and LWM as it avoids blocking when transactions

access different partitions. However, PAT performs even worse than LAL for TP

although there are no multi-partition transactions. The reason is that transactions access

each road segment non-consecutively, and executor needs to increase the global counter

of each partition by multiple times (instead of once in case of consecutive access) in

order to allow the next transaction to proceed. As a result, excessive access to a large set

of global counters degrades system performance signiﬁcantly.

Runtime breakdown. Following the previous work [YBP+14], we now report how

much time is spent on different components of processing a state transaction. 1) Useful

is the time that the transaction is really operating on records. 2) Lock stands for the

total amount of time that a transaction spends due to lock insertion. 3) RMA stands

for remote memory access overhead that a transaction spends in global counter access

(in case of LAL, LWM, and PAT) or in transaction decomposition (in case of TStream).

Index lookup and actual state access may also cause remote memory access for all

schemes run on multi-sockets. 4) Sync is the time that a transaction spends due to

synchronization. This is a unique component pay for guaranteeing ACID+O properties,

where a transaction may need to synchronize among executors per event in LAL, LWM

and PAT or synchronize per punctuation interval in TStream. 5) Others include all other

system overheads including index lookup (w/o RMA), context switching, auxiliary data

structure creation, etc.

We use TP as an example to study the runtime breakdown in different algorithms.

Similar observations are made in the other three applications. Figure 6.7 compares

the time breakdown when the system is run on single or four sockets. There are three

major takeaways. First, No-Lock spends more than 60% of the time in Others, which

prevents the system to further scale. Our further investigation reveals that the index

look-up is the root cause of such performance degradation. We defer the study of

more scalable index design in future work and concentrate on concurrent execution

control in this work. Second, Sync overhead dominates all lock-based algorithms

(LAL, LWM, and PAT) regardless of the NUMA effect. Although LWM does spend

less time in Sync compared to LAL as read may not be blocked by write resulting

in higher processing concurrency, it spends more time in reading and updating the

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

111

(a) Single socket

(b) Four sockets

Figure 6.7: Runtime breakdown per state transaction of TP.

(a) Varying ratio of multi-partition txns (length=6). (b) Varying length of multi-partition txns (ratio=50%).

Figure 6.8: Multi-partition transaction evaluation.

lwm variable (grouped in Others overhead). Third, NUMA overhead is signiﬁcant

in TStream when running on four sockets. Our ﬁne-grained operation-chains based

processing paradigm exploits high parallelism opportunities while still guaranteeing

the same consistency requirement as prior solutions. Unfortunately, it also brings high

communication overhead, which is unavoidable during transaction decomposition since

each executor may issue transaction that touches arbitrary states. Nevertheless, as

discussed in Section 6.4.4, TStream supports multiple NUMA-aware conﬁgurations for

transaction processing. We study their effectiveness later in Section 6.6.5.

6.6.4 Workload Sensitivity Study

We now use GS as an example to evaluate different algorithms under varying workload

conﬁgurations in detail.

OthersSyncRMALockUsefulNo-LockLALLWMPATTStream0.00.20.40.60.81.0No-LockLALLWMPATTStream0.00.20.40.60.81.0PAT(write-only)PAT(read-only)TStream(write-only)TStream(read-only)0.00.20.40.60.81.0Percentage of multi-partition txns0140280420560700Throughput (k events/sec)1.02.84.66.48.210.0Length of multi-partition txns0140280420560700Throughput (k events/sec)Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

112

(a) Read/write workload ratio.

(b) State access skewness.

Figure 6.9: Varying application workload conﬁgurations of GS.

(a) Throughput

(b) 99th percentile latency

Figure 6.10: Effect of varying punctuation interval.

Multi-partition transaction percentage. We ﬁrst study the effect of states partitioning.

We use a simple hashing strategy to assign the records to partitions based on their

primary keys so that each partition stores approximately the same number of records.

As a common issue of all partition based algorithms [PCZ12], the performance of PAT

is heavily depended on the length and ratio of multi-sites transactions.

We ﬁrst conﬁgure multi-partition transaction to touch 6 different partitions of the shared

states. We then vary the percentage of multi-partition transactions in the workload. The

results are shown in Figure 6.8(a). Since PAT is specially designed to take advantage of

partitioning, it has a much lower overhead for synchronization when no multi-partition

is required (i.e., ratio=0%). However, it performs worse than TStream even without

any multi-portion transaction. This is due to its synchronous execution model, which

overlooks parallelism opportunities within the processing of a single event. Furthermore,

LOCKMVLKPATTStream0.00.20.40.60.81.0Percentage of Read Requests0140280420560700Throughput (K events/sec)0.00.20.40.60.81.0Zipf skew factor0160320480640800Throughput (K events/sec)GSSLOBTP02004006008001000Punctuation interval (tuples)0400800120016002000Throughtput (k events/sec)02004006008001000Punctuation interval (tuples)0.01.63.24.86.48.0Latency (msec)Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

113

Figure 6.11: 99th percentile end-to-end processing latency.

Figure 6.12: Effect of work-stealing.

Figure
6.13:
conﬁgurations.

Varying

processing

GSSLOBTP0.000.240.480.720.961.20Processing latency (ms)No-LockLOCKMVLKPATTStreamGSSLOBTP02204406608801100Throughput (k txns/sec)shared-per-socket (w/ stealing)shared-per-socket(w/o stealing)GSSLOBTP033066099013201650Throughput (k txns/sec)shared-nothingshared-everythingshared-per-socketChapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

114

as expected, its performance degrades with more multi-partition transactions as they

reduce the amount of parallelism. A similar observation can be found in Figure 6.8(b),

where we vary the length of multi-partition transactions and ﬁx its ratio to be 50%. Note

that, there is no difference in performance whether or not the workload contains write

request under the PAT scheme as transactions are always bottlenecked by partition

locks. In the following studies, we set the multi-partition ratio to be 50% under PAT.

Read request percentage. We now vary the percentage of events that trigger read

request to shared states from 0% (write-only) to 100% (read-only). In this study, we

disable stream computation (n=0) of GS and focus on evaluating the efﬁciency of state

transaction processing. We also set the key skew factor to be 0, and hence the state

is accessed with uniform frequency. Figure 6.9(a) shows the results and there are

two major observations. First, varying read/write requests ratio has a minor effect

on system performance under prior schemes, LAL, LWM and PAT. This is because

their execution runtime is dominated by synchronization overhead. Second, TStream

performs generally worse with more read request. This is because the system has to write

back the state value to event’s (which triggers read request) AUX_Tuple after transaction

evaluation is ﬁnished. An interesting point to take note is that TStream’s performance

increases slightly under read-only workload compared to mixture workload due to

hardware prefetchers. When there are both read and write to shared states, hardware

prefetchers are not effective as each prefetch can steal read and or write permissions

for shared blocks from other processors, leading to permission thrashing and overall

performance degradation [JHL06].

State access skewness. In this study, we conﬁgure a write-only workload to examine

how algorithms perform under contented state update. To represent a more realistic

scenario, we model the accessing distribution as Zipﬁan skew, where certain states

are more likely to be accessed than others. The amount of skew in the workload is

determined by the parameter, theta. Figure 6.9(c) shows that TStream achieve high

performance even under high skewness. LWM performs even worse under contented

workload as there is more contention on updating lwm counter of the same record

during transaction commit. PAT performs worse with increasing skewness because

of the more intensive contention on the same partition lock. In contrast, TStream is

still able to discover sufﬁcient parallelism opportunities among a large collection of

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

115

transactions (punctuation interval is set to 500).

6.6.5 System Sensitivity Study

In this section, we study the effect of processing optimizations (Section 6.4.4) in TStream.

Varying punctuation interval. The number of transactions to handle between two

subsequent punctuation plays a critical role in TStream’s performance. Figure 6.10(a)

shows that the performance of TStream generally increases with larger punctuation

interval. When it is larger than 500 tuples, TStream achieves its best performance for

all applications. It also shows that large punctuation interval is especially beneﬁcial for

TP. The reasons are two folds. First, there are only 100 different road segments, and

transactions are heavily contented within a small batch of transactions. Second, TP

has the highest stream processing ratio, TStream achieves a higher stream processing

concurrency with large punctuation interval, and the system performance hence

increases signiﬁcantly.

Following the previous work [DZSS14], we deﬁne the end-to-end latency of a streaming

workload as the duration between the time when an input event enters the system

and the time when the results corresponding to that event is generated. Figure 6.10(b)

shows the processing latency of TStream under varying punctuation interval. Thanks to

the signiﬁcantly improved throughput, TStream achieves very low processing latency.

When TStream achieves its best performance (around punctuation interval of 500), its

processing latency is only around 0.23∼0.56 ms, which satisﬁes many practical use

cases [DZSS14], hence TStream is practically useful. Further increasing punctuation

interval, the latency becomes worse as there is no signiﬁcant throughput improvement.

Figure 6.11 further shows that TStream achieves comparable and sometimes even lower

processing latency compared to the state-of-the-art.

Effect of NUMA-aware optimizations. We now compare different NUMA-aware

processing conﬁgurations of TStream including share-nothing, share-everything, and

shared-per-socket. Work-stealing can be further enabled in the latter two conﬁgurations.

By taking shared-per-socket as an example, we show in Figure 6.12 that work-stealing

does signiﬁcantly improve the system performance, and shall be enabled when the

shared conﬁguration is applied. However, Figure 6.13 shows that TStream achieves the

Chapter 6. Scaling Consistent Stateful Stream Processing on
Shared-Memory Multicore Architectures

116

best performance for all applications under shared-nothing conﬁguration. This indicates

that cross-core and cross-socket communication shall be always avoided for all testing

applications. Nevertheless, we plan to investigate more applications that may be more

sensitive to workload unbalancing rather than communication overhead.

CHAPTER 7

Conclusion

In this thesis, we presented our exploration on the design and implementation of scalable

multicore main-memory DSPSs for supporting modern stream analytic workloads. We

performed a comprehensive study on the DSPS architectures, and optimized the system

performance by investigating and addressing the scalability bottlenecks from two major

DSPS components, including execution plan optimization and state management.

7.1 Contributions

The main contributions of this thesis are summarized as follows.

Revisiting the Design of Data Stream Processing Systems on Multi-Core Processors.

We revisited three common design aspects of modern DSPSs on modern multi-socket

multi-core architectures, including a) pipelined processing with message passing, b) on-

demand data parallelism, and c) JVM-based implementation. Particularly, we conduct

detailed proﬁling studies with micro benchmark on Apache Storm and Flink. Our

results show that those designs have underutilized the scale-up architectures in these

two key aspects: a) The design of supporting both pipelined and data parallel processing

results in a very complex massively parallel execution model in DSP systems, which

causes high front-end stalls on a single CPU socket; b) The design of continuous message

passing mechanisms between operators severely limits the scalability of DSP systems on

multi-socket multi-core architectures. We further present two optimizations to address

those performance issues and demonstrate promising performance improvements.

BriskStream: Scaling Data Stream Processing on Shared-Memory Multicore

Architectures. We have introduced BriskStream, a new data stream processing system

117

Chapter 7. Conclusion

118

with a new streaming execution plan optimization paradigm, namely Relative-Location

Aware Scheduling (RLAS). BriskStream scales stream computation towards a hundred

of cores under NUMA effect. The experiments on eight-sockets machines conﬁrm that

BriskStream signiﬁcantly outperforms existing DSPSs up to an order of magnitude

even without the tedious tuning process. We hope our study on relative-location

aware scheduling could shed lights on other NUMA-aware execution plan optimization

research.

Scaling Consistent Stateful Stream Processing on Shared-Memory Multicore

Architectures. We have proposed TStream aiming at scaling stateful stream processing

on shared-memory multicore architectures under strict consistency requirement.

TStream achieves high scalability via two key designs including 1) punctuation signal

slicing scheduling, which allows stream processing and transaction processing to

be efﬁciently overlapped and 2) ﬁne-grained parallel state access, which maximize

execution concurrency for processing a collection of state transactions. Our extensive

experiments on a 40-core server with different algorithms conﬁrm the superiority of

TStream’s designs.

7.2 Discussions

In this section, we discuss a few additional issues that are not covered by previous

contents.

Impact of platforms. The experiments conducted throughout the work of this thesis

are mostly based on high-end servers each with 4-8 CPU sockets. While commodity

servers widely deployed in today’s data centers are still equipped with 1 or 2 sockets for

their lower price-per-core, which seems to limit the practical usability of the proposed

techniques and systems. We argue the contribution of this thesis from the following two

aspects. On one hand, the systems (i.e., BriskStream and TStream) proposed in this thesis

are applicable to commodity servers and can signiﬁcantly outperform existing systems

as can be seen from the comparison results at small core counts (e.g., Figure 5.8a). On

the other hand, by improving the performance of stream processing at high-end server,

this thesis opens opportunities for even cheaper distributed stream processing over a

small size cluster with multiple high-end servers, which may well complement with

Chapter 7. Conclusion

119

existing infrastructures. Due to the severely under-utilization of hardware resources at

each compute node, existing DSPSs (e.g., Flink) will not be able to take advantage of

such “high-end clusters”.

Ingestion design. Ingestion concerns how input stream actually ﬂows into the system.

In this thesis, we omit the ingestion component by assuming input data are always

ready to be consumed at “Spout” operators. Speciﬁcally, “Spout” operator initializes

an array of input tuples in its local memory and continuously feed the data into the

other parts of the application. In reality, “Spout” receives input data from external

systems, e.g., receiving xml ﬁles over tcp/ip network. How the network adapter is

connected to the NUMA node will affect the speed of “Spout”, i.e., it runs faster if it

is allocated near the network adapter. Essentially, this turns “Spout” into a consumer

operator and our optimization algorithm can be naturally extend to capture such effect:

instead of assuming “Spout” has no producer and always run at the same speed no

matter it allocates, we can consider a virtual operator being producer of “Spout”. Then,

assume the virtual operator is allocated at the NUMA node with network adapter, our

algorithm will try to determine the suitable placement and parallelism conﬁguration of

the “Spout” operator by taking care of the relative location of “Spout” and the virtual

operator, similar to other operators.

Application demands. A large volume of data is generated in real-time or near real-time

and has grown explosively in the last few years. For example, IoT (Internet-of-Things)

organizes billions of devices around the world that are connected to the internet through

sensors or Wi-Fi. IHS Markit forecasts [iot19] that 125 billion such devices will be

on service by 2030, up from 27 billion last year. With the proliferation of such high-

speed data sources, numerous data-intensive applications are or will be deployed in

real-world use cases exhibiting latency and throughput requirements that cannot be

satisﬁed by traditional batch processing models. Despite the massive effort devoted

to big data research, many challenges remain. For example, the new 5G network

promises blazing speeds, massive throughput capability and ultra-low latencies [PC19],

thus bringing more demands for performance critical stream applications. First, high-

throughput stream processing is essential to keeping up with data streams in order

to satisfy the Process and Respond Instantaneously [ScZ05] requirement. Second, Keep

the Data Moving [ScZ05] is one of the fundamental design requirements of DSPSs.

Chapter 7. Conclusion

120

We hence aims to process input data “on-the-ﬂy” without storing them, which also

requires the system to be able to handle input stream as fast as possible without

having to queue up input streams. Furthermore, new media applications such as

live audio streaming services [WLCH18] also challenges existing systems in terms of

new processing paradigms. Despite the massive effort devoted, many challenges remain

and we foresee the continuous growing interest in the area that this thesis targets at.

CHAPTER 8

Future Directions

The proliferation of high-rate data sources has accelerated the development of next-

generation performance-critical DSPSs. For example, the new 5G network promises

blazing speeds, massive throughput capability and ultra-low latencies [PC19], thus

bringing the higher potential for performance critical stream applications. While the

mechanism proposed in the previous chapters allow the DSPSs to better utilize modern

hardware capabilities, many challenges remain. In the following, we list some future

directions.

Computation Optimization. Complex event processing (CEP) has become increasingly

important for stream applications in which arbitrarily complex patterns must be

efﬁciently detected over high-speed streams of events. Online ﬁnance, security

monitoring, and fraud detection are among the many examples. Pattern detection

generally consists of collecting primitive events and combining them into potential

(partial) matches using some type of detection model. As more events are added to a

partial match, a full pattern match is eventually formed and reported. The costly nature

of CEP [ZDI14] and the stringent response time requirements of stream application

has created signiﬁcant interest in accelerating CEP. However, there is no one standard

implementation for CEP. Popular CEP mechanisms include nondeterministic ﬁnite

automata (NFAs) [ZDI14], ﬁnite state machines [AcT08], trees [MM09], and event

processing networks [REG11]. Meanwhile, several parallelization paradigms have

been proposed in the literature including both data parallelism [BDWT13] and task

parallelism approach [BGHJ09]. However, there is a lack of a comprehensive evaluation

of prior implementations in a modern multicore architectures. We plan to conduct such

a study and aim to answer the question of how to design an efﬁcient CEP system to

121

Chapter 8. Future Directions

122

better utilize shared-memory multicore architectures.

Communication Optimization. Most DSPSs are designed with Keep the Data

Moving [ScZ05] as the fundamental design principle, and hence aims to process

input data “on-the-ﬂy” without storing them.

Subsequently, message passing

is often a key component in current DSPSs.

Researchers have attempted to

improve the communication efﬁciency by taking advantage of the latest advancement

in network infrastructure, compression using hardware accelerator, and efﬁcient

algorithms exploiting new hardware characteristics [MJP+19, PGJ+18, ZMK+01].

However, a model-guided approach to balance the tradeoff between computation and

communication overhead is still in general missing in existing works. We are designing

a new DSPS with cost-model guided paradigm to decide when compression shall be

involved and which compression scheme shall be used in order to achieve optimal

system throughput.

Efﬁcient State Retrieval. Modern streaming applications with complex execution logic

often need to maintain and access large internal states. The naive scan retrieval overhead

grows rapidly with larger state size and quickly become the bottleneck of overall system

performance. It is therefore important to explore ways, such as index management, to

relieve such bandwidth pressure. However, maintaining index structures also brings

maintenance overhead [LOWY15]. Witnessing those issues, we are developing new

algorithm and mechanism to better balance these conﬂicting aspects.

CHAPTER 9

Publications

In this chapter, we list the main articles (published or under-review) contributed to the

thesis and also articles authored or co-authored during the author’s Ph.D. journey.

9.1 Selected Publications

1. Shuhao Zhang, Bingsheng He, Daniel Dahlmeier, Amelie Chi Zhou, Thomas

Heinze, “Revisiting the design of data stream processing systems on multi-core

processors”. International Conference on Data Engineering (ICDE, 2017)

2. Shuhao Zhang, Jiong He, Amelie Chi Zhou, Bingsheng He, “BriskStream: Scaling

Data Stream Processing on Shared-Memory Multicore Architectures”. International

Conference on Management of Data (SIGMOD, 2019)

3. Shuhao Zhang, Yingjun Wu, Feng Zhang, Bingsheng He, “Scaling Consistent

Stateful Stream Processing on Shared-Memory Multicore Architectures”. To be

submitted

9.2 Other Publications

1. Shuhao Zhang, Feng Zhang, Yingjun Wu, Paul Johns, Bingsheng He. “Hardware-

Conscious Stream Processing: A Survey”. Currently minor revision in SIGMOD

Record

2. Shuhao Zhang, Hoang Tam Vo, Daniel Dahlmeier, Bingsheng He. “Multi-Query

Optimization for Complex Event Processing in SAP ESP”. International Conference

on Data Engineering, Industrial and Application (ICDE 2017)

123

Chapter 9. Publications

124

3. Shanjiang Tang, Bingsheng He, Shuhao Zhang, Zhaojie Niu. “Elastic Multi-

Resource Fairness: Balancing Fairness and Efﬁciency in Coupled CPU-GPU

Architectures". The International Conference for High Performance Computing,

Networking, Storage, and Analysis (SC, 2016).

4. Feng Zhang, Jidong Zhai, Bingsheng He, Shuhao Zhang, Wenguang Chen,

“Understanding Co-running Behaviors on Integrated CPU/GPU Architectures”.

IEEE Transactions on Parallel and Distributed Systems (TPDS, 2017)

5. Zeke Wang, Shuhao Zhang, Bingsheng He,Wei Zhang. “Melia: A MapReduce

Framework on OpenCL-Based FPGAs". IEEE Transactions on Parallel and Distributed

Systems (TPDS, 2016).

6. Jiong He, Shuhao Zhang, Bingsheng He “In-Cache Query Co-Processing on Coupled

CPU-GPU Architectures". International Conference on Very Large Data Bases

(VLDB, 2015).

References

[AAB+05]

Daniel J Abadi, Yanif Ahmad, Magdalena Balazinska, Ugur Cetintemel,

Mitch Cherniack, Jeong-Hyon Hwang, Wolfgang Lindner, Anurag

Maskey, Alex Rasin, Esther Ryvkina, et al. The design of the borealis

stream processing engine. In CIDR’05, volume 5, pages 277–289, 2005.

[ABB+08]

Tyler Akidau, Alex Balikov, Kaya Bekiro ˘glu, Slava Chernyak, Josh

Haberman, Reuven Lax, Sam McVeety, Daniel Mills, Paul Nordstrom, and

Sam Whittle. Millwheel: Fault-tolerant stream processing at internet scale.

Proc. VLDB Endow., 6(11):1033–1044, 2013-08.

[ABQ13]

Leonardo Aniello, Roberto Baldoni, and Leonardo Querzoni. Adaptive

online scheduling in storm. In Proceedings of the 7th ACM international

conference on Distributed event-based systems, pages 207–218. ACM, 2013.

[ABVA15]

A. J. Awan, M. Brorsson, V. Vlassov, and E. Ayguade. Performance

characterization of in-memory data analytics on a modern cloud server.

In 2015 IEEE Fifth International Conference on Big Data and Cloud Computing,

pages 1–8, August 2015.

[ABW06]

Arvind Arasu, Shivnath Babu, and Jennifer Widom. The cql continuous

query language: Semantic foundations and query execution. The VLDB

Journal, 15(2):121–142, June 2006.

[ACc+03]

Daniel J. Abadi, Don Carney, Ugur Çetintemel, Mitch Cherniack, Christian

Convey, Sangdon Lee, Michael Stonebraker, Nesime Tatbul, and Stan

Zdonik. Aurora: A new model and architecture for data stream

management. The VLDB Journal, 12(2):120–139, August 2003.

[ACG+04]

Arvind Arasu, Mitch Cherniack, Eduardo Galvez, David Maier, Anurag S.

Maskey, Esther Ryvkina, Michael Stonebraker, and Richard Tibbetts.

Linear road: A stream data management benchmark.

In Proceedings

125

References

126

of the Thirtieth International Conference on Very Large Data Bases - Volume 30,

VLDB ’04, pages 480–491. VLDB Endowment, 2004.

[AcR+12]

Mert Akdere, Ugur Çetintemel, Matteo Riondato, Eli Upfal, and Stanley B.

Zdonik. Learning-based query performance modeling and prediction.

In Proceedings of the 2012 IEEE 28th International Conference on Data

Engineering, ICDE ’12, pages 390–401, Washington, DC, USA, 2012. IEEE

Computer Society.

[AcT08]

Mert Akdere, U ˇgur Çetintemel, and Nesime Tatbul. Plan-based complex

event detection across distributed sources. Proc. VLDB Endow., 1(1):66–77,

August 2008.

[AFK+12]

Kunal Agrawal, Jeremy T. Fineman, Jordan Krage, Charles E. Leiserson,

and Sivan Toledo. Cache-conscious scheduling of streaming applications.

In Proceedings of the Twenty-fourth Annual ACM Symposium on Parallelism

in Algorithms and Architectures, SPAA ’12, pages 236–245, New York, NY,

USA, 2012. ACM.

[AGN+13]

Raja Appuswamy, Christos Gkantsidis, Dushyanth Narayanan, Orion

Hodson, and Antony Rowstron. Scale-up vs scale-out for hadoop: Time

to rethink? In Proceedings of the 4th Annual Symposium on Cloud Computing,

SOCC ’13, pages 20:1–20:13, New York, NY, USA, 2013. ACM.

[AJ00]

Martin Arlitt and Tai Jin. A workload characterization study of the 1998

world cup web site. IEEE network, 14(3):30–37, 2000.

[AMC17]

Lorenzo Affetti, Alessandro Margara, and Gianpaolo Cugola. Flowdb:

Integrating stream processing and consistent state management.

In

Proceedings of the 11th ACM International Conference on Distributed and

Event-based Systems, DEBS ’17, pages 134–145, New York, NY, USA, 2017.

ACM.

[ASK15]

Farhoosh Alghabi, Ulrich Schipper, and Andreas Kolb. A scalable

software framework for stateful stream data processing on multiple

gpus and applications. In GPU Computing and Applications, pages 99–

118. Springer, 2015.

References

127

[BCM06]

Roger S Barga and Hillary Caituiro-Monge. Event correlation and

pattern detection in cedr. In International Conference on Extending Database

Technology, pages 919–930. Springer, 2006.

[BdN11]

Giuseppe Bianchi, Nico d’Heureuse, and Saverio Niccolini. On-demand

time-decaying bloom ﬁlters for telemarketer detection. SIGCOMM

Comput. Commun. Rev., 41(5):5–12, October 2011.

[BDWT13]

Cagri Balkesen, Nihal Dindar, Matthias Wetter, and Nesime Tatbul. Rip:

Run-based intra-query parallelism for scalable complex event processing.

In Proceedings of the 7th ACM International Conference on Distributed Event-

based Systems, DEBS ’13, pages 3–14, New York, NY, USA, 2013. ACM.

[BFKT12]

Irina Botan, Peter M. Fischer, Donald Kossmann, and Nesime Tatbul.

Transactional stream processing. In Proceedings of the 15th International

Conference on Extending Database Technology, EDBT ’12, pages 204–215,

New York, NY, USA, 2012. ACM.

[BG81]

Philip A. Bernstein and Nathan Goodman. Concurrency control in

distributed database systems. ACM Comput. Surv. 1981, 13(2):185–221,

June 1981.

[BGHJ09]

Lars Brenna, Johannes Gehrke, Mingsheng Hong, and Dag Johansen.

Distributed event stream processing with non-deterministic ﬁnite

automata.

In Proceedings of the Third ACM International Conference on

Distributed Event-Based Systems, DEBS ’09, pages 3:1–3:12, New York, NY,

USA, 2009. ACM.

[BL99]

Robert D. Blumofe and Charles E. Leiserson. Scheduling multithreaded

computations by work stealing. J. ACM, 46(5):720–748, September 1999.

[BXGT04]

S. Byna, Xian-He Sun, W. Gropp, and R. Thakur. Predicting memory-

access cost based on data-access patterns.

In 2004 IEEE International

Conference on Cluster Computing (IEEE Cat. No.04EX935), pages 327–336,

September 2004.

[CAMM13] Alvin Cheung, Owen Arden, Samuel Madden, and Andrew C. Myers.

Speeding up database applications with pyxis. In Proceedings of the 2013

References

128

ACM SIGMOD International Conference on Management of Data, SIGMOD

’13, pages 969–972, New York, NY, USA, 2013. ACM.

[CC]

Karthik Ganesan Jeffrey S. Jagoda Scott T. Jones Maynard Johnson John

Kacur Ian N. Lenz Frank Levine Mike Mu Milena Milenkovic Dave

Nomura Enio Pineda Patrick C. Shih Nitin M. Thomas Brian Twichell

Robert J. Urquhart Xiao Zhang Craig Chaney, Jimmy DeWitt. Performance

Inspector. http://perfinsp.sourceforge.net.

[CCD+03]

Sirish Chandrasekaran, Owen Cooper, Amol Deshpande, Michael J.

Franklin, Joseph M. Hellerstein, Wei Hong, Sailesh Krishnamurthy,

Samuel R. Madden, Fred Reiss, and Mehul A. Shah. Telegraphcq:

Continuous dataﬂow processing. In Proceedings of the 2003 ACM SIGMOD

International Conference on Management of Data, SIGMOD ’03, pages 668–

668, New York, NY, USA, 2003. ACM.

[CCM12]

J. Chauhan, S. A. Chowdhury, and D. Makaroff. Performance evaluation

of yahoo! s4: A ﬁrst look. In 2012 Seventh International Conference on P2P,

Parallel, Grid, Cloud and Internet Computing, pages 58–65, November 2012.

[CDK+14]

Ugur Cetintemel, Jiang Du, Tim Kraska, Samuel Madden, David Maier,

John Meehan, Andrew Pavlo, Michael Stonebraker, Erik Sutherland,

Nesime Tatbul, Kristin Tufte, Hao Wang, and Stanley Zdonik. S-store: A

streaming newsql system for big velocity applications. Proc. VLDB Endow.,

7(13):1633–1636, August 2014.

[CDW17]

Juan A. Colmenares, Reza Dorrigiv, and Daniel G. Waddington. Ingestion,

indexing and retrieval of high-velocity multidimensional sensor data on

a single node. CoRR, abs/1707.00825, 2017.

[CEF+08]

Paris Carbone, Stephan Ewen, Gyula Fóra, Seif Haridi, Stefan Richter, and

Kostas Tzoumas. State management in apache ﬂink: Consistent stateful

distributed stream processing. Proc. VLDB Endow., 10(12):1718–1729, 2017-

08.

[Cen19a]

Oracle Help Center.

ConcurrentSkipListSet.

https://docs.

oracle.com/javase/8/docs/api/java/util/concurrent/

References

129

ConcurrentSkipListSet.html, 2019.

[Cen19b]

Oracle Help Center. Cyclicbarrier. https://docs.oracle.com/

javase/7/docs/api/java/util/concurrent/CyclicBarrier.

html, 2019.

[CFMKP13] Raul Castro Fernandez, Matteo Migliavacca, Evangelia Kalyvianaki,

and Peter Pietzuch. Integrating scale out and fault tolerance in stream

processing using operator state management. In Proceedings of the 2013

ACM SIGMOD International Conference on Management of Data, SIGMOD

’13, pages 725–736, New York, NY, USA, 2013. ACM.

[CGB+14]

Badrish Chandramouli, Jonathan Goldstein, Mike Barnett, Robert DeLine,

Danyel Fisher, John C. Platt, James F. Terwilliger, and John Wernsing. Trill:

A high-performance incremental query processor for diverse analytics.

Proc. VLDB Endow., 8(4):401–412, December 2014.

[CGLPN16] Valeria Cardellini, Vincenzo Grassi, Francesco Lo Presti, and Matteo

Nardelli. Optimal operator placement for distributed stream processing

applications. In DEBS, 2016.

[CGLPN17] Valeria Cardellini, Vincenzo Grassi, Francesco Lo Presti, and Matteo

Nardelli. Optimal operator replication and placement for distributed

stream processing systems. In SIGMETRICS Perform. Eval. Rev., March

2017.

[CKE+15]

Paris Carbone, Asterios Katsifodimos, Stephan Ewen, Volker Markl, Seif

Haridi, and Kostas Tzoumas. Apache ﬂink: Stream and batch processing

in a single engine. Bulletin of the IEEE Computer Society Technical Committee

on Data Engineering, 36(4), 2015.

[CNL16]

V. Cardellini, M. Nardelli, and D. Luzi. Elastic stateful stream processing

in storm. In 2016 International Conference on High Performance Computing

Simulation (HPCS), pages 583–590, July 2016.

[Cof08]

Neil Coffey.

Classmexer agent.

http://www.javamex.com/

classmexer/, 2008.

References

130

[CRA09]

Paul M. Carpenter, Alex Ramirez, and Eduard Ayguade. Mapping stream

programs onto heterogeneous multiprocessor systems. In Proceedings of

the 2009 International Conference on Compilers, Architecture, and Synthesis

for Embedded Systems, CASES ’09, pages 57–66, New York, NY, USA, 2009.

ACM.

[CXT+15]

Zhenhua Chen, Jielong Xu, Jian Tang, Kevin Kwiat, and Charles Kamhoua.

G-Storm: GPU-enabled high-throughput online data processing in Storm.

In 2015 IEEE International Conference on Big Data (Big Data), pages 307–312.

IEEE, 2015.

[DFHP04]

David Detlefs, Christine Flood, Steve Heller, and Tony Printezis. Garbage-

ﬁrst Garbage Collection. In ISMM, pages 37–48, New York, NY, USA,

2004. ACM.

[DZSS14]

Tathagata Das, Yuan Zhong, Ion Stoica, and Scott Shenker. Adaptive

stream processing using dynamic batch sizing. In Proceedings of the ACM

Symposium on Cloud Computing, SOCC ’14, pages 16:1–16:13, New York,

NY, USA, 2014. ACM.

[FA15]

Jose M. Faleiro and Daniel J. Abadi. Rethinking serializable multiversion

concurrency control. Proc. VLDB Endow., 8(11):1190–1201, July 2015.

[FKBS11]

Sardar M. Farhad, Yousun Ko, Bernd Burgstaller, and Bernhard Scholz.

Orchestration by approximation: Mapping stream programs onto

multicore architectures.

In Proceedings of the Sixteenth International

Conference on Architectural Support for Programming Languages and Operating

Systems, ASPLOS XVI, pages 357–368, New York, NY, USA, 2011. ACM.

[FTA14]

Jose M. Faleiro, Alexander Thomson, and Daniel J. Abadi. Lazy evaluation

of transactions in database systems.

In Proceedings of the 2014 ACM

SIGMOD International Conference on Management of Data, SIGMOD ’14,

pages 15–26, New York, NY, USA, 2014. ACM.

[G+03]

STREAM Group et al. Stream: The stanford stream data manager.

Technical report, Stanford InfoLab, 2003.

References

131

[GARH14]

Jana Giceva, Gustavo Alonso, Timothy Roscoe, and Tim Harris.

Deployment of query plans on multicores. Proc. VLDB Endow., 8(3):233–

244, November 2014.

[GAW+08]

Bugra Gedik, Henrique Andrade, Kun-Lung Wu, Philip S Yu, and

Myungcheol Doo. Spade: the system s declarative stream processing

engine. In Proceedings of the 2008 ACM SIGMOD international conference on

Management of data, pages 1123–1134. ACM, 2008.

[GBY09]

Bu ˘gra Gedik, Rajesh R. Bordawekar, and Philip S. Yu. Celljoin: A parallel

stream join operator for the cell processor. The VLDB Journal, 18(2):501–

519, April 2009.

[GH]

Olivier Goldschmidt and Dorit S. Hochbaum. A Polynomial Algorithm

for the k-Cut Problem for Fixed k. Mathematics of Operations Research.

[Gho13]

Pranab Ghosh. Fraud-detection. https://pkghosh.wordpress.

com/2013/10/21/real-time-fraud-detection-with-

sequence-mining/, 2013.

[GNPT15]

V. Gulisano, Y. Nikolakopoulos, M. Papatriantaﬁlou, and P. Tsigas.

Scalejoin: A deterministic, disjoint-parallel and skew-resilient stream

join. In 2015 IEEE International Conference on Big Data (Big Data), pages

144–153, October 2015.

[Gra92]

Jim Gray. Benchmark Handbook: For Database and Transaction Processing

Systems. Morgan Kaufmann Publishers Inc., San Francisco, CA, USA,

1992.

[GSHW14]

B. Gedik, S. Schneider, M. Hirzel, and K. Wu. Elastic scaling for data

stream processing. IEEE Transactions on Parallel and Distributed Systems,

25(6):1447–1463, June 2014.

[GSS15]

Javad Ghaderi, Sanjay Shakkottai, and Rayadurgam Srikant. Scheduling

storms and streams in the cloud.

In Proceedings of the 2015 ACM

SIGMETRICS International Conference on Measurement and Modeling of

Computer Systems, SIGMETRICS ’15, pages 439–440, New York, NY, USA,

2015. ACM.

References

132

[HCW+10] Amir H. Hormati, Yoonseo Choi, Mark Woh, Manjunath Kudlur, Rodric

Rabbah, Trevor Mudge, and Scott Mahlke. Macross: Macro-simdization

of streaming applications. In Proceedings of the Fifteenth Edition of ASPLOS

on Architectural Support for Programming Languages and Operating Systems,

ASPLOS XV, pages 285–296, New York, NY, USA, 2010. ACM.

[HJHF14]

Thomas Heinze, Zbigniew Jerzak, Gregor Hackenbroich, and Christof

Fetzer.

Latency-aware elastic scaling for distributed data stream

processing systems. In Proceedings of the 8th ACM International Conference

on Distributed Event-Based Systems, DEBS ’14, pages 13–22, New York, NY,

USA, 2014. ACM.

[HPE18]

Hp proliant dl980 g7 server with hp prema architecture technical

overview,

https://community.hpe.com/hpeb/attachments/

hpeb/itrc-264/106801/1/363896.pdf, 2018.

[HSS+03]

Martin Hirzel, Robert Soulé, Scott Schneider, Bu ˘gra Gedik, and Robert

Grimm. A catalog of stream processing optimizations. ACM Comput.

Surv., 46(4):46:1–46:34, 2014-03.

[HWBR09] Andrei Hagiescu, Weng-Fai Wong, David F Bacon, and Rodric Rabbah. A

computing origami: folding streams in FPGAs. In 2009 46th ACM/IEEE

Design Automation Conference, pages 282–287. IEEE, 2009.

[IHBZ10]

C. Iancu, S. Hofmeyr, F. Blagojevi´c, and Y. Zheng. Oversubscription on

multicore processors. In 2010 IEEE International Symposium on Parallel

Distributed Processing (IPDPS), pages 1–11, April 2010.

[int18]

Intel memory latency checker, https://software.intel.com/

articles/intelr-memory-latency-checker, 2018.

[Int19]

Intel.

Intel 64 and IA-32 Architectures optimization Reference

Manual.

http://www.intel.sg/content/dam/www/public/

us/en/documents/manuals/64-ia-32-architectures-

optimization-manual.pdf, 2019.

[iot19]

Number of connected iot devices will surge to 125 billion by 2030, ihs

markit says. https://technology.ihs.com/596542/number-of-

References

133

connected-iot-devices-will-surge-to-125-billion-by-

2030-ihs-markit-says, 2019.

[JAA+06]

Navendu Jain, Lisa Amini, Henrique Andrade, Richard King, Yoonho

Park, Philippe Selo, and Chitra Venkatramani. Design, implementation,

and evaluation of the linear road bnchmark on the stream processing

core. In Proceedings of the 2006 ACM SIGMOD International Conference on

Management of Data, SIGMOD ’06, pages 431–442, New York, NY, USA,

2006. ACM.

[JHL06]

N. D. E. Jerger, E. L. Hill, and M. H. Lipasti. Friendly ﬁre: understanding

the effects of multiprocessor prefetches.

In 2006 IEEE International

Symposium on Performance Analysis of Systems and Software, pages 177–

188, March 2006.

[KBF+15]

Sanjeev Kulkarni, Nikunj Bhagat, Maosong Fu, Vikas Kedigehalli,

Christopher Kellogg, Sailesh Mittal, Jignesh M Patel, Karthik Ramasamy,

and Siddarth Taneja.

Twitter heron: Stream processing at scale.

In Proceedings of the 2015 ACM SIGMOD International Conference on

Management of Data, pages 239–250. ACM, 2015.

[KCDP16]

C. Kritikakis, G. Chrysos, A. Dollas, and D. N. Pnevmatikatos. An fpga-

based high-throughput stream join architecture. In 2016 26th International

Conference on Field Programmable Logic and Applications (FPL), pages 1–4,

August 2016.

[Kha09]

Khandekar, Rohit and Hildrum, Kirsten and Parekh, Sujay and Rajan,

Deepak and Wolf, Joel and Wu, Kun-Lung and Andrade, Henrique and

Gedik, Bu ˘gra. Cola: Optimizing stream processing applications via graph

partitioning. In Middleware, 2009.

[KLC08]

Nikos R. Katsipoulakis, Alexandros Labrinidis, and Panos K. Chrysanthis.

A holistic view of stream partitioning costs.

Proc. VLDB Endow.,

10(11):1286–1297, 2017-08.

[KM08]

Manjunath Kudlur and Scott Mahlke. Orchestrating the execution of

stream programs on multicore platforms. SIGPLAN Not., 43(6):114–124,

References

June 2008.

134

[KMTN18]

Igor E Kuralenok, Nikita Marshalkin, Artem Troﬁmov, and Boris Novikov.

An optimistic approach to handle out-of-order events within analytical

stream processing. In CEUR Workshop Proceedings, volume 2135, pages

22–29. RWTH Aahen University, 2018.

[KN11]

A. Kemper and T. Neumann. Hyper: A hybrid oltp olap main memory

database system based on virtual memory snapshots. In 2011 IEEE 27th

International Conference on Data Engineering, pages 195–206, April 2011.

[KRAVDS14] Karim Kanoun, Martino Ruggiero, David Atienza, and Mihaela Van

Der Schaar. Low power and scalable many-core architecture for big-

data stream computing. In 2014 IEEE Computer Society Annual Symposium

on VLSI, pages 468–473. IEEE, 2014.

[KWCF+16] Alexandros Koliousis, Matthias Weidlich, Raul Castro Fernandez,

Alexander L. Wolf, Paolo Costa, and Peter Pietzuch. Saber: Window-based

hybrid stream processing for heterogeneous architectures. In Proceedings

of the 2016 International Conference on Management of Data, SIGMOD ’16,

pages 555–569, New York, NY, USA, 2016. ACM.

[LBKN14]

Viktor Leis, Peter Boncz, Alfons Kemper, and Thomas Neumann. Morsel-

driven parallelism: A numa-aware query evaluation framework for the

many-core age. In Proceedings of the 2014 ACM SIGMOD International

Conference on Management of Data, SIGMOD ’14, pages 743–754, New York,

NY, USA, 2014. ACM.

[LC99]

Devroye Luc and Zamor-Cura Carlos. On the complexity of branch-and

bound search for random trees. Random Struct. Algorithms, 1999.

[LES+18]

Gyewon Lee, Jeongyoon Eo, Jangho Seo, Taegeon Um, and Byung-Gon

Chun. High-performance stateful stream processing on solid-state drives.

In Proceedings of the 9th Asia-Paciﬁc Workshop on Systems, APSys ’18, pages

9:1–9:7, New York, NY, USA, 2018. ACM.

[LKV12]

Jaekyu Lee, Hyesoon Kim, and Richard Vuduc. When prefetching works,

when it doesn’t, and why. ACM Transactions on Architecture and Code

References

135

Optimization (TACO), 9(1):2, 2012.

[LOWY15] Qian Lin, Beng Chin Ooi, Zhengkui Wang, and Cui Yu.

Scalable

distributed stream join processing.

In Proceedings of the 2015 ACM

SIGMOD International Conference on Management of Data, SIGMOD ’15,

pages 811–825, New York, NY, USA, 2015. ACM.

[LPM+13]

Yinan Li, Ippokratis Pandis, Rene Mueller, Vijayshankar Raman, and

Guy M Lohman. Numa-aware algorithms: the case of data shufﬂing. In

CIDR, 2013.

[LXTW18]

Teng Li, Zhiyuan Xu, Jian Tang, and Yanzhi Wang. Model-free control

for distributed stream data processing using deep reinforcement learning.

Proc. VLDB Endow., 11(6):705–718, February 2018.

[Mad04]

Samuel Madden.

Intel lab data.

http://db.csail.mit.edu/

labdata/labdata.html, 2004.

[MBM09]

Marcelo R. Mendes, Pedro Bizarro, and Paulo Marques. Performance

evaluation and benchmarking. chapter A Performance Study of Event

Processing Systems, pages 221–236. Springer-Verlag, Berlin, Heidelberg,

2009.

[MEB88]

S. Majumdar, D. L. Eager, and R. B. Bunt. Scheduling in multiprogrammed

parallel systems. In Proceedings of the 1988 ACM SIGMETRICS Conference

on Measurement and Modeling of Computer Systems, SIGMETRICS ’88, pages

104–113, New York, NY, USA, 1988. ACM.

[MF17]

Bruno Luigi Martino and Memmo Federici.

Sgi (silicon graphics

international corp) uv2000: the porting of gforc system. In The Golden

Age of Cataclysmic Variables and Related Objects-III, volume 255, page 076.

SISSA Medialab, 2017.

[MJP+19]

Hongyu Miao, Myeongjae Jeon, Gennady Pekhimenko, Kathryn S

McKinley, and Felix Xiaozhu Lin. Streambox-hbm: Stream analytics

on high bandwidth hybrid memory. arXiv preprint arXiv:1901.01328, 2019.

References

136

[MJSS16]

David R. Morrison, Sheldon H. Jacobson, Jason J. Sauppe, and Edward C.

Sewell. Branch-and-bound algorithms: A survey of recent advances in

searching, branching, and pruning. Discrete Optimization, 19:79–102, 2016.

[MM09]

Yuan Mei and Samuel Madden. Zstream: A cost-based query processor

for adaptively detecting composite events. In Proceedings of the 2009 ACM

SIGMOD International Conference on Management of Data, SIGMOD ’09,

pages 193–206, New York, NY, USA, 2009. ACM.

[MPJ+17]

Hongyu Miao, Heejin Park, Myeongjae Jeon, Gennady Pekhimenko,

Kathryn S. McKinley, and Felix Xiaozhu Lin. Streambox: Modern stream

processing on a multicore machine. In Proceedings of the 2017 USENIX

Conference on Usenix Annual Technical Conference, USENIX ATC ’17, pages

617–629, Berkeley, CA, USA, 2017. USENIX Association.

[MTA09]

Rene Mueller, Jens Teubner, and Gustavo Alonso. Streams on wires: a

query compiler for FPGAs. Proceedings of the VLDB Endowment, 2(1):229–

240, 2009.

[MTZ+15]

John Meehan, Nesime Tatbul, Stan Zdonik, Cansu Aslantas, Ugur

Cetintemel, Jiang Du, Tim Kraska, Samuel Madden, David Maier, Andrew

Pavlo, Michael Stonebraker, Kristin Tufte, and Hao Wang. S-store:

Streaming meets transaction processing. Proc. VLDB Endow., 8(13):2134–

2145, September 2015.

[NL16]

Dong Nguyen and Jongeun Lee. Communication-aware mapping of

stream graphs for multi-gpu platforms.

In Proceedings of the 2016

International Symposium on Code Generation and Optimization, CGO ’16,

pages 94–104, New York, NY, USA, 2016. ACM.

[NPP+17]

Shadi A Noghabi, Kartik Paramasivam, Yi Pan, Navina Ramesh, Jon

Bringhurst, Indranil Gupta, and Roy H Campbell. Samza: stateful

scalable stream processing at linkedin. Proceedings of the VLDB Endowment,

10(12):1634–1645, 2017.

[NRNK10]

Leonardo Neumeyer, Bruce Robbins, Anish Nair, and Anand Kesari.

S4: Distributed stream computing platform. In 2010 IEEE International

References

137

Conference on Data Mining Workshops, pages 170–177. IEEE, 2010.

[NSJ13]

Mohammadreza Najaﬁ, Mohammad Sadoghi, and Hans-Arno Jacobsen.

Flexible query processor on FPGAs. Proceedings of the VLDB Endowment,

6(12):1310–1313, 2013.

[NSJ16]

Mohammadreza Najaﬁ, Mohammad Sadoghi, and Hans-Arno Jacobsen.

Splitjoin: A scalable, low-latency stream join architecture with adjustable

ordering precision. In 2016 USENIX Annual Technical Conference (USENIX

ATC 16), pages 493–505, Denver, CO, 2016. USENIX Association.

[PBS15]

Marcus Pinnecke, David Broneske, and Gunter Saake. Toward GPU

Accelerated Data Stream Processing. In GvD, pages 78–83, 2015.

[PC19]

Peter Jonsson Stephen Carson Richard Möller Peter Jonsson Stephen

Carson Per Lindberg Kati Öhman Ida Sorlie Ricardo Queirós Frank

Muller Lisa Englund Mats Arvedson Anders Carlsson Fredrik Jejdling

Patrik Cerwall, Anette Lundvall. Ericsson mobility report november

2018,

https://www.ericsson.com/assets/local/mobility-

report/documents/2018/ericsson-mobility-report-

november-2018.pdf, 2019.

[PCZ12]

Andrew Pavlo, Carlo Curino, and Stanley Zdonik.

Skew-aware

automatic database partitioning in shared-nothing, parallel oltp systems.

In Proceedings of the 2012 ACM SIGMOD International Conference on

Management of Data, pages 61–72. ACM, 2012.

[Pea11]

Achille Peternier and et al. Overseer: low-level hardware monitoring and

management for java. In PPPJ, 2011.

[PGJ+18]

Gennady Pekhimenko, Chuanxiong Guo, Myeongjae Jeon, Peng Huang,

and Lidong Zhou. Tersecades: Efﬁcient data compression in stream

processing. In Proceedings of the 2018 USENIX Conference on Usenix Annual

Technical Conference, USENIX ATC ’18, pages 307–320, Berkeley, CA, USA,

2018. USENIX Association.

[PHH+15]

Boyang Peng, Mohammad Hosseini, Zhihao Hong, Reza Farivar, and Roy

Campbell. R-storm: Resource-aware scheduling in storm. In Proceedings

References

138

of the 16th Annual Middleware Conference, Middleware ’15, pages 149–161,

New York, NY, USA, 2015. ACM.

[pl18]

peter lawrey.

Openhft, https://github.com/OpenHFT/Java-

Thread-Affinity, 2018.

[PLS+06]

P. Pietzuch, J. Ledlie, J. Shneidman, M. Roussopoulos, M. Welsh, and

M. Seltzer. Network-aware operator placement for stream-processing

systems. In 22nd International Conference on Data Engineering (ICDE’06),

pages 49–49, April 2006.

[PLTA03]

D. Porobic, E. Liarou, P. Tözün, and A. Ailamaki. Atrapos: Adaptive

transaction processing on hardware islands. In 2014 IEEE 30th International

Conference on Data Engineering, pages 688–699, 2014-03.

[PPB+12]

Danica Porobic, Ippokratis Pandis, Miguel Branco, Pınar Tozun, and

Anastasia Ailamaki. Oltp on hardware islands. Proc. VLDB Endow.,

5(11):1447–1458, July 2012.

[PSK18]

G. Philipp, B. Stephan, and S. Kai-Uwe. An nvm-aware storage layout for

analytical workloads. In 2018 IEEE 34th International Conference on Data

Engineering Workshops (ICDEW), pages 110–115, April 2018.

[PSM+16]

Iraklis Psaroudakis, Tobias Scheuer, Norman May, Abdelkader Sellami,

and Anastasia Ailamaki. Adaptive numa-aware data placement and task

scheduling for analytical workloads in main-memory column-stores. Proc.

VLDB Endow., 10(2):37–48, October 2016.

[Pug89]

William Pugh. Skip lists: A probabilistic alternative to balanced trees. In

Workshop on Algorithms and Data Structures, pages 437–449. Springer, 1989.

[RDS+04]

Elke A Rundensteiner, Luping Ding, Timothy Sutherland, Yali Zhu,

Brad Pielech, and Nishant Mehta. Cape: Continuous query engine

with heterogeneous-grained adaptivity.

In Proceedings of the Thirtieth

international conference on Very large data bases-Volume 30, pages 1353–1356.

VLDB Endowment, 2004.

References

139

[REG11]

Ella Rabinovich, Opher Etzion, and Avigdor Gal. Pattern rewriting

framework for event processing optimization. In Proceedings of the 5th

ACM International Conference on Distributed Event-based System, DEBS ’11,

pages 101–112, New York, NY, USA, 2011. ACM.

[RTA14]

Kun Ren, Alexander Thomson, and Daniel J Abadi. An evaluation of

the advantages and disadvantages of deterministic database systems.

Proceedings of the VLDB Endowment, 7(10):821–832, 2014.

[SAG+10]

Scott Schneider, Henrique Andrade, Bu ˇgra Gedik, Kun-Lung Wu, and

Dimitrios S. Nikolopoulos. Evaluation of streaming aggregation on

parallel hardware architectures.

In Proceedings of the Fourth ACM

International Conference on Distributed Event-Based Systems, DEBS ’10, pages

248–257, New York, NY, USA, 2010. ACM.

[Sat19]

Kai-Uwe Sattler.

Transactional stream processing on non-volatile

memory,https://www.tu-ilmenau.de/dbis/research/

active-projects/transactional-stream-processing/,

2019.

[SC]

Bobby Evans Reza Farivar Tom Graves Mark Holderbaugh Zhuo Liu

Kyle Nusbaum Kishorkumar Patil Boyang Jerry Peng Paul Poulosky

Sanket Chintapalli, Derek Dagit. Benchmarking Streaming Computation

Engines at Yahoo!

https://yahooeng.tumblr.com/post/

135321837876/benchmarking-streaming-computation-

engines-at.

[SC14]

Matthias J Sax and Malu Castellanos. Building a Transparent Batching

Layer for Storm. 2014.

[ScZ05]

Michael Stonebraker, U ˇgur Çetintemel, and Stan Zdonik.

The 8

requirements of real-time stream processing. SIGMOD Rec., 34(4):42–

47, December 2005.

[SLSV95]

Dennis Shasha, Francois Llirbat, Eric Simon, and Patrick Valduriez.

Transaction chopping: Algorithms and performance studies. ACM

Transactions on Database Systems (TODS), 20(3):325–363, 1995.

References

140

[SMA+]

Michael Stonebraker, Samuel Madden, Daniel

J. Abadi, Stavros

Harizopoulos, Nabil Hachem, and Pat Helland.

The end of an

architectural era: (it’s time for a complete rewrite). In Proc VLDB Endow.

2007.

[SP14]

Shriram Sridharan and Jignesh M. Patel. Proﬁling R on a Contemporary

Processor. Proc. VLDB Endow., 2014.

[TA10]

Alexander Thomson and Daniel J. Abadi. The case for determinism in

database systems. Proc. VLDB Endow., 3(1-2):70–80, September 2010.

[TG13]

Yuzhe Tang and Bugra Gedik. Autopipelining for data stream processing.

IEEE Transactions on Parallel and Distributed Systems, 24(12):2344–2354,

2013.

[TMSF03]

Peter A. Tucker, David Maier, Tim Sheard, and Leonidas Fegaras.

Exploiting punctuation semantics in continuous data streams. IEEE Trans.

on Knowl. and Data Eng., 15(3):555–568, 2003-03.

[Tra18]

Data Artisans Streaming Ledger Serializable ACID Transactions

on Streaming Data, https://www.da-platform.com/streaming-

ledger. 2018.

[TSM18]

Quoc-Cuong To, Juan Soto, and Volker Markl. A survey of state

management in big data processing systems. The VLDB Journal, 27(6):847–

872, December 2018.

[TTS+14]

Ankit Toshniwal, Siddarth Taneja, Amit Shukla, Karthik Ramasamy,

Jignesh M Patel, Sanjeev Kulkarni, Jason Jackson, Krishna Gade, Maosong

Fu, Jake Donham, et al. Storm@ twitter. In Proceedings of the 2014 ACM

SIGMOD international conference on Management of data, pages 147–156.

ACM, 2014.

[TZ05]

Jun Tan and Ming Zhong. An online bidding system (obs) under price

match mechanism for commercial procurement. Applied Mechanics and

Materials, 556-562:6540–6543, 2014-05.

References

141

[VN02]

Stratis D. Viglas and Jeffrey F. Naughton. Rate-based query optimization

for streaming information sources.

In Proceedings of the 2002 ACM

SIGMOD International Conference on Management of Data, SIGMOD ’02,

pages 37–48, New York, NY, USA, 2002. ACM.

[VSS11]

Uri Verner, Assaf Schuster, and Mark Silberstein. Processing data streams

with hard real-time constraints on heterogeneous systems. In Proceedings

of the International Conference on Supercomputing, ICS ’11, pages 120–129,

New York, NY, USA, 2011. ACM.

[VSSM12]

Uri Verner, Assaf Schuster, Mark Silberstein, and Avi Mendelson.

Scheduling processing of real-time data streams on heterogeneous multi-

gpu systems. In Proceedings of the 5th Annual International Systems and

Storage Conference, SYSTOR ’12, pages 8:1–8:12, New York, NY, USA, 2012.

ACM.

[Vtu18]

Intel VTune Ampliﬁer.

https://software.intel.com/en-us/

intel-vtune-amplifier-xe, 2018.

[WAL+03]

Yingjun Wu, Joy Arulraj, Jiexi Lin, Ran Xian, and Andrew Pavlo. An

empirical evaluation of in-memory multi-version concurrency control.

Proc. VLDB Endow., 10(7):781–792, 2017-03.

[WCT16]

Yingjun Wu, Chee-Yong Chan, and Kian-Lee Tan. Transaction healing:

Scaling optimistic concurrency control on multicores. In Proceedings of

the 2016 International Conference on Management of Data, pages 1689–1704.

ACM, 2016.

[WLCH18]

Z. Wen, X. Liu, H. Cao, and B. He. Rtsi: An index structure for multi-

modal real-time search on live audio streaming services. In 2018 IEEE

34th International Conference on Data Engineering (ICDE), pages 1495–1506,

April 2018.

[WMC+16] Zhaoguo Wang, Shuai Mu, Yang Cui, Han Yi, Haibo Chen, and Jinyang

Li. Scaling multicore databases via constrained parallel execution. In

Proceedings of the 2016 International Conference on Management of Data,

SIGMOD ’16, pages 1643–1658, New York, NY, USA, 2016. ACM.

References

142

[WRE11]

Di Wang, Elke A. Rundensteiner, and Richard T. Ellison, III. Active

complex event processing over event streams. Proc. VLDB Endow.,

4(10):634–645, July 2011.

[WT15]

Y. Wu and K. Tan. Chronostream: Elastic stateful stream computation in

the cloud. In 2015 IEEE 31st International Conference on Data Engineering,

pages 723–734, April 2015.

[XCTS14]

Jielong Xu, Zhenhua Chen, Jian Tang, and Sen Su. T-storm: Trafﬁc-

aware online scheduling in storm. In Proceedings of the 2014 IEEE 34th

International Conference on Distributed Computing Systems, ICDCS ’14, pages

535–544, Washington, DC, USA, 2014. IEEE Computer Society.

[YBP+14]

Xiangyao Yu, George Bezerra, Andrew Pavlo, Srinivas Devadas, and

Michael Stonebraker. Staring into the abyss: An evaluation of concurrency

control with one thousand cores. Proc. VLDB Endow., 8(3):209–220,

November 2014.

[ZCC17]

Yunhao Zhang, Rong Chen, and Haibo Chen. Sub-millisecond stateful

stream querying over fast-evolving linked data. In Proceedings of the 26th

Symposium on Operating Systems Principles, SOSP ’17, pages 614–630, New

York, NY, USA, 2017. ACM.

[ZDI14]

Haopeng Zhang, Yanlei Diao, and Neil Immerman. On complexity

and optimization of expensive queries in complex event processing.

In Proceedings of the 2014 ACM SIGMOD International Conference on

Management of Data, SIGMOD ’14, pages 217–228, New York, NY, USA,

2014. ACM.

[ZHD+04]

S. Zhang, B. He, D. Dahlmeier, A. C. Zhou, and T. Heinze. Revisiting the

design of data stream processing systems on multi-core processors. In

2017 IEEE 33rd International Conference on Data Engineering (ICDE), pages

659–670. IEEE, 2017-04.

[ZHH15]

Kai Zhang, Jiayu Hu, and Bei Hua. A holistic approach to build real-time

stream processing system with gpu. Journal of Parallel and Distributed

Computing, 83:44–57, 2015.

References

143

[ZHZH19]

Shuhao Zhang,

Jiong He, Amelie Chi Zhou, and Bingsheng He.

Briskstream: Scaling Data Stream Processing on Multicore Architectures.

In Proceedings of the 2019 International Conference on Management of Data,

SIGMOD ’19, Amsterdam, Netherlands, 2019. ACM.

[ZM11]

Y. Zhang and F. Mueller. Gstream: A general-purpose data streaming

framework on gpu clusters. In 2011 International Conference on Parallel

Processing, pages 245–254, September 2011.

[ZMK+01]

Steffen Zeuch, Bonaventura Del Monte, Jeyhun Karimov, Clemens Lutz,

Manuel Renz, Jonas Traub, Sebastian Breß, Tilmann Rabl, and Volker

Markl. Analyzing efﬁcient stream processing on modern hardware.

Proceedings of the VLDB Endowment, 12(5):516–530, 2019-01.

[ZVDH17]

Shuhao Zhang, Hoang Tam Vo, Daniel Dahlmeier, and Bingsheng He.

Multi-query optimization for complex event processing in sap esp. In

2017 IEEE 33rd International Conference on Data Engineering (ICDE), pages

1213–1224. IEEE, 2017.

[ZWZH19]

Shuhao Zhang, Yingjun Wu, Feng Zhang, and Bingsheng He. Towards

concurrent stateful stream processing on multicore processors (technical

report). arXiv preprint arXiv:1904.03800, 2019.

[ZZXM09]

Yu Zheng, Lizhu Zhang, Xing Xie, and Wei-Ying Ma. Mining interesting

locations and travel sequences from gps trajectories. In Proceedings of the

18th International Conference on World Wide Web, WWW ’09, pages 791–800,

New York, NY, USA, 2009. ACM.

