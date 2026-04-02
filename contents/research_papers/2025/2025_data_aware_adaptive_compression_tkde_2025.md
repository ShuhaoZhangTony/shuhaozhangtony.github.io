IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024 4531
|     |     |     | Data-Aware |     |            | Adaptive |     |            | Compression |     |     |     |     |     |
| --- | --- | --- | ---------- | --- | ---------- | -------- | --- | ---------- | ----------- | --- | --- | --- | --- | --- |
|     |     |     |            |     | for Stream |          |     | Processing |             |     |     |     |     |     |
YuZhang ,FengZhang ,HourunLi ,ShuhaoZhang ,XiaoguangGuo ,YuxingChen ,
|     |     |     |     |     | AnqunPan |     | ,andXiaoyongDu |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | -------- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
Abstract—Stream processing has been in widespread use, and continuously incoming data streams, including sensor data[6]
| one of      | the most | common   | application |            | scenarios | is SQL        | query |              |     |                               |     |     |                  |     |
| ----------- | -------- | -------- | ----------- | ---------- | --------- | ------------- | ----- | ------------ | --- | ----------------------------- | --- | --- | ---------------- | --- |
|             |          |          |             |            |           |               |       | andfinancial |     | transactions[7].Nevertheless, |     |     | streamprocessing |     |
| on streams. |          | By 2021, | the global  | deployment | of        | IoT endpoints |       |              |     |                               |     |     |                  |     |
systemsgrapplewiththechallengeofescalatingdatavolumes
reached12.3billion,indicatingasurgeindatageneration.However,
the escalating demands for high throughput and low latency in asthescaleofdatastreamscontinuestogrow[8].Ononehand,
stream processing systems have posed significant challenges due the network bears significant strain from the sheer volume of
to the increasing data volume and evolving user requirements. stream data, hindering real-time functionality in the presence
Wepresentacompression-basedstreamprocessingengine,called
|     |     |     |     |     |     |     |     | of noticeable |     | transmission | delays. | On  | the other | hand, a high |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------------ | ------- | --- | --------- | ------------ |
CompressStreamDB,whichenablesadaptivefine-grainedstream
|            |          |     |            |          |     |               |     | rate | of data | arrival | can overload | server | memory, | as stream |
| ---------- | -------- | --- | ---------- | -------- | --- | ------------- | --- | ---- | ------- | ------- | ------------ | ------ | ------- | --------- |
| processing | directly | on  | compressed | streams, | to  | significantly | en- |      |         |         |              |        |         |           |
hance the performance of existing stream processing solutions. processingsystemstemporarilystoredatainmemory.Thus,it
CompressStreamDB utilizes nine diverse compression methods becomesimperativetoexploreinnovativeapproachesaimedat
tailoredfordifferentstreamdatatypesandintegratesacostmodel alleviating the memory and bandwidth pressures confronting
| to automatically |     | select     | the most | efficient       | compression     |          | schemes. |           |            |                |      |              |         |                   |
| ---------------- | --- | ---------- | -------- | --------------- | --------------- | -------- | -------- | --------- | ---------- | -------------- | ---- | ------------ | ------- | ----------------- |
|                  |     |            |          |                 |                 |          |          | stream    | processing | systems.       | Data | compression, |         | a conventional    |
| CompressStreamDB |     |            | provides | high throughput |                 | with low | latency  |           |            |                |      |              |         |                   |
|                  |     |            |          |                 |                 |          |          | technique | for        | minimizing     | file | sizes [9],   | [10],   | [11], [12], [13], |
| in stream        | SQL | processing | by       | identifying     | and eliminating |          | redun-   |           |            |                |      |              |         |                   |
|                  |     |            |          |                 |                 |          |          | can       | enhance    | the efficiency | of   | stream       | systems | and contribute    |
dantdataamongstreams.OurevaluationdemonstratesthatCom-
pressStreamDBimprovesaverageperformanceby3.84×andre- to a reduction in storage requirements when applied in stream
duces average delay by 68.0% compared to the state-of-the-art processingscenarios.
streamprocessingsolutionforuncompressedstreams,alongwith
|       |       |          |          |          |             |     |         | The  | utilization    | of  | compression | in stream | processing | is piv-  |
| ----- | ----- | -------- | -------- | -------- | ----------- | --- | ------- | ---- | -------------- | --- | ----------- | --------- | ---------- | -------- |
| 68.7% | space | savings. | Besides, | our edge | trials show | an  | average |      |                |     |             |           |            |          |
|       |       |          |          |          |             |     |         | otal | as it enhances | the | efficiency  | of stream | systems,   | offering |
throughput/priceratioof9.95×andathroughput/powerratioof
potentiallythreekeyadvantages.First,streamprocessingoften
7.32×comparedtotheclouddesign.
|     |     |     |     |     |     |     |     | involves | a substantial |     | volume | of continuous |     | input data with |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------------- | --- | ------ | ------------- | --- | --------------- |
Index Terms—Data compaction and compression, stream comparablefeatures,suchastimestamps[14],[15],transaction
processing,edgecomputing.
amounts[7],andsensorvalues[6].Notably,upto30%ofthedata
maybeduplicated[16].Throughdatacompression,theredun-
I. INTRODUCTION dancyindatacanbeeffectivelyminimizedduetothesimilarity
THE of input streams, thereby reducing the volume of stream data.
|     | contemporary |     | era | of Big Data | witnesses | extensive |     |     |     |     |     |     |     |     |
| --- | ------------ | --- | --- | ----------- | --------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
Second,instreamprocessingscenarios,theoverheadfrommem-
|     | use of | stream | processing | technologies | [1], | [2], | [3], [4]. |     |     |     |     |     |     |     |
| --- | ------ | ------ | ---------- | ------------ | ---- | ---- | --------- | --- | --- | --- | --- | --- | --- | --- |
In 2021, active endpoints reached 12.3 billion, reflecting a ory access and network transfer between nodes surpasses that
ofcomputation[17].Ourexperimentsrevealthattransmission
global9%increaseinconnectedIoTdevices[5].Notably,low
canconsumeupto70%ofthetimewitha500Mbpsnetwork.
latencyandreal-timearetwoofthemostprominentfeaturesof
|        |             |          |     |              |              |     |          | Consequently, |     | it is evident | that      | data compression |        | significantly |
| ------ | ----------- | -------- | --- | ------------ | ------------ | --- | -------- | ------------- | --- | ------------- | --------- | ---------------- | ------ | ------------- |
| stream | processing, | enabling |     | the analysis | and querying |     | of vast, |               |     |               |           |                  |        |               |
|        |             |          |     |              |              |     |          | enhances      | the | efficiency    | of stream | systems.         | Third, | the proven    |
utilityofdirectcomputingoncompresseddataextendstodata
Manuscriptreceived7June2023;revised26February2024;accepted4March
|     |     |     |     |     |     |     |     | science | applications |     | [18], [19], | [20], [21], | [22], | demonstrating |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ------------ | --- | ----------- | ----------- | ----- | ------------- |
2024.Dateofpublication19March2024;dateofcurrentversion7August2024.
itswidespreadperformancebenefits.
ThisworkwassupportedinpartbytheNationalNaturalScienceFoundationof
ChinaunderGrant62322213andGrant62172419,andinpartbyBeijingNova
|     |     |     |     |     |     |     |     | However, | constructing |     | compressed | streamdirect |     | processing |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------------ | --- | ---------- | ------------ | --- | ---------- |
ProgramunderGrant20220484137andGrant20230484397.Recommended
systemsfacesthreemajorchallenges.First,lowlatencyiscrucial
foracceptancebyS.Salihoglu.(Correspondingauthor:FengZhang.)
|     |     |     |     |     |     |     |     | for stream | processing |     | systems, | but the | encoding | time required |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ---------- | --- | -------- | ------- | -------- | ------------- |
YuZhang,FengZhang,HourunLi,XiaoguangGuo,andXiaoyongDuare
with the Key Laboratory of Data Engineering and Knowledge Engineering by compression methods often introduces significant delays.
(MOE),SchoolofInformation,RenminUniversityofChina,Beijing100872,
ExperimentsinSectionII-BrevealthatusingGzipmayaccount
| China | (e-mail: | yu-zhang21@ruc.edu.cn; |     | fengzhang@ruc.edu.cn; |     | lihourun@ |     |     |     |     |     |     |     |     |
| ----- | -------- | ---------------------- | --- | --------------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
ruc.edu.cn;xiaoguangguo@ruc.edu.cn;duyong@ruc.edu.cn). forupto90.5%oftheoverallstreamprocessingtimeforencod-
Shuhao Zhang is with the School of Computer Science and Engineering ing,anunacceptableoverhead.Second,theprocessingqueries
(SCSE),NanyangTechnologicalUniversity(NTU),Singapore639798(e-mail:
andinputdatainstreamprocessingscenariosaredynamicand
shuhao.zhang@ntu.edu.sg).
Yuxing Chen and Anqun Pan are with the Database R&D Department, subjecttomodificationbasedonuserneeds.Somecompression
Tencent Inc., Shenzhen 518000, China (e-mail: axingguchen@tencent.com; algorithms exhibit lower time overheads for compression and
aaronpan@tencent.com).
DigitalObjectIdentifier10.1109/TKDE.2024.3377710 decompression, while others offer higher compression ratios.
1041-4347©2024IEEE.Personaluseispermitted,butrepublication/redistributionrequiresIEEEpermission.
Seehttps://www.ieee.org/publications/rights/index.htmlformoreinformation.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

4532 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
(cid:2)
Toachieveoptimalperformance,compressionmustbeadaptive We introduce a system cost model to guide compressed
to different input workloads, necessitating a careful consider- stream processing and design an adaptive compression
ation of the advantages and disadvantages of each algorithm. algorithmselectorbasedonthismodel.
(cid:2)
Third, decompressing data before executing SQL queries can We devise a processing approach that directly executes
be time-consuming. In our experiments, the time overhead of SQL queries on compressed streams and conducts com-
decompressioncomparedtoqueryexecutionrangesfrom2.09× prehensiveexperimentstovalidateitseffectiveness.
to31.37×.Thisintroducesapotentialperformanceimpactdue
totheadditionaltimeandspacerequirementsfordecompression.
We introduce CompressStreamDB, a compression-based II. BACKGROUND
streamprocessingenginedesignedtoovercomethethreechal- A. StreamProcessingandStreamingSQL
lenges.First,addressingtheneedforlightweightandfastcom-
pressionalgorithmstomeetlow-latencyandreal-timerequire- Streamprocessing:Streamprocessing,atermindatascience,
|     |     |     |     |     |     |     | focuses | on the | real-time | processing |     | of continuous |     | streams | of  |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------ | --------- | ---------- | --- | ------------- | --- | ------- | --- |
mentsinstreamprocessing,CompressStreamDBintegratesnine
lightweightcompressionmethodstoenhanceefficiencyacross data,events,andmessages.Itencompassesvarioussystems,in-
variousinputstreams.Moreover,deployingthestreamprocess- cludingreactivesystems,dataflowsystems,andspecificclasses
|     |     |     |     |     |     |     | of real-time | systems |     | [31]. The | query | is  | the SQL | statement |     |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ------- | --- | --------- | ----- | --- | ------- | --------- | --- |
ingsystemonedgedevicesbringstheprocessorclosertodata
sources,facilitatingaccelerateddataprocessing.Second,wein- usedfordataprocessing,whichcanbefurthersubdividedinto
|     |     |     |     |     |     |     | different | operators. | In  | the stream | processing |     | context, | a   | stream |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---------- | --- | ---------- | ---------- | --- | -------- | --- | ------ |
troduceafine-grainedadaptivecompressionalgorithmselector
|     |     |     |     |     |     |     | comprises | a sequence |     | of tuples, | where | each | tuple | represents |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---------- | --- | ---------- | ----- | ---- | ----- | ---------- | --- |
capableofdynamicallychoosingthecompressionalgorithmthat
provides optimal performance benefits for input streams with an event with elements like timestamp, amounts, and values.
|                   |     |            |              |     |            |      | Tuples collectively |     | form | batches, | which | represent |     | processing |     |
| ----------------- | --- | ---------- | ------------ | --- | ---------- | ---- | ------------------- | --- | ---- | -------- | ----- | --------- | --- | ---------- | --- |
| varying features. |     | Our system | incorporates | a   | cost model | that |                     |     |      |          |       |           |     |            |     |
guides the selector’s decisions as the workload shifts, consid- blocks containing a specific number of tuples. Within a batch,
weusethetermcolumntodenoteelementsofdifferenttuplesin
eringpropertiessuchasthevaluerangeanddegreeofrepetition
|              |       |            |           |          |          |     | the same | field. | Stream | processing | finds | extensive |     | applications |     |
| ------------ | ----- | ---------- | --------- | -------- | -------- | --- | -------- | ------ | ------ | ---------- | ----- | --------- | --- | ------------ | --- |
| in the input | data. | This model | estimates | the time | consumed | by  |          |        |        |            |       |           |     |              |     |
eachcompressionalgorithm,enablingtheselectortochoosethe inscenariosrequiringminimallatency,real-timeresponsewith
minimaloverhead(e.g.,riskmanagement[32]andcreditfraud
mostefficientone.Third,weproposeamethodenablingdirect
queryingofcompresseddataifthedataarealignedinmemory, detection [14]), and predictable and approximate results (e.g.,
|                  |     |               |        |               |     |         | SQL queries | on  | data | streams | [15] | and click | stream | analyt- |     |
| ---------------- | --- | ------------- | ------ | ------------- | --- | ------- | ----------- | --- | ---- | ------- | ---- | --------- | ------ | ------- | --- |
| thereby avoiding |     | decompression | costs. | This approach |     | applies |             |     |      |         |      |           |        |         |     |
ics[33]).
queryoperationstocompresseddatawithminimalmodification,
ifhtedatamaintaintheirstructureaftercompression.Addition- StreamingSQL:Amongvariousfieldsofstreamprocessing,
|               |             |     |                        |     |            |     | Streaming | SQL | is one | of the | emerging |     | hot research |     | topics. |
| ------------- | ----------- | --- | ---------------------- | --- | ---------- | --- | --------- | --- | ------ | ------ | -------- | --- | ------------ | --- | ------- |
| ally, we view | lightweight |     | decompression-required |     | techniques |     |           |     |        |        |          |     |              |     |         |
as a specific case, integrable into CompressStreamDB. Our Streaming SQL can be perceived as the streaming version of
|     |     |     |     |     |     |     | SQL processing |     | on streams |     | of data, | instead | of  | the database. |     |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ---------- | --- | -------- | ------- | --- | ------------- | --- |
preliminaryworkhasbeenpresentedin[23].Inthispaper,we
|                   |     |              |     |             |            |     | Traditional | SQL | queries | process | the | complete | set | of available |     |
| ----------------- | --- | ------------ | --- | ----------- | ---------- | --- | ----------- | --- | ------- | ------- | --- | -------- | --- | ------------ | --- |
| add new platform, |     | new dataset, | new | compression | algorithm, |     |             |     |         |         |     |          |     |              |     |
andnewevaluation.Specifically,thenewideaofapplyingedge data in the database and generate definite results. In contrast,
streamingSQLneedstocontinuouslyprocessthearrivingdata,
devicesisvaluablecomparedtothecloud.Edgedevicesshow
potentialinstreamprocessingbecausetheyhavelowercostsand andtheresultisnon-determinedandconstantlychanging.Asa
canbedeployedclosetodatasources.Weanalyzethecostand result,thiscanraiseanumberofissues,suchashowtoreducethe
responsetime.StreamingSQLownsdeclarativenaturesimilarto
powerbenefitsofedgedevicesindetail.
We conducted experiments in both cloud and edge envi- SQL, and provides an effective stream processing technology,
|           |           |      |             |          |      |         | which largely | saves | the | time | and elevates |     | the productivity |     | in  |
| --------- | --------- | ---- | ----------- | -------- | ---- | ------- | ------------- | ----- | --- | ---- | ------------ | --- | ---------------- | --- | --- |
| ronments, | employing | four | widely-used | datasets | with | varying |               |       |     |      |              |     |                  |     |     |
streamdataanalysis.Besides,manystreamsystemshavebeen
| properties. | The | cloud platform | utilized | an Intel | Xeon | Plat- |     |     |     |     |     |     |     |     |     |
| ----------- | --- | -------------- | -------- | -------- | ---- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
inum 8269CY 2.5 GHz CPU, while the edge platform em- proposed, such as Apache Storm [34] and Apache Flink [35],
whoserelationalAPIissuitableforstreamanalysis,providing
ployedaRaspberryPi4B.Ourexperimentalresultsdemonstrate
thatCompressStreamDBoutperformsthestate-of-the-artstream asoliddevelopmentfoundationandproductivetools.
| processing       | approach, | achieving | maximum      | system   | efficiency. |       |                          |     |     |     |     |     |     |     |     |
| ---------------- | --------- | --------- | ------------ | -------- | ----------- | ----- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
| CompressStreamDB |           | exhibits  | a throughput | increase | of          | 3.84× |                          |     |     |     |     |     |     |     |     |
|                  |           |           |              |          |             |       | B. CompressionAlgorithms |     |     |     |     |     |     |     |     |
andanaveragelatencyreductionof68.0%.Intermsofspacesav-
ings,CompressStreamDBreducesdatastorageneedsby68.7%. Various compression algorithms have been proposed, but
Furthermore,theedgeplatformexhibitsathroughput/priceratio to ensure accurate query results, our system exclusively con-
thatis9.95×higherthanthecloudplatform,whileitsthrough-
|     |     |     |     |     |     |     | siders lossless |     | compression |     | algorithms. |     | Lossless | compres- |     |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ----------- | --- | ----------- | --- | -------- | -------- | --- |
put/powerratiois7.32×higherthanthatofthecloudplatform. sion algorithms can be categorized into heavyweight and
Overall,wemakethefollowingthreemajorcontributions. lightweight compression. Noteworthy heavyweight compres-
(cid:2)
Wedevelopacompressedstreamprocessingenginefeatur- sionalgorithms,suchasLempel-Zivalgorithms[10],[12]and
ing diverse lightweight compression methods applicable Huffmanencoding [9],[36],offerhighcompressionratiosbut
acrossvariousscenarios. involve complex encoding and decoding processes, causing
significanttimeoverhead.Giventhereal-timeandlow-latency
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4533
TABLEI
EAGERANDLAZYCOMPRESSIONMETHODSINLIGHTWEIGHTCOMPRESSION
requirements of stream processing, which cannot tolerate pro- Internet of Things, end devices, and user terminals to achieve
longed delays, our exploration of heavyweight compression real-time data processing and response, reducing the pressure
algorithms revealed that while they may achieve higher com- on bandwidth, storage, and computing resources caused by
pressionratios,theyalsoresultinlonger(de)compressiontimes, centralizedcomputing.Itmeetstherequirementsoflowlatency,
offering limited improvement in the performance and stability highbandwidth,anddatasecurity.Withtherapiddevelopment
of the stream system. In preliminary experiments, we utilized of Internet of Things, cloud computing, Big Data, and other
thecommonlyusedcompressiontoolGzipinstreamprocessing relevanttechnologies,edgecomputinghasbeenwidelyusedin
systems. However, the system with Gzip spent 90.5% of the fields such as smart homes [38], smart cities [39], industrial
total time in compression and less than 10% in transmission. Internet [40],andintelligenttransportation [41].
Despiteitshighcompressionratioandlowtransmissiontime,the The lightweight development of edge devices is the current
compressiontimeoverheadcouldleadtosystemdelaysoreven andfuturetrend.WiththesurgeofthemobileInternet,edgecom-
pauses.Hence,weadvocatetheuseoflightweightcompression putinghasextendedbeyondpersonalcomputersandserversto
algorithmstoexpeditestreamprocessing. encompassmobiledevices,includingedgecomputingplatforms
Lightweight compression: Lightweight compression repre- basedonmobilephones[42].FollowingtherapidprogressofIn-
sentsatrade-offbetweencompressionratioandtime,employing ternetofThings(IoT)technology,edgecomputinghasexpanded
relativelysimpleencodingmethods.Incontrasttoheavyweight into the realm of low-power and embedded devices, such as
compressionalgorithms,lightweightalternativessacrificesome RaspberryPi4B[43]andmicrocontrollers[44].Thesedevices,
compressionratioforfaster(de)compressiontimes.Weexam- characterized by smaller size, lower power consumption, and
ined a range of works [11], [13], [24], [25], [26], [27], [28], versatilitytoruninvariousenvironments,supportmultiplecom-
[29],[30]onlightweightcompressionalgorithms,coveringmost municationprotocolsanddataprocessingalgorithms.Theycan
commonlyusedones.Eachalgorithmhasitsuniqueadvantages perform tasks like anomaly detection [45], exoskeletons [46],
and disadvantages, which are appropriate to data streams with voiceactivation[47],objectdetection[48],andmore.Theedge
different characteristics. For instance, Elias Gamma encoding device market is anticipated to grow, driven by the increasing
and Elias Delta encoding [11] are suitable for small and large demand for real-time data processing and analysis, as well
numbers, respectively. Run Length Encoding [26] is effective as the need for low-latency, high-bandwidth, and secure data
for data with more repetition. The effectiveness of Null Sup- transmission.AccordingtoIDC’sforecast,theglobalnumberof
pression [13] depends on redundant leading zeros in the ele- connecteddevicesisexpectedtosurpass8billionby2025,with
ments.Bitmapanditsextensions[28],[29],[30]aresuitablefor approximately40%ofthesedevicessituatedattheedge[49].
compressingdatawithfewdistinctvalues. In stream data processing, edge computing can handle data
Eagerandlazycompression:Wecategorizetheselightweight atthepointofgeneration,alleviatingtheburdenofdatatrans-
compressionalgorithmsintotwogroups:eagercompressionand mission and storage. This enables faster real-time analysis of
lazy compression [37]. In Table I, we provide a summary of data. For instance, it finds applications in real-time detection
ninecommonlightweightcompressionalgorithmswiththetwo systems based on sensors [50], video stream analysis [51],
categories.Eagercompressionalgorithmscompresssubsetsof logisticstrackingsystems[52],networksecuritydetection[53],
input tuples as soon as they arrive, allowing them to process anddataprocessingforautonomousvehicles[48].Edgedevices
eachtuplewithoutwaiting.Ontheotherhand,lazycompression can efficiently compress and process stream data, meeting the
algorithmswaitfortheentiredatabatchbeforecompression.The real-timeandaccuracyrequirementsofpracticaltasks.
advantageofeageralgorithmsliesintheirabilitytoprocesseach
tupleinreal-time,whiletheadvantageoflazyalgorithmsistheir
capacity to leverage the similar redundancy in large datasets, III. MOTIVATION
achievingahighercompressionratio.
A. ProblemDefinitionandBasicIdea
Problem definition: We show the problem definition of pro-
C. EdgeComputing
cessing compressed stream as follows. The input data streams
Comparedtotraditionalcloudcomputingarchitecture,edge are unbounded sequences of tuples, which are generated from
computing pushes computing resources and services to the the data source. The data block to be processed in the stream
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

