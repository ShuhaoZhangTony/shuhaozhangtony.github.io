IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024 5889
|     | CStream: |     |     | Parallel  |             | Data |      | Stream         |         | Compression |     |     |     | on  |
| --- | -------- | --- | --- | --------- | ----------- | ---- | ---- | -------------- | ------- | ----------- | --- | --- | --- | --- |
|     |          |     |     | Multicore |             |      | Edge |                | Devices |             |     |     |     |     |
|     |          |     |     |           | XianzhiZeng |      |      | andShuhaoZhang |         |             |     |     |     |     |
Abstract—IntheburgeoningrealmofInternetofThings(IoT) meetthestricthigh-throughputprocessingrequirements.How-
applicationsonedgedevices,datastreamcompressionhasbecome ever,achievingthisintheresource-constrainedenvironmentof
increasinglypertinent.Theintegrationofaddedcompressionover-
multicoreedgedevicesisanon-trivialtask.Itinvolvesstriking
| head | and | limited hardware | resources | on  | these | devices | calls for |     |     |     |     |     |     |     |
| ---- | --- | ---------------- | --------- | --- | ----- | ------- | --------- | --- | --- | --- | --- | --- | --- | --- |
adelicatebalancebetweenoftenconflictingrequirementssuch
| a nuanced |     | software-hardware |     | co-design. | This | paper introduces |     |     |     |     |     |     |     |     |
| --------- | --- | ----------------- | --- | ---------- | ---- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- |
aslowenergyconsumption[6],highcompressionratio[5],and
CStream,apioneeringframeworkcraftedforparallelizingstream
compression on multicore edge devices. CStream grapples with tolerable information loss [1]. While data stream compression
thedistinctchallengesofdeliveringahighcompressionratio,high hasbeenwellstudiedintheliterature[7],thespecificcontextof
| throughput, |     | low latency, | and low | energy | consumption. |     | Notably, |     |     |     |     |     |     |     |
| ----------- | --- | ------------ | ------- | ------ | ------------ | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
multicoreedgedevicesaddsanewdimensiontoit.Inparticular,
CStreamdistinguishesitselfbyaccommodatinganarrayofstream
noneprovideacomprehensiveanswertoourcentralquestion:
compressionalgorithms,avarietyofhardwarearchitecturesand
configurations,andaninnovativesetofparallelizationstrategies,
Howcanstreamcompressionbeoptimallyimplementedonmulticore
| some | of which | are proposed | herein | for | the first | time. | Our eval- |     |     |     |     |     |     |     |
| ---- | -------- | ------------ | ------ | --- | --------- | ----- | --------- | --- | --- | --- | --- | --- | --- | --- |
edgedeviceswithresourceconstraints?
| uationshowcases |     | theefficacy | ofathoughtfulco-designinvolving |     |     |     |     |     |     |     |     |     |     |     |
| --------------- | --- | ----------- | ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
alossycompressionalgorithm,asymmetricmulticoreprocessors,
ThispaperpresentsCStream,aframeworkforparallelizing
andournovel,hardware-consciousparallelizationstrategies.This
approachachievesa2.8×compressionratiowithonlymarginal
streamcompressiononmulticoreedgedevices.CStreamex-
4.3×
information loss, throughput, 65% latency reduction and plores the design space, balancing compression ratios, speeds,
89%energyconsumptionreduction,comparedtodesignslacking and energy consumption. It employs a software-hardware co-
suchstrategicintegration.
|     |     |     |     |     |     |     |     | design | to improve | stream | compression, |     | referencing | [8], [9]. |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ---------- | ------ | ------------ | --- | ----------- | --------- |
IndexTerms—Asymmetrichardware,edgecomputingandIoT, CStream supports various stream compression algorithms,
streamcompression.
|     |     |     |     |     |     |     |     | fromtraditionallosslesstoadvanced |     |     |     | lossymethods,including |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | ---------------------- | --- | --- |
stateful,stateless,andbyte-alignedoptions.Itadaptstohardware
differences,optimizingformulticoreprocessors,RISCorCISC
|     |     | I.  | INTRODUCTION |     |     |     |     |                |     |             |              |      |         |           |
| --- | --- | --- | ------------ | --- | --- | --- | --- | -------------- | --- | ----------- | ------------ | ---- | ------- | --------- |
|     |     |     |              |     |     |     |     | architectures, |     | and various | core counts. | This | ensures | efficient |
DATAstreamcompression,hasbecomeapivotalresearch
|     |     |     |     |     |     |     |     | use | of hardware | resources, | enhancing | speed | while | reducing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ---------- | --------- | ----- | ----- | -------- |
problem [1], [2]. Fig. 1 illustrates an IoT use case [3] CStream
|     |     |     |     |     |     |     |     | energy | use. | Furthermore, |     | introduces | parallelization |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ---- | ------------ | --- | ---------- | --------------- | --- |
whereinstreamcompressioninmulticoreedgedevicesishighly
|     |     |     |     |     |     |     |     | strategies, | some | new, | covering execution, |     | state | management, |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ---- | ---- | ------------------- | --- | ----- | ----------- |
desirable.Real-timedatastreams(e.g.,toxicgas,temperature) and scheduling. These strategies allow for effective workload
| from   | a multitude | of IoT    | sensors | in hazardous |     | areas are | inces-   |              |     |               |           |            |     |              |
| ------ | ----------- | --------- | ------- | ------------ | --- | --------- | -------- | ------------ | --- | ------------- | --------- | ---------- | --- | ------------ |
|        |             |           |         |              |     |           |          | distribution |     | across cores, | improving | throughput |     | and lowering |
| santly | gathered    | by patrol | drones, | functioning  |     | as edge   | devices, |              |     |               |           |            |     |              |
latency.Ourprimarycontributionsaresummarizedasfollows:
(cid:2)
withlimitedmemoryandbatterypower.Toreducetransmission First,CStreamoffersanextensivesetofstreamcompres-
overhead,thesepatroldronesactasmulticoreedgedevicesthat
|     |     |     |     |     |     |     |     |     | sion algorithms, |     | with a particular | focus | on  | lossy stream |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ----------------- | ----- | --- | ------------ |
compress the input streams [4] before passing them to down- compressionalgorithms.Thesealgorithmsstrikeabalance
streamonlineIoTanalytictasks,suchasonlineaggregation[2],
betweenhighcompressionratios(rangingfrom2.0to8.5)
andonlinemachinelearning[5]inthecloud.
|     |     |     |     |     |     |     |     |     | and minimal | information | loss | (less | than 5%), | enabling |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ----------- | ---- | ----- | --------- | -------- |
Parallelizingstreamcompressiononmulticoreedgedevices, CStream to cater to a wide spectrum of application re-
| such | as the | wireless patrol | drones | in  | Fig. 1, | is mandatory |     | to  |     |     |     |     |     |     |
| ---- | ------ | --------------- | ------ | --- | ------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
quirements.
(cid:2)
Second,CStreamisengineeredtooperateefficientlyon
Manuscriptreceived28June2023;revised2April2024;accepted6April asymmetric multicore processors with RISC architecture
2024.Dateofpublication19April2024;dateofcurrentversion27Septem- and64-bitwordlength.Thisresultsinimpressiveperfor-
ber 2024. This work was supported by the MoE AcRF Tier 2 under Grant mance improvements, specifically, up to 59% reduction
MOE-T2EP20122-0010,inpartbyNationalResearchFoundation,Singapore
andInfocommMediaDevelopmentAuthorityunderitsFutureCommunications in processing time and up to 69% reduction in energy
ResearchandDevelopmentProgrammeunderGrantFCP-SUTD-RG-2022-005, consumptionwhencomparedtotraditionalmulticorepro-
andinpartbyNTUunderGrant023452-00001.Recommendedforacceptance
| byK.Zheng.(Correspondingauthor:ShuhaoZhang.) |     |     |     |     |     |     |     | (cid:2) | cessors. |     |     |     |     |     |
| -------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ------- | -------- | --- | --- | --- | --- | --- |
XianzhiZengiswiththeSingaporeUniversityofTechnologyandDesign,, Third, CStream implements a range of hardware-
Singapore487372(e-mail:xianzhi_xianzhi@mymail.sutd.edu.sg). conscious parallelization strategies. To begin with, it in-
| Shuhao | Zhang | is with the | Nanyang | Technological | University, |     | Singapore |     |            |             |                |     |     |               |
| ------ | ----- | ----------- | ------- | ------------- | ----------- | --- | --------- | --- | ---------- | ----------- | -------------- | --- | --- | ------------- |
|        |       |             |         |               |             |     |           |     | corporates | cache-aware | micro-batching |     | of  | tuples, which |
639798(e-mail:shuhao.zhang@ntu.edu.sg).
DigitalObjectIdentifier10.1109/TKDE.2024.3386862 significantlyimprovesthroughputbyupto11times.Next,
1041-4347©2024IEEE.Personaluseispermitted,butrepublication/redistributionrequiresIEEEpermission.
Seehttps://www.ieee.org/publications/rights/index.htmlformoreinformation.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

5890 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
A. OverviewofStreamCompression
|     |     |     |     |     |     |     | Inourdefinition,astreamtuple,denotedasx |     |     |     |     |     | =v,consists |     |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- | ----------- | --- |
t
|     |     |     |     |     |     |     | of an arrival                                       | timestamp |             | t to    | the processing |             | system | (e.g., a |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | --------- | ----------- | ------- | -------------- | ----------- | ------ | -------- |
|     |     |     |     |     |     |     | compressor),                                        | and       | v, the      | content | to be          | compressed. | We     | define   |
|     |     |     |     |     |     |     | alistoftupleschronologicallyarrivingatthesystemasan |           |             |         |                |             |        | input    |
|     |     |     |     |     |     |     | stream. Stream                                      |           | compression |         | essentially    | performs    | the    | task of  |
continuouslycompressingtheinputstreamintoanoutputstream
withfewerdatafootprints.Todescribetherelativesizebetween
theloaded(i.e.,input)andcompressed(i.e.,output)streaming
ratio=
|     |     |     |     |     |     |     | data, we | define | compression |     | ratio as | compression |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------ | ----------- | --- | -------- | ----------- | --- | --- |
Fig.1. Real-timedatagatheringconductedbyapatroldroneinenvironments
|                       |     |     |     |     |     |     | loadeddatasize     |             | .   |           |       |       |            |       |
| --------------------- | --- | --- | --- | --- | --- | --- | ------------------ | ----------- | --- | --------- | ----- | ----- | ---------- | ----- |
| inaccessibletohumans. |     |     |     |     |     |     | compresseddatasize |             |     |           |       |       |            |       |
|                       |     |     |     |     |     |     | Stream             | compression |     | possesses | three | major | properties | stem- |
intermsofstatemanagement,itoptsforprivatedictionaries mingfromthenatureofthecontinuouslyarrivingdatastream.
foreachthreadinsteadofasharedstate.Thisoptimization First, the stream is incremental, meaning that compression on
significantly reduces energy consumption and enhances thecurrenttuplex (i.e.,thetuplearrivingmostrecentlyattime
τ
throughput without adversely affecting the compression τ) can rely on either 1) itself or 2) the past tuples (i.e., those
ratio. arriving earlier than the current tuple with timestamp t<τ).
(cid:2)
CStream
Lastly, adopts asymmetry-aware workload However,ithasnoreferencetothefuturetupleswhichhaven’t
scheduling[4].Thisnotonlyreducesenergyconsumption arrivedyetwithtimestampt>τ.Second,thestreamisinfinite.
by about 50% but also optimizes resource utilization by Therefore,theproperutilizationofcacheandmemorybecomes
leveragingtheuniquecapabilitiesofdifferentcores.These crucial. Third, the stream is characterized by a large volume
strategies, collectively, make CStream an efficient and andhighrate,necessitatinghigh-throughputcompression.These
effective tool for stream compression on heterogeneous distinctpropertiessetstreamcompressionapartfromdatabase
multi-coresystems. compression [13], time series compression [14], and file com-
IndemonstratingtheefficacyofCStream,weconducteda pression [15], where all data is ready before conducting the
| comprehensiveevaluationwithfivereal-worldandonesynthetic |     |     |     |     |     |     | compression. |     |     |     |     |     |     |     |
| -------------------------------------------------------- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
datasets,featuringdiverseworkloadcharacteristics.Ourresults Notallcompressionmethodsarefitfortheuniquedemands
confirmCStream’ssuperiorperformanceovertraditionalap-
|     |     |     |     |     |     |     | of stream | data–incremental, |     | infinite, |     | and high-volume. |     | For in- |
| --- | --- | --- | --- | --- | --- | --- | --------- | ----------------- | --- | --------- | --- | ---------------- | --- | ------- |
proaches, demonstrating its effectiveness in the challenging stance, LZ77/78 algorithms [16], despite their efficiency, fall
environment of multicore edge devices (e.g., RK3399 [10], shortinstreamcompressionduetotheirneedforfuturedataand
H2+ [11], and Z8350 [12]). Our observations underscore the highprocessingload.WefocusonalgorithmslikeLEB128and
valueofthoughtfulco-designinachievingoptimalstreamcom- ADPCM,whicharenotablefortheirlowprocessingneedsand
| pression | on edge | devices. | We highlight | the | potential | of lossy |     |     |     |     |     |     |     |     |
| -------- | ------- | -------- | ------------ | --- | --------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
versatilityacrossdatatypes,frommediastreamstosensordata.
stream compression algorithms, asymmetric multicore proces- Thisselectionextendstotechniquesoriginatingfromspecialized
sors, and hardware-conscious parallelization strategies. These areas–mediastreams[17],filesystems[18],andsensorcommu-
strategicintegrationsleadtonotableimprovementsinthecom- nications [14], [19]–proven effective for stream compression.
pression ratio, throughput, and energy efficiency. With these Ourstudyevaluatesacuratedsetofalgorithms(SectionIII-A),
contributions, we envision CStream to be an indispensable includingLEB128-NUQ,ADPCM,amongothers,selectedfor
toolforresearchersandpractitionersaimingtoachieveefficient theirabilitytocompressdatastreamsefficiently,addressingthe
streamcompression. criticalneedforhighthroughputandintegrity.
Organization:Thepaperisstructuredasfollows:SectionII
providesanoverviewofstreamcompressionandthechallenges B. StreamCompressionattheEdge
ofimplementingitattheedge.SectionIIIexplorestheco-design
|     |     |     |     |     |     |     | The emergence |     | of IoT | has | led to | an explosion | in data | col- |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------ | --- | ------ | ------------ | ------- | ---- |
aspectsofstreamcompression,detailingCStream’sarchitec-
|     |     |     |     |     |     |     | lection, storage, |     | and processing |     | demand | at the | edge. Here, | we  |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | -------------- | --- | ------ | ------ | ----------- | --- |
tureandimplementation.SectionIVoutlinesthemethodology
forevaluatingCStream.SectionVpresentstheresultsofour briefly introduce the data properties and performance demand
ofstreamcompressiononedges.
experimentalevaluation,focusingonCStream’sperformance.
|         |            |         |       |         |     |         | IoT Data: | IoT, | being | a common |     | application | scenario | for |
| ------- | ---------- | ------- | ----- | ------- | --- | ------- | --------- | ---- | ----- | -------- | --- | ----------- | -------- | --- |
| Section | VI reviews | related | work, | showing | how | CStream |           |      |       |          |     |             |          |     |
edgecomputing,producesdiversedatastreamsattheedge[6],
| progresses    | beyond | existing | approaches | in  | stream    | compression |           |           |     |       |              |       |             |     |
| ------------- | ------ | -------- | ---------- | --- | --------- | ----------- | --------- | --------- | --- | ----- | ------------ | ----- | ----------- | --- |
|               |        |          |            |     |           |             | [20]. The | source(s) | of  | these | data streams | could | be singular |     |
| for multicore | edge   | devices. | Section    | VII | concludes | the paper,  |           |           |     |       |              |       |             |     |
summarizing CStream’s contributions and suggesting future (e.g., an ECG sensor [21]) or multiple (e.g., distributed game
|     |     |     |     |     |     |     | servers [22]). | Additionally, |     | the | tuple | content | may be | a plain |
| --- | --- | --- | --- | --- | --- | --- | -------------- | ------------- | --- | --- | ----- | ------- | ------ | ------- |
researchdirections.
|     |     |     |     |     |     |     | value (e.g., | unsigned | integer |     | [21]), binary | structured | (e.g., | the |
| --- | --- | --- | --- | --- | --- | --- | ------------ | -------- | ------- | --- | ------------- | ---------- | ------ | --- |
<key,value>pair[23]),ortextualstructured(e.g.,inXML
|     |     |     | II. BACKGROUND |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
format[24]).Thearrivalpatternandcompressibilityofthedata
In this section, we introduce the basic concepts of stream stream can also greatly vary. For instance, an anti-Covid19
compressionattheedge. trackingsystem[25]atamallmaygeneratedatastreamsmore
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

