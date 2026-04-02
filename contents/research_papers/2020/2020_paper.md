(cid:13)c 20XXbytheauthors;licenseeRonPub,Lu¨beck,Germany.Thisarticleisanopenaccessarticledistributedunderthetermsandconditionsofthe
CreativeCommonsAttributionlicense(http://creativecommons.org/licenses/by/4.0/).
OpenAccess
Open Journal of XXX (OJXX)
Volume X, Issue X, 20XX
http://www.ronpub.com/ojxx
ISSNXXXX-XXXX
NebulaStream: Complex Analytics
Beyond the Cloud
SteffenZeuch12,EleniTziritaZacharatou1,ShuhaoZhang1,XenofonChatziliadis1,AnkitChaudhary1,
BonaventuraDelMonte1,DimitriosGiouroukis1,PhilippM.Grulich1,ArianeZiehn1,VolkerMark12
1TechnischeUniversita¨tBerlin{firstname.lastname}@tu-berlin.de
2DFKIGmbH{firstname.lastname}@dfki.de
ABSTRACT
ThearisingInternetofThings(IoT)willrequiresignificantchangestocurrentstreamprocessingengines(SPEs)toenable
large-scaleIoTapplications.Inthispaper,wepresentchallengesandopportunitiesforanIoTdatamanagementsystemto
enablecomplexanalyticsbeyondthecloud.AsoneofthemostimportantupcomingIoTapplications,wefocusonthevision
ofasmartcity.ThegoalofthispaperistobridgethegapbetweentherequirementsofupcomingIoTapplicationsandthe
supportedfeaturesofanIoTdatamanagementsystem.Tothisend,weoutlinehowstate-of-the-artSPEshavetochangeto
exploitthenewcapabilitiesoftheIoTandshowcasehowwetackleIoTchallengesinourownsystem,NebulaStream.This
paperlaysthefoundationforanewtypeofsystemsthatleveragestheIoTtoenablelarge-scaleapplicationsovermillionsof
IoTdevicesinhighlydynamicandgeo-distributedenvironments.
TYPEOFPAPERANDKEYWORDS
Visionarypaper:IoT,Application,Systems
1 INTRODUCTION
The volume, velocity, and variety of data that need to be
processed in real-time have reached unseen magnitudes
overthelastdecades. Thistrendfueledtheemergenceof
thefirststreamprocessingengines(SPEs),suchasAurora,
STREAM,TelegraphCQ,andNiagaraCQ,whichprocess
queries over incoming data streams continuously [18].
However,theever-increasinginputratesincombinationwith
thedemandsonlow-latencyandhigh-throughputcomputing
ledtoanewclassofSPEs,calledLarge-ScaleDataStream
Figure1:ComplexAnalyticsinNES.
Processing Systems [18]. Systems such as Flink, Spark
Streaming,orStormarerepresentativesofthisclass.These
systems scale-out the processing of high-velocity data
streams in a cluster of commodity hardware. Although datafromexternalsourcesintothecloudinducesamajor
thesesystemsenablelargescaleexecutiononhundredsor bottleneckthatlimitsthescalability. Furthermore,sending
thousandsofservers,theyaremosteffectivewhendataare computationresultsbacktodevicesoutsidethecloudfurther
generatedandusedwithinthecloud.However,transferring exacerbatesthisbottleneck.
1

OpenJournalofXXX(OJXX),VolumeX,IssueX,20XX
The arising Internet of Things (IoT) represents a new on a variety of heterogeneous and diverse devices, e.g.,
environmentthatchallengestheabovescalabilitybottleneck sensors, low-end devices (e.g., Raspberry Pi), network
asdataaremainlygeneratedoutsidethecloudandresults devices(e.g.,smartrouters),cloudlets,orcloudnodes.With
mustbesentbacktocloud-externaldevices. Inparticular, thiscomponentstack,themaingoalofNebulaStreamisto
theIoTaddsfurtherpressureoncurrentSPEarchitecturesas enabletheemergingIoTapplicationsofthefuture.
estimationspredictthatby2025theglobalamountofdata In this paper, we bring together the requirements of
willreach175ZBand30%ofthesedatawillbegathered upcoming IoT applications and the supported features of
in real-time [59] by as many as 20 billion connected anIoTdatamanagementsystem. WhiledevelopingNES,
devices [38]. As a result, the majority of these data will weconstantlyreviewstate-of-the-artapproachestoidentify
be generated and used by devices in highly-distributed, which concepts and algorithms can be adopted and for
potentially geo-distributed, environments. However, whichproblemswerequirenovelsolutions.AsourmainIoT
state-of-the-art cloud-based SPEs are not built for such application,wetargetasmartcity,wheremillionsofsensors
anenvironmentandrequiredatatobetransferredintothe aredistributedacrossthecitytogatherinformationabout
cloudtoextractvaluefromthem. Incontrast,anIoTdata traffic,airandwaterquality,crowdedness,andmanymore.
managementsystemwillenabledataprocessingalongthe Inthefollowingpaper,wefirstdescribecorefeaturesthatare
path from data sources to the cloud, using the increasing necessarytoenablethenextgenerationofIoTapplications
capabilitiesofcloud-externaldevices. forsmartcitiesbutarenotyetsupportedbystate-of-the-art
Overthelastdecades,manyresearchcommunitiescover systems,i.e.,adaptivesensorhandling(Sec.2.1),massive
specificpartsoftheoverallIoTvision.First,MobileCloud scalability(Sec.2.2),heterogeneityofworkloadsanddevices
Computing(MCC)outsourcesdatastorageandprocessing (Sec.2.3),anddeliveryguarantees(Sec.2.4).Afterthat,we
from devices to the cloud [10]. Second, Mobile-Edge investigatetwonewfeaturesthatwillenablenewclassesof
Computing(MEC)extendsIoTservicesthroughhubdevices applicationswithinasmartcitybutarecurrentlyneitherpart
at the edge of the topology, which act as local control ofcommonSPEsnorIoTdatamanagementsystems,i.e.,
centers [62]. Third, Fog-aware IoT data processing uses secure-privacy-aware(Sec.2.5)andtransactionprocessing
theFog, acollectivetermforresourcesoutsidethecloud, (Sec.2.6).Finally,weinvestigatedomain-specificfeatures
as an extension of cloud [6, 63, 74, 13]. Finally, Sensor thatcansupportvariousapplicationscenarioswithinasmart
networks (SNs), in particular Wireless Sensor Networks city, i.e., support for signal processing (Sec. 3.1), spatial
(WSN)targetdistributedprocessinginawirelessnetwork analytics (Sec. 3.2), complex event processing (Sec. 3.3),
of sensors as a particular sub-area of the IoT [49]. With andmachinelearning(Sec.3.4).Forallpresentedfeatures,
NebulaStream (NES), we are currently building a data we outline the challenges and requirements, discuss the
managementsystemforupcomingIoTenvironmentsthat state-of-the art, show their limitations, and highlight how
combines approaches from these research communities toefficientlyusetheminIoTinfrastructures. Overall,this
as well as the broad literature of cloud-based SPEs and paper lays the foundation for a new type of SPEs that
introducesnovelsolutions[77].Inourvision,NESpioneers leveragestheIoTtoenablenewpossibilitiesforapplication
anewclassofsystems,thatcopeswithheterogeneityand scenariossuchassmartcities.
distributionofcomputeanddata,supportsdiversedataand
programmingmodelsgoingbeyondrelationalalgebra,deals
with potentially unreliable communication, and enables
2 COREFEATURES
constantevolutionundercontinuousoperation.
Inthissection,wedescribecorefeaturesthatarerequired
InFigure1,weoutlinethecomponentstackofNES.NES
toenablethenextgenerationofIoTapplicationsbutarenot
willsupportvariousalgorithmsfromdifferentapplication
yetsupportedbystate-of-the-artsystems.
domains with different requirements and expressiveness.
These algorithms are implemented on top of a common
intermediaterepresentation,whichexpressesthecommon 2.1 AdaptiveHandlingofSensorDataStreams
set of functionality offered by NES. The NES Engine
takes the queries expressed in the intermediate format as SensordatainIoTenvironmentshaveafluctuatingnature,
input and orchestrates their processing. To this end, the whichposesachallengeforresource-constraineddevicesthat
NES Engine consists of 1) a query compiler to generate cannoteasilycopewiththevelocityandvolumeofincoming
executablecode, 2)asensormanagertointeractwiththe data. Overwhelmed devices incur back-pressure, which
attached sensors, 3) a distributed dataflow engine that further results in data losses and high query latency. To
efficientlyexecuteslong-runningstatefulqueries,4)asecure addressthischallengeandavoidperformancedeterioration,
processing engine that ensures privacy-aware and secure anIoTsystemneedstoadaptthenumberofsensorreadsto
processing,and5)atransactionalenginethatorchestrates theobservedphenomenonandmaximizesharingofsensor
consistenttransactionalprocessing. TheNESEngineruns results,therebyavoidingresourceoveruse.
2