4534 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
| is referred | to as | window | w, containing | a         | sequence | of tuples |     |     |     |     |     |     |     |
| ----------- | ----- | ------ | ------------- | --------- | -------- | --------- | --- | --- | --- | --- | --- | --- | --- |
| of a preset | size. | We use | SQL queries   | to handle | these    | streams.  |     |     |     |     |     |     |     |
Eachquerycontainsdifferentoperators,includingprojection,
aggregation,groupby,etc.Givenachosencompressionalgo-
rithmτ,thestreamiscompressedatsource,andthecompressed
streamisdenotedasR(cid:2).Finally,compressedstreamsandqueries
aretransmittedtotheprocessor.Theresultofcompressedstream
processingconsistsoftuplesinstreamafteraseriesofqueries.
| Our optimization |     | aims at | minimizing | latency | while | increasing |     |     |     |     |     |     |     |
| ---------------- | --- | ------- | ---------- | ------- | ----- | ---------- | --- | --- | --- | --- | --- | --- | --- |
throughput.
Basicideaofcompressedstreamdirectprcocessing:Tosolve
| the problem, | our | basic | idea is compressed |     | stream | direct prco- |     |     |     |     |     |     |     |
| ------------ | --- | ----- | ------------------ | --- | ------ | ------------ | --- | --- | --- | --- | --- | --- | --- |
cessing.Indetail,wedevelopafine-grainedadaptivemodelto
selectappropriatecompressionschemesandperformmapping Fig.1. Exampleofsmartgrids.
| between       | compressed | data      | and operators. |     | For each | streaming    |     |     |     |     |     |     |     |
| ------------- | ---------- | --------- | -------------- | --- | -------- | ------------ | --- | --- | --- | --- | --- | --- | --- |
| SQL operator, |            | we modify | the number     | of  | bytes    | it reads and |     |     |     |     |     |     |     |
compressthevaluesituses.Inthisway,datacanbequeriedwith-
inthedataset,includingtimestamps,themeasurementvalue,the
outdecompression,thussavingbothtimeandspace.Notethat idsoftheplugandhouse,etc.
| efficient | lightweight | decompression-required |     |     | methods, | which |         |                  |     |     |                 |              |     |
| --------- | ----------- | ---------------------- | --- | --- | -------- | ----- | ------- | ---------------- | --- | --- | --------------- | ------------ | --- |
|           |             |                        |     |     |          |       | Dynamic | characteristics: |     | The | characteristics | of real-time |     |
canbringsignificantbenefits,shouldalsobeconsidered.Inour
electricityconsumptiondatainthestreamareconsistentlydy-
scenario,wetreatitasaspecialcase. namic.Fluctuationsinconsumptionpeaksandtroughs,house-
holdhabits,andusagepatternscauseconstantshiftsinthedata
|     |     |     |     |     |     |     | stream. | For instance, | when | a household | generates | substantial |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------------- | ---- | ----------- | --------- | ----------- | --- |
B. DynamicCharacteristicsinStreamProcessing
|     |     |     |     |     |     |     | power consumption |     | data | within | a short | span, this data | may |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | ---- | ------ | ------- | --------------- | --- |
Specialdynamisminstreamprocessing:Thedynamicnature
|     |     |     |     |     |     |     | manifest | as repeated | house | IDs | with changing | plug | IDs and |
| --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | ----- | --- | ------------- | ---- | ------- |
ofstreamdatamanifestsinthreekeyaspects.First,theattributes values within the stream. Similarly, during peak hours when
ofstreamdata,suchasvaluerangesandrepetitiondegrees,can
|     |     |     |     |     |     |     | multiple | households | are | consuming | electricity | simultaneously, |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | ---------- | --- | --------- | ----------- | --------------- | --- |
changeunpredictably,impactingtheachievablecompressionra- house IDs might frequently change while timestamps remain
tiosofdifferentalgorithms.Second,factorslikedatageneration
constant.
| speed and | network | delays | cause fluctuations |     | in the | arrival rate |              |     |                |          |             |          |     |
| --------- | ------- | ------ | ------------------ | --- | ------ | ------------ | ------------ | --- | -------------- | -------- | ----------- | -------- | --- |
|           |         |        |                    |     |        |              | Opportunity: |     | In traditional | database | processing, | analysis | of  |
of stream data, influencing system waiting times. Third, it is the content occurs beforehand, enabling pre-determination of
impossibletopredicthowfrequentlydatapropertiescanchange,
theprocessingmethod.Conversely,inastreamscenario,dataar-
necessitatingabalancebetweenefficiencyandoverheadwhen rivescontinuously,necessitatingimmediateprocessingasevents
determiningthere-decisionfrequencyfordynamicprocessing.
|     |     |     |     |     |     |     | appear. | Stream | processing | methods | lack | access to complete |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------ | ---------- | ------- | ---- | ------------------ | --- |
Differencesfromcolumncompressionindatabases:Thedis-
|     |     |     |     |     |     |     | information | in  | advance | due to | the dynamic | nature of | input |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------- | ------ | ----------- | --------- | ----- |
parities between stream processing and traditional databases datastreams.Consequently,real-timeprocessingmethodsneed
callforinnovativecompressionstrategies.Traditionaldatabases
adaptivechangesastheinputstreamevolves.Asdemonstrated
| perform | holistic | operations | post | full data | scanning, | enabling |     |     |     |     |     |     |     |
| ------- | -------- | ---------- | ---- | --------- | --------- | -------- | --- | --- | --- | --- | --- | --- | --- |
inSectionVII,oursolution,CompressStreamDB,significantly
| the selection | of  | compression | algorithms | based | on  | overall data |     |     |     |     |     |     |     |
| ------------- | --- | ----------- | ---------- | ----- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
outperformsstaticprocessingmethods,highlightingitssuperior
attributes.Inaddition,compressionindatabasesfocusesmoreon
performanceindynamicenvironments.
compressionratiosratherthanlow-latencyreal-timeprocessing.
| Conversely, | stream | processing | involves | real-time, |     | unbounded |     |     |     |     |     |     |     |
| ----------- | ------ | ---------- | -------- | ---------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
D. WidespreadUseofCompressedStreamDirectProcessing
datastreamsthatconstantlyevolve,necessitatingdynamicup-
datestocompressionmethodstoadapttothesechanges. Ourcompressedstreamdirectprocessingsolutionoffersex-
|     |     |     |     |     |     |     | tensive | applicability | across | numerous | stream | applications. | We  |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------------- | ------ | -------- | ------ | ------------- | --- |
presentillustrativeexamplesshowcasingitsversatilityinvarious
C. CaseStudy
scenarios.
(cid:2)
Fig.1showsamotivationexampletoillustratethecomparison IoT sensor data from the smart grid domain [54] is an
betweenstaticprocessingintraditionaldatabasesanddynamic underlying scenario, which involves the analysis of en-
processing in a stream scenario. It uses a case study from ergyconsumptionmeasurements.Thisaimstooffershort-
smartgrids[54].Thesmarthomemarketisprojectedtoreach termloadpredictionsandreal-timedemandmanagement.
a volume of 51.23 billion by 2026, with an estimated 84.9 However,dynamicworkloadfluctuationspresentreal-time
millionactivehomesandanannualgrowthrateof11.7%[55]. challenges.Leveragingcompressedstreamdirectprocess-
Thisdatasetcomprisesover4,055millionenergyconsumption ingcansignificantlyenhancethroughput,enablingefficient
measurements collected from smart plugs installed in private processingoflargedatavolumeswithinshorttimeframes.
(cid:2)
households. It encompasses data from 2,125 plugs distributed Real-timedecisioninlinearroadbenchmark[56]specifies
across40housesoveronemonth.Sevenattributesarecontained anexpresswayvariabletollingsystem.Eachvehicleonthe
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4535
|     |     |     |     |     |     |     |     | Fig.3. CompressStreamDBframework. |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- |
Fig.2. Totaltimebreakdown.
highwaytransmitsitslocationthroughsensors,whichare
incollaborationwiththeserver,encompassingdatasourceslike
utilizedtocalculatetollsbasedonthespecificroadsection.
|     |     |     |     |     |     |     |     | sensors | or smartphones, |     | or intermediate |     | nodes | handling | data. |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | --------------- | --- | --------------- | --- | ----- | -------- | ----- |
Lowertollsincentivizetheuseoflesscongestedroads.Our
Leveraginglightweightcompressionalgorithms,evenresource-
solutionenablesthesystemtoefficientlyprocesssubstan-
|     |     |     |     |     |     |     |     | constrained | devices | like | data | sources | can | perform | compres- |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ------- | ---- | ---- | ------- | --- | ------- | -------- |
tialvolumesofstreamingvehiclelocationdata,facilitating
|     |     |     |     |     |     |     |     | sion. Consequently, |     | our | system | accommodates |     | a   | multi-layer |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --- | ------ | ------------ | --- | --- | ----------- |
moreeffectivedecision-makingintolladjustments.
(cid:2) architecturewithmultiplecompressionclientlayers,whilethe
| Cluster | management |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
[57] can monitor the execution of client-serversetuprepresentsasimplifiedmodel.Compression
| computation |     | tasks. | The | coming | data relate | to the | status |     |     |     |     |     |     |     |     |
| ----------- | --- | ------ | --- | ------ | ----------- | ------ | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
functionalitiesaredeployedontheclientside.Inadistributedar-
ofthecluster,includingtasksubmission,stateofsuccess
chitecture,individualclientsperformindependentcompression
| or  | failure, | etc. The | anomaly | detection |     | with unexpected |     |     |     |     |     |     |     |     |     |
| --- | -------- | -------- | ------- | --------- | --- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
withoutcoordination.Inscenarioswhereasinglequery’sinput
failuresshouldemitassoonaspossible.Oursolutioncan
dataoriginatesfrommultipleclients,eachclientautonomously
providemorerapidresponseforanomalydetection.
|         |       |           |        |               |     |           |      | determines | its compression |     | strategy |     | based on | the specific | data |
| ------- | ----- | --------- | ------ | ------------- | --- | --------- | ---- | ---------- | --------------- | --- | -------- | --- | -------- | ------------ | ---- |
| Various | other | real-time | stream | applications, |     | including | man- |            |                 |     |          |     |          |              |      |
characteristics.Theservermanagestheprocessingofquerieson
| ufacturing | equipment |     | detection | [58], | ship behavior |     | predic- |     |     |     |     |     |     |     |     |
| ---------- | --------- | --- | --------- | ----- | ------------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
compressedstreamdata,housingthekernelfunctionsnecessary
| tion [59],       | and temporal |        | event       | sequence | detection     | [60], | neces- |               |       |          |      |           |     |         |            |
| ---------------- | ------------ | ------ | ----------- | -------- | ------------- | ----- | ------ | ------------- | ----- | -------- | ---- | --------- | --- | ------- | ---------- |
|                  |              |        |             |          |               |       |        | for executing | these | queries. | It’s | important |     | to note | that while |
| sitate efficient |              | stream | processing. | Fig.     | 2 illustrates | the   | break- |               |       |          |      |           |     |         |            |
CompressStreamDBisprimarilydesignedfordirectprocessing
downoftimeutilizationintheseapplications.Thecompletebar
|         |             |          |     |                 |     |        |          | of compressed |     | stream | data, it | does | not dismiss | the | inclusion |
| ------- | ----------- | -------- | --- | --------------- | --- | ------ | -------- | ------------- | --- | ------ | -------- | ---- | ----------- | --- | --------- |
| denotes | the overall | duration |     | of uncompressed |     | stream | process- |               |     |        |          |      |             |     |           |
ofefficientcompressionalgorithmsthatrequiredecompression.
| ing, with | the white | segment |     | representing | the | portion | of time |          |         |            |      |     |        |            |        |
| --------- | --------- | ------- | --- | ------------ | --- | ------- | ------- | -------- | ------- | ---------- | ---- | --- | ------ | ---------- | ------ |
|           |           |         |     |              |     |         |         | They can | also be | integrated | into | the | system | and should | not be |
consumedbynetworktransmission.Notably,witha500Mbps
ignored.
| bandwidth | network, | network |     | transmission | occupies | over | 70% |           |     |             |           |     |                  |     |     |
| --------- | -------- | ------- | --- | ------------ | -------- | ---- | --- | --------- | --- | ----------- | --------- | --- | ---------------- | --- | --- |
|           |          |         |     |              |          |      |     | Scenario: | In  | a streaming | scenario, |     | CompressStreamDB |     | dy- |
ofthetotaltime.Evenona1Gbpsnetwork,transmissionstill
|          |           |     |        |             |      |            |     | namically | selects           | compression |        | algorithms |     | and conducts | fine-     |
| -------- | --------- | --- | ------ | ----------- | ---- | ---------- | --- | --------- | ----------------- | ----------- | ------ | ---------- | --- | ------------ | --------- |
| accounts | for about | 50% | of the | total time. | This | highlights | the |           |                   |             |        |            |     |              |           |
|          |           |     |        |             |      |            |     | grained   | compression-based |             | stream | processing |     | based        | on speci- |
bottleneckcreatedbytransmissiontimeinstreamapplications,
fiedparameterslikenetworkthroughputandperformancemet-
underscoring the critical need for the advantages offered by ricsofclientsandservers.Thecompressionalgorithmselection
compressedstreamdirectprocessing.
aimstooptimizethesystem’soverallperformance,specifically
tominimizethetotalprocessingtime.
IV. COMPRESSSTREAMDBFRAMEWORK
|                                   |     |                |     |            |                  |            |     | Workflow:         | After | the          | data | are generated |         | in the         | client of |
| --------------------------------- | --- | -------------- | --- | ---------- | ---------------- | ---------- | --- | ----------------- | ----- | ------------ | ---- | ------------- | ------- | -------------- | --------- |
|                                   |     |                |     |            |                  |            |     | CompressStreamDB, |       | the          | data | mainly        | undergo | a series       | of pro-   |
| We propose                        |     | a fine-grained |     | compressed | stream           | processing |     |                   |       |              |      |               |         |                |           |
|                                   |     |                |     |            |                  |            |     | cesses including  |       | compression, |      | transmission, |         | decompression, |           |
| framework,calledCompressStreamDB, |     |                |     |            | andweshowoursys- |            |     |                   |       |              |      |               |         |                |           |
andquery,whichisalsothebasisofourproposedsystemcost
temdesigninthissection.
model.Priortocompression,theselectorpreloadsthedataand
|     |     |     |     |     |     |     |     | identifies | the compression |     | algorithm |     | that ensures | optimal | per- |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --------------- | --- | --------- | --- | ------------ | ------- | ---- |
A. Overview
formance.Thisdecision-makingprocessreliesonourcompre-
CompressStreamDB addresses the challenges mentioned in hensive cost model, considering various factors from machine
Section I, effectively mitigating time and space overhead in metrics and network conditions to the effectiveness and cost
stream processing. It dynamically selects compression algo- of compression algorithms (refer to Section IV-C for details).
rithmsandseamlesslyintegratesthemintostreamprocessing. Our system operates at batch granularity, employing distinct
Structure: The CompressStreamDB framework comprises compression algorithms for each data column, as discussed in
twocorecomponents:theclientandserver,depictedinFig.3. SectionII.Subsequently,thecompresseddataistransmittedto
The client has a compression algorithm selector based on the the server, where it is processed alongside the corresponding
| cost model. | This | selector | is  | tasked with | data | collection | and | SQLqueries. |     |     |     |     |     |     |     |
| ----------- | ---- | -------- | --- | ----------- | ---- | ---------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
optimal compression algorithm selection. Note that the term Batch:InCompressStreamDB,streamdataareprocessedat
“client”referstodevicesseekingcompressedstreamprocessing batch granularity. The batch size operates independently from
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