ZENGANDZHANG:CSTREAM:PARALLELDATASTREAMCOMPRESSIONONMULTICOREEDGEDEVICES 5891
densely during peak hours. Due to this versatility, efficient TABLEI
streamcompressionishighlycontext-dependent. SUMMARYOFSTUDIEDCOMPRESSIONALGORITHMS
PerformanceDemand:Giventhe13V’schallenges[8]ofIoT,
| stream compression |     | at the | edge | needs | to meet | several | critical |     |     |     |     |     |     |     |     |
| ------------------ | --- | ------ | ---- | ----- | ------- | ------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
demands: (cid:2)
Highcompressionratio:Reducingthedatafootprintinthe
outputstreamisakeyreasonforusingstreamcompression
attheedge.Withthedatageneratedattheedgebeingnearly
infiniteandgrowingtoZBlevelperyearrecently[26],and
consideringthelimitedmemorycapacityandcommunica-
| tion | bandwidth | [6] | on edge | devices, | a high | compression |     |     |     |     |     |     |     |     |     |
| ---- | --------- | --- | ------- | -------- | ------ | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ratiobecomesnecessary.
(cid:2)
| High       | throughput: | High      | throughput  |        | is desirable |       | in stream |     |     |     |     |     |     |     |     |
| ---------- | ----------- | --------- | ----------- | ------ | ------------ | ----- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
| analytics, | not         | only      | at the data | center | [1],         | [27], | [28], but |     |     |     |     |     |     |     |     |
| also       | at the      | edge. The | high-rate   | data   | streams      | at    | the edge, |     |     |     |     |     |     |     |     |
collected from massive device links [6], [29], necessitate IoTdatatypesandoptimizescompressibilitywhileminimizing
thecapabilitytocompressasmuchdataaspossiblewithin informationloss.Compressionalgorithmsplayasignificantrole
agivenunitoftime. in the historical landscape of data processing, with numerous
(cid:2)
Low energy consumption: Energy budget is particularly variations proposed since the 1950s [34]. These algorithms
constrainedattheedge,andthedevices,oftenfarfroma typicallytargetimprovementsintheoreticalcompressibilityor
stableandconstantpowersupply,areexpectedtofunction reductions in compression overhead [35], [36]. In developing
aslongaspossible[30].Thus,energyconsumptionshould CStream, we selected a variety of compression algorithms
(cid:2) beminimized. (detailedinTableI)tomeetthevariedneeds.Thesealgorithms
Low latency: In many IoT applications, it’s crucial to are well-suited for edge environments, where computational
processdataandmakedecisionsinrealtime.Hence,low- resources are limited. LEB128 is chosen for its simplicity and
latencystreamcompressionisimportanttoensuretimely efficiency,especiallysuitableforstreamingdataduetoitsbyte-
responseanddecision-makingattheedge. aligned and stateless nature. Tcomp32, a variant of LEB128
s1,
Meetingthesedemandssimultaneouslyisachallengingtask. with a unique encoding format in Algorithm 1’s provides
For instance, increasing parallelism and allocating more pro- flexibilitywithbyte-unalignedoutputs.Additionally,algorithms
cessor cores can achieve higher throughput, but this approach like ADPCM and PLA offer lossy compression with minimal
will also increase energy consumption. Therefore, this study data loss, vital for achieving higher compression ratios. Each
aimstorevealthecomplexrelationshipsbetweencompression algorithmcontributesdistinctqualities,suchasstatefulness,byte
alignment,andfidelity,enablingCStreamtoaccommodatea
| ratio, throughput, |     | energy | consumption, |     | and latency | of  | stream |     |     |     |     |     |     |     |     |
| ------------------ | --- | ------ | ------------ | --- | ----------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
compression at the edge. We strive to offer comprehensive broadrangeofdatatypesandcompressionrequirements.
guidanceforachievingsatisfyingtrade-offsamongthesefactors 1) Fidelity: Oneofthefundamentaldistinctionsamongcom-
andalsoexplorepotentialoptimalapproaches. pression algorithms is their fidelity: the degree to which the
originaldatacanbereconstructedfromcompresseddata.
LosslessCompression:Losslesscompressionguaranteesex-
III. CSTREAM:SOFTWARE-HARDWARECO-DESIGNOF
STREAMCOMPRESSION actoriginaldatareconstruction.CStreamcompactsdataloss-
|             |     |            |            |     |     |                |     | lessly within | Shannon’s |     | entropy | theoretical |     | limits | [36]. One |
| ----------- | --- | ---------- | ---------- | --- | --- | -------------- | --- | ------------- | --------- | --- | ------- | ----------- | --- | ------ | --------- |
| Recognizing |     | the unique | challenges |     | in  | edge computing |     |               |           |     |         |             |     |        |           |
Tcomp32
|               |     |           |     |          |     |               |     | example  | is the   |         | algorithm  |     | [32] used | in CStream’s |       |
| ------------- | --- | --------- | --- | -------- | --- | ------------- | --- | -------- | -------- | ------- | ---------- | --- | --------- | ------------ | ----- |
| environments, | we  | introduce |     | CStream, | a   | comprehensive |     |          |          |         |            |     |           |              |       |
|               |     |           |     |          |     |               |     | lossless | mode. It | employs | a lossless |     | stream    | compression  | tech- |
software-hardwareco-designedstreamcompressionframework.
niquethatsuppressesleadingzeros[32],aformofbit-levelnull
| CStream | stands | out by | accommodating |     | an  | array of | stream |     |     |     |     |     |     |     |     |
| ------- | ------ | ------ | ------------- | --- | --- | -------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
suppression[17],anditscompressibilitylimitalignswithShan-
compressionalgorithms,avarietyofhardwarearchitecturesand
non’sentropy.Inthisway,CStreampreservestheaccuracyand
configurations,andaninnovativesetofparallelizationstrategies.
fidelityoftheoriginaldataevenundercompression.
| Furthermore, | it  | presents | novel | concepts, | such | as asymmetry- |     |       |              |       |             |     |         |          |     |
| ------------ | --- | -------- | ----- | --------- | ---- | ------------- | --- | ----- | ------------ | ----- | ----------- | --- | ------- | -------- | --- |
|              |     |          |       |           |      |               |     | Lossy | Compression: | Lossy | compression |     | reduces | fidelity | for |
awarescheduling,forthefirsttime.Byleveragingthefeatures
|     |     |     |     |     |     |     |     | increased | compression |     | ratios. | CStream | discards | non-critical |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ----------- | --- | ------- | ------- | -------- | ------------ | --- |
ofanadvancedstatefulcompressionalgorithmandtheinherent
|                 |             |            |             |             |            |             |          | data, with       | compression |           | limits    | tied to     | the chosen  | fidelity     | level.   |
| --------------- | ----------- | ---------- | ----------- | ----------- | ---------- | ----------- | -------- | ---------------- | ----------- | --------- | --------- | ----------- | ----------- | ------------ | -------- |
| characteristics | of          | asymmetric | multicore   |             | platforms, | CStream     |          |                  |             |           |           |             |             |              |          |
|                 |             |            |             |             |            |             |          | For example,     | using       | 8-bit     | unaligned |             | non-uniform | quantization |          |
| efficiently     | handles     | diverse    | data        | types while | meeting    |             | hardware |                  |             |           |           |             |             |              |          |
|                 |             |            |             |             |            |             |          | (UANUQ[31],[32]) |             | yields    | higher    | compression |             | butmore      | data     |
| resource        | constraints | and        | maintaining |             | energy     | efficiency. | This     |                  |             |           |           |             |             |              |          |
|                 |             |            |             |             |            |             |          | loss than        | a 12-bit    | approach. | CStream’s |             | lossy       | mode         | balances |
sectionelaboratesonthedesignandcomponentsofCStream.
|     |     |     |     |     |     |     |     | compression | and | fidelity, | meeting | diverse | application |     | needs at |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --------- | ------- | ------- | ----------- | --- | -------- |
theedge.
A. VersatilityofCompressionAlgorithms
|     |     |     |     |     |     |     |     | 2) StateUtilization: |     |     | Stateutilization,whichdetermineshow |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | ----------------------------------- | --- | --- | --- | --- |
TheheartofCStreamliesinitssupportforawidevariety
acompressionalgorithmuseshistoricalinformation,isanother
of compression algorithms. It provides versatility to diverse critical dimension in the design of CStream. We divide it
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

5892 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
Algorithm1:LEB128Algorithm. Algorithm2:CStream’sStatefulCompressionMode.
Algorithm3:Delta-LEB128Algorithm.
intostatelessandstatefulcompressionmodes,eachwithunique
advantagesandbest-usescenarios.
StatelessCompression:Instatelesscompression,CStream
| operates     | on each      | data | item or tuple        | independently | without     |        |     |     |     |     |     |     |     |
| ------------ | ------------ | ---- | -------------------- | ------------- | ----------- | ------ | --- | --- | --- | --- | --- | --- | --- |
| reference    | to any       | past | tuples. It typically | involves      | three       | steps. |     |     |     |     |     |     |     |
| (1) load     | the tuple(s) |      | from inData.         | (2) transform | and find    | the    |     |     |     |     |     |     |     |
| compressible | parts.       | (3)  | output compressed    | data          | to outData. |        |     |     |     |     |     |     |     |
Thisapproachessentiallyreplicatesasetofoperationsforeach
tuple,requiringnostatemanagement.Thisisparticularlybene-
ficialinscenarioswheretherelationshipsbetweenconsecutive
tuplesareinsignificantorwhenreducingprocessingoverheadis
essential.Asaconcreteexampleofstatelesscompressionalgo-
rithm,weshowthedetailedimplementationofAndroid-Dex’s
LEB128[18]inAlgorithm1. As a concrete example of stateful compression, we add the
| Stateful | Compression: |     | In contrast, | stateful | compression | in  |                |        |             |     |           |           |        |
| -------- | ------------ | --- | ------------ | -------- | ----------- | --- | -------------- | ------ | ----------- | --- | --------- | --------- | ------ |
|          |              |     |              |          |             |     | delta-encoding | (i.e., | value-based |     | state) to | Algorithm | 1, and |
CStream uses a maintained state to boost compressibility. demonstratetheDelta−LEB128inAlgorithm3.
| While the | stateful | mode | often provides | superior | compression |     |         |            |     |           |          |     |            |
| --------- | -------- | ---- | -------------- | -------- | ----------- | --- | ------- | ---------- | --- | --------- | -------- | --- | ---------- |
|           |          |      |                |          |             |     | 3) Byte | Alignment: | The | alignment | strategy | of  | a compres- |
ratios,itincursadditionaloverheadduetostatemaintenance.Al- sion algorithm, specifically whether it is byte-aligned or not,
gorithm2illustratesthefive-stepprocedureusedinCStream’s greatly impacts both compressibility and computational over-
statefulcompressionmode.
head.CStreamoffersbothbyte-alignedandnon-byte-aligned
During CStream’s development, we explored three preva- modes to accommodate various computational environments
lenttypesofstateusageinstreamcompression:
andusecases.
| Value-based |     | state |     |     |     |     |     |     |     |     |     |     |     |
| ----------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
1) is the simplest state type, requiring Byte-AlignedCompression:Inbyte-alignedmode,CStream
onlyupdatesandrecordsofthe“lastcompressed”value. alignsdataencodingwithbyteboundaries,astrategysimilarto
CStreamemploysthisstateinscenarioswherecompu- theLEB128approach[18].Thismodecapitalizesonthehard-
tational efficiency is of utmost importance. Techniques warecharacteristicsofmodernprocessorsthatmanageregisters
like delta encoding [1], [37] and run-length encoding andmemoriesinunitsofbytes.Despitethis,atrade-offexistsas
| (RLE) | [17] | that | are considered | “lightweight” | for | both |     |     |     |     |     |     |     |
| ----- | ---- | ---- | -------------- | ------------- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
theoutputcodelengthmustbeanintegermultipleofabyte(i.e.,
stream and database compression [1], [17], serve as in- 8bits),potentiallyleadingtosomewasteofbits(e.g.,223872b
spirationforthisstatetype.
canbewastedforabatchof7.4Megabits).
2) Dictionary-basedstate,althoughrequiringmorememory, Non-Byte-Aligned Compression: Non-byte-aligned mode in
can greatly enhance compression ratios. A dictionary- CStream works to mitigate bit-level waste. However, this
| based | state | maintains | a collection | of previously | encoun- |     |     |     |     |     |     |     |     |
| ----- | ----- | --------- | ------------ | ------------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
comesattheexpenseofadditionalcomputationaloverheaddue
tered“lastcompressed”values.CStreamleveragesthis to the need for more logical and bit-shift operations, such as
typeofstatetooptimizecompressionratioswhenmemory
|     |     |     |     |     |     |     | AND/OR. | Because | the minimal | unit | of output | code | length is |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------- | ----------- | ---- | --------- | ---- | --------- |
resources permit. By ensuring that our dictionary-based one bit instead of one byte, appending and extracting data op-
stateissizedtofitwithintheL1cache[33],wecansig- erations mayrequire extracomputational instructions.Despite
nificantlyspeeduptheprocessofsearchingandmatching
|     |     |     |     |     |     |     | the increased | overhead, |     | this mode | can significantly |     | increase |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --------- | --- | --------- | ----------------- | --- | -------- |
dictionaryentrieswithincomingdata. the compression ratio in specific scenarios, thereby providing
3) Model-basedstateapproximatesdatausingamodelwith avaluableoptionintheCStreamframework.
several parameters. This state type provides high com- 4) CompressionImplementation: Ourimplementationstrat-
pression ratios when the data stream closely aligns with egy for CStream is grounded in a step-by-step refinement
| a   | certain | model. | CStream | uses this state | type for | such |                |     |      |             |     |              |        |
| --- | ------- | ------ | ------- | --------------- | -------- | ---- | -------------- | --- | ---- | ----------- | --- | ------------ | ------ |
|     |         |        |         |                 |          |      | process, which | not | only | underscores | the | adaptability | of the |
datastreams.Thepiece-wiselinearapproximation(PLA) frameworkbutalsodemonstratesitspotentialforintegratinga
techniquehasbeenparticularlyeffectiveforcompressing
broadspectrumofcompressionalgorithms.Thisincrementalap-
sensor-generatedtimeseries[14],[19].
proach,depictedinFig.2,allowsforanuancedanalysisofeach
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