S.Zeuch,E.TziritaZacharatou,S.Zhang,X.Chatziliadis,A.Chaudary,B.DelMonte,P.M.Grulich,D.Giouroukis,A.Ziehn,V.Markl:
NebulaStream:ComplexAnalyticsBeyondtheCloud
| 2.1.1 State-of-the-ArtSystems |     |         |       |             | 2.2 MassiveScalability |                 |     |        |              |     |          |
| ----------------------------- | --- | ------- | ----- | ----------- | ---------------------- | --------------- | --- | ------ | ------------ | --- | -------- |
|                               |     |         |       |             | An IoT                 | data management |     | system | continuously |     | receives |
| Current state-of-the-art      |     | systems | focus | on handling |                        |                 |     |        |              |     |          |
processingattheedgeandunderahomogeneoushardware variousmachine-generatedoruser-submittedlong-running
|     |     |     |     |     | and ad-hoc | queries. | To  | be effective, | it  | needs | to provide |
| --- | --- | --- | --- | --- | ---------- | -------- | --- | ------------- | --- | ----- | ---------- |
assumption[56],i.e.,homogeneousnetworkingequipment
|                   |                                   |     |     |     | support | for millions |     | of concurrent | queries |     | [69]. In |
| ----------------- | --------------------------------- | --- | --- | --- | ------- | ------------ | --- | ------------- | ------- | --- | -------- |
| orexecutionnodes. | Otherstate-of-the-artSPEsdealwith |     |     |     |         |              |     |               |         |     |          |
streamfluctuationbyemployinginputadmission[12],where addition,anIoTsystemneedstohandlemillionsofhighly
|                                        |     |     |     |           | heterogeneous |     | and distributed |     | data streams | that | can be |
| -------------------------------------- | --- | --- | --- | --------- | ------------- | --- | --------------- | --- | ------------ | ---- | ------ |
| systemskeepincheckincomingdatastreams, |     |     |     | butforego |               |     |                 |     |              |      |        |
anyoptimizationsatthesourcelevel. Finally,well-known achieved by routing the streams as efficiently as possible
throughthenetworkofprocessingnodes.
sensor-basedsystemsfocusondisseminatingasinglequery
overasensornetwork[49,73].
2.2.1 State-of-the-ArtSystems
|     |     |     |     |     | Several | approaches | for | processing | IoT | data exist | today. |
| --- | --- | --- | --- | --- | ------- | ---------- | --- | ---------- | --- | ---------- | ------ |
2.1.2 LimitationsofState-of-the-Art
|     |     |     |     |     | A cloud-based |     | system    | such as | Mobile Cloud | Computing |        |
| --- | --- | --- | --- | --- | ------------- | --- | --------- | ------- | ------------ | --------- | ------ |
|     |     |     |     |     | (MCC) relies  | on  | gathering | and     | sending      | the data  | from a |
IntheIoT,streamsareephemeralandstartfromthelevel
|     |     |     |     |     | pool of | sensors | to cloud | for storage | and | processing | [10]. |
| --- | --- | --- | --- | --- | ------- | ------- | -------- | ----------- | --- | ---------- | ----- |
ofsensors.Sensorsaredistributed,transient,pronetofailure,
CloudinfrastructuresmakeuseofcommonSPEs,suchas
resource-constrained,andofferadiversefeaturesetthatis
ApacheFlink[19],SparkStreaming[76],orStorm[67]for
heterogeneousamongnodes.Moreover,applicationsrequire
processingtheincomingdatastreams.
sensordataundermultipleassumptionsandconstraints,e.g.,
|     |     |     |     |     | Edge-aware |     | systems | such as | Mobile-Edge | Computing |     |
| --- | --- | --- | --- | --- | ---------- | --- | ------- | ------- | ----------- | --------- | --- |
outlierdetectionrequiresreal-timedatabutmonitoringtrends
(MEC)overcomethelimitationsofcloud-centricapproaches
overlargetime-seriesrequireslowsamplingandnofiltering.
byutilizinghubdevicestoextendtheirIoTservices[62,9].
Currentstate-of-the-artsystemseitherdealwithspecific
|             |                 |     |        |               | Hub devices | reside | at  | the edge | of the | fog topology | for |
| ----------- | --------------- | --- | ------ | ------------- | ----------- | ------ | --- | -------- | ------ | ------------ | --- |
| parts of an | IoT environment | or  | assume | the existence | of          |        |     |          |        |              |     |
gatheringdatafromattachedsensorsandperformingsimple
homogeneousresources.Atthesametime,systemsthatonly
processingsteps.
focusonsensorsdonottaketheincreasedcapabilitiesofthe
Fog-awaresystems,e.g.,Frontier[56]ortheextensionof
nodesthathostthesensors(sensornodes)intoaccountand Cisco’sConnectedStreamingAnalytics(CSA)[62]utilize
| cannotbeeasilyintegratedintoexistingSPEs. |     |     |     | Ingeneral, |     |     |     |     |     |     |     |
| ----------------------------------------- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
theprocessingcapabilityofthefogbydistributingqueries
| existing systems | do not | treat sensor | nodes | as a first-class |     |     |     |     |     |     |     |
| ---------------- | ------ | ------------ | ----- | ---------------- | --- | --- | --- | --- | --- | --- | --- |
overthetopology.
componentofanSPEand,thus,donotallowforapplications
tobenefitfromanyoptimizationsonthatparticularlevel.
2.2.2 LimitationsofState-of-the-Art
Supportingadaptiveoperationsatthesensornodelevel
allowsonetoscalethenumberofsensorswhilereducingthe
|     |     |     |     |     | Existing | approaches | for | processing | IoT | data have | several |
| --- | --- | --- | --- | --- | -------- | ---------- | --- | ---------- | --- | --------- | ------- |
volumeofnetworktrafficwithoutharmingtheprecisionof limitations. The cloud-based approach is limited by the
theresults.Thesystemwillbeabletodistinguishinteresting
|     |     |     |     |     | amountofdataitcanreceivefromIoTdevices. |     |     |     |     |     | Ahigher |
| --- | --- | --- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- | ------- |
eventswhileallowingonlytransmissionofimportantdata. numberofIoTdevicesresultsinahighervolumeofdata,
whichcanpotentiallycreateanetworkbottleneckandthus
|     |     |     |     |     | createdelaysintheprocessing. |     |     |     | Similarly, | anedge-aware |     |
| --- | --- | --- | --- | --- | ---------------------------- | --- | --- | --- | ---------- | ------------ | --- |
2.1.3 EnablingEmergingIoTApplications approachthatuseshubdeviceshasthelimitationinterms
ofperformingholisticdataprocessing.Also,thisapproach
IoT applications, such as real time monitoring of drone does not leverage the cloud resources for performing
|                   |           |           |      |                | additional | computations. |     | This | affects the | type | of queries |
| ----------------- | --------- | --------- | ---- | -------------- | ---------- | ------------- | --- | ---- | ----------- | ---- | ---------- |
| fleets or outlier | detection | of sensor | data | on a city-wide |            |               |     |      |             |      |            |
infrastructure,produceworkloadsoffluctuatingnature.This that are supported by the system. Additionally, the hub
causes local bottlenecks that need to be dealt as early as devicecontrolsthenumberofIoTdevicesthatitcansupport
possible, before they propagate downstream. With NES, and thus restricts the scalability. Fog-aware approaches
we envision a true end-to-end system, where fluctuation mentioned above have limitations in handling evolving
|                                   |     |     |                     |     | infrastructure. |     | This restricts | the | processing | of  | queries in |
| --------------------------------- | --- | --- | ------------------- | --- | --------------- | --- | -------------- | --- | ---------- | --- | ---------- |
| mitigationstartsatthesensornodes. |     |     | Byutilizingadaptive |     |                 |     |                |     |            |     |            |
samplingandadaptivefilteringofsensordataatthesource, a large dynamic environment where the IoT devices are
we keep in check the dynamicity of various workloads constantlyjoiningandleavingtheenvironment.
without altering the context of the data. Through these NES considers a unified fog and cloud environment
operators,weareabletoa)conserveenergyandb)reduce for processing IoT data. This enables NES to perform
unnecessarynetworkcommunicationwhilec)retaininga
|     |     |     |     |     | early computations |     | in  | fog and | any remaining |     | or holistic |
| --- | --- | --- | --- | --- | ------------------ | --- | --- | ------- | ------------- | --- | ----------- |
high-qualityrepresentationoftheoriginaldatastream. computations in the cloud. Additionally, the support for
3

OpenJournalofXXX(OJXX),VolumeX,IssueX,20XX
sustaining network or node failures and device mobility cansupportawiderangeofdiversedevicesand,atthesame
allowsNEStohandleevolvingtopology. time,exploitsspecifichardwarecharacteristics,ifavailable.
2.2.3 EnablingEmergingIoTApplications 2.3.2 LimitationsofState-of-the-Art
NESwillefficientlyprocesslargevolumesofdatacoming TheIoThasfundamentalchallengesthatmakecurrentdata
frommillionsofdevicesinadynamicenvironment. This processing solutions insufficient. First, devices are very
willenableNEStosupportanewgenerationofapplications diverse,whichrequiressystemsupportforawiderangeof
spanningovermillionsofgeo-distributeddevicesacrossa
|     |     |     |     |     |     | differenthardwarecharacteristics. |     | Second, | thedevicesin |     |
| --- | --- | --- | --- | --- | --- | --------------------------------- | --- | ------- | ------------ | --- |
smartcity,suchasconnectedcarsorsmartpublictransport theIoThavelimitedhardwareresourcesandenergybudgets,
systems.Furthermore,efficientqueryexecutionallowsfor whichmakeabstractions,e.g.,avirtualmachine,notfeasible.
handlingmassiveamountofqueriesgeneratedbyexternal
Tothisend,NESisheterogeneoushardware-consciousand
systemsorsubmittedbyusers. optimizesbothrequirementsinaholisticandgeneralway.
2.3 SupportforHeterogeneousDevices 2.3.3 EnablingEmergingIoTApplications
IoTenvironmentsconsistofawiderangeofdiversecompute Thesupportofdiversedevicesisacorerequirementofevery
| devices | (from small | sensors | to high-performance |     | data |                        |     |                            |     |     |
| ------- | ----------- | ------- | ------------------- | --- | ---- | ---------------------- | --- | -------------------------- | --- | --- |
|         |             |         |                     |     |      | SPEinanIoTenvironment. |     | Theefficientexploitationof |     |     |
centers). Sensorsthatgeneratethesourcedatastreamare
theindividualhardwareresourcesofsuchdevicesiscrucial
oftenbattery-poweredandhavetypicallylimitedcomputing forenablingarangeofnewinnovativeapplications.
| resources. | In contrast, | the cloud | has | nearly unlimited |     |             |            |             |      |              |
| ---------- | ------------ | --------- | --- | ---------------- | --- | ----------- | ---------- | ----------- | ---- | ------------ |
|            |              |           |     |                  |     | One example | of such an | application | is a | smart public |
compute and storage resources, while cloud nodes are transport monitoring system [33]. Such systems gather
| equipped     | with high-performance |           | multi-core | CPUs               | and |                     |               |             |           |            |
| ------------ | --------------------- | --------- | ---------- | ------------------ | --- | ------------------- | ------------- | ----------- | --------- | ---------- |
|              |                       |           |            |                    |     | data from different | sources       | and process | it across | diverse    |
| accelerators | like GPUs             | and TPUs. |            | The fog represents |     |                     |               |             |           |            |
|              |                       |           |            |                    |     | compute nodes.      | For instance, | vehicles    | collect   | the source |
a suitable middle-ground between the sensors and the data and use small battery-powered SoCs to perform
| cloud, since | it contains | more | capable | nodes than | sensors. |                |         |          |             |          |
| ------------ | ----------- | ---- | ------- | ---------- | -------- | -------------- | ------- | -------- | ----------- | -------- |
|              |             |      |         |            |          | preprocessing. | Using a | wireless | connection, | data are |
These nodes consist of embedded System-on-a-Chip transferredtointermediatebasestations,whichmayperform
Devices(SoCs),low-energyservers,orcontainspecialized
|     |     |     |     |     |     | furthercalculations. | Assoonasthedatareachthecloud, |     |     |     |
| --- | --- | --- | --- | --- | --- | -------------------- | ----------------------------- | --- | --- | --- |
acceleratorslikeembeddedGPUs(e.g.,NvidiaJetson)or
|     |     |     |     |     |     | theSPEcomputesafinalresult. |     | Theabovelayersconsist |     |     |
| --- | --- | --- | --- | --- | --- | --------------------------- | --- | --------------------- | --- | --- |
TPUs (e.g., Coral Edge TPU). As a result, an IoT data ofverydiversehardwareandhavedifferentrequirements.
| management | system | needs to | support | an unseen | variety |     |     |     |     |     |
| ---------- | ------ | -------- | ------- | --------- | ------- | --- | --- | --- | --- | --- |
NEStakesthisheterogeneityintoaccounttogeneratehighly
ofheterogeneousdevices,whichitmustefficientlyexploit. efficientcodetorunineachlayer.
Thisheterogeneityintroducesseveralchallenges,asdevices
| usedifferentdataformats(little-vs. |        |       | big-endian),different |     |           |                        |     |     |     |     |
| ---------------------------------- | ------ | ----- | --------------------- | --- | --------- | ---------------------- | --- | --- | --- | --- |
|                                    |        |       |                       |     |           | 2.4 Deliveryguarantees |     |     |     |     |
| programming                        | models | (CPUs | vs. GPUs),            | and | different |                        |     |     |     |     |
instructionsets(ARMvs.x64).Dependingontheworkload, IoT applications require diverse guarantees for record
thesystemhastopicktherightdeviceandacceleratorto
deliveryandstateupdatesemantics.Thesesemanticsaffect
meetthedesiredperformanceandenergyrequirements. theconsistencyofqueryresultsandarecategorizedas(a)
at-most-oncei.e.recordlossesareallowed,(b)at-least-once
2.3.1 State-of-the-ArtSystems i.e. recordduplicatesareallowed,and(c)exactly-oncei.e.
everyrecordmustbeprocessedonlyonce.
Currentdataprocessingsystemsusuallychoosebetweentwo
extremedesignchoices.General-purposeSPEsareusually
|     |     |     |     |     |     | 2.4.1 State-of-the-ArtSystems |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | --- |
hardware-oblivious,e.g.,Flink[19],SparkStreaming[76],
or Storm [67]. They use virtual machines, e.g., the Java State-of-the-art,cloud-basedSPEssupportexactly-once,at-
VirtualMachine,toabstractfromtheunderlyinghardware.
most-once,andat-least-oncestateupdates[17,24,8].They
This allows the support of a wide range of computing assumereliable,TCP-basednetworkconnectionsthatdonot
devices. However, it limits the efficiency as specific losedata.Furthermore,theyassumeupstreambackup[39]
| hardware | characteristics | are | not utilized. | In  | contrast, |     |     |     |     |     |
| -------- | --------------- | --- | ------------- | --- | --------- | --- | --- | --- | --- | --- |
andsophisticatedrecoverymechanisms[17,8]viapersisted
other SPEs are hardware-specific, e.g., TinyDb [49], statecheckpointstopreventrecordandstateloss.
Streambox-TZ[57],Grizzly[36],orBriskStream[80],and
optimizeforveryspecifichardwarecharacteristics.However, 2.4.2 LimitationsofState-of-the-Art
| they cannot | generalize | across | a diverse | set of | devices |     |     |     |     |     |
| ----------- | ---------- | ------ | --------- | ------ | ------- | --- | --- | --- | --- | --- |
withheterogeneoushardwarecapabilities. Asaresult,no InanIoTenvironment,theassumptionofreliablenetwork
state-of-the-artsystemprovidesasystemarchitecturethat connectionsnolongerholds.Furthermore,upstreambackup
4