4536 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
thewindowsizeinstreamingSQL.Thewindowsizepertainsto largerwindowsthatspanmultiplebatches,reselectionimpacts
arangeconceptwithinSQL,whereasthebatchsizerepresents only subsequent batches, without requiring recompression of
the processing granularity of the query engine [1], [14], [15]. previouslycompressedbatches.
It’s worth noting that a batch can be smaller than a window Supported data types: CompressStreamDB not only incor-
orencompassmultiplewindows.Thebatchsizesettingplaysa porates lightweight compression algorithms for integers, but
dual role since the growth of batch size can increase both the alsosupportsoperationsonfloating-pointnumbersandstrings.
latencyandthecompressionratio.Wedeterminethebatchsize Floating-point items can be converted into integers via multi-
usingdynamicsampling,whereitsoverheadcanbeamortized plying by a factor of 10n [13]. The n here denotes the max-
duringstreamprocessing.Userscanspecifyandadjustthebatch imum number of decimal places within the data column. For
sizebasedonactualrequirements.Experimentalinsightscanbe instance,inthecontextofmeasuredvaluesinsmartgrids[54],
foundinSectionVII. thevaluesincludenumberssuchas{3.216,11.721,9.8}.With
Flexibility: CompressStreamDB stands as a highly flexible a maximum of 3 decimal places, all data can be scaled by a
system, facilitating not only the support for nine existing data factor of 103, resulting in {3216, 11721, 9800}. Given that
compression methods but also the seamless integration of ad- data columns typically exhibit closely aligned decimal places,
ditional compression algorithms. This flexibility is designed overflowisuncommoninmostscenarios.Overflowrisksarise
to effectively address the increasing demand for stream data onlywhentheconvertedintegerexceeds231(thelimitofa32-bit
processing.TheflexibilityofCompressStreamDBempowersit integer).Insuchcases,werecommendeitherutilizinga64-bit
toadeptlyhandleandanalyzediversedatastreams,varyingin integerrepresentationorexploringtheoptionofemployingthe
types, scales, and rates. This capability allows the system to dictionary encoding method. For strings, they can be mapped
betteralignwiththedemandsofreal-worldtasks. to integers using dictionary encoding, which is a widely-used
Portability: The client of CompressStreamDB is highly methodwithmarginaloverhead[61],[62],[63].Ourevaluation
portable,readilyadaptabletodiversedevices,includingembed- in Section VII covers data types of integer, floating-point, and
dededgedeviceslikeRaspberryPi4B,requiringminimalmod- string,allofwhichareencodedasintegersbeforeloading.After
ifications.Thisversatilitystemsfromthelightweightandhigh- unifieddataencoding,differenttypesofdatacanbeprocessed
speed algorithms implemented in the client, demanding min- inCompressStreamDB.
imal computational power. The server of CompressStreamDB Query without decompression: Decompression is employed
is portable and can be deployed to diverse high-performance to restore the original data. CompressStreamDB avoids de-
devices. Its direct SQL operators are universally designed and compressionasmuchaspossible,thusreducingtime,memory
can be adopted to different compression algorithms and plat- access, and accelerating the query process. In our design, we
forms. The portability of CompressStreamDB empowers its can directly query the compressed data when the compressed
adaptability across diverse devices and platforms, rendering it stream meets the following three conditions. First, the com-
well-suited for resource-constrained environments, notably in pressed data are similar to the data before compression, and
edgecomputingscenarios. arestillstructured.Second,thecompressedstreamdatashould
be aligned. Third, the compression does not affect the order
of the stream and the process of kernel operation. Our SQL
B. CompressedStreamProcessing
operatorsarespeciallydesignedforcompresseddataprocessing.
Adaptive processing for dynamic workload: In Com- These operators can accept parameters of thenumber of bytes
pressStreamDB,wedynamicallyprocesstheinputdatastream eachcompressedcolumnoccupies.Forinstance,iftheoriginal
using our selector. As detailed in Section II, stream data pro- column holds 4 bytes per element but is compressed to 1 B
cessingisachievedthroughSQLqueries,treatingabatchasthe per element, our operators handle this column by reading and
minimumprocessingunit.Thesystempredominantlyemploys writing only 1 B for each entry. Despite various compression
common relational operators including projection, selection, algorithmsencodingrawdatadifferently,theirresultsultimately
aggregation,group-by,andjoin.Streamprocessingisperformed conform to a fixed format. As long as the compressed format
through query statements composed of these operators with a meets these three conditions, direct processing of the com-
given size of the sliding window. After a preset number of pressed data is supported. This universal design avoids the
batches, the system dynamically reselects compression algo- complexity of developing separate operator kernels for differ-
rithms for data columns using the system cost model. Com- ent compression methods. Our implementation is portable to
pressStreamDB then scans the next five batches to predict the diverse devices cause it does not require any special hardware
data properties of the follow-up stream, uses the system cost support.
modeltocalculatelatencywiththeproperties,andfinallyiden- Example: Assume that the stream data includes three
tifiesthenewprocessingmethodwiththelowesttotalprocessing columns: col1 is 8 bytes, col2 is 4 bytes, and col3 is 4 bytes.
time. Considering that the compression algorithms we use are After compression, col1(cid:2) is 2 bytes, col2(cid:2) is 1 B, and col3(cid:2) is
all lightweight, the overhead of dynamic reselection can be 1 B. A query like “select col1, avg(col2) from data group by
negligible. The batch size and window size in our system are col3”canbemappedto“selectcol1(cid:2),avg(col2(cid:2))fromdatagroup
independent of each other. Changes in compression do not by col3(cid:2)”. In this way, we only need to update the number of
directlyaffectthewindows.Insmallerwindowswithinabatch, bytestobereadforeachcorrespondingcolumnintheoperator.
reselectingcompressionaffectsmultiplewindows.However,in The original stream processing operators are mapped to the
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4537
foreachbatch.Forachosencompressionalgorithmτ,Tcom,τ
TABLEII
memory
SYMBOLSANDMEANINGS denotes the number of instructions used for memory accesses
com,τ
|     |     |     |     |     |     |     | duringcompression,whileT |     |     |     | representsthenumberof |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------ | --- | --- | --- | --------------------- | --- | --- | --- |
operation
|     |     |     |     |     |     |     | instructions |     | used for | computation. | Then | the | tcompress | can be |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | -------- | ------------ | ---- | --- | --------- | ------ |
definedby(2).
|     |     |     |     |     |     |     |     | tcompress | =α·twait |     |     |     |     |         |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | -------- | --- | --- | --- | --- | ------- |
|     |     |     |     |     |     |     |     |           | (cid:2)  |     |     |     |     | (cid:3) |
c o m ,τ
|               |            |     |        |            |           |       |         |        | T co m , τ | +T      |             | SizeT       | ·SizeB |            |
| ------------- | ---------- | --- | ------ | ---------- | --------- | ----- | ------- | ------ | ---------- | ------- | ----------- | ----------- | ------ | ---------- |
|               |            |     |        |            |           |       |         |        | m e m o    | ry o    | p e ra tion |             |        |            |
|               |            |     |        |            |           |       |         | +max   |            |         | ,           |             |        | . (2)      |
|               |            |     |        |            |           |       |         |        |            | Nclient |             | Bclient     |        |            |
|               |            |     |        |            |           |       | Nclient | means  | the CPU    | FLOPS   | of          | the client, | and    | Bclient is |
| corresponding | compressed |     | stream | processing | operators | based |         |        |            |         |             |             |        |            |
|               |            |     |        |            |           |       | the     | memory | bandwidth  | of the  | client,     | which       | can be | obtained   |
onthecompressionformat.
|           |          |     |             |     |           |          | from | the hardware | specifications. |     | The | client | is responsible | for |
| --------- | -------- | --- | ----------- | --- | --------- | -------- | ---- | ------------ | --------------- | --- | --- | ------ | -------------- | --- |
| With such | designs, | we  | can compare | and | calculate | the com- |      |              |                 |     |     |        |                |     |
compression.Ifthecompressionprogramisamemory-intensive
pressedvaluesdirectly,allowingustoperformqueriesdirectly SizeT ·SizeB
on compressed data. Therefore, the result of compression can program for the client, is larger. Otherwise, if
Bclient
com,τ
be applied to the entire query execution, including interme- Tcom,τ +T
|     |     |     |     |     |     |     |     |     |     |     |     | memory | operation |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ | --------- | --- |
diate results, enhancing system efficiency. It’s important to it is a compute-intensive program, is
Nclient
notethatCompressStreamDBaccommodatesdiversecompres-
larger.
sionschemes.Algorithmsrequiringlightweightdecompression As mentioned in Section II-B, the eager compression algo-
shouldbeconsiderediftheirperformancebenefitsoutweighthe
rithmscompressdataimmediately,whilethelazycompression
decompressionoverhead. algorithmsneedtowaituntilthewholedatabatcharrives.Hence,
|                    |     |     |     |     |     |     | if we  | use twait | to represent | the | time      | spent waiting |      | for a data |
| ------------------ | --- | --- | --- | --- | --- | --- | ------ | --------- | ------------ | --- | --------- | ------------- | ---- | ---------- |
| C. SystemCostModel |     |     |     |     |     |     |        |           | α·twait      |     |           |               |      |            |
|                    |     |     |     |     |     |     | batch, | we can    | use          | to  | calculate | the time      | that | τ spends   |
onwaiting,wherethevariableαisdefinedin(3).
| To guide    | the       | system | to automatically |            | select | a suitable   |     |         |                            |     |     |     |         |     |
| ----------- | --------- | ------ | ---------------- | ---------- | ------ | ------------ | --- | ------- | -------------------------- | --- | --- | --- | ------- | --- |
| compression | algorithm | at     | runtime,         | we propose |        | a cost model |     | (cid:4) |                            |     |     |     |         |     |
|             |           |        |                  |            |        |              |     | 1,      | ifthecompressionalgorithmτ |     |     |     | islazy; |     |
for stream processing systems with compression. Previous α= (3)
|     |     |     |     |     |     |     |     | 0,  | ifthecompressionalgorithmτ |     |     |     | iseager. |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | -------- | --- |
works[13],[64]providethecostmodelsonlyforthecompres-
sionalgorithms,butnotstreamprocessing.Asfarasweknow,
2)Transmissiontime:Wedenotethetimeallocatedtotrans-
| our work | is the first | to provide | the | cost model | for | compressed |         |     |                      |     |                 |     |       |          |
| -------- | ------------ | ---------- | --- | ---------- | --- | ---------- | ------- | --- | -------------------- | --- | --------------- | --- | ----- | -------- |
|          |              |            |     |            |     |            | mission | as  | ttrans. r represents |     | the compression |     | ratio | achieved |
streamprocessing.Thedifficultyofproposingacostmodelfor
|     |     |     |     |     |     |     | by the | selected | algorithm | as  | outlined | in Section | V.  | Then, we |
| --- | --- | --- | --- | --- | --- | --- | ------ | -------- | --------- | --- | -------- | ---------- | --- | -------- |
compressedstreamprocessingliesinthecomplexityofprocess-
SizeT
ing procedures and scenarios. In our processing scenario, we use torepresentthetuplesizeaftercompression.Con-
r
takethemachinemetrics,networkconditions,andotherexten-
|     |     |     |     |     |     |     | sidering | SizeB | as the | number | of tuples | within | a   | batch, the |
| --- | --- | --- | --- | --- | --- | --- | -------- | ----- | ------ | ------ | --------- | ------ | --- | ---------- |
sivefactorsintoconsideration,andsolvetheabove-mentioned bytesizerequiredfortransmittingthecompressedbatchequates
| difficultiesthroughamulti-stepcostmodel. |     |     |     |     |     |     | SizeT | ·SizeB |                                       |     |     |     |     |     |
| ---------------------------------------- | --- | --- | --- | --- | --- | --- | ----- | ------ | ------------------------------------- | --- | --- | --- | --- | --- |
|                                          |     |     |     |     |     |     | to    |        | .Ifnetworkbandwidthsufficesandqueuing |     |     |     |     |     |
TheprocessofCompressStreamDBconsistsoffourprimary
r
|                                                       |     |               |     |                |     |           | delay | remains | negligible, | ttrans | can be | expressed | as  | shown in |
| ----------------------------------------------------- | --- | ------------- | --- | -------------- | --- | --------- | ----- | ------- | ----------- | ------ | ------ | --------- | --- | -------- |
| stages: compression,                                  |     | transmission, |     | decompression, |     | and query |       |         |             |        |        |           |     |          |
| processing.Tomodelthecostsacrossthesestages,wedevelop |     |               |     |                |     |           | (4).  |         |             |        |        |           |     |          |
asystemcostmodel.TableIIoutlinesthekeyparametersutilized
|                                                      |     |     |     |     |     |     |     |     |          | SizeT | ·SizeB |           |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----- | ------ | --------- | --- | --- |
| inoursystemcostmodel.                                |     |     |     |     |     |     |     |     | ttrans = |       |        | ·latency. |     | (4) |
| Werepresentthetimeofcompression,datatransmission,de- |     |     |     |     |     |     |     |     |          |       | r      |           |     |     |
compression,andqueryprocessingbytcompress,ttrans,tdecom, Whenthenetworkbandwidthisfullyoccupied,thecalcula-
andtquery,respectively.Thewholeprocesstimeisrepresented
tionofttranscanbegivenas(5).
ast.Basedontheaboveanalysis,wecanrepresentthesystem
| costofcompressedstreamprocessingin(1). |                                   |     |     |     |     |     |     |     |        | SizeT         | ·SizeB |     |     |     |
| -------------------------------------- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- | ------ | ------------- | ------ | --- | --- | --- |
|                                        |                                   |     |     |     |     |     |     |     | ttrans |               |        | .   |     |     |
|                                        |                                   |     |     |     |     |     |     |     |        | = r·bandwidth |        |     |     | (5) |
|                                        | t=tcompress+ttrans+tdecom+tquery. |     |     |     |     | (1) |     |     |        |               |        |     |     |     |
In the following part of this section, we delve into the con- 3) Decompression time: Considering the importance of
|     |     |     |     |     |     |     | future-proof |     | compression | algorithms |     | that require | decompres- |     |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ----------- | ---------- | --- | ------------ | ---------- | --- |
siderationsofcostmodel,includingmachinemetrics,network
sionpre-processing,oursystemretainstheflexibilitytoincor-
| conditions, | and the | efficiency | of compression |     | techniques. | We  |     |     |     |     |     |     |     |     |
| ----------- | ------- | ---------- | -------------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
focus on modeling the time consumption across these four porate these methods. For a chosen compression algorithm τ,
|          |     |     |     |     |     |     | T de | c om , τ symbolizes |     | the number | of instructions |     | executed | for |
| -------- | --- | --- | --- | --- | --- | --- | ---- | ------------------- | --- | ---------- | --------------- | --- | -------- | --- |
| aspects. |     |     |     |     |     |     | m e  | m or y              |     |            |                 |     |          |     |
decom,τ
1) Compression time: For the processing batch, SizeT rep- memoryaccessduringdecompression,whileT denotes
operation
resentsthenumber ofbytes pertuple,whileSizeB means the thecountofcomputationalinstructions.Thisallowsustodefine
·SizeB
numberoftuplesperbatch,thusthereareSizeT bytes tdecompressasper(6).
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

