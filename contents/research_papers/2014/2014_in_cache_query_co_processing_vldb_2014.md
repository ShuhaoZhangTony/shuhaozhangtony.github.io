In-Cache Query Co-Processing on Coupled CPU-GPU
Architectures
Jiong He Shuhao Zhang Bingsheng He
NanyangTechnologicalUniversity
ABSTRACT emergingheterogeneousarchitectures,thelowspeedofPCI-
eisnolongeranissue. CoupledCPU-GPUarchitecturescall
Recently, there have been some emerging processor designs
fornewdataprocessingmechanisms. Therehavebeenstud-
that the CPU and the GPU (Graphics Processing Unit)
iesonmorecollaborativeandfine-grainedschemesforquery
are integrated in a single chip and share Last Level Cache
co-processing [19, 38] and other data processing workloads
(LLC). However, the main memory bandwidth of such cou-
(e.g., key-value stores [21] and MapReduce [7]).
pled CPU-GPU architectures can be much lower than that
Despite the effectiveness of previous studies on query co-
of a discrete GPU. As a result, current GPU query co-
processing on coupled architectures, both CPU and GPU
processingparadigmscanseverelysufferfrommemorystalls.
execute homogeneous workloads in previous studies [19, 7,
Inthispaper,weproposeanovelin-cachequeryco-processing
38, 21]. However, due to the unique architectural design of
paradigm for main memory On-Line Analytical Process-
coupled CPU-GPU architectures, such homogeneous work-
ing(OLAP)databasesoncoupledCPU-GPUarchitectures.
load distribution schemes can hinder query co-processing
Specifically,weadaptCPU-assistedprefetchingtominimize
performanceontheGPU.Ontheonehand,theGPUinthe
cachemissesinGPUqueryco-processingandCPU-assisted
coupled architecture is usually less powerful than the one
decompressiontoimprovequeryexecutionperformance. Fur-
in the discrete architecture. On the other hand, the GPU
thermore,wedevelopacostmodelguidedadaptationmech-
in the coupled architecture accesses main memory (usually
anism for distributing the workload of prefetching, decom-
DDR3), which has a much lower bandwidth than the dis-
pression, and query execution between CPU and GPU. We
crete GPU memory (usually GDDR5). These two factors
implementasystemprototypeandevaluateitontworecent
lead to severe underutilization of the GPU in the coupled
AMD APUs A8 and A10. The experimental results show
architecture because of memory stalls. The inherent GPU
that1)in-cachequeryco-processingcaneffectivelyimprove
design of Single Program Multiple Data (SPMD) execution
the performance of the state-of-the-art GPU co-processing
modelandthein-ordernatureofGPUcoresmaketheGPU
paradigm by up to 30% and 33% on A8 and A10, respec-
inthecoupledarchitecturemoresensitivetomemorystalls.
tively,and2)ourworkloaddistributionadaptionmechanism
In this paper, we investigate how to reduce memory stalls
can significantly improve the query performance by up to
sufferedbytheGPUandfurtherimprovetheperformanceof
36% and 40% on A8 and A10, respectively.
queryco-processingonthecoupledCPU-GPUarchitecture.
OntherecentcoupledCPU-GPUarchitectures,thecom-
1. INTRODUCTION
putational capability of the GPU is still much higher than
Query co-processing paradigm on GPUs has been an ef- that of the CPU. For example, the GPU can have 5 and
fective means to improve the performance of main memory 6 times higher Giga Floating Point Operations per Second
databases for OLAP (e.g., [15, 17, 22, 28, 25, 13, 30, 29]). (GFLOPS) than the CPU on AMD APUs A8 and A10, re-
Currently,mostsystemsarebasedondiscreteCPU-GPUar- spectively. The superb raw computational capability of the
chitectures,wheretheCPUandtheGPUareconnectedvia GPU leads to a very similar speedup if the input data is
therelativelyslowPCI-ebus. Recently,someemergingpro- in cache. However, due to the above-mentioned impact of
cessordesignsthattheCPUandtheGPUareintegratedin memory stalls on the GPU co-processing, the speedup is as
asinglechipandshareLLC.Forexample,theAMDAccel- lowas2whenthedatacannotfitintocache(moredetailed
erated Processing Unit (APU) architecture integrates CPU resultscanbefoundinSection3.1). Thus,thenaturalques-
andGPUinasinglechip,andIntelreleasedtheirlatestgen- tion is whether we can and how to ensure that the working
eration Ivy Bridge processor in late April 2012. On those set of query co-processing can fit in the cache as much as
possible to fully unleash the GPU power.
Inthispaper,weproposeanovelin-cachequeryco-processing
This work is licensed under the Creative Commons Attribution-
paradigmformainmemorydatabasesoncoupledCPU-GPU
NonCommercial-NoDerivs3.0UnportedLicense.Toviewacopyofthisli-
cense,visithttp://creativecommons.org/licenses/by-nc-nd/3.0/.Obtainper- architectures. Specifically,weadaptCPU-assistedprefetch-
mission prior to any use beyond those covered by the license. Contact ing to minimize the cache misses from the GPU and CPU-
copyright holder by emailing info@vldb.org. Articles from this volume assisteddecompressionschemestoimprovequeryexecution
wereinvitedtopresenttheirresultsatthe41stInternationalConferenceon performance. No matter whether or not the decompres-
VeryLargeDataBases,August31st-September4th2015,KohalaCoast,
sion is involved, our scheme ensures that the input data
Hawaii.
totheGPUqueryco-processinghasbeenprefetched. Thus,
ProceedingsoftheVLDBEndowment,Vol.8,No.4
Copyright2014VLDBEndowment2150-8097/14/12.
329

the GPU executions are mostly on in-cache data, without Table 1: Configuration of AMD Fusion A10-7850K.
| suffering | from | memory | stalls. | Specifically, | unlike | homoge- |     |     |     |     |     |     |     |
| --------- | ---- | ------ | ------- | ------------- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- |
neousworkloaddistributionsinpreviousqueryco-processing A83870K A107850K Radeon
R9270
paradigms [19, 7], our workload distribution is heteroge- Coretype CPU GPU CPU GPU GPU
neous: a CPU core can now perform memory prefetching, #Cores 4 400 4 512 1280
decompression, and even query processing, and the GPU Corefrequency(MHz) 3000 600 4000 720 925
|         |         |               |       |                   |                   |           | Sharedmemory(GB) |       |     | 0.5  | 32(whole) |      | N/A   |
| ------- | ------- | ------------- | ----- | ----------------- | ----------------- | --------- | ---------------- | ----- | --- | ---- | --------- | ---- | ----- |
| can now | perform | decompression |       | and               | query processing. | We        |                  |       |     |      |           |      |       |
|         |         |               |       |                   |                   |           | Peak memory      | band- | 5.6 | 24.5 | 7.8       | 28.9 | 179.2 |
| further | develop | a cost        | model | guided adaptation |                   | mechanism | width(GB/s)      |       |     |      |           |      |       |
fordistributingtheworkloadofprefetching,decompression, Cachesize(MB) 4 4 N/A
andqueryevaluationsbetweentheCPUandtheGPU.Fine-
| grainedresourceallocationisachievedbydevicefission |     |     |     |     |     | that |     |     |     |     |     |     |     |
| -------------------------------------------------- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
divides the CPU or the GPU into smaller scheduling units CPU GPU
(eitherbyOpenCLruntimeoroursoftware-basedapproaches).
| Weimplementasystemprototypeandevaluateitontwo |      |          |       |               |              |                |     |     | L2 Cache |     |     |     |     |
| --------------------------------------------- | ---- | -------- | ----- | ------------- | ------------ | -------------- | --- | --- | -------- | --- | --- | --- | --- |
| recent AMD                                    | APUs | A8       | and   | A10. The      | experimental | results        |     |     |          |     |     |     |     |
| show that                                     | 1)   | in-cache | query | co-processing | is           | able to effec- |     |     |          |     |     |     |     |
tivelyimprovetheperformanceofGPUqueryco-processing Main Memory
byupto30%and33%onA8andA10,respectively,and2)
our cost model can effectively predict a suitable workload Figure 1: Overview of the coupled CPU-GPU architecture.
distribution,andourdistributionadaptionmechanismssig-
| nificantly    | improve                  | the     | query          | performance  | by 36-40%.        |             |                                               |          |         |         |               |     |          |
| ------------- | ------------------------ | ------- | -------------- | ------------ | ----------------- | ----------- | --------------------------------------------- | -------- | ------- | ------- | ------------- | --- | -------- |
|               |                          |         |                |              |                   |             | mainlyforimprovingthegraphicsperformance[33]. |          |         |         |               |     | Inthis   |
| The remainder |                          | of this | paper          | is organized | as                | follows. In |                                               |          |         |         |               |     |          |
|               |                          |         |                |              |                   |             | paper, we                                     | focus on | coupled | CPU-GPU | architectures |     | using    |
| Section2,     | weintroducethebackground |         |                |              | and preliminaryon |             |                                               |          |         |         |               |     |          |
|               |                          |         |                |              |                   |             | DDR3 as main                                  | memory,  | which   | is      | more common   | in  | the cur- |
| coupled       | architectures            |         | and OpenCL.    | In           | Section           | 3, we elab- |                                               |          |         |         |               |     |          |
|               |                          |         |                |              |                   |             | rent commodity                                | market.  |         |         |               |     |          |
| orate the     | design                   | and     | implementation |              | of in-cache       | query co-   |                                               |          |         |         |               |     |          |
processing, followed by the cost model in Section 4. We 2.2 UnifiedProgrammingInterface
| present     | the experimental |            | results | in Section   | 5.  | We review  |                                                |     |          |          |     |           |        |
| ----------- | ---------------- | ---------- | ------- | ------------ | --- | ---------- | ---------------------------------------------- | --- | -------- | -------- | --- | --------- | ------ |
|             |                  |            |         |              |     |            | Open Computing                                 |     | Language | (OpenCL) | is  | a unified | pro-   |
| the related | work             | in Section | 6       | and conclude | in  | Section 7. |                                                |     |          |          |     |           |        |
|             |                  |            |         |              |     |            | gramminglanguageforheterogeneousarchitectures. |     |          |          |     |           | OpenCL |
programscanbecodedonceandrunonanyOpenCL-compatible
2. PRELIMINARIESANDBACKGROUND
devices. Existingstudies[11,34]haveshownthatprograms
This section introduces the background and preliminary in OpenCL can achieve very close performance to those
on coupled architectures and OpenCL. in platform-specific languages such as CUDA for NVIDIA
|     |     |     |     |     |     |     | GPUs and | OpenMP | for | CPUs. | For example, | Fang | et al. |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------ | --- | ----- | ------------ | ---- | ------ |
2.1 HeterogeneousSystemArchitectures
[11]demonstratethattheCUDA-basedimplementationsare
Heterogeneous architectural designs are emerging in the at most 30% better than OpenCL-based implementations
fieldofcomputerarchitecture. Researchershavebeenpropos- on NVIDIA GPUs. On CPUs, OpenCL even outperforms
ing different heterogeneous designs in the modern/future OpenMP in many scenarios [34].
processors, which attempt to improve the performance, re- All OpenCL-compatible devices are mapped to the same
duce the energy consumption or both [2, 26]. This paper logical architecture, namely compute device. Each compute
focuses on the coupled CPU-GPU architecture. device consists of a number of Compute Units (CUs). Fur-
The design of the coupled architecture is illustrated in thermore, each CU contains multiple processing elements
Figure1. BoththeCPUandtheGPUareintegratedinthe runningintheSPMDstyle. OntheAPU,theCPUandthe
same chip which removes the PCI-e bus. Besides, the CPU GPU are programmed as two compute devices. Each CPU
andtheGPUsharetheL2cacheinthisstudy,whichenables coreismappedasoneCU,andeachGPUCUisequivalent
thepossibilityofdatareusebetweenthem. IncurrentAMD to one multi-processor. The piece of code executed by a
APUs, all data accesses should go through a unified north specific device is called a kernel. A kernel employs multiple
bridge (UNB) that connects the CPU, the GPU, and the workgroups fortheexecution,andeachworkgroupcontains
mainmemory. Table1presentsthehardwareconfigurations anumberofwork items. AworkgroupismappedtoaCU,
oftwogenerationsofAMDAPUs(i.e.,A8-3870KandA10- and multiple work items are executed concurrently on the
7850K).Forcomparison,wealsolisttheconfigurationofthe CU. The execution of a work group on the target architec-
latest Radeon R9 270 as an example of discrete GPU. The tureisvendorspecific. Forinstance,AMDusuallyexecutes
GPUinthecoupledarchitecturehasamuchsmallernumber 64 work items in a wavefront and NVIDIA with 32 work
of cores at lower clock frequency because of chip area con- items in a warp. In this paper, we use AMD’s terminology.
straints. In the previous AMD APUs like A8 3870K, mem- All the work items in the same wavefront run in the Single
orysharingisachievedbyarelativelysmallzero-copybuffer. Instruction Multiple Data (SIMD) manner.
ThelatestKaveriAPUslikeA10-7850KsupportSharedVir- Device fission is a new feature of OpenCL to support di-
tual Memory (SVM) which extends memory sharing to the viding a single device into multiple subdevices. With this
entire main memory space [23]. The memory bandwidth feature,twodifferenttaskscanrunonthesamedevicecon-
is relatively low (29.8GB/s), because DDR3 is specially de- currently. Thus, hardware resources on the same device
signed for memory latency sensitive applications. For dis- can be shared among multiple tasks to achieve fine-grained
creteGPUs,GDDR5canprovideupto264GB/sbandwidth. resource allocation. Currently, device fission is fully sup-
As a matter of fact, a customized architecture design im- portedonmostOpenCL-compatibleCPUdevices. However,
plemented in PlayStation 4 uses GDDR5 as main memory, OpenCL does not support device fission on GPU devices.
330