S.Zeuch,E.TziritaZacharatou,S.Zhang,X.Chatziliadis,A.Chaudary,B.DelMonte,P.M.Grulich,D.Giouroukis,A.Ziehn,V.Markl:
NebulaStream:ComplexAnalyticsBeyondtheCloud
and state checkpoints are not feasible as the underlying whentheenclavecannotholdlargeapplicationstates.For
infrastructure is volatile and unreliable. As a result, IoT example, it can only hold up to tens of megabytes (MB)
applicationswillperforminefficientlyandbeerror-proneif for ARM TrustZone and up to 128 MB for Intel SGX
| theaboveissuesarenotsolved.Furthermore,deterministic |     |     |     |     |     |     | enclave[15]. |     |     |     |     |     |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
computation(seeSection2.6)isnotfeasible,ifthereisno Anotherpromisingapproachistoutilizeahomomorphic
reliablepartialorder-preservingdeliveryguarantee.Overall, encryption (HE) mechanism [16], which allows directly
enablingreliablestreamprocessingonahighlyunreliable processing on encrypted data (i.e., cyphertext) without
infrastructure of low-end devices is an open research decryption.However,howtoefficientlyutilizehomomorphic
question. Inparticular,thelevelofconsistencyachievable encryption mechanisms in SPEs still remains an open
andthetrade-offbetweenconsistencyandperformancemust
question.Ontheonehand,partialHEmechanisms,which
becarefullyinvestigated. allow for a restricted set of operations (e.g., ordering) on
|     |     |     |     |     |     |     | cyphertext, | may | still | lead to | information | leakage. |     | For |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ----- | ------- | ----------- | -------- | --- | --- |
2.4.3 EnablingEmergingIoTApplications example,CryptDB[58]utilizingorder-preservingencryption
|            |          |            |     |         |              |     | isreportedtobeeasilycrackable |     |     |     | [32]. | Ontheotherhand, |     |     |
| ---------- | -------- | ---------- | --- | ------- | ------------ | --- | ----------------------------- | --- | --- | --- | ----- | --------------- | --- | --- |
| Supporting | delivery | guarantees |     | enables | applications | to  |                               |     |     |     |       |                 |     |     |
allknownfullyHEschemes,whichsupportanyoperations
enforceorrelaxconstraintsonrecordprocessing.Delivery
|            |         |       |         |           |             |     | on encrypted | datasets |      | and provide | more   | reliable  | security |     |
| ---------- | ------- | ----- | ------- | --------- | ----------- | --- | ------------ | -------- | ---- | ----------- | ------ | --------- | -------- | --- |
| guarantees | are not | a new | concept | in stream | processing. |     |              |          |      |             |        |           |          |     |
|            |         |       |         |           |             |     | guarantees,  | still    | have | a long      | way to | go before | they     | can |
However,thevolatilityoftheIoTmakesthemparticularly
|     |     |     |     |     |     |     | be used in | practice | due | to the | significant | computational |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | -------- | --- | ------ | ----------- | ------------- | --- | --- |
hardtoprovide.Weenvisiontoaddressthischallengewith
|     |     |     |     |     |     |     | complexity | [54]. | The | strict | low-latency |     | processing |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ----- | --- | ------ | ----------- | --- | ---------- | --- |
NES, by allowing applications to trade performance for requirementofSPEsandthelowprocessingcapabilityof
| consistency | or vice | versa, | depending | on the | use case. | In  |     |     |     |     |     |     |     |     |
| ----------- | ------- | ------ | --------- | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
IoTdevicesprohibittheuseofanycomputationallyheavy
| particular, | applications | that | do  | not need tight | constraints |     |     |     |     |     |     |     |     |     |
| ----------- | ------------ | ---- | --- | -------------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
encryptionscheme.
| on results  | may      | use at-most-once |            | semantics | and            | allow |            |              |              |     |            |            |          |     |
| ----------- | -------- | ---------------- | ---------- | --------- | -------------- | ----- | ---------- | ------------ | ------------ | --- | ---------- | ---------- | -------- | --- |
|             |          |                  |            |           |                |       | There      | exists       | an extensive |     | body of    | literature | focusing |     |
| record loss | to speed | up               | analytics, | e.g.,     | on temperature |       |            |              |              |     |            |            |          |     |
|             |          |                  |            |           |                |       | on privacy | preservation |              | in  | relational | databases, | e.g.,    | k-  |
reads. However,applicationsthatdealwithsensitivedata, anonymity[65]anddifferentialprivacy[27].However,both
| e.g., car accident |     | detection, | may | employ | at-least-once | or  |     |     |     |     |     |     |     |     |
| ------------------ | --- | ---------- | --- | ------ | ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
approachesfocusonstatisticalqueriesonstaticrelational
exactly-oncesemanticsattheexpenseoflatency.
data.Theyarenotdirectlyapplicabletostreamprocessing,
whichhastoachievelowprocessinglatencywhiledealing
2.5 Secure&PrivateStreamProcessing
withcontinuousinputstreams.Specificsolutionshavealso
|     |     |     |     |     |     |     | been designed | for | privacy-aware |     | stream | processing, |     | such |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------------- | --- | ------ | ----------- | --- | ---- |
Thereisafastincreasingvolumeofdatageneratedinthe
asprivacy-awarecomplexeventprocessing[37].However,
| IoTenvironment. |     | Toachievetimelyanalysis, |     |     | ratherthan |     |     |     |     |     |     |     |     |     |
| --------------- | --- | ------------------------ | --- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
howbesttodesignageneral-purposeprivacy-awareSPEstill
| processing | in the | cloud, | data must | be processed | near | the |     |     |     |     |     |     |     |     |
| ---------- | ------ | ------ | --------- | ------------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
source(e.g.,thecloudedge)asmuchaspossibletoreduce remainsanopenquestion. Unstablenetworkconnections
andpotentiallynoisydatasourcesintheIoTenvironment
transmissionoverhead.However,theaboveedgeprocessing
|     |     |     |     |     |     |     | bring even | more | challenges |     | to the privacy-aware |     | system |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---- | ---------- | --- | -------------------- | --- | ------ | --- |
schemeexposessensitivedatatosignificantsecuritythreats
asedgedevicesarevulnerabletobeingattacked, causing design. Forexample, itbecomeshardtotellwhetherthe
noise[27]orsuppression[37]isintroducedbytheprivacy
| information | leakage. | Secure | &   | private stream | processing |     |     |     |     |     |     |     |     |     |
| ----------- | -------- | ------ | --- | -------------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
aims to provide a built-in security protection mechanism protectionmechanismorbythedynamicIoTenvironment.
| for SPEs, | which | has to | be both | scalable | and | energy |     |     |     |     |     |     |     |     |
| --------- | ----- | ------ | ------- | -------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
efficient. ExistingmechanismssuchasTrustedExecution 2.5.2 LimitationsofState-of-the-Art
Environment(TEE)andhomomorphicencryption(HE)may
|     |     |     |     |     |     |     | The shift | from | powerful | servers | in  | a cloud | environment |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---- | -------- | ------- | --- | ------- | ----------- | --- |
requirearevisitinordertobeappliedinanIoTenvironment.
|     |     |     |     |     |     |     | to low power        | IoT | devices                        | requires |     | us to revisit | existing |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | ------------------------------ | -------- | --- | ------------- | -------- | --- |
|     |     |     |     |     |     |     | securitymechanisms. |     | Ontheonehand,providingsecurity |          |     |               |          |     |
2.5.1 State-of-the-ArtSystems
guaranteesoftenrequiresonetotrade-offperformanceas
TheTrustedExecutionEnvironment(TEE)techniqueisone itbringssignificantcomputationcomplexity. Ontheother
promisingapproachtosecuredataprocessing. Itisolates hand, IoT devices are often equipped with relatively low
a special encrypted area of memory called an enclave. computationcapacitywithunstableconnections.
Subsequently, it guarantees that code and data loaded in The federated environment of IoT also prohibits us
theenclaveareprotectedwithrespecttoconfidentialityand fromrelyingoncentrallygovernedmechanismstoprovide
integrity. Parketal.[57]reportedhowtoextendexisting securityguarantees.Forexample,anapplicationmayrequire
SPEs[53]toutilizeARMTrustZone,whichisoneofthe datastreamsgeneratedacrossdifferentregions(e.g., data
implementationsofTEE.However,itstillremainsunclear fromthecapitalofdifferentcountries).However,sensitivity
howtoefficientlysupportstatefulapplications,inparticular informationmaynotbeallowedtoleaveaspecificregion.
5

