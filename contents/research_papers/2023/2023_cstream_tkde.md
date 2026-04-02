1
CStream: Parallel Data Stream Compression on
Multicore Edge Devices
Xianzhi Zeng, Shuhao Zhang
Abstract—IntheburgeoningrealmofInternetofThings(IoT)applicationsonedgedevices,datastreamcompressionhasbecome
increasinglypertinent.Theintegrationofaddedcompressionoverheadandlimitedhardwareresourcesonthesedevicescallsfora
nuancedsoftware-hardwareco-design.ThispaperintroducesCStream,apioneeringframeworkcraftedforparallelizingstream
compressiononmulticoreedgedevices.CStreamgrappleswiththedistinctchallengesofdeliveringahighcompressionratio,high
throughput,lowlatency,andlowenergyconsumption.Notably,CStreamdistinguishesitselfbyaccommodatinganarrayofstream
compressionalgorithms,avarietyofhardwarearchitecturesandconfigurations,andaninnovativesetofparallelizationstrategies,
someofwhichareproposedhereinforthefirsttime.Ourevaluationshowcasestheefficacyofathoughtfulco-designinvolvingalossy
compressionalgorithm,asymmetricmulticoreprocessors,andournovel,hardware-consciousparallelizationstrategies.Thisapproach
achievesa2.8xcompressionratiowithonlymarginalinformationloss,4.3xthroughput,65%latencyreductionand89%energy
consumptionreduction,comparedtodesignslackingsuchstrategicintegration.
✦
1 INTRODUCTION Stream compression
With the rise of Internet of Things (IoT) applications, the
needforefficientdataprocessinginedgedevices,especially Temperature
data stream compression, has become a pivotal research
problem [1], [2]. Figure 1 illustrates an IoT use case [3] Humidity Online ML
wherein stream compression in multicore edge devices is Compressed
Data stream data stream
highly desirable. Real-time data streams (e.g., toxic gas,
temperature) from a multitude of IoT sensors in hazardous
Toxic gas
areasareincessantlygatheredbypatroldrones,functioning
Edge device Online DB
as edge devices, with limited memory and battery power. Wind speed
Cloud data center
To reduce transmission overhead, these patrol drones,
equipped with multicore processors, act as multicore edge Fig. 1: Application of stream compression in real-time data
devices that compress the input streams [4] before passing gathering conducted by a patrol drone in environments
them to downstream online IoT analytic tasks, such as inaccessibletohumans.
online aggregation [2], and online machine learning [5] in
thecloud.
Parallelizing stream compression on multicore edge
in the resource-constrained environment of multicore edge
devices, such as the wireless patrol drones in Figure 1, is
devices is a non-trivial task. It involves striking a delicate
mandatory to meet the strict high-throughput processing
balance between often conflicting requirements such as
requirements. However, achieving this in the resource-
low energy consumption [6], high compression ratio [5],
constrained environment of multicore edge devices is a
and tolerable information loss [1]. While data stream
non-trivial task. It involves striking a delicate balance
compression is a well-studied problem, the specific context
between often conflicting requirements such as low energy
of multicore edge devices adds a new dimension to it. In
consumption [6], high compression ratio [5], and tolerable
particular, none provide a comprehensive answer to our
information loss [1]. While data stream compression is a
central question: how can stream compression be optimally
well-studiedproblem,thespecificcontextofmulticoreedge
implementedonmulticoreedgedevices?
devices adds a new dimension to it. In particular, none
This paper introduces CStream, an innovative
provide a comprehensive answer to our central question:
framework specifically engineered for parallelizing
how can stream compression be optimally implemented on
stream compression on multicore edge devices. CStream
multicoreedgedevices?
systematically navigates the expansive design space,
Parallelizing stream compression on multicore edge
meticulously balancing various factors such as compression
devices, such as the wireless patrol drones in Figure 1,
ratios, compression speeds, and energy consumption. It offers
is mandatory to meet the strict high-throughput and low-
a flexible, adaptive, and robust solution that pushes the
latency processing requirements. However, achieving this
boundaries of stream compression on multicore edge
devices,exploiting aversatilesoftware-hardwareco-design
• Xianzhi Zeng and Shuhao Zhang are with the Singapore University of
TechnologyandDesign. approach[7],[8].
Firstly, CStream supports a wide array of stream

2
compression algorithms, each possessing unique strengths effectiveness in the challenging environment of multicore
and trade-offs. These algorithms span from conventional edge devices (e.g., RK3399 [9], H2+[10], and Z8350[11]).
lossless compression to cutting-edge lossy algorithms, Our observations underscore the value of thoughtful
encapsulating both stateful and stateless variations, and co-design in achieving optimal stream compression on
thosewithorwithoutbytealignment. edge devices. We highlight the potential of lossy stream
| Secondly, | CStream | is  | conscientious |     | of  | hardware | compression |             |            |     |           |             |     |
| --------- | ------- | --- | ------------- | --- | --- | -------- | ----------- | ----------- | ---------- | --- | --------- | ----------- | --- |
|           |         |     |               |     |     |          |             | algorithms, | asymmetric |     | multicore | processors, |     |
differences, demonstrating adaptability across diverse and hardware-conscious parallelization strategies. These
hardware architectures and configurations. It is capable of strategic integrations lead to notable improvements in
optimizing its functionality according to the specificities the compression ratio, throughput, and energy efficiency.
of various multicore processors, accommodating RISC or With these contributions, we envision CStream to be
CISC architectures, and adjusting to varying word lengths an indispensable tool for researchers and practitioners
and core numbers. This adaptability allows CStream to aimingtoachieveefficientdatastreamcompressionforIoT
| optimally harness | the | hardware |     | resources | available | on  | applications. |     |     |     |     |     |     |
| ----------------- | --- | -------- | --- | --------- | --------- | --- | ------------- | --- | --- | --- | --- | --- | --- |
different edge devices, thereby maximizing compression Organization. The rest of this paper is laid out as
speedwhileminimizingenergyconsumption. follows:Section2offersanoverviewofstreamcompression
| Thirdly, | CStream | introduces |     |     | a novel | set of |                 |     |        |            |            |      |     |
| -------- | ------- | ---------- | --- | --- | ------- | ------ | --------------- | --- | ------ | ---------- | ---------- | ---- | --- |
|          |         |            |     |     |         |        | and underscores | the | unique | challenges | associated | with | its |
parallelization strategies, some of which are proposed for application at the edge. Section 3 delves into the co-design
the first time. These strategies account for various factors spaces of stream compression at the edge, underlining the
such as execution strategies, state-sharing implementation, architecture and implementation of CStream. In Section 4,
CStream.
and scheduling strategies, offering fine-grained control we present the methodology used to evaluate
over the parallelization of stream compression. With these Section 5 reports on our experimental evaluation of
innovative parallelization strategies, CStream is capable CStream, highlighting its performance across various co-
of better distributing the compression workload across design spaces. Section 6 situates our work within the
multiplecores,therebyenhancingthroughputandreducing existing body of literature, emphasizing how CStream
| latency. |     |     |     |     |     |     | advancesthecurrentstateoftheartinstreamcompression |     |     |     |     |     |     |
| -------- | --- | --- | --- | --- | --- | --- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- |
Ourprimarycontributionsaresummarizedasfollows:
|     |     |     |     |     |     |     | for multicore | edge devices. |     | Section 7 | concludes | the | paper, |
| --- | --- | --- | --- | --- | --- | --- | ------------- | ------------- | --- | --------- | --------- | --- | ------ |
• First, CStream offers an extensive set of stream reflecting on the contributions of CStream and offering
compressionalgorithms,withaparticularfocusonlossy directionsforfutureresearchinthisdomain.
| stream compression |     | algorithms. |     | These | algorithms | strike |     |     |     |     |     |     |     |
| ------------------ | --- | ----------- | --- | ----- | ---------- | ------ | --- | --- | --- | --- | --- | --- | --- |
2 BACKGROUND
| a balance | between | high | compression |     | ratios | (ranging |     |     |     |     |     |     |     |
| --------- | ------- | ---- | ----------- | --- | ------ | -------- | --- | --- | --- | --- | --- | --- | --- |
from2.0to8.5)andminimalinformationloss(lessthan In this section, we introduce the basic concepts of stream
| 5%), enabling | CStream |     | to cater | to  | a wide | spectrum of |     |     |     |     |     |     |     |
| ------------- | ------- | --- | -------- | --- | ------ | ----------- | --- | --- | --- | --- | --- | --- | --- |
compressionattheedge.
applicationrequirements.
• Second, CStream is engineered to operate efficiently 2.1 OverviewofStreamCompression
on asymmetric multicore processors with RISC Inourdefinition,astreamtuple,denotedasx =v,consists
t
architecture and 64-bit word length. This results in of an arrival timestamp t to the processing system (e.g., a
impressiveperformanceimprovements,specifically,up compressor),andv,thecontenttobecompressed.Wedefine
| to 59% reduction |     | in processing |     | time | and | up to 69% |           |                        |     |          |     |            |     |
| ---------------- | --- | ------------- | --- | ---- | --- | --------- | --------- | ---------------------- | --- | -------- | --- | ---------- | --- |
|                  |     |               |     |      |     |           | a list of | tuples chronologically |     | arriving | at  | the system | as  |
reduction in energy consumption when compared to an input stream. Stream compression essentially performs
traditionalmulticoreprocessors. the task of continuously compressing the input stream into
• Third, CStream implements a range of hardware- an output stream with fewer data footprints. To describe the
| conscious | parallelization |     | strategies. |     | To  | begin with, |     |     |     |     |     |     |     |
| --------- | --------------- | --- | ----------- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
relativesizebetweentheloaded(i.e.,input)andcompressed
it incorporates cache-aware micro-batching of tuples, (i.e., output) streaming data, we define compression ratio as
which significantly improves throughput by up to 11 compressionratio= loadeddatasize .
compresseddatasize
| times. Next, | in  | terms | of state | management, |     | it opts |        |             |           |       |       |            |     |
| ------------ | --- | ----- | -------- | ----------- | --- | ------- | ------ | ----------- | --------- | ----- | ----- | ---------- | --- |
|              |     |       |          |             |     |         | Stream | compression | possesses | three | major | properties |     |
for private dictionaries for each thread instead of a stemming from the nature of the continuously arriving
shared state. This optimization significantly reduces data stream. First, the stream is incremental, meaning that
| energyconsumptionandenhancesthroughputwithout |     |     |     |     |     |     |             |        |               | x        |     |                |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | --- | ----------- | ------ | ------------- | -------- | --- | -------------- | --- |
|                                               |     |     |     |     |     |     | compression | on the | current tuple | τ (i.e., | the | tuple arriving |     |
adverselyaffectingthecompressionratio. most recently at time τ) can rely on either 1) itself or 2)
• Lastly, CStream adopts asymmetry-aware workload the past tuples (i.e., those arriving earlier than the current
scheduling [4]. This not only reduces energy tuple with timestamp t < τ). However, it has no reference
consumptionbyabout50%butalsooptimizesresource tothefuturetupleswhichhaven’tarrivedyetwithtimestamp
| utilization | by leveraging |     | the | unique | capabilities | of  | t>τ. |     |     |     |     |     |     |
| ----------- | ------------- | --- | --- | ------ | ------------ | --- | ---- | --- | --- | --- | --- | --- | --- |
different cores. These strategies, collectively, make Second, the stream is infinite. Therefore, the proper
| CStream | an efficient |     | and | effective | tool | for stream |     |     |     |     |     |     |     |
| ------- | ------------ | --- | --- | --------- | ---- | ---------- | --- | --- | --- | --- | --- | --- | --- |
utilizationofcacheandmemorybecomescrucial.Third,the
compressiononheterogeneousmulti-coresystems. stream is characterized by a large volume and high rate,
In demonstrating the efficacy of CStream, we necessitating high-throughput compression. These distinct
conductedacomprehensiveevaluationwithfivereal-world properties set stream compression apart from database
and one synthetic datasets, featuring diverse workload compression [12], time series compression [13], and file
characteristics. Our results confirm CStream’s superior compression[14],wherealldataisreadybeforeconducting
| performanceovertraditionalapproaches,demonstratingits |     |     |     |     |     |     | thecompression. |     |     |     |     |     |     |
| ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- |

3
2.2 StreamCompressiononEdges TABLE1:Summaryofstudiedcompressionalgorithms.
The emergence of IoT has led to an explosion in AlgorithmName Fidelity State Bytealignment
data collection, storage, and processing demand at the utilization
LEB128-NUQ [26], lossy stateless aligned
edge. Here, we briefly introduce the data properties and [27]
performancedemandofstreamcompressiononedges. ADPCM[26],[27],[1] lossy stateful,value aligned
UANUQ[27],[28] lossy stateless unaligned
IoT Data. IoT, being a common application scenario
UAADPCM[28],[27], lossy stateful,value unaligned
for edge computing, produces diverse data streams at [1]
the edge [15], [6]. The source(s) of these data streams LEB128[26] lossless stateless aligned
Delta-LEB128[26],[1] lossless stateful,value aligned
could be singular (e.g., an ECG sensor [16]) or multiple Tcomp32[28] lossless stateless unaligned
(e.g.,distributedgameservers[17]).Additionally,thetuple Tdic32[29],[28] lossless stateful, unaligned
dictionary
content may be a plain value (e.g., unsigned integer [16]),
RLE[30] lossless stateful,value aligned
binary structured (e.g., the < key,value > pair [18]), PLA[31],[13] lossy stateful,model aligned
or textual structured (e.g., in XML format [19]). The
arrival pattern and compressibility of the data stream can
framework. CStream stands out by accommodating
also greatly vary. For instance, an anti-Covid19 tracking
an array of stream compression algorithms, a variety
system [20] at a mall may generate data streams more
of hardware architectures and configurations, and an
densely during peak hours. Due to this versatility, efficient
innovative set of parallelization strategies. Furthermore,
streamcompressionishighlycontext-dependent.
it presents novel concepts, such as asymmetric-aware
Performance Demand.Giventhe13V’schallenges[7]of
scheduling, for the first time. By leveraging the features
IoT, stream compression at the edge needs to meet several
of an advanced stateful compression algorithm and the
criticaldemands:
inherent characteristics of asymmetric multicore platforms,
• High compression ratio: Reducing the data footprint in CStream efficiently handles diverse data types while
the output stream is a key reason for using stream meeting hardware resource constraints and maintaining
compressionattheedge.Withthedatageneratedatthe energyefficiency.Thissectionelaboratesonthedesignand
edgebeingnearlyinfiniteandgrowingtoZBlevelper componentsofCStream.
yearrecently[21],andconsideringthelimitedmemory
capacity and communication bandwidth [6] on edge 3.1 VersatilityofCompressionAlgorithms
devices,ahighcompressionratiobecomesnecessary.
The heart of CStream lies in its support for a wide
• Highthroughput:Highthroughputisdesirableinstream
varietyofcompressionalgorithms.Itprovidesversatilityto
analytics, not only at the data center [22], [23], [1], but
diverseIoTdatatypesandoptimizescompressibilitywhile
alsoattheedge.Thehigh-ratedatastreamsattheedge,
minimizing information loss. Compression algorithms
collectedfrommassivedevicelinks[24],[6],necessitate
play a significant role in the historical landscape of
the capability to compress as much data as possible
data processing, with numerous variations proposed
withinagivenunitoftime.
since the 1950s [32]. These algorithms typically target
• Low energy consumption: Energy budget is particularly
improvementsintheoreticalcompressibilityorreductionsin
constrained at the edge, and the devices, often far
compression overhead [33], [34]. In constructing CStream,
from a stable and constant power supply, are expected
weencompassedtenrepresentativecompressionalgorithms
to function as long as possible [25]. Thus, energy
thatembodykeyfeaturessuchasfidelity,stateutilization,and
consumptionshouldbeminimized.
alignment(summarizedinTable1).
• Low latency: In many IoT applications, it’s crucial to
process data and make decisions in real time. Hence, 3.1.1 Fidelity
low-latencystreamcompressionisimportanttoensure
One of the fundamental distinctions among compression
timelyresponseanddecision-makingattheedge.
algorithmsistheirfidelity:thedegreetowhichtheoriginal
Meetingthesedemandssimultaneouslyisachallenging datacanbereconstructedfromcompresseddata.
task. For instance, increasing parallelism and allocating Lossless Compression. Lossless compression is the
more processor cores can achieve higher throughput, but most stringent form of fidelity, ensuring that the original
this approach will also increase energy consumption. data can be perfectly reconstructed from its compressed
Therefore, this study aims to reveal the complex form. Under lossless compression, CStream rearranges
relationships between compression ratio, throughput, data into a more compact representation without altering
energy consumption, and latency of stream compression its underlying meaning or losing any information. This
at the edge. We strive to offer comprehensive guidance for principle is strictly bounded by theoretical limits, such as
achievingsatisfyingtrade-offsamongthesefactorsandalso Shannon’s entropy [34], which serves as an upper bound
explorepotentialoptimalapproaches. on the effectiveness of lossless compression. One exemplar
is the Tcomp32 algorithm [28] used in CStream’s lossless
mode. It employs a lossless stream compression technique
3 CSTREAM: SOFTWARE-HARDWARE CO-
that suppresses leading zeros [28], a form of bit-level
DESIGN OF STREAM COMPRESSION
null suppression [35], and its compressibility limit aligns
Recognizing the unique challenges in edge computing with Shannon’s entropy. In this way, CStream preserves
environments, we introduce CStream, a comprehensive the accuracy and fidelity of the original data even under
software-hardware co-designed stream compression compression.