ZENGANDZHANG:CSTREAM:PARALLELDATASTREAMCOMPRESSIONONMULTICOREEDGEDEVICES 5893
TABLEII
MULTICOREEDGEPROCESSORSSTUDIED
intothechoicesofarchitectureandInstructionSetArchitecture
(ISA),andextendsthediscussiontotheutilizationandregula-
Fig.2. Incrementalrelationshipamongalgorithms. tionofhardwareresources.Theexaminedhardwarearedetailed
inTableII.
1) Processor Architecture. Symmetric and Asymmetric: In
algorithm’simpact,fosteringacomprehensiveunderstandingof
thecontextofmulticoreprocessors,thearchitecturaldesigncan
theirindividualandcollectivecontributionstotheframework.
bebroadlybifurcatedintosymmetricandasymmetricmodels.
WebeginwiththeimplementationoftheLEB128algorithm,
Symmetric Architecture: Symmetric multicore processors
mirroringitsuseinAndroid-Dex[18].Thisfoundationalstate-
(SMPs)arenotexclusivetocenterserversbutareequallyviable
less and byte-aligned stream compression algorithm sets the
for edge devices. For instance, the UP board platform [38]
stage for subsequent adaptations and enhancements. Building
supported by CStream employs a 4-core SMP Z8350 [12].
onthis,weevolveLEB128intoTcomp32bysimplifyingElias
The primary distinction between the SMPs used at the edge
encoding[32],thusaccommodatingbyte-unalignedoutput.This
andatthecenterliesintheirenergyefficiency:eachcoreinan
transformationmarksourframework’sinitialforayintooptimiz-
edgeSMPisgenerallymoreenergy-optimizedandlesspowerful
ing compression techniques for more diverse data structures.
than its center counterpart. CStream leverages the inherent
Furtherdiversifyingourapproach,weintegratelossycompres-
simplicityandunifiednatureoftheSMParchitectureattheedge
sionthroughLEB128−NUQ,achievedbyalteringLEB128’s
forstraightforwardparallelexecution,facilitatingthetransferof
encodingtonon-uniformquantization[31].Thisextensionpaves
existingoptimizationsfromcloudSMPs[39],[40].
the way for the UANUQ variant, enhancing our framework’s
Asymmetric Architecture: Aiming for a balanced trade-off
capabilitytohandlebyte-unalignedoutputefficiently.
betweenperformanceandenergyefficiency,asymmetricarchi-
In addition to these stateless modifications, we enrich
tectures offer a compelling alternative. By featuring various
LEB128 and Tcomp32 with stateful compression features.
typesofexecutionunitsonasingleprocessor,thesearchitectures
Tdic32 employs a LZ4-like hash table [33], utilizing a
open up new avenues for optimization in stream compression.
dictionary-basedstatefortrackingandcompressingdata,while
This work emphasizes asymmetric architectures within single
Delta-LEB128 calculates a ‘delta’ state [1], [37], represent-
ISA,knownasasymmetricmulticoreprocessors(AMPs)[41].
ing the difference between consecutive values. This variation
However,itacknowledgesthepotentialofotherformsofasym-
is indicative of our framework’s flexibility in accommodating
metry,suchasedgeCPU+GPU[42],[43],CPU+DSP[44],and
both dictionary and value-based states. Moreover, we explore
CPU+FPGA[45],aspromisingareasforfutureexploration.
model-based stateful compression through the integration of
2) Instruction Set Architecture: CStream’s flexibility
PLA[14],[19],whichutilizespiecewiselinearapproximation,
shinesthroughitssupportforavarietyofISAs.
further expanding the scope of CStream’s capabilities. The
32-bitvs.64-bit:While32-bitprocessorsmaintainafoothold
framework’sadaptabilityisfurtherexemplifiedintheimplemen-
in the edge domain due to their long-standing development
tation of Adaptive Differential Pulse-Code Modulation (AD-
ecosystem and lower cost, 64-bit processors are increasingly
PCM). Here, we apply lossy non-uniform quantization [31] to
gainingtractionduetotheirenhancedmemoryaddressingeffi-
the‘delta’stateofDelta-LEB128,transitioningfromlosslessto
ciencyandspeed.CStreamextendsitssupporttobothvariants,
lossycompression.Thismethod,alongwithitsbyte-unaligned
facilitating a balanced comparison within the realm of stream
variantUAADPCM,highlightsCStream’scapacitytoincor-
compression.
porate and optimize a wide array of compression techniques,
CISCvs.RISC:Thetrade-offbetweentheflexibilityofcom-
demonstrating its suitability for diverse IoT edge computing
plex(CISC)andtheefficiencyofreduced(RISC)instructionset
environments.
architectures is dependent on specific applications. CStream
In essence, the iterative development of these algorithms in
explores this dynamic in the context of stream compression.
ourCStreamshowcasesourdedicationtoaflexibleframework.
It recognizes the growing popularity of RISC architectures,
It also sets the foundation for future integration of advanced
especiallyARMprocessors,foredgedevices[30].
compressionmethods,addressingtheevolvingrequirementsof
3) Energy-EfficientResourceManagement: Onceaspecific
IoTedgecomputing.
architectureandISAhavebeenselected,CStreamprovidesthe
meanstofinelytunehardwareresources,therebyenhancingthe
B. AccommodatingtheMulticoreEdgeLandscape
balancebetweenprocessingtimeandenergyconsumption.
Thissectiondiscussesthefundamentalaspectsofthemulti- Frequency Regulation: The processor’s clock frequency di-
coreedgehardwarethatinfluenceCStream’simplementation, rectly influences its performance and power consumption. By
making it conducive to various edge environments. It delves executingmoreinstructionsperunitoftime,ahigherfrequency
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore. Restrictions apply.

5894 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
leadstoreducedprocessingtimeandincreasedthroughputbut Private State: In contrast, a private state lets each thread
at the cost of elevated energy consumption. Conversely, lower maintainitsownstate,therebyeliminatingconcurrentconflicts.
frequencies are more energy-efficient but result in lower pro- This strategy maximizes parallelism but potentially reduces
cessingrates.CStreamfacilitatesexplorationofthistrade-off compressibility,astheisolatedstateslimitathread’sawareness
by allowing stream compression tasks to be run at varying oftupleshandledbyothers.
frequencysettings.Moreover,thecapabilityextendstodynamic 3) Scheduling Strategies: For efficient workload distribu-
frequencyscalingusingDynamicVoltageandFrequencyScal- tion across multicore processors, CStream utilizes two
ing (DVFS) technology [46], [47], [48]. Though changes in main scheduling strategies: Simple Uniform Scheduling and
frequencyintroduceoverheads,CStreamoffersthepotentialto Asymmetric-awareScheduling.
explorewhethertheadvantagesofDVFSoutweighthesecosts SimpleUniformScheduling:InSymmetricMulticoreProces-
inthecontextofstreamcompression. sor(SMP)environments,CStreamusesa“balancedpartition
Core Number Regulation: While cloud-based stream pro- andequaldistributionratio”approachtoscheduling[40].This
cessing frameworks [27], [28] typically utilize all available method takes advantage of the symmetry inherent in SMPs,
computational resources in pursuit of maximum performance, where all cores have equal computational capacity and com-
edge-basedsystemsneedtobemoreenergy-conscious.Conse- municationdistance.
quently,itmightbebeneficialtoturnofforidlecertainprocessor Asymmetry-aware Scheduling: For Asymmetric Multicore
cores during stream compression operations to conserve en- Processors (AMPs), which have cores with different compu-
ergy.CStreamenablesinvestigationintothistrade-offbetween tationalabilitiesandcommunicationdistances,CStreamem-
energy consumption and processing throughput by allowing ploysAsymmetric-awareScheduling[4]withtwokeydesigns:
variable core usage, thereby further enhancing its adaptability 1) fine-grained decomposition, which decomposes a stream
todiverseedgeenvironments. compressionprocedureintomultiplefine-grainedtaskstobetter
expose the task-core affinities under the asymmetric computa-
tion effects; and 2) asymmetry-aware task scheduling, which
C. IntegratedSoftwareandHardwareOptimization
schedules the decomposed tasks based on a novel cost model
CStream optimizes stream compression by finely tuning to exploit the exposed task-core affinities while considering
software strategies and hardware configurations to create a asymmetric communication effects. This method represents
synergisticinterplaythatmaximizesbothefficiencyandperfor- a refined adaptation to general challenges in energy-efficient
mance.CentraltothisintegrationisCStream’scomprehensive scheduling[52].Unlikeconventionalstrategiesthatdependon
suiteofparallelizationstrategies.Thenuancesofthisintegration black-box energy and metric predictions, this approach inte-
willbeunpackedinthesubsequentsections. grates an accurate white-box model. As elucidated in [4], it
1) ExecutionStrategies: ThechoicebetweenEagerandLazy precisely models the computational and memory demands of
Executiondependsonstreamdatacharacteristicsandhardware stream compression tasks in piece-wise linear terms. These
resources. are then aggregated into arithmetic formulations to accurately
Eager Execution: Eager execution aligns closely with the predictfinalenergyusageandlatency.
inherent nature of streaming data–infinitely incremental [49],
[50].Aseachtuplearrives,itiscompressedinstantly.However,
D. SummaryofTuningIdentifiedTrade-Offs.
while this strategy reflects the streaming model, it can lead
to inefficient hardware utilization due to frequent partitioning, CStream orchestrates a co-design space featuring a spec-
synchronization,andpotentialcachethrashing. trumoftuningmechanismsacrossfourprincipaldomains.Ini-
LazyExecution:Tocounteractthepotentialinefficienciesof tially,itincorporatesadjustableparametersforcoreutilization,
Eager Execution, CStream introduces Lazy Execution. This peak frequencies, and dynamic voltage and frequency scaling
strategy batches several tuples together before compression, a (DVFS) tactics, rooted in insights from [53]. Furthermore, an
practiceknownasmicro-batching[1],[51].Whilethisapproach innovative internal mechanism allows users to toggle between
reducescommunicationoverheadandpromotesbetterhardware state sharing and private configurations, a novel application
utilization,selectinganappropriatebatchsizecanbechalleng- in stream compression informed by prior works on stateful
ing,necessitatingacarefulbalancebetweenfrequentcacheflush concurrentstreamprocessing[54].Theframeworkalsopresents
and reload operations and not overburdening slower memory sophisticatedoptionsforrefiningschedulingapproachesandcal-
storage. ibratingcostmodels.Foruserconvenience,CStreamispreset
2) State Management Strategies: Parallelizing stateful str- withoptimizedconfigurationsfrom [4],[27],thoughitremains
eamcompressiondemandscarefulconsiderationofstateman- customizable to accommodate diverse scenarios. While our
agementandsharing.CStreamprovidesthreekeystrategies: focusprecludes anexhaustive exploration ofalltunable facets
StateSharingandPrivateState. of stream compression algorithms themselves (e.g., parameter
State Sharing: State Sharing allows all threads to share a and hyperparameter tuning in some lossy compression [14]),
singlestate,withlocksimplementedtopreventwriteconflicts. defaultsettingsarerecommendedforlosslesscompressiontech-
Whilethismethodcantheoreticallyofferhighercompressibility niquestomaintainefficiencyandaccuracy,withlossymethods
due to a collective record of past tuples, concurrency control finely adjusted to achieve specified NRMSE objectives with
overheadmayhinderparallelismandimpactperformance. minimal computational demand. The exploration of heuristic
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore. Restrictions apply.

