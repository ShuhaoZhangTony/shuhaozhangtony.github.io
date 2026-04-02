FineStream: Fine-Grained Window-Based Stream Processing on
CPU-GPU Integrated Architectures
FengZhang1,LinYang1,ShuhaoZhang2,3,BingshengHe3,WeiLu1,XiaoyongDu1
1KeyLaboratoryofDataEngineeringandKnowledgeEngineering(MOE),andSchoolofInformation,
RenminUniversityofChina
2DIMA,TechnischeUniversitätBerlin
3SchoolofComputing,NationalUniversityofSingapore
fengzhang@ruc.edu.cn,yanglin2330@ruc.edu.cn,shuhao.zhang@tu-berlin.de,hebs@comp.nus.edu.sg,
lu-wei@ruc.edu.cn,duyong@ruc.edu.cn
Abstract bandwidthofPCI-elimitstheperformanceofstreamprocess-
ingonGPUs.Hence,streamprocessingonGPUsneedstobe
AcceleratingSQLqueriesonstreamprocessingbyutilizing
carefullydesignedtohidethePCI-eoverhead.Forexample,
heterogeneouscoprocessors,suchasGPUs,hasshowntobe
prior works have explored pipelining the computation and
aneffectiveapproach.Mostworksshowthatheterogeneous
communicationtohidethePCI-etransmissioncost[34,54].
coprocessorsbringsignificantperformanceimprovementbe-
cause of their high parallelism and computation capacity. Despiteofvariousstudiesinpreviousstreamprocessing
However,thediscretememoryarchitectureswithrelatively enginesongeneral-purposeapplications[5,23,25,33,54,62],
lowPCI-ebandwidthandhighlatencyhavedraggeddown relativelyfewstudiesfocusonSQL-basedrelationalstream
thebenefitsofheterogeneouscoprocessors.Recently,hard- processing.Supportingrelationalstreamprocessinginvolves
warevendorsproposeCPU-GPUintegratedarchitecturesthat additional complexities, such as how to support window-
integrateCPUandGPUonthesamechip.Thisintegration based query semantics and how to utilize the parallelism
providesnewopportunitiesforfine-grainedcooperationbe- withasmallwindoworslidesizeefficiently.Existingengines,
tweenCPUandGPUforoptimizingSQLqueriesonstream suchasSparkStreaming[57],struggletosupportsmallwin-
processing.Inthispaper,weproposeadatastreamsystem, dowandslidesizes,whilethestate-of-the-artwindow-based
called FineStream, for efficient window-based stream pro- queryengine,Saber[34],adoptsabulk-synchronousparallel
cessingonintegratedarchitectures.Particularly,FineStream model[66]forhidingPCI-etransmissionoverhead.
performs fine-grained workload scheduling between CPU Inrecentyears,hardwarevendorshavereleasedintegrated
andGPUtotakeadvantageofbotharchitectures,anditalso architectures,whichcompletelyremovePCI-eoverhead.We
providesefficientmechanismforhandlingdynamicstream haveseenCPU-GPUintegratedarchitecturessuchasNVIDIA
queries.Ourexperimentalresultsshowthat1)onintegratedar- Denver[13],AMDKaveri[15],andIntelSkylake[27].They
chitectures,FineStreamachievesanaverage52%throughput fuseCPUsandGPUsonthesamechip,andletbothCPUs
improvementand36%lowerlatencyoverthestate-of-the-art andGPUssharethesamememory,thusavoidingthePCI-e
streamprocessingengine;2)comparedtothestreamprocess- datatransmission.Suchintegrationposesnewopportunities
ing engine on the discrete architecture,FineStream on the forwindow-basedstreamingSQLqueriesfrombothhardware
integratedarchitectureachieves10.4xprice-throughputratio, andsoftwareperspectives.
1.8xenergyefficiency,andcanenjoylowerlatencybenefits. First,differentfromtheseparatememoryhierarchyofdis-
crete CPU-GPU architectures, the integrated architectures
1 Introduction
provideunifiedphysicalmemory.Theinputstreamdatacan
Optimizing the performance of stream processing systems beprocessedinthesamememoryforbothCPUsandGPUs,
has been a hot research topic due to the rigid requirement whicheliminatesthedatatransmissionbetweentwomemory
ontheeventprocessinglatencyandthroughput.Streampro- hierarchies,thuseliminatingthedatacopyviaPCI-e.
cessingonGPUshasbeenshowntobeaneffectivemethod Second,theintegratedarchitecturemakesitpossiblefor
toimproveitsperformance[23,33,34,41,54,62,67].GPUs processingdynamicrelationalworkloadsviafine-grainedco-
consist of a large amount of lightweight computing cores, operationsbetweenCPUsandGPUs.Astreamingquerycan
whicharenaturallysuitablefordata-parallelstreamprocess- consistofmultipleoperatorswithvaryingperformancefea-
ing.GPUsareoftenusedascoprocessorsthatareconnected turesondifferentprocessors.Furthermore,streamprocessing
to CPUs throughPCI-e [42]. Undersuchdiscrete architec- ofteninvolvesdynamicinputworkload,whichaffectsopera-
tures,streamdataneedtobecopiedfromthemainmemoryto torperformancebehaviorsaswell.Wecanplaceoperatorson
GPUmemoryviaPCI-ebeforeGPUprocessing,butthelow differentdeviceswithproperworkloadsinafine-grainedman-

ner,withoutworryingabouttransmissionoverheadbetween samechip.Themostattractivefeatureofsuchintegrationis
CPUsandGPUs. thesharedmainmemorywhichisavailabletobothdevices.
Basedontheaboveanalysis,wearguethatstreamprocess- With the shared main memory,CPUs and GPUs can have
ing on integrated architectures can have much more desir- more opportunities forfine-grainedcooperation. The most
ablepropertiesthanthatondiscreteCPU-GPUarchitectures. commonlyusedprogrammingmodelforintegratedarchitec-
To fully exploit the benefits of integrated architectures for turesisOpenCL[49],whichregardstheCPUandtheGPUas
streamprocessing,weproposeafine-grainedstreamprocess- devices.Eachdeviceconsistsofseveralcomputeunits(CUs),
ingframework,calledFineStream.Specifically,wepropose whicharetheCPUandGPUcoresinFigure1.
thefollowingkeytechniques.First,aperformancemodelis
proposedconsideringbothoperatortopologiesanddifferent CPU GPU
|     |     |     |     |     |     |     | CPU | CPU | CPU GPU | GPU | GPU |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- |
architecturecharacteristicsofintegratedarchitectures.Sec- … …
|     |     |     |     |     |     |     | core | core | core core | core | core |
| --- | --- | --- | --- | --- | --- | --- | ---- | ---- | --------- | ---- | ---- |
ond,alight-weightschedulerisdevelopedtoefficientlyassign
|     |     |     |     |     |     |     |     | CPU Cache |     | GPU Cache |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --------- | --- |
theoperatorsofaqueryplantodifferentprocessors.Third,
onlineprofilingwithcomputingresourceandtopologyadjust- Shared Memory Management Unit
mentareinvolvedfordynamicworkloads.
| We evaluate |     | FineStream | on two | platforms, | AMD A10- |     |     |     |     |     |     |
| ----------- | --- | ---------- | ------ | ---------- | -------- | --- | --- | --- | --- | --- | --- |
System DRAM
| 7850K, and | Ryzen | 5   | 2400G. Experiments |     | show that |     |     |     |     |     |     |
| ---------- | ----- | --- | ------------------ | --- | --------- | --- | --- | --- | --- | --- | --- |
FineStreamachieves52%throughputimprovementand36% Figure1:Ageneraloverviewoftheintegratedarchitecture.
lowerlatencyoverthestate-of-the-artCPU-GPUstreampro-
Weshowacomparisonbetweentheintegratedanddiscrete
cessingengineontheintegratedarchitecture.Comparedto
architectures(discreteGPUs)inTable1.Thesearchitectures
thebestsingleprocessorthroughput,itachieves88%perfor-
areusedinourevaluation(Section7).Althoughtheintegrated
manceimprovement.
architectureshavelowercomputationcapacitythanthedis-
| We also | compare | stream | processing | on  | integrated archi- |     |     |     |     |     |     |
| ------- | ------- | ------ | ---------- | --- | ----------------- | --- | --- | --- | --- | --- | --- |
cretearchitecturescurrently,theintegratedarchitectureisa
tectureswiththatondiscreteCPU-GPUarchitectures.Our
potentialtrendforafuturegenerationofprocessors.Hardware
evaluationshowsthatFineStreamonintegratedarchitectures
vendors,includingAMD[15],Intel[27]andNVIDIA[13],
| achieves | 10.4x | price-throughput | ratio, | and | 1.8x energy ef- |     |     |     |     |     |     |
| -------- | ----- | ---------------- | ------ | --- | --------------- | --- | --- | --- | --- | --- | --- |
allreleasetheirintegratedarchitectures.Moreover,futureinte-
| ficiency. | Undercertain |     | circumstances,it | is  | able to achieve |     |     |     |     |     |     |
| --------- | ------------ | --- | ---------------- | --- | --------------- | --- | --- | --- | --- | --- | --- |
gratedarchitecturescanbemuchmorepowerful,evencanbea
lowerprocessinglatency,comparedtothestate-of-the-artex-
competitivebuildingblockforexascaleHPCsystems[47,55],
ecutionondiscretearchitectures.Thisfurthervalidatesthe
andtheinsightsandmethodsinthispaperstillcanbeapplied.
largepotentialofexploringtheintegratedarchitecturesfor
Besides,theintegratedarchitecturesareattractiveduetotheir
datastreamprocessing.
efficientpowerconsumption[15,60]andlowprice[31].
Overall,wemakethefollowingcontributions:
1) We propose the first fine-grained window-based rela- Table1:Integratedarchitecturesvs.discretearchitectures.
tionalstreamprocessingframeworkthattakestheadvantages IntegratedArchitectures DiscreteArchitectures
|     |     |     |     |     |     | Architecture |     | A10-7850K | Ryzen52400G |     | GTX1080Ti V100 |
| --- | --- | --- | --- | --- | --- | ------------ | --- | --------- | ----------- | --- | -------------- |
ofthespecialfeaturesofintegratedarchitectures.
|     |     |     |     |     |     |     | #cores |     | 512+4 704+4 |     | 3584 5120 |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | ----------- | --- | --------- |
2)Wedeveloplightweightqueryplanadaptationsforhan- TFLOPS 0.9 1.7 11.3 14.1
|     |     |     |     |     |     | bandwidth(GB/s) |     |     | 25.6 38.4 |     | 484.4 900 |
| --- | --- | --- | --- | --- | --- | --------------- | --- | --- | --------- | --- | --------- |
dlingdynamicworkloadswiththeperformancemodelthat
|     |     |     |     |     |     |     | price($) |     | 209 169 |     | 1100 8999 |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | ------- | --- | --------- |
considersboththeoperatorandarchitecturecharacteristics.
|       |          |            |     |          |                |     | TDP(W) |     | 95  | 65  | 250 300 |
| ----- | -------- | ---------- | --- | -------- | -------------- | --- | ------ | --- | --- | --- | ------- |
| 3) We | evaluate | FineStream | on  | a set of | stream queries |     |        |     |     |     |         |
ThenumberofcoresforeachintegratedarchitectureincludesfourCPUcores.For
discretearchitectures,weonlyshowtheGPUdevice.
| to demonstrate |     | the performance | benefits |     | over current ap- |     |                         |     |     |     |     |
| -------------- | --- | --------------- | -------- | --- | ---------------- | --- | ----------------------- | --- | --- | --- | --- |
| proaches.      |     |                 |          |     |                  | 2.2 | StreamProcessingwithSQL |     |     |     |     |
2 Background Althoughvariousheterogeneousstreamprocessingsystems
haveappeared[23,33,34,41,54,62,67],wefindthatmost
2.1 IntegratedArchitecture
ofthesesystemsareusedtoprocessunstructureddata,and
We show an architectural overview of the CPU-GPU inte- onlyonework,Saber[34],isdevelopedforstructuredstream
gratedarchitectureinFigure1. Theintegratedarchitecture processing on GPUs. Saber supports structured query lan-
consists of a CPU,a GPU,a shared memory management guage(SQL)onstreamdata[6].Thebenefitsofsupporting
unit,and system DRAM. CPUs and GPUs have their own SQLcomefromtwoaspects.First,withSQL,userscanuse
caches.Somemodelsofintegratedarchitectures,suchasIntel familiarSQLcommandstoaccesstherequiredrecords,which
Haswelli7-4770Rprocessor[3],integrateasharedlastlevel makesthesystemeasytouse.Second,supportingSQLelimi-
cacheforbothCPUsandGPUs. Thesharedmemoryman- natesthetediousprogrammingoperationsabouthowtoreach
agementunitisresponsibleforschedulingaccessestosystem a required record,which greatly expands the flexibility of
DRAMbydifferentdevices.ComparedtothediscreteCPU- itsusage.Basedontheanalysis,thisworkexploresstream
GPUarchitecture,bothCPUsandGPUsareintegratedonthe processingwithSQLonintegratedarchitectures.

