NonamemanuscriptNo.
(willbeinsertedbytheeditor)
| A Survey    |     | on Transactional |               |     | Stream |     | Processing |     |     |     |     |     |     |
| ----------- | --- | ---------------- | ------------- | --- | ------ | --- | ---------- | --- | --- | --- | --- | --- | --- |
| ShuhaoZhang |     | · JuanSoto       | · VolkerMarkl |     |        |     |            |     |     |     |     |     |     |
Received:date/Accepted:date
|                  |     |           |     |           |                 |     | insight into | disparate | TSP | requirements |     | and | techniques. |
| ---------------- | --- | --------- | --- | --------- | --------------- | --- | ------------ | --------- | --- | ------------ | --- | --- | ----------- |
| Acknowledgements |     | This work | is  | supported | by the National |     |              |           |     |              |     |     |             |
ResearchFoundation,SingaporeandInfocommMediaDevelopment Second,toengagethedesignanddevelopmentofnovelTSP
| AuthorityunderitsFutureCommunicationsResearch&Development |     |     |     |     |     |     | systems. |     |     |     |     |     |     |
| --------------------------------------------------------- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- |
Programme(FCP-SUTD-RG-2021-005),theSUTDStart-upResearch
Grant (SRT3IS21164), the DFG Priority Program (MA4662-5), the Keywords Transactions · Stateful Stream Processing ·
GermanFederalMinistryofEducationandResearch(BMBF)under standardization·Survey
grants01IS18025A(BBDC-BerlinBigDataCenter)and01IS18037A
(BIFOLD-BerlinInstitutefortheFoundationsofLearningandData).
ShuhaoZhang’workispartiallydonewhileworkingasaPostdocat
| TUBerlin. |     |     |     |     |     |     | 1 Introduction |     |     |     |     |     |     |
| --------- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- |
Abstract Transactional stream processing (TSP) has been Transactional stream processing (TSP) can be broadly
| increasingly | gaining | traction. | TSP | aims | to provide a | single |         |               |     |           |      |      |               |
| ------------ | ------- | --------- | --- | ---- | ------------ | ------ | ------- | ------------- | --- | --------- | ---- | ---- | ------------- |
|              |         |           |     |      |              |        | defined | as processing |     | streaming | data | with | transactional |
unified model that offers both transaction- and stream- correctness guarantees [112]. These guarantees not only
| oriented | guarantees. | Over | the past | decade, | considerable |     |         |            |      |               |     |        |            |
| -------- | ----------- | ---- | -------- | ------- | ------------ | --- | ------- | ---------- | ---- | ------------- | --- | ------ | ---------- |
|          |             |      |          |         |              |     | include | properties | that | are intrinsic | to  | stream | processing |
efforts have resulted in the development of alternative TSP (e.g., time order, exactly-once semantics), but also the
| systems, | which | enables | us to explore |     | the commonalities |     |                 |     |                |     |               |     |               |
| -------- | ----- | ------- | ------------- | --- | ----------------- | --- | --------------- | --- | -------------- | --- | ------------- | --- | ------------- |
|          |       |         |               |     |                   |     | ACID properties |     | in traditional |     | OLTP-oriented |     | databases. In |
and differences across these solutions. However, a this regard, TSP brings transaction semantics to stream
| widely | accepted | standard | approach | to  | the integration | of  |     |     |     |     |     |     |     |
| ------ | -------- | -------- | -------- | --- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- |
processing,andviceversa,resultinginaunifiedsystemthat
transactional functionality with stream processing is still combinesthebestofbothworlds:transactionprocessingand
| lacking. | Existing | TSP systems | typically |     | focus on a | limited |     |     |     |     |     |     |     |
| -------- | -------- | ----------- | --------- | --- | ---------- | ------- | --- | --- | --- | --- | --- | --- | --- |
streamprocessing.
numberofapplicationfeatureswithnon-trivialdesigntrade- Consider an example use case involving self-driving
| offs. This | survey | initially | examines |     | diverse transaction |     |         |            |       |       |          |     |              |
| ---------- | ------ | --------- | -------- | --- | ------------------- | --- | ------- | ---------- | ----- | ----- | -------- | --- | ------------ |
|            |        |           |          |     |                     |     | vehicle | monitoring | [77], | where | vehicles |     | continuously |
models over streams and TSP specific transactional generatestatusdataviatheirsensors.Byemployingastream
| properties, | followed | by a | discussion | on  | the consequences |     |            |        |       |      |          |       |        |
| ----------- | -------- | ---- | ---------- | --- | ---------------- | --- | ---------- | ------ | ----- | ---- | -------- | ----- | ------ |
|             |          |      |            |     |                  |     | processing | engine | (SPE) | many | services | would | become |
of certain design decisions on system implementations. available, such as enabling a warning or providing a list of
Subsequently,wehighlightasetofrepresentativescenarios,
nearbygasstationswhentheamountofremainingfuelinthe
where TSP is employed, as well as discuss some open vehicleisbelowacertainthreshold.Inthisexample,while
problems.Theaimofthissurveyistwofold.First,toprovide
processingthefloodofstreamingsensordatafromvehicles,
|     |     |     |     |     |     |     | it is crucial | to  | maintain | consistent | and | up-to-date | states of |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | -------- | ---------- | --- | ---------- | --------- |
(cid:0)ShuhaoZhang
gasstationsandroadsinthesystem.Thisischallengingto
SingaporeUniversityofTechnologyandDesign,Singapore
achievebecausetheprocessingofinputdatafromdifferent
| E-mail:shuhao | zhang@sutd.edu.sg |     |     |     |     |     |          |            |        |             |     |         |             |
| ------------- | ----------------- | --- | --- | --- | --- | --- | -------- | ---------- | ------ | ----------- | --- | ------- | ----------- |
|               |                   |     |     |     |     |     |          |            | shared | application |     | states, |             |
|               |                   |     |     |     |     |     | vehicles | can modify |        |             |     |         | such as the |
JuanSoto
statusofacommongasstation.
TechnischeUniversita¨tBerlin,Germany
E-mail:juan.soto@tu-berlin.de By employing modern SPEs, existing workarounds,
|     |     |     |     |     |     |     | such as | using | external | databases | to  | store | the shared |
| --- | --- | --- | --- | --- | --- | --- | ------- | ----- | -------- | --------- | --- | ----- | ---------- |
VolkerMarkl
applicationstatescanleadtosignificantextraprogramming
TechnischeUniversita¨tBerlin,Germany
E-mail:volker.markl@tu-berlin.de efforts [125], poor system performance [78] and even

| 2   |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
incorrect results [37,53]. This problem is exacerbated if how different TSPSs are designed for specific application
more complex shared mutable state storage and retrieval scenariosandwhethertheycanbeappliedtootherusecases.
queries, such as range look-ups are further required. In OurreviewofrelatedusecasesinvolvingTSPSsalsoleads
contrast, TSP systematically manages concurrent accesses to a discussion on what challenges remain to be solved in
| to shared | application   |     | states.         | To ensure | correctness, |               | state | futuresystems. |     |     |     |     |     |
| --------- | ------------- | --- | --------------- | --------- | ------------ | ------------- | ----- | -------------- | --- | --- | --- | --- | --- |
| accesses  | are performed |     | transactionally |           | with         | transactional |       |                |     |     |     |     |     |
propertiesbeingguaranteed.
|          |        |                 |     |         |                 |         |         | 2 Background     |         |               |             |     |           |
| -------- | ------ | --------------- | --- | ------- | --------------- | ------- | ------- | ---------------- | ------- | ------------- | ----------- | --- | --------- |
| However, | the    | requirements    |     | and     | specifications  |         | of TSP  |                  |         |               |             |     |           |
| have not | yet    | been classified |     | in      | a comprehensive |         | way     |                  |         |               |             |     |           |
|          |        |                 |     |         |                 |         |         | In this section, | we will | first provide | an overview |     | of stream |
| and lack | common | definitions,    |     | leading | to              | a great | deal of |                  |         |               |             |     |           |
processing,followedbyanoverviewoftransactionalstream
| variation | in the | supported | functionalities |     | and | the | achieved |     |     |     |     |     |     |
| --------- | ------ | --------- | --------------- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- |
processing.
| performances.  |     | In particular, |                 | different | research |               | groups |     |     |     |     |     |     |
| -------------- | --- | -------------- | --------------- | --------- | -------- | ------------- | ------ | --- | --- | --- | --- | --- | --- |
| have developed |     | their          | own definitions |           | and      | corresponding |        |     |     |     |     |     |     |
implementationsoftransactionalstreamprocessingsystems
|               |      |            |        |               |     |         |         | 2.1 StreamProcessingOverview |     |     |     |     |     |
| ------------- | ---- | ---------- | ------ | ------------- | --- | ------- | ------- | ---------------------------- | --- | --- | --- | --- | --- |
| (TSPSs)       | over | the past   | decade | [14,          | 31, | 44, 53, | 59, 89, |                              |     |     |     |     |     |
| 134]. Without |      | a thorough |        | understanding |     | of      | how the |                              |     |     |     |     |     |
Wefirstintroducethebasicsofstreamprocessingandstate
various proposals complement one another, it is difficult management of stream processing and then offer a brief
| for researchers |     | to improve |     | upon | the | state-of-the-art. |     |     |     |     |     |     |     |
| --------------- | --- | ---------- | --- | ---- | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- |
historyofstreamprocessing.
| Furthermore, | it  | also brings | significant |     | challenges |     | for users |     |     |     |     |     |     |
| ------------ | --- | ----------- | ----------- | --- | ---------- | --- | --------- | --- | --- | --- | --- | --- | --- |
toadoptaparticulardesignorsystemfortheirapplication.
|              |     |        |          |     |       |        |           | 2.1.1 BasicsofStreamProcessing |     |     |     |     |     |
| ------------ | --- | ------ | -------- | --- | ----- | ------ | --------- | ------------------------------ | --- | --- | --- | --- | --- |
| As a result, | a   | common | semantic |     | model | across | disparate |                                |     |     |     |     |     |
systems has yet to emerge. This is largely due to the Stonebraker[107]referstostreamprocessingas“aclassof
diverse number of applications proposed in the literature softwaresystemsthatdealswithprocessingstreamsofhigh-
and the fact that each system focuses on its own particular volume messages with very low latency.” Associated with
applicationfeatures,whichimposeimplicitassumptionsand stream processing are numerous key terms, including the
objectives. To help researchers, particularly from different notionofstate,event,timestamp,streamquery,andstream
backgrounds,togainabetterunderstandingofthisarea,we operator. We will be drawing on several sources to define
systematicallysummarizepriorworksinvolvingTSPSs. thesetermsandconcepts,includingAbadietal.[13].
Outline of the Survey. This survey aims to provide The notion of state arises in numerous contexts,
|             |     |        |      |        |        |         |        | including | stream processing |     | [13] systems. | We  | define |
| ----------- | --- | ------ | ---- | ------ | ------ | ------- | ------ | --------- | ----------------- | --- | ------------- | --- | ------ |
| an overview | of  | TSP as | well | as our | vision | for TSP | in the |           |                   |     |               |     |        |
foreseeable future. The organization of the survey is as state [116] to be “the intermediate value of a specific
|          |                |     |     |           |            |     |           | computation | that will | be used | in subsequent |     | operations |
| -------- | -------------- | --- | --- | --------- | ---------- | --- | --------- | ----------- | --------- | ------- | ------------- | --- | ---------- |
| follows: | i) Background: |     | We  | introduce | the basics |     | of stream |             |           |         |               |     |            |
processing,offerabriefhistoryofstreamprocessing,andan during the processing of a data flow.”1 The state is a key
conceptinstreamprocessing,sincecomparingthe“present”
overviewonTSPinSection2;ii)TransactionModelsover
Streams: We discuss different transaction models to bridge withthe“past”iscommoninmanyapplications(e.g.,when
computingmovingaverages).
thetransactionprocessingparadigmsandstreamprocessing
in Section 3; iii) Properties of Transactional Stream A (data) stream [107] is a “sequence of data items that
collectivelydescribeoneormoreunderlyingsignals,”such
Processing:Wereviewvarioustransactionalpropertiesthat
define what is considered a correct execution in TSPSs in as a network traffic stream, which describes the type and
|         |                  |     |             |     |     |         |          | volume of | data transmitted | among | nodes | in a network. | An  |
| ------- | ---------------- | --- | ----------- | --- | --- | ------- | -------- | --------- | ---------------- | ----- | ----- | ------------- | --- |
| Section | 4; iv) Execution |     | Mechanisms: |     | We  | discuss | relevant |           |                  |       |       |               |     |
execution mechanisms in TSPSs, including execution and event e is a 3-tuple e =<t,k,v >, where t, k and v are
thetimestamp,key,andpayload,respectively.Atimestamp
faulttoleranceartifactsofTSPSsinSection5.v)Aspectsof
Transactional Stream Processing Engines: We summarize specifies the time when an event took place. When data
|     |     |     |     |     |     |     |     | items arrive | out of sequence |     | (i.e., not | in chronological |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --------------- | --- | ---------- | ---------------- | --- |
threekeysystemdesignaspects:APIs,systemarchitectures,
and state representations proposed in prior works to order), a stream is referred to as being out-of-order. The
keyreferstoanattributeorsetofattributesassociatedwith
| support | TSPSs | in Section |     | 6; and | vi) Advanced |     | Issues |     |     |     |     |     |     |
| ------- | ----- | ---------- | --- | ------ | ------------ | --- | ------ | --- | --- | --- | --- | --- | --- |
of Transactional Stream Processing: We compiled a set a certain state in stream processing. The payload refers
|                   |     |     |       |            |     |      |          | to data values | to be stored | as  | states in stream | processing, |     |
| ----------------- | --- | --- | ----- | ---------- | --- | ---- | -------- | -------------- | ------------ | --- | ---------------- | ----------- | --- |
| of representative |     | use | cases | that cover | a   | wide | range of |                |              |     |                  |             |     |
application features in Section 7. In Section 8, we discuss functionstomodifystates,orvaluestoparticipateincertain
computationsduringstreamprocessing.
severalrelatedresearchdirectionsthatpartiallyoverlapwith
| TSP, but | are actually |     | orthogonal. | In  | Section | 9, promising |     |     |     |     |     |     |     |
| -------- | ------------ | --- | ----------- | --- | ------- | ------------ | --- | --- | --- | --- | --- | --- | --- |
1 Thisdefinitiondiffersfromitscommonuseintraditionaldatabase
| new research | directions |     | are | underscored. |     | To the | best of |     |     |     |     |     |     |
| ------------ | ---------- | --- | --- | ------------ | --- | ------ | ------- | --- | --- | --- | --- | --- | --- |
systems,whereastateisasetofrelationaltablesataspecificpointin
| our knowledge, |     | this is | the first | attempt | at  | understanding |     | time. |     |     |     |     |     |
| -------------- | --- | ------- | --------- | ------- | --- | ------------- | --- | ----- | --- | --- | --- | --- | --- |

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 3   |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
For handling infinite streams, bounded subsets of during stream processing, for example for graph data
streams are referred to as windows [119]. There are many structures[136]andtransactionalrecords[78],whichisthe
types of windows, including tumbling windows, sliding focusofthissurvey.
| windows, | and        | session  | windows. |              | Tumbling | and      | sliding |     |     |     |     |     |     |     |     |
| -------- | ---------- | -------- | -------- | ------------ | -------- | -------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
| windows  | discretize | a stream |          | into windows |          | of fixed | length  |     |     |     |     |     |     |     |     |
l. Additionally, sliding windows define a slide step l s that 2.1.3 ABriefHistoryofStreamProcessing
| declares | how often | new | windows | start. | Thus, | records | are |     |     |     |     |     |     |     |     |
| -------- | --------- | --- | ------- | ------ | ----- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
assigned to multiple, concurrent, potentially overlapping Increased automation in healthcare, transportation [83,92],
| slidingwindowsifl |     | <l.Incontrast,sessionwindowsendif |     |     |     |     |     |          |         |            |       |       |        |         |     |
| ----------------- | --- | --------------------------------- | --- | --- | --- | --- | --- | -------- | ------- | ---------- | ----- | ----- | ------ | ------- | --- |
|                   |     | s                                 |     |     |     |     |     | finance, | and the | IoT [117], | among | other | market | sectors |     |
norecordisreceivedforatimel g (sessiongap)afteraperiod has led to ever faster data generation rates. For example,
| of activity. | A stream | query | is  | comprised | of  | a collection | of  |            |          |       |          |     |      |           |     |
| ------------ | -------- | ----- | --- | --------- | --- | ------------ | --- | ---------- | -------- | ----- | -------- | --- | ---- | --------- | --- |
|              |          |       |     |           |     |              |     | Alibaba in | November | 2019, | reported | the | need | to handle | 2   |
operatorsthatcontinuouslyprocessevents[133].Operators billion requests/second on Singles Day [1]. Unfortunately,
| are organized |     | into DAGs | (directed |     | acyclic | graphs), | where |             |          |          |       |       |     |       |      |
| ------------- | --- | --------- | --------- | --- | ------- | -------- | ----- | ----------- | -------- | -------- | ----- | ----- | --- | ----- | ---- |
|               |     |           |           |     |         |          |       | traditional | database | systems, | which | store | and | index | data |
each vertex corresponds to an operator and each edge before processing it, are ill-suited to handle large volumes
| represents | an event | flowing | downstream |     | from | the producer |     |         |          |         |       |              |     |      |       |
| ---------- | -------- | ------- | ---------- | --- | ---- | ------------ | --- | ------- | -------- | ------- | ----- | ------------ | --- | ---- | ----- |
|            |          |         |            |     |      |              |     | of data | ingested | in real | time. | In contrast, |     | SPEs | allow |
operator to the consumer operator. To sustain a high input users to build applications that are able to achieve high
streamingressrate,eachoperatorinastreamquerymaybe
|     |     |     |     |     |     |     |     | performance | for | very | large data | volumes. |     | They | offer |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ---- | ---------- | -------- | --- | ---- | ----- |
spreadacrossmultipleexecutors(e.g.,Javathreads).Eachof scalabilityandprovidefaulttolerance.Overthepastdecade,
whichhandlesmultipleinputeventsconcurrentlyviastream
|                    |     |     |     |     |     |     |     | many SPEs            | [12,       | 13, 36,     | 57] have | been  | proposed   |     | from |
| ------------------ | --- | --- | --- | --- | --- | --- | --- | -------------------- | ---------- | ----------- | -------- | ----- | ---------- | --- | ---- |
| partitioning[133]. |     |     |     |     |     |     |     | academiaandindustry. |            |             |          |       |            |     |      |
|                    |     |     |     |     |     |     |     | Early                | SPEs       | (1992-2010) | were     | often | extensions |     | of   |
|                    |     |     |     |     |     |     |     | existing             | relational | database    | systems. |       | Driven     | by  | the  |
2.1.2 StateManagementofStreamProcessing
|     |     |     |     |     |     |     |     | emergence | of sensor-based |     | applications, |     | the initial | design |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------------- | --- | ------------- | --- | ----------- | ------ | --- |
goalofearlySPEswassimplytoprocesscontinuousqueries
Theneedforexplicitstatemanagementoriginatesfromthe
need to keep and automate the maintenance of a persistent with low latency data ingested into the system. Among
|           |              |     |              |     |               |         |     | the early | SPEs | were Tapestry | [114], |     | TelegraphCQ |     | [39], |
| --------- | ------------ | --- | ------------ | --- | ------------- | ------- | --- | --------- | ---- | ------------- | ------ | --- | ----------- | --- | ----- |
| state for | event-driven |     | applications |     | in a reliable | manner. |     |           |      |               |        |     |             |     |       |
Typically, a state is categorized into one of two types: 1) Aurora[13],andSTREAM[20,57],whichrunonasingle
read-onlystate:whereapplicationslookupread-onlydatato machine and processes ordered event streams. Most early
gettheinformationrequiredtoprocessinputevents.2)read- SPEsweredesignedtohandlewindowqueries(e.g.,sliding
write state: window aggregation) over data streams, which is today
|     | where | some | states | are maintained |     | and updated |     |     |     |     |     |     |     |     |     |
| --- | ----- | ---- | ------ | -------------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
asstreameventscontinuetobeprocessed.Themanagement considered to be classical. Later, advanced features, such
oftheread-writestateisparticularlychallenging,especially as fault tolerance [12], adaptive query processing [96] and
when the processing of different input events relies on more complex query expressions [26] (e.g., complex event
reading/writingtothesamestate. processing)wereproposedalongwithsomenewSPEs,such
Due to diverse system requirements, such as managing asBorealis[12],System-S[52].
states beyond main memory, elastic scaling, and migrating The design of modern SPEs (2010-) was largely
states among shared-nothing architectures, SPEs were influenced by the MapReduce paradigm and the trend
designed to be fully aware of states, to relieve the burden towards cloud computing. Notably, modern SPEs have
ondevelopers.SPEswithbuilt-instatemanagementsupport two key features. They are both scalable over a cluster
|     |     | stateful | SPEs |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | -------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
are known as [36]. For more information of commodity machines and highly fault-tolerant. Among
about state management, see the following survey [116]. the modern SPEs are S4 [82], Storm [118], Heron [69],
| The usage | of  | state has | evolved | over | time. | For example, |     |             |       |           |        |       |       |     |     |
| --------- | --- | --------- | ------- | ---- | ----- | ------------ | --- | ----------- | ----- | --------- | ------ | ----- | ----- | --- | --- |
|           |     |           |         |      |       |              |     | Flink [36], | Spark | Streaming | [131], | Samza | [84], | and | the |
earlystreamprocessingengines(SPEs)adoptedabounded recent Kafka Streams [3]. The emergence of massively
| memory | model | for predefined |     | relational | stream | operations |     |     |     |     |     |     |     |     |     |
| ------ | ----- | -------------- | --- | ---------- | ------ | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
parallelprocessorswithmulti-terabytestoragecapacityand
(e.g., window aggregation) to keep their intermediate network bandwidths exceeding several gigabytes/second
computingresults.Consequently,sincethestatesizecannot
|     |     |     |     |     |     |     |     | has led | to a burst | of  | activity | over the | past | five | years, |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---------- | --- | -------- | -------- | ---- | ---- | ------ |
exceedthepre-allocatedspace,themaintainedstatequickly with the objective to enable hardware-conscious stream
becomesanapproximation(e.g.,sketchorsample),trading
|     |     |     |     |     |     |     |     | processing | [58,67,80,104,115,132,133,137]. |     |     |     |     | However, |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------------------------------- | --- | --- | --- | --- | -------- | --- |
offprecisionorcorrectnesswithmemoryconsumption. APIs and the support for query semantics were inherited
Other common uses of state, include counters from earlier SPEs. Despite the fact that they support the
aggregated over windows of records and buffered data same types of applications with stateless or simple stateful
for a join [17]. Besides storing simple intermediate queries, modern SPEs offer much higher performance,
results, there are some novel state representations required greater energy efficiency, and improved scalability via the

