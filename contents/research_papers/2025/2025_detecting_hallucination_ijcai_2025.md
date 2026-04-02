|     |     |     | Detecting |     | Hallucination |          |     | in Large       | Language |          | Models | through |     |     |     |     |
| --- | --- | --- | --------- | --- | ------------- | -------- | --- | -------------- | -------- | -------- | ------ | ------- | --- | --- | --- | --- |
|     |     |     |           |     | Deep          | Internal |     | Representation |          | Analysis |        |         |     |     |     |     |
Anonymoussubmission#1316
Abstract
|     |     |     |     |     |     |     |     |     | methods, | sampling-based                |     | methods, | uncertainty-based |     | meth-      | 41  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----------------------------- | --- | -------- | ----------------- | --- | ---------- | --- |
|     |     |     |     |     |     |     |     |     | ods, and | internal-representation-based |     |          | methods.          |     | Retrieval- | 42  |
1 Largelanguagemodels(LLMs)havedemonstrated based methods [Li et al., 2023a; Min et al., 2023] evaluate
43
2 exceptional performance across various domains. theveracityoftheresponsegeneratedbyLLMsagainstexter-
44
However, LLMsarepronetohallucinatefactsand nalknowledgesources. However,thesemethodsrelyheavily
| 3   |          |       |             |            |               |               |        |     |                                                   |                |     |         |          |     |            | 45  |
| --- | -------- | ----- | ----------- | ---------- | ------------- | ------------- | ------ | --- | ------------------------------------------------- | -------------- | --- | ------- | -------- | --- | ---------- | --- |
|     | generate |       | non-factual | responses, |               | which can     | under- |     |                                                   |                |     |         |          |     |            |     |
| 4   |          |       |             |            |               |               |        |     | onexternalknowledgesources,whichmaynotalwaysbeac- |                |     |         |          |     |            | 46  |
|     | mine     | their | reliability |            | in real-world | applications. |        |     |                                                   |                |     |         |          |     |            |     |
| 5   |          |       |             |            |               |               |        |     | cessible.                                         | Sampling-based |     | methods | [Manakul | et  | al., 2023; | 47  |
6 Current hallucinate detection methods suffer from Mu¨ndleretal., 2024]assessinformationconsistencyamong
48
7 external resource demands, substantial time over- multiple sampled responses from the same LLM. How-
49
head, difficulty overcoming LLMs’ intrinsic limi- ever, these methods are impractical for real-time scenarios
| 8   |                                 |     |     |     |     |                |     |     |     |     |     |     |     |     |     | 50  |
| --- | ------------------------------- | --- | --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | tation,andinsufficientmodeling. |     |     |     |     | Inthispaper,we |     |     |     |     |     |     |     |     |     |     |
9 due to the excessive time overhead of multiple sampling. 51
|     | propose | MHAD, |     | a novel | internal-representation- |     |     |     |                   |     |         |        |         |       |         |     |
| --- | ------- | ----- | --- | ------- | ------------------------ | --- | --- | --- | ----------------- | --- | ------- | ------ | ------- | ----- | ------- | --- |
| 10  |         |       |     |         |                          |     |     |     | Uncertainty-based |     | methods | [Zhang | et al., | 2023; | Manakul | 52  |
11 basedhallucinationdetectionmethod. MHADuti- etal.,2023]evaluatethefactualaccuracyofLLM-generated
53
12 lizes linear probing to select neurons and layers responsesbycalculatingtheprobabilityorentropyoftokens
54
withinLLMs. Theselectedneuronsandlayersare within them. Although these methods eliminate the need
| 13  |              |     |      |             |           |     |           |     |     |     |     |     |     |     |     | 55  |
| --- | ------------ | --- | ---- | ----------- | --------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | demonstrated |     | with | significant | awareness |     | of hallu- |     |     |     |     |     |     |     |     |     |
14 for additional resources like external knowledge sources or 56
|     | cinations |               | at the | initial     | and final | generation | steps.   |     |                                                      |     |     |     |     |     |      |     |
| --- | --------- | ------------- | ------ | ----------- | --------- | ---------- | -------- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | ---- | --- |
| 15  |           |               |        |             |           |            |          |     | sampledresponsesfromLLMs,theypresentsignificantchal- |     |     |     |     |     |      | 57  |
|     | By        | concatenating |        | the outputs | from      | these      | selected |     |                                                      |     |     |     |     |     |      |     |
| 16  |           |               |        |             |           |            |          |     | lengesinaddressingtheintrinsiclimitationofLLMs:      |     |     |     |     |     | LLMs |     |
58
17 neurons of selected layers at the initial and final cangeneratehallucinationswithhighconfidence[Azariaand
59
generation steps, a hallucination awareness vector Mitchell,2023;Schulman,2023]. Internal-representation-
| 18  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 60  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
isformed,enablingprecisehallucinationdetection basedmethods[AzariaandMitchell, 2023;Suetal., 2024;
| 19  |     |               |     |            |        |               |     |     |         |            |     |         |        |                |     | 61  |
| --- | --- | ------------- | --- | ---------- | ------ | ------------- | --- | --- | ------- | ---------- | --- | ------- | ------ | -------------- | --- | --- |
|     | via | a multi-layer |     | perceptron | (MLP). | Additionally, |     |     |         |            |     | 2024]   |        |                |     |     |
| 20  |     |               |     |            |        |               |     |     | Chen et | al., 2024; | Du  | et al., | detect | hallucinations |     | 62  |
weintroduceSOQHD,anovelbenchmarkforeval-
21 based on the internal representation of LLMs. Azaria and 63
22 uatinghallucinationdetectioninOpen-DomainQA Mitchell[2023]showthattheinternalrepresentationdemon-
64
23 (ODQA).ExtensiveexperimentsshowthatMHAD strates greater reliability than uncertainty. However, these
65
outperformsexistinghallucinationdetectionmeth- methodsstillsufferfrominsufficientmodelingastheyneglect
| 24  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 66  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
odsacrossmultipleLLMs,demonstratingsuperior
| 25  |     |     |     |     |     |     |     |     | thecomplementaryinformationacrosslayersandgeneration |     |     |     |     |     |     | 67  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
effectiveness.
| 26  |     |     |     |     |     |     |     |     | stepsofLLMs. |     |       |            |         |      |        | 68  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ----- | ---------- | ------- | ---- | ------ | --- |
|     |     |     |     |     |     |     |     |     | To address   | the | above | issues, we | propose | MHAD | (Model |     |
69
|     |     |     |     |     |     |     |     |     | Hallucination | Awareness |     | for Hallucination |     | Detection), |     | a 70 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --------- | --- | ----------------- | --- | ----------- | --- | ---- |
1 Introduction
27 novelinternal-representation-basedmethodtodetecthalluci- 71
Althoughlargelanguagemodels(LLMs)havedemonstrated nationsinLLMs. Weassumethattheinternalrepresentations
| 28  |            |             |     |        |         |        |     |         |                                                    |     |     |     |                  |     |     | 72  |
| --- | ---------- | ----------- | --- | ------ | ------- | ------ | --- | ------- | -------------------------------------------------- | --- | --- | --- | ---------------- | --- | --- | --- |
|     |            |             |     |        |         |        | [Wu |         | ofLLMsencompasstheirawarenessofwhethertheresponses |     |     |     |                  |     |     |     |
| 29  | remarkable | performance |     | across | diverse | fields |     | et al., |                                                    |     |     |     |                  |     |     | 73  |
|     |            |             |     |        |         |        |     |         | theygeneratearehallucinatedorfactual.              |     |     |     | Ourbasicideaisto |     |     |     |
30 2023; Thirunavukarasu et al., 2023; Hedderich et al., 2024; 74
Wang et al., 2024], they are known to have a risk of gener- model the hallucination awareness in LLMs based on their 75
31
ating hallucinations [Bang et al., 2023; Shen et al., 2023]. internal representations across layers during the generation 76
32
Hallucinations—instances where LLMs generate responses processfordetectinghallucinations.
| 33  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 77  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
34 that appear plausible but are factually incorrect—hinder the AfterLLMsprocessthequerybutbeforegeneratingare- 78
35 adoptionofLLMsinreal-worldapplicationsthatrequirehigh sponse,theyonlyencodethequerywithoutencodinganyhal-
79
reliability and factual correctness [Ji et al., 2023; Huang et lucination. When LLMs generate the termination token, the
| 36  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 80  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
al., 2023]. Detectinghallucinationshelpsreliablyassessthe factuality of the responses is determined, as the termination
| 37  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 81  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
truthfulnessofLLM-generatedresponses. token itself is hallucination-free, and the generation process
| 38  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 82  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
39 CurrentresearchonhallucinationdetectionforLLMscan ceasesoncetheterminationtokenisgenerated. Wefocuson 83
40 be broadly classified into four categories: retrieval-based the internal representation at the initial and final generation 84

