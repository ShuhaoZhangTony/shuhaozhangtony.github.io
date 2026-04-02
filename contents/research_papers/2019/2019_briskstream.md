|              | BriskStream: |                               |     |              | Scaling |             | Data      | Stream                                          |                               |          | Processing  |     |             |     |     |
| ------------ | ------------ | ----------------------------- | --- | ------------ | ------- | ----------- | --------- | ----------------------------------------------- | ----------------------------- | -------- | ----------- | --- | ----------- | --- | --- |
|              | on           | Shared-Memory                 |     |              |         |             | Multicore |                                                 | Architectures                 |          |             |     |             |     |     |
|              |              | Shuhao                        |     | Zhang∗       |         |             |           |                                                 |                               | Jiong    | He          |     |             |     |     |
|              |              | NationalUniversityofSingapore |     |              |         |             |           |                                                 | AdvancedDigitalSciencesCenter |          |             |     |             |     |     |
|              |              | Amelie                        |     | Chi          | Zhou    |             |           |                                                 | Bingsheng                     |          |             | He  |             |     |     |
|              |              | ShenzhenUniversity            |     |              |         |             |           |                                                 | NationalUniversityofSingapore |          |             |     |             |     |     |
| ABSTRACT     |              |                               |     |              |         |             |           | Witnessingtheemergenceofmoderncommoditymachines |                               |          |             |     |             |     |     |
|              |              |                               |     |              |         |             |           | with massively                                  |                               | parallel | processors, |     | researchers |     | and |
| We introduce |              | BriskStream,                  |     | an in-memory |         | data stream |           |                                                 |                               |          |             |     |             |     |     |
processingsystem(DSPSs)specificallydesignedformodern practitionersfindshared-memorymulticorearchitectures
anattractiveplatformforstreamingapplications[35,42,54].
shared-memorymulticorearchitectures.BriskStream’skey
|              |     |                 |     |                   |     |           |     | However, | prior | studies | [54] have | shown |     | that existing |     |
| ------------ | --- | --------------- | --- | ----------------- | --- | --------- | --- | -------- | ----- | ------- | --------- | ----- | --- | ------------- | --- |
| contribution |     | is an execution |     | plan optimization |     | paradigm, |     |          |       |         |           |       |     |               |     |
namely RLAS, which takes relative-location (i.e., NUMA data stream processing system (DSPSs) underutilize the
underlyingcomplexhardwaremicro-architectureandshow
| distance) | of  | each pair | of producer-consumer |     |     | operators |     |     |     |     |     |     |     |     |     |
| --------- | --- | --------- | -------------------- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
poorscalabilityduetotheunmanagedresourcecompetition
| into | consideration. | We  | propose |     | a branch | and | bound |     |     |     |     |     |     |     |     |
| ---- | -------------- | --- | ------- | --- | -------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
based approach with three heuristics to resolve the andunawarenessofnon-uniformmemoryaccess(NUMA)
| resultingnontrivialoptimizationproblem.Theexperimental |     |     |     |     |     |     |     | effect. |     |     |     |     |     |     |     |
| ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
ManyDSPSs,suchasStorm[5],Heron[36],Flink[4]and
| evaluations | demonstrate |     | that | BriskStream |     | yields | much |     |     |     |     |     |     |     |     |
| ----------- | ----------- | --- | ---- | ----------- | --- | ------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
higherthroughputandbetterscalabilitythanexistingDSPSs Seep [25], share similar architectures including pipelined
onmulti-corearchitectureswhenprocessingdifferenttypes processing and operator replication designs. Specifically,
|     |     |     |     |     |     |     |     | an application | is  | expressed | as  | a DAG | (directed |     | acyclic |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --------- | --- | ----- | --------- | --- | ------- |
ofworkloads.
graph)wherevertexescorrespondtocontinuouslyrunning
ACMReferenceFormat:
operators,andedgesrepresentdatastreamsflowingbetween
ShuhaoZhang,JiongHe,AmelieChiZhou,andBingshengHe.
operators.Tosustainhighinputstreamingressrates,each
| 2019. | BriskStream: | Scaling | Data | Stream | Processing | on Shared- |     |          |                   |     |      |          |          |         |     |
| ----- | ------------ | ------- | ---- | ------ | ---------- | ---------- | --- | -------- | ----------------- | --- | ---- | -------- | -------- | ------- | --- |
|       |              |         |      |        |            |            |     | operator | can be replicated |     | into | multiple | replicas | running |     |
MemoryMulticoreArchitectures.In2019InternationalConference
inparallelthreads.Astreamingexecutionplandetermines
| on Management |              | of Data | (SIGMOD | ’19),     | June | 30–July 5, | 2019,  |            |             |     |         |          |        |          |     |
| ------------- | ------------ | ------- | ------- | --------- | ---- | ---------- | ------ | ---------- | ----------- | --- | ------- | -------- | ------ | -------- | --- |
|               |              |         |         |           |      |            |        | the number | of replicas |     | of each | operator | (i.e., | operator |     |
| Amsterdam,    | Netherlands. |         | ACM,    | New York, | NY,  | USA, 18    | pages. |            |             |     |         |          |        |          |     |
replication),aswellasthewayofallocatingeachoperatorto
https://doi.org/10.1145/3299869.3300067
theunderlyingCPUcores(i.e.,operatorplacement).Inthis
1 INTRODUCTION paper,weaddressthequestionofhowtofindastreaming
|     |     |     |     |     |     |     |     | execution | plan that | maximizes |     | processing | throughput |     | of  |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------- | --------- | --- | ---------- | ---------- | --- | --- |
Modernmulticoreprocessorshavedemonstratedsuperior
DSPSinsharedmemorymulti-corearchitectures.
| performance |     | for real-world |     | applications | [14] | with | their |     |     |     |     |     |     |     |     |
| ----------- | --- | -------------- | --- | ------------ | ---- | ---- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
NUMA-awaresystemoptimizationshavebeenpreviously
increasingcomputingcapabilityandlargermemorycapacity.
|     |     |     |     |     |     |     |     | studied | in the context | of  | relational | database |     | [27, | 39, 48]. |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | -------------- | --- | ---------- | -------- | --- | ---- | -------- |
Forexample,recentscale-upserverscanaccommodateeven
|     |     |     |     |     |     |     |     | However, | those works |     | are either | 1) focused |     | on different |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | --- | ---------- | ---------- | --- | ------------ | --- |
hundredsofCPUcoresandmulti-terabytesofmemory[2].
|     |     |     |     |     |     |     |     | optimization | goals | (e.g., | better | load | balancing | [48] | or  |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ----- | ------ | ------ | ---- | --------- | ---- | --- |
minimizingresourceutilization[27])or2)basedondifferent
∗WorkdonewhileasresearchtraineeatSAPSingapore.
|     |     |     |     |     |     |     |     | system | architectures | [39]. | They | provide | highly | valuable |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ------------- | ----- | ---- | ------- | ------ | -------- | --- |
Permissiontomakedigitalorhardcopiesofallorpartofthisworkfor techniques,mechanismsandexecutionmodelsbutnoneof
personalorclassroomuseisgrantedwithoutfeeprovidedthatcopiesarenot themusestheknowledgeathandtosolvetheproblemwe
madeordistributedforprofitorcommercialadvantageandthatcopiesbear
address.
thisnoticeandthefullcitationonthefirstpage.Copyrightsforcomponents
|     |     |     |     |     |     |     |     | The key | challenge | of  | finding | an  | optimal | streaming |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | --------- | --- | ------- | --- | ------- | --------- | --- |
ofthisworkownedbyothersthanACMmustbehonored.Abstractingwith
|     |     |     |     |     |     |     |     | execution | plan on | multicore | architectures |     | is  | that there | is  |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------- | --------- | ------------- | --- | --- | ---------- | --- |
creditispermitted.Tocopyotherwise,orrepublish,topostonserversorto
redistributetolists,requirespriorspecificpermissionand/orafee.Request a varying processing capability and resource demand of
permissionsfrompermissions@acm.org. eachoperatorduetovaryingremotememoryaccesspenalty
SIGMOD’19,June30–July5,2019,Amsterdam,Netherlands under different execution plans. Witnessing this problem,
©2019AssociationforComputingMachinery.
|     |     |     |     |     |     |     |     | we present | a novel | NUMA-aware |     | streaming |     | execution |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------- | ---------- | --- | --------- | --- | --------- | --- |
ACMISBN978-1-4503-5643-5/19/06...$15.00
planoptimizationparadigm,calledRelative-LocationAware
https://doi.org/10.1145/3299869.3300067

| Scheduling | (RLAS). | RLAS | takes | the | relative | location (i.e., |     |     |     |     |     |     |
| ---------- | ------- | ---- | ----- | --- | -------- | --------------- | --- | --- | --- | --- | --- | --- |
NUMA distance) of each pair of producer-consumer into CPU  CPU  CPU  CPU
|               |        |               |     |     |      |                 |           |      |      |     | 3 0 | 4 6 |
| ------------- | ------ | ------------- | --- | --- | ---- | --------------- | --------- | ---- | ---- | --- | --- | --- |
| consideration | during | optimization. |     | In  | this | way, it is able |           |      |      |     |     |     |
|               |        |               |     |     |      |                 | CPU  CPU  | CPU  | CPU  |     |     |     |
to determine the correlation between a solution and its 3 0 4 7 CPU  CPU  CPU  CPU
objectivevalue,e.g.,predictthethroughputofeachoperator 2 1 5 7
|     |     |     |     |     |     |     | CPU  CPU  | CPU  | CPU  |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---- | ---- | --- | --- | --- |
foragivenexecutionplan.Thisisdifferenttosomerelated 2 1 5 6 XNC XNC
| studies [27, | 34, 51], | which | assume | a   | predefined | and fixed |     |     |     |     |     |     |
| ------------ | -------- | ----- | ------ | --- | ---------- | --------- | --- | --- | --- | --- | --- | --- |
processingcapability(orcost)ofeachoperator. Upper CPU tray Lower CPU tray Upper CPU tray Lower CPU tray
|     |     |     |     |     |     |     | (a)ServerA(glue-less) |     |     |     | (b)ServerB(glue-assisted) |     |
| --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | --- | ------------------------- | --- |
WhileRLASprovidesamoreaccurateestimationofthe
applicationbehaviorundertheNUMAeffect,theresulting
Figure1:Interconnecttopologyforourservers.
placementoptimizationproblemisstillchallengingtosolve.
Inparticular,stochasticityisintroducedintotheproblem
| as the objective |     | value (e.g., | throughput) |     | or  | weight (e.g., |     |     |     |     |     |     |
| ---------------- | --- | ------------ | ----------- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
RLAS,followedbyadetailedalgorithmdesigninSection4.
resourcedemand)ofeachoperatorisvariableanddepends
Section5discusseshowweoptimizeBriskStreamforshared-
onallpreviousdecisions.Thisleadstoahugesolutionspace.
|     |     |     |     |     |     |     | memory architectures. |     | We  | report | extensive | experimental |
| --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | ------ | --------- | ------------ |
Additionally,theplacementdecisionsmayconflictwitheach
|     |     |     |     |     |     |     | results in | Section | 6. Section | 7 reviews | related | work and |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------- | ---------- | --------- | ------- | -------- |
otherandorderconstraintsareintroducedintotheproblem.
Section8concludesthiswork.
Forinstance,schedulingofanoperatoratoneiterationmay
prohibitsomeotheroperatorstobescheduledtothesame 2 BACKGROUND
socketlater.
Inthissection,weintroducemodernscale-upserversand
| We propose |     | a branch | and | bound | based | approach to |     |     |     |     |     |     |
| ---------- | --- | -------- | --- | ----- | ----- | ----------- | --- | --- | --- | --- | --- | --- |
giveanoverviewofDSPSs.
| solve the       | concerned | placement |        | optimization |        | problem. In |     |     |     |     |     |     |
| --------------- | --------- | --------- | ------ | ------------ | ------ | ----------- | --- | --- | --- | --- | --- | --- |
| order to reduce |           | the size  | of the | solution     | space, | we further  |     |     |     |     |     |     |
2.1 ModernScale-upServers
introducethreeheuristics.Thefirstswitchestheplacement
|               |      |        |     |       |       |               | Modern machines |     | scale to | multiple | sockets | with non- |
| ------------- | ---- | ------ | --- | ----- | ----- | ------------- | --------------- | --- | -------- | -------- | ------- | --------- |
| consideration | from | vertex | to  | edge, | i.e., | only consider |                 |     |          |          |         |           |
uniform-memory-access(NUMA)architecture.Eachsocket
| placement | decision | of  | each | pair of | directly | connected |     |     |     |     |     |     |
| --------- | -------- | --- | ---- | ------- | -------- | --------- | --- | --- | --- | --- | --- | --- |
operators.andavoidsmanyplacementdecisionsthathave hasitsown“local"memoryandisconnectedtoothersockets
and,hencetotheirmemory,viaoneormorelinks.Therefore,
littleornoimpactontheobjectivevalue.Thesecondreduces
accesslatencyandbandwidthvarydependingonwhethera
| the size of | the problem |     | in special | cases | by  | applying best- |     |     |     |     |     |     |
| ----------- | ----------- | --- | ---------- | ----- | --- | -------------- | --- | --- | --- | --- | --- | --- |
fit policy and also avoids identical sub-problems through coreisaccessing“local"or“remote"memory.SuchNUMA
effectrequiresonestocarefullyalignthecommunication
redundancyelimination.Thethirdprovidesamechanism
patternsaccordinglytogetgoodperformance.
totunethetrade-offbetweenoptimizationgranularityand
searchingspace. DifferentNUMAconfigurationsexistintoday’smarket.
Figure1illustratestheNUMAtopologiesofourserversinthe
| RLAS optimizes |     | both | replication | and | placement | at the |     |     |     |     |     |     |
| -------------- | --- | ---- | ----------- | --- | --------- | ------ | --- | --- | --- | --- | --- | --- |
experiments.Inthefollowing,weuse“ServerA”todenote
| same time. | The | key to optimize |     | replication |     | configuration |     |     |     |     |     |     |
| ---------- | --- | --------------- | --- | ----------- | --- | ------------- | --- | --- | --- | --- | --- | --- |
of a streaming application is to remove bottlenecks in its thefirst,and“ServerB”todenotethesecond.ServerAcan
becategorizedintotheglue-lessNUMAserver,whereCPUs
| streaming       | pipeline. | As       | each | operator’s | throughput | and   |               |                     |     |     |         |               |
| --------------- | --------- | -------- | ---- | ---------- | ---------- | ----- | ------------- | ------------------- | --- | --- | ------- | ------------- |
|                 |           |          |      |            |            |       | are connected | directly/indirectly |     |     | through | QPI or vendor |
| resource demand |           | may vary | in   | different  | placement  | plans |               |                     |     |     |         |               |
due to the NUMA effect, removing bottlenecks has to be customdatainterconnects.ServerBemploysaneXternal
NodeController(calledXNC[6])thatinterconnectsupper
donetogetherwithplacementoptimization.Toachievethis,
|     |     |     |     |     |     |     | and lower | CPU tray | (each | tray contains | 4   | CPU sockets). |
| --- | --- | --- | --- | --- | --- | --- | --------- | -------- | ----- | ------------- | --- | ------------- |
RLASiterativelyincreasesreplicationlevelofthebottleneck
operatorwhichisidentifiedduringplacementoptimization. The XNC maintains a directory of the contents of each
processorscacheandsignificantlyreducesremotememory
| We implemented |     | RLAS | in BriskStream |     | with | additional |     |     |     |     |     |     |
| -------------- | --- | ---- | -------------- | --- | ---- | ---------- | --- | --- | --- | --- | --- | --- |
accesslatency.Thedetailedspecificationsofourtwoservers
optimizationsonsharedmemory(detailsinSection5),anew
areshowninourexperimentalsetup(Section6).
DSPSsupportingthesameAPIsasStormandHeron.Our
extensiveexperimentalstudyontwoeight-socketmodern
2.2 DSPSOverview
| multicores | servers | show | that BriskStream |     | achieves | much |     |     |     |     |     |     |
| ---------- | ------- | ---- | ---------------- | --- | -------- | ---- | --- | --- | --- | --- | --- | --- |
higherthroughputandbetterscalabilitythanexistingDSPSs. A streaming application is expressed as a DAG (directed
acyclicgraph)wherevertexescorrespondtocontinuously
Organization.Theremainderofthispaperisorganized
as follows. Section 2 covers the necessary background runningoperators,andedgesrepresentdatastreamsflowing
of scale-up servers and an overview of DSPSs. Section 3 betweenoperators.Figure2(a)illustrateswordcount(WC)
discussestheperformancemodelandproblemdefinitionof as an example application containing five operators as

overhead and/or oversubscribe a few CPU sockets that
Spout Parser Splitter Counter Sink inducessignificantresourcecontention.Inthissection,we
“a boy and “a”, “boy” (“boy”,1), (“a”,2) discuss the performance model that guides optimization
a girl” … … processandtheformaldefinitionofourproblem.
(a)LogicalviewofWC.
3.1 ThePerformanceModel
Socket 0
Spout Parser Splitter Counter Modelguideddeploymentofqueryplanshasbeenpreviously
studiedinrelationaldatabasesonmulti-corearchitectures,
Parser Splitter Counter Sink for example [27]. Due to the difference in problem
assumptionsandoptimizationgoals,weadoptadifferent
Splitter Counter approach–therate-basedoptimization(RBO)approach[51],
Socket 1 Socket 2
whereoutputrateofeachoperatorisestimated.However,
(b) One example execution plan of WC. Three CPU
theoriginalRBO[51]assumesprocessingcapabilityofan
socketsareused.
operatorispredefinedandindependentofexecutionplans,
Figure2:WordCount(WC)asanexampleapplication. whichisnotsuitableundertheNUMAeffect.
Wesummarizethemainterminologiesofourperformance
model in Table 1. We group them into the following
follows.Spout continuouslygeneratesnewtuplecontaining
four types, including machine specifications, operator
asentencewithtenrandomwords.Parser dropsinvalidate
specifications,planinputs andmodeloutputs.Forthesake
tuples(e.g.,containingemptyvalue).Inourtestingworkload,
of simplicity, we refer a replica of an operator simply as
theselectivityoftheparserisone.Splitter processeseach
an“operator”.Machinespecificationsaretheinformation
tuplebysplittingthesentenceintowordsandemitseach
of the underlying hardware. Operator specifications are
word as a new tuple to Counter. Counter maintains and
the information specific to an operator, which need to
updatesahashmapwiththekeyasthewordandthevalue
be directly profiled
(e.g.,Te
) or indirectly estimated with
asthenumberofoccurrencesofthecorrespondingword. profiledinformationandmodelinputs(e.g.,Tf
).Planinputs
EverytimeitreceivesawordfromSplitter,itupdatesthe
arethespecificationoftheexecutionplanincludingboth
hashmap and emits a tuple containing the word and its
placementandreplicationplansaswellasexternalinputrate
current occurrence.Sink increments a counter each time
tothesourceoperator.Modeloutputsarethefinalresults
itreceivestuplefromCounter,whichweusetomonitorthe
of the performance model. To simplify the presentation,
performanceoftheapplication.
we omit the selectivity estimation and assume selectivity
There are two important aspects of runtime designs of
isoneinthefollowingdiscussion.Inourexperiment,the
modernDSPSs[54].First,thecommonwisdomofdesigning
selectivitystatisticsofeachoperatorarepre-profiledbefore
the execution runtime of DSPSs is to treat each operator
theoptimizationapplies.Inpractice,theycanbeperiodically
as a single execution unit (e.g., a Java thread) and runs
collectedduringruntimeandtheoptimizationneedstobe
multipleoperatorsinaDAGinapipeliningway.Second,for
re-performedaccordingly.
scalability,eachoperatormaybeexecutedindependently
Modeloverview.Inthefollowing,werefertotheoutput
inmultiplethreads.SuchdesignisadoptedbymanyDSPSs
rateofanoperatorusingthesymbolr o,whiler i referstoits
suchasStorm[5],Flink[4],Seep[25],andHeron[36]forits
inputrate.Thethroughput(R)oftheapplicationismodelled
advantageoflowprocessinglatency.Figure2(b)illustrates
asthesummationofr o ofallsin(cid:2)koperators(i.e.,operators
oneexampleexecutionplanofWC,whereparser,splitter
withnoconsumer).Thatis,R =
sink
r
o
.ToestimateR,we
andcounterarereplicatedinto2,3and3replicas,andthey
henceneedtoestimater o ofeachsinkoperator.Theoutput
are placedin threeCPUsockets (representedas coloured
rateofanoperatorisnotonlyrelatedtoitsinputratebut
rectangles).
alsotheexecutionplanduetoNUMAeffect,whichisquite
3 EXECUTIONPLANOPTIMIZATION differentfrompreviousstudies[51].
AsBriskStreamadoptedthepass-by-referencemessage
Astreamingexecutionplanconcernshowtoallocateeach
passingapproach(SeeAppendixA)toutilizeshared-memory
operator to underlying physical resources, as well as the
environment,thereferencepassingdelayisnegligible.Hence,
number of replicas that each operator should have. An
operator experiences additional remote memory access r i ofanoperatorissimplyr o ofthecorrespondingproducer
(RMA)penaltyduringinputdatafetchwhenitisallocated
andr iofspout(i.e.,sourceoperator)isgivenasI(i.e.,external
inputstreamingressrate).Conversely,uponobtainingthe
indifferentCPUsocketstoitsproducers.Abadexecution
reference,anoperatorthenneedstofetchtheactualdata
planmayintroduceunnecessarilyhighRMAcommunication

