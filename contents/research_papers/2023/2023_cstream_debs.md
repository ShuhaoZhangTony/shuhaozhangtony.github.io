| A Hardware-Conscious |                                    |           |             |     |     |     | Stateful |              | Stream                   |             | Compression |     |     |     |
| -------------------- | ---------------------------------- | --------- | ----------- | --- | --- | --- | -------- | ------------ | ------------------------ | ----------- | ----------- | --- | --- | --- |
|                      |                                    | Framework |             |     | for | IoT |          | Applications |                          |             | (Vision)    |     |     |     |
|                      |                                    |           | XianzhiZeng |     |     |     |          |              |                          | ShuhaoZhang |             |     |     |     |
|                      | xianzhi_xianzhi@mymail.sutd.edu.sg |           |             |     |     |     |          |              | shuhao_zhang@sutd.edu.sg |             |             |     |     |     |
SingaporeUniversityofTechnologyandDesign SingaporeUniversityofTechnologyandDesign
|             |             |     | Singapore |           |      |          |     |     |     |     | Singapore          |     |     |     |
| ----------- | ----------- | --- | --------- | --------- | ---- | -------- | --- | --- | --- | --- | ------------------ | --- | --- | --- |
| Abstract    |             |     |           |           |      |          |     |     |     |     | Stream compression |     |     |     |
| Data stream | compression |     | has       | attracted | vast | interest | in  |     |     |     |                    |     |     |     |
Temperature
| emerging | IoT | (Internet | of Things) | applications. |     | However, |     |     |     |     |     |     |     |     |
| -------- | --- | --------- | ---------- | ------------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
Humidity
| adopting | stream | compression |     | on  | IoT applications |     | is  |     |     |     |     |     | OnlineML |     |
| -------- | ------ | ----------- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- | -------- | --- |
Compressed
| non-trivial | due          | to the | divergent        |     | demands, | i.e.,    | low  |     |     |            |     |            |     |     |
| ----------- | ------------ | ------ | ---------------- | --- | -------- | -------- | ---- | --- | --- | ---------- | --- | ---------- | --- | --- |
|             |              |        |                  |     |          |          |      |     |     | Datastream |     | datastream |     |     |
| energy      | consumption, |        | high throughput, |     | low      | latency, | high |     |     |            |     |            |     |     |
Toxicgas
| compressibility, |     | and | tolerable | information |     | loss, | which |     |     |     |           |     |          |     |
| ---------------- | --- | --- | --------- | ----------- | --- | ----- | ----- | --- | --- | --- | --------- | --- | -------- | --- |
|                  |     |     |           |             |     |       |       |     |     |     | IoTdevice |     | OnlineDB |     |
sometimes conflict with each other. This is particularly Windspeed Cloud data center
challenging when adopting stateful stream compression Figure1.Streamcompressionmaybeappliedduringreal-
algorithms, which rely on states, e.g., a dictionary or timedatagatheringbythepatroldronewherehumanscan
CStream,
| model. | This paper | presents |     | our vision | of  |     | a   | notenter. |     |     |     |     |     |     |
| ------ | ---------- | -------- | --- | ---------- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- |
hardware-consciousstatefulstreamcompressionframework
forIoTapplications.Throughcarefulhardware-conscious
|     |     |     |     |     |     |     |     | 1 Introduction |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- |
optimizations,CStreamwillminimizeenergyconsumption
|     |     |     |     |     |     |     |     | Data | stream compression, |     | i.e., | continuously | compressing |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | ------------------- | --- | ----- | ------------ | ----------- | --- |
whilestrivingtosatisfythedivergentperformancedemands
|                   |     |         |          |     |        |             |     | input      | data tuples, | attracts | much    | attention         | recently | [5, 8],  |
| ----------------- | --- | ------- | -------- | --- | ------ | ----------- | --- | ---------- | ------------ | -------- | ------- | ----------------- | -------- | -------- |
| for parallelizing |     | complex | stateful |     | stream | compression |     |            |              |          |         |                   |          |          |
|                   |     |         |          |     |        |             |     | especially | due          | to the   | rise of | IoT applications. |          | Figure 1 |
algorithmsforIoTapplications.
demonstratesanIoTusecase[21]wherestreamcompression
ishighlyattractivetobeadopted.Inthisapplication,real-
| CCSConcepts: |     | •Streamsandcomplexeventprocessing |     |     |     |     |     |     |     |     |     |     |     |     |
| ------------ | --- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
timedatastreams(e.g.,toxicgas,temperature)frommassive
StatefulStreamCompression;•Emerginghardware
| →   |     |     |     |     |     |     |     | IoTsensors,deployedindangerousareas,arecontinuously |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- |
IoTdevices.
| →         |                                        |     |     |     |     |     |     | gatheredbymemory-limited,battery-poweredpatroldrones |               |     |        |              |           |     |
| --------- | -------------------------------------- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | ------------- | --- | ------ | ------------ | --------- | --- |
|           |                                        |     |     |     |     |     |     | (i.e.,                                               | IoT devices). | To  | reduce | transmission | overhead, | the |
| Keywords: | Streamcompression,IoTandEdgeComputing, |     |     |     |     |     |     |                                                      |               |     |        |              |           |     |
dronemaycompressinputstreamsbyitsequippedmulticore
AsymmetricandHeterogeneousHardware
processors[21]beforepassingthemtodownstreamonline
IoTanalytictasks,suchasonlineaggregation[8],andonline
ACMReferenceFormat:
XianzhiZengandShuhaoZhang.2023.AHardware-Conscious machinelearning[7]inthecloud.
Stateful Stream Compression Framework for IoT Applications Parallelizing stream compression on IoT devices, such
(Vision).InThe17thACMInternationalConferenceonDistributed as the wireless patrol drone in Figure 1, is mandatory
andEvent-basedSystems(DEBS’23),June27–30,2023,Neuchatel, to meet the strict high-throughput and low-latency
Switzerland.ACM,NewYork,NY,USA,6pages.https://doi.org/10. processing requirement. However, it is a non-trivial
1145/3583678.3596885
|     |     |     |     |     |     |     |     | task | as it involves |     | divergent, | sometimes |     | conflicting, |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | -------------- | --- | ---------- | --------- | --- | ------------ |
additionaldemandsincludinglowenergyconsumption[22],
|     |     |     |     |     |     |     |     | high | compression | ratio | [7], | and tolerable | information |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | ----------- | ----- | ---- | ------------- | ----------- | --- |
Permissiontomakedigitalorhardcopiesofallorpartofthisworkfor lose [5]. It is particularly challenging when stream
personalorclassroomuseisgrantedwithoutfeeprovidedthatcopies compression itself relies on states, i.e., the intermediate
arenotmadeordistributedforprofitorcommercialadvantageandthat value that will be used in subsequent operations during
copiesbearthisnoticeandthefullcitationonthefirstpage.Copyrights
|     |     |     |     |     |     |     |     | the compressing |     | of  | data streams | (Def | 2). Some | typical |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | ------------ | ---- | -------- | ------- |
forcomponentsofthisworkownedbyothersthantheauthor(s)must
formsofstatesduringstatefulstreamcompressioninclude
behonored.Abstractingwithcreditispermitted.Tocopyotherwise,or
republish,topostonserversortoredistributetolists,requirespriorspecific dictionary [15] and model [4]. Those stateful stream
permissionand/orafee.Requestpermissionsfrompermissions@acm.org. compression algorithms are gaining increasing traction
DEBS’23,June27–30,2023,Neuchatel,Switzerland nowadays, as they significantly outperform stateless
©2023Copyrightheldbytheowner/author(s).Publicationrightslicensed
algorithmsintermsofcompressibilityandinformationloss
toACM.
control[1,5,11].Unfortunately,managingstatesbringeven
ACMISBN979-8-4007-0122-1/23/06...$15.00
https://doi.org/10.1145/3583678.3596885 moredifficultiesforparallelization[15].

