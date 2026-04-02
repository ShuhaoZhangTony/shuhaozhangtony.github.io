736 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.38,NO.2,FEBRUARY2026
| A   | Framework |     |     |     | of    | Knowledge |       | Graph-Enhanced |        |          |     | Large |
| --- | --------- | --- | --- | --- | ----- | --------- | ----- | -------------- | ------ | -------- | --- | ----- |
|     | Language  |     |     |     | Model |           | Based | on             | Global | Planning |     |       |
YadingLi ,DandanSong ,YuhangTian ,HaoWang ,ChangzhiZhou ,andShuhaoZhang ,Member,IEEE
| Abstract—Knowledge |     |     | graphs | (KGs) | can | provide | structured |     |     |     |     |     |
| ------------------ | --- | --- | ------ | ----- | --- | ------- | ---------- | --- | --- | --- | --- | --- |
knowledgetoassistlargelanguagemodels(LLMs)ininterpretable
reasoning.Knowledgegraphquestionanswering(KGQA)isatyp-
icalbenchmarktoevaluateKG-enhancedLLMmethods.Previous
methodsofKG-enhancedLLMsforKGQAmainlyinclude:1)ori-
ginquestion-orientedmethods,whichperformKGretrievalbased
solelyontheoriginalquestionwithoutexplicitlyanalyzingmulti-
stepreasoninglogic;and2)stepwisereasoning-orientedmethods,
whichalternatebetweenLLMgeneratingthenextreasoningstep
| and targeted | KG               | retrieval | but            | lack  | systematic   | planning, | leading    |     |     |     |     |     |
| ------------ | ---------------- | --------- | -------------- | ----- | ------------ | --------- | ---------- | --- | --- | --- | --- | --- |
| to poor      | controllability. |           | To tackle      | these | limitations, |           | we propose |     |     |     |     |     |
| KELGoP,      | a framework      |           | of KG-enhanced |       |              | LLM based | on global  |     |     |     |     |     |
planning.Weproposefine-grainedquestioncategorizationbased
onreasoningpatternsandcorrespondingcategory-drivenquestion
decompositionforcomplexquestions,enablingmorecontrollable
reasoningandatomicKGretrievaltargetedtosub-questions.Fur-
thermore,weproposeanadaptivestrategythatallowsadjustingthe
reasoningpatternbasedontheperformanceofquestionanswering,
makingthereasoningmoreflexibleandrobust.Finally,weintro-
duceseveralefficientatomicKGretrievalstrategiesthatoperateon
KGsubgraphstoassisttheLLMinansweringatomic-levelques-
|     |     |     |     |     |     |     |     | Fig. 1. A | comparison diagram | of two existing | categories | of KG-enhanced |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------------ | --------------- | ---------- | -------------- |
tions.AseriesofexperimentsonKGQAdatasetsdemonstratethat
LLMreasoningmethodsforKGQA.
ourproposedframeworkachievessuperiorperformancecompared
toexistingbaselines.
IndexTerms—Knowledgegraph,largelanguagemodel,question
answering,globalplanning,fine-grainedcategorization. answering (KGQA) task involves answering natural language
questionsbasedonthestructureddatainKG.
InKG-enhancedLLMmethodsforKGQA,onecategoryof
I. INTRODUCTION intuitivemethodsisoriginquestion-orientedLLM-KGinterac-
tion,asshowninFig.1(a).Somemethods[5],[6],[7]perform
| ALTHOUGH |     | large | language | models |     | (LLMs) | possess out- |     |     |     |     |     |
| -------- | --- | ----- | -------- | ------ | --- | ------ | ------------ | --- | --- | --- | --- | --- |
standinglanguageunderstandingandgenerationcapabil- KG retrieval through a single round of LLM-KG interaction,
|            |      |              |      |        |      |     |                | where the | relevant KG facts | retrieved | are | input into the LLM |
| ---------- | ---- | ------------ | ---- | ------ | ---- | --- | -------------- | --------- | ----------------- | --------- | --- | ------------------ |
| ities [1], | they | still suffer | from | issues | such | as  | lack of inter- |           |                   |           |     |                    |
pretabilityandhallucination[2].Toaddresstheseissues,some to enhance its reasoning. Other methods [8], [9], [10] involve
studies attempt to enhance LLM reasoning with knowledge multiple rounds of LLM-KG interaction for KG retrieval. The
LLMstartsfromthetopicentityofthequestionandsearchesstep
| graphs | (KGs) | [3], [4]. | They | utilize | KGs | to explicitly | provide |     |     |     |     |     |
| ------ | ----- | --------- | ---- | ------- | --- | ------------- | ------- | --- | --- | --- | --- | --- |
accuratestructuredknowledgeinspecializeddomainstoassist by step for the next-hop entity or relation most relevant to the
question,continuinguntilthetraversedKGentitiesandrelations
| LLMs | in performing |     | interpretable |     | reasoning, | thus | mitigating |                |           |               |          |             |
| ---- | ------------- | --- | ------------- | --- | ---------- | ---- | ---------- | -------------- | --------- | ------------- | -------- | ----------- |
|      |               |     |               |     |            |      |            | are sufficient | to answer | the question. | However, | for complex |
hallucinations.Asanimportanttasktoevaluatetheeffectiveness
ofKG-enhancedLLMmethods,theknowledgegraphquestion questions that require multi-step reasoning, such methods rely
|     |     |     |     |     |     |     |     | solely on | the original complex | question | during | KG retrieval. |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | -------------------- | -------- | ------ | ------------- |
Theydonotexplicitlyanalyzethelogicofmulti-stepreasoning
Received26May2025;revised29October2025;accepted24November or clarify the specific sub-tasks involved in KG retrieval at
2025.Dateofpublication3December2025;dateofcurrentversion30December each sub-reasoning step. This leads to a lack of planning of
2025.ThisworkwassupportedbytheNationalNaturalScienceFoundation
ofChinaunderGrant62476025.RecommendedforacceptancebyS.Shang. thereasoningprocess,andalsolimitstheflexibilityofLLMsin
| (Correspondingauthor:DandanSong.) |            |       |        |       |           |     |               | reasoning[11]. |     |     |     |     |
| --------------------------------- | ---------- | ----- | ------ | ----- | --------- | --- | ------------- | -------------- | --- | --- | --- | --- |
| Yading                            | Li, Dandan | Song, | Yuhang | Tian, | Hao Wang, | and | Changzhi Zhou |                |     |     |     |     |
are with the School of Computer Science and Technology, Beijing Institute Anothercategoryofmethodsisstepwisereasoning-oriented
ofTechnology,Beijing100081,China(e-mail:sdd@bit.edu.cn). LLM-KGinteraction[12],[13],asshowninFig.1(b).Inthese
Shuhao Zhang is with the School of Computer Science and Technology, methods,theLLMfirstgeneratesa“thought”ofthenextreason-
HuazhongUniversityofScienceandTechnology,Wuhan430074,China.
ingsteptosolvethequestionandthenconductsatargetedKG
Codeanddataareavailableat:https://github.com/LYD369/KELGoP.
DigitalObjectIdentifier10.1109/TKDE.2025.3639599 retrievalbasedonthethought.Theabovetwostepsareiterated
1041-4347©2025IEEE.Allrightsreserved,includingrightsfortextanddatamining,andtrainingofartificialintelligenceandsimilartechnologies.
Personaluseispermitted,butrepublication/redistributionrequiresIEEEpermission.Seehttps://www.ieee.org/publications/rights/index.htmlformoreinformation.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

LIetal.:FRAMEWORKOFKNOWLEDGEGRAPH-ENHANCEDLARGELANGUAGEMODELBASEDONGLOBALPLANNING 737
toformaprocessofsimultaneousretrievalandreasoning,which deeply connected or implicit facts. Therefore, we consider in-
ultimately leads to the answer. Compared to the first category, corporatingamoreadvancedGNN-basedKGsearchingmethod
this approach explicitly specifies the specific sub-tasks of KG inspiredbyGNN-RAG[6].UnlikeGNN-RAGwhichperforms
retrievalateachreasoningstepthroughthe“thought”generated GNN reasoning directly based on the original question, we
by LLM, making KG retrieval more targeted. However, this integrate GNN reasoning into our framework for the atomic-
category still lacks a clear framework to provide a complete level sub-questions. By leveraging the structural information
plan and systematically guide the entire reasoning flow. On of KG, this approach captures richer semantic signals beyond
the one hand, errors in LLM reasoning or KG retrieval can simple surface-level similarities, leading to more relevant and
propagate, disrupting subsequent reasoning steps. This results informativefacts.
in poor controllability and stability in the reasoning process Based on the above ideas, we propose a Framework of
andreducesaccuracy.Ontheotherhand,theheuristicapproach KG-Enhanced LLM Based on Global Planning (KELGoP).
without systematic planning may lead to irrelevant or missing Specifically, we propose fine-grained question categorization
information, reducing the efficiency of both KG retrieval and basedonquestionreasoningpatternsand,onthisbasis,introduce
LLM-KGinteraction. category-drivenquestiondecompositionforcomplexquestions
To address the limitation of existing KG-enhanced LLM requiringmulti-stepreasoning.Thisservesasthebackboneof
methods that lack systematic planning, in the preliminary ver- LLM-KG interactive reasoning. Meanwhile, we design differ-
sion of this work [14], we propose an initial framework that ent decomposition logic and templates for complex questions
includes both question categorization and decomposition in a ofvariousreasoningpatterns.Thesepredefineddecomposition
coarse-grained manner, followed by targeted KG retrieval for templatesmakethequestiondecompositionmoreaccurateand
eachatomic-levelquestion.However,thisinitialdesignstillhas controllable, aligning with the decomposition needs of com-
limitations. In the current version, we extend the framework plex questions with different reasoning patterns. At the same
in the following ways, as summarized in the table provided in time,questiondecompositionenablestargetedatomicretrieval
AppendixA. from the KG at each sub-reasoning step for its corresponding
1)Usingfine-grainedhandlingforcomplexquestions:Inour sub-question. Additionally, we propose an adaptive strategy
preliminary version, we coarsely categorize the questions into thatdynamicallyadjuststhedecompositionlogicbasedonthe
“simple”or“complex”andapplythesamefew-shotpromptto effectiveness of question answering. When the decomposition
decompose all complex questions in the preliminary version. logic of a selected reasoning pattern fails to lead to sufficient
However, considering the diversity of complex questions and sub-Q&A pairs to effectively answer the question, we provide
thedifferentreasoningpatternstheyrequire,thedecomposition anopportunityforreflectionandadjustment.Thestrategyallows
logicneededforeachcategoryvaries.Thus,theoriginalcoarse forre-selectingthereasoningpatterninordertotryothertypes
approachleadstouncontrollabledecompositionresults.Toad- ofdecompositionapproaches.Thismakesthequestiondecom-
dressthislimitation,wecomeupwiththeideaofcategorizing position and reasoning framework more flexible and robust.
complexquestionsbasedontheirreasoningpatternsanddesign- Furthermore,weintroduceseveralefficientKGretrievalstrate-
ingdifferentdecompositiontemplatesforeachpattern’sreason- gies, including methods based on retrieval-then-reranking and
ing logic, enabling controllable question decomposition. This a method based on GNN, to perform accurate atomic retrieval
refinement enables more systematic and controllable planning within the candidate subgraphs on KG. These strategies work
beforereasoningbegins,whichcanimprovetheefficiencyand moreefficientlyinconjunctionwiththeLLMreasoningprocess.
accuracy of KG retrieval and LLM reasoning, while avoiding Ourmaincontributionsareasfollows:
(cid:2)
unnecessarydetoursorerrorsinthereasoningprocess. We propose a global planning-oriented LLM-KG inter-
2) Reducing the impact of inappropriate categorization: For action method, guided by the fine-grained question cat-
complex questions, relying solely on a one-time decision to egorizationbasedonreasoningpatternsandthecategory-
determinethereasoningpatternintroducestheriskofselecting drivenquestiondecompositionforcomplexquestions.We
aninappropriatedecompositionlogic,whichmayleadtosubop- also design different decomposition logic and templates
timalreasoningplans.Toaddressthisissue,afeasiblesolution for complex questions with different reasoning patterns.
istointroduceanadaptivestrategythatallowstheframeworkto This approach makes the question decomposition more
re-selectthereasoningpatternandattemptotherdecomposition accurateandcontrollable,whileenablingatomicretrieval
approaches when the current one fails. This offers an oppor- forsub-questionsontheKG.
(cid:2)
tunity to correct errors and improve the accuracy of question Weproposeanadaptivestrategyforthefine-grainedcate-
answering. gorizationanddecompositionofquestions,whichprovides
3) Integrating more advanced KG searching techniques: In the opportunity to reflect and dynamically adjust the de-
thepreliminaryversion,weadopttwoKGsearchingstrategies compositionapproachbasedontheeffectivenessofques-
basedontheretrieval-then-rerankingapproach.However,both tion answering. This makes the question decomposition
strategiesarerelativelysimpleheuristicmethodsthatfiltercan- andreasoningframeworkmoreflexibleandrobust.
(cid:2)
didate KGentities orrelations merely based ontheir semantic We introduce several efficient KG retrieval strategies, in-
similarity to the question. Moreover, they lack a global view cluding methods based on retrieval-then-reranking and a
of the KG structure, which restricts their ability to retrieve method based on GNN. These strategies enable accurate
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore. Restrictions apply.