4
Lossy Compression. Lossy compression, on the other to state maintenance. Algorithm 3 illustrates the five-step
hand, relaxes the fidelity requirement, accepting some procedureusedinCStream’sstatefulcompressionmode.
loss of information to achieve higher compression ratios. During CStream’s development, we explored three
Underlossycompression,CStreamselectivelydiscardsless prevalenttypesofstateusageinstreamcompression:
| significant   | information    |              | from          | the         | original | data.   | The upper    |     |                |       |            |          |           |             |           |
| ------------- | -------------- | ------------ | ------------- | ----------- | -------- | ------- | ------------ | --- | -------------- | ----- | ---------- | -------- | --------- | ----------- | --------- |
|               |                |              |               |             |          |         |              | 1)  | Value-based    | state | is the     | simplest | state     | type,       | requiring |
| bound         | on compression |              | effectiveness |             |          | is then | determined   |     |                |       |            |          |           |             |           |
|               |                |              |               |             |          |         |              |     | only updates   | and   | records    | of       | the “last | compressed” |           |
| by the        | level          | of fidelity  | the           | system      | chooses  |         | to maintain. |     |                |       |            |          |           |             |           |
|               |                |              |               |             |          |         |              |     | value. CStream |       | employs    | this     | state in  | scenarios   | where     |
| For instance, |                | an unaligned |               | non-uniform |          |         | quantization |     |                |       |            |          |           |             |           |
|               |                |              |               |             |          |         |              |     | computational  |       | efficiency | is       | of utmost | importance. |           |
(UANUQ[27],[28])with8quantizationbitswouldresultin
Techniqueslikedeltaencoding[36],[1]andrun-length
ahighercompressionratio,andthusmoreinformationloss,
|     |     |     |     |     |     |     |     |     | encoding | (RLE) | [30] that | are considered |     | “lightweight” |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----- | --------- | -------------- | --- | ------------- | --- |
thanoneusing12quantizationbits.CStream’slossymode
|             |     |        |           |         |     |      |             |     | for both | stream | and database |     | compression |     | [1], [30], |
| ----------- | --- | ------ | --------- | ------- | --- | ---- | ----------- | --- | -------- | ------ | ------------ | --- | ----------- | --- | ---------- |
| is designed | to  | strike | a balance | between |     | high | compression |     |          |        |              |     |             |     |            |
serveasinspirationforthisstatetype.
| ratios and | acceptable |     | information |              | loss, | accommodating |           |     |                  |     |         |          |             |           |         |
| ---------- | ---------- | --- | ----------- | ------------ | ----- | ------------- | --------- | --- | ---------------- | --- | ------- | -------- | ----------- | --------- | ------- |
|            |            |     |             |              |       |               |           | 2)  | Dictionary-based |     | state,  | although |             | requiring | more    |
| the wide   | range      | of  | fidelity    | requirements |       | across        | different |     |                  |     |         |          |             |           |         |
|            |            |     |             |              |       |               |           |     | memory,          | can | greatly | enhance  | compression |           | ratios. |
applicationscenariosattheedge.
|     |     |     |     |     |     |     |     |     | A dictionary-based |     | state | maintains |     | a collection | of  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------ | --- | ----- | --------- | --- | ------------ | --- |
3.1.2 StateUtilization previously encountered “last compressed” values.
|                    |      |            |            |              |     |            |                |     | CStream     | leverages      | this | type   | of state  | to    | optimize |
| ------------------ | ---- | ---------- | ---------- | ------------ | --- | ---------- | -------------- | --- | ----------- | -------------- | ---- | ------ | --------- | ----- | -------- |
| State utilization, |      | which      | determines |              | how | a          | compression    |     |             |                |      |        |           |       |          |
|                    |      |            |            |              |     |            |                |     | compression | ratios         | when | memory | resources |       | permit.  |
| algorithm          | uses | historical |            | information, |     | is another | critical       |     |             |                |      |        |           |       |          |
|                    |      |            |            |              |     |            |                |     | It takes    | full advantage |      | of the | L1 cache  | [29], | making   |
| dimension          | in   | the design |            | of CStream.  |     | We         | divide it into |     |             |                |      |        |           |       |          |
dictionary-basedcompressionparticularlyeffective.
statelessandstatefulcompressionmodes,eachwithunique
|     |     |     |     |     |     |     |     | 3)  | Model-based | state | approximates |     | data | using | a model |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ----- | ------------ | --- | ---- | ----- | ------- |
advantagesandbest-usescenarios. with several parameters. This state type provides high
| Stateless |     | Compression. |     | In  | stateless |     | compression, |     |     |     |     |     |     |     |     |
| --------- | --- | ------------ | --- | --- | --------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
compressionratioswhenthedatastreamcloselyaligns
CStreamoperatesoneachdataitemortupleindependently
|         |           |     |     |      |         |      |          |     | with a certain | model. | CStream |     | uses | this state | type for |
| ------- | --------- | --- | --- | ---- | ------- | ---- | -------- | --- | -------------- | ------ | ------- | --- | ---- | ---------- | -------- |
| without | reference | to  | any | past | tuples. | This | approach |     |                |        |         |     |      |            |          |
suchdatastreams.Thepiece-wiselinearapproximation
| essentially | replicates |       | a set       | of operations |      | for | each tuple,  |     |                 |     |     |                   |     |           |     |
| ----------- | ---------- | ----- | ----------- | ------------- | ---- | --- | ------------ | --- | --------------- | --- | --- | ----------------- | --- | --------- | --- |
|             |            |       |             |               |      |     |              |     | (PLA) technique |     | has | been particularly |     | effective | for |
| requiring   | no         | state | management. |               | This | is  | particularly |     |                 |     |     |                   |     |           |     |
compressingsensor-generatedtimeseries[31],[13].
| beneficial  | in     | scenarios | where             | the | relationships |         | between  |     |     |     |     |     |     |     |     |
| ----------- | ------ | --------- | ----------------- | --- | ------------- | ------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| consecutive | tuples |           | are insignificant |     |               | or when | reducing |     |     |     |     |     |     |     |     |
processing overhead is essential. Algorithm 1 provides an Algorithm 3: CStream’s Stateful Compression
| overviewofCStream’sstatelesscompressionmode. |     |     |     |     |     |     |     | Mode |     |     |     |     |     |     |     |
| -------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
Input:inputstreaminData
Algorithm 1: CStream’s Stateless Compression Output:outputstreamoutData
whileinDataisnotstoppeddo
| Mode |     |     |     |     |     |     |     | 1   |     |     |     |     |     |     |     |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
(s0)loadthetuple(s)frominData;
| Input:inputstreaminData          |     |     |     |     |     |     |     | 2   |                          |     |     |     |     |     |     |
| -------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------ | --- | --- | --- | --- | --- | --- |
| Output:outputstreamoutData       |     |     |     |     |     |     |     | 3   | (s1)pre-process;         |     |     |     |     |     |     |
| whileinDataisnotstoppeddo        |     |     |     |     |     |     |     |     | (s2)stateupdate;         |     |     |     |     |     |     |
| 1                                |     |     |     |     |     |     |     | 4   |                          |     |     |     |     |     |     |
| 2 (s0)loadthetuple(s)frominData; |     |     |     |     |     |     |     | 5   | (s3)state-basedencoding; |     |     |     |     |     |     |
(s1)transformandfindthecompressibleparts; 6 (s4)outputcompresseddatatooutData;
3
| (s2)outputcompresseddatatooutData; |     |     |     |     |     |     |     |     | end |     |     |     |     |     |     |
| ---------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4                                  |     |     |     |     |     |     |     | 7   |     |     |     |     |     |     |     |
5 end
|     |            |     |         |     |           |     |             |     | As a concrete  | example | of          | stateful | compression, |              | we add |
| --- | ---------- | --- | ------- | --- | --------- | --- | ----------- | --- | -------------- | ------- | ----------- | -------- | ------------ | ------------ | ------ |
| As  | a concrete |     | example | of  | stateless |     | compression |     |                |         |             |          |              |              |        |
|     |            |     |         |     |           |     |             | the | delta-encoding | (i.e.,  | value-based |          | state)       | to Algorithm | 2,     |
algorithm, we show the detailed implementation of anddemonstratetheDelta−LEB128inAlgorithm4.
Android-Dex’sLEB128[26]inAlgorithm2.
Algorithm4:Delta-LEB128algorithm
Algorithm2:LEB128algorithm
Input:inputstreaminData
| Input:inputstreaminData    |     |     |     |     |     |     |     |     | Output:outputstreamoutData |     |     |     |     |     |     |
| -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- |
| Output:outputstreamoutData |     |     |     |     |     |     |     |     | state←0;                   |     |     |     |     |     |     |
1
1 whilenotreachtheendofinDatado 2 whilenotreachtheendofinDatado
| /*  | (s0) |     |     |     |     |     | */  |     |         |     |     |     |     |     |     |
| --- | ---- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- |
|     |      |     |     |     |     |     |     |     | /* (s0) |     |     |     |     |     | */  |
2 number←readnext32-bitfrominData; number←readnext32-bitfrominData;
| /*                                               | (s1) |     |     |     |     |     | */  | 3   |                   |     |     |     |     |     |     |
| ------------------------------------------------ | ---- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- |
|                                                  |      |     |     |     |     |     |     |     | /* (s1)           |     |     |     |     |     | */  |
| zeros←countingtheleadingzerosinnumber;           |      |     |     |     |     |     |     |     | lastNumber←state; |     |     |     |     |     |     |
| 3                                                |      |     |     |     |     |     |     | 4   |                   |     |     |     |     |     |     |
| 4 encoded←squeezezerosinnumberunderLEB128format; |      |     |     |     |     |     |     |     | /* (s2)           |     |     |     |     |     | */  |
| /*                                               | (s2) |     |     |     |     |     | */  |     |                   |     |     |     |     |     |     |
5 state←number;
| 5 writeencodedtooutData; |     |     |     |     |     |     |     |     | /* (s3)              |     |     |     |     |     | */  |
| ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- | --- | --- | --- |
| 6 end                    |     |     |     |     |     |     |     | 6   | x←number-lastNumber; |     |     |     |     |     |     |
zeros←countingtheleadingzerosinx;
7
8 encoded←squeezezerosinxunderLEB128format;
Stateful Compression.Incontrast,statefulcompression /* (s4) */
writeencodedtooutData;
| inCStreamusesamaintainedstatetoboostcompressibility. |     |     |     |     |     |     |     | 9   |     |     |     |     |     |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
10 end
| While       | the | stateful | mode      | often      |     | provides | superior |     |     |     |     |     |     |     |     |
| ----------- | --- | -------- | --------- | ---------- | --- | -------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| compression |     | ratios,  | it incurs | additional |     | overhead | due      |     |     |     |     |     |     |     |     |

5
TABLE2:Edgecomputingprocessorsstudied.
Delta-
lossy ADPCM
LEB128
byte
Processor Processor Byte ISA Frequency Core
stateful, unaligned UA Name Architectures Length Pattern Range/GHz Number
RLE value ADPCM H2+ [10] SMP 32bit RISC 0.416∼1.2 4
LEB128 RK3399AMP[9] AMP 64bit RISC 0.416∼1.8 6
stateful, Tdic32 RK3399SMP[9] SMP 64bit RISC 0.416∼1.8 6
PLA model lossy Z8350[11] SMP 64bit CISC 0.8∼1.92 4
byte
LEB128- unaligned
NUQ stateful,
byte dictionary Tdic32 utilizes a LZ4-like hash table [29] as its state,
UANUQ unaligned Tcomp32 whichtracksduplicationacross4096tableentriesbydefault.
Each32-bittupleisreplacedbyitsshorterhashindexifthe
Fig.2:Incrementalrelationshipamongalgorithms. tuple has appeared previously, as tracked by the table. In
contrast,Delta-LEB128maintainsasimplestate:itcomputes
the difference between two consecutive values, termed as
3.1.3 ByteAlignment the ”delta” state [1], [36], and applies LEB128’s method
to output the ”delta” state instead of the original value.
The alignment strategy of a compression algorithm,
Thewell-knowncommercialalgorithmrun-length-encoding
specifically whether it is byte-aligned or not, greatly
(RLE) [30] resembles Delta − LEB128 in a value-based
impacts both compressibility and computational overhead.
CStream offers both byte-aligned and non-byte- state, but it can further track the continuous duplication
times of the state value. Besides value and dictionary,
aligned modes to accommodate various computational
we can also upgrade LEB128 into model-based stateful
environmentsandusecases.
compressionPLA[31],[13],whichutilizespiecewiselinear
Byte-Aligned Compression. In byte-aligned mode,
CStream aligns data encoding with byte boundaries, a approximationasthemodel.
strategy similar to the LEB128 approach [26]. This mode Finally, we implement a form of lossy compression
by modifying the “delta” state encoding in Delta-LEB128,
capitalizes on the hardware characteristics of modern
leading to the creation of the Adaptive Differential Pulse-
processors that manage registers and memories in units of
Code Modulation (ADPCM). Specifically, we employ lossy
bytes. Despite this, a trade-off exists as the output code
non-uniform quantization [27] in ADPCM to encode the
length must be an integer multiple of a byte (i.e., 8 bits),
“delta” state, instead of the lossless LEB128 style. The
potentiallyleadingtosomewasteofbits.
ADPCM can be further equipped with byte-unaligned,
Non-Byte-Aligned Compression. Non-byte-aligned
mode in CStream works to mitigate bit-level waste.
Tcomp32-likeoutputformatasUAADPCM.
However, this comes at the expense of additional
computational overhead due to the need for more logical 3.2 AccommodatingtheMulticoreEdgeLandscape
and bit-shift operations, such as AND/OR. Because the
This section discusses the fundamental aspects of
minimal unit of output code length is one bit instead the multicore edge hardware that influence CStream’s
of one byte, appending and extracting data operations
implementation, making it conducive to various edge
may require extra computational instructions. Despite the
environments. It delves into the choices of architecture
increasedoverhead,thismodecansignificantlyincreasethe
and Instruction Set Architecture (ISA), and extends the
compressionratioinspecificscenarios,therebyprovidinga
discussion to the utilization and regulation of hardware
valuableoptionintheCStreamframework.
resources. The edge processors under examination are
detailedinTable2.
3.1.4 CompressionImplementation
The implementation of our algorithms follows a step-by- 3.2.1 ProcessorArchitecture:SymmetricandAsymmetric
step refinement and optimization process, illustrated in In the context of multicore processors, the architectural
Figure2.Thisapproachallowsustoincrementallyexamine design can be broadly bifurcated into symmetric and
theimpactofeachalgorithmicvariation,comparingpairsof asymmetricmodels.
sequentiallyconnectedalgorithms. Symmetric Architecture. Symmetric multicore
Initially, we implement the LEB128 algorithm in processors (SMPs) are not exclusive to center servers
the same way as Android-Dex [26], which serves as but are equally viable for edge devices. For instance, the
our foundation for stateless and byte-aligned stream UP board platform [37] supported by CStream employs
compression. Next, we adapt LEB128 to allow byte- a 4-core SMP z8350 [11]. The primary distinction between
unaligned output by simplifying Elias encoding [28] into the SMPs used at the edge and at the center lies in their
Tcomp32.Thisadjustmentinvolvesremovingleadingzeros energy efficiency: each core in an edge SMP is generally
from each 32-bit tuple and calculating the prefix based on more energy-optimized and less powerful than its center
thelengthofnon-zerobits. counterpart. CStream leverages the inherent simplicity
By changing the encoding of the LEB128 into non- and unified nature of the SMP architecture at the edge for
uniform quantization [27], we can implement the lossy straightforward parallel execution, facilitating the transfer
compression LEB128 − NUQ, which can be further ofexistingoptimizationsfromcloudSMPs[38],[39].
equipped with byte-unaligned output by upgrading into Asymmetric Architecture. Aiming for a balanced
UANUQ. Besides the stateless lossy extension, LEB128 trade-off between performance and energy efficiency,
andTcomp32canbealsoenrichedwithcompressionstates. asymmetric architectures offer a compelling alternative.

