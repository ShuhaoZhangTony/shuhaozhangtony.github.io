(cid:13)c 2020bytheauthors;licenseeRonPub,Lu¨beck,Germany.Thisarticleisanopenaccessarticledistributedunderthetermsandconditionsof
theCreativeCommonsAttributionlicense(http://creativecommons.org/licenses/by/4.0/).
OpenAccess
|     |     |     |     |     |     | Open | Journal | of  | Internet | of Things | (OJIOT) |         |
| --- | --- | --- | --- | --- | --- | ---- | ------- | --- | -------- | --------- | ------- | ------- |
|     |     |     |     |     |     |      |         |     |          | Volume 6, | Issue   | 1, 2020 |
http://www.ronpub.com/ojiot
ISSN2364-7108
NebulaStream:
|     | Complex |     |     | Analytics |     |     | Beyond |     | the | Cloud |     |     |
| --- | ------- | --- | --- | --------- | --- | --- | ------ | --- | --- | ----- | --- | --- |
SteffenZeuchA,B,EleniTziritaZacharatouA,ShuhaoZhangA,XenofonChatziliadisA,
AnkitChaudharyA,BonaventuraDelMonteA,DimitriosGiouroukisA,
PhilippM.GrulichA,ArianeZiehnA,VolkerMarkA,B
|     | ATechnischeUniversita¨tBerlin,Straßedes17. |     |     |     |     |     | Juni135,10623Berlin,Germany |     |     |     |     |     |
| --- | ------------------------------------------ | --- | --- | --- | --- | --- | --------------------------- | --- | --- | --- | --- | --- |
{firstname.lastname}@tu-berlin.de
B DFKIGmbH,TrippstadterStr. 122,67663Kaiserslautern,Germany{firstname.lastname}@dfki.de
ABSTRACT
The arising Internet of Things (IoT) will require significant changes to current stream processing engines (SPEs)
to enable large-scale IoT applications. In this paper, we present challenges and opportunities for an IoT data
management system to enable complex analytics beyond the cloud. As one of the most important upcoming IoT
applications, we focus on the vision of a smart city. The goal of this paper is to bridge the gap between the
requirementsofupcomingIoTapplicationsandthesupportedfeaturesofanIoTdatamanagementsystem. Tothis
end, we outlinehow state-of-the-artSPEs have tochange toexploit thenew capabilitiesof theIoT andshowcase
howwetackleIoTchallengesinourownsystem, NebulaStream. Thispaperlaysthefoundationforanewtypeof
systemsthatleveragestheIoTtoenablelarge-scaleapplicationsovermillionsofIoTdevicesinhighlydynamicand
geo-distributedenvironments.
| TYPE | PAPER |     | KEYWORDS |     |     |     |     |     |     |     |     |     |
| ---- | ----- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|      | OF    | AND |          |     |     |     |     |     |     |     |     |     |
Visionarypaper: IoT,application,systems,datamanagement,streamprocessing,smartcity
1 INTRODUCTION on low-latency and high-throughput computing led to
|     |     |     |     |     |     |     | a new class | of  | SPEs, | called Large-Scale | Data | Stream |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ----- | ------------------ | ---- | ------ |
The volume, velocity, and variety of data that need Processing Systems [16]. Systems such as Flink, Spark
to be processed in real-time have reached unseen Streaming, or Storm are representatives of this class.
magnitudes over the last decades. This trend fueled Thesesystemsscale-outtheprocessingofhigh-velocity
the emergence of the first stream processing engines data streams in a cluster of commodity hardware.
(SPEs), such as Aurora, STREAM, TelegraphCQ, Althoughthesesystemsenablelargescaleexecutionon
| and NiagaraCQ, |     | which | process queries | over | incoming |     |     |     |     |     |     |     |
| -------------- | --- | ----- | --------------- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- |
hundredsorthousandsofservers,theyaremosteffective
data streams continuously [16]. However, the ever- when data are generated and used within the cloud.
increasing input rates in combination with the demands However, transferring data from external sources into
|                |                 |        |               |                |             |         | the cloud                                          | induces      | a   | major bottleneck    | that | limits the |
| -------------- | --------------- | ------ | ------------- | -------------- | ----------- | ------- | -------------------------------------------------- | ------------ | --- | ------------------- | ---- | ---------- |
|                |                 |        |               |                |             |         | scalability.                                       | Furthermore, |     | sending computation |      | results    |
| This paper     | is accepted     | at the | International | Workshop       |             | on Very |                                                    |              |     |                     |      |            |
| Large Internet | of Things       | (VLIoT | 2020)         |                |             |         |                                                    |              |     |                     |      |            |
|                |                 |        |               | in conjunction | with        | the     | backtodevicesoutsidethecloudfurtherexacerbatesthis |              |     |                     |      |            |
| VLDB           | 2020 conference | in     | Tokyo, Japan. | The            | proceedings | of      |                                                    |              |     |                     |      |            |
bottleneck.
VLIoT@VLDB2020arepublishedintheOpenJournalofInternet
ofThings(OJIOT)asspecialissue. The arising Internet of Things (IoT) represents a
66

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
continuousoperation.
|          |                        |     |     | InFigure1,       |            | weoutlinethecomponentstackofNES. |                |                 |              |              |
| -------- | ---------------------- | --- | --- | ---------------- | ---------- | -------------------------------- | -------------- | --------------- | ------------ | ------------ |
|          |                        |     |     | NES will         | support    | various                          |                | algorithms      | from         | different    |
|          |                        |     |     | application      | domains    |                                  | with different |                 | requirements | and          |
|          |                        |     |     | expressiveness.  |            | These                            | algorithms     | are             | implemented  | on           |
|          |                        |     |     | top of a         | common     | intermediate                     |                | representation, |              | which        |
|          |                        |     |     | expresses        | the common |                                  | set of         | functionality   |              | offered by   |
|          |                        |     |     | NES. The         | NES        | Engine                           | takes          | the queries     |              | expressed in |
|          |                        |     |     | the intermediate |            | format                           | as input       | and             | orchestrates | their        |
|          |                        |     |     | processing.      | To         | this end,                        | the            | NES             | Engine       | consists of  |
|          |                        |     |     | 1) a query       | compiler   | to                               | generate       | executable      |              | code, 2) a   |
| Figure1: | ComplexAnalyticsinNES. |     |     |                  |            |                                  |                |                 |              |              |
|          |                        |     |     | sensor manager   |            | to interact                      |                | with the        | attached     | sensors,     |
3)adistributeddataflowenginethatefficientlyexecutes
|                 |                 |           |             | long-running | stateful |     | queries, | 4) a | secure | processing |
| --------------- | --------------- | --------- | ----------- | ------------ | -------- | --- | -------- | ---- | ------ | ---------- |
| new environment | that challenges | the above | scalability |              |          |     |          |      |        |            |
enginethatensuresprivacy-awareandsecureprocessing,
bottleneckasdataaremainlygeneratedoutsidethecloud and5)atransactionalenginethatorchestratesconsistent
andresultsmustbesentbacktocloud-externaldevices. transactional processing. The NES Engine runs on
In particular, the IoT adds further pressure on current a variety of heterogeneous and diverse devices, e.g.,
SPE architectures as estimations predict that by 2025 sensors, low-end devices (e.g., Raspberry Pi), network
| the global | amount of data | will reach 175ZB | and 30% |         |        |       |           |            |     |          |
| ---------- | -------------- | ---------------- | ------- | ------- | ------ | ----- | --------- | ---------- | --- | -------- |
|            |                |                  |         | devices | (e.g., | smart | routers), | cloudlets, |     | or cloud |
of these data will be gathered in real-time [59] by as nodes. With this component stack, the main goal of
many as 20 billion connected devices [36]. As a result, NebulaStreamistoenabletheemergingIoTapplications
| themajorityofthesedatawillbegeneratedandusedby |     |     |     | ofthefuture. |     |     |     |     |     |     |
| ---------------------------------------------- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- |
devicesinhighly-distributed,potentiallygeo-distributed, In this paper, we bring together the requirements of
| environments. | However, | state-of-the-art | cloud-based |          |     |              |     |     |           |          |
| ------------- | -------- | ---------------- | ----------- | -------- | --- | ------------ | --- | --- | --------- | -------- |
|               |          |                  |             | upcoming | IoT | applications | and | the | supported | features |
SPEs are not built for such an environment and require of an IoT data management system. While developing
datatobetransferredintothecloudtoextractvaluefrom NES,weconstantlyreviewstate-of-the-artapproachesto
them. Incontrast, anIoTdatamanagementsystemwill identify which concepts and algorithms can be adopted
enabledataprocessingalongthepathfromdatasources and for which problems we require novel solutions. As
| to the cloud, | using the increasing | capabilities | of cloud- |          |                  |     |     |        |         |             |
| ------------- | -------------------- | ------------ | --------- | -------- | ---------------- | --- | --- | ------ | ------- | ----------- |
|               |                      |              |           | our main | IoT application, |     | we  | target | a smart | city, where |
externaldevices. millions of sensors are distributed across the city to
Over the last decades, many research communities gather information about traffic, air and water quality,
cover specific parts of the overall IoT vision. First, crowdedness,andmanymore.Inthefollowingpaper,we
Mobile Cloud Computing (MCC) outsources data first describe core features that are necessary to enable
storage and processing from devices to the cloud [7]. the next generation of IoT applications for smart cities
Second, Mobile-Edge Computing (MEC) extends IoT butarenotyetsupportedbystate-of-the-artsystems,i.e.,
servicesthroughhubdevicesattheedgeofthetopology, adaptive sensor handling (Sec. 2.1), massive scalability
which act as local control centers [62]. Third, Fog- (Sec. 2.2), heterogeneity of workloads and devices
aware IoT data processing uses the Fog, a collective (Sec. 2.3), and delivery guarantees (Sec. 2.4). After
term for resources outside the cloud, as an extension of that, we investigate two new features that will enable
cloud [3, 63, 75, 10]. Finally, Sensor networks (SNs), new classes of applications within a smart city but
in particular Wireless Sensor Networks (WSN) target are currently neither part of common SPEs nor IoT
distributedprocessinginawirelessnetworkofsensorsas data management systems, i.e., secure-privacy-aware
aparticularsub-areaoftheIoT[48].WithNebulaStream (Sec.2.5)andtransactionprocessing(Sec.2.6). Finally,
(NES), we are currently building a data management weinvestigatedomain-specificfeaturesthatcansupport
system for upcoming IoT environments that combines various application scenarios within a smart city, i.e.,
approaches from these research communities as well as supportforsignalprocessing(Sec.3.1),spatialanalytics
thebroadliteratureofcloud-basedSPEsandintroduces (Sec. 3.2), complex event processing (Sec. 3.3), and
novel solutions [78]. In our vision, NES pioneers a machine learning (Sec. 3.4). For all presented features,
new class of systems, that copes with heterogeneity we outline thechallenges andrequirements, discussthe
and distribution of compute and data, supports state-of-theart,showtheirlimitations,andhighlighthow
diverse data and programming models going beyond to efficiently use them in IoT infrastructures. Overall,
relational algebra, deals with potentially unreliable this paper lays the foundation for a new type of SPEs
communication, and enables constant evolution under that leverages the IoT to enable new possibilities for
67