4538 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
tdecompress = In the rest of this section, we will consistently employ the
(cid:2) (cid:3) symbolSizeBtosignifytheprocessingbatchsize.Furthermore,
|     |     | T de c | om , τ +T | d e c o m , τ |     | ·SizeB |     |     |     |     |     |     |     |     |     |
| --- | --- | ------ | --------- | ------------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
β·max m e m or y o p e r a ti o n SizeT weintroduceanewsymbol,SizeC,representingthesizeofeach
|     |     |     |     |     | ,   |     | . (6) |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
Nserver Bserver element in the column. Our discussion on each compression
|         |     |         |            |       |     |             |       | algorithm | will introduce |     | a set | of parameters | related |     | to dataset |
| ------- | --- | ------- | ---------- | ----- | --- | ----------- | ----- | --------- | -------------- | --- | ----- | ------------- | ------- | --- | ---------- |
| Nserver |     | relates | to the CPU | FLOPS | of  | the server, | which |           |                |     |       |               |         |     |            |
properties.Theseparameterswillbeexplicitlydescribedwithin
is similar to Nclient, and Bserver means the memory the context of each compression algorithm, offering specific
| bandwidth |     | of the | server. | If the | decompression |     | program |     |     |     |     |     |     |     |     |
| --------- | --- | ------ | ------- | ------ | ------------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
insightsintotheircharacteristics.
| leans | towards | memory-intensive |     | operations |     | on  | the server, |     |     |     |     |     |     |     |     |
| ----- | ------- | ---------------- | --- | ---------- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
SizeT ·SizeB
|     |     | is larger. | Alternatively, |     | if  | it’s more | compute- | B. EagerCompression |     |     |     |     |     |     |     |
| --- | --- | ---------- | -------------- | --- | --- | --------- | -------- | ------------------- | --- | --- | --- | --- | --- | --- | --- |
Bserver
Tdecom,τ +T decom,τ EagerCompressionalgorithmscompressthearrivedelements
|            |     | memory  | operation |            |     |                  |     |                                                      |     |     |     |     |     |     |     |
| ---------- | --- | ------- | --------- | ---------- | --- | ---------------- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
| intensive, |     |         |           | islarger.β |     | indicateswhether |     |                                                      |     |     |     |     |     |     |     |
|            |     | Nserver |           |            |     |                  |     | immediatelyanddonotneedtowaitforthewholebatch.Hence, |     |     |     |     |     |     |     |
τ needsdecompression,whichisdefinedin(7). theirαvalueinthesystemcostmodelis0.
|     |     | ⎧   |                            |     |     |     |     | Elias Gamma |     | encoding | (EG): | The | idea of | Elias | Gamma |
| --- | --- | --- | -------------------------- | --- | --- | --- | --- | ----------- | --- | -------- | ----- | --- | ------- | ----- | ----- |
|     |     | ⎨1, | ifthecompressionalgorithmτ |     |     |     |     |             |     |          |       |     |         |       |       |
encodingistousethenumberofleadingzerostorepresentthe
|     | β   | =   | needsdecompression; |     |     |     | (7) |     |     |     |     |     |     |     |     |
| --- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
⎩ binary valid bits of the data [11]. Given a positive number x,
0, otherwise. letL=(cid:3)log x(cid:4).TheEliasGammaencodingformofxcanbe
2
4) Query time: The query is executed on the server through represented as L zero bits followed by the binary form of x.
Hence,ituses2∗L+1bitstorepresentthenumberx.
| kernel | functions. | The | compression |     | process | mainly | affects the |     |     |     |     |     |     |     |     |
| ------ | ---------- | --- | ----------- | --- | ------- | ------ | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
efficiency of kernel functions on memory read and write, Elias Gamma encoding, being a variable-length encoding,
but does not affect the computation process. Because Com- lacks a fixed number of bits. However, as discussed in Sec-
pressStreamDBreadsandwritesinbytes,thememoryreadand tionIV-B,wealignitsencodingtoensureconsistentbyterep-
write time is proportional to the number of bytes occupied in resentation. For a specific data column, EGDomain signifies
memory. We use t query to represent the computation time the maximum byte requirement for Elias Gamma encoding in
operation
tquery
of a query, and to represent the query time spent on that column. Consequently, data within this column involve
memory
memory read and write. Note that both of them represent the EGDomain bytes during processing. This encoding method
|     |     |     |     |     |     |     |     | might struggle | with | outliers, | necessitating |     | more | uniform | input |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | ---- | --------- | ------------- | --- | ---- | ------- | ----- |
processingtimeintheuncompressedcondition.Wecanobtain
tquery by(8). data. An occurrence of significant outliers in the input data
|     |     |     |     |     |     |     |     | could notably | escalate | redundancy |     | across | the | entire | column, |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | -------- | ---------- | --- | ------ | --- | ------ | ------- |
tquery
|     |     |        | q u  | e r y    | me m | ory     |     |                                 |       |          |     |        |           |      |       |
| --- | --- | ------ | ---- | -------- | ---- | ------- | --- | ------------------------------- | ----- | -------- | --- | ------ | --------- | ---- | ----- |
|     |     | tquery | =t   | +        |      | .       | (8) | potentiallyimpactingefficiency. |       |          |     |        |           |      |       |
|     |     |        | o pe | r a tion | r    | (cid:2) |     |                                 |       |          |     |        |           |      |       |
|     |     |        |      |          |      |         |     | The Elias                       | Gamma | encoding |     | method | processes | only | posi- |
Pleasenotethatr(cid:2) signifiesthecompressionratioduringthe tive integers, while our data comprises non-negative integers.
queryexecution,distinctfromthecompressionratiodenotedas To accommodate this, we increment each integer by 1 before
r.Thedeterminationofr(cid:2)
hingesonwhethertheserverunder- compression and decrement by 1 during decompression. This
takesdecompressionaspartofthequeryprocess.Itsdefinition
simpleadjustmenteffectivelyconvertsnon-negativeintegersfor
isrepresentedby(9),indicatingitsroleinthequeryphase. compatibilitywiththeencodingscheme.Thecompressionratio
⎧
rofEliasGammaencodingcanbedescribedin(10).
|     |     | ⎨1, | ifthecompressionalgorithmτ |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
(cid:2)
|     | r   | =   | needsdecompression; |     |     |     | (9) |     |     |     | SizeC |     |     |     |      |
| --- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | ---- |
|     |     | ⎩   |                     |     |     |     |     |     |     | r = |       |     | .   |     | (10) |
|     |     | r,  | otherwise.          |     |     |     |     |     |     |     |       |     |     |     |      |
EGDomain
|     |     |     |     |     |     |     |     | The storage | format | of  | Elias | Gamma | encoding |     | in Com- |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ------ | --- | ----- | ----- | -------- | --- | ------- |
V. SELECTEDCOMPRESSIONALGORITHMS
|     |     |     |     |     |     |     |     | pressStreamDB | ensures |     | alignment | to  | a consistent | byte | length |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | ------- | --- | --------- | --- | ------------ | ---- | ------ |
CompressStreamDBincorporatesninelightweightcompres- while maintaining the structured nature of compressed data.
sionalgorithms,detailedinSectionII.Thissystemdynamically Utilizingthisformat,CompressStreamDBbypassesdecompres-
chooses among these options at runtime using our innovative sion. The parameters associated with Elias Gamma encoding
| systemcostmodel,andpartialparametersofcostmodelrelate |     |     |     |     |     |     |     |     |     |     | SizeC |     |     |     |     |
| ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- |
=0,r(cid:2)
|                             |     |     |     |     |     |     |     | includeβ |     | =r = |          |     | .   |     |     |
| --------------------------- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | ---- | -------- | --- | --- | --- | --- |
| tothecompressionalgorithms. |     |     |     |     |     |     |     | (cid:2)  |     |      | EGDomain |     |     |     |     |
Pros:1)Itissuitableforsceneswheresmallintegersare
usedfrequently.2)Itcanavoidtheoverheadofdecompres-
A. Preliminaries
sion.
(cid:2)
| We  | present | the | system cost | model | parameters |     | associated |     |     |     |     |     |     |     |     |
| --- | ------- | --- | ----------- | ----- | ---------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
Cons:1)ThespeedofEliasGammaencodingisrelatively
| with | each compression |     | algorithm, | delineating |     | their | respective |        |             |     |          |             |     |             |     |
| ---- | ---------------- | --- | ---------- | ----------- | --- | ----- | ---------- | ------ | ----------- | --- | -------- | ----------- | --- | ----------- | --- |
|      |                  |     |            |             |     |       |            | slower | in contrast |     | to other | lightweight |     | algorithms, | due |
advantages and drawbacks, including parameters such as α, to the requirement of performing a logarithmic operation
c o m ,τ
| β, r, | and r(cid:2). | The parameters |     | T co m | , τ , T |     | , T de c om , | τ,  |     |     |     |     |     |     |     |
| ----- | ------------- | -------------- | --- | ------ | ------- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
m e m o ry o p e ra tion m e m or y beforeaddingleadingzeros.2)Itisnotgoodathandling
decom,τ
andT pertainingtothenumber ofinstructionscanbe largeoutliers.
operation
directly derived by inspecting the assembly source code. This EliasDeltaencoding(ED):EliasDeltaencoding,avariantof
approach allows for the construction of a tailored cost model Elias Gamma encoding, extends the process by performing an
specifictoeachcompressionalgorithm. additionalEliasGammaencodingonthevaluederivedfromthe
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4539
firstencoding[11].Givenapositivenumberx,letL=(cid:3)log x(cid:4), design,withvaluesrangingbetween1and4bytes,weusetwo
2
andN =(cid:3)log (L+1)(cid:4).TheEliasDeltaencodingformofxhas bits to signify the byte count per value. Consequently, every
2
1)N zerobits,followedby2)N +1bitbinaryrepresentation group of four elements requires an extra byte to record their
| ofL+1and3)thelastLbitsofthebinaryformofx.Hence,it |     |     |     |     |     |     | lengths. |     |     |     |     |
| ------------------------------------------------- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- |
uses2∗N
+L+1bitstorepresentthenumberx. Comparedwithnullsuppressionwithfixedlength,nullsup-
SameasEliasGammaencoding,weextendEliasDeltaencod- pressionwithvariablelengthhasabettercompressionratioin
ingtomakeitsuitablefornon-negativeintegers.Inaddition,we mostcases.Ithasagoodeffectonelementsofdifferentsizes.
havealsoaligneditsencodingresults.Foragivendatacolumn, However, when column elements predominantly fall within a
We use EDDomain to represent the maximum number of narrowrange,theadditionalbytesusedtonotetheirlengthscan
bytesrequiredforEliasDeltaencodingfortheelementsofthis becomeanoverheadthat’sdifficulttooverlook.
column.Then,thedatainthiscolumnareallEDDominbytes UtilizingtheintroducedValueDomainarrayinNS,thetotal
duringprocessing.Itrequiresmorebitsforcompressingsmall number of bytes needed after compression can be derived by
valuescomparedtoEliasGammaencoding,butperformsbetter summing the values within ValueDomain. The compression
withlargervalues.Forlargerintegers,thelengthofEliasDelta ratio r for null suppression with variable length is determined
by(13).
| encoding          |     | approaches | entropy,                            | making | it nearly | optimal. | The |     |              |     |        |
| ----------------- | --- | ---------- | ----------------------------------- | ------ | --------- | -------- | --- | --- | ------------ | --- | ------ |
| compressionratior |     |            | forEliasDeltaencodingcanbeexpressed |        |           |          |     |     |              |     |        |
|                   |     |            |                                     |        |           |          |     |     | SizeC ·SizeB |     |        |
| using(11).        |     |            |                                     |        |           |          |     | r = | (cid:8)      |     | . (13) |
Size
|     |     |     |     |     |     |     |     | SizeB/4+ | BValueDomaini |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------------- | --- | --- |
i=1
SizeC
|     |     |     | r = |          | .   |     | (11) |                                                     |     |     |     |
| --- | --- | --- | --- | -------- | --- | --- | ---- | --------------------------------------------------- | --- | --- | --- |
|     |     |     |     | EDDomain |     |     |      | Becausethecompressedelementsarenotbyte-aligned,they |     |     |     |
havetobedecompressedbeforeprocessing.Wehaveitsparam-
SizeC
Itsparametersare:β =0,r(cid:2) =r = . eters:β =1,r(cid:2) =1.
(cid:2)
|     | (cid:2) |     |     |     | EDDomain |     |     |     |     |     |     |
| --- | ------- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- |
Pros:1)ItismorestablethanEliasGammaencoding.2) Pros: 1) It can make better use of space and achieve a
highercompressionratiocomparedtoNS.2)Itcanhandle
Itcanhandlealargerrangeofvalues.
(cid:2)
Cons:1)Itscompressionprocessismorecomplicated,so thesituationoflargedatachangesandisnoteasilyaffected
|     | thecompressionspeedcanbeslower.2)Whenthevalueis |     |     |     |     |     |     | byoutliers. |     |     |     |
| --- | ----------------------------------------------- | --- | --- | --- | --- | --- | --- | ----------- | --- | --- | --- |
(cid:2)
|     |     |     |     |     |     |     |     | Cons: 1) It | needs decompression | before processing. | 2) It |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ------------------- | ------------------ | ----- |
verysmall,itsperformanceisnotasgoodasEliasGamma
|     | encoding. |     |     |     |     |     |     | needsextrabytestorecordthelength. |     |     |     |
| --- | --------- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- |
Nullsuppressionwithfixedlength(NS):Thenullsuppression
withfixedlengthmethodremovesleadingzerosfromthebinary C. LazyCompression
representationoftheelement,efficientlyeliminatingtheredun-
Lazycompressionalgorithmswaituntiltheentireinputbatch
dancycausedbythedatatype[24].“Withfixedlength”means
arrives,andthencompressthewholebatch.Hence,theirαvalue
thattheelementsofthecompresseddatahavethesamenumber
inthesystemcostmodelis1.
| ofbits. |     |     |     |     |     |     |     | Base-Deltaencoding(BD):Base-Deltaencodingisidealfor |     |     |     |
| ------- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | --- | --- | --- |
Toestimatethecompressioneffectsofnullsuppressionwith
scenarioswithlargevaluesandalimiteddatarange,orwhendif-
| fixed | length | and | null suppression | with | variable | length, | we in- |     |     |     |     |
| ----- | ------ | --- | ---------------- | ---- | -------- | ------- | ------ | --- | --- | --- | --- |
ferencesbetweenvaluesareconsiderablysmallerthanthevalues
troduced the ValueDomain array. The size of this array is themselves[25].Thismethodselectsabasevaluefromaseries
| the | same | as the | batch size. | It records | the | number | of bytes |     |     |     |     |
| --- | ---- | ------ | ----------- | ---------- | --- | ------ | -------- | --- | --- | --- | --- |
ofvaluesandstoresit.Eachelementisrepresentedbyitsdelta
requiredtorepresentthevalidbitsofeachelementinthecolumn. value from this base. If the delta value is significantly smaller
| ValueDomainMAX |     |     | denotesthebytesusedbyelementsafter |     |     |     |     |     |     |     |     |
| -------------- | --- | --- | ---------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
thantheoriginalelement,itcanbeefficientlyrepresentedwith
nullsuppressionwithfixed-length.Thecompressionratiorfor
fewerbytes.
thismethodisgivenby(12). WedesignateBDDomaintorepresentthemaximumbytes
|     |     |     |     | SizeC |     |     | neededforBase-Deltaencodinginadatacolumn.Thecompres- |     |     |     |     |
| --- | --- | --- | --- | ----- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- |
|     |     |     | r = |       |     | .   | (12)                                                 |     |     |     |     |
sionratiorforBase-Deltaencodingcanbecalculatedusing(14).
ValueDomainMAX
r(cid:2)
|     | Similarly, | its | parameters |     | are: β | =0, | =r = |     |       |     |      |
| --- | ---------- | --- | ---------- | --- | ------ | --- | ---- | --- | ----- | --- | ---- |
|     | SizeC      |     |            |     |        |     |      |     | SizeC |     |      |
|     |            |     | .          |     |        |     |      |     | r =   | .   | (14) |
BDDomain
Va(cid:2)lueDomainMAX
|     | Pros: | Its compression |     | is very | convenient | and | can be |     |     |     |     |
| --- | ----- | --------------- | --- | ------- | ---------- | --- | ------ | --- | --- | --- | --- |
ItcanavoiddecompressioninCompressStreamDB.Then,we
|     | pe r    | fo rm e d ef | fi c i en t ly | .   |     |     |     |     |             | SizeC |     |
| --- | ------- | ------------ | -------------- | --- | --- | --- | --- | --- | ----------- | ----- | --- |
|     | (cid:2) |              |                |     |     |     |     |     | =0,r(cid:2) |       |     |
C o n s: It i sn o t g o o d a thandlinglargeoutliers. haveitsparameters:β =r = .
|     |     |     |     |     |     |     |     | (cid:2) |     | BDDomain |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | -------- | --- |
Null suppression with variable length (NSV): Null suppres- Pros: It achieves fast compression due to its reliance on
sionwithvariablelengthissimilartonullsuppressionwithfixed basicvectoradditionandsubtractionoperations.
(cid:2)
length,achievingcompressionbyremovingleadingzeros[24]. Cons: It is only suitable for data with a small range of
| Unlikethefixed-lengthmethod,itdoesn’tmandateaconsistent |     |     |     |     |     |     |     | variation. |     |     |     |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- |
numberofbitsinthecompressedoutput.Instead,itrecordsthe Runlengthencoding(RLE):RunLengthEncodingisaclas-
byte length of each encoded value for decompression. In our sicalcompressionalgorithm[26]effectivefordatasetsfeaturing
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