738 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.38,NO.2,FEBRUARY2026
atomic retrieval within the candidate subgraphs on KG, questionencoding,KGrelationretrieval,andsemanticmatching
workingefficientlyinconjunctionwithLLMreasoning. betweenquestionsandrelations,tohelpimprovetheaccuracy
(cid:2)
We evaluate the proposed framework on widely used ofKGretrievalandtheoverallreasoningprocess.Withtherise
KGQAbenchmarks includingWebQSP [15],CWQ[16], of LLMs, recent works start to explore their potential in KG
and GrailQA [17]. Experimental results demonstrate that retrievalandquestionreasoning.ApproacheslikeStructGPT[8]
different variants of our framework effectively enhance andToG[9]employLLMsinentityandrelationretrievalonthe
LLM reasoning with KG and consistently outperform KG, whereas GCR [41] uses LLM to retrieve reasoning paths
existing baselines within their respective types, namely overtheKG.Theseapproaches,togetherwithGNN-RAG[6],
training-basedandreasoning-basedmethods. further rely on LLMs for subsequent reasoning and answer
generation.Additionally,RoG[5],Readi[42],andPaths-over-
Graph[43]firstuseLLMstogeneraterelationpathsorreasoning
|     |     | II. | RELATEDWORK |     |     |     |     |             |      |        |             |     |            |              |     |
| --- | --- | --- | ----------- | --- | --- | --- | --- | ----------- | ---- | ------ | ----------- | --- | ---------- | ------------ | --- |
|     |     |     |             |     |     |     |     | indicators, | then | employ | these paths | or  | indicators | as reasoning |     |
A. LLMPrompting
|     |     |     |     |     |     |     |     | plans for | KG retrieval, |     | and finally | perform |     | LLM-driven | rea- |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------- | --- | ----------- | ------- | --- | ---------- | ---- |
soningtogeneratethefinalanswers.Inordertoconductmore
Variouspromptingtechniqueshavebeendevelopedtoboost
targetedKGretrieval,PoG[44],GoG[12],andKBQA-o1[45]
| the reasoning | capabilities |     | of LLMs. | Early | work | [18] | proposes |     |     |     |     |     |     |     |     |
| ------------- | ------------ | --- | -------- | ----- | ---- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
few-shot prompting for LLMs, allowing LLMs to learn and explicitlycarryoutmulti-stepreasoning,graduallyreachingthe
|          |          |       |             |     |         |         |        | answer by | alternately | thinking |     | about | the next | task with | LLM |
| -------- | -------- | ----- | ----------- | --- | ------- | ------- | ------ | --------- | ----------- | -------- | --- | ----- | -------- | --------- | --- |
| adapt to | specific | tasks | or patterns |     | through | a small | number |           |             |          |     |       |          |           |     |
of question-answer samples. Later, to stimulate the reasoning andKGretrievalbasedonthis.
|            |       |                  |              |       |           |     |           | However,  | due   | to the lack     | of  | a systematic | and | well-designed |       |
| ---------- | ----- | ---------------- | ------------ | ----- | --------- | --- | --------- | --------- | ----- | --------------- | --- | ------------ | --- | ------------- | ----- |
| ability of | LLMs, | chain-of-thought |              | (CoT) | [19]      | is  | proposed  | to        |       |                 |     |              |     |               |       |
|            |       |                  |              |       |           |     |           | reasoning | plan, | these LLM-based |     | methods      |     | suffer from   | inef- |
| guide LLMs | in    | generating       | intermediate |       | reasoning |     | steps and |           |       |                 |     |              |     |               |       |
thoughtprocesses,thusenablingclearerandmoreinterpretable ficient LLM-KG interaction, which limits their accuracy and
|     |     |     |     |     |     |     |     | efficiency. | Among | existing | methods, |     | StructGPT | [8], | ToG [9], |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ----- | -------- | -------- | --- | --------- | ---- | -------- |
reasoning.Buildingonthis,severalworksintroduceprompting
strategies with different structures such as tree of thoughts GNN-RAG[6],GCR[41],RoG[5],Readi[42],andPaths-over-
|     |     |     |     |     |     |     |     | Graph [43] | belong | to the | original | question-oriented |     |     | category |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------ | ------ | -------- | ----------------- | --- | --- | -------- |
(ToT)[20]andgraphofthoughts(GoT)[21].Anotherwork[22]
mentionedinSectionI.TheirKGretrievalandreasoningarenot
| refines the | greedy | decoding | strategy |     | in CoT | by  | generating |     |     |     |     |     |     |     |     |
| ----------- | ------ | -------- | -------- | --- | ------ | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
multiple reasoning paths through the LLM and picking the explicitlytargetedtoeachreasoningstep.GoG[12]andKBQA-
o1[45]fallintothestepwisereasoning-orientedcategory,which
mostconsistentresponse.Totacklemorecomplexproblemsthat
requiremulti-stepsolutions,someworks[23],[24]proposethat achieves explicit multi-hop reasoning but still lack a complete
|     |     |     |     |     |     |     |     | reasoning | plan, | resulting | in unstable |     | reasoning | behavior. | In  |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ----- | --------- | ----------- | --- | --------- | --------- | --- |
LLMsfirstgenerateareasoningplanandthensolvethesub-tasks
|              |     |              |     |        |      |        |            | contrast, | our proposed | KELGoP |     | is a global | planning-oriented |     |     |
| ------------ | --- | ------------ | --- | ------ | ---- | ------ | ---------- | --------- | ------------ | ------ | --- | ----------- | ----------------- | --- | --- |
| step-by-step | or  | in parallel. | For | issues | that | errors | inevitably |           |              |        |     |             |                   |     |     |
occur during LLM reasoning, some works [25], [26] suggest framework that first decomposes the question as a global rea-
|     |     |     |     |     |     |     |     | soning plan, | and | then conducts |     | systematic | targeted | reasoning |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ------------- | --- | ---------- | -------- | --------- | --- |
usingaseriesoferrorcheckingandcorrectingprocessesonthe
generated content, improving the accuracy of LLM reasoning. accordingly.AlthoughPoG[44]alsoperformspreliminarytask
|     |     |     |     |     |     |     |     | decomposition, |     | it applies | a unified |     | decomposition |     | template |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ---------- | --------- | --- | ------------- | --- | -------- |
However,relyingsolelyontheLLMitselfforreasoningintro-
|                     |     |         |     |         |       |      |             | across questions |     | and performs |     | the decomposition |     | only | once |
| ------------------- | --- | ------- | --- | ------- | ----- | ---- | ----------- | ---------------- | --- | ------------ | --- | ----------------- | --- | ---- | ---- |
| duces hallucination |     | issues. | To  | address | this, | some | works [27], |                  |     |              |     |                   |     |      |      |
[28] incorporate external knowledge into the LLM prompt to withouttheopportunitytorevisethegeneratedsub-objectives.
Iftheinitialdecompositionisinaccurate,subsequentreasoning
obtainmoreaccurateandreliablereasoningresults.
|     |     |     |     |     |     |     |     | may fail | to recover. | In contrast, |     | KELGoP | performs | more | pre- |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ----------- | ------------ | --- | ------ | -------- | ---- | ---- |
cisereasoningpattern-specificdecompositionandintroducesan
B. KnowledgeGraphQuestionAnswering(KGQA)
adaptivestrategyasafault-tolerantmechanismtodynamically
Existing methods for KGQA primarily include two cate- adjust the reasoning plan, thereby improving robustness and
| gories: semantic |            | parsing  | (SP)-based |          | methods | and | information | reliability. |     |     |     |     |     |     |     |
| ---------------- | ---------- | -------- | ---------- | -------- | ------- | --- | ----------- | ------------ | --- | --- | --- | --- | --- | --- | --- |
| retrieval        | (IR)-based | methods. |            | SP-based | methods |     | [13], [29], |              |     |     |     |     |     |     |     |
III. METHOD
| [30], [31] | first | parse the | semantics | of  | the input | question, | con- |     |     |     |     |     |     |     |     |
| ---------- | ----- | --------- | --------- | --- | --------- | --------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
vertingitintoalogicalformsuchasSPARQLorS-expression, Beforepresentingourmethod,wefirstprovidethedefinitions
and then execute this logical form on the KG to obtain the of Knowledge Graph (KG) and Knowledge Graph Question
answer. To address the issue of non-executable logical forms, Answering(KGQA).
DecAF[32]takesintoaccountthedirectanswergenerationby KGisastructuredrepresentationoffacts,whereeachfactcan
LLMtoproducethefinalresult. berepresentedasatripleconsistingofaheadentity,arelation,
Our proposed framework belongs to IR-based methods, andatailentity.Formally,aKGisdenotedasG =(e ,r,e )⊆
|     |     |     |     |     |     |     |     |         |     |     |     |     |     | h   | t   |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     | E ×R×E. |     | E   | R   |     |     |     |     |
which retrieve relevant facts from the KG and reason based The sets and refer to the collections of all
on these facts to generate the answer to the question. In this entitiesandrelationsintheKG,respectively.
category, earlymethods [33],[34],[35],[36]utilizestructures KGQAreferstothetaskofansweringspecificquestionsusing
thefactualdatawithinaKG.Foragivenquestionq
such as key-value memory networks and graph neural net- andaKG
works (GNNs) to encode knowledge from the KG, enabling G,topicentitiesTq canbeidentifiedfromthequestion,andthe
|     |     |     |     |     |     |     |     |     |     |     |     |     |     | Aq  | ={aq}. |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ |
KG retrieval. Later, researchers [37], [38], [39], [40] begin to corresponding correct answers are represented as
incorporatepretrainedlanguagemodels(PLMs)fortaskssuchas Both the topics and the answers are entities within the KG,
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