OpenJournalofInternetofThings(OJIOT),Volume6,Issue1,2020
applicationscenariossuchassmartcities. applications to benefit from any optimizations on that
particularlevel.
|        |          |     |     |     |     |     | Supporting   | adaptive |          | operations | at  | the sensor | node  |
| ------ | -------- | --- | --- | --- | --- | --- | ------------ | -------- | -------- | ---------- | --- | ---------- | ----- |
| 2 CORE | FEATURES |     |     |     |     |     |              |          |          |            |     |            |       |
|        |          |     |     |     |     |     | level allows | one      | to scale | the number |     | of sensors | while |
Inthissection,wedescribecorefeaturesthatarerequired reducingthevolumeofnetworktrafficwithoutharming
|     |     |     |     |     |     |     | the precision | of  | the results. | The | system | will | be able |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------------ | --- | ------ | ---- | ------- |
toenablethenextgenerationofIoTapplicationsbutare
notyetsupportedbystate-of-the-artsystems. to distinguish interesting events while allowing only
transmissionofimportantdata.
2.1 AdaptiveHandlingofSensorDataStreams
2.1.3 EnablingEmergingIoTApplications
| Sensor | data in | IoT | environments |     | have a | fluctuating |     |     |     |     |     |     |     |
| ------ | ------- | --- | ------------ | --- | ------ | ----------- | --- | --- | --- | --- | --- | --- | --- |
nature,whichposesachallengeforresource-constrained IoT applications, such as real time monitoring of drone
devices that cannot easily cope with the velocity and fleets or outlier detection of sensor data on a city-
|        |             |     |                   |     |         |       | wide infrastructure, |     | produce | workloads |     | of fluctuating |     |
| ------ | ----------- | --- | ----------------- | --- | ------- | ----- | -------------------- | --- | ------- | --------- | --- | -------------- | --- |
| volume | of incoming |     | data. Overwhelmed |     | devices | incur |                      |     |         |           |     |                |     |
back-pressure, which further results in data losses and nature. This causes local bottlenecks that need to
|                   |     |                                |     |     |     |     | be dealt    | as early | as possible, |             | before | they              | propagate |
| ----------------- | --- | ------------------------------ | --- | --- | --- | --- | ----------- | -------- | ------------ | ----------- | ------ | ----------------- | --------- |
| highquerylatency. |     | Toaddressthischallengeandavoid |     |     |     |     |             |          |              |             |        |                   |           |
|                   |     |                                |     |     |     |     | downstream. | With     | NES,         | we envision |        | a true end-to-end |           |
performancedeterioration,anIoTsystemneedstoadapt
thenumberofsensorreadstotheobservedphenomenon system, wherefluctuationmitigationstartsatthesensor
|     |     |     |     |     |     |     | nodes. | By utilizing | adaptive |     | sampling | and | adaptive |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------------ | -------- | --- | -------- | --- | -------- |
andmaximizesharingofsensorresults,therebyavoiding
resourceoveruse. filtering of sensor data at the source, we keep in check
thedynamicityofvariousworkloadswithoutalteringthe
|     |     |     |     |     |     |     | context | of the data. | Through |     | these operators, |     | we are |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------------ | ------- | --- | ---------------- | --- | ------ |
2.1.1 State-of-the-ArtSystems
|     |     |     |     |     |     |     | able to a) | conserve | energy | and | b) reduce | unnecessary |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | -------- | ------ | --- | --------- | ----------- | --- |
Current state-of-the-art systems focus on handling network communication while c) retaining a high-
processing at the edge and under a homogeneous qualityrepresentationoftheoriginaldatastream.
| hardware | assumption |     | [56], | i.e., | homogeneous |     |     |     |     |     |     |     |     |
| -------- | ---------- | --- | ----- | ----- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
networking equipment or execution nodes. Other 2.2 MassiveScalability
| state-of-the-art |     | SPEs | deal | with | stream | fluctuation |     |     |     |     |     |     |     |
| ---------------- | --- | ---- | ---- | ---- | ------ | ----------- | --- | --- | --- | --- | --- | --- | --- |
by employing input admission [9], where systems An IoT data management system continuously receives
|         |       |          |      |          |     |            | various | machine-generated |     | or  | user-submitted |     | long- |
| ------- | ----- | -------- | ---- | -------- | --- | ---------- | ------- | ----------------- | --- | --- | -------------- | --- | ----- |
| keep in | check | incoming | data | streams, | but | forego any |         |                   |     |     |                |     |       |
optimizations at the source level. Finally, well-known runningandad-hocqueries. Tobeeffective, itneedsto
|              |         |     |       |                  |     |          | provide | support | for millions | of  | concurrent | queries | [70]. |
| ------------ | ------- | --- | ----- | ---------------- | --- | -------- | ------- | ------- | ------------ | --- | ---------- | ------- | ----- |
| sensor-based | systems |     | focus | on disseminating |     | a single |         |         |              |     |            |         |       |
queryoverasensornetwork[48,74]. In addition, an IoT system needs to handle millions of
|     |     |     |     |     |     |     | highly heterogeneous |     | and        | distributed |         | data streams   | that |
| --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | ---------- | ----------- | ------- | -------------- | ---- |
|     |     |     |     |     |     |     | can be achieved      |     | by routing | the         | streams | as efficiently | as   |
2.1.2 LimitationsofState-of-the-Art
possiblethroughthenetworkofprocessingnodes.
| In the IoT, | streams |     | are ephemeral |     | and start | from the |     |     |     |     |     |     |     |
| ----------- | ------- | --- | ------------- | --- | --------- | -------- | --- | --- | --- | --- | --- | --- | --- |
level of sensors. Sensors are distributed, transient, 2.2.1 State-of-the-ArtSystems
| prone to | failure, | resource-constrained, |     |     |     | and offer | a   |     |     |     |     |     |     |
| -------- | -------- | --------------------- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
diverse feature set that is heterogeneous among nodes. Several approaches for processing IoT data exist today.
Moreover, applications require sensor data under Acloud-basedsystemsuchasMobileCloudComputing
multiple assumptions and constraints, e.g., outlier (MCC) relies on gathering and sending the data from a
|           |          |           |      |     |            |        | pool of sensors |     | to cloud | for storage | and | processing | [7]. |
| --------- | -------- | --------- | ---- | --- | ---------- | ------ | --------------- | --- | -------- | ----------- | --- | ---------- | ---- |
| detection | requires | real-time | data | but | monitoring | trends |                 |     |          |             |     |            |      |
over large time-series requires low sampling and no Cloud infrastructures make use of common SPEs,
filtering. such as Apache Flink [17], Spark Streaming [77], or
Current state-of-the-art systems either deal with Storm[68]forprocessingtheincomingdatastreams.
specific parts of an IoT environment or assume the Edge-awaresystemssuchasMobile-EdgeComputing
|           |     |             |     |            |     |          | (MEC) | overcome | the | limitations |     | of cloud-centric |     |
| --------- | --- | ----------- | --- | ---------- | --- | -------- | ----- | -------- | --- | ----------- | --- | ---------------- | --- |
| existence | of  | homogeneous |     | resources. | At  | the same |       |          |     |             |     |                  |     |
time, systems that only focus on sensors do not take approaches by utilizing hub devices to extend their IoT
the increased capabilities of the nodes that host the services[62,6].Hubdevicesresideattheedgeofthefog
sensors(sensornodes)intoaccountandcannotbeeasily topology for gathering data from attached sensors and
integrated into existing SPEs. In general, existing performingsimpleprocessingsteps.
systems do not treat sensor nodes as a first-class Fog-awaresystems,e.g.,Frontier[56],Disco[11],or
component of an SPE and, thus, do not allow for theextensionofCisco’sConnectedStreamingAnalytics
68

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
(CSA)[62]utilizetheprocessingcapabilityofthefogby nodes consist of embedded System-on-a-Chip Devices
distributingqueriesoverthetopology. (SoCs), low-energy servers, or contain specialized
|     |     |     |     |     |     |     | accelerators | like | embedded | GPUs | (e.g., | Nvidia | Jetson) |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ---- | -------- | ---- | ------ | ------ | ------- |
2.2.2 LimitationsofState-of-the-Art or TPUs (e.g., Coral Edge TPU). As a result, an
|     |     |     |     |     |     |     | IoT data | management |     | system | needs | to  | support an |
| --- | --- | --- | --- | --- | --- | --- | -------- | ---------- | --- | ------ | ----- | --- | ---------- |
ExistingapproachesforprocessingIoTdatahaveseveral
|              |     |             |             |          |          |          | unseen variety      |     | of heterogeneous                   |           | devices, | which        | it must  |
| ------------ | --- | ----------- | ----------- | -------- | -------- | -------- | ------------------- | --- | ---------------------------------- | --------- | -------- | ------------ | -------- |
| limitations. | The | cloud-based |             | approach | is       | limited  | by                  |     |                                    |           |          |              |          |
|              |     |             |             |          |          |          | efficientlyexploit. |     | Thisheterogeneityintroducesseveral |           |          |              |          |
| the amount   | of  | data it     | can receive |          | from IoT | devices. |                     |     |                                    |           |          |              |          |
|              |     |             |             |          |          |          | challenges,         | as  | devices use                        | different |          | data formats | (little- |
A higher number of IoT devices results in a higher vs. big-endian), different programming models (CPUs
| volume     | of data, | which       | can potentially |        | create             | a network |                 |     |               |             |     |            |          |
| ---------- | -------- | ----------- | --------------- | ------ | ------------------ | --------- | --------------- | --- | ------------- | ----------- | --- | ---------- | -------- |
|            |          |             |                 |        |                    |           | vs. GPUs),      |     | and different | instruction |     | sets       | (ARM vs. |
| bottleneck | and      | thus create |                 | delays | in the processing. |           |                 |     |               |             |     |            |          |
|            |          |             |                 |        |                    |           | x64). Depending |     | on the        | workload,   |     | the system | has to   |
Similarly,anedge-awareapproachthatuseshubdevices
picktherightdeviceandacceleratortomeetthedesired
| has the | limitation | in terms | of  | performing | holistic | data |     |     |     |     |     |     |     |
| ------- | ---------- | -------- | --- | ---------- | -------- | ---- | --- | --- | --- | --- | --- | --- | --- |
performanceandenergyrequirements.
| processing. | Also, | this | approach | does | not leverage | the |     |     |     |     |     |     |     |
| ----------- | ----- | ---- | -------- | ---- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
cloudresourcesforperformingadditionalcomputations.
|              |     |      |            |      |     |           | 2.3.1 | State-of-the-ArtSystems |     |     |     |     |     |
| ------------ | --- | ---- | ---------- | ---- | --- | --------- | ----- | ----------------------- | --- | --- | --- | --- | --- |
| This affects | the | type | of queries | that | are | supported |       |                         |     |     |     |     |     |
by the system. Additionally, the hub device controls Currentdataprocessingsystemsusuallychoosebetween
| the number      | of                                    | IoT devices  |             | that it   | can support | and      |             |                     |                 |         |                 |       |             |
| --------------- | ------------------------------------- | ------------ | ----------- | --------- | ----------- | -------- | ----------- | ------------------- | --------------- | ------- | --------------- | ----- | ----------- |
|                 |                                       |              |             |           |             |          | two extreme |                     | design choices. |         | General-purpose |       | SPEs        |
| thus restricts  | the                                   | scalability. |             | Fog-aware | approaches  |          |             |                     |                 |         |                 |       |             |
|                 |                                       |              |             |           |             |          | are usually | hardware-oblivious, |                 |         | e.g.,           | Flink | [17], Spark |
| mentioned       | above                                 | have         | limitations | in        | handling    | evolving |             |                     |                 |         |                 |       |             |
|                 |                                       |              |             |           |             |          | Streaming   | [77],               | or Storm        | [68].   |                 | They  | use virtual |
| infrastructure. | Thisrestrictstheprocessingofqueriesin |              |             |           |             |          |             |                     |                 |         |                 |       |             |
|                 |                                       |              |             |           |             |          | machines,   | e.g.,               | the Java        | Virtual | Machine,        |       | to abstract |
alargedynamicenvironmentwheretheIoTdevicesare from the underlying hardware. This allows the
constantlyjoiningandleavingtheenvironment.
|                |           |           |      |         |                   |            | support         | of a      | wide              | range      | of computing |          | devices.   |
| -------------- | --------- | --------- | ---- | ------- | ----------------- | ---------- | --------------- | --------- | ----------------- | ---------- | ------------ | -------- | ---------- |
| NES            | considers | a unified | fog  | and     | cloud environment |            |                 |           |                   |            |              |          |            |
|                |           |           |      |         |                   |            | However,        | it limits | the               | efficiency | as           | specific | hardware   |
| for processing | IoT       | data.     | This | enables | NES               | to perform |                 |           |                   |            |              |          |            |
|                |           |           |      |         |                   |            | characteristics |           | are not utilized. |            | In contrast, |          | other SPEs |
earlycomputationsinfogandanyremainingorholistic
|     |     |     |     |     |     |     | are hardware-specific, |     |     | e.g., TinyDb |     | [48], | Streambox- |
| --- | --- | --- | --- | --- | --- | --- | ---------------------- | --- | --- | ------------ | --- | ----- | ---------- |
computationsinthecloud. Additionally,thesupportfor TZ[57],Grizzly[34],orBriskStream[81],andoptimize
sustainingnetworkornodefailuresanddevicemobility
|     |     |     |     |     |     |     | for very | specific | hardware | characteristics. |     |     | However, |
| --- | --- | --- | --- | --- | --- | --- | -------- | -------- | -------- | ---------------- | --- | --- | -------- |
allowsNEStohandleevolvingtopology.
|     |     |     |     |     |     |     | they cannot        | generalize |          | across | a diverse     | set | of devices   |
| --- | --- | --- | --- | --- | --- | --- | ------------------ | ---------- | -------- | ------ | ------------- | --- | ------------ |
|     |     |     |     |     |     |     | with heterogeneous |            | hardware |        | capabilities. |     | As a result, |
2.2.3 EnablingEmergingIoTApplications
nostate-of-the-artsystemprovidesasystemarchitecture
|          |             |     |         |       |         |         | thatcansupportawiderangeofdiversedevicesand, |     |     |     |     |     | at  |
| -------- | ----------- | --- | ------- | ----- | ------- | ------- | -------------------------------------------- | --- | --- | --- | --- | --- | --- |
| NES will | efficiently |     | process | large | volumes | of data |                                              |     |     |     |     |     |     |
thesametime,exploitsspecifichardwarecharacteristics,
| coming | from | millions | of  | devices | in a | dynamic |     |     |     |     |     |     |     |
| ------ | ---- | -------- | --- | ------- | ---- | ------- | --- | --- | --- | --- | --- | --- | --- |
ifavailable.
| environment. | This | will | enable | NES | to support | a new |     |     |     |     |     |     |     |
| ------------ | ---- | ---- | ------ | --- | ---------- | ----- | --- | --- | --- | --- | --- | --- | --- |
generationofapplicationsspanningovermillionsofgeo-
distributeddevicesacrossasmartcity,suchasconnected 2.3.2 LimitationsofState-of-the-Art
| cars or | smart public | transport |     | systems. | Furthermore, |     |     |     |     |     |     |     |     |
| ------- | ------------ | --------- | --- | -------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
efficient query execution allows for handling massive The IoT has fundamental challenges that make current
|        |            |           |     |             |         |     | dataprocessingsolutionsinsufficient. |       |          |        |     | First,  | devicesare |
| ------ | ---------- | --------- | --- | ----------- | ------- | --- | ------------------------------------ | ----- | -------- | ------ | --- | ------- | ---------- |
| amount | of queries | generated |     | by external | systems |     | or                                   |       |          |        |     |         |            |
|        |            |           |     |             |         |     | very diverse,                        | which | requires | system |     | support | for a wide |
submittedbyusers.
|     |     |     |     |     |     |     | rangeofdifferenthardwarecharacteristics. |        |          |         |          |           | Second, the |
| --- | --- | --- | --- | --- | --- | --- | ---------------------------------------- | ------ | -------- | ------- | -------- | --------- | ----------- |
|     |     |     |     |     |     |     | devices                                  | in the | IoT have | limited | hardware | resources | and         |
2.3 SupportforHeterogeneousDevices
|     |     |     |     |     |     |     | energybudgets, |     | whichmakeabstractions, |     |     | e.g., | avirtual |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ---------------------- | --- | --- | ----- | -------- |
IoT environments consist of a wide range of diverse machine,notfeasible.Tothisend,NESisheterogeneous
compute devices (from small sensors to high- hardware-consciousandoptimizesbothrequirementsin
performance data centers). Sensors that generate aholisticandgeneralway.
| the source | data | stream | are | often | battery-powered |     |     |     |     |     |     |     |     |
| ---------- | ---- | ------ | --- | ----- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- |
and have typically limited computing resources. In 2.3.3 EnablingEmergingIoTApplications
| contrast, | the cloud | has | nearly | unlimited | compute | and |     |     |     |     |     |     |     |
| --------- | --------- | --- | ------ | --------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
storage resources, while cloud nodes are equipped with The support of diverse devices is a core requirement
high-performance multi-core CPUs and accelerators of every SPE in an IoT environment. The efficient
like GPUs and TPUs. The fog represents a suitable exploitationoftheindividualhardwareresourcesofsuch
middle-groundbetweenthesensorsandthecloud,since devicesiscrucialforenablingarangeofnewinnovative
| it contains | more | capable | nodes | than | sensors. | These | applications. |     |     |     |     |     |     |
| ----------- | ---- | ------- | ----- | ---- | -------- | ----- | ------------- | --- | --- | --- | --- | --- | --- |
69

