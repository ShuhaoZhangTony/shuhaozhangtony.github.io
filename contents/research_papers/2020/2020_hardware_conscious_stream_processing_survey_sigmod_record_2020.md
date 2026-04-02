| Hardware-Conscious |     |     |     |     |     | Stream | Processing: |     |     |     | A   | Survey |     |
| ------------------ | --- | --- | --- | --- | --- | ------ | ----------- | --- | --- | --- | --- | ------ | --- |
Shuhao Zhang1, Feng Zhang2, Yingjun Wu3, Bingsheng He1, Paul Johns1
|               |              | 1National  |               | University   |              | of Singapore, | 2Renmin       | University |                       | of           | China,          |                |            |
| ------------- | ------------ | ---------- | ------------- | ------------ | ------------ | ------------- | ------------- | ---------- | --------------------- | ------------ | --------------- | -------------- | ---------- |
|               |              |            |               |              |              | 3Amazon Web   | Services      |            |                       |              |                 |                |            |
| ABSTRACT      |              |            |               |              |              |               | the last      | several    | decades,              | more         | radical         | performance    |            |
|               |              |            |               |              |              |               | demand,       | complex    | analysis,             |              | as              | well as        | intensive  |
| Data          | stream       | processing |               | systems      | (DSPSs)      | enable        |               |            |                       |              |                 |                |            |
|               |              |            |               |              |              |               | state access  |            | in emerging           |              | stream          | applications   | [21,       |
| users to      | express      | and        | run           | stream       | applications | to            |               |            |                       |              |                 |                |            |
|               |              |            |               |              |              |               | 91] pose      | great      | challenges            |              | to              | existing       | DSPSs.     |
| continuously  | process      |            | data streams. |              | To achieve   | real-         |               |            |                       |              |                 |                |            |
|               |              |            |               |              |              |               | Meanwhile,    |            | significant           | achievements |                 |                | have been  |
| time data     | analytics,   |            | recent        | researches   | keep         | focusing      |               |            |                       |              |                 |                |            |
|               |              |            |               |              |              |               | made in       | the        | computer              | architecture |                 |                | community, |
| on optimizing |              | the        | system        | latency      | and          | throughput.   |               |            |                       |              |                 |                |            |
|               |              |            |               |              |              |               | which has     | recently   | led                   | to           | various         | investigations | of         |
| Witnessing    | the          | recent     | great         | achievements |              | in the        |               |            |                       |              |                 |                |            |
|               |              |            |               |              |              |               | the potential |            | of hardware-conscious |              |                 | DSPSs,         | which      |
| computer      | architecture |            | community,    |              | researchers  | and           |               |            |                       |              |                 |                |            |
|               |              |            |               |              |              |               | aim to        | exploit    | the potential         |              | of accelerating |                | stream     |
practitionershaveinvestigatedthepotentialofadoption
|                    |                |          |               |             |               |             | processing   | on        | modern      | hardware |          | [104, 98].    |             |
| ------------------ | -------------- | -------- | ------------- | ----------- | ------------- | ----------- | ------------ | --------- | ----------- | -------- | -------- | ------------- | ----------- |
| hardware-conscious |                |          | stream        | processing  |               | by better   |              |           |             |          |          |               |             |
|                    |                |          |               |             |               |             | Fully        | utilizing | hardware    |          | capacity | is            | notoriously |
| utilizing          | modern         | hardware | capacity      |             | in DSPSs.     | In this     |              |           |             |          |          |               |             |
|                    |                |          |               |             |               |             | challenging. |           | A large     | number   | of       | studies       | have been   |
| paper, we          | conduct        | a        | systematic    | survey      | of            | recent work |              |           |             |          |          |               |             |
|                    |                |          |               |             |               |             | proposed     | in        | recent      | years    | [19, 66, | 57,           | 58, 45, 98, |
| in the field,      | particularly   |          | along         | with        | the following | three       |              |           |             |          |          |               |             |
|                    |                |          |               |             |               |             | 103, 104].   | This      | paper       | hence    | aims     | at            | presenting  |
| directions:        | 1) computation |          | optimization, |             | 2)            | stream I/O  |              |           |             |          |          |               |             |
|                    |                |          |               |             |               |             | a systematic |           | review      | of prior | e↵orts   | on            | hardware-   |
| optimization,      | and            | 3)       | query         | deployment. |               | Finally, we |              |           |             |          |          |               |             |
|                    |                |          |               |             |               |             | conscious    | stream    | processing. |          |          | Particularly, | the         |
adviseonpotentialfutureresearchdirections.
|     |     |     |     |     |     |     | survey | is organized |     | along | with the | following | three |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------------ | --- | ----- | -------- | --------- | ----- |
1 Introduction directions: 1) computation optimization, 2) stream
A large volume of data is generated in real time I/O optimization, and 3) query deployment. We
|          |      |        |         |          |             |            | aim to   | show | what    | has been | achieved    |     | and reveal |
| -------- | ---- | ------ | ------- | -------- | ----------- | ---------- | -------- | ---- | ------- | -------- | ----------- | --- | ---------- |
| or near  | real | time   | and has | grown    | explosively | in         |          |      |         |          |             |     |            |
|          |      |        |         |          |             |            | what has | been | largely |          | overlooked. |     | We hope    |
| the past | few  | years. | For     | example, | IoT         | (Internet- |          |      |         |          |             |     |            |
of-Things) organizes billions of devices around the that this survey will shed light on the hardware-
|               |            |                   |                |             |              |            | conscious    | design   | of future     |           | DSPSs.    |            |      |
| ------------- | ---------- | ----------------- | -------------- | ----------- | ------------ | ---------- | ------------ | -------- | ------------- | --------- | --------- | ---------- | ---- |
| world that    | are        | connected         |                | to the      | Internet.    | IHS        |              |          |               |           |           |            |      |
| Markit        | forecasts  | [3]               | that           | 125 billion | such         | devices    | 2 Background |          |               |           |           |            |      |
| will be       | in service | by                | 2030,          | up          | from 27      | billion in |              |          |               |           |           |            |      |
|               |            |                   |                |             |              |            | In this      | section, | we            | introduce |           | the common | APIs |
| 2018.         | With       | the proliferation |                | of          | such         | high-speed |              |          |               |           |           |            |      |
|               |            |                   |                |             |              |            | and runtime  |          | architectures |           | of modern | DSPSs.     |      |
| data sources, |            | numerous          | data-intensive |             | applications |            |              |          |               |           |           |            |      |
are deployed in real-world use cases exhibiting 2.1 CommonAPIs
latency and throughput requirements, that can not A DSPS needs to provide a set of APIs for
be satisfied by traditional batch processing models. users to express their stream applications. Most
| Despite | the | massive | e↵ort | devoted | to  | big data |        |       |      |          |     |         |           |
| ------- | --- | ------- | ----- | ------- | --- | -------- | ------ | ----- | ---- | -------- | --- | ------- | --------- |
|         |     |         |       |         |     |          | modern | DSPSs | such | as Storm |     | [6] and | Flink [5] |
research, many challenges remain. expressastreamingapplicationasadirectedacyclic
A data stream processing system (DSPS) is a graph (DAG), where nodes in the graph represent
software system which allows users to e ciently operators,andedgesrepresentthedatadependency
run stream applications that continuously analyze betweenoperators. Figure1(a)illustratestheword
data in real time. For example, modern DSPSs [5, count (WC) as an example application containing
6] can achieve very low processing latency in the fiveoperators. Adetaileddescriptionofafewmore
order of milliseconds. Many research e↵orts are stream applications can be found in [103].
devoted to improving the performance of DSPSs Some earlier DSPSs (e.g., Storm [6]) require
from the research community [45, 23, 98, 92] and users to implement each operator manually.
leading enterprises such as SAP [102], IBM [37], Recent e↵orts from Saber [45], Flink [5], Spark-
Google[9]andMicrosoft[19]. Despitethesuccessof Streaming [96], and Trident [55] aim to provide
| 18  |     |     |     |     |     |     | SIGMOD | Record, | December |     | 2019 | (Vol. | 48, No. 4) |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------- | -------- | --- | ---- | ----- | ---------- |