steps. Moreover,someworkssuggestthatdifferentlayersof representation-based hallucination detection method. Three
| 85  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 142 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
transformer-based language models capture various aspects types of internal representations are primarily utilized: at-
| 86  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 143 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
87 of the input, from basic lexical and grammatical features in tention output, feed-forward network output, and layer out- 144
88 lowerlayerstomoreabstractconceptsinhigherlayers[Jawa- put. MHADconsistsofseveralkeysteps: internalrepresen- 145
har et al., 2019; Sajjad et al., 2022; Wang et al., 2022; tation collection, linear probing, neuron selection, layer se-
| 89  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 146 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Voita et al., 2024]. Therefore, we harness the complemen- lection,andhallucinationawarenessvectorconstruction. The
| 90  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 147 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
taryinformationacrosslayersofLLMstoenhancethemod- overviewofMHADisprovidedinFigure1.
| 91  |       |                  |     |            |     |               |     |             |     |     |     |     |     |     |     | 148 |
| --- | ----- | ---------------- | --- | ---------- | --- | ------------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 92  | eling | of hallucination |     | awareness. |     | Specifically, |     | we leverage |     |     |     |     |     |     |     |     |
2.1 InternalRepresentationCollection
93 linear probing [Alain and Bengio, 2017; Burns et al., 2023; 149
Park et al., 2024] to select neurons and layers within LLMs WefeedthequestionintoLLMsandgathertheinternalrep- 150
94
thatdemonstratesignificantawarenessofhallucinationsatthe resentationsfromeachlayerattheinitialandfinalgeneration 151
95
|     | initial | and final | generation |     | steps. | By concatenating |     | the out- | steps. |            |              |                  |     |     |            |     |
| --- | ------- | --------- | ---------- | --- | ------ | ---------------- | --- | -------- | ------ | ---------- | ------------ | ---------------- | --- | --- | ---------- | --- |
| 96  |         |           |            |     |        |                  |     |          |        |            |              |                  |     |     |            | 152 |
|     |         |           |            |     |        |                  |     |          | To     | comprehend | the internal | representations, |     |     | the mecha- |     |
97 putsfromtheselectedneuronsofselectedlayersattheinitial 153
|     |     |     |     |     |     |     |     |     | nism | of Transformer | is  | formalized. | The | essential | compu- |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | -------------- | --- | ----------- | --- | --------- | ------ | --- |
98 and final generation steps, a hallucination awareness vector 154
is formed. The vector is then used to detect hallucinations tations involve query, key, and value vectors derived from 155
99
via a multi-layer perceptron (MLP). MHAD eliminates the thehiddenstate,concatenationofattentionheadsoutput,and 156
100
needforexternalknowledgesourcesormultiplesampledre- feed-forward network transformations. Specifically, the at-
| 101 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 157 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sponsesanddemonstratessuperiorperformance. tentionoutput(AO),feed-forwardnetworkoutput(FO),and
| 102 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 158 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
layeroutput(LO)areextractedasfollows:
| 103 | To  | evaluate | MHAD |     | thoroughly, | we  | develop | SOQHD |     |     |     |     |     |     |     | 159 |
| --- | --- | -------- | ---- | --- | ----------- | --- | ------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
104 (Sustainable Open-Domain QA Hallucination Detection), Q =XWQ, (1)
h
|     | a novel | benchmark |     | for | hallucination | detection |     | in ODQA. |     |     |     |     | h   |     |     | 160 |
| --- | ------- | --------- | --- | --- | ------------- | --------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 105 |         |           |     |     |               |           |     |          |     |     |     |     | K,  |     |     |     |
ODQA is a challenging knowledge-intensive task and rele- K h =XW (2)
| 106 |     |     |     |     |     |     |     |     |     |     |     |     | h   |     |     | 161 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
vant to practical use cases [Guu et al., 2020; Lewis et al., V =XWV, (3)
| 107 |     |     |     |     |        |     |     |     |     |     |     | h   | h   |     |     |     |
| --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     | 2023]. |     |     |     |     |     |     |     |     |     |     | 162 |
108 2020; Friel and Sanyal, We hence focuses on de- AO=concat (softmax(Q KT)V ), (4)
|     |     |     |     |     |     |     |     |     |     |     |     | h   | h   | h h |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
109 tectinghallucinationsinODQA.Previousbenchmarks[Liet =X+AO, 163
|     |                                                     |     |     |     |     |     |     |     |     |     | H        |     |     |      | (5) |     |
| --- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | ---- | --- | --- |
|     | al.,2023a;Manakuletal.,2023;AzariaandMitchell,2023; |     |     |     |     |     |     |     |     |     |          |     |     |      |     | 164 |
| 110 |                                                     |     |     |     |     |     |     |     |     |     | FO=f (HW | +b  | )W  | +b , | (6) |     |
Friel and Sanyal, 2023] have primarily focused on specific a ct 1 1 2 2
| 111 |                                                   |     |     |     |     |     |     |     |     |     | L O=H | +F  | O,  |     |     | 165 |
| --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- |
|     | datatypes,suchasresponsesgeneratedbyLLMsalongwith |     |     |     |     |     |     |     |     |     |       |     |     |     | (7) |     |
112
|     |     |     |     |     |     |     |     |     | where | X represents | the | hidden state | of  | Transformer, | W   | Q,  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | ------------ | --- | ------------ | --- | ------------ | --- | --- |
113 hallucination labels, thereby limiting their applicability to h 166
114 evaluate internal-representation-based methods. Moreover, W K,W V arethelineartransformationmatricesforcomput-
|     |     |     |     |     |     |     |     |     | h   | h   |     |     |     |     |     | 167 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
thesebenchmarksdonotconsidertemporalconsistencydur- ing the query vector Q , key vector K , and value vector
| 115 |     |     |     |     |     |     |     |     |     |     | h   |     | h   |     |     | 168 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ing construction, which may result in outdated labels. For V oftheh-thattentionhead, concatdenotestheconcatena-
| 116 |     |     |     |     |     |     |     |     | h   |     |     |     |     |     |     | 169 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
example,thelabelforquestionlike—Tothenearestmillion, W ,b ,W ,b
| 117 |     |     |     |     |     |     |     |     | tion | operation, | 1 1 | 2 2 are | the weight | parameters |     | of 170 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | ---------- | --- | ------- | ---------- | ---------- | --- | ------ |
118 what is the population of Australia?—need to be updated thefeed-forwardnetwork(FFN),andf act denotestheactiva- 171
119 to reflect the latest population. SOQHD provides not only tionfunctionintheFFN.
172
|     | the LLM-generated                                        |     |     | responses, | along | with | hallucination | la- |     |               |     |     |     |     |     |     |
| --- | -------------------------------------------------------- | --- | --- | ---------- | ----- | ---- | ------------- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
| 120 |                                                          |     |     |            |       |      |               |     | 2.2 | LinearProbing |     |     |     |     |     |     |
|     | bels,butalsotheinternalrepresentationsacrosslayersduring |     |     |            |       |      |               |     |     |               |     |     |     |     |     | 173 |
121
thegenerationprocessofmultipleLLMs,suchasLLaMA3- Linear probing [Alain and Bengio, 2017] initially trains an
| 122 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 174 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Instruction-8B[Meta,2024]. auxiliaryclassifierbasedontheinternalactivationlayerout-
| 123 |     |     |     |     | Additionally,SOQHDexclude |     |     |     |     |     |     |     |     |     |     | 175 |
| --- | --- | --- | --- | --- | ------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
124 questionswithanswersthatvaryovertimetoensuretemporal putsofneuralnetworkstodetectcertainattributesofthein- 176
consistency. Ourcontributionsarethreefold: put. Weuselinearprobingtomodelthehallucinationaware- 177
125
nesswithintheinternalrepresentationsofLLMs.
| 126 | •   | We propose |     | MHAD, | a novel | hallucination |     | detection |     |     |     |     |     |     |     | 178 |
| --- | --- | ---------- | --- | ----- | ------- | ------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
Specifically,weconstructalinearprobeclassifierforeach
| 127 |     | method,                                        | which | utilizes | the | internal | representations |     |       |                |           |            |     |        |             | 179 |
| --- | --- | ---------------------------------------------- | ----- | -------- | --- | -------- | --------------- | --- | ----- | -------------- | --------- | ---------- | --- | ------ | ----------- | --- |
|     |     |                                                |       |          |     |          |                 |     | layer | at the initial | and final | generation |     | steps. | Each linear |     |
|     |     | acrosslayersduringthegenerationprocessofLLMsto |       |          |     |          |                 |     |       |                |           |            |     |        |             | 180 |
128
detecthallucinations. probeclassifierisatwo-layerFFN,withitsinputcorrespond- 181
129
|     |     |            |     |        |         |               |     |        | ingtothedimensionoftheinternalrepresentation. |     |     |     |     |     | Theout- | 182 |
| --- | --- | ---------- | --- | ------ | ------- | ------------- | --- | ------ | --------------------------------------------- | --- | --- | --- | --- | --- | ------- | --- |
|     | •   | We develop |     | SOQHD, | a novel | hallucination |     | detec- |                                               |     |     |     |     |     |         |     |
130 put of the linear probe classifier is a binary label, indicat-
|     |     | tion benchmark |     | for | ODQA, | which | provides | the LLM- |     |     |     |     |     |     |     | 183 |
| --- | --- | -------------- | --- | --- | ----- | ----- | -------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
131 ing whether the LLMs generate hallucination. This step of-
|     |     | generatedresponsesalongwithhallucinationlabelsand |     |     |     |     |     |     |                                                        |     |     |     |     |     |     | 184 |
| --- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
| 132 |     |                                                   |     |     |     |     |     |     | fersguidanceforsubsequentneuronandlayerselectionsteps. |     |     |     |     |     |     |     |
185
133 the internal representations of LLMs, while ensuring The training process of the linear probe classifier is formu-
186
134 temporalconsistency.
|     |     |     |     |     |     |     |     |     | latedas: |     |     |     |     |     |     | 187 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
135 • Weconductextensiveexperimentsonmultipledatasets, Wˆt,ˆbt ←arg min BCE(Y,σ(ItWt+bt)), (8)
|     |     |               |           |      |         |             |          |         |     | l   | l      |     | l   | l   | l   |     |
| --- | --- | ------------- | --------- | ---- | ------- | ----------- | -------- | ------- | --- | --- | ------ | --- | --- | --- | --- | --- |
|     |     | demonstrating |           | that | MHAD    | outperforms | existing | hal-    |     |     | W t,bt |     |     |     |     |     |
| 136 |     |               |           |      |         |             |          |         |     |     | l      | l   |     |     |     |     |
|     |     | lucintion     | detection |      | methods | across      | multiple | LLMs in |     |     |        |     |     |     |     |     |
137 where It represents the internal representations of the l-th
|     |     | termsofeffectiveness. |     |     |     |     |     |     |     | l   |     |     |     |     |     | 188 |
| --- | --- | --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
138 layer at the t-th generation step, σ is the sigmoid activation
189
function,mappingtheoutputofthelinearprobeclassifierto
|     | 2 MHAD |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 190 |
| --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
139 the (0,1) range, BCE is the binary cross-entropy loss func-
191
|     |     |     |     |     |     |     |     |     |     | Wt  | bt  |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
140 In this section, we introduce MHAD (Model Hallucination tion, and are the trainable weight parameters of the 192
|     |     |     |     |     |     |     |     |     |     | l   | l   |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
141 Awareness for Hallucination Detection), a novel internal- linearprobeclassifier,andY istheground-truthlabel. 193

Internal Representation Collection Linear Probing Neuron & Layer Selection HAV Construction
D
T
LO
l
Decoder Block Layer
FO
|     |     |              |     |     | l   |     | IR l |     |     |     |     | +   |     |     |
| --- | --- | ------------ | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
| L   |     | Feed-Forward |     |     |     |     |      |     |     |     |     |     |     |     |
AO
|     |     |           |     |     | l   |     | IRt |     |     |     |     |     |     |     |
| --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     | Attention |     |     |     |     | l   |     |     |     |     |     |     |     |
2L x
|     |     | Question |     |     |     |     |     |     | t=1 |     | t=T |     |     |     |
| --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
L: layer number of LLMs LO: layer output FO: feed-forward network output AO: attention output IR: any internal representation
D: dimension of IR T: total number of generation steps l: any layer t: any genetation step HAV: hallucination awareness vector
Figure1:OverviewofMHAD.Wefocusontheinternalrepresentationsattheinitialandfinalgenerationsteps(orangetable).Neurons(gray
bold line) and layers (yellow node) within LLMs that demonstrate significant awareness of hallucinations are selected by linear probing.
Theoutputsfromtheseselectedneuronsofselectedlayersattheinitialandfinalgenerationstepsareconcatenatedtoformthehallucination
awarenessvector(greentable),whichenablesprecisehallucinationdetectionviaamulti-layerperceptron(MLP).
| 2.3 | NeuronSelection |     |     |     |     |     |     |                                                      |     |     |     |     |     |     |
| --- | --------------- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| 194 |                 |     |     |     |     |     |     | selectedinthel-thlayeratthet-thgenerationstepofLLMs. |     |     |     |     |     | 223 |
Hanetal.[2016]assessedtheimportanceofneuralnetwork Notethatthesmallertheα,thelesslikelyitistoselectneu- 224
195
ronscorrespondingtoweightparameterswithsmallabsolute
196 weightparametersbasedontheirabsolutevalues,settingin- 225
values.
197 significantweightparametersto0forweightpruning. Wese- 226
lectneuronsthatdemonstratesignificantawarenessofhallu-
| 198                                                    |     |     |     |     |     |     |     | 2.4 | LayerSelection |     |     |     |     |     |
| ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | --- | --- | --- |
| cinationsbasedontheabsolutevalueofthelinearprobclassi- |     |     |     |     |     |     |     |     |                |     |     |     |     | 227 |
199
fier’sweightparameters.Neuronswithlargerabsoluteweight We select layers that demonstrate significant awareness of
| 200 |     |     |     |     |     |     |     |                |     |          |                 |        |             | 228 |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | -------- | --------------- | ------ | ----------- | --- |
|     |     |     |     |     |     |     |     | hallucinations |     | based on | the performance | of the | linear prob |     |
201 valuesareconsideredmoreinformativeforhallucinationde- 229
classifier.Thebettertheperformanceofthelinearprobeclas-
| 202 tection. |     |     |     |     |     |     |     |     |     |     |     |     |     | 230 |
| ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Specifically,wefirstsortthelinearprobclassifier’sweight sifier,themoresignificantthehallucinationawarenesswithin 231
203
parameters in descending order based on their absolute val- theinternalrepresentationsofthecorrespondinglayer. 232
204
ues.Wethengothroughtheseweightparametersfromlargest Specifically, we employ two heuristic rules: (i) using the
| 205 |     |     |     |     |     |     |     |     |     |     |     |     |     | 233 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
tosmallest. Whentheratioofthecumulativesumofsquared top-kmethodtoselectthetop-performinglayers,and(ii)set-
| 206 |     |     |     |     |     |     |     |     |     |     |     |     |     | 234 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
tingathresholdtoselectlayerswithAUROCabovethepre-
207 weight values to the total sum of squared weight values ex- 235
208 ceeds a predefined threshold, we select the neurons corre- defined threshold on the validation set. Given the variance 236
sponding to the traversed weight parameters. Squaring the in hallucination awareness across different layers, this step 237
209
weightvaluesisintendedtoreducetheimpactofweightpa- helpsmitigatetheinterferencefromthelayersdemonstrating
| 210 |     |     |     |     |     |     |     |     |     |     |     |     |     | 238 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
rameterswithsmallabsolutevalues. Sincetheinternalrepre- weakawarenessofhallucinations.
| 211 |     |     |     |     |     |     |     |     |     |     |     |     |     | 239 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
212 sentationsarehigh-dimensionalvectors,thisstepreducesthe
2.5 HallucinationAwarenessVectorConstruction
213 introductionofnoiseirrelevanttohallucination. Theprocess 240
ofneuronselectionisformulatedas: Thelaststepfirstconstructsahallucinationawarenessvector 241
214
throughconcatenatingtheoutputsfromtheselectedneurons
|     |     |     | A=argsort(abs(Wˆt)), |     |     |     | (9) |                                                      |     |     |     |     |     | 242 |
| --- | --- | --- | -------------------- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|     |     |     |                      |     | l   |     |     | ofselectedlayersattheinitialandfinalgenerationsteps. |     |     |     |     | The |     |
243
215 hallucinationawarenessvectorencapsulatesthecriticalinfor-
|     | i−1      |       |            |      | i        |       |     |     |     |     |     |     |     | 244 |
| --- | -------- | ----- | ---------- | ---- | -------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | (cid:88) | (Wˆ t | )2 <α·||Wˆ | t||2 | (cid:88) | (Wˆ t | )2, |     |     |     |     |     |     |     |
≤ m a tio n n e ce s s aryforhallucinationdetection. Theprocessis 245
|     |     | l ,Ak |     | l        | 2   | l ,Ak  | (10) |         |               |           |     |     |      |     |
| --- | --- | ----- | --- | -------- | --- | ------ | ---- | ------- | ------------- | --------- | --- | --- | ---- | --- |
|     |     |       |     |          |     |        |      | fo rm u | la te d a s : |           |     |     |      | 246 |
|     | k=1 |       |     |          | k=1 |        |      |         |               |           |     |     |      |     |
|     |     |       |     | 1≤i≤|A|, |     | 0<α<1, |      |         |               | Iˆ=concat | (It | ),  | (12) |     |
t,ˆlt ˆlt,Nˆt
| 216 |     |     |     |                 |     |     |      |     |     |     |     | lˆt |     |     |
| --- | --- | --- | --- | --------------- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
|     |     | Nˆt | ={A | |k =1,2,...,i}, |     |     | (11) |     |     |     |     |     |     |     |
|     |     |     | l k |                 |     |     |      |     |     |     |     |     |     |     |
wheretdenotesthet-thgenerationstep,ˆlt
whereAistheindexsetoftheweightparameterssortedinde- representsthein- 247
| 217 |     |     |     |     |     |     |     |     |     |     |     |     | t   |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
scendingorderoftheirabsolutevalues,A denotestheindex dexofaselectedlayeratthet-thgenerationstep,I rep- 248
| 218                                                  |     |     |     |     |     | k   |     |                                                |     |     |     |     | ˆl t,Nˆt |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------- | --- | --- | --- | --- | -------- | --- |
| oftheweightparameterwiththek-thlargestabsolutevalue, |     |     |     |     |     |     |     |                                                |     |     |     |     | lˆ t     |     |
| 219                                                  |     |     |     |     |     |     |     | resentstheoutputsfromtheselectedneuronsofthese |     |     |     |     | l ected  |     |
| Wˆ                                                   |     |     |     |     |     |     |     |                                                |     |     |     |     |          | 249 |
t represents the value of the weight parameter, which layeratthet-thgenerationstep,andIˆdenotesthehallucina-
| 220 l ,Ak |     |     |     |     |     |     |     |     |     |     |     |     |     | 250 |
| --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ranksasthek-thlargestinabsolutevalue,αisthepredefined
| 221 |     |     |     |     |     |     |     | tionawarenessvector. |     |     | AnMLPisthentrainedbasedonthe |     |     | 251 |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | ---------------------------- | --- | --- | --- |
ratiothreshold,andNˆtrepresentstheindexsetoftheneurons
| 222 |     |     |     |     |     |     |     | hallucinationawarenessvectortodetecthallucinations. |     |     |     |     |     | 252 |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- |
l

