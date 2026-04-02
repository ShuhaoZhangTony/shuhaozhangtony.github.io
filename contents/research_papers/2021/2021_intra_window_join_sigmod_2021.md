|     |              | Parallelizing |     |     |             | Intra-Window |     | Join          | on  | Multicores:    |                  |             |     |     |
| --- | ------------ | ------------- | --- | --- | ----------- | ------------ | --- | ------------- | --- | -------------- | ---------------- | ----------- | --- | --- |
|     |              |               |     |     | An          | Experimental |     | Study         |     |                |                  |             |     |     |
|     | ShuhaoZhang  |               |     |     | YancanMao   |              |     | JiongHe       |     |                | PhilippM.Grulich |             |     |     |
|     |              | TUBerlin      |     |     |             | NUS          |     | ByteDance     |     |                |                  | TUBerlin    |     |     |
|     | SteffenZeuch |               |     |     | BingshengHe |              |     | RichardT.B.Ma |     |                |                  | VolkerMarkl |     |     |
|     |              | DFKI          |     |     |             | NUS          |     |               | NUS | TTUBerlin,DFKI |                  |             |     |     |
ABSTRACT andfull-historyjoin[29],hasreceivedlessattention,despitethatit
hasmanypracticalapplicationswhereusersareonlyinterestedin
Theintra-windowjoin(IaWJ),i.e.,joiningtwoinputstreamsover
joiningoneparticularsubsetofinputstreams[1,4,14,16,29].For
asinglewindow,isacoreoperationinmodernstreamprocessing
exampNle,atPinterest[35],developersappliedtheIaWJoperation
applications.Thispaperpresentsthefirstcomprehensivestudy
on parallelizing the IaWJ on modern multicore architectures. ofFlink(calledIntervalJoin[1])tojointheactivationrecordper
userforasingletimewindowofthreedays[24].
| In particular, |     | we classify |     | IaWJ algorithms |     | into lazy and eager |           |                  |           |          |              |          |                |             |
| -------------- | --- | ----------- | --- | --------------- | --- | ------------------- | --------- | ---------------- | --------- | -------- | ------------ | -------- | -------------- | ----------- |
|                |     |             |     |                 |     |                     |           | Fully exploiting |           | current  | and emerging |          | hardware       | trends is a |
| execution      |     | approaches. | For | each approach,  |     | there are further   |           |                  |           |          |              |          |                |             |
|                |     |             |     |                 |     |                     | notorious |                  | challenge | [30, 36, | 41, 44,      | 46, 58]. | In particular, | there       |
designaspectstoconsider,includingdifferentjoinmethodsand
(C1∼C3)
partitioningschemes,leadingtoalargedesignspace.Ourresults aIre three key challenges to answer the question of
showthatnoneofthealgorithmsalwaysperformsthebest,andthe how to efficiently parallelize IaWJ on multicore architectures.
choiceofthemostperformantalgorithmdependson:(i)worRkload C1:asignificantnumberofjoinalgorithmshavebeenproposed
|                  |     |      |             |               |     |                    | and       | can be | applied.    | We   | classify   | them into | two           | fundamental |
| ---------------- | --- | ---- | ----------- | ------------- | --- | ------------------ | --------- | ------ | ----------- | ---- | ---------- | --------- | ------------- | ----------- |
| characteristics, |     | (ii) | application | requirements, |     | and (iii) hardware |           |        |             |      |            |           |               |             |
|                  |     |      |             |               |     |                    | execution |        | approaches: | lazy | and eager. | The       | lazy approach | first       |
architectures.Basedontheevaluationresults,weproposeadecision
treethatcanguidetheselectionofanappropriatealgorithm. buffersallinputtuplesoftheconcernedwindowfrombothinput
streams,andthenjoinsacompletesetoftuples.Incontrast,the
| ACMReferenceFormat: |     |     |     |     |     | P   |       |          |              |     |       |         |          |             |
| ------------------- | --- | --- | --- | --- | --- | --- | ----- | -------- | ------------ | --- | ----- | ------- | -------- | ----------- |
|                     |     |     |     |     |     |     | eager | approach | aggressively |     | joins | subsets | of input | tuples upon |
ShuhaoZhang,YancanMao,JiongHe,PhilippM.Grulich,SteffenZeuch,
thearrival.Furthermore,foreachexecutionapproach,thereare
BingshengHe,RichardT.B.Ma,andVolkerMarkl.2021.Parallelizing
|     |     |     |     |     |     |     | two | further | design | aspects | including | join | methods | (i.e., hash- |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ------ | ------- | --------- | ---- | ------- | ------------ |
Intra-WindowJoinonMulticores:AnExperimentalStudy.InProceedings
ofSIGMOD’21:ACMSIGMODInternatioEnalConferenceonManagementof or sort-based) and various partitioning schemes (e.g., with or
Data(SIGMOD’21).ACM,NewYork,NY,USA,13pages.https://doi.org/10. without physical replication), leading to a large design space.
1145/nnnnnnn.nnnnnnn C2:inputworkloadscanvarysignificantlywithdifferent(i)key-
|     |     |     |     |     |     |     | skewness, |     | (ii) timestamp-skewness, |     |     | (iii) tuple | arrival | rate, (iv) |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ------------------------ | --- | --- | ----------- | ------- | ---------- |
windowlength,and(v)numberofduplicatesperkey.Meanwhile,
| 1           | INTRODUCTION |          | R             |            |          |                    |              |     |       |                  |     |                 |         |             |
| ----------- | ------------ | -------- | ------------- | ---------- | -------- | ------------------ | ------------ | --- | ----- | ---------------- | --- | --------------- | ------- | ----------- |
|             |              |          |               |            |          |                    | applications |     | may   | target different |     | performance     | metrics | such as     |
| The         | join of      | multiple | data          | streams is | a common | operation that     |              |     |       |                  |     |                 |         |             |
|             |              |          |               |            |          |                    | throughput   |     | [55], | latency [23],    | and | progressiveness |         | [13]. These |
| is relevant |              | to many  | applications, | such       | as       | online data mining |              |     |       |                  |     |                 |         |             |
metricsmeetdivergentrequirementsandcansometimesconflict
andinteractivequeryprocessing[22].Intheseapplications,itis
witheachother.C3:modernhardwarefeaturessuchasadvanced
importanttoquicklygeneratepreliminaryresultsforusers[4]or
P vectorextensions(AVX),multicoreparallelism,andacomplexcache
downstreamapplications[14].Tohandleinfinitestreams,thejoin
memorysubsystemfurtherenlargethedesignspace.Duetothelack
istypicallyperformedoverbounded,discretesubsetsofstreams
ofathoroughstudy,itisdifficultforresearchersandpractitioners
(i.e.,windows).Suchanoperationiscalledawindowjoinandhas
todeterminetheoptimalapproachunderdifferentconditions.For
beenadoptedinmostmodernstreamprocessingengines[9,48].
example,alazyapproachmaybebeneficialtoapplicationsthathave
Alargebodyofpriorworksfocusonjoiningunbounded(i.e.,
avaryinginputcharacteristicsandperformancerequirements,as
infinite)overlapping(i.e.,sliding)windows,whichwedenotedas
thesystemcanapplyspecificdata-dependentoptimizationsbefore
inter-windowjoin.Fortheseworks,thekeyconcernistoenable
processing.However,alazyapproachmayintroduceadditional
| incremental |     | computation |     | through continuous |     | window updates |     |     |     |     |     |     |     |     |
| ----------- | --- | ----------- | --- | ------------------ | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- |
processinglatency,especiallyiftheinputtuplesarriveslowlyand
| while | achieving | efficient |     | workload | distribution | [34, 42, 46]. In |     |     |     |     |     |     |     |     |
| ----- | --------- | --------- | --- | -------- | ------------ | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- |
thewindowlengthislarge,ortheusersonlyrequireearlypartial
contrast,theintra-windowjoin(IaWJ),alsocalledonlinejoin[14]
joinresultsthatdependonasubsetofinputtuples.
|     |     |     |     |     |     |     |     | To the | best of | our knowledge, |     | this work | presents | the first |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ------- | -------------- | --- | --------- | -------- | --------- |
Permissiontomakedigitalorhardcopiesofallorpartofthisworkforpersonalor
classroomuseisgrantedwithoutfeeprovidedthatcopiesarenotmadeordistributed comprehensiveexperimentalstudyontheeffectivenessofIaWJ
forprofitorcommercialadvantageandthatcopiesbearthisnoticeandthefullcitation
algorithmsonmodernmulticores.Tothisend,weextendanexisting
onthefirstpage.CopyrightsforcomponentsofthisworkownedbyothersthanACM
benchmarkframework[5]byreimplementingeightalgorithmsand
mustbehonored.Abstractingwithcreditispermitted.Tocopyotherwise,orrepublish,
topostonserversortoredistributetolists,requirespriorspecificpermissionand/ora integratingthemintothesamecodebase,eliminatingthedifferences
fee.Requestpermissionsfrompermissions@acm.org. causedbyprogramminglanguagesandcompilerstoaddressC1.
SIGMOD’21,June20–25,2021,Shaanxi,China
©2021AssociationforComputingMachinery. Allsourcecodeanddataofourbenchmarkaswellasguidelines
ACMISBN978-x-xxxx-xxxx-x/YY/MM...$15.00 on how to reproduce our work are publicly available [43]. We
https://doi.org/10.1145/nnnnnnn.nnnnnnn

SIGMOD’21,June20–25,2021,Shaanxi,China ShuhaoZhang,YancanMao,JiongHe,PhilippM.Grulich,SteffenZeuch,BingshengHe,RichardT.B.Ma,andVolkerMarkl
Table1:Notationsusedinthispaper Table2:Summaryofstudiedjoinalgorithms
Notations Description Name Approach JoinMethod PartitioningSchemes
x={t,k,v} Aninputtuplexwiththreeattributes NPJ[8] Lazy Hash Nophysicalpartitioning
R,S Twoinputstreamstojoin PRJ[26] Lazy Hash Cachesize-awarereplication
MWay[11] Lazy Sort Equisizedrangepartitioning
skewkey Keyskewness(uniqueorzipf)
MPass[5] Lazy Sort Equisizedrangepartitioning
skewts Timestampskewness(uniformorzipf) SHJJM[52]+[14] Eager Hash Content-insensitivestreamdistribution
dupe Averagenumberofduplicatesperkey SHJJB[52]+[29] Eager Hash Content-sensitivestreamdistribution
v Inputarrivalrate(tuples/msec) PMJJM[13]+[14] Eager Sort Content-insensitivestreamdistribution
w Windowlength(msec) PMJJB[13]+[29] Eager Sort Content-sensitivestreamdistribution
proposefourrepresentativereal-worldworkloadsandonecarefully widelyusedinconventiTonaldatabasescanbeappliedtoimplement
designedsyntheticworkload,aswellasmechanismstoautomate thelazyjoinapproach.Essentially,theycansimplywaitforaperiod
theevaluationofthreeperformancemetricstoaddressC2.ForC3, oftimeequaltothewindowlengthandthenstartprocessing(e.g.,
weconductourexperimentsonarecentIntelXeonGoldCPUunder constructingthehashtable);Second,manyspecificallydesigned
differentconfigurations,includingalteringAVXinstructionsanda streamjoinalgorithms[13,16,28,29,32,34,45,50]canbeappliedto
varyingnumberofCPUcores.Duetothesignificantarchitectural
implemNenttheeagerjoinapproach.Theyproducepartialmatches
difference,weleavetheconsiderationofNUMA[41,47,57]and earlyandcontinuouslyassoonasanyinputtuplesfromeither
otherhardwareplatformssuchasGPUs[18,27]andFPGAs[10,17] inputstreamarrive.Inthiswork,westudiedeightrepresentative
forfuturework. joinalgorithmscoveringalargedesignspace.Wesummarizethem
inTable2,whereeachcolumndenotesanimportantdesignaspect.
2 BACKGROUND I
3.1 LazyJoinApproach
WesummarizethenotationsusedthroughoutthispaperinTable1.
Wedefineatuplex astriplex =t,k,v,wheret,kandv aRrethe Inthefollowing,wediscusstwohash-basedandtwosort-based
timestamp,key,andpayloadofthetuple,respectively.Wedefinethe relationaljoinalgorithmsastherepresentativelazyalgorithms.
inputstream(denotedasRorS)asalistoftupleschronologically No-PartitioningJoin(NPJ).NPJ[8]isaparallelversionofthe
arriving at the system (e.g., a query processor). We denote the canonicalhashjoinalgorithm.Bothinputrelationsaredividedinto
key skewness of one input stream (or a subsetP) asskew
key
and equisizedportionstobeassignedtoanumberofthreads.Inthe
the timestamp skewness asskewts. With a higherskewts, more buildphase,allthreadspopulateasharedhashtablewithalltuples
inputtuplesareskewedtowardthesametimestamp.Weusedupe ofR.Aftersynchronizationviaabarrier,allthreadsentertheprobe
todenotetheaveragenumberofduplicatesperkeyintheinput phase,andconcurrentlyfindmatchingjointuplesintheirassigned
stream.Theinputarrivalrate(denotEedasv)standsforthenumber portionsofS.
oftuplesarrivingperunitoftimefromoneinputstreamandw Parallel Radix Join (PRJ). PRJ [26] subdivides both input
denotesthelengthoftheconcernedwindowtojoin. relations based on the binary digits of keys (i.e., radix), and
Bydefinition,joiningoverstreamsisperformedoverinfinite physically assigns the resulting sub-relations into individual
input tuples. In practiRce, users typically formulate queries that threads,andthusavoidsthehashtablebeingsharedamongthreads
computejoinsoverboundedsubsetsofstreams,calledwindows[31]. inthecaseof NPJ.Thegoalofthephysicalrelationpartitioningis
Weadoptatime-basedwindowschemedefinedasfollows: tobreakatleastthesmallerinput(i.e.,tuplesfromR)intopieces
Definition1(Window). Wedefineawindowasanarbitrarytime thatfitintothecaches.Thereafter,itcanlaunchacache-resident
range(t1 ∼
P
t2)withalengthofw,i.e.,t2 −t1 =w.Forbrevity,we hashjoinforeachpartition.
henceforthdenoteawindowasw. Multi-Way Sort Merge Join (MWay). MWay [11] is a parallel
Mostpriorworks[34,42,46]targettheinter-windowjoin,which versionofthecanonicalsortjoin.Thealgorithmproceedsasfollows:
joins streams over infinite sliding (i.e., overlapping) windows. First,theinputrelationsRandSarephysicallypartitionedbykey
For those works, the primary concern is to efficiently explore rangeandequallydistributedacrossCPUsockets.Then,eachlocal
incrementalcomputationacrosswindows.Incontrast,wefocuson partitionissortedusingtheAVXsortinginstructions,andalllocal
IaWJthatjoinsstreamsoverasinglewindow[14,29]regardlessof partitionsaresortedinparallel.Subsequently,multi-waymerging
thewindowtype[49](i.e.,sliding,tumbling,orsession).Designing is applied to shuffle and merge data among different partitions
efficientinter-windowjoinalgorithmsbytakingIaWJasabuilding toobtainagloballysortedcopyofR andS.Finally,eachthread
blockisanexcitingtopicforfurtherinvestigationthatisbeyond concurrentlyevaluateseachpairoftuplesbetweenNUMA-local
thescopeofthispaper. sortedsubsetofinputsusingasingle-passmergejoin.
Definition2(intra-windowjoin). GiveninputstreamsRandSand Multi-PassSortMergeJoin(MPass).Thesecondvariantof
awindoww,theintra-windowjoinjoinsapairofsubsets(i.e.,R′, thesortjoiniscalledMPass[5].ItdiffersfromMWayonlyinthe
S′)suchthatR′(cid:90)S′={(r ∪s)|r.key=s.key,r.ts ∈w,s.ts ∈w,r ∈ shufflingandmergingphases.MWayscalespoorlywithincreasing
R,s ∈S},whereeachresulttuple(r ∪s)hasatimestamp,key,and inputsize[33]duetothemulti-waymerge.Instead,MPassapplies
valueofmax(r.ts,s.ts),r.key,andr.value ∥s.value,respectively. successivetwo-waybitonicmergingmultipleiterations.
3 STUDIEDALGORITHMS 3.2 EagerJoinApproach
Animportantdimensiontoclassifyjoinalgorithmsistheexecution Theeager algorithmcanbeconstructedbycombiningastream
approach,i.e.,lazyoreager.First,relationaljoinalgorithms[5,6] joinalgorithmandastreamdistributionscheme.Inthefollowing,

ParallelizingIntra-WindowJoinonMulticores:AnExperimentalStudy SIGMOD’21,June20–25,2021,Shaanxi,China
𝛿
|     |     | HashTable_R                  |        |        |                                  |                  |             |          |                             |             | ...Stream R | Str e am  R                   |                    |
| --- | --- | ---------------------------- | ------ | ------ | -------------------------------- | ---------------- | ----------- | -------- | --------------------------- | ----------- | ----------- | ----------------------------- | ------------------ |
|     | ... | Build                        |        | append | sort                             | merge            |             |          |                             | r1 r2       |             | . ..                          |                    |
|     | r2  | r1                           | ... r2 | r1     | subR                             | run run          | merged subR |          |                             |             |             | r 2 r1                        | Core1 Core2        |
|     |     |                              |        |        |                                  |                  |             |          | s1                          | r1,s1 r2,s1 | Core1       |                               | core group 1       |
|     |     | Probe                        |        |        |                                  | join             |             |          |                             |             |             |                               |                    |
|     |     | HashTable_S                  |        |        |                                  |                  | join        |          |                             |             |             | Stream S                      | Router             |
|     |     |                              |        | append | sort                             | merge            |             |          | s 2                         | r1,s2 r2,s2 | Core2       | ... s2 s1                     |                    |
|     | ... | s1                           | ...    | s1     | subS                             | run run          | merged subS |          |                             |             |             |                               | Cor e 3 C o re 4   |
|     |     |                              |        |        |                                  |                  |             | Stream S | ...                         | ...         |             |                               | c o re g r o u p 2 |
|     |     |                              |        |        | b.1) Initial Phase               | b.2) Merge Phase |             |          |                             |             |             |                               |                    |
|     |     |                              |        |        |                                  |                  |             |          | (a) Join-Matrix (JM) Scheme |             |             | (b) Join-Biclique (JB) Scheme |                    |
|     |     | a) Symmetric Hash Join (SHJ) |        |        | b) Progresssive Merge Join (PMJ) |                  |             |          |                             |             |             |                               |                    |
Figure1:Streamjoinalgorithms. Figure2:Streamdistributionschemes.
wediscusstwostreamjoinalgorithms(i.e.,SHJandPMJ)andtwo Join-Matrix(JM).WTeillustrateJMinFigure2a.Itabstractsthe
streamdistributionschemes(i.e.,JMandJB),illustratedinFigure1 joinprocessbetweentwostreamsasamatrix,whereeachcellof
andFigure2,respectively. thematrixrepresentsajoinbetweenapairoftuplesfromtwoinput
3.2.1 Stream Join Algorithms. When designing stream join streams[14].Wecanpartitionthematrixandassignaportionto
algorithms,priorwork[13,16,28,32,45,50]hashistoricallyfocused everythread.JMachievesabalancedworkloaddistributionamong
threadsNandisrobustinthepresenceofskewnessastheworkload
onsingle-threadexecutionefficiencywhileresolvingdiskI/Oissues
partitioningiscontent-insensitive.However,asstudiedbyLinet
duetothelimitationofhardwareresources.
al.[29],JMhasamajordrawbackofcommunicationefficiency,asit
SymmetricHashJoin(SHJ).SHJisconsideredtobethefirst
hastoreplicateasignificantamountofinputtuples.Forexample,
hash-basedstreamjoinalgorithm[52].Thecruxofthisapproach
istointerleavethebuildandprobeprocesses.Itsoverallprocess r1andr2areduplicatedamongthreadsinFigure2a.
|     |     |     |     |     |     |     | IJoin-Biclique(JB). |     |     | TheJBschemeorganizestheprocessing |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --- | --------------------------------- | --- | --- | --- |
isillustratedinFigure1a.Itmaintainstwohashtables,onefor
unitsasacompletebipartitegraph,whereeachsidecorrespondsto
| each | input     | stream. When      | the algorithm | receives   | a tuple | from   |                                                            |     |     |     |     |     |     |
| ---- | --------- | ----------------- | ------------- | ---------- | ------- | ------ | ---------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|      |           |                   |               |            |         | (orSR) | aninputstream.WeillustratetheoverallprocessofJBinFigure2b. |     |     |     |     |     |     |
| R    | (orS), it | inserts the tuple | into the      | hash table | ofR     | and    |                                                            |     |     |     |     |     |     |
Multiplecoregroupsaremaintainedbythesystem.Inputstreams
immediatelyprobethehashtableoftheoppositestreamS(orR).
Thisprocesscontinuesuntilalltuplesfrombothinputstreamshave arefirstpassedtoarouterthatdecidestowhichcoregroup the
tupleissent.ComparedtoJM,JBcanbetunedtowardsworkload
beenconsumed.Duetoitssimplicityanditsdesigngoalofachieving
balanceandefficiencybyadjustingtheroutingstrategy.Wewill
lowprocessinglatency,SHJhasbeenthedefauPlt(andoftenthe
discusstheeffectofthetuningparametersinSection5.5.
onlyavailable)joinalgorithmusedinmanystate-of-the-artstream
processingengines[38].However,aswewilldemonstratelater, 4 METHODOLOGY
theremaybeotherjoinalgorithmsthataremoresuitable.
Inthissection,wefirstintroducetheexaminedperformancemetrics.
(PMJ).EDittrich
Progressive Merge Join et al. [13] proposed Then,wepresentourbenchmarksuiteimplementation.
| a   | generic | technique called | progressive | merge | join (PMJ) | that |     |     |     |     |     |     |     |
| --- | ------- | ---------------- | ----------- | ----- | ---------- | ---- | --- | --- | --- | --- | --- | --- | --- |
4.1 PerformanceMetrics
eliminatestheblockingbehaviorofsort-basedjoinalgorithms.The
| keyideaof |     | PMJistofirstreadtuplesfrombothinputstreamsuntil |     |     |     |     |     |     |     |     |     |     |     |
| --------- | --- | ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Throughoutthisstudy,wefocusonthreeimportantperformance
ithitsthememoryspaRceconstraint.Theloadedsubsetsarethen
|     |     |     |     |     |     |     | metrics | of  | streaming | applications. |     | First, throughput | represents |
| --- | --- | --- | --- | --- | --- | --- | ------- | --- | --------- | ------------- | --- | ----------------- | ---------- |
sorted.Theresultingsortedsubsets(calledruns)areimmediately theoverallprocessingefficiency.Itisdefinedbythenumberof
joinedwithasimplesequentialscan.Bothrunsaresubsequently inputtuplesprocessedperunitoftime.Second,latencydescribes
storedondisk,andlaterrevisitedtomergeandproducefurther thedifferencebetweenthetimewhenamatchisgeneratedand
matchesam ongdifferentpairsofsubsets.WeslightlymodifyPMJto itslastcorrespondinginput(R orS)arrives.Followingprevious
P
makeitbetterfitformodernhardware.Weillustratethealgorithm 95th).
|     |     |     |     |     |     |     | work | [23], | we measure | quantile | worst-case | latency | (e.g., |
| --- | --- | --- | --- | --- | --- | --- | ---- | ----- | ---------- | -------- | ---------- | ------- | ------ |
inFigure1b.Thekeymodificationsarethatweuseaparameterδ
|     |     |     |     |     |     |     | Lastly, | progressiveness |     | is a | widely | used performance | metric to |
| --- | --- | --- | --- | --- | --- | --- | ------- | --------------- | --- | ---- | ------ | ---------------- | --------- |
tocontrolthenumberofinputtuplestobeaccumulatedateach examinehowalgorithmsmakeprogress[50,52]indeliveringpartial
iteration(insteadofhittingmemoryconstraint),andallrunsare results(e.g.,thetop50%).Itisusuallyrepresentedasthecumulative
subsequentlystoredinthemainmemoryinsteadofdisk.Many
percentileofmatchesasafunctionofelapsedtime.
suchrunsmaybegeneratedandneedtobemergedlater.Tuning
|               |     |                                              |     |     |     |     | Optimizing |     | algorithms | for | all | three performance | metrics is |
| ------------- | --- | -------------------------------------------- | --- | --- | --- | --- | ---------- | --- | ---------- | --- | --- | ----------------- | ---------- |
| theparameterδ |     | enablesthetrade-offbetweenthedelayofstarting |     |     |     |     |            |     |            |     |     |                   |            |
difficult.Ontheonehand,thesemetricsareallusefulindifferent
theprocessandthenumberofrunsgenerated.Whenδ issettothe use cases but sometimes conflict with each other. On the other
mainmemorysize,thealgorithmfallsbacktotheoriginalPMJ. hand, existing join algorithms are often designed to optimize
| 3.2.2 | StreamDistributionSchemes. |     | Tocopewiththerapidgrowth |     |     |     |     |     |     |     |     |     |     |
| ----- | -------------------------- | --- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
onlyoneortwoperformancemetrics.Forexample,relationaljoin
of data rates, researchers have recently proposed to parallelize algorithms[5]areprimarilydesignedtooptimizethroughput.In
single-thread stream join algorithms [14, 29]. The key idea is contrast,streamjoinalgorithmsaretypicallydesignedtooptimize
todynamicallydistributeinputstreamsamongmultiplethreads. latency[22]and/orprogressiveness[13,52].
Atthesametime,eachthreadlaunchesastreamjoinalgorithm
4.2 BenchmarkSuite
| to  | process | the assigned input | tuples. | Both | the distribution | and |     |     |     |     |     |     |     |
| --- | ------- | ------------------ | ------- | ---- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- |
Inthissection,weintroduceourbenchmarksuitecoveringselected
processingareeagerlyconductedcontinuouslyforeveryincoming
workloadsandimplementations.
inputtuple.Inthiswork,westudytwostreamdistributionschemes:
1)join-matrix(JM)[14]and2)join-biclique(JB)[29],wherethe 4.2.1 BenchmarkWorkloads. Inthefollowing,wedescribeeach
formeriscontent-insensitive,andthelatteriscontent-sensitive. workloadincludingitsapplicationscenarioandinputsetup.For

