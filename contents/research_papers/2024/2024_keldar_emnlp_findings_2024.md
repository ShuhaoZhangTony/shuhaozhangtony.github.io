| A Framework |       |                        | of Knowledge |     | Graph-Enhanced              |     |     | Large  |     | Language  |     | Model |     |
| ----------- | ----- | ---------------------- | ------------ | --- | --------------------------- | --- | --- | ------ | --- | --------- | --- | ----- | --- |
|             | Based |                        | on Question  |     | Decomposition               |     | and | Atomic |     | Retrieval |     |       |     |
|             |       | YadingLi1,DandanSong1* |              |     | ,ChangzhiZhou1,YuhangTian1, |     |     |        |     |           |     |       |     |
HaoWang1,ZiyiYang2,ShuhaoZhang3
1SchoolofComputerScienceandTechnology,BeijingInstituteofTechnology,China.
2SchoolofCyberspaceScienceandTechnology,BeijingInstituteofTechnology,China.
3CollegeofComputingandDataScience,NanyangTechnologicalUniversity,Singapore.
{liyading,sdd,zhou_changzhi97,tianyuhang,wanghao,yziyi}@bit.edu.cn;
shuhao.zhang@ntu.edu.sg
|     |     | Abstract |     |     |     | the | evaluation |     | of KG-enhanced |     |     | LLM methods, |     |
| --- | --- | -------- | --- | --- | --- | --- | ---------- | --- | -------------- | --- | --- | ------------ | --- |
knowledgegraphquestionanswering(KGQA)is
| Knowledge |     | graphs | (KGs) | can | provide ex- |     |     |     |     |     |     |     |     |
| --------- | --- | ------ | ----- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
animportanttaskaimingtoanswergivenquestions
plainablereasoningforlargelanguagemodels
(LLMs),alleviatingtheirhallucinationproblem. basedonfactualknowledgeinKG.
|     |     |     |     |     |     | Previous |     | works | on  | KG-enhanced |     | LLM | for |
| --- | --- | --- | --- | --- | --- | -------- | --- | ----- | --- | ----------- | --- | --- | --- |
Knowledgegraphquestionanswering(KGQA)
isatypicalbenchmarktoevaluatethemethods KGQAproposedretrieve-then-answermethodsaid-
enhancingLLMswithKG.Previousmethods
ingLLMwithKGretrievalinasingleroundinter-
| on KG-enhanced |     | LLM | for | KGQA | either en- |     |     |     |     |     |     |     |     |
| -------------- | --- | --- | --- | ---- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
actionbetweenLLMandKG,asshowninFigure1
hanceLLMswithKGretrievalinasingleround
|     |     |     |     |     |     | (topleft). |     | Theyretrievequestion-relevantKGfacts, |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ---------- | --- | ------------------------------------- | --- | --- | --- | --- | --- |
orperformmulti-hopKGreasoninginmulti-
whicharethenfedintotheLLMallatonceasref-
| pleroundswithLLMs. |     |     | Bothofthemconduct |     |     |     |     |     |     |     |     |     |     |
| ------------------ | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
retrieving and reasoning based solely on the erencesforanswergenerating(Baeketal.,2023a;
|     |     |     |     |     |     | Senetal.,2023;Wuetal.,2023). |     |     |     |     |     | However,these |     |
| --- | --- | --- | --- | --- | --- | ---------------------------- | --- | --- | --- | --- | --- | ------------- | --- |
wholeoriginalquestion,withoutanyprocess-
ing to the question. To tackle this limitation, methods rely heavily on the KG retrieval results,
weproposeaframeworkofKG-enhancedLLM usingtheLLMonlyasatoolforreasoningbased
basedonquestiondecompositionandatomicre-
onthelogicinretrievalresultsandextractingthefi-
trieval,calledKELDaR.Weintroducequestion
|     |     |     |     |     |     | nalanswerfromthem. |     |     |     | Thislimitstheflexibilityof |     |     |     |
| --- | --- | --- | --- | --- | --- | ------------------ | --- | --- | --- | -------------------------- | --- | --- | --- |
decompositiontreeastheframeworkforLLM
LLMinreasoning(Yangetal.,2023)anddoesn’t
| reasoning. | Thisapproachextractstheimplicit |     |     |     |     |     |     |     |     |     |     |     |     |
| ---------- | ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
fullyleverageitsstrengthsinquestionreasoning.
informationofreasoningstepswithincomplex
|     |     |     |     |     |     | To  | enable | the | LLM | to play | a more | active | role |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | --- | ------- | ------ | ------ | ---- |
questions,servingasaguidetofacilitateatomic
retrievalonKGtargetingtheatomic-levelsim- inreasoning,existingmethodsenablemulti-round
plequestionsatleavesofthetree. Additionally, LLM-KGinteractionforLLMstoperformmulti-
wedesignstrategiesforatomicretrieval,which
hopreasoningonKG,asshowninFigure1(bottom
extractandretrievequestion-relevantKGsub-
left). Startingfromthetopicentitiesofthequestion,
graphstoassistthefew-shotLLMinanswering
|     |     |     |     |     |     | they | prompt | the | LLM | to select | the | most | relevant |
| --- | --- | --- | --- | --- | --- | ---- | ------ | --- | --- | --------- | --- | ---- | -------- |
atomic-levelquestions.ExperimentsonKGQA
|     |     |     |     |     |     | next-hop |     | relations | or  | entities | on KG. | And | iterate |
| --- | --- | --- | --- | --- | --- | -------- | --- | --------- | --- | -------- | ------ | --- | ------- |
datasetsdemonstratethatourframeworkout-
|          |          |                 |     |     |            | this | process | until | LLM | determines |     | that the | chain |
| -------- | -------- | --------------- | --- | --- | ---------- | ---- | ------- | ----- | --- | ---------- | --- | -------- | ----- |
| performs | existing | reasoning-based |     |     | baselines. |      |         |       |     |            |     |          |       |
And in a low-cost setting without additional ofentitiesandrelationsittraversedissufficientto
trainingorfine-tuning,ourframeworkachieves answerthequestion(Jiangetal.,2023a;Sunetal.,
competitive or superior results compared to 2024). However,thesemethodsperformonlyone-
mostexistingtraining-basedbaselines. hopretrievalofrelationsandentitiesonKGduring
|     |     |     |     |     |     | each | round | of  | LLM-KG | interaction, |     | resulting | in  |
| --- | --- | --- | --- | --- | --- | ---- | ----- | --- | ------ | ------------ | --- | --------- | --- |
1 Introduction
|     |     |     |     |     |     | lowefficiency. |     |     | Additionally,eachhop’sretrievalis |     |     |     |     |
| --- | --- | --- | --- | --- | --- | -------------- | --- | --- | --------------------------------- | --- | --- | --- | --- |
To tackle challenges such as interpretability and basedsolelyonthewholeoriginalquestion,with-
| hallucinations | (Ji | et al., | 2023) | in large | language |     |     |     |     |     |     |     |     |
| -------------- | --- | ------- | ----- | -------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
outmakingLLMawareofthespecificsub-question
models(LLMs),somestudies(Zhangetal.,2022b;
|     |     |     |     |     |     | that | needs | to be | addressed | at  | the | current | step for |
| --- | --- | --- | --- | --- | --- | ---- | ----- | ----- | --------- | --- | --- | ------- | -------- |
Wangetal.,2023d)havesoughttoenhanceLLM moretargetedselection.
reasoningusingknowledgegraphs(KGs). These ThemethodsaboveonKG-enhancedLLMfor
| approaches | offer | domain-specific |     |     | and real-time |     |     |     |     |     |     |     |     |
| ---------- | ----- | --------------- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
KGQAareallbasedonoriginalquestionswithout
| knowledge, | aiding | LLMs |     | in performing | inter- |           |     |       |       |            |        |           |     |
| ---------- | ------ | ---- | --- | ------------- | ------ | --------- | --- | ----- | ----- | ---------- | ------ | --------- | --- |
|            |        |      |     |               |        | analyzing |     | their | logic | explicitly | during | reasoning |     |
pretablereasoningandreducinghallucinations. In andKGretrieval. Totacklethislimitation,wedraw
*Correspondingauthor. inspiration from a work training small language
11472
FindingsoftheAssociationforComputationalLinguistics:EMNLP2024,pages11472–11485
November12-16,2024©2024AssociationforComputationalLinguistics

modelsonexplainablequestionanswering(Zhang artreasoning-basedbaselines.
etal.,2023),whichintegrateheterogeneousknowl-
edgesourcesandanalyzethesemanticsofcomplex 2 RelatedWork
questions with question decomposition tree. Our
2.1 LLMPrompting
ideaistointroducethisstructureintoaframework
ofKG-enhancedLLM.Torealizeouridea,weneed TostimulatethereasoningcapabilityofLLMs,var-
totackle twokeyproblems. First, we needtode- iouspromptingstrategieshavebeenproposed. The
signaframeworkcapableofperformingquestion chain-of-thought (CoT) (Wei et al., 2022) is de-
decomposition and enabling atomic retrieval for signedtoenableLLMstoreasonmorereliablyand
atomic-level questions. Second, considering the interpretably. After this, some works (Yao et al.,
shortcomingonefficiencyinpreviousKGretrieval, 2023a;Bestaetal.,2024)furtherintroducedother
it’salsoimportanttodesigntheKGextractingand prompting structures to support LLM reasoning.
retrievingstrategyforatomicretrieval. Others(Wangetal.,2023b;Zhouetal.,2023;Khot
To this end, we propose a Framework of KG- et al., 2023) guide LLMs to generate plans to de-
EnhancedLLMBasedonQuestionDecomposition composetasksandsolvethemstep-by-step. Addi-
and Atomic Retrieval (KELDaR). To excavate tionally,somework(Wangetal.,2023c)improves
the information of reasoning logic in questions, thegreedydecodingstrategyinCoTbysamplinga
weintroducethequestiondecompositiontreeasa setofreasoningpathsfromtheLLMandselecting
frameworkforLLMreasoning,whichclassifiesthe themostconsistentanswer. Inordertotacklethe
questionsaccordingtotheircomplexityandallows problemthatLLMsoftenlackexternalknowledge
complexquestionstobedecomposedintoatreefor andexhibithallucinations,someworks(Yaoetal.,
multi-stepreasoning,enablingatomicretrievalon 2023b;Wangetal.,2023a)combineLLMreason-
KGforcorrespondingsub-questionofeachreason- ing with external knowledge sources, gathering
ingstep. Toimprovetheefficiencyoftheatomic additionalinformationtomitigatethehallucination
retrieval,wefurtherdesignefficientstrategiesfor and error propagation in CoT, thereby producing
extractingandretrievingquestion-relevantKGsub- accurateandreliablereasoning.
graphoffacts,expandingthecandidatesubgraph
2.2 KnowledgeGraphQuestionAnswering
toaprunedtwo-hoprange.
(KGQA)
Toevaluatetheeffectivenessofourframework,
weconductedexperimentsontwocommonlyused Existing works on KGQA can be broadly cate-
KGQAdatasets(Yihetal.,2016;TalmorandBe- gorized into two types: Semantic Parsing (SP)-
rant,2018). Experimentalresultsdemonstratethat based methods and Information Retrieval (IR)-
ourproposedframeworksignificantlyenhancesthe based methods. SP-based methods (Sun et al.,
reasoningperformanceoftheLLM.Ourframework 2020;Chenetal.,2021;Yeetal.,2022)firstparse
outperformsreasoning-basedbaselineswithoutad- the semantics of the input question to transform
ditional training or fine-tuning like us, and even itintoalogicalform(LF)suchasSPARQLorS-
achievescompetitiveorsuperiorresultscompared expression. ThenexecuteLFontheKGtoquery
tomosttraining-basedbaselines. fortheanswer. Toavoidtheinabilitytoobtainan
Ourmaincontributionsareasfollows: answerduetoLFsthatarenotexecutable,DecAF
• Weintroducethequestiondecompositiontree (Yuetal.,2023)combinesthedirectanswerfrom
asaframeworkforLLMreasoning,enabling LLMtogeneratethefinalanswer. IR-basedmeth-
atomicfactretrievalonKGforeachreasoning ods retrieve question-relevant facts from the KG,
step. andthenreasontoanswerthequestionaccordingto
• We design efficient strategies for atomic re- theretrievedfacts. Earlyworks(Milleretal.,2016;
trievaltoextractandretrievequestion-relevant Sunetal.,2018,2019;Heetal.,2021)utilizestruc-
KG subgraph of facts, expanding the candi- tures like key-value memory network and graph
datesubgraphtoaprunedtwo-hoprange. neural network (GNN) to encode the knowledge
• Experimental results demonstrate that our in KG and perform KG reasoning and retrieval.
framework effectively enhances the reason- Someworks(Shietal.,2021;Zhangetal.,2022a;
ing performance of LLMs in a low-cost set- Jiangetal.,2023c,b)leveragepretrainedlanguage
tingwithoutadditionaltrainingorfine-tuning. models(PLMs)fortaskssuchasquestionencod-
Moreover,itoutperformsexistingstate-of-the- ing,KGrelationretrieval,andsemanticmatching
11473

