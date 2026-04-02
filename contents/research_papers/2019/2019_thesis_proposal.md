SCALING DATA STREAM PROCESSING ON
MULTICORE ARCHITECTURES

Bachlor of Engineering (Computer Engineering), Nanyang Technological University

SHUHAO ZHANG

THESIS PROPOSAL

FOR THE DEGREE OF DOCTOR OF PHILOSOPHY

SCHOOL OF COMPUTING

NATIONAL UNIVERSITY OF SINGAPORE

2018

Supervisor:

Associate Professor Bingsheng He

Abstract

Data stream processing system (DSPS) is a software that allows users to

run their streaming applications which continuously process data streams

in real-time. Witnessing the emergence of modern commodity machines

with massively parallel processors, researchers and practitioners ﬁnd shared-

memory multicore architectures an attractive platform for DSPSs. However,

fully exploiting the computation power delivered by multicore architectures

can be challenging, and scaling DSPSs on modern multicore architectures

remains to be notoriously challenging. This is because processing massive

amounts of data can confront several performance bottlenecks inherited

from different DSPS components, which altogether put a strict constraint on

the scalability of the DSPSs on multicore architectures.

In this thesis proposal, we describe the evaluation, design and

implementation of DSPSs aiming at achieving high performance for stream

processing on multicore architectures. We also discuss our ongoing work

towards a complete thesis. First, as modern DSPSs are mainly designed and

optimized for scaling-out using a cluster of low-end servers, we present a

comprehensive performance study of popular DSPSs (e.g., Apache Storm,

Flink) on multicore architectures and try to identify whether the current

implementation matches with modern hardware (e.g., non-uniform memory

access (NUMA), multicore). Second, our detailed proﬁling study shows

that existing DSPSs underutilized the underlying complex hardware micro-

architecture and especially show poor scalability due to the unmanaged

resource competition and unaware of NUMA effect. We hence present

our efforts on a complete revolution in designing next-generation stream

processing platform, namely BriskStream, speciﬁcally optimized for shared-

memory multicore architectures. A novel NUMA-aware execution plan

optimization scheme, namely Relative-Location-Aware-Scheduling (RLAS)

iii

iv

is proposed to address the NUMA effect for stream computation. Third,

DSPSs with transactional state management relives users from managing

state consistency by themselves. However, scaling stream processing with

transactional state management on modern multicores is challenging. On the

one hand, DSPSs need to exploit parallelism aggressively to achieve both low

latency and high throughput. On the other hand, higher parallelism leads

to higher chances of violating transactional state consistency, consequently

yielding incorrect results. As a future work, we are designing T-Stream,

a highly scalable DSPS with built-in transactional state management.

The initial results of both microbenchmark and real use case workloads

comparing four existing schemes have conﬁrmed the superiority of our

mechanisms and designs.

Contents

List of Figures

List of Tables

1

Introduction

2 Background

2.1 Multi-Socket Multi-core Processors

2.2 Data Stream Processing Systems

2.3 Transactional State Management of DSPSs

3 Literature Review

3.1 Data Stream Processing Systems

3.2 Performance Evaluation for DSPSs

3.3 Stream Processing Optimizations

3.3.1 Batching

3.3.2 Operator Placement and Parallelism

3.4 State Management in DSPSs

3.4.1 Concurrency Control

3.4.2 Multicore Databases

4 Revisiting the Design of Data Stream Processing Systems on Multi-Core

Processors

4.1

Introduction

4.2 Preliminaries and Background

4.2.1 Multi-Socket Multi-core Processors

4.2.2 Data Stream Processing Systems

4.3 Methodology

4.3.1 Evaluation Goals

4.3.2 Proﬁling Tools

ix

xi

1

5

5

7

10

13

13

14

15

15

15

17

17

18

19

19

22

23

23

25

25

26

v

Contents

4.3.3 Micro Benchmark

4.4 Performance Evaluation

4.5 Study the impact of common designs

4.5.1 Execution time breakdown

4.5.2 Massively parallel execution model

4.5.3 Message passing and stream partitioning

4.5.4

JVM Runtime Environment

4.6 Towards more efﬁcient DSP systems

4.6.1 Non-blocking Tuple Batching

4.6.2 NUMA-Aware Executor Placement

4.6.3 Put It All Together

4.7 Summary

5 BriskStream:

Scaling Data Stream Processing on Shared-Memory

Multicore Architectures

5.1

Introduction

5.2 Background

5.2.1 Modern Scale-up Servers

5.2.2 DSPS Overview

5.3 Execution Plan Optimization

5.3.1 The Performance Model

5.3.2 Problem Formulation

5.4 Optimization Algorithm Design

5.5 Algorithm Details

5.5.1 Discussion

5.5.2 Extension with other optimization techniques

5.6 BriskStream System

5.6.1

Improving Execution Efﬁciency

5.6.2

Improving Communication Efﬁciency

5.6.3 Discussion on Elasticity

5.7

Implementation details

5.8 Evaluation

5.8.1 Experimental Setup

vi

29

32

34

35

36

38

40

42

42

44

47

47

49

49

51

51

52

53

54

59

60

65

67

69

70

70

71

71

72

74

74

Contents

5.8.2 Performance Model Evaluation

5.8.3 Evaluation of Execution Efﬁciency

5.8.4 Evaluation of RLAS algorithms

5.8.5

Factor Analysis

5.9 Summary

6 Future Works

7 Conclusion

7.1 Selected Publications

7.2 Other Publications

vii

77

79

83

90

90

93

95

96

97

List of Figures

2.1 Pipeline execution components of processor: (left) various stalls caused in

the pipeline, (middle) pipelines interactions with cache and memory systems

and (right) the interactions among the cache, TLB, and memory systems.

2.2 NUMA topology and peak bandwidth of our four-sockets server.

2.3

Interconnect topology for our eight-sockets servers.

2.4 Message passing mechanism.

2.5 Word-count execution graph.

2.6 Hospital Infection Control (HIC) application.

4.1 Pipeline execution components of processor: (left) various stalls caused in

the pipeline, (middle) pipelines interactions with cache and memory systems

and (right) the interactions among the cache, TLB, and memory systems.

4.2 NUMA topology and peak bandwidth of our server.

4.3 Message passing mechanism.

4.4 Word-count execution graph.

4.5 Topologies of seven applications in our benchmark.

4.6 Performance evaluation results on Storm and Flink.

4.7 Execution time breakdown.

4.8 Front-end stall breakdown.

6

6

6

9

9

10

22

22

26

26

30

34

35

36

4.9

Instruction footprint between two consecutive invocations of the same function. 37

4.10 Varing number of executors of Map-Matcher operator of TM when running

Storm with four CPU sockets.

4.11 Back-end stall breakdown.

4.12 Normalized throughput of tuple batching optimization.

4.13 Normalized latency of tuple batching optimization.

4.14 NUMA-aware executor placement.

4.15 Normalized throughput with all optimizations enabled.

40

41

45

45

47

48

ix

List of Figures

5.1

Interconnect topology for our servers.

5.2 Word Count (WC) as an example application.

5.3 CDF of proﬁled average execution cycles of different operators of WC.

5.4 RLAS Optimization example.

5.5 Placement optimization at runtime. Light colored rectangle represents a live

node that still violates resource constraints. Dark colored rectangle stands

for a solution node contains a valid plan.

5.6 Example job overview in BriskStream.

5.7 Topologies of other three applications in our benchmark.

5.8 Throughput speedup.

5.9 End-to-end latency of WC on different DSPSs.

5.10 Scalability evaluation.

5.11 Gaps to ideal.

5.12 Execution time breakdown.

5.13 Comparing with StreamBox.

5.14 RLAS w/ and w/o considering varying RMA cost.

5.15 Placement strategy comparison under the same replication conﬁguration.

5.16 CDF of random plans.

5.17 Communication pattern matrices of WC on two Servers.

5.18 A factor analysis for BriskStream. Changes are added left to right and are

cumulative.

x

52

53

58

61

64

73

74

79

80

81

82

82

84

85

86

88

89

90

List of Tables

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

27

28

28

33

39

55

75

76

78

78

80

86

89

xi

CHAPTER 1

Introduction

Data stream processing system (DSPS) is a software that allows users to run their

streaming applications which continuously process inﬁnite data streams in real-time.

Unlike conventional database management systems (DBMSs) that provide ACID

guarantees for relational data storage, retrieval, and mining, modern DSPSs are featured

in supporting continuous lower-latency analytics over real-time data streams. Due to its

unique characteristics, a large body of system research [FMKP13, WT, GSHW14, Gea15,

ﬂi, Sto, her] has focused on designing and implementing new DSPSs to to meet the

fast increasing and more and more diverging application demands. Arguably starting

from 2000’s, DSPSs have been investigated by a large number of research groups in the

database community [Aea03, Ce03, Ae05, NRNK10, Sto, her, ﬂi, Ze13, Sam, NRNK10],

and leading enterprises including SAP [ZVDH17], IBM [Je06], Google [ABB+13] and

Microsoft [CGB+15]. With the proliferation of high-rate streaming sources, numerous

streaming applications are deployed in real-world use cases [Tra18] that involves

continuously low-latency, complex analytics over massive data streams. This trend has

accelerated the development of next-generation performance-critical DSPSs.

Most existing DSPSs are designed and optimized for scaling out using a cluster of low-

end machines (e.g., [Sto, ﬂi, Xe14, Pea15, Ae13, Pe15]). In particular, substantial research

efforts have been devoted on providing mechanisms to handle the inherent challenges

from the distributed environment settings, such as dueling with network communication

overhead [Xe14, Ae13, PLS+06], fault-tolerance [WT, Ze13, FMKP13, CEF+17] and

elastic scaling [GSHW14, Hea14a]. Despite the successes achieved during the last

several decades, these DSPSs are now facing great challenges when supporting a wide

range of emerging time-critical applications, which generally require the underlying

1

Chapter 1. Introduction

2

DSPSs to achieve low end-to-end latency when processing huge volumes of data.

Any unpredictable latency spikes (e.g., in tcp/ip network) can cause serious issues in

those applications such as hospital infection-control monitoring and online abnormally

trajectory detection.

Witnessing the emergence of modern commodity machines with massively parallel

processors, researchers and practitioners ﬁnd shared-memory multicore architectures

an attractive alternative platform [ZHD+17, CDW17], and several in-memory single-

node DSPSs are recently proposed [Kea16, MPJ+17, ZHZH19b]. One of the key

beneﬁts of single-node DSPSs is the completely avoidance of network communication

latency among multi-node inside the DSPSs. In addition to that, several heavyweight

components, such as (de)serialization can be completely avoided, which both simplify

the system development and improve execution efﬁciency. Furthermore, optimizing

the performance of stream processing on a single-node is critical even in a distributed

conﬁguration for an obvious reason – it reduces the number of machines required to

achieve the same performance objective.

Thanks to the great achievements made in the hardware community, modern commodity

machines nowadays are equipped with massively parallel processors and larger memory

capacity and demonstrated superior performance for real-world applications [Aea13].

For example, recent scale-up servers can accommodate even hundreds of CPU cores

and multi-terabytes of memory [sgi] providing abundant computing resources and

emerging technologies such as Remote Direct Memory Access (RDMA) and 10Gb

Ethernet signiﬁcantly improve system ingress rate making I/O no longer a bottleneck in

many practical scenarios [MPJ+17, CDW17]. However, fully exploiting the computation

power delivered by multicore architectures can be challenging. On one hand, the on-chip

cache hierarchies that support large core counts are getting larger, deeper, and more

complex to utilize. Furthermore, as modern machines scale to multiple sockets, non-

uniform memory access (NUMA) becomes an important performance factor for data

management systems (e.g., [Le14, Le13]). On the other hand, little work has been done

on studying common design aspects of modern DSPSs on shared-memory multicore

architectures.

To fully understand the potential difﬁculties that may be confronted when building

Chapter 1. Introduction

3

modern multicore main-memory DSPSs, we study the performance bottlenecks inherited

from three common design aspects in different modern DSPSs. Then, we discuss a novel

execution plan optimization scheme addressing NUMA effect to improve scalability of

DSPSs on multicore architectures. After that, we discuss a new scalable design of shared

state management in DSPSs.

The discussion on the different aspects discussed above illustrate the challenges we

may confront in building a high performance DSPSs that can effectively utilize modern

multicore architectures. These aspects are tightly coupled with each other, and the

redesign of a single component can directly affect the effectiveness of others. Witnessing

these problems, in this thesis, we study the problem of building scalable multicore DSPSs

from a systematic perspective. In particular, we discuss the design and implementation

of two core components of DSPSs, including execution plan optimization and state

management. Throughout this thesis, we conduct comprehensive performance study

and propose novel mechanisms to address the issues identiﬁed above. In addition,

we also point out some future works in designing and implementing next-generation

multicore DSPSs.

The road map of the proposed thesis are listed as follows.

• Revisiting the Design of Data Stream Processing Systems on Multi-Core

Processors. We have revisited three common design aspects of modern DSP

systems on modern multi-socket multi-core architectures, including a) pipelined

processing with message passing, b) on-demand data parallelism, and c) JVM-

based implementation. Particularly, we conduct detailed proﬁling studies with

micro benchmark on Apache Strom and Flink. Our results show that those

designs have underutilized the scale-up architectures in these two key aspects:

a) The design of supporting both pipelined and data parallel processing results

in a very complex massively parallel execution model in DSP systems, which

causes high front-end stalls on a single CPU socket; b) The design of continuous

message passing mechanisms between operators severely limits the scalability

of DSP systems on multi-socket multi-core architectures. We further present two

optimizations to address those performance issues and demonstrate promising

performance improvements.

Chapter 1. Introduction

4

• BriskStream: Scaling Data Stream Processing on Shared-Memory Multicore

Architectures. We have introduced BriskStream, a new data stream

processing system with a new streaming execution plan optimization paradigm,

namely Relative-Location Aware Scheduling (RLAS). BriskStream scales stream

computation towards a hundred of cores under NUMA effect. The experiments

on eight-sockets machines conﬁrm that BriskStream signiﬁcantly outperforms

existing DSPSs up to an order of magnitude even without the tedious tuning

process. We hope our study on relative-location aware scheduling could shed

lights on other NUMA-aware execution plan optimization research.

• Scaling Stream Processing with Transactional State Management on

Multicores. As a future work, we are designing T-Stream with a new design for

scaling stream processing while providing transactional state management. In

order to take advantage of multicore architectures, T-Stream detaches the state

management from the streaming computation logic, and performs its internal

state maintenance asynchronously. By eliminating the expensive synchronization

primitives, T-Stream aggressively extracts parallelism opportunities by revealing

the operation dependencies at runtime. Our initial results show that T-Stream

achieves a 2x higher throughput on average over existing solutions with similar

or even smaller end-to-end processing latency.

The outline of this thesis proposal is listed as follows. We begin in Chapter 2 a

preliminary background information of DSPSs and multicore architectures we are

targeting at. We provide in Chapter 3 a comprehensive literature review of the state-

of-the-art mechanisms in the design and implementation of DSPSs. In Chapter 4, we

then provide a detailed evaluation of modern DSPSs on shared-memory multicore

architectures.

In Chapter 5, we present BriskStream with a novel NUMA-aware

execution plan optimization scheme. In Chapter 6, we discuss some ongoing works of

enhancing multicore DSPSs. We conclude this thesis proposal in Chapter 7.

CHAPTER 2

Background

In this section, we ﬁrst introduce the background of the multi-socket multi-core

processors. Then, we introduce three design aspects of two DSPSs we studied, namely

Apache Storm [Sto] and Flink [ﬂi]. After that, we discuss potential problems in modern

stateful stream processing.

2.1 Multi-Socket Multi-core Processors

Modern processors consist of multiple different hardware components with deep

execution pipelines, as shown in Figure 4.1. We also illustrate the stalls and the

interactions among pipelines and memory systems in the ﬁgure. The pipeline can

be divided into the front-end component and the back-end component [man].

The front-end is responsible for fetching instructions and decodes them into micro-

operations (µops). It feeds the next pipeline stages with a continuous stream of micro-

ops from the path that the program will most likely execute, with the help of the branch

prediction unit. Starting from Sandy Bridge micro-architecture, Intel introduces a special

component called Decoded ICache (D-ICache), which is essentially an accelerator of

the traditional front-end pipeline. D-ICache maintains up to 1.5k of decoded µops.

Future references to the same µops can be served by it without performing the fetch and

decode stages. D-ICache is continuously enhanced in terms of size and throughput in

the successor generations of Intel processors. Note that, every µops stored in D-ICache

is associated with its corresponding instruction in L1-ICache. An L1-ICache miss also

causes D-ICache to be invalidated.

The back-end is where the actual instruction execution happens.

It detects the

5

Chapter 2. Background

6

Figure 2.1: Pipeline execution components of processor: (left) various stalls caused in
the pipeline, (middle) pipelines interactions with cache and memory systems and (right)
the interactions among the cache, TLB, and memory systems.

Figure 2.2: NUMA topology and peak bandwidth of our four-sockets server.

(a) Server A (glue-less)

(b) Server B (glue-assisted)

Figure 2.3: Interconnect topology for our eight-sockets servers.