3 TheSOQHDBenchmark
| 253 |     |     |     |     |     |     |     |     |     | Model |     | H=0Rate |     | CompleteRate |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | ------- | --- | ------------ | --- | --- |
In this section, we introduce SOQHD (Sustainable Open- Alpaca-7B 0.476 1.000
254
|     |        |     |               |             |     |         |               |     |     | Vicuna-7B      |     | 0.464 |     | 0.998 |     |     |
| --- | ------ | --- | ------------- | ----------- | --- | ------- | ------------- | --- | --- | -------------- | --- | ----- | --- | ----- | --- | --- |
| 255 | Domain | QA  | Hallucination | Detection), |     | a novel | hallucination |     |     |                |     |       |     |       |     |     |
|     |        |     |               |             |     |         |               |     |     | LLaMA2-Chat-7B |     | 0.545 |     | 0.999 |     |     |
256 detectionbenchmarkforODQA.Theconstructionprocessin-
|     |                   |           |                                  |     |     |     |     |     |     | LLaMA2-Chat-13B       |     | 0.573 |     | 1.000 |     |     |
| --- | ----------------- | --------- | -------------------------------- | --- | --- | --- | --- | --- | --- | --------------------- | --- | ----- | --- | ----- | --- | --- |
|     | cludesthreesteps: |           | filtering,sampling,andreasoning. |     |     |     |     |     |     |                       |     |       |     |       |     |     |
| 257 |                   |           |                                  |     |     |     |     |     |     | LLaMA3-Instruction-8B |     | 0.634 |     | 1.000 |     |     |
|     | 3.1               | Filtering |                                  |     |     |     |     |     |     |                       |     |       |     |       |     |     |
258
|     |     |     |     |     |     |     |     |     | Table1: | Hallucination-freerateandcompleterateofLLMsonthe |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- |
Thefilteringstepaimstoexcludequestionswithanswersthat
259 trainingsetofSOQHD,whereH=0Rateindicatesthehallucination-
|     | varyovertimetoensuretemporalconsistency. |     |     |     |     |     | Forexample, |     |     |     |     |     |     |     |     |     |
| --- | ---------------------------------------- | --- | --- | --- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
260 freerate. Weconsideraresponsecompleteifitsfinaltokenisthe
|     | the labels                 | for | questions | like “To | the                      | nearest | million, | what is |                   |     |     |     |     |     |     |     |
| --- | -------------------------- | --- | --------- | -------- | ------------------------ | ------- | -------- | ------- | ----------------- | --- | --- | --- | --- | --- | --- | --- |
| 261 |                            |     |           |          |                          |         |          |         | terminationtoken. |     |     |     |     |     |     |     |
| 262 | thepopulationofAustralia?” |     |           |          | havebecomeoutdatedasthey |         |          |         |                   |     |     |     |     |     |     |     |
263 failtoreflectcurrentdata.
This step begins with the manual annotation of a small bewordy,whichmakestheExactMatch(EM)score,thetra-
| 264 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 308 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sample of questions from the development sets of Trivi- ditionalevaluationmetricforODQAtasks[Chenetal.,2017;
| 265 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 309 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
aQA[Joshietal.,2017]andNQ[Kwiatkowskietal.,2019], IzacardandGrave,2021],notapplicable. Thus,weconsider
| 266 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 310 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
theresponsetohavehallucinationiftheground-truthanswer
| 267 | whicharewidelyusedODQAbenchmarks. |     |     |     |     |     | gpt-3.5-turbois |     |     |     |     |     |     |     |     | 311 |
| --- | --------------------------------- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
268 also used to annotate these samples. Statistics indicate that doesnotappearintheresponse;otherwise,itisconsideredto 312
theannotationresultsofgpt-3.5-turboachieveaconsistency not have hallucination. The generated responses, hallucina- 313
269
rateofupto96%withhumanannotations.Therefore,wean- tion labels, and internal representations across layers during
| 270 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 314 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
notatetheremainingquestionsusinggpt-3.5-turbo. Inspired thegenerationprocessarestoredtoformthefinalSOQHD.
| 271 |                     |     |       |     |        |     |         |          |     |          |     |     |     |     |     | 315 |
| --- | ------------------- | --- | ----- | --- | ------ | --- | ------- | -------- | --- | -------- | --- | --- | --- | --- | --- | --- |
|     |                     |     | [Wang |     | 2023], |     |         |          |     |          |     |     |     |     |     |     |
| 272 | by self-consistency |     |       | et  | al.,   |     | we have | gpt-3.5- |     |          |     |     |     |     |     |     |
|     |                     |     |       |     |        |     |         |          | 3.4 | Analysis |     |     |     |     |     |     |
273 turbo annotate each question five times and obtain the final 316
annotationresultviamajorityvoting,ensuringhighaccuracy. The hallucination-free rate and complete rate of five LLMs
| 274 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 317 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
QuestionsinthedevelopmentsetsofTriviaQAandNQwith
| 275 |     |     |     |     |     |     |     |     | onthetrainingsetofSOQHDareshowninTable1. |     |     |     |     |     |     | 318 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
time-varyinganswersarethenfilteredout.
| 276 |     |     |     |     |     |     |     |     |     | FindingsindicatethatlargerLLMsgenerallyperformbet- |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- |
319
|     |     |          |     |     |     |     |     |     | ter, | with | LLaMA3-Instruction-8B |     | outperforming |     | others de- |     |
| --- | --- | -------- | --- | --- | --- | --- | --- | --- | ---- | ---- | --------------------- | --- | ------------- | --- | ---------- | --- |
|     | 3.2 | Sampling |     |     |     |     |     |     |      |      |                       |     |               |     |            | 320 |
277 spite not being the largest. Moreover, LLMs can typically
321
The sampling step aims to construct the question set of SO- answerthequestionsfromSOQHDwithinthemaximumgen-
| 278 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 322 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
279 QHDwhilemaintainingtheoriginaldatasets’responselength erationlength. 323
280 distribution.
|     | To          | ensure | that the final | token | generated            |     | by LLMs | is the | 4   | Experiments |     |     |     |     |     |     |
| --- | ----------- | ------ | -------------- | ----- | -------------------- | --- | ------- | ------ | --- | ----------- | --- | --- | --- | --- | --- | --- |
| 281 |             |        |                |       |                      |     |         |        |     |             |     |     |     |     |     | 324 |
|     | termination | token, | questions      |       | that LLaMA2-Chat-13B |     |         | [Tou-  |     |             |     |     |     |     |     |     |
282
vron et al., 2023] cannot answer within a maximum gener- 4.1 Experimentsetting
| 283 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 325 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
284 ation length of 300 are excluded. The remaining questions Dataset and Metrics. We evaluate MHAD and other base-
326
285 arestratifiedintothreelevelsbasedonthelengthofresponse linesonourproposedSOQHDdataset. Consistentwithpre-
327
generatedbyLLaMA2-Chat-13B.Stratifiedsamplingisthen viousstudies[Chenetal.,2024;Duetal.,2024],weuseAU-
| 286 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 328 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
usedtoformthequestionsetofSOQHD.Thetrainingsetof
| 287 |       |          |         |         |            |     |         |          | ROCastheevaluationmetric.                              |     |     | AUROCisapopularmetricto |     |     |     | 329 |
| --- | ----- | -------- | ------- | ------- | ---------- | --- | ------- | -------- | ------------------------------------------------------ | --- | --- | ----------------------- | --- | --- | --- | --- |
|     | SOQHD | contains | a total | of 2000 | questions, |     | and the | test set |                                                        |     |     |                         |     |     |     |     |
| 288 |       |          |         |         |            |     |         |          | evaluatethequalityofabinaryclassifier.Wealsoevaluateon |     |     |                         |     |     |     |     |
330
289 comprises500questions. existingdatasets: HaluEval[Lietal.,2023a].
331
|     |     |     |     |     |     |     |     |     | Baselines. |     | We choose the | following | nine | competitive | hallu- |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------------- | --------- | ---- | ----------- | ------ | --- |
332
| 290 | 3.3 | Reasoning |     |     |     |     |     |     |          |           |         |               |     |                 |     |     |
| --- | --- | --------- | --- | --- | --- | --- | --- | --- | -------- | --------- | ------- | ------------- | --- | --------------- | --- | --- |
|     |     |           |     |     |     |     |     |     | cination | detection | methods | as baselines. |     | (i) Probability | As- | 333 |
291 Thereasoningstepaimstoobtaintheresponsesgeneratedby sessment[Manakuletal.,2023]: Thismethoddetectshallu- 334
292 LLMs, the hallucination labels, and the internal representa- cinations based on the probabilities of generated tokens by
335
tionsacrosslayersduringthegenerationprocessofLLMs. LLMs. It uses average and max pooling to aggregate the
| 293 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 336 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Weselectfivewidelyusedopen-sourcefine-tunedLLMs, negative log probabilities of generated tokens, denoted as
| 294 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 337 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
including LLaMA3-Instruction-8B [Meta, 2024], LLaMA2- Avg(−logp) Max(−logp),
| 295 |     |          |     |        |     |     |     |       |     |     | and |     | respectively. | (ii) | Entropy | 338 |
| --- | --- | -------- | --- | ------ | --- | --- | --- | ----- | --- | --- | --- | --- | ------------- | ---- | ------- | --- |
|     |     | [Touvron |     | 2023], |     |     |     | [Tou- |     |     |     |     |               |      |         |     |
296 Chat-13B et al., LLaMA2-Chat-7B Assessment [Manakul et al., 2023]: This method detects 339
297 vron et al., 2023], Vicuna-7B [Chiang et al., 2023], and hallucinations based on the entropy of generated tokens by
340
Alpaca-7B [Taori et al., 2023], for reasoning. Compared to LLMs. Itusesaverageandmaxpoolingtoaggregatetheen-
| 298 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 341 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
baseLLMs,fine-tunedLLMsarebetterequippedtogenerate tropy of generated tokens, denoted as Avg(H) and Max(H),
| 299 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 342 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
concise and user-aligned responses necessary for real-world respectively. (iii) SelfCheckGPT [Manakul et al., 2023]:
| 300 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 343 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
301 applications. Totacklethechallengeofhallucinationinreal- This method assesses the consistency among multiple sam- 344
302 worldapplications,weselectfine-tunedLLMsasourfocus. pled responses from LLMs. Four methods are employed to
345
In this step, questions from SOQHD are inputted into assesstheconsistency,denotedasSCG-BS,SCG-QA,SCG-
| 303 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 346 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
multiple LLMs to generate responses. Normalization op- NG, and SCG-NLI. (iv) EUBHD [Zhang et al., 2023]: This
| 304 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 347 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
erations, including removing punctuation and converting to method detects hallucinations based on the uncertainty of
| 305 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 348 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
[Azaria
306 lowercase, are applied before inputting the questions. The generated keywords by LLMs. (v) SAPLMA and 349
307 greedy decoding strategy is employed. Since LLMs tend to Mitchell, 2023]: This method detects the truthfulness of a 350

