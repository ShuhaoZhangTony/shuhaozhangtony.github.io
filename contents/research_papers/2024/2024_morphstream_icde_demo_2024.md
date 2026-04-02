2024 IEEE 40th International Conference on Data Engineering (ICDE)
| MorphStream: |     |     |     |     | Scalable |      | Processing |     |     | of  | Transactions |     |     |     |
| ------------ | --- | --- | --- | --- | -------- | ---- | ---------- | --- | --- | --- | ------------ | --- | --- | --- |
|              |     |     |     |     |          | over | Streams    |     |     |     |              |     |     |     |
|              |     |     | ∗   |     |          | ∗    |            | †   |     |     | ‡            |     | §   |     |
Siqi Xiang Zhonghao Yang Jianjun Zhao Yancan Mao Shuhao Zhang
|     | ∗   |     |     |     |     |     |     | †   |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Singapore University of Technology and Design Huazhong University of Science and Technology
|     |     |     | ‡        |        |                      |                           | §                       |         |               |                  |            |     |     |     |
| --- | --- | --- | -------- | ------ | -------------------- | ------------------------- | ----------------------- | ------- | ------------- | ---------------- | ---------- | --- | --- | --- |
|     |     |     | National |        | University           | of Singapore              |                         | Nanyang | Technological |                  | Univeristy |     |     |     |
|     |     |     | {siqi    | xiang, | zhonghao             | yang}@mymail.sutd.edu.sg, |                         |         | curry         | zhao@hust.edu.cn |            |     |     |     |
|     |     |     |          |        | maoyancan@u.nus.edu, |                           | shuhao.zhang@ntu.edu.sg |         |               |                  |            |     |     |     |
43400.4202.64106EDCI/9011.01 :IOD | EEEI 4202© 00.13$/42/2-5171-3053-8-979 | )EDCI( gnireenignE ataD no ecnerefnoC lanoitanretnI ht04 EEEI 4202
Abstract—In the realm of transactional stream processing dependencies among state access operations of a batch
(TSP), the challenge lies in providing a unified execution of state transactions. Then, it maps the workloads with
model that seamlessly integrates transactional and stream- dependencies into a task precedence graph (TPG), where
| oriented            | capabilities. | Existing   |     | TSP engines | (TSPEs) | largely   |     |          |        |       |                    |     |           |        |
| ------------------- | ------------- | ---------- | --- | ----------- | ------- | --------- | --- | -------- | ------ | ----- | ------------------ | --- | --------- | ------ |
|                     |               |            |     |             |         |           |     | vertexes | map to | state | access operations, |     | and edges | map to |
| employ non-adaptive |               | scheduling |     | techniques, | leaving | multicore |     |          |        |       |                    |     |           |        |
parallelismunderutilizedduetointricateworkloaddependencies. fine-grained dependencies among operations. Based on the
We demonstrate MorphStream, a state-of-the-art TSPE built TPG, MorphStream exploits the full potential of hardware
for unprecedented scalability on multicores. MorphStream parallelismbydecomposingtheschedulingstrategyintothree
| distinguishes | itself        | by       | employing | an        | adaptive | scheduling     |     |            |             |             |            |           |               |          |
| ------------- | ------------- | -------- | --------- | --------- | -------- | -------------- | --- | ---------- | ----------- | ----------- | ---------- | --------- | ------------- | -------- |
|               |               |          |           |           |          |                |     | dimensions | of          | scheduling  | decisions: |           | 1) structured | or non-  |
| algorithm,    | explicitly    | designed |           | to unlock | the      | full potential |     |            |             |             |            |           |               |          |
|               |               |          |           |           |          |                |     | structured | exploration | strategies, |            | 2) single | operation     | or group |
| of multicore  | architectures |          | even      | under     | complex  | workload       |     |            |             |             |            |           |               |          |
MorphStream of operations as the unit of scheduling, and 3) lazy or eager
| conditions.      | This              | enables       |             |              | to             | make optimal    |     |                |                      |             |                |                  |             |              |
| ---------------- | ----------------- | ------------- | ----------- | ------------ | -------------- | --------------- | --- | -------------- | -------------------- | ----------- | -------------- | ---------------- | ----------- | ------------ |
|                  |                   |               |             |              |                |                 |     | abort handling |                      | mechanisms. | Subsequently,  |                  | MorphStream |              |
| trade-offs       | in performance    |               | metrics     | under        | varying        | workload        |     |                |                      |             |                |                  |             |              |
| characteristics. | To                | enhance       | user        | engagement,  | the            | demonstration   |     |                |                      |             |                |                  |             |              |
|                  |                   |               |             |              |                |                 |     | can adaptively |                      | switch      | to a different | scheduling       |             | strategy by  |
| will showcase    |                   | MorphStream’s |             | graphical    |                | user interface, |     |                |                      |             |                |                  |             |              |
|                  |                   |               |             |              |                |                 |     | making         | suitable             | scheduling  | decisions      |                  | in each     | dimension,   |
| specifically     | engineered        |               | to simplify | the          | implementation |                 | and |                |                      |             |                |                  |             |              |
|                  |                   |               |             |              |                |                 |     | guided         | by a heuristic-based |             | decision       | model            | that        | analyzes the |
| deployment       | of complex        | streaming     |             | applications |                | while providing |     |                |                      |             |                |                  |             |              |
|                  |                   |               |             |              |                |                 |     | trade-offs     | under                | varying     | workload       | characteristics. |             |              |
| detailed         | and comprehensive |               | performance |              | monitoring     |                 | and |                |                      |             |                |                  |             |              |
MorphStream
analytics for the job execution runtime. Our demo will showcase how can
|     |     |     |     |     |     |     |     | effectively | support | novel | stream | applications |     | involving the |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ------- | ----- | ------ | ------------ | --- | ------------- |
I. INTRODUCTION
|     |     |     |     |     |     |     |     | processing | of  | transactions | over | streams. | In particular, | we  |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------------ | ---- | -------- | -------------- | --- |
Transactional stream processing (TSP) can be broadly coverthreenovelaspectsofMorphStream:1)Programming
MorphStream,
defined as processing streaming data with correctness APIs: With users can easily express a wide
guarantees,includingthoseintrinsictostreamprocessing(such range of novel stream applications that require correctness
as time order and exactly-once semantics), as well as the guarantees of stream processing (such as time order and
ACID guarantees found in traditional databases [1]. TSP exactly-once semantics), as well as ACID guarantees; 2)
MorphStream
has gained popularity in recent years due to its ability to TPG-based Adaptive Scheduling: is able
support novel applications and system optimizations, with to flexibly morph among scheduling strategies, adapting to
use cases often involving streaming facilities to persist or dynamically changing workload characteristics. Guided by a
offer near-real-time views of shared state, while transactional lightweight decision model, MorphStream can make the
facilitiesensureaconsistentrepresentationofthesharedstate. correct scheduling decision at runtime with minor overheads;
TSP engines (TSPEs) [2], [3], [4], [5] have been proposed, 3)HighPerformance:Comparedtoexistingapproaches,much
but existing TSPEs mostly rely on locks and simple non- of the additional system overhead of MorphStream comes
adaptiveschedulingstrategies,resultinginsignificantoverhead from constructing and exploring the TPG concurrently and
and poor utilization of modern parallel hardware [4]. The correctly, considering that input events may arrive out-of-
scalabilitylimitationofexistingTSPEslimitstheirpracticality. order. To reduce TPG construction and exploration overhead,
Scaling TSPEs is challenging because of the non- MorphStream has a novel highly parallelized system
trivial combination of both transaction and stream-oriented architecture, which ends up with a multi-times performance
properties in TSPEs that lead to complicated workload improvement over the state-of-the-art.
| dependencies. | To  | tackle       | this challenge, |      | we have   | developed   |     |     |     |     |               |     |     |     |
| ------------- | --- | ------------ | --------------- | ---- | --------- | ----------- | --- | --- | --- | --- | ------------- | --- | --- | --- |
|               |     |              |                 |      |           |             |     |     |     | II. | PRELIMINARIES |     |     |     |
| MorphStream   |     | [6], a novel | TSPE            | with | excellent | scalability |     |     |     |     |               |     |     |     |
onmulticores.SimilartootherTSPEs,MorphStreamadopts In analogy to conventional transaction processing, TSP
ACID
transactional semantics during the processing of continuous guarantees properties [7]. In addition, TSP needs
data streams, where accesses to the shared state are modelled to further ensure stream processing properties such that
as state transactions. Different from others, MorphStream dependent state accesses strictly follow their timestamp
identifies the fine-grained temporal, logical, and parametric sequence [7], [8], [2], [4]. We define a state access operation
| 2375-026X/24/$31.00 ©2024 IEEE |     |     |     |     |     |     | 5485 |     |     |     |     |     |     |     |
| ------------------------------ | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
DOI 10.1109/ICDE60146.2024.00434
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:53:05 UTC from IEEE Xplore.  Restrictions apply.