| 4   |     |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- |
use of modern hardware, such as multi-/many-core CPUs, Transaction Models over Streams
GPUs,andFPGAs[135].
Morerecently,hybridsystemarchitecturesthatintegrate Unified Model Separate Model
streaming with other forms of data processing (e.g., Trigger Unit
Generating Unit
OLTP, OLAP, batch, interactive) have emerged [14, 18, Transaction
Stream to
|         |           |         |     |            |     |     |             |          |     | Time |       | User |      | composition |
| ------- | --------- | ------- | --- | ---------- | --- | --- | ----------- | -------- | --- | ---- | ----- | ---- | ---- | ----------- |
| 38, 78, | 94, 134]. | Storage |     | management |     | and | correctness | Relation |     |      |       |      |      |             |
|         |           |         |     |            |     |     |             |          |     |      | Event |      | User |             |
guaranteeshavebecomeevermorecritical[112].However, Relation to Stream Query Operator
| mainstream | SPEs, | such | as  | Spark | Streaming |     | [131] and |     |     |     |     |     |     |     |
| ---------- | ----- | ---- | --- | ----- | --------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
Fig.1:TransactionmodelsofTSP.
| Flink [36],     | offer | limited  | support     | for         | storage     | management. |         |             |            |     |         |                 |       |        |
| --------------- | ----- | -------- | ----------- | ----------- | ----------- | ----------- | ------- | ----------- | ---------- | --- | ------- | --------------- | ----- | ------ |
| Unfortunately,  |       | this is  | undesirable |             | in many     | cases       | [31,98, |             |            |     |         |                 |       |        |
| 125], including |       | computer |             | simulation, | task-driven |             | model   |             |            |     |         |                 |       |        |
|                 |       |          |             |             |             |             |         | to schedule | continuous |     | updates | to a relational | table | during |
training for machine learning, and graph aggregation, stream processing, while the table is concurrently being
| since these | require |     | the availability |     | of  | shared | mutable |         |           |     |               |         |                 |     |
| ----------- | ------- | --- | ---------------- | --- | --- | ------ | ------- | ------- | --------- | --- | ------------- | ------- | --------------- | --- |
|             |         |     |                  |     |     |        |         | visited | by ad-hoc |     | transactional | queries | is challenging. |     |
state, where multiple threads spawned from the same Even defining correctness in such a case can be quite
| stream application |     | can | be  | referenced | and | updated. | Such |            |     |               |     |            |     |            |
| ------------------ | --- | --- | --- | ---------- | --- | -------- | ---- | ---------- | --- | ------------- | --- | ---------- | --- | ---------- |
|                    |     |     |     |            |     |          |      | tricky due | to  | a fundamental |     | difference | in  | the design |
demands motivate increasing attention on transactional goals of transactional databases and SPEs. In particular,
| stream processing, |     | which | accommodates |     |     | transaction | and |     |     |     |     |     |     |     |
| ------------------ | --- | ----- | ------------ | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
transactionaldatabaseshaveaclearnotationfortransactions
stream processing into a unified model. Although this and well-defined transactional properties, whereas SPEs
| approach | is unconventional |     |     | and challenging |     | to  | realize, it |           |           |     |         |                  |     |            |
| -------- | ----------------- | --- | --- | --------------- | --- | --- | ----------- | --------- | --------- | --- | ------- | ---------------- | --- | ---------- |
|          |                   |     |     |                 |     |     |             | typically | sacrifice | the | support | for well-defined |     | relational |
has great potential for supporting non-key-parallel modes semantics and commonly do not guarantee transactional
| of operation, |     | model | optimization |     | algorithms, |     | and more |              |     |          |     |                    |     |            |
| ------------- | --- | ----- | ------------ | --- | ----------- | --- | -------- | ------------ | --- | -------- | --- | ------------------ | --- | ---------- |
|               |     |       |              |     |             |     |          | consistency. | In  | the face | of  | such a non-trivial |     | task, many |
complexdatarepresentationsthatarehardlydivisible[35]. prior works [9, 15, 20, 31, 47, 57, 77] incorporate either
|     |     |     |     |     |     |     |     | transactional | semantics |     | into | SPEs or | continuous | stream |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --------- | --- | ---- | ------- | ---------- | ------ |
processingcapabilitiesintorelationaldatabasesystems.For
2.2 TransactionalStreamProcessing:AnOverview
|     |     |     |     |     |     |     |     | the purposes | of  | this | survey, | the term – | transactional | SPEs |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ---- | ------- | ---------- | ------------- | ---- |
(TSPSs)–referstothisnovelclassofsystems.
| The idea | of  | mixing | relational | queries |     | with | continuous |     |     |     |     |     |     |     |
| -------- | --- | ------ | ---------- | ------- | --- | ---- | ---------- | --- | --- | --- | --- | --- | --- | --- |
stream processing had been proposed ever since the first What makes TSPSs unique is that they allow and
|            |     |     |           |       |      |           |      | sometimes | encourage |     | a system | to maintain | shared | mutable |
| ---------- | --- | --- | --------- | ----- | ---- | --------- | ---- | --------- | --------- | --- | -------- | ----------- | ------ | ------- |
| generation | SPE | was | developed | [54]. | Such | a mixture | also |           |           |     |          |             |        |         |
naturallypermits(theaforementioned)sharedmutablestate states, which can be accessed by multiple entities (e.g.,
|            |        |     |        |             |     |          |       | concurrent | stream | queries, |     | ad-hoc queries | [78, | 134]). In |
| ---------- | ------ | --- | ------ | ----------- | --- | -------- | ----- | ---------- | ------ | -------- | --- | -------------- | ---- | --------- |
| management | during |     | stream | processing. |     | However, | early |            |        |          |     |                |      |           |
SPEssimplydisallowmaintainingrelationaltables[23].In particular,concurrentaccess(i.e.,readorwrite)tomutable
|     |     |     |     |     |     |     |     | shared states | must | satisfy | predefined | constraints |     | to ensure |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | ---- | ------- | ---------- | ----------- | --- | --------- |
contrast,othersallow(shared)relationaltablestobequeried
during continuous query processing, but implicitly assume someformoftransactionalproperties,whichmaybefurther
customized.Inpriorworks[78,134],alternativedefinitions
| that relations |     | remain | unchanged, |     | at least | throughout | the |     |     |     |     |     |     |     |
| -------------- | --- | ------ | ---------- | --- | -------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
lifetimeofthequery[13,75]. and implementations of TSPSs have been proposed, which
wepresentcomprehensivelyindetailinsubsequentsections.
| Stream   | applications |      | are         | typically | expressed |     | with a     |     |     |     |     |     |     |     |
| -------- | ------------ | ---- | ----------- | --------- | --------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
| sequence | of operators |      | (e.g.,      | a map     | function) |     | and each   |     |     |     |     |     |     |     |
| operator | may          | need | to maintain | states    | during    |     | processing |     |     |     |     |     |     |     |
for future reference [34]. Due to the lack of transactional 3 TransactionModelsoverStreams
semantics,modernSPEsrestricteachexecutionentity(e.g.,
eachoperator/thread),tomaintainadisjointsubsetofstates A standard that is widely accepted on transaction models
(or partitioned states). Thereby, disallowing or avoiding over data streams has yet to emerge [111]. For example,
statesharinginthesystem.Forexample,Flink[36]achieves inbatchprocessing,particularly,intransactionaldatabases,
highperformanceviathedisjointpartitioningofapplication new(periodicallyincoming)queriesareexecutedoverfinite
states, often through key-based partitioning [65], so that and unordered data sets. In contrast, in stream processing,
eachoperatormaintainsadisjointsubsetoftheapplication continuous queries are executed over conceptually infinite
states.However,theforcedpartitioningofstatescouldlower and time-ordered data streams. Consequently, it is difficult
performanceacrossmanyusescases,duetothetedioustask toformallycomparequeryingunderthesetwoparadigmsin
for developers to establish a workaround, such as keeping termsoftheirexecutionorderings,schemas,andconsistency
dilemma query
stateinasharedexternalstoragesystem[10].Wewillreturn requirements, which can potentially lead to
tothismatterinSection7. results(seeRemark2inSection4.2.2).Nonetheless,many
Integrating both streaming and transactional facilities related proposals have been raised in the last decade. In
into mainstream SPEs is a nontrivial task. For example, particular, researchers have proposed to either combine

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     |     | 5   |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
the two paradigms and treat them as one, or employ infinite) sequence of one-time queries that are fired as a
both paradigms, but select each one individually. Next, we result of the data sources being modified (e.g., the arrival
discussthesetwocompetingapproaches. of new events, update of existing inputs) or by periodic
execution(e.g.,everysecond).Thus,one-timeexecutionof
acontinuousquerycanbetranslatedintoreadingoperations
3.1 UnifiedExecution
|          |          |            |            |                  |        |            | on all of         | its input  | data sources  |        | plus (possibly) |         | a number of |
| -------- | -------- | ---------- | ---------- | ---------------- | ------ | ---------- | ----------------- | ---------- | ------------- | ------ | --------------- | ------- | ----------- |
|          |          |            |            |                  |        |            | write operations, |            | corresponding |        | to the          | results | that it may |
| To unify | the two  | processing | paradigms, |                  | we can | transform  |                   |            |               |        |                 |         |             |
|          |          |            |            |                  |        |            | generate.         | As another | example,      |        | in the case     | of      | Meehan et   |
| each one | into the | other.     | That is,   | treat relational |        | operations |                   |            |               |        |                 |         |             |
|          |          |            |            |                  |        |            | al.’s [78]        | S-Store    | system,       | stored | procedures      |         | are used to |
asstreaminginputeventsortreatstreamingdataassources
representstreamoperatorsandtransformstreamprocessing
| with regular    | read/write |                         | operations. | Both | approaches | have     |                  |     |            |        |      |        |             |
| --------------- | ---------- | ----------------------- | ----------- | ---- | ---------- | -------- | ---------------- | --- | ---------- | ------ | ---- | ------ | ----------- |
|                 |            |                         |             |      |            |          | into transaction |     | processing | (i.e., | each | stream | operator is |
| been exploredin |            | the researchliterature. |             |      | However,   | a formal |                  |     |            |        |      |        |             |
modelledasatransaction).Inthisway,S-Storeonlyneedsa
| theoretical | and empirical |     | comparison | between |     | them is still |     |     |     |     |     |     |     |
| ----------- | ------------- | --- | ---------- | ------- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- |
singleexecutionengine–thetransactionprocessingengine
anopenproblem.
(i.e.,H-Store[108]).
YetanotherexampleistheworksproposedbyOyamada
3.1.1 MappingRelationalDatatoDataStreams
|     |     |     |     |     |     |     | et al. [87, | 88].        | In their | case,       | they propose |     | to model a   |
| --- | --- | --- | --- | --- | --- | --- | ----------- | ----------- | -------- | ----------- | ------------ | --- | ------------ |
|     |     |     |     |     |     |     | database    | as a source | of       | information | related      | to  | data streams |
Relationaldatasourcescanbetransformedintodatastreams
|     |     |     |     |     |     |     | and use | a database | to  | archive | data streams. |     | In this way, |
| --- | --- | --- | --- | --- | --- | --- | ------- | ---------- | --- | ------- | ------------- | --- | ------------ |
byassociatingeachrelationaloperationwithastreamevent.
|                  |                  |          |        |             |            |             | database       | transactions | are         | triggered   | by            | the arrival       | of data      |
| ---------------- | ---------------- | -------- | ------ | ----------- | ---------- | ----------- | -------------- | ------------ | ----------- | ----------- | ------------- | ----------------- | ------------ |
| Shaikh et        | al. [101]        | propose  | an     | incremental |            | continuous  |                |              |             |             |               |                   |              |
|                  |                  |          |        |             |            |             | streams.       | Since        | the arrival | rate        | of data       | streams           | can be       |
| query processing |                  | approach | with   | isolation   | guarantees | that        |                |              |             |             |               |                   |              |
|                  |                  |          |        |             |            |             | high, it is    | necessary    | to          | invoke      | the triggered |                   | transactions |
| transforms       | relational       | updates  | into   | stream      | tuples.    | However,    |                |              |             |             |               |                   |              |
|                  |                  |          |        |             |            |             | efficiently,   | to ensure    | the         | performance | is            | high.             | To this end, |
| since relations  |                  | may have | been   | updated     |            | during join |                |              |             |             |               |                   |              |
|                  |                  |          |        |             |            |             | they propose   | several      | transaction |             | invocation    | schemes           | [87].        |
| processing,      | an inconsistency |          | in     | the results | may        | arise. To   |                |              |             |             |               |                   |              |
|                  |                  |          |        |             |            |             | To generalize  | their        | idea        | to include  | other         | types             | of data      |
| mitigate         | this, the        | authors  | employ | a mapping   |            | table as a  |                |              |             |             |               |                   |              |
|                  |                  |          |        |             |            |             | sources (e.g., | machine      | learning    |             | model),       | they subsequently |              |
transform.Totrackmodifications,theSPE-owneddatabase
|     |     |     |     |     |     |     | introduce | the concept | of  | continuous | query | (CQ)-derived |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | ----------- | --- | ---------- | ----- | ------------ | --- |
mustbeassociatedwithatrigger.Onceatriggerisfired,the
transactions[88],whichderiveread-onlytransactionsfrom
modificationrequestissenttotheSPEasaninputevent(e).
|     |     |     |     |     |     |     | continuous | queries. | These | read-only | transactions |     | can be |
| --- | --- | --- | --- | --- | --- | --- | ---------- | -------- | ----- | --------- | ------------ | --- | ------ |
Uponprocessinge,theSPEwillincrementallyinformallof
|                   |     |           |       |                   |     |         | mixed with | other | update | requests | without |     | introducing |
| ----------------- | --- | --------- | ----- | ----------------- | --- | ------- | ---------- | ----- | ------ | -------- | ------- | --- | ----------- |
| the participating |     | operators | about | the modification. |     | Since e |            |       |        |          |         |     |             |
inconsistenciesinthesharedapplicationstates.
| is timestamped | and    | each    | event   | is assumed | to      | be executed |     |     |     |     |     |     |     |
| -------------- | ------ | ------- | ------- | ---------- | ------- | ----------- | --- | --- | --- | --- | --- | --- | --- |
| in order,      | such a | mapping | ensures | the        | desired | isolation   |     |     |     |     |     |     |     |
properties: when processing each input event, all of the 3.2 SeparateExecution
| operators | will see | a consistent |     | database. | Via experimental |     |     |     |     |     |     |     |     |
| --------- | -------- | ------------ | --- | --------- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- |
evaluation, the authors demonstrate the efficiency of Under the separate execution model, instead of unifying
their proposed approach to solve the aforementioned the two paradigms, the processing of both streams and
inconsistency problem. However, their approach has not transactions is handled separately in the same system. A
beenextendedforgenericstreamprocessingusecases. common approach to realising separate execution is to
treattransactionprocessingastransactionalstateaccesses,
3.1.2 MappingDataStreamstoRelationalData which are triggered during stream processing. However,
|     |     |     |     |     |     |     | it still needs | to  | ensure | execution | correctness |     | when the |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ------ | --------- | ----------- | --- | -------- |
Data streams can be transformed into relational data. two processing paradigms interfere with one another (e.g.,
For example, in the case of Botan et al. [31], all data when transaction processing results in the modification of
sources (e.g., relational, non-relational, streaming) are application states that are being referenced during stream
treated uniformly: they are all sets of data items on which processing). As in conventional database transactions, to
read and write operations are executed, in accordance with ensure correctness, transactional semantics are employed
the page model [126]. There are four relational operations: and transactional state accesses are modelled as state
insert,whichaddsnewtuples,delete,whichremovestuples, transactions,butthesecontainadditionalattributes,suchas
valueupdate,whichreplacesexistingtuplesattributevalues,
triggereventsandtriggertimestamps.
andread,whichobtainsthevaluesoftuples. Intuitively, since stream data are unbounded and the
To handle stream data, a special relation is employed, processing of queries is endless, the conventional notion
where input events are modelled as write operations to the of a transaction boundary is difficult to define in stream
relation represented by the input stream. Botan et al. [31] processing. However, determining the boundary of stream
proposed to represent a continuous query as a (possibly transactions is rather flexible. For example, an SPE offers

| 6   |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
varying ways to trigger a transaction (i.e., triggering unit), same downstream operation (e.g., aggregate). Thus, each
such as per input event or per batch of events with a window corresponds to one read-only transaction. Write-
common timestamp. There are also alternative ways to only transactions simply consist of an ad-hoc write
generate a transaction (i.e., generating unit), such as per operationtoasharedresource.
operatorandperquery.Inaddition,transactionscanspawn
Conway[47]studiedtheconceptoftransactionsindata
other transactions. Next, we discuss the varying boundary streamprocessingandalsoproposedassociatingtransaction
setting approaches: triggering units, generating units, and boundaries in a database with window boundaries in a
transactionspawning. data stream, where a window is the basic unit of data
|     |     |     |     |     |     |     | flow in   | an SPE.        | For | example, | windows | are     | the        | unit of |
| --- | --- | --- | --- | --- | --- | --- | --------- | -------------- | --- | -------- | ------- | ------- | ---------- | ------- |
|     |     |     |     |     |     |     | isolation | for continuous |     | queries, | the     | unit of | durability | for     |
3.2.1 TriggeringUnits
|     |     |     |     |     |     |     | archived | streams, | and | the | output streams |     | of continuous |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | -------- | --- | --- | -------------- | --- | ------------- | --- |
queriesthemselves.
| Traditionally, | database |     | transactions |     | occur | when user |     |     |     |     |     |     |     |     |
| -------------- | -------- | --- | ------------ | --- | ----- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
programs are explicitly triggered by user requests. In Time-based transaction triggering is also employed in
|           |              |     |       |       |      |          | commercial | products. |     | For | example, | Coral8 | [6] specifies |     |
| --------- | ------------ | --- | ----- | ----- | ---- | -------- | ---------- | --------- | --- | --- | -------- | ------ | ------------- | --- |
| contrast, | transactions | in  | TSPSs | occur | when | they are |            |           |     |     |          |        |               |     |
triggered by incoming streaming events. Triggering units that the minimum recovery unit in the event of a failure
|            |             |     |             |            |     |           | is the time | slice. | Although |     | time slices | may | be processed |     |
| ---------- | ----------- | --- | ----------- | ---------- | --- | --------- | ----------- | ------ | -------- | --- | ----------- | --- | ------------ | --- |
| define the | granularity | of  | transaction | boundaries |     | and these |             |        |          |     |             |     |              |     |
units can be time-based, batch event-based, single event- concurrently,eachtimesliceisexecutedseparatelyandthe
orderbetweenthemispreserved.Timeslicesrepresentarow
based,anduser-defined.
Time-basedTransactions.AlthoughtheSTREAM[20, or a sequence of rows that have a common timestamp and
|     |     |     |     |     |     |     | arrive in | the same | stream | or  | window. | Similarly, | in an | early |
| --- | --- | --- | --- | --- | --- | --- | --------- | -------- | ------ | --- | ------- | ---------- | ----- | ----- |
57]projectdoesnotexplicitlyrefertotransactions,itdoes
assumethatbatchesoftupleswithacommontimestampare versionofStreamBase[7],queryinvocationhappensevery
secondasthestatetransactions,evenwhenthecontentofa
executedatomicallytoensureprogresscorrectness.Thatis,
STREAMsprocessingmodelistime-driven,giventhattime windowremainsthesame.
|                    |     |                               |     |     |     |     | Batch | Event-based |     | Transactions. |     | The | key | data |
| ------------------ | --- | ----------------------------- | --- | --- | --- | --- | ----- | ----------- | --- | ------------- | --- | --- | --- | ---- |
| advancesfromt−1tot |     | whenalltheeventswithtimestamp |     |     |     |     |       |             |     |               |     |     |     |      |
t−1 have been processed. This behaviour follows that of structure of the DataCell [73,74] engine is the basket. Its
|                 |        |       |     |        |      |          | role is to | store | a portion | of  | a stream | in a temporary |     | main- |
| --------------- | ------ | ----- | --- | ------ | ---- | -------- | ---------- | ----- | --------- | --- | -------- | -------------- | --- | ----- |
| a transactional | model, | where | all | events | with | a common |            |       |           |     |          |                |     |       |
timestamp belong to the same transaction, irrespective of memorytable.Queriesarethenevaluatedagainsteachfilled
basket,whichcontainsabatchofevents.Subsequently,they
whethertheyarriveonthesamestream.
With a focus on the concurrent aggregation of sliding introduced Basket ACID, where concurrent access to the
contentsofeachbasketisregulatedviaalockingschemeor
| windows, | Golab and | Ozsu | [53] | proposed | to  | model both |     |     |     |     |     |     |     |     |
| -------- | --------- | ---- | ---- | -------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
updatestowindowsandqueriesonwindowsastransactions the scheduler. Similarly, Meehan et al. [78] logically view
|            |           |            |     |       |             |          | tuples with | the | same | batch-ID | as occurring |     | concurrently |     |
| ---------- | --------- | ---------- | --- | ----- | ----------- | -------- | ----------- | --- | ---- | -------- | ------------ | --- | ------------ | --- |
| consisting | of atomic | sub-window |     | reads | and writes. | In their |             |     |      |          |              |     |              |     |
model,awindowoflengthoftiment isstoredasacircular as a group, which should be processed as an atomic unit.
Saileshetal.[68]definetheunitofwork(oratransaction)
| array of | n sub-windows, |     | each | spanning | a length | of time |     |     |     |     |     |     |     |     |
| -------- | -------------- | --- | ---- | -------- | -------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
t. Each window may have different values for n and t. as the processing of one or more chunks of data called
|              |       |            |            |     |             |      | “runs”, | where | a “run” | is a | finite sub-part | of  | a stream | (or |
| ------------ | ----- | ---------- | ---------- | --- | ----------- | ---- | ------- | ----- | ------- | ---- | --------------- | --- | -------- | --- |
| Every t time | unit, | the oldest | sub-window |     | is replaced | with |         |       |         |      |                 |     |          |     |
abuffercontainingincomingtuplesthathavearrivedinthe a group of data) simultaneously collected by an SPE (in
| t         |             |              |     |       | Q   |                | thiscaseDataCell[50]).Implicitly,DataCellassumestuples |     |     |     |     |     |     |     |
| --------- | ----------- | ------------ | --- | ----- | --- | -------------- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
| last time | units. Each | long-running |     | query |     | also specifies |                                                        |     |     |     |     |     |     |     |
its desired re-execution frequency. The frequency must be thatarrivesimultaneouslyaregroupedintothesamebatch,
|            | t,       | Q    |     |           |     |              | whichtriggersatransactiontobeprocessed. |     |     |     |     |     |     |     |
| ---------- | -------- | ---- | --- | --------- | --- | ------------ | --------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
| a multiple | of i.e., | will | be  | scheduled | for | re-execution |                                         |     |     |     |     |     |     |     |
everymwindowupdates,where1≤m<n.Subsequently, Chenetal.[44,45]proposethecycle-basedtransaction
|     |     |     |     |     |     |     | model | to support |     | CQCP | (continuous | querying |     | with |
| --- | --- | --- | --- | --- | --- | --- | ----- | ---------- | --- | ---- | ----------- | -------- | --- | ---- |
asnapshotqueryoraparticularre-executionofoneormore
long-running queries is defined as a read-only transaction, continuous persisting) with cycle-based isolation and
whereas the update of each sub-window is defined as a visibility.Theyconvertinfinitestreamdataintoasequence
write-onlytransaction. of “chunks” and execute queries over each chunk
sequentially.Inthisform,astreamqueryiscommittedone
| Oyamada | et  | al. [89] | pursue | a path | similar | to that |     |     |     |     |     |     |     |     |
| ------- | --- | -------- | ------ | ------ | ------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
of Golab and Ozsu [53] but in a more general setting. cycleatatime,whereacyclecanbeabatchofinputevents.
They assume continuous queries may trigger read-only S-Store [78] implements stream transactions as stored
transactions that reference a shared data resource (e.g., a procedures and represents stream dataflow graphs as lists
relational table) and write-only transactions triggered by of stored procedures. When a batch of input tuples arrives,
resource updates (e.g., ad-hoc queries that update tables). the first stored procedure is triggered, which may trigger
Read-only transactions consist of successive resource subsequentstoredprocedures.Punctuationorcontroltuples
reference operations whose results are involved in the canalsobeusedtosetatransactionboundary[56].

ASurveyonTransactionalStreamProcessing 7
Single Event-based Transactions. The Aurora and Query-based Transactions. Via a query-based
Borealis [12, 13] stream processing engines provide transaction generation scheme, early SPEs enabled the
operators that perform selections, insertions, deletions, and interactiveprocessingofrelationaldataandstreamdata.In
updates on Berkeley DB tables for each new input stream particular, operations involved in the one-time execution
tuple.Britoetal.[33]utilizesoftwaretransactionalmemory of the entire query were grouped into a single transaction.
to correctly parallelize order-sensitive stream operations. Forexample,STREAM[20,57]modelstheexecutionofan
Sturzrehm et al. [110] extend their original approach to a entirequeryonabatchoftupleswithacommontimestamp
distributedenvironment.Theymodeltheprocessingofeach asasingletransaction.InthecaseofGolabandOzsu[53],
input (called a task) as one transaction with a pre-assigned a snapshot query or a particular re-execution of one or
timestamp as its commit order. Specifically, as an event more long-running queries are read-only transactions that
enters the system, it will be assigned a logical timestamp, referenceslidingwindows.
which is unique and continuous (i.e., there are no gaps in
time).Toensurethisassumptionismet,wheneveranevent Operator-based Transactions. Another design
is discarded (e.g., a filter drops an irrelevant event) a null approach is to allow each operator of a query to generate
eventisinsertedtocarrythetimestampthroughthesystem. transactions.Forexample,S-Store[78]modelsatransaction
Wangetal.[125]definesastreamtransactionasasequence asasingleinvocationofastoredprocedure,andeachstored
of ACEP (active complex event processing) system state procedure represents one operator in a streaming dataflow
changes triggered by a single input event. Ray et al. [95] graph. Similarly, Zhang et al. [134] adopt a transactional
proposetoemploystreamtransactionstoensureconcurrent dataflow model and prescribe a transaction generating unit
shared maintenance and the re-use of sub-patterns across in a much more fine-grained manner, where each operator
queries. Zhang et al. [134] define the set of state accesses in a streaming dataflow graph can generate a transaction
triggered by the processing of a single input event at one that can read or write to the shared states. Operator-based
executorasonestatetransaction.Thetimestampofastate generating units are far more flexible than query-based
transactionisthesameasitstriggeringevent. generating units. However, they can lead to a dilemma,
User-defined Transactions. Botan et al. [31] define a whichwillbediscussedinSection4.
transactioninratherflexibleterms.Bymodellingstreaming
primitives as reading/writing operations on a transactional User-defined Transactions. Some applications require
database, they can reuse the transaction processing the handling of ad-hoc transactional queries during stream
capabilities from existing transactional databases (i.e., processing. These user-driven ad-hoc queries may read
H-Store in this case) very easily. However, performing or update states that are shared with continuous queries.
transactions on data streams raises the issue of setting Consequently, in order to resolve any conflicts, access
transactional boundaries, which may not obvious. must be managed transactionally. Another example arises
Consequently, they propose to allow users to set their when client applications (i.e., users) create transactions
own transaction boundary [31]. Nevertheless, all of their that are handled by TSPSs, which are employed to handle
examplesassumethatatransactionistriggeredbyoneinput conventionalOLTPworkloads[43].
event and includes the subsequent one-time continuous
query execution. Another example is discussed by Chen et
In the case of Affetti et al. [14,15], they extend the
al.[43],whereTSPmaybeappliedtohandleconventional
dataflow model of an SPE by introducing the concept
OLTP workloads or support ad-hoc transactional queries
of a transactional subgraph (i.e., a t-graph), which
during stream processing. In such a case, a transaction in
identifies a portion of the graph of computation where
TSP is directly posed by client applications in the same
the state of enclosed operators is accessed and updated
mannerasconventionaldatabasesystems.
with transactional semantics. They also enable users to
specifywhereconsistencyneedstobeenforced,andwhich
consistencyconstraintsarerequired.Inparticular,eachtuple
3.2.2 GeneratingUnit thatentersthet-graphinitiatesaread-writetransaction.All
oftheoperatorswithinthet-graphareprocessedasasingle
Unlike triggering units which determine “when” a transaction with ACID guarantees. The state of operators
transaction is created, generating units determine “who” withinthet-graphisalsoexternallyqueryablethroughread-
generates a transaction. In particular, transactions are onlytransactions.Adrawbackoftheuser-definedapproach
generatedviauserclientsdirectlyorviacontinuousqueries is the difficulty in performing optimizations, given that the
onaper-queryorper-operatorbasis.Therearevaryingtypes type of transaction is unknown to the system in advance.
of generating units: query-based, operator-based, and user- Moreover,usersareresponsibletoensurethatthesystemis
defined.Weexamineeachofthesetypesinturn. freeofanydilemmas.

| 8   |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- | --- |
Transactional Properties However, several studies [14, 31, 125, 134] support
|     |     |     |     |     |     |     |     | the idea | that the | concurrent |     | execution | of  | multiple | state |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | -------- | ---------- | --- | --------- | --- | -------- | ----- |
ACID Streaming Properties transactions should satisfy a variation of ACID properties
Properties
|     |     |     |     |     |     |     |     | for two | key reasons. | First, | in  | relational | databases |     | ACID |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ------------ | ------ | --- | ---------- | --------- | --- | ---- |
Operator Ordering
propertiesarestrictrequirements.However,theseproperties
| Atomicity | Isolation |     | Constraint | Event OrderingDeliverbility |     |     |     |     |     |     |     |     |     |     |     |
| --------- | --------- | --- | ---------- | --------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Properties
Consistency Durability Constraint canberelaxedinothercontexts,dependingontherequired
|     |     |     |     |     |     |     |     | semantics. | Second, | in  | some | streaming | applications, |     | the |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------- | --- | ---- | --------- | ------------- | --- | --- |
Fig.2:TransactionalPropertiesinTSP.
traditionalACIDpropertiesdonothold.Forexample,Wang
|     |     |     |     |     |     |     |     | et al. [125] | propose        |     | a mapping  | of  | the      | classical | ACID   |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | -------------- | --- | ---------- | --- | -------- | --------- | ------ |
|     |     |     |     |     |     |     |     | properties   | to stream-ACID |     | properties |     | (s-ACID) | for       | active |
3.2.3 TransactionSpawning
complexeventprocessing.
|                 |      |                 |           |             |                     |             |         | Unfortunately,     |        | due        | to the    | lack of      | a common | standard,  |        |
| --------------- | ---- | --------------- | --------- | ----------- | ------------------- | ----------- | ------- | ------------------ | ------ | ---------- | --------- | ------------ | -------- | ---------- | ------ |
| Transactions    | can  | spawn,          | i.e.,     | trigger     | and                 | generate    | other   |                    |        |            |           |              |          |            |        |
|                 |      |                 |           |             |                     |             |         | prior works        | on     | TSP        | typically | focus        | on       | only a     | narrow |
| transactions.   | This | is particularly |           | useful      | in service-oriented |             |         |                    |        |            |           |              |          |            |        |
|                 |      |                 |           |             |                     |             |         | set of application |        | workloads. |           | In addition, |          | the notion | of a   |
| architectures,  |      | where           | the basic | premise     |                     | is to treat | all     |                    |        |            |           |              |          |            |        |
|                 |      |                 |           |             |                     |             |         | transaction        | in the | context    | of stream | processing   |          | varies,    | and    |
| functionalities |      | as services     |           | and compose |                     | and         | execute |                    |        |            |           |              |          |            |        |
them, according to the user or application-specific often provides an informal guarantee of correctness that
|              |     |        |          |      |         |           |     | is tightly | coupled | with | the operational |     | semantics | given | by  |
| ------------ | --- | ------ | -------- | ---- | ------- | --------- | --- | ---------- | ------- | ---- | --------------- | --- | --------- | ----- | --- |
| requirements |     | [123]. | Treating | each | service | execution | as  |            |         |      |                 |     |           |       |     |
a transaction and requiring atomic execution of those a specific system’s implementation. Next, we discuss the
|              |      |      |       |       |      |         |         | custom | ACID properties |     | in TSPSs: | atomicity, |     | consistency, |     |
| ------------ | ---- | ---- | ----- | ----- | ---- | ------- | ------- | ------ | --------------- | --- | --------- | ---------- | --- | ------------ | --- |
| transactions | have | been | found | to be | very | helpful | in this |        |                 |     |           |            |     |              |     |
process. The execution of service compositions yields isolation,anddurability.
| composite | transactions |         | [122],     | where         | a transaction |               | is an |                 |     |     |     |     |     |     |     |
| --------- | ------------ | ------- | ---------- | ------------- | ------------- | ------------- | ----- | --------------- | --- | --- | --- | --- | --- | --- | --- |
| execution | of a         | service | [121].     | Subsequently, |               | a transaction |       | 4.1.1 Atomicity |     |     |     |     |     |     |     |
| spawning  | consists     | of      | a nonempty | set           | of services.  | Some          | of    |                 |     |     |     |     |     |     |     |
which have executions that are continuous and others may In relational databases, atomicity is a transaction property
spawnnewtransactions. thatguaranteesthatadatabaseiseitherfullyupdatedornot
updatedatall[124].Anatomictransactionisanindivisible
|     |     |     |     |     |     |     |     | and irreducible |     | series of | database | operations |     | that either | all |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --------- | -------- | ---------- | --- | ----------- | --- |
3.3 RemarksConcerningTransactionModelsoverStreams occur or none occur. This idea of atomicity in relational
|     |     |     |     |     |     |     |     | databases | carries | over | to TSPSs. | For | example, | the | unit of |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------- | ---- | --------- | --- | -------- | --- | ------- |
TSP requires the convergence of both stream and atomicityinGu¨rgenetal.[59]isasetof“continuousqueries
transactionalprocessing.However,therearemanydifferent
|     |     |     |     |     |     |     |     | that read | updatable | resources”. |     | In the | case | of Streaming |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------- | ----------- | --- | ------ | ---- | ------------ | --- |
ways for this convergence to occur. This results in Ledger[9]eitheralloftherowmodificationsareperformed
| transaction | models | that | are | highly | flexible. | To date, | there |     |     |     |     |     |     |     |     |
| ----------- | ------ | ---- | --- | ------ | --------- | -------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
(i.e.,thetransactionsucceeds),ornoneareperformed(i.e.,
is no single transaction model that is widely accepted for thetransactionfails).
| TSP, which | only | increases | the | difficulty | in  | comparing | the |             |     |                  |     |            |     |               |     |
| ---------- | ---- | --------- | --- | ---------- | --- | --------- | --- | ----------- | --- | ---------------- | --- | ---------- | --- | ------------- | --- |
|            |      |           |     |            |     |           |     | In contrast | to  | the conventional |     | definition |     | of atomicity, |     |
performanceofthevaryingTSPSs. Wang et al. [125] propose that all operations triggered by
|     |     |     |     |     |     |     |     | a single | input event | should  | be  | atomic   | in their | entirety.    | In  |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | ------- | --- | -------- | -------- | ------------ | --- |
|     |     |     |     |     |     |     |     | S-Store  | [78] atomic | batches |     | of input | events   | are executed |     |
4 TransactionalPropertiesinTSP
|                 |     |             |               |     |            |     |         | in isolation. | Hence, | atomicity |         | is concerned  |         | with the | batch  |
| --------------- | --- | ----------- | ------------- | --- | ---------- | --- | ------- | ------------- | ------ | --------- | ------- | ------------- | ------- | -------- | ------ |
|                 |     |             |               |     |            |     |         | of input      | events | rather    | than    | the execution |         | of a     | single |
| In the research |     | literature, | transactional |     | properties |     | greatly |               |        |           |         |               |         |          |        |
|                 |     |             |               |     |            |     |         | transaction.  | TSpoon | [15]      | ensures | that          | all the | effects  | within |
vary.Weexamineeachofthesepropertiesinturn.
|     |     |     |     |     |     |     |     | a transactional | subgraph |     | (triggered | by  | an input | event) | are |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | -------- | --- | ---------- | --- | -------- | ------ | --- |
eitherstoredentirelyornotatall.
4.1 ACIDProperties
|                |     |          |              |     |     |              |     | 4.1.2 Consistency |     |     |     |     |     |     |     |
| -------------- | --- | -------- | ------------ | --- | --- | ------------ | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- |
| Traditionally, |     | database | transactions |     | are | encapsulated |     |                   |     |     |     |     |     |     |     |
sequences of (read, write)-operations that must be ACID Consistency in database systems refers to the requirement
compliant[27].TSPSsalsooffersthesameACIDguarantees that any given database transaction must not leave the
via the OLTP model. For example, in S-Store [78] all database in an invalid state, according to defined rules,
transactions are predefined and represented as stored including constraints, cascades, and triggers [124]. For
procedures. In addition, in S-Store, stream transactions example,auser’sageshouldnotbecomenegative.Similarly,
are transformed into database transactions, which are then consistency matters in TSPSs as well. However, few
handledinH-Store[108]–arelationaldatabasesystem. works discuss consistency in TSP due to its similarity

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     |     |     | 9   |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
to conventional database systems. In the case of Wang Eventual Consistency. Eventual consistency [25] is a
et al. [125], the execution of stream transactions must consistencymodelusedindistributedcomputingtoachieve
offer a guarantee that the ACEP system will start in a high availability. It informally guarantees that if no new
correct state and when it ends leave the ACEP system updates are made to a given data item, eventually all
state correct. TSpoon [15] enables developers to specify accesses to that item will return the last updated value.
integrity constraints on the value of individual keys in SPEs usually adopt some form of eventual consistency
their proposed transactional subgraph region (i.e., the t- since states exposed to the outside world are expressed
graph). They ensure that the state in a t-graph is always as output streams, and instant consistency of the global
consistent – before and after a successfully committed systemstateishiddenfromusers.However,itisunclearhow
transaction makes modifications to the states kept in the t- the eventual consistency model can be applied to TSPSs,
graph. Similarly, Streaming Ledger [9] ensures that tables given that shared mutable states (or their snapshot) need
arealwaysconsistent. tobeimmediatelyvisibleandqueryablebothinternallyand
externallytothesystem.
4.1.3 Isolation
| Isolation | regulates    | the  | interaction | between |       | concurrently |       | 4.1.4 Durability |     |     |     |     |     |     |
| --------- | ------------ | ---- | ----------- | ------- | ----- | ------------ | ----- | ---------------- | --- | --- | --- | --- | --- | --- |
| executed  | transactions | that | read        | and     | write | common       | keys. |                  |     |     |     |     |     |     |
Stricter isolation levels constrain the interaction between In database systems, durability guarantees that committed
| transactions | and | offer | higher | guarantees, | but | at the | cost |              |      |         |             |      |        |          |
| ------------ | --- | ----- | ------ | ----------- | --- | ------ | ---- | ------------ | ---- | ------- | ----------- | ---- | ------ | -------- |
|              |     |       |        |             |     |        |      | transactions | will | survive | permanently | even | in the | presence |
of lowering the degree of concurrency and decreasing ofasystemfailure.InTSP,inordertoenablefaulttolerance,
| performance. | Conversely, |              | more         | relaxed | isolation |               | levels |           |       |                |             |         |       |             |
| ------------ | ----------- | ------------ | ------------ | ------- | --------- | ------------- | ------ | --------- | ----- | -------------- | ----------- | ------- | ----- | ----------- |
|              |             |              |              |         |           |               |        | there are | three | key durability | properties, |         | which | we discuss  |
| impose       | fewer       | constraints, | enable       |         | a higher  | degree        | of     | next.     |       |                |             |         |       |             |
| concurrency  | and         | increase     | performance. |         | Akin      | to databases, |        |           |       |                |             |         |       |             |
|              |             |              |              |         |           |               |        | Durable   | Input | Streams.       | Archived    | streams |       | are streams |
TSPSsalsooffersanumberofisolationlevels,whichcontrol
|            |            |      |        |      |           |      |      | that have | been | written | to durable | mediums |     | and can |
| ---------- | ---------- | ---- | ------ | ---- | --------- | ---- | ---- | --------- | ---- | ------- | ---------- | ------- | --- | ------- |
| the degree | of locking | that | occurs | when | selecting | data | from |           |      |         |            |         |     |         |
subsequentlybeaccessedbyqueries.Forexample,theyare
sharedstates[15].
|              |     |            |              |     |           |     |        | used by     | TSPSs | to perform | correlations |        | between | historical |
| ------------ | --- | ---------- | ------------ | --- | --------- | --- | ------ | ----------- | ----- | ---------- | ------------ | ------ | ------- | ---------- |
| Serializable |     | Isolation. | Serializable |     | isolation |     | is the |             |       |            |              |        |         |            |
|              |     |            |              |     |           |     |        | and current | data  | [40].      | As new       | stream | tuples  | arrive,    |
highestisolationlevelthatensurestransactionsareexecuted
|     |     |     |     |     |     |     |     | TSPSs update |     | the results | of continuous |     | queries, | and then |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ----------- | ------------- | --- | -------- | -------- |
asiftheywereexecutedsequentially.InWangetal.[125],
periodicallyarchivethetuplesforlateraccess.
| isolation       | holds          | when            | a single   | input    | event      | that       | must   |                |         |                      |         |               |         |              |
| --------------- | -------------- | --------------- | ---------- | -------- | ---------- | ---------- | ------ | -------------- | ------- | -------------------- | ------- | ------------- | ------- | ------------ |
|                 |                |                 |            |          |            |            |        | Durable        | States. | Most                 | TSPSs   | also          | require | that         |
| appear          | to be executed |                 | as if      | no other | input      | events     | are    |                |         |                      |         |               |         |              |
|                 |                |                 |            |          |            |            |        | intermediate   | changes | made                 | during  | stream        |         | processing   |
| being processed |                | concurrently    |            | triggers | a          | change     | to the |                |         |                      |         |               |         |              |
|                 |                |                 |            |          |            |            |        | or application |         | states be            | durable | (persistent). |         | This is      |
| ACEP system     |                | state. Although |            | not      | explicitly | mentioned, |        |                |         |                      |         |               |         |              |
|                 |                |                 |            |          |            |            |        | generally      | known   | as “fault-tolerance” |         | in            | SPEs.   | It is one of |
| serializable    | isolation      | is              | guaranteed |          | due to     | the usage  | of     |                |         |                      |         |               |         |              |
thecorefeaturesthatdistributedSPEsshouldprovide.
| locking-based | concurrency |     | control | protocols, |     | which | will |     |     |     |     |     |     |     |
| ------------- | ----------- | --- | ------- | ---------- | --- | ----- | ---- | --- | --- | --- | --- | --- | --- | --- |
be discussed further in Section 5.3. FlowDB [14] also Durable Output Results. Lastly, the output results in
supports serializable isolation. It ensures that the results TSPSsmustalsobedurable(permanent).Wangetal.[125]
of two transactions take place as if they were executed state that (stream) durability is the property that the output
in some sequential order, without interleaving updates to of pattern queries must be “permanently valid”. That is, at
|                   |     |            |     |           |        |      |      | any given | point | in time, | all of the | output | events | from the |
| ----------------- | --- | ---------- | --- | --------- | ------ | ---- | ---- | --------- | ----- | -------- | ---------- | ------ | ------ | -------- |
| state operations. |     | Similarly, | in  | Streaming | Ledger | [9], | each |           |       |          |            |        |        |          |
transactionexecutesasifitweretheonlytransactionbeing ACEPsystemupuntilthatpointsatisfythequerysemantics.
Similarly,Botanetal.[31]considerdurabilityinthecontext
performedonatable.
oftheinputeventsofcommittedtransactionsthatwillnever
| Snapshot | Isolation. |     | A number |     | of TSPSs | were | built |     |     |     |     |     |     |     |
| -------- | ---------- | --- | -------- | --- | -------- | ---- | ----- | --- | --- | --- | --- | --- | --- | --- |
bereprocessedorduplicated.
| on the | notion | of snapshot | isolation |     | [12, 31, | 44, | 46, 56], |     |     |     |     |     |     |     |
| ------ | ------ | ----------- | --------- | --- | -------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
a relaxed isolation property common in conventional Achievingdurabilityforinputstreams,states,andoutput
transaction processing. Snapshot isolation guarantees that results simultaneously in a system is often unnecessary as
all reads performed in the same transaction have access to fault tolerance can be achieved with any one of the three
a consistent snapshot of the database, and the transaction durability properties. However, the run-time overhead and
itself will only commit if no updates conflict with any therecoverydelayswillvaryaccordingly.Tothebestofour
concurrent updates made since the snapshot. In practice, knowledge, there is still no in-depth study on the design
eachtransactioncanaccessthelastcommittedvaluesinthe of efficient fault tolerance mechanisms for TSPSs. Fault
databasethatexistedatthetimethetransactionbegan. tolerancemechanismswillbediscussedinSection5.4.

| 10  |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
4.2 StreamingProperties of transactions are the same as if they were executed
sequentially,inthesameorderinwhichtheystarted.
| Besides | the ACID | properties, |     | TSPSs | also guarantees |     |     |     |     |     |     |     |     |     |
| ------- | -------- | ----------- | --- | ----- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
streaming properties, including an operator ordering 4.2.3 DeliverabilityProperty
| constraint, | an event | ordering | constraint, |     | and deliverability |     |             |     |                |     |       |        |     |         |
| ----------- | -------- | -------- | ----------- | --- | ------------------ | --- | ----------- | --- | -------------- | --- | ----- | ------ | --- | ------- |
|             |          |          |             |     |                    |     | In addition |     | to durability, |     | TSPSs | strive | to  | provide |
properties.Next,wediscusseachoftheseinturn.
|     |     |     |     |     |     |     | deliverability |     | guarantees | for | all streams, |     | akin to | SPEs. |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ---------- | --- | ------------ | --- | ------- | ----- |
However,TSPSsrequiresadeliverabilityguaranteeonboth
4.2.1 OperatorOrderingConstraint
|               |           |     |            |     |              |     | the local   | state       | of an | operator          | and the | strict     | time  | ordering |
| ------------- | --------- | --- | ---------- | --- | ------------ | --- | ----------- | ----------- | ----- | ----------------- | ------- | ---------- | ----- | -------- |
|               |           |     |            |     |              |     | of an input | stream      | for   | the corresponding |         | operation. |       | This is  |
| As previously | discussed |     | in Section |     | 3.2.1, TSPSs | can |             |             |       |                   |         |            |       |          |
|               |           |     |            |     |              |     | because     | the results | are   | dependent         | on      | the local  | state | of an    |
representanapplicationasadirectedacyclicgraph(DAG).
|           |              |          |              |     |               |        | operator    | as well | as the | time ordering    |     | of the   | input        | streams. |
| --------- | ------------ | -------- | ------------ | --- | ------------- | ------ | ----------- | ------- | ------ | ---------------- | --- | -------- | ------------ | -------- |
| For each  | input event, | the      | processing   | of  | each operator | (i.e., |             |         |        |                  |     |          |              |          |
|           |              |          |              |     |               |        | Hence, this | model   | is     | more restrictive |     | than the | exactly-once |          |
| a vertex) | can trigger  | a stream | transaction. |     | Naturally,    | this   |             |         |        |                  |     |          |              |          |
guaranteefoundinmanySPEs.
| results in  | a topological  | ordering    |              | of the        | transactions. | In S-    |           |            |     |              |            |         |        |       |
| ----------- | -------------- | ----------- | ------------ | ------------- | ------------- | -------- | --------- | ---------- | --- | ------------ | ---------- | ------- | ------ | ----- |
|             |                |             |              |               |               |          | TSPSs     | needs      | to  | replay       | failed     | tuples  | in the | exact |
| Store [78], | the scheduling |             | of triggered |               | transactions  | must     |           |            |     |              |            |         |        |       |
|             |                |             |              |               |               |          | timestamp | sequence   |     | of their     | triggering | input   | events | and   |
| satisfy     | one of the     | topological | orderings.   |               | Although      | there    |           |            |     |              |            |         |        |       |
|             |                |             |              |               |               |          | avoid the | processing |     | of duplicate | messages.  |         | Thus,  | TSPSs |
| may be      | many correct   | schedules   |              | corresponding | to            | multiple |           |            |     |              |            |         |        |       |
|             |                |             |              |               |               |          | ensures   | that a     | new | worker       | will start | exactly | from   | the   |
topologicalorderingsoftheDAG,S-Storecurrentlyallows
|     |     |     |     |     |     |     | point when | a   | failed | worker stopped. |     | Thereby | giving | the |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------ | --------------- | --- | ------- | ------ | --- |
onlyoneofthem.Incontrast,severalotherTSPSsnaturally
impressionthatafailureneveroccurred.Onewaytoachieve
satisfyanoperatororderingconstraintduetotheirdataflow-
|     |     |     |     |     |     |     | this is to | checkpoint |     | each message |     | before | processing | and |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---------- | --- | ------------ | --- | ------ | ---------- | --- |
basedexecutionmodel[14,134].
|     |     |     |     |     |     |     | replay them | in   | the event | of failure. |             | Due to | its significant |          |
| --- | --- | --- | --- | --- | --- | --- | ----------- | ---- | --------- | ----------- | ----------- | ------ | --------------- | -------- |
|     |     |     |     |     |     |     | overhead,   | most | TSPSs     | do          | not provide |        | such            | a strict |
4.2.2 EventOrderingConstraint
deliverabilityguarantee.Therefore,additionalinvestigation
iswarranted,toidentifyamoreefficientmechanism.
| Besides | the operator       | ordering | constraint, |     | TSPSs    | must also |     |     |     |     |     |     |     |     |
| ------- | ------------------ | -------- | ----------- | --- | -------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
| ensure  | that the resulting |          | transaction |     | schedule | order is  |     |     |     |     |     |     |     |     |
alignedwiththetimestampscorrespondingtothesequence 4.3 RelaxedTransactionalProperties
ofstreamingevents[31,78].Forexample,areadoperation
triggered by an event must never be able to access an Transaction models with relaxed properties, e,g.,
updatedstatethatismodifiedbyawriteoperationtriggered sagas [51] and ConTract [130] have been proposed.
by a “future” event. This is critical as streaming events are The sagas model [51] allows a transaction to be split
chronologically ordered. Golab et al. [53] were the first to into several smaller sub-transactions. Thus, isolation is
point out that serializability is insufficient for the correct relaxed in the original transaction and delegated to the
concurrentprocessingofslidingwindows.Awindowissplit individual sub-transactions. The atomicity of the original
into multiple sub-windows to allow parallel processing. A transaction is preserved by ensuring all sub-transactions
conflict occurs when two interleaved transactions operate are executed successfully or none at all. A similar idea
on the same sub-window with at least one write operation. of splitting transactions has been adopted in TSPSs
Alternative conflict-serializable schedules can lead to such as TStream [134]. The ConTract model [130] was
different stream processing results. The key reason for this proposed as a mechanism for grouping transactions into
is that conventional serializability does not have a notion a multitransaction activity. Transactions are made up of
of time. However, stateful stream processing is ordering multiple steps, with explicit dependency relationships
sensitive – application states referenced during stream specified between the steps. The system ensures that such
processingchangeovertime. dependencies hold when the steps execute. In addition to
Golab et al. [53] propose two stronger serialization the relaxed isolation, ConTracts provide relaxed atomicity
properties with ordering guarantees. The first is called so that a ConTract may be interrupted and re-instantiated.
window-serializable,whichrequiresaread-onlytransaction In the case of a failure, the state of the ConTract must
toperformareadeitherstrictlybeforeawindowisupdated be restored and its execution may continue. Due to its
or when all sub-windows of the window are updated. The advantage for fault tolerance, the contract model may be
second is called latest-window-serializable, which allows adoptedinTSPSs,butweareunawareofanyrelatedworks.
a read, only on the latest version of the window, i.e., Vidyasankar et al. [121] argue that strict ACID and
after the window has been completely updated. Instead streaming properties are inappropriate for TSP in the
of always enforcing ordering constraints, FlowDB [14] emerging IoT environment, since triggers and triggered
enables developers to optionally ensure that the effects transactions may be executed in distinct autonomous sites

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 11  |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
“faraway”fromoneanother.Consequently,theydistinguish
|            |          |            |           |              |      |           |        |     |     | A   |     | B   |     |     |     |
| ---------- | -------- | ---------- | --------- | ------------ | ---- | --------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
| between    | triggers | and        | triggered | transactions |      | by        | atomic |     |     |     |     |     |     |     |     |
| unit. They | also     | introduced |           | the term     | weak | atomicity | for    |     |     |     |     |     |     |     |     |
C
| composite | service | executions. |     | These | relaxed | atomicity | and |     |     |     |     |     |     |     |     |
| --------- | ------- | ----------- | --- | ----- | ------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
isolationpropertiescanbeusefulfortheIoT.Forexample,
| the healthcare |     | domain | may | require | stronger |     | atomicity, |     |     |     |     |     |     |     |     |
| -------------- | --- | ------ | --- | ------- | -------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
whereascomfortablehomesandofficesmaytolerateweaker Fig.3:Exampleoftimestampassignmentdilemma.
atomicity.Later,Vidyasankaretal.[122]furtherrelaxedthe
propertiestoincludepartialorderingsandcompletions.
|     |     |     |     |     |     |     |     | is then       | set to | be the     | same    | as the          | timestamp        |          | of its |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | ------ | ---------- | ------- | --------------- | ---------------- | -------- | ------ |
|     |     |     |     |     |     |     |     | corresponding |        | triggering | event.  | When            | all transactions |          | are    |
|     |     |     |     |     |     |     |     | generated     | by     | external   | events, | the transaction |                  | schedule | is     |
4.4 RemarksconcerningTransactionalPropertiesinTSP
|     |     |     |     |     |     |     |     | aligned | with | an external | event | sequence, | to  | satisfy | the |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---- | ----------- | ----- | --------- | --- | ------- | --- |
eventorderingconstraint.However,adilemmaariseswhen
| The transactional |             | properties |               | in TSP     | are         | far more          | flexible    |              |           |               |           |                      |            |                |        |
| ----------------- | ----------- | ---------- | ------------- | ---------- | ----------- | ----------------- | ----------- | ------------ | --------- | ------------- | --------- | -------------------- | ---------- | -------------- | ------ |
|                   |             |            |               |            |             |                   |             | transactions | can       | also be       | generated | by                   | internal   | events         | (i.e., |
| and diverse       | than        | the        | conventional  |            | transaction |                   | processing  |              |           |               |           |                      |            |                |        |
|                   |             |            |               |            |             |                   |             | outputs      | generated | by operators) |           | with                 | timestamps | assigned       |        |
| paradigm,         | where       | an agreed  | standard      |            | has         | been established. |             |              |           |               |           |                      |            |                |        |
|                   |             |            |               |            |             |                   |             | according    | to        | input events, | as        | illustrated          | in         | Figure         | 3. In  |
| We argue          | that        | it is not  | wise          | to devise  | the         | same              | standard    |              |           |               |           |                      |            |                |        |
|                   |             |            |               |            |             |                   |             | the DAG      | each      | operator      | can       | produce              | output     | streams        | and    |
| properties        | for         | TSP,       | given         | that there | is          | great             | diversity   |              |           |               |           |                      |            |                |        |
|                   |             |            |               |            |             |                   |             | generate     | stream    | transactions. |           | Suppose              | operator   | A receives     |        |
| in stream         | application |            | requirements. |            | That        | said,             | it is still |              |           |               |           |                      |            |                |        |
|                   |             |            |               |            |             |                   |             | input event  | e         | and generates |           | two events           | e          | and e(cid:48), | that   |
| desirable         | to devise   | a          | standard      | that       | summarizes  |                   | both the    |              |           |               |           |                      | a          |                | a      |
|                   |             |            |               |            |             |                   |             | are passed   | to        | operators     | B         | and C, respectively. |            | Further,       |        |
commonandrepresentativepropertiesofafuturesystemor
|     |     |     |     |     |     |     |     | supposeoperatorCprocessese |     |     |     | ,generatese |     | asanoutput, |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | ----------- | --- | ----------- | --- |
application that can later referenced. We hope this survey a c
|     |     |     |     |     |     |     |     | and then | passes | e c to | operator | B. Now, | let | us assume |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------ | ------ | -------- | ------- | --- | --------- | --- |
willinspirethedevelopmentofsuchastandardforTSP.In
|                                                     |     |     |     |     |     |     |     | operator         | B processes |        | two events | e and              | e and | generates    |     |
| --------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------------- | ----------- | ------ | ---------- | ------------------ | ----- | ------------ | --- |
| thefollowing,wediscusstwoimportantremarksconcerning |     |     |     |     |     |     |     |                  |             |        |            | a                  | c     |              |     |
|                                                     |     |     |     |     |     |     |     | two transactions |             | txn ea | and txn    | ec , respectively. |       | In addition, |     |
transactionalpropertiesinTSPSs.
|     |     |     |     |     |     |     |     | operator | C processes |     | event | e(cid:48) and generates |     | transaction |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | --- | ----- | ----------------------- | --- | ----------- | --- |
a
txn(cid:48)
Remark1 (Failure of Concurrency Control Protocols) . On the one hand, txn ea must be committed jointly
ea
withtxn ,forotherwisetheeventorderingconstraintwould
| Conventionalconcurrencycontrol(CC)protocols,whichare |     |     |     |     |     |     |     |     | ec  |     |     |     |     |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
widely used in OLTP database systems, fail to guarantee be violated. On the other hand, txn ec cannot be generated
|                                                      |     |     |     |     |     |     |     | beforetxn(cid:48) | committed,forotherwisethiswouldviolatethe |     |     |     |     |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ----------------- | ----------------------------------------- | --- | --- | --- | --- | --- | --- |
| thetransactionalpropertiesofTSPSs.Toillustratewhy,we |     |     |     |     |     |     |     |                   | ea                                        |     |     |     |     |     |     |
useaconventionaltimestamp-orderingconcurrencycontrol operator ordering constraint, which means txn ea is unable
|          |      |       |          |         |             |     |        | to be committed. |     | The | system | then runs | into | a deadlock |     |
| -------- | ---- | ----- | -------- | ------- | ----------- | --- | ------ | ---------------- | --- | --- | ------ | --------- | ---- | ---------- | --- |
| (T/O CC) | [28] | as an | example. | Similar | discussions |     | can be |                  |     |     |        |           |      |            |     |
txn(cid:48)
also found in a prior work [125]. Let txn =write(k1,v1) situation, where txn ea and are infinitely waiting for
|         |              |     |        |          |     | 1             |     |            |     |               |     | ea        |                |     |     |
| ------- | ------------ | --- | ------ | -------- | --- | ------------- | --- | ---------- | --- | ------------- | --- | --------- | -------------- | --- | --- |
|         |              |     |        |          |     |               |     | each other | to  | be committed. |     | There are | two approaches |     | to  |
| and txn | 2 = read(k1) |     | be two | distinct |     | transactions. | For |            |     |               |     |           |                |     |     |
simplicity, let us assume that there are only these two prevent this dilemma, 1) an additional ordering constraint
canbeenforcedbetweenoperatorsBandC,or2)different
| transactions | in  | the system. | If  | txn 2 | .ts >txn | 1 .ts, | then both |     |     |     |     |     |     |     |     |
| ------------ | --- | ----------- | --- | ----- | -------- | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
,e(cid:48)
txn will be successfully committed. However, their serial timestampscouldbeassignedtothegeneratedevents:e a ,
a
|                 |     |        |                               |     |     |     |     | and e . | However, | to date, | we  | are not aware | of  | any general |     |
| --------------- | --- | ------ | ----------------------------- | --- | --- | --- | --- | ------- | -------- | -------- | --- | ------------- | --- | ----------- | --- |
| orderwouldbetxn |     | 2 →txn | 1 ,whichviolatestheeventorder |     |     |     |     | c       |          |          |     |               |     |             |     |
constraint(i.e.,txn willwronglyreadtheoriginalvalueof efficientsolutiontoaddresssuchadilemma.
2
| k1). On         | the other | hand,      | if txn   | 2 .ts<txn | 1 .ts, | then | txn 2 will |     |     |     |     |     |     |     |     |
| --------------- | --------- | ---------- | -------- | --------- | ------ | ---- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
| be successfully |           | committed. | However, |           | txn    | will | be aborted |     |     |     |     |     |     |     |     |
1
5 ExecutionMechanismsinTSPSs
asthewriteswillcometoolate.Abortingatransactionthat
representsanundoofanexternallyvisibleoutputoraction
|         |               |     |        |               |     |            |     | The execution |     | mechanisms |     | in today’s | TSPSs | serve | to  |
| ------- | ------------- | --- | ------ | ------------- | --- | ---------- | --- | ------------- | --- | ---------- | --- | ---------- | ----- | ----- | --- |
| may not | be acceptable |     | in TSP | applications. |     | Similarly, | in  |               |     |            |     |            |       |       |     |
otherconventionalCCprotocols,eithertheresultsareinthe ensure that transactional properties are met. In particular,
atomicityisachievedvialogging(Section5.1),consistency
wrongserialorderoroneoftransactionshastobeaborted,
which eventually will result in the wrong serial order upon is attained via integrity constraints (Section 5.2), isolation
|     |     |     |     |     |     |     |     | (Section | 5.3) | is enabled | via | concurrency |     | control, | and |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ---- | ---------- | --- | ----------- | --- | -------- | --- |
arestart.Inotherwords,conventionalCCprotocolsarenot
durability(Section5.4)isaccomplishedviafaulttolerance.
yetreadyforsuchevent-driventransactionexecution.
|         |                                           |     |     |     |     |     |     | Moreover, | the | streaming-specific |     | properties | (e.g., | operator |     |
| ------- | ----------------------------------------- | --- | --- | --- | --- | --- | --- | --------- | --- | ------------------ | --- | ---------- | ------ | -------- | --- |
| Remark2 | (TimestampAssignmentDilemma)Naturally,one |     |     |     |     |     |     |           |     |                    |     |            |        |          |     |
orderingconstraint,eventorderingconstraint,deliverability)
couldassumethatatransactiontriggeredbyacorresponding are also met by each of the aforementioned mechanisms.
input event can instantaneously take effect once the event For example, fault tolerance not only preserves durability
occurs[125].Inthissetting,thetimestampofthetransaction but also provides deliverability and satisfies the two