|        |             |        |            |                     |         |         | FlumeJava     | [18]. | Other   | recent | hardware-conscious |       |        |      |
| ------ | ----------- | ------ | ---------- | ------------------- | ------- | ------- | ------------- | ----- | ------- | ------ | ------------------ | ----- | ------ | ---- |
| Spout  |             | Parser | Splitter   | Counter             |         | Sink    |               |       |         |        |                    |       |        |      |
|        |             |        |            |                     |         |         | DSPSs         | adopt | the BSP | model  | including          |       | Saber  | [45] |
|        | “a boy and  |        | “a”, “boy” | (“boy”,1), (“a”,2)  |         |         |               |       |         |        |                    |       |        |      |
|        | a girl”     |        | …          | …                   |         |         | and StreamBox |       | [57].   |        |                    |       |        |      |
|        |             |        |            |                     |         |         | Although      |       | there   | have   | been               | prior | e↵orts | to   |
| Figure | 1: A        | stream | processing |                     | example | of word |               |       |         |        |                    |       |        |      |
comparedi↵erentmodels[82],itisstillinconclusive
count.
|               |      |        |        |             |      |             | that which    | model      |       | is more   | suitable       |        | for utilizing |      |
| ------------- | ---- | ------ | ------ | ----------- | ---- | ----------- | ------------- | ---------- | ----- | --------- | -------------- | ------ | ------------- | ---- |
|               |      |        |        |             |      |             | modern        | hardware   |       | – each    | model          |        | comes         | with |
| declarative   | APIs | (e.g., |        | SQL)        | with | rich built- |               |            |       |           |                |        |               |      |
|               |      |        |        |             |      |             | its own       | advantages |       | and       | disadvantages. |        |               | For  |
| in operations |      | such   | as     | aggregation |      | and join.   |               |            |       |           |                |        |               |      |
|               |      |        |        |             |      |             | example,      | the        | BSP   | model     | naturally      |        | minimizes     |      |
| Subsequently, |      | many   | e↵orts | have        | been | devoted to  |               |            |       |           |                |        |               |      |
|               |      |        |        |             |      |             | communication |            | among | operators |                | inside | the           | same |
improvingtheexecutione ciencyoftheoperations,
|     |     |     |     |     |     |     | DAG, | but its | single | centralized |     | scheduler |     | has |
| --- | --- | --- | --- | --- | --- | --- | ---- | ------- | ------ | ----------- | --- | --------- | --- | --- |
especiallybyutilizingmodernhardware(Section4).
|     |     |     |     |     |     |     | been identified |     | with | scalability |     | limitation |     | [87]. |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ---- | ----------- | --- | ---------- | --- | ----- |
2.2 CommonRuntimeArchitectures Moreover,itsunavoidabledatashu✏ingalsobrings
Modern stream processing systems can be significant communication overhead, as observed
generally categorized based on their processing in recent research [104]. In contrast, CO model
allowsfine-grainedoptimization(i.e.,eachoperator
| models | including | the | Continuous |     | Operator | (CO) |     |     |     |     |     |     |     |     |
| ------ | --------- | --- | ---------- | --- | -------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
model and the Bulk Synchronous Parallel (BSP) can be configured with di↵erent parallelisms
|     |     |     |     |     |     |     | and placements) |     | but | potentially |     | incurs |     | higher |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | ----------- | --- | ------ | --- | ------ |
model [87].
Continuous Operator Model: Under the CO communication costs among operators. Moreover,
model, the execution runtime treats each operator the limitations of both models can potentially be
|           |     |        |     |          |           |      | addressed | with | more | advanced |     | techniques. |     | For |
| --------- | --- | ------ | --- | -------- | --------- | ---- | --------- | ---- | ---- | -------- | --- | ----------- | --- | --- |
| (a vertex | of  | a DAG) | as  | a single | execution | unit |           |      |      |          |     |             |     |     |
(e.g., a Java thread), and multiple operators example, cross operator communication overhead
communicate through message passing (an edge (underbothCOandBSPmodels)canbeovercome
|            |     |              |     |      |          |        | by exploiting |     | tuple | batching |     | [19, | 103], | high |
| ---------- | --- | ------------ | --- | ---- | -------- | ------ | ------------- | --- | ----- | -------- | --- | ---- | ----- | ---- |
| in a DAG). | For | scalability, |     | each | operator | can be |               |     |       |          |     |      |       |      |
executed independently in multiple threads, where bandwidth memory [58, 70], data compression [66],
each thread handles a substream of input events InfiniBand [38] (Section 5), and architecture-aware
|                             |     |     |     |                    |     |     | query deployment |     | [104, | 98] | (Section | 6). |     |     |
| --------------------------- | --- | --- | --- | ------------------ | --- | --- | ---------------- | --- | ----- | --- | -------- | --- | --- | --- |
| withstreampartitioning[43]. |     |     |     | Thisexecutionmodel |     |     |                  |     |       |     |          |     |     |     |
allows users to control the parallelism of each 3 SurveyOutline
| operator   | in a  | fine-grained |      | manner | [103].    | This kind |          |          |              |        |            |          |            |     |
| ---------- | ----- | ------------ | ---- | ------ | --------- | --------- | -------- | -------- | ------------ | ------ | ---------- | -------- | ---------- | --- |
|            |       |              |      |        |           |           | The      | hardware | architecture |        | is         | evolving | fast       | and |
| of design  | was   | adopted      | by   | many   | DSPSs     | such as   |          |          |              |        |            |          |            |     |
|            |       |              |      |        |           |           | provides | a        | much         | higher | processing |          | capability |     |
| Storm [6], | Heron | [49],        | Seep | [17],  | and Flink | [5] due   |          |          |              |        |            |          |            |     |
to its advantage of low processing latency. Other than that traditional DSPSs were originally
|                  |                    |       |          |             |       |            | designed  | for.      | For         | example,   |          | recent   | scale-up  |     |
| ---------------- | ------------------ | ----- | -------- | ----------- | ----- | ---------- | --------- | --------- | ----------- | ---------- | -------- | -------- | --------- | --- |
| recent           | hardware-conscious |       |          | DSPSs       | adopt | the CO     |           |           |             |            |          |          |           |     |
|                  |                    |       |          |             |       |            | servers   | can       | accommodate |            | hundreds |          | of        | CPU |
| model including  |                    | Trill | [19],    | BriskStream |       | [104], and |           |           |             |            |          |          |           |     |
|                  |                    |       |          |             |       |            | cores and | terabytes |             | of         | memory   | [4],     | providing |     |
| TerseCades       | [66].              |       |          |             |       |            |           |           |             |            |          |          |           |     |
|                  |                    |       |          |             |       |            | abundant  | computing |             | resources. |          | Emerging | network   |     |
| Bulk-Synchronous |                    |       | Parallel | Model:      |       | Under the  |           |           |             |            |          |          |           |     |
technologiessuchasRemoteDirectMemoryAccess
| BSP model,       |         | input | stream   | is explicitly |             | grouped  |        |         |       |          |               |        |         |     |
| ---------------- | ------- | ----- | -------- | ------------- | ----------- | -------- | ------ | ------- | ----- | -------- | ------------- | ------ | ------- | --- |
|                  |         |       |          |               |             |          | (RDMA) | and     | 10Gb  | Ethernet | significantly |        | improve |     |
| into micro       | batches |       | by a     | central       | coordinator | and      |        |         |       |          |               |        |         |     |
|                  |         |       |          |               |             |          | system | ingress | rate, | making   |               | I/O no | longer  | a   |
| then distributed |         | to    | multiple |               | workers     | (e.g., a |        |         |       |          |               |        |         |     |
thread/machine). Subsequently, each data item bottleneck in many practical scenarios [57, 21].
|               |       |            |               |          |           |          | However, | prior | studies | [103,      | 98] | have    | shown   | that |
| ------------- | ----- | ---------- | ------------- | -------- | --------- | -------- | -------- | ----- | ------- | ---------- | --- | ------- | ------- | ---- |
| in a micro    | batch | is         | independently |          | processed | by       |          |       |         |            |     |         |         |      |
|               |       |            |               |          |           |          | existing | data  | stream  | processing |     | systems | (DSPSs) |      |
| going through |       | the entire | DAG           | (ideally | by        | the same |          |       |         |            |     |         |         |      |
threadwithoutanycross-operatorcommunication). severely underutilize hardware resources due to the
|          |     |     |     |         |                 |     | unawareness |     | of the | underlying |     | complex | hardware |     |
| -------- | --- | --- | --- | ------- | --------------- | --- | ----------- | --- | ------ | ---------- | --- | ------- | -------- | --- |
| However, | the | DAG | may | contain | synchronization |     |             |     |        |            |     |         |          |     |
architectures.
| barrier, | where | threads |     | have to | exchange | their |     |     |     |     |     |     |     |     |
| -------- | ----- | ------- | --- | ------- | -------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
intermediate results (i.e., data shu✏ing). Taking As summarized in Table 1, we are witnessing
|       |             |     |              |     |       |           | a revolution |     | in the | design | of DSPSs |     | that | exploit |
| ----- | ----------- | --- | ------------ | --- | ----- | --------- | ------------ | --- | ------ | ------ | -------- | --- | ---- | ------- |
| WC as | an example, |     | the Splitter |     | needs | to ensure |              |     |        |        |          |     |      |         |
that the same word is always passed to the same emerging hardware capability, particularly along
thread of the Counter. Hence, a data shu✏ing with the following three dimensions:
operation is required before the Counter. As a 1) Computation Optimization: Contrary to
result,suchsynchronizationbarriersbreaktheDAG conventional DBMSs, there are two key features
into multiple stages under the BSP model, and in DSPSs that are fundamental to many stream
the communication between stages is managed by applications and computationally expensive:
the central coordinator. This kind of design was Windowing operation [35] (e.g., windowing stream
adopted by Spark-streaming [96], Drizzle [87], and join) and Out-of-order handling [12]. The former
| SIGMOD | Record, | December |     | 2019 | (Vol. 48, | No. 4) |     |     |     |     |     |     |     | 19  |
| ------ | ------- | -------- | --- | ---- | --------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |

Table 1: Summary of the surveyed works
Research Key Concerns Key Related Work
Dimensions
Computation Synchronization overhead, work CellJoin [23], FPGAJoin [47, 72], Handshake join [83,
Optimization e ciency 73], PanJoin [65], HELLS-join [42, 41], Aggregation on
GPU[45],AggregationonFPGA[64,24],HammerSlide[84],
StreamBox [57], Parallel Index Join [75]
Stream I/O Time and space e ciency, data Batching [103], Stream with HBM [58, 70], TerseCades [66],
Optimization locality, and memory footprint StreamoverInfiniBand[38],StreamonSSDs[51],andNVM-
aware Storage [68]
Query Operator interference, elastic Orchestrating [48, 22], StreamIt [16], SIMD [36],
Deployment scaling, and power constraint BitStream [8], Streams on Wires [60], HRC [88], RCM [89],
CMGG [63], GStream [106], SABER [45], BriskStream [104]
deals with infinite stream, and the latter handles di↵erencecomparedtotraditionaldatabasesystems
stream imperfection. The support for those lies in their di↵erent problem assumptions,
expensive operations is becoming one of the major and hence in their system architectures (e.g.,
requirements for modern DSPSs and is treated as infinite input stream [90], processing latency
oneofthekeydimensionsindi↵erentiatingmodern constraints [33], and unique cost function of
DSPSs. Prior approaches use multicores [84, 57], streaming operators [102, 44]). To take advantage
heterogeneous architectures (e.g., GPUs and Cell of modern hardware, prior works have exploited
processors) [23, 45], and Field Programmable various hardware characteristics such as cache-
Gate Arrays (FPGAs) [83, 73, 47, 72, 64, 24] for conscious strategies [8], FPGA [60], and GPUs [88,
accelerating those operations. 89, 63, 106]. Recent works have also looked
2) Stream I/O Optimization: Cross-operator into supporting hybrid architectures [45] and
communication [103] is often a major source NUMA [104].
of overhead in stream processing. Recent 4 ComputationOptimization
work has revealed that the overhead due to
In this section, we review the literature on
cross-operator communication is significant, even
accelerating computationally expensive streaming
without the TCP/IP network stack [103, 98].
operations using modern hardware.
Subsequently, research has been conducted on
4.1 WindowingOperation
improving the e ciency of data grouping (i.e.,
output stream shu✏ing among operators) using In stream applications, the processing is mostly
HighBandwidthMemory(HBM)[58], compressing performed in the form of long-running queries
data in transmission with hardware accelerators known as continuous queries [11]. To handle
andapplyingcomputationdirectlyovercompressed potentiallyinfinitedatastreams,continuousqueries
data [66], and leveraging InfiniBand for faster are typically limited to a window that limits the
data flow [38]. Having said that, there are also number of tuples to process at any point in time.
cases where the application needs to temporarily The window can be defined based on the number
store data for future usage [85] (i.e., state of tuples (i.e., count based), function of time (i.e.,
management [15]). Examples include stream time based) or sessions [86]. Window stream joins
processing with large window operation (i.e., andwindowaggregationaretwocommonexpensive
workload footprint larger than memory capacity) windowing operations in data stream processing.
andstatefulstreamprocessingwithhighavailability 4.1.1 WindowJoin
(i.e., application states are kept persistently). To A common operation used in many stream
relieve the disk I/O overhead, recent work has analytical workloads is to join multiple data
investigated how to achieve more e cient state streams. Di↵erentfromtraditionaljoininrelational
management, leveraging SSD [51] and non-volatile databases[32],whichprocessesalargebatchofdata
memory (NVM) [68]. at once, stream join has to produce results on the
3) Query Deployment: At an even higher point fly [39, 77, 31, 26]. By definition, the stream join
of view, researchers have studied launching a whole operatorperformsoverinfinitestreams. Inpractice,
stream application (i.e., a query) into various streams are cut into finite slices/windows [93]. In
hardware architectures. Similar to traditional a two-way stream join, tuples from the left stream
database systems, the goal of query deployment (R) are joined with tuples in the right stream (S)
in DSPS is to minimize operator interference/ when the specified key attribute matches, and the
cross-operator communication, balance hardware timestamp of tuples from both streams falls within
resource utilization, and so on. The major the same window.
20 SIGMOD Record, December 2019 (Vol. 48, No. 4)