6
By featuring various types of execution units on a single 3.3 IntegratedSoftwareandHardwareOptimization
| processor, | these architectures |     | open | up new | avenues | for |         |           |        |             |     |           |        |
| ---------- | ------------------- | --- | ---- | ------ | ------- | --- | ------- | --------- | ------ | ----------- | --- | --------- | ------ |
|            |                     |     |      |        |         |     | CStream | optimizes | stream | compression |     | by finely | tuning |
optimizationinstreamcompression.Thisworkemphasizes software strategies and hardware configurations to create
| asymmetric | architectures |            | within | single | ISA,           | known as |               |           |     |                |             |                 |           |
| ---------- | ------------- | ---------- | ------ | ------ | -------------- | -------- | ------------- | --------- | --- | -------------- | ----------- | --------------- | --------- |
|            |               |            |        |        |                |          | a synergistic | interplay |     | that maximizes |             | both efficiency | and       |
| asymmetric | multicore     | processors | (AMPs) |        | [40]. However, |          | it            |           |     |                |             |                 |           |
|            |               |            |        |        |                |          | performance.  | Central   |     | to this        | integration | is              | CStream’s |
acknowledges the potential of other forms of asymmetry, comprehensive suite of parallelization strategies. The
such as edge CPU+GPU [41], [42], CPU+DSP [43], and nuances of this integration will be unpacked in the
CPU+FPGA[44],aspromisingareasforfutureexploration.
subsequentsections.
| 3.2.2 InstructionSetArchitecture |     |     |     |     |     |     | 3.4 ExecutionStrategies |     |     |     |     |     |     |
| -------------------------------- | --- | --- | --- | --- | --- | --- | ----------------------- | --- | --- | --- | --- | --- | --- |
CStream’s flexibility shines through its support for a The choice between Eager and Lazy Execution depends on
variety of ISAs, thereby covering the broad scope of edge streamdatacharacteristicsandhardwareresources.
| devices. |     |     |     |     |     |     | Eager | Execution. |     | Eager | execution | aligns | closely |
| -------- | --- | --- | --- | --- | --- | --- | ----- | ---------- | --- | ----- | --------- | ------ | ------- |
32-bit vs. 64-bit. While 32-bit processors maintain a with the inherent nature of streaming data—infinitely
foothold in the edge domain due to their long-standing incremental[48],[49].Aseachtuplearrives,itiscompressed
instantly.However,whilethisstrategyreflectsthestreaming
| development | ecosystem | and | lower | cost, | 64-bit | processors |     |     |     |     |     |     |     |
| ----------- | --------- | --- | ----- | ----- | ------ | ---------- | --- | --- | --- | --- | --- | --- | --- |
are increasingly gaining traction due to their enhanced model,itcanleadtoinefficienthardwareutilizationdueto
memoryaddressingefficiencyandspeed.CStreamextends frequent partitioning, synchronization, and potential cache
thrashing.
| its support | to both | variants, | facilitating |     | a   | balanced |     |     |     |     |     |     |     |
| ----------- | ------- | --------- | ------------ | --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
comparisonwithintherealmofstreamcompression. LazyExecution.Tocounteractthepotentialinefficiencies
CISC vs. RISC. The trade-off between the flexibility of Eager Execution, CStream introduces Lazy Execution.
|            |            |     |            |     |         |        | This strategy | batches |     | several | tuples | together | before |
| ---------- | ---------- | --- | ---------- | --- | ------- | ------ | ------------- | ------- | --- | ------- | ------ | -------- | ------ |
| of complex | (CISC) and | the | efficiency | of  | reduced | (RISC) |               |         |     |         |        |          |        |
instruction set architectures is dependent on specific compression, a practice known as micro-batching [50], [1].
applications.CStreamexploresthisdynamicinthecontext While this approach reduces communication overhead
|     |     |     |     |     |     |     | and promotes | better |     | hardware | utilization, | selecting | an  |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ------ | --- | -------- | ------------ | --------- | --- |
ofstreamcompression.Itrecognizesthegrowingpopularity
of RISC architectures, especially ARM processors, for edge appropriate batch size can be challenging, necessitating a
devices[25]. careful balance between frequent cache flush and reload
operationsandnotoverburdeningslowermemorystorage.
3.2.3 Energy-EfficientResourceManagement 3.4.1 StateManagementStrategies
Once a specific architecture and ISA have been Parallelizing stateful stream compression demands careful
|     | CStream |     |     |     |     |     |     |     |     |     |     |     | CStream |
| --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- |
selected, provides the means to finely tune consideration of state management and sharing.
hardwareresources,therebyenhancingthebalancebetween provides three key strategies: State Sharing and Private
| processingtimeandenergyconsumption. |     |     |     |     |     |     | State. |     |     |     |     |     |     |
| ----------------------------------- | --- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- |
Frequency Regulation.Theprocessor’sclockfrequency State Sharing. State Sharing allows all threads to share
directlyinfluencesitsperformanceandpowerconsumption. a single state, with locks implemented to prevent write
By executing more instructions per unit of time, a higher conflicts. While this method can theoretically offer higher
|           |                  |     |            |      |     |           | compressibility | due | to  | a collective | record | of past | tuples, |
| --------- | ---------------- | --- | ---------- | ---- | --- | --------- | --------------- | --- | --- | ------------ | ------ | ------- | ------- |
| frequency | leads to reduced |     | processing | time | and | increased |                 |     |     |              |        |         |         |
throughputbutatthecostofelevatedenergyconsumption. concurrency control overhead may hinder parallelism and
Conversely, lower frequencies are more energy-efficient impactperformance.
but result in lower processing rates. CStream facilitates Private State. In contrast, a private state lets each
explorationofthistrade-offbyallowingstreamcompression thread maintain its own state, thereby eliminating
tasks to be run at varying frequency settings. Moreover, concurrent conflicts. This strategy maximizes parallelism
the capability extends to dynamic frequency scaling butpotentiallyreducescompressibility,astheisolatedstates
using Dynamic Voltage and Frequency Scaling (DVFS) limitathread’sawarenessoftupleshandledbyothers.
| technology | [45], [46], | [47]. | Though | changes | in  | frequency |     |     |     |     |     |     |     |
| ---------- | ----------- | ----- | ------ | ------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
introduce overheads, CStream offers the potential to 3.4.2 SchedulingStrategies
explore whether the advantages of DVFS outweigh these For efficient workload distribution across multicore
costsinthecontextofstreamcompression. processors, CStream utilizes two main scheduling
Core Number Regulation. While cloud-based stream strategies: Simple Uniform Scheduling and Asymmetric-
processing frameworks [22], [23] typically utilize all awareScheduling.
available computational resources in pursuit of maximum Simple Uniform Scheduling. In Symmetric Multicore
performance, edge-based systems need to be more Processor (SMP) environments, CStream uses a “balanced
energy-conscious. Consequently, it might be beneficial to partition and equal distribution ratio” approach to
turn off or idle certain processor cores during stream scheduling [39]. This method takes advantage of the
compression operations to conserve energy. CStream symmetry inherent in SMPs, where all cores have equal
enables investigation into this trade-off between energy computationalcapacityandcommunicationdistance.
consumption and processing throughput by allowing Asymmetric-aware Scheduling. For Asymmetric
variable core usage, thereby further enhancing its Multicore Processors (AMPs), which have cores with
adaptabilitytodiverseedgeenvironments. different computational abilities and communication

7
TABLE3:Specificationsoftheenergymeter
The edge platform
The meter
|     |     |     |     |     |     |     |     | Sensorchip |     | INA226 |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------ | --- | --- | --- | --- |
sampling
|     |     |        |     |     |     |     |     | MCUchip   |     | ESP32S2    |     |     |     |     |
| --- | --- | ------ | --- | --- | --- | --- | --- | --------- | --- | ---------- | --- | --- | --- | --- |
|     |     | INA226 |     |     |     |     |     | Interface |     | USB2.0Full |     |     |     |     |
sensor
|     |              |     |       | power  |     |     |     | Rawresolution |     | 16bits     |     |     |     |     |
| --- | ------------ | --- | ----- | ------ | --- | --- | --- | ------------- | --- | ---------- | --- | --- | --- | --- |
|     |              |     |       |        |     |     |     | LSB           |     | 1.25mV,2mA |     |     |     |     |
|     |              |     | power |        |     |     |     | Measurement   |     | 0-15V,0-4A |     |     |     |     |
|     | I2C bus data |     |       | DC-5V  |     |     |     |               |     |            |     |     |     |     |
range
|     |     |     |     | Supply  |     |     |     | Samplerate |     | 1KSPS |     |     |     |     |
| --- | --- | --- | --- | ------- | --- | --- | --- | ---------- | --- | ----- | --- | --- | --- | --- |
power
|     | ESP32S2  |     | USB |     |     |     |     |     |     |     |     |     |     |     |
| --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
MCU
|     |     |     | 2.0 | data and command |     |     |     |          |                 |     |         |               |     |     |
| --- | --- | --- | --- | ---------------- | --- | --- | --- | -------- | --------------- | --- | ------- | ------------- | --- | --- |
|     |     |     |     |                  |     |     | and | hardware | configurations, |     | guiding | optimizations |     | and |
adaptationsbasedonup-to-dateenergyconsumptiondata.
Fig.3:Thedesignofenergymeter.
|            |         |     |         |     |                  |     | 4   | METHODOLOGY |     |     |     |     |     |     |
| ---------- | ------- | --- | ------- | --- | ---------------- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- |
| distances, | CStream |     | employs |     | Asymmetric-aware |     |     |             |     |     |     |     |     |     |
Scheduling[4].Thisstrategytailorsworkloaddistributionto
|     |     |     |     |     |     |     | This | section | presents |     | our methodological |     | approach | to  |
| --- | --- | --- | --- | --- | --- | --- | ---- | ------- | -------- | --- | ------------------ | --- | -------- | --- |
thecomputationalintensityofdifferentstreamcompression
|     |     |     |     |     |     |     | assessing |     | the effectiveness |     | and performance |     | of  | CStream. |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ----------------- | --- | --------------- | --- | --- | -------- |
stages,therebyoptimizinghardwareutilization.
|     |     |     |     |     |     |     | It provides |     | a comprehensive |     | explanation |           | of the | chosen    |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --------------- | --- | ----------- | --------- | ------ | --------- |
|     |     |     |     |     |     |     | performance |     | metrics,        | the | benchmark   | workloads |        | utilized, |
3.5 EnergyMetering
|     |     |     |     |     |     |     | and | the | selection | and | characteristics |     | of the hardware |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --------------- | --- | --------------- | --- |
Understanding and accurately measuring energy platformsinvolvedintheevaluation.
| consumption |       | is of | paramount   | importance |     | in    | edge |                    |     |     |     |     |     |     |
| ----------- | ----- | ----- | ----------- | ---------- | --- | ----- | ---- | ------------------ | --- | --- | --- | --- | --- | --- |
| computing,  | where | power | constraints |            | are | often | more |                    |     |     |     |     |     |     |
|             |       |       |             |            |     |       | 4.1  | PerformanceMetrics |     |     |     |     |     |     |
stringentthaninconventionaldatacenters.Tosupportthis
need,CStreamincludesacustom-developedenergymeter,
|     |     |     |     |     |     |     | In our | evaluation |     | of CStream’s | performance, |     | we  | focus on |
| --- | --- | --- | --- | --- | --- | --- | ------ | ---------- | --- | ------------ | ------------ | --- | --- | -------- |
as illustrated in Figure 3, to accurately measure energy a range of metrics, each providing insight into different
| consumption | across | various | edge | platforms. |     | The detailed |         |     |                    |     |       |             |             |     |
| ----------- | ------ | ------- | ---- | ---------- | --- | ------------ | ------- | --- | ------------------ | --- | ----- | ----------- | ----------- | --- |
|             |        |         |      |            |     |              | aspects | of  | its functionality. |     | These | performance | indicators, |     |
specificationisshowninTable3.
|     |     |     |     |     |     |     | initially | introduced |     | in Section | 2, include |     | compression | ratio, |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---------- | --- | ---------- | ---------- | --- | ----------- | ------ |
This energy metering component consists of Texas throughput, energy consumption, and end-to-end latency. For
| Instrument’s | INA226 |     | [51] chip, | which | acts as | a sensor | for  |         |        |     |             |            |             |     |
| ------------ | ------ | --- | ---------- | ----- | ------- | -------- | ---- | ------- | ------ | --- | ----------- | ---------- | ----------- | --- |
|              |        |     |            |       |         |          | each | metric, | we aim | to  | establish a | consistent | measurement |     |
currentandvoltage,andtheEspressif’sESP32S2[52]micro
|     |     |     |     |     |     |     | approach. |     | The average |     | value of these | metrics | is calculated |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ----------- | --- | -------------- | ------- | ------------- | --- |
control unit (MCU) for data pre-processing and USB-2.0 over a substantial data volume to avoid fluctuations and
communication with targeted asymmetric multicores. In ensure measurement consistency - specifically, over 932800
| this configuration, |     | the | meter | offers | precise | measurement |     |     |     |     |     |     |     |     |
| ------------------- | --- | --- | ----- | ------ | ------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
bytesoftuples.
capabilitieswhilemaintainingalowoverhead.Additionally, The compression ratio and normalized root mean square
for the UP board platform, it is possible to directly read error(NRMSE)arecalculatedbycomparingthecompressed
energyconsumptiondatafromX64msrregisters[53]before
|     |     |     |     |     |     |     | data | against | the raw | input. | The NRMSE, |     | specifically | used |
| --- | --- | --- | --- | --- | --- | --- | ---- | ------- | ------- | ------ | ---------- | --- | ------------ | ---- |
andafteranexperimentalrun.
|     |     |     |     |     |     |     | for | lossy | compression, |     | is defined | as NRMSE |     | = 1 × |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | ------------ | --- | ---------- | -------- | --- | ----- |
x¯
| Accurate | Measurement. |     | The | integration | of  | the INA226 | (cid:113) (cid:80)N |     |     |     |     |     |     |     |
| -------- | ------------ | --- | --- | ----------- | --- | ---------- | ------------------- | --- | --- | --- | --- | --- | --- | --- |
i (x[ i]−y[i])2 ,wherex¯representstheaveragevalueofthe
| chipandtheESP32S2MCUinourenergymeteringsystem |     |     |     |     |     |     |     | N   |     |     |     |     |     |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
facilitateshigh-precisionmeasurementofenergyusage.This input data stream, x[i],y[i] denote the individual values of
therawinputandthereconstructeddatafromcompression,
| accuracy | extends | from | the overall | system | level | down | to  |     |     |     |     |     |     |     |
| -------- | ------- | ---- | ----------- | ------ | ----- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
respectively,andN
the granularity of individual operations, providing deep isthetotalinputdatavolume.
insights into the energy profile of the stream compression Throughput and end-to-end latency provide insights
|     |     |     |     |     |     |     | into | the | system’s | operational | efficiency. |     | Throughput | is  |
| --- | --- | --- | --- | --- | --- | --- | ---- | --- | -------- | ----------- | ----------- | --- | ---------- | --- |
process.
|     |     |     |     |     |     |     |     |     | throughput |     | =   | N   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- |
Low Overhead. Our energy metering system has been measured as , where the
processingtime
designedforminimaloverhead.TheESP32S2MCUhandles processing time is obtained using OS-specific APIs such
datapre-processing,andtheuseofUSB-2.0communication as gettimeofday. End-to-end latency, an important metric in
ensures that the monitoring process does not interfere edge computing scenarios requiring real-time or near-real-
with the primary tasks of stream compression and parallel time data processing, quantifies the total time for a data
execution. element to traverse the compression system from input to
| Real-timeFeedback.Theenergymeteringsystemoffers |     |     |     |     |     |     | output. |     |     |     |     |     |     |     |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
real-time feedback on energy consumption. This feedback Energy consumption evaluation follows a two-step
enables dynamic adjustments of execution strategies, state procedure.First,wemeasureandeliminatethestaticenergy
management, and scheduling based on current energy consumption caused by irrelevant hardware or software
usage, thus supporting the goal of energy-efficient stream components, such as the Ethernet chip and back-end
compression. tcp/ip threads. Next, we monitor the energy consumption
Comprehensive Integration. The energy metering during the running of the stream compression benchmark,
system is tightly integrated with the rest of the without incurring additional overhead or interference. The
CStream framework. This integration allows it to specifics of energy recording are platform-dependent and
work synergistically with CStream’s software strategies arediscussedinSection3.5.

