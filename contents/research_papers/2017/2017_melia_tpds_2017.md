Melia: A MapReduce Framework on
OpenCL-based FPGAs

Zeke Wang, Shuhao Zhang, Bingsheng He, Wei Zhang

1

Abstract—MapReduce, originally developed by Google for search applications, has recently become a popular programming
framework for parallel and distributed environments. This paper presents an energy-efﬁcient architecture design for MapReduce on
Field Programmable Gate Arrays (FPGAs). The major goal is to enable users to program FPGAs with simple MapReduce interfaces,
and meanwhile to embrace automatic performance optimizations within the MapReduce framework. Compared to other processors like
CPUs and GPUs, FPGAs are (re-)programmable hardware and have very low energy consumption. However, the design and
implementation of MapReduce on FPGAs can be challenging: ﬁrstly, FPGAs are usually programmed with hardware description
languages, which hurts the programmability of the MapReduce design to its users; secondly, since MapReduce has irregular access
patterns (especially in the reduce phase) and needs to support user-deﬁned functions, careful designs and optimizations are required
for efﬁciency. In this paper, we design, implement and evaluate Melia, a MapReduce framework on FPGAs. Melia takes advantage of
the recent OpenCL programming framework developed for Altera FPGAs, and abstracts FPGAs behind the simple and familiar
MapReduce interfaces in C. We further develop a series of FPGA-centric optimization techniques to improve the efﬁciency of Melia,
and a cost- and resource-based approach to automate the parameter settings for those optimizations. We evaluate Melia on a recent
Altera Stratix V GX FPGA with a number of commonly used MapReduce benchmarks. Our results demonstrate that 1) the efﬁciency
and effectiveness of our optimizations and automated parameter setting approach, 2) Melia can achieve promising energy efﬁciency in
comparison with its counterparts on CPUs/GPUs on both single-FPGA and cluster settings.

Index Terms—FPGA, MapReduce, Melia, OpenCL

(cid:70)

1 INTRODUCTION

MapReduce, originally developed by Google for search appli-
cations, has become a popular programming framework in data
centers with thousands of machines [15] or parallel architectures
such as a machine with multi-core CPUs [33], Xeon Phi [28]
or GPUs [17], [22], [18]. Many applications such as machine
learning and data mining algorithms can be easily implemented
with MapReduce, with a small set of simple and sequential
APIs. MapReduce has abstracted the complexity of underlying
hardware and systems from users. For example, Mars [17] allows
users to adopt MapReduce interfaces to program GPUs, without
worrying about the underlying details on GPU architectures. There
are MapReduce design and implementation on other parallel
architectures including multi-core CPUs [33] and CPU-GPU
architectures [18]. In those studies, MapReduce is designed as
a software library to improve the programmability of parallel
tolerance are
architectures. Advanced features such as fault
usually neglected, which allows the design and implementation
of MapReduce concentrating on individual parallel architectures.
On the other hand, Field Programmable Gate Arrays (FPGAs)
have been an effective means of accelerating and optimizing many
data processing applications such as relational databases [31],
[45], [9], data mining [39], image processing [29] and streaming
databases [40]. Quite different from CPUs and GPUs, FPGAs are
(re-)programmable hardware and have very low energy consump-

•

Zeke Wang, Shuhao Zhang, and Bingsheng He are with Nanyang
Technological University, Singapore. Corresponding author: Bingsheng
He, bshe@ntu.edu.sg.

• Wei Zhang is with Hong Kong University of Science and Technology.

Manuscript received March 31, 2015; revised December 15, 2015; accepted
February 10, 2016.

tion. Moreover, FPGA vendors such as Xilinx and Altera and have
recently released OpenCL SDKs as a new generation of high-
level synthesis (HLS) tools to users. Under the OpenCL abstrac-
tion, FPGAs can be viewed as massively parallel architectures.
Encouraged by the success and wide adoptions of MapReduce,
a MapReduce framework on FPGAs is able to enable users to
program FPGAs with simple and familiar interfaces. The key
problem is how to enable automatic performance optimizations
for a MapReduce framework on FPGAs.

Despite the recent success of FPGAs in data processing
applications, we have identiﬁed the following two key obstacles
in the design and implementation of MapReduce on FPGAs.
First, FPGAs are usually programmed with low-level hardware
description languages (HDL) like Verilog and VHDL (e.g., [38],
[31], [45], [9]). Although there has been a MapReduce implemen-
tation on FPGAs [36], the users are still required to implement
map/reduce functions through VHDL/Verilog, which hurts the
programmability and requires a long learning curve on both
programming and performance optimizations. It is desirable that
users can implement their custom data processing tasks with
a high-level language. Second, since MapReduce has irregular
access patterns (especially in the reduce phase) and needs to
support user-deﬁned functions, careful designs and optimizations
are required for efﬁciency. Compared with CPUs/GPUs, FPGAs
have lower clock frequency. Memory stalls can be even more
signiﬁcant on FPGAs, especially for the irregular accesses from
MapReduce.

To address those two obstacles, we implement and evaluate
Melia, an OpenCL-based MapReduce framework on FPGAs.
Melia takes advantage of the recent HLS tools developed by
Altera, which provides an OpenCL SDK [37], [10], [14], to allow
users to write OpenCL programs for FPGAs. In particular, the

Altera’s OpenCL SDK provides the pipeline parallelism technol-
ogy to simultaneously process data in inherently multithreaded
fashion. With the OpenCL abstraction, the FPGA can be modeled
as a parallel device consisting of multiple pipelining execution
units1. Based on OpenCL, Melia enables users to write simple and
familiar MapReduce interfaces in C. To improve the efﬁciency
of Melia on FPGAs, we evaluate a series of FPGA-centric
optimizations such as memory coalescing and private memory
optimizations for memory efﬁciency, and loop unrolling and
pipeline replications for pipeline efﬁciency. Those optimizations
introduce a series of tuning parameters which signiﬁcantly affect
the performance and resource utilization of Melia on FPGA. We
develop a simple yet effective cost- and resource-based approach
to determine suitable settings of those parameters.

Our experiments are conducted in two parts: real experiments
on a single FPGA, and back-of-envelop performance/energy
consumption analysis on multiple FPGAs in a cluster setting.
We ﬁrst evaluate Melia on the Terasic’s DE5-Net board with
an Altera Stratix V GX FPGA. We choose ﬁve commonly used
MapReduce benchmarks. Our experiments demonstrate that 1)
our parameter setting approach can predict the suitable parameter
settings that have the same or comparable performance to the best
setting, 2) our FPGA-centric optimizations signiﬁcantly improve
the performance of Melia on FPGA with an overall improvement
of 1.4-43.6 times over the baseline (without optimizations) on
FPGA; 3) As a sanity check, Melia achieves averagely 3.9 times
higher energy efﬁciency (performance per watt) than the CPU- and
the GPU-based counterparts. We further extend Melia to multiple
FPGAs in a distributed setting, and evaluate the energy efﬁciency
of Melia with performance/energy consumption analysis.

In summary, this paper makes the following three contri-
butions. First, we propose the ﬁrst OpenCL-based MapReduce
framework for FPGAs to address the programmability problem
of FPGAs. Compared with commercial
tools such as Altera
OpenCL SDK,
this study offers a higher-level programming
framework with MapReduce, which further abstracts the hardware
details of FPGA, and resolves the programming complexity of
FPGAs. Second, we implement our proposed system on the latest
Altera FPGA, and empirically demonstrated the efﬁciency and
effectiveness of FPGA-centric optimizations and our automated
parameter tuning approach. Third, we discuss the lessons we have
learned from experiences and provide insights and suggestions on
programming FPGA.

The rest of the paper is organized as follows. We brieﬂy
introduce the background in Section 2. Section 3 describes the
detailed design and implementations of Melia, followed by the
experimental results on a single FPGA in Section 4. We extend
the framework to FPGA cluster design in Section 5. We discuss
our experiences from this study and point out a number of open
problems in Section 6 and conclude this paper in Section 7.

2 BACKGROUND AND RELATED WORK
2.1 FPGAs

Generally, FPGA technology is low-power and offers a recon-
ﬁgurable hardware solution for many applications. The FPGA
implementation generally needs the input design speciﬁed at
Register-transfer-level (RTL) or gate level using a HDL, such as
Verilog and VHDL. Since HDL is cycle-sensitive and error-prone,

1. This paper focuses on Altera FPGAs. Other vendors like Xilinx also have

similar plans to support OpenCL.

Fig. 1. Resource features on FPGA.

generally good knowledge of hardware design detail and hand-
on experiences are required to guarantee a successful design or
implementation.

The most common part in the FPGA architecture [24] is
logic blocks (called Conﬁgurable Logic Block, CLB (Xilinx),
or Logic Array Block, LAB (Altera)), as shown in Figure 1.
They are ﬁne-grained logic and capable to implement bit-level
computation. Modern FPGA families expand to include coarse-
grain function blocks into the silicon, such as DSP blocks and
Memory blocks. Having these dedicated hardware-based macros
embedded into FPGA helps implementation of computational
intensive applications with less area and higher throughput.