4540 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
recurringsequencesofelements.Itefficientlyreducesspaceby thereby achieving a higher compression ratio. Moreover, the
compressingrepetitivedatathatoccursperiodically. firstdifferentvalueafterthissequencewillalsobecompressed
Supposetheaveragerunlengthofacolumnofdatabatchis into the same element. In other words, PLWAH can merge all
represented by AverageRunLength. As run-length encoding elementsfilledwith0or1.
requiresanadditionalintegervariable(4bytes)torepresentthe Example: We use a simplified 8-bit example to illustrate
run length, the compression ratio r for run-length encoding is the compression scheme of PLWAH. Assume that we have 4
definedin(15). Bitmapentriestocompressandtheoriginaldatais[00000000,
SizeC ·AverageRunLength 00000000,00000000,00100000].Thenthecompresseddatais
r = . (15) an8-bitentry[10011011].Thefirst1indicatesthatthiswordis
|     |     |     | SizeC | +4  |     |     |     |     |     |     |     |     |
| --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
acompressedfillword.Thesecond0indicatesthatthefillword
RLEdoesnotmaintainbytealignmentanddisruptstheorigi-
isfilledwith0.Thenextthreedigits“011”indicatealiteralword
naldatastructure,necessitatingdecompressionbeforeprocess-
with“1”inthethirddigit(00100000).Thelastthreedigits“011”
| ing.Consequently,itsparametersaredefinedasfollows:β |     |     |     |     |     | =1, |     |     |     |     |     |     |
| --------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
indicatethreeconsecutive0fillwords.Inthisway,theoriginal
r(cid:2) =1.
(cid:2) four items are compressed into one item. In the context of a
Pros: 1) Its compression speed is relatively fast. 2) 32-bit representation PLWAH, the first 2 bits signify the word
| It  | can achieve |     | a high compression |     | ratio | for data | if  |     |     |     |     |     |
| --- | ----------- | --- | ------------------ | --- | ----- | -------- | --- | --- | --- | --- | --- | --- |
type,thesubsequent5bitsdenotethepositionofthenextliteral
AverageRunLengthishigh.
| (cid:2) |     |          |               |     |                   |     | word’s“1”,andthefinal25bitsindicatethenumberofmerged |                 |            |          |     |             |
| ------- | --- | -------- | ------------- | --- | ----------------- | --- | ---------------------------------------------------- | --------------- | ---------- | -------- | --- | ----------- |
| Cons:   | 1)  | It needs | decompression |     | before processing | the |                                                      |                 |            |          |     |             |
|         |     |          |               |     |                   |     | fill words                                           | [28]. Note that | our bitmap | approach | is  | designed to |
data.2)Itonlyappliestocontinuouslyrepeateddata.
|     |     |     |     |     |     |     | compress | data with specific | types | of values. | The | compressed |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------------------ | ----- | ---------- | --- | ---------- |
Dictionary (DICT): The dictionary compression algorithm bitmapcanonlyhaveatmostone“1”,withtheremainingbits
| is commonly | used | to  | convert larger | data | into smaller | data by |     |     |     |     |     |     |
| ----------- | ---- | --- | -------------- | ---- | ------------ | ------- | --- | --- | --- | --- | --- | --- |
setto“0”[13].PLWAHcanbeappliedinsuchscenarios.
| establishing | a   | one-to-one | relationship |     | [27]. If the | number of |              |          |            |           |         |        |
| ------------ | --- | ---------- | ------------ | --- | ------------ | --------- | ------------ | -------- | ---------- | --------- | ------- | ------ |
|              |     |            |              |     |              |           | In practice, | the most | frequently | occurring | element | can be |
datatypesisdenotedasKindnum,thecompressionratiorof
mappedtotheelementfilledwith0inthebitmap,andthesecond
dictionaryencodingcanbedefinedusing(16).
mostfrequentlyoccurringelementcanbemappedtotheelement
SizeC filledwith1inthebitmap.Thisstrategicmappingsignificantly
|     |     | r = |     |     | .   | (16) |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- |
(cid:6)log Kindnum/8(cid:7) reduces space allocation for these two elements in the entire
2
column.Ifwedenotethecountofthemostfrequentelementas
| It is byte-aligned |              | and | structured,    | so  | it can avoid | decom-   |                                                     |      |                 |     |            |          |
| ------------------ | ------------ | --- | -------------- | --- | ------------ | -------- | --------------------------------------------------- | ---- | --------------- | --- | ---------- | -------- |
|                    |              |     |                |     |              | r(cid:2) | MostCount,andthecountofthesecondmostfrequentelement |      |                 |     |            |          |
| pression.          | Accordingly, |     | its parameters |     | are: β =0,   | =r       | =                                                   |      |                 |     |            |          |
|                    |              |     |                |     |              |          | as SecondCount,                                     | then | the compression |     | ratio r of | PLWAH is |
SizeC
|     |     | .   |     |     |     |     | formallydefinedin(18). |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------------- | --- | --- | --- | --- | --- |
(cid:6)lo(cid:2)g Kindnum/8(cid:7)
2
Pros:Ithasarelativelyhighcompressionratio.
(cid:2)
SizeB
Cons: It is appropriate for use when there are only a few r = . (18)
−MostCount−SecondCount
| typesofdata. |     |     |     |     |     |     |     | SizeB |     |     |     |     |
| ------------ | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- |
Bitmap:Thebitmapcompressionalgorithmisrelativelycon-
|     |     |     |     |     |     |     | Itdestroysthedatastructureoftheoriginaldata,so:β |     |     |     |     | =1, |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- |
cise,usingabitstringtorepresenttheoriginaldata[13],[28],
r(cid:2)
| [29],[30].Eachbitinthebitstringcorrespondstoauniqueele- |     |     |     |     |     |     | = 1. |     |     |     |     |     |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- |
(cid:2)
Pros:Ithasmuchhighercompressionratiothanbitmap.
| mentintheoriginaldata.Ifthenumberofdatatypesisdenoted |     |     |     |     |     |     | (cid:2) |                   |     |          |           |            |
| ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | ------- | ----------------- | --- | -------- | --------- | ---------- |
|                                                       |     |     |     |     |     |     | Cons:   | It is appropriate | for | use when | there are | only a few |
asKindnum,thecompressionratiorofbitmapencodingcan
| bedefinedusing(17). |     |     |     |     |     |     | typesofdata. |     |     |     |     |     |
| ------------------- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- |
SizeC
|     |     | r = |                                |     | .   | (17) |     |     |                |     |     |     |
| --- | --- | --- | ------------------------------ | --- | --- | ---- | --- | --- | -------------- | --- | --- | --- |
|     |     |     | 2(cid:6)log2 Kindnum)(cid:7)/8 |     |     |      |     | VI. | IMPLEMENTATION |     |     |     |
Itdestroysthedatastructureoftheoriginaldata,so:β =1, We implement CompressStreamDB with references to[14],
r(cid:2)
=1. [15],[65]. Itcomprises two primary modules: a client module
(cid:2)
Pros:Ithasfastcompressionanddecompressionspeed. housingthestreamprocessingcompressionalgorithmsandthe
(cid:2)
Cons: It is appropriate for use when there are only a few adaptive selector, and a server module equipped with funda-
typesofdata. mental SQL operators to process compressed streams. These
Positionlistwordalignedhybrid(PLWAH):Todemonstrate operators include selection, projection, groupby, aggregation,
the flexibility of CompressStreamDB in compression algo- and join. The server module takes charge of handling these
rithms,besidestheoriginalcompressionalgorithms,wefurther compressed streams efficiently. Additionally, we integrate a
extendahighlyefficientvariantofcompressedBitmap,PLWAH, profiler into the server, facilitating the collection of key per-
into our system. The evaluation indicates that PLWAH further formancemetrics,including(de)compressionandtransmission
improvestheperformanceofoursystem,detailedinSectionVII. times.It’simportanttonotethatthecompressionfunctionality
PLWAHisanefficientcompressedbitmapdatastructurewith within CompressStreamDB can be turned off, allowing sup-
a high compression ratio and fast operation capability [28]. portforprocessinguncompressedstreams.Inscenariosinvolv-
When a sequence of elements filled with 1 s or 0 s appears, ing small-window queries, like handling a single tuple, Com-
thePLWAHalgorithmcompressesthemintoasingleelement, pressStreamDB can seamlessly execute uncompressed stream
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4541
processing without waiting for the entire data batch. This hy- 20.04.3LTSwithJava8.Ourserverisdeployedonbothacloud
bridprocessingmodesignificantlyextendstheapplicabilityof platformandanedgeplatform.Theirinformationisasfollows.
(cid:2)
systemacrossabroadspectrumofstreamprocessingscenarios. Cloudplatform.Ithasthesameconfigurationastheclient.
In our batch implementation, a sliding window can extend The price of the CPU is about $899. Its TDP is 205 W,
across multiple batches. To address this challenge, our system whichindicatesthatitcannotbeusedattheedgebecause
incorporates a batch buffer, temporarily storing data from the of high power consumption. We mainly conduct system
previous batch. Upon detecting a sliding window that spans performance experiments on this platform, and use the
acrossbatches,thesystemawaitsthearrivalofthesubsequent turbostattooltomonitoritspower.
(cid:2)
batch.Atthispoint,itretrievesthepreviouslycachedbatchfrom Edgeplatform.OuredgedeviceisRaspberryPi4Model
thebuffer,facilitatingthecomputationofresultsacrosssliding B[68].ItisequippedwithQuadcoreARMCortex-A72
windowsthatcrossbatchboundaries. 64-bit SoC and 8 GB memory, running Raspberry Pi OS
CompressStreamDB can be deployed among different envi- 5.10 with Java 8. Its price is $75, with maximum 6.4 W
ronments.Forexample,ApacheStormcancustomizeserializer. powerconsumption[69].Weusetheedgedevicetoprove
We can wrap the compression module of CompressStreamDB the portability of our system, and show the advantages
intoacustomserializer,andthenembed itintoStormforuse. of using edge device for stream processing. To detect
However,thisincursadditionalchallengessuchasmodelinte- the Raspberry Pi’s power consumption, a power meter is
grationandStorminternalimplementationoverhead,especially attached.
in distributed environments. Because our work focuses on the Datasets: Our evaluation incorporates four datasets widely
adaptive selection of compressions in stream processing, we usedinpreviousstudies[14],[15],[61],[70],[71],[72],[73],
leavetheadaptationtoothersystemsasfuturework. [74], [75], all of which remain relevant in current discussions.
Forinstance,thesmarthomemarketisprojectedtoreach51.23
VII. EVALUATION billion by 2026, growing at an annual rate of 11.7% [55],
emphasizing the continued significance of these datasets. The
A. ExperimentalSetup
firstdatasetoriginatesfromenergyconsumptionmeasurements
Methodology: The baseline for comparison is Com- insmartgrids[54],capturingdatafromvariousdeviceswithin
pressStreamDB without compression. Our system offers the a smart grid to enable load predictions and real-time demand
ability to disable the compression function, allowing uncom- managementinenergyconsumption.Theseconddataset,com-
pressedstreamprocessing.Thecomparisonagainstthisbaseline puteclustermonitoring[57],isderivedfromaGooglecluster,
aimstoevaluatewhetheroursolutionenhancesperformancein simulating a cluster management scenario. The third dataset,
streamsystems.Tobetterdemonstratethebenefitsofouradap- thelinearroadbenchmark[56],recordsvehiclepositionevents
tivecompressionapproach,weconductedaperformancecom- and models a network of toll roads. The fourth dataset is Star
parisonbetweenourimplementationandtwohigh-performance SchemaBenchmark(SSB)[76].Itcontainsonefacttable,four
stream processing systems–Saber [14] and FineStream [15]. dimensiontables,andthirteenstandardqueries.WeadjustSSB
Notably,bothSaberandFineStreamoperatewithoutemploying for stream processing. The adaption for more benchmarks are
compressiontechniques.WeimplementtheBase-Deltaencod- showninSectionVII-E.
ingcompressionwithreferencetoTerseCades[66],denotedas Queries: We utilize eight queries to evaluate the perfor-
“Base-Delta”. TerseCades stands as a pioneering exploration mance of adaptive compression in CompressStreamDB. For
ofstreamprocessingwithdatacompression,demonstratingits each dataset, we execute two queries to derive performance
efficacy in this domain. Our work showcases progressive ad- metrics, evaluating various processing methods including the
vancementsinperformancecomparedtotheBase-Deltaencod- baseline, nine lightweight compression algorithms, and Com-
ingemployedinTerseCades.AsTerseCadesisn’topen-source, pressStreamDB. These queries are well-established in prior
we re-implement its functionalities. Comparing the result of streamprocessingstudies[14],[15],[72],[73],[74],[75].The
ourimplementationwiththosepresentedintheTerseCadespa- specificdetailsoftheeightqueriesareoutlinedinTableIII.Q1
per[66],weobservesimilaroutcomes.Forinstance,in[66],the andQ2analyzetheanomalydetectioninsmartgridsdataset.Q3
systemprocessedqueriesonthePingmeshData[67]achievinga and Q4 operate on the linear road benchmark dataset. Queries
throughputof37.5MElems/s.InourimplementationusingBase- Q5andQ6interactwiththeGooglecomputeclustermonitoring
Deltaencoding,weaccomplishathroughputof37.2MElems/s data.Q7andQ8tackletheStarSchemaBenchmark.Toadapt
when querying the Smart Grid Data [54], showing a compa- tostreamprocessing;werewriteQ1.1andQ1.2ofSSBtoadapt
rable performance level. Our study extends further by com- tostreamprocessing.
paring the adaptive compression stream processing capability In the Smart Grid and Linear Road Benchmark datasets, a
of CompressStreamDB across nine lightweight compression batch encompasses 100 windows, and each window contains
algorithms. To exhibit the portability of CompressStreamDB, 1024tuples.InthecaseoftheClusterMonitoringdataset,abatch
we conduct experiments on both cloud and edge platforms, comprises 200 windows, with each window consisting of 512
analyzingandcomparingtheirthroughput,powerefficiency,and tuples.Finally,withintheStarSchemaBenchmarkdataset,each
costefficiency. batchcontains100windows,andeachwindowencompasses512
Platforms:OurclientisequippedwithanIntelXeonPlatinum tuples.Theperformanceresultforeachdatasetistheaverageof
8269CY 2.5 GHz CPU and 16 GB memory, running Ubuntu theresultsofrelatedqueries.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