Stream S
Core1
Current
window
Core2
Stream R Stream S Stream R
(a) CellJoin (b) HSJoin
...
Stream S
Core1 Core1 Core1
replicate
Core2 Core2 Core2
Stream
Stream R
S,R
(c) LLHSJoin (d) SplitJoin
...
rotubirtsiD
tuple r tuple tuplesub-window r
r r
sub-window s
probe store
Figure 2: HW-conscious stream join algorithms (using two cores as an example).
Algorithm Overview. Kang et al. [39] input streams notionally flow through the stream
described the first streaming join implementations. processing engine in opposite directions. As
For each tuple r of stream R, 1) Scan the window illustrated in Figure 2 (b), the two sliding windows
associated with stream S and look for matching are laid out side by side, and predicate evaluations
tuples;2)Invalidatetheoldtuplesinbothwindows; arecontinuouslyperformedalongwiththewindows
3) Insert r into the window of R. whenever two tuples encounter each other.
HW-Conscious Optimizations. The costly Low-Latency Handshake-Join (i.e., LLHSJoin):
nature of stream join and the stringent response Despite its excellent scalability, the downside of
time requirements of stream applications have HSJoin is that tuples may have to be queued for
created significant interest in accelerating stream long periods of time before the match, resulting
joining. Multicore processors that provide high in high processing latency. In response, Roy et
processing capacity are ideal for executing costly al. [73] propose a low-latency handshake-join (i.e.,
windowed stream operators. However, fully LLHSJoin)algorithm. Thekeyideaisthat,instead
exploiting the potential of a multicore processor of sequentially forwarding each tuple through a
is often challenging due to the complex processor pipeline of processing units, tuples are replicated
microarchitecture, deep cache memory subsystem, and forwarded to all involved processing units (see
and the unconventional programming model in the red dotted lines in Figure 2 (c)) before the join
general. Figure 2 illustrates the four representative computation is carried out by one processing unit
studies on accelerating window stream joins (called a home node).
described as follows.
SplitJoin: The state-of-the-art windowing join
CellJoin: An earlier work from Gedik et al. [23],
implementationcalledSplitJoin[62]parallelizesthe
called CellJoin, attempt to parallelize stream
join process via the CO model. Rather than
join on Cell processor, a heterogeneous multicore
forwarding tuples bidirectionally, as in HSJoin
architecture. CellJoin generally follows Kang’s [39]
or LLHSJoin, SplitJoin broadcasts each newly
three-step algorithm. To utilize multicores, it re-
arrived tuple t (from either S or R) to all
partitionsS,andeachresultingpartitionisassigned
processing units. In order to make sure that
to an individual core. In this way, the matching
each tuple is processed only once, t is retained
stepcanbeperformedinparallelonmultiplecores.
in exactly one processing unit chosen in a round-
A similar idea has been adopted in the work by
robin manner. Although SplitJoin [62] and
Karnagel et al. [42] to utilize the massively parallel
HSJoin [83] can achieve the same concurrency
computing power of GPU.
theoretically without any central coordination, the
Handshake-Join (HSJoin): CellJoin essentially
former achieves a much lower latency due to
turns the join process into a scheduling and
the linear chaining delay of the HSJoin. While
placement process. Subsequently, it is assumed
LLHSJoin [73] reduces the processing latency of
that the window partition and fetch must be
HSJoin [83] by using a fast forwarding mechanism,
performed in global memory. The repartition
itcomplicatestheprocessinglogicandreintroduces
and distributionmechanism essentially reveals that
central coordination to the processing [62].
CellJoin generally follows the BSP model (see
4.1.2 WindowAggregation
Section 2.2). This is later shown to be ine↵ective
when the number of cores is large [83], and a new Another computationally heavy windowing
stream join technique called handshake join (i.e., operationiswindowaggregation,whichsummarizes
HSJoin) was proposed. In contrast to CellJoin, themostrecentinformationinadatastream. There
HSJoin adopts the CO model. Specifically, both are four workload characteristics [86] of stream
SIGMOD Record, December 2019 (Vol. 48, No. 4) 21

aggregation including 1) window type, which conventional: it first sorts elements within the
refers to the logic based on which system derives sliding window and then computes the median.
finite windows from a continuous stream, such Compared to the O(logn) complexity of using
as tumbling, sliding, and session; 2) windowing an order statistics tree as an auxiliary data
measures, which refers to ways to measure structure [34], Mueller’s method has a theoretically
windows, such as time-based, count-based, and any much higher complexity due to the sorting step
other arbitrary advancing measures; 3) aggregate (O(nlogn)). Nevertheless, their key contribution
functions with di↵erent algebraic properties [81] is on how the sorting and computing steps can
such as invertible, associative, commutative, and be e ciently performed on FPGAs. Mueller’s
order-preserving; and 4) stream (dis)order, which implementation[59]focusesone cientlyprocessing
shall be discussed in Section 4.2. one sliding window without discussing how to
Algorithm Overview. The trivial handle subsequent sliding windows. Mueller et al.
implementation is to perform the aggregation hence proposed conducting multiple computations
|             |      |         |     |       |         |       | for | each sliding |     | window | by instantiating |     | multiple |     |
| ----------- | ---- | ------- | --- | ----- | ------- | ----- | --- | ------------ | --- | ------ | ---------------- | --- | -------- | --- |
| calculation | from | scratch | for | every | arrived | data. |     |              |     |        |                  |     |          |     |
The complexity is hence O(n), where n is the aggregation modules concurrently [60].
|        |       |              |     |           |            |     | Recomputing |     |     | from scratch |     | for each |     | sliding |
| ------ | ----- | ------------ | --- | --------- | ---------- | --- | ----------- | --- | --- | ------------ | --- | -------- | --- | ------- |
| window | size. | Intuitively, |     | e ciently | leveraging |     |             |     |     |              |     |          |     |         |
previous calculation results for future calculation is window is costly, even if conducted in parallel [60].
the key to reducing computation complexity, which Hence, a technique called pane [52] was proposed
|          |                    |     |              |     |     |          | and | later | verified | on FPGAs |     | [64] to | address | this |
| -------- | ------------------ | --- | ------------ | --- | --- | -------- | --- | ----- | -------- | -------- | --- | ------- | ------- | ---- |
| is often | called incremental |     | aggregation. |     |     | However, |     |       |          |          |     |         |         |      |
the e↵ectiveness of incremental aggregation issue. Thekeyideaistodivideoverlappingwindows
depends heavily on the aforementioned workload into disjoint panes, compute sub-aggregates over
|                 |     |      |        |          |     |        | each | pane, | and | “roll up” | the partial-aggregates |     |     | to  |
| --------------- | --- | ---- | ------ | -------- | --- | ------ | ---- | ----- | --- | --------- | ---------------------- | --- | --- | --- |
| characteristics |     | such | as the | property |     | of the |      |       |     |           |                        |     |     |     |
aggregation function. For example, when the computefinalresults. Panewaslaterimproved[46]
aggregation function is invertible (e.g., sum), we andcoversmorecases(e.g.,tosupportnon-periodic
|            |        |        |           |     |                 |     | windows | [14]). |     | However, | the | latest | e↵orts | are |
| ---------- | ------ | ------ | --------- | --- | --------------- | --- | ------- | ------ | --- | -------- | --- | ------ | ------ | --- |
| can simply | update | (i.e., | increase) |     | the aggregation |     |         |        |     |          |     |        |        |     |
resultswhenanewtupleisinsertedintothewindow mostly theoretical, and little work has been done
and evict with the time complexity of O(1). For to validate the e↵ectiveness of these techniques on
|                  |     |        |      |           |       |        | modern | hardware, |     | e.g., FPGA |     | and GPUs. |     |     |
| ---------------- | --- | ------ | ---- | --------- | ----- | ------ | ------ | --------- | --- | ---------- | --- | --------- | --- | --- |
| faster answering |     | median | like | function, | which | has to |        |           |     |            |     |           |     |     |
keep all the relevant inputs, instead of performing Saber [45] is a relational stream processing
a sort on the window for each newly inserted system targeting heterogeneous machines equipped
tuple, one can maintain an order statistics tree as withCPUsandGPUs. Toachievehighthroughput,
auxiliary data structure [34], which has O(logn) Saber also adopts incremental aggregation
worst-casecomplexityofitsinsertion, deletion, and computations utilizing the commutative and
rank function. Similarly, the reactive aggregator associative property of some aggregation functions
(RA) [80] with O(logn) average complexity only such as count, sum, and average. Theodorakis
works for aggregation function with the associative et al. [84] recently studied the trade-o↵ between
property. Those algorithms also di↵er from each workload complexity and CPU e cient streaming
other at their capability of handling di↵erent window aggregation. To this end, they proposed
window types, windowing measures, and stream an implementation that is both workload- and
(dis)order [86]. Traub et al. [86] recently proposed CPU-e cient. Gong et al. [27] proposed an
a generalization of the stream slicing technique e cient and scalable accelerator based on FPGAs,
to handle di↵erent workload characteristics for called ShuntFlow, to support arbitrary window
window aggregation. It may be an interesting sizes for both reduce- and index-like sliding
future work to study how the proposed technique window aggregations. The key idea is to partition
can be applied to better utilize modern hardware aggregation with extremely large window sizes into
architectures (e.g., GPUs). sub-aggregations with smaller window sizes that
|              |     |                |     |     |       |     | can | enable | more | e cient | use of | FPGAs. |     |     |
| ------------ | --- | -------------- | --- | --- | ----- | --- | --- | ------ | ---- | ------- | ------ | ------ | --- | --- |
| HW-Conscious |     | Optimizations. |     |     | There | are |     |        |      |         |        |        |     |     |
a number of works on accelerating windowing 4.2 Out-of-OrderHandling
| aggregation | in a | hardware-friendly |     |     | manner. | An  |     |     |     |     |     |     |     |     |
| ----------- | ---- | ----------------- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
out-of-order1
|                  |     |                          |         |          |      |           | In    | a real     | production | environment,       |     |          |             |     |
| ---------------- | --- | ------------------------ | ------- | -------- | ---- | --------- | ----- | ---------- | ---------- | ------------------ | --- | -------- | ----------- | --- |
| early work       | by  | Mueller                  | et      | al.      | [59] | described |       |            |            |                    |     |          |             |     |
|                  |     |                          |         |          |      |           | input | data       | are not    | uncommon.          |     | A stream | operator    |     |
| implementation   |     | for a                    | sliding | windowed |      | median    |       |            |            |                    |     |          |             |     |
|                  |     |                          |         |          |      |           | is    | considered | to         | be order-sensitive |     | if       | it requires |     |
| operatoronFPGAs. |     | Thisisanoperatorcommonly |         |          |      |           |       |            |            |                    |     |          |             |     |
inputeventstobeprocessedinacertainpredefined
| used to, | for instance, |      | eliminate |       | noise | in sensor |        |        |      |          |             |     |     |         |
| -------- | ------------- | ---- | --------- | ----- | ----- | --------- | ------ | ------ | ---- | -------- | ----------- | --- | --- | ------- |
| readings | and in        | data | analysis  | tasks | [71]. | The       | 1Other |        |      |          |             |     |     |         |
|          |               |      |           |       |       |           |        | issues | such | as delay | and missing | can | be  | seen as |
algorithm skeleton adopted by the work is rather special cases of out-of-order.
| 22  |     |     |     |     |     |     | SIGMOD |     | Record, | December | 2019 | (Vol. | 48, | No. 4) |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | ------- | -------- | ---- | ----- | --- | ------ |