OpenJournalofXXX(OJXX),VolumeX,IssueX,20XX
However, existing mechanisms are mostly non-scalable 2.6.1 State-of-the-ArtSystems
| when we | have | to provide | security | guarantees | to  | millions |     |     |     |     |     |     |     |
| ------- | ---- | ---------- | -------- | ---------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
Intheareaofgeneralstreamprocessingengines,recently
ofdevicesacrossdifferentlayers(i.e.,edge,fog,andcloud
|     |     |     |     |     |     |     | proposed | SPEs | achieve | excellent | performance |     | when |
| --- | --- | --- | --- | --- | --- | --- | -------- | ---- | ------- | --------- | ----------- | --- | ---- |
center)inalargegeographicscale.
|     |     |     |     |     |     |     | processing  | large | volumes        | of  | data under | tight   | latency     |
| --- | --- | --- | --- | --- | --- | --- | ----------- | ----- | -------------- | --- | ---------- | ------- | ----------- |
|     |     |     |     |     |     |     | constraints | [78]. | In particular, |     | SPEs       | such as | Flink [19], |
2.5.3 EnablingEmergingIoTApplications Storm [67], and Heron [48], achieve high performance
|          |         |        |            |         |     |     | via disjoint | partitioning      |     | of application |      | states [17] | – often   |
| -------- | ------- | ------ | ---------- | ------- | --- | --- | ------------ | ----------------- | --- | -------------- | ---- | ----------- | --------- |
|          |         |        |            |         |     |     | through      | hash partitioning |     | [45].          | This | ensures     | that each |
| Secure & | Private | stream | processing | enables |     | NES | to           |                   |     |                |      |             |           |
processconfidentialdatabyprovidingsecurityandintegrity executionthread(i.e.,executor)maintainsadisjointsubset
|             |      |        |        |            |      |      | of states     | and thereby | bypasses |     | the issue | of  | concurrent |
| ----------- | ---- | ------ | ------ | ---------- | ---- | ---- | ------------- | ----------- | -------- | --- | --------- | --- | ---------- |
| guarantees. | This | allows | NES to | be adopted | into | many |               |             |          |     |           |     |            |
|             |      |        |        |            |      |      | state access. |             |          |     |           |     |            |
sensitive aspects of a smart city such as smart health However, this type of design can lead to
tediousimplementationandineffectiveperformanceinmany
| care, and | smart | finance, | where data | may | be  | generated |     |     |     |     |     |     |     |
| --------- | ----- | -------- | ---------- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
cases[82].
| over millions | of  | sensors, | and privacy | and | integrity | need |     |     |     |     |     |     |     |
| ------------- | --- | -------- | ----------- | --- | --------- | ---- | --- | --- | --- | --- | --- | --- | --- |
to be protected. For example, heart rate variability Transactional stream processing engines have recently
|     |     |     |     |     |     |     | received | attention | from | both | academia | [5, | 82] and |
| --- | --- | --- | --- | --- | --- | --- | -------- | --------- | ---- | ---- | -------- | --- | ------- |
analysis[61]requiresanalyzingelectrocardiograms(ECG)
and photoplethysmograms (PPG). Both signals must industry [29]. In emerging use cases, large mutable
applicationstatescanbeconcurrentlyaccessedbymultiple
| be captured                         | and | processed | reliably | in            | real time. | It  | is        |      |                  |     |          |           |        |
| ----------------------------------- | --- | --------- | -------- | ------------- | ---------- | --- | --------- | ---- | ---------------- | --- | -------- | --------- | ------ |
|                                     |     |           |          |               |            |     | operators | (and | their executors) |     | [82, 52, | 5] during | stream |
| challenginginsupportingthisusecase. |     |           |          | Ontheonehand, |            |     |           |      |                  |     |          |           |        |
any unauthorized read or even modification to the input processing and transactional state consistency has to be
|            |             |        |        |       |            |        | preserved. | Many | such | applications | have | been | proposed |
| ---------- | ----------- | ------ | ------ | ----- | ---------- | ------ | ---------- | ---- | ---- | ------------ | ---- | ---- | -------- |
| signals or | application | states | (e.g., | range | of typical | values |            |      |      |              |      |      |          |
of signals) can be dangerous and should be prevented. coveringvariousdomains(e.g.,Health-care[70],IoT[14],
andE-commerce[52]).RecenttransactionalSPEstypically
| On the    | other hand, | large    | processing  | latency | can | cause    |             |          |     |              |       |               |     |
| --------- | ----------- | -------- | ----------- | ------- | --- | -------- | ----------- | -------- | --- | ------------ | ----- | ------------- | --- |
|           |             |          |             |         |     |          | model state | accesses | as  | transactions | [14]. | Subsequently, |     |
| delays in | identifying | emerging | situations. |         | To  | minimize |             |          |     |              |       |               |     |
network transmission overhead, we need to process the stateconsistencyismaintainedbythesystembyadopting
transactionalsemantics(suchasACIDproperties).However,
| data close | to the | source | (e.g., sensors |     | on the | patients), |     |     |     |     |     |     |     |
| ---------- | ------ | ------ | -------------- | --- | ------ | ---------- | --- | --- | --- | --- | --- | --- | --- |
which is however vulnerable to be attacked. NES aims they typically rely on locks, where concurrent access to
|          |          |           |           |            |     |         | each state | is permitted | only      | if     | the lock | is granted     | to the |
| -------- | -------- | --------- | --------- | ---------- | --- | ------- | ---------- | ------------ | --------- | ------ | -------- | -------------- | ------ |
| to bring | security | guarantee | to stream | processing |     | without |            |              |           |        |          |                |        |
|          |          |           |           |            |     |         | thread.    | As a result, | it scales | poorly | while    | underutilizing |        |
introducingsignificantoverhead.Inparticular,wewilltakea
holisticapproachbyapplyingsuitablesolutionsondifferent hardwareresources[14,52].TStreamisarecentlyproposed
|     |     |     |     |     |     |     | transactional | SPE | [82], | and it | significantly | improves | the |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ----- | ------ | ------------- | -------- | --- |
componentsofstreamprocessingacrossdifferentlayers.
executionefficiencybycompletelyavoidinglocks.However,
itisdesignedforasinglenodeassumingashared-memory
architecture.Itmightrequireasystemredesigntofullytake
2.6 TransactionalStreamProcessing
advantageofTStream’sapproachinanIoTenvironment.
SPEswithtransactionalstatemanagementrelievetheburden
of managing state consistency from the users. However, 2.6.2 LimitationsofState-of-the-Art
| scaling | stream | processing | while | providing | transactional |     |     |     |     |     |     |     |     |
| ------- | ------ | ---------- | ----- | --------- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
statemanagementischallenging,inparticularforemerging Astraightforwardmechanismtosupporttransactionalstream
dynamicallydistributedenvironmentsuchastheIoT.Onthe processingistoadoptanoff-the-shelftransactionaldatabase
managementsystem(DBMS)forstatemaintenanceduring
onehand,toachievebothlowlatencyandhighthroughput,
SPEscanprocessmultipleinputevents(includingstreaming streamprocessing.Unfortunately,thismechanismnotonly
data and ad-hoc user queries) [44] at the same time degradesthesystemperformancebutmayalsoviolatestate
to aggressively exploit parallelism. On the other hand, consistency [52]. On the one hand, using a third-party
processingdifferenteventsconcurrentlymayleadtoconflict DBMSforfrequentdataaccesscancausehighinter-process
|     |     |     |     |     |     |     | communication |     | overhead | between | two | different | systems |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | -------- | ------- | --- | --------- | ------- |
accesses(readsandwrites)tothesameapplicationstate(i.e.,
concurrentstateaccess),henceleadingtohigherchances (i.e., DBMS and SPE). On the other hand, conventional
of violating the transactional state consistency [52, 82]. DBMSs’concurrencycontrolprotocolonlyguaranteesthat
Furthermore, more than simply guaranteeing the ACID the execution order of concurrent transactions is conflict-
properties, SPEs need to enforce the state access order equivalenttoanycertainserialschedule,whichmaynotobey
theeventorderimpliedbytheattachedtimestamps[52,82].
accordingtotheinputeventsequence.Thisisverydifferent
fromtheconventionalconcurrencycontrolprotocols,which Furthermore,acentralstatestorageisoftennotavailable
serializetransactionsinanorderthatisconflict-equivalent inanIoTenvironment. Thisbringsevenmorechallenges
toanycertainserialschedule. to provide state consistency as transactional states have
6

S.Zeuch,E.TziritaZacharatou,S.Zhang,X.Chatziliadis,A.Chaudary,B.DelMonte,P.M.Grulich,D.Giouroukis,A.Ziehn,V.Markl:
NebulaStream:ComplexAnalyticsBeyondtheCloud
tobestoredinadistributedmanner. Althoughdistributed operators,e.g.,filterstoselectdatasubsets,joinstocombine
databases/key-value stores have been extensively studied signalswithexternaldatasources,orgroup-byaggregates
andadoptedinsomeSPEs,theyarenotdesignedtosupport togroupsignalsaccordingtotheirsource.
concurrentorderedstateaccesses[82,5]. Guaranteeinga Domainexpertstypicallyusenumericalframeworkssuch
deterministicexecutionsequenceandstateconsistencywhile as Matlab or R to perform signal processing. However,
supportingconcurrentstateaccessisalsoincontradictionto these frameworks lack support for relational operators,
thehighlydynamicIoTenvironmentwhereinputrecordcan are not suited for online analyses, and cannot scale to
arriveoutoforder,haveaninaccuratetimestamp,andmiss large datasets. To address these limitations, big data
information.CommonproblemsintheIoTenvironment,e.g., frameworks, such as Spark, integrate with R, allowing
transient node errors, unreliable connections, low-quality domain experts to re-use their R scripts, which are now
hardware,lowstoragecapacities,andnoupstreambackups, executedonSpark’sprocessingengine.Nevertheless,there
further make existing scale-up [82] and scale-out [5] is an impedance mismatch between general-purpose data
solutionshardlyapplicable. processing systems and numerical frameworks, which
introduceshighcommunicationoverhead, makingithard
2.6.3 EnablingEmergingIoTApplications toattainreal-timeperformance.
Transactionalstreamprocessingopensthegateoflinking
3.1.1 State-of-the-ArtSystems
twopopularresearchfields,OLTPandstreamprocessing.
Iteasesthedevelopmentofmanyemergingcomplexstateful ConventionalSPEsdonothavebuilt-insignalprocessing
streamapplications[82],wheretheprocessingofasingle support. A naive solution to enabling digital signal
eventmayneedtoaccessmultipleoverlappingstateswhile processing (DSP) is to implement signal processing
preservingstateconsistency.Letustakeself-drivingvehicle operations as user-defined functions. This is, however,
monitoring[51]asanexample,whichisoneofthepopular counter-intuitivefordomainexperts,asitrequiresadeeper
applicationsofasmartcity.Millionsofcarsarecontinuously understandingofthesystem’sdatamodel.
generatingstatusdataviatheirsensors,andSPEscanoffer Thereisalimitedamountofworkinunifyingrelational
manyservices,suchasawarningandalistofnearbygas andsignalprocessingoperationsintoasinglesystem(e.g.,
stations whenever the fuel tank level is below a certain WaveScope[34]andTrillDSP[55]). WaveScopeprovides
threshold. The SPE then needs to maintain gas station little support for distributed query execution. It executes
information,roadconditioninformation,whileprocessing distributedapplicationsoveraclusterofafewprocessing
thefloodofsensordatastreamsfromvehicles.Tomakethe nodes or between processing nodes and sensors. Only
right decisions timely, consistent and up-to-date states of lightweight operations are offloaded to sensors, while a
bothgasstationsandroadsiscrucialinthisexample.This centralizedcomponentcollectsdataforfurtherprocessing.
ischallengingbecausetheprocessingofinputsignalsfrom TrillDSP extends Microsoft’s Trill streaming analytics
different vehicles may access common application states, engine[20],whichdoesnotsupportdistributedexecution.
e.g.,statusofacommongasstationorroad.Torelieveusers
frommanagingsharedstateconsistencybythemselves,NES
3.1.2 LimitationsofState-of-the-Art
will provide an efficient transactional state management
componenttoperformdataintegration,analytics,cleaning, Thereareonlyafewstreamprocessingenginesthatprovide
andtransformationonfreshdatainnearrealtime. adequate support for DSP operators [34, 55]. However,
theseengineshavenoorlittlesupportfordistributedquery
3 DOMAIN-SPECIFICFEATURES execution. Therefore,theycannotbedeployedinahighly
distributedIoTenvironment.Enablingsignalprocessingover
Inthissection,wedescribedomainspecificfeaturesthatare streamsinsuchaheterogeneousenvironmentischallenging
requiredtoenablearichersetofapplicationsoveranIoT forseveralreasons.First,someDSPoperationsarecompute
datamanagementplatformsuchasNES. or memory intensive, and thus cannot be executed on
resource-constrained, low-end fog devices. At the same
time, there might be devices close to the input sensor
3.1 SignalProcessing
sourcesthatareequippedwithspecializedsignalprocessing
Networked sensorsareatthe coreoftheIoT.Toanalyze hardware and are thus particularly tailored for efficiently
sensordataandextractinsights,IoTapplicationsemploya executingDSPoperators.Furthermore,DSPoperationsare
varietyofsignalprocessingtechniques,e.g.,interpolationto typicallynotcommutative. Therefore, event-orderinghas
handlemissingsensorvalues,digitalfilterstorecovernoisy to be maintained, which is hard in a highly volatile and
signals, and Fast Fourier Transform (FFT) to do spectral distributedfoginfrastructure.NESaimstoprovideefficient
analysis [55]. In addition, applications need relational nativesupportforsignalprocessingbytightlyintegrating
7

