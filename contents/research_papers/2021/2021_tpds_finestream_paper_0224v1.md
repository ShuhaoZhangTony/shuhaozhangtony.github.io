| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |            |             |     |               |        |     |     |            |     |     |     | 1   |
| ----------------------------------------------- | --- | --- | --- | ---------- | ----------- | --- | ------------- | ------ | --- | --- | ---------- | --- | --- | --- | --- |
| Fine-Grained                                    |     |     |     |            | Multi-Query |     |               | Stream |     |     | Processing |     |     |     |     |
|                                                 |     |     | on  | Integrated |             |     | Architectures |        |     |     |            |     |     |     |     |
Feng Zhang, Chenyang Zhang, Lin Yang, Shuhao Zhang, Bingsheng He, Wei Lu, and Xiaoyong Du
Abstract—Exploringthesharingopportunitiesamongmultiplestreamqueriesiscrucialforhigh-performancestreamprocessing.
Modernstreamprocessingnecessitatesacceleratingmultiplequeriesbyutilizingheterogeneouscoprocessors,suchasGPUs,and
thishasshowntobeaneffectivemethod.EmergingCPU-GPUintegratedarchitecturesintegrateCPUandGPUonthesamechipand
eliminatePCI-ebandwidthbottleneck.Suchanovelarchitectureprovidesnewopportunitiesforimprovingmulti-queryperformancein
streamprocessingbuthasnotbeenfullyexploredbyexistingsystems.Weintroduceastreamprocessingengine,calledFineStream,
forefficientmulti-querywindow-basedstreamprocessingonCPU-GPUintegratedarchitectures.FineStream’skeycontributionisa
novelfine-grainedworkloadschedulingmechanismbetweenCPUandGPUtotakeadvantageofbotharchitectures.Particularly,
FineStreamisabletoefficientlyhandlemultiplequeriesinbothstaticanddynamicstreams.Ourexperimentalresultsshowthat1)on
integratedarchitectures,FineStreamachievesanaverage52%throughputimprovementand36%lowerlatencyoverthe
state-of-the-artstreamprocessingengine;2)comparedtothecoarse-grainedstrategyofapplyingdifferentdevicesformultiplequeries,
FineStreamachieves32%throughputimprovement;3)comparedtothestreamprocessingengineonthediscretearchitecture,
FineStreamontheintegratedarchitectureachieves10.4xprice-throughputratio,1.8xenergyefficiency,andcanenjoylowerlatency
benefits.
IndexTerms—Fine-grained,streamprocessing,CPU,GPU,integratedarchitectures.
(cid:70)
1 INTRODUCTION
carefullydesignedtohidethePCI-eoverhead.Forexample,
|             |     |              |     |           |     |        | prior  | works | have | explored | pipelining |     | the computation |     | and |
| ----------- | --- | ------------ | --- | --------- | --- | ------ | ------ | ----- | ---- | -------- | ---------- | --- | --------------- | --- | --- |
| Multi-query |     | optimization | is  | essential | to  | modern | stream |       |      |          |            |     |                 |     |     |
communicationtohidethePCI-etransmissioncost[4],[8].
| processing | systems. | Driven | by  | the | rise of | the internet | of  |     |     |     |     |     |     |     |     |
| ---------- | -------- | ------ | --- | --- | ------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
things (IoT) and widely deployed 5G sensor networks, Hardware vendors have released integrated architec-
turesinrecentyears,whichcompletelyremovePCI-eover-
| many real-world |     | applications, |     | such | as cluster | monitoring, |     |     |     |     |     |     |     |     |     |
| --------------- | --- | ------------- | --- | ---- | ---------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
head.WehaveseenCPU-GPUintegratedarchitecturessuch
anomalydetectioninsmartgrids,androadtollingsystems,
|           |          |          |     |           |           |       | as   | NVIDIA | Denver | [9], | AMD | Kaveri | [10], | and Intel | Sky- |
| --------- | -------- | -------- | --- | --------- | --------- | ----- | ---- | ------ | ------ | ---- | --- | ------ | ----- | --------- | ---- |
| have been | proposed | recently |     | [1], [2], | [3]. They | often | have |        |        |      |     |        |       |           |      |
common interests in the same data streams, leading to lake [11]. They fuse CPUs and GPUs on the same chip
andletbothCPUsandGPUssharethesamememory,thus
| tremendous | sharing | opportunities |     | among |     | queries. | Due to   |     |           |      |              |     |           |      |       |
| ---------- | ------- | ------------- | --- | ----- | --- | -------- | -------- | --- | --------- | ---- | ------------ | --- | --------- | ---- | ----- |
|            |         |               |     |       |     |          | avoiding |     | the PCI-e | data | transmission |     | overhead. | Such | inte- |
therigidrequirementandcomplexitiesofhandlingmultiple
queries in streams, accelerating stream processing engines gration poses new opportunities for multi-query window-
|              |        |     |              |     |        |              | based | stream | processing |     | from | both hardware |     | and | software |
| ------------ | ------ | --- | ------------ | --- | ------ | ------------ | ----- | ------ | ---------- | --- | ---- | ------------- | --- | --- | -------- |
| has recently | become | a   | hot research |     | topic. | GPUs consist | of    |        |            |     |      |               |     |     |          |
perspectives.
| a large | number | of lightweight |     | computing |     | cores, which | are |     |     |     |     |     |     |     |     |
| ------- | ------ | -------------- | --- | --------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
naturallysuitablefordata-intensivestreamprocessingwith First,incontrasttodiscreteCPU-GPUarchitectureswith
|     |     |     |     |     |     |     | a separate |     | memory | hierarchy, |     | the integrated |     | architectures |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------ | ---------- | --- | -------------- | --- | ------------- | --- |
multi-querysupported.Priorstudies[4],[5],[6]haveshown
provideunifiedphysicalmemory.Theinputqueriescanbe
thatGPUscanbesuccessfullyutilizedtoimprovethemulti-
querystreamprocessingperformance. processed in the shared memory of both CPUs and GPUs,
|         |         |            |                 |     |               |               | which        | avoids | the  | data        | transmission |          | between | two      | memory |
| ------- | ------- | ---------- | --------------- | --- | ------------- | ------------- | ------------ | ------ | ---- | ----------- | ------------ | -------- | ------- | -------- | ------ |
| GPUs    | are     | often used | as coprocessors |     | that          | are connected |              |        |      |             |              |          |         |          |        |
|         |         |            |                 |     |               |               | hierarchies, |        | thus | eliminating |              | the data | copy    | overhead | via    |
| to CPUs | through | PCI-e      | [7]. Under      |     | such discrete | architec-     |              |        |      |             |              |          |         |          |        |
PCI-e.
| tures, the | input | stream | needs | to be | moved | from the | main |     |     |     |     |     |     |     |     |
| ---------- | ----- | ------ | ----- | ----- | ----- | -------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
memorytotheGPUmemoryviaPCI-ebeforeGPUprocess- Second, via fine-grained cooperations between CPUs
|     |     |     |     |     |     |     | and | GPUs, | the | integrated | architecture |     | makes | it  | possible |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | ---------- | ------------ | --- | ----- | --- | -------- |
ing.Asaresult,thelowbandwidthofPCI-eseverelylimits
|     |     |     |     |     |     |     | for | processing | dynamic |     | workloads. |     | Streaming | queries | can |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------- | --- | ---------- | --- | --------- | ------- | --- |
theperformancegainofstreamprocessingonGPUs.Subse-
quently,multi-querystreamprocessingonGPUsneedstobe consist of multiple operators with varying performance
|     |     |     |     |     |     |     | features | on  | different | processors. |     | Furthermore, |     | stream | pro- |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | --------- | ----------- | --- | ------------ | --- | ------ | ---- |
cessingofteninvolvesadynamicinputworkload,whichaf-
| • F. Zhang, | C.  | Zhang, L. | Yang, W. | Lu, and | X. Du | are with | the Key |     |     |     |     |     |     |     |     |
| ----------- | --- | --------- | -------- | ------- | ----- | -------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
Laboratory of Data Engineering and Knowledge Engineering (MOE), fectsoperatorperformancebehaviorsaswell.Wecanplace
andwiththeSchoolofInformation,RenminUniversityofChina,Beijing operators on different devices with proper workloads in a
100872,China. fine-grained manner, without worrying about transmission
•
| S. Zhang | is  | with the Database | Systems | and | Information | Management |     |     |     |     |     |     |     |     |     |
| -------- | --- | ----------------- | ------- | --- | ----------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Group(DIMA),TechnischeUniversita¨tBerlin,Berlin10623,Germany. overheadbetweenCPUsandGPUs.
• B.HeiswiththeSchoolofComputing,NationalUniversityofSingapore, Based on the above analysis, we argue that multi-query
119077,Singapore. stream processing on integrated architectures can have
muchmoredesirablepropertiesthanthatondiscreteCPU-

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     | 2   |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
GPUarchitectures.Tofullyexploitthebenefitsofintegrated advantages of the special features of integrated ar-
architectures for stream processing, we propose a fine- chitectures.
grained stream processing framework, called FineStream. • It presents lightweight query plan adaptations for
The fine-grained mechanism refers to that the operators handling dynamic workloads with the performance
in one query can be allocated to different devices, which model that considers both operator and architecture
is different from the mechanism that all the operators in characteristics.
a query need to be mapped to the same device, so-called • It develops operator sharing and stream ingestion
coarse-grainedmechanism.Inthispaper,aqueryrepresents rate detection to handle multiple queries in both
a statement from a user to view data in streams. Currently, single-streamandmulti-streamsituationsefficiently.
we support queries with five basic kinds of operators: • ItevaluatesFineStreamonasetofstreamqueriesto
projection, selection, aggregation, group-by, and join. Note that demonstrate the performance benefits over current
moreoperatorscanbesupportedinthefuture.Moredetails approaches.
| are presented | in Section     | 6. Our preliminary | work has           | been         |     |            |     |     |
| ------------- | -------------- | ------------------ | ------------------ | ------------ | --- | ---------- | --- | --- |
| presented     | in [12], which | supports           | only single query. | In           |     |            |     |     |
|               |                |                    |                    | 2 BACKGROUND | AND | MOTIVATION |     |     |
practice,usersmaysubmitmultiplequeriesforthesameor
|     |     |     |     | 2.1 Multi-QueryStreamProcessingwithSQL |     |     |     |     |
| --- | --- | --- | --- | -------------------------------------- | --- | --- | --- | --- |
differentinputstreams.Inthiswork,weextendFineStream
to support multiple queries. Specifically, we propose the Variousmulti-queryprocessingsystemshaveappeared[4],
followingkeytechniques.First,aperformancemodelispro- [5],[6].Inthispaper,aqueryisawayofrequestinginforma-
posed considering both operator topologies and different tionfromastreamwithcontinuoussemantics.Accordingly,
device characteristics of integrated architectures. Second, a multi-query in this work refers to the usage of multiple
light-weightschedulerisdevelopedtoefficientlyassignthe queriestoretrieveinformationonthesamemachinewithno
| operators | of a query to | different processors. | Third, | online |     |     |     |     |
| --------- | ------------- | --------------------- | ------ | ------ | --- | --- | --- | --- |
furtherrestrictions.TheclosestworktooursisSaber[4],[5].
profilingwithcomputingresourceandtopologyadjustment Saber adopts a bulk-synchronous parallel model [13] for hid-
is involved for dynamic workloads. Fourth, novel designs ing PCI-e transmission overhead, and supports structured
of operator sharing and ingestion rate detection among query language (SQL) on stream data [14]. The benefits of
differentquerieshavebeenproposedtohandlemulti-query supporting SQL come from two aspects. First, with SQL,
workloadsefficiently. users can use familiar SQL commands to access the re-
We evaluate FineStream on two platforms, AMD quiredrecords,whichmakesthesystemeasytouse.Second,
A10-7850K, and Ryzen 5 2400G. Experiments show that supporting SQL eliminates the tedious programming oper-
FineStreamachieves52%throughputimprovementand36% ations about how to reach a required record, which greatly
lower latency over the state-of-the-tart CPU-GPU stream expands the flexibility of its usage. Based on the analysis,
processing engine on the integrated architecture. Com- thisworkisabouttoexploremulti-querystreamprocessing
pared to the best single processor throughput, it achieves withSQLonintegratedarchitectures.
88% performance improvement. For multi-query process- Multiple queries can be transformed into a uniformed
ing, FineStream achieves 32% throughput improvement query for processing in FineStream. For simplicity, we use
compared to the bulk-synchronous strategy [13] of allocat- one stream in Figure 1 for illustration. According to [14],
ing different queries to different devices without further SQL on stream processing consists of the following four
|     |     |     |     | major concepts: | 1) Data | stream S, which | is a sequence | of  |
| --- | --- | --- | --- | --------------- | ------- | --------------- | ------------- | --- |
operator-levelpartitioning.
We also compare stream processing on integrated ar- tuples, < t 1,t 2,...>, where t i is a tuple. A tuple is a finite
chitectures with that on discrete CPU-GPU architectures. ordered list of elements, and each tuple has a timestamp.
|                |       |                 |               | 2) Window | w, which refers | to a finite | sequence of | tuples, |
| -------------- | ----- | --------------- | ------------- | --------- | --------------- | ----------- | ----------- | ------- |
| Our evaluation | shows | that FineStream | on integrated | ar-       |                 |             |             |         |
chitectures achieves 10.4x price-throughput ratio, and 1.8x which is the data unit to be processed in a query. The
energyefficiency.WhenwecompareFineStreamintegrated windowinstreamhastwofeatures:windowsizeandwindow
|               |             |            |                       | slide. Window | size represents | the size of | the data unit | to be |
| ------------- | ----------- | ---------- | --------------------- | ------------- | --------------- | ----------- | ------------- | ----- |
| architectures | with stream | processing | on discrete architec- |               |                 |             |               |       |
tures, although a discrete GPU could have 10× higher processed, and window slide denotes the sliding distance
computation capacity and 22× higher bandwidth than the between two adjacent windows. 3) Operators, which are
integratedarchitecture,thePCIetransmissioncouldbecome the minimum processing units for the data in a window.
itsbottleneck.Incontrast,theintegratedarchitectureavoids In this work, we support common relational operators in-
PCIe transmission. Under the circumstances that the data cludingprojection,selection,aggregation,group-by,andjoin.4)
transmission time is long and the transmission overhead Queries,whichareaformofdataprocessing,eachofwhich
|     |     |     |     | consists | of at least one operator | and is | based on windows. |     |
| --- | --- | --- | --- | -------- | ------------------------ | ------ | ----------------- | --- |
exceedstheperformancebenefitsbroughtbydiscreteGPUs
of the discrete architectures, FineStream is able to achieve Additionally, note that in real stream processing systems
lower processing latency, compared to the state-of-the-art such as Saber [4], data are processed in batch granularity,
|     |     |     |     | instead | of window granularity. | A batch | can be a group | of  |
| --- | --- | --- | --- | ------- | ---------------------- | ------- | -------------- | --- |
executionondiscretearchitectures.Moredetailsareshown
in Section 8.4. This further validates the large potential windows when the window size is small, or a part of a
of exploring the integrated architectures for data stream windowwhenthewindowsizeisextremelylarge.
processing.
|     |     |     |     | 2.2 IntegratedArchitecture |     |     |     |     |
| --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- |
Overall,thisworkmakesthefollowingcontributions:
|     |     |     |     | An architectural | overview | of the CPU-GPU | integrated | ar- |
| --- | --- | --- | --- | ---------------- | -------- | -------------- | ---------- | --- |
• It proposes the first fine-grained window-based re- chitecture is shown in Figure 2. The integrated architecture
lational stream processing framework that takes the consists of a CPU, a GPU, a shared memory management

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 3
window size
TABLE1
Integratedarchitecturesvs.discretearchitectures.
window w1
data stream
IntegratedArchitectures DiscreteArchitectures
… tuple … Architecture A10-7850K Ryzen52400G GTX1080Ti V100
#cores 512+4 704+4 3584 5120
window w2 TFLOPS 0.9 1.7 11.3 14.1
bandwidth(GB/s) 25.6 38.4 484.4 900
window slide query price($) 209 169 1100 8999
TDP(W) 95 65 250 300
… results ThenumberofcoresforeachintegratedarchitectureincludesfourCPUcores.
Fordiscretearchitectures,weonlyshowtheGPUdevice.
operators
Fig.1.StreamprocessingwithSQL.
device (CPU or GPU), which minimizes the PCI-e commu-
nication overhead among operators inside the same query.
unit, and system DRAM. CPUs and GPUs have their own In contrast, the integrated architectures provide unified
caches. Some models of integrated architectures, such as physical memory. The input queries can be processed in
Intel Haswell i7-4770R processor [15], integrate a shared the shared memory, which avoids the data transmission
last-levelcacheforbothCPUsandGPUs.Thesharedmem- between the CPU and GPU memory hierarchies. Second,
ory management unit is responsible for scheduling access streaming queries can consist of multiple operators with
to system DRAM by different devices. Compared to the varying performance features on different processors. We
discrete CPU-GPU architecture, both CPUs and GPUs are canplaceoperatorsontheirpreferreddevicewithoutworry-
integrated on the same chip. The most attractive feature of ingabouttransmissionoverheadbetweenCPUsandGPUs.
suchintegrationisthesharedmainmemory,whichisavail- Third, with shared memory, light-weight resource reallo-
able to both devices. With the shared main memory, CPUs cation and query plan adjustment can be conducted for
and GPUs can have more opportunities for fine-grained dynamicworkloads.
cooperation.Themostcommonlyusedprogrammingmodel
for integrated architectures is OpenCL [16], which regards 3 REVISITING STREAM PROCESSING
the CPU and the GPU as devices. Each device consists of
In this section, we discuss in detail the new opportunities
several compute units (CUs), which are the CPU and GPU
(Section 3.1) and challenges (Section 3.2) for multi-query
coresinFigure2.
streamprocessingonintegratedarchitectures.
CPU GPU
3.1 VaryingOperator-DevicePreference
CPU CPU CPU GPU GPU GPU
… …
core core core core core core Opportunities: Due to the elimination of transmission
cost between CPU and GPU devices on integrated ar-
CPU Cache GPU Cache
chitectures, we can assign operators to CPU and GPU
Shared Memory Management Unit devicesinafine-grainedmanneraccordingtotheirdevice-
preference.
We analyze the operators in multiple queries, and find
System DRAM
that different operators show various device preferences
Fig.2.Ageneraloverviewoftheintegratedarchitecture. on integrated architectures. Some operators achieve higher
performance on the CPU device, and others have higher
Table1showsacomparisonbetweentheintegratedand
performance on the GPU device. We use a synthetically
discrete architectures (discrete GPUs). These architectures
generated dataset for illustration, which is explained in
are used in our evaluation (Section 8). Although the inte-
detail in Section 8.1. The performance results on the other
grated architectures have lower computation capacity than
datasetsalsoexhibitsimilarobservation:usingasingletype
the discrete architectures currently, the integrated architec-
of device cannot achieve the optimal performance for all
tureisapotentialtrendforafuturegenerationofprocessors.
operators. For example, we use a simple query of group-by
Hardware vendors, including AMD [10], Intel [11] and
andaggregationontheintegratedarchitectureforanalysis,as
NVIDIA [9], all release their CPU-GPU integrated archi-
shown in Figure 3. The GPU queue is used to sequentially
tectures, which couple the CPU and the GPU on the same
execute the queries on the GPU, while the CPU queue is
chip.Moreover,futureintegratedarchitecturescanbemuch
usedtoexecutetherelatedqueriesontheCPU.Thewindow
more powerful, even can be a competitive building block
size is 256 tuples and the window slide is 64. Each batch
for exascale HPC systems [17], [18], and the insights and
contains 64,000 tuples, and each tuple is 32 bytes. The
methods in this paper still can be applied. Besides, the
inputdataaresyntheticallygenerated,whichisdescribedin
integrated architectures are attractive due to its efficient
Section8.1.WhenthequeryrunsontheCPU,group-bytakes
powerconsumption[19],[20]andlowprice[21].
about18.2msandaggregationtakesabout5.2ms.However,
2.3 Motivation
when the query runs on the GPU, group-by takes about 6.7
The integrated architectures bring new opportunities to msandaggregationtakesabout5.8ms.
stream processing. First, previous heterogeneous stream We further evaluate the performance of operators on a
frameworks, such as Saber [4], aim to utilize discrete CPU- single device in Table 2. Table 2 shows that using a single
GPU architectures by dispatching the whole query on one type of device cannot achieve the optimal performance for

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 4
query on CPU query on GPU both architecture characteristics and operator features con-
GPU queue: operator 1 operator 2 sidered.
18.2 ms 5.2 ms
group-by aggregation However,enablingmulti-queryfine-grainedstreampro-
operator 1 operator 2 6.7 ms 5.8 ms cessingonintegratedarchitecturesiscomplicatedbythefea-
CPU queue: group-by aggregation turesofSQLstreamprocessingandintegratedarchitectures.
time
Wesummarizethreemajorchallengesasfollows.
Fig.3.Anexampleofoperator-devicepreference.
Challenge 1: Application topology combined with ar-
chitectural characteristics. Application topology in stream
processing refers to the organization and execution order
alloperators.Theaggregationincludestheoperatorsofsum,
of the operators in a SQL query. First, the relation among
count, and average, and they have similar performance. We
operatorscouldbemorecomplicatedinpractice.Theoper-
use sum as a representative for aggregation. From Table 2,
atorsmayberepresentedasadirectedacyclicgraph(DAG),
we can see that projection, selection, and group-by achieve
instead of a chain, which contains more parallel accelera-
better performance on the GPU than on the CPU, while
tionopportunities.Second,witharchitecturalcharacteristics
aggregationandjoinachievebetterperformanceontheCPU
considered, such as the CPU and GPU architectural differ-
than on the GPU. Additionally, projection shows similar
ences, the topology with computing resource distribution
performanceonCPUandGPUdevices.Specifically,forjoin,
becomes very complex. In such situations, how to perform
the CPU performance is about 6x the GPU performance.
fine-grained operator placement for application topology
Suchdifferentdevicepreferencesinspireustoperformfine-
on different devices of integrated architectures becomes a
grainedstreamprocessingonintegratedarchitectures.
challenge. Third, to assist effective scheduling decisions, a
performance model is needed to predict the benefits from
TABLE2
variousperspectives.
Performance(tuples/s)ofoperatorsontheCPUandtheGPUofthe
integratedarchitecture. Challenge2:SQLqueryplanoptimizationwithshared
main memory. First, multiple SQL queries in stream pro-
Operator CPUonly(106) GPUonly(106) Devicechoice
cessing can consist of many operators, and the execution
projection 14.2 14.3 GPU
selection 13.1 14.1 GPU plan of these operators may cause different bandwidth
aggregation 14.7 13.5 CPU pressures and device preferences. Second, in many cases,
group-by 8.1 12.4 GPU
independent operators may not consume all the memory
join 0.7 0.1 CPU
bandwidth,butco-runningthemtogethercouldexceedthe
bandwidth limit. We need to analyze the memory band-
Integratedarchitectureseliminatedatatransmissioncost
width requirement of co-running. Third, CPUs and GPUs
betweenCPUandGPUdevices.Thisprovidesopportunities
have different preferred memory access patterns. Current
for multi-query stream processing with operator-level fine-
methods [4], [8], [23], [24], [25], [26], [27] do not consider
grained placement. The operators that can fully utilize the
these complex situations of shared main memory in inte-
GPU capacity exhibit higher performance on GPUs than
gratedarchitectures.
on CPUs, so these operators shall be executed on GPUs.
Challenge 3: Adjustment for dynamic workload. Dur-
In contrast, the operators with low parallelism shall be
ing stream processing, stream data are changing dynami-
executed on CPUs. Please note that such fine-grained co-
callyindistributionsandarrivalspeeds,whichischalleng-
operation is inefficient on discrete CPU-GPU architectures
ingtoadapt.First,workloadchangedetectionandcomput-
due to transmission overhead. For example, Saber [4], one
ing resource adjustment need to be done in a lightweight
of the state-of-the-art stream processing engines utilizing
manner, and they are critical to performance. Second, the
the discrete CPU-GPU architecture, is designed aiming to
queryplanmayalsoneedtobeupdatedadaptively,because
hide PCI-e overhead. It adopts a micro-batch execution
the operator placement strategy based on the initial state
model which minimizes cross-operator communication but
maynotbesuitablewhentheworkloadchanges.Third,dur-
restrictsoperatorschedulingflexibilitysincealloperatorsof
ingadaptation,onlinestreamprocessingneedstobeserved
a query must be scheduled to one processor to process a
efficiently. Resource adjustment and query plan adaptation
micro-batchofdata[22].
on the fly may incur runtime overhead. The reason is that
3.2 Fine-GrainedMulti-QueryStreamProcessing we need to adjust not only the operators in the DAG but
also the hardware computing resources to each operator.
Challenges: A fine-grained multi-query stream process-
Additionally, the adjustment among different streams also
ing that considers both architecture characteristics and
needstobeconsidered.
operator preference shall have better performance, but
thisinvolvesseveralchallenges,frombothapplicationand
architectureperspectives. 4 FINESTREAM OVERVIEW
Basedontheanalysis,wearguethatmulti-querystream For fine-grained multi-query stream processing on in-
processing on integrated architectures can have more de- tegrated architectures, we propose a framework, called
sirable properties than that on discrete CPU-GPU archi- FineStream. The overview of FineStream is shown in Fig-
tectures. Particularly, this work introduces a concept of ure4.FineStreamconsistsoffourmajorcomponents,includ-
multi-queryfine-grainedstreamprocessing:co-runningthe ing performance model, online profiling, dispatcher, and
operators to utilize the shared memory on integrated ar- multi-query handling. The online profiling module is used
chitectures, and dispatching the operators on devices with toanalyzeinputbatchesandqueriesformemorybandwidth

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     |     |     |     |     | 5   |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
and throughput (detailed in Section 7.3), which is then operator path that determines the total execution time as
fed into the performance model. The performance model path critical, so the branch with the longest execution time
belongstopath
module uses the collected data to build models for queries critical.Forexample,weassumethatbranch2
with both CPUs and GPUs to assist operator dispatching. hasthelongestexecutiontimeamongthebranches,itstime
The dispatcher module assigns stream data to operators is t branch2, and the execution time for OPi is t OPi. OP7
OP11
withproperprocessorsaccordingtotheperformancemodel and can also be regarded as branches. Only when
onthefly.Themulti-queryhandlingmodulestartstowork the outcomes of OP3 and OP6 are available, then OP7 can
ifmultiplequeriesaredetected. proceed. So do to the operators of OP7 and OP10 to OP11.
|             |           |     |                      |      |        | Assuming | OP7 | and OP11 | are blocking |     | join operators, | the |
| ----------- | --------- | --- | -------------------- | ---- | ------ | -------- | --- | -------- | ------------ | --- | --------------- | --- |
| Multi-query | handling. |     | For multiple queries | in a | single |          |     |          |              |     |                 |     |
stream, we transform the multiple queries into the same total execution time for this query is the sum of t branch2,
| one, because                            | the input      | for         | different queries | is the          | same. | t OP7,andt | OP11.   |         |     |     |              |     |
| --------------------------------------- | -------------- | ----------- | ----------------- | --------------- | ----- | ---------- | ------- | ------- | --- | --- | ------------ | --- |
| For multiple                            | queries        | in multiple | streams,          | we use separate |       |            |         |         |     |     |              |     |
| threads                                 | with different | computing   | resources         | to handle       | each  |            | branch1 |         |     |     |              |     |
|                                         |                |             |                   |                 |       |            |         | OP1 OP2 | OP3 |     |              |     |
| stream.WeelaboratethedetailsinSection6. |                |             |                   |                 |       |            |         |         |     |     | pathcritical |     |
|                                         |                |             |                   |                 |       |            | branch2 |         |     | OP7 |              |     |
|                                         |                |             |                   |                 |       |            |         | OP4 OP5 | OP6 |     | OP11         |     |
stream
|     | batch  |     | batch      |            |     |                          |         |          |           |        |                 |       |
| --- | ------ | --- | ---------- | ---------- | --- | ------------------------ | ------- | -------- | --------- | ------ | --------------- | ----- |
| …   |        |     |            |            | …   |                          | branch3 | OP8 OP9  | OP10      |        |                 |       |
|     |        |     |            |            |     | Fig. 5. An               | example | of query | operators | in DAG | representation, | where |
|     | online |     |            | FineStream |     |                          |         |          |           |        |                 |       |
| SQL |        |     | dispatcher |            |     | OPirepresentsanoperator. |         |          |           |        |                 |       |
profiling
|     |     |     | operators |     |     | Batch | vs Window. |     | FineStream | processes | stream | data |
| --- | --- | --- | --------- | --- | --- | ----- | ---------- | --- | ---------- | --------- | ------ | ---- |
multi-query
op1 op2 op1 at batch granularityO.P1MoreOoP2ver,…previOoPu is studies such as
handling
|     |     |     |     | results |     | Saber[4]alsousebatches.However,usersdeOfiPn xequeriesin |     |     |     |     |     |     |
| --- | --- | --- | --- | ------- | --- | ------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
dev dev dev window granularityO.PA3 comOPm4 on…questOiPo jn is why w e need
|     | performance |     |     |     |     |     |     |     |     |     |     | O P y |
| --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- |
device mapping
model to use batch instead of using window … directly. The reason
|     |     |     |     |     |     |           |         | OP5     | OP6             |     | OP k    |        |
| --- | --- | --- | --- | --- | --- | --------- | ------- | ------- | --------------- | --- | ------- | ------ |
|     |     |     |     |     |     | for using | batches | relates | to parallelism: |     | we want | to use |
Fig.4.FineStreamoverview. the proper size of the data unit to exploit the hardware
|     |     |     |     |     |     | parallelism, | but | the window | size | is application | dependent. |     |
| --- | --- | --- | --- | --- | --- | ------------ | --- | ---------- | ---- | -------------- | ---------- | --- |
Next, we discuss the ideas in FineStream, including its Whentheuser-definedwindowsizeissmall,theenginecan
workflow, query plan generation, processing granularity, organizeagroupofwindowsasabatch,anddistributesthe
operator mapping, and solutions to the challenges men- batch to the related operators on CPUs or GPUs for pro-
tionedinSection3.2. cessingatarelativelylargergranularity.Whenthewindow
Workflow. The workflow of FineStream is as follows. sizeistoolarge,awindowcanbesplitintoseveralbatches.
When the engine starts, it first processes several batches Therefore, batch can be regarded as a tuning parameter in
using only the CPUs or the GPUs for each query to gather systemoptimizations,whilewindowbelongstoapplication
| usefuldata.Second,basedonthesedata,itbuildsaperfor- |     |     |     |     |     | semantics. |     |     |     |     |     |     |
| --------------------------------------------------- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- |
mance model for operators of a query on different devices. Operator Mapping. The fine-grained scheduling lies in
Third, after the performance model is built, the dispatcher how to map the operators to the limited resources on in-
starts to work, and the fine-grained stream processing be- tegratedarchitectures.InFineStream,weallowanoperator
gins.EachoperatorshallbeassignedtothecoresoftheCPU to use one or several cores of the CPU or the GPU device.
| or the GPU | for parallel | execution. | Additionally, | the | work- |     |     |     |     |     |     |     |
| ---------- | ------------ | ---------- | ------------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- |
Whentheplatformcannotprovideenoughresourcesforall
loadcouldbedynamic.Fordynamicworkload,queryplan theoperators,someoperatorsmaysharethesamecompute
adjustmentandresourcereallocationneedtobeconducted. units.Forexample,inFigure5,whenFineStreamprocesses
|     |     |     |     |     |     |     |     |     | OP2 |     | OP1 |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Topology.ThequeryplancanberepresentedasaDAG. different batches in stream, and can execute si-
In this paper, we concentrate on relational queries. We multaneously:whenOP2processesthefirstbatch,OP1can
show an example in Figure 5, where OP represents an starttoprocessthesecondbatchinparallel.However,when
i
operator. OP7 and OP11 can represent joins. We follow the the platform is unable to provide enough resources for
terminology in compiler domain [28], and call the opera- parallelizing OP1 and OP2 at the batch level, we can map
tors from the beginning or the operator after join to the both OP1 and OP2 to the same core. If so, OP1 and OP2
operator that merges with another operator as a branch. canberegardedasawholeoperatorthatcannotbesplitfor
Hence, the query plan is also a branch DAG. For example, furtherfine-grainedbatch-levelparallelism.
the operators of OP1, OP2, and OP3 form a branch in Solutions to Challenges. FineStream addresses all the
Figure5.Themainreasonweusethebranchconceptisfor challengesmentionedinSection3.2.Forthefirstchallenge,
parallelism:operatorswithinabranchcanbeevaluatedina the performance model module estimates the overall per-
pipeline,anddifferentbranchescanbeexecutedinparallel, formance with the help of the online profiling module by
which shall be detailed in Section 5. The execution time in samplingonasmallnumberofbatches,andthedispatcher
processing one batch is equal to the traversal time from dynamicallyputstheoperatorsonthepreferreddevices.For
the beginning to the end of the DAG. Because branches the second challenge, we have considered the bandwidth
can be processed in parallel, the branch with the longest factor when building the performance model, which can
execution time dominates the execution time. We call the be used to guide the parallelism for operators with limited

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 6
bandwidth considered. For the third challenge, the online t t t
stage1 stage2 stage3
profiling checks both the stream and the operators to mea-
branch 1
sure the data ingestion rate. FineStream responds to these
situations with different strategies based on the analysis branch 2
for dynamic workloads. Next, we show the details of our branch 3
time
systemdesign.
(a) Branch parallelism.
t
stage3
5 MODEL FOR PARALLELISM UTILIZATION t stage1 t stage2
Guideline: A performance model is necessary for oper- branch 1 branch 3
ator placement in FineStream, especially for the compli-
branch 2
cated operator relations in the DAG structure. The over-
branch 3
head of building a fine-grained performance model for a time
query is limited because the placement strategy from the (b) Branch scheduling optimization.
modelcanbereusedforthecontinuousstreamdata.
Fig.6.Anexampleofbranchparallelismandoptimization.
We model the performance of executing a query in this
section.Theoperatorsoftheinputqueryareorganizedasa
The throughput is the number of tuples divided by the
DAG.Intheperformancemodel,weconsidertwokindsof
execution time. Assume the number of tuples in a batch is
parallelism. First, for intra-batch parallelism, we consider
m,then,thethroughputisshowninEquation3.
branch co-running, which means co-running operators in
m
processing one batch. Second, for inter-batch parallelism,
weconsiderbatchpipeline,whichmeansprocessingdifferent throughput branchCoRun = t total (3)
batchesinpipelines.
Optimization.Wecanperformbranchschedulingforop-
5.1 BranchCo-Running timization, which has two major benefits. First, by moving
Independent branches can be executed in parallel. With branches from the stage with fully occupied bandwidth uti-
limited computation resources and bandwidth, we build a lizationtothestagewithsurplusbandwidth,thebandwidth
modelforbranchco-runningbehaviorsinthispart.Weuse can be better utilized. For example, in Figure 6 (b), assume
Bmax to denote the maximum bandwidth the platform can that in stage 1, the required bandwidth exceeds Bmax, but
provide. If the sum of bandwidth utilization from different
thesumoftherequiredbandwidthofbranch2andbranch3
parallel branches, Bsum, exceeds Bmax, we assume that the is lower than Bmax, then we can move the execution of
throughput degrades proportionally to the Bmax/Bsum of branch3 after the execution of branch1 for better bandwidth
the throughput with enough bandwidth [20]. To measure utilization. Second, the system may not have enough com-
thebandwidthutilization,generally,fornco-runningtasks, putation resources for all branches so that we can resched-
we have n co-running stages, because tasks complete one ule branches for better computation resource utilization. In
by one. When multiple tasks finish at the same time, the stage1 of Figure 6 (a), when the platform cannot provide
numberofstagesdecreasesaccordingly. enough computing resources for all the three branches, we
WeusetheexampleinFigure5forillustration.Assume can perform the scheduling in Figure 6 (b). Additionally,
that the time for different branches is shown in Figure 6 (a). we can perform batch pipeline between operators in each
If we co-run the three branches simultaneously, then the branch,whichshallbediscussednext.
executioncanbepartitionedintothreestageswithdifferent
overlapping situations. We use t stage1, t stage2, and t stage3 5.2 BatchPipeline
to represent the related stage time when the system has
WecanalsopartitiontheDAGintophases,andperformco-
enough bandwidth. Then, if the required bandwidth for
runninginpipelinebetweenphasesforprocessingdifferent
stage iexceedsBmax,therelatedrealexecutiontimet stage i’ batches.Forsimplicity,inthispart,weassumethatthenum-
also extends accordingly. We define t stage i’ in Equation 1. berofphasesintheDAGistwo.Pleasenotethatwhenthe
Whentheplatformcanprovidetherequiredbandwidth,r
i platform has enough resources, the pipeline for operators
is equal to one. Otherwise, r i is the ratio of the required can be deeper. We show a simple example in Figure 7 (a).
bandwidthdividedbyBmax.
Theoperatorsinphase1andtheoperatorsinphase2needto
(cid:26)
t stage i (cid:48) = r i t · st t a s g ta e g i e i ( ( B B s s u u m m≤ > B B m m a a x x ) ) (1) b p e ha m se a s pp ca e n d c in o t - o ru d n if i f n er t e h n e t p co ip m e p li u n t e e . u Fi n g i u ts re so 7 t ( h b a ) t s t h h o e w se s t t w h o e
executionflowinpipeline.WhenFineStreamcompletesthe
Toestimatethetimeforprocessingabatchinthecritical
processing for batch1 in phase1 and starts to process batch1
path, generally for the branch DAG, we perform topology
in phase2, FineStream can start to process batch2 in phase1
sorttoorganizethebranchesintodifferentlayers,andthen
simultaneously. Phase1 and phase2 can co-run because they
we co-run branches on layer granularity. In each layer,
relyondifferentcomputeunits.
we perform the above branch co-running. Then, the total
We need to estimate the bandwidth of two overlapping
execution time is thesum of time of all layers, as shownin
phases so that we can further estimate the batch pipeline
Equation2.
nlayernstage throughput.Thetimeforaphase,t phase i,isthesumofthe
(cid:88) (cid:88)
t total = t stage i,layer j (cid:48) (2) execution time of the operators in the phase for processing
j=0 i=0 a batch. We use t phase1 to denote the time for phase1 while

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 7
phase 1 phase 2 PH i: phase i B i: batch i computing resources and bandwidth. The only thing we
OP1 OP2 OP3 need to do is to integrate the branch co-running technique
OP7 PH2 B1 PH2 B2
OP4 OP5 OP6 OP11 inthepotentialphases.
PH1 B1 PH1 B2 …
OP8 OP9 OP10
time
5.3 HandlingDynamicWorkload
(a) Phase partitioning. (b) Batch pipeline.
Fig.7.Anexampleofpartitioningphasesforbatchpipeline. In branch co-running, the hardware resource bound to
each branch is based on the characteristics of both the
t p st h ag a e s 2 e : 2 forphase2 ST .B G 1W 2 hen S t T Bw G 2 2 o batch … esar S e T B G nb 2 eingprocessedin o th p e er w at o o r r kl a o n a d d t p h r e es w su o r r e kl f o o a r d. ea D ch uri b n r g an w ch or m kl a o y ad be m d ig if r f a e t r i e o n n t ,
differentphasesintheengine,FineStreamtriestomaximize
… fromtheoriginalstate.Hence,thestaticcomputingresource
thstaegeo 1v:erSlTaGp1 pB1ingSoTGf1t B p 2 hase1 andSTGt p 1 h B a n se2 of the two ba t t im ch e es. allocationmaynotbesuitableforthedynamicworkload.
However,theoverlappingcanbeaffectedbymemoryband-
A possible solution is to redistribute computing re-
widthutilization.TheonlineprofilinginSection7.3collects
sources to operators in each branch according to the per-
the size of memory accesses s i,dev (including read and
formance model. However, this solution has the following
write) and the execution time t i,dev for each operator. The
twodrawbacks.First,onlyadjustingthehardwareresources
bandwidth of the two overlapping phases is described as
on different branches may not be able to maintain the
Equation4.
performance, because query plan topology may not fit the
currentstreamingapplication.Insuchcases,thequeryplan
bandwidth overlap =MIN(Bmax, (cid:80) t m i= ph 0 a s s i e , 1 dev + (cid:80)n i= t m ph + a 1 se s 2 i,dev) needs to be reoptimized for system performance. Second,
(4) resourceredistributionincursoverhead.Therefore,efficient
When bandwidth overlap does not reach Bmax, the exe- query plan adjustment and resource reallocation are necessary
cutiontimeforprocessingnbatches,t nBatches,isshownin forFineStreamhandlingdynamicworkload.
Equation5. Query Plan Adjustment. With reference to [29],
FineStream generates not only the query plan that soon
t =n·MAX(t ,t )+MIN(t ,t ) (5)
nBatches phase1 phase2 phase1 phase2 will be used in the stream processing, but also several
When bandwidth overlap reaches Bmax, the execution possiblealternatives.Duringstreamprocessing,FineStream
time of co-running two phases in the pipeline on different monitorsthesizeofintermediateresults.Iftheperformance
batches is longer than any of their independent execution degradesandthesizeofintermediateresultsvariesgreatly,
time. We assume that the independent execution time of FineStream shall switch to another alternative query plan
the longer phase is t l and the independent time for the topology.Intheimplementation,FineStreamgeneratesthree
shorter phase is t s. Then, the overlapping ratio for the two additional plans by default, and picks them based on the
phases r olp is t s divided by t l. Assuming the total size of performancemodel.
thememoryaccessesforthelongerphaseiss l,andthetotal Light-WeightResourceReallocation.InFineStream,we
size for the shorter phase is s s, then the execution time of use a light-weight dynamic resource reallocation strategy.
theoverlappinginterval,t olp,isshowninEquation6. When the workload ingestion rate of a branch decreases,
we can calculate the reduced ratio, and assume that such
s +r ·s
t olp = band s wid o th lp l (6) proportion of computing resources in that branch can be
overlap transferred to the other branches. We use an example in
Toestimatethetimeoftherestpartinthelongerphase, Figure8forillustration.InFigure8(a),90%workloadafter
weassumethatthebandwidthoftheindependentexecution operatorOP1flowtoOP2.Whentheworkloadstatechanges
ofthelongerphaseisbandwidth l.Then,theexecutiontime to the state in Figure 8 (b), part of the computing resource
t rest isshowninEquation7. associatedwithOP2shallbeassignedtoOP3accordingly.
(1−r )·s
t rest = bandw ol i p dth l l (7) Shared memory I a n r t c e h g it r e a c te tu d r es Shared memory I a n r t c e h g it r e a c te tu d r es
90% OP2 GPU 10% OP2 CPU
Then,whenbandwidthBmaxisreached,theexecution
OP1 CUs OP1 CUs
timet
nBatches
toprocessnbatchesisshowninEquation8.
CPU GPU
10% OP3 CUs 90% OP3 CUs
t nBatches =n·(t olp +t rest ) (8) (a) 90% workload goes to OP2. (b) 90% workload goes to OP3.
Fig.8.Anexampleofadjustmentfordynamicworkload.
We assume that a batch contains m tuples, and then,
the throughput can be expressed by Equation 9. When In detail, for the ingestion-rate-falling branch (data ar-
bandwidthissufficient,t nBatchesisdescribedasEquation5, rival rate of this branch is decreasing) [29], weassume that
otherwise,Equation8. theinitialingestionrateisr init,whilethecurrentingestion
m·n
rate is r curr. Then, the computing re1s0o%urcOeP2that shall be
throughput batchPipeline = t (9) reallocated to the other branches isOsPh1own in Equation 10.
nBatches This adaptive strategy is very light-9w0%eig
O
h
P
t
3
, because we
Optimization.Branchco-runningcanalsobeconducted can monitor the ingestion rate during batch loading and
inabatchpipeline.Forexample,inFigure7,thebranchesin redistributetheproportionofreducedcomputingresources
phase1canbeco-runwhenthesystemcanprovidesufficient tothebranchthathasahigheringestionrate.Inthecaseof

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 8
Figure8(b),wecankeeplimitedhardwareresourcesinOP2 query 1 query 1
andredistributetheresttoOP3afterprocessingthecurrent OP1 OP2 OP3 OP3
OP1 OP2
batch.
OP1 OP2 OP4 OP4
query 2
resource redistribute i = r init r −r curr ·resource OPi (10) (a) O qu ri e g r i y n a 2 l query 1 and query 2. (b) Optimized query 1 and query 2.
init
Fig.9.Illustrationforoperator-sharingoptimization.
6 MULTI-QUERY SUPPORT
6.2 Multi-Stream
In practice, users may need multi-queries. Additionally, if Multi-queries on multiple streams are common in practice,
we can support different streams, the application scope and we enable FineStream process queries in multi-stream
of the system will be broader. In this section, we divide situations.Insupportingmultiplestreams,acommonques-
multi-query situations into single-stream and multi-stream tion is that when multiple queries include the same oper-
scenarios,andshowourdesigninbothcases.Furthermore, ator, whether we can reuse the same operator for different
we also consider the dynamic workload in multi-query streams to save computing resources. We find that this is
support. hardtobeoptimized.Thedifficultiesareasfollows.
Difficulties. First, tuples of different streams may have
6.1 SingleStream different schemas. Merging streams with different schemas
could incur large performance overhead. Second, even for
We discuss multi-queries in single stream in this part. It is
streams with the same schemas, FineStream processes data
common for multiple users to submit different queries for
atbatchgranularity.Weneedtoseparatethetuplesbelong-
the same stream to the system. To support multi-queries
ing to different streams. Third, merging streams also needs
in single stream, we need to handle the following three
to involve information indicating which stream each tuple
difficulties.
belongsto,whichcausesoverhead.
Difficulties. First, the intermediate results for different Design. Based on the above analysis, we adopt a sepa-
queries belong to separate user spaces. Second, the mod- ratedesignformultiplestreams.Weuseamonitorthreadto
eling, especially the computing resource distribution, be- detect the ingestion rates of different input streams for re-
comes even more complicated because of different queries. sourceallocation,asshowninFigure10.Ourdesignisasfol-
Third, the complexities among queries could be different, lows. First, the monitor thread identifies the input streams,
whichneedtobeinvolvedinsystemdesign. and collect necessary performance data. Second, based on
Design. Our design is as follows. First, we organize the the gathered performance data, FineStream performs uni-
operatorsfromdifferentqueriesintothesameDAG,sothat fiedperformancemodelingforprocessingdifferentstreams.
we do not need to consider separate user spaces. Second, Third, FineStream distributes computing resources to the
we use the performance model in Section 5 to distribute operatorsofqueriestargetingdifferentstreams.
the computing resources to operators since all operators
are organized into the same DAG. Third, when a stream stream 1
oftuplesentersthesystem,multi-queriesareconductedby
OP1 OP2
suchuniformeddesign.
Monitoring Resource reallocation
Optimization. To further improve the performance in monitor thread
supporting multi-queries of a single stream, we conduct
OP3 OP4
a novel optimization, called operator-sharing. In operator-
stream 2
sharing, we merge the initial paths of different queries as
Fig.10.Multi-streammonitoring.
much as possible, so that multiple queries could share the
samecomputingresults.Thisdesignavoidsextraspacecost
and computation caused by multiple queries. We show an
6.3 DynamicSituation
example of active fusion in Figure 9. Figure 9 (a) shows
the original example of two queries. They have the same Dynamic workloads also happen in multi-query situations
stream 1
operators OP1 and OP2. To save unnecessary computa- ofbothsingle-streamandmulti-streamcases.
tion, we merge their first two operators OP1 and OP2 of Difficulties.ThemajordifficultiesinadOyPn1amicOsPit2uation
thesetwoqueriesandpostponethesplitprocessafterOP2. lieinhowtodetectthedynamicchangesinbothsingleand
monitor thread
FineStream detects the workload changes and periodically multi-streams.
appliessharing-awarequeryoptimization.Whentwousers Single stream. In single-stream cases,OPd3ynamOicP4work-
submit queries simultaneously, the operator sharing opti- loads could appear, as discussed in Section 5.3. However,
stream 2
mizationstillcanbeapplied.Inreal-worldcases,twousers when FineStream handles multiple queries, the query plan
cansubmitdifferentqueriesatthesametime.Forexample, adjustmentandlight-weightresourcereallocationstillwork,
in stock market analysis of event stream processors, many because we adopt the design of organizing the operators
queries can be submitted to the system on the same data from different queries into the same DAG, as shown in
stream simultaneously, even with the interests on the same Section5.3.
stock patterns [30]. Hence, the probability that the stock Multi-stream. The monitor thread can be used to ob-
market stream system processes multiple queries at the serve dynamic workloads among different streams. Ac-
sametimeisveryhigh. cordingly, FineStream can adjust computing resources for

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     |     |     |     |     | 9   |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
different streams based on the collected performance data Algorithm 1 is the pseudocode of the dispatcher. When
from the monitor thread. For example, in Figure 10, when a stream is firstly presented in the engine, FineStream con-
the monitor thread detects the decrease of ingestion rate ducts branch co-running and batch pipeline according to
in stream 1, it reports such phenomenon to the system theperformancemodelmentionedinSection5(Line2to5).
and FineStream distributes part of the stream-1 computing Next, FineStream checks whether resource rescheduling is
resourcestotheoperatorsforstream2.
neededwhenmultiplestreamsexistinthesystem(Line6to
12).WhentheoverallperformanceofFineStreamdecreases
|     |     |     |     |     |     |     | and this | is caused | by  | the decreasing | ingestion | rate from |
| --- | --- | --- | --- | --- | --- | --- | -------- | --------- | --- | -------------- | --------- | --------- |
7 IMPLEMENTATION DETAILS one stream, FineStream reschedules the hardware resource
7.1 HowFineStreamWorks from this stream to the others. FineStream also detects
|     |     |     |     |     |     |     | dynamic | workload | (Line | 13 to | 21). If the dynamic | work- |
| --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ----- | ----- | ------------------- | ----- |
WepresentthesystemworkflowinFigure11.InFigure11,
loadisdetected,FineStreamconductstherelatedhardware
| thread1    | is used | to cache     | input data, | while    | thread2  | is used |               |     |                   |     |                |            |
| ---------- | ------- | ------------ | ----------- | -------- | -------- | ------- | ------------- | --- | ----------------- | --- | -------------- | ---------- |
|            |         |              |             |          |          |         | rescheduling. | If  | such rescheduling |     | does not help, | it further |
| to process | the     | cached data. | The         | detailed | workflow | is as   |               |     |                   |     |                |            |
conductsqueryplanadjustment.
follows.First,whenFineStreamstartsanewquery,thedis-
| patcher | executes | the query | on the | CPU for | batch1 | and then |     |     |     |     |     |     |
| ------- | -------- | --------- | ------ | ------- | ------ | -------- | --- | --- | --- | --- | --- | --- |
Algorithm1:SchedulingAlgorithminFineStream
| on the | GPU | for batch2. Second, | during | these | single-device |     |     |     |     |     |     |     |
| ------ | --- | ------------------- | ------ | ----- | ------------- | --- | --- | --- | --- | --- | --- | --- |
executions, FineStream conducts online profiling. With the 1 Functiondispatch(batch,resource,model):
onlineprofiling,FineStreamcanobtaintheoperator-related if taskFirstRunthen
2
branchCoRun(resource,model)
| data that | are | used to build | the | performance |     | model, in- | 3   |     |     |     |     |     |
| --------- | --- | ------------- | --- | ----------- | --- | ---------- | --- | --- | --- | --- | --- | --- |
cluding the CPU and GPU performance, and bandwidth 4 batchPipeline(resource,model)
utilization. Third, with these data, FineStream builds the 5 taskFirstRun=false
performance model considering branch co-running and // Resource adjustment among
batchpipeline.Fourth,afterbuildingthemodel,FineStream multistreams
generatesseveralqueryplanswithdetailedresourcedistri-
6 foreachstreamiinFineStream.streamdo
bution. With the generated query plan, the dispatcher per- ifperformance&&ingestionRatedecrease
7
| forms | fine-grained | scheduling | for | processing | the | following |     | then |     |     |     |     |
| ----- | ------------ | ---------- | --- | ---------- | --- | --------- | --- | ---- | --- | --- | --- | --- |
batches.Notethatwhenthemulti-streamordynamicwork-
|     |     |     |     |     |     |     | 8   | decreaseResource(i) |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --- | --- | --- |
load is detected, FineStream performs related adjustment 9 markMultiStream=true
mentionedinSection5.3.
10 ifmarkMultiStream==truethen
stream 1
|          |          |             | p a r a ll e | l i sm   |     |     |     | r es c h | e du le R | es o u r ce( | )   |     |
| -------- | -------- | ----------- | ------------ | -------- | --- | --- | --- | -------- | --------- | ------------ | --- | --- |
| thread 1 | thread 2 | performance |              |          |     |     | 11  |          |           |              |     |     |
operators u t il iz a t i o n  DAG 1 DAG i m a r k M u lt iS tr e a m = false
| batch1 | CPU | CPU | Branch  | OP  | CPU% GPU%… | …   | 12  |     |     |     |     |     |
| ------ | --- | --- | ------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
OP1
… G P U Co - R u n n i ng O P 1 … … … … … // H a n d l in g d yn a m i c w o r k l o ad and
|        |     |                      |            | …       | …   | … … … |     |     |     |     |     |     |
| ------ | --- | -------------------- | ---------- | ------- | --- | ----- | --- | --- | --- | --- | --- | --- |
| batch2 | GPU | O Pi b a n d w i d t | h  B a t c | h   O P | i … | … … … |     |     |     |     |     |     |
u t il i z a t i o n P i p e l in e q u e r y p la n o p t i mi z a t i o n
default
ifdetectDynamicWorkload()then
| batch3 | multi-stream yes | stream ingestion | changes  | multi-stream  |     |     | 13  |     |     |     |     |     |
| ------ | ---------------- | ---------------- | -------- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
resourceReallocate()
|        | detection | ratemonitoring | detected | adjustment  |     |             | 14  |                             |     |     |     |     |
| ------ | --------- | -------------- | -------- | ----------- | --- | ----------- | --- | --------------------------- | --- | --- | --- | --- |
| batch4 |           |                |          |             |     | query plan  |     |                             |     |     |     |     |
|        |           |                |          |             |     | adjustment  | 15  | ifresourceChanged==truethen |     |     |     |     |
batch5
… dynamic-workload  yes operator dataflow migration  resource  still low  ifdetectDynamicWorkload()then
16
time detection monitoring detected adjustment performance? updateQueryPlan()
17
|     |     |     |     |     |     |     | 18  |     | queryChanged=true |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- |
Fig.11.FineStreamworkflow.
resourceChanged=true
19
| Additionally, |     | when users          | change  | the | window     | size of |     |                          |     |     |     |     |
| ------------- | --- | ------------------- | ------- | --- | ---------- | ------- | --- | ------------------------ | --- | --- | --- | --- |
|               |     |                     |         |     |            |         | 20  | ifqueryChanged==truethen |     |     |     |     |
| a query       | on  | the fly, FineStream | updates |     | the window | size    |     |                          |     |     |     |     |
resourceChanged=false
21
| parameter | after     | the related | batch            | processing | is         | completed, |     |     |     |     |     |     |
| --------- | --------- | ----------- | ---------------- | ---------- | ---------- | ---------- | --- | --- | --- | --- | --- | --- |
| and then  | continues | to run      | with performance |            | detection. |            | If  |     |     |     |     |     |
theperformancedecreasesbelowagivenvalue(70%ofthe
originalperformancebydefault),FineStreamre-determines
7.3 OnlineProfiling
| the query | plan | with computing |     | resources | based | on the |     |     |     |     |     |     |
| --------- | ---- | -------------- | --- | --------- | ----- | ------ | --- | --- | --- | --- | --- | --- |
parametersandtheperformancemodel. The purpose of online profiling is to collect useful perfor-
mancedatatosupportbuildingtheperformancemodel.
|     |     |     |     |     |     |     | In  | online profiling, |     | we have | two concerns. | The first is |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | ------- | ------------- | ------------ |
7.2 Dispatcher
whatdatatogenerateinthismodule.Thisisdecidedbythe
The dispatcher of FineStream is a module for assigning performance model. These data include the data size, exe-
stream data to the related operators with hardware re- cutiontime,bandwidthutilization,andthroughputforeach
sources.Thedispatcherhastwofunctions.First,itsplitsthe operator on devices. The second is, to generate the data,
stream data into batches with a fixed size. Second, it sends whatinformationweshallcollectfromstreamprocessing.
the batches to the corresponding operators with proper FineStreamperformsonlineprofilingforoperatorsfrom
hardwareresourcesforexecution.Thegoalofthedispatcher memorybandwidthandcomputationperspectives.
is to schedule operator tasks to the appropriate devices to Memory Bandwidth Perspective. Based on the above
fullyutilizethecapacityoftheintegratedarchitecture. analysis, we use bandwidth, defined as the transmitted data

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 10
sizedividedbytheexecutiontime,todepictthecharacteris- model.Thewholequeryexecutiononabatchisdistributed
ticsfromthedataperspectiveofanoperator.Thetransmit- toadevice,theGPUortheCPU,withoutfurtherdistribut-
ted data for an operator consists of input and output. The ing operators of a query to different devices. The original
input relates to the batch while the output relates to both CPU operators in Saber are written in Java, and we further
theoperatorandthebatch.Wedefinethebandwidthofthe rewrite the CPU operators in Saber in OpenCL for higher
operator i on device dev in Equation 11. The parameters efficiency. Our comparisons to Saber examine whether our
s input i and s output i denote the estimated input and the fine-grained method delivers better performance. To vali-
output sizes of the operator i, and t i,dev represents the date the co-running benefits of the two devices, we also
execution time of the operator i on device dev. As input measurethebestsingledeviceperformanceforcomparison,
workloadcharacteristicsmaychangeovertime,FineStream denoted as “Single” (the best performance of using only
periodicallycollectstheaforementionedparametersatrun- CPUs or GPUs). Further, to understand the advantage of
timeandreoptimizesthequeryplanaccordingly. using the integrated architecture to accelerate stream pro-
cessing,wecompareFineStreamonintegratedarchitectures
s +s
bandwidth i,dev = input i t output i (11) withSaberondiscreteCPU-GPUarchitectures.
i,dev Platforms. We perform experiments on four platforms,
Computation Perspective. To depict the characteristics two integrated platforms and two discrete platforms. The
fromthecomputationperspective,weusethroughput i,dev, first integrated platform uses the integrated architecture
which is defined as the total number of processed tuples AMDA10-7850K[10],andithas32GBmemory.Thesecond
n tuples divided by the time t i,dev for operator i on device integratedplatformusestheintegratedarchitectureRyzen5
dev.Allthesevaluescanbeobtainedfromonlineprofiling. 2400G, which is the latest integrated architecture, and this
platform has 32 GB memory. The third discrete platform
is equipped with an Intel i7-8700K CPU and an NVIDIA
7.4 ModuleImplementation
GeForce GTX 1080Ti GPU, and along with 32 GB memory.
FineStream consists of a Java module and a C module,
ThefourthdiscreteplatformisequippedwithtwoIntelE5-
whichissimilartoSaber[4].TheJavamoduleofFineStream
2640 v4 CPUs and an NVIDIA V100-32GB GPU, and it has
is responsible for the user-defined queries and the process
264GBmemory.
of analyzing and preprocessing the input stream data. The
Datasets. The development of 5G thrives IoT networks
C module is implemented by OpenCL [16] to control and
and various applications, such as cluster monitoring [1],
execute streaming queries on the CPU and the GPU of
anomaly detection in smart grids [2], and road tolling
integratedarchitectures.
systems [3], which have been proposed recently. These
Communication.Communicationbetweentwomodules
applications can be represented in stream processing, and
isachievedbyJavaNativeInterface(JNI).Indatatransmis-
thusweusetheserealworkloadsinourevaluation.Weuse
sion,weuseJavaDisruptortoimplementtheresourcepool
four streaming applications (including three real-world ap-
for the dispatcher. When data are stored in the Disruptor
plication[4],[36],[37]andonecarefullydesignedsynthetic
buffer, threads fetch the data and execute the pseudocode
application) to evaluate our system. Our evaluation results
inAlgorithm1.Inourimplementation,weintegratetheop-
have clearly demonstrated the benefits of applying stream
eratorsofthesamestageinoneJNImethod,thusreducing
processing in integrated CPU-GPU architectures including
theJNIcallingoverhead.
energy efficiency and price-throughput ratio. With NVLink
Operators. For the operators in FineStream, we reuse
and PCIe V4, our system may also be applied to discrete
the operator code from OmniDB [31]. OmniDB is a pop-
CPU-GPUarchitectures.
ular lightweight query processing engine. The operators
are written in OpenCL, and OmniDB provides both the
• The first workload is Google compute cluster moni-
efficientCPUoperatorsandtheGPUoperators.Theseoper-
toring [1], which comes from a cluster management
ators have been widely used in many query engines, such
scenario.Workerserverssendtheirstatestoamoni-
as [32], [33], [34]. Hence, we directly reuse these operators
toring server. The trace includes real resource-usage
in FineStream. Please note that the goal of this work is
information from the Google production cluster, in-
to provide a fine-grained stream processing method on
cluding timestamp, job ID, machine ID, event type,
integratedarchitectures.Thesamemethodologycanalsobe
andsoon.
appliedforusingotherOpenCLprocessingenginessuchas
• The second workload is anomaly detection in smart
Voodoo[35].
grids [2], which is about detection in energy con-
sumptionfromdifferentdevicesofasmartelectricity
8 EVALUATION
grid. In detail, the workload is based on recordings
Focusingonthefine-grainedmulti-querystreamprocessing originating from smart plugs, which are deployed
on integrated architectures, we evaluate FineStream in this in private households. The base stream includes a
section. timestamp, value for measurement, property, plug,
andsoon.
8.1 Methodology
• The third workload is linear road benchmark [3],
The baseline method used in our comparison is Saber [4], whichmodelsanetworkoftollroads.Itsimulatesthe
while our method is denoted as “FineStream”. Saber is the highwaytollsystemforautomobilesinmetropolitan
state-of-the-artwindow-basedstreamprocessingenginefor areas. The schema of the stream data includes a
discrete architectures. It adopts a micro-batch processing timestamp,vehicle,speed,highway,andsoon.

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     |     |     |     |     | 11  |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
TABLE3
Thequeriesusedinevaluation.
| Query |     |     |     |     |     |     | Detail |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | --- |
select timestamp, category, sum(cpu) as totalCPU from TaskEvents [range 256 slide 1] group by category
Q1
Q2 select timestamp, jobID, avg(cpu) as avgCPU from TaskEvents [range 256 slide 1] where eventType == 1 group by
jobId
select timestamp, eventType, userId, max(disk) as maxDisk from TaskEvents [range 256 slide 1] group by
Q3
|     | eventType, | userId |     |     |     |     |     |     |     |     |     |     |
| --- | ---------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Q4 select timestamp, avg (value) as globalAvgLoad from SmartGridStr [range 512 slide 1]
select timestamp, plug, household, house, avg(value) as localAvgLoad from SmartGridStr [range 512 slide 1]
Q5
|     | group | by plug, | household, | house |     |     |     |     |     |     |     |     |
| --- | ----- | -------- | ---------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
Q6 (select L.timestamp, L.plug, L.household, L.house from LocalLoadStr [range 1 slide 1] as L, GlobalLoadStr
[range 1 slide 1] as G where L.house == G.house and L.localAvgLoad >G.globalAvgLoad) as R -- select
|     | timestamp, | house, | count(*) | from | R group | by house |     |     |     |     |     |     |
| --- | ---------- | ------ | -------- | ---- | ------- | -------- | --- | --- | --- | --- | --- | --- |
Q7 ( select timestamp, vehicle, speed, highway, lane, direction, (position/5280) as segment from PosSpeedStr
[range unbounded] ) as SegSpeedStr -- select distinct L.timestamp, L.vehicle, L.speed, L.highway, L.lane,
L.direction, L.segment from SegSpeedStr [range 30 slide 1] as A, SegSpeedStr [partition by vehicle rows 1] as
|     | L   | where A.vehicle | ==  | L.vehicle |     |     |     |     |     |     |     |     |
| --- | --- | --------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
Q8 select timestamp, vehicle, count(direction) from PosSpeedStr [range 256 slide 1] group by vehicle
Q9 select timestamp, max(speed), highway, lane, direction from PosSpeedStr [range 256 slide 1] group by
highway,lane,direction
The fourth workload is a synthetically generated 250,156to45,413tuplespersecond.
•
workload based on [4] for evaluating independent WeconductmodelandparameteranalysisinFineStream
operators,whereeachtupleconsistsofa64-bittimes- evaluation,whichplaysanimportantroleinunderstanding
tampandsix32-bitattributesdrawnfromauniform the performance behavior of FineStream. Next, we present
distribution. the performance results first, and then show the detailed
modelandparameteranalysisinSection8.4andSection8.5.
Benchmarks.Weuseninequeriestoevaluatetheoverall
| performance |     | of the fine-grained |     | stream | processing | engine |     |     |     |     |     |     |
| ----------- | --- | ------------------- | --- | ------ | ---------- | ------ | --- | --- | --- | --- | --- | --- |
8.2 HandlingMultipleQueries
| on the | integrated | architectures. |     | Similar | benchmarks | have |     |     |     |     |     |     |
| ------ | ---------- | -------------- | --- | ------- | ---------- | ---- | --- | --- | --- | --- | --- | --- |
been used in [4]. The details of the nine queries are shown For evaluating the performance of handling multiple
in Table 3. Q1, Q2, and Q3 are conducted on the Google queries, we compare FineStream to Saber, in which we de-
velopthebulk-synchronousstrategy[13]ofallocatingdifferent
computeclustermonitoringdataset.Q4,Q5,andQ6arefor
thedatasetofanomalydetectioninsmartgrids.Q7,Q8,and queries to different devices without further operator-level
| Q9 are | for | the dataset | from the | linear | road benchmark. | For | partitioning. |     |         |                |            |     |
| ------ | --- | ----------- | -------- | ------ | --------------- | --- | ------------- | --- | ------- | -------------- | ---------- | --- |
|        |     |             |          |        |                 |     | Throughput.   |     | We show | the throughput | comparison | re- |
multi-queryevaluation,wegeneratequerieswithauniform
distribution to evaluate our multi-query design. In detail, sultsinFigure12.Ingeneral,wehavethefollowingobserva-
we organize Q1 and Q3 as multi-query group M1, Q8 and tions.First,TheaverageperformanceFineStreamis744,934
Q9 as M2, and Q4 and Q5 as M3. Because for M1, M2, and tuplespersecond,whichoutperformsSaberby32%onav-
M3,theinputofdifferentqueriesarethesame,weusethese erage.Second,theCPUofRyzen52400Ghasbeenstrength-
teststomeasuretheefficacyofhandlingmultiplequeriesin ened, so the difference in computing power between CPU
asinglestream.Toevaluatethemulti-queryperformanceon andGPUonthisplatformisrelativelysmall.However,even
multiplestreams,weuniformlyorganizeQ1andQ8asM4, under such conditions, FineStream still achieves clear per-
Q1andQ5asM5,andQ8andQ5asM6. formancebenefits.Third,FineStreamachievesperformance
Dynamic Workload Generation. We use the datasets benefitsinallcases,whichdemonstratestheeffectivenessof
ourmethod.
| and | benchmarks | to generate |     | a dynamic | workload. | In the |     |     |     |     |     |     |
| --- | ---------- | ----------- | --- | --------- | --------- | ------ | --- | --- | --- | --- | --- | --- |
datatransmitterforastresstest,weuseafor-looptocontin-
uously transmit batch size data. To control the arrival rate, Single
|     |     |     |     |     |     |     | )s/selput 501( tuphguorht  100 |     |     |     | Saber |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | ----- | --- |
weinsertaThread.sleep()functiontocontroltherateofdata FineStream
transmission.Forthefirstdatasetofclustermonitoring,the
 10
| seventh | attribute | of category   |          | gradually | changes       | from type 1 |     |     |     |     |     |     |
| ------- | --------- | ------------- | -------- | --------- | ------------- | ----------- | --- | --- | --- | --- | --- | --- |
| to type | 2         | within 10,000 | batches. | We        | use the query | Q1 for      |     |     |     |     |     |     |
 1
illustration,andwedenoteitasD1.Similarevaluationsare
alsoconductedontheseconddatasetofsmartgridwiththe
| query | Q5, | which is denoted |     | as D2, | and the | third dataset |  0.1 |     |                |       |          |     |
| ----- | --- | ---------------- | --- | ------ | ------- | ------------- | ---- | --- | -------------- | ----- | -------- | --- |
|       |     |                  |     |        |         |               |      | M1  | M2 M3 M4 M5 M6 | M1 M2 | M3 M4 M5 | M6  |
of linear road benchmark with the query Q8, which is A10-7850K Ryzen 5 2400G
|         |     |             |            |     |              |          | Fig.12.Throughputofthequeriesonmulti-queries. |     |     |     |     |     |
| ------- | --- | ----------- | ---------- | --- | ------------ | -------- | --------------------------------------------- | --- | --- | --- | --- | --- |
| denoted | as  | D3. For the | evaluation | of  | multi-stream | support, |                                               |     |     |     |     |     |
task group D4 is a mix of query Q1 with the first dataset Latency.WeshowthelatencyresultsinFigure13.Inthis
and query Q8 with the third dataset. The arrival rate of work, latency is defined as the end-to-end time from the
streaming data for Q1 decreases from the original state of timeaquerystartstothetimeitends.FineStreamachieves
322,560to72,533tuplespersecond.TaskgroupD5isamix latency benefits in all cases. On average, FineStream
of Q1 and Q5, and the arrival rate of the streaming data achieves 28% latency lower than that of Saber. Note that
for Q1 decreases from 331,584 to 64,573 tuples per second the achieved latency benefit is relatively lower on Ryzen
gradually. The task group D6 is a mix of Q5 and Q8, and 5 2400G than that on A10-7850K. The reason is that the
thearrivalrateofthestreamingdataforQ5decreasesfrom performancegapbetweenRyzen’sCPUandGPUissmaller.

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 12
1e+01
1e+00
1e-01
1e-02
1e-03
1e-04
M1 M2 M3 M4 M5 M6 M1 M2 M3 M4 M5 M6
)s(
ycnetal
Single device. Compared to Saber, FineStream still achieves 52%
Saber throughput improvement, which clearly shows the advan-
FineStream
tage of fine-grained stream processing on the integrated
architecture. Second, on the Ryzen 5 2400G platform, be-
cause all hardware configurations have been upgraded in
comparisonwithA10-7850K,Saberachievesa56%through-
put improvement compared to the throughput of the best
singledevice.However,FineStreamisstill14%higherthan
Saber on this platform. Similar phenomena have also been
A10-7850K Ryzen 5 2400G
Fig.13.Latencyofthequeriesonmulti-queries. observedin[20],[38].
100
Dynamic Workloads.Inthissection,wediscusshowto
handle dynamic workloads. To demonstrate the capability
of FineStream to handle a dynamic workload, we evaluate 10
FineStream on the dynamic workloads mentioned in Sec-
tion 8.1. On average, FineStream achieves a performance 1
of 321,169 tuples per second, which outperforms the static
method (we denote “static” for FineStream without adapt- 0.1
ingtodynamicworkload)by27%,asshowninFigure14. Q1Q2Q3Q4Q5Q6Q7Q8Q9 Q1Q2Q3Q4Q5Q6Q7Q8Q9
8 8
Single Single
tu p
h g u o
)s/se
lp u t 4
6 S
F
t
in
a
e
ti
S
c
tream
tu p
h g u o
)s/se
lp u t 4
6 S
F
t
in
a
e
ti
S
c
tream
rh50 rh50
t1
( 2
t1
( 2
0 0
D1 D2 D3 D4 D5 D6 D1 D2 D3 D4 D5 D6
(a) A10-7850K. (b) Ryzen52400G.
Fig.14.Throughputofthequeriesondynamicworkloads.
Case Study. We use D1 as an example, and show the
detailed throughput along with the number of batches in
Figure 15. In the timeline process, the static method de-
creasesduetoimproperhardwareresourcedistribution.As
for FineStream, the hardware computing resources can be
dynamically adjusted according to the data distribution, so
theperformancedoesnotdeclinewiththechanges.
10 10
Static Static
tu
p h g
)s /s
e lp 6
8 FineStream tu
p h g
)s /s
e lp 6
8 FineStream
u o u t 4 u o u t 4
rh
t
50
1 2
rh
t
50
1 2 ( (
0 0
1000 3000 5000 7000 9000 1000 3000 5000 7000 9000
number of processed batches number of processed batches
(a) A10-7850K. (b) Ryzen52400G.
Fig.15.ThroughputofD1ondynamicworkloads.
8.3 Single-QueryPerformance
Throughput. We explore the throughput of FineStream for
the nine queries. Figure 16 shows the processing through-
put of the best single device, Saber, and FineStream for
these queries on both the A10-7850K and Ryzen 5 2400G
platforms. Please note that the y-axis of the figure is in
log scale. We have the following observations. First, on the
A10-7850K platform, FineStream achieves 88% throughput
improvement over the best single device performance on
average, which implies that FineStream nearly doubles the
performancecomparedtothemethodofusingonlyasingle
)s/selput
501(
tuphguorht
Single
Saber
FineStream
A10-7850K Ryzen 5 2400G
Fig.16.Throughputofdifferentqueries.
Latency.Figure17reportsthelatencyofdifferentqueries
on the integrated architectures. FineStream has the lowest
latencyamongthesemethods.First,ontheA10-7850Kplat-
form, FineStream’s latency is 10% lower than that of the
bestsingledevice,and36%lowerthanthelatencyofSaber.
Second,onRyzen52400Gplatform,itis2%lowerthanthat
of the best single device, and 9% lower than that of Saber.
The reason is that FineStream considers device preference
for operators and assigns the operators to their suitable
devices.Inthisway,eachbatchcanbeprocessedinamore
efficientmanner,leadingtolowerlatency.
1e+02
1e+01
1e+00
1e-01
1e-02
1e-03
1e-04
Q1Q2Q3Q4Q5Q6Q7Q8Q9 Q1Q2Q3Q4Q5Q6Q7Q8Q9
)s(
ycnetal
Single
Saber
FineStream
A10-7850K Ryzen 5 2400G
Fig.17.Latencyofdifferentqueries.
20
15
10
5
0
0 0.3 0.6 0.9 1.2
)s/selput
501(
tuphguorht
FineStream (A10-7850K) FineStream (Ryzen5)
Saber (A10-7850K) Saber (Ryzen5)
latency (s)
Fig.18.Throughputvs.latency.
Profiling.Weshowtherelationshipbetweenthroughput
and latency of both FineStream and Saber in Figure 18.
Figure18showsthatquerieswithhighthroughputusually
havelowlatency,andviceversa.

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 13  |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
WefurtherstudytheCPUandGPUutilizationofSaber integrated architecture demonstrates lower processing la-
and FineStream, and use the A10-7850K platform for illus- tency compared to the discrete architecture when the data
tration, as shown in Figure 19. In most cases, FineStream transmissioncostbetweenthehostmemoryandGPUmem-
utilizestheGPUdevicebetterontheintegratedarchitecture. ory in the workload is significant. Specifically, as shown in
As for Q4, the CPU processes most of the workload. On Figure21,theoperatorsmentionedinTable2aredistributed
|     |     |     |     |     |     |     |     |     |     | join |     | projection |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | ---------- | --- | --- | --- |
average, FineStream improves 23% GPU utilization com- in Figure 21, where (JOIN), (PROJ), and
paredtoSaber,andhaveroughlythesameCPUutilization aggregation(AGG)achievelowerlatencyontheintegrated
as Saber. Since FineStream achieves better throughput and architecture, while selection (SELT), and group-by (GRPBY)
latency than Saber, such utilization results indicate that prefer the discrete architecture. The x-axis represents the
FineStreamgenerateseffectivestrategiesindeterminingde- ratio of m compute/(s write+s read) where m compute denotes
vicepreferencesforindividualoperators. thekernelcomputationworkloadsize,ands ands
|     |     |     |     |     |     |     |        |     |                   |     |       |         | write  |             | read   |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | ----------------- | --- | ----- | ------- | ------ | ----------- | ------ |
|     |     |     |     |     |     |     | denote | the | data transmission |     | sizes | from    | the    | host memory |        |
|     |     |     |     |     |     |     | to the | GPU | memory            | and | from  | the GPU | memory |             | to the |
hostmemoryviaPCI-e.Forfurtherillustration,toexecutea
Saber
FineStream kernel on discrete GPUs, the execution time t includes
total
| )%( noitazilitu  100 |     |     |     |     |     |     | 1)thetimet |     |     |     |     |     |     |     |     |
| -------------------- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
writeofdatatransmissionfromthehostmemory
 80
|     |     |     |     |     |     |     | totheGPUmemoryviaPCI-e,2)thetimet |        |     |            |     |        | compute | fordata |         |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------- | ------ | --- | ---------- | --- | ------ | ------- | ------- | ------- |
|  60 |     |     |     |     |     |     | processing                        | kernel |     | execution, | and | 3) the | time    | t       | of data |
read
 40
