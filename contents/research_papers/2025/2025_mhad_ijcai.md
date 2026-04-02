ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
|     | Detecting |     | Hallucination |     |          | in Large       | Language |          | Models | Through |     |     |     |
| --- | --------- | --- | ------------- | --- | -------- | -------------- | -------- | -------- | ------ | ------- | --- | --- | --- |
|     |           |     | Deep          |     | Internal | Representation |          | Analysis |        |         |     |     |     |
LuanZhang1, DandanSong1∗, ZhijingWu1, YuhangTian1, ChangzhiZhou1, JingXu1,
Ziyi
|     |     |     |     |     | Yang2 | and | ShuhaoZhang3 |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ----- | --- | ------------ | --- | --- | --- | --- | --- | --- |
1SchoolofComputerScienceandTechnology,BeijingInstituteofTechnology,China
2SchoolofCyberspaceScienceandTechnology,BeijingInstituteofTechnology,China
3SchoolofComputerScienceandTechnology,HuazhongUniversityofScienceandTechnology,China
{luan zhang,sdd,zhijingwu,tianyuhang,zhou changzhi97,xujing,yziyi}@bit.edu.cn,
|     |     |          |     |     | shuhao | zhang@hust.edu.cn |                                                   |            |      |      |             |                 |     |
| --- | --- | -------- | --- | --- | ------ | ----------------- | ------------------------------------------------- | ---------- | ---- | ---- | ----------- | --------------- | --- |
|     |     | Abstract |     |     |        |                   | CurrentresearchonhallucinationdetectionforLLMscan |            |      |      |             |                 |     |
|     |     |          |     |     |        |                   | be broadly                                        | classified | into | four | categories: | retrieval-based |     |
Largelanguagemodels(LLMs)haveshownexcep-
|                    |     |        |         |          |     |      | methods, | sampling-based                |     | methods, | uncertainty-based |     | meth-      |
| ------------------ | --- | ------ | ------- | -------- | --- | ---- | -------- | ----------------------------- | --- | -------- | ----------------- | --- | ---------- |
| tional performance |     | across | various | domains. |     | How- |          |                               |     |          |                   |     |            |
|                    |     |        |         |          |     |      | ods, and | internal-representation-based |     |          | methods.          |     | Retrieval- |
ever,LLMsarepronetohallucinatefactsandgen-
|                   |     |            |     |       |               |     | based methods |     | [Li et | al., 2023; | Min et | al., 2023] | evaluate |
| ----------------- | --- | ---------- | --- | ----- | ------------- | --- | ------------- | --- | ------ | ---------- | ------ | ---------- | -------- |
| erate non-factual |     | responses, |     | which | can undermine |     |               |     |        |            |        |            |          |
theveracityoftheresponsegeneratedbyLLMsagainstexter-
their reliability in real-world applications. Cur- nalknowledgesources. However,thesemethodsrelyheavily
| rent hallucination |     | detection |     | methods | suffer | from |     |     |     |     |     |     |     |
| ------------------ | --- | --------- | --- | ------- | ------ | ---- | --- | --- | --- | --- | --- | --- | --- |
onexternalknowledgesources,whichmaynotalwaysbeac-
| external                           | resource | demands,                       |                          | substantial    | time      | over-  |                   |                |                                        |             |          |            |               |
| ---------------------------------- | -------- | ------------------------------ | ------------------------ | -------------- | --------- | ------ | ----------------- | -------------- | -------------------------------------- | ----------- | -------- | ---------- | ------------- |
|                                    |          |                                |                          |                |           |        | cessible.         | Sampling-based |                                        | methods     | [Manakul |            | et al., 2023; |
| head, difficulty                   |          | overcoming                     |                          | LLMs’          | intrinsic | limi-  |                   |                |                                        |             |          |            |               |
|                                    |          |                                |                          |                |           |        | Mu¨ndleretal.,    |                | 2024]assessinformationconsistencyamong |             |          |            |               |
| tation,andinsufficientmodeling.    |          |                                |                          | Inthispaper,we |           |        |                   |                |                                        |             |          |            |               |
|                                    |          |                                |                          |                |           |        | multiple          | sampled        | responses                              | from        | the      | same       | LLM. How-     |
| propose                            | MHAD,    | a novel                        | internal-representation- |                |           |        |                   |                |                                        |             |          |            |               |
|                                    |          |                                |                          |                |           |        | ever, these       | methods        | are                                    | impractical | for      | real-time  | scenarios     |
| basedhallucinationdetectionmethod. |          |                                |                          |                | MHADuti-  |        |                   |                |                                        |             |          |            |               |
|                                    |          |                                |                          |                |           |        | due to the        | excessive      | time                                   | overhead    | of       | multiple   | samplings.    |
| lizes linear                       | probing  |                                | to select                | neurons        | and       | layers |                   |                |                                        |             |          |            |               |
|                                    |          |                                |                          |                |           |        | Uncertainty-based |                | methods                                | [Zhang      | et       | al., 2023; | Manakul       |
| withinLLMs.                        |          | Theselectedneuronsandlayersare |                          |                |           |        |                   |                |                                        |             |          |            |               |
etal.,2023]evaluatethefactualaccuracyofLLM-generated
| demonstrated |     | with significant |     | awareness | of  | hallu- |     |     |     |     |     |     |     |
| ------------ | --- | ---------------- | --- | --------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
responsesbycalculatingtheprobabilityorentropyoftokens
| cinations        | at the      | initial | and final | generation  |                | steps. |                |           |     |               |           |           |            |
| ---------------- | ----------- | ------- | --------- | ----------- | -------------- | ------ | -------------- | --------- | --- | ------------- | --------- | --------- | ---------- |
|                  |             |         |           |             |                |        | within them.   | Although  |     | these         | methods   | eliminate | the need   |
| By concatenating |             | the     | outputs   | from        | these selected |        |                |           |     |               |           |           |            |
|                  |             |         |           |             |                |        | for additional | resources |     | like external | knowledge |           | sources or |
| neurons          | of selected |         | layers at | the initial | and            | final  |                |           |     |               |           |           |            |
sampledresponsesfromLLMs,theypresentsignificantchal-
| generation | steps, | a hallucination |     | awareness |     | vector |                                                 |     |     |     |     |     |      |
| ---------- | ------ | --------------- | --- | --------- | --- | ------ | ----------------------------------------------- | --- | --- | --- | --- | --- | ---- |
|            |        |                 |     |           |     |        | lengesinaddressingtheintrinsiclimitationofLLMs: |     |     |     |     |     | LLMs |
isformed,enablingprecisehallucinationdetection
cangeneratehallucinationswithhighconfidence[Azariaand
viaanMLP.Additionally,weintroduceSOQHD,a
|     |     |     |     |     |     |     | Mitchell,2023;Schulman,2023]. |     |     |     | Internal-representation- |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | ------------------------ | --- | --- |
novel benchmark for evaluating hallucination de- basedmethods[AzariaandMitchell,2023;Suetal.,
2024;
| tection     | in Open-Domain |      | QA   | (ODQA).     | Extensive |        |          |              |                |         |              |       |                |
| ----------- | -------------- | ---- | ---- | ----------- | --------- | ------ | -------- | ------------ | -------------- | ------- | ------------ | ----- | -------------- |
|             |                |      |      |             |           |        | Chen et  | al., 2024;   | Du             | et al., | 2024] detect |       | hallucinations |
| experiments | show           | that | MHAD | outperforms |           | exist- |          |              |                |         |              |       |                |
|             |                |      |      |             |           |        | based on | the internal | representation |         | of           | LLMs. | Azaria and     |
inghallucinationdetectionmethodsacrossmultiple
Mitchell[2023]showthattheinternalrepresentationdemon-
LLMs,demonstratingsuperioreffectiveness.
|     |     |     |     |     |     |     | strates greater | reliability |     | than uncertainty. |     | However, | these |
| --- | --- | --- | --- | --- | --- | --- | --------------- | ----------- | --- | ----------------- | --- | -------- | ----- |
methodsstillsufferfrominsufficientmodelingastheyneglect
1 Introduction
thecomplementaryinformationacrosslayersandgeneration
stepsofLLMs.
Althoughlargelanguagemodels(LLMs)havedemonstrated
remarkable performance across diverse fields [Wu et al., To address the above issues, we propose MHAD (Model
2023; Thirunavukarasu et al., 2023; Hedderich et al., 2024; Hallucination Awareness for Hallucination Detection), a
Wang et al., 2024], they are known to have a risk of gener- novelinternal-representation-basedmethodtodetecthalluci-
ating hallucinations [Bang et al., 2023; Shen et al., 2023]. nationsinLLMs. Weassumethattheinternalrepresentations
Hallucinations—instances where LLMs generate responses ofLLMsencompasstheirawarenessofwhethertheresponses
that appear plausible but are factually incorrect—hinder the theygeneratearehallucinatedorfactual. Ourbasicideaisto
adoptionofLLMsinreal-worldapplicationsthatrequirehigh model the hallucination awareness in LLMs based on their
reliability and factual correctness [Ji et al., 2023; Huang et internal representations across layers during the generation
al., 2023]. Detectinghallucinationshelpsreliablyassessthe processfordetectinghallucinations.
truthfulnessofLLM-generatedresponses. AfterLLMsprocessthequerybutbeforegeneratingare-
∗Correspondingauthor sponse,theyonlyencodethequerywithoutencodinganyhal-
Project:https://github.com/Z-Luan/DIRA-HD lucination. When LLMs generate the termination token, the
8357

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
factuality of the responses is determined, as the termination 2 MHAD
token itself is hallucination-free, and the generation process
In this section, we introduce MHAD (Model Hallucination
ceasesoncetheterminationtokenisgenerated. Wefocuson
Awareness for Hallucination Detection), a novel internal-
the internal representation at the initial and final generation
representation-based hallucination detection method. Three
steps. Moreover,someworkssuggestthatdifferentlayersof
types of internal representations are primarily utilized: at-
transformer-based language models capture various aspects
tention output, feed-forward network output, and layer out-
of the input, from basic lexical and grammatical features in
put. MHADconsistsofseveralkeysteps: internalrepresen-
lowerlayerstomoreabstractconceptsinhigherlayers[Jawa-
tation collection, linear probing, neuron selection, layer se-
har et al., 2019; Sajjad et al., 2022; Wang et al., 2022;
lection,andhallucinationawarenessvectorconstruction. The
Voita et al., 2024]. Therefore, we harness the complemen-
overviewofMHADisprovidedinFigure1.
taryinformationacrosslayersofLLMstoenhancethemod-
eling of hallucination awareness. Specifically, we leverage 2.1 InternalRepresentationCollection
linear probing [Alain and Bengio, 2017; Burns et al., 2023;
WefeedthequestionintoLLMsandgathertheinternalrep-
Park et al., 2024] to select neurons and layers within LLMs
resentationsfromeachlayerattheinitialandfinalgeneration
thatdemonstratesignificantawarenessofhallucinationsatthe
steps.
initial and final generation steps. By concatenating the out-
To comprehend the internal representations, the mecha-
putsfromtheselectedneuronsofselectedlayersattheinitial
nismofthestandardTransformerisformalized.Theessential
and final generation steps, a hallucination awareness vector
computations involve query, key, and value vectors derived
is formed. The vector is then used to detect hallucinations
from the hidden state, concatenation of attention heads out-
via a multi-layer perceptron (MLP). MHAD eliminates the
put,andfeed-forwardnetworktransformations. Specifically,
needforexternalknowledgesourcesormultiplesampledre-
theattentionoutput(AO),feed-forwardnetworkoutput(FO),
sponsesanddemonstratessuperiorperformance.
andlayeroutput(LO)areextractedasfollows:
To evaluate MHAD thoroughly, we develop SOQHD
(Sustainable Open-Domain QA Hallucination Detection), Q =XWQ, (1)
a novel benchmark for hallucination detection in ODQA. h h
ODQA is a challenging knowledge-intensive task and rele- K =XWK, (2)
h h
vant to practical use cases [Guu et al., 2020; Lewis et al.,
V =XWV, (3)
2020; Friel and Sanyal, 2023]. We hence focus on detect- h h
ing hallucinations in ODQA. Previous benchmarks [Li et AO=concat (softmax(Q KT)V )WO, (4)
h h h h
al., 2023; Manakul et al., 2023; Azaria and Mitchell, 2023;
H =X +AO, (5)
Friel and Sanyal, 2023] have primarily focused on specific
datatypes,suchasresponsesgeneratedbyLLMsalongwith FO=f act (HW 1 +b 1 )W 2 +b 2 , (6)
hallucination labels, thereby limiting their applicability to LO=H +FO, (7)
evaluate internal-representation-based methods. Moreover,
thesebenchmarksdonotconsidertemporalconsistencydur- where X represents the hidden state, W h Q, W h K, W h V are
ing construction, which may result in outdated labels. For the projection matrices for computing the query vector Q h ,
example,thelabelforquestionslike—Tothenearestmillion, key vector K h , and value vector V h of the h-th attention
what is the population of Australia?—needs to be updated head,concatdenotestheconcatenationoperation,WO isthe
to reflect the latest population. SOQHD provides not only projectionmatrixafterconcatenation, W 1 ,b 1 ,W 2 ,b 2 arethe
the LLM-generated responses, along with hallucination la- weights and biases of the feed-forward network (FFN), and
bels,butalsotheinternalrepresentationsacrosslayersduring f act denotestheactivationfunctionintheFFN.Notethatcur-
thegenerationprocessofmultipleLLMs,suchasLLaMA3- rentLLMsmayreplacetheFFNwiththeGatedLinearUnit.
Instruction-8B[Meta,2024].Additionally,SOQHDexcludes
2.2 LinearProbing
questionswithanswersthatvaryovertimetoensuretemporal
consistency. Ourcontributionsarethreefold: Linear probing [Alain and Bengio, 2017] initially trains an
auxiliaryclassifierbasedontheinternalactivationlayerout-
• We propose MHAD, a novel hallucination detection
putsofneuralnetworkstodetectcertainattributesofthein-
method, which utilizes the internal representations
put. Weuselinearprobingtomodelthehallucinationaware-
acrosslayersduringthegenerationprocessofLLMsto
nesswithintheinternalrepresentationsofLLMs.
detecthallucinations.
Specifically,weconstructalinearprobeclassifierforeach
• We develop SOQHD, a novel hallucination detec- layer at the initial and final generation steps. Each linear
tion benchmark for ODQA, which provides the LLM- probeclassifierisatwo-layerFFN,withitsinputcorrespond-
generatedresponsesalongwithhallucinationlabelsand ingtothedimensionoftheinternalrepresentation.Theoutput
the internal representations of LLMs, while ensuring oftheclassifierisabinarylabel,indicatingwhethertheLLMs
temporalconsistency. generate hallucination. This step offers guidance for subse-
quentneuronandlayerselectionsteps. Thetrainingprocess
• Weconductextensiveexperimentsonmultipledatasets,
ofthelinearprobeclassifierisformulatedas:
demonstratingthatMHADoutperformsexistinghalluci-
nationdetectionmethodsacrossmultipleLLMsinterms Wˆt,ˆbt ←arg min BCE(Y,σ(ItWt+bt)), (8)
ofeffectiveness. l l Wt,bt l l l
l l
8358

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
Internal Representation Collection Linear Probing Neuron & Layer Selection HAV Construction
D
T
LO
l
Decoder Block Layer
FO
|     |     |              |     | l    |     | I   |     |     |     |     |     |     |     |
| --- | --- | ------------ | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L   |     | Feed-Forward |     |      |     | l   |     |     |     |     | +   |     |     |
|     |     |              |     | AO l |     | It  |     |     |     |     |     |     |     |
|     |     | Attention    |     |      |     | l   |     |     |     |     |     |     |     |
2L x
|     |     | Question |     |     |     |     |     | t=1 |     | t=T |     |     |     |
| --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
L: layer number of LLMs LO: layer output FO: feed-forward network output AO: attention output I: any internal representation
D: dimension of I T: total number of generation steps l: any layer t: any genetation step HAV: hallucination awareness vector
Figure1:OverviewofMHAD.Wefocusontheinternalrepresentationsattheinitialandfinalgenerationsteps(orangetable).Neurons(gray
bold line) and layers (yellow node) within LLMs that demonstrate significant awareness of hallucinations are selected by linear probing.
Theoutputsfromtheseselectedneuronsofselectedlayersattheinitialandfinalgenerationstepsareconcatenatedtoformthehallucination
awarenessvector(greentable),whichenablesprecisehallucinationdetectionviaamulti-layerperceptron(MLP).
where It represents the internal representations of the l-th whereAistheindexsetoftheweightparameterssortedinde-
l
layer at the t-th generation step, σ is the sigmoid activation scendingorderoftheirabsolutevalues,A denotestheindex
k
function,mappingtheoutputofthelinearprobeclassifierto oftheweightparameterwiththek-thlargestabsolutevalue,
|     | (0,1) |     |     |     |     |     | Wˆt |     |     |     |     |     |     |
| --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
the range, BCE is the binary cross-entropy loss func- representsthevalueoftheweight,whichranksasthe
|     | t   | bt  |     |     |     |     | l ,A | k   |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- |
tion, W and are the trainable weights and biases of the k-t h l argestinabsolutevalue,αisthepredefinedratiothresh-
|                            | l   | l   |                         |     |     |     |      |     |            |           |            |         |          |
| -------------------------- | --- | --- | ----------------------- | --- | --- | --- | ---- | --- | ---------- | --------- | ---------- | ------- | -------- |
| linearprobeclassifier,andY |     |     | istheground-truthlabel. |     |     |     |      | Nˆt |            |           |            |         |          |
|                            |     |     |                         |     |     |     | old, | and | represents | the index | set of the | neurons | selected |
l
|     |     |     |     |     |     |     | in the | l-th layer | at the | t-th generation | step | of LLMs. | Note |
| --- | --- | --- | --- | --- | --- | --- | ------ | ---------- | ------ | --------------- | ---- | -------- | ---- |
2.3 NeuronSelection
|     |     |     |     |     |     |     | that | the smaller | the α, | the less | likely it is | to select | neurons |
| --- | --- | --- | --- | --- | --- | --- | ---- | ----------- | ------ | -------- | ------------ | --------- | ------- |
Hanetal.[2016]assessedtheimportanceofneuralnetwork correspondingtoweightswithsmallabsolutevalues.
| weightparametersbytheirabsolutevalues, |     |     |     |     | settinginsignifi- |     |     |     |     |     |     |     |     |
| -------------------------------------- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- |
cantweightsto0forweightpruning. Weselectneuronsthat 2.4 LayerSelection
demonstratesignificantawarenessofhallucinationsbasedon We select layers that demonstrate significant awareness of
theabsolutevalueofthelinearprobclassifier’sweightparam- hallucinations based on the performance of the linear prob
eters. Neuronswithlargerabsoluteweightvaluesareconsid- classifier.Thebettertheperformanceofthelinearprobeclas-
eredmoreinformativeforhallucinationdetection.
sifier,themoresignificantthehallucinationawarenesswithin
Specifically,wefirstsortthelinearprobclassifier’sweight
theinternalrepresentationsofthecorrespondinglayer.
parameters in descending order based on their absolute val- Specifically, we employ two heuristic rules: (i) using the
ues.Wethengothroughtheseweightparametersfromlargest top-kmethodtoselectthetop-performinglayers,and(ii)set-
tosmallest. Whentheratioofthecumulativesumofsquared tingathresholdtoselectlayerswithAUROCabovethepre-
| weight | values       | to the total | sum | of squared | weight      | values ex- |                  |           |           |            |           |           |           |
| ------ | ------------ | ------------ | --- | ---------- | ----------- | ---------- | ---------------- | --------- | --------- | ---------- | --------- | --------- | --------- |
|        |              |              |     |            |             |            | defined          | threshold | on the    | validation | set.      | Given the | variance  |
| ceeds  | a predefined | threshold,   |     | we select  | the neurons | corre-     |                  |           |           |            |           |           |           |
|        |              |              |     |            |             |            | in hallucination |           | awareness | across     | different | layers,   | this step |
sponding to the traversed weight parameters. Squaring the helpsmitigatetheinterferencefromthelayersdemonstrating
weightvaluesisintendedtoreducetheimpactofweightpa- weakawarenessofhallucinations.
| rameterswithsmallabsolutevalues. |     |     |     | Sincetheinternalrepre- |     |     |     |     |     |     |     |     |     |
| -------------------------------- | --- | --- | --- | ---------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sentationsarehigh-dimensionalvectors,thisstepreducesthe 2.5 HallucinationAwarenessVectorConstruction
| introductionofnoiseirrelevanttohallucination. |     |     |     |     | Theprocess |     |     |     |     |     |     |     |     |
| --------------------------------------------- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
Thelaststepfirstconstructsahallucinationawarenessvector
ofneuronselectionisformulatedas:
throughconcatenatingtheoutputsfromtheselectedneurons
ofselectedlayersattheinitialandfinalgenerationsteps.This
|     |      | A=argsort(abs(Wˆt)), |          |        |        | (9)  |                                                          |     |                           |       |           |     |      |
| --- | ---- | -------------------- | -------- | ------ | ------ | ---- | -------------------------------------------------------- | --- | ------------------------- | ----- | --------- | --- | ---- |
|     |      |                      |          | l      |        |      | vectorencapsulatesthecriticalinformationnecessaryforhal- |     |                           |       |           |     |      |
|     |      |                      |          |        |        |      | lucinationdetection.                                     |     | Theprocessisformulatedas: |       |           |     |      |
|     | i−1  |                      |          | i      |        |      |                                                          |     |                           |       |           |     |      |
|     | X    |                      |          | X      |        |      |                                                          |     |                           |       |           |     |      |
|     |      | (Wˆ t )2 <α·||Wˆ     |          | t||2 ≤ | (Wˆ t  | )2,  |                                                          |     |                           |       |           |     |      |
|     |      | l ,Ak                |          | l 2    | l ,Ak  |      |                                                          |     | Iˆ=concat                 |       | (I t ),   |     | (12) |
|     |      |                      |          |        |        | (10) |                                                          |     |                           | t,ˆlt | ˆl t,Nˆ t |     |      |
|     | k =1 |                      |          | k =1   |        |      |                                                          |     |                           |       | lˆ t      |     |      |
|     |      |                      | 1≤i≤|A|, |        | 0<α<1, |      | wheretdenotesthet-thgenerationstep,ˆlt                   |     |                           |       |           |     |      |
representsthein-
|     |     | Nˆ t |     |              |     |      | dexofaselectedlayeratthet-thgenerationstep,I |     |     |     |     |     | t rep- |
| --- | --- | ---- | --- | ------------ | --- | ---- | -------------------------------------------- | --- | --- | --- | --- | --- | ------ |
|     |     | ={A  | |k  | =1,2,...,i}, |     | (11) |                                              |     |     |     |     | ˆl  | t,Nˆ t |
|     |     | l    | k   |              |     |      |                                              |     |     |     |     |     | lˆ t   |
8359

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
resentstheoutputsfromtheselectedneuronsoftheselected
|     |     |     |     |     |     |     |     | Model |     | H=0Rate |     | CompleteRate |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | ------- | --- | ------------ | --- |
layeratthet-thgenerationstep,andIˆdenotesthehallucina-
|     |     |     |     |     |     |     |     | Alpaca-7B |     |     | 0.476 | 1.000 |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --- | ----- | ----- | --- |
tionawarenessvector. AnMLPisthentrainedbasedonthe Vicuna-7B 0.464 0.998
hallucinationawarenessvectortodetecthallucinations. LLaMA2-Chat-7B 0.545 0.999
|     |     |     |     |     |     |     |     | LLaMA2-Chat-13B       |     |     | 0.573 | 1.000 |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | ----- | ----- | --- |
|     |     |     |     |     |     |     |     | LLaMA3-Instruction-8B |     |     | 0.634 | 1.000 |     |
3 TheSOQHDBenchmark
In this section, we introduce SOQHD (Sustainable Open- Table1: H=0rateandcompleterateofLLMsonthetrainingsetof
Domain QA Hallucination Detection), a novel hallucination SOQHD.TheH=0ratereferstotheproportionofLLM-generated
detectionbenchmarkforODQA.Theconstructionprocessin- responsesthatcontainnohallucinations.Thecompleteratedenotes
cludesthreesteps: filtering,sampling,andreasoning. theproportionofresponsesthatendwiththeterminationtoken.
3.1 Filtering
|     |     |     |     |     |     |     |     | In this | step, questions | from | SOQHD | are inputted | into |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | --------------- | ---- | ----- | ------------ | ---- |
Thefilteringstepaimstoexcludequestionswithanswersthat multiple LLMs to generate responses. Normalization op-
varyovertimetoensuretemporalconsistency. Forexample, erations, including removing punctuation and converting to
the labels for questions like “To the nearest million, what is lowercase, are applied before inputting the questions. The
thepopulationofAustralia?” havebecomeoutdatedasthey greedy decoding strategy is employed. Since LLMs tend to
failtoreflectcurrentdata. bewordy,whichmakestheExactMatch(EM)score,thetra-
ditionalevaluationmetricforODQAtasks[Chenetal.,2017;
| This step | begins | with | the manual |     | annotation | of a small |     |     |     |     |     |     |     |
| --------- | ------ | ---- | ---------- | --- | ---------- | ---------- | --- | --- | --- | --- | --- | --- | --- |
sample of questions from the development sets of Trivi- IzacardandGrave,2021],notapplicable. Thus,weconsider
aQA[Joshietal.,2017]andNQ[Kwiatkowskietal.,2019], a response to have hallucination if it does not contain the
whicharewidelyusedODQAbenchmarks. gpt-3.5-turbois ground-truth answer; otherwise, it is considered not to have
also used to annotate these samples. Statistics indicate that hallucination. Thegeneratedresponses,hallucinationlabels,
|     |     |     |     |     |     |     | and | internal | representations | across | layers | during the | genera- |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | --------------- | ------ | ------ | ---------- | ------- |
theannotationresultsofgpt-3.5-turboachieveaconsistency
rateofupto96%withhumanannotations. Therefore,wean- tionprocessarestoredtoformthefinalSOQHD.
| notatetheremainingquestionsusinggpt-3.5-turbo. |     |     |     |     |     | Inspired |     |     |     |     |     |     |     |
| ---------------------------------------------- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
3.4 Analysis
| by self-consistency |     | [Wang | et  | al., 2023], | we  | have gpt-3.5- |     |     |     |     |     |     |     |
| ------------------- | --- | ----- | --- | ----------- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- |
turbo annotate each question five times and obtain the final The hallucination-free (H=0) rate and complete rate of five
LLMsonthetrainingsetofSOQHDareshowninTable1.
annotationresultviamajorityvoting,ensuringhighaccuracy.
QuestionsinthedevelopmentsetsofTriviaQAandNQwith FindingsindicatethatlargerLLMsgenerallyperformbet-
time-varyinganswersarethenfilteredout. ter, withLLaMA3-Instruction-8Boutperformingevenlarger
models. Moreover,LLMscantypicallyanswerthequestions
| 3.2 Sampling |      |              |     |       |          |           | fromSOQHDwithinthemaximumgenerationlength. |     |     |     |     |     |     |
| ------------ | ---- | ------------ | --- | ----- | -------- | --------- | ------------------------------------------ | --- | --- | --- | --- | --- | --- |
| This step    | aims | to construct | the | SOQHD | question | set while |                                            |     |     |     |     |     |     |
preservingtheoriginaldatasets’responselengthdistribution. 4 Experiments
To ensure that the final token generated by LLMs is the 4.1 Experimentsetting
| termination  | token,     | questions | that      | LLaMA2-Chat-13B |           | [Tou-     |                                 |     |              |             |      |                    |       |
| ------------ | ---------- | --------- | --------- | --------------- | --------- | --------- | ------------------------------- | --- | ------------ | ----------- | ---- | ------------------ | ----- |
|              |            |           |           |                 |           |           | Dataset                         |     | and Metrics. | We evaluate | MHAD | and other          | base- |
| vron et      | al., 2023] | cannot    | answer    | within          | a maximum | gener-    |                                 |     |              |             |      |                    |       |
|              |            |           |           |                 |           |           | linesonourproposedSOQHDdataset. |     |              |             |      | Consistentwithpre- |       |
| ation length | of         | 300 are   | excluded. | The             | remaining | questions |                                 |     |              |             |      |                    |       |
viousstudies[Chenetal.,2024;Duetal.,2024],weuseAU-
arestratifiedintothreelevelsbasedonthelengthofresponse
|     |     |     |     |     |     |     | ROCastheevaluationmetric. |     |     | AUROCisapopularmetricto |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------- | --- | --- | ----------------------- | --- | --- | --- |
generatedbyLLaMA2-Chat-13B.Stratifiedsamplingisthen
evaluatethequalityofabinaryclassifier.Wealsoevaluateon
usedtoformthequestionsetofSOQHD.Thetrainingsetof
theexistingHaluEval[Lietal.,2023]dataset.
| SOQHD | contains | a total | of 2000 | questions, |     | and the test set |            |     |           |               |      |             |        |
| ----- | -------- | ------- | ------- | ---------- | --- | ---------------- | ---------- | --- | --------- | ------------- | ---- | ----------- | ------ |
|       |          |         |         |            |     |                  | Baselines. |     | We choose | the following | nine | competitive | hallu- |
comprises500questions.
|     |     |     |     |     |     |     | cination                     |     | detection methods | as baselines. |                         | (i) Probability | As- |
| --- | --- | --- | --- | --- | --- | --- | ---------------------------- | --- | ----------------- | ------------- | ----------------------- | --------------- | --- |
|     |     |     |     |     |     |     | sessment[Manakuletal.,2023]: |     |                   |               | Thismethoddetectshallu- |                 |     |
3.3 Reasoning
|     |     |     |     |     |     |     | cinations |     | based on the | probabilities | of  | generated | tokens by |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ------------ | ------------- | --- | --------- | --------- |
Thereasoningstepaimstoobtaintheresponsesgeneratedby LLMs. It uses average and max pooling to aggregate the
LLMs, the hallucination labels, and the internal representa- negative log probabilities of generated tokens, denoted as
tionsacrosslayersduringthegenerationprocessofLLMs. Avg(−logp) and Max(−logp), respectively. (ii) Entropy
Weselectfivewidelyusedopen-sourcefine-tunedLLMs, Assessment [Manakul et al., 2023]: This method detects
including LLaMA3-Instruction-8B [Meta, 2024], LLaMA2- hallucinations based on the entropy of generated tokens by
Chat-13B [Touvron et al., 2023], LLaMA2-Chat-7B [Tou- LLMs. Itusesaverageandmaxpoolingtoaggregatetheen-
vron et al., 2023], Vicuna-7B [Chiang et al., 2023], and tropy of generated tokens, denoted as Avg(H) and Max(H),
Alpaca-7B [Taori et al., 2023], for reasoning. Compared to respectively. (iii) SelfCheckGPT [Manakul et al., 2023]:
baseLLMs,fine-tunedLLMsarebetterequippedtogenerate This method assesses the consistency among multiple sam-
concise and user-aligned responses necessary for real-world pled responses from LLMs. Four methods are employed to
applications. Totacklethechallengeofhallucinationinreal- assesstheconsistency,denotedasSCG-BS,SCG-QA,SCG-
worldapplications,weselectfine-tunedLLMsasourfocus. NG, and SCG-NLI. (iv) EUBHD [Zhang et al., 2023]: This
8360

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
|     |     | Baselines  | LLC-13B LLC-7B | LLI3-8B | Vicuna-7B | Alpaca-7B |     |     |
| --- | --- | ---------- | -------------- | ------- | --------- | --------- | --- | --- |
|     |     | Avg(−logp) | 0.6336 0.5933  | 0.6498  | 0.6153    | 0.7009    |     |     |
|     |     | Avg(H)     | 0.6122 0.5706  | 0.6842  | 0.4639    | 0.7313    |     |     |
|     |     | Max(−logp) | 0.5546 0.5211  | 0.6409  | 0.4627    | 0.7040    |     |     |
|     |     | Max(H)     | 0.5496 0.5097  | 0.6793  | 0.5079    | 0.7215    |     |     |
|     |     | SCG-BS     | 0.5552 0.5775  | 0.6195  | 0.5958    | 0.6792    |     |     |
|     |     | SCG-QA     | 0.5431 0.5620  | 0.5888  | 0.5889    | 0.6969    |     |     |
|     |     | SCG-NG     | 0.5364 0.5525  | 0.6018  | 0.6409    | 0.7109    |     |     |
|     |     | SCG-NLI    | 0.5538 0.6073  | 0.7060  | 0.7019    | 0.7548    |     |     |
|     |     | EUBHD      | 0.5728 0.5798  | 0.6431  | 0.6242    | 0.5764    |     |     |
|     |     | SAPLMA     | 0.4384 0.4773  | 0.4052  | 0.4663    | 0.4310    |     |     |
|     |     | MIND       | 0.5099 0.5138  | 0.5424  | 0.5065    | 0.5190    |     |     |
|     |     | EigenScore | 0.5398 0.5752  | 0.5972  | 0.6895    | 0.6532    |     |     |
|     |     | HaloScope  | 0.6517 0.5959  | 0.5071  | 0.5581    | 0.5866    |     |     |
|     |     | GPT4-HR    | 0.7092 0.6705  | 0.6684  | 0.7069    | 0.7942    |     |     |
|     |     | MHAD-AO    | 0.7768 0.7336  | 0.7843  | 0.7771    | 0.7875    |     |     |
|     |     | MHAD-FO    | 0.7642 0.7337  | 0.7665  | 0.7566    | 0.7869    |     |     |
|     |     | MHAD-LO    | 0.7728 0.7204  | 0.7539  | 0.7646    | 0.7961    |     |     |
Table2: ComparisonofMHADwithbaselinemethodsintermsofAUROConthetestsetofSOQHD.SCGstandsfor“SelfCheckGPT”,
LLCstandsfor“LLaMA2-Chat”,andLLI3standsfor“LLaMA3-Instruction”.Thebestresultsareinbold.
method detects hallucinations based on the uncertainty of superiorperformanceacrossallLLMs,highlightingitseffec-
generated keywords by LLMs. (v) SAPLMA [Azaria and tiveness in detecting hallucinations. This supports the hy-
Mitchell, 2023]: This method detects the truthfulness of a pothesis that LLMs’ internal representations encompass the
statementbasedontheinternalrepresentationofLLMs. (vi) awarenessofwhethertheirresponsesarehallucinatedorfac-
| [Su | 2024]: |     |     |     |     |     |     |     |
| --- | ------ | --- | --- | --- | --- | --- | --- | --- |
MIND et al., This is a training framework that tual. It also demonstrates the potential of using comple-
leveragestheinternalrepresentationsofLLMsforhallucina- mentary information within the internal representations of
tion detection. (vii) EigenScore [Chen et al., 2024]: This LLMs to detect hallucinations. Notably, MHAD surpasses
method explores the semantic information preserved within Probability/Entropy Assessment baseline methods. We be-
internal representations for hallucination detection. (viii) lieve this suggests that LLMs are aware that they gener-
[Du 2024]:
HaloScope et al., This is a learning framework ate hallucinations with high confidence, making internal-
for hallucination detection, which exploits the LLM genera- representation-basedmethodsdemonstrategreaterreliability
tionsarisinginthewild.(ix)GPT4-HR[Lietal.,2023]:This thanuncertainty-basedmethods,asalignedwiththediscover-
methodpromptsanLLMtorecognizewhethertheresponses iesmadebyAzariaandMitchell[2023]. Moreover, MHAD
generated by other LLMs have hallucinations. We employ doesnotrelyonexternalknowledgesourcesormultiplesam-
GPT-4andrefertothismethodasGPT4-HR. pledresponses,makingitsuitableforreal-worldapplications.
Implementation Details. The MHAD classifier employs a (ii) In most LLMs, the hallucination awareness in the
4-layer MLP for hallucination detection, with its input cor- attention output is comparable to, or stronger than, that
responding to the dimension of the hallucination awareness intheothertwotypesofinternalrepresentations. Asindi-
vector. Thehiddenlayershavedimensionsof1024and128, catedinTable2, theMHAD-AOdemonstratessuperiorper-
respectively. The ReLU activation function is used between formance on LLaMA2-Chat-13B, LLaMA3-Instruction-8B,
layers,withadropoutrateof0.5. Theclassifierisoptimized and Vicuna-7B compared to both MHAD-FO and MHAD-
using Adam with a learning rate of 1e-5, a weight decay of LO. When applied to LLaMA2-Chat-7B, MHAD-AO per-
1e-2,andatrainingbatchsizeof64.Forthehyperparameters forms only slightly below MHAD-FO. On Alpaca-7B,
αandtop-kusedforneuronandlayerselection,thesettings MHAD-AO ranks second in performance among MHAD-
| are determined | using | the separate validation | set, which is a |     |     |     |     |     |
| -------------- | ----- | ----------------------- | --------------- | --- | --- | --- | --- | --- |
AO,MHAD-FO,andMHAD-LO.
randomlysampled20%subsetfromtheSOQHDtrainingset. (iii) Other findings. (1) LLaMA3-Instruction-8B shows
Baselinesareimplementedusingofficialcodeanddatawhile thelowestpropensityforhallucinationsamongfiveLLMs,as
following the settings outlined in the respective papers. All indicated in Table 1. However, the responses generated by
experimentsareconductedonasingleRTXA6000. it are the most challenging for GPT-4 to recognize whether
|     |     |     |     | they are | hallucinated | or factual, | as shown in Table | 2. We |
| --- | --- | --- | --- | -------- | ------------ | ----------- | ----------------- | ----- |
4.2 MainResults
|     |     |     |     | believe | this finding | as different | LLMs have different | hallu- |
| --- | --- | --- | --- | ------- | ------------ | ------------ | ------------------- | ------ |
Table 2 presents the performance comparison of MHAD cinationpatterns. LLaMA3-Instruction-8Bistheleastprone
againstbaselinemethods. Ourkeyfindingsareasfollows: to hallucinations, making its hallucination patterns the most
(i) MHAD outperforms all baseline methods across intricateanditsresponsesthemostchallengingforGPT-4to
all LLMs. MHAD, leveraging the internal representations correctly recognize. Nevertheless, our method still demon-
acrosslayersduringthegenerationprocessofLLMs, shows stratesoutstandingperformance.(2)SAPLMA,thougheffec-
8361

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
|     | Method |     | LLC(13) | LLC(7) | LLI3   | Vicuna | Alpaca |     |     |     |     |     |
| --- | ------ | --- | ------- | ------ | ------ | ------ | ------ | --- | --- | --- | --- | --- |
|     | SIR    |     | 0.7547  | 0.7071 | 0.7354 | 0.7475 | 0.7740 |     |     |     |     |     |
|     | +SN    |     | 0.7672  | 0.7214 | 0.7685 | 0.7450 | 0.7756 |     |     |     |     |     |
|     | +SL    |     | 0.7697  | 0.7182 | 0.7815 | 0.7649 | 0.7988 |     |     |     |     |     |
|     | +CGS   |     | 0.7768  | 0.7336 | 0.7843 | 0.7771 | 0.7875 |     |     |     |     |     |
Table3:Ablationresultsforattentionoutput.
tiveonitsowntrainingdataset,exhibitsinferiorperformance
| when | applied | to       | detect | genuine | hallucinations. |     | We          | believe |     |     |     |     |
| ---- | ------- | -------- | ------ | ------- | --------------- | --- | ----------- | ------- | --- | --- | --- | --- |
| this | as its  | training | data   | is not  | generated       | by  | LLM itself. | Al-     |     |     |     |     |
thoughMINDandEUBHDareeffectiveinwikipediagener-
ationtask,theyshowsuboptimalperformanceinODQAtask.
| This   | could | be    | attributed | to the  | discrepancy |      | between          | the two |                                                         |                                 |        |                 |
| ------ | ----- | ----- | ---------- | ------- | ----------- | ---- | ---------------- | ------- | ------------------------------------------------------- | ------------------------------- | ------ | --------------- |
|        |       |       |            |         |             |      |                  |         | Figure2: ComparisonofperformanceonthevalidationsetofSO- |                                 |        |                 |
| tasks. | We    | would | like       | to note | that        | ODQA | is a challenging |         |                                                         |                                 |        |                 |
|        |       |       |            |         |             |      |                  |         | QHD across                                              | different layers and generation | steps. | “ini” and “fin” |
knowledge-intensivetaskandrelevanttopracticalusecases,
denotetheinitialandfinalgenerationsteps,respectively.
| ensuring |     | SOQHD | can | effectively | assess | the | performance | of  |     |     |     |     |
| -------- | --- | ----- | --- | ----------- | ------ | --- | ----------- | --- | --- | --- | --- | --- |
hallucinationdetectionmethodsinreal-worldapplications.
|     |     |     |     |     |     |     |     |     |     | Model | H=1Rate |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | ------- | --- |
4.3 AblationStudy
|     |     |     |     |     |     |     |     |     |     | Alpaca-7B | 0.732(↑0.220) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------- | --- |
|     |     |     |     |     |     |     |     |     |     | Vicuna-7B | 0.724(↑0.172) |     |
Table3presentstheresultsofourablationstudyforattention
|     |     |     |     |     |     |     |     |     |     | LLaMA2-Chat-7B | 0.660(↑0.202) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------- | ------------- | --- |
output. Wedenotethebaseline,whichdetectshallucinations
|     |     |     |     |     |     |     |     |     |     | LLaMA2-Chat-13B | 0.590(↑0.176) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------- | ------------- | --- |
usingthesingle-layerinternalrepresentationatthefinalgen-
|         |       |     |         |      |           |     |           |         |     | LLaMA3-Instruction-8B | 0.648(↑0.280) |     |
| ------- | ----- | --- | ------- | ---- | --------- | --- | --------- | ------- | --- | --------------------- | ------------- | --- |
| eration | step, | as  | SIR. We | then | introduce | the | tricks of | “Select |     |                       |               |     |
Neurons”(SN),“SelectLayers”(SL),and“ConcatenateGen-
|     |     |     |     |     |     |     |     |     | Table4: HallucinationrateonthetestsetofSOQHDwhenLLMs |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- |
erationSteps”(CGS)incrementallytoevaluatetheirimpact.
|        |          |     |        |     |        |             |      |         | arepresentedwithmisleadinginformation. |     | H=1Rateindicatesthe |     |
| ------ | -------- | --- | ------ | --- | ------ | ----------- | ---- | ------- | -------------------------------------- | --- | ------------------- | --- |
| Select | Neurons. |     | By the | SN  | trick, | the outputs | from | the se- |                                        |     |                     |     |
hallucinationrate,andtheredarrowshowstheincreaseinhallucina-
| lected | neurons |     | across | layers | at the | final generation |     | step are |     |     |     |     |
| ------ | ------- | --- | ------ | ------ | ------ | ---------------- | --- | -------- | --- | --- | --- | --- |
tionratecomparedtowhennomisleadinginformationisprovided.
| concatenated |     | to  | detect | hallucinations. |     | The | results show | that |     |     |     |     |
| ------------ | --- | --- | ------ | --------------- | --- | --- | ------------ | ---- | --- | --- | --- | --- |
theSNtrickimprovestheAUROCformostLLMs,indicating
|                                    |     |     |     |     |     |                     |     |     | Baselines | LLC(13) LLC(7) | LLI3 Vicuna | Alpaca |
| ---------------------------------- | --- | --- | --- | --- | --- | ------------------- | --- | --- | --------- | -------------- | ----------- | ------ |
| theeffectivenessofneuronselection. |     |     |     |     |     | Byharnessingthecom- |     |     |           |                |             |        |
plementary information across layers, more precise halluci- Avg(−logp) 0.4731 0.4175 0.4256 0.4740 0.4591
nationdetectionisachieved. However,theVicuna-7Bshows Avg(H) 0.4675 0.4110 0.4093 0.4732 0.4612
adecreaseinperformancewiththeSNtrick,suggestingthat Max(−logp) 0.4538 0.3966 0.3915 0.4297 0.4227
itslayersmayofferamoreuniformhallucinationawareness. Max(H) 0.4381 0.4017 0.3736 0.4384 0.4439
Select Layers. When SL trick is incorporated on the ba- MHAD-AO 0.6552 0.5369 0.4561 0.5701 0.5375
sis of SN, the outputs from the selected neurons of the se- MHAD-FO 0.6169 0.5040 0.3948 0.6008 0.5120
lected layers at the final generation step are concatenated to MHAD-LO 0.6448 0.5276 0.4670 0.5690 0.5377
| detecthallucinations. |     |     | TheSLtrickfurtherenhancestheper- |     |     |     |     |     |     |     |     |     |
| --------------------- | --- | --- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
formance by mitigating the interference from the layers that Table5:Robustnessstudyresults.
| demonstrateweakawarenessofhallucinations. |     |     |                                      |     |            |     | However,the    |     |                                      |     |     |     |
| ----------------------------------------- | --- | --- | ------------------------------------ | --- | ---------- | --- | -------------- | --- | ------------------------------------ | --- | --- | --- |
| LLaMA2-Chat-7B                            |     |     | demonstrates                         |     | a decrease |     | in performance |     |                                      |     |     |     |
|                                           |     |     |                                      |     |            |     |                |     | 4.4 RobustnessStudyAgainstMisleading |     |     |     |
| withtheSLtrick.                           |     |     | Webelievethisasheuristicrulesmayfall |     |            |     |                |     |                                      |     |     |     |
Information
intolocaloptima,butweneedtonotethatthecomplexityof
exhaustivesearchisO(2L),whereListhenumberoflayers Retrieval Augmented Generation (RAG) enables LLMs to
inLLMs,makingitimpractical.
|     |     |     |     |     |     |     |     |     | assess external | knowledge sources, | but the quality | of these |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------- | ------------------ | --------------- | -------- |
ConcatenateGenerationSteps. Throughfurtherleveraging sourcessignificantlyaffectstheperformanceofLLMs. Mis-
the CGS trick, the outputs from the selected neurons of se- leadinginformationcanincreasethelikelihoodofLLMsgen-
lectedlayersattheinitialandfinalgenerationstepsarecon- erating hallucinations [Pan et al., 2023; Xu et al., 2024].
catenated to detect hallucinations. The CGS trick generally WeexaminetherobustnessofMHADandbaselinemethods
yields the highest AUROC, suggesting that the internal rep- whenLLMsarepresentedwithmisleadinginformation.
resentationattheinitialgenerationstepcanprovidecomple- Specifically, wefirsthavegpt-3.5-turbogeneratemislead-
mentaryinformation.Webelievethisissimilartotherethink- inginformationforeachquestioninthetestsetofSOQHD.
ingprocesshumansengageinduringproblem-solving. How- Then,weinputboththemisleadinginformationandtheques-
ever, Alpaca-7B exhibits a decline in performance with the tionintoLLMstoobtaintheirresponses.
CGS trick, possibly attributed to the significant gap in per- Table 5 presents the robustness study results. The likeli-
formance among the top-performing layers at the initial and hoodofLLMsgeneratinghallucinationsincreaseswithmis-
finalgenerationsteps,asshowninFigure2. leadinginformation,asshowninTable4. However,MHAD
8362

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
|             |     |         |        |        |        |        |     | Sampling-based. |     | Manakul |           | et al.      | [2023] | proposed    | Self- |
| ----------- | --- | ------- | ------ | ------ | ------ | ------ | --- | --------------- | --- | ------- | --------- | ----------- | ------ | ----------- | ----- |
| Baselines   |     | LLC(13) | LLC(7) | LLI3   | Vicuna | Alpaca |     |                 |     |         |           |             |        |             |       |
|             |     |         |        |        |        |        |     | CheckGPT,       | a   | method  | to assess | information |        | consistency |       |
| HaluEval-HR |     | 0.5373  | 0.4701 | 0.5707 | 0.4813 | 0.4936 |     |                 |     |         |           |             |        |             |       |
amongmultiplesampledresponsesfromthesameLLM.The
| MHAD-AO |     | 0.6671 | 0.5538 | 0.6129 | 0.5458 | 0.7334 |     |     |     |     |     |     |     |     |     |
| ------- | --- | ------ | ------ | ------ | ------ | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
motivateideaofSelfCheckGPTisthatwhenLLMsareuncer-
| MHAD-FO |     | 0.7413 | 0.4734 | 0.5983 | 0.4650 | 0.7918 |     |            |         |          |     |         |           |     |            |
| ------- | --- | ------ | ------ | ------ | ------ | ------ | --- | ---------- | ------- | -------- | --- | ------- | --------- | --- | ---------- |
|         |     |        |        |        |        |        |     | tain about | a given | concept, | the | sampled | responses |     | are likely |
| MHAD-LO |     | 0.6211 | 0.5258 | 0.5167 | 0.7439 | 0.7740 |     |            |         |          |     |         |           |     |            |
tobedifferentandcontaininconsistentfacts.
|     |     |     |     |     |     |     |     | Uncertainty-based. |     | Manakul |     | et al. | [2023] | proposed | meth- |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------ | --- | ------- | --- | ------ | ------ | -------- | ----- |
Table6:PerformanceonHaluEval-QAdataset.
|     |     |     |     |     |     |     |     | ods to detect | hallucinations |            |           | based on | the probability |           | or en- |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | -------------- | ---------- | --------- | -------- | --------------- | --------- | ------ |
|     |     |     |     |     |     |     |     | tropy of      | tokens         | in a given | response. |          | Factual         | responses | are    |
likelytocontaintokenswithhigherprobabilityandloweren-
| maintains | remarkable |     | performance, |     | demonstrating |     | robust- |                                                       |     |     |     |     |     |     |     |
| --------- | ---------- | --- | ------------ | --- | ------------- | --- | ------- | ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
|           |            |     |              |     |               |     |         | tropy. Inspiredbyhumanfocusinfactualitychecking,Zhang |     |     |     |     |     |     |     |
nessagainstmisleadinginformation.Interestingly,LLaMA3-
etal.[2023]enhanceduncertainty-basedhallucinationdetec-
Instruction-8Bismoresusceptibletomisleadinginformation,
likely due to its strong instruction-following ability. In gen- tionwithstrongerfocus.
|     |     |     |     |     |     |     |     | Internal-representation-based. |     |     |     | AzariaandMitchell[2023] |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | ----------------------- | --- | --- | --- |
eral,largerLLMsarelessaffectedbymisleadinginformation.
|     |     |     |     |     |     |     |     | trained   | an MLP | based      | on the | single-layer | internal |             | represen- |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------ | ---------- | ------ | ------------ | -------- | ----------- | --------- |
|     |     |     |     |     |     |     |     | tation of | LLMs   | to predict | the    | truthfulness | of       | a sentence. | Su        |
4.5 OtherResults
etal.[2024]proposedatrainingframeworkthatleveragesthe
WealsoevaluateourproposedMHADontheexistingHaluE-
|     |     |     |     |     |     |     |     | internal | representation |     | of LLMs | for | hallucination |     | detection. |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | -------------- | --- | ------- | --- | ------------- | --- | ---------- |
valdataset[Lietal.,2023],usingAUROCastheevaluation
|     |     |     |     |     |     |     |     | Chen et | al. [2024] | explored |     | the dense | semantic | information |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---------- | -------- | --- | --------- | -------- | ----------- | --- |
metric. TheHaluEvaldatasetincludes30,000samplesfrom
|          |       |         |        |            |        |       |         | retained        | within | LLMs’ | internal   | representation |     | for            | hallucina- |
| -------- | ----- | ------- | ------ | ---------- | ------ | ----- | ------- | --------------- | ------ | ----- | ---------- | -------------- | --- | -------------- | ---------- |
| HotpotQA | [Yang | et al., | 2018], | OpenDialKG |        | [Moon | et al., |                 |        |       |            |                |     |                |            |
|          |       |         |        |            |        |       |         | tion detection. |        | Du et | al. [2024] | estimated      |     | the membership |            |
| 2019]    |       |         |        | [See       | 2017]. |       |         |                 |        |       |            |                |     |                |            |
and CNN/Daily Mail et al., ChatGPT is forsamplesbasedonanembeddingfactorizationandtrained
usedtogeneratehallucinatedresponses.
|                 |     |             |      |              |     |          |        | a binary | truthfulness |              | classifier | on top.   | However, |         | these are |
| --------------- | --- | ----------- | ---- | ------------ | --- | -------- | ------ | -------- | ------------ | ------------ | ---------- | --------- | -------- | ------- | --------- |
| To maintain     |     | task format |      | consistency, | we  | focus    | on the |          |              |              |            |           |          |         |           |
|                 |     |             |      |              |     |          |        | limited  | by their     | single-layer |            | focus and | do not   | harness | com-      |
| 10,000 HotpotQA |     | samples     | from | the HaluEval |     | dataset. | Fol-   |          |              |              |            |           |          |         |           |
plementaryinformationacrosslayersandgenerationsteps.
|            |         |     | [Li et | al., 2023] |         |       |       |     |     |     |     |     |     |     |     |
| ---------- | ------- | --- | ------ | ---------- | ------- | ----- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
| lowing the | setting | of  |        |            | and the | proxy | model |     |     |     |     |     |     |     |     |
strategyproposedby[Manakuletal.,2023],weconcatenate 5.2 HallucinationDetectionBenchmarks
| a question | with | the answer | randomly |     | selected | from | normal |     |     |     |     |     |     |     |     |
| ---------- | ---- | ---------- | -------- | --- | -------- | ---- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
Hallucinationdetectionbenchmarksareutilizedtoassessthe
| and hallucinated |                 | answers, | and | then input        | them | into | LLMs.  |               |     |               |     |           |          |     |         |
| ---------------- | --------------- | -------- | --- | ----------------- | ---- | ---- | ------ | ------------- | --- | ------------- | --- | --------- | -------- | --- | ------- |
|                  |                 |          |     |                   |      |      |        | effectiveness | of  | hallucination |     | detection | methods. |     | For in- |
| The internal     | representations |          |     | during processing |      | the  | answer |               |     |               |     |           |          |     |         |
[2023]
are stored for utilization by MHAD. Although the proxy stance, Manakul et al. developed a hallucination de-
tectiondatasetbygeneratingsyntheticwikipediaarticleswith
modelstrategycanadapttheHaluEval-QAdatasettoourpro-
|     |     |     |     |     |     |     |     | GPT-3, | followed | by  | manual | annotation. |     | Li et | al. [2023] |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | -------- | --- | ------ | ----------- | --- | ----- | ---------- |
posedmethod,itmaynotfullydemonstratetheeffectiveness
|         |         |        |          |             |         |         |          | constructed | a            | challenging | dataset | of          | generated | and            | human- |
| ------- | ------- | ------ | -------- | ----------- | ------- | ------- | -------- | ----------- | ------------ | ----------- | ------- | ----------- | --------- | -------------- | ------ |
| of MHAD | due     | to the | exposure | bias        | [Bengio | et al., | 2015;    |             |              |             |         |             |           |                |        |
|         |         |        |          |             |         |         |          | annotated   | hallucinated |             | samples | to evaluate |           | the capability | of     |
| Ranzato | et al., | 2016]  | and the  | discrepancy | between |         | the syn- |             |              |             |         |             |           |                |        |
LLMstorecognizehallucination.AzariaandMitchell[2023]
thetichallucinationsandthegenuinehallucinationsgenerated
byLLMitself[Manakuletal.,2023;Zhangetal.,2024]. introducedtheTrue-Falsedatasetoftrueandfalsestatements.
|     |     |     |     |     |     |     |     | Su et al. | [2024] | constructed |     | HELM | based | on the | wikipedia |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------ | ----------- | --- | ---- | ----- | ------ | --------- |
Table6presentstheresultsofevaluatingthehallucination
|           |             |       |     |         |        |          |        | articles | generation | task. | Although |     | Chen et | al. [2024] | and |
| --------- | ----------- | ----- | --- | ------- | ------ | -------- | ------ | -------- | ---------- | ----- | -------- | --- | ------- | ---------- | --- |
| detection | classifier, | which | is  | trained | on the | training | set of |          |            |       |          |     |         |            |     |
Duetal.[2024]proposedinternal-representation-basedmeth-
| SOQHD, | using | 10,000 | unseen | samples | from | HaluEval-QA. |     |           |         |              |     |       |          |                 |     |
| ------ | ----- | ------ | ------ | ------- | ---- | ------------ | --- | --------- | ------- | ------------ | --- | ----- | -------- | --------------- | --- |
|        |       |        |        |         |      |              |     | ods, they | neither | open-sourced |     | their | utilized | representations |     |
ThebaselinemethodpromptsanLLMtoassesswhetherthe
|                 |                 |                                       |        |                 |      |              |            | nor considered |           | the temporal |           | consistency | of            | data.     | Friel and |
| --------------- | --------------- | ------------------------------------- | ------ | --------------- | ---- | ------------ | ---------- | -------------- | --------- | ------------ | --------- | ----------- | ------------- | --------- | --------- |
| answer randomly |                 | selected                              | from   | normal          | and  | hallucinated | an-        |                |           |              |           |             |               |           |           |
|                 |                 |                                       |        |                 |      |              |            | Sanyal [2023]  |           | concentrated | on        | QA          | tasks, using  | ChatGPT   | to        |
| swersisfactual. |                 | Althoughtheflawsoftheproxymodelstrat- |        |                 |      |              |            |                |           |              |           |             |               |           |           |
|                 |                 |                                       |        |                 |      |              |            | generate       | responses | and          | assigning | them        | hallucination |           | labels.   |
| egy limit       | the performance |                                       | of     | the classifier, | MHAD |              | still out- |                |           |              |           |             |               |           |           |
|                 |                 |                                       |        |                 |      |              |            | However,       | this      | benchmark    | only      | provides    | the           | responses | gen-      |
| performs        | the baseline    |                                       | across | all LLMs.       | This | further      | high-      |                |           |              |           |             |               |           |           |
lights MHAD’s effectiveness and generalization, suggesting erated by a single LLM, which cannot evaluate the internal-
representation-basedmethodsacrossmultipleLLMs.
thatreal-generationprocessesbetterreflectitssuperiority.
|     |     |     |     |     |     |     |     | 6 Conclusions |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- |
5 RelatedWork
Inthispaper,weintroduceMHAD,anovelhallucinationde-
5.1 HallucinationDetection
tectionmethod.MHADleveragestheinternalrepresentations
HallucinationdetectioninLLMshasgarneredsignificantat- acrosslayersduringthegenerationprocessofLLMstodetect
tention due to the increasing reliance on LLMs in various hallucination. Moreover,weproposeSOQHD,anovelhallu-
applications. Existing hallucination detection methods for cinationdetectionbenchmarkforODQA,whichprovidesthe
LLMscanbebroadlyclassifiedintofourcategories. internal representations of LLMs and ensures temporal con-
Retrieval-based. Lietal.[2023]proposedanapproachthat sistency. Experimental results demonstrate the effectiveness
promptsanLLMtoevaluatewhethertheresponsesgenerated andgeneralizationofMHAD.Weaspireforourworktocon-
byotherLLMscontradictobjectivefacts, wheretheLLMis tributetothefieldofLLMresearch,enhancingthereliability
employedasanexternalknowledgesource. ofLLMsinreal-worldapplications.
8363

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
Acknowledgments [Huangetal.,2023] Lei Huang, Weijiang Yu, Weitao Ma,
|           |     |           |     |     |          |     |     | Weihong | Zhong, | Zhangyin | Feng, | Haotian | Wang, | Qiang- |
| --------- | --- | --------- | --- | --- | -------- | --- | --- | ------- | ------ | -------- | ----- | ------- | ----- | ------ |
| This work | was | supported | by  | the | National | Key | Re- |         |        |          |       |         |       |        |
search and Development Program of China (Grant No. longChen,WeihuaPeng,XiaochengFeng,BingQin,etal.
2022YFC3302100) and the National Natural Science Foun- Asurveyonhallucinationinlargelanguagemodels: Prin-
|                        |     |     |            |     |     |     |     | ciples, | taxonomy, | challenges, |     | and open | questions. | ACM |
| ---------------------- | --- | --- | ---------- | --- | --- | --- | --- | ------- | --------- | ----------- | --- | -------- | ---------- | --- |
| dationofChina(GrantNo. |     |     | 62476025). |     |     |     |     |         |           |             |     |          |            |     |
TransactionsonInformationSystems,2023.
| References |     |     |     |     |     |     |     | [IzacardandGrave,2021] |     |     |         |         |     |         |
| ---------- | --- | --- | --- | --- | --- | --- | --- | ---------------------- | --- | --- | ------- | ------- | --- | ------- |
|            |     |     |     |     |     |     |     |                        |     |     | Gautier | Izacard | and | Edouard |
[AlainandBengio,2017] GuillaumeAlainandYoshuaBen- Grave. Leveragingpassageretrievalwithgenerativemod-
gio. Understanding intermediate layers using linear clas- elsforopendomainquestionanswering. InEACL,2021.
| sifierprobes.            |     | InICLR(Workshop),2017. |                           |       |      |             |     |                     |         |             |           |       |         |            |
| ------------------------ | --- | ---------------------- | ------------------------- | ----- | ---- | ----------- | --- | ------------------- | ------- | ----------- | --------- | ----- | ------- | ---------- |
|                          |     |                        |                           |       |      |             |     | [Jawaharetal.,2019] |         | Ganesh      | Jawahar,  |       | Benoˆıt | Sagot, and |
| [AzariaandMitchell,2023] |     |                        | AmosAzariaandTomMitchell. |       |      |             |     |                     |         |             |           |       |         |            |
|                          |     |                        |                           |       |      |             |     | Djame´              | Seddah. | What        | does BERT | learn | about   | the struc- |
| The internal             |     | state of an            | LLM                       | knows | when | it’s lying. | In  |                     |         |             |           |       |         |            |
|                          |     |                        |                           |       |      |             |     | tureoflanguage?     |         | InACL,2019. |           |       |         |            |
FindingsofEMNLP,2023.
|                  |       |              |       |           |            |              |      | [Jietal.,2023]                   |     | Ziwei           | Ji, Nayeon | Lee,               | Rita         | Frieske, |
| ---------------- | ----- | ------------ | ----- | --------- | ---------- | ------------ | ---- | -------------------------------- | --- | --------------- | ---------- | ------------------ | ------------ | -------- |
| [Bangetal.,2023] |       | Yejin        | Bang, | Samuel    |            | Cahyawijaya, |      |                                  |     |                 |            |                    |              |          |
|                  |       |              |       |           |            |              |      | Tiezheng                         | Yu, | Dan Su,         | Yan Xu,    | Etsuko             | Ishii, Yejin | Bang,    |
| Nayeon           | Lee,  | Wenliang     | Dai,  | Dan Su,   | Bryan      | Wilie,       | Holy |                                  |     |                 |            |                    |              |          |
|                  |       |              |       |           |            |              |      | AndreaMadotto,                   |     | andPascaleFung. |            | Surveyofhallucina- |              |          |
| Lovenia,         | Ziwei | Ji, Tiezheng |       | Yu, Willy | Chung,     | Quyet        | V.   |                                  |     |                 |            |                    |              |          |
|                  |       |              |       |           |            |              |      | tioninnaturallanguagegeneration. |     |                 |            | ACMComput.Surv.,   |              |          |
| Do, Yan          | Xu,   | and Pascale  | Fung. | A         | multitask, | multilin-    |      |                                  |     |                 |            |                    |              |          |
2023.
| gual, | multimodal | evaluation |     | of ChatGPT |     | on reasoning, |     |     |     |     |     |     |     |     |
| ----- | ---------- | ---------- | --- | ---------- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
hallucination,andinteractivity. InIJCNLP,2023. [Joshietal.,2017] MandarJoshi,EunsolChoi,DanielWeld,
[Bengioetal.,2015] Samy Bengio, Oriol Vinyals, Navdeep and Luke Zettlemoyer. TriviaQA: A large scale distantly
Jaitly, and Noam Shazeer. Scheduled sampling for se- supervised challenge dataset for reading comprehension.
InACL,2017.
| quence | prediction | with | recurrent | neural | networks. |     | In  |     |     |     |     |     |     |     |
| ------ | ---------- | ---- | --------- | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
NeurIPS,2015. [Kwiatkowskietal.,2019] Tom Kwiatkowski, Jennimaria
[Burnsetal.,2023]
Collin Burns, Haotian Ye, Dan Klein, Palomaki,OliviaRedfield,MichaelCollins,AnkurParikh,
and Jacob Steinhardt. Discovering latent knowledge in Chris Alberti, Danielle Epstein, Illia Polosukhin, Jacob
languagemodelswithoutsupervision. InICLR,2023. Devlin, Kenton Lee, Kristina Toutanova, Llion Jones,
MatthewKelcey,Ming-WeiChang,AndrewM.Dai,Jakob
| [Chenetal.,2017] |     | DanqiChen,AdamFisch,JasonWeston, |     |     |     |     |     |     |     |     |     |     |     |     |
| ---------------- | --- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Uszkoreit,QuocLe,andSlavPetrov.Naturalquestions:A
| andAntoineBordes. |     | ReadingWikipediatoansweropen- |     |     |     |     |     |     |     |     |     |     |     |     |
| ----------------- | --- | ----------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
domainquestions. InACL,2017. benchmarkforquestionansweringresearch. TACL,2019.
[Chenetal.,2024] Chao Chen, Kai Liu, Ze Chen, Yi Gu, [Lewisetal.,2020] PatrickS.H.Lewis,EthanPerez,Alek-
YueWu,MingyuanTao,ZhihangFu,andJiepingYe. IN- sandra Piktus, Fabio Petroni, Vladimir Karpukhin, Na-
|       |       |                 |        |     |       |               |     | man Goyal, | Heinrich |     | Ku¨ttler, | Mike Lewis, | Wen-tau | Yih, |
| ----- | ----- | --------------- | ------ | --- | ----- | ------------- | --- | ---------- | -------- | --- | --------- | ----------- | ------- | ---- |
| SIDE: | llms’ | internal states | retain | the | power | of hallucina- |     |            |          |     |           |             |         |      |
tiondetection. InICLR,2024. Tim Rockta¨schel, Sebastian Riedel, and Douwe Kiela.
[Chiangetal.,2023] Retrieval-augmented generation for knowledge-intensive
WLChiang,ZLi,ZLin,etal.Vicuna:
|     |     |     |     |     |     |     |     | NLPtasks. | InNeurIPS,2020. |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------------- | --- | --- | --- | --- | --- |
Anopen-sourcechatbotimpressinggpt-4with90%*chat-
gpt quality. See https://vicuna. lmsys. org (accessed 14 [Lietal.,2023] Junyi Li, Xiaoxue Cheng, Xin Zhao, Jian-
April2023),2(3):6,2023.
YunNie,andJi-RongWen.HaluEval:Alarge-scalehallu-
[Duetal.,2024] Xuefeng Du, Chaowei Xiao, and Yixuan cinationevaluationbenchmarkforlargelanguagemodels.
| Li. Haloscope:          |     | Harnessingunlabeledllmgenerationsfor |                 |           |           |               |         | InEMNLP,2023.       |     |                                     |     |          |       |         |
| ----------------------- | --- | ------------------------------------ | --------------- | --------- | --------- | ------------- | ------- | ------------------- | --- | ----------------------------------- | --- | -------- | ----- | ------- |
| hallucinationdetection. |     |                                      | InNeurIPS,2024. |           |           |               |         |                     |     |                                     |     |          |       |         |
|                         |     |                                      |                 |           |           |               |         | [Manakuletal.,2023] |     | Potsawee                            |     | Manakul, | Adian | Liusie, |
| [FrielandSanyal,2023]   |     |                                      | Robert          | Friel and | Atindriyo |               | Sanyal. |                     |     |                                     |     |          |       |         |
|                         |     |                                      |                 |           |           |               |         | andMarkGales.       |     | SelfCheckGPT:Zero-resourceblack-box |     |          |       |         |
| Chainpoll:              | A   | high efficacy                        | method          |           | for llm   | hallucination |         |                     |     |                                     |     |          |       |         |
hallucinationdetectionforgenerativelargelanguagemod-
detection. arXivpreprintarXiv:2310.18344,2023. els. InEMNLP,2023.
| [Guuetal.,2020]                  |          | Kelvin | Guu,    | Kenton | Lee,         | Zora      | Tung, |                                  |         |     |                        |               |     |         |
| -------------------------------- | -------- | ------ | ------- | ------ | ------------ | --------- | ----- | -------------------------------- | ------- | --- | ---------------------- | ------------- | --- | ------- |
|                                  |          |        |         |        |              |           |       | [Meta,2024]                      | AIMeta. |     | Introducingmetallama3: |               |     | Themost |
| Panupong                         | Pasupat, | and    | Mingwei | Chang. |              | Retrieval | aug-  |                                  |         |     |                        |               |     |         |
|                                  |          |        |         |        |              |           |       | capableopenlyavailablellmtodate. |         |     |                        | MetaAI.,2024. |     |         |
| mentedlanguagemodelpre-training. |          |        |         |        | InICML,2020. |           |       |                                  |         |     |                        |               |     |         |
[Hanetal.,2016] [Minetal.,2023] SewonMin,KalpeshKrishna,XinxiLyu,
|        |      | Song Han,    | Huizi       | Mao, | and  | William | J.   |                   |     |         |           |             |            |            |
| ------ | ---- | ------------ | ----------- | ---- | ---- | ------- | ---- | ----------------- | --- | ------- | --------- | ----------- | ---------- | ---------- |
|        |      |              |             |      |      |         |      | Mike Lewis,       |     | Wen-tau | Yih, Pang | Wei         | Koh, Mohit | Iyyer,     |
| Dally. | Deep | compression: | Compressing |      | deep | neural  | net- |                   |     |         |           |             |            |            |
|        |      |              |             |      |      |         |      | Luke Zettlemoyer, |     | and     | Hannaneh  | Hajishirzi. |            | FActScore: |
workwithpruning,trainedquantizationandhuffmancod-
ing. InICLR,2016. Fine-grainedatomicevaluationoffactualprecisioninlong
|                       |     |         |     |               |     |         |     | formtextgeneration. |     |     | InEMNLP,2023. |     |     |     |
| --------------------- | --- | ------- | --- | ------------- | --- | ------- | --- | ------------------- | --- | --- | ------------- | --- | --- | --- |
| [Hedderichetal.,2024] |     | Michael |     | A. Hedderich, |     | Natalie | N.  |                     |     |     |               |     |     |     |
Bazarova,WentingZou,RyunShim,XindaMa,andQian [Moonetal.,2019] Seungwhan Moon, Pararth Shah, Anuj
Yang. A piece of theatre: Investigating how teachers de- Kumar, and Rajen Subba. OpenDialKG: Explainable
signLLMchatbotstoassistadolescentcyberbullyingedu- conversational reasoning with attention-based walks over
| cation. | InCHI,2024. |     |     |     |     |     |     | knowledgegraphs. |     | InACL,2019. |     |     |     |     |
| ------- | ----------- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ----------- | --- | --- | --- | --- |
8364