Te
Table1:Summaryofterminologies standsfortimerequiredinactualfunctionexecution
|     |     |     |     |     |     | and | emitting | output | tuples | per | input | tuple. For | operators |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------ | ------ | --- | ----- | ---------- | --------- |
(cid:7)(cid:23)(cid:18)(cid:11) (cid:4)(cid:17)(cid:21)(cid:8)(cid:21)(cid:14)(cid:17)(cid:16) (cid:2)(cid:11)(cid:12)(cid:14)(cid:16)(cid:14)(cid:21)(cid:14)(cid:17)(cid:16)(cid:20) that have a constant workload for each input tuple, we
(cid:3) (cid:7)(cid:13)(cid:34)(cid:21)(cid:24)(cid:31)(cid:24)(cid:1)(cid:13)(cid:30)(cid:30)(cid:13)(cid:21)(cid:25)(cid:13)(cid:14)(cid:23)(cid:17)(cid:1)(cid:31)(cid:25)(cid:21)(cid:30)(cid:1)(cid:3)(cid:9)(cid:11)(cid:1)(cid:15)(cid:35)(cid:15)(cid:23)(cid:17)(cid:29)(cid:1)(cid:27)(cid:17)(cid:28)(cid:1)(cid:29)(cid:26)(cid:15)(cid:22)(cid:17)(cid:30) simplymeasureitsaverageexecutiontimepertuplewith
|     |     |     |     |     |     | one | execution |     | plan to | obtain | its Te . | Otherwise, | we can |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ------- | ------ | -------- | ---------- | ------ |
(cid:2) (cid:7)(cid:13)(cid:34)(cid:21)(cid:24)(cid:31)(cid:24)(cid:1)(cid:13)(cid:30)(cid:30)(cid:13)(cid:21)(cid:25)(cid:13)(cid:14)(cid:23)(cid:17)(cid:1)(cid:23)(cid:26)(cid:15)(cid:13)(cid:23)(cid:1)(cid:4)(cid:10)(cid:2)(cid:7)(cid:1)(cid:14)(cid:13)(cid:25)(cid:16)(cid:33)(cid:21)(cid:16)(cid:30)(cid:20)
usemachinelearningtechniques(e.g.,linearregression)to
(cid:7)(cid:9)(cid:1)(cid:10) (cid:7) (cid:13) (cid:34) (cid:21) (cid:24) (cid:31) (cid:24) (cid:1) (cid:13) (cid:30) (cid:30) (cid:13) (cid:21)(cid:25) (cid:13) (cid:14) (cid:23)(cid:17)(cid:1)(cid:28)(cid:17)(cid:24)(cid:26)(cid:30)(cid:17)(cid:1)(cid:15)(cid:20)(cid:13)(cid:25)(cid:25)(cid:17)(cid:23)(cid:1)(cid:14)(cid:13)(cid:25)(cid:16)(cid:33)(cid:21)(cid:16)(cid:30)(cid:20)(cid:1)(cid:18)(cid:28)(cid:26)(cid:24)(cid:1) itsTe
(cid:3)(cid:8)(cid:9)(cid:13)(cid:14)(cid:16)(cid:11)(cid:1) (cid:29)(cid:26) (cid:15) (cid:22) (cid:17) (cid:30)(cid:1) (cid:16) (cid:30)(cid:26) (cid:1) (cid:29) (cid:26) (cid:15) (cid:22) (cid:17) (cid:30)(cid:1) (cid:17) train a prediction model to predict under varying
(cid:20)(cid:18)(cid:11)(cid:9)(cid:14)(cid:12)(cid:14)(cid:9)(cid:24) execution plans. Prediction of an operator with more
(cid:5)(cid:9)(cid:1)(cid:10) (cid:12)(cid:26)(cid:28)(cid:29)(cid:30)(cid:1)(cid:15)(cid:13)(cid:29)(cid:17)(cid:1)(cid:24)(cid:17)(cid:24)(cid:26)(cid:28)(cid:35)(cid:1)(cid:13)(cid:15)(cid:15)(cid:17)(cid:29)(cid:29)(cid:1)(cid:23)(cid:13)(cid:30)(cid:17)(cid:25)(cid:15)(cid:35)(cid:1)(cid:18)(cid:28)(cid:26)(cid:24)(cid:1)(cid:29)(cid:26)(cid:15)(cid:22)(cid:17)(cid:30)(cid:1)(cid:16)(cid:30)(cid:26)(cid:1)(cid:29)(cid:26)(cid:15)(cid:22)(cid:17)(cid:30)(cid:1)(cid:17)
complexbehaviourhasbeenstudiedinpreviousworks[12],
S (cid:3)(cid:13)(cid:15)(cid:20)(cid:17)(cid:1)(cid:23)(cid:21)(cid:25)(cid:17)(cid:1)(cid:29)(cid:21)(cid:36)(cid:17)
andweleaveitasfutureworktoenhanceoursystem.
(cid:6)
(cid:2)(cid:32)(cid:17)(cid:28)(cid:13)(cid:19)(cid:17)(cid:1)(cid:24)(cid:17)(cid:24)(cid:26)(cid:28)(cid:35)(cid:1)(cid:14)(cid:13)(cid:25)(cid:16)(cid:33)(cid:21)(cid:16)(cid:30)(cid:20)(cid:1)(cid:15)(cid:26)(cid:25)(cid:29)(cid:31)(cid:24)(cid:27)(cid:30)(cid:21)(cid:26)(cid:25)(cid:1)(cid:27)(cid:17)(cid:28)(cid:1)(cid:30)(cid:31)(cid:27)(cid:23)(cid:17) Tf standsfortimerequiredto(locallyorremotely)fetch
(cid:21) (cid:2)(cid:32)(cid:17)(cid:28)(cid:13)(cid:19)(cid:17)(cid:1)(cid:30)(cid:21)(cid:24)(cid:17)(cid:1)(cid:29)(cid:27)(cid:17)(cid:25)(cid:30)(cid:1)(cid:26)(cid:25)(cid:1)(cid:20)(cid:13)(cid:25)(cid:16)(cid:23)(cid:21)(cid:25)(cid:19)(cid:1)(cid:17)(cid:13)(cid:15)(cid:20)(cid:1)(cid:30)(cid:31)(cid:27)(cid:23)(cid:17)
theactualdataperinputtuple.Itisdeterminedbyitsfetched
(cid:5)(cid:18)(cid:11)(cid:19)(cid:8)(cid:21)(cid:17)(cid:19)(cid:1) (cid:21)(cid:8) (cid:2)(cid:32)(cid:17)(cid:28)(cid:13)(cid:19)(cid:17)(cid:1)(cid:18)(cid:17)(cid:30)(cid:15)(cid:20)(cid:21)(cid:25)(cid:19)(cid:1)(cid:30)(cid:21)(cid:24)(cid:17)(cid:1)(cid:27)(cid:17)(cid:28)(cid:1)(cid:30)(cid:31)(cid:27)(cid:23)(cid:17) tuplesizeanditsrelativedistancetoitsproducer(determined
(cid:20)(cid:18)(cid:11)(cid:9)(cid:14)(cid:12)(cid:14)(cid:9)(cid:24) (cid:21)(cid:22) byp),whichcanberepresentedasfollows,
(cid:2)(cid:32)(cid:17)(cid:28)(cid:13)(cid:19)(cid:17)(cid:1)(cid:17)(cid:34)(cid:17)(cid:15)(cid:31)(cid:30)(cid:21)(cid:26)(cid:25)(cid:1)(cid:30)(cid:21)(cid:24)(cid:17)(cid:1)(cid:27)(cid:17)(cid:28)(cid:1)(cid:30)(cid:31)(cid:27)(cid:23)(cid:17)
(cid:19) (cid:2)(cid:32)(cid:17)(cid:28)(cid:13)(cid:19)(cid:17)(cid:1)(cid:29)(cid:21)(cid:36)(cid:17)(cid:1)(cid:27)(cid:17)(cid:28)(cid:1)(cid:30)(cid:31)(cid:27)(cid:23)(cid:17)
(cid:4)
(cid:12) (cid:6)(cid:25)(cid:27)(cid:31)(cid:30)(cid:1)(cid:17)(cid:34)(cid:17)(cid:15)(cid:31)(cid:30)(cid:21)(cid:26)(cid:25)(cid:1)(cid:27)(cid:23)(cid:13)(cid:25) 0 ifcollocatedwithproducer
| (cid:6)(cid:15)(cid:8)(cid:16)(cid:1) |     |     |     |     |     |     | Tf = |     |     |     |     |     |     |
| ------------------------------------- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- |
(cid:14)(cid:16)(cid:18)(cid:22)(cid:21)(cid:20) (cid:3)N/S(cid:4)×L
(cid:4) (cid:5)(cid:34)(cid:30)(cid:17)(cid:28)(cid:25)(cid:13)(cid:23)(cid:1)(cid:21)(cid:25)(cid:27)(cid:31)(cid:30)(cid:1)(cid:29)(cid:30)(cid:28)(cid:17)(cid:13)(cid:24)(cid:1)(cid:21)(cid:25)(cid:19)(cid:28)(cid:17)(cid:29)(cid:29)(cid:1)(cid:28)(cid:13)(cid:30)(cid:17)(cid:1)(cid:30)(cid:26)(cid:1)(cid:29)(cid:26)(cid:31)(cid:28)(cid:15)(cid:17)(cid:1)(cid:26)(cid:27)(cid:17)(cid:28)(cid:13)(cid:30)(cid:26)(cid:28) (i,j) otherwise
(cid:13)(cid:11) (cid:8)(cid:31)(cid:30)(cid:27)(cid:31)(cid:30)(cid:1)(cid:28)(cid:13)(cid:30)(cid:17)(cid:1)(cid:26)(cid:18)(cid:1)(cid:13)(cid:25)(cid:1)(cid:26)(cid:27)(cid:17)(cid:28)(cid:13)(cid:30)(cid:26)(cid:28) wherei andj aredeterminedbyp.
(2)
(cid:13)(cid:11) (cid:5)(cid:34)(cid:27)(cid:17)(cid:15)(cid:30)(cid:17)(cid:16)(cid:1)(cid:26)(cid:31)(cid:30)(cid:27)(cid:31)(cid:30)(cid:1)(cid:28)(cid:13)(cid:30)(cid:17)(cid:1)(cid:26)(cid:18)(cid:1)(cid:13)(cid:25)(cid:1)(cid:26)(cid:27)(cid:17)(cid:28)(cid:13)(cid:30)(cid:26)(cid:28)
|     |     |     |     |     |     |     | When | the operator | is  | collocated | with | its producer, | the |
| --- | --- | --- | --- | --- | --- | --- | ---- | ------------ | --- | ---------- | ---- | ------------- | --- |
(cid:13)(cid:11)(cid:25)(cid:14)(cid:26) (cid:8)(cid:31)(cid:30)(cid:27)(cid:31)(cid:30)(cid:1)(cid:28)(cid:13)(cid:30)(cid:17)(cid:1)(cid:26)(cid:18)(cid:1)(cid:13)(cid:25)(cid:1)(cid:26)(cid:27)(cid:17)(cid:28)(cid:13)(cid:30)(cid:26)(cid:28)(cid:1)(cid:29)(cid:27)(cid:17)(cid:15)(cid:21)(cid:18)(cid:21)(cid:15)(cid:13)(cid:23)(cid:23)(cid:35)(cid:1)(cid:30)(cid:26)(cid:1)(cid:27)(cid:28)(cid:26)(cid:16)(cid:31)(cid:15)(cid:17)(cid:28)(cid:1)(cid:37)(cid:37)(cid:29)(cid:39) datafetchcostisalreadycoveredbyTe andhenceTf
is0.
| (cid:3)(cid:17)(cid:10)(cid:11)(cid:15)(cid:1) | (cid:13)(cid:9) | (cid:6)(cid:25)(cid:27)(cid:31)(cid:30)(cid:1)(cid:28)(cid:13)(cid:30)(cid:17)(cid:1)(cid:26)(cid:18)(cid:1)(cid:13)(cid:25)(cid:1)(cid:26)(cid:27)(cid:17)(cid:28)(cid:13)(cid:30)(cid:26)(cid:28)(cid:38)(cid:1)(cid:18)(cid:23)(cid:26)(cid:18)(cid:1)(cid:13)(cid:1)(cid:25)(cid:26)(cid:25)(cid:40)(cid:29)(cid:26)(cid:31)(cid:28)(cid:15)(cid:17)(cid:1)(cid:26)(cid:27)(cid:17)(cid:28)(cid:13)(cid:30)(cid:26)(cid:28)(cid:1)(cid:21)(cid:29)(cid:1)(cid:18)(cid:24)(cid:26)(cid:18)(cid:1) |     |     |     |     |     |     |     |     |     |     |     |
| ---------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Otherwise,itexperiencesmemoryaccessacrossCPUsockets
| (cid:17)(cid:22)(cid:21)(cid:18)(cid:22)(cid:21)(cid:20) |     | (cid:21)(cid:30)(cid:29)(cid:1)(cid:27)(cid:28)(cid:26)(cid:16)(cid:31)(cid:15)(cid:17)(cid:28)(cid:1)(cid:13)(cid:25)(cid:16)(cid:1)(cid:18)(cid:23)(cid:26)(cid:18)(cid:1)(cid:29)(cid:26)(cid:31)(cid:28)(cid:15)(cid:17)(cid:1)(cid:26)(cid:27)(cid:17)(cid:28)(cid:13)(cid:30)(cid:26)(cid:28)(cid:1)(cid:21)(cid:29)(cid:1)(cid:17)(cid:34)(cid:30)(cid:17)(cid:28)(cid:25)(cid:13)(cid:23)(cid:1)(cid:21)(cid:25)(cid:27)(cid:31)(cid:30)(cid:1)(cid:28)(cid:13)(cid:30)(cid:17)(cid:1)(cid:15) |     |     |     |     |     |     |     |     |     |     |     |
| -------------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
pertuple.Itisgenerallydifficulttoaccuratelyestimatethe
(cid:20) (cid:2)(cid:27)(cid:27)(cid:23)(cid:21)(cid:15)(cid:13)(cid:30)(cid:21)(cid:26)(cid:25)(cid:1)(cid:30)(cid:20)(cid:28)(cid:26)(cid:31)(cid:19)(cid:20)(cid:27)(cid:31)(cid:30)
actualdatatransfercostasitisaffectedbymultiplefactors
suchasmemoryaccesspatternsandhardwareprefetcher
units.Weuseasimpleformulabasedonapriorwork[17]as
| during | its processing, | where | the actual | data fetch | delay |     |     |     |     |     |     |     |     |
| ------ | --------------- | ----- | ---------- | ---------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
illustratedinFormula2.Specifically,weestimatethecross
| depends | on NUMA | distance | between | it and its producer. |     |     |     |     |     |     |     |     |     |
| ------- | ------- | -------- | ------- | -------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
socketcommunicationcostbasedonthetotalsizeofdata
| Wehenceestimater |     | ofanoperatorasafunctionofitsinput |     |     |     |           |     |                                   |     |     |     |     |        |
| ---------------- | --- | --------------------------------- | --- | --- | --- | --------- | --- | --------------------------------- | --- | --- | --- | --- | ------ |
|                  |     | o                                 |     |     |     | transferN |     | bytesperinputtuple,cachelinesizeS |     |     |     |     | andthe |
rater andexecutionplanp.
| i   |     |     |     |     |     | worstcasememoryaccesslatency(L |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | --- | --- | --- | --- |
(i,j))thatoperatorand
Estimating r o. Consider a time interval t, denote the (i (cid:2) j).
|                                    |     |     |                        |                |     | its       | producer | allocated |        | Applications |     | in    | our testing |
| ---------------------------------- | --- | --- | ---------------------- | -------------- | --- | --------- | -------- | --------- | ------ | ------------ | --- | ----- | ----------- |
| numberoftuplestobeprocessedduringt |     |     |                        | asnumandactual |     |           |          |           |        |              |     |       |             |
|                                    |     |     |                        |                |     | benchmark |          | roughly   | follow | Formula      | 2   | as we | show in our |
| timeneededtoprocessthemast         |     |     | p.Further,denoteT(p)as |                |     |           |          |           |        |              |     |       |             |
experimentslater.
theaveragetimespentonhandlingeachtupleforagiven
|     |     |     |     |     |     |     | Finally, | let us | remove | the assumption |     | that | input rate |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------ | ------ | -------------- | --- | ---- | ---------- |
executionplanp.Letusfirstassumeinputratetotheoperator
|     |     |     |     |     |     | to  | an operator |     | is larger | than its | capacity, | and | denote the |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --------- | -------- | --------- | --- | ---------- |
issufficientlylargeandtheoperatorisalwaysbusyduring expectedoutputrateasr
o.Therearetwocasesthatwehave
| t (i.e.,t p | > t),andwediscussthecaseoft |     |     | p ≤ t attheend |     |     |     |     |     |     |     |     |     |
| ----------- | --------------------------- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
toconsider:
| ofthisparagraph.Then,thegeneralformulaofr |     |     |     |     | canbe |     |     |     |     |     |     |     |     |
| ----------------------------------------- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
o
expressedinFormula1.Specifically,numisthetotalnumber Case1: We have essentially made an assumption that the
|                                                  |     |     |     |     |      |     | operator |       | is in general | over-supplied, |             | i.e., | t p ≥ t. In |
| ------------------------------------------------ | --- | --- | --- | --- | ---- | --- | -------- | ----- | ------------- | -------------- | ----------- | ----- | ----------- |
| ofinputtuplesfromallproducersarrivedduringt,andt |     |     |     |     | p is |     |          |       |               |                |             |       |             |
|                                                  |     |     |     |     |      |     | this     | case, | input         | tuples are     | accumulated |       | and r =     |
| thetotaltimespentonprocessingthoseinputtuples.   |     |     |     |     |      |     |          |       |               |                |             |       | o           |
r
|     |     |     |     |     |     |     | o.          | As tuples | from   | all producers |       | are processed | in a        |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --------- | ------ | ------------- | ----- | ------------- | ----------- |
|     |     |     |     |     |     |     | cooperative |           | manner | with          | equal | priority,     | tuples will |
num
|     |     | r = | ,   |     |     |     | be  | processed | in a | first come | first | serve | manner. It |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ---- | ---------- | ----- | ----- | ---------- |
|     |     | o   | t   |     |     |     |     |           |      |            |       |       |            |
p(cid:3)
|     |     |     |     |     |     |     | is  | possible | to configure |     | different | priorities | among |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------------ | --- | --------- | ---------- | ----- |
wherenum= r ×t different operators here, which is out of the scope
i
|     |     |     |                   |        |     |     | of  | this paper.   | Therefore,            |     | r (s) is | determined | by the       |
| --- | --- | --- | ----------------- | ------ | --- | --- | --- | ------------- | --------------------- | --- | -------- | ---------- | ------------ |
|     |     |     | producers (cid:3) |        |     |     |     |               |                       |     | o        |            |              |
|     |     |     |                   |        |     |     |     |               | ecorrespondinginput(r |     |          |            | (s)),thatis, |
|     |     | t = | r ×t              | ×T(p). |     |     | p r | o p o rt i on | o f t h               |     |          |            | i            |
|     |     | p   | i                 |        | (1) |     |     |               | r ( s )               |     |          |            |              |
|     |     |     |                   |        |     |     | r ( | s ) = r       | × i .                 |     |          |            |              |
|     |     |     | producers         |        |     |     | o   | o             | r                     |     |          |            |              |
i
|     |     |     |     |     |     | Case2: | Incontrast,anoperatormayneedlesstimetofinish |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ------ | -------------------------------------------- | --- | --- | --- | --- | --- | --- |
T(p)
We breakdown into the following two non- processingalltuplesarrivedduringobservationtime
overlappingcomponents,Te andTf (i.e.,T(p)=Te +Tf ). t, i.e.,t < t. In this case, we can derive thatr ≥
|     |     |     |     |     |     |     |     | p   |     |     |     |     | o   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Sink Spout Parser Counter Splitter ThemajortakeawayfromFigure3isthatoperatorsshow
1
 tnecrep evitalumuC stablebehaviouringeneral,andthestatisticscanbeused