There have been many studies on leveraging FPGAs in
data processing applications (e.g., [46], [21], [16], [43]). We
refer readers to a tutorial [30] for more details on FPGA-based
data processing. Roughly, we can classify them into two major
categories: integrating FPGA into the data path (e.g., [16]) and
viewing FPGA as a co-processor/accelerator (e.g., [9], [29]).
Using FPGAs in the data path, Netezza [16] employs FPGAs
to ﬁlter and transform tuples from the disks prior to processing.
Also, as an I/O engine, the FPGA-based circuits are developed
for various data streaming operators, such as projection, selection
and windowed aggregation [45], [31], [32]. Designed as an
accelerator, FPGAs have been used to accelerate various database
operations or applications such as join [9], [43] and frequent
pattern mining [39]. Most previous studies implement speciﬁc
applications with HDL. In contrast, this paper focuses on the
implementation with high level synthesis.

2.2 Altera’s OpenCL Architecture

OpenCL [23] has been developed for heterogeneous computing
environments. OpenCL is a platform-independent standard where
the data parallelism is explicitly speciﬁed in the code. This pro-
gramming model targets at a host-accelerator model of program
execution, where a host processor runs control-intensive task and
ofﬂoads computationally intensive portions of code (i.e., kernel)
onto an external accelerator.

Recently, Altera provides the OpenCL SDK [37], [44] to
abstract away the hardware complexities from the FPGA imple-
mentation. Figure 2a illustrates the Altera architecture for OpenCL
system implementation. An OpenCL kernel execution contains
multiple kernel pipelines and their interconnects with global
memory and local memory. The Altera’s SDK can translate the
OpenCL kernel to low-level hardware implementation by creating
the circuits for each operation of the kernel and interconnect them
together to realize the data path of the kernel. Figure 2b shows the
pipelined parallelism in the case of a simpliﬁed vector addition
example [37], which can achieve the throughput of one work

2

BRAMBRAMBRAMBRAMBRAMBRAMBRAMBRAMBRAMDSPDSPDSPDSPDSPDSPDSPDSPLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLDSP blockMemory blockLogic blockvalue list. Many previous studies (e.g., [15], [22], [33], [17]) have
demonstrated that MapReduce offers simpliﬁed yet reasonably
efﬁcient parallel and distributed data processing. More details
about MapReduce and its usage in parallel data processing can
be founded from recent surveys [26], [27].