LIetal.:FRAMEWORKOFKNOWLEDGEGRAPH-ENHANCEDLARGELANGUAGEMODELBASEDONGLOBALPLANNING 739
Fig.2. AnexampleoftheworkflowofourproposedframeworkKELGoP,whichconsistsoffourmaincomponents:Fine-grainedQuestionClassifier,Category-
drivenQuestionDecomposer,AtomicQuestionAnswerer,andIntegratorwithVerification.
| meaningTq,Aq | ⊆E.ToaccomplishtheKGQAtask,weneedto |     |     |     |     |     |     |     |     |     |     |     |
| ------------ | ----------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
complexity,formalizedas:
createamodelfthatpredictstheansweraqforaquestionqbased
cq =CoarseClassifier(q),
| onthefactualknowledgeintheKGG,whichismathematically |     |     |     |     |     |     |     | c   |     |     |     | (1) |
| --------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
expressedasaq =f(q,G). where cq ∈{“Simple”,“Complex”}. The few-shot prompt
c
forLLMemployedintheCoarseClassifierisasfollows:
A. Overview Determine the type of the question (simple or complex).
Answer“{{Simple}}”or“{{Complex}}”.
Fig.2illustratestheKELGoPframework,showingitswork-
|     |     |     |     |     |     |     | Few-Shot | Examples |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | -------- | --- | --- | --- | --- |
flowforsolvingacomplexquestion,whereitusestheadaptive
Question:{Question}
| strategy to | explore | two decomposition |     | approaches. | Given | the |     |     |     |     |     |     |
| ----------- | ------- | ----------------- | --- | ----------- | ----- | --- | --- | --- | --- | --- | --- | --- |
Answer:
| input question, | the | Fine-grained |     | Question | Classifier (see | Sec- |     |     |     |     |     |     |
| --------------- | --- | ------------ | --- | -------- | --------------- | ---- | --- | --- | --- | --- | --- | --- |
tionIII-B)firstperformsatwo-stagecategorizationtodetermine
itscomplexityandreasoningpattern.Forasimplequestion,the WeaimtoenabletheLLMtounderstandthecriteriaforthe
|     |     |     |     |     |     |     | first-stage categorization |     | through | the few-shot | examples. | We  |
| --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | ------- | ------------ | --------- | --- |
AtomicQuestionAnswerer(seeSectionIII-E)retrievesrelevant
manuallyannotatetheseexamplesonthebasisoftheSPARQL
| knowledge | from the | KG  | and derives | the | answer in a | single |     |     |     |     |     |     |
| --------- | -------- | --- | ----------- | --- | ----------- | ------ | --- | --- | --- | --- | --- | --- |
reasoning step. For a complex question, the Category-driven provided in the dataset as well as the semantic and logical
complexityofthequestions.Aquestionisconsideredcomplex
| Question Decomposer |     | (see | Section | III-C) | selects the decom- |     |     |     |     |     |     |     |
| ------------------- | --- | ---- | ------- | ------ | ------------------ | --- | --- | --- | --- | --- | --- | --- |
position template from our designed templates based on its ifitrequiresmulti-stepreasoning.Otherwise,itissimple.
Complexquestionsrequirefine-grainedcategorizationbased
| category of | reasoning | pattern | and | decomposes | it into a | series |     |     |     |     |     |     |
| ----------- | --------- | ------- | --- | ---------- | --------- | ------ | --- | --- | --- | --- | --- | --- |
ontheirreasoningpatterninthesecondstage,formalizedas:
ofsub-questions.Eachofthemisthenfedsequentiallyintoour
KELGoPframeworktoderiveitsanswer.Finally,theIntegrator
|     |     |     |     |     |     |     |     | cq  | =FineClassifier(q,C), |     |     | (2) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | --- |
f
withVerification(seeSectionIII-D)integratesthesub-questions
and their answers to verify their sufficiency in solving the where cq ∈C,C ⊆{“Comparative”,“Composition”,
f
|     |     |     |     |     |     |     | “Conjunction”,“Superlative”}. |     |     | C   |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | --- | --- |
original complex question and to infer the final answer. The contains the
sufficiencydetermineswhethertheadaptivestrategyisactivated reasoning pattern categories that have not been selected
toadjustthedecompositionapproachandre-conductreasoning. during the adaptive reasoning process and is initialized to
The framework controls question decomposition by setting a include all four categories. The few-shot prompt for LLM
maximumdepthD.Thedecompositionprocessstopsoncethis employedintheFineClassifierisasfollows:
depthisreachedorwhenasub-questioniscategorizedassimple. Basedonthefollowingexamples,learnhowtodetermine
ThepreciseworkflowofKELGoPisdetailedinAlgorithm1. the type of a question based on its semantics, rather than
|     |     |     |     |     |     |     | relying on keywords |     | in the question. | Then, | determine | the |
| --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | ---------------- | ----- | --------- | --- |
B. Fine-GrainedQuestionClassifier type of the given question based on its semantics. Answer
{CandidateCategories}.
Inordertohandlequestionswithdifferentcomplexitiesand
|                    |     |                 |     |             |             |     | {Few-Shot | Examples | of  | Candidate | Cate- |     |
| ------------------ | --- | --------------- | --- | ----------- | ----------- | --- | --------- | -------- | --- | --------- | ----- | --- |
| reasoning patterns |     | using different |     | approaches, | this module | is  |           |          |     |           |       |     |
gories}
| designed to | employ | the few-shot |     | prompted | LLM to perform | a   |     |     |     |     |     |     |
| ----------- | ------ | ------------ | --- | -------- | -------------- | --- | --- | --- | --- | --- | --- | --- |
Question:{Question}
q.
| two-stage fine-grained                                   |     | categorization |     | on the | input question |     |         |     |     |     |     |     |
| -------------------------------------------------------- | --- | -------------- | --- | ------ | -------------- | --- | ------- | --- | --- | --- | --- | --- |
| Inthefirststage,questionqiscoarselycategorizedbasedonits |     |                |     |        |                |     | Answer: |     |     |     |     |     |
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