ZENGANDZHANG:CSTREAM:PARALLELDATASTREAMCOMPRESSIONONMULTICOREEDGEDEVICES 5895
(cid:2)
(cid:2)
| anddynamicallyadaptivetuning,potentiallyleveragingonline |       |     |     |     |                              |            |                |              |               |                     | N              |         |
| -------------------------------------------------------- | ----- | --- | --- | --- | ---------------------------- | ---------- | -------------- | ------------ | ------------- | ------------------- | -------------- | ------- |
|                                                          |       |     |     |     | compression,isdefinedasNRMSE |            |                |              | =             | 1 ×                 | i (x[i]−y[i])2 | ,       |
| reinforcementlearning,isidentifiedasapromisingavenuefor  |       |     |     |     |                              |            |                |              |               | x¯                  |                |         |
|                                                          |       |     |     |     | wherex¯                      |            |                |              |               |                     | N              |         |
|                                                          |       |     |     |     |                              | represents | theaverage     | value        | of            | theinputdatastream, |                |         |
| futureresearch                                           | [55]. |     |     |     |                              |            |                |              |               |                     |                |         |
|                                                          |       |     |     |     | x[i],y[i]                    | denote     | the individual | values       | of            | the raw             | input          | and the |
|                                                          |       |     |     |     | reconstructed                | data       | from           | compression, | respectively, |                     | and            | N is    |
E. EnergyMetering
thetotalinputdatavolume.Notethat,wedon’tdelveintospe-
cializedfloat-pointcompressionormorecomplicatedsemantic-
Understandingandaccuratelymeasuringenergyconsumption
is of paramount importance in edge computing, where power awarecompression,andweusetherawunsigned4-bytebinary
constraints are often more stringent than in conventional data words to investigate x[i],y[i], i.e., each of them varies from
|     |     |     |     |     | 0∼232−1 |     | x¯  |     |     |     |     |     |
| --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
centers. To support this need, CStream includes a custom- and is strictly larger than 0. A larger NRMSE
developed energy meter to accurately measure energy con- generallyindicatesmoreinformationlossinedgeapplications,
|     |     |     |     |     | such as | more system | noise | in 5 G | communication |     | [59], | more |
| --- | --- | --- | --- | --- | ------- | ----------- | ----- | ------ | ------------- | --- | ----- | ---- |
sumptionacrossvariousedgeplatforms.Technically,itachieves
|     | 0∼15V |     | 0∼4A |     |     |     |     |     |     |     |     |     |
| --- | ----- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
16-bit resolution for voltage and current at distortionofimagesorvideos[60],andlessaccuratereadings
1K SPS sampling. This energy metering component consists gatheredfromIoTsensors[61],[62],[63].Themaximumtol-
|     |     |     |     |     | erance of | NRMSE | depends | on  | specific | applications, |     | and an |
| --- | --- | --- | --- | --- | --------- | ----- | ------- | --- | -------- | ------------- | --- | ------ |
ofTexasInstrument’sINA226[56]chip,whichactsasasensor
forcurrentandvoltage,andtheEspressif’sESP32S2[57]micro NRMSE within 5% is considered to be acceptable for most
controlunit(MCU)fordatapre-processingandUSB-2.0com- applicationsin [59],[60],[61],[62],[63].
municationwithtargetedasymmetricmulticores.Inthisconfig- Throughputandend-to-endlatencyprovideinsightsintothe
uration,themeteroffersprecisemeasurementcapabilitieswhile system’s operational efficiency. Throughput is measured as
|             |                 |               |     |              | throughput= |     | N   | , where | the | processing |     | time is |
| ----------- | --------------- | ------------- | --- | ------------ | ----------- | --- | --- | ------- | --- | ---------- | --- | ------- |
| maintaining | a low overhead. | Additionally, | for | the UP board |             |     |     |         |     |            |     |         |
processingtime
platform,itispossibletodirectlyreadenergyconsumptiondata obtained using OS APIs such as gettimeofday. End-to-end la-
fromX64msrregisters[58]beforeandafteranexperimentalrun. tency,animportantmetricinedgecomputingscenariosrequiring
TheintegrationoftheINA226chipandtheESP32S2MCU real-timeornear-real-timedataprocessing,quantifiesthetotal
inourenergymeteringsystemenablesprecisemeasurementof timeforadataelementtotraversethecompressionsystemfrom
inputtooutput.
energyusage,ensuringaccuracyfromtheoverallsystemtothe
specificitiesofindividualoperations,andprovidinginsightinto Energyconsumptionevaluationfollowsatwo-stepprocedure.
theenergyprofileofthestreamcompressionprocess.Designed First,wemeasureandeliminatethestaticenergyconsumption
withminimaloverhead,thesystemusestheESP32S2MCUfor caused by irrelevant hardware or software components, such
data preprocessing and USB-2.0 for communication, avoiding as the Ethernet chip and back-end TCP/IP threads. Next, we
monitortheenergyconsumptionduringtherunningofthestream
| disruptiontostreamcompressionandparallelexecution |     |     |     | tasks. |     |     |     |     |     |     |     |     |
| ------------------------------------------------- | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
Itoffersreal-timefeedbackonenergyconsumption,facilitating compressionbenchmark,withoutincurringadditionaloverhead
dynamicadjustmentsinexecutionstrategies,statemanagement, orinterference.Thespecificsofenergyrecordingareplatform-
andschedulingtoenhanceenergyefficiency.Thesystem’sseam- dependentandarediscussedinSectionIII-E.
| less integration | with the broader | CStream   | framework | allows     |                       |     |     |     |     |     |     |     |
| ---------------- | ---------------- | --------- | --------- | ---------- | --------------------- | --- | --- | --- | --- | --- | --- | --- |
|                  |                  | CStream’s |           |            | B. BenchmarkWorkloads |     |     |     |     |     |     |     |
| for synergistic  | operation        | with      | software  | strategies |                       |     |     |     |     |     |     |     |
andhardwareconfigurations,drivingoptimizationsandadapta-
|     |     |     |     |     | In order | to comprehensively |     |     | evaluate | CStream | across | a   |
| --- | --- | --- | --- | --- | -------- | ------------------ | --- | --- | -------- | ------- | ------ | --- |
tionsbasedoncurrentenergydata.
|     |     |     |     |     | diverse range | of  | IoT use | cases (discussed |     | in Section | II-B), | we  |
| --- | --- | --- | --- | --- | ------------- | --- | ------- | ---------------- | --- | ---------- | ------ | --- |
usefiverepresentativeIoTdatasets.Thesedatasetswerechosen
IV. METHODOLOGY toreflectvariousdatasources(singleandmultiple)anddiverse
datastructures(plain,binarystructured,andtextualstructured).
Thissectionpresentsourmethodologicalapproachtoassess-
ingtheeffectivenessandperformanceofCStream.Itprovidesa Furthermore,weassessthecompressibilityofdatafromtwoper-
spectives:statelesscompressibilityandstatefu;compressibility,
comprehensiveexplanationofthechosenperformancemetrics,
utilizingasyntheticdatasettocalibratetheseproperties.
| the benchmark | workloads | utilized, and | the selection | and char- |     |     |     |     |     |     |     |     |
| ------------- | --------- | ------------- | ------------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
Thestatelesscompressibilityreferstothecompressiblespace
acteristicsofthehardwareplatformsinvolvedintheevaluation.
|     |     |     |     |     | within each | individual |     | tuple x =v, | which | can | be exploited |     |
| --- | --- | --- | --- | --- | ----------- | ---------- | --- | ----------- | ----- | --- | ------------ | --- |
t
|     |     |     |     |     | by both | stateless | and | stateful stream |     | compression | (refer | to  |
| --- | --- | --- | --- | --- | ------- | --------- | --- | --------------- | --- | ----------- | ------ | --- |
A. PerformanceMetrics
|     |     |     |     |     | Section | III-A2). | On the | other hand, | stateful |     | compressibility |     |
| --- | --- | --- | --- | --- | ------- | -------- | ------ | ----------- | -------- | --- | --------------- | --- |
We focus on a range of metrics, each providing insight into points to the compressible space hidden in the context, con-
|     |     |     |     |     |     |     |     |     |     |     | {x  | |t<τ} |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- |
differentaspectsofitsfunctionalitytoevaluateCStream.As sidering the current tuple x and some past tuples
|     |     |     |     |     |     |     |     | τ   |     |     | t   |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
discussedinSectionII,weincludecompressionratio,through- together.Thiscanonlybefullyexploitedbyasuitablestateful
| put,energyconsumption,andend-to-endlatency.Wereportthe |     |     |     |     | compression. |     |     |     |     |     |     |     |
| ------------------------------------------------------ | --- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
averageofthesemetrics,calculatedoverasubstantialdatavol- Our selected datasets are summarized in Table III and are
| umetoavoidfluctuationsandensureconsistency-specifically, |     |     |     |     | detailedbelow: |     |     |     |     |     |     |     |
| -------------------------------------------------------- | --- | --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
over932800bytesoftuples. 1) ECG[21]:TheECGdatasetconsistsofrawADCrecord-
Thecompressionratioandnormalizedrootmeansquareerror ingsfromelectrocardiogram(ECG)monitoringprovided
(NRMSE) are calculated by comparing the compressed data bytheMIT-BIHdatabase.Eachreadingispackagedasa
againsttherawinput.TheNRMSE,specificallyusedforlossy plain32-bitvalueforourevaluation.AsECGisadirect,
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

5896 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
|     |     |     | TABLEIII       |     |     |     |     |     |     |                            | TABLEIV |     |     |     |     |
| --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | -------------------------- | ------- | --- | --- | --- | --- |
|     |     |     | DATASETSTUDIED |     |     |     |     |     |     | EVALUATEDHARDWAREPLATFORMS |         |     |     |     |     |
supporttheGlibcwithC++20features,therebyenablingashared
unstructuredreflection ofacontinuous physical process, codebase. TheRockpi 4a[65]serves asourdefaultevaluation
itexhibitsthehighestlevelsofbothstatelessandstateful platform. Unless otherwise specified, we use its processor as
RK3399AMP
| compressibility. |     |     |     |     |     |     |     |     | andengageeachcoretooperateatitsmaximum |     |     |     |     |     |     |
| ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------------------------- | --- | --- | --- | --- | --- | --- |
2) Rovio[22]:TheRoviodatasetcontinuouslymonitorsuser frequency: 1.8 GHz for the larger cores (core4 to core5) and
interactionswithaspecificgametoensureoptimalservice 1.416GHzforthesmallercores(core0tocore3).
performance.Eachdataentryconsistsofa64-bitkeyand
64-bitpayload.TheRoviodatasetexhibitstwocompress-
|      |         |            |         |                |     |      |            |     |     | V.  | EVALUATION |     |     |     |     |
| ---- | ------- | ---------- | ------- | -------------- | --- | ---- | ---------- | --- | --- | --- | ---------- | --- | --- | --- | --- |
| ible | traits: | first, its | payload | is constrained |     | to a | relatively |     |     |     |            |     |     |     |     |
smalldynamicrange,indicatingstatelesscompressibility; Inthissection,weembarkonanexperimentaljourneytoeval-
uatethepotencyofvariousstreamcompressionschemes,partic-
| second, | different | tuples | may | share | the | same key, | which |     |     |     |     |     |     |     |     |
| ------- | --------- | ------ | --- | ----- | --- | --------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
demonstratesstatefulcompressibility. ularlyonedgeplatforms.Thisevaluationfocusesonastrategic
3) Sensor[24]:TheSensordatasetiscomprisedoffull-text software-hardware co-design as explicated in Section III. We
delveintofivekeyareas:
| streaming |     | data generated |     | by various | automated |     | sensors |     |     |     |     |     |     |     |     |
| --------- | --- | -------------- | --- | ---------- | --------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
(e.g.,temperatureandwindspeedsensors).Forourevalua- 1) An end-to-end case study of CStream’s solution space
tion,every16ASCIIcharactersintheSensordatasetforms isdemonstratedinSectionV-A
one 128-bit tuple. The Sensor dataset primarily exhibits 2) The selection and performance of different stream com-
stateful compressibility due to the repetition of several pressionalgorithms,areexploredinSectionV-B.
|     |     |     |     |     |     |     |     | 3) The | impact | and considerations |     | of hardware |     | variants, | are |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ------ | ------------------ | --- | ----------- | --- | --------- | --- |
fixedXMLpatternsacrossdifferenttuples.
4) Stock[23]andStock-Key[23]:TheStockdatasetisareal- investigatedinSectionV-C.
worldstockexchangedatasetpackedina(32-bitkey,32- 4) The effectiveness and scalability of novel parallelization
bitpayload)binaryformat.Itexhibitslesscompressibility strategies,areexaminedinSectionV-D.
thanRovioduetofewerkeyduplications.Stock-Keyisa 5) Thesensitivityandadaptabilitytovaryingworkloadchar-
acteristics,assessedinSectionV-E.
subsetoftheStockdataset,containingonlythe32-bitkeys.
5) Micro:TheMicrodatasetisasynthetic32-bitdataset[64], OurexplorationculminatesinSectionV-F,wherewecollate
usedtofurthertunestatelessandstatefulcompressibility. ourfindings.Unlessotherwisespecified,weadoptthefollowing
|     |            |     |         |       |            |             |     | parallelization | strategies: |     | 1) lazy | execution | with | a 400-byte |     |
| --- | ---------- | --- | ------- | ----- | ---------- | ----------- | --- | --------------- | ----------- | --- | ------- | --------- | ---- | ---------- | --- |
| We  | can adjust | its | dynamic | range | to control | independent |     |                 |             |     |         |           |      |            |     |
compressibility and its level of duplication to control microbatch,2)aregulatedmulticoreworkloaddistributionratio
tooptimizethroughput,and3)theuseofanon-sharedstatefor
associatedcompressibility.
Tomitigatetheimpactofnetworktransmissionoverhead,all statefulstreamcompression.
| input datasets | are | preloaded | into | memory | before | testing. | Each |     |     |     |     |     |     |     |     |
| -------------- | --- | --------- | ---- | ------ | ------ | -------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
tupleisassignedatimestamp(startingfrom0)toreflectitsactual A. EndtoEndCaseStudy
| arrival time | to the | system, | and | tuples | are time-ordered. |     | These |         |             |     |          |      |                  |     |     |
| ------------ | ------ | ------- | --- | ------ | ----------------- | --- | ----- | ------- | ----------- | --- | -------- | ---- | ---------------- | --- | --- |
|              |        |         |     |        |                   |     |       | In this | case study, | we  | have ECG | data | to be compressed |     | on  |
timestamps,whicharestoredseparatelyfromeachtupleandare
|     |     |     |     |     |     |     |     | RK3399 | hardware, | the compression |     | ratio | is expected |     | to be |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | --------- | --------------- | --- | ----- | ----------- | --- | ----- |
notsubjectedtocompression,helpprovidearealisticsimulation
ofdataarrivalinareal-worldscenario.Unlessotherwisespec- largerthan6.0,whiletheNRMSEshouldbecontrolledbelow
|           |          |             |     |            |        |     |          | 5%. CStream |           | will hence | choose | the      | PLA algorithm, |        | and |
| --------- | -------- | ----------- | --- | ---------- | ------ | --- | -------- | ----------- | --------- | ---------- | ------ | -------- | -------------- | ------ | --- |
| ified, we | generate | incremental |     | timestamps | evenly | to  | simulate |             |           |            |        |          |                |        |     |
|           |          |             |     |            |        |     |          | the whole   | available | solution   | is     | provided | as colorful    | points | in  |
anaveragearrivalspeedof16×106bytespersecond(e.g.,106
tuplespersecondfortheRoviodataset,whichconsistsof128-bit Fig3(a).Ingeneral,higherenergyconsumptionisrequiredwhen
higherthroughput,highercompressionratio,orlowerlatencyis
tuples).
|     |     |     |     |     |     |     |     | expected,      | and the | specific    | optimal  | solution | depends   | on     | users’ |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | ------- | ----------- | -------- | -------- | --------- | ------ | ------ |
|     |     |     |     |     |     |     |     | prioritization | of      | performance | metrics. | For      | instance, | if the | user   |
C. EdgeComputingPlatforms
furtherwantstomaximizethecompressionratio,andthenmax-
Toensureacomprehensiveandhardware-variantevaluation, imizethroughput,whilekeepingtheenergyconsumptionwithin
wedeploythreedistinctedgecomputingplatforms,eachfeatur- 1.5J/MB,theoptimaloneislabeledaspointA.Specifically,it
inguniquecharacteristicsasoutlinedinTableIV.Importantly, utilizes1bigcoreand1littlecoreundertheirhighestfrequency,
allplatformsarecompatiblewiththemainlineLinuxkerneland lets each of them use a private PLA state, and schedules the
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