order (e.g., chronological order). Handling out-of- Stream R
time-sorted Thread
orderinputdatainanorder-sensitiveoperatoroften
input
turns out to be a performance bottleneck, as there ScaleGate
Stream S is a fundamental conflict between data parallelism
andorder-sensitiveprocessing–theformerseeksto
improve the throughput of an operator by letting
more than one thread operate on di↵erent events
concurrently, possibly out-of-order.
Algorithm Overview. Currently, there are
threegeneraltechniquestobeappliedtogetherwith
the order-sensitive operator to handle out-of-order
data streams. The first utilizes a bu↵er-based data
structure [12] that bu↵ers incoming tuples for a
whilebeforeprocessing. Thekeyideaistokeepthe
data as long as possible (within the latency/bu↵er
size constraint) to avoid out-of-order inputs. The
second technique relies on punctuation [53], which
is a special tuple in the event stream indicating the
end of a substream. Punctuations guarantee that
tuples are processed in monotonically increasing
time sequence across punctuations, but not within
the same punctuation. The third approach is to
use speculative techniques [74]. The main idea is
toprocesstupleswithoutanydelay,andrecompute
the results in the case of order violation. There are
also techniques specifically designed for handling
out-of-order in a certain type of operator such as
window aggregation [86].
HW-Conscious Optimizations. Gulisano et
al. [28] are among the first to handle out-of-order
for high-performance stream join on multi-core
CPUs. The proposed algorithm, called scalejoin
is illustrated in Figure 3 (a). It first merges
all incoming tuples into one stream (through a
datastructurecalledscalegate)andthendistributes
them to processing threads (PTs) to perform join.
The output also needs to be merged and sorted
before exiting the system. The use of the scalegate
makes this work fall into the category of bu↵er-
based approach and have inherent limitation of
higher processing latency. Scalejoin has been
implemented in FPGA [47] and further improved
in another recent work [72]. They both found that
theproposedsystemoutperformsthecorresponding
fully optimized parallel software-based solution
running on a high-end 48-core multiprocessor
platform.
StreamBox [57] handles out-of-order event
processing by the punctuation-based technique on
multicore processors. Figure 3 (b) illustrates the
basic idea of taking the stream join operator as
an example. Relying on a novel data structure
called cascading container to track dependencies
between epochs (a group of tuples delineated
by punctuation), StreamBox is able to maintain
...
time-sorted
1 3 output
ScaleGate
3 2 1
4 2 Thread
skip-list inspired order-
preserving data structure
(a) ScaleJoin containers of
downstream
Stream R operators
5 1 3 5 1 3 ...
4 2
Stream S
4 2 Order is kept between concurrently running containers
(b) StreamBox
Figure 3: Multicore-friendly out-of-order handling.
the processing order among multiple concurrently
executing containers that exploit the parallelism of
modern multicore hardware.
Kuralenok et al. [50] attempt to balance the
conflict between order-sensitive and multicore
parallelism with an optimistic approach falling in
the third approach. The basic idea is to conduct
the joining process without any regulations, but
apologize (i.e., sending amending signals) when the
processing order is violated. They show that the
performance of the proposed approach depends on
how often reorderings are observed during run-
time. Inthecasewheretheinputorderisnaturally
preserved, there is almost no overhead. However,
it leads to extra network tra c and computations
when reorderings are frequent. To apply such an
approachtopracticalusecases,itishencenecessary
topredicttheprobabilityofreordering,whichcould
be an interesting future work.
4.3 Remarks
From the above discussion, it is clear that
the key to accelerating windowing operators are
mainly two folds. On the one hand, we
should minimize the operation complexity. There
are two common approaches: 1) incremental
computation algorithms [45], which maximize
reusing intermediate results, and 2) rely on
e cient auxiliary data structures (e.g., indexing
the contents of sliding window [95]) for reducing
data (and/or instruction) accesses, especially cache
misses. On the other hand, we should maximize
the system concurrency [84]. This requires us
to distribute workloads among multiple cores
and minimize synchronization overhead among
them [57]. Unfortunately, these optimization
techniques are often at odds with each other.
For example, incremental computation algorithm
is complexity e cient but di cult to parallelize
SIGMOD Record, December 2019 (Vol. 48, No. 4) 23

due to inherent control dependencies in the mechanism called “Upfront Partitioning with Late
CPU instruction [84]. Another example is that Merging”, for e cient data grouping. Miao et
maintaining index structures for partial computing al.[58]haveexploitedthepossibilityofaccelerating
results may help to reduce data accesses, but datagroupingusingemerging3Dstackedmemories
it also brings maintenance overhead [54]. More such as high-bandwidth memory (HBM). By
investigation is required to better balance these designing the system in a way that addresses the
conflicting aspects. limited capacity of HBM and HBM’s need for
sequential-accessandhighparallelism,theresulting
5 StreamI/OOptimization
|           |          |        |           |          |            |        | system      | can achieve |          | several   | times | of  | performance |     |
| --------- | -------- | ------ | --------- | -------- | ---------- | ------ | ----------- | ----------- | -------- | --------- | ----- | --- | ----------- | --- |
| In this   | section, |        | we review | the      | literature | on     |             |             |          |           |       |     |             |     |
|           |          |        |           |          |            |        | improvement |             | over the | baseline. |       |     |             |     |
| improving | the      | stream | I/O       | e ciency | using      | modern |             |             |          |           |       |     |             |     |
5.2 StateManagement
hardware.
|     |     |     |     |     |     |     | Emerging |     | stream | applications |     | often | require | the |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | ------ | ------------ | --- | ----- | ------- | --- |
5.1 Cross-operatorCommunication
|                     |               |                |                          |                  |               |             | underlying      | DSPS            |                  | to maintain    |             | large       | application  |          |
| ------------------- | ------------- | -------------- | ------------------------ | ---------------- | ------------- | ----------- | --------------- | --------------- | ---------------- | -------------- | ----------- | ----------- | ------------ | -------- |
| Modern              | DSPSs         |                | [5, 6]                   | are              | able          | to achieve  |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | states          | so as           | to               | support        |             | complex     | real-time    |          |
| very low            | processing    |                | latency                  | in               | the           | order of    |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | analytics       | [85,            | 15].             | Representative |             | example     |              | states   |
| milliseconds.       |               | However,       | excessive                |                  | communication |             |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | required        | during          | stream           |                | processing  | include     |              | graph    |
| among               | operators     | [103]          | is                       | still a          | key           | obstacle in |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | data structures |                 | [105]            | and            | transaction |             | records      | [56].    |
| further             | improving     | the            | performance              |                  | of the        | DSPSs.      |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | The             | storage         |                  | subsystem      |             | has         | undergone    |          |
| Kamburugamuve       |               |                | et al.                   | [38] recently    |               | presented   |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | tremendous      |                 | innovation       |                | in order    |             | to keep      | up       |
| their findings      |               | on integrating |                          | Apache           |               | Heron [49]  |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | with the        | ever-increasing |                  |                | performance |             | demand.      |          |
| with InfiniBand     |               | and            | Intel                    | OmniPath.        |               | The results |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | Wukong+S        | [105]           | is               | a recently     | proposed    |             | distributed  |          |
| show that           | both          | can            | be utilized              |                  | to improve    | the         |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | streaming       | engine          | that             | provides       |             | real-time   | consistent   |          |
| performance         | of            | distributed    |                          | streaming        | applications. |             |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | query over      | streaming       |                  | datasets.      |             | It is built | based        | on       |
| Nevertheless,       |               | many           | optimization             |                  | opportunities |             |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | Wukong          | [76],           | which            | leverages      | RDMA        |             | to optimize  |          |
| remaintobeexplored. |               |                | Forexample,priorwork[38] |                  |               |             |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | throughput      | and             | latency.         |                | Wukong+S    |             | also         | follows  |
| has evaluated       |               | Heron          | on InfiniBand            |                  | with          | channel     |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | its pace        | to              | support          | stream         |             | processing  |              | while    |
| semantics           | but           | not            | remote                   | direct           | memory        | access      |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | maintaining     |                 | low latency      |                | and         | high        | throughput.  |          |
| (RDMA)              | semantics     |                | [67]. The                | latter           | has           | shown to    |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | Non-Volatile    |                 | Memory           | (NVM)          |             | has         | emerged      | as       |
| be very             | e↵ective      | in             | other related            |                  | works         | [76, 97].   |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | a promising     |                 | hardware         |                | and         | brings      | many         | new      |
| Data                | compression   |                | is a widely              | used             | approach      | for         |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | opportunities   |                 | and challenges.  |                | Fernando    |             | et           | al. [68] |
| reducing            | communication |                | overhead.                |                  |               | Pekhimenko  |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | has recently    |                 | explored         |                | e cient     | approaches  |              | to       |
| et al.              | [66] recently |                | examined                 |                  | the potential | of          |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | support         | analytical      |                  | workloads      | on          | NVM,        | where        | an       |
| using               | data          | compression    |                          | in stream        |               | processing. |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | NVM-aware       |                 | storage          | layout         | for         | tables      | is presented |          |
| Interestingly,      |               | they           | found                    | that             | data          | compression |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | based on        | a               | multidimensional |                | clustering  |             | approach     |          |
| does not            | necessarily   |                | lead                     | to a performance |               | gain.       |                 |                 |                  |                |             |             |              |          |
|                     |               |                |                          |                  |               |             | and a           | block-like      | structure        |                | to          | utilize     | the          | entire   |
Instead,improvementcanonlybeachievedthrough
|               |     |             |     |             |     |             | memory  | stack.    | As  | argued   | by  | the | author, | the   |
| ------------- | --- | ----------- | --- | ----------- | --- | ----------- | ------- | --------- | --- | -------- | --- | --- | ------- | ----- |
| a combination |     | of hardware |     | accelerator |     | (i.e., GPUs |         |           |     |          |     |     |         |       |
|               |     |             |     |             |     |             | storage | structure |     | designed | on  | NVM | may     | serve |
in their proposal) and new execution techniques as the foundation for supporting features like
| (i.e., compute |           | directly | over    | compressed |       | data).   |               |              |        |            |     |         |        |        |
| -------------- | --------- | -------- | ------- | ---------- | ----- | -------- | ------------- | ------------ | ------ | ---------- | --- | ------- | ------ | ------ |
|                |           |          |         |            |       |          | transactional |              | stream | processing |     | systems | [29]   | in the |
| As             | mentioned |          | before, | word       | count | requires |               |              |        |            |     |         |        |        |
|                |           |          |         |            |       |          | future.       | Non-Volatile |        | Memory     |     | Express | (NVMe) |        |
the same word to be transmitted to the same -based solid-state devices (SSDs) are expected
| Counter            | operator     | (see        | Section      | 2.1).     | Subsequently, |             |               |               |             |             |             |              |               |          |
| ------------------ | ------------ | ----------- | ------------ | --------- | ------------- | ----------- | ------------- | ------------- | ----------- | ----------- | ----------- | ------------ | ------------- | -------- |
|                    |              |             |              |           |               |             | to deliver    | unprecedented |             |             | performance |              | in            | terms    |
| all DSPSs          | need         |             | to implement |           | data          | grouping    |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | of latency    | and           | peak        | bandwidth.  |             |              | For example,  |          |
| operations         | regardless   |             | of           | their     | processing    | model       |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | the recently  |               | announced   |             | PCIe        | 4.0          | based         | NVMe     |
| (i.e., the         | continuous   |             | operator     |           | model         | or bulk     |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | SSDs [1]      | are           | already     | capable     | of          | achieving    |               | a peak   |
| synchronous        |              | model).     | Data         | grouping  |               | involves    |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | bandwidth     | of            | 4GB/s.      | Lee         | et al.      | [51]         | have recently |          |
| excessive          | memory       | accesses    |              | that rely | on            | hash-based  |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | investigated  | the           | performance |             | limitations |              | of            | current  |
| data structures    |              | [103,       | 96].         | Zeuch     |               | et al. [98] |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | DSPSs         | on managing   |             | application |             | states       | on            | SSDs     |
| analyzed           | the          | design      | space        | of DSPSs  | optimized     | for         |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | and have      | shown         | that        | query-aware |             | optimization |               | can      |
| modern             | multicore    | processors. |              | In        | particular,   | they        |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | significantly |               | improve     | the         | performance |              | of            | stateful |
| show that          | a queue-less |             | execution    |           | engine        | based on    |               |               |             |             |             |              |               |          |
|                    |              |             |              |           |               |             | stream        | processing    | on          | SSDs.       |             |              |               |          |
| query compilation, |              |             | which        | replaces  | communication |             |               |               |             |             |             |              |               |          |
5.3 Remarks
| between | operators |     | with function |     | calls, | is highly |     |     |     |     |     |     |     |     |
| ------- | --------- | --- | ------------- | --- | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
suitable for modern hardware. Since data grouping Hardware-conscious stream I/O optimization is
can not be completely eliminated, they proposed a still in its early days. Most prior work attempts at
| 24  |     |     |     |     |     |     | SIGMOD | Record, |     | December | 2019 | (Vol. | 48, | No. 4) |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------- | --- | -------- | ---- | ----- | --- | ------ |