We consider supporting the basic SQL functions with runsontheCPU,group-bytakesabout18.2msandaggre-
streamprocessing,asshowninFigure2. Accordingto[6], gationtakesabout5.2ms.However,whenthequeryrunson
SQLonstreamprocessingconsistsofthefollowingfourma- theGPU,group-bytakesabout6.7msandaggregationtakes
| jorconcepts:1)DatastreamS,whichisasequenceoftuples, |     |     | about5.8ms. |     |     |     |     |     |     |
| --------------------------------------------------- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- |
<t ,t ,...>,wheret isatuple.Atupleisafiniteorderedlist query on CPU query on GPU
| 1 2 | i   |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
GPU queue:
ofelements,andeachtuplehasatimestamp.2)Windoww, 18.2 ms 5.2 ms operator 1 operator 2
|     |     |     |     |     |     |     |     | group-by | aggregation |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----------- |
whichreferstoafinitesequenceoftuples,whichisthedata
|                                                     |     |                      |            | operator 1 |     | operator 2  |     | 6.7 ms | 5.8 ms |
| --------------------------------------------------- | --- | -------------------- | ---------- | ---------- | --- | ----------- | --- | ------ | ------ |
| unittobeprocessedinaquery.                          |     | Thewindowinstreamhas | CPU queue: |            |     |             |     |        |        |
|                                                     |     |                      |            | group-by   |     | aggregation |     |        |        |
| twofeatures:windowsizeandwindowslide.Windowsizerep- |     |                      |            |            |     |             |     |        | time   |
resentsthesizeofthedataunittobeprocessed,andwindow
Figure3:Anexampleofoperator-devicepreference.
slidedenotestheslidingdistancebetweentwoadjacentwin-
|     |     |     | We further | evaluate |     | the performance |     | of operators | on a |
| --- | --- | --- | ---------- | -------- | --- | --------------- | --- | ------------ | ---- |
dows.3)Operators,whicharetheminimumprocessingunits
|     |     |     | singledevicein |     | Table2. | Table2showsthatusinga |     |     | single |
| --- | --- | --- | -------------- | --- | ------- | --------------------- | --- | --- | ------ |
forthedatainawindow.Inthiswork,wesupportcommon
|     |     |     | typeofdevicecannot |     | achievetheoptimalperformancefor |     |     |     |     |
| --- | --- | --- | ------------------ | --- | ------------------------------- | --- | --- | --- | --- |
relationaloperatorsincludingprojection,selection,aggrega-
alloperators.Theaggregationincludestheoperatorsofsum,
tion,group-by,andjoin.4)Queries,whichareaformofdata
count,andaverage,andtheyhavesimilarperformance.We
processing,eachofwhichconsistsofatleastoneoperatorand
usesumasarepresentativeforaggregation.FromTable2,we
isbasedonwindows.Additionally,notethatinrealstream
canseethatprojection,selection,andgroup-byachievebetter
processingsystemssuchasSaber[34],dataareprocessedin
performanceontheGPUthanontheCPU,whileaggregation
batchgranularity,insteadofwindowgranularity.Abatchcan
andjoinachievebetterperformanceontheCPUthanonthe
beagroupofwindowswhenthewindowsizeissmall,ora
|     |     |     | GPU. Additionally, |     | projection |     | shows | similar | performance |
| --- | --- | --- | ------------------ | --- | ---------- | --- | ----- | ------- | ----------- |
partofawindowwhenthewindowsizeisextremelylarge.
|     |     |     | on CPU | and GPU | devices. | Specifically,for |     |     | join,the CPU |
| --- | --- | --- | ------ | ------- | -------- | ---------------- | --- | --- | ------------ |
window size performanceisabout6xtheGPUperformance.Suchdifferent
window w1 devicepreferencesinspireustoperformfine-grainedstream
data stream
processingonintegratedarchitectures.
… tuple …
Table2:Performance(tuples/s)ofoperatorsontheCPUand
|     |              | window w2 | theGPUoftheintegratedarchitecture. |              |      |     |              |     |              |
| --- | ------------ | --------- | ---------------------------------- | ------------ | ---- | --- | ------------ | --- | ------------ |
|     |              |           |                                    | CPUonly(106) |      |     | GPUonly(106) |     |              |
|     | window slide | query     | Operator                           |              |      |     |              |     | Devicechoice |
|     |              |           | projection                         |              | 14.2 |     | 14.3         |     | GPU          |
… results
|     |                                  |           | selection   |     | 13.1 |     | 14.1 |     | GPU |
| --- | -------------------------------- | --------- | ----------- | --- | ---- | --- | ---- | --- | --- |
|     |                                  | operators | aggregation |     | 14.7 |     | 13.5 |     | CPU |
|     | Figure2:StreamprocessingwithSQL. |           | group-by    |     | 8.1  |     | 12.4 |     | GPU |
|     |                                  |           | join        |     | 0.7  |     | 0.1  |     | CPU |
Integratedarchitectureseliminatedatatransmissioncost
3 RevisitingStreamProcessing
betweenCPUandGPUdevices.Thisprovidesopportunities
Wediscussthenewopportunities(Section3.1)andchallenges
forstreamprocessingwithoperator-levelfine-grainedplace-
(Section3.2)forstreamprocessingonintegratedarchitectures
ment.TheoperatorsthatcanfullyutilizetheGPUcapacity
inthissection,whichmotivatethiswork.
exhibithigherperformanceonGPUsthanonCPUs,sothese
3.1 VaryingOperator-DevicePreference operatorsshallbeexecutedonGPUs.Incontrast,theopera-
Opportunities:Duetotheeliminationoftransmissioncost torswithlowparallelismshallbeexecutedonCPUs.Please
notethatsuchfine-grainedcooperationsisinefficientondis-
betweenCPUandGPUdevicesonintegratedarchitectures,
creteCPU-GPUarchitecturesduetotransmissionoverhead.
wecanassignoperatorstoCPUandGPUdevicesinafine-
grainedmanneraccordingtotheirdevice-preference. Forexample,Saber [34],one ofthe state-of-the-artstream
processingenginesutilizingthediscreteCPU-GPUarchitec-
Weanalyzetheoperatorsinaquery,andfindthatdifferent
tures,isdesignedaimingtohidePCI-eoverhead.Itadopts
operatorsshowvariousdevicepreferencesonintegratedar-
abulk-synchronousparallelmodel,wherealloperatorsofa
chitectures.Someoperatorsachievehigherperformanceon
queryarescheduledtooneprocessortoprocessamicro-batch
theCPUdevice,andothershavehigherperformanceonthe
ofdata[53].
GPUdevice.Weuseasimplequeryofgroup-byandaggrega-
3.2 Fine-GrainedStreamProcessing
tionontheintegratedarchitectureforillustration,asshownin
Figure3.TheGPUqueueisusedtosequentiallyexecutethe Challenges: Afine-grainedstreamprocessingthatconsid-
queriesontheGPU,whiletheCPUqueueisusedtoexecute ersbotharchitecturecharacteristicsandoperatorpreference
therelatedqueriesontheCPU.Thewindowsizeis256tuples shallhavebetterperformance,butthisinvolvesseveralchal-
lenges,frombothapplicationandarchitectureperspectives.
andthewindowslideis64.Eachbatchcontains64,000tuples,
andeachtupleis32bytes.Theinputdataaresynthetically Basedontheanalysis,wearguethatstreamprocessingon
generated,whichisdescribedinSection7.1.Whenthequery integratedarchitecturescanhavemuchdesirableproperties

than that on discrete CPU-GPU architectures. Particularly, 4 FineStreamOverview
thisworkintroducesaconceptoffine-grainedstreamprocess- Weproposeaframework,calledFineStream,forfine-grained
ing: co-runningtheoperatorstoutilizethesharedmemory streamprocessingonintegratedarchitectures.Theoverview
onintegratedarchitectures,anddispatchingtheoperatorson ofFineStreamisshowninFigure4.FineStreamconsistsof
devices with both architecture characteristics and operator threemajorcomponents,includingperformancemodel,on-
featuresconsidered. line profiling,and dispatcher. The online profiling module
isusedtoanalyzeinputbatchesandqueriesforusefulinfor-
However,enablingfine-grainedstreamprocessingonin-
mation,whichisthenfedintotheperformancemodel.The
tegratedarchitecturesiscomplicatedbythefeaturesofSQL
performancemodelmoduleusesthecollecteddatatobuild
streamprocessingandintegratedarchitectures.Wesumma-
modelsforquerieswithbothCPUsandGPUstoassistopera-
rizethreemajorchallengesasfollows.
tordispatching.Thedispatchermoduleassignsstreamdata
Challenge 1: Application topology combined with ar- tooperatorswithproperprocessorsaccordingtotheperfor-
chitecturalcharacteristics.Applicationtopologyinstream mancemodelonthefly.
processingreferstotheorganizationandexecutionorderof
batch batch stream
theoperatorsinaSQLquery.First,therelationamongoper- … …
atorscouldbemorecomplicatedinpractice.Theoperators
may be represented as a directed acyclic graph (DAG),in-
SQL online dispatcher
steadofachain,whichcontainsmoreparallelacceleration
profiling
opportunities.Second,witharchitecturalcharacteristicscon-
operators
sidered,suchastheCPUandGPUarchitecturaldifferences,
op1 op2 op1
thetopologywithcomputingresourcedistributionbecomes performance
results
model
verycomplex.Insuchsituations,howtoperformfine-grained dev dev dev
operatorplacementforapplicationtopologyondifferentde- device mapping
FineStream
vicesofintegratedarchitecturesbecomesachallenge.Third,
toassisteffectiveschedulingdecisions,aperformancemodel Figure4:FineStreamoverview.
isneededtopredictthebenefitsfromvariousperspectives. Next, we discuss the ideas in FineStream, including its
workflow,queryplangeneration,processinggranularity,op-
Challenge2:SQLqueryplanoptimizationwithshared
eratormapping,andsolutionstothechallengesmentionedin
mainmemory.First,aSQLqueryinstreamprocessingcan
Section3.2.
consist of many operators,and the execution plan of these
Workflow. The workflow of FineStream is as follows.
operatorsmaycausedifferentbandwidthpressuresanddevice
Whentheenginestarts,itfirstprocessesseveralbatchesusing
preferences.Second,inmanycases,independentoperators
only the CPUs or the GPUs to gather useful data. Second,
maynotconsumeallthememorybandwidth,butco-running
basedonthesedata,itbuildsaperformancemodelforoper-
themtogethercouldexceedthebandwidthlimit.Weneedto
atorsofaqueryondifferentdevices.Third,aftertheperfor-
analyzethememorybandwidthrequirementofco-running.
mancemodelisbuilt,thedispatcherstartstowork,andthe
Third,CPUsandGPUshavedifferentpreferredmemoryac-
fine-grainedstream processing begins. Eachoperatorshall
cesspatterns.Currentmethods[5,23,25,33,34,54,62]donot
be assigned to the cores of the CPU or the GPU for paral-
considerthesecomplexsituationsofsharedmainmemoryin
lelexecution.Additionally,theworkloadcouldbedynamic.
integratedarchitectures.
Fordynamicworkload,queryplanadjustmentandresource
Challenge 3: Adjustment for dynamic workload. Dur- reallocationneedtobeconducted.
ingstreamprocessing,streamdataarechangingdynamically Topology.ThequeryplancanberepresentedasaDAG.In
in distributions andarrivalspeeds,whichis challenging to thispaper,weconcentrateonrelationalqueries.Weshowan
adapt. First,workload change detection and computing re- exampleinFigure5,whereOP representsanoperator.OP7
i
sourceadjustmentneedtobedoneinalightweightmanner, andOP11canrepresentjoins.Wefollowtheterminologyin
andtheyarecriticaltoperformance.Second,thequeryplan compilerdomain[52],andcalltheoperatorsfromthebegin-
mayalsoneedtobeupdatedadaptively,becausetheoperator ningortheoperatorafterjointotheoperatorthatmergeswith
placementstrategybasedontheinitialstatemaynotbesuit- anotheroperatorasabranch.Hence,thequeryplanisalsoa
ablewhentheworkloadchanges.Third,duringadaptation, branchDAG.Forexample,theoperatorsofOP1,OP2,and
onlinestreamprocessingneedstobeservedefficiently.Re- OP3formabranchinFigure5.Themainreasonweusethe
sourceadjustmentandqueryplanadaptationontheflymay branchconceptisforparallelism:operatorswithinabranch
incurruntimeoverhead,becauseweneedtoadjustnotonly can be evaluated in a pipeline, and different branches can
theoperatorsintheDAGbutalsothehardwarecomputingre- beexecutedinparallel,whichshallbedetailedinSection5.
sourcestoeachoperator.Additionally,theadjustmentamong The execution time in processing one batchis equalto the
differentstreamsalsoneedstobeconsidered. traversaltimefromthebeginningtotheendoftheDAG.Be-