8
TABLE4:DatasetStudied.
4.2 BenchmarkWorkloads
In order to comprehensively evaluate CStream across a DatasetName Source DataStructure Stateless Stateful
|     |     |     |     |     |     |     |     |     |     |     |     | Compressibility |     | Compressibility |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --------------- |
diverse range of IoT use cases (discussed in Section 2.2), ECG[16] single plain high high
|             |                |     |     |     |           |       |          | Rovio[17] | multiple | binary |     | medium |     | medium |
| ----------- | -------------- | --- | --- | --- | --------- | ----- | -------- | --------- | -------- | ------ | --- | ------ | --- | ------ |
| we use five | representative |     |     | IoT | datasets. | These | datasets |           |          |        |     |        |     |        |
structured
were chosen to reflect various data sources (single Sensor[19] multiple textual low high
structured
| and multiple) |     | and diverse |     | data | structures | (plain, | binary |           |          |        |     |     |     |        |
| ------------- | --- | ----------- | --- | ---- | ---------- | ------- | ------ | --------- | -------- | ------ | --- | --- | --- | ------ |
|               |     |             |     |      |            |         |        | Stock[18] | multiple | binary |     | low |     | medium |
structured
structured, and textual structured). Furthermore, we Stock-key[18] multiple plain low medium
assess the compressibility of data from two perspectives: Micro[54] single plain adjustable adjustable
| stateless compressibility |     |     | and statefu; |     | compressibility, |     | utilizing | a   |     |     |     |     |     |     |
| ------------------------- | --- | --- | ------------ | --- | ---------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
TABLE5:Evaluatedhardwareplatforms
syntheticdatasettocalibratetheseproperties.
The stateless compressibility refers to the compressible Model Supported Number of Installed
space within each individual tuple x = v, which p r o cessor c ores m e m o ry
|                  |     |     |      |           |     | t        |        |               | H 2 + |     |     |     |     |       |
| ---------------- | --- | --- | ---- | --------- | --- | -------- | ------ | ------------- | ----- | --- | --- | --- | --- | ----- |
|                  |     |     |      |           |     |          |        | Bananapizero- |       |     | 4   |     | 51  | 2 M B |
| can be exploited |     | by  | both | stateless | and | stateful | stream | m2[56]        |       |     |     |     |     |       |
compression (refer to Section 3.1.2). On the other hand, Rockpi4a[55] RK3399 2big+4little 2GB
stateful compressibility points to the compressible space UPboard[37] Z8350 4 1GB
| hidden in     | the context |            | of the    | data   | stream, | considering | the          |            |                   |        |         |             |     |             |
| ------------- | ----------- | ---------- | --------- | ------ | ------- | ----------- | ------------ | ---------- | ----------------- | ------ | ------- | ----------- | --- | ----------- |
| current tuple | x           | τ and some | past      | tuples | {x      | t |t <      | τ} together. |            |                   |        |         |             |     |             |
|               |             |            |           |        |         |             |              | from 0)    | to reflect its    | actual | arrival | time        | to  | the system, |
| This can      | only        | be fully   | exploited |        | by a    | suitable    | stateful     |            |                   |        |         |             |     |             |
|               |             |            |           |        |         |             |              | and tuples | are time-ordered. |        | These   | timestamps, |     | which are   |
compression. stored separately from each tuple and are not subjected
OurselecteddatasetsaresummarizedinTable4andare
|     |     |     |     |     |     |     |     | to compression, | help | provide | a realistic |     | simulation | of data |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | ---- | ------- | ----------- | --- | ---------- | ------- |
detailedbelow:
arrivalinareal-worldscenario.Unlessotherwisespecified,
1) ECG [16]: The ECG dataset consists of raw ADC we generate incremental timestamps evenly to simulate an
recordings from electrocardiogram (ECG) monitoring averagearrivalspeedof16×106bytespersecond(e.g.,106
provided by the MIT-BIH database. Each reading is tuples per second for the Rovio dataset, which consists of
| packagedasaplain32-bitvalueforourevaluation.As |     |     |     |     |     |     |     | 128-bittuples). |     |     |     |     |     |     |
| ---------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- |
ECGisadirect,unstructuredreflectionofacontinuous
| physical | process, |     | it exhibits | the | highest | levels | of both |     |     |     |     |     |     |     |
| -------- | -------- | --- | ----------- | --- | ------- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- |
4.3 EdgeComputingPlatforms
independentandassociatedcompressibility.
2) Rovio [17]: The Rovio dataset continuously monitors To ensure a comprehensive and hardware-variant
|     |     |     |     |     |     |     |     | evaluation, | we deploy | three |     | distinct | edge | computing |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --------- | ----- | --- | -------- | ---- | --------- |
userinteractionswithaspecificgametoensureoptimal
service performance. Each data entry consists of a 64- platforms,eachfeaturinguniquecharacteristicsasoutlined
bit key and 64-bit payload. The Rovio dataset exhibits in Table 5. Importantly, all platforms are compatible with
|     |     |     |     |     |     |     |     | the mainline | Linux | kernel | and | support | the | Glibc with |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ----- | ------ | --- | ------- | --- | ---------- |
twocompressibletraits:first,itspayloadisconstrained
to a relatively small dynamic range, indicating C++20features,therebyenablingasharedcodebase.
independent compressibility; second, different tuples The Rockpi 4a [55] serves as our default evaluation
maysharethesamekey,whichdemonstratesassociated platform. Unless otherwise specified, we use its processor
|     |     |     |     |     |     |     |     | as RK3399AMP | and | engage | each | core | to operate | at its |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ------ | ---- | ---- | ---------- | ------ |
compressibility.
3) Sensor [19]: The Sensor dataset is comprised of full- maximum frequency: 1.8GHz for the larger cores (core4 to
text streaming data generated by various automated core5)and1.416GHzforthesmallercores(core0tocore3).
sensors(e.g.,temperatureandwindspeedsensors).For
ourevaluation,every16ASCIIcharactersintheSensor
5 EVALUATION
| dataset | forms | one | 128-bit | tuple. | The | Sensor | dataset |         |             |        |     |                 |     |         |
| ------- | ----- | --- | ------- | ------ | --- | ------ | ------- | ------- | ----------- | ------ | --- | --------------- | --- | ------- |
|         |       |     |         |        |     |        |         | In this | section, we | embark | on  | an experimental |     | journey |
primarilyexhibitsassociatedcompressibilityduetothe
repetitionofseveralfixedXMLpatternsacrossdifferent to evaluate the potency of various stream compression
tuples. schemes, particularly on edge platforms. This evaluation
|          |      |     |           |     |           |       |         | focuses | on a strategic | software-hardware |     |     |     | co-design as |
| -------- | ---- | --- | --------- | --- | --------- | ----- | ------- | ------- | -------------- | ----------------- | --- | --- | --- | ------------ |
| 4) Stock | [18] | and | Stock-Key |     | [18]: The | Stock | dataset |         |                |                   |     |     |     |              |
is a real-world stock exchange dataset packed in a explicatedinSection3.Wedelveintofivekeyareas:
(32-bit key, 32-bit payload) binary format. It exhibits 1) Anend-to-endcasestudyofCStream’ssolutionspace
| less | compressibility |     | than | Rovio | due | to  | fewer key |     |     |     |     |     |     |     |
| ---- | --------------- | --- | ---- | ----- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
isdemonstratedinSection5.1
duplications.Stock-KeyisasubsetoftheStockdataset, 2) The selection and performance of different stream
containingonlythe32-bitkeys. compressionalgorithms,areexploredinSection5.2.
| 5) Micro: | The | Micro | dataset |     | is a | synthetic | 32-bit |        |            |                |     |     |          |           |
| --------- | --- | ----- | ------- | --- | ---- | --------- | ------ | ------ | ---------- | -------------- | --- | --- | -------- | --------- |
|           |     |       |         |     |      |           |        | 3) The | impact and | considerations |     | of  | hardware | variants, |
dataset [54], used to further tune independent areinvestigatedinSection5.3.
and associated compressibility. We can adjust its 4) Theeffectivenessandscalabilityofnovelparallelization
dynamic range to control independent compressibility strategies,areexaminedinSection5.4.
and its level of duplication to control associated 5) The sensitivity and adaptability to varying workload
| compressibility. |     |     |     |     |     |     |     | characteristics,assessedinSection5.5. |     |     |     |     |     |     |
| ---------------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- |
To mitigate the impact of network transmission Our exploration culminates in Section 5.6, where we
overhead, all input datasets are preloaded into memory collate our findings. Unless otherwise specified, we adopt
before testing. Each tuple is assigned a timestamp (starting the following parallelization strategies: 1) lazy execution