DEBS’23,June27–30,2023,Neuchatel,Switzerland XianzhiZengandShuhaoZhang
Recenteffortshavebeendevotedto1)conductingdata
15.70
| compression | on  | IoT | devices | [16] | and 2) | continuously |     |     |     |     |     | 2.00 |     |
| ----------- | --- | --- | ------- | ---- | ------ | ------------ | --- | --- | --- | --- | --- | ---- | --- |
14.0
|     |     |     |     |     |     |     |     | Compression ratio |     |     | B   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- |
compressing data streams [5, 8]. For example, a recent 12.0 8.5 7.9 1.75 )BM/J( noitpmusnoc ygrenE
7.3
IoT-awaredatabaseVergedb[16]proposestoautomatically )s/BM( tuphguorhT 6 . 7 1.50
|     |     |     |     |     |     |     |     | 10.0 6 . 2 |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- |
selectthecompressionapproach,giventheworkload,data
|     |     |     |     |     |     |     |     | 8.0 |     |     |     | 1.25 |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | --- |
A
| arrival | rates, | and resource |     | capacity. | However, | existing |     |     |     |     |     | 1.00 |     |
| ------- | ------ | ------------ | --- | --------- | -------- | -------- | --- | --- | --- | --- | --- | ---- | --- |
6.0
| frameworks | such | as  | Vergedb | are limited | to  | relying on a |     |     |     |     |     | 0.75 |     |
| ---------- | ---- | --- | ------- | ----------- | --- | ------------ | --- | --- | --- | --- | --- | ---- | --- |
4.0
| coarse-grained   |     | analysis    | of performance |      | tradeoffs | among         |     |       |     |     |     | 0.50 |     |
| ---------------- | --- | ----------- | -------------- | ---- | --------- | ------------- | --- | ----- | --- | --- | --- | ---- | --- |
|                  |     |             |                |      |           |               |     | 2.0 D |     | C   |     |      |     |
| data compression |     | algorithms. |                | They | fail to   | fully explore |     |       |     |     |     | 0.25 |     |
a large software-hardware codesign space and do not 0.0 103 102
Latency (ms)
| intrinsically | support    |             | state | management  |         | for complex   |           |                       |     |          |       |             |          |
| ------------- | ---------- | ----------- | ----- | ----------- | ------- | ------------- | --------- | --------------------- | --- | -------- | ----- | ----------- | -------- |
|               |            |             |       |             |         |               | Figure    | 2. The large feasible |     | solution | space | of applying |          |
| stateful      | stream     | compression |       | algorithms. |         | To the best   |           |                       |     |          |       |             |          |
|               |            |             |       |             |         |               | piecewise | linear approximation  |     | (PLA)    | [4]   | under       | relative |
| of our        | knowledge, | none        | of    | them        | answers | the question: |           |                       |     |          |       |             |          |
errorbound0.01tocompressECG[21]dataonRK3399[21]
| How to | best parallelize |     | stateful | stream | compression | on IoT |     |     |     |     |     |     |     |
| ------ | ---------------- | --- | -------- | ------ | ----------- | ------ | --- | --- | --- | --- | --- | --- | --- |
asymmetricmulticoresastheIoTdevice.Thedefinitionof
devicesunderenergybudgetconstraints?
|            |     |            |     |          |        |               | compression | ratio follows | [5], | and | the higher | means | the |
| ---------- | --- | ---------- | --- | -------- | ------ | ------------- | ----------- | ------------- | ---- | --- | ---------- | ----- | --- |
| Motivating |     | Evaluation |     | Results. | Figure | 2 illustrates |             |               |      |     |            |       |     |
better.
| a large | feasible | solution | space | for parallelizing |     | a stateful |     |     |     |     |     |     |     |
| ------- | -------- | -------- | ----- | ----------------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
streamcompressionalgorithmonamodernmulticoreIoT
device,wherethestateisapiecewiselinearapproximation compressionprocedure(Def1)intoaparallelexecution
(PLA) model [4]. There are three major takeaways. First, planasaDirectedAcyclicGraph(DAG)[23]withsuitable
staterepresentations.
variousconcurrencycontrolmechanismsforaccessingthe
states during stream compression lead to a large design Second, we propose a parallel stateful runtime
•
space. For example, the solution 𝐴 configures all threads (Section 4.2) with efficient concurrency control of
tomaintain aglobal-shared PLAmodel, anditachievesa sharedstateaccessandhardware-consciousscheduling
| highcompressionratioof8.5.Incontrast,solution𝐵achieves |     |     |     |     |     |     | mechanisms. |     |     |     |     |     |     |
| ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- |
Third,wedesignanadaptivecontrolplane(Section4.3)
higherthroughputbyusingashared-nothingapproach[15],
•
whereeachthreadmaintainsadisjointPLAmodel,butthe that manages the input stream admission and
compressionratiodropsto6.2.Second,hardware-conscious runtime adjusting to cope with the dynamicity of IoT
optimizationisnecessary.Wehighlightahardware-oblivious environments.
| solution | 𝐶, which | has | a simple | lock-based |     | concurrency |     |     |     |     |     |     |     |
| -------- | -------- | --- | -------- | ---------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
OurearlyexperimentshaverevealedthatCStreamisable
control,OS-basedworkloadscheduling,andrandominput
toobtainsatisfyingsolutionssuchas𝐴and𝐵asshownin
| stream   | admission. | Compared |          | with | a hardware-conscious |            |          |                   |             |     |     |          |       |
| -------- | ---------- | -------- | -------- | ---- | -------------------- | ---------- | -------- | ----------------- | ----------- | --- | --- | -------- | ----- |
|          |            |          |          |      |                      |            | Figure 2 | to meet divergent | performance |     |     | demands. | Given |
| solution | such       | as 𝐴,    | 𝐶 wasted | more | than                 | 6.9 energy |          |                   |             |     |     |          |       |
theencouragingresults,weenvisionthatCStreamcanbe
×
consumption while achieving about 1.5 higher latency a key component of the next-generation large-scale IoT
×
| and 80.5%  | lower       | throughput. |         | Third, | there       | is a complex |            |             |             |       |     |             |      |
| ---------- | ----------- | ----------- | ------- | ------ | ----------- | ------------ | ---------- | ----------- | ----------- | ----- | --- | ----------- | ---- |
|            |             |             |         |        |             |              | deployment | [2, 6, 22], | especially, | since | it  | also aligns | with |
| non-linear | correlation |             | between | energy | consumption | and          |            |             |             |       |     |             |      |
therecentinitiativeofgreencomputing.
otherperformancedemands.Asaresult,adaptingasolution
2 RelatedWork
| to another | to  | cope with | the | changes | in workloads | and |     |     |     |     |     |     |     |
| ---------- | --- | --------- | --- | ------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
performance demands is necessary but challenging. For This section reviews the related work and reveals the
example,itcanachieveabout10 higherthroughputand limitationsthatmotivateCStream.
×
| 1 40lowerlatencybyconsuming8 |     |     |     |     | moreenergywithout |     |          |                  |     |             |     |       |      |
| ---------------------------- | --- | --- | --- | --- | ----------------- | --- | -------- | ---------------- | --- | ----------- | --- | ----- | ---- |
|                              |     |     |     |     |                   |     | Stateful | Data Compression |     | Algorithms. |     | There | is a |
| /                            |     |     |     | ×   |                   |     |          |                  |     |             |     |       |      |
losingcompressibilitycomparingsolutionpoint𝐷 (asingle- growinginterestinexploringcomplexstatefulcompression
threadimplementation)to𝐴(aparallelimplementation). algorithmsforemergingIoTapplications.Forinstance,the
In this paper, we describe our vision of a hardware- dictionary-basedstatessuchasLZMA[9]andmodel-based
consciousstatefulstreamcompressionframeworkforIoT stateslikepiecewiselinearapproximation(PLA)[1,4]are
applications,namelyCStream.Differingsignificantlyfrom attractive in compressing dynamic vision and achieving
priorworks,CStreamaimstohitthesweetspotamongthe error-bounded lossy compression over time series data.
divergentperformancedemandswhenparallelizingstateful RecentworkfromLietal[11]alsoexploitsthesummarizing-
streamcompressiononmulticoreIoTdevices.CStreamwill
basedstateduringdatacompressionformachinelearning.
achieve the goal via three key designs, centering around These studies provide valuable insights into utilizing the
built-insupportofstatemanagement,hardware-conscious state in different cases of data compression. CStream is
optimizations,andadaptivetodynamicIoTenvironment: broaderthantheirscope,asweexploithardware-conscious
First,weintroduceacompressionprocedurecompilation parallelizationofstatefulstreamcompressiononmulticore
•
| module | (Section | 4.1) | that | parallelizes | a   | given stream | IoTdevices. |     |     |     |     |     |     |
| ------ | -------- | ---- | ---- | ------------ | --- | ------------ | ----------- | --- | --- | --- | --- | --- | --- |

Hardware-ConsciousStatefulStreamCompression DEBS’23,June27–30,2023,Neuchatel,Switzerland
| Parallelizing |     | Data | Compression. |     |     | Prior | work has |     |     |     |     |     |     |     |
| ------------- | --- | ---- | ------------ | --- | --- | ----- | -------- | --- | --- | --- | --- | --- | --- | --- |
Downstream online IoT analytics
| attempted | parallelizing |     | data | compression |     | using | various |     |     |     |     |     |     |     |
| --------- | ------------- | --- | ---- | ----------- | --- | ----- | ------- | --- | --- | --- | --- | --- | --- | --- |
hardware architectures such as CPU [5], GPU [15] and The CStream framework
FPGA [8]. Especially, recent work such as Tersecades[5] 1 Compression   2 Parallel stateful runtime 3 Adaptive
|     |     |     |     |     |     |     |     |     | Procedure Compilation |     |     |     |     | Control Plane |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | --- | --- | ------------- |
a n d S tre a m Z i p [8 ] h a v e e x p lo r e d h o w t o ac c e le r a t e t h e Con cu r r e n cy  H a r d w a r e - I n p u t
|     |     |     |     |     |     |     |     |     | Fo r m | s  of D A G  |             | c o n s c     | i o u s   s t | re a m   R u n ti m e   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ | ------------ | ----------- | ------------- | ------------- | ----------------------- |
|     |     |     |     |     |     |     |     |     | s t at | e ge ne r at | or co n t r | o l s c h e d | u li n g      | a d ju s t in g         |
st r ea m p r oc e s sin g o p e r at io n s ( i .e ., j o in a nd a g g r e g a ti o n , ad m i s s io n
| respectively) |     | by compressing |     | data | streams |     | on parallel |     |     |                    |     |     |     |        |
| ------------- | --- | -------------- | --- | ---- | ------- | --- | ----------- | --- | --- | ------------------ | --- | --- | --- | ------ |
|               |     |                |     |      |         |     |             |     |     | Stream compression |     |     |     | Legend |
architectures. They achieve satisfying scaling up on procedure
|     |     |     |     |     |     |     |     |     |  Algorithm instance  |     |     |     |     | Data flow |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- | --- | --------- |
compression,butnoneofthemisdesignedformulticoreIoT and performance  IoT data stream Interactions
demand
deviceswithaconstrainedenergybudget.Further,theylack
Figure3.Systemoverview
intrinsicsupportofstatemanagementforcomplexstateful
streamcompressionalgorithms.
3.2 DesignChallenges
| Utilizing |     | Novel | IoT Hardware. |     | A   | growing | interest |     |     |     |     |     |     |     |
| --------- | --- | ----- | ------------- | --- | --- | ------- | -------- | --- | --- | --- | --- | --- | --- | --- |
has been shown in utilizing asymmetric (e.g., the CStreamneedstoaddressthefollowingthreechallenges.
| ARM big.  | LITTLE  |        | processors | [13])   | and     | heterogeneous |          |     |               |     |              |     |       |             |
| --------- | ------- | ------ | ---------- | ------- | ------- | ------------- | -------- | --- | ------------- | --- | ------------ | --- | ----- | ----------- |
|           |         |        |            |         |         |               |          |     | The Challenge |     | of Efficient |     | State | Management. |
| multicore | devices | (e.g., | the        | coupled | CPU-GPU |               | [20]) in |     |               |     |              |     |       |             |
IoT, as they can achieve a better trade-off between Achievingeffectiveparallelizationovervariouscompression
algorithmsisdifficult[15],especiallywhenthealgorithmis
| energy | efficiency | and | other | performance |     | demands | like |     |     |     |     |     |     |     |
| ------ | ---------- | --- | ----- | ----------- | --- | ------- | ---- | --- | --- | --- | --- | --- | --- | --- |
stateful.Inpractice,variouskindsofstatesmaybeinvolved
throughputcomparedwithsymmetricarchitectures.Recent
studiesareespeciallyinterestedinexploringcollaborative in compression, e.g., the last-encountered value [5], the
dictionary[15],thesketchstructure[11],andthepiecewise
| OS schedulers |     | and | energy-efficient |     |     | machine | learning |     |     |     |     |     |     |     |
| ------------- | --- | --- | ---------------- | --- | --- | ------- | -------- | --- | --- | --- | --- | --- | --- | --- |
on asymmetric multicore [19] or coupled CPU-GPU linear approximation model [1]. Differ significantly from
architectures [20]. They make valuable contributions to priorwork,CStreamtreatsefficientstatemanagementasa
|     |     |     |     |     |     |     |     | first-class |     | citizen | for better | managing | those | states during |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------- | ---------- | -------- | ----- | ------------- |
understandingthenovelhardwareandconductinghardware-
consciousworkloadscheduling,butnoneinvestigatedthe streamcompression.
largedesignspaceofparallelstatefulstreamcompression
TheChallengeofHardwareConsciousOptimization.
onmulticoreIoTdevices.
Achievinghardwareconsciousnessparallelizationofstream
compressionisnon-trivial[22].Especially,CStreamneeds
3 SystemOverview
tomakewisedecisionsina)theselectionofconcurrency
Inthissection,wefirstoutlinehowCStreamworks,followed
|     |     |     |     |     |     |     |     | control |     | [12] of | state access | among | multiple | parallel |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | ------- | ------------ | ----- | -------- | -------- |
byitskeydesignchallenges,andadesignoverview.
instances,andb)theproperworkloadschedulingonnovel
3.1 HowCStreamWorks? IoT devices, which are typically asymmetric [13] and/or
heterogeneous[20].
AsshowninFigure3,actingasacompressionmiddleware,
| CStream | sits | between | IoT | devices | such | as  | sensors and |     |               |     |               |     |        |              |
| ------- | ---- | ------- | --- | ------- | ---- | --- | ----------- | --- | ------------- | --- | ------------- | --- | ------ | ------------ |
|         |      |         |     |         |      |     |             |     | The Challenge |     | of Dynamicity |     | in IoT | Environment. |
downstream online analytic tasks. To meet various Fitting into the dynamics and uncertainty on the fly in
| performance |     | demands | CStream |     | parallelizes |     | a stream |     |            |     |             |     |               |         |
| ----------- | --- | ------- | ------- | --- | ------------ | --- | -------- | --- | ---------- | --- | ----------- | --- | ------------- | ------- |
|             |     |         |         |     |              |     |          | a   | real-world | IoT | environment | [2, | 3] introduces | another |
compressionprocedure,definedasfollows.
non-trivialdesignchallengetoCStream.Inparticular,both
theadmissionoftheinfinite,potentiallyout-of-orderdata
| Definition1(StreamCompressionProcedure). |           |     |        |         |     |          | Astream    |        |     |              |         |        |     |                |
| ---------------------------------------- | --------- | --- | ------ | ------- | --- | -------- | ---------- | ------ | --- | ------------ | ------- | ------ | --- | -------------- |
|                                          |           |     |        |         |     |          |            | stream | and | the parallel | runtime | should | be  | reconfigurable |
| compression                              | procedure |     | is the | process | of  | applying | a specific |        |     |              |         |        |     |                |
andadaptivetodynamicallychangingworkloads.
streamcompressionalgorithmtocompressasubsetoftheinput
datastreamunderspecificdemandsofenergyconsumption,
3.3 DesignOverview
throughput,latency,compressibility,andinformationloss.
Toaddresstheaforementionedchallenges,CStreamconsists
| CStream     |            |     |         |               |     |          |          | ofthreemajorcomponents,i.e.,acompressionprocedure |     |            |          |          |     |                 |
| ----------- | ---------- | --- | ------- | ------------- | --- | -------- | -------- | ------------------------------------------------- | --- | ---------- | -------- | -------- | --- | --------------- |
|             | especially |     | targets | parallelizing |     | stateful | stream   |                                                   |     |            |          |          |     |                 |
|             |            |     |         |               |     |          |          | compilation,                                      |     | a parallel | stateful | runtime, |     | and an adaptive |
| compression | procedures |     | that    | maintain      |     | various  | kinds of |                                                   |     |            |          |          |     |                 |
statestohelpachievehighercompressibilityand/orlower controlplane,asshowninFigure3.
CStreamtakesthreeconsecutivestepstoconductagiven
informationloss,wherethestatecanbedefinedasfollows.
|     |     |     |     |     |     |     |     | procedure. |     | 1 Inthecompressionprocedurecompilation,a |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ---------------------------------------- | --- | --- | --- | --- |
Definition 2 (State). A state in stream compression is selectedcompressionalgorithmiscompiledintoaparallel
the intermediate value or data structure that maintains or executionplan,whichisrepresentedasaDAGwithmultiple
approximates historic information of the input data stream nodes.Thecompilationexploitsbothpipeliningparallelism
to help the algorithm to better determine and apply the and data parallelism. Treating the state management as a
first-classcitizen,CStreamsupportsfivestate-of-artmajor
compressionstrategiesforsubsequentdatastreams.