0.8
asmodelinput.Selectingalower(resp.higher)percentile
| 0.6 |     |     |     |     |     |     | profiledresultsessentiallycorrespondstoamore(resp.less) |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| 0.4 |     |     |     |     |     |     | optimisticperformanceestimation.Nevertheless,weusethe   |     |     |     |     |     |     |
| 0.2 |     |     |     |     |     |     | profiledstatisticsatthe50thpercentileastheinputofthe    |     |     |     |     |     |     |
model,whichsufficientlyguidestheoptimizationprocess.
0
|     | 0   | 500 |     | 1000 | 1500 |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | ---- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
CPU_CYCLES (Te)
3.2 ProblemFormulation
Figure3:CDFofprofiledaverageexecutioncyclesof Thegoalofouroptimizationistomaximizetheapplication
differentoperatorsofWC. processing throughput under given input stream ingress
|     |     |     |     |     |     |     | rate, where | we  | look for | the optimal | replication | level | and |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | -------- | ----------- | ----------- | ----- | --- |
(cid:2)
r i.Thiseffectivelymeanstheoperatoris p l ac e m e n t o f e ac h o p e r a to r . F or o n e C P U s oc k et , d e n o te
| producers         |     |     |            |       |                |        |                                 |          |         | C              |                   |         |         |
| ----------------- | --- | --- | ---------- | ----- | -------------- | ------ | ------------------------------- | -------- | ------- | -------------- | ----------------- | ------- | ------- |
|                   |     |     |            |       |                |        | it s a v ai l                   | ab l e C | P U c y | c l e s a s cy | c l es /s ec , th | e m a x | i m u m |
| under-supplied,   |     | and | its output | rate  | is limited     | by its |                                 |          |         |                |                   |         |         |
|                   |     |     |            |       |                |        | attainablelocalDRAMbandwidthasB |          |         |                | bytes/sec,andthe  |         |         |
| inputrates,i.e.,r |     | =r  | i,andr     | (s)=r | (s)∀producers. |        |                                 |          |         |                |                   |         |         |
|                   |     | o   |            | o     | i              |        |                                 |          |         |                |                   |         |         |
maximumattainableremotechannelbandwidthfromsocket
| Givenanexecutionplan,wecanthenidentifyoperators |               |     |           |     |       |          | S toS asQ |     |                                           |     |     |     |     |
| ----------------------------------------------- | ------------- | --- | --------- | --- | ----- | -------- | --------- | --- | ----------------------------------------- | --- | --- | --- | --- |
|                                                 |               |     |           |     |       |          | i j       | i,j | bytes/sec.Further,denoteaveragetuplesize, |     |     |     |     |
| that are                                        | over-supplied | by  | comparing | its | input | rate and |           |     |                                           |     |     |     |     |
memorybandwidthconsumptionandprocessingtimespent
outputrate.Thoseover-suppliedoperatorsareessentially pertupleofanoperatorasN bytes,Mbytes/secandT
cycles,
the“bottlenecks”ofthecorrespondingexecutionplan.Our
respectively,Theproblemcanbemathematicallyformulated
scalingalgorithmtriestoincreasethereplicationlevelof
asEquation3–5.
thoseoperatorstoremovebottlenecks.Afterthescaling,we
|               |      |         |         |           |     |             | As the | formulas | show, | we consider | three | categories | of  |
| ------------- | ---- | ------- | ------- | --------- | --- | ----------- | ------ | -------- | ----- | ----------- | ----- | ---------- | --- |
| need to again | look | for the | optimal | placement |     | plan of the |        |          |       |             |       |            |     |
resourceconstraintsthattheoptimizationalgorithmneeds
newDAG.Thisiterativeoptimizationprocessformedour
|              |            |     |       |         |           |         | to make | sure | the execution | plan | satisfies. | Constraint | in  |
| ------------ | ---------- | --- | ----- | ------- | --------- | ------- | ------- | ---- | ------------- | ---- | ---------- | ---------- | --- |
| optimization | framework, |     | which | will be | discussed | shortly |         |      |               |      |            |            |     |
Eq.3enforcesthattheaggregateddemandofCPUresource
laterinSection4.
requestedtoanyoneCPUsocketmustbesmallerthanthe
| Model | instantiation. |     | Machine | specifications |     | of the |     |     |     |     |     |     |     |
| ----- | -------------- | --- | ------- | -------------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
availableCPUresource.ConstraintinEq.4enforcesthatthe
| modelincludingC,B,Q |     | i,j,L | andS |     |     |     |     |     |     |     |     |     |     |
| ------------------- | --- | ----- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
i,j aregivenasstatistics aggregatedamountofbandwidthrequestedtoaCPUsocket
| information | of  | the targeting |     | machine | (e.g., | measured |     |     |     |     |     |     |     |
| ----------- | --- | ------------- | --- | ------- | ------ | -------- | --- | --- | --- | --- | --- | --- | --- |
mustbesmallerthanthemaximumattainablelocalDRAM
| by Intel | Memory | Latency | Checker | [7]). | Similar | to the |     |     |     |     |     |     |     |
| -------- | ------ | ------- | ------- | ----- | ------- | ------ | --- | --- | --- | --- | --- | --- | --- |
bandwidth.ConstraintinEq.5enforcesthattheaggregated
previous work [23], we need to profile the application datatransferfromonesockettoanotherperunitoftime
| to determine | operator |     | specifications. |     | To eliminate | the |     |     |     |     |     |     |     |
| ------------ | -------- | --- | --------------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
mustbesmallerthanthecorrespondingmaximumattainable
impactofinterference,wesequentiallyprofileeachoperator.
remotechannelbandwidth.Inaddition,itisalsoconstrained
Specifically,wefirstlaunchaprofilingthreadoftheoperator that one operator is allocated exactly once. This matters
toprofileononecore.Then,wefeedsampleinputtuples
becauseanoperatormayhavemultipleproducersthatare
| (stored in | local memory) |     | to it. | Information | includingTe |     |     |     |     |     |     |     |     |
| ---------- | ------------- | --- | ------ | ----------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
allocatedatdifferentplaces.Inthiscase,theoperatorcan
(executiontimepertuple),M
(averagememorybandwidth onlybecollocatedwithasubsetofitsproducers.
consumptionpertuple)andN
(sizeofinputtuple)isthen
| gatheredduringitsexecution.                           |       |     |          |     |               |     |          |     | (cid:3) |     |     |     |     |
| ----------------------------------------------------- | ----- | --- | -------- | --- | ------------- | --- | -------- | --- | ------- | --- | --- | --- | --- |
|                                                       |       |     |          |     |               |     | maximize |     |         | r   |     |     |     |
| The sample                                            | input | is  | prepared | by  | pre-executing | all |          |     |         | o   |     |     |     |
| upstreamoperators.Astheyarenotrunningduringprofiling, |       |     |          |     |               |     |          |     | sink    |     |     |     |     |
theywillnotinterferewiththeprofilingthread.Tospeedup s.t.,∀i,j ∈1,..,n,
(cid:3)
theinstantiationprocess,multipleoperatorscanbeprofiled r ∗T ≤C,
|     |     |     |     |     |     |     |     |     |     | o   |     |     | (3) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
atthesametimeaslongasthereisnointerferenceamong
|               |                |          |        |         |              |     |     | operat ors | at Si |        |     |     |     |
| ------------- | -------------- | -------- | ------ | ------- | ------------ | --- | --- | ---------- | ----- | ------ | --- | --- | --- |
| the profiling | threads        | (e.g.,   | launch | them    | on different | CPU |     | (cid:3)    |       |        |     |     |     |
|               |                |          |        |         |              |     |     |            | r     | ∗M ≤B, |     |     | (4) |
| sockets).     | The statistics | gathered |        | without | interference | are |     |            |       | o      |     |     |     |
usedinthemodelasBriskStreamavoidsinterference(see operat (cid:3) ors at Si (cid:3)
Section3.2).Taskoversubscribinghasbeenstudiedinsome r (s)∗N ≤Q ,
|     |     |     |     |     |     |     |     |     |     |     | o   | i,j | (5) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
earlierwork[31],butitisnotthefocusofthispaper. operators at Sjproducers at Si
| Weusetheoverseerlibrary[45]tomeasureTe |     |     |     |     |     | ,M,and |     |     |     |     |     |     |     |
| -------------------------------------- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
Assumingeachoperator(supposeintotal|o|operators)
| use classmexer | library | [1] | to measure | N.  | Figure | 3 shows |     |     |     |     |     |     |     |
| -------------- | ------- | --- | ---------- | --- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- |
the profiling results of Te of different operators of WC. can be replicated at mostk replicas, we have to consider

Application DAG Placement optimized DAG Branch and Bound Overview. B&B systematically
| (0) | (1) |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
Recursion  enumerates a tree with nodes representing candidate
|     |     | terminate | Optimal DAG |     |     |     |     |
| --- | --- | --------- | ----------- | --- | --- | --- | --- |
Socket 0
Scaling optimized  (4) solutions,basedonaboundingfunction.Therearetwotypes
DAG
|     | (3) |              |     | ofnodesinthetree:livenodesandsolutionnodes.Inour |     |     |     |
| --- | --- | ------------ | --- | ------------------------------------------------ | --- | --- | --- |
|     |     | (2) Socket 0 |     |                                                  |     |     |     |
context,anoderepresentsaplacementplanandthevalue
| Socket 0 |     |     | Socket 1 |     |     |     |     |
| -------- | --- | --- | -------- | --- | --- | --- | --- |
Socket 1 of a node stands for the estimated throughput under the
correspondingplacement.Alivenodecontainstheplacement
Figure4:RLASOptimizationexample. planthatviolatessomeconstraintsandtheycanbeexpanded
intoothernodesthatviolatefewerconstraints.Thevalueof
alivenodeisobtainedbyevaluatingtheboundingfunction.
| intotalk|o| | differentreplicationconfigurations.Inaddition, |     |     |            |               |                   |              |
| ----------- | ---------------------------------------------- | --- | --- | ---------- | ------------- | ----------------- | ------------ |
|             |                                                |     |     | A solution | node contains | a valid placement | plan without |
aremn
for each replication configuration, there different violatinganyconstraint.Thevalueofasolutionnodecomes
placements,wheremisthenumberofCPUsocketsandn
directlyfromtheperformancemodel.Thealgorithmmay
| standsforthetotalnumberofreplicas(n |     | ≥ |o|).Suchalarge |     |                |          |                      |              |
| ----------------------------------- | --- | ----------------- | --- | -------------- | -------- | -------------------- | ------------ |
|                                     |     |                   |     | reach multiple | solution | nodes as it explores | the solution |
solutionspacemakesbrute-forceunpractical. space.Thesolutionnodewiththebestvalueistheoutputof
thealgorithm.
4 OPTIMIZATIONALGORITHMDESIGN
(cid:5) (cid:6)Alg(cid:5)ori(cid:6)thmcomplexity:Naivelyineachiteration,thereare
WeproposeanoveloptimizationparadigmcalledRelative- n ∗ m =n∗mpossiblesolutionstobranch,i.e.,schedule
whichoperatortowhichsocketandanaveragendepthas 1 1
| LocationAwareScheduling |     | (RLAS)tooptimizereplication |     |     |     |     |     |
| ----------------------- | --- | --------------------------- | --- | --- | --- | --- | --- |
level and operator placement at the same time guided by oneoperatorisallocatedineachiteration.Inotherwords,
our performance model. The key to optimize replication itwillstillneedtoexamineonaverage(n∗m)n candidate
configuration of a stream application is to remove solutions[41].Inordertofurtherreducethecomplexityof
bottlenecks in its streaming pipeline. As each operator’s theproblem,heuristicshavetobeapplied.
throughput and resource demand may vary in different Theboundingfunction.Specifically,theboundedvalue
placement plans, removing bottlenecks has to be done ofeverylivenodeisobtainedbyfixingtheplacementofvalid
togetherwithplacementoptimization. operatorsandletremainingoperatorstobecollocatedwith
Thekeyideaofouroptimizationprocessistoiteratively allofitsproducers,whichmayviolateresourceconstraintsas
optimizeoperatorplacementunderagivenreplicationlevel discussedbefore,butgivestheupperboundoftheoutputrate
setting and then try to increase replication level of the thatthecurrentnodecanachieve.Iftheboundingfunction
bottleneckoperator,whichisdeterminedduringplacement valueofanintermediatenodeisworsethanthesolutionnode
optimization. Specifically, the operator that is overfed is obtainedsofar,wecansafelypruneitandallofitschildren
definedasbottleneck(seeCase1inSection3.1).Figure4 nodes.Thisdoesnotaffecttheoptimalityofthealgorithm
shows an optimization example of a simple application becausethevalueofalivenodemustbebetterthanallits
consistingoftwooperators.Theinitialexecutionplanwith childrennodeafterfurtherexploration.Inotherwords,the
no operator replication is labelled with (0). First, RLAS valueofalivenodeisthetheoreticalupperboundofthe
optimizesitsplacement(labelledwith(1))withplacement subtreeofnodes.Theboundedproblemthatweusedinour
algorithm,whichalsoidentifiesbottleneckoperators.The optimizeroriginatesfromthesameoptimizationproblem
operators’placementtoCPUsocketsareindicatedbythe withrelaxedconstraints.
dottedarrowsintheFigure.Subsequently,ittriestoincrease ConsiderasimpleapplicationwithoperatorsA,A’(replica
| the replication | level of | the bottleneck operator, | i.e., the |           |            |                      |              |
| --------------- | -------- | ------------------------ | --------- | --------- | ---------- | -------------------- | ------------ |
|                 |          |                          |           | of A) and | B, where A | and A’ are producers | of B. Assume |
hollowcircle,withscalingalgorithm(labelledwith(2)).It atoneiteration,AandA’arescheduledtosocket0and1,
continuestooptimizeitsplacementgiventhenewreplication respectively(i.e.,theybecomevalid).Wewanttocalculate
levelsetting(labelledwith(3)).Finally,theapplicationwith
theboundingfunctionvalueassumingBisthesinkoperator,
anoptimizedexecutionplan(labelledwith(4))issubmitted which remains to be scheduled. In order to calculate the
toexecute. bounding function value, we simply let B be collocated
| The details | of scaling | and placement | optimization |           |             |                      |             |
| ----------- | ---------- | ------------- | ------------ | --------- | ----------- | -------------------- | ----------- |
|             |            |               |              | with both | A and A’ at | the same time, which | may violate |
algorithmsarepresentedinAppendixC.Inthefollowing, someconstraints.Inthisway,itsoutputrateismaximized,
we discuss how the Branch and Bound (B&B) based whichistheboundingvalueofthelivenode.Thecalculating
technique[43]isappliedtosolveourplacementoptimization
ofourboundingfunctionhasthesamecostasevaluating
Tf
problemassumingoperatorreplicationisgivenasinput.We the performance model since we only need to mark
| focus on discussing | our | bounding function | and proposed |     |     |     |     |
| ------------------- | --- | ----------------- | ------------ | --- | --- | --- | --- |
heuristicsthatimprovethesearchingefficiency.