Instruction Fetch UnitsInstruction Length Decoder (ILD)Instruction Queue (IQ)Instruction DecodersITLB1.5k D-ICacheInstruction Decode Queue (IDQ)L2 CacheLLCRenamerRetirementDTLBL1-DCacheMemoryFront endBack endSchedulerExecution CoreITLB miss Stalls& L1-I cache miss stallsLCP StallsIQ full stallsILD StallsIDQ StallsDTLB miss Stalls& Data miss stallsL1-ICacheµops issuedµops dispatchedµops executedSocket 0(8 Cores)DRAM(128 GB)16 GB/S(bidirectional)51.2 GB/SDRAM(128 GB)DRAM(128 GB)DRAM(128 GB)Socket 1(8 Cores)Socket 2(8 Cores)Socket 3(8 Cores)QPICPU 3CPU 2CPU 0CPU 1CPU 4CPU 5CPU 7CPU 6Upper CPU trayLower CPU trayCPU 3CPU 2CPU 0CPU 1Upper CPU trayLower CPU trayXNCCPU 4CPU 5CPU 6CPU 7XNCChapter 2. Background

7

dependency chains among the decoded µops (from IDQ or the D-ICache), and executes

them in an out-of-order manner while maintaining the correct data ﬂow.

As modern machines scale to multiple sockets, non-uniform memory access (NUMA)

brings more performance issues. Figure 4.2 illustrates the NUMA topology of

our sever with four sockets. Each CPU socket has its local memory, which is

uniformly shared by the cores on the socket. Sockets are connected by a much slower

(compared to local memory access) channel called Quick Path Interface (QPI). Different

NUMA conﬁgurations exist nowadays market, which further complicates the software

optimization on them. Figure 5.1 illustrates the NUMA topologies of our servers. In

the following, we use “Server A” to denote the ﬁrst, and “Server B” to denote the

second. Server A can be categorized into the glue-less NUMA server, where CPUs are

connected directly/indirectly through QPI or vendor custom data interconnects. Server

B employs an eXternal Node Controller (called XNC [HPE18]) that interconnects upper

and lower CPU tray (each tray contains 4 CPU sockets). The XNC maintains a directory

of the contents of each processors cache and signiﬁcantly reduces remote memory access

latency. The detailed speciﬁcations of our two servers are shown in our experimental

setup (Section 5.8).

2.2 Data Stream Processing Systems

In the following, we introduce three design aspects of Storm and Flink: 1) pipelined

processing with message passing, 2) on-demand data parallelism, and 3) JVM-based

implementation.

Pipelined processing with message passing. We describe the execution model with a

general deﬁnition [Gea15]. A streaming application is represented by a graph, where

nodes in the graph represent either data source operators or data processing operators,

and edges represent the data ﬂow between operators. In general, there are two types of

operators deﬁned in the topology. 1) a data source operator generates (or receives from the

external environment) events to feed into the topology, and 2) a data processor operator

encapsulates speciﬁc processing logics such as ﬁltering, transforming or user-deﬁned

function.

Chapter 2. Background

8

In a shared-memory environment, an operator (continuously) writes its output data into

the local memory. For each output data, the operator also pushes a tuple consisting of

a reference (i.e., pointer) of the output data into its output queue. The corresponding

consumer (continuously) fetches the tuple from the queue, and then accesses on the

output data generated by the producer operator through memory fetches. In other

words, the communication between two operators are through the data reference.

This pass-by-reference message passing approach avoids duplicating data in a shared-

memory environment and is the common approach adopted by most modern DSP

systems. Figure 4.3 illustrates an example of message passing between operators in

a shared-memory environment, where the producer and consumer are scheduled to

CPU socket 0 and socket 1, respectively. The producer ﬁrst writes its output data to the

local memory of socket 0 (step 1) and emits a tuple containing a reference to the output

data to its output queue (step 2). The consumer fetches from the corresponding queue

to obtain the tuple (step 3) and then accesses the data by the reference (step 4). This

example also demonstrates remote memory accesses across sockets during message

passing in DSP systems, which we will study in details in Section 4.5.3.

On-demand data parallelism. Modern DSP systems such as Storm and Flink are

designed to support task pipeline and data parallelism at the same time. The actual

execution of an operator is carried out by one or more physical threads, which are

referred to as executors. Input stream of an operator is (continuously) partitioned

among its executors. The number of executors for a certain operator is referred to

as the parallelism level and can be conﬁgured by users in the topology conﬁguration.

A topology at the executor level is called an execution graph. An example execution

graph of the word-count application is shown in Figure 4.4. In this example, the split,

count, and sink operators have three, two and one executors, respectively. Streams are

partitioned and delivered to speciﬁc destination executors according to the grouping

strategy speciﬁed by the user. In the previous example, the shufﬂe grouping strategy

used in the data source operator uniformly distributes the tuples to each split executor.

Meanwhile, each spilt executor sends tuples to count executors according to the attribute

of the tuple (speciﬁed as ﬁeld grouping) so that the same key (i.e., the same word) is

always delivered to the same count executor.

JVM-based implementation. Both Storm and Flink are implemented with JVM-based

Chapter 2. Background

9

Figure 2.4: Message passing mechanism.

Figure 2.5: Word-count execution graph.

programming languages (i.e., Closure, Java, and Scala), and their execution relies on

JVM. Two aspects of JVM runtime are discussed as follows.

Data reference: As we have mentioned before, message passing in DSP systems always

involves passing the reference. That is, operators access the data through the reference

in the tuple, which may lead to pointer chasing and stress the cache and TLB of the

processor heavily.

Garbage collection (GC): Another important aspect of the JVM-based system is the built-in

memory management. Modern JVM implements generational garbage collection which

uses separate memory regions for different ages of objects. The signiﬁcant overhead of

GC has been reported in many existing studies (e.g., [SP14, Ae15]). To this end, some

DSP systems have even implemented its own memory management besides JVM (e.g.,

Flink).

Pass valuePass referenceMemorySocket 0Socket 1queueProducerConsumerQPI1234xStep xData SourceSinkSplitCountSplitSplitShuffle groupingCountGlobal groupingFields groupingChapter 2. Background

10

(a) Application topology.

(b) Example execution trace.

Figure 2.6: Hospital Infection Control (HIC) application.

2.3 Transactional State Management of DSPSs

A streaming application is commonly expressed as a DAG (directed acyclic graph)

where vertexes correspond to continuously running operators, and edges represent

data streams ﬂowing between operators. Let us use the hospital infection control

(HIC) application (shown in Figure 5.2(a)) as a running example. HIC continuously

monitors and analyzes real-time behaviors of workers and reports if there exists any

violation of hospital hygiene rules, e.g., a worker forgot to sanitize when entering the

hospital. HIC contains the following ﬁve operators. 1) Spout continuously reports

the behaviors of workers, such as “exit”, “sanitize”. Each report stands for an input

event annotated with a timestamp that indicates its occurrence time. For simplicity,

we assume each event’s timestamp increases monotonically. 2) Dispatcher distributes

behavior information to SM and MM to perform monitoring correspondingly. 3) SM

continuously detects whether any worker under “safe” status exits the hospital and

enters later without performing sanitation. Once violation is detected, SM needs to

update the corresponding worker’s status into “warning”. 4) MM detects whether a

worker wears mask before exiting the hospital if he is under “warning” status. 5) Sink

reports the detection results to end users.

To support complex real-time analytics, applications often require the underlying DSPS

to maintain large shared states, which may be accessed and updated by different operators

running concurrently [Weaa, Bea, Mea]. The usage of shared states are prevalent and

has been studied in several prior works [Weaa, Bea, Mea]. For example, in the HIC

application, the status of all workers need to be stored in a single table and accessible

by both SM and MM operators as shown in Figure 5.2(a). We denote the set of state

Dispat.SpoutSinkMMSMSMMMSinkSpoutidstatusWorker statusUpdate (w1,warning)e1e2idstatusw1safew2warningUpdate too lateMMSMread (w1)12issuesissuesChapter 2. Background

11

access operations triggered by a single incoming event as one state transaction due to its

similar requirement on ACID properties of database transaction. For example, during

processing of one input event, SM may issue one or more write operations to shared

states to update workers’ status, which are considered as one state transaction.

For scalability, both SM and MM can be carried by multiple threads, and their input

events can be hence concurrently processed to increase overall throughput. However,

it further intensiﬁes the state access collision, and any uncoordinated accesses to the

same state (e.g., update and read status of the same worker at the same time) can

cause computation inconsistencies, further leading to incorrect streaming results. This

problem is exacerbated if more complex state storage and retrial queries such as scan

and range lookup is required, which is unfortunately mostly overlooked in existing

DSPSs, such as Storm [Sto], Flink [ﬂi]. As a future work, we attempt to design a new

DSPS, called T-Stream that can fundamentally address this problem.

CHAPTER 3

Literature Review

The design and implementation of DSPSs have attracted a great amount of effort from

both the research and the industry communities during the last decade. In this chapter,

we provide a comprehensive and multidisciplinary literature review on DSPSs. Instead

of performing a survey of all related works, we focus on those closely related to our

works.

3.1 Data Stream Processing Systems

In the last decade, a great number of different academic prototypes as well as commercial

products of DSPSs have been built. The ﬁrst-generation of DSPSs were often built

as extensions of existing database engines. Representatives of those earlier DSPSs

including TelegraphCQ [Ce03], Aurora [Aea03] and STREAM [G+03, ABW06]. SQL-

variant programming language (e.g., CQL [ABW06]) is proposed together with the

system. Due to the hardware limitation, ﬁrst-generation DSPSs primarily focus on

single-core execution. Driven by new demands of streaming applications, second-

generation DSPSs, such as Borealis [Ae05], System-S [Je06], are equipped with advanced

features such as fault tolerance [Ae05], adaptive query processing [RDS+04] and more

complex query expressions [BCM06] (e.g., complex event processing). Modern DSPSs

(i.e., third-generation) are strongly driven by the trend towards cloud computing. Two

key features of them are scaling over a cluster of machines and highly robustness

on faults. Some important examples including Apache Storm [Sto], Flink [ﬂi], Spark

Streaming [Ze13], Samza [Sam] and S4 [NRNK10]. Despite their different architectures

and design focuses, majority of them are designed with the aim of optimizing the

13

Chapter 3. Literature Review

14

performance of DSPSs on distributed environment.

Despite the successes achieved during the last decade, these third-generation DSPSs are

now facing great challenges when supporting a wide range of emerging time-critical

applications, which generally require the underlying DSPSs to achieve low end-to-end

latency when processing huge volumes of data. Witnessing the emergence of modern

commodity machines with massively parallel processors, researchers and practitioners

ﬁnd shared-memory multicore architectures an attractive alternative platform [CDW17],

and several in-memory single-node DSPSs are recently proposed [Kea16, MPJ+17].

SABER [Kea16] focuses on efﬁciently realizing computing power from both CPU and

GPUs. Streambox [MPJ+17] provides an efﬁcient mechanism to handle out-of-order

arrival event processing in a multi-core environment. Similar motivation raises a recent

patch on Flink [NUM17], which tries to make Flink a multicore efﬁcient DSPS. The basic

idea is to treat each NUMA node a distributed compute node and place application

operators as if it is in a distributed environment based on a round-robin allocation

strategy.

3.2 Performance Evaluation for DSPSs

DSP systems have attracted a great amount of research effort. A number of systems have

been developed, for example, TelegraphCQ [Ce03], Borealis [Ae05], Yahoo S4 [NRNK10],

IBM System S [Je06] and the more recent ones including Storm [Sto], Flink [ﬂi] and

Spark Streaming [Ze13]. There is no one “standard” implementation of DSPSs, and

there have been a few studies on comparing different DSPSs. A comparison of S4

and Storm [Me09] uses a micro-benchmark to understand the performance issues

of the systems regarding scalability, execution time and fault tolerance. A similar

study [Ce12] has been conducted to compare the performance characteristics of three

DSPSs, including System-S, S4, and Esper. A recent study [Ben] comparing Flink, Storm,

and Spark Streaming has shown that, Storm and Flink have sub-second latency with

relatively low throughputs, while Spark streaming has higher throughput at a relatively

high latency. However, those evaluation study treat each DSPS as a black box, and

little attention has been paid to the research on the key and common design aspects of

various DSP systems on modern multi-core processors.

Chapter 3. Literature Review

15

3.3 Stream Processing Optimizations

Various research communities have greatly inﬂuenced the development of DSPSs

including database, operating systems, and complex event processing. They have

independently developed optimizations for stream processing. A detailed survey is

provided at [Hea14b]. In this section, we focus on the following two categories that are

closely related to our works.

3.3.1 Batching

The general idea of batching in stream processing is straightforward. Instead of transmit

and process one data item at one time, process multiple data times in a single batch.

The beneﬁts are mainly two folds. First, batching can amortize the cost of bringing the

execution instructions into cache over multiple data items. Second, it also amortizes

the cost of communication over operators. Sax et al. [SC14] proposed to create an

independent batching buffer for each consumer in order to batch all tuples that will be

processed by the same consumer to avoid wrong ﬁelds grouping problem. However,

the additional explicit buffering delay in every executor may introduce serious negative

impact on the system latency. Das et al.[De14] studies the effect of batch sizes and other

parameters on the throughput and end-to-end latency of the system, and proposes

an algorithm based on Fixed-Point Iteration to automatically adapt batch sizes as the

circumstance varies, which targets to minimize the end-to-end latency while keeping

the system stable. In our proﬁling study, we also found batching is particularly helpful

in improving DSPS performance by reducing L1-ICache miss stalls.

3.3.2 Operator Placement and Parallelism

Operator placement in a distributed DSPS determines its scalability to a greater extent.

Many algorithms and mechanisms [Ae13, Xe14, Pea15, Cea16b, Cea17, Kea09] are

developed to allocate (i.e., schedule) operators of a job into physical resources (e.g.,

compute node) in order to achieve certain optimization goal, such as maximizing

throughput, minimizing latency or minimizing resource consumption, etc. Aniello et

al. [Ae13] propose two schedulers for Storm. The ﬁrst scheduler is used in an ofﬂine

Chapter 3. Literature Review

16

manner prior to executing the topology and the second scheduler is used in an online

fashion to reschedule after a topology has been running for a duration. Similarly, T-

Storm [Xe14] dynamically assigns/reassigns operators according to run-time statistics

in order to minimize inter-node and inter-process trafﬁc while ensuring load balance. R-

Storm [Pea15] focuses on resource awareness operator placement, which tries to improve

the performance of Storm by assigning operators according to their resource demand

and the resource availability of computing nodes. Cardellini et al. [Cea16b, Cea17]

propose a general mathematical formulation of the problem of optimizing operator

placement for distributed data stream processing. Recently, Li et al. [LXTW18] present a

machine-learning based framework for minimizing end-to-end processing latency on

DSPSs. However, based on our study, executor placement inside a single machine also

needs to be considered due to the NUMA effect.

Many DSPSs, such as Storm [Sto], Heron [her], Flink [ﬂi] and Seep [FMKP13], share

similar architectures including pipelined processing and operator replication designs.

Speciﬁcally, an application is expressed as a DAG (directed acyclic graph) where vertexes

correspond to continuously running operators, and edges represent data streams ﬂowing

between operators. To sustain high input stream ingress rate, each operator can

be replicated into multiple instances running in parallel. A streaming execution plan

determines the number of replicas of each operator (i.e., operator replication), as well as

the way of allocating each operator to the underlying physical resources (i.e., operator

placement). A natural question raised in deploying DSPSs on multicore architecture

is how to ﬁnd a streaming execution plan that maximizes processing throughput of

DSPSs under NUMA effect. Due to NUMA, operator experiences additional remote

memory access (RMA) penalty during input data fetch when it is allocated in different

CPU sockets to its producers. As a result, the processing speed and resource demand

of an operator is not ﬁxed but related to how it is allocated in different execution

plans. An algorithm ignoring such varying properties of the concerned problem either

over-estimates resource demand of operators that results in resource underutilization

or under-estimates resource demand that results in severely thread interference. Both

leads to suboptimal performance. Although NUMA-awareness system optimization

has been previously studied in the context of relational database [Ge14, Pea16, Le14],

those works are either 1) focused on different optimization goals (e.g., better load

Chapter 3. Literature Review

17

balancing [Pea16] and minimizing resource usage [Ge14]) or 2) based on different

system architectures [Le14]. They provide highly valuable techniques, mechanisms and

execution models but none of them uses the knowledge at hand to solve the problem

we address, that is how to ﬁnd a streaming execution plan that maximizes processing

throughput of DSPSs under NUMA effect.

3.4 State Management in DSPSs

Modern streaming applications generally require the underlying DSPS to maintain large

internal state so as to support complex real-time analytics. Unfortunately, most modern

DSPSs either do not support out-of-core state or have to rely on third-party data storage

frameworks (e.g., [Sma18, sta18]), which not only degrades the system performance but

also violates the state consistency [Cea]. Similar motivations have led to a very recent

launch of a commercial system, called Ledger [Tra18], developed by Data Artisans. It is

close-sourced, and we cannot compare our system with it. Wang et al. [Weaa] conducted

an early study on the importance of supporting out-of-core state. In their proposal,

DSPSs must support a new computing paradigm, called active complex event processing

(ACEP), to enable complex interactive real-time analytics. Botan et al. [Bea] presented

an uniﬁed transactional model for streaming applications, called UTM. Recently, MeeHan

et al. [Mea] attempted to fuse OLTP and streaming processing together and developed

the SStore system.

3.4.1 Concurrency Control

In order to maintain the consistency of shared states and to guarantee the correctness of

stream computation results, a DSPS that attempts to concurrently manipulate th shared

states must perform access operations with ACID guarantees.