740 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.38,NO.2,FEBRUARY2026
Usemulti-stepreasoninganddecomposethequestioninto
Algorithm1:KELGoP.
|                                      |     |     |                |     | several    | sub-questions. | If a subsequent       |     | subquestion |     | requires |
| ------------------------------------ | --- | --- | -------------- | --- | ---------- | -------------- | --------------------- | --- | ----------- | --- | -------- |
| Input:questionq,goldentopicentitiesT |     |     | q ofquestionq, |     |            |                |                       |     |             |     |          |
|                                      |     |     | g              |     | the answer | to the         | previous subquestion, |     | replace     | the | answer   |
KGG,maximumdepthDofquestiondecomposition,
tosubquestion-kwith[#k]inthesubsequentsubquestion.
maximumattemptsθoffine-grainedcategorization {Few-Shot Examples of Specific Cate-
Output:answerentityaq
gory}
depth←0
| 1:    |             |                |     |     | Question:{Question} |     |     |     |     |     |     |
| ----- | ----------- | -------------- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- |
| 2: aq | ←KELGoP(q,T | q,G,D,θ,depth) |     |     |                     |     |     |     |     |     |     |
|       |             | g              |     |     | Answer:             |     |     |     |     |     |     |
functionKELGoPq,Tq,G,D,θ,depth
4:
|     | ifdepth=DORCoarseClassifier(q)=“Simple(cid:5)(cid:5) | g   |     |     |     |     |     |     |     |     |     |
| --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
5: Considering the continuity between steps in multi-step rea-
then
soning,thesub-questionsinlaterstepsarelikelytorequirethe
|     | aq ←AtomicQuestionAnswerer(q,G,T |     | q)  |     |         |                |                |     |            |     |          |
| --- | -------------------------------- | --- | --- | --- | ------- | -------------- | -------------- | --- | ---------- | --- | -------- |
| 6:  |                                  |     |     |     | answers | from preceding | sub-questions. |     | Therefore, |     | we manu- |
g
7: else
|     |     |     |     |     | ally craft | the sub-questions | in  | the examples | to  | help | the LLM |
| --- | --- | --- | --- | --- | ---------- | ----------------- | --- | ------------ | --- | ---- | ------- |
C ←{“Comparative”,“Composition”,
8: understand their format requirements. For each sub-question,
erlative”}
“C o n j u n c t i on ”, “S u p sq q = < w , .. . , w > , w h e re w ∈ W ∪ T .W ist h e s et o f
|     |     |     |     |     | i   | 1 |s | q q | | k   |     | i   |     |
| --- | --- | --- | --- | --- | --- | ---- | ----- | --- | --- | --- | --- |
9: w h il e l en ( C ) ≥ 5 − θ d o i T = {[ #j ]| 1 ≤ j < i , i ∈ Z }
|     |                         |     |     |     | w o rd s an                                           | d p u n c t ua t | io n m a rk s | .   |     |     |     |
| --- | ----------------------- | --- | --- | --- | ----------------------------------------------------- | ---------------- | ------------- | --- | --- | --- | --- |
|     | cq ←FineClassifier(q,C) |     |     |     |                                                       |                  |               | i   |     |     |     |
| 10: |                         |     |     |     | isthesetoftagsforanswerstoprecedingsub-questionsofsqq |                  |               |     |     |     | ,   |
|     | f                       |     |     |     |                                                       |                  |               |     |     |     | i   |
11: Sqq ←Decomposer(q,cq) where[#j]denotestheanswertosub-questionj.
f
(cid:2)Sqq,Saq ←[],[] Additionally,thefew-shotexamplesinthepromptguidethe
12:
fori=0→len(Sqq)−1do LLMtoformulateaglobalplanintheformofsub-questions.As
13:
differentcategoriescq
s (cid:2) qq ←replace(Sqq[i],Saq ) requiredifferentquestiondecomposition
| 14: |     |     |     |     |     |     | f   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
i <i logic,thepromptincludescategory-specificexamplestoensure
|     | (cid:2)Sq q.append(s | (cid:2) qq) |     |     |     |     |     |     |     |     |     |
| --- | -------------------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
15:
|     |                         | i                            |     |     | accurateandcontrollabledecomposition.Thesub-questionsfor |     |     |     |     |     |     |
| --- | ----------------------- | ---------------------------- | --- | --- | -------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|     | as (cid:2) qq ←KELGoP(s | (cid:2) qq,Tq,G,D,θ,depth+1) |     |     |                                                          |     |     |     |     |     |     |
| 16: | i                       |                              |     |     | eachcategoryintheseexamplesaremanuallycraftedbasedon     |     |     |     |     |     |     |
|     |                         | i                            | g   |     |                                                          |     |     |     |     |     |     |
(cid:2) qq theSPARQL annotations inthe datasetand our understanding
| 17: | Saq.append(as | i ) |     |     |     |     |     |     |     |     |     |
| --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ofquestionsemantics.
| 18: | endfor |     |     |     |     |     |     |     |     |     |     |
| --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
(aq,lq)←Integrator(q,(cid:2)Sqq,Saq) Specifically,wedesigndedicateddecompositionmethodsfor
19:
20: C ←C\{cq} different categories of reasoning patterns. Detailed decompo-
f
iflq =“[su sition examples can be found in Appendix B. A Composi-
| 21: |       | fficient]”then |     |     |               |          |                 |     |                |     |        |
| --- | ----- | -------------- | --- | --- | ------------- | -------- | --------------- | --- | -------------- | --- | ------ |
|     |       |                |     |     | tion question | involves | two progressive |     | sub-questions. |     | In the |
| 22: | break |                |     |     |               |          |                 |     |                |     |        |
23: endif decomposition example, we break it down sequentially: solve
sub-question1firsttoobtaintheintermediateanswer,thenuse
| 24: | endwhile |     |     |     |     |     |     |     |     |     |     |
| --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
ittosolvesub-question2,leadingtothefinalanswer.ACon-
25: endif
returnaq junctionquestionconsistsoftwoparallelsub-questionsand
26:
requiresanswerssatisfyingbothconditions.Sowebreakitinto
27: endFunction
|     |     |     |     |     | two sequential | sub-questions | and | take | the intersection |     | of their |
| --- | --- | --- | --- | --- | -------------- | ------------- | --- | ---- | ---------------- | --- | -------- |
answersintheexample.ComparativeandSuperlative
questionsalsoinvolvetwoprogressivesub-questions,buttheir
secondreasoningstepsdifferfromCompositionquestions.
Thepromptincludesexamplesofcandidatereasoningpattern Comparative questions compare a specific attribute of the
|     | C,  |     |     |     |     |     |     |     |     | Superlative |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- |
categories with each question’s category derived from the intermediate answer to a given value, while
datasetannotations. questionscompareintermediateanswersagainsteachotherona
specificattributetodeterminetheextremevalue.Aftercompari-
C. Category-DrivenQuestionDecomposer son,bothcategoriesidentifytheattributethatmeetsthecondition
|     |     |     |     |     | and select | the corresponding |     | intermediate | answer | as  | the final |
| --- | --- | --- | --- | --- | ---------- | ----------------- | --- | ------------ | ------ | --- | --------- |
ToflexiblyhandlediversequestionscategorizedasComplex
answer.
bytheCoarseClassifier,thismoduleprocessesthemaccordingto
theirreasoningpatternassignedbytheFineClassifier.Itemploys
|     |     |     |     |     | D. IntegratorWithVerification |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ----------------------------- | --- | --- | --- | --- | --- | --- |
q
| the few-shot | prompted LLM | to decompose | a given question |     |     |     |     |     |     |     |     |
| ------------ | ------------ | ------------ | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- |
intoaseriesofsub-questionsSqq accordingtoitscategorycq, Considering the sequential nature of multi-step reasoning,
f
|     |     |     |     |     | once the | Category-driven | Question | Decomposer |     | decomposes |     |
| --- | --- | --- | --- | --- | -------- | --------------- | -------- | ---------- | --- | ---------- | --- |
formalizedas:
acomplexquestionintodsub-questions,theyshouldbesolved
Sqq =Decomposer(q,cq).
(3) sequentially.Theprocessingandsolvingofthei-thsub-question
f
|     |     |     |     |     | sqq (1≤i≤d,i∈Z)isformalizedas: |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | --- | --- | --- |
i
| where Sqq | =[sqq,...,sqq] | is the list | of d sub-questions | and |     |     |     |     |     |     |     |
| --------- | -------------- | ----------- | ------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
|           | 1              | d           |                    |     |     |     |     |     |     |     |     |
sqq isthesub-que stionof thei-threasoningstep.Thefew-shot s (cid:2) qq =replace(sqq,Saq ),
i
|     |     |     |     |     |     |     | i   | i   | <i  |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
promptforLLMusedintheDecomposerisasfollows:
|     |     |     |     |     |     | (cid:2) | qq          | (cid:2) |     |     |     |
| --- | --- | --- | --- | --- | --- | ------- | ----------- | ------- | --- | --- | --- |
|     |     |     |     |     |     | as      | i =KELGoP(s | qq,G),  |     |     | (4) |
i
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

LIetal.:FRAMEWORKOFKNOWLEDGEGRAPH-ENHANCEDLARGELANGUAGEMODELBASEDONGLOBALPLANNING 741
Saq (cid:2) qq (cid:2) qq originalquestionsorsub-questionsthatareidentifiedassolvable
| where     | =[as           | 1 ,...,as | i−1       | ], storing | the     | answers | to the   |                                                       |     |     |     |     |     |     |     |
| --------- | -------------- | --------- | --------- | ---------- | ------- | ------- | -------- | ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
|           | < i            |           |           |            |         |         |          | throughone-stepreasoning.Therefore,wecanperformatomic |     |     |     |     |     |     |     |
| preceding | su b-questions |           | in order. | Before     | feeding | sqq     | into our |                                                       |     |     |     |     |     |     |     |
i
(cid:2) r e t r iev a l f o r t h e g i v e n q u es ti on t o o b t ai n r el e v a n t K G f a c t s. T he n
| frameworkKELGoPtoderivetheansweras |     |     |     |     | qq i,itisne |     | cessaryto |            |             |              |         |          |                   |            |               |
| ---------------------------------- | --- | --- | --- | --- | ----------- | --- | --------- | ---------- | ----------- | ------------ | ------- | -------- | ----------------- | ---------- | ------------- |
|                                    |     |     |     |     |             |     |           | w i t h th | e i r a s s | i st a n c e | , w e e | m pl o y | t h e f e w - s h | o t p ro m | p t e d L L M |
employthefunctionreplacetoreplaceanyprecedinganswertag
toderivetheanswer.
| “[#j]”(1≤j |     | <i,i∈Z)thatmaybeincludedinsqqwiththe |     |     |     |     |     |                           |     |     |     |                          |     |     |     |
| ---------- | --- | ------------------------------------ | --- | --- | --- | --- | --- | ------------------------- | --- | --- | --- | ------------------------ | --- | --- | --- |
|            |     |                                      |     |     |     |     | i   | 1) TopicEntityExtraction: |     |     |     | TheKGcontainsavastamount |     |     |     |
(cid:2) qq
correspondinganswertextas j ∈Saq .Itisworthnotingthatif of data, most of which is irrelevant to a simple question. To
<i
asub-questionsqqdependsonaprecedinganswerthatcontains
avoidinefficientretrievalandintroductionofnoisetosubsequent
i
multipleanswerentities,thefunctionreplacesubstitutesthecor- answer generation, we locate a relevant subgraph in the large-
respondingprecedinganswertaginsqqwithasemicolon-joined
i scale KG. Therefore, it is first necessary to identify the topic
(cid:2)
stringoftheseentities,yieldingsqq.Inaddition,weretainaset entitiesofthequestion.
i
|                                |     |     |     |                              |     |     |     | For | each atomic | question |     | q, we | extract entity | IDs | from the |
| ------------------------------ | --- | --- | --- | ---------------------------- | --- | --- | --- | --- | ----------- | -------- | --- | ----- | -------------- | --- | -------- |
| ofinstancesinwhicheachofthesee |     |     |     | ntitiesisindividuallysubsti- |     |     |     |     |             |          |     |       |                |     |          |
tutedintothetagposition,forlateruse.Specifically,whens (cid:2) qqis SPARQL annotated for its corresponding original question in
|                                                     |     |     |     |     |     |     | i   | the dataset | to  | preliminarily |     | form | its topic entity | set | Tq. Since |
| --------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------------- | --- | ---- | ---------------- | --- | --------- |
| subsequentlyfedintoKELGoP,ifitiscategorizedasSimple |     |     |     |     |     |     |     |             |     |               |     |      |                  |     | g         |
atomicquestionsmayhaveintermediatetopicsthatareproduced
andtopicentityextractionisrequired(seeSectionIII-E1),each
duringmulti-stepreasoningandnotincludedintheSPARQL,we
instanceinthissetofinstantiatedsub-questionsisindependently
furtheremployanentitylinkerastheTopicExtractortoidentify
passedtotheTopicExtractor.Thisdesignavoidstheomissionof
andlinktheseentitiestoKGG,whichisformalizedas:
relevanttopicsthatmayoccurifmultipleentitiesareprovided
simultaneouslywithinasingleinputsentence. Tq =TopicExtractor(q,G)∪Tq, (6)
g
| After    | obtaining | answers  | to  | all d sub-questions, |           | this  | module      |       |             |     |         |     |            |          |         |
| -------- | --------- | -------- | --- | -------------------- | --------- | ----- | ----------- | ----- | ----------- | --- | ------- | --- | ---------- | -------- | ------- |
|          |           |          |     |                      |           |       |             |       | Tq ={tq}⊆E, |     |         |     |            |          |         |
|          |           |          |     |                      |           |       |             | where |             |     | serving | as  | the source | entities | for the |
| uses the | few-shot  | prompted | LLM | to                   | integrate | them. | It verifies |       |             |     |         |     |            |          |         |
subsequentsearchofrelevantKGfacts.
| theirsufficiencylq |     | inaddressingtheoriginalcomplexquestion |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ------------------ | --- | -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
q
qandattemptstoinfertheansweraq,formalizedas: 2) Relevant Fact Searching: Given the question and its
|     |     |     |     |     |     |     |     | topicsetTq,weneedtosearchforrelevantfactsRefq |     |     |     |     |     |     | onKG |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------------- | --- | --- | --- | --- | --- | --- | ---- |
(aq,lq)=Integrator(q,(cid:2)Sqq,Saq), G,whichcanbeformalizedas:
(5)
lq ∈{“[sufficient]”, “[insufficient]”}. Refq =Searcher(q,Tq,G), (7)
where
| (cid:2)Sqq =[s | (cid:2) qq ,...,s | (cid:2) qq ] | Saq | =[as (cid:2) qq | ,...,as | (cid:2) qq ] |     |     |     |     |     |     |     |     |     |
| -------------- | ----------------- | ------------ | --- | --------------- | ------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
and 1 d represent the The Searcher consists of two main steps: 1) extracting a rel-
1 d
lists of d sub-questions and their corresponding answers, re- evant subgraph in the neighborhood of topic entities as can-
|     |     |     |     |     |     |     |     | didates; | 2) retrieving |     | relevant | facts | from the | candidates. | We  |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------------- | --- | -------- | ----- | -------- | ----------- | --- |
spectively.
Thefew-shotpromptforLLMintheIntegratorisasfollows: introduceseveralstrategiestoimplementtheSearcher,asshown
|     |     |     |     |     |     |     |     | in Fig. | 3. Among | them, | two | are designed | based | on  | commonly |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ----- | --- | ------------ | ----- | --- | -------- |
Answerthequestion“{{answerentity}}”accordingtothe
givenQ&Areferencesandyourknowledge. used retrieval-then-reranking approach in RAG, which focus
Few-Shot Examples ontextualsimilarity.AnotherstrategyfollowstheGNN-based
approachproposedin[6],whichfocusesmoreonthestructural
Question:{Question}
| References:{PairsofSub-Q&A} |     |     |     |     |     |     |     | informationofKG.               |     |     |     |     |            |       |        |
| --------------------------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | --- | ---------- | ----- | ------ |
|                             |     |     |     |     |     |     |     | Retrieval-then-Reranking-Based |     |     |     |     | Searching: | Based | on the |
Answer:
|     |     |     |     |     |     |     |     | retrieval-then-reranking |       |     | approach,              |     | we design | two | searching |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------ | ----- | --- | ---------------------- | --- | --------- | --- | --------- |
|     |     |     |     |     |     |     |     | strategies,              | which | are | triple/quadruple-based |     |           | and | relation- |
The“Answer”inthefew-shotexamplesaremanuallycrafted,
based,respectively.Thedifferenceliesintheformofobtained
includingthesufficiencylabellq,thereasoningprocess,andthe
aq candidates and the focus of retrieval, as shown in Fig. 3(a)
| answer | to the | original | question. | If  | the verification |     | result | is  |     |     |     |     |     |     |     |
| ------ | ------ | -------- | --------- | --- | ---------------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
and(b).
[sufficient],theLLMshouldintegratethesub-Q&Apairs
|     |     |     |     |     |     |     |     | Inthefirststepofcandidateextraction,foreachtq |     |     |     |     |     |     | ∈Tq,we |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------------- | --- | --- | --- | --- | --- | --- | ------ |
togeneratethewholereasoningprocess.Basedonthis,theLLM
|     |     |     |     |     |     |     |     |         |            | Candq |     |          |                 |     | q        |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---------- | ----- | --- | -------- | --------------- | --- | -------- |
|     |     |     |     |     |     |     |     | extract | candidates |       | tq  | relevant | to the question |     | within a |
attemptstogeneratethefinalanswer.
|                 |               |       |               |     |                    |     |          | 2-hoprangewheretq                                    |     |     | servesaseithertheheadortailentity,for |     |     |     |     |
| --------------- | ------------- | ----- | ------------- | --- | ------------------ | --- | -------- | ---------------------------------------------------- | --- | --- | ------------------------------------- | --- | --- | --- | --- |
| The sufficiency |               | label | lq determines |     | whether            | our | adaptive |                                                      |     |     |                                       |     |     |     |     |
|                 |               |       |               | lq  |                    |     |          | reasonsdiscussedinAppendixC.Therankingandselectionof |     |     |                                       |     |     |     |     |
| strategy        | is activated. | If    | the label     |     | is [insufficient], |     |          |                                                      |     |     |                                       |     |     |     |     |
relevantrelationsarebasedonthesemanticsimilaritybetween
| it may           | indicate | that the | currently | selected |     | reasoning     | pattern |              |             |       |           |        |                |            |            |
| ---------------- | -------- | -------- | --------- | -------- | --- | ------------- | ------- | ------------ | ----------- | ----- | --------- | ------ | -------------- | ---------- | ---------- |
|                  |          |          |           |          |     |               |         | the question | and         | the   | candidate | first- | and second-hop |            | relations, |
| or decomposition |          | method   | is not    | suitable | for | this question | and     |              |             |       |           |        |                |            |            |
|                  |          |          |           |          |     |               |         | which        | is computed | using | a         | dense  | retriever.     | The second | hop is     |
thereforeneedstobeadjusted.Thecurrentlyselectedcategory
onlyconsideredwhenthefirst-hopentitylinkedbytheselected
cq isremovedfromC,andtheframeworkattemptstosolvethe
| f   |     |     |     |     |     |     |     | top-mfirst-hoprelationsisacompoundvaluetype(CVT),which |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
questionbyselectinganewcategoryofreasoningpatternusing
FineClassifier(q,C\{cq}). isanintermediatenoderepresentingn-aryrelationsinKGand
|     |     |     | f   |     |     |     |     | doesnothavenaturallanguagenames.Whenconstructingcan- |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
didates,thetriple/quadruple-basedstrategyincorporateslinked
E. AtomicQuestionAnswerer
first-orsecond-hopentitiestoformtriplesorquadruples,while
Thismoduleisdesignedtohandleatomicquestionscatego- the relation-based strategy does not, as illustrated in Fig. 3(a)
rized as Simple by the CoarseClassifier, referring to either and (b). Finally, we merge the candidates extracted for each
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

742 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.38,NO.2,FEBRUARY2026
Fig.3. Illustrationofthequestion-relevantKGfactsearchingstrategies,where(a)and(b)areretrieval-then-reranking-basedstrategiesand(c)istheGNN-based
strategy.
topicentitytoobtainthecandidatesubgraphofquestionqinthe IV. EXPERIMENTS
| formofafactlist,denotedasCandq |     | =∪Candq | ,∀tq ∈Tq. |     |     |     |     |     |     |     |
| ------------------------------ | --- | ------- | --------- | --- | --- | --- | --- | --- | --- | --- |
tq
A. DatasetsandEvaluationMetric
| In the second | step, we follow | the retrieval-then-reranking |     |     |     |     |     |     |     |     |
| ------------- | --------------- | ---------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
processwithadenseretrieverandarerankertoobtainasmall We evaluate the effectiveness of our framework KELGoP
numberoffactsfromcandidatesetCandq on three KGQA datasets. WebQuestionsSP (WebQSP) [15]
asthereferenceset
Refq forsubsequentanswergeneration.Fortherelation-based consistsof2,848,250and1,639QApairsfortraining,validation
strategy,itisnecessarytofurthercompletethefirst-orsecond- andtesting,respectively,followingthesplitin[6].ComplexWe-
| hopentitiesforeachrefq | ∈Refq. |     |     |            |       |               |      |        |     |            |
| ---------------------- | ------ | --- | --- | ---------- | ----- | ------------- | ---- | ------ | --- | ---------- |
|                        |        |     |     | bQuestions | (CWQ) | [16] is built | upon | WebQSP | by  | increasing |
GNN-BasedSearching:Following[6],thePageRank-Nibble question complexity through approaches such as expanding
originalentitiesintosub-questionsoraddinganswerconstraints.
(PRN)[46]isusedtoextractthecandidatesubgraphfortheorig-
inalquestion.Weadoptthemascandidatesforthecorresponding CWQcontains27,639,3,519and3,531QApairsfortraining,
atomicquestions. validationandtesting,respectively.GrailQA[17]includesthree
Then,followingtheGNNreasoningmodulein[6],theGNN levelsofquestions,namelyi.i.d.,compositionalandzero-shot.
reasoning is performed on the candidate subgraph to obtain We follow [9] and [44] to use 1,000 QA pairs for testing on
nodes with a high likelihood of being the correct answer as GrailQA.AllthreedatasetsarebasedonFreebaseKG[47].We
retrievedentities.Theshortestpathsbetweentheseentitiesand pre-process Freebase following [48], retaining only entities in
thetopicentitiesinthecandidatesubgrapharethenidentifiedto the form of Freebase IDs, English text, and numerical values,
alongwiththeircorrespondingtriples.
formtherelevantfacts,asshowninFig.3(c),whichcollectively
constitutethereferencesetRefq. WeuseExactMatch(EM)astheevaluationmetric,following
3) AnswerGeneration: Afterobtainingtheretrievedfactset previous works [8],[9],[28], [44], [49]. We match the correct
| Refq |     | q,  |     |     |     |     |     |     |     |     |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
on the KG for the atomic question we use them as answerwithinthe“{}”scopemarkedintheLLMresponse.If
references and employ the few-shot prompted LLM to reason themarkedcontentisabsent,wesearchforthecorrectanswer
andgeneratetheansweraq,whichisformalizedas: withintheentireresponse.
aq =Answerer(q,Refq).
(8)
B. BaselinesandOurFrameworks
Thefew-shotpromptfortheLLMinAnswererisasfollows:
Weconsidertwotypesofbaselinesforcomparison.Training-
| Reason | and answer the question | in “{{answer | entity}}” |     |     |     |     |     |     |     |
| ------ | ----------------------- | ------------ | --------- | --- | --- | --- | --- | --- | --- | --- |
basedmethodsrefertothosethatinvolvetrainingorfine-tuning
accordingtothegivenretrievedknowledgeandyourknowl-
|     |     |     |     | at least | one component, | such | as PLMs, | LLMs | or  | KG retriev- |
| --- | --- | --- | --- | -------- | -------------- | ---- | -------- | ---- | --- | ----------- |
edge. ers, on the KGQA datasets, including KV-Mem [33], Graft-
| Few-Shot | Examples |     |     |           |         |                 |     |       |             |       |
| -------- | -------- | --- | --- | --------- | ------- | --------------- | --- | ----- | ----------- | ----- |
|          |          |     |     | Net [34], | PullNet | [35], EmbedKGQA |     | [50], | TransferNet | [37], |
Question:{Question} NSM[36],KGT5[51],SR+NSM+E2E[38],TIARA[52],KD-
Retrievedknowledge:{RetrievedKGFacts}
|     |     |     |     | CoT [28], | UniKGQA | [39], | ReasoningLM |     | [40], DecAF | [32], |
| --- | --- | --- | --- | --------- | ------- | ----- | ----------- | --- | ----------- | ----- |
Answer:
|     |     |     |     | RoG [5],      | GNN-RAG | [6], and       | SubgraphRAG |         | [7]. | Reasoning-  |
| --- | --- | --- | --- | ------------- | ------- | -------------- | ----------- | ------- | ---- | ----------- |
|     |     |     |     | based methods |         | refer to those | that        | perform | no   | training or |
The manually crafted few-shot examples guide the LLM to fine-tuning on the KGQA datasets we use, including IO [18],
organize the reasoning process with the given knowledge and CoT [19], CoT+SC [22], StructGPT [8], KB-BINDER [49],
useitsinherentknowledgeforassistancewhennecessary. Readi[42],ToG[9],GoG[12],andPoG[44].
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