(Formula 2) to be 0 for those operators remaining to be (cid:5)(cid:12)(cid:10)(cid:15)(cid:14)(cid:9)(cid:12)(cid:11) (cid:1) (cid:3)(cid:13)(cid:13)(cid:17) (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:20)
(cid:1) (cid:5) (cid:21)
scheduled. (cid:6)(cid:10)(cid:10)(cid:12)(cid:7)(cid:6)(cid:14)(cid:9)(cid:12)(cid:11) (cid:4) (cid:8) (cid:7) (cid:9) (cid:13) (cid:9)(cid:12) (cid:11) (cid:13) (cid:6)(cid:10)(cid:10)(cid:12)(cid:7)(cid:6)(cid:14)(cid:9)(cid:12)(cid:11) (cid:4) (cid:8) (cid:7) (cid:9) (cid:13) (cid:9)(cid:12) (cid:11) (cid:13)
|     |     |     |     |     |     |     | (cid:1) (cid:17) (cid:5) | (cid:21) | (cid:2) | (cid:3) |     | (cid:19)(cid:1)(cid:16) (cid:2) (cid:20)(cid:19) (cid:1) (cid:17) (cid:16)(cid:2) (cid:20)(cid:19) (cid:2) (cid:16)(cid:3)(cid:20) | (cid:19)(cid:1)(cid:16) | (cid:2) (cid:20)(cid:19) (cid:1) (cid:17) (cid:16)(cid:2) (cid:20)(cid:19) (cid:2) (cid:16)(cid:3)(cid:20) |
| --- | --- | --- | --- | --- | --- | --- | ------------------------ | -------- | ------- | ------- | --- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
(cid:2) (cid:5)(cid:22)
Thebranchingheuristics.Weintroducethefollowing (cid:1)(cid:17) (cid:1) (cid:18) (cid:18) (cid:18) (cid:18) (cid:1) (cid:5)(cid:21) (cid:18) (cid:18) (cid:18)
|     |     |     |     |     |     |     | (cid:3) (cid:5)(cid:22) |     |     |     | (cid:1)(cid:17) (cid:18) | (cid:18) (cid:18) (cid:18) | (cid:1)(cid:17) (cid:18) (cid:18) | (cid:18) (cid:18) |
| --- | --- | --- | --- | --- | --- | --- | ----------------------- | --- | --- | --- | ------------------------ | -------------------------- | --------------------------------- | ----------------- |
threeheuristicsthatworktogethertosignificantlyreduce
|     |     |     |     |     |     |     |     |     | (cid:3)(cid:13)(cid:13)(cid:17) |     | (cid:2) (cid:18) | (cid:22) (cid:22) (cid:18) | (cid:2) (cid:5)(cid:21) (cid:22) | (cid:22) (cid:18) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------- | --- | ---------------- | -------------------------- | -------------------------------- | ----------------- |
thesolutionspace. (cid:3) (cid:18) (cid:18) (cid:18) (cid:22) (cid:3) (cid:18) (cid:18) (cid:18) (cid:22)
|     |     |     |     |     |     |     |     | (cid:19)(cid:1)(cid:16)(cid:2)(cid:20) | (cid:19)(cid:2)(cid:16)(cid:3)(cid:20) |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------------------------- | -------------------------------------- | --- | --- | --- | --- | --- |
1) Collocation heuristic: The first heuristic switches (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:20) (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:23)
|     |     |     |     |     |     |     |     |     |     |     | (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:21) |     | (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:22) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | ---------------------------------------------------- | --- |
the placement consideration from vertex to edge, i.e., (cid:19)(cid:2)(cid:16)(cid:3)(cid:20) (cid:19)(cid:1)(cid:17)(cid:16)(cid:2)(cid:20) (cid:19)(cid:1)(cid:16)(cid:2)(cid:20) (cid:6)(cid:10)(cid:10)(cid:12)(cid:7)(cid:6)(cid:14)(cid:9)(cid:12)(cid:11) (cid:4)(cid:8)(cid:7)(cid:9)(cid:13)(cid:9)(cid:12)(cid:11)(cid:13) (cid:6)(cid:10)(cid:10)(cid:12)(cid:7)(cid:6)(cid:14)(cid:9)(cid:12)(cid:11) (cid:4)(cid:8)(cid:7)(cid:9)(cid:13)(cid:9)(cid:12)(cid:11)(cid:13)
only consider placement decision of each pair of directly (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:21) (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:22) (cid:2)(cid:13)(cid:7)(cid:8)(cid:1)(cid:19)(cid:24) (cid:19)(cid:1)(cid:16)(cid:2)(cid:20)(cid:19)(cid:1)(cid:17)(cid:16)(cid:2)(cid:20)(cid:19)(cid:2)(cid:16)(cid:3)(cid:20) (cid:19)(cid:1)(cid:16)(cid:2)(cid:20)(cid:19)(cid:1)(cid:17)(cid:16)(cid:2)(cid:20)(cid:19)(cid:2)(cid:16)(cid:3)(cid:20)
|     |     |     |     |     |     |     |     |     |                                        |                                                | (cid:1) (cid:5)(cid:21) | (cid:18) (cid:18) (cid:18) | (cid:1) (cid:5)(cid:21) (cid:18) | (cid:18) (cid:18) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------------------------- | ---------------------------------------------- | ----------------------- | -------------------------- | -------------------------------- | ----------------- |
|     |     |     |     |     |     |     |     |     | (cid:19)(cid:2)(cid:16)(cid:3)(cid:20) | (cid:19)(cid:1)(cid:17)(cid:16)(cid:2)(cid:20) |                         |                            |                                  |                   |
connectedoperators.Thisavoidsmanyplacementdecisions (cid:1)(cid:17) (cid:18) (cid:18) (cid:18) (cid:18) (cid:1)(cid:17) (cid:5)(cid:22) (cid:18) (cid:18) (cid:18)
|     |     |     |     |     |     |     | (cid:14)(cid:15)(cid:18)(cid:12)(cid:8) | (cid:4)(cid:5)(cid:10)(cid:9)(cid:7)(cid:1)(cid:6)(cid:18)(cid:17)(cid:1) | (cid:4)(cid:5)(cid:10)(cid:9)(cid:7)(cid:1)(cid:5)(cid:12)(cid:7) |     | (cid:2) (cid:5)(cid:21) | (cid:22) (cid:22) (cid:18) | (cid:2) (cid:5)(cid:21) (cid:22) | (cid:21) (cid:18) |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- | --- | ----------------------- | -------------------------- | -------------------------------- | ----------------- |
ofasingleoperatorthathavelittleornoimpactontheoutput
|     |     |     |     |     |     |     |     | (cid:16)(cid:18)(cid:6)(cid:13)(cid:14)(cid:17) |     | (cid:13)(cid:14)(cid:17)(cid:9)(cid:11)(cid:5)(cid:10) | (cid:3) (cid:5)(cid:22) | (cid:18) (cid:18) (cid:21) | (cid:3) (cid:18) (cid:18) | (cid:18) (cid:22) |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------------------- | --- | ------------------------------------------------------ | ----------------------- | -------------------------- | ------------------------- | ----------------- |
rateofotheroperators.Specifically,thealgorithmconsiders
| a list of | collocation | decisions |     | involving | a pair | of directly |        |     |           |              |     |             |     |       |
| --------- | ----------- | --------- | --- | --------- | ------ | ----------- | ------ | --- | --------- | ------------ | --- | ----------- | --- | ----- |
|           |             |           |     |           |        |             | Figure | 5:  | Placement | optimization |     | at runtime. |     | Light |
connected producer and consumer. During the searching colored rectangle represents a live node that still
process,collocationdecisionsaregraduallyremovedfrom
|     |     |     |     |     |     |     | violates | resource |     | constraints. | Dark | colored | rectangle |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | -------- | --- | ------------ | ---- | ------- | --------- | --- |
thelistoncetheybecomenolongerrelevant.Forinstance,it
standsforasolutionnodecontainsavalidplan.
canbesafelydiscarded(i.e.,donotneedtoconsideranymore)
ifbothproducerandconsumerinthecollocationdecision
arealreadyallocated.
2)Best-fit&Redundant-eliminationheuristic:Thesecond
reducesthesizeoftheprobleminspecialcasesbyapplying togetherexceedtheresourceconstraintofasocket,andthe
| best-fit | policy | and also | avoids | identical | sub-problems |     |     |     |     |     |     |     |     |     |
| -------- | ------ | -------- | ------ | --------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
onlyoptimalschedulingplanisshownbesidethetopology.
throughredundancyelimination.Consideranoperatorto The bottom left of the Figure shows how our algorithm
bescheduled,ifallpredecessors(i.e.,upstreamoperators) explores the searching space by expanding nodes, where
ofitarealreadyscheduled,thentheoutputrateofitcanbe
|     |     |     |     |     |     |     | the label | on  | the edge | represents |     | the collocation | decision |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | -------- | ---------- | --- | --------------- | -------- | --- |
safelydeterminedwithoutaffectinganyofitspredecessors. considered in the current iteration. The detailed states of
Inthiscase,weselectonlythebestwaytoscheduleitto four nodes are illustrated on the right-hand side of the
| maximize | its output | rate. | Furthermore, |     | in case | that there |         |       |     |          |           |                |     |      |
| -------- | ---------- | ----- | ------------ | --- | ------- | ---------- | ------- | ----- | --- | -------- | --------- | -------------- | --- | ---- |
|          |            |       |              |     |         |            | figure, | where | the | state of | each node | is represented |     | by a |
are multiple sockets thatit can achieve maximum output two-dimensional matrix. The first (horizontal) dimension
rate,weonlyconsiderthesocketwiththeleastremaining describes a list of collocation decisions, while the second
resource.Iftherearemultipleequalchoices,weonlybranch
onerepresentstheoperatorthatinterestsinthisdecision.
tooneofthemtoreduceproblemsize. A value of ‘-’ means that the respective operator is not
3)Compressgraph:Thethirdprovidesamechanismtotune interestedinthiscollocationdecision.Avalueof‘1’means
atrade-offbetweenoptimizationgranularityandsearching
thatthecollocationdecisionismadeinthisnode,although
space.Underalargereplicationlevelsetting,theexecution itmayviolateresourceconstraints.Anoperatorisinterested
graphbecomesverylargeandthesearchingspaceishuge. inthecollocationdecisioninvolvingitselftominimizeits
| We compress | the | execution | graph |     | by grouping | multiple |     |     |     |     |     |     |     |     |
| ----------- | --- | --------- | ----- | --- | ----------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
remotememoryaccesspenalty.Avalueof‘0’meansthat
replicas of an operator (denoted by compress ratio) into a the collocation decision is not satisfied and the involved
singlelargeinstancethatisscheduledtogether.Essentially, producerandconsumerareseparatelylocated.
| the compress | ratio | represents |     | the | tradeoff | between the |     |     |     |     |     |     |     |     |
| ------------ | ----- | ---------- | --- | --- | -------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
Attherootnode,weconsideralistofschedulingdecisions
optimizationgranularityandsearchingspace.Bysettingthe involvingeachpairofproducerandconsumer.AtNode#1,
ratiotobeone,wehavethemostfine-grainedoptimization thecollocationdecisionofAandBisgoingtobesatisfied,
butittakesmoretimetosolve.Inourexperiment,wesetthe
andassumetheyarecollocatedtoS0.Notethat,S1isidentical
ratiotobe5,whichproducesagoodtrade-off. toS0atthispointanddoesnotneedtorepeatedlyconsider.
We use the scheduling of WC as a concrete example Theboundingvalueofthisnodeisessentiallycollocatingall
| to illustrate | the | algorithm. | For | the | sake of simplicity, | we  |     |     |     |     |     |     |     |     |
| ------------- | --- | ---------- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
operatorsintothesamesocket,anditislargerthansolution
consideronlyanintermediateiterationofschedulingofa nodehenceweneedtofurtherexplore.AtNode#2,wetryto
subsetofWC.Specifically,tworeplicasoftheparser(denoted collocateA’andB,whichhowevercannotbesatisfied(due
| asAandA(cid:8) | ),onereplicaofthesplitter(denotedasB),andone |     |     |     |     |     |     |     |     |     |     |     |     |     |
| -------------- | -------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
totheassumedresourceconstraint).Asitsboundingvalueis
replicaofcount(denotedasC)areremainingunscheduled
worsethanthesolution(ifobtained),itcanbeprunedsafely.
asshowninthetop-leftofFigure5. Node#3willeventuallyleadtoavalidyetbadplacement
| In this | example, | we  | assume | the | aggregated | resource |     |     |     |     |     |     |     |     |
| ------- | -------- | --- | ------ | --- | ---------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
plan.Oneofthesearchingprocessesthatleadstothesolution
demandsofanycombinationsofgroupingthreeoperators nodeisRoot→Node#4→Node#5→Solution.

5 BRISKSTREAMSYSTEM amortizingtheinsertionoverhead.Asaresult,bothTe and
ApplyingRLAStoexistingDSPSs(e.g.,Storm,Flink,Heron)
Tf
aresignificantlyreduced.
is insufficient to make them scale on shared-memory
5.3 Discussions
multicore architectures. As they are not designed for
multicoreenvironment[54],muchoftheoverheadcome Toexaminethemaximumsystemcapacity,weassumeinput
fromtheinherentdistributedsystemdesigns. stream ingress rate (I) is sufficiently large and keeps the
We integrate RLAS optimization framework into systembusy.Hence,themodelinstantiationandsubsequent
BriskStream 1, a new DSPS supporting the same APIs execution plan optimization are conducted at the same
as Storm and Heron. More implementation details of over-supplied configuration.Inpracticalscenarios,stream
BriskStream are given in Appendix A. According to rate as well as its characteristics can vary over time, and
Equation 1, both
Te
and
Tf
shall be reduced in order applicationneedstobere-optimizedinresponsetoworkload
to improve output rate of an operator and subsequently changes[20,26,49].Toadaptouroptimizationstodynamic
improveapplicationthroughput.Inthefollowing,wediscuss scenarios,weplantostudysimpleheuristicalgorithmssuch
two design aspects of BriskStream that are specifically asround-robinortraffic-minimizationallocation[52,54].
optimizedforshared-memoryarchitecturesthatreduceTe
6 EVALUATION
andTf
significantly. We also discuss some limitations in
Section5.3. Our experiments are conducted in following aspects.
First,ourproposedperformancemodelaccuratelypredict
5.1 ImprovingExecutionEfficiency the application throughput under different execution
plans (Section 6.2). Second, BriskStream significantly
ComparedwithdistributedDSPSs,BrickStreameliminates
outperforms existing open-sourced DSPSs on multicores
many unnecessary components to reduce the instruction
(Section 6.3). Third, our RLAS optimization approach
footprint,notablyincluding(de)serialization,cross-process
performs significantly better than competing techniques
and network-related communication mechanism, and
(Section 6.4). We also show in Section 6.5 the relative
condition checking (e.g., exception handling). Those
importanceofBriskStream’soptimizationtechniques.
unnecessary components (although not involved during
execution)bringmanyconditionalbranchinstructionsand
6.1 ExperimentalSetup
results in large instruction footprint [54]. Furthermore,
we carefully revise the critical execution path to avoid We pick four common applications from the previous
unnecessary/duplicate temporary object creations. For study [54] with different characteristics to evaluate
example,asanoutputtupleisexclusivelyaccessiblebyits BriskStream. These tasks are word-count (WC), fraud-
targetedconsumerandalloperatorssharethesamememory detection (FD), spike-detection (SD), and linear-road (LR)
address,wedonotneedtocreateanewinstanceofthetuple with different topology complexity and varying compute
whentheconsumerobtainsit. andmemorybandwidthdemand.Moreapplicationsettings
canbefoundinAppendixB.
5.2 ImprovingCommunicationEfficiency Toexaminethemaximumsystemcapacityundergiven
hardwareresources,wetunetheinputstreamingressrate
Most modern DSPSs [4, 5, 54] employ buffering strategy (I) to its maximum attainable value (I max) to keep the
toaccumulatemultipletuplesandsendtheminbatchesto
system busy and report the stable system performance 2.
improve the application throughput. BriskStream follows
To minimize interference of operators, we use OpenHFT
thesimilarideaofbufferingoutputtuples,butaccumulated
ThreadAffinityLibrary[9]withcoreisolation(i.e.,configure
tuplesarecombinedintoone“jumbotuple”(seetheexample isolcpus to avoid the isolated cores being used by Linux
in Appendix A). This approach has several benefits for
kernelgeneralscheduler)tobindoperatorstocoresbased
scalability.First,sinceweknowtuplesinthesamejumbo
onthegivenexecutionplan.
tuple are targeting at the same consumer from the same
Table2showsthedetailedspecificationofourtwoeight-
producerinthesameprocess,wecaneliminateduplicate
socketservers.WeuseServerAinSection6.2,6.3and6.5.We
tuple header (e.g., metadata, context information) hence
studyourRLASoptimizationalgorithmsindetailondifferent
reducescommunicationcosts.Inaddition,theinsertionofa
NUMAarchitectureswithbothtwoserversinSection6.4.
jumbotuple(containingmultipleoutputtuple)requiresonly
NUMAcharacteristics,suchaslocalandinter-socketidle
asingleinsertiontothecommunicationqueueandeffectively
latenciesandpeakmemorybandwidths,aremeasuredwith
1ThesourcecodeofBriskStreamwillbepubliclyavailableathttps://github. 2Back-pressuremechanismwilleventuallyslowdownspoutsothatthe
com/ShuhaoZhangTony/briskstream. systemisstablyrunningatitsbestachievablethroughput.

