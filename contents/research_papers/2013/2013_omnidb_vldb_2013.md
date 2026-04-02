OmniDB: Towards Portable and Efficient Query Processing
on Parallel CPU/GPU Architectures
Shuhao Zhang, Jiong He, Bingsheng He Mian Lu
NanyangTechnologicalUniversity A*STARIHPC,Singapore
ABSTRACT and StagedDB [7] as well as query processing techniques
(e.g., [2, 4, 12, 3, 11, 10]) have been developed. However,
DrivenbytherapidhardwaredevelopmentofparallelCPU/GPU
most of those implementations are developed from scratch,
architectures, we have witnessed emerging relational query
and they are usually tuned, optimized, and can only run
processingtechniquesandimplementationsonthoseparallel
on some specific architectures. For example, GPUQP can
architectures. However, most of those implementations are
run on NVIDIA GPUs but cannot run on AMD GPUs.
not portable across different architectures, because they
This creates code bases with similarities and differences.
are usually developed from scratch and target at a specific
As time goes by, more parallel CPU/GPU architectures
architecture. This paper proposes a kernel-adapter based
appear and more code bases would be created. Ideally, a
design (OmniDB), a portable yet efficient query processor
portable and efficient query processor should be developed
on parallel CPU/GPU architectures. OmniDB attempts
on different architectures. That motivates us to investigate
to develop an extensible query processing kernel (qKernel)
theportabilityandefficiencyofqueryprocessingonparallel
based on an abstract model for parallel architectures, and
CPU/GPU architectures.
to leverage an architecture-specific layer (adapter) to make
Letusfirstdiscussthepitfallsofhavingmanycodebases
qKernelbeawareofthetargetarchitecture. ThegoalofOm-
ofqueryprocessorsondifferentparallelCPU/GPUarchitec-
niDBistomaximizethecommonfunctionalityinqKernelso
tures, mainly from software engineering’s perspective. One
that the development and maintenance efforts for adapters
observation on architecture-aware query processors (e.g.,
are minimized across different architectures. In this demo,
[16, 9, 7]) is that some components can be shared among
wedemonstrateourinitialeffortsinimplementingOmniDB,
them,e.g.,queryparser. Theotherobservationisthatmany
and present the preliminary results on the portability and
ofpreviousstudiesonarchitecture-awaretechniques(e.g.,[2,
efficiency.
4,12,3,11])haveimplicitly/explicitlymadetheassumption
thattheycanbeintegratedintoanexistingqueryprocessor.
1. INTRODUCTION
Those observations lead to the necessity of developing and
We have witnessed the trend of heterogeneity in the maintaining different code bases of query processors on
development of parallel processor architectures. Hard- different architectures. Even worse, those code bases may
ware vendors have continued to offer different new multi- havecommonorsimilarcomponents,andintersectwitheach
core/many-coreprocessors. AMDand Inteloffermulti-core other. As the hardware evolves, the code bases and their
CPUs, usually with fewer than eight cores. Sun Niagara relationship need to evolve as well. According to the Laws
and Cell processors have dozens of cores per chip. AMD ofsoftwareevolutionbyLehman[14, 15], thecomplexityof
and NVIDIA offer GPUs (Graphics Processing Units) that suchsoftwareevolutionissignificantlyincreased. Itrequires
consist of dozens to hundreds of cores in a single chip. a significant amount of work to maintain the software.
Traditionally, GPUsare usuallyconnectedwithCPUs with Portability is a must for reducing the development and
PCI-e bus. Recently, coupled architectures (such as AMD maintenance cost. On the other hand, the efficiency of
APU(AcceleratedProcessingUnits)andSandy/Ivybridge) a query processor should be optimized according to the
integrate a CPU and a GPU into the same chip. How data target architecture. To capture the best of both words,
management systems can fully leverage those architectures we propose a kernel-adapter based design (OmniDB), a
is still largely an open problem, and has attracted a lot portableyetefficientdesignforqueryprocessingonparallel
of fruitful research efforts [1, 8]. Various architecture- CPU/GPU architectures. OmniDB attempts to develop an
aware query processors such as C-Store [16], GPUQP [9] extensible query processing kernel (namely qKernel) based
on an abstract model for parallel architectures, and to
leverageasoftwarelayer(adapter)tomakeqKernelbeaware
Permissiontomakedigitalorhardcopiesofallorpartofthisworkfor
of the target architecture.
personalorclassroomuseisgrantedwithoutfeeprovidedthatcopiesare
notmadeordistributedforprofitorcommercialadvantageandthatcopies It is an open problem on defining the boundary between
bearthisnoticeandthefullcitationonthefirstpage.Tocopyotherwise,to qKernel and adapter so that software development and
republish,topostonserversortoredistributetolists,requirespriorspecific maintenance cost are minimized. Ideally, OmniDB should
permissionand/orafee. Articlesfromthisvolumewereinvitedtopresent maximize the common functionality in qKernel to reduce
theirresultsatThe39thInternationalConferenceonVeryLargeDataBases,
the efforts on adapters. qKernel should be extensible to al-
August26th 30th2013,RivadelGarda,Trento,Italy.
low developers to plug architecture-specific parameters and
ProceedingsoftheVLDBEndowment,Vol.6,No.12
Copyright2013VLDBEndowment2150 8097/13/10...$10.00.
1374