|     |     |     |     |     |     |     |     | with the | ’App | Development’ |     | phase, | users | craft stream |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ---- | ------------ | --- | ------ | ----- | ------------ |
Web GUI
|     |                 |     |                          |     |     |                      |     | applications | using          | user-centric |         | and system-provided |                 | APIs,    |
| --- | --------------- | --- | ------------------------ | --- | --- | -------------------- | --- | ------------ | -------------- | ------------ | ------- | ------------------- | --------------- | -------- |
|     | App development |     | Topology and TPG display |     |     | Execution statistics |     |              |                |              |         |                     |                 |          |
|     |                 |     |                          |     |     |                      |     | modelled     | as Directed    |              | Acyclic | Graphs (DAGs).      | The             | system’s |
|     |                 |     |                          |     |     |                      |     | flexibility  | is highlighted |              | by its  | blend               | of user-defined | and      |
MorphStream System system-endorsed APIs, with atomic state access operations
|     | User | System |        |     |     |     |     |     |     |     |     |     |             |     |
| --- | ---- | ------ | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- |
|     |      |        | Events |     | TPG |     |     |     |     |     |     |     | MorphStream |     |
impl. prov. Adaptive Scheduling Strategy encapsulated by system APIs. Central to
|     | API | API |     |     | O4 O6 |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 Executor op2 is a stateful Task Precedence Graph (S-TPG). This graph,
O 1
J o b op1 Txns O3 D e p e n d e n cy T ra n s a c t io n w i th v ert ic e s re p r e s e n ti n g st a te a c c es s ta sk s a n d e dg e s
|     | Sub m | i ssion |     | op4 |     | r e s o lu | t io n e x e c u ti o n |     |     |     |     |     |     |     |
| --- | ----- | ------- | --- | --- | --- | ---------- | ----------------------- | --- | --- | --- | --- | --- | --- | --- |
O 2 O5 de n otin g d e p end e n c i e s , i s fou n d atio n a l t o M o r ph S t re a m ’s
|     | Programming APIs |     | Construction of S-TPG  |     |     | Scheduling of S-TPG  |     |     |     |     |     |     |     |     |
| --- | ---------------- | --- | ---------------------- | --- | --- | -------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
MorphStream
|     |     |     |     |     |     |     |     | scheduling. | In  | its TPG-based |     | scheduling, |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------------- | --- | ----------- | --- | --- |
Fig. 1: The key components of MorphStream and its GUI. emphasizes transactional integrity in TSPEs. Strategies for
|     |     |     |     |     |     |     |     | operation | exploration,  |     | determining | scheduling  |        | units, and |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------- | --- | ----------- | ----------- | ------ | ---------- |
|     |     |     |     |     |     |     |     | managing  | transactional |     | aborts      | are evident | in its | execution  |
as a read or write operation to shared state, denoted as MorphStream
|     |      |     |       |        |     |     |     | phase. | Compared | to  | peers, |     |     | consistently |
| --- | ---- | --- | ----- | ------ | --- | --- | --- | ------ | -------- | --- | ------ | --- | --- | ------------ |
| O   | Read | (k) | Write | (k,v). |     |     | ts  |        |          |     |        |     |     |              |
i = ts or ts Timestamp is defined demonstrates adaptability and superior performance across
k
| as  | the time | of      | its triggering |     | input event, | while     | denotes   | varied workloads. |     |     |     |     |     |     |
| --- | -------- | ------- | -------------- | --- | ------------ | --------- | --------- | ----------------- | --- | --- | --- | --- | --- | --- |
| the | state    | to read | or write,      | and | v denotes    | the value | to write. |                   |     |     |     |     |     |     |
The key k can be extracted from the input event [4], [2], A. Programming APIs
|     | v   |     |     |     |     |     | v   | MorphStream, |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- |
while may depend on the value of a list of states, i.e., = In transactional stream applications are
| f(k | ,k  | ,...,k | ),wheref |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | ------ | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
1 2 m isaread-onlyuser-definedfunction. depicted as a Directed Acyclic Graph (DAG), adhering to a
The set of state access operations triggered by the processing dataflow model. Within each vertex, MorphStream extends
ofoneinputtupleisdefinedasonestatetransaction,denoted
|     |     |     |     |      |     |     |     | both user-defined |     | and | system-integrated |     | APIs to | enhance the |
| --- | --- | --- | --- | ---- | --- | --- | --- | ----------------- | --- | --- | ----------------- | --- | ------- | ----------- |
|     | txn | < O | O   | O >. |     |     | (S) |                   |     |     |                   |     |         |             |
as ts = 1, 2, ... n Subsequently, a schedule transaction processing over streams. While users mould the
|     |     |     | txn | txn | txn |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
of state transactions t1, t2, ..., tn is correct if it is user-definedAPIstofittheirspecificapplicationrequirements,
conflict equivalent to txn ≺ txn ≺ ... ≺ txn tn, where ≺ thesystem-integratedAPIsfunctionakintolibraryprocedures.
|       |      |     |              | t1       | t2  |                |     |                      |     |     |              |       |           |          |
| ----- | ---- | --- | ------------ | -------- | --- | -------------- | --- | -------------------- | --- | --- | ------------ | ----- | --------- | -------- |
| means | that | the | left operand | precedes | the | right operand. |     |                      |     |     |              |       |           |          |
|       |      |     |              |          |     |                |     | The user-implemented |     |     | APIs require | users | to follow | a three- |
To sustain high input stream ingress rates, scaling TSP step procedure to implement the operations of an operator:
is essential. Hence, a design goal of TSPEs is to maximize Firstly,preprocessingtheinputeventstoidentifytheread/write
system concurrency while maintaining a correct schedule. sets of state transactions. Secondly, performing state access,
| However, |     | it is | a non-trivial |     | challenge | due | to complex |     |     |     |     |     |     |     |
| -------- | --- | ----- | ------------- | --- | --------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
whereallstateaccessesareexpressedthroughsystem-provided
inter- and intra-dependencies among state transactions. In the APIs using state transactions. Finally, post-processing is
following,wesummarizethreekeydependenciesamongstate conducted to further process the input events based on the
transactions. accessresultsandgeneratecorrespondingoutputs.Thecatalog
(TD):O
• Temporal Dependency i temporallydependson of system-integrated APIs encompasses operations such as
|     |     |         |         |      |          |                    |     | READ,WRITE,andREAD |     |     |     | MODIFY,symbolizingthe |     |     |
| --- | --- | ------- | ------- | ---- | -------- | ------------------ | --- | ------------------ | --- | --- | --- | --------------------- | --- | --- |
|     | O j | if they | are not | from | the same | state transaction, | but |                    |     |     |     |                       |     |     |
theyaccessthesamestate,andO ihasalargertimestamp. atomic actions of a state transaction. Within MorphStream,
TrackingTDenforcesthatstateaccessesfollowtheevent a window operation [9] is characterized as either a read or
sequence. write task, further contextualized by a temporal range and
• Parametric Dependency (PD): O i = Write(k i ,v), a designated trigger instant. Once an application is fully
where v = f(k ,k ,...,k ), parametrically depends on sculpted,itisdispatchedasajobtoMorphStream,priming
|     |     |     | 1   | 2   | m   |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
O = Write(k ,v(cid:2)) k (cid:3)= k k ∈ k ,k ,...,k it for the ensuing execution.
|     | j         |           | j        | if         | j                | i, j | 1 2 m,       |                 |     |          |     |     |     |     |
| --- | --------- | --------- | -------- | ---------- | ---------------- | ---- | ------------ | --------------- | --- | -------- | --- | --- | --- | --- |
|     |           | O         |          |            | TrackingPD       |      |              |                 |     |          |     |     |     |     |
|     | and       | i has     | a larger | timestamp. |                  |      | resolves the |                 |     |          |     |     |     |     |
|     |           |           |          |            |                  |      |              | B. Construction |     | of S-TPG |     |     |     |     |
|     | potential | conflicts |          | among      | write operations |      | due to user- |                 |     |          |     |     |     |     |
defined functions. Central to MorphStream’s design is its advanced
(LD): O O capability to facilitate intricate three-dimensional scheduling
|     | • Logical | Dependency |     |     | i and | j logically | depend |     |     |     |     |     |     |     |
| --- | --------- | ---------- | --- | --- | ----- | ----------- | ------ | --- | --- | --- | --- | --- | --- | --- |
oneachotheriftheybelongtothesamestatetransaction. decisions promptly. This efficacy is achieved by distinctly
Tracking LD ensures that the aborting of one operation partitioningdependencyresolutionandexecutioninto‘stream
leads to aborting all operations of the same state processing’and‘transactionprocessing’phases.Suchstrategic
|     |     |     |     |     |     |     |     | bifurcation | not | only | enables | MorphStream | to  | efficiently |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ---- | ------- | ----------- | --- | ----------- |
transaction.
|     |     |     |     |     |     |     |     | batch continuous |     | state | transactions |     | but also | grants the |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ----- | ------------ | --- | -------- | ---------- |
III. SYSTEMOVERVIEW
|     |     |     |     |     |     |     |     | flexibility | to recalibrate |     | its scheduling | techniques |     | in response |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | -------------- | --- | -------------- | ---------- | --- | ----------- |
MorphStream is a novel TSPE, purposefully engineered to the dynamic nature of the workload. For every batch of
|     |            |     |             |     |                 |     |          | state transactions, |     | MorphStream |     | constructs | a   | stateful task |
| --- | ---------- | --- | ----------- | --- | --------------- | --- | -------- | ------------------- | --- | ----------- | --- | ---------- | --- | ------------- |
| for | impeccable |     | performance |     | on contemporary |     | parallel |                     |     |             |     |            |     |               |
hardware, even amidst dynamically shifting and heavily precedencegraph(S-TPG),whereinverticessymbolizeatomic
contested workloads. Figure 1 presents a schematic of state access operations, and edges establish the dependencies
MorphStream’s framework and its GUI. Initiating between them. Each vertex in the S-TPG is annotated with
5486
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:53:05 UTC from IEEE Xplore.  Restrictions apply.

