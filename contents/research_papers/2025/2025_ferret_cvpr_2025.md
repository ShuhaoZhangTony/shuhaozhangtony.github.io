| CVPR |     |                         |                                         |     |     |     |     | CVPR |
| ---- | --- | ----------------------- | --------------------------------------- | --- | --- | --- | --- | ---- |
| #715 |     |                         |                                         |     |     |     |     | #715 |
|      |     | CVPR2025Submission#715. | CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE. |     |     |     |     |      |
Ferret: An Efficient Online Continual Learning Framework under Varying
|     |     |     | Memory | Constraints |     |     |     |     |
| --- | --- | --- | ------ | ----------- | --- | --- | --- | --- |
AnonymousCVPRsubmission
PaperID715
Abstract tainspreviouslylearnedknowledgewhileacquiringnewin- 036
|     |     |     |     | formation(e.g., | regularization-based[2,9,10,19], |     | replay- |     |
| --- | --- | --- | --- | --------------- | -------------------------------- | --- | ------- | --- |
037
001 In the realm of high-frequency data streams, achieving based [12, 38, 67], sampling-based [3, 4, 82], others [25, 038
real-time learning within varying memory constraints is 64],etc.),and2)enhancingrapidadaptation[11,47],which
| 002 |     |     |     |     |     |     |     | 039 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
003 paramount. This paper presents Ferret, a comprehensive involvesswiftlyadjustingtonewdataortasks(e.g.,latency- 040
framework designed to enhance online accuracy of Online oriented [28, 69], buffering [53, 81], others [26, 68], etc.). 041
004
Ingeneral,theincreasingdemandforresource-limitedsys-
005 Continual Learning (OCL) algorithms while dynamically 042
006 adaptingtovaryingmemorybudgets.Ferretemploysafine- tems that can seamlessly integrate new information with 043
grained pipeline parallelism strategy combined with an it- minimal latency has driven the popularity of OCL [31]
| 007 |     |     |     |     |     |     |     | 044 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
008 erative gradient compensation algorithm, ensuring seam- Therefore,thispaperexploresthechallengeofrapidadap- 045
lesshandlingofhigh-frequencydatawithminimallatency, tationundervaryingmemoryconstraintsinOCL. 046
009
010 and effectively counteracting the challenge of stale gradi- To effectively address the above OCL challenge, it is 047
011 entsinparalleltraining. Toadapttovaryingmemorybud- essential to explore solutions beyond mentioned algorith- 048
gets, its automated model partitioning and pipeline plan- micimprovementsbyalsooptimizingtheunderlyingframe-
| 012 |     |     |     |     |     |     |     | 049 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
013 ning optimizes performance regardless of memory limita- work. An efficient OCL framework must prioritize both 050
tions. Extensive experiments across 20 benchmarks and 5 processingspeedandmemorymanagementunderthelim-
| 014 |     |     |     |     |     |     |     | 051 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
015 integrated OCL algorithms show Ferret’s remarkable ef- ited memory capacity so that it can efficiently handle un- 052
016 ficiency, achieving up to 3.7 lower memory overhead limited data streams with dynamic data distributions for 053
→
to reach the same online accuracy compared to compet- increased online accuracy [11] (i.e., a metric measuring
| 017 |     |     |     |     |     |     |     | 054 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
018 ingmethods. Furthermore,Ferretconsistentlyoutperforms real-time accuracy for continuous new data predictions). 055
019 these methods across diverse memory budgets, underscor- Specifically,theframeworkshouldquicklyprocessincom- 056
020 ingitssuperioradaptability. ThesefindingspositionFerret ingdatatoextractvaluableinsightsandmakeinformedde- 057
021 asapremiersolutionforefficientandadaptiveOCLframe- cisions [55, 73] by minimizing both the latency from data 058
workinreal-timeenvironments. receipt to its initial processing and the time taken for the
| 022 |     |     |     |                  |                       |                 |        | 059 |
| --- | --- | --- | --- | ---------------- | --------------------- | --------------- | ------ | --- |
|     |     |     |     | learning process | itself. Additionally, | the framework   | is not | 060 |
|     |     |     |     | only expected    | to operate within     | a predetermined | memory | 061 |
allotmentbutalsotodemonstratescalabilityacrossdiverse
| 1.Introduction |     |     |     |     |     |     |     | 062 |
| -------------- | --- | --- | --- | --- | --- | --- | --- | --- |
023
|     |     |     |     | memory capacities | [18, 56]. | This duality ensures | that the | 063 |
| --- | --- | --- | --- | ----------------- | --------- | -------------------- | -------- | --- |
DataiscrucialforMachineLearning(ML),formingtheba- framework remains efficient regardless of the memory re-
| 024 |     |     |     |     |     |     |     | 064 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
025 sis for algorithms and models [29, 52, 74]. In real-world sources available, thereby maintaining consistent perfor- 065
026 applications[23,70],dataarrivesinhigh-frequencystreams manceindynamicenvironments. 066
| with varying | distributions | [51, 77]. This | makes data time- |                                             |     |     |     |     |
| ------------ | ------------- | -------------- | ---------------- | ------------------------------------------- | --- | --- | --- | --- |
| 027          |               |                |                  | NumerousMLframeworkshavebeenproposedthatof- |     |     |     | 067 |
028 sensitive and short-lived [11, 47, 75], rendering offline- fer innovative approaches to scalable and flexible ML de- 068
trainedmodelsbasedonhistoricaldataineffectiveforfuture velopment[5,17,30,35,36,41,54,83,85]. Forinstance,
| 029 |     |     |     |     |     |     |     | 069 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
030 dataofunknowndistribution[60]. Thus,thesignificanceof Ray [54] facilitates distributed computing on any scale, 070
031 Online Continual Learning (OCL) is growing [6, 39, 76], whilePytorch[5]excelsindynamiccomputationgraphsfor
071
asitenableslearningoverdatastreamstoadapttodynamic
032 model training. Despite their advancements, these frame- 072
033 datadistributionsinreal-time. worksoftendonotspecificallyaddresstheuniquerequire- 073
In the literature, OCL tackles two main challenges: 1) ments of learning over streaming data [28], which is a
| 034 |     |     |     |     |     |     |     | 074 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
035 mitigatingcatastrophicforgetting[50],wherethemodelre- key focus of OCL. Recently, there are some frameworks 075
1

| CVPR |     |     |     |                         |     |     |     |                                         |     |     |     |     |     |     |     | CVPR |
| ---- | --- | --- | --- | ----------------------- | --- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---- |
| #715 |     |     |     |                         |     |     |     |                                         |     |     |     |     |     |     |     | #715 |
|      |     |     |     | CVPR2025Submission#715. |     |     |     | CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE. |     |     |     |     |     |     |     |      |
076 dedicated to OCL by prioritizing real-time data process- reducecatastrophicforgetting,including: 1)regularization- 128
ing [43, 45, 79]. Nevertheless, they either lack general basedtechniques[2,9,10,19]imposeconstraintsonweight
| 077 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 129 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
078 applicability or fail to balance processing speed with con- updates to preserve important parameters that are crucial 130
079 sumedmemory,leadingtoreducedonlineaccuracyandlow forpasttasks. 2)replay-basedtechniques[12,38,67]help 131
080 memory scalability, underscoring the need for innovative the model to rehearse old knowledge alongside new in- 132
081 solutionsinthisdomain. formation by maintaining a memory of previous data. 3) 133
In this work, we propose an OCL framework named sampling-basedtechniques[3,4,82]enhancetheefficiency
| 082 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 134 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
083 Ferret, designed to achieve eFficiEnt pipeline leaRning ofreplaymechanismsbyselectivelychoosingthemostrele- 135
084 over fRequEnt data sTreams for enhanced online accu- vantdatasamplesforrehearsal.4)othertechniques[25,64] 136
racy across memory constraints. Ferret comprises a fine- focus on various novel approaches, such as modular net-
| 085 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 137 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
086 grained pipeline parallelism component with an iterative worksanddynamicallyallocatedresources, toprotectpre- 138
gradient compensation algorithm and a model partitioning viouslylearnedinformationfrombeingoverwritten.
| 087 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 139 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
088 andpipelineplanningcomponent. Firstly,tofacilitaterapid Enhancing rapid adaptation: Rapid adaptation is in 140
089 adaptation over frequent streaming data for higher online scenarioswhereimmediateprocessingofincomingdatais 141
accuracy, Ferret employs a fine-grained pipeline parallel required [11, 47], which is often quantified by the online
| 090 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 142 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
t
091 strategy, allowing precise control over each pipeline stage accuracy [11] defined as oacc (t) = acc(yi,yˆi)/t. 143
i=1
forseamlessdatamanagement.Additionally,tomitigatethe Strategies developed to enhance A rapid adaptation include:
| 092 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 144 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
!
093 impact of stale gradients in parallel processing, Ferret in- 1)latency-orientedtechniques[28,69]iterativelygenerate 145
094 tegratesanoveliterativegradientcompensationalgorithm. predictionsandupdatemodelparametersimmediatelyupon 146
Secondly,toguidetheselectionofoptimalmodelpartition thearrivalofstreamingdatabydiscardingdatathatcannot
| 095 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 147 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
096 schemes and pipeline configurations under given memory beprocessedintime. 2)buffering-orientedtechniques[53, 148
097 budgets, Ferret solves the involved multivariate optimiza- 81] buffers and samples incoming data streams and apply
149
098 tionproblemthroughabi-leveloptimizationalgorithm. periodic batch-training [61]. 3) other techniques [26, 68] 150
099 Ourcontributionscanbeoutlinedasfollows: introduce novel methods like adapting model structures in 151
responsetonewtasksandlearninghowtolearnefficiently,
100 • We propose a framework named Ferret for boosting the 152
101 online accuracy of OCL algorithms under memory con- toadapttodynamicdatadistributionsrapidly. 153
|     | straints. |     | To the | best of | our knowledge, |     | this is | the first |     |     |     |     |     |     |     |     |
| --- | --------- | --- | ------ | ------- | -------------- | --- | ------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
102
3.Motivation
| 103 | workfocusingonenhancingOCLbyemployingpipeline |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 154 |
| --- | --------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
parallelismandscheduling.
| 104 |     |     |     |     |     |     |     |     | To effectively | navigate |     | the challenges |     | posed | by OCL, it |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------- | -------- | --- | -------------- | --- | ----- | ---------- | --- |
155
| 105 | • Toprocesshigh-frequentdatastreamswithoutdelay,Fer- |         |                |            |          |             |     |           |                                                   |           |     |          |        |        |          |     |
| --- | ---------------------------------------------------- | ------- | -------------- | ---------- | -------- | ----------- | --- | --------- | ------------------------------------------------- | --------- | --- | -------- | ------ | ------ | -------- | --- |
|     |                                                      |         |                |            |          |             |     |           | is crucial                                        | to expand | our | approach | beyond | merely | refining | 156 |
| 106 | ret                                                  | employs | a fine-grained |            | pipeline | parallelism |     | strategy, |                                                   |           |     |          |        |        |          |     |
|     |                                                      |         |                |            |          |             |     |           | mentionedOCLalgorithms,byalsoenhancingtheunderly- |           |     |          |        |        |          | 157 |
|     | enabling                                             |         | interleaved    | processing |          | of incoming |     | streaming |                                                   |           |     |          |        |        |          |     |
107
|     |                                                      |              |     |        |          |              |     |          | ingMLframeworktoadaptivelybalanceprocessingspeed |               |          |            |            |        |           | 158 |
| --- | ---------------------------------------------------- | ------------ | --- | ------ | -------- | ------------ | --- | -------- | ------------------------------------------------ | ------------- | -------- | ---------- | ---------- | ------ | --------- | --- |
| 108 | data.                                                | Furthermore, |     | Ferret | utilizes | an iterative |     | gradient |                                                  |               |          |            |            |        |           |     |
|     |                                                      |              |     |        |          |              |     |          | with efficient                                   | memory        |          | management | under      | memory | con-      | 159 |
| 109 | compensationalgorithmtoefficientlymitigatetheeffects |              |     |        |          |              |     |          |                                                  |               |          |            |            |        |           |     |
|     |                                                      |              |     |        |          |              |     |          | straints.                                        | Particularly, | boosting |            | processing | speed  | is essen- |     |
160
| 110   | ofstalegradientsacrossdifferentpipelinestages,prevent- |           |            |             |          |     |     |     |                 |      |            |     |                       |     |           |     |
| ----- | ------------------------------------------------------ | --------- | ---------- | ----------- | -------- | --- | --- | --- | --------------- | ---- | ---------- | --- | --------------------- | --- | --------- | --- |
|       |                                                        |           |            |             |          |     |     |     | tially reducing | data | processing |     | time, which           | can | be repre- | 161 |
| 1 1 1 | i ng                                                   | p e r f o | r m a n ce | d e gr a da | t io n . |     |     |     |                 |      |            |     |                       |     |           |     |
|       |                                                        |           |            |             |          |     |     |     | sentedastl+F/R  |      | P ,wheretl |     | denotesthelatencyfrom |     |           | 162 |
• W e d e r i v e t h e op t im a l p a ra m eters for automatic model h h
1 1 2 data arrival to processing, F denotes the required floating
163
| 113   | partitioning              |                | and       | pipeline    | planning     | by            | mapping  | the in-         |                                                       |       |               |              |                |             |           |     |
| ----- | ------------------------- | -------------- | --------- | ----------- | ------------ | ------------- | -------- | --------------- | ----------------------------------------------------- | ----- | ------------- | ------------ | -------------- | ----------- | --------- | --- |
|       |                           |                |           |             |              |               |          |                 | point operations                                      |       | (FLOPS)       | by           | the underlying |             | OCL algo- | 164 |
| 114   | volved                    | multi-variable |           |             | optimization | problem       | into     | a bi-           |                                                       |       |               |              |                |             |           |     |
|       |                           |                |           |             |              |               |          |                 | rithm, R                                              | and P | denote        | the hardware |                | utilization | rate and  |     |
|       |                           |                |           |             |              |               |          |                 |                                                       | h     | h             |              |                |             |           | 165 |
| 115   | leveloptimizationproblem. |                |           |             |              |               |          |                 |                                                       |       |               |              |                |             |           |     |
|       |                           |                |           |             |              |               |          |                 | thetheoreticalfloatingpointoperationspersecond(FLOPs) |       |               |              |                |             |           | 166 |
| 1 1 6 | • E x                     | t en s i ve    | e x p e r | i m e n t s | o n 2 0      | b e n c h m a | r ks d e | m o ns tr a t e |                                                       |       |               |              |                |             |           |     |
|       |                           |                |           |             |              |               |          |                 | of the hardware,                                      |       | respectively. |              | Clearly,       | only tl     | and R are | 167 |
t h a t o u r pr o p o s e d f r a m e w or k c o n s is t en t ly en a b le s m o r e h
| 1 1 7 |     |     |     |     |     |     |     |     | optimizablebytheframework. |     |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- |
168
| 118 | efficientOCLwithingivenmemorybudgets. |     |     |     |     |     | Thecodeis |     |                                                 |           |     |          |         |           |       |     |
| --- | ------------------------------------- | --- | --- | --- | --- | --- | --------- | --- | ----------------------------------------------- | --------- | --- | -------- | ------- | --------- | ----- | --- |
|     |                                       |     |     |     |     |     |           |     | ExistingMLframeworksmainlyfocuson:1)distributed |           |     |          |         |           |       | 169 |
| 119 | open-sourcedforreproduction.          |     |     |     |     |     |           |     |                                                 |           |     |          |         |           |       |     |
|     |                                       |     |     |     |     |     |           |     | and parallel                                    | computing |     | [41, 54, | 85], 2) | Optimized | model |     |
170
2.RelatedWork traininganddeployment[5,35,83],and3)othersincluding 171
120
|     |     |     |     |     |     |     |     |     | security | [17, 36] | and debugging |     | [30]. | These | frameworks | 172 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | -------- | ------------- | --- | ----- | ----- | ---------- | --- |
ThecurrentOCLresearchfocusesontwoareas: mitigating facilitate scalable and flexible ML, yet they rarely tackle
| 121 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 173 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
122 catastrophicforgettingandenhancingrapidadaptation. the challenges of managing streaming data. Regrettably, 174
Mitigatingcatastrophicforgetting: Catastrophicfor- thefewMLframeworksdesignedforOCL[43,45,79]ei-
| 123 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 175 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
124 getting, often quantified by the test accuracy [28, 45, 47], ther lack general applicability or fail to concurrently opti- 176
125 poses a significant barrier to the efficacy of OCL in dy- mize tl and R within memory limitations. For instance, 177
h
namicenvironments,wheretheabilitytopreservehistorical Kraken[79]istailoredforrecommendationsystems. Con-
| 126 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 178 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
127 informationiscrucial. Multipledirectionshaveemergedto versely, while Camel [45] and LifeLearner [43] boost R h 179
2