| 3   |     | in-cache | out-of-cache |     |     |     |                                |                    |     |     |     |     |     |     |
| --- | --- | -------- | ------------ | --- | --- | --- | ------------------------------ | ------------------ | --- | --- | --- | --- | --- | --- |
|     |     |          |              |     |     |     | GPU (A8 3870K) GPU (A10 7850K) | GPU(Radeon R9 270) |     |     | 35  |     |     |     |
| 2.5 |     |          |              |     |     | 50% |                                |                    |     |     |     |     |     |     |
)s/BG( tuphguorhT emit dellats fo egatnecreP 45% )sm( emit despalE 30
| 2   |     |     |     |     |     | 40% |     |     |     |     | 25  |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
35%
|     |     |     |     |     |     | 30% |     |     |     |     | 20  |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
1.5
|     |     |     |     |     |     | 25% |     |     |     |     | 15  |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1   |     |     |     |     |     | 20% |     |     |     |     |     |     |     |     |
|     |     |     |     |     |     | 15% |     |     |     |     | 10  |     |     |     |
| 0.5 |     |     |     |     |     | 10% |     |     |     |     |     |     |     |     |
|     |     |     |     |     |     | 5%  |     |     |     |     | 5   |     |     |     |
| 0   |     |     |     |     |     | 0%  |     |     |     |     | 0   |     |     |     |
CPU(A8) GPU(A8) CPU(A10) GPU(A10) Fetch Write 0 1 8 16 32 48 64
Processor types Memory access type Number of delayed work-items in each wavefront
(a) In-cache processing benefit (b) Memory stalls on GPUs (c) Wavefront efficiency
|     |     |     |     | Figure | 2: Motivations |     | for in-cache | query co-processing |     | on  | APUs. |     |     |     |
| --- | --- | --- | --- | ------ | -------------- | --- | ------------ | ------------------- | --- | --- | ----- | --- | --- | --- |
Thus,wedevelopasoftware-basedapproachtoemulatede- dataaccessesfromthemainmemoryfortheGPUinamore
vice fission on the GPU (Subsection 3.2.3). aggressive manner.
|     |     |     |     |     |     |     |     | Observation |     | 3: The | SPMD execution |     | model | and in-order |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------ | -------------- | --- | ----- | ------------ |
3. DESIGNANDIMPLEMENTATION
|         |          |     |               |     |                |     |            | core design   | of the       | GPU | can severely | degrade    | the | GPU query    |
| ------- | -------- | --- | ------------- | --- | -------------- | --- | ---------- | ------------- | ------------ | --- | ------------ | ---------- | --- | ------------ |
|         |          |     |               |     |                |     |            | co-processing | performance. |     | All          | work items | in  | a work group |
| In this | section, | we  | first present |     | the motivation |     | for devel- |               |              |     |              |            |     |              |
aregroupedandexecutedinawavefrontinalock-stepfash-
| oping the | in-cache | query | co-processing |     |     | paradigm. | We ex- |     |     |     |     |     |     |     |
| --------- | -------- | ----- | ------------- | --- | --- | --------- | ------ | --- | --- | --- | --- | --- | --- | --- |
ionontheGPU.Evenifonlyoneworkitemisdelayedbya
perimentallyevaluatethememoryperformanceoftheGPU
|                     |     |     |                              |     |     |     |     | memory | access, | the entire | work | group | is delayed. | Figure 2c |
| ------------------- | --- | --- | ---------------------------- | --- | --- | --- | --- | ------ | ------- | ---------- | ---- | ----- | ----------- | --------- |
| ontworecentAMDAPUs. |     |     | Thedetailedexperimentalsetup |     |     |     |     |        |         |            |      |       |             |           |
showstheperformanceofatablescanwithrandomaccesses
| canbefoundinSection5. |     |     | Basically,weconsiderthefollow- |     |     |     |     |     |     |     |     |     |     |     |
| --------------------- | --- | --- | ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ontheGPUwhenthenumberofworkitemsthatisdelayed
| ing scenario:          | all | the relations |     | and                          | indexes | of databases | are |           |       |        |            |        |        |              |
| ---------------------- | --- | ------------- | --- | ---------------------------- | ------- | ------------ | --- | --------- | ----- | ------ | ---------- | ------ | ------ | ------------ |
|                        |     |               |     |                              |         |              |     | due to L2 | cache | miss   | increases  | from 0 | to 64. | 0 means all  |
| storedinthemainmemory. |     |               |     | Asthepreviousstudies[14,15], |         |              |     |           |       |        |            |        |        |              |
|                        |     |               |     |                              |         |              |     | the input | data  | are in | the cache, | and 64 | means  | all the work |
queries(mainlyOLAPqueries)canbeexecutedontheCPU
|                           |     |     |     |                          |     |     |     | items in | a work | group | have cache | misses. | When | no work |
| ------------------------- | --- | --- | --- | ------------------------ | --- | --- | --- | -------- | ------ | ----- | ---------- | ------- | ---- | ------- |
| ortheGPUinpartorentirely. |     |     |     | Weaimatimprovingtheeffi- |     |     |     |          |        |       |            |         |      |         |
ciencyofqueryco-processingofasinglequeryonthecoupled item is delayed, the elapsed time is quite short. However,
architecture,asthepreviousstudiesonqueryco-processing. the performance degrades sharply as long as delayed work
items exist.
| We conduct | the | motivating |     | experiments |     | with the | basic op- |     |     |     |     |     |     |     |
| ---------- | --- | ---------- | --- | ----------- | --- | -------- | --------- | --- | --- | --- | --- | --- | --- | --- |
Theseobservationschallengeexistingqueryco-processing
| erations | in databases |     | running | on  | the two | APUs. | On both |            |                                               |     |     |     |     |     |
| -------- | ------------ | --- | ------- | --- | ------- | ----- | ------- | ---------- | --------------------------------------------- | --- | --- | --- | --- | --- |
|          |              |     |         |     |         |       |         | paradigms. | Thestate-of-the-artqueryco-processingparadigm |     |     |     |     |     |
platforms,wehavemadeanumberofcommonobservations,
[19]aswellasothersimilardataco-processingparadigms[7,
whichmotivatein-cachequeryco-processingonthecoupled
21]oncoupledCPU-GPUarchitecturesfailtocapturethose
| architecture. | Next, | we  | present | the | detailed | design | and im- |           |               |     |              |         |        |         |
| ------------- | ----- | --- | ------- | --- | -------- | ------ | ------- | --------- | ------------- | --- | ------------ | ------- | ------ | ------- |
|               |       |     |         |     |          |        |         | features. | Particularly, |     | all previous | studies | assign | homoge- |
plementationofourproposedqueryco-processingparadigm.
|           |         |            |     |          |     |            |         | neous workloads |       | to the | CPU         | and the  | GPU.        | From these  |
| --------- | ------- | ---------- | --- | -------- | --- | ---------- | ------- | --------------- | ----- | ------ | ----------- | -------- | ----------- | ----------- |
| The cost  | model   | of guiding | the | workload |     | adaptation | is pre- |                 |       |        |             |          |             |             |
|           |         |            |     |          |     |            |         | observations,   | the   | GPU    | is severely | degraded |             | by the mem- |
| sented in | Section | 4.         |     |          |     |            |         |                 |       |        |             |          |             |             |
|           |         |            |     |          |     |            |         | ory stalls,     | which | are    | usually a   | major    | performance | factor      |
3.1 Motivations for databases [27, 19]. Homogeneous workload distribution
stillcausesexcessivememorystallsontheGPU,despitethe
| Our design | of  | in-cache | query | co-processing |     | is  | motivated |     |     |     |     |     |     |     |
| ---------- | --- | -------- | ----- | ------------- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
fine-grainedandcollaborativeimprovementsintheprevious
| by the following |         | observations. |          |            |        |             |           |                      |        |     |                                 |         |      |             |
| ---------------- | ------- | ------------- | -------- | ---------- | ------ | ----------- | --------- | -------------------- | ------ | --- | ------------------------------- | ------- | ---- | ----------- |
|                  |         |               |          |            |        |             |           | studies[19,38,21,7]. |        |     | Theperformancedegradationcaused |         |      |             |
| Observation      |         | 1: The        | in-cache | processing |        | performance | of        |                      |        |     |                                 |         |      |             |
|                  |         |               |          |            |        |             |           | by memory            | stalls | on  | the GPU                         | is much | more | severe than |
| the GPU          | is much | higher        | than     | that       | of the | CPU.        | Figure 2a |                      |        |     |                                 |         |      |             |
thatontheCPU.Anidealqueryco-processingperformance
demonstratesthebenefitsgainedfromthecachefortheCPU
shouldexploittheadvantagesoftheGPU(i.e.,muchhigher
| and the    | GPU.    | The experiment |            | measures |       | the throughput | of         |          |                 |     |              |     |         |              |
| ---------- | ------- | -------------- | ---------- | -------- | ----- | -------------- | ---------- | -------- | --------------- | --- | ------------ | --- | ------- | ------------ |
|            |         |                |            |          |       |                |            | in-cache | data processing |     | performance) |     | as much | as possible. |
| performing | many    | simple         | sequential |          | scans | on the         | same rela- |          |                 |     |              |     |         |              |
| tion (we   | run 100 | scans,         | but        | exclude  | the   | impact         | of compul- |          |                 |     |              |     |         |              |
sorymissesinthefirstscan). Therelationisinitiallystored 3.2 DesignandImplementation
inthememory. Thecasesfor“in-cache”and“out-of-cache” Wedesignanddevelopin-cachequeryco-processingbyex-
represent the tables with sizes of 1MB and 16MB, respec- tending our OpenCL-based query processor OmniDB [38].
tively. In comparison with the CPU, the GPU has a much The system is designed to support OLAP and focuses on
sharper jump after the relation size exceeds the L2 cache read-only queries. It does not support on-line updates. In-
size. Therefore, the GPU can gain more performance bene- stead, it rebuilds a relation for batch updates. Figure 3
fits from the cache than the CPU, if the data resides in the shows the architectural overview, specifically designed for
| L2 cache. |     |     |     |     |     |     |     | coupledCPU-GPUarchitectures(thisstudyfocusesonAMD |     |     |     |     |     |     |
| --------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- |
Observation2: ThememorybandwidthoftheGPUinthe APUs). Queries are processed by the query plan generator
coupled architecture is much lower than that of the GPU in using a Selinger-style optimizer [31]. The APU-aware cost
the discrete architecture. Figure 2b shows the percentage modelcapturesthefeaturesofthecoupledarchitectureand
of memory stalled time obtained from the AMD CodeXL produces the predicted workload assignment plan and exe-
profiler when the table scan runs on the coupled GPU and cutiontimeforthequery. Weabstractthreecommonfunc-
the discrete GPU in Table 1. In the coupled system, the tional modules in the in-cache query processing paradigm:
memory bandwidth is more limited and more memory ac- prefetching (P), decompression (D, optional), and the ac-
cesses are stalled. The GPU in the coupled architecture is tual query execution (E). Each CU can work on any unit
more memory-bound than that in the discrete architecture. of P/D/E. These functional modules are scheduled by the
This result inspires us to find a way to reduce the size of workload scheduler to available CUs. Our in-cache query
331

the state-of-the-art hash join [19]. Each phase of the hash
APU-aware
cost model join (partition, build, probe) is divided into a number of
steps. In the following, we present more implementation
configuration
details of each component.
Query Workload
Query P/D/E
plan generator scheduler 3.2.1 Prefetching
Figure 3: An overview of the system architecture. Previous studies [8, 39] have demonstrated the effective-
nessofmemoryprefetchinginhidingthememorystallwith
P E P D E usefulcomputationindatabases. Inthecontextofin-cache
query co-processing on the coupled architecture, we revisit
the impact of prefetching with special consideration on our
four execution configurations.
CPU CUs GPU CUs CPU CUs GPU CUs
Our prefetching structure is based on prefetching tech-
(a) PE (b) cPDE-c
nique proposed by Zhou et al. [39] and is adapted to mas-
sively parallel architecture like GPUs. The work-ahead set
P D E P D E (WAS)structureisusedtotemporarilystoretheprefetched
data. There are many threads working concurrently on the
GPUandtheycanissuemanymemoryaccessesatthesame
CPU CUs GPU CUs CPU CUs GPU CUs time. Thus, we insert memory accesses into WAS in a
batch manner. When decompression is necessary, we use
(c) cPDE-b (d) cPDE-g
two work-ahead sets to form an execution pipeline of two
Figure 4: Four optimized execution configurations.
data producer-consumer pairs: one is used to prefetch the
datafromthecompressedinputfordecompression,andthe
co-processingparadigmcanbeapplicabletodatabaseswith other one is to store the decompressed data as input to the
or without compression [12]. If the data is compressed, de- query executions. Another important issue is that a proper
compression may be required before query executions. If size of WAS may contribute to the overall performance. If
not, data can be processed by query executions directly. thesizeistoosmall,thehelperthreadmaynothaveenough
Prefetching is exploited to hide the memory latency inside timetoloadtherequestedcachelines. Ifthesizeistoolarge,
database operators, inspired by previous studies [8, 39]. thehelperthreadmayevictoutthosedatathatmaybestill
Dependingonhowtoassignthefunctionalmodulestoall useful. Ideally, it should be smaller than the cache capac-
available CUs, we have four different execution configura- ity. Since the main thread may have other cache-resident
tions, as depicted in Figure 4. datathatarestillbeingused,thethresholdvalueshouldbe
In Figure 4a (PE), almost all CUs on the CPU and the further lower in order to avoid conflict misses. The other
GPUareassignedtoqueryexecutions,leavingonlyoneCPU two functional modules (D and E) access the data only if
CU to do prefetching. This is suitable for scenarios when they have been prefetched. Thus, they are less unlikely to
thedataisstoredwithoutcompression,orqueryexecutions sufferfromcachemisses. Thismechanismdependsonmany
can be directly performed on compressed data. When de- factorssuchasthecompressionratioandtheassignedCUs.
compression is required, there are three possible execution We present an analytical model to address this problem in
configurations, cPDE-c, cPDE-b, and cPDE-g. We define Section 4.
the DE boundary as the dividing position between the D We adapt prefetching techniques in a more fine-grained
and E functional modules. The value of DE boundary rep- way. Operators have to be divided into steps to enable
resents the number of CUs assigned to D, shifting from the prefetching. As selection has only one step as the defini-
CPU side to the GPU side. Figure 4b represents the case tion, the step can be defined along the dimension of data.
where the DE boundary is on the CPU, while Figure 4c Specifically,weassumethenumberofworkitemsworkingon
and Figure 4d represent that the DE boundary is right on selection is NDRange. The operations on the data within
the boundary between the CPU and the GPU, and on the the range from 0 to NDRange-1 is considered as the first
GPU,respectively. Additionally,weimplementthestate-of- step. For the work item i, the data to be fetched next is at
the-art method [19] to achieve fine-grained workload distri- the position (i+NDRange). The definition of steps follows
bution when E is put across two devices. Specifically, the our previous study [19]. The next memory position to be
query execution can be divided into steps (one step is an used can be obtained from the current step.
operator in a query or more fine-grained processing in an We fix prefetching on one CPU CU in practice for two
operator). Becausequeryexecutionsareperformedonsome reasons. Firstly, a wavefront of the GPU adopts the SIMD
CPUCUsandtheentireGPUinPEandcPDE-c,eachstep execution pattern. Thus, if any work item is blocked, all
canbescheduledontotwodeviceswithdifferentamountsof otherworkitemswithinthatwavefrontneedtowaitforthe
workload to achieve balanced and optimal performance on blocked one, making GPUs inefficient in prefetching that
the two sides. involvesmanycachemisses. Secondly,sinceoneGPUCUis
Inthispaper,weusetwocommonandfundamentaldatabase a multi-processor, using one entire GPU CU on prefetching
operations as examples for illustration purposes (i.e., selec- is wasteful.
tionandhashjoin). Withoutindexes,theselectionisimple-
mented using the filter primitive with the predicate as the
3.2.2 DataCompression
filter function [15]. Hash join is a quite complex operation.
Even after various memory optimizations [19, 3], memory Databasecompressionisaneffectiveapproachtoimprov-
stalls can seriously hurt the join performance. We adopted ing query co-processing on the GPU [12]. It can increase
332

the bandwidth utilization and resolve the memory stalls of statement. Algorithm 1 depicts how to merge two ker-
the APU. nels K1 and K2 into a single kernel K. Suppose K invokes
We select typical compression algorithms introduced in NDRangeSize work items in total. A tuning parameter
previous work [12], including NS, NSV, DICT, RLE, Delta, NDRangeSize1 is used to adjust the device fission on the
Scale, and FOR. NS, NSV, DICT and RLE are the main GPU, so that NDRangeSize1 work items are launched for
compressionschemesthatcanbeusedindependently,whereas K1,and(NDRangeSize−NDRangeSize1)workitemsare
othersareauxiliaryinthesensethattheycanonlybeused launched for K2. All indices in K2 need to be updated
with the main schemes to further improve the compres- according to the dimension information. We ensure that
sion ratio. We briefly describe those compression schemes. NDRangeSize1 is an integral multiple of the work group
More implementation details can be found at the previous size(i.e.,thenumberofworkitemswithinthatworkgroup).
study [12]. NS and NSV delete the leading zeros at the Thus, no additional branch divergence is imposed on the
most significant bits in the bit representation of each ele- mergedkernel. ThistakesadvantageoftheOpenCLfeature
ment. RLE represents values in each run by a pair (value, that the workload scheduling unit is one work group in the
| run length)     | stored | in                                   | two arrays, | each | of which | can | be fur- | OpenCL | runtime. |     |     |     |     |     |     |
| --------------- | ------ | ------------------------------------ | ----------- | ---- | -------- | --- | ------- | ------ | -------- | --- | --- | --- | --- | --- | --- |
| thercompressed. |        | Forauxiliaryschemes,Deltaencodeseach |             |      |          |     |         |        |          |     |     |     |     |     |     |
value by the difference from the value at the preceding po- Algorithm 1 Software-based device fission between two
sition. The first value is stored in the catalog for decom- OpenCL kernels K1 and K2 on the GPU.
| pression. | Scale | converts | floating | point | values | into | integers |     |     |     |     |     |     |     |     |
| --------- | ----- | -------- | -------- | ----- | ------ | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
K(NDRangeSize,NDRangeSize1)
| in cases | where | the integer | format | is  | precise | enough | for the | {   |     |     |     |     |     |     |     |
| -------- | ----- | ----------- | ------ | --- | ------- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
application. FORencodeseachvalueinacolumntoanoff- /*indexrepresentsworkitemIDinK*/
set from the base value. The base value is usually selected if index<NDRangeSize1;then
ExecuteK1;
| as the smallest |     | value | of that | column. |     |     |     |     |     |     |     |     |     |     |     |
| --------------- | --- | ----- | ------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
else
We adapt the compression planner used in [12] to obtain if index<NDRangeSizethen
theoptimalcompressionplancandidates. Themajorissues /*Updatetheindextomakeitstartfrom0forK2*/
index←index−NDRangeSize1;
| aretointegratetheAPUperformanceprofileintotheplan- |                |        |             |             |     |              |           | ExecuteK2; |     |     |     |     |     |     |     |
| -------------------------------------------------- | -------------- | ------ | ----------- | ----------- | --- | ------------ | --------- | ---------- | --- | --- | --- | --- | --- | --- | --- |
| ner, and                                           | to incorporate |        | software    | prefetching |     | and          | in-cache  | }          |     |     |     |     |     |     |     |
| queryco-processingintothecostestimation.           |                |        |             |             |     | Thecostanal- |           |            |     |     |     |     |     |     |     |
| ysis is captured                                   |                | by our | cost model. |             |     |              |           |            |     |     |     |     |     |     |     |
| Though                                             | decompression  |        | can         | be avoided  |     | in cases     | with sin- |            |     |     |     |     |     |     |     |
glemaincompressionalgorithms(suchasNSandNSV),the 4. COSTMODEL
| cascaded | compression |     | plan generated |     | by  | the compression |     |     |     |     |     |     |     |     |     |
| -------- | ----------- | --- | -------------- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Choosingtheoptimalconfigurationforvarioustuningpa-
| planner                 | [12] often | necessitates |         | decompression |     | (or     | at least |                       |       |           |           |            |     |         |          |
| ----------------------- | ---------- | ------------ | ------- | ------------- | --- | ------- | -------- | --------------------- | ----- | --------- | --------- | ---------- | --- | ------- | -------- |
|                         |            |              |         |               |     |         |          | rameters              | is an | important | task,     | especially | in  | OpenCL  | that     |
| partial decompression). |            |              | To have | a thorough    |     | insight | on how   |                       |       |           |           |            |     |         |          |
|                         |            |              |         |               |     |         |          | targets heterogeneous |       |           | computing | devices.   |     | In this | section, |
theperformanceofqueryco-processingcanbeimpactedby
|     |     |     |     |     |     |     |     | we develop | a cost | model | to  | estimate | the execution |     | time of |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------ | ----- | --- | -------- | ------------- | --- | ------- |
decompression,weinvestigatebothcaseswheredecompres-
|                    |     |     |                                   |     |     |     |     | query co-processing |               | of  | the four | execution | configurations |      | on       |
| ------------------ | --- | --- | --------------------------------- | --- | --- | --- | --- | ------------------- | ------------- | --- | -------- | --------- | -------------- | ---- | -------- |
| sionisneededornot. |     |     | Thedetailedresultsareintroducedin |     |     |     |     |                     |               |     |          |           |                |      |          |
|                    |     |     |                                   |     |     |     |     | the coupled         | architecture, |     | and      | then      | use the        | cost | model to |
Section 5.
|     |     |     |     |     |     |     |     | determine | the suitable |     | values | for the | tuning | parameters | to  |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | --- | ------ | ------- | ------ | ---------- | --- |
Whendecompressionisnecessary,thedecompressionfetches
|     |     |     |     |     |     |     |     | achieve | the lowest | estimated |     | execution | time. |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---------- | --------- | --- | --------- | ----- | --- | --- |
onecompresseddatablockanddecompressesitintothere-
|               |     |                                       |     |     |     |     |     | Though     | there | has been         | plenty | of     | existing | work    | on build- |
| ------------- | --- | ------------------------------------- | --- | --- | --- | --- | --- | ---------- | ----- | ---------------- | ------ | ------ | -------- | ------- | --------- |
| quiredformat. |     | Combinedwithprefetching,twoWASbuffers |     |     |     |     |     |            |       |                  |        |        |          |         |           |
|               |     |                                       |     |     |     |     |     | ing a cost | model | for applications |        | either | on       | the CPU | or on     |
areused. Eachworkitemworkingondecompressioninserts
theGPU,thearchitecturalevolutionoftheAPUbringsnew
thenextdatapositionintothefirstWASbufferforprefetch-
|               |        |                  |        |       |        |        |             | challenges. | Firstly,theco-processingparadigmrequiresthat |               |           |                |                 |     |           |
| ------------- | ------ | ---------------- | ------ | ----- | ------ | ------ | ----------- | ----------- | -------------------------------------------- | ------------- | --------- | -------------- | --------------- | --- | --------- |
| ing. The      | output | of decompression |        | is    | stored | in an  | interme-    |             |                                              |               |           |                |                 |     |           |
|               |        |                  |        |       |        |        |             | our model   | should                                       | consider      | different |                | characteristics |     | of two    |
| diate buffer  | that   | serves           | as the | input | for    | query  | execution.  |             |                                              |               |           |                |                 |     |           |
|               |        |                  |        |       |        |        |             | processors  | within                                       | heterogeneous |           | architectures. |                 |     | Secondly, |
| To coordinate |        | the progress     | of     | D and | E, a   | shared | flag is set |             |                                              |               |           |                |                 |     |           |
functionalmodulesrunconcurrently,andDandEcanbede-
| to indicate | that | decompression |     | on specific |     | compressed | data |     |     |     |     |     |     |     |     |
| ----------- | ---- | ------------- | --- | ----------- | --- | ---------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
ployedontotwodevicessimultaneously,whichmakesitmore
| block has          | been | finished, | and | E can | move | onto processing |     |           |               |     |         |     |              |     |          |
| ------------------ | ---- | --------- | --- | ----- | ---- | --------------- | --- | --------- | ------------- | --- | ------- | --- | ------------ | --- | -------- |
|                    |      |           |     |       |      |                 |     | difficult | to accurately |     | predict | the | performance. |     | Thirdly, |
| those decompressed |      | data.     |     |       |      |                 |     |           |               |     |         |     |              |     |          |
prefetchingcanchangethenumberofcachemisses,andde-
|     |     |     |     |     |     |     |     | compression | can | change | the | size of | data accessed |     | by each |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------ | --- | ------- | ------------- | --- | ------- |
3.2.3 DeviceFission
|                                               |     |     |     |     |     |     |     | functional         | module. | All | these | factors | need to | be considered |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ------------------ | ------- | --- | ----- | ------- | ------- | ------------- | --- |
| AsshowninFigure4,twofunctionalmodulesmaybeex- |     |     |     |     |     |     |     | in the estimation. |         |     |       |         |         |               |     |
ecutedonthesamedevice. Eachfunctionalmoduleconsists BecauseOpenCLhasprovidedanabstractionforallOpenCL-
of one or more OpenCL kernels. Device fission is required compatibledevices,wetreattheCPUortheGPUasapro-
todivideasingledeviceintomultiplesubdevices. Eachsub- cessor with identical architecture, differentiated by compu-
device can execute a kernel from some functional modules. tationalcapabilityandmemorybandwidth. Weprofileeach
Thus,thesamedevicecanbesharedamongfunctionalmod- task on the CPU and the GPU independently and derive
ules. Currently, device fission is fully supported on CPUs, the cost on a single CU. Besides, we divide the total cost
and is not supported on current GPUs. of a database operation into two major components: com-
We adopt a simple yet effective software-based approach putation cost and memory cost. The computation cost is
toachievedevicefissionontheGPU.TosupporttwoOpenCL derivedbasedonthetheoreticalpeakInstructionPerCycle
kernelsrunningconcurrentlyontheGPU,wehaveto“merge” (IPC) and the number of instructions. The memory cost
them into one kernel and then launch it on the GPU. The considers prefetching and decompression. In the remainder
originaltwokernelsaredifferentiatedbyif-elseconditional ofthissection,wefirstpresenttheabstractmodel,andnext
333

use two operators (selection and hash join) as examples of Forcomputationtime,wecountthenumberofinstructions
instantiating the abstract model. runningondevice(s)withOpenCLprofilersuchasCodeXL
|     |     |     |     |     |     |     | or  | AMD | APP | Profiler, | and | calculate | the | total | computa- |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --------- | --- | ----- | -------- |
4.1 TheAbstractModel
|     |     |     |     |     |     |     | tion | time | of instructions |     | according |     | to the | theoretical | peak |
| --- | --- | --- | --- | --- | --- | --- | ---- | ---- | --------------- | --- | --------- | --- | ------ | ----------- | ---- |
Wehavepresentedfourparadigmstoachieveco-processing, instructions per cycle (IPC) of the processor for each de-
PE, cPDE-c, cPDE-b, and cPDE-g as illustrated in Figure compressionalgorithm. Toachieveoptimalcompressionra-
4. Wefocusonhowtobuildthecostmodelforcaseswhere tio on each column, different plans are applied. Hence, the
prefetching and decompression are integrated. number of instructions for decompression is not constant
Wehavethefollowingfourkeydesignstomakethemodel among columns. We choose the compression plan based on
accurately find the configuration. Firstly, as the query exe- themodelproposedbyFangetal. [12]. Weperformbench-
cutions (E) is optimized in the fine-grained method, opera- markingbeforethequeryexecutiontoobtaintheinstruction
|                              |        |       |           |                          |         |       | number  | of  | decompression |     | of each | column      | on  | any processor, |         |
| ---------------------------- | ------ | ----- | --------- | ------------------------ | ------- | ----- | ------- | --- | ------------- | --- | ------- | ----------- | --- | -------------- | ------- |
| torsneedtobestagedintosteps. |        |       |           | Itisdifficulttodetermine |         |       |         |     |               |     |         |             |     |                |         |
|                              |        |       |           |                          |         |       | namely, | ID  | . According   |     | to      | the numbers | of  | CPU            | CUs and |
| the optimal                  | ratios | among | all steps | to get the               | optimal | total |         |     | XPU           |     |         |             |     |                |         |
time. Therefore, we have adopted the cost model by He et GPU CUs assigned to decompression, we can obtain the
al. [19] to address this problem. Secondly, the cache effect amount of instruction execution time on each device. The
must be included. Ideally, all working data of D and E can totalexecutiontimeofdecompressiondependsonthelonger
beaccesseddirectlyfromthecache,andonlyPsuffersfrom execution time of two devices, as shown in Eq. 2.
cachemisses,whichcanbehiddenbythecomputationofD
andE.IfcachemissesappearinDorE,thepenaltyneedsto compXPU =max(compCPU,compGPU)
be considered in the cost model. Thirdly, the device fission D D D
|     |     |     |     |     |     |     |     |     |     |     |     | C   |     | G   | (2) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
divides one device into multiple subdevices with different #I D × D #I D × D
|                     |     |                                |     |     |     |     |     |     | =max( |     | C PU | |C | | , G PU | |G  | | ) |
| ------------------- | --- | ------------------------------ | --- | --- | --- | --- | --- | --- | ----- | --- | ---- | ---- | ------ | --- | --- |
| tasksrunningonthem. |     | Inthatscenario,thecostmodelcan |     |     |     |     |     |     |       |     |      |      |        |     |     |
|                     |     |                                |     |     |     |     |     |     |       |     | IPC  | CPU  | IPC    | GPU |     |
estimate the execution time accurately when different DE Thememoryaccesstimeconsistsoftimeofaccessesfrom
boundaries are applied. Fourthly, functional modules work the main memory and L2 data cache. If N > R ,
|                                                     |            |     |         |                |     |       |                    |     |     |     |      |                     | compX | PU  | P   |
| --------------------------------------------------- | ---------- | --- | ------- | -------------- | --- | ----- | ------------------ | --- | --- | --- | ---- | ------------------- | ----- | --- | --- |
| inapipelinedmanner,whichcancausedelay(i.e.,inappro- |            |     |         |                |     |       |                    |     |     |     |      |                     |       | D   |     |
|                                                     |            |     |         |                |     |       | anamountof(N−compX |     |     |     | PU×R | )datainbyteshastobe |       |     |     |
| priate CU                                           | assignment | to  | P/D/E). | For execution, | the | delay |                    |     |     |     | D    | P                   |       |     |     |
occurs when the output of D cannot satisfy the input for E accessed from main memory. Thus, we have the following
in time. In cases where data is not correctly preloaded into memory access time.
| the L2 cache, | both                     | D and     | E are delayed. |                 |     |     |      |            | MXPU   |           | −compXPU  |           | )×LXPU    |            |     |
| ------------- | ------------------------ | --------- | -------------- | --------------- | --- | --- | ---- | ---------- | ------ | --------- | --------- | --------- | --------- | ---------- | --- |
|               |                          |           |                |                 |     |     |      |            |        | =(N       |           | ×R        |           |            |     |
| Table         | 2 lists the              | notations | in our         | cost model.     |     |     |      |            | D      |           |           | D         | P         | M          | (3) |
|               |                          |           |                |                 |     |     |      |            |        | +(compXPU |           | ×R )×LXPU |           |            |     |
|               |                          |           |                |                 |     |     |      |            |        |           | D         | P         | C         |            |     |
|               | Table 2:                 | Notations | in             | the cost model. |     |     |      |            |        |           |           |           |           |            |     |
|               |                          |           |                |                 |     |     |      | Otherwise, | the    | input     | data have | been      | perfectly | prefetched |     |
|               |                          |           |                |                 |     |     | into | cache      | before | use,      | and we    | have Eq.  | 4.        |            |     |
| Notation      | Description              |           |                |                 |     |     |      |            |        |           |           |           |           |            |     |
| XPU           | CPUorGPU                 |           |                |                 |     |     |      |            |        | MXPU      | =N        | ×LXPU,    |           |            | (4) |
|               |                          |           |                |                 |     |     |      |            |        | D         |           | C         |           |            |     |
| N             | Theinputsize(ofD)inbytes |           |                |                 |     |     |      |            |        |           |           |           |           |            |     |
|C| ThenumberofCPUCUs We can derive the actual execution time of D to be,
| |G|  | ThenumberofGPUCUs                      |     |     |     |     |     |     |     |     |          |     |       |     |     |     |
| ---- | -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | ----- | --- | --- | --- |
|      |                                        |     |     |     |     |     |     |     |     | T =compX |     | PU +M | XPU |     | (5) |
| BXPU | Thepeakbandwidth(GB/s)ofXPUtotheshared |     |     |     |     |     |     |     |     | D        | D   |       | D   |     |     |
mainmemoryarea
S Thepresetdatasizetobeprefetched Similarly, we perform the estimation for E: the compu-
(compXPU)
| F   | F∈{P,D,E} |     |     |     |     |     | tation | time |     | E   | as Eq. | 2 and | memory | access | time |
| --- | --------- | --- | --- | --- | --- | --- | ------ | ---- | --- | --- | ------ | ----- | ------ | ------ | ---- |
TF TheactualexecutiontimeofF (MXPU)asEq. WedefinethesumofcompXPU
|       |                               |     |     |     |     |     |     |     |     | 3∼Eq. | 4.  |     |     |     |     |
| ----- | ----------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- |
| compX | PU ThecomputationtimeofFonXPU |     |     |     |     |     |     | E   |     |       |     |     |     |     | E   |
F and MXPU as the assumptive execution time of E ( T(cid:48))
| MXPU  | MemoryaccesstimeofF                |     |     |     |     |     |                                                   | E   |     |     |     |     |     |     | E   |
| ----- | ---------------------------------- | --- | --- | --- | --- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| F     |                                    |     |     |     |     |     | basedontheassumptionthattheoutputofDcansatisfythe |     |     |     |     |     |     |     |     |
| CF,GF | ThenumberofCPUandGPUCUsassignedtoF |     |     |     |     |     |                                                   |     |     |     |     |     |     |     |     |
#IF ThenumberofinstructionsofFonXPU input of E in time. However, as D and E form a producer-
XPU
cr Compressionratio consumer chain in the real execution, E may have to wait
LX PU TheaccesslatencybetweenXPUandmainmemory forDifinappropriateCUassignmentisadopted. Thedelay
M
L X PU T h e a c c e s s la te n cy b e t we e n X PU a n dL2cache i s t he d iff e r en c e b e t w e en T a n d T (cid:48) . If T ≤ T (cid:48) , D can
R C T h e o u t p u t th r ou gh p u t o f F in by t es D E D E
F f ee d E in t i m e . T h u s , w e h a ve t h e fo ll ow in g es tim a t io n.
| IPCXPU                                       | ThetheoreticalpeakinstructionpercycleonXPU |     |     |     |     |     |     |     |     |     |              |     |     |     |     |
| -------------------------------------------- | ------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | --- |
|                                              |                                            |     |     |     |     |     |     |     |     |     | T =T(cid:48) |     |     |     | (6) |
| PrefetchingisperformedonaCPUCU.Themajorwork- |                                            |     |     |     |     |     |     |     |     |     | E            | E   |     |     |     |
load of that CPU CU is on memory fetch instructions. We Otherwise,theprocessingtimeofEislimitedbyD.Thus,
denote the data size to be prefetched in getting prefetch- we have the following estimation.
| ing throughput                                 | as  | S. To | guarantee | the real | execution | of  |     |     |     |     |      |     |     |     |     |
| ---------------------------------------------- | --- | ----- | --------- | -------- | --------- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- |
|                                                |     |       |           |          |           |     |     |     |     |     | T =T |     |     |     | (7) |
| prefetching,light-weightcomputationisinvolved. |     |       |           |          | Thus,the  |     |     |     |     |     | E    | D   |     |     |     |
throughput of prefetching can be calculated by the band- The number of CUs assigned to all functional modules
width and the computational capability of the CPU CU(s). should be within the limit of available CUs. Therefore, the
|     |     |     |     |     |     |     | following |     | conditions | should | also | be satisfied. |      |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ---------- | ------ | ---- | ------------- | ---- | --- | --- |
|     |     |     | |S| |     |     |     |           |     |            | 0≤C    | +C   | +C            | ≤|C| |     | (8) |
|     | R   | =   |     |     |     | (1) |           |     |            |        | P D  | E             |      |     |     |
P
|     |     |     | |S| + | I C P PU |     |     |     |     |     |     |     |      |     |     |     |
| --- | --- | --- | ----- | -------- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- |
|     |     |     | BCPU  | IPCCPU   |     |     |     |     |     | 0≤G | +G  | ≤|G| |     |     | (9) |
|     |     |     |       |          |     |     |     |     |     |     | D   | E    |     |     |     |
TheexecutiontimeofDcanbecalculatedintwocompo- Thegoalofourcostmodelistofindtheoptimalplanthat
nents: the computation time and the memory access time. can minimize the total execution time as Eq. 10. Because
334

the number of CUs in the CPU and the GPU are relatively with A10-7850K (A10) and 32GB DRAM. The configura-
small and P is fixed on one CPU CU, we simply iterate all tionsofA8andA10havebeenpresentedinTable1. Wefol-
the possible combinations to find the optimal plan. lowtheexperimentalmethodologyinthepreviousstudy[19]
|     |     |                |     |     |     |      | to study                                                 | the comparison |     | with  | discrete      | CPU-GPU | architec- |     |
| --- | --- | -------------- | --- | --- | --- | ---- | -------------------------------------------------------- | -------------- | --- | ----- | ------------- | ------- | --------- | --- |
|     |     | Minimize(max(T |     | ,T  | ))  | (10) |                                                          |                |     |       |               |         |           |     |
|     |     |                |     | D   | E   |      | tures. Weobserveconsistentresultsasthepreviousstudy[19]. |                |     |       |               |         |           |     |
|     |     |                |     |     |     |      | In general,                                              | removing       | the | PCI-e | data transfer |         | overhead, | the |
4.2 ModelInstantiation
APUarchitectureoutperformsthediscretearchitecturewith
We use hash joins and selections to illustrate how we use the same configuration. Since the focus of this study is to
thecostmodel. Modelsforotheroperatorscanbedeveloped further improve the performance of query co-processing on
in the same way. coupled CPU-GPU architectures, we have omitted the de-
Hash join consists of three stages: partition, build, and tailed results on discrete architectures.
probe. Each stage can be divided into several steps. To Data sets. We select four queries (i.e., Q3, Q6, Q9, and
demonstrate how a hash join can be mapped to the cost Q14) from TPC-H with different complexities. Q6 is a rel-
| model, | we use | the build | stage | for illustration. |     | The build |     |     |     |     |     |     |     |     |
| ------ | ------ | --------- | ----- | ----------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
ativelysimpleselectionquery,whereasQ9involvesarather
| stage can | be divided   |       | into four | steps  | (b , b , | b , b ) as de- |                      |      |            |                              |         |      |      |       |
| --------- | ------------ | ----- | --------- | ------ | -------- | -------------- | -------------------- | ---- | ---------- | ---------------------------- | ------- | ---- | ---- | ----- |
|           |              |       |           |        | 1 2      | 3 4            | complicatedsubquery. |      |            | Q3hastwojoinoperationsandQ14 |         |      |      |       |
| fined in  | the previous | paper | [19].     | Before | step     | b starts, each |                      |      |            |                              |         |      |      |       |
|           |              |       |           |        |          | 1              | has a single         | join | operation. | Those                        | queries | also | have | other |
workitemineedstowritethememoryaddressthatwillbe common operators such as group-by and order-by. TPC-H
accessed immediately in step b 1 into the WAS buffer that query experiments are conducted based on the data gener-
exclusively serves E (assume prefetching distance is 1). In ated from the TPC-H data generator. The maximum scale
the next move, if work item i has finished operations in factorsaresetas5and10onA8andA10machines,generat-
thecurrentstep,thenextmemoryaddressiscalculatedand ing approximately 5GB and 10 GB databases, respectively.
writtenintotheWASbufferbeforeitproceeds. Ideally, the We use column stores for query processing as OmniDB
operationsinthecurrentstepcanhidethememorylatency [38]. Furthermore, to study in-cache query co-processing
before the next data can be prefetched into cache. in more details, we evaluate our executions for two core
AssumethenumberofCPUCUsandGPUCUsassigned
|                                   |           |     |                   |     |     |             | operators                                              | in databases |     | (i.e., selection |     | and hash | join). | In   |
| --------------------------------- | --------- | --- | ----------------- | --- | --- | ----------- | ------------------------------------------------------ | ------------ | --- | ---------------- | --- | -------- | ------ | ---- |
| to hash                           | join is C | and | G , respectively. |     | The | computation |                                                        |              |     |                  |     |          |        |      |
|                                   |           | E   | E                 |     |     |             | theevaluationsofindividualoperators,theoriginaldataset |              |     |                  |     |          |        |      |
| timecanbederivedinthesamewayasEq. |           |     |                   |     | 2.  | Wecompare   |                                                        |              |     |                  |     |          |        |      |
|                                   |           |     |                   |     |     |             | contains16Mpairs<key,record-id>ineachrelation.         |              |     |                  |     |          |        | Both |
thiscomputationtimewiththatofprefetchingtoobtainthe keys and payloads are 8 bytes long as in existing work [4,
memory access time including the cache misses impacts as 24]. Toinvestigatethesituationwhenthequeryprocessdi-
Eq. 3. One issue to be handled is that the size of memory rectly on the compressed data, we intentionally study the
consumed by hash join is 1 times as large as that of D, if performance of individual operators on the data with spe-
cr
the data is decompressed into the original format. In this cific compression algorithm, which is not optimal according
| way, we | obtain | the memory |     | access time | and | computation | to our evaluation. |     |     |     |     |     |     |     |
| ------- | ------ | ---------- | --- | ----------- | --- | ----------- | ------------------ | --- | --- | --- | --- | --- | --- | --- |
time of hash join with specified preset configuration. In We choose the CPU-only counterpart of each execution
decompression,stepsaredefinedinadifferentwayfromhash configuration as the baseline and demonstrate the perfor-
| join. As | introduced | in  | Subsection | 3.2.2, | operations | on each |              |     |              |     |            |     |            |     |
| -------- | ---------- | --- | ---------- | ------ | ---------- | ------- | ------------ | --- | ------------ | --- | ---------- | --- | ---------- | --- |
|          |            |     |            |        |            |         | mance impact | of  | our proposal |     | by showing | the | normalized |     |
small compressed data block are defined as one step. With (t, t(cid:48)
|                                                     |     |     |     |     |     |     | speedup  | where     | t and | are | the execution |           | times      | of the |
| --------------------------------------------------- | --- | --- | --- | --- | --- | --- | -------- | --------- | ----- | --- | ------------- | --------- | ---------- | ------ |
| prefetchingdistanceof1,thesamepositioninthenextdata |     |     |     |     |     |     |          | t(cid:48) |       |     |               |           |            |        |
|                                                     |     |     |     |     |     |     | CPU-only | execution | and   | the | studied       | execution | configura- |        |
block is written into the WAS buffer for prefetching. Next, tion,respectively). Specifically,withoutdecompression,the
we compare the estimated time of D with E to obtain the baselineimplementationprocessesqueriesonlyontheCPU
real execution time according to Eq. 6 and Eq. 7 as they (i.e., E-CPU). While decompression is necessary, the base-
form a producer-consumer chain. line implementation is to perform the D/E functional mod-
In this way, we can obtain the estimated execution time ulesontheCPUonly(namelycDE-CPU).Additionally,we
ofhashjoinwithonespecifiedconfigurationplan. Toobtain have two variants by adopting our cost model to the CPU
the optimal configuration plan, we search the whole config- only: cPDE-CPUandPE-CPUfortheCPU-onlyexecutions
uration space within the resource constraints (e.g., |C|=4 with and without decompression, respectively.
| and |G|=5 | on  | A8) to | get the | minimal | estimated | execution |     |     |     |     |     |     |     |     |
| --------- | --- | ------ | ------- | ------- | --------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
time (Eq. 10). Thus, we can get the minimal total cost of 5.2 Operators and Queries Evaluation with-
| hash join | as well | as the | optimal | configuration |     | plan. |     |     |     |     |     |     |     |     |
| --------- | ------- | ------ | ------- | ------------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
outDecompression
Theestimationonselectionissimilartothatofhashjoin,
|     |     |     |     |     |     |     | We first | investigate | the | performance |     | of schemes | without |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | --- | ----------- | --- | ---------- | ------- | --- |
exceptthatthestepdefinedintheselectionisabatchofop-
|          |          |      |               |     |           |              | decompression | (i.e.,              | E and | PE)   | on uncompressed |        | and     | com- |
| -------- | -------- | ---- | ------------- | --- | --------- | ------------ | ------------- | ------------------- | ----- | ----- | --------------- | ------ | ------- | ---- |
| erations | that all | work | items perform |     | scan over | input tuples |               |                     |       |       |                 |        |         |      |
|          |          |      |               |     |           |              | pressed       | data, respectively. |       | Note, | E               | and PE | involve | both |
one by one.
|     |     |     |     |     |     |     | the CPU | and the  | GPU.    | We vary | the | WAS size  | from    | small |
| --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ------- | ------- | --- | --------- | ------- | ----- |
|     |     |     |     |     |     |     | (128KB) | to large | (16MB). | Figure  | 5   | shows the | results | for   |
5. EXPERIMENTALEVALUATION
|     |     |     |     |     |     |     | operators | on uncompressed |     | data. | We  | find that | prefetching |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | --------------- | --- | ----- | --- | --------- | ----------- | --- |
The evaluations are categorized in two groups, whether performance depends on the WAS size, and 1MB is chosen
query processing is without decompression (Section 5.2) or as the optimal setting. The performance improvement of
| with decompression |     | (from | Section | 5.3 | to 5.4). |     |         |               |               |          |        |               |        |     |
| ------------------ | --- | ----- | ------- | --- | -------- | --- | ------- | ------------- | ------------- | -------- | ------ | ------------- | ------ | --- |
|                    |     |       |         |     |          |     | PE over | the latest    | co-processing |          | method | E [19]        | is 24% | and |
|                    |     |       |         |     |          |     | 22% on  | the selection | and           | the hash | join,  | respectively. |        |     |
5.1 ExperimentalSetup
|     |     |     |     |     |     |     | To study | prefetching |     | for query | processing | on  | compressed |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | --- | --------- | ---------- | --- | ---------- | --- |
Hardware configuration. Our experiments are con- datawithoutdecompression,weapplysinglecompressional-
ducted on two workstations. One is equipped with AMD gorithm(i.e.,NS)sothattheoperatorscanprocessthedata
A8-3870K (A8) and 8 GB DRAM. The other is equipped withoutdecompression,asshowninFigure6. Thecompres-
335

|                    | 2   |     |     | 2                  |     |     | 3.5                |     |     |                    | 2   |     |     |
| ------------------ | --- | --- | --- | ------------------ | --- | --- | ------------------ | --- | --- | ------------------ | --- | --- | --- |
| pudeeps dezilamroN |     |     |     | pudeeps dezilamroN |     |     |                    |     |     |                    |     |     |     |
|                    |     |     |     |                    |     |     | pudeeps dezilamroN | 3   |     | pudeeps dezilamroN |     |     |     |
|                    | 1.5 |     |     | 1.5                |     |     |                    |     |     |                    | 1.5 |     |     |
2.5
2
|     | 1   |     |     | 1   |     |     |     |     |     |     | 1   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
1.5
|     | 0.5 |     |     | 0.5 |     |     |     | 1   |     |     | 0.5 |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
0.5
|     | 0   |     |     | 0   |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     | 0   |     |     | 0   |     |     |
PE-CPU E PE PE PE PE-CPU E PE PE PE cPDE-CPU cDE-b cPDE-g cPDE-g cPDE-g cPDE-CPU cDE-b cPDE-b cPDE-b cPDE-b
(1MB) (128KB) (1MB) (16MB) (1MB) (128KB) (1MB) (16MB) (128KB) (1MB) (16MB) (128KB) (1MB) (16MB)
|     | (a) | Selection |     | (b) | Hash Join |     |     | (a) | Selection |     | (b) | Hash | Join |
| --- | --- | --------- | --- | --- | --------- | --- | --- | --- | --------- | --- | --- | ---- | ---- |
Figure5: ThenormalizedspeeduptoE-CPUofprefetching Figure8: ThenormalizedspeeduptocDE-CPUofprefetch-
| on  | selection | and hash | join on | uncompressed | data on | A10. |             |              |          |         |            |     |               |
| --- | --------- | -------- | ------- | ------------ | ------- | ---- | ----------- | ------------ | -------- | ------- | ---------- | --- | ------------- |
|     |           |          |         |              |         |      | ing         | on selection | and hash | join on | compressed |     | data with de- |
|     |           |          |         |              |         |      | compression |              | on A10.  |         |            |     |               |
2.5 2.5 Table 3: Compression results on A10 for different compres-
| pudeeps dezilamroN |     |     |     | pudeeps dezilamroN |     |     |             |       |               |     |               |     |          |
| ------------------ | --- | --- | --- | ------------------ | --- | --- | ----------- | ----- | ------------- | --- | ------------- | --- | -------- |
|                    | 2   |     |     | 2                  |     |     | sion        | plans | on Selection. |     |               |     |          |
|                    | 1.5 |     |     | 1.5                |     |     |             |       |               |     |               |     |          |
|                    | 1   |     |     | 1                  |     |     | Compression |       | Compression   |     | Decompression |     | Time(ms) |
|                    |     |     |     |                    |     |     | plan        |       | ratio         |     |               |     |          |
|                    | 0.5 |     |     | 0.5                |     |     |             |       |               |     |               |     |          |
|                    |     |     |     |                    |     |     | (A):RLE     |       | 3.34%         |     | No            |     | 11.3     |
|                    | 0   |     |     | 0                  |     |     |             |       |               |     |               |     |          |
|                    |     |     |     |                    |     |     | (B):NS      |       | 100%          |     | No            |     | 104.7    |
PE-CPU E PE PE PE PE-CPU E PE PE PE (C):RLE,[(cid:15)|NS] 2.76% No 10.1
|     | (1MB) | (128KB) (1MB) | (16MB) | (1MB) | (128KB) (1MB) | (16MB) |                  |     |       |     |         |     |      |
| --- | ----- | ------------- | ------ | ----- | ------------- | ------ | ---------------- | --- | ----- | --- | ------- | --- | ---- |
|     |       |               |        |       |               |        | (D):RLE,[[Delta, |     | 2.55% |     | Partial |     | 37.7 |
|     | (a)   | Selection     |        | (b)   | Hash Join     |        | NS]|NS]          |     |       |     |         |     |      |
Figure 6: The normalized speedup to E-CPU of prefetch- (E):Delta,NS 25% Full 145.4
| ing           | on selection | and     | hash join | on compressed | data | without |                                   |         |               |      |             |                |              |
| ------------- | ------------ | ------- | --------- | ------------- | ---- | ------- | --------------------------------- | ------- | ------------- | ---- | ----------- | -------------- | ------------ |
| decompression |              | on A10. |           |               |      |         |                                   |         |               |      |             |                |              |
|               |              |         |           |               |      |         | The                               | speedup | of the scheme | with | prefetching |                | achieves 31% |
|               |              |         |           |               |      |         | and25%overtheoriginalschemecDE-b. |         |               |      |             | Bymeasuringthe |              |
sion ratio (defined as the data size after compression to the L2 cache misses distribution, we find that the cache misses
data size without compression) is 25% for the input rela- are now limited to the CPU CU working on prefetching.
tions. As expected, the execution time of each operator is Another observation is that when the WAS size is not ap-
reduced compared to the one on uncompressed data. We propriately set, prefetching performance degrades dramati-
observed similar performance improvement by prefetching cally. When the size is too large, the performance is even
ondirectqueryexecutionswithoutdecompression. Wealso worsethantheoriginalschemewithoutprefetchingbecause
studied other compression schemes. Generally, PE outper- of cache pollution caused by excessive prefetching.
forms E with similar performance improvement. Impact of compression: To further reduce the data
Next, we evaluate the TPC-H query performance on the footprint, cascaded compression is applied as in the pre-
uncompresseddata. Figure7depictstheperformancecom- vious study [12]. Table 3 lists the results of the selection
parisons on A8 and A10. Compared with the CPU-only operator with five compression plans. We use the symbols
approach, both E and PE achieve over 1.5 times speedup. adopted in previous work [12]. Plans (A) and (B) contain
Prefetchingcanreducethequeryprocessingtimeofallqueries single compression algorithm and the compressed data can
by up to 19% on A8, and up to 20% on A10, respectively. be directly processed by the selection operator. Plans (C),
Thesignificantimprovementinthequeryprocessingperfor- (D) and (E) apply two consecutive compressions onto the
mance shows the effectiveness of in-cache query processing input data in order to achieve better compression ratio.
in reducing the effects of memory latency. The processing time without compression on the GPU is
|     |     |     |     |     |     |     | 101 | ms. As | the table shows, | when | the | data | compression |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ---------------- | ---- | --- | ---- | ----------- |
5.3 OperatorswithDecompression ratio is better and no decompression is needed, then the
Impact of prefetching: When the data is compressed selection time can be reduced by 90%. In Plan (C), when
with cascaded compression, D may be required for query cascaded compression is applied, the compression ratio can
executions. The results on A10 are presented in Figure 8. be improved. However, the processing time is close to the
onewithPlan(A),whichindicatesthatbettercompression
|     |     |     |     |     |     |     | ratio | does        | not guarantee | better | query processing. |               | In Plan |
| --- | --- | --- | --- | --- | --- | --- | ----- | ----------- | ------------- | ------ | ----------------- | ------------- | ------- |
|     |     |     |     |     |     |     | (D),  | the partial | decompression |        | policy can        | significantly | re-     |
E PE E PE duce the overhead introduced by decompression compared
pudeeps dezilamroN 3 pudeeps dezilamroN 3 tofulldecompressioninPlan(E).InPlan(E),thecompres-
|     | 2.5 |     |     | 2.5 |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sionratioisimprovedfrom100%to25%comparedtoPlan
|     | 2   |     |     | 2   |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
(B),buttheprocessingtimeincreasesfrom11.3msto145.4
|     | 1.5 |       |     | 1.5 |       |     |              |      |                                      |      |               |      |            |
| --- | --- | ----- | --- | --- | ----- | --- | ------------ | ---- | ------------------------------------ | ---- | ------------- | ---- | ---------- |
|     |     |       |     |     |       |     | ms.          | This | is mainly because                    | the  | decompression |      | overhead   |
|     | 1   |       |     | 1   |       |     |              |      |                                      |      |               |      |            |
|     | 0.5 |       |     | 0.5 |       |     |              |      |                                      |      |               |      |            |
|     |     |       |     |     |       |     | offsets      | the  | benefit gained                       | from | the smaller   | data | size to be |
|     | 0   |       |     | 0   |       |     |              |      |                                      |      |               |      |            |
|     |     |       |     |     |       |     | transferred. |      | WeaddthefeatureofAPUintothecostmodel |      |               |      |            |
|     | Q3  | Q6 Q9 | Q14 | Q3  | Q6 Q9 | Q14 |              |      |                                      |      |               |      |            |
[12]. Ourevaluationsfindthatthecostmodelisabletofind
|          |                                          | (a) A8 |              |       | (b) A10 |     |                        |         |               |                          |             |             |     |
| -------- | ---------------------------------------- | ------ | ------------ | ----- | ------- | --- | ---------------------- | ------- | ------------- | ------------------------ | ----------- | ----------- | --- |
|          |                                          |        |              |       |         |     | the                    | optimal | plan with the | best                     | performance | accurately. |     |
| Figure7: | ThenormalizedspeeduptoE-CPUofprefetching |        |              |       |         |     |                        |         |               |                          |             |             |     |
|          |                                          |        |              |       |         |     | Impactofdevicefission: |         |               | WestaticallyassigntheCPU |             |             |     |
| on       | TPC-H queries                            | on     | uncompressed | data. |         |     |                        |         |               |                          |             |             |     |
andtheGPUCUstothreefunctionalmodulesandstudythe
336

|                   |     | Selection |     |     |                  | Hash Join |     |     |     |                  |           |                  |          |           |
| ----------------- | --- | --------- | --- | --- | ---------------- | --------- | --- | --- | --- | ---------------- | --------- | ---------------- | -------- | --------- |
|                   |     |           |     |     |                  |           |     |     |     | Measured         | Estimated |                  | Measured | Estimated |
|                   | 250 |           |     |     | 4                |           |     |     |     |                  |           |                  |          |           |
| )sm( emit despalE | 200 |           |     |     | )s( emit despalE |           |     |     |     | 50               |           | 25               |          |           |
|                   |     |           |     |     | 3                |           |     |     |     | )s( emit despalE |           | )s( emit despalE |          |           |
|                   | 150 |           |     |     | 2                |           |     |     |     | 40               |           | 20               |          |           |
|                   | 100 |           |     |     |                  |           |     |     |     | 30               |           | 15               |          |           |
1
|     | 50  |                 |       |        |     |                 |       |        |     | 20              |       | 10  |                 |         |
| --- | --- | --------------- | ----- | ------ | --- | --------------- | ----- | ------ | --- | --------------- | ----- | --- | --------------- | ------- |
|     | 0   |                 |       |        | 0   |                 |       |        |     |                 |       |     |                 |         |
|     | 1   | 2 3 4           | 5 6 7 | 8 9 10 | 1   | 2 3 4           | 5 6 7 | 8 9 10 |     | 10              |       | 5   |                 |         |
|     |     |                 |       |        |     |                 |       |        |     | 0               |       | 0   |                 |         |
|     |     | The DE boundary |       |        |     | The DE boundary |       |        |     |                 |       |     |                 |         |
|     |     |                 |       |        |     |                 |       |        |     | 1 2 3           | 4 5 6 | 7 1 | 2 3             | 4 5 6 7 |
|     |     | (a) Selection   |       |        |     | (b) Hash        | Join  |        |     | The DE boundary |       |     | The DE boundary |         |
Figure 9: The results of manually configured settings on (a) Q9 on A8 (b) Q14 on A8
| different   |     | operations | on            | A10. |             |     |          |        |     |                  |           |                  |          |           |
| ----------- | --- | ---------- | ------------- | ---- | ----------- | --- | -------- | ------ | --- | ---------------- | --------- | ---------------- | -------- | --------- |
|             |     |            |               |      |             |     |          |        |     | Measured         | Estimated |                  | Measured | Estimated |
|             |     |            |               |      |             |     |          |        |     | 80               |           | 40               |          |           |
|             |     |            |               |      |             |     |          |        |     | )s( emit despalE |           | )s( emit despalE |          |           |
|             |     |            |               |      |             |     |          |        |     | 60               |           | 30               |          |           |
| performance |     | trend.     | Specifically, |      | prefetching |     | is fixed | on the |     |                  |           |                  |          |           |
|             |     |            |               |      |             |     |          |        |     | 40               |           | 20               |          |           |
firstCPUCU,andtheDEboundaryisvariedfrom1to7on
|                      |     |     |     |     |                          |     |     |     |     | 20  |     | 10  |     |     |
| -------------------- | --- | --- | --- | --- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A8andfrom1to10onA10. |     |     |     |     | AstheresultonA8issimilar |     |     |     |     |     |     |     |     |     |
|                      |     |     |     |     |                          |     |     |     |     | 0   |     | 0   |     |     |
tothatonA10,weonlyshowtheresultonA10inFigure9. 1 2 3 4 5 6 7 8 9 10 1 2 3 4 5 6 7 8 9 10
Figure9ashowsthattheperformanceofselectioncanvary The DE boundary The DE boundary
significantlyastheDEboundaryincreases. Thisisbecause (c) Q9 on A10 (d) Q14 on A10
| decompression                                         |                |            | is the | most time-consuming |           |       | component   | for      |           |                                        |     |     |     |     |
| ----------------------------------------------------- | -------------- | ---------- | ------ | ------------------- | --------- | ----- | ----------- | -------- | --------- | -------------------------------------- | --- | --- | --- | --- |
|                                                       |                |            |        |                     |           |       |             |          | Figure10: | ModelvalidationontheelapsedtimeonA8and |     |     |     |     |
| the                                                   | selection      | operation. |        | The                 | fewer CPU | CUs   | are         | assigned |           |                                        |     |     |     |     |
|                                                       |                |            |        |                     |           |       |             |          | A10       | platforms.                             |     |     |     |     |
| to                                                    | decompression, |            | the    | more                | time the  | query | execution   | has      |           |                                        |     |     |     |     |
| towaitfortheoutputfromthedecompression.               |                |            |        |                     |           |       | Incontrast, |          |           |                                        |     |     |     |     |
| Figure9bshowsthatthehashjoinisrelativelylesssensitive |                |            |        |                     |           |       |             |          |           | Q9 (A8)                                |     |     |     |     |
Q14 (A8)
| to   | the DE | boundary. |                | Compared | with       | decompression, |     | hash |                    | 2.5 |     | 3                  |     |     |
| ---- | ------ | --------- | -------------- | -------- | ---------- | -------------- | --- | ---- | ------------------ | --- | --- | ------------------ | --- | --- |
|      |        |           |                |          |            |                |     |      | pudeeps dezilamroN |     |     | pudeeps dezilamroN |     |     |
| join | is a   | more      | time-consuming |          | operation. |                |     |      |                    | 2   |     | 2.5                |     |     |
|      |        |           |                |          |            |                |     |      |                    | 1.5 |     | 2                  |     |     |
1.5
| 5.4 | QuerieswithDecompression |     |     |     |     |     |     |     |     | 1   |     |     |     |     |
| --- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
1
0.5
|     | Cost     | model  | validation: |         | To validate | the     | effectiveness |        |     |            |                    | 0.5   |      |                    |
| --- | -------- | ------ | ----------- | ------- | ----------- | ------- | ------------- | ------ | --- | ---------- | ------------------ | ----- | ---- | ------------------ |
| of  | our cost | model, | we          | compare | the         | elapsed | time          | and CU |     | 0          |                    | 0     |      |                    |
|     |          |        |             |         |             |         |               |        |     | cPDE- E PE | cPDE-ccPDE-bcPDE-g | cPDE- | E PE | cPDE-ccPDE-bcPDE-g |
assignment plans from measurements with those from the CPU CPU
| cost | model. |     |     |     |     |     |     |     |     | (a) Q9 results | on A8 | (b) | Q14 results | on A8 |
| ---- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | -------------- | ----- | --- | ----------- | ----- |
WeusethenotationforaCUassignmentplan,(x Cy G, Figure11: ThenormalizedspeeduptocDE-CPUofdifferent
1 1
| x        | Cy G),todenotethatx |       |       |     | CPUCUsandy |       | GPUCUsare |         |         |          |          |        |     |     |
| -------- | ------------------- | ----- | ----- | --- | ---------- | ----- | --------- | ------- | ------- | -------- | -------- | ------ | --- | --- |
| 2        | 2                   |       |       | 1   |            | 1     |           |         | schemes | on TPC-H | data set | on A8. |     |     |
| assigned |                     | to D, | and x | CPU | CUs and    | y GPU | CUs       | are as- |         |          |          |        |     |     |
|          |                     |       |       | 2   |            | 2     |           |         |         |          |          |        |     |     |
signedtoE.Ourmodelcorrectlypredictstheoptimalplan.
Forexample,thepredictedoptimalplanforQ9andQ14are
(2C0G,1C5G) and (3C1G,0C4G) respectively on A8, and Q9 (A10) Q14 (A10)
2.5
are (2C0G,1C8G) and (3C2G,0C6G) respectively on A10. pudeeps dezilamroN 2.5
|       |     |         |     |          |         |                |     |     |     | 2   |     | pudeeps dezilamroN |     |     |
| ----- | --- | ------- | --- | -------- | ------- | -------------- | --- | --- | --- | --- | --- | ------------------ | --- | --- |
| Thus, | it  | matches | the | measured | optimal | configuration. |     |     |     |     |     | 2                  |     |     |
1.5
|                                              | Figure | 10 shows | the | measured | and | the estimated |     | execu- |     |     |     | 1.5 |     |     |
| -------------------------------------------- | ------ | -------- | --- | -------- | --- | ------------- | --- | ------ | --- | --- | --- | --- | --- | --- |
| tiontimeforTPC-HqueriesonA8andA10aswevarythe |        |          |     |          |     |               |     |        |     | 1   |     | 1   |     |     |
DE boundary. Overall, our estimation approximates the 0.5 0.5
measurement well for TPC-H queries. It is able to produce 0 0
|     |     |     |     |     |     |     |     |     |     | cPDE- E PE | cPDE-ccPDE-bcPDE-g | cPDE- | E PE | cPDE-ccPDE-bcPDE-g |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------------------ | ----- | ---- | ------------------ |
the optimal assignment plan and predict the trend of the CPU CPU
relative performance with the differences less than 9%. (a) Q9 results on A10 (b) Q14 results on A10
Evaluation of TPC-H queries: In the previous work Figure12: ThenormalizedspeeduptocDE-CPUofdifferent
[12], a compression planner is adopted to choose the opti- schemes on TPC-H data set on A10.
| mal           | compression |         | plan           | delivering | the           | best performance. |             | For |     |     |     |     |     |     |
| ------------- | ----------- | ------- | -------------- | ---------- | ------------- | ----------------- | ----------- | --- | --- | --- | --- | --- | --- | --- |
| completeness, |             |         | we revisit     | the        | effectiveness | of                | the planner | for |     |     |     |     |     |     |
| coupled       |             | CPU-GPU | architectures. |            |               |                   |             |     |     |     |     |     |     |     |
Toobtainacomprehensiveunderstandingonhowourco- Q3 (A10) Q6 (A10)
2.5
| processing |     | paradigm    |     | can benefit | from        | two | generations | of       |                    |     |     | 3                  |     |     |
| ---------- | --- | ----------- | --- | ----------- | ----------- | --- | ----------- | -------- | ------------------ | --- | --- | ------------------ | --- | --- |
|            |     |             |     |             |             |     |             |          | pudeeps dezilamroN |     |     | pudeeps dezilamroN |     |     |
| APUs,      | we  | demonstrate |     | the         | performance | of  | query       | process- |                    | 2   |     | 2.5                |     |     |
2
| ing | on both | A8  | and | A10 for | Q9 and | Q14 in | Figures | 11 to |     | 1.5 |     |     |     |     |
| --- | ------- | --- | --- | ------- | ------ | ------ | ------- | ----- | --- | --- | --- | --- | --- | --- |
1.5
| 12. | The | results | for Q3 | and | Q6 on A10 | is presented |     | in Fig- |     | 1   |     |     |     |     |
| --- | --- | ------- | ------ | --- | --------- | ------------ | --- | ------- | --- | --- | --- | --- | --- | --- |
1
| ure | 13. | On A8, | similar | results | are observed |     | on Q3 | and Q6 |     | 0.5 |     |     |     |     |
| --- | --- | ------ | ------- | ------- | ------------ | --- | ----- | ------ | --- | --- | --- | --- | --- | --- |
0.5
|          |      |               |       |       |               |      |              |     |     | 0          |                    | 0     |      |                    |
| -------- | ---- | ------------- | ----- | ----- | ------------- | ---- | ------------ | --- | --- | ---------- | ------------------ | ----- | ---- | ------------------ |
| compared |      | with          | those | on Q9 | and Q14.      | From | the results, | we  |     |            |                    |       |      |                    |
|          |      |               |       |       |               |      |              |     |     | cPDE- E PE | cPDE-ccPDE-bcPDE-g | cPDE- | E PE | cPDE-ccPDE-bcPDE-g |
| can      | make | the following |       | three | observations. |      |              |     |     | CPU        |                    | CPU   |      |                    |
Firstly,byexploitingthepowerofbothprocessors,cPDE- (a) Q3 results on A10 (b) Q6 results on A10
bcanoutperformthebaselinebymorethan2.5times. Query Figure13: ThenormalizedspeeduptocDE-CPUofdifferent
co-processingwithboththeCPUandtheGPUsignificantly schemes on TPC-H data set on A10.
| outperforms |     | the | CPU-only |     | approach. | Moreover, |     | our in- |     |     |     |     |     |     |
| ----------- | --- | --- | -------- | --- | --------- | --------- | --- | ------- | --- | --- | --- | --- | --- | --- |
337

| cache design | has | significantly |     | reduced | the memory | stalls | of  |     |     |     |     |     |     |     |
| ------------ | --- | ------------- | --- | ------- | ---------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
theGPU,anddynamicallyschedulestheP/D/Efunctional Q9 (opt) Q9 (old) Q14 (opt) Q14 (old)
modules to their suitable numbers of CUs on both A8 and 60 30
|                                                    |       |            |     |     |            |      |        | 50               |     |     | 25               |     |     |     |
| -------------------------------------------------- | ----- | ---------- | --- | --- | ---------- | ---- | ------ | ---------------- | --- | --- | ---------------- | --- | --- | --- |
|                                                    |       |            |     |     |            |      |        | )s( emit despalE |     |     | )s( emit despalE |     |     |     |
| 10. Incontrast,theperformanceoftheCPU-onlyapproach |       |            |     |     |            |      |        | 40               |     |     | 20               |     |     |     |
| of running                                         | P/D/E | (cPDE-CPU) |     | is  | similar to | that | of the | 30               |     |     | 15               |     |     |     |
|                                                    |       |            |     |     |            |      |        | 20               |     |     | 10               |     |     |     |
baseline,becausealltheCUsoftheCPU-onlyapproachare
|              |     |                   |     |          |            |     |     | 10  |     |     | 5   |     |     |     |
| ------------ | --- | ----------------- | --- | -------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| homogeneous, |     | and heterogeneous |     | workload | scheduling |     | has |     |     |     |     |     |     |     |
|              |     |                   |     |          |            |     |     | 0   |     |     | 0   |     |     |     |
little impact. It might even slightly slow down the perfor- 1 2 4 6 8 10 1 2 4 6 8 10
|     |     |     |     |     |     |     |     |     | TPC-H SF |     |     |     | TPC-H SF |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | -------- | --- |
manceduetoruntimeoverheadoftheadvancedscheduling.
Secondly,ourCPU-GPUco-processingparadigmismuch (a) Q9 (b) Q14
faster than the state-of-the-art approach on the APU [19]. Figure16: TPC-HqueryperformanceonA10withvariable
| ForqueryprocessingonA8,theoptimalschemecanoutper- |              |     |          |              |          |         |     | scale factors. |     |     |     |     |     |     |
| ------------------------------------------------- | ------------ | --- | -------- | ------------ | -------- | ------- | --- | -------------- | --- | --- | --- | --- | --- | --- |
| form the                                          | fine-grained |     | approach | (i.e.,       | E) by up | to 36%. | On  |                |     |     |     |     |     |     |
| A10, the                                          | improvement  |     | can      | even achieve | at 40%.  | Though  |     |                |     |     |     |     |     |     |
the fine-grained method has captured the workload prefer- have demonstrated that in-cache query co-processing can
ence of different processors in the previous study [19], ex- further improve the state-of-the-art query co-processing on
cessive memory stalls make the GPU underutilized in the coupled CPU-GPU architectures. Specifically, it can signif-
coupled CPU-GPU architecture. In contrast, our heteroge- icantly reduce the memory stalls so that the efficiency of
neousworkloadschedulingisabletoexploittheadvantages boththeCPUandtheGPUcanbehighlyimproved. From
of both the CPU and the GPU. the experimental results, we can obtain some implications
Thirdly,forschemeswithprefetchinganddecompression, thatcanguidethefuturearchitecturaldesignanddatabase
the DE boundary can significantly affect the optimal per- management systems.
formance. OnA8andA10,thebestschemecanoutperform Firstly, as Figures 14 and 15 show, though prefetching
the worst one by 21% and 17%. With suboptimal configu- has significantly mitigated the cache misses suffered by the
rations,theworkloadassignedtotwodevicesisunbalanced. GPU, higher bandwidth and larger cache size on future ar-
Furthermore, if the producer-consumer chain is stalled due chitectures can further increase the efficiency of our query
to inappropriate configuration, more memory stalls are in- co-processing paradigm. That also means, memory opti-
curred which can further deteriorate the device efficiency mizationscontinuetobeakeyperformanceissuefordatabases
| (especially | for | the GPU). |     |     |     |     |     | in future | architectures. |     |     |     |     |     |
| ----------- | --- | --------- | --- | --- | --- | --- | --- | --------- | -------------- | --- | --- | --- | --- | --- |
Wefurtherstudytheprofilingresultsonthememorystalls Secondly, we argue that GPUs in coupled architectures
incurredinqueryprocessing. Weonlypresenttheresultsof are more sensitive to cache misses than those in discrete
Q9andQ14,sinceweobservethesamebehavioronQ3and systems. Looking forward, more efficient cache design with
Q6. Figure14and15demonstratethedetailedtimebreak- multi-level architecture can be potentially beneficial to the
down of memory units on both the CPU and the GPU for GPU performance. Besides, replacing DDR3 with GDDR5
Q9 and Q14, respectively. For simplicity, we show the re- as main memory [33] can be an interesting approach to in-
sults of E, PE, and the optimal one of the remaining three creasing database performance. Also, a hardware prefetch-
schemes (denoted as opt). With prefetching enabled, the ing engine for resolving the memory stalls on the GPU can
| CPU CU | assigned | with | prefetching |     | suffers much | more | L2  | be very helpful. |     |     |     |     |     |     |
| ------ | -------- | ---- | ----------- | --- | ------------ | ---- | --- | ---------------- | --- | --- | --- | --- | --- | --- |
cache misses, resulting in high percentage of stalled mem- Thirdly, modern databases require not only high compu-
ory instructions. As Figure 14a shows, when P and D are tationalcapability,butalsothecapabilitytohandlehetero-
notused,theaveragepercentageofstalledmemoryinstruc- geneousworkload. Thisrequirementnecessitatesamoreso-
tionsofeachCPUCUisaround25%(C0toC3). Itreaches phisticatedsoftwaresystemdesigntointegratevariouspro-
nearly38%ontheGPUthatcanseriouslydegradetheGPU cessors. “One size does not fit all” still holds. The evolving
efficiency. Withprefetchingenabled,thememorystallssuf- coupled CPU-GPU architectures will significantly impact
fered by the CPU CU working on prefetching (i.e. C0) are the database research, which may potentially impact the
73%ofthememoryunitcycles. However,itdropstoaround architectural design of next-generation database systems.
10%onotherCPUCUsandtheGPU.Thisisbecausemost
cachemisseshavebeenshiftedtoprefetchingCU.Theben- 6. RELATEDWORK
| efit is even | more | distinct | in  | the opt | scheme as | the smaller |     |           |     |              |     |               |             |     |
| ------------ | ---- | -------- | --- | ------- | --------- | ----------- | --- | --------- | --- | ------------ | --- | ------------- | ----------- | --- |
|              |      |          |     |         |           |             |     | We review | the | related work | in  | the following | categories: |     |
footprintandhigherutilizationofbandwidthcancontribute
|         |               |     |           |         |      |     |         | Cache-optimizedqueryprocessingonCPUs: |     |     |     |     |     | Cache |
| ------- | ------------- | --- | --------- | ------- | ---- | --- | ------- | ------------------------------------- | --- | --- | --- | --- | --- | ----- |
| more to | the reduction |     | of memory | stalls. | That | can | release |                                       |     |     |     |     |     |       |
optimizationstoimprovequeryprocessingperformancehave
thepowerfulcomputingstrengthsoftheGPUsandenhance
|             |              |     |     |     |     |     |     | been widely | studied    | in database |             | community. |                 | There are |
| ----------- | ------------ | --- | --- | --- | --- | --- | --- | ----------- | ---------- | ----------- | ----------- | ---------- | --------------- | --------- |
| the overall | performance. |     |     |     |     |     |     |             |            |             |             |            |                 |           |
|             |              |     |     |     |     |     |     | two major   | categories | along       | this study: |            | cache-conscious | [32]      |
Tostudytheimpactofdatasizes,weincreasescalefactor
|                     |     |     |                              |     |     |     |     | and cache-oblivious |            | [16]. | Cache-conscious |            | techniques | uti-      |
| ------------------- | --- | --- | ---------------------------- | --- | --- | --- | --- | ------------------- | ---------- | ----- | --------------- | ---------- | ---------- | --------- |
| (SF)from1to10onA10. |     |     | Theexperimentsareconductedin |     |     |     |     |                     |            |       |                 |            |            |           |
|                     |     |     |                              |     |     |     |     | lize cache          | parameters | (such | as cache        | capacities |            | and cache |
theoptimalschemeproducedfromthecostmodel(denoted
|     |     |     |     |     |     |     |     | line sizes) | to reduce | the memory |     | access | latency to | improve |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --------- | ---------- | --- | ------ | ---------- | ------- |
asopt). Forcomparison,resultswithfine-grainedapproach
|          |                |     |           |             |     |          |      | thedatabaseperformance. |     |     | Incontrast,cache-oblivioustech- |     |     |     |
| -------- | -------------- | --- | --------- | ----------- | --- | -------- | ---- | ----------------------- | --- | --- | ------------------------------- | --- | --- | --- |
| [19] are | also presented |     | in Figure | 16 (denoted |     | as old). | Both |                         |     |     |                                 |     |     |     |
niquesoptimizecacheperformancewithouttakingcachepa-
| opt andold | schemeshavegoodscalabilitywiththeincreas- |     |     |     |     |     |     |                  |     |                                  |     |     |     |     |
| ---------- | ----------------------------------------- | --- | --- | --- | --- | --- | --- | ---------------- | --- | -------------------------------- | --- | --- | --- | --- |
|            |                                           |     |     |     |     |     |     | rametersasinput. |     | Therehasbeenmuchmoreexistingwork |     |     |     |     |
ing scale factor.
|     |     |     |     |     |     |     |     | on cache-conscious |            | optimizations. |              | Manegold | et al.        | [5] pro- |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------ | ---------- | -------------- | ------------ | -------- | ------------- | -------- |
|     |     |     |     |     |     |     |     | posed a            | cost model | that           | can estimate |          | the execution | time     |
5.5 InsightsandImplications
|     |     |     |     |     |     |     |     | of query | processing. | However, | their | model | does | not cover |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | -------- | ----- | ----- | ---- | --------- |
Through the evaluations on operators and queries, we prefetchingorGPUco-processing. Recently,Pirketal. [27]
338

mem unit stalled mem unit not stalled mem unit stalled mem unit not stalled
|     | 100%                          |     |     |     |     |     |     | 100%                          |     |     |     |     |     |     |
| --- | ----------------------------- | --- | --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | --- | --- | --- |
|     |  yromem fo nwodkaerb emiT 90% |     |     |     |     |     |     |  yromem fo nwodkaerb emiT 90% |     |     |     |     |     |     |
|     | srossecorp owt no stinu       |     |     |     |     |     |     | srossecorp owt no stinu       |     |     |     |     |     |     |
|     | 80%                           |     |     |     |     |     |     | 80%                           |     |     |     |     |     |     |
|     | 70%                           |     |     |     |     |     |     | 70%                           |     |     |     |     |     |     |
|     | 60%                           |     |     |     |     |     |     | 60%                           |     |     |     |     |     |     |
|     | 50%                           |     |     |     |     |     |     | 50%                           |     |     |     |     |     |     |
|     | 40%                           |     |     |     |     |     |     | 40%                           |     |     |     |     |     |     |
|     | 30%                           |     |     |     |     |     |     | 30%                           |     |     |     |     |     |     |
|     | 20%                           |     |     |     |     |     |     | 20%                           |     |     |     |     |     |     |
|     | 10%                           |     |     |     |     |     |     | 10%                           |     |     |     |     |     |     |
|     |                               | 0%  |     |     |     |     |     | 0%                            |     |     |     |     |     |     |
C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU
|     |     | E   |     | PE  |     | opt |     |     | E   |     | PE  |     | opt |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
(a) Stall distribution of Q9 on A8 (b) Stall distribution of Q14 on A8
Figure 14: Memory stall distribution of different schemes between each CPU CU and the GPU on A8.
mem unit stalled mem unit not stalled mem unit stalled mem unit not stalled
|     | 100%                          |     |     |     |     |     |     | 100%                          |     |     |     |     |     |     |
| --- | ----------------------------- | --- | --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | --- | --- | --- |
|     |  yromem fo nwodkaerb emiT 90% |     |     |     |     |     |     |  yromem fo nwodkaerb emiT 90% |     |     |     |     |     |     |
|     | srossecorp owt no stinu       |     |     |     |     |     |     | srossecorp owt no stinu       |     |     |     |     |     |     |
|     | 80%                           |     |     |     |     |     |     | 80%                           |     |     |     |     |     |     |
|     | 70%                           |     |     |     |     |     |     | 70%                           |     |     |     |     |     |     |
|     | 60%                           |     |     |     |     |     |     | 60%                           |     |     |     |     |     |     |
|     | 50%                           |     |     |     |     |     |     | 50%                           |     |     |     |     |     |     |
|     | 40%                           |     |     |     |     |     |     | 40%                           |     |     |     |     |     |     |
|     | 30%                           |     |     |     |     |     |     | 30%                           |     |     |     |     |     |     |
|     | 20%                           |     |     |     |     |     |     | 20%                           |     |     |     |     |     |     |
|     | 10%                           |     |     |     |     |     |     | 10%                           |     |     |     |     |     |     |
|     |                               | 0%  |     |     |     |     |     | 0%                            |     |     |     |     |     |     |
C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU C0 C1 C2 C3GPU
|     |     | E   |     | PE  |     | opt |     |     | E   |     | PE  |     | opt |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
(a) Stall distribution of Q9 on A10 (b) Stall distribution of Q14 on A10
Figure 15: Memory stall distribution of different schemes between each CPU CU and the GPU on A10.
studied partial decomposition to save bandwidth without stores [21] and hash joins [19]) on this architecture. Most
sacrificing CPU cycles. Ross et al. [10] explored the ar- studieshavedemonstratedtheperformanceadvantageofthe
chitectural features that can affect the overall performance coupled architecture over the CPU-only or the GPU-only
of aggregations and hash joins. Balkesen et al. [3] advo- algorithm. Yang et al. [36] showed the effectiveness that
catedthatadditionalperformancecanbeobtainedthrough the CPU can assist the GPU through prefetching to highly
carefully tailoring algorithms to more efficiently utilize ar- improvetheperformanceoftheGPU.Ourstudyfocuseson
chitectural parameters such as cache sizes, TLB, and mem- databaseoperations,andgoesbeyondtheexistingstudiesin
orybandwidth. Anothereffectivemeanstoreducethecache two major aspects. Firstly, different from the homogeneous
misses is database compression (e.g., [9, 1]). workloaddistributionamongprocessors,ourframeworkpro-
Incomparison,ourin-cacheprocessingdesignexploitsthe cessesasinglequeryindatabasesincludingmanyoperators
advantages of the shared cache design of the coupled CPU- withvaryingandheterogeneousruntimefeatures. Secondly,
GPU architecture. we generalize the rolesof various device resources for query
Query co-processing on discrete GPUs: Because processingandhighlighttheefficiencyofin-cachedesignfor
discrete GPUs have much higher bandwidth and massive GPU query co-processing.
| thread parallelism |     | from  | CPUs,      | they | are ideal | choice        | for |     |     |     |     |     |     |     |
| ------------------ | --- | ----- | ---------- | ---- | --------- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| query processing.  |     | For a | long time, | the  | query     | co-processing |     |     |     |     |     |     |     |     |
wasachievedonthediscreteCPU-GPUarchitecture[15,17, 7. CONCLUSIONS
| 22, 6, 37,     | 28, 18].   | Wu et | al. [35] | introduced |          | a compiler | and      |            |          |         |          |         |                |           |
| -------------- | ---------- | ----- | -------- | ---------- | -------- | ---------- | -------- | ---------- | -------- | ------- | -------- | ------- | -------------- | --------- |
|                |            |       |          |            |          |            |          | In this    | paper,   | we have | proposed | an      | in-cache       | query co- |
| infrastructure | named      | Red   | Fox      | for OLAP   | queries. |            | Zhang et |            |          |         |          |         |                |           |
|                |            |       |          |            |          |            |          | processing | paradigm | on      | coupled  | CPU-GPU | architectures. |           |
| al. [38]       | and Heimel | et    | al. [20] | presented  | their    | findings   | in       |            |          |         |          |         |                |           |
WehaveadaptedCPU-assistedprefetchingtominimizethe
| designing | a portable | query | co-processing |     | engine | across | dif- |     |     |     |     |     |     |     |
| --------- | ---------- | ----- | ------------- | --- | ------ | ------ | ---- | --- | --- | --- | --- | --- | --- | --- |
cachemissesofGPUqueryco-processing,andCPU-assisted
ferentdevicesbyusingOpenCL.Ascompressioncanbenefit
|           |          |     |           |     |          |      |        | decompression | schemes |     | to improve | query | execution | perfor- |
| --------- | -------- | --- | --------- | --- | -------- | ---- | ------ | ------------- | ------- | --- | ---------- | ----- | --------- | ------- |
| the cache | and save | the | bandwidth | on  | the CPU, | Fang | et al. |               |         |     |            |       |           |         |
mance. Additionally,wehaveproposedacostmodeltopre-
[12] explored cascaded compression on discrete GPUs. dicttheexecutiontimeandchoosetheoptimalcoreassign-
Thoughworkloaddistributionsonco-processingparadigms ment plan. As the experimental results show, the in-cache
targeting the discrete CPU-GPU architecture are also het- co-processingparadigmcaneffectivelyreducetheimpactof
erogeneous, they are not designed to exploit the architec- memory stalls, thus improving the overall performance of
turalfeaturesofcoupledCPU-GPUdesignstoachievefine-
TPC-Hqueriesbyupto36%and40%overthestate-of-the-
| grainedworkloadscheduling. |     |     | Ourworkfocusesonbothde- |     |     |     |     |     |     |     |     |     |     |     |
| -------------------------- | --- | --- | ----------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
artfine-grainedmethodonAMDA8andA10,respectively.
| vices but                             | schedules         | the          | hardware-favored  |           | workload |         | to each   |                   |     |                |         |                |               |           |
| ------------------------------------- | ----------------- | ------------ | ----------------- | --------- | -------- | ------- | --------- | ----------------- | --- | -------------- | ------- | -------------- | ------------- | --------- |
|                                       |                   |              |                   |           |          |         |           | Such improvements |     | show           | that    | in-cache query | co-processing |           |
| of them                               | in a fine-grained |              | and heterogeneous |           |          | manner. |           |                   |     |                |         |                |               |           |
|                                       |                   |              |                   |           |          |         |           | is promising      | on  | coupled        | CPU-GPU | architectures. |               | As for    |
| StudiesoncoupledCPU-GPUarchitectures: |                   |              |                   |           |          |         | There     |                   |     |                |         |                |               |           |
|                                       |                   |              |                   |           |          |         |           | future work,      | we  | are interested |         | in extending   | our           | system to |
| have also                             | been              | some studies | (like             | MapReduce |          | [7],    | key-value |                   |     |                |         |                |               |           |
rowstores(e.g.,byrevisitingprefetchinganddatacompres-
339

sioninthecontextofrowstores)andinexploringtheissues [19] J. He, M. Lu, and B. He. Revisiting co-processing for
discussed in Section 5.5. hash joins on the coupled CPU-GPU architecture.
PVLDB, 2013.
8. ACKNOWLEDGEMENT [20] M. Heimel and et al. Hardware-oblivious parallelism
for in-memory column-stores. In PVLDB, 2013.
The authors would like to thank anonymous reviewers,
[21] T. H. Hetherington and et al. Characterizing and
Mr. Saurabh Jha and Ms. Khasfariyati Binte Razikin for
evaluating a key-value store application on
theirvaluablecomments. ThisworkissupportedbyaMoE
heterogeneous CPU-GPU systems. In ISPASS, 2012.
AcRF Tier 2 grant (MOE2012-T2-2-067) in Singapore.
[22] T. Kaldewey, G. Lohman, R. Mueller, and P. Volk.
9. REFERENCES GPU join processing revisited. In DaMoN, 2012.
[23] Khronos. The OpenCL specification. https://www.
[1] D. Abadi and et al. Integrating compression and
khronos.org/registry/cl/specs/opencl-2.0.pdf.
execution in column-oriented database systems. In
[24] C. Kim and et al. Sort vs. hash revisited: Fast join
SIGMOD, 2006.
implementation on modern multi-core CPUs. PVLDB,
[2] ARM. big.little processing.
2009.
http://www.arm.com/products/processors/
[25] C. Kim and et al. FAST: fast architecture sensitive
technologies/biglittleprocessing.php.
tree search on modern CPUs and GPUs. In SIGMOD,
[3] C. Balkesen and et al. Main-memory hash joins on
2010.
multi-coreCPUs: tunningtotheunderlyinghardware.
[26] K. Lee, H. Lin, and W.-C. Feng. Performance
In ICDE, 2013.
characterization of data-intensive kernels on AMD
[4] S. Blanas and et al. Design and evaluation of main
fusion architectures. Comput. Sci., 2013.
memory hash join algorithms for multi-core CPUs. In
[27] H. Pirk and et al. CPU and cache efficient
SIGMOD, 2011.
management of memory-resident databases. In ICDE,
[5] P. A. Boncz and et al. Database architecture
2013.
optimized for the new bottleneck: memory access. In
[28] H. Pirk, S. Mnegold, and M. Kersten. Waste not...
VLDB, 1999.
efficient co-processing of relational data. In ICDE,
[6] S. Breßand G. Saake. Why it is time for a HyPE: A
2014.
hybrid query processing engine for efficient GPU
[29] N. Satish and et al. Fast sort on CPUs and GPUs: a
coprocessing in DBMS. PVLDB, 2013.
case for bandwidth oblivious SIMD sort. In SIGMOD,
[7] L. Chen, X. Huo, and G. Agrawal. Accelerating
2010.
MapReduce on a coupled CPU-GPU architecture. In
[30] N. Satish, M. Harris, and M. Garland. Designing
SC, 2012.
efficient sorting algorithms for manycore GPUs. In
[8] S. Chen and et al. Improving hash join performance
IPDPS, 2009.
through prefetching. TODS, 2007.
[31] P. G. Selinger and et al. Access path selection in a
[9] Z. Chen, J. Gehrke, and F. Korn. Query optimization
relational database management system. In SIGMOD,
in compressed database systems. In SIGMOD, 2001.
1979.
[10] J. Cieslewicz, W. Mee, and K. A. Ross.
[32] A. Shatdal, C. Kant, and J. F. Naughton. Cache
Cache-conscious buffering for database operators with
conscious algorithms for relational query processing.
state. In DaMoN, 2009.
In VLDB, 1994.
[11] J. Fang, A. L. Varbanescu, and H. Sips. A
[33] Sony Computer Entertainment, Inc. Playstation 4
comprehensive performance comparison of CUDA and
specifications. http:
OpenCL. In ICPP, 2011.
//us.playstation.com/ps4/features/techspecs/.
[12] W. Fang, B. He, and Q. Luo. Database compression
[34] K. Thouti and S.R.Sathe. Comparison of OpenMP
on graphics processors. PVLDB, 2010.
and OpenCL parallel processing technologies.
[13] N. Govindaraju and et al. GPUTeraSort: high
IJACSA, 2012.
performance graphics co-processor sorting for large
[35] H. Wu and et al. Red fox: an execution environment
database management. In SIGMOD, 2006.
for relational query processing on GPUs. In CGO,
[14] N. K. Govindaraju and D. Manocha. Efficient
2014.
relational database management using graphics
[36] Y. Yang, P. Xiang, M. Mantor, and H. Zhou.
processors. In DaMoN, 2005.
CPU-assisted GPGPU on fused CPU-GPU
[15] B. He, M. Lu, K. Yang, R. Fang, N. K. Govindaraju,
architectures. In HPCA, 2012.
Q. Luo, and P. V. Sander. Relational query
[37] Y. Yuan, R. Lee, and X. Zhang. The yin and yang of
coprocessing on graphics processors. ACM TODS,
processing data warehousing queries on GPU devices.
2009.
PVLDB, 2013.
[16] B. He and Q. Luo. Cache-oblivious databases:
[38] S. Zhang, J. He, B. He, and M. Lu. OmniDB: towards
limitations and opportunities. ACM Trans. Database
portable and efficient query processing on parallel
Syst., 2008.
CPU/GPU architectures. In VLDB (demo), 2013.
[17] B. He, K. Yang, R. Fang, M. Lu, N. Govindaraju,
[39] J. Zhou and et al. Improving database performance on
Q. Luo, and P. Sander. Relational joins on graphics
simultaneous multithreading processors. In VLDB,
processors. In SIGMOD, 2008.
2005.
[18] B. He and J. X. Yu. High-throughput transaction
executions on graphics processors. PVLDB, 2011.
340