|     |     | Baselines  | LLC-13B LLC-7B | LLI3-8B Vicuna-7B | Alpaca-7B |     |
| --- | --- | ---------- | -------------- | ----------------- | --------- | --- |
|     |     | Avg(−logp) | 0.6336 0.5933  | 0.6498 0.6153     | 0.7009    |     |
|     |     | Avg(H)     | 0.6122 0.5706  | 0.6842 0.4639     | 0.7313    |     |
|     |     | Max(−logp) | 0.5546 0.5211  | 0.6409 0.4627     | 0.7040    |     |
|     |     | Max(H)     | 0.5496 0.5097  | 0.6793 0.5079     | 0.7215    |     |
|     |     | SCG-BS     | 0.5552 0.5775  | 0.6195 0.5958     | 0.6792    |     |
|     |     | SCG-QA     | 0.5431 0.5620  | 0.5888 0.5889     | 0.6969    |     |
|     |     | SCG-NG     | 0.5364 0.5525  | 0.6018 0.6409     | 0.7109    |     |
|     |     | SCG-NLI    | 0.5538 0.6073  | 0.7060 0.7019     | 0.7548    |     |
|     |     | EUBHD      | 0.5728 0.5798  | 0.6431 0.6242     | 0.5764    |     |
|     |     | SAPLMA     | 0.4384 0.4773  | 0.4052 0.4663     | 0.4310    |     |
|     |     | MIND       | 0.5099 0.5138  | 0.5424 0.5065     | 0.5190    |     |
|     |     | INSIDE     | 0.5398 0.5752  | 0.5972 0.6895     | 0.6532    |     |
|     |     | HaloScope  | 0.6517 0.5959  | 0.5071 0.5581     | 0.5866    |     |
|     |     | GPT4-HR    | 0.7092 0.6705  | 0.6684 0.7069     | 0.7942    |     |
|     |     | MHAD-AO    | 0.7768 0.7336  | 0.7843 0.7771     | 0.7875    |     |
|     |     | MHAD-FO    | 0.7642 0.7337  | 0.7665 0.7566     | 0.7869    |     |
|     |     | MHAD-LO    | 0.7728 0.7204  | 0.7539 0.7646     | 0.7961    |     |
Table2:ComparisonofMHADwithbaselinemethodsintermsofAUROConthetestsetofSOQHD.SCGstandsfor“SelfCheckGPT”,LLC
standsfor“LLaMA2-Chat”,andLLI3standsfor“LLaMA3-Instruction”. Thebestresultsareinbold. MHADoutperformsotherbaselines
significantlywithp-value<0.05.
351 statementbasedontheinternalrepresentationofLLMs. (vi) awarenessofwhethertheirresponsesarehallucinatedorfac- 385
MIND [Su et al., 2024]: This is a training framework that tual. It also demonstrates the potential of using comple-
| 352 |     |     |     |     |     | 386 |
| --- | --- | --- | --- | --- | --- | --- |
leveragestheinternalrepresentationsofLLMsforhallucina- mentary information within the internal representations of
| 353 |     |     |     |     |     | 387 |
| --- | --- | --- | --- | --- | --- | --- |
tiondetection.(vii)INSIDE[Chenetal.,2024]:Thismethod LLMs to detect hallucinations. Notably, MHAD surpasses
| 354 |     |     |     |     |     | 388 |
| --- | --- | --- | --- | --- | --- | --- |
355 explores the semantic information preserved within inter- Probability/Entropy Assessment baseline methods. We be- 389
356 nal representations for hallucination detection. (viii) Halo- lieve this suggests that LLMs are aware that they gener- 390
Scope [Du et al., 2024]: This is a learning framework for ate hallucinations with high confidence, making internal-
| 357 |     |     |     |     |     | 391 |
| --- | --- | --- | --- | --- | --- | --- |
hallucinationdetection,whichexploitstheLLMgenerations representation-basedmethodsdemonstrategreaterreliability
| 358 |     |     |     |     |     | 392 |
| --- | --- | --- | --- | --- | --- | --- |
arising in the wild. (ix) GPT4-HR [Li et al., 2023a]: This thanuncertainty-basedmethods,asalignedwiththediscover-
| 359 |     |     |     |     |     | 393 |
| --- | --- | --- | --- | --- | --- | --- |
iesmadebyAzariaandMitchell[2023].
360 method prompts a LLM to recognize whether the responses Moreover, MHAD 394
361 generatedbyotherLLMshavehallucination. doesnotrelyonexternalknowledgesourcesormultiplesam- 395
Implementation Details. The MHAD classifier employs a pledresponses,makingitsuitableforreal-worldapplications.
| 362 |     |     |     |     |     | 396 |
| --- | --- | --- | --- | --- | --- | --- |
4-layer MLP for hallucination detection, with its input cor- (ii) In most LLMs, the hallucination awareness in the
| 363        |                  |                      |           |     |     | 397 |
| ---------- | ---------------- | -------------------- | --------- | --- | --- | --- |
| responding | to the dimension | of the hallucination | awareness |     |     |     |
364 attention output is comparable to, or stronger than, that 398
365 vector. Thehiddenlayershavedimensionsof1024and128, intheothertwotypesofinternalrepresentations. Asindi- 399
366 respectively. The ReLU activation function is used between catedinTable2,theMHAD-AOdemonstratessuperiorper-
400
layers,withadropoutrateof0.5. Theclassifierisoptimized formance on LLaMA2-Chat-13B, LLaMA3-Instruction-8B,
| 367 |     |     |     |     |     | 401 |
| --- | --- | --- | --- | --- | --- | --- |
using Adam with a learning rate of 1e-5, a weight decay of and Vicuna-7B compared to both MHAD-FO and MHAD-
| 368 |     |     |     |     |     | 402 |
| --- | --- | --- | --- | --- | --- | --- |
1e-2,andatrainingbatchsizeof64.Forthehyperparameters LO. MHAD-AO
| 369 |     |     |     | When applied | to LLaMA2-Chat-7B, | per- 403 |
| --- | --- | --- | --- | ------------ | ------------------ | -------- |
MHAD-FO.
370 αandtop-kusedforneuronandlayerselection,thesettings forms only slightly below On Alpaca-7B, 404
371 are determined using the separate validation set, which is a MHAD-AO ranks second in performance among MHAD-
405
randomsampling20%subsetfromtheSOQHDtrainingset. AO,MHAD-FO,andMHAD-LO.
| 372 |     |     |     |     |     | 406 |
| --- | --- | --- | --- | --- | --- | --- |
Baselinesareimplementedusingofficialcodeanddatawhile
373 (iii) Other findings. (1) LLaMA3-Instruction-8B shows 407
| following | the settings | outlined in the | respective papers. All |     |     |     |
| --------- | ------------ | --------------- | ---------------------- | --- | --- | --- |
374 the lowest propensity for hallucinations among five LLMs, 408
375 experimentsareconductedonasingleRTXA6000. asindicatedintheTable1. However,theresponsesgenerated
409
byitarethemostchallengingforGPT-4torecognizewhether
| 4.2 MainResults |     |     |     |                                               |     | 410   |
| --------------- | --- | --- | --- | --------------------------------------------- | --- | ----- |
| 376             |     |     |     | theyarehallucinatedorfactual,asshowninTable2. |     | Webe- |
411
Table 2 presents the performance comparison of MHAD lievethisfindingasdifferentLLMshavedifferenthallucina-
| 377 |     |     |     |     |     | 412 |
| --- | --- | --- | --- | --- | --- | --- |
378 againstbaselinemethods. Ourkeyfindingsareasfollows: tion patterns. LLaMA3-Instruction-8B is the least prone to 413
(i) MHAD outperforms all baseline methods across hallucinations,makingitshallucinationpatternsthemostin-
| 379 |     |     |     |     |     | 414 |
| --- | --- | --- | --- | --- | --- | --- |
all LLMs. MHAD, leveraging the internal representations tricate and its responses the most challenging for GPT-4 to
| 380 |     |     |     |     |     | 415 |
| --- | --- | --- | --- | --- | --- | --- |
acrosslayersduringthegenerationprocessofLLMs, shows correctly recognize. Nevertheless, our method still demon-
| 381 |     |     |     |     |     | 416 |
| --- | --- | --- | --- | --- | --- | --- |
superiorperformanceacrossallLLMs,highlightingitseffec- strates outstanding performance. (2) SAPLMA, though ef-
| 382 |     |     |     |     |     | 417 |
| --- | --- | --- | --- | --- | --- | --- |
383 tiveness in detecting hallucinations. This supports the hy- fective on its own training dataset, exhibits inferior perfor- 418
384 pothesis that LLMs’ internal representations encompass the mancewhenappliedtodetectgenuinehallucinations. Webe- 419