Concurrency control (CC) protocols have been investigated widely in decades [BG, Fea,

Yea, Weac] for guaranteeing ACID properties. Beyond guaranteeing ACID properties,

DSPSs must also provide order-preserving consistency – a property that conventional CC

protocols are not well-prepared for. Several prior works on transaction decomposition

and lazy evaluation [WMC+16, Fea] inspired our design of the operation chain based

Chapter 3. Literature Review

18

processing model. The key contribution of our work is the application of transaction

decomposition and lazy evaluation techniques to scale transactional stream processing

with ordering-preserving consistency. In particular, we show that the overhead of

maintaining sorted data structure (the key technique to preserve order consistency) can

be overcome by the performance gains from evaluation push-down and work-stealing.

Several prior works [Yea, Weab, Hea] studied the scalability bottlenecks in varies aspects

of concurrency control algorithms. Different from these works, our work studied the

concurreny control algorithms in the context of DSPSs, and presented a new mechanism

for scaling transactional stream processing on multicores. T-Stream is conceptually

similar to some deterministic databases [AAB+], which generates a dependency graph

that deterministically orders transactions’ conﬂicting record. However, deterministic

database aims at distributed environment, and the dependency analysis is performed

by one thread (or one host) before the actual execution can start. Such dry-run phase is

too heavy to be applied in our system, which scales at a single multicore machine.

3.4.2 Multicore Databases

Multicore architectures have brought many research challenges and opportunities for in-

memory data management, as outlined in recent surveys [Te15, Ze15]. There have been

studies on optimizing the instruction cache performance [ZR04, HA06], the memory

and cache performance [Ae09, He05, Be99, Be13] and NUMA [Le14, Le13, Ge14]. To

address the needs for a NUMA-aware OLTP system, Porobic et al. [PPB+12] proposed

“hardware islands”, in which NUMA nodes are grouped into logical partitions as islands

and communicate through message passing among different islands. We applied the

similar idea in T-Stream but it shows only minor improvement due to the low memory

copy overhead in the testing workloads.

CHAPTER 4

Revisiting the Design of Data Stream Processing

Systems on Multi-Core Processors

4.1 Introduction

Many data stream processing systems (DSPSs) have recently been proposed to meet the

increasing demand of processing streaming data, such as Apache Storm [Sto], Flink [ﬂi],

Spark Streaming [Ze13], Samza [Sam] and S4 [NRNK10]. Regardless of the different

architectures of those DSP systems, they are mainly designed and optimized for scaling

out using a cluster of commodity machines (e.g., [Xe14, Ae13, Pe15]). We observe the

following three common design aspects in building those existing DSP systems:

a) Pipelined processing with message passing: A streaming application is usually

implemented as multiple operators with data dependencies, and each operator

performs three basic tasks continuously, i.e., receive, process and output. Such

a pipelined processing design enables DSP systems to support very low latency

processing, which is one of the key requirements in many real applications that

cannot be well supported in batch-processing systems.

b) On-demand data parallelism: Fine-grained data parallelism conﬁguration is

supported in many DSP systems. Speciﬁcally, users can conﬁgure the number of

threads in each operator (or function) independently in the streaming application.

Such an on-demand data parallelism design aims at helping DSP systems scale for

high throughput.

c) JVM-based implementation: DSP systems are mostly built on top of JVM (Java Virtual

Machine). Although the use of JVM-based programming language makes the

19

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

20

system development more productive (e.g., built-in memory management), many

JVM runtime performance issues such as data reference and garbage collection are

transparent to programmers.

Modern servers are being deployed in the cluster environment. More CPU cores are

being put on the same die. Subsequently, the on-chip cache hierarchies that support

these cores are getting larger, deeper, and more complex. Furthermore, as modern

machines scale to multiple sockets, non-uniform memory access (NUMA) becomes an

important performance factor for data management systems (e.g., [Le14, Le13]). For

example, recent NUMA systems have already supported hundreds of CPU cores and

multi-terabytes of memory [sgi]. However, there is a lack of detailed studies on proﬁling

the above common design aspects of DSP systems on modern architectures.

In this paper, we experimentally revisit those common design aspects on a modern

machine with multiple CPU sockets. We aim to offer a better understanding of how

current design aspects of modern DSP systems interact with modern processors when

running different types of applications. We use two DSP systems (i.e., Apache

Storm [Sto] and Flink [ﬂi]) as the evaluation targets. Note that the major goal of this study

is to evaluate the common design aspects of DSP systems on scale-up architectures using

proﬁled results so that our results and ﬁndings can be applicable to many other DSP

systems, rather than to compare the absolute performance of individual systems. There

has been no standard benchmark for DSP systems, especially on scale-up architectures.

Thus, we design our micro benchmark with seven streaming applications according to

the four criteria proposed by Jim Gray [Gra92] (Section 4.3.3).

Through detailed proﬁling studies with our benchmark on a four-socket machine, we

make the following key observations.

First, the design of supporting both pipelined and data parallel processing leads to a

very complex massively parallel execution model in DSP systems, which poorly utilizes

modern multi-core processors. Based on our proﬁling results, a signiﬁcant portion

(∼40%) of the total execution time is wasted due to L1-instruction cache (L1-ICache)

misses. The signiﬁcant L1-ICache misses are mainly due to the large instruction footprint

between two consecutive invocations of the same function.

Second, the design of continuous message passing between operators causes a

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

21

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

footprints (e.g., [Ae15, SP14]).

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

22

Figure 4.1: Pipeline execution components of processor: (left) various stalls caused in
the pipeline, (middle) pipelines interactions with cache and memory systems and (right)
the interactions among the cache, TLB, and memory systems.

Figure 4.2: NUMA topology and peak bandwidth of our server.

4.2 Preliminaries and Background

In this section, we ﬁrst introduce the background of the multi-socket multi-core

processors. Then, we introduce three design aspects of two DSP systems studied

in this paper, namely Apache Storm [Sto] and Flink [ﬂi].

Instruction Fetch UnitsInstruction Length Decoder (ILD)Instruction Queue (IQ)Instruction DecodersITLB1.5k D-ICacheInstruction Decode Queue (IDQ)L2 CacheLLCRenamerRetirementDTLBL1-DCacheMemoryFront endBack endSchedulerExecution CoreITLB miss Stalls& L1-I cache miss stallsLCP StallsIQ full stallsILD StallsIDQ StallsDTLB miss Stalls& Data miss stallsL1-ICacheµops issuedµops dispatchedµops executedSocket 0(8 Cores)DRAM(128 GB)16 GB/S(bidirectional)51.2 GB/SDRAM(128 GB)DRAM(128 GB)DRAM(128 GB)Socket 1(8 Cores)Socket 2(8 Cores)Socket 3(8 Cores)QPIChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

23

4.2.1 Multi-Socket Multi-core Processors

Modern processors consist of multiple different hardware components with deep

execution pipelines, as shown in Figure 4.1. We also illustrate the stalls and the

interactions among pipelines and memory systems in the ﬁgure. The pipeline can

be divided into the front-end component and the back-end component [man].

The front-end is responsible for fetching instructions and decodes them into micro-

operations (µops). It feeds the next pipeline stages with a continuous stream of micro-

ops from the path that the program will most likely execute, with the help of the branch

prediction unit. Starting from Sandy Bridge micro-architecture, Intel introduces a special

component called Decoded ICache (D-ICache), which is essentially an accelerator of

the traditional front-end pipeline. D-ICache maintains up to 1.5k of decoded µops.

Future references to the same µops can be served by it without performing the fetch and

decode stages. D-ICache is continuously enhanced in terms of size and throughput in

the successor generations of Intel processors. Note that, every µops stored in D-ICache

is associated with its corresponding instruction in L1-ICache. An L1-ICache miss also

causes D-ICache to be invalidated.

The back-end is where the actual instruction execution happens.

It detects the

dependency chains among the decoded µops (from IDQ or the D-ICache), and executes

them in an out-of-order manner while maintaining the correct data ﬂow.

As modern machines scale to multiple sockets, non-uniform memory access (NUMA)

brings more performance issues. Figure 4.2 illustrates the NUMA topology of our server

with four sockets. Each CPU socket has its local memory, which is uniformly shared

by the cores on the socket. Sockets are connected by a much slower (compared to local

memory access) channel called Quick Path Interface (QPI).

4.2.2 Data Stream Processing Systems

In the following, we introduce three design aspects of Storm and Flink: 1) pipelined

processing with message passing, 2) on-demand data parallelism, and 3) JVM-based

implementation.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

24

Pipelined processing with message passing. We describe the execution model with a

general deﬁnition [Gea15]. A streaming application is represented by a graph, where

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

output data generated by the producer operator through memory fetches. In other

words, the communication between two operators are through the data reference.

This pass-by-reference message passing approach avoids duplicating data in a shared-

memory environment and is the common approach adopted by most modern DSP

systems. Figure 4.3 illustrates an example of message passing between operators in

a shared-memory environment, where the producer and consumer are scheduled to

CPU socket 0 and socket 1, respectively. The producer ﬁrst writes its output data to the

local memory of socket 0 (step 1) and emits a tuple containing a reference to the output

data to its output queue (step 2). The consumer fetches from the corresponding queue

to obtain the tuple (step 3) and then accesses the data by the reference (step 4). This

example also demonstrates remote memory accesses across sockets during message

passing in DSP systems, which we will study in details in Section 4.5.3.

On-demand data parallelism. Modern DSP systems such as Storm and Flink are

designed to support task pipeline and data parallelism at the same time. The actual

execution of an operator is carried out by one or more physical threads, which are

referred to as executors. Input stream of an operator is (continuously) partitioned

among its executors. The number of executors for a certain operator is referred to

as the parallelism level and can be conﬁgured by users in the topology conﬁguration.

A topology at the executor level is called an execution graph. An example execution

graph of the word-count application is shown in Figure 4.4. In this example, the split,

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

25

count, and sink operators have three, two and one executors, respectively. Streams are

partitioned and delivered to speciﬁc destination executors according to the grouping

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

uses separate memory regions for different ages of objects. The signiﬁcant overhead of

GC has been reported in many existing studies (e.g., [SP14, Ae15]). To this end, some

DSP systems have even implemented its own memory management besides JVM (e.g.,

Flink).

4.3 Methodology

We conduct an extensive set of experiments to proﬁle the performance of Storm and

Flink on a modern scale-up server using different applications. In this section, we

ﬁrst present the evaluation goals of this study. Next, we introduce our proﬁling tools,

followed by our benchmark.

4.3.1 Evaluation Goals

This study has the following design goals.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

26

Figure 4.3: Message passing mechanism.

Figure 4.4: Word-count execution graph.

First, we aim to identify the common designs of modern DSP systems, and to understand

how those designs (i.e., pipelined processing with message passing, on-demand data

parallelism, and JVM-based implementation) interact with modern processors when

running different types of applications. Second, with the detailed proﬁling study, we

hope to identify some hardware and software approaches to resolving the bottleneck

and point out the directions for the design and implementation of future DSP systems.

4.3.2 Proﬁling Tools

JVM proﬁle. Table 4.1 lists the JVM ﬂags that we use to monitor the performance of

JVM. We are mainly interested in two kinds of activities, including those in just-in-time

(JIT) compilation and GC. We only enable those trace logs when we need to analyze the

corresponding activities. Otherwise, the trace logs are disabled. We use Performance

Inspector [PI] for gathering detailed instruction-tracing information. We measure the

size of the objects created at runtime using the MemoryUtil tool from the Classmexer

Pass valuePass referenceMemorySocket 0Socket 1queueProducerConsumerQPI1234xStep xData SourceSinkSplitCountSplitSplitShuffle groupingCountGlobal groupingFields groupingChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

27

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

library [cla].

Processor proﬁle. We systematically categorize where the processor time is spent for

executing Storm and Flink to identify common bottlenecks of their system designs when

running on multi-socket multi-core processors. We use Intel Vtune [Vtu] for proﬁling at

the processor level.

Similar to the recent study [SP14], we break down the total execution time to the

following components: 1) computation time, which is contributed by the issued µops

that subsequently be executed and retired; 2) branch misprediction stall time (TBr),

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

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

28

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

29

4.3.3 Micro Benchmark

We design our streaming benchmark according to the four criteria proposed by Jim

Gray [Gra92]. As a start, we design the benchmark consisting of seven streaming

applications including Stateful Word Count (WC), Fraud Detection (FD), Spike Detection

(SD), Trafﬁc Monitoring (TM), Log Processing (LG), Spam Detection in VoIP (VS), and

Linear Road (LR).

We brieﬂy describe how they achieve the four criteria. 1) Relevance: the applications

cover a wide range of memory and computational behaviors, as well as different

application complexities so that they can capture the DSP systems on scale-up

architectures; 2) Portability: we describe the high-level functionality of each application,

and they can be easily applied to other DSP systems; 3) Scalability: the benchmark

includes different data sizes; 4) Simplicity: we choose the applications with simplicity in

mind so that the benchmark is understandable.

Our benchmark covers different aspects of application features. First, our applications

cover different runtime characteristics. Speciﬁcally, TM has highest CPU resource

demand, followed by LR, VS and LG. CPU resource demand of FD and SD is relatively

low. The applications also have variety of memory bandwidth demands. Second,

topologies of the applications have various structural complexities. Speciﬁcally, WC,

FD, SD, and TM have single chain topologies, while LG, VS, and LR have complex

topologies. Figure 4.5 shows the topologies of the seven applications.

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

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

30

(a) Stateful Word Count (WC)

(b) Fraud Detection (FD)

(c) Spike Detection (SD)

(d) Trafﬁc Monitoring (TM)

(e) Log Processing (LG)

(f) Spam Detection in VoIP (VS)

(g) Linear Road (LR)

Figure 4.5: Topologies of seven applications in our benchmark.

SinkCountSplitData SourceData SourceSinkPredictData SourceSinkSpikeDetectionMovingAverageData SourceSinkSpeedCalculateMapMatchData SourceCountSinkStatusSinkGeoStatusVolume CounterStatusCounterGeoFinderGeoSinkData SourceScoreURLGlobalACDFoFIRACDCT24ECR24ENCRECRFRCRFVoice DispatcherSinkAccountBalanceLast Average SpeedTollNotificationAccident NotificationDaily ExpensesCount VehiclesAccident DetectionAverageSpeedDispatcherData SourceSinkChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

31

vocabulary based on the dictionary of Linux kernel (3.13.0-32-generic).

Fraud Detection (FD): Fraud detection is a particular use case for a type of problems

known as outliers detection. Given a transaction sequence of a customer, there is a

probability associated with each path of state transition, which indicates the chances

of fraudulent activities. We use a detection algorithm called missProbability [Fra] with

sequence window size of 2 events. The topology of FD has only one operator, named

as Predict, which is used to maintain and update the state transition of each customer.

We use a sample transaction with 18.5 million records for testing. Each record includes

customer ID, transaction ID, and transaction type.

Log Processing (LG): Log processing represents the streaming application of performing

real-time analyzing on system logs. The topology of LG consists of four operators. The

Geo-Finder operator ﬁnds out the country and city where an IP request is from, and

the Geo-Status operator maintains all the countries and cities that have been found so

far. The Status-Counter operator performs statistics calculations on the status codes of

HTTP logs. The Volume-Counter operator counts the number of log events per minute.

We use a subset of the web request data (with 4 million events) from the 1998 World

Cup Web site [Wor]. For data privacy protection, each actual IP address in the requests

is mapped to randomly generated but ﬁxed IP address.

Spike Detection (SD): Spike detection tracks measurements from a set of sensor devices

and performs moving aggregation calculations. The topology of SD has two operators.

The Moving-Average operator calculates the average of input data within a moving

distance. The Spike-Detection operator checks the average values and triggers an alert

whenever the value has exceeded a threshold. We use the Intel lab data (with 2 million

tuples) [Int] for this application. The detection threshold of moving average values is

set to 0.03.

Spam Detection in VoIP (VS): Similar to fraud detection, spam detection is a use case of

outlier detection. The topology of VS is composed of a set of ﬁlters and modules that

are used to detect telemarketing spam in Call Detail Records (CDRs). It operates on

the ﬂy on incoming call events (CDRs), and keeps track of the past activity implicitly

through a number of on-demand time-decaying bloom ﬁlters. A detailed description of

its implementation can be found at [Be11]. We use a synthetic data set with 10 million

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

32

records for this application. Each record contains data on a calling number, called

number, calling date, answer time, call duration, and call established.

Trafﬁc Monitoring (TM): Trafﬁc monitoring performs real-time road trafﬁc condition

analysis, with real-time mass GPS data collected from taxis and buses1. TM contains

a Map-Match operator which receives traces of an object (e.g., GPS loggers and GPS-

phones) including altitude, latitude, and longitude, to determine the location (regarding

a road ID) of this object in real-time. The Speed-Calculate operator uses the road ID

result generated by Map-Match to update the average speed record of the corresponding

road. We use a subset (with 75K events) of GeoLife GPS Trajectories [Ze09] for this

application.

Linear Road (LR): Linear Road (LR) is used for measuring how well a DSP system can

meet real-time query response requirements in processing a large volume of streaming

and historical data [Ae04]. It models a road toll network, in which tolls depend on

the time of the day and level of congestions. Linear Road has been used by many

DSP systems, e.g., Aurora [Aea03], Borealis [Ae05], and System S [Je06]. LR produces

reports of the account balance, assessed tolls on a given expressway on a given day, or