DEBS’23,June27–30,2023,Neuchatel,Switzerland XianzhiZengandShuhaoZhang
representations of states during the compilation. 2 The parallelism, CStream divides a stream compression
DAG is then sent to the parallel stateful runtime for procedure into three pipeline steps of 𝑟𝑒𝑎𝑑, 𝑒𝑛𝑐𝑜𝑑𝑒, and
execution.Thereisanotoriousproblemofconcurrentstate 𝑤𝑟𝑖𝑡𝑒,andfurtherdivide𝑒𝑛𝑐𝑜𝑑𝑒stepintothreestate-related
access [3, 10, 12] during stateful stream processing. For steps, i.e., 𝑝𝑟𝑒𝑝𝑟𝑜𝑐𝑒𝑠𝑠, 𝑠𝑡𝑎𝑡𝑒 𝑎𝑐𝑐𝑒𝑠𝑠, and 𝑝𝑜𝑠𝑡𝑝𝑟𝑜𝑐𝑒𝑠𝑠. For
CStream, its runtime must decide suitable concurrency data parallelism, each aforementioned pipeline step can
control approaches in order to achieve a good balance be replicated for providing higher performance and
betweencompressibilityandaccessingoverhead.Afterward, relievepipelinebottlenecks[23].However,achievingdata
eachrunningnodeoftheDAGisscheduledwithhardware parallelism is not always straightforward as concurrent
consciousness, by being assigned 1) the right mapping accesses over a compression state may be involved. It
placeofhardwareand2)therightportionoftheworkload is particularly challenging as CStream needs to support
according to the procedure demands. 3 An adaptive multiple forms of states (Section 4.1.1). We discuss how
controlplaneisresponsibleforaddressingthedynamicity. CStreamaddressesthisissuebyconcurrencycontrolinthe
Specifically, it regulates the input stream admission in following(Section4.2.1).
an efficient manner with micro batcing and out-of-order
4.2 ParallelStatefulRuntime
stream handling [23]. It also chooses the optimal way of
WediscusshowCStreamconductstheparallelexecutionof
adjustingtheruntime,intermsofbothcomputationalpower
streamcompressionDAGandachieveshardware-conscious.
and software configurations [3]. The adjustments cover
thenecessaryguaranteeofstateconsistency,andtheyare
4.2.1 Concurrency Control. We focus on single-node
speciallyoptimizedforthelong-runningonlineIoTanalytics
shared-memory multicore IoT devices and illustrate all
andthedynamicIoTdatastream[3].
possible concurrency control approaches as follows. 1)
4 CStreamComponents TheShared-NothingApproach:Conductingparallelstream
compressionwithoutsharingstatesisanaturalchoicefor
Inthissection,weelaborateonthecrucialdesignofCStream
maximizingparallelism[15].However,splittingthestatewill
inmoredetailanddiscusssomeofourongoingworks.
losecompressibilityasaparallelinstanceisunawareofthe
4.1 CompressionProcedureCompilation historicalinformationaboutthedatastreammaintainedby
We first introduce how CStream compiles the stream others.2)ThePartial-ShareApproach:Toalleviatetheloss
compressionprocedureintoaDAG. of compressibility caused by the nothing-share approach,
the state can be partially shared, e.g., to share the state
4.1.1 FormsofState. CStreamsupportsfivemajorforms amongsomeneighbours[17].Partialsharingisanattractive
of compression state which are popularly used in stream strategy[14],butquestionssuchas1)whichstatestoshare
compressionalgorithmsasfollows.(1)Statelesscompression, and 2) how to conduct the partial sharing remain to be
whichrepeatsthecompressiononthecurrentdatawithout answeredforparallelizingstatefulstreamcompression.We
backtracing historical information [18]. (2) Value-based arecurrentlyworkingonaholisticmodeltodeterminethe
State, which is about updating and recording the recent optimalconfigurationforthepartial-sharingofstatesduring
compressedvaluetoimprovethecompressionratio,such statefulstreamcompressioninCStream.3)TheGlobal-Share
asdeltaencoding[5]andrunlengthencoding(RLE)[18]. Approach: It is also possible to maintain a global shared
(3)Dictionary-basedState,whichutilizesadictionarysuch statewhilestillprovidingparallelismbytakingadvantage
as hash table [9] to memorize thousands of encountered of state-of-art technologies like concurrent storage [10]
“lastcompressed”values,furtherimprovingcompressibility ortransactionalstreamprocessing[12].However,howto
with higher maintenance overhead. (4) Model-based State, apply these technologies in stateful stream compression
whichreflectslargevolumesofdatabyusingapproximate on ubiquitous IoT device is still an open question. On
mathematicalmodels(e.g.,underlinearorlogisticregression) the one hand, the relatively strong ACID guarantee [12]
with only a few parameters [4], achieving ultra-high may not be a necessity, as long as the information loss
compression ratio [1] when data is highly fitted to the in ending compressed data is acceptable. On the other
model.(5)Summarizing-basedState,whichaimstoacquire hand,globalsharingistypicallynotpreferablewhenthere
anapproximatesummaryofhistoricinformationinseveral is heterogeneity, e.g., CPU+GPU [15], due to its huge
incrementally updated buckets or cells [7] instead of implementationcomplexity.
keepingaccuraterecords,enablingtunabletrade-offbetween
4.2.2 The Hardware-Conscious Scheduling. Many
compressibilityandinformationloss.
prior works have revealed the benefits of adopting
4.1.2 DAGGenerator. Basedonthestaterepresentation, asymmetricandheterogeneousmulticores[13,20]onIoT
the DAG generator is then involved to exploit both devices.Ingeneral,theyaresuperiortotraditionalsymmetric
pipelining parallelism and data parallelism opportunities hardware in higher performance and higher energy
forcompilationinspiredby[21,23].Toachievepipelining efficiency.However,itisnon-trivialtofullytakeadvantage