|     | Retrieve-then-Answer |     |     |     |     | KELDaR |     |     |     |     |     |     |
| --- | -------------------- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- |
Question：From which college did the writer of "She's Everything" graduate? Question：From which college did the writer of "She's Everything" graduate?
<   U n n a m e d   >  <  e d u c a ti o n .e d u c a ti o n .i n st it u ti o n   >  <  B e lm o n t   U n iv e r s i ty  >   Question Complexity Classifier         Q   u  e  s  t i o  n           Complex Question Processor
|     | <   Br a d |  P a i sl e y  >  <   m u s i c .c | o m p o s e r .c | o m p o s i ti o n s  >  <  S h | e 's   E v e r yt h i | n g  > |     |     |     |     |     |     |
| --- | ---------- | ---------------------------------- | ---------------- | ------------------------------- | --------------------- | ------ | --- | --- | --- | --- | --- | --- |
< Brad Paisley > < people.person.education > < Unnamed >
|     | KG …… |     |     |     |     | few-shot prompt 1 |     |     | Complex |     |     |     |
| --- | ----- | --- | --- | --- | --- | ----------------- | --- | --- | ------- | --- | --- | --- |
few-shot prompt 2
|                                |     | Question | Answer: Unnamed |     |     |     |                                     |     |     |                                            |     |     |
| ------------------------------ | --- | -------- | --------------- | --- | --- | --- | ----------------------------------- | --- | --- | ------------------------------------------ | --- | --- |
|                                |     |          |                 |     |     |     | Sub-question 1：Who is the writer of |     |     | Sub-question 2：From which college did [#1] |     |     |
|                                |     |          |                 |     |     |     | "She's Everything"?                 |     |     | graduate?                                  |     |     |
| Multi-Round LLM-KG Interaction |     |          |                 |     |     |     |   Question Complexity Classifier    |     |     |                                            |     |     |
  Question Complexity Classifier
Question：From which college did the writer of "She's Everything" graduate? few-shot prompt 1 Simple
|     |          |                                                        |     |     |     |     | few-shot prompt 1            |     | Simple |                              |     |     |
| --- | -------- | ------------------------------------------------------ | --- | --- | --- | --- | ---------------------------- | --- | ------ | ---------------------------- | --- | --- |
|     |          |                                                        |     |     |     |     |    Simple Question Processor |     |        |    Simple Question Processor |     |     |
|     | prompt 1 | KG < She's Everything > < music.composition.composer > |     |     |     |     |                              |     |        |                              |     |     |
|     |          |                                                        |     |     |     |     |  Relevant Fact Searcher      |     | KG     |  Relevant Fact Searcher      | KG  |     |
Question KG < She's Everything > < music.composition.composer > Sub-question 1 Sub-question 2
prompt 2 < Brad Paisley > < Brad Paisley >  < Brad Paisley > < people.person.education >
|     |     |     |     |     |     |     | < music.composer.compositions > |     |     | < education.education.institution >  |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------- | --- | --- | ------------------------------------ | --- | --- |
Question
prompt 3 Need more information.  < She's Everything > < Belmont University >
|     |     |     |     |     |     |     | ……  |     |     | ……  |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Repeat……
|          |          |                                                   |     |     |     |     |                |              | few-shot | Sub-question 2 | few-shot prompt 3  |     |
| -------- | -------- | ------------------------------------------------- | --- | --- | --- | --- | -------------- | ------------ | -------- | -------------- | ------------------ | --- |
|          |          | < She's Everything > < music.composition.composer |     |     |     |     | Sub-question 1 |              |          |                |                    |     |
| Question |          | KG > < Brad Paisley >                             |     |     |     |     |                |              | prompt 3 |                |                    |     |
|          | prompt 1 | … …                                               |     |     |     |     |                |              |          |                |                    |     |
|          |          |                                                   |     |     |     |     |                | Brad Paisley |          |                | Belmont University |     |
< U nnamed > < education.education.degree>
< She's Everything > < music.composition.composer
> < Brad Paisley >
| Question |          | KG  |     |     |     |     |     |                |     |                |     |     |
| -------- | -------- | --- | --- | --- | --- | --- | --- | -------------- | --- | -------------- | --- | --- |
|          | prompt 2 | … … |     |     |     |     |     | Sub-question 1 |     | Sub-question 2 |     |     |
< U nnamed > < education.education.degree > <
|     |     | Bachelor's degree > |                      |                                |              |     |     | Question |     | few-shot prompt 4 |     |     |
| --- | --- | ------------------- | -------------------- | ------------------------------ | ------------ | --- | --- | -------- | --- | ----------------- | --- | --- |
|     |     | C a n ' t   d e     | te r m i n e  t h e  | c o ll e g e 's  n a m e .  It | 's   o n l y |     |     |          |     |                   | √   |     |
Question m e n t i o n e d   th a t  s o m e o n e   h o ld s  a  B a c h e l o r' s Answer：Belmont University
prompt 3
degree.
|     |     | Figure1: | OverviewofpreviousmethodsandourproposedframeworkKELDaR. |     |     |     |     |     |     |     |     |     |
| --- | --- | -------- | ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
between questions and relations, aiding in infor-  [Task description and requirements]
mationretrievalandquestionreasoning. Withthe  Question: [question of sample 1]
 (Other items)
advancementofLLMs,recentworksutilizeLLMs  Answer: [answer of sample 1]
| forKGretrievalandsubsequentreasoning. |     |     |     |     |     | Struct- |     |  …… |     |     |     |     |
| ------------------------------------- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- |
 Question: [question to be processed]
GPT(Jiangetal.,2023a)andToG(Sunetal.,2024)
 (Other items)
| designLLM-basedmethodsforentityandrelation |     |     |     |     |     |     |     |  Answer: |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- |
retrievalonKG,andcontinuetoinvokeLLMfor
reasoning based on retrieval results. Answers to Figure2: Illustrationofthefew-shotpromptsforLLM
|     |           |              |     |         |                |     | inourproposedframework. |     |     | Thepartenclosedby“()” |     |     |
| --- | --------- | ------------ | --- | ------- | -------------- | --- | ----------------------- | --- | --- | --------------------- | --- | --- |
| the | questions | are obtained |     | through | the retrieving |     |                         |     |     |                       |     |     |
isoptional.
| andreasoningprocessiteratively. |         |     |     | RoG(LUOetal., |     |          |     |     |     |     |     |     |
| ------------------------------- | ------- | --- | --- | ------------- | --- | -------- | --- | --- | --- | --- | --- | --- |
| 2024)                           | employs | the | LLM | to generate   | KG  | relation |     |     |     |     |     |     |
chainsasreasoningplans,whicharethenusedfor andgoldenanswerstothequestionisAq = aq .
{ }
KGretrieval,followedbyLLM-basedreasoningto Bothtopicentitiesandgoldenanswerscorrespond
| generateanswersbasedonretrievalresults. |             |     |     |     |     |     |                       |                |        | Tq,Aq               |                    |     |
| --------------------------------------- | ----------- | --- | --- | --- | --- | --- | --------------------- | -------------- | ------ | ------------------- | ------------------ | --- |
|                                         |             |     |     |     |     |     | to entities           |                | in KG, | i.e.,               | . The goal         | of  |
|                                         |             |     |     |     |     |     |                       |                |        |                     | ⊆ E                |     |
|                                         |             |     |     |     |     |     | KGQAistodesignamodelf |                |        |                     | thatpredictsthean- |     |
| 3                                       | Preliminary |     |     |     |     |     | sweraq                | tothequestionq |        | basedontheknowledge |                    |     |
,formulatedasaq
|     |     |     |     |     |     |     | intheKG |     |     |     | = f(q, ). |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --------- | --- |
|     |     |     |     |     |     |     |         |     | G   |     | G         |     |
KnowledgeGraph(KG)canbeformalizedasa
| collection |            | of factual  | triples | composed     | of      | entities | 4   | Method   |     |     |     |     |
| ---------- | ---------- | ----------- | ------- | ------------ | ------- | -------- | --- | -------- | --- | --- | --- | --- |
| and        | relations, | represented |         | as =         | (e ,r,e | )        |     |          |     |     |     |     |
|            |            |             |         |              | h       | t        |     |          |     |     |     |     |
|            |            |             |         | G {          |         | } ⊆      | 4.1 | Overview |     |     |     |     |
|            |            | , where     | e , r,  | and e denote | the     | head     |     |          |     |     |     |     |
|            |            |             | h       | t            |         |          |     |          |     |     |     |     |
E ×R×E
entity,relation,andtailentityrespectively; and Our framework first employs the Question Com-
E
denotethesetsofallentitiesandrelationsinKG
|     |     |     |     |     |     |     | plexityClassifier |     | (seeSection4.2)toclassifythe |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | ---------------------------- | --- | --- | --- |
R
| respectively. |     |     |     |     |     |     | complexityofinputquestions. |     |     |     | Forcomplexques- |     |
| ------------- | --- | --- | --- | --- | --- | --- | --------------------------- | --- | --- | --- | --------------- | --- |
Knowledge Graph Question Answering tions,theframeworkusesComplexQuestionPro-
(KGQA)isataskthatinvolvesansweringspecific cessor (see Section 4.3) to decompose them and
questions based on factual information from a solvethesub-questionswithourframeworkitera-
KG. Given a question q and a KG , topic entity tively, then integrate them to answer the original
G
tq Tq can be extracted from the question q, question. For simple questions, it directly infers
∈
11474

the answer using the Simple Question Processor Sqq = [sq q ,...,sq q ], where sq q denotes the sub-
1 l i
(see Section 4.4) with the assistance of the Rel- question of the i-th reasoning step and l is the
evant Fact Searcher (see Section 4.5) retrieving length of Sqq. The backbone of Decomposer is
relevantKGfacts. Thedetailedframeworkwork- afew-shotpromptedLLM,whichdevelopsamulti-
flowispresentedinAlgorithm1. Figure1(right) stepreasoningplanforthegivencomplexquestion
illustratesanexampleofhowourframeworkpro- intheformofsub-questions.
cesses a complex question. The structure of the The “Answer” of each sample in the prompt
few-shot prompts for LLM in our framework is is a sequence of sub-questions crafted manu-
q
shown in Figure 2, where the content at “Other ally. Each sub-question i conforms to sq =<
i
items”isdeterminedaccordingtotheneedsofdif- w 1 ,...,w
|
sqq
i|
>,inwhichw k
∈ W ∪L
i . Here,
W
ferentmodules. represents the set of English words and punctua-
tions; i = [#j] 1 j < i,j Z ,where[#j]
4.2 QuestionComplexityClassifier L { | ≤ ∈ }
referstotheanswertagofprevioussub-questionj.
TheQuestionComplexityClassifierdeterminesthe Sub-questionsHandling Obtainingaseriesof
complexityoftheinputquestionq andcategorizes sub-questions, they should be answered sequen-
itintoaquestiontypecq,formalizedas: tiallysincethereasoningstepsareordered,which
isformalizedas:
cq = Classifier(q), (1)
q q
sq = sq ,
1 1
wherecq Simple,Complex . Thebackboneof
Classifier ∈ is { a few-shot promp } ted LLM. It gener- a f sqq 1 = KELDaR(sq q 1 , G ),
atesadeterminationofeitherSimpleorComplex,
sq
fq
= replace(sq
q
,Sa
q
),
2 2f <2
whichdirectsthequestiontodifferentsubsequent
modules for further processing. See Appendix a f sqq 2 = KELDaR(sq q 2 , G ), (4)
A.2 for why we choose to implement Classifier f . .
. f
bypromptingLLM.
q q q
The “Answer” of each sample question in the sq = replace(sq ,Sa ),
l l <l
p
gu
ro
id
m
e
p
d
t
b
i
y
s
t
i
h
ts
eS
cl
P
a
A
ss
R
a
Q
n
L
no
p
t
r
a
o
t
v
e
i
d
de
m
d
a
i
n
n
u
t
a
h
l
e
ly
d
,
a
w
ta
h
se
ic
t
h
an
i
d
s
a f
sqq
l = KELDaR(sq
q
l , G ),
f
ourownunderstandingofthequestion’ssemantics.
Thespecificclassificationcriteriaare: iftheques-
whereSaq = [asqq 1,...,asqq l],frepresentingthelist
tioninvolvesthelogicofcompositionthusrequires
ofanswerstosubf-questiofns. listhelengthofsub-
questionlist.
multi-step reasoning, it’s complex. Otherwise, if
Since the sub-question might depend on an-
itdoesn’tinvolvecompositionstructuresandonly
swerstoprevioussub-questions,itneedstobepre-
needssingle-stepreasoning,it’ssimple.
processed with the function replace. It replaces
4.3 ComplexQuestionProcessor eachtag[#k]insub-questionsq q withcorrespond-
i
WeformalizetheComplexQuestionProcessoras:
inganswerasqq
k inanswersSa
q
<i toprevioussub-
questions, yieglding a comprehensible natural lan-
aq = CompQProcessor(q, ), (2) q
guagequestionsq . Itisthenfedtoourframework
G i
whereqistheinputcomplexquestion, istheKG,
KELDaRasanewquestiontoinferitsanswerasqq
i.
and the derived answer is aq. This m G odule is de- Sub-questionsI f ntegration Inthispart,weinfte-
signedtoprocessquestionsclassifiedasComplex grate all sub-questions and their answers to infer
theansweraq totheoriginalcomplex questionq.
bytheQuestionComplexityClassifierandinvolves
Thisprocesscanbeformalizedas:
threesteps: decomposition,handling,andintegra-
tion.
aq = Integrator(q,Sqq,Saq), (5)
ComplexQuestionDecomposition Inthispart,
the input problem q is decomposed into a series where the list of sub-quegstions is Sqq =
of sub-questions Sqq using multi-step reasoning,
q q
[sq ,...,sq ] and a corresponding list of answers
whichcanbeformalizedas: 1 l
is Saq = [asqq 1,...,asqq l]. l is the le g ngth of
f f
Sqq = Decomposer(q). (3) sub-question lifst. Integfrator adopts a few-shot
11475

| prompted                                    | LLM         | as its  | backbone, |               | whose | prompt | 1st-hop entity | 1st-hop relation       |                |     |     |     |     |
| ------------------------------------------- | ----------- | ------- | --------- | ------------- | ----- | ------ | -------------- | ---------------------- | -------------- | --- | --- | --- | --- |
| containssamplesof“question-sub-questionsand |             |         |           |               |       |        |                | prune                  |                |     |     |     |     |
|                                             |             |         |           |               |       |        |                | top-n 1st-hop relation | 1st-hop entity |     |     |     |     |
| answers                                     | - reasoning | process |           | and results”. |       | Given  |                |                        |                |     |     |     |     |
prune 1st-hop entity
thesub-QAsforanewquestion,LLMconstructs top-m 1st-hop relation 2nd-hop relation
| thereasoningchainandgeneratestheansweraq |     |     |     |     |     |     |             |     |     |     |              | p r u n e      |                |
| ---------------------------------------- | --- | --- | --- | --- | --- | --- | ----------- | --- | --- | --- | ------------ | -------------- | -------------- |
|                                          |     |     |     |     |     | to  |             |     |     |     |              |                | 2nd-hop entity |
|                                          |     |     |     |     |     |     |             |     |     |     | top-p 2nd-ho | p   re l ation |                |
| theoriginalcomplexquestion.              |     |     |     |     |     |     | Candidates: |     |     |     |              |                |                |
topic entity[SEP]1st-hop relation[SEP]1st-hop entity
Wefindthatthereareinevitablysomeproblems
1st-hop entity[SEP]1st-hop relation[SEP]topic entity
withtheresultsgeneratedbytheDecomposerand
topic entity[SEP]1st-hop relation[SEP]2nd-hop relation[SEP]2nd-hop entity
| sub-question | handling. |     | To avoid | the | bad | effects |     |     |     |     |     |     |     |
| ------------ | --------- | --- | -------- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
2nd-hop entity[SEP]2nd-hop relation[SEP]1st-hop relation[SEP]topic entity
toourframeworkcausedbytheerrorpropagation
|     |     |     |     |     |     |     | Figure3: | Illustrationoftwostrategiesofextractingcan- |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------------------------------------------- | --- | --- | --- | --- | --- |
throughtwoprevioussteps,wedesignseveralex-
|           |         |        |     |      |         |        | didatesubgraphoffacts. |     |     | Thetriple/quadruple-based |     |     |     |
| --------- | ------- | ------ | --- | ---- | ------- | ------ | ---------------------- | --- | --- | ------------------------- | --- | --- | --- |
| amples in | the LLM | prompt | of  | this | part to | handle |                        |     |     |                           |     |     |     |
strategycanberepresentedbyallpartsofthefigure,re-
| these errors, | guiding | LLM | to  | select | useful | refer- |     |     |     |     |     |     |     |
| ------------- | ------- | --- | --- | ------ | ------ | ------ | --- | --- | --- | --- | --- | --- | --- |
sultingincandidatesoftriplesandquadrupleswithfirst
encesandcombineitsownknowledgewhenneces-
|     |     |     |     |     |     |     | andsecond-hopentities. |     |     | Therelation-basedstrategy |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------------- | --- | --- | ------------------------- | --- | --- | --- |
sarytocompletethereasoning. canberepresentedbytheremainingpartsofthefigure
|     |     |     |     |     |     |     | excludingthe | greyed-outareas,leadingtocandidates |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ----------------------------------- | --- | --- | --- | --- | --- |
4.4 SimpleQuestionProcessor
thatdon’tincludefirstandsecond-hopentities.
Thismoduleisdesignedtohandlequestionsclassi-
fiedasSimplebytheQuestionComplexityClassi-
Refq
|     |     |     |     |     |     |     | where | represents |     | the | set of | retrieved | facts. |
| --- | --- | --- | --- | --- | --- | --- | ----- | ---------- | --- | --- | ------ | --------- | ------ |
fier. Itcanbeformalizedas:
|     |      |                   |     |     |     |     | Searcheroperatesinthreesteps: |     |          |             | topicentityextrac- |     |          |
| --- | ---- | ----------------- | --- | --- | --- | --- | ----------------------------- | --- | -------- | ----------- | ------------------ | --- | -------- |
|     |      |                   |     |     |     |     | tion, candidate               |     | subgraph | extraction, |                    | and | relevant |
|     | aq = | SimpQProcessor(q, |     |     | ),  | (6) |                               |     |          |             |                    |     |          |
|     |      |                   |     |     | G   |     | factretrieval.                |     |          |             |                    |     |          |
whereq istheinputsimplequestion, istheKG, TopicEntityExtraction Toasinglequestion,the
G
| andaq               |     |     |     |                    |     |     | majorityofthedatainKGisirrelevant. |     |     |     |     | Theyintro- |     |
| ------------------- | --- | --- | --- | ------------------ | --- | --- | ---------------------------------- | --- | --- | --- | --- | ---------- | --- |
| isthederivedanswer. |     |     |     | Forinputquestions, |     |     |                                    |     |     |     |     |            |     |
thismodulefirstinvokestheRelevantFactSearcher ducenoiseintoKGretrievalandincreaseitstime
(seeSection4.5)toretrieveasetofrelevantfacts and space cost, interfering with the retrieval and
| Refq |     |     |     |     |     |     | subsequent | reasoning |     | (Ding | et al., | 2024). | There- |
| ---- | --- | --- | --- | --- | --- | --- | ---------- | --------- | --- | ----- | ------- | ------ | ------ |
fromtheKG.Thesefactsserveasreferences
|     |     |     |     |     |     |     | fore,wefirstextracttopicentitiesofquestionq |     |     |     |     |     | as  |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------- | --- | --- | --- | --- | --- | --- |
toaidreasoning,formalizedas:
thesourceofcandidatesubgraphextractionfrom
aq = Answerer(q,Refq). (7) theextensiveKG,whichisformalizedas:
ThebackboneofAnswererisafew-shotprompted Tq = TopicExtractor(q), (9)
LLMwhosepromptcontainssamplesof“question
|     |     |     |     |     |     |     | whereTq | = tq |     | istheextractedtopicentity |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | ---- | --- | ------------------------- | --- | --- | --- |
-relevantKGfacts-reasoningprocessandanswer”.
{ } ⊆ E
|                                |            |     |           |     |               |     | set, with | each | entity | corresponds |     | to one | of KG |
| ------------------------------ | ---------- | --- | --------- | --- | ------------- | --- | --------- | ---- | ------ | ----------- | --- | ------ | ----- |
| For new                        | questions, | LLM | generates |     | a single-step |     |           |      |        |             |     |        |       |
| reasoningprocessandtheansweraq |            |     |           |     | basedonthe    |     | entities  | .    |        |             |     |        |       |
E
Weimplementtwomethodsfortopicentityex-
providedrelevantfacts.
|         |      |            |       |           |     |        | traction | depending | on  | whether | golden |     | topics are |
| ------- | ---- | ---------- | ----- | --------- | --- | ------ | -------- | --------- | --- | ------- | ------ | --- | ---------- |
| To deal | with | cases that | facts | retrieved |     | by the |          |           |     |         |        |     |            |
Searcherareinsufficienttoinfertheanswer,wein- used. For method not using golden topics, we
|     |     |     |     |     |     |     | employ | existing | entity | linker | for | extraction. | For |
| --- | --- | --- | --- | --- | --- | --- | ------ | -------- | ------ | ------ | --- | ----------- | --- |
cludeseveralexamplesintheLLMpromptwithim-
|                           |     |     |                    |     |     |     | method | using golden |     | topics, | we extract |     | all entity |
| ------------------------- | --- | --- | ------------------ | --- | --- | --- | ------ | ------------ | --- | ------- | ---------- | --- | ---------- |
| perfectresultsofSearcher. |     |     | Theseexamplesguide |     |     |     |        |              |     |         |            |     |            |
IDsfromtheSPARQLannotatedinthedatasetas
| the LLM | to assess | the | usability | of  | the reference |     |     |     |     |     |     |     |     |
| ------- | --------- | --- | --------- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
facts and, when necessary, draw on LLM’s own thegoldentopicset. Consideringthatthisgolden
setdoesn’tcoverintermediateentitiesinmulti-step
knowledgetocompletereasoning.
reasoningforcomplexquestions,thetopicsofsub-
4.5 RelevantFactSearcher questionsmaynotbeincluded. Sowefurthercom-
bineresultsofentitylinkerwiththegoldenset.
| TheRelevantFactSearcherqueriestheKG |     |     |     |     |     | for |     |     |     |     |     |     |     |
| ----------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
G
|                |     |           |          |     |              |     | Candidate | Subgraph |     | Extraction |     |     | Based on |
| -------------- | --- | --------- | -------- | --- | ------------ | --- | --------- | -------- | --- | ---------- | --- | --- | -------- |
| facts relevant | to  | the input | question |     | q to provide |     |           |          |     |            |     |     |          |
referenceknowledgefortheSimpleQuestionPro- the topic entities, this part focuses on extracting
cessor. Itcanbeformalizedas: asubgraphfromtheKG,whichcontainsquestion-
|     |     |     |     |     |     |     | relevant | facts and | should | be  | as small | as  | possible, |
| --- | --- | --- | --- | --- | --- | --- | -------- | --------- | ------ | --- | -------- | --- | --------- |
Refq
= Searcher(q, ), (8) servingasthesetofcandidatefacts. Thispartcan
G
11476

| beformalizedas: |     |                     |     |     |      |     |     | Dataset | Train | Test |     |     |
| --------------- | --- | ------------------- | --- | --- | ---- | --- | --- | ------- | ----- | ---- | --- | --- |
|                 |     |                     |     |     |      |     |     | WebQSP  | 3098  | 1639 |     |     |
| Candq           | =   | CandExtractor(q,Tq, |     | ),  | (10) |     |     |         |       |      |     |     |
|                 |     |                     |     |     |      |     |     | CWQ     | 27639 | 3531 |     |     |
G
| whereCandq | isthesetofcandidatefactsextracted |     |     |     |     |     |     |     |     |     |     |     |
| ---------- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Table1: Statisticsofexampledistributionintheexperi-
fromtheKGneighborhoodsoftopicentitiesTq.
mentaldatasets.
| We designed                |     | two | fact extraction        | strategies | for |     |     |     |     |     |     |     |
| -------------------------- | --- | --- | ---------------------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
| differentretrievalobjects: |     |     | triple/quadruple-based |            |     |     |     |     |     |     |     |     |
andrelation-based. Bothstrategiesextractrelations bQuestionsSP (WebQSP) (Yih et al., 2016) and
and entities within a two-hop range of the topic ComplexWebQuestions (CWQ) (Talmor and Be-
|     |     |     |     |     |     | rant,2018). |     | InWebQSPandCWQ,eachquestion |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ----------- | --- | --------------------------- | --- | --- | --- | --- |
entities,forreasonsdiscussedinAppendixA.3.
The triple/quadruple-based extraction strategy is annotated with a SPARQL, which can be exe-
is illustrated in Figure 3. From the topic entity cutedonKGtoqueryforitsgoldenanswers. We-
tq,weprunefirstandsecond-hoprelationsinKG bQSPcontains4,737QApairs. CWQisbuilton
according to their relevance to question q. Note topofWebQSPbymakingtheoriginalquestions
thatonlyforthefirst-hopentitieswithoutnatural morecomplexthroughmethodssuchasexpanding
languagenames,wefurtherextractthesecond-hop. theentitiesinoriginalquestionsintosub-questions
|     |     |     |     |     |     | and | adding | constraints | to the | answers | of  | original |
| --- | --- | --- | --- | --- | --- | --- | ------ | ----------- | ------ | ------- | --- | -------- |
Withtheformatoftriple/quadrupleinFigure3,we
constructthetwo-hopprunedrelationsandentities questions. Thisresultsin34,689QApairsoffour
q
to form the candidates Cand . By merging the combinationtypes: composition,conjunction,com-
tq
|     |     |     |     |     |     | parative,andsuperlative. |     |     | Thestatisticsofthenum- |     |     |     |
| --- | --- | --- | --- | --- | --- | ------------------------ | --- | --- | ---------------------- | --- | --- | --- |
candidatesextractedforeachtopicentity,weobtain
the candidate subgraph in the form of a fact list, berofexamplesinthetrainingandtestsetsofboth
q
| denotedasCandq |     | =   | Cand , | tq Tq. |     | datasetsareshowninTable1. |     |     |     |     |     |     |
| -------------- | --- | --- | ------ | ------ | --- | ------------------------- | --- | --- | --- | --- | --- | --- |
tq
|     |     |     | ∪   | ∀ ∈ |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
The relation-based extraction strategy focuses Both datasets are based on Freebase KG (Bol-
|     |     |     |     |     |     | lacker | et  | al., 2008). | We  | use the | Freebase | pre- |
| --- | --- | --- | --- | --- | --- | ------ | --- | ----------- | --- | ------- | -------- | ---- |
moreonrelations,illustratedbypartsexcludingthe
greyed-outareasinFigure3,whichdoesn’tinclude processedwiththemethodinLanandJiang(2020)
firstandsecond-hopentitiesintheextractedfacts. for all experiments. This method only extracts
tripleswithentitiesinFreebaseID,Englishtext,or
Therestoftheextractionprocessfollowssimilar
stepsasthetriple/quadruple-basedstrategy. numericformatfromthecompleteFreebase.
| Relevant | Fact | Retrieval | From     | the   | candidate  |     |                           |     |     |     |     |     |
| -------- | ---- | --------- | -------- | ----- | ---------- | --- | ------------------------- | --- | --- | --- | --- | --- |
| Candq,   |      |           |          |       |            | 5.2 | BaselinesandOurFrameworks |     |     |     |     |     |
| facts    | we   | further   | retrieve | a few | facts that |     |                           |     |     |     |     |     |
aremostrelevanttotheinputquestionq,providing Forbaselines,training-basedmethodsoptimize
precisereferencesforLLM’sreasoning. Wefollow theproposedmodelsonspecificdownstreamtrain-
themethodof“retrieval-then-reranking”proposed ing data by fine-tuning or training PLMs, LLMs,
|         |        |          |      |             |       | or retrievers. |     | We select | KV-Mem |     | (Miller | et al., |
| ------- | ------ | -------- | ---- | ----------- | ----- | -------------- | --- | --------- | ------ | --- | ------- | ------- |
| by Baek | et al. | (2023b). | With | a retriever | and a |                |     |           |        |     |         |         |
reranker, we retain the top K and K relevant 2016), GraftNet (Sun et al., 2018), PullNet (Sun
|     |     |     | rt  | rr  |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
facts to question q respectively, as represented in etal.,2019),EmbedKGQA(Saxenaetal.,2020),
|     |     |     |     |     |     | TransferNet |     | (Shi et | al., 2021), | NSM | (He | et al., |
| --- | --- | --- | --- | --- | --- | ----------- | --- | ------- | ----------- | --- | --- | ------- |
equations(11).
2021),KGT5(Saxenaetal.,2022),SR+NSM+E2E
| Resq | Retriever(q,Candq,K |     |     |     |     |        |     |              |       |      |         |        |
| ---- | ------------------- | --- | --- | --- | --- | ------ | --- | ------------ | ----- | ---- | ------- | ------ |
|      | =                   |     |     | ),  |     |        |     |              |       |      |         |        |
|      |                     |     |     | rt  |     | (Zhang | et  | al., 2022a), | TIARA | (Shu | et al., | 2022), |
(11)
Refq = Reranker(q,Resq,K ). KD-CoT(Wangetal.,2023a), UniKGQA(Jiang
rr
etal.,2023c),ReasoningLM(Jiangetal.,2023b),
|               |         |     | Refq = | ref q ,...,ref | q    |       |     |         |           |     |      |         |
| ------------- | ------- | --- | ------ | -------------- | ---- | ----- | --- | ------- | --------- | --- | ---- | ------- |
| The retrieval | results |     |        |                |      |       |     |         |           |     |      |         |
|               |         |     | {      | 1              | Krr} | DecAF | (Yu | et al., | 2023) and | RoG | (LUO | et al., |
areusedasreferencesforfurtherreasoning.
|         |                |     |            |      |           | 2024). | Reasoning-based |     |     | methods | directly | uti- |
| ------- | -------------- | --- | ---------- | ---- | --------- | ------ | --------------- | --- | --- | ------- | -------- | ---- |
| For the | relation-based |     | retrieval, | it’s | necessary |        |                 |     |     |         |          |      |
lizeexistingmodelsincludingLLMswithoutany
tocomplementeachretrievedfactwiththecorre-
|     |     |     |     |     |     | additional |     | training | or fine-tuning. |     | We select | IO  |
| --- | --- | --- | --- | --- | --- | ---------- | --- | -------- | --------------- | --- | --------- | --- |
spondingfirstorsecond-hopentitiestoconstructa
|     |     |     |     |     |     | (Brown | et  | al., 2020), | CoT | (Wei | et al., | 2022), |
| --- | --- | --- | --- | --- | --- | ------ | --- | ----------- | --- | ---- | ------- | ------ |
completereferencefact.
|     |     |     |     |     |     | CoT+SC  |         | (Wang et  | al., 2023c), | StructGPT |            | (Jiang |
| --- | --- | --- | --- | --- | --- | ------- | ------- | --------- | ------------ | --------- | ---------- | ------ |
|     |     |     |     |     |     | et al., | 2023a), | KB-BINDER |              | (Li et    | al., 2023) | and    |
5 Experiments
ToG(Sunetal.,2024).
5.1 DatasetsandKG
|     |     |     |     |     |     | According |     | to our | two proposed |     | fact extraction |     |
| --- | --- | --- | --- | --- | --- | --------- | --- | ------ | ------------ | --- | --------------- | --- |
ToevaluatetheperformanceofKELDaR,weem- andretrievalstrategies,andwhethertousegolden
ployedtwocommonlyusedKGQAdatasets: We- topics, our framework is evaluated under four
11477

settings. KELDaR and KELDaR* employ the Types Methods WebQSP CWQ
triple/quadruple-based strategy, while KELDaR- KV-Mem 46.7 18.4
rel and KELDaR-rel* utilize the relation-based GraftNet 66.4 36.8
|                      |                                   |     |     |     |     |     |           | PullNet     |     |     | 68.1 |     | 45.9 |
| -------------------- | --------------------------------- | --- | --- | --- | --- | --- | --------- | ----------- | --- | --- | ---- | --- | ---- |
| strategy.            | *indicatestheusageofgoldentopics. |     |     |     |     |     |           |             |     |     |      |     |      |
|                      |                                   |     |     |     |     |     |           | EmbedKGQA*  |     |     | 66.6 |     | -    |
|                      |                                   |     |     |     |     |     |           | TransferNet |     |     | 71.4 |     | 48.6 |
| 5.3 EvaluationMetric |                                   |     |     |     |     |     |           | NSM*        |     |     | 74.3 |     | 48.8 |
|                      |                                   |     |     |     |     |     | Training- | KGT5*       |     |     | 56.1 |     | 36.5 |
Followingpreviouswork(Wangetal.,2023a;Jiang
|     |     |     |     |     |     |     | based | SR+NSM+E2E* |     |     | 69.5 |     | 49.3 |
| --- | --- | --- | --- | --- | --- | --- | ----- | ----------- | --- | --- | ---- | --- | ---- |
et al., 2023a; Li et al., 2023; Sun et al., 2024), TIARA* 75.2 -
|            |       |       |      |     |                |     |     | KD-CoT   |     |     | 68.6 |     | 55.7 |
| ---------- | ----- | ----- | ---- | --- | -------------- | --- | --- | -------- | --- | --- | ---- | --- | ---- |
| we employs | Exact | Match | (EM) | as  | the evaluation |     |     |          |     |     |      |     |      |
|            |       |       |      |     |                |     |     | UniKGQA* |     |     | 77.2 |     | 51.2 |
metricinourexperiments.
|     |     |     |     |     |     |     |     | ReasoningLM* |     |     | 78.5 |     | 69.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | --- | ---- | --- | ---- |
Considering that it’s challenging to locate the DecAF 82.1 70.4
|     |     |     |     |     |     |     |     | RoG* |     |     | 85.7 |     | 62.6 |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | ---- | --- | ---- |
answerentitiespreciselyinLLM’soutputswhenit
|     |     |     |     |     |     |     |     | StructGPT* |     |     | 72.6 |     | -   |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | ---- | --- | --- |
isn’tmarkedexplicitlywith“{}”asexpected,we
|                                           |     |     |     |     |     |     |     | KB-BINDER |     |     | 74.4 |     | -    |
| ----------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | --- | ---- | --- | ---- |
| adopttheevaluationmethodinSunetal.(2024). |     |     |     |     |     | If  |     |           |     |     |      |     |      |
|                                           |     |     |     |     |     |     |     | ToG*      |     |     | 63.2 |     | 29.2 |
‡
| LLM’soutputcontainscompleteanswermarkers, |     |     |     |     |     |     |     | IO  |     |     | 64.8 |     | 34.4 |
| ----------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | ---- |
†
|                                             |     |                              |     |     |             |     | Reasoning- | CoT     |     |     | 70.3 |     | 40.2 |
| ------------------------------------------- | --- | ---------------------------- | --- | --- | ----------- | --- | ---------- | ------- | --- | --- | ---- | --- | ---- |
| weextracttheanswerdirectlyandmatchitwiththe |     |                              |     |     |             |     |            |         | †   |     |      |     |      |
|                                             |     |                              |     |     |             |     | based      | CoT+SC  |     |     | 71.4 |     | 41.6 |
| goldenanswer.                               |     | Otherwise,theentireLLMoutput |     |     |             |     |            |         |     | †   |      |     |      |
|                                             |     |                              |     |     |             |     |            | KELDaR  |     |     | 75.5 |     | 41.9 |
| isconsideredasthesearchingscope.            |     |                              |     |     | Weregardthe |     |            |         |     |     |      |     |      |
|                                             |     |                              |     |     |             |     |            | KELDaR* |     |     | 76.0 |     | 50.7 |
resultascorrectifitcontainsthegoldenanswer. KELDaR-rel 76.7 44.2
|     |     |     |     |     |     |     |     | KELDaR-rel* |     |     | 79.4 |     | 53.6 |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --- | ---- | --- | ---- |
5.4 ImplementationDetails
|     |     |     |     |     |     |     | Table 2: | Main | results (EM | in  | percent) | of our | frame- |
| --- | --- | --- | --- | --- | --- | --- | -------- | ---- | ----------- | --- | -------- | ------ | ------ |
Inthemainexperiments,weutilizegpt-3.5-turbo
worksandbaselinesonKGQA.*indicatestheusageof
API(OpenAI,2022)astheLLMinourproposed
|                                             |          |     |         |       |        |     | thegoldentopics.     |     | indicatestheresultsobtainedbyre- |                             |     |     |     |
| ------------------------------------------- | -------- | --- | ------- | ----- | ------ | --- | -------------------- | --- | -------------------------------- | --------------------------- | --- | --- | --- |
| framework,withthetemperaturesettothedefault |          |     |         |       |        |     |                      |     | †                                |                             |     |     |     |
|                                             |          |     |         |       |        |     | producingthemethods. |     |                                  | indicatestheresultsobtained |     |     |     |
| value of                                    | 1.0, and | the | maximum | token | length | for |                      |     |                                  | ‡                           |     |     |     |
byrunningthesourcecodeprovidedbytheworkonthe
generationsetto100. Thenumbersofsamplesin LLMusedinourstudy. Thebestresultsineachtype
areinboldandsecond-bestresultsareunderlined.
| few-shot | prompts | is  | as follows: | 20  | samples | each |     |     |     |     |     |     |     |
| -------- | ------- | --- | ----------- | --- | ------- | ---- | --- | --- | --- | --- | --- | --- | --- |
forsimpleandcomplexquestionsinQuestionCom-
plexityClassifier,6forDecomposerand10forIn-
ods,ourproposedframeworksinallfoursettings
tegratorinComplexQuestionProcessor,and4for
SimpleQuestionProcessor. Additionally,tokeep show significant improvements over both the IO
promptingmethod,representingtheoriginalfew-
consistencywithourframework’ssettings,theim-
|     |     |     |     |     |     |     | shot performance |     | of  | GPT-3.5, | and | the previous |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | --- | -------- | --- | ------------ | --- |
plementationofIO,CoT,andCoT+SCprompting
|            |         |             |     |     |         |          | state-of-the-artreasoning-basedmethods. |        |     |      |             |     | Specif- |
| ---------- | ------- | ----------- | --- | --- | ------- | -------- | --------------------------------------- | ------ | --- | ---- | ----------- | --- | ------- |
| strategies | in main | experiments |     | all | utilize | the gpt- |                                         |        |     |      |             |     |         |
|            |         |             |     |     |         |          | ically, on                              | WebQSP | and | CWQ, | KELDaR-rel* |     | im-     |
3.5-turboAPIastheLLMandemploy4shots.
provesaccuracyby14.6%and19.2%respectively
| In Relevant |       | Fact Searcher, |        | we      | employed    | ELQ |          |        |     |         |     |         |     |
| ----------- | ----- | -------------- | ------ | ------- | ----------- | --- | -------- | ------ | --- | ------- | --- | ------- | --- |
|             |       |                |        |         | distilbert1 |     | compared | to the | IO  | method, | and | by 5.0% | and |
| (Li et al., | 2020) | as the         | entity | linker, |             | as  |          |        |     |         |     |         |     |
the retriever, and MiniLM2 as the reranker. The 12.0%comparedtopreviousbestreasoning-based
|                |     |                             |     |     |     |     | methods. | These | results | demonstrate |     | that | our pro- |
| -------------- | --- | --------------------------- | --- | --- | --- | --- | -------- | ----- | ------- | ----------- | --- | ---- | -------- |
| numberoffactsK |     | retainedbytheretrieverisset |     |     |     |     |          |       |         |             |     |      |          |
rt
posedframeworkcaneffectivelyleveragetheKG
| to 20, while | the | number | of  | facts K | retained | by  |     |     |     |     |     |     |     |
| ------------ | --- | ------ | --- | ------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
rr
toenhanceLLM’sreasoningsignificantly,outper-
thererankerissetto5bydefault.
formingthestate-of-the-artreasoning-basedresults.
Forthemaximumquestiondecompositiondepth
ParticularlyforthemorechallengingcomplexQA
| inourframework,wesetitto1. |     |     |     | Forfurtherimple- |     |     |     |     |     |     |     |     |     |
| -------------------------- | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
inCWQ,ourframeworkmitigatesthelimitations
mentationdetails,pleaserefertoAppendixB.
ofexistingreasoning-basedmethodseffectively.
| 5.5 MainResults |     |     |     |     |     |     | Comparedtomosttraining-basedmethods,our |          |     |         |             |     |         |
| --------------- | --- | --- | --- | --- | --- | --- | --------------------------------------- | -------- | --- | ------- | ----------- | --- | ------- |
|                 |     |     |     |     |     |     | framework                               | achieves |     | similar | or superior |     | perfor- |
Themainresultsofourexperimentsareshownin
mancewithoutrequiringadditionaltrainingorfine-
Table2. Comparedtootherreasoning-basedmeth-
|     |     |     |     |     |     |     | tuning. WedirectlyinvokesfrozenmodelsofLLM, |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------- | --- | --- | --- | --- | --- | --- |
1https://huggingface.co/sentence-transformers/msmarco-
entitylinker,retrieverandrerankerforreasoning.
distilbert-base-v3
Thisindicatesthatourframeworkispracticaland
2https://huggingface.co/cross-encoder/ms-marco-
| MiniLM-L-12-v2 |     |     |     |     |     |     | competitiveonKGQA,savingadditionalcostsas- |     |     |     |     |     |     |
| -------------- | --- | --- | --- | --- | --- | --- | ------------------------------------------ | --- | --- | --- | --- | --- | --- |
11478

Figure4: ExperimentalresultsonstrategiesoffactextractionandretrievalonKG.1-hopand2-hopindicatethe
triple/quadruple-basedfactextractionandretrievalstrategieswithcandidateextractionrangesof1hopand2hops
respectivelyonKG.1-hop-reland2-hop-relindicatetherelation-basedstrategies. EM-Rrepresentstheaccuracy
ofthefactretrievalintheframework. LLM-Input-LenistheaveragelengthofLLMinputtokensforallquestions.
|     |         |        |        |      |      |     | tionalerrors.                              | That’swhytheKELDaR-relwithout |     |            |     |        |       |
| --- | ------- | ------ | ------ | ---- | ---- | --- | ------------------------------------------ | ----------------------------- | --- | ---------- | --- | ------ | ----- |
|     | Methods |        | WebQSP |      | CWQ  |     |                                            |                               |     |            |     |        |       |
|     |         |        |        |      |      |     | CQP performs                               | better                        |     | on WebQSP. |     | But in | other |
|     | KELDaR  |        |        | 75.5 | 41.9 |     |                                            |                               |     |            |     |        |       |
|     |         | w/oCQP |        | 75.0 | 40.9 |     | threecasesonWebQSP,thestrategyhasapositive |                               |     |            |     |        |       |
KELDaR* 76.0 50.7 effect. This shows the robustness of our frame-
w/oCQP 72.3 46.8 work in reducing the impact of Classifier’s error,
KELDaR-rel 76.6 44.2 ensuringthatourCQPstrategyenhancestheperfor-
|     |     | w/oCQP |     | 77.9 | 39.0 |     |     |     |     |     |     |     |     |
| --- | --- | ------ | --- | ---- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
manceoncomplexquestionswhilehavingminimal
|     | KELDaR-rel* |        |     | 79.4 | 53.6 |     | negativeimpactonsimpleQA. |                                      |     |     |     |     |     |
| --- | ----------- | ------ | --- | ---- | ---- | --- | ------------------------- | ------------------------------------ | --- | --- | --- | --- | --- |
|     |             | w/oCQP |     | 79.1 | 47.2 |     |                           |                                      |     |     |     |     |     |
|     |             |        |     |      |      |     | 5.6.2                     | Analysisonstrategiesoffactextraction |     |     |     |     |     |
Table3: Ablationstudyresults(EMinpercent)onthe
andretrievalonKG
strategyforcomplexquestionprocessing(CQP).The
|     |     |     |     |     |     |     | To reduce | the impact |     | of accuracy | in  | topic | entity |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---------- | --- | ----------- | --- | ----- | ------ |
betterresultsineachsettingofourmethodsareinbold.
|     |     |     |     |     |     |     | extraction, | we conducted |     | experiments |     | using | the |
| --- | --- | --- | --- | --- | --- | --- | ----------- | ------------ | --- | ----------- | --- | ----- | --- |
goldentopics,inordertoanalyzetheinfluenceof
| sociated | with | training | and | fine-tuning | while | still |     |     |     |     |     |     |     |
| -------- | ---- | -------- | --- | ----------- | ----- | ----- | --- | --- | --- | --- | --- | --- | --- |
ourfactextractionandretrievalstrategies.
providingrobustperformance.
|     |     |     |     |     |     |     | As shown | in  | Figures | 4 (left | and | center), | our |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | ------- | ------- | --- | -------- | --- |
Inordertoseehowourmethodworksondiffer-
proposedtwo-hopfactextractionstrategiessignif-
| ent LLMs, |     | we further | conduct | experiments |     | with |         |             |     |         |          |     |         |
| --------- | --- | ---------- | ------- | ----------- | --- | ---- | ------- | ----------- | --- | ------- | -------- | --- | ------- |
|           |     |            |         |             |     |      | icantly | outperforms | the | one-hop | settings |     | in both |
GPT-4(seeAppendixC).
triple/quadruple-basedandrelation-basedsettings.
|     |     |     |     |     |     |     | This leads | to a great | increase |     | in the | accuracy | of  |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ---------- | -------- | --- | ------ | -------- | --- |
5.6 FurtherAnalysis
retrievingrelevantfacts,providingmorevaluable
5.6.1 Analysisonthestrategyofcomplex
referencesforsubsequentreasoningandenhancing
questionprocessing theoverallperformanceeffectively. Thesefindings
To analyze the impact of our complex question manifest the critical importance of the extraction
processing(CQP)strategy,weconductanablation strategiesinourframeworks.
studybyremovingtheComplexQuestionProces- Comparing two fact extraction and retrieval
sorandfixingtheoutputofQuestionComplexity strategieswedesigned,theresultsinFigure4illus-
ClassifiertoSimple. Theperformanceofthismod- tratethattherelation-basedstrategy,comparedto
ifiedframeworkiscomparedtoouroriginalframe- thetriple/quadruple-basedstrategy,requireslonger
work. ResultsarepresentedinTable3. OurCQP LLMpromptsbutachievesbetterretrievalandover-
strategy improves the framework’s performance all performance. The relation-based strategy can
generally,demonstratingitspositiveimpact. contain more entities in references, resulting in
Consideringthatmostquestionsarecomplexin longerLLMpromptstoproviderichercontextual
CWQ while are simple in WebQSP, our strategy informationforthereasoning.
| is naturally |      | more suited | for       | CWQ,   | confirmed     | by  |       |                                  |     |     |     |     |     |
| ------------ | ---- | ----------- | --------- | ------ | ------------- | --- | ----- | -------------------------------- | --- | --- | --- | --- | --- |
|              |      |             |           |        |               |     | 5.6.3 | Analysisoneffectsofvaryingnumber |     |     |     |     |     |
| the results  |      | on CWQ      | in Table  | 3. For | questions     | in  |       |                                  |     |     |     |     |     |
|              |      |             |           |        |               |     |       | K rr ofreferences                |     |     |     |     |     |
| WebQSP,      | they | could       | sometimes | be     | misclassified |     |       |                                  |     |     |     |     |     |
ascomplexbytheQuestionComplexityClassifier, When answering simple questions, the number
leading to redundant subsequent steps and addi- of references provided in the LLM prompt corre-
11479

ingthelimitedcomplexityofquestionsinthetwo
datasets.
|     |     |     |     | TimeCostofRelevantFactSearcher |     |     |     |     | Wefound |     |
| --- | --- | --- | --- | ------------------------------ | --- | --- | --- | --- | ------- | --- |
thatinourexperiments,eachcalltotheRelevant
|     |     |     |     | Fact Searcher |     | costs 27.3s | on   | average.  | However, |      |
| --- | --- | --- | --- | ------------- | --- | ----------- | ---- | --------- | -------- | ---- |
|     |     |     |     | about 80%     | of  | the calls   | took | less than | 20s,     | with |
theremainingcallstakinglongerduetothelarger
numberofrelationsandentitieswithintwohopsof
thetopicentityintheKG.Foracomplexquestion,
|     |     |     |     | each sub-question |          | resulting |          | from decomposition |          |     |
| --- | --- | --- | --- | ----------------- | -------- | --------- | -------- | ------------------ | -------- | --- |
|     |     |     |     | requires          | one call | to the    | Searcher | to                 | retrieve | KG  |
Figure5: Experimentalresultsunderdifferentnumber
|               |                                    |     |     | facts, resulting |     | in k calls | in  | total. | And a | simple |
| ------------- | ---------------------------------- | --- | --- | ---------------- | --- | ---------- | --- | ------ | ----- | ------ |
| ofreferences. | EM-Rrepresentstheaccuracyofthefact |     |     |                  |     |            |     |        |       |        |
questionrequiresonlyonecalltothesearcher.
retrievalintheframework.
|     |     |     |     | NumberofLLMCalls |     |     | Forcomplexquestions, |     |     |     |
| --- | --- | --- | --- | ---------------- | --- | --- | -------------------- | --- | --- | --- |
theLLMisfirstcalledonceintheQuestionCom-
spondstothenumberoffactsretainedafterrerank- plexity Classifier. Then, for solving each sub-
inginRelevantFactSearcher. Theresultsfordif- question,theLLMiscalledonceinboththeClassi-
ferentvaluesofthisparameterareshowninFigure fierandtheSimpleQuestionProcessor,requiringa
5. Asthenumberofreferencesincreases,thereis totalof2kLLMcallsforallsub-questions. Finally,
a steady rise in the accuracy of fact retrieval nat- integratingthesub-questionsandtheiranswersto
urally. However,thisdoesnotnecessarilyleadto derivetheoriginalquestion’sanswerrequiresone
animprovementinoverallaccuracy,indicatingthat moreLLMcall. Thus,complexquestionsrequire
2k+2LLMcallsintotal.
theadditionalcorrectreferencesarenotutilizedby Simplequestionsrequire
theLLMeffectivelyandmayevencauseadecline onlytwoLLMcalls,oneintheClassifierandone
inoverallperformanceinsomecases. intheSimpleQuestionProcessor.
We suspect that this phenomenon can be at- Our method does not require training and em-
|          |                   |           |              | ploysmultithreadingtoreducereasoningtime. |     |     |     |     |     | To  |
| -------- | ----------------- | --------- | ------------ | ----------------------------------------- | --- | --- | --- | --- | --- | --- |
| tributed | to the generative | nature of | the gpt-3.5- |                                           |     |     |     |     |     |     |
turbo used in the experiments. As the length of completethereasoningfor1639questionsinWe-
referencesfornewquestioninthepromptincreases, bQSPand3531questionsinCWQ,ourframework
the distance between previous QA examples and took 2.83h and 14.82h, respectively. The longer
theendofpromptalsoincreases,whichmaycause timeonCWQismainlyduetothelargernumber
LLMtoforgetpatternslearnedfromexampleson ofquestionsandtheirhighercomplexitycompared
| how to                                   | infer the answers              | to the questions | based | toWebQSP.    |     |     |     |     |     |     |
| ---------------------------------------- | ------------------------------ | ---------------- | ----- | ------------ | --- | --- | --- | --- | --- | --- |
| onreferences.                            | Consequently,thisleadstoanega- |                  |       |              |     |     |     |     |     |     |
| tiveimpactonLLM’sabilitytoanswerthegiven |                                |                  |       | 6 Conclusion |     |     |     |     |     |     |
questioneffectively.
|     |     |     |     | This study | introduces |     | a   | framework | of  | KG- |
| --- | --- | --- | --- | ---------- | ---------- | --- | --- | --------- | --- | --- |
enhancedLLMbasedonquestiondecomposition
5.6.4 AnalysisontheReasoningTimeofOur
|     | Method |     |     | andatomicretrieval,calledKELDaR.Weintroduce |     |     |     |     |     |     |
| --- | ------ | --- | --- | ------------------------------------------- | --- | --- | --- | --- | --- | --- |
thequestiondecompositiontreeasaframeworkfor
Thereasoningtimeofourframeworkprimarilyde-
LLMreasoning,whichallowsatomicKGretrieval
| pends on                        | the time cost | of the KG Relevant | Fact     |           |            |           |        |               |     |         |
| ------------------------------- | ------------- | ------------------ | -------- | --------- | ---------- | --------- | ------ | ------------- | --- | ------- |
|                                 |               |                    |          | targeting | each       | reasoning | step.  | Additionally, |     | we      |
| SearcherandthenumberofLLMcalls. |               |                    | Assuming |           |            |           |        |               |     |         |
|                                 |               |                    |          | designed  | strategies | of        | atomic | retrieval     | to  | extract |
| that onaverage                  | eachcomplex   | question           | isdecom- |           |            |           |        |               |     |         |
andretrievequestion-relevantKGfacts,expanding
| posedintok | sub-questions. | Inourexperiments,ap- |     |                                       |     |     |     |     |     |     |
| ---------- | -------------- | -------------------- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- |
|            |                |                      |     | therangeofcandidatesubgraphtotwohops. |     |     |     |     |     | Ex- |
proximately20.5%and96.3%ofthequestionsin
perimentalresultsdemonstratethatourproposed
WebQSPandCWQ,respectively,areclassifiedto
frameworksignificantlyoutperformsthestate-of-
| becomplex. | Theaveragenumberofsub-questions |     |     |     |     |     |     |     |     |     |
| ---------- | ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
the-artreasoning-basedmethods.
k forthesecomplexquestionswasapproximately
2.03and2.37inWebQSPandCWQ,respectively.
Limitations
| AndwesetthemaximumdepthD |     | ofthedecom- |     |     |     |     |     |     |     |     |
| ------------------------ | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
position to 1 in our experiments, meaning each Although our proposed framework KELDaR
question is decomposed at most once, consider- demonstrates excellent performance in KGQA
11480

datasets,itstillhassomelimitations. First,theper- pages10038–10055,Toronto,Canada.Association
forComputationalLinguistics.
formanceofourframeworkvariesacrossdifferent
compositiontypesofcomplexquestions,particu-
|                                          |     |     |     |     |        | Maciej Besta, | Nils   | Blach,      | Ales | Kubicek, | Robert      | Ger- |
| ---------------------------------------- | --- | --- | --- | --- | ------ | ------------- | ------ | ----------- | ---- | -------- | ----------- | ---- |
| larlystrugglingwithsuperlativequestions. |     |     |     |     | Future |               |        |             |      |          |             |      |
|                                          |     |     |     |     |        | stenberger,   | Michal | Podstawski, |      | Lukas    | Gianinazzi, |      |
work could explore new question decomposition JoannaGajda,TomaszLehmann,HubertNiewiadom-
strategiestoimprovethedecompositionparadigms ski,PiotrNyczyk,andTorstenHoefler.2024. Graph
|           |                |        |              |      |          | ofthoughts:     | Solvingelaborateproblemswithlarge |                             |     |     |     |     |
| --------- | -------------- | ------ | ------------ | ---- | -------- | --------------- | --------------------------------- | --------------------------- | --- | --- | --- | --- |
| for these | challenging    | types. | Second,      | it’s | also re- |                 |                                   |                             |     |     |     |     |
|           |                |        |              |      |          | languagemodels. |                                   | ProceedingsoftheAAAIConfer- |     |     |     |     |
| quired    | to investigate | more   | controllable |      | methods  |                 |                                   |                             |     |     |     |     |
enceonArtificialIntelligence,38(16):17682–17690.
| on complex | question | decomposition |     | than | that in |     |     |     |     |     |     |     |
| ---------- | -------- | ------------- | --- | ---- | ------- | --- | --- | --- | --- | --- | --- | --- |
ourframework,aimingtomakethesub-questions Kurt Bollacker, Colin Evans, Praveen Paritosh, Tim
|           |        |            |      |           |     | Sturge,      | and Jamie | Taylor. | 2008.    | Freebase: |                 | a col- |
| --------- | ------ | ---------- | ---- | --------- | --- | ------------ | --------- | ------- | -------- | --------- | --------------- | ------ |
| generated | by the | Decomposer | more | reliable. | Ad- |              |           |         |          |           |                 |        |
|           |        |            |      |           |     | laboratively | created   | graph   | database |           | for structuring |        |
ditionally,duetothehighcostoftheGPT-4API,
|     |     |     |     |     |     | humanknowledge. |     | InProceedingsofthe2008ACM |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --------------- | --- | ------------------------- | --- | --- | --- | --- |
wehasn’tconductcompleteexperimentsonGPT-4.
SIGMODInternationalConferenceonManagement
Thus,broaderexperimentsarerequiredtoevaluate ofData,SIGMOD’08,page1247–1250,NewYork,
NY,USA.AssociationforComputingMachinery.
theapplicabilityofourframeworkwithGPT-4and
otherLLMs.
|     |     |     |     |     |     | Tom Brown, | Benjamin | Mann, |     | Nick Ryder, |     | Melanie |
| --- | --- | --- | --- | --- | --- | ---------- | -------- | ----- | --- | ----------- | --- | ------- |
Subbiah,JaredDKaplan,PrafullaDhariwal,Arvind
EthicsStatement
Neelakantan,PranavShyam,GirishSastry,Amanda
|     |     |     |     |     |     | Askell, | Sandhini | Agarwal, |     | Ariel | Herbert-Voss, |     |
| --- | --- | --- | --- | --- | --- | ------- | -------- | -------- | --- | ----- | ------------- | --- |
OurproposedframeworkKELDaRperformques- Gretchen Krueger, Tom Henighan, Rewon Child,
tion answering with LLM reasoning and KG re- AdityaRamesh,DanielZiegler,JeffreyWu,Clemens
trieval,achievingexcellentperformance. However, Winter, Chris Hesse, Mark Chen, Eric Sigler, Ma-
|     |     |     |     |     |     | teusz | Litwin, | Scott Gray, | Benjamin |     | Chess, | Jack |
| --- | --- | --- | --- | --- | --- | ----- | ------- | ----------- | -------- | --- | ------ | ---- |
itsquestionansweringandreasoningcapabilities
|     |     |     |     |     |     | Clark, | ChristopherBerner, |     | SamMcCandlish, |     |     | Alec |
| --- | --- | --- | --- | --- | --- | ------ | ------------------ | --- | -------------- | --- | --- | ---- |
are still not perfect, and it may make mistakes in Radford, Ilya Sutskever, and Dario Amodei. 2020.
| KG retrieving | by  | retrievers | and | answer | generat- |          |        |     |          |           |     |        |
| ------------- | --- | ---------- | --- | ------ | -------- | -------- | ------ | --- | -------- | --------- | --- | ------ |
|               |     |            |     |        |          | Language | models | are | few-shot | learners. |     | In Ad- |
ing by the LLM. Consequently, as for domains vances in Neural Information Processing Systems,
|     |     |     |     |     |     | volume | 33, pages | 1877–1901. |     | Curran | Associates, |     |
| --- | --- | --- | --- | --- | --- | ------ | --------- | ---------- | --- | ------ | ----------- | --- |
withhighprecisionrequirements,theresultsofour
Inc.
| framework | should  | be used | carefully,    | in  | order to  |     |     |     |     |     |     |     |
| --------- | ------- | ------- | ------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
| avoid the | risk of | adverse | consequences. |     | It is re- |     |     |     |     |     |     |     |
ShuangChen,QianLiu,ZhiweiYu,Chin-YewLin,Jian-
quiredtofurtherverifytheresultsgeneratedbythe GuangLou,andFengJiang.2021. ReTraCk:Aflexi-
bleandefficientframeworkforknowledgebaseques-
frameworktocorrecttheerrorsforapplicationin
|     |     |     |     |     |     | tionanswering. |     | InProceedingsofthe59thAnnual |     |     |     |     |
| --- | --- | --- | --- | --- | --- | -------------- | --- | ---------------------------- | --- | --- | --- | --- |
areasthatneedhighprecision.
|     |     |     |     |     |     | Meeting | of the | Association | for | Computational |     | Lin- |
| --- | --- | --- | --- | --- | --- | ------- | ------ | ----------- | --- | ------------- | --- | ---- |
guisticsandthe11thInternationalJointConference
Acknowledgments
|     |     |     |     |     |     | on Natural | Language |          | Processing: |     | System      | Demon- |
| --- | --- | --- | --- | --- | --- | ---------- | -------- | -------- | ----------- | --- | ----------- | ------ |
|     |     |     |     |     |     | strations, | pages    | 325–336, | Online.     |     | Association | for    |
This work was supported by the National Key ComputationalLinguistics.
| Research | and Development |     | Program |     | of China |     |     |     |     |     |     |     |
| -------- | --------------- | --- | ------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
WentaoDing,JinmaoLi,LiangchuanLuo,andYuzhong
| (Grant No. | 2022YFC3302100)    |     | and      | the    | National |          |                                   |     |     |     |     |     |
| ---------- | ------------------ | --- | -------- | ------ | -------- | -------- | --------------------------------- | --- | --- | --- | --- | --- |
|            |                    |     |          |        |          | Qu.2024. | Enhancingcomplexquestionanswering |     |     |     |     |     |
| Natural    | Science Foundation |     | of China | (Grant | No.      |          |                                   |     |     |     |     |     |
overknowledgegraphsthroughevidencepatternre-
| 62476025). |     |     |     |     |     | trieval. | InProceedingsoftheACMonWebConfer- |     |     |     |     |     |
| ---------- | --- | --- | --- | --- | --- | -------- | --------------------------------- | --- | --- | --- | --- | --- |
ence2024,WWW’24,page2106–2115,NewYork,
NY,USA.AssociationforComputingMachinery.
References
GaoleHe,YunshiLan,JingJiang,WayneXinZhao,and
Jinheon Baek, Alham Aji, and Amir Saffari. 2023a. Ji-RongWen.2021. Improvingmulti-hopknowledge
Knowledge-augmentedlanguagemodelprompting base question answering by learning intermediate
forzero-shotknowledgegraphquestionanswering. supervisionsignals. InProceedingsofthe14thACM
InProceedingsoftheFirstWorkshoponMatching InternationalConferenceonWebSearchandData
From Unstructured and Structured Data (MATCH- Mining,WSDM’21,page553–561,NewYork,NY,
| ING2023),pages70–98. |     |     |     |     |     | USA.AssociationforComputingMachinery. |     |     |     |     |     |     |
| -------------------- | --- | --- | --- | --- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- |
Jinheon Baek, Alham Fikri Aji, Jens Lehmann, and ZiweiJi,NayeonLee,RitaFrieske,TiezhengYu,Dan
Sung Ju Hwang. 2023b. Direct fact retrieval from Su, Yan Xu, Etsuko Ishii, Ye Jin Bang, Andrea
knowledgegraphswithoutentitylinking. InProceed- Madotto,andPascaleFung.2023. Surveyofhalluci-
ingsofthe61stAnnualMeetingoftheAssociationfor nationinnaturallanguagegeneration. ACMComput.
| ComputationalLinguistics(Volume1: |     |     |     | LongPapers), |     | Surv.,55(12). |     |     |     |     |     |     |
| --------------------------------- | --- | --- | --- | ------------ | --- | ------------- | --- | --- | --- | --- | --- | --- |
11481

JinhaoJiang,KunZhou,ZicanDong,KemingYe,Xin OpenAI.2022. Introducingchatgpt.
| Zhao,andJi-RongWen.2023a.                  |     |     |     | StructGPT:Agen- |     |              |        |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | --------------- | --- | ------------ | ------ | --- | --- | --- | --- |
| eralframeworkforlargelanguagemodeltoreason |     |     |     |                 |     | OpenAI.2023. | Gpt-4. |     |     |     |     |
InProceedingsofthe2023Con-
overstructureddata.
ApoorvSaxena,AdrianKochsiek,andRainerGemulla.
ferenceonEmpiricalMethodsinNaturalLanguage
2022. Sequence-to-sequenceknowledgegraphcom-
Processing,pages9237–9251,Singapore.Associa-
|     |     |     |     |     |     | pletion | and question | answering. |     | In Proceedings |     |
| --- | --- | --- | --- | --- | --- | ------- | ------------ | ---------- | --- | -------------- | --- |
tionforComputationalLinguistics.
|               |     |       |           |         |         | of the                            | 60th Annual | Meeting | of the | Association  | for |
| ------------- | --- | ----- | --------- | ------- | ------- | --------------------------------- | ----------- | ------- | ------ | ------------ | --- |
|               |     |       |           |         |         | ComputationalLinguistics(Volume1: |             |         |        | LongPapers), |     |
| Jinhao Jiang, | Kun | Zhou, | Xin Zhao, | Yaliang | Li, and |                                   |             |         |        |              |     |
Ji-RongWen.2023b. ReasoningLM:Enablingstruc- pages2814–2828,Dublin,Ireland.Associationfor
tural subgraph reasoning in pre-trained language ComputationalLinguistics.
modelsforquestionansweringoverknowledgegraph.
ApoorvSaxena,AditayTripathi,andParthaTalukdar.
| In Proceedings |     | of the | 2023 Conference |     | on Empiri- |     |     |     |     |     |     |
| -------------- | --- | ------ | --------------- | --- | ---------- | --- | --- | --- | --- | --- | --- |
2020. Improvingmulti-hopquestionansweringover
calMethodsinNaturalLanguageProcessing,pages
knowledgegraphsusingknowledgebaseembeddings.
| 3721–3735, |     | Singapore. | Association |     | for Computa- |     |     |     |     |     |     |
| ---------- | --- | ---------- | ----------- | --- | ------------ | --- | --- | --- | --- | --- | --- |
InProceedingsofthe58thAnnualMeetingoftheAs-
tionalLinguistics.
sociationforComputationalLinguistics,pages4498–
JinhaoJiang,KunZhou,XinZhao,andJi-RongWen. 4507, Online. Association for Computational Lin-
| 2023c. | UniKGQA:Unifiedretrievalandreasoning |     |     |     |     | guistics. |     |     |     |     |     |
| ------ | ------------------------------------ | --- | --- | --- | --- | --------- | --- | --- | --- | --- | --- |
forsolvingmulti-hopquestionansweringoverknowl-
PriyankaSen,SandeepMavadia,andAmirSaffari.2023.
| edgegraph. |     | InTheEleventhInternationalConfer- |     |     |     |     |     |     |     |     |     |
| ---------- | --- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Knowledgegraph-augmentedlanguagemodelsfor
enceonLearningRepresentations.
|     |     |     |     |     |     | complexquestionanswering. |     |     | InProceedingsofthe |     |     |
| --- | --- | --- | --- | --- | --- | ------------------------- | --- | --- | ------------------ | --- | --- |
1stWorkshoponNaturalLanguageReasoningand
TusharKhot,HarshTrivedi,MatthewFinlayson,Yao
Fu,KyleRichardson,PeterClark,andAshishSab- StructuredExplanations(NLRSE),pages1–8.
| harwal.2023. |     | Decomposedprompting: |     |     | Amodular |     |     |     |     |     |     |
| ------------ | --- | -------------------- | --- | --- | -------- | --- | --- | --- | --- | --- | --- |
approachforsolvingcomplextasks. InTheEleventh Jiaxin Shi, Shulin Cao, Lei Hou, Juanzi Li, and Han-
International Conference on Learning Representa- wangZhang.2021. TransferNet: Aneffectiveand
|     |     |     |     |     |     | transparent | framework | for | multi-hop | question | an- |
| --- | --- | --- | --- | --- | --- | ----------- | --------- | --- | --------- | -------- | --- |
tions.
|     |     |     |     |     |     | sweringoverrelationgraph. |     |     | InProceedingsofthe |     |     |
| --- | --- | --- | --- | --- | --- | ------------------------- | --- | --- | ------------------ | --- | --- |
2021ConferenceonEmpiricalMethodsinNatural
| Yunshi | Lan and | Jing Jiang. | 2020. | Query | graph gen- |     |     |     |     |     |     |
| ------ | ------- | ----------- | ----- | ----- | ---------- | --- | --- | --- | --- | --- | --- |
LanguageProcessing,pages4149–4158,Onlineand
erationforansweringmulti-hopcomplexquestions
fromknowledgebases. InProceedingsofthe58th Punta Cana, Dominican Republic. Association for
AnnualMeetingoftheAssociationforComputational ComputationalLinguistics.
Linguistics,pages969–974,Online.Associationfor
|     |     |     |     |     |     | Yiheng Shu, | Zhiwei | Yu, Yuhan | Li, | Börje Karlsson, |     |
| --- | --- | --- | --- | --- | --- | ----------- | ------ | --------- | --- | --------------- | --- |
ComputationalLinguistics.
TingtingMa,YuzhongQu,andChin-YewLin.2022.
Belinda Z. Li, Sewon Min, Srinivasan Iyer, Yashar TIARA:Multi-grainedretrievalforrobustquestion
|                            |     |     |     |                   |     | answeringoverlargeknowledgebase. |     |     |     | InProceed- |     |
| -------------------------- | --- | --- | --- | ----------------- | --- | -------------------------------- | --- | --- | --- | ---------- | --- |
| Mehdad,andWen-tauYih.2020. |     |     |     | Efficientone-pass |     |                                  |     |     |     |            |     |
end-to-endentitylinkingforquestions. InProceed- ingsofthe2022ConferenceonEmpiricalMethods
ingsofthe2020ConferenceonEmpiricalMethods inNaturalLanguageProcessing,pages8108–8121,
in Natural Language Processing (EMNLP), pages AbuDhabi,UnitedArabEmirates.Associationfor
6433–6441,Online.AssociationforComputational ComputationalLinguistics.
Linguistics.
HaitianSun,TaniaBedrax-Weiss,andWilliamCohen.
TianleLi,XueguangMa,AlexZhuang,YuGu,YuSu, 2019. PullNet: Open domain question answering
withiterativeretrievalonknowledgebasesandtext.
| andWenhuChen.2023. |     |     | Few-shotin-contextlearning |     |     |     |     |     |     |     |     |
| ------------------ | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
onknowledgebasequestionanswering. InProceed- InProceedingsofthe2019ConferenceonEmpirical
ingsofthe61stAnnualMeetingoftheAssociationfor Methods in Natural Language Processing and the
ComputationalLinguistics(Volume1: LongPapers), 9thInternationalJointConferenceonNaturalLan-
pages6966–6980,Toronto,Canada.Associationfor guageProcessing(EMNLP-IJCNLP),pages2380–
2390,HongKong,China.AssociationforComputa-
ComputationalLinguistics.
tionalLinguistics.
| LINHAO | LUO, | Yuan-Fang | Li, | Reza Haf, | and Shirui |     |     |     |     |     |     |
| ------ | ---- | --------- | --- | --------- | ---------- | --- | --- | --- | --- | --- | --- |
Pan. 2024. Reasoning on graphs: Faithful and in- HaitianSun,BhuwanDhingra,ManzilZaheer,Kathryn
terpretablelargelanguagemodelreasoning. InThe Mazaitis,RuslanSalakhutdinov,andWilliamCohen.
TwelfthInternationalConferenceonLearningRepre- 2018. Opendomainquestionansweringusingearly
| sentations. |     |     |     |     |     | fusion | of knowledge | bases | and text. | In Proceed- |     |
| ----------- | --- | --- | --- | --- | --- | ------ | ------------ | ----- | --------- | ----------- | --- |
ingsofthe2018ConferenceonEmpiricalMethods
Alexander Miller, Adam Fisch, Jesse Dodge, Amir- inNaturalLanguageProcessing,pages4231–4242,
HosseinKarimi,AntoineBordes,andJasonWeston.
|     |     |     |     |     |     | Brussels, | Belgium. | Association | for | Computational |     |
| --- | --- | --- | --- | --- | --- | --------- | -------- | ----------- | --- | ------------- | --- |
2016. Key-valuememorynetworksfordirectlyread-
Linguistics.
| ing documents. |     | In Proceedings |     | of  | the 2016 Con- |     |     |     |     |     |     |
| -------------- | --- | -------------- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
ferenceonEmpiricalMethodsinNaturalLanguage JiashuoSun,ChengjinXu,LumingyuanTang,Saizhuo
Processing,pages1400–1409,Austin,Texas.Associ- Wang, Chen Lin, Yeyun Gong, Lionel Ni, Heung-
ationforComputationalLinguistics. YeungShum,andJianGuo.2024. Think-on-graph:
11482

Deep and responsible reasoning of large language fact-awarelanguagemodeling. IEEETransactions
modelonknowledgegraph. InTheTwelfthInterna- onKnowledgeandDataEngineering,36:3091–3110.
tionalConferenceonLearningRepresentations.
|     |     |     |     |     |     |     | Shunyu Yao, | Dian | Yu, | Jeffrey | Zhao, | Izhak | Shafran, |
| --- | --- | --- | --- | --- | --- | --- | ----------- | ---- | --- | ------- | ----- | ----- | -------- |
YaweiSun,LinglingZhang,GongCheng,andYuzhong TomGriffiths,YuanCao,andKarthikNarasimhan.
| Qu.2020. | Sparqa: |     | Skeleton-basedsemanticparsing |     |     |     |        |                 |     |                          |     |     |     |
| -------- | ------- | --- | ----------------------------- | --- | --- | --- | ------ | --------------- | --- | ------------------------ | --- | --- | --- |
|          |         |     |                               |     |     |     | 2023a. | Treeofthoughts: |     | Deliberateproblemsolving |     |     |     |
forcomplexquestionsoverknowledgebases. Pro- withlargelanguagemodels. InAdvancesinNeural
ceedingsoftheAAAIConferenceonArtificialIntelli- InformationProcessingSystems,volume36,pages
| gence,34(05):8952–8959. |     |     |     |     |     |     | 11809–11822.CurranAssociates,Inc. |     |     |     |     |     |     |
| ----------------------- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | --- | --- | --- |
AlonTalmorandJonathanBerant.2018. Thewebas Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak
aknowledge-baseforansweringcomplexquestions.
|     |     |     |     |     |     |     | Shafran, | Karthik | R   | Narasimhan, |     | and Yuan | Cao. |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------- | --- | ----------- | --- | -------- | ---- |
InProceedingsofthe2018ConferenceoftheNorth
|     |     |     |     |     |     |     | 2023b. | React: | Synergizing |     | reasoning | and | acting |
| --- | --- | --- | --- | --- | --- | --- | ------ | ------ | ----------- | --- | --------- | --- | ------ |
AmericanChapteroftheAssociationforComputa-
|     |     |     |     |     |     |     | inlanguagemodels. |     |     | InTheEleventhInternational |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | -------------------------- | --- | --- | --- |
tionalLinguistics: HumanLanguageTechnologies, ConferenceonLearningRepresentations.
| Volume | 1 (Long | Papers), |     | pages 641–651, |     | New Or- |     |     |     |     |     |     |     |
| ------ | ------- | -------- | --- | -------------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
leans,Louisiana.AssociationforComputationalLin- XiYe,SemihYavuz,KazumaHashimoto,YingboZhou,
| guistics. |     |     |     |     |     |     | andCaimingXiong.2022. |     |     | RNG-KBQA:Generation |     |     |     |
| --------- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | ------------------- | --- | --- | --- |
augmentediterativerankingforknowledgebaseques-
KehengWang,FeiyuDuan,SiruiWang,PeiguangLi,
|     |     |     |     |     |     |     | tionanswering. |     | InProceedingsofthe60thAnnual |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ---------------------------- | --- | --- | --- | --- |
YunsenXian,ChuantaoYin,WengeRong,andZhang
|     |     |     |     |     |     |     | Meeting | of the | Association | for | Computational |     | Lin- |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------ | ----------- | --- | ------------- | --- | ---- |
Xiong. 2023a. Knowledge-driven cot: Exploring guistics(Volume1: LongPapers),pages6032–6043,
faithful reasoning in llms for knowledge-intensive Dublin,Ireland.AssociationforComputationalLin-
| questionanswering. |     |     | ArXiv,abs/2308.13259. |     |     |     |     |     |     |     |     |     |     |
| ------------------ | --- | --- | --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
guistics.
| Lei Wang, | Wanyu | Xu, | Yihuai | Lan, | Zhiqiang | Hu, |     |     |     |     |     |     |     |
| --------- | ----- | --- | ------ | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
Wen-tauYih,MatthewRichardson,ChrisMeek,Ming-
| Yunshi | Lan,                     | Roy | Ka-Wei | Lee, | and Ee-Peng    | Lim. |            |     |      |            |     |       |        |
| ------ | ------------------------ | --- | ------ | ---- | -------------- | ---- | ---------- | --- | ---- | ---------- | --- | ----- | ------ |
|        |                          |     |        |      |                |      | Wei Chang, | and | Jina | Suh. 2016. | The | value | of se- |
| 2023b. | Plan-and-solveprompting: |     |        |      | Improvingzero- |      |            |     |      |            |     |       |        |
manticparselabelingforknowledgebasequestion
| shot | chain-of-thought |     | reasoning |     | by large | language |            |                                   |     |     |     |     |     |
| ---- | ---------------- | --- | --------- | --- | -------- | -------- | ---------- | --------------------------------- | --- | --- | --- | --- | --- |
|      |                  |     |           |     |          |          | answering. | InProceedingsofthe54thAnnualMeet- |     |     |     |     |     |
models. In Proceedings of the 61st Annual Meet- ingoftheAssociationforComputationalLinguistics
ingoftheAssociationforComputationalLinguistics
|           |                                     |     |     |     |     |     | (Volume  | 2: Short    | Papers), | pages             | 201–206, |     | Berlin,  |
| --------- | ----------------------------------- | --- | --- | --- | --- | --- | -------- | ----------- | -------- | ----------------- | -------- | --- | -------- |
| (Volume1: | LongPapers),pages2609–2634,Toronto, |     |     |     |     |     |          |             |          |                   |          |     |          |
|           |                                     |     |     |     |     |     | Germany. | Association |          | for Computational |          |     | Linguis- |
Canada.AssociationforComputationalLinguistics.
tics.
XuezhiWang,JasonWei,DaleSchuurmans,QuocVLe,
|     |     |     |     |     |     |     | Donghan | Yu, Sheng | Zhang, |     | Patrick | Ng, | Henghui |
| --- | --- | --- | --- | --- | --- | --- | ------- | --------- | ------ | --- | ------- | --- | ------- |
EdH.Chi,SharanNarang,AakankshaChowdhery,
|                     |     |     |                          |     |     |     | Zhu, Alexander |     | Hanbo | Li, | Jun Wang, | Yiqun | Hu, |
| ------------------- | --- | --- | ------------------------ | --- | --- | --- | -------------- | --- | ----- | --- | --------- | ----- | --- |
| andDennyZhou.2023c. |     |     | Self-consistencyimproves |     |     |     |                |     |       |     |           |       |     |
WilliamYangWang,ZhiguoWang,andBingXiang.
| chainofthoughtreasoninginlanguagemodels. |     |     |     |     |     | In  |       |        |       |          |            |     |          |
| ---------------------------------------- | --- | --- | --- | --- | --- | --- | ----- | ------ | ----- | -------- | ---------- | --- | -------- |
|                                          |     |     |     |     |     |     | 2023. | DecAF: | Joint | decoding | of answers |     | and log- |
TheEleventhInternationalConferenceonLearning
|     |     |     |     |     |     |     | ical forms | for | question | answering | over | knowledge |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | -------- | --------- | ---- | --------- | --- |
Representations.
bases. InTheEleventhInternationalConferenceon
LearningRepresentations.
YujieWang,HuZhang,JiyeLiang,andRuLi.2023d.
| Dynamic | heterogeneous-graph |     |     | reasoning |     | with lan- |               |        |      |          |        |     |         |
| ------- | ------------------- | --- | --- | --------- | --- | --------- | ------------- | ------ | ---- | -------- | ------ | --- | ------- |
|         |                     |     |     |           |     |           | Jiajie Zhang, | Shulin | Cao, | Tingjian | Zhang, |     | Xin Lv, |
guagemodelsandknowledgerepresentationlearning
|                                  |     |     |     |     |            |     | Juanzi | Li, Lei | Hou, | Jiaxin Shi, | and | Qi Tian. | 2023. |
| -------------------------------- | --- | --- | --- | --- | ---------- | --- | ------ | ------- | ---- | ----------- | --- | -------- | ----- |
| forcommonsensequestionanswering. |     |     |     |     | InProceed- |     |        |         |      |             |     |          |       |
Reasoningoverhierarchicalquestiondecomposition
ingsofthe61stAnnualMeetingoftheAssociationfor
|                                   |     |     |     |     |              |     | treeforexplainablequestionanswering. |     |     |     |     | InProceed- |     |
| --------------------------------- | --- | --- | --- | --- | ------------ | --- | ------------------------------------ | --- | --- | --- | --- | ---------- | --- |
| ComputationalLinguistics(Volume1: |     |     |     |     | LongPapers), |     |                                      |     |     |     |     |            |     |
ingsofthe61stAnnualMeetingoftheAssociationfor
pages14048–14063,Toronto,Canada.Association
|     |     |     |     |     |     |     | ComputationalLinguistics(Volume1: |     |     |     |     | LongPapers), |     |
| --- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | --- | ------------ | --- |
forComputationalLinguistics.
pages14556–14570,Toronto,Canada.Association
JasonWei,XuezhiWang,DaleSchuurmans,Maarten forComputationalLinguistics.
| Bosma, | brian | ichter, | Fei Xia, | Ed  | Chi, Quoc | V Le, |     |     |     |     |     |     |     |
| ------ | ----- | ------- | -------- | --- | --------- | ----- | --- | --- | --- | --- | --- | --- | --- |
JingZhang,XiaokangZhang,JifanYu,JianTang,Jie
| andDennyZhou. |           | 2022. | Chain-of-thoughtprompt- |          |         |     |                                   |     |     |     |     |          |     |
| ------------- | --------- | ----- | ----------------------- | -------- | ------- | --- | --------------------------------- | --- | --- | --- | --- | -------- | --- |
|               |           |       |                         |          |         |     | Tang,CuipingLi,andHongChen.2022a. |     |     |     |     | Subgraph |     |
| ing elicits   | reasoning |       | in large                | language | models. | In  |                                   |     |     |     |     |          |     |
retrievalenhancedmodelformulti-hopknowledge
AdvancesinNeuralInformationProcessingSystems,
|     |     |     |     |     |     |     | basequestionanswering. |     |     | InProceedingsofthe60th |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------------- | --- | --- | ---------------------- | --- | --- | --- |
volume35,pages24824–24837.CurranAssociates,
| Inc. |     |     |     |     |     |     | AnnualMeetingoftheAssociationforComputational |         |     |         |          |       |       |
| ---- | --- | --- | --- | --- | --- | --- | --------------------------------------------- | ------- | --- | ------- | -------- | ----- | ----- |
|      |     |     |     |     |     |     | Linguistics                                   | (Volume |     | 1: Long | Papers), | pages | 5773– |
YikeWu,NanHu,ShengBi,GuilinQi,J.Ren,Anhuan 5784,Dublin,Ireland.AssociationforComputational
| Xie,andWeiSong.2023. |     |     |     | Retrieve-rewrite-answer: |     |     | Linguistics. |     |     |     |     |     |     |
| -------------------- | --- | --- | --- | ------------------------ | --- | --- | ------------ | --- | --- | --- | --- | --- | --- |
Akg-to-textenhancedllmsframeworkforknowledge
XikunZhang,AntoineBosselut,MichihiroYasunaga,
| graphquestionanswering. |     |     |     | ArXiv,abs/2309.11206. |     |     |     |     |     |     |     |     |     |
| ----------------------- | --- | --- | --- | --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
HongyuRen,PercyLiang,ChristopherDManning,
LinF.Yang,HongyangChen,ZhaoLi,XiaoDing,and andJureLeskovec.2022b. GreaseLM:GraphREA-
Xindong Wu. 2023. Give us the facts: Enhancing Soningenhancedlanguagemodels. InInternational
large language models with knowledge graphs for ConferenceonLearningRepresentations.
11483

Denny Zhou, Nathanael Schärli, Le Hou, Jason Wei, A.2 SelectionoftheImplementationMethod
| Nathan Scales, |     | Xuezhi | Wang, | Dale | Schuurmans, |     |     |     |     |     |     |     |
| -------------- | --- | ------ | ----- | ---- | ----------- | --- | --- | --- | --- | --- | --- | --- |
fortheQuestionComplexityClassifier
ClaireCui,OlivierBousquet,QuocVLe,andEdH.
WechoosetoimplementtheQuestionComplexity
| Chi. 2023. | Least-to-most |     | prompting |     | enables com- |     |     |     |     |     |     |     |
| ---------- | ------------- | --- | --------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
plex reasoning in large language models. In The ClassifierbypromptingLLM,becausetheclassi-
EleventhInternationalConferenceonLearningRep-
ficationtaskinourClassifierisnotsuitabletobe
resentations.
|     |     |     |     |     |     | completed    | through   | training | a        | simple | classifier. | It       |
| --- | --- | --- | --- | --- | --- | ------------ | --------- | -------- | -------- | ------ | ----------- | -------- |
|     |     |     |     |     |     | is difficult | to obtain | labeled  | training |        | data        | for this |
A AdditionalDetailsandDiscussionsof task. Thistaskisusedtodeterminethecomplexity
| OurMethod |     |     |     |     |     | ofaquestion,withthecriterionbeingwhetherthe |     |     |     |     |     |     |
| --------- | --- | --- | --- | --- | --- | ------------------------------------------- | --- | --- | --- | --- | --- | --- |
inputquestioncanberesolvedthroughsingle-step
A.1 AlgorithmofOurProposedFramework ormulti-stepreasoning. Thistaskrequiresclassi-
| KELDaR        |     |              |     |           |      | ficationbasedontheunderstandingandanalyzing |     |            |     |      |     |         |
| ------------- | --- | ------------ | --- | --------- | ---- | ------------------------------------------- | --- | ---------- | --- | ---- | --- | ------- |
|               |     |              |     |           |      | of the question’s                           |     | semantics, | and | does | not | exactly |
| The algorithm | of  | our proposed |     | framework | KEL- |                                             |     |            |     |      |     |         |
correspondtothesingle/multi-hopquestionclassifi-
DaRisshowninAlgorithm1.
|     |     |     |     |     |     | cationstandardandresults. |     |     | Thisisbecause“single- |     |     |     |
| --- | --- | --- | --- | --- | --- | ------------------------- | --- | --- | --------------------- | --- | --- | --- |
step”reasoningcancorrespondtoeithersingle-hop
| Algorithm1KELDaR |     |     |     |     |     | ormulti-hopinaKG.Forexample,thequestions |     |     |     |     |     |     |
| ---------------- | --- | --- | --- | --- | --- | ---------------------------------------- | --- | --- | --- | --- | --- | --- |
question q, KG , maximum depth D of “WhatdoJamaicanpeoplespeak?” and“Whowas
Input:
G
questiondecomposition RichardNixonmarriedto?” arebothsemantically
answerentityaq
| Output: |     |     |     |     |     | understoodassimplequestionsthatcanberesolved |     |     |     |                   |     |     |
| ------- | --- | --- | --- | --- | --- | -------------------------------------------- | --- | --- | --- | ----------------- | --- | --- |
| depth   | 0   |     |     |     |     | throughsingle-stepreasoning.                 |     |     |     | However,theformer |     |     |
1:
←
aq KELDAR(q, ,D,depth) correspondstoasingle-hopfactintheKG,while
2:
| ←                    |     |     | G         |     |     |            |                 |     |           |                |       |        |
| -------------------- | --- | --- | --------- | --- | --- | ---------- | --------------- | --- | --------- | -------------- | ----- | ------ |
| 3:                   |     |     |           |     |     | the latter | corresponds     | to  | a two-hop |                | fact. | There- |
|                      |     |     |           |     |     | fore, it   | is not feasible | to  | label     | the complexity |       | we     |
| 4: functionKELDAR(q, |     |     | ,D,depth) |     |     |            |                 |     |           |                |       |        |
G
cq CLASSIFIER(q) needbasedonthesingle/multi-hopattributeofeach
5:
←
6: ifcq = “Simple”ORdepth = D then question. Consequently, it is difficult to provide
Refq
| 7:  |     | SEARCHER(q, |     |     | )   | accurate“complexity”labelsforeachquestionas |     |     |     |     |     |     |
| --- | --- | ----------- | --- | --- | --- | ------------------------------------------- | --- | --- | --- | --- | --- | --- |
|     |     | ←           |     | G   |     |                                             |     |     |     |     |     |     |
aq ANSWERER(q,Refq) training data for the first step classification task.
8:
←
| 9: else |     |     |     |     |     | Hence,thisclassificationstepcannotbeeffectively |     |     |     |     |     |     |
| ------- | --- | --- | --- | --- | --- | ----------------------------------------------- | --- | --- | --- | --- | --- | --- |
Sqq
| 10: |     | DECOMPOSER(q) |     |     |     | completedbytrainingasimpleclassifier,andwe |     |     |     |     |     |     |
| --- | --- | ------------- | --- | --- | --- | ------------------------------------------ | --- | --- | --- | --- | --- | --- |
←
|     | iflen(Sqq) |     |             |     |     | optedtouseapromptedLLMinstead. |     |     |     |     |     |     |
| --- | ---------- | --- | ----------- | --- | --- | ------------------------------ | --- | --- | --- | --- | --- | --- |
| 11: |            |     | = 0then     |     |     |                                |     |     |     |     |     |     |
|     | Refq       |     | SEARCHER(q, |     | )   |                                |     |     |     |     |     |     |
12:
|     |     | ←   |     |     | G   |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
13: aq ANSWERER(q,Refq) A.3 SelectionoftheFactExtractionRangein
←
| 14: | else |     |     |     |     | KG  |     |     |     |     |     |     |
| --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Sqq []
| 15: |     |     |     |     |     | In the Relevant |     | Fact Searcher, |     | we designed |     | two |
| --- | --- | --- | --- | --- | --- | --------------- | --- | -------------- | --- | ----------- | --- | --- |
←
| 16: | Saq   |     | []       |     |     |                                           |                                 |     |           |     |        |      |
| --- | ----- | --- | -------- | --- | --- | ----------------------------------------- | ------------------------------- | --- | --------- | --- | ------ | ---- |
|     |       |     |          |     |     | strategies                                | for extracting                  |     | subgraphs | of  | facts, | with |
|     |       | ←   | len(Sqq) |     |     |                                           |                                 |     |           |     |        |      |
| 17: | fgori | =   | 0        |     | 1do |                                           |                                 |     |           |     |        |      |
|     |       |     | →        |     | −   | theextractionrangesetwithintwohopsfromthe |                                 |     |           |     |        |      |
|     |       | q   | Sqq[i]   |     |     |                                           |                                 |     |           |     |        |      |
| 18: |       | sq  |          |     |     |                                           |                                 |     |           |     |        |      |
|     |       | i   | ←        |     |     | topicentity.                              | Thisisbecausethequestionstowhom |     |           |     |        |      |
|     |       | q   |          |     | q q |                                           |                                 |     |           |     |        |      |
19: sq replace(sq ,Sa ) theSearcherprovidesreferencefactsarethoseclas-
|     |     | i   | ←   |     | i <i |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
Sqq.append(sq q ) sified as simple questions, which can be solved
| 20: |     |     |     | i   |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
f
|        |          | asqq      |     |     |      | throughone-stepreasoning.                  |     |     | Thefactswithintwo |     |     |     |
| ------ | -------- | --------- | --- | --- | ---- | ------------------------------------------ | --- | --- | ----------------- | --- | --- | --- |
| 21:    |          | i         |     |     | KEL- |                                            |     |     |                   |     |     |     |
|        |          |           |     | f←  |      | hopsfromthetopicentityintheKGtypicallysuf- |     |     |                   |     |     |     |
| DAR(sq | q , ,D,d | g epth+1) |     |     |      |                                            |     |     |                   |     |     |     |
i f
|     | G   |     |     |     |     | ficetoprovidethenecessaryreferenceknowledge |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ------------------------------------------- | --- | --- | --- | --- | --- | --- |
Saq.append(asqq
| 22: |        |     |     | i)  |     |                                    |     |            |     |                |     |      |
| --- | ------ | --- | --- | --- | --- | ---------------------------------- | --- | ---------- | --- | -------------- | --- | ---- |
| f   |        |     |     |     |     | forsuchone-stepreasoningquestions. |     |            |     |                |     |      |
| 23: | endfor |     |     | f   |     |                                    |     |            |     |                |     |      |
|     |        |     |     |     |     | Additionally,                      |     | the reason | for | not extracting |     | just |
aq INTEGRATOR(q,Sqq,Saq)
| 24: |     |     |     |     |     | one-hop | facts lies | in the | presence | of  | compound |     |
| --- | --- | --- | --- | --- | --- | ------- | ---------- | ------ | -------- | --- | -------- | --- |
←
| 25:       | endif |     |     |     |     |             |       |          |     |           |         |     |
| --------- | ----- | --- | --- | --- | --- | ----------- | ----- | -------- | --- | --------- | ------- | --- |
|           |       |     |     |     |     | value type  | (CVT) | entities | in  | the       | KG used | in  |
| 26: endif |       |     |     |     | g   |             |       |          |     |           |         |     |
|           |       |     |     |     |     | this study. | CVTs  | are used | to  | represent | n-ary   | re- |
returnaq
27:
|     |     |     |     |     |     | lations | in KG | and don’t | have | natural | language |     |
| --- | --- | --- | --- | --- | --- | ------- | ----- | --------- | ---- | ------- | -------- | --- |
28: endfunction
|     |     |     |     |     |     | names.           | Some | one-step | reasoning |     | questions | re- |
| --- | --- | --- | --- | --- | --- | ---------------- | ---- | -------- | --------- | --- | --------- | --- |
|     |     |     |     |     |     | quire traversing |      | a CVT    | to reach  | the | answer,   | ne- |
11484

cessitating an additional hop. For instance, as il- Methods WebQSP CWQ
lustratedinFigure6,theKGdoesn’tdirectlycon- IOw/GPT-3.5 64.8 34.4
nect “Richard Nixon” and “Pat Nixon” through IOw/GPT-4 67.0 43.7
a spouse relation. Instead, it requires traversing KELDaR-relw/GPT-3.5 76.7 44.2
|     |     |     |     |     |     |     | KELDaR-rel*w/GPT-3.5 |     |     |     | 79.4 | 53.6 |
| --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- | ---- | ---- |
tworelations,“people.person.spouse_s”and“peo-
|                       |            |     |        |        |               |        | KELDaR-relw/GPT-4  |     |     |     | 82.0 | 51.3 |
| --------------------- | ---------- | --- | ------ | ------ | ------------- | ------ | ------------------ | --- | --- | --- | ---- | ---- |
| ple.marriage.spouse”, |            |     | via a  | CVT to | arrive        | at the |                    |     |     |     |      |      |
|                       |            |     |        |        |               |        | KELDaR-rel*w/GPT-4 |     |     |     | 84.7 | 63.0 |
| answer.               | Therefore, | to  | ensure | that   | the reference |        |                    |     |     |     |      |      |
factsnecessaryforsimplequestionsareincludedin Table4: Performance(EMinpercent)ofIOprompting
thecandidatesubgraph,weneedtoextractatleast methodandourframeworkKELDaR-relondifferent
two-hopfactsfromthetopicentity. LLMs. *indicatestheusageofthegoldentopics.
Question: Who was Richard Nixon married to?
| Answer: Pat Nixon |     |     |     |     |     |     | 4-hopsreasoningonKG,buttherearecompound |     |     |     |     |     |
| ----------------- | --- | --- | --- | --- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- |
valuetypes(CVTs)inFreebase,andeachreason-
CVT
people.marriage.spouse
people.person.spouse_s i n g s te p i n o u r f ra m e w o r k c a n g o t h r o u g h C V T s
|           |            |                        |              |     |       |       | a n d r e f e             | re n c e t w                       | o h o     | p s i n t h e   | K G . A c c o      | r d i n g t o t h e |
| --------- | ---------- | ---------------------- | ------------ | --- | ----- | ----- | ------------------------- | ---------------------------------- | --------- | --------------- | ------------------ | ------------------- |
|           |            |                        |              |     |       |       | d e co m p                | o s it i o n                       | tr e e s  | c o r r e s p o | n d in g t o t h   | e S P A R Q L       |
| Richard   |            |                        |              |     |       | Pat   | annotationsinthedatasets, |                                    |           |                 | complexquestionsin |                     |
| Nixon     |            | people.person.spouse_s |              |     |       | Nixon |                           |                                    |           |                 |                    |                     |
|           |            |                        |              |     |       |       | the datasets              | are                                | all able  | to be           | decomposed         | into a              |
|           |            |                        |              |     |       |       | series of                 | simple                             | questions | through         | one                | decompo-            |
| Figure 6: | An example | of                     | the Compound |     | Value | Type  |                           |                                    |           |                 |                    |                     |
|           |            |                        |              |     |       |       | sitionstep.               | Therefore,toavoidwastingresources, |           |                 |                    |                     |
(CVT)inKG.
wesetthemaximumquestiondecompositiondepth
|     |     |     |     |     |     |     | D to 1, | indicating | that | complex | questions | can be |
| --- | --- | --- | --- | --- | --- | --- | ------- | ---------- | ---- | ------- | --------- | ------ |
decomposedatmostonce.
B AdditionalImplementationDetailsof
Experiments
|                                           |     |     |     |     |     |     | C AdditionalExperimentalResultson |     |     |     |     |     |
| ----------------------------------------- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | --- | --- |
| FortheentitylinkerELQ(Lietal.,2020)usedin |     |     |     |     |     |     | GPT-4                             |     |     |     |     |     |
ourexperiments,wesetitsthresholdto-5follow-
Inordertoexaminetheeffectivenessofourmethod
| ingthesettingsinYeetal.(2022). |     |     |     | Inthecandidate |     |     |     |     |     |     |     |     |
| ------------------------------ | --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- |
ondifferentLLMs,weconductadditionalexperi-
extractionstepoftheSearcher,weutilizedistilbert
astheretrieverfortherelationpruningbasedonits mentsusingGPT-4(gpt-4-turbo)(OpenAI,2023).
|            |          |           |     |        |             |     | Due to | the high | cost | of the | GPT-4 API, | we ran- |
| ---------- | -------- | --------- | --- | ------ | ----------- | --- | ------ | -------- | ---- | ------ | ---------- | ------- |
| similarity | with the | question. |     | During | the pruning |     |        |          |      |        |            |         |
domlyselected300examplesfromeachofthetwo
| process, | we retain | n = | 10 first-hop |     | relations | for |     |     |     |     |     |     |
| -------- | --------- | --- | ------------ | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
candidateextraction,wherem=5ofthemareused datasets. And the experiments are conducted us-
|             |            |     |                 |     |     |      | ingboththeIOprompt, |     |     | representingtheoriginal |     |     |
| ----------- | ---------- | --- | --------------- | --- | --- | ---- | ------------------- | --- | --- | ----------------------- | --- | --- |
| to continue | the search |     | for second-hop. |     | The | max- |                     |     |     |                         |     |     |
few-shotperformanceofGPT-4,andourKELDaR-
| imum number | of  | entities | linked | to  | each first-hop |     |          |                    |     |     |               |         |
| ----------- | --- | -------- | ------ | --- | -------------- | --- | -------- | ------------------ | --- | --- | ------------- | ------- |
|             |     |          |        |     |                |     | rel with | the relation-based |     |     | strategy. The | results |
relationforsecond-hopsearchwaslimitedto200.
areshowninTable4,whichdemonstratethatour
Ifitexceeds200,werandomlyselect200entities.
frameworkachievesbetterperformanceonthesu-
| When pruning | second-hop |     | relations, |     | we retained |     |     |     |     |     |     |     |
| ------------ | ---------- | --- | ---------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
periorGPT-4model.
| p = 5 relations. |     | For the | relation-based |     | extraction |     |     |     |     |     |     |     |
| ---------------- | --- | ------- | -------------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
andretrievalstrategy,afterreranking,whenquery- Moreover,bycomparingwiththeperformance
ofKELDaR-relonGPT-3.5,weobservethateven
| ing first-hop | or second-hop |     |     | entities | based | on the |     |     |     |     |     |     |
| ------------- | ------------- | --- | --- | -------- | ----- | ------ | --- | --- | --- | --- | --- | --- |
withthelesspowerfulGPT-3.5,ourKELDaR-rel
| topic entities                | and | relations | in  | obtained | facts,      | we  |                    |     |     |                          |        |          |
| ----------------------------- | --- | --------- | --- | -------- | ----------- | --- | ------------------ | --- | --- | ------------------------ | ------ | -------- |
|                               |     |           |     |          |             |     | outperforms        | the | IO  | prompting                | method | with the |
| setthemaximumentitycountto20. |     |           |     |          | Ifthelength |     |                    |     |     |                          |        |          |
|                               |     |           |     |          |             |     | morepowerfulGPT-4. |     |     | Thisfurtherhighlightsthe |        |          |
ofthequeryresultexceeded20,werandomlyse-
|     |     |     |     |     |     |     | effectiveness | of  | our | framework | in enhancing | the |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --------- | ------------ | --- |
lect20entitieswhileprioritizingthosewithnatural
performanceofLLMs.
languagenames,tocontrolthelengthofthesubse-
quentpromptsprovidedtotheLLM.
Forthemaximumquestiondecompositiondepth
| inourframework,wesetitto1. |     |     |     | Thisdecisionwas |     |     |     |     |     |     |     |     |
| -------------------------- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- |
madebasedonthecomplexityofthequestionsin
| the two | KGQA datasets |     | used | in our | experiments. |     |     |     |     |     |     |     |
| ------- | ------------- | --- | ---- | ------ | ------------ | --- | --- | --- | --- | --- | --- | --- |
Thequestionsinthesedatasetsmayinvolveupto
11485