estimates cost for a journey on an expressway. We have followed the implementation of

the previous study [SC14] for LR. Several queries speciﬁed in LR are implemented as

operators and integrated into a single topology. The input to LR is a continuous stream

of position reports and historical query requests. We merge the two data sets obtained

from [Ris] resulting in 30.2 million input records (including both position reports and

query requests) and 28.3 million historical records.

4.4 Performance Evaluation

In this section, we present the performance evaluation results of different applications on

Storm and Flink on multi-core processors. We tune each application on both Storm and

Flink according to their speciﬁcations such as the number of threads in each operator.

Throughput and resource utilization on a single socket. Figure 4.6a shows the

throughput and Table 4.4 illustrates the CPU and memory bandwidth utilizations of

1 A real deployment at http://210.75.252.140:8080/infoL/sslk_weibo.html.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

33

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

in the rest of this paper.

Scalability on varying number of CPU cores. We vary the number of CPU cores from 1

to 8 on the same CPU socket and then vary the number of sockets from 2 to 4 (the number

of CPU cores from 16 to 32). Figures 4.6b and 4.6c show the normalized throughput

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

34

similarly for different numbers of sockets. The throughput of LR increases marginally

with the increasing number of sockets. Third, TM has a signiﬁcantly higher throughput

in both systems on four sockets than on a single socket. This is because TM has high

resource demands on both CPU and memory bandwidth.

(a) Evaluation of seven applications on a single socket.

(b) Storm with varying number of cores/sockets.

(c) Flink with varying number of cores/sockets.

Figure 4.6: Performance evaluation results on Storm and Flink.

4.5 Study the impact of common designs

In the following section, we investigate the underlying reasons for the performance

degradation and how the three design aspects (i.e., pipelined processing with message

passing, on-demand data parallelism, and JVM-based implementation) interact with

multi-socket multi-core processors. Speciﬁcally, we ﬁrst show an execution time

breakdown on running different applications on Storm and Flink on a single socket.

Then, we study the impact of massively parallel execution model, message passing and

stream partitioning and JVM runtime environment.

050100150200250300WCFDLGSDVSTMLRThroughput (k events/s)StormFlink1025.60.200.260%500%1000%1500%2000%2500%1 core2 cores4 cores8 cores16 cores32 coresNormalized throughputWCFDLGSDVSTMLR0%500%1000%1500%2000%2500%1 core2 cores4 cores8 cores16 cores32 coresNormalized throughputWCFDLGSDVSTMLRChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

35

(a) Storm

(b) Flink

Figure 4.7: Execution time breakdown.

4.5.1 Execution time breakdown

Finding (1): During execution of most applications (except TM) on both Storm and

Flink, ∼ 70% of their execution times are spent on processor stalls.

Figure 4.7 shows the execution time breakdown of Storm and Flink running on a

single socket on different processor components as introduced in Section 4.2.1. We

ﬁnd that 59∼77% and 58∼69% of the overall execution time are spent on stalls (Branch

misprediction stalls, Front-end stalls, Back-end stalls) for all applications running on

Storm and Flink, respectively.

Front-end stalls account for 35∼55% and 25∼56% of the total execution time of Storm

and Flink, respectively. This result is signiﬁcantly different from the batch processing

framework (e.g., [Ae15]). Back-end stalls account for approximately 13∼40% and 7∼40%

of the total execution time of Storm and Flink, respectively. Branch misprediction stalls

are low, ranging from 3 ∼ 4% for all applications.

In the following, we examine the processor stalls in more details with respect to the three

designs of DSP systems (i.e., pipelined processing with message passing, on-demand

data parallelism, and JVM-based implementation).

0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of different componentsComputationFront-end stallsBack-end stallsBad speculation0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of different componentsComputationFront-end stallsBack-end stallsBad speculationChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

36

(a) Storm

(b) Flink

Figure 4.8: Front-end stall breakdown.

4.5.2 Massively parallel execution model

Finding (2): The design of supporting both pipelined and data parallel processing

results in a very complex massively parallel execution model in DSP systems. Our

investigation reveals that the high front-end stalls are mainly caused by this execution

model.

Figure 4.8 illustrates the breakdown of the front-end stalls in running Storm and Flink

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

as “null"). Figure 4.9 illustrates the cumulative density function (CDF) of instruction

footprints on a log scale, which stands for the percentage that instruction footprint is no

0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Front-end components stall timeI-Decoding stallsL1-I cache miss stallsITLB stalls0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Front-end components stall timeI-Decoding stallsL1-I cache miss stallsITLB stallsChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

37

(a) Storm

(b) Flink

Figure 4.9: Instruction footprint between two consecutive invocations of the same
function.

larger than a certain number of distinct instructions.

We add three solid vertical arrows to indicate the size of L1-ICache (32KB), L2-Cache

(256KB), and LLC (20MB). With the detailed analysis on the instruction footprint, we

make three observations. First, two turning points on the CDF curves are observed

at x=1KB and x=10MB for Storm and x=1KB and x=1MB for Flink, which reﬂects the

common range of their instruction footprints during execution. Second, the cross-over

points of L1-ICache line and different CDF curves are between 0.3 ∼ 0.5 for Storm

and 0.6 ∼ 0.8 for Flink. It means, around 50 ∼ 70% and 20 ∼ 40% of the instruction

footprints between two consecutive calls to the same functions are larger than the L1-

ICache in Storm and Flink, respectively. This causes severe L1-ICache stalls. Flink has

a better instruction locality than Storm on L1-ICache. Third, Storm has similar tracing

on instruction footprint with or without running user applications. This indicates that

many of the instruction cache misses may come from Storm platform itself. This also

explains the reason that different applications show similar L1-ICache miss in Storm. In

contrast, the platform of Flink has a smaller instruction footprint.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

38

I-Decoding stalls: The high instruction decoding (I-Decoding) stalls are related to the high

L1-ICache miss issue. The I-Decoding stalls can be further broken down into instruction

length decoder (ILD) stalls and instruction decoding queue (IDQ) stalls.

The ILD stalls further consist of instruction queue (IQ) full stalls and length change

preﬁx (LCP) stalls. IQ is used to store the pre-fetched instructions in a separate buffer

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

4.5.3 Message passing and stream partitioning

Finding (3): The design of message passing between operators causes a severe

performance degradation to the DSPSs running on multiple CPU sockets. During

execution, operators may be scheduled into different sockets and experience frequent

costly remote memory accesses during the fetching of input data. Furthermore, the

current design of data parallelism has overlooked the NUMA effect.

Recently, the NUMA-aware allocator has already been implemented in the Java HotSpot

Virtual Machine to take advantage of such infrastructures, which provides automatic

memory placement optimizations for Java applications. We enable this optimization

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

39

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

in our JVM by specifying the useNUMA ﬂag. However, our experiments have already

shown that this ﬂag is insufﬁcient for reducing the NUMA impact and we have observed

poor scalability in both Storm and Flink on multiple sockets. The main problem is

the high remote memory access overhead due to the heavy pipelined message passing

design. During execution, each executor needs to fetch data from the corresponding

producer continuously. On the multi-socket and multi-core architectures, an executor

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

four sockets, and further increase the number of threads up to 56. Figure 4.10a shows a

signiﬁcant increase in the standard derivation of executors’ latencies with the increasing

of the number of executors when running Storm on four CPU sockets. Those executors

experience up to 3 times difference in the average execution latency in the case of 56

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

40

(a) Average execution time per event.

(b) Back-end stalls.

Figure 4.10: Varing number of executors of Map-Matcher operator of TM when running
Storm with four CPU sockets.

Map-Matcher executors, which reafﬁrms our analysis on performance heterogeneity

in NUMA. Further, due to the signiﬁcant overhead caused by remote memory access,

the mean execution latency also increases along with the growing number of executors.

Figure 4.10b shows that the back-end stalls gradually become worse with the increase

in the number of executors. This indicates the remote memory access penalty prevents

DSP systems from scaling well.

4.5.4

JVM Runtime Environment

Finding (4): The overhead of JVM runtime contains two major and moderate

components. First, TLB stalls account for 5 ∼ 10% and 3 ∼ 8% on Storm and Flink,

respectively. This is caused by frequent pointer referencing in data accesses and Java

execution. Second, the overhead of GC in running streaming applications (1 ∼ 3%) is

insigniﬁcant.

Both Storm and Flink are implemented using JVM-based programming language. The

efﬁciency of JVM runtime is crucial to the performance of Storm and Flink. As we have

mentioned before, the back-end of the processor is where the actual execution happens.

Figure 4.11 breaks down the back-end stalls into L1-DCache stalls, L2-Cache stalls, LLC

stalls, and DTLB stalls when running Storm and Flink on a single socket.

Data cache stalls: Stalls in L1-DCache and L2-Cache dominate the back-end stalls in both

systems. We measure the size of intermediate results generated during execution of

all streaming applications in our benchmark, and we have the following observations.

024681012141618010203040506070809032404856Standard deviationProcess latency (ms/event)Mean executionlatencyStandard deviation0%10%20%30%40%50%60%70%80%90%100%32404856Percentage of Back end stall  OthersLLC Miss (local)LLC Miss (remote)Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

41

(a) Storm

(b) Flink

Figure 4.11: Back-end stall breakdown.

First, the private data structures accessed during execution do not often ﬁt into L1-

DCache (32KB) but can ﬁt into L2-Cache (256KB), which causes frequent L1-DCache

stalls. Second, the output data for message passing mostly ﬁt into the LLC, and cannot

ﬁt into L2 cache. As a result, data passing among executors in a single socket usually

get served by the shared LLC (20MB).

TLB stalls: Tuples are passed with reference (instead of the actual data) in both systems.

Upon a class loading in java, the invokevirtual instruction is triggered to search the

method table and identify the speciﬁc method implementation, which may cause

random accesses on method tables. As a result, the frequent pointer references lead to

stress on TLB on both systems. Our further investigation found that enabling huge page

improves the performance of both Storm and Flink marginally for all seven applications.

Garbage collection overhead: We use G1GC [Dea04] as the garbage collector in our JVM.

The garbage collection (GC) is infrequent in running all applications on both Storm

and Flink, and the same observation is made even if we run the benchmark for hours.

Based on GC logs, we ﬁnd that no major GC occurs during the execution and minor GC

contributes only 1 ∼ 3% to the total execution time across all the applications for both

Storm and Flink. As a sanity check, we also study the impact of using an older version

of GC named parallelGC. When the parallelGC mechanism is used, the overhead of GC

increases to around 10 ∼ 15%, which indicates the effectiveness of G1GC. Nevertheless,

we plan to evaluate the impact of GC with more extensive applications.

0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Back-end components stall timeL1-DCache StallsL2 cache StallsLLC stallsDTLB stalls0%20%40%60%80%100%WCFDLGSDVSTMLRPercentage of Back-end components stall timeL1-DCache StallsL2 cache StallsLLC stallsDTLB stallsChapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

42

4.6 Towards more efﬁcient DSP systems

In this section, we present our initial attempt to address the performance issues found in

the previous section. We present two optimization techniques, including non-blocking

tuple batching (to reduce instruction cache stalls) and NUMA-aware executor placement

(to reduce remote memory accesses). We evaluate the effectiveness of the techniques by

ﬁrst studying their individual impacts and then combining both techniques together.

We note that, the two optimization techniques address the efﬁciency issues of the two

common designs (i.e., pipelined processing with message passing and on-demand data

parallelism), and we conjecture that the optimizations can be applied to other DSP

systems with the same designs.

4.6.1 Non-blocking Tuple Batching

Our proﬁling results suggest that the large instruction footprints between two

consecutive invocations of the same function cause severely performance issues

including L1-ICache miss and I-Decoding stalls, which lead to high front-end stalls. One

of the solutions is batching multiple tuples together before passing to the consumer

executor for processing. In this way, each function invocation can process multiple

tuples so that the instruction footprint between two consecutive invocations of the same

function is reduced. Similar ideas of tuple batching are already proposed [SC14] or in

use in some DSP systems [ﬂi]. However, those techniques rely on a buffering stage,

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

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

43

corresponding consumer receives such a batch, it can then process multiple tuples from

the batch with a single function invocation and further batching its output tuples in

a similar manner. Our solution requires that the data producer to prepare the initial

batches of tuples, where the size of batch S is a parameter that we will tune in later

experiments. When the Data Producer of an application generates multiple tuples (more

than S) each time, it simply groups them into batches with size up to S and feeds to the

topology. Otherwise, we can let the data producer accumulate S tuples before feeding

to the topology. As Data Producer is usually relatively light-weight compared to other

operators in an application, this kind of batching has little overhead.

It is rather straightforward to implement the non-blocking tuple batching algorithm for

any grouping policy (Section 4.2.2) except the key-grouping policy (i.e., ﬁelds grouping),

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

4.12 illustrates the normalized throughput of Storm and Flink with tuple batching

optimization for different applications on a single CPU socket. Results are normalized to

the original non-batch setting of Storm and Flink (denoted as non-batch). As expected,

tuple batching can signiﬁcantly reduce instruction cache misses and hence improve the

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

44

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

performance of most applications.

With tuple batching, the processing latency of each tuple may be increased as they

are not emitted until all tuples in the same batch are processed. Figure 4.13 shows

the normalized average latency per tuple under different batch sizes. Comparing

Figures 4.12 and 4.13, we observe a clear trade-off between the throughput and latency.

Meanwhile, our non-blocking tuple batching scheme preserves a sublinear increase in

process latency for most applications, which is due to the much-improved performance

and no explicit buffering delay.

4.6.2 NUMA-Aware Executor Placement

In order to reduce the remote memory accesses among sockets, the executors in a

topology should be placed in an NUMA-aware manner. To this end, we develop a

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

45

(a) Storm

(b) Flink

Figure 4.12: Normalized throughput of tuple batching optimization.

(a) Storm

(b) Flink

Figure 4.13: Normalized latency of tuple batching optimization.

0%50%100%150%200%250%300%350%400%450%500%WCFDLGSDVSTMLRNormalized throughputnon-batchbatch size (S)=2batch size (S)=4batch size (S)=80%50%100%150%200%250%300%350%400%WCFDLGSDVSTMLRNormalized throughputnon-batchbatch size (S)=2batch size (S)=4batch size (S)=80%100%200%300%400%500%600%700%800%WCFDLGSDVSTMLRNormalized latencynon-batchbatch size (S)=2batch size (S)=4batch size (S)=80%100%200%300%400%500%600%700%800%WCFDLGSDVSTMLRNormalized latencynon-batchbatch size (S)=2batch size (S)=4batch size (S)=8Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

46

simple yet effective NUMA-aware executor placement approach.

Deﬁnition 1. Executor placement. Given a topology execution graph T and the set of

executors W in T , an executor placement P (T, k) represents a plan of placing W onto k CPU

sockets. k can be any integer smaller than or equal to the total number of sockets in a NUMA

machine.

Deﬁnition 2. We denote the remote memory access penalty per unit as R, and the total size

of tuples transmitted between any two executors w and w(cid:48) (w, w(cid:48) ∈ W ) as T rans(w, w(cid:48)).

Each placement P (T, k) has an associated cross-socket communication cost, denoted by

Cost(P (T, k)) as shown in Equation 4.1. We denote the set of executors placed onto socket x as

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

Deﬁnition 3. The optimal executor placement, denoted by Popt,

is deﬁned as

Cost(Popt(T, k)) ≤ Cost(P (T, k)), ∀P ∈ Q, where Q is the set of all feasible executor

placement solutions.

Our optimization problem is to ﬁnd Popt(T, k) for a given topology T and a number of

enabled sockets k. In our experiment, we consider k from one to four on the four-socket

server. We now illustrate that this problem can be mapped into the minimum k-cut

problem [GH].

Deﬁnition 4. The minimum k-cut on weighted graph G = (V, E) produces a vertex placement

plan (Copt) such that V is partitioned into k non-empty disjoint sets, and the total weight of

edges across disjoint sets is minimized.

Given a topology execution graph T , we can map it to a directed weighted graph G. A

mapping from T to G is deﬁned as follows: (I) ∀ executor w ∈ W , there is a one-to-one

mapping from w to a vertex in G. (II) For any producer-consumer (< w, w(cid:48) >, w, w(cid:48) ∈ W )

message passing relationships in T , there is a one-to-one mapping to one edge in G. The

communication cost (R ∗ T rans(w, w(cid:48))) is assigned as the edge weight. The cross-socket

communication cost corresponds to the total weight of all edges crossing the disjoint

sets. Thus, optimizing Copt is equivalent to optimizing Popt.

Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

47

(a) Storm

(b) Flink

Figure 4.14: NUMA-aware executor placement.

We use the state-of-the-art polynomial algorithm [GH] for solving this problem by ﬁxing

k from one to the number of sockets in the machine. Then, from the results optimized

for different k values, we test and select the plan with the best performance.

Figure 4.14 shows the effectiveness of the NUMA-aware executor placement. Results are

normalized to four sockets without optimization. The placement strategy improves the

throughput of all applications by 7∼32% and 7∼31% for Storm and Flink, respectively.

4.6.3 Put It All Together

Finally, we put both optimizations, namely non-blocking tuple batching (S = 8) and

NUMA-aware executor placement together. Figure 4.15 illustrates the optimization

effectiveness on a single socket and four sockets. Results are normalized to four sockets

without optimization. With four sockets, our optimizations can achieve 1.3∼3.2x and

1.2∼3.1x improvement on the performance for Storm and Flink, respectively. Although