OpenJournalofInternetofThings(OJIOT),Volume6,Issue1,2020
Oneexampleofsuchanapplicationisasmartpublic Delivery guarantees are not a new concept in stream
transport monitoring system [31]. Such systems gather processing. However, the volatility of the IoT makes
datafromdifferentsourcesandprocessitacrossdiverse themparticularlyhardtoprovide.Weenvisiontoaddress
computenodes. Forinstance,vehiclescollectthesource this challenge with NES, by allowing applications
data and use small battery-powered SoCs to perform to trade performance for consistency or vice versa,
preprocessing. Using a wireless connection, data are depending on the use case. In particular, applications
transferred to intermediate base stations, which may that do not need tight constraints on results may use
perform further calculations. As soon as the data at-most-once semantics and allow record loss to speed
reach the cloud, the SPE computes a final result. The up analytics, e.g., on temperature reads. However,
above layers consist of very diverse hardware and have applications that deal with sensitive data, e.g., car
differentrequirements.NEStakesthisheterogeneityinto accidentdetection,mayemployat-least-onceorexactly-
oncesemanticsattheexpenseoflatency.
| account | to generate | highly | efficient | code | to run | in each |     |     |     |     |     |     |     |
| ------- | ----------- | ------ | --------- | ---- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- |
layer.
|     |     |     |     |     |     |     | 2.5 Secure&PrivateStreamProcessing |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------------------------- | --- | --- | --- | --- | --- | --- |
2.4 DeliveryGuarantees
|     |     |     |     |     |     |     | There is | a fast | increasing | volume | of  | data generated | in  |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------ | ---------- | ------ | --- | -------------- | --- |
IoT applications require diverse guarantees for record theIoTenvironment. Toachievetimelyanalysis, rather
| delivery | and state | update | semantics. |     | These semantics |     |     |     |     |     |     |     |     |
| -------- | --------- | ------ | ---------- | --- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- |
thanprocessinginthecloud,datamustbeprocessednear
affect the consistency of query results and are the source (e.g., the cloud edge) as much as possible to
| categorized | as                | (a) at-most-once |      | i.e.   | record losses | are |                             |        |         |           |                      |         |             |
| ----------- | ----------------- | ---------------- | ---- | ------ | ------------- | --- | --------------------------- | ------ | ------- | --------- | -------------------- | ------- | ----------- |
|             |                   |                  |      |        |               |     | reducetransmissionoverhead. |        |         |           | However,theaboveedge |         |             |
| allowed,    | (b) at-least-once |                  | i.e. | record | duplicates    | are |                             |        |         |           |                      |         |             |
|             |                   |                  |      |        |               |     | processing                  | scheme | exposes | sensitive |                      | data to | significant |
allowed, and (c) exactly-once i.e. every record must be security threats as edge devices are vulnerable to being
processedonlyonce.
|     |     |     |     |     |     |     | attacked,causinginformationleakage. |            |      |            |     | Secure&private |          |
| --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | ---------- | ---- | ---------- | --- | -------------- | -------- |
|     |     |     |     |     |     |     | stream                              | processing | aims | to provide |     | a built-in     | security |
2.4.1 State-of-the-ArtSystems
|     |     |     |     |     |     |     | protection | mechanism  |            | for SPEs, | which    | has        | to be both |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---------- | ---------- | --------- | -------- | ---------- | ---------- |
|     |     |     |     |     |     |     | scalable   | and energy | efficient. |           | Existing | mechanisms |            |
State-of-the-art,cloud-basedSPEssupportexactly-once,
|     |     |     |     |     |     |     | such as | Trusted | Execution | Environment |     | (TEE) | and |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------- | --------- | ----------- | --- | ----- | --- |
at-most-once,andat-least-oncestateupdates[15,22,5].
|             |           |     |           |         |             |     | homomorphic |     | encryption | (HE) | may | require a | revisit in |
| ----------- | --------- | --- | --------- | ------- | ----------- | --- | ----------- | --- | ---------- | ---- | --- | --------- | ---------- |
| They assume | reliable, |     | TCP-based | network | connections |     |             |     |            |      |     |           |            |
ordertobeappliedinanIoTenvironment.
thatdonotlosedata.Furthermore,theyassumeupstream
backup[37]andsophisticatedrecoverymechanisms[15,
5] via persisted state checkpoints to prevent record and 2.5.1 State-of-the-ArtSystems
stateloss.
|     |     |     |     |     |     |     | The Trusted      | Execution |          | Environment |        | (TEE)            | technique |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --------- | -------- | ----------- | ------ | ---------------- | --------- |
|     |     |     |     |     |     |     | is one promising |           | approach | to          | secure | data processing. |           |
2.4.2 LimitationsofState-of-the-Art It isolates a special encrypted area of memory called
In an IoT environment, the assumption of reliable an enclave. Subsequently, it guarantees that code and
|         |             |     |           |        |              |     | data loaded | in  | the enclave | are | protected | with | respect to |
| ------- | ----------- | --- | --------- | ------ | ------------ | --- | ----------- | --- | ----------- | --- | --------- | ---- | ---------- |
| network | connections |     | no longer | holds. | Furthermore, |     |             |     |             |     |           |      |            |
upstream backup and state checkpoints are not feasible confidentiality and integrity. Park et al. [57] reported
|     |     |     |     |     |     |     | how to | extend | existing | SPEs | [52] | to utilize | ARM |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------ | -------- | ---- | ---- | ---------- | --- |
astheunderlyinginfrastructureisvolatileandunreliable.
|              |     |              |     |              |               |     | TrustZone, | which | is one | of  | the implementations |     | of  |
| ------------ | --- | ------------ | --- | ------------ | ------------- | --- | ---------- | ----- | ------ | --- | ------------------- | --- | --- |
| As a result, | IoT | applications |     | will perform | inefficiently |     |            |       |        |     |                     |     |     |
and be error-prone if the above issues are not TEE.However,itstillremainsunclearhowtoefficiently
|         |              |     |               |     |             |      | support | stateful | applications, |     | in particular |     | when the |
| ------- | ------------ | --- | ------------- | --- | ----------- | ---- | ------- | -------- | ------------- | --- | ------------- | --- | -------- |
| solved. | Furthermore, |     | deterministic |     | computation | (see |         |          |               |     |               |     |          |
Section2.6)isnotfeasible,ifthereisnoreliablepartial enclave can not hold large application states. For
example,itcanonlyholduptotensofmegabytes(MB)
| order-preserving |        | delivery    | guarantee. |           | Overall,          | enabling |              |           |     |          |     |        |           |
| ---------------- | ------ | ----------- | ---------- | --------- | ----------------- | -------- | ------------ | --------- | --- | -------- | --- | ------ | --------- |
|                  |        |             |            |           |                   |          | for ARM      | TrustZone | and | up to    | 128 | MB for | Intel SGX |
| reliable         | stream | processing  |            | on a      | highly unreliable |          |              |           |     |          |     |        |           |
| infrastructure   | of     | low-end     | devices    | is        | an open           | research | enclave[13]. |           |     |          |     |        |           |
|                  |        |             |            |           |                   |          | Another      | promising |     | approach |     | is to  | utilize a |
| question.        | In     | particular, |            | the level | of consistency    |          |              |           |     |          |     |        |           |
achievable and the trade-off between consistency and homomorphic encryption (HE) mechanism [14],
|     |     |     |     |     |     |     | which | allows | directly | processing | on  | encrypted | data |
| --- | --- | --- | --- | --- | --- | --- | ----- | ------ | -------- | ---------- | --- | --------- | ---- |
performancemustbecarefullyinvestigated.
|     |     |     |     |     |     |     | (i.e., cyphertext) |     | without | decryption. |     | However, | how to |
| --- | --- | --- | --- | --- | --- | --- | ------------------ | --- | ------- | ----------- | --- | -------- | ------ |
efficientlyutilizehomomorphicencryptionmechanisms
2.4.3 EnablingEmergingIoTApplications
|     |     |     |     |     |     |     | inSPEsstillremainsanopenquestion. |     |     |     |     | Ontheonehand, |     |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | --- | ------------- | --- |
Supporting delivery guarantees enables applications partialHEmechanisms, whichallowforarestrictedset
to enforce or relax constraints on record processing. of operations (e.g., ordering) on cyphertext, may still
70

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
leadtoinformationleakage. Forexample,CryptDB[58] 2.5.3 EnablingEmergingIoTApplications
| utilizing        | order-preserving |       | encryption |           | is reported    | to        | be        |              |         |             |            |          |            |
| ---------------- | ---------------- | ----- | ---------- | --------- | -------------- | --------- | --------- | ------------ | ------- | ----------- | ---------- | -------- | ---------- |
| easily crackable |                  | [30]. | On         | the other | hand,          | all known |           |              |         |             |            |          |            |
|                  |                  |       |            |           |                |           | Secure    | & Private    | stream  | processing  |            | enables  | NES to     |
| fully HE         | schemes,         |       | which      | support   | any operations |           | on        |              |         |             |            |          |            |
|                  |                  |       |            |           |                |           | process   | confidential | data    | by          | providing  | security | and        |
| encrypted        | datasets         | and   | provide    | more      | reliable       | security  |           |              |         |             |            |          |            |
|                  |                  |       |            |           |                |           | integrity | guarantees.  |         | This allows | NES        | to       | be adopted |
| guarantees,      | still            | have  | a long     | way to    | go before      | they can  |           |              |         |             |            |          |            |
|                  |                  |       |            |           |                |           | into many | sensitive    | aspects |             | of a smart | city     | such as    |
be used in practice due to the significant computational smart health care, and smart finance, where data may
| complexity     | [54]. | The      | strict  | low-latency    |                 | processing |               |             |               |               |             |          |           |
| -------------- | ----- | -------- | ------- | -------------- | --------------- | ---------- | ------------- | ----------- | ------------- | ------------- | ----------- | -------- | --------- |
|                |       |          |         |                |                 |            | be generated  |             | over millions |               | of sensors, | and      | privacy   |
| requirement    | of    | SPEs     | and the | low processing |                 | capability |               |             |               |               |             |          |           |
|                |       |          |         |                |                 |            | and integrity |             | need to       | be protected. |             | For      | example,  |
| of IoT devices |       | prohibit | the     | use of any     | computationally |            |               |             |               |               |             |          |           |
|                |       |          |         |                |                 |            | heart rate    | variability |               | analysis      | [61]        | requires | analyzing |
heavyencryptionscheme.
|       |        |              |     |         |            |          | electrocardiograms |              | (ECG) | and | photoplethysmograms |     |           |
| ----- | ------ | ------------ | --- | ------- | ---------- | -------- | ------------------ | ------------ | ----- | --- | ------------------- | --- | --------- |
|       |        |              |     |         |            |          | (PPG).             | Both signals | must  | be  | captured            | and | processed |
| There | exists | an extensive |     | body of | literature | focusing |                    |              |       |     |                     |     |           |
on privacy preservation in relational databases, e.g., k- reliably in real time. It is challenging in supporting
anonymity [66] and differential privacy [25]. However, this use case. On the one hand, any unauthorized read
|                 |     |       |     |             |         |           | or even | modification | to  | the input | signals | or  | application |
| --------------- | --- | ----- | --- | ----------- | ------- | --------- | ------- | ------------ | --- | --------- | ------- | --- | ----------- |
| both approaches |     | focus | on  | statistical | queries | on static |         |              |     |           |         |     |             |
relational data. They are not directly applicable to states (e.g., range of typical values of signals) can
|     |     |     |     |     |     |     | be dangerous |     | and should | be  | prevented. | On  | the other |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ---------- | --- | ---------- | --- | --------- |
streamprocessing,whichhastoachievelowprocessing
latency while dealing with continuous input streams. hand, large processing latency can cause delays in
Specific solutions have also been designed for privacy- identifying emerging situations. To minimize network
|     |     |     |     |     |     |     | transmission | overhead, |     | we  | need to | process | the data |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --------- | --- | --- | ------- | ------- | -------- |
awarestreamprocessing,suchasprivacy-awarecomplex
event processing [35]. However, how best to design a closetothesource(e.g.,sensorsonthepatients),which
|     |     |     |     |     |     |     | is however | vulnerable |     | to be | attacked. | NES | aims to |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---------- | --- | ----- | --------- | --- | ------- |
general-purposeprivacy-awareSPEstillremainsanopen
question. Unstablenetworkconnectionsandpotentially bring security guarantee to stream processing without
noisy data sources in the IoT environment bring even introducing significant overhead. In particular, we will
|     |     |     |     |     |     |     | take a holistic |     | approach | by applying |     | suitable | solutions |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | -------- | ----------- | --- | -------- | --------- |
morechallengestotheprivacy-awaresystemdesign.For
example,itbecomeshardtotellwhetherthenoise[25]or on different components of stream processing across
| suppression[35]isintroducedbytheprivacyprotection |     |     |     |     |     |     | differentlayers. |     |     |     |     |     |     |
| ------------------------------------------------- | --- | --- | --- | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- |
mechanismorbythedynamicIoTenvironment.
2.6 TransactionalStreamProcessing
2.5.2 LimitationsofState-of-the-Art
|     |     |     |     |     |     |     | SPEs with  | transactional |          | state | management  |     | relieve  |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------------- | -------- | ----- | ----------- | --- | -------- |
|     |     |     |     |     |     |     | the burden | of            | managing | state | consistency |     | from the |
Theshiftfrompowerfulserversinacloudenvironment
|        |       |     |         |          |     |            | users. | However, | scaling |     | stream | processing | while |
| ------ | ----- | --- | ------- | -------- | --- | ---------- | ------ | -------- | ------- | --- | ------ | ---------- | ----- |
| to low | power | IoT | devices | requires | us  | to revisit |        |          |         |     |        |            |       |
providingtransactionalstatemanagementischallenging,
| existing | security | mechanisms. |     | On  | the | one hand, |               |     |              |     |             |     |             |
| -------- | -------- | ----------- | --- | --- | --- | --------- | ------------- | --- | ------------ | --- | ----------- | --- | ----------- |
|          |          |             |     |     |     |           | in particular |     | for emerging |     | dynamically |     | distributed |
providingsecurityguaranteesoftenrequiresonetotrade-
|                 |     |     |             |             |         |             | environment | such     | as      | the IoT. | On         | the one     | hand, to  |
| --------------- | --- | --- | ----------- | ----------- | ------- | ----------- | ----------- | -------- | ------- | -------- | ---------- | ----------- | --------- |
| off performance |     | as  | it brings   | significant |         | computation |             |          |         |          |            |             |           |
|                 |     |     |             |             |         |             | achieve     | both low | latency | and      | high       | throughput, | SPEs      |
| complexity.     | On  | the | other hand, | IoT         | devices | are often   |             |          |         |          |            |             |           |
|                 |     |     |             |             |         |             | can process | multiple | input   | events   | (including |             | streaming |
equippedwithrelativelylowcomputationcapacitywith
|     |     |     |     |     |     |     | data and | ad-hoc | user | queries) | [42] | at the | same time |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------ | ---- | -------- | ---- | ------ | --------- |
unstableconnections.
|     |     |     |     |     |     |     | to aggressively |     | exploit | parallelism. |     | On  | the other |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ------- | ------------ | --- | --- | --------- |
The federated environment of IoT also prohibits hand,processingdifferenteventsconcurrentlymaylead
us from relying on centrally governed mechanisms to conflict accesses (reads and writes) to the same
to provide security guarantees. For example, an application state (i.e., concurrent state access), hence
application may require data streams generated across leading to higher chances of violating the transactional
differentregions(e.g., datafromthecapitalofdifferent state consistency [51, 83]. Furthermore, more than
countries). However,sensitivityinformationmaynotbe simply guaranteeing the ACID properties, SPEs need
allowed to leave a specific region. However, existing to enforce the state access order according to the
mechanisms are mostly non-scalable when we have to input event sequence. This is very different from
providesecurityguaranteestomillionsofdevicesacross the conventional concurrency control protocols, which
different layers (i.e., edge, fog, and cloud center) in a serialize transactions in an order that is conflict-
| largegeographicscale. |     |     |     |     |     |     | equivalenttoanycertainserialschedule. |     |     |     |     |     |     |
| --------------------- | --- | --- | --- | --- | --- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- |
71