LIetal.:FRAMEWORKOFKNOWLEDGEGRAPH-ENHANCEDLARGELANGUAGEMODELBASEDONGLOBALPLANNING 743
Our proposed framework has three variants based on dif- TABLEI
ferentrelevantKGfactsearchingstrategies.KELGoP-triand PERFORMANCE(EMINPERCENT)OFOURFRAMEWORKANDBASELINESON
WEBQSPANDCWQ
KELGoP-relusethetriple/quadruple-basedandrelation-based
| retrieval-then-reranking |     |     | strategies, | respectively, | and | both are |     |     |     |     |     |     |
| ------------------------ | --- | --- | ----------- | ------------- | --- | -------- | --- | --- | --- | --- | --- | --- |
reasoning-basedmethods.Incontrast,KELGoP-gnnadoptsthe
GNN-basedsearchingstrategythattrainsaGNNontheKGQA
| datasets, | thus considered |     | a training-based |     | method, though | the |     |     |     |     |     |     |
| --------- | --------------- | --- | ---------------- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
LLMremainsuntrained.
C. ImplementationDetails
| Unless | otherwise | specified, |     | the default | LLM used | in our |     |     |     |     |     |     |
| ------ | --------- | ---------- | --- | ----------- | -------- | ------ | --- | --- | --- | --- | --- | --- |
experimentsisgpt-3.5-turbo-0125[53],withamaximumoutput
tokenlimitof200.ThemaximumdepthDofquestiondecom-
positioninourframeworkissetto1.Forouradaptivestrategy,
themaximumattemptsθoffine-grainedcategorizationissetto
3bydefault,meaningthatacomplexquestioncanattemptupto
threedifferentreasoningpatterns.
| For topic | entity   | extraction, | we        | use the golden | topic      | entities |     |     |     |     |     |     |
| --------- | -------- | ----------- | --------- | -------------- | ---------- | -------- | --- | --- | --- | --- | --- | --- |
| for each  | question | and         | adopt ELQ | [54] as        | the entity | linker.  |     |     |     |     |     |     |
Inretrieval-then-reranking-basedKGsearching,weuseDistil-
| BERT1 asthedenseretrieverandMiniLM2 |     |     |     |     | asthereranker.As |     |     |     |     |     |     |     |
| ----------------------------------- | --- | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- |
illustratedinFig.3,theparametersforcandidateextractionare
setasn=10,m=5,andp=5.Duringretrieval,thenumber
| of retained | facts | k is | set to 20, | while during | reranking, | the |     |     |     |     |     |     |
| ----------- | ----- | ---- | ---------- | ------------ | ---------- | --- | --- | --- | --- | --- | --- | --- |
rt
| numberofretainedfactsk |     |     | issetto10forKELGoP-triand13 |     |     |     |     |     |     |     |     |     |
| ---------------------- | --- | --- | --------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
rr
forKELGoP-relbydefault.
| All experiments |     | were | conducted | on a single | NVIDIA | RTX |     |     |     |     |     |     |
| --------------- | --- | ---- | --------- | ----------- | ------ | --- | --- | --- | --- | --- | --- | --- |
A6000GPU(48GBVRAM),anIntelXeonGold5220RCPU,
and503GBofsystemmemory,withtheactualruntimememory
usage peaking at about 72 GB RAM. Further implementation TABLEII
PERFORMANCE(EMINPERCENT)OFOURFRAMEWORKANDBASELINES
| detailsoftheexperimentscanbefoundinAppendixD. |     |     |     |     |     |     |     |     | ONGRAILQA |     |     |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --- | --- |
D. MainResults
TableIpresentsacomprehensivecomparisonbetweenbase-
linesandourKELGoPonWebQSPandCWQ.Allthreevariants
ofKELGoPshowsignificantimprovementsovertheIOprompt-
ingmethodwhichrepresentsthefew-shotperformanceofvanilla
| GPT-3.5.     | This demonstrates |           | the | effectiveness | of our     | method |     |     |     |     |     |     |
| ------------ | ----------------- | --------- | --- | ------------- | ---------- | ------ | --- | --- | --- | --- | --- | --- |
| in enhancing | LLM               | reasoning |     | with KG.      | KELGoP-gnn | and    |     |     |     |     |     |     |
KELGoP-reloutperformthepreviousstate-of-the-artbaselines
| in their respective |           | types, | training-based | and          | reasoning-based |     |     |     |     |     |     |     |
| ------------------- | --------- | ------ | -------------- | ------------ | --------------- | --- | --- | --- | --- | --- | --- | --- |
| methods,            | achieving | the    | best known     | performance. | KELGoP-tri      |     |     |     |     |     |     |     |
alsosurpassesmostreasoning-basedbaselines.Thestrongper-
formance of our framework on both WebQSP with relatively the annotations of comparative, composition, conjunction and
| simple questions |     | and CWQ | with | more complex | questions | in- |     |     |     |     |     |     |
| ---------------- | --- | ------- | ---- | ------------ | --------- | --- | --- | --- | --- | --- | --- | --- |
superlativeasinCWQ.GrailQAincludesquestionswithmore
dicatesitsadaptabilitytodifferentquestioncomplexity.More- diversereasoningtypesbeyondthesefourpredefinedcategories,
over, compared to most training-based methods, KELGoP-rel providingabroadertestbedforevaluatingourframework’sgen-
| achieves | comparable | or  | superior | performance | without | extra |     |     |     |     |     |     |
| -------- | ---------- | --- | -------- | ----------- | ------- | ----- | --- | --- | --- | --- | --- | --- |
eralizationability.Theperformanceofreasoning-basedvariants
trainingorfine-tuning.Thisshowstherobustnessofourframe- of our framework and baselines is shown in Table II. Both
workinKGQAwhilereducingtrainingcosts.
|     |     |     |     |     |     |     | variants achieve | significant | improvements |     | over LLM | prompt- |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | ----------- | ------------ | --- | -------- | ------- |
Tofurtherevaluatethegeneralizabilityofourframework,we ing methods that lack KG support, including IO, CoT, and
conduct experiments on GrailQA, which also contains com- CoT+SC, with KELGoP-rel achieving the best performance
| plex questions | that | require | multi-step | reasoning, | but | without |               |                 |          |       |             |         |
| -------------- | ---- | ------- | ---------- | ---------- | --- | ------- | ------------- | --------------- | -------- | ----- | ----------- | ------- |
|                |      |         |            |            |     |         | among all     | reasoning-based | methods. | These | demonstrate | that    |
|                |      |         |            |            |     |         | our framework | effectively     | enhances | LLM   | reasoning   | with KG |
1https://huggingface.co/sentence-transformers/msmarco-distilbert-base-v3 on complex questions across datasets, outperforming existing
2https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-12-v2 state-of-the-artmethods.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