Closely related to this study, FPMR [36] attempted to imple-
ment MapReduce on FPGA. However, those studies are limited
in two aspects. First, the developers [36] are still required to
implement map/reduce functions through VHDL/Verilog. Second,
FPMR is rigid in some speciﬁc application (without ﬂexible
data shufﬂing). Instead, this paper has the full OpenCL-based
MapReduce framework on FPGAs, and the MapReduce can also
support ﬂexible data shufﬂing. In [42], [47], FPGAs (together
with GPUs) are adopted to implement the MapReduce framework,
where the host CPU implements the scheduling task and the
FPGAs (together with GPU) are considered as co-processors.
There have also been two studies [13], [35] on offering the
capability of executing MapReduce functions in OpenCL. Still,
they are very preliminary in the sense that they only implement
very basic form of MapReduce. The major contributions of our
paper include 1) offering a more FPGA friendly MapReduce
framework, and 2) the optimizations are guided by the cost model.
there have been OpenCL-based
MapReduce implementations [11], [12], which target at the multi-
core CPU or the GPU in a single host. The state-of-the-art OpenCL
implementation of MapReduce on CPUs/GPUs [12] is imported
to FPGAs, denoted as baseline. We have observed that the
baseline implementation, which does not include optimizations
loop unrolling), suffers from severe memory stalls and
(e.g.,
pipeline inefﬁciency (as we will see in the experiments).

On parallel architectures,

3 DESIGN AND IMPLEMENTATION OF MELIA
This section presents design and implementation of Melia on
a single FPGA. Based on the single-FPGA implementation, we
extend our design to multiple FPGAs in Section 5.

3.1 Melia Overview

We have identiﬁed the following two key challenges for an efﬁ-
cient MapReduce on FPGAs. The ﬁrst problem is on high-latency
global memory transactions. Unlike the CPU/GPU, the FPGA
does not have dedicated cache hierarchy. Then, the global memory
access transactions generated on the FPGA directly interface with
the memory controller of the external memory. Second, writing
the OpenCL program should consider the efﬁciency of pipeline
executions on FPGAs.

With the abstraction of Altera OpenCL SDK,

the FPGA
can be modelled as a massively parallel architecture with a
multi-level memory hierarchy. Many design and implementation
optimizations that have been developed for the CPU and the
GPU can be applicable to the OpenCL program, and their
impact should be revisited under the new FPGA abstraction.
Example optimizations include memory coalescing and local
memory optimizations to resolve the memory stalls. On the
other hand, there are some new optimization strategies that are
particularly attractive on the new FPGA abstraction. Examples
include pipeline replications and loop unrolling. Altera OpenCL
SDK explicitly supports loop unrolling to take advantage of
the ﬂexible hardware resource allocations on FPGAs. Pipeline
replications enable multiple replicated pipelines to execute in
parallel to fully take advantage of hardware resources on FPGAs.

Fig. 2. Altera OpenCL system implementation

item ﬁnished per cycle. The frequency of FPGA kernel can vary
with the OpenCL kernel. It mainly depends on the FPGA resource
utilization by the OpenCL kernel. Ideally, the more resource that
the kernel consumes, the lower frequency that the FPGA execution
has.

From the perspective of OpenCL, the memory component of
FPGA computing system contains three layers. First, the global
memory resides in DDRs on the FPGA board. The accesses to
global memory has long latency. Second, the local memory is a
low-latency and high-bandwidth scratch-pad memory. In our test-
ed FPGA, the local memory has 4 banks in general. The private
memory, storing the variables or small arrays for each work
item (i.e., the basic execution unit in OpenCL), are implemented
using completely-parallel registers which are plentiful resources in
FPGA. Compared with CPU/GPU, FPGA has relatively sufﬁcient
number of registers, which should be employed efﬁciently to store
intermediate results for each individual work item.

As in Figure 2, we can conﬁgure multiple kernel pipelines,
i.e., Compute Unit (CU), if resource allows. Different CUs are
executed in parallel. Each CU implements a massive pipelined
execution for the OpenCL program, and has its own local memory
interconnect while all the pipelines share the global memory
interconnect. In particular,
the load/store operations to local
memory access in one CU can combine together to arbitrate for
the local memory. However, the load/store operations to global
memory access will compete for the on-board global memory
bandwidth [37]. Compared with global memory, the on-chip local
memory is low-latency and high-throughput. Moreover, the global
memory system is lack of dedicated cache hierarchy which causes
the global memory transactions of FPGA are less efﬁcient than
that of GPU/CPU. Thus, the local and private memory should be
employed whenever possible to reduce global memory accesses.

2.3 MapReduce

MapReduce is a programming framework, originally developed
by Google and mainly used for parallel and distributed data pro-
cessing. In the big-data era, MapReduce has gained a signiﬁcant
amount of interests from both industry and academia. The basic
idea of MapReduce is to offer simpliﬁed data processing and to
hide the details of parallel and distributed executions from users.
Formally, MapReduce consists of two user-deﬁned functions: Map
and Reduce. The Map function takes as input a key-value pair
(key1, value1) and generate intermediate key-value pairs in the
form of (key2, value2). Next, the system automatically groups
the intermediate key-value pairs on the key, and forms the pairs
of a key and the values of the same key (key2, list(value2)).
For each key2, the Reduce function processes its corresponding

3

Those optimizations are correlating factors in performance tuning
for the OpenCL-based MapReduce on FPGAs, including hardware
frequency and resource utilization. Due to the architectural differ-
ence between FPGAs and CPUs/GPUs, many tuning knobs [12],
[11] from CPUs/GPUs are no longer applicable to FPGAs.

Taking those issues into account, our design of Melia addresses
the aforementioned challenges. Our optimizations improve the
memory efﬁciency and pipeline efﬁciency. To ease the complexity
in performance tuning, we develop a simple yet effective cost-
and resource-based approach to automatically determine suitable
settings of those parameters. The approach takes into consideration
the cycles of the pipeline, the frequency and resource limitation of
FPGA, and recommends the best parameter conﬁguration. We ﬁrst
present the overall workﬂow of our implementation, and details of
our optimizations and automated parameter settings in the later
two subsections.

Melia is currently designed and implemented as a software
library. Users are able to use Melia, almost in the same way
as other MapReduce frameworks [17], [22], [18]. Speciﬁcally,
users need to ﬁrst implement a map() and a reduce() function
in C. For the reduce function, users can annotate whether
it is an associative and communicative function. If so, Melia
can enable early reduction optimization. Given the two user-
deﬁned functions, Melia ﬁrst determines the suitable execution
parameters (Section 3.3). Next, the user compiles and executes the
program on the FPGA. During the execution, Melia executes the
two user-deﬁned functions according to the overall workﬂow in
Algorithm 1.

The overall execution of Melia is designed as two stages:
map and reduce. The map function takes one input unit and then
generates one key-value pair. Whenever an intermediate key/value
is emitted, the insert() is invoked (in Algorithm 2). The system
maintains a bucket based hash table. The bucket stores the key-
value pairs or reduction object [12], [11] for each key. The usage
of reduction object is to represent the partial reduction result. If
the reduce function is associative and communicative, the key-
value pair is inserted to a reduction object. Otherwise, it is directly
appended to hash table. Multiple OpenCL work items access the
shared hash table. Locks are used for synchronization among work
items. In the reduce phase, each work item is responsible for one
bucket of the hash table. If reduction objects are used, no explicit
reduction phase is conducted.

Algorithm 1: OVERALL WORKFLOW OF MELIA.
1 /*Stage 1: the map stage;*/
2 for each key/value pair in the input do
3

execute map(); //when an intermediate key/value is emitted, the insert() is
invoked.

4 end
5 /*Stage 2: the reduce stage;*/
6 for each key/value pair in the intermediate output from the map stage do
7
8 end

execute reduce();

Our implementation requires quite some design and engineer-
ing efforts in optimizing the efﬁciency of Melia. We take as one
example the insertion of a key-value pair into a reduction object in
MapReduce, illustrated in Algorithm 2. When a key-value pair is
to be inserted into the reduction object, the index is calculated via
the hash value of the key. Since there are read/write conﬂicts to the
same bucket, a lock mechanism is employed. The work item polls
the corresponding lock of the index until the work item acquires
the lock. If the bucket of the index is empty, Melia ﬁrst creates
a new bucket in the hash table. If the key of the bucket is same
as the inserted key, Melia atomically reduces the key-value pair to

4

the bucket, using the reduce function provided by the user. If the
keys are not the same, the computing work item calculates a new
index for the next round.

Melia employs the static memory coalescing, in terms of built-
in vector type uint4, to combine several small-sized global memo-
ry accesses to form the vector load/store accesses (e.g., the register
bucket uint4). Therefore, the global memory transactions for the
bucket information in Melia are one vector load operation (Line 9)
and one vector store operation (Line 12). With the reduced number
of load/store operations, the OpenCL kernel can use less hardware
resource and then might achieve higher frequency.

Algorithm 2: INSERT (key, key size, val, val size)
1 index = hash(key, key size)%NUM BUCKETS;
2 DoW ork = 1;
3 while (DoW ork) do

/* wait until having lock[index]
with lock = 0;
while (with lock == 0) do

with lock = get lock(index);

end
index base = index;
/* (coalescing read from 128-bit memory) :valid,

key_addr, val_addr,key_val_size

bucket unit4 = buckets[index];
/* bucket[index] is empty
if (bucket unit4.valid == 0) then

(key addr, val addr) = atomic alloc(key size, val size);
/* (coalescing write to 128-bit memory):valid,

key_addr, val_addr,key_val_size

bucket unit4 =
(1, key addr, val addr, (key size, val size));
buckets[index] = bucket unit4;
/* store key and value data
copy(key addr, key, key size);
copy(val addr, val, val size);
DoW ork = 0;

end
/* key is same as bucket[index]
else

if (equal(bucket unit4.key addr, bucket unit4.key size,
key, key size)) AND reduce is associative and communicative then
/* reduce val to bucket[index]
*/
reduce(bucket unit4.val addr, bucket unit4.val size,
val, val size); DoW ork = 0;

end
/* key is not same as bucket[index]
else

DoW ork = 1;
index = update index(index);

end

end
/* release the lock[index_base]
release lock(index base);

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

21
22
23
24
25

26
27 end

*/

*/

*/

*/

*/

*/

*/

*/

3.2 Optimization Techniques

To reduce the number of global memory transactions, Melia
employs a series of memory optimizations such as memory
coalescing and private memory optimizations [4]. To improve
the pipeline execution efﬁciency, Melia converts multiple nested
loops into a single loop and combines the replicated instructions
whenever possible. Then, it is more efﬁcient to map to the FPGA
pipeline. Furthermore, we apply loop unrolling and pipeline repli-
cations to better utilize the FPGA resource. Those optimizations
are automatically included in our framework implementation.
For user-deﬁned functions, only loop unrolling is automatically
applied in Melia (by identifying the target loops through source
code analysis), and other optimizations are left to users.

Private memory. The private memory on FPGA are imple-
mented using completely-parallel registers (logics), which are
plentiful resources in FPGAs. Then, the private memory is useful
for storing single variables or small arrays in the OpenCL kernel
[4]. The kernel can access private memories completely in parallel,
and no arbitration is required for access permission. Therefore, the

private memory has signiﬁcant advantages, in terms of bandwidth
and latency, over local memory and global memory. Since the
general MapReduce applications require a lot of memory accesses,
we should use private memory, instead of local memory and global
memory, whenever possible.

Local memory. The local memory on the FPGA is consid-
erably smaller than global memory; however, it has signiﬁcantly
higher throughput and much lower latency. The local memory are
implemented in on-chip memory blocks [5] in the FPGA. The
on-chip memory blocks have two read and write ports, and have
twice the operating frequency as the frequency of the OpenCL
kernel pipelines. Thus, the local memory is able to support four
simultaneous memory accesses. Therefore, the local memory is
good for the intermediate data between the work items in the same
work group. In Melia, we maintain reduction objects in the local
memory.

Kernel pipeline replication. If the resource is sufﬁcient on the
FPGA, the kernel pipeline can be replicated to generate multiple
compute units (CUs) to achieve higher throughput. Generally, each
CU can execute multiple work-groups simultaneously. The inner
hardware scheduler can automatically dispatch the work-groups
among CUs. For example, if two CUs are implemented, each CU
executes a half of the work-groups.

Since kernel pipeline replication can consume more resource,
the frequency tends to be lower than that of one kernel pipeline.
That means, two CUs cannot double the performance. Another
issue is that the global memory load/store operations from the
multiple compute units compete for the global memory accesses.
Nevertheless, we ﬁnd that more compute units can still bring
performance gains in most cases. Hence, we simply take the
largest number of CUs that can ﬁt into the resource budget of
FPGA.

Loop unrolling. If a large number of loop iterations exist in
the kernel pipeline, the loop iterations could potentially be the
critical path of the kernel pipeline. Then, unrolling the loop by an
unroll factor could increase the pipeline throughput by decreasing
the number of iterations. However, on FPGA, loop unrolling is
achieved at the expense of increased hardware resource consump-
tion. Different from loop unrolling on CPUs/GPUs, the FPGA
allocates more hardware resources to the execution of unrolled
loops.

Loop unrolling might have another side-product beneﬁt: the
load/store operations with simple array indexes, are coalesced
so that more valid data can be loaded per memory transaction.
This reduces the number of total memory accesses, which further
improves the performance.

3.3 Parameter Settings for Melia

The FPGA compilation time is long (hours) and there are several
optimization parameters to tune the performance in Melia. The
design space of optimizations is large, since there are a number
of optimization methods and we need to determine where to
apply these optimizations in the OpenCL-based MapReduce
to address the main bottleneck by
applications. It
the proper optimizations. Therefore, it is necessary to have an
automated tool which can guide the parameter settings, under the
resource constraints in FPGA. Additionally, since different kinds
of optimizations consume different amount of hardware resources
on FPGAs, this paper presents the FPGA-speciﬁc cost model
to guide the suitable optimization conﬁguration for MapReduce.

is critical

Due to the resource constraints of an FPGA, the selection and
conﬁguration of individual optimizations signiﬁcantly affect the
application performance, as we demonstrated in Section 4.

The ﬂow contains three stages to determine tuning parameters
for local memory, loop unroll and replicated kernel pipelines
accordingly.

Stage 1: It is the user to determine whether the local memory
is employed, according to the speciﬁc MapReduce applica-
tion. MapReduce applications can be roughly divided into the
reduction-intensive and map computation-intensive applications
[12]. The former kind has a large number of key-value pairs
for each unique key, and then the reduction computation time is
signiﬁcant. The later kind represents the applications that spend
most of their time for computation in the map stage. Therefore,
the local memory is recommended for the reduction-intensive
applications and the size of local memory are determined by
the user. However,
the local memory is not suitable for the
applications of map computation-intensive applications (e.g., no
key-value pairs share the same key).

Stage 2: The design ﬂow guides how to determine the unroll
factor f in the Map/Reduce function. If no ﬁxed loop iterations
exist in the Map/Reduce function, then f is 1 and the design ﬂow
directly go to the next stage (CU num). Otherwise, there are
total loop num iterations in the map/reduce function, and we
roughly estimate the unroll factor (f ) as follows.

On the current version of Altera OpenCL SDK, it is rec-
ommended that f is a divisor of total loop num. The system
iterates all possible unroll factor(f ), ranging from the smallest
divisor (1) to the biggest divisor (total loop num) in the
map/reduce function. Next, the OpenCL kernel with the unroll
factor(f ) is passed to the Altera resource estimation tool [4] to
estimate the resource utilization of the OpenCL kernel. While the
entire compilation process may take hours, the resource estimation
can give the statistics on resource usage in seconds or minutes.
Then, the cost model roughly provide the rough trends of the
execution cycles and kernel frequency. We estimate the execution
time by multiplying the estimated execution cycles with the
estimated frequency. The details on estimating the frequency and
clock cycles are described in Section 3.3.1 and 3.3.2. We accept
the unrolling factor only if the kernel can ﬁt into the FPGA.

Stage 3: We determine the CU num, the maximum number
of replicated kernel pipelines under the constraint that the required
utilization of each feature (such as logic, memory block and DSP
block) is less than a predeﬁned resource usage threshold (95% in
our study).

In the following, we present the details on our cost models.
The proposed cost models are used to guide the developer
how to determine the parameter setting for the MapReduce
applications, not to accurately predict the frequency and clock
cycles. The unique architectural feature of FPGA actually allows
us to simplify the cost estimation. In our experiment, we observe
that our cost models can roughly predict the suitable parameter
conﬁguration, and the simpliﬁed cost models are sufﬁcient for the
purpose.

3.3.1 Cost Model for Estimating Frequency
It is hard to develop an accurate analytical model to estimate
the hardware frequency due to the internal complexity of FPGA.
Fortunately, we observe that there is a strong correlation between
the resource utilization on FPGA and the hardware frequency.
Thus, we develop a simple linear regression model for hardware

5

and computation, which assumes a maximum overlapping between
Cmem and Ccomp. Due to the massive parallel pipeline on FPGAs,
this overlapping is high in practice and the simpliﬁed estimation
is sufﬁcient.

CF P GA = M ax(Cmem, Ccomp)

(2)

Estimating Ccomp. Based on the full pipelined property of
the arithmetic operation implemented on FPGA, the arithmetic
operation can achieve the throughput with one operation per cycle.
Another advantage of arithmetic operation is that each arithmetic
operation in the OpenCL is implemented with speciﬁc circuit, then
no resource competition will occur among arithmetic operations.
Therefore, we estimate Ccomp to be the total number of clock
cycles for all instructions in the critical path. We have developed a
tool to count the number of instructions in each kind, and multiply
the unit cost of each kind of instruction. Table 1 lists a sample
of instructions and their unit costs on the FPGA used in our
experiments. We obtained the unit costs from proﬁling the FPGA
IP cores of the Altera OpenCL SDK.

TABLE 1
Latency (cycles) of each kind of instructions

fp sqrt
28
int32 add/sub
1

fp mul
5
int32 mul
3

fp add/sub
7
int32 div
32

fp div
14
global memory
35

Estimating Cmem. We consider two major factors:
total
number of memory accesses and how memory accesses are served
in parallel on the FPGA. Eq.3 gives the estimation on Cmem,
where Lmem and Nmem denote the clock sum of the total
global memory accesses and the latency of one global memory
access and the number of global memory accesses, respectively.
Thus, Lmem × Nmem denotes the total clock cycles for memory
accesses, if memory requests are served one by one. On FPGAs,
memory accesses are severed in parallel with a degree of M T P .
Lmem is obtained from proﬁling the FPGA, and Nmem and
M T P can be obtained with the simulation tool [48]. Differently,
we consider that
the FPGA does not have dedicated cache
hierarchy, when counting Nmem.

Cmem =

Lmem × Nmem
M T P

(3)

4 EXPERIMENTAL EVALUATION
This section presents the experimental studies on a single FPGA.
The major goal of the experiments is to evaluate the efﬁciency
and effectiveness of the optimization techniques in Melia over the
baseline implementation on FPGA [12].

4.1 Experimental Setup

Our experiments were conducted on a machine with CPU and
one FPGA board (Terasic’s DE5-Net board) which includes 4GB
DDR3 device memory, and an Altera Stratix V GX FPGA (5S-
GXEA7N2F45C2). The FPGA [5] includes 622K logic elements,
2560 M20K memory blocks (50Mbit) and 256 DSP blocks. The
FPGA board is connected to the host via an X8 PCI-e 2.0 interface.
We compare Melia with the state-of-the-art OpenCL MapRe-
duce [12] on the high-end 2.40GHz Intel Xeon CPU E5645 (12
cores) and an AMD FirePro V7800 GPU. The peak DRAM

Fig. 3. OpenCL kernel execution ﬂow: (a) M T P = 2, (b) M T P = 4

frequency based on resource utilization, which is generally
accurate enough for our experiments.

The FPGA mainly has three features (logic element, memory
block and DSP block), and each feature can have different resource
utilizations. For simplicity, we assume that the feature with the
largest utilization is chosen to determine the frequency of kernel.
Next, we use the applications in the Altera OpenCL SDK as
training data sets. For each application, we obtain the maximum
resource utilization and the kernel frequency. Finally, we apply
least squares method to determine the linear model function
that can best ﬁt the training data set, and obtain the estimated
frequency Festimated. In our experiment, we obtain the linear
in Eq.1, where the Rmax utilization is the maximum
model
resource utilization of the given OpenCL kernel, reported from
Altera resource estimation tool [4].

Festimated = −79 ∗ Rmax utilization + 245M Hz

(1)

3.3.2 Cost Model for Estimating Clock Cycles
The Altera’s OpenCL Compiler [37] translates the OpenCL kernel
to a hardware pipeline, which implements each operation in
the OpenCL kernel by the speciﬁc circuit. Then, these circuits
are wired together to execute the pipeline. Then, the massive
parallelism exists in the global memory accesses and arithmetic
computations. The total clock cycles for the execution highly
depends on the degree of global memory parallelism in the kernel
pipeline. We adopt one metric [19], MTP ( Memory Thread
Parallelism), to represent the maximum number of threads that
can access the global memory simultaneously.

To further explain how the multiple threads are executed in
the kernel pipeline, we illustrate the pipeline execution of the
vector addition, as shown in Figure 3. For Case 1 in Figure
3a, the global memory system can service two global memory
transactions simultaneously (M T P = 2), and the “m x” indicates
the work item with ID (m) loads from (x = a or b) or stores to (x
= c) the global memory. In this case, the computation operations
are completely hidden behind the global memory operations, the
kernel throughput is bounded by the global memory transactions.
For Case 2 in Figure 3b, it can service four global memory
transactions simultaneously (M T P = 4), and then the kernel
throughput is greatly improved.

We estimate the total number CF P GA of elapsed clock cycles
on the FPGA to be the larger one of the clock cycles for memory
accesses and computations (Eq.2). Cmem and Ccomp denote the
total number of clock cycles in global memory accesses and the
total number of clock cycles in computations, respectively. This
estimation simpliﬁes the interaction between memory accesses

6

time0_a0_b1_a1_ba+b0_c2_a1_c2_ba+b3_a4_aa+b2_c3_b0_a1_a1_ba+b0_c1_c2_ba+b3_a4_aa+b2_c2_a0_b3_ba+b3_c5_a6_a7_a4_b5_b6_ba+ba+ba+b7_ba+bCase 1:Case 2:(a)(b)memory operationcomputation operationMTP = 2MTP = 4TABLE 2
Application and datasets used in our experiments

Application
K-means, K = 40 (KM)
Word Count (WC)
String Matching (SM)
Matrix Multiplication (MM)
Similarity Scope (SS)
Histogram movies (HM)
Inverted index (II)

Dataset Size
200M points
100MB text ﬁle
100MB text ﬁle
2000*2000 matrices
2000 ﬁles each with 2000 features
100M movive rating points
200M tuples

bandwidth of the high-end Intel CPU is around 32GB/sec. The
low-end CPU is the Intel Xeon Processor E3-1230L. The GPU has
18 streaming multiprocessors (SM), and each SM has 128 Radeon
cores, with a clock rate of 700MHz. Thus, there are 1440 Radeon
cores on this GPU. Each SM has 32 KB local memory. The device
memory is 2GB DDR5, with 1200 MHz clock frequency and peak
bandwidth of 153.6 GB/sec. The GPU is connected to the host via
an X16 PCI Express 3.0 interface.

A fair and accurate comparison on the energy consumption
across multiple platforms is a nontrivial task, since these three
platforms can have very different hardware and peripheral e-
quipment in practice. Thus, we adopt two methods to compare
the energy efﬁciency among three platforms. The ﬁrst method
is an estimation with multiplying the execution time by the
corresponding TDP (Thermal Design Power) of the platform.
This methodology is used in the previous studies [10], [7]. In
practice, this offers a good estimation on the energy consumption
of each platform, since we have various optimizations to maximize
the resource utilizations on high-end CPU, GPU and FPGA.
The second method is to further add a low-end CPU power
consumption for the FPGA/GPU implementation, in addition to
the ﬁrst method. The reason of using a low-end CPU is, since
the CPU is roughly idle during OpenCL kernel on FPGA/GPU are
running, it is unfair to count the power consumption of full-ﬂedged
Intel CPU into the power consumption of FPGA/GPU platform.
In this study, we assume the energy consumption of the low-end
CPU to be 25W. The TDPs of the high-end CPU, the GPU and the
FPGA are 80W, 150W, and 25W, respectively.

Applications. We have used seven common MapReduce
benchmarks, which have been used in the experiments of previous
studies [1], [12], [17], [20].

These applications cover different performance aspects of
MapReduce: reduction-intensive and map computation-intensive
applications. The former kind of applications usually have a large
number of key-value pairs for each unique key, whereas the map
tasks spend most of the time in the latter kind of applications. The
details on the applications and their data sets are summarized in
Table 2. The default data have uniformly distributed input keys.
K-means clustering (KM) is one of the most popular data mining
algorithms. Word Count (WC) can be reduction-intensive if the
number of distinct words (DW ) is small. We use DW =500
as the default setting. String Matching (SM) is used to check
whether the target string is in the ﬁle. For simplicity, the ﬁrst
string in the ﬁle is set to be the target string to search. Matrix
Multiplication (MM) is a map computation-intensive application.
Similarity Scope (SS) is used in web document clustering, which
computes the pair-wise similarity score for a set of documents.
It is also a map computation-intensive application. Histogram
movies (HM) generates a histogram of the movie rating data. It
is a reduction-intensive application. Inverted index (II) generates

word-to-document
is a
reduction-intensive application. Among them, KM and WC are
in HiBench [20], while HM and II are in PUMA [1].

indexing for a list of documents. It

In summary, MM and SS are map computation-intensive, and
others are reduction-intensive. The input data sets are initially
loaded into the device memory, excluding the cost of PCI-e data
transfer time.

4.2 Impacts of FPGA-Centric Optimizations

In this subsection, we study the separate impact of individual
through manually en-
FPGA-centric optimizations in Melia,
abling/disabling certain optimizations in Melia. It is important to
study the impacts of these optimizations, since the performance
can be signiﬁcantly improved with proper optimizations.

Private memory. We ﬁrst study the performance impact
of the private memory access optimization. Figure 4(a) shows
the speedup of private memory on Melia with one and two
CUs (denoted as 1-CU and 2-CU, respectively). We deﬁne the
performance speedup of an optimization technique to be the
ratio of the elapsed time without the optimization technique to
that with the optimization technique. We recommend that the
private memory should be chosen for storing intermediate data
in the Melia framework and user-deﬁned map/reduce functions
whenever possible. One reason is that FPGA has a plentiful
amount of reconﬁgurable logics for the private memory. The usage
of the private memory reduces the number of long-latency global
memory accesses. Since the multiple kernel pipelines are more
global memory intensive than that of one kernel pipeline, the 2-
CU case can achieve a higher performance speedup than that of
1-CU case. We do not include the results for SS, MM, KM, HM
and II, because the private memory optimization is not necessary
for those applications.

Memory coalescing. Figure 4(b) shows the performance
speedup of the static memory coalescing on the seven applications.
With memory coalescing, multiple global memory transactions are
combined, and the total number of global memory accesses is
reduced. Similar to the results on private memory optimizations,
the 2-CU case also achieves more performance speedup than that
of 1-CU case. Speciﬁc to FPGA, this optimization also reduces
the hardware required resource consumption. We use KM as an
example, and memory coalescing has a signiﬁcant speedup of
1.42 on KM. The 2-CU KM variants with and without coalescing
require 72% and 93% of the total FPGA resource, respectively.
Even worse, the high resource consumption also leads to a lower
frequency. Those two factors contribute to the relatively high
overall speedup of memory coalescing on KM.

Loop unrolling. Figure 4(c) shows the performance speedup
of the loop unrolling on the FPGA. Loop unrolling is not
applicable to SM and WC, due to their irregular loops. For the
other three applications, loop unrolling achieves very signiﬁcant
performance speedup (up to 8.48). The throughput of the pipeline
in the FPGA is always determined by the slowest part of the
pipeline. Through loop unrolling, we can allocate more resource
to the slowest part of the pipeline, and make the throughput of
each part of pipeline more balanced.

Local memory. Figure 4(d) shows the performance speedup
of the local memory for WC SM HM and II. The local memory
has signiﬁcant advantages in latency and throughput over global
memory. Another advantage is that each kernel pipeline has its
own local memory, the pipeline do not need to compete with the

7

(a) Private memory

(b) Memory coalescing

(c) Loop unrolling

(d) Local memory

(e) 2-CU

(f) Melia over baseline on the FPGA

Fig. 4. Performance speedup of individual optimization on the FPGA, where K-means (KM), Word Count (WC), String Matching (SM), Matrix
Multiplication (MM), Similarity Scope (SS), Histogram movies (HM) and Inverted index (II).

(a) Frequency estimation

(b) Clock Cycle estimation

(a) Frequency estimation

(b) Clock cycle estimation

Fig. 5. Frequency and clock cycle estimations of WC on the FPGA

Fig. 6. Frequency and clock cycle estimations of SM on the FPGA

other kernel pipelines for local memory accesses, unlike global
memory accesses. Since each kernel pipeline has its own local
memory, the 2-CU case can achieve more signiﬁcant performance
speedup than 1-CU case.

Pipeline replication. Figure 4(e) shows the performance
speedup of the multiple kernel pipelines (CU) on the FPGA.
Increasing the pipelines from one to two results in the speedup of
1.08–1.59 on the seven applications. That shows the importance
of fully utilizing the hardware resource.

Put them all together. Finally, we compare Melia with
the baseline approach (without FPGA-speciﬁc optimizations) on
FPGA, as shown in Figure 4(f). The speedup of all FPGA-centric
optimizations is 1.4–43.6 times over the baseline approach. This
validates the importance of FPGA-centric optimizations in writing
an efﬁcient OpenCL program for FPGAs.

4.3 Cost Model Evaluations

In this subsection, we evaluate our cost models from two aspects:
cycles and frequency estimations and optimization parameter
setting.

Estimations of cycles and frequency. We ﬁrst study our
predictions on the clock cycles and hardware frequency. We
have studied three reduction-intensive applications (WC, KM and
SM) and two map computation-intensive applications (MM and
SS). We observe that our predictions can generally capture the

(a) Frequency estimation

(b) Clock cycle estimation

Fig. 7. Frequency and clock cycle estimations of KM on the FPGA

trend of clock cycles and frequency. In the following, we present
the detailed results for two representative applications, WC and
SS, without and with loop unrolling optimizations, respectively.
Additionally, they cover a series of memory optimizations.

(a) Frequency estimation

(b) Clock cycle estimation

Fig. 8. Frequency and clock cycle estimations of MM on the FPGA

8

1.061.061.11.1300.30.60.91.2WCSMSpeedup1-CU2-CU1.0111.11.010.991.051.091.021.421.051.011.061.11.1500.20.40.60.811.21.41.6WCKMMMSSSMHMIISpeedup1-CU2-CU4.687.138.480246810KMMMSSSpeedup6.61.15.85.110.71.595.5036912WCSMHMIISpeedup1-CU2-CU1.591.561.081.341.131.591.6200.40.81.21.62WCKMSMSSMMHMIISpeedup11.443.61.47.18.59.38.2081624324048WCKMSMMMSSHMIISpeedup 050100150200250Frequency (MHz)MeasurementEstimation0400800120016002000Clock cycles(M)MeasurementEstimation050100150200250Frequency(MHz)MeasurementEstimation0306090120150Clock cycles (M)MeasurementEstimation050100150200250Frequency(MHz)MeasurementEstimation0400800120016002000Clock cycles (M)MeasurementEstimation050100150200250Frequency(MHz)MeasurementEstimation0200040006000800010000Clock cycles(M)MeasurementEstimation(a) Frequency estimation

(b) Clock cycle estimation

Fig. 9. Frequency and clock cycle estimations of SS on the FPGA

TABLE 3
Conﬁguration of best and predicted cases for the ﬁve applications

Conﬁguration Best Case
WC
KM
SM
MM
SS
HM
II

SM+P+C+2CU
SM+P+C+U8+2CU
SM+P+C+2CU
NSM+P+C+U25
NSM+P+C+U80
SM+P+C+2CU
SM+P+C+2CU

Predict
SM+P+C+2CU
SM+P+C+U20+1CU
SM+P+C+2CU
NSM+P+C+U40
NSM+P+C+U80
SM+P+C+2CU
SM+P+C+2CU

For each application, we consider different combinations of
FPGA-centric optimizations. Thus, we use the following abbre-
viations to represent the optimizations and their parameters used
in the evaluation: G, P , C, SM , N SM and U f represent the
baseline global memory version, private memory, static memory
coalescing, local memory, non local memory, and loop unrolling
with unrolling factor f , respectively.

Figures 5(a), 6(a), 7(a), 8(a) and 9(a) show the predictions on
hardware frequency of running WC, SM, KM, MM and SS with
Melia, respectively, in comparison with the measured frequency
after the real FPGA compilation. Our simple approach can roughly
the hardware frequency of the OpenCL kernel, with
predict
the input from the corresponding estimated resource utilization
provided by the Altera resource estimation tool.

Figures 5(b), 6(b), 7(b), 8(b) and 9(b) show the predictions on
the elapsed clock cycles. Generally, our prediction on clock cycles
is able to capture the trend of the MapReduce application with
different parameter conﬁgurations. On WC, our estimation can
predict the clock cycle reductions of the memory optimizations
(local memory, private memory and static memory coalescing),
and the corresponding M T P value used in Figure 5(b) is 11.3.
For SS, KM and MM, our estimation can also predict the impact
of loop unrolling, which signiﬁcantly reduces the clock cycles
by shortening the critical path of the kernel pipeline, and their
corresponding M T P values are 30.4, 60 and 70, respectively.
For SS, our estimation can predict the clock cycle trend with
varying unrolling factor f . For MM and KM, our estimation can
not accurately predict the clock cycle trends, but the performance
of the estimated parameter conﬁguration can be very close to the
optimum performance.

Optimization parameter setting. We now evaluate the effec-
tiveness of our models in predicting the suitable parameter settings
in Melia. We study the predicted optimization conﬁguration of
parameter settings for the seven applications in comparison with
the best conﬁguration in Table 3. We obtain the best/worst/medium
conﬁgurations by experimentally measuring the execution time of
all possible conﬁgurations. Our model is able to match the best
cases for the ﬁve applications (WC, SM, SS, HM and II). For
MM and KM, the performance of the predicted conﬁguration is

comparable to or very close to the best case, as shown in the Table
4. More importantly, our prediction can effectively avoid the worst
conﬁguration, and signiﬁcantly outperform the medium case in all
applications.

4.4 Comparisons Between FPGA and CPU/GPU
We evaluate the execution time, and energy efﬁciency (per-
formance per watt) of Melia, in comparison with its state-of-
the-art counterparts on CPU/GPU. Note, we directly use the
implementation [11], [12] from the author.

Comparisons with GPU. We show the ratios of Melia over
the GPU-based counterpart [11], [12] on the execution time
and energy efﬁciencies (with/without low-end CPU), as shown
in Figures 10(a), 10(b) and 10(c). In particular, Melia achieves
averagely 3.6 (2.1) times higher energy efﬁciency (performance
per watt) than the GPU-based counterparts without (or with) low-
end CPU. Due to the low power feature of the FPGA, Melia has a
lower power consumption on all applications.

For the execution time, there is no conclusive comparison
between FPGA and the GPU. On KM, Melia signiﬁcantly
outperforms the GPU-based MapReduce on all the two metrics,
since the KM implementation utilizes the optimization methods:
local memory and loop unrolling. In particular, FPGA is good
for computation-intensive MapReduce applications with regular
memory access pattern, since FPGA can provide multiple custom
pipelines (via loop unrolling) to efﬁciently improve the computing
ability and on-chip buffers to reduce global memory accesses.
For example, KM can employ the loop unrolling to improve
computation ability and on-chip buffers to reduce the number
of memory accesses. Compared with the GPU-based counterpart,
Melia achieves slower performance on other applications. Take
SS and MM as examples. Melia fully utilizes the loop unrolling
optimization. However, still many global memory transactions
impede the further performance improvement since no dedicated
cache is involved on the FPGA. In contrast, GPU is good for the
computation-intensive application with irregular memory access
pattern, since GPU has powerful computation ability and high
memory bandwidth.

Comparisons with CPU. We present the overall comparison
with the CPU-based MapReduce without ﬁgures. Previous stud-
ies [12], [11] have compared the MapReduce performance on the
CPU and the GPU. Our results are consistent with their studies.
Eventually, Melia has higher energy efﬁciency than the CPU-based
MapReduce on all the seven applications, with the improvement
of up to 16.7 times. In general, CPU is good for the control-
intensive application, since CPU has powerful cache hierarchy and
superscalar technology to reduce the latency of memory access.

For the seven MapReduce applications presented at our
experiment, we summarize our ﬁndings as follows. First, FPGA is

TABLE 4
The best, worst, medium execution time for different conﬁgurations, and
the execution time of our predicted conﬁguration.

Worst
WC
1269ms
KM 7450ms
SM 506ms
37.8s
MM
21.2s
SS
28.9s
HM
53.4s
II

Best
510ms
1131ms
416ms
5.3s
2.5s
3.12s
6.48s

Medium Predicted
810ms
3456ms
470ms
20.6s
9.6s
4.96s
10.48s

510ms
1872ms
416ms
5.4s
2.5s
3.12s
6.48s

9

050100150200250Frequency(MHz)MeasurementEstimation010002000300040005000Clock cycles(M)MeasurementEstimation(a) Time ratio of FPGA over GPU

(b) Energy gain of FPGA over GPU (without low-
end CPU)

(c) Energy gain of FPGA over GPU (with low-end
CPU)

Fig. 10. Comparison of Melia on FPGA over on GPU.

a lot of global memory accesses. Third, CPU is good for the
control-intensive applications, since CPU has powerful cache
hierarchy and superscalar technology to reduce the average latency
of memory access. For example, SM, WC, HM and II require
powerful cache hierarchy and powerful superscalar technology to
deal with plenty of branches.

4.5 Other Studies

In this subsection, we study the robustness of Melia in the
following aspects.

Different data sizes. We also study the different data sets
of the application (WC) for the case study. Figure 11 shows
the elapsed times of WC with input sizes (100MB, 200MB, ...,
500MB, 1000MB, 1500MB). The experimental result shows that
the performance scales well for increasing data sizes.

Locking overhead. We also study the locking overheads of
ﬁve MapReduce applications (WC, KM, SM, MM and SS) on
OpenCL-based FPGAs. We estimate the locking overhead as
subtracting the MapReduce application without locking operations
from the same MapReduce application with locking operations.
The time breakdown is shown in Figure 12. The experimental
result shows that the locking overhead is one important component
of the total execution time for each MapReduce application,
since FPGA cannot efﬁciently accommodate the standard locking
mechanism (e.g., atomic cmpxchg) from OpenCL speciﬁcation.

Input data characteristics. We also study the impact of input
data characteristics [2], [41] of the MapReduce application (WC)
on FPGA/GPU, as shown in Figure 13. In particular, we adopt
the two cases of input data in the previous study: skewed key
occurrence (SKO) and uniform key occurrence (UKO). The SKO
is the case that the same key occurs consecutively, which implies
that work items of MapReduce framework need to compete for the
same lock (one distinct key has one corresponding lock). On the
other hand, UKO is when keys uniformly appear, which implies
that the possibility of lock contention is relatively low. Based on
the experimental result, there are two observations. First, the input
data with UKO has much better performance than that with SKO,
since the lock contention is serious for SKO, which signiﬁcantly
degrades the performance of OpenCL-based Melia. Second, FPGA
has signiﬁcant performance advantage over GPU when the number
of input distinct keys is small, since the lock-step execution model
of GPU cannot efﬁciently address the serious lock contention, then
work items actually execute sequentially.

When the number of distinct keys is known before MapReduce
runtime performs, we can allocate proper FPGA on-chip buffer to
store the reduction object and the proper hashing function can be

Fig. 11. WC with varying data sizes (MB)

Fig. 12. Lock overheads for seven MapReduce applications

good for computation-intensive applications with regular memory
access pattern, since FPGA can provide multiple custom pipelines
to efﬁciently do the computation and on-chip buffers to efﬁciently
read/write data. For example, KM can employ the loop unrolling
to improve computation ability and on-chip buffers to reduce
the number of global memory accesses. Second, GPU is good
for the computation-intensive applications with irregular memory
access patterns, since GPU has powerful computation ability and
high memory bandwidth. For example, MM and SS requires the
powerful computation ability to efﬁciently do the computation
and requires high memory bandwidth to efﬁciently deal with

Fig. 13. Execution time for various number of distinct keys on FPGA and
GPU

10

1.520.62.53.22.12.200.511.522.533.5WCSMKMMMSSHMIITime Ratio43102.41.882.862.730246810WCSMKMMMSSHMIIEnergy Efficiency Ratio2.331.755.831.41.091.671.5902468WCSMKMMMSSHMIIEnergy Efficiency Ratio0.511.512.022.485.17.6401234567810020030040050010001500Elapsed Time (S)00.20.40.60.81WCKMSMMMSSHMIIPercentage breakdownReal computationLocking overhead03691250100200300400500600Elapsed time (s)GPU UKOFPGA UKOGPU SKOFPGA SKOTABLE 5
Comparison with direct HLS acceleration (MM)

With Melia
Direct HLS

LUTs
179630
160480

REGs
273103
244187

RAMs
1886
1657

DSPs
32
32

time
5.41s
3.45s

used, so that FPGA on-chip buffer can be fully utilized. Then, the
amount of FPGA resource can be reduced and more aggressive
optimizations (e.g. more CU) can be applied to MapReduce
programs. Take WC as an example, we can allocate three CUs
for the implementation when the number (500) of input distinct
keys is known before execution, then we get the performance
improvement by 1.21X, compared with the default implementation
with two CUs.

Comparison with direct HLS acceleration. We have com-
pared the HLS enabled MapReduce runtime Melia with direct
HLS acceleration. The implementation based on Melia requires
more FPGA resources than the direct HLS acceleration. On
the other hand, Melia improves the programmability so that
the user only needs to implement
two primitives (map and
reduce), and MapReduce is able to exploit the parallelism in the
underlying computing resources. Take MM with full optimizations
for example. With Melia, the HLS enabled MapReduce roughly
requires 10% more resources than the direct HLS acceleration, as
shown in Table 5. The execution time of Melia (5.41s) is much
larger than that of HLS implementation (3.45s) since the locking
overhead of Melia is signiﬁcant.

4.6 Finding summary

Overall, FPGA demonstrates the signiﬁcant energy efﬁciency,
in comparison with its CPU- and GPU-based counterparts. The
performance and energy consumption comparisons of FPGA-
based MapReduce over the CPU/GPU-based MapReduce are
resulted from the differences in the architectures as well as
the algorithm design. First, the FPGA usually has much lower
hardware frequency than CPU/GPU, respectively. In our experi-
ments, the FPGA has the frequency of hundreds of MHz, while
GHz for the CPU/GPU, respectively. Moreover, compared with
CPU/GPU, FPGA does not have coherent cache hierarchy, e.g.,
L1/L2 caches. For some applications, Melia can still be faster
than the MapReduce implementations on CPU/GPU, thanks to
the FPGA-centric optimizations. Second, FPGA by design has
much lower power consumption than CPU/GPU. This is a direct
factor contributing to the superb energy efﬁciency of FPGA over
CPU/GPU.

5 EXTENSIONS TO MULTIPLE FPGAS
Our extension (simulation) follows the common MapReduce
design [15]. Many good mechanisms of MapReduce are inherited,
including task scheduling and fault tolerance. Thus, we focus on
how FPGAs are interconnected to make a large-scale system.
While FPGAs can be integrated as a co-processor, we adopt a
radical approach by viewing FPGAs as individual nodes. The
Melia implementation on a single FPGA is used to process
the map and the reduce tasks on a chunk of input data and a
chunk of intermediate key-value list generated from the map task,
respectively.

We design a FPGA-based computing cluster with master/slave
architecture. The master node runs on a standard server, which
is responsible for task scheduling and other management
in
MapReduce. Each slave node is a standalone FPGA board,

which is plugged into one slot of a custom direct point-to-
point backboard [34]. The backboard employs the high-speed
Transceivers (MGTs) on the FPGA, named RocketIOs [5], to
provide a custom high-speed data network. In particular, since
MGT is full duplex and no software overhead is required, the
data transfer bandwidth between any pair of two FPGA nodes
at either direction can achieve 800MB/s via 14.1Gb/s transceiver.
This is signiﬁcant data transfer bandwidth advantage of FPGA
over CPU/GPU. Dozens of FPGAs (16 in our performance/energy
consumption analysis) forms a pod. All the FPGAs within a pod
are fully connected via the backboard. To support a larger number
of FPGAs, we leverage existing cluster network topologies [3],
which connect pods with Ethernet switches in a tree-like network
topology. Our cluster design is a hybrid one with both the features
of FPGA backboard and Ethernet switches. For CPU/GPU-based
cluster, we consider a common setting: a 10Gb/s Ethernet switch
within the pod of 16 machines each, and pods are connected with
10Gb/s switch. The FPGA cluster uses the same cross-pod design.
We use the power consumption model [6] for Ethernet switches.
For example, an 10Gb/s 32-port switch roughly consumes 786
Watts.

There are two issues that are worth discussion. The ﬁrst one
is on cost efﬁciency. The FPGA board used in the experiment
costs 8,000 USD each, and the workstation costs 2,000 USD
each. The FPGA board is more expensive than the server. In the
real production environment, only the FPGA itself is required,
rather than the entire FPGA board. Thus, the price per FPGA
should be much lower than the FPGA board. Second, we adopt
the fair scheduling policy in Apache Hadoop 2.5.1 – YARN, to
handle job/task scheduling and fault tolerance. Both CPU/GPU-
and FPGA-based clusters use the same policy in the simulation.
Thus, we omit the experimental studies on those issues.

Simulation setup. We conduct the simulation about perfor-
mance and energy consumption analysis according to the approach
introduced by Lang et al. [25]. The basic idea is that, in the map
phase, we consider the computation time of the map tasks; in the
reduce phase, we estimate the time of network transfers required
by the data shufﬂing and the computation time of the reduce tasks.
For more details, we refer readers to the original paper [25].

We scale the data size by a factor (×f , meaning that we scale
the input data size or dimensions in Table 2 by f ); that is, each
node roughly has the same amount of data as shown in Table 2.
We use the machine and FPGA setup in Section 4 as the input
hardware proﬁle in the performance/energy consumption analysis.
Performance/energy analysis. Figures 14(a)(b) show the
performance/energy consumption analysis results of Melia on
CPU/GPU/FPGA clusters. The results are shown with 32 slave
nodes (either FPGAs or servers with CPUs/GPUs) and the
input data scale of (×32). Overall, in the cluster setting, seven
MapReduce applications of Melia even more signiﬁcantly out-
performs its CPU/GPU counterparts in terms of performance and
energy efﬁciency, in comparison with the results in Section 4.
In particular, the performance of Melia is better than CPU/GPU
cluster as show in Figure 14(a), since the RocketIO network in
FPGA cluster can provide much more data transfer bandwidth
than Ethernet of CPU/GPU cluster. Therefore, the time required
for data shufﬂing in FPGA cluster is signiﬁcantly less than that
in CPU/GPU cluster. Furthermore, our FPGA cluster design has
taken the backboard support of FPGAs, which eliminates the
standard server components, which are required by the CPU/GPU
cluster. Therefore, the energy consumption advantage of FPGA

11

(a) Time consumption of CPU/GPU/FPGA

(b) Energy consumption of CPU/GPU/FPGA

(c) WC with varying FPGA nodes (8, 16, 32 and 64)

Fig. 14. Comparisons (time and power consumption) of Melia on CPU/GPU/FPGA clusters.

cluster over CPU/GPU cluster is much more signiﬁcant than the
performance advantage, as shown in Figure 14(b).

FPGAs now do not offer coherent cache memory hierarchy. The
locality and coherency are left to programmers.

Scalability. We also study the impact of different FPGA nodes
for the MapReduce application WC as the case study, as shown in
Figure 14(c). The results are shown with varying slave nodes (8,
16, 32 and 64) and the input data scale of (×32). The experimental
result shows that more FPGA nodes can have better performance,
since the data set for each FPGA node is accordingly reduced.
However, the cluster with more FPGA nodes may have more
power consumption, consumed by more data shufﬂing between
FPGA nodes.

6 EXPERIENCES AND OPEN PROBLEMS

Our initial studies show a few opportunities for further improving
the performance and energy efﬁciency of MapReduce on FPGAs.
First, with OpenCL abstractions, FPGAs can be viewed as
a highly parallel architecture with strong and efﬁcient support
on hardware pipeline executions. This ﬁts extremely well with
massively parallel processing like MapReduce. The fast inter-
“thread” communication within the same hardware pipeline can
signiﬁcantly accelerate the performance and ease the program-
ming.

Second, the FPGA programmability for more complex appli-
cations has been improving greatly. Besides Altera OpenCL SDK,
Xilinx C/C++ HLS tools signiﬁcantly reduce the programming
complexity on FPGAs.

Third, as energy efﬁciency has a more signiﬁcant role in
system designs, FPGAs are more likely to become an important
citizen in MapReduce, and other data processing systems. Through
proper optimizations, we demonstrate that FPGAs achieve sig-
niﬁcantly higher energy efﬁciency than CPUs/GPUs, with slight
performance degradations or even better performance on FPGAs.

We have also identiﬁed a few open problems:
First, MapReduce in speciﬁc and data processing in general are
complex in its runtime logic. Even though FPGAs have low power,
we still require a signiﬁcant amount of design and implementation
effort to further improve the performance and energy efﬁciency of
Melia.

Second, even with OpenCL abstraction, reconﬁgurable com-
puting still has other challenges. More advanced system features
such as the partial reconﬁguration capability is still prelimi-
nary [8]. Also, as our experiments show, memory stall optimiza-
tions and pipeline execution efﬁciency are two most important
performance factors. For example, the hardware reconﬁgurable
capability also requires careful algorithmic designs, since even the
unexecuted code in runtime has to consume resources on FPGA.

Third, similarly to GPU, FPGA is relatively weak on synchro-
nization handling and memory subsystems (no cache coherence).
For example, we found that
the atomic-lock seriously affect
performance. It
is desirable to develop software or hardware
techniques to improve those issues on FPGAs.

7 CONCLUSIONS

MapReduce has become a popular programming framework in
parallel architectures. In this paper, we implement and evaluate
an OpenCL-based MapReduce framework (Melia) with a series of
optimizations for FPGAs, based on the recently released Altera
OpenCL SDK. We evaluate Melia on a recent Altera FPGA.
Our evaluations show that memory stalls and pipeline execution
efﬁciency have signiﬁcant impact on the overall performance and
energy efﬁciency of FPGAs. Our results demonstrate that 1) our
parameter setting approach can predict the suitable parameter
settings that have the same or comparable performance to the
best setting, 2) our FPGA-centric optimizations signiﬁcantly
improve the performance of Melia on FPGA with an overall
improvement of 1.4-43.6 times over the baseline on FPGA. Both
real experiments on a single FPGA and performance/energy con-
sumption analysis on a cluster setting demonstrate the signiﬁcant
performance and energy efﬁciency improvement of Melia over its
CPU/GPU-based counterparts.