causebranchescanbeprocessedinparallel,thebranchwith Intheperformancemodel,weconsidertwokindsofparal-
thelongestexecutiontimedominatestheexecutiontime.We lelism.First,forintra-batchparallelism,weconsiderbranch
calltheoperatorpaththatdeterminesthetotalexecutiontime co-running,whichmeansco-runningoperatorsinprocessing
as path ,sothebranchwiththelongestexecutiontime onebatch.Second,forinter-batchparallelism,weconsider
critical
belongsto path .Forexample,weassumethatbranch2 batchpipeline,whichmeansprocessingdifferentbatchesin
critical
| hasthelongestexecutiontimeamongthebranches,itstime |                           |     |     |        |          | pipelines.           |     |     |     |     |
| -------------------------------------------------- | ------------------------- | --- | --- | ------ | -------- | -------------------- | --- | --- | --- | --- |
| ist                                                | ,andtheexecutiontimeforOP |     |     | ist    | .OP7 and |                      |     |     |     |     |
| branch2                                            |                           |     |     | i OP_i |          | 5.1 BranchCo-Running |     |     |     |     |
OP11canalsoberegardedasbranches.Onlywhentheout- Independentbranchescanbeexecutedinparallel.Withlim-
comesofOP3andOP6areavailable,thenOP7canproceed.
itedcomputationresourcesandbandwidth,webuildamodel
SodototheoperatorsofOP7andOP10toOP11.Assuming
forbranchco-runningbehaviorsinthispart.WeuseBmax
OP7andOP11areblockingjoinoperators,thetotalexecution
todenotethemaximumbandwidththeplatformcanprovide.
| timeforthisqueryisthesumoft |     |     |     | ,t ,andt | .   |     |     |     |     |     |
| --------------------------- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- |
branch2 OP7 OP11 If the sum of bandwidth utilization from different parallel
branches,Bsum,exceedsBmax,weassumethatthethrough-
branch1
|     |         | OP1 OP2 | OP3 |              |     |                                                      |     |     |     |     |
| --- | ------- | ------- | --- | ------------ | --- | ---------------------------------------------------- | --- | --- | --- | --- |
|     |         |         |     | pathcritical |     | putdegradesproportionallytotheBmax/Bsumofthethrough- |     |     |     |     |
|     | branch2 |         |     | OP7          |     | putwithenoughbandwidth[60].Tomeasurethebandwidth     |     |     |     |     |
|     |         | OP4 OP5 | OP6 |              |     |                                                      |     |     |     |     |
OP11
utilization,generally,fornco-runningtasks,wehavenco-
branch3 running stages,because tasks complete one by one. When
|     |     | OP8 OP9 | OP10 |     |     |     |     |     |     |     |
| --- | --- | ------- | ---- | --- | --- | --- | --- | --- | --- | --- |
multipletasksfinishatthesametime,thenumberofstages
Figure5:AnexampleofqueryoperatorsinDAGrepresenta-
decreasesaccordingly.
tion,whereOP representsanoperator. WeusetheexampleinFigure5forillustration.Assumethat
i
Operator Mapping. Thefine-grainedscheduling lies in thetimefordifferentbranchesisshowninFigure6(a).Ifwe
opeOrPa1torsOtPo2the…limiteOPd iresources co-runthethreebranchessimultaneously,thentheexecution
| how | to map | the |     |     | on inte- |     |     |     |     |     |
| --- | ------ | --- | --- | --- | -------- | --- | --- | --- | --- | --- |
canbepartitionedintothreestageswithdifferentoverlapping
gratedarchitectures.InFineStream,weallowOaPn xoperatorto
…
O P3 O P 4 O P j GPUdeviceO.P Wy situations. We uset ,t ,andt to representthe
useoneorseveralco re soft h e CPU orth e hen stage1 stage2 stage3
|     |     |     |     |     |     | relatedstagetimewhen |     | thesystem | hasenoughbandwidth. |     |
| --- | --- | --- | --- | --- | --- | -------------------- | --- | --------- | ------------------- | --- |
theplatformcannotpOrPo5videOeP6noug…hresoOuP rkcesforalltheoper-
ators,someoperatorsmaysharethesamecomputeunits.For Then,iftherequiredbandwidthforstage i exceedsBmax,the
|                                                      |     |     |     |     |     | relatedrealexecutiontimet |                                     |         | ’alsoextendsaccordingly. |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | ------------------------- | ----------------------------------- | ------- | ------------------------ | --- |
| example,inFigure5,OP1andOP2cansharethesameCPU        |     |     |     |     |     |                           |                                     | stage_i |                          |     |
|                                                      |     |     |     |     |     | Wedefinet                 | ’inEquation1.Whentheplatformcanpro- |         |                          |     |
| cores.Ifso,theinputbatchessequentiallygoesthroughOP1 |     |     |     |     |     |                           | stage_i                             |         |                          |     |
andOP2andnopipelineexistsbetweentwobatchesforOP1 videtherequiredbandwidth,r i isequaltoone.Otherwise,r i
istheratiooftherequiredbandwidthdividedbyBmax.
andOP2.
| Solutions |     | to Challenges. | FineStream | addresses | all the |          |                   |     |                   | t      |
| --------- | --- | -------------- | ---------- | --------- | ------- | -------- | ----------------- | --- | ----------------- | ------ |
|           |     |                |            |           |         | t stage1 | t stage2 t stage3 |     | t stage1 t stage2 | stage3 |
challengesmentionedinSection3.2.Forthefirstchallenge, branch 1 branch 1 branch 3
theperformancemodelmoduleestimatestheoverallperfor- branch 2 branch 2
mancewiththehelpoftheonlineprofilingmodulebysam-
|     |     |     |     |     |     | branch 3 |     | time | branch 3 |     |
| --- | --- | --- | --- | --- | --- | -------- | --- | ---- | -------- | --- |
time
pling on a smallnumberofbatches,andthe dispatcherdy- (a) Branch parallelism. (b) Branch scheduling optimization.
namicallyputstheoperatorsonthepreferreddevices.Forthe Figure6:Anexampleofbranchparallelismandoptimization.
secondchallenge,wehaveconsideredthebandwidthfactor (cid:48)=r
|     |     |     |     |     |     |     | t stage_i | i ·t | stage_i | (1) |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---- | ------- | --- |
whenbuildingtheperformancemodel,whichcanbeusedto
branch1 ToestimOPa1tetheOPti2mefoOrP3processingabatchinthecritical
| guidetheparallelism |     | foroperatorswithlimitedbandwidth |     |     |     |     |     |     |     |     |
| ------------------- | --- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
p a t h
|     |     |     |     |     |     | path,generallyforthebranchDAG,wep |     |     | e r f ocrritimcal topologysort |     |
| --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | ------------------------------ | --- |
considered.Forthethirdchallenge,theonlineprofilingchecks
tboraonrchg2anizethebranchesintodiffeOrPe7ntlayers,andthenweco-
boththestreamandtheoperatorstomeasurethedatainges- OP4 OP5 OP6
OP11
runbranchesonlayergranularity.Ineachlayer,weperform
tionrate,andFineStreamresponsestothesesituationswith
tbhraencahb3ovebranchco-running.Then,thetotalexecutiontime
differentstrategiesbasedontheanalysisfordynamicwork- OP8 OP9 OP10
isthesumoftimeofalllayers,asshowninEquation2.
loads.Next,weshowthedetailsofoursystemdesign.
nlayernstage
5 ModelforParallelismUtilization
|            |     |                                         |     |     |     |     | t =   | ∑ ∑ t   | (cid:48)        | (2) |
| ---------- | --- | --------------------------------------- | --- | --- | --- | --- | ----- | ------- | --------------- | --- |
|            |     |                                         |     |     |     |     | total |         | stage_i,layer_j |     |
| Guideline: |     | Aperformancemodelisnecessaryforoperator |     |     |     |     |       | j=0 i=0 |                 |     |
placement in FineStream,especially for the complicated The throughput is the number of tuples divided by the
executiontime.Assumethenumberoftuplesinabatchism,
| operatorrelationsintheDAGstructure. |     |     |     | Theoverheadof |     |     |     |     |     |     |
| ----------------------------------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
buildingfine-grainedperformancemodelforaqueryislim- then,thethroughputisshowninEquation3.
| itedbecausetheplacementstrategyfromthemodelcanbe |     |     |     |     |     |     |            |     | m   |     |
| ------------------------------------------------ | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- |
|                                                  |     |     |     |     |     |     | throughput |     | =   | (3) |
branchCoRun
| reusedforthecontinuousstreamdata. |     |     |     |     |     |     |     |     | t total |     |
| --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- |
Wemodeltheperformanceofexecutingaqueryinthissec- Optimization.Wecanperformbranchschedulingforop-
tion.TheoperatorsoftheinputqueryareorganizedasaDAG. timization,whichhastwomajorbenefits. First,bymoving

branchesfromthestagewithfullyoccupiedbandwidthutiliza- Whenbandwidth doesnotreachBmax,theexecution
overlap
tiontothestagewithsurplusbandwidth,thebandwidthcan timeforprocessingnbatches,t ,isshowninEquation5.
nBatches
bebetterutilized.Forexample,inFigure6(b),assumethatin
|     |     |     |     |     | t   | =n·MAX(t | ,t  | )+MIN(t | ,t  | ) (5) |
| --- | --- | --- | --- | --- | --- | -------- | --- | ------- | --- | ----- |
stage ,therequiredbandwidthexceedsBmax,butthesumof nBatches phase1 phase2 phase1 phase2
1
therequiredbandwidthofbranch2andbranch3islowerthan Whenbandwidth reachesBmax,theexecutiontime
overlap
Bmax,thenwecanmovetheexecutionofbranch3afterthe ofco-runningtwophasesinthepipelineondifferentbatches
executionofbranch1forbetterbandwidthutilization.Second, islongerthananyoftheirindependentexecutiontime.We
thesystemmaynothaveenoughcomputationresourcesforall assume that the independent execution time of the longer
branchessothatwecanreschedulebranchesforbettercompu- phaseist andtheindependenttimefortheshorterphaseis
l
tationresourceutilization.Instage1ofFigure6(a),whenthe t . Then,the overlapping ratio for the two phases r ist
|     |     |     |     |     | s   |     |     |     |     | olp s |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- |
platformcannotprovideenoughcomputingresourcesforall dividedbyt.Assumingthetotalsizeofthememoryaccesses
l
thethreebranches,wecanperformtheschedulinginFigure6 for the longerphase is s,and the total size forthe shorter
l
(b). Additionally,We can perform batch pipeline between phaseiss s ,thentheexecutiontimeoftheoverlappinginterval,
operatorsineachbranch,whichshallbediscussednext. t ,isshowninEquation6.
olp
|                   |     |     |     |     |     |     | s         | +r ·s   |     |     |
| ----------------- | --- | --- | --- | --- | --- | --- | --------- | ------- | --- | --- |
|                   |     |     |     |     |     |     | t =       | s olp l |     | (6) |
| 5.2 BatchPipeline |     |     |     |     |     |     | olp       |         |     |     |
|                   |     |     |     |     |     |     | bandwidth | overlap |     |     |
WecanalsopartitiontheDAGintophases,andperformco- Toestimatethetimeoftherestpartinthelongerphase,we
assumethatthebandwidthoftheindependentexecutionof
runninginpipelinebetweenphasesforprocessingdifferent
batches.Forsimplicity,inthispart,weassumethatthenum- thelongerphaseisbandwidth l .Then,theexecutiontimet rest
berofphasesintheDAGistwo.Pleasenotethatwhenthe isshowninEquation7.
|     |     |     |     |     |     |     | (1−r | )·s |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- |
platformhasenoughresources,thepipelineforoperatorscan t = olp l (7)
rest
| bedeeper.WeshowasimpleexampleinFigure7(a).The |     |     |     |     |     |     | bandwidth | l   |     |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | --- | --------- | --- | --- | --- |
operatorsinphase1andtheoperatorsinphase2needtobe Then,whenbandwidthBmaxisreached,theexecutiontime
t toprocessnbatchesisshowninEquation8.
| mappedintodifferentcomputeunits,sothatthesetwophases |     |     |     |     | nBatches |     |         |      |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | -------- | --- | ------- | ---- | --- | --- |
|                                                      |     |     |     |     |          |     | t =n·(t | +t ) |     |     |
canco-runinthepipeline.Figure7(b)showstheexecution nBatches olp rest (8)
|     |     |     |     |     | We assume | thata | batchcontains | m tuples,andthen,the |     |     |
| --- | --- | --- | --- | --- | --------- | ----- | ------------- | -------------------- | --- | --- |
flowinpipeline.WhenFineStreamcompletestheprocessing
throughputcanbeexpressedbyEquation9.Whenbandwidth
forbatch1inphase1andstartstoprocessbatch1inphase2,
FineStreamcanstarttoprocessbatch2inphase1simultane- issufficient,t nBatches isdescribedasEquation5; otherwise,
Equation8.
| ously. Phase1andphase2canco-runbecausetheyrelyon |     |     |     |     |     |            |               | m·n |     |     |
| ------------------------------------------------ | --- | --- | --- | --- | --- | ---------- | ------------- | --- | --- | --- |
| differentcomputeunits.                           |     |     |     |     |     | throughput | batchPipeline | =   |     | (9) |
t
nBatches
phase 1 phase 2 Optimization.Branchco-runningcanalsobeconducted
|     |     |     | PH i: phase i | B i:    batch i |     |     |     |     |     |     |
| --- | --- | --- | ------------- | --------------- | --- | --- | --- | --- | --- | --- |
inbatchpipeline.Forexample,inFigure7,thebranchesin
| OP1 OP2 | OP3 |     |     |               |     |     |     |     |     |     |
| ------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
|         | OP7 |     |     | PH2 B1 PH2 B2 |     |     |     |     |     |     |
OP4 OP5 OP6 phase1canbecorunwhenthesystemcanprovidesufficient
OP11
PH1 B1 PH1 B2 … computingresourcesandbandwidth.Theonlythingweneed
| OP8 OP9 | OP10 |     |     |     |     |     |     |     |     |     |
| ------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
time
todoistointegratethebranchco-runningtechniqueinthe
| (a) Phase partitioning. |     |     |     | (b) Batch pipeline. |     |     |     |     |     |     |
| ----------------------- | --- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- |
potentialphases.
| Figure 7: | An example | of partitioning |     | phases for batch |     |     |     |     |     |     |
| --------- | ---------- | --------------- | --- | ---------------- | --- | --- | --- | --- | --- | --- |
5.3 HandlingDynamicWorkload
pipeline.
Inbranchco-running,thehardwareresourcebindedtoeach
|          | STG2  | STG2  | … STG2  |     |     |     |     |     |     |     |
| -------- | ----- | ----- | ------- | --- | --- | --- | --- | --- | --- | --- |
| stage 2: | B 1   | B2    | B       | n   |     |     |     |     |     |     |
We need to es t imate th e bandwidth o f two overlapping branch is based on the characteristics of both the operator
andtheworkload.Duringworkloadmigration,theworkload
| phases, stage 1: so STG1 B1 | that we STG1 B2 can | fu…rther STG1 Bn estimate |     | the batch pipeline |     |     |     |     |     |     |
| --------------------------- | ------------------- | ------------------------- | --- | ------------------ | --- | --- | --- | --- | --- | --- |
,isthesumtoimfethe pressureforeachbranchmaybedifferentfromtheoriginal
throughput.Thetimeforaphase,t
phase_i
executiontimeoftheoperatorsinthephaseforprocessing state. Hence,the static computing resource allocation may
notbesuitablefordynamicworkload.
| abatch.Weuset | phase1 todenotethetimeforphase1while |     |     |     |     |     |     |     |     |     |
| ------------- | ------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
t forphase2.Whentwobatchesarebeingprocessedin Apossiblesolutionistoredistributecomputingresources
phase2
differentphasesintheengine,FineStreamtriestomaximize to operators in each branch according to the performance
|                   |        |        |                      |     | model. However,thissolution |     |     | hasthefollowingtwodraw- |     |     |
| ----------------- | ------ | ------ | -------------------- | --- | --------------------------- | --- | --- | ----------------------- | --- | --- |
| theoverlappingoft |        | andt   | ofthetwobatches.How- |     |                             |     |     |                         |     |     |
|                   | phase1 | phase2 |                      |     |                             |     |     |                         |     |     |
ever,theoverlappingcanbeaffectedbymemorybandwidth backs.First,onlyadjustingthehardwareresourcesondiffer-
entbranchesmaynotbeabletomaintaintheperformance,
| utilization. | The online profiling |     | in Section | 6.3 collects the |     |     |     |     |     |     |
| ------------ | -------------------- | --- | ---------- | ---------------- | --- | --- | --- | --- | --- | --- |
becausequeryplantopologymaynotfitthecurrentstream-
| sizeofmemoryaccessess |     | (includingreadandwrite)and |     |     |     |     |     |     |     |     |
| --------------------- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
i,dev
theexecutiontimet foreachoperator.Thebandwidthof ing application. In such cases, the query plan needs to be
i,dev
|     |     |     |     |     | reoptimized | for | system performance. | Second, | resource | re- |
| --- | --- | --- | --- | --- | ----------- | --- | ------------------- | ------- | -------- | --- |
thetwooverlappingphasesisdescribedasEquation4.
∑m ∑n d is t r i b u t i o n i n c ur s o v e rh e ad . T h e re fo r e , e f fi c ie n t r e s o ur c e
| bandwidth | =MIN(Bmax, |     | i = 0 s | i , dev + i= m + 1 s i,dev) |     |     |     |     |     |     |
| --------- | ---------- | --- | ------- | --------------------------- | --- | --- | --- | --- | --- | --- |
overlap re a l l o c a t i o n a n d q u e r y p la n a d ju s tm e n t a r e n e c es s a r y f o r
|     |     |     | t ph a s | e 1 t ph a se 2 |     |     |     |     |     |     |
| --- | --- | --- | -------- | --------------- | --- | --- | --- | --- | --- | --- |
(4) FineStreamhandlingdynamicworkload.