744 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.38,NO.2,FEBRUARY2026
TABLEIII
PERFORMANCE(EMINPERCENT)OFOURFRAMEWORKANDLLM
PROMPTINGBASELINESONQUESTIONSOFDIFFERENTCATEGORIESINCWQ
E. PerformanceonDifferentCategories
CWQannotatesagoldlabelforeachquestion’scategoryof
reasoningpattern.TableIIIshowstheperformanceofourframe-
Fig.4. Performance(EMinpercent)ofourframeworkondifferentLLMs.
| work and | LLM prompting | baselines | across various | categories |     |     |     |     |
| -------- | ------------- | --------- | -------------- | ---------- | --- | --- | --- | --- |
annotatedinCWQ.
TABLEIV
| Among | the four categories, | our framework |     | performs sig- |     |     |     |     |
| ----- | -------------------- | ------------- | --- | ------------- | --- | --- | --- | --- |
ABLATIONSTUDYRESULTS(EMINPERCENT)OFOURFRAMEWORK
| nificantly       | better on comparative, | composition, |            | and conjunc-    |     |     |     |     |
| ---------------- | ---------------------- | ------------ | ---------- | --------------- | --- | --- | --- | --- |
| tion questions   | than on superlative    | questions.   | We         | consider that   |     |     |     |     |
| this discrepancy | arises because         | superlative  | questions  | require         |     |     |     |     |
| comparing        | many entities          | by a numeric | attribute. | However,        |     |     |     |     |
| KELGoP-tri       | and KELGoP-rel         | provide      | limited    | reference facts |     |     |     |     |
inKGsearching,ofteninsufficientforsuchcomparisons.And
inKELGoP-gnn,theKGsearcherweuse[6]excludesnumeric
| entities during | the PRN-based        | candidate | extraction  | step. This |     |     |     |     |
| --------------- | -------------------- | --------- | ----------- | ---------- | --- | --- | --- | --- |
| limitation      | in the preprocessing | stage,    | rather than | in the GNN |     |     |     |     |
itself,makesitimpossibleforsubsequentstepstoretrievenec-
| essary numeric | attributes. | Consequently, | they result | in lower |     |     |     |     |
| -------------- | ----------- | ------------- | ----------- | -------- | --- | --- | --- | --- |
accuracyforsuperlativequestions.Apotentialenhancementisto
incorporateKGschemainformationintothesearchingprocess,
enablingthemodeltoidentifynumericaggregationorcompar-
isonscenariosandtojointlyquerythesamenumericattributes
|     |     |     |     |     | reasoning | patterns. They are | more likely to output | the [suf- |
| --- | --- | --- | --- | --- | --------- | ------------------ | --------------------- | --------- |
across multiple entities. During retrieval, lightweight aggrega- ficient] label in the Integrator, thus missing opportunities
tionorfilteringoperationssuchasMAX,MIN,orrange-based tocorrectmistakesbyswitchingtonewreasoningpatterns.
| constraints | can be introduced | to ensure | that relevant | numeric |     |     |     |     |
| ----------- | ----------------- | --------- | ------------- | ------- | --- | --- | --- | --- |
factsareretrievedwithinthelimitednumberofreferencefacts. G. AblationStudy
|     |     |     |     |     | To evaluate | the contribution | of each individual | strategy in |
| --- | --- | --- | --- | --- | ----------- | ---------------- | ------------------ | ----------- |
F. PerformanceonDifferentLLMs
|     |     |     |     |     | KELGoP, | we conduct ablation | study by removing | them one |
| --- | --- | --- | --- | --- | ------- | ------------------- | ----------------- | -------- |
We evaluate our proposed framework with different LLMs, by one. w/o adaptive strategy means there is no opportunity
includingQwen2.5-7B[55],Llama-3.1-8B[56],gpt-3.5-turbo- toreselectthereasoningpattern.Onthisbasis,w/ofine-grained
0125 [53], and gpt-4o-2024-11-20 [57]. The results are pre- categorizationremovesthesecond-stageofClassifier,applying
sentedinFig.4. thesamedecompositionexamplesthatcoverallfourreasoning
ComparedwiththeIOpromptingmethodthatrepresentsthe patternstoallcomplexquestions.w/odecompositionremoves
originalfew-shotperformanceofLLMs,allthreevariantsofour theClassifierentirely,treatingallquestionsassimpleandsolv-
KELGoPshowsignificantimprovementswithdifferentLLMs. ingthemsolelywiththeAtomicQuestionAnswerer.
Thisdemonstratesthattheproposedframeworkcanstablyand TheablationstudyresultsfordifferentvariantsofKELGoP
substantially enhance the reasoning ability of various LLMs. areshowninTableIV.Consideringtheresultsincolumn“Com-
ComparingtheperformanceofdifferentLLMsoneachvariant plexProportion”ofTableV,weobservethatonCWQ,wherethe
of KELGoP, we find that in most cases, GPT-4 performs the averagecomplexityofquestionsisthehighest,theoverallaccu-
best,followedbyGPT-3.5,withLlama-3.1andQwen-2.5show- racytendstodecreaseasmorestrategiesareremovedfromthe
ing slightly weaker performance. One possible reason is that, framework,indicatingthatmoststrategiescontributepositively
comparedtoGPT-4andGPT-3.5,Llama-3.1andQwen-2.5not to performance. An exception is observed with KELGoP-gnn,
onlyhaveweakerreasoningcapabilities,butalsoattemptfewer where coarse-grained decomposition leads to a performance
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

LIetal.:FRAMEWORKOFKNOWLEDGEGRAPH-ENHANCEDLARGELANGUAGEMODELBASEDONGLOBALPLANNING 745
TABLEV
EFFICIENCYANALYSISOFOURFRAMEWORK
| drop, as    | its GNN-based |                | KG        | retriever          | is trained     |          | on original |     |     |     |     |
| ----------- | ------------- | -------------- | --------- | ------------------ | -------------- | -------- | ----------- | --- | --- | --- | --- |
| questions   | and           | less effective |           | for sub-questions. |                | However, | this        |     |     |     |     |
| performance | gap           | is             | recovered | and                | even surpassed |          | by intro-   |     |     |     |     |
| ducing      | fine-grained  | categorization |           |                    | and the        | adaptive | strategy.   |     |     |     |     |
Ourstrategiesarenaturallymoresuitableforhandlingcomplex
questions.OnWebQSP,wheremostquestionsaresimple,they
| may misclassify |             | simple | questions |          | as complex | and          | introduce    |     |     |     |     |
| --------------- | ----------- | ------ | --------- | -------- | ---------- | ------------ | ------------ | --- | --- | --- | --- |
| unnecessary     | steps       | and    | potential | errors   | that       | hurt overall | perfor-      |     |     |     |     |
| mance.          | On GrailQA, |        | where     | question | complexity |              | is moderate, |     |     |     |     |
moststrategiesimprovetheperformancenoticeably.Although
limitingthefine-grainedcategorizationtooneattemptcausesa
performancedecline,addingtheadaptivestrategysubstantially
enhancestheoverallperformancetoahigherlevel.
EffectsofMaximumAttemptsθoftheFine-Grained
H.
Categorization Fig.5. Experimentalresultswithdifferentmaximumnumbersofattempts.
LLM-IO-LenistheaveragetotallengthofLLMinputandoutputtokensforall
| Inouradaptivestrategy,themaximumnumberofattemptsθ |     |     |     |     |     |     |     | questions. |     |     |     |
| ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- |
determineshowmanydifferentcategoriesofreasoningpatterns
| are allowed | to  | be explored |     | when solving | a   | complex | question, |     |     |     |     |
| ----------- | --- | ----------- | --- | ------------ | --- | ------- | --------- | --- | --- | --- | --- |
However,sincethequestionsinWebQSParerelativelysim-
ratherthantheactualnumberofattemptsusedduringreasoning.
|     |     |     |     |     |     |     |     | ple, the fine-grained | categorization | and adaptive | strategy are |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------- | -------------- | ------------ | ------------ |
Withfourcategoriesintotal,θrangesfrom1to4.Weevaluate
rarelytriggered.Asaresult,theaccuraciesofKELGoPvariants
| the performance |     | of our | framework |     | under various |     | settings of | θ   |     |     |     |
| --------------- | --- | ------ | --------- | --- | ------------- | --- | ----------- | --- | --- | --- | --- |
onWebQSPdonotexhibitaconsistenttrendwithvaringθ.
onWebQSPandCWQ,withresultsinFig.5.
Asthemaximumallowedattemptsθincreases,theIOcontent
EffectsoftheRetainedKGFactsNumberk
|        |           |       |         |          |     |              |      | I.  |     |     | rr inReferences |
| ------ | --------- | ----- | ------- | -------- | --- | ------------ | ---- | --- | --- | --- | --------------- |
| of LLM | naturally | grows | longer. | However, |     | the accuracy | does |     |     |     |                 |
not continuously improve with higher θ, and the overall EM Forourreasoning-basedvariants,thenumberk offactsre-
rr
typicallypeaksatθ =3.OnCWQ,despiteitscomplexity,most tainedafterrerankinginKGsearchcorrespondstothenumberof
questions do not require too many reasoning attempts. When referencesprovidedtoLLMintheAtomicQuestionAnswerer.
θ =3,theaverageactualattemptspercomplexquestioninCWQ The results for different k values on WebQSP and CWQ
rr
areonly1.43,1.35,and1.30forKELGoP-tri,KELGoP-rel,and are shown in Fig. 6. As the number of references grows, KG
KELGoP-gnn,respectively.Settingθtoohighmaypreventthe searching accuracy steadily improves. However, this does not
frameworkfromeffectivelycurbingtheexcessiveself-doubtof resultinacontinuousincreaseinoverallaccuracy.KELGoP-tri
LLM, leading to unnecessary re-selection of less appropriate andKELGoP-relachievedthebestoverallEMonbothdatasets
reasoning patterns and increased errors. To further verify the whenk wassetto10and13,respectively.Furtherincreasing
rr
k
reliability of the adaptive mechanism itself, we manually ex- rr notonlyleadstolongerLLMinputpromptsbutalsocauses
aminethesufficiencyjudgmentofLLMbasedontheresultsof adecreaseinoverallaccuracy.
KELGoP-relonCWQ.Among151sufficiencydecisionsfrom That is, additional correct references are not utilized by the
100randomlysampledcomplexquestions,thecorrectnessrate LLM effectively and may even cause a decline in overall per-
reaches 90.1%, indicating that the sufficiency assessment of formance. We suspect this is due to the issue of information
LLMisgenerallydependableasthecoresignalofouradaptive dilution. Although excessive references increase the probabil-
strategy. ity of including correct KG facts, thereby boosting retrieval
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