One interesting future direction is to schedule the exe-
cution among heterogeneous environments (including FPGAs,
GPUs and CPUs), and to extend the methodology to gener-
al OpenCL programs. We have made Melia open-sourced in
http://www.ntu.edu.sg/home/bshe/Melia.html.

8 ACKNOWLEDGEMENT

We thank Altera University Program which has denoted Terasic’s
DE5-Net FPGA board for our research. This work is in part
supported by MoE AcRF Tier 2 grants (MOE2012-T2-1-126 and
MOE2012-T2-2-067) in Singapore.

REFERENCES

[1] F. Ahmad, S. Lee, M. Thottethodi, and T. N. Vijaykumar. Puma: Purdue

mapreduce benchmarks suite. 2012.

[2] S. Ahmed and D. Loguinov. On the performance of mapreduce: A

stochastic approach. In Big Data, Oct 2014.

[3] M. Al-Fares, A. Loukissas, and A. Vahdat. A scalable, commodity data

center network architecture. In SIGCOMM, 2008.
[4] Altera. Altera sdk for opencl optimization guide. 2013.
[5] Altera. Stratix v device overview. 2014.

12

05101520253035WCSMKMMMSSHMIIElasped time (s)CPUGPUFPGA0306090120150180210240270WCSMKMMMSSHMIIPower consumption (KJ)CPUGPUFPGA0123456024688163264Energy consumption (KJ) Elapsed time (s) Time(s)Energy (KJ)[6] G. Ananthanarayanan and R. H. Katz. Greening the switch. In USENIX,