9
14.0
12.0 10.0
8.0 6.0 4.0
2.0
0.0
103 102 Latency (ms)
)s/BM(
tuphguorhT
2.00
compression ratio
8 7 . . 5 9 2.6 1.75 7.3 6 6 . . 7 2 1.50 1.25
1.00 0.75 0.50
0.25
)BM/J( noitpmusnoc
ygrene
LEB128-NUQ UANUQ LEB128 Tcomp32 PLA
13.21 ADPCM UAADPCM Delta-LEB128 Tdic32 RLE
43.5 38.7 33.8 29.0
24.2 A 19.3 14.5 9.7 4.8 0.0 ECG Rovio Sensor Stock Stock-key
B
Fig. 4: The solution space of CStream under ≥ 6.0
compressionratio,≤5%NRMSE,andRK3399hardware.
with a 400-byte micro batch, 2) a regulated multicore
workload distribution ratio to optimize throughput, and
3) the use of a non-shared state for stateful stream
compression.
5.1 EndtoEndCaseStudy
In this case study, we have ECG data to be compressed
on RK3399 hardware, the compression ratio is expected to
be larger than 6.0, while the NRMSE should be controlled
below5%.CStreamwillhencechoosethePLAalgorithm,
and the whole available solution is provided as colorful
points in Fig 4. In general, higher energy consumption
is required when higher throughput, higher compression
ratio, or lower latency is expected, and the specific optimal
solution depends on users’ prioritization of performance
metrics.Forinstance,iftheuserfurtherwantstomaximize
the compression ratio, and then maximize throughput,
while keeping the energy consumption within 1.5J/MB,
theoptimaloneislabelledaspointA.Specifically,itutilizes
1 big core and 1 little core under their highest frequency,
lets each of them use a private PLA state, and schedules
the workload in an Asymmetric-aware manner. Both cores
executethestreamcompressionundera8KB micro-batch.
WealsomarkedacarelesssolutionpointBinFig4asa
contrast. This solution conducts a Tdic32 compression on
2 big cores and 4 little cores, the Tdic32 state is shared
by all cores, and OS scheduling is used along with on-
demandDVFS.Allcoresuseaneagerstrategyinconducting
stream compression. Note that, the optimal solution A
achieves 2.8× compression ratio, 4.3× throughput, 65%
latency reduction, and 89% energy consumption reduction
simultaneouslythanthecarelesssolutionB.
5.2 AlgorithmEvaluation
InordertoevaluatetheperformanceofCStream’ssupport
for diverse stream compression algorithms, we test ten
distinct algorithms, as summarized in Table 1, on five real-
worldIoTdatasets,asdetailedinTable4.
5.2.1 Fidelity:Losslessvs.LossyCompression
Referencing Figures 5a, 5b, 5c, and 5d, the distinction
between lossless and lossy compression becomes apparent.
Lossycompression,representedbyLEB128−NUQ,offers
a superior compression ratio (between 2.0 and 6.0) across
all datasets. Conversely, LEB128, a lossless algorithm,
)s/BM(
tuphguorhT
1.6 1.4 1.2 1.1 0.9
0.7 0.5 0.4 0.2 0.0 ECG Rovio Sensor Stock Stock-key
(a)Throughput
)BM/J(
noitpmusnoc
ygrenE
(b)Energyconsumption
6.8 6.0
5.3
4.5 3.8
3.0
2.3
1.5
0.8
0.0
ECG Rovio Sensor Stock Stock-key
oitar
noitarpmoC
3.8 3.4
3.0
2.5 2.1
1.7
1.3
0.8
0.4
0.0
ECG Rovio Sensor Stock Stock-key
(c)Compressionratio
)%(
ESMRN
(d)NRMSE
Fig.5:Comparingtenalgorithmsonfivedatasets.
struggles to exceed a ratio of 2.0. Remarkably, this high
compression ratio by LEB128 − NUQ introduces only
marginalinformationloss,withaNRMSEbelow3.8%.
5.2.2 StateUtilization:Statelessvs.StatefulCompression
On comparing Tcomp32 (stateless) with Tdic32 (stateful,
dictionary-based), we observe a trade-off between
compression cost and effectiveness. While Tcomp32
offers more modest compression ratios, it presents a less
complex, lower-cost compression process. On the other
hand, Tdic32, despite its higher processing cost due to
dictionary-basedstatemanagement,excelsinhandlingtext
data streams with high associated but low independent
compressibility,liketheSensordataset.
5.2.3 StateImplementation:Value,Dictionary,andModel
Further comparisons among ADPCM (stateful, value-
based), Tdic32 (stateful, dictionary-based), and PLA
(stateful, model-based) illustrate how different state
implementations can impact compression performance.
While ADPCM consistently leads in throughput and
energy consumption, Tdic32 and PLA shine in handling
structured data or data from multiple sources, offering
highercompressionratios.
5.2.4 ByteAlignmentVariations
Whencomparingbyte-alignedLEB128andbyte-unaligned
Tcomp32, we note a trade-off between compression
ratio and computational cost. Tcomp32 achieves higher
compression ratios but at the expense of added
computational overhead, given its bit-by-bit encoding
process.
5.3 HardwareEvaluation
In this section, we highlight how our novel framework,
CStream, explores various hardware design spaces,
including architecture selection, ISA selection, frequency
regulation, and core count adjustment. These are critical
aspects in ensuring optimal energy consumption and
throughput. We use the Tcomp32 algorithm and Rovio
datasetasourprimarytestcasesforthisevaluation.

10
4000
2000
0
102 103 Operational Intensity
snoitcurtsnI
)601x(dnoceS
reP
big core little core
0.3
0.2
s0, s2, s1, 0.1
(25) (102) (340)
0.0 amp smp_big smp_little
(a) The roofline model on
RK3399processor
BM/J
15.0
10.0
5.0
0.0
s/BM
Energy Consumption (J/MB)
Throughput (MB/s)
(b) Energy consumption and
throughputcomparison
Fig.6:ImpactsofprocessorarchitecturesforTcomp32.
2.0
1.5
1.0
0.5
0.0 RK3399_B RK3399_L H2+ Z8350
)BM/s(
emit
gnissecorP
s2 s1 s0
0.6
0.5
0.4
0.3
0.2
0.1
0.0 RK3399_B RK3399_L H2+ Z8350
(a)Unittimecost
)BM/J(
noitpmusnoc
ygrenE
s2 s1 s0
(b)Unitenergycost
Fig.7:ImpactsofISAforTcomp32.
1.4 1.3 1.1
1.0
0 0 .9 .408(B&L 0 ) .6(B&L 0 ) .816(B& 1 L .0 ) 08(B&L 1 ) .2(B&L 1 ) .416( 1 B . & 60 L 8 ) B&1 1 .4 .8 1 B 6 & L 1.416L
frequency (GHz)
BM/J 36.8 29.1 21.3
13.6
5.8
s/BM
Energy consumption (J/MB)
Throughput (MB/s)
1.8
1.3 0.9 0.4
0.0 performance conservative on-demand
(a)Staticallytuning
BM/J
36.8
27.6 18.4 9.2
0.0
s/BM
instructions per memory access), as shown by the dashed
lines in Figure6a. This difference in operational intensities
causes either over-provision or under-provision when
conducting stream compression on symmetric multicores,
therebyincreasingenergyconsumption.
The s0 step leads to less performance gain when run
on a big core than s1 and s2, as it primarily involves
memory manipulation and makes out-of-order big cores
over-provisioned. Therefore, much energy is wasted in the
smp big configuration. Conversely, s1 and s2 are more
worthwhile running on big cores as they offer enough
computation density for big cores to support. Their high
computation density also makes the little cores under-
provisioned,resultinginenergydissipationinthesmp little
configuration. Through CStream, we efficiently manage
thisarchitecturalselectionandintricacies,ensuringoptimal
energyusageandperformance.
5.3.2 ISASelection
CStream also enables us to investigate the effects of
different Instruction Set Architectures (ISA) on stream
compression performance. In this evaluation, we consider
the RK3399, H2+, and Z8350 hardware platforms, as
introducedinSection 4.3.
Specifically, we compare the time and energy cost
Energy consumption (J/MB) per core for each step of Tcomp32 under different ISAs Throughput (MB/s) (Figure 7a and 7b). To account for their different working
frequencies, we mathematically align their frequency to 1 GHz. The results for RK3399 are split into RK3399 B and
RK3399 L,representingitsbigandlittlecores,respectively.
(b)DVFS Our evaluation highlights two key findings. First,
the RISC ISA (used in RK3399) demonstrates superior
Fig.8:ImpactsoffrequencyregulationforTcomp32.
performance compared to the CISC ISA (used in Z8350).
Both RK3399 B and RK3399 L cores have significantly
lower unit energy costs than the Z8350, and the RK3399 B
5.3.1 ArchitectureSelection
can even reduce the processing time of each step by
CStream allows us to study the impact of different
50% compared to the Z8350. This is because RK3399’s
multicore configurations. We compare symmetric and
RISC-based execution hardware can directly execute the
asymmetric multicores under the same total computational
instructionsusedforstreamcompression,avoidingtheextra
power(i.e.,maximuminstructionspersecond).Theroofline
overhead of micro-coding them. As a result, both unit
model benchmark [57], [58] shows that one 1.416GHz
latencyandunitenergycostarereduced.
A72 big core in the RK3399 processor has about twice
Second, traditional 32-bit processors (like the H2+)
the computational power of one A53 little core at the
perform poorly in terms of both performance and energy
samefrequency(Figure6a).Therefore,wecomparedifferent
efficiency.Thisisduetothelimitationsofashorterregister
architectureconfigurationsusingthefollowingsettings:
length. For example, manipulating a 33-bit intermediate
• Asymmetric multicore processor (amp): Using 1 A72 resultofTcomp32canbedonewithasingleinstructionon
bigcoreand2A53littlecoresat1.416GHz. a single 64-bit register but requires two or more operations
• Symmetric multicore processor with only big cores on 32-bit registers. This inefficiency at the instruction and
(smp big):Using2A72bigcoresat1.416GHz. registerlevelsleadstosignificantlyincreasedlatencyandis
• Symmetric multicore processor with only little cores detrimentaltoenergyefficiency.
(smp little):Using4A53littlecoresat1.416GHz. Fromouranalysis,weconcludethatstreamcompression
Each architectural case is tuned to its maximum tasks should ideally be conducted on 64-bit RISC
throughput, after which we compare their energy edge processors. These insights, derived from CStream’s
consumption along with throughput (Figure 6b). The evaluation capabilities, underscore the importance of
asymmetric multicore configuration (amp) outperforms choosing the right ISA for efficient stream compression on
the symmetric configurations (smp big and smp little), edgedevices.
achieving both the lowest energy consumption and the
highestthroughput. 5.3.3 FrequencyRegulation
Furthermore, we observe that different stream CStream provides flexibility in frequency regulation,
compression steps (i.e., s0 ∼ s2 in Algorithm 1) involve allowing for both static frequency setting and dynamic
varying operational intensities[59], [60], [61], [62] (i.e., voltageandfrequencyscaling(DVFS).Inourevaluation,we

11
exploretheseapproaches’impactonthroughputandenergy 5.4 ParallelizationStrategies
consumption.
|     |     |     |     |     |     |     |     | We now | explore | various | parallelization |     | strategies | provided |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ------- | ------- | --------------- | --- | ---------- | -------- | --- |
Statically Tuning the clock frequency. We first adjust byCStream,includingdifferentexecutionstrategies,micro-
thefrequencyofthebigcores(denotedas“B”)andthelittle
|     |     |     |     |     |     |     |     | batch size, | state | sharing, | and scheduling |     | strategies. |     | Our |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ----- | -------- | -------------- | --- | ----------- | --- | --- |
cores(denotedas“L”)ontheRK3399processor.Weobserve
exploration,illustratedwiththeTcomp32algorithmandthe
how frequency changes influence the throughput and Rovio dataset, illustrates the importance of each strategy
| energy | consumption, |     | as shown | in  | Figure | 8a. As expected, |     |     |     |     |     |     |     |     |     |
| ------ | ------------ | --- | -------- | --- | ------ | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
anditsimpactsonenergyconsumptionandthroughput.
| the relationship |         | between |           | frequency | and       | throughput |         | is    |                               |     |     |     |     |     |     |
| ---------------- | ------- | ------- | --------- | --------- | --------- | ---------- | ------- | ----- | ----------------------------- | --- | --- | --- | --- | --- | --- |
| nearly           | linear: | higher  | frequency | enables   |           | cores to   | execute |       |                               |     |     |     |     |     |     |
|                  |         |         |           |           |           |            |         | 5.4.1 | ExecutionStrategy:EagervsLazy |     |     |     |     |     |     |
| more operations  |         | per     | unit      | time, and | therefore | more       | tuples  |       |                               |     |     |     |     |     |     |
AkeycomponentofourCStreamframeworkistheability
arecompressed.
Energy consumption, however, doesn’t follow a simple to vary the execution strategy. Specifically, we explore the
|           |              |     |      |            |     |                   |     | differences | between |     | eager and | lazy | execution | strategies |     |
| --------- | ------------ | --- | ---- | ---------- | --- | ----------------- | --- | ----------- | ------- | --- | --------- | ---- | --------- | ---------- | --- |
| monotonic | relationship |     | with | frequency. |     | It is the product |     |             |         |     |           |      |           |            |     |
usingtheTcomp32algorithmandtheRoviodataset.
| of power | and | time, | both | of which | respond | differently | to  |     |     |     |     |     |     |     |     |
| -------- | --- | ----- | ---- | -------- | ------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
frequency changes. For example, a frequency of 0.408 GHz Under eager execution, each incoming tuple is
compressedassoonasitarrives.Onthecontrary,underlazy
| leads to | lower | power | according |     | to existing | work | [45], |     |     |     |     |     |     |     |     |
| -------- | ----- | ----- | --------- | --- | ----------- | ---- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
execution(implementedasthedefaultsettinginCStream),
| [46], but | also | involves |     | more processing |     | time, | which |     |     |     |     |     |     |     |     |
| --------- | ---- | -------- | --- | --------------- | --- | ----- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
counteracts the power reduction. Thus, it’s less energy- compression is conducted only after the accumulation of
efficient than the 0.6 GHz frequency. When the frequency a 400-byte micro-batch. These strategies do not affect the
|     |     |     |     |     |     |     |     | compression |     | ratio but | significantly | influence |     | throughput |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --------- | ------------- | --------- | --- | ---------- | --- |
surpasses0.816GHz,theenergyconsumptionincreaseswith
frequencybecausetheriseinpowerismoresignificantthan andenergyconsumption.
thetimereduction. Figure 10a clearly illustrates the superiority of the lazy
|       |     |      |        |          |          |       |       | strategy, | leading | to  | higher throughput |     | and | lower | energy |
| ----- | --- | ---- | ------ | -------- | -------- | ----- | ----- | --------- | ------- | --- | ----------------- | --- | --- | ----- | ------ |
| DVFS. | We  | also | employ | the DVFS | approach | [45], | [46], |           |         |     |                   |     |     |       |        |
[47] to dynamically adjust the frequency. We use different consumption.Theeagerapproachincursahighenergycost
DVFS strategies and present the results in Figure 8b. The becauseitmustimmediatelydistributeeachincomingtuple
totherunningcores,thusreducingparallelism.Incontrast,
“performance”strategy,whichfixeseachcoreatitshighest
frequency without dynamic reconfiguration (1.8GHz for the lazy strategy enhances parallelism by accumulating
big cores and 1.416GHz for little cores), serves as a workloadsbeforedistribution.
|            |     |                |     |     |             |            |     | To better |     | understand | the cost | difference |     | between | the |
| ---------- | --- | -------------- | --- | --- | ----------- | ---------- | --- | --------- | --- | ---------- | -------- | ---------- | --- | ------- | --- |
| reference. | The | “conservative” |     | and | “on-demand” | strategies |     |           |     |            |          |            |     |         |     |
attempt to reduce energy consumption by dynamically two execution strategies, we break down the processing
reconfiguring frequency. The primary difference is that the time into ’blocked’ and ’running’ phases, as presented in
“conservative” strategy changes frequency less frequently Table 10b. ’Blocked’ time is spent resolving concurrent
than“on-demand”. read/write conflicts and mitigating cache trashing, while
Ourresultsindicatethatthe“conservative”strategycan ’running’timeisdevotedtotheactualcompressionprocess.
furtherreduceenergyconsumptionby15%comparedtothe The eager execution strategy incurs significantly more
default “performance strategy”, albeit at the cost of a 38% blockedtime,leadingtohighoverheadandreducedenergy
| increase | in latency. |     | This strategy |     | offers | a coarser-grained |     | efficiency. |     |     |     |     |     |     |     |
| -------- | ----------- | --- | ------------- | --- | ------ | ----------------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
balance of energy efficiency and latency constraints, since In our study of execution strategies, we further
theoverheadofdynamicfrequencyregulationcanintroduce investigate the effects of varying batch sizes during lazy
latency variability. In contrast, the “on-demand” strategy execution. Continuing with the Tcomp32 algorithm and
doesn’t provide any benefits; it actually increases both Rovio dataset, we vary the batch size from hundreds
|         |            |             |     |     |        |               |     | of bytes | to millions |     | of bytes. The | impacts |     | of batch | size |
| ------- | ---------- | ----------- | --- | --- | ------ | ------------- | --- | -------- | ----------- | --- | ------------- | ------- | --- | -------- | ---- |
| latency | and energy | consumption |     | due | to the | high overhead |     |          |             |     |               |         |     |          |      |
offrequentfrequencyswitches. on energy consumption and throughput are illustrated in
| Through |     | this exploration, |     | CStream |     | highlights | the | Figure11a. |     |     |     |     |     |     |     |
| ------- | --- | ----------------- | --- | ------- | --- | ---------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
critical role of frequency regulation in achieving energy- The results show that both minimum energy
efficient stream compression, guiding us towards more consumption and maximum throughput occur
efficienthardwareconfigurationsandsettings. simultaneously at an optimal, moderate batch size.
|     |     |     |     |     |     |     |     | Any deviation |     | from | this size—either |     | by  | increasing | or  |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ---- | ---------------- | --- | --- | ---------- | --- |
5.3.4 TuningtheNumberofCores
|     |     |     |     |     |     |     |     | decreasing | the | batch—leads | to  | reduced | throughput |     | and |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ----------- | --- | ------- | ---------- | --- | --- |
Finally,wedemonstratetheabilityofCStreamtoeffectively increased energy consumption. This finding underscores
manage the number of cores for stream compression tasks. theimportanceofoptimizingbatchsizeforefficientstream
| TheresultsareshowninFigure9. |     |     |     |     |     |     |     | compressiononedgedevices. |     |     |     |     |     |     |     |
| ---------------------------- | --- | --- | --- | --- | --- | --- | --- | ------------------------- | --- | --- | --- | --- | --- | --- | --- |
By enablingdifferent numbers of Significantly,wedrawattentiontoacorrelationbetween
big and little cores, we observe Energy consumption (J/MB) Throughput (MB/s) the optimal batch size and the total L1D cache size of
|     |     |     |     |     | 0.8 |     | 36.8 |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
a trade-off between energy all cores, indicated by the red dashed line in Figure 11a.
|     |     |     |     |     | 0.6 |     | 28.3 |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
consumption and throughput. BM/J s/BM The closeness of these values suggests that efficient micro-
|     |     |     |     |     | 0.4 |     | 19.9 |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
This demonstrates CStream’s batchingshouldbecognizantoftheL1Dcachesize.Hence,
|     |     |     |     |     | 0.2     |     | 11.4 |           |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ------- | --- | ---- | --------- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     | 0.00B1L |     | 3.0  | CStream’s |     |     |     |     |     |     |     |
flexible core management 0B2L 0B3L Cores 0B4L 1B4L 2B4L strategy for lazy execution, which includes an
strategy, striking a balance L1D-cache-aware approach to micro-batching, can offer
between energy efficiency and Fig.9:Scalability substantial advantages in terms of energy efficiency and
| throughput. |     |     |     |     |     |     |     | throughput. |     |     |     |     |     |     |     |
| ----------- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |

12
| As  | we continue | to  | evaluate | the | implications | of  | the |     |     |     |     |     |     |     |     |
| --- | ----------- | --- | -------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Energy consumption (J/MB)
| batch size | in our | lazy | execution | strategy, | we  | now | turn |     | Throughput (MB/s) |     |      |     |     |     |     |
| ---------- | ------ | ---- | --------- | --------- | --- | --- | ---- | --- | ----------------- | --- | ---- | --- | --- | --- | --- |
|            |        |      |           |           |     |     |      | 2.7 |                   |     | 38.6 |     |     |     |     |
Tcomp32
| our attention | to  | the role | of latency. | Using | the |     |     | 2.1  |     |     | 29.0 |     |     |     |     |
| ------------- | --- | -------- | ----------- | ----- | --- | --- | --- | ---- | --- | --- | ---- | --- | --- | --- | --- |
|               |     |          |             |       |     |     |     | BM/J |     |     | s/BM |     |     |     |     |
algorithm and the Rovio dataset, we consider average 1.4 19.3
|                       |                 |            |       |        |       |         |       | 0.7         |      |                | 9.7 |                            |             |             |     |
| --------------------- | --------------- | ---------- | ----- | ------ | ----- | ------- | ----- | ----------- | ---- | -------------- | --- | -------------------------- | ----------- | ----------- | --- |
| latency               | under different |            | batch | sizes. | These | results | are   |             |      |                |     |                            |             |             |     |
|                       |                 |            |       |        |       |         |       | 0.0         |      |                | 0.0 | Executionway               | Blockedtime | Runningtime |     |
|                       |                 |            |       |        |       |         |       |             | lazy | eager          |     | Eager                      | 0.53        | 0.03        |     |
| presentedinFigure11b. |                 |            |       |        |       |         |       |             |      |                |     | Lazy                       | 0.006       | 0.03        |     |
|                       |                 |            |       |        |       |         |       | (a) Energy  |      | and throughput |     |                            |             |             |     |
| Interestingly,        |                 | we observe | a     | curve  | where | latency | first |             |      |                |     |                            |             |             |     |
|                       |                 |            |       |        |       |         |       | consumption |      |                |     | (b)Processingtimebreakdown |             |             |     |
decreasesandthenincreasesasthebatchsizechanges.This
invertedU-shapepatternimpliesatrade-offindetermining Fig.10:ImpactsofexecutionstrategyforTcomp32.
theoptimalbatchsize.Itiscrucialtobalancethecompeting
| requirements | of  | lower latency |     | and improved |     | throughput |     |     |     |     |     |     |     |     |     |
| ------------ | --- | ------------- | --- | ------------ | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
andenergyefficiency.
Energy consumption (J/MB)
| Furthermore,theincreaseinlatencyappearstocorrelate |          |       |        |         |         |      |        |          | Throughput (MB/s) |     |     |                         |     |     |     |
| -------------------------------------------------- | -------- | ----- | ------ | ------- | ------- | ---- | ------ | -------- | ----------------- | --- | --- | ----------------------- | --- | --- | --- |
|                                                    |          |       |        |         |         |      |        | 1.8      |                   |     |     | 43.5 )sm( ycnetaL elpuT |     |     |     |
| strongly                                           | with the | total | L1D    | cache   | size of | all  | cores, |          |                   |     |     |                         |     |     |     |
|                                                    |          |       |        |         |         |      |        | 1.6      |                   |     |     | 39.3 400.0              |     |     |     |
|                                                    |          |       |        |         |         |      |        | BM/J 1.4 |                   |     |     | 35.2 s/BM               |     |     |     |
| highlighted                                        | by the   | red   | dashed | line in | Figure  | 11b. | Upon   |          |                   |     |     | 200.0                   |     |     |     |
|                                                    |          |       |        |         |         |      |        | 1.2      |                   |     |     | 31.0                    |     |     |     |
exceedingthiscachesize,latencyseesanoticeableincrease, 1.1 103 104 105 106 26.9
|     |     |     |     |     |     |     |     |     |     |     |     |     | 103 | 104 | 105 106 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- |
which can be attributed to the higher likelihood of cache batch size (byte) batch size (byte)
missesasthebatchsizeoutstripstheavailablecache. (a) Energy and throughput (b) Average latency; The red
|       |              |           |     |                |     |       |      | consumption |     |     |     | dashedlineisthetotalL1Dsize |     |     |     |
| ----- | ------------ | --------- | --- | -------------- | --- | ----- | ---- | ----------- | --- | --- | --- | --------------------------- | --- | --- | --- |
| These | observations | reinforce |     | the importance |     | of an | L1D- |             |     |     |     |                             |     |     |     |
ofallcores
cache-awareapproachtosettingthebatchsizeinCStream’s
lazy execution strategy. Balancing the demands of latency, Fig.11:ImpactsofbatchsizesforTcomp32.
| throughput,      | and               | energy | efficiency | requires    | a sophisticated |           |     |          |          |              |            |             |            |                |     |
| ---------------- | ----------------- | ------ | ---------- | ----------- | --------------- | --------- | --- | -------- | -------- | ------------ | ---------- | ----------- | ---------- | -------------- | --- |
| approach         | to micro-batching |        | —          | a challenge | that            | CStream   |     |          |          |              |            |             |            |                |     |
| effectively      | navigates         | with   | its        | adaptive    | and             | hardware- |     |          |          |              |            |             |            |                |     |
|                  |                   |        |            |             |                 |           |     | This     | in-depth |              | analysis   | underscores |            | the preference |     |
| consciousdesign. |                   |        |            |             |                 |           |     |          |          |              |            |             |            | CStream’s      |     |
|                  |                   |        |            |             |                 |           |     | for a    | private  | state        | management | strategy    |            | in             |     |
|                  |                   |        |            |             |                 |           |     | stateful | stream   | compression, |            | enhancing   | throughput |                | and |
5.4.2 StateManagementStrategy:SharedvsPrivate energy efficiency without significantly compromising the
compressionratio.
Oneofthecriticalconsiderationswithintherealmofstateful
| stream | compression | in  | CStream | is  | the choice | between |     |     |     |     |     |     |     |     |     |
| ------ | ----------- | --- | ------- | --- | ---------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sharingthestateacrossthreadsormaintainingprivatestates 5.4.3 VaryingSchedulingStrategy
| for each | thread. We | utilized | the | Tdic32 | algorithm | and | the |     |     |     |     |     |     |     |     |
| -------- | ---------- | -------- | --- | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Rovio dataset to investigate the trade-offs associated with In order to determine the optimal scheduling strategy,
|     |     |     |     |     |     |     |     | we explore |     | both | symmetric | and asymmetric |     | approaches |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ---- | --------- | -------------- | --- | ---------- | --- |
eachstatemanagementstrategy.
Tcomp32
In the shared state scenario, each working thread using the algorithm and the Rovio dataset. As
shares a common concurrent dictionary. In contrast, with the scheduling strategy doesn’t influence the compression
|     |     |     |     |     |     |     |     | ratio, | we focus | our | evaluation | on energy | consumption |     | and |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | -------- | --- | ---------- | --------- | ----------- | --- | --- |
privatestatemanagement,eachthreadmaintainsitsprivate
dictionary. These two strategies are elaborated further in throughput,aspresentedinFigure13a.
Section 3.1.2. Figure 12a compares the resulting energy Interestingly, symmetric scheduling results in both
consumptionandthroughputforeachscenario. a reduction in throughput (26.2%) and an increase in
Interestingly, state sharing incurs a significantly higher energy consumption (13.4%) compared with asymmetric
energy consumption and concurrently reduces throughput. scheduling. The underlying reason is that symmetric
|          |            |     |       |          |      |            |     | scheduling |     | fails to | take | into account | the | differences | in  |
| -------- | ---------- | --- | ----- | -------- | ---- | ---------- | --- | ---------- | --- | -------- | ---- | ------------ | --- | ----------- | --- |
| However, | the shared |     | state | strategy | only | marginally |     |            |     |          |      |              |     |             |     |
improvesthecompressionratio,movingfrom1.78without hardware, as we have previously illustrated in Figure 6a.
state sharing to 1.81 with state sharing. In most cases, This oversight leads to a wastage of the superior
computationalpowerofbigcores.
| pursuing | a mere | 3% improvement |     | in  | compression |     | ratio |     |     |     |     |     |     |     |     |
| -------- | ------ | -------------- | --- | --- | ----------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
is not worthwhile, especially considering the overhead For instance, Figure 13b shows the processing time
involved. for the s1 step of the Tcomp32 algorithm for both big
To delve deeper into the source of the increased and little cores. It becomes evident that under symmetric
overhead with shared state management, we broke down scheduling, big cores spend a considerable amount of time
theprocessingtimeforeachstep,asdefinedinAlgorithm3, waiting for little cores. This inefficient waiting period is
theprimarycontributortothesub-optimalenergyefficiency
| for the | two implementation |     | versions. |     | This breakdown |     | is  |     |     |     |     |     |     |     |     |
| ------- | ------------------ | --- | --------- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
presentedinFigure12b. andperformanceundersymmetricscheduling.
The analysis revealed that the bulk of the added To circumvent this issue, we strongly recommend
s2),
cost is accrued during the state updating step (i.e., asymmetric scheduling. This approach respects the unique
where frequent locking significantly reduces parallelism. computational capabilities of different cores, efficiently
The cores, while waiting for locks, are mainly engaged allocating tasks in a manner that optimizes performance
in memory access, which is less energy-demanding than andenergyusage.Asaresult,itachieveshigherthroughput
arithmetic calculations. This explains why the rise in andlowerenergyconsumptionthansymmetricscheduling,
energy consumption is not as pronounced as the drop in demonstrating its superiority in managing heterogeneous
throughputwithsharedstatemanagement. multi-coresystemsforstreamcompressiontasks.

13
2.5
1.8
1.2
0.6
0.0 share not share
BM/J
18.6
14.0
9.3
4.7
0.0
s/BM
Energy consumption (J/MB) Throughput (MB/s)
0.25
0.20
0.15
0.10
0.05
0.00
s0 s1 s2 s3 s4
(a) Energy and throughput
comparison
)BM/s(
emit
gnissecorP
share not share
(b) Step breakdown
comparison
Fig.12:ImpactsofstatemanagementstrategyforTdic32.
1.1
0.8 0.5
0.3
0.0 asymmetric symetric
BM/J
36.3
27.2 18.2
9.1
0.0
s/BM
Energy Consumption (J/MB) Throughput (MB/s)
0.010 0.008 0.006
0.004
0.002
0.000 asymmetric symetric
(a)Varyingschedulingstrategy
)BM/s(
emit
gnissecorP
big cores little cores
(b)Timebreakdown
Fig.13:ImpactsofschedulingstrategyforTcomp32.
1.8
1.7
1.6
1.5
1.4 101 102
Arrival rate (MB/s)
BM/J
36.5
33.7
30.9
28.1
25.3
s/BM
Energy consumption (J/MB) Throughput (MB/s)
2.3
2.1
1.8
1.6
1.-40.1 0.2 0.5 0.8 1.1
Zipf factor
(a)Arrivalrate
BM/J
38.0
36.8
35.6
34.4
33.2
s/BM
Energy consumption (J/MB) Throughput (MB/s)
(b)Arrivalskewness
Fig.14:ImpactsofarrivalpatternforTcomp32.
17.50
15.00 12.50
10.00
8 10 12 14 16 18 20 22 24
range/log2
)s/BM(
tuphguorhT
stateless stateful
2.5
2.0
1.5
8 10 12 14 16 18 20 22 24
range/log2
(a)Throughput
oitar
noisserpmoc
stateless statefull
(b)Compressionratio
Fig. 15: Impacts of dynamic range for stateless (Tcomp32)
andstatefulstreamcompression(Tdic32).
0.0
0.0
0.0
0.0 0.2 0.4 0.6 0.8
duplication ratio
)s/BM(
tuphguorhT
stateless stateful
2.0
1.5
1.0
0.0 0.2 0.4 0.6 0.8
duplication ratio
(a)Throughput
oitar
noisserpmoc
the Rovio dataset while adjusting the arrival pattern of
tuples, and a synthetic dataset, Micro, for evaluating the
impactofdatacompressibility.
5.5.1 ArrivalPattern
Arrival patterns of tuples can significantly affect the
performance of stream compression algorithms. By
manipulatingtheorderoftimestampsintheRoviodataset,
weareabletomodifythetuplearrivalcharacteristicswhile
keepingotherparametersconstant.
Impacts of arrival rate. The impact of varying arrival
rates is depicted in Figure 14a. Here, the arrival rate of
tuples varies from 500 to 106 per second. When the arrival
rate is low, the hardware is underutilized, resulting in increased processing latency. This underutilization is due
to more cycles of periodical DDR4 refreshing [63], leading
to increased overhead. Conversely, when the arrival rate is
high,processinglatencyincreasesduetoresourceconflicts,
suchascachemisses.
Impacts of arrival skewness. Figure 14b shows the
impact of varying levels of arrival skewness on the latency
of Tcomp32. Arrival skewness is varied by adjusting the
Zipf factor from 0 to 1. Increased skewness leads to higher
latencies as both under-utilization and overloading cases
becomemoreprevalent.
5.5.2 DataCompressibility
We further assess the impact of data compressibility on
the performance of both stateless and stateful compression
algorithms using the Micro dataset. The stateless Tcomp32
and stateful Tdic32 compression algorithms are chosen for
thisanalysis.
Impacts of stateless compressibility. Stateless
compressibility can be exploited by analyzing a single
piece of input data without referring to a state. Figure 15a
and 15b show the throughput and compression ratio
respectively for varying levels of stateless compressibility.
For the stateless Tcomp32, as the dynamic range increases,
it becomes more costly and less compressible. However,
Tdic32exhibitsa”cliffeffect”ataround212,corresponding
to its dictionary entries. Before this threshold, Tdic32
achieves higher compressibility and lower latency, after
stateless stateful whichthecompressibilitybecomesnearlyconstant.
Impacts of stateful compressibility. Stateful
compressibility, on the other hand, can be detected
by referencing the history of the compression process.
Figure 16a and 16b show the throughput and
compression ratio respectively for varying levels of
(b)Compressionratio stateful compressibility. As the duplication ratio increases,
the stateful Tdic32 experiences higher throughput and a
Fig.16:Impactsoftupleduplicationforstateless(Tcomp32)
highercompressionratioduetolessfrequentstateupdates
andstatefulstreamcompression(Tdic32).
and fewer bits of compressed data output. In comparison,
the stateless Tcomp32 is largely unaffected by changes in
statefulcompressibility.
5.5 WorkloadSensitivityStudy
In this subsection, we illustrate the robustness of our
5.6 Summary
framework, CStream, by conducting a comprehensive
sensitivity analysis based on varying IoT data workloads. Wehavethreekeyfindingassummarizedbelowaccording
Our goal is to assess how CStream responds under diverse toourevaluationresults.
arrivalpatternsanddifferinglevelsofdatacompressibility. Firstly, there is no single stream compression algorithm
OurevaluationutilizestheTcomp32algorithmtocompress that can always outperform others. On the one hand, the

14
applicable stream compression algorithms have different continuous arrival of data streams, a characteristic that
and complex impacts on efficiency and cost of stream significantly affects the dynamics of compression at the
compression, and there are trade-offs during the selection. edge.Furthermore,theydonotfullycoverallpossibledata
For instance, we can use more costly stateful stream casesandoftenoverlookenergyimpacts,whichareamajor
compression to improve compression ratio, or the more concerninedgecomputing.CStreamdiffersbyconsidering
lightweight stateful stream compression to achieve lower the continuous data stream arrival, comprehensively
latency under lower compression ratio. On the other covering different data cases, and prioritizing energy
hand, the workload with different structure pattern and consumptionasakeyperformancemetric.
stateless/stateful compressibility can make the optimal Parallel Data Compression. While numerous
selection different. Moreover, the different arrival pattern studies [70], [71], [72], [73], [74], [75], [76], [77], [78], [79],
of even the same workload can affect the compression [80],[38],[1],[81],[82],[83],[24],[84],[85]haveexploredthe
cost a lot. Despite the complex relationship, we observe parallelization of data compression algorithms, their focus
the lossy stream compression can always achieve highest has mostly been on compressing static data across various
compressionratioforallreal-worldscenarioswithmarginal hardwareplatforms.However,theseworksdonotprimarily
informationloss. concern energy efficiency and stream compression at the
Secondly, the parallelization of stream compression edge. They also tend to focus on heavy-weight stateful
requires a careful design to reduce cost. Specifically, compressionmethods.Incontrast,CStreamaddressesthese
we should consider both hardware utilization and gapsbyfocusingonbothstatelessandstatefulcompression
communication overhead when determine the granularity algorithms’ pros and cons and emphasizes the incremental
of partition and communication. Moreover, a cache-aware natureofdatastreamsinedgecomputingscenarios.
agglomeration is essential to reduce cost and increase Utilizing Asymmetric Architecture at the Edge.
| parallelism, | and there | would | be  | 11x | more penalty |     | without |     |     |     |     |     |     |     |     |
| ------------ | --------- | ----- | --- | --- | ------------ | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
Asymmetricarchitecture[40],[60],[86],[62],[47],[87],[88],
usingit. [61], [89], [90] has proven beneficial for delivering high
Thirdly, it’s highly recommend to conduct stream performance with energy efficiency, a critical requirement
compression on asymmetric 64-bit RISC edge processor, as for edge computing. While valuable contributions have
suchnewhardwaretendencycandeliverupto59%latency been made in understanding and managing asymmetry
reduction and up to 69% energy consumption reduction in workload scheduling [61], [91], [89], none of these
in stream compression compared with legacy hardware. workshavespecificallyexploredstreamcompressiontasks.
Besides, the frequency and cores regulation allow us to CStream is designed to fill this gap, exploiting the
further tread-off time and energy in conducting stream fine-grained behavior and complex selection of stream
compression. compression algorithms and the workload’s impact on
Consideringthefindingsabove,weaccordinglysuggest asymmetricarchitectureutilization.
| a stream | compression | system      |     | for IoT  | analytic  | should      | be     |              |     |     |     |     |     |     |     |
| -------- | ----------- | ----------- | --- | -------- | --------- | ----------- | ------ | ------------ | --- | --- | --- | --- | --- | --- | --- |
| able to  | 1) adapt to | the         | IoT | workload | and       | dynamically |        |              |     |     |     |     |     |     |     |
|          |             |             |     |          |           |             |        | 7 CONCLUSION |     |     |     |     |     |     |     |
| choose   | the optimal | compression |     |          | approach; | 2)          | wisely |              |     |     |     |     |     |     |     |
determine the parallelization granularity and use cache- In this paper, we introduced CStream, an innovative
aware agglomeration; and 3) be specially aware to framework tailored for optimizing stream compression on
| the asymmetric | 64-bit | RISC | edge | processor, |     | and | wisely |          |          |         |     |     |           |             |     |
| -------------- | ------ | ---- | ---- | ---------- | --- | --- | ------ | -------- | -------- | ------- | --- | --- | --------- | ----------- | --- |
|                |        |      |      |            |     |     |        | IoT edge | devices. | Through |     | the | strategic | integration | of  |
regulates its frequency and cores on the fly under different various stream compression algorithms and asymmetric
userdemands. multicore processors, CStream capably navigates the
challengesofachievinghighcompressionratios,increasing
|           |      |     |     |     |     |     |     | throughput, | minimizing |     | latency, |     | and reducing |     | energy |
| --------- | ---- | --- | --- | --- | --- | --- | --- | ----------- | ---------- | --- | -------- | --- | ------------ | --- | ------ |
| 6 RELATED | WORK |     |     |     |     |     |     |             |            |     |          |     |              |     |        |
consumption.Ourcomprehensiveevaluationshighlightthe
Existing work in data compression, parallel data exceptional performance of CStream. It delivers a 2.8x
compression, and the use of asymmetric architecture compression ratio with minimal information loss, a 4.3x
at the edge, has laid a strong foundation for our study. increase in throughput, and a substantial reduction in both
However,thefocusoftheseworksdoesnotentirelyaddress latency (65%) and energy consumption (89%) compared
| theuniquechallengesandrequirementsofedgecomputing |     |     |     |     |     |     |     |                |          |     | CStream, |      |     |           |        |
| ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | -------------- | -------- | --- | -------- | ---- | --- | --------- | ------ |
|                                                   |     |     |     |     |     |     |     | to traditional | designs. |     |          | with | its | adaptable | nature |
in the context of IoT. Our work, CStream, harnesses the and co-design strategy, sets a new benchmark in IoT edge
insights of these foundational studies [12], [64], [65], [35], computing. It not only addresses the immediate demands
[66],[67],[15],[68],[69],[13]whileextendingandadapting
|     |     |     |     |     |     |     |     | of stream | compression |     | but also | opens | the | way | for future |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ----------- | --- | -------- | ----- | --- | --- | ---------- |
themtoaddresstheuniqueneedsofstreamcompressionat advancements, proving that a well-integrated software-
| theedge. |     |     |     |     |     |     |     | hardwaredesignapproachcanyieldremarkableresults. |     |     |     |     |     |     |     |
| -------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
ExperimentalStudyofDataCompressionAlgorithms.
| Historically, | data | compression |     | studies | [12], | [64], | [65], |     |     |     |     |     |     |     |     |
| ------------- | ---- | ----------- | --- | ------- | ----- | ----- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
REFERENCES
| [35], [66]  | have investigated       |          | various      | methods      |             | for      | reducing  |                    |            |                                          |                  |            |            |         |              |
| ----------- | ----------------------- | -------- | ------------ | ------------ | ----------- | -------- | --------- | ------------------ | ---------- | ---------------------------------------- | ---------------- | ---------- | ---------- | ------- | ------------ |
| database    | sizes or for            | specific | applications |              | such        | as       | IoT [67], |                    |            |                                          |                  |            |            |         |              |
|             |                         |          |              |              |             |          |           | [1] G. Pekhimenko, |            | C.                                       | Guo, M.          | Jeon,      | P. Huang,  | and     | L. Zhou,     |
|             |                         |          |              |              |             |          |           | “Tersecades:       |            | Efficient                                | data compression |            | in         | stream  | processing,” |
| [15], [68], | [69], [13].             | These    |              | studies      | provide     |          | valuable  |                    |            |                                          |                  |            |            |         |              |
|             |                         |          |              |              |             |          |           | in 2018            | USENIX     | Annual                                   | Technical        | Conference |            | (USENIX | ATC 18).     |
| insights,   | but their effectiveness |          |              | in guiding   | efficient   |          | stream    |                    |            |                                          |                  |            |            |         |              |
|             |                         |          |              |              |             |          |           | Boston,            | MA:        | USENIX                                   | Association,     |            | Jul. 2018, | pp.     | 307–320.     |
| compression | at the                  | edge     | is limited.  |              | The primary |          | reason    |                    |            |                                          |                  |            |            |         |              |
|             |                         |          |              |              |             |          |           | [Online].          | Available: | https://www.usenix.org/conference/atc18/ |                  |            |            |         |              |
| is that     | these works             | do       | not          | specifically |             | consider | the       |                    |            |                                          |                  |            |            |         |              |
presentation/pekhimenko