Light-WeightResourceReallocation.InFineStream,we the model,FineStream generates several query plans with
use a light-weight dynamic resource reallocation strategy. detailedresourcedistribution.Withthegeneratedqueryplan,
Whentheworkloadingestionrateofabranchdecreases,we thedispatcherperformsfine-grainedschedulingforprocess-
cancalculatethereducedratio,andassumethatsuchpropor- ing the following batches. When dynamic workload is de-
tionofcomputingresourcesinthatbranchcanbetransferred tected,FineStream performs relatedadjustmentmentioned
to the other branches. We use an example in Figure 8 for inSection5.3.FortheoperatorsinFineStream,wereusethe
illustration.InFigure8(a),90%workloadafteroperatorOP1 operatorcodefromOmniDB[64].Pleasenotethatthegoal
flowtoOP2.Whentheworkloadstatechangestothestatein ofthisworkistoprovideafine-grainedstreamprocessing
Figure8(b),partofthecomputingresourceassociatedwith methodonintegratedarchitectures.Thesamemethodology
OP2shallbeassignedtoOP3accordingly. canalsobeappliedforusingotherOpenCLprocessingengine
suchasVoodoo[45].
| Shared memory | Integrated       | Shared memory | Integrated       | stream 1          |     |                  |      |     |
| ------------- | ---------------- | ------------- | ---------------- | ----------------- | --- | ---------------- | ---- | --- |
|               | architect u re s |               | architect u re s |                   |     |                  |      |     |
|               |                  |               |                  | thread 1 thread 2 |     | p a r a ll e l i | sm   |     |
90% OP2 G P U   10% OP2 C P U   operators performance u t il iz a t i o n  DAG 1 DAG i
C P U
OP1 C U s OP1 C U s b a t c h 1 CP U O P 1 B r a n c h   O P CP U% GP U%… …
|     |         |     |         |     | … G P U | Co - R u n n i | n g O P 1 … … | … … … |
| --- | ------- | --- | ------- | --- | ------- | -------------- | ------------- | ----- |
|     | C P U   |     | G P U   |     |         |                | … … …         | … …   |
10% OP3 90% OP3 b a t c h 2 G P U O P i ban d w idth  B a t c h
|     | C U s |     | C U s |     | utilization | Pipeline | O P i … … | … … |
| --- | ----- | --- | ----- | --- | ----------- | -------- | --------- | --- |
(a) 90% workload goes to OP2. (b) 90% workload goes to OP3. default
| Figure8:Anexampleofadjustmentfordynamicworkload. |     |     |     | batch3  |                         |                  |                                   |                     |
| ------------------------------------------------ | --- | --- | --- | ------- | ----------------------- | ---------------- | --------------------------------- | ------------------- |
|                                                  |     |     |     |         | dy n a m ic - o p e r a | to r             |                                   |                     |
|                                                  |     |     |     | ba tch4 | yes                     | m ig ra t i o n  | r e s o u r c e   s ti ll  lo w   | q u e r y  pl a n   |
Indetail,fortheingestion-rate-fallingbranch(dataarrival … w o r k loa d   d a t a f lo w   de te c t e d re a l lo c a t i o nper fo r m a nc e?a d j u s tm e n t
detection monitoring
time
| rate of this branch | is decreasing) | [30],we assume | that the |     |     |     |     |     |
| ------------------- | -------------- | -------------- | -------- | --- | --- | --- | --- | --- |
Figure9:FineStreamworkflow.
| initialingestionrateisr | ,whilethecurrentingestionrateis |     |     |     |     |     |     |     |
| ----------------------- | ------------------------------- | --- | --- | --- | --- | --- | --- | --- |
init
Additionally,whenuserschangethewindowsizeofaquery
| r cur .Then,thecomputingresourcetha |     | t shalOlPb2ereallocated |     |     |     |     |     |     |
| ----------------------------------- | --- | ----------------------- | --- | --- | --- | --- | --- | --- |
1 0%
to the other branches is shown in Equation 10. This adap- on the fly,FineStream updates the window size parameter
OP1
tive strategy is very light-weight,because we can monitor aftertherelatedbatchprocessingiscompleted,andthencon-
90% OP3
tinuestorunwithperformancedetection.Iftheperformance
theingestionrateduringbatchloadingandredistributethe
proportionofreducedcomputingresourcestothebranchthat decreases belowa given value (70% ofthe originalperfor-
mancebydefault),FineStreamre-determinesthequeryplan
hasahigheringestionrate.InthecaseofFigure8(b),wecan
keeplimitedhardwareresourceinOP2andredistributethe with computing resource based on the parameters and the
| resttoOP3afterprocessingthecurrentbatch. |        |                |      | performancemodel. |     |     |     |     |
| ---------------------------------------- | ------ | -------------- | ---- | ----------------- | --- | --- | --- | --- |
|                                          | r      | −r             |      | 6.2 Dispatcher    |     |     |     |     |
| resource                                 | = init | curr ·resource | (10) |                   |     |     |     |     |
redistribute_i OPi ThedispatcherofFineStreamisamoduleforassigningstream
r init
datatotherelatedoperatorswithhardwareresources.Thedis-
| Query Plan | Adjustment. | With reference | to [30], |     |     |     |     |     |
| ---------- | ----------- | -------------- | -------- | --- | --- | --- | --- | --- |
patcherhastwofunctions.First,itsplitsthestreamdatainto
FineStreamgeneratesnotonlythequeryplanthatsoonwill
be used in the stream processing,but also several possible batcheswithafixedsize.Second,itsendsthebatchestothe
correspondingoperatorswithproperhardwareresourcesfor
alternatives.Duringstreamprocessing,FineStreammonitors
execution.Thegoalofthedispatcheristoscheduleoperator
thesizeofintermediateresults.Iftheperformancedegrades
taskstotheappropriatedevicestofullyutilizethecapacityof
andthesizeofintermediateresultsvariesgreatly,FineStream
theintegratedarchitecture.
shallswitchtoanotheralternativequeryplantopology.Inthe
implementation,FineStreamgeneratesthreeadditionalplans Algorithm 1 is the pseudocode of the dispatcher. When
astreamisfirstlypresentedintheengine,FineStreamcon-
bydefault,andpicksthembasedontheperformancemodel.
ductsbranchco-runningandbatchpipelineaccordingtothe
6 ImplementationDetails
|     |     |     |     | performance | model mentioned | in Section | 5 (Lines | 2 to 5). |
| --- | --- | --- | --- | ----------- | --------------- | ---------- | -------- | -------- |
FineStreamalsodetectsdynamicworkload(Lines6to15).
6.1 HowFineStreamWorks
We present the system workflow in Figure 9. In Figure 9, If dynamic workload is detected,FineStream conducts the
thread1isusedtocacheinputdata,whilethread2isusedto related resource reallocation. If such reallocation does not
help,itfurtherconductsqueryplanadjustment.
processthecacheddata.Thedetailedworkflowisasfollows.
First, when FineStream starts a new query, the dispatcher 6.3 OnlineProfiling
executes the query on the CPU forbatch1 andthen on the The purpose of online profiling is to collect useful perfor-
GPUforbatch2.Second,duringthesesingle-deviceexecu- mancedatatosupportbuildingtheperformancemodel.
tions, FineStream conducts online profiling, during which Inonlineprofiling,wehavetwoconcerns.Thefirstiswhat
the operator-related data that are used to build the perfor- datatogenerateinthismodule.Thisisdecidedbytheperfor-
mance model are obtained, including the CPU and GPU mancemodel.Thesedataincludethedatasize,executiontime,
performance, and bandwidth utilization. Third, with these bandwidthutilization,andthroughputforeachoperatoron
data,FineStreambuildstheperformancemodelconsidering devices.Thesecondis,togeneratethedata,whatinformation
branchco-runningandbatchpipeline.Fourth,afterbuilding weshallcollectfromstreamprocessing.