ProceedingsoftheThirty-FourthInternationalJointConferenceonArtificialIntelligence(IJCAI-25)
[Mu¨ndleretal.,2024] Niels Mu¨ndler, Jingxuan He, Slobo- neurons in pre-trained transformer-based language mod-
danJenko,andMartinT.Vechev.Self-contradictoryhallu- els. InEMNLP,2022.
cinationsoflargelanguagemodels: Evaluation,detection [Wangetal.,2023] Xuezhi Wang, Jason Wei, Dale Schuur-
| andmitigation. |     | InICLR,2024. |     |     |     |     |     |     |     |     |     |
| -------------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
mans,QuocV.Le,EdH.Chi,SharanNarang,Aakanksha
[Panetal.,2023] YikangPan,LiangmingPan,WenhuChen, Chowdhery,andDennyZhou. Self-consistencyimproves
PreslavNakov,Min-YenKan,andWilliamWang. Onthe chainofthoughtreasoninginlanguagemodels. InICLR,
| riskofmisinformationpollutionwithlargelanguagemod- |     |     |     |     |     |     | 2023. |     |     |     |     |
| -------------------------------------------------- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- |
els. InFindingsofEMNLP,2023.
|     |     |     |     |     |     |     | [Wangetal.,2024] | XuWang,ChengLi,YiChang,Jindong |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | ------------------------------ | --- | --- | --- |
[Parketal.,2024] Kiho Park, Yo Joong Choe, and Victor Wang, and Yuan Wu. Negativeprompt: Leveraging psy-
| Veitch. | The linear | representation |     | hypothesis |     | and the ge- |     |     |     |     |     |
| ------- | ---------- | -------------- | --- | ---------- | --- | ----------- | --- | --- | --- | --- | --- |
chologyforlargelanguagemodelsenhancementvianega-
ometryoflargelanguagemodels. InICML,2024. tiveemotionalstimuli. InIJCAI,2024.
| [Ranzatoetal.,2016] |     | Marc’AurelioRanzato,SumitChopra, |     |     |     |     |                |                 |               |     |       |
| ------------------- | --- | -------------------------------- | --- | --- | --- | --- | -------------- | --------------- | ------------- | --- | ----- |
|                     |     |                                  |     |     |     |     | [Wuetal.,2023] | Shijie Wu, Ozan | Irsoy, Steven | Lu, | Vadim |
Michael Auli, and Wojciech Zaremba. Sequence level Dabravolski, Mark Dredze, Sebastian Gehrmann, Prab-
trainingwithrecurrentneuralnetworks. InICLR,2016. hanjan Kambadur, David Rosenberg, and Gideon Mann.
|                    |     |        |         |       |          |       | Bloomberggpt: | Alargelanguagemodelforfinance. |     |     | arXiv |
| ------------------ | --- | ------ | ------- | ----- | -------- | ----- | ------------- | ------------------------------ | --- | --- | ----- |
| [Sajjadetal.,2022] |     | Hassan | Sajjad, | Nadir | Durrani, | Fahim |               |                                |     |     |       |
preprintarXiv:2303.17564,2023.
| Dalvi, Firoj | Alam, | Abdul | Khan, | and | Jia Xu. | Analyz- |     |     |     |     |     |
| ------------ | ----- | ----- | ----- | --- | ------- | ------- | --- | --- | --- | --- | --- |
ingencodedconceptsintransformerlanguagemodels. In [Xuetal.,2024] Rongwu Xu, Zehan Qi, Zhijiang Guo,
NAACL-HLT,2022.
CunxiangWang,HongruWang,YueZhang,andWeiXu.
[Schulman,2023] John Schulman. Reinforcement learning Knowledge conflicts for LLMs: A survey. In EMNLP,
| fromhumanfeedback: |     |     | Progressandchallenges. |     |     | InBerke- | 2024. |     |     |     |     |
| ------------------ | --- | --- | ---------------------- | --- | --- | -------- | ----- | --- | --- | --- | --- |
leyEECSColloquium.YouTubewww.youtube.com/watch, [Yangetal.,2018] Zhilin Yang, Peng Qi, Saizheng Zhang,
| 2023.           |     |         |      |          |          |          | Yoshua Bengio,  | William Cohen, | Ruslan    | Salakhutdinov, |     |
| --------------- | --- | ------- | ---- | -------- | -------- | -------- | --------------- | -------------- | --------- | -------------- | --- |
|                 |     |         |      |          |          |          | and Christopher | D. Manning.    | HotpotQA: | A dataset      | for |
| [Seeetal.,2017] |     | Abigail | See, | Peter J. | Liu, and | Christo- |                 |                |           |                |     |
pher D. Manning. Get to the point: Summarization with diverse, explainable multi-hop question answering. In
| pointer-generatornetworks. |     |     | InACL,2017. |     |     |     | EMNLP,2018. |     |     |     |     |
| -------------------------- | --- | --- | ----------- | --- | --- | --- | ----------- | --- | --- | --- | --- |
[Shenetal.,2023] Yiqiu Shen, Laura Heacock, Jonathan [Zhangetal.,2023] TianhangZhang,LinQiu,QipengGuo,
Elias, Keith D Hentel, Beatriu Reig, George Shih, and Cheng Deng, Yue Zhang, Zheng Zhang, Chenghu Zhou,
LindaMoy. Chatgptandotherlargelanguagemodelsare Xinbing Wang, and Luoyi Fu. Enhancing uncertainty-
|     |     |     |     |     |     |     | based hallucination | detection | with stronger | focus. | In  |
| --- | --- | --- | --- | --- | --- | --- | ------------------- | --------- | ------------- | ------ | --- |
double-edgedswords,2023.
| [Suetal.,2024] | WeihangSu,ChangyueWang,QingyaoAi, |     |     |     |     |     | EMNLP,2023. |     |     |     |     |
| -------------- | --------------------------------- | --- | --- | --- | --- | --- | ----------- | --- | --- | --- | --- |
[Zhangetal.,2024]
Yiran Hu, Zhijing Wu, Yujia Zhou, and Yiqun Liu. Un- Dongxu Zhang, Varun Gangal, Barrett
supervised real-time hallucination detection based on the Lattimer, and Yi Yang. Enhancing hallucination detec-
internal states of large language models. In Findings of tion through perturbation-based synthetic data generation
| ACL,2024.         |     |       |        |        |            |        | insystemresponses. | InFindingsofACL,2024. |     |     |     |
| ----------------- | --- | ----- | ------ | ------ | ---------- | ------ | ------------------ | --------------------- | --- | --- | --- |
| [Taorietal.,2023] |     | Rohan | Taori, | Ishaan | Gulrajani, | Tianyi |                    |                       |     |     |     |
Zhang,YannDubois,XuechenLi,CarlosGuestrin,Percy
| Liang, and | Tatsunori | B   | Hashimoto. | Stanford |     | alpaca: An |     |     |     |     |     |
| ---------- | --------- | --- | ---------- | -------- | --- | ---------- | --- | --- | --- | --- | --- |
instruction-followingllamamodel,2023.
[Thirunavukarasuetal.,2023]
|                  |       |            | Arun     |           |       | James      |     |     |     |     |     |
| ---------------- | ----- | ---------- | -------- | --------- | ----- | ---------- | --- | --- | --- | --- | --- |
| Thirunavukarasu, |       | Darren     | Shu      | Jeng      | Ting, | Kabilan    |     |     |     |     |     |
| Elangovan,       | Laura | Gutierrez, |          | Ting Fang | Tan,  | and Daniel |     |     |     |     |     |
| Shu Wei          | Ting. | Large      | language | models    | in    | medicine.  |     |     |     |     |     |
Naturemedicine,2023.
| [Touvronetal.,2023]   |            | Hugo   | Touvron,                       | Louis   | Martin,    | Kevin     |     |     |     |     |     |
| --------------------- | ---------- | ------ | ------------------------------ | ------- | ---------- | --------- | --- | --- | --- | --- | --- |
| Stone, Peter          | Albert,    | Amjad  | Almahairi,                     |         | Yasmine    | Babaei,   |     |     |     |     |     |
| Nikolay               | Bashlykov, | Soumya |                                | Batra,  | Prajjwal   | Bhargava, |     |     |     |     |     |
| Shruti Bhosale,       |            | et al. | Llama                          | 2: Open | foundation | and       |     |     |     |     |     |
| fine-tunedchatmodels. |            |        | arXivpreprintarXiv:2307.09288, |         |            |           |     |     |     |     |     |
2023.
| [Voitaetal.,2024] |             | Elena   | Voita,      | Javier | Ferrando, | and      |     |     |     |     |     |
| ----------------- | ----------- | ------- | ----------- | ------ | --------- | -------- | --- | --- | --- | --- | --- |
| Christoforos      | Nalmpantis. |         | Neurons     |        | in large  | language |     |     |     |     |     |
| models:           | Dead,       | n-gram, | positional. | In     | Findings  | of ACL,  |     |     |     |     |     |
2024.
[Wangetal.,2022]
|                                      |     | Xiaozhi | Wang, | Kaiyue | Wen, | Zhengyan     |     |     |     |     |     |
| ------------------------------------ | --- | ------- | ----- | ------ | ---- | ------------ | --- | --- | --- | --- | --- |
| Zhang,LeiHou,ZhiyuanLiu,andJuanziLi. |     |         |       |        |      | Findingskill |     |     |     |     |     |
8365