ZENGANDZHANG:CSTREAM:PARALLELDATASTREAMCOMPRESSIONONMULTICOREEDGEDEVICES 5897
SolutionspaceofCStream≤5%NRMSEandRK3399hardware.
Fig.3.
workloadinanAsymmetric-awaremanner.Bothcoresexecute
thestreamcompressionundera8KBmicro-batch.
| We also     | marked    | a careless    |          | solution      | point B       | in Fig.     | 3(a) as |     |     |
| ----------- | --------- | ------------- | -------- | ------------- | ------------- | ----------- | ------- | --- | --- |
| a contrast. | This      | solution      | conducts | a Tdic32      |               | compression | on      |     |     |
| 2 big cores | and       | 4 little      | cores,   | the Tdic32    | state         | is shared   | by      |     |     |
| all cores,  | and       | OS scheduling |          | is used along | with          | on-demand   |         |     |     |
| DVFS.       | All cores | use an        | eager    | strategy      | in conducting |             | stream  |     |     |
2.8×
| compression. | Note   | that, | the optimal | solution | A       | achieves   |     |     |     |
| ------------ | ------ | ----- | ----------- | -------- | ------- | ---------- | --- | --- | --- |
| compression  | ratio, | 4.3×  | throughput, | 65%      | latency | reduction, |     |     |     |
and89%energyconsumptionreductionsimultaneouslythanthe
carelesssolutionB.
| To better | understand |     | the total | data transfer |     | time, which | in- |     |     |
| --------- | ---------- | --- | --------- | ------------- | --- | ----------- | --- | --- | --- |
cludesdatacompression,transmission,anddecompression,we
| explore  | the effect        | on  | CStream’s | solution      | space   | when            | con- |     |     |
| -------- | ----------------- | --- | --------- | ------------- | ------- | --------------- | ---- | --- | --- |
| sidering | data transmission |     | and       | decompression |         | across varying  |      |     |     |
| network  | bandwidths.       | An  | RK3399    | unit          | is used | as the receiver |      |     |     |
Fig.4. Comparingtenalgorithmsonfivedatasets.
| and decompressor, |     | operating | in  | a single-threaded |     | manner | for |     |     |
| ----------------- | --- | --------- | --- | ----------------- | --- | ------ | --- | --- | --- |
simplicity.Futurestudiescouldseeimprovementsbyusingmore
advancedprocessorsandimplementingparalleldecompression. 1) Fidelity. Lossless vs. Lossy Compression: Referencing
Weexaminetwobandwidthscenarios:10Mbpsand125Kbps, Fig. 4(a), (b), (c), and (d), the distinction between lossless
depictedinFig.3(b)and(c),respectively.The10Mbpssetting andlossycompressionbecomesapparent.Lossycompression,
mimics a situation with substantial bandwidth, similar to an represented by LEB128−NUQ, offers a superior compres-
802.11n wireless channel, while 125 Kbps corresponds to a sionratio(between2.0and6.0)acrossalldatasets.Conversely,
LEB128,alosslessalgorithm,strugglestoexceedaratioof2.0.
| bandwidth-limited |     | environment, |     | typical | of long-distance |     | com- |     |     |
| ----------------- | --- | ------------ | --- | ------- | ---------------- | --- | ---- | --- | --- |
municationstechnologieslikeLoRa. Remarkably,thishighcompressionratiobyLEB128−NUQ
In scenarios with restricted bandwidth, such as 125 Kbps, introducesonlymarginalinformationloss,withaNRMSEbe-
| streamcompressionsignificantlyreducestheoveralldatatrans- |     |     |     |     |     |     | low3.8%. |     |     |
| --------------------------------------------------------- | --- | --- | --- | --- | --- | --- | -------- | --- | --- |
ferlatency,withreductionsofuptoabout1minute.However, 2) State Utilization. Stateless Vs. Stateful Compression:
|     |     |     |     |     |     |     |     | Tcomp32 | Tdic32 |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ------ |
inenvironments withhigher bandwidth, like10Mbps,theap- On comparing (stateless) with (stateful,
plicationofstreamcompressionrequirescarefulconsideration. dictionary-based),weobserveatrade-offbetweencompression
Tcomp32
AreddashedlineinFig.3(b)highlightsthepointatwhichcom- cost and effectiveness. While offers more modest
pressionmaybegintoincreaseratherthandecreaseend-to-end compressionratios,itpresentsalesscomplex,lower-costcom-
latency.Techniquespositionedtotheleftofthislinecouldadd pressionprocess.Ontheotherhand,Tdic32,despiteitshigher
processingtimethatsurpassesthetimesavedfromreduceddata processingcostduetodictionary-basedstatemanagement,ex-
transmission,leadingtoanoveralllatencyincrease. celsinhandlingtextdatastreamswithhighassociatedbutlow
independentcompressibility,liketheSensordataset.
3) StateImplementation.Value,Dictionary,andModel: Fur-
B. AlgorithmEvaluation
|     |     |     |     |     |     |     | ther comparisons | among ADPCM | (stateful, value-based), |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | ----------- | ------------------------ |
Tdic32(stateful,dictionary-based),andPLA(stateful,model-
InordertoevaluatetheperformanceofCStream’ssupport
fordiversestreamcompressionalgorithms,wetesttendistinct based)illustratehowdifferentstateimplementationscanimpact
algorithms, as summarized in Table I, on five real-world IoT compressionperformance.WhileADPCM consistentlyleads
inthroughputandenergyconsumption,Tdic32andPLAshine
datasets,asdetailedinTableIII.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

5898 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
Fig.6. ImpactsofISAforTcomp32.
Fig.5. ImpactsofprocessorarchitecturesforTcomp32.
manipulation and makes out-of-order big cores over-
inhandlingstructureddataordatafrommultiplesources,offer-
provisioned.Therefore,muchenergyiswastedinthesmp_big
inghighercompressionratios.
configuration.Conversely,s1ands2aremoreworthwhilerun-
4) Byte Alignment Variations: When comparing byte-
ning on big cores as they offer enough computation density
aligned LEB128 and byte-unaligned Tcomp32, we note a
for big cores to support. Their high computation density also
trade-off between compression ratio and computational cost.
makes the little cores under-provisioned, resulting in energy
Tcomp32 achieves higher compression ratios but increases
dissipationinthesmp_littleconfiguration.ThroughCStream,
computationaloverheadduetothebit-by-bitencoding.
weefficientlymanagethisarchitecturalselectionandintricacies,
ensuringoptimalenergyusageandperformance.
C. HardwareEvaluation
2) ISA Selection: CStream also enables us to investigate
In this section, we highlight how our novel framework, the effects of different Instruction Set Architectures (ISA) on
CStream,exploresvarioushardwaredesignspaces,including stream compression performance. In this evaluation, we con-
architectureselection,ISAselection,frequencyregulation,and sider the RK3399, H2+, and Z8350 hardware platforms, as
corecountadjustment.Thesearecriticalaspectsinensuringop- introducedinSectionIV-C.
timalenergyconsumptionandthroughput.WeusetheTcomp32 Specifically,wecomparethetimeandenergycostpercorefor
algorithm and Rovio dataset as our primary test cases for this eachstepofTcomp32underdifferentISAs(Fig.6(a)and(b)).
evaluation. To account for their different working frequencies, we mathe-
1) ArchitectureSelection: CStreamallowsustostudythe maticallyaligntheirfrequencyto1GHz.TheresultsforRK3399
impactofdifferentmulticoreconfigurations.Wecomparesym- aresplitintoRK3399 andRK3399 ,representingitsbigand
B L
metric and asymmetric multicores under the same total com- littlecores,respectively.
putationalpower(i.e.,maximuminstructionspersecond).The Our evaluation highlights two key findings. First, the RISC
rooflinemodelbenchmark[68],[69]showsthatone1.416GHz ISA(usedinRK3399)demonstratessuperiorperformancecom-
A72 big core in the RK3399 processor has about twice the pared to the CISC ISA (used in Z8350). Both RK3399_B and
computational power of one A53 little core at the same fre- RK3399_Lcoreshavesignificantlylowerunitenergycoststhan
quency(Fig.5(a)).Therefore,wecomparedifferentarchitecture theZ8350,andtheRK3399_Bcanevenreducetheprocessing
configurationsusingthefollowingsettings: timeofeachstepby50%comparedtotheZ8350.Thisisbecause
(cid:2)
Asymmetric multicore processor (amp): Using 1 A72 big RK3399’sRISC-basedexecutionhardwarecandirectlyexecute
coreand2A53littlecoresat1.416GHz. theinstructionsusedforstreamcompression,avoidingtheextra
(cid:2)
Symmetric multicore processor with only big cores overhead of micro-coding them. As a result, both unit latency
(smp_big):Using2A72bigcoresat1.416GHz. andunitenergycostarereduced.
(cid:2)
Symmetric multicore processor with only little cores Second,traditional32-bitprocessors(liketheH2+)perform
(smp_little):Using4A53littlecoresat1.416GHz. poorlyintermsofbothperformanceandenergyefficiency.This
Eacharchitecturalcaseistunedtoitsmaximumthroughput, isduetothelimitationsofashorterregisterlength.Forexample,
after which we compare their energy consumption along with manipulating a 33-bit intermediate result of Tcomp32 can be
throughput(Fig.5(b)).Theasymmetricmulticoreconfiguration done with a single instruction on a single 64-bit register but
(amp)outperformsthesymmetricconfigurations(smp_bigand requirestwoormoreoperationson32-bitregisters.Thisineffi-
smp_little),achievingboththelowestenergyconsumptionand ciencyattheinstructionandregisterlevelsleadstosignificantly
thehighestthroughput. increasedlatencyandisdetrimentaltoenergyefficiency.From
Furthermore, we observe that different stream compression ouranalysis,weconcludethatstreamcompressiontasksshould
steps(i.e.,s0∼s2inAlgorithm??)involvevaryingoperational ideallybeconductedon64-bitRISCedgeprocessors.
intensities [70], [71], [72], [73] (i.e., instructions per memory 3) Frequency Regulation: CStream provides flexibility in
access),asshownbythedashedlinesinFig.5(a).Thisdifference frequencyregulation,allowingforbothstaticfrequencysetting
inoperationalintensitiescauseseitherover-provisionorunder- and dynamic voltage and frequency scaling (DVFS). In our
provision when conducting stream compression on symmetric evaluation,weexploretheseapproaches’impactonthroughput
multicores,therebyincreasingenergyconsumption. andenergyconsumption.
The s0 step leads to less performance gain when run on Statically Tuning the clock frequency: We first adjust the
a big core than s1 and s2, as it primarily involves memory frequency of the big cores (‘B’) and the little cores (‘L’) on
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore. Restrictions apply.

ZENGANDZHANG:CSTREAM:PARALLELDATASTREAMCOMPRESSIONONMULTICOREEDGEDEVICES 5899
Fig.7. ImpactsoffrequencyregulationforTcomp32.
|               |                |            |                     |           |           | Fig.8. Scalabilityevaluation. |     |     |     |
| ------------- | -------------- | ---------- | ------------------- | --------- | --------- | ----------------------------- | --- | --- | --- |
| the RK3399    | processor.     | We observe | how                 | frequency | changes   |                               |     |     |     |
| influence     | the throughput | and        | energy consumption, |           | as shown  |                               |     |     |     |
| in Fig. 7(a). | As expected,   | the        | relationship        | between   | frequency |                               |     |     |     |
andthroughputisnearlylinear:higherfrequencyenablescores
| to execute | more operations | per | unit time, | and therefore | more |     |     |     |     |
| ---------- | --------------- | --- | ---------- | ------------- | ---- | --- | --- | --- | --- |
tuplesarecompressed.
Energyconsumption,however,doesn’tfollowasimplemono-
tonicrelationshipwithfrequency.Itistheproductofpowerand
time, both of which respond differently to frequency changes. Fig.9. ImpactsofexecutionstrategyforTcomp32.
| For example, | a frequency | of 0.408   | GHz leads | to lower      | power |                 |                   |                 |          |
| ------------ | ----------- | ---------- | --------- | ------------- | ----- | --------------- | ----------------- | --------------- | -------- |
| according    | to existing | work [46], | [47], but | also involves | more  |                 |                   |                 |          |
|              |             |            |           |               |       | balance between | energy efficiency | and throughput. | Besides, |
processingtime,whichcounteractsthepowerreduction.Thus,
similarscalabilityremainswhenweshiftthefocustogenerally
| it’s less | energy-efficient | than | the 0.6 GHz | frequency. | When |     |     |     |     |
| --------- | ---------------- | ---- | ----------- | ---------- | ---- | --- | --- | --- | --- |
highercomputationalpowerasdemonstratedinFig.8(b).
| the frequency | surpasses      | 0.816   | GHz, the energy | consumption |         |                              |     |     |     |
| ------------- | -------------- | ------- | --------------- | ----------- | ------- | ---------------------------- | --- | --- | --- |
| increases     | with frequency | because | the rise        | in power    | is more |                              |     |     |     |
|               |                |         |                 |             |         | D. ParallelizationStrategies |     |     |     |
significantthanthetimereduction.
DVFS:WealsoemploytheDVFSapproach[46],[47],[48] Wenowexplorevariousparallelizationstrategiesprovidedby
to dynamically adjust the frequency. We use different DVFS CStream,includingdifferentexecutionstrategies,micro-batch
strategiesandpresenttheresultsinFig.7(b).The“performance” size, state sharing, and scheduling strategies. Our exploration,
illustratedwiththeTcomp32algorithmandtheRoviodataset,
strategy,whichfixeseachcoreatitshighestfrequencywithout
dynamicreconfiguration(1.8GHzforbigcoresand1.416GHz illustrates the importance of each strategy and its impacts on
for little cores), serves as a reference. The “conservative” and energyconsumptionandthroughput.
“on-demand”strategiesattempttoreduceenergyconsumption 1) ExecutionStrategy.EagervsLazy: Akeycomponentof
bydynamicallyreconfiguringfrequency.Theprimarydifference our CStream framework is the ability to vary the execution
is that the “conservative” strategy changes frequency less fre- strategy.Specifically,weexplorethedifferencesbetweeneager
quentlythan“on-demand”. andlazyexecutionstrategiesusingtheTcomp32algorithmand
| Ourresultsindicatethatthe“conservative”strategycanfur- |     |     |     |     |     | theRoviodataset. |     |     |     |
| ------------------------------------------------------ | --- | --- | --- | --- | --- | ---------------- | --- | --- | --- |
therreduceenergyconsumptionby15%comparedtothedefault Under eager execution, tuples are compressed immediately
“performancestrategy”,albeitatthecostofa38%increasein uponarrival,whereaslazyexecution,thedefaultinCStream,
latency.Thisstrategyoffersacoarser-grainedbalanceofenergy waits until a 400-byte micro-batch forms. These approaches
efficiencyandlatencyconstraints,sincetheoverheadofdynamic don’talterthecompression ratiobuthave anotable impacton
frequency regulation can introduce latency variability. In con- throughput and energy consumption. Lazy execution is shown
trast,the“on-demand”strategydoesn’tprovideanybenefits;it tobesuperior,improvingthroughputandreducingenergyuse,
actuallyincreasesbothlatencyandenergyconsumptiondueto as depicted in Fig. 9(a). Eager execution, with its need for in-
thehighoverheadoffrequentfrequencyswitches. stantprocessingofeachtuple,diminishesparallelismandhikes
Through this exploration, CStream highlights the critical energy costs. The lazy method boosts parallelism by batching
roleoffrequencyregulationinachievingenergy-efficientstream tasks before processing them. Analyzing the processing time
compression,guidingustowardsmoreefficienthardwarecon- splitbetween‘blocked’and‘running’phasesinTable9boffers
figurationsandsettings. insight into the cost differences. ‘Blocked’ time, for resolving
4) TuningtheNumberofCores: Finally,wedemonstratethe conflicts and reducing cache issues, and ‘running’ time, for
abilityofCStreamtoeffectivelymanagethenumberofcores actualcompression,indicatethateagerexecutionleadstomore
forstreamcompressiontasks. ‘blocked’ time. This results in higher overheads and lower
TheresultsareshowninFig8.Byenablingdifferentnumbers energyefficiencycomparedtolazyexecution.
of big and little cores in Fig. 8(a), we observe a trade-off InourexplorationofexecutionstrategieswithinCStream,
between energy consumption and throughput. This demon- we delved into how varying batch sizes during lazy execution
Tcomp32
stratesCStream’sflexiblecoremanagementstrategy,strikinga impact performance, leveraging the algorithm and
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