|     |     |     |     |     |     |     | transmission |     | from | the GPU | memory | to  | the | host memory. |     |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ---- | ------- | ------ | --- | --- | ------------ | --- |
 20
|                                                |                    |     |     |                    |     |     | As for       | executing               |                                           | a kernel | on the         | integrated          |                | architecture, |         |
| ---------------------------------------------- | ------------------ | --- | --- | ------------------ | --- | --- | ------------ | ----------------------- | ----------------------------------------- | -------- | -------------- | ------------------- | -------------- | ------------- | ------- |
|  0                                             |                    |     |     |                    |     |     | althoughitst |                         | computeislongerthanthatondiscreteGPUs,its |          |                |                     |                |               |         |
|                                                | Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     | Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     |              |                         |                                           |          |                |                     |                |               |         |
|                                                |                    |     |     |                    |     |     | t writeandt  | readcanbeavoided.Ifthet |                                           |          |                | totalondiscreteGPUs |                |               |         |
|                                                |                    | CPU |     | GPU                |     |     |              |                         |                                           |          |                |                     |                |               |         |
| Fig.19.Utilizationoftheintegratedarchitecture. |                    |     |     |                    |     |     |              |                         |                                           |          |                |                     |                |               |         |
|                                                |                    |     |     |                    |     |     | is larger    | than                    | t compute                                 | on       | the integrated |                     | architectures, |               | then    |
|                                                |                    |     |     |                    |     |     | FineStream   |                         | on integrated                             |          | architectures  |                     | can achieve    |               | latency |
improvement.
8.4 ComparisonwithDiscreteArchitectures
Price-ThroughputRatioComparison.FineStreamonin-
Inthispart,wecompareFineStreamontheintegratedarchi- tegrated architectures shows a high price-throughput ratio,
|          |     |          |              |               |      |       | compared | to  | Saber | on the | discrete | architectures. |     | The | price |
| -------- | --- | -------- | ------------ | ------------- | ---- | ----- | -------- | --- | ----- | ------ | -------- | -------------- | --- | --- | ----- |
| tectures | and | Saber on | the discrete | architectures | from | three |          |     |       |        |          |                |     |     |       |
perspectives:performance,price,andenergy-efficiency. of the 1080Ti discrete architecture is about 7x higher than
thatoftheA10-7850Kintegratedarchitecture,andtheprice
|     |     |     |     |     |     |     | of the                                              | V100 | discrete | architecture |     | is about | 64x | higher | than |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | ---- | -------- | ------------ | --- | -------- | --- | ------ | ---- |
|  10 |     |     |     |     |     |     | thatoftheRyzen52400Gintegratedarchitecture.Figure22 |      |          |              |     |          |     |        |      |
pudeeps ecnamrofrep
|  8  |     |     |     |     |     |     | shows | the comparison |     | of  | their | price-throughput |     | ratio. | On  |
| --- | --- | --- | --- | --- | --- | --- | ----- | -------------- | --- | --- | ----- | ---------------- | --- | ------ | --- |
average,FineStreamontheintegratedarchitecturesoutper-
 6