746 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.38,NO.2,FEBRUARY2026
Fig.6. Experimentalresultsunderdifferentfactsnumbersinreferences.EM-RrepresentstheaccuracyoftheKGsearchingintheframework.LLM-Input-Len
istheaveragelengthofLLMinputtokensforallquestions.
accuracy, an excessively long prompt may cause the LLM to V. CONCLUSION
unevenlydistributeitsattention.Thiscanresultinreducedfocus
|     |     |     |     |     |     |     |     | This study | introduces | a   | framework | of  | KG-enhanced | LLM |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ---------- | --- | --------- | --- | ----------- | --- |
onthecoreinformationofthequestion.Moreover,anoverload
|               |     |       |     |        |      |      |             | based on | global planning, |     | called KELGoP. |     | We propose | fine- |
| ------------- | --- | ----- | --- | ------ | ---- | ---- | ----------- | -------- | ---------------- | --- | -------------- | --- | ---------- | ----- |
| of references | may | cause | the | LLM to | rely | more | on external |          |                  |     |                |     |            |       |
grainedquestioncategorizationbasedonreasoningpatternsand
informationandlessonitsinternalreasoning,therebylimiting
|                            |             |     |              |      |       |         |            | corresponding  | category-driven |              | question | decomposition, |        | which  |
| -------------------------- | ----------- | --- | ------------ | ---- | ----- | ------- | ---------- | -------------- | --------------- | ------------ | -------- | -------------- | ------ | ------ |
| its reasoning              | capability. |     | Ultimately,  | this | leads | to a    | decrease   | in             |                 |              |          |                |        |        |
|                            |             |     |              |      |       |         |            | make reasoning | more            | controllable |          | and enable     | atomic | KG re- |
| overall question-answering |             |     | performance. |      | To    | further | illustrate |                |                 |              |          |                |        |        |
trieval.Additionally,weproposeanadaptivestrategyforreason-
thiseffect,weprovideanexampleinAppendixGshowinghow
ingpatternselection,whichadjustaccordingtotheperformance
| differentvaluesofk |     | affecttheoverallaccuracy. |     |     |     |     |     |                                                          |                                |     |     |     |     |           |
| ------------------ | --- | ------------------------- | --- | --- | --- | --- | --- | -------------------------------------------------------- | ------------------------------ | --- | --- | --- | --- | --------- |
|                    |     | rr                        |     |     |     |     |     | ofreasoningtoensureflexibilityandrobustness.Furthermore, |                                |     |     |     |     |           |
|                    |     |                           |     |     |     |     |     | we introduce                                             | retrieval-then-reranking-based |     |     |     | and | GNN-based |
J. EfficiencyAnalysis KGsearchingstrategiestoperformefficientatomic-levelsearch-
|       |            |     |            |          |     |        |          | ing. Experimental | results | show | that | our KELGoP |     | outperforms |
| ----- | ---------- | --- | ---------- | -------- | --- | ------ | -------- | ----------------- | ------- | ---- | ---- | ---------- | --- | ----------- |
| Table | V presents | an  | efficiency | analysis |     | of the | proposed |                   |         |      |      |            |     |             |
thestate-of-the-artbaselines.
framework.Theaveragetimecostperquestionforrunningthe
|                 |     |              |        |     |          |         |         | In future | work, we | will | try to | explore | more accurate | and |
| --------------- | --- | ------------ | ------ | --- | -------- | ------- | ------- | --------- | -------- | ---- | ------ | ------- | ------------- | --- |
| entire pipeline |     | of different | KELGoP |     | variants | on each | dataset |           |          |      |        |         |               |     |
efficientKGretrievalstrategiesthatbetterintegratethestructural
isreportedinthe“TotalTime”column.Thereasoningtimeof
andtextualfeaturesoftheKGtosupportthereasoningprocess.
| KELGoP | mainly | depends | on  | the complexity |     | of questions, | the |     |     |     |     |     |     |     |
| ------ | ------ | ------- | --- | -------------- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
Additionally,weplantoinvestigatemethodsthatcanadapttoa
timespentonKGsearching,andthenumberofLLMcalls. widerrangeofquestioncomplexities,inordertofurtherextend
Asshowninthe“ComplexProportion”columnofTableV,
andimproveourframework.
| CWQ has  | the         | highest proportion |         | of    | questions | categorized | as       |     |     |     |     |     |     |     |
| -------- | ----------- | ------------------ | ------- | ----- | --------- | ----------- | -------- | --- | --- | --- | --- | --- | --- | --- |
| complex, | followed    | by GrailQA,        |         | while | most      | questions   | in We-   |     |     |     |     |     |     |     |
| bQSP are | categorized | as                 | simple. | This  | indicates | that        | a larger |     |     |     |     |     |     |     |
proportionofquestionsinCWQrequireusingmodulesinclud- REFERENCES
ingtheFineClassifier,DecomposerandIntegrator,resultingin [1] S.Pan,L.Luo,Y.Wang,C.Chen,J.Wang,andX.Wu,“Unifyinglarge
morerequirementsofLLMcallsandKGsearching.Thisleads languagemodelsandknowledgegraphs:Aroadmap,”IEEETrans.Knowl.
DataEng.,vol.36,no.7,pp.3580–3599,Jul.2024.
tosignificantlyhighervaluesintermsoftheaveragenumberof
[2] Z.Jietal.,“Surveyofhallucinationinnaturallanguagegeneration,”ACM
LLMcalls,LLMinputandoutputtokens,andtheaveragetime Comput.Surv.,vol.55,no.12,pp.1–38,Mar.2023.
forKGsearchingandoverallreasoningonCWQcomparedto [3] X. Zhang et al., “GreaseLM: Graph REASoning enhanced lan-
|     |     |     |     |     |     |     |     | guage | models,” in | Proc. | Int. Conf. | Learn. | Representations, | 2022, |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | ----------- | ----- | ---------- | ------ | ---------------- | ----- |
thoseonotherdatasets.
pp.24765–24780.
FordifferentvariantsofKELGoP,KELGoP-relrequiressig-
[4] L.Hu,Z.Liu,Z.Zhao,L.Hou,L.Nie,andJ.Li,“Asurveyofknowledge
enhancedpre-trainedlanguagemodels,”IEEETrans.Knowl.DataEng.,
nificantlymoreLLMinputtokens.Thisisbecauseitsrelation-
vol.36,no.4,pp.1413–1430,Apr.2024.
basedsearchingstrategyobtainsKGfactsthatincludealltarget
[5] L.Luo,Y.-F.Li,R.Haf,andS.Pan,“Reasoningongraphs:Faithfuland
| entities | linked | through | a relation | chain | from | the topic | entity, |     |     |     |     |     |     |     |
| -------- | ------ | ------- | ---------- | ----- | ---- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- |
interpretablelargelanguagemodelreasoning,”inProc.Int.Conf.Learn.
which leads to longer references in LLM input prompts of Representations,2024,pp.34088–34111.
[6] C.MavromatisandG.Karypis,“GNN-RAG:Graphneuralretrievalfor
| the Atomic | Question | Answerer. |     | However, |     | compared | to the |     |     |     |     |     |     |     |
| ---------- | -------- | --------- | --- | -------- | --- | -------- | ------ | --- | --- | --- | --- | --- | --- | --- |
efficientlargelanguagemodelreasoningonknowledgegraphs,”inProc.
triple/quadruple-based strategy, the relation-based strategy re- Annu.MeetingAssoc.Comput.Linguistics,2025,pp.16682–16699.
ducesthenumberofcandidatefactsbyretrievingattherelation [7] M. Li, S. Miao, and P. Li, “Simple is effective: The roles of
level. This makes KELGoP-rel faster in KG searching, which graphs and large language models in knowledge-graph-based retrieval-
|     |     |     |     |     |     |     |     | augmented | generation,” | in  | Proc. Int. | Conf. | Learn. Representations, |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | --- | ---------- | ----- | ----------------------- | --- |
inturnshortensitstotalreasoningtimecomparedtoKELGoP- 2025,pp.49797–49825.
tri. KELGoP-gnn performs fastest in KG searching, as GNN [8] J.Jiang,K.Zhou,Z.Dong,K.Ye,W.X.Zhao,andJ.-R.Wen,“StructGpt:
Ageneralframeworkforlargelanguagemodeltoreasonoverstructured
reasoning is more efficient than sequential filtering by the re- data,” in Proc. Conf. Empirical Methods Nat. Lang. Process., 2023,
| trieverandreranker. |     |     |     |     |     |     |     | pp.9237–9251. |     |     |     |     |     |     |
| ------------------- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.