5900 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
|     |     |     |     |     |     |     |     | Fig.12. | ImpactsofschedulingstrategyforTcomp32. |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | -------------------------------------- | --- | --- | --- | --- | --- | --- |
Fig.10. ImpactsofbatchsizesforTcomp32.
|     |     |     |     |     |     |     |     | shows the | impact | on energy |     | consumption |     | and throughput | for |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------ | --------- | --- | ----------- | --- | -------------- | --- |
bothmethods.Sharingstatesledtohigherenergyuseandlower
|     |     |     |     |     |     |     |     | throughput. | Yet,       | it slightly | improved |           | the   | compression | ratio, |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ---------- | ----------- | -------- | --------- | ----- | ----------- | ------ |
|     |     |     |     |     |     |     |     | from 1.78   | in private | to          | 1.81     | in shared | state | scenarios.  | Given  |
theminimalcompressiongainversusthesignificantoverhead,
|     |     |     |     |     |     |     |     | the benefits | of a | mere | 3% improvement |     | in  | compression | ratio |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ---- | ---- | -------------- | --- | --- | ----------- | ----- |
oftendonotjustifythecostsinvolved.
Tounderstandtheincreasedoverheadfromsharedstateman-
Fig.11. ImpactsofstatemanagementstrategyforTdic32. agement,weanalyzedtheprocessingtimeforeachstepinAlgo-
rithm2acrosstwoversions.Thisanalysis,showninFig.11(b),
indicatesthemajorityofextracostcomesfromthestateupdating
| theRoviodataset.Ourinvestigationrangedfrombatchsizesof |     |     |     |     |     |     |     | (s2). |       |          |         |         |     |              |      |
| ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | ----- | ----- | -------- | ------- | ------- | --- | ------------ | ---- |
|                                                        |     |     |     |     |     |     |     | step  | Here, | frequent | locking | hampers |     | parallelism, | with |
hundreds to millions of bytes, with the effects on energy con- coresspendingtimeonmemoryaccess–alessenergy-intensive
| sumptionand |     | throughput | depicted | inFig.10(a).The |     |     | studyre- |           |               |     |      |          |     |            |          |
| ----------- | --- | ---------- | -------- | --------------- | --- | --- | -------- | --------- | ------------- | --- | ---- | -------- | --- | ---------- | -------- |
|             |     |            |          |                 |     |     |          | task than | computations. |     | This | accounts | for | the slight | increase |
vealedanoptimalbatchsizethatminimizesenergyconsumption
|     |     |     |     |     |     |     |     | in energy | use compared |     | to the | more | noticeable | throughput | re- |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | --- | ------ | ---- | ---------- | ---------- | --- |
whilemaximizingthroughput.Deviatingfromthisoptimalsize, ductionundersharedstatemanagement.Ourfindingshighlight
| in either | direction, | incurs | higher | energy | costs | and diminishes |     |     |     |     |     |     |     |     |     |
| --------- | ---------- | ------ | ------ | ------ | ----- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
theeffectivenessofprivatestatemanagementinCStreamfor
throughput. This finding stresses the critical role of batch size statefulstreamcompression,improvingthroughputandenergy
optimizationforefficientstreamcompressiononedgedevices. efficiencywithoutgreatlyaffectingthecompressionratio.
Apivotalinsightfromouranalysisistherelationshipbetween
|     |     |     |     |     |     |     |     | 3) VaryingSchedulingStrategy: |     |     |     | Toidentifythebestschedul- |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | ------------------------- | --- | --- | --- |
theoptimalbatchsizeandthecombinedL1Dcachesizeofthe ingstrategy,wecomparedsymmetricandasymmetricmethods
processor cores, illustrated by a red dashed line in Fig. 10(a). Tcomp32
|     |     |     |     |     |     |     |     | using the |     | algorithm |     | and the | Rovio | dataset. | Our fo- |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --------- | --- | ------- | ----- | -------- | ------- |
Thiscorrelationsuggeststhatmicro-batchingstrategiesshould cus was on energy consumption and throughput as shown in
beinformedbythehardware’sL1Dcachecapacitytoenhance Fig. 12(a). Symmetric scheduling led to decreased throughput
| both energy | efficiency |     | and throughput. |     | Further | investigation |     |     |     |     |     |     |     |     |     |
| ----------- | ---------- | --- | --------------- | --- | ------- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
(by26.2%)andincreasedenergyconsumption(by13.4%)com-
intolatencyimplicationsacrossdifferentbatchsizespresented paredtoasymmetricscheduling.Thekeyissuewithsymmetric
| an inverted | U-shaped |     | pattern, | as shown | in  | Fig. 10(b). | This |     |     |     |     |     |     |     |     |
| ----------- | -------- | --- | -------- | -------- | --- | ----------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
schedulingisitsfailuretoaccountforhardwaredifferences,as
| pattern highlights |     | a delicate | balance |     | between | reducing | latency |            |       |         |       |      |         |                     |     |
| ------------------ | --- | ---------- | ------- | --- | ------- | -------- | ------- | ---------- | ----- | ------- | ----- | ---- | ------- | ------------------- | --- |
|                    |     |            |         |     |         |          |         | previously | shown | in Fig. | 5(a). | This | results | in underutilization |     |
and optimizing throughput and energy efficiency. The study of the computational capabilities of more powerful cores. For
| underscores | that | exceeding | the | L1D | cache | size significantly |     |     |     |     |     |     |     |     |     |
| ----------- | ---- | --------- | --- | --- | ----- | ------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
example,Fig.12(b)illustratestheprocessingtimesforbigand
increases latency, likely due to increased cache misses, as in- little cores during the s1 step of the Tcomp32 algorithm. Big
| dicated | by the | red dashed | line | in Fig. | 10(b). | These | findings |     |     |     |     |     |     |     |     |
| ------- | ------ | ---------- | ---- | ------- | ------ | ----- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
coresareseenwaitingforlittlecoresundersymmetricschedul-
| advocate | for a | micro-batching |     | approach | in  | CStream’s | lazy |              |                |     |      |        |        |            |     |
| -------- | ----- | -------------- | --- | -------- | --- | --------- | ---- | ------------ | -------------- | --- | ---- | ------ | ------ | ---------- | --- |
|          |       |                |     |          |     |           |      | ing, causing | inefficiencies |     | that | reduce | energy | efficiency | and |
executionstrategythatisawareoftheL1Dcachesize.Suchan performance.Thus,asymmetricschedulingisrecommended.It
approachnotonlyhelpsinoptimizinglatencybutalsoensures
leveragesthedistinctcomputationalstrengthsofdifferentcores,
improvedthroughputandenergyefficiency.Byadaptingtothe assigning tasks in a way that boosts performance and reduces
| hardware’scapabilities,CStreamnavigates |     |     |     |     |     | thechallengesof |     |             |      |          |             |     |           |     |            |
| --------------------------------------- | --- | --- | --- | --- | --- | --------------- | --- | ----------- | ---- | -------- | ----------- | --- | --------- | --- | ---------- |
|                                         |     |     |     |     |     |                 |     | energy use. | This | approach | outperforms |     | symmetric |     | scheduling |
streamcompressiononedgedevices,strikingabalancebetween
inthroughputandenergyefficiency,provingitseffectivenessin
latency,throughput,andenergyconsumptionwithitsinnovative, streamcompressiontasksonheterogeneousmulti-coresystems.
cache-consciousdesign.
| 2) State  | Management |        | Strategy.    |     | Shared   | vs Private: | In      |                             |     |     |     |     |     |     |     |
| --------- | ---------- | ------ | ------------ | --- | -------- | ----------- | ------- | --------------------------- | --- | --- | --- | --- | --- | --- | --- |
|           |            |        |              |     |          |             |         | E. WorkloadSensitivityStudy |     |     |     |     |     |     |     |
| CStream’s | stateful   | stream | compression, |     | deciding |             | between |                             |     |     |     |     |     |     |     |
sharedorprivatestatemanagementiscrucial.Weanalyzedthis Inthissubsection,weillustratetherobustnessofourframe-
usingtheTdic32algorithmandtheRoviodataset,exploringthe
|     |     |     |     |     |     |     |     | work, CStream, |     | by conducting |     | a comprehensive |     |     | sensitivity |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ------------- | --- | --------------- | --- | --- | ----------- |
implications of each approach. Shared state means all threads analysisbasedonvaryingIoTdataworkloads.Ourgoalistoas-
sesshowCStreamrespondsunderdiversearrivalpatternsand
| access a | common | dictionary, |     | while | private state | assigns | each |     |     |     |     |     |     |     |     |
| -------- | ------ | ----------- | --- | ----- | ------------- | ------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
threaditsowndictionary,asdetailedinSectionIII-A2.Fig.11(a) differinglevelsofdatacompressibility.Ourevaluationutilizes
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