| a finite          | state machine |            | that tracks | the     | execution  | status of |     |     |     |             |         |     |         |     |
| ----------------- | ------------- | ---------- | ----------- | ------- | ---------- | --------- | --- | --- | --- | ----------- | ------- | --- | ------- | --- |
|                   |               |            |             |         |            |           |     |     |     | MorphStream | TStream |     | S-Store |     |
| the corresponding |               | operation. | The         | overall | scheduling | process   |     |     |     |             |         |     |         |     |
thusintegratestheconcurrentformationandthree-dimensional )%(tnecreP evitalumuC 100
)ces/k(tuphguorhT 600
| strategy | considerations | applied |     | to the S-TPG. |     |     |     |     |     | 1 6 0 |     | 80  |     |     |
| -------- | -------------- | ------- | --- | ------------- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- |
1 140 5 0
|              |     |           |     |              |     |             | 400 |     |     | 130        |       | 60  |     |     |
| ------------ | --- | --------- | --- | ------------ | --- | ----------- | --- | --- | --- | ---------- | ----- | --- | --- | --- |
| Constructing |     | the S-TPG |     | with minimal |     | overhead is |     |     |     | 120        |       |     |     |     |
|              |     |           |     |              |     |             |     |     |     | 1 11 0 0 0 | DDDDD | 40  |     |     |
paramount. Yet, discerning the three dependency types (TDs, 200 PPhhaassee3
20
| LDs, PDs) | among | state | access | operations | poses | challenges, |     |     |     |     |     |     |     |     |
| --------- | ----- | ----- | ------ | ---------- | ----- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
|           |       |       |        |            |       |             |     | 0   |     |     |     | 0   |     |     |
especially when transactions arrive out-of-order. To mitigate Phase1 Phase2 Phase3 Phase4 0 2000 4000 6000 8000
|     |     |     |     |     |     |     |     |     | Phase |     |     |     | Latency(cid:11)(cid:80)(cid:86)(cid:12) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --------------------------------------- | --- |
this, the S-TPG construction is divided into two phases: (a)Throughput (b)Latency
| a) Stream | Processing | Phase: | This | phase | is focused | on the |     |      |               |     |            |     |           |     |
| --------- | ---------- | ------ | ---- | ----- | ---------- | ------ | --- | ---- | ------------- | --- | ---------- | --- | --------- | --- |
|           |            |        |      |       |            |        |     | Fig. | 2: Evaluation |     | on Dynamic |     | Workload. |     |
identificationofdependencieswithinthesametransaction.LDs
arerecognizedbasedonstatementorders.ForTDs,operations
| are organized |               | into key-partitioned |          |             | lists, chronologically |             |                |     |                 |          |           |              |             |               |
| ------------- | ------------- | -------------------- | -------- | ----------- | ---------------------- | ----------- | -------------- | --- | --------------- | -------- | --------- | ------------ | ----------- | ------------- |
|               |               |                      |          |             |                        |             | its scheduling |     | strategy,       |          | such as   | shifting     | from        | a structured  |
| ordered       | by timestamp  | and                  | centered | around      | each                   | operation’s |                |     |                 |          |           |              |             |               |
|               |               |                      |          |             |                        |             | approach       | to  | an unstructured |          | approach, | to           | effectively | resolve       |
| target state. | Additionally, |                      | “proxy   | operations” | are                    | maintained  |                |     |                 |          |           |              |             |               |
|               |               |                      |          |             |                        |             | dependencies   |     | and             | maintain | high      | performance. |             | In the fourth |
| for write     | operations    | to                   | discern  | PDs;        | these are              | essentially |                |     |                 |          |           |              |             |               |
MorphStream’s
|                 |     |              |     |         |                |       | experimental |            | phase, | we focus | on       |               |     | resilience |
| --------------- | --- | ------------ | --- | ------- | -------------- | ----- | ------------ | ---------- | ------ | -------- | -------- | ------------- | --- | ---------- |
| read operations |     | aligned with | the | keys of | the associated | write |              |            |        |          |          |               |     |            |
|                 |     |              |     |         |                |       | to an        | increasing |        | ratio of | aborting | transactions. |     | While the  |
task.b)TransactionProcessingPhase:Here,subsequentstate
|              |            |             |             |       |                |         | performance |     | of TStream |     | deteriorates | due       | to redo | overhead,  |
| ------------ | ---------- | ----------- | ----------- | ----- | -------------- | ------- | ----------- | --- | ---------- | --- | ------------ | --------- | ------- | ---------- |
| transactions | are        | temporarily | halted      | until | the transition | back to |             |     |            |     |              |           |         |            |
|              |            |             |             |       |                |         | MorphStream |     | adopts     | an  | abort        | mechanism | that    | evolves in |
| the stream   | processing | phase.      | Efficiently |       | pinpointing    | TDs and |             |     |            |     |              |           |         |            |
PDs response to changing abort rates, resulting in a throughput
| becomes | feasible | at  | this juncture | by  | iterating | through the |      |         |        |      |                |     |               |        |
| ------- | -------- | --- | ------------- | --- | --------- | ----------- | ---- | ------- | ------ | ---- | -------------- | --- | ------------- | ------ |
|         |          |     |               |     |           |             | 2.2x | to 3.4x | higher | than | other systems. |     | Additionally, | unlike |
chronologicallyorderedlistsandthe“proxyoperations”.This
|           |          |            |     |                 |          |      | S-Store  | and        | TStream, | whose         |     | performance | declines | under      |
| --------- | -------- | ---------- | --- | --------------- | -------- | ---- | -------- | ---------- | -------- | ------------- | --- | ----------- | -------- | ---------- |
| swift and | accurate | dependency |     | identification, | combined | with |          |            |          |               |     |             |          |            |
|           |          |            |     |                 |          |      | changing | workloads, |          | MorphStream’s |     |             | adaptive | scheduling |
rapidS-TPGconstruction,empowersMorphStreamtoadapt
|                |     |                   |     |          |          |          | minimizes |     | tail latency | by  | dynamically | optimizing |     | for varied |
| -------------- | --- | ----------------- | --- | -------- | -------- | -------- | --------- | --- | ------------ | --- | ----------- | ---------- | --- | ---------- |
| its scheduling |     | tactics, aligning |     | with the | evolving | workload |           |     |              |     |             |            |     |            |
workload characteristics.
| attributes | of diverse | state | transaction | batches. |     |     |     |     |     |     |     |     |     |     |
| ---------- | ---------- | ----- | ----------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
IV. DEMONSTRATIONSCENARIOS
| C. Adaptive | Scheduling |     | based on | S-TPG |     |     |     |     |     |     |     |     |     |     |
| ----------- | ---------- | --- | -------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
InMorphStream,transactionschedulingefficacydepends MorphStream
|     |     |     |     |     |     |     | We  | will | demonstrate | the | key | features | of  |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | ----------- | --- | --- | -------- | --- | --- |
on managing three types of dependencies via the S-TPG. by using SL as an example. The demonstration will be
For each batch of state transactions, the process starts segmented into three critical parts, each focusing on distinct
with initializing the S-TPG, establishing the framework of functionalities provided by the MorphStream’s GUI.
| operations | and | dependencies. | Execution |     | then unfolds | through |     |     |     |     |     |     |     |     |
| ---------- | --- | ------------- | --------- | --- | ------------ | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
two exploratory paths: a structured approach employing A. Application Development and Deployment
| depth-firstorbreadth-firstsearch-liketraversalsforsystematic |     |     |     |     |     |     | MorphStream’s |     |     |     |        |              |     |             |
| ------------------------------------------------------------ | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | ------ | ------------ | --- | ----------- |
|                                                              |     |     |     |     |     |     |               |     |     | GUI | offers | an efficient |     | environment |
exploration,oranunstructuredapproachviarandomtraversal,
|     |     |     |     |     |     |     | for stream |     | application | development. |     | A frontend |     | code editor |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ----------- | ------------ | --- | ---------- | --- | ----------- |
offering adaptability. Concurrently, threads decide on the is designed for ease in implementing transactional stream
scheduling granularity, choosing between single operation or processing applications as shown in Figure 3. With built-
| group scheduling |          | to strike | a          | balance      | between | dependency  |               |     |               |             |                   |                |     |            |
| ---------------- | -------- | --------- | ---------- | ------------ | ------- | ----------- | ------------- | --- | ------------- | ----------- | ----------------- | -------------- | --- | ---------- |
|                  |          |           |            |              |         |             | in syntax     |     | highlighting, |             | auto-suggestions, |                | and | integrated |
| resolution       | overhead | and       | scheduling | scalability. |         | In cases of | MorphStream’s |     |               |             |                   |                |     |            |
|                  |          |           |            |              |         |             |               |     |               | client-side | API               | documentation, |     | the user   |
MorphStream
transaction abort, adopts varied strategies, can easily define customized streaming applications with
ranging from eager aborts for swift termination of failing transactional guarantees. This hands-on interface ensures
| operations | to  | lazy aborts | for | deferred | handling. | These |              |     |      |      |             |         |     |           |
| ---------- | --- | ----------- | --- | -------- | --------- | ----- | ------------ | --- | ---- | ---- | ----------- | ------- | --- | --------- |
|            |     |             |     |          |           |       | participants |     | gain | both | theoretical | insight | and | practical |
strategies are dynamically selected and fine-tuned in response MorphStream
|     |     |     |     |     |     |     | proficiency |     | in using |     |     | for | high-performance |     |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | -------- | --- | --- | --- | ---------------- | --- |
to operational outcomes and overall system performance. stream processing. The submitted code will be subsequently
MorphStream,
To evaluate we compare its performance compiledasanewstreamingjobdeployedinMorphStream.
| against  | two         | state-of-the-art |           | TSPEs: | S-Store   | [2] and     |     |     |     |     |     |     |     |     |
| -------- | ----------- | ---------------- | --------- | ------ | --------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| TStream  | [4].        | We use           | Streaming | Ledger |           | [5] (SL) as |     |     |     |     |     |     |     |     |
| the base | application | and              | divide    | the    | workloads | into four   |     |     |     |     |     |     |     |     |
MorphStream’s
| phases.      | The first   | three    | phases   | evaluate         |     |              |     |     |     |     |     |     |     |     |
| ------------ | ----------- | -------- | -------- | ---------------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
| adaptability | to          | varying  | workload | characteristics, |     | such as      |     |     |     |     |     |     |     |     |
| deposit      | transaction | density, | key      | skewness,        |     | and transfer |     |     |     |     |     |     |     |     |
MorphStream
| transaction  | ratios.     | For example, |      | in Phase    | 1,          |             |     |     |     |     |     |     |     |     |
| ------------ | ----------- | ------------ | ---- | ----------- | ----------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| leverages    | an adaptive | scheduling   |      | algorithm   | to          | yield up to |     |     |     |     |     |     |     |     |
| 1.27x higher | throughput  |              | than | the closest | competitor. | As          |     |     |     |     |     |     |     |     |
MorphStream.
workloads change, MorphStream dynamically adjusts Fig. 3: App development & deployment in
5487
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:53:05 UTC from IEEE Xplore.  Restrictions apply.