| CVPR |     |     |     |                         |     |     |                                         |     |     |     |     |     |     |     |     |     | CVPR |
| ---- | --- | --- | --- | ----------------------- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| #715 |     |     |     |                         |     |     |                                         |     |     |     |     |     |     |     |     |     | #715 |
|      |     |     |     | CVPR2025Submission#715. |     |     | CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE. |     |     |     |     |     |     |     |     |     |      |
180 via buffering and sampling, they also raise tl and memory (B). In A, the model is trained using Ferret’s fine-grained 227
usage,reducingonlineaccuracy. pipeline parallelism to manage high-frequent data streams
| 181 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 228 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
182 Pipeline parallelism can naturally process sequential withminimallatency. Giventhehighdegreeofparallelism 229
183 streaming data while utilizing batch training. This moti- withinthesystem,gradientstalenesscanbecomesignificant 230
184 vatesustoincorporatepipelineparallelismintoOCLtosi- andvariable,potentiallycausingseveremodeldegradation. 231
185 multaneouslyminimizetl andmaximizeR underagiven Tomitigatethisissue,aniterativegradientcompensational- 232
h
memory budget, thereby boosting online accuracy. We gorithmisappliedpriortomodelupdating. InB,themodel
| 186 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 233 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
187 achieve this balance through refined scheduling strategies isprofiledtooptimizeEq.2,determiningtheoptimalmodel 234
188 and better hardware integration, ensuring optimal resource partitionschemeandpipelineconfiguration. 235
utilizationwithintheconstraintsofmemorybudgets.
189
|     |     |     |     |     |     |     |     |     | 5.1.Fine-grainedPipelineParallelism |     |     |     |     |     |     |     | 236 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
4.ProblemFormulation
| 190 |     |     |     |     |     |     |     |     | 5.1.1 | Architecturaldesign |     |     |     |     |     |     | 237 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | ------------------- | --- | --- | --- | --- | --- | --- | --- |
191 In this section, we define the problem we aim to address. Ferret utilizes an asynchronous pipeline parallelism strat- 238
|     | Note | that | the notations | used throughout |     | this | paper | are de- |                                                  |     |     |     |     |     |     |     |     |
| --- | ---- | ---- | ------------- | --------------- | --- | ---- | ----- | ------- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
| 192 |      |      |               |                 |     |      |       |         | egywith1F1Bschedulingtoprocessstreamingdataimme- |     |     |     |     |     |     |     | 239 |
193 finedinSec.9intheappendix. diately upon arrival. To efficiently handle high-frequency 240
Consideragenerallearningproblemdefinedoverafea- data streams without delay, it is imperative that tf +tb is
| 194 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 241 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
tf +tb
195 ture space and a label space that aims to minimize a minimized. However, is inherently lower bounded 242
|     |     |     | X   |     | Y   |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
196 lossfunctio n (Dt;ω)wheredat aDt =(xt,yt) by (max tˆf + max tˆb ), indicating that some of the data 243
|     |     |     | L   |     |     |     | ↑X→Y |     |     | i   | i   | i i |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
arrivesattimestampt. Ourobjectiveistorapidlyderivean must be discarded if td is less than this lower bound. To
| 197 |                |     |        |       |     |     |     |     |     |     |     |     |     |     |     |     | 244 |
| --- | -------------- | --- | ------ | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | updatedmodelωt |     | withDt | andωt | 1   |     |     |     |     |     |     |     |     |     |     |     |     |
198 → underagivenmemory prevent the loss of data, Ferret enhances system through- 245
constraintM,sothattheonlineaccuracyofωt ishigh. Un- put by deploying N (tf +tb)/td workers, each per-
| 199 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 246 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     |     |     |     |     | ↔ ↗ |     | ↘   |     |     |     |
200 like updating a model offline with a pre-collected dataset, forming pipeline parallelism concurrently over interleaved 247
201 Dtwillbediscardedafterupdatingωt 1inOCL. datastreams. Specifically,thei-thdataisprocessedbythe 248
→
Directlyoptimizingonlineaccuracyinourobjectivedur- n-th worker if and only if i cd mod (tf + tb)/td .
| 202 |     |     |     |     |     |     |     |     |     |     |     |     |     | n   |     |     | 249 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     |     |     |     |     |     | ≃   |     | ↗   | ↘   |     |
203 ingruntimeishard,astheonlineaccuracyisonlycalculable This strategy, while effective in reducing latency, signifi- 250
204 after obtaining labels of incoming data. Instead, we mea- cantlyincreasesmemoryusage. Therefore,Ferretbalances
251
205 sure the volume of data values learned by the model as a thetrade-offsbetween and bycollectivelyemploying 252
|     |     |     |     |     |     |     |     |     |     |     |     | R   | M   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
206 proxytoestimateandoptimizeonlineaccuracy. Formally, fourtechniques:activationrecomputation[13],gradientac- 253
assuming Dt has an initial data value of V and its data cumulation[58],back-propagationomissionandworkerre-
| 207 |     |     |     |     |     | Dt  |     |     |     |     |     |     |     |     |     |     | 254 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
208 valuedeclinesasatime-dependentexponentialdecayfunc- moval,allowingprecisecontrolovereachpipelinestagefor 255
209 tion[75],wedefinetheAdaptationRateasfollows. seamlessdatamanagement. 256
|     |            |     |                 |      |          |       |             |      | T1.                                                  | Activation |     | Recomputation: |     | Activation | recompu-      |     | 257 |
| --- | ---------- | --- | --------------- | ---- | -------- | ----- | ----------- | ---- | ---------------------------------------------------- | ---------- | --- | -------------- | --- | ---------- | ------------- | --- | --- |
| 210 | Definition |     | 4.1 (Adaptation | Rate | of       | A OCL | framework). |      |                                                      |            |     |                |     |            |               |     |     |
|     |            |     |                 |      |          |       |             |      | tationexchangesadditionalcomputationaloverheadforre- |            |     |                |     |            |               |     | 258 |
| 211 | Consider   |     | a OCL framework |      | receives | a     | data        | Dt = |                                                      |            |     |                |     |            |               |     |     |
|     |            |     |                 |      | A        |       |             |      | ducedmemoryusage,asFig.1aillustrated.                |            |     |                |     |            | InFerret,abi- |     |     |
(xt,yt) at timestamp t that h as an initial data value of 259
| 212 |     |     |     |     |     |     |     |     |     |     | cr  |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
V , and updates a model ωt 1 in the hypothesis space ! nary indicator within configuration C denotes whether 260
| 213 | Dt  |     |     | →   |     |     |     |     |     |     | n   |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
t+rt (rt Dt activation recomputation is enabled for the n-th worker. 261
| 214 | at  | timestamp |     | = + | if  | is discarded). |     | Let |                                              |     |     |     |     |     |        |     |     |
| --- | --- | --------- | --- | --- | --- | -------------- | --- | --- | -------------------------------------------- | --- | --- | --- | --- | --- | ------ | --- | --- |
|     |     |           |     |     | ↓   |                |     |     | Whenactivationrecomputationisenabled(i.e.,cr |     |     |     |     |     | =1),an |     |     |
215 thedatavalueofDAt decAlineas atime-dependentexponen- n 262
216 tialdecayfunction,andnewdataDtconstantlyarrivesuntil additional forward pass is executed prior to the backward 263
t=T. TheAdaptationRateof isdefinedas pass,effectivelymanagingmemoryconsumptionattheex-
| 217 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 264 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
A
t pen se of in c r e a s e d co m p ut a t io n a l lo ad . 2 6 5
T e→ cr V
RT = t=0 A Dt , (1) T 2. G r a d i e n t A cc u m u l a ti o n : G ra dient Accumulation 2 6 6
| 218 |                                               |                                           |     |     | T   |     |     |     |                                                  |           |         |       |              |         |            |     |     |
| --- | --------------------------------------------- | ----------------------------------------- | --- | --- | --- | --- | --- | --- | ------------------------------------------------ | --------- | ------- | ----- | ------------ | ------- | ---------- | --- | --- |
|     |                                               |                                           | A   |     |     |     |     |     | allows                                           | multiple  | forward |       | and backward | passes  | to accumu- |     |     |
|     |                                               |                                           |     | !   |     |     |     |     |                                                  |           |         |       |              |         |            |     | 267 |
| 219 | wheretheconstantcdescribesthereductionrateofV |                                           |     |     |     |     |     | .   |                                                  |           |         |       |              |         |            |     |     |
|     |                                               |                                           |     |     |     |     |     | Dt  | late                                             | gradients | before  | model | updating,    | thereby | decreasing |     | 268 |
|     |                                               |                                           |     |     |     |     |     |     | thefrequencyofparameterupdates,asFig.1bdepicted. |           |         |       |              |         |            | In  |     |
| 220 |                                               | WithDef.4.1,ourobjectivecanbeformulatedas |     |     |     |     |     |     |                                                  |           |         |       |              |         |            |     | 269 |
ca
|     |     |     |     |        |     |     |     |     | F e r r | e t, t h e | p a ra m e | te r  | in c o n fi | gu r a t io n | C d e fa u l t | s to 1 , | 2 7 0 |
| --- | --- | --- | --- | ------ | --- | --- | --- | --- | ------- | ---------- | ---------- | ----- | ----------- | ------------- | -------------- | -------- | ----- |
|     |     |     | max | T s.t. |     | M,  |     | (2) |         |            |            | n , j |             |               |                |          |       |
221 in d i c a ti n g t h e n u m b er o f g ra d i en t a c c u m u lati o n s t e p s be - 2 7 1
|     |       |     |                        | R A | MA → |                 |     |     |      |       |          |     |          |          |                  |     |     |
| --- | ----- | --- | ---------------------- | --- | ---- | --------------- | --- | --- | ---- | ----- | -------- | --- | -------- | -------- | ---------------- | --- | --- |
|     |       |     | A                      |     |      |                 |     |     | fore | model | updating | for | the j-th | stage in | the n-th worker. |     |     |
|     | where |     | isthememoryfootprintof |     |      | duringtraining. |     |     |      |       |          |     |          |          |                  |     | 272 |
222
|     |               | MA  |     |     |     | A   |     |     | Byutilizinggradientaccumulation,thej-thstageinthen- |                                         |     |     |     |         |             |     | 273 |
| --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | --------------------------------------- | --- | --- | --- | ------- | ----------- | --- | --- |
|     |               |     |     |     |     |     |     |     | thworkeronlystores(1+                               |                                         |     |     | (P  | j 1)/ca | ),insteadof |     |     |
|     | 5.Methodology |     |     |     |     |     |     |     |                                                     |                                         |     |     |     |         | n,j↘        |     | 274 |
| 223 |               |     |     |     |     |     |     |     |                                                     |                                         |     |     | ↗ ⇐ | ⇐       |             |     |     |
|     |               |     |     |     |     |     |     |     | (P                                                  | j),models,therebyoptimizingmemoryusage. |     |     |     |         |             |     | 275 |
⇐
224 The workflow of Ferret is shown in Fig. 1, comprising a T3. Back-propagation Omission: To further reduce 276
fine-grained pipeline parallelism component (A), followed memory usage, back-propagation omission skips all back-
| 225 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 277 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
226 by a model partitioning and pipeline planning component wardpassesthatdependonpreviousmodelparameters, as 278
3