Algorithm1:SchedulingAlgorithminFineStream theintegratedarchitecturetoacceleratestreamprocessing,we
compareFineStreamonintegratedarchitectureswithSaber
Functiondispatch(batch,resource,model):
1
| 2 if | taskFirstRunthen |     |     |     |     |     | ondiscreteCPU-GPUarchitectures. |     |     |     |
| ---- | ---------------- | --- | --- | --- | --- | --- | ------------------------------- | --- | --- | --- |
branchCoRun(resource,model)
| 3   |     |     |     |     |     |     | Platforms.Weperformexperimentsonfourplatforms,two |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------- | --- | --- | --- |
batchPipeline(resource,model)
| 4   |                    |     |     |     |     |     | integratedplatformsandtwodiscreteplatforms.Thefirstin- |     |     |     |
| --- | ------------------ | --- | --- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- |
| 5   | taskFirstRun=false |     |     |     |     |     |                                                        |     |     |     |
// Handling dynamic workload and query plan optimization tegratedplatformusestheintegratedarchitectureAMDA10-
6 ifdetectDynamicWorkload()then 7850K[15],andithas32GBmemory.Thesecondintegrated
| 7   | resourceReallocate() |     |     |     |     |     |     |     |     |     |
| --- | -------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ifresourceChanged==truethen platform uses the integrated architecture Ryzen 5 2400G,
8
9 ifperformanceDegrade()then whichisthelatestintegratedarchitecture,andthisplatform
|     | a   | d j u s t Q u e | r y P la n( )   |     |     |     |                                                  |     |     |     |
| --- | --- | --------------- | --------------- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- |
| 1 0 |     |                 |                 |     |     |     | has32GBmemory.Thefirstdiscreteplatformisequipped |     |     |     |
| 1 1 | q   | u e r y C h a   | n g e d = t rue |     |     |     |                                                  |     |     |     |
withanInteli7-8700KCPUandanNVIDIAGeForceGTX
|     | r e s o u r c e C h | a n g e d = | tr u e       |     |     |     |                                                |     |     |     |
| --- | ------------------- | ----------- | ------------ | --- | --- | --- | ---------------------------------------------- | --- | --- | --- |
| 1 2 |                     |             |              |     |     |     | 1080TiGPU,andalongwith32GBmemory.Theseconddis- |     |     |     |
| 1 3 | i f q u e r y C h   | a n g e d = | = t r uethen |     |     |     |                                                |     |     |     |
resourceChanged=false
| 14  |                    |     |     |     |     |     | creteplatformisequippedwithtwoIntelE5-2640v4CPUs |     |     |     |
| --- | ------------------ | --- | --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- |
| 15  | queryChanged=false |     |     |     |     |     |                                                  |     |     |     |
andanNVIDIAV100-32GBGPU,andhas264GBmemory.
Datasets.Weusefourdatasetsintheevaluation.Thefirst
datasetisGooglecomputeclustermonitoring[2],whichem-
ulatesaclustermanagementscenario.Theseconddatasetis
FineStreamperformsonlineprofilingforoperatorsfrom
memorybandwidthandcomputationperspectives. anomalydetectioninsmartgrids[68],whichisaboutdetec-
tioninenergyconsumptionfromdifferentdevicesofasmart
| Memory | Bandwidth | Perspective. |     | Based | on  | the above |     |     |     |     |
| ------ | --------- | ------------ | --- | ----- | --- | --------- | --- | --- | --- | --- |
electricitygrid.Thethirddatasetislinearroadbenchmark[7],
analysis,weusebandwidth,definedasthetransmitteddata
whichmodelsanetworkoftollroads.Thesetracescomefrom
sizedividedbytheexecutiontime,todepictthecharacteris-
real-worldapplications,andarewidelyusedinpreviousstud-
ticsfromdataperspectiveofanoperator.Thetransmitteddata
foranoperatorconsistsofinputandoutput.Theinputrelates iessuchas[19,34,39].Thefourthdatasetisasynthetically
generateddataset[34]forevaluatingindependentoperators,
tothebatchwhiletheoutputrelatestoboththeoperatorand
whereeachtupleconsistsofa64-bittimestampandsix32-bit
thebatch.Wedefinethebandwidthoftheoperatorionde-
attributesdrawnfromauniformdistribution.Tooverfeedthe
| vicedevinEquation11.Theparameterss |     |     |     |     | input_i | ands output_i |            |                      |             |               |
| ---------------------------------- | --- | --- | --- | --- | ------- | ------------- | ---------- | -------------------- | ----------- | ------------- |
|                                    |     |     |     |     |         |               | system and | test its performance | capacity,we | load the data |
denotetheestimatedinputandtheoutputsizesoftheoperator
frommemory.Thismethodavoidsnetworkbeingbottleneck.
| i,andt | representstheexecutiontimeoftheoperatorion |     |     |     |     |     |     |     |     |     |
| ------ | ------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
i,dev
Inpractice,thesystemobtainsstreamdatavianetwork.
devicedev.
|     |           |       | s       | +s       |     |      | Benchmarks.Weuseninequeriestoevaluatetheoverall      |     |     |     |
| --- | --------- | ----- | ------- | -------- | --- | ---- | ---------------------------------------------------- | --- | --- | --- |
|     |           |       | input_i | output_i |     |      |                                                      |     |     |     |
|     | bandwidth |       | =       |          |     | (11) |                                                      |     |     |     |
|     |           | i,dev |         | t        |     |      | performanceofthefine-grainedstreamprocessingengineon |     |     |     |
i,dev
theintegratedarchitectures.Similarbenchmarkshavebeen
| Computation | Perspective. |     | To  | depict | the characteristics |     |               |             |                     |              |
| ----------- | ------------ | --- | --- | ------ | ------------------- | --- | ------------- | ----------- | ------------------- | ------------ |
|             |              |     |     |        |                     |     | used in [34]. | The details | of the nine queries | are shown in |
throughput
| from the | computation | perspective, |     | we use |     | i,dev , |     |     |     |     |
| -------- | ----------- | ------------ | --- | ------ | --- | ------- | --- | --- | --- | --- |
Table3.Q1,Q2,andQ3areconductedontheGooglecompute
whichisdefinedasthetotalnumberofprocessedtuplesn
|                   |     |                                  |     |     |     | tuples | clustermonitoringdataset.Q4,Q5,andQ6areforthedataset |     |     |     |
| ----------------- | --- | -------------------------------- | --- | --- | --- | ------ | ---------------------------------------------------- | --- | --- | --- |
| dividedbythetimet |     | foroperatoriondevicedev.Allthese |     |     |     |        |                                                      |     |     |     |
i,dev
ofanomalydetectioninsmartgrids.Q7,Q8,andQ9arefor
valuescanbeobtainedfromonlineprofiling.
thedatasetfromthelinearroadbenchmark.
| 7 Evaluation |     |     |     |     |     |     | DynamicWorkloadGeneration.Weusethedatasetsand |     |     |     |
| ------------ | --- | --- | --- | --- | --- | --- | --------------------------------------------- | --- | --- | --- |
7.1 Methodology benchmarks to generate dynamic workload. For the first
|     |     |     |     |     |     |     | dataset of | cluster monitoring,the | seventh | attribute of cate- |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---------------------- | ------- | ------------------ |
ThebaselinemethodusedinourcomparisonisSaber[34],
whileourmethodisdenotedas“FineStream”.Saberisthe gorygraduallychangesfromtype1totype2within10,000
batches.WeusethequeryQ1forillustration,andwedenote
state-of-the-artwindow-basedstreamprocessingenginefor
itasT1.Similarevaluationsarealsoconductedonthesecond
discretearchitectures.Itadoptsabulk-synchronousparallel
datasetofsmartgridwiththequeryQ5,whichisdenotedas
| model [66]. | The whole | query | execution |     | on a batch | is dis- |     |     |     |     |
| ----------- | --------- | ----- | --------- | --- | ---------- | ------- | --- | --- | --- | --- |
T2,andthethirddatasetoflinearroadbenchmarkwiththe
| tributed | to a device,the | GPU | or  | the CPU,without |     | further |     |     |     |     |
| -------- | --------------- | --- | --- | --------------- | --- | ------- | --- | --- | --- | --- |
distributing operators of a query to different devices. The queryQ8,whichisdenotedasT3.
7.2 PerformanceComparison
originalCPUoperatorsinSaberarewritteninJava,andwe
furtherrewrite the CPU operators in Saberin OpenCL for Throughput.WeexplorethethroughputofFineStreamfor
higherefficiency.OurcomparisonstoSaberexaminewhether theninequeries.Figure10showstheprocessingthroughput
ourfine-grainedmethoddeliversbetterperformance.Toval- of the best single device, Saber, and FineStream for these
idate the co-running benefits of the two devices, we also queries on both the A10-7850K and Ryzen 5 2400G plat-
measure the performance using only the CPU and the per- forms.Pleasenotethatthey-axisofthefigureisinlogscale.
formanceusingonlytheGPU,denotedas“CPU-only”and Wehavethefollowingobservations.First,ontheA10-7850K
“GPU-only”. Further,tounderstandtheadvantageofusing platform,FineStreamachieves88%throughputimprovement