[39] J. Teubner, R. Mller, and G. Alonso. Fpga acceleration for the frequent

2008.

[7] O. Arnold, S. Haas, G. Fettweis, B. Schlegel, T. Kissinger, and
W. Lehner. An application-speciﬁc instruction set for accelerating set-
oriented database primitives. In SIGMOD, 2014.

[8] C. Beckhoff, D. Koch, and J. Torresen. Migrating static systems to
partially reconﬁgurable systems on spartan-6 fpgas. In IPDPS Workshops
and Phd Forum, 2011.
J. Casper and K. Olukotun. Hardware acceleration of database operations.
In FPGA, 2014.

[9]

[10] D. Chen and D. Singh.

Fractal video compression in opencl: An
evaluation of cpus, gpus, and fpgas as acceleration platforms. In ASP-
DAC, 2013.

[11] L. Chen and G. Agrawal. Optimizing mapreduce for gpus with effective

shared memory usage. In HPDC, 2012.

[12] L. Chen, X. Huo, and G. Agrawal. Accelerating mapreduce on a coupled

cpu-gpu architecture. In SC, 2012.

[13] J. Costabile. Hardware acceleration for map/reduce analysis of streaming

data using opencl. 2015.

[14] T. Czajkowski, U. Aydonat, D. Denisenko, J. Freeman, M. Kinsner,
D. Neto, J. Wong, P. Yiannacouras, and D. Singh. From opencl to high-
performance hardware on fpgas. In FPL, 2012.