our initial attempts have signiﬁcantly improved the performance, there is still a large

room to linear scale-up.

4.7 Summary

We have revisited three common design aspects of modern DSP systems on modern

multi-socket multi-core architectures, including a) pipelined processing with message

passing, b) on-demand data parallelism, and c) JVM-based implementation. Particularly,

0%40%80%120%160%200%240%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (executor grouping)0%40%80%120%160%200%240%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (executor grouping)Chapter 4. Revisiting the Design of Data Stream Processing
Systems on Multi-Core Processors

48

(a) Storm

(b) Flink

Figure 4.15: Normalized throughput with all optimizations enabled.

we conduct detailed proﬁling studies with micro benchmark on Apache Strom and

Flink. Our results show that those designs have underutilized the scale-up architectures

in these two key aspects: a) The design of supporting both pipelined and data parallel

processing results in a very complex massively parallel execution model in DSP

systems, which causes high front-end stalls on a single CPU socket; b) The design

of continuous message passing mechanisms between operators severely limits the

scalability of DSP systems on multi-socket multi-core architectures. We further present

two optimizations to address those performance issues and demonstrate promising

performance improvements.

0%100%200%300%400%500%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (w/ both optimizations)0%50%100%150%200%250%300%350%400%450%WCFDLGSDVSTMLRNormalized throughputSingle socket (w/o optimizations)Four sockets (w/o optimizations)Four sockets (w/ both optimizations)CHAPTER 5

BriskStream: Scaling Data Stream Processing on

Shared-Memory Multicore Architectures

5.1 Introduction

Modern multicore processors have demonstrated superior performance for real-world

applications [Aea13] with their increasing computing capability and larger memory

capacity. For example, recent scale-up servers can accommodate even hundreds of

CPU cores and multi-terabytes of memory [sgi]. Witnessing the emergence of modern

commodity machines with massively parallel processors, researchers and practitioners

ﬁnd shared-memory multicore architectures an attractive streaming platform [ZHD+17,

MPJ+17]. However, fully exploiting the computation power delivered by multicore

architectures can be challenging. Prior studies [ZHD+17] have shown that existing

DSPS underutilize the underlying complex hardware micro-architecture and especially

show poor scalability due to the unmanaged resource competition and unaware of

non-uniform memory access (NUMA) effect.

Many DSPSs, such as Storm [Sto], Heron [her], Flink [ﬂi] and Seep [FMKP13], share

similar architectures including pipelined processing and operator replication designs.

Speciﬁcally, an application is expressed as a DAG (directed acyclic graph) where vertexes

correspond to continuously running operators, and edges represent data streams ﬂowing

between operators. To sustain high input stream ingress rate, each operator can

be replicated into multiple instances running in parallel. A streaming execution plan

determines the number of replicas of each operator (i.e., operator replication), as well as

the way of allocating each operator to the underlying physical resources (i.e., operator

placement). In this paper, we address the question of how to ﬁnd a streaming execution

49

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

50

plan that maximizes processing throughput of DSPSs under NUMA effect.

NUMA-awareness system optimization has been previously studied in the context of

relational database [Ge14, Pea16, Le14]. However, those works are either 1) based on

cardinality estimation [Ge14], which is unknown in executing queries over potentially

inﬁnite input streams, 2) focused on different optimization goals (e.g., better load

balancing [Pea16]) or 3) based on different system architectures [Le14]. They provide

highly valuable techniques, mechanisms and execution models but none of them uses

the knowledge at hand to solve the problem we address.

The key challenge of optimizing streaming execution plan on multicore architectures is

that there is a varying processing capability and resource demand of each operator due

to varying remote memory access penalty under different execution plans. Witnessing

this problem, we present a novel NUMA-aware streaming execution plan optimization

paradigm, called Relative-Location Aware Scheduling (RLAS). RLAS takes the relative

location (i.e., NUMA distance) of each pair of producer-consumer into consideration

during optimization. In this way, it is able to determine the correlation between a

solution and its objective value, e.g., predict the throughput of each operator for a given

execution plan. This is very different to some related work [VN02, Ge14, Kea09], which

assume a predeﬁned and ﬁxed processing capability (or cost) of each operator.

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

optimization problem. In order to reduce the size of the solution space, we further

introduce three heuristics. The ﬁrst switches the placement consideration from vertex to

edge, and avoids many placement decisions that have little or no impact on the objective

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

51

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

5.2 Background

In this section, we introduce modern scale-up servers and gives an overview of DSPSs.

5.2.1 Modern Scale-up Servers

Modern machines scale to multiple sockets with non-uniform-memory-access (NUMA)

architecture. Each socket has its own “local" memory and is connected to other sockets

and, hence to their memory, via one or more links. Therefore, access latency and

bandwidth vary depending on whether a core in a socket is accessing “local" or “remote"

memory. Such NUMA effect requires ones to carefully align the communication patterns

accordingly to get good performance.

Different NUMA conﬁgurations exist in nowadays market, which further complicates

the software optimization on them. Figure 5.1 illustrates the NUMA topologies of our

servers. In the following, we use “Server A” to denote the ﬁrst, and “Server B” to denote

the second. Server A can be categorized into the glue-less NUMA server, where CPUs

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

52

(a) Server A (glue-less)

(b) Server B (glue-assisted)

Figure 5.1: Interconnect topology for our servers.

are connected directly/indirectly through QPI or vendor custom data interconnects.

Server B employs an eXternal Node Controller (called XNC [HPE18]) that interconnects

upper and lower CPU tray (each tray contains 4 CPU sockets). The XNC maintains

a directory of the contents of each processors cache and signiﬁcantly reduces remote

memory access latency. The detailed speciﬁcations of our two servers are shown in our

experimental setup (Section 5.8).

5.2.2 DSPS Overview

Streaming application is expressed as a DAG (directed acyclic graph) where vertexes

correspond to continuously running operators, and edges represent data streams ﬂowing

between operators. Figure 5.2(a) illustrates word count (WC) as an example application

containing ﬁve operators as follows. Spout continuously generates new tuple containing

a sentence with ten random words. P arser drops tuple with a null value. In our testing

workload, the selectivity of the parser is one. Splitter processes each tuple by splitting

the sentence into words and emits each word as a new tuple to Counter. Counter

maintains and updates a hashmap with the key as the word and value as the number of

occurrence of the corresponding word. Every time it receives a word from Splitter, it

updates the hashmap and emits a tuple containing the word and its current occurrence.

Sink increments a counter each time it receives tuple from Counter, which we use to

monitor the performance of the application.

CPU 3CPU 2CPU 0CPU 1CPU 4CPU 5CPU 7CPU 6Upper CPU trayLower CPU trayCPU 3CPU 2CPU 0CPU 1Upper CPU trayLower CPU trayXNCCPU 4CPU 5CPU 6CPU 7XNCChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

53

(a) Logical view of WC.

(b) One example execution plan of WC. Three CPU
sockets are used.

Figure 5.2: Word Count (WC) as an example application.

There are two important aspects of runtime designs of modern DSPSs [ZHD+17]. First,

the common wisdom of designing the execution runtime of DSPSs is to treat each

operator as a single execution unit (e.g., a Java thread) and runs multiple operators

in a DAG in a pipelining way. Second, for scalability, each operator may be executed

independently in multiple threads. Such design is well known for its advantage of low

processing latency and being adopted by many DSPSs such as Storm [Sto], Flink [ﬂi],

Seep [FMKP13], and Heron [her]. Figure 5.2(b) illustrates one example execution plan

of WC, where parser, splitter and counter are replicated into 2, 3 and 3 instances, and

they are placed in three CPU sockets (represented as coloured rectangles).

5.3 Execution Plan Optimization

A streaming execution plan concerns how to allocate each operator to underlying

physical resources, as well as the number of replicas that each operator should have.

Operator experiences additional remote memory access (RMA) penalty during input

data fetch when it is allocated in different CPU sockets to its producers. A bad execution

plan may introduce unnecessary RMA communication overhead and/or oversubscribe a

few CPU sockets that induces signiﬁcant resource contention. In this section, we discuss

the performance model that guides optimization process and the formal deﬁnition of

our concerned optimization problem.

SpoutParser“a boy and a girl”SplitterCounterSink“a”, “boy”…(“boy”,1), (“a”,2) …SpoutParserSplitterCounterSinkParserSplitterSplitterCounterCounterSocket 0Socket 2Socket 1Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

54

5.3.1 The Performance Model

Model guided deployment of query plans has been previously studied in relational

databases on multi-core architectures, for example [Ge14]. Yet, those works are based on

cardinality estimation, which is unknown in streaming workloads. Due to the difference

in problem assumptions, we adopt the rate-based optimization (RBO) approach [VN02],

where output rate of each operator is estimated. However, the original RBO assumes

processing capability of an operator is predeﬁned and independent of different execution

plans, which is not suitable under the NUMA effect.

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

adopted the pass-by-reference message passing approach (See Section 5.7) to utilize

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

55

Table 5.1: Summary of terminologies

TypeNotationDefinitionsMachine	specific.𝐂Maximum	attainable	unit	CPU	cycles	per	socket𝐁Maximum	attainable	local	DRAM	bandwidth𝐐𝐢,𝐣Maximum	attainable	remote	channel	bandwidth	from	socket	𝑖to	socket	𝑗𝐋𝐢,𝐣Worst	case	memory	access	latency	from	socket	𝑖to	socket	𝑗SCache	line	sizeOperator	specific.𝐌Average	memory	bandwidth	consumption	per	tuple𝑻Average	time	spent	on	handling	each	tuple𝑻𝐟Average	fetching	time	per	tuple𝑻𝒆Average	execution	time	per	tuple𝑵Average	size	per	tuplePlan	inputs𝐩Input	execution	plan𝐈External	input	stream	ingress	rate	to	source	operatorModel	outputs𝐫𝐨Output	rate	of	an	operator𝐫𝐨Expected	output	rate	of	an	operator𝐫𝐨(𝐬)Output	rate	of	an	operator	specifically	to	producer	``s”𝐫𝐢Input	rate	of	an	operator.	𝑟7of	a	non-source	operator	is	𝑟8of	its	producer	and	𝑟7of	source	operator	is	external	input	rate	𝐼𝑹Application	throughputChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

56

shared-memory environment, the reference passing delay is negligible. Hence, ri of an

operator is simply ro of the corresponding producer and ri of spout (i.e., source operator)

is given as I (i.e., external input stream ingress rate). Conversely, upon obtaining the

reference, operator then needs to fetch the actual data during its processing, where the

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

T e stands for time required in actual function execution and emitting outputs tuples

per input tuple. For operators that have a constant workload for each input tuple, we

simply measure its average execution time per tuple with one execution plan to obtain

its T e. Otherwise, we can use machine learning techniques (e.g., linear regression) to

train a prediction model to predict its T e under varying execution plans. Prediction of

an operator with more complex behaviour has been studied in previous works [Aea12],

and we leave it as future work to enhance our system.

T f stands for time required to fetch (local or remotely) the actual data per input

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

57

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

units. We use a simple formula based on prior work from Surendra and et al. [BSGT04]

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

In this case, we can derived that

1It is possible to conﬁgure different priorities among different operators here, but is out of the scope of

this paper.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

58

Figure 5.3: CDF of proﬁled average execution cycles of different operators of WC.

ro ≥ (cid:80)

producers ri. This effectively means the operator is under-supplied (or
just fulﬁlled), and its output rate is limited by its input rates, i.e., ro = ri, and

ro(s) = ri(s) ∀ producer s.

Given an execution plan, we can then identify operators that are over-supplied by

comparing its input rate and output rate. Those over-supplied operators are essentially

the “bottlenecks” of the corresponding execution plan. Our scaling algorithm tries to

increase the replication level of those operators to remove bottlenecks. After the scaling,

we need to again search for the optimal placement plan of the new DAG. This iterative

optimization process formed our optimization framework, which will be discussed

shortly later in Section 5.4.

Model instantiation. Machine speciﬁcations of the model including C, B, Qi,j, Li,j and

S are given as statistics information of the targeting machine (e.g., measured by Intel

Memory Latency Checker [int18]). Similar to the previous work [Cea13], we need to

proﬁle the application to determine operator speciﬁcations. To prevent interference,

we sequentially proﬁle each operator. Speciﬁcally, we ﬁrst launch a proﬁling thread of

the operator to proﬁle on one core. Then, we feed sample input tuples (stored in local

memory) to it. Information including T e (execution time per tuple), M (average memory

bandwidth consumption per tuple) and N (size of input tuple) is then gathered during

its execution.

The sample input is prepared by pre-executing all upstream operators. As they are not

running during proﬁling, they will not interfere with the proﬁling thread. To speed up

00.20.40.60.81050010001500Cumulative percent CPU_CYCLES (Te)SinkSpoutParserCounterSplitterChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

59

the instantiation process, multiple operators can be proﬁled at the same time as long

as there is no interference among the proﬁling threads (e.g., launch them on different

CPU sockets). The statistics gathered without interference are used in the model as

our execution plan optimization (RLAS) avoids interference (see Section 5.3.2). Task

oversubscribing has been studied in some earlier work [IHBZ10], but it is not the focus

of this paper.

We use the overseer library [Pea11] to measure T e, M , and use classmexer library [cla]

to measure N . Figure 5.3 shows the proﬁling results of T e of different operators of WC.

The major takeaway from Figure 5.3 is that operators show stable behaviour in general,

and the statistics can be used as model input. Selecting a lower (resp. higher) percentile

proﬁled results essentially corresponds to a more (resp. less) optimistic performance

estimation. Nevertheless, we use the proﬁled statistics at the 50th percentile as the input

of the model, which successfully guides our system to scale in multi-socket multicores.

5.3.2 Problem Formulation

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

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

60

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

replicas, we have to consider in total k|o| different replication conﬁgurations. In addition,

for each replication conﬁguration, there are mn different placements, where m is the

number of CPU sockets and n stands for the total number of replicas (n ≥ |o|). Such a

large solution space makes brute-force unpractical.

5.4 Optimization Algorithm Design

We propose a novel optimization paradigm called Relative-Location Aware Scheduling

(RLAS) to optimize replication level and placement (i.e., CPU afﬁnity) of each operator

at the same time guided by our performance modelling. The key to optimize replication

conﬁguration of a stream application is to remove bottlenecks in its streaming pipeline.

As each operator’s throughput and resource demand may vary in different placement

plans, removing bottlenecks has to be done together with placement optimization.

The key idea of our optimization process is to iteratively optimize operator placement

under a given replication level setting and then try to increase replication level of

the bottleneck operator, which are determined during placement optimization. The

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

61

Figure 5.4: RLAS Optimization example.

bottleneck operator is deﬁned as the operator that has a larger input rate than its

processing capability (see Section 5.3.1 case 1). Figure 5.4 shows an optimization example

of a simple application consisting of two operators. The initial execution plan with no

operator replication is labelled with 0. First, RLAS optimizes its placement (labelled with

1) with placement algorithm, which also identiﬁes bottleneck operators. The operators’

placement to CPU sockets are indicated by the dotted arrows in the Figure. Subsequently,

it tries to increase the replication level of the bottleneck operator, i.e., the hollow circle,

with scaling algorithm (labelled with 2). It continues to optimize its placement given the

new replication level setting (labelled with 3). Finally, the application with an optimized

execution plan (labelled with 4) is submitted to execute.

The details of scaling and placement optimization algorithms are presented in Section 5.5.

In the following, we discuss how the Branch and Bound based technique [Mea16] is

applied to solve our placement optimization problem assuming operator replication is

given and ﬁxed. We focus on discussing our bounding function and unique heuristics

that improve the searching efﬁciency.

Branch and Bound Overview. B&B systematically enumerates a tree of candidate

solutions, based on a bounding function. There are two types of nodes in the tree:

live nodes and solution nodes. In our context, a node represents a placement plan

and the value of a node stands for the estimated throughput under the corresponding

placement. A live node contains the placement plan that violates some constraints and

they can be expanded into other nodes that violate fewer constraints. The value of a live

node is obtained by evaluating the bounding function. A solution node contains a valid

Recursion terminateApplication DAGPlacement optimized DAGScaling optimized DAGSocket 0(1)(2)Socket 0Socket 1(3)Optimal DAGSocket 0Socket 1(0)(4)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

62

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

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

63

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

unscheduled as shown in the top-left of Figure 5.5.

In this example, we assume the aggregated resource demands of any combinations of

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

64

Figure 5.5: Placement optimization at runtime. Light colored rectangle represents a live
node that still violates resource constraints. Dark colored rectangle stands for a solution
node contains a valid plan.

grouping three operators together exceed the resource constraint of a socket, and the

only optimal scheduling plan is shown beside the topology. The bottom left of the Figure

shows how our algorithm explores the searching space by expanding nodes, where the

label on the edge represents the collocation decision considered in the current iteration.

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

RootallocationDecisions(A,B)(A’,B)(B,C)A----A’----B-11-C---1(A,B)RootNode	#1Node	#1allocationDecisions(A,B)(A’,B)(B,C)AS0---A’----BS011-C---1Node	#2(B,C)SolutionAS0A’S0BS1CS1A’ABCNode	#3(A’,B)Node	#3allocationDecisions(A,B)(A’,B)(B,C)AS0---A’S1---BS010-C---1pruneNode	#2allocationDecisions(A,B)(A’,B)(B,C)AS0---A’----BS011-CS1--0Node	#4(B,C)Node	#5(A,B)Valid	andoptimal(A’,B)Valid	but	subopt(B,C)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