|     | Method | LLC(13) LLC(7) | LLI3 Vicuna   | Alpaca |     |     |     |     |
| --- | ------ | -------------- | ------------- | ------ | --- | --- | --- | --- |
|     | SIR    | 0.7547 0.7071  | 0.7354 0.7475 | 0.7740 |     |     |     |     |
|     | +SN    | 0.7672 0.7214  | 0.7685 0.7450 | 0.7756 |     |     |     |     |
|     | +SL    | 0.7697 0.7182  | 0.7815 0.7649 | 0.7988 |     |     |     |     |
|     | +CGS   | 0.7768 0.7336  | 0.7843 0.7771 | 0.7875 |     |     |     |     |
Table3:Ablationresultsforattentionoutput.
lievethisasitstrainingdataisnotgeneratedbyLLMitself.
420
AlthoughMINDandEUBHDareeffectiveinwikipediagen-
421
| eration | task, | they show suboptimal | performance | in ODQA |     |     |     |     |
| ------- | ----- | -------------------- | ----------- | ------- | --- | --- | --- | --- |
422
423 task. Thiscouldbeattributedtothediscrepancybetweentwo Figure2: ComparisonofperformanceonthevalidationsetofSO-
424 tasks. We would like to note that ODQA is a challenging QHDacrossdifferentlayersandgenerationsteps.
knowledge-intensivetaskandrelevanttopracticalusecases,
425
| ensuring | SOQHD | can effectively | assess the | performance of |     |     |     |     |
| -------- | ----- | --------------- | ---------- | -------------- | --- | --- | --- | --- |
426
hallucinationdetectionmethodsinreal-worldapplications. Model H=1Rate
427
|     |               |     |     |     | Alpaca-7B       |     | 0.732(↑0.220) |     |
| --- | ------------- | --- | --- | --- | --------------- | --- | ------------- | --- |
|     |               |     |     |     | Vicuna-7B       |     | 0.724(↑0.172) |     |
| 4.3 | AblationStudy |     |     |     |                 |     |               |     |
| 428 |               |     |     |     | LLaMA2-Chat-7B  |     | 0.660(↑0.202) |     |
|     |               |     |     |     | LLaMA2-Chat-13B |     | 0.590(↑0.176) |     |
429 Table3presentstheresultsofourablationstudyforattention
|         |                                                |     |     |     | LLaMA3-Instruction-8B |     | 0.648(↑0.280) |     |
| ------- | ---------------------------------------------- | --- | --- | --- | --------------------- | --- | ------------- | --- |
| output. | Wedenotethebaseline,whichdetectshallucinations |     |     |     |                       |     |               |     |
430
usingthesingle-layerinternalrepresentationatthefinalgen-
431
eration step, as SIR. We then introduce the tricks of “Select Table4: HallucinationrateonthetestsetofSOQHDwhenLLMs
432
|     |     |     |     |     | arepresentedwithmisleadinginformation. |     | H=1Rateindicatesthe |     |
| --- | --- | --- | --- | --- | -------------------------------------- | --- | ------------------- | --- |
433 Neurons”(SN),“SelectLayers”(SL),and“ConcatenateGen-
hallucinationrate,andtheredarrowshowstheincreaseinhallucina-
434 erationSteps”(CGS)incrementallytoevaluatetheirimpact.
tionratecomparedtowhennomisleadinginformationisprovided.
| SelectNeurons. |     | Byselectingneurons, | theoutputsfromthe |     |     |     |     |     |
| -------------- | --- | ------------------- | ----------------- | --- | --- | --- | --- | --- |
435
selectedneuronsofeachlayeratthefinalgenerationstepare
436
|                  |     |                           |             |           | Baselines | LLC(13) LLC(7) | LLI3 Vicuna | Alpaca |
| ---------------- | --- | ------------------------- | ----------- | --------- | --------- | -------------- | ----------- | ------ |
| 437 concatenated |     | to detect hallucinations. | The results | show that |           |                |             |        |
438 theSNtrickimprovestheAUROCformostLLMs,indicating Avg(−logp) 0.4731 0.4175 0.4256 0.4740 0.4591
theeffectivenessofneuronselection. Byharnessingthecom- Avg(H) 0.4675 0.4110 0.4093 0.4732 0.4612
439
plementaryinformationacrosslayersofLLMs,moreprecise Max(−logp) 0.4538 0.3966 0.3915 0.4297 0.4227
440
hallucinationdetectionisachieved. However,theVicuna-7B Max(H) 0.4381 0.4017 0.3736 0.4384 0.4439
441
442 showsadecreaseinperformancewiththeSNtrick,suggest- MHAD-AO 0.6552 0.5369 0.4561 0.5701 0.5375
443 ingthatitslayersmayprovideamoreuniformhallucination MHAD-FO 0.6169 0.5040 0.3948 0.6008 0.5120
| awareness. |     |     |     |     | MHAD-LO | 0.6448 0.5276 | 0.4670 0.5690 | 0.5377 |
| ---------- | --- | --- | --- | --- | ------- | ------------- | ------------- | ------ |
444
| Select | Layers. | When SL trick | is incorporated | on the ba- |     |     |     |     |
| ------ | ------- | ------------- | --------------- | ---------- | --- | --- | --- | --- |
445
446 sis of SN, the outputs from the selected neurons of the se- Table5:Robustnessstudyresults.
| 447 lected            | layers | at the final generation          | step are | concatenated to |                                      |     |     |     |
| --------------------- | ------ | -------------------------------- | -------- | --------------- | ------------------------------------ | --- | --- | --- |
| detecthallucinations. |        | TheSLtrickfurtherenhancestheper- |          |                 |                                      |     |     |     |
| 448                   |        |                                  |          |                 | 4.4 RobustnessStudyAgainstMisleading |     |     |     |
formance by mitigating the interference from the layers that 468
449
demonstrateweakawarenessofhallucinations. However,the Information 469
450
451 LLaMA2-Chat-7B demonstrates a decrease in performance Retrieval Augmented Generation (RAG) enables LLMs to 470
452 withtheSLtrick. Webelievethisasheuristicrulesmayfall assess external knowledge sources, but the quality of these 471
intolocaloptima,butweneedtonotethatthecomplexityof sourcessignificantlyaffectstheperformanceofLLMs. Mis-
453 472
exhaustivesearchisO(2L),whereListhenumberoflayers leadinginformationcanincreasethelikelihoodofLLMsgen-
454 473
inLLMs,makingitimpractical. erating hallucinations [Pan et al., 2023; Xu et al., 2024].
455 474
456 ConcatenateGenerationSteps. Throughfurtherleveraging WeexaminetherobustnessofMHADandbaselinemethods 475
the CGS trick, the outputs from the selected neurons of se- whenLLMsarepresentedwithmisleadinginformation. 476
457
lectedlayersattheinitialandfinalgenerationstepsarecon- Specifically, wefirsthavegpt-3.5-turbogeneratemislead-
458 477
catenated to detect hallucinations. The CGS trick generally inginformationforeachquestioninthetestsetofSOQHD.
459 478
yields the highest AUROC, suggesting that the internal rep- Then,weinputboththemisleadinginformationandtheques-
460 479
461 resentationattheinitialgenerationstepcanprovidecomple- tionintoLLMstoobtaintheirresponses. 480
mentaryinformation.Webelievethisissimilartotherethink- Tbale 5 presents the robustness study results. The likeli-
462 481
ingprocesshumansengageinduringproblem-solving. How- hoodofLLMsgeneratinghallucinationsincreaseswithmis-
463 482
ever, Alpaca-7B exhibits a decline in performance with the leadinginformation,asshowninTable4. However,MHAD
464 483
CGS trick, possibly attributed to the significant gap in per- maintains remarkable performance, demonstrating robust-
465 484
466 formance among the top-performing layers at the initial and nessagainstmisleadinginformation.Interestingly,LLaMA3- 485
467 finalgenerationsteps,asshowninFigure2. Instruction-8Bismoresusceptibletomisleadinginformation, 486