OpenJournalofInternetofThings(OJIOT),Volume6,Issue1,2020
2.6.1 State-of-the-ArtSystems bytheattachedtimestamps[51,83].
|     |     |     |     |     |     |     | Furthermore, | a   | central | state storage |     | is often | not |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ------- | ------------- | --- | -------- | --- |
Intheareaofgeneralstreamprocessingengines,recently
|     |     |     |     |     |     |     | available | in an IoT | environment. |     |     | This | brings |
| --- | --- | --- | --- | --- | --- | --- | --------- | --------- | ------------ | --- | --- | ---- | ------ |
proposed SPEs achieve excellent performance when even more challenges to provide state consistency as
| processing  | large | volumes        | of  | data | under | tight latency |               |        |         |           |     |               |     |
| ----------- | ----- | -------------- | --- | ---- | ----- | ------------- | ------------- | ------ | ------- | --------- | --- | ------------- | --- |
|             |       |                |     |      |       |               | transactional | states | have to | be stored | in  | a distributed |     |
| constraints | [79]. | In particular, |     | SPEs | such  | as Flink      | [17],         |        |         |           |     |               |     |
manner.Althoughdistributeddatabases/key-valuestores
| Storm [68],  | and          | Heron | [46], | achieve     | high | performance |            |             |          |     |         |            |      |
| ------------ | ------------ | ----- | ----- | ----------- | ---- | ----------- | ---------- | ----------- | -------- | --- | ------- | ---------- | ---- |
|              |              |       |       |             |      |             | have been  | extensively | studied  | and | adopted | in         | some |
| via disjoint | partitioning |       | of    | application |      | states [15] | –          |             |          |     |         |            |      |
|              |              |       |       |             |      |             | SPEs, they | are not     | designed | to  | support | concurrent |      |
often through hash partitioning [43]. This ensures ordered state accesses [83, 2]. Guaranteeing a
| that each                | execution | thread    | (i.e.,                   | executor) |          | maintains   | a                |            |            |         |           |             |         |
| ------------------------ | --------- | --------- | ------------------------ | --------- | -------- | ----------- | ---------------- | ---------- | ---------- | ------- | --------- | ----------- | ------- |
|                          |           |           |                          |           |          |             | deterministic    | execution  | sequence   | and     | state     | consistency |         |
| disjoint                 | subset    | of states | and                      | thereby   | bypasses | the         | issue            |            |            |         |           |             |         |
|                          |           |           |                          |           |          |             | while supporting | concurrent |            | state   | access    | is          | also in |
| ofconcurrentstateaccess. |           |           | However,thistypeofdesign |           |          |             |                  |            |            |         |           |             |         |
|                          |           |           |                          |           |          |             | contradiction    | to the     | highly     | dynamic | IoT       | environment |         |
| can lead                 | to        | tedious   | implementation           |           | and      | ineffective |                  |            |            |         |           |             |         |
|                          |           |           |                          |           |          |             | where input      | record     | can arrive | out     | of order, | have        | an      |
performanceinmanycases[83]. inaccurate timestamp, and miss information. Common
Transactionalstreamprocessingengineshaverecently
|     |     |     |     |     |     |     | problems | in the IoT | environment, |     | e.g., | transient | node |
| --- | --- | --- | --- | --- | --- | --- | -------- | ---------- | ------------ | --- | ----- | --------- | ---- |
received attention from both academia [2, 83] and errors, unreliable connections, low-quality hardware,
industry [27]. In emerging use cases, large mutable lowstoragecapacities,andnoupstreambackups,further
| application                  | states    | can        | be         | concurrently         |               | accessed | by                    |                                 |      |               |     |               |     |
| ---------------------------- | --------- | ---------- | ---------- | -------------------- | ------------- | -------- | --------------------- | ------------------------------- | ---- | ------------- | --- | ------------- | --- |
|                              |           |            |            |                      |               |          | make existing         | scale-up                        | [83] | and scale-out |     | [2] solutions |     |
| multiple                     | operators |            | (and their | executors)           |               | [83,     | 51, hardlyapplicable. |                                 |      |               |     |               |     |
| 2] during                    | stream    | processing |            | and                  | transactional |          | state                 |                                 |      |               |     |               |     |
| consistencyhastobepreserved. |           |            |            | Manysuchapplications |               |          |                       |                                 |      |               |     |               |     |
|                              |           |            |            |                      |               |          | 2.6.3                 | EnablingEmergingIoTApplications |      |               |     |               |     |
| have been                    | proposed  |            | covering   | various              | domains       |          | (e.g.,                |                                 |      |               |     |               |     |
Health-care [71], IoT [12], and E-commerce [51]). Transactional stream processing opens the gate of
RecenttransactionalSPEstypicallymodelstateaccesses linking two popular research fields, OLTP and stream
as transactions [12]. Subsequently, state consistency processing. Iteasesthedevelopmentofmanyemerging
| is maintained |     | by the | system | by adopting |     | transactional |         |                 |              |     |       |       |     |
| ------------- | --- | ------ | ------ | ----------- | --- | ------------- | ------- | --------------- | ------------ | --- | ----- | ----- | --- |
|               |     |        |        |             |     |               | complex | stateful stream | applications |     | [83], | where | the |
semantics (such as ACID properties). However, they processingofasingleeventmayneedtoaccessmultiple
typically rely on locks, where concurrent access to overlapping states while preserving state consistency.
each state is permitted only if the lock is granted Let us take self-driving vehicle monitoring [50] as
to the thread. As a result, it scales poorly while an example, which is one of the popular applications
underutilizing hardware resources [12, 51]. TStream of a smart city. Millions of cars are continuously
is a recently proposed transactional SPE [83], and generating status data via their sensors, and SPEs can
it significantly improves the execution efficiency by offer many services, such as a warning and a list of
completely avoiding locks. However, it is designed for nearbygasstationswheneverthefueltanklevelisbelow
asinglenodeassumingashared-memoryarchitecture. It a certain threshold. The SPE then needs to maintain
mightrequireasystemredesigntofullytakeadvantage gas station information, road condition information,
ofTStream’sapproachinanIoTenvironment. while processing the flood of sensor data streams from
|     |     |     |     |     |     |     | vehicles.      | Tomaketherightdecisionstimely, |         |     |          | consistent |          |
| --- | --- | --- | --- | --- | --- | --- | -------------- | ------------------------------ | ------- | --- | -------- | ---------- | -------- |
|     |     |     |     |     |     |     | and up-to-date | states                         | of both | gas | stations | and        | roads is |
2.6.2 LimitationsofState-of-the-Art
|                   |     |           |     |            |     |               | crucial in     | this example. | This    | is   | challenging |     | because  |
| ----------------- | --- | --------- | --- | ---------- | --- | ------------- | -------------- | ------------- | ------- | ---- | ----------- | --- | -------- |
|                   |     |           |     |            |     |               | the processing | of input      | signals | from | different   |     | vehicles |
| A straightforward |     | mechanism |     | to support |     | transactional |                |               |         |      |             |     |          |
stream processing is to adopt an off-the-shelf may access common application states, e.g., status of
|               |     |          |            |     |        |        | a common | gas station | or road. | To  | relieve | users | from |
| ------------- | --- | -------- | ---------- | --- | ------ | ------ | -------- | ----------- | -------- | --- | ------- | ----- | ---- |
| transactional |     | database | management |     | system | (DBMS) |          |             |          |     |         |       |      |
for state maintenance during stream processing. managing shared state consistency by themselves, NES
Unfortunately, this mechanism not only degrades willprovideanefficienttransactionalstatemanagement
|            |             |     |     |     |      |         | component | to perform | data | integration, |     | analytics, |     |
| ---------- | ----------- | --- | --- | --- | ---- | ------- | --------- | ---------- | ---- | ------------ | --- | ---------- | --- |
| the system | performance |     | but | may | also | violate | state     |            |      |              |     |            |     |
consistency [51]. On the one hand, using a third-party cleaning, and transformation on fresh data in near real
time.
| DBMS | for frequent |     | data access | can | cause | high | inter- |     |     |     |     |     |     |
| ---- | ------------ | --- | ----------- | --- | ----- | ---- | ------ | --- | --- | --- | --- | --- | --- |
processcommunicationoverheadbetweentwodifferent
systems (i.e., DBMS and SPE). On the other hand, 3 DOMAIN-SPECIFIC FEATURES
| conventional |     | DBMSs’ | concurrency |     | control | protocol |     |     |     |     |     |     |     |
| ------------ | --- | ------ | ----------- | --- | ------- | -------- | --- | --- | --- | --- | --- | --- | --- |
only guarantees that the execution order of concurrent Inthissection,wedescribedomainspecificfeaturesthat
transactions is conflict-equivalent to any certain serial arerequiredtoenablearichersetofapplicationsoveran
schedule, which may not obey the event order implied IoTdatamanagementplatformsuchasNES.
72

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
3.1 SignalProcessing memory intensive, and thus cannot be executed on
|           |         |     |        |          |     |          | resource-constrained, |       |       | low-end | fog     | devices. | At the       |
| --------- | ------- | --- | ------ | -------- | --- | -------- | --------------------- | ----- | ----- | ------- | ------- | -------- | ------------ |
| Networked | sensors |     | are at | the core | of  | the IoT. | To                    |       |       |         |         |          |              |
|           |         |     |        |          |     |          | same time,            | there | might | be      | devices | close    | to the input |
analyzesensordataandextractinsights,IoTapplications
sensorsourcesthatareequippedwithspecializedsignal
| employ | a variety | of  | signal | processing |     | techniques, |     |     |     |     |     |     |     |
| ------ | --------- | --- | ------ | ---------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
processinghardwareandarethusparticularlytailoredfor
| e.g., interpolation |              | to            | handle      | missing     |            | sensor     | values,        |            |           |                   |              |                     |              |
| ------------------- | ------------ | ------------- | ----------- | ----------- | ---------- | ---------- | -------------- | ---------- | --------- | ----------------- | ------------ | ------------------- | ------------ |
|                     |              |               |             |             |            |            | efficiently    | executing  |           | DSP operators.    |              | Furthermore,        | DSP          |
| digital filters     | to           | recover       | noisy       | signals,    | and        | Fast       | Fourier        |            |           |                   |              |                     |              |
|                     |              |               |             |             |            |            | operations     | are        | typically | not               | commutative. |                     | Therefore,   |
| Transform           | (FFT)        | to            | do spectral |             | analysis   | [55].      | In             |            |           |                   |              |                     |              |
|                     |              |               |             |             |            |            | event-ordering |            | has       | to be maintained, |              | which               | is hard      |
| addition,           | applications |               | need        | relational  | operators, |            | e.g.,          |            |           |                   |              |                     |              |
|                     |              |               |             |             |            |            | in a highly    | volatile   |           | and distributed   |              | fog infrastructure. |              |
| filters to          | select       | data          | subsets,    | joins       | to combine |            | signals        |            |           |                   |              |                     |              |
|                     |              |               |             |             |            |            | NES aims       | to provide |           | efficient         | native       | support             | for signal   |
| with external       |              | data sources, |             | or group-by |            | aggregates | to             |            |           |                   |              |                     |              |
|                     |              |               |             |             |            |            | processing     | by         | tightly   | integrating       |              | DSP                 | operators in |
groupsignalsaccordingtotheirsource.
|         |         |           |              |               |        |             | the execution |     | engine,      | performing | semantic-aware |          | data      |
| ------- | ------- | --------- | ------------ | ------------- | ------ | ----------- | ------------- | --- | ------------ | ---------- | -------------- | -------- | --------- |
| Domain  | experts | typically |              | use numerical |        | frameworks  |               |     |              |            |                |          |           |
|         |         |           |              |               |        |             | routing,      | and | implementing |            | smart          | operator | placement |
| such as | Matlab  | or        | R to perform |               | signal | processing. |               |     |              |            |                |          |           |
strategiestooptimizeresourceutilization.
| However, | these | frameworks |     | lack support |     | for relational |     |     |     |     |     |     |     |
| -------- | ----- | ---------- | --- | ------------ | --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
operators,arenotsuitedforonlineanalyses,andcannot
scale to large datasets. To address these limitations, 3.1.3 EnablingEmergingIoTApplications
| big data        | frameworks, |          | such         | as Spark, |               | integrate     | with         |            |              |           |           |               |              |
| --------------- | ----------- | -------- | ------------ | --------- | ------------- | ------------- | ------------ | ---------- | ------------ | --------- | --------- | ------------- | ------------ |
|                 |             |          |              |           |               |               | Sensors      | capture    | and          | transmit  | signals   | in streams.   | To           |
| R, allowing     | domain      |          | experts      | to re-use | their         | R             | scripts,     |            |              |           |           |               |              |
|                 |             |          |              |           |               |               | analyze      | these      | data, IoT    | workflows |           | in various    | domains      |
| which are       | now         | executed | on           | Spark’s   | processing    |               | engine.      |            |              |           |           |               |              |
|                 |             |          |              |           |               |               | combine      | relational | and          | signal    | logic.    | ShotSpotter   | [64],        |
| Nevertheless,   | there       | is       | an impedance |           | mismatch      | between       |              |            |              |           |           |               |              |
|                 |             |          |              |           |               |               | for example, |            | is a gunshot |           | detection | and           | localization |
| general-purpose |             | data     | processing   | systems   |               | and numerical |              |            |              |           |           |               |              |
|                 |             |          |              |           |               |               | application  | that       | captures     | impulsive |           | audio signals | likely       |
| frameworks,     |             | which    | introduces   | high      | communication |               |              |            |              |           |           |               |              |
tocorrespondtogunshotsusingacousticsensorsplaced
overhead,makingithardtoattainreal-timeperformance.
|     |     |     |     |     |     |     | in a city.   | The | signals | are        | grouped | by    | regions and |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ------- | ---------- | ------- | ----- | ----------- |
|     |     |     |     |     |     |     | are filtered | to  | remove  | background | noise,  | prior | to being    |
3.1.1 State-of-the-ArtSystems
furtherprocessedbysophisticateddetectiontechniques.
|     |     |     |     |     |     |     | NES aims | to  | support | the execution |     | of DSP | operators |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | ------- | ------------- | --- | ------ | --------- |
ConventionalSPEsdonothavebuilt-insignalprocessing
support. A naive solution to enabling digital signal close to the sensors, and thereby enable emerging
|            |       |     |              |     |        |            | IoT applications |     | to efficiently |     | process | high-rate | signals |
| ---------- | ----- | --- | ------------ | --- | ------ | ---------- | ---------------- | --- | -------------- | --- | ------- | --------- | ------- |
| processing | (DSP) | is  | to implement |     | signal | processing |                  |     |                |     |         |           |         |
operations as user-defined functions. This is, however, originatingfrommillionsofsensors.
| counter-intuitive |     | for | domain | experts, | as  | it requires | a   |     |     |     |     |     |     |
| ----------------- | --- | --- | ------ | -------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
deeperunderstandingofthesystem’sdatamodel. 3.2 EfficientSpatialAnalytics
| There | is a | limited | amount | of  | work | in unifying |               |     |        |         |                |     |            |
| ----- | ---- | ------- | ------ | --- | ---- | ----------- | ------------- | --- | ------ | ------- | -------------- | --- | ---------- |
|       |      |         |        |     |      |             | Data produced |     | by IoT | devices | are inherently |     | geospatial |
relationalandsignalprocessingoperationsintoasingle
|        |        |           |     |          |          |     | innature. | Somedeviceshavefixedstaticlocations(e.g., |     |     |     |     |     |
| ------ | ------ | --------- | --- | -------- | -------- | --- | --------- | ----------------------------------------- | --- | --- | --- | --- | --- |
| system | (e.g., | WaveScope |     | [32] and | TrillDSP |     | [55]).    |                                           |     |     |     |     |     |
smarthouseappliances),whileothers(e.g.,smartphones,
| WaveScope | provides |     | little support |     | for distributed |     | query |     |     |     |     |     |     |
| --------- | -------- | --- | -------------- | --- | --------------- | --- | ----- | --- | --- | --- | --- | --- | --- |
smartwatches,wearables)haveacontinuouslychanging
| execution. | It  | executes | distributed |     | applications |     | over a |     |     |     |     |     |     |
| ---------- | --- | -------- | ----------- | --- | ------------ | --- | ------ | --- | --- | --- | --- | --- | --- |
clusterofafewprocessingnodesorbetweenprocessing location, as they are attached to a moving entity (e.g.,
|           |             |         |             |               |          |            | a human        | or a    | car).    | The volume | and              | rate of | geospatial   |
| --------- | ----------- | ------- | ----------- | ------------- | -------- | ---------- | -------------- | ------- | -------- | ---------- | ---------------- | ------- | ------------ |
| nodes and | sensors.    |         | Only        | lightweight   |          | operations | are            |         |          |            |                  |         |              |
|           |             |         |             |               |          |            | data collected |         | in the   | IoT are    | ever-increasing. |         | Cellular     |
| offloaded | to sensors, |         | while       | a centralized |          | component  |                |         |          |            |                  |         |              |
|           |             |         |             |               |          |            | networks       | produce | millions | of         | records          | per     | second [38]. |
| collects  | data for    | further | processing. |               | TrillDSP | extends    |                |         |          |            |                  |         |              |
|           |             |         |             |               |          |            | Service        | weather | stations | have       | a broad          | range   | of sensors   |
Microsoft’sTrillstreaminganalyticsengine[18],which
doesnotsupportdistributedexecution. that measure atmospheric conditions with increasing
|     |     |     |     |     |     |     | granularity, | generating |      | millions | of      | records         | with each |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ---------- | ---- | -------- | ------- | --------------- | --------- |
|     |     |     |     |     |     |     | scan. At     | the        | same | time, a  | variety | of applications | in        |
3.1.2 LimitationsofState-of-the-Art
domainssuchastransportation,environmentalsciences,
There are only a few stream processing engines that health, and public safety rely on efficient, real-time
provide adequate support for DSP operators [32, 55]. spatial data processing. Connected vehicle applications
However, these engines have no or little support for leverage spatial data to seamlessly optimize mobility in
distributed query execution. Therefore, they cannot smart cities. Monitoring systems require fresh spatial
be deployed in a highly distributed IoT environment. data to prevent dangerous situations and trigger alerts.
Enabling signal processing over streams in such a Given the central role that spatial information plays in
heterogeneous environment is challenging for several theIoTandtheinteractivityexpectedfromapplications,
reasons. First, some DSP operations are compute or there is the need for an IoT data management platform
73