Table3:Thequeriesusedinevaluation.
| Query |     |     |     |     |     | Detail |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- |
Q1 select timestamp, category, sum(cpu) as totalCPU from TaskEvents [range 256 slide 1] group by category
Q2 select timestamp, jobID, avg(cpu) as avgCPU from TaskEvents [range 256 slide 1] where eventType == 1 group by jobId
Q3 select timestamp, eventType, userId, max(disk) as maxDisk from TaskEvents [range 256 slide 1] group by eventType, userId
| Q4 select | timestamp, | avg | (value) as | globalAvgLoad | from SmartGridStr | [range | 512 slide 1] |     |     |     |
| --------- | ---------- | --- | ---------- | ------------- | ----------------- | ------ | ------------ | --- | --- | --- |
Q5 select timestamp, plug, household, house, avg(value) as localAvgLoad from SmartGridStr [range 512 slide 1] group by plug,
| household, | house |     |     |     |     |     |     |     |     |     |
| ---------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Q6 (select L.timestamp, L.plug, L.household, L.house from LocalLoadStr [range 1 slide 1] as L, GlobalLoadStr [range 1 slide 1] as
G where L.house == G.house and L.localAvgLoad >G.globalAvgLoad) as R - select timestamp, house, count(*) from R group by house
Q7 ( select timestamp, vehicle, speed, highway, lane, direction, (position/5280) as segment from PosSpeedStr [range unbounded] )
as SegSpeedStr - select distinct L.timestamp, L.vehicle, L.speed, L.highway, L.lane, L.direction, L.segment from SegSpeedStr
[range 30 slide 1] as A, SegSpeedStr [partition by vehicle rows 1] as L where A.vehicle == L.vehicle
Q8 select timestamp, vehicle, count(direction) from PosSpeedStr [range 256 slide 1] group by vehicle
Q9 select timestamp, max(speed), highway, lane, direction from PosSpeedStr [range 256 slide 1] group by highway,lane,direction
over the best single device performance on average; com- eratorstotheirsuitabledevices.Inthisway,eachbatchcanbe
paredtoSaber,FineStreamachieves52%throughputimprove- processedinamoreefficientmanner,leadingtolowerlatency.
| ment. Because | of the | efficient | CPU | and GPU | co-running, |     |     |     |     |     |
| ------------- | ------ | --------- | --- | ------- | ----------- | --- | --- | --- | --- | --- |
FineStreamnearlydoublestheperformancecomparedtothe CPU-only Saber
1e+01
methodofusingonlyasingledevice.BecauseFineStream GPU-only FineStream
| adoptsthecontinuousoperatormodelwhereeachoperator |     |     |     |     |     | )s( ycnetal 1e+00 |     |     |     |     |
| ------------------------------------------------- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- |
1e-01
couldbescheduledonitspreferreddevice,FineStreamuti-
| lizestheintegratedarchitecturebetterthanSaberthatusesthe |     |     |     |     |     | 1e-02 |     |     |     |     |
| -------------------------------------------------------- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- |
| bulk-synchronousparallelmodel.Suchresultclearlyshows     |     |     |     |     |     | 1e-03 |     |     |     |     |
theadvantageoffine-grainedstreamprocessingontheinte-
1e-04
gratedarchitecture.Second,ontheRyzen52400Gplatform, Q1Q2Q3Q4Q5Q6Q7Q8Q9 Q1Q2Q3Q4Q5Q6Q7Q8Q9
|     |     |     |     |     |     |     | A10-7850K |     |     | Ryzen 5 2400G |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | --- | ------------- |

allhardwareconfigurationshavebeenupgradedincompar- Figure11:Latencyofdifferentqueries.
| ison withA10-7850K,especially |     |     | the | CPUs; | the CPU-only |            |     |     |     |     |
| ----------------------------- | --- | --- | --- | ----- | ------------ | ---------- | --- | --- | --- | --- |
|                               |     |     |     |       |              | Profiling. | We  |     |     |     |
throughputonRyzen52400Gismuchhigherthanthaton
|     |     |     |     |     |     | show the | rela- |     |  20 |     |
| --- | --- | --- | --- | --- | --- | -------- | ----- | --- | --- | --- |
A10-7850K. Moreover, Saber achieves a 56% throughput )s/selput 501(
|     |     |     |     |     |     |     |     | tuphguorht | FineStream(A10-7850K) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --------------------- | --- |
improvementcomparedtothethroughputofthebestsingle tionship between  15 Saber(A10-7850K)
|     |     |     |     |     |     | throughput | and |     |  10 | FineStream(Ryzen5) |
| --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | ------------------ |
device, and FineStream is still 14% higher than Saber on Saber(Ryzen5)
thisplatform. Similarphenomenahavealsobeenobserved latency of both  5
| in[58–60].                |     |          |     |            |       | FineStream                                        | and   |                                |  0     |                     |
| ------------------------- | --- | -------- | --- | ---------- | ----- | ------------------------------------------------- | ----- | ------------------------------ | ------ | ------------------- |
|                           |     |          |     |            |       | SaberinFigure12.                                  |       |                                |  0     |  0.3  0.6  0.9  1.2 |
|  100                      |     |          |     |            |       |                                                   |       |                                |        | latency (s)         |
| )s/selput 501( tuphguorht |     | CPU-only |     |            | Saber | Figure 12                                         | shows |                                |        |                     |
|                           |     | GPU-only |     | FineStream |       |                                                   |       | Figure12:Throughputvs.latency. |        |                     |
|                           |     |          |     |            |       | that queries                                      | with  |                                |        |                     |
|  10                       |     |          |     |            |       | highthroughputusuallyhavelowlatency,andviceversa. |       |                                |        |                     |
|                           |     |          |     |            |       | We furtherstudy                                   |       | the CPU                        | andGPU | utilization ofSaber |
 1
andFineStream,andusetheA10-7850Kplatformforillus-
|     |     |     |     |     |     | tration,as | shown in | Figure | 13. In | most cases,FineStream |
| --- | --- | --- | --- | --- | --- | ---------- | -------- | ------ | ------ | --------------------- |
utilizestheGPUdevicebetterontheintegratedarchitecture.
 0.1
| Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     | Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     |     |     |     |     |     |
| ------------------ | --- | --- | ------------------ | --- | --- | --- | --- | --- | --- | --- |
A10-7850K Ryzen 5 2400G AsforQ4,theCPUprocessesmostoftheworkload.Onaver-

Figure10:Throughputofdifferentqueries. age,FineStreamimproves23%GPUutilizationcomparedto
Saber,andhaveroughlythesameCPUutilizationasSaber.
Latency.Figure11reportsthelatencyofdifferentqueries
ontheintegratedarchitectures.Inthiswork,latencyisdefined SinceFineStreamachievesbetterthroughputandlatencythan
Saber,suchutilizationresultsindicatethatFineStreamgener-
astheend-to-endtimefromthetimeaquerystartstothetime
itends.FineStreamhasthelowestlatencyamongthesemeth- ateseffectivestrategiesindeterminingdevicepreferencesfor
ods.First,ontheA10-7850Kplatform,FineStream’slatency individualoperators.
| is 10% lower | than that | of  | the best single | device,and | 36% |     |     |     |     |     |
| ------------ | --------- | --- | --------------- | ---------- | --- | --- | --- | --- | --- | --- |
7.3 ComparisonwithDiscreteArchitectures
lowerthanthelatencyofSaber.Second,onRyzen52400G
Inthispart,wecompareFineStreamontheintegratedarchi-
platform,itis2%lowerthanthatofthebestsingledevice,and
9%lowerthanthatofSaber.ThereasonisthatFineStream tectures andSaberon the discrete architectures from three
considersdevicepreferenceforoperatorsandassignstheop- perspectives:performance,price,andenergy-efficiency.

thecomparisonoftheirprice-throughputratio.Onaverage,
Saber FineStream FineStreamontheintegratedarchitecturesoutperformsSaber
 100
| )%( noitazilitu |     |     |     |     |     |     |     | onthediscretearchitecturesby10.4x. |     |     |     |     |     |     |     |
| --------------- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------- | --- | --- | --- | --- | --- | --- | --- |
 80
oitar tuphguorht-ecirp  100000
 60 )DSU/tuphguorht( Saber(discrete-1080Ti) FineStream(A10-7850K)
|     |     |     |     |     |     |     |     |     |        | Saber(discrete-V100) |     |     | FineStream(Ryzen5) |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ | -------------------- | --- | --- | ------------------ | --- | --- |
|     |  40 |     |     |     |     |     |     |     |  10000 |                      |     |     |                    |     |     |
 20
 1000
 0
|     | Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     | Q1Q2Q3Q4Q5Q6Q7Q8Q9 |     |     |     |     |  100 |     |     |     |     |     |     |
| --- | ------------------ | --- | --- | ------------------ | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- |
|     |                    | CPU |     |                    |     | GPU |     |     |      |     |     |     |     |     |     |

Figure13:Utilizationoftheintegratedarchitecture.
 10
|     |     |     |     |     |     |     |     |     |     | Q1  | Q2 Q3 | Q4  | Q5 Q6 | Q7 Q8 | Q9  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | ----- | ----- | --- |
Performance latency integrated  Figure15:Comparisonofprice-throughputratio.
architecture
| Comparison. |     | The |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
EnergyEfficiencyComparison.Wealsoanalyzetheen-
| current | GPU | on the |     |     |     |     | discrete  |     |     |     |     |     |     |     |     |
| ------- | --- | ------ | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
caused by  architecture ergyefficiencyofFineStreamandSaber.TheThermalDesign
data transfer
| integrated |         | architec- |            |     |     |     |       |                                                 |       |        |                  |     |     |     |          |
| ---------- | ------- | --------- | ---------- | --- | --- | --- | ----- | ----------------------------------------------- | ----- | ------ | ---------------- | --- | --- | --- | -------- |
|            |         |           | from host  |     |     |     |       | Power                                           | (TDP) | is 95W | on A10-7850K,and |     |     | 65W | on Ryzen |
| ture       | is less | powerful  | memory to  |     |     |     |       |                                                 |       |        |                  |     |     |     |          |
|            |         |           |            |     |     |     | ratio | 52400G.Forthe1080Tiplatform,theTDPoftheInteli7- |       |        |                  |     |     |     |          |
GPU memory
| than | the | discrete |     |     | JOIN PROJAGG |     | SELTGRPBY |     |     |     |     |     |     |     |     |
| ---- | --- | -------- | --- | --- | ------------ | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
8700KCPUandNVIDIAGTX1080TiGPUare95Wand
| GPU, | as mentioned |     | Figure14:Latencycomparisonof |     |     |     |     |     |     |     |     |     |     |     |     |
| ---- | ------------ | --- | ---------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
250W,respectively.FortheV100platform,theTDPofthe
| in Section |     | 2.1. The | differentoperators. |     |     |     |     |     |     |     |     |     |     |     |     |
| ---------- | --- | -------- | ------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
IntelE5-2640v4CPUandNVIDIAV100GPUare90Wand
| discrete | GPUs | exhibit | 1.8x to | 5.7x | higherthroughput |     | than |     |     |     |     |     |     |     |     |
| -------- | ---- | ------- | ------- | ---- | ---------------- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
300W,respectively.Similarto[61],weuseperformanceper
theintegratedarchitectures,duetothemorecomputational
Watttodefineenergyefficiency.Onaverage,FineStreamon
powerofdiscreteGPUs.However,theintegratedarchitecture
theintegratedarchitecturesis1.8xenergy-efficientthanSaber
| demonstrates |     | lower processing |     | latency | compared |     | to the |     |     |     |     |     |     |     |     |
| ------------ | --- | ---------------- | --- | ------- | -------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
onthediscretearchitectures.
discretearchitecturewhenthedatatransmissioncostbetween
7.4 HandlingDynamicWorkload
| the | host memory | and | GPU | memory | in  | the workload | is  |     |     |     |     |     |     |     |     |
| --- | ----------- | --- | --- | ------ | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
significant. For example, the latencies for projection, In this section, we discuss how to handle dynamic work-
selection,aggregation,group-by,and joinare0.6,1.5,1.0, loads. TodemonstratethecapabilityofFineStream tohan-
10.6,and1924.5msonRyzen52400Gplatform,while1.1, dle dynamic workload,we evaluate FineStream on the dy-
1.2,1.2,1.6,and7600.1msonGTX1080Tiplatform; these namic workloads mentioned in Section 7.1. On average,
FineStreamachievesaperformanceof323,727tuplespersec-
| operators | are | distributed | in Figure |     | 14,where | join | (JOIN), |     |     |     |     |     |     |     |     |
| --------- | --- | ----------- | --------- | --- | -------- | ---- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
projection (PROJ),and aggregation (AGG) achieve lower ond,whichoutperformsthestaticmethod(wedenote“static”
latencyontheintegratedarchitecture,whileselection(SELT), forFineStream withoutadapting to dynamicworkload) by
andgroup-by(GRPBY)preferthediscretearchitecture.The 28.6%,asshowninTable4.
x-axis represents the ratio of m /(s +s ) where Table4:Throughputofthequeriesondynamicworkloads.
|         |                                             |     |     | compute | write | read |     |         |     |                        |     |     |                          |     |     |
| ------- | ------------------------------------------- | --- | --- | ------- | ----- | ---- | --- | ------- | --- | ---------------------- | --- | --- | ------------------------ | --- | --- |
| m       |                                             |     |     |         |       |      |     |         |     | A10-7850K(105tuples/s) |     |     | Ryzen52400G(105tuples/s) |     |     |
| compute | denotesthekernelcomputationworkloadsize,and |     |     |         |       |      |     | Dynamic |     |                        |     |     |                          |     |     |
t and s denote the data transmission sizes from the Workload Static FineStream Static FineStream
| write |     | read |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ----- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
hostmemorytotheGPUmemoryandfromtheGPUmemory T1 4.2 5.1 4.4 5.1
|     |     |     |     |     |     |     |     |     | T2  | 0.8 | 1.2 |     | 1.1 | 1.5 |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
to the host memory via PCI-e. For further explanation, to T3 1.9 2.8 2.7 3.7
executeakernelondiscreteGPUs,theexecutiontimet
total
includes1)thetimet ofdatatransmissionfromthehost WeuseT1asanexample,andshowthedetailedthroughput
write
alongwiththenumberofbatchesinFigure16.Inthetimeline
memorytotheGPUmemoryviaPCI-e,2)thetimet
compute
fordataprocessingkernelexecution,and3)thetimet of process,thestaticmethoddecreasesduetotheimproperhard-
read
wareresourcedistribution.AsforFineStream,thehardware
datatransmissionfromtheGPUmemorytothehostmemory.
computingresourcescanbedynamicallyadjustedaccording
| As  | for executing | a kernel | on  | the | integrated | architecture, |     |     |     |     |     |     |     |     |     |
| --- | ------------- | -------- | --- | --- | ---------- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
althoughitst islongerthanthatondiscreteGPUs,its tothedatadistribution,sotheperformancedoesnotdecline
compute
withthechanges.
| t     | andt | canbeavoided.ForthequeriesinTable3,the |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ----- | ---- | -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| write | read |                                        |     |     |     |     |     |     |     |     |     |     |     |     |     |
data movement overhead on discrete architectures ranges  10  12
|                                                 |     |     |     |     |     |     |     | tuphguorht | )s/selput 501(  8 | Static     |     | tuphguorht | )s/selput 501(  10 | Static     |     |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------- | ----------------- | ---------- | --- | ---------- | ------------------ | ---------- | --- |
| from31to62%.                                    |     |     |     |     |     |     |     |            |                   | FineStream |     |            |                    | FineStream |     |
|                                                 |     |     |     |     |     |     |     |            |  6                |            |     |            |  8                 |            |     |
| Price-ThroughputRatioComparison.FineStreamonin- |     |     |     |     |     |     |     |            |                   |            |     |            |  6                 |            |     |
 4
tegrated architectures shows a high price-throughput ratio,  4
|                                                      |     |     |     |     |     |     |     |     |  2   |      |            |     |  2   |           |       |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | ---- | ---------- | --- | ---- | --------- | ----- |
| comparedtoSaberonthediscretearchitectures.Thepriceof |     |     |     |     |     |     |     |     |  0   |      |            |     |  0   |           |       |
|                                                      |     |     |     |     |     |     |     |     | 1000 | 4000 | 7000 10000 |     | 1000 | 4000 7000 | 10000 |
the1080Tidiscretearchitectureisabout7xhigherthanthat
|     |     |     |     |     |     |     |     |     |     | process |     |     |     | process |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | ------- | --- |
oftheA10-7850Kintegratedarchitecture,andthepriceofthe
|                                              |     |     |     |     |     |     |        |     | (a) | A10-7850K. |     |     | (b) | Ryzen52400G. |     |
| -------------------------------------------- | --- | --- | --- | --- | --- | --- | ------ | --- | --- | ---------- | --- | --- | --- | ------------ | --- |
| V100discretearchitectureisabout64xhigherthan |     |     |     |     |     |     | thatof |     |     |            |     |     |     |              |     |
theRyzen52400Gintegratedarchitecture.Figure15shows Figure16:ThroughputofT1ondynamicworkloads.

7.5 DetailedAnalysis
PerformanceModelAccuracy.Instreamprocessing,after
eachbatchisprocessed,weusethemeasuredbatchprocess-
ingspeedtocorrectourmodel.WeusetheexampleofQ1for
illustration,asshowninFigure17.Weusethepercentdevia-
tiontomeasuretheaccuracyofourperformancemodel.The
percentdeviationisdefinedastheabsolutevalueofthereal
throughputminustheestimatedthroughput,dividedbythe
realthroughput.Thesmallerthepercentdeviationis,themore
accuratethepredictedresultis. Thedeviationdecreasesas
thenumberofprocessedbatchesincreases.After20batches
areprocessed,wecanreducethedeviationtolessthan10%.
Pleasenotethatinstreamprocessingscenarios,inputtuples
arecontinuouslycoming,sothetimeforcorrectingperfor-
mancepredictioncanbeignoredinstreamprocessing.For
dynamicworkload,theaccuracyalsodependsontheintensity
ofworkloadchanges.
100
80
60
40
20
0
2 5 10 15 20 50
)%(
noitaived
query(withmultipleoperators)oneachbatchofinputdata
is dispatched on one device. Such a mechanism naturally
minimizesthecommunicationoverheadamongoperatorsin-
side the same query. It is hence suitable in discrete CPU-
GPUarchitectures,wherePCI-eoverheadissignificantand
shall be avoided as much as possible. However,it may re-
sult in suboptimality in integrated architectures formainly
tworeasons. First,itoverlookstheperformancedifference
between different devices for each operator. Second, the
communication overhead between the CPU and the GPU
in integrated architectures is negligible. Targeting at inte-
gratedarchitectures,FineStreamadoptscontinuousoperator
model[53,66],whereeachoperatorofaquerycanbeinde-
pendentlyplacedatadevice. Wefurtherbuildaperformance
modeltoguideoperator-deviceplacementoptimization.Itis
noteworthy thatourfine-grainedoperatorplacementis dif-
ferentfromclassicalplacementstrategiesforgeneralstream
Runtime Overhead A10-7850K processing[18,19,40,51,65]fortheirdifferentdesigngoals.
Ryzen 5 2400G
Analysis.FineStreamin- In particular, most prior works aim at reducing communi-
curs runtime overhead cation overhead among operators,which is not an issue in
in the batch processing FineStream.Instead,FineStreamneedstotakedeviceprefer-
phasefromtwoaspects. enceintoconsiderationduringplacementoptimization,which
First,itdetects whether number of processed batches hasnotbeenconsideredbefore.
theinputstreambelongs Figure17:DeviationofQ1. 9 Conclusion
todynamicworkload,whichcausestimeoverhead.Second, Streamprocessinghasshownsignificantperformancebene-
theschedulingalsotakestime.Inourevaluation,weobserve fitsonGPUs.However,thedatatransmissionviaPCI-ehin-
thatthetimeoverheadaccountsforlessthan2%ofthepro- dersitsfurtherperformanceimprovement.Thispaperrevisits
cessingtime,whichcanbeignoredinstreamprocessing. window-basedstreamprocessingonthepromisingCPU-GPU
integratedarchitectures,andwithCPUsandGPUsintegrated
8 RelatedWork
onthesamechip,thedatatransmissionoverheadiseliminated.
Parallelstreamprocessing[4,10,12,21,28,29,34,43,46,63], Furthermore,suchintegrationopensupnewopportunitiesfor
query processing [9,14,16,20,22,56],and heterogeneous fine-grainedcooperationbetweendifferentdevices,andwede-
systems[11,17,24,26,32,35–38,45,48,50]arehotresearch velopaframeworkcalledFineStreamforfine-grainedstream
topicsinrecentyears.Differentfromtheseworks,FineStream processingontheintegratedarchitecture.Thisstudyshows
targets sliding window-based stream processing,which fo- thatintegratedCPU-GPUarchitecturescanbemoredesirable
cusesonwindowhandlingwithSQLanddynamicadjustment. alternativearchitecturesforlow-latencyandhigh-throughput
GPUshavemassivethreadsandhighbandwidth,andhave datastrreamprocessing,incomparisonwithdiscretearchi-
emergedtobeoneofthemostpromisingheterogeneousac- tectures.ExperimentsshowthatFineStreamcanimprovethe
celerators to speedup stream processing. Verneret al. [54] performanceby52%overthestate-of-the-artmethodonthe
presentedastreamprocessingalgorithmconsideringvarious integratedarchitecture.Comparedtothestreamprocessing
latency andthroughputrequirements on GPUs. Alghabi et engineonthediscretearchitecture,FineStreamontheinte-
al. [5] developeda frameworkforstatefulstream data pro- gratedarchitectureachieves10.4xprice-throughputratio,1.8x
cessingonmultipleGPUs.DeMatteisetal.[25]developed energyefficiency,andcanenjoylowerlatencybenefits.
GassersystemforoffloadingoperatorsonGPUs.Pinnecke Acknowledgments
etal.[44]studiedhowtoefficientlyprocesslargewindows We sincerely thank our shepherd Sergey Blagodurov and
onGPUs.Chenetal.[23]extendedthepopularstreampro- the anonymous reviewers for their insightful comments
cessingsystem,Storm[1],toGPUplatforms. Augonnetet and suggestions. This work is supported by the National
al.[8]exploreddata-awaretaskschedulingformulti-devices, Key Research and Development Program of China (No.
whichcanbeintegratedintothiswork. FineStreamdiffers 2018YFB1004401),NationalNaturalScienceFoundationof
fromthosepreviousworksintwoaspects:firstlyonintegrated China(No.61732014,61802412,61972402,61972403),and
architectures,andsecondlyforSQLstreamingprocessing. BeijingNaturalScienceFoundation(No.L192027),andis
TheclosestworktoFineStreamisSaber[34],whichaims alsosupportedbyaMoEAcRFTier1grant(T1251RES1824)
toutilizediscreteCPU-GPUarchitectures.Saber[34]adopts andTier2grant(MOE2017-T2-1-122)inSingapore.Xiaoy-
abulk-synchronousparallelmodel[53,66],wherethewhole ongDuisthecorrespondingauthorofthispaper.

| References       |                           |     |     |     | [15] DanBouvierandBenSander.  |     |     |     | ApplyingAMD’sKaveri |                |     |
| ---------------- | ------------------------- | --- | --- | --- | ----------------------------- | --- | --- | --- | ------------------- | -------------- | --- |
|                  |                           |     |     |     | APUforheterogeneouscomputing. |     |     |     |                     | InHotChipsSym- |     |
| [1] ApacheStorm. | http://storm.apache.org/. |     |     |     |                               |     |     |     |                     |                |     |
posium,2014.
| [2] Moregoogleclusterdata. |     | https://ai.googleblog. |     |     |                                   |     |     |     |                 |     |     |
| -------------------------- | --- | ---------------------- | --- | --- | --------------------------------- | --- | --- | --- | --------------- | --- | --- |
|                            |     |                        |     |     | [16] SebastianBreßandGunterSaake. |     |     |     | WhyItisTimefora |     |     |
com/2011/11/more-google-cluster-data.html. HyPE:AHybridQueryProcessingEngineforEfficient
|     |     |     |     |     | GPUCoprocessinginDBMS. |     |     |     | PVLDB,2013. |     |     |
| --- | --- | --- | --- | --- | ---------------------- | --- | --- | --- | ----------- | --- | --- |
[3] TheComputeArchitectureofIntelProcessorGraphics
| Gen7.5. https://software.intel.com/. |     |     |     |     |     |     |     |     |     |     |     |
| ------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
[17] QingqingCao,NiranjanBalasubramanian,andAruna
|     |     |     |     |     | Balasubramanian. |     | Mobirnn:Efficientrecurrentneural |     |     |     |     |
| --- | --- | --- | --- | --- | ---------------- | --- | -------------------------------- | --- | --- | --- | --- |
[4] NitinAgrawalandAshishVulimiri. Low-LatencyAn- networkexecutiononmobileGPU. InProceedingsof
alyticsonColossalDataStreamswithSummaryStore.
the1stInternationalWorkshoponDeepLearningfor
InSOSP,2017.
MobileSystemsandApplications,2017.
[5] FarhooshAlghabi,UlrichSchipper,andAndreasKolb.
[18] ParisCarbone,AsteriosKatsifodimos,StephanEwen,
Ascalablesoftwareframeworkforstatefulstreamdata
VolkerMarkl,SeifHaridi,andKostasTzoumas.Apache
| processingonmultiplegpusandapplications. |     |     |     | InGPU |        |                                          |     |     |     |     |     |
| ---------------------------------------- | --- | --- | --- | ----- | ------ | ---------------------------------------- | --- | --- | --- | --- | --- |
|                                          |     |     |     |       | flink: | Streamandbatchprocessinginasingleengine. |     |     |     |     |     |
ComputingandApplications.2015.
BulletinoftheIEEEComputerSocietyTechnicalCom-
mitteeonDataEngineering,2015.
| [6] ArvindArasu,ShivnathBabu,andJenniferWidom. |     |     |     | The |     |     |     |     |     |     |     |
| ---------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
CQLcontinuousquerylanguage:semanticfoundations
[19] RaulCastroFernandez,MatteoMigliavacca,Evangelia
TheVLDBJournal,2006.
andqueryexecution.
|     |     |     |     |     | Kalyvianaki,andPeterPietzuch. |     |     |     | Integratingscaleout |     |     |
| --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | ------------------- | --- | --- |
andfaulttoleranceinstreamprocessingusingoperator
[7] ArvindArasu,MitchCherniack,EduardoGalvez,David
|               |     |                |          |         | statemanagement. |     | InSIGMOD,2013. |     |     |     |     |
| ------------- | --- | -------------- | -------- | ------- | ---------------- | --- | -------------- | --- | --- | --- | --- |
| Maier, Anurag | S   | Maskey, Esther | Ryvkina, | Michael |                  |     |                |     |     |     |     |
Stonebraker,andRichardTibbetts.Linearroad:astream
|                          |     |               |     |     | [20] Badrish | Chandramouli, |     | Raul | Castro |     | Fernandez, |
| ------------------------ | --- | ------------- | --- | --- | ------------ | ------------- | --- | ---- | ------ | --- | ---------- |
| datamanagementbenchmark. |     | InPVLDB,2004. |     |     |              |               |     |      |        |     |            |
JonathanGoldstein,AhmedEldawy,andAbdulQuamar.
Quill:efficient,transferable,andrichanalyticsatscale.
[8] CédricAugonnet,JérômeClet-Ortega,SamuelThibault,
| andRaymondNamyst.                |     | Data-awaretaskschedulingon |                 |     | PVLDB,2016.                        |               |     |          |     |             |       |
| -------------------------------- | --- | -------------------------- | --------------- | --- | ---------------------------------- | ------------- | --- | -------- | --- | ----------- | ----- |
| multi-acceleratorbasedplatforms. |     |                            | InICPADS,2010.  |     |                                    |               |     |          |     |             |       |
|                                  |     |                            |                 |     | [21] Badrish                       | Chandramouli, |     | Jonathan |     | Goldstein,  | Roger |
|                                  |     |                            |                 |     | Barga,MirekRiedewald,andIvoSantos. |               |     |          |     | Accuratela- |       |
| [9] PeterBakkumandKevinSkadron.  |     |                            | AcceleratingSQL |     |                                    |               |     |          |     |             |       |
Database Operations on a GPU with CUDA. In Pro- tencyestimationinadistributedeventprocessingsystem.
InICDE,2011.
ceedingsofthe3rdWorkshoponGeneral-PurposeCom-
putationonGraphicsProcessingUnits,2010.
[22] BadrishChandramouli,JonathanGoldstein,MikeBar-
[10] RanBen-Basat,GilEinziger,RoyFriedman,andYaron nett, Robert DeLine, Danyel Fisher, John C Platt,
|                                                  |     |     |     |     | JamesFTerwilliger,andJohnWernsing. |             |     |       |           | Trill:Ahigh- |             |
| ------------------------------------------------ | --- | --- | --- | --- | ---------------------------------- | ----------- | --- | ----- | --------- | ------------ | ----------- |
| Kassner. Heavyhittersinstreamsandslidingwindows. |     |     |     |     |                                    |             |     |       |           |              |             |
|                                                  |     |     |     |     | performance                        | incremental |     | query | processor |              | for diverse |
InINFOCOM,2016.
|                         |                 |                 |           |           | analytics.         | PVLDB,2014. |         |          |                  |       |        |
| ----------------------- | --------------- | --------------- | --------- | --------- | ------------------ | ----------- | ------- | -------- | ---------------- | ----- | ------ |
| [11] Shai Bergman,Tanya |                 | Brokhman,Tzachi |           | Cohen,and |                    |             |         |          |                  |       |        |
|                         |                 |                 |           |           | [23] Zhenhua       | Chen,       | Jielong | Xu,      | Jian Tang,       | Kevin | Kwiat, |
| Mark Silberstein.       |                 | SPIN: seamless  | operating | system    |                    |             |         |          |                  |       |        |
|                         |                 |                 |           |           | andCharlesKamhoua. |             |         | G-Storm: | GPU-enabledhigh- |       |        |
| integration             | of peer-to-peer | DMA             | between   | SSDs and  |                    |             |         |          |                  |       |        |
GPUs. InUSENIXATC,2017. throughputonlinedataprocessinginStorm.InBigData,
2015.
| [12] Ketan Bhardwaj, |     | Pragya Agrawal, | Ada | Gavrilowska, |     |     |     |     |     |     |     |
| -------------------- | --- | --------------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
[24] PeriklisChrysogelos,ManosKarpathiotakis,RajaAp-
| KarstenSchwan,andAdamAllred. |     |     | Appflux:Taming |     |     |     |     |     |     |     |     |
| ---------------------------- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- |
appdeliveryviastreaming. Proc.oftheUsenixTRIOS, puswamy,andAnastasiaAilamaki. HetExchange:En-
capsulatingheterogeneousCPU-GPUparallelisminJIT
2015.
|                                                 |     |     |     |        | compiledengines. |             | Proceedings |          | ofthe     | VLDB | Endow-  |
| ----------------------------------------------- | --- | --- | --- | ------ | ---------------- | ----------- | ----------- | -------- | --------- | ---- | ------- |
| [13] D.Boggs,G.Brown,N.Tuck,andK.S.Venkatraman. |     |     |     |        | ment,2019.       |             |             |          |           |      |         |
| Denver:Nvidia’sFirst64-bitARMProcessor.         |     |     |     | Micro, |                  |             |             |          |           |      |         |
|                                                 |     |     |     |        | [25] Tiziano     | De Matteis, |             | Gabriele | Mencagli, |      | Daniele |
2015.
|     |     |     |     |     | De Sensi, | Massimo |     | Torquati, | and | Marco | Danelutto. |
| --- | --- | --- | --- | --- | --------- | ------- | --- | --------- | --- | ----- | ---------- |
[14] PeterA.Boncz,MartinL.Kersten,andStefanManegold. GASSER:AnAuto-TunableSystemforGeneralSliding-
Breaking the Memory Wall in MonetDB. Commun. WindowStreamingOperatorsonGPUs. IEEEAccess,
| ACM,2008. |     |     |     |     | 2019. |     |     |     |     |     |     |
| --------- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- |

[26] ThaleiaDimitraDoudali,SergeyBlagodurov,Abhinav formixingdie-stackedandoff-packagememories. In
| Vishnu,Sudhanva |     | Gurumurthi,and | Ada | Gavrilovska. |     | HPCA,2015. |     |     |     |     |
| --------------- | --- | -------------- | --- | ------------ | --- | ---------- | --- | --- | --- | --- |
Kleio:AHybridMemoryPageSchedulerwithMachine
[39] IsmaelSolisMoreno,PeterGarraghan,PaulTownend,
| Intelligence. | InHPDC,2019. |     |     |     |     |           |                                       |     |     |     |
| ------------- | ------------ | --- | --- | --- | --- | --------- | ------------------------------------- | --- | --- | --- |
|               |              |     |     |     |     | andJieXu. | Analysis,modelingandsimulationofwork- |     |     |     |
[27] J. Doweck, W. Kao, A. K. Lu, J. Mandelblat, A. Ra- loadpatternsinalarge-scaleutilitycloud. IEEETrans-
hatekar,L.Rappoport,E.Rotem,A.Yasin,andA.Yoaz. actionsonCloudComputing,2014.
Inside6th-GenerationIntelCore:NewMicroarchitec-
[40] LeonardoNeumeyer,BruceRobbins,AnishNair,and
| tureCode-NamedSkylake. |     |     | Micro,2017. |     |     |              |     |                                    |     |     |
| ---------------------- | --- | --- | ----------- | --- | --- | ------------ | --- | ---------------------------------- | --- | --- |
|                        |     |     |             |     |     | AnandKesari. |     | S4:Distributedstreamcomputingplat- |     |     |
[28] PradeepFernando,AdaGavrilovska,SudarsunKannan, form. InICDMWorkshops,2010.
| and Greg | Eisenhauer. | NVStream: | accelerating |     | HPC |                               |     |     |                     |     |
| -------- | ----------- | --------- | ------------ | --- | --- | ----------------------------- | --- | --- | ------------------- | --- |
|          |             |           |              |     |     | [41] DongNguyenandJongeunLee. |     |     | Communication-aware |     |
workflowswithNVRAM-basedtransportforstreaming
mappingofstreamgraphsformulti-GPUplatforms. In
| objects. | InHPDC,2018. |     |     |     |     |     |     |     |     |     |
| -------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
CGO,2016.
[29] XinweiFu,TalhaGhaffar,JamesCDavis,andDongy- [42] JohnNickollsandWilliamJDally.TheGPUcomputing
| oonLee. | Edgewise:abetterstreamprocessingengine |     |     |     |     |     |     |     |     |     |
| ------- | -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
era. Micro,2010.
| fortheedge. | InUSENIXATC,2019. |     |     |     |     |            |           |          |         |                 |
| ----------- | ----------------- | --- | --- | --- | --- | ---------- | --------- | -------- | ------- | --------------- |
|             |                   |     |     |     |     | [43] Peter | Pietzuch, | Jonathan | Ledlie, | Jeffrey Shneid- |
[30] Bug˘raGedik,ScottSchneider,MartinHirzel,andKun-
|     |     |     |     |     |     | man, | Mema | Roussopoulos, | Matt | Welsh, and Margo |
| --- | --- | --- | --- | --- | --- | ---- | ---- | ------------- | ---- | ---------------- |
Lung Wu. Elastic scaling fordata stream processing. Seltzer. Network-aware operator placement for
TPDS,2013.
|                |              |     |               |     |        | stream-processingsystems. |     |     | InICDE,2006. |     |
| -------------- | ------------ | --- | ------------- | --- | ------ | ------------------------- | --- | --- | ------------ | --- |
| [31] Younghwan | Go, Muhammad |     | Asim Jamshed, |     | Young- |                           |     |     |              |     |
[44] MarcusPinnecke,DavidBroneske,andGunterSaake.
GyounMoon,ChanghoHwang,andKyoungSooPark. TowardGPUAcceleratedDataStreamProcessing. In
| APUNet:RevitalizingGPUasPacketProcessingAccel- |     |     |     |     |     | GvD,2015. |     |     |     |     |
| ---------------------------------------------- | --- | --- | --- | --- | --- | --------- | --- | --- | --- | --- |
| erator. InNSDI,2017.                           |     |     |     |     |     |           |     |     |     |     |
[45] HolgerPirk,OscarMoll,MateiZaharia,andSamMad-
[32] WentianGuo,YuchenLi,MoSha,BingshengHe,Xi-
|     |     |     |     |     |     | den. | Voodoo-aVectorAlgebraforPortableDatabase |     |     |     |
| --- | --- | --- | --- | --- | --- | ---- | ---------------------------------------- | --- | --- | --- |
aokuiXiao,andKian-LeeTan. GPU-AcceleratedSub- PerformanceonModernHardware. PVLDB,2016.
| graphEnumerationonPartitionedGraphs. |     |     |     | InSIGMOD, |     |             |          |        |             |            |
| ------------------------------------ | --- | --- | --- | --------- | --- | ----------- | -------- | ------ | ----------- | ---------- |
|                                      |     |     |     |           |     | [46] Arosha | Rodrigo, | Miyuru | Dayarathna, | and Sanath |
2020.
|     |     |     |     |     |     | Jayasena. | Latency-Aware |     | Secure | Elastic Stream Pro- |
| --- | --- | --- | --- | --- | --- | --------- | ------------- | --- | ------ | ------------------- |
[33] ChandimaHewaNadungodage,YuniXia,andJohnJae- cessingwithHomomorphicEncryption. DataScience
hwan Lee. GStreamMiner: a GPU-accelerated data andEngineering,2019.
| streamminingframework. |     |     | InCIKM,2016. |     |     |              |            |      |             |                |
| ---------------------- | --- | --- | ------------ | --- | --- | ------------ | ---------- | ---- | ----------- | -------------- |
|                        |     |     |              |     |     | [47] Michael | J Schulte, | Mike | Ignatowski, | Gabriel H Loh, |
BradfordMBeckmann,WilliamCBrantley,Sudhanva
| [34] AlexandrosKoliousisandetal. |     |     | Saber:Window-based |     |     |     |     |     |     |     |
| -------------------------------- | --- | --- | ------------------ | --- | --- | --- | --- | --- | --- | --- |
hybrid stream processing for heterogeneous architec- Gurumurthi,NuwanJayasena,IndraniPaul,StevenK
tures. InSIGMOD,2016. Reinhardt,andGregoryRodgers. Achievingexascale
capabilitiesthroughheterogeneouscomputing. Micro,
[35] XinyuLi,LeiLiu,ShengjieYang,LuPeng,andJiefan
2015.
| Qiu. ThinkingaboutANewMechanismforHugePage |     |     |     |     |     |     |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Management. InProceedingsofthe10thACMSIGOPS [48] MarkSilberstein,SangmanKim,SeongguHuh,Xinya
Asia-PacificWorkshoponSystems,2019. Zhang, Yige Hu, Amir Wated, and Emmett Witchel.
|                                             |     |     |     |     |         | GPUnet:    | NetworkingabstractionsforGPUprograms. |     |     |     |
| ------------------------------------------- | --- | --- | --- | --- | ------- | ---------- | ------------------------------------- | --- | --- | --- |
| [36] LeiLiu,ShengjieYang,LuPeng,andXinyuLi. |     |     |     |     | Hierar- | TOCS,2016. |                                       |     |     |     |
chicalHybridMemoryManagementinOSforTiered
MemorySystems. TPDS,2019. [49] John E Stone, David Gohara, and Guochun Shi.
OpenCL:Aparallelprogrammingstandardforhetero-
[37] AlexanderMMerritt,VishakhaGupta,AbhishekVerma,
|     |     |     |     |     |     | geneouscomputingsystems. |     |     | Computinginscience& |     |
| --- | --- | --- | --- | --- | --- | ------------------------ | --- | --- | ------------------- | --- |
Ada Gavrilovska, and Karsten Schwan. Shadowfax: engineering,2010.
| scaling in  | heterogeneous |     | clustersystems | via | GPGPU |                           |     |        |                         |               |
| ----------- | ------------- | --- | -------------- | --- | ----- | ------------------------- | --- | ------ | ----------------------- | ------------- |
|             |               |     |                |     |       | [50] ZhiTangandYoujipWon. |     |        | Multithreadcontentbased |               |
| assemblies. | InVTDC,2011.  |     |                |     |       |                           |     |        |                         |               |
|             |               |     |                |     |       | file chunking             |     | system | in CPU-GPGPU            | heterogeneous |
[38] MiteshRMeswani,SergeyBlagodurov,DavidRoberts, architecture. In2011FirstInternationalConferenceon
JohnSlice,MikeIgnatowski,andGabrielHLoh. Het- Data Compression,Communications and Processing,
| erogeneousmemoryarchitectures:AHW/SWapproach |     |     |     |     |     | 2011. |     |     |     |     |
| -------------------------------------------- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- |

[51] AnkitToshniwal,SiddarthTaneja,AmitShukla,Karthik Aware Fine-Grained Workload Partitioning on Inte-
Ramasamy,JigneshMPatel,SanjeevKulkarni,Jason gratedArchitectures. TKDE,2019.
Jackson,KrishnaGade,MaosongFu,JakeDonham,etal.
Storm@twitter. InSIGMOD,2014. [60] FengZhang,JidongZhai,BingshengHe,ShuhaoZhang,
|                                          |     |                      |          | andWenguangChen.                      | Understandingco-runningbehav- |     |            |
| ---------------------------------------- | --- | -------------------- | -------- | ------------------------------------- | ----------------------------- | --- | ---------- |
| [52] SidTouatiandBenoitDupontDeDinechin. |     |                      | Advanced |                                       |                               |     |            |
|                                          |     |                      |          | iorsonintegratedcpu/gpuarchitectures. |                               |     | TPDS,2017. |
| BackendCodeOptimization.                 |     | JohnWiley&Sons,2014. |          |                                       |                               |     |            |
[53] Shivaram Venkataraman, Aurojit Panda, Kay Ouster- [61] Kai Zhang, Jiayu Hu, Bingsheng He, and Bei Hua.
|     |     |     |     | DIDO: | Dynamic pipelines | for in-memory | key-value |
| --- | --- | --- | --- | ----- | ----------------- | ------------- | --------- |
hout,MichaelArmbrust,AliGhodsi,MichaelJFranklin,
BenjaminRecht,andIonStoica.Drizzle:Fastandadapt- stores on coupledCPU-GPU architectures. In ICDE,
|     |     | InSOSP,2017. |     | 2017. |     |     |     |
| --- | --- | ------------ | --- | ----- | --- | --- | --- |
ablestreamprocessingatscale.
[54] UriVerner,AssafSchuster,andMarkSilberstein. Pro- [62] KaiZhang,JiayuHu,andBeiHua. Aholisticapproach
cessingdatastreamswithhardreal-timeconstraintson tobuildreal-timestreamprocessingsystemwithGPU.
| heterogeneoussystems. | InICS,2011. |     |     |     |     |     |     |
| --------------------- | ----------- | --- | --- | --- | --- | --- | --- |
JPDC,2015.
|                    |                 |               |             | [63] Shuhao                    | Zhang, Bingsheng | He, Daniel | Dahlmeier,    |
| ------------------ | --------------- | ------------- | ----------- | ------------------------------ | ---------------- | ---------- | ------------- |
| [55] Thiruvengadam | Vijayaraghavan, | Yasuko        | Eckert,     |                                |                  |            |               |
|                    |                 |               |             | AmelieChiZhou,andThomasHeinze. |                  |            | Revisitingthe |
| Gabriel H          | Loh, Michael J  | Schulte, Mike | Ignatowski, |                                |                  |            |               |
designofdatastreamprocessingsystemsonmulti-core
BradfordMBeckmann,WilliamCBrantley,JosephL
|                                           |     |     |     | processors. | InICDE,2017. |     |     |
| ----------------------------------------- | --- | --- | --- | ----------- | ------------ | --- | --- |
| Greathouse,WeiHuang,ArunKarunanithi,etal. |     |     | De- |             |              |     |     |
signandAnalysisofanAPUforExascaleComputing.
[64] ShuhaoZhang,JiongHe,BingshengHe,andMianLu.
InHPCA,2017.
OmniDB:Towardsportableandefficientqueryprocess-
[56] ThomasFWenisch,MichaelFerdman,AnastasiaAila- ingonparallelCPU/GPUarchitectures. PVLDB,2013.
| maki,BabakFalsafi,andAndreasMoshovos. |     |     | Practical |     |     |     |     |
| ------------------------------------- | --- | --- | --------- | --- | --- | --- | --- |
off-chipmeta-datafortemporalmemorystreaming. In [65] ShuhaoZhang,JiongHe,AmelieChiZhou,andBing-
| HPCA,2009.          |           |              |             | shengHe.                  | Briskstream:ScalingDataStreamProcessing |                |     |
| ------------------- | --------- | ------------ | ----------- | ------------------------- | --------------------------------------- | -------------- | --- |
|                     |           |              |             | onMulticoreArchitectures. |                                         | InSIGMOD,2019. |     |
| [57] Matei Zaharia, | Tathagata | Das, Haoyuan | Li, Timothy |                           |                                         |                |     |
Hunter, Scott Shenker, and Ion Stoica. Discretized [66] ShuhaoZhang,FengZhang,YingjunWu,BingshengHe,
streams:Fault-tolerantstreamingcomputationatscale.
|              |     |     |     | andPaulJohns. | Hardware-consciousstreamprocessing: |     |     |
| ------------ | --- | --- | --- | ------------- | ----------------------------------- | --- | --- |
| InSOSP,2013. |     |     |     | Asurvey.      | SIGMODRec.,2020.                    |     |     |
[58] FengZhang,BoWu,JidongZhai,BingshengHe,and
|          |                |                    |       | [67] Yongpeng | Zhang and Frank | Mueller. | GStream: A |
| -------- | -------------- | ------------------ | ----- | ------------- | --------------- | -------- | ---------- |
| Wenguang | Chen. FinePar: | Irregularity-aware | fine- |               |                 |          |            |
general-purposedatastreamingframeworkonGPUclus-
| grained workload   | partitioning | on integrated | architec- |       |              |     |     |
| ------------------ | ------------ | ------------- | --------- | ----- | ------------ | --- | --- |
|                    |              |               |           | ters. | InICPP,2011. |     |     |
| tures. InCGO,2017. |              |               |           |       |              |     |     |
[59] FengZhang,BoWu,JidongZhai,BingshengHe,Wen- [68] HolgerZiekowandZbigniewJerzak. TheDEBS2014
guangChen,andXiaoyongDu. AutomaticIrregularity- grandchallenge. InDEBS,2014.