65

collocating all operators into the same socket, and it is larger than solution node hence

we need to further explore. At Node #2, we try to collocate A’ and B, which however

cannot be satisﬁed (due to the assumed resource constraint). As its bounding value is

worse than the solution (if obtained), it can be pruned safely. Node #3 will eventually

lead to a valid yet bad placement plan. One of the searching processes that leads to the

solution node is Root→Node #4→Node #5→Solution.

5.5 Algorithm Details

In this section, we ﬁrst present the detailed algorithm implementations including

operator replication optimization (shown in Algorithm 5.1) and operator placement

(shown in Algorithm 5.2). After that, we discuss observations made in applying

algorithms in optimizing our workload and their runtime (Section 5.5.1). We further

elaborate how our optimization paradigm can be extended with other optimization

techniques (Section 5.5.2).

Algorithm 5.1 illustrates our scaling algorithm based on topological sorting. Initially, we

set replication of each operator to be one (Lines 1∼2). The algorithm proceeds with this

and it optimizes its placement with Algorithm 5.2 (Line 6). Then, it stores the current

plan if it ends up with better performance (Lines 7∼8). At Lines 11∼17, we iterate over

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

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

66

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

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

67

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

number of valid operators and bounding value of each newly created nodes in parallel.

Finally, the newly created children nodes are pushed back to the stack.

5.5.1 Discussion

In this section, we discuss some observations made in applying algorithms in optimizing

our workload and their optimization runtime.

Observations. We have made some counter-intuitive observations in optimizing our

workload. First, placement algorithm (Algorithm 5.2) start with no initial solution (i.e.,

the solution.value is 0 initially at Line 9) by default, and we have tried to use a simple

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

68

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

ﬁrst-ﬁt (FF) placement algorithm to determine an initial solution node to potentially

speed up the searching process. In some cases, it accelerates the searching process

by earlier pruning and makes the algorithm converges faster, but in other cases, the

overhead of running the FF algorithm offsets the gains. Second, the placement algorithm

may fail to ﬁnd any valid plan as not able to allocate one or more operators due to

resource constraints, which causes scaling algorithm to terminate. It is interesting

to note that this may not indicates the saturation of the underlying resources but the

operator itself is too coarse-grained. The scaling algorithm can, instead of terminate

(at Algorithm 5.1 Line 10), try to further increase the replication level of operator that

“failed-to-allocate”. After that, workloads are essentially further partitioned among more

replicas and the placement algorithm may be able to ﬁnd a valid plan. This procedure,

however, introduces more complexity to the algorithm.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

69

Optimization runtime. The concerned placement optimization problem is difﬁcult to

solve as the solution space increase rapidly with large replication conﬁguration. Besides

the three proposed heuristics, we also apply a list of optimization tricks to further

increase the searching efﬁciency including 1) memorization in evaluating performance

model under a given execution plan (e.g., an operator should behave the same if its

relative placement with all of its producers are the same in different plans), 2) instead of

starting from scaling with replication set to one for all operators, we can start from a

reasonable large DAG conﬁguration to reduce the number of scaling iteration and 3)

the algorithm is highly optimized for higher concurrency (e.g., concurrently generate

branching children nodes). Overall, the placement algorithm needs less than 5 seconds

to optimize placement for a large DAG, and overall scaling takes less than 30 seconds,

which is acceptable, given the size of the problem and the fact that the generated plan can

be used for the whole lifetime of the application. As the streaming application potentially

runs forever, the overhead of generating a plan is not included in our measurement.

5.5.2 Extension with other optimization techniques

A number of optimization techniques are available in the literature [Hea14b]. Many

of them can be potentially applied to further improve the performance of BriskStream.

Our performance model is general enough such that it can be extended to capture other

optimization techniques.

Taking operator fusion as an example, operator fusion trades communication cost

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

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

70

The similar idea has been explored in recent work [Ge14]. In this paper, we focus

on operator scheduling and replication optimization, and we leave the evaluation of

extension to other optimization techniques as future work.

5.6 BriskStream System

Applying RLAS to existing DSPSs (e.g., Storm, Flink, Heron) is insufﬁcient to make them

scale on shared-memory multicore architectures. As they are not designed for multicore

environment [ZHD+17] , much of the overhead come from the system design itself. For

example, T e may be signiﬁcantly larger than T f , and NUMA effect has a minor impact

in the plan optimization. This is further validated in our experiments later.

We integrate RLAS optimization framework into BriskStream 2, a new DSPS

implemented from the ground up supporting the same APIs as Storm and Heron. Its

architecture shares many similarities to existing DSPSs including pipelined processing

and operator replication designs. To avoid reinventing the wheel, we reuse many

components found in existing DSPSs such as Storm, Heron and Flink, notably including

API design, application topology compiler, pipelined execution engine with communication

queue and back-pressure mechanism. Implementation details of BriskStream are given in

Section 5.7. According to Equation 5.1, both T e and T f shall be reduced in order to

improve output rate of an operator and subsequently improve application throughput.

In the following, we discuss two design aspects of BriskStream that are speciﬁcally

optimized for shared-memory architectures that reduce T e and T f signiﬁcantly. We also

discuss the extension of BriskStream with elasticity in Section 5.6.3.

5.6.1

Improving Execution Efﬁciency

As shown in the previous work [ZHD+17],

instruction footprint between two

consecutive invocations of the same function in existing DSPSs is large and resulting in

signiﬁcant instruction cache misses stalls. We avoid many unnecessary components to

reduce the instruction footprint, notably including (de)serialization, cross-process and

2The source code of BriskStream will be publicly available at https://bitbucket.org/

briskStream/briskstream.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

71

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

5.6.2

Improving Communication Efﬁciency

Most modern DSPSs [Sto, ﬂi, ZHD+17] employ buffering strategy to accumulate

multiple tuples before sending to improve the application throughput. BriskStream

follows the similar idea of buffering output tuples, but accumulated tuples are combined

into one “jumbo tuple” (see the example in Section 5.7). This approach has several

beneﬁts for scalability. First, since we know tuples in the same jumbo tuple are

targeting at the same consumer from the same producer in the same process, we can

eliminate duplicate tuple header (e.g., metadata, context information) hence reduces

communication costs. In addition, the insertion of a jumbo tuple (containing multiple

output tuple) requires only one-time access to the communication queue and effectively

amortizing the insertion overhead. As a result, both T e and T f are signiﬁcantly reduced.

5.6.3 Discussion on Elasticity

To examine the maximum system capacity, we assume input stream ingestion rate

(I) is sufﬁciently large and keeps the system busy. Hence, the model instantiation

and subsequent execution plan optimization are conducted at the same over-supplied

conﬁguration.

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

72

In practical scenarios, stream rate as well as its characteristics can vary over time.

Application needs to be re-optimized in response to workload changes [Cea16a,

GSHW14, Sea16].

In our context, the model instantiation may not have to be re-

performed as operator speciﬁcation, such as average time spent on handling each

tuple, does not vary if only input rates change. It needs to be re-performed, however, if

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

elasticity to BriskStream is, by itself, a nontrivial question. Previous study [Hea14a]

introduces a model to estimate the movement cost in terms of end-to-end latency.

Similar techniques may be applied, which we leave as future work to further enhance

our system.

5.7 Implementation details

BriskStream avoids designs that are not suitable for shared-memory multicore

architectures. For example, Heron has an operator-per-process execution environment,

where each operator in an application is launched as a dedicated JVM process. In

contrast, an application in BriskStream is launched in a JVM process, and operators

are launched as Java threads inside the same JVM process, which avoids cross-

process communication and allows the pass-by-reference message passing mechanism

(discussed in the end of this section).

Figure 5.6 presents an example job overview of BriskStream. Each operator (or the

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

73

Figure 5.6: Example job overview in BriskStream.

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

duplicating data in a shared-memory environment [ZHD+17]. Speciﬁcally, tuples

produced by operator are stored locally, and pointers as reference to tuple are inserted

into a communication queue. Together with the aforementioned junbo tuple design,

reference passing delay is minimized and becomes negligible.

Output	queuesPartition	strategyBufferingPartition	ControllerExecutor(parser)FetchDataSourceParserParser	(replica)Operator	as	a	taskCommunication	between	tasks……Be	fetchedJumbo	tuple	with	common	headerA	tuple	with	header……Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

74

(a) Fraud Detection (FD)

(b) Spike Detection (SD)

(c) Linear Road (LR)

Figure 5.7: Topologies of other three applications in our benchmark.

5.8 Evaluation

Our experiments are conducted in following aspects. First, our proposed performance

model accurately predict the application throughput under different execution plans

(Section 5.8.2). Second, BriskStream signiﬁcantly outperforms three existing open-

sourced DSPSs on multicores (Section 5.8.3). Third, our RLAS optimization approach

performs signiﬁcantly better than competing techniques (Section 5.8.4). We also show in

Section 5.8.5 the relative importance of several of BriskStream’s optimization techniques.

5.8.1 Experimental Setup

We pick four common applications from the previous study [ZHD+17] with different

characteristics to evaluate BriskStream. These tasks are word-count (WC), fraud-

detection (FD), spike-detection (SD), and linear-road (LR) with different topology

complexity and varying compute and memory bandwidth demand.

Topologies. We have shown the topology of WC before at Figure 5.2. Figure 5.7 shows

the topology of the other three applications.

ParserSpoutSinkPredictParserSpoutSinkSpikeDetectionMovingAverageParserAccountBalanceLast Average SpeedTollNotificationAccident NotificationDaily ExpensesCount VehiclesAccident DetectionAverageSpeedDispatcherSpoutSinkChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

75

Table 5.2: Operator selectivity of LR

Operator selectivity. As mentioned in Section 5.3.1, we omit and assume selectivity to be

one in our presentation of cost model. The selectivity is affected by both input workloads

and application logic. Parser and Sink have a selectivity of one in all applications. Splitter

has a output selectivity of ten in WC. That is, each input sentence contains 10 words.

Count has a output selectivity of one, thus it emits the counting results of each input

word to Sink. Operators have an output selectivity of one in both FD and SD. That

is, we conﬁgure that a signal is passed to Sink in both predictor operator of FD and

Spike detection operator of SD regardless of whether detection is triggered for an input

tuple. Operators may contain multiple output streams in LR. If an operator has only

one output stream, we denote its stream as default stream. We show the selectivity of

each output stream of them of LR in Table 5.2.

To examine the maximum system capacity under given hardware resources, we tune the

input stream ingress rate (I) to its maximum attainable value (Imax) to keep the system

busy and report the stable system performance 3. To minimize interference of operators,

3Back-pressure mechanism will eventually slow down spout so that the system is stably running at its

best achievable throughput.

OperatorNameInput streamsOutput streamsSelectivityDispatcherdefaultposition report≈0.99balance_stream≈0.0daliy_exp_request≈0.0Avg_speedposition reportavg_stream1.0Las_avg_speedavg_streamlas_stream1.0Accident_detectposition reportdetect_stream0.0Count_vehicleposition reportcounts_stream1.0Accident_notifydetect_stream,position reportnotify_stream0.0Toll_notifydetect_streamtoll_nofity_stream0.0position reporttoll_nofity_stream1.0counts_streamtoll_nofity_stream1.0las_streamtoll_nofity_stream1.0Daily_expendaliy_exp_requestdefault0.0Account_balancebalance_streamdefault0.0Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

76

Table 5.3: Characteristics of the two servers we use

we use OpenHFT Thread Afﬁnity Library [ope18] with core isolation (i.e., conﬁgure

isolcpus to avoid the isolated cores being used by Linux kernel general scheduler) to

bind operators to cores based on the given execution plan.

Table 5.3 shows the detailed speciﬁcation of our two eight-socket servers. NUMA

characteristics, such as local and inter-socket idle latencies and peak memory

bandwidths, are measured with Intel Memory Latency Checker [int18]. These two

machines have different NUMA topologies, which lead to different access latencies

and throughputs across CPU sockets. The three major takeaways from Table 5.3 are

as follows. First, due to NUMA, both Servers have signiﬁcantly high remote memory

access latency, which is up to 10 times higher than local cache access. Second, different

interconnect and NUMA topologies lead to quite different bandwidth characteristics on

these two servers. In particular, remote memory access bandwidth is similar regardless

of the NUMA distance in Server B. In contrast, it is signiﬁcantly lower across long

NUMA distance than smaller distance on Server A. Third, there is a signiﬁcant increase

in remote memory access latency from within the same CPU tray (e.g., 1 hop latency) to

between different CPU tray (max hops latency) on both servers.

We use Server A in Section 5.8.2, 5.8.3 and 5.8.5. We study our RLAS optimization

algorithms in detail on different NUMA architectures with both two servers in

HUAWEI	KunLunServers(Server	A)HPProLiant	DL980	G7	(Server	B)Processor	(HT	disabled)8x18	Intel	Xeon	E7-8890	at	1.2	GHz	8x8	Intel	Xeon	E7-2860at	2.27	GHz	Power	governorspowersaveperformanceMemory	per	socket1TB256	GBLocal	Latency	(LLC)50	ns50	ns1	hop	latency307.7	ns185.2	nsMax	hops	latency548.0	ns349.6	nsLocal	B/W54.3	GB/s24.2	GB/s1	hop	B/W13.2	GB/s10.6GB/sMax	hops	B/W5.8	GB/s10.8	GB/sTotal	local	B/W434.4	GB/s193.6	GB/sStatisticMachineChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

77

Section 5.8.4.

In addition to runtime statistics evaluation, we also report how much time each tuple

spends in different components of the system. We classify these work as follows: 1)

Execute refers to the average time spent in core function execution. Besides the actual

user function execution, it also includes various processor stalls such as instruction

cache miss stalls. 2) RMA refers to the time spend due to remote memory access. This is

only involved when the operator is scheduled to different sockets to its producers, and

it varies depending on the relative location between operators. 3) Others consist of all

other time spent in the critical execution path and considered as overhead. Examples

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

5.8.2 Performance Model Evaluation

In this section, we evaluate the accuracy of our performance model. We ﬁrst evaluate

the estimation of the cost of remote memory access. We take Split and Count operators

of WC as an example. Table 5.4 compares the measured and estimated process time per

tuple (T ) of each operator. Our estimation generally captures the correlations between

remote memory access penalty and NUMA distance. The estimation is larger than

measurement, especially for Splitter. When the input tuple size is large (in case of

Splitter), the memory accesses have better locality and the hardware prefetcher helps in

reducing communication cost [LKV12]. Another observation is that there is a signiﬁcant

increase of RMA cost from between sockets from the same CPU tray (e.g., S0 to S1) to

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

78

between sockets from different CPU tray (e.g., S0 to S4). Such non-linear increasing of

RMA cost has a major impact on the system scalability as we need to pay signiﬁcantly

more communication overhead for using more than 4 sockets.

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

To validate the overall effectiveness of our performance model, we show the relative

error associated with estimating the application throughput by our analytical model.
The relative error is deﬁned as relative_error = |Rmeas−Rest|

, where Rmeas is the

Rmeas

measured application throughput and Rest is the estimated application throughput

by our performance model for the same application.

The model accuracy evaluation of all applications under the optimal execution plan

on eight CPU sockets is shown in Table 5.5. Overall, our estimation approximates the

measurement well for the performance of all four applications. It is able to produce the

optimal execution plan and predict the relative performance with the differences less

than 2%.

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

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

79

Figure 5.8: Throughput speedup.

5.8.3 Evaluation of Execution Efﬁciency

This section shows that BriskStream signiﬁcantly outperforms existing DSPSs on shared-

memory multicores. We compare BriskStream with two open-sourced DSPSs including

Apache Storm (version 1.1.1) and Flink (version 1.3.2). For a better performance, we

disable the fault-tolerance mechanism in all comparing systems. We use Flink with

NUMA-aware conﬁguration (i.e., one task manager per CPU socket), and as a sanity

check, we have also tested Flink with single task manager, which shows even worse

performance. We also compare BriskStream with StreamBox, a recent single-node DSPS

at the end of this section.

Throughput and Latency comparison. Figure 5.8 shows the signiﬁcant throughput

speedup of BriskStream compared to Storm and Flink. Overall, Storm and Flink

show comparable performance for three applications including WC, FD and SD. Flink

performs poorly for LR compared to Storm. A potential reason is that Flink requires

additional stream merger operator (implemented as the co-ﬂat map) that merges

multiple input stream before feeding to an operator with multi-input streams (commonly

found in LR). Neither Storm nor BriskStream has such additional overhead.

Following the previous work [Dea14], we deﬁne the end-to-end latency of a streaming

workload as the duration between the time when an input event enters the system

and the time when the results corresponding to that event is generated. This is one

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

Figure 5.9: End-to-end latency of WC on different
DSPSs.

of the key metrics in DSPS that signiﬁcantly differentiate itself to traditional batch

based system such as MapReduce. We compare the end-to-end process latency among

different DSPSs on Server A. Figure 5.9 shows the detailed CDF of end-to-end processing

latency of WC comparing different DSPSs and Table 5.6 shows the overall 99-percentile

end-to-end processing latency comparison of different applications. The end-to-end

latency of BriskStream is signiﬁcantly smaller than both Flink and Storm. Despite

that our optimization focuses on maximizing system throughput, the much-improved

throughput reduces queueing delay [Dea14] and consequently reduces latency.

Evaluation of scalability on varying CPU sockets. Our next experiment shows that

BriskStream scales effectively as we increase the numbers of sockets. RLAS re-optimizes