mitigating the problem through a purely software cache misses when scheduling a streaming pipeline
approach,suchasI/O-awarequerydeployment[94]. on multiple processors, and the upper bound of
The emerging hardware such as Non-Volatile the proposed cache-based partitioning algorithm
Memory (NVM) and InfiniBand with RDMA called seg cache. They also experimentally found
open up new opportunities for further improving that scheduling solely based on the cache e↵ects
stream I/O performance [105]. Meanwhile, the can often be more e↵ective than the conventional
usage of emerging hardware accelerators such as load-balancing (based on computation cost)
| GPUs | further | brings | new | opportunities |     | to trade- | approaches. |     |     |     |     |     |     |
| ---- | ------- | ------ | --- | ------------- | --- | --------- | ----------- | --- | --- | --- | --- | --- | --- |
o↵ computation and communication overhead [66]. Multicore-aware DSPSs. Recently, there has
| However, | a model-guided |           | approach |     | to balance | the   |                    |              |        |     |          |               |     |
| -------- | -------------- | --------- | -------- | --- | ---------- | ----- | ------------------ | ------------ | ------ | --- | -------- | ------------- | --- |
|          |                |           |          |     |            |       | been a             | fast growing | amount | of  | interest | in building   |     |
| trade-o↵ | is still       | generally | missing  | in  | existing   | work. |                    |              |        |     |          |               |     |
|          |                |           |          |     |            |       | multicore-friendly |              | DSPSs. |     | Instead  | of statically |     |
We hence expect more work to be done in this compiling a program as done in StreamIt [48,
| direction | in the | near | future. |     |     |     |          |       |       |         |        |            |     |
| --------- | ------ | ---- | ------- | --- | --- | --- | -------- | ----- | ----- | ------- | ------ | ---------- | --- |
|           |        |      |         |     |     |     | 22, 16], | these | DSPSs | provide | better | elasticity |     |
6 QueryDeployment for application execution. They also allow the
|              |        |                       |       |      |            |          | usage of     | general-purpose |         | programming |        | languages     |       |
| ------------ | ------ | --------------------- | ----- | ---- | ---------- | -------- | ------------ | --------------- | ------- | ----------- | ------ | ------------- | ----- |
| We now       | review | prior                 | works | from | a higher   | level of |              |                 |         |             |        |               |       |
|              |        |                       |       |      |            |          | (e.g., Java, | Scala)          | to      | express     | stream | applications. |       |
| abstraction, |        | the query/application |       |      | dimension. | We       |              |                 |         |             |        |               |       |
|              |        |                       |       |      |            |          | Tang et      | al. [79]        | studied | the         | data   | flow          | graph |
summarizethembasedontheirdeploymenttargets:
|           |       |       |     |        |     |     | to explore   | the | potential          | parallelism |     | in a     | DSPS |
| --------- | ----- | ----- | --- | ------ | --- | --- | ------------ | --- | ------------------ | ----------- | --- | -------- | ---- |
| multicore | CPUs, | GPUs, | and | FPGAs. |     |     |              |     |                    |             |     |          |      |
|           |       |       |     |        |     |     | and proposed |     | an auto-pipelining |             |     | solution | that |
6.1 MulticoreStreamProcessing
|          |     |     |           |     |     |           | can utilize | multicore |        | processors | to            | improve | the |
| -------- | --- | --- | --------- | --- | --- | --------- | ----------- | --------- | ------ | ---------- | ------------- | ------- | --- |
|          |     |     |           |     |     |           | throughput  | of        | stream | processing | applications. |         | For |
| Language |     | and | Compiler. |     |     | Multicore |             |           |        |            |               |         |     |
architectures have become ubiquitous. However, economicreasons,powere ciencyhasbecomemore
programming models and compiler techniques and more important in recent years, especially in
|               |     |           |          |     |       |         | the HPC | domains. | Kanoun |     | et al. [40] | proposed | a   |
| ------------- | --- | --------- | -------- | --- | ----- | ------- | ------- | -------- | ------ | --- | ----------- | -------- | --- |
| for employing |     | multicore | features | are | still | lagging |         |          |        |     |             |          |     |
behind hardware improvements. Kudlur et al. [48] multicore scheme for stream processing that takes
were among the first to develop a compiler power constraints into consideration. Trill [19]
|     |     |     |     |     |     |     | is a single-node |     | query | processor | for | temporal | or  |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ----- | --------- | --- | -------- | --- |
techniquetomapstreamapplicationtoamulticore
processor. By taking the Cell processor as an streaming data. Contrary to most distributed
example, they study how to compile and run a DSPSs(e.g.,Storm,Flink)adoptingthecontinuous
|        |             |     |           |     |       |          | operator | model, | Trill runs | the | whole | query | only on |
| ------ | ----------- | --- | --------- | --- | ----- | -------- | -------- | ------ | ---------- | --- | ----- | ----- | ------- |
| stream | application |     | expressed | in  | their | proposed |          |        |            |     |       |       |         |
language, called StreamIt. The compiler works the thread that feeds data to it. Such an approach
|        |        |     |          |         |              |     | has shown | to  | be especially |     | e↵ective | [98] | when |
| ------ | ------ | --- | -------- | ------- | ------------ | --- | --------- | --- | ------------- | --- | -------- | ---- | ---- |
| in two | steps: | 1)  | operator | fission | optimization |     |           |     |               |     |          |      |      |
(i.e., split one operator into multiple ones) and applications contain no synchronization barriers.
| 2) assignment |     | optimization |     | (i.e., | assign | each |     |     |     |     |     |     |     |
| ------------- | --- | ------------ | --- | ------ | ------ | ---- | --- | --- | --- | --- | --- | --- | --- |
6.2 GPU-EnabledStreamProcessing
| operator   | to  | a core).   | The    | two-step    | mapping | is    |      |     |          |         |     |               |     |
| ---------- | --- | ---------- | ------ | ----------- | ------- | ----- | ---- | --- | -------- | ------- | --- | ------------- | --- |
|            |     |            |        |             |         |       | GPUs | are | the most | popular |     | heterogeneous |     |
| formulated | as  | an integer | linear | programming |         | (ILP) |      |     |          |         |     |               |     |
problem and requires a commercial ILP solver. processors due to their high computing capacity.
|           |                  |               |        |           |        |            | However, | due     | to their | unconventional |     | execution    |     |
| --------- | ---------------- | ------------- | ------ | --------- | ------ | ---------- | -------- | ------- | -------- | -------------- | --- | ------------ | --- |
| Noting    | its NP-Hardness, |               | Farhad |           | et al. | [22] later |          |         |          |                |     |              |     |
|           |                  |               |        |           |        |            | model,   | special | designs  | are required   |     | to e ciently |     |
| presented | an               | approximation |        | algorithm | to     | solve the  |          |         |          |                |     |              |     |
mapping problem. Note that the mapping problem adapt stream processing to GPUs.
from Kudlur et al. [48] considers only CPU Single-GPU. Verner et al. [88] presented a
loads and ignores communications bandwidth. general algorithm for processing data streams with
In response, Carpenter et al. [16] developed real-time stream scheduling constraints on GPUs.
an algorithm that maps a streaming program This algorithm assigns data streams to CPUs and
onto a heterogeneous target, further taking GPUs based on their incoming rates. It tries to
communication into consideration. To utilize a provide an assignment that can satisfy di↵erent
SIMD-enabledmulticoresystem,Hormatietal.[36] requirements from various data streams. Zhang et
proposed vectorizing stream applications. Relying al. [100] developed a holistic approach to building
on high-level information, such as the relationship DSPSs using GPUs. They design a latency-driven
between operators, they were able to achieve GPU-based framework, which mainly focuses on
better performance than general vectorization real-time stream processing. Due to the limited
techniques. Agrawal et al. [8] proposed a cache memory capacity of GPUs, the window size of
conscious scheduling algorithm for mapping stream the stream operator plays an important role in
application on multicore processors. In particular, systemperformance. Pinneckeetal.[69]studiedthe
they developed the theoretical lower bounds on influenceofwindowsizeandproposedapartitioning
| SIGMOD | Record, | December |     | 2019 (Vol. | 48, | No. 4) |     |     |     |     |     |     | 25  |
| ------ | ------- | -------- | --- | ---------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |

method for splitting large windows into di↵erent processor that can accept new queries without
batches, consideringbothtimeandspacee ciency. disrupting other queries in execution.
| SABER      | [45]      | is a window-based |        |            | hybrid | stream   | 6.4 Remarks |         |     |         |         |               |     |
| ---------- | --------- | ----------------- | ------ | ---------- | ------ | -------- | ----------- | ------- | --- | ------- | ------- | ------------- | --- |
| processing | framework |                   | aiming | to utilize |        | CPUs and |             |         |     |         |         |               |     |
|            |           |                   |        |            |        |          | Existing    | systems |     | usually | involve | heterogeneous |     |
GPUs concurrently.
|            |             |           |              |         |     |             | processors        | along   | with    | CPUs.         | Such        | heterogeneity |       |
| ---------- | ----------- | --------- | ------------ | ------- | --- | ----------- | ----------------- | ------- | ------- | ------------- | ----------- | ------------- | ----- |
| Multi-GPU. |             | Multi-GPU |              | systems |     | provide     |                   |         |         |               |             |               |       |
|            |             |           |              |         |     |             | opens             | up both | new     | opportunities |             | and           | poses |
| tremendous | computation |           | capacity,    |         | but | also pose   |                   |         |         |               |             |               |       |
|            |             |           |              |         |     |             | challenges        | for     | scaling | stream        | processing. | From          | the   |
| challenges | like        | how       | to partition |         | or  | schedule    |                   |         |         |               |             |               |       |
|            |             |           |              |         |     |             | above discussion, |         | it      | is clear      | that both   | GPUs          | and   |
| workloads  | among       | GPUs.     | Verner       | et      | al. | [89] extend |                   |         |         |               |             |               |       |
FPGAshavebeensuccessfullyappliedforscalingup
their method [88] to a single node with multiple streamprocessing. FPGAshavelowlatencyandare
| GPUs.          | A scheduler |           | controls | stream       |         | placement |                       |             |            |        |                    |                |     |
| -------------- | ----------- | --------- | -------- | ------------ | ------- | --------- | --------------------- | ----------- | ---------- | ------ | ------------------ | -------------- | --- |
|                |             |           |          |              |         |           | hardwareconfigurable. |             |            | Hence, | theyaresuitablefor |                |     |
| and guarantees |             | that      | the      | requirements |         | among     |                       |             |            |        |                    |                |     |
|                |             |           |          |              |         |           | special               | application | scenarios, |        | such               | as a streaming |     |
| di↵erent       | streams     | can       | be       | met.         | GStream | [106]     | network.              |             |            |        |                    |                |     |
| is the         | first data  | streaming |          | framework    |         | for GPU   |                       |             |            |        |                    |                |     |
7 SystemDesignRequirements
| clusters. | GStream |     | supports | stream |     | processing |     |     |     |     |     |     |     |
| --------- | ------- | --- | -------- | ------ | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
applications in the form of a C++ library; it In 2005, Stonebraker et al. [78] outlines eight
uses MPI to implement the data communication requirements of real-time data stream processing.
betweendi↵erentnodesandusesCUDAtoconduct Since then, tremendous improvements have been
stream operations on GPUs. Alghabi et al. [10] madethankstothegreate↵ortsfrombothindustry
first introduced the concept of stateful stream data and the research community. We now summarize
processing on a node with multiple GPUs. Nguyen how hardware-conscious optimization techniques
et al. [63] considered the scalability with the mitigate the gap between DSPSs and requirements
number of GPUs on a single node, and developed while highlighting the insu ciency.
| a GPU | performance |     | model | for stream |     | workload |      |       |     |          |      |               |     |
| ----- | ----------- | --- | ----- | ---------- | --- | -------- | ---- | ----- | --- | -------- | ---- | ------------- | --- |
|       |             |     |       |            |     |          | Most | DSPSs | are | designed | with | the principle |     |
partitioning in multi-GPU platforms with high of “Keep the Data Moving” [78], and hence
scalability. Chen et al. [20] proposed G-Storm, aim to process input data “on-the-fly” without
| which enables |     | Storm | [6] to | utilize | GPUs | and can |         |       |     |           |         |     |         |
| ------------- | --- | ----- | ------ | ------- | ---- | ------- | ------- | ----- | --- | --------- | ------- | --- | ------- |
|               |     |       |        |         |      |         | storing | them. | As  | a result, | message |     | passing |
be applied to various applications that Storm has is often a key component in the current
already supported. DSPSs. To mitigate the overhead, researchers
6.3 FPGA-EnabledStreamProcessing have recently attempted to improve the cross-
|     |     |     |     |     |     |     | operator | communication |     |     | e ciency | by  | taking |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------------- | --- | --- | -------- | --- | ------ |
FPGAs are programmable integrated circuits advantage of the latest advancement in network
| whose hardware |     | interconnections |     | can | be  | configured |                |     |       |             |       |          |     |
| -------------- | --- | ---------------- | --- | --- | --- | ---------- | -------------- | --- | ----- | ----------- | ----- | -------- | --- |
|                |     |                  |     |     |     |            | infrastructure |     | [38], | compression | using | hardware |     |
by users. Due to their low latency, high energy accelerator [66], and e cient algorithms by
e ciency, and low hardware engineering cost, exploitingnewhardwarecharacteristics[58]. Going
| FPGAs | have | been explored |     | in various |     | application |          |     |        |      |         |         |     |
| ----- | ---- | ------------- | --- | ---------- | --- | ----------- | -------- | --- | ------ | ---- | ------- | ------- | --- |
|       |      |               |     |            |     |             | forward, | we  | expect | more | work to | be done | for |
scenarios, including stream processing. hardware-conscious stream I/O optimization.
Hagiescu et al. [30] first elaborated challenges Handling out-of-order input streams is relevant
to implementing stream processing on FPGAs to both the Handle Stream Imperfections and
and proposed algorithms that optimize processing Generate Predictable Outcomes [78] requirements.
throughput and latency for FPGAs. Mueller et In real-time stream systems where the input data
al. [60] provided Glacier, which is an FPGA- are not stored, the infrastructure must make
based query engine that can process queries on provision for handling data that arrive late or are
streaming data from networks. The operations in delayed, missing or out-of-sequence. Correctness
Glacier include selection, aggregation, grouping, canbeguaranteedinsomeapplicationsonlyiftime-
andwindows. ExperimentsshowthatusingFPGAs ordered and deterministic processing is maintained
helps achieve much better performance than using throughout the entire processing pipeline. Despite
conventional CPUs. A common limitation of the significant e↵orts, existing DSPSs are still
an FPGA-based system is its expensive synthesis far from ideal for exploiting the potential of
process, which takes a significant time to compile modern hardware. For example, as observed
the application into hardware designs for FPGAs. in a recent work [104], the same DSPS (i.e.,
This makes FPGA-based systems inflexible in StreamBox) delivers much lower throughput on
adapting to query changes. In response, Najafi modern multicore processors as a result of enabling
| et al. [61] | demonstrated |     | Flexible |     | Query | Processor | ordering | guarantees. |     |     |     |     |     |
| ----------- | ------------ | --- | -------- | --- | ----- | --------- | -------- | ----------- | --- | --- | --- | --- | --- |
(FQP),anonlinereconfigurableeventstreamquery The state management in DSPSs is more
| 26  |     |     |     |     |     |     | SIGMOD | Record, | December |     | 2019 (Vol. | 48, | No. 4) |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------- | -------- | --- | ---------- | --- | ------ |

related to the Integrate Stored and Streaming data safety and system availability when adopting
Data [78]requirement. Formanystreamprocessing modern hardware, such as NVM for e cient local
applications, comparing the “present” with the backup and high-speed network for remote backup,
“past” is a common task. Thus, the system must remain an open question.
| provide | careful | management |     | of  | the stored | states. |     |     |     |     |     |     |     |     |
| ------- | ------- | ---------- | --- | --- | ---------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
8 Conclusion
However,weobservethatonlyafewrelatedstudies
|         |            |     |       |            |     |          | In this | paper, |     | we have |     | discussed | relevant |     |
| ------- | ---------- | --- | ----- | ---------- | --- | -------- | ------- | ------ | --- | ------- | --- | --------- | -------- | --- |
| attempt | to improve |     | state | management |     | e ciency |         |        |     |         |     |           |          |     |
leveringmodernhardware[51]. Therearestillmany literature from the field of hardware-conscious
|                |     |       |           |      |        |         | DSPSs,       | which | aim          | to utilize |        | modern | hardware    |     |
| -------------- | --- | ----- | --------- | ---- | ------ | ------- | ------------ | ----- | ------------ | ---------- | ------ | ------ | ----------- | --- |
| open questions |     | to be | resolved, | such | as new | storage |              |       |              |            |        |        |             |     |
|                |     |       |           |      |        |         | capabilities | for   | accelerating |            | stream |        | processing. |     |
formats,indexingtechniquesforemerginghardware
architectures and applications [29, 101]. New Those works have significantly improved DSPSs to
|       |              |     |      |         |       |           | better                | satisfy | the design |                           | requirements |     | raised | by  |
| ----- | ------------ | --- | ---- | ------- | ----- | --------- | --------------------- | ------- | ---------- | ------------------------- | ------------ | --- | ------ | --- |
| media | applications |     | such | as live | audio | streaming |                       |         |            |                           |              |     |        |     |
|       |              |     |      |         |       |           | Stonebrakeretal.[78]. |         |            | Inthefollowing,welistsome |              |     |        |     |
services[91]alsochallengeexistingsystemsinterms
of new processing paradigms. additional advice on future research directions.
|     |           |     |     |       |              |     | Scale-up | and | -out | Stream |     | Processing. |     | As  |
| --- | --------- | --- | --- | ----- | ------------ | --- | -------- | --- | ---- | ------ | --- | ----------- | --- | --- |
| The | Partition |     | and | Scale | Applications |     |          |     |      |        |     |             |     |     |
Automatically [78] requires a DSPS to be able emphasized by Gibbons [25], scaling both out
|                |       |         |      |          |                  |          | and up | is crucial   |     | to e↵ectively |           | improving |        | the  |
| -------------- | ----- | ------- | ---- | -------- | ---------------- | -------- | ------ | ------------ | --- | ------------- | --------- | --------- | ------ | ---- |
| to elastically |       | scale   | up   | and down | in               | order to |        |              |     |               |           |           |        |      |
|                |       |         |      |          |                  |          | system | performance. |     | In situ       | analytics |           | enable | data |
| process        | input | streams | with | varying  | characteristics. |          |        |              |     |               |           |           |        |      |
However, based on our analysis, little work has processingatthepointofdataorigin,thusreducing
|             |         |     |           |                |                  |           | the data | movements      |     | across   | networks; |     | Powerful    |     |
| ----------- | ------- | --- | --------- | -------------- | ---------------- | --------- | -------- | -------------- | --- | -------- | --------- | --- | ----------- | --- |
| considered  | scaling |     | down      | the processing |                  | e ciently |          |                |     |          |           |     |             |     |
|             |         |     |           |                |                  |           | hardware | infrastructure |     | provides |           | an  | opportunity |     |
| (and easily | scaling |     | up later) | in             | a hardware-aware |           |          |                |     |          |           |     |             |     |
manner. A potential direction is adopting a server- to improve processing performance within a single
|     |     |     |     |     |     |     | node. | To this | end, | many | recent |     | works | have |
| --- | --- | --- | --- | --- | --- | --- | ----- | ------- | ---- | ---- | ------ | --- | ----- | ---- |
lesscomputingparadigm[13]withthehelpofnovel
memory techniques such as Non-Volatile Memory exploited the potential of high-performance stream
|        |           |        |          |             |           |           | processing    | on  | a single | node | [45,     | 57, 98]. | However,     |     |
| ------ | --------- | ------ | -------- | ----------- | --------- | --------- | ------------- | --- | -------- | ---- | -------- | -------- | ------------ | --- |
| (NVM)  | into      | DSPSs. | However, |             | questions | such as   |               |     |          |      |          |          |              |     |
|        |           |        |          |             |           |           | the important |     | question | of   | how best | to       | use powerful |     |
| how to | e ciently |        | manage   | the partial |           | computing |               |     |          |      |          |          |              |     |
state in GPUs or FPGAs still remain unclear. local nodes in the context of large distributed
|     |               |     |              |     |      |             | computation | setting |     | still remains |     | unclear. |     |     |
| --- | ------------- | --- | ------------ | --- | ---- | ----------- | ----------- | ------- | --- | ------------- | --- | -------- | --- | --- |
| The | proliferation |     | of high-rate |     | data | sources has |             |         |     |               |     |          |     |     |
accelerated the development of next-generation StreamProcessingProcessor. Withthewide
|                      |         |          |        |         |          |         | adoption | of stream |            | processing |        | today, | it may | be       |
| -------------------- | ------- | -------- | ------ | ------- | -------- | ------- | -------- | --------- | ---------- | ---------- | ------ | ------ | ------ | -------- |
| performance-critical |         |          | DSPSs. | For     | example, | the     |          |           |            |            |        |        |        |          |
|                      |         |          |        |         |          |         | a good   | time      | to revisit | the        | design |        | of a   | specific |
| new 5G               | network | promises |        | blazing | speeds,  | massive |          |           |            |            |        |        |        |          |
throughput capability, and ultra-low latencies [2], processor for DSPSs. GPUs [45] provide much
|               |        |               |     |           |                 |       | higher         | bandwidth | than      | CPUs, |     | but it | comes       | with |
| ------------- | ------ | ------------- | --- | --------- | --------------- | ----- | -------------- | --------- | --------- | ----- | --- | ------ | ----------- | ---- |
| thus bringing |        | the higher    |     | potential | for performance |       |                |           |           |       |     |        |             |      |
|               |        |               |     |           |                 |       | larger latency |           | as tuples | must  | be  | first  | accumulated |      |
| critical      | stream | applications. |     | In        | response,       | high- |                |           |           |       |     |        |             |      |
throughput stream processing is essential to in order to fully utilize thousands of cores on
|             |         |      |         |                 |       |            | GPU; FPGA    |     | [47] has | its         | advantage |     | in providing |     |
| ----------- | ------- | ---- | ------- | --------------- | ----- | ---------- | ------------ | --- | -------- | ----------- | --------- | --- | ------------ | --- |
| keeping     | up with | data | streams | in              | order | to satisfy |              |     |          |             |           |     |              |     |
|             |         |      |         |                 |       |            | low latency, | low | power    | consumption |           |     | computation  |     |
| the Process |         | and  | Respond | Instantaneously |       | [78]       |              |     |          |             |           |     |              |     |
requirement. However, achieving high-throughput but its throughput is still much lower compared to
|           |            |     |                 |     |               |      | GPUs.  | The requirement |          | for | an  | ideal    | processor | for   |
| --------- | ---------- | --- | --------------- | --- | ------------- | ---- | ------ | --------------- | -------- | --- | --- | -------- | --------- | ----- |
| stream    | processing |     | is challenging, |     | especially    | when |        |                 |          |     |     |          |           |       |
|           |            |     |                 |     |               |      | stream | processing      | includes |     | low | latency, | low       | power |
| expensive | windowing  |     | operations      |     | are deployed. | By   |        |                 |          |     |     |          |           |       |
better utilizing modern hardware, researchers and consumption, and high bandwidth. On the other
|               |       |               |     |           |          |            | hand, components |     | like      | complex    |     | control | logic | may     |
| ------------- | ----- | ------------- | --- | --------- | -------- | ---------- | ---------------- | --- | --------- | ---------- | --- | ------- | ----- | ------- |
| practitioners |       | have achieved |     | promising | results. | For        |                  |     |           |            |     |         |       |         |
|               |       |               |     |           |          |            | be sacrificed    |     | as stream | processing |     | logic   | is    | usually |
| example,      | SABER | processes     |     | 79        | million  | tuples per |                  |     |           |            |     |         |       |         |
second with eight CPU cores for Yahoo Streaming predefined and fixed. Further, due to the nature of
|            |               |               |     |         |         |           | continuous         | query | processing, |       | it           | is ideal | to keep | the |
| ---------- | ------------- | ------------- | --- | ------- | ------- | --------- | ------------------ | ----- | ----------- | ----- | ------------ | -------- | ------- | --- |
| Benchmark, |               | outperforming |     | other   | DSPSs   | several   |                    |       |             |       |              |          |         |     |
|            |               |               |     |         |         |           | entire instruction |       | set         | close | to processor |          | [103].  |     |
| times [7]. | Nevertheless, |               |     | current | results | also show |                    |       |             |       |              |          |         |     |
that there is still room for improvement on a Acknowledgments. The authors would like to
singlenode, andthisconstitutesanopportunityfor thank the anonymous reviewer and the associate editor,
designing the next-generation DSPSs [99]. Pınar T¨ozu¨n, for their insightful comments on improving
|     |              |     |           |       |     |           | this manuscript. |     | This | work is | supported | by  | a MoE | Tier 1 |
| --- | ------------ | --- | --------- | ----- | --- | --------- | ---------------- | --- | ---- | ------- | --------- | --- | ----- | ------ |
| Two | requirements |     | including | Query |     | using SQL |                  |     |      |         |           |     |       |        |
on Streams and Guarantee Data Safety and grant(T1251RES1824)andaMoETier2grant(MOE2017-
Availability are overlooked by most existing T2-1-122) in Singapore. Feng Zhang’s work was partially
|              |     |              |     |            |     |           | supported | by the | National | Natural |     | Science | Foundation | of  |
| ------------ | --- | ------------ | --- | ---------- | --- | --------- | --------- | ------ | -------- | ------- | --- | ------- | ---------- | --- |
| HW-conscious |     | optimization |     | techniques |     | in DSPSs. |           |        |          |         |     |         |            |     |
In particular, how to design HW-aware SQL China(GrantNo. 61802412,61732014).
9 References
| statements | for     | DSPSs,   | and | how  | best to   | guarantee |     |     |     |     |     |     |     |     |
| ---------- | ------- | -------- | --- | ---- | --------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
| SIGMOD     | Record, | December |     | 2019 | (Vol. 48, | No. 4)    |     |     |     |     |     |     |     | 27  |