OpenJournalofXXX(OJXX),VolumeX,IssueX,20XX
DSPoperatorsintheexecutionengine,performingsemantic- extendsApacheStorm[67]tosupportcontinuousspatial-
aware data routing, and implementing smart operator keyword queries. These extensions are initial research
placementstrategiestooptimizeresourceutilization. prototypes supporting only a limited set of spatial query
types.
3.1.3 EnablingEmergingIoTApplications
|     |     |     |     |     |     |     | 3.2.2 | LimitationsofState-of-the-Art |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----- | ----------------------------- | --- | --- | --- | --- | --- |
Sensorscaptureandtransmitsignalsinstreams.Toanalyze
Existingsystemsfacemanychallengesinsupportingspatial
| these data, | IoT | workflows | in  | various domains |     | combine |     |     |     |     |     |     |     |
| ----------- | --- | --------- | --- | --------------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
analyticsintheIoT.First,theyneedtocollectalldataina
relationalandsignallogic.ShotSpotter[3],forexample,is
agunshotdetectionandlocalizationapplicationthatcaptures centralizedclusterorcloudenvironmentpriortoapplying
|                |       |         |        |               |             |          | processing.   | Given | the             | large amounts | of       | data | originating |
| -------------- | ----- | ------- | ------ | ------------- | ----------- | -------- | ------------- | ----- | --------------- | ------------- | -------- | ---- | ----------- |
| impulsive      | audio | signals | likely | to correspond | to          | gunshots |               |       |                 |               |          |      |             |
|                |       |         |        |               |             |          | from millions | of    | geo-distributed |               | sensors, | this | centralized |
| using acoustic |       | sensors | placed | in a city.    | The signals | are      |               |       |                 |               |          |      |             |
processingparadigmresultsinhighquerylatency.Second,
groupedbyregionsandarefilteredtoremovebackground
|              |     |       |         |           |                  |     | data are | multidimensional, |     | heavily | skewed, | and | come at |
| ------------ | --- | ----- | ------- | --------- | ---------------- | --- | -------- | ----------------- | --- | ------- | ------- | --- | ------- |
| noise, prior | to  | being | further | processed | by sophisticated |     |          |                   |     |         |         |     |         |
detectiontechniques. NESaimstosupporttheexecution high velocity. As a result, load balancing and indexing
techniquesemployedbyexistingspatialdataframeworks
ofDSPoperatorsclosetothesensors,andtherebyenable
eitherincurhighingestionratesduetofrequentre-balancing
emergingIoTapplicationstoefficientlyprocesshigh-rate
operationsorpenalizequeryperformanceduetopartitioning
signalsoriginatingfrommillionsofsensors.
|     |     |     |     |     |     |     | schemes | that do | not preserve |     | spatial locality |     | [41]. To |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------- | ------------ | --- | ---------------- | --- | -------- |
achievelow-latencyandscalability,NESwillemploynovel
3.2 EfficientSpatialAnalytics
solutionsthatprocessspatialdatain-network,inalocality-
|               |     |        |         |                |            |     | aware manner. |     | Finally, | spatial | analytics | involve | costly |
| ------------- | --- | ------ | ------- | -------------- | ---------- | --- | ------------- | --- | -------- | ------- | --------- | ------- | ------ |
| Data produced |     | by IoT | devices | are inherently | geospatial |     |               |     |          |         |           |         |        |
geometriccomputations(suchasPoint-in-Polygontests)to
| in nature. | Some | devices | have | fixed static | locations | (e.g., |     |     |     |     |     |     |     |
| ---------- | ---- | ------- | ---- | ------------ | --------- | ------ | --- | --- | --- | --- | --- | --- | --- |
evaluaterelationsbetweenobjectsinspace(e.g.,intersection,
| smart house | appliances), |     | while | others (e.g., | smartphones, |     |     |     |     |     |     |     |     |
| ----------- | ------------ | --- | ----- | ------------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
smartwatches, wearables) have a continuously changing containment)andarethuscomputationallyexpensive[46,64,
68],moreexpensivethantypicalrelationalqueries.Low-end
| location, | as they | are | attached | to a moving | entity | (e.g., |     |     |     |     |     |     |     |
| --------- | ------- | --- | -------- | ----------- | ------ | ------ | --- | --- | --- | --- | --- | --- | --- |
IoTdeviceshavelimitedcomputationalresources,andare
| a human | or a | car). | The volume | and | rate of geospatial |     |     |     |     |     |     |     |     |
| ------- | ---- | ----- | ---------- | --- | ------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
data collected in the IoT are ever-increasing. Cellular thusunsuitableforexecutingsuchcostlyoperations.Tomake
|          |         |          |     |         |            |       | efficientuseoftheavailableresources, |     |     |     |     | NESwillemploy |     |
| -------- | ------- | -------- | --- | ------- | ---------- | ----- | ------------------------------------ | --- | --- | --- | --- | ------------- | --- |
| networks | produce | millions | of  | records | per second | [40]. |                                      |     |     |     |     |               |     |
Serviceweatherstationshaveabroadrangeofsensorsthat smart placement strategies that distribute spatial queries
|     |     |     |     |     |     |     | across fog | and | cloud nodes | while | exploiting |     | specialized |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ----------- | ----- | ---------- | --- | ----------- |
measureatmosphericconditionswithincreasinggranularity,
hardware(e.g.,GPUs)andrespectingdevicelimitations.
| generating      | millions  | of                     | records         | with each | scan.            | At the |                |                                 |     |         |                         |     |     |
| --------------- | --------- | ---------------------- | --------------- | --------- | ---------------- | ------ | -------------- | ------------------------------- | --- | ------- | ----------------------- | --- | --- |
| same time,      | a variety |                        | of applications | in        | domains          | such   | as             |                                 |     |         |                         |     |     |
|                 |           |                        |                 |           |                  |        | 3.2.3          | EnablingEmergingIoTApplications |     |         |                         |     |     |
| transportation, |           | environmentalsciences, |                 | health,   | andpublic        |        |                |                                 |     |         |                         |     |     |
| safety rely     | on        | efficient,             | real-time       | spatial   | data processing. |        |                |                                 |     |         |                         |     |     |
|                 |           |                        |                 |           |                  |        | Most phenomena |                                 | in  | the IoT | are location-dependent. |     |     |
Connected vehicle applications leverage spatial data to Consequently,therelevance,value,andutilityofIoTdata
| seamlessly | optimize | mobility |     | in smart cities. | Monitoring |     |     |     |     |     |     |     |     |
| ---------- | -------- | -------- | --- | ---------------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
typicallydependonthegeographiccontextofthedevices
| systems | require | fresh | spatial | data to prevent | dangerous |     |     |     |     |     |     |     |     |
| ------- | ------- | ----- | ------- | --------------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
thatproducedataandoftheusersthatconsumethem.NES
| situations          | and | trigger | alerts. | Given the | central           | role that |         |         |            |           |         |      |            |
| ------------------- | --- | ------- | ------- | --------- | ----------------- | --------- | ------- | ------- | ---------- | --------- | ------- | ---- | ---------- |
|                     |     |         |         |           |                   |           | aims to | provide | efficient, | real-time | spatial | data | analytics, |
| spatial information |     | plays   | in the  | IoT and   | the interactivity |           |         |         |            |           |         |      |            |
andtherebyfacilitateemergingIoTapplicationsindomains
expected from applications, there is the need for an IoT suchastransportation(e.g.,driverlessvehicles,connected
datamanagementplatformthatsupportslow-latencyspatial
cars),publicsafety(e.g.,anetworkofconnectedcamerasor
analytics.
acousticsensors)andhealth(e.g.,wearablehealthtrackers)
| 3.2.1 | State-of-the-ArtSystems |     |     |     |     |     | 3.3 ComplexEventProcessing |     |     |     |     |     |     |
| ----- | ----------------------- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- |
Intheareaofcluster-basedsystems,mostexistingdistributed TheIoTisoneofthemaindomainsthatsuccessfullyleverage
spatialsystemsaredesignedforstatic(batch)processing,and the monitoring features of Complex Event Processing
thusincurhighlatencyforstreamingqueriesoverstreaming (CEP) [23, 81]. CEP is a stateful stream processing
data.TheyarebasedonHadoop[7,28]orSpark[66,71,75]. methodthatdetectsuser-definedrulepatternsinlargedata
Existing general-purpose SPEs [19, 67] have no direct streams.Herewith,itenablesautonomousreal-timedecision
supportforspatialdata. MobyDick[31]isalibrarybuilt makingfordata-intensiveIoTapplicationswheremanual
ontopofApacheFlink[19]thatextendsFlinkwithaset monitoringisinfeasibleandpromptreactionsarerequired,
ofspatio-temporaldatatypesandoperators. Tornado[50] e.g.,intelligenttransportationsystems,smartstreetlamps,
8

S.Zeuch,E.TziritaZacharatou,S.Zhang,X.Chatziliadis,A.Chaudary,B.DelMonte,P.M.Grulich,D.Giouroukis,A.Ziehn,V.Markl:
NebulaStream:ComplexAnalyticsBeyondtheCloud
vehiclepollutioncontrol,orsupplychainmanagement[6]. devices. As a result, computational and time-intensive
Thus, efficient CEP is a necessary feature for future IoT cloud-basedpatterndetectionmechanismscannotbeapplied
applicationswithmillionsofconnecteddevices. out-of-the-boxandrequireadjustmentstofitthehardware
capabilitiesandbenetwork-aware.
3.3.1 State-of-the-ArtSystems FuturedatamanagementplatformsneedCEPtoenable
|     |     |     |     |     |     | autonomous | monitoring |     | applications | for the | IoT. | Within |
| --- | --- | --- | --- | --- | --- | ---------- | ---------- | --- | ------------ | ------- | ---- | ------ |
SeveralSPEsofferCEPfeatures,e.g.,Esper1,Cayuga[25],
NES,wewanttoprovideadistributedin-networkCEPfor
STREAM[11],andAurora[4].Duetotheever-increasing
futureIoTapplicationsbyexploitingthefogparadigmgiven
| volume                                                | and rate | of data, | the | concurrent | detection | of          |        |         |         |             |         |     |
| ----------------------------------------------------- | -------- | -------- | --- | ---------- | --------- | ----------- | ------ | ------- | ------- | ----------- | ------- | --- |
|                                                       |          |          |     |            |           | limitations | of the | low-end | devices | and dynamic | network |     |
| thousandsofpatternsrequiresmassiveresourcecapacities. |          |          |     |            |           | topology.   |        |         |         |             |         |     |
Toefficientlyutilizetheexistingresourcesofthesemostly
single-machineapproaches,optimizationtechniquescanbe 3.3.3 EnablingEmergingIoTApplications
applied,e.g.,rewritingandprefixsharing[47,60].However,
the majority of these systems use pattern specification CEPisapowerfulstreamprocessingmethod, commonly
languages, which make automated optimization of their usedbyvariousmonitoringapplications.Byadaptingcurrent
patterndetectionmechanismchallenging[60]. CEPsystemswithenhanceddistributionstrategiesbeyond
cloudsolutions,NESwillprovideCEPalsoforfutureIoT
| Examples | of  | Large-Scale | Data | Stream | Processing |     |     |     |     |     |     |     |
| -------- | --- | ----------- | ---- | ------ | ---------- | --- | --- | --- | --- | --- | --- | --- |
Systems [18] that offer CEP are Flink [19], Spark [76], monitoring applications. These monitoring applications
andStorm[67]. Thesesystemsareoftencloud-basedand, profitfurtherfromthepreviouslyintroducedfeatures,i.e.,
thus, providealmostunlimitedresources. Parallelstream spatial data analysis for location-aware patterns, adaptive
processing and distributed pattern detection monitoring filtering for early data reduction as well as secure and
transactionalprocessingtechniques.Inparticular,theunion
| are techniques | to  | distribute | the | centrally | collected | data |     |     |     |     |     |     |
| -------------- | --- | ---------- | --- | --------- | --------- | ---- | --- | --- | --- | --- | --- | --- |
andefficientlyutilizetheseunlimitedcloudresources[30]. of the cloud and fog paradigms in a single environment
However, these techniques do not solve the central data will allow applications to control the reporting of partial
collectionbottleneck. and full matches flexibly to the interested sinks. Some
Overall, CEP consists of two components: a pattern applicationsmayrunentirelyautonomouslyinthefoglayer,
|               |          |     |        |         |       | e.g.,smartstreetlampmonitoring[42]. |     |     |     | Otherapplications |     |     |
| ------------- | -------- | --- | ------ | ------- | ----- | ----------------------------------- | --- | --- | --- | ----------------- | --- | --- |
| specification | language | (to | define | complex | event | patterns)                           |     |     |     |                   |     |     |
and a pattern detection mechanism (to detect patterns in might expose their matches to the cloud layer, but their
datastreams).Forneitherofthetwocomponents,ageneral sensitivedata,whichwasanalyzedtodetectthematch,will
solution exists, i.e., several CEP systems provide their notleaveaprivatefogandisthereforesecured.Forexample,
own specification languages (e.g., EPL1, SASE+ [79], smarthospitals[72]reportingCOVID-19casestoasmart
and CCL [81]) optimized for their pattern detection city application for further analysis. Overall, distributed
mechanism.Detectionmechanismstypicallyfocusoneither CEP for the IoT enables a wide range of autonomous
severalvariationsofstatemachinesortrees,butalsoevent monitoring applications that are currently prevented by
cloudbottlenecksanddatasecurityconcerns.
processingnetworksandcolumn-basedapproachesexist[47].
| The missing | generality |     | of CEP systems |     | leads to | various |     |     |     |     |     |     |
| ----------- | ---------- | --- | -------------- | --- | -------- | ------- | --- | --- | --- | --- | --- | --- |
approaches with individual optimizations that are hard to 3.4 MachineLearning
adapttoanotherCEPsystemorcomputingparadigm[47,83].
Complexmachinelearning(ML)tasks,e.g.,classification,
Besides,thesevariationsstrengthenthechallengeofcoping
|     |     |     |     |     |     | clustering, | and | prediction | are | key applications | to  | extract |
| --- | --- | --- | --- | --- | --- | ----------- | --- | ---------- | --- | ---------------- | --- | ------- |
withtherapidevolutionoffutureIoTapplications.
|     |     |     |     |     |     | knowledgefrom   |     | massive    | amount | ofIoT data. | Therefore, |     |
| --- | --- | --- | --- | --- | --- | --------------- | --- | ---------- | ------ | ----------- | ---------- | --- |
|     |     |     |     |     |     | it is necessary |     | to provide | native | ML support  | in an      | IoT |
3.3.2 LimitationsofState-of-the-Art
datamanagementplatformtofullyprofitfromtheinsights
extractedfromthedata.
| The central | data      | collection | bottleneck |            | of current | SPEs    |     |     |     |     |     |     |
| ----------- | --------- | ---------- | ---------- | ---------- | ---------- | ------- | --- | --- | --- | --- | --- | --- |
| prevents    | their CEP | engine     | from       | exploiting | the        | spatial |     |     |     |     |     |     |
closeness of event sources as well as data reduction 3.4.1 State-of-the-ArtSystems
| and distributed | pattern |     | detection | close | to the network’s |     |     |     |     |     |     |     |
| --------------- | ------- | --- | --------- | ----- | ---------------- | --- | --- | --- | --- | --- | --- | --- |
AspresentedbyDerakshanetal.[26],amachinelearning
| edge[21,22]. | Tothisend,currentSPEsarenotreadyyet |           |              |     |             |                |              |          |             |             |            |     |
| ------------ | ----------------------------------- | --------- | ------------ | --- | ----------- | -------------- | ------------ | -------- | ----------- | ----------- | ---------- | --- |
|              |                                     |           |              |     |             | model training |              | pipeline | consists    | of several  | stages.    | A   |
| to provide   | CEP                                 | solutions | that fulfill | the | low-latency | and            |              |          |             |             |            |     |
|              |                                     |           |              |     |             | pipeline       | is iterative | as       | every stage | is repeated | to improve |     |
real-timerequirementsofIoTapplicationsformillionsof
|     |     |     |     |     |     | the performance |     | of the | model | continuously. | The | key |
| --- | --- | --- | --- | --- | --- | --------------- | --- | ------ | ----- | ------------- | --- | --- |
distributedIoTdevices.
|                  |       |                |      |             |        | components | for | each       | stage | of such a pipeline | are | the  |
| ---------------- | ----- | -------------- | ---- | ----------- | ------ | ---------- | --- | ---------- | ----- | ------------------ | --- | ---- |
| Fog environments |       | enable         | data | processing  | at the | edge       |     |            |       |                    |     |      |
|                  |       |                |      |             |        | following: | (1) | Definition | of    | the input sources, | (2) | Data |
| of the network   | using | geographically |      | distributed |        | low-end    |     |            |       |                    |     |      |
cleansingandtransformation,(3)Training,(4)Evaluation,
| 1http://www.espertech.com/ |     |     |     |     |     | (5)Materialization,(6)Deployment. |     |     |     |     |     |     |
| -------------------------- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | --- | --- | --- |
9