ZENGANDZHANG:CSTREAM:PARALLELDATASTREAMCOMPRESSIONONMULTICOREEDGEDEVICES 5901
Fig.15. Impactsoftupleduplicationforstateless(Tcomp32)andstateful
Fig.13. ImpactsofarrivalpatternforTcomp32.
streamcompression(Tdic32).
and(b)showthethroughputandcompressionratiorespectively
forvaryinglevelsofstatefulcompressibility.Astheduplication
ratioincreases,thestatefulTdic32experienceshigherthrough-
|     |     |     |     |     |     |     | put and | a higher | compression |     | ratio | due to | less frequent |     | state |
| --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ----------- | --- | ----- | ------ | ------------- | --- | ----- |
updatesandfewerbitsofcompresseddataoutput.Incompari-
son,thestatelessTcomp32islargelyunaffectedbychangesin
| Fig. 14.                   | Impacts of | dynamic | range for | stateless | (Tcomp32) | and stateful |                          |     |     |     |     |     |     |     |     |
| -------------------------- | ---------- | ------- | --------- | --------- | --------- | ------------ | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
| streamcompression(Tdic32). |            |         |           |           |           |              | statefulcompressibility. |     |     |     |     |     |     |     |     |
F. Summary
Tcomp32
| the       | algorithm   |         | to compress | the | Rovio       | dataset while |                   |          |     |               |      |                 |     |              |      |
| --------- | ----------- | ------- | ----------- | --- | ----------- | ------------- | ----------------- | -------- | --- | ------------- | ---- | --------------- | --- | ------------ | ---- |
|           |             |         |             |     |             |               | Our comprehensive |          |     | investigation |      | and evaluations |     | have         | elu- |
| adjusting | the arrival | pattern | of tuples,  | and | a synthetic | dataset,      |                   |          |     |               |      |                 |     |              |      |
|           |             |         |             |     |             |               | cidated           | a number | of  | key insights  | that | underline       |     | the efficacy |      |
Micro,forevaluatingtheimpactofdatacompressibility.
|            |          |     |                  |     |        |              | of our novel |        | CStream   | framework, |     | and       | are summarized |     | in  |
| ---------- | -------- | --- | ---------------- | --- | ------ | ------------ | ------------ | ------ | --------- | ---------- | --- | --------- | -------------- | --- | --- |
| 1) Arrival | Pattern: |     | Arrival patterns | of  | tuples | can signifi- |              |        |           |            |     |           |                |     |     |
|            |          |     |                  |     |        |              | Table V.     | First, | algorithm | diversity  |     | in stream | compression    |     | re- |
cantlyaffecttheperformanceofstreamcompressionalgorithms.
vealsnosinglealgorithmreignssupreme;thechoicehingeson
BymanipulatingtheorderoftimestampsintheRoviodataset,we
applicationneedsandworkloadnature.Lossycompressionoften
areabletomodifythetuplearrivalcharacteristicswhilekeeping
deliverssuperiorcompressionratioswithminimalintegrityloss.
otherparametersconstant.
|     |     |     |     |     |     |     | CStream’s | adaptability |     | facilitates |     | the integration |     | of diverse |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | --- | ----------- | --- | --------------- | --- | ---------- | --- |
TheimpactofvaryingarrivalratesisdepictedinFig.13(a).
|     |     |     |     |     |     |     | algorithms | to  | meet specific | IoT | application |     | demands. | Second, |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------------- | --- | ----------- | --- | -------- | ------- | --- |
Here,thearrivalrateoftuplesvariesfrom500to106persecond.
efficientparallelizationiscrucial.CStream’sstrategicprinci-
| When the | arrival | rate | is low, the | hardware | is  | underutilized, |             |         |                 |     |     |             |     |           |     |
| -------- | ------- | ---- | ----------- | -------- | --- | -------------- | ----------- | ------- | --------------- | --- | --- | ----------- | --- | --------- | --- |
|          |         |      |             |          |     |                | ples ensure | optimal | parallelization |     |     | granularity | and | implement |     |
resultinginincreasedprocessinglatency.Thisunderutilizationis
|     |     |     |     |     |     |     | acache-aware |     | strategy, | avoiding | potential | penalties |     | up to11x. |     |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | --------- | -------- | --------- | --------- | --- | --------- | --- |
duetomorecyclesofperiodicalDDR4refreshing[74],leading
Third,leveragingasymmetric64-bitRISCedgeprocessorsof-
toincreasedoverhead.Conversely,whenthearrivalrateishigh,
fersnotablelatencyandenergyefficiencybenefits.CStream’s
| processing | latency | increases | due to | resource | conflicts, | such as |               |     |            |             |     |            |     |          |     |
| ---------- | ------- | --------- | ------ | -------- | ---------- | ------- | ------------- | --- | ---------- | ----------- | --- | ---------- | --- | -------- | --- |
|            |         |           |        |          |            |         | design aligns |     | with these | processors, |     | optimizing |     | resource | use |
cachemisses.
|     |     |     |     |     |     |     | through | frequency | and | core | regulation. | In  | summary, | effective |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | --------- | --- | ---- | ----------- | --- | -------- | --------- | --- |
Fig.13(b)showstheimpactofvaryinglevelsofarrivalskew-
|     |     |     |     |     |     |     | IoT stream | compression |     | systems |     | must adapt | to  | workloads, |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ----------- | --- | ------- | --- | ---------- | --- | ---------- | --- |
nessonthelatencyofTcomp32.Arrivalskewnessisvariedby
|     |     |     |     |     |     |     | select optimal |     | compression | methods, |     | fine-tune | parallelization, |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ----------- | -------- | --- | --------- | ---------------- | --- | --- |
adjustingtheZipffactorfrom0to1.Increasedskewnessleadsto
andefficientlymanageprocessorresources.CStreamexcelsin
higherlatenciesasbothunder-utilizationandoverloadingcases
theseaspects,redefiningstreamcompressionstandardsforIoT
becomemoreprevalent.
analytics.
| 2) Data              | Compressibility: |            | We further      |     | assess  | the impact of |     |     |     |             |     |     |     |     |     |
| -------------------- | ---------------- | ---------- | --------------- | --- | ------- | ------------- | --- | --- | --- | ----------- | --- | --- | --- | --- | --- |
| data compressibility |                  | on         | the performance |     | of both | stateless and |     |     |     |             |     |     |     |     |     |
|                      |                  |            |                 |     |         |               |     |     | VI. | RELATEDWORK |     |     |     |     |     |
| stateful compression |                  | algorithms | using           | the | Micro   | dataset. The  |     |     |     |             |     |     |     |     |     |
statelessTcomp32andstatefulTdic32compressionalgorithms Our work, CStream, draws on and extends the significant
are chosen for this analysis. Stateless compressibility can be contributionsmadebypreviousstudiesinthedomains ofdata
exploited by analyzing a single piece of input data without compression, parallel data compression, and asymmetric ar-
referringtoastate.Fig.14(a)and (b)showthethroughputand chitecture utilization at the edge [13], [14], [17], [20], [75],
compression ratio respectively for varying levels of stateless [76], [77], [78], [79], [80]. While these works lay a robust
compressibility. For the stateless Tcomp32, as the dynamic groundwork,theydonotentirelycatertothedistinctdemandsof
rangeincreases,itbecomesmorecostlyandlesscompressible. streamcompressionintheedgecomputingcontextintrinsicto
However,Tdic32exhibitsa“cliffeffect”ataround212,corre-
IoT.Ourframework,CStream,buildsuponthesefundamental
spondingtoitsdictionaryentries.Beforethisthreshold,Tdic32 studies and refines them to fulfill the distinct requirements of
achieveshighercompressibilityandlowerlatency,afterwhich edge-basedstreamcompression.
thecompressibilitybecomesnearlyconstant. DataCompressionAlgorithmStudies:Previousresearch[13],
Statefulcompressibility,ontheotherhand,canbedetectedby [14], [17], [20], [75], [76], [77], [78], [79], [80] on data
referencing the history of the compression process. Fig. 15(a) compression, focused on database size reduction and
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

5902 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
TABLEV
COMPARATIVESUMMARYOFTRADITIONALMETHODSANDCStreamFRAMEWORK
application-specific strategies, often overlooks the nuances of selection mechanism through the integration of cutting-edge
streamcompressionattheedge,suchascontinuousdataarrival machine learning techniques and to evaluate the potential of
and energy efficiency, vital in edge computing. Recent work bespokehardwareacceleratorsinfurtherelevatingCStream’s
onPiecewiseLinearApproximation(PLA)foredgecomputing performanceandenergyefficiency.Moreover,futureworkwill
marks a significant advance, addressing PLA’s application to considertheapplicationofCStreaminenhancingsystemde-
numerical timestamped streams and its traditional challenges velopment,particularlyinfacilitatingmoreeffectivecloud-edge
| likedatainflationandlatency.Yet,itstillmissesoutonenergy |         |                  |           |     |               |        | interaction. |     |     |     |     |     |     |
| -------------------------------------------------------- | ------- | ---------------- | --------- | --- | ------------- | ------ | ------------ | --- | --- | --- | --- | --- | --- |
| considerations                                           | crucial | for edge         | scenarios |     | [7]. CStream  | aims   |              |     |     |     |     |     |     |
| to bridge these                                          | gaps    | by concentrating |           | on  | the perpetual | stream |              |     |     |     |     |     |     |
of data, encompassing various data use-cases, and prioritizing REFERENCES
| energy efficiency. |     | By integrating |     | these aspects, |     | CStream ad- |     |     |     |     |     |     |     |
| ------------------ | --- | -------------- | --- | -------------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
[1] G.Pekhimenko,C.Guo,M.Jeon,P.Huang,andL.Zhou,“Tersecades:
vancesthedomainofstreamcompressioninIoTedgecomput-
|     |     |     |     |     |     |     | Efficient | data compression | in  | stream processing,” |     | in Proc. | USENIX |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---------------- | --- | ------------------- | --- | -------- | ------ |
ing,offeringasolutionthatisbothcomprehensiveandtailored Annu. Tech. Conf., Boston, MA, USA: USENIX Association, 2018,
toedge-specificrequirements. pp. 307–320. [Online]. Available: https://www.usenix.org/conference/
atc18/presentation/pekhimenko
ExploitingAsymmetricArchitectureattheEdge:Asymmetric [2] P.R.Geethakumarietal.,“Streamzip:Compressedsliding-windowsfor
architectures have been demonstrated to be highly effective stream aggregation,” in Proc. Int. Conf. Field-Programmable Technol.,
in delivering high-performance computation with energy effi- 2021,pp.1–9.
[3] X.ZengandS.Zhang,“Ahardware-consciousstatefulstreamcompression
ciency,acrucialdemandinedgecomputing[41],[48],[53],[71], frameworkforIoTapplications(vision),”inProc.ACMInt.Conf.Distrib.
[72],[73],[81],[82],[83],[84].Whilesignificantadvancements Event-BasedSyst.,2023,pp.7–12.
havebeenmadeincomprehendingandmanagingasymmetryin [4] X.ZengandS.Zhang,“ParallelizingstreamcompressionforIoTapplica-
tionsonasymmetricmulticores,”inProc.IEEE39rdInt.Conf.DataEng.,
| workload | scheduling | [53], | [72], [85], | no  | studies | have specif- |     |     |     |     |     |     |     |
| -------- | ---------- | ----- | ----------- | --- | ------- | ------------ | --- | --- | --- | --- | --- | --- | --- |
2023,pp.950–964.
ically explored stream compression tasks. CStream fills this [5] Y.Lietal.,“Camel:Managingdataforefficientstreamlearning,”inProc.
Int.Conf.Manage.Data,2022,pp.1271–1285.
researchgapbyleveragingthefine-grainedbehaviorofstream
|     |     |     |     |     |     |     | [6] S. Zeuch | et al., “The | nebulastream | platform | for data | and | application |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ------------ | ------------ | -------- | -------- | --- | ----------- |
compressionalgorithmsandthepotentialimpactofworkloads
managementintheinternetofthings,”inProc.10thConf.Innov.Data
onasymmetricarchitectureutilization.
Syst.Res.,Amsterdam,TheNetherlands,2020.[Online].Available:http:
//cidrdb.org/cidr2020/papers/p7-zeuch-cidr20.pdf
[7] R.Duvignau,V.Gulisano,M.Papatriantafilou,andV.Savic,“Streaming
|     |     | VII. | CONCLUSION |     |     |     |           |                      |     |               |                 |     |         |
| --- | --- | ---- | ---------- | --- | --- | --- | --------- | -------------------- | --- | ------------- | --------------- | --- | ------- |
|     |     |      |            |     |     |     | piecewise | linear approximation |     | for efficient | data management |     | in edge |
computing,”inProc.34thACM/SIGAPPSymp.Appl.Comput.,NewYork,
ThispaperpresentsCStream,aframeworkdesignedtoboost
|     |     |     |     |     |     |     | NY, USA: | Association | for Computing | Machinery, | 2019, | pp. | 593–596, |
| --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | ------------- | ---------- | ----- | --- | -------- |
streamcompressiononmulticoreedgedevices.Byintegratinga doi:10.1145/3297280.3297552.
suite of compression algorithms and exploiting the strengths [8] M.Bansal,I.Chana,andS.Clarke,“AsurveyonIoTbigdata:Current
|                   |     |                |     |           |     |                | status, | 13 v’s challenges, | and | future directions,” | ACM | Comput. | Surv., |
| ----------------- | --- | -------------- | --- | --------- | --- | -------------- | ------- | ------------------ | --- | ------------------- | --- | ------- | ------ |
| of both symmetric |     | and asymmetric |     | multicore |     | architectures, |         |                    |     |                     |     |         |        |
vol.53,no.6,2020,doi:10.1145/3419634.
CStreamtacklesthehurdlesinherentinIoTedgecomputing.
[9] ArmsolutionsforIoT,2021,Accessed:May10,2021.[Online].Available:
https://www.arm.com/solutions/iot
| It seeks to | achieve | unparalleled |     | compression | ratios, | elevated |     |     |     |     |     |     |     |
| ----------- | ------- | ------------ | --- | ----------- | ------- | -------- | --- | --- | --- | --- | --- | --- | --- |
[10] Rockchipwikirk3399,2021,Accessed:May10,2021.[Online].Avail-
| throughput, | reduced | latency, | and | minimized | energy | consump- |     |     |     |     |     |     |     |
| ----------- | ------- | -------- | --- | --------- | ------ | -------- | --- | --- | --- | --- | --- | --- | --- |
able:http://opensource.rock-chips.com/wiki_RK3399
| tion. Our | assessments | confirm | CStream’s |     | exceptional | effi- |     |     |     |     |     |     |     |
| --------- | ----------- | ------- | --------- | --- | ----------- | ----- | --- | --- | --- | --- | --- | --- | --- |
[11] Allwinnersocfamily,2013,Accessed:May10,2022.[Online].Available:
ciency:comparedtoanintuitivesolutionwith1)randomchoice https://linux-sunxi.org/Allwinner_SoC_Family
[12] Intelatomx5-z8350processor,2021,Accessed:May10,2022.[Online].
| of stream | compression | algorithms |     | [14], | [32], | [33], 2) lock- |     |     |     |     |     |     |     |
| --------- | ----------- | ---------- | --- | ----- | ----- | -------------- | --- | --- | --- | --- | --- | --- | --- |
Available:https://ark.intel.com/content/www/us/en/ark/products/93361/
basedparallelization[86]and3)coarse-grained,compression- intel-atom-x5z8350-processor-2m-cache-up-to-1-92-ghz.html
oblivious hardware resource management [53], it realizes a [13] D. Abadi, S. Madden, and M. Ferreira, “Integrating compression and
executionincolumn-orienteddatabasesystems,”inProc.ACMSIGMOD
compressionratioof2.8×withnegligibleinformationloss,en-
Int.Conf.Manage.Data,2006,pp.671–682.
hancesthroughputby4.3×,andsubstantiallydiminisheslatency
|     |     |     |     |     |     |     | [14] D. Blalock, | S. Madden, | and J. | Guttag, “Sprintz: | Time | series | compres- |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | ---------- | ------ | ----------------- | ---- | ------ | -------- |
(by65%)andenergyuse(by89%).Thesefindingsunderscore sionfortheInternetofThings,”Proc.ACMInterAct.MobileWearable
UbiquitousTechnol.,vol.2,no.3,pp.1–23,2018.
the benefits of a cohesive approach to software and hardware [15] zlibhomepage,2017,Accessed:Jun.29,2021,[Online].Available:http:
design.Lookingahead,weaimtorefineCStream’salgorithm //www.zlib.net/
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore.  Restrictions apply.