|     |     |     | InProc. VLDB                  | Endow.,2003. |              |     |
| --- | --- | --- | ----------------------------- | ------------ | ------------ | --- |
|     |     |     | [27] S.Gongandetal.Shuntflow: |              | Ane cientand |     |
[1] Corsairforceseriesnvmessd. scalabledataflowacceleratorarchitecturefor
https://hothardware.com/news/corsair-mp600. streamingapplications.InADAC,2019.
|     |     |     | [28] V.Gulisanoandetal.Scalejoin: |     | Adeterministic, |     |
| --- | --- | --- | --------------------------------- | --- | --------------- | --- |
[2] Ericssonmobilityreportnovember2018,
disjoint-parallelandskew-resilientstreamjoin.InBig
https://www.ericsson.com/assets/local/
Data,2015.
mobility-report/documents/2018/
ericsson-mobility-report-november-2018.pdf. [29] P.G¨otzeandetal.Queryplanningfortransactional
[3] Numberofconnectediotdeviceswillsurgeto125 streamprocessingonheterogeneoushardware:
billionby2030,ihsmarkitsays.https://en.ctimes. Opportunitiesandlimitations.InBTW 2019,2019.
|     |     |     | [30] A.Hagiescuandetal.Acomputingorigami: |     | folding |     |
| --- | --- | --- | ----------------------------------------- | --- | ------- | --- |
com.tw/DispNews.asp?O=HK1APAPZ546SAA00N9.
streamsinFPGAs.InDAC,2009.
[4] Sgiuv300,https://www.earlham.ac.uk/sgi-uv300,
[31] M.A.Hammadandetal.Streamwindowjoin:
2015.
[5] Apacheflink,https://flink.apache.org/,2018. trackingmovingobjectsinsensor-networkdatabases.
| [6] Apachestorm,http://storm.apache.org/,2018. |     |     | InSSDM,2003. |     |     |     |
| ---------------------------------------------- | --- | --- | ------------ | --- | --- | --- |
[32] J.Heandetal.Revisitingco-processingforhash
[7] Doweneeddistributedstreamprocessing?
joinsonthecoupledcpu-gpuarchitecture.Proc.
https://lsds.doc.ic.ac.uk/blog/
|     |     |     | VLDB Endow.,2013. |     |     |     |
| --- | --- | --- | ----------------- | --- | --- | --- |
do-we-need-distributed-stream-processing,2019.
[8] K.Agrawalandetal.Cache-consciousschedulingof [33] T.Heinzeandetal.Latency-awareElasticScalingfor
streamingapplications.InSPAA,2012. DistributedDataStreamProcessingSystems.TPDS,
2014.
| [9] T.Akidauandetal.Millwheel: |     | Fault-tolerantstream |     |     |     |     |
| ------------------------------ | --- | -------------------- | --- | --- | --- | --- |
[34] M.Hirzelandetal.Spreadsheetsforstream
| processingatinternetscale.Proc. |     | VLDB Endow., |     |     |     |     |
| ------------------------------- | --- | ------------ | --- | --- | --- | --- |
processingwithunboundedwindowsandpartitions.
2013.
| [10] F.Alghabiandetal.Ascalablesoftwareframework |     |     | InDEBS,2016. |     |     |     |
| ------------------------------------------------ | --- | --- | ------------ | --- | --- | --- |
forstatefulstreamdataprocessingonmultiplegpus [35] M.Hirzelandetal.Sliding-windowaggregation
andapplications.InGPU Computing and algorithms: Tutorial.InDEBS,2017.
|     |     |     | [36] A.H.Hormatiandetal.Macross: |     | Macro-simdization |     |
| --- | --- | --- | -------------------------------- | --- | ----------------- | --- |
Applications.2015.
ofstreamingapplications.InASPLOS,2010.
[11] A.Arasuandetal.Thecqlcontinuousquery
[37] N.Jainandetal.Design,implementation,and
| language: | Semanticfoundationsandqueryexecution. |     |     |     |     |     |
| --------- | ------------------------------------- | --- | --- | --- | --- | --- |
The VLDB Journal,2006. evaluationofthelinearroadbenchmarkonthe
[12] S.Babuandetal.Exploitingk-constraintstoreduce streamprocessingcore.InSIGMOD,2006.
[38] S.Kamburugamuveandetal.Lowlatencystream
memoryoverheadincontinuousqueriesoverdata
|             |                 |             | processing: | Apacheheronwithinfiniband&intel |     |     |
| ----------- | --------------- | ----------- | ----------- | ------------------------------- | --- | --- |
| streams.ACM | Trans. Database | Syst.,2004. |             |                                 |     |     |
omni-path.InUCC,2017.
[13] I.Baldiniandetal.Serverlesscomputing: Current
trendsandopenproblems.Research Advances in [39] J.Kangandetal.Evaluatingwindowjoinsover
| Cloud Computing,2017. |     |     | unboundedstreams.InICDE,2003. |     |     |     |
| --------------------- | --- | --- | ----------------------------- | --- | --- | --- |
[14] P.Carboneandetal.Cutty: Aggregatesharingfor [40] K.Kanounandetal.Lowpowerandscalable
many-corearchitectureforbig-datastream
user-definedwindows.InCIKM,2016.
computing.InVLSI,2014.
[15] P.Carboneandetal.Statemanagementinapache
|                                            |     |     | [41] T.Karnagelandetal.Thehells-join: |     | A   |     |
| ------------------------------------------ | --- | --- | ------------------------------------- | --- | --- | --- |
| flink: Consistentstatefuldistributedstream |     |     |                                       |     |     |     |
processing.Proc. VLDB Endow.,2017. heterogeneousstreamjoinforextremelylarge
[16] P.M.Carpenter,A.Ramirez,andE.Ayguade. windows.InDaMoN,2013.
[42] T.Karnagelandetal.Streamjoinprocessingon
Mappingstreamprogramsontoheterogeneous
|     |     |     | heterogeneousprocessors.InBTW |     | Workshops,2013. |     |
| --- | --- | --- | ----------------------------- | --- | --------------- | --- |
multiprocessorsystems.InCASES,2009.
[43] N.R.Katsipoulakis,A.Labrinidis,andP.K.
[17] R.CastroFernandezandetal.IntegratingScaleout
andFaultToleranceinStreamProcessingUsing Chrysanthis.Aholisticviewofstreampartitioning
OperatorStateManagement.InSIGMOD,2013. costs.Proc. VLDB Endow.,2017.
[18] C.Chambersandetal.Flumejava: Easy,e cient [44] I.KolchinskyandA.Schuster.Joinquery
optimizationtechniquesforcomplexeventprocessing
data-parallelpipelines.InPLDI,2010.
|                                   |     |                   | applications.Proc.             | VLDB Endow.,2018. |                    |     |
| --------------------------------- | --- | ----------------- | ------------------------------ | ----------------- | ------------------ | --- |
| [19] B.Chandramouliandetal.Trill: |     | Ahigh-performance |                                |                   |                    |     |
|                                   |     |                   | [45] A.Koliousisandetal.Saber: |                   | Window-basedhybrid |     |
incrementalqueryprocessorfordiverseanalytics.
Proc.VLDBEndow.,Aug.2015. streamprocessingforheterogeneousarchitectures.In
| [20] Z.Chenandetal.G-Storm: |     | GPU-enabled | SIGMOD,2016. |     |     |     |
| --------------------------- | --- | ----------- | ------------ | --- | --- | --- |
[46] S.Krishnamurthyandetal.On-the-flysharingfor
high-throughputonlinedataprocessinginStorm.In
streamedaggregation.InSIGMOD,2006.
Big Data,2015.
[47] C.Kritikakisandetal.Anfpga-based
[21] J.A.Colmenaresandetal.Ingestion,indexingand
retrievalofhigh-velocitymultidimensionalsensor high-throughputstreamjoinarchitecture.InFPL,
| dataonasinglenode.volumeabs/1707.00825,2017. |     |     | Aug.2016. |     |     |     |
| -------------------------------------------- | --- | --- | --------- | --- | --- | --- |
[48] M.KudlurandS.Mahlke.Orchestratingthe
[22] S.M.Farhadandetal.Orchestrationby
executionofstreamprogramsonmulticoreplatforms.
| approximation: | Mappingstreamprogramsonto |     |                    |     |     |     |
| -------------- | ------------------------- | --- | ------------------ | --- | --- | --- |
|                |                           |     | SIGPLAN Not.,2008. |     |     |     |
multicorearchitectures.InASPLOS,2011.
[23] B.Gedikandetal.Celljoin: Aparallelstreamjoin [49] S.Kulkarniandetal.Twitterheron: Stream
operatorforthecellprocessor.The VLDB Journal, processingatscale.InSIGMOD,2015.
| 2009. |     |     | [50] I.E.Kuralenokandetal.Anoptimisticapproachto |     |     |     |
| ----- | --- | --- | ------------------------------------------------ | --- | --- | --- |
handleout-of-ordereventswithinanalyticalstream
[24] P.R.Geethakumariandetal.Singlewindowstream
|     |     |     | processing.InCEUR | Workshop,2018. |     |     |
| --- | --- | --- | ----------------- | -------------- | --- | --- |
aggregationusingreconfigurablehardware.In
[51] G.Leeandetal.High-performancestatefulstream
ICFPT,2017.
[25] P.B.Gibbons.Bigdata: Scaledown,scaleup,scale processingonsolid-statedrives.InAPSys,2018.
out.InIPDPS,2015. [52] J.Liandeta.Nopane,nogain: E cientevaluation
ofsliding-windowaggregatesoverdatastreams.
[26] L.GolabandM.T.O¨zsu.Processingslidingwindow
|     |     |     | SIGMOD Rec.,2005. |     |     |     |
| --- | --- | --- | ----------------- | --- | --- | --- |
multi-joinsincontinuousqueriesoverdatastreams.
| 28  |     |     | SIGMOD Record, | December 2019 | (Vol. 48, | No. 4) |
| --- | --- | --- | -------------- | ------------- | --------- | ------ |