CVPR CVPR
#715 #715
CVPR2025Submission#715. CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE.
…… ……
…… ……
$" …… $"#$#% …… $"#&$'& $"#&$
" ! " !" # ! " !"
" ! " #"$# # ! " #"$#
" ! " %"$&%#&# # ! " %"$&%#&#
segatS1−∗(
=&
…… ……
…… ……
…… ……
…… …… …… …… …… ……
A: Fine-grained Pipeline Parallelism with !∗and "∗ B: Model Partitioning and !! !" !# !$
$ ," " " ! " !" , u h p a d s … a b te e d en Ite C ra o # t m ! i " v !" p e e G ns r a a t d i i o e n nts , - " ! # !" ) - , ! " !" # $ % # … - , ! "# !"$ & ' $ % ' & % ' - , ! "# !"$ & ' $ % ' & ) ( ,"#&$ P M ip o e d l e i l ne P C l o a M n n s e n t m r i a n o in g ry t . S S t t a a g g F e e o 1 0 rward 0 B 0 ackw 0 ard 1 0 U 1 0 pdat 0 1 e 1 2 Rec 2 1 ompu 2 1 tatio 2 3 T n ime 3 2
Profiling
(a)ActivationRecomputation(T1)
Forward Model Update $"#% $"#$#) $"#&$')
All workers Model !! !" !# !$ !% !&
Backward $"#) $"#$ $"#&$'% $"#&$#) update the Profile Stage 0 0 1 0 2 1 3 2 4 3 5
same model Stage 1 0 0 1 1 2 2 3 3 4 4
Time
Model Partitioning Forward Backward Update
Model and Pipeline Planning (b)GradientAccumulation(T2) maxℛ* + 3.5.ℳ*≤.
!! !" !# !$ !% !&
Optimal Model Stage 0 0 1 0 2 3 2 4 5
Partition Scheme (∗ Stage 1 0 0 1 1 2 2 3 3 4 4
+Workers Optimal Pipeline Time Configuration 8∗ Forward Backward Update
(c)BackpropagationOmission(T3)
Figure1.TheoverallworkflowofFerret.InA,basedontheoptimalmodelpartitionschemeL↑andpipeline !! !" Remove !! !"
Stage 0 0 1
configurationC↑,N workersarespawnedtoinitiatefine-grainedpipelineparallelismthatconsumesstream- Stage 1 0 0
ingdatainterleavedly,andupdatethesamemodelasynchronouslybyiterativelycompensatingstalegradients. The !-thworker The !-thworker
InB,L↑andC↑areobtainedbyoptimizingEq.2. (d)WorkerRemoval(T4)
279 Fig. 1c illustrated. In Ferret, the parameter co n,j in con- stages of the model are updated by gradients with varying 304
280 figuration C defaults to 0, indicating the number of back- staleness. To surmount the above challenges, Ferret firstly 305
281 propagation omission steps for the j-th stage in the n-the proposes to efficiently approximate (Dt → 1;ωt) using 306
⇒L
282 worker. Thisapproachreducesmemoryoverheadbyelimi- (Dt → 1;ωt → 1) by a cost-effective approximator A () 307
⇒L I ·
283 natingtheneedtostoremultipleversionsofmodels. based on Taylor series expansion and the Fisher informa- 308
284 T4. WorkerRemoval: SpawningN workersincreases tionmatrix. Then,weextendthisapproximatortoapprox- 309
285 thesystemthroughputbutalsolinearlyincreasesthemem- imate (Dt → 1;ωt+ω → 1)using (Dt → 1;ωt → 1)byitera- 310
⇒L ⇒L
286 ory footprint. When resources are highly constrained, the tivelyapplyingA (). 311
I ·
287 n-th worker can be shut down and removed to reduce the Gradients Compensation via Taylor Series Expan- 312
2 2 8 8 8 9 me F m i o n r a y lly o , v a e s rh su e m ad e b t y he se i t n t i i t n i g al c d d n at = a v ⇐ a 1 lu i e n o c f on an fi y gu d r a a t t a io i n s C V D . , s ⇒ io L n ( : Dt I → n 1; p ω ri t o → r 1) w [ o 5 r 7 k , , 5 ⇒ 8] L a ( n D d t → ca 1 n ;ω b t) e r w eg as ard n e a d ive a l s y a s z e e t ro to - 3 3 1 1 3 4
290 and the retained value of the data when updating a sub- orderTaylorseriesexpansion,leadingtoahighapproxima- 315
2 2 2 9 9 9 1 2 3 s s th e u e t bs fi o e f n t e m m -g o o r d a d e i e n l l e p d p a a r p r a i a m p m e e l e t i e n te r e r s s p , i a s r g a p i l v r l o e e n p li o s L m rtio s a t n n r a d a l te C t g o y , t c h R a e n s a b i n z e d e re M o s f p t e h o c e f - t t b i h y o e n a a e fi p r p r r s o r t o r - x o || i r ⇒ m de L a r t ( i T o D a n y t → e lo r 1 r r ; o s ω r e , t r ) w i ⇐ e e s ⇒ e e x x L p p ( a a D n n d s t i → o ⇒ 1 n ; L a ω ( s t D → fo 1 t l → ) l | o 1| 2 w ; . ω s T t : ) o a r t ed ω u t → c 1 e 3 3 3 1 1 1 6 7 8
294 tivelyformulatedas (Dt
→
1;ωt) (Dt
→
1;ωt
→
1)+H( (Dt
→
1;ωt
→
1)) (ωt ωt
→
1),
↘L ≃↘L L ⇐ ↓
2 2 9 9 5 6 R LC T F M = e→ ( c N n "d n c = c ( → ↓ ( o 1 P 1 0 + P " i= j + → ) 0 t 1 f 1 ! + k (P P j= → → | 0 w [ i 1 i + ( , i j | | P w )tb j + | ) c 1 r n c ] a n 1 (P , ) i ( → t c i f a n " j + , = + i j → 0 )t 1 t f b A )V + i D ,j c , r w tf h ) e , reA i,j = (3) h a L g w n a r ( a v h · a d ) e e p u r i p r e s a e r l H a v o ly e x n ( a i · c e m ) l o g e d n a d a e v t t i i n t e v o h o r e n a g t t e l e o o s s t f g h t t t h - e o h l e i e F k i H t i e s H s l e h i o e s h e p s s o r s i t a o i i i m a n d n n f a m l o l m o r a s v m a t s a r t i l a r [ x u i 2 t x i e 7 o o , i f ω n f 6 ↑ · . t m 2 h d P ] e a u . r t r e l A r i o v i n x s s i g s o s s u u t f e m r s u r a n v w i i n n c e o g t s i i n r ( o k ω a g 5 n s s t ) , 3 3 3 3 3 3 1 2 2 2 2 2 9 0 1 2 3 4
{ n,k | ↑ ↓ } n wecanachieveanunbiasedestimationofH()by 325
N 1P 1 ·
297 M F = → → (1+ ↔ P ↓ ca i ↓ 1 ↗↓ co n,i )( | w i | + ε t ↭ED,ω→||I (ωt) ↓ H( L ( · ;ωt)) ||⇒ 0,t ⇒ + ⇑ . (6) 326
c n "d n = ↓ 1 0 " i=0 n,i b T y o i f ts ur d t i h a e g r o m na it l i e g l a e t m es e p n a ts ce w c it o h m a p h le y x p i e t r y - , p I a ( ra ω m )i e s te a r p ε pr t o o x c im on a t t r e o d l 3 3 2 2 7 8
298 | a i |↓ cr n
Li+1→ 1
| aˆ l | ), (4) variance,i.e., 329
l="Li+1 H( (;ωt)) ϑ (;ωt → 1) (;ωt → 1)↔. (7) 330
L · ≃ ↘L · ⇐L ·
299 whereLCM( · )denotestheLeastCommonMultiple. IncorporatingEq.7intoEq.5,weobtain: 331
(Dt → 1;ωt) A ( (Dt → 1;ωt → 1),ωt,ωt → 1)= (8) 332
↘L ≃ I ↘L
300 5.1.2 IterativeGradientCompensation (Dt → 1;ωt → 1)+ϑ (Dt → 1;ωt → 1) (Dt → 1;ωt → 1)↔ !ω, 333
↘L ↘L ⇐↘L ⇐
301 Sincefine-grainedpipelineparallelismisasynchronous,the whereA ()servesastheapproximatortocompensate . 334
I · ·
302 modelwillbeinevitablyupdatedbystalegradients,leading Iterative Compensation: More generally, to approx- 335
303 to performance degradation. Moreover, different pipeline imate (Dt → 1;ωt+ω → 1) using (Dt → 1;ωt → 1), Ferret 336
⇒L ⇒L
4

CVPR CVPR
#715 #715
CVPR2025Submission#715. CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE.
∇ℒ $!,&! is delayed for (iterations
∇ℒ($!"#,&!"#)
! !−# …… !+# !
&! &!$#
Approximate ∇ℒ($!,&!$%)
Approximate ∇ℒ($!,&!$#)and apply
the delayed-compensated gradients
!+1 !−#+1 …… !+#−1 !−1
Approximate ∇ℒ($!,&!$&) Approximate ∇ℒ($!,&!$#"%)
Forward Backward Update Time
Figure2. Toadapttodifferentlevelsofstalenessinfine-grained
pipelineparallelism, (Dt,ωt+ε)isiterativelyapproximatedby
↘L (Dt,ωt).
↘L
(&∇ℒ($',&')
∇ℒ($!"#,&!"#) …… ∇ℒ($!"$,&!"$) ∇ℒ($!,&!)
! !−# !+1 …… !−1 !+# !
…… ∇ℒ($!"$,&!) ∇ℒ($!,&!%$) ……
(&∇ℒ($'"$,&')
head,D andE canbeapproximatedbyExponentialMov- 357
ingAverage(EMA),i.e., 358
Ek (Dk;ωk)=ϱEk (Dk → 1;ωk → 1)+(1 ϱ) (Dk → 1;ωk → 1),
↘L ↘L ↓ ↘L
(11) 359
whereϱistheEMAcoefficient. Hence,wehave 360
D E =(1 ϱ)( (Dk → 1;ωk → 1) Ek (Dk → 1;ωk → 1)).
↓ ↓ ↘L ↓ ↘L
(12) 361
Convergence: Similar to the analyses in [84], our iter- 362
ative gradient compensation algorithm yields convergence 363
rates of O (V 1 2ς/T) and O (V 2 /⇑T) for convex and non- 364
convex case, respectively. Here, V 1 and V 2 represent the 365
upper-boundofthe 2normandthevarianceofthedelay- 366
||·||
compensatedgradientA (),accordingly. Comparedtothe 367
I ·
workin[84], Ferretfixesς to1, andminimizesV 1 andV 2 368
byEq.10,boostingalgorithm’srobustnessandaccelerating 369
theconvergenceofthemodel. 370
Algorithm Design: The algorithm of Ferret’s iterative 371
Optimize )
gradient compensation is illustrated in Alg. 1 in the ap- 372
pendix. Since the maximum possible ς equals (P 1), 373
⇐
the time complexity of the algorithm is (P 1), which 374 O ⇐
is considered negligible during model training. Moreover, 375
sincetwoadditionalvariables,v r andv a ,arestoredinmem- 376
oryforoptimizingε,thespacecomplexityofthisalgorithm 377
is O (2 P j= → 0 1 | w i | ). However,bysettingφ ε = 0,theopti- 378
mizationofεiseffectivelyterminated,andεremainsfixed 379
Figure 3. To further reduce approximation errors, we opti- !
mize ϑ automatically by comparing historical approximations at ε0. This adjustment allows for manual tuning of ε and 380
( (Dt,ωt),etc.)andobservations( (Dt → 1,ωt),etc.) eliminatestheneedforv r andv a ,therebyincreasingflexi- 381
↘L ↘L
bilityandavoidingadditionalmemoryoverhead. 382
337 proposes an iterative application of A (), as depicted in 5.2.ModelPartitioningandPipelinePlanning 383
338 Fig.2. ThisiterativeprocessisdefinedIas · follows: Theobjectiveofmodelpartitioningandpipelineplanningis 384
339 (Dt → 1;ωt+ε → 1) A ( (Dt → 1;ωt+ε → 2),ωt+ε → 1,ωt+ε → 2) tofindanoptimalmodelpartitionschemeL ↑ anditscorre- 385
↘L ≃ I ↘L spondingpipelineconfigurationC ↑ thatmaximize within 386
340 ≃ A I (...A I ( ↘L (Dt → 1;ωt → 1),ωt,ωt → 1)...,ωt+ε → 1,ωt+ε → 2). agivenmemoryconstraintM,namely, R 387
(9)
341 However, this iterative process introduces a cas- L↑,C↑ =argm L, a C x R T F s.t. M F → M. (13) 388
342 cade of errors, wherein the approximation error gt This problem can be reformulated as a bi-level optimiza- 389
|| ⇐
343 A (gt → 1,ωt,ωt → 1) 2ispropagatedandamplifiedwitheach tion problem, decomposing it into two interrelated sub- 390
344 su I ccessiveapproxim || ation.Thisarisesbecauseeachapprox- problems: (1)determiningtheoptimalC givenaL,and(2) 391
345 imationdependsontheoutputoftheprecedingone. identifyingtheoptimalLbasedonthesolutionfrom(1): 392
3 3 4 4 6 7 der T t o he m m it i i l g d at a e ss t u h m is p p t r i o o b n l t e h m at , t w h e ed p i r s o t p ri o b s u e ti t o o n o s p o t f im E i k z D eε k a u n n d - L↑ =argm L ax {R T F| C L↑ } 393
348 Ek Dk+1 are similar, as illustrated in Fig. 3. Thus, the ob- s.t. C L↑ =argm C ax {R T F| L } , M F → M. (14) 394
349 jective of minimizing the approximation error of iterative
350 gradientscompensationcanbeformulatedasfollows:
5.2.1 IterativeConfigurationSearch(Sub-problem1) 395
351 minEk (Dk;ωk) A ( (Dk → 1,ωk,ωk → 1)) 2+ϖ ϑ 2
ϑ ||↘L ↓ I ↘L || || || Given a model partition scheme, the objective of sub- 396
352 =min D E ϑF 2+ϖ ϑ 2, (10) problem(1)istosolve 397
ϑ || ↓ ↓ || || ||
353 whereD=Ek ↘L (Dk;ωk), E =Ek ↘L (Dk → 1;ωk → 1), C↑ =argm C ax {R T F| L } s.t. M F → M. (15) 398
354 F =Ek ↘L (Dk → 1;ωk → 1) ⇐↘L (Dk → 1;ωk → 1)↔ ⇐ (ωk ↓ ωk → 1), With more than 2N(P+1) potential combinations for C, a 399
355 where ϑ ε 2 is an ϖ 2 regularization term to constrain the brute-forceenumerationofCisimpractical.Observingthat 400
356 solution o || f ε || for better stability. To reduce memory over- d M F /dmax C {R T F| L }⇓ 0,weemployaniterativealgo- 401
5

| CVPR |     |     |     |                         |     |     |     |                                         |     |     |     |     |     |     |     |     | CVPR |
| ---- | --- | --- | --- | ----------------------- | --- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| #715 |     |     |     |                         |     |     |     |                                         |     |     |     |     |     |     |     |     | #715 |
|      |     |     |     | CVPR2025Submission#715. |     |     |     | CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE. |     |     |     |     |     |     |     |     |      |
402 rithmtodeterminetheoptimalC thatmaximize T while 6.Experiments 452
RF
|     | ensuring |     | remains | within | the               | memory | budget. |             | Specif- |                                                     |           |               |                   |             |               |                     |     |
| --- | -------- | --- | ------- | ------ | ----------------- | ------ | ------- | ----------- | ------- | --------------------------------------------------- | --------- | ------------- | ----------------- | ----------- | ------------- | ------------------- | --- |
| 403 |          |     | F       |        |                   |        |         |             |         |                                                     |           |               |                   |             |               |                     |     |
|     |          |     | M       |        |                   |        |         |             |         | Inthissection,weseekanswerstothefollowingquestions. |           |               |                   |             |               |                     | 453 |
| 404 | ically,  | to  | prevent | memory | over-consumption, |        |         | we progres- |         |                                                     |           |               |                   |             |               |                     |     |
|     |          |     |         |        |                   |        |         |             |         | ( 1 ) H                                             | o w d o e | s F e r r e t | b o o s t o n l i | n e a c c u | r a c y ? ( S | e c . 6 . 2 ) ( 2 ) |     |
4 0 5 sive l y d ep l o y T 1- T 4 as f o l lo w s to b al an ce T an d . 4 5 4
|       |     |         |            |          |            |          | R        | F    | M F     |         |          |                 |                     |            |                  |                      |       |
| ----- | --- | ------- | ---------- | -------- | ---------- | -------- | -------- | ---- | ------- | ------- | -------- | --------------- | ------------------- | ---------- | ---------------- | -------------------- | ----- |
|       |     |         |            |          |            |          |          | cr   |         | H o w   | d o es F | e r r et m it i | g a t e c a t a s t | ro p h ic  | f o r g e t ti n | g . ( S e c . 6 .2 ) | 4 5 5 |
| 4 0 6 |     | S 1 . D | e p l oy T | 1 f or a | l l w o rk | e rs : B | y se tti | ng n | = 1 for |         |          |                 |                     |            |                  |                      |       |
|       |     |         |            |          |            |          |          |      |         | ( 3 ) H | o w d o  | e s o u r fi    | n e -g r a i n e    | d p ip e l | i n e p a r a    | ll e l i s m p e r-  | 4 5 6 |
407 allworkers,thedataprocessingtimeincreases.Specifically,
|     |     |     |     |     |     |     |     |     |     | f o r m ? | ( S e | c . 6 . 3 ) ( | 4 ) W h a t | a r e i n fl | u e n c e s | o f d i ff e r e n t |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | ----- | ------------- | ----------- | ------------ | ----------- | -------------------- | --- |
f or th e n -th w o rk er , s e tti n g c r = 1 w i l l respectivelyreduce 4 5 7
| 4 0 8 |     |     |     |     | n   |     |     |     |     |     |     |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
T p i p e l i n e c o n fi g u r at io n s ? (S e c . 6 . 3 ) ( 5 ) H o w do e s o u r i t e r- 4 5 8
| 4 0 9 |     | a nd | F b y | E q . 1 9 | i n th e a | pp en d i x | .   |     |     |     |     |     |     |     |     |     |     |
| ----- | --- | ---- | ----- | --------- | ---------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
R F M a t i v e g r ad i e n t c o m p e n s a t io n a l g o r it h m p e r f o r m ? ( S e c . 6 . 4 ) 4 5 9
|     |     | S2. | Deploy | T2 for | the | j-th | stage | in the | n-th |     |     |     |     |     |     |     |     |
| --- | --- | --- | ------ | ------ | --- | ---- | ----- | ------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
410
|       |         |     | co   |     |               |           | ca        | ”ca        |          |                     |     |     |     |     |     |     |     |
| ----- | ------- | --- | ---- | --- | ------------- | --------- | --------- | ---------- | -------- | ------------------- | --- | --- | --- | --- | --- | --- | --- |
| 411   | worker: |     | If   | =   | 0, increasing |           |           | by         | =        | 6.1.EvaluationSetup |     |     |     |     |     |     |     |
|       |         |     |      | n,j |               |           | n,j       |            | n,j      |                     |     |     |     |     |     |     | 460 |
|       |         | P   | j 1  | c   | a w ill       | le a d to | a r e d u | c ed fr eq | u e nc y |                     |     |     |     |     |     |     |     |
| 4 1 2 |         | →   | /→ a |     | n ,j          |           |           |            |          |                     |     |     |     |     |     |     |     |
↗ ( P j 1) c n ,j 1 ↘ ⇐ D a ta s e ts a n d m o d e l s: F ol l ow in g t h e c o n v en ti o n s o f 4 6 1
|     | of ↓ | m → od → e l | p a ra m ↔→ e | te r up d | a te s. H | e re , th | e v a l u | e of ” | c a i s |     |     |     |     |     |     |     |     |
| --- | ---- | ------------ | ------------- | --------- | --------- | --------- | --------- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
4 1 3 n ,j th e c o m m u n ity [ 4 5 ] , 18 im a g e c las s i fic a ti o n d a t as et s ,
4 6 2
| 414 | determined |     | to prevent | ”   | ca ca | +1  | F = | 0 due | to the |     |     |     |     |     |     |     |     |
| --- | ---------- | --- | ---------- | --- | ----- | --- | --- | ----- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
n,j↗ n,j M including MNIST [22], FMNIST [78], CIFAR10 [42], 463
T
415 ceiling function. Consequently, F and F will be re- CIFAR100 [42], SVHN [59], Tiny-ImageNet [44], 464
|     |     |     |     |     |     | R   | M   |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
416 spectivelydecreasedbyEq.20intheappendix.
|     |     |     |     |     |     |     |     |     |     | CORe50 | [49], | CORe50-iid, | Split-MNIST, |     | Split-FMNIST, |     | 465 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ | ----- | ----------- | ------------ | --- | ------------- | --- | --- |
DeployT3Forthej-thstageinthen-thworker:
417 S3. Split-CIFAR10, Split-CIFAR100, Split-SVHN, Split- 466
|     | If”ca |     | ,settingca |     | =1andco |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | ----- | --- | ---------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
418 =+ =P 1 jwill Tiny-ImageNet, Covertype [8], CLEAR10 [47],
|     |     | n,j | ↓   |     | n,j |     | n,j | ⇐   | ⇐   |     |     |     |     |     |     |     | 467 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
completelyeliminatetheneedforthej-thstageinthen-th
| 419 |     |     |     |     |     |     |     |     |     | CLEAR100 |     | [47], are | used in | our experiments. |     | More | 468 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --------- | ------- | ---------------- | --- | ---- | --- |
420 worker to store additional model parameters by bypassing details about the datasets can be found in the appendix. 469
421 anybackwardpassthatrequirespreviousmodelparameters. To cover both simple and complicated learning problems,
470
|     | Consequently, |     |     | T and | willberespectivelyreducedby |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | ------------- | --- | --- | ----- | --------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
422 F F five models including Multi-Layer Perceptron (MLP), 471
|     |     |     | R   | M   |     |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
423 Eq.21intheappendix. MNISTNet,ConvNet,ResNet-18[33]andMobileNet[34]
472
|     |     | S4. Deploy | T4  | for the | n-th | worker: | If  | co  | = 0 for |     |     |     |     |     |     |     |     |
| --- | --- | ---------- | --- | ------- | ---- | ------- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
424 n,j are used in the experiments. Note that ResNet-18 and 473
⇔
425 allj [0,p 1), removingthen-thworkerwillleadtoa MobileNetarepretrainedontheImageNet-1Kdataset[21]. 474
|     |            | ↑         | ⇐       |     |                       |     |     |              |     |                  |      |         |     |     |     |     |     |
| --- | ---------- | --------- | ------- | --- | --------------------- | --- | --- | ------------ | --- | ---------------- | ---- | ------- | --- | --- | --- | --- | --- |
| 426 | decreasein |           | T and   |     | byEq.22intheappendix. |     |     |              |     |                  |      |         | For |     |     |     |     |
|     |            |           | R F     | M F |                       |     |     |              |     | Comparedmethods: |      |         |     |     |     |     | 475 |
|     |            |           |         |     | The algorithm         |     | of  | the proposed |     |                  |      |         |     |     |     |     |     |
| 427 |            | Algorithm | Design: |     |                       |     |     |              |     | question         | (1): | Oracle, | 1-  |     |     |     | 476 |
428 searching is illustrated in Alg. 2 in the appendix. Overall, Skip [28], Random-N B-
477
|     | the | time | complexity | of  | this algorithm |     | is (NP2), |     | and it |       |        |        |     |     |     |     |     |
| --- | --- | ---- | ---------- | --- | -------------- | --- | --------- | --- | ------ | ----- | ------ | ------ | --- | --- | --- | --- | --- |
| 429 |     |      |            |     |                |     |           |     |        | Skip, | Last-N | B-Skip | and |     |     |     | 478 |
O
430 willbeexecutedonlyoncebeforefine-grainedpipelinepar- Camel [45]. Here, Ora- 479
| 431 | allelismbegins. |     |     |     |     |     |     |     |     | cle is | an ideal | method | that |     |     |     |     |
| --- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- | ------ | -------- | ------ | ---- | --- | --- | --- | --- |
480
|     |       |                                   |                 |     |     |                    |     |     |       | sequentially |          | processes | every    |     |     |     | 481 |
| --- | ----- | --------------------------------- | --------------- | --- | --- | ------------------ | --- | --- | ----- | ------------ | -------- | --------- | -------- | --- | --- | --- | --- |
|     |       |                                   |                 |     |     |                    |     |     |       | streaming    | data     | without   | any      |     |     |     |     |
| 432 | 5.2.2 | Brute-forcePlanning(Sub-problem2) |                 |     |     |                    |     |     |       |              |          |           |          |     |     |     | 482 |
|     |       |                                   |                 |     |     |                    |     |     |       | delay.       | B-Skip   | and Camel | se-      |     |     |     | 483 |
|     | In    | Ferret,                           | L is determined |     | by  | first establishing |     | an  | upper |              |          |           |          |     |     |     |     |
| 433 |       |                                   |                 |     |     |                    |     |     |       | lects        | a subset | from      | the lat- |     |     |     | 484 |
(tc),
434 bound on the time consumed for each stage and then est B unprocessed data us- Figure 7. Relation be-
485
435 solvingthefollowingoptimizationproblem: tweenoaccandlog( T)
|     |     |     |     |     |     |     |     |     |     | ing Random-N, |     | Last-N | and |     |     | RF  | 486 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ------ | --- | --- | --- | --- | --- |
436 L=argmin P s.t. tf +tb tc. (16) Coresetsampler,respectively.
487
|     |         |     |            | L   | { }    |             | →   |        |       |              |      |               |     |           |        |           |     |
| --- | ------- | --- | ---------- | --- | ------ | ----------- | --- | ------ | ----- | ------------ | ---- | ------------- | --- | --------- | ------ | --------- | --- |
|     |         |     |            |     |        |             |     |        |       | For question |      | (2): Vanilla, | ER  | [12], MIR | [3],   | LwF [46], | 488 |
|     | Namely, |     | minimizing | the | number | of pipeline |     | stages | while |              |      |               |     |           |        |           |     |
| 437 |         |     |            |     |        |             |     |        |       | MAS          | [2]. | For question  | (3) | and (4):  | DAPPLE | [24],     | 489 |
438 ensuring the time consumed for each stage is bounded. Pipedream [57], Pipedream2BW [58], Zero-Bubble [65]
490
439 Sincethelayersinastagemustbeconsecutive,thisproblem
|     |     |     |     |     |     |     |     |     |     | andHanayo[48].Forquestion(5):None,Step-Aware[32, |     |     |     |     |     |     | 491 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
canbesolvedinlineartimebyiterativelygroupingconsec-
440 40], Gap-Aware[7], Fisher[14], andIter-Fisher(i.e., it- 492
| 441 | utive | layers      | into | a stage    | until no | additional |       | adjacent | layer  |                               |     |          |            |     |              |         |     |
| --- | ----- | ----------- | ---- | ---------- | -------- | ---------- | ----- | -------- | ------ | ----------------------------- | --- | -------- | ---------- | --- | ------------ | ------- | --- |
|     |       |             |      |            |          |            |       |          |        | erativegradientcompensation). |     |          |            |     |              |         | 493 |
|     | can   | be grouped. |      | Therefore, | the      | solution   | space | for L    | is not |                               |     |          |            |     |              |         |     |
| 442 |       |             |      |            |          |            |       |          |        | Evaluation                    |     | metrics: | To measure |     | catastrophic | forget- | 494 |
|     |       |             |      |            | (Lˆ2     | Lˆ)/2      |       |          |        |                               |     |          |            |     |              |         |     |
443 extensive, being limited to at worst. Thus, to ting while accounting for memory footprint, Test Accu- 495
⇐
444 solvesub-problem(2),wecansimplyenumerateallpossi- racy[28,45]GainperunitofMemory1(thehigherthebet- 496
|     | blemodelpartitionschemes,feedingthemintoAlg.2inthe |     |     |     |     |     |     |     |     | ter)isdefinedas |     |     |          |     |           |     |     |
| --- | -------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | -------- | --- | --------- | --- | --- |
| 445 |                                                    |     |     |     |     |     |     |     |     |                 |     |     |          |     |           |     | 497 |
| 446 | appendixtoobtaintheglobaloptimumL                  |     |     |     |     |     | ↑ . |     |     |                 |     |     |          |     |           |     |     |
|     |                                                    |     |     |     |     |     |     |     |     |                 |     |     | exp(tacc | (t) | tacc (t)) |     |     |
AlgorithmDesign:Thealgorithmoftheproposedplan- tagm ( ,t)=log( A ↓ B ), (17) 498
| 447 |            |                |         |           |      |               |               |     |      |                                     | B   | A   |     | /     |               |     |     |
| --- | ---------- | -------------- | ------- | --------- | ---- | ------------- | ------------- | --- | ---- | ----------------------------------- | --- | --- | --- | ----- | ------------- | --- | --- |
|     |            |                |         |           |      |               |               |     |      |                                     |     |     |     | MA MB |               |     |     |
| 448 | ning       | is illustrated |         | in Alg.   | 3 in | the appendix. |               | The | time |                                     |     |     |     |       |               |     |     |
|     |            |                |         |           |      | (Lˆ3).        |               |     |      | wheretacccomputesthetestaccuracyand |     |     |     |       | isthebaseline |     | 499 |
| 449 | complexity |                | of this | algorithm | is   |               | Nevertheless, |     | the  |                                     |     |     |     |       | B             |     |     |
O
|     | algorithm |     | will be | executed | only | once | before | fine-grained |     |     |     |     |     |     |     |     |     |
| --- | --------- | --- | ------- | -------- | ---- | ---- | ------ | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
450 1Resultsintheappendixshowstandardtestaccuracyandonlineaccu-
451 pipelineparallelismbegins. racybutignorememoryconsumptionduringtraining.
6

CVPR CVPR
#715 #715
CVPR2025Submission#715. CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE.
Table1. OnlineAccuracyGainperunitofMemory(agm ( ,T))ofdifferentalgorithms,where is
B A B
the1-Skip. ”M-”,”M”,”M+”refertotheferretmethodwithminimal,mediumandmaximalmemory
footprint,respectively.
Setting Oracle 1-Skip Random-N Last-N Camel FerretM FerretM FerretM+
→
MNIST/MNISTNet 27.32 0.71 0 0 -0.43 0.6 -0.26 0.14 -0.71 0.32 5.31 0.7 16.26 0.37 26.34 0.7
F E M M N N I I S S T T / / M M N N I I S S T T N N e e t t 19. 1 3 3 5± ± 0 0 . . 9 4 9 8 0 0 ± ± 0 0 -0 1 . . 3 9 1 4± ± 0 0 . . 4 0 7 4 2 -0 .0 .2 2 5± ± 0 0 .0 .5 3 1 -0 .5 .6 5 ± ± 0 0 . . 4 1 5 4 . . 9 1 3 9± ± 0 0 . . 8 1 1 7 12.6 8 9 .8 ± ± 0. 0 8 .4 1 1 1 8 2 . . 3 0 7 9± ± 1 0 . . 0 4 1 7 (a)EMNIST/MNISTNet
CIFAR10/ConvNet 10.57± 0.09 0± 0 4.71± 0.05 4.78± 0.03 4.7± 0.05 3.21± 0.16 6.21± 0.15 9.44± 0.12
CIFAR100/ConvNet 5.24± 0.01 0± 0 0.78± 0.07 0.83± 0.06 0.75± 0.08 1.58± 0.04 2.6± 0.03 4.39± 0.05
SVHN/ConvNet 15.41± 0.23 0± 0 7.04± 0.08 7.24± 0.11 7.39± 0.09 5± 0.1 11.52± 0.23 14.34± 0.31
TinyImagenet/ConvNet 2.13± 0.07 0± 0 -0.22± 0.04 -0.2± 0.03 -0.21± 0.05 0.48± 0.03 0.54± 0.03 1.19± 0.07
CORe50/ConvNet 26.01± 0.42 0± 0 12.13± 0.42 12.27± 0.44 11.07± 0.48 9.08± 0.45 17.95± 0.45 24.49± 0.43
CORe50-iid/ConvNet 19.24± 2.9 0± 0 2.87± 5.71 5.74± 2.8 5.21± 2.49 3.55± 2.77 10.74± 2.76 17.96± 2.88
SplitMNIST/MNISTNet 18.21± 0.76 0± 0 2.34± 0.43 2.37± 0.63 3.3± 0.48 6.11± 0.84 14.55± 0.55 17.05± 0.72
SplitFMNIST/MNISTNet 11.32± 1.47 0± 0 1.53± 0.47 1.49± 0.42 1.96± 0.39 5.43± 0.56 9.37± 1.35 10.29± 1.47
SplitCIFAR10/ConvNet 7.49± 0.12 0± 0 3.05± 0.11 3.11± 0.11 3.12± 0.09 2.91± 0.19 4.84± 0.2 6.19± 0.07 (b)CIFAR100/ConvNet
SplitCIFAR100/ConvNet 10.51± 0.15 0± 0 2.81± 0.07 2.86± 0.05 2.74± 0.13 3.54± 0.03 6.13± 0.13 9.61± 0.04
S S p p l l i i t t S T V in H yI N m / a C g o e n n v e N t/C et onvNet 6 2 .4 .1 9 4 ± ± 0. 0 3 .1 3 0 0 ± ± 0 0 -0. 2 2 . 4 9± ± 0 0 . . 1 0 9 3 -0 2 . . 2 9 1 1± ± 0 0 . . 2 0 1 2 - 2 0 . . 8 2 9 6 ± ± 0 0 . . 2 0 1 1 2 0 . . 7 4 6 7 ± ± 0 0 . . 1 0 6 1 0.62 5± ± 0 0 . . 2 0 8 1 5 1 . . 3 1 8 9 ± ± 0 0 . . 3 0 5 6 Figure 4. Consumed memory
CLEAR10/ResNet 10.37± 0.06 0± 0 7.84± 0.07 7.93± 0.06 -2.9± 10.55 2.44± 0.06 7.71± 0.06 9.26± 0.08 of different stream learning al-
CLEAR10/MobileNet 20.36± 0.2 0± 0 11.8± 0.22 12± 0.14 11.85± 0.07 -1.77± 0.15 14.68± 0.5 18.51± 0.35 gorithms. Ferret achieves rapid
C C L L E E A A R R 1 1 0 0 0 0 / / R M e o s b N il e e t Net 2 2 1 3 . . 7 5 1 1± ± 0 1 . . 4 0 3 3 0 0 ± ± 0 0 15 9 . . 1 1 9 6 ± ± 0 0 . . 4 2 9 8 15 9 . . 3 3 6 9 ± ± 0 0 . . 4 1 6 5 1 8 4 . . 7 3 2 9± ± 0 0 . . 4 0 6 6 7 1 . . 5 0 1 5 ± ± 0 0 . . 4 1 4 3 1 1 5 5 .5 .8 3 ± ± 0 0 . . 3 3 5 9 2 2 0 2 . . 8 1 4 1 ± ± 0 0 . . 5 5 7 9 adaptation across varying mem-
Covertype/MLP 7.66± 0.27 0± 0 -1.33± 0.3 -1.3± 0.31 -1.34± 0.29 0.74± 0.21 1.61± 0.29 3.38± 0.42 oryconstraints.
± ± ± ± ± ± ± ±
Table2. OnlineAccuracyGainperunitofMemory(agm ( ,T))andTestAccu-
B A
racy Gain per unit of Memory (tagm ( )) of different integrated OCL algorithms
B A
onCORe50/ConvNet,where isthe1-Skip. Camelhasitsdedicatedcomponentto
B
mitigatecatastrophicforgettingandcannotbeintegratedwithvariousOCLalgorithm.
Metric Oracle 1-Skip Random-N Last-N Camel FerretM→ FerretM FerretM+
F a a st n l i a l g d e n ( u l a d m i r ) s a e E m e r M d m 6 N . s e o t I r r r S r R y a T o t e / r c e M l s o g a N n i o t e i I s f o s S u m , n T m N s t e h h p e a i t e t n p io s s m . n b a o e r f k tw e d ( r b i e f ) e f s C n e iz O re e o R n n e r t 5 l e i 0 p p n / i C r e p e o e s n a l e v c i N n n c t e e u s t r p a t a h c r y e - V E M L M a R w I A n R F [ i S l 1 l [ [ 2 a [ 3 4 2 ] 6 ] ] ] a t a t a t a t a t a a a a a g g g g g g g g g g m m m m m m m m m m 2 2 2 4 2 4 2 2 2 2 6 . 4 . 4 . 6 . 5 . 3 1 1 3 7 . . . . . 0 6 0 8 0 8 0 6 8 ± 1 3 3 2 6 ± ± ± ± 0 ± ± ± ± ± . 0 0 0 0 2 . . . . 0 0 0 0 0 3 6 4 4 6 . . . . . 4 3 3 4 4 2 2 4 2 2 6 6 2 5 0 0 0 0 0 0 0 0 0 0 ± ± ± ± ± ± ± ± ± ± 0 0 0 0 0 0 0 0 0 0 1 1 7 1 7 2 1 1 1 0 2 . . . . . 2 . 2 . 0 8 9 8 1 2 8 . . . ± ± 1 8 4 4 2 2 0 1 3 5 4 ± ± ± ± ± 0 0 ± ± ± . . 0 0 0 0 0 1 6 . . . . . 0 0 0 5 2 6 1 2 2 4 . . . 2 7 6 1 1 4 4 2 2 2 3 1 0 8 2 8 2 1 1 1 0 2 . . . . . 2 . 2 . 9 1 3 0 2 0 9 . . . ± 2 7 1 4 6 4 9 2 1 ± ± ± ± ± ± ± 7 3 0 ± ± . 0 0 0 0 0 0 0 1 . . . . . . . 0 0 4 3 2 2 2 4 3 2 . . 9 9 9 2 5 9 4 4 2 4 2 1 1 - - - - - - - - 1 .4 .0 8 7 ± ± 0. 0 4 . 2 48 9 1 7 0 7 0 9 0 8 0 . . . . . . . . . . 0 0 1 8 1 8 0 9 7 5± 8 1 2 2 2 2 2 1 9 ± ± ± ± ± ± ± ± ± 0. 0 0 0 0 0 0 0 0 0 1 . . . . . . . . . 7 4 4 0 2 0 2 4 4 2 5 5 9 9 9 9 4 3 1 1 1 3 1 3 1 1 1 1 7 . 6 . 6 . 7 . 7 . 0 1 1 8 6 . . . . . ± ± 2 7 0 0 9 8 7 6 1 9 9 6 9 ± ± ± 0 0 ± ± ± ± ± . . 0 0 0 2 2 . . . 0 0 0 0 0 5 5 4 4 1 . . . . . 9 9 8 4 1 1 4 2 5 6 5 6 2 2 1 2 4 2 4 2 1 2 1 4 . 3 . 3 . 4 . 4 . 7 0 0 5 6 . . . . . 8 3 5 6 5 6 6 4 4 9 ± ± ± ± ± ± ± 2 7 6 ± ± ± 0 0 0 0 0 0 0 . . . . . . . 0 0 0 5 2 3 2 3 5 2 . . . 3 5 6 5 6 3 1 4 4 2 3 3
500 method for comparison. Similarly, as Fig. 7 shows online Ferret M andFerret M+ constantlyoutperformothercompet- 518
501 accuracycanbeusedtoestimate R T F [11],OnlineAccuracy ing algorithms. Notably, Ferret M+ even achieves compa- 519
502 GainperunitofMemory1 (thehigherthebetter)isdefined rableperformancecomparedtoOracle,indicatingthatFer- 520
503 as reteffectivelyenablesrapidadaptation. Ontheotherhand, 521
504 agm ( ,t)=log( exp(oacc A (t) ↓ oacc B (t)) ). (18) while Ferret M → shows slightly inferior performance com- 522
B A / paredtoitscounterparts,itdemandslessmemoryforOCL, 523
MA MB
as depicted in Fig. 4. This implies that in scenarios where 524
505 We evaluate three versions of Ferret under different
memory is severely constrained, Ferret is the only method 525
506 memory constraints: Ferret M (minimal), Ferret M (the
→ capableoflearning. 526
507 samememoryconstraintasPipedream 2BW ),andFerret M+
508 (no constraint). Without clarification, each experiment is Furthermore, various OCL algorithms are integrated on 527
509 independently repeated three times to obtain the final re- CORe50/ConvNet in Table 2. It can be observed that Fer- 528
510 sults. In all tables, the best and second-best performance retnotonlymitigatescatastrophicforgetting(i.e.,increased 529
511 are highlighted by bold and underline, respectively. More tagm)butalsomarkedlyenhancesonlineperformance(i.e., 530
512 detailsabouttheevaluationsetupcanbefoundinSec.12. increasedagm),validatingitsorthogonalityandsuperiority 531
comparedtootherOCLframeworksforrapidadaptation. 532
513 6.2.OverallComparisons
6.3.ComparisonsonPipelineParallelism 533
514 Table 1 shows agm ( ,T) across 20 different settings to
B A
515 evaluatebothperformanceandconsumedmemoryofdiffer- Table 3 compares agm ( ,T) of different pipeline paral- 534
B A
516 entframeworks. Here, ischosentobethe1-Skipdueto lelismstrategiesacross20differentsettingstoevaluatethe 535
B
517 itslowmemoryfootprint. Fromthetable,itisevidentthat performance of Ferret’s fine-grained pipeline parallelism 536
7

| CVPR |       |           |          |                         |     |         |             |                                         |                 |     |     |     |     |     |     | CVPR |
| ---- | ----- | --------- | -------- | ----------------------- | --- | ------- | ----------- | --------------------------------------- | --------------- | --- | --- | --- | --- | --- | --- | ---- |
| #715 |       |           |          |                         |     |         |             |                                         |                 |     |     |     |     |     |     | #715 |
|      |       |           |          | CVPR2025Submission#715. |     |         |             | CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE. |                 |     |     |     |     |     |     |      |
|      | Table | 3. Online | Accuracy | Gain                    | per | unit of | Memory (agm | (                                       | ,T)) of Table4. |     |     |     |     |     |     |      |
|      |       |           |          |                         |     |         |             | B A                                     |                 |     |     |     |     |     |     |      |
different pipelineparallelismstrategies,where istheDAPPLE.Note Online Accuracy differences between Ferret with and without
B
gradientscompensationalgorithms.
that”1W”,”2W”and”3W”referto1,2and3wave(s)fortheHanayo
algorithm,andnogradientscompensationisappliedtoallasynchronous
pipelineparallelismstrategiesforfaircomparisons
|     |     |     |     | SynchronousPP |     |     |     | AsynchronousPP |     | FerretM+ |     |     |     | FerretM |     |     |
| --- | --- | --- | --- | ------------- | --- | --- | --- | -------------- | --- | -------- | --- | --- | --- | ------- | --- | --- |
Setting
DAPPLE ZB Hanayo1W Hanayo2W Hanayo3W Pipedream Pipedream2BW FerretM Step-Aware Gap-Aware Fisher Iter-Fisher Step-Aware Gap-Aware Fisher Iter-Fisher
|     |     |     |     |     |     |     |     |     | - 5 6 . 0 4 2 . 7 | 8 -1 4 . 0 3 1 | . 2 4 - 0 . 0 2 0 . 0 1 | 0   | - 4 3 . 5 3 2 . 3 6 | -1 2 . 1 1 1 . 0 3 | - 0 . 0 1 0 . 0 1 | 0   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | -------------- | ----------------------- | --- | ------------------- | ------------------ | ----------------- | --- |
M N I S T / M n N e t 0 ± 0 6 . 7 9 ± 0 . 4 2 . 4 4 ± 0 .3 5 ± 0 . 1 6 7 . 1 2 ± 0 . 3 8 8 . 1 6 ± 0 . 3 5 8 . 2 3 ± 0 . 3 9 8 . 3 5 ± 0 . 3 5 ± ± ± 0 .0 1 ±0 ± ± ± 0 . 0 2 ±
F M N I S T / M n N e t 0 0 4 . 0 6 0 . 3 6 1 . 5 2 0 . 4 5 2 . 8 0 . 6 5 4 . 2 6 0 . 6 4 5 . 2 9 0 . 5 3 5 . 3 6 0 . 5 4 5 . 4 8 0 . 5 3 - 3 7 . 7 5 ± 2 . 1 7 - 9 . 0 7 ± 0 . 6 3 - 0 . 0 2 ± 0 . 0 3 0 . 0 5 ± 0 . 1 - 3 7 . 7 4 ± 2 . 5 3 - 7 . 0 7 ± 0 . 5 5 - 0 . 0 1 ± 0 . 0 1 0 . 0 2 ± 0
E M N I S T / M n N e t 0 ± 0 2 . 3 3 ± 0 . 0 8 0 . 9 ± 0 . 0 2 1 . 8 1 ± 0 . 0 5 2 . 5 5 ± 0 . 0 4 2 . 8 4 ± 0 . 0 9 2 . 9 9 ± 0 . 0 7 3 . 0 2 ± 0 . 0 9 - 2 0 . 5 0 . 0 5 - 4 . 8 1 0 . 1 5 0 . 0 1 0 . 0 2 0 . 0 4 0 . 0 2 - 3 3 . 3 6 0 . 1 3 - 3 . 4 6 0 . 3 3 0 . 0 1 0 . 0 1 0 . 0 4 0 . 0 2
C 1 0 / C N e t 0 ± 0 1 . 7 6 ± 0 . 0 8 0 . 9 6 ± 0 . 1 4 1 . 5 1 ± 0 . 0 4 1 . 9 3 ± 0 . 1 2 2 . 5 3 ± 0 . 0 4 2 . 7 8 ± 0 . 0 6 3 . 0 5 ± 0 . 1 5 - 1 0 . 1 2 ± 0 . 1 9 - 1 . 7 1 ± 0 . 4 3 - 0 . 3 2 ± 0 . 0 7 0 . 2 5 ± 0 . 0 6 - 9 . 6 ± 0 . 1 9 - 1 . 2 2 ± 0 . 3 9 - 0 . 1 4 ± 0 . 3 0 . 4 2 ± 0 . 2 1
C 1 0 0 / C N e t 0 ± 0 . 7 1 ± 0 . 0 5 ± 0 . 5 6 ± 0 . 7 4 ± 0 . 8 7 ± 1 . 1 1 ± 1 . 7 2 ± - 8 . 0 8 ± 0 . 1 7 - 2 . 1 7 ± 0 . 0 5 - 0 . 0 4 ± 0 . 0 8 0 . 1 3 ± 0 . 0 5 - 5 . 4 ± 0 . 0 7 - 1 . 0 4 ± 0 . 0 4 - 0 . 0 1 ± 0 . 0 7 0 . 1 ± 0 . 0 2
S V H N / C N e t 0 ± 0 2 . 1 3 ± 0 . 0 4 0 . 3 6 ± 0 . 0 5 1 . 5 2 ± 0 . 0 6 2 . 2 1 ± 0 . 0 6 3 . 3 ± 0 . 0 9 3 . 3 2 ± 0 . 0 6 3 . 6 1 ± 0 . 0 1 - 1 4 . 9 2 ± 0 . 4 2 - 2 . 6 3 ± 0 . 0 4 0 . 0 2 ± 0 . 0 4 0 . 3 ± 1 0 . 2 - 2 4 . 7 ± 1 . 1 8 - 2 . 9 1 ± 0 . 1 1 0 . 2 2 ± 0 . 0 7 0 . 3 ± 0 . 0 7
± 0 ± 0 . 3 2 ± 0 . 1 5 ± 0 . 2 3 ± 0 . 2 6 ± 0 . 2 4 ± 0 . 1 9 ± 0 . 1 6 - 3 . 7 2 ± 0 . 1 6 - 1 . 0 6 ± 0 . 0 9 - 0 . 0 1 ± 0 . 0 2 ± 0 . 0 3 - 1 . 3 2 ± 0 . 1 7 - 0 . 1 1 ± 0 . 1 9 0 . 1 7 ± 0 . 1 9 ± 0 . 1 5
T i n y I / C N e t 0 ± 0 0 . 1 8 ± 0 . 0 2 0 . 0 3 ± 0 . 0 1 0 . 1 9 ± 0 . 0 2 0 . 1 9 ± 0 . 0 4 0 . 2 6 ± 0 . 0 1 0 . 5 2 ± 0 . 0 3 0 . 5 ± 0 . 0 6 ± ± ± 0 . 0 6 ± ± ± ± 0 . 3 5 ±
C O R e 5 0 / C N e t 0 0 4 . 1 8 0 . 2 3 1 . 3 8 0 . 1 2 3 . 6 0 . 1 6 4 . 6 9 0 . 1 1 6 . 0 3 0 . 1 7 5 . 9 1 0 . 2 2 7 . 1 3 0 . 1 8 - 2 3 . 9 3 ± 0 . 1 6 - 3 . 2 7 ± 0 . 0 5 - 0 . 2 2 ± 0 . 1 1 0 . 1 ± 0 . 0 8 - 3 3 . 4 1 ± 0 . 2 4 - 4 . 1 8 ± 0 . 3 4 0 . 0 2 ± 0 . 1 2 0 . 3 4 ± 0 . 0 7
C O R e 5 0 - i i d / C N e t 0 ± 0 3 . 5 8 ± 0 . 0 2 1 . 1 9 ± 0 . 1 8 2 . 9 4 ± 0 . 0 2 3 . 7 4 ± 0 . 0 7 5 . 0 7 ± 0 . 1 3 5 . 2 4 ± 0 . 0 7 6 . 1 8 ± 0 . 0 5 - 2 4 . 5 6 0 . 2 2 - 3 . 9 1 0 . 2 0 . 2 2 0 . 0 8 0 . 3 2 0 . 0 6 - 2 3 . 7 7 0 .3 - 3 . 1 5 0 . 5 3 0 . 2 3 0 . 1 2 0 . 3 9 0 . 1
S - M N I S T / M n N e t 0 ± 0 2 . 9 4 ± 0 . 2 9 1 . 3 3 ± 0 . 2 6 2 . 9 7 ± 0 . 2 1 3 . 6 9 ± 0 . 2 3 4 . 3 ± 0 . 2 9 4 . 1 1 ± 0 . 3 3 4 . 4 7 ± 0 . 2 9 - 2 6 .8 ± 3 .2 - 4 . 2 1 ± 0 . 2 1 - 0 . 0 5 ± 0 . 0 2 0 . 0 3 ± 0 . 0 1 - 4 6 . 2 4 ± 1 . 4 1 - 4 . 8 2 ± 0 . 4 8 - 0 . 0 3 ± 0 . 0 1 0 . 0± 2 0
S - F M N I S T / M n N e t 0 ± 1 . 5 6 ± 0 . 9 1 ± 1 . 4 8 ± 1 . 8 9 ± 2 . 0 6 ± 2 . 0 9 ± 2 . 2 4 ± - 1 4 . 4 3 ± 2 . 8 3 - 2 . 3 7 ± 0 . 1 4 0 . 0 1 ± 0 . 0 2 0 . 0 3 ± 0 . 0 2 - 4 6 . 0 7 ± 4 . 0 3 - 2 . 1 ± 0 . 3 3 - 0 . 0 1 ± 0 . 0 1 0 ± 0
S - C 1 0 / C N e t 0 ± 0 0 . 9 6 ± 0 . 2 9 0 . 4 4 ± 0 . 1 6 1 . 1 9 ± 0 .2 1 . 4 2 ± 0 . 3 1 2 . 2 1 ± 0 . 2 8 2 . 1 6 ± 0 . 2 7 2 . 5 8 ± 0 . 2 8 - 6 . 9 3 ± 0 . 1 2 - 1 ± 0 . 1 4 - 0 . 1 9 ± 0 . 0 9 0 . 1 ± 0 . 0 3 - 8 . 1 1 ± 0 . 7 5 - 0 . 9 9 ± 0 . 2 4 - 0 . 1 2 ± 0 . 1 2 0 . 2 3 0 . ± 1 2
± 0 ± 0 . 1 4 ± 0 . 1 3 ± 0 . 0 3 ± 0 . 1 4 ± 0 . 0 8 ± 0 . 0 5 ± 0 .1 - 1 4 . 1 4 ± 0 . 3 7 - 3 . 0 ± 5 0 . 1 - 0 . 2 3 ± 0 . 1 8 0 . 3 8 ± 0 . 2 3 - 1 2 . 5 6 ± 0 . 2 3 - 1 . 9 2 ± 0 . 0 9 - 0 . 1 ± 0 . 1 9 0 . 2 4 ± 0 . 0 9
S - C 1 0 0 / C N e t 0 ± 0 1 . 5 7 ± 0 . 0 5 0 . 5 4 ± 0 . 1 4 1 . 2 5 ± 0 . 1 2 1 . 6 7 ± 0 . 1 2 2 . 4 8 ± 0 . 1 2 2 .4 9 ± 0 . 1 3 . 4 9 ± 0 . 0 6 ± ± ± ± ± ± ± ±
S - S V H N / C N e t 0 0 0 . 8 6 0 . 0 5 0 . 4 9 0 . 0 8 0 . 8 8 0 . 0 6 1 . 1 3 0 . 0 3 1 . 3 9 0 . 0 4 1 . 5 8 0 . 0 6 1 . 7 5 0 . 0 3 - 5 . 6 9 ± 0 . 4 6 - 1 . 1 8 ± 0 . 1 2 - 0 . 0 3 ± 0 . 0 3 0 . 0 5 ± 0 . 0 3 - 1 2 . 1 3 ± 0 . 8 7 - 1 . 2 7 ± 0 . 0 9 - 0 . 0 5 ± 0 . 0 2 0 . 0 3 ± 0 . 0 1
S - T i n y I / C N e t 0 ± 0 0 . 2 7 ± 0 . 0 5 0 . 0 8 ± 0 . 0 3 0 . 1 4 ± 0 . 0 2 0 . 2 2 ± 0 . 0 3 0 . 2 9 ± 0 . 0 3 0 . 4 7 ± 0 . 0 1 0 . 6 6 ± 0 . 0 4 - 3 . 6 1 0 . 1 4 - 1 . 0 1 0 . 0 5 0 . 0 5 0 . 1 0 . 1 2 0 . 1 - 1 . 7 0 . 1 2 - 0 . 3 7 0 . 0 3 0 . 0 8 0 . 0 7 0 . 1 8 0 . 0 8
C L E A R 1 0 / R N e t 0 ± 0 0 . 3 8 ± 0 . 1 3 0 . 4 6 ± 0 . 0 8 1 . 0 4 ± 0 . 0 6 1 . 4 ± 0 . 0 4 1 . 8 ± 0 . 0 6 1 . 9 2 ± 0 . 0 5 2 . 1 2 ± 0 . 0 5 - 6 . 2 6 ± 0 . 1 8 - 0 . 7 2 ± 0 . 0 8 0 . 0 2 ± 0 . 0 6 0 . 1 4 ± 0 . 0 4 - 1 1 . 2 5 ± 0 . 2 8 - 0 . 5 2 ± 0 . 0 5 - 0 . 0 2 ± 0 . 0 4 0 . 0 8 ± 0 . 0 4
C L E A R 1 0 / M o N e t 0 ± 1 . 0 3 ± 0 . 6 5 ± 2 . 3 1 ± 2 . 6 5 ± 4 . 2 5 ± 3 . 8 2 ± 5 . 3 4 ± - 1 8 . 1 7 ± 0 . 2 6 - 1 . 7 ± 0 . 0 5 - 0 . 1 4 ± 0 . 3 2 0 . 5 ± 0 . 1 5 - 2 0 . 6 9 ± 0 . 5 8 - 1 . 8 8 ± 0 . 4 6 - 0 . 2 8 ± 0 . 3 7 0 . 3 6 ± 0 . 1 8
C L E A R 1 0 0 / R N e t 0 ± 0 2 . 7 6 ± 0 . 6 4 1 . 3 6 ± 0 . 2 3 2 . 5 2 ± 0 . 1 5 3 . 3 ± 0 . 4 9 3 . 8 5 ± 0 . 0 9 3 . 9 8 ± 0 . 2 6 4 . 2 4 ± 0 . 1 1 - 1 7 . 4 5 ± 0 . 0 2 - 0 . 3 8 ± 0 . 5 4 - 0 . 0 7 ± 0 . 0 4 0 . 6 5 ± 0 . 3 2 - 2 4 . 6 2 ± 0 . 2 4 0 . 1 8 ± 0 . 3 2 - 0 . 2 ± 0 . 1 8 1 . 2 7 ± 0 . 2 1
± 0 ± 0 . 1 ± 0 . 2 2 ± 0 . 2 1 ± 0 . 2 3 ± 0 .2 ± 0 . 1 9 ± 0 . 2 2 - 3 0 . 6 5 ± 0 . 9 3 - 0 . 3 ± 0 . 1 7 0 . 6 3 ± 0 . 4 6 1 . 2 ± 0 . 4 8 - 2 6 . 8 5 ± 1 . 2 2 - 0 . 3 ± 0 . 3 3 0 . 5 8 ± 0 . 7 8 1 . 0 3 ± 0 . 7
C L E A R 1 0 0 / M o N e t 0 ± 0 3 . 1 1 ± 0 . 5 3 1 . 2 6 ± 0 . 1 2 3 . 0 3 ± 0 . 5 2 4 . 2 4 ± 0 . 1 2 5 . 6 6 ± 0 . 1 9 5 . 8 8 ± 0 . 5 8 7 . 4 2 ± 0 . 6 9 ± ±8 ± ± ± ± ±.0 ±
C o v e r t y p e / M L P 0 0 0 . 6 2 0 . 1 4 0 . 2 4 0 . 1 2 0 . 6 0 . 1 6 0 . 8 3 0 . 1 6 0 . 9 2 0 . 1 6 0 . 8 2 0 . 1 3 0 . 8 9 0 . 0 8 - 9 . 2 ± 1 . 1 3 - 2 . ± 0 . 1 - 0 . 0 9 ± 0 . 0 5 0 . 0 5 ± 0 . 0 2 - 1 0 . 2 7 ± 0 . 3 9 - 1 . 5 2 ± 0 . 1 4 - 0 1 ± 0 0 . 0 9 ± 0 . 0 1
|     |     |     | ±   | ±   | ±   | ±   | ± ± | ±   | ±   |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
537 under memory constraints. Specifically, is selected as Ferret M , and compare the final online accuracy gain. The 570
B
538 DAPPLE,andnogradientscompensationisappliedtoany results are shown in Table 4. From the table, we can ob- 571
539 asynchronouspipelineparallelismstrategies. Additionally, servethatapplyingStep-AwareandGap-Awarealgorithms 572
540 Hanayo , Hanayo and Hanayo are three variants for compensating stale gradients significantly reduces the 573
|     |     | 1W  |     | 2W  |     | 3W  |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
with1,2,and3waves,respectively. online accuracy. This is because these algorithms miti-
| 541 |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 574 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
542 In general, allasynchronous pipeline parallelism strate- gate the gradient staleness problem by simply penalizing 575
gies significantly outperform synchronous pipeline par- the step size of stale gradients, leading to a slow conver- 576
543
|     |     |     |     |     |     |     |     |     | genceratewhenthesystemishighlyparalleled. |     |     |     |     |     | Although |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------------------------- | --- | --- | --- | --- | --- | -------- | --- |
544 allelism strategies, even ZB, which claims to eliminate 577
545 pipeline bubbles. This is because synchronous pipeline Fisher leverages first-order information for better compen- 578
sation,itdoesnotconsidervaryinglevelsofstalenessatdif-
546 parallelism strategies, in an effort to achieve higher hard- 579
547 wareutilizationratesandavoidconflictingmodelversions, ferentstagesofpipelineparallelism,resultinginamarginal 580
mustdesigncomplexworkflowsthatstagegradientsandup- decreaseinaccuracycomparedtonocompensation. Onthe 581
548
|     |                                                      |     |     |     |     |     |     |     | other hand, | Iter-Fisher |     | consistently | improves |     | online | accu- |
| --- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ----------- | ----------- | --- | ------------ | -------- | --- | ------ | ----- |
| 549 | datemodelparameterssynchronously,resultingindelaysin |     |     |     |     |     |     |     |             |             |     |              |          |     |        | 582   |
550 data processing and wasted data value. Conversely, asyn- racy across all settings, without requiring manual hyper- 583
parameterstuning.ThisindicatesthatIter-Fishereffectively
551 chronous pipeline parallelism strategies process data and 584
552 update model parameters immediately, thereby minimiz- adapts to different levels of staleness in parallelism, and 585
ing processing latency. Among all asynchronous pipeline automaticallyoptimizesεforbettercompensation,demon- 586
553
stratingitsrobustnessandeffectiveness.
554 parallelism strategies, Ferret M ’s fine-grained pipeline par- 587
555 allelismstrategyconsistentlysurpassestheothersduetoits
moreefficientmemoryutilization.
| 556 |     |                                                     |     |     |     |     |     |     | 7.Conclusion |            |     |         |         |           |     | 588     |
| --- | --- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- | ------------ | ---------- | --- | ------- | ------- | --------- | --- | ------- |
| 557 |     | Toinvestigatetheimpactofdifferentpipelineconfigura- |     |     |     |     |     |     |              |            |     |         |         |           |     |         |
|     |     |                                                     |     |     |     |     |     |     | This paper   | introduces |     | Ferret, | a novel | framework |     | de- 589 |
558 tionsforFerret,weselectfivedifferentmemoryconstraints
|     |                                                   |      |         |     |         |     |          |          | signed        | to boost | online | accuracy     |     | of OCL | algorithms |     |
| --- | ------------------------------------------------- | ---- | ------- | --- | ------- | --- | -------- | -------- | ------------- | -------- | ------ | ------------ | --- | ------ | ---------- | --- |
| 559 | ranging                                           | from | minimum | to  | maximum | to  | simulate | learning |               |          |        |              |     |        |            | 590 |
|     |                                                   |      |         |     |         |     |          |          | under varying |          | memory | constraints. |     | Ferret | employs    | a   |
|     | undervaryingmemorybudgetsFig.6showsthatFerretsuc- |      |         |     |         |     |          |          |               |          |        |              |     |        |            | 591 |
560
|     |     |     |     |     |     |     |     |     | fine-grained | pipeline |     | parallelism | strategy |     | to adapt | to 592 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------ | -------- | --- | ----------- | -------- | --- | -------- | ------ |
561 cessfullysolvesEq.2forobtainingoptimalpipelineconfig-
|     |          |             |         |        |               |     |                     |      | varying     | distributions | of         | incoming  | streaming    |          | data rapidly. | 593  |
| --- | -------- | ----------- | ------- | ------ | ------------- | --- | ------------------- | ---- | ----------- | ------------- | ---------- | --------- | ------------ | -------- | ------------- | ---- |
| 562 | urations | under       | dynamic |        | environments, |     | scaling effectively |      |             |               |            |           |              |          |               |      |
|     |          |             |         |        |               |     |                     |      | To mitigate | the           | gradient   | staleness |              | problem  | in parallel   | 594  |
|     | as       | we increase | the     | memory | constraint.   |     | Specifically,       | lack |             |               |            |           |              |          |               |      |
| 563 |          |             |         |        |               |     |                     |      | processing, | Ferret        | integrates |           | an iterative | gradient |               | com- |
595
564 of precise control over each pipeline stage to balance be- pensation algorithm to prevent performance degradation.
596
tweenperformanceandmemoryfootprintpreventscompet-
565 Additionally, pipelines are automatically scheduled to 597
566 ingstrategiesfromscalingwell. improve performance under any memory scenario by 598
|     |     |     |     |     |     |     |     |     | optimizing | a   | bi-level | optimization | problem. |     | Extensive | 599 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | -------- | ------------ | -------- | --- | --------- | --- |
6.4.ComparisonsonGradientsCompensation experiments conducted on 18 datasets and 5 models
| 567 |     |     |     |     |     |     |     |     |         |          |          |            |     |            |     | 600  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | -------- | -------- | ---------- | --- | ---------- | --- | ---- |
|     |     |     |     |     |     |     |     |     | confirm | Ferret’s | superior | efficiency | and | robustness |     | com- |
601
|     | To  | evaluate | the effectiveness |     | of  | Iter-Fisher, | we apply | var- |     |     |     |     |     |     |     |     |
| --- | --- | -------- | ----------------- | --- | --- | ------------ | -------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
568 pared to existing methods, demonstrating its potential as 602
569 ious gradients compensation algorithms to Ferret M+ and a scalable solution for adaptive, memory-efficient OCL. 603
8

| CVPR |     |     |     |     |     |     |     |     |     |     |     |     |     | CVPR |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| #715 |     |     |     |     |     |     |     |     |     |     |     |     |     | #715 |
CVPR2025Submission#715.CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE.
| 604 |     |     |     |     |     |     |     | WorkshoponMulti-TaskandLifelongReinforcementLearn- |           |     |     |     |     | 659 |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------------------------------------- | --------- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     | ing,2019.                                          | 1,2,6,7,5 |     |     |     |     | 660 |
605 References [13] TianqiChen,BingXu,ChiyuanZhang,andCarlosGuestrin. 661
|     |     |     |     |     |     |     |     | Training | deep nets | with | sublinear | memory | cost. arXiv | 662 |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | --------- | ---- | --------- | ------ | ----------- | --- |
606 [1] Mart´ın Abadi, Paul Barham, Jianmin Chen, Zhifeng Chen, preprintarXiv:1604.06174,2016. 3 663
| 607 | Andy Davis,                             | Jeffrey | Dean,       | Matthieu |     | Devin,     | Sanjay Ghe- |                                                    |             |       |     |          |              |     |
| --- | --------------------------------------- | ------- | ----------- | -------- | --- | ---------- | ----------- | -------------------------------------------------- | ----------- | ----- | --- | -------- | ------------ | --- |
|     |                                         |         |             |          |     |            |             | [14] YangruiChen,CongXie,MengMa,JunchengGu,Yanghua |             |       |     |          |              | 664 |
| 608 | mawat,GeoffreyIrving,MichaelIsard,etal. |         |             |          |     | TensorFlow | :           |                                                    |             |       |     |          |              |     |
|     |                                         |         |             |          |     | {          | }           | Peng,                                              | Haibin Lin, | Chuan | Wu, | and Yibo | Zhu. Sapipe: | 665 |
|     | a system                                | for     | Large-Scale | machine  |     | learning.  | In 12th     |                                                    |             |       |     |          |              |     |
609 Staleness-aware pipeline for data parallel dnn training. 666
|     | USENIXsymposiumonoperatingsystemsdesignandimple- | {   |     | }   |     |     |     |     |     |     |     |     |     |     |
| --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
610 Advances in Neural Information Processing Systems, 35: 667
611 mentation(OSDI16),pages265–283,2016. 1 17981–17993,2022. 6 668
| 612 | [2] Rahaf Aljundi, |     | Francesca | Babiloni, | Mohamed     |        | Elhoseiny, |                      |          |        |                     |     |     |     |
| --- | ------------------ | --- | --------- | --------- | ----------- | ------ | ---------- | -------------------- | -------- | ------ | ------------------- | --- | --- | --- |
|     |                    |     |           |           |             |        |            | [15] Franc¸ois       | Chollet. | keras. | https://github.com/ |     |     | 669 |
|     | Marcus Rohrbach,   |     | and       | Tinne     | Tuytelaars. | Memory | aware      |                      |          |        |                     |     |     |     |
| 613 |                    |     |           |           |             |        |            | fchollet/keras,2015. |          |        | 1                   |     |     | 670 |
614 synapses: Learningwhat(not)toforget. InProceedingsof [16] GregoryCohen,SaeedAfshar,JonathanTapson,andAndre
671
| 615 | theEuropeanconferenceoncomputervision(ECCV),pages |     |           |             |       |             |      |                                   |                                            |       |            |     |                 |     |
| --- | ------------------------------------------------- | --- | --------- | ----------- | ----- | ----------- | ---- | --------------------------------- | ------------------------------------------ | ----- | ---------- | --- | --------------- | --- |
|     |                                                   |     |           |             |       |             |      | VanSchaik.                        | Emnist:Extendingmnisttohandwrittenletters. |       |            |     |                 | 672 |
| 616 | 139–154,2018.                                     |     | 1,2,6,7,5 |             |       |             |      |                                   |                                            |       |            |     |                 |     |
|     |                                                   |     |           |             |       |             |      | In 2017                           | international                              | joint | conference | on  | neural networks | 673 |
|     | [3] Rahaf Aljundi,                                |     | Eugene    | Belilovsky, | Tinne | Tuytelaars, | Lau- |                                   |                                            |       |            |     |                 |     |
| 617 |                                                   |     |           |             |       |             |      | (IJCNN),pages2921–2926.IEEE,2017. |                                            |       |            | 4   |                 | 674 |
618 rent Charlin, Massimo Caccia, Min Lin, and Lucas Page- [17] Bita Darvish Rouhani, Huili Chen, and Farinaz Koushan-
675
| 619 | Caccia.       | Onlinecontinuallearningwithmaximalinterfered |           |        |             |            |      |                                                       |     |     |     |     |            |     |
| --- | ------------- | -------------------------------------------- | --------- | ------ | ----------- | ---------- | ---- | ----------------------------------------------------- | --- | --- | --- | --- | ---------- | --- |
|     |               |                                              |           |        |             |            |      | far. Deepsigns:Anend-to-endwatermarkingframeworkfor   |     |     |     |     |            | 676 |
| 620 | retrieval.    | Advances                                     | in        | neural | information | processing | sys- |                                                       |     |     |     |     |            |     |
|     |               |                                              |           |        |             |            |      | ownershipprotectionofdeepneuralnetworks.              |     |     |     |     | InProceed- | 677 |
| 621 | tems,32,2019. |                                              | 1,2,6,7,5 |        |             |            |      |                                                       |     |     |     |     |            |     |
|     |               |                                              |           |        |             |            |      | ingsofthetwenty-fourthinternationalconferenceonarchi- |     |     |     |     |            | 678 |
622 [4] RahafAljundi,MinLin,BaptisteGoujaud,andYoshuaBen- tecturalsupportforprogramminglanguagesandoperating 679
623 gio. Gradient based sample selection for online continual systems,pages485–497,2019. 1,2 680
| 624 | learning.     | Advances | in  | neural | information | processing | sys- |                                                        |                                        |     |     |     |     |     |
| --- | ------------- | -------- | --- | ------ | ----------- | ---------- | ---- | ------------------------------------------------------ | -------------------------------------- | --- | --- | --- | --- | --- |
|     |               |          |     |        |             |            |      | [18] MarcosDiasdeAssuncao,AlexandredaSilvaVeith,andRa- |                                        |     |     |     |     | 681 |
| 625 | tems,32,2019. |          | 1,2 |        |             |            |      |                                                        |                                        |     |     |     |     |     |
|     |               |          |     |        |             |            |      | jkumarBuyya.                                           | Distributeddatastreamprocessingandedge |     |     |     |     | 682 |
626 [5] JasonAnsel,EdwardYang,HoraceHe,NataliaGimelshein, computing:Asurveyonresourceelasticityandfuturedirec- 683
627 Animesh Jain, Michael Voznesensky, Bin Bao, Peter Bell, tions. JournalofNetworkandComputerApplications,103: 684
| 628 | David Berard, | Evgeni   | Burovski, |         | et al. | Pytorch  | 2: Faster |            |     |     |     |     |     |     |
| --- | ------------- | -------- | --------- | ------- | ------ | -------- | --------- | ---------- | --- | --- | --- | --- | --- | --- |
|     |               |          |           |         |        |          |           | 1–17,2018. | 1   |     |     |     |     | 685 |
|     | machine       | learning | through   | dynamic | python | bytecode | trans-    |            |     |     |     |     |     |     |
629 [19] Matthias De Lange and Tinne Tuytelaars. Continual pro- 686
630 formationandgraphcompilation. 2024. 1,2 totypeevolution: Learningonlinefromnon-stationarydata 687
631 [6] Jeff Barber, Ximing Yu, Laney Kuenzel Zamore, Jerry streams.InProceedingsoftheIEEE/CVFinternationalcon-
688
632 Lin, Vahid Jazayeri, Shie Erlich, Tony Savor, and Michael ferenceoncomputervision,pages8250–8259,2021.
|     |        |              |                                 |     |     |     |     |     |     |     |     |     | 1,2 | 689 |
| --- | ------ | ------------ | ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | Stumm. | Bladerunner: | Streamprocessingatscaleforalive |     |     |     |     |     |     |     |     |     |     |     |
633 [20] Matthias De Lange, Rahaf Aljundi, Marc Masana, Sarah 690
634 viewofbackenddatamutationsattheedge. InProceedings Parisot, Xu Jia, Alesˇ Leonardis, Gregory Slabaugh, and 691
635 oftheACMSIGOPS28thSymposiumonOperatingSystems TinneTuytelaars. Acontinuallearningsurvey:Defyingfor-
692
636 Principles,pages708–723,2021. 1 IEEEtransactionsonpattern
|     |                  |     |         |     |       |           |     | gettinginclassificationtasks. |     |     |     |     |     | 693 |
| --- | ---------------- | --- | ------- | --- | ----- | --------- | --- | ----------------------------- | --- | --- | --- | --- | --- | --- |
|     | [7] Saar Barkai, | Ido | Hakimi, | and | Assaf | Schuster. | Gap |                               |     |     |     |     |     |     |
637 analysisandmachineintelligence, 44(7):3366–3385, 2021. 694
638 aware mitigation of gradient staleness. arXiv preprint 3 695
639 arXiv:1909.10802,2019. 6,1 [21] Jia Deng, Wei Dong, Richard Socher, Li-Jia Li, Kai Li,
696
| 640 | [8] JockBlackard. |                                      | Covertype. | UCIMachineLearningReposi- |     |     |     |               |                                         |     |                               |     |     |     |
| --- | ----------------- | ------------------------------------ | ---------- | ------------------------- | --- | --- | --- | ------------- | --------------------------------------- | --- | ----------------------------- | --- | --- | --- |
|     |                   |                                      |            |                           |     |     |     | andLiFei-Fei. | Imagenet:                               |     | Alarge-scalehierarchicalimage |     |     | 697 |
|     | tory,1998.        | DOI:https://doi.org/10.24432/C50K5N. |            |                           |     |     | 6,4 |               |                                         |     |                               |     |     |     |
| 641 |                   |                                      |            |                           |     |     |     | database.     | In2009IEEEconferenceoncomputervisionand |     |                               |     |     | 698 |
642 [9] Pietro Buzzega, Matteo Boschini, Angelo Porrello, Davide patternrecognition,pages248–255.Ieee,2009. 6 699
643 Abati, and Simone Calderara. Dark experience for gen- [22] LiDeng.Themnistdatabaseofhandwrittendigitimagesfor
700
eralcontinuallearning: astrong,simplebaseline. Advances IEEESignalProcessingMaga-
| 644 |     |     |     |     |     |     |     | machinelearningresearch. |     |     |     |     |     | 701 |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------ | --- | --- | --- | --- | --- | --- |
645 inneuralinformationprocessingsystems,33:15920–15930, zine,29(6):141–142,2012. 6,4 702
646 2020. 1,2,3 [23] MatthewFDixon,IgorHalperin,andPaulBilokon.Machine 703
647 [10] Lucas Caccia, Rahaf Aljundi, Nader Asadi, Tinne Tuyte- learninginfinance. Springer,2020. 1
704
|     | laars, Joelle | Pineau, | and | Eugene | Belilovsky. |     | New insights |     |     |     |     |     |     |     |
| --- | ------------- | ------- | --- | ------ | ----------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
648 [24] Shiqing Fan, Yi Rong, Chen Meng, Zongyan Cao, Siyu 705
649 onreducingabruptrepresentationchangeinonlinecontinual Wang, Zhen Zheng, Chuan Wu, Guoping Long, Jun Yang, 706
650 learning. arXivpreprintarXiv:2104.05025,2021. 1,2 LixueXia,etal. Dapple:Apipelineddataparallelapproach 707
651 [11] ZhipengCai,OzanSener,andVladlenKoltun. Onlinecon- fortraininglargemodels. InProceedingsofthe26thACM
708
|     | tinual learning |     | with natural | distribution |     | shifts: | An empiri- |                                                   |     |     |     |     |     |     |
| --- | --------------- | --- | ------------ | ------------ | --- | ------- | ---------- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| 652 |                 |     |              |              |     |         |            | SIGPLANSymposiumonPrinciplesandPracticeofParallel |     |     |     |     |     | 709 |
653 calstudywithvisualdata. InProceedingsoftheIEEE/CVF Programming,pages431–445,2021. 6,1 710
654 international conference on computer vision, pages 8281– [25] ChrisanthaFernando,DylanBanarse,CharlesBlundell,Yori 711
655 8290,2021. 1,2,7 Zwols, David Ha, Andrei A Rusu, Alexander Pritzel, and
712
656 [12] Arslan Chaudhry, Marcus Rohrbach, Mohamed Elhoseiny, DaanWierstra.Pathnet:Evolutionchannelsgradientdescent 713
657 Thalaiyasingam Ajanthan, P Dokania, P Torr, and M Ran- insuperneuralnetworks. arXivpreprintarXiv:1701.08734, 714
658 zato. Continual learning with tiny episodic memories. In 2017. 1,2 715
9

| CVPR |     |     |     |     |     |     |     |     |     |     |     |     |     |     | CVPR |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| #715 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | #715 |
CVPR2025Submission#715.CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE.
716 [26] Chelsea Finn, Aravind Rajeswaran, Sham Kakade, and QuocVLe,YonghuiWu,etal. Gpipe: Efficienttrainingof 774
717 Sergey Levine. Online meta-learning. In International giantneuralnetworksusingpipelineparallelism. Advances 775
conferenceonmachinelearning,pages1920–1930.PMLR, inneuralinformationprocessingsystems,32,2019. 1
| 718 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | 776 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
719 2019. 1,2 [38] David Isele and Akansel Cosgun. Selective experience re- 777
720 [27] JeromeFriedman,TrevorHastie,andRobertTibshirani.The playforlifelonglearning. InProceedingsoftheAAAICon- 778
721 elementsofstatisticallearning. Springerseriesinstatistics ferenceonArtificialIntelligence,2018. 1,2 779
|     | NewYork,2001. |     |     | 4   |     |     |     |     |     |     |     |     |     |     |     |
| --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
722 [39] Anand Jayarajan, Kimberly Hau, Andrew Goodwin, and 780
723 [28] Yasir Ghunaim, Adel Bibi, Kumail Alhamoud, Motasem Gennady Pekhimenko. Lifestream: a high-performance 781
724 Alfarra, Hasan Abed Al Kader Hammoud, Ameya Prabhu, streamprocessingengineforperiodicstreams. InProceed- 782
725 PhilipHSTorr,andBernardGhanem. Real-timeevaluation ingsofthe26thACMInternationalConferenceonArchitec- 783
726 inonlinecontinuallearning:Anewhope. InProceedingsof tural Support for Programming Languages and Operating
784
theIEEE/CVFConferenceonComputerVisionandPattern
| 727 |     |     |     |     |     |     |     | Systems,pages107–122,2021. |     |     |     | 1   |     |     | 785 |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- |
728 Recognition,pages11888–11897,2023. 1,2,6 [40] Jiawei Jiang, Bin Cui, Ce Zhang, and Lele Yu. 786
729 [29] Rohit Girdhar, Alaaeldin El-Nouby, Zhuang Liu, Mannat Heterogeneity-awaredistributedparameterservers. InPro- 787
730 Singh, Kalyan Vasudev Alwala, Armand Joulin, and Ishan ceedingsofthe2017ACMInternationalConferenceonMan-
788
| 731 | Misra. | Imagebind:  |     | Oneembeddingspacetobindthemall. |            |     |             |                                  |     |     |     |     |     |     |     |
| --- | ------ | ----------- | --- | ------------------------------- | ---------- | --- | ----------- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- |
|     |        |             |     |                                 |            |     |             | agementofData,pages463–478,2017. |     |     |     |     | 6,1 |     | 789 |
|     | In     | Proceedings | of  | the IEEE/CVF                    | Conference |     | on Computer |                                  |     |     |     |     |     |     |     |
732 [41] Jin Kyu Kim, Qirong Ho, Seunghak Lee, Xun Zheng, Wei 790
733 VisionandPatternRecognition,pages15180–15190,2023. Dai, Garth A Gibson, and Eric P Xing. Strads: A dis- 791
734 1 tributed framework for scheduled model parallel machine
792
| 735 | [30] YueGuan,YuxianQiu,JingwenLeng,FanYang,ShuoYu, |         |                                        |     |     |     |     |                                       |                                           |     |     |     |     |     |     |
| --- | -------------------------------------------------- | ------- | -------------------------------------- | --- | --- | --- | --- | ------------------------------------- | ----------------------------------------- | --- | --- | --- | --- | --- | --- |
|     |                                                    |         |                                        |     |     |     |     | learning.                             | InProceedingsoftheEleventhEuropeanConfer- |     |     |     |     |     | 793 |
| 736 | YunxinLiu,YuFeng,YuhaoZhu,LidongZhou,YunLiang,     |         |                                        |     |     |     |     |                                       |                                           |     |     |     |     |     |     |
|     |                                                    |         |                                        |     |     |     |     | enceonComputerSystems,pages1–16,2016. |                                           |     |     |     |     | 1,2 | 794 |
|     | etal.                                              | Amanda: | Unifiedinstrumentationframeworkfordeep |     |     |     |     |                                       |                                           |     |     |     |     |     |     |
737 [42] AlexKrizhevsky,GeoffreyHinton,etal. Learningmultiple 795
738 neuralnetworks. 2023. 1,2 layersoffeaturesfromtinyimages. 2009. 6,4
796
| 739 | [31] Nuwan            | Gunasekara, |            | Bernhard                              | Pfahringer,                 |               | Heitor Murilo |                                                       |           |                                     |        |     |          |            |     |
| --- | --------------------- | ----------- | ---------- | ------------------------------------- | --------------------------- | ------------- | ------------- | ----------------------------------------------------- | --------- | ----------------------------------- | ------ | --- | -------- | ---------- | --- |
|     |                       |             |            |                                       |                             |               |               | [43] YoungDKwon,                                      |           | JagmohanChauhan,                    |        |     | HongJia, | StylianosI | 797 |
| 740 | Gomes,andAlbertBifet. |             |            |                                       | Surveyononlinestreamingcon- |               |               |                                                       |           |                                     |        |     |          |            |     |
|     |                       |             |            |                                       |                             |               |               | Venieris,andCeciliaMascolo.Lifelearner:Hardware-aware |           |                                     |        |     |          |            | 798 |
| 741 | tinuallearning.       |             |            | InProceedingsoftheThirty-SecondInter- |                             |               |               |                                                       |           |                                     |        |     |          |            |     |
|     |                       |             |            |                                       |                             |               |               | meta                                                  | continual | learning                            | system | for | embedded | computing  | 799 |
|     | national              | Joint       | Conference |                                       | on Artificial               | Intelligence, | IJCAI         |                                                       |           |                                     |        |     |          |            |     |
| 742 |                       |             |            |                                       |                             |               |               | platforms.                                            |           | arXivpreprintarXiv:2311.11420,2023. |        |     |          | 2          |     |
800
| 743 | 2023,                                              | 19th-25th |     | August 2023, | Macao, | SAR,                | China, pages |             |        |                     |           |          |              |             |     |
| --- | -------------------------------------------------- | --------- | --- | ------------ | ------ | ------------------- | ------------ | ----------- | ------ | ------------------- | --------- | -------- | ------------ | ----------- | --- |
|     |                                                    |           |     |              |        |                     |              | [44] Ya     | Le and | Xuan Yang.          | Tiny      | imagenet | visual       | recognition | 801 |
| 744 | 6628–6637.ijcai.org,2023.                          |           |     |              | 1      |                     |              |             |        |                     |           |          |              |             |     |
|     |                                                    |           |     |              |        |                     |              | challenge.  |        | CS231N,7(7):3,2015. |           |          | 6,3,4        |             | 802 |
| 745 | [32] CorentinHardy,ErwanLeMerrer,andBrunoSericola. |           |     |              |        |                     | Dis-         |             |        |                     |           |          |              |             |     |
|     |                                                    |           |     |              |        |                     |              | [45] Yiming | Li,    | Yanyan              | Shen, and | Lei      | Chen. Camel: | Manag-      |     |
|     | tributeddeeplearningonedge-devices:                |           |     |              |        | feasibilityviaadap- |              |             |        |                     |           |          |              |             | 803 |
746
|     |                                                  |     |     |                                   |     |     |     | ing                                               | data for | efficient | stream  | learning. | In  | Proceedings | of 804 |
| --- | ------------------------------------------------ | --- | --- | --------------------------------- | --- | --- | --- | ------------------------------------------------- | -------- | --------- | ------- | --------- | --- | ----------- | ------ |
| 747 | tivecompression.                                 |     |     | In2017IEEE16thinternationalsympo- |     |     |     |                                                   |          |           |         |           |     |             |        |
|     |                                                  |     |     |                                   |     |     |     | the2022InternationalConferenceonManagementofData, |          |           |         |           |     |             | 805    |
| 748 | siumonnetworkcomputingandapplications(NCA),pages |     |     |                                   |     |     |     |                                                   |          |           |         |           |     |             |        |
|     |                                                  |     |     |                                   |     |     |     | pages1271–1285,2022.                              |          |           | 2,6,1,3 |           |     |             | 806    |
| 749 | 1–8.IEEE,2017.                                   |     |     | 6,1                               |     |     |     |                                                   |          |           |         |           |     |             |        |
[46] ZhizhongLiandDerekHoiem.Learningwithoutforgetting.
| 750 | [33] KaimingHe,XiangyuZhang,ShaoqingRen,andJianSun. |     |     |     |     |     |     |     |     |     |     |     |     |     | 807 |
| --- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Deep residual learning for image recognition. In Proceed- IEEEtransactionsonpatternanalysisandmachineintelli- 808
751
|     |                                                   |     |     |     |     |     |     | gence,40(12):2935–2947,2017.                          |     |     |     | 6,7,1,5 |     |     | 809 |
| --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- | ----------------------------------------------------- | --- | --- | --- | ------- | --- | --- | --- |
| 752 | ingsoftheIEEEconferenceoncomputervisionandpattern |     |     |     |     |     |     |                                                       |     |     |     |         |     |     |     |
|     |                                                   |     |     |     |     |     |     | [47] ZhiqiuLin,JiaShi,DeepakPathak,andDevaRamanan.The |     |     |     |         |     |     | 810 |
| 753 | recognition,pages770–778,2016.                    |     |     |     |     | 6   |     |                                                       |     |     |     |         |     |     |     |
clearbenchmark:Continuallearningonreal-worldimagery.
| 754 | [34] Andrew | G   | Howard, | Menglong | Zhu, | Bo  | Chen, Dmitry |     |     |     |     |     |     |     | 811 |
| --- | ----------- | --- | ------- | -------- | ---- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
755 Kalenichenko, Weijun Wang, Tobias Weyand, Marco An- InThirty-fifthconferenceonneuralinformationprocessing 812
dreetto,andHartwigAdam. Mobilenets: Efficientconvolu- systemsdatasetsandbenchmarkstrack(round2),2021. 1, 813
756
|     |                                                  |     |     |     |     |     |       | 2,6,3,4 |     |     |     |     |     |     | 814 |
| --- | ------------------------------------------------ | --- | --- | --- | --- | --- | ----- | ------- | --- | --- | --- | --- | --- | --- | --- |
| 757 | tionalneuralnetworksformobilevisionapplications. |     |     |     |     |     | arXiv |         |     |     |     |     |     |     |     |
[48] ZimingLiu,ShengganCheng,HaotianZhou,andYangYou.
| 758 | preprintarXiv:1704.04861,2017. |     |     |     | 6   |     |     |     |     |     |     |     |     |     | 815 |
| --- | ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
759 [35] Qinghao Hu, Zhisheng Ye, Meng Zhang, Qiaoling Hanayo: Harnessing wave-like pipeline parallelism for en- 816
760 Chen, Peng Sun, Yonggang Wen, and Tianwei Zhang. hancedlargemodeltrainingefficiency.InProceedingsofthe 817
Hydro: Surrogate-Based hyperparametertuningservicein InternationalConferenceforHighPerformanceComputing, 818
761
|     |         | {     |           | }                           |     |     |     | Networking,StorageandAnalysis,pages1–13,2023. |     |     |     |     |     |     | 6,1 819 |
| --- | ------- | ----- | --------- | --------------------------- | --- | --- | --- | --------------------------------------------- | --- | --- | --- | --- | --- | --- | ------- |
| 762 | datacen | ters. | In17thUSE | NIXSymposiumonOperatingSys- |     |     |     |                                               |     |     |     |     |     |     |         |
763 temsDesignandImplementation(OSDI23),pages757–777, [49] Vincenzo Lomonaco and Davide Maltoni. Core50: a new 820
764 2023. 1,2 datasetandbenchmarkforcontinuousobjectrecognition. In 821
765 [36] Xing Hu, Ling Liang, Shuangchen Li, Lei Deng, Pengfei Conferenceonrobotlearning,pages17–26.PMLR,2017.6, 822
Zuo, Yu Ji, Xinfeng Xie, Yufei Ding, Chang Liu, Timothy 3,4 823
766
767 Sherwood,etal.Deepsniffer:Adnnmodelextractionframe- [50] David Lopez-Paz and Marc’Aurelio Ranzato. Gradient 824
768 workbasedonlearningarchitecturalhints. InProceedings episodic memory for continual learning. Advances in neu- 825
769 of the Twenty-Fifth International Conference on Architec- ralinformationprocessingsystems,30,2017. 1 826
770 tural Support for Programming Languages and Operating [51] ZhedaMai,RuiwenLi,JihwanJeong,DavidQuispe,Hyun-
827
|     | Systems,pages385–399,2020. |     |     |     | 1,2 |     |     |     |     |     |     |     |     |     |     |
| --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
771 woo Kim, and Scott Sanner. Online continual learning in 828
772 [37] YanpingHuang,YoulongCheng,AnkurBapna,OrhanFirat, imageclassification:Anempiricalsurvey. Neurocomputing, 829
773 Dehao Chen, Mia Chen, HyoukJoong Lee, Jiquan Ngiam, 469:28–51,2022. 1 830
10

| CVPR |     |     |     |     |     |     |     |     |     |     |     |     |     |     | CVPR |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| #715 |     |     |     |     |     |     |     |     |     |     |     |     |     |     | #715 |
CVPR2025Submission#715.CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE.
831 [52] Gaurav Menghani. Efficient deep learning: A survey on European Conference, Glasgow, UK, August 23–28, 2020, 888
832 making deep learning models smaller, faster, and better. Proceedings,PartII16,pages524–540.Springer,2020. 1, 889
|     | ACMComputingSurveys,55(12):1–37,2023. |     |     |     |     |     | 1   | 2   |     |     |     |     |     |     |     |
| --- | ------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 833 |                                       |     |     |     |     |     |     |     |     |     |     |     |     |     | 890 |
834 [53] Baharan Mirzasoleiman, Jeff Bilmes, and Jure Leskovec. [65] Penghui Qi, Xinyi Wan, Guangxing Huang, and Min 891
835 Coresetsfordata-efficienttrainingofmachinelearningmod- Lin. Zero bubble pipeline parallelism. arXiv preprint 892
els.InInternationalConferenceonMachineLearning,pages arXiv:2401.10241,2023. 6,1 893
836
|     |                      |     |     |     |     |     |     | [66] Jeff Rasley, | Samyam | Rajbhandari, |     | Olatunji | Ruwase, | and |     |
| --- | -------------------- | --- | --- | --- | --- | --- | --- | ----------------- | ------ | ------------ | --- | -------- | ------- | --- | --- |
| 837 | 6950–6960.PMLR,2020. |     |     | 1,2 |     |     |     |                   |        |              |     |          |         |     | 894 |
838 [54] PhilippMoritz, RobertNishihara, StephanieWang, Alexey YuxiongHe.Deepspeed:Systemoptimizationsenabletrain- 895
839 Tumanov,RichardLiaw,EricLiang,MelihElibol,Zongheng ing deep learning models with over 100 billion parame- 896
Yang, William Paul, Michael I Jordan, et al. Ray: A dis- ters.InProceedingsofthe26thACMSIGKDDInternational 897
840
|     |                              |     |     |     |                         |               |        | ConferenceonKnowledgeDiscovery&DataMining,pages |     |     |     |     |     |     | 898 |
| --- | ---------------------------- | --- | --- | --- | ----------------------- | ------------- | ------ | ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
| 841 | tributedframeworkforemerging |     |     |     | AI                      | applications. | In13th |                                                 |     |     |     |     |     |     |     |
|     |                              |     |     |     | { }                     |               |        | 3505–3506,2020.                                 |     | 1   |     |     |     |     |     |
| 842 | USENIXsymposiumonoperating   |     |     |     | syst emsdesignandimple- |               |        |                                                 |     |     |     |     |     |     | 899 |
843 mentation(OSDI18),pages561–577,2018. 1,2 [67] Sylvestre-Alvise Rebuffi, Alexander Kolesnikov, Georg 900
[55] KhanMuhammad,AminUllah,JaimeLloret,JavierDelSer, Sperl,andChristophHLampert.icarl:Incrementalclassifier 901
844
|     |                              |          |         |            |                     |     |               | andrepresentationlearning.InProceedingsoftheIEEEcon- |     |     |     |     |     |     | 902 |
| --- | ---------------------------- | -------- | ------- | ---------- | ------------------- | --- | ------------- | ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
| 845 | andVictorHugoCdeAlbuquerque. |          |         |            | Deeplearningforsafe |     |               |                                                      |     |     |     |     |     |     |     |
|     |                              |          |         |            |                     |     |               | ferenceonComputerVisionandPatternRecognition,pages   |     |     |     |     |     |     | 903 |
| 846 | autonomous                   | driving: | Current | challenges |                     | and | future direc- |                                                      |     |     |     |     |     |     |     |
|     |                              |          |         |            |                     |     |               | 2001–2010,2017.                                      |     | 1,2 |     |     |     |     |     |
847 tions. IEEETransactionsonIntelligentTransportationSys- 904
848 tems,22(7):4316–4336,2020. 1 [68] AndreiARusu, NeilCRabinowitz, GuillaumeDesjardins, 905
|     |                                                   |            |             |                |         |               |              | HubertSoyer,JamesKirkpatrick,KorayKavukcuoglu,Raz-   |        |                                |      |     |            |         | 906 |
| --- | ------------------------------------------------- | ---------- | ----------- | -------------- | ------- | ------------- | ------------ | ---------------------------------------------------- | ------ | ------------------------------ | ---- | --- | ---------- | ------- | --- |
| 849 | [56] MG Sarwar                                    | Murshed,   | Christopher |                | Murphy, |               | Daqing Hou,  |                                                      |        |                                |      |     |            |         |     |
|     |                                                   |            |             |                |         |               |              | vanPascanu,andRaiaHadsell.Progressiveneuralnetworks. |        |                                |      |     |            |         | 907 |
| 850 | NazarKhan,GaneshAnanthanarayanan,andFarazHussain. |            |             |                |         |               |              |                                                      |        |                                |      |     |            |         |     |
|     |                                                   |            |             |                |         |               |              | arXivpreprintarXiv:1606.04671,2016.                  |        |                                |      |     | 1,2        |         | 908 |
| 851 | Machinelearningatthenetworkedge:Asurvey.ACMCom-   |            |             |                |         |               |              |                                                      |        |                                |      |     |            |         |     |
|     |                                                   |            |             |                |         |               |              | [69] Doyen                                           | Sahoo, | Quang Pham,                    | Jing | Lu, | and Steven | CH Hoi. |     |
| 852 | putingSurveys(CSUR),54(8):1–37,2021.              |            |             |                |         | 1             |              |                                                      |        |                                |      |     |            |         | 909 |
|     |                                                   |            |             |                |         |               |              | Onlinedeeplearning:Learningdeepneuralnetworksonthe   |        |                                |      |     |            |         | 910 |
| 853 | [57] Deepak                                       | Narayanan, | Aaron       | Harlap,        |         | Amar          | Phanishayee, |                                                      |        |                                |      |     |            |         |     |
|     |                                                   |            |             |                |         |               |              | fly. arXivpreprintarXiv:1711.03705,2017.             |        |                                |      |     | 1,2        |         | 911 |
| 854 | Vivek Seshadri,                                   |            | Nikhil      | R Devanur,     |         | Gregory       | R Ganger,    |                                                      |        |                                |      |     |            |         |     |
|     |                                                   |            |             |                |         |               |              | [70] DavidSayce.                                     |        | Thenumberoftweetsperdayin2022. |      |     |            | 2022.   | 912 |
| 855 | Phillip B                                         | Gibbons,   | and         | Matei Zaharia. |         | Pipedream:    | gener-       |                                                      |        |                                |      |     |            |         |     |
|     |                                                   |            |             |                |         |               |              | 1                                                    |        |                                |      |     |            |         | 913 |
| 856 | alizedpipelineparallelismfordnntraining.          |            |             |                |         | InProceedings |              |                                                      |        |                                |      |     |            |         |     |
ofthe27thACMsymposiumonoperatingsystemsprinciples, [71] AlexanderSergeevandMikeDelBalso. Horovod: fastand 914
857
|     |                                                        |     |       |              |     |       |          | easydistributeddeeplearningintensorflow. |              |         |                    |          | arXivpreprint |               | 915 |
| --- | ------------------------------------------------------ | --- | ----- | ------------ | --- | ----- | -------- | ---------------------------------------- | ------------ | ------- | ------------------ | -------- | ------------- | ------------- | --- |
| 858 | pages1–15,2019.                                        |     | 4,6,1 |              |     |       |          |                                          |              |         |                    |          |               |               |     |
|     |                                                        |     |       |              |     |       |          | arXiv:1802.05799,2018.                   |              |         | 1                  |          |               |               | 916 |
| 859 | [58] Deepak Narayanan,                                 |     | Amar  | Phanishayee, |     | Kaiyu | Shi, Xie |                                          |              |         |                    |          |               |               |     |
|     |                                                        |     |       |              |     |       |          | [72] Mohammad                            | Shoeybi,     | Mostofa |                    | Patwary, | Raul          | Puri, Patrick | 917 |
| 860 | Chen,andMateiZaharia.Memory-efficientpipeline-parallel |     |       |              |     |       |          |                                          |              |         |                    |          |               |               |     |
|     |                                                        |     |       |              |     |       |          | LeGresley,                               | JaredCasper, |         | andBryanCatanzaro. |          |               | Megatron-     |     |
|     | dnntraining.InInternationalConferenceonMachineLearn-   |     |       |              |     |       |          |                                          |              |         |                    |          |               |               | 918 |
861
|     |                                               |     |        |       |         |            |           | lm: Trainingmulti-billionparameterlanguagemodelsusing |      |                                     |     |       |         |             | 919 |
| --- | --------------------------------------------- | --- | ------ | ----- | ------- | ---------- | --------- | ----------------------------------------------------- | ---- | ----------------------------------- | --- | ----- | ------- | ----------- | --- |
| 862 | ing,pages7937–7947.PMLR,2021.                 |     |        |       | 3,4,6,1 |            |           |                                                       |      |                                     |     |       |         |             |     |
|     |                                               |     |        |       |         |            |           | modelparallelism.                                     |      | arXivpreprintarXiv:1909.08053,2019. |     |       |         |             | 920 |
| 863 | [59] Yuval Netzer,                            | Tao | Wang,  | Adam  | Coates, | Alessandro | Bis-      |                                                       |      |                                     |     |       |         |             |     |
|     |                                               |     |        |       |         |            |           | 1                                                     |      |                                     |     |       |         |             | 921 |
| 864 | sacco, Baolin                                 | Wu, | Andrew | Y Ng, | et al.  | Reading    | digits in |                                                       |      |                                     |     |       |         |             |     |
|     |                                               |     |        |       |         |            |           | [73] Kai Sheng                                        | Tai, | Vatsal Sharan,                      |     | Peter | Bailis, | and Gregory | 922 |
|     | naturalimageswithunsupervisedfeaturelearning. |     |        |       |         |            | InNIPS    |                                                       |      |                                     |     |       |         |             |     |
865 Valiant. Sketching linear classifiers over data streams. In
923
| 866 | workshopondeeplearningandunsupervisedfeaturelearn- |      |              |     |              |      |             |                                                      |          |          |               |         |            |         |     |
| --- | -------------------------------------------------- | ---- | ------------ | --- | ------------ | ---- | ----------- | ---------------------------------------------------- | -------- | -------- | ------------- | ------- | ---------- | ------- | --- |
|     |                                                    |      |              |     |              |      |             | Proceedings                                          | of       | the 2018 | international |         | conference | on man- | 924 |
| 867 | ing,page7.Granada,Spain,2011.                      |      |              |     | 6,4          |      |             |                                                      |          |          |               |         |            |         |     |
|     |                                                    |      |              |     |              |      |             | agementofdata,pages757–772,2018.                     |          |          |               |         | 1          |         | 925 |
| 868 | [60] Shuaicheng                                    | Niu, | Jiaxiang     | Wu, | Yifan Zhang, |      | Yaofo Chen, |                                                      |          |          |               |         |            |         |     |
|     |                                                    |      |              |     |              |      |             | [74] Hugo                                            | Touvron, | Thibaut  | Lavril,       | Gautier | Izacard,   | Xavier  | 926 |
|     | Shijian Zheng,                                     |      | Peilin Zhao, | and | Mingkui      | Tan. | Efficient   |                                                      |          |          |               |         |            |         |     |
| 869 |                                                    |      |              |     |              |      |             | Martinet,Marie-AnneLachaux,Timothe´eLacroix,Baptiste |          |          |               |         |            |         | 927 |
870 test-time model adaptation without forgetting. In Interna- Rozie`re, Naman Goyal, Eric Hambro, Faisal Azhar, et al.
928
| 871 | tionalconferenceonmachinelearning,pages16888–16905. |     |     |                     |     |     |       |                                     |      |               |            |     |          |         |     |
| --- | --------------------------------------------------- | --- | --- | ------------------- | --- | --- | ----- | ----------------------------------- | ---- | ------------- | ---------- | --- | -------- | ------- | --- |
|     |                                                     |     |     |                     |     |     |       | Llama:                              | Open | and efficient | foundation |     | language | models. | 929 |
| 872 | PMLR,2022.                                          | 1   |     |                     |     |     |       |                                     |      |               |            |     |          |         |     |
|     |                                                     |     |     |                     |     |     |       | arXivpreprintarXiv:2302.13971,2023. |      |               |            |     | 1        |         | 930 |
|     | [61] NVIDIA,Pe´terVingelmann,                       |     |     | andFrankH.P.Fitzek. |     |     | Cuda, |                                     |      |               |            |     |          |         |     |
873 [75] Ehsan Valavi, Joel Hestness, Newsha Ardalani, and Marco 931
874 release:10.2.89,2020. 2 Iansiti. Time and the value of data. arXiv preprint 932
875 [62] Alecos Papadopoulos. The information matrix equality: arXiv:2203.09118,2022. 1,3
933
| 876 | proof, misspecification, |        |            | and the | quasi-maximum |     | likelihood |                                                        |     |     |     |     |     |     |     |
| --- | ------------------------ | ------ | ---------- | ------- | ------------- | --- | ---------- | ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- |
|     |                          |        |            |         |               |     |            | [76] SinisˇaVeseli,JohnHammonds,StevenHenke,HannahPar- |     |     |     |     |     |     | 934 |
|     | estimator.               | Athens | University | of      | Economics     | and | Business,  |                                                        |     |     |     |     |     |     |     |
877 raga, and Nicholas Schwarz. Streaming data from exper- 935
878 2014. 4 imental facilities to supercomputers for real-time data pro- 936
879 [63] Adam Paszke, Sam Gross, Francisco Massa, Adam Lerer, cessing.InProceedingsoftheSC’23WorkshopsofTheInter- 937
880 James Bradbury, Gregory Chanan, Trevor Killeen, Zeming nationalConferenceonHighPerformanceComputing,Net-
938
881 Lin,NataliaGimelshein,LucaAntiga,etal.Pytorch:Anim- work,Storage,andAnalysis,pages2110–2117,2023. 1 939
882 perativestyle, high-performancedeeplearninglibrary. Ad- [77] LiyuanWang, XingxingZhang, HangSu, andJunZhu. A 940
883 vancesinneuralinformationprocessingsystems,32,2019. comprehensivesurveyofcontinuallearning:Theory,method 941
884 1 andapplication. IEEETransactionsonPatternAnalysisand 942
|     |     |     |     |     |     |     |     | MachineIntelligence,2024. |     |     | 1   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------- | --- | --- | --- | --- | --- | --- | --- |
885 [64] Ameya Prabhu, Philip HS Torr, and Puneet K Dokania. 943
886 Gdumb: A simple approach that questions our progress in [78] Han Xiao, Kashif Rasul, and Roland Vollgraf. Fashion- 944
887 continuallearning. InComputerVision–ECCV2020: 16th mnist: a novel image dataset for benchmarking machine 945
11

CVPR CVPR
#715 #715
|     |                                                        |         | CVPR2025Submission#715.           |     |           |            | CONFIDENTIALREVIEWCOPY.DONOTDISTRIBUTE. |
| --- | ------------------------------------------------------ | ------- | --------------------------------- | --- | --------- | ---------- | --------------------------------------- |
| 946 | learningalgorithms.arXivpreprintarXiv:1708.07747,2017. |         |                                   |     |           |            |                                         |
| 947 | 6,4                                                    |         |                                   |     |           |            |                                         |
| 948 | [79] Minhui Xie,                                       | Kai     | Ren, Youyou                       | Lu, | Guangxu   | Yang,      | Qingx-                                  |
| 949 | ingXu, BihaiWu,                                        |         | JiazhenLin,                       |     | HongboAo, | WanhongXu, |                                         |
| 950 | andJiwuShu.                                            | Kraken: | memory-efficientcontinuallearning |     |           |            |                                         |
| 951 | forlarge-scalereal-timerecommendations.                |         |                                   |     |           | InSC20:    | Inter-                                  |
nationalConferenceforHighPerformanceComputing,Net-
952
| 953 | working,StorageandAnalysis,pages1–17.IEEE,2020. |               |                                     |     |            |     | 2         |
| --- | ----------------------------------------------- | ------------- | ----------------------------------- | --- | ---------- | --- | --------- |
| 954 | [80] YuYang,HaoKang,andBaharanMirzasoleiman.    |               |                                     |     |            |     | Towards   |
| 955 | sustainablelearning:                            |               | Coresetsfordata-efficientdeeplearn- |     |            |     |           |
|     | ing. In                                         | International | Conference                          |     | on Machine |     | Learning, |
956
| 957 | pages39314–39330.PMLR,2023.                         |       |             |          | 1   |          |         |
| --- | --------------------------------------------------- | ----- | ----------- | -------- | --- | -------- | ------- |
| 958 | [81] Jaehong                                        | Yoon, | Eunho Yang, | Jeongtae |     | Lee, and | Sung Ju |
| 959 | Hwang.Lifelonglearningwithdynamicallyexpandablenet- |       |             |          |     |          |         |
|     | works. arXivpreprintarXiv:1708.01547,2017.          |       |             |          |     | 1,2      |         |
960
| 961 | [82] JaehongYoon,DivyamMadaan,EunhoYang,andSungJu      |                                     |            |          |                        |                |     |
| --- | ------------------------------------------------------ | ----------------------------------- | ---------- | -------- | ---------------------- | -------------- | --- |
| 962 | Hwang. Onlinecoresetselectionforrehearsal-basedcontin- |                                     |            |          |                        |                |     |
| 963 | uallearning.                                           | arXivpreprintarXiv:2106.01085,2021. |            |          |                        |                | 1,2 |
| 964 | [83] QuanluZhang,                                      | ZhenhuaHan,                         |            | FanYang, |                        | YugeZhang,     | Zhe |
| 965 | Liu,MaoYang,andLidongZhou.                             |                                     |            |          | Retiarii:Adeeplearning |                |     |
| 966 | Exploratory-Training                                   |                                     | framework. |          | In14thUSENIXSym-       |                |     |
|     | {                                                      |                                     | }          |          |                        |                |     |
| 967 | posium on                                              | Operating                           | Systems    | Design   | and                    | Implementation |     |
|     | (OSDI20),pages919–936,2020.                            |                                     |            |          | 1,2                    |                |     |
968
| 969 | [84] ShuxinZheng,QiMeng,TaifengWang,WeiChen,Nenghai |         |            |           |                      |                  |             |
| --- | --------------------------------------------------- | ------- | ---------- | --------- | -------------------- | ---------------- | ----------- |
| 970 | Yu,Zhi-MingMa,andTie-YanLiu.                        |         |            |           | Asynchronousstochas- |                  |             |
| 971 | tic gradient                                        | descent | with       | delay     | compensation.        |                  | In Interna- |
| 972 | tional conference                                   |         | on machine | learning, |                      | pages 4120–4129. |             |
|     | PMLR,2017.                                          | 5,1     |            |           |                      |                  |             |
973
| 974 | [85] Zhen Zheng,            | Chanyoung    |          | Oh, Jidong       | Zhai,     | Xipeng         | Shen,     |
| --- | --------------------------- | ------------ | -------- | ---------------- | --------- | -------------- | --------- |
| 975 | YoungminYi,andWenguangChen. |              |          |                  | Hiwaylib: |                | Asoftware |
| 976 | framework                   | for enabling |          | high performance |           | communications |           |
|     | for heterogeneous           |              | pipeline | computations.    |           | In Proceedings |           |
977
| 978 | oftheTwenty-FourthInternationalConferenceonArchitec- |     |             |     |           |                |           |
| --- | ---------------------------------------------------- | --- | ----------- | --- | --------- | -------------- | --------- |
| 979 | tural Support                                        | for | Programming |     | Languages | and            | Operating |
| 980 | Systems,pages153–166,2019.                           |     |             | 1,2 |           |                |           |
|     | [86] YuhaoZhou,QingYe,andJianchengLv.                |     |             |     |           | Communication- |           |
981
| 982 | efficient                                            | federated | learning | with | compensated |     | overlap- |
| --- | ---------------------------------------------------- | --------- | -------- | ---- | ----------- | --- | -------- |
| 983 | fedavg. IEEETransactionsonParallelandDistributedSys- |           |          |      |             |     |          |
| 984 | tems,33(1):192–205,2021.                             |           |          | 1    |             |     |          |
|     | [87] YuhaoZhou,MingjiaShi,YuanxiLi,YananSun,QingYe,  |           |          |      |             |     |          |
985
| 986 | andJianchengLv.                                        |     | Communication-efficientfederatedlearn- |     |     |     |     |
| --- | ------------------------------------------------------ | --- | -------------------------------------- | --- | --- | --- | --- |
| 987 | ingwithsingle-stepsyntheticfeaturescompressorforfaster |     |                                        |     |     |     |     |
| 988 | convergence.InProceedingsoftheIEEE/CVFInternational    |     |                                        |     |     |     |     |
| 989 | ConferenceonComputerVision,pages5031–5040,2023.        |     |                                        |     |     |     | 1   |
12