ZENGANDZHANG:CSTREAM:PARALLELDATASTREAMCOMPRESSIONONMULTICOREEDGEDEVICES 5903
[16] J.ZivandA.Lempel,“Compressionofindividualsequencesviavariable- [45] S.Yangetal.,“Adaptiveenergyminimizationofembeddedheterogeneous
rate coding,” IEEE Trans. Inf. Theory, vol. 24, no. 5, pp. 530–536, systems using regression-based learning,” in Proc. 25th Int. Workshop
Sep.1978. PowerTimingModel.Optim.Simul.,2015,pp.103–110.
[17] J.Wang,C.Lin,Y.Papakonstantinou,andS.Swanson,“Anexperimental [46] W. Wolff and B. Porter, “Performance optimization on big.little archi-
studyofbitmapcompressionversus.invertedlistcompression,”inProc. tectures:Amemory-latencyawareapproach,”inProc.21stACMSIG-
ACMInt.Conf.Manage.Data,2017,pp.993–1008. PLAN/SIGBEDConf.Lang.sCompilersToolsEmbeddedSyst.,NewYork,
[18] Dalvik executable format in android, 2020, Accessed: May 29, 2022, NY,USA:AssociationforComputingMachinery,2020,pp.51–61.[On-
[Online].Available:https://source.android.com/devices/tech/dalvik/dex- line].Available:https://doi.org/10.1145/3372799.3394370
format.html [47] H. Ribic and Y. D. Liu, “Energy-efficient work-stealing language run-
[19] Y.Zhou,Z.Vagena,andJ.Haustad,“Disseminationofmodelsovertime- times,” SIGARCH Comput. Archit. News, vol. 42, no. 1, pp. 513–528,
varyingdata,”Proc.VLDBEndowment,vol.4,no.11,pp.864–875,2011. Feb.2014,doi:10.1145/2654822.2541971.
[20] T.Lu,W.Xia,X.Zou,andQ.Xia,“Adaptivelycompressing{IoT}data [48] T. Somu Muthukaruppan, A. Pathania, and T. Mitra, in Price The-
ontheresource-constrainededge,”inProc.3rdUSENIXWorkshopHot ory Based Power Manage. for Heterogeneous Multi-Cores, New York,
Top.EdgeComput.,2020. NY, USA: Association for Computing Machinery, 2014, pp. 161–176,
[21] Mit-bihdatabasedistribution,2005,Accessed:Jun.29,2021,[Online]. doi:10.1145/2541940.2541974.
Available:http://ecg.mit.edu/ [49] S. Yamagiwa, E. Hayakawa, and K. Marumo, Adaptive Entropy Cod-
[22] Creatoroftheangrybirdsgame,2019,Accessed:May10,2021,[Online]. ing Method for Stream-Based Lossless Data Compression. New York,
Available:www.rovio.com NY, USA: Association for Computing Machinery, 2020, pp. 265–268,
[23] Shanghaistockexchange,2018,Accessed:Nov.12,2021,[Online].Avail- doi:10.1145/3387902.3394037.
able:http://english.sse.com.cn/ [50] S.Yamagiwa,R.Morita,andK.Marumo,“Bankselectmethodforreduc-
[24] Beach weather stations - automated sensors, 2021, Accessed: Nov. ingsymbolsearchoperationsonstream-basedlosslessdatacompression,”
12, 2021, [Online]. Available: https://catalog.data.gov/dataset/beach- inProc.DataCompressionConf.,2019,pp.611–611.
weather-stations-automated-sensors/resource/3b820f68-4dca-4ea7- [51] M. Zaharia, M. Chowdhury, M. J. Franklin, S. Shenker, and I. Stoica,
8141-f37d9237734d “Spark: Cluster computing with working sets,” in Proc. 2nd USENIX
[25] Tracetogether, safer together, 2021, Accessed: Nov. 7, 2021, [Online]. WorkshopHotTop.CloudComput.,2010.
Available:https://www.tracetogether.gov.sg/ [52] S. Albers and H. Fujiwara, “Energy-efficient algorithms for flow time
[26] D. Reinsel et al., “The digitization of the world from edge to core,” minimization,”ACMTrans.Algorithms,vol.3,no.4,pp.49–65,2007.
Framingham:Int.DataCorporation,vol.16,pp.1–28,2018. [53] M.Wang,S.Ding,T.Cao,Y.Liu,andF.Xu,“Asymo:Scalableandefficient
[27] S.Zhang,J.He,A.C.Zhou,andB.He,“Briskstream:Scalingdatastream deep-learninginferenceonasymmetricmobilecpus,”inProc.27thAnnu.
processingonshared-memorymulticorearchitectures,”inProc.Int.Conf. Int.Conf.MobileComput.Netw.,2021,pp.215–228.
Manage.Data,2019,pp.705–722. [54] S.Zhang,Y.Wu,F.Zhang,andB.He,“Towardsconcurrentstatefulstream
[28] B.Heetal.,“Relationalquerycoprocessingongraphicsprocessors,”ACM processingonmulticoreprocessors,”inProc.IEEE36thInt.Conf.Data
Trans.DatabaseSyst.,vol.34,no.4,pp.1–39,2009. Eng.,2020,pp.1537–1548.
[29] A.Ukil,S.Bandyopadhyay,andA.Pal,“IoTdatacompression:Sensor- [55] C.-Y.Wei,Y.-T.Hong,andC.-J.Lu,“Onlinereinforcementlearningin
agnosticapproach,”inProc.DataCompressionConf.,2015,pp.303–312. stochasticgames,”inProc.Adv.NeuralInf.Process.Syst.,2017.
[30] (2020) Eclipse IoT working group. IoT developer survey 2018. 2018. [56] INA226,2021,Accessed:Nov.12,2021.[Online].Available:https://www.
[Online].Available:https://https://blogs.eclipse.org/post/benjamin-cab% ti.com/product/INA226
C3%A9/key-trends-iotdeveloper-survey-2018 [57] ESD32S2,2021,Accessed:Nov.12,2021.[Online].Available:https://
[31] C.Baskinetal.,“Uniq:Uniformnoiseinjectionfornon-uniformquanti- www.espressif.com/en/products/socs/esp32-s2
zationofneuralnetworks,”ACMTrans.Comput.Syst.,vol.37,no.1/4, [58] Intel 64 and ia-32 architectures software developer’s manual, 2016,
pp.1–15,2021. Accessed: Mar. 12, 2021, [Online]. Available: https://www.intel.
[32] P.Elias,“Universalcodewordsetsandrepresentationsoftheintegers,” com/content/dam/www/public/us/en/documents/manuals/64-ia-32-
IEEETrans.Inf.Theory,vol.21,no.2,pp.194–203,Mar.1975. architectures-software-developer-vol-3b-part-2-manual.pdf
[33] lz4sourcecode,2021,Accessed:Jul.25,2021.[Online].Available:https: [59] H.Han,Y.Li,andX.Guo,“Useridentity-aidedpilotaccessschemefor
//github.com/lz4/lz4/ massivemimo-idmasystemxf,”IEEETrans.Veh.Technol.,vol.68,no.6,
[34] D.A.Huffman,“Amethodfortheconstructionofminimum-redundancy pp.6197–6201,Jun.2019.
codes,”Proc.IRE,vol.40,no.9,pp.1098–1101,Sep.1952. [60] Y.Taietal.,“Towardshighlyaccurateandstablefacealignmentforhigh-
[35] A.Guptaetal.,“Modernlosslesscompressiontechniques:Review,com- resolutionvideos,”inProc.AAAIConf.Artif.Intell.,2019,pp.8893–8900.
parisonandanalysis,”inProc.2ndInt.Conf.Elect.Comput.Commun. [61] S. Zauli-Sajani, S. Marchesi, C. Pironi, C. Barbieri, V. Poluzzi, and
Technol.,2017,pp.1–8. A.Colacci,“Assessmentofairqualitysensorsystemperformanceafter
[36] A.Moffat,“Huffmancoding,”ACMComput.Surv.,vol.52,no.4,pp.1–35, relocation,”AtmosphericPollut.Res.,vol.12,no.2,pp.282–291,2021.
2019. [62] D.A.JacobsandD.P.Ferris,“Estimationofgroundreactionforcesand
[37] G.Pekhimenko,V.Seshadri,O.Mutlu,M.A.Kozuch,P.B.Gibbons,andT. anklemomentwithmultiple,low-costsensors,”J.NEur.–2–>Rehabil.,
C.Mowry,“Base-delta-immediatecompression:Practicaldatacompres- vol.12,no.1,pp.1–12,2015.
sionforon-chipcaches,”inProc.21stInt.Conf.ParallelArchitectures [63] E.ShahabpoorandA.Pavic,“Estimationofverticalwalkinggroundreac-
CompilationTechn.,2012,pp.377–388. tionforceinreal-lifeenvironmentsusingsingleimusensor,”J.Biomech.,
[38] Upboardseries,2021,Accessed:May10,2021.[Online].Available:https: vol.79,pp.181–190,2018.
//up-board.org/up/specifications/ [64] S.Zhangetal.,“Parallelizingintra-windowjoinonmulticores:Anexper-
[39] Y.Dua,V.Kumar,andR.S.Singh,“ParallellosslessHSIcompression imentalstudy,”inProc.Int.Conf.Manage.Data,2021,pp.2089–2101.
basedonRLSfilter,”J.ParallelDistrib.Comput.,vol.150,pp.60–68, [65] ROCK pi 4 wiki, 2021, Accessed: May 10, 2021, [Online]. Available:
2021. https://wiki.radxa.com/Rockpi4
[40] V.Pankratius,A.Jannesari,andW.F.Tichy,“Parallelizingbzip2:Acase [66] Gettingstartedwithp2-zero,2021,Accessed:May10,2021,[Online].
study in multicore software engineering,” IEEE Softw., vol. 26, no. 6, Available:https://wiki.banana-pi.org/Getting_Started_with_P2-Zero
pp.70–77,Nov./Dec.2009. [67] Getting started with jetson agx orin developer kit, 2023, Accessed:
[41] S.Mittal,“Asurveyoftechniquesforarchitectingandmanagingasymmet- Feb.5,2024,[Online].Available:https://developer.nvidia.com/embedded/
ricmulticoreprocessors,”ACMComput.Surv.s,vol.48,no.3,pp.1–38, learn/get-started-jetson-agx-orin-devkit
2016. [68] S. Williams, A. Waterman, and D. Patterson, “Roofline: An insightful
[42] W.Zhangetal.,“ELF:Acceleratehigh-resolutionmobiledeepvisionwith visualperformancemodelformulticorearchitectures,”Commun.ACM,
content-awareparalleloffloading,”inProc.27thAnnu.Int.Conf.Mobile vol.52,no.4,pp.65–76,2009.
Comput.Netw.,2021,pp.201–214. [69] Y.J.Loetal.,“Rooflinemodeltoolkit:Apracticaltoolforarchitecturaland
[43] Z.Panetal.,“Exploringdataanalyticswithoutdecompressiononem- programanalysis,”inProc.Int.WorkshopPerform.Model.Benchmarking
beddedgpusystems,”IEEETrans.ParallelDistrib.Syst.,vol.33,no.7, Simul.HighPerform.Comput.Syst.,2014,pp.129–148.
pp.1553–1568,Jul.2022. [70] S. Balakrishnan, R. Rajwar, M. Upton, and K. Lai, “The impact of
[44] Dra829j-q1asymmetricprocessor,2022,Accessed:May10,2022,[On- performance asymmetry in emerging multicore architectures,” in Proc.
line].Available:https://www.ti.com/product/DRA829J-Q1 32ndInt.Symp.onComput.Architecture,2005,pp.506–517.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore. Restrictions apply.

5904 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.36,NO.11,NOVEMBER2024
[71] M. Pricopi, T. S. Muthukaruppan, V. Venkataramani, T. Mitra, and S. [79] M.Bhardeetal.,“{Store-Edge}{RippleStream}:Versatileinfrastructure
Vishin, “Power-performance modeling on asymmetric multi-cores,” in for {IoT} data transfer,,” in Proc. USENIX Workshop Hot Top. Edge
Proc. Int. Conf. Compilers Architecture Synth. Embedded Syst., 2013, Comput.,2018.
pp.1–10. [80] F. Eichinger, P. Efros, S. Karnouskos, and K. Böhm, “A time-series
[72] T.Yuetal.,“Collaborativeheterogeneity-awareOSschedulerforasym- compressiontechniqueanditsapplicationtothesmartgrid,”VLDBJ.,
metricmulticoreprocessors,”IEEETrans.ParallelDistrib.Syst.,vol.32, vol.24,no.2,pp.193–218,2015.
no.5,pp.1224–1237,May2021. [81] N.Mishra,C.Imes,J.D.Lafferty,andH.Hoffmann,“Caloree:Learning
[73] K. Van Craeynest, A. Jaleel, L. Eeckhout, P. Narvaez, and J. Emer, controlforpredictablelatencyandlowenergy,”ACMSIGPLANNotices,
“Schedulingheterogeneousmulti-coresthroughperformanceimpactesti- vol.53,no.2,pp.184–198,2018.
mation(pie),”inProc.39thAnnu.Int.Symp.Comput.Architecture,2012, [82] B.Salami,H.Noori,andM.Naghibzadeh,“Fairness-awareenergyeffi-
pp.213–224. cientschedulingonheterogeneousmulti-coreprocessors,”IEEETrans.
[74] J. Mukundan, H. Hunter, K.-H. Kim, J. Stuecheli, and J. F. Martínez, Comput.,vol.70,no.1,pp.72–82,2020.
“Understandingandmitigatingrefreshoverheadsinhigh-densityDDR4 [83] M. E. Haque, Y. He, S. Elnikety, T. D. Nguyen, R. Bianchini, and K.
dramsystems,”ACMSIGARCHComput.ArchitectureNews,vol.41,no.3, S. McKinley, “Exploiting heterogeneity for tail latency and energy ef-
pp.48–59,2013. ficiency,”inProc.50thAnnu.IEEE/ACMInt.Symp.Microarchitecture,
[75] M.A.RothandS.J.VanHorn,“Databasecompression,”ACMSIGMOD 2017,pp.625–638.
Rec.,vol.22,no.3,pp.31–39,1993. [84] Q.Zeng,Y.Du,K.Huang,andK.K.Leung,“Energy-efficientresource
[76] T.Westmann,D.Kossmann,S.Helmer,andG.Moerkotte,“Theimple- managementforfederatededgelearningwithCPU-GPUheterogeneous
mentationandperformanceofcompresseddatabases,”ACMSigmodRec., computing,”IEEETrans.WirelessCommun.,vol.20,no.12,pp.7947–
vol.29,no.3,pp.55–67,2000. 7962,Dec.2021.
[77] P.Damme,A.Ungethüm,J.Hildebrandt,D.Habich,andW.Lehner,“From [85] Y.ZhuandV.J.Reddi,“High-performanceandenergy-efficientmobile
acomprehensiveexperimentalsurveytoacost-basedselectionstrategyfor webbrowsingonbig/littlesystems,”inProc.IEEE19thInt.Symp.High
lightweightintegercompressionalgorithms,”ACMTrans.DatabaseSyst., Perform.Comput.Architecture,2013,pp.13–24.
vol.44,no.3,pp.1–46,2019. [86] D.Wang,E.A.Rundensteiner,andR.T.EllisonIII,“Activecomplexevent
[78] K.Iqbal,N.Khan,andM.G.Martini,“Performancecomparisonoflossless processingovereventstreams,”Proc.VLDBEndowment,vol.4,no.10,
compressionstrategiesfordynamicvisionsensordata,”inProc.IEEEInt. pp.634–645,2011.
Conf.Acoust.SpeechSignalProcess.,2020,pp.4427–4431.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on March 14,2026 at 02:22:02 UTC from IEEE Xplore. Restrictions apply.