the execution plan under a different number of sockets enabled. Figure 5.10a shows

the better scalability of BriskStream than existing DSPSs on multi-socket servers by

taking LR as an example. Both unmanaged thread interference and unnecessary

remote memory access penalty prevent existing DSPSs from scaling well on the modern

multi-sockets machine. We show the scalability evaluation of different applications of

BriskStream in Figure 5.10b. There is an almost linear scale up from 1 to 4 sockets for

all applications. However, the scalability becomes poor when more than 4 sockets are

used. This is because of a signiﬁcant increase of RMA penalty between upper and lower

CPU tray. In particular, RMA latency is about two times higher between sockets from

00.20.40.60.810.1101000100000Cumulative percentEnd-to-end process latency (ms)BriskFlinkStormChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

81

(a) Systems

(b) Applications

Figure 5.10: Scalability evaluation.

different tray than the other case.

To better understand the effect of RMA overhead during scaling, we compare the

theoretical bounded performance without RMA (denoted as “W/o rma“) and ideal

performance if the application is linearly scaled up to eight sockets (denoted as “Ideal”)

in Figure 5.11. The bounded performance is obtained by evaluating the same execution

plan on eight CPU sockets by substituting RMA cost to be zero. There are two major

insights taking from Figure 5.11. First, theoretically removing RMA cost (i.e., “W/o

rma“) achieves 89 ∼ 95% of the ideal performance, and it hence conﬁrms that the

signiﬁcant increase of RMA cost is the main reason that BriskStream is not able to scale

linearly on 8 sockets. Furthermore, we still need to re-optimize the execution plan to

achieve optimal performance in the presence of changing RMA cost (e.g., in this extreme

case, it is reduced to zero).

Per-tuple execution time breakdown. To better understand the source of performance

improvement, we show the per-tuple execution time breakdown by comparing

BriskStream and Storm. Figure 5.12 shows the breakdown of all non-source operators

of WC, which we use as the example application in this study for its simplicity. We

perform analysis in two groups: local stands for allocating all operators to the same

socket, and remote stands for allocating each operator max-hop away from its producer

to examine the cost of RMA.

0250050007500100000510Throughput (k event /s)Number of CPU socketsBriskStreamStormFlink0%100%200%300%400%500%600%WCFDSDLRNormalized Throughput1 socket2 sockets4 sockets8 socketsChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

82

Figure 5.11: Gaps to ideal.

Figure 5.12: Execution time breakdown.

In the local group, we compare execution efﬁciency between BriskStream and Storm.

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

contrast, BriskStream signiﬁcantly reduces T e (discussed in Section 5.6) and the NUMA

effect, as a result of improving efﬁciency of other components, becomes a critical issue to

optimize. In the future, on one hand, T e may be further reduced with more optimization

020000400006000080000100000120000WCFDSDLRThroughput (k events /s)MeasuredIdealW/o rma020004000600080001000012000Processing time per tuple (ns)RMAOthersExecuteStorm (local)Brisk (remote)Brisk (local)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

83

techniques deployed. On the other hand, servers may scale to even more CPU sockets

(with potentially larger max-hop remote memory access penalty). We expect that those

two trends make the NUMA effect continues to play an important role in optimizing

streaming computation on shared-memory multicores.

Comparing with single-node DSPS. Streambox [MPJ+17] is a recently proposed DSPS

based on a morsel-driven like execution model – a different processing model of

BriskStream. We compare BriskStream with StreamBox [MPJ+17] using WC application.

Results in Figure 5.13 demonstrate that BriskStream outperforms StreamBox signiﬁcantly

regardless of number of CPU cores used in the system. Note that, StreamBox focuses

on solving out-of-order processing problem, which requires more expensive processing

mechanisms such as locks and container design. Due to a different system design

objective, BriskStream currently does not provide ordered processing guarantee and

consequently does not bear such overhead.

For a better comparison, we modify StreamBox to disable its order-guaranteeing feature,

denoted as StreamBox (out-of-order), so that tuples are processed out-of-order in both

systems. Despite its efﬁciency at smaller core counts, it scales poorly when multi-sockets

are used. There are two main reasons. First, StreamBox relies on a centralized task

scheduling/distribution mechanism with locking primitives, which brings signiﬁcant

overhead under large core counts. Second, WC needs the same word being counted

by the same counter, which requires a data shufﬂing operation in StreamBox. Such

data shufﬂing operation introduces signiﬁcant remote memory access under large core

counts, which is sub-optimized for NUMA overhead in its current stage. We compare

their NUMA overhead during execution using Intel Vtune Ampliﬁer [Vtu]. We observe

that, under 8 sockets (144 cores), BriskStream issues in average 0.09 cache misses served

remotely per k events (misses/k events), which is only 1.5% of StreamBox’s 6 misses/k

events.

5.8.4 Evaluation of RLAS algorithms

In this section, we study the effectiveness of RLAS optimization and compare it with

competing techniques.

The necessity of considering varying processing capability.

To gain a better

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

84

Figure 5.13: Comparing with StreamBox.

understanding of the importance of relative-location awareness, we consider an

alternative algorithm that utilizes the same searching process of RLAS but assumes

each operator has a ﬁxed processing capability. Such approach essentially falls back

to the original RBO model, and is also similar to some previous works in a high level

point of view [Ge14, Kea09]. In our context, we need to ﬁx T f of each operator to a

constant value. We consider two extreme cases. First, the lower bound case, namely

RLAS_f ix(L), assumes each operator pessimistically always includes remote access

overhead. That is, T f is calculated by anti-collocating an operator to all of its producers.

Second, the upper bound case, namely RLAS_f ix(U ), completely ignores RMA, and

T f is set to 0 regardless the relative location of an operator to its producers.

The comparison results are shown in Figure 5.14. RLAS shows a 19% ∼ 39%

improvement over RLAS_f ix(L). We observe that RLAS_f ix(L) often results in

smaller replication conﬁguration of the same application compared to RLAS and hence

underutilize the underlying resources. This is because it over-estimates the resource

demand of operators that are collocated with producers. Conversely, RLAS_f ix(U )

under-estimates the resource demands of operators that are anti-collocated and misleads

optimization process to involve severely thread interference. Over the four workloads,

RLAS shows a 119% ∼ 455% improvement over RLAS_f ix(U ). Potentially, RLAS_f ix

0100002000030000400005000060000700008000090000248163272144Throughput (k events/s)BriskStreamStreamBoxStreamBox (out-of-order)on 1 socket(soc.)2soc.4soc.8soc.471.2Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

85

Figure 5.14: RLAS w/ and w/o considering varying RMA cost.

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

constraints, they will gradually relax constraints (i.e., using an increased, yet faked, total

resource per socket during determining if the give execution plan satisfying constraints)

until a plan is obtained. We also conﬁgure external input rate (I) to just overfeed the

system on Server A, and using the same I to test on Server B. The results are shown in

Figure 5.15. There are two major takeaways.

First, RLAS generally outperforms other placement techniques on both two Servers. FF

can be view as a minimizing trafﬁc heuristic-based approach as it greedily allocates

neighbor operators (i.e., directly connected) together due to its topologically sorting

step. Several related work [Xe14, Ae13] adopt a similar approach of FF in duelling with

020000400006000080000100000120000WCFDSDLRThroughput (k events/s)RLASRLAS_fix(L)RLAS_fix(U)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

86

Table 5.7: Placement strategies

(a) Server A

(b) Server B

Figure 5.15: Placement strategy comparison under the same replication conﬁguration.

NamePlacement strategy detailsOSthe placement is left to the operating system (Both our servers use Linux-based OS)FFoperators are first topologically sorted and then placed in a first-fit manner (start placing from Spout)RRoperators are placed in a round-robin manner on each CPU socket00.20.40.60.81WCFDSDLRNormalized ThroughputOSFFRR00.20.40.60.81WCFDSDLRNormalized ThroughputOSFFRRChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

87

operator placement problem in the distributed environment. However, it performs

poorly, and we ﬁnd that during its searching for optimal placements, it often falls into

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

hits the scaling limits. All operators (incl. replicas) are then randomly placed. Results of

Figure 5.16 show that none of the random plans is better than RLAS. It demonstrates that

random plans hurt the performance in a high probability due to the huge optimization

space.

We further observe two properties of optimized plans of RLAS, which are also found

in randomly generated plans with relatively good performance. First, operators of

FD and LR are completely avoided being remotely allocated across different CPU-

tray to their producers. This indicates that the RMA overhead, of across CPU-tray,

should be aggressively avoided in these two applications. Second, resources are highly

Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

88

Figure 5.16: CDF of random plans.

appreciated in RLAS. Most operators (incl. replicas) end up with being “just fulﬁlled”,

i.e., ro = ro = ri. This effectively reveals the shortcoming of existing heuristics based

approach – maximizing an operator’s performance may be worthless or even harmful

to the overall system performance as it may already overfeed its downstream operators.

Further increasing its performance (e.g., scaling it up or making it allocated together

with its producers) is just a waste of the precious computing resource.

Communication pattern.

In order to understand the impact of different NUMA

architectures on RLAS optimization, we show communication pattern matrices of

running WC with an optimal execution plan in Figure 5.17. The same conclusion

applies to other applications and hence omitted. Each point in the ﬁgure indicates the

summation of data fetch cost (i.e., T f ) of all operators from the x-coordinate (Si) to

y-coordinate (Sj). The major observation is that the communication requests are mostly

sending from one socket (S0) to other sockets in Server A, and they are, in contrast, much

more uniformly distributed among different sockets in Server B. The main reason is

that the remote memory access bandwidth is almost identical to local memory access in

Server B thanks to its glue-assisted component as discussed in Section 5.2, and operators

are hence more uniformly placed at different sockets.

Varying the compression ratio (r). RLAS allows to compress the execution graph (with

a ratio of r) to tune the trade-off between optimization granularity and searching space.

00.20.40.60.81200020000200000Cumulative percent Throughput (k events/s)WC (random)FD (random)SD (random)LR (random)WC (RLAS)FD (RLAS)SD (RLAS)LR (RLAS)WC (random)WC (RLAS)SD (RLAS)LR (RLAS)FD (RLAS)FD (random)LR (random)SD (random)Chapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

89

Figure 5.17: Communication pattern matrices of WC on two Servers.

We use WC as an example to show its impact as shown in Table 5.8. Similar trend is

observed in other three applications. Note that, a compressed graph contains heavy

operators (multiple operators grouped into one), which may fail to be allocated and

requires re-optimize. This procedure introduces more complexity to the algorithm,

which leads to higher runtime as shown in Table 5.8. Due to space limitation, a detailed

discussion is presented in Section 5.5.1.

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

Server AServer BChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

90

Figure 5.18: A factor analysis for BriskStream. Changes are added left to right and are
cumulative.

5.8.5 Factor Analysis

To understand in greater detail the overheads and beneﬁts of various aspects of

BriskStream, we show a factor analysis in Figure 5.18 that highlights the key factors

for performance. Simple refers to running Storm (version 1.1.1) directly on shared-

memory multicores. -Instr.footprint refers to BriskStream with much smaller instruction

footprint and avoiding unnecessary/duplicate objects as described in Section 5.6.1.

+JumboTuple further allows BriskStream to reduce the cross-operator communication

overhead as described in Section 5.6.2. In the ﬁrst three cases, the system is optimized

under RLAS_f ix(L) scheme without considering varying RMA cost. +RLAS adds

our NUMA aware execution plan optimization as described in Section 5.3. The major

takeaways from Figure 5.18 are that jumbo tuple design is important to optimize existing

DSPSs on shared-memory multicore architecture and our RLAS optimization paradigm

is critical for DSPSs to scale different applications on modern multicores environment

addressing NUMA effect.

5.9 Summary

We have introduced BriskStream, a new data stream processing system with a new

streaming execution plan optimization paradigm, namely Relative-Location Aware

0100002000030000400005000060000700008000090000100000WCFDSDLRThroughput (k events/s)simple-Instr.footprint+JumboTuple+RLASChapter 5. BriskStream: Scaling Data Stream Processing on
Shared-Memory Multicore Architectures

91

Scheduling (RLAS). BriskStream scales stream computation towards a hundred of

cores under NUMA effect. The experiments on eight-sockets machines conﬁrm that

BriskStream signiﬁcantly outperforms existing DSPSs up to an order of magnitude

even without the tedious tuning process. We hope our study on relative-location

aware scheduling could shed lights on other NUMA-aware execution plan optimization

research.

CHAPTER 6

Future Works

Data stream processing systems (DSPSs) are gaining their popularities in powering

modern IoT (Internet-of-Things) and data streaming applications [FMKP13, WT, Gea15,

ﬂi, Sto, her]. Thanks to the popularity of modern commodity machines with massively

parallel processors, researchers and practitioners nowadays can perform ultra-fast

stream processing on a single multicore machine [ZHD+17, Kea16, MPJ+17, ZHZH19a].

Unfortunately, existing DSPSs did not pay much attention to transactional state

management, which aims to provide built-in application state storage and retrieval

capability with consistency guarantee.

DSPS with transactional state management relieves users from managing state

consistency by themselves, and has recently received attention from both academia

and industry community [Mea, Tra18, sta18]. However, scaling stream processing

while providing transactional state management on modern multicore processors is

challenging. On the one hand, to achieve both low latency and high throughput, DSPSs

need to exploit parallelism aggressively, often through pipelined processing and data

parallelism [ZHD+17, ZHZH19a], where each operator of a stream application can be

carried by multiple threads and running concurrently. On the other hand, as operators

may concurrently access the same application state, higher parallelism leads to higher

chances of violating transactional state consistency [Cea]. To make things worse, more

than simply the ACID properties preserved in the relational database systems, DSPSs

further need to guarantee the state access order following the input event sequence.

As a result, today’s DSPSs often force user to select from either strict consistency

guarantee with limited concurrency (e.g., synchronizing every state access with

locks [Bea, Weaa, Mea]) or high concurrency with limited (or no) state consistency

93

Chapter 6. Future Works

94

guarantee (e.g., Storm [Sto], Flink [ﬂi]). In particular, prior studies on transactional

state management in DSPSs [Mea, Cea, Bea, Weaa] commonly adopt a synchronized

execution model, which performs state maintenance within the application computation

logic and enforces access ordering of each transaction with synchronization primitives.

There are two main issues with this design. First, executing the state access operations

following the dependencies encoded in the (potentially complex) streaming computation

logic can cause extra long execution stall in stream processing, consequently degrading

the overall performance. Second, to preserve state access ordering, each state transaction

is synchronized with locks to guard correct locking sequence, which can cause high

performance overhead under highly contended workloads.

Witnessing those issues, we are designing T-Stream, a new DSPS that can support highly

scalable stream processing with transactional state consistency guarantee on multicores.

Our initial experiment study on a high-performance 40-core machine with real-world

use cases show that BriskStream achieves a multi-times higher throughput on average

over existing solutions with similar or even smaller end-to-end processing latency.

CHAPTER 7

Conclusion

In this thesis proposal, we presented our exploration on the design and implementation

of scalable multicore main-memory DSPSs for supporting modern stream analytic

workloads. We performed a comprehensive study on the DSPS architectures, and

optimized the system performance by investigating and addressing the scalability

bottlenecks from two major DSPS components, including execution plan optimization

and state management. Our main contributions are summarized as follows.

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

with a new streaming execution plan optimization paradigm, namely Relative-Location

Aware Scheduling (RLAS). BriskStream scales stream computation towards a hundred

of cores under NUMA effect. The experiments on eight-sockets machines conﬁrm that

95

Chapter 7. Conclusion

96

BriskStream signiﬁcantly outperforms existing DSPSs up to an order of magnitude

even without the tedious tuning process. We hope our study on relative-location

aware scheduling could shed lights on other NUMA-aware execution plan optimization

research.

T-Stream: Scaling Stream Processing with Transactional State Management on

Multicores. Towards a complete thesis, we are currently investigating the issue of

scaling stream processing while providing transactional state consistency on multicores.

Particularly, we are designing T-Stream with a new architectural design. In order to

take advantage of multi-core architectures, T-Stream detaches the state management

from the streaming computation logic, and performs its internal state maintenance

asynchronously. By eliminating the expensive synchronization primitives, T-Stream

aggressively extracts parallelism opportunities by revealing the operation dependencies

at runtime and guarantees the order for the access operations according to the

timestamps attached to the incoming events. We evaluate T-Stream in detail on a

modern 40-core machine. Our initial results have shown that T-Stream achieves a 2x

higher throughput on average over existing solutions with similar or even smaller

end-to-end processing latency.

7.1 Selected Publications

In this section, we list the main articles (published or under-review) contributed to the

thesis.

1. Shuhao Zhang, Bingsheng He, Daniel Dahlmeier, Amelie Chi Zhou, Thomas

Heinze, “Revisiting the design of data stream processing systems on multi-core

processors” ICDE, 2017

2. Shuhao Zhang, Jiong He, Amelie Chi Zhou, Bingsheng He, “BriskStream: Scaling

Data Stream Processing on Shared-Memory Multicore Architectures” SIGMOD,

2019

3. Shuhao Zhang, Yingjun Wu, Feng Zhang, Bingsheng He, “Scaling Stream

Processing with Transactional State Management on Multicores” Under Review

Chapter 7. Conclusion

97

7.2 Other Publications

In this section, we list the articles authored or co-authored during the author’s Ph.D.

journey.

