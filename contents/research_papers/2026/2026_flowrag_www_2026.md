|     | FlowRAG:     | Continual           |     | Learning   | for Dynamic |     | Retriever  | in  |
| --- | ------------ | ------------------- | --- | ---------- | ----------- | --- | ---------- | --- |
|     |              | Retrieval-Augmented |     |            | Generation  |     |            |     |
|     | SenleiZhang* |                     |     | TongjunShi |             |     | DandanSong |     |
HuazhongUniversityofScienceand FutuHoldingsLimited BeijingInstituteofTechnology
|     | Technology  |     |     | Shenzhen,China          |     |     | Beijing,China  |     |
| --- | ----------- | --- | --- | ----------------------- | --- | --- | -------------- | --- |
|     | Wuhan,China |     |     | tongjunshihhh@gmail.com |     |     | sdd@bit.edu.cn |     |
m202574111@hust.edu.cn
|     | LuanZhang |     |     | ShuhaoZhang*† |     |     | XiaofeiLiao* |     |
| --- | --------- | --- | --- | ------------- | --- | --- | ------------ | --- |
BeijingInstituteofTechnology HuazhongUniversityofScienceand HuazhongUniversityofScienceand
|     | Beijing,China    |     |     | Technology               |     |     | Technology         |     |
| --- | ---------------- | --- | --- | ------------------------ | --- | --- | ------------------ | --- |
|     | zl005888@163.com |     |     | Wuhan,China              |     |     | Wuhan,China        |     |
|     |                  |     |     | shuhao_zhang@hust.edu.cn |     |     | xfliao@hust.edu.cn |     |
HaiJin*
HuazhongUniversityofScienceand
Technology
Wuhan,China
hjin@hust.edu.cn
| Abstract |     |     |     |     | CCSConcepts |     |     |     |
| -------- | --- | --- | --- | --- | ----------- | --- | --- | --- |
Retrieval-AugmentedGeneration(RAG)enhancesLargeLanguage •Informationsystems→Retrievalmodelsandranking.
Models(LLMs)byleveragingexternalknowledge,whereretrieval
| accuracydirectlyaffectsgenerationquality.However,denseretriev- |     |     |     |     | Keywords |     |     |     |
| -------------------------------------------------------------- | --- | --- | --- | --- | -------- | --- | --- | --- |
ers,commonlyemployedinRAG,sufferdegradedperformancein
Retrieval-AugmentedGeneration,ContinualLearning,LargeLan-
| evolving | corpora where | new documents | arrive continuously | and |     |     |     |     |
| -------- | ------------- | ------------- | ------------------- | --- | --- | --- | --- | --- |
guageModel
distributionshiftsaccumulateovertime.Insuchsettings,continually
updatingretrieversiscrucial,yetconventionalretrainingiscomputa- ACMReferenceFormat:
tionallyexpensiveandoftenimpractical.Toaddressthischallenge, Senlei Zhang, Tongjun Shi, Dandan Song, Luan Zhang, Shuhao Zhang,
weproposeFlowRAG,alightweightandeffectivemethodforcon- XiaofeiLiao,andHaiJin.2026.FlowRAG:ContinualLearningforDynamic
RetrieverinRetrieval-AugmentedGeneration.InProceedingsoftheACM
tinualretrieveradaptationinevolvingcorpora.FlowRAGaugments
WebConference2026(WWW’26),April13–17,2026,Dubai,UnitedArab
theencoderwithLayer-wisePromptEmbeddingsandintroduces
Emirates.ACM,NewYork,NY,USA,11pages.https://doi.org/10.1145/
aCross-LayerFusionmechanismtocapturehierarchicalsemantic
3774904.3792361
representations.Inaddition,anovelGenerator-GuidedLossaligns
retrieverscoresandintermediaterepresentationswiththeLLM’s
generationlikelihoods,encouragingretrievaldecisionsthatareboth 1 Introduction
semanticallyrelevantandbeneficialforgeneration.Experimentson
Retrieval-AugmentedGeneration(RAG)hasbecomeawidelyac-
datasetsspanningfourdomainsdemonstratethatFlowRAG,which
|         |                  |              |                   |         | cepted approach | to enhance | the performance | of large language |
| ------- | ---------------- | ------------ | ----------------- | ------- | --------------- | ---------- | --------------- | ----------------- |
| updates | only about 0.64% | of the total | model parameters, | consis- |                 |            |                 |                   |
models(LLMs)[37,38],facilitatingtheirabilitytoretrieveandin-
tentlyoutperformsstrongbaselinesinretrievalaccuracy,generation
tegrateinformationfromtheweb(suchasWikipedia[34])orother
quality,androbustnesstoforgettinginnon-stationarysettings.We
externalknowledgebases[5,43].Byretrievingrelevantdocuments,
releasethecodeathttps://github.com/CGCL-codes/FlowRAG.git.
RAGbridgesthegapbetweenthestaticknowledgeencodedinLLM
parametersandthedynamic,continuouslyevolvingrealworld.This
*AlsowithNationalEngineeringResearchCenterforBigDataTechnologyandSystem, capabilityallowsLLMstoleverageup-to-dateanddomain-specific
ServiceComputingTechnologyandSystemLab,ClusterandGridComputingLab,
SchoolofComputerScienceandTechnology. informationwithouttheneedforextensiveretraining[17,25,32].
†ShuhaoZhangisthecorrespondingauthor(shuhao_zhang@hust.edu.cn). Aspointedoutbypreviousstudies[11,16,40],theeffectivenessof
retrievalaugmentationstronglydependsonthequalityandrelevance
oftheretrievedcontent,whichiscommonlyachievedusingdense
retrievers[5].
Denseretrieversencodequeriesanddocumentsintocontinuous
ThisworkislicensedunderaCreativeCommonsAttribution4.0InternationalLicense.
WWW’26,Dubai,UnitedArabEmirates.
semanticvectors,enablingsimilarity-basedretrievalthatcaptures
©2026Copyrightheldbytheowner/author(s).
conceptualrelevancebeyondexactlexicaloverlap[5,9,12].While
ACMISBN979-8-4007-2307-0/2026/04
https://doi.org/10.1145/3774904.3792361 thisapproachishighlyeffectiveonstaticdocumentcollections,it