| CPUcore | GPU core |     |     |     |     |     | 3. DESIGNANDIMPLEMENTATION |     |     |     |     |     |     |
| ------- | -------- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- |
CPU GPU CPU GPU In this section, we give an overview of the design of
cache
|     |     | cache |     |     |     |     | OmniDB, | followed | by  | our initial | implementation. |     | The |
| --- | --- | ----- | --- | --- | --- | --- | ------- | -------- | --- | ----------- | --------------- | --- | --- |
PCI-e
|      |     |     |      |     |     |      | designgoalofOmniDBincludestwoaspects: |     |     |     |     | portabilityand |     |
| ---- | --- | --- | ---- | --- | --- | ---- | ------------------------------------- | --- | --- | --- | --- | -------------- | --- |
| Main |     | GPU | Main | GPU |     | Main |                                       |     |     |     |     |                |     |
Memory Memory Memory efficiency. We aim at designing a portable query processor
|     |     | Memory |     |     |     | Memory |     |     |     |     |     |     |     |
| --- | --- | ------ | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
(a) CPU-only that requires a minimum amount of efforts in achieving
|         | (b)GPU-only |          | (c) CPU-GPU   |     |     | (d) APU  |                        |     |     |             |     |     |     |
| ------- | ----------- | -------- | ------------- | --- | --- | -------- | ---------------------- | --- | --- | ----------- | --- | --- | --- |
|         |             |          |               |     |     |          | architecture-awareness |     | for | efficiency. |     |     |     |
| Figure  | 1: Example  | parallel | architectures |     |     | with one |                        |     |     |             |     |     |     |
| CPU and | one GPU.    |          |               |     |     |          |                        |     |     |             |     |     |     |
3.1 ArchitecturalDesignofOmniDB
|     |     |     |     |     |     |     | Abstract | architecture |     | model. |     | We model | a parallel |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------------ | --- | ------ | --- | -------- | ---------- |
configurations into query processing operations and com- CPU/GPUarchitecturewithN threaded-parallelprocessing
ponents. On the other hand, adapters include architecture- elements (PPEs) P , ..., and P . Each PPE has its own
|     |     |     |     |     |     |     |     |     | 1   |     | N   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
awareconfigurations,tuningsandoptimizationsforqKernel. memory space, which can be overlapped or non-overlapped
It is not the intention of this demo to entirely solve the with other PPEs. The memory accesses are in blocks. For
above-mentioned problem. Instead, we present our initial example,wecanmodeltheCPUandtheGPUasindividual
efforts in implementing OmniDB. This demo demonstrates PPEs. On the APU, the two PPEs can share the main
acaseforfeasibilityoftheOmniDBdesign,andshedssome memory, whereas the CPU and the GPU have their own
lights on defining the boundary. Our implementation is memory in the classic CPU-GPU architecture.
based on OpenCL (Open Computing Language) so that Our abstract architecture model is general for parallel
OmniDB can run on different architectures like CPUs and query processing. It is able to capture a machine with
GPUs. We further develop adapters for four kinds of ar- multiple CPUs and GPUs, in which a PPE can be a CPU
chitectures: CPU-only, GPU-only, (classic) CPU-GPU and or a GPU. Also, our model is similar to PRAM (Parallel
APU (We follow AMD’s terminology). This demo presents Random-Access Machine). Differently, the PPEs of our
the preliminary results on the portability and efficiency of model may or may not share the main memory, whereas
OmniDB. First, OmniDB has the “one code base fits all” those of PRAM do.
feature,whosecodebasecanbecompiledandrunonallthe A kernel-adapter based approach. To balance the
four architectures. Second, we evaluate the effectiveness of portability and efficiency of architecture-aware query pro-
adaptersondifferentarchitectures. Ouradapterseffectively cessing, we propose a kernel-adapter based approach to
capture the differences among architectures. develop OmniDB. OmniDB consists of a query processing
|     |     |     |     |     |     |     | kernel (qKernel) |     | and architecture-aware |     |     | adapters. |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ---------------------- | --- | --- | --------- | --- |
Figure2illustratestheoverallsystemdesignofOmniDB.
2. BACKGROUNDONPARALLELARCHI
|     |     |     |     |     |     |     | Based on | the abstract | architecture |     | model, | qKernel | consists |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------------ | ------------ | --- | ------ | ------- | -------- |
TECTURES
|     |     |     |     |     |     |     | of an execution |     | engine, | a scheduler, | a   | cost model | and other |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ------- | ------------ | --- | ---------- | --------- |
We currently focus on parallel architectures including components in a standard query processor (such as query
multi-coreCPUsandGPUs. Figure1illustratestheabstrac- optimizer). There are some parameters and configurations
inthosecomponentsthatwillbecustomizedbythespecific
| t view of         | four example | parallel                        |      | CPU/GPU | architectures. |     |                                             |               |     |        |          |     |               |
| ----------------- | ------------ | ------------------------------- | ---- | ------- | -------------- | --- | ------------------------------------------- | ------------- | --- | ------ | -------- | --- | ------------- |
|                   |              |                                 |      |         |                |     | adapter.                                    | The execution |     | engine | includes | the | data-parallel |
| This figure       | illustrates  | a machine                       | with | one     | CPU and/or     | one |                                             |               |     |        |          |     |               |
|                   |              |                                 |      |         |                |     | implementationsforqueryprocessingoperators. |               |     |        |          |     | Aworkload     |
| GPUforsimplicity. |              | Thesystemdesigninthispapercanbe |      |         |                |     |                                             |               |     |        |          |     |               |
applicabletomultipleCPUsandGPUsinthesamemachine. scheduler is developed to assign work units to individual
According to heterogeneity, we can divide them into two PPEs. Theworkunitisdefinedtoacertainamountofwork
categories. CPU-only and GPU-only are homogeneous, assigned to an PPE in one scheduling decision. In practice,
whereasCPU-GPUandAPUareheterogeneous. Webriefly it can be evaluating a query, an operator or processing a
comparethesimilaritiesanddifferencesamongarchitectures number of tuples. An abstract cost model is developed for
within each category. More technical details have been estimating the execution cost. We estimate the total cost
elaborated in [6, 5]. of executing a work unit on a PPE to be the total time of
AsillustratedinFigures1(a)and1(b),boththeCPUand memory accesses and instruction executions.
Anadapterincludesthesoftwarecomponents,parameters
| the GPU     | are multi-/many-core |          | architectures |      | with  | a shared   |                    |     |      |       |         |        |               |
| ----------- | -------------------- | -------- | ------------- | ---- | ----- | ---------- | ------------------ | --- | ---- | ----- | ------- | ------ | ------------- |
|             |                      |          |               |      |       |            | and configurations |     | that | adapt | qKernel | to the | target archi- |
| data cache. | A GPU                | can have | much          | more | cores | as well as |                    |     |      |       |         |        |               |
tecture. Italsoinstantiatestheabstractarchitecturemodel
| much higher | memory | bandwidth |     | than a | multi-core | CPU. |     |     |     |     |     |     |     |
| ----------- | ------ | --------- | --- | ------ | ---------- | ---- | --- | --- | --- | --- | --- | --- | --- |
On the other hand, the CPU has much larger L2/L3 data to the target architecture specification (e.g., the cache size
caches. Ideally, the GPU is more suitable for fine-grained and the number of PPEs).
data parallelism, and the CPU is more suitable for coarse- As discussed in Introduction, it is an open problem to
grained parallelism. define the boundary between qKernel and adapters. It
As illustrated in Figures 1(c) and 1(d), the CPU- is our long-term goal to solve this problem. In the next
GPU and the APU architectures utilize both the CPU and sub-section, we present our initial efforts in implementing
| the GPU    | in the    | system (i.e., | co-processing). |         | The         | major | OmniDB. |     |     |     |     |     |     |
| ---------- | --------- | ------------- | --------------- | ------- | ----------- | ----- | ------- | --- | --- | --- | --- | --- | --- |
| difference | is on how | the CPU       | and             | the GPU | communicate |       |         |     |     |     |     |     |     |
3.2 PreliminaryImplementation
| with each | other. | On the CPU-GPU |     | architecture, |     | the CPU |     |     |     |     |     |     |     |
| --------- | ------ | -------------- | --- | ------------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
and the GPU are connected with a low-bandwidth PCI-e As a start, we use OpenCL to implement OmniDB.
bus. Thus, we need to carefully minimize the data transfer OpenCL is a framework for writing programs that execute
onthePCI-ebus. OntheAPU,theCPUandtheGPUshare across heterogeneous platforms such as CPUs and GPUs.
the main memory directly and the PCI-e bus is eliminated. Executionengine. LikeGPUQP[9],weadoptalayered
We have more flexibility in fine-grained co-processing. design for the execution engine of OmniDB. This layered
1375