Hardware-ConsciousStatefulStreamCompression DEBS’23,June27–30,2023,Neuchatel,Switzerland
of them in CStream, due to the so-called asymmetric settingstochange[3],andit’softenconductedunderthe
computationandasymmetriccommunicationeffects[19,21]. dynamicvoltageandfrequencyscaling (DVFS)technology.
Arecentwork[21]pointsoutthatpreciseandlow-overhead However,duetotheobliviousnessofperformancedemands
costmodelingisrequiredtoguidethehardware-conscious bystreamcompressionandcoarse-grainedguarantee[19]
scheduling in stream compression, but it still remains an of OS-provided DVFS, we are working on evaluating
openchallengeasstatefulstreamcompressionalgorithms, and adopting some state-of-art DVFS [19] in CStream
IoThardware,anddynamicworkloadshouldbeconsidered framework. (2) Core number regulation offers a large
togetherinanadaptiveandcost-effectivemanner.Weare tuning space of time-energy trading off but leads to high
working on more sophisticated controllers that monitor complexity[3].Specifically,weshouldmergeorsplitsome
workloadstatisticalinformationinthedatastream[23]to dataparallelismnodesandremapsomeexistingnodesinthe
betterguidethehardware-consciousscheduling. DAGtofitintothechangedcorenumber[23].Meanwhile,
specificreconfigurationprotocolsmustbeusedtopreserve
4.3 AdaptiveControlPlane
streamandinternalstateintegrity[3].
To address the dynamicity issue in IoT environments, Adjusting Software Configurations. The streaming
CStreaminvolvesanadaptivecontrolplaneofinputstream workloadsintheIoTenvironmentvarysignificantlyinboth
admissionandruntimeadjusting. arrival patterns and statistical properties over time [22].
Staticprofilingandfixedstrategiesareinsufficient,weare
4.3.1 Input Stream Admission. We first discuss how
investigatinghowtoachievetheadaptiveconfigurationof
CStreamadmitsinputstreamincludingtheexecutionover
CStream(e.g.,workloadscheduling,inputstreamadmission,
infinitestreamingdataandtheout-of-orderhandlingina
etc).Movingbeyondarecentfeedback-basedcontrol[21],
real-worldIoTenvironment.
CStreamwillenable(1)adaptiveinputstreamadmissions
Micro-batchExecution.Compressingthedatastreampieces
suchasconfiguringtheoptimalbatchsize[3]andgenerating
as soon as their arrival seems a natural fit for handling
theoptimalwatermark[12]ontheflyand(2)utilizingmore
infinitestreaminginputs.However,suchaneagerapproach
powerful approaches such as proactive-model [23] and
iscostly.Inspiredby[24],CStreamadaptsthemicro-batching
machine-learning[3].
strategy and conducts stream compression lazily. One
subsequent question arises as “how much data should be 5 PreliminaryEvaluation
agglomerated in each micro-batching”. Our preliminary
CStreamsupportsallaforementionedconcurrencycontrol
resultsindicatethatasuitablebatchsizecorrelatestocache
approaches(Section4.2.1)forstatemanagementinstream
size, especially the L1D size. However, conflicts among
compression. Specifically, we follow a prior work [15] to
differentperformancedemandsoccurintuningthebatch
implementthesharednothingapproach(NS),enableeach
size,e.g.,alargerbatchsizemaybebeneficialtoimprove
threadtohavestatereadaccessonitstwonearestneighbors
throughput,butalsoincreasesthelatency.
toimplementthepartial-shareapproach(PS),andimplement
Out-of-Order Handling. The out-of-order (OoO) arrival
global-shareapproachbyeitherlock-basedimplementation
of the data stream is another notorious problem [23],
(LOCK)andtransactional-based[12]implementation(TP).
especially for IoT applications [22]. OoO handling such
WeuseRK3399asymmetricmulticoresastheIoTdevice[21]
aswatermarkmechanismsinvolvesaninevitabletradeoff
forPLAcompression[4]onanECGdataset[21].Weuse“B”
betweenqualityandlatency,asitiswellstudiedingeneral
todenotebigcoresand“L”todenotelittlecoresonRK3399,
streamprocessing[23].However,ithasnotbeenappliedto
andenableallcoresbydefault,i.e.,“2B4L”.Unlessotherwise
compression-specificoptimizationsthatourworktargets.
specifiedweleteachcoreworkunderitshighestfrequency,
Therefore, we are investigating the following literature
i.e.,1.416𝐺𝐻𝑧 forBand1.8𝐺𝐻𝑧forL.Weusea2𝐾 byteas
gaps1)thedefinitionofcompressionqualityshouldcover
batchsizeformicrobatchinganduseanasymmetry-aware
both compression ratio and information loss and will
schedulingstrategy.
act as the criteria to guide a tradeoff, 2) the heuristic
Figure4showsthecomparisonofdifferentconcurrency
optimizationamongparallelstreamcompressionalgorithms
controlimplementations.Therearethreemajorobservations.
andOoOhandling,whichenablesproactiveimprovementin
First, although the NS approach leads to minimal energy
compressionqualityandleadstooptimaltradeoffs.
consumption, its compressibility is the lowest (i.e., up to
4.3.2 Runtime Adjusting. We now introduce how 24% less compression ratio compared with LOCK or TP).
CStreamadjustsitsruntimeunderthedynamics. Evenworse,thecompressionratiodropswithanincreasing
Adjusting Computational Power. CStream provides number of cores, as shown in Figure 4(b). Second, LOCK
necessarycomputationalpowerondemandwithoutwasting brings much higher energy consumption, i.e., 4.6× more
energyduetothelimitedenergybudgetonIoTdevices,and energyconsumptionthanNS,althoughitcanguaranteethe
adjuststhecomputationalpowerasfollows:(1)Frequency highestcompressionratio.ComparedwithLOCK,thenovel
regulationtradesofftimeandenergywithoutrequiringother TP implementationavoidsthecentralizedlockcontentions