| 12  |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
orderingconstraints.Next,wediscusseachoftheexecution correct version of a state, the system needs to track the
mechanisms: logging, integrity constraints, concurrency progressofeachstubandpresenttheappropriateview(i.e.,
control,andfaulttolerance. a subset of tuples) to each of the stubs. This is achieved
viaitslocal-timestamp-basedexecutionmodelwithaglobal
|     |     |     |     |     |     |     | schedule | that | coordinates |     | the successive |     | execution | of the |
| --- | --- | --- | --- | --- | --- | --- | -------- | ---- | ----------- | --- | -------------- | --- | --------- | ------ |
5.1 Logging
|                  |     |         |        |           |      |          | individual  | operators |      | via time     | slot | assignments. |        | Batches of |
| ---------------- | --- | ------- | ------ | --------- | ---- | -------- | ----------- | --------- | ---- | ------------ | ---- | ------------ | ------ | ---------- |
|                  |     |         |        |           |      |          | tuples with | the       | same | timestamp    |      | are executed |        | atomically |
| TSP applications |     | need to | ensure | atomicity | when | updating |             |           |      |              |      |              |        |            |
|                  |     |         |        |           |      |          | to ensure   | progress  |      | correctness, | and  | a            | simple | lock-based |
shared states. Barriers to achieving atomicity, include transactionalprocessingmechanismisimplicitlyinvolved.
| system failures | or  | when | user-defined |     | transactions | abort |     |         |       |     |      |        |       |           |
| --------------- | --- | ---- | ------------ | --- | ------------ | ----- | --- | ------- | ----- | --- | ---- | ------ | ----- | --------- |
|                 |     |      |              |     |              |       | An  | earlier | study | by  | Wang | et al. | [125] | describes |
during processing. Most prior works on TSP either do not a strict two-phase locking (S2PL)-based algorithm that
| mention their | logging | mechanism |     | [14,134] | or  | they rely on |     |     |     |     |     |     |     |     |
| ------------- | ------- | --------- | --- | -------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
allowsmultiplestatetransactionstorunconcurrentlywhile
the logging mechanism provided by their storage systems maintaining both ACID and streaming properties. Unlike
(e.g.,traditionaldatabasesystems[78]).
|     |     |     |     |     |     |     | the original     | S2PL | [27]  | algorithm,    |           | Wang      | et al. | [125] lock  |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | ---- | ----- | ------------- | --------- | --------- | ------ | ----------- |
|     |     |     |     |     |     |     | each transaction |      | ahead | of            | all query | and       | rule   | processing. |
|     |     |     |     |     |     |     | In this process, |      | each  | transaction’s |           | timestamp | is     | compared    |
5.2 IntegrityConstraints
|            |              |           |     |               |     |             | against         | a monotonically |      | increasing   |           | counter | to     | ensure that |
| ---------- | ------------ | --------- | --- | ------------- | --- | ----------- | --------------- | --------------- | ---- | ------------ | --------- | ------- | ------ | ----------- |
|            |              |           |     |               |     |             | the transaction |                 | with | the smallest | timestamp |         | always | obtains     |
| Typically, | applications | prescribe |     | the integrity |     | constraints |                 |                 |      |              |           |         |        |             |
alockfirst.Thereby,guaranteeingaccesstotheproperstate
thataretobeimposed,suchasaforeignkeyconstraintona
|     |     |     |     |     |     |     | sequence. | In this | process, | once | lock | insertion |     | is complete, |
| --- | --- | --- | --- | --- | --- | --- | --------- | ------- | -------- | ---- | ---- | --------- | --- | ------------ |
relation,orasetofbusinessrules.Forexample,Meehanet
|     |     |     |     |     |     |     | the system | will | increase | the | counter, | and | then | allow the |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---- | -------- | --- | -------- | --- | ---- | --------- |
al.[77]discussthestreamETLscenario,whereTSPSsneed
|     |     |     |     |     |     |     | next transaction |     | to  | proceed | irrespective |     | of whether | the |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | --- | ------- | ------------ | --- | ---------- | --- |
topreserveforeignkeyconstraintsamongtables.
transactionwasfullyprocessed.Tofulfiltheeventordering
| In relational |     | database | management |     | systems, | integrity |              |      |          |       |     |          |         |          |
| ------------- | --- | -------- | ---------- | --- | -------- | --------- | ------------ | ---- | -------- | ----- | --- | -------- | ------- | -------- |
|               |     |          |            |     |          |           | constraints, | read | or write | locks | are | strictly | invoked | in their |
constraintsariseduringthedesignoftherelationalschema
triggeringeventorder.However,thelockingmechanismhas
| and are           | usually | specified       | in SQL. | Via          | this | approach,   |                |     |               |     |     |       |        |              |
| ----------------- | ------- | --------------- | ------- | ------------ | ---- | ----------- | -------------- | --- | ------------- | --- | --- | ----- | ------ | ------------ |
|                   |         |                 |         |              |      |             | to synchronize |     | the execution |     | for | every | single | input event, |
| the specification |         | and enforcement |         | of integrity |      | constraints |                |     |               |     |     |       |        |              |
whichmaynegativelyimpactsystemperformance.
| are tightly    | bound         | to the      | relational     | model.     | Some     | TSPSs       |              |            |             |             |              |             |                  |             |
| -------------- | ------------- | ----------- | -------------- | ---------- | -------- | ----------- | ------------ | ---------- | ----------- | ----------- | ------------ | ----------- | ---------------- | ----------- |
|                |               |             |                |            |          |             | Oyamada      |            | et al.      | [87]        | contribute   |             | three            | pessimistic |
| are built      | on extensions |             | to traditional |            | database | systems     |              |            |             |             |              |             |                  |             |
|                |               |             |                |            |          |             | transaction  | execution  |             | algorithms: |              | synchronous |                  | transaction |
| (e.g., S-Store | [78]),        | which       | naturally      |            | offer    | support for |              |            |             |             |              |             |                  |             |
|                |               |             |                |            |          |             | sequence     | invocation |             | (STSI),     | asynchronous |             |                  | transaction |
| integrity      | constraints.  | However,    |                | since many | TSPSs    | (e.g.,      |              |            |             |             |              |             |                  |             |
|                |               |             |                |            |          |             | sequence     | invocation |             | (ATSI),     |              | and         | order-preserving |             |
| TStream        | [134]) are    | not         | or not         | only based | on       | relational  |              |            |             |             |              |             |                  |             |
|                |               |             |                |            |          |             | asynchronous |            | transaction |             | sequence     | invocation  |                  | (OPATSI).   |
| algebra or     | SQL,          | they simply |                | do not     | offer    | support for |              |            |             |             |              |             |                  |             |
STSIprocessestransactionstriggeredbyeventstreamsone
| integrity | constraints. | Thus, | to  | ensure | data | integrity the |           |     |               |     |         |               |     |           |
| --------- | ------------ | ----- | --- | ------ | ---- | ------------- | --------- | --- | ------------- | --- | ------- | ------------- | --- | --------- |
|           |              |       |     |        |      |               | at a time | and | the execution |     | results | are naturally |     | generated |
burdenfallsontheapplicationdeveloper.
|     |     |     |     |     |     |     | following   | the       | event     | arrival | sequence.         |             | ATSI removes | the       |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --------- | --------- | ------- | ----------------- | ----------- | ------------ | --------- |
|     |     |     |     |     |     |     | blocking    | behaviour |           | of STSI | by asynchronously |             |              | spawning  |
|     |     |     |     |     |     |     | new threads |           | that wait | for     | the               | transaction | to           | complete. |
5.3 ConcurrencyControl
|     |     |     |     |     |     |     | OPATSI | extends | ATSI | via | a priority |     | queue | to further |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------- | ---- | --- | ---------- | --- | ----- | ---------- |
guaranteetheorderoftheresults.
Concurrencycontrol(CC)isessential,toensurecorrectness
in systems where interactions between concurrent accesses FlowDB/TSpoon [14,15] implement a single-version
|             |     |            |     |             |     |            | lock-based | mechanism |     | and | work | at a | more | fine-grained |
| ----------- | --- | ---------- | --- | ----------- | --- | ---------- | ---------- | --------- | --- | --- | ---- | ---- | ---- | ------------ |
| and updates | are | prevalent. | In  | particular, | CC  | is related |            |           |     |     |      |      |      |              |
to the isolation property. In the context of TSP, various granularity of the single “key, value” pair stored by a state
|               |     |           |          |     |        |           | operator. | When | an  | ordering | constraint |     | is required, | they |
| ------------- | --- | --------- | -------- | --- | ------ | --------- | --------- | ---- | --- | -------- | ---------- | --- | ------------ | ---- |
| CC mechanisms |     | have been | proposed | to  | ensure | a correct |           |      |     |          |            |     |              |      |
schedule for concurrent state transactions. These can be introduce an additional sequencer component before each
statefuloperatorinastreamquerygraph.Thisconsistsofa
| classified | into five | approach | types: | single-version |     | lock- |     |     |     |     |     |     |     |     |
| ---------- | --------- | -------- | ------ | -------------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
based, multi-version lock-based, static partition-based, singleinstanceandreorderstransactionsbyID.
| dynamic | partition-based, |     | and optimistic. |     | Next, | we discuss |     |     |     |     |     |     |     |     |
| ------- | ---------------- | --- | --------------- | --- | ----- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
eachoftheseapproaches.
5.3.2 Multi-VersionLock-basedApproach
5.3.1 Single-versionLock-basedApproach Wangetal.[125]proposeanalgorithmcalledLWM(Low-
Water-Mark),whichreliesonthemulti-versioningofshared
In STREAM [57], synopses allow different operators to states.LWMleveragesaglobalsynchronizationprimitiveto
share common states. To guarantee operators view the guardthetransactionprocessingsequence:writeoperations

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     | 13  |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Execution Mechanism
Concurrency Control
| Logging |     | Integrity |     |     |     |     |     |     |     | Fault Tolerance |     |     |
| ------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- |
Constraints Singleversion Multiversion Static Partition- Dynamic Optimisitc Snapshot
|     |     |     | Lock-based | Lock-based | based | Partition-based |     | Approach | Isolation |     |     |     |
| --- | --- | --- | ---------- | ---------- | ----- | --------------- | --- | -------- | --------- | --- | --- | --- |
Fig.4:Executionandfaulttoleranceartifactsoftransactionalstreamprocessing.
must be performed monotonically in event order, but read conflict. The schedule is conflict-serializable if and only if
operations are allowed to execute as long as they are able the precedence graph is acyclic. They further propose to
to read the correct version of the data (i.e., its timestamp re-order the read operations within transactions to reduce
is earlier than the LWM). The key differences between the number of aborted transactions and thereby yield a
LWMandthetraditionalmulti-versionconcurrencycontrol betterschedule.FlowDB/TSpoon[14,15]alsointroducean
(MVCC) scheme are two-fold. First, MVCC aborts and optimistictimestamp-basedprotocol.Thesesystemsdonot
then restarts a transaction when an outdated write occurs. lock resources, but rather use timestamps to ensure that
In contrast, LWM ensures that writes are permitted strictly transactionsalwaysread/updateversionsthatareconsistent
in their timestamp sequence, thereby preventing outdated with the desired isolation level. When this is not possible,
writes. Second, MVCC assumes that the timestamp of a transactionsareabortedandrescheduledforexecution.
transactionissystemgenerateduponreceipt,whereasLWM
setsthetimestampofatransactiontothetriggeringevent.
5.3.6 SnapshotIsolationApproach
5.3.3 StatePartition-basedApproach
|              |        |     |           |              |          | A number    | of TSPSs | employ | snapshot |               | isolation | [12,31,44,    |
| ------------ | ------ | --- | --------- | ------------ | -------- | ----------- | -------- | ------ | -------- | ------------- | --------- | ------------- |
|              |        |     |           |              |          | 46,56] with | the      | goal   | to split | a stream      | into      | a sequence    |
| S-Store [78] | splits | the | streaming | applications | internal |             |          |        |          |               |           |               |
|              |        |     |           |              |          | of bounded  | chunks   | and    | apply    | the semantics |           | of a database |
states into multiple disjoint partitions. The computation transaction to each chunk, i.e., putting the operation on
| on each sub-partition |     |     | is performed | by a single | thread. |              |     |               |     |          |     |               |
| --------------------- | --- | --- | ------------ | ----------- | ------- | ------------ | --- | ------------- | --- | -------- | --- | ------------- |
|                       |     |     |              |             |         | a data chunk | in  | a transaction |     | boundary | to  | yield a state |
To guarantee state consistency, S-Store uses partition-level snapshot. In this way, processing a sequence of data
| locks to synchronize |     | access. | However, | the state | partition- |                  |     |            |     |       |            |            |
| -------------------- | --- | ------- | -------- | --------- | ---------- | ---------------- | --- | ---------- | --- | ----- | ---------- | ---------- |
|                      |     |         |          |           |            | chunks generates |     | a sequence | of  | state | snapshots. | Go¨tze and |
based approach only performs well on transactions that Sattler [56] present a snapshot isolation approach for TSP.
can be perfectly partitioned into disjoint groups, given Eachstatehasmultipleversionsofvaluesstoredasacommit
that acquiring partition-level locks on cross-partition states timestamp, delete timestamp, and value. Consequently,
significantlyimpactsperformanceduetotheoverhead. readers can access the latest version of a state using the
commitanddeletetimestamps.
5.3.4 TransactionPartition-basedApproach
TStream [134] is a recently proposed TSP system that 5.4 FaultTolerance
| adopts transaction |     | decomposition |     | to improve | stream |     |     |     |     |     |     |     |
| ------------------ | --- | ------------- | --- | ---------- | ------ | --- | --- | --- | --- | --- | --- | --- |
transaction processing performance on modern multicore FailureeventsinSPEscancauseanapplicationtoblockor
processors. Despite the relaxed isolation properties, produceerroneousresults.Streamingapplicationstypically
TStream ensures serializability, as all conflict operations run for indefinite periods, which increases the chance
(being decomposed from the original transactions) are of service disruptions due to unexpected system failures.
executedsequentiallyasdeterminedbytheeventsequence. Hence, a large number of fault tolerance approaches have
TStream provides a novel no-lock two-phase execution been proposed for SPEs. These approaches often have
approachtoguaranteethecorrectnessoftransactionalstate their own particular performance priorities (e.g., runtime
accesses. Furthermore, two modules are implemented in overhead, recovery efficiency). For a general discussion
TStream,therebyeliminatingcross-processcommunication on fault tolerance mechanisms in SPEs, readers should
overhead.However,TStreamonlyrunsonasinglenode. referenceanearliersurvey[116].
|     |     |     |     |     |     | Although | modern |     | SPEs usually |     | offer | fault-tolerance |
| --- | --- | --- | --- | --- | --- | -------- | ------ | --- | ------------ | --- | ----- | --------------- |
5.3.5 OptimisticApproach mechanisms, they do not always satisfy the fault tolerance
requirementsofTSP.Intheeventofafailure,TSPSsrequire
window serializable
Targeting properties, Golab et al. [53] alloftheirstatestoberecovered(includingtheinput/output
propose a scheduler that executes window movements streams, operator states, and shared mutable states), such
optimistically and uses serialization graph testing (SGT) that any committed transactions remain stable. In addition,
to abort any read-only transactions that cause a read-write anyuncommittedtransactionsarenotpermittedtoaffectthis