[15] J. Dean and S. Ghemawat. Mapreduce: Simpliﬁed data processing on

large clusters. In OSDI, 2004.

[16] P. Francisco. The netezza data appliance architecture: A platform for

high performance data warehousing and analytics. 2011.

[17] B. He, W. Fang, Q. Luo, N. K. Govindaraju, and T. Wang. Mars: a

mapreduce framework on graphics processors. In PACT, 2008.

[18] C. Hong, D. Chen, W. Chen, W. Zheng, and H. Lin. Mapcg: writing

parallel program portable between cpu and gpu. In PACT, 2010.

[19] S. Hong and H. Kim. An analytical model for a gpu architecture with

memory-level and thread-level parallelism awareness. In ISCA, 2009.

[20] S. Huang, J. Huang, J. Dai, T. Xie, and B. Huang. The hibench
benchmark suite: Characterization of the mapreduce-based data analysis.
In ICDEW, 2010.

[21] Z. Istvan, G. Alonso, M. Blott, and K. Vissers. A ﬂexible hash table

design for 10gbps key-value stores on fpgas. In FPL, 2013.

[22] W. Jiang and G. Agrawal. Mate-cg: A map reduce-like framework for
accelerating data-intensive computations on heterogeneous clusters. In
IPDPS, 2012.