OpenJournalofInternetofThings(OJIOT),Volume6,Issue1,2020
thatsupportslow-latencyspatialanalytics. spatial data analytics, and thereby facilitate emerging
IoTapplicationsindomainssuchastransportation(e.g.,
3.2.1 State-of-the-ArtSystems driverless vehicles, connected cars), public safety (e.g.,
anetworkofconnectedcamerasoracousticsensors)and
| In the | area of | cluster-based |     | systems, | most | existing |     |     |     |     |     |     |     |     |
| ------ | ------- | ------------- | --- | -------- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
health(e.g.,wearablehealthtrackers)
distributedspatialsystemsaredesignedforstatic(batch)
| processing, | and | thus | incur high | latency | for | streaming |     |     |     |     |     |     |     |     |
| ----------- | --- | ---- | ---------- | ------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
queries over streaming data. They are based on 3.3 ComplexEventProcessing
Hadoop[4,26]orSpark[67,72,76].
|     |     |     |     |     |     |     | The IoT | is one | of the | main | domains | that | successfully |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------ | ------ | ---- | ------- | ---- | ------------ | --- |
Existinggeneral-purposeSPEs[17,68]havenodirect
|            |                    |         |          |            |              |              | leverage          | the      | monitoring | features |         | of Complex   |               | Event |
| ---------- | ------------------ | ------- | -------- | ---------- | ------------ | ------------ | ----------------- | -------- | ---------- | -------- | ------- | ------------ | ------------- | ----- |
| support    | for spatial        | data.   | MobyDick |            | [29]         | is a library |                   |          |            |          |         |              |               |       |
|            |                    |         |          |            |              |              | Processing        | (CEP)    | [21,       | 82].     |         | CEP          | is a stateful |       |
| built on   | top of             | Apache  | Flink    | [17]       | that extends | Flink        |                   |          |            |          |         |              |               |       |
|            |                    |         |          |            |              |              | stream processing |          | method     | that     | detects | user-defined |               | rule  |
| with a set | of spatio-temporal |         |          | data types | and          | operators.   |                   |          |            |          |         |              |               |       |
|            |                    |         |          |            |              |              | patterns          | in large | data       | streams. |         | Herewith,    | it enables    |       |
| Tornado    | [49]               | extends | Apache   | Storm      | [68]         | to support   |                   |          |            |          |         |              |               |       |
autonomousreal-timedecisionmakingfordata-intensive
| continuous | spatial-keyword |     |     | queries. | These | extensions |                  |     |       |        |            |     |               |     |
| ---------- | --------------- | --- | --- | -------- | ----- | ---------- | ---------------- | --- | ----- | ------ | ---------- | --- | ------------- | --- |
|            |                 |     |     |          |       |            | IoT applications |     | where | manual | monitoring |     | is infeasible |     |
areinitialresearchprototypessupportingonlyalimited
|     |     |     |     |     |     |     | and prompt | reactions |     | are | required, | e.g., | intelligent |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --------- | --- | --- | --------- | ----- | ----------- | --- |
setofspatialquerytypes.
|     |     |     |     |     |     |     | transportation |          | systems, | smart  | street | lamps,     | vehicle |      |
| --- | --- | --- | --- | --- | --- | --- | -------------- | -------- | -------- | ------ | ------ | ---------- | ------- | ---- |
|     |     |     |     |     |     |     | pollution      | control, | or       | supply | chain  | management |         | [3]. |
3.2.2 LimitationsofState-of-the-Art
Thus,efficientCEPisanecessaryfeatureforfutureIoT
Existing systems face many challenges in supporting applicationswithmillionsofconnecteddevices.
| spatial analytics |                  | in the | IoT.    | First, they | need  | to collect  |     |     |     |     |     |     |     |     |
| ----------------- | ---------------- | ------ | ------- | ----------- | ----- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| all data          | in a centralized |        | cluster | or          | cloud | environment |     |     |     |     |     |     |     |     |
3.3.1 State-of-the-ArtSystems
| prior to | applying | processing. |     | Given | the large | amounts |     |     |     |     |     |     |     |     |
| -------- | -------- | ----------- | --- | ----- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
of data originating from millions of geo-distributed Several SPEs offer CEP features, e.g., Esper1,
sensors, this centralized processing paradigm results in Cayuga[23],STREAM[8],andAurora[1]. Duetothe
high query latency. Second, data are multidimensional, ever-increasing volume and rate of data, the concurrent
heavily skewed, and come at high velocity. As a detection of thousands of patterns requires massive
|     |     |     |     |     |     |     | resource | capacities. |     | To efficiently |     | utilize | the existing |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | --- | -------------- | --- | ------- | ------------ | --- |
result,loadbalancingandindexingtechniquesemployed
by existing spatial data frameworks either incur high resources of these mostly single-machine approaches,
ingestion rates due to frequent re-balancing operations optimization techniques can be applied, e.g., rewriting
or penalize query performance due to partitioning and prefix sharing [45, 60]. However, the majority of
schemes that do not preserve spatial locality [39]. To thesesystemsusepatternspecificationlanguages,which
|         |             |     |              |     |     |             | make automated |     | optimization |     | of their | pattern | detection |     |
| ------- | ----------- | --- | ------------ | --- | --- | ----------- | -------------- | --- | ------------ | --- | -------- | ------- | --------- | --- |
| achieve | low-latency | and | scalability, |     | NES | will employ |                |     |              |     |          |         |           |     |
novel solutions that process spatial data in-network, mechanismchallenging[60].
in a locality-aware manner. Finally, spatial analytics Examples of Large-Scale Data Stream Processing
involve costly geometric computations (such as Point- Systems [16] that offer CEP are Flink [17], Spark [77],
in-Polygon tests) to evaluate relations between objects and Storm [68]. These systems are often cloud-based
| in space | (e.g., | intersection, |     | containment) | and | are thus |            |         |        |           |     |            |          |     |
| -------- | ------ | ------------- | --- | ------------ | --- | -------- | ---------- | ------- | ------ | --------- | --- | ---------- | -------- | --- |
|          |        |               |     |              |     |          | and, thus, | provide | almost | unlimited |     | resources. | Parallel |     |
computationallyexpensive[44,65,69],moreexpensive stream processing and distributed pattern detection
than typical relational queries. Low-end IoT devices monitoring are techniques to distribute the centrally
have limited computational resources, and are thus collected data and efficiently utilize these unlimited
unsuitableforexecutingsuchcostlyoperations.Tomake cloudresources[28]. However, thesetechniquesdonot
efficientuseoftheavailableresources,NESwillemploy solvethecentraldatacollectionbottleneck.
smartplacementstrategiesthatdistributespatialqueries Overall, CEP consists of two components: a pattern
acrossfogandcloudnodeswhileexploitingspecialized specificationlanguage(todefinecomplexeventpatterns)
hardware(e.g.,GPUs)andrespectingdevicelimitations. and a pattern detection mechanism (to detect patterns
|     |     |     |     |     |     |     | in data | streams). | For | neither | of the | two | components, |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | --------- | --- | ------- | ------ | --- | ----------- | --- |
3.2.3 EnablingEmergingIoTApplications
|                |      |                                     |         |                         |             |            | a general                  | solution   | exists,       |            | i.e., several |          | CEP systems |         |
| -------------- | ---- | ----------------------------------- | ------- | ----------------------- | ----------- | ---------- | -------------------------- | ---------- | ------------- | ---------- | ------------- | -------- | ----------- | ------- |
|                |      |                                     |         |                         |             |            | provide                    | their own  | specification |            | languages     |          | (e.g.,      | EPL1,   |
| Most phenomena |      | in                                  | the IoT | are location-dependent. |             |            |                            |            |               |            |               |          |             |         |
|                |      |                                     |         |                         |             |            | SASE+                      | [80], and  | CCL           | [82])      | optimized     | for      | their       | pattern |
| Consequently,  |      | the relevance,                      |         | value,                  | and utility | of IoT     |                            |            |               |            |               |          |             |         |
|                |      |                                     |         |                         |             |            | detection                  | mechanism. |               | Detection  | mechanisms    |          | typically   |         |
| data typically |      | depend                              | on the  | geographic              |             | context    | of                         |            |               |            |               |          |             |         |
|                |      |                                     |         |                         |             |            | focus on                   | either     | several       | variations |               | of state | machines    | or      |
| the devices    | that | produce                             | data    | and                     | of the      | users that |                            |            |               |            |               |          |             |         |
| consumethem.   |      | NESaimstoprovideefficient,real-time |         |                         |             |            | 1http://www.espertech.com/ |            |               |            |               |          |             |         |
74

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
trees, but also event processing networks and column- IoT enables a wide range of autonomous monitoring
based approaches exist [45]. The missing generality of applications that are currently prevented by cloud
CEPsystemsleadstovariousapproacheswithindividual bottlenecksanddatasecurityconcerns.
| optimizations |     | that are | hard to | adapt | to another | CEP |     |     |     |     |     |     |     |
| ------------- | --- | -------- | ------- | ----- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
system orcomputing paradigm [45,84]. Besides, these 3.4 MachineLearning
| variations | strengthen | the | challenge | of  | coping | with the |         |         |          |     |      |        |       |
| ---------- | ---------- | --- | --------- | --- | ------ | -------- | ------- | ------- | -------- | --- | ---- | ------ | ----- |
|            |            |     |           |     |        |          | Complex | machine | learning |     | (ML) | tasks, | e.g., |
rapidevolutionoffutureIoTapplications.
|     |     |     |     |     |     |     | classification, | clustering, |     | and | prediction |     | are key |
| --- | --- | --- | --- | --- | --- | --- | --------------- | ----------- | --- | --- | ---------- | --- | ------- |
applicationstoextractknowledgefrommassiveamount
3.3.2 LimitationsofState-of-the-Art
|             |      |            |            |     |            |      | ofIoTdata. | Therefore, |     | itisnecessarytoprovidenative |     |     |             |
| ----------- | ---- | ---------- | ---------- | --- | ---------- | ---- | ---------- | ---------- | --- | ---------------------------- | --- | --- | ----------- |
|             |      |            |            |     |            |      | ML support | in an      | IoT | data management              |     |     | platform to |
| The central | data | collection | bottleneck |     | of current | SPEs |            |            |     |                              |     |     |             |
prevents their CEP engine from exploiting the spatial fullyprofitfromtheinsightsextractedfromthedata.
| closeness | of event | sources | as  | well | as data | reduction |     |     |     |     |     |     |     |
| --------- | -------- | ------- | --- | ---- | ------- | --------- | --- | --- | --- | --- | --- | --- | --- |
and distributed pattern detection close to the network’s 3.4.1 State-of-the-ArtSystems
edge[19,20].Tothisend,currentSPEsarenotreadyyet As presented by Derakshan et al. [24], a machine
toprovideCEPsolutionsthatfulfillthelow-latencyand
|           |              |     |        |              |     |          | learning                                           | model | training | pipeline | consists |     | of several |
| --------- | ------------ | --- | ------ | ------------ | --- | -------- | -------------------------------------------------- | ----- | -------- | -------- | -------- | --- | ---------- |
| real-time | requirements |     | of IoT | applications | for | millions |                                                    |       |          |          |          |     |            |
|           |              |     |        |              |     |          | stages. Apipelineisiterativeaseverystageisrepeated |       |          |          |          |     |            |
ofdistributedIoTdevices.
|                  |     |        |      |            |     |             | to improve | the performance |     | of   | the model | continuously. |            |
| ---------------- | --- | ------ | ---- | ---------- | --- | ----------- | ---------- | --------------- | --- | ---- | --------- | ------------- | ---------- |
| Fog environments |     | enable | data | processing |     | at the edge |            |                 |     |      |           |               |            |
|                  |     |        |      |            |     |             | The key    | components      | for | each | stage of  | such          | a pipeline |
ofthenetworkusinggeographicallydistributedlow-end are the following: (1) Definition of the input sources,
| devices.    | As a    | result, computational |     | and        | time-intensive |        |                                    |     |     |     |     |              |     |
| ----------- | ------- | --------------------- | --- | ---------- | -------------- | ------ | ---------------------------------- | --- | --- | --- | --- | ------------ | --- |
|             |         |                       |     |            |                |        | (2)Datacleansingandtransformation, |     |     |     |     | (3)Training, | (4) |
| cloud-based | pattern | detection             |     | mechanisms |                | cannot | be                                 |     |     |     |     |              |     |
Evaluation,(5)Materialization,(6)Deployment.
appliedout-of-the-boxandrequireadjustmentstofitthe
|     |     |     |     |     |     |     | State-of-the-art |     | SPEs, | e.g., Flink | do  | not | support all |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ----- | ----------- | --- | --- | ----------- |
hardwarecapabilitiesandbenetwork-aware.
|     |     |     |     |     |     |     | stagesnatively. | InmostapplicationscenariosonlyStage |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------------- | ----------------------------------- | --- | --- | --- | --- | --- |
Future data management platforms need CEP to (1) and (2) are executed in the SPE. For training and
enableautonomousmonitoringapplicationsfortheIoT.
|     |     |     |     |     |     |     | evaluation | (Stage | 3 and | 4), the | data is | then | loaded to a |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------ | ----- | ------- | ------- | ---- | ----------- |
WithinNES,wewanttoprovideadistributedin-network
|          |        |                  |     |               |         |         | batchprocessingsystemlikeSparkorTensorflow. |             |     |                |      |          | After   |
| -------- | ------ | ---------------- | --- | ------------- | ------- | ------- | ------------------------------------------- | ----------- | --- | -------------- | ---- | -------- | ------- |
| CEP for  | future | IoT applications |     | by exploiting |         | the fog |                                             |             |     |                |      |          |         |
|          |        |                  |     |               |         |         | the model                                   | is trained, | it  | is transmitted |      | in Stage | 5 to a  |
| paradigm | given  | limitations      | of  | the low-end   | devices | and     |                                             |             |     |                |      |          |         |
|          |        |                  |     |               |         |         | ML model                                    | management  |     | system         | like | MLFlow   | [53] or |
dynamicnetworktopology. ModelDB [47] At this point, the model is persisted at
|     |     |     |     |     |     |     | a central | location, | and a | versioning | number |     | along with |
| --- | --- | --- | --- | --- | --- | --- | --------- | --------- | ----- | ---------- | ------ | --- | ---------- |
3.3.3 EnablingEmergingIoTApplications additionalmetadata,isattachedtoit. Thedeploymentof
themodelisperformedinStage6,wherealldestinations
CEPisapowerfulstreamprocessingmethod,commonly
thatrequirethenewestversionofthetrainedmodelcan
| used by | various | monitoring | applications. |          | By           | adapting |           |          |           |         |       |            |     |
| ------- | ------- | ---------- | ------------- | -------- | ------------ | -------- | --------- | -------- | --------- | ------- | ----- | ---------- | --- |
|         |         |            |               |          |              |          | access it | from the | centrally | located | model | management |     |
| current | CEP     | systems    | with          | enhanced | distribution |          |           |          |           |         |       |            |     |
systeminthecloud.
| strategies | beyond | cloud | solutions, | NES | will | provide |               |       |          |     |              |     |             |
| ---------- | ------ | ----- | ---------- | --- | ---- | ------- | ------------- | ----- | -------- | --- | ------------ | --- | ----------- |
|            |        |       |            |     |      |         | In situations | where | training |     | or inference |     | is required |
CEP also for future IoT monitoring applications. within the SPE, users have to implement customized
| These monitoring |     | applications |     | profit | further | from the |     |     |     |     |     |     |     |
| ---------------- | --- | ------------ | --- | ------ | ------- | -------- | --- | --- | --- | --- | --- | --- | --- |
solutionsusingUserDefinedFunctions(UDFs).Inthese
previouslyintroducedfeatures,i.e.,spatialdataanalysis
|                    |     |           |          |     |           |           | cases, theprocessesforinferencearerunningasmicro- |     |     |     |     |     |     |
| ------------------ | --- | --------- | -------- | --- | --------- | --------- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| for location-aware |     | patterns, | adaptive |     | filtering | for early |                                                   |     |     |     |     |     |     |
servicesinacentrallocationandarecalledviaRESTor
| data reduction |     | as well | as secure |     | and transactional |     |     |     |     |     |     |     |     |
| -------------- | --- | ------- | --------- | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- |
RemoteProcedureCalls(RPCs).
| processing         | techniques. |            | In particular, |               | the union   | of the     |                                     |     |     |     |     |     |     |
| ------------------ | ----------- | ---------- | -------------- | ------------- | ----------- | ---------- | ----------------------------------- | --- | --- | --- | --- | --- | --- |
| cloud and          | fog         | paradigms  | in a           | single        | environment | will       |                                     |     |     |     |     |     |     |
|                    |             |            |                |               |             |            | 3.4.2 LimitationsofState-of-the-Art |     |     |     |     |     |     |
| allow applications |             | to control |                | the reporting |             | of partial |                                     |     |     |     |     |     |     |
and full matches flexibly to the interested sinks. Some Pushing training and inference operators down to edge
applications may run entirely autonomously in the fog devicesischallengingfromasystemperspective,mainly
layer, e.g., smart street lamp monitoring [40]. Other due to the complexity of ML pipelines. As described
applications might expose their matches to the cloud above, there is no system supporting all the needed
layer, but their sensitive data, which was analyzed to functionalityforallstagesofthepipeline.
detect the match, will not leave a private fog and is In the IoT domain, a data management system
therefore secured. For example, smart hospitals [73] for ML should also cope with the following three
reporting COVID-19 cases to a smart city application characteristicsofIoTtopologiesandtheircorresponding
for further analysis. Overall, distributed CEP for the challenges. First, heterogeneity: The training of a
75