14 ShuhaoZhang,JuanSoto,andVolkerMarkl
Design Aspects 6.1 LanguagesandAPIs
Language and API Representation of State Stream processing languages facilitate the development
of stream processing applications. They simplify
Declarative Imperative Relations Key-Value pair common coding tasks and make code more readable and
System Architectures maintainable.Additionally,theircompilersareabletocatch
Extending a Embedding a DB Composing a DB programming errors and optimize code transformations.
DB into a SPE and a SPE However, unlike relational databases, where SQL is the
standardprogramminglanguagewithnumerousSQL-based
Fig.5:DesignAspectsofTSPSs.
APIs, it is not yet clear what the APIs for TSPSs should
be, largely due to the absence of a standard transaction
model. Next, we turn our attention to existing languages
state. A transaction that has begun, but has not yet been
and APIs for TSPSs as well as some of the representative
committedshouldbeundoneandreinvokedwiththeproper
APIsdesignedforSPEsthatmaybeappliedtoTSPSs.
input parameters, once the system is stable again. This
requires an upstream backup and an undo/redo mechanism
similar to an ACID-compliant database. Furthermore, to
6.1.1 DeclarativeLanguages
satisfy streaming properties, the recovered states should be
equivalenttotheonethatwasunderconstructionwhenthere
Almost every attempt to create a standard programming
was no failure. To achieve this, an order-aware recovery
languageforstreamshasbeenanextensionofSQL[6,20,50,
mechanismisrequired[105].However,thewidelyadopted
57,81].Forexample,thewell-knownSTREAMsystem[20,
recoveryoperationinmodernSPEs,especially,theparallel
57,81] supports a declarative query language called CQL
recovery operation, might lead to different transactional
(ContinuousQueryLanguage),whichisdesignedtohandle
states as there are no guarantees on the event processing
bothrelationaldataanddatastreams.InCQL,thetraditional
sequenceduringrecovery.
from clause in SQL is defined for both relations and
streams. In addition, in CQL, streams and time-varying
relations are accepted as inputs and treated uniformly
as relations. Moreover, CQL incorporates the notion of
5.5 RemarksConcerningExecutionMechanismsinTSP time: converting streams into relations via sliding window
operators and converting relations into streams via three
To create a hybrid system, where stream queries can operators,i.e., Istream, Dstream, and Rstream. Istream and
refer to both 1) static data stored in a database and 2) Dstream convert a relation to stream whenever there is an
stream analysis results (whether intermediate or final), an insertion or deletion, respectively. The Rstream operator
executionmechanismisneededtoallowstreamprocessing maintains the entire current state of its input relation and
to periodically “commit” results and make them visible. outputsallofthetuplesasinsertionsateachtimestep.
However, designing an efficient execution mechanism
Like STREAM, Coral8’s [6] continuous computation
for TSP is difficult as it must satisfy not only the
language (CCL), which has a SQL-like syntax, supports
ACID properties but also the additional three streaming
both data streams and event streams. In addition,
properties.Existingworksoftenimplicitlyoverlookcertain
CCL offers support for continuous queries as well as
propertiesintheirexecutionmechanismdesign,toimprove
primitive/composite events with temporal and windowing
performance. This should be made more transparent so
capabilities over streams with access to persistent data
that users can be more aware of which properties are not
sources. Due to Franklin et al. [50], TruSQL is yet
guaranteed in adopting a TSPSs. Unfortunately, as there is
another relational stream query language. In TruSQL,
currentlynostandarddefinitionofTSP,itisdifficultforthe
stream processing is fully integrated into SQL, including
communitytoreachaconsensus.
persistence. Moreover, in TruSQL, the notion of a stream
(i.e.,anorderedunboundedrelation)hasbeenaddedtothe
standardrelationalmodel.
The aforementioned relational stream query languages
6 DesignAspectsofTSPSystems are well-defined, semantically precise, and well-suited for
TSP, especially when handling a single query at a time.
In this section, we discuss three major design aspects of However,theyareunabletocorrectlyexpresstheinteraction
TSPsystems:languagesandAPIs,systemarchitectures,and among queries, which can lead to ambiguous execution
representationsofstate. results. The original paper [21] expresses the linear road

ASurveyonTransactionalStreamProcessing 15
benchmark as a single query with multiple interdependent in combination with data storage and analysis frameworks,
subqueries,whichcannoteasilybeparallelized. suchasadatabasemanagementsystem(DBMS)[8]tobuild
Potentially,therearetwowaystoaddressthisissue.One software architectures that combine data storage, retrieval,
istoexplicitlyexpresstheproperinteractionamongqueries and mining [14]. To meet this goal efficiently in TSPSs,
(viastoredprocedures),whichwouldrequirethelanguageto there are three approaches to form a TSP system: 1)
beamixtureofdeclarativeandimperativestyles.Theother extendingaDBMS,2)embeddingaDBMSinanSPE,and
istoexpresstheinteractionconstraintsasseparaterules(like 3)composingaDBMSandanSPE.Next,wediveintoeach
triggers). To better understand the trade-offs between the oftheseapproaches.
twoapproaches,furtherinvestigationiswarranted.
6.2.1 ExtendingaDBMS
6.1.2 ImperativeLanguages
To provide support for TSP, one option is to extend an
Although a SQL-like declarative language provides a
existing database system, as depicted in Figure 6a. Next,
succinct and simple solution to many streaming problems,
we describe several systems that employ this approach,
theoperationalflowofanimperativelanguage[17]ismore
includingDataCell,TruCQ,MaxDBMS,andS-Store.
apt to express state abstractions and complex application
As early as 2009, Liarou and Kersten [74] criticized
logic.
SPEs for lacking the power of fully-fledged database
In Aurora [13], query plans are constructed via a
systems. To address this problem, they proposed DataCell,
graphical interface by arranging boxes (representing query
an SPE built on top of a modern database kernel that
operators) and joining them with directed arcs to specify a
immediately stores stream tuples into specially designed
uniformdataflow.AmongtheoperatorsinAurora,threeare
tables called baskets. Based on DataCell, continuous
noteworthy:map,resample,anddrop.Arisingasasecond-
queries are evaluated as if they were conventional one-
order function in functional programming languages, and
time queries. Similarly, the Truviso Continuous Analytics
popularized in the MapReduce programming model (for
system[50],laterknownasTruCQ(acommercialproduct),
scalable data processing), the map operator applies a user-
also follows the DBMS extension approach. In this
defined function to each input item. The resample operator
case, the open source PostgreSQL DBMS [109] was
interpolates the values of missing items within a window,
extended to enable the continuous analysis of streaming
whereas the drop operator randomly drops items whenever
data and tackle the problem of low latency query
theinputrateistoohigh.LikeAurora,STREAMallowsthe
evaluation over massive data volumes. By integrating
directinputofqueryplansexpressedasadataflow.
traditional relational query processing and streaming,
Influenced by MapReduce-like APIs, the majority of
TruCQ employs a stream-relational database architecture,
recentopen-sourcestreamingsystems,suchasFlink,embed
which runs SQL queries continuously and incrementally
functional/fluent APIs into general-purpose programming
overincomingdata.Furthermore,TruCQsqueryprocessing
languages, to hard code Aurora-like dataflows. This
significantly outperforms traditional store-first-query-later
design is also inherent in current TSPSs. For example,
database technologies, given that query evaluation has
FlowDBMS [14,15] extends the Flink data stream API
already been initiated upon the arrival of the first tuples.
and follows an imperative language design to support
Moreover,TruCQallowstheevaluationofone-timequeries,
TSP. In FlowDBMS users must explicitly declare shared
continuousqueries,andcombinationsofboth.
mutablestatesandusetwoprimitives,openTransactionand
In order to integrate heterogeneous SPEs, DBMSMSs,
closeTransaction to define the boundaries of transactional
andstoragedevices,Botanetal.[30]developedMaxStream,
subgraphs.TStream[134]isyetanotherexampleofaTSPSs
anSPEthatextendsMaxDBMS[4],atraditionalDBMSMS.
withimperativeAPIsthatprovidealistofuser-implemented
As the last example, S-Store (a recent TSPSs) due to
andsystem-providedAPIswithineachoperator–following
Meehan et al. [78] leverages the existing transaction
the Aurora approach. User-implemented APIs draw on
processing capabilities in H-Store [63] – a distributed
application-specificrequirements,whereassystem-provided
OLTP-DBMS.InS-Store,astreamqueryisalistofstored
APIs draw on system libraries. When employing a user-
procedures (each of which can be viewed as a stream
implemented API to express stream transactions, users can
operator), streams and windows are represented as time-
invokesystem-providedAPIstogainaccesstosharedstates.
varying tables, and triggers enable push-based processing
overstreamsandwindows.
6.2 SystemArchitectures In S-Store, triggers are associated with either a stream
table or a window table. When new tuples are appended to
Fromtheaforementionedapplicationusecases,weobserve a table, downstream processing is automatically activated.
that TSP applications typically require SPEs to be used A limitation of this approach is that it cannot fully support