SIGMOD’21,June20–25,2021,Shaanxi,China ShuhaoZhang,YancanMao,JiongHe,PhilippM.Grulich,SteffenZeuch,BingshengHe,RichardT.B.Ma,andVolkerMarkl
Table3:Statisticsoffourreal-worldworkloads(w=1000ms)
Arrivalrate(tuples/ms) Keyduplicates Keyskewness(Zipf) Numberoftuples
Stock vR=61,vS=77 dupe(R)≈67.7,dupe(S)≈78.5 skewkey (R)=0.112,skewkey (S)=0.158 |R|(|S|)=vR(S)·w
vR≈3·103,vS≈3·103
Rovio dupe(R)=dupe(S)=17960.0 skewkey (R)=0.042,skewkey (S)=0.042 |R|(|S|)=vR(S)·w
|     |     | vR=∞,vS≈104 |     | dupe(R)=1,dupe(S)=105 |     |     |         |                   |     |           | |R|=103,|S|=vS·w |     |     |     |
| --- | --- | ----------- | --- | --------------------- | --- | --- | ------- | ----------------- | --- | --------- | ---------------- | --- | --- | --- |
|     | YSB |             |     |                       |     |     | skewkey | (R)=0.033,skewkey |     | (S)=0.032 |                  |     |     |     |
DEBS vR=∞,vS=∞ dupe(R)≈172.6,dupe(S)≈111.5 (R)=0.003,skewkey (S)=0.011 |R|=106, |S|=106
skewkey
|     | 4000      |     |     |     |     |     | 3000      |     |     |     |     |     |     |     |
| --- | --------- | --- | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
|     | sm/selpuT |     |     |     |     |     | sm/selpuT |     |     |     |     |     |     |     |
|     |           |     |     |     |     | R   | 2000      |     |     |     |     |     | R   |     |
|     | 2000      |     |     |     |     |     |           |     |     | T   |     |     |     |     |
|     |           |     |     |     |     | S   |           |     |     |     |     |     | S   |     |
1000
0
|     |     | 0 200 | 400           | 600 | 800 | 1000 |     | 0   | 200 | 400           | 600 | 800 1000 |     |     |
| --- | --- | ----- | ------------- | --- | --- | ---- | --- | --- | --- | ------------- | --- | -------- | --- | --- |
|     |     |       | Timestamp(ms) |     |     |      |     |     |     | Timestamp(ms) |     |          |     |     |
N
|     |     | (a)Traded&QuotedataofStock |     |     |     |     |     |     | (b)Ad&PurchasesdataofRovio |     |     |     |     |     |
| --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- |
Figure3:TimedistributionofStockandRovio.Otheruniformarrivaldatasetsareshownashorizontallinesandomitted.
eachworkload,insteadofconsideringthewholequery,weonly distribution of Stock and Rovio. Stock contains obvious event
executeandmeasurethejoinprocess. “spikes”,wheremanytuplesarriveatthesametimeslot.Onthe
Stock:Onecommonstockanalysistaskistogettheturnover other I hand, Rovio has a relatively stable event arrival pattern,
ratesofstocksbycalculatingthetraderatioofeachstockevery wherethearrivingtuplerateremainsroughlythesameatmost
periodoftime.Theinputdataareastreamofquotesandatraded R timestamps. Stream S of YSB has a uniform time distribution
streamthatcontainstradedresultsofmatchedquotes.Weusea (skewts=0).StreamRof YSBandbothinputstreamsof DEBSare
real-worldstockexchangedataset[2]forthisworkload.Thequery storedatrest,i.e.,alltuplesarriveinstantly.iii)Stockhasamore
joinsthetradedstream(R)andthequotesstream(S)overthesame skewedworkload(i.e.,skew ishigher),whileothersareless
key
stockidwithinthesameperiodoftime(i.e.,window). skewed.iv)Dependingontheusecases,thelatencyrequirement
P
Rovio:Rovio[39]continuouslymonitorstheuseractionsofa forstreamprocessingcanvaryfromtensofmillisecondstoafew
givengametoensurethattheirservicesworkasexpected[23].One seconds[51].Torepresentreal-worldusecases,wesetthewindow
usecaseistocorrelateadvertisementswiththeirrevenue,where length (w) to 1 second for all datasets and study the impact of
theinputdatacanbeapurchasestreamthatcontainstuplesof differentwindowlengthsinSection5.4.v)RovioandDEBShave
E
purchasedgempacksandanadvertisementstreamwhichcontains relativelyhighkeyduplicationinbothstreams;YSBhasalowkey
astreamofproposalsofgempackstousers.Weusethedataset duplicationinR buthighinS;andStockhasrelativelylowkey
fromKarimovetal.[23]forthisworkload.Thequeryjoinsthe duplicationinbothstreams.
advertisementsstream(R)andthepurchasestream(S)overthe R SyntheticWorkload.Thereal-worlddatasetmaynotcover
useridandadvertisementidwithinthesamewindow. all situations and and it is not possible to tune its workload
YSB:YahooStreamBenchmark(YSB)[12]describesasimplejob characteristicstoobservetheimpacts.Tocomprehensivelyevaluate
thatidentifiesthecampaignsofadvertisementeventsandstoresa theimpactofvaryingworkloadproperties,wefurtherevaluatea
windowcountofrelevanteventspercampaign.Theinputdatais synthetic workload based on the work from Kim et al. [26]. To
P
acampaignstablethatcontains1000advertisingcampaignsand differentiatewiththeotherfourreal-worldworkloads,wereferto
anadvertisementstreamthatcontainsanumberofadvertisements thissyntheticworkloadasMicro.
foreachcampaign.WeusethedatasetgeneratorfromChintapalli
|     |     |     |     |     |     |     | 4.2.2 | Implementations. |     | Wediscussthreekeycomponentsofour |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----- | ---------------- | --- | -------------------------------- | --- | --- | --- | --- |
etal.[12]forthisworkload.Thequeryjoinsthecampaignstable
benchmarksuiteimplementation:thealgorithmimplementation,
(R)andtheadvertisementsstream(S)overthecampaignid.
thedatasetstructuredesign,andtheprofilingmethods.
DEBS:Acommonanalyticqueryofsocialnetworksistofind
AlgorithmImplementation.Thesourcecodeofthelazyjoin
| the number | of posts | and comments | created |     | by users. | We use |     |     |     |     |     |     |     |     |
| ---------- | -------- | ------------ | ------- | --- | --------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
algorithmsNPJ,PRJ,MWay,MPassarebasedonthebenchmarkfrom
| the social | network | dataset published | by  | the | DEBS’2016 | Grand |     |     |     |     |     |     |     |     |
| ---------- | ------- | ----------------- | --- | --- | --------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
Balkesenetal.[5,6].TheeageralgorithmsSHJJM,SHJJB,PMJJM,
Challenge[15],whichsimulatespostsandcommentsonasocial
PMJJB areimplementedbasedonthecorrespondingpapers.We
| network | application. | The input | data to | the query | are | the posts |       |     |           |           |          |        |           |      |
| ------- | ------------ | --------- | ------- | --------- | --- | --------- | ----- | --- | --------- | --------- | -------- | ------ | --------- | ---- |
|         |              |           |         |           |     |           | reuse | the | available | functions | provided | by the | benchmark | from |
(R)andcomments(S)createdbyusersintheforum.Bothinputs
Balkesenetal.[5,6]asmuchaspossible.Specifically,weusethe
arestoredatrestandcanbeviewedasaninputstreamhavinga
|     |     |     |     |     |     |     | originalavxsort |     | functionusedinMWayandMPasstoimplement |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --- | ------------------------------------- | --- | --- | --- | --- | --- |
windowlengthofzeroandarrivalratesofinfinite.Thequeryjoins
PMJ’ssortandtheimplementationofbucketchainhashtableused
alltuplesofthecommentsandthepostsoverthesameuserid.
inPRJtoimplementthehashtableofSHJ.Theoriginalbenchmark
Wesummarizethepropertiesofthefourreal-worldworkloads[2,
suite[5,6]isonlytoevaluaterelationaljoinalgorithmsonstatic
12,15,23]inTable3.Ourselecteddatasetscoverawiderangeof
datasets.Wemodifyittosupportintra-windowjoinonbothstatic
workloadfeatures.i)StockandRoviohaverelativelylowarrival
|     |     |     |     |     |     |     | and | streaming | datasets. | We  | let the | lazy algorithms | accumulate |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------- | --- | ------- | --------------- | ---------- | --- |
rates(v);YSBhashigharrivalrates;DEBSrepresentsdataatrest
|     |     |     |     |     |     |     | all | input tuples | to  | arrive before | start | processing. | For | the eager |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ------------- | ----- | ----------- | --- | --------- |
andthearrivalrateisinfinity.ii)Figure3showsthetimestamp
algorithms,everythreadmaintainsatimertorecorditselapsed