(T)
Table2:Characteristicsofthetwoserversweuse Table 3: Average processing time per tuple
|     |     |     |     |     |     |     | under varying | NUMA | distance. | The | unit is |
| --- | --- | --- | --- | --- | --- | --- | ------------- | ---- | --------- | --- | ------- |
nanoseconds/tuple.
|     |                                                                    |                                                                                                        | (cid:8)(cid:16)(cid:2)(cid:17)(cid:6)(cid:9)(cid:1)(cid:10)(cid:37)(cid:31)(cid:11)(cid:37)(cid:31)                                                 |                                                                                | (cid:8)(cid:13)(cid:13)(cid:34)(cid:32)(cid:11)(cid:27)(cid:19)(cid:31)(cid:36)(cid:1)(cid:5)(cid:11)(cid:59)(cid:58)(cid:50)(cid:1)                                        |                                                                                             |                     |           |              |          |           |
| --- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------- | --------- | ------------ | -------- | --------- |
|     |                                                                    | (cid:1)(cid:3)(cid:4)(cid:6)(cid:7)(cid:8)(cid:5)                                                      |                                                                                                                                                     | (cid:14)(cid:23)(cid:34)(cid:38)(cid:23)(cid:34)(cid:35)                       |                                                                                                                                                                             | (cid:7)(cid:57)(cid:1)                                                                      |                     |           |              |          |           |
|     | (cid:2)(cid:10)(cid:3)(cid:10)(cid:7)(cid:9)(cid:10)(cid:7)(cid:4) |                                                                                                        |                                                                                                                                                     | (cid:46)(cid:14)(cid:23)(cid:34)(cid:38)(cid:23)(cid:34)(cid:1)(cid:2)(cid:47) |                                                                                                                                                                             | (cid:46)(cid:14)(cid:23)(cid:34)(cid:38)(cid:23)(cid:34)(cid:1)(cid:3)(cid:47)              |                     |           |              |          |           |
|     |                                                                    |                                                                                                        |                                                                                                                                                     |                                                                                |                                                                                                                                                                             |                                                                                             | Splitter            |           |              | Counter  |           |
|     |                                                                    | (cid:13)(cid:34)(cid:32)(cid:21)(cid:23)(cid:35)(cid:35)(cid:32)(cid:34)(cid:1)                        | (cid:58)(cid:40)(cid:51)(cid:58)(cid:1)(cid:9)(cid:31)(cid:36)(cid:23)(cid:29)(cid:1)(cid:18)(cid:23)(cid:32)(cid:31)(cid:1)(cid:6)(cid:57)(cid:45) |                                                                                | (cid:58)(cid:40)(cid:58)(cid:1)(cid:9)(cid:31)(cid:36)(cid:23)(cid:29)(cid:1)(cid:18)(cid:23)(cid:32)(cid:31)(cid:1)(cid:6)(cid:57)(cid:45)(cid:52)(cid:58)(cid:56)(cid:50) |                                                                                             |                     |           |              |          |           |
|     |                                                                    |                                                                                                        |                                                                                                                                                     |                                                                                |                                                                                                                                                                             |                                                                                             | From-to Measured    | Estimated | From-to      | Measured | Estimated |
|     |                                                                    | (cid:46)(cid:8)(cid:15)(cid:1)(cid:22)(cid:27)(cid:35)(cid:19)(cid:20)(cid:29)(cid:23)(cid:22)(cid:47) | (cid:58)(cid:58)(cid:59)(cid:50)(cid:1)(cid:19)(cid:36)(cid:1)(cid:51)(cid:43)(cid:52)(cid:1)(cid:7)(cid:8)(cid:42)(cid:1)                          |                                                                                |                                                                                                                                                                             | (cid:19)(cid:36)(cid:1)(cid:52)(cid:43)(cid:52)(cid:57)(cid:1)(cid:7)(cid:8)(cid:42)(cid:1) |                     |           |              |          |           |
|     |                                                                    |                                                                                                        |                                                                                                                                                     |                                                                                |                                                                                                                                                                             |                                                                                             | S0-S0(local) 1612.8 | 1612.8    | S0-S0(local) | 612.3    | 612.3     |
(cid:13)(cid:32)(cid:39)(cid:23)(cid:34)(cid:1)(cid:25)(cid:32)(cid:38)(cid:23)(cid:34)(cid:31)(cid:32)(cid:34)(cid:35) (cid:33)(cid:32)(cid:39)(cid:23)(cid:34)(cid:35)(cid:19)(cid:38)(cid:23) (cid:33)(cid:23)(cid:34)(cid:24)(cid:32)(cid:34)(cid:30)(cid:19)(cid:31)(cid:21)(cid:23) S0-S1 1666.5 1991.1 S0-S1 611.4 665.2
(cid:12)(cid:23)(cid:30)(cid:32)(cid:34)(cid:41)(cid:1)(cid:33)(cid:23)(cid:34)(cid:1)(cid:35)(cid:32)(cid:21)(cid:28)(cid:23)(cid:36) (cid:51)(cid:15)(cid:3) (cid:52)(cid:55)(cid:56)(cid:1)(cid:7)(cid:3) S0-S3 1708.2 1994.9 S0-S3 623.1 665.9
(cid:11)(cid:32)(cid:21)(cid:19)(cid:29)(cid:1)(cid:11)(cid:19)(cid:36)(cid:23)(cid:31)(cid:21)(cid:41)(cid:1)(cid:46)(cid:11)(cid:11)(cid:4)(cid:47) (cid:55)(cid:50)(cid:1)(cid:31)(cid:35) (cid:55)(cid:50)(cid:1)(cid:31)(cid:35) S0-S4 2050.6 2923.7 S0-S4 889.9 837.9
(cid:51)(cid:1)(cid:26)(cid:32)(cid:33)(cid:1)(cid:29)(cid:19)(cid:36)(cid:23)(cid:31)(cid:21)(cid:41) (cid:53)(cid:50)(cid:57)(cid:43)(cid:57)(cid:1)(cid:31)(cid:35) (cid:51)(cid:58)(cid:55)(cid:43)(cid:52)(cid:1)(cid:31)(cid:35) S0-S7 2371.3 3196.4 S0-S7 870.2 888.4
|     | (cid:12)(cid:19)(cid:40)(cid:1)(cid:26)(cid:32)(cid:33)(cid:35)(cid:1)(cid:29)(cid:19)(cid:36)(cid:23)(cid:31)(cid:21)(cid:41) |                                                                        |     | (cid:55)(cid:54)(cid:58)(cid:43)(cid:50)(cid:1)(cid:31)(cid:35)       |     | (cid:53)(cid:54)(cid:59)(cid:43)(cid:56)(cid:1)(cid:31)(cid:35)       |                  |             |      |                       |     |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- | --- | --------------------------------------------------------------------- | --- | --------------------------------------------------------------------- | ---------------- | ----------- | ---- | --------------------- | --- |
|     |                                                                                                                                | (cid:11)(cid:32)(cid:21)(cid:19)(cid:29)(cid:1)(cid:3)(cid:44)(cid:17) |     | (cid:55)(cid:54)(cid:43)(cid:53)(cid:1)(cid:7)(cid:3)(cid:44)(cid:35) |     | (cid:52)(cid:54)(cid:43)(cid:52)(cid:1)(cid:7)(cid:3)(cid:44)(cid:35) |                  |             |      |                       |     |
|     |                                                                                                                                | (cid:51)(cid:1)(cid:26)(cid:32)(cid:33)(cid:1)(cid:3)(cid:44)(cid:17)  |     | (cid:51)(cid:53)(cid:43)(cid:52)(cid:1)(cid:7)(cid:3)(cid:44)(cid:35) |     | (cid:51)(cid:50)(cid:43)(cid:56)(cid:7)(cid:3)(cid:44)(cid:35)        |                  |             |      |                       |     |
|     |                                                                                                                                |                                                                        |     |                                                                       |     |                                                                       | round-trip delay | by Execute. | Note | that, the measurement |     |
|     | (cid:12)(cid:19)(cid:40)(cid:1)(cid:26)(cid:32)(cid:33)(cid:35)(cid:1)(cid:3)(cid:44)(cid:17)                                  |                                                                        |     | (cid:55)(cid:43)(cid:58)(cid:1)(cid:7)(cid:3)(cid:44)(cid:35)         |     | (cid:51)(cid:50)(cid:43)(cid:58)(cid:1)(cid:7)(cid:3)(cid:44)(cid:35) |                  |             |      |                       |     |
onlyconsistsofcontiguoussuccessfulexecutionandexclude
|     |     |     |     | (cid:54)(cid:53)(cid:54)(cid:43)(cid:54)(cid:1)(cid:7)(cid:3)(cid:44)(cid:35) |     | (cid:51)(cid:59)(cid:53)(cid:43)(cid:56)(cid:1)(cid:7)(cid:3)(cid:44)(cid:35) |     |     |     |     |     |
| --- | --- | --- | --- | ----------------------------------------------------------------------------- | --- | ----------------------------------------------------------------------------- | --- | --- | --- | --- | --- |
(cid:15)(cid:32)(cid:36)(cid:19)(cid:29)(cid:1)(cid:29)(cid:32)(cid:21)(cid:19)(cid:29)(cid:1)(cid:3)(cid:44)(cid:17) thetimespendinqueueblocking(e.g.,thequeueisemptyor
full).TomeasureRMAcost,weallocatetheoperatorremotely
toitsproducerandmeasuresthenewround-tripdelayunder
| Intel | Memory    | Latency | Checker     |     | [7]. These | two machines      |                                      |         |      |                 |        |
| ----- | --------- | ------- | ----------- | --- | ---------- | ----------------- | ------------------------------------ | ------- | ---- | --------------- | ------ |
|       |           |         |             |     |            |                   | such configuration.                  | The RMA | cost | is then derived | as the |
| have  | different | NUMA    | topologies, |     | which      | lead to different |                                      |         |      |                 |        |
|       |           |         |             |     |            |                   | subtractionfromthenewround-tripdelay |         |      | bytheoriginal   |        |
accesslatenciesandthroughputsacrossCPUsockets.The
round-tripdelay.
| three | major | takeaways | from | Table | 2 are | as follows. First, |     |     |     |     |     |
| ----- | ----- | --------- | ---- | ----- | ----- | ------------------ | --- | --- | --- | --- | --- |
duetoNUMA,bothServershavesignificantlyhighremote
6.2 PerformanceModelEvaluation
memoryaccesslatency,whichisupto10timeshigherthan
localcacheaccess.Second,differentinterconnectandNUMA Inthissection,weevaluatetheaccuracyofourperformance
topologiesleadtoquitedifferentbandwidthcharacteristics model.Wefirstevaluatetheestimationofthecostofremote
memoryaccess.WetakeSplitandCountoperatorsofWCas
onthesetwoservers.Inparticular,remotememoryaccess
bandwidth is similar regardless of the NUMA distance in anexample.Table3comparesthemeasuredandestimated
processtimepertuple(T)ofeachoperator.Ourestimation
ServerB.Incontrast,thebandwidthissignificantlylower
generallycapturesthecorrelationsbetweenremotememory
acrosslongNUMAdistancethansmallerdistanceonServer
accesspenaltyandNUMAdistance.Theestimationislarger
A.Third,thereisasignificantincreaseinremotememory
accesslatencyfromwithinthesameCPUtray(e.g.,1hop thanmeasurement,especiallyforSplitter.Whentheinput
latency)tobetweendifferentCPUtrays(maxhopslatency) tuplesizeislarge(incaseofSplitter),thememoryaccesses
|     |     |     |     |     |     |     | have better locality | and the | hardware | prefetcher | helps in |
| --- | --- | --- | --- | --- | --- | --- | -------------------- | ------- | -------- | ---------- | -------- |
onbothservers.
Inadditiontoruntimestatisticsevaluation,wealsoreport reducingcommunicationcost[38].Anotherobservationis
howmuchtimeeachtuplespendsindifferentcomponents thatthereisasignificantincreaseofRMAcostfrombetween
socketsfromthesameCPUtray(e.g.,S0toS1)tobetween
ofthesystem.Weclassifythesecomponentsasfollows:1)
Execute refers to the average time spent in core function socketsfromdifferentCPUtray(e.g.,S0toS4).Suchnon-
execution. Besides the actual user function execution, it linear increasing of RMA cost has a major impact on the
|      |          |         |           |        |      |                | system scalability | as we need | to  | pay significantly | more |
| ---- | -------- | ------- | --------- | ------ | ---- | -------------- | ------------------ | ---------- | --- | ----------------- | ---- |
| also | includes | various | processor | stalls | such | as instruction |                    |            |     |                   |      |
cache miss stalls. 2) RMA refers to the time spend due to communicationoverheadacrossdifferentCPUtrays.
remote memory access. This is only involved when the Tovalidatetheoveralleffectivenessofourperformance
model,weshowtherelativeerrorassociatedwithestimating
operatorisscheduledtodifferentsocketstoitsproducers,
and it varies depending on the relative location between the application throughput by our analytical model. The
|Rmeas−Rest|
operators. 3) Others consist of all other time spent in relative error is defined as relative_error = ,
Rmeas
R
the critical execution path and considered as overhead. where meas is the measured application throughput
Examples include temporary object creation, exception and R est is the estimated application throughput by our
condition checking, communication queue accessing and performancemodelforthesameapplication.
contextswitchingoverhead. Themodelaccuracyevaluationofallapplicationsunder
TomeasureExecuteandOthers,weallocatetheoperator theoptimalexecutionplanoneightCPUsocketsisshown
tobecollocatedwithitsproducer.Thetimespendinuser in Table 4. Overall, our estimation approximates the
functionpertupleisthenmeasuredasExecute.Wemeasure measurementwellforthethroughputofallfourapplications.
thegapbetweenthesubsequentcallofthefunctionasround- Itisabletoproducetheoptimalexecutionplanandpredict
trip delay. Others is then derived as the subtraction from therelativeperformancequiteaccurately.