| 16  |     |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- |
Stream query expressed as
|              |     | a list of store-procedures |     |     |              |     |     |     |     |     |     | Client |     |     |
| ------------ | --- | -------------------------- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- | ------ | --- | --- |
| stream input |     |                            |     |     | stream input |     |     |     |     |     |     |        |     |     |
...
|                      |     | SP1           | SP2 |     |     |       | Stream Processing Engine |              |     |                          | Systems Federator |        |          |     |
| -------------------- | --- | ------------- | --- | --- | --- | ----- | ------------------------ | ------------ | --- | ------------------------ | ----------------- | ------ | -------- | --- |
| SP: Stored Procedure |     |               | ... |     |     |       |                          | state access |     |                          |                   |        |          |     |
|                      |     |               |     |     |     |       |                          |              |     | stream input             |                   | output |          |     |
| triggers             |     | SQL SQL       |     |     |     |       |                          |              |     |                          |                   |        |          |     |
|                      |     |               |     |     |     | Store | Access Management        |              |     |                          |                   |        | ...      |     |
|                      |     | OLTP Database |     |     |     |       |                          |              |     | Stream Processing Engine |                   |        | Database |     |
(a)ExtendingaDBMS (b)EmbeddingaDBMSinaSPE (c)ComposingaDBMSandanSPE
Fig.6:AlternativesystemarchitecturesforTSPSs.
native or hybrid stream processing applications efficiently, propose embedding a key-value store to manage shared
particularlythosethatdonotoronlypartiallyrequireACID mutable states in Flink. Similarly, TStream [134] adopts
properties (e.g., when only a subset of operators require a modular design that includes two modules. One is a
transactional support). Furthermore, stream applications stream module that is based on BriskStream [104], a
are usually expressed as a DAG of operators for which highlyoptimizedgeneral-purposeSPEwithanarchitecture
there is at least one topological ordering among operators. similar to Storm. The other is a state module based on
However,thecurrenttriggering-baseddesignsolelypermits the Cavalia [129] database, that manages state access via
a single topological sort [78], which limits optimization system-providedAPIs.
opportunities.
There are two fundamental issues involved in this 6.2.3 ComposingaDBMSandanSPE
| architectural | design. | First, | the | existing | store-first-query- |     |     |     |     |     |     |     |     |     |
| ------------- | ------- | ------ | --- | -------- | ------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
later approach although suitable for large databases To provide support for stream processing, a third option
is ill-suited for stream processing applications. Thus, is to compose a DBMS and an SPE, as depicted in
most SPEs employ a query-on-the-fly approach [106] Figure 6c. Although feasible, this approach is comparably
instead. Second, supporting stream-native operations (e.g., morecomplexthantheothertwoapproaches.Inparticular,
windowing operations) in databases is nontrivial. As a it imposes an additional burden on developers: the
result, implementing stream processing on top of existing difficult task of writing application-specific code to ensure
relationaldatabaseslimitstheperformance.Drawingonthe integration correctness. As a consequence, this approach
linear road benchmark, Chen et al. [43] note that an SPE hinders the design, implementation, maintenance, and
can achieve an order of magnitude higher throughput in evolutionofthesolution.
comparison to Botan et al. [30] who propose extending a In2009,Botanetal.[29]proposedtodecouplestorage
DBMStoanSPE. management from stream processing. As a consequence,
|     |     |     |     |     |     |     |     | they developed |     | the Storage | Manager            |     | for Streams | (SMS), |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ----------- | ------------------ | --- | ----------- | ------ |
|     |     |     |     |     |     |     |     | which provides |     | flexibility | to replace/upgrade |     | the         | system |
6.2.2 EmbeddingaDBMSinanSPE
|     |     |     |     |     |     |     |     | component, | adaptability |     | to specific |     | requirements, | and |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------------ | --- | ----------- | --- | ------------- | --- |
optimizabilityfortunableparameters(e.g.,decidingwhether
Toprovidesupportforstreamprocessing,anotheroptionis
ornottosharestateamongconcurrentstreamoperators).In
| to embed    | a database     | system | in      | an SPE.   | As          | illustrated | in    |                     |     |          |            |               |             |           |
| ----------- | -------------- | ------ | ------- | --------- | ----------- | ----------- | ----- | ------------------- | --- | -------- | ---------- | ------------- | ----------- | --------- |
|             |                |        |         |           |             |             |       | 2012, Botan         | et  | al. [31] | introduced | additional    | concurrency |           |
| Figure 6b,  | a relational   |        | DBMS    | (depicted | as          | a component |       |                     |     |          |            |               |             |           |
|             |                |        |         |           |             |             |       | control mechanisms, |     |          | to refine  | their initial | idea        | and offer |
| that stores | shared-mutable |        | states) |           | is embedded |             | in an |                     |     |          |            |               |             |           |
supportfortransactionalupdates.
| SPE. This | enables | an  | SPE to | support | ordinary |     | stream |     |     |     |     |     |     |     |
| --------- | ------- | --- | ------ | ------- | -------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
applicationswhilealsoprovidingthetransactionalfacilities.
DuetoTSPrequirements,suchasstreamingpropertiesthat
|               |          |                   |     |          |           |         |         | 6.3 RepresentationsofState |                |     |           |           |     |           |
| ------------- | -------- | ----------------- | --- | -------- | --------- | ------- | ------- | -------------------------- | -------------- | --- | --------- | --------- | --- | --------- |
| are not       | provided | in conventional   |     | database |           | systems | [37],   |                            |                |     |           |           |     |           |
| an additional |          | access management |     |          | component |         | must be |                            |                |     |           |           |     |           |
|               |          |                   |     |          |           |         |         | State can                  | be represented |     | as either | relations | or  | key-value |
provided,tolinkastoragecomponenttoanSPE. pairs.Belowwediscusseachrepresentationinturn.
| Aurora         | [13]     | and its       | successor | Borealis | [12]     | both     | use a |                 |     |     |     |     |     |     |
| -------------- | -------- | ------------- | --------- | -------- | -------- | -------- | ----- | --------------- | --- | --- | --- | --- | --- | --- |
| popular        | embedded | key-value     | store,    | Berkeley |          | DBMS     | [85]  | 6.3.1 Relations |     |     |     |     |     |     |
| for relational |          | data storage. | In        | these    | systems, | incoming |       |                 |     |     |     |     |     |     |
data stream tuples can trigger queries in Berkeley DBMS. There are stream processing systems that represent states
Drawing on a model that integrates data management asrelations.RepresentativeexamplesincludeSTREAM,S-
capabilities and stream processing, Affetti et al. [14,15] Store,andTStream.

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     |     |     | 17  |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
InSTREAM[57],stateisrepresentedasatime-varying Lastly,inFlowDBMS/TSpoon[14,15],akey-valuestore
relation that maps a time domain to a finite, but the isalsoemployedandstateismaintainedbyaspecialtypeof
unboundedbagoftuplesadheringtotherelationalschema. stateful stream operator called the state operator. All state
In order to treat relational and streaming data uniformly, accessrequestsmustberoutedtoandsubsequentlyhandled
therearetwooperations:To Tabletoconvertstreamingdata bystateoperatorsdefinedintheapplication.
| to relational         | data,   | and        | To Stream   | to convert         |            | relational   | data     |                                  |           |      |           |        |     |       |
| --------------------- | ------- | ---------- | ----------- | ------------------ | ---------- | ------------ | -------- | -------------------------------- | --------- | ---- | --------- | ------ | --- | ----- |
| to streaming          | data.   | Several    | implicit    | assumptions        |            | are          | made     |                                  |           |      |           |        |     |       |
| about time-varying    |         | relations, |             | such as            | all stream | elements     |          |                                  |           |      |           |        |     |       |
|                       |         |            |             |                    |            |              |          | 6.4 RemarksofAspectsofTSPSystems |           |      |           |        |     |       |
| and related           | updates | are        | timestamped |                    | according  | to           | a global |                                  |           |      |           |        |     |       |
| clock. Unfortunately, |         | this       | is          | often unrealistic, |            | particularly |          |                                  |           |      |           |        |     |       |
|                       |         |            |             |                    |            |              |          | Determining                      | the right | type | of system | design | for | TSPSs |
fordistributedstreamprocessing.
dependsonawiderangeoffactors,includingbothsoftware
Similarly,S-Store[78]doesnotimplementitsownstate
|              |            |        |               |        |            |             |        | and hardware     | perspectives.        |        | For example, |            | determining | a       |
| ------------ | ---------- | ------ | ------------- | ------ | ---------- | ----------- | ------ | ---------------- | -------------------- | ------ | ------------ | ---------- | ----------- | ------- |
| management   | component. |        | Instead,      | shared | states     | represented |        |                  |                      |        |              |            |             |         |
|              |            |        |               |        |            |             |        | suitable         | state representation |        | will         | heavily    | depend      | on a    |
| as relations | are        | stored | in H-Store    | [108]  | and        | S-Store     | relies |                  |                      |        |              |            |             |         |
|              |            |        |               |        |            |             |        | state access     | pattern              | (e.g., | with range   | selection, |             | without |
| on H-Store   | to ensure  | the    | transactional |        | properties | of          | shared |                  |                      |        |              |            |             |         |
|              |            |        |               |        |            |             |        | range selection) | and                  | the    | hardware     | platform   | (e.g.,      | in-     |
states.Lastly,TStream[134]reliesontheCavaliarelational
|     |     |     |     |     |     |     |     | memory, | on disk). A | stream | processing |     | task | typically |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ----------- | ------ | ---------- | --- | ---- | --------- |
database[128]tosupportthestorageofsharedstates.Such
|             |               |               |            |            |                |     |     | runs forever | unless it       | is explicitly |              | terminated | by        | a user. |
| ----------- | ------------- | ------------- | ---------- | ---------- | -------------- | --- | --- | ------------ | --------------- | ------------- | ------------ | ---------- | --------- | ------- |
| an approach | has           | the advantage |            | of reusing | well-developed |     |     |              |                 |               |              |            |           |         |
|             |               |               |            |            |                |     |     | Since both   | input workloads |               | and hardware |            | resources | may     |
| techniques  | in relational |               | databases, | such       | as persistence |     | and |              |                 |               |              |            |           |         |
changeovertimeduringexecution,weenvisionanadaptive
recoverymechanisms.However,unlessweassumethestate
|              |              |                |            |            |           |         |         | or progressive | optimization   |          | approach | is       | more    | suitable. |
| ------------ | ------------ | -------------- | ---------- | ---------- | --------- | ------- | ------- | -------------- | -------------- | -------- | -------- | -------- | ------- | --------- |
| is constant, | we           | must introduce |            | the notion |           | of time | to the  |                |                |          |          |          |         |           |
|              |              |                |            |            |           |         |         | Rather than    | improving      | on a     | single   | TSPSs    | design, | multiple  |
| relation     | given that   | stream         | processing |            | often     | relies  | on both |                |                |          |          |          |         |           |
|              |              |                |            |            |           |         |         | design         | options can be | provided | and      | selected | on      | demand    |
| time and     | the sequence |                | of inputs  | to make    | progress. |         | This is |                |                |          |          |          |         |           |
|              |              |                |            |            |           |         |         | accordingly.   | Deciding       | which    | design   | to pick  | may     | be based  |
somethingthatisnotnaturallycapturedinrelationalmodels.
oneitheracostmodel-basedapproachoralearningmodel-
basedapproach.
6.3.2 Key-ValuePairs
| There are | also | systems | that | represent | states | as key-value |     |     |     |     |     |     |     |     |
| --------- | ---- | ------- | ---- | --------- | ------ | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
pairs. Representative examples include MillWheel [17], 7 AdvancedIssuesforTSPSystems
| Flink with | RocksDBMS, |     | AIM | (Analytics | in  | Motion) | [32], |     |     |     |     |     |     |     |
| ---------- | ---------- | --- | --- | ---------- | --- | ------- | ----- | --- | --- | --- | --- | --- | --- | --- |
andFlowDBMS/TSpoon[14,15]. Beyond relational database systems, the transaction
|              |     |       |       |                |     |       |        | paradigm | serves to ensure |     | the correctness |     | of executions |     |
| ------------ | --- | ----- | ----- | -------------- | --- | ----- | ------ | -------- | ---------------- | --- | --------------- | --- | ------------- | --- |
| In MillWheel |     | [17], | state | is represented |     | as an | opaque |          |                  |     |                 |     |               |     |
byte string that is managed on a per-key basis. In order to in specialized execution engines for varying application
|     |     |     |     |     |     |     |     | domains | such as | transactional |     | memory | [33], | graph |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ------- | ------------- | --- | ------ | ----- | ----- |
storeortransmitthesebytestrings,usersneedtoimplement
serialization and deserialization methods. To ensure data databases [49], distributed key-value stores [11] as well as
integrity is completely transparent to the end user, the streamprocessing[47].Infact,manyworks[14,31,78,125]
persistentstateisbackedbyareplicatedandhighlyavailable have emphasized the need for transactional state
datastore,suchasBigtable[42]orSpanner[48]. management in streaming applications. In particular,
Tosupportsharedqueryablestate,Flink[36]reliesonan these applications typically employ streaming facilities to
persiststateoroffer(nearreal-time)viewsofsharedtables,
LSM-basedkey-valuestoreenginecalledRocksDBMS[5].
Likewise, Go¨tze and Sattler [56] adopt a key-value store andsimultaneouslyemploytransactionalfacilitiestoensure
|                   |     |       |                 |     |                |     |      | a consistent | representation |     | of the | state or | a summary | of  |
| ----------------- | --- | ----- | --------------- | --- | -------------- | --- | ---- | ------------ | -------------- | --- | ------ | -------- | --------- | --- |
| for transactional |     | state | representation. |     | In particular, |     | they |              |                |     |        |          |           |     |
also adopt multi-version concurrency control, where each the shared tables. Although some works do not employ
state (i.e., key) has multiple commit timestamps, delete transactional semantics, they can potentially benefit from
| timestamps,orvalues. |     |     |     |     |     |     |     | TSPsystemsandthesewillalsobediscussed. |     |     |     |     |     |     |
| -------------------- | --- | --- | --- | --- | --- | --- | --- | -------------------------------------- | --- | --- | --- | --- | --- | --- |
In the case of AIM [32], state is represented in As illustrated in Figure 7, TSP is employed in
a distributed in-memory key value store, whose nodes four scenarios: stream processing optimization, concurrent
statefulprocessing,stream&databasemanagementsystem
| store system | state | as  | horizontally-partitioned |     |     | data | in a |     |     |     |     |     |     |     |
| ------------ | ----- | --- | ------------------------ | --- | --- | ---- | ---- | --- | --- | --- | --- | --- | --- | --- |
ColumnMap layout. The Analytics Matrix system state integration, and recoverable stream processing. Note that
provides a materialized view on a large number of some of these scenarios have multiple functionalities and
aggregatesforeachindividualcustomer(subscriber).When thereforewillbediscussedfromanotherperspective.Next,
aneventarrivesinanSPE,thecorrespondingrecordinthe we discuss these four scenarios across varying real-world
| AnalyticsMatrixisupdatedatomically. |     |     |     |     |     |     |     | usecases. |     |     |     |     |     |     |
| ----------------------------------- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- |

| 18  |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- | --- |
Scenarios where TSP is employed
Stream & DB Integration
Stream Processing Optimization Concurrent Stateful Processing Robust Stream Processing
|     |                      |              |                    |                |                    |                  |              | Streaming Ingestion |     |                | Shared Persistent |             | Fault Tolerance |     |     |
| --- | -------------------- | ------------ | ------------------ | -------------- | ------------------ | ---------------- | ------------ | ------------------- | --- | -------------- | ----------------- | ----------- | --------------- | --- | --- |
|     | Sharing              |              |                    | Deterministic  |                    |                  | Ad-hoc       |                     |     |                |                   |             |                 |     |     |
|     |                      |              |                    |                |                    |                  |              |                     |     |                | Storage           |             | Outsourcing     |     |     |
|     | Intermediate Results |              | Stream  Operations |                |                    | Queryable States |              |                     |     |                |                   |             |                 |     |     |
|     |                      | Multi-Query  |                    |                | Prioritizing Query |                  |              | Streaming OLTP      |     |                |                   | Transaction |                 |     |     |
|     |                      |              |                    |                |                    |                  | Concurrent   |                     |     | Streaming OLAP |                   | Identifier  |                 |     |     |
|     |                      | Optimization |                    |                | Scheduling         |                  | State Access |                     |     |                |                   |             |                 |     |     |
Fig.7:Transactionalstreamprocessingfordiverseneeds.
7.1 StreamProcessingOptimization Multi-Query Optimization. Due to Ray et al. [95],
|     |     |     |     |     |     |     |     | the SPASS | (Scalable | Pattern |     | Sharing | on Event | Streams) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------- | ------- | --- | ------- | -------- | -------- | --- |
frameworkprovidesanoptimizerthatleveragestime-based
| Several | works  | have    | proposed |             | the consistent | management |             |                    |         |         |                 |     |             |        |         |
| ------- | ------ | ------- | -------- | ----------- | -------------- | ---------- | ----------- | ------------------ | ------- | ------- | --------------- | --- | ----------- | ------ | ------- |
|         |        |         |          |             |                |            |             | event correlations |         | among   | queries         | and | effectively |        | shares  |
| of      | shared | mutable | states   | to optimize |                | stream     | processing. |                    |         |         |                 |     |             |        |         |
|         |        |         |          |             |                |            |             | processing         | among   | them.   | Initially,      | the | optimizer   |        | finds a |
| Below   | we     | discuss | these    | works       | in the         | context    | of stream   |                    |         |         |                 |     |             |        |         |
|         |        |         |          |             |                |            |             | shared             | pattern | plan in | polynomial-time |     | that        | covers | all     |
sharing
| processing |     | optimization |     | across | four | use cases: |     |     |     |     |     |     |     |     |     |
| ---------- | --- | ------------ | --- | ------ | ---- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sequencepatterns,whilestillensuringanoptimalitybound.
intermediateresults,multi-queryoptimization,deterministic
|     |     |     |     |     |     |     |     | The runtime | then | exploits | the | shared | continuous |     | sliding |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ---- | -------- | --- | ------ | ---------- | --- | ------- |
streamoperations,andprioritizingqueryscheduling.
|     |     |     |     |     |     |     |     | view technology |     | to execute | the | identified | shared |     | pattern |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ---------- | --- | ---------- | ------ | --- | ------- |
SharingIntermediateResults.Toillustratethesharing plan. Since the sliding view may be concurrently modified
of intermediate results, we will examine two examples: by multiple pattern queries, a sequence transaction model
STREAM and IBWJ (a parallel index-based window join on shared views is introduced to define the correctness
algorithm). In the STREAM system [57], since multiple of concurrent shared pattern execution. The most notable
states called synopses may be nearly identical within a feature of SPASS is that it does not modify existing states.
single query plan, they are kept in a single store to reduce Instead, it can select, insert and delete shared states (i.e.,
storage redundancy. Since stores are shared, operators slidingviews).Unfortunately,someimplementationdetails
access their own states exclusively via an interface called are not specified in the original paper (e.g., the data layout
astub.However,asoperatorsarescheduledindependently, oftheslidingviews,thekeytobeusedwhensearchingfor
they will likely require slightly different views of the sharedslidingviews).
| data. | Hence, | STREAM | employs |     | a simple | timestamp-based |     |               |     |        |             |     |          |     |         |
| ----- | ------ | ------ | ------- | --- | -------- | --------------- | --- | ------------- | --- | ------ | ----------- | --- | -------- | --- | ------- |
|       |        |        |         |     |          |                 |     | Deterministic |     | Stream | Operations. |     | Handling |     | an out- |
executionmechanismtopreservecorrectness. of-order stream is a common performance bottleneck, as
|          |        |            |           |           |            |            |          | there is            | a fundamental |             | conflict | between     | data        | parallelism |     |
| -------- | ------ | ---------- | --------- | --------- | ---------- | ---------- | -------- | ------------------- | ------------- | ----------- | -------- | ----------- | ----------- | ----------- | --- |
|          | Due to | Shahvarani | and       | Jacobsen, |            | IBWJ [100] | utilizes |                     |               |             |          |             |             |             |     |
|          |        |            |           |           |            |            |          | and order-sensitive |               | processing. |          | Data        | parallelism | seeks       | to  |
| a shared | index  | data       | structure | to        | accelerate | sliding    | window   |                     |               |             |          |             |             |             |     |
|          |        |            |           |           |            |            |          | improve             | operator      | throughput  |          | by allowing | more        | than        | one |
| joins,   | reduce | redundant  |           | memory    | access     | during     | tuple    |                     |               |             |          |             |             |             |     |
threadtooperateondifferenteventsconcurrently.However,
| matching, |     | and improve |     | performance. |     | For all | tuples in a |              |     |            |     |               |     |      |       |
| --------- | --- | ----------- | --- | ------------ | --- | ------- | ----------- | ------------ | --- | ---------- | --- | ------------- | --- | ---- | ----- |
|           |     |             |     |              |     |         |             | these events | may | be handled |     | out-of-order. |     | Most | works |
window,anindexstructureisconstructed.Inordertomatch
attempttosolvetheconflictbyemployinglocks.Incontrast,
tuples,eachtimeanewtuplearrivesfromonestream,IBWJ
someworksutilizenon-lock(e.g.,sorting)algorithms[135].
searchestheindexstructureoftheotherstream.Intuitively,
|     |     |     |     |     |     |     |     | One of | the | interesting | non-lock |     | approaches | involves |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | --- | ----------- | -------- | --- | ---------- | -------- | --- |
thearrivalofanewtuplewilltriggeranupdatetoanindex
|     |     |     |     |     |     |     |     | using software |     | transactional |     | memory | (STM) | for | stream |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ------------- | --- | ------ | ----- | --- | ------ |
structure.Sincetheindexstructureissharedamongthreads,
|         |            |            |             |             |            |            |           | processing | as         | proposed | by      | Brito et | al. [33]. | In  | their  |
| ------- | ---------- | ---------- | ----------- | ----------- | ---------- | ---------- | --------- | ---------- | ---------- | -------- | ------- | -------- | --------- | --- | ------ |
| this    | will raise | additional |             | concurrency |            | control    | problems. |            |            |          |         |          |           |     |        |
|         |            |            |             |             |            |            |           | approach,  | processing |          | a batch | of input | data      | at  | order- |
| Instead | of         | adopting   | transaction |             | semantics, | Shahvarani | et        |            |            |          |         |          |           |     |        |
sensitiveoperatorsismodeledasatransaction,andcommit
| al. | [100] propose |     | a low-cost |     | and effective | concurrency |     |            |     |              |     |                  |     |             |     |
| --- | ------------- | --- | ---------- | --- | ------------- | ----------- | --- | ---------- | --- | ------------ | --- | ---------------- | --- | ----------- | --- |
|     |               |     |            |     |               |             |     | timestamps | are | pre-assigned |     | to transactions, |     | effectively |     |
controlmechanismtomeetthedemandsofhigh-rateupdate
imposingorder.Consequently,eventsthatarereceivedout-
| queries. | The | concurrency |     | problem | raised | from | sharing a |          |        |          |          |         |     |           |     |
| -------- | --- | ----------- | --- | ------- | ------ | ---- | --------- | -------- | ------ | -------- | -------- | ------- | --- | --------- | --- |
|          |     |             |     |         |        |      |           | of-order | and/or | conflict | with one | another | are | processed | in  |
synopsisandanindexduringawindowjoincannaturallybe
paralleloptimistically,butarenotoutputuntilallpreceding
handledbyaTSPsysteminsteadofthepreviouslyproposed
|     |     |     |     |     |     |     |     | events have | been | completed. | In  | this way, | they | ensure | that |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ---- | ---------- | --- | --------- | ---- | ------ | ---- |
ad-hocsolution[57,100].Thisisespeciallyimportantwhen
operatorsremaininaconsistentstatedespiteparallelization.
properties,suchasdurabilityisrequired.Forexample,one
can treat a shared index structure as a shared mutable state Prioritizing Query Scheduling. To handle potentially
and model each read or write request to the structure as a infinite data streams, continuous queries are typically
transaction. However, to date, we are unaware of anyone formulatedwithawindowconstrainttolimitthenumberof
havingemployedthisapproachinpractice. tuples that must be processed at any point in time. In most

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 19  |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
implementations, the execution of a sliding window query on a Fahrenheit scale. This would require an update to the
and a window update is conducted serially (e.g., a query specifications table. However, if the updates do not occur
is triggered by the arrival of a tuple and during execution priortothearrivalofnewsensormeasurements,falsealarms
the query will update the corresponding window). Such an maybegenerated.
implementationimplicitlyassumesthatawindowcannotbe To avoid the aforementioned problem, an SPE should
advanced,whileitisbeingaccessedbyaquery. be able to order table updates and stream temperature
Golabetal.[53]arguethattheconcurrentprocessingof readings.However,thiscannotbeachievedinconventional
queries(reads)andwindow-updates(writes)isrequired,to SPEs. The fundamental challenge in supporting such
allowprioritizedqueryschedulingtoimprovethefreshness workloadsstemsfromthedifferencesbetweenthetwoquery
of answers. To achieve that, they model window updates processingworlds:traditionallystoreddatasourcesfocuson
andqueriesastransactionsconsistingofatomicsub-window (read/write)operations,whilestreamprocessingoperateson
reads and writes. However, it is obvious that such a events.Althoughanorderingisdefinedamongevents(e.g.,
computing strategy can lead to a read-write conflict as basedontimestamps,basedonarrivalorder)andoperations
multiple threads may concurrently access the same state. (e.g., defined by a transactional model), there is no well-
Golab et al. [53] prove that the traditional notion of defined order across events and operations, which makes
conflict serializability is insufficient in this context and it impossible to compare them directly. Moreover, in batch
define stronger isolation levels that restrict the allowed processing queries are traditionally handled one at a time,
serialization orders following event ordering. Similarly, whereas in stream processing long-running, continuous
Golab et al. [55] propose mechanisms to index time- queries are commonplace. This problem is exacerbated
evolvingdatainsecondarystorage.Whenthereareupdates when more complex analytical queries, such as scan and
and reads from concurrent threads, it can also lead to range lookups are required. In a similar setting, Shaikh
conflicts.Theauthorsmentionthattheyplantoaddressthe et al. [101] consider the inconsistency problem that arises
issueofupdateconsistencyduetochangesmadein-placeor when relational data sources referenced by stream-relation
thereplacementofanentiresub-indexwithacopyonwhich joinsareupdatedduringstreamprocessing.
updateshavebeenmade. Concurrent State Access. There are instances when
|     |     |     |     |     |     |     |     | a stream   | query’s    | operators |        | can share | their  | states.    | To  |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ---------- | --------- | ------ | --------- | ------ | ---------- | --- |
|     |     |     |     |     |     |     |     | illustrate | concurrent | state     | access | in        | stream | processing | we  |
7.2 ConcurrentStatefulProcessing
|             |           |             |     |           |           |           |        | will consider   |       | the Ververica |          | Streaming    | Ledger | [9]       | (SL)   |
| ----------- | --------- | ----------- | --- | --------- | --------- | --------- | ------ | --------------- | ----- | ------------- | -------- | ------------ | ------ | --------- | ------ |
|             |           |             |     |           |           |           |        | application.    | Input | streams       | are      | continuously |        | processed | by     |
| In this     | scenario, | application |     | workloads | are       | comprised | of     |                 |       |               |          |              |        |           |        |
|             |           |             |     |           |           |           |        | four operators: |       | parser,       | deposit, | transfer,    | and    | sink.     | During |
| both ad-hoc | and       | continuous  |     | queries   | and these | may       | access |                 |       |               |          |              |        |           |        |
processing,theseoperatorsmayneedtoshareaccesstothe
| and modify | common |     | application | states. | For | each | use case |     |     |     |     |     |     |     |     |
| ---------- | ------ | --- | ----------- | ------- | --- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
applicationstatesconsistingofaccountandassetdata.
| below,      | we will  | discuss | a few      | representative |     | applications. |     |             |     |                |        |                 |                |                 |     |
| ----------- | -------- | ------- | ---------- | -------------- | --- | ------------- | --- | ----------- | --- | -------------- | ------ | --------------- | -------------- | --------------- | --- |
|             |          |         |            |                |     |               |     | If the      | SL  | is implemented |        | using           | a conventional |                 | SPE |
| For further | examples |         | of related | applications   |     | readers       | are |             |     |                |        |                 |                |                 |     |
|             |          |         |            |                |     |               |     | like Flink, | the | natural        | choice | is to partition |                | the application |     |
encouragedtoexamineTatbuletal.[113],Wangetal.[125],
|     |     |     |     |     |     |     |     | states into | disjoint | subsets |     | based | on accID | and | assID |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | -------- | ------- | --- | ----- | -------- | --- | ----- |
Meehanetal.[78],andZhangetal.[134].
|     |     |     |     |     |     |     |     | corresponding |     | to the | account | table | and | asset | table, |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------ | ------- | ----- | --- | ----- | ------ |
Ad-hocQueryableStates.Ad-hocqueries(alsocalled
|          |          |     |           |     |                |     |          | respectively. | However, |     | it may | be that | a parameter |     | in a |
| -------- | -------- | --- | --------- | --- | -------------- | --- | -------- | ------------- | -------- | --- | ------ | ------- | ----------- | --- | ---- |
| snapshot | queries) | are | analogous |     | to traditional |     | database |               |          |     |        |         |             |     |      |
transactionmaybedependentonthevalueofcertainstates.
| queries: | They | can be | submitted | to  | an SPE | at any | time, |     |     |     |     |     |     |     |     |
| -------- | ---- | ------ | --------- | --- | ------ | ------ | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
Forexample,duringtheprocessingofatransferrequest,an
| executed    | once, | and answer | queries  |           | (to provide | insight | into    |           |       |                  |            |     |            |               |         |
| ----------- | ----- | ---------- | -------- | --------- | ----------- | ------- | ------- | --------- | ----- | ---------------- | ---------- | --- | ---------- | ------------- | ------- |
|             |       |            |          |           |             |         |         | update to | one   | account          | may depend |     | on a value | in            | another |
| the current | state | of the     | system). | Moreover, |             | ad-hoc  | queries |           |       |                  |            |     |            |               |         |
|             |       |            |          |           |             |         |         | account,  | which | can incidentally |            | be  | modified   | concurrently. |         |
maybeusedtoobtainfurtherdetailsinresponsetochanges
|     |     |     |     |     |     |     |     | As a result, | data | dependencies |     | among | transactions |     | in SL |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ---- | ------------ | --- | ----- | ------------ | --- | ----- |
intheresultofcontinuousqueries.
|     |     |     |     |     |     |     |     | cannot | easily | be handled | using | conventional |     | SPEs. | A   |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ------ | ---------- | ----- | ------------ | --- | ----- | --- |
Botanetal.[31]describeastreamingapplication,where
|           |         |          |             |     |              |     |     | comparable | stream | application |     | involving | bank | transactions |     |
| --------- | ------- | -------- | ----------- | --- | ------------ | --- | --- | ---------- | ------ | ----------- | --- | --------- | ---- | ------------ | --- |
| real-time | sensors | generate | temperature |     | measurements |     | (on |            |        |             |     |           |      |              |     |
isdescribedbyAffettietal.[14,15].
| a Celsius     | scale) | to ensure | (temperature-sensitive) |                |     |         | devices |     |     |     |     |     |     |     |     |
| ------------- | ------ | --------- | ----------------------- | -------------- | --- | ------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
| are operating | within | their     | design                  | specifications |     | (stored | in a    |     |     |     |     |     |     |     |     |
database table). In their example, whenever a temperature 7.3 StreamandDatabaseManagementSystemIntegration
| reading | falls out | of the | operating | range, | it  | will trigger | an  |     |     |     |     |     |     |     |     |
| ------- | --------- | ------ | --------- | ------ | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
alert. Typically, an SPE would model this problem using a There is a growing need for the integration of SPEs with
continuous query: For each incoming temperature reading, database management systems [111]. For example, the
the table of specifications is probed and an alarm is raised arrival of continuous data streams from external sources
whenever a violation is detected. That said, suppose that into big data management systems are either processed
afterthearrivalofanevent,wewanttoexpresstemperatures incrementally or used to populate a persisted dataset

20 ShuhaoZhang,JuanSoto,andVolkerMarkl
and associated indexes. Such a stream data ingestion Security Table
(Streaming Ingestion) scenario can be well supported by S K _ S e c u r it y I D Symbol, Issue, Status ..
Foreign Key
TSPSs. Furthermore, TSPSs also support alternative ways
ofimplementingOLTPqueries(StreamingOLTP)aswellas Trade Table
T r a d e I D SK_SecurityID, SK_AccountID..
mixedstreamandanalyticqueries(StreamingOLAP).Next,
Foreign Key
wewilldiveintoeachofthesescenarios. Account Table
Streaming Ingestion. Data ingestion is an essential S K _ A c c o u n t I D AccountID, Status ..
part of companies and organizations that collect and (a)ThreeTableswithSharedStates
analyzelargevolumesofdata.Traditionally,batchingestion
(say in ETL systems) processes large batches of data
Update Update Update
Parser
overnight. To keep pace with massive and fast-moving Security Account Trade
data, systems must be able to ingest, process, and persist (b)StreamingDataflowGraph
data continually. In contrast, streaming ingestion processes
Fig.8:StreamingTPC-DI(StreamingIngestion).
smaller microbatches throughout the day to enable quicker
access to incremental results. Following this idea, Meehan
et al. [77] adapt TPC-DI [93] – a standard benchmark for Data Operators
data ingestion, to examine the effectiveness of streaming
History Stock
ingestion. However, TPC-DI [93] was originally designed
as a benchmark for traditional ETL systems, the act of Source Warehouse Order Sink
breakinglargebatchesintosmalleronesintroducesnewdata
dependencies[77].
Figure 8 illustrates a simplified version of a streaming Fig.9:StreamingTPC-C(StreamingOLTP).
TPC-DI workload with three tables of shared states:
Security, Trade, and Account. Note that the Trade table
data operators, StreamDB reduces (and can sometimes
contains foreign keys on both the Security and Account
completely remove) lock contention during transaction
tables as shown in Figure 8 (a). When new rows are
processing. However, how to optimally come up with a
defined within the Trade table, a reference must be made
goodstreamdataflowgraphforanarbitraryOLTPworkload
to the other two tables to assign the SK SecurityID and
remainsanopenquestion.
SK AccountID keys, which means that the corresponding
Streaming OLAP. Many organizations require real-
rowsmustalreadyexistintheirrespectivetables.Suchdata
time analysis of their data streams to make instantaneous
dependenciescannaturallybeexpressedincurrentSPEsas
decisions and a number of related applications have
a streaming dataflow graph as illustrated in Figure 8 (b),
been described in the literature [32, 56, 102]. Huawei-
whichcontainsfourmajoroperators:parser,updatesecurity,
AIM workload [32] (AIM) is a specifically designed
update account, and update trade. The input events, e , e
1 2
telecommunicationsworkloadasaresultofacollaboration
(a microbatch of files) are processed sequentially by these
between Huawei and the ETHZ Systems Group. AIM has
major operators fulfilling the operator ordering constraint.
a three-tier architecture consisting of storage, an SPE,
Duringprocessing,thesethreetablesmaybereadorupdated
and real-time analytics (RTA) nodes. RTA nodes push
concurrentlybyalloperatorsandtheirparallelinstances.
analytical queries down to the storage nodes, merge the
Streaming OLTP. Conventional OLTP workloads can
partial results, and finally deliver the results to the client.
be handled using streaming queries. To support this idea,
ESP nodes process the incoming event stream and update
Chen and Migliavacca [43] proposed StreamDB, which
thecorrespondingrecordsbysendingGet andPut requests
adopts a TSP scheme. In StreamDB, there are only three
to the storage nodes. The consistent state (or snapshot) is
types of operators in a streaming query, including the 1)
not allowed to be older than a certain bound, which is a
Source operator, which receives transactions from client
service level objective (SLO) of the AIM workload. This
applications, timestamps them, and issues transactions
requirementisverydifferentfromotherapplications,which
to downstream data operators; 2) Data operator, which
usuallyrequireserializableisolationlevel.
maintains a portion of a database (either as a vertical or
a horizontal partition), carries transaction execution and
produces intermediate results for other data operators, or 7.4 RobustStreamProcessing
passes the final results to Sink; 3) Sink operator, which
receivestransactionresponses. Besides such requirements as scalability and low latency,
Figure9illustratesanexampleimplementationofTPC- manycriticalstreamingapplicationsrequireSPEstorecover
C in StreamDB. By splitting a database among multiple quickly in the event of a failure [106]. It is for this reason