[23] Khronos OpenCL Working Group. The opencl speciﬁcation, v1.1.48.

2009.

[24] I. Kuon, R. Tessier, and J. Rose.

Fpga architecture: Survey and

challenges. Found. Trends Electron. Des. Autom., 2(2), 2008.

[25] W. Lang, S. Harizopoulos, J. M. Patel, M. A. Shah, and D. Tsirogiannis.
Towards energy-efﬁcient database cluster design. PVLDB, 2012.
[26] K.-H. Lee, Y.-J. Lee, H. Choi, Y. D. Chung, and B. Moon. Parallel data

processing with mapreduce: A survey. SIGMOD Rec., 2012.

[27] F. Li, B. C. Ooi, M. T. ¨Ozsu, and S. Wu. Distributed data management

using mapreduce. ACM Comput. Surv., 46(3), Jan. 2014.

[28] M. Lu, Y. Liang, H. P. Huynh, Z. Ong, B. He, and R. Goh. Mrphi: An
optimized mapreduce framework on intel xeon phi coprocessors. IEEE
TPDS, 26(11):3066–3078, 2015.

[29] S. McBader and P. Lee. An fpga implementation of a ﬂexible, parallel
image processing architecture suitable for embedded vision systems. In
IPDPS, 2003.

[30] R. Mueller and J. Teubner. Fpga: What’s in it for a database?