B. Display of Topology and TPG
Figure 4 showcases the GUI’s display of application
topology and S-TPG. The application topology consists of
all operators integral to the stream-oriented functionalities
of MorphStream. The S-TPG, as the key component
that participates in MorphStream’s adaptive scheduling
process,visualizesthefine-grainedtransactionaldependencies
among state access operations. Each node represents one
state access, and three types of dependencies (TD, LD, and
PD) are visualized as color-coded edges for clarity. Detailed
state access information for each operation is revealed upon
hovering over it with the cursor. Adjacent to the S-TPG, the
lowerrightsectionprovidesaggregatednumbersandratiosof
TD, LD, and PD on the current S-TPG. These statistics offer
usersvaluableinsightsintotheheuristic-baseddecisionmodel
that governs MorphStream’s adaptive scheduling, aiding in
performance optimization or troubleshooting.
Spout SL Sink
(cid:2) (cid:2) (cid:2) (cid:2)TPG
TD LD PD
(cid:2) Txn ID: 3656_1
(cid:2) Txn Type: Write
(cid:2) Table: "accounts"
(cid:2) Key: "3928"
TD LD PD
rebmuN
Construct
140 Throughput: 92.3K (tuple/s) Time
Latency: 9.1 (ms) Useful
Time 120
100
(cid:2) 80 Ex ti p m lo e re
(cid:2) 60 (cid:2)Batch ID (cid:2)Ba3t5ch ID
(cid:2)Batch Size (cid:2) 1600
(cid:2) 40 (cid:2)Min Latency (cid:2) 8.2 ms
(cid:2)Avg Latency (cid:2) 9.1 ms
(cid:2) 20 (cid:2)Max Latency (cid:2) 13.7 ms
(cid:2)Duration (cid:2) 17.3 ms
(cid:2) (cid:2) 0 (cid:2)Throughput (cid:2) 92.3 K tuple/s 25 30 35 40 45 50 55 (cid:2)Scheduler OP_NS_A
Fig. 5: Display of Runtime Statistics.
V. SUMMARY
None of the existing TSPEs can maximize performance
under different and dynamically changing workload
characteristics, which limits their practicality. In this
demonstration, we aim to show that MorphStream can
achieve scalable processing of transactions over streams. We
plan to showcase MorphStream’s ability to dynamically
adjustitsschedulingstrategybyexploringthethreescheduling
dimensions based on the analysis of decision trade-offs under
different workload characteristics. Additionally, this approach
results in better overall performance than using a single
TD LD PD schedulingstrategy.Theaudiencewillhavetheopportunityto
interact with MorphStream and gain a better understanding
of how to use it, its unique features, and its performance.
400
200
ACKNOWLEDGEMENT
(cid:2) (cid:2) 0
This work is supported by a MoE AcRF Tier 2 grant
Fig. 4: Display of Application Topology and TPG statistics. (MOE-T2EP20122-0010), the National Research Foundation,
Singapore and Infocomm Media Development Authority
under its Future Communications Research & Development
Programme FCP-SUTD-RG-2022-005 & FCP-SUTD-RG-
C. Display of Runtime Execution Statistics
2022-006 and a startup grant of NTU (023452-00001).
We highlight the GUI’s ability to display runtime Corresponding author is Shuhao Zhang.
execution statistics in Figure 5. The interface dynamically
presents MorphStream’s throughput and latency for REFERENCES
each batch, enabling users to make instant performance- [1] S. Zhang, J. Soto, and V. Markl, “A survey on transactional stream
processing,”TheVLDBJournal,Sep2023.
enhancingadjustments.Furthermore,theGUIoffersagranular
[2] J. Meehan, N. Tatbul, and et al., “S-store: Streaming meets transaction
breakdown of execution durations for each input batch, processing,”Proc.VLDBEndow.,sep2015.
segmented into: 1) Useful Time, reserved for the actual [3] L.Affetti,A.Margara,andG.Cugola,“Tspoon:Transactionsonastream
processor,”JPDC,vol.140,pp.65–79,2020.
time spent in transaction execution, 2) Construction Time,
[4] S. Zhang, Y. Wu, and et al., “Towards concurrent stateful stream
designatedforS-TPGcreation,3)ExplorationTime,allocated processingonmulticoreprocessors,”inICDE,2020.
for exploring the optimal transactional scheduling strategy, [5] S. A. Transactions and S. Data, “Data Artisans Streaming Ledger
Serializable ACID Transactions on Streaming Data, https://www.
and 4) Abort Time, consumed during transaction abort
da-platform.com/streaming-ledger,”2018.
handling. These fine-grained metrics furnish a clear view of [6] Y. Mao, J. Zhao, and et al., “Morphstream: Adaptive scheduling for
MorphStream’s execution efficiency, proving invaluable for scalable transactional stream processing on multicores,” in SIGMOD,
2023.
troubleshooting and performance optimization. Additionally,
[7] L. Affetti, A. Margara, and G. Cugola, “Flowdb: Integrating stream
the interface summarizes comprehensive statistics for every processingandconsistentstatemanagement,”inDEBS,2017.
batch of input events, detailing metrics such as the statistical [8] U.Cetintemel,J.Du,andetal.,“S-store:Astreamingnewsqlsystemfor
bigvelocityapplications,”Proc.VLDBEndow.2014.
summary of event processing latency, overall throughput, and
[9] L.Golab,K.G.Bijay,andM.T.O¨zsu,“Onconcurrencycontrolinsliding
the chosen scheduling strategy. Runtime statistics of different windowqueriesoverdatastreams,”inEDBT,2006.
input batches are dynamically updated in the GUI, and users
canalsoreviewthehistoricalperformancedataofanyprevious
batches.
5488
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:53:05 UTC from IEEE Xplore. Restrictions apply.