motivateideaofSelfCheckGPTisthatwhenLLMsareuncer-
|     | Baselines   |     | LLC(13) | LLC(7) | LLI3  | Vicuna  | Alpaca |       |                                           |                |            |           |               |                 |           | 534       |
| --- | ----------- | --- | ------- | ------ | ----- | ------- | ------ | ----- | ----------------------------------------- | -------------- | ---------- | --------- | ------------- | --------------- | --------- | --------- |
|     |             |     |         |        |       |         |        |       | tain about                                | a given        | concept,   | the       | sampled       | responses       | are       | likely    |
|     | HaluEval-HR |     | –       | 49.60  |       | – 60.34 |        | 6.68  |                                           |                |            |           |               |                 |           | 535       |
|     |             |     |         |        |       |         |        |       | tobedifferentandcontaininconsistentfacts. |                |            |           |               |                 |           | 536       |
|     | MHAD-AO     |     | 64.25   | 55.04  | 59.63 | 53.69   |        | 67.52 |                                           |                |            |           |               |                 |           |           |
|     |             |     |         |        |       |         |        |       | Uncertainty-based.                        |                | Manakul    |           | et al. [2023] |                 | proposed  | meth- 537 |
|     | MHAD-FO     |     | 68.23   | 50.43  | 59.10 | 50.79   |        | 73.25 |                                           |                |            |           |               |                 |           |           |
|     |             |     |         |        |       |         |        |       | ods to detect                             | hallucinations |            | based     | on            | the probability |           | or en-    |
|     | MHAD-LO     |     | 60.18   | 51.85  | 52.10 | 68.53   |        | 71.85 |                                           |                |            |           |               |                 |           | 538       |
|     |             |     |         |        |       |         |        |       | tropy of                                  | tokens         | in a given | response. |               | Factual         | responses | are       |
539
likelytocontaintokenswithhigherprobabilityandloweren-
540
Table6:PerformanceonHaluEval-QAdataset.
|     |     |     |     |     |     |     |     |     | tropy. Inspiredbyhumanfocusinfactualitychecking,Zhang   |     |     |     |     |     |     | 541 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     |     | etal.[2023]enhanceduncertainty-basedhallucinationdetec- |     |     |     |     |     |     | 542 |
tionwithstrongerfocus.
487 likely due to its strong instruction-following ability. In gen- 543
|     |     |     |     |     |     |     |     |     | Internal-representation-based. |     |     |     | AzariaandMitchell[2023] |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | ----------------------- | --- | --- | --- |
488 eral,largerLLMsarelessaffectedbymisleadinginformation. 544
|     |     |     |     |     |     |     |     |     | trained | an MLP | based | on the | single-layer | internal | represen- |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | ------ | ----- | ------ | ------------ | -------- | --------- | --- |
545
489 4.5 OtherResults tation of LLMs to predict the truthfulness of a sentence. Su 546
WealsoevaluateourproposedMHADontheexistingHaluE- etal.[2024]proposedatrainingframeworkthatleveragesthe 547
490
valdataset[Lietal.,2023a]. internal representation of LLMs for hallucination detection.
| 491 |     |     |     |     | TheHaluEvaldatasetincludes |     |     |     |         |            |          |     |       |          |             | 548 |
| --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | ------- | ---------- | -------- | --- | ----- | -------- | ----------- | --- |
|     |     |     |     |     |                            |     |     |     | Chen et | al. [2024] | explored | the | dense | semantic | information |     |
492 30,000 samples from HotpotQA [Yang et al., 2018], Open- 549
|     |                                                  |     |     |     |     |     |     |     | retained | within | LLMs’ | internal | representation |     | for hallucina- |     |
| --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | -------- | ------ | ----- | -------- | -------------- | --- | -------------- | --- |
|     | DialKG[Moonetal.,2019]andCNN/DailyMail[Seeetal., |     |     |     |     |     |     |     |          |        |       |          |                |     |                | 550 |
493 tion detection. Du et al. [2024] estimated the membership
|     | 2017]. | ChatGPTisusedtogeneratehallucinatedresponses. |     |     |     |     |     |     |     |     |     |     |     |     |     | 551 |
| --- | ------ | --------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
494
To maintain task format consistency, we focus on the forsamplesbasedonanembeddingfactorizationandtrained 552
495
|     |        |          |         |      |     |          |          |      | a binary | truthfulness | classifier   |       | on top. | However, | these   | are 553 |
| --- | ------ | -------- | ------- | ---- | --- | -------- | -------- | ---- | -------- | ------------ | ------------ | ----- | ------- | -------- | ------- | ------- |
| 496 | 10,000 | HotpotQA | samples | from | the | HaluEval | dataset. | Fol- |          |              |              |       |         |          |         |         |
|     |        |          |         |      |     |          |          |      | limited  | by their     | single-layer | focus | and     | do not   | harness | com-    |
497 lowing the setting of [Li et al., 2023a] and the proxy model 554
plementaryinformationacrosslayersandgenerationsteps.
|     | strategyproposedby[Manakuletal.,2023],weconcatenatea |     |     |     |     |     |     |     |                                          |     |     |     |     |     |          | 555 |
| --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------- | --- | --- | --- | --- | --- | -------- | --- |
| 498 |                                                      |     |     |     |     |     |     |     | AmoreextensivediscussionisintheAppendix. |     |     |     |     |     | Notethat |     |
|     | questionwiththeanswerrandomlyselectedfromnormaland   |     |     |     |     |     |     |     |                                          |     |     |     |     |     |          | 556 |
499
hallucinatedanswers,andtheninputthemintoLLMs.Thein- theproblemwestudydiffersfromtheresearchonhallucina- 557
500
|     |     |     |     |     |     |     |     |     | tionmitigation[Lietal.,2023b;Chuangetal.,2024],which |     |     |     |     |     |     | 558 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
501 ternalrepresentationsduringprocessingtheanswerarestored
aimstoenhancethetruthfulnessofLLMs’decodingprocess.
| 502 | forutilizationbyMHAD.TheevaluationmetricisAccuracy |         |          |         |         |          |     |           |                                      |     |     |     |     |     |     | 559 |
| --- | -------------------------------------------------- | ------- | -------- | ------- | ------- | -------- | --- | --------- | ------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
|     | (ACC),                                             | aligned | with [Li | et al., | 2023a]. | Although |     | the proxy |                                      |     |     |     |     |     |     |     |
| 503 |                                                    |         |          |         |         |          |     |           | 5.2 HallucinationDetectionBenchmarks |     |     |     |     |     |     | 560 |
modelstrategycanadapttheHaluEval-QAdatasettoourpro-
| 504 |                                                      |     |     |     |     |     |     |     | Hallucinationdetectionbenchmarksareutilizedtoassessthe |     |     |     |     |     |     |     |
| --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
|     | posedmethod,itmaynotfullydemonstratetheeffectiveness |     |     |     |     |     |     |     |                                                        |     |     |     |     |     |     | 561 |
505
[Bengio et al., effectiveness of hallucination detection methods. For in- 562
| 506 | of MHAD | due     | to the | exposure | bias        |         |     | 2015;    |         |         |        |        |           |                 |     |         |
| --- | ------- | ------- | ------ | -------- | ----------- | ------- | --- | -------- | ------- | ------- | ------ | ------ | --------- | --------------- | --- | ------- |
|     |         |         |        |          |             |         |     |          | stance, | Manakul | et al. | [2023] | developed | a hallucination |     | de- 563 |
| 507 | Ranzato | et al., | 2016]  | and the  | discrepancy | between |     | the syn- |         |         |        |        |           |                 |     |         |
tectiondatasetbygeneratingsyntheticwikipediaarticleswith
|     | thetichallucinationsandthegenuinehallucinationsgenerated |     |     |     |     |     |     |     |        |          |           |             |     |     |        | 564     |
| --- | -------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ------ | -------- | --------- | ----------- | --- | --- | ------ | ------- |
| 508 |                                                          |     |     |     |     |     |     |     | GPT-3, | followed | by manual | annotation. |     | Li  | et al. | [2023a] |
|     | byLLMitself[Manakuletal.,2023;Zhangetal.,2024].          |     |     |     |     |     |     |     |        |          |           |             |     |     |        | 565     |
509 constructed a challenging dataset of generated and human-
Table 6 presents the results of evaluating the hallucina- 566
510 annotated hallucinated samples to evaluate the capability of
tion detection classifier, which is trained on the training set 567
511
|     |              |     |              |            |         |           |         |           | LLMstorecognizehallucination.AzariaandMitchell[2023]    |        |             |      |       |     |               | 568 |
| --- | ------------ | --- | ------------ | ---------- | ------- | --------- | ------- | --------- | ------------------------------------------------------- | ------ | ----------- | ---- | ----- | --- | ------------- | --- |
| 512 | of SOQHD,    |     | using 10,000 | unseen     | samples |           | from    | HaluEval- |                                                         |        |             |      |       |     |               |     |
|     |              |     |              |            |         |           |         |           | introducedtheTrue-Falsedatasetoftrueandfalsestatements. |        |             |      |       |     |               | 569 |
| 513 | QA. Baseline |     | results are  | referenced | from    | [Li       | et al., | 2023a].   |                                                         |        |             |      |       |     |               |     |
|     |              |     |              |            |         |           |         |           | Su et al.                                               | [2024] | constructed | HELM | based | on  | the wikipedia |     |
|     | The baseline |     | method       | prompts    | LLMs    | to assess | whether | the       |                                                         |        |             |      |       |     |               | 570 |
514 articles generation task. Although Chen et al. [2024] and
answer randomly selected from normal and hallucinated an- 571
| 515 |                 |     |                                       |     |     |     |     |     | Duetal.[2024]proposedinternal-representation-basedmeth- |     |     |     |     |     |     |     |
| --- | --------------- | --- | ------------------------------------- | --- | --- | --- | --- | --- | ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
|     | swersisfactual. |     | Althoughtheflawsoftheproxymodelstrat- |     |     |     |     |     |                                                         |     |     |     |     |     |     | 572 |
516
|     |           |     |             |        |                 |      |         |            | ods, they      | neither | open-sourced |             | their utilized |       | representations | 573     |
| --- | --------- | --- | ----------- | ------ | --------------- | ---- | ------- | ---------- | -------------- | ------- | ------------ | ----------- | -------------- | ----- | --------------- | ------- |
| 517 | egy limit | the | performance | of     | the classifier, |      | MHAD    | still out- |                |         |              |             |                |       |                 |         |
|     |           |     |             |        |                 |      |         |            | nor considered |         | the temporal | consistency |                | of    | data. Friel     | and 574 |
| 518 | performs  | the | baseline    | across | all LLMs.       | This | further | high-      |                |         |              |             |                |       |                 |         |
|     |           |     |             |        |                 |      |         |            | Sanyal [2023]  |         | concentrated | on          | QA tasks,      | using | ChatGPT         | to      |
lights MHAD’s effectiveness and generalization, suggesting 575
519 generate responses and assigning them hallucination labels.
|     | thatreal-generationprocessesbetterreflectitssuperiority. |     |     |     |     |     |     |     |          |      |           |      |          |     |           | 576  |
| --- | -------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | -------- | ---- | --------- | ---- | -------- | --- | --------- | ---- |
| 520 |                                                          |     |     |     |     |     |     |     | However, | this | benchmark | only | provides | the | responses | gen- |
577
|     |     |     |     |     |     |     |     |     | erated by | a single | LLM, | which | cannot | evaluate | the internal- | 578 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | -------- | ---- | ----- | ------ | -------- | ------------- | --- |
5 RelatedWork
| 521 |                            |     |     |     |     |     |     |     | representation-basedmethodsacrossmultipleLLMs. |     |     |     |     |     |     | 579 |
| --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
|     | 5.1 HallucinationDetection |     |     |     |     |     |     |     |                                                |     |     |     |     |     |     |     |
522
6 Conclusions
|     | HallucinationdetectioninLLMshasgarneredsignificantat- |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 580 |
| --- | ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
523
tention due to the increasing reliance on LLMs in various Inthispaper,weintroduceMHAD,anovelhallucinationde-
| 524 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 581 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
applications. Existing hallucination detection methods for tection method. MHAD leverages the internal representa-
| 525 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 582 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
LLMscanbebroadlyclassifiedintofourcategories. tions across layers during the generation progress of LLMs
| 526 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 583 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
527 Retrieval-based. Lietal.[2023a]proposedanapproachthat to detect hallucination. Moreover, we propose SOQHD, a 584
promptsanLLMtoevaluatewhethertheresponsesgenerated novel hallucination detection benchmark for ODQA, which
| 528 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 585 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
byotherLLMscontradictobjectivefacts, wheretheLLMis provides the internal representations of LLMs and ensures
| 529 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 586 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
employedasanexternalknowledgesource. temporal consistency. Experimental results demonstrate the
| 530 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 587 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Sampling-based. Manakul et al. [2023] proposed Self- effectivenessandgeneralizationofMHAD.Weaspireforour
| 531 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 588 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
532 CheckGPT, a method to assess information consistency work to contribute to the field of LLM research, enhancing 589
533 amongmultiplesampledresponsesfromthesameLLM.The thereliabilityofLLMsinreal-worldapplications. 590