4542 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
TABLEIII
QUERIESUSEDINEVALUATION
CompressStreamDBoutperformsNSby24.1%insystemper-
|     |     |     |     |     |     | formance. | Third, | in the context | of the | Google | Cluster Moni- |
| --- | --- | --- | --- | --- | --- | --------- | ------ | -------------- | ------ | ------ | ------------- |
toringdataset,CompressStreamDBdemonstratesaremarkable
3.85×increaseinthroughput,whileBDachievesa2.36×im-
|     |     |     |     |     |     | provement. | CompressStreamDB |     | achieves | a substantial | 63.1% |
| --- | --- | --- | --- | --- | --- | ---------- | ---------------- | --- | -------- | ------------- | ----- |
throughputimprovementoverBD.Finally,concerningtheStar
|     |     |     |     |     |     | Schema      | Benchmark | dataset,    | CompressStreamDB |             | achieves a |
| --- | --- | --- | --- | --- | --- | ----------- | --------- | ----------- | ---------------- | ----------- | ---------- |
|     |     |     |     |     |     | commendable | 1.92×     | improvement | in               | throughput, | compared   |
toBD’s1.68×enhancement.CompressStreamDBoutperforms
BDby14.3%insystemperformance.
Basedontheobservedthroughputoutcomes,severalsignifi-
cantinsightsemerge.First,compressioncanobviouslyimprove
Fig.4. Throughputofdifferentcompressionmethods.
thethroughputofthestreamprocessingsystem,whichhasbeen
demonstratedin[66].WhileBDconsistentlyshowcasesrobust
systemperformanceacrossvariousscenarios,theadaptivecom-
B. PerformanceComparison pression within CompressStreamDB consistently outperforms
Throughput:WedelveintothethroughputanalysisofCom- it. Second, the impact of compression in stream processing is
pressStreamDBacrosstheeightqueriesperformedonthefour notablycontingentupondatasetproperties.Forinstance,when
theAverageRunLengthofadatasetislow,RLEfailstodeliver
| datasets. | The results are | shown | in Fig. 4, showcasing |     | the per- |     |     |     |     |     |     |
| --------- | --------------- | ----- | --------------------- | --- | -------- | --- | --- | --- | --- | --- | --- |
formanceofeachdatasetwithdistinctprocessingmethods.Our substantialperformanceimprovements.Thus,thealgorithmse-
lectionprocessemergesasapivotalfactorinenhancingsystem
baselineachievessimilarthroughputincomparisontoSaberand
FineStream,showcasingaperformancesimilaritybetweenour performance.Third,CompressStreamDBadeptlyamalgamates
baseline and other state-of-the-art systems. On average, Com- the strengths of diverse algorithms, showcasing remarkable
3.84× adaptabilityacrossvaryingdatasets.Itscapabilitytoconsistently
| pressStreamDB | demonstrates | a   | remarkable | throughput |     |     |     |     |     |     |     |
| ------------- | ------------ | --- | ---------- | ---------- | --- | --- | --- | --- | --- | --- | --- |
improvementoverourbaseline.Notethatduetothepresenceof match or surpass the performance of individual compression
algorithmsunderscoresitsversatilityacrossdatasetsofvarying
negativenumbersinthelinearroadbenchmarkdataset,EGand
| EDcannotbeappliedtoit.Hereareourkeyobservations. |     |     |     |     |     | complexities. |     |     |     |     |     |
| ------------------------------------------------ | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- |
First,ontheSmartGriddataset,CompressStreamDBshow- Latency: Fig. 5 reports the latency of different compression
6.76× algorithmsonthefourdatasets.Inourwork,latencyrepresents
| cases a substantial |     | increase | in throughput | compared |     | to  |     |     |     |     |     |
| ------------------- | --- | -------- | ------------- | -------- | --- | --- | --- | --- | --- | --- | --- |
the baseline. Among the individual compression algorithms, the time from data input to the query result output. Similar
3.00× to throughput, latency is an important target of the system
| DICT encoding | stands             | out,delivering | a                         | throughput | im- |              |     |            |              |            |          |
| ------------- | ------------------ | -------------- | ------------------------- | ---------- | --- | ------------ | --- | ---------- | ------------ | ---------- | -------- |
|               |                    |                |                           |            |     | performance. | The | latency of | our baseline | is similar | compared |
| provement     | over the baseline. |                | However, CompressStreamDB |            |     |              |     |            |              |            |          |
outperforms DICT encoding, achieving a notable 2.25× im- to Saber and FineStream, demonstrating similar performance
withstate-of-the-artsystems.Onaverage,CompressStreamDB
| provement | in throughput. | Second, | concerning | the linear | road |     |     |     |     |     |     |
| --------- | -------------- | ------- | ---------- | ---------- | ---- | --- | --- | --- | --- | --- | --- |
benchmarkdataset,CompressStreamDBdemonstratesasignif- achieves 68.0% lower latency. Moreover, we have the fol-
2.83× lowing observations. First, on the Smart Grid dataset, Com-
| icant | increase | in throughput | over the | baseline, | while |     |     |     |     |     |     |
| ----- | -------- | ------------- | -------- | --------- | ----- | --- | --- | --- | --- | --- | --- |
NSachievesa2.28×improvementoverthebaseline.Notably, pressStreamDB achieves an 85.2% reduction compared to the
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4543
Fig.7. Timebreakdownofcompressionanddecompression.CmpStrisshort
Fig.5. Latencyofdifferentcompressionmethods.
forCompressStreamDB.
method performance remains suboptimal with dynamic work-
loadsduetoitsrigiddatahandlingapproach.Incontrast,Com-
pressStreamDBexhibitsconsistentperformanceasitsadaptive
processing method dynamically adjusts based on data charac-
teristics,ensuringstableperformanceevenamidstchanges.
C. AnalysisofTimeandSpaceSavings
(De)compression time: As we mentioned in Section IV-C,
CompressStreamDB targets diverse lightweight fast compres-
Fig.6. Speedupwithdynamicworkload. sion methods. For the compressions that can bring signifi-
cantperformancebenefits,evendecompressionisrequired,we
still involve them in CompressStreamDB. In our experiments,
uncompressedsystemandsurpassestheperformanceofDICT we include four lightweight decompression-required methods,
by55.6%inlatencyreduction.Second,onthelinearroadbench- RLE, bitmap, NSV, and PLWAH. We conduct experiments on
markdataset,CompressStreamDBdeliversa64.6%decreasein three datasets to statistic the compression time and decom-
latencycomparedtothebaselineandoutperformsNSby19.4%. pression time during processing. Results are shown in Fig. 7.
Third, on the Cluster Monitoring dataset, CompressStreamDB Our observations are as follows. First, NS is a simple and
exhibits a 74.0% reduction in latency against the baseline and fast compression technique, exhibiting the shortest sum time
surpassesBDby38.7%.Finally,ontheStarSchemaBenchmark of compression and decompression across all four datasets.
dataset,CompressStreamDBdemonstratesa48.0%decreasein Notably, NS consistently provides commendable compression
latencycomparedtothebaselineandoutshinesBDby12.7%. ratios across diverse scenarios, ensuring high throughput and
Insummary,CompressStreamDBconsistentlydeliverssuperior latencyperformance.Incontrast,EG,ED,andPLWAH,while
latencyperformancecomparedtoindividualcompressionalgo- categorized as lightweight algorithms, demonstrate relatively
rithms. slowerperformance.Theircomputationalintricaciesandcoding
Dynamic workload: To illustrate the comparison between processescontributetothisdisparity,potentiallyimpactingtheir
the static processing solution and the dynamic processing in overallefficiency.Second,NSVprimarilyinvestsmoretimein
CompressStreamDB, we use the datasets and benchmarks to decompression due to the translation process of byte lengths,
generate dynamic workloads and evaluate on them. Using Q1 whichinfluencesitsbehavior.However,it’scrucialtonotethat
and Q2 on Smart Grids as an illustrative example, we present transmission time constitutes the predominant portion of the
speedup comparisons across various network bandwidths in total processing time. Specifically, in the case of lightweight
Fig.6.Thistrendremainsconsistentacrossothercases,show- compressions, including NSV, decompression time represents
casing similar performance behaviors. We denote “Static” for less than 1.0% of the total processing time, rendering it neg-
thestaticcompressedprocessingmethodwiththeoptimalper- ligible. Third, CompressStreamDB does not rank as the most
formanceonthedynamicworkload,whileCompressStreamDB, time-efficient method in compression and decompression. It
denotedas“CompressStreamDB”,appliesourdynamicdesign. takesamoderateamountoftime.However,CompressStreamDB
TheexperimentalresultsdemonstratethatCompressStreamDB prioritizestheoverallsystemperformanceratherthanfocusing
outperforms the static solution across varying network condi- solelyonoptimizingcompressionefficiency.
tions. Particularly, in a network with 100 Mbps bandwidth, Relationbetweentimeandcompressionratio:TableIVshows
CompressStreamDBexhibitsremarkableperformanceenhance- therelationbetweentimeandcompressionratior.Onaverage,
ment,achievinga9.68×speedupoverthebaselineand3.97× CompressStreamDB saves 68.7% space and 66.1% transmis-
over the optimal static method. The performance of static sion time. We have the following observations. First, among
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