ParallelizingIntra-WindowJoinonMulticores:AnExperimentalStudy SIGMOD’21,June20–25,2021,Shaanxi,China
Table4:Specificationofourevaluationplatform
timesinceitstarts,andalternativelyreadsfromitsassignedsubsets
|     |     |     |     |     |     |     | Component |     | Description |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ----------- | --- | --- | --- | --- |
ofinputstreams(Section3.2.2)duringexecution.Whentuplesfrom
Intel(R)Xeon(R)Gold6126CPU,
oneinput(RorS)arenotavailable(i.e.,thetuplehasalargerarrival Processor(w/oHT)
2(socket)*12*2.6GHz
timestampthanthethread’selapsedtime),thethreadattemptsto
|     |     |     |     |     |     |     | L3cachesize |     | 19MB |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ---- | --- | --- | --- | --- |
readfromtheotherinputstream.Hence,theeageralgorithmsmay
|     |     |     |     |     |     |     | Memory |     | 64GB,DDR42666MHz |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | ---------------- | --- | --- | --- | --- |
stillstalliftheyconsumetuplesfasterthantuplearrival.
|         |            |           |          |         |           |     | OS&Compiler |     | Linux4.15.0,compilewithg++O3 |     |     |     |     |
| ------- | ---------- | --------- | -------- | ------- | --------- | --- | ----------- | --- | ---------------------------- | --- | --- | --- | --- |
| Dataset | Structure. | We follow | the same | dataset | structure | of  |             |     |                              |     |     |     |     |
previous works [5, 6]. In particular, they all assume a column- andevaluateallalgorithmswithalteringAVXinstructionsanda
oriented storage model, and joins are assumed to be evaluated varyingnumbersofCPUcoresinSection5.6toanswerQ5andQ6.
T
overanarrow<key,payload>tupleconfiguration.Tomakeuseof All experiments are carried out on a Intel Xeon Gold 6126
vectorizedinstructions,weassumethateachtuplehasawidthof processor.Table4showsthedetailedspecificationofthehardware
64bits;thus,keyandpayloadarefourbyteseach.Toeliminate andsoftwareusedinourexperiments.Toexcludetheimpactof
NUMA,weonlyuseonesocketinourexperiment.Notethat,MWay
theimpactofnetworktransmissionoverhead,theinputdatasets
arefirstpopulated(syntheticdatasets)orloaded(realdatasets)in andMPassrequirethenumberofthreadstobeapowerof2.For N
memory.Then,weassigneachtupleatimestamp(startingfrom0) faircomparison,weuse1to8threadsinallofourexperiments.
toreflectitsactualarrivaltimetothesystem,andtuplesaretime
ordered.Thetimestampisstoredasthepayloadofeachtuple. 5.1 KeyFindings
|     |     |     |     |     |     |     | • Our experimental |     | results | show that | both lazy | and | eager |
| --- | --- | --- | --- | --- | --- | --- | ------------------ | --- | ------- | --------- | --------- | --- | ----- |
ProfilingMethods.Notethatthereisadditionaloverheadof
|     |     |     |     |     |     |     | approaches | are relevant. | However, | no  | one | algorithm | can |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------------- | -------- | --- | --- | --------- | --- |
checkingthread’selapsedtimestampduringexecutionfortheeager
I
approach. To minimize this overhead, we use Read Time-Stamp outperform others in all cases (Q1). Each algorithm can
Counter(RDTSC)[19]instructionsfortimemeasurement,andwe outperformothersinhandlingspecificworkloadsintermsofone
R
observethatsuchoverheadaccountsforlessthan5%ofo verall ormoreperformancemetrics.Notably,contrarytothecommon
belief[29],ourresultsindicatethatrelationaljoinalgorithms(i.e.,
executiontime.Duringprocessing,everythreadrecordsthecurrent
lazy)outperformspecificallydesignedstreamjoinalgorithms
timestampwheneveramatchisgeneratedbyit.Whentheprogram
finishes,wemergeandsorttimestampsofmatchesfromallthreads (i.e.,eager)onmostworkloads.Dependingontheworkload,they
toexaminetheoverallprogressofthealgorithPm.Throughputis achieveupto5xhigherthroughput,10xlowerlatency,andeven
measuredasthetotalnumberofinputsdividedbythetimestampof muchbetterprogressiveness(seeSection5.2).
|     |     |     |     |     |     |     | • InSection5.3.1,weshowthattheeageralgorithmsincurmore |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- |
thelastmatch.Latencyismeasuredbysubtractingthetimestamp
cachemissesduringpartitioningandprobeprocesses,resulting
| of a match | by the | larger timestamp | of  | its corresponding |     | input |     |     |     |     |     |     |     |
| ---------- | ------ | ---------------- | --- | ----------------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- |
inhigherexecutioncost(Q2).Sort-basedjoinalgorithmsreduce
tuple.Besidesperformancemetrics,wEealsouseIntelPCM[21]and
Perf [37]togatherarchitecturalstatistics[20]ofprocessors. cachemissesinhandlinghighkeyduplicationworkloadsand
achievebetterperformanceforbothlazyandeageralgorithms.
5 EVALUATION Surprisingly, compared to JM, the JB scheme involves higher
|           |              | oRf             |     |           |             |     | partitioningcostduetostatusmaintenance(seeSection5.3.3). |     |     |     |     |     |     |
| --------- | ------------ | --------------- | --- | --------- | ----------- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| The main  | objective    | the experiments |     | is to     | comprehend  | the |                                                          |     |     |     |     |     |     |
|           |              |                 |     |           |             |     | • Theeageralgorithmsachievebetterperformancewhenoneinput |     |     |     |     |     |     |
| behaviour | of different | IaWJ algorithms |     | on modern | multicores. |     |                                                          |     |     |     |     |     |     |
streamhasalowarrivalrate(Q3).Inparticular,SHJJMisableto
Specifically,weseekanswerstothefollowingquestions.
Q1:Howdodifferentjoinalgorithmsperformonjoiningreal- deliveroutputquicklyiftheinputrateofthedatastreamvaries
worldworkPloadswithbothstaticandstreaminginputs? withspikes(seeSection5.4).However,whenbothinputstreams
havehigharrivalrates,thelazyalgorithmsperformbetterinall
Q2:Arethereanycommonperformanceissuesamongdifferent
performancemetrics.
algorithmswhenrunningonmodernmulticoreprocessors?
•
Q3:Whataretheimpactsofworkloadcharacteristicsonthe Thelazyalgorithmsaremoresensitivetotuningparameters,as
threeperformancemetrics? weobserveasignificantdifferenceofexecutioncostsbetween
Q4:Foreachalgorithm,howmuchdothealgorithmicparameters a good and bad configuration (see Section 5.5). In contrast,
largeconstantoverheadmakeseageralgorithmslesssensitiveto
affectitsperformance,e.g.,overallexecutioncost?
tuningparameters(Q4).
| Q5: How | different | join algorithms |     | interact | with | modern |     |     |     |     |     |     |     |
| ------- | --------- | --------------- | --- | -------- | ---- | ------ | --- | --- | --- | --- | --- | --- | --- |
•
hardwarearchitectures? In Section 5.6, we show that eager algorithms are more Core
Q6:Howevaluationresultschangewithorwithoututilizing Bound [20] (Q5). The frequent function calls to pulling data
SIMD instructions in join algorithms? Do the algorithms scale frombothinputstreamsoverloadstheout-of-orderexecution
|     |     |     |     |     |     |     | units. The | eager algorithms |     | are also more | memory |     | bounded |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---------------- | --- | ------------- | ------ | --- | ------- |
linearlyonmulticoreprocessors?
|     |     |     |     |     |     |     | due to severe | cache | misses | (in particular | L1D-Cache |     | miss). |
| --- | --- | --- | --- | --- | --- | --- | ------------- | ----- | ------ | -------------- | --------- | --- | ------ |
Inthefollowing,wepresentasummaryofourexperimental
resultsinSection5.1.InSection5.2,wecomparetheperformance Furthermore, they consume more memory spaces due to
ofallalgorithmsusingfourreal-worldworkloadstoanswerQ1. additionalintermediateresults.
WeprovideadetailedexecutiontimebreakdowninSection5.3 • All algorithms scale almost linearly with the number of
|     |     |     |     |     |     |     | cores for | intensive | workloads | as  | there | are no | major |
| --- | --- | --- | --- | --- | --- | --- | --------- | --------- | --------- | --- | ----- | ------ | ----- |
toanswerQ2.InSection5.4,weevaluatetheimpactofvarying
|     |     |     |     |     |     |     | synchronization | barriers. | AVX | instruction |     | set does | bring |
| --- | --- | --- | --- | --- | --- | --- | --------------- | --------- | --- | ----------- | --- | -------- | ----- |
workloadconfigurationsusingthesyntheticworkloadtoanswer
performanceimprovementoverbothlazyandeageralgorithms,
Q3.ToanswerQ4,weperformsensitivitystudiesonthealgorithm
parametersinSection5.5.Finally,weprofilehardwarecounters butitsimprovementforeageralgorithmsismarginal(Q6).