WWW’26,April13–17,2026,Dubai,UnitedArabEmirates. SenleiZhangetal.
50
40
30
20
10
0
ConvQA CovidQA NewsQA NQ
Training Domain
)%(
5@CCA
40
35
30
25 20
15
10
5
0
ConvQA CovidQA NewsQA NQ
Training Domain
)%(
erocS
1F
14
12
10 8
6
4
2
0
CovidQA NewsQA NQ
Training Domain
)%(
5@CCA
25
20
15
10
5
0
CovidQA NewsQA NQ
Training Domain
)%(
erocS
1F
REPLUG End2End Atlas
(1) Retrieval ACC(left) and F1(right) on ConvQA (2) Retrieval ACC(left) and F1(right) on CovidQA
Figure1:CatastrophicforgettingofrepresentativeLLM-guidedretrievertrainingmethods(REPLUG[28],End2EndRAG[30],and
Atlas[11])undercontinuallearningacrossmultipledomains
facessignificantchallengesinreal-worldapplications,wheredoc- theeffectivenessoflayer-wisepromptembeddings,weintroduce
umentcorporaarecontinuouslyevolvingduetotechnologicalad- aCross-LayerFusionmechanism.Thisfusionenablesthemodel
vancements, societal changes, and the emergence of new topics. to blend multiple levels of representation, ensuring a more com-
Distribution shifts across domains often cause significant perfor- prehensiveunderstandingoftheevolvingcontextandimproving
mancedegradationandcatastrophicforgettingofpreviouslylearned retrievalaccuracy.(3)Generator-GuidedLoss:Toalignretrieval
knowledge [4], underscoring the need for continual learning for decisionswithLLM’sgenerationlikelihoods,weproposeanovel
retrievers. Generator-GuidedLoss.Thislossfunctionoptimizestheretriever’s
Existingapproachestocontinuallearningforretriever,suchas scoresandintermediaterepresentationstoensuretheyarenotonly
L2R [2], mainly target dense retriever fine-tuning for first-stage semanticallyrelevantbutalsoconducivetohigh-qualitygeneration.
retrieval.However,theiroptimizationistailoredforstandalonere- Thisprocessdirectlyencouragesretrievalchoicesthatsupportmore
trievalratherthanretrievalforgeneration,whichlimitstheirappli- coherentandcontextuallyappropriategenerationoutputs.
cabilityinRAGsystems.Toovercomethislimitation,LLM-guided Insummary,ourcontributionsareasfollows:
retrievertraining[11,28,30]hasrecentlyemergedasapromising • We present FlowRAG, the first method to integrate layer-wise
paradigm,wheregenerationlikelihoodsareleveragedtoprovide promptembeddingsintoRAGretrieversfordynamicadaptivity
implicitsupervisionforretrieval.Thisparadigmofferstwokeyad- andcontinuallearning.
vantages:(1)itleverageslargelanguagemodelstoprovidescalable • WeproposetheinnovativeCross-LayerFusionmechanismand
supervision,therebyreducingtherelianceoncostlyhumananno- aGenerator-GuidedLosstonotonlyenhancetheretriever’srep-
tations;and(2)itnaturallyalignsretrieverswithdownstreamgen- resentational capacity but also align retrieval choices with the
erationtasks,ensuringthatretrievedinformationdirectlyenhances generationprocess,ensuringmorecontextuallyrelevantandco-
generationquality.Despitethesebenefits,applyingLLM-guided herentoutputs.
retrievertraininginacontinuallearningsettingstillencountersthe • The experimental results across four distinct domains demon-
challengeofcatastrophicforgetting. stratethatFlowRAGconsistentlyoutperformsstrongbaselines
Tobetterunderstandtheconstraints,weconductedapreliminary intermsofretrievalaccuracy,generationquality,andresilience
studyoncurrentrepresentativeLLM-guidedretrievertrainingmeth- tocatastrophicforgetting.FurtheranalysisrevealsthatFlowRAG
ods,includingREPLUG[28],End2EndRAG[30],andAtlas[11]. maintainshighefficiency,requiringonlyapproximately0.64%
Wesequentiallytrainedtheretrieveracrossmultipledomains.As of the total model parameters to be updated in non-stationary
showninFigure1,theperformanceofallmodelsexhibitedaclear settings.ThisefficiencyunderscoresFlowRAG’spotentialasa
degradationwhenshiftingtonewdomains.Forexample,REPLUG robustsolutionfordynamicandcontinuallearning.
achievedaninitialF1of33.22%onConvQAbutdroppedto8.79%
aftertrainingonsubsequentdatasets.Similardeclineswereobserved 2 RelatedWork
forEnd2EndRAGandAtlas.Theseresultsdemonstratethatexisting
RAGRetrieverFine-tuning.Largelanguagemodelshavedemon-
methodsareunabletoretainpreviouslyacquiredknowledge,leading
stratedlimitationsineffectivelyleveragingcontext[20,39].Sev-
tocatastrophicforgettinginevolvingcorpora.
eralstudieshaveexploredimprovingtheperformanceofRetrieval-
Toaddressthischallenge,weproposeFlowRAG,alightweight
AugmentedGeneration(RAG)systemsthroughretrieverfine-tuning.
andeffectivemethodofcontinuallearningfortheretrieverinevolv-
Recenteffortshavealignedretrievertrainingwithgenerationob-
ingcorpora.FlowRAGconsistsofthreekeycomponents:(1)Layer-
jectivestoenhancetheoverallRAGpipeline.Earlymethodssuch
wisePromptEmbeddings:Buildingoninsightsfromourprelim-
as Distill-RAG [10] and End2EndRAG [30] jointly optimize the
inary results, we enhance the retriever’s encoder by introducing
retrieverandgeneratorbypropagatingthegenerationlossthrough
layer-wisepromptembeddings.Byincorporatingtheseembeddings,
cross-attentionlayers,therebyenablingretrievaldecisionsthatdi-
theretrievercanpreservepreviouslylearnedknowledgeandmiti-
rectlybenefitdownstreamgeneration.However,suchjointtraining
gatecatastrophicforgetting.(2)Cross-LayerFusion:Toenhance
canbecomputationallyexpensiveandsensitivetocorpusshifts.

FlowRAG:ContinualLearningforDynamicRetrieverinRetrieval-AugmentedGeneration WWW’26,April13–17,2026,Dubai,UnitedArabEmirates.
| Tomitigatecomputationaloverhead,recentmethodsdecouple |     |     |     | 4 Methodology |     |     |     |
| ----------------------------------------------------- | --- | --- | --- | ------------- | --- | --- | --- |
retrieveroptimizationbyleveragingthelanguagemodelasasupervi- ToaddressthechallengesofadaptingRAGsystemstocontinually
sorysignal.REPLUG[28]proposesLM-SupervisedRetrieval(LSR), evolvingdocumentcorpora,weproposeFlowRAG,aframework
whichalignsretrieverscorestothelanguagemodel’spreferencedis- thatintegratespromptembedding,cross-layerfusion,andgenerator-
tributionusingaKLdivergenceloss.RA-DIT[19]adoptsthesame
guidedsupervision.AsillustratedinFigure2,ourapproachenhances
LSRobjectivetoupdatetheretrieverwithoutmanualannotations.
traditionalRAGpipelinesinthreemainaspects:(1)PromptTuning
Similarly,Atlas[11]appliesaPerplexityDistillationlossthattrains
(§4.1),whereweinserttask-specificpromptembeddingsintomulti-
theretrievertoapproximatethelanguagemodel’spreferencedistri- pleencoderlayerstoefficientlyadapttodomainshifts;(2)Cross-
butionoverdocumentsbyassessingtheirimpactonperplexity,also LayerFusion(§4.2),whichemploysadistribution-awareattention
usingKLdivergence.
mechanism,StateFusion,torecursivelyaggregateprompt-enhanced
ContinualLearning.ContinualLearning(CL)[3,33]hasbeen
representationsacrosslayers,enablingrichercontextualmodeling;
widelystudiedasasolutiontocatastrophicforgetting,thephenome-
and(3)Generator-GuidedLoss(§4.3),whichalignsretrievaland
nonwheremodelsoverwritepreviouslyacquiredknowledgewhen state-leveldistributionswithgeneration-guidedsignalsthroughKL-
exposedtonewtasksordomains[18].ExistingCLapproachesare divergencebasedobjectives.Together,thesecomponentsprovidea
commonlycategorizedintothreefamilies:replay-basedmethods,
moreefficientandrobustadaptationstrategyforRAG,mitigating
whichpreserveasubsetofoldsamplesandmixthemwithnewdata
catastrophicforgettingwhilemaintainingstrongperformanceacross
duringtraining[24,42];regularization-basedmethods,whichpe-
dynamicdomains.
nalizeupdatestoparametersdeemedcriticalforpasttasks[13,41];
andparameter-isolationmethods,whichallocatetask-specificsub- 4.1 PromptTuning
networksormodulestomitigateinterference[1].Theseapproaches
|                                                         |     |     |     | Toadapttodomain-specificdocumentcollections𝐷 |     |     | attimestamp𝑡, |
| ------------------------------------------------------- | --- | --- | --- | -------------------------------------------- | --- | --- | ------------- |
| haveachievednotablesuccessincomputervision[22,26,27]and |     |     |     |                                              |     |     | 𝑡             |
wefollow[21]toinserttrainablepromptembeddingsintomultiple
| natural language | processing | [1, 7], establishing | CL as | a central |     |     |     |
| ---------------- | ---------- | -------------------- | ----- | --------- | --- | --- | --- |
layersoftheencoder.Wedescribethemodel’soperationintheorder
paradigmforlearninginnon-stationaryenvironments. 𝑗,
offorwardpropagation.Specifically,foreachtransformerlayer
| Despite advancements | in  | CL, its application | to RAG | remains |     |     |     |
| -------------------- | --- | ------------------- | ------ | ------- | --- | --- | --- |
wemodifytheself-attentioncomputationbyprependingtheprompt
underexplored.Existingworkfocusesmainlyoncontinuousdense
embeddingsexclusivelytothekeyandvaluesequences,whilethe
retrievers[2],whichareoptimizedforstandaloneretrievalrather
queryinputremainsunchanged.
thanretrievalforgeneration.Thisnarrowfocuslimitstheflexibility
Formally,let𝐻(𝑗−1) ∈R𝐵×𝑇×𝐷
denotethehiddenstatesfromthe
neededforindependentadaptation.Inpracticalscenarios,document (𝑗−1)-thlayer,andlet𝑃𝑡,𝑗 ∈R𝐵×𝑝×𝐷denotethepromptembeddings
corporaevolvecontinuously,introducingdistributionshiftsthatex-
|     |     |     |     | specific to | task 𝑡 at layer 𝑗, where | 𝐵 is the batch | size,𝑇 is the |
| --- | --- | --- | --- | ----------- | ------------------------ | -------------- | ------------- |
acerbateforgettinginstaticretrievalmodels.Whilemethodslike
sequencelength,𝐷isthehiddensize,and𝑝isthenumberofprompt
SelfAug[8]addressforgettingintheLLMcomponent,wefocuson
tokens.Then,theinputtotheself-attentionmoduleatthe𝑗-thlayer
theretrievercomponent,whichhasbeenlessexplored.Ourwork
| complementsexistingmethodsbytargetingadifferentaspectofthe |     |     |     | isdefinedas: |             |          |     |
| ---------------------------------------------------------- | --- | --- | --- | ------------ | ----------- | -------- | --- |
|                                                            |     |     |     |              | 𝑄(𝑗)        | 𝐻(𝑗−1)   |     |
| continuouslearningchallengesofRAG.                         |     |     |     |              | =𝑊 𝑄        |          |     |
|                                                            |     |     |     |              | 𝐾(𝑗) 𝐾[𝑃𝑡,𝑗 | ;𝐻(𝑗−1)] |     |
|                                                            |     |     |     |              | =𝑊          |          | (3) |
3 TaskFormulation
|     |     |     |     |     | 𝑉(𝑗) =𝑊 𝑉[𝑃𝑡,𝑗 | ;𝐻(𝑗−1)], |     |
| --- | --- | --- | --- | --- | -------------- | --------- | --- |
WeconsideraRAGsettingwheretheexternaldocumentcorpus
evolvesovertime.Let{D1,D2,...,D𝑇}denoteasequenceofcor-
|                  |         |                                    |     | where [·;    | ·] denotesconcatenationalongthesequencelengthdi- |     |     |
| ---------------- | ------- | ---------------------------------- | --- | ------------ | ------------------------------------------------ | --- | --- |
| pora,whereeachD𝑡 | ={𝑑 𝑡,𝑑 | 𝑡,...,𝑑 𝑡 }representsthesetofdocu- |     |              |                                                  |     |     |
|                  | 1       | 2 𝑛 𝑡                              |     | mension,and𝑊 | 𝑄,𝑊 𝐾,𝑊 𝑉 arestandardlinearprojections.          |     |     |
mentsavailableattimestep𝑡.Ateachtimestep𝑡,theinputtothe
| systemconsistsofqueriesQ𝑡 |                                  | andcorrespondinganswersY𝑡. |     |                       |     |     |     |
| ------------------------- | -------------------------------- | -------------------------- | --- | --------------------- | --- | --- | --- |
|                           |                                  |                            |     | 4.2 Cross-LayerFusion |     |     |     |
| Foragivenquery𝑞𝑡          | ∈ Q𝑡,theretrieverselectsthetop-𝑘 |                            |     | rele-                 |     |     |     |
𝑖 Although prompt tuning (Section 4.1) adapts the model by inde-
| vantdocumentsfromD𝑡 | basedonasimilarityfunctioncomputed |     |     |     |     |     |     |
| ------------------- | ---------------------------------- | --- | --- | --- | --- | --- | --- |
|                     |                                    |     |     |     | 𝑃   |     | 𝑗,  |
betweenencodedrepresentations: pendently inserting prompts 𝑡,𝑗 at each layer this layer-wise
isolationlimitstheformationofhierarchicalsemanticunderstanding.
R 𝑡 =TopK𝑑𝑡 (cid:0) sim(𝑓 𝑞(𝑞 𝑡),𝑓 𝑑(𝑑𝑡 )),𝑘(cid:1), (1) D r a w i n g in sp ir a ti o n f ro m m e th o d s l ik e i V P T [ 4 4 ] , w h ic h e m p lo y
|     | 𝑞 𝑡 𝑗∈D𝑡 | 𝑖   | 𝑗   |     |     |     |     |
| --- | -------- | --- | --- | --- | --- | --- | --- |
𝑖 C r o s s - L ay er D y n a m i c C on ne c ti o n s ( C D C ) t o e n h a n c e in te r -l ay e r
where𝑓 𝑞(·)and𝑓 informationflow,weintroduceCross-LayerFusion.Specifically,
𝑑(·)denotethequeryanddocumentencoders,re-
spectively.Thegenerator𝐺thenproducestheanswer𝑎𝑡 ourapproachleveragesStateFusion,adistribution-awareattention
conditioned
𝑖
onthequeryandtheretrievedcontext: mechanism,torecursivelyintegrateprompt-enhancedrepresenta-
tionsfromalllayersintoasingle,context-awareembedding.This
|     | 𝑡      | 𝑡,R 𝑡 |     |                                                          |     |     |     |
| --- | ------ | ----- | --- | -------------------------------------------------------- | --- | --- | --- |
|     | 𝑎 =𝐺(𝑞 | ).    |     | (2) processunfoldsthroughseveralkeystages:               |     |     |     |
|     | 𝑖      | 𝑖 𝑞 𝑡 |     |                                                          |     |     |     |
|     |        | 𝑖     |     | Inner-LayerFusion.Toimplementinner-layerfusion,wedesigna |     |     |     |
Thiscontinuallearningscenariointroducesconsiderablechallenges: mechanismcalledStateFusion,whichrefinesstandardself-attention
asthedocumentdistributionevolves,theRAGsystemmustadaptto byincorporatingglobalstatisticalpropertiesoftheinput,specifi-
newdomainswhilemaintainingaccuracyonpreviouslyencountered callythemeanandstandarddeviationcomputedalongthesequence
data. dimension.Foragivenlayer𝑗,withhiddenstates𝐻(𝑗−1) ∈R𝐵×𝑇×𝐷

WWW’26,April13–17,2026,Dubai,UnitedArabEmirates. SenleiZhangetal.
Figure2:TheoverallframeworkofFlowRAG.Fordocumentcollections𝐷 attimestamp𝑡,FlowRAGinsertspromptembeddingsinto
𝑡
multiplelayersoftheretrievertoefficientlyadapttodomainshifts,appliescross-layerfusionforrichercontextualmodeling,and
leveragesgenerator-guidedlosstoalignretrievalandstate-leveldistributionswithgeneration-guidedsignals.
Algorithm1StateFusionMechanism aggregatedstate𝑆.Thisstate𝑆isthenfusedwiththecurrentLayer
State𝐿𝑗
𝐻(𝑗−1) R𝐵×𝑇×𝐷, 𝑃𝑡,𝑗 usingStateFusion,whichproducesanupdatedAggregated
Input: Hidden states ∈ prompt slice ∈ State𝐴𝑗.Suchrecursivefusionenrichescontextualrepresentations
R𝐵×𝑝×𝐷
byfacilitatinginter-layerinformationexchange.Fortheinitiallayer
Output:Fusedoutput𝑂
|     |                |     |                |     |     |     | whereapromptisinserted,𝐴𝑗 |     | isformedfrom𝐿𝑗 |     |     | directly,without |
| --- | -------------- | --- | -------------- | --- | --- | --- | ------------------------- | --- | -------------- | --- | --- | ---------------- |
| 𝜇   | ←MEAN(𝐻(𝑗−1)), |     | 𝜎 ←STD(𝐻(𝑗−1)) |     |     |     |                           |     |                |     |     |                  |
| ℎ   |                |     | ℎ              |     |     |     |                           |     |                |     |     |                  |
𝜇 ←MEAN(𝑃𝑡,𝑗), 𝜎 ←STD(𝑃𝑡,𝑗) prioraggregation.Algorithm2detailsthiscross-layerfusionprocess.
| 𝑝   |            |     | 𝑝        |     |         |     |     |     |     |     |     |     |
| --- | ---------- | --- | -------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
| 𝑄   | ←𝑊 𝐻(𝑗−1), | 𝐾   | ←𝑊 𝑃𝑡,𝑗, | 𝑉   | ←𝑊 𝑃𝑡,𝑗 |     |     |     |     |     |     |     |
|     | 𝑄          |     | 𝐾        |     | 𝑉       |     |     |     |     |     |     |     |
Algorithm2Cross-LayerFusionMechanism
| 𝑄   | ←CONCAT(𝑄,𝜇 | ℎ   | ,𝜎 ℎ) |     |     |     |               |        |     |           |        |        |
| --- | ----------- | --- | ----- | --- | --- | --- | ------------- | ------ | --- | --------- | ------ | ------ |
| 𝐾   | ←CONCAT(𝐾,𝜇 | 𝑝   | ,𝜎 𝑝) |     |     |     |               | 𝐻(𝑗−1) |     | ∈ R𝐵×𝑇×𝐷, |        | 𝑃𝑡,𝑗 ∈ |
|     |             |     |       |     |     |     | Input: Hidden | states |     |           | prompt | slice  |
| 𝑉   | ←CONCAT(𝑉,𝜇 | ,𝜎  | )     |     |     |     | R𝐵×𝑝×𝐷        |        |     |           |        |        |
𝑝 𝑝√
| C←SOFTMAX(𝑄𝐾⊤/ |             |     | 𝐷)·𝑉 |     |     |     | Output:Aggregatedstate𝐴𝑗,layerstate𝐿𝑗 |                  |     |     |     |                |
| -------------- | ----------- | --- | ---- | --- | --- | --- | ------------------------------------- | ---------------- | --- | --- | --- | -------------- |
| 𝑂              | ←ATTNOUT(C) |     |      |     |     |     | 𝐿𝑗 ←STATEFUSION(𝐻(𝑗−1),𝑃𝑡,𝑗)          |                  |     |     |     | ⊲SeeAlgorithm1 |
| return𝑂        |             |     |      |     |     |     | Append𝐿𝑗                              | toPreLayerStates |     |     |     |                |
if𝑗 >1then
P←STACK(PreLayerStates)
|          |                     |             | 𝑡 , 𝑗          | 𝐵 𝑝          | 𝐷                      |                      | S ← M                                | E A N (P , d i m   | = 1 )    |             |     |     |
| -------- | ------------------- | ----------- | -------------- | ------------ | ---------------------- | -------------------- | ------------------------------------ | ------------------ | -------- | ----------- | --- | --- |
| a n d    | p ro m p t e m b    | e d d in g  | s 𝑃 ∈          | R × ×        | , th e ir r e s p e    | c ti ve m ea n s     |                                      |                    |          |             |     |     |
|          |                     |             |                |              |                        |                      | 𝐴 𝑗 ← S                              | T AT E F U S I ON  | ( S ,𝐿𝑗) |             |     |     |
| (𝜇 ,𝜎    | ) an d s t an       | d a r d d e | vi at i o n s( | 𝜇 , 𝜎        | ) a re c a lc u l a te | d . T he se st a -   |                                      |                    |          |             |     |     |
| ℎ        | ℎ                   |             |                | 𝑝 𝑝          |                        |                      | ifjisthelastprompt-insertedindexthen |                    |          |             |     |     |
| t ist ic | s a r e t h e n c o | n ca t e n  | a te d w i th  | t h e q u    | er y ( 𝑄 ) , k ey (𝐾   | ) , a n d v a lu e   |                                      |                    |          |             |     |     |
|          |                     |             |                |              |                        |                      | Set𝐴𝑗                                | asaggregatedquery𝑞 |          | ordocstate𝑑 |     |     |
| 𝑉        |                     |             |                |              |                        |                      |                                      |                    |          | 𝑠           |     | 𝑠   |
| ( ) p    | ro j e c t io n s p | r io r t o  | t h e at te n  | ti o n c o m | p u t ati o n . Th e   | r e su l ta n t at - |                                      |                    |          |             |     |     |
endif
tentionoutputissubsequentlyprocessedthroughaself-outputlayer,
else
| yieldingtheSingleLayerState.Algorithm1detailsthisinner-layer |     |     |     |     |     |     | 𝐴𝑗  |     |     |     |     |     |
| ------------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
←None
fusionprocess.
endif
Cross-LayerFusion.Tointegrateenhancedpromptinformation
return𝐴𝑗,𝐿𝑗
| across | different | layers, | the Layer | States | of all preceding | prompt |     |     |     |     |     |     |
| ------ | --------- | ------- | --------- | ------ | ---------------- | ------ | --- | --- | --- | --- | --- | --- |
insertionlayersarerecursivelyaggregated.Specifically,atlayer𝑗,
the mean of all previously computed Layer States, stored in the AggregatedState.Tofurtherenhancecontextualmodeling,theAg-
queuePreLayerStates,iscalculatedtoderiveanintermediate gregatedState𝐴𝑗 isprependedtothekeyandvaluesequenceswithin

FlowRAG:ContinualLearningforDynamicRetrieverinRetrieval-AugmentedGeneration WWW’26,April13–17,2026,Dubai,UnitedArabEmirates.
the self-attention mechanism, alongside the prompt embeddings. thegeneration-informeddistribution𝑄 :
LM
Thismodifiesthestandardattentioninputprojectionsasfollows: 1 ∑︁
|     |     |      |        |     |     |     |     |     | L   | sta te= | KL(𝑃 | 𝑆(𝑑 |𝑞)∥𝑄 | (𝑑 |𝑞,𝑦)). | (9) |
| --- | --- | ---- | ------ | --- | --- | --- | --- | --- | --- | ------- | ---- | --------- | ---------- | --- |
|     |     | 𝑄(𝑗) | 𝐻(𝑗−1) |     |     |     |     |     |     | K L |𝐵| |      | 𝑖         | LM 𝑖       |     |
|     |     |      | =𝑊 𝑄   |     |     |     |     |     |     |         | 𝑥∈𝐵  |           |            |     |
𝐾(𝑗) =𝑊 𝐾[𝐴𝑗 ;𝑃𝑡,𝑗 ;𝐻(𝑗−1)] (4) TotalLoss.Thefinaltrainingobjectivejointlyconsidersboththe
retrievallikelihoodlossandtheaggregatedstateloss.Tobalance
|     |     | 𝑉(𝑗) | =𝑊 𝑉[𝐴𝑗 | ;𝑃𝑡,𝑗 ;𝐻(𝑗−1)]. |     |     |     |     |     |     |     |     |     |     |
| --- | --- | ---- | ------- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
theirrelativecontributions,weintroduceaweightinghyperparameter
𝜆onthestate-levelterm:
| This | update | enables | the model | to attend | not | only to the | prompt |     |     |     |     |     |     |     |
| ---- | ------ | ------- | --------- | --------- | --- | ----------- | ------ | --- | --- | --- | --- | --- | --- | --- |
and hidden states within the current layer but also to the fused L =Lretrieval+𝜆·Lstate. (10)
|     |     |     |     |     |     |     |     |     |     |     | total | KL  | KL  |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- |
representationsaccumulatedfrompreviouslayers.
Lretrieval
Atthefinalpromptinsertionlayer:iftheencoderisthequery Here, ensures that the retriever distribution aligns with
KL
encoder,𝐴isassignedasthequerystate𝑞 generation-informed signals, while L sta te further regularizes the
|     |     |     |     |     | 𝑠;conversely,itisassigned |     |     |     |     |     |     |     | K L |     |
| --- | --- | --- | --- | --- | ------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
asthedocumentstate𝑑 internalrepresentationsthroughstate-levelalignment.Thehyper-
𝑠.
|     |     |     |     |     |     |     |     | parameter |     | 𝜆 provides | flexibility | in adjusting | the strength | of this |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | ---------- | ----------- | ------------ | ------------ | ------- |
regularization.
4.3 Generator-GuidedLoss
ThissectionintroducestheGenerator-GuidedLoss,whichaligns 5 ExperimentSetup
retrievalandstate-leveldistributionswithgenerationsignalstoim-
| proveRAGperformance.Weproposetwolosses:RetrievalLikeli- |     |     |     |     |     |     |     | 5.1 | Datasets |     |     |     |     |     |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- |
hoodLoss,whichfavorsdocumentsusefulforgeneration,andAg- Weevaluateourmodelonthefollowingdatasets:
gregatedStateLoss,whichalignsinternalrepresentationsthrough • CovidQA[30]:DerivedfromCORD-19[35],itcontains250,000
cross-layerfusion. 100-wordpassagesfrom5,000papers(excludingabstracts),with
RetrievalLikelihoodLoss.Following[29],weconstructageneration-
225,000syntheticQApairs(90%training,10%validation)and
awareretrievaldistributionbyleveragingthelikelihoodofgener-
2,000human-annotatedtestpairs[23].
ating the answer given each retrieved document. Given a query • NewsQA[30]:BasedontheNewsQAcorpus[31],itincludes
𝑞,itscorrespondinganswer𝑦,andthetop𝑛
retrieveddocuments 85,000 100-word passages from 10,000 articles, with 100,000
𝐷′ ={𝑑 ,𝑑 ,...,𝑑 𝑛},theLLM-baseddistributionisdefinedas: human-annotated QA pairs (90,000 training, 5,000 validation,
1 2
|     |     |           | e   | x p ( P LM | (𝑦 | 𝑑 𝑖 , | 𝑞 )/ 𝛽 ) |     | 5   | , 0 0 0 te s | t) fr o m C | N N / D a i ly | M a i l [ 6 | ].  |     |
| --- | --- | --------- | --- | ---------- | ---------- | -------- | --- | --- | ------------ | ----------- | -------------- | ----------- | --- | --- |
|     | 𝑄   | (𝑑 |𝑞,𝑦)= |     |            |            | ,        | (5) |     |              |             |                |             |     |     |
LM 𝑖 (cid:205) (cid:0) ( 𝑦 | 𝑑 , 𝑞 )/𝛽(cid:1) • C o n vQ A [3 0 ] : B u i l t f ro m Q A C o n v [ 3 6 ] , i t c o m p r is e s 1 1 0, 0 0 0
|     |     |     | 𝑑𝑗 ∈ | 𝐷 ′e x p PL | M   | 𝑗   |     |     |            |               |               |                 |                           |                       |
| --- | --- | --- | ---- | ----------- | --- | --- | --- | --- | ---------- | ------------- | ------------- | --------------- | ------------------------- | --------------------- |
|     |     |     |      |             |     |     |     | 1 0 | 0 -w o r d | p a s s a g e | s f r o m 1 0 | , 0 0 0 c o n v | e r sa t i o n s , ea c h | p r e fix e d w i t h |
wherePLM(𝑦 |𝑑 𝑖 ,𝑞)denotesthelogarithmicprobabilityofgener- ID and speaker, with 35,000 QA pairs (25,000 training, 5,000
atingtheanswer𝑦 conditionedonthedocument𝑑 andthequery validation,5,000test).
𝑖
| 𝑞,  | with 𝛽 serving | as  | a temperature | hyperparameter |     | to adjust | the | •   |     |     |     |     |     |     |
| --- | -------------- | --- | ------------- | -------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
NQ[14]:Itcontains307,000trainingQApairs,7,800validation
sharpnessofthedistribution. pairs,and7,800testpairsfromWikipediaandtheweb.
Meanwhile,theretrieverproducesitsowndistributionoverthe
| sameset𝐷′basedonsimilarityscoressim(𝑑 |     |     |     |     | 𝑖 ,𝑞): |     |     | 5.2 | Baselines |     |     |     |     |     |
| ------------------------------------- | --- | --- | --- | --- | ------ | --- | --- | --- | --------- | --- | --- | --- | --- | --- |
e x p ( si m ( 𝑑 ,𝑞 ) / 𝛽 ) W e c o m p a re o u r pr o p o s e d m od e l w it h s e v e r a l r ep r e se n ta t i v e b a s e -
|     |     | 𝑃 𝑅(𝑑 |𝑞)= |     |     | 𝑖   | ,   | (6) |     |     |     |     |     |     |     |
| --- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
𝑖 (cid:205) (𝑑 , 𝑞 )/𝛽) lin es , a ll o f w h ic h u s e t h e s am e b a ck b o n e r e t r ie v er , C o n tr i e v e r [ 9 ] ,
|     |     |     | 𝑑𝑗  | ∈ 𝐷 ′e x p ( | s im 𝑖 |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | ------------ | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
asthestandarddenseretrieverinoursetting.FortheRAGtasks,we
| where | 𝛽 is | a temperature | parameter. | We  | minimize | the Kullback- |     |     |     |     |     |     |     |     |
| ----- | ---- | ------------- | ---------- | --- | -------- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
employQwen2.5[38]andChatQA2[37],aLlama3.0-basedmodel.
| Leibler(KL)divergencebetween𝑃 |     |     |     | andtheLLM-deriveddistri- |     |     |     |                                                          |     |     |     |     |     |     |
| ----------------------------- | --- | --- | --- | ------------------------ | --- | --- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|                               |     |     |     | 𝑅                        |     |     |     | Inthisstudy,wefocusontrainingtheretrieverwhilekeepingthe |     |     |     |     |     |     |
bution𝑄
LM ,encouragingtheretrievertofavordocumentsthatare generatorfrozen.Duringevaluation,weusethevllmframework[15]
| morehelpfulforgeneration: |               |     |      |             |     |              |     | toaccelerateinference.                               |     |     |     |     |     |     |
| ------------------------- | ------------- | --- | ---- | ----------- | --- | ------------ | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|                           |               | 1   | ∑︁   |             |     |              |     | Wecompareourmethodswiththefollowingbaselines.(1)Con- |     |     |     |     |     |     |
|                           | L re trieval= |     | KL(𝑃 | 𝑅(𝑑 𝑖 |𝑞)∥𝑄 |     | (𝑑 𝑖 |𝑞,𝑦)), | (7) |                                                      |     |     |     |     |     |     |
K L |𝐵| LM triever[9]:Astrongunsuperviseddenseretrievertrainedonlarge-
𝑥∈𝐵
scalecorpora.ItservesasthestandardRAGbaselineandrepresents
where𝐵denotesthetrainingbatch.
theperformanceofstaticretrieverswithoutonlineadaptation.(2)
AggregatedStateLoss.Tofurtheraligninternalrepresentations, Atlas[11]: Itappliesa PerplexityDistillationloss thattrainsthe
weintroduceastate-levellossbasedonCross-LayerFusionoutputs
retrievertoapproximatethelanguagemodel’spreferencedistribu-
| (seeAlgorithm2).Foreachquery-documentpair(𝑞,𝑑 |     |     |     |     |     | 𝑖),weextract |     |     |     |     |     |     |     |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
tionoverdocumentsbyassessingtheirimpactonperplexity,also
| thefusedquerystate𝑞 |     |     | anddocumentstate𝑑 |     |     |     |     |     |     |     |     |     |     |     |
| ------------------- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
𝑠 𝑠𝑖.Basedonsimilarity usingKLdivergence.(3)End2EndRAG[30]:Anend-to-endframe-
| scoressim(𝑑 |     | ,𝑞),wegenerateaggregatedstatescores: |     |     |     |     |     |     |     |     |     |     |     |     |
| ----------- | --- | ------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
𝑠𝑖 workthatjointlyoptimizestheretrieverandgenerator,providing
|     |     |     |     |              |                  |     |     | a m | o re in t e | g ra t e d r e | t r i e v a l - a u | g m e n t e d | g e n e r a t i o n s y | s t e m . ( 4 ) R E - |
| --- | --- | --- | --- | ------------ | ---------------- | --- | --- | --- | ----------- | -------------- | ------------------- | ------------- | ----------------------- | --------------------- |
|     |     |     | e   | x p ( si m ( | 𝑑 𝑠𝑖 , 𝑞 𝑠 ) / 𝛾 | )   |     |     |             |                |                     |               |                         |                       |
𝑃 𝑆(𝑑 |𝑞)= . (8) PL U G [ 2 8 ] : T r e a t s t h e l a n g u a g e m o d e l a s a b l a c k b o x , a u g m e n t i n g i t
|     |     | 𝑖   | (cid:205) | ′e x p ( s | im ( 𝑑 , 𝑞 | )/𝛾) |     |         |             |                  |                 |              |                          |                           |
| --- | --- | --- | --------- | ---------- | ---------- | ---- | --- | ------- | ----------- | ---------------- | --------------- | ------------ | ------------------------ | ------------------------- |
|     |     |     | 𝑑𝑗 ∈      | 𝐷          | 𝑠 𝑖        | 𝑠    |     |         |             |                  |                 |              |                          |                           |
|     |     |     |           |            |            |      |     | w i t h | a t u n a b | l e r e t r ie v | e r t h a t p r | e p en d s r | e t ri e v e d d o c u m | e n t s , a l l o w i n g |
Similar to the likelihood-based loss, we minimize the Kullback- themodeltoindirectlysuperviseretrieval.(5)L2R[2]:Alifelong
Leibler(KL)divergencebetweenthestate-baseddistribution𝑃 𝑆 and learningapproachforfirst-stageretrievalthatmaintainsamemory

WWW’26,April13–17,2026,Dubai,UnitedArabEmirates. SenleiZhangetal.
Table1:ComparisonofmethodsacrossfourQAdatasetsunderthreesequentialtrainingorders.WereportboththefinalRetrieval
ACC@5(%)andF1scores(%)oneachdatasetaftersequentialtraining,alongwiththeaveragedperformance(AVE.)andthe
forgettingmeasure(Forget).Wehighlightthebestresultsforeachmetricinbold.
Reader TrainOrder Methods CovidQA NewsQA ConvQA NQ AVE. Forget
ACC@5 F1 ACC@5 F1 ACC@5 F1 ACC@5 F1 ACC@5 F1 ACC@5 F1
Contriever 6.80 13.80 23.53 10.47 44.34 19.86 34.02 27.71 27.17 17.96 / /
REPLUG 3.40 7.85 11.21 4.96 32.45 25.12 56.78 41.20 25.96 19.78 13.43 13.99
End2EndRAG 3.57 7.98 13.89 6.99 34.82 25.25 56.12 40.26 27.10 20.12 13.12 14.36
Order1
Atlas 2.36 5.17 12.52 8.80 28.22 22.72 52.21 38.41 23.83 18.78 12.83 12.53
L2R 4.59 10.29 21.39 13.92 40.03 34.00 54.79 41.40 30.20 24.90 6.57 6.57
REPLUG 4.96 9.59 22.42 13.25 46.75 39.91 24.22 21.90 24.59 21.16 15.95 12.56
Qwen2.5-7B[38] End2EndRAG 2.37 7.77 22.30 13.34 45.58 39.14 28.18 19.87 24.61 20.03 10.06 13.92
Order2
Atlas 0.28 7.30 23.51 12.71 41.22 36.17 21.75 22.73 21.69 19.73 17.69 13.40
L2R 4.65 10.62 28.16 19.60 44.18 38.74 38.79 30.75 28.95 24.93 9.52 6.83
REPLUG 3.23 7.87 23.05 14.90 16.39 9.71 55.06 40.15 24.43 18.16 14.44 15.81
End2EndRAG 3.46 7.60 19.50 15.01 12.27 6.14 56.38 40.61 22.90 17.34 16.33 16.44
Order3
Atlas 4.42 5.66 24.99 12.87 12.27 5.24 43.85 38.03 21.38 15.45 14.67 18.75
L2R 5.15 13.20 27.98 17.57 24.87 19.13 55.07 39.21 28.27 22.28 9.11 8.03
FlowRAG(ours) 10.88 20.54 29.98 22.03 41.95 35.89 53.24 41.08 34.01(+3.81) 29.89(+4.96) 0(+9.11) 0(+8.03)
Contriever 6.80 17.29 23.53 19.40 44.34 29.38 34.02 40.11 27.17 26.55 / /
REPLUG 2.98 12.16 13.35 11.02 25.23 28.60 56.46 53.86 24.51 26.41 13.22 10.66
End2EndRAG 3.00 11.33 11.15 12.74 27.72 25.02 54.89 50.87 24.19 24.99 15.98 9.44
Order1
Atlas 1.25 10.67 10.51 9.87 23.87 20.85 53.84 52.68 22.37 23.52 15.16 11.09
L2R 7.98 15.11 21.77 14.26 29.60 27.40 58.44 52.17 29.45 27.24 5.16 4.84
REPLUG 1.97 10.31 17.03 15.95 39.79 33.88 21.52 28.56 20.08 22.18 18.99 11.13
Llama3-8B[37] End2EndRAG 1.51 10.42 15.15 16.63 45.71 38.00 12.61 30.75 18.75 23.95 22.71 10.32
Order2
Atlas 2.53 12.97 16.99 16.70 44.66 36.67 17.86 26.70 20.51 23.26 21.09 11.42
L2R 6.15 16.98 27.85 22.03 43.70 37.80 39.84 35.84 29.39 28.16 8.57 3.85
REPLUG 3.55 12.96 10.45 10.78 9.54 9.79 50.39 42.63 18.48 19.04 15.84 13.29
End2EndRAG 2.72 10.63 22.34 16.00 12.30 12.43 55.20 44.40 23.14 20.87 16.68 14.11
Order3
Atlas 4.95 14.92 19.70 15.24 14.48 9.46 53.70 44.72 23.21 21.09 15.42 13.74
L2R 7.92 18.48 24.15 20.71 24.44 23.74 56.29 43.13 28.20 26.52 7.16 5.25
FlowRAG(ours) 12.34 22.92 32.36 24.21 45.69 37.38 53.44 43.49 35.96(+6.51) 32.00(+3.84) 0(+7.16) 0(+5.25)
Table2:Parameterefficiencycomparison ForgettingScore.Toquantifycatastrophicforgetting,wedefine
theforgettingscoreforeachintermediatetask𝐷
𝑖
(𝑖 <𝑇)as:
Method #TrainableParams Percentage Forget𝐷𝑖 = m
𝑡≤
a
𝑇
xF1𝑡(𝐷 𝑖) − F1𝑇(𝐷 𝑖), (11)
Fine-tuning 110M 100%
FlowRAG(ours) 0.63M 0.64% whereF1𝑡(𝐷 𝑖) denotestheF1on𝐷 𝑖 aftertrainingontask𝑡.The
totalforgettingisthentheaverageoveralltasksexceptthelast:
𝑇−1
1 ∑︁
bufferofsupportnegativesandincorporatesadiversenegativeselec-
TotalForgetting =
𝑇 −1
Forget𝐷𝑖 . (12)
𝑖=1
tionstrategyandrankingalignmentobjective,avoidingcostlyindex
Alowertotalforgettingscoreindicatesbetterretentionofearlier
rebuilding.
tasks.
5.3 EvaluationMetrics
6 ExperimentalEvaluation
Weevaluateourmodelsusingthreecomplementarymetrics:Top-𝑘
6.1 EvaluationFramework
retrievalaccuracy,averageF1,andforgettingscore.
Top-𝑘RetrievalAccuracy.Following[30],weevaluatetheef- Toevaluatethecontinuallearningcapabilityofourproposedmethod
fectivenessoftheretrieverusingtheTop-𝑘retrievalaccuracy.Specif- andbaselines,weadoptasequentialtrainingandevaluationframe-
ically,thismetriccheckswhethertheground-truthanswerappearsin workacrossfourdatasets:CovidQA,NewsQA,ConvQA,andNQ.
anyofthetop𝑘retrievedpassages.Inourexperiments,weset𝑘 =5. Thissettingsimulatesarealisticscenariowheretasksarriveincre-
Forbrevity,wedenotetheTop-5retrievalaccuracyasACC@5in mentally, requiring the retriever to adapt to new domains while
allresulttables. preservingknowledgefromprevioustasks.
F1Score.TheF1scoreiscalculatedastheharmonicmeanof We consider three training orders by randomly permuting the
precisionandrecallatthetokenlevel. datasets:
WepresentthemeanF1scoreacrossalltestsetsfollowingtrain- (1)CovidQA→NewsQA→ConvQA→NQ
ingonthefinaltask𝑇. (2)CovidQA→NQ→NewsQA→CovidQA

FlowRAG:ContinualLearningforDynamicRetrieverinRetrieval-AugmentedGeneration WWW’26,April13–17,2026,Dubai,UnitedArabEmirates.
60
40
20
0
CovidQA NewsQA ConvQA NQ AVE
)%(
serocS
ACC@5 ACC@10 ACC@20
44.3445.69
34.02
53.44
32.80 4
6
0
0
32.44 36.44
50.86 55.63
39.66
57.36
33.12 40.24 4
6
0
0 42.2744.83 58.5662.28 47.95 59.19
40.52
45.50
23.5324.93 27.17
6.807.14
20
9.5411.54
20 13.2915.69
0 0
CovidQA NewsQA ConvQA NQ AVE CovidQA NewsQA ConvQA NQ AVE
50
40 30
20
CovidQA NewsQA ConvQA NQ AVE
)%( serocS
F1@5 F1@10 F1@20
50 50 47.19
22.92 24.21 29.38 37.38 40.11 43.49 26.55 32.00 3 4 0 0 22.31 23.55 26.21 35.82 38.82 41.49 43.91 30.26 33.81 3 4 0 0 22.51 25.51 25.68 28.95 39.16 43.16 44.19 32.88 35.95
17.29 19.40 20 20.18 20
CovidQA NewsQA ConvQA NQ AVE CovidQA NewsQA ConvQA NQ AVE
Contriever FlowRAG (ours)
Figure3:ComparisonofTop-kRetrievalAccuracy(ACC)andF1scoresacrossmultipledatasetsfortheTop-5(left),Top-10(middle),
andTop-20(right)retrievalsettings
(3)ConvQA→CovidQA→NewsQA→NQ F1,respectively.Theseimprovementsareconsistentacrossdifferent
TrainingPhase.Ineachphase,wesample1,000QApairsfrom trainingordersandgeneralizewelltoothermodels,suchasQwen2.5-
the training set of each dataset (approximately 1.6%–20% of the 7B.Thisdemonstratesthebroadapplicabilityandrobustnessofour
dataset),simulatingacontinual-learningscenariowith𝑇 tasks.For method.
allmethods,weretrievethetop-5documentsperquerytoprovide (2) Better Performance for Generation Tasks. While L2R
context to the generator; alternative choices are explored in Sec- performs well in sequential retrieval tasks, FlowRAG excels in
tion6.3. generationtasks.Thisisreflectedintheresults,whereFlowRAG
Baselines.Forfine-tuningmethods,wetraintheretrieverwith consistently outperforms L2R in both retrieval accuracy and F1
AdamW,usingalearningrateof1×10−5 andawarm-upratioof scoresacrossmultipledatasetsandtrainingorders.Forexample,
0.1.ForL2R,wefollowtheexperimentalsetupfromtheoriginal ontheLlamamodel,FlowRAGachievesa+6.51%improvementin
paper[2]. ACC@5and+4.96%improvementinF1ontheNQdatasetcom-
Proposedmethod.Wesetthepromptlengthto150andinsert paredtoL2R.
thepromptsintoencoderlayers1–7.Theretrieveristrainedwith (3) Reduced Forgetting. Sequential fine-tuning baselines ex-
AdamW(learningrate5×10−3,warm-upratio0.1).TheKL-divergence hibitsubstantialdegradationonearliertasks,andL2Ronlypartially
temperatureforretrieval-likelihoodalignmentis0.1,andforaggregated- mitigatesthisissue.Incontrast,FlowRAGmaintainsstableperfor-
statealignmentitis1.Weset𝛽 =0.6inEq.(10). manceacrosstaskswithoutexplicitreplay.Byassigningtask-specific
EvaluationPhase.Aftertrainingoneachdataset(phase𝑡),we promptembeddings,FlowRAGpreservespreviouslylearnedknowl-
evaluatethemodelonthetestsetsofallpreviouslyseendatasets. edgeandavoidsinterferenceduringcontinualtraining.Asaresult,
Thisyieldsa𝑇 ×𝑇 matrixofTop-5RetrievalACCandF1scores, itachievesstrongretrievalaccuracyandF1acrossdifferenttraining
where𝑇 isthenumberoftasks. orderswhileshowingnonoticeableforgetting,makingitwell-suited
forcontinualretrievalonevolvingcorpora.
6.2 ExperimentalResultsandAnalysis (4)ParameterEfficiency.Additionally,asshowninTable2,fine-
Table1reportsthefinalresultsoneachdatasetaftersequentialtrain-
tuningtheContrievermodel1involvesupdatingall110Mparameters.
ing.Detailedresultsonthechangesthroughouteverysequentialtrain- Incontrast,FlowRAGintroducessixlayersofpromptembeddings,
ingstepcanbefoundinAppendixC.Overall,ourFlowRAGdemon- eachwithalengthof150foratask,updatingonly0.63Mparameters.
stratesasignificantadvantageoverallbaselinemethodsacrossfour Thisrepresentsjust0.64%ofthetotalmodelparameters,showcasing
datasetsanddifferenttrainingorders,highlightingtheeffectiveness theparameterefficiencyofourapproach.
ofourapproach.Wemakethefollowingkeyobservations:
6.3 AblationStudy
(1)SuperiorPerformance.OurproposedFlowRAGconsistently
outperformsexistingmethodsacrossarangeofdatasetsandtraining Table3presentsanablationstudyevaluatingthecontributionof
orders.OntheLlamamodel,FlowRAGachieves35.96%ACC@5 eachcomponentinourframeworkontworepresentativereaders.
and32.00%F1,outperformingL2Rby6.95%inACC@5and4.7% Wecomparethreevariants:(1)w/Contriever,whichusesafrozen
inF1.InOrders1,2,and3,FlowRAGsurpassesL2Rby6.51%,
6.57%,and7.76%inACC@5,andby4.8%,3.8%,and5.5%in 1https://huggingface.co/facebook/contriever

WWW’26,April13–17,2026,Dubai,UnitedArabEmirates. SenleiZhangetal.
|     | 40        |             |     | 35           |             |     | 40        |     |             | 35           |     |             |     |
| --- | --------- | ----------- | --- | ------------ | ----------- | --- | --------- | --- | ----------- | ------------ | --- | ----------- | --- |
|     |           |             |     |              | Peak: 30.2% |     |           |     |             |              |     | Peak: 29.7% |     |
|     |           | Peak: 33.5% |     | 30           |             |     |           |     | Peak: 32.5% | 30           |     |             |     |
|     | )%( 5@CCA |             |     | )%( erocS 1F |             |     | )%( 5@CCA |     |             | )%( erocS 1F |     |             |     |
|     | 30        |             |     | 25           |             |     | 30        |     |             | 25           |     |             |     |
|     |           |             |     | 20           |             |     |           |     |             | 20           |     |             |     |
|     | 20        |             |     |              |             |     | 20        |     |             |              |     |             |     |
|     |           |             |     | 15           |             |     |           |     |             | 15           |     |             |     |
|     | 10        |             |     | 10           |             |     | 10        |     |             | 10           |     |             |     |
|     |           |             |     | 5            |             |     |           |     |             | 5            |     |             |     |
|     | 0         |             |     | 0            |             |     | 0         |     |             | 0            |     |             |     |
1-5 1-6 1-7 1-8 1-9 1-5 1-6 1-7 1-8 1-9 50 75 100 125 150 175 200 50 75 100 125 150 175 200
|     |     | Insertion Layer |     |     | Insertion Layer |     |     | Prompt Length |     |     | Prompt Length |     |     |
| --- | --- | --------------- | --- | --- | --------------- | --- | --- | ------------- | --- | --- | ------------- | --- | --- |
Figure4:Impactofinsertionlayer(left)andpromptlength(right)ontheperformance
Table3:Ablationresults
otherwisestated,wevarytheinsertionlayerwithafixedprompt
lengthof150tokens,andvarythepromptlengthwithafixedin-
Method Qwen2.5-7B Llama3-8B sertiondepthof6.Wealsostudytheweightingparameter𝜆 that
ACC@5 F1 ACC@5 F1 balancesthetwogenerator-guidedlosstermsinSection4.3.
InsertionLayer.ThelefttwoplotsinFigure4showthatboth
| w/Contriever |     |     | 27.17 | 17.96 | 27.17 | 26.55 |     |     |     |     |     |     |     |
| ------------ | --- | --- | ----- | ----- | ----- | ----- | --- | --- | --- | --- | --- | --- | --- |
w/Prompt+RLLoss 31.64 27.68 32.77 30.16 RetrievalACC@5andF1peakwheninsertingatlayers1–7(33.5%
w/Cross-LayerFusion+ASLoss 34.01 29.89 35.96 32.00 and30.2%,respectively),whileperformancedropssharplyatdeeper
layers(8–9).Thissuggeststhattooshallowinsertionlimitscapacity,
whereasoverlydeepinsertionmayintroducenoiseanddilutesalient
38
|     |     |     | 34  |     |     |     | information,degradingbothretrievalandgeneration. |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- |
Peak: 35.96
|     | 36  |     |     |     | Peak: 32.00 |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
)%( 5@CCA Peak: 34.01 )%( erocS 1F 32 PromptLength.TherighttwoplotsinFigure4indicateanon-
|     | 34  |     |     |     | Peak: 29.89 |     |                                                       |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ----------- | --- | ----------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|     |     |     | 30  |     |             |     | monotoniceffectofpromptlength.RetrievalACC@5islowwith |     |     |     |     |     |     |
32
|     |     |     | 28  |     |     |     | veryshortprompts,peaksat150tokens(32.5%),andthendeclines. |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
30
|     |     |     | 26  |     |     |     | F1exhibitsasimilarbutmildertrend,alsoperformingbestat150 |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
28
24 tokens(29.7%).Theseresultssuggestthatadequatecontextisbene-
|     | 26      |             |        |         |     |             | ficial,butoverlylongpromptsmayintroduceirrelevantdetails. |     |     |     |     |     |     |
| --- | ------- | ----------- | ------ | ------- | --- | ----------- | --------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|     | 0.0 0.2 | 0.4 0.6 0.8 | 1.0 22 | 0.0 0.2 | 0.4 | 0.6 0.8 1.0 |                                                           |     |     |     |     |     |     |
LossWeighting.Wefurtherexaminethebalancebetweenthe
|     |     | Qwen2.5-7B |     | Llama3-8B |     |     |     |     |     |     |     |     |     |
| --- | --- | ---------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
retrievallikelihoodlossandthestatepredictionlossbysetting
Figure5:Theimpactofthehyperparameter𝜆.Theleftshows =Lretrieval+𝜆·Lstate.
|                                               |     |     |     |     |     |     |     |     | L total |     |     |     |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- |
| theRetrievalACC@5,andtherightshowstheF1score. |     |     |     |     |     |     |     |     |         | KL  |     | KL  |     |
Figure5reportsresultsonbothQwen2.5-7BandLlama3-8Bacross
|     |     |     |     |     |     |     | different𝜆.When𝜆 |     | =   | 0,usingonlytheretrievallossyieldssub- |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | --- | ------------------------------------- | --- | --- | --- |
retrieverwithoutoptimization;(2)w/Prompt+RLLoss,which
optimalperformance.Increasing𝜆improvesbothACC@5andF1,
appliesprompttuningwiththeRetrievalLikelihoodlosstobetter
|     |     |     |     |     |     |     | with | the best | results at𝜆 | = 0.6. Beyond |     | this point, | performance |
| --- | --- | --- | --- | --- | --- | --- | ---- | -------- | ----------- | ------------- | --- | ----------- | ----------- |
alignretrievalwithgeneration;and(3)w/Cross+ASLoss(Full),
|     |     |     |     |     |     |     | degrades, | suggesting | that | over-weighting |     | the state | loss can over- |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---------- | ---- | -------------- | --- | --------- | -------------- |
whichfurtherintroducescross-layerfusionandtheAggregatedState
constraintheretrieverandhurtfactualdocumentselection.Overall,
loss.
𝜆=0.6providesthebesttrade-off.
Overall,addingprompttuningandRLLossconsistentlyimproves
overthefrozenretriever,withnotablegainsinF1,indicatingstronger
7 Conclusion
| retrieval–generation |     | alignment. | Our | full model | achieves | the best |     |     |     |     |     |     |     |
| -------------------- | --- | ---------- | --- | ---------- | -------- | -------- | --- | --- | --- | --- | --- | --- | --- |
Inthispaper,wepresentedFlowRAG,alightweightandeffective
ACC@5andF1onbothQwen2.5-7BandLlama3-8B,validatingthe
effectivenessofcombiningarchitecturalfusionwithstate-aggregated approachforcontinualretrieveradaptationinRetrieval-Augmented
supervision. Generation(RAG)withevolvingdocumentcollections.FlowRAG
Figure3furthercomparesFlowRAGwiththeContrieverbase- introducesLayer-wisePromptEmbeddingsandaCrossLayerFu-
|     |     |     |     |     |     |     | sion | mechanism | to capture | hierarchical |     | semantics, | along with a |
| --- | --- | --- | --- | --- | --- | --- | ---- | --------- | ---------- | ------------ | --- | ---------- | ------------ |
lineacrossdatasetsunderdifferentretrievaldepths(top-5/10/20).
Generator-GuidedLossthatalignsretrievalwithgenerationlike-
FlowRAGconsistentlyoutperformsthebaseline,andthegapgen-
erallywidensas moredocumentsareretrieved. Forexample, on lihoods.Experimentsondynamicretrievalbenchmarksshowthat
NQ,ACC@5increasesfrom34.02%to53.44%,withfurtherim- FlowRAGconsistentlyoutperformsstrongbaselinesinbothretrieval
provementsatACC@10andACC@20.SimilartrendsholdforF1, andgeneration,whilemitigatingcatastrophicforgetting.Ourmethod
providesarobustandparameterefficientsolutionforadaptiveRAG.
demonstratingtherobustnessofFlowRAGunderdeeperretrieval.
| 6.4 | SensitivityAnalysis |     |     |     |     |     | 7.1 | Acknowledgments |     |     |     |     |     |
| --- | ------------------- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- |
Weconductasensitivityanalysisonthreehyperparametersthataf- ThisworkissupportedbyNationalKeyResearchandDevelopment
fectFlowRAG’sperformance:(1)thenumberofinsertionlayers,(2) ProgramofChina(No.2023YFB4502300)andNSFC-RGCunder
theinputpromptlength,and(3)thelossweightingfactor.Unless GrantNo.62461160333.

FlowRAG:ContinualLearningforDynamicRetrieverinRetrieval-AugmentedGeneration WWW’26,April13–17,2026,Dubai,UnitedArabEmirates.
References
’20).CurranAssociatesInc.,RedHook,NY,USA,Article793,16pages.
[1] RahafAljundi,PunarjayChakravarty,andTinneTuytelaars.2017.ExpertGate: [17] MinghaoLi,YingxiuZhao,BowenYu,FeifanSong,HangyuLi,HaiyangYu,
LifelongLearningwithaNetworkofExperts.InProceedingsofthe2017IEEE ZhoujunLi,FeiHuang,andYongbinLi.2023. API-Bank:AComprehensive
ConferenceonComputerVisionandPatternRecognition(CVPR).7120–7129. BenchmarkforTool-AugmentedLLMs.arXiv:2304.08244[cs.CL] https://arxiv.
doi:10.1109/CVPR.2017.753 org/abs/2304.08244
[2] YinqiongCai,KepingBi,YixingFan,JiafengGuo,WeiChen,andXueqiCheng. [18] YayongLi,PeymanMoghadam,CanPeng,NanYe,andPiotrKoniusz.2025.
2023.L2R:LifelongLearningforFirst-stageRetrievalwithBackward-Compatible InductiveGraphFew-shotClassIncrementalLearning.InProceedingsoftheEigh-
Representations.InProceedingsofthe32ndACMInternationalConferenceon teenthACMInternationalConferenceonWebSearchandDataMining(Hannover,
InformationandKnowledgeManagement.183–192. Germany)(WSDM’25).AssociationforComputingMachinery,NewYork,NY,
[3] ArslanChaudhry,PuneetK.Dokania,ThalaiyasingamAjanthan,andPhilipH.S. USA,466–474. doi:10.1145/3701551.3703578
Torr.2018.RiemannianWalkforIncrementalLearning:UnderstandingForgetting [19] XiVictoriaLin,XilunChen,MingdaChen,WeijiaShi,MariaLomeli,RichJames,
andIntransigence.InComputerVision–ECCV2018.SpringerInternational PedroRodriguez,JacobKahn,GergelySzilvasy,MikeLewis,LukeZettlemoyer,
Publishing,Cham,556–572. andScottYih.2024. RA-DIT:Retrieval-AugmentedDualInstructionTuning.
[4] JianguiChen,RuqingZhang,JiafengGuo,MaartendeRijke,WeiChen,Yixing arXiv:2310.01352[cs.CL] https://arxiv.org/abs/2310.01352
Fan,andXueqiCheng.2023. Continuallearningforgenerativeretrievalover [20] NelsonF.Liu,KevinLin,JohnHewitt,AshwinParanjape,MicheleBevilacqua,
dynamiccorpora.InProceedingsofthe32ndACMInternationalConferenceon FabioPetroni,andPercyLiang.2024.LostintheMiddle:HowLanguageModels
InformationandKnowledgeManagement.306–315. UseLongContexts.TransactionsoftheAssociationforComputationalLinguistics
[5] WenqiFan,YujuanDing,LiangboNing,ShijieWang,HengyunLi,DaweiYin, 12(2024),157–173.doi:10.1162/tacl_a_00638
Tat-SengChua,andQingLi.2024. Asurveyonragmeetingllms:Towards [21] XiaoLiu,KaixuanJi,YichengFu,ZhengxiaoDu,ZhilinYang,andJieTang.2021.
retrieval-augmentedlargelanguagemodels.InProceedingsofthe30thACM P-Tuningv2:PromptTuningCanBeComparabletoFine-tuningUniversally
SIGKDDConferenceonKnowledgeDiscoveryandDataMining.6491–6501. AcrossScalesandTasks. CoRRabs/2110.07602(2021). arXiv:2110.07602
[6] KarlMoritzHermann,TomášKocˇiský,EdwardGrefenstette,LasseEspeholt,Will https://arxiv.org/abs/2110.07602
Kay,MustafaSuleyman,andPhilBlunsom.2015. Teachingmachinestoread [22] ZhedaMai,RuiwenLi,JihwanJeong,DavidQuispe,HyunwooKim,andScott
andcomprehend.InProceedingsofthe29thInternationalConferenceonNeural Sanner.2022. Onlinecontinuallearninginimageclassification:Anempirical
InformationProcessingSystems-Volume1(Montreal,Canada)(NIPS’15).MIT survey.Neurocomputing469(2022),28–51. doi:10.1016/j.neucom.2021.10.021
Press,Cambridge,MA,USA,1693–1701. [23] TimoMöller,AnthonyReina,RaghavanJayakumar,andMaltePietsch.2020.
[7] NeilHoulsby,AndreiGiurgiu,StanislawJastrzebski,BrunaMorrone,Quentin COVID-QA:AQuestionAnsweringDatasetforCOVID-19.InProceedingsof
DeLaroussilhe,AndreaGesmundo,MonaAttariyan,andSylvainGelly.2019. the1stWorkshoponNLPforCOVID-19atACL2020,KarinVerspoor,KevinBre-
Parameter-EfficientTransferLearningforNLP.InProceedingsofthe36thInter- tonnelCohen,MarkDredze,EmilioFerrara,JonathanMay,RobertMunro,Cecile
nationalConferenceonMachineLearning(ProceedingsofMachineLearning Paris,andByronWallace(Eds.).AssociationforComputationalLinguistics,On-
Research,Vol.97),KamalikaChaudhuriandRuslanSalakhutdinov(Eds.).PMLR, line. https://aclanthology.org/2020.nlpcovid19-acl.18/
2790–2799. https://proceedings.mlr.press/v97/houlsby19a.html [24] AlexanderPluska,PascalWelke,ThomasGärtner,andSagarMalhotra.2024.Log-
[8] YuqingHuang,RongyangZhang,QimengWang,ChengqiangLu,YanGao, icaldistillationofgraphneuralnetworks.InProceedingsofthe21stInternational
YiWu,YaoHu,XuyangZhi,GuiquanLiu,XinLi,HaoWang,andEnhong ConferenceonPrinciplesofKnowledgeRepresentationandReasoning(Hanoi,
Chen.2025.SelfAug:MitigatingCatastrophicForgettinginRetrieval-Augmented Vietnam)(KR’24).Article86,11pages. doi:10.24963/kr.2024/86
GenerationviaDistributionSelf-Alignment. arXiv:2509.03934[cs.CL] https: [25] YujiaQin,ShihaoLiang,YiningYe,KunlunZhu,LanYan,YaxiLu,YankaiLin,
//arxiv.org/abs/2509.03934 XinCong,XiangruTang,BillQian,SihanZhao,LaurenHong,RunchuTian,
[9] GautierIzacard,MathildeCaron,LucasHosseini,SebastianRiedel,PiotrBo- RuobingXie,JieZhou,MarkGerstein,DahaiLi,ZhiyuanLiu,andMaosong
janowski, Armand Joulin, and Edouard Grave. 2022. Unsupervised Dense Sun.2023. ToolLLM:FacilitatingLargeLanguageModelstoMaster16000+
InformationRetrievalwithContrastiveLearning. arXiv:2112.09118[cs.IR] Real-worldAPIs.arXiv:2307.16789[cs.AI] https://arxiv.org/abs/2307.16789
https://arxiv.org/abs/2112.09118 [26] KandanRamakrishnan,RameswarPanda,QuanfuFan,JohnHenning,AudeOliva,
[10] GautierIzacardandEdouardGrave.2020.Distillingknowledgefromreaderto andRogerioFeris.2020. RelationshipMatters:RelationGuidedKnowledge
retrieverforquestionanswering.arXivpreprintarXiv:2012.04584(2020). TransferforIncrementalLearningofObjectDetectors.InProceedingsofthe2020
[11] GautierIzacard,PatrickLewis,MariaLomeli,LucasHosseini,FabioPetroni, IEEE/CVFConferenceonComputerVisionandPatternRecognitionWorkshops
TimoSchick,JaneDwivedi-Yu,ArmandJoulin,SebastianRiedel,andEdouard (CVPRW).1009–1018.doi:10.1109/CVPRW50498.2020.00133
Grave.2023.Atlas:few-shotlearningwithretrievalaugmentedlanguagemodels. [27] Sylvestre-AlviseRebuffi,AlexanderKolesnikov,GeorgSperl,andChristophH.
J.Mach.Learn.Res.24,1,Article251(Jan.2023),43pages. Lampert.2017. iCaRL:IncrementalClassifierandRepresentationLearning.
[12] VladimirKarpukhin,BarlasOguz,SewonMin,PatrickLewis,LedellWu,Sergey InProceedingsofthe2017IEEEConferenceonComputerVisionandPattern
Edunov,DanqiChen,andWen-tauYih.2020.DensePassageRetrievalforOpen- Recognition(CVPR).5533–5542.doi:10.1109/CVPR.2017.587
DomainQuestionAnswering.InProceedingsofthe2020ConferenceonEmpirical [28] WeijiaShi,SewonMin,MichihiroYasunaga,MinjoonSeo,RichardJames,
MethodsinNaturalLanguageProcessing(EMNLP),BonnieWebber,TrevorCohn, MikeLewis,LukeZettlemoyer,andWen-tauYih.2024. REPLUG:Retrieval-
YulanHe,andYangLiu(Eds.).AssociationforComputationalLinguistics,Online, AugmentedBlack-BoxLanguageModels.InProceedingsofthe2024Conference
6769–6781.doi:10.18653/v1/2020.emnlp-main.550 oftheNorthAmericanChapteroftheAssociationforComputationalLinguistics:
[13] JamesKirkpatrick,RazvanPascanu,NeilRabinowitz,JoelVeness,Guillaume HumanLanguageTechnologies(Volume1:LongPapers),KevinDuh,Helena
Desjardins,AndreiA.Rusu,KieranMilan,JohnQuan,TiagoRamalho,Agnieszka Gomez,andStevenBethard(Eds.).AssociationforComputationalLinguistics,
Grabska-Barwinska,DemisHassabis,ClaudiaClopath,DharshanKumaran,and MexicoCity,Mexico,8371–8384.doi:10.18653/v1/2024.naacl-long.463
RaiaHadsell.2017. Overcomingcatastrophicforgettinginneuralnetworks. [29] WeijiaShi,SewonMin,MichihiroYasunaga,MinjoonSeo,RichardJames,
ProceedingsoftheNationalAcademyofSciences114,13(2017),3521–3526. MikeLewis,LukeZettlemoyer,andWen-tauYih.2024. REPLUG:Retrieval-
arXiv:https://www.pnas.org/doi/pdf/10.1073/pnas.1611835114doi:10.1073/pnas. AugmentedBlack-BoxLanguageModels.InProceedingsofthe2024Conference
1611835114 oftheNorthAmericanChapteroftheAssociationforComputationalLinguistics:
[14] TomKwiatkowski,JennimariaPalomaki,OliviaRedfield,MichaelCollins,Ankur HumanLanguageTechnologies(Volume1:LongPapers),KevinDuh,Helena
Parikh,ChrisAlberti,DanielleEpstein,IlliaPolosukhin,JacobDevlin,KentonLee, Gomez,andStevenBethard(Eds.).AssociationforComputationalLinguistics,
KristinaToutanova,LlionJones,MatthewKelcey,Ming-WeiChang,AndrewM. MexicoCity,Mexico,8371–8384.doi:10.18653/v1/2024.naacl-long.463
Dai,JakobUszkoreit,QuocLe,andSlavPetrov.2019. NaturalQuestions:A [30] ShamaneSiriwardhana,RivinduWeerasekera,ElliottWen,TharinduKaluarachchi,
BenchmarkforQuestionAnsweringResearch.TransactionsoftheAssociation RajibRana,andSurangaNanayakkara.2023.ImprovingtheDomainAdaptation
forComputationalLinguistics7(2019),452–466.doi:10.1162/tacl_a_00276 ofRetrievalAugmentedGeneration(RAG)ModelsforOpenDomainQuestion
[15] Woosuk Kwon, Zhuohan Li, Siyuan Zhuang, Ying Sheng, Lianmin Zheng, Answering. TransactionsoftheAssociationforComputationalLinguistics11
CodyHaoYu,JosephGonzalez,HaoZhang,andIonStoica.2023. Efficient (2023),1–17.doi:10.1162/tacl_a_00530
MemoryManagementforLargeLanguageModelServingwithPagedAttention. [31] AdamTrischler,TongWang,XingdiYuan,JustinHarris,AlessandroSordoni,
InProceedingsofthe29thSymposiumonOperatingSystemsPrinciples(Koblenz, PhilipBachman,andKaheerSuleman.2017.NewsQA:AMachineComprehen-
Germany)(SOSP’23).AssociationforComputingMachinery,NewYork,NY, sionDataset.InProceedingsofthe2ndWorkshoponRepresentationLearningfor
USA,611–626. doi:10.1145/3600006.3613165 NLP,PhilBlunsom,AntoineBordes,KyunghyunCho,ShayCohen,ChrisDyer,
[16] PatrickLewis,EthanPerez,AleksandraPiktus,FabioPetroni,VladimirKarpukhin, EdwardGrefenstette,KarlMoritzHermann,LauraRimell,JasonWeston,and
NamanGoyal,HeinrichKüttler,MikeLewis,Wen-tauYih,TimRocktäschel,Se- ScottYih(Eds.).AssociationforComputationalLinguistics,Vancouver,Canada,
bastianRiedel,andDouweKiela.2020. Retrieval-augmentedgenerationfor 191–200.doi:10.18653/v1/W17-2623
knowledge-intensiveNLPtasks.InProceedingsofthe34thInternationalConfer- [32] ShangqingTu,YuanchunWang,JifanYu,YuyangXie,YaranShi,XiaozhiWang,
enceonNeuralInformationProcessingSystems(Vancouver,BC,Canada)(NIPS JingZhang,LeiHou,andJuanziLi.2024.R-Eval:AUnifiedToolkitforEvalu-
atingDomainKnowledgeofRetrievalAugmentedLargeLanguageModels.In

WWW’26,April13–17,2026,Dubai,UnitedArabEmirates. SenleiZhangetal.
Proceedingsofthe30thACMSIGKDDConferenceonKnowledgeDiscovery
andDataMining(Barcelona,Spain)(KDD’24).AssociationforComputing
| Machinery,NewYork,NY,USA,5813–5824. |     |     | doi:10.1145/3637528.3671564 |     |     |     |
| ----------------------------------- | --- | --- | --------------------------- | --- | --- | --- |
[33] GidoM.vandeVenandAndreasS.Tolias.2019.Threescenariosforcontinual
| learning.arXiv:1904.07734[cs.LG]             |     |     | https://arxiv.org/abs/1904.07734 |                             |     |     |
| -------------------------------------------- | --- | --- | -------------------------------- | --------------------------- | --- | --- |
| [34] DennyVrandecˇic´andMarkusKrötzsch.2014. |     |     |                                  | Wikidata:afreecollaborative |     |     |
knowledgebase.Commun.ACM57,10(Sept.2014),78–85.doi:10.1145/2629489
[35] LucyLuWang,KyleLo,YoganandChandrasekhar,RussellReas,JiangjiangYang,
DougBurdick,DarrinEide,KathrynFunk,YannisKatsis,RodneyKinney,Yunyao
Li,ZiyangLiu,WilliamMerrill,PaulMooney,DeweyMurdick,DevvretRishi,
JerrySheehan,ZhihongShen,BrandonStilson,AlexWade,KuansanWang,Nancy
XinRuWang,ChrisWilhelm,BoyaXie,DouglasRaymond,DanielS.Weld,
OrenEtzioni,andSebastianKohlmeier.2020.CORD-19:TheCOVID-19Open
| ResearchDataset.arXiv:2004.10706[cs.DL] |     |     | https://arxiv.org/abs/2004.10706 |     |     |     |
| --------------------------------------- | --- | --- | -------------------------------- | --- | --- | --- |
[36] Chien-ShengWu,AndreaMadotto,WenhaoLiu,PascaleFung,andCaiming
| Xiong.2022. | QAConv:QuestionAnsweringonInformativeConversations.In |     |     |     |     |     |
| ----------- | ----------------------------------------------------- | --- | --- | --- | --- | --- |
Proceedingsofthe60thAnnualMeetingoftheAssociationforComputational
Linguistics(Volume1:LongPapers),SmarandaMuresan,PreslavNakov,and
AlineVillavicencio(Eds.).AssociationforComputationalLinguistics,Dublin,
Ireland,5389–5411.doi:10.18653/v1/2022.acl-long.370
[37] PengXu,WeiPing,XianchaoWu,ChejianXu,ZihanLiu,MohammadShoeybi,
andBryanCatanzaro.2025.ChatQA2:BridgingtheGaptoProprietaryLLMsin
| LongContextandRAGCapabilities.arXiv:2407.14482[cs.CL] |     |     |     |     | https://arxiv.org/ |     |
| ----------------------------------------------------- | --- | --- | --- | --- | ------------------ | --- |
abs/2407.14482
[38] AnYang,AnfengLi,BaosongYang,BeichenZhang,BinyuanHui,BoZheng,
BowenYu,ChangGao,ChengenHuang,ChenxuLv,ChujieZheng,Dayiheng
Liu,FanZhou,FeiHuang,FengHu,HaoGe,HaoranWei,HuanLin,Jialong
Tang,JianYang,JianhongTu,JianweiZhang,JianxinYang,JiaxiYang,Jing
Zhou,JingrenZhou,JunyangLin,KaiDang,KeqinBao,KexinYang,LeYu,
LianghaoDeng,MeiLi,MingfengXue,MingzeLi,PeiZhang,PengWang,Qin
Zhu,RuiMen,RuizeGao,ShixuanLiu,ShuangLuo,TianhaoLi,TianyiTang,
WenbiaoYin,XingzhangRen,XinyuWang,XinyuZhang,XuanchengRen,Yang
Fan,YangSu,YichangZhang,YingerZhang,YuWan,YuqiongLiu,ZekunWang,
ZeyuCui,ZhenruZhang,ZhipengZhou,andZihanQiu.2025.Qwen3Technical
| Report.arXiv:2505.09388[cs.CL]                       |                |                                  | https://arxiv.org/abs/2505.09388 |           |               |          |
| ---------------------------------------------------- | -------------- | -------------------------------- | -------------------------------- | --------- | ------------- | -------- |
| [39] Ori Yoran,                                      | Tomer Wolfson, | Ori                              | Ram, and Jonathan                |           | Berant. 2024. | Mak-     |
| ing Retrieval-Augmented                              |                | Language                         | Models                           | Robust to | Irrelevant    | Context. |
| arXiv:2310.01558[cs.CL]                              |                | https://arxiv.org/abs/2310.01558 |                                  |           |               |          |
| [40] ZichunYu,ChenyanXiong,ShiYu,andZhiyuanLiu.2023. |                |                                  |                                  |           | Augmentation- |          |
AdaptedRetrieverImprovesGeneralizationofLanguageModelsasGeneric
Plug-In.InProceedingsofthe61stAnnualMeetingoftheAssociationforCompu-
tationalLinguistics(Volume1:LongPapers),AnnaRogers,JordanBoyd-Graber,
andNaoakiOkazaki(Eds.).AssociationforComputationalLinguistics,Toronto,
Canada,2421–2436.doi:10.18653/v1/2023.acl-long.136
| [41] FriedemannZenke,BenPoole,andSuryaGanguli.2017. |     |     |     |     | Continuallearning |     |
| --------------------------------------------------- | --- | --- | --- | --- | ----------------- | --- |
throughsynapticintelligence.InProceedingsofthe34thInternationalConfer-
enceonMachineLearning-Volume70(Sydney,NSW,Australia)(ICML’17).
JMLR.org,3987–3995.
| [42] Bowen              | Zhao, Xi Xiao, | Guojun                           | Gan, Bin Zhang, | and               | Shutao  | Xia. 2019. |
| ----------------------- | -------------- | -------------------------------- | --------------- | ----------------- | ------- | ---------- |
| Maintaining             | Discrimination | and                              | Fairness in     | Class Incremental |         | Learning.  |
| arXiv:1911.07053[cs.CV] |                | https://arxiv.org/abs/1911.07053 |                 |                   |         |            |
| [43] Penghao            | Zhao, Hailin   | Zhang, Qinhan                    | Yu, Zhengren    | Wang,             | Yunteng | Geng,      |
| Fangcheng               | Fu, Ling       | Yang, Wentao                     | Zhang,          | Jie Jiang,        | and     | Bin Cui.   |
2024. Retrieval-AugmentedGenerationforAI-GeneratedContent:ASurvey.
| arXiv:2402.19473[cs.CV]                  |     | https://arxiv.org/abs/2402.19473 |                             |     |     |     |
| ---------------------------------------- | --- | -------------------------------- | --------------------------- | --- | --- | --- |
| [44] NanZhou,JiaxinChen,andDiHuang.2024. |     |                                  | iVPT:ImprovingTask-relevant |     |     |     |
InformationSharinginVisualPromptTuningbyCross-layerDynamicConnection.
| arXiv:2404.05207[cs.CV] |     | https://arxiv.org/abs/2404.05207 |     |     |     |     |
| ----------------------- | --- | -------------------------------- | --- | --- | --- | --- |

FlowRAG:ContinualLearningforDynamicRetrieverinRetrieval-AugmentedGeneration WWW’26,April13–17,2026,Dubai,UnitedArabEmirates.
A ExperiemntDetails Table6:DetailedPerformanceonTrainingOrder2
A.1 PromptTemplate
|                                                         |     |     |     |     |          | CovidQA  | NQ       | NewsQA | ConvQA      |
| ------------------------------------------------------- | --- | --- | --- | --- | -------- | -------- | -------- | ------ | ----------- |
| Theprompttemplatetogeneratetheresponseintheexperimentis |     |     |     |     | Trainon→ |          |          |        |             |
|                                                         |     |     |     |     |          | ACC@5 F1 | ACC@5 F1 | ACC@5  | F1 ACC@5 F1 |
showinFigure6.
REPULG
|     |     |     |     |     | CovidQA | 11.22 21.16 |             |             |             |
| --- | --- | --- | --- | --- | ------- | ----------- | ----------- | ----------- | ----------- |
|     |     |     |     |     | NQ      | 6.12 18.94  | 57.21 44.93 |             |             |
|     |     |     |     |     | NewsQA  | 2.70 14.95  | 40.71 35.84 | 29.05 22.13 |             |
|     |     |     |     |     | ConvQA  | 1.97 10.31  | 21.52 28.56 | 17.03 15.95 | 39.79 33.88 |
EndEndRAG
|     |     |     |     |     | CovidQA | 10.76 20.57 |             |             |             |
| --- | --- | --- | --- | --- | ------- | ----------- | ----------- | ----------- | ----------- |
|     |     |     |     |     | NQ      | 5.34 14.96  | 54.43 43.96 |             |             |
|     |     |     |     |     | NewsQA  | 2.64 12.96  | 37.83 37.98 | 32.21 24.22 |             |
|     |     |     |     |     | ConvQA  | 1.51 10.42  | 12.61 30.75 | 15.15 16.63 | 45.71 38.00 |
Atlas
|     |     |     |     |     | CovidQA | 11.90 21.77 |             |             |             |
| --- | --- | --- | --- | --- | ------- | ----------- | ----------- | ----------- | ----------- |
|     |     |     |     |     | NQ      | 7.34 18.77  | 55.84 44.68 |             |             |
|     |     |     |     |     | NewsQA  | 3.42 15.99  | 35.81 33.25 | 32.91 24.18 |             |
|     |     |     |     |     | ConvQA  | 2.53 12.97  | 17.86 26.70 | 16.99 16.70 | 44.66 36.67 |
L2R
|     |     |     |     |     | CovidQA | 11.75 21.88 |             |             |             |
| --- | --- | --- | --- | --- | ------- | ----------- | ----------- | ----------- | ----------- |
|     |     |     |     |     | NQ      | 9.50 19.46  | 55.56 44.13 |             |             |
|     |     |     |     |     | NewsQA  | 7.97 18.59  | 47.34 39.08 | 32.24 24.24 |             |
|     |     |     |     |     | ConvQA  | 6.15 16.98  | 39.84 35.84 | 27.85 22.03 | 43.70 37.80 |
Figure6:Theprompttogeneratetheresponseintheexperiment.
Table7:DetailedPerformanceonTrainingOrder3
B Device
|                                                           |     |     |     |     |          | ConvQA   | CovidQA  | NewsQA | NQ          |
| --------------------------------------------------------- | --- | --- | --- | --- | -------- | -------- | -------- | ------ | ----------- |
| Thisinformationaboutthedevicecurrentlyusedintheexperiment |     |     |     |     | Trainon→ |          |          |        |             |
|                                                           |     |     |     |     |          | ACC@5 F1 | ACC@5 F1 | ACC@5  | F1 ACC@5 F1 |
islistin4.
REPULG
|     |                           |     |     |     | ConvQA  | 38.87 33.22 |             |             |             |
| --- | ------------------------- | --- | --- | --- | ------- | ----------- | ----------- | ----------- | ----------- |
|     | Table4:deviceinformation. |     |     |     | CovidQA | 29.09 25.30 | 12.69 22.88 |             |             |
|     |                           |     |     |     | NewsQA  | 17.07 18.10 | 6.08 17.83  | 19.49 17.30 |             |
|     |                           |     |     |     | NQ      | 9.54 9.79   | 3.55 12.96  | 10.45 10.78 | 50.39 42.63 |
Detail
EndEndRAG
|     |     |                        |     |     | ConvQA  | 43.44 35.94 |             |     |     |
| --- | --- | ---------------------- | --- | --- | ------- | ----------- | ----------- | --- | --- |
|     | CPU | IntelXeonPlatinum8368Q |     |     |         |             |             |     |     |
|     |     |                        |     |     | CovidQA | 32.96 29.15 | 13.03 22.85 |     |     |
GPU 2×NVIDIAA10080GB NewsQA 19.96 20.41 7.42 15.76 30.92 22.61
|     |             |      |     |     | NQ  | 12.30 12.43 | 2.72 10.63 | 22.34 16.00 | 55.20 44.40 |
| --- | ----------- | ---- | --- | --- | --- | ----------- | ---------- | ----------- | ----------- |
|     | CUDAVersion | 12.8 |     |     |     |             |            |             |             |
Atlas
|     |     |     |     |     | ConvQA  | 41.87 35.30 |             |             |     |
| --- | --- | --- | --- | --- | ------- | ----------- | ----------- | ----------- | --- |
|     |     |     |     |     | CovidQA | 33.81 28.29 | 12.75 22.38 |             |     |
|     |     |     |     |     | NewsQA  | 21.70 14.38 | 9.59 19.52  | 30.76 23.16 |     |
C ResultDetails NQ 14.48 9.46 4.95 14.92 19.70 15.24 53.70 44.72
L2R
|     |     |     |     |     | ConvQA | 41.60 35.98 |     |     |     |
| --- | --- | --- | --- | --- | ------ | ----------- | --- | --- | --- |
Table5:DetailedPerformanceonTrainingOrder1 CovidQA 37.39 32.86 12.95 24.59
|          |          |          |        |             | NewsQA | 28.10 27.13 | 10.31 21.99 | 30.60 23.35 |             |
| -------- | -------- | -------- | ------ | ----------- | ------ | ----------- | ----------- | ----------- | ----------- |
|          |          |          |        |             | NQ     | 24.44 23.74 | 7.92 18.48  | 24.15 20.71 | 56.29 43.13 |
| Trainon→ | CovidQA  | NewsQA   | ConvQA | NQ          |        |             |             |             |             |
|          | ACC@5 F1 | ACC@5 F1 | ACC@5  | F1 ACC@5 F1 |        |             |             |             |             |
Table5–7reportdetailedresultsforallmethodsunderthree
REPULG
| CovidQA | 11.22 21.77 |     |     |     |     |     |     |     |     |
| ------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
sequenceorders,usingtheLlamamodelasthegenerator:
| NewsQA | 8.70 18.42 | 31.84 24.10 |     |     |     |     |     |     |     |
| ------ | ---------- | ----------- | --- | --- | --- | --- | --- | --- | --- |
ConvQA 4.79 15.44 22.85 19.90 38.16 37.89 (1)CovidQA→NewsQA→ConvQA→NQ
NQ 2.98 12.16 13.35 11.02 25.23 28.60 56.46 53.86 (2)CovidQA→NQ→NewsQA→CovidQA
| EndEndRAG |             |     |     |     | (3)ConvQA→CovidQA→NewsQA→NQ |     |     |     |     |
| --------- | ----------- | --- | --- | --- | --------------------------- | --- | --- | --- | --- |
| CovidQA   | 10.76 21.16 |     |     |     |                             |     |     |     |     |
Wereporttwoevaluationmetrics:(1)Top-5retrievalaccuracy.
| NewsQA | 7.47 16.51 | 32.62 23.65 |             |     |     |     |     |     |     |
| ------ | ---------- | ----------- | ----------- | --- | --- | --- | --- | --- | --- |
| ConvQA | 4.45 15.59 | 22.13 18.90 | 46.44 32.61 |     |     |     |     |     |     |
(2)F1score.
| NQ  | 3.00 11.33 | 11.15 12.74 | 27.72 25.02 | 54.89 50.87 |     |     |     |     |     |
| --- | ---------- | ----------- | ----------- | ----------- | --- | --- | --- | --- | --- |
Baselines.Forfine-tuningmethods,wetraintheretrieverwith
Atlas
|         |             |     |     |     | AdamW,usingalearningrateof1×10−5 |     |     | andawarm-upratioof |     |
| ------- | ----------- | --- | --- | --- | -------------------------------- | --- | --- | ------------------ | --- |
| CovidQA | 11.90 20.57 |     |     |     |                                  |     |     |                    |     |
NewsQA 7.14 17.56 29.35 20.78 0.1.ForL2R,wefollowtheexperimentalsetupfromtheoriginal
| ConvQA | 5.11 14.12 | 19.31 15.30 | 39.87 33.30 |             | paper[2]. |     |     |     |     |
| ------ | ---------- | ----------- | ----------- | ----------- | --------- | --- | --- | --- | --- |
| NQ     | 1.25 10.67 | 10.51 9.87  | 23.87 20.85 | 53.84 52.68 |           |     |     |     |     |
L2R
| CovidQA | 11.27 21.07 |             |             |             |     |     |     |     |     |
| ------- | ----------- | ----------- | ----------- | ----------- | --- | --- | --- | --- | --- |
| NewsQA  | 10.68 19.94 | 29.17 21.47 |             |             |     |     |     |     |     |
| ConvQA  | 9.14 18.29  | 26.08 18.47 | 39.56 33.57 |             |     |     |     |     |     |
| NQ      | 7.98 15.11  | 21.77 14.26 | 29.60 27.40 | 58.44 52.17 |     |     |     |     |     |