Query the scheduling algorithm prefers to choose the PPE that
qKernel
|     |     |     |     |     |     |     |     | achieves | the best | performance. |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | -------- | ------------ | --- | --- | --- | --- | --- |
Execution Other Since calculating the optimal scheduling plan for a work-
|     | Cost model |        |     | Scheduler |     |            |     |                      |     |          |            |     |           |         |       |
| --- | ---------- | ------ | --- | --------- | --- | ---------- | --- | -------------------- | --- | -------- | ---------- | --- | --------- | ------- | ----- |
|     |            | engine |     |           |     | components |     |                      |     |          |            |     |           |         |       |
|     |            |        |     |           |     |            |     | load is an           | NP  | problem, | we adopt   | an  | on-line   | greedy  | algo- |
|     |            |        |     |           |     |            |     | rithm. Particularly, |     | our      | scheduling |     | algorithm | chooses | the   |
CPU GPU CPU-GPU APU suitable PPE as follows. First, we estimate the throughput
Adapter Adapter Adapter Adapter ofprocessingaworkunitoneachPPE.Note,theworkunit
|     |     |     |         |     |     |     |     | size may | vary on   | different | PPEs, | e.g.,        | the    | CPU            | and the   |
| --- | --- | --- | ------- | --- | --- | --- | --- | -------- | --------- | --------- | ----- | ------------ | ------ | -------------- | --------- |
|     |     |     |         |     |     |     |     | GPU may  | have      | different | work  | unit         | sizes. | In out         | settings, |
|     | CPU | GPU | CPU-GPU |     | APU |     |     |          |           |           |       |              |        |                |           |
|     |     |     |         |     |     |     |     | the work | unit size | varies    | among | query-level, |        | operator-level |           |
Figure 2: The kernel-adapter design of OmniDB. and OpenCL-kernel-level. Second, we obtain the current
workloadofeachPPE(i.e.,howmuchpendingworkloadto
|     |     |     |     |     |     |     |     | finish). Third, | we  | pick | a PPE | with the | highest | throughput |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ---- | ----- | -------- | ------- | ---------- | --- |
Operators (Selection, projection, join, for those PPEs whose current workload level is within a
sort, aggregation etc. )
|     |     |     |     |     |     |     |     | predefined | threshold | T   | 0 to the | average   | workload |           | among |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --------- | --- | -------- | --------- | -------- | --------- | ----- |
|     |     |     |     |     |     |     |     | all PPEs.  | If that   | PPE | cannot   | be found, |          | we simply | pick  |
Access methods (scan, B+-tree and
|     |     |     |     |     |     |     |     | the one | with the | lowest | workload. | The | on-line | scheduling |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ------ | --------- | --- | ------- | ---------- | --- |
hash index)
|     |     |     |     |     |     |     |     | algorithm | considers | both | hardware | capability |     | and | current |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------- | ---- | -------- | ---------- | --- | --- | ------- |
Data-Parallel Primitives(map, workload of each PPE. T is a tuning parameter to adjust
0
filter, split etc.) the two considerations mentioned above. In experiments,
|     |     |     |     |     |     |     |     | wechooseT | =20%bydefault. |     |     | OnCPU-onlyorGPU-only |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | -------------- | --- | --- | -------------------- | --- | --- | --- |
0
Storage Relations Indexes architecture, the scheduling algorithm degrades to FIFO.
|              |               |             |        |           |             |        |          | Cost               | model.                               | In          | order to       | allow     | adapters | to    | plug in   |
| ------------ | ------------- | ----------- | ------ | --------- | ----------- | ------ | -------- | ------------------ | ------------------------------------ | ----------- | -------------- | --------- | -------- | ----- | --------- |
|              |               |             |        |           |             |        |          | architecture-aware |                                      | cost        | estimations,   |           | the cost | model | offers    |
| Figure       | 3: The        | layered     | design | of        | execution   |        | engine.  |                    |                                      |             |                |           |          |       |           |
|              |               |             |        |           |             |        |          | two interfaces     | for                                  | adapters    | to instantiate |           | for      | each  | primitive |
|              |               |             |        |           |             |        |          | andoperator.       | Oneinterfaceistocountthenumberofmem- |             |                |           |          |       |           |
|              |               |             |        |           |             |        |          | ory blocks         | referenced                           | by          | the PPE,       | and       | the      | other | interface |
| design has   | high          | flexibility | in     | software  | development |        | and      |                    |                                      |             |                |           |          |       |           |
|              |               |             |        |           |             |        |          | is to calculate    | the                                  | instruction |                | execution | time     | for   | the PPE.  |
| maintenance. | Particularly, |             | the    | execution |             | engine | consists |                    |                                      |             |                |           |          |       |           |
Thelaterinterfaceissimplyanemptyfunction,becausethe
| of four | layers from | bottom |     | up, including |     | storage, | data- |             |      |                 |     |           |     |         |     |
| ------- | ----------- | ------ | --- | ------------- | --- | -------- | ----- | ----------- | ---- | --------------- | --- | --------- | --- | ------- | --- |
|         |             |        |     |               |     |          |       | instruction | cost | is architecture |     | dependent | in  | OpenCL. | The |
parallelprimitives,accessmethodsandrelationaloperators.
|            |           |         |            |     |            |         |        | memory | cost estimation |          | is simply | counting |            | the number | of  |
| ---------- | --------- | ------- | ---------- | --- | ---------- | ------- | ------ | ------ | --------------- | -------- | --------- | -------- | ---------- | ---------- | --- |
| Figure 3   | shows the | layered | design.    |     | Primitives | are     | common |        |                 |          |           |          |            |            |     |
|            |           |         |            |     |            |         |        | memory | blocks          | accessed | in the    | query    | processing | operation. |     |
| operations | on the    | data    | or indexes |     | in the     | system. | The    |        |                 |          |           |          |            |            |     |
Bydefault,ourcostmodeldoesnotassumetheexistenceof
enginealsosupportscommonaccessmethods,includingthe
|             |     |         |     |          |        |     |           | cache. We | adopt | very | standard | I/O | model | to estimate | the |
| ----------- | --- | ------- | --- | -------- | ------ | --- | --------- | --------- | ----- | ---- | -------- | --- | ----- | ----------- | --- |
| table scan, | the | B+-tree | and | the hash | index, | as  | well as a |           |       |      |          |     |       |             |     |
cost [17].
| set of common                                     | query |     | operators. | Our | access | methods | and |           |          |           |                |     |           |             |     |
| ------------------------------------------------- | ----- | --- | ---------- | --- | ------ | ------- | --- | --------- | -------- | --------- | -------------- | --- | --------- | ----------- | --- |
|                                                   |       |     |            |     |        |         |     | Adapters. | Our      | current   | implementation |     |           | of adapters | is  |
| relationaloperatorsaredevelopedbasedonprimitives. |       |     |            |     |        |         | The |           |          |           |                |     |           |             |     |
|                                                   |       |     |            |     |        |         |     | simple,   | with the | following | major          |     | purposes. | First,      | the |
dataparallelismofthoseoperationsfitswellontheabstract
|                 |               |          |             |               |                 |                 |           | adapter performs                    |            | calibrations   |                         | on the  | target          | architecture | to        |
| --------------- | ------------- | -------- | ----------- | ------------- | --------------- | --------------- | --------- | ----------------------------------- | ---------- | -------------- | ----------------------- | ------- | --------------- | ------------ | --------- |
| architecture    | model.        |          |             |               |                 |                 |           |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | obtain some                         | important  |                | parameters.             |         | One             | important    | issue     |
| As a            | start, we     | develop  | the         | execution     |                 | engine          | based on  |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | is whether                          | the        | target         | architecture            | has     | a cache.        |              | If so, we |
| the code        | of GPUQP      | [9].     | Most        | of            | the algorithmic |                 | design    |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | need to                             | measure    | the cache      | parameters              |         | such            | as cache     | line      |
| of primitives,  | access        | methods  |             | and operators |                 | can             | be found  |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | sizes and                           | cache      | capacity.      | Second,                 |         | the adapter     |              | performs  |
| in the previous | paper         |          | [9]. Beyond | that,         | we              | have            | made the  |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | architecture-awaretuning.           |            |                | OntheCPU-onlyandtheGPU- |         |                 |              |           |
| following       | major         | efforts. |             |               |                 |                 |           |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | only architecture,                  |            | work           | unit sizes              | are     | calibrated      |              | with the  |
| First,          | we have       | ported   | GPUQP       | from          | CUDA            | to              | OpenCL,   |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | approach                            | proposed   | in the         | previous                | studies | [9,             | 3].          | For CPU-  |
| which allows    | the           | code     | to run      | on            | both            | multi-core      | CPUs      |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | GPU and                             | APU        | architectures, |                         | we not  | only            | calibrate    | the       |
| and GPUs.       | Additionally, |          | we          | modified      | the             | implementations |           |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | suitable                            | work unite | sizes          | for both                | PPEs,   | but             | also         | calibrate |
| of primitives,  | access        | methods  |             | and           | operators       | so              | that they |                                     |            |                |                         |         |                 |              |           |
|                 |               |          |             |               |                 |                 |           | theinterconnectbandwidthsamongPPEs. |            |                |                         |         | Third,developer |              |           |
| can be          | customized    | to       | different   | work          | unit            | sizes.          | Note,     |                                     |            |                |                         |         |                 |              |           |
needstooverridetheinterfacesdefinedinthecostmodeland
GPUQPadoptsfixedandfine-grainedworkunitsizetotake
|           |            |             |     |     |          |     |     | theexecutionengine. |     | Basedonthecostfunctions,OmniDB |     |     |     |     |     |
| --------- | ---------- | ----------- | --- | --- | -------- | --- | --- | ------------------- | --- | ------------------------------ | --- | --- | --- | --- | --- |
| advantage | of massive | parallelism |     | of  | the GPU. |     |     |                     |     |                                |     |     |     |     |     |
canchoosethemostefficientprimitives,accessmethodsand
| Second,                           | we have | integrated |               | more | recent             | architecture- |          |           |               |        |               |     |         |     |        |
| --------------------------------- | ------- | ---------- | ------------- | ---- | ------------------ | ------------- | -------- | --------- | ------------- | ------ | ------------- | --- | ------- | --- | ------ |
|                                   |         |            |               |      |                    |               |          | operators | for the       | target | architecture. |     |         |     |        |
| aware techniques                  |         | into       | the execution |      | engine,            | for           | example, |           |               |        |               |     |         |     |        |
|                                   |         |            |               |      |                    |               |          | Put it    | all together. |        | We briefly    |     | present | how | OmniDB |
| treeindex[13],sortandhashing[12]. |         |            |               |      | Thankstothekernel- |               |          |           |               |        |               |     |         |     |        |
adaptstothefourdifferentarchitecturesintheexperiments.
| adapter  | based design,   |     | we implement |      | those    | algorithms | into   |              |              |                |     |          |         |          |           |
| -------- | --------------- | --- | ------------ | ---- | -------- | ---------- | ------ | ------------ | ------------ | -------------- | --- | -------- | ------- | -------- | --------- |
|          |                 |     |              |      |          |            |        | Homogeneous  |              | architectures. |     | We view  | the     | CPU-only | or        |
| one code | base (qKernel), |     | rather       | than | multiple | code       | bases. |              |              |                |     |          |         |          |           |
|          |                 |     |              |      |          |            |        | the GPU-only | architecture |                | as  | one PPE, | because |          | the data- |
Third,wehaveimplementedanewschedulingalgorithm.
|     |     |     |     |     |     |     |     | parallel design | of  | the execution |     | engine | can | take advantage |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ------------- | --- | ------ | --- | -------------- | --- |
GPUQPcurrentlyusesFIFO,whichissuboptimalforCPU-
|                                            |             |                                  |     |                           |           |              |         | of the parallelism. |          | Our            | scheduling |                     | algorithm   | degrades | to        |
| ------------------------------------------ | ----------- | -------------------------------- | --- | ------------------------- | --------- | ------------ | ------- | ------------------- | -------- | -------------- | ---------- | ------------------- | ----------- | -------- | --------- |
| GPUandAPUarchitectures.                    |             |                                  |     | Thenewschedulingalgorithm |           |              |         |                     |          |                |            |                     |             |          |           |
|                                            |             |                                  |     |                           |           |              |         | FIFO. For           | the same | query          | processing |                     | operations, |          | the CPU   |
| considers                                  | multiple    | PPEs                             | and | the capabilities          |           | of PPEs.     |         |                     |          |                |            |                     |             |          |           |
|                                            |             |                                  |     |                           |           |              |         | mostly has          | a larger | work           | unit       | size in             | numbers     | of       | tuples to |
| Scheduler.                                 |             | The scheduling                   |     | algorithm                 |           | design       | has two |                     |          |                |            |                     |             |          |           |
|                                            |             |                                  |     |                           |           |              |         | process than        | the      | GPU,           | because    | of the              | more        | powerful | CPU       |
| majorconsiderations.                       |             | First,itbalancestheworkloadamong |     |                           |           |              |         |                     |          |                |            |                     |             |          |           |
|                                            |             |                                  |     |                           |           |              |         | core design         | and      | larger         | cache.     |                     |             |          |           |
| differentPPEs(i.e.,avoidingthecontention). |             |                                  |     |                           |           | Second,query |         |                     |          |                |            |                     |             |          |           |
|                                            |             |                                  |     |                           |           |              |         | Heterogeneous       |          | architectures. |            | WeviewtheCPU-GPUand |             |          |           |
| processing                                 | performance |                                  | may | vary on                   | different | PPEs,        | and     |                     |          |                |            |                     |             |          |           |
1376