[53] J.Liandetal.Out-of-orderprocessing: Anew Aggregation Algorithms.SpringerInternational
| architectureforhigh-performancestreamsystems. |     |     |     | Publishing,2018. |     |
| --------------------------------------------- | --- | --- | --- | ---------------- | --- |
Proc. VLDB Endow.,2008. [82] W.B.TeeuwandH.M.Blanken.Controlversusdata
[54] Q.Linandetal.Scalabledistributedstreamjoin flowinparalleldatabasemachines.TPDS,1993.
processing.InSIGMOD,2015. [83] J.TeubnerandR.Mueller.Howsoccerplayerswould
[55] N.Marz.TridentAPIOverview.github.com/ dostreamjoins.InSIGMOD,2011.
nathanmarz/storm/wiki/Trident-APIOverview. [84] G.Theodorakisandetal.Hammerslide: work-and
[56] J.Meehanandetal.S-store: streamingmeets cpu-e cientstreamingwindowaggregation.In
| transactionprocessing.Proc. |     | VLDB Endow.,2015. |     | ADMS,2018. |     |
| --------------------------- | --- | ----------------- | --- | ---------- | --- |
[57] H.Miaoandetal.Streambox: Modernstream [85] Q.-C.Toandetal.Asurveyofstatemanagementin
processingonamulticoremachine.InUSENIX ATC, bigdataprocessingsystems.The VLDB Journal,
| 2017. |     |     |     | 2018. |     |
| ----- | --- | --- | --- | ----- | --- |
[58] H.Miaoandetal.Streambox-hbm: Streamanalytics [86] J.Traubandetal.E cientwindowaggregationwith
onhighbandwidthhybridmemory.arXiv preprint generalstreamslicing.InEDBT,pages97–108,2019.
arXiv:1901.01328,2019. [87] S.Venkataramanandetal.Drizzle: Fastand
[59] R.Muellerandetal.Dataprocessingonfpgas.Proc. adaptablestreamprocessingatscale.InSOSP,2017.
VLDB Endow.,2009. [88] U.Vernerandetal.Processingdatastreamswith
[60] R.Muellerandetal.Streamsonwires: aquery hardreal-timeconstraintsonheterogeneoussystems.
| compilerforFPGAs.Proc. |     | VLDB Endow.,2009. |     | InICS,2011. |     |
| ---------------------- | --- | ----------------- | --- | ----------- | --- |
[61] M.Najafiandetal.Flexiblequeryprocessoron [89] U.Vernerandetal.Schedulingprocessingof
FPGAs.Proc. VLDB Endow.,2013. real-timedatastreamsonheterogeneousmulti-gpu
[62] M.Najafiandetal.Splitjoin: Ascalable,low-latency systems.InSYSTOR,2012.
streamjoinarchitecturewithadjustableordering [90] S.D.ViglasandJ.F.Naughton.Rate-basedquery
precision.InUSENIX ATC,2016. optimizationforstreaminginformationsources.In
| [63] D.NguyenandJ.Lee.Communication-aware |     |     |     | SIGMOD,2002. |     |
| ----------------------------------------- | --- | --- | --- | ------------ | --- |
mappingofstreamgraphsformulti-gpuplatforms.In [91] Z.Wenandetal.Rtsi: Anindexstructurefor
| CGO,2016. |     |     |     | multi-modalreal-timesearchonliveaudiostreaming |     |
| --------- | --- | --- | --- | ---------------------------------------------- | --- |
[64] Y.Oge,M.Yoshimi,andetal.Ane cientand services.InICDE,2018.
scalableimplementationofsliding-windowaggregate [92] Y.WuandK.Tan.Chronostream: Elasticstateful
operatoronfpga.InCANDAR,2013. streamcomputationinthecloud.InICDE,Apr.2015.
[65] F.PanandH.Jacobsen.Panjoin: Apartition-based [93] J.XieandJ.Yang.Asurveyofjoinprocessingin
adaptivestreamjoin.CoRR,abs/1811.05065,2018. datastreams.Data Streams: Models and Algorithms,
| [66] G.Pekhimenkoandetal.Tersecades: |     | E cientdata |     | 2007. |     |
| ------------------------------------ | --- | ----------- | --- | ----- | --- |
compressioninstreamprocessing.InUSENIX ATC, [94] J.Xuandetal.T-storm: Tra c-awareonline
| 2018. |     |     |     | schedulinginstorm.InICDCS,2014. |     |
| ----- | --- | --- | --- | ------------------------------- | --- |
[67] G.F.Pfister.Anintroductiontotheinfiniband [95] Y.Ya-xinandetal.Anindexednon-equijoin
architecture.High Performance Mass Storage and algorithmbasedonslidingwindowsoverdata
Parallel I/O,42:617–632,2001. streams.Wuhan University Journal of Natural
| [68] G.Philippandetal.Annvm-awarestoragelayoutfor |     |     |     | Sciences,2006. |     |
| ------------------------------------------------- | --- | --- | --- | -------------- | --- |
analyticalworkloads.InICDEW,2018. [96] M.Zahariaandetal.Discretizedstreams:
[69] M.Pinneckeandetal.TowardGPUAccelerated Fault-tolerantstreamingcomputationatscale.In
| DataStreamProcessing.InGvD,2015. |     |     |     | SOSP,2013. |     |
| -------------------------------- | --- | --- | --- | ---------- | --- |
[70] C.Pohl.Streamprocessingonhigh-bandwidth [97] E.Zamanianandetal.Theendofamyth:
memory.InGrundlagen von Datenbanken,2018. Distributedtransactionscanscale.Proc. VLDB
| [71] L.Rabinerandetal.Applicationsofanonlinear |     |     |     | Endow.,2017. |     |
| ---------------------------------------------- | --- | --- | --- | ------------ | --- |
smoothingalgorithmtospeechprocessing.TASSP, [98] S.Zeuchandetal.Analyzinge cientstream
| 1975.                                            |     |     |     | processingonmodernhardware.Proc. | VLDB |
| ------------------------------------------------ | --- | --- | --- | -------------------------------- | ---- |
| [72] C.Rousopoulosandetal.Agenerichighthroughput |     |     |     | Endow.,2019.                     |      |
architectureforstreamprocessing.InFPL,2017. [99] S.Zeuchandetal.l.Thenebulastreamplatform:
[73] P.Royandetal.Low-latencyhandshakejoin.Proc. Dataandapplicationmanagementfortheinternetof
| VLDB Endow.,May2014. |     |     |     | things.InCIDR,2020. |     |
| -------------------- | --- | --- | --- | ------------------- | --- |
[74] E.Ryvkinaandetal.Revisionprocessinginastream [100] K.Zhangandetal.Aholisticapproachtobuild
processingengine: Ahigh-leveldesign.InICDE, real-timestreamprocessingsystemwithgpu.JPDC,
| 2006. |     |     |     | 2015. |     |
| ----- | --- | --- | --- | ----- | --- |
[75] A.ShahvaraniandH.-A.Jacobsen.Parallel [101] S.Zhangandetal.Towardsconcurrentstateful
index-basedstreamjoinonamulticorecpu. streamprocessingonmulticoreprocessors,
https://arxiv.org/pdf/1903.00452.pdf,2019. https://arxiv.org/abs/1904.03800.
[76] J.Shiandetal.Fastandconcurrentrdfquerieswith [102] S.Zhangandetal.Multi-queryoptimizationfor
rdma-baseddistributedgraphexploration.InOSDI, complexeventprocessinginsapesp.InICDE,2017.
| 2016. |     |     | [103] | S.Zhangandetal.Revisitingthedesignofdata |     |
| ----- | --- | --- | ----- | ---------------------------------------- | --- |
[77] U.SrivastavaandJ.Widom.Memory-limited streamprocessingsystemsonmulti-coreprocessors.
| executionofwindowedstreamjoins.InProc. |     |     | VLDB | InICDE,2017. |     |
| -------------------------------------- | --- | --- | ---- | ------------ | --- |
Endow.,2004. [104] S.Zhangandetal.Briskstream: ScalingDataStream
[78] M.Stonebrakerandetal.The8requirementsof ProcessingonMulticoreArchitectures.InSIGMOD,
| real-timestreamprocessing.SIGMOD |     | Rec.,2005. |     | 2019. |     |
| -------------------------------- | --- | ---------- | --- | ----- | --- |
[79] Y.TangandB.Gedik.Autopipeliningfordata [105] Y.Zhangandetal.Sub-millisecondstatefulstream
streamprocessing.TPDS,2013. queryingoverfast-evolvinglinkeddata.InSOSP,
| [80] K.Tangwongsanandetal.Generalincremental |     |     |     | 2017. |     |
| -------------------------------------------- | --- | --- | --- | ----- | --- |
sliding-windowaggregation.Proc. VLDB Endow., [106] Y.ZhangandF.Mueller.Gstream: A
| 2015. |     |     |     | general-purposedatastreamingframeworkongpu |     |
| ----- | --- | --- | --- | ------------------------------------------ | --- |
[81] K.Tangwongsanandetal.Sliding-Window clusters.InICPP,2011.
| SIGMOD Record, | December | 2019 (Vol. 48, | No. 4) |     | 29  |
| -------------- | -------- | -------------- | ------ | --- | --- |