ASurveyonTransactionalStreamProcessing 21
that a lot of activity has been directed at achieving fault as well. However, there are many open research questions
tolerance in SPEs. Next, we discuss earlier attempts to yet to be solved. Another interesting take away is that
leverage transactional-like concepts, so as to achieve high transactional dependency is rare among applications,
availabilityandfaulttoleranceinstreamprocessing. which means that in most cases, the input parameters in a
Shared Persistent Storage. MillWheel [17] runs transaction are predetermined from the triggering events.
stateful computations using an event-driven API and Systemscantakeadvantageofthistosimplifytheirdesign
persistently stores input and output of operations for each andimprovesystemperformance.
inputtuplebeforeitinfluencesotherelementsoroperational
states. In MillWheel all state updates are handled remotely
8 OrthogonalWork
using a storage system like BigTable [41]. This remote
store has to independently handle fault-tolerance (e.g.,
Next,weturnourattentiontoongoingresearchonproblems
by replicating data). To avoid inconsistencies in persisted
that are partially related to TSP (i.e, arising only in some
state, MillWheel wraps all per-key updates in a single
applicationsthatdrawonTSPaswellasotherareas).This
atomic operation. Unlike MillWheel, Samza [84] takes an
includes research on non-transactional state sharing and
alternative approach, it combines local on-disk storage, a
non-transactionalstreamingproperties.
moreefficientchangelog,andcachingmechanisms.
Non-Transactional State Sharing. In the context
Transaction Identifier. The second approach,
of stream processing, state sharing is often prohibited.
represented by Tridents “transactional topology” [76],
However,anumberofrecentworks[100,138]havepointed
treats the whole stream processing topology as a single
out the necessity of supporting state sharing during stream
operation. It uses small batches of tuples and assigns them
processing. Due to the potential for conflicts when reading
unique transaction identifiers (TXID). TXID are logged
and writing to the same state, these works also need
in external storage along with the state of the operator
to address concurrency. For example, Cheng et al. [138]
and used to figure out the state of a failed tuple. A batch
recently introduced a timestamped state sharing technique
requiresre-submissionintheeventofanunmatchedTXID,
as a novel system-wide state abstraction. In contrast to
in order to recover from failure. However, to perform
TSP, the key difference in these works is that they neither
correctly,itrequiresastricttransactionprocessingordering,
considerACID,northeconceptofatransaction.Instead,they
whichlimitssystemthroughput.Furthermore,itignoresthe
assumethereareonlysinglekeyaccesses,i.e.,eachreadand
state of buffered inputs and thus suffers from the loss of
write contains only one key and the proposed system only
intermediateresultsintheeventoffailures.
provideskey-valuestorestyleAPIs(i.e.,Put/Get).
FaultToleranceOutsourcing.Ishikawaetal.[62]aims
Non-Transactional Streaming Properties. In contrast
todevelopnewdatastreamprocessingmethodologies,such
to transactional processing, TSP needs to guarantee
as incorporating fault tolerance in an OLTP engine. When
additional streaming properties (previously referenced in
backingupdatastreams,theyproposetowritethedatainto
Section 4.2): operator ordering and event ordering. These
an in-memory database system instead of a file system. In
streamingpropertiesarealsoimportantinnon-transactional
this case, the persistence of the data is supported by the
streamprocessingapplications.Astreamoperatorisorder-
functionofthedatabasesystem.Suchamechanismisvery
sensitive, if it requires input events to be processed in a
similar in spirit to H-Store’s state partitioning transaction
predefined order (e.g., chronological order). Handling out-
processing mechanism. While storing state in an external
of-orderinputdatainanorder-sensitiveoperatoroftenturns
file system outsources the responsibility of fault-tolerance,
outtobeaperformancebottleneck,asthereisafundamental
thisapproachisinefficient.Itcanalsooverwhelmtheremote
conflict between data parallelism, which seeks to improve
store(e.g.,inthepresenceofspikes),whichcannegatively
thethroughputofanoperatorbylettingmorethanonethread
impactotherapplicationsusingthesharedstore.
operate on different events concurrently (possibly out-of-
order)andorder-sensitiveprocessing.Variousmethodsand
7.5 RemarksconcerningAdvancedIssuesforTSPSystems techniques have been proposed to guarantee an ordering
during stream processing, including general techniques,
From the above analysis, it is evident that TSP based such as a buffer-based technique [24], a punctuation-
application use cases have diverse requirements, which based technique [72], speculative techniques [97], a
differ from traditional database workloads or ordinary synchronization specification based technique [19], and
stream processing workloads. For example, some specially-designed techniques applied in a certain type of
applications do not require insert and delete operations operator,suchaswindowaggregation[119].Incomparison
at all, while some others do not update shared mutable toTSP,thekeydifferenceoftheseworksisthatTSPoffers
states. In addition, TSP has the potential to better support morefine-grainedcontrolofstateaccessesthatareordered
conventional database workloads (i.e., OLTP and OLAP) than ordered event processing can offer. Specifically, input

| 22  |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
eventsmaybeprocessedinanarbitraryorderinTSPSs,but explicitly or can be extracted directly from an input event.
theirissuedtransactionsmustbeequivalenttoaconflict-free However, in some use cases, when parameters depend on
schedulethatfollowsaninputeventsequence. the value of a certain state, a data dependency exists. A
|     |     |     |     |     |     |     | state transaction |     | with a | data dependency |     | is more | difficult |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | ------ | --------------- | --- | ------- | --------- |
tohandleastheirdependentstatemaybemodifiedbyother
9 ResearchOutlook
transactionsthatarerunningconcurrently.
|     |     |     |     |     |     |     | Data | Manipulation |     | Statements |     | (S/U/I/D): | Data |
| --- | --- | --- | --- | --- | --- | --- | ---- | ------------ | --- | ---------- | --- | ---------- | ---- |
Tosupportmodernstreamingapplications,traditionalSPEs
manipulationstatementsemployedinapplicationsconstrain
complementdatamanagementtoolsforprocessing,storing, both system design and potentially optimizations. Some
| and querying |     | [98]. Thereby |     | reducing | the complexity | of  |              |         |     |            |             |     |           |
| ------------ | --- | ------------- | --- | -------- | -------------- | --- | ------------ | ------- | --- | ---------- | ----------- | --- | --------- |
|              |     |               |     |          |                |     | applications | require | an  | insert (I) | or a delete | (D) | statement |
managing separate subsystems, relieving developers from tobesupported.Whenthesystemneedstofurthermaintain
| having | to integrate | these | solutions, | as  | well as minimizing |     |           |                 |     |         |        |         |           |
| ------ | ------------ | ----- | ---------- | --- | ------------------ | --- | --------- | --------------- | --- | ------- | ------ | ------- | --------- |
|        |              |       |            |     |                    |     | a foreign | key constraint, |     | such as | in the | case of | streaming |
the risk of introducing functional errors and performance ETL [77], storing shared states as relations could be a
| problems. | Adopting | TSP | would | not | only provide | great |     |     |     |     |     |     |     |
| --------- | -------- | --- | ----- | --- | ------------ | ----- | --- | --- | --- | --- | --- | --- | --- |
reasonablechoiceofthesystemdesign.However,aforeign
benefits, but also mitigate the aforementioned challenges. keyconstraintisrarelyrequiredinmostTSPscenarios,and
Next,weofferaperspectiveonfutureresearchdirections.
|     |     |     |     |     |     |     | many need    | only | the select   | (S) and | update | (U) statement | to         |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ---- | ------------ | ------- | ------ | ------------- | ---------- |
|     |     |     |     |     |     |     | be supported | for  | manipulating | shared  | states | during        | stream     |
|     |     |     |     |     |     |     | processing.  | In   | such a case, | storing | shared | states        | as vanilla |
9.1 StandardizationandBenchmarkingofTSP
|                   |     |       |         |      |      |           | key-value | pairs       | is sufficient | and           | simplifies | the      | design of |
| ----------------- | --- | ----- | ------- | ---- | ---- | --------- | --------- | ----------- | ------------- | ------------- | ---------- | -------- | --------- |
|                   |     |       |         |      |      |           | TSPSs.    | In general, | specific      | optimizations |            | shall be | adopted   |
| Many applications |     | would | benefit | from | TSP, | including |           |             |               |               |            |          |           |
bytheTSPSs,accordingtotheapplicationneeds.
| Healthcare  | [125],   | the         | IoT [31], | and         | E-commerce    | [14]). |             |         |                  |            |             |             |          |
| ----------- | -------- | ----------- | --------- | ----------- | ------------- | ------ | ----------- | ------- | ---------------- | ---------- | ----------- | ----------- | -------- |
|             |          |             |           |             |               |        | Properties  |         | of Transactional |            | Stream      | Processing: | The      |
| However,    | to       | date, there | is        | no standard | benchmark     |        |             |         |                  |            |             |             |          |
|             |          |             |           |             |               |        | properties, | include | ACID             | properties |             | as well     | as three |
| for TSPSs   | [112],   | which       | must      | include     | comprehensive |        |             |         |                  |            |             |             |          |
|             |          |             |           |             |               |        | constraints | (an     | operation        | ordering   | constraint, |             | an event |
| performance | metrics, | diversity   |           | of workload | features,     | and    |             |         |                  |            |             |             |          |
orderingconstraint,anddeliveryguarantees).
| meaningful | application |     | scenarios. | In Table | 1, we | list 13 |     |     |     |     |     |     |     |
| ---------- | ----------- | --- | ---------- | -------- | ----- | ------- | --- | --- | --- | --- | --- | --- | --- |
applications that may serve as a starting point for the • ACID Properties: Atomicity (A) requires each
construction of a standard benchmark. In particular, these transaction to execute either all its operations or none
applicationsencompassmanyimportantfeatures,suchas: at all. It is a common property in varying applications
Access Scope of Shared State: Some applications in TSPSs, as well as traditional database systems.
require varying degrees of access to shared states with Consistency (C) traditionally refers to maintaining
wide ranging scope, spanning from intra-operator to inter- integrity constraints in database systems. In TSP,
systems.Intheeventanapplicationhasmixedscopes(i.e., applications can also similarly enforce constraints
diverse access rights to shared states), then it would be on shared mutable states. Isolation (I) guarantees
classified according the broadest access rights. In the case correctness even when multiple transactions are
of stream operators, these may need to maintain multiple interleaved. Most TSP applications require serializable
states. For example, the shared states can be the index isolation, while some others allow for snapshot
structureofaninputstreamorsomeotheruser-defineddata isolation. Durability (D) requires that modifications
structure.Concurrencycontrolissuesarisewhenmorethan performedbyatransactionarepermanent.Thisproperty
oneentity(i.e.,threads)sharesstate(i.e.,intra-operator)and iscriticalinordertorecoverfromasystemcrash.Many
may concurrently modify the same state during execution. TSP applications do not explicitly require durability,
States may be also shared among multiple operators or however,theyresorttoanSPE’sbuilt-infaulttolerance
| amongmultiplequeries.ItisworthnotingthatwhenOLTP |     |     |     |     |     |     | mechanism. |     |     |     |     |     |     |
| ------------------------------------------------ | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- |
workloads are implemented in a TSP system, the access • OperationOrderingConstraint:Thisconstraintrequires
scope of a shared state is within a transaction, which can the execution of a transaction to follow the topological
beattributedtoasingleoperatorormultipleoperators. ordering of stream operators expressed in the DAG.
Transaction Scope: In some streaming applications a As events flow through the DAG, this requirement
transactionisthe(entire)processemployedwhenhandling is naturally preserved in SPEs. However, in order to
abatchofinputevents,whileothersdefineatransactionina support TSP in database systems, this constraint would
fine-grainedmanner,suchastheprocessingofaninputevent imposeyetanotherrequirement.
|     |     |     |     |     |     |     | • Event | Ordering | Constraint: |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ----------- | --- | --- | --- | --- |
atastreamoperator.Therearealsocaseswhereatransaction This constraint requires
isdefinedflexiblywithineachoperation. transactions with conflicting schedules to be ordered
Data Dependency: In most use cases, the parameters by their triggering event timestamp. Note that this is
(e.g., read/write sets) of a stream transaction are given unlike external consistency and strict serializability as

| ASurveyonTransactionalStreamProcessing |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 23  |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Table1:SummaryofRelevantApplications
AccessScopeof Data Data PropertiesofTransactionalStreamProcessing
| AppName |     |     |     | TransactionScope |     |     |     |     |     |     |     |     |     |     |     |
| ------- | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
SharedState Dependency Manipulation ACID OperatorOrdering EventOrdering Deliverability
|     |     |     |     |     |     |     |     | Statements |     | Constraint |     | Constraint |     | Properties |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ---------- | --- | ---------- | --- | ---------- | --- |
DeterministicStream Intra-operator Peroperator No S/U AI No Yes Exactly-once
| Operation[33] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| ------------- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
SharedIndexWindow Intra-operator Peroperator No S/U AI No Yes Exactly-once
| Join[100] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| --------- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
TollProcessing[134] Intra-query Peroperator No S/U ACID Yes Yes Exactly-once
execution
StreamingLedger[9] Intra-query Peroperator Yes S/U ACID Yes Yes Exactly-once
execution
Leaderboard Intra-query Peroperator Yes S/U/I/D ACID Yes Yes At-least-once
| Maintenance[78] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| --------------- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ActiveComplexEvent Inter-query Perquery No S/U AID No Yes Exactly-once
| Processing[125] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| --------------- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Multi-Pattern-Query Inter-query Perquery No S/I/D AI No Yes Exactly-once
| Optimization[95] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| ---------------- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ConcurrentSliding Inter-query Peroperator/query No S/I/D AI No Yes Exactly-once
| Window[53] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| ---------- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
MonitoringwithUpdatable Inter-query Perquery No S/U ACID No Yes Exactly-once
| Specifications[31] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| ------------------ | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
WaveformsAlert Inter-query Peroperator/query No S/U/I/D AID Yes Yes Exactly-once
| Monitoring[113] |     |     |     |     | execution |     |     |     |     |     |     |     |     |     |     |
| --------------- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
StreamingIngestion[77] Inter-system Peroperator No S/U/I/D ACID Yes Yes Exactly-once
execution
AnalyticsInMotion[32] Inter-system Perquery No S/U Snapshot No Yes Exactly-once
|     |     |     |     |     | execution |     |     |     | isolation |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --------- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- |
StreamingOLTP[43] Pertransaction user-defined No S/U/I/D ACID Yes Yes At-least-once
the required schedule is determined explicitly by input (ML)algorithmsassumethatalldataisavailableinadvance.
eventratherthanthetransactionexecutionorder. In addition, the assumption is that these algorithms will
• DeliveryGuarantee:Applicationsmayrequiredifferent
|     |     |     |     |     |     |     |     | iterate over | time, | refine | model | parameters, |     | and reach | a   |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ----- | ------ | ----- | ----------- | --- | --------- | --- |
guarantees concerning how each input event is to be global optimization objective on the entire dataset [61].
processed.Anexactly-onceguaranteewouldensurethat
|     |     |     |     |     |     |     |     | To support | streaming | data, | online | ML  | algorithms | define | a   |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --------- | ----- | ------ | --- | ---------- | ------ | --- |
each input is processed once and only once. An at- local objective function for each item with respect to the
least-once guarantee would ensure that each input is current model parameters, and search for locally optimal
always processed, but maybe more than once. An at- parameters. It has been shown that the local approach
most-once guarantee would ensure that each input is can converge to a global optimal point, subject to certain
| either | processed | or  | dropped, | but | never | revised. | Few | conditions[60,139]. |     |     |     |     |     |     |     |
| ------ | --------- | --- | -------- | --- | ----- | -------- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- |
applicationsdemandanat-most-onceguarantee.
|     |     |     |     |     |     |     |     | Driven            | by those      | demands,   |            | attempts | have          | been  | made |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | ------------- | ---------- | ---------- | -------- | ------------- | ----- | ---- |
|     |     |     |     |     |     |     |     | in the literature |               | to support | continuous |          | queries       | (CQs) | to   |
|     |     |     |     |     |     |     |     | reference         | non-streaming |            | resources, | such     | as relational |       | data |
9.2 NovelApplications
|              |         |          |      |                  |     |           |         | in database | systems  | and           | ML      | models     | [89]. | Model-based |       |
| ------------ | ------- | -------- | ---- | ---------------- | --- | --------- | ------- | ----------- | -------- | ------------- | ------- | ---------- | ----- | ----------- | ----- |
|              |         |          |      |                  |     |           |         | streaming   | systems, | like          | anomaly | detectors, |       | depend      | on    |
| Due to the   | rise of | the IoT, | data | are increasingly |     | generated |         |             |          |               |         |            |       |             |       |
|              |         |          |      |                  |     |           |         | predictions | that     | are generated |         | from weeks | worth | of          | data, |
| in real-time | and     | these    | need | to be processed  |     | as        | soon as |             |          |               |         |            |       |             |       |
|              |         |          |      |                  |     |           |         | and their   | models   | must be       | updated | on-the-fly |       | as new      | data  |
possible.Traditionally,bigdataapplicationsweredesigned
arrives.Scalingthesesystemsbyordersofmagnitudeshould
totacklelargestaticdatasets.However,today’sapplications
notcauseacommensurateincreaseintheoperationalcosts
| are far more | demanding. |            | Consequently, |              | we  | envision | the   |             |         |                  |     |         |       |              |     |
| ------------ | ---------- | ---------- | ------------- | ------------ | --- | -------- | ----- | ----------- | ------- | ---------------- | --- | ------- | ----- | ------------ | --- |
|              |            |            |               |              |     |          |       | of building | and     | maintaining      | the | system  | [17]. | However,     |     |
| development  | of         | novel      | streaming     | applications |     | that     | would |             |         |                  |     |         |       |              |     |
|              |            |            |               |              |     |          |       | due to the  | lacking | of transactional |     | support | in    | conventional |     |
| benefit from | TSP        | solutions. |               | Moreover,    | the | spectrum | of    |             |         |                  |     |         |       |              |     |
SPEs,usershavetoapplycumbersomeworkaroundsinthe
applicationsthatSPEsserveisfurtherwidening.Currently,
|     |     |     |     |     |     |     |     | implementation | of  | emerging | streaming |     | mining | algorithms, |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | -------- | --------- | --- | ------ | ----------- | --- |
someresearchisinvestigatingnovelsystemsthatmeetthese
|               |           |            |              |             |        |           |     | such as       | streaming  | event   | detection | [98].        | It thus | remains     | an  |
| ------------- | --------- | ---------- | ------------ | ----------- | ------ | --------- | --- | ------------- | ---------- | ------- | --------- | ------------ | ------- | ----------- | --- |
| requirements, | for       | example,   | NebulaStream |             | [132]. | Next,     | we  |               |            |         |           |              |         |             |     |
|               |           |            |              |             |        |           |     | interesting   | future     | work to | study     | how those    | online  | ML          | and |
| turn our      | attention | to varying |              | application | areas, | including |     |               |            |         |           |              |         |             |     |
|               |           |            |              |             |        |           |     | stream mining | algorithms |         | can       | be supported |         | efficiently | in  |
onlinemachinelearning/streammining,mixedbatch/stream
|     |     |     |     |     |     |     |     | TSPSs, | which bring | features, | such | as  | elastic | scaling, | fault |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ----------- | --------- | ---- | --- | ------- | -------- | ----- |
transactionalworkloads,streamingmaterializedviews,and
toleranceguarantees,andsharedstateconsistencytousers,
operationalstreamprocessing.
evenatthevirtualspace[86].
| Online | Machine | Learning/Stream |     |     | Mining. |     | Online |     |     |     |     |     |     |     |     |
| ------ | ------- | --------------- | --- | --- | ------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
learningandminingfromstreamsofdatawillsoonbecome Mixed Batch/Stream Transactional Workloads. An
mandatoryfordatascientists.Traditionalmachinelearning increasing number of enterprise applications, particularly

| 24  |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- | --- |
those in financial trading and the IoT, produce mixed a shared-nothing distributed streaming system to external
workloads by simultaneously supporting continuous applications. Different from TSPSs, S-Query does not
stream processing, online transaction processing (OLTP), provide strict ACID guarantees. Thus, the clear distinction
and online analytical processing (OLAP). For example, ofusecasesdrivesalsoaclearseparationofconcerns.
DeltaLake [22] lets streaming jobs write small objects Winter et al. [127] recently proposed a so-called
into a table at low latency, then for performance reasons continuous view scheme that is highly correlated with the
transactionally coalescing them into larger objects at a design goal of SMVs. It is implemented in a database
later point time. Fast “tailing” reads of new data added system called Umbra and compared with Flink [36].
to a table are also supported, so that jobs can treat a However,Flinkwasnotdesignedtohandlesuchworkloads.
Delta table as a message bus. Tatbul [111] enumerates the Furthermore, the performance gap between an in-memory
challenges in streaming data integration, such as the lack databasesystemandadedicatedSPEthathandlesstreaming
of a common semantic model across different systems, applicationshasbeenreportedinpriorwork[66].Itremains
optimization challenges, and transactional issues. To date, to be seen whether the proposed approach implemented in
these challenges are still present and this is largely due to: adatabasesystemcanoutperformastate-of-the-artTSPSs,
(1) the diverse applications proposed in the literature, and suchasS-Store[78],TStream[134]andTSpoon[15],which
(2)eachsystemfocusesonanarrowlistoffeatures. arebetterabletohandleemergingSMVs-likeworkloads.
|        |     |          |           |              |     |             | Operational |     | Stream | Processing. |     | Katsifodimos |     | et  |
| ------ | --- | -------- | --------- | ------------ | --- | ----------- | ----------- | --- | ------ | ----------- | --- | ------------ | --- | --- |
| Meehan | et  | al. [77] | discussed | self-driving |     | vehicles as |             |     |        |             |     |              |     |     |
an example to motivate the need for streaming ingestion. al. [64] discussed a use case involving employing an
|            |      |                 |     |                  |     |            | SPE as a | backend | for | stateful | event-driven |     | applications, |     |
| ---------- | ---- | --------------- | --- | ---------------- | --- | ---------- | -------- | ------- | --- | -------- | ------------ | --- | ------------- | --- |
| They argue | that | the traditional |     | data integration |     | process is |          |         |     |          |              |     |               |     |
insufficient, given that the value of sensor data decreases such as microservices. An example of such a use case
|     |     |     |     |     |     |     | called stateful |     | function-as-a-service |     |     | was | also recently |     |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --------------------- | --- | --- | --- | ------------- | --- |
drasticallyovertime.Asaconsequence,theabilitytomake
decisionsbasedonthatdataisonlyuseful,iftheanalysisis demonstrated [16]. A set of requirements were discussed
includingACIDtransactions,globalstateconsolidation,and
doneinnearreal-time.Thereisalsoanecessitytomaintain
theorderoftimeseries,however,onlyifitcanbeprocessed the need for debugging and auditing. Those requirements
|     |     |     |     |     |     |     | are correlated |     | surprisingly | to  | those | required | by  | TSP, |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ------------ | --- | ----- | -------- | --- | ---- |
inatimelymanner(i.e.,notwaitinghoursforalargebatch
tobecomeavailable).Additionally,timeseriescanbecome including transactional shared state management during
streamprocessing.However,whethertheTSPSs,suchasS-
| very large | quickly, | particularly, |     | if sensor | sample | rates are |     |     |     |     |     |     |     |     |
| ---------- | -------- | ------------- | --- | --------- | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
high.Storingthisdatacanbecomeextremelyexpensive,and Store[78]canfullysatisfytherequirementsofoperational
|              |      |              |     |          |        |             | stream processing |     | still | remains | an  | open | question. | For |
| ------------ | ---- | ------------ | --- | -------- | ------ | ----------- | ----------------- | --- | ----- | ------- | --- | ---- | --------- | --- |
| it is likely | that | the entirety | of  | the time | series | need not be |                   |     |       |         |     |      |           |     |
stored,tocomputetherelevantanalytics. example, operational stream processing has a particular
|           |     |              |     |        |              |       | focus on | supporting | stateless |     | computing | paradigm. |     | In the |
| --------- | --- | ------------ | --- | ------ | ------------ | ----- | -------- | ---------- | --------- | --- | --------- | --------- | --- | ------ |
| Streaming |     | Materialized |     | Views. | Materialized | views |          |            |           |     |           |           |     |        |
contextofTSPquestionslikehowtosupportdebugging[70]
| (MVs)       | are essentially |            | stored | continuous    | queries | that are |               |       |        |     |           |             |     |        |
| ----------- | --------------- | ---------- | ------ | ------------- | ------- | -------- | ------------- | ----- | ------ | --- | --------- | ----------- | --- | ------ |
|             |                 |            |        |               |         |          | and isolation | [103] | during | the | execution | of stateful |     | stream |
| re-executed | as              | their base | data   | are modified. |         | MVs were |               |       |        |     |           |             |     |        |
processingasmicroservicesarealsointerestingtoexplore.
| developed                  | precisely | to  | address  | the inherent |     | inefficiencies |     |     |     |     |     |     |     |     |
| -------------------------- | --------- | --- | -------- | ------------ | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| in store-first-query-later |           |     | database | technologies |     | for query-     |     |     |     |     |     |     |     |     |
heavy, non-ad hoc workloads observed in many analytics 9.3 NovelHardwarePlatforms
| applications | [50]. | It  | conceptually |     | shares | many high- |     |     |     |     |     |     |     |     |
| ------------ | ----- | --- | ------------ | --- | ------ | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
level similarities with stateful stream processing that Modern hardware advancements have made servers with
continuouslyupdatesstates.TraditionalMValgorithmsare hundreds of cores and several terabytes of main memory
not optimized for high-velocity data stream processing. available. Such advancements have driven researchers to
They still require storing the entire dataset and do not rethinkTSPSsandputemerginghardwareplatformstogood
fully exploit the time-oriented semantics of the data and use [135]. Next, we take a closer look at multi-/many-core
queriesinmodernanalyticsworkloads.Forexample,stream architectures, non-volatile storage, and trusted computing
| updates | are often | append-only |     | or peak-only, |     | while MVs | platforms. |     |     |     |     |     |     |     |
| ------- | --------- | ----------- | --- | ------------- | --- | --------- | ---------- | --- | --- | --- | --- | --- | --- | --- |
are designed to treat random updates as first-class citizens. Multi-/Many-core Architectures. In order to
There is a rising need for streaming materialized views support shared mutable states, TSPSs have a potential
(SMVs), which require the system to be able to handle system bottleneck, namely, concurrent state accesses.
high-velocityinputs,continuouslyupdatestateswithnearly TStream [134] is an example of a recent attempt to utilize
randomaccesspatterns,andsharetheupdatedstatesamong multicore CPUs successfully and improve concurrent
concurrent running entities (e.g., continuous queries). For shared state access performance. It exploits parallelism
example, a recent work by Verheijde et al. [120] proposed opportunities via two novel techniques: dual-mode
S-Query, which focuses on exposing the live uncommitted scheduling and a dynamic transaction restructuring
state and past consistent state with serializable isolation of mechanism. However, state-of-the-art TSPSs (e.g.,

ASurveyonTransactionalStreamProcessing 25
TStream [134]) are still not scalable when there are data and codes by loading them into an isolated and
lots of input dependencies (i.e., the state access of one encrypted memory area. However, to bring TSP on TCPs
event depends on the state access results of another event) isnontrivialandrequiresfurtherinvestigation.Inparticular,
among the processing of multiple events. More broadly TCPs provide limited physical memory, and therefore,
beyond relational analytics, more investigation is required how to perform transactional stateful stream processing
to further enhance existing TSPSs when dealing with within limited memory remains an open question [79]. In
more complicated types of workloads (e.g., machine addition,weneedtoscalethesystemtomultipleTCPsina
learning, graph aggregation). We also need to revisit the distributed environment, which is sometimes a must, since
currentdesignofTSPSsfortheemergingmulti-/many-core eachcomputingnodehasitsowncomputationallimits.
architectureswithhigh-bandwidthmemory,whichprovides
a potential solution to the common system bottleneck seen
in TSPSs. Further scaling TSPSs on multi-node settings
10 Conclusion
withthesameorrelaxedcorrectnessguaranteesisnontrivial
andrequiresextensivefutureexploration[112]. Driven by the realization that static data is merely a
Non-Volatile Storage. Non-Volatile Memory (NVM) partial snapshot of a data stream, the data technology
has emerged as a promising technology that brings industry is focusing increasingly on data streams (also
many new opportunities and challenges. NVM technology known as data-in-motion). The current predominant data
promisestocombinethebyte-addressabilityandlowlatency management solution, i.e., database systems fall short of
of DRAM with the persistence and density of block- the throughput and latency requirements demanded by
based storage media. However, NVM suffers from a modern data processing applications. Specialised stream
limitedcellenduranceandread-writeasymmetryregarding processing engines (SPEs) were subsequently developed,
latency.Fernandoetal.[91]haverecentlyexploredefficient such as Storm, Flink and Spark Streaming. Despite their
approachestosupportanalyticalworkloadsonNVM,where architecturaldiversity,noneofthesesystemsaddressesone
anNVM-awarestoragelayoutfortablesispresentedbased of the primary features originally provided by database
onamultidimensionalclusteringapproachandablock-like systems, i.e., support for transactions. TSPSs resolve such
structuretoutilizetheentirememorystack.Asarguedbythe issues by employing transactional semantics and providing
authors,thestoragestructuredesignedonNVMmayserve the opportunity to support novel applications and system
asthefoundationforTSPSs[99]inthefuture. optimizations. In this survey, we reviewed the application
Non-Volatile Memory Express (NVMe)-based solid- scenarios of TSP and discussed both theoretical models,
statedevices(SSDs)areexpectedtodeliverunprecedented actualdesigns,andimplementationofTSPSs.TSPSsrelieve
performance in terms of latency and peak bandwidth. For theburdenofmanagingstateconsistencyfromuserssothat
example, the recently announced PCIe 4.0-based NVMe they can focus on the development of complex streaming
SSDs[2]arealreadycapableofachievingapeakbandwidth applications. However, there is still a long way to go, and
of 4GB/s. Lee et al. [71] have recently investigated the future studies, including standard API specifications, new
performance limitations of current SPEs on managing types of accelerators, deep performance analysis, and the
applicationstatesonSSDsandhaveshownthatquery-aware development of new toolchains can significantly push the
optimization can significantly improve the performance of progressforward.
statefulstreamprocessingonSSDs.Theirpioneeringwork
is also highly valuable for TSPSs due to its strict ACID
and streaming property requirements. However, further 11 Competinginterests
investigationisrequired.
Trusted Computing Platforms. The demand for low- The authors declare the following financial
latency and the local processing of sensitive data in the interests/personalrelationshipswhichmaybeconsideredas
IoT requires that data be processed as much as possible potentialcompetinginterests:
near the source and calls for data stream processing on the The research leading to these results received funding
edge.However,edgedevicesareoftenvulnerabletoattacks from the National Research Foundation, Singapore and
becauseoftheirlimitedpowerandcomputingcapacity.As Infocomm Media Development Authority under its Future
a result, edge processing exposes sensitive data to severe Communications Research & Development Programme
security threats. Given the IoT’s exploding volume and under Grant Agreement No.FCP-SUTD-RG-2021-005,
edge devices’ weak nature satisfying stream processing the SUTD Start-up Research Grant (SRT3IS21164), the
requirements should incorporate a scalable and energy- DFG Priority Program (MA4662-5), the German Federal
efficientsecuritymechanism.Thus,aplausiblesolution[90] Ministry of Education and Research (BMBF) under grants
are trusted computing platforms (TCPs), which protect 01IS18025A (BBDC - Berlin Big Data Center) and