References [Huangetal.,2023] Lei Huang, Weijiang Yu, Weitao Ma,
| 591 |                       |     |     |                             |     |     |     |         |        |          |       |         |       |        | 644 |
| --- | --------------------- | --- | --- | --------------------------- | --- | --- | --- | ------- | ------ | -------- | ----- | ------- | ----- | ------ | --- |
|     |                       |     |     |                             |     |     |     | Weihong | Zhong, | Zhangyin | Feng, | Haotian | Wang, | Qiang- |     |
|     | [AlainandBengio,2017] |     |     | GuillaumeAlainandYoshuaBen- |     |     |     |         |        |          |       |         |       |        | 645 |
592
|     |                    |                        |              |     |        |              |       | longChen,WeihuaPeng,XiaochengFeng,BingQin,etal. |     |             |     |          |            |       | 646 |
| --- | ------------------ | ---------------------- | ------------ | --- | ------ | ------------ | ----- | ----------------------------------------------- | --- | ----------- | --- | -------- | ---------- | ----- | --- |
| 593 | gio. Understanding |                        | intermediate |     | layers | using linear | clas- |                                                 |     |             |     |          |            |       |     |
|     |                    |                        |              |     |        |              |       | Asurveyonhallucinationinlargelanguagemodels:    |     |             |     |          |            | Prin- | 647 |
| 594 | sifierprobes.      | InICLR(Workshop),2017. |              |     |        |              |       |                                                 |     |             |     |          |            |       |     |
|     |                    |                        |              |     |        |              |       | ciples, taxonomy,                               |     | challenges, |     | and open | questions. | ACM   |     |
648
[AzariaandMitchell,2023] AmosAzariaandTomMitchell. TransactionsonInformationSystems,2023.
| 595 |                       |       |       |     |            |             |     |                                                     |     |     |         |         |     |         | 649 |
| --- | --------------------- | ----- | ----- | --- | ---------- | ----------- | --- | --------------------------------------------------- | --- | --- | ------- | ------- | --- | ------- | --- |
|     | The internal          | state | of an | LLM | knows when | it’s lying. | In  |                                                     |     |     |         |         |     |         |     |
| 596 |                       |       |       |     |            |             |     | [IzacardandGrave,2021]                              |     |     | Gautier | Izacard | and | Edouard |     |
|     | FindingsofEMNLP,2023. |       |       |     |            |             |     |                                                     |     |     |         |         |     |         | 650 |
| 597 |                       |       |       |     |            |             |     | Grave. Leveragingpassageretrievalwithgenerativemod- |     |     |         |         |     |         |     |
651
|     | [Bangetal.,2023] |     |     |     |     |     |     |     |     |     |     |     | InEACL,2021. |     |     |
| --- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- |
598 Yejin Bang, Samuel Cahyawijaya, elsforopendomainquestionanswering. 652
599 Nayeon Lee, Wenliang Dai, Dan Su, Bryan Wilie, Holy [Jawaharetal.,2019] Ganesh Jawahar, Benoˆıt Sagot, and
653
|     | Lovenia,         | Ziwei   | Ji, Tiezheng |       | Yu, Willy    | Chung, Quyet  | V.  |                 |     |             |           |       |       |            |     |
| --- | ---------------- | ------- | ------------ | ----- | ------------ | ------------- | --- | --------------- | --- | ----------- | --------- | ----- | ----- | ---------- | --- |
| 600 |                  |         |              |       |              |               |     | Djame´ Seddah.  |     | What        | does BERT | learn | about | the struc- | 654 |
|     | Do, Yan          | Xu, and | Pascale      | Fung. | A multitask, | multilin-     |     |                 |     |             |           |       |       |            |     |
| 601 |                  |         |              |       |              |               |     | tureoflanguage? |     | InACL,2019. |           |       |       |            |     |
|     | gual, multimodal |         | evaluation   |       | of ChatGPT   | on reasoning, |     |                 |     |             |           |       |       |            | 655 |
602
InIJCNLP,2023. [Jietal.,2023] Ziwei Ji, Nayeon Lee, Rita Frieske, 656
603 hallucination,andinteractivity.
|     |     |     |     |     |     |     |     | Tiezheng | Yu, Dan | Su, | Yan Xu, | Etsuko | Ishii, Yejin | Bang, |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------- | --- | ------- | ------ | ------------ | ----- | --- |
657
604 [Bengioetal.,2015] Samy Bengio, Oriol Vinyals, Navdeep AndreaMadotto, andPascaleFung. Surveyofhallucina-
658
605 Jaitly, and Noam Shazeer. Scheduled sampling for se- tioninnaturallanguagegeneration. ACMComput.Surv.,
659
|     | quence | prediction | with | recurrent | neural | networks. | In  |       |     |     |     |     |     |     |     |
| --- | ------ | ---------- | ---- | --------- | ------ | --------- | --- | ----- | --- | --- | --- | --- | --- | --- | --- |
| 606 |        |            |      |           |        |           |     | 2023. |     |     |     |     |     |     | 660 |
NeurIPS,2015.
| 607 |                   |     |        |        |         |         |        | [Joshietal.,2017] |     |                                    |     |     |     |     |     |
| --- | ----------------- | --- | ------ | ------ | ------- | ------- | ------ | ----------------- | --- | ---------------------------------- | --- | --- | --- | --- | --- |
|     |                   |     |        |        |         |         |        |                   |     | MandarJoshi,EunsolChoi,DanielWeld, |     |     |     |     | 661 |
|     | [Burnsetal.,2023] |     | Collin | Burns, | Haotian | Ye, Dan | Klein, |                   |     |                                    |     |     |     |     |     |
608 and Luke Zettlemoyer. TriviaQA: A large scale distantly 662
609 and Jacob Steinhardt. Discovering latent knowledge in supervised challenge dataset for reading comprehension.
663
610 languagemodelswithoutsupervision. InICLR,2023. InACL,2017.
664
[Chenetal.,2017] DanqiChen,AdamFisch,JasonWeston, [Kwiatkowskietal.,2019] Tom Kwiatkowski, Jennimaria
| 611 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 665 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
andAntoineBordes. ReadingWikipediatoansweropen- Palomaki,OliviaRedfield,MichaelCollins,AnkurParikh,
| 612 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 666 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
domainquestions. InACL,2017. Chris Alberti, Danielle Epstein, Illia Polosukhin, Jacob
| 613 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 667 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
[Chenetal.,2024] Devlin, Kenton Lee, Kristina Toutanova, Llion Jones, 668
| 614 |     |     | Chao | Chen, | Kai Liu, | Ze Chen, | Yi Gu, |     |     |     |     |     |     |     |     |
| --- | --- | --- | ---- | ----- | -------- | -------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
MatthewKelcey,Ming-WeiChang,AndrewM.Dai,Jakob
| 615 | YueWu,MingyuanTao,ZhihangFu,andJiepingYe. |     |     |     |     |     | IN- |     |     |     |     |     |     |     | 669 |
| --- | ----------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Uszkoreit,QuocLe,andSlavPetrov.Naturalquestions:A
SIDE: llms’ internal states retain the power of hallucina- 670
| 616 |                |     |              |     |     |     |     | benchmarkforquestionansweringresearch. |     |     |     |     | TACL,2019. |     |     |
| --- | -------------- | --- | ------------ | --- | --- | --- | --- | -------------------------------------- | --- | --- | --- | --- | ---------- | --- | --- |
|     | tiondetection. |     | InICLR,2024. |     |     |     |     |                                        |     |     |     |     |            |     | 671 |
617
|     |                                                  |     |                                |     |     |     |     | [Lewisetal.,2020] |     | PatrickS.H.Lewis,EthanPerez,Alek- |     |          |            |     |     |
| --- | ------------------------------------------------ | --- | ------------------------------ | --- | --- | --- | --- | ----------------- | --- | --------------------------------- | --- | -------- | ---------- | --- | --- |
|     | [Chiangetal.,2023]                               |     | WLChiang,ZLi,ZLin,etal.Vicuna: |     |     |     |     |                   |     |                                   |     |          |            |     | 672 |
| 618 |                                                  |     |                                |     |     |     |     | sandra Piktus,    |     | Fabio Petroni,                    |     | Vladimir | Karpukhin, | Na- |     |
|     | Anopen-sourcechatbotimpressinggpt-4with90%*chat- |     |                                |     |     |     |     |                   |     |                                   |     |          |            |     | 673 |
619
|     |              |     |                 |     |        |               |     | man Goyal,        | Heinrich | Ku¨ttler, |     | Mike Lewis, | Wen-tau   | Yih,   | 674 |
| --- | ------------ | --- | --------------- | --- | ------ | ------------- | --- | ----------------- | -------- | --------- | --- | ----------- | --------- | ------ | --- |
| 620 | gpt quality. | See | https://vicuna. |     | lmsys. | org (accessed | 14  |                   |          |           |     |             |           |        |     |
|     |              |     |                 |     |        |               |     | Tim Rockta¨schel, |          | Sebastian |     | Riedel,     | and Douwe | Kiela. | 675 |
621 April2023),2(3):6,2023.
|     |     |     |     |     |     |     |     | Retrieval-augmented |     | generation |     | for knowledge-intensive |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | ---------- | --- | ----------------------- | --- | --- | --- |
676
[Chuangetal.,2024] Yung-Sung Chuang, Yujia Xie, NLPtasks. InNeurIPS,2020.
| 622 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 677 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
HongyinLuo,YoonKim,JamesR.Glass,andPengcheng
| 623 |           |          |     |     |             |                 |     | [Lietal.,2023a]                                  |     | Junyi Li, | Xiaoxue | Cheng, | Xin | Zhao, Jian- |     |
| --- | --------- | -------- | --- | --- | ----------- | --------------- | --- | ------------------------------------------------ | --- | --------- | ------- | ------ | --- | ----------- | --- |
|     | He. Dola: | Decoding |     | by  | contrasting | layers improves |     |                                                  |     |           |         |        |     |             | 678 |
| 624 |           |          |     |     |             |                 |     | YunNie,andJi-RongWen.HaluEval:Alarge-scalehallu- |     |           |         |        |     |             |     |
679
| 625 | factualityinlargelanguagemodels. |     |     |     | InICLR,2024. |     |     |                                                    |     |     |     |     |     |     |     |
| --- | -------------------------------- | --- | --- | --- | ------------ | --- | --- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
|     |                                  |     |     |     |              |     |     | cinationevaluationbenchmarkforlargelanguagemodels. |     |     |     |     |     |     | 680 |
626 [Duetal.,2024] Xuefeng Du, Chaowei Xiao, and Yixuan InEMNLP,2023. 681
|     | Li. Haloscope:          |     | Harnessingunlabeledllmgenerationsfor |                 |     |     |     |                 |           |          |     |            |             |     |        |
| --- | ----------------------- | --- | ------------------------------------ | --------------- | --- | --- | --- | --------------- | --------- | -------- | --- | ---------- | ----------- | --- | ------ |
| 627 |                         |     |                                      |                 |     |     |     | [Lietal.,2023b] |           | Kenneth  | Li, | Oam Patel, | Fernanda    |     | B. 682 |
|     | hallucinationdetection. |     |                                      | InNeurIPS,2024. |     |     |     |                 |           |          |     |            |             |     |        |
| 628 |                         |     |                                      |                 |     |     |     | Vie´gas,        | Hanspeter | Pfister, |     | and Martin | Wattenberg. |     | 683    |
[FrielandSanyal,2023] Robert Friel and Atindriyo Sanyal. Inference-time intervention: Eliciting truthful answers
| 629 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 684 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Chainpoll: A high efficacy method for llm hallucination fromalanguagemodel. InNeurIPS,2023.
| 630 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 685 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
631 detection. arXivpreprintarXiv:2310.18344,2023. [Manakuletal.,2023] Potsawee Manakul, Adian Liusie,
686
|     |                 |     |        |      |        |           |       | andMarkGales. |     | SelfCheckGPT:Zero-resourceblack-box |     |     |     |     |     |
| --- | --------------- | --- | ------ | ---- | ------ | --------- | ----- | ------------- | --- | ----------------------------------- | --- | --- | --- | --- | --- |
| 632 | [Guuetal.,2020] |     | Kelvin | Guu, | Kenton | Lee, Zora | Tung, |               |     |                                     |     |     |     |     | 687 |
Panupong Pasupat, and Mingwei Chang. Retrieval aug- hallucinationdetectionforgenerativelargelanguagemod- 688
633
mentedlanguagemodelpre-training. InICML,2020. els. InEMNLP,2023. 689
634
[Hanetal.,2016] Song Han, Huizi Mao, and William J. [Meta,2024] AIMeta. Introducingmetallama3: Themost 690
635
|     |     |     |     |     |     |     |     | capableopenlyavailablellmtodate. |     |     |     | MetaAI.,2024. |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------------------- | --- | --- | --- | ------------- | --- | --- | --- |
636 Dally. Deep compression: Compressing deep neural net- 691
637 workwithpruning,trainedquantizationandhuffmancod- [Minetal.,2023] SewonMin,KalpeshKrishna,XinxiLyu,
692
ing. InICLR,2016. Mike Lewis, Wen-tau Yih, Pang Wei Koh, Mohit Iyyer,
| 638 |                                              |     |         |     |               |         |     |                                                      |     |     |          |             |     |            | 693 |
| --- | -------------------------------------------- | --- | ------- | --- | ------------- | ------- | --- | ---------------------------------------------------- | --- | --- | -------- | ----------- | --- | ---------- | --- |
|     |                                              |     |         |     |               |         |     | Luke Zettlemoyer,                                    |     | and | Hannaneh | Hajishirzi. |     | FActScore: |     |
|     | [Hedderichetal.,2024]                        |     | Michael |     | A. Hedderich, | Natalie | N.  |                                                      |     |     |          |             |     |            | 694 |
| 639 |                                              |     |         |     |               |         |     | Fine-grainedatomicevaluationoffactualprecisioninlong |     |     |          |             |     |            |     |
|     | Bazarova,WentingZou,RyunShim,XindaMa,andQian |     |         |     |               |         |     |                                                      |     |     |          |             |     |            | 695 |
640
Yang. A piece of theatre: Investigating how teachers de- formtextgeneration. InEMNLP,2023. 696
641
[Moonetal.,2019]
642 signLLMchatbotstoassistadolescentcyberbullyingedu- Seungwhan Moon, Pararth Shah, Anuj 697
643 cation. InCHI,2024. Kumar, and Rajen Subba. OpenDialKG: Explainable 698