OpenJournalofXXX(OJXX),VolumeX,IssueX,20XX
State-of-the-artSPEs,e.g.,Flinkdonotsupportallstages fog infrastructure risk to stall the whole system, as these
natively.InmostapplicationscenariosonlyStage(1)and(2) solutions are prone to backpressure or high latency. In
areexecutedintheSPE.Fortrainingandevaluation(Stage3 applicationscenarioswithlong-runningMLpipelines,itis
and4),thedataisthenloadedtoabatchprocessingsystem thusessentialtohandletheseissues,astheycouldprohibit
likeSparkorTensorflow. Afterthemodelistrained,itis thecompletionofthepipeline.
transmittedinStage5toaMLmodelmanagementsystem With NES, we propose a system that will support
likeMLFlow[1]orModelDB[2]Atthispoint,themodelis processingtasksonCPUsandGPUsinthecloud,fog,and
persistedatacentrallocation,andaversioningnumberalong edge. Asaresult,NESeliminatestheneedtoperformall
withadditionalmetadata,isattachedtoit.Thedeployment pipelinestagesinthecloudandthusenablesmoreefficient
ofthemodelisperformedinStage6,wherealldestinations
executionofMLpipelines.
| that require | the      | newest    | version | of the | trained | model      | can |                                       |     |     |     |     |     |     |
| ------------ | -------- | --------- | ------- | ------ | ------- | ---------- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- |
| access it    | from the | centrally | located | model  |         | management |     |                                       |     |     |     |     |     |     |
|              |          |           |         |        |         |            |     | 3.4.3 EnablingEmergingIoTApplications |     |     |     |     |     |     |
systeminthecloud.
Insituationswheretrainingorinferenceisrequiredwithin Nowadays, dataengineeringusecasesdependheavilyon
the SPE, users have to implement customized solutions statistical models or machine learning. In the era of IoT,
using User Defined Functions (UDFs). In these cases, where thousands of devices and millions of sensors are
| the processes | for | inference | are | running | as micro-services |     |     |     |     |     |     |     |     |     |
| ------------- | --- | --------- | --- | ------- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
inter-connectedacrossdistributedlocations,thereisaneed
in a central location and are called via REST or Remote to shift these applications to the edge. In large-scale IoT
ProcedureCalls(RPCs). environmentslikeasmartcity,NESisgoingtoenableus
topushdownaggregateorfilteroperationswithon-the-fly
3.4.2 LimitationsofState-of-the-Art analyticaldecisions.Byexecutingthesecomplexanalytical
tasksinearlystagesofdatapipelines,wehaveknowledge
| Pushing | training | and inference |     | operators | down | to  | edge |           |            |        |     |         |          |        |
| ------- | -------- | ------------- | --- | --------- | ---- | --- | ---- | --------- | ---------- | ------ | --- | ------- | -------- | ------ |
|         |          |               |     |           |      |     |      | what data | to forward | across | the | network | and thus | reduce |
devices is challenging from a system perspective, mainly networkloadandlatency.
duetothecomplexityofMLpipelines.Asdescribedabove,
thereisnosystemsupportingalltheneededfunctionality
4 CONCLUSION
forallstagesofthepipeline.
| IntheIoTdomain, |      | adatamanagementsystemforML |               |       |                 |     |     |            |           |            |     |                   |     |        |
| --------------- | ---- | -------------------------- | ------------- | ----- | --------------- | --- | --- | ---------- | --------- | ---------- | --- | ----------------- | --- | ------ |
|                 |      |                            |               |       |                 |     |     | This paper | presented | challenges |     | and opportunities |     | for an |
| should also     | cope | with                       | the following | three | characteristics |     |     |            |           |            |     |                   |     |        |
ofIoTtopologiesandtheircorrespondingchallenges.First, IoTdatamanagementsystemtoenablecomplexanalytics
|     |     |     |     |     |     |     |     | beyond | the cloud. | To this | end, | we described | changes | to  |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ---------- | ------- | ---- | ------------ | ------- | --- |
heterogeneity:Thetrainingofamodelisacomputationally
existingcorefeatures,investigatednewfeatures,aswellas
| expensive | operation | that | requires | many | resources |     | and |     |     |     |     |     |     |     |
| --------- | --------- | ---- | -------- | ---- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
is usually executed on GPUs. Consequently, model domain-specificfeatures.Foreachfeature,wepresentedthe
challengesandrequirements,discussedthestate-of-the-art,
| training tasks | should | be  | preferably | executed |     | in the | cloud. |     |     |     |     |     |     |     |
| -------------- | ------ | --- | ---------- | -------- | --- | ------ | ------ | --- | --- | --- | --- | --- | --- | --- |
showedtheirlimitations,andhighlightedhowwecanuse
DevicesintheIoTvaryinresourcesandrunondifferent
IoTinfrastructuresefficiently.Furthermore,weoutlinedour
| operatingsystemsandhardware. |     |     |     | ApplyingMLinsucha |     |     |     |     |     |     |     |     |     |     |
| ---------------------------- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
envisionedsolutionsforthesechallengesinourownsystem
heterogeneousIoTenvironmentiscurrentlynotsupported
by common ML Systems like Tensorflow or Spark. In NebulaStream.Wehopethatthispaperlaysthefoundation
foranewtypeofsystemsthatleveragestheIoTtoenable
| particular, | specialized |     | approaches | for | ML  | inference | in  |             |              |     |               |     |             |     |
| ----------- | ----------- | --- | ---------- | --- | --- | --------- | --- | ----------- | ------------ | --- | ------------- | --- | ----------- | --- |
|             |             |     |            |     |     |           |     | large-scale | applications |     | over millions | of  | IoT devices | in  |
IoTenvironments[43,35]arenotsupportedbyageneral
highlydynamicandgeo-distributedenvironments.Overall,
purposesystemsforML.
weenvisionNebulaStreamanditsnewsetoffeaturesand
| Second, | limited | resources: |     | Difficulties | arise | from | the |     |     |     |     |     |     |     |
| ------- | ------- | ---------- | --- | ------------ | ----- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
largesizesofthetrainedmodels. Thestatesofoperators possibilitiesasamajorsteptowardsthesmartcityofthe
future.
thatincorporatepre-trainedMLmodelsusuallyreachsizes
| of several | gigabytes. |     | Handling | states | of this | magnitude |     |     |     |     |     |     |     |     |
| ---------- | ---------- | --- | -------- | ------ | ------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
REFERENCES
| is challenging |     | for memory-constrained |     |     | IoT | devices. |     |     |     |     |     |     |     |     |
| -------------- | --- | ---------------------- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
Additionally,distributedtrainingofanMLmodelrequires
manysynchronizationmessagesacrossalldevices. Given [1] (2020)Mlflow,https://mlflow.org/.
that typical IoT topologies consist of several thousands [2] (2020)Modeldb,https://github.com/VertaAI/modeldb.
| of edge | devices, | this | becomes | problematic |     | in a setting |     |     |     |     |     |     |     |     |
| ------- | -------- | ---- | ------- | ----------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
[3] “Shotspotter,”https://www.shotspotter.com/,accessed25th
unreliability:
| where network | bandwidth |     | is limited. |     | Third, |     |     | March2020. |     |     |     |     |     |     |
| ------------- | --------- | --- | ----------- | --- | ------ | --- | --- | ---------- | --- | --- | --- | --- | --- | --- |
A foundational problem in the context of streaming in [4] D.J.Abadi,D.Carney,U.Cetintemel,andetal.,“Aurora:
theIoTisalsothewaydataistransmittedtothedifferent
anewmodelandarchitecturefordatastreammanagement,”
| devices. | Applying | existing | cloud-based |     | solutions |     | in a | VLDBJ,2007. |     |     |     |     |     |     |
| -------- | -------- | -------- | ----------- | --- | --------- | --- | ---- | ----------- | --- | --- | --- | --- | --- | --- |
10