|     |     |     |     |     |     |     | forms                                                 | Saber           | on the | discrete | architectures |        | by       | 10.4x.    | Note |
| --- | --- | --- | --- | --- | --- | --- | ----------------------------------------------------- | --------------- | ------ | -------- | ------------- | ------ | -------- | --------- | ---- |
|  4  |     |     |     |     |     |     | thatinapplicationscenarioswithhighperformancerequire- |                 |        |          |               |        |          |           |      |
|     |     |     |     |     |     |     | ments,                                                | the acquisition |        | cost     | may           | not be | the most | important |      |
 2
|     |     |     |     |     |     |     | factor. | However, | the | integrated |     | architectures |     | can | still be |
| --- | --- | --- | --- | --- | --- | --- | ------- | -------- | --- | ---------- | --- | ------------- | --- | --- | -------- |
 0
|     |                    |     |     |                    |     |     | regarded | as  | a compromise |     | between | performance |     | and | cost |
| --- | ------------------ | --- | --- | ------------------ | --- | --- | -------- | --- | ------------ | --- | ------- | ----------- | --- | --- | ---- |
|     | Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     | Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     |          |     |              |     |         |             |     |     |      |
1080Ti to A10-7850K V100 to Ryzen5 withawiderangeofapplicationscenarios.

| Fig. 20. | Throughput | comparison | between | Saber on | discrete | architec- | oitar tuphguorht-ecirp |  100000 |     |     |     |     |     |     |     |
| -------- | ---------- | ---------- | ------- | -------- | -------- | --------- | ---------------------- | ------- | --- | --- | --- | --- | --- | --- | --- |
turesandFineStreamonintegratedarchitectures. Saber(discrete-1080Ti) FineStream(A10-7850K)
|     |     |     |     |     |     |     | )DSU/tuphguorht( |     | Saber(discrete-V100) |     |     | FineStream(Ryzen5) |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | -------------------- | --- | --- | ------------------ | --- | --- | --- |
 10000
| Performance |     | Com- |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ----------- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
 1000
| parison. | The | current    |         |     |              |     |     |      |     |     |     |     |     |     |     |
| -------- | --- | ---------- | ------- | --- | ------------ | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
|          |     |            | latency |     | integrated   |     |     |      |     |     |     |     |     |     |     |
| GPU on   | the | integrated |         |     |              |     |     |      |     |     |     |     |     |     |     |
|          |     |            |         |     | architecture |     |     |  100 |     |     |     |     |     |     |     |
architectureislesspow-
discrete
caused by
| erful than | the       | discrete |                |     |     | architecture |     |  10 |     |     |       |       |     |       |     |
| ---------- | --------- | -------- | -------------- | --- | --- | ------------ | --- | --- | --- | --- | ----- | ----- | --- | ----- | --- |
|            |           |          | data transfer  |     |     |              |     |     | Q1  | Q2  | Q3 Q4 | Q5 Q6 | Q7  | Q8 Q9 |     |
| GPU, as    | mentioned | in       | from host      |     |     |              |     |     |     |     |       |       |     |       |     |
Fig.22.Comparisonofprice-throughputratio.
| Section | 2.2. The | system | memory to  |     |     | ratio |     |     |     |     |     |     |     |     |     |
| ------- | -------- | ------ | ---------- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
GPU memory
|     |     |     |     | JOIN PROJAGG | SELTGRPBY |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | ------------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
on discrete architecture Energy Efficiency Comparison. We also analyze the
utilizespinnedmemory Fig.21.Latencycomparison. energy efficiency of FineStream and Saber. The Thermal
buffer for data transfer Design Power (TDP) is 95W on A10-7850K, and 65W on
andpipelinescomputationandcommunicationtohidecom- Ryzen 5 2400G. For the 1080Ti platform, the TDP of the
municationoverhead.Similarideashavealsobeenadopted Intel i7-8700K CPU and NVIDIA GTX 1080Ti GPU are
in[4],[39],[40].Unfortunately,thecommunicationoverhead 95W and 250W, respectively. For the V100 platform, the
still exists since the communication time and computation TDP of the Intel E5-2640 v4 CPU and NVIDIA V100 GPU
time may not be the same. The discrete GPUs exhibit 1.8x are 90W and 300W, respectively. The energy efficiency is
to5.7xhigherthroughputthantheintegratedarchitectures, defined as throughput divided by TDP, which reflects the
as shown in Figure 20. However, as we show later, the performance-per-power results. We show the energy effi-

JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 14
ciency of FineStream and Saber in Figure 23. On average,
FineStream on the integrated architectures is 1.8x energy-
efficientthanSaberonthediscretearchitectures.
100000
10000
1000
100
Q1 Q2 Q3 Q4 Q5 Q6 Q7 Q8 Q9
ycneicffie
ygrene
)ttaW/ecnamrofrep(
Runtime Overhead Analysis. FineStream incurs run-
time overhead in the batch processing phase from two
aspects.First,itdetectswhethertheinputstreambelongsto
dynamic workloads, which causes time overhead. Second,
multistream detection also takes time. In our evaluation,
Saber(discrete-1080Ti) FineStream(A10-7850K) we observe that the time overhead accounts for less than
Saber(discrete-V100) FineStream(Ryzen5)
2% of the processing time, which can be ignored in stream
processing.
8.6 DetailedAnalysis
Inthissection,weperformadetailedanalysisofthefactors
that can influence performance. These factors include the
number of attributes, slide size, window size, and batch
sizeofaquery.WeuseQ1forillustration.Theperformance
impact is shown in Figure 25, and the latency impact is
Fig.23.Comparisonofenergyefficiency. showninFigure26.Weomittheresultsfortheotherqueries
because they exhibit similar trends. Detailed analysis is as
8.5 ModelAnalysis follows.
Number of attributes. The number of attributes has a
small but observable impact on system performance. Fig-
100 100 ure25(a)showstheresultsofthroughput,andFigure26(a)
)%
( n 6
8
0
0
y c
)%
( 6
8
0
0
showstheresultsoflatency.Toexploretheinfluenceofthe
o ita iv
e d 2
4
0
0 a ru
a
c c 2 4
0
0 0 n t
f
h
a
u
c
e m
to
n b
r
u
s
e m r
th
o b
e
f er a
s
t
a
o t
m
r f ib a
e
t
.
u tr te ib s u o t n es th in et t h u r p o l u es gh o p f u Q t 1 an a d nd la k te e n ep cy, th w e e o v th ar e y r
0 8563100000
2
numb
5
er of
1
p
0
roce
1
s
5
sed b
2
a
0
tche
5
s
0 3 .0 4 .0 5 .0 6 .0
in
7 .0
ten
0 .1
sity
0 .2 0 .5 0 .0
1
0 .0
2 • Observation.FromFigure25(a),wecanseethetrend
of throughput declining as the number of attributes
(a) Deviation. (b) Intensityvsaccuracy.
in tuple increases. Figure 26 (a) shows that the la-
Fig.24.ModelanalysisforQ1onRyzen52400G. tencyalsoincreases.
• Insight. More attributes mean that the system needs
Performance Model Accuracy. In stream processing,
to read more input data, which results in more data
after each batch is processed, we use the measured batch
processingtime,andincreasesthelatency.
processing speed to correct our model. We use the ex-
ample of Q1 for illustration, as shown in Figure 24. We Window size. We explore the influence of window size
use the percent deviation to measure the accuracy of our onthroughputandlatencyinFigure25(b)andFigure26(b).
performancemodel.Thepercentdeviationisdefinedasthe Weuseablockofthreadstoprocessawindowinabatch.
absolute value of the real throughput minus the estimated
• Observation. As the window size becomes larger, the
throughput, divided by the real throughput. The smaller
throughput decreases, and the latency increases. In
the percent deviation is, the more accurate the predicted
detail,whenthewindowsizeislessthan64,theper-
resultis.Thedeviationdecreasesasthenumberofprocessed
formance curve changes relatively smoothly. When
batches increases. After 20 batches are processed, we can
it is greater than 64, the performance curve changes
reduce the deviation to less than 10%. Please note that in
drastically.
stream processing scenarios, input tuples are continuously
• Insight.Thethroughputandlatencybehaviormainly
coming, so the time for correcting performance prediction
relatestotwofactors:parallelismandexecutiontime
can be ignored in stream processing. For dynamic work-
of operators. First, in FineStream (also Saber), we
loads, the accuracy also depends on the intensity of work-
use a block of threads to process a window in a
load changes. The intensity is defined as the sum of the
batch.Ifthewindowsizeistoosmall,suchas32,the
absolute differences in the amount of data arrival per unit
thread block is not large enough to release the GPU
time.InFineStream,theminimumtimeintervalis0.05s.We
power.Second,inQ1,theexecutiontimeofgroup-by
sum the absolute values of the change in the amount of
operatorislong.Alargerwindowsizerequiresmore
arrivaldataineveryminimumtimeinterval|∆V|together,
timetogroupdata.
and then divide the sum by the time to get the intensity,
as shown in Equation 12. In our evaluation, the greater Slide size. Next, we investigate the impact of slide size
the intensity, the lower the prediction accuracy. We use the onperformance.WevarytheslidesizeofQ1,andtheother
example of Q1 for illustration, as shown in Figure 24 (b). factorsremainthesame.
When the intensity is less than 0.45, the accuracy is higher
than98%.However,whentheintensityisgreaterthan0.56, • Observation.Figure25(c)andFigure26(c)showthat,
theaccuracydecreases. along with the slide size, the throughput increases
and the latency decreases. When the slide size is
(cid:80)range−1|∆V|
larger than ten, the performance curve does not
intensity = t=0 (12)
t changedrastically.
range

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     |     |     |     |     |     |     | 15  |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
)s/selput 501( tuphguorht )s/selput 501( tuphguorht )s/selput 501( tuphguorht )s/selput 501( tuphguorht
|     |              |            |     |  32 |              |            |  22 |              |       |     |     |              |       |     |
| --- | ------------ | ---------- | --- | --- | ------------ | ---------- | --- | ------------ | ----- | --- | --- | ------------ | ----- | --- |
|  12 | SingleDevice |            |     |     | SingleDevice |            |  20 |              |       |     |  12 | SingleDevice |       |     |
|     |              | Saber      |     |  28 |              | Saber      |  18 |              |       |     |     |              | Saber |     |
|     |              |            |     |  24 |              |            |  16 |              |       |     |     |              |       |     |
|  8  |              | FineStream |     |  20 |              | FineStream |  14 |              |       |     |  8  | FineStream   |       |     |
|     |              |            |     |  16 |              |            |  12 |              |       |     |     |              |       |     |
|     |              |            |     |  12 |              |            |  10 |              |       |     |     |              |       |     |
|  4  |              |            |     |     |              |            |  8  | SingleDevice |       |     |  4  |              |       |     |
|     |              |            |     |  8  |              |            |  6  |              | Saber |     |     |              |       |     |
|     |              |            |     |  4  |              |            |  4  | FineStream   |       |     |     |              |       |     |
|  0  |              |            |     |  0  |              |            |  2  |              |       |     |  0  |              |       |     |
9 12 18 24 32 64 128 256 512 1 5 10 20 40 60 512 5120 51200 64000
|     | number of atrributes |     |     |     |     | window size |     | slide size |     |     |     |     | batch size |     |
| --- | -------------------- | --- | --- | --- | --- | ----------- | --- | ---------- | --- | --- | --- | --- | ---------- | --- |
(a) Differentnumberofattributes. (b) Differentwindowsizes. (c) Differentslidesizes. (d) Differentbatchsizes.
Fig.25.Performanceimpactofthenumberofattributes,slidesize,windowsize,andbatchsizeforQ1.
|  0.5        |              |       |     |  1               |              |       |  0.3        |              |       |     |  0.5        |              |       |     |
| ----------- | ------------ | ----- | --- | ---------------- | ------------ | ----- | ----------- | ------------ | ----- | --- | ----------- | ------------ | ----- | --- |
|             | SingleDevice |       |     |  0.9             | SingleDevice |       |             | SingleDevice |       |     |             | SingleDevice |       |     |
|  0.4        |              | Saber |     |  0.8             |              | Saber |  0.25       |              | Saber |     |  0.4        |              | Saber |     |
| )s( ycnetal |              |       |     | )s( ycnetal  0.7 |              |       | )s( ycnetal |              |       |     | )s( ycnetal |              |       |     |
|             | FineStream   |       |     |                  | FineStream   |       |  0.2        | FineStream   |       |     |             | FineStream   |       |     |
|  0.3        |              |       |     |  0.6             |              |       |             |              |       |     |  0.3        |              |       |     |
|             |              |       |     |  0.5             |              |       |  0.15       |              |       |     |             |              |       |     |
|  0.2        |              |       |     |  0.4             |              |       |             |              |       |     |  0.2        |              |       |     |
|             |              |       |     |  0.3             |              |       |  0.1        |              |       |     |             |              |       |     |
|  0.1        |              |       |     |  0.2             |              |       |             |              |       |     |  0.1        |              |       |     |
 0.05
 0.1
|  0  |     |     |     |  0  |     |     |  0  |     |     |     |     |  0  |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
9 12 18 24 32 64 128 256 512 1 5 10 20 40 60 512 5120 51200 64000
|     | number of atrributes |     |     |     |     | window size |     | slide size |     |     |     |     | batch size |     |
| --- | -------------------- | --- | --- | --- | --- | ----------- | --- | ---------- | --- | --- | --- | --- | ---------- | --- |
(a) Differentnumberofattributes. (b) Differentwindowsizes. (c) Differentslidesizes. (d) Differentbatchsizes.
Fig.26.Latencyimpactofthenumberofattributes,slidesize,windowsize,andbatchsizeforQ1.
• Insight. In our evaluation, we use the number of architectures, FineStream adopts continuous operator (CO)
processed tuples from the stream as the evaluation model[22],whereeachoperatorofaquerycanbeindepen-
indicator and do not repeatedly count the tuples in dently placed at a device. We further build a performance
overlappingareasofdifferentwindows.Aslidesize model to guide operator-device placement optimization.
largerthantencanmakeabatchbeprocessedfaster, Although these techniques are standard, applying these
sothelatencybecomesshorter. techniquestointegratedarchitectures,particularlyinstream
processingsituations,involvesseveralchallengestohandle.
Batch size.Afterwediscussthecharacteristicsofslides
Forexample,weneedtooptimizeaqueryplanwithshared
andwindows,wefurtherexplorethebatchinfluence.
|     |     |     |     |     |     |     | memory | and | make | adjustments | for | dynamic | workloads. |     |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | ---- | ----------- | --- | ------- | ---------- | --- |
• Observation. Figure 25 (d) reports the throughput It is noteworthy that our fine-grained operator placement
influence of batch size, and Figure 26 (d) reports is different from classical placement strategies for general
the latency influence. When the batch size is small, stream processing [36], [41], [42], [43] for their different
thethroughputandlatencyincreasewithbatchsize. designgoals.Inparticular,mostpriorworksaimatreducing
However, when the batch size reaches 51200, the communicationoverheadamongoperators,whichisnotan
performancehasreachedasteadystate. issue in FineStream. Instead, FineStream takes device pref-
Insight.Batchesaretheactualprocessingdataunitsin
| •   |     |     |     |     |     |     | erence | into consideration |     | during |     | placement | optimization, |     |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------------------ | --- | ------ | --- | --------- | ------------- | --- |
thesystem.Thelargerbatchsizeisgoodforthrough- which has not been considered before in stream processing
|     | put because | more      | data    | can be   | processed | in parallel. | frameworks[13]. |        |            |     |            |       |             |       |
| --- | ----------- | --------- | ------- | -------- | --------- | ------------ | --------------- | ------ | ---------- | --- | ---------- | ----- | ----------- | ----- |
|     | When        | the batch | reaches | a limit, | the       | performance  |                 |        |            |     |            |       |             |       |
|     |             |           |         |          |           |              | Parallel        | stream | processing |     | [4], [44], | [45], | [46], [47], | [48], |
tendstoflatten.
|           |     |      |     |     |     |     | [49], [50], | [51],         | query | processing | [52],   | [53],    | [54], [55], | [56],  |
| --------- | --- | ---- | --- | --- | --- | --- | ----------- | ------------- | ----- | ---------- | ------- | -------- | ----------- | ------ |
|           |     |      |     |     |     |     | [57], and   | heterogeneous |       | systems    | [35],   | [58],    | [59], [60], | [61],  |
| 9 RELATED |     | WORK |     |     |     |     |             |               |       |            |         |          |             |        |
|           |     |      |     |     |     |     | [62], [63], | [64],         | [65], | [66]       | are hot | research | topics      | in re- |
The closest work to FineStream is Saber [4], which aims cent years. Different from these works, FineStream targets
to utilize discrete CPU-GPU architectures. Saber [4] adopts sliding window-based stream processing, which focuses
the micro-batch processing model, where the whole query on window handling with SQL and dynamic adjustment.
(with multiple operators) on each batch of input data is GPUshavemassivethreadsandhighbandwidth,andhave
dispatched on one device. Such a mechanism naturally emerged to be one of the most promising heterogeneous
minimizes the communication overhead among operators accelerators to speedup stream processing. Verner et al. [8]
inside the same query. It is hence suitable in discrete CPU- presented a stream processing algorithm considering var-
GPUarchitectures,wherePCI-eoverheadissignificantand ious latency and throughput requirements on GPUs. Al-
shall be avoided as much as possible. However, it may ghabi et al. [23] developed a framework for stateful stream
resultinsuboptimalityinintegratedarchitecturesformainly data processing on multiple GPUs. De Matteis et al. [24]
two reasons. First, it overlooks the performance difference developedGassersystemforoffloadingoperatorsonGPUs.
between different devices for each operator. Second, the Pinnecke et al. [67] studied how to efficiently process large
communication overhead between the CPU and the GPU windows on GPUs. Chen et al. [26] extended the popular
inintegratedarchitecturesisnegligible.Targetingintegrated stream processing system, Storm [68], to GPU platforms.

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 16  |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
FineStream differs from those previous works in two as- [10] D. Bouvier and B. Sander, “Applying AMD’s Kaveri APU for
pects: firstly on integrated architectures, and secondly for heterogeneous computing,” in Hot Chips: A Symposium on High
PerformanceChips(HC26),2014.
| SQL streaming |     | processing. |     | Besides | the | integrated | archi- |     |     |     |     |     |     |     |     |
| ------------- | --- | ----------- | --- | ------- | --- | ---------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
[11] J.Doweck,W.Kaoetal.,“Inside6th-GenerationIntelCore:New
| tecture, | FineStream |     | may | be also | well suited |     | to discrete |     |     |     |     |     |     |     |     |
| -------- | ---------- | --- | --- | ------- | ----------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
MicroarchitectureCode-NamedSkylake,”Micro,2017.
architecturesinthefuture.Inparticular,moreefficientCPU-
|     |     |     |     |     |     |     |     | [12] F. Zhang, | L.  | Yang | et al., “FineStream: |     | Fine-Grained |     | Window- |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ---- | -------------------- | --- | ------------ | --- | ------- |
BasedStreamProcessingonCPU-GPUIntegratedArchitectures,”
| GPU interconnects |     | have | been | developed, |     | such | as NVLink |     |     |     |     |     |     |     |     |
| ----------------- | --- | ---- | ---- | ---------- | --- | ---- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
inUSENIXATC,2020.
| and PCIe | v4. | FineStream’s |     | fine-grained | operator |     | placement |     |     |     |     |     |     |     |     |
| -------- | --- | ------------ | --- | ------------ | -------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
[13] S.Zhang,F.Zhangetal.,“Hardware-consciousstreamprocessing:
| strategy | would | benefit | from | the significantly |     | reduced | data |     |     |     |     |     |     |     |     |
| -------- | ----- | ------- | ---- | ----------------- | --- | ------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
Asurvey,”SIGMODRec.,2020.
transmissionoverheadinthosediscretearchitectures.
|     |     |     |     |     |     |     |     | [14] A. Arasu, | S.  | Babu, | and J. Widom, |     | “The CQL | continuous | query |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ----- | ------------- | --- | -------- | ---------- | ----- |
language:semanticfoundationsandqueryexecution,”TheVLDB
Journal,2006.
10 CONCLUSION [15] “TheComputeArchitectureofIntelProcessorGraphicsGen7.5,”
https://software.intel.com/.
| Although | stream | processing |     | has shown | significant |     | perfor- |     |     |     |     |     |     |     |     |
| -------- | ------ | ---------- | --- | --------- | ----------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
[16] J.E.Stone,D.Gohara,andG.Shi,“OpenCL:Aparallelprogram-
| mance | benefits | on GPUs, |     | the data | transmission |     | via PCI-e |     |     |     |     |     |     |     |     |
| ----- | -------- | -------- | --- | -------- | ------------ | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
mingstandardforheterogeneouscomputingsystems,”Computing
hinders its further performance improvement. This paper inscience&engineering,2010.
revisits window-based stream processing on the promising [17] M.J.Schulte,M.Ignatowskietal.,“Achievingexascalecapabilities
CPU-GPU integrated architectures, and with CPUs and throughheterogeneouscomputing,”Micro,2015.
[18] T.Vijayaraghavan,Y.Eckertetal.,“DesignandAnalysisofanAPU
GPUs integrated on the same chip, the data transmis- forExascaleComputing,”inHPCA,2017.
sion overhead is eliminated. Furthermore, such integration [19] D. Bouvier and B. Sander, “Applying AMD’s Kaveri APU for
opens up new opportunities for fine-grained multi-query heterogeneouscomputing,”inHotChipsSymposium,2014.
[20] F.Zhang,J.Zhaietal.,“Understandingco-runningbehaviorson
| cooperation | between |     | different | devices, | and | we  | develop | a   |     |     |     |     |     |     |     |
| ----------- | ------- | --- | --------- | -------- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
integratedcpu/gpuarchitectures,”TPDS,2017.
| framework | called | FineStream |     | for fine-grained |     | stream | pro- |     |     |     |     |     |     |     |     |
| --------- | ------ | ---------- | --- | ---------------- | --- | ------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
[21] Y.Go,M.A.Jamshedetal.,“APUNet:RevitalizingGPUasPacket
cessingontheintegratedarchitecture.Thisstudyshowsthat
ProcessingAccelerator,”inNSDI,2017.
integratedCPU-GPUarchitecturescanbemoredesirableal-
|     |     |     |     |     |     |     |     | [22] S. Venkataraman, |     | A.  | Panda | et al., | “Drizzle: | Fast and | adaptable |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | ----- | ------- | --------- | -------- | --------- |
streamprocessingatscale,”inSOSP,2017.
ternativearchitecturesforlow-latencyandhigh-throughput
[23] F.Alghabi,U.Schipper,andA.Kolb,“Ascalablesoftwareframe-
| data stream | processing, |     | in      | comparison  | with        | discrete | archi- |      |              |        |      |            |     |          |          |
| ----------- | ----------- | --- | ------- | ----------- | ----------- | -------- | ------ | ---- | ------------ | ------ | ---- | ---------- | --- | -------- | -------- |
|             |             |     |         |             |             |          |        | work | for stateful | stream | data | processing | on  | multiple | gpus and |
| tectures.   | FineStream  |     | achives | significant | performance |          | bene-  |      |              |        |      |            |     |          |          |
applications,”inGPUComputingandApplications,2015.
fitsoverthestate-of-the-artmethod.Experimentsshowthat [24] T.DeMatteis,G.Mencaglietal.,“GASSER:AnAuto-TunableSys-
FineStreamcanimprovetheperformanceby52%overSaber temforGeneralSliding-WindowStreamingOperatorsonGPUs,”
on the integrated architecture. For multi-query processing, IEEEAccess,2019.
[25] K.Zhang,J.Hu,andB.Hua,“Aholisticapproachtobuildreal-
FineStream achieves 32% throughput improvement com- timestreamprocessingsystemwithGPU,”JPDC,2015.
paredtoapplyingdifferentdevicesformultiplequeriesina [26] Z. Chen, J. Xu et al., “G-Storm: GPU-enabled high-throughput
coarse-grainedmethod. onlinedataprocessinginStorm,”inBigData,2015.
|          |     |        |        |            |        |     |             | [27] C. HewaNadungodage, |     |     | Y. Xia, | and | J. J. Lee, | “GStreamMiner: | a   |
| -------- | --- | ------ | ------ | ---------- | ------ | --- | ----------- | ------------------------ | --- | --- | ------- | --- | ---------- | -------------- | --- |
| Compared |     | to the | stream | processing | engine |     | on the dis- |                          |     |     |         |     |            |                |     |
GPU-accelerateddatastreamminingframework,”inCIKM,2016.
cretearchitecture,FineStreamontheintegratedarchitecture
[28] S.TouatiandB.D.DeDinechin,AdvancedBackendCodeOptimiza-
achieves10.4xprice-throughputratio,1.8xenergyefficiency,
|     |     |     |     |     |     |     |     | tion. | JohnWiley&Sons,2014. |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | -------------------- | --- | --- | --- | --- | --- | --- |
andcanenjoylowerlatencybenefits.
|     |     |     |     |     |     |     |     | [29] B. Gedik, | S.  | Schneider | et al., | “Elastic | scaling | for data | stream |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --------- | ------- | -------- | ------- | -------- | ------ |
processing,”TPDS,2013.
| ACKNOWLEDGMENT |     |     |     |     |     |     |     |               |     | et   | al.,                     |     |     |     |            |
| -------------- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ---- | ------------------------ | --- | --- | --- | ---------- |
|                |     |     |     |     |     |     |     | [30] S.Zhang, | H.  | T.Vo | “Multi-queryoptimization |     |     |     | forcomplex |
eventprocessinginSAPESP,”inICDE,2017.
This work is supported by the National Key Research and [31] S. Zhang, J. He et al., “OmniDB: Towards portable and efficient
DevelopmentProgramofChina(No.2018YFB1004401),Na- query processing on parallel CPU/GPU architectures,” PVLDB,
| tional Natural |     | Science | Foundation |     | of China | (No. | 61732014 | 2013. |     |     |     |     |     |     |     |
| -------------- | --- | ------- | ---------- | --- | -------- | ---- | -------- | ----- | --- | --- | --- | --- | --- | --- | --- |
[32] J.He,M.Lu,andB.He,“Revisitingco-processingforhashjoins
and61802412),andBeijingNaturalScienceFoundation(No.
onthecoupledCPU-GPUarchitecture,”PVLDB,2013.
L192027).
|     |     |     |     |     |     |     |     | [33] J. He, | S. Zhang, | and | B. He, | “In-cache | query | co-processing | on  |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --------- | --- | ------ | --------- | ----- | ------------- | --- |
coupledCPU-GPUarchitectures,”PVLDB,2014.
REFERENCES [34] J. Paul, J. He, and B. He, “GPL: A GPU-based pipelined query
processingengine,”inSIGMOD,2016.
[1] “Moregoogleclusterdata,”https://ai.googleblog.com/2011/11/more-
|     |     |     |     |     |     |     |     | [35] H. Pirk, | O.  | Moll et | al., “Voodoo-a |     | vector algebra | for | portable |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------- | -------------- | --- | -------------- | --- | -------- |
google-cluster-data.html.
databaseperformanceonmodernhardware,”PVLDB,2016.
| [2] H. Ziekow |     | and Z. | Jerzak, | “The DEBS | 2014 | grand challenge,” |     | in             |            |     |                |     |         |              |       |
| ------------- | --- | ------ | ------- | --------- | ---- | ----------------- | --- | -------------- | ---------- | --- | -------------- | --- | ------- | ------------ | ----- |
|               |     |        |         |           |      |                   |     | [36] R. Castro | Fernandez, |     | M. Migliavacca |     | et al., | “Integrating | scale |
DEBS,2014.
[3] A.Arasu,M.Cherniacketal.,“Linearroad:astreamdatamanage- outandfaulttoleranceinstreamprocessingusingoperatorstate
| mentbenchmark,”inPVLDB,2004. |     |     |     |     |     |     |     | management,”inSIGMOD,2013. |     |     |     |     |     |     |     |
| ---------------------------- | --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- |
[4] A. Koliousis and et al., “Saber: Window-based hybrid stream [37] I.S.Moreno,P.Garraghanetal.,“Analysis,modelingandsimu-
|     |     |     |     |     |     |     |     | lation | of workload |     | patterns | in a large-scale |     | utility cloud,” | IEEE |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ----------- | --- | -------- | ---------------- | --- | --------------- | ---- |
processingforheterogeneousarchitectures,”inSIGMOD,2016.
TransactionsonCloudComputing,2014.
| [5] G. Theodorakis, |     | P.  | R. Pietzuch, | and | H. Pirk, | “SlideSide: | A fast |     |     |     |     |     |     |     |     |
| ------------------- | --- | --- | ------------ | --- | -------- | ----------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
IncrementalStreamProcessingAlgorithmforMultipleQueries,” [38] F. Zhang, B. Wu et al., “Automatic Irregularity-Aware Fine-
inEDBT,2020. Grained Workload Partitioning on Integrated Architectures,”
| [6] K.Wang,K.Zhangetal.,“Concurrentanalyticalqueryprocessing |     |     |     |     |     |     |     | TKDE,2019. |     |     |     |     |     |     |     |
| ------------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
withGPUs,”PVLDB,2014. [39] M.GowanlockandB.Karsin,“AhybridCPU/GPUapproachfor
|     |     |     |     |     |     |     |     |     |     |     |     | Parallel | Computing, |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | ---------- | --- | --- |
[7] J.NickollsandW.J.Dally,“TheGPUcomputingera,”Micro,2010. optimizing sorting throughput,” vol. 85, pp.
| [8] U. | Verner, | A. Schuster, |     | and M. Silberstein, |     | “Processing | data | 45–55,2019. |     |     |     |     |     |     |     |
| ------ | ------- | ------------ | --- | ------------------- | --- | ----------- | ---- | ----------- | --- | --- | --- | --- | --- | --- | --- |
streams with hard real-time constraints on heterogeneous sys- [40] Y.-M.N.Nam,D.H.Han,andM.-S.K.Kim,“SPRINTER:AFast
tems,”inICS,2011. n-aryJoinQueryProcessingMethodforComplexOLAPQueries,”
[9] D. Boggs, G. Brown et al., “Denver: Nvidia’s First 64-bit ARM inProceedingsofthe2020ACMSIGMODInternationalConferenceon
| Processor,”Micro,2015. |     |     |     |     |     |     |     | ManagementofData,2020,pp.2055–2070. |     |     |     |     |     |     |     |
| ---------------------- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- | --- | --- | --- |

| JOURNALOFLATEXCLASSFILES,VOL.14,NO.8,AUGUST2015 |     |     |     |     |     |     |     |     |     |     |     |     | 17  |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
[41] P.Carbone,A.Katsifodimosetal.,“Apacheflink:Streamandbatch FengZhangreceivedthebachelordegreefrom
processinginasingleengine,”BulletinoftheIEEEComputerSociety Xidian University in 2012, and the PhD degree
TechnicalCommitteeonDataEngineering,2015. incomputersciencefromTsinghuaUniversityin
2017.HeisanassistantprofessorwiththeKey
[42] L.Neumeyer,B.Robbinsetal.,“S4:Distributedstreamcomputing
platform,”inICDMWorkshops,2010. LaboratoryofDataEngineeringandKnowledge
[43] A.Toshniwal,S.Tanejaetal.,“Storm@twitter,”inSIGMOD,2014. Engineer (MOE), Renmin University of China.
[44] P. Pietzuch, J. Ledlie et al., “Network-aware operator placement Hismajorresearchinterestsincludehighperfor-
forstream-processingsystems,”inICDE,2006. mance computing, heterogeneous computing,
andparallelanddistributedsystems.
[45] B.Chandramouli,J.Goldsteinetal.,“Accuratelatencyestimation
inadistributedeventprocessingsystem,”inICDE,2011.
[46] K.Bhardwaj,P.Agrawaletal.,“Appflux:Tamingappdeliveryvia
streaming,”Proc.oftheUsenixTRIOS,2015.
ChenyangZhangisanundergraduateinSchool
| [47] R. Ben-Basat, |     | G. Einziger |     | et al., “Heavy | hitters | in  | streams and |     |     |     |     |     |     |
| ------------------ | --- | ----------- | --- | -------------- | ------- | --- | ----------- | --- | --- | --- | --- | --- | --- |
ofInformation,RenminUniversityofChina.She
slidingwindows,”inINFOCOM,2016.
[48] N.AgrawalandA.Vulimiri,“Low-LatencyAnalyticsonColossal joined the Key Laboratory of Data Engineering
andKnowledgeEngineer(MOE)in2019.Herre-
DataStreamswithSummaryStore,”inSOSP,2017.
searchinterestsincludehighperformancecom-
[49] P.Fernando,A.Gavrilovskaetal.,“NVStream:acceleratingHPC
|     |     |     |     |     |     |     |     | puting, heterogeneous |     | computing, |     | and | parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | ---------- | --- | --- | -------- |
workflowswithNVRAM-basedtransportforstreamingobjects,”
accelerating.
inHPDC,2018.
| [50] X. Fu, | T. Ghaffar |     | et al., | “Edgewise: | a better | stream | processing |     |     |     |     |     |     |
| ----------- | ---------- | --- | ------- | ---------- | -------- | ------ | ---------- | --- | --- | --- | --- | --- | --- |
enginefortheedge,”inUSENIXATC,2019.
| [51] S. Zhang, |     | B. He | et al., “Revisiting |     | the design | of  | data stream |     |     |     |     |     |     |
| -------------- | --- | ----- | ------------------- | --- | ---------- | --- | ----------- | --- | --- | --- | --- | --- | --- |
processingsystemsonmulti-coreprocessors,”inICDE,2017. Lin Yang received the bachelor degree from
[52] T.F.Wenisch,M.Ferdmanetal.,“Practicaloff-chipmeta-datafor ChengduUniversityofTechnologyin2017.Heis
temporalmemorystreaming,”inHPCA,2009.
agraduatestudentintheSchoolofinformation,
| [53] B. Chandramouli, |     |     | J. Goldstein | et  | al., “Trill: | A high-performance |     |                   |     |           |     |            |     |
| --------------------- | --- | --- | ------------ | --- | ------------ | ------------------ | --- | ----------------- | --- | --------- | --- | ---------- | --- |
|                       |     |     |              |     |              |                    |     | Renmin University |     | of China. | He  | joined the | Key |
incrementalqueryprocessorfordiverseanalytics,”PVLDB,2014.
LaboratoryofDataEngineeringandKnowledge
[54] B.Chandramouli,R.C.Fernandezetal.,“Quill:efficient,transfer- Engineer (MOE) in 2017. His major research
able,andrichanalyticsatscale,”PVLDB,2016. interests include high performance computing,
| [55] P. A. | Boncz, | M.  | L. Kersten, | and | S. Manegold, | “Breaking | the |     |     |     |     |     |     |
| ---------- | ------ | --- | ----------- | --- | ------------ | --------- | --- | --- | --- | --- | --- | --- | --- |
heterogeneouscomputing,andparallelanddis-
MemoryWallinMonetDB,”Commun.ACM,2008.
tributedsystems.
[56] S.BreßandG.Saake,“WhyItisTimeforaHyPE:AHybridQuery
| Processing     |     | Engine | for Efficient | GPU           | Coprocessing |              | in DBMS,” |                                        |     |     |     |     |     |
| -------------- | --- | ------ | ------------- | ------------- | ------------ | ------------ | --------- | -------------------------------------- | --- | --- | --- | --- | --- |
| PVLDB,2013.    |     |        |               |               |              |              |           | ShuhaoZhangreceivedthebachelordegreein |     |     |     |     |     |
| [57] P. Bakkum |     | and K. | Skadron,      | “Accelerating |              | SQL Database | Opera-    |                                        |     |     |     |     |     |
computerengineeringfromNanyangTechnolog-
tionsonaGPUwithCUDA,”inProceedingsofthe3rdWorkshopon
|     |     |     |     |     |     |     |     | ical University | in  | 2014, and | the | PhD degree | in  |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --------- | --- | ---------- | --- |
General-PurposeComputationonGraphicsProcessingUnits,2010. computer science in National University of Sin-
[58] M. R. Meswani, S. Blagodurov et al., “Heterogeneous memory gaporein2019.HeiscurrentlyanAssistantPro-
architectures:AHW/SWapproachformixingdie-stackedandoff- fessorattheSingaporeUniversityofTechnology
packagememories,”inHPCA,2015.
andDesign.Hisresearchinterestsincludehigh
| [59] Z. Tang | and | Y. Won, | “Multithread |     | content | based file | chunking |     |     |     |     |     |     |
| ------------ | --- | ------- | ------------ | --- | ------- | ---------- | -------- | --- | --- | --- | --- | --- | --- |
performancecomputing,streamprocessingsys-
systeminCPU-GPGPUheterogeneousarchitecture,”in2011First tems,anddatabasesystems.
| International |     | Conference | on  | Data Compression, |     | Communications | and |     |     |     |     |     |     |
| ------------- | --- | ---------- | --- | ----------------- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
Processing,2011.
[60] A. M. Merritt, V. Gupta et al., “Shadowfax: scaling in heteroge- Bingsheng He received the bachelor degree
neousclustersystemsviaGPGPUassemblies,”inProceedingsofthe in computer science from Shanghai Jiao Tong
5thinternationalworkshoponVirtualizationtechnologiesindistributed University (1999-2003), and the PhD degree in
| computing,2011. |     |     |     |     |     |     |     | computer | science | in Hong | Kong | University | of  |
| --------------- | --- | --- | --- | --- | --- | --- | --- | -------- | ------- | ------- | ---- | ---------- | --- |
[61] M.Silberstein,S.Kimetal.,“GPUnet:Networkingabstractionsfor ScienceandTechnology(2003-2008).Heisan
GPUprograms,”TOCS,2016. Associate Professor in School of Computing,
[62] S.Bergman,T.Brokhmanetal.,“SPIN:seamlessoperatingsystem National University of Singapore. His research
integration of peer-to-peer DMA between SSDs and GPUs,” in interests are high performance computing, dis-
| USENIXATC,2017. |     |     |     |     |     |     |     | tributedandparallelsystems,anddatabasesys- |     |     |     |     |     |
| --------------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------ | --- | --- | --- | --- | --- |
[63] Q.Cao,N.Balasubramanian,andA.Balasubramanian,“Mobirnn: tems.
EfficientrecurrentneuralnetworkexecutiononmobileGPU,”in
| Proceedings |     | of the 1st | International |     | Workshop | on Deep | Learning for |                 |     |         |        |             |     |
| ----------- | --- | ---------- | ------------- | --- | -------- | ------- | ------------ | --------------- | --- | ------- | ------ | ----------- | --- |
|             |     |            |               |     |          |         |              | Wei Lu received |     | the PhD | degree | in computer |     |
MobileSystemsandApplications,2017.
|                      |               |     |                |     |                       |        |          | science  | from the        | Renmin | University | of        | China, |
| -------------------- | ------------- | --- | -------------- | --- | --------------------- | ------ | -------- | -------- | --------------- | ------ | ---------- | --------- | ------ |
| [64] P. Chrysogelos, |               | M.  | Karpathiotakis |     | et al., “HetExchange: |        | Encap-   |          |                 |        |            |           |        |
|                      |               |     |                |     |                       |        |          | in 2011. | He is currently | an     | associate  | professor |        |
| sulating             | heterogeneous |     | CPU-GPU        |     | parallelism           | in JIT | compiled |          |                 |        |            |           |        |
engines,”PVLDB,2019. attheRenminUniversityofChina.Hisresearch
[65] L.Liu,S.Yangetal.,“HierarchicalHybridMemoryManagement interestsincludequeryprocessinginthecontext
ofspatiotemporal,clouddatabasesystems,and
inOSforTieredMemorySystems,”TPDS,2019.
applications.
[66] T.D.Doudali,S.Blagodurovetal.,“Kleio:AHybridMemoryPage
SchedulerwithMachineIntelligence,”inHPDC,2019.
[67] M.Pinnecke,D.Broneske,andG.Saake,“TowardGPUAcceler-
atedDataStreamProcessing.”inGvD,2015.
[68] “ApacheStorm,” http://storm.apache.org/. Xiaoyong Du obtained the B.S. degree from
|     |     |     |     |     |     |     |     | Hangzhou       | University, | Zhengjiang, |             | China,    | in      |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | ----------- | ----------- | ----------- | --------- | ------- |
|     |     |     |     |     |     |     |     | 1983, the      | M.E.        | degree      | from Renmin |           | Univer- |
|     |     |     |     |     |     |     |     | sity of China, | Beijing,    | China,      | in          | 1988, and | the     |
Ph.D.degreefromNagoyaInstituteofTechnol-
|     |     |     |     |     |     |     |     | ogy, Nagoya, | Japan, | in 1997. | He  | is currently | a   |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ------ | -------- | --- | ------------ | --- |
professorwiththeSchoolofInformation,Renmin
|     |     |     |     |     |     |     |     | University   | of China. | His | current     | research | inter- |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --------- | --- | ----------- | -------- | ------ |
|     |     |     |     |     |     |     |     | ests include | databases | and | intelligent | informa- |        |
tionretrieval.