conversational reasoning with attention-based walks over [Wangetal.,2022] Xiaozhi Wang, Kaiyue Wen, Zhengyan
| 699 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 754 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
knowledgegraphs. InACL,2019. Zhang,LeiHou,ZhiyuanLiu,andJuanziLi. Findingskill
| 700 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 755 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
[Mu¨ndleretal.,2024] Niels Mu¨ndler, Jingxuan He, Slobo- neurons in pre-trained transformer-based language mod- 756
701
|     |     |     |     |     |     |     |     |     |     | els. InEMNLP,2022. |     |     |     |     |     | 757 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------ | --- | --- | --- | --- | --- | --- |
702 danJenko,andMartinT.Vechev.Self-contradictoryhallu-
703 cinationsoflargelanguagemodels: Evaluation,detection [Wangetal.,2023] Xuezhi Wang, Jason Wei, Dale Schuur- 758
andmitigation. InICLR,2024. mans,QuocV.Le,EdH.Chi,SharanNarang,Aakanksha
| 704 |                                         |     |     |                                   |     |     |     |     |       |                                          |     |     |                          |     |         | 759 |
| --- | --------------------------------------- | --- | --- | --------------------------------- | --- | --- | --- | --- | ----- | ---------------------------------------- | --- | --- | ------------------------ | --- | ------- | --- |
|     |                                         |     |     |                                   |     |     |     |     |       | Chowdhery,andDennyZhou.                  |     |     | Self-consistencyimproves |     |         |     |
| 705 | [Panetal.,2023]                         |     |     | YikangPan,LiangmingPan,WenhuChen, |     |     |     |     |       |                                          |     |     |                          |     |         | 760 |
|     |                                         |     |     |                                   |     |     |     |     |       | chainofthoughtreasoninginlanguagemodels. |     |     |                          |     | InICLR, |     |
|     | PreslavNakov,Min-YenKan,andWilliamWang. |     |     |                                   |     |     |     |     | Onthe |                                          |     |     |                          |     |         | 761 |
706
|     | riskofmisinformationpollutionwithlargelanguagemod- |     |     |     |     |     |     |     |     | 2023. |     |     |     |     |     | 762 |
| --- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- |
707
|     | els. | InFindingsofEMNLP,2023. |     |     |     |     |     |     |     | [Wangetal.,2024] |     |                                |     |     |     |     |
| --- | ---- | ----------------------- | --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ------------------------------ | --- | --- | --- | --- |
| 708 |      |                         |     |     |     |     |     |     |     |                  |     | XuWang,ChengLi,YiChang,Jindong |     |     |     | 763 |
[Parketal.,2024] Kiho Park, Yo Joong Choe, and Victor Wang, and Yuan Wu. Negativeprompt: Leveraging psy- 764
709
Veitch. The linear representation hypothesis and the ge- chologyforlargelanguagemodelsenhancementvianega-
| 710 |                              |     |     |     |     |              |     |     |     |                       |     |               |     |     |     | 765 |
| --- | ---------------------------- | --- | --- | --- | --- | ------------ | --- | --- | --- | --------------------- | --- | ------------- | --- | --- | --- | --- |
|     |                              |     |     |     |     |              |     |     |     | tiveemotionalstimuli. |     | InIJCAI,2024. |     |     |     |     |
| 711 | ometryoflargelanguagemodels. |     |     |     |     | InICML,2024. |     |     |     |                       |     |               |     |     |     | 766 |
[Ranzatoetal.,2016] [Wuetal.,2023] Shijie Wu, Ozan Irsoy, Steven Lu, Vadim
| 712 |                                      |     |       | Marc’AurelioRanzato,SumitChopra, |     |          |              |     |       |                  |      |         |            |           |        | 767   |
| --- | ------------------------------------ | --- | ----- | -------------------------------- | --- | -------- | ------------ | --- | ----- | ---------------- | ---- | ------- | ---------- | --------- | ------ | ----- |
|     |                                      |     |       |                                  |     |          |              |     |       | Dabravolski,     | Mark | Dredze, | Sebastian  | Gehrmann, |        | Prab- |
| 713 | Michael                              |     | Auli, | and Wojciech                     |     | Zaremba. | Sequence     |     | level |                  |      |         |            |           |        | 768   |
|     |                                      |     |       |                                  |     |          |              |     |       | hanjan Kambadur, |      | David   | Rosenberg, | and       | Gideon | Mann. |
|     | trainingwithrecurrentneuralnetworks. |     |       |                                  |     |          | InICLR,2016. |     |       |                  |      |         |            |           |        | 769   |
714
|     |                    |     |     |        |         |       |          |     |       | Bloomberggpt: | Alargelanguagemodelforfinance. |     |     |     |     | arXiv 770 |
| --- | ------------------ | --- | --- | ------ | ------- | ----- | -------- | --- | ----- | ------------- | ------------------------------ | --- | --- | --- | --- | --------- |
| 715 | [Sajjadetal.,2022] |     |     | Hassan | Sajjad, | Nadir | Durrani, |     | Fahim |               |                                |     |     |     |     |           |
preprintarXiv:2303.17564,2023.
|     | Dalvi, | Firoj | Alam, | Abdul | Khan, | and | Jia | Xu. | Analyz- |     |     |     |     |     |     | 771 |
| --- | ------ | ----- | ----- | ----- | ----- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
716
ingencodedconceptsintransformerlanguagemodels. In [Xuetal.,2024] Rongwu Xu, Zehan Qi, Zhijiang Guo, 772
717
|     | NAACL-HLT,2022.                                 |     |     |                |                        |               |     |          |          | CunxiangWang,HongruWang,YueZhang,andWeiXu. |           |              |       |              |           |        |
| --- | ----------------------------------------------- | --- | --- | -------------- | ---------------------- | ------------- | --- | -------- | -------- | ------------------------------------------ | --------- | ------------ | ----- | ------------ | --------- | ------ |
| 718 |                                                 |     |     |                |                        |               |     |          |          |                                            |           |              |       |              |           | 773    |
|     |                                                 |     |     |                |                        |               |     |          |          | Knowledge                                  | conflicts | for          | LLMs: | A survey.    | In EMNLP, |        |
|     | [Schulman,2023]                                 |     |     | John Schulman. |                        | Reinforcement |     |          | learning |                                            |           |              |       |              |           | 774    |
| 719 |                                                 |     |     |                |                        |               |     |          |          | 2024.                                      |           |              |       |              |           |        |
|     |                                                 |     |     |                |                        |               |     | InBerke- |          |                                            |           |              |       |              |           | 775    |
| 720 | fromhumanfeedback:                              |     |     |                | Progressandchallenges. |               |     |          |          |                                            |           |              |       |              |           |        |
|     |                                                 |     |     |                |                        |               |     |          |          | [Yangetal.,2018]                           |           | Zhilin Yang, | Peng  | Qi, Saizheng |           | Zhang, |
| 721 | leyEECSColloquium.YouTubewww.youtube.com/watch, |     |     |                |                        |               |     |          |          |                                            |           |              |       |              |           | 776    |
2023. Yoshua Bengio, William Cohen, Ruslan Salakhutdinov, 777
722
|     |                            |     |          |         |             |        |               |     |          | and Christopher |             | D. Manning. |     | HotpotQA: | A dataset  | for 778 |
| --- | -------------------------- | --- | -------- | ------- | ----------- | ------ | ------------- | --- | -------- | --------------- | ----------- | ----------- | --- | --------- | ---------- | ------- |
| 723 | [Seeetal.,2017]            |     |          | Abigail | See,        | Peter  | J. Liu,       | and | Christo- |                 |             |             |     |           |            |         |
|     |                            |     |          |         |             |        |               |     |          | diverse,        | explainable | multi-hop   |     | question  | answering. | In      |
|     | pher                       | D.  | Manning. | Get     | to the      | point: | Summarization |     | with     |                 |             |             |     |           |            | 779     |
| 724 |                            |     |          |         |             |        |               |     |          | EMNLP,2018.     |             |             |     |           |            |         |
|     | pointer-generatornetworks. |     |          |         | InACL,2017. |        |               |     |          |                 |             |             |     |           |            | 780     |
725
|     |                  |       |     |         |         |       |          |          |     | [Zhangetal.,2023] |     | TianhangZhang,LinQiu,QipengGuo, |       |        |         |       |
| --- | ---------------- | ----- | --- | ------- | ------- | ----- | -------- | -------- | --- | ----------------- | --- | ------------------------------- | ----- | ------ | ------- | ----- |
|     | [Shenetal.,2023] |       |     | Yiqiu   | Shen,   | Laura | Heacock, | Jonathan |     |                   |     |                                 |       |        |         | 781   |
| 726 |                  |       |     |         |         |       |          |          |     | Cheng Deng,       | Yue | Zhang,                          | Zheng | Zhang, | Chenghu | Zhou, |
|     | Elias,           | Keith | D   | Hentel, | Beatriu | Reig, | George   | Shih,    | and |                   |     |                                 |       |        |         | 782   |
727
LindaMoy. Chatgptandotherlargelanguagemodelsare Xinbing Wang, and Luoyi Fu. Enhancing uncertainty- 783
728
|     |     |     |     |     |     |     |     |     |     | based hallucination |     | detection | with | stronger | focus. | In 784 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --------- | ---- | -------- | ------ | ------ |
729 double-edgedswords,2023.
EMNLP,2023.
|     | [Suetal.,2024] |     |                                   |     |       |       |           |      |     |                   |        |        |           |               |         | 785     |
| --- | -------------- | --- | --------------------------------- | --- | ----- | ----- | --------- | ---- | --- | ----------------- | ------ | ------ | --------- | ------------- | ------- | ------- |
| 730 |                |     | WeihangSu,ChangyueWang,QingyaoAi, |     |       |       |           |      |     |                   |        |        |           |               |         |         |
|     |                |     |                                   |     |       |       |           |      |     | [Zhangetal.,2024] |        | Dongxu | Zhang,    | Varun         | Gangal, | Barrett |
| 731 | Yiran          | Hu, | Zhijing                           | Wu, | Yujia | Zhou, | and Yiqun | Liu. | Un- |                   |        |        |           |               |         | 786     |
|     |                |     |                                   |     |       |       |           |      |     | Lattimer,         | and Yi | Yang.  | Enhancing | hallucination |         | detec-  |
supervised real-time hallucination detection based on the 787
732 tion through perturbation-based synthetic data generation
|     | internal  |     | states of | large | language | models. |     | In Findings | of  |                    |     |                       |     |     |     | 788 |
| --- | --------- | --- | --------- | ----- | -------- | ------- | --- | ----------- | --- | ------------------ | --- | --------------------- | --- | --- | --- | --- |
| 733 |           |     |           |       |          |         |     |             |     |                    |     | InFindingsofACL,2024. |     |     |     |     |
|     | ACL,2024. |     |           |       |          |         |     |             |     | insystemresponses. |     |                       |     |     |     | 789 |
734
|     | [Taorietal.,2023] |     |     | Rohan | Taori, | Ishaan | Gulrajani, |     | Tianyi |     |     |     |     |     |     |     |
| --- | ----------------- | --- | --- | ----- | ------ | ------ | ---------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
735
Zhang,YannDubois,XuechenLi,CarlosGuestrin,Percy
736
| 737 | Liang, | and | Tatsunori | B   | Hashimoto. |     | Stanford | alpaca: | An  |     |     |     |     |     |     |     |
| --- | ------ | --- | --------- | --- | ---------- | --- | -------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
738 instruction-followingllamamodel,2023.
| 739 | [Thirunavukarasuetal.,2023] |     |     |        | Arun |      |       |     | James   |     |     |     |     |     |     |     |
| --- | --------------------------- | --- | --- | ------ | ---- | ---- | ----- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
|     | Thirunavukarasu,            |     |     | Darren | Shu  | Jeng | Ting, |     | Kabilan |     |     |     |     |     |     |     |
740
|     | Elangovan, |     | Laura | Gutierrez, |     | Ting Fang | Tan, | and | Daniel |     |     |     |     |     |     |     |
| --- | ---------- | --- | ----- | ---------- | --- | --------- | ---- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
741
|     | Shu | Wei | Ting. | Large | language |     | models | in medicine. |     |     |     |     |     |     |     |     |
| --- | --- | --- | ----- | ----- | -------- | --- | ------ | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
742
Naturemedicine,2023.
743
|     | [Touvronetal.,2023] |     |     | Hugo | Touvron, |     | Louis | Martin, | Kevin |     |     |     |     |     |     |     |
| --- | ------------------- | --- | --- | ---- | -------- | --- | ----- | ------- | ----- | --- | --- | --- | --- | --- | --- | --- |
744
| 745 | Stone,  | Peter    | Albert,    | Amjad  | Almahairi, |        | Yasmine         |           | Babaei, |     |     |     |     |     |     |     |
| --- | ------- | -------- | ---------- | ------ | ---------- | ------ | --------------- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- |
| 746 | Nikolay |          | Bashlykov, | Soumya |            | Batra, | Prajjwal        | Bhargava, |         |     |     |     |     |     |     |     |
|     | Shruti  | Bhosale, |            | et al. | Llama      | 2:     | Open foundation |           | and     |     |     |     |     |     |     |     |
747
|     | fine-tunedchatmodels. |     |     |     | arXivpreprintarXiv:2307.09288, |     |     |     |     |     |     |     |     |     |     |     |
| --- | --------------------- | --- | --- | --- | ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
748
2023.
749
|     | [Voitaetal.,2024] |     |     | Elena | Voita, | Javier | Ferrando, |     | and |     |     |     |     |     |     |     |
| --- | ----------------- | --- | --- | ----- | ------ | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
750
|     | Christoforos |     | Nalmpantis. |     |     | Neurons | in large | language |     |     |     |     |     |     |     |     |
| --- | ------------ | --- | ----------- | --- | --- | ------- | -------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
751
| 752 | models: |     | Dead, | n-gram, | positional. |     | In Findings |     | of ACL, |     |     |     |     |     |     |     |
| --- | ------- | --- | ----- | ------- | ----------- | --- | ----------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
753 2024.