4544 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
TABLEIV
RELATIONSBETWEENTIMEANDCOMPRESSION
Fig.9. Comparisonofthroughputoncloudandedgedevice.
Fig.8. Relationbetweencompressiontimeandinstructions.
compute-intensive situation. The line in Fig. 8 represents the
numberofinstructionsusedincompressionforprocessingeach
all processing methods across datasets, CompressStreamDB
tuple.Meanwhile,thebardenotesthecompressiontimewithout
demonstrates the lowest trans_time ratio. Although BD, as
consideringthewaitingtime.Fig.8revealsanearlyproportional
utilized in TerseCades, exhibits a notable advantage of 60.1%
relationship between the number of instructions executed and
on average, CompressStreamDB still manages to surpass BD
thecompressiontime.Thisalignscloselywiththeestimations
by 21.6%. Second, CompressStreamDB achieves the highest
outlinedinourcostmodel.
compression ratio r, or the lowest 1/r, across all processing
methodsforeachdataset.Forinstance,ontheSmartGriddataset,
D. ComparisonBetweenEdgeDeviceandCloudDevice
CompressStreamDB achieves an r of 6.49, surpassing BD’s
2.80.Thisperformancemarksa2.32×highercompressionratio Inthissection,wefirstcomparethethroughputonthecloud
rcomparedtotheoptimalsinglecompressionalgorithm.Third, and edge platforms, and then compare their throughput/price
transmission time ratio and 1/r are positively correlated and ratio and throughput/power ratio, which demonstrate the cost
changeproportionally,soastotheratioofquerytimeand1/r(cid:2). andenergybenefitsoftheedgedevice.
According to (4) and (5), a high compression ratio r directly Throughput: To demonstrate the portability of Com-
implies lower transmission time. Given our use of lightweight pressStreamDB and further explore its performance, we con-
compression methods, the time incurred during compression duct comparative experiments on the edge platform. We use
anddecompressionremainsmarginal.Hence,themethodwith Raspberry Pi 4B as the edge platform for comparison. Fig. 9
thehighestcompressionratiocansignificantlyenhancesystem illustratesthethroughputcomparisonbetweenthecloudandthe
performance.CompressStreamDBattainsitshighperformance edgeacrossfourdatasets.Onaverage,thecloudexhibits1.21×
predominantlythroughitsexceptionalcompressionratior. thethroughputoftheedgeacrossthesedatasets.Consequently,
Executed instructions versus compression time: In our cost theperformanceofthecloudsurpassesthatoftheedge,resulting
model,compressiontimeanddecompressiontimerelatetothe insuperiorspeeduponthecloudplatform.
number of executed instructions. To validate this assumption, Despitelackingperformanceadvantages comparedtocloud
we conduct an exploration using BD, Bitmap, and DICT on platforms,edgedevicesofferdistinctbenefitsintermsoflower
the Smart Grid dataset. Fig. 8 illustrates the relationship be- powerconsumption,reducedcosts,andtheiraptnessaslocalized
tween the number of executed instructions and the time spent servers closer to end-users. Therefore, evaluating the efficacy
in compression. Note that waiting time is not factored into ofedge devices shouldencompass considerations ofpriceand
this analysis. According to (2), compression time is expected power consumption. To assess this, we introduce two critical
to be proportional to the number of executed instructions for ratios: the throughput/price ratio, calculated as the ratio of
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4545
|     |     |     |     |     |     |     |     | Fig.12. Accuracyofthecostmodel.CmpStrisshortforCompressStreamDB. |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
Fig.10. Comparisonofthroughput/priceratiooncloudandedgedevice.
|          |            |     |                  |       |          |        |          | Fig.13. Effectofbatchsizeonlatencyandspaceusage. |     |     |     |     |     |     |     |
| -------- | ---------- | --- | ---------------- | ----- | -------- | ------ | -------- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
| Fig. 11. | Comparison | of  | throughput/power | ratio | on cloud | device | and edge |                                                  |     |     |     |     |     |     |     |
device.
forillustration,asshowninFig.12.Thedashedlineandthesolid
|            |     |              |     |         |                  |     |        | line show     | the estimated | time | and      | measured | time     | respectively. |        |
| ---------- | --- | ------------ | --- | ------- | ---------------- | --- | ------ | ------------- | ------------- | ---- | -------- | -------- | -------- | ------------- | ------ |
| throughput | to  | price (USD), |     | and the | throughput/power |     | ratio, |               |               |      |          |          |          |               |        |
|            |     |              |     |         |                  |     |        | All estimated | values        | are  | slightly | less     | than the | actual        | values |
denotingtheratioofthroughputtopower(Watt).
becauseofadditionaloverheadcausedbythesystemoperation.
| Throughput/price |     | ratio: | Fig. | 10 shows | the | throughput/price |     |     |     |     |     |     |     |     |     |
| ---------------- | --- | ------ | ---- | -------- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Onaverage,thesystemcostmodelwithinCompressStreamDB
| ratios on | the cloud | server | and | edge device. | In  | the Smart | Grid |     |     |     |     |     |     |     |     |
| --------- | --------- | ------ | --- | ------------ | --- | --------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
achievesanaccuracyof89.2%.Thislevelofaccuracysuggests
| dataset, | the throughput/price |     |     | ratio of | the edge | CPU | surpasses |     |     |     |     |     |     |     |     |
| -------- | -------------------- | --- | --- | -------- | -------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
thatthecostmodelisreliableandsuitableforestimatingthecost
| that of the | cloud | CPU | by 10.81×, | and | for the | remaining | three |     |     |     |     |     |     |     |     |
| ----------- | ----- | --- | ---------- | --- | ------- | --------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
associatedwithstreamprocessingintegratedwithcompression
datasets,theratiosstandat8.90×,10.91×,and9.18×respec-
|            |          |     |      |        |          | 9.95× |        | techniques. |     |          |            |       |     |       |         |
| ---------- | -------- | --- | ---- | ------ | -------- | ----- | ------ | ----------- | --- | -------- | ---------- | ----- | --- | ----- | ------- |
| tively. On | average, | the | edge | device | exhibits | a     | higher |             |     |          |            |       |     |       |         |
|            |          |     |      |        |          |       |        | Batch size: | As  | outlined | in Section | IV-A, | the | batch | size is |
throughput/priceratiocomparedtothecloud,showcasingapro-
|     |     |     |     |     |     |     |     | a factor influencing |     | both | latency | and compression |     | ratio. | Us- |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | ---- | ------- | --------------- | --- | ------ | --- |
nouncedcostadvantageofutilizingedgedevices.Thesefindings
|            |                    |     |     |          |               |         |     | ing the Smart   | Grid | workload      |     | as an illustration, |       | where         | each |
| ---------- | ------------------ | --- | --- | -------- | ------------- | ------- | --- | --------------- | ---- | ------------- | --- | ------------------- | ----- | ------------- | ---- |
| affirm the | cost-effectiveness |     |     | inherent | in the design | purpose | of  |                 |      |               |     |                     |       |               |      |
|            |                    |     |     |          |               |         |     | window contains |      | 1,024 tuples. |     | We depict           | their | interrelation | in   |
theRaspberryPi,knownforitseconomicalutility.
|                  |            |             |           |           |                      |     |          | Fig. 13, considering |           | three    | distinct     | network       | settings:   |               | 1 Gbps    |
| ---------------- | ---------- | ----------- | --------- | --------- | -------------------- | --- | -------- | -------------------- | --------- | -------- | ------------ | ------------- | ----------- | ------------- | --------- |
| Throughput/power |            |             | ratio: In | Fig. 11,  | the throughput/power |     |          |                      |           |          |              |               |             |               |           |
|                  |            |             |           |           |                      |     |          | network,             | 100 Mbps  | network, | and          | a single      | node        | without       | net-      |
| ratio for        | both cloud | and         | edge      | platforms | is presented.        |     | Notably, |                      |           |          |              |               |             |               |           |
|                  |            |             |           |           |                      |     |          | work transmission.   |           | Our      | observations | are           | as follows. |               | First, at |
| the average      | power      | consumption |           | of        | the cloud            | CPU | stands   | at                   |           |          |              |               |             |               |           |
|                  |            |             |           |           |                      |     |          | 100 Mbps,            | weobserve | a        | notable      | riseinlatency |             | corresponding |           |
33.5W,whereastheedgedeviceoperatesatanaveragepower
tolargerbatchsizes.Conversely,withinthe1Gbpsnetworkand
of3.8W.IntheSmartGriddataset,thethroughput/powerratio
7.95×, single-node mode, batch size exhibits comparatively minimal
| on the edge | surpasses |     | that of | the cloud | by  |     | while for |     |     |     |     |     |     |     |     |
| ----------- | --------- | --- | ------- | --------- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
impactonsystemlatency.Thisdivergencearisesfromthecon-
| the other | three | datasets, | these | ratios | are 6.55×, | 8.03×, | and |     |     |     |     |     |     |     |     |
| --------- | ----- | --------- | ----- | ------ | ---------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
straintsimposedbylimitednetworkbandwidth,leadingtodata
6.75×respectively.Onaverage,theedgeplatformdemonstrates
a7.32×higherthroughput/powerratiocomparedtothecloud. queuing before transmission. Consequently, larger batch sizes
caninducesystempauses.Second,asbatchsizeincreases,the
| These findings |     | underscore | the | potential | for significant |     | energy |     |     |     |     |     |     |     |     |
| -------------- | --- | ---------- | --- | --------- | --------------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
spaceoccupancydecreases.Thisphenomenonisattributedtothe
| savings | by leveraging |     | edge devices |     | compared | to cloud-based |     |     |     |     |     |     |     |     |     |
| ------- | ------------- | --- | ------------ | --- | -------- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
improvedutilizationofdataredundancywithlargerbatchsizes.
operations.
Third,theabsenceofanoptimalbatchsizesuggeststhatitsde-
terminationrequiresspecificsituationalanalysis.Furthermore,
E. DesignTradeoffsandDiscussion
|     |     |     |     |     |     |     |     | we conducted | measurements |     | on  | cross-batch | sliding | windows, |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ------------ | --- | --- | ----------- | ------- | -------- | --- |
Modelaccuracy:Weverifytheaccuracyofoursystemcost varyingthewindowslidesizewithintherange{1,128,256,512,
modelinthispart.WeusetheexampleoftheSmartGriddataset 1024} across different network settings. We observed nearly
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore.  Restrictions apply.

4546 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
identicalperformancelevelswithminimalfluctuation(lessthan list compression in memory. Deliege and Pedersen [28] opti-
2%). This consistency is attributed to the ability of our batch mizedspaceandperformanceforbitmapcompression.Wanget
buffertoretaincriticaldatawithoutimposingadditionalstrain al. [29]conductedanexperimentalstudybetweenbitmapand
onnetworktransmission. invertedlistcompressions.Fangetal. [13]analyzedcommon
Performanceonadditionalbenchmark:CompressStreamDB compression algorithms, while Przymus and Kaczmarski [64]
can adapt to various benchmarks. We evaluate it on the TPC- exploredhowtoselectanoptimalcompressionmethodfortime
H benchmark to further demonstrate its potential. The TPC- seriesdatabases.Sprintz[91]introducesafourpartcomposite
H benchmark contains one fact table and seven dimension compression algorithm for time-series data. Many works [86],
tables, with twenty-two standard queries. We adjust TPC-H [87] used hardware such as GPU and FPGA to optimize
and rewrite its queries for stream processing. We use the Q1, data compression. As for processing directly on compressed
Q2, and Q3 of its standard queries for evaluation. On aver- data[18],[19],[20],[21],[92],[93],[94],thistechnologycan
age,CompressStreamDBachieves2.18×throughputcompared provideefficientstorageandretrievalofdata.Forexample,Chen
to our baseline, while the best single compression algorithm etal. [94]proposedamemory-efficientoptimizationapproach
BD achieves 1.61× throughput. In terms of latency, Com- for large graph analytics, which compresses the intermediate
pressStreamDB can reduce the latency by 53.2% compared to vertexinformationwithHuffmancodingorbitmapcodingand
baseline,by26.2%comparedtoBD. queries on the partially decoded data or directly on the com-
Impactofparallelism:Toinvestigatetheimpactofparallelism pressed data. Li et al. [95], [96], [97] presented compression
onperformance,weconductparallelthroughputexperimentson methods for very large databases, with aggregation operating
thecloudplatform.Onaverage,theparallelversionachievesa directlyoncompresseddatasets.Succinct[20]enablesefficient
throughputimprovementof2.10%comparedtothesingle-core queries directlyonacompressed representation ofdata. Other
version.AlthoughourcloudplatformisequippedwithanIntel works[18],[19],[98],[99]focusedonthedirectprocessingof
XeonPlatinum8269CYCPUandsupports52threads,theper- other compressed storage structures such as graphs. Different
formanceimprovementofparallelismislimitedduetonetwork from these studies, our work is the first fine-grained stream
transmission being a key factor affecting performance in our processing engine that can query compressed streams without
experimentalnetworkenvironment. decompression.
VIII. RELATEDWORK IX. CONCLUSION
Datastreamoptimization:Duetotheincreasingdemandfor The demands on stream processing systems continue to
real-timeprocessingofvastamountsofdata,manystudieshave surge as the scale of streaming data expands. The growing
beendevotedtooptimizetheperformanceofstreamsystems[3], volumepresentsconsiderablechallengesintermsofbothtime
[15], [65], [77], [78], [79], [80]. To name a few, Koliousis et efficiency and resource utilization within these systems. We
al. [14] developed Saber, a window-based hybrid stream pro- propose CompressStreamDB, which applies compression al-
cessing for discrete CPU-GPU architectures. Zhang et al. [65] gorithms in stream processing to improve the system perfor-
introducedBriskStream,anin-memorydatastreamprocessing mance. In our implementation, CompressStreamDB integrates
system on shared-memory multi-core NUMA architectures. ninelightweightcompressionalgorithms,significantlyenhanc-
Zhang et al. [15] proposed a fine-grained query method of ing performance compared to operating without any compres-
streamprocessingonCPU-GPUintegratedarchitectures.Zhang sion. Our experiments demonstrate that across four real-world
etal.[81]revisitedthedesignofdatastreamprocessingsystems datasets,CompressStreamDB achieves asubstantial3.84× in-
on multi-core processors. Scabbard [3] is a recently proposed creaseinthroughputwhileattaininga68.0%reductioninlatency
single node optimized stream processing engine focusing on and saving 68.7% space. Moreover, the throughput/price ratio
fault-tolerance aspect. Li et al. [79] proposed a framework ontheedgeplatformoutperformsthatofthecloudplatformby
called TRACE that allows compression on traffic monitoring 9.95×,whilethethroughput/power ratioontheedge is7.32×
streams.Pekhimenkoetal. [66]proposedTerseCades,adopting higherthanthatofthecloud.
an integer compression method and a floating-point number
compressionmethodtoenabledirectprocessingoncompressed
REFERENCES
data.However,noneofthemutilizethediversityoflightweight
data compression technology in stream processing and take [1] B.DelMonteetal.,“Rhino:Efficientmanagementofverylargedistributed
multi-layer transmission scenario with complex factors into stateforstreamprocessingengines,”inProc.ACMSIGMODInt.Conf.
Manage.Data,2020,pp.2471–2486.
consideration.
[2] G. Van Dongen and D. Van den Poel, “Evaluation of stream process-
Processingoncompresseddata:CompressStreamDB’sdirect ing frameworks,” IEEE Trans. Parallel Distrib. Syst., vol. 31, no. 8,
SQL query processing on compressed data is a main feature pp.1845–1858,Aug.2020.
[3] G.Theodorakisetal.,“Scabbard:Single-nodefault-tolerantstreampro-
thatsignificantlyreducebothtimeandspaceoverheadinstream
cessing,”Proc.VLDBEndowment,vol.15,pp.361–374,2021.
processing.Datacompression[13],[28],[29],[30],[64],[82], [4] A. R. M. Forkan et al., “AIoT-citysense: AI and IoT-driven city-scale
[83],[84],[85],[86],[87],[88],[89],[90]hasbeenprovedtobe sensingforroadsideinfrastructuremaintenance,”DataSci.Eng.,pp.1–15,
2023.
aneffectiveapproachtoincreasethebandwidthutilizationand
[5] StateofIoT2021,2021.[Online].Available:https://iot-analytics.com/
resolvethememorystalls.Wangetal. [30]developedinverted number-connected-iot-devices/
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4547
[6] W. Wingerath et al., “Real-time stream processing for Big Data,” Inf. [37] S.Zhangetal.,“Parallelizingintra-windowjoinonmulticores:Anexper-
Technol.,vol.58,pp.186–194,2016. imentalstudy,”inProc.ACMSIGMODInt.Conf.Manage.Data,2021,
[7] B. Gedik et al., “SPADE: The system S declarative stream process- pp.2089–2101.
ing engine,” in Proc. ACM SIGMOD Int. Conf. Manage. Data, 2008, [38] H.Yaretal.,“TowardssmarthomeautomationusingIoT-enablededge-
pp.1123–1134. computingparadigm,”Sensors,vol.21,p.4932,2021.
[8] M.Hirzeletal.,“StreamprocessinglanguagesintheBigDataera,”ACM [39] Z. Lv et al., “Intelligent edge computing based on machine learning
SIGMODRec.,vol.47,pp.29–40,2018. for smart city,” Future Gener. Comput. Syst., vol. 115, pp. 90–99,
[9] P.Deutschetal.,“GZIPfileformatspecificationversion4.3,”1996. 2021.
[10] J.ZivandA.Lempel,“Auniversalalgorithmforsequentialdatacompres- [40] E.Sisinni,A.Saifullah,S.Han,U.Jennehag,andM.Gidlund,“Industrial
sion,”IEEETrans.Inf.Theory,vol.IT-23,no.3,pp.337–343,May1977. InternetofThings:Challenges,opportunities,anddirections,”IEEETrans.
[11] P.Elias,“Universalcodewordsetsandrepresentationsoftheintegers,” Ind.Informat.,vol.14,no.11,pp.4724–4734,Nov.2018.
IEEETrans.Inf.Theory,vol.IT-21,no.2,pp.194–203,Mar.1975. [41] J.Zhang,F.-Y.Wang,K.Wang,W.-H.Lin,X.Xu,andC.Chen,“Data-
[12] J.ZivandA.Lempel,“Compressionofindividualsequencesviavariable- drivenintelligenttransportationsystems:Asurvey,”IEEETrans.Intell.
rate coding,” IEEE Trans. Inf. Theory, vol. IT-24, no. 5, pp. 530–536, Transp.Syst.,vol.12,no.4,pp.1624–1639,Dec.2011.
Sep.1978. [42] Y.Mao,C.You,J.Zhang,K.Huang,andK.B.Letaief,“Asurveyonmobile
[13] W.Fang,B.He,andQ.Luo,“Databasecompressionongraphicsproces- edgecomputing:Thecommunicationperspective,”IEEECommun.Surv.
sors,”Proc.VLDBEndowment,vol.3,pp.670–680,2010. Tuts.,vol.19,no.4,pp.2322–2358,FourthQuarter2017.
[14] A.Koliousisetal.,“SABER:Window-basedhybridstreamprocessingfor [43] J.ChenandX.Ran,“Deeplearningwithedgecomputing:Areview,”
heterogeneousarchitectures,”inProc.ACMSIGMODInt.Conf.Manage. Proc.IEEE,vol.107,no.8,pp.1655–1674,Aug.2019.
Data,2016,pp.555–569. [44] C.-H.Chen,M.-Y.Lin,andC.-C.Liu,“Edgecomputinggatewayofthein-
[15] F.Zhangetal.,“FineStream:Fine-grainedwindow-basedstreamprocess- dustrialInternetofThingsusingmultiplecollaborativemicrocontrollers,”
ingonCPU-GPUintegratedarchitectures,”inProc.USENIXConf.Usenix IEEENetw.,vol.32,no.1,pp.24–32,Jan./Feb.2018.
Annu.Tech.Conf.,2020,Art.no.43. [45] B. Hussain, Q. Du, S. Zhang, A. Imran, and M. A. Imran,
[16] Athirdoftheinternetisjustacopyofitself,2013.[Online].Available: “Mobile edge computing-based data-driven deep learning framework
https://www.businessinsider.com/ for anomaly detection,” IEEE Access, vol. 7, pp. 137656–137667,
[17] P.R.Pietzuch,J.Ledlie,J.Shneidman,M.Roussopoulos,M.Welsh,and 2019.
M. Seltzer, “Network-aware operator placement for stream-processing [46] S.Rajesh,V.Paul,V.G.Menon,S.Jacob,andP.Vinod,“Securebrain-
systems,”inProc.22ndInt.Conf.DataEng.,2006,pp.49–49. to-brain communication with edge computing for assisting post-stroke
[18] F. Zhang, J. Zhai, X. Shen, O. Mutlu, and X. Du, “Enabling efficient paralyzedpatients,”IEEEInternetThingsJ.,vol.7,no.4,pp.2531–2538,
random access to hierarchically-compressed data,” in Proc. IEEE 36th Apr.2020.
Int.Conf.DataEng.,2020,pp.1069–1080. [47] S. Aggarwal and S. Sharma, “Voice based deep learning enabled user
[19] F.Zhangetal.,“Efficientdocumentanalyticsoncompresseddata:Method, interface design for smart home application system,” in Proc. 2nd Int.
challenges, algorithms, insights,” Proc. VLDB Endowment, vol. 11, Conf.Commun.Comput.Ind.4.0,2021,pp.1–6.
pp.1522–1535,2018. [48] S.Liu,L.Liu,J.Tang,B.Yu,Y.Wang,andW.Shi,“Edgecomputingfor
[20] R.Agarwal,A.Khandelwal,andI.Stoica,“Succinct:Enablingqueries autonomousdriving:Opportunitiesandchallenges,”Proc.IEEE,vol.107,
on compressed data,” in Proc. 12th USENIX Conf. Netw. Syst. Des. no.8,pp.1697–1716,Aug.2019.
Implementation,2015,pp.337–350. [49] A.ZilbermanandL.Ice,“Whycomputeroccupationsarebehindstrong
[21] A.Khandelwal,“Queriesoncompresseddata,”UniversityofCalifornia, stememploymentgrowthinthe2019–29decade,”Computer,vol.4,no.5,
Berkeley,2019. pp.11–5,2021.
[22] F.Zhangetal.,“CompressDB:Enablingefficientcompresseddatadirect [50] D.Parketal.,“LiReD:Alight-weightreal-timefaultdetectionsystemfor
processing for various databases,” in Proc. ACM SIGMOD Int. Conf. edgecomputingusingLSTMrecurrentneuralnetworks,”Sensors,vol.18,
Manage.Data,2022,pp.1655–1669. p.2110,2018.
[23] Y.Zhang,F.Zhang,H.Li,S.Zhang,andX.Du,“CompressStreamDB: [51] X.Jiang,F.R.Yu,T.Song,andV.C.M.Leung,“Asurveyonmulti-access
Fine-grainedadaptivestreamprocessingwithoutdecompression,”inProc. edge computing applied to video streaming: Some research issues and
IEEE39thInt.Conf.DataEng.,2023,pp.408–422. challenges,”IEEECommun.SurveysTuts.,vol.23,no.2,pp.871–903,
[24] P.A.Alsberg,“Spaceandtimesavingsthroughlargedatabasecompres- SecondQuarter2021.
sionanddynamicrestructuring,”Proc.IEEE,vol.63,no.8,pp.1114–1122, [52] Z.Zhaoetal.,“IoTedgecomputing-enabledcollaborativetrackingsystem
Aug.1975. formanufacturingresourcesinindustrialpark,”Adv.Eng.Inform.,vol.43,
[25] G.Pekhimenko,V.Seshadri,O.Mutlu,M.A.Kozuch,P.B.Gibbons,andT. 2020,Art.no.101044.
C.Mowry,“Base-delta-immediatecompression:Practicaldatacompres- [53] P.Ranaweera,A.D.Jurcut,andM.Liyanage,“Surveyonmulti-access
sionforon-chipcaches,”inProc.21stInt.Conf.ParallelArchitectures edge computing security and privacy,” IEEE Commun. Surveys Tuts.,
CompilationTechn.,2012,pp.377–388. vol.23,no.2,pp.1078–1124,SecondQuarter2021.
[26] D. Abadi, S. Madden, and M. Ferreira, “Integrating compression and [54] H.ZiekowandZ.Jerzak,“TheDEBS2014grandchallenge,”inProc.8th
executionincolumn-orienteddatabasesystems,”inProc.ACMSIGMOD ACMInt.Conf.Distrib.Event-BasedSyst.,2014,pp.266–269.
Int.Conf.Manage.Data,2006,pp.671–682. [55] Smart home statistics, 2021. [Online]. Available: https://www.statista.
[27] M.A.RothandS.J.VanHorn,“Databasecompression,”ACMSIGMOD com/outlook/dmo/smart-home/united-states
Rec.,vol.22,pp.31–39,1993. [56] A.Arasuetal.,“Linearroad:Astreamdatamanagementbenchmark,”in
[28] F.DeliègeandT.B.Pedersen,“Positionlistwordalignedhybrid:Opti- Proc.30thInt.Conf.VeryLargeDataBases,2004,pp.480–491.
mizingspaceandperformanceforcompressedbitmaps,”inProc.13thInt. [57] MoreGoogleclusterdata,2011.[Online].Available:https://ai.googleblog.
Conf.ExtendingDatabaseTechnol.,2010,pp.228–239. com/2011/11/more-google-cluster-data.html
[29] J.Wangetal.,“Anexperimentalstudyofbitmapcompressionvs.inverted [58] V.Gulisanoetal.,“TheDEBS2017grandchallenge,”inProc.11thACM
listcompression,”inProc.ACMSIGMODInt.Conf.Manage.Data,2017, Int.Conf.Distrib.Event-BasedSyst.,2017,pp.271–273.
pp.993–1008. [59] V.Gulisanoetal.,“TheDEBS2018grandchallenge,”inProc.12thACM
[30] J.Wangetal.,“MILC:Invertedlistcompressioninmemory,”Proc.VLDB Int.Conf.Distrib.Event-BasedSyst.,2018,pp.191–194.
Endowment,vol.10,pp.853–864,2017. [60] C.Mutschler,H.Ziekow,andZ.Jerzak,“TheDEBS2013grandchal-
[31] R. Stephens, “A survey of stream processing,” Acta Inform., vol. 34, lenge,” in Proc. 7th ACM Int. Conf. Distrib. Event-Based Syst., 2013,
pp.491–541,1997. pp.289–294.
[32] P.Córdova,“Analysisofrealtimestreamprocessingsystemsconsidering [61] A.Shanbhag,S.Madden,andX.Yu,“Astudyofthefundamentalperfor-
latency,”UniversityofToronto,2015. mancecharacteristicsofGPUsandCPUsfordatabaseanalytics,”inProc.
[33] M.H.Alietal.,“MicrosoftCEPserverandonlinebehavioraltargeting,” ACMSIGMODInt.Conf.Manage.Data,2020,pp.1617–1632.
Proc.VLDBEndowment,vol.2,pp.1558–1561,2009. [62] T. Neumann, “Efficiently compiling efficient query plans for modern
[34] Apachestorm,2021.[Online].Available:http://storm.apache.org hardware,”Proc.VLDBEndowment,vol.4,pp.539–550,2011.
[35] Apacheflink,2021.[Online].Available:http://flink.apache.org [63] P. A. Boncz, M. Zukowski, and N. Nes, “MonetDB/X100: Hyper-
[36] D.A.Huffman,“Amethodfortheconstructionofminimum-redundancy pipeliningqueryexecution,”inProc.Conf.Innov.DataSyst.Res.,2005,
codes,”Proc.IEEE,vol.40,no.9,pp.1098–1101,Sep.1952. pp.225–237.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