26 ShuhaoZhang,JuanSoto,andVolkerMarkl
01IS18037A(BIFOLD-BerlinInstitutefortheFoundations 18. Akidau, T., Bradshaw, R., Chambers, C., Chernyak, S.,
ofLearningandData). Fernndez-Moctezuma, R.J., Lax, R., McVeety, S., Mills, D.,
Perry, F., Schmidt, E., Whittle, S.: The dataflow model: A
practical approach to balancing correctness, latency, and cost
in massive-scale, unbounded, out-of-order data processing.
References ProceedingsoftheVLDBEndowment8,1792–1803(2015)
19. Alur, R., Hilliard, P., Ives, Z.G., Kallas, K., Mamouras, K.,
1. Apache flink 101 - the rise of stream processing and Niksic, F., Stanford, C., Tannen, V., Xue, A.: Synchronization
beyond: http://bigdatausecases.info/entry/ schemas(2021)
apache-flink-101-the-rise-of-stream-processing-and-be2y0o.nAd.rasu, A., Babu, S., Widom, J.: The cql continuous query
LastAccessed:2020-07-24 language: Semantic foundations and query execution. The
2. Corsair force series nvme ssd. https://hothardware.com/ VLDB Journal 15(2), 121–142 (2006). DOI 10.1007/
news/corsair-mp600 s00778-004-0147-z. URL http://dx.doi.org/10.1007/
3. Introducing kafka streams: Stream processing s00778-004-0147-z
made simple, https://www.confluent.io/blog/ 21. Arasu,A.,Cherniack,M.,Galvez,E.,Maier,D.,Maskey,A.S.,
introducing-kafka-streams-stream-processing-made-simple.Ryvkina,E.,Stonebraker,M.,Tibbetts,R.:Linearroad:Astream
LastAccessed:2022-07-31 datamanagementbenchmark. In:ProceedingsoftheThirtieth
4. Maxdb,https://maxdb.sap.com/ InternationalConferenceonVeryLargeDataBases-Volume30,
5. Rocksdb.http://rocksdb.org/ Vldb’04,pp.480–491.VLDBEndowment(2004). URLhttp:
6. Coral8,inc,http://www.coral8.com/(2008) //dl.acm.org/citation.cfm?id=1316689.1316732
7. treambase systems, inc., ttp://www.streambase.com/ 22. Armbrust, M., Das, T., Sun, L., Yavuz, B., Zhu, S., Murthy,
(2008) M., Torres, J., van Hovell, H., Ionescu, A., undefineduszczak,
8. Apache smaza, https://samza.apache.org/learn/ A.,undefinedwitakowski,M.,Szafran´ski,M.,Li,X.,Ueshin,T.,
documentation/0.7.0/container/state-management. Mokhtar, M., Boncz, P., Ghodsi, A., Paranjpye, S., Senster, P.,
html(2018) Xin, R., Zaharia, M.: Delta lake: High-performance acid table
9. Data Artisans Streaming Ledger Serializable storage overcloud object stores. Proc. VLDB Endow. 13(12),
ACID Transactions on Streaming Data, 34113424 (2020). DOI 10.14778/3415478.3415560. URL
https://www.data-artisans.com/blog/ https://doi.org/10.14778/3415478.3415560
serializable-acid-transactions-on-streaming-data 23. Ayad,A.M.,Naughton,J.F.:Staticoptimizationofconjunctive
(2018) queries with sliding windows over infinite streams. In:
10. Stateful stream processing in flink, https://ci. Proceedings of the 2004 ACM SIGMOD International
apache.org/projects/flink/flink-docs-stable/ Conference on Management of Data, SIGMOD ’04, p.
ops/state/state_backends.html (2018). URL 419430. Association for Computing Machinery, New York,
https://cwiki.apache.org/confluence/display/ NY, USA (2004). DOI 10.1145/1007568.1007616. URL
FLINK/Stateful+Stream+Processing https://doi.org/10.1145/1007568.1007616
11. Tikv,adistributedtransactionalkey-valuedatabase,https:// 24. Babu, S., Srivastava, U., Widom, J.: Exploiting k-constraints
tikv.org/(2020) to reduce memory overhead in continuous queries over data
12. Abadi, D.J., Ahmad, Y., Balazinska, M., Cetintemel, U., streams. ACM Trans. Database Syst. 29(3), 545–580 (2004).
Cherniack,M.,Hwang,J.H.,Lindner,W.,Maskey,A.,Rasin,A., DOI10.1145/1016028.1016032. URLhttp://doi.acm.org/
Ryvkina,E.,etal.:Thedesignoftheborealisstreamprocessing 10.1145/1016028.1016032
engine. In:CIDR’05,vol.5,pp.277–289(2005) 25. Bailis,P.,Ghodsi,A.:Eventualconsistencytoday:Limitations,
13. Abadi,D.J.,Carney,D.,C¸etintemel,U.,Cherniack,M.,Convey, extensions, and beyond: How can applications be built on
C., Lee, S., Stonebraker, M., Tatbul, N., Zdonik, S.: Aurora: eventuallyconsistentinfrastructuregivennoguaranteeofsafety?
A new model and architecture for data stream management. Queue 11(3), 2032 (2013). DOI 10.1145/2460276.2462076.
The VLDB Journal 12(2), 120–139 (2003). DOI 10.1007/ URLhttps://doi.org/10.1145/2460276.2462076
s00778-003-0095-z. URL http://dx.doi.org/10.1007/ 26. Barga,R.S.,Caituiro-Monge,H.:Eventcorrelationandpattern
s00778-003-0095-z detection in cedr. In: International Conference on Extending
14. Affetti,L.,Margara,A.,Cugola,G.:Flowdb:Integratingstream DatabaseTechnology,pp.919–930.Springer(2006)
processing and consistent state management. In: Proceedings 27. Bernstein, P., Newcomer, E.: Principles of Transaction
of the 11th ACM International Conference on Distributed and Processing: For the Systems Professional. Morgan Kaufmann
Event-basedSystems,Debs’17,pp.134–145.Acm,NewYork, PublishersInc.,SanFrancisco,CA,USA(1997)
NY,USA(2017). DOI10.1145/3093742.3093929. URLhttp: 28. Bernstein, P.A., Goodman, N.: Concurrency control in
//doi.acm.org/10.1145/3093742.3093929 distributed database systems. ACM Comput. Surv. 1981
15. Affetti,L.,Margara,A.,Cugola,G.:Tspoon:Transactionsona 13(2), 185–221 (1981). DOI 10.1145/356842.356846. URL
streamprocessor.JournalofParallelandDistributedComputing http://doi.acm.org/10.1145/356842.356846
140, 65–79 (2020). DOI https://doi.org/10.1016/j.jpdc.2020. 29. Botan,I.,Alonso,G.,Fischer,P.M.,Kossmann,D.,Tatbul,N.:
03.003. URL http://www.sciencedirect.com/science/ Flexible and scalable storage management for data-intensive
article/pii/S0743731518305082 stream processing. In: Proceedings of the 12th International
16. Akhter,A.,Fragkoulis,M.,Katsifodimos,A.:Statefulfunctions Conference on Extending Database Technology: Advances in
as a service in action. Proceedings of the VLDB Endowment Database Technology, EDBT ’09, p. 934945. Association for
12(12),1890–1893(2019) Computing Machinery, New York, NY, USA (2009). DOI 10.
17. Akidau,T.,Balikov,A.,Bekirog˘lu,K.,Chernyak,S.,Haberman, 1145/1516360.1516467. URL https://doi.org/10.1145/
J., Lax, R., McVeety, S., Mills, D., Nordstrom, P., Whittle, S.: 1516360.1516467
Millwheel: Fault-tolerant stream processing at internet scale. 30. Botan,I.,Cho,Y.,Derakhshan,R.,Dindar,N.,Haas,L.,Kim,
Proc. VLDB Endow. 6(11), 1033–1044 (2013-08). DOI 10. K.,Lee,C.,Mundada,G.,Shan,M.C.,Tatbul,N.,Yan,Y.,Yun,
14778/2536222.2536229 B., Zhang, J.: Design and implementation of the maxstream

ASurveyonTransactionalStreamProcessing 27
federatedstreamprocessingarchitecture(2009). DOI10.1007/ SymposiumonOperatingSystemsDesignandImplementation
978-3-642-14559-9 2 (OSDI),pp.205–218(2006)
31. Botan,I.,Fischer,P.M.,Kossmann,D.,Tatbul,N.:Transactional 42. Chang,F.,Dean,J.,Ghemawat,S.,Hsieh,W.C.,Wallach,D.A.,
stream processing. In: Proceedings of the 15th International Burrows,M.,Chandra,T.,Fikes,A.,Gruber,R.E.:Bigtable:A
Conference on Extending Database Technology, Edbt ’12, pp. distributedstoragesystemforstructureddata.ACMTransactions
204–215. Acm, New York, NY, USA (2012). DOI 10.1145/ onComputerSystems(TOCS)26(2),1–26(2008)
2247596.2247622. URL http://doi.acm.org/10.1145/ 43. Chen, H., Migliavacca, M.: Streamdb: A unified data
2247596.2247622 management system for service-based cloud application.
32. Braun, L., Etter, T., Gasparis, G., Kaufmann, M., Kossmann, In:2018IEEEInternationalConferenceonServicesComputing
D., Widmer, D., Avitzur, A., Iliopoulos, A., Levy, E., Liang, (SCC),pp.169–176.IEEE(2018)
N.: Analytics in motion: High performance event-processing 44. Chen, Q., Hsu, M.: Experience in extending query engine for
and real-time analytics in the same database. In: Proceedings continuousanalytics.In:T.BachPedersen,M.K.Mohania,A.M.
of the 2015 ACM SIGMOD International Conference on Tjoa (eds.) Data Warehousing and Knowledge Discovery, pp.
ManagementofData,SIGMOD’15,p.251264.Associationfor 190–202.SpringerBerlinHeidelberg,Berlin,Heidelberg(2010)
Computing Machinery, New York, NY, USA (2015). DOI 10. 45. Chen,Q.,Hsu,M.:Queryenginegridforexecutingsqlstreaming
1145/2723372.2742783. URL https://doi.org/10.1145/ process. In:InternationalConferenceonDataManagementin
2723372.2742783 GridandP2PSystems,pp.95–107.Springer(2011)
33. Brito,A.,Fetzer,C.,Sturzrehm,H.,Felber,P.:Speculativeout- 46. Chen,Q.,Hsu,M.,Zeller,H.:Experienceincontinuousanalytics
of-order event processing with software transaction memory. as a service (caaas). In: Proceedings of the 14th International
In: R. Baldoni (ed.) Proceedings of the Second International Conference on Extending Database Technology, EDBT/ICDT
Conference on Distributed Event-Based Systems, DEBS 2008, ’11, p. 509514. Association for Computing Machinery, New
Rome, Italy, July 1-4, 2008, ACM International Conference York,NY,USA(2011). DOI10.1145/1951365.1951426. URL
ProceedingSeries,vol.332,pp.265–275.ACM(2008).DOI10. https://doi.org/10.1145/1951365.1951426
1145/1385989.1386023. URL https://doi.org/10.1145/ 47. Conway,N.:Cisc499*:Transactionsanddatastreamprocessing.
1385989.1386023 Apr6,28(2008)
34. Carbone,P.,Ewen,S.,Fo´ra,G.,Haridi,S.,Richter,S.,Tzoumas, 48. Corbett,J.C.,Dean,J.,Epstein,M.,Fikes,A.,Frost,C.,Furman,
K.: State management in apache flink: Consistent stateful J.J., Ghemawat, S., Gubarev, A., Heiser, C., Hochschild, P.,
distributed stream processing. Proc. VLDB Endow. 10(12), et al.: Spanner: Googles globally distributed database. ACM
1718–1729(2017-08). DOI10.14778/3137765.3137777. URL TransactionsonComputerSystems(TOCS)31(3),1–22(2013)
https://doi.org/10.14778/3137765.3137777 49. Dubey,A.,Hill,G.D.,Escriva,R.,Sirer,E.G.:Weaver:Ahigh-
35. Carbone, P., Fragkoulis, M., Kalavri, V., Katsifodimos, A.: performance, transactional graph database based on refinable
Beyondanalytics:Theevolutionofstreamprocessingsystems. timestamps.ProceedingsoftheVLDBEndowment9(11)(2016)
In: Proceedings of the 2020 ACM SIGMOD International 50. Franklin, M., Krishnamurthy, S., Conway, N., Li, A.,
Conference on Management of Data, SIGMOD ’20, p. Russakovsky, A., Thombre, N.: Continuous analytics:
26512658. Association for Computing Machinery, New York, Rethinking query processing in a network-effect world.
NY,USA(2020).DOI10.1145/3318464.3383131.URLhttps: In:CIDR(2009)
//doi.org/10.1145/3318464.3383131 51. Garcia-Molina, H., Salem, K.: Sagas. SIGMOD Rec. 16(3),
36. Carbone,P.,Katsifodimos,A.,Ewen,S.,Markl,V.,Haridi,S., 249259 (1987). DOI 10.1145/38714.38742. URL https://
Tzoumas, K.: Apache flink: Stream and batch processing in a doi.org/10.1145/38714.38742
singleengine. BulletinoftheIEEEComputerSocietyTechnical 52. Gedik,B.,Andrade,H.,Wu,K.L.,Yu,P.S.,Doo,M.:Spade:the
CommitteeonDataEngineering36(4)(2015) systemsdeclarativestreamprocessingengine. In:Proceedings
37. Cetintemel, U., Du, J., Kraska, T., Madden, S., Maier, D., of the 2008 ACM SIGMOD international conference on
Meehan,J.,Pavlo,A.,Stonebraker,M.,Sutherland,E.,Tatbul, Managementofdata,pp.1123–1134.Acm(2008)
N.,Tufte,K.,Wang,H.,Zdonik,S.:S-store:Astreamingnewsql 53. Golab,L.,Bijay,K.G.,O¨zsu,M.T.:Onconcurrencycontrolin
systemforbigvelocityapplications.Proc.VLDBEndow.7(13), sliding window queries over data streams. In: Y. Ioannidis,
1633–1636 (2014). DOI 10.14778/2733004.2733048. URL M.H. Scholl, J.W. Schmidt, F. Matthes, M. Hatzopoulos,
http://dx.doi.org/10.14778/2733004.2733048 K. Boehm, A. Kemper, T. Grust, C. Boehm (eds.) Advances
38. Chandramouli,B.,Goldstein,J.,Barnett,M.,DeLine,R.,Fisher, in Database Technology - EDBT 2006, pp. 608–626. Springer
D., Platt, J.C., Terwilliger, J.F., Wernsing, J.: Trill: A high- BerlinHeidelberg,Berlin,Heidelberg(2006)
performanceincrementalqueryprocessorfordiverseanalytics. 54. Golab, L., O¨zsu, M.T.: Update-pattern-aware modeling and
Proceedings of the VLDB Endowment 8(4), 401–412 (2014). processingofcontinuousqueries. In:Proceedingsofthe2005
DOI10.14778/2735496.2735503. URLhttp://dx.doi.org/ ACM SIGMOD International Conference on Management of
10.14778/2735496.2735503 Data, SIGMOD ’05, p. 658669. Association for Computing
39. Chandrasekaran, S., Cooper, O., Deshpande, A., Franklin, Machinery,NewYork,NY,USA(2005).DOI10.1145/1066157.
M.J.,Hellerstein,J.M.,Hong,W.,Krishnamurthy,S.,Madden, 1066232. URL https://doi.org/10.1145/1066157.
S.R., Reiss, F., Shah, M.A.: Telegraphcq: Continuous dataflow 1066232
processing. In: Proceedings of the 2003 ACM SIGMOD 55. Golab, L., Prahladka, P., Ozsu, M.T.: Indexing time-evolving
InternationalConferenceonManagementofData,Sigmod’03, datawithvariablelifetimes.In:18thInternationalConferenceon
pp. 668–668. Acm, New York, NY, USA (2003). DOI 10. Scientific and Statistical Database Management (SSDBM’06),
1145/872757.872857. URLhttp://doi.acm.org/10.1145/ pp.265–274(2006). DOI10.1109/SSDBM.2006.29
872757.872857 56. Go¨tze,P.,Sattler,K.:Snapshotisolationfortransactionalstream
40. Chandrasekaran,S.,Franklin,M.:Remembranceofstreamspast: processing. In:EDBT(2019)
Overload-sensitivemanagementofarchivedstreams. In:VLDB 57. Group, S., et al.: Stream: The stanford stream data manager.
(2004) Tech.rep.,StanfordInfoLab(2003)
41. Chang,F.,Dean,J.,Ghemawat,S.,Hsieh,W.C.,Wallach,D.A., 58. Grulich,P.M.,Breß,S.,Zeuch,S.,Traub,J.,Bleichert,J.v.,Chen,
Burrows,M.,Chandra,T.,Fikes,A.,Gruber,R.E.:Bigtable:A Z., Rabl, T., Markl, V.: Grizzly: Efficient stream processing
distributedstoragesystemforstructureddata. In:7thUSENIX through adaptive query compilation. In: Proceedings of the

| 28  |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
ACM SIGMOD International Conference on Management of of the 9th Asia-Pacific Workshop on Systems, APSys ’18, pp.
Data(SIGMOD2020).AcmSigmod(2020) 9:1–9:7. Acm, New York, NY, USA (2018). DOI 10.1145/
| 59. Gu¨rgen, | L.,       | Roncancio, | C.,         | Labbe´, | C., Olive, | V.: Transactional |        |                  |     |     |                             |     |     |     |
| ------------ | --------- | ---------- | ----------- | ------- | ---------- | ----------------- | ------ | ---------------- | --- | --- | --------------------------- | --- | --- | --- |
|              |           |            |             |         |            |                   |        | 3265723.3265739. |     | URL | http://doi.acm.org/10.1145/ |     |     |     |
| issues       | in sensor | data       | management. |         | In:        | Proceedings       | of the |                  |     |     |                             |     |     |     |
3265723.3265739
| 3rd Workshop |     | on Data | Management |     | for | Sensor Networks: | In  |             |                      |     |             |     |                  |     |
| ------------ | --- | ------- | ---------- | --- | --- | ---------------- | --- | ----------- | -------------------- | --- | ----------- | --- | ---------------- | --- |
|              |     |         |            |     |     |                  |     | 72. Li, J., | et al.: Out-of-order |     | processing: | A   | new architecture | for |
ConjunctionwithVLDB2006,DMSN’06,p.2732.Association
|     |     |     |     |     |     |     |     | high-performancestreamsystems. |     |     |     | Proc.VLDBEndow.(2008) |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | --------------------- | --- | --- |
forComputingMachinery,NewYork,NY,USA(2006).DOI10.
|                       |     |     |     |                          |     |     |     | 73. Liarou,   | E., Goncalves, |     | R., Idreos,   | S.:    | Exploiting  | the power |
| --------------------- | --- | --- | --- | ------------------------ | --- | --- | --- | ------------- | -------------- | --- | ------------- | ------ | ----------- | --------- |
| 1145/1315903.1315910. |     |     | URL | https://doi.org/10.1145/ |     |     |     |               |                |     |               |        |             |           |
|                       |     |     |     |                          |     |     |     | of relational | databases      |     | for efficient | stream | processing. | In:       |
1315903.1315910
Proceedingsofthe12thInternationalConferenceonExtending
60. Hoffman,M.D.,Blei,D.M.,Bach,F.:Onlinelearningforlatent
|           |             |     |                 |     |        |                    |     | Database | Technology: |     | Advances | in Database | Technology, | pp. |
| --------- | ----------- | --- | --------------- | --- | ------ | ------------------ | --- | -------- | ----------- | --- | -------- | ----------- | ----------- | --- |
| dirichlet | allocation. |     | In: Proceedings |     | of the | 23rd International |     |          |             |     |          |             |             |     |
323–334(2009)
ConferenceonNeuralInformationProcessingSystems-Volume
74. Liarou,E.,Kersten,M.:Datacell:Buildingadatastreamengine
1,NIPS’10,p.856864.CurranAssociatesInc.,RedHook,NY,
ontopofarelationaldatabasekernel.In:VLDBPhDWorkshop
USA(2010)
(2009)
| 61. Huang, | Q., | Lee, P.P.C.: | Toward | high-performance |     |     | distributed |     |     |     |     |     |     |     |
| ---------- | --- | ------------ | ------ | ---------------- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
75. Madden,S.,Franklin,M.J.:Fjordingthestream:Anarchitecture
| streamprocessingviaapproximatefaulttolerance. |        |      |         |     |                           | Proc.VLDB |     |               |            |           |         |              |                 |              |
| --------------------------------------------- | ------ | ---- | ------- | --- | ------------------------- | --------- | --- | ------------- | ---------- | --------- | ------- | ------------ | --------------- | ------------ |
|                                               |        |      |         |     |                           |           |     | for queries   | over       | streaming | sensor  | data.        | In: Proceedings | 18th         |
| Endow.                                        | 10(3), | 7384 | (2016). | DOI | 10.14778/3021924.3021925. |           |     |               |            |           |         |              |                 |              |
|                                               |        |      |         |     |                           |           |     | International | Conference |           | on Data | Engineering, |                 | pp. 555–566. |
URLhttps://doi.org/10.14778/3021924.3021925
IEEE(2002)
62. Ishikawa,Y.,Sugiura,K.,Takao,D.:Faulttolerantdatastream
|            |     |             |     |           |         |     |            | 76. Marz, | N.: |     | Trident |     | API | Overview: |
| ---------- | --- | ----------- | --- | --------- | ------- | --- | ---------- | --------- | --- | --- | ------- | --- | --- | --------- |
| processing | in  | cooperation |     | with oltp | engine. | In: | A. Mondal, |           |     |     |         |     |     |           |
github.com/nathanmarz/storm/wiki/trident-apioverview.
| H. Gupta, | J.  | Srivastava, | P.K. | Reddy, | D. Somayajulu |     | (eds.) Big |     |     |     |     |     |     |     |
| --------- | --- | ----------- | ---- | ------ | ------------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
github.com/nathanmarz/storm/wiki/
| Data | Analytics, | pp. | 3–14. | Springer | International |     | Publishing, |     |     |     |     |     |     |     |
| ---- | ---------- | --- | ----- | -------- | ------------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
Trident-APIOverview
Cham(2018)
|              |     |            |         |          |     |                  |            | 77. Meehan,                    | J., Aslantas, | C., | Zdonik, | S., Tatbul,   | N., | Du, J.: Data |
| ------------ | --- | ---------- | ------- | -------- | --- | ---------------- | ---------- | ------------------------------ | ------------- | --- | ------- | ------------- | --- | ------------ |
| 63. Kallman, | R., | Kimura,    | H.,     | Natkins, | J., | Pavlo,           | A., Rasin, |                                |               |     |         |               |     |              |
|              |     |            |         |          |     |                  |            | ingestionfortheconnectedworld. |               |     |         | In:CIDR(2017) |     |              |
| A., Zdonik,  |     | S., Jones, | E.P.C., | Madden,  |     | S., Stonebraker, | M.,        |                                |               |     |         |               |     |              |
78. Meehan,J.,Tatbul,N.,Zdonik,S.,Aslantas,C.,Cetintemel,U.,
Zhang,Y.,Hugg,J.,Abadi,D.J.:H-store:Ahigh-performance,
Du,J.,Kraska,T.,Madden,S.,Maier,D.,Pavlo,A.,Stonebraker,
| distributedmainmemorytransactionprocessingsystem. |        |       |           |                             |         |     | Proc.     |             |                           |           |          |           |                  |             |
| ------------------------------------------------- | ------ | ----- | --------- | --------------------------- | ------- | --- | --------- | ----------- | ------------------------- | --------- | -------- | --------- | ---------------- | ----------- |
|                                                   |        |       |           |                             |         |     |           | M., Tufte,  | K.,                       | Wang, H.: | S-store: | Streaming | meets            | transaction |
| VLDB                                              | Endow. | 1(2), | 1496–1499 |                             | (2008). | DOI | 10.14778/ |             |                           |           |          |           |                  |             |
|                                                   |        |       |           |                             |         |     |           | processing. | Proc.                     | VLDB      | Endow.   | 8(13),    | 2134–2145        | (2015).     |
| 1454159.1454211.                                  |        |       | URL       | http://dx.doi.org/10.14778/ |         |     |           |             |                           |           |          |           |                  |             |
|                                                   |        |       |           |                             |         |     |           | DOI         | 10.14778/2831360.2831367. |           |          | URL       | https://doi.org/ |             |
1454159.1454211
10.14778/2831360.2831367
| 64. Katsifodimos, |     | A., | Fragkoulis, |     | M.: | Operational | stream |     |     |     |     |     |     |     |
| ----------------- | --- | --- | ----------- | --- | --- | ----------- | ------ | --- | --- | --- | --- | --- | --- | --- |
79. Meftah,S.,Zhang,S.,Veeravalli,B.,Aung,K.M.M.:Revisiting
| processing: |     | Towards | scalable | and | consistent |     | event-driven |            |     |          |        |       |            |           |
| ----------- | --- | ------- | -------- | --- | ---------- | --- | ------------ | ---------- | --- | -------- | ------ | ----- | ---------- | --------- |
|             |     |         |          |     |            |     |              | the design | of  | parallel | stream | joins | on trusted | execution |
applications.(2019)
|     |     |     |     |     |     |     |     | environments. |     | Algorithms | 15(6) | (2022). |     | DOI 10.3390/ |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ---------- | ----- | ------- | --- | ------------ |
65. Katsipoulakis,N.R.,Labrinidis,A.,Chrysanthis,P.K.:Aholistic
|                                |     |     |     |     |                        |     |     | a15060183. | URLhttps://www.mdpi.com/1999-4893/15/ |     |     |     |     |     |
| ------------------------------ | --- | --- | --- | --- | ---------------------- | --- | --- | ---------- | ------------------------------------- | --- | --- | --- | --- | --- |
| viewofstreampartitioningcosts. |     |     |     |     | Proc.VLDBEndow.10(11), |     |     |            |                                       |     |     |     |     |     |
6/183
| 1286–1297(2017-08). |     |     | DOI10.14778/3137628.3137639 |     |     |     |     |     |     |     |     |     |     |     |
| ------------------- | --- | --- | --------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
80. Miao,H.,Jeon,M.,Pekhimenko,G.,McKinley,K.S.,Lin,F.X.:
| 66. Kipf, | A., Pandey, | V.,      | Bo¨ttcher, | J., | Braun,           | L., Neumann, | T.,    |                |                                     |        |           |         |           |        |
| --------- | ----------- | -------- | ---------- | --- | ---------------- | ------------ | ------ | -------------- | ----------------------------------- | ------ | --------- | ------- | --------- | ------ |
|           |             |          |            |     |                  |              |        | Streambox-hbm: |                                     | Stream | analytics | on high | bandwidth | hybrid |
| Kemper,   | A.:         | Scalable | analytics  | on  | fast             | data. ACM    | Trans. |                |                                     |        |           |         |           |        |
|           |             |          |            |     |                  |              |        | memory.        | arXivpreprintarXiv:1901.01328(2019) |        |           |         |           |        |
| Database  | Syst.       | 44(1)    | (2019).    | DOI | 10.1145/3283811. |              | URL    |                |                                     |        |           |         |           |        |
81. Motwani,R.,Widom,J.,Arasu,A.,Babcock,B.,Babu,S.,Datar,
https://doi.org/10.1145/3283811
|     |     |     |     |     |     |     |     | M., Manku, | G., | Olston, | C., Rosenstein, |     | J., Varma, | R.: Query |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------- | --------------- | --- | ---------- | --------- |
67. Koliousis,A.,Weidlich,M.,CastroFernandez,R.,Wolf,A.L.,
|            |               |               |            |                |     |        |             | processing,             | resource | management, |                             | and approximation |     | ina data |
| ---------- | ------------- | ------------- | ---------- | -------------- | --- | ------ | ----------- | ----------------------- | -------- | ----------- | --------------------------- | ----------------- | --- | -------- |
| Costa,     | P., Pietzuch, |               | P.: Saber: | Window-based   |     | hybrid | stream      |                         |          |             |                             |                   |     |          |
|            |               |               |            |                |     |        |             | streammanagementsystem. |          |             | In:CIDR2003.StanfordInfoLab |                   |     |          |
| processing | for           | heterogeneous |            | architectures. |     | In:    | Proceedings |                         |          |             |                             |                   |     |          |
(2002)
ofthe2016InternationalConferenceonManagementofData,
82. Neumeyer,L.,Robbins,B.,Nair,A.,Kesari,A.:S4:Distributed
| Sigmod  | ’16, | pp. 555–569.             |     | Acm, | Acm, New | York,           | NY, USA |            |           |             |     |            |      |               |
| ------- | ---- | ------------------------ | --- | ---- | -------- | --------------- | ------- | ---------- | --------- | ----------- | --- | ---------- | ---- | ------------- |
|         |      |                          |     |      |          |                 |         | stream     | computing | platform.   |     | In: 2010   | IEEE | International |
| (2016). | DOI  | 10.1145/2882903.2882906. |     |      |          | URL http://doi. |         |            |           |             |     |            |      |               |
|         |      |                          |     |      |          |                 |         | Conference | on        | Data Mining |     | Workshops, | pp.  | 170–177. Ieee |
acm.org/10.1145/2882903.2882906
(2010)
68. Krishnamurthy,S.,Franklin,M.J.,Davis,J.,Farina,D.,Golovko,
83. Nguyen,T.M.,Schiefer,J.,Tjoa,A.M.:Sense&responseservice
P.,Li,A.,Thombre,N.:Continuousanalyticsoverdiscontinuous
|          |     |                 |     |     |          |     |        | architecture | (saresa): | an  | approach | towards | a real-time | business |
| -------- | --- | --------------- | --- | --- | -------- | --- | ------ | ------------ | --------- | --- | -------- | ------- | ----------- | -------- |
| streams. |     | In: Proceedings |     | of  | the 2010 | ACM | SIGMOD |              |           |     |          |         |             |          |
intelligencesolutionanditsuseforafrauddetectionapplication.
| International |     | Conference | on  | Management |     | of Data, | SIGMOD |     |     |     |     |     |     |     |
| ------------- | --- | ---------- | --- | ---------- | --- | -------- | ------ | --- | --- | --- | --- | --- | --- | --- |
In:DOLAP’05,pp.77–86.ACM(2005)
’10,p.10811092.AssociationforComputingMachinery,New
|                    |     |     |                             |     |     |     |     | 84. Noghabi, | S.A., | Paramasivam, |               | K., Pan, | Y.,    | Ramesh, N., |
| ------------------ | --- | --- | --------------------------- | --- | --- | --- | --- | ------------ | ----- | ------------ | ------------- | -------- | ------ | ----------- |
| York,NY,USA(2010). |     |     | DOI10.1145/1807167.1807290. |     |     |     | URL |              |       |              |               |          |        |             |
|                    |     |     |                             |     |     |     |     | Bringhurst,  | J.,   | Gupta,       | I., Campbell, | R.H.:    | Samza: | stateful    |
https://doi.org/10.1145/1807167.1807290
69. Kulkarni, S., Bhagat, N., Fu, M., Kedigehalli, V., Kellogg, C., scalablestreamprocessingatlinkedin.ProceedingsoftheVLDB
Mittal,S.,Patel,J.M.,Ramasamy,K.,Taneja,S.:Twitterheron: Endowment10(12),1634–1645(2017)
Streamprocessingatscale. In:Proceedingsofthe2015ACM 85. Olson,M.A.,Bostic,K.,Seltzer,M.I.:Berkeleydb.In:USENIX
SIGMOD International Conference on Management of Data, Annual Technical Conference, FREENIX Track, pp. 183–191
| Sigmod | ’15, | pp. 239–250. |     | Acm, | Acm, New | York, | NY, USA | (1999) |     |     |     |     |     |     |
| ------ | ---- | ------------ | --- | ---- | -------- | ----- | ------- | ------ | --- | --- | --- | --- | --- | --- |
(2015). DOI 10.1145/2723372.2742788. URL http://doi. 86. Ooi, B.C., Tan, K.L., Tung, A., Chen, G., Shou, M.Z., Xiao,
acm.org/10.1145/2723372.2742788 X., Zhang, M.: Sense the physical, walkthrough the virtual,
70. Kumar, A., Wang, Z., Ni, S., Li, C.: Amber: A debuggable managethemetaverse:Adata-centricperspective.arXivpreprint
dataflowsystembasedontheactormodel. Proc.VLDBEndow. arXiv:2206.10326(2022)
13(5),740753(2020). DOI10.14778/3377369.3377381. URL 87. Oyamada, M., Kawashima, H., Kitagawa, H.: Efficient
https://doi.org/10.14778/3377369.3377381 invocation of transaction sequences triggered by data streams.
71. Lee,G.,Eo,J.,Seo,J.,Um,T.,Chun,B.G.:High-performance In:2011InternationalConferenceonP2P,Parallel,Grid,Cloud
statefulstreamprocessingonsolid-statedrives. In:Proceedings andInternetComputing,pp.332–337.IEEE(2011)