OpenJournalofInternetofThings(OJIOT),Volume6,Issue1,2020
model is a computationally expensive operation that analytics beyond the cloud. To this end, we described
requires many resources and is usually executed on changes to existing core features, investigated new
GPUs. Consequently, model training tasks should features, as well as domain-specific features. For each
be preferably executed in the cloud. Devices in feature, we presented the challenges and requirements,
the IoT vary in resources and run on different discussed the state-of-the-art, showed their limitations,
operating systems and hardware. Applying ML in and highlighted how we can use IoT infrastructures
such a heterogeneous IoT environment is currently not efficiently. Furthermore, we outlined our envisioned
supported by common ML Systems like Tensorflow or solutions for these challenges in our own system
Spark. In particular, specialized approaches for ML NebulaStream. We hope that this paper lays the
inferenceinIoTenvironments[41,33]arenotsupported foundation for a new type of systems that leverages
byageneralpurposesystemsforML. the IoT to enable large-scale applications over millions
Second, limited resources: Difficulties arise from the of IoT devices in highly dynamic and geo-distributed
largesizesofthetrainedmodels. Thestatesofoperators environments. Overall, we envision NebulaStream and
that incorporate pre-trained ML models usually reach its new set of features and possibilities as a major step
sizes of several gigabytes. Handling states of this towardsthesmartcityofthefuture.
magnitude is challenging for memory-constrained IoT
devices. Additionally, distributed training of an ML
REFERENCES
model requires many synchronization messages across
all devices. Given that typical IoT topologies consist
[1] D. J. Abadi, D. Carney, U. Cetintemel,
of several thousands of edge devices, this becomes
M. Cherniack, C. Convey, S. Lee, M. R.
problematic in a setting where network bandwidth is
Stonebraker, N. Tatbul, and S. B. Zdonik,
limited. Third, unreliability: A foundational problem
“Aurora: a new model and architecture for data
in the context of streaming in the IoT is also the way
streammanagement,”VLDBJ,2007.
data is transmitted to the different devices. Applying
existing cloud-based solutions in a fog infrastructure [2] L. Affetti, A. Margara, and G. Cugola, “Flowdb:
risk to stall the whole system, as these solutions are Integrating stream processing and consistent state
prone to backpressure or high latency. In application management,”inDEBS,2017.
scenarios with long-running ML pipelines, it is thus
[3] A. Ahmed, H. Arkian, D. Battulga, A. J.
essential to handle these issues, as they could prohibit
Fahs, M. Farhadi, D. Giouroukis, A. Gougeon,
thecompletionofthepipeline.
F. O. Gutierrez, G. Pierre, and P. R. Souza Jr,
With NES, we propose a system that will support
“Fog computing applications: Taxonomy and
processing tasks on CPUs and GPUs in the cloud, fog,
requirements,”arXiv:1907.11621,2019.
and edge. As a result, NES eliminates the need to
performallpipelinestagesinthecloudandthusenables [4] A.Aji,F.Wang,H.Vo,R.Lee,Q.Liu,X.Zhang,
moreefficientexecutionofMLpipelines. and J. Saltz, “Hadoop-gis: A high performance
spatialdatawarehousingsystemovermapreduce,”
3.4.3 EnablingEmergingIoTApplications inPVLDB,2013.
[5] T.Akidau,A.Balikov,K.Bekirog˘lu,S.Chernyak,
Nowadays, data engineering use cases depend heavily
J. Haberman, R. Lax, S. McVeety, D. Mills,
on statistical models or machine learning. In the era of
P. Nordstrom, and S. Whittle, “Millwheel: fault-
IoT,wherethousandsofdevicesandmillionsofsensors
tolerant stream processing at internet scale,”
are inter-connected across distributed locations, there is
PVLDB,2013.
a need to shift these applications to the edge. In large-
scale IoT environments like a smart city, NES is going [6] Amazon, “Amazon aws greengrass,” accessed
toenableustopushdownaggregateorfilteroperations December 15, 2019. [Online]. Available: https:
withon-the-flyanalyticaldecisions. Byexecutingthese //aws.amazon.com/greengrass
complexanalyticaltasksinearlystagesofdatapipelines,
[7] Amazon, “Aws iot analytics,” retrieved
we have knowledge what data to forward across the
December 15, 2019. [Online]. Available:
networkandthusreducenetworkloadandlatency.
https://aws.amazon.com/iot-analytics
4 CONCLUSION [8] A.Arasu,B.Babcock,andS.Babu,“Stream: The
stanforddatastreammanagementsystem,”inData
This paper presented challenges and opportunities for Stream Management. Springer, 2016, pp. 317–
an IoT data management system to enable complex 336.
76

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
[9] C.Balkesen,N.Tatbul,andM.T.O¨zsu,“Adaptive [22] B. Del Monte, S. Zeuch, T. Rabl, and V. Markl,
input admission and management for parallel “Rhino: Efficient management of very large
streamprocessing,”inDEBS,2013. distributedstateforstreamprocessingengines,”in
SIGMOD,2020.
[10] D.BandyopadhyayandJ.Sen,“Internetofthings:
Applications and challenges in technology and [23] A.J.Demers,J.Gehrke,B.Panda,M.Riedewald,
standardization,”WPC,vol.58,2011. V.Sharma,andW.M.White,“Cayuga: Ageneral
[11] L. Benson, P. M. Grulich, S. Zeuch, V. Markl, purposeeventmonitoringsystem.”inCIDR,2007.
and T. Rabl, “Disco: Efficient distributed window [24] B. Derakhshan, A. R. Mahdiraji, T. Rabl, and
aggregation,” in EDBT. OpenProceedings.org, V. Markl, “Continuous deployment of machine
2020,pp.423–426. learningpipelines.”inEDBT/ICDT,2019.
[12] I. Botan, P. M. Fischer, D. Kossmann, and [25] C.Dwork, F.McSherry, K.Nissim, andA.Smith,
N. Tatbul, “Transactional stream processing,” in “Calibrating noise to sensitivity in private data
EDBT/ICDT,2012. analysis,”inTCC,2006.
[13] S.Brenner,C.Wulf,D.Goltzsche,N.Weichbrodt,
[26] A. Eldawy, “SpatialHadoop: Towards flexible and
M.Lorenz, C.Fetzer, P.Pietzuch, andR.Kapitza,
scalable spatial processing using MapReduce,” in
“Securekeeper: confidential zookeeper using intel
SIGMOD,PhDSymposium,2014.
sgx,”inMiddleware,2016.
[27] S. Ewen, “Data artisans streaming
[14] L.Burkhalter,A.Hithnawi,A.Viand,H.Shafagh,
ledger serializable acid transactions
and S. Ratnasamy, “Timecrypt: Encrypted data
on streaming data,” 2018. [Online].
stream processing at scale with cryptographic
Available: https://www.ververica.com/blog/
accesscontrol,”inNSDI,2020.
serializable-acid-transactions-on-streaming-data
[15] P. Carbone, S. Ewen, G. Fo´ra, S. Haridi,
[28] I. Flouris, N. Giatrakos, A. Deligiannakis,
S.Richter,andK.Tzoumas,“Statemanagementin
M. Garofalakis, M. Kamp, and M. Mock, “Issues
apacheflink: Consistentstatefuldistributedstream
incomplexeventprocessing: Statusandprospects
processing,”PVLDB,2017.
inthebigdataera,”JSS,pp.217–236,2017.
[16] P. Carbone, G. E. Ge´vay, G. Hermann,
[29] Z. Galic´, E. Mesˇkovic´, and D. Osmanovic´,
A.Katsifodimos, J.Soto, V.Markl, andS.Haridi,
“Distributed processing of big mobility data as
“Large-scale data stream processing systems,” in
spatio-temporaldatastreams,”Geoinformatica,pp.
Handbook of Big Data Technologies. Springer,
263–291,2017.
2017.
[30] S. Gallagher. Ms researchers claim to crack
[17] P. Carbone, A. Katsifodimos, S. Ewen, V. Markl,
encrypted database with old simple trick.
S.Haridi,andK.Tzoumas,“Apacheflink: Stream
https://arstechnica.com/information-technology/
and batch processing in a single engine,” TCDE,
2015/09/ms-researchers-claim-to-crack-
2015.
encrypted-database-with-old-simple-trick/.
[18] B. Chandramouli, J. Goldstein, M. Barnett,
[31] H. Gavriilidis, A. Michalke, L. Mons, S. Zeuch,
R. DeLine, D. Fisher, J. C. Platt, J. F. Terwilliger,
and V. Markl, “Scaling a public transport
and J. Wernsing, “Trill: A high-performance
monitoring system to internet of things
incrementalqueryprocessorfordiverseanalytics,”
infrastructures.” in EDBT/ICDT, 2020, pp.
PVLDB,2014.
627–630.
[19] J. Chen, L. Ramaswamy, D. K. Lowenthal, and
[32] L. Girod, Y. Mei, and R. Newton, “The case for a
S.Kalyanaraman,“Comet: Decentralizedcomplex
signal-oriented data stream management system,”
eventdetectioninmobiledelaytolerantnetworks,”
inMDM,2012.
inCIDR,2007.
[20] G.CugolaandA.Margara,“Deploymentstrategies [33] P. M. Grulich and F. Nawab, “Collaborative edge
for distributed complex event processing,” and cloud neural networks for real-time video
Computing,2013. processing,”PVLDB,2018.
[21] T. S. Darwish and K. A. Bakar, “Fog based [34] P.M.Grulich,B.Sebastian,S.Zeuch,J.Traub,J.v.
intelligent transportation big data analytics in the Bleichert,Z.Chen,T.Rabl,andV.Markl,“Grizzly:
internet of vehicles environment: motivations, Efficientstreamprocessingthroughadaptivequery
architecture, challenges, andcriticalissues,” IEEE compilation,”inSIGMOD,2020,pp.2487–2503.
Access,2018.
77