4548 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.9,SEPTEMBER2024
[64] P. Przymus and K. Kaczmarski, “Compression planner for time series [92] Z.Panetal.,“Exploringdataanalyticswithoutdecompressiononem-
databasewithGPUsupport,”inTransactionsonLarge-ScaleData-and beddedGPUsystems,”IEEETrans.ParallelDistrib.Syst.,vol.33,no.7,
Knowledge-CenteredSystemsXV,Berlin,Germany:Springer,2014. pp.1553–1568,Jul.2022.
[65] S.Zhangetal.,“BriskStream:Scalingdatastreamprocessingonshared- [93] F.Zhangetal.,“TADOC:Textanalyticsdirectlyoncompression,”VLDB
memory multicore architectures,” in Proc. ACM SIGMOD Int. Conf. J.,vol.30,pp.163–188,2021.
Manage.Data,2019,pp.705–722. [94] X.Chenetal.,“HBMax:Optimizingmemoryefficiencyforparallelinflu-
[66] G.Pekhimenkoetal.,“Tersecades:Efficientdatacompressioninstream encemaximizationonmulticorearchitectures,”2022,arXiv:2208.00613.
processing,” in Proc. USENIX Conf. Usenix Annu. Tech. Conf., 2018, [95] J.Li,D.Rotem,andH.K.Wong,“Anewcompressionmethodwithfast
pp.307–320. searchingonlargedatabases,”inProc.13thInt.Conf.VeryLargeData
[67] C.Guoetal.,“Pingmesh:Alarge-scalesystemfordatacenternetwork Bases,1987,pp.311–318.
latencymeasurementandanalysis,”inProc.ACMConf.SpecialInt.Group [96] J.Li,D.Rotem,andJ.Srivastava,“Aggregationalgorithmsforverylarge
DataCommun.,2015,pp.139–152. compresseddatawarehouses,”inProc.25thInt.Conf.VeryLargeData
[68] Raspberry pi 4 model b, 2022. [Online]. Available: https://www. Bases,1999,pp.651–662.
raspberrypi.com/products/raspberry-pi-4-model-b/ [97] J.LiandJ.Srivastava,“Efficientaggregationalgorithmsforcompressed
[69] Raspberry pi dramble: Power consumption benchmarks, 2022. [On- datawarehouses,”IEEETrans.Knowl.DataEng.,vol.14,no.3,pp.515–
line]. Available: https://www.pidramble.com/wiki/benchmarks/power- 529,May/Jun.2002.
consumption [98] W. Fan et al., “Query preserving graph compression,” in Proc. ACM
[70] R. Castro Fernandez et al., “Integrating scale out and fault tolerance SIGMODInt.Conf.Manage.Data,2012,pp.157–168.
in stream processing using operator state management,” in Proc. ACM [99] H.MaserratandJ.Pei,“Neighborqueryfriendlycompressionofsocial
SIGMODInt.Conf.Manage.Data,2013,pp.725–736. networks,”inProc.16thACMSIGKDDInt.Conf.Knowl.Discov.Data
[71] I.S.Moreno,P.Garraghan,P.Townend,andJ.Xu,“Analysis,modeling Mining,2010,pp.533–542.
andsimulationofworkloadpatternsinalarge-scaleutilitycloud,”IEEE
Trans.CloudComput.,vol.2,no.2,pp.208–221,SecondQuarter2014.
[72] H.Funkeetal.,“Pipelinedqueryprocessingincoprocessorenvironments,”
inProc.ACMSIGMODInt.Conf.Manage.Data,2018,pp.1603–1618. YuZhangreceivedthebachelor’sdegreefromthe
[73] J.Lietal.,“HippogriffDB:BalancingI/OandGPUbandwidthinBigData Department of Computer Science and Technology,
analytics,”Proc.VLDBEndowment,vol.9,pp.1647–1658,2016.
TsinghuaUniversity,in2021.Heiscurrentlyworking
[74] K.Wangetal.,“ConcurrentanalyticalqueryprocessingwithGPUs,”Proc. towardthePhDdegreewithDEKELabandSchool
VLDBEndowment,vol.7,pp.1011–1022,2014.
of Information, Renmin University of China. His
[75] Y.Yuan,R.Lee,andX.Zhang,“TheYinandYangofprocessingdata majorresearchinterestsincludedatabasesystemsand
warehousingqueriesonGPUdevices,”Proc.VLDBEndowment,vol.6,
parallelcomputing.
pp.817–828,2013.
[76] P.O’Neiletal.,“Thestarschemabenchmarkandaugmentedfacttable
indexing,”inProc.Technol.Conf.Perform.Eval.Benchmarking,2009,
pp.237–252.
[77] X. Ren et al., “LDP-IDS: Local differential privacy for infinite data
streams,”2022,arXiv:2204.00526.
[78] B.Zhaoetal.,“EIRES:Efficientintegrationofremotedataineventstream Feng Zhang received the bachelor’s degree from
processing,” in Proc. ACM SIGMOD Int. Conf. Manage. Data, 2021, Xidian University, in2012,andthePhD degreein
pp.2128–2141. computersciencefromTsinghuaUniversity,in2017.
[79] T.Lietal.,“Trace:Real-timecompressionofstreamingtrajectoriesin He is a professor with DEKE Lab and School of
roadnetworks,”Proc.VLDBEndowment,vol.14,pp.1175–1187,2021. Information,RenminUniversityofChina.Hisma-
[80] Y.Zhou,A.Salehi,andK.Aberer,“Scalabledeliveryofstreamquery jorresearchinterestsincludedatabasesystems,and
result,”inProc.VLDBEndowment,vol.2,pp.49–60,2009. parallelanddistributedsystems.
[81] S.Zhang,B.He,D.Dahlmeier,A.C.Zhou,andT.Heinze,“Revisiting
thedesignofdatastreamprocessingsystemsonmulti-coreprocessors,”
inProc.IEEE33rdInt.Conf.DataEng.,2017,pp.659–670.
[82] J.He,S.Zhang,andB.He,“In-cachequeryco-processingoncoupled
CPU-GPUarchitectures,”Proc.VLDBEndowment,vol.8,pp.329–340,
2014.
HourunLiisaresearchassistantwiththeKeyLabo-
[83] K. Sayood, Introduction to Data Compression. Burlington, MA, USA:
ratoryofDataEngineeringandKnowledgeEngineer-
MorganKaufmann,2017.
ing(MOE),RenminUniversityofChina.Hejoined
[84] D.A.LelewerandD.S.Hirschberg,“Datacompression,”ACMComput.
theKeyLaboratoryofDataEngineeringandKnowl-
Surv.,vol.19,pp.261–296,1987.
edgeEngineering(MOE),in2020.Hismajorresearch
[85] C.Lin,“Acceleratinganalyticqueriesoncompresseddata,”Universityof
interestsincludedatabasesystems,andparalleland
California,SanDiego,2018.
distributedsystems.
[86] C.Riveraetal.,“Optimizinghuffmandecodingforerror-boundedlossy
compressiononGPUs,”2022,arXiv:2201.09118.
[87] J. Tian et al., “Optimizing error-bounded lossy compression for scien-
tific data on GPUs,” in Proc. IEEE Int. Conf. Cluster Comput., 2021,
pp.283–293.
[88] F. Zhang, J. Zhai, X. Shen, O. Mutlu, and X. Du, “POCLib: A high-
performanceframeworkforenablingnearorthogonalprocessingoncom-
pression,”IEEETrans.ParallelDistrib.Syst.,vol.33,no.2,pp.459–475,
Shuhao Zhang received the bachelor’s degree in
Feb.2022.
computerengineeringfromNanyangTechnological
[89] F.Zhangetal.,“Zwift:Aprogrammingframeworkforhighperformance
University,in2014,andthePhDdegreeincomputer
textanalyticsoncompresseddata,”inProc.Int.Conf.Supercomputing,
sciencefromtheNationalUniversityofSingapore,
2018,pp.195–206.
in2019.Heiscurrentlyanassistantprofessorwith
[90] X.Huangetal.,“Meaningfulimageencryptionalgorithmbasedoncom-
NanyangTechnologicalUniversity.Hisresearchin-
pressive sensing and integer wavelet transform,” Front. Comput. Sci.,
terestsincludehighperformancecomputing,stream
vol.17,no.3,2023,Art.no.173804.
processingsystems,anddatabasesystem.
[91] D.Blalock,S.Madden,andJ.Guttag,“Sprintz:Timeseriescompression
for the Internet of Things,” Proc. ACM Interactive Mobile Wearable
UbiquitousTechnol.,vol.2,2018,Art.no.93.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.

ZHANGetal.:DATA-AWAREADAPTIVECOMPRESSIONFORSTREAMPROCESSING 4549
XiaoguangGuoisaresearchassistantwiththeKey AnqunPanisthetechnicaldirectorwiththeDatabase
LaboratoryofDataEngineeringandKnowledgeEn- R&DDepartment,Tencent,inChina.Withmorethan
gineering(MOE),RenminUniversityofChina.He 15 years of experience, he has specialized in the
joinedtheKeyLaboratoryofDataEngineeringand researchanddevelopmentofdistributedcomputing
KnowledgeEngineering(MOE),in2020.Hismajor andstoragesystems.Currently,heisresponsiblefor
researchinterestsincludedatabasesystemsanddis- steeringtheresearchanddevelopmentoftheTencent
tributedsystems. distributeddatabasesystem(TDSQL).
YuxingChenreceivedthePhDdegreeincomputer XiaoyongDureceivedtheBSdegreefromHangzhou
sciencefromtheUniversityofHelsinki,Finland,in University,Zhejiang,China,in1983,theMEdegree
2021.Hecurrentlyworksasaseniorresearchengi- fromtheRenminUniversityofChina,Beijing,China,
neerwiththeDatabaseR&DDepartment,Tencent, in1988,andthePhDdegreefromtheNagoyaInsti-
China.Hisresearchinterestsfocusondatabaseper- tute of Technology, Nagoya, Japan, in 1997. He is
formanceandevaluation,HTAPdatabasedesign,and currentlyaprofessorwiththeSchoolofInformation,
distributedsystemdesign. RenminUniversityofChina.Hiscurrentresearchin-
terestsincludedatabasesandintelligentinformation
retrieval.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 11,2026 at 12:15:45 UTC from IEEE Xplore. Restrictions apply.