ASurveyonTransactionalStreamProcessing 29
88. Oyamada, M., Kawashima, H., Kitagawa, H.: Continuous Springer-Verlag, Berlin, Heidelberg (2016). DOI 10.1007/
query processing with concurrency control: Reading updatable 978-3-319-44403-1 20. URL https://doi.org/10.1007/
resources consistently. In: Proceedings of the 28th Annual 978-3-319-44403-1_20
ACMSymposiumonAppliedComputing,SAC’13,p.788794. 102. Shaikh, S.A., Kitagawa, H.: Streamingcube: Seamless
Association for Computing Machinery, New York, NY, USA integration of stream processing and olap analysis.
(2013). DOI10.1145/2480362.2480514. URLhttps://doi. IEEE Access 8, 104,632–104,649 (2020). DOI
org/10.1145/2480362.2480514 10.1109/ACCESS.2020.2999572
89. Oyamada, M., Kawashima, H., Kitagawa, H.: Data stream 103. Shillaker, S., Pietzuch, P.: Faasm: Lightweight isolation for
processing with concurrency control. SIGAPP Appl. Comput. efficient stateful serverless computing. In: 2020 USENIX
Rev.13(2),5465(2013). DOI10.1145/2505420.2505425. URL AnnualTechnicalConference(USENIXATC20),pp.419–433.
https://doi.org/10.1145/2505420.2505425 USENIX Association (2020). URL https://www.usenix.
90. Park,H.,Zhai,S.,Lu,L.,Lin,F.X.:Streambox-tz:Securestream org/conference/atc20/presentation/shillaker
analyticsattheedgewithtrustzone. In:Proceedingsofthe2019 104. Shuhao Zhang, He, J., Zhou, A.C., He, B.: Briskstream:
USENIXConferenceonUsenixAnnualTechnicalConference, Scaling Data Stream Processing on Multicore Architectures.
USENIXATC19,p.537554.USENIXAssociation,USA(2019) In: Proceedings of the 2019 International Conference on
91. Philipp, G., Stephan, B., Kai-Uwe, S.: An nvm-aware storage Management of Data, SIGMOD ’19, pp. 705–722. ACM,
layoutforanalyticalworkloads.In:2018IEEE34thInternational Amsterdam, Netherlands (2019). DOI 10.1145/3299869.
ConferenceonDataEngineeringWorkshops(ICDEW),pp.110– 3300067. URLhttps://doi.acm.org/10.1145/3299869.
115(2018). DOI10.1109/icdew.2018.00025 3300067
92. Phua,C.,Lee,V.,Smith,K.,Gayler,R.:Acomprehensivesurvey 105. Silvestre, P.F., Fragkoulis, M., Spinellis, D., Katsifodimos,
ofdatamining-basedfrauddetectionresearch. arXiv:1009.6119 A.: Clonos: Consistent Causal Recovery for Highly-Available
(2010) StreamingDataflows,p.16371650. AssociationforComputing
93. Poess, M., Rabl, T., Jacobsen, H.A., Caufield, B.: Tpc-di: The Machinery,NewYork,NY,USA(2021). URLhttps://doi.
first industry benchmark for data integration. Proc. VLDB org/10.1145/3448016.3457320
Endow. 7(13), 13671378 (2014). DOI 10.14778/2733004. 106. Stonebraker,M.,C¸etintemel,U.,Zdonik,S.:The8requirements
2733009. URL https://doi.org/10.14778/2733004. of real-time stream processing. SIGMOD Rec. 34(4), 42–47
2733009 (2005). DOI 10.1145/1107499.1107504. URL http://doi.
94. Ramnarayan, J., Mozafari, B., Wale, S., Menon, S., Kumar, acm.org/10.1145/1107499.1107504
N., Bhanawat, H., Chakraborty, S., Mahajan, Y., Mishra, R., 107. Stonebraker,M.,Cetintemel,U.:StreamProcessing,pp.3771–
Bachhav,K.:Snappydata:Ahybridtransactionalanalyticalstore 3772.SpringerNewYork,NewYork,NY(2018).DOI10.1007/
built on spark. In: Proceedings of the 2016 International 978-1-4614-8265-9 371. URLhttps://doi.org/10.1007/
Conference on Management of Data, SIGMOD ’16, p. 978-1-4614-8265-9_371
21532156. Association for Computing Machinery, New York, 108. Stonebraker, M., Madden, S., Abadi, D.J., Harizopoulos, S.,
NY,USA(2016).DOI10.1145/2882903.2899408.URLhttps: Hachem, N., Helland, P.: The end of an architectural era: (it’s
//doi.org/10.1145/2882903.2899408 timeforacompleterewrite). In:ProcVLDBEndow.2007
95. Ray,M.,Lei,C.,Rundensteiner,E.A.:Scalablepatternsharing 109. Stonebraker, M., Rowe, L.A.: The design of postgres. ACM
on event streams*. In: Proceedings of the 2016 International SigmodRecord15(2),340–355(1986)
ConferenceonManagementofData,SIGMOD’16,p.495510. 110. Sturzrehm, H., Felber, P., Fetzer, C.: Tm-stream: An stm
Association for Computing Machinery, New York, NY, USA framework for distributed event stream processing. In:
(2016). DOI10.1145/2882903.2882947. URLhttps://doi. 2009 IEEE International Symposium on Parallel Distributed
org/10.1145/2882903.2882947 Processing,pp.1–8(2009). DOI10.1109/IPDPS.2009.5161084
96. Rundensteiner, E.A., Ding, L., Sutherland, T., Zhu, Y., 111. Tatbul, N.: Streaming data integration: Challenges and
Pielech, B., Mehta, N.: Cape: Continuous query engine with opportunities. In: 2010 IEEE 26th International Conference
heterogeneous-grained adaptivity. In: Proceedings of the on Data Engineering Workshops (ICDEW 2010), pp. 155–158
Thirtieth international conference on Very large data bases- (2010). DOI10.1109/ICDEW.2010.5452751
Volume30,pp.1353–1356.VLDBEndowment(2004) 112. Tatbul, N.: Transactional Stream Processing, pp. 4205–4211.
97. Ryvkina,E.,etal.:Revisionprocessinginastreamprocessing Springer New York, New York, NY (2018). DOI 10.1007/
engine:Ahigh-leveldesign. In:ICDE(2006) 978-1-4614-8265-9 80704. URL https://doi.org/10.
98. Sahin,O.C.,Karagoz,P.,Tatbul,N.:Streamingeventdetection 1007/978-1-4614-8265-9_80704
in microblogs: Balancing accuracy and performance. In: 113. Tatbul,N.,Zdonik,S.,Meehan,J.,Aslantas,C.,Stonebraker,M.,
M. Bakaev, F. Frasincar, I.Y. Ko (eds.) Web Engineering, pp. Tufte,K.,Giossi,C.,Quach,H.:Handlingshared,mutablestate
123–138.SpringerInternationalPublishing,Cham(2019) in stream processing with correctness guarantees. IEEE Data
99. Sattler, K.U.: Transactional stream processing on non-volatile Eng.Bull.38,94–104(2015)
memory,https://www.tu-ilmenau.de/dbis/research/ 114. Terry,D.,Goldberg,D.,Nichols,D.,Oki,B.:Continuousqueries
active-projects/transactional-stream-processing/ over append-only databases. SIGMOD Rec. 21(2), 321330
(2019) (1992). DOI 10.1145/141484.130333. URL https://doi.
100. Shahvarani,A.,Jacobsen,H.A.:Parallelindex-basedstreamjoin org/10.1145/141484.130333
onamulticorecpu.In:Proceedingsofthe2020ACMSIGMOD 115. Theodorakis,G.,Koliousis,A.,Pietzuch,P.,Pirk,H.:Lightsaber:
InternationalConferenceonManagementofData,SIGMOD’20, Efficient window aggregation on multi-core processors. Acm
p.25232537.AssociationforComputingMachinery,NewYork, Sigmod(2020). DOI10.1145/3318464.3389753
NY,USA(2020).DOI10.1145/3318464.3380576.URLhttps: 116. To,Q.C.,Soto,J.,Markl,V.:Asurveyofstatemanagementin
//doi.org/10.1145/3318464.3380576 big data processing systems. The VLDB Journal 27(6), 847–
101. Shaikh, S.A., Chao, D., Nishimura, K., Kitagawa, H.: 872 (2018). DOI 10.1007/s00778-018-0514-9. URL https:
Incremental continuous query processing over streams and //doi.org/10.1007/s00778-018-0514-9
relations with isolation guarantees. In: Proceedings, Part 117. To¨njes, R., Barnaghi, P., Ali, M., Mileo, A., Hauswirth, M.,
I, 27th International Conference on Database and Expert Ganz, F., Ganea, S., Kjærgaard, B., Kuemper, D., Nechifor,
SystemsApplications-Volume9827,DEXA2016,p.321335. S., et al.: Real time iot stream processing and large-scale

| 30  |     |     |     |     |     |     |     |     |     | ShuhaoZhang,JuanSoto,andVolkerMarkl |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
data analytics for smart city applications. In: poster session, Proceedings. www.cidrdb.org (2020). URL http://cidrdb.
| EuCNC’14.sn(2014) |     |     |     |     |     |     |     | org/cidr2020/papers/p7-zeuch-cidr20.pdf |     |     |     |     |     |     |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- | --- |
118. Toshniwal,A.,Taneja,S.,Shukla,A.,Ramasamy,K.,Patel,J.M., 133. Zhang, S., He, B., Dahlmeier, D., Zhou, A.C., Heinze, T.:
Kulkarni,S.,Jackson,J.,Gade,K.,Fu,M.,Donham,J.,etal.: Revisitingthedesignofdatastreamprocessingsystemsonmulti-
Storm@ twitter. In: Proceedings of the 2014 ACM SIGMOD coreprocessors. In:2017IEEE33rdInternationalConference
international conference on Management of data, pp. 147–156 onDataEngineering(ICDE),pp.659–670.Ieee(2017-04).DOI
| (2014) |     |     |     |     |     |     |     | 10.1109/icde.2017.119 |     |     |     |     |     |     |
| ------ | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | --- | --- | --- | --- |
119. Traub,J.,Grulich,P.M.,Cue´llar,A.R.,Breß,S.,Katsifodimos, 134. Zhang,S.,Wu,Y.,Zhang,F.,He,B.:Towardsconcurrentstateful
|     |       |            |               |     |        |             |      | stream | processing | on  | multicore | processors. | In: 2020 | IEEE |
| --- | ----- | ---------- | ------------- | --- | ------ | ----------- | ---- | ------ | ---------- | --- | --------- | ----------- | -------- | ---- |
| A., | Rabl, | T., Markl, | V.: Efficient |     | window | aggregation | with |        |            |     |           |             |          |      |
36thInternationalConferenceonDataEngineering(ICDE),pp.
| generalstreamslicing. |     |     | In:Edbt,pp.97–108(2019) |     |     |     |     |                  |     |                                 |     |     |     |     |
| --------------------- | --- | --- | ----------------------- | --- | --- | --- | --- | ---------------- | --- | ------------------------------- | --- | --- | --- | --- |
|                       |     |     |                         |     |     |     |     | 1537–1548(2020). |     | DOI10.1109/ICDE48307.2020.00136 |     |     |     |     |
120. Verheijde,J.,Karakoidas,V.,Fragkoulis,M.,Katsifodimos,A.:
|          |         |           |       |               |            |        |           | 135. Zhang, | S., Zhang, | F.,                          | Wu, Y., | He, B., | Johns, P.:  | Hardware- |
| -------- | ------- | --------- | ----- | ------------- | ---------- | ------ | --------- | ----------- | ---------- | ---------------------------- | ------- | ------- | ----------- | --------- |
| S-query: | Opening | the       | black | box of        | internal   | stream | processor |             |            |                              |         |         |             |           |
|          |         |           |       |               |            |        |           | conscious   | stream     | processing:                  | A       | survey. | SIGMOD Rec. | 48(4),    |
| state.   | In:     | 2022 IEEE | 38th  | International | Conference |        | on Data   |             |            |                              |         |         |             |           |
|          |         |           |       |               |            |        |           | 1829        | (2020).    | DOI 10.1145/3385658.3385662. |         |         | URL         | https:    |
Engineering(ICDE),pp.1314–1327.IEEE(2022)
//doi.org/10.1145/3385658.3385662
| 121. Vidyasankar,         |     | K.: Transactional |     | properties    | of               | compositions | of  |                                                             |      |               |        |       |                 |     |
| ------------------------- | --- | ----------------- | --- | ------------- | ---------------- | ------------ | --- | ----------------------------------------------------------- | ---- | ------------- | ------ | ----- | --------------- | --- |
|                           |     |                   |     |               |                  |              |     | 136. Zhang,Y.,Chen,R.,Chen,H.:Sub-millisecondstatefulstream |      |               |        |       |                 |     |
| internetofthingsservices. |     |                   |     | pp.1–6(2015). | DOI10.1109/ISC2. |              |     |                                                             |      |               |        |       |                 |     |
|                           |     |                   |     |               |                  |              |     | querying                                                    | over | fast-evolving | linked | data. | In: Proceedings | of  |
2015.7366218
|                                         |     |       |             |                                |       |                  |     | the 26th                 | Symposium    |      | on Operating | Systems                | Principles, | Sosp |
| --------------------------------------- | --- | ----- | ----------- | ------------------------------ | ----- | ---------------- | --- | ------------------------ | ------------ | ---- | ------------ | ---------------------- | ----------- | ---- |
| 122. Vidyasankar,                       |     | K.: A | transaction |                                | model | for executions   | of  |                          |              |      |              |                        |             |      |
|                                         |     |       |             |                                |       |                  |     | ’17,                     | pp. 614–630. | Acm, | New          | York, NY,              | USA (2017). | DOI  |
| compositionsofinternetofthingsservices. |     |       |             |                                |       | ProcediaComputer |     |                          |              |      |              |                        |             |      |
|                                         |     |       |             |                                |       |                  |     | 10.1145/3132747.3132777. |              |      | URL          | http://doi.acm.org/10. |             |      |
| Science83,195–202(2016).                |     |       |             | DOI10.1016/j.procs.2016.04.116 |       |                  |     |                          |              |      |              |                        |             |      |
1145/3132747.3132777
| 123. Vidyasankar, |             | K.: Transactional        |          | composition  |               | of executions | in       |                                                  |           |          |                  |     |                        |      |
| ----------------- | ----------- | ------------------------ | -------- | ------------ | ------------- | ------------- | -------- | ------------------------------------------------ | --------- | -------- | ---------------- | --- | ---------------------- | ---- |
|                   |             |                          |          |              |               |               |          | 137. Zhang,                                      | Y.,       | Mueller, | F.: Gstream:     | A   | general-purpose        | data |
| stream            | processing. |                          | In: 2016 | 27th         | International | Workshop      | on       |                                                  |           |          |                  |     |                        |      |
|                   |             |                          |          |              |               |               |          | streaming                                        | framework |          | on gpu clusters. |     | In: 2011 International |      |
| Database          | and         | Expert                   | Systems  | Applications |               | (DEXA),       | pp. 114– |                                                  |           |          |                  |     |                        |      |
|                   |             |                          |          |              |               |               |          | ConferenceonParallelProcessing,pp.245–254(2011). |           |          |                  |     |                        | DOI  |
| 118(2016).        |             | DOI10.1109/DEXA.2016.037 |          |              |               |               |          |                                                  |           |          |                  |     |                        |      |
10.1109/icpp.2011.22
| 124. Vossen,G.:ACIDProperties,pp.1–3. |                                            |         |     |                           | SpringerNewYork,New |     |        |                 |          |         |            |            |            |          |
| ------------------------------------- | ------------------------------------------ | ------- | --- | ------------------------- | ------------------- | --- | ------ | --------------- | -------- | ------- | ---------- | ---------- | ---------- | -------- |
|                                       |                                            |         |     |                           |                     |     |        | 138. Zhao,      | Y., Liu, | Z., Wu, | Y., Jiang, | G., Cheng, | J., Liu,   | K., Yan, |
| York,                                 | NY                                         | (2016). | DOI | 10.1007/978-1-4899-7993-3 |                     |     | 831-2. |                 |          |         |            |            |            |          |
|                                       |                                            |         |     |                           |                     |     |        | X.: Timestamped |          | state   | sharing    | for stream | analytics. | IEEE     |
| URL                                   | https://doi.org/10.1007/978-1-4899-7993-3_ |         |     |                           |                     |     |        |                 |          |         |            |            |            |          |
TransactionsonParallelandDistributedSystemspp.1–1(2021).
831-2
DOI10.1109/TPDS.2021.3073253
125. Wang,D.,Rundensteiner,E.A.,EllisonIII,R.T.:Activecomplex
|     |     |     |     |     |     |     |     | 139. Zinkevich, | M.: | Online | convex | programming | and generalized |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ------ | ------ | ----------- | --------------- | --- |
eventprocessingovereventstreams.Proc.VLDBEndow.4(10),
|     |     |     |     |     |     |     |     | infinitesimalgradientascent. |     |     | In:ProceedingsoftheTwentieth |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------- | --- | --- | ---------------------------- | --- | --- | --- |
634–645(2011).DOI10.14778/2021017.2021021.URLhttp:
|     |     |     |     |     |     |     |     | International |     | Conference | on  | International | Conference | on  |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ---------- | --- | ------------- | ---------- | --- |
//dx.doi.org/10.14778/2021017.2021021
MachineLearning,ICML’03,p.928935.AAAIPress(2003)
| 126. Weikum,                                        | G.,         | Vossen,   | G.:           | Dedication. |             | In: G.   | Weikum,  |     |     |     |     |     |     |     |
| --------------------------------------------------- | ----------- | --------- | ------------- | ----------- | ----------- | -------- | -------- | --- | --- | --- | --- | --- | --- | --- |
| G.                                                  | Vossen      | (eds.)    | Transactional |             | Information | Systems, | The      |     |     |     |     |     |     |     |
| Morgan                                              | Kaufmann    |           | Series        | in Data     | Management  |          | Systems, |     |     |     |     |     |     |     |
| p.                                                  | vii. Morgan | Kaufmann, |               | San         | Francisco   | (2002).  | DOI      |     |     |     |     |     |     |     |
| https://doi.org/10.1016/B978-1-55860-508-4.50028-4. |             |           |               |             |             |          | URL      |     |     |     |     |     |     |     |
http://www.sciencedirect.com/science/article/
pii/B9781558605084500284
| 127. Winter, | C.,   | Schmidt,    | T., Neumann, |               | T., Kemper, | A.:         | Meet me |     |     |     |     |     |     |     |
| ------------ | ----- | ----------- | ------------ | ------------- | ----------- | ----------- | ------- | --- | --- | --- | --- | --- | --- | --- |
| halfway:     | Split | maintenance |              | of continuous | views.      | Proceedings |         |     |     |     |     |     |     |     |
oftheVLDBEndowment13(11)
| 128. Wu,                               | Y., Arulraj, | J.,          | Lin, J., | Xian,         | R., Pavlo,  | A.: An       | empirical |     |     |     |     |     |     |     |
| -------------------------------------- | ------------ | ------------ | -------- | ------------- | ----------- | ------------ | --------- | --- | --- | --- | --- | --- | --- | --- |
| evaluation                             |              | of in-memory |          | multi-version | concurrency |              | control.  |     |     |     |     |     |     |     |
| Proc.VLDBEndow.10(7),781–792(2017-03). |              |              |          |               |             | DOI10.14778/ |           |     |     |     |     |     |     |     |
3067421.3067427
| 129. Wu,   | Y., Chan,   | C.Y., | Tan,    | K.L.: Transaction |     | healing:        | Scaling |     |     |     |     |     |     |     |
| ---------- | ----------- | ----- | ------- | ----------------- | --- | --------------- | ------- | --- | --- | --- | --- | --- | --- | --- |
| optimistic | concurrency |       | control | on multicores.    |     | In: Proceedings |         |     |     |     |     |     |     |     |
ofthe2016InternationalConferenceonManagementofData,
Sigmod’16,pp.1689–1704.Acm,Acm,NewYork,NY,USA
| (2016). | DOI | 10.1145/2882903.2915202. |     |     | URL | http://doi. |     |     |     |     |     |     |     |     |
| ------- | --- | ------------------------ | --- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
acm.org/10.1145/2882903.2915202
130. Wchter,H.,Reuter,A.:Thecontractmodel(1991)
| 131. Zaharia, | M., | Das, T., | Li, H., | Hunter, | T., Shenker, |     | S., Stoica, |     |     |     |     |     |     |     |
| ------------- | --- | -------- | ------- | ------- | ------------ | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
I.:Discretizedstreams:Fault-tolerantstreamingcomputationat
| scale.      | In:ProceedingsoftheTwenty-FourthACMSymposium |               |             |            |                 |       |            |     |     |     |     |     |     |     |
| ----------- | -------------------------------------------- | ------------- | ----------- | ---------- | --------------- | ----- | ---------- | --- | --- | --- | --- | --- | --- | --- |
| on          | Operating                                    | Systems       | Principles, |            | SOSP            | ’13,  | p. 423438. |     |     |     |     |     |     |     |
| Association |                                              | for Computing |             | Machinery, | New             | York, | NY, USA    |     |     |     |     |     |     |     |
| (2013).     | DOI10.1145/2517349.2522737.                  |               |             |            | URLhttps://doi. |       |            |     |     |     |     |     |     |     |
org/10.1145/2517349.2522737
| 132. Zeuch, | S.,              | Chaudhary,       | A.,           | Monte,      | B.D.,        | Gavriilidis, | H.,         |     |     |     |     |     |     |     |
| ----------- | ---------------- | ---------------- | ------------- | ----------- | ------------ | ------------ | ----------- | --- | --- | --- | --- | --- | --- | --- |
| Giouroukis, |                  | D., Grulich,     |               | P.M., Breß, | S.,          | Traub,       | J., Markl,  |     |     |     |     |     |     |     |
| V.:         | The nebulastream |                  | platform      |             | for data     | and          | application |     |     |     |     |     |     |     |
| management  |                  | in the           | internet      | of          | things.      | In: CIDR     | 2020,       |     |     |     |     |     |     |     |
| 10th        | Conference       |                  | on Innovative |             | Data Systems |              | Research,   |     |     |     |     |     |     |     |
| Amsterdam,  |                  | The Netherlands, |               | January     | 12-15,       | 2020,        | Online      |     |     |     |     |     |     |     |