OpenJournalofInternetofThings(OJIOT),Volume6,Issue1,2020
[35] Y. He, S. Barman, D. Wang, and J. F. Naughton, Aref, “Adaptive processing of spatial-keyword
“Onthecomplexityofprivacy-preservingcomplex data over a distributed streaming cluster,” in
eventprocessing,”inPODS,2011,pp.165–174. SIGSPATIAL,2018,pp.219–228.
[36] M.Hung,“Leadingtheiot,gartnerinsightsonhow [50] J. Meehan, C. Aslantas, S. Zdonik, N. Tatbul, and
| to  | lead in | a connected | world,” | Gartner |     | Research, |     |     |     |     |     |     |     |
| --- | ------- | ----------- | ------- | ------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
J.Du,“Dataingestionfortheconnectedworld.”in
| 2017. |     |     |     |     |     |     | CIDR,2017. |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- |
[37] J.-H. Hwang, M. Balazinska, A. Rasin, [51] J. Meehan, N. Tatbul, S. Zdonik, C. Aslantas,
| U.  | Cetintemel, | M.  | Stonebraker, |     | and S. | Zdonik, |     |             |     |     |            |     |            |
| --- | ----------- | --- | ------------ | --- | ------ | ------- | --- | ----------- | --- | --- | ---------- | --- | ---------- |
|     |             |     |              |     |        |         | U.  | Cetintemel, | J.  | Du, | T. Kraska, |     | S. Madden, |
“High-availability algorithms for distributed D.Maier,andA.Pavlo,“S-store: streamingmeets
streamprocessing,”inICDE,2005,pp.779–790. transaction processing,” PVLDB, pp. 2134–2145,
| [38] A.Iyer,L.E.Li,andI.Stoica,“Celliq: |     |     |     |     |     | Real-time | 2015. |     |     |     |     |     |     |
| --------------------------------------- | --- | --- | --- | --- | --- | --------- | ----- | --- | --- | --- | --- | --- | --- |
cellularnetworkanalyticsatscale,”inNSDI,2015.
|         |         |        |         |             |     |             | [52] H. Miao, |     | H. Park, | M. Jeon, | G.          | Pekhimenko, | K. S.  |
| ------- | ------- | ------ | ------- | ----------- | --- | ----------- | ------------- | --- | -------- | -------- | ----------- | ----------- | ------ |
|         |         |        |         |             |     |             | McKinley,     |     | and F.   | X. Lin,  | “Streambox: |             | Modern |
| [39] A. | P. Iyer | and I. | Stoica, | “A scalable |     | distributed |               |     |          |          |             |             |        |
spatial index for the internet-of-things,” in SoCC, stream processing on a multicore machine,” in
| 2017. |     |     |     |     |     |     | ATC,2017,pp.617–629. |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- | --- | --- | --- |
[40] G.Jia,G.Han,A.Li,andJ.Du,“Ssl: Smartstreet [53] MLflow,“Anopensourceplatformforthemachine
lamp based on fog computing for smarter cities,” learning lifecycle,” 2020. [Online]. Available:
| IEEETII,2018. |     |     |     |     |     |     | https://mlflow.org/ |     |     |     |     |     |     |
| ------------- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- |
[41] Y. Kang, J. Hauswald, C. Gao, A. Rovinski, [54] M. Naehrig, K. Lauter, and V. Vaikuntanathan,
T. Mudge, J. Mars, and L. Tang, “Neurosurgeon: “Can homomorphic encryption be practical?” in
| Collaborative |     | intelligence |     | between | the | cloud and | CCSW,2011. |     |     |     |     |     |     |
| ------------- | --- | ------------ | --- | ------- | --- | --------- | ---------- | --- | --- | --- | --- | --- | --- |
mobileedge,”ASPLOS,pp.615–629,2017.
|     |     |     |     |     |     |     | [55] M. | Nikolic, | B. Chandramouli, |     |     | and J. | Goldstein, |
| --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ---------------- | --- | --- | ------ | ---------- |
[42] J.Karimov, T.Rabl, andV.Markl, “Astream: Ad- “Enablingsignalprocessingoverdatastreams,” in
| hocsharedstreamprocessing,”inSIGMOD,2019, |     |     |     |     |     |     | SIGMOD,2017. |     |     |     |     |     |     |
| ----------------------------------------- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- |
pp.607–622.
|         |                   |     |     |             |     |     | [56] D. | O’Keeffe, | T.  | Salonidis, |     | and | P. Pietzuch, |
| ------- | ----------------- | --- | --- | ----------- | --- | --- | ------- | --------- | --- | ---------- | --- | --- | ------------ |
| [43] N. | R. Katsipoulakis, |     | A.  | Labrinidis, | and | P.  | K.      |           |     |            |     |     |              |
“Frontier:Resilientedgeprocessingfortheinternet
Chrysanthis,“Aholisticviewofstreampartitioning ofthings,”PVLDB,2018.
costs,”PVLDB,pp.1286–1297,2017.
|         |       |          |     |         |     |           | [57] H.Park,S.Zhai,L.Lu,andF.X.Lin,“Streambox- |        |        |           |     |        |           |
| ------- | ----- | -------- | --- | ------- | --- | --------- | ---------------------------------------------- | ------ | ------ | --------- | --- | ------ | --------- |
| [44] A. | Kipf, | H. Lang, | V.  | Pandey, | R.  | A. Persa, |                                                |        |        |           |     |        |           |
|         |       |          |     |         |     |           | tz:                                            | secure | stream | analytics |     | at the | edge with |
C.Anneser,E.TziritaZacharatou,H.Doraiswamy, trustzone,”inATC,2019.
| P.        | A. Boncz, | T.          | Neumann, | and      | A.  | Kemper,   |         |          |               |     |           |     |            |
| --------- | --------- | ----------- | -------- | -------- | --- | --------- | ------- | -------- | ------------- | --- | --------- | --- | ---------- |
|           |           |             |          |          |     |           | [58] R. | A. Popa, | C.            | M.  | Redfield, | N.  | Zeldovich, |
| “Adaptive |           | main-memory |          | indexing |     | for high- |         |          |               |     |           |     |            |
|           |           |             |          |          |     |           | and     | H.       | Balakrishnan, |     | “Cryptdb: |     | protecting |
performancepoint-polygonjoins.”inEDBT/ICDT,
|     |     |     |     |     |     |     | confidentiality |     | with | encrypted |     | query | processing,” |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ---- | --------- | --- | ----- | ------------ |
2020,pp.347–358.
inSOSP,2011,pp.85–100.
| [45] I.      | Kolchinsky | and        | A.  | Schuster, | “Join   | query |         |          |           |              |     |             |            |
| ------------ | ---------- | ---------- | --- | --------- | ------- | ----- | ------- | -------- | --------- | ------------ | --- | ----------- | ---------- |
|              |            |            |     |           |         |       | [59] D. | Reinsel, | J. Gantz, |              | and | J. Rydning, | “Data      |
| optimization |            | techniques |     | for       | complex | event |         |          |           |              |     |             |            |
|              |            |            |     |           |         |       | age     | 2025:    | The       | digitization |     | of the      | world from |
processingapplications,”PVLDB,2018.
|         |           |            |     |        |                 |     | edge  | to   | core,”                             | 2018, | accessed | December | 15, |
| ------- | --------- | ---------- | --- | ------ | --------------- | --- | ----- | ---- | ---------------------------------- | ----- | -------- | -------- | --- |
| [46] S. | Kulkarni, | N. Bhagat, |     | M. Fu, | V. Kedigehalli, |     |       |      |                                    |       |          |          |     |
|         |           |            |     |        |                 |     | 2019, | from | https://www.seagate.com/files/www- |       |          |          |     |
C. Kellogg, S. Mittal, J. M. Patel, K. Ramasamy, content/our-story/trends/files/idc-seagate-dataage-
| and | S. Taneja, | “Twitter | heron: | Stream |     | processing | whitepaper.pdf. |     |     |     |     |     |     |
| --- | ---------- | -------- | ------ | ------ | --- | ---------- | --------------- | --- | --- | --- | --- | --- | --- |
atscale,”inSIGMOD,2015,pp.239–250.
|         |      |            |       |           |     |            | [60] N. | P. Schultz-Møller, |     |     | M.  | Migliavacca, | and |
| ------- | ---- | ---------- | ----- | --------- | --- | ---------- | ------- | ------------------ | --- | --- | --- | ------------ | --- |
| [47] M. | Liu, | “Modeldb,” | 2020. | [Online]. |     | Available: |         |                    |     |     |     |              |     |
P.Pietzuch,“Distributedcomplexeventprocessing
https://github.com/VertaAI/modeldb withqueryrewriting,”inDEBS,2009,pp.1–12.
| [48] S. | R. Madden, | M.       | J. Franklin, | J.               | M. Hellerstein, |       |            |          |                     |     |        |            |            |
| ------- | ---------- | -------- | ------------ | ---------------- | --------------- | ----- | ---------- | -------- | ------------------- | --- | ------ | ---------- | ---------- |
|         |            |          |              |                  |                 |       | [61] C.    | Segarra, | R. Delgado-Gonzalo, |     |        | M.         | Lemay, P.- |
| and     | W. Hong,   | “Tinydb: |              | an acquisitional |                 | query |            |          |                     |     |        |            |            |
|         |            |          |              |                  |                 |       | L. Aublin, |          | P. Pietzuch,        |     | and V. | Schiavoni, | “Using     |
processingsystemforsensornetworks,”TODS,pp. trusted execution environments for secure stream
122–173,2005.
|     |     |     |     |     |     |     | processing |     | of medical | data | - (case | study | paper),” |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ---------- | ---- | ------- | ----- | -------- |
[49] A. R. Mahmood, A. Daghistani, A. M. Aly, inDisCoTec,2019.
| M.  | Tang, | S. Basalamah, | S.  | Prabhakar, |     | and W. | G.  |     |     |     |     |     |     |
| --- | ----- | ------------- | --- | ---------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
78

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
[62] Z. Shen, V. Kumaran, M. J. Franklin, [74] Y.YaoandJ.Gehrke,“Thecougarapproachtoin-
S. Krishnamurthy, A. Bhat, M. Kumar, R. Lerche, network query processing in sensor networks,” in
| and | K. Macpherson, | “Csa: | Streaming |     | engine for | SIGMOD,2002. |     |     |     |     |     |     |
| --- | -------------- | ----- | --------- | --- | ---------- | ------------ | --- | --- | --- | --- | --- | --- |
internetofthings.”inIEEE,2015,pp.39–50.
|              |         |           |     |         |        | [75] S.Yi,C.Li,andQ.Li,“Asurveyoffogcomputing: |     |     |     |     |     |     |
| ------------ | ------- | --------- | --- | ------- | ------ | ---------------------------------------------- | --- | --- | --- | --- | --- | --- |
| [63] W. Shi, | J. Cao, | Q. Zhang, | Y.  | Li, and | L. Xu, |                                                |     |     |     |     |     |     |
Concepts,applicationsandissues,”inMBD,2015.
| “Edge | computing: | Vision | and challenges,” |     | IEEE |                                       |     |     |     |     |          |     |
| ----- | ---------- | ------ | ---------------- | --- | ---- | ------------------------------------- | --- | --- | --- | --- | -------- | --- |
|       |            |        |                  |     |      | [76] J.Yu,J.Wu,andM.Sarwat,“Geospark: |     |     |     |     | Acluster |     |
IoTJournal,2016.
|     |     |     |     |     |     | computing |     | framework | for | processing | large-scale |     |
| --- | --- | --- | --- | --- | --- | --------- | --- | --------- | --- | ---------- | ----------- | --- |
[64] ShotSpotter, https://www.shotspotter.com/, spatialdata,”inSIGSPATIAL,2015.
accessed25thMarch2020.
|     |     |     |     |     |     | [77] M.Zaharia,T.Das,H.Li,S.Shenker,andI.Stoica, |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- |
[65] D. Sidlauskas, S. Chester, E. Tzirita Zacharatou, “Discretizedstreams:anefficientandfault-tolerant
| and        | A. Ailamaki, |          | “Improving | spatial | data     |       |            |            |     |          |            |     |
| ---------- | ------------ | -------- | ---------- | ------- | -------- | ----- | ---------- | ---------- | --- | -------- | ---------- | --- |
|            |              |          |            |         |          | model | for stream | processing |     | on large | clusters,” | in  |
| processing | by           | clipping | minimum    |         | bounding |       |            |            |     |          |            |     |
HotCloud,2012.
boxes,”inICDE,2018,pp.425–436.
|     |     |     |     |     |     | [78] S.Zeuch,A.Chaudhary,B.Monte,H.Gavriilidis, |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ----------------------------------------------- | --- | --- | --- | --- | --- | --- |
[66] L.Sweeney,“K-anonymity:Amodelforprotecting D. Giouroukis, P. Grulich, S. Breß, J. Traub, and
privacy,”IJUFKS,2002.
|     |     |     |     |     |     | V. Markl, | “The | nebulastream |     | platform: | Data | and |
| --- | --- | --- | --- | --- | --- | --------- | ---- | ------------ | --- | --------- | ---- | --- |
[67] M. Tang, Y. Yu, Q. M. Malluhi, M. Ouzzani, and applicationmanagementfortheinternetofthings,”
inCIDR,2020.
| W. G.  | Aref, | “Locationspark: |        | A distributed | in-         |                |     |       |        |             |     |       |
| ------ | ----- | --------------- | ------ | ------------- | ----------- | -------------- | --- | ----- | ------ | ----------- | --- | ----- |
| memory | data  | management      | system | for           | big spatial |                |     |       |        |             |     |       |
|        |       |                 |        |               |             | [79] S. Zeuch, |     | B. D. | Monte, | J. Karimov, | C.  | Lutz, |
data,”PVLDB,pp.1565–1568,2016.
M.Renz,J.Traub,S.Breß,T.Rabl,andV.Markl,
[68] A.Toshniwal,S.Taneja,andA.Shukla,“Storm@ “Analyzing efficient stream processing on modern
| twitter,”inSIGMOD,2014. |     |     |     |     |     | hardware,”PVLDB,2019. |     |     |     |     |     |     |
| ----------------------- | --- | --- | --- | --- | --- | --------------------- | --- | --- | --- | --- | --- | --- |
[69] E. Tzirita Zacharatou, H. Doraiswamy, and [80] H. Zhang, Y. Diao, and N. Immerman, “On
et al., “GPU Rasterization for Real-Time Spatial complexity and optimization of expensive queries
Aggregation over Arbitrary Polygons,” PVLDB, incomplexeventprocessing,”inSIGMOD,2014.
2017.
|     |     |     |     |     |     | [81] S. Zhang, | J.  | He, and | A.  | C. Zhou, | “Briskstream: |     |
| --- | --- | --- | --- | --- | --- | -------------- | --- | ------- | --- | -------- | ------------- | --- |
[70] M. Vuppalapati, J. Miron, and R. Agarwal, Scalingdatastreamprocessingonshared-memory
“Buildinganelasticqueryengineondisaggregated
multicorearchitectures,”inSIGMOD,2019.
storage,”inNSDI,2020.
|     |     |     |     |     |     | [82] S. Zhang, | H.  | T. Vo, | and | D. Dahlmeier, |     | “Multi- |
| --- | --- | --- | --- | --- | --- | -------------- | --- | ------ | --- | ------------- | --- | ------- |
[71] D.Wang,E.A.Rundensteiner,andR.T.EllisonIII, queryoptimizationforcomplexeventprocessingin
| “Active | complex | event | processing |     | over event |     |     |     |     |     |     |     |
| ------- | ------- | ----- | ---------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
sapesp,”inICDE,2017.
streams,”PVLDB,pp.634–645,2011.
|     |     |     |     |     |     | [83] S. Zhang, | Y.  | Wu, F. | Zhang, | and B. | He, “Towards |     |
| --- | --- | --- | --- | --- | --- | -------------- | --- | ------ | ------ | ------ | ------------ | --- |
[72] D.Xie,F.Li,B.Yao,G.Li,L.Zhou,andM.Guo, concurrentstatefulstreamprocessingonmulticore
| “Simba: | Efficient | in-memory | spatial | analytics,” |     | in  |     |     |     |     |     |     |
| ------- | --------- | --------- | ------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
processors,”inICDE,2020,pp.1537–1548.
| Proceedings | of  | the 2016 | International |     | Conference |               |     |       |       |                  |     |       |
| ----------- | --- | -------- | ------------- | --- | ---------- | ------------- | --- | ----- | ----- | ---------------- | --- | ----- |
|             |     |          |               |     |            | [84] B. Zhao, | N.  | Q. V. | Hung, | and M. Weidlich, |     | “Load |
onManagementofData,2016,pp.1071–1085.
|     |     |     |     |     |     | shedding | for | complex | event | processing: |     | Input- |
| --- | --- | --- | --- | --- | --- | -------- | --- | ------- | ----- | ----------- | --- | ------ |
[73] W.Yao,C.H.Chu,andZ.Li,“Leveragingcomplex
basedandstate-basedtechniques,”inICDE,2020.
| event | processing | for smart | hospitals | using | rfid,” |     |     |     |     |     |     |     |
| ----- | ---------- | --------- | --------- | ----- | ------ | --- | --- | --- | --- | --- | --- | --- |
JNCA,2011.
79