SIGMOD’21,June20–25,2021,Shaanxi,China ShuhaoZhang,YancanMao,JiongHe,PhilippM.Grulich,SteffenZeuch,BingshengHe,RichardT.B.Ma,andVolkerMarkl
High High Large isnotabletoconsumetheminstantly,processinglatencyincreases
Arrival Rate () Key duplication ( ) Number of cores
w Low Small duetotheincreasedwaitingtime[23].Ourresultsdemonstrate
At
least
one
is
lo
Medium Key
(
duplic
H
a
)
i
t
g
io
h
nLow O
O
pt
b
im
je
i
c
z
t
L
a
iv
a
ti
e
o
te
n
n
T
c
h
y
r
/
oughput Ke
(
y S
L
k
o
e
w
wnes
)
s High
Small
t
i
b
n
h
e
d
e
tt
ic
e
b
a
r
e
t
t
s
e
t
u
e
a
i
r
t
f
e
e
a
d
x
ls
e
w
e
c
h
c
u
l
e
t
a
i
n
i
o
m
n
ha
t
e
h
n
ffi
a
d
t
l
c
i
s
i
n
p
e
g
n
ec
c
d
i
y
a
fi
t
c
o
a
f
s
s
t
t
t
r
h
r
e
e
e
a
a
m
l
m
az
j
s
o
y
[
i
2
n
a
9
l
a
g
]
l
.
o
g
N
r
o
i
e
r
t
i
v
h
t
e
h
m
r
m
t
s
h
s
a
e
a
n
l
r
e
d
e
ss
c
a
,
l
l
t
e
w
h
a
a
e
r
y
r
ly
e
s
Progressiveness Number of Large isnosinglewinneramongallalgorithms.Forexample,sort-based
tuples
algorithms achieve higher throughput for handling Rovio and
Figure4:Decisiontreeforpickinganappropriatealgorithm.
DEBS,whilehash-basedonesarebettersuitedforStockandYSB.
Therootnodeofthetreeisthearrivalratenode.
Progressiveness.Figure6compareshowdifferentalgorithms
T
Wesummarizethemainfindingsofouranalysisinadecision makeprogressandtheresultsshowthatwhichapproachmakes
treetoguidereadersthroughourresultsandtoaidpractitioners faster progress depends heavily on the workloads. The eager
inselectingasuitablealgorithmtoparallelizeIaWJonmulticore approach is able to generate matches without waiting for all
processors(Figure4).Notethatthequalitativeremarksofhigh, inputs.Forexample,SHJJMisabletodeliverthefirst50%matches
medium,andlowarerelativeandthequantitativevaluedepends of handling Stock in 674ms, which is around 1.5x faster than
N
onactualhardwareandworkloads.First,werecommendthelazy thefastestlazyalternative(i.e.,1014msbyNPJ).However,alazy
approachwhenarrivalratesarehigh.Whenthekeyduplication algorithmcanquicklyfinishtheoverallprocessanditcansurpass
isalsohigh,MPassandMWayarebetteroptionsandMPassscales eageralgorithmsearly.Forexample,MPassisabletooutput50%of
betterwithalargecorecounts.Whenthekeyduplicationislow, totalmatchesin11699mswhenhandlingRovio,whilethefastest
NPJ and PRJ are more effective, and PRJ performs better when eageralgorithmPMJJMproducesonly28%oftotalmatchesusing
I
the key distribution is low and the number of tuples to join is thesameamountoftime.Thecommonwisdom[13,29,52]that
large.Second,whenthearrivalrateismedium,PMJJB performs streamjoinalgorithmsalwaysmakefasterprogressforhandling
R
bestintermsofallthreeperformancemetricsforhandlinghigh streamingdataisobviouslymisleading.Ourresultsalsoindicate
key duplication workload, while SHJJM achieves lower latency aninterestingfutureresearchareatoexplorehowtoorchestrate
andbetterprogressivenessforhandlingworkloadswithlowkey bothapproachestoachieveoptimalprogressivenessatalltime.
duplication.Ifthroughputisthekeytarget,werecommendthe
lazyapproachwhentheinputarrivalrateismePdiumandthekey 5.3 ExecutionTimeBreakdown
duplicationislow.Finally,werecommendSHJJM wheneverone
Inthissection,wereporthowmuchtimeisspentintheprocessing
inputstreamhaslowarrivalrate,asitisabletoeagerlyutilize
of each input among different algorithms. We divide it into six
hardwareresourceswithlowoverhead.
phases:i)Waitisthetimespentwaitingforinputstoarrive.The
E
lazy algorithms wait until the very last tuple of the concerned
5.2 PerformanceComparison
windowarrivesbeforethejoinstarts.Thus,it’swaitequalswindow
Inthissection,wecomparealgorithmsonprocessingreal-world
length.Theeageralgorithmsalsowaitifthesystemisunderutilized
workloadsintermsofthroughput,latency,andprogressiveness.
(i.e.,inputarriverateislowerthanthesystemprocessingrate).ii)
EachalgorithmistuneRdtoitsoptimalconfiguration.
Partitionisthetimespentpartitioningworkloadsamongthreads.
Throughput and Latency. The overall performance
iii)Build/Sortisthetimespentduetohashtableconstruction
comparison results are shown in Figure 5. There are two
ortuplesortinginhashorsort-basedalgorithms,respectively.iv)
major observations. First, despite the great differences among
Mergeisthetimespentmergingtuples,whichisonlypresentin
workloads,Pthe lazy algorithms always achieve better or at
sort-basedjoinalgorithms.v)Probeisthetimeactuallyspenton
least comparable throughput. The results clearly reflect their
matchingtuples.Itreferstoeithertheprobetimeinhash-basedor
better execution efficiency. As expected, the throughput is
thematchtimeinsort-basedjoinalgorithms.vi)Othersreferto
especiallyhigheronstaticdatasets(i.e.,DEBS),andthethroughput
allremainingoverheadssuchascontextswitching.
difference is up to 5x. More interestingly, they even achieve
higher throughput for joining data in motion, e.g., Rovio and 5.3.1 Overall Comparison. The results of the time breakdown
YSB. When the input arrival rate is low (e.g., Stock), hardware areshowninFigure7.Therearetwokeyobservationswhenwe
resources are underutilized (i.e., up to 6.6% CPU and 0.55% compareallalgorithms.First,itconfirmsthatallalgorithmsspend
memorybandwidthutilization),andallalgorithmsshowasimilar mostofthetimeonwaitforprocessingStock,whichhasasmall
throughput.Inhandlingsuchworkloads,usersmayoptimizethe arrivalrate,andallCPUcoresaremostlyidle.Second,ifweexclude
othertwoperformancemetricsbyselectingappropriatealgorithms thewaitcost,wecanseethattheeageralgorithmsgenerallyinvolve
without sacrificing throughput. Second, the eager algorithms highercostperinputtuple.Inparticular,executiontimeismostly
achievesmallerprocessinglatencyforStockandYSB,although spentoneitherprobingorpartitioning.
the throughput is similar or even worse compared to the lazy We further take the YSB as an example to examine the
algorithms. This matches the previous findings [22], as those cacheefficiencyofdifferentalgorithms.Figure8showsthatthe
algorithms are specifically designed to achieve low processing inefficiency of eager algorithms is caused by significant cache
latency.However,theresultsalsoshowthatthelazyalgorithms misses.Therearedifferentcacheaccessbehavioursduringdifferent
achieve similar or even lower latency on other workloads, e.g., phases. First, SHJJB and PMJJB experience higher cache miss at
DEBS.Thisisbecauseprocessinglatencyisalsohighlycorrelated L1 and L2 cache during the partitioning phase. This is mainly
toexecutionefficiency.Ifinputtuplesarequeuingupasthesystem caused by their content-sensitive partitioning scheme (i.e., JB).