15
[2] P. R. Geethakumari et al., “Streamzip: Compressed sliding- [27] C.Baskin,N.Liss,E.Schwartz,E.Zheltonozhskii,R.Giryes,A.M.
windowsforstreamaggregation,”inICFPT. IEEE,2021. Bronstein,andA.Mendelson,“Uniq:Uniformnoiseinjectionfor
[3] X. Zeng and S. Zhang, “A hardware-conscious stateful stream non-uniformquantizationofneuralnetworks,”ACMTransactions
compressionframeworkforiotapplications(vision),”2023. onComputerSystems(TOCS),vol.37,no.1-4,pp.1–15,2021.
[4] ——, “Parallelizing stream compression for iot applications on [28] P. Elias, “Universal codeword sets and representations of the
asymmetricmulticores,”in2023IEEE39rdInternationalConference integers,” IEEE Transactions on Information Theory, vol. 21, no. 2,
| onDataEngineering(ICDE),2023. |     |     |     |     |     |     | pp.194–203,1975. |     |     |     |     |     |     |     |
| ----------------------------- | --- | --- | --- | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- |
[5] L.etal.,“Camel:Managingdataforefficientstreamlearning,”in [29] (2021) lz4 source code, https://github.com/lz4/lz4/. Last
| SIGMOD2022,2022. |     |     |     |     |     |     | Accessed:2021-07-25. |     |     |     |     |     |     |     |
| ---------------- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- | --- | --- | --- | --- |
[6] S. Zeuch, A. Chaudhary, B. D. Monte, H. Gavriilidis, [30] J. Wang, C. Lin, Y. Papakonstantinou, and S. Swanson, “An
| D. Giouroukis, |     | P. M. | Grulich, | S.  | Breß, | J. Traub, |              |     |       |           |             |     |              |      |
| -------------- | --- | ----- | -------- | --- | ----- | --------- | ------------ | --- | ----- | --------- | ----------- | --- | ------------ | ---- |
|                |     |       |          |     |       |           | experimental |     | study | of bitmap | compression |     | vs. inverted | list |
and V. Markl, “The nebulastream platform for data Proceedings of the 2017 ACM International
|     |     |     |     |     |     |     | compression,” |     | in  |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- |
and application management in the internet of ConferenceonManagementofData,2017,pp.993–1008.
things,” in CIDR2020,10thConferenceonInnovativeDataSystems [31] Y. Zhou, Z. Vagena, and J. Haustad, “Dissemination of models
Research, Amsterdam, The Netherlands, January 12-15, 2020, Online over time-varying data,” Proceedings of the VLDB Endowment,
| Proceedings. |     | www.cidrdb.org, |     | 2020. [Online]. |     | Available: |     |     |     |     |     |     |     |     |
| ------------ | --- | --------------- | --- | --------------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
vol.4,no.11,pp.864–875,2011.
http://cidrdb.org/cidr2020/papers/p7-zeuch-cidr20.pdf
|                |           |     |            |           |        |           | [32] D. A. | Huffman, | “A  | method | for the | construction | of minimum- |     |
| -------------- | --------- | --- | ---------- | --------- | ------ | --------- | ---------- | -------- | --- | ------ | ------- | ------------ | ----------- | --- |
| [7] M. Bansal, | I. Chana, | and | S. Clarke, | “A survey | on iot | big data: |            |          |     |        |         |              |             |     |
redundancycodes,”ProceedingsoftheIRE,1952.
Currentstatus,13v’schallenges,andfuturedirections,”vol.53,
|     |     |     |     |     |     |     | [33] A.Guptaetal.,“Modernlosslesscompressiontechniques:Review, |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
no.6,2020.[Online].Available:https://doi.org/10.1145/3419634 comparisonandanalysis,”in2017SecondInternationalConference
[8] (2021) Arm solutions for iot, https://www.arm.com/solutions/ on Electrical, Computer and Communication Technologies (ICECCT).
iot.LastAccessed:2021-05-10.
IEEE,2017.
[9] (2021)Rockchipwikirk3399,http://opensource.rock-chips.com/
|     |     |     |     |     |     |     | [34] A. Moffat, | “Huffman |     | coding,” | ACM | Computing | Surveys | (CSUR), |
| --- | --- | --- | --- | --- | --- | --- | --------------- | -------- | --- | -------- | --- | --------- | ------- | ------- |
wiki RK3399.LastAccessed:2021-05-10.
vol.52,no.4,pp.1–35,2019.
[10] (2013)Allwinnersocfamily,https://linux-sunxi.org/Allwinner
|     |     |     |     |     |     |     | [35] J. Wang, | C.  | Lin, Y. | Papakonstantinou, |     | and | S. Swanson, | “An |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------- | ----------------- | --- | --- | ----------- | --- |
SoC Family.LastAccessed:2022-05-10.
|     |     |     |     |     |     |     | experimental |     | study | of bitmap | compression |     | vs. inverted | list |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ----- | --------- | ----------- | --- | ------------ | ---- |
[11] (2021) Intel atom® x5-z8350 processor, https://ark. compression,” in Proceedings of the 2017 ACM International
intel.com/content/www/us/en/ark/products/93361/
ConferenceonManagementofData,2017,pp.993–1008.
intel-atom-x5z8350-processor-2m-cache-up-to-1-92-ghz.html.
|     |     |     |     |     |     |     | [36] G. Pekhimenko, |     | V.  | Seshadri, | O. Mutlu, | M.  | A. Kozuch, | P. B. |
| --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --- | --------- | --------- | --- | ---------- | ----- |
LastAccessed:2022-05-10.
|     |     |     |     |     |     |     | Gibbons, | and | T. C. | Mowry, | “Base-delta-immediate |     | compression: |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | ----- | ------ | --------------------- | --- | ------------ | --- |
[12] D.Abadi,S.Madden,andM.Ferreira,“Integratingcompression
|     |           |                    |     |          |           |     | Practical | data | compression |     | for on-chip | caches,” | in  | 2012 21st |
| --- | --------- | ------------------ | --- | -------- | --------- | --- | --------- | ---- | ----------- | --- | ----------- | -------- | --- | --------- |
| and | execution | in column-oriented |     | database | systems,” |     | in        |      |             |     |             |          |     |           |
Proceedings of the 2006 ACM SIGMOD international conference on International Conference on Parallel Architectures and Compilation
Techniques(PACT),2012,pp.377–388.
Managementofdata,2006,pp.671–682.
|                  |     |         |                |           |      |        | [37] (2021)Upboardseries,https://up-board.org/up/specifications/. |     |     |     |     |     |     |     |
| ---------------- | --- | ------- | -------------- | --------- | ---- | ------ | ----------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
| [13] D. Blalock, | S.  | Madden, | and J. Guttag, | “Sprintz: | Time | series |                                                                   |     |     |     |     |     |     |     |
LastAccessed:2021-05-10.
| compression     | for     | the internet | of things,” | Proceedings |               | of the ACM |              |     |        |        |           |           |          |     |
| --------------- | ------- | ------------ | ----------- | ----------- | ------------- | ---------- | ------------ | --- | ------ | ------ | --------- | --------- | -------- | --- |
|                 |         |              |             |             |               |            | [38] Y. Dua, | V.  | Kumar, | and R. | S. Singh, | “Parallel | lossless | hsi |
| on Interactive, | Mobile, | Wearable     | and         | Ubiquitous  | Technologies, | vol.       | 2,           |     |        |        |           |           |          |     |
compressionbasedonrlsfilter,”JournalofParallelandDistributed
no.3,pp.1–23,2018.
[14] (2017) zlib home page, http://www.zlib.net/. Last Accessed: Computing,vol.150,pp.60–68,2021.
2021-06-29. [39] V.Pankratius,A.Jannesari,andW.F.Tichy,“Parallelizingbzip2:
|     |     |     |     |     |     |     | A case | study | in multicore | software |     | engineering,” | IEEE | software, |
| --- | --- | --- | --- | --- | --- | --- | ------ | ----- | ------------ | -------- | --- | ------------- | ---- | --------- |
[15] T.Lu,W.Xia,X.Zou,andQ.Xia,“Adaptivelycompressing{IoT}
vol.26,no.6,pp.70–77,2009.
dataontheresource-constrainededge,”in3rdUSENIXWorkshop
|     |     |     |     |     |     |     | [40] S.Mittal,“Asurveyoftechniquesforarchitectingandmanaging |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
onHotTopicsinEdgeComputing(HotEdge20),2020.
|                      |         |          |                                   |     |     |      | asymmetric                       |     | multicore | processors,” |     | ACM | Computing | Surveys |
| -------------------- | ------- | -------- | --------------------------------- | --- | --- | ---- | -------------------------------- | --- | --------- | ------------ | --- | --- | --------- | ------- |
| [16] (2005)          | Mit-bih | database | distribution,http://ecg.mit.edu/. |     |     | Last |                                  |     |           |              |     |     |           |         |
| Accessed:2021-06-29. |         |          |                                   |     |     |      | (CSUR),vol.48,no.3,pp.1–38,2016. |     |           |              |     |     |           |         |
[17] (2019) Creator of the angry birds game, www.rovio.com. Last [41] W. Zhang, Z. He, L. Liu, Z. Jia, Y. Liu, M. Gruteser,
Accessed:2021-05-10. D. Raychaudhuri, and Y. Zhang, “Elf: accelerate high-resolution
|     |     |     |     |     |     |     | mobile | deep | vision | with content-aware |     | parallel | offloading,” | in  |
| --- | --- | --- | --- | --- | --- | --- | ------ | ---- | ------ | ------------------ | --- | -------- | ------------ | --- |
[18] (2018)Shanghaistockexchange,http://english.sse.com.cn/.Last
|     |     |     |     |     |     |     | Proceedings |     | of the 27th | Annual | International |     | Conference | on Mobile |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ----------- | ------ | ------------- | --- | ---------- | --------- |
Accessed:2021-11-12.
ComputingandNetworking,2021,pp.201–214.
| [19] (2021) | Beach | weather |     | stations | -   | automated |     |     |     |     |     |     |     |     |
| ----------- | ----- | ------- | --- | -------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
sensors , https://catalog.data.gov/dataset/ [42] Z.Pan,F.Zhang,Y.Zhou,J.Zhai,X.Shen,O.Mutlu,andX.Du,
beach-weather-stations-automated-sensors/resource/ “Exploring data analytics without decompression on embedded
3b820f68-4dca-4ea7-8141-f37d9237734d. Last Accessed: 2021- gpusystems,”IEEETransactionsonParallelandDistributedSystems,
vol.33,no.7,pp.1553–1568,2021.
11-12.
|             |                |       |           |                            |     |     | [43] (2022) | Dra829j-q1 |     | asymmetric | processor, |     | https://www.ti.com/ |     |
| ----------- | -------------- | ----- | --------- | -------------------------- | --- | --- | ----------- | ---------- | --- | ---------- | ---------- | --- | ------------------- | --- |
| [20] (2021) | Tracetogether, | safer | together, | https://www.tracetogether. |     |     |             |            |     |            |            |     |                     |     |
gov.sg/.LastAccessed:2021-11-07. product/DRA829J-Q1.LastAccessed:2022-05-10.
[21] D. R.-J. G.-J. Rydning et al., “The digitization of the world from [44] S. Yang, R. A. Shafik, G. V. Merrett, E. Stott, J. M. Levine,
edgetocore,”Framingham:InternationalDataCorporation,vol.16, J.Davis, and B.M. Al-Hashimi,“Adaptiveenergyminimization
2018. of embedded heterogeneous systems using regression-based
[22] S.Zhang,J.He,A.C.Zhou,andB.He,“Briskstream:Scalingdata learning,”in201525thinternationalworkshoponpowerandtiming
|     |     |     |     |     |     |     | modeling,optimizationandsimulation(PATMOS). |     |     |     |     |     | IEEE,2015,pp. |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------- | --- | --- | --- | --- | --- | ------------- | --- |
streamprocessingonshared-memorymulticorearchitectures,”in
| Proceedings | of the | 2019 International |     | Conference | on Management |     | of 103–110. |     |     |     |     |     |     |     |
| ----------- | ------ | ------------------ | --- | ---------- | ------------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
Data,2019,pp.705–722. [45] W. Wolff and B. Porter, “Performance optimization on big.little
[23] B.He,M.Lu,K.Yang,R.Fang,N.K.Govindaraju,Q.Luo,andP.V. architectures: A memory-latency aware approach,” in The
Sander, “Relational query coprocessing on graphics processors,” 21st ACM SIGPLAN/SIGBED Conference on Languages, Compilers,
ACMTransactionsonDatabaseSystems(TODS),vol.34,no.4,pp. andToolsforEmbeddedSystems, ser. LCTES ’20. New York, NY,
1–39,2009. USA: Association for Computing Machinery, 2020, p. 51–61.
[24] A. Ukil, S. Bandyopadhyay, and A. Pal, “Iot data compression: [Online].Available:https://doi.org/10.1145/3372799.3394370
Sensor-agnostic approach,” in 2015 data compression conference. [46] H. Ribic and Y. D. Liu, “Energy-efficient work-stealing
IEEE,2015,pp.303–312. language runtimes,” SIGARCH Comput. Archit. News, vol. 42,
[25] (2020) Eclipse iot working group. iot no. 1, p. 513–528, Feb. 2014. [Online]. Available: https:
developer survey 2018. [Online]. Available: //doi.org/10.1145/2654822.2541971
https://https://blogs.eclipse.org/post/benjamin-cab%C3% [47] T. Somu Muthukaruppan, A. Pathania, and T. Mitra, “Price
A9/key-trends-iotdeveloper-survey-2018,2018. theorybasedpowermanagementforheterogeneousmulti-cores,”
[26] (2020) Dalvik executable format in android, https: ser. ASPLOS ’14. New York, NY, USA: Association for
//source.android.com/devices/tech/dalvik/dex-format.html. Computing Machinery, 2014, p. 161–176. [Online]. Available:
LastAccessed:2022-05-29. https://doi.org/10.1145/2541940.2541974