OpenJournalofInternetofThings(OJIOT),Volume6,Issue1,2020
| AUTHOR        | BIOGRAPHIES |                     |              |             |             |            |                  | Xenofon           |             | Chatziliadis  |             |
| ------------- | ----------- | ------------------- | ------------ | ----------- | ----------- | ---------- | ---------------- | ----------------- | ----------- | ------------- | ----------- |
|               |             |                     |              |             |             |            |                  | is a              | Ph.D.       | candidate     | at          |
|               |             | Steffen             |              | Zeuch       | is          | a Senior   |                  | DIMA              | group       | (TU           | Berlin).    |
|               |             | Researcher          |              | at          | the         | DIMA       |                  |                   |             |               |             |
|               |             |                     |              |             |             |            |                  | Xenofons’s        | research    |               | interests   |
|               |             | group               | (TU          | Berlin)     |             | and IAM    |                  | include           | distributed |               | systems,    |
|               |             | group               | (DFKI).      |             | He received | his        |                  |                   |             |               |             |
|               |             |                     |              |             |             |            |                  | performance       |             | monitoring,   | and         |
|               |             | Ph.D.               | in           | Computer    |             | Science    | at               |                   |             |               |             |
|               |             |                     |              |             |             |            |                  | IoT environments. |             | He            | received    |
|               |             | Humboldt            |              | University  |             | Berlin     |                  | his M.Sc.         | in Computer |               | Science     |
|               |             | in                  | the research |             | group       | of Prof.   |                  |                   |             |               |             |
|               |             |                     |              |             |             |            |                  | at TU             | Berlin      | with a        | focus on    |
|               |             | Freytag.            |              | Steffen     | is          | conducting | machinelearning. |                   |             |               |             |
|               |             | research            |              | in data     | management, |            |                  |                   |             |               |             |
|               |             | with                | an           | emphasis    |             | on topics  |                  | Ankit Chaudhary   |             | is            | a Ph.D.     |
|               |             |                     |              |             |             |            |                  | candidate         | at          | DIMA          | group       |
|               |             | related             |              | to modern   |             | hardware,  |                  |                   |             |               |             |
|               |             | distributed         |              | systems,    |             | and IoT    |                  | (TU Berlin).      |             | Ankit’s       | research    |
|               |             |                     |              |             |             |            |                  | interests         | include     |               | distributed |
| environments. |             | Currently,          | he is        | the project | lead        | of the     |                  |                   |             |               |             |
|               |             |                     |              |             |             |            |                  | systems,          | query       | optimization, |             |
| NebulaStream  |             | (www.nebula.stream) |              | project     |             | at DIMA,   |                  |                   |             |               |             |
which builds a new data management for the Internet and IoT environments. He
|            |     |               |          |     |        |          |     | did his | M.Sc. |     | from TU |
| ---------- | --- | ------------- | -------- | --- | ------ | -------- | --- | ------- | ----- | --- | ------- |
| of Things. | He  | has published | research |     | papers | on query |     |         |       |     |         |
optimization and execution as well as on novel system Kaiserslautern with focus on
|     |     |     |     |     |     |     |     | distributed | systems | and | B.Tech. |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ------- | --- | ------- |
architecturesinmanytop-tierconferences.
ininformationandtechnologyfromGGSIPUDelhi.
|     |     | Eleni    | Tzirita    |           | Zacharatou | is       | a   |                           |           |               |         |
| --- | --- | -------- | ---------- | --------- | ---------- | -------- | --- | ------------------------- | --------- | ------------- | ------- |
|     |     |          |            |           |            |          |     | Bonaventura               |           | Del Monte     | is a    |
|     |     | Senior   | Researcher |           | at         | the DIMA |     |                           |           |               |         |
|     |     | group    | (TU        | Berlin).  | Her        | current  |     | Ph.D.candidateatDIMAgroup |           |               |         |
|     |     | research |            | interests | are        | centered |     | (TU Berlin).              |           | Bonaventura’s |         |
|     |     |          |            |           |            |          |     | research                  | interests |               | include |
aroundrobuststreamprocessing
|     |     | in  | mobile | IoT | environments. |     |     | efficient | query     | execution | on       |
| --- | --- | --- | ------ | --- | ------------- | --- | --- | --------- | --------- | --------- | -------- |
|     |     |     |        |     |               |     |     | modern    | hardware, |           | stateful |
ElenireceivedherPhDfromthe
|             |          | E´cole       | Polytechnique |                 |            | Fe´de´rale |                                 | stream    | processing, |     | and data-  |
| ----------- | -------- | ------------ | ------------- | --------------- | ---------- | ---------- | ------------------------------- | --------- | ----------- | --- | ---------- |
|             |          | de           | Lausanne      |                 | (EPFL)     | in 2019,   |                                 | intensive | distributed |     | systems.   |
|             |          |              |               |                 |            |            |                                 | He got    | his M.Sc.   | in  | Computer   |
|             |          | where        | she           | worked          | in         | the DIAS   |                                 |           |             |     |            |
|             |          | lab          | on            | spatio-temporal |            | query      | SciencefromUniversityofSalerno. |           |             |     |            |
|             |          | processing   |               | algorithms      |            | and        |                                 |           |             |     |            |
|             |          |              |               |                 |            |            |                                 | Dimitrios | Giouroukis  |     | is a       |
| indexing    | methods  | for data     | exploration.  |                 | She        | holds      | a                               |           |             |     |            |
|             |          |              |               |                 |            |            |                                 | Ph.D.     | candidate   | at  | DIMA       |
| Diploma     | - M.Eng. | degree       | in Electrical |                 | and        | Computer   |                                 |           |             |     |            |
|             |          |              |               |                 |            |            |                                 | group (TU | Berlin).    |     | Dimitrios’ |
| Engineering | from     | the National |               | Technical       | University |            | of                              |           |             |     |            |
researchinterestsincludesensor
Athens. Eleniisarecipientofthe2018ACMSIGMOD
|                         |     |                |     |           |        |           |               | data           | management, |             | stream     |
| ----------------------- | --- | -------------- | --- | --------- | ------ | --------- | ------------- | -------------- | ----------- | ----------- | ---------- |
| bestdemonstrationaward. |     |                |     |           |        |           |               | processing,    |             | and         | post-cloud |
|                         |     | Shuhao         |     | Zhang     | is     | a Senior  |               | distributed    | systems.    |             | He got     |
|                         |     | Researcher     |     | at        | the    | DIMA      |               | his M.Sc.      | in Computer |             | Science    |
|                         |     | group          | (TU | Berlin).  |        | Shuhao’s  |               | from Aristotle |             | University  | of         |
|                         |     | research       |     | interests |        | include   | Thessaloniki. |                |             |             |            |
|                         |     | modern         |     | hardware  | and    | stream    |               | Philipp        | M. Grulich  |             | is a Ph.D. |
|                         |     | processing.    |     | He        | has    | published |               |                |             |             |            |
|                         |     |                |     |           |        |           |               | candidate      | at DIMA     | group       | (TU        |
|                         |     | research       |     | papers    | on     | stream    |               |                |             |             |            |
|                         |     |                |     |           |        |           |               | Berlin).       | Philipp’s   |             | research   |
|                         |     | processing     |     | system    | design | and       |               |                |             |             |            |
|                         |     |                |     |           |        |           |               | interests      | include     |             | modern     |
|                         |     | optimization   |     | on        | novel  | hardware  |               |                |             |             |            |
|                         |     |                |     |           |        |           |               | hardware,      | stream      | processing, |            |
|                         |     | architectures. |     |           | He did | his Ph.D. |               |                |             |             |            |
|                         |     |                |     |           |        |           |               | and compiler   |             | theory.     | He         |
inComputerScienceatNational
|     |     |     |     |     |     |     |     | received | his M.Sc. | in  | Computer |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | --------- | --- | -------- |
UniversityofSingapore.
|     |     |     |     |     |     |     |     | Science | at TU | Berlin | with a |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ----- | ------ | ------ |
focusonquerycompilation.
80

S.Zeuch,etal.:NebulaStream:ComplexAnalyticsBeyondtheCloud
Ariane Ziehn is a Ph.D.
candidate at the IAM
group (DFKI). Ariane’s
research interests include
distributed systems, complex
event processing, and IoT
environments. She received her
M.Sc. in Information Systems
Management at TU Berlin with
a focus on distributed systems as well as data and
softwareengineering.
Volker Markl is a Full
Professor and Chair of
the Database Systems and
Information Management
(DIMA) Group at the
Technische Universita¨t Berlin
(TU Berlin). At the German
Research Center for Artificial Intelligence (DFKI), he
is Chief Scientist and Head of the Intelligent Analytics
for Massive Data Research Group. In addition, he is
Director of the Berlin Institute for the Foundations of
LearnigandData(BIFOLD),amergeroftheBerlinBig
DataCenter(BBDC)andtheBerlinCenterforMachine
Learning (BZML). Volker Markl is a computer science
graduate from Technische Universita¨t Mu¨nchen, where
heearnedhisDiplomin1995withathesisonexception
handling in programming languages. He earned his
PhD in 1999 the area of multidimensional indexing
under the supervision of Rudolf Bayer. Volker Markl
has published numerous research papers on indexing,
queryoptimization,lightweightinformationintegration,
and scalable data processing. He holds 18 patents,
has transferred technology into several commercial
products,andadvisesseveralcompaniesandstartups.
81