In

SIGMOD, 2009.

[31] R. Mueller, J. Teubner, and G. Alonso. Data processing on fpgas.

In

VLDB, 2009.

[32] R. Mueller, J. Teubner, and G. Alonso. Streams on wires: A query

compiler for fpgas. Proc. VLDB Endow., 2009.

[33] C. Ranger, R. Raghuraman, A. Penmetsa, G. Bradski, and C. Kozyrakis.
Evaluating mapreduce for multi-core and multiprocessor systems.
In
HPCA, 2007.

[34] R. Sass, W. V. Kritikos, A. G. Schmidt, S. Beeravolu, and P. Beeraka. Re-
conﬁgurable computing cluster (rcc) project: Investigating the feasibility
of fpga-based petascale computing. In FCCM, 2007.

[35] O. Segal, M. Margala, S. R. Chalamalasetti, and M. Wright. High
level programming for heterogeneous architectures. In 1st International
Workshop on FPGAs for Software Programmers (FSP 2014), 2014.
[36] Y. Shan, B. Wang, J. Yan, Y. Wang, N. Xu, and H. Yang. FPMR:

Mapreduce framework on fpga. In FPGA, 2010.

[37] D. Singh. Field-programmable gate array. Altera Whitepaper, 2011.
[38] S.Kestur, J.D.Davis, and O.Williams. Blas comparison on fpga, cpu and

gpu. In ISVLSI, 2010.

item problem. In ICDE, 2010.

[40] J. Teubner and R. Mueller. How soccer players would do stream joins.

In SIGMOD, 2011.

[41] D. Tiwari and D. Solihin. Modeling and analyzing key performance

factors of shared memory mapreduce. In IPDPS, 2012.

[42] K. H. Tsoi and W. Luk. Axel: A heterogeneous cluster with fpgas and
In Proceedings of the 18th Annual ACM/SIGDA International
gpus.
Symposium on Field Programmable Gate Arrays, FPGA ’10, pages 115–
124. ACM, 2010.

[43] Z. Wang, B. He, and W. Zhang. A study of data partitioning on opencl-

based fpgas. In FPL, 2015.

[44] Z. Wang, B. He, W. ZHang, and S. Jiang. A performance analysis
framework for optimizing opencl applications on fpgas. In HPCA, 2016.
[45] L. Woods, Z. Istv´an, and G. Alonso. Ibex-an intelligent storage engine

with support for advanced sql off-loading. In VLDB, 2014.

[46] L. Woods, J. Teubner, and G. Alonso. Complex event detection at wire

speed with fpgas. In VLDB, 2010.

[47] J. Yeung, C. Tsang, K. Tsoi, B. Kwan, C. Cheung, A. Chan, and P. Leong.
Map-reduce as a programming model for custom computing machines.
In FCCM, pages 149–159, April 2008.

[48] Y. Zhang and J.D.Owens. A quantitative performance analysis model for

gpu architectures. In HPCA, 2011.

Zeke Wang received his B.Sc. degree from
Harbin University of Science and Technology,
China, in 2006 and the Ph.D. degree from Zhe-
jiang University, China in 2011. He is a Research
Fellow at Parallel Distributed Computing Cen-
ter, School of Computer Engineering, Nanyang
Technological University. His current research
interests include high performance computing
(with a focus on FPGA) and database systems.

Shuhao Zhang is a Ph.D candidate in Depart-
ment of Computer Science and Engineering,
Nanyang Technological University. He received
the bachelor degree from Nanyang Technolog-
ical University in 2014. His major research in-
terests include High Performance Computing,
Stream Processing, Parallel and Distributed Sys-
tems.

Bingsheng He received the bachelor degree
in computer science from Shanghai Jiao Tong
University (1999-2003), and the PhD degree
in computer science in Hong Kong University
of Science and Technology (2003-2008). He is
an Associate Professor in School of Computer
Engineering of Nanyang Technological Univer-
sity, Singapore. His research interests are high
performance computing, distributed and parallel
systems, and database systems.

and

Wei Zhang received the Ph.D. degree from
Princeton University, Princeton, NJ, USA,
in
2009. She joined Hong Kong University of
Science and Technology in 2013 as an assistant
professor
established Reconﬁgurable
System Lab. She was an assistant professor in
School of Computer Engineering at Nanyang
Technological University, Singapore from 2010
to 2013. She has authored and co-authored
more than 60 book chapters and papers
in peer-reviewed journals and international
conferences. Her current research interests include reconﬁgurable
system, FPGA-based design, low-power high-performance multicore
system, embedded system security and emerging technologies.

13