16
[48] S.Yamagiwa,E.Hayakawa,andK.Marumo,“Adaptiveentropy transfer,” in USENIX Workshop on Hot Topics in Edge Computing
coding method for stream-based lossless data compression,” (HotEdge18),2018.
ser. CF ’20. New York, NY, USA: Association for Computing [69] F.Eichinger,P.Efros,S.Karnouskos,andK.Bo¨hm,“Atime-series
Machinery,2020,p.265–268.[Online].Available:https://doi.org/ compressiontechniqueanditsapplicationtothesmartgrid,”The
10.1145/3387902.3394037 VLDBJournal,vol.24,no.2,pp.193–218,2015.
[49] S.Yamagiwa,R.Morita,andK.Marumo,“Bankselectmethodfor [70] M. Milward, J. L. Nunez, and D. Mulvaney, “Design and
reducingsymbolsearchoperationsonstream-basedlosslessdata implementationofalosslessparallelhigh-speeddatacompression
compression,”in2019DataCompressionConference(DCC). IEEE, system,” IEEE Transactions on Parallel and Distributed Systems,
2019,pp.611–611. vol.15,no.6,pp.481–490,2004.
[50] M. Zaharia, M. Chowdhury, M. J. Franklin, S. Shenker, and [71] K. Sano, K. Katahira, and S. Yamamoto, “Segment-parallel
I. Stoica, “Spark: Cluster computing with working sets,” in 2nd predictorforfpga-basedhardwarecompressoranddecompressor
USENIXWorkshoponHotTopicsinCloudComputing(HotCloud10), of floating-point data streams to enhance memory i/o
2010. bandwidth,” in 2010 Data Compression Conference. IEEE, 2010,
[51] (2021) Ina226, https://www.ti.com/product/INA226. Last pp.416–425.
Accessed:2021-11-12. [72] J. Tian, S. Di, C. Zhang, X. Liang, S. Jin, D. Cheng, D. Tao, and
[52] (2021) esp32s2, https://www.espressif.com/en/products/socs/ F.Cappello,“Wavesz:Ahardware-algorithmco-designofefficient
esp32-s2.LastAccessed:2021-11-12. lossy compression for scientific data,” in Proceedings of the 25th
[53] (2016) Intel® 64 and ia-32 architectures software ACM SIGPLAN Symposium on Principles and Practice of Parallel
developer’s manual, https://www.intel.com/content/ Programming,2020,pp.74–88.
dam/www/public/us/en/documents/manuals/ [73] M.Bark,S.Ubik,andP.Kubalik,“Lz4compressionalgorithmon
64-ia-32-architectures-software-developer-vol-3b-part-2-manual. fpga,”in2015IEEEInternationalConferenceonElectronics,Circuits,
pdf.LastAccessed:2021-03-12. andSystems(ICECS). IEEE,2015,pp.179–182.
[54] S. Zhang, Y. Mao, J. He, P. M. Grulich, S. Zeuch, B. He, R. T. [74] J.ZivandA.Lempel,“Auniversalalgorithmforsequentialdata
Ma,andV.Markl,“Parallelizingintra-windowjoinonmulticores: compression,” IEEE Transactions on Information Theory, vol. 23,
An experimental study,” in Proceedings of the 2021 International no.3,pp.337–343,1977.
ConferenceonManagementofData,2021,pp.2089–2101. [75] A.OzsoyandM.Swany,“Culzss:Lzsslosslessdatacompression
on cuda,” in 2011 IEEE International Conference on Cluster
[55] (2021) Rock pi 4 wiki, https://wiki.radxa.com/Rockpi4. Last
Computing. IEEE,2011,pp.403–411.
Accessed:2021-05-10.
[76] A. Yang, H. Mukka, F. Hesaaraki, and M. Burtscher, “Mpc: a
[56] (2021)Gettingstartedwithp2-zero,https://wiki.banana-pi.org/
massively parallel compression algorithm for scientific data,” in
Getting Started with P2-Zero.LastAccessed:2021-05-10.
2015 IEEE International Conference on Cluster Computing. IEEE,
[57] S. Williams, A. Waterman, and D. Patterson, “Roofline: an
2015,pp.381–389.
insightfulvisualperformancemodelformulticorearchitectures,”
[77] Y. Huang, Y. Li, Z. Zhang, and R. W. Liu, “Gpu-accelerated
CommunicationsoftheACM,vol.52,no.4,pp.65–76,2009.
compressionandvisualizationoflarge-scalevesseltrajectoriesin
[58] Y.J.Lo,S.Williams,B.VanStraalen,T.J.Ligocki,M.J.Cordery,
maritime iot industries,” IEEE Internet of Things Journal, vol. 7,
N.J.Wright,M.W.Hall,andL.Oliker,“Rooflinemodeltoolkit:
no.11,pp.10794–10812,2020.
A practical tool for architectural and program analysis,” in
[78] M. Burtscher and P. Ratanaworabhan, “pfpc: A parallel
International Workshop on Performance Modeling, Benchmarking and
compressor for floating-point data,” in 2009 Data Compression
SimulationofHighPerformanceComputerSystems. Springer,2014,
Conference. IEEE,2009,pp.43–52.
pp.129–148.
[79] J.ShunandF.Zhao,“Practicalparallellempel-zivfactorization,”
[59] S.Balakrishnan,R.Rajwar,M.Upton,andK.Lai,“Theimpactof
in2013DataCompressionConference. IEEE,2013,pp.123–132.
performanceasymmetryinemergingmulticorearchitectures,”in
[80] F.Knorr,P.Thoman,andT.Fahringer,“ndzip:Ahigh-throughput
32nd International Symposium on Computer Architecture (ISCA’05).
parallel lossless compressor for scientific data,” in 2021 Data
IEEE,2005,pp.506–517.
CompressionConference(DCC). IEEE,2021,pp.103–112.
[60] M.Pricopi,T.S.Muthukaruppan,V.Venkataramani,T.Mitra,and
[81] T. Ma, M. Hempel, D. Peng, and H. Sharif, “A survey
S. Vishin, “Power-performance modeling on asymmetric multi-
of energy-efficient compression and communication techniques
cores,” in 2013 International Conference on Compilers, Architecture
for multimedia in resource constrained systems,” IEEE
andSynthesisforEmbeddedSystems(CASES). IEEE,2013,pp.1–10.
Communications Surveys & Tutorials, vol. 15, no. 3, pp. 963–972,
[61] T.Yu,R.Zhong,V.Janjic,P.Petoumenos,J.Zhai,H.Leather,and 2012.
J.Thomson,“Collaborativeheterogeneity-awareosschedulerfor
[82] D. Zordan, B. Martinez, I. Vilajosana, and M. Rossi, “On the
asymmetricmulticoreprocessors,”IEEETransactionsonParalleland
performanceoflossycompressionschemesforenergyconstrained
DistributedSystems,vol.32,no.5,pp.1224–1237,2020.
sensornetworking,”ACMTransactionsonSensorNetworks(TOSN),
[62] K.VanCraeynest,A.Jaleel,L.Eeckhout,P.Narvaez,andJ.Emer, vol.11,no.1,pp.1–34,2014.
“Scheduling heterogeneous multi-cores through performance [83] C.J.Deepu,C.-H.Heng,andY.Lian,“Ahybriddatacompression
impact estimation (pie),” in 2012 39th Annual International scheme for power reduction in wireless sensors for iot,” IEEE
SymposiumonComputerArchitecture(ISCA). IEEE,2012,pp.213– transactions on biomedical circuits and systems, vol. 11, no. 2, pp.
224. 245–254,2016.
[63] J.Mukundan,H.Hunter,K.-h.Kim,J.Stuecheli,andJ.F.Mart´ınez, [84] D.-U. Lee, H. Kim, M. Rahimi, D. Estrin, and J. D. Villasenor,
“Understandingandmitigatingrefreshoverheadsinhigh-density “Energy-efficient image compression for resource-constrained
ddr4dramsystems,”ACMSIGARCHComputerArchitectureNews, platforms,” IEEE Transactions on Image Processing, vol. 18, no. 9,
vol.41,no.3,pp.48–59,2013. pp.2100–2113,2009.
[64] M. A. Roth and S. J. Van Horn, “Database compression,” ACM [85] H. Zhang, X. Chen, N. Xiao, and F. Liu, “Architecting
sigmodrecord,vol.22,no.3,pp.31–39,1993. energy-efficient stt-ram based register file on gpgpus via delta
[65] T. Westmann, D. Kossmann, S. Helmer, and G. Moerkotte, “The compression,”inProceedingsofthe53rdAnnualDesignAutomation
implementationandperformanceofcompresseddatabases,”ACM Conference,2016,pp.1–6.
SigmodRecord,vol.29,no.3,pp.55–67,2000. [86] N. Mishra, C. Imes, J. D. Lafferty, and H. Hoffmann, “Caloree:
[66] P. Damme, A. Ungethu¨m, J. Hildebrandt, D. Habich, and Learning control for predictable latency and low energy,” ACM
W. Lehner, “From a comprehensive experimental survey to a SIGPLANNotices,vol.53,no.2,pp.184–198,2018.
cost-basedselectionstrategyforlightweightintegercompression [87] B.Salami,H.Noori,andM.Naghibzadeh,“Fairness-awareenergy
algorithms,”ACMTransactionsonDatabaseSystems(TODS),vol.44, efficient scheduling on heterogeneous multi-core processors,”
no.3,pp.1–46,2019. IEEETransactionsonComputers,vol.70,no.1,pp.72–82,2020.
[67] K.Iqbal,N.Khan,andM.G.Martini,“Performancecomparisonof [88] M.E.Haque,Y.He,S.Elnikety,T.D.Nguyen,R.Bianchini,and
losslesscompressionstrategiesfordynamicvisionsensordata,”in K. S. McKinley, “Exploiting heterogeneity for tail latency and
ICASSP2020-2020IEEEInternationalConferenceonAcoustics,Speech energy efficiency,” in Proceedings of the 50th Annual IEEE/ACM
andSignalProcessing(ICASSP). IEEE,2020,pp.4427–4431. InternationalSymposiumonMicroarchitecture,2017,pp.625–638.
[68] M. Bharde, S. Bhattacharya, D. D. Shree et al., “{Store- [89] M. Wang, S. Ding, T. Cao, Y. Liu, and F. Xu, “Asymo: scalable
Edge}{RippleStream}: Versatile infrastructure for {IoT} data andefficientdeep-learninginferenceonasymmetricmobilecpus,”

17
inProceedingsofthe27thAnnualInternationalConferenceonMobile
ComputingandNetworking,2021,pp.215–228.
| [90] Q. Zeng, | Y. Du,        | K. Huang,   | and           | K. K. Leung,      | “Energy-efficient |             |
| ------------- | ------------- | ----------- | ------------- | ----------------- | ----------------- | ----------- |
| resource      | management    |             | for federated | edge              | learning          | with cpu-   |
| gpu           | heterogeneous | computing,” |               | IEEE Transactions |                   | on Wireless |
Communications,vol.20,no.12,pp.7947–7962,2021.
| [91] Y. Zhu | and V. J.    | Reddi, | “High-performance |           | and | energy-efficient |
| ----------- | ------------ | ------ | ----------------- | --------- | --- | ---------------- |
| mobile      | web browsing | on     | big/little        | systems,” | in  | 2013 IEEE 19th   |
InternationalSymposiumonHighPerformanceComputerArchitecture
| (HPCA). | IEEE,2013,pp.13–24. |     |     |     |     |     |
| ------- | ------------------- | --- | --- | --- | --- | --- |