S.Zeuch,E.TziritaZacharatou,S.Zhang,X.Chatziliadis,A.Chaudary,B.DelMonte,P.M.Grulich,D.Giouroukis,A.Ziehn,V.Markl:
NebulaStream:ComplexAnalyticsBeyondtheCloud
[5] L.Affetti,A.Margara,andG.Cugola,“Flowdb:Integrating [23] T. S. Darwish and K. A. Bakar, “Fog based intelligent
stream processing and consistent state management,” in transportationbigdataanalyticsintheinternetofvehicles
DEBS,2017. environment: motivations, architecture, challenges, and
[6] A.Ahmed,H.Arkian,D.Battulga,A.J.Fahs,M.Farhadi, criticalissues,”IEEEAccess,2018.
D.Giouroukis,A.Gougeon,F.O.Gutierrez,G.Pierre,P.R. [24] B. Del Monte, S. Zeuch, T. Rabl, and V. Markl, “Rhino:
SouzaJretal.,“Fogcomputingapplications:Taxonomyand Efficient management of very large distributed state for
requirements,”arXiv:1907.11621,2019. streamprocessingengines,”inSIGMOD,2020.
[7] A.Aji,F.Wang,H.Vo,R.Lee,Q.Liu,X.Zhang,andJ.Saltz, [25] A.J.Demers,J.Gehrke,B.Panda,M.Riedewald,V.Sharma,
“Hadoop-gis:Ahighperformancespatialdatawarehousing W. M. White et al., “Cayuga: A general purpose event
systemovermapreduce,”inPVLDB,2013. monitoringsystem.”inCIDR,2007.
[8] T. Akidau, A. Balikov, K. Bekirog˘lu, S. Chernyak, [26] B. Derakhshan, A. R. Mahdiraji, T. Rabl, and V. Markl,
J.Haberman,R.Lax,S.McVeety,D.Mills,P.Nordstrom, “Continuousdeploymentofmachinelearningpipelines.”in
andS.Whittle,“Millwheel:fault-tolerantstreamprocessing EDBT/ICDT,2019.
atinternetscale,”PVLDB,2013. [27] C.Dwork,F.McSherry,K.Nissim,andA.Smith,“Calibrating
[9] Amazon, “Amazon aws greengrass,” 2017, accessed noisetosensitivityinprivatedataanalysis,”inTCC,2006.
December 15, 2019, from https://aws.amazon.com/ [28] A.Eldawy,“SpatialHadoop: Towardsflexibleandscalable
greengrass. spatial processing using MapReduce,” in SIGMOD, PhD
[10] ——, “Aws iot analytics,” 2018, retrieved December 15, Symposium,2014.
2019,fromhttps://aws.amazon.com/iot-analytics. [29] S.Ewen,“DataArtisansStreamingLedgerSerializableACID
[11] A.Arasu, B.Babcock, S.Babu, andetal., “Stream: The TransactionsonStreamingData,https://www.ververica.com/
stanforddatastreammanagementsystem,”inDataStream blog/serializable-acid-transactions-on-streaming-data,”2018.
Management. Springer,2016,pp.317–336. [30] I.Flouris,N.Giatrakos,A.Deligiannakis,M.Garofalakis,
[12] C. Balkesen, N. Tatbul, and M. T. O¨zsu, “Adaptive input M.Kamp,andM.Mock,“Issuesincomplexeventprocessing:
admissionandmanagementforparallelstreamprocessing,” Statusandprospectsinthebigdataera,”JSS,pp.217–236,
inDEBS,2013. 2017.
[13] D. Bandyopadhyay and J. Sen, “Internet of things: [31] Z. Galic´, E. Mesˇkovic´, and D. Osmanovic´, “Distributed
Applications and challenges in technology and processing of big mobility data as spatio-temporal data
standardization,”WPC,vol.58,2011. streams,”Geoinformatica,pp.263–291,2017.
[14] I. Botan, P. M. Fischer, D. Kossmann, and N. Tatbul, [32] S. Gallagher. Ms researchers claim to crack encrypted
“Transactionalstreamprocessing,”inEDBT/ICDT,2012. database with old simple trick. https://arstechnica.com/
[15] S.Brenner,C.Wulf,D.Goltzsche,N.Weichbrodt,M.Lorenz, information-technology/2015/09/ms-researchers-claim-to-
C. Fetzer, P. Pietzuch, and R. Kapitza, “Securekeeper: crack-encrypted-database-with-old-simple-trick/.
confidentialzookeeperusingintelsgx,”inMiddleware,2016. [33] H.Gavriilidis,A.Michalke,L.Mons,S.Zeuch,andV.Markl,
[16] L. Burkhalter, A. Hithnawi, A. Viand, H. Shafagh, and “Scalingapublictransportmonitoringsystemtointernetof
S.Ratnasamy,“Timecrypt:Encrypteddatastreamprocessing thingsinfrastructures.”inEDBT/ICDT,2020,pp.627–630.
atscalewithcryptographicaccesscontrol,”inNSDI,2020. [34] L.Girod,Y.Mei,R.Newton,andetal.,“TheCaseforaSignal-
[17] P. Carbone, S. Ewen, G. Fo´ra, S. Haridi, S. Richter, and OrientedDataStreamManagementSystem,”inCIDR,2007.
K.Tzoumas,“Statemanagementinapacheflink:Consistent [35] P.M.GrulichandF.Nawab,“Collaborativeedgeandcloud
statefuldistributedstreamprocessing,”PVLDB,2017. neural networks for real-time video processing,” PVLDB,
[18] P. Carbone, G. E. Ge´vay, G. Hermann, A. Katsifodimos, 2018.
J.Soto,V.Markl,andS.Haridi,“Large-scaledatastream [36] P.M.Grulich,B.Sebastian,S.Zeuch,J.Traub,J.v.Bleichert,
processingsystems,”inHandbookofBigDataTechnologies. Z.Chen,T.Rabl,andV.Markl,“Grizzly: Efficientstream
Springer,2017. processingthroughadaptivequerycompilation,”inSIGMOD,
[19] P.Carbone,A.Katsifodimos,S.Ewen,V.Markl,S.Haridi, 2020,pp.2487–2503.
andK.Tzoumas,“Apacheflink:Streamandbatchprocessing [37] Y.He,S.Barman,D.Wang,andJ.F.Naughton,“Onthe
inasingleengine,”TCDE,2015. complexityofprivacy-preservingcomplexeventprocessing,”
[20] B. Chandramouli, J. Goldstein, M. Barnett, R. DeLine, inPODS,2011,pp.165–174.
D.Fisher,J.C.Platt,J.F.Terwilliger,andJ.Wernsing,“Trill: [38] M.Hung,“Leadingtheiot,gartnerinsightsonhowtolead
Ahigh-performanceincrementalqueryprocessorfordiverse inaconnectedworld,”GartnerResearch,2017.
analytics,”PVLDB,2014. [39] J.-H. Hwang, M. Balazinska, A. Rasin, U. Cetintemel,
[21] J. Chen, L. Ramaswamy, D. K. Lowenthal, and M.Stonebraker,andS.Zdonik,“High-availabilityalgorithms
S. Kalyanaraman, “Comet: Decentralized complex event for distributed stream processing,” in ICDE, 2005, pp.
detectioninmobiledelaytolerantnetworks,”inMDM,2012. 779–790.
[22] G. Cugola and A. Margara, “Deployment strategies for [40] A.Iyer,L.E.Li,andI.Stoica,“Celliq: Real-timecellular
distributedcomplexeventprocessing,”Computing,2013. networkanalyticsatscale,”inNSDI,2015.
11

OpenJournalofXXX(OJXX),VolumeX,IssueX,20XX
[41] A.P.IyerandI.Stoica,“Ascalabledistributedspatialindex https://www.seagate.com/files/www-content/our-story/
fortheinternet-of-things,”inSoCC,2017. trends/files/idc-seagate-dataage-whitepaper.pdf.
[42] G.Jia,G.Han,A.Li,andJ.Du,“Ssl: Smartstreetlamp [60] N. P. Schultz-Møller, M. Migliavacca, and P. Pietzuch,
basedonfogcomputingforsmartercities,”IEEETII,2018. “Distributedcomplexeventprocessingwithqueryrewriting,”
inDEBS,2009,pp.1–12.
| [43] Y. Kang, | J. Hauswald, |     | C. Gao, | A. Rovinski, |     | T. Mudge, |     |     |     |     |     |     |
| ------------- | ------------ | --- | ------- | ------------ | --- | --------- | --- | --- | --- | --- | --- | --- |
J. Mars, and L. Tang, “Neurosurgeon: Collaborative [61] C.Segarra,R.Delgado-Gonzalo,M.Lemay,P.-L.Aublin,
intelligencebetweenthecloudandmobileedge,”ASPLOS, P. Pietzuch, and V. Schiavoni, “Using trusted execution
pp.615–629,2017. environmentsforsecurestreamprocessingofmedicaldata
-(casestudypaper),”inDisCoTec,2019.
[44] J.Karimov,T.Rabl,andV.Markl,“Astream:Ad-hocshared
streamprocessing,”inSIGMOD,2019,pp.607–622. [62] Z. Shen, V. Kumaran, M. J. Franklin, S. Krishnamurthy,
A.Bhat,M.Kumar,R.Lerche,andK.Macpherson,“Csa:
| [45] N.R.Katsipoulakis, |     | A.Labrinidis, |     | andP.K.Chrysanthis, |     |     |     |     |     |     |     |     |
| ----------------------- | --- | ------------- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
Streamingengineforinternetofthings.”inIEEE,2015,pp.
“Aholisticviewofstreampartitioningcosts,”PVLDB,pp.
39–50.
1286–1297,2017.
|               |     |          |         |       |           |          | [63] W.Shi,J.Cao,Q.Zhang,Y.Li,andL.Xu,“Edgecomputing: |     |     |     |     |     |
| ------------- | --- | -------- | ------- | ----- | --------- | -------- | ----------------------------------------------------- | --- | --- | --- | --- | --- |
| [46] A. Kipf, | H.  | Lang, V. | Pandey, | R. A. | Persa, C. | Anneser, |                                                       |     |     |     |     |     |
Visionandchallenges,”IEEEIoTJournal,2016.
| E. Tzirita | Zacharatou, |     | H. Doraiswamy, |     | P.  | A. Boncz, |     |     |     |     |     |     |
| ---------- | ----------- | --- | -------------- | --- | --- | --------- | --- | --- | --- | --- | --- | --- |
T. Neumann, and A. Kemper, “Adaptive main-memory [64] D. Sidlauskas, S. Chester, E. Tzirita Zacharatou, and
A.Ailamaki,“Improvingspatialdataprocessingbyclipping
| indexing | for | high-performance |     | point-polygon |     | joins.” | in  |     |     |     |     |     |
| -------- | --- | ---------------- | --- | ------------- | --- | ------- | --- | --- | --- | --- | --- | --- |
minimumboundingboxes,”inICDE,2018,pp.425–436.
EDBT/ICDT,2020,pp.347–358.
[47] I. Kolchinsky and A. Schuster, “Join query optimization [65] L.Sweeney,“K-anonymity:Amodelforprotectingprivacy,”
IJUFKS,2002.
| techniques | for | complex | event | processing | applications,” |     |                                                     |     |     |     |     |     |
| ---------- | --- | ------- | ----- | ---------- | -------------- | --- | --------------------------------------------------- | --- | --- | --- | --- | --- |
|            |     |         |       |            |                |     | [66] M.Tang,Y.Yu,Q.M.Malluhi,M.Ouzzani,andW.G.Aref, |     |     |     |     |     |
PVLDB,2018.
“Locationspark:Adistributedin-memorydatamanagement
[48] S.Kulkarni,N.Bhagat,M.Fu,V.Kedigehalli,C.Kellogg,
systemforbigspatialdata,”PVLDB,pp.1565–1568,2016.
S.Mittal,J.M.Patel,K.Ramasamy,andS.Taneja,“Twitter
|        |                                            |     |     |     |     |     | [67] A. Toshniwal, | S.  | Taneja, | A. Shukla, | and et al., | “Storm@ |
| ------ | ------------------------------------------ | --- | --- | --- | --- | --- | ------------------ | --- | ------- | ---------- | ----------- | ------- |
| heron: | Streamprocessingatscale,”inSIGMOD,2015,pp. |     |     |     |     |     |                    |     |         |            |             |         |
twitter,”inSIGMOD,2014.
239–250.
|     |     |     |     |     |     |     | [68] E. Tzirita | Zacharatou, | H.  | Doraiswamy, | and et al., | “GPU |
| --- | --- | --- | --- | --- | --- | --- | --------------- | ----------- | --- | ----------- | ----------- | ---- |
[49] S.R.Madden,M.J.Franklin,J.M.Hellerstein,andW.Hong,
|     |     |     |     |     |     |     | Rasterization | for | Real-Time | Spatial | Aggregation | over |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --------- | ------- | ----------- | ---- |
“Tinydb:anacquisitionalqueryprocessingsystemforsensor
ArbitraryPolygons,”PVLDB,2017.
networks,”TODS,pp.122–173,2005.
|            |          |     |             |     |         |          | [69] M.Vuppalapati,J.Miron,R.Agarwal,andetal.,“Buildingan |     |     |     |     |     |
| ---------- | -------- | --- | ----------- | --- | ------- | -------- | --------------------------------------------------------- | --- | --- | --- | --- | --- |
| [50] A. R. | Mahmood, | A.  | Daghistani, | A.  | M. Aly, | M. Tang, |                                                           |     |     |     |     |     |
elasticqueryengineondisaggregatedstorage,”inNSDI,2020.
| S. Basalamah, |     | S. Prabhakar,   |     | and W. | G. Aref, | “Adaptive   |                                                         |     |     |     |     |     |
| ------------- | --- | --------------- | --- | ------ | -------- | ----------- | ------------------------------------------------------- | --- | --- | --- | --- | --- |
|               |     |                 |     |        |          |             | [70] D.Wang,E.A.Rundensteiner,andR.T.EllisonIII,“Active |     |     |     |     |     |
| processing    | of  | spatial-keyword |     | data   | over a   | distributed |                                                         |     |     |     |     |     |
streamingcluster,”inSIGSPATIAL,2018,pp.219–228. complexeventprocessingovereventstreams,”PVLDB,pp.
634–645,2011.
| [51] J. Meehan, | C.  | Aslantas, | S. Zdonik, | N.  | Tatbul, | and J. Du, |                                                    |     |     |     |     |     |
| --------------- | --- | --------- | ---------- | --- | ------- | ---------- | -------------------------------------------------- | --- | --- | --- | --- | --- |
|                 |     |           |            |     |         |            | [71] D.Xie,F.Li,B.Yao,G.Li,L.Zhou,andM.Guo,“Simba: |     |     |     |     |     |
“Dataingestionfortheconnectedworld.”inCIDR,2017.
|     |     |     |     |     |     |     | Efficient | in-memory | spatial | analytics,” | in Proceedings | of  |
| --- | --- | --- | --- | --- | --- | --- | --------- | --------- | ------- | ----------- | -------------- | --- |
[52] J.Meehan,N.Tatbul,S.Zdonik,C.Aslantas,U.Cetintemel,
the2016InternationalConferenceonManagementofData,
| J. Du, | T. Kraska, | S. Madden, |     | D. Maier, | A. Pavlo | et  | al., |     |     |     |     |     |
| ------ | ---------- | ---------- | --- | --------- | -------- | --- | ---- | --- | --- | --- | --- | --- |
2016,pp.1071–1085.
| “S-store: | streamingmeetstransactionprocessing,”PVLDB, |     |     |     |     |     |                                                    |     |     |     |     |     |
| --------- | ------------------------------------------- | --- | --- | --- | --- | --- | -------------------------------------------------- | --- | --- | --- | --- | --- |
|           |                                             |     |     |     |     |     | [72] W.Yao,C.H.Chu,andZ.Li,“Leveragingcomplexevent |     |     |     |     |     |
pp.2134–2145,2015.
processingforsmarthospitalsusingrfid,”JNCA,2011.
[53] H.Miao,H.Park,M.Jeon,G.Pekhimenko,K.S.McKinley,
|                        |     |     |                          |     |     |     | [73] Y.YaoandJ.Gehrke,“Thecougarapproachtoin-network |     |     |     |     |     |
| ---------------------- | --- | --- | ------------------------ | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- |
| andF.X.Lin,“Streambox: |     |     | Modernstreamprocessingon |     |     |     |                                                      |     |     |     |     |     |
queryprocessinginsensornetworks,”inSIGMOD,2002.
amulticoremachine,”inATC,2017,pp.617–629.
|         |          |            |     |                    |     |      | [74] S.Yi,C.Li,andQ.Li,“Asurveyoffogcomputing:Concepts, |     |     |     |     |     |
| ------- | -------- | ---------- | --- | ------------------ | --- | ---- | ------------------------------------------------------- | --- | --- | --- | --- | --- |
| [54] M. | Naehrig, | K. Lauter, | and | V. Vaikuntanathan, |     | “Can |                                                         |     |     |     |     |     |
applicationsandissues,”inMBD,2015.
homomorphicencryptionbepractical?”inCCSW,2011.
|     |     |     |     |     |     |     | [75] J.Yu,J.Wu,andM.Sarwat,“Geospark:Aclustercomputing |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- |
[55] M.Nikolic,B.Chandramouli,andJ.Goldstein,“Enabling
|     |     |     |     |     |     |     | framework | for | processing | large-scale | spatial | data,” in |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ---------- | ----------- | ------- | --------- |
signalprocessingoverdatastreams,”inSIGMOD,2017.
SIGSPATIAL,2015.
[56] D.O’Keeffe,T.Salonidis,andP.Pietzuch,“Frontier:Resilient [76] M. Zaharia, T. Das, H. Li, S. Shenker, and I. Stoica,
edgeprocessingfortheinternetofthings,”PVLDB,2018.
“Discretizedstreams:anefficientandfault-tolerantmodelfor
[57] H.Park,S.Zhai,L.Lu,andF.X.Lin,“Streambox-tz:secure streamprocessingonlargeclusters,”inHotCloud,2012.
streamanalyticsattheedgewithtrustzone,”inATC,2019. [77] S. Zeuch, A. Chaudhary, B. Monte, H. Gavriilidis,
| [58] R. | A. Popa, | C. M. | Redfield, | N.  | Zeldovich, | and |     |     |     |     |     |     |
| ------- | -------- | ----- | --------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
D.Giouroukis,P.Grulich,S.Breß,J.Traub,andV.Markl,
H.Balakrishnan,“Cryptdb: protectingconfidentialitywith “The nebulastream platform: Data and application
encryptedqueryprocessing,”inSOSP,2011,pp.85–100. managementfortheinternetofthings,”inCIDR,2020.
[59] D. Reinsel, J. Gantz, and J. Rydning, “Data age [78] S. Zeuch, B. D. Monte, J. Karimov, C. Lutz, M. Renz,
2025: The digitization of the world from edge to J.Traub,S.Breß,T.Rabl,andV.Markl,“Analyzingefficient
core,” 2018, accessed December 15, 2019, from streamprocessingonmodernhardware,”PVLDB,2019.
12