| 25  |      |                   |     | 1   |     |     |     |     |     | )sn( elput rep emit gnissecorP 12000 |     |     |     | RMA    |
| --- | ---- | ----------------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------ | --- | --- | --- | ------ |
|     |      | BriskStream/Storm |     |     |     |     |     |     |     |                                      |     |     |     | Others |
|     | 20.2 |                   |     |     |     |     |     |     |     | 10000                                |     |     |     |        |
20 18.7 BriskStream/Flink tnecrep evitalumuC 0.8 Table 5: 99-percentile Execute
8000
| pUdeepS 15 |     |      |      | 0.6 |     | Brisk | end-to-endlatency(ms) |       |             |        |                |               |        |                 |
| ---------- | --- | ---- | ---- | --- | --- | ----- | --------------------- | ----- | ----------- | ------ | -------------- | ------------- | ------ | --------------- |
|            |     |      | 12.8 |     |     |       |                       |       |             |        | 6000           |               |        |                 |
|            |     | 11.2 |      |     |     | Flink |                       |       |             |        |                |               |        |                 |
| 10         |     |      |      | 0.4 |     | Storm |                       |       |             |        | 4000           |               |        |                 |
|            |     | 8.4  |      |     |     |       | Brisk                 |       |             |        |                |               |        |                 |
|            |     |      |      |     |     |       |                       | Storm | Flink       |        | 2000           |               |        |                 |
| 5          |     | 4.6  |      | 0.2 |     |       | Stream                |       |             |        |                |               |        |                 |
|            |     | 3.2  | 2.8  |     |     |       |                       |       |             |        |                |               |        |                 |
|            |     |      |      |     |     |       | W C 2 1 . 9           | 3 7 8 | 8 1 . 3 5 6 | 8 9 .2 | 0 ounter       |               | ounter | ounter          |
| 0          |     |      |      | 0   |     |       |                       |       |             |        | arser Splite r | Parser Splite | r      | Parser Splite r |
WC FD SD LR 0.1 10 1000 100000 FD 1 2 . 5 1 4 9 4 9 . 8 2 6 1 .3 P C C C
End-to-end process latency (ms)
|        |     |            |     |     |     |     | SD 13.5  | 12733.8 | 350.5  |     | Storm (local) | Brisk (local) |     | Brisk (remote) |
| ------ | --- | ---------- | --- | --- | --- | --- | -------- | ------- | ------ | --- | ------------- | ------------- | --- | -------------- |
| Figure | 6:  | Throughput |     |     |     |     | LR 204.8 | 16747.8 | 4886.2 |     |               |               |     |                |
Figure7:End-to-endlatency
|          |     |     |                       |     |     |     |     |     |     | Figure | 8:  | Execution |     | time |
| -------- | --- | --- | --------------------- | --- | --- | --- | --- | --- | --- | ------ | --- | --------- | --- | ---- |
| speedup. |     |     | ofWCondifferentDSPSs. |     |     |     |     |     |     |        |     |           |     |      |
breakdown.
| 10000 |     |     |     |     |     |     |     |     |     |     | 90000 | BriskStream |     |     |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | ----------- | --- | --- |
BriskStream 1 socket 2 sockets 4 sockets 8 sockets )s/stneve k( tuphguorhT StreamBox
80000
)s/ tneve k( tuphguorhT Storm 600% 120000 Measured 70000 StreamBox (out-of-order)
7500 Flink tuphguorhT dezilamroN )s/ stneve k( tuphguorhT Ideal
|     |     |     |     | 500% |     |     |        |     |     | W/o rma | 60000 |     |     |     |
| --- | --- | --- | --- | ---- | --- | --- | ------ | --- | --- | ------- | ----- | --- | --- | --- |
|     |     |     |     |      |     |     | 100000 |     |     |         | 50000 |     |     |     |
400%
| 5000 |     |     |     |      |     |     | 80000 |     |     |     | 40000 |     |     |     |
| ---- | --- | --- | --- | ---- | --- | --- | ----- | --- | --- | --- | ----- | --- | --- | --- |
|      |     |     |     | 300% |     |     |       |     |     |     | 30000 |     |     |     |
60000
| 2500 |     |     |     | 200% |     |     |       |     |     |     | 20000 |     |       |        |
| ---- | --- | --- | --- | ---- | --- | --- | ----- | --- | --- | --- | ----- | --- | ----- | ------ |
|      |     |     |     |      |     |     | 40000 |     |     |     | 10000 |     |       | 2.174  |
|      |     |     |     | 100% |     |     | 20000 |     |     |     | 0     |     |       |        |
|      | 0   |     |     |      |     |     |       |     |     |     | 2     | 4 8 | 16 32 | 72 144 |
|      | 0   | 5   | 10  | 0%   |     |     | 0     |     |     |     |       |     |       |        |
Number of CPU sockets WC FD SD LR WC FD SD LR on 1 socket(soc.) 2soc.4soc.8soc.
|     | (a)Systems |     |     | (b)Applications |     |     |                       |     |     |     |        |               |     |      |
| --- | ---------- | --- | --- | --------------- | --- | --- | --------------------- | --- | --- | --- | ------ | ------------- | --- | ---- |
|     |            |     |     |                 |     |     | Figure10:Gapstoideal. |     |     |     | Figure | 11: Comparing |     | with |
StreamBox.
Figure9:Scalabilityevaluation.
Table4:Modelaccuracyevaluationofallapplications. ApotentialreasonisthatFlinkrequiresadditionalstream
TheperformanceunitisKevents/sec merger operators (implemented as the co-flat map) that
mergesmultipleinputstreamsbeforefeedingtoanoperator
WC FD SD LR withmulti-inputstreams(commonlyfoundinLR).Neither
|     | Measured | 96390.8 | 7172.5 | 12767.6 | 8738.3 |     |     |     |     |     |     |     |     |     |
| --- | -------- | ------- | ------ | ------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
StormnorBriskStreamhassuchadditionaloverhead.
|     | Estimated | 104843.3 | 8193.9 | 12530.2 | 9298.7 |     |     |     |     |     |     |     |     |     |
| --- | --------- | -------- | ------ | ------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Followingthepreviouswork[24],wedefinetheend-to-
|     | Relativeerror | 0.08 | 0.14 | 0.02 | 0.06 |     |     |     |     |     |     |     |     |     |
| --- | ------------- | ---- | ---- | ---- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
endlatencyofastreamingworkloadasthedurationbetween
thetimewhenaninputevententersthesystemandthetime
whentheresultscorrespondingtothateventisgenerated.
6.3 EvaluationofExecutionEfficiency
Wecomparetheend-to-endprocesslatencyamongdifferent
| This | section | shows | that | BriskStream | significantly |     |       |           |     |        |         |              |     |        |
| ---- | ------- | ----- | ---- | ----------- | ------------- | --- | ----- | --------- | --- | ------ | ------- | ------------ | --- | ------ |
|      |         |       |      |             |               |     | DSPSs | on Server | A.  | Figure | 7 shows | the detailed |     | CDF of |
outperformsexistingDSPSsonshared-memorymulticores.
end-to-endprocessinglatencyofWCcomparingdifferent
We compare BriskStream with two open-sourced DSPSs DSPSsandTable5showstheoverall99-percentileend-to-end
includingApacheStorm(version1.1.1)andFlink(version
processinglatencycomparisonofdifferentapplications.The
| 1.3.2). | For | a better performance, |     | we disable | the | fault- |     |     |     |     |     |     |     |     |
| ------- | --- | --------------------- | --- | ---------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
end-to-endlatencyofBriskStreamissignificantlysmaller
tolerancemechanisminallcomparingsystems.WeuseFlink thanbothFlinkandStorm.
| with | NUMA-aware | configuration |     | (i.e., one | task manager |     |           |     |           |     |                 |     |     |        |
| ---- | ---------- | ------------- | --- | ---------- | ------------ | --- | --------- | --- | --------- | --- | --------------- | --- | --- | ------ |
|      |            |               |     |            |              |     | Per-tuple |     | execution |     | time breakdown. |     | To  | better |
perCPUsocket),andasasanitycheck,wehavealsotested
|     |     |     |     |     |     |     | understand | the | source | of performance |     | improvement, |     | we  |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------ | -------------- | --- | ------------ | --- | --- |
Flinkwithasingletaskmanager,whichshowsevenworse showtheper-tupleexecutiontimebreakdownbycomparing
performance.WealsocompareBriskStreamwithStreamBox,
BriskStreamandStorm.Figure8showsthebreakdownofall
| a recent | single-node | DSPS | on  | share-memory | multi-core |     |     |     |     |     |     |     |     |     |
| -------- | ----------- | ---- | --- | ------------ | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
non-sourceoperatorsofWC,whichweuseastheexample
architecturesattheendofthissection. applicationinthisstudy.Weperformanalysisintwogroups:
Throughputandlatencycomparison.Figure6shows
localstandsforallocatingalloperatorstothesamesocket,
thesignificantthroughputspeedupofBriskStreamcompared
andremotestandsforallocatingeachoperatormax-hopaway
to Storm and Flink. Overall, Storm and Flink show fromitsproducertoexaminethecostofRMA.
comparablethroughputforthreeapplicationsincludingWC,
FDandSD.FlinkperformspoorlyforLRcomparedtoStorm.

In the local group, we compare execution efficiency particular,RMAlatencyisabouttwotimeshigherbetween
betweenBriskStreamandStorm.The“others”overheadof socketsfromdifferenttraythantheothercase.
each operator is commonly reduced to about 10% of that TobetterunderstandtheeffectofRMAoverheadduring
ofStorm.Thefunctionexecutiontimeisalsosignificantly scaling,wecomparethetheoreticalboundedperformance
reducedtoonly5∼24%ofthatofStorm.Therearetwomain withoutRMA(denotedas“W/orma”)andidealperformance
reasonsforthisimprovement.First,theinstructioncache if the application is linearly scaled up to eight sockets
localityissignificantlyimprovedduetomuchsmallercode (denotedas“Ideal”)inFigure10.Theboundedperformance
footprint.Inparticular,ourfurtherprofilingresultsreveal isobtainedbyevaluatingthesameexecutionplanoneight
thatBriskStreamisnolongerfront-endstallsdominated(less CPU sockets by substituting RMA cost to be zero. There
than10%),whileStormandFlinkare(morethan40%).Second, aretwomajorinsightsfromFigure10.First,theoretically
our “jumbo tuple” design eliminates duplicate metadata removingRMAcost(i.e.,“W/orma”)achieves89∼95%ofthe
creationandeffectivelyamortizesthecommunicationqueue idealperformance,andithenceconfirmsthatthesignificant
accessoverhead. increaseofRMAcostisthemainreasonthatBriskStreamis
Intheremotegroup,wecomparetheexecutionofthesame notabletoscalelinearlyon8sockets.Second,westillneed
operatorinBriskStreamwithorwithoutremotememory toimprovetheparallelismandscalabilityoftheexecution
accessoverhead.Incomparisonwiththelocallyallocated plantoachieveoptimalperformanceevenwithoutRMA.
case, the total round trip time of an operator is up to 9.4 Comparing with single-node DSPS. Streambox [42]
timeshigherwhenitisremotelyallocatedtoitsproducer. is a recently proposed DSPS based on a morsel-driven
In particular, Parser has little in computation but has to like execution model – a different processing model to
payalotforremotememoryaccessoverhead(Te <<Tf
). BriskStream. We compare BriskStream with StreamBox
Thesignificantvaryingprocessingcapabilityofthesame usingWCasanexample.ResultsinFigure11demonstrate
operatorwhenitisunderdifferentplacementplanreaffirms that BriskStream outperforms StreamBox significantly
thenecessityofourRLASoptimization. regardless of the number of CPU cores used in the
AnothertakeawayisthatExecuteinStormismuchlarger system. Note that, StreamBox focuses on solving out-of-
thanRMA,whichmeansTe >>Tf andNUMAeffectmay orderprocessingproblem,whichrequiresmoreexpensive
have a minor impact in its plan optimization. In contrast, processingmechanismssuchaslocksandcontainerdesign.
BriskStreamsignificantlyreducesTe (discussedinSection5) Due to a different system design objective, BriskStream
andtheNUMAeffect,asaresultofimprovingefficiencyof currently does not provide ordered processing guarantee
othercomponents,becomesacriticalissuetooptimize.In andconsequentlydoesnotbearsuchoverhead.
the future, on one hand,Te may be further reduced with Forabettercomparison,wemodifyStreamBoxtodisable
moreoptimizationtechniquesdeployed.Ontheotherhand, itsorder-guaranteeingfeature,denotedasStreamBox(out-
serversmayscaletoevenmoreCPUsockets(withpotentially of-order),sothattuplesareprocessedout-of-orderinboth
largermax-hopremotememoryaccesspenalty).Weexpect systems. Despite its efficiency at smaller core counts, it
thatthosetwotrendsmaketheNUMAeffectcontinuesto scalespoorlywhenmultiplesocketsareused.Therearetwo
playanimportantroleinoptimizingstreamingcomputation mainreasons.First,StreamBoxreliesonacentralizedtask
onshared-memorymulticores. scheduling/distributionmechanismwithlockingprimitives,
Evaluation of scalability on varying CPU sockets. which brings significant overhead for more CPU cores.
Our next experiment shows that BriskStream scales Thiscouldbealimitationinheritedfromadoptingmorsel-
effectivelyasweincreasethenumbersofsockets.RLASis driven execution model in DSPSs – essentially it trades
abletooptimizetheexecutionplanunderadifferentnumber off the reduced pipeline parallelism for lower operator
ofsocketsenabled.Figure9ashowsthebetterscalabilityof communicationoverhead,whichwedeferasafuturework
BriskStreamthanexistingDSPSsonmulti-socketserversby toinvestigateinmoredetail. Second,WCneedsthesame
takingLRasanexample.Unmanagedthreadinterference wordbeingcountedbythesamecounter,whichrequiresa
and unnecessary remote memory access penalty prevent datashufflingoperationinStreamBox.Suchdatashuffling
existing DSPSs from scaling well on the modern multi- operation introduces significant remote memory access
sockets machine. We show the scalability evaluation of toStreamBox.WecomparetheirNUMAoverheadduring
differentapplicationsofBriskStreaminFigure9b.Thereisan executionusingIntelVtuneAmplifier[8].Weobservethat,
almostlinearscaleupfrom1to4socketsforallapplications. under8sockets(144cores),BriskStreamissuesinaverage
However,thescalabilitybecomespoorwhenmorethan4 0.09 cache misses served remotely per k events (misses/k
socketsareused.Thisisbecauseofasignificantincrease events),whichStreamBox’shas6misses/kevents.
of RMA penalty between upper and lower CPU tray. In

120000
100000
80000
60000
40000
20000
0
WC FD SD LR
)s/stneve
k( tuphguorhT
RLAS RLAS_fix(L) RLAS_fix(U)
Table6:Placementstrategies 1
0.8
Name Placement strategy details 0.6
the placement is left to the operating 0.4
OS system (Both our servers use Linux- 0.2
based OS)
0
operators are first topologically sorted WC FD SD LR
FF and then placed in a first-fit manner
(start placing from Spout)
operators are placed in a round-robin
Figure 12: RLAS w/ and w/o RR
manner on each CPU socket
consideringvaryingRMAcost.
tuphguorhT
dezilamroN
1
OS
FF RR 0.8
0.6
0.4
0.2
0
WC FD SD LR
(a)ServerA
tuphguorhT
dezilamroN
OS
FF RR
(b)ServerB
Figure 13: Placement strategy comparison under
thesamereplicationconfiguration.
6.4 EvaluationofRLASalgorithms casethesestrategiescannotfindanyplansatisfyingresource
In this section, we study the effectiveness of RLAS constraints,theywillgraduallyrelaxconstraintsuntilaplan
optimizationandcompareitwithcompetingtechniques.
isobtained.Wealsoconfigureexternalinputrate(I)tojust
The necessity of considering varying processing overfeedthesystemonServerA,andusingthesameI totest
capability.Togainabetterunderstandingoftheimportance onServerB.Thisallowsustoexaminethesystemcapacityof
ofrelative-locationawareness,weconsideranalternative differentservers.TheresultsareshowninFigure13.There
algorithmthatutilizesthesamesearchingprocessofRLAS aretwomajortakeaways.
butassumeseachoperatorhasafixedprocessingcapability. First, RLAS generally outperforms other placement
Such an approach essentially falls back to the original techniques on both two servers. FF can be viewed as a
RBO model [51], and is also similar to some previous minimizing traffic heuristic-based approach as it greedily
works [27, 34]. In our context, we need to
fixTf
of each
allocates neighbor operators (i.e., directly connected)
togetherduetoitstopologicallysortingstep.Severalrelated
operatortoaconstantvalue.Weconsidertwoextremecases.
First,thelowerboundcase,namelyRLAS_fix(L),assumes studies[13,52]adoptasimilarapproachofFFindealingwith
operatorplacementprobleminthedistributedenvironment.
eachoperatorpessimisticallyalwaysincludesremoteaccess
overhead. That
is,Tf
is calculated by anti-collocating an
However,itperformspoorly,becausewefindthatduring
itssearchingforoptimalplacements,itoftenfallsinto“not-
operator to all of its producers. Second, the upper bound
case,namelyRLAS_fix(U),completelyignoresRMA,and able-to-progress"situationasitcannotallocatethecurrent
Tf
issetto0regardlesstherelativelocationofanoperator
operator into any of the sockets because of the violation
of resource constraints. This is due to its greedy nature
toitsproducers.
thatleadstoalocaloptimalstate.Then,ithastorelaxthe
The comparison results are shown in Figure 12. RLAS
shows a 19% ∼ 39% improvement over RLAS_fix(L). We resourceconstraintsandrepackthewholetopology,which
observethatRLAS_fix(L)oftenresultsinsmallerreplication oftenendsupwithoversubscribingofafewCPUsockets.
ThemajordrawbackofRRisthatitdoesnottakeremote
configurationofthesameapplicationcomparedtoRLASand
memorycommunicationoverheadintoconsideration,and
henceunderutilizestheunderlyingresources.Thisisbecause
theresultingplansofteninvolveunnecessarycross-socket
itover-estimatestheresourcedemandofoperatorsthatare
collocatedwithproducers.Conversely,RLAS_fix(U)under- communication.
Second,RLASperformsgenerallybetteronServerB.We
estimatestheresourcedemandsofoperatorsthatareanti-
observe that Server B is underutilized for all applications
collocatedandmisleadstheoptimizationprocesstoinvolve
under the given testing input loads. This indicates that
severelythreadinterference.Overthefourworkloads,RLAS
showsa119%∼455%improvementoverRLAS_fix(U). although the total computing power (aggregated CPU
frequency) of Server A is higher, its maximum attainable
Comparing different placement strategies. We now
systemcapacityisactuallysmaller.Asaresult,RLASchooses
study the effect of different placements under the same
touseonlyasubsetoftheunderlyinghardwareresourceof
replicationconfiguration.Inthisexperiment,thereplication
ServerBtoachievethemaximumapplicationthroughput.
configurationisfixedtobethesameastheoptimizedplan
In contrast, other heuristic based placement strategies
generatedbyRLASandonlytheplacementisvariedunder
unnecessarily involve more RMA cost by launching
differenttechniques.Threealternativeplacementstrategies
operatorstoallCPUsockets.
areshowninTable6.BothFF[52]andRR[44]areenforced
toguarantee resourceconstraints asmuch aspossible. In

1
0.8
0.6
0.4
0.2
0
2000 20000 200000
tnecrep
evitalumuC
WC (random) FD (random) SD (random) LR (random)
Table 7: Runtime of the
WC (RLAS) FD (RLAS) SD (RLAS) LR (RLAS)
SD (random) optimizationprocess
FD (random) SD (RLAS) WC (random) WC (RLAS) runtime
LR (random) r throughput
(sec)
1 10140.2 93.4
LR (RLAS) 3 10079.5 48.3
FD (RLAS) 5 96390.8 23.0
Throughput (k events/s) Server A Server B
10 84955.9 46.5
15 77773.6 45.3
Figure14:CDFofrandomplans. Figure15:CommunicationpatternmatricesofWC
ontwoServers.
Correctnessofheuristics.Duetoaverylargesearch (S0)toothersocketsinServerA,andtheyare,incontrast,
space, it is almost impossible to examine all execution muchmoreuniformlydistributedamongdifferentsocketsin
plans of our test workloads to verify the effectiveness of ServerB.Themainreasonisthattheremotememoryaccess
ourheuristics.Instead,weutilizeMonte-Carlosimulations bandwidth is almost identical to local memory access in
bygenerating1000randomexecutionplans,andcompare ServerBthankstoitsglue-assistedcomponentasdiscussed
against our optimized execution plan. Specifically, the inSection2,andoperatorsarehencemoreuniformlyplaced
replicationlevelofeachoperatorisrandomlyincreaseduntil atdifferentsockets.
thetotalreplicationlevelhitsthescalinglimit.Alloperators Varying the compression ratio (r). RLAS allows to
(incl.replicas)arethenrandomlyplaced.ResultsofFigure14 compresstheexecutiongraph(witharatioofr)totunethe
showthatnoneoftherandomplansisbetterthanRLAS.It trade-offbetweenoptimizationgranularityandsearching
demonstratesthatrandomplanshurttheperformanceina space. We use WC as an example to show its impact as
highprobabilityduetothehugeoptimizationspace. showninTable7.Similartrendisobservedinotherthree
Wefurtherobservetwopropertiesofoptimizedplansof applications.Notethat,acompressedgraphcontainsheavy
RLAS,whicharealsofoundinrandomlygeneratedplans operators (multiple operators grouped into one), which
withrelativelygoodperformance.First,operatorsofFDand mayfailtobeallocatedandrequiresre-optimization.This
LRarecompletelyavoidedbeingremotelyallocatedacross procedure introduces more complexity to the algorithm,
differentCPU-traytotheirproducers.Thisindicatesthatthe whichleadstohigherruntimeoftheoptimizationprocess
RMAoverhead,especiallyfromthecostlycommunications as shown in Table 7. Due to space limitation, a detailed
acrossCPUtrays,shouldbeaggressivelyavoidedinthese discussionispresentedinAppendixD.
twoapplications.Second,resourcesarewellutilizedforhigh
throughput optimizations in RLAS. Most operators (incl.
replicas)endupwithbeing“justfulfilled”,i.e.,r o =r o =r i. 6.5 FactorAnalysis
Thiseffectivelyrevealstheshortcomingofexistingheuristics To understand the details in the overheads and benefits
based approach – maximizing an operator’s performance of various aspects of BriskStream, we show a factor
may be worthless or even harmful to the overall system analysis in Figure 16 that highlights the key factors for
performance as it may already overfeed its downstream performance. Simple refers to running Storm directly
operators.Furtherincreasingitsperformance(e.g.,scalingit on shared-memory multicores. -Instr.footprint refers to
upormakingitallocatedtogetherwithitsproducers)isjust BriskStream with much smaller instruction footprint and
awasteofthepreciouscomputingresource. avoiding unnecessary/duplicate objects as described in
Communication pattern. In order to understand Section 5.1. +JumboTuple further allows BriskStream to
the impact of different NUMA architectures on RLAS reduce the cross-operator communication overhead as
optimization,weshowcommunicationpatternmatricesof describedinSection5.2.Inthefirstthreecases,thesystemis
runningWCwithanoptimalexecutionplaninFigure15. optimizedunderRLAS_fix(L)schemewithoutconsidering
Thesameconclusionappliestootherapplicationsandhence varyingRMAcost.+RLASaddsourNUMAawareexecution
omitted.Eachpointinthefigureindicatesthesummationof plan optimization as described in Section 3. The major
datafetchcost(i.e.,Tf )ofalloperatorsfromthex-coordinate takeaways from Figure 16 are that jumbo tuple design is
(S i)toy-coordinate(S j).Themajorobservationisthatthe important to optimize existing DSPSs on shared-memory
communicationrequestsaremostlysendingfromonesocket multicorearchitectureandourRLASoptimizationparadigm

| 100000 |     |     |     |     |     | algorithm | to deploy | stream | processing |     | on NUMA-based |     |
| ------ | --- | --- | --- | --- | --- | --------- | --------- | ------ | ---------- | --- | ------------- | --- |
simple
90000 machines. However, the heuristic does not take relative-
| )s/stneve k( tuphguorhT |     |     |     | -Instr.footprint |     |          |           |      |          |        |     |           |
| ----------------------- | --- | --- | --- | ---------------- | --- | -------- | --------- | ---- | -------- | ------ | --- | --------- |
| 80000                   |     |     |     | +JumboTuple      |     |          |           |      |          |        |     |           |
| 70000                   |     |     |     |                  |     | location | awareness | into | account. | It may | not | always be |
+RLAS
60000 efficient for different workloads. In contrast, BriskStream
| 50000 |     |     |     |     |     | provides | a model-guided |     | approach | that | automatically |     |
| ----- | --- | --- | --- | --- | --- | -------- | -------------- | --- | -------- | ---- | ------------- | --- |
40000
determinestheoptimaloperatorparallelismandplacement
30000
|     |     |     |     |     |     | addressing | the | NUMA | effect. | SABER | [35] | focuses on |
| --- | --- | --- | --- | --- | --- | ---------- | --- | ---- | ------- | ----- | ---- | ---------- |
20000
| 10000 |     |     |     |     |     | efficientlyrealizingcomputingpowerfrombothCPUand |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- |
0
GPUs.Streambox[42]providesanefficientmechanismto
|     | WC  |     | FD SD |     | LR  |     |     |     |     |     |     |     |
| --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
handleout-of-orderarrivaleventprocessinginamulti-core
environment.Thosesolutionsarecomplementarytoours
Figure16:AfactoranalysisforBriskStream.Changes
|     |     |     |     |     |     | and can | be potentially |     | integrated | together |     | to further |
| --- | --- | --- | --- | --- | --- | ------- | -------------- | --- | ---------- | -------- | --- | ---------- |
areaddedlefttorightandarecumulative.
improveDSPSsonshared-memorymulticorearchitectures.
Executionplanoptimization:Bothoperatorplacementand
operatorreplicationarewidelyinvestigatedintheliterature
iscriticalforDSPSstoscaledifferentapplicationsonmodern
multicoresenvironmentaddressingNUMAeffect. under different assumptions and optimization goals [37].
|     |     |     |     |     |     | In particular, | many | algorithms |     | and mechanisms |     | [13, 18, |
| --- | --- | --- | --- | --- | --- | -------------- | ---- | ---------- | --- | -------------- | --- | -------- |
7 RELATEDWORK
|     |     |     |     |     |     | 19, 34, 44, | 52] | are developed |     | to allocate | (i.e., | schedule) |
| --- | --- | --- | --- | --- | --- | ----------- | --- | ------------- | --- | ----------- | ------ | --------- |
Database optimizations on scale-up architectures: Scale-up operators of a job into physical resources (e.g., compute
architectureshavebroughtmanyresearchchallengesand node)inordertoachieveacertainoptimizationgoal,suchas
opportunitiesforin-memorydatamanagement,asoutlined maximizingthroughput,minimizinglatencyorminimizing
in recent surveys [50, 53]. There have been studies on resource consumption, etc. Due to space limitation, we
optimizingtheinstructioncacheperformance[28,55],the discuss them in Appendix E. Based on similar ideas from
memoryandcacheperformance[11,15,16,29],many-core prior works, we implement algorithms including FF that
parallelisminasinglechip[22,33]andNUMA[27,39,40,46– greedily minimizes communication and RR that tries to
48].Psaroudakisetal.[47,48]developedanadaptivedata ensure resource balancing among CPU sockets. As our
placementalgorithmthatcantrackandresolveutilization experiment demonstrates, both algorithms result in poor
imbalance across sockets. However, it does not solve the performancecomparedtoourRLASapproachinmostcases
problemweaddress.Inparticular,theplacementstrategy becausetheyareoftentrappedinlocaloptima.
suchasRRbalancesresourceutilizationamongCPUsockets,
8 CONCLUSION
butshowssuboptimalperformanceinourexperiments.Leis
|     |     |     |     |     |     | We have | introduced | BriskStream, |     | a   | new data | stream |
| --- | --- | --- | --- | --- | --- | ------- | ---------- | ------------ | --- | --- | -------- | ------ |
etal.[39]proposedanovelmorsel-drivenqueryexecution
model which integrates both NUMA-awareness and fine processing system with a new streaming execution plan
|     |     |     |     |     |     | optimization | paradigm, |     | namely | Relative-Location |     | Aware |
| --- | --- | --- | --- | --- | --- | ------------ | --------- | --- | ------ | ----------------- | --- | ----- |
grainedtask-basedparallelism.Asimilarexecutionmodel
Scheduling(RLAS).BriskStreamsuccessfullyscalesstream
| is adopted | in StreamBox |     | [42], which | we compared | in  |     |     |     |     |     |     |     |
| ---------- | ------------ | --- | ----------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
our experiments. The results confirm the superiority of computationtowardshundredofcoresunderNUMAeffect.
|     |     |     |     |     |     | The experiments |     | on eight-sockets |     | machines | confirm | that |
| --- | --- | --- | --- | --- | --- | --------------- | --- | ---------------- | --- | -------- | ------- | ---- |
BriskStreaminaddressingNUMAeffect.
BriskStreamsignificantlyoutperformsexistingopen-sourced
| Data stream |     | processing | systems | (DSPSs): | DSPSs |     |     |     |     |     |     |     |
| ----------- | --- | ---------- | ------- | -------- | ----- | --- | --- | --- | --- | --- | --- | --- |
have attracted a great amount of research effort. A DSPSsuptoanorderofmagnitude.
| number of | systems | have | been developed, | for | example, |     |     |     |     |     |     |     |
| --------- | ------- | ---- | --------------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
9 ACKNOWLEDGEMENT
| TelegraphCQ | [21], | Borealis | [10], IBM | System | S [32] |     |     |     |     |     |     |     |
| ----------- | ----- | -------- | --------- | ------ | ------ | --- | --- | --- | --- | --- | --- | --- |
and the more recent ones including Storm [5], Flink [4] Theauthorswouldliketothanktheanonymousreviewers
| and Heron | [36]. | However, | most of them | targeted | at the |           |          |           |     |           |              |     |
| --------- | ----- | -------- | ------------ | -------- | ------ | --------- | -------- | --------- | --- | --------- | ------------ | --- |
|           |       |          |              |          |        | for their | valuable | comments. |     | This work | is supported | by  |
distributed environment, and little attention has been a MoE AcRF Tier 2 grant (MOE2017-T2-1-122) and an
paid to the research on DSPSs on the modern multicore NUS startup grant in Singapore. Jiong He is supported
environment. A recent patch on Flink [3] tries to make by the National Research Foundation, Prime Ministers
FlinkaNUMA-awareDSPS.However,itscurrentheuristic Office,SingaporeunderitsCampusforResearchExcellence
based round-robin allocation strategy is not sufficient to and Technological Enterprise (CREATE) programme. Chi
makeitscaleonlargemulticoresasourexperimentshows. Zhou’sworkispartiallysupportedbytheNationalNatural
Previouswork[54]gaveadetailedstudyontheinsufficiency Science Foundation of China under Grant 61802260 and
of two popular DSPSs (i.e., Storm and Flink) running on the Guangdong Natural Science Foundation under Grant
| modernmulti-coreprocessors.Itproposedaheuristic-based |     |     |     |     |     | 2018A030310440. |     |     |     |     |     |     |
| ----------------------------------------------------- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- |

REFERENCES [25] RaulCastroFernandez,MatteoMigliavacca,EvangeliaKalyvianaki,
andPeterR.Pietzuch.2013.Integratingscaleoutandfaulttolerance
| [1] 2008.Classmexer. | https://www.javamex.com/classmexer/ |     |     |     |     |     |     |     |     |
| -------------------- | ----------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
instreamprocessingusingoperatorstatemanagement.InSIGMOD.
[2] 2015.SGIUV300UV300EXDataSheet,http://www.newroute.com/
[26] B.Gedik,S.Schneider,M.Hirzel,andK.L.Wu.2014.ElasticScaling
upload/updocumentos/a06ee4637786915bc954e850a6b5580f.pdf.
forDataStreamProcessing.TPDS(2014).
[3] 2017. NUMApatchforFlink,https://issues.apache.org/jira/browse/
FLINK-3163. [27] JanaGiceva,GustavoAlonso,TimothyRoscoe,andTimHarris.2014.
[4] 2018.ApacheFlink. https://flink.apache.org/ DeploymentofQueryPlansonMulticores.InVLDB.
[5] 2018.ApacheStorm. http://storm.apache.org/ [28] Stavros Harizopoulos and Anastassia Ailamaki. 2006. Improving
[6] 2018. HPProLiantDL980G7serverwithHPPREMAArchitecture InstructionCachePerformanceinOLTP.TODS(2006).
TechnicalOverview. https://community.hpe.com/hpeb/attachments/ [29] Bingsheng He, Qiong Luo, and B. Choi. 2005. Cache-conscious
hpeb/itrc-264/106801/1/363896.pdf automataforXMLfiltering.InICDE.
[7] 2018. Intel Memory Latency Checker, https://software.intel.com/ [30] MartinHirzel,RobertSoulé,ScottSchneider,BuğraGedik,andRobert
|     |     |     |     | Grimm.2014. | ACatalogofStreamProcessingOptimizations. |     |     |     | ACM |
| --- | --- | --- | --- | ----------- | ---------------------------------------- | --- | --- | --- | --- |
articles/intelr-memory-latency-checker.
Comput.Surv.(2014).
| [8] 2018. | Intel VTune Amplifier. | https://software.intel.com/en-us/ |     |     |     |     |     |     |     |
| --------- | ---------------------- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- |
[31] C.Iancu,S.Hofmeyr,F.Blagojević,andY.Zheng.2010.InIPDPS.
intel-vtune-amplifier-xe.
[32] NavenduJain,LisaAmini,HenriqueAndrade,RichardKing,Yoonho
| [9] 2018.OpenHFT. | https://github.com/OpenHFT/Java-Thread-Affinity |     |     |                |           |                      |     |       |         |
| ----------------- | ----------------------------------------------- | --- | --- | -------------- | --------- | -------------------- | --- | ----- | ------- |
|                   |                                                 |     |     | Park, Philippe | Selo, and | Chitra Venkatramani. |     | 2006. | Design, |
[10] DanielJ.Abadi,YanifAhmad,MagdalenaBalazinska,UgurCetintemel,
Implementation,andEvaluationoftheLinearRoadBnchmarkon
| Mitch Cherniack, | Jeong H. | Hwang, Wolfgang | Lindner, Anurag S. |     |     |     |     |     |     |
| ---------------- | -------- | --------------- | ------------------ | --- | --- | --- | --- | --- | --- |
theStreamProcessingCore.InSIGMOD.
Maskey,AlexanderRasin,EstherRyvkina,NesimeTatbul,YingXing,
|     |     |     |     | [33] Saurabh | Jha, Bingsheng | He, Mian | Lu, Xuntao | Cheng, | and |
| --- | --- | --- | --- | ------------ | -------------- | -------- | ---------- | ------ | --- |
andStanZdonik.2005.TheDesignoftheBorealisStreamProcessing
|     |     |     |     | HuynhPhungHuynh.2015. |     | ImprovingMainMemoryHashJoins |     |     |     |
| --- | --- | --- | --- | --------------------- | --- | ---------------------------- | --- | --- | --- |
Engine.InCIDR.
[11] AnastassiaAilamaki,DavidJ.DeWitt,MarkD.Hill,andDavidA. onIntelXeonPhiProcessors:AnExperimentalApproach.Proc.VLDB
| Wood.2009.DBMSsonaModernProcessor:WhereDoesTimeGo?. |     |     |     | Endow.(2015). |     |     |     |     |     |
| --------------------------------------------------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- |
InVLDB. [34] Khandekar,RohitandHildrum,KirstenandParekh,SujayandRajan,
[12] M.Akdere,U.Çetintemel,M.Riondato,E.Upfal,andS.B.Zdonik. DeepakandWolf,JoelandWu,Kun-LungandAndrade,Henriqueand
2012.Learning-basedQueryPerformanceModelingandPrediction. Gedik,Buğra.2009.COLA:OptimizingStreamProcessingApplications
| InICDE. |     |     |     | viaGraphPartitioning.InMiddleware. |     |     |     |     |     |
| ------- | --- | --- | --- | ---------------------------------- | --- | --- | --- | --- | --- |
[13] LeonardoAniello,RobertoBaldoni,andLeonardoQuerzoni.2013. [35] Alexandros Koliousis, Matthias Weidlich, Raul Castro Fernandez,
|     |     |     |     | Alexander | L. Wolf, Paolo | Costa, | and Peter | R. Pietzuch. | 2016. |
| --- | --- | --- | --- | --------- | -------------- | ------ | --------- | ------------ | ----- |
AdaptiveOnlineSchedulinginStorm.InDEBS.
SABER:Window-BasedHybridStreamProcessingforHeterogeneous
[14] RajaAppuswamy,ChristosGkantsidis,DushyanthNarayanan,Orion
Architectures.InSIGMOD.
Hodson,andAntonyRowstron.2013.Scale-upvsscale-outforhadoop:
[36] SanjeevKulkarni,NikunjBhagat,MaosongFu,VikasKedigehalli,
Timetorethink?.InSoCC.
ChristopherKellogg,SaileshMittal,JigneshM.Patel,Karthikeyan
[15] C.Balkesen,J.Teubner,G.Alonso,andM.T.Özsu.2013.Main-Memory
|     |     |     |     | Ramasamy, | and Siddarth | Taneja. 2015. | Twitter | Heron: | Stream |
| --- | --- | --- | --- | --------- | ------------ | ------------- | ------- | ------ | ------ |
HashJoinsonMulti-CoreCPUs:TuningtotheUnderlyingHardware.
ProcessingatScale.InSIGMOD.
InICDE.
[37] GeetikaT.Lakshmanan,YingLi,andRobertE.Strom.2008.Placement
[16] PeterA.Boncz,StefanManegold,andMartinL.Kersten.1999.Database
|     |     |     |     | Strategies | for Internet-Scale | Data Stream | Systems. | IEEE | Internet |
| --- | --- | --- | --- | ---------- | ------------------ | ----------- | -------- | ---- | -------- |
ArchitectureOptimizedforthenew.Bottleneck:MemoryAccess.In
| VLDB. |     |     |     | Computing(2008). |     |     |     |     |     |
| ----- | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- |
[17] SurendraByna,XianHeSun,WilliamGropp,andRajeevThakur.2004. [38] JaekyuLee,HyesoonKim,andRichardVuduc.2012.WhenPrefetching
Predictingmemory-accesscostbasedondata-accesspatterns.InICCC. Works,WhenItDoesn&Rsquo;T,andWhy.ACMTrans.Archit.Code
| [18] ValeriaCardellini,VincenzoGrassi,FrancescoLoPresti,andMatteo |     |     |     | Optim.(2012). |     |     |     |     |     |
| ----------------------------------------------------------------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- |
Nardelli.2016. OptimalOperatorPlacementforDistributedStream [39] Viktor Leis, Peter Boncz, Alfons Kemper, and Thomas Neumann.
ProcessingApplications.InDEBS. 2014.Morsel-drivenParallelism:ANUMA-awareQueryEvaluation
[19] ValeriaCardellini,VincenzoGrassi,FrancescoLoPresti,andMatteo FrameworkfortheMany-coreAge.InSIGMOD.
[40] YinanLi,IppokratisPandis,RenéMüller,VijayshankarRaman,and
| Nardelli. | 2017. Optimal Operator | Replication | and Placement for |                   |     |                                    |     |     |     |
| --------- | ---------------------- | ----------- | ----------------- | ----------------- | --- | ---------------------------------- | --- | --- | --- |
|           |                        |             |                   | GuyM.Lohman.2013. |     | NUMA-awarealgorithms:thecaseofdata |     |     |     |
DistributedStreamProcessingSystems.InSIGMETRICSPerform.Eval.
shuffling.InCIDR.
Rev.
|                                              |     |                       |     | [41] DevroyeLucandZamoraCuraCarlos.1999. |              |            |        | OntheComplexity |         |
| -------------------------------------------- | --- | --------------------- | --- | ---------------------------------------- | ------------ | ---------- | ------ | --------------- | ------- |
| [20] V.Cardellini,M.Nardelli,andD.Luzi.2016. |     | ElasticStatefulStream |     |                                          |              |            |        |                 |         |
|                                              |     |                       |     | of Branch-and                            | Bound Search | for Random | Trees. | Random          | Struct. |
ProcessinginStorm.InHPCS.
Algorithms(1999).
| [21] SirishChandrasekaranandetal.2003. |     | TelegraphCQ:Continuous |     |     |     |     |     |     |     |
| -------------------------------------- | --- | ---------------------- | --- | --- | --- | --- | --- | --- | --- |
[42] HongyuMiao,HeejinPark,MyeongjaeJeon,GennadyPekhimenko,
dataflowprocessingforanuncertainworld.InCIDR.
KathrynS.McKinley,andFelixXiaozhuLin.2017.StreamBox:Modern
[22] XuntaoCheng,BingshengHe,XiaoliDu,andChiewTongLau.2017.
StreamProcessingonaMulticoreMachine.InATC.
AStudyofMain-MemoryHashJoinsonMany-coreProcessor:ACase
withIntelKnightsLandingArchitecture.InProceedingsofthe2017 [43] DavidR.Morrison,SheldonH.Jacobson,JasonJ.Sauppe,andEdwardC.
ACMonConferenceonInformationandKnowledgeManagement(CIKM Sewell. 2016. Branch-and-bound algorithms: A survey of recent
’17). advancesinsearching,branching,andpruning.DiscreteOptimization
| [23] AlvinCheung,OwenArden,SamuelMadden,andAndrewC.Myers. |     |     |     | (2016). |     |     |     |     |     |
| --------------------------------------------------------- | --- | --- | --- | ------- | --- | --- | --- | --- | --- |
2013.SpeedingupdatabaseapplicationswithPyxis.InSIGMOD. [44] BoyangPeng,MohammadHosseini,ZhihaoHong,RezaFarivar,and
[24] Tathagata Das, Yuan Zhong, Ion Stoica, and Scott Shenker. 2014. RoyCampbell.2015.R-Storm:Resource-AwareSchedulinginStorm.
| AdaptiveStreamProcessingusingDynamicBatchSizing.SOCC(2014). |     |     |     | InMiddleware. |     |     |     |     |     |
| ----------------------------------------------------------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- |
[45] AchillePeternier,DanieleBonetta,WalterBinder,andCesarePautasso.
2011.Overseer:low-levelhardwaremonitoringandmanagementfor

Java.InPPPJ. providedbythecorrespondingoperatoroftheapplication.
[46] DanicaPorobic,IppokratisPandis,MiguelBranco,PinarTözün,and Executoroperatesbytakingatuplefromtheoutputqueuesof
AnastasiaAilamaki.2012.OLTPonHardwareIslands.PVLDB(2012). itsproducersandinvokesthecorelogicontheobtainedinput
[47] IraklisPsaroudakis,TobiasScheuer,NormanMay,AbdelkaderSellami,
tuple.Afterthefunctionexecutionfinishes,itdispatcheszero
andAnastasiaAilamaki.2015.Scalingupconcurrentmain-memory
ormoretuplesbysendingthemtoitspartitioncontroller.
column-storescans:towardsadaptiveNUMA-awaredataandtask
placement.InVLDB. The partition controller decides in which output queue a
[48] IraklisPsaroudakis,TobiasScheuer,NormanMay,AbdelkaderSellami, tupleshouldbeenqueuedaccordingtoapplicationspecified
andAnastasiaAilamaki.2016.AdaptiveNUMA-awaredataplacement partitionstrategiessuchasshufflepartitioning.Furthermore,
andtaskschedulingforanalyticalworkloadsinmain-memorycolumn-
eachtaskmaintainsoutputbuffersforeachofitsconsumers,
stores.ProcoftheVLDBEndow.(2016).
wherejumbotuplesareformedaccordingly.
[49] ScottSchneider,JoelWolf,KirstenHildrum,RohitKhandekar,andKun-
LungWu.2016.DynamicLoadBalancingforOrderedData-Parallel
RegionsinDistributedStreamingSystems.(2016). B APPLICATIONSETTINGS
[50] Kian-LeeTan,QingchaoCai,BengChinOoi,Weng-FaiWong,Chang
Yao,andHaoZhang.2015. In-memoryDatabases:Challengesand In this section, we discuss more settings of the testing
OpportunitiesFromSoftwareandHardwarePerspectives.SIGMOD applicationsinourexperiment.Wehaveshownthetopology
Record(2015). ofWCinFigure2.Figure18showsthetopologyoftheother
[51] StratisD.ViglasandJeffreyF.Naughton.2002. Rate-basedQuery
threeapplications.Moredetailsaboutthespecificationabout
OptimizationforStreamingInformationSources.InSIGMOD.
themcanbefoundinthepreviouspaper[54].
[52] J.Xu,Z.Chen,J.Tang,andS.Su.2014.T-Storm:Traffic-AwareOnline
SchedulinginStorm.InICDCS. Theselectivityisaffectedbybothinputworkloadsand
[53] H.Zhang,G.Chen,B.C.Ooi,K.Tan,andM.Zhang.2015.In-Memory applicationlogic.ParserandSinkhaveaselectivityofone
BigDataManagementandProcessing:ASurvey.TKDE(2015). inallapplications.Splitterhasaoutputselectivityoftenin
[54] ShuhaoZhang,BingshengHe,DanielDahlmeier,AmelieChiZhou,
WC.Thatis,eachinputsentencecontains10words.Counter
andThomasHeinze.2017. RevisitingtheDesignofDataStream
hasanoutputselectivityofone,thusitemitsthecounting
ProcessingSystemsonMulti-CoreProcessors.InICDE.
[55] JingrenZhouandKennethA.Ross.2004.BufferingDatabseOperations resultsofeachinputwordtoSink.Operatorshaveanoutput
forEnhancedInstructionCachePerformance.InSIGMOD. selectivityofoneinbothFDandSD.Thatis,weconfigure
thatasignalispassedtoSinkinbothpredictoroperatorof
A IMPLEMENTATIONDETAILS FDandSpikedetectionoperatorofSDregardlessofwhether
detection is triggered for an input tuple. Operators may
BriskStream shares many similarities to existing DSPSs
containmultipleoutputstreamsinLR.Ifanoperatorhas
including pipelined processing and operator replication
onlyoneoutputstream,wedenoteitsstreamasthedefault
designs. To avoid reinventing the wheel, we reuse many
stream.Weshowtheselectivityofeachoutputstreamof
componentsfoundinexistingDSPSssuchasStorm,Heron
themofLRinTable8.
andFlink,notablyincludingAPIdesign,applicationtopology
compiler, pipelined execution engine with communication
C ALGORITHMDETAILS
queueandback-pressuremechanism.Incontrast,BrickStream
embracevariousdesignsthataresuitableforshared-memory In this section, we first present the detailed algorithm
multicorearchitectures.Forexample,Heronhasanoperator- implementationsincludingoperatorreplicationoptimization
per-process execution environment, where each operator (shown in Algorithm 1) and operator placement (shown
in an application is launched as a dedicated JVM process. inAlgorithm2).Afterthat,wediscussobservationsmade
Incontrast,anapplicationinBriskStreamislaunchedina in applying algorithms in optimizing our workload and
JVM process, and operators are launched as Java threads their runtime (Appendix D). We further elaborate how
inside the same JVM process, which avoids cross-process our optimization paradigm can be extended with other
communicationandallowsthepass-by-referencemessage optimizationtechniques(AppendixD).
passing mechanism. Specifically, tuples produced by an Algorithm 1 illustrates our scaling algorithm based on
operatorarestoredlocally,andpointersasreferencetotuple topologicalsorting.Initially,wesetreplicationlevelofeach
areinsertedintoacommunicationqueue.Togetherwiththe operatortobeone(Lines1∼2).Thealgorithmproceedswith
jumbotupledesign,referencepassingdelayisminimized thisanditoptimizesoperatorplacementwithAlgorithm2
andbecomesnegligible. (Line6).Then,itstoresthecurrentplanifitendsupwith
Figure17presentsanexamplejob(WC)ofBriskStream. betterperformance(Lines7∼8).AtLines11∼19,weiterate
Eachoperator(orthereplica)oftheapplicationismappedto overallthesortedlistfromreverselytopologicallysorting
onetask.ThetaskisthebasicprocessingunitinBrickStream ontheexecutiongraphinparallel(scalingfromsinktowards
(i.e.,executedbyaJavathread),whichconsistsofanexecutor spout).AtLine15,ittriestoincreasethereplicationlevel
andapartitioncontroller.Thecorelogicforeachexecutoris oftheidentifiedbottleneckoperator(i.e.,thisisidentified

(cid:2) (cid:12) (cid:10) (cid:10) (cid:17) (cid:11) (cid:8) (cid:6) (cid:4) (cid:16) (cid:8)(cid:12) (cid:11)(cid:1) M o v in g S p i k e Table8:OperatorselectivityofLR
|     |                                                                             |                                                                                                                                                            | (cid:24) | Spout Parser          | Predict Sink | Spout                 | Parser A v e | ra g e De t e c t ion | Sink         |     |               |                |             |
| --- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------- | ------------ | --------------------- | ------------ | --------------------- | ------------ | --- | ------------- | -------------- | ----------- |
|     |                                                                             | (cid:5)(cid:7) (cid:16) (cid:18) (cid:7)(cid:7) (cid:11) (cid:1) (cid:16) (cid:4) (cid:15) (cid:9) (cid:15) (cid:5)(cid:7)(cid:19)(cid:20)(cid:10)(cid:19) |          |                       |              |                       |              |                       |              |     |               |                |             |
|     | (cid:3)(cid:7)(cid:21)(cid:7)(cid:6)(cid:17)(cid:22)(cid:19)(cid:8)(cid:10) |                                                                                                                                                            |          | (a)FraudDetection(FD) |              | (b)SpikeDetection(SD) |              |                       |              |     |               |                |             |
|     |                                                                             |                                                                                                                                                            |          |                       |              |                       |              |                       | OperatorName |     | Input streams | Output streams | Selectivity |
(cid:5)(cid:7)(cid:19)(cid:20)(cid:10)(cid:19)(cid:1) (cid:24) Dispatcher default position report (cid:1)0.99
(cid:3)(cid:13)(cid:7)(cid:14)(cid:4)(cid:16)(cid:12)(cid:14)(cid:1)(cid:4)(cid:15)(cid:1)(cid:4)(cid:1)(cid:16)(cid:4)(cid:15)(cid:9)
(cid:25)(cid:19)(cid:10)(cid:18)(cid:15)(cid:14)(cid:8)(cid:7)(cid:26) balance_stream (cid:1)0.0
|                                        |     |     |     | Spout  | A v e ra g e     | Las t  A v | e ragee  |     |           |     |                 |                   |            |
| -------------------------------------- | --- | --- | --- | ------ | ---------------- | ---------- | -------- | --- | --------- | --- | --------------- | ----------------- | ---------- |
|                                        |     |     |     |        | S p e e d        | S p e      | e d      |     |           |     |                 | daliy_exp_request | (cid:1)0.0 |
|                                        |     |     |     |        | A c c i d e n t  |            |          |     | Avg_speed |     | position report | avg_stream        | 1.0        |
| (cid:4)(cid:10)(cid:21)(cid:8)(cid:13) |     |     |     | Parser | D e t e c t io n |            |          |     |           |     |                 |                   |            |
(cid:5)(cid:7)(cid:19)(cid:21)(cid:14)(cid:21)(cid:14)(cid:17)(cid:16)(cid:1)(cid:20)(cid:21)(cid:19)(cid:7)(cid:21)(cid:10)(cid:12)(cid:23) (cid:3)(cid:27)(cid:14)(cid:14)(cid:13)(cid:24)(cid:17)(cid:20)(cid:15) Count Las_avg_speed avg_stream las_stream 1.0
|     |     |     | (cid:7)(cid:27)(cid:26)(cid:22)(cid:27)(cid:26)(cid:1)(cid:23)(cid:27)(cid:13)(cid:27)(cid:13)(cid:25) |     | Vehicles |     |     |     |     |     |     |     |     |
| --- | --- | --- | ------------------------------------------------------------------------------------------------------ | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
(cid:24) A c c i d e n t A c c i d e n t _ d e t e ct p o s i t i o n   r e p o r t d e te c t _ s t r e a m 0 . 0
(cid:5) (cid:29) (cid:13) (cid:11) (cid:27) (cid:26)(cid:21) (cid:24) (cid:8) (cid:9) (cid:24) (cid:26) (cid:17) (cid:26) (cid:17)(cid:21) (cid:20) (cid:1) (cid:6) (cid:27) (cid:19) (cid:10) (cid:21) (cid:1)(cid:26) (cid:27) (cid:22) (cid:18) (cid:13) (cid:1)(cid:28) (cid:17)(cid:26) (cid:16)(cid:1) Dispatcher N ot i fi c a t io n Sink C o u n t _ v e h i c l e p o s i t i o n   r e p o r t co u n t s _ s t r e a m 1 . 0
|     | (cid:30) (cid:3) (cid:1) (cid:4) (cid:5)(cid:2) (cid:4)(cid:31) | (cid:4) (cid:21) (cid:20) (cid:26) (cid:24) (cid:21) (cid:18)(cid:18) (cid:13) (cid:24) (cid:11) (cid:21) (cid:19) (cid:19) | (cid:21) (cid:20) (cid:1) (cid:16) (cid:13) (cid:9) (cid:12)(cid:13) (cid:24) |     |              |     | Toll         |         |                 |     |                           |               |     |
| --- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | --- | ------------ | --- | ------------ | ------- | --------------- | --- | ------------------------- | ------------- | --- |
|     |                                                                 |                                                                                                                             |                                                                               |     | D a i ly     |     | Notification |         | Accident_notify |     | d e t e c t_ s tr e a m , | notify_stream | 0.0 |
|     |                                                                 |                                                                                                                             | (cid:24)                                                                      |     | Ex p e n ses |     |              |         |                 |     | p o s it io n  r e p o rt |               |     |
|     |                                                                 |                                                                                                                             |                                                                               |     |              |     | A c c        | o u n t |                 |     |                           |               |     |
(cid:2)(cid:1)(cid:26)(cid:27)(cid:22)(cid:18)(cid:13)(cid:1)(cid:28)(cid:17)(cid:26)(cid:16)(cid:1)(cid:16)(cid:13)(cid:9)(cid:12)(cid:13)(cid:24) (cid:2)(cid:10)(cid:1)(cid:11)(cid:10)(cid:21)(cid:8)(cid:13)(cid:10)(cid:9) B a la n c e Toll_notify detect_stream toll_nofity_stream 0.0
|        |     |            |     |     |                   |     |     |     |     |     | position report | toll_nofity_stream | 1.0 |
| ------ | --- | ---------- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --------------- | ------------------ | --- |
|        |     |            |     |     | (c)LinearRoad(LR) |     |     |     |     |     | counts_stream   | toll_nofity_stream | 1.0 |
| Figure | 17: | An example | job | in  |                   |     |     |     |     |     |                 |                    |     |
|        |     |            |     |     |                   |     |     |     |     |     | las_stream      | toll_nofity_stream | 1.0 |
BriskStream. Figure 18: Topologies of other three Daily_expen daliy_exp_request default 0.0
|     |     |     |     |     |     |     |     |     | Account_balance |     | balance_stream | default | 0.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | -------------- | ------- | --- |
applicationsinourbenchmark.
duringplacementoptimization).Thesizeofincreasingstep Algorithm 2 illustrates our Branch and Bound based
(cid:3)ri(cid:4).
depends on the ratio of over-supply, i.e., ro It starts a Placement algorithm. Initially, no solution node has been
newiterationtolookforabetterexecutionplanatLine17. found so far and we initialize a root node with a plan
Theiterationloopensuresthatwehavegonethroughall collocating all operators (Lines 1∼5). At Lines 7∼14, the
algorithmexploresthecurrentnode.Ifithasbetterbounding
thewayofscalingthetopologybottlenecks.Wecansetan
upperlimitonthetotalreplicationlevel(e.g.,settothetotal valuethanthecurrentsolution,weupdatethesolutionnode
numberofCPUcores)toterminatetheprocedureearlier.At (Lines10∼11)ifitisvalid(i.e.,alloperatorsareallocated),or
weneedtofurtherexploreit(Line13).Otherwise,weprune
Lines9&19,eitherthealgorithmfailstofindaplansatisfying
resourceconstraintorhitsthescalingupperlimitwillcause itatLine14(thisalsoeffectivelyprunesallofitschildren
thesearchingtoterminate. nodes).Thebranchingfunction(Lines15∼32)illustrateshow
thesearchingprocessbranchesandgenerateschildrennodes
toexplore.Foreachcollocationdecisioninthecurrentnode
Algorithm1:Topologicallysortediterativescaling
|     |     |     |     |     |     | (Line16),weapplythebestfitheuristic |     |     |     |     |     | (Lines17∼23)and |     |
| --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- | --- | --------------- | --- |
Data:ExecutionPlan:p// the current visiting plan onenewnodeiscreated.Otherwise,atLines25∼27,wehave
Data:Listofoperators:sortedLists
o p t t o c r e a te ne w n o d es fo(cid:5)r e(cid:6)a ch(cid:5) p(cid:6)o ss ib l e w ay o fp la c i ng t h e t w o
R e s u lt : E x e c u t ion Pl a n : / / th e s o l u t i o n p l a n m
p . p a r a l l e l i s m ← o p e r a to rs (i .e. , u p to ∗ 2 ). A t L i ne 2 8∼ 3 1 , w e u p d a t e
1 s e t p a r al le lism o fa ll o p e ra t o rst o b e 1; 1 1
p.дraph←createsexecutiongraphaccordingtop.parallelism; thenumberofvalidoperatorsandboundingvalueofeach
2
3 opt.R←0;
newlycreatednodesinparallel.Finally,thenewlycreated
4 returnSearching(p);
|     | FunctionSearching(p): |     |     |     |     | childrennodesarepushedbacktothestack. |     |     |     |     |     |     |     |
| --- | --------------------- | --- | --- | --- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
5
p.placement←placementoptimizationofp.дraph;
6
7 ifp.R>opt.Rthen
|     | opt←p// |        |              |      |     | D   | DISCUSSIONSONOPTIMIZATION |     |     |     |     |     |     |
| --- | ------- | ------ | ------------ | ---- | --- | --- | ------------------------- | --- | --- | --- | --- | --- | --- |
| 8   |         | update | the solution | plan |     |     |                           |     |     |     |     |     |     |
PROCESS
9 iffailedtofindvalidplacementsatisfyingresourceconstraintthen
10 returnopt; Wehavemadesomeinterestingobservationsinoptimizing
|     | sortedLists←reverseTopologicalSort(p.дraph)// |                |     | scale |     |                                                       |     |     |     |     |     |              |     |
| --- | --------------------------------------------- | -------------- | --- | ----- | --- | ----------------------------------------------------- | --- | --- | --- | --- | --- | ------------ | --- |
| 11  |                                               |                |     |       |     | ourworkload.First,placementalgorithm(Algorithm2)start |     |     |     |     |     |              |     |
|     | start                                         | from sink      |     |       |     |                                                       |     |     |     |     |     |              |     |
|     |                                               |                |     |       |     | withnoinitialsolution(i.e.,thesolution.value          |     |     |     |     |     | is0initially |     |
|     | foreachlist                                   | ∈sortedListsdo |     |       |     |                                                       |     |     |     |     |     |              |     |
12 foreachOperatoro∈listdo at Line 9) by default, and we have tried to use a simple
13
ifoisbottleneckthen
14 first-fit (FF) placement algorithm to determine an initial
| 15  |     | p.parallelism←trytoincreasethereplication |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | ----------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
levelofoby(cid:3) r i (cid:4); solutionnodetopotentiallyspeedupthesearchingprocess.
r o
ifsuceessfullyincreasedp.parallelismthen Insomecases,itacceleratesthesearchingprocessbyearlier
16
|     |     | returnSearching(p)// |     | start another |     |         |     |           |     |           |           |     |             |
| --- | --- | -------------------- | --- | ------------- | --- | ------- | --- | --------- | --- | --------- | --------- | --- | ----------- |
| 17  |     |                      |     |               |     | pruning |     | and makes | the | algorithm | converges |     | faster, but |
iteration
|     |     |           |     |     |     | in                                                 | other    | cases, the | overhead | of        | running | the FF   | algorithm |
| --- | --- | --------- | --- | --- | --- | -------------------------------------------------- | -------- | ---------- | -------- | --------- | ------- | -------- | --------- |
| 18  |     | else      |     |     |     | offsetsthegain.Second,theplacementalgorithmmayfail |          |            |          |           |         |          |           |
| 19  |     | returnopt |     |     |     |                                                    |          |            |          |           |         |          |           |
|     |     |           |     |     |     | to                                                 | find any | valid      | plan as  | it is not | able to | allocate | one or    |
moreoperatorsduetoresourceconstraints,whichcauses
20 returnopt;
|     |     |     |     |     |     | scaling | algorithm |     | to terminate. |     | It is interesting |     | to note |
| --- | --- | --- | --- | --- | --- | ------- | --------- | --- | ------------- | --- | ----------------- | --- | ------- |

Algorithm2:B&Bbasedplacementoptimization list of optimization techniques to further increase the
searchingefficiencyincluding1)memorizationinevaluating
| Data:Stackstack// |     | stors | all | live nodes |     |     |     |     |     |     |     |     |     |
| ----------------- | --- | ----- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Data:Nodesolution// stores the best plan found so far performancemodelunderagivenexecutionplan(e.g.,an
Data:Nodee// operatorshouldbehavethesameifitsrelativeplacement
|     |     | the current | visiting |     | node |     |     |     |     |     |     |     |     |
| --- | --- | ----------- | -------- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
Result:Placementplanofsolutionnode with all of its producers are the same in different plans),
// Initilization
|                |              |                |                   |                   |               |                   | 2) instead                                      | of starting    | from scaling |       | with replication |              | set |
| -------------- | ------------ | -------------- | ----------------- | ----------------- | ------------- | ----------------- | ----------------------------------------------- | -------------- | ------------ | ----- | ---------------- | ------------ | --- |
| solution.R←0// |              | No             | solution          | yet               |               |                   |                                                 |                |              |       |                  |              |     |
| 1              |              |                |                   |                   |               |                   | to one for                                      | all operators, | we can       | start | from             | a reasonable |     |
| e . d          | e c is ion s | ← a li s t c o | n t a in s al l   | p o ss i b l ec o | llo ca ti o n | d ec is i o n s ; |                                                 |                |              |       |                  |              |     |
| 2              |              |                |                   |                   |               |                   | largeDAGconfigurationtoreducethenumberofscaling |                |              |       |                  |              |     |
| 3 e . pl       | a n ← a ll   | ope ra t o r s | a r e c o llo c a | te d i n t o th   | e sa m e C    | P U s o c k e t ; |                                                 |                |              |       |                  |              |     |
4 e.R←BoundingFunction(e.plan); iterationand3)thealgorithmishighlyoptimizedforhigher
e.validOperators←0;
| 5   |     |     |     |     |     |     | concurrency(e.g.,concurrentlygeneratebranchingchildren |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- |
Push(stack,e);
| 6                      |     |     |        |           |         |     | nodes). Overall,                               | the placement |     | algorithm | needs | less | than |
| ---------------------- | --- | --- | ------ | --------- | ------- | --- | ---------------------------------------------- | ------------- | --- | --------- | ----- | ---- | ---- |
| while¬IsEmpty(stack)// |     |     | Branch | and Bound | process |     |                                                |               |     |           |       |      |      |
| 7                      |     |     |        |           |         |     | 5secondstooptimizeplacementforalargeDAG,andthe |               |     |           |       |      |      |
do
8 e←Pop(stack);
| 9   |         |                |     |     |     |     | entireoptimizationusuallytakeslessthan30seconds,which |     |     |     |     |     |     |
| --- | ------- | -------------- | --- | --- | --- | --- | ----------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|     | ife.R > | s o l u t i on | . R |     |     |     |                                                       |     |     |     |     |     |     |
1 0 th en isacceptable,giventhesizeoftheproblemandthefactthat
| 1 1 | if e. | v a l i d O p | e ra to rs==totalOperatorsthen |     |     |     |     |     |     |     |     |     |     |
| --- | ----- | ------------- | ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
solution←e; thegeneratedplancanbeusedforthewholelifetimeofthe
12
else
| 13  |     |               |     |     |     |     | application.Asthestreamingapplicationusuallyrunsfora |     |     |     |     |     |     |
| --- | --- | ------------- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| 14  |     | Branching(e); |     |     |     |     |                                                      |     |     |     |     |     |     |
longtime,theoverheadofgeneratingaplanisnotincluded
else
| 15  |     |             |      |           |         |       | inourmeasurement. |     |     |     |     |     |     |
| --- | --- | ----------- | ---- | --------- | ------- | ----- | ----------------- | --- | --- | --- | --- | --- | --- |
|     | //  | the current | node | has worse | bounded | value |                   |     |     |     |     |     |     |
than solution, and can be safely pruned. Extension with other optimization techniques. A
|     |     |     |     |     |     |     | number of | optimization | techniques |     | are available |     | in the |
| --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | ---------- | --- | ------------- | --- | ------ |
FunctionBranching(e):
| 16  |     |     |     |     |     |     | literature[27,30].Manyofthemcanbepotentiallyapplied |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- |
Data:Node[]children
foreachpairofOsandOcine.decisionsdo
| 17  |     |     |     |     |     |     | tofurtherimprovetheperformanceofBriskStream.Taking |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- |
18 ifallpredecessorsofthemarealreadyallocatedexceptOstoOc
operatorfusionasanexample,whichtradescommunication
then
#newAllocate←2; costagainstpipelineparallelismandisinparticularhelpful
19
| 2 0 |     | ifthe y ca | n b e co l lo ca | te d i n to o | n e so c k e t  | t h e n           |                                                     |     |     |     |     |     |     |
| --- | --- | ---------- | ---------------- | ------------- | --------------- | ----------------- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|     |     |            |                  | n             |                 |                   | ifoperatorssharelittleincommoncomputingresource.Our |     |     |     |     |     |     |
| 2 1 |     | c re       | a te a N o d e   | w i t h a p   | la n c o ll o c | a ti n gthemtoone |                                                     |     |     |     |     |     |     |
|     |     | socket;    |                  |               |                 |                   | performancemodelisgeneralenoughsuchthatitcanbe      |     |     |     |     |     |     |
| 22  |     | else       |                  |               |                 |                   | extendedtocaptureotheroptimizationtechniques.       |     |     |     |     |     |     |
createaNodenwithaplanseparatelyallocating
23
themtotwosockets;
|     |     | addntochildren; |     |     |     |     | E MORERELATEDWORK |     |     |     |     |     |     |
| --- | --- | --------------- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- |
24
else
| 25  |     |                 |     |     |     |     | Aniello et | al. [13] | propose | two schedulers |     | for | Storm. |
| --- | --- | --------------- | --- | --- | --- | --- | ---------- | -------- | ------- | -------------- | --- | --- | ------ |
| 26  |     | #newAllocate←1; |     |     |     |     |            |          |         |                |     |     |        |
foreachvalidwayofplacingOsandOcdo The first scheduler is used in an offline manner prior
27
createanewNodeandaddittochildren; to executing the topology and the second scheduler is
28
|     |                         |     |     |        |             |     | used in an | online fashion | to          | reschedule | after | a topology |      |
| --- | ----------------------- | --- | --- | ------ | ----------- | --- | ---------- | -------------- | ----------- | ---------- | ----- | ---------- | ---- |
|     | foreachNodec∈children// |     |     | update | in parallel |     |            |                |             |            |       |            |      |
| 29  |                         |     |     |        |             |     | has been   | running for    | a duration. | Similarly, |       | T-Storm    | [52] |
do
30 c.validOperators←e.validOperators+#newAllocate; dynamicallyassigns/reassignsoperatorsaccordingtorun-
31
c.R←BoundingFunction(c.plan);
32 time statistics in order to minimize inter-node and inter-
PushAll(stack,children);
| 33  |     |     |     |     |     |     | process traffic | while | ensuring | load balance. |     | R-Storm | [44] |
| --- | --- | --- | --- | --- | --- | --- | --------------- | ----- | -------- | ------------- | --- | ------- | ---- |
focusesonresourceawarenessoperatorplacement,which
|     |     |     |     |     |     |     | tries to improve | the | performance | of  | Storm | by assigning |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ----------- | --- | ----- | ------------ | --- |
thatthismaynotindicatethesaturationoftheunderlying operators according to their resource demand and the
resourcesbuttheoperatoritselfistoocoarse-grained.The resource availability of computing nodes. Cardellini et
| scaling | algorithm | can, | instead | of  | termination | (in Line 10 |     |     |     |     |     |     |     |
| ------- | --------- | ---- | ------- | --- | ----------- | ----------- | --- | --- | --- | --- | --- | --- | --- |
al.[18,19]proposeageneralmathematicalformulationofthe
Algorithm 1), try to further increase the replication level problemofoptimizingoperatorplacementfordistributed
ofoperatorthat“failed-to-allocate”.Afterthat,workloads data stream processing. Those approaches may lead to a
areessentiallyfurtherpartitionedamongmorereplicasand
suboptimalperformanceintheNUMAenvironmentthatwe
theplacementalgorithmmaybeabletofindavalidplan. aretargetat.Thisisbecausefactorsincludingoutputrate,
Thisprocedure,however,introducesmorecomplexitytothe amountofcommunicationaswellasresourceconsumption
algorithm.
|              |     |          |     |     |           |              | of an operator | may | change in | different | execution |     | plans |
| ------------ | --- | -------- | --- | --- | --------- | ------------ | -------------- | --- | --------- | --------- | --------- | --- | ----- |
| Optimization |     | runtime. |     | The | placement | optimization |                |     |           |           |           |     |       |
duetotheNUMAeffectandcanthereforemisleadexisting
problemisdifficulttosolveasthesolutionspaceincreases approachesthattreatthemaspredefinedconstants.
| rapidly | with | increased | replication |             | level | configurations. |     |     |     |     |     |     |     |
| ------- | ---- | --------- | ----------- | ----------- | ----- | --------------- | --- | --- | --- | --- | --- | --- | --- |
| Besides | the  | three     | proposed    | heuristics, |       | we also apply a |     |     |     |     |     |     |     |