DEBS’23,June27–30,2023,Neuchatel,Switzerland XianzhiZengandShuhaoZhang
whilestillallowingtheglobalsharingofstates.Third,there stream processing in other related frameworks, such as
isaninterestingspacefortradingoffcompressibilityand Driven[6],NebulaStream[22],andMorphStream[12].
overhead between PS and TP (i.e., 7.7 8.5 compression Acknowledgement
∼
| ratio,1.6 |     | 2.0𝐽 | 𝑀𝐵energyconsumption),andweplanto |     |     |     |     |     |     |     |     |     |     |
| --------- | --- | ---- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|           |     | ∼    | /                                |     |     |     |     |     |     |     |     |     |     |
furtherinvestigateitinthefuture. ThisworkissupportedbytheNationalResearchFoundation,
|     |     |     |     |     |     |     |     | Singapore | and Infocomm | Media | Development |     | Authority |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | ----- | ----------- | --- | --------- |
underitsFutureCommunicationsResearch&Development
|     |        |                                 |     |     | oitar noisserpmoC |     |     | ProgrammeFCP-SUTD-RG-2022-006. |     |     |     |     |     |
| --- | ------ | ------------------------------- | --- | --- | ----------------- | --- | --- | ------------------------------ | --- | --- | --- | --- | --- |
|     | 8.0    |                                 |     | 9.0 |                   |     |     |                                |     |     |     |     |     |
|     | Energy |                                 |     |     | 8                 |     |     |                                |     |     |     |     |     |
|     | c      | o n s u m p ti o n   ( J / M B) |     |     |                   |     |     | References                     |     |     |     |     |     |
|     | 6.0 C  | o m p r e ss i o n   r a t io   |     | 8.2 |                   |     |     |                                |     |     |     |     |     |
BM/J
4.0 7.5 7 [1] DavisBlalocketal.2018. Sprintz:Timeseriescompressionforthe
|     | 2.0 |     |     | 6.8 |           |           |           | internetofthings.InACMIMWUT(2018). |     |     |     |     |     |
| --- | --- | --- | --- | --- | --------- | --------- | --------- | ---------------------------------- | --- | --- | --- | --- | --- |
|     |     |     |     |     | 0B1L 0B2L | 0B3L 0B4L | 1B4L 2B4L |                                    |     |     |     |     |     |
0.0 6.0 [2] Bansaletal.2020.ASurveyonIoTBigData:CurrentStatus,13V’s
|     | NS  | PS  | LOCK TP |     |     | #Cores |     |     |     |     |     |     |     |
| --- | --- | --- | ------- | --- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
Challenges,andFutureDirections.CSUR(2020).
| (a) | Compressionratioandenergy |     |     | (b) | Compressionratiodropswhile |     |     |     |     |     |     |     |     |
| --- | ------------------------- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
[3] Cardellinietal.2022.RuntimeAdaptationofDataStreamProcessing
| consumption. |     |     |     | scalingupwithNS. |     |     |     |     |     |     |     |     |     |
| ------------ | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Systems:TheStateoftheArt.CSUR(2022).
[4] Duvignauetal.2019.Streamingpiecewiselinearapproximationfor
Figure4.Preliminaryevaluationofvariousconcurrency
efficientdatamanagementinedgecomputing.InSIGAPP.
controlimplementationsinCStream.
|     |     |     |     |     |     |     |     | [5] Gennady | Pekhimenko | et al. 2018. | TerseCades: | Efficient | Data |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ---------- | ------------ | ----------- | --------- | ---- |
2.1 8.4 2.1 8.5 CompressioninStreamProcessing.InUSENIXATC18.Boston,MA.
|     | Energy |     |     |     | Energy |     |     |     |     |     |     |     |     |
| --- | ------ | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
1.9 consumption (J/MB) 6.6 consumption (J/MB) [6] Haversetal.2019.Driven:aframeworkforefficientdataretrievaland
|     | Throughput (MB/s) |     |     |          | 1.6 Throughput (MB/s) |     | 6.5  |                                            |     |     |     |     |     |
| --- | ----------------- | --- | --- | -------- | --------------------- | --- | ---- | ------------------------------------------ | --- | --- | --- | --- | --- |
|     | BM/J 1.7          |     |     | 4.9 s/BM |                       |     |      | clusteringinvehicularnetworks.InICDE.IEEE. |     |     |     |     |     |
|     |                   |     |     |          | BM/J                  |     | s/BM |                                            |     |     |     |     |     |
1.1 4.6 [7] Lietal.2022.Camel:ManagingDataforEfficientStreamLearning.In
|     | 1.5                    |                       |         | 3.1           |     |     |     |             |     |     |     |     |     |
| --- | ---------------------- | --------------------- | ------- | ------------- | --- | --- | --- | ----------- | --- | --- | --- | --- | --- |
|     |                        |                       |         |               | 0.6 |     | 2.6 | SIGMOD2022. |     |     |     |     |     |
|     | 1 .3 .408(B&L ) .6(B&L | ) L ) 08(B&L ) .2(B&L | ) L ) 6 | L &1.416L 1.3 |     |     |     |             |     |     |     |     |     |
0 .816(B& .0 1 .416(B & 8B&1. 4 1 [8] Prajith Ramakrishnan Geethakumari et al. 2021. Streamzip:
|     | 0   | 0 1 | 1 1. 6 0 1 . 8 B |     | 0.10B1L 0B2L | 0B3L 0B4L | 1B4L 2B4L 0.7 |     |     |     |     |     |     |
| --- | --- | --- | ---------------- | --- | ------------ | --------- | ------------- | --- | --- | --- | --- | --- | --- |
Frequency (GHz) #Cores Compressedsliding-windowsforstreamaggregation.InICFPT.IEEE.
(a) Impactsofdifferentfrequency (b) Impacts of different core [9] Khurram Iqbal et al. 2020. Performance comparison of lossless
settings. numbersettings. compressionstrategiesfordynamicvisionsensordata.InICASSP.
IEEE.
Figure5.Preliminaryresultsaboutadjustingtheruntime. [10] SørenKejserJensenetal.2018.Modelardb:Modularmodel-basedtime
seriesmanagementwithsparkandcassandra.VLDB(2018).
|     |     |     |     |     |     |     |     | [11] YimingLietal.2022. |     | Camel:ManagingDataforEfficientStream |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------------- | --- | ------------------------------------ | --- | --- | --- |
Figure5furthershowsthatCStreamcanadjustruntime
Learning.InSIGMOD.
bysettingdifferentcorefrequenciesandnumbersofcores.
[12] YancanMaoandetal.2023.MorphStream:AdaptiveSchedulingfor
Notingthattherelationshipbetweenenergyconsumption ScalableTransactionalStreamProcessingonMulticores.InSIGMOD.
andfrequencycanbenon-monotonic.Weobservedthatthis [13] SparshMittal.2016. Asurveyoftechniquesforarchitectingand
managingasymmetricmulticoreprocessors.CSUR(2016).
isbecausetheenergyconsumptiondecreasesorincreases
[14] MuhammadAnisUddinNasiretal.2015.Thepowerofbothchoices:
| with | increasing |     | frequency | in  | the little | core | or big core, |     |     |     |     |     |     |
| ---- | ---------- | --- | --------- | --- | ---------- | ---- | ------------ | --- | --- | --- | --- | --- | --- |
Practicalloadbalancingfordistributedstreamprocessingengines.In
| respectively. |     | These | results | highlight |     | that a | more careful |     |     |     |     |     |     |
| ------------- | --- | ----- | ------- | --------- | --- | ------ | ------------ | --- | --- | --- | --- | --- | --- |
ICDE.IEEE.
designisrequiredinachievingvaryingdemandsindynamic [15] AdnanOzsoyetal.2011.CULZSS:LZSSlosslessdatacompressionon
| workloadsinCStream. |     |     |     |     |     |     |     | CUDA.InICCC.IEEE. |     |     |     |     |     |
| ------------------- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- |
[16] JohnPaparrizosetal.2021.VergeDB:ADatabaseforIoTAnalyticson
6 ConclusionandFutureWork
EdgeDevices..InCIDR.
[17] JulianShunetal.2013.Practicalparallellempel-zivfactorization.In
| With | the | increasing | deployment |     | of  | massive | IoT devices, |     |     |     |     |     |     |
| ---- | --- | ---------- | ---------- | --- | --- | ------- | ------------ | --- | --- | --- | --- | --- | --- |
2013DataCompressionConference.IEEE.
continuouslyreducingdatafootprintsbetweendatasources
|     |     |     |     |     |     |     |     | [18] Jianguo | Wang et | al. 2017. | An experimental | study | of bitmap |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ------- | --------- | --------------- | ----- | --------- |
anddownstreamIoTanalyticsbecomescrucial.Subsequently, compressionvs.invertedlistcompression.InSIGMOD.
thereisagrowinginterestinadoptingstreamcompression [19] ManniWangetal.2021.AsyMo:scalableandefficientdeep-learning
for IoT, especially for stateful stream compression which inferenceonasymmetricmobileCPUs.InMobiCom.
[20] QunsongZengetal.2021.Energy-efficientresourcemanagementfor
| has | great | potential | and | emerging | applications. |     | However, |     |     |     |     |     |     |
| --- | ----- | --------- | --- | -------- | ------------- | --- | -------- | --- | --- | --- | --- | --- | --- |
federatededgelearningwithCPU-GPUheterogeneouscomputing.
suchadoptionneedstocarefullytakemultipleperformance
IEEETWC(2021).
demandsintoaccountwhenrealizingstreamcompression
|     |     |     |     |     |     |     |     | [21] XianzhiZengandetal.2023. |     | ParallelizingStreamCompressionfor |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------- | --- | --------------------------------- | --- | --- | --- |
algorithms with complex state management on energy IoTApplicationsonAsymmetricMulticores.InICDE.IEEE.
budget-constrained IoT devices. We presented our vision [22] SteffenZeuchandetal.2020.NebulaStream:Complexanalyticsbeyond
thecloud.VLIoT2020(2020).
of CStreamtobridgetheliteraturegaphopefully.
[23] ShuhaoZhangetal.2019.Briskstream:Scalingdatastreamprocessing
Beyondcompressingdatastreamstoreducetransmission
onshared-memorymulticorearchitectures.InSIGMOD.
overhead,itbecomesevenmorebeneficialwhendownstream
|     |     |     |     |     |     |     |     | [24] Shuhao | Zhang et | al. 2021. Parallelizing |     | Intra-Window | Join on |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | -------- | ----------------------- | --- | ------------ | ------- |
tasks execute directly over compressed streams [25]. It is Multicores:AnExperimentalStudy.InSIGMOD.
therefore an interesting next step to utilize CStream as a [25] YuZhangandetal.2023.CompressStreamDB:Fine-GrainedAdaptive
StreamProcessingwithoutDecompression.InICDE.
runtimeenhancementtoreducememoryfootprintsduring