1. Shuhao Zhang, Hoang Tam Vo, Daniel Dahlmeier, Bingsheng He, “Multi-Query

Optimization for Complex Event Processing in SAP ESP” ICDE, 2017

2. Shanjiang Tang, Bingsheng He, Shuhao Zhang, Zhaojie Niu “Elastic Multi-

Resource Fairness: Balancing Fairness and Efﬁciency in Coupled CPU-GPU

Architectures" SC, 2016.

3. Zeke Wang, Shuhao Zhang, Bingsheng He,Wei Zhang “Melia: A MapReduce

Framework on OpenCL-Based FPGAs" IEEE TPDS, 2016.

4. Jiong He, Shuhao Zhang, Bingsheng He “In-Cache Query Co-Processing on Coupled

CPU-GPU Architectures", VLDB, 2015.

References

[AAB+]

Daniel J Abadi, Yanif Ahmad, Magdalena Balazinska, Ugur Cetintemel,

Mitch Cherniack, Jeong-Hyon Hwang, Wolfgang Lindner, Anurag Maskey,

Alex Rasin, Esther Ryvkina, et al. The design of the borealis stream

processing engine. In CIDR’05.

[ABB+13] Tyler Akidau, Alex Balikov, Kaya Bekiro ˘glu, Slava Chernyak, Josh

Haberman, Reuven Lax, Sam McVeety, Daniel Mills, Paul Nordstrom, and

Sam Whittle. Millwheel: Fault-tolerant stream processing at internet scale.

Proc. VLDB Endow., 6(11):1033–1044, August 2013.

[ABW06] Arvind Arasu, Shivnath Babu, and Jennifer Widom. The cql continuous

query language: Semantic foundations and query execution. The VLDB

Journal, 15(2):121–142, June 2006.

[Ae04]

Arvind Arasu and et al. Linear Road: A Stream Data Management

Benchmark. In VLDB, 2004.

[Ae05]

Daniel J Abadi and et al. The Design of the Borealis Stream Processing

Engine. In CIDR, 2005.

[Ae09]

Anastassia Ailamaki and et al. DBMSs on a Modern Processor: Where Does

Time Go? In VLDB, 2009.

[Ae13]

Leonardo Aniello and et al. Adaptive online scheduling in storm. In DEBS,

2013.

[Ae15]

Ahsan Javed Awan and et al. Performance Characterization of In-Memory

Data Analytics on a Modern Cloud Server. In BDCloud, 2015.

[Aea03]

DanielJ. Abadi and et al. Aurora: a new model and architecture for data

stream management. The VLDB Journal, 12(2), 2003.

99

References

100

[Aea12]

M. Akdere and et al. Learning-based query performance modeling and

prediction. In ICDE, 2012.

[Aea13]

Raja Appuswamy and et al. Scale-up vs scale-out for hadoop: Time to

rethink? In SoCC, 2013.

[BCM06]

Roger S. Barga and Hillary Caituiro-Monge. Event correlation and pattern

detection in cedr. In EDBT Workshops, 2006.

[Be99]

Peter A. Boncz and et al. Database Architecture Optimized for the new.

Bottleneck: Memory Access. In VLDB, 1999.

[Be11]

Giuseppe Bianchi and et al. On-demand time-decaying bloom ﬁlters for

telemarketer detection. SIGCOMM Comput. Commun. Rev., 2011.

[Be13]

Cagri Balkesen and et al. Main-Memory Hash Joins on Multi-Core CPUs:

Tuning to the Underlying Hardware. In ICDE, 2013.

[Bea]

Irina Botan and et al. Transactional stream processing. In EDBT’12.

[Ben]

Benchmarking Streaming Computation Engines at Yahoo!

https:

//yahooeng.tumblr.com/post/135321837876/benchmarking-

streaming-computation-engines-at.

[BG]

Philip A. Bernstein and Nathan Goodman. Concurrency control in

distributed database systems. ACM Comput. Surv. 1981.

[BSGT04]

Surendra Byna, Xian He Sun, William Gropp, and Rajeev Thakur. Predicting

memory-access cost based on data-access patterns. In ICCC, 2004.

[CDW17]

Juan A. Colmenares, Reza Dorrigiv, and Daniel G. Waddington. Ingestion,

indexing and retrieval of high-velocity multidimensional sensor data on a

single node. volume abs/1707.00825, 2017.

[Ce03]

Sirish Chandrasekaran and et al. Telegraphcq: Continuous dataﬂow

processing for an uncertain world. In CIDR, 2003.

[Ce12]

J. Chauhan and et al. Performance Evaluation of Yahoo! S4: A First Look.

In 3PGCIC, 2012.

References

101

[Cea]

Ugur Cetintemel and et al. S-store: A streaming newsql system for big

velocity applications. Proc. VLDB Endow. 2014.

[Cea13]

Alvin Cheung and et al. Speeding up database applications with pyxis. In

SIGMOD, 2013.

[Cea16a]

V. Cardellini and et al. Elastic stateful stream processing in storm. In HPCS,

2016.

[Cea16b]

Valeria Cardellini and et al. Optimal operator placement for distributed

stream processing applications. In DEBS, 2016.

[Cea17]

Valeria Cardellini and et al. Optimal operator replication and placement

for distributed stream processing systems. In SIGMETRICS Perform. Eval.

Rev., March 2017.

[CEF+17]

Paris Carbone, Stephan Ewen, Gyula Fóra, Seif Haridi, Stefan Richter,

and Kostas Tzoumas. State management in apache ﬂink&reg;: Consistent

stateful distributed stream processing. Proc. VLDB Endow., 10(12):1718–1729,

August 2017.

[CGB+15] Badrish Chandramouli, Jonathan Goldstein, Mike Barnett, Robert DeLine,

Danyel Fisher, John Platt, James Terwilliger, John Wernsing, and Rob

DeLine. Trill: A high-performance incremental query processor for diverse

analytics. VLDB - Very Large Data Bases, August 2015.

[cla]

Classmexer agent. http://www.javamex.com/classmexer/.

[De14]

Tathagata Das and et al. Adaptive Stream Processing using Dynamic Batch

Sizing. In SOCC, 2014.

[Dea04]

David Detlefs and et al. Garbage-ﬁrst Garbage Collection. In ISMM, 2004.

[Dea14]

Tathagata Das and et al. Adaptive stream processing using dynamic batch

sizing. SOCC, 2014.

[Fea]

Jose M. Faleiro and et al. Lazy evaluation of transactions in database

systems. In SIGMOD ’14.

[ﬂi]

Apache Flink. https://flink.apache.org/.

References

102

[FMKP13] Raul Castro Fernandez, Matteo Migliavacca, Evangelia Kalyvianaki, and

Peter R. Pietzuch.

Integrating scale out and fault tolerance in stream

processing using operator state management. In SIGMOD, 2013.

[Fra]

Fraud-detection. https://pkghosh.wordpress.com/2013/10/21/

real-time-fraud-detection-with-sequence-mining/.

[G+03]

STREAM Group et al. Stream: The stanford stream data manager. Technical

report, Stanford InfoLab, 2003.

[Ge14]

Jana Giceva and et al. Deployment of Query Plans on Multicores. Proc.

VLDB Endow., 2014.

[Gea15]

Javad Ghaderi and et al. Scheduling Storms and Streams in the Cloud. In

SIGMETRICS, 2015.

[GH]

Olivier Goldschmidt and Dorit S. Hochbaum. A Polynomial Algorithm for

the k-Cut Problem for Fixed k. Mathematics of Operations Research.

[Gra92]

Jim Gray. Benchmark Handbook: For Database and Transaction Processing

Systems. Morgan Kaufmann Publishers Inc., San Francisco, CA, USA, 1992.

[GSHW14] B. Gedik, S. Schneider, M. Hirzel, and K. L. Wu. Elastic scaling for data

stream processing. TPDS, 2014.

[HA06]

Stavros Harizopoulos and Anastassia Ailamaki. Improving Instruction

Cache Performance in OLTP. ACM Trans. Database Syst., 2006.

[He05]

Bingsheng He and et al. Cache-conscious automata for xml ﬁltering. In

ICDE, 2005.

[Hea]

Rachael Harding and et al. An evaluation of distributed concurrency control.

Proc. VLDB Endow. 2017.

[Hea14a]

Thomas Heinze and et al. Latency-aware Elastic Scaling for Distributed

Data Stream Processing Systems. TPDS, 2014.

[Hea14b] Martin Hirzel and et al. A catalog of stream processing optimizations. ACM

Comput. Surv., 2014.

[her]

Heron, url: https://twitter.github.io/heron/.

References

103

[HPE18]

Hp proliant dl980 g7 server with hp prema architecture technical overview,

2018.

[IHBZ10] C. Iancu, S. Hofmeyr, F. Blagojevi´c, and Y. Zheng. Oversubscription on

multicore processors. In IPDPS, 2010.

[Int]

Intel

lab data.

http://db.csail.mit.edu/labdata/labdata.

html.

[int18]

Intel memory latency checker, https://software.intel.com/

articles/intelr-memory-latency-checker, 2018.

[Je06]

Navendu Jain and et al. Design, Implementation, and Evaluation of the

Linear Road Bnchmark on the Stream Processing Core. In SIGMOD, 2006.

[Kea09]

Rohit Khandekar and et al.

Cola: Optimizing stream processing

applications via graph partitioning. In Middleware, 2009.

[Kea16]

Alexandros Koliousis and et al. Saber: Window-based hybrid stream

processing for heterogeneous architectures. In SIGMOD, 2016.

[LC99]

Devroye Luc and Zamora-Cura Carlos. On the complexity of branch-and

bound search for random trees. Random Struct. Algorithms, 1999.

[Le13]

Yinan Li and et al. NUMA-aware algorithms: the case of data shufﬂing. In

CIDR, 2013.

[Le14]

Viktor Leis and et al. Morsel-driven Parallelism: A NUMA-aware Query

Evaluation Framework for the Many-core Age. In SIGMOD, 2014.

[LKV12]

Jaekyu Lee, Hyesoon Kim, and Richard Vuduc. When prefetching works,

when it doesn&rsquo;t, and why. ACM Trans. Archit. Code Optim., 2012.

[LXTW18] Teng Li, Zhiyuan Xu, Jian Tang, and Yanzhi Wang. Model-free control for

distributed stream data processing using deep reinforcement learning. Proc.

VLDB Endow., 2018.

[man]

Intel 64 and IA-32 Architectures optimization Reference Manual.

http://www.intel.sg/content/dam/www/public/us/en/

References

104

documents/manuals/64-ia-32-architectures-optimization-

manual.pdf.

[Me09]

Marcelo R. Mendes and et al. Performance Evaluation and Benchmarking.

chapter A Performance Study of Event Processing Systems. Springer-Verlag,

Berlin, Heidelberg, 2009.

[Mea]

John Meehan and et al. S-store: streaming meets transaction processing.

Proc. VLDB Endow. 2015.

[Mea16]

David R. Morrison and et al. Branch-and-bound algorithms: A survey of

recent advances in searching, branching, and pruning. Discrete Optimization,

2016.

[MPJ+17] Hongyu Miao, Heejin Park, Myeongjae Jeon, Gennady Pekhimenko,

Kathryn S. McKinley, and Felix Xiaozhu Lin. Streambox: Modern stream

processing on a multicore machine. In ATC, 2017.

[NRNK10] L. Neumeyer, B. Robbins, A. Nair, and A. Kesari. S4: Distributed Stream

Computing Platform. In ICDMW, 2010.

[NUM17] Numa patch for ﬂink, https://issues.apache.org/jira/browse/

FLINK-3163., 2017.

[ope18]

Openhft, 2018.

[Pe15]

Boyang Peng and et al. R-Storm: Resource-Aware Scheduling in Storm. In

Middleware, 2015.

[Pea11]

Achille Peternier and et al. Overseer: low-level hardware monitoring and

management for java. In PPPJ, 2011.

[Pea15]

Boyang Peng and et al. R-storm: Resource-aware scheduling in storm. In

Middleware, 2015.

[Pea16]

Iraklis Psaroudakis and et al. Adaptive NUMA-aware data placement and

task scheduling for analytical workloads in main-memory column-stores.

Proc of the VLDB Endow., 2016.

[PI]

Performance Inspector. http://perfinsp.sourceforge.net.

References

105

[PLS+06]

P. Pietzuch, J. Ledlie, J. Shneidman, M. Roussopoulos, M. Welsh, and

M. Seltzer. Network-aware operator placement for stream-processing

systems. In ICDE, 2006.

[PPB+12] Danica Porobic, Ippokratis Pandis, Miguel Branco, Pinar Tözün, and

Anastasia Ailamaki. Oltp on hardware islands. PVLDB, 2012.

[RDS+04] Elke A. Rundensteiner, Luping Ding, Timothy Sutherland, Yali Zhu, Brad

Pielech, and Nishant Mehta. Cape: Continuous query engine with

heterogeneous-grained adaptivity, 2004.

[Ris]

Uppsala University Linear Road Implementations. http://www.it.uu.

se/research/group/udbl/lr.html.

[Sam]

Apache Samza. http://samza.apache.org/.

[SC14]

Matthias J Sax and Malu Castellanos. Building a Transparent Batching

Layer for Storm. 2014.

[Sea16]

Scott Schneider and et al. Dynamic Load Balancing for Ordered Data-

Parallel Regions in Distributed Streaming Systems. 2016.

[sgi]

SGI UVTM 300H System Speciﬁcations. https://www.sgi.com/pdfs/

4559.pdf.

[Sma18]

Apache

smaza,

https://samza.apache.org/learn/

documentation/0.7.0/container/state-management.html,

2018.

[SP14]

Shriram Sridharan and Jignesh M. Patel. Proﬁling R on a Contemporary

Processor. Proc. VLDB Endow., 2014.

[sta18]

Stateful stream processing in ﬂink, 2018.

[Sto]

Apache Storm. http://storm.apache.org/.

[Te15]

Kian-Lee Tan and et al.

In-memory Databases: Challenges and

Opportunities From Software and Hardware Perspectives. SIGMOD Rec.,

2015.

References

106

[Tra18]

Data Artisans Streaming Ledger Serializable ACID Transactions on

Streaming Data. 2018.

[VN02]

Stratis D. Viglas and Jeffrey F. Naughton. Rate-based query optimization

for streaming information sources. In SIGMOD, 2002.

[Vtu]

Intel VTune Ampliﬁer.

https://software.intel.com/en-us/

intel-vtune-amplifier-xe.

[Weaa]

Di Wang and et a. Active complex event processing over event streams.

Proc. VLDB Endow. 2011.

[Weab]

Yingjun Wu and et al. An empirical evaluation of in-memory multi-version

concurrency control. Proc. VLDB Endow. 2017.

[Weac]

Yingjun Wu and et al. Transaction Healing : Scaling Optimistic Concurrency

Control on Multicores.

[WMC+16] Zhaoguo Wang, Shuai Mu, Yang Cui, Han Yi, Haibo Chen, and Jinyang

Li. Scaling multicore databases via constrained parallel execution.

In

Proceedings of the 2016 International Conference on Management of Data,

SIGMOD ’16, pages 1643–1658, New York, NY, USA, 2016. ACM.

[Wor]

Data request to 98 world cup web site.

ita.ee.lbl.gov/html/

contrib/WorldCup.html.

[WT]

Yingjun Wu and Kian-Lee Tan. Chronostream: Elastic stateful stream

computation in the cloud. In ICDE’15.

[Xe14]

Jielong Xu and et al. T-Storm: Trafﬁc-Aware Online Scheduling in Storm.

In ICDCS, 2014.

[Yea]

Xiangyao Yu and et al.

Staring into the Abyss : An Evaluation of

Concurrency Control with One Thousand Cores. Proc. VLDB. Endow. 2015.

[Ze09]

Yu Zheng and et al. Mining Interesting Locations and Travel Sequences

from GPS Trajectories. In WWW, 2009.

[Ze13]

Matei Zaharia and et al. Discretized Streams: Fault-tolerant Streaming

Computation at Scale. In SOSP, 2013.

References

107

[Ze15]

Hao Zhang and et al. In-Memory Big Data Management and Processing: A

Survey. TKDE, 2015.

[ZHD+17] Shuhao Zhang, Bingsheng He, Daniel Dahlmeier, Amelie Chi Zhou, and

Thomas Heinze. Revisiting the design of data stream processing systems

on multi-core processors.

In Data Engineering (ICDE), 2017 IEEE 33rd

International Conference on, pages 659–670. IEEE, 2017.

[ZHZH19a] Shuhao Zhang,

Jiong He, Amelie Chi Zhou, and Bingsheng He.

Briskstream: Scaling Data Stream Processing on Multicore Architectures.

In Proceedings of the 2019 International Conference on Management of Data,

SIGMOD ’19, 2019.

[ZHZH19b] Shuhao Zhang,

Jiong He, Amelie Chi Zhou, and Bingsheng He.

Briskstream: Scaling data stream processing on shared-memory multicore

architectures. In SIGMOD (To be appear), 2019.

[ZR04]

Jingren Zhou and Kenneth A. Ross. Buffering Databse Operations for

Enhanced Instruction Cache Performance. In SIGMOD, 2004.

[ZVDH17] Shuhao Zhang, Hoang Tam Vo, Daniel Dahlmeier, and Bingsheng He. Multi-

query optimization for complex event processing in sap esp. In 2017 IEEE

33rd International Conference on Data Engineering (ICDE), pages 1213–1224.

IEEE, 2017.