ParallelizingIntra-WindowJoinonMulticores:AnExperimentalStudy SIGMOD’21,June20–25,2021,Shaanxi,China
|     |     |     |     |     |     |     |     |     |     |     | SHJJM | SHJJB PMJJM | PMJJB |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | ----------- | ----- | --- |
Lazy: NPJ PRJ MWAY MPASS Eager: SHJJM SHJJB PMJJM PMJJB Lazy: NPJ PRJ MWAY MPASS Eager:
|                   |     |     |     |     |     | tnecrep evitalumuc |     |     |     | tnecrep evitalumuc |     |     |     |     |
| ----------------- | --- | --- | --- | --- | --- | ------------------ | --- | --- | --- | ------------------ | --- | --- | --- | --- |
| )sm/stupni#( .tpT |     |     |     |     |     | 100%               |     |     |     | 100%               |     |     |     |     |
104
|     |     |     |     |     |     | 50% |     |     |     | 50% |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
102
|     |       |     |           |     |      | 0%  |     |                     |     | 0%  |     |                     |     |     |
| --- | ----- | --- | --------- | --- | ---- | --- | --- | ------------------- | --- | --- | --- | ------------------- | --- | --- |
|     |       |     |           |     |      |     | 102 |                     | 103 |     | 103 | 104                 | 105 | 106 |
|     |       |     |           |     |      |     |     | elapsed time (msec) |     |     |     | elapsed time (msec) |     |     |
|     | Stock |     | Rovio YSB |     | DEBS |     |     |                     |     |     |     |                     |     |     |
|     |       |     |           |     |      |     |     | (a)Stock            |     |     |     | (b)Rovio            |     |     |
(a)Throughput
T
|              |     |     |     |     |     | tnecrep evitalumuc |     |     |     | tnecrep evitalumuc |     |     |     |     |
| ------------ | --- | --- | --- | --- | --- | ------------------ | --- | --- | --- | ------------------ | --- | --- | --- | --- |
| )sm( ycnetaL | 105 |     |     |     |     | 100%               |     |     |     | 100%               |     |     |     |     |
102
|     |     |     |     |     |     | 50% |     |     |     | 50% |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
101
|     |       |                |           |     |      | 0%  |     | N                   |     | 0%  |     |                     |     |     |
| --- | ----- | -------------- | --------- | --- | ---- | --- | --- | ------------------- | --- | --- | --- | ------------------- | --- | --- |
|     |       |                |           |     |      |     | 101 | 102                 | 103 |     |     |                     | 102 | 103 |
|     |       |                |           |     |      |     |     | elapsed time (msec) |     |     |     | elapsed time (msec) |     |     |
|     | Stock |                | Rovio YSB |     | DEBS |     |     |                     |     |     |     |                     |     |     |
|     |       | (b)95thLatency |           |     |      |     |     | (c)YSB              |     |     |     | (d)DEBS             |     |     |
Figure6:Progressivenesscomparison.
Figure5:Throughputandlatencycomparison.
|                  |      |     | wait partition | build/sort | merge            | probe | others | I   |                 |           |          |              |             |             |
| ---------------- | ---- | --- | -------------- | ---------- | ---------------- | ----- | ------ | --- | --------------- | --------- | -------- | ------------ | ----------- | ----------- |
|                  |      |     |                |            |                  |       |        |     |                 | Lazy: NPJ | PRJ MWAY | MPASS Eager: | SHJJM SHJJB | PMJJM PMJJB |
|                  | ×104 |     |                |            |                  | ×105  |        |     |                 |           |          |              |             |             |
| tupni rep selcyc | 1.6  |     |                |            | tupni rep selcyc | 2.9   |        |     |                 | 102       |          |              |             |             |
|                  |      |     |                |            |                  | R     |        |     | tupnikrepsessim | 7.9 ×     |          |              |             |             |
|                  | 0.8  |     |                |            |                  | 1.4   |        |     |                 |           |          |              |             |             |
3.9
|     | 0.0 NPJ PRJ | MWAY MPASS |             |             |     | 0.0 NPJ PRJ | MWAY MPASS |                   |       |     |     |     |     |     |
| --- | ----------- | ---------- | ----------- | ----------- | --- | ----------- | ---------- | ----------------- | ----- | --- | --- | --- | --- | --- |
|     |             |            | SHJJM SHJJB | PMJJM PMJJB |     |             |            | SHJJM SHJJB PMJJM | PMJJB |     |     |     |     |     |
0.0
|     |      |          |     |     | P   |      |          |     |     | L1miss |              | L2miss | L3miss |     |
| --- | ---- | -------- | --- | --- | --- | ---- | -------- | --- | --- | ------ | ------------ | ------ | ------ | --- |
|     |      | (a)Stock |     |     |     |      | (b)Rovio |     |     |        | (a)Partition |        |        |     |
|     | ×102 |          |     |     |     | ×103 |          |     |     | 102    |              |        |        |     |
tupni rep selcyc 3.0 tupni rep selcyc 1.1 tupnikrepsessim 5.2 ×
E
|     | 1.5 |     |     |     |     | 0.5 |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
2.6
|     | 0.0     | MWAY  |             |             |     | 0.0     | MWAY  |                   |       |        |     |        |        |     |
| --- | ------- | ----- | ----------- | ----------- | --- | ------- | ----- | ----------------- | ----- | ------ | --- | ------ | ------ | --- |
|     | NPJ PRJ | MPASS | SHJJM SHJJB | PMJJM PMJJB |     | NPJ PRJ | MPASS | SHJJM SHJJB PMJJM | PMJJB | 0.0    |     |        |        |     |
|     |         |       |             |             |     |         |       |                   |       | L1miss |     | L2miss | L3miss |     |
R
(b)Probe
|     |     | (c)YSB |     |     |     |     | (d)DEBS |     |     |     |     |     |     |     |
| --- | --- | ------ | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
Figure7:Executiontimebreakdown. Figure8:Cacheefficiencyprofiling(YSB).
Specifically,eachthreadaccessestuplesaccordingtotheirprimary costofsort-basedalgorithmsisslightlyhigherthanthehash-based
P
keys resulting in random memory accesses, and the footprint algorithmsinhandlingYSB,wherekeysoftuplesfromRareunique
between consecutive access exceeds L2 cache but smaller than (seeTable3).Ourresultsshowthat,insuchcase,thereisstilla
L3cache.Second,alleageralgorithmsexperiencesignificantL1 highersortcostcomparedtobuildcostalthoughAVXinstruction
cachemissesduringtheprobephase.Thisisduetotheirfrequent setscanacceleratethesortingprocess,whichreaffirmstheanalysis
interleavingaccess,whereeachthreadaggressivelyworksonany ofpriorworkbyBalkesenetal.[5].
availabletuplesfromeitherinputstreamresultingincachetrashing.
|     |     |     |     |     |     |     |     | 5.3.3 EagerApproachComparison. |     |     | Finally,wecomparetheeager |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | ------------------------- | --- | --- | --- |
algorithms(i.e.,SHJJM,SHJJB,PMJJM,andPMJJB).Wehavesimilar
| 5.3.2 | Lazy Approach |     | Comparison. | If we | compare | the lazy | join |     |     |     |     |     |     |     |
| ----- | ------------- | --- | ----------- | ----- | ------- | -------- | ---- | --- | --- | --- | --- | --- | --- | --- |
algorithms(i.e.,NPJ,PRJ,MWay,andMPass),wecanseethathash- observations of analysing the lazy approach that sort-based
basedalgorithmsinvolvemuchhighercostsinprobewhenhandling algorithms outperform hash-based ones in handling Rovio and
RovioandDEBS.Wefindthatthesedatasetshavemanyduplicate DEBS(thosewithrelativelyhighkeyduplicationsinbothinput
keysinbothstreams(seeTable3).PRJusesabucket-chaindesign,
|     |     |     |     |     |     |     |     | streams). If | we compare | the | eager | algorithms | with different |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ---------- | --- | ----- | ---------- | -------------- | --- |
wheretuplesofthesamekeywillbeinsertedintothesamebucket partitioning schemes, we can see that algorithms with the JB
untilthebucketisfullandanewbucketiscreatedandappendedto schemesurprisinglyinvolvesignificantpartitioningoverhead.We
formalist.Whenhandlinghighkeyduplicationworkloads,each findthatthisismainlyduetothestatusmaintenanceoverhead.
threadneedstowalkthroughalonglisttoperformthematch.NPJ Specifically, after each tuple is dispatched, the system needs to
involveshighcostforhandlinghighkeyduplicationworkloads record the dispatch results for future reference. In the original
becauseofthehigherchanceofaccessconflictwhenthesamehash workbyLinetal.[29],thisoverheadisnegligiblebecausetheyuse
bucketisconcurrentlyvisitedbymultiplethreads.Theseissues Storm[48]astheirtargettestplatform,whichisknowntopoorly
arenotinvolvedinsort-basedalgorithms.However,theexecution utilizemodernmulticoreprocessors[56].

SIGMOD’21,June20–25,2021,Shaanxi,China ShuhaoZhang,YancanMao,JiongHe,PhilippM.Grulich,SteffenZeuch,BingshengHe,RichardT.B.Ma,andVolkerMarkl
|     |                       |     |     |     |       |                     |            |        | SHJJM SHJJB | PMJJM              | PMJJB |     |     |
| --- | --------------------- | --- | --- | --- | ----- | ------------------- | ---------- | ------ | ----------- | ------------------ | ----- | --- | --- |
|     |                       |     |     |     | Lazy: | NPJ PRJ             | MWAY MPASS | Eager: |             |                    |       |     |     |
|     | )cesm/stupni(.tpT 104 |     |     |     |       |                     |            |        |             | tnecrep evitalumuc |       |     |     |
|     | 4.0 ×                 |     |     |     |       | 104                 |            |        |             |                    |       |     |     |
|     |                       |     |     |     |       | )cesm(ycnetaL 2.3 × |            |        |             | 100%               |       |     |     |
2.0
|     |     |     |     |     |     | 1.2 |     |     |     | 50% |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
0%
0.0 1600 3200 6400 12800 25600 0.0 1600 3200 6400 12800 25600 102 103
|     |     | vR=vS(inputs/msec) |     |     |     |     | vR=vS(inputs/msec) |     |     |     |     | elapsed time (msec) |     |
| --- | --- | ------------------ | --- | --- | --- | --- | ------------------ | --- | --- | --- | --- | ------------------- | --- |
(a)Throughput (b)95thLatency (c)Progressiviness(vR =vS =1600)tuples/msec
T
Figure9:Resultsofvaryinginputarrivalrates.
|     | )cesm/stupni(.tpT 104 |     |     |     |     | 103                 |     |     |     | tnecrep evitalumuc |     |     |     |
| --- | --------------------- | --- | --- | --- | --- | ------------------- | --- | --- | --- | ------------------ | --- | --- | --- |
|     | 3.0 ×                 |     |     |     |     | )cesm(ycnetaL 4.8 × |     |     |     | 100%               |     |     |     |
|     | 1.5                   |     |     |     |     | 2.4                 |     |     | N   | 50%                |     |     |     |
0%
|     | 0.0  |      |                 |       |       | 0.0  |                 |      |             |                       |     |                     |     |
| --- | ---- | ---- | --------------- | ----- | ----- | ---- | --------------- | ---- | ----------- | --------------------- | --- | ------------------- | --- |
|     | 1600 | 3200 | 6400            | 12800 | 25600 | 1600 | 3200            | 6400 | 12800 25600 |                       |     | 103                 |     |
|     |      |      | vS(inputs/msec) |       |       |      | vS(inputs/msec) |      |             |                       |     | elapsed time (msec) |     |
|     |      |      |                 |       |       |      | (b)95thLatency  |      |             | (c)Progressiveness(vS |     | =25600tuples/msec)  |     |
(a)Throughput
|                 |       |               |      | Figure10:Impactsofrelativearrivalrates(v |     |                   |                |      | =1600tuples/msec). |                    |                              |                     |     |
| --------------- | ----- | ------------- | ---- | ---------------------------------------- | --- | ----------------- | -------------- | ---- | ------------------ | ------------------ | ---------------------------- | ------------------- | --- |
|                 |       |               |      |                                          |     |                   |                | I    | R                  |                    |                              |                     |     |
| )sm/stupni(.tpT | 104   |               |      |                                          |     |                   | 105            |      |                    | tnecrep evitalumuc |                              |                     |     |
|                 | 1.3 × |               |      |                                          |     | )sm(ycnetaL 5.1 × | R              |      |                    | 100%               |                              |                     |     |
|                 | 0.7   |               |      |                                          |     | 2.6               |                |      |                    |                    | 50%                          |                     |     |
|                 | 0.0   |               |      |                                          |     | 0.0               |                |      |                    |                    | 0%                           |                     |     |
|                 | 110   |               | 100  |                                          | 200 |                   | 1              | 10   | 100                | 200                |                              | 103                 |     |
|                 |       |               | dupe |                                          |     | P                 |                | dupe |                    |                    |                              | elapsed time (msec) |     |
|                 |       | (a)Throughput |      |                                          |     |                   | (b)95thLatency |      |                    |                    | (c)Progressiveness(dupe=100) |                     |     |
Figure11:Impactsofkeyduplication(v=6400).
E
5.4 WorkloadSensitivityStudy theeageralgorithmsachievelowerprocessinglatencyandbetter
progressiveness,althoughthethroughputislowercomparedtolazy
| Workload |     | characteristics | of  | data streams |     | being | joined vary |     |     |     |     |     |     |
| -------- | --- | --------------- | --- | ------------ | --- | ----- | ----------- | --- | --- | --- | --- | --- | --- |
significantlyamongapplications.Ontheonehand,theinputdata algorithms.Duetothelackofcompleteknowledgeoftheentiredata
characteristicfromthesameinputstreammayvarydependingon R streams,theeageralgorithmsmisstheopportunitiestooptimize
whichsubsetsofstreamsarejoinedandalsoonthewindowlength. theprocessinginaholisticmannerandthuswillinevitablyincur
performancepenaltysuchascachemisses.Asaresult,whenthe
Ontheotherhand,evenifdatasources(e.g.,sensors)maygenerate
arrivalrateishigh(e.g.,v=25600),theeageralgorithmsarenot
datastreams(almost)constantly,theactualdeploymentofstream
abletoconsumeinputtuplesimmediatelyandperformworseinall
processingatvariousinfrastructurelayers[54]leadstodifferent
P
workloadsinthesystem.Inthefollowing,weevaluatetheimpact performancemetrics.
ofworkloadcharacteristicsquantitatively.WeuseMicrointhis Impact of Relative Arrival Rate (v R:v S). We also evaluate
theimpactofvaryingrelativearrivalratesoftwoinputstreams.
studyduetoitssimplicityandflexibility.Wetunetheparameters
|                                            |     |     |     |     |     |     |     | Inthisexperiment,wekeepv |     |     | at1600tuples/msecandvaryv |     |     |
| ------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | ------------------------ | --- | --- | ------------------------- | --- | --- |
| tochangethefeaturesofthegenerateddatasets. |     |     |     |     |     |     |     |                          |     |     | R                         |     | S   |
from1600to25600tuples/msec.Theevaluationresultsareshown
|     | Impact | of Arrival | Rate | (v). Figure | 9 illustrates |     | the impact |     |     |     |     |     |     |
| --- | ------ | ---------- | ---- | ----------- | ------------- | --- | ---------- | --- | --- | --- | --- | --- | --- |
SHJJM
of the arrival rate of both input streams, ranging from 1600 to in Figure 10. We see that can constantly perform best in
25600 tuples/msec. We fix the window length to 1 second and allthreeperformancemetricswithdifferentvaluesofv S.Thisis
because,asoneinputstreamarrivesslowly,SHJJM continuously
generatethedatasetswithauniquekeysetanduniformarrival
readsinputtuplesfromtheotherstream.Thisreducesthechanceof
| distribution. |     | There | are two | key observations: |     | First, | when the |     |     |     |     |     |     |
| ------------- | --- | ----- | ------- | ----------------- | --- | ------ | -------- | --- | --- | --- | --- | --- | --- |
readingfromtwoinputstreamsinterleavedandeffectivelyreduces
arrivalrateislow(e.g.,v=1600),alljoinalgorithmsachievesimilar
throughputastheCPUsareunderutilized,butSHJJMdeliversresults randommemoryaccess.Processinglatencyremainsconstantin
constantlyfasterandguaranteesmuchlowerprocessinglatency. mostalgorithms,asmatchesaremostlytriggeredbytuplesfrom
PMJJBandSHJJBincreases
NotethattheprogressivecurveinFigure9creflectsthatSHJJM R,whicharriveslowly.Thelatencyof
significantlywhentheyarenotabletokeepupwiththeincreasing
| can | instantly | process | every | input tuple | once | it arrives | and can |     |     |     |     |     |     |
| --- | --------- | ------- | ----- | ----------- | ---- | ---------- | ------- | --- | --- | --- | --- | --- | --- |
aggregatedarrivalratesfrombothinputstreams.
deliverresultsalmostimmediately.Thisresultmatchesthecaseof
handlingtheStockworkloadasdiscussedpreviously.Second,with Impact of Key Duplication (dupe). We now evaluate the
anincreasingarrivalrate,thelazyalgorithmscangraduallyimprove impactofduplicatekeysintheinputstreams.Wesettheinput
thethroughput,whiletheeageralgorithmsdeliversimilaroreven arrival rate of both input streams to 6400 tuples/msec and set
thewindowlengthto1000msec.Wethenvarytheduplication
worsethroughput.Whenthearrivalrateismedium(e.g.,v=12800),

ParallelizingIntra-WindowJoinonMulticores:AnExperimentalStudy SIGMOD’21,June20–25,2021,Shaanxi,China
|                 |       |     |     |       |                   |      |       | SHJJM  | SHJJB | PMJJM             | PMJJB |     |     |
| --------------- | ----- | --- | --- | ----- | ----------------- | ---- | ----- | ------ | ----- | ----------------- | ----- | --- | --- |
|                 |       |     |     | Lazy: | NPJ PRJ           | MWAY | MPASS | Eager: |       |                   |       |     |     |
|                 | 103   |     |     |       | )cesm/stupni(.tpT | 104  |       |        |       | )cesm/stupni(.tpT |       |     |     |
| )sm/stupni(.tpT | 5.7 × |     |     |       | 2.3               | ×    |       |        |       | 1.3               | 104   |     |     |
×
|     | 2.9 |     |     |     | 1.2 |     |     |     |     | 0.7 |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
0.0
0.0 0.4 0.8 1.2 1.6 0.0 0.0 0.4 0.8 1.2 1.6 0.0 500 750 1000 1250 1500
skewts
|     |     |               |     |     |     |     |               | skewkey |     |     |     | w(msec)       |     |
| --- | --- | ------------- | --- | --- | --- | --- | ------------- | ------- | --- | --- | --- | ------------- | --- |
|     |     | (a)Throughput |     |     |     |     | (a)Throughput |         |     |     |     | (a)Throughput |     |
T
tnecrep evitalumuc
|     |      |     |     |     | 1.1         | 104 |     |     |     | )cesm(ycnetaL 1.5 | 104 |     |     |
| --- | ---- | --- | --- | --- | ----------- | --- | --- | --- | --- | ----------------- | --- | --- | --- |
|     | 100% |     |     |     | )sm(ycnetaL | ×   |     |     |     |                   | ×   |     |     |
50%
|     |     |                     |     |     | 0.6 |     |     |         |     | 0.7 |         |         |                |
| --- | --- | ------------------- | --- | --- | --- | --- | --- | ------- | --- | --- | ------- | ------- | -------------- |
|     | 0%  |                     |     |     |     |     |     | N       |     |     |         |         |                |
|     |     | 102                 |     | 103 | 0.0 | 0.0 | 0.4 | 0.8 1.2 | 1.6 | 0.0 | 500 750 |         | 1000 1250 1500 |
|     |     | elapsed time (msec) |     |     |     |     |     | skewkey |     |     |         | w(msec) |                |
(b)Progressiveness(skewts =1.6) (b)95thLatency (b)95thLatency
Figure 12: Impacts of arrival skewness Figure13:Impactsofkeyskewness(v= Figure14:Impactsofwindowlength(v=
(v=1600).
|     |     |     |     |     | 12800). |     |     |     |     | 12800). |     |     |     |
| --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | ------- | --- | --- | --- |
I
ofeachkeyfrom1to100times.Thus,thetotalnumberofmatches skewness,PRJunderutilizesthehardwareresourcesasonlyafew
R
become1to100timeslarger.TheresultsinFigure11showthat partitionsarecreated,andfewthreadsareconcurrentlyrunning.
the sort-based join algorithms outperform hash-based ones in SHJJM becomesevenbetterwithskewedinputduetothebetter
terms of all three performance metrics for both eager and lazy cachebehaviourasthesamekeyisrepeatablyrevisited.
approacheswhenthedupeisgreaterthan10andPMJJBoutperforms
ImpactofWindowLength(w).Thewindowlengthdefines
allotheralgorithmswhenthedupeisgreaterthan100.Ourfurther P thetimerangeofeachsubstreamtojoin.Wesettheinputarrival
investigationrevealsthatperformanceimprovementmainlycome rate of both input streams to 12800 tuples/msec and vary the
fromtwoaspects.First,whenmultipletuplesofthesamekeyare window length from 500 to 2500 msec. The throughput results
sorted,theyareallocatedsequentiallyandcache-alignedinmemory. areshowninFigure14a.Wecanseethatthethroughputofall
Thissignificantlyincreasesmemorybandwidthwhentheyarelater E algorithmsalmostremainssimilarwithincreasingw indicating
revisitedduringthematchingphase.Second,duringmatching,the thattheamortizedexecutioncostperinputtupleisnotimpacted
cachereusesincreaseinsort-basedalgorithms,aseachinputtuple significantly by w. As the throughput remains constant, the
producesmultiplematchesduetokeyduplication.Thoseresults increasingprocessinglatencyshowninFigure14bbindicatesthat
refreshtheunderstandingoftheapplicabilityofthosesort-based R moreinputtuplesarequeuingupwithlargervaluesofw.Thisalso
joinalgorithms,whicharenotcapturedinpriorwork[5]. explainstheslightdecreaseinthroughputoftheeageralgorithms.
ImpactofArrivalSkewness(skewts).Toquantifytheimpacts When there are increasingly more input tuples arriving at the
ofthearrivalskewness,weadoptaZipf-distributiongeneratorto system and being queued up, the footprint between invocation
generatetuples.Wesetthearrivalrateto1600tuples/msecandfix ofthesametuplealsoincreasesresultinginmorecachemisses.
P
thewindowlengthto1000msecforbothinputstreamssuchthat
|     |     |     |     |     |     |     |     | 5.5 ImpactofAlgorithmConfigurations |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- | --- |
thetotalnumberofinputtuplesremainsthesame.Weexamine
thecasewheremoretuplesbearthesametimestampsasinthe In this section, we study the impact of tuning knobs including
earlytuplesofinputstreamswithincreasingskewts.Theresults (i)sortingstepsizeδ,(ii)groupsizeдoftheJBscheme,(iii)the
areshowninFigure12.Weomittheresultsofprocessinglatencyas impactofphysicalpartitioningduringworkloaddistribution,and
itremainsalmostunchangedinallalgorithmswithvaryingarrival (iv)numberofradixbit#r.WeuseMicrotoconductthissetof
| distributions |     | because of | the low | input arrival | rates. | Among | all |     |     |     |     |     |     |
| ------------- | --- | ---------- | ------- | ------------- | ------ | ----- | --- | --- | --- | --- | --- | --- | --- |
experimentsandassumethatalltuplesareinstantlyavailableto
algorithms,onlySHJJMissensitivetovaryingarrivaldistributions.
|     |     |     |     |     |     |     |     | be processed | to  | eliminate | the impact | of wait. | To facilitate the |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | --------- | ---------- | -------- | ----------------- |
In particular, the throughput gradually increases when skewts comparisonswithexistingresults[5],thetotalnumbersoftuples
exceeds1.2andachievesthehighestthroughputat1.6.Thereason fromRandSaresetto128·105and128·106,respectively.
isthatitcanutilizethehardwareresourcesasearlyaspossible.This Varyingsortingstepsize(δ).InPMJ,sortingstepsizecontrols
isreaffirmedbytheprogressiveevaluationresultsinFigure12b.
theportionoftuplestoacquirebeforethesystemstartssorting(and
ImpactofKeySkewness(skew key ).Wesetinputarrivalrates subsequentlyjoining).Figure15showsanontrivialrelationship
ofbothinputstreamstobe12800tuples/msec,thewindowlength between overall processing cost and sorting step size. A small
tobe1000msecandauniformarrivaldistribution.Theresultsare δ allows the system to wait for a shorter period of time before
showninFigure13.WecanseethatonlyPRJislesstoleranttokey
generatinganymatchesbutitmaybringmoreoverheadincluding
skewness.PRJreliesonrecursivelyrepartitioningtheinputtuples
morecontextswitchingandmoresubsetstomerge.Incontrast,
fromRuntilasinglepartitioncanfitintotheL1cache.Subsequently, a large δ essentially defeats the purpose of eagerly processing
onlyonethreadwillworkonasinglepartition.Duetothehighkey input streams. A suitableδ (20% in our experiment) brings the

SIGMOD’21,June20–25,2021,Shaanxi,China ShuhaoZhang,YancanMao,JiongHe,PhilippM.Grulich,SteffenZeuch,BingshengHe,RichardT.B.Ma,andVolkerMarkl
2.3
1.2
0.0
10% 20% 30% 40% 50%
sorting step size
T
N
I
R
P
E
R
P
elput
tupni
rep
selcyc
join merge sort ×102
6.3
3.1
0.0
1 2 4 8
group size
Figure 15: Impact of sorting step size (δ)
ofPMJ.
tupni
rep
selcyc
probe merge sort partition
×102 6.2
3.1 JM
0.0
1 2 4 8
group size
(a)PMJJB
tupni
rep
selcyc
probe build partition
×102
JM
(b)SHJJB
Figure16:Impactofgroupsize(д).
optimalperformanceofbothgeneratingpreliminaryresultsearly 1.6
andachievinghigheroverallthroughput.Fortheprocessinglatency,
ourexperimentalresultsshowthatitdoesnotchangeonvarying 0.8
δ.Thisisbecausetheprocessinglatencyinworst-casescenario
is only affected by matches that are generated mostly in the 0.0
partition build probe overall
merge phase. For simplicity, we omit further details of latency
andprogressivenessevaluationofthisexperiment.
Varyinggroupsize(д).Groupsizeisakeyparameterofthe
JBpartitioningscheme.Whenд=1,JBschemebecomesastrictly
hash-partitioningschemewhereinputstreamsarehashpartitioned
amongthreadsbytheirprimarykeys.Whenдequalsthenumberof
threadssuchthatthereisonlyasinglecoregroup,JBbecomesthe
JMschemeandweassumeRisreplicatedwhileitstillpartitionsS
amongthreads.Hence,theworkloadincreasesineachthreadwith
anincreasingд.Weevaluatetheimpactofvaryingдbyusingboth
PMJandSHJ.Figure16showstheevaluationresults.Thehorizontal
lineshowstheperformancewhentheJMschemeisappliedinstead.
TheevaluationresultsconfirmouranalysisoftheJBschemewhere
increasinggroupsizealsoincreasesworkloads.However,theJM
schemealwaysachievesbetterperformanceduetothesignificant
partitioningoverheadinJBschememakingthetuningofJBless
useful. Note that this contrasts with the observation made in
prior work [29] due to the significant difference in the testing
environment.
Impact of Physical Partitioning. During the workload
partitioningphaseoftheeageralgorithms,wecaneitherpassthe
pointerorvalueofeachtupletothreads.Passingpointersisfaster,
butitmayleadtopotentialoverheadinsubsequentphases. To
evaluateitsperformanceimpact,weuseSHJJM asanexamplein
thisexperiment.Figure17showsacleartradeoffamongthecostof
differentphases.Ontheonehand,itisexpectedthatdistributing
thevalueoftuple(w/partitioning)incursmorepartitioningcost.
Ontheotherhand,physicalpartitioningresultsinbettercache
behaviourduringbuildandmergephases.Inourexperiment,we
observethatbothconfigurationsleadtosimilaroverallperformance
overourselectedbenchmarkworkloads.Hence,wesimplyapply
the configuration of passing pointers in all other experiments.
In future work, we plan to extend our study to include more
workloadsandhardwareplatformstobettercomprehendwhen
physicalpartitioningshouldbeappliedintheeageralgorithms.
Varyingnumberofradixbits(#r).Thenumberofradixbitsis
themostimportantparameterofPRJ,whichtradesoffpartitioning
costandprobecost[6].Wevary#r from8to18andtheresults
are shown in Figure 18. Our experimental results confirm the
tupni
rep
selcyc
×102
w/ Partition
w/o Partition
Figure17:ImpactofphysicalpartitioningofSHJJM.
2.8
1.4
0.0
8 10 12 14 16 18
number of radix bits
elput
tupni
rep
selcyc
×101
probe
partition
Figure18:Impactofnumberofradixbits(#r)ofPRJ.
observationsmadeinpreviouswork[6]andweexperimentally
determinethesuitablevalueof#r tobe10forPRJinourmachine.
5.6 ImpactofModernHardware
In this section, we first analysis how algorithms interact with
modern multicore processors. Then, we show how evaluation
resultsmaychangeundervarioushardwareconfigurations.
Micro-architecturalAnalysis.WetakeRovioasanexample
to show the breakdown of the execution time according to the
Intel Manual [20]. Figure 19a compares the time breakdown of
differentjoinalgorithms.Wemeasurethehardwareperformance
counters during the algorithm execution, and compute the top-
downmetics[53]. Wehavethreemajorobservations. First,the
breakdownresultsreaffirmourpreviousanalysisthatsorting-based
joinalgorithmsworkmoreefficientlyforRoviobecauseofitshigh
keyduplicationfeature.Inparticular,MWayandMPassshowhigh
instructionretiringrateandnegligibleCoreBound andMemory
Bound.NPJismorememoryboundthanPRJ.Thereasonsaretwo
folds: i) NPJ involves high L1 and L2 cache miss overhead due
totheaccessconflictofthesharedhashtable;ii)thesizeofthe
sharedhashtableinNPJexceedsL3sizesignificantly;thus,resulting
insignificantL3missoverhead.Duetothesamereason,ahigh
L3 cache miss issue is also observed in SHJJM and SHJJB when
handlingtheRovioworkload.Second,althoughPMJisalsoasort-
basedalgorithm,itshowsamuchhigherCoreBoundcomparedto
MWayandMPass.Thisisbecauseofthefrequentfunctioncallsas
PMJrepeatedlyacquiresnewtuplesfrominputstreamstoprocess
andthusoverloadstheout-of-orderexecutionunits.Suchaneager
naturealsoleadstoahigherMemoryBoundinalleageralgorithms

ParallelizingIntra-WindowJoinonMulticores:AnExperimentalStudy SIGMOD’21,June20–25,2021,Shaanxi,China
| due to cache | thrashing. | Third, another | interesting |     | observation |     |     |          |            |     |                |     |
| ------------ | ---------- | -------------- | ----------- | --- | ----------- | --- | --- | -------- | ---------- | --- | -------------- | --- |
|              |            |                |             |     |             |     |     | Retiring | Core Bound |     | Frontend Bound |     |
isthattheJBschemeleadstoahigherCoreBound thanJM.We Bad Speculation Memory Bound
emit fo egatnecrep 100
observethatthisisduetotheadditionalshufflephaseintheJB
80
| scheme resulting | in a | more complex | instruction |     | flow involving |     |     |     |     |     |     |     |
| ---------------- | ---- | ------------ | ----------- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
60
moredependencies.
40
Figure19billustratesmemoryconsumptionofallalgorithms
20
| overtime.Therearetwomajortakeaways.First,wecanseethat |     |     |     |     |     |     | 0   |          |       |     |     |     |
| ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | -------- | ----- | --- | --- | --- |
|                                                       |     |     |     |     |     |     | NPJ | PRJ MWAY | MPASS |     |     |     |
the eager algorithms consume more memory compared to lazy SHJJM SHJJB PMJJM PMJJB
ones.Thereasonisthatalthoughtheinputtuplemaybeconsumed
|     |     |     |     |     |     |     |     | (a)ExecutionTimeBreakdown T |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------- | --- | --- | --- | --- |
immediately,itcannotbeeliminatedasatuplemayberevisited
laterduetothepointer-basedpassingmechanism(seeSection5.5).
|     |     |     |     |     |     |     | 1.4 ×106 |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- |
Thatistosay,botheagerandlazyalgorithmshavetoaccumulate
Lazy:
|                                                          |     |     |     |     |     |     | )bk( egasu yromem |     |     |     | NPJ |     |
| -------------------------------------------------------- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- |
| inputtuplesinmemory.Furthermore,alleageralgorithmsneedto |     |     |     |     |     |     |                   |     |     |     | PRJ |     |
MWAY
maintainadditionalstoragespaceforholdingextradatastructures. N MPASS
Specifically,SHJneedstomaintaintwohashtablesforbothinput 0.7 Eager:
SHJJM
streamsandPMJneedstokeepsortedsublistsduringprocessing. SHJJB
| ComparingPMJJB | andPMJJM,wecanseethatJMleadstohigher |     |     |     |     |     |     |     |     |     | PMJJM |     |
| -------------- | ------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- |
PMJJB
L3 Cache
| memoryconsumptionthanJB.Thismatchesfindingsfromprevious |     |     |     |     |     |     | 0.0  |         |     |         |     |     |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | ---- | ------- | --- | ------- | --- | --- |
|                                                         |     |     |     |     |     |     | 10 1 | 100 101 |     | 102 103 |     |     |
work[29]asJBonlypartiallyreplicatesthepartitionofStoagroup time(s)
I
ofthreads.However,thisdifferenceisnotobviousbetweenSHJJB
(b)MemoryConsumption
andSHJJMasthesizeofthemaintainedhashtableofonestream
|     |     |     |     |     | R   | Figure19:Micro-architecturalAnalysisonRovio. |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | -------------------------------------------- | --- | --- | --- | --- | --- | --- |
(e.g.,R)alreadyexceedsL3cachesizesignificantlyandthusleading
tohighmemoryconsumptioninbothalgorithms.JBconsumeseven
Table5:Countersperinputtuple(Rovio)
morememoryinitiallybecauseoftheadditionalstatusmaintenance, SHJJM SHJJB PMJJM PMJJB
|     |     |     |     |     |     |     | NPJ | PRJ MWay | MPass |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----- | --- | --- | --- |
whileJMconsumesmorememorylaterbecauseofthegrowing TLBDMisses 0.686 0.027 0.020 0.028 1.312 2.144 0.764 0.172
|             |            |               |     |                 |      | TLBIMisses | 0.740  | 0.037 0.009 | 0.010 | 2.431 3.361   | 0.450 | 0.436 |
| ----------- | ---------- | ------------- | --- | --------------- | ---- | ---------- | ------ | ----------- | ----- | ------------- | ----- | ----- |
| size of the | hash table | of S. Second, | the | lazyPalgorithms | have |            |        |             |       |               |       |       |
|             |            |               |     |                 |      | L1IMisses  | 15.976 | 1.590 0.212 | 0.222 | 24.904 26.445 | 3.636 | 1.554 |
similar memory consumption. Sort-based ones (i.e., MPass and L1DMisses 17529.971 541.168 2442.201 2438.575 17238.905 14540.641 1151.674 685.827
|     |     |     |     |     |     | L2Misses | 6566.433 | 10.145 0.238 | 0.310 | 5080.151 4445.801 | 63.268 | 27.975 |
| --- | --- | --- | --- | --- | --- | -------- | -------- | ------------ | ----- | ----------------- | ------ | ------ |
MWay)consumeslightlymorememoryastheyrequireadditional
|     |     |     |     |     |     | L3Misses    | 3028.627 | 0.038 0.020 | 0.052 | 3854.870 3691.542 | 0.249 | 0.446 |
| --- | --- | --- | --- | --- | --- | ----------- | -------- | ----------- | ----- | ----------------- | ----- | ----- |
|     |     |     |     |     |     | BranchMisp. | 1.571    | 0.515 1.008 | 0.873 | 5.257 3.994       | 1.000 | 1.179 |
spaceforintermediatedataduringshufflingandmergingphases. Instr.Exec. 8876.563 8793.415 3202.879 3205.110 17763.657 14809.760 17723.712 14649.200
NPJconsumesmorememorythanPREJasthesizeofthesharedhash Table6:Resourceutilization(Rovio)
tablesignificantlyexceedsthelastlevelcache.Thisresultreaffirms
|                                    |     |     |         |     |     |            | NPJ    | PRJ MWay    | MPass | SHJJM  | SHJJB PMJJM  | PMJJB |
| ---------------------------------- | --- | --- | ------- | --- | --- | ---------- | ------ | ----------- | ----- | ------ | ------------ | ----- |
| thepreviousanalysisofthedrawbackof |     |     | NPJ[5]. |     |     |            |        |             |       |        |              |       |
|                                    |     |     |         |     |     | Mem.BW.(%) | 19.093 | 0.144 0.302 | 0.480 | 23.978 | 20.306 1.444 | 0.473 |
Table5showsthehardwareperformancecountersperinput
|     |     |     |     |     |     | CPU.Util.(%) | 98.456 | 24.606 55.346 | 59.163 | 99.045 | 80.431 97.287 | 90.752 |
| --- | --- | --- | --- | --- | --- | ------------ | ------ | ------------- | ------ | ------ | ------------- | ------ |
reaffirmsRour
| tuple, which |     | previous | findings. | For | example, NPJ |     |     |     |     |     |     |     |
| ------------ | --- | -------- | --------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
showshighcachemissesbecauseofthesizeofthesharedhash
|     |     |     |     |     |     |     |     | Stock Rovio |     | YSB | DEBS |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --- | ---- | --- |
tableislargerthanthecachesize,almosteveryaccesstothehash
|               |            |                    |     |           |            | .tpT dezilamroN 8.0 |     |     |     | .tpT dezilamroN 8.0 |     |     |
| ------------- | ---------- | ------------------ | --- | --------- | ---------- | ------------------- | --- | --- | --- | ------------------- | --- | --- |
| table results | in a cache | miss. Furthermore, |     | all eager | algorithms |                     |     |     |     |                     |     |     |
experiencePsignificantcachemissesduringtheprobephaseasthey
|     |     |     |     |     |     | 4.0 |     |     |     | 4.0 |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
requiremoreinstructionspertupleprocessingduetotheireager
nature.Table6furthershowsthehardwareresourceutilization
|     |     |     |     |     |     | 0.0 |     |     |     | 0.0 |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
among different algorithms. Except for NPJ, all lazy algorithms 1 2 4 8 1 2 4 8
|     |     |     |     |     |     |     | Number of threads |     |     | Number of threads |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | ----------------- | --- | --- |
generallyshowrelativelylowerCPUutilizationbecausetheyneed
(b)SHJJM(Eager)
to wait until all data arrive, resulting in a significant idle time. (a)MPass(Lazy)
TheNPJconsumesalargeportionofCPUcyclesindealingwith Figure20:Impactofmulticores.
andDEBS,SHJJMscalesslightlybetter.Weobservethatthisisdue
cachemissesandhenceshowhighCPUutilization.Duetotheir
aggressiveprocessnature,theeageralgorithmsgenerallyconsume toitseagernature,whichaggressivelyutilizesavailablehardware
moreresourcesintermsofbothCPUandmemorybandwidth.This resourceswheneverpossible(i.e.,assoonasanyinputtuplesarrive).
indicatesthatincreasingmemorybandwidthandCPUpowercan Incontrast,MPasscanonlystarttoutilizeallresourceswhenall
further improve their performance. We will confirm this in the inputtuplesareready.
subsequentmulticorescalabilitystudy. ImpactofSIMD.AVXutilizesCPUregisterstoperformaSingle
MulticoreScalability.Wenowshowthemulticorescalability InstructiononMultiplepiecesofData(SIMD)toacceleratedata
in terms of throughput. Our experiments show that MPass has processing.WenowexaminetheeffectofAVXinstructionsets
lightlybetterscalabilitycomparedtoMWay.Hence,wetakeMPass usedinMWay,MPass,PMJJMandPMJJB.Notethat,ourbenchmark
andSHJJMasexamplestorepresentthelazyandeagerapproach
currentlyonlyutilizeAVX-256(inheritedfromtheexistingcodebase
here. The results are shown in Figure 20. As expected, both frompreviouswork[5]),furthersupportingAVX-512isexpected
algorithmsarenotaffectedbyvaryinghardwareresourceswhen tobringmoreperformanceimprovementbutleftasfuturework.
handlingStockandYSBasthesystemisunderutilized.ForRovio We use Micro (static datasets) in this study. Figure 21 clearly

SIGMOD’21,June20–25,2021,Shaanxi,China ShuhaoZhang,YancanMao,JiongHe,PhilippM.Grulich,SteffenZeuch,BingshengHe,RichardT.B.Ma,andVolkerMarkl
8.4
4.2
0.0 MWAY M (A W V A X Y ) (C++ M S P T A L S ) S M ( P A A V S X S ) (C++ P M ST JJM L) ( P A M V JJ X M ) (C++ P S M T JJ L B ) ( P A M V J X JB ) (C++ STL)
T
N
I
R
P
E
R
P
tupni
rep
selcyc
×101 by better utilizing specialized hardware architectures such as
GPU [30, 44], FPGA [10, 17] and high-bandwidth memory [36].
merge
sort Thecommongoalistofindaschemethatminimizestheoverall
join processing time by wisely managing the balance between
computationandcommunication/partitioningcostamongdifferent architectures. All those join algorithms are covered by our
concernedalgorithmdesignaspectsincludingeager/lazy,sort/hash,
Figure21:ImpactofSIMD.
andvariouspartitioningschemes,butwithnovelimplementations
demonstratesthebenefitofutilizingSIMDinreducingthecost suchasspecializeddatapartitioningschemesfornovelhardware
ofsorting.ItalsoreducesthecostofmergingslightlyinMPass architectures [30, 36, 44] andadaptive partitioningmodels [25].
and MWay. The overall improvement varies from 1.2x to 2.5x, All those works are highly valuable, but none of them has
whichmatchestheobservationsfromtheexistingstudy[5].The comprehensivelyevaluateddifferentapproachestoparallelizeIaWJ
improvementfromSIMDonPMJJM andPMJJB islesssignificant onmodernmulticores.Nevertheless,ouropen-sourcedbenchmark
(1.2x)asitismainlymemoryboundedforhandlingthisworkload. enablesthecommunitytoevaluatemoreworkloads,joinalgorithms,
Thus,tofurtherimprovetheperformanceof PMJ,onehastofocus andhardwareplatformsinfuture.Schuhetal.[41]recentlystudied
moreonimprovingitsdataaccesspattern. 13relationaljoinimplementationvariants,wherePRJandMWay
aretreatedasthestate-of-the-artgeneralpurposehash-orsort-
6 RELATEDWORK
basedrelationaljoinalgorithms,respectively.BothPRJandMWay
Inthissection,wereviewrelatedworkandrevealthelimitations havebeenincludedintoourbenchmarkastherepresentativelazy
thatmotivatethiswork. algorithms.Schuhetal.[41]havefurtherproposedtwoPRJvariants
StreamJoins.Forspecificstreamjoinalgorithms,priorworks (calledPRLiSandPRAiS,respectively)andonenovelalgorithm
suchas[34,40,46]haveexploreddifferentwaystoutilizemulti- calledChunkedParallelRadixpartition(CPRL).Thesealgorithms
core or many-core processors, but their primary concern is to areespeciallyoptimizedtowardsNUMA,andhavedemonstrated
efficientlyandincrementallyprocesssubsequentslidingwindows. excellentperformanceonmulti-socketservers.Inthispaper,we
For example, the handshake join [46] and SplitJoin [34] are focusonsinglesocketmulticoreprocessorsandleavetheevaluation
proposed to better utilize modern multicore architectures with ofNUMAoptimizationsuchasCPRLtofuturework.
adataflowmodel,whereeachjoincorehastoconstantlyupdateits
7 CONCLUSION
internalstate.TherecentlyproposedIBWJ[42]acceleratesinter-
windowjoin byutilizingasharedindexstructure,whichbrings Inthispaper,wepresentresultsfromanextensiveexperimental
performancegainsduringtuplematchingbutbringsevenhigher analysis of existing join algorithms across both relational join
state maintenance costs as the shared index structure needs to algorithms (i.e., the lazy approach) and specific stream join
be constantly updated during processing. In contrast, we focus algorithms (i.e., the eager approach) for parallelizing the intra-
on intra-window join (IaWJ), assuming there is no subsequent window join (IaWJ) operation on modern multicore processors.
windows at all. The inter- and intra-window joins have a very Withacomprehensivesetofworkloads,ourexperimentalresults
differentdesigngoalandarehardlycomparable.Tovalidateour highlightmanyimportantinsightsthathavenotbeendiscussed
analysis, we have implemented and evaluated the handshake inpreviousstudies.Insummary,wefindthatnoneoftheexisting
join[46]andobservedthatitleadstoordersofmagnitudelower join algorithms performs best in all cases for parallelizing the
throughputthananyoftheeightalgorithmsthatwehaveevaluated. IaWJ operation.Workloadcharacteristics,performancemetrics,
This is due to the additional overhead for maintaining window andhardwarearchitecturesshouldbeconsideredwhenapplying
updates.EarlyworkofIaWJhistoricallyfocusesonitssingle-thread the right implementation. Based on our analysis, we have also
executionefficiency[13,52]andisnolongersuitableonmodern proposedadecisiontreethatcanbeusedtoguidetheselectionof
multicore architectures. Recent studies [14, 29] have proposed anappropriatealgorithm.
parallel IaWJ algorithms by wisely distributing input tuples of Thisworkhighlightsanumberofdirectionsforfuturework:
the same window among parallel threads without considering (i)thereisaneedfordevelopinganadaptiveIaWJalgorithmthat
windowupdates.Differentfromthem,ourstudyisthefirstattempt considersallthefactorsincludingworkload,metricsandhardware,
to systematically evaluate different approaches (including both (ii) it is important to further extend this study to include more
relationaljoinalgorithmsandspecificstreamjoinalgorithms)to hardwarearchitecturessuchasNUMA,HBM,GPUs,andFPGAs,
parallelizeIaWJ onmodernmulticoreprocessors.Itmightbean and(iii)oursuccessfulattemptofusingrelationaljoinalgorithmsto
interestingfutureworktoaccelerateinter-windowjoinonmodern acceleratejoiningoverdatastreamsindicatesthegreatpotentialof
multicorearchitecturesbyutilizingefficientIaWJ algorithmsas jointeffortsfromdifferentcommunitiestobettersupportmodern
buildingblockswhiletakingthesharedworkloadamongsliding dataintensivestreamapplications.Thisisageneralproblemwith
windowsintoconsideration,butisbeyondthescopeofthiswork. lotsofpotentialforwhichwelaythefoundationwiththispaper.
RelationalJoins.Tooptimizerelationaljoins,pastworkshave
ACKNOWLEDGMENTS
explored the usage of SIMD instructions [26], cache- and TLB-
aware data replication [5, 6], memory-efficient hash table [7] ThisworkwasfundedbytheDFGPriorityProgram(MA4662-5),
andNUMA-awaredataplacementstrategies[3].Extensiverecent andbytheGermanMinistryforEducationandResearchasBIFOLD
efforts have also been devoted to accelerating join processing (ref.01IS18025Aandref.01IS18037A).

ParallelizingIntra-WindowJoinonMulticores:AnExperimentalStudy SIGMOD’21,June20–25,2021,Shaanxi,China
REFERENCES
[28] RamonLawrence.2005. EarlyHashJoin:AConfigurableAlgorithmforthe
[1] 2018.IntervalJoininApacheFlink,https://ci.apache.org/projects/flink/flink-docs- EfficientandEarlyProductionofJoinResults.InProc.VLDB.841–852.
stable/dev/stream/operators/joining.html. LastAccessed:2020-09-17. [29] QianLin,BengChinOoi,ZhengkuiWang,andCuiYu.2015.ScalableDistributed
[2] 2018.ShanghaiStockExchange,http://english.sse.com.cn/. StreamJoinProcessing.InProc.SIGMOD.841–852.
[3] Martina-CezaraAlbutiu,AlfonsKemper,andThomasNeumann.2012.Massively [30] ClemensLutz,SebastianBreß,SteffenZeuch,TilmannRabl,andVolkerMarkl.
ParallelSort-MergeJoinsinMainMemoryMulti-CoreDatabaseSystems.Proc. 2020. Pump Up the Volume: Processing Large Data on GPUs with Fast
VLDBEndow.5,10(June2012),1064–1075. Interconnects.InProc.SIGMOD.1633–1649.
[4] JieliangAng,TianyuanFu,JohnsPaul,ShuhaoZhang,BingshengHe,Teddy [31] TizianoMatteisandGabrieleMencagli.2017.ParallelPatternsforWindow-Based
SisonDavidWenceslao,andSienyiTan.2019.TraV:anInteractiveTrajectory StatefulOperatorsonDataStreams:AnAlgorithmicSkeletonApproach.Int.J.
ExplorationSystemforMassiveDataSets.InProc.BIGMM.309–313. ParallelProgram.45,2(April2017),382–401.
[5] CagriBalkesen,GustavoAlonso,JensTeubner,andM.TamerÖzsu.2013.Multi- [32] MohamedF.Mokbel,MingLu,andWalidG.Aref.2004. Hash-MergeJoin:A
c 2 o 0 r 1 e 3 , ), M 8 a 5 i – n 9 - 6 m . emoryJoins:Sortvs.HashRevisited.Proc.VLDBEndow.7,1(Sept. N 25 o 1 n – - . blockingJoinAlgor T ithmforProducingFastandEarlyJoinResults.InICDE.
[6] C.Balkesen,J.Teubner,G.Alonso,andM.T.Özsu.2013.Main-memoryhash [33] ReneMueller,JensTeubner,andGustavoAlonso.2012. SortingNetworkson
joinsonmulti-coreCPUs:Tuningtotheunderlyinghardware.InICDE.362–373. FPGAs.TheVLDBJournal21,1(Feb.2012),1–23.
[7] R.Barber,G.Lohman,I.Pandis,V.Raman,R.Sidle,G.Attaluri,N.Chainani,S. [34] MohammadrezaNajafi,MohammadSadoghi,andHans-ArnoJacobsen.2016.
Lightstone,andD.Sharpe.2014.Memory-EfficientHashJoins.Proc.VLDBEndow. SplitJoin:AScalable,Low-latencyStreamJoinArchitecturewithAdjustable
8,4(Dec.2014),353–364. OrderingPrecision.InATC.493–505.
[8] SpyrosBlanas,YinanLi,andJigneshM.Patel.2011.DesignandEvaluationof [35] PinNterest.2020.Pinterest,https://www.pinterest.com/. LastAccessed:2020-11-23.
MainMemoryHashJoinAlgorithmsforMulti-CoreCPUs.InProc.SIGMOD. [36] ConstantinPohl,Kai-UweSattler,andGoetzGraefe.2019. Joinsonhigh-
37–48. bandwidthmemory:anewlevelinthememoryhierarchy.TheVLDBJournal
[9] ParisCarbone,AsteriosKatsifodimos,StephanEwen,VolkerMarkl,SeifHaridi, (2019),1–21.
andKostasTzoumas.2015.Apacheflink:Streamandbatchprocessinginasingle [37] LinuxProject.2020.PerformanceanalysistoolsforLinux,https://man7.org/linux/
engine.IEEEDataEng.Bull.36,4(2015). man-pages/man1/perf.1.html. LastAccessed:2020-11-24.
[10] XinyuChen,YaoChen,RonakBajaj,JiongHe,BingshengHe,Weng-FaiWong, [38] YuanQiu,SerafeimPapadias,andKeYi.2019.StreamingHyperCube:AMassively
andDemingChen.2020.IsFPGAUsefulforHashJoins?.InCIDR. IParallelStreamJoinAlgorithm.InEDBT.642–645.
[11] JatinChhugani,AnthonyD.Nguyen,VictorW.Lee,WilliamMacy,Mostafa [39] Rovio.2019. CreatoroftheAngryBirdsgame,http://www.rovio.com/. Last
Hagog,Yen-KuangChen,AkramBaransi,SanjeevKumar,andPradeepDubey. Accessed:2020-06-29.
2008.EfficientImplementationofSortingonMulti-CoreSIMDCPUArchRitecture. [40] PratanuRoy,JensTeubner,andRainerGemulla.2014.Low-latencyHandshake
Proc.VLDBEndow.1,2(Aug.2008),1313–1324. Join.Proc.VLDBEndow.7,9(May2014),709–720.
[12] SanketChintapalli,DerekDagit,BobbyEvans,RezaFarivar,ThomasGraves, [41] StefanSchuh,XiaoChen,andJensDittrich.2016.AnExperimentalComparison
MarkHolderbaugh,ZhuoLiu,KyleNusbaum,KishorkumarPatil,BoyangJerry ofThirteenRelationalEqui-JoinsinMainMemory.InProc.SIGMOD.1961–1976.
Peng,etal.2016.Benchmarkingstreamingcomputationengines:Storm,flink [42] AmirhesamShahvaraniandHans-ArnoJacobsen.2020. ParallelIndex-Based
andsparkstreaming.InIPDPSW.IEEE,1789–1792. StreamJoinonaMulticoreCPU.InProc.SIGMOD.2523–2537.
[13] Jens-PeterDittrich,BernhardSeeger,DavidScotTayloPr,andPeterWidmayer. [43] shuhaoZhang.2020.OurBenchmarkSuite,https://github.com/ShuhaoZhangTony/
2002. ProgressiveMergeJoin:AGenericandNon-blockingSort-basedJoin AllianceDB. LastAccessed:2020-11-10.
Algorithm.InProc.VLDB.299–310. [44] P.Sioulas,P.Chrysogelos,M.Karpathiotakis,R.Appuswamy,andA.Ailamaki.
[14] MohammedElseidy,AbdallahElguindy,AleksandarVitorovic,andChristoph 2019.Hardware-ConsciousHash-JoinsonGPUs.InICDE.698–709.
Koch.2014. ScalableandAdaptiveOnlineJoins. Proc.VLDBEndow.7,6(Feb. [45] YufeiTao,ManLungYiu,DimitrisPapadias,MariosHadjieleftheriou,andNikos
2014),441–452. E Mamoulis.2005.RPJ:ProducingFastJoinResultsonStreamsThroughRate-based
[15] VincenzoGulisano,ZbigniewJerzak,SpyrosVoulgaris,andHolgerZiekow.2016. Optimization.InProc.SIGMOD.371–382.
TheDEBS2016grandchallenge.InProc.DEBS.ACM,289–292. [46] JensTeubnerandReneMueller.2011. HowSoccerPlayersWouldDoStream
[16] PeterJ.HaasandJosephM.Hellerstein.1999.RippleJoinsforOnlineAggregation. Joins.InProc.SIGMOD.625–636.
SIGMODRec.28,2(June1999),287–298. [47] GeorgiosTheodorakis,AlexandrosKoliousis,PeterPietzuch,andHolgerPirk.
[17] RobertJHalstead,IldarAbsalyamov,WalidANajjar,andVassilisJTsotras.2015. 2020.LightSaber:EfficientWindowAggregationonMulti-CoreProcessors.In
FPGA-basedMultithreadRingforIn-MemoryHashJoins.InCIDR. Proc.SIGMOD.2505–2521.
[18] JiongHe,ShuhaoZhang,andBingshengHe.2014.In-CacheQueryCo-Processing [48] AnkitToshniwal,SiddarthTaneja,AmitShukla,KarthikRamasamy,JigneshM
onCoupledCPU-GPUArchitectures.Proc.VLDBEndow.8,4(Dec.2014),329–340. Patel,SanjeevKulkarni,JasonJackson,KrishnaGade,MaosongFu,JakeDonham,
[19] Intel.1997.ReadTime-StampCounter,https://c9x.me/x86/html/file_module_x86_ etal.2014.Storm@twitter.InProc.SIGMOD.147–156.
id_278.html. LastAccessed:2020-06-29. [49] JonasTraub,PhilippM.Grulich,AlejandroRodriguezCuellar,SebastianBreß,
[20] Intel.2016. Intel64andIA-32ArchitecturesoptimizationReferenceManual, AsteriosKatsifodimos,TilmannRabl,andVolkerMarkl.2019.EfficientWindow
https://w P ww.intel.com/content/dam/www/public/us/en/documents/manuals/64- AggregationwithGeneralStreamSlicing.InEDBT.97–108.
ia-32-architectures-optimization-manual.pdf. [50] TolgaUrhanandMichaelJFranklin.2000.Xjoin:Areactively-scheduledpipelined
[21] Intel.2017.IntelPerformanceCounterMonitor,2017,https://software.intel.com/en- joinoperatory`.BulletinoftheTechnicalCommitteeon(2000),27.
us/articles/intel-performance-counter-monitor. LastAccessed:2020-06-29. [51] ShivaramVenkataraman,AurojitPanda,KayOusterhout,MichaelArmbrust,Ali
[22] GabrielaJacques-Silva,RanLei,LuweiCheng,GuoqiangJerryChen,Kuen Ghodsi,MichaelJ.Franklin,BenjaminRecht,andIonStoica.2017.Drizzle:Fast
Ching,TanjiHu,YuanMei,KevinWilfong,RithinShetty,SerhatYilmaz,Anirban andAdaptableStreamProcessingatScale.InProc.SOSP.374–389.
Banerjee,BenjaminHeintz,ShridarIyer,andAnshulJaiswal.2018.Providing [52] A.N.WilschutandP.M.G.Apers.1991.Dataflowqueryexecutioninaparallel
StreamingJoinsasaServiceatFacebook.Proc.VLDBEndow.11,12(Aug.2018), main-memoryenvironment.InProc.ICPADS.68–77.
1809–1821. [53] A.Yasin.2014. ATop-Downmethodforperformanceanalysisandcounters
[23] JeyhunKarimov,TilmannRabl,AsteriosKatsifodimos,RomanSamarev,Henri architecture.InISPASS.35–44.
Heiskanen,andVolkerMarkl.2018. Benchmarkingdistributedstreamdata [54] SteffenZeuch,AnkitChaudhary,BonaventuraDelMonte,HaralamposGavriilidis,
processingsystems.InICDE.IEEE,1507–1518. DimitriosGiouroukis,PhilippM.Grulich,SebastianBreß,JonasTraub,andVolker
[24] ParagKesarandBenLiu.2019.Real-time-experiment-analytics-at-pinterest-using- Markl.2020.TheNebulaStreamPlatformforDataandApplicationManagement
apache-flink,https://medium.com/pinterest-engineering/real-time-experiment- intheInternetofThings.InCIDR.
analytics-at-pinterest-using-apache-flink-841c8df98dc2. [55] SteffenZeuch,BonaventuraDelMonte,JeyhunKarimov,ClemensLutz,Manuel
[25] OmarKhattab,MohammadHammoud,andOmarShekfeh.2018. PolyHJ:A Renz, Jonas Traub, Sebastian Breß, Tilmann Rabl, and Volker Markl. 2019.
PolymorphicMain-MemoryHashJoinParadigmforMulti-CoreMachines.In AnalyzingEfficientStreamProcessingonModernHardware.Proc.VLDBEndow.
Proc.CIKM.1323–1332. 12,5(Jan.2019),516–530.
[26] ChangkyuKim,TimKaldewey,VictorWLee,EricSedlar,AnthonyDNguyen, [56] ShuhaoZhang,BingshengHe,DanielDahlmeier,AmelieChiZhou,andThomas
NadathurSatish,JatinChhugani,AndreaDiBlas,andPradeepDubey.2009.Sort Heinze.2017. RevisitingtheDesignofDataStreamProcessingSystemson
vs.hashrevisited:Fastjoinimplementationonmodernmulti-coreCPUs.Proc. Multi-CoreProcessors.InICDE.659–670.
VLDBEndow.2,2(2009),1378–1389. [57] ShuhaoZhang,JiongHe,AmelieChiZhou,andBingshengHe.2019.BriskStream:
[27] AlexandrosKoliousis,MatthiasWeidlich,RaulCastroFernandez,AlexanderL ScalingDataStreamProcessingonShared-MemoryMulticoreArchitectures.In
Wolf,PaoloCosta,andPeterPietzuch.2016.Saber:Window-basedhybridstream Proc.SIGMOD.705–722.
processingforheterogeneousarchitectures.InProc.SIGMOD.ACM,555–569. [58] ShuhaoZhang,FengZhang,YingjunWu,BingshengHe,andPaulJohns.2020.
Hardware-ConsciousStreamProcessing:ASurvey.SIGMODRec.48,4(Feb.2020),
18–29.