the APU architecture as two PPEs with different intercon- the L2 cache misses of hash joins by 20% on the NVIDIA
nectbandwidths,whichequalthePCI-ebandwidthandthe GPU, in comparison with simple hash joins.
| memory | bandwidth, | respectively. |     | The | throughput | calcula- |     |     |     |     |     |     |     |     |
| ------ | ---------- | ------------- | --- | --- | ---------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
tionintheschedulertakesthatbandwidthinformationinto 5. SUMMARY
| account.       | Also,          | adapters | may          | choose | work unit      | definitions |     |                  |              |      |             |         |            |     |
| -------------- | -------------- | -------- | ------------ | ------ | -------------- | ----------- | --- | ---------------- | ------------ | ---- | ----------- | ------- | ---------- | --- |
|                |                |          |              |        |                |             |     | OmniDB           | demonstrates | that | portability | and     | efficiency | of  |
| with different | granularities: |          | query-level, |        | operator-level |             | and |                  |              |      |             |         |            |     |
|                |                |          |              |        |                |             |     | query processing | on different |      | parallel    | CPU/GPU | architec-  |     |
OpenCL-kernel-level,wheretheschedulingdecisionismade
|     |     |     |     |     |     |     |     | tures can | be elegantly | supported |     | with a kernel-adapter |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | --------- | --- | --------------------- | --- | --- |
perquery,peroperatorandperOpenCLkernel,respective-
|                  |           |             |              |             |                |               |     | approach.  | As the heterogeneity |            | of            | parallel           | architectures, |     |
| ---------------- | --------- | ----------- | ------------ | ----------- | -------------- | ------------- | --- | ---------- | -------------------- | ---------- | ------------- | ------------------ | -------------- | --- |
| ly. Query-level  |           | scheduling  | has          | the minimum |                | data transfer |     |            |                      |            |               |                    |                |     |
|                  |           |             |              |             |                |               |     | we believe | that a portable      |            | and efficient | query              | processor      |     |
| between          | the CPU   | and         | the GPU,     | whereas     | OpenCL-kernel- |               |     |            |                      |            |               |                    |                |     |
|                  |           |             |              |             |                |               |     | becomes    | more and more        | desirable. |               | This demonstration |                |     |
| level scheduling |           | is the most | fine-grained |             | to exploit     | different     |     |            |                      |            |               |                    |                |     |
|                  |           |             |              |             |                |               |     | presents   | our initial efforts  | in         | designing     | and                | implementing   |     |
| capabilities     | of the    | CPU         | and the      | GPU.        |                |               |     |            |                      |            |               |                    |                |     |
|                  |           |             |              |             |                |               |     | OmniDB.    | More work            | should     | be done       | along              | the direction. |     |
| There            | are other | system      | components   |             | in             | our demo      | to  |            |                      |            |               |                    |                |     |
First,weplantoevaluateoursystemonotherarchitectures
helpusersunderstandthedetailedperformancebehaviorof
|     |     |     |     |     |     |     |     | such as | Intel Xeon | Phi. Second, |     | we plan | to evaluate |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---------- | ------------ | --- | ------- | ----------- | --- |
OmniDB.Weleveragevendorspecificprofilerfromhardware
|     |     |     |     |     |     |     |     | OmniDB | in comparison | with | existing | architecture-aware |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ------------- | ---- | -------- | ------------------ | --- | --- |
vendors(e.g.,IntelVTune,AMDCodeAnalystPerformance
|          |            |     |         |      |            |     |     | query processors   | like | GPUQP | and StagedDB. |     |     |     |
| -------- | ---------- | --- | ------- | ---- | ---------- | --- | --- | ------------------ | ---- | ----- | ------------- | --- | --- | --- |
| Analyzer | and NVIDIA |     | command | line | profiler). |     |     |                    |      |       |               |     |     |     |
|          |            |     |         |      |            |     |     | 6. ACKNOWLEDGEMENT |      |       |               |     |     |     |
4. DEMOPLAN
|               |         |     |      |       |                 |     |     | The authors                                    | would              | like to   | thank     | anonymous    | reviewers |      |
| ------------- | ------- | --- | ---- | ----- | --------------- | --- | --- | ---------------------------------------------- | ------------------ | --------- | --------- | ------------ | --------- | ---- |
| We briefly    | present | the | demo | setup | and objectives. |     |     |                                                |                    |           |           |              |           |      |
|               |         |     |      |       |                 |     |     | for their                                      | valuable comments. |           | This work | is supported |           | by a |
| 4.1 DemoSetup |         |     |      |       |                 |     |     | MoEAcRFTier2grant(MOE2012-T2-2-067)inSingapore |                    |           |           |              |           |      |
|               |         |     |      |       |                 |     |     | and an                                         | Inter-disciplinary | Strategic |           | Competitive  | Fund      | of   |
WeevaluateOmniDBonfourtargetarchitectures,name-
ly, CPU-only, GPU-only, (classic) CPU-GPU and AMD Nanyang Technological University for “C3: Cloud-Assisted
|         |          |        |        |        |     |       |        | Green Computing | at  | NTU Campus”. |     |     |     |     |
| ------- | -------- | ------ | ------ | ------ | --- | ----- | ------ | --------------- | --- | ------------ | --- | --- | --- | --- |
| APU. We | will use | remote | access | during | the | demo. | Due to |                 |     |              |     |     |     |     |
spacelimitations,wepresentthedetaileddemosetupinthe
|     |     |     |     |     |     |     |     | 7. REFERENCES |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
project site,
|     |     |     |     |     |     |     |     | [1] A.Ailamaki,N.K.Govindaraju,S.Harizopoulos,and |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- |
http://code.google.com/p/omnidb-paralleldbonapu/.
D.Manocha.Queryco-processingoncommodityprocessors.In
| 4.2 DemonstrationObjectives |     |     |     |     |     |     |     | VLDB(tutorial),2006.                                 |     |     |     |     |     |     |
| --------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|                             |     |     |     |     |     |     |     | [2] S.Blanas,Y.Li,andJ.M.Patel.Designandevaluationof |     |     |     |     |     |     |
Portability. Portability is an important feature of mainmemoryhashjoinalgorithmsformulti-corecpus.In
OmniDB. We demonstrate system internals of OmniDB in SIGMOD,pages37–48,2011.
|              |        |            |      |            |      |               |     | [3] P.A.Boncz,S.Manegold,andM.L.Kersten.Database |     |     |     |     |               |     |
| ------------ | ------ | ---------- | ---- | ---------- | ---- | ------------- | --- | ------------------------------------------------ | --- | --- | --- | --- | ------------- | --- |
| two ways.    | First, | we will    | make | a poster   | with | more detailed |     |                                                  |     |     |     |     |               |     |
|              |        |            |      |            |      |               |     | architectureoptimizedforthenewbottleneck:        |     |     |     |     | Memoryaccess. |     |
| descriptions | on     | the system |      | internals, | and  | also add      | one |                                                  |     |     |     |     |               |     |
InVLDB,pages54–65,1999.
exampletoshowtheworkflowofevaluatingaquery. Second, [4] S.Chen,A.Ailamaki,P.B.Gibbons,andT.C.Mowry.
Improvinghashjoinperformancethroughprefetching.ACM
we will make OmniDB open-sourced, and will briefly go Trans.DatabaseSyst.,2007.
through our code base to the audience. [5] M.Daga,A.M.Aji,andW.-c.Feng.Ontheefficacyofafused
Efficiency. We shall demonstrate the efficiency of Om- cpu+gpuprocessor(orapu)forparallelcomputing.In
SAAHPC,pages141–149,2011.
| niDB in | three aspects. |          |     |               |     |          |     |                                                 |     |     |     |     |     |     |
| ------- | -------------- | -------- | --- | ------------- | --- | -------- | --- | ----------------------------------------------- | --- | --- | --- | --- | --- | --- |
|         |                |          |     |               |     |          |     | [6] K.FatahalianandM.Houston.Acloserlookatgpus. |     |     |     |     |     |     |
| First,  | we shall       | evaluate | the | effectiveness | of  | adapters | on  |                                                 |     |     |     |     |     |     |
Commun.ACM,pages50–57,2008.
| different | architectures. |     | As an | example, | we show | the | perfor- |                                                        |     |     |     |     |     |     |
| --------- | -------------- | --- | ----- | -------- | ------- | --- | ------- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- |
|           |                |     |       |          |         |     |         | [7] S.HarizopoulosandA.Ailamaki.Acaseforstageddatabase |     |     |     |     |     |     |
mance impact of different work unit sizes on homogeneous systems.InCIDR,2003.
architectures: CPU-onlyandGPU-only. Overall,asuitable [8] B.He,H.P.Huynh,andR.Mong.Gpgpuforreal-timedata
work unit size improves the query processing performance. analytics.InIEEEICPADS,pages945–946,2012.
|           |       |       |          |     |      |           |     | [9] B.He,M.Lu,K.Yang,R.Fang,N.K.Govindaraju,Q.Luo, |     |     |     |     |     |     |
| --------- | ----- | ----- | -------- | --- | ---- | --------- | --- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| Take hash | joins | as an | example. | The | hash | join with | the |                                                    |     |     |     |     |     |     |
andP.V.Sander.Relationalquerycoprocessingongraphics
| suitable | work unit | size | is up | to 28%, | 24% and | 27% | faster |     |     |     |     |     |     |     |
| -------- | --------- | ---- | ----- | ------- | ------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
processors.ACMTrans.DatabaseSyst.,pages21:1–21:39,
2009.
| than that | of other | work | unit sizes    | on  | the Intel | CPU, | AMD |                                                            |     |     |     |     |     |     |
| --------- | -------- | ---- | ------------- | --- | --------- | ---- | --- | ---------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|           |          |      |               |     |           |      |     | [10] J.He,M.Lu,andB.He.Revisitingco-processingforhashjoins |     |     |     |     |     |     |
| GPU and   | NVIDIA   | GPU, | respectively. |     |           |      |     |                                                            |     |     |     |     |     |     |
onthecoupledcpu-gpuarchitecture.InPVLDB,pages1–12,
| Second, | we assess | the | impact | of the | scheduling | algorithm |     | 2013. |     |     |     |     |     |     |
| ------- | --------- | --- | ------ | ------ | ---------- | --------- | --- | ----- | --- | --- | --- | --- | --- | --- |
with different work unit definitions on heterogeneous ar- [11] T.Kaldewey,G.Lohman,R.Mueller,andP.Volk.Gpujoin
chitectures. The baseline scheduling algorithm is FIFO. processingrevisited.InDaMoN,pages55–62,2012.
|     |     |     |     |     |     |     |     | [12] C.Kimandetal.Sortvs.hashrevisited: |     |     |     | fastjoin |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------- | --- | --- | --- | -------- | --- | --- |
Ourschedulingalgorithmachievesahigherthroughputthan
implementationonmodernmulti-corecpus.Proc.VLDB
| the baseline | algorithm, |     | with | the improvement |     | of  | 8–33% |     |     |     |     |     |     |     |
| ------------ | ---------- | --- | ---- | --------------- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- |
Endow.,pages1378–1389,2009.
and 4–19% on the CPU-GPU and the APU architectures, [13] C.Kimandetal.Fast: fastarchitecturesensitivetreesearch
respectively. Among different work unit definitions on onmoderncpusandgpus.InSIGMOD,pages339–350,2010.
the specific architecture, OpenCL-kernel-level is the most [14] M.M.Lehman.Programs,lifecycles,andlawsofsoftware
evolution.InProceedingsoftheIEEE,pages1060–1076,1980.
| efficient | for APU, | and | query/operator |     | level | is the | most |                                                     |     |     |     |     |     |     |
| --------- | -------- | --- | -------------- | --- | ----- | ------ | ---- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|           |          |     |                |     |       |        |      | [15] M.M.Lehman.Lawsofsoftwareevolutionrevisited.In |     |     |     |     |     |     |
efficient on the CPU-GPU architecture. This is mainly due Proceedingsofthe5thEuropeanWorkshoponSoftware
ProcessTechnology,pages108–124,1996.
tothedifferentinterconnectsbetweentheCPUandtheGPU
|          |                    |     |     |        |         |             |     | [16] M.Stonebrakerandetal.C-store: |     |     | acolumn-orienteddbms.In |     |     |     |
| -------- | ------------------ | --- | --- | ------ | ------- | ----------- | --- | ---------------------------------- | --- | --- | ----------------------- | --- | --- | --- |
| in those | two architectures. |     | A   | GUI is | used to | dynamically |     |                                    |     |     |                         |     |     |     |
VLDB,pages553–564,2005.
visualize the workloads in different PPEs. [17] R.RamakrishnanandJ.Gehrke.DatabaseManagement
Third, we demonstrate the profiler result. For example, Systems.McGraw-Hill,3rdedition,2007.
| from NVIDIA | GPU | profiler, |     | we show | partitioning | reduces |     |     |     |     |     |     |     |     |
| ----------- | --- | --------- | --- | ------- | ------------ | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
1377