S.Zeuch,E.TziritaZacharatou,S.Zhang,X.Chatziliadis,A.Chaudary,B.DelMonte,P.M.Grulich,D.Giouroukis,A.Ziehn,V.Markl:
NebulaStream:ComplexAnalyticsBeyondtheCloud
|                |          |                  |     |            | Xenofon | Chatziliadis | is a Ph.D. |
| -------------- | -------- | ---------------- | --- | ---------- | ------- | ------------ | ---------- |
| [79] H. Zhang, | Y. Diao, | and N. Immerman, | “On | complexity |         |              |            |
and optimization of expensive queries in complex event candidateatDIMAgroup(TUBerlin).
processing,”inSIGMOD,2014. Xenofons’sresearchinterestsinclude
|                |           |              |                       |     | distributed | systems,              | performance |
| -------------- | --------- | ------------ | --------------------- | --- | ----------- | --------------------- | ----------- |
| [80] S. Zhang, | J. He, A. | C. Zhou, and | et al., “Briskstream: |     |             |                       |             |
|                |           |              |                       |     | monitoring, | and IoT environments. |             |
Scalingdatastreamprocessingonshared-memorymulticore
|     |     |     |     |     | He received | his M.Sc. | in Computer |
| --- | --- | --- | --- | --- | ----------- | --------- | ----------- |
architectures,”inSIGMOD,2019.
ScienceatTUBerlinwithafocuson
[81] S.Zhang,H.T.Vo,D.Dahlmeier,andetal.,“Multi-query
machinelearning.
| optimizationforcomplexeventprocessinginsapesp,” |     |     |     | in  |     |     |     |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
ICDE,2017.
|     |     |     |     |     | Ankit Chaudhary | is  | a Ph.D. |
| --- | --- | --- | --- | --- | --------------- | --- | ------- |
[82] S.Zhang,Y.Wu,F.Zhang,andB.He,“Towardsconcurrent
|     |     |     |     |     | candidate | at DIMA | group (TU |
| --- | --- | --- | --- | --- | --------- | ------- | --------- |
statefulstreamprocessingonmulticoreprocessors,”inICDE,
|     |     |     |     |     | Berlin). | Ankit’s research | interests |
| --- | --- | --- | --- | --- | -------- | ---------------- | --------- |
2020,pp.1537–1548.
|     |     |     |     |     | include | distributed systems, | query |
| --- | --- | --- | --- | --- | ------- | -------------------- | ----- |
[83] B.Zhao,N.Q.V.Hung,andM.Weidlich,“Loadshedding optimization, and IoT environments.
forcomplexeventprocessing: Input-basedandstate-based He did his M.Sc. from TU
techniques,”inICDE,2020.
|     |     |     |     |     | Kaiserslautern | with | focus on |
| --- | --- | --- | --- | --- | -------------- | ---- | -------- |
distributedsystemsandB.Tech.inIT
| AUTHORBIOGRAPHIES |     |     |     |     | fromGGSIPUDelhi. |           |            |
| ----------------- | --- | --- | --- | --- | ---------------- | --------- | ---------- |
|                   |     |     |     |     | Bonaventura      | Del Monte | is a Ph.D. |
SteffenZeuchisaSeniorResearcher
candidateatDIMAgroup(TUBerlin).
|     |     | at the DIMA           | group (TU      | Berlin)   |                   |                    |              |
| --- | --- | --------------------- | -------------- | --------- | ----------------- | ------------------ | ------------ |
|     |     |                       |                |           | Bonaventura’s     | research           | interests    |
|     |     | and IAM group         | (DFKI).        | Steffen’s |                   |                    |              |
|     |     |                       |                |           | include efficient | query              | execution on |
|     |     | research interests    | include        | modern    |                   |                    |              |
|     |     |                       |                |           | modern            | hardware, stateful | stream       |
|     |     | hardware, distributed | systems,       | and       |                   |                    |              |
|     |     |                       |                |           | processing,       | and data-intensive |              |
|     |     | IoTenvironments.      | Hehaspublished |           |                   |                    |              |
|     |     |                       |                |           | distributed       | systems.           | He got his   |
researchpapersonqueryoptimization
|     |     |               |            |          | M.Sc. in | Computer Science | from |
| --- | --- | ------------- | ---------- | -------- | -------- | ---------------- | ---- |
|     |     | and execution | as well as | on novel |          |                  |      |
UniversityofSalerno.
systemarchitectures.HedidhisPh.D.
in Computer Science at Humboldt Dimitrios Giouroukis is a Ph.D.
UniversityBerlin.HereceivedaM.Sc.
candidateatDIMAgroup(TUBerlin).
inBusinessInformaticsatHTWBerlin
|     |     |     |     |     | Dimitrios’ | research interests | include |
| --- | --- | --- | --- | --- | ---------- | ------------------ | ------- |
withaspecialtyindatawarehouses. sensor data management, stream
processing,andpost-clouddistributed
EleniTziritaZacharatouisaSenior
systems.HegothisM.Sc.inComputer
|     |     | ResearcheratDIMATUBerlin. |     | Her |     |     |     |
| --- | --- | ------------------------- | --- | --- | --- | --- | --- |
SciencefromAristotleUniversityof
researchinterestsincluderobuststream
Thessaloniki.
processinginmobileIoTenvironments
andspatio-temporaldatamanagement.
ElenireceivedherPhDfromtheE´cole Philipp M. Grulich is a Ph.D.
candidateatDIMAgroup(TUBerlin).
PolytechniqueFe´de´raledeLausanne
in 2019 and a M.Eng. degree in Philipp’s research interests include
ElectricalandComputerEngineering modernhardware,streamprocessing,
fromtheNationalTechnicalUniversity and compiler theory. He received
of Athens in 2013. In 2018 she his M.Sc. in Computer Science at
|     |     |                     |            |      | TU Berlin    | with a focus | on query |
| --- | --- | ------------------- | ---------- | ---- | ------------ | ------------ | -------- |
|     |     | received the        | ACM SIGMOD | best |              |              |          |
|     |     | demonstrationaward. |            |      | compilation. |              |          |
ShuhaoZhangisaSeniorResearcher
at the DIMA group (TU Berlin). Ariane Ziehn is a Ph.D. candidate
Shuhao’s research interests include at the IAM group (DFKI). Ariane’s
modern hardware and stream research interests include distributed
processing.Hehaspublishedresearch systems, complex event processing,
papers on stream processing system andIoTenvironments. Shereceived
design and optimization on novel her M.Sc. in Information Systems
hardware architectures. He did his ManagementatTUBerlinwithafocus
Ph.D.inComputerScienceatNational ondistributedsystemsaswellasdata
|     |     | UniversityofSingapore. |     |     | andsoftwareengineering. |     |     |
| --- | --- | ---------------------- | --- | --- | ----------------------- | --- | --- |
13