LIetal.:FRAMEWORKOFKNOWLEDGEGRAPH-ENHANCEDLARGELANGUAGEMODELBASEDONGLOBALPLANNING 747
[9] J.Sunetal.,“Think-on-graph:Deepandresponsiblereasoningoflarge [34] H.Sun,B.Dhingra,M.Zaheer,K.Mazaitis,R.Salakhutdinov,andW.
languagemodelonknowledgegraph,”inProc.Int.Conf.Learn.Repre- Cohen,“Opendomainquestionansweringusingearlyfusionofknowledge
sentations,2024,pp.14199–14229. basesandtext,”inProc.Conf.EmpiricalMethodsNaturalLang.Process.,
[10] J.Jiangetal.,“KG-Agent:Anefficientautonomousagentframeworkfor 2018,pp.4231–4242.
complexreasoningoverknowledgegraph,”inProc.Annu.MeetingAssoc. [35] H.Sun,T.Bedrax-Weiss,andW.Cohen,“PullNet:Opendomainquestion
Comput.Linguistics,2025,pp.9505–9523. answeringwithiterativeretrievalonknowledgebasesandtext,”inProc.
[11] L.Yang,H.Chen,Z.Li,X.Ding,andX.Wu,“Giveusthefacts:Enhancing EmpiricalMethodsNaturalLang.Process.,9thInt.JointConf.Natural
largelanguagemodelswithknowledgegraphsforfact-awarelanguage Lang.Process.,2019,pp.2380–2390.
modeling,”IEEETrans.Knowl.DataEng.,vol.36,no.7,pp.3091–3110, [36] G.He,Y.Lan,J.Jiang,W.X.Zhao,andJ.-R.Wen,“Improvingmulti-hop
Jul.2024. knowledge base question answering by learning intermediate supervi-
[12] Y. Xu et al., “Generate-on-graph: Treat LLM as both agent and KG sionsignals,”inProc.ACMInt.Conf.WebSearchDataMining,2021,
for incomplete knowledge graph question answering,” in Proc. Conf. pp.553–561.
EmpiricalMethodsNat.Lang.Process.,2024,pp.18410–18430. [37] J.Shi,S.Cao,L.Hou,J.Li,andH.Zhang,“TransferNet:Aneffective
[13] G. Xiong, J. Bao, and W. Zhao, “Interactive-KBQA: Multi-turn inter- andtransparentframeworkformulti-hopquestionansweringoverrelation
actions for knowledge base question answering with large language graph,”inProc.Conf.EmpiricalMethodsNaturalLang.Process.,2021,
models,” in Proc. Annu. Meeting Assoc. Comput. Linguistics, 2024, pp.4149–4158.
pp.10561–10582. [38] J.Zhangetal.,“Subgraphretrievalenhancedmodelformulti-hopknowl-
[14] Y. Li et al., “A framework of knowledge graph-enhanced large lan- edgebasequestionanswering,”inProc.Annu.MeetingAssoc.Comput.
guagemodelbasedonquestiondecompositionandatomicretrieval,”in Linguistics.,2022,pp.5773–5784.
Proc.Conf.EmpiricalMethodsNaturalLang.Process.Findings,2024, [39] J. Jiang, K. Zhou, X. Zhao, and J.-R. Wen, “UniKGQA: Unified re-
pp.11472–11485. trieval and reasoning for solving multi-hop question answering over
[15] W.-t.Yih,M.Richardson,C.Meek,M.-W.Chang,andJ.Suh,“Thevalue knowledge graph,” in Proc. Int. Conf. Learn. Representations, 2023,
ofsemanticparselabelingforknowledgebasequestionanswering,”in pp.34362–34377.
Proc.Annu.MeetingAssoc.ComputLinguistics.,2016,pp.201–206. [40] J. Jiang, K. Zhou, W. X. Zhao, Y. Li, and J.-R. Wen, “Reasoninglm:
[16] A.TalmorandJ.Berant,“Thewebasaknowledge-baseforanswering Enablingstructuralsubgraphreasoninginpre-trainedlanguagemodels
complexquestions,”inProc.Conf.NorthAmer.ChapterAssoc.Comput. forquestionansweringoverknowledgegraph,”inProc.Conf.Empirical
Linguist.,Hum.Lang.Technol.,2018,pp.641–651. MethodsNaturalLang.Process.,2023,pp.3721–3735.
[17] Y. Gu et al., “Beyond IID: Three levels of generalization for question [41] L. Luo, Z. Zhao, G. Haffari, Y.-F. Li, C. Gong, and S. Pan, “Graph-
answeringonknowledgebases,”inProc.WorldWideWebConf.,2021, constrained reasoning: Faithful reasoning on knowledge graphs with
pp.3477–3488. large language models,” in Proc. 42nd Int. Conf. Mach. Learn., 2025,
[18] T.Brown,“Languagemodelsarefew-shotlearners,”inProc.Adv.Neural pp.41540–41565.
Inf.Process.Syst.,2020,vol.33,pp.1877–1901. [42] S. Cheng et al., “Call me when necessary: LLMS can efficiently and
[19] J. Wei et al., “Chain-of-thought prompting elicits reasoning in large faithfullyreasonoverstructuredenvironments,”inProc.Annu.Meeting
languagemodels,”inProc.Adv.NeuralInf.Process.Syst.,2022,vol.35, Assoc.Comput.Linguistics.,2024,pp.4275–4295.
pp.24824–24837,2022. [43] X.Tan,X.Wang,Q.Liu,X.Xu,X.Yuan,andW.Zhang,“Paths-over-
[20] S.Yaoetal.,“Treeofthoughts:Deliberateproblemsolvingwithlarge graph:Knowledgegraphempoweredlargelanguagemodelreasoning,”in
languagemodels,”inProc.Adv.NeuralInf.Process.Syst.,2023,vol.36, Proc.WorldWideWebConf.,2025,pp.3505–3522.
pp.11809–11822. [44] L.Chen,P.Tong,Z.Jin,Y.Sun,J.Ye,andH.Xiong,“Plan-on-graph:
[21] M.Bestaetal.,“Graphofthoughts:Solvingelaborateproblemswithlarge Self-correctingadaptiveplanningoflargelanguagemodelonknowledge
languagemodels,”inProc.AAAIConf.Artif.Intell.,Mar.2024,vol.38, graphs,”inProc.Adv.NeuralInf.Process.Syst,2024,pp.37665–37691.
no.16,pp.17682–17690. [45] H.Luoetal.,“KBQA-o1:Agenticknowledgebasequestionanswering
[22] X. Wang et al., “Self-consistency improves chain of thought reason- withMonteCarlotreesearch,”inProc.42ndInt.Conf.Mach.Learn.,
ing in language models,” in Proc. Int. Conf. Learn. Representations, 2025,pp.41177–41199.
2023,pp.12648–12671. [46] R. Andersen, F. Chung, and K. Lang, “Local graph partitioning using
[23] L.Wangetal.,“Plan-and-solveprompting:Improvingzero-shotchain-of- Pagerankvectors,”inProc.Annu.IEEESymp.Found.Comput.Sci.,2006,
thoughtreasoningbylargelanguagemodels,”inProc.Annu.Meet.Assoc. pp.475–486.
ComputLinguistics.,2023,pp.2609–2634. [47] K. Bollacker, C. Evans, P. Paritosh, T. Sturge, and J. Taylor, “Free-
[24] X.Ning,Z.Lin,Z.Zhou,Z.Wang,H.Yang,andY.Wang,“Skeleton-of- base: A collaboratively created graph database for structuring human
thought:PromptingLLMsforefficientparallelgeneration,”inProc.Int. knowledge,” in Proc. ACM SIGMOD Int. Conf. Manage. Data, 2008,
Conf.Learn.Representations,2024,pp.44032–44082. pp.1247–1250.
[25] A.Madaanetal.,“Self-refine:Iterativerefinementwithself-feedback,”in [48] Y.LanandJ.Jiang,“Querygraphgenerationforansweringmulti-hop
Proc.Adv.NeuralInf.Process.Syst.,2023,vol.36,pp.46534–46594. complexquestionsfromknowledgebases,”inProc.Annu.MeetingAssoc.
[26] N.Miao,Y.W.Teh,andT.Rainforth,“SelfCheck:UsingLLMstozero- Comput.Linguistics,2020,pp.969–974.
shotchecktheirownstep-by-stepreasoning,”inProc.Int.Conf.Learn. [49] T.Li,X.Ma,A.Zhuang,Y.Gu,Y.Su,andW.Chen,“Few-shotin-context
Representations,2024,pp.1225–1240. learningonknowledgebasequestionanswering,”inProc.Annu.Meeting.
[27] S.Yaoetal.,“React:Synergizingreasoningandactinginlanguagemod- Assoc.Comput.Linguistics.,2023,pp.6966–6980.
els,”inProc.Int.Conf.Learn.Representations,2023,pp.30084–30116. [50] A.Saxena,A.Tripathi,andP.Talukdar,“Improvingmulti-hopquestion
[28] K. Wang et al., “Knowledge-driven cot: Exploring faithful reason- answeringoverknowledgegraphsusingknowledgebaseembeddings,”in
ing in LLMS for knowledge-intensive question answering,” 2023, Proc.Annu.MeetingAssoc.Comput.Linguistics,2020,pp.4498–4507.
arXiv:2308.13259. [51] A.Saxena,A.Kochsiek,andR.Gemulla,“Sequence-to-sequenceknowl-
[29] Y. Sun, L. Zhang, G. Cheng, and Y. Qu, “SPARQA: Skeleton-based edgegraphcompletionandquestionanswering,”inProc.Annu.Meeting
semanticparsingforcomplexquestionsoverknowledgebases,”inProc. Assoc.Comput.Linguistics,2022,pp.2814–2828.
AAAIConf.Artif.Intell.,Apr.2020,vol.34,no.05,pp.8952–8959. [52] Y.Shuetal.,“Tiara:Multi-grainedretrievalforrobustquestionanswering
[30] L. Zhang et al., “FC-KBQA: A fine-to-coarse composition framework overlargeknowledgebase,”inProc.Conf.EmpiricalMethodsNatural
forknowledgebasequestionanswering,”inProc.Annu.MeetingAssoc. Lang.Process.,2022,pp.8108–8121.
ComputLinguistics,2023,pp.1002–1017. [53] “OpenAI, Introducing chatGPT,” 2022. [Online]. Available: https://
[31] Y.Tianetal.,“AugmentingreasoningcapabilitiesofLLMSwithgraph openai.com/index/chatgpt
structuresinknowledgebasequestionanswering,”inProc.Conf.Empir- [54] B.Z.Li,S.Min,S.Iyer,Y.Mehdad,andW.-t.Yih,“Efficientone-pass
icalMethodsNaturalLang.Process.,Findings,2024,pp.11967–11977. end-to-endentitylinkingforquestions,”inProc.Conf.EmpiricalMethods
[32] D.Yuetal.,“DecAF:Jointdecodingofanswersandlogicalformsfor NaturalLang.Process.,2020,pp.6433–6441.
question answering over knowledge bases,” in Proc. Int. Conf. Learn. [55] A.Yangetal.,“Qwen2.5technicalreport,”2024,arXiv:2412.15115.
Representations,2023,pp.10518–10535. [56] A. Grattafiori et al., “The llama 3 herd of models,” 2024,
[33] A.Miller,A.Fisch,J.Dodge,A.-H.Karimi,A.Bordes,andJ.Weston, arXiv:2407.21783.
“Key-valuememorynetworksfordirectlyreadingdocuments,”inProc. [57] “OpenAI,GPT-4,”2023.[Online].Available:https://openai.com/index/
Conf.EmpiricalMethodsNaturalLang.Process.,2016,pp.1400–1409. gpt-4-research
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore. Restrictions apply.

748 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.38,NO.2,FEBRUARY2026
Yading Li received the bachelor’s degree in 2024 Hao Wang is currently working toward the PhD
from the Beijing Institute of Technology, Beijing, degreewiththeBeijingEngineeringResearchCenter
China, where she is currently working toward the of High Volume Language Information Processing
master’s degree with the School of Computer Sci- andCloudComputingApplication,SchoolofCom-
enceandTechnology.Herresearchinterestsinclude puter Science and Technology, Beijing Institute of
largelanguagemodelsandknowledgegraphquestion Technology,Beijing,China.Hisresearchinterestsin-
| answering. |     |     | cludeknowledgegraphembedding,knowledgegraph |     |     |
| ---------- | --- | --- | ------------------------------------------- | --- | --- |
completion,andgraphlearning.
ChangzhiZhoureceivedthebachelor’sdegreefrom
DandanSongreceivedtheBEandPhDdegreesfrom theShandongUniversityofScienceandTechnology,
Shandong,China,in2020.Heiscurrentlyworking
theDepartmentofComputerScienceandTechnol-
towardthePhDdegreewiththeBeijingInstituteof
| ogy, Tsinghua | University, Beijing, | China, in 2004      |             |                     |                    |
| ------------- | -------------------- | ------------------- | ----------- | ------------------- | ------------------ |
|               |                      |                     | Technology, | Beijing, China. His | research interests |
| and 2009,     | respectively. She is | currently a tenured |             |                     |                    |
includelargelanguagemodelsandnaturallanguage
professorwiththeSchoolofComputerScienceand
| Technology,BeijingInstituteofTechnology.Herre- |     |     | processing. |     |     |
| ---------------------------------------------- | --- | --- | ----------- | --- | --- |
searchinterestsincludeknowledgegraph,knowledge
enhancedlargelanguagemodels,anddatamining.
ShuhaoZhang(Member,IEEE)receivedthebache-
lor’sdegreefromNanyangTechnologicalUniversity
(NTU),andthePhDdegreefromtheNationalUni-
YuhangTianreceivedthebachelor’sdegreein2021
versityofSingapore.Hewasanassistantprofessor
| from the | Beijing Institute of | Technology, Beijing, |                  |              |                   |
| -------- | -------------------- | -------------------- | ---------------- | ------------ | ----------------- |
|          |                      |                      | with the College | of Computing | and Data Science, |
China,whereheiscurrentlyworkingtowardthePhD
|     |     |     | NTU. From | 2020 to 2021, he | was a postdoctoral |
| --- | --- | --- | --------- | ---------------- | ------------------ |
degreeincomputerscience.Hisresearchinterestsin- Researcher with Prof. Volker Markl at Technische
cludeknowledgebasequestionansweringandtheory UniversitätBerlin.Heiscurrentlyaprofessorwith
ofmind-enhanceddialogue.
|     |     |     | the School | of Computer Science | and Technology, |
| --- | --- | --- | ---------- | ------------------- | --------------- |
HuazhongUniversityofScienceandTechnology.His
researchinterestsincludeparalleldatabasesystems,
largelanguagemodelinferenceframeworks,andtheirintegrationwithstream
processingtechniques.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 10:34:08 UTC from IEEE Xplore.  Restrictions apply.