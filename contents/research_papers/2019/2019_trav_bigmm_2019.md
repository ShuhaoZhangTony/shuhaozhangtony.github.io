2019 IEEE Fifth International Conference on Multimedia Big Data (BigMM)
TraV:ANINTERACTIVEEXPLORATIONSYSTEMFORMASSIVETRAJECTORYDATA
JieliangAng,TianyuanFu,JohnsPaul,ShuhaoZhang,BingshengHe,
TeddySisonDavidWenceslao,SienYiTan
Grab-NUSAILab,NationalUniversityofSingapore
ABSTRACT missing roads) and assist users travelling to unfamiliar geo-
|     |     |     |     |     |     |     | graphical | regions | (e.g., | identify | popular | nearby | trajectories). |     |
| --- | --- | --- | --- | --- | --- | --- | --------- | ------- | ------ | -------- | ------- | ------ | -------------- | --- |
TheproliferationofmodernGPS-enableddeviceslikesmart- Howeverin-spiteofitsusefulness,supportingsuchaqueryis
phoneshaveledtosignificantresearchinterestinlarge-scale
challengingduetothefollowingreasons.
| trajectoryexploration, |         | whichaimstoidentifyallnearbytra- |             |            |                |             |            |                                            |     |       |            |        |          |       |
| ---------------------- | ------- | -------------------------------- | ----------- | ---------- | -------------- | ----------- | ---------- | ------------------------------------------ | --- | ----- | ---------- | ------ | -------- | ----- |
|                        |         |                                  |             |            |                |             | First,     | composing                                  | an  | input | trajectory | itself | is often | a te- |
| jectories              | of a    | given input                      | trajectory. | Trajectory |                | exploration |            |                                            |     |       |            |        |          |       |
|                        |         |                                  |             |            |                |             | dioustask. | Wefoundthatdatascientistsoftenspendconsid- |     |       |            |        |          |       |
| is useful              | in many | scenarios,                       | for         | example,   | in identifying | in-         |            |                                            |     |       |            |        |          |       |
erableamountsoftimeinexpressingtheirtrajectoryqueries
| correct road                               | network        | information  |        | or in assisting |                | users when    |               |                |          |               |            |              |         |          |
| ------------------------------------------ | -------------- | ------------ | ------ | --------------- | -------------- | ------------- | ------------- | -------------- | -------- | ------------- | ---------- | ------------ | ------- | -------- |
|                                            |                |              |        |                 |                |               | as precise    | geographical   |          | coordinates,  |            | either       | through | SQL or   |
| traveling                                  | in unfamiliar  | geographical |        | regions         | as             | it can reveal |               |                |          |               |            |              |         |          |
|                                            |                |              |        |                 |                |               | other general | purpose        |          | programming   |            | languages    | (e.g.,  | Java,    |
| thepopularityofcertainroutes/trajectories. |                |              |        |                 | Inthisstudy,we |               |               |                |          |               |            |              |         |          |
|                                            |                |              |        |                 |                |               | Python).      | Second,        | the high | computational |            | complexity   |         | makes    |
| develop                                    | an interactive | trajectory   |        | exploration     | system,        | named         |               |                |          |               |            |              |         |          |
|                                            |                |              |        |                 |                |               | the naive     | implementation |          | of            | this query | impractical. |         | Specifi- |
| TraV. TraV                                 | allows         | users to     | easily | plot and        | explore        | trajecto-     |               |                |          |               |            |              |         |          |
cally,givenaninputtrajectory,thenaiveimplementationde-
riesusinganinteractiveGraphicalUserInterface(GUI)con-
|           |        |                     |           |          |       |             | composes           | the input | into        | a list       | of <start, | end> | coordinates. |         |
| --------- | ------ | ------------------- | --------- | -------- | ----- | ----------- | ------------------ | --------- | ----------- | ------------ | ---------- | ---- | ------------ | ------- |
| taining a | map    | of the geographical |           | region.  | TraV  | applies the |                    |           |             |              |            |      |              |         |
|           |        |                     |           |          |       |             | The implementation |           | then        | iterates     | through    | all  | relevant     | histor- |
| Hidden    | Markov | Model to            | calibrate | the user | input | trajectory  |                    |           |             |              |            |      |              |         |
|           |        |                     |           |          |       |             | ical trajectories  |           | to identify | trajectories |            | that | are close    | enough  |
andthenmakesuseofthemassivelyparallelexecutioncapa-
|     |     |     |     |     |     |     | (determined | based | on  | predefined | threshold) |     | to every | pair of |
| --- | --- | --- | --- | --- | --- | --- | ----------- | ----- | --- | ---------- | ---------- | --- | -------- | ------- |
bilitiesofmodernhardwaretoquicklyidentifynearbytrajec-
<start, end>
|                                    |     |     |     |     |                  |     |     | positions, |     | leading | to high | computational |     | com- |
| ---------------------------------- | --- | --- | --- | --- | ---------------- | --- | --- | ---------- | --- | ------- | ------- | ------------- | --- | ---- |
| toriestotheinputprovidedbytheuser. |     |     |     |     | Inordertoensurea |     |     |            |     |         |         |               |     |      |
plexity. Third,atrajectoryexplorationsystemshouldensure
| seamless    | user   | experience,   | TraV adopts         | a            | progressive    | execu-     |                 |                  |        |        |               |          |              |           |
| ----------- | ------ | ------------- | ------------------- | ------------ | -------------- | ---------- | --------------- | ---------------- | ------ | ------ | ------------- | -------- | ------------ | --------- |
|             |        |               |                     |              |                |            | fast response   | to               | user’s | query, | especially    | when     | it is        | intended  |
| tion model  | that   | contrasts     | to the conventional |              | “query-before- |            |                 |                  |        |        |               |          |              |           |
|             |        |               |                     |              |                |            | for use         | by non-technical |        | users  | for the       | purposes | of           | identify- |
| process”    | model. | Demonstration |                     | participants | will           | gain expe- |                 |                  |        |        |               |          |              |           |
|             |        |               |                     |              |                |            | ing interesting | trajectories     |        | in     | an unfamiliar |          | geographical | re-       |
| rience with | TraV   | and its       | ability             | to calibrate | user           | input and  |                 |                  |        |        |               |          |              |           |
gion. Giventhehighcomputationalcostoftrajectoryexplo-
analyzebillionsoftrajectoriesobtainedfromGrabdriversin
ration,thisisalmostimpossibletoachievewhenadoptingthe
Singapore.
conventional“query-before-process”executionmodelthatre-
quirestheusertoexpresstheentireinputtrajectorybeforethe
|        |                | 1. INTRODUCTION |     |             |     |              | trajectoryexplorationcanbeinitiated. |     |       |             |     |            |     |          |
| ------ | -------------- | --------------- | --- | ----------- | --- | ------------ | ------------------------------------ | --- | ----- | ----------- | --- | ---------- | --- | -------- |
|        |                |                 |     |             |     |              | To address                           | the | above | challenges, |     | we develop | an  | interac- |
| Due to | the widespread | usage           | of  | GPS-enabled |     | devices like |                                      |     |       |             |     |            |     |          |
tivetrajectoryexplorationsystemnamedTraV.Toaddressthe
smartphones,massiveamountsoftrajectorydataisbeinggen-
firstchallenge,TraVallowsuserstoexpresstheirinputtrajec-
| eratedinrealtime. |     | Analysingsuchtrajectorydataiscritical |     |     |     |     |     |     |     |     |     |     |     |     |
| ----------------- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
toryusingasimpleGraphicalUserInterface(GUI).However,
| toanumberofdomainsincludingtransportanalysis, |     |     |     |     |     | animal |     |     |     |     |     |     |     |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
movement study etc. In this work, we study the problem of such a GUI based implementation comes with its own sets
|     |     |     |     |     |     |     | of challenges. | For | example, |     | plotting | trajectories | by  | hand is |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | -------- | --- | -------- | ------------ | --- | ------- |
largescaletrajectoryexploration,whichaimstoidentifyall
|     |     |     |     |     |     |     | hardly accurate. |     | Hence, | TraV | calibrates | the | input | automati- |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ------ | ---- | ---------- | --- | ----- | --------- |
nearbytrajectoriesofagiveninputtrajectory.
|          |            |                  |        |           |               |              | cally and         | progressively |                | based | on the       | Hidden      | Markov           | Model |
| -------- | ---------- | ---------------- | ------ | --------- | ------------- | ------------ | ----------------- | ------------- | -------------- | ----- | ------------ | ----------- | ---------------- | ----- |
| Such     | a query    | is fundamentally |        | different |               | from related |                   |               |                |       |              |             |                  |       |
|          |            |                  |        |           |               |              | when the          | users         | are expressing |       | their        | trajectory. | This             | auto- |
| works on | trajectory | similarity       | search | [12]      | or trajectory | sim-         |                   |               |                |       |              |             |                  |       |
|          |            |                  |        |           |               |              | matic calibration |               | is analogous   |       | to automatic |             | text correction. |       |
ilarityjoins[11]asthenearbytrajectoriesarenotnecessarily
|         |        |                  |     |         |          |          | To handle | the second | challenge, |     | TraV | makes | use | of aggres- |
| ------- | ------ | ---------------- | --- | ------- | -------- | -------- | --------- | ---------- | ---------- | --- | ---- | ----- | --- | ---------- |
| similar | to the | input trajectory | as  | a whole | but they | may par- |           |            |            |     |      |       |     |            |
siveindexingandtakesadvantageofthemassiveparallelism
| tiallypassbythesameareaofinterest. |       |                  |     | InGrab[3],wehave |     |          |          |           |          |     |          |     |     |           |
| ---------------------------------- | ----- | ---------------- | --- | ---------------- | --- | -------- | -------- | --------- | -------- | --- | -------- | --- | --- | --------- |
|                                    |       |                  |     |                  |     |          | provided | by modern | hardware |     | devices. | The | use | of index- |
| found this                         | query | to be especially |     | beneficial.      | For | example, |          |           |          |     |          |     |     |           |
ingallowsTraVtominimizetheamountofcomputationand
| it can help | identify | incorrect | road | network | information | (e.g. |     |     |     |     |     |     |     |     |
| ----------- | -------- | --------- | ---- | ------- | ----------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
theparallelexecutionmodelallowsittoconcurrentlyprocess
massiveamountsofunderlyingtrajectorydata.Toaddressthe
JieliangAngandTianyuanFucontributeequallytothiswork.Thecor-
|     |     |     |     |     |     |     | third challenge, |     | TraV | adopts | a progressive |     | execution | model |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | ---- | ------ | ------------- | --- | --------- | ----- |
respondingauthorsareJohnsPaulandShuhaoZhang.
| 978-1-7281-5527-2/19/$31.00 ©2019 IEEE |     |     |     |     |     |     | 309 |     |     |     |     |     |     |     |
| -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
DOI 10.1109/BigMM.2019.00058
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:16:01 UTC from IEEE Xplore.  Restrictions apply.

| that calibrates  | the | input      | trajectories | and   | explores   | the  | under-   |     |     |        |     |     |        |     |
| ---------------- | --- | ---------- | ------------ | ----- | ---------- | ---- | -------- | --- | --- | ------ | --- | --- | ------ | --- |
|                  |     |            |              |       |            |      |          |     |     | Client |     |     | Server |     |
| lying trajectory |     | data while | the          | input | trajectory | data | is being |     |     |        |     |     |        |     |
Parameters
| expressed | by the | user. This | provides |     | quick | responses | to the |     |     |     |     |     |     |     |
| --------- | ------ | ---------- | -------- | --- | ----- | --------- | ------ | --- | --- | --- | --- | --- | --- | --- |
Setting
user,thusensuringaseamlessuserexperience.
Calibration
| Overall,ourdemonstrationofTraVaimstoshowtheuse- |     |     |     |     |     |     |     |     |     | Trajectory |     |     |     |     |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- |
fulnessofaninteractivetrajectoryexplorationsystemcapable Editor
| ofexploringbillionsofGPScoordinatesinreal-time. |     |     |     |     |     |     | Inthe | User | GUI |            |     |     |     |       |
| ----------------------------------------------- | --- | --- | --- | --- | --- | --- | ----- | ---- | --- | ---------- | --- | --- | --- | ----- |
|                                                 |     |     |     |     |     |     |       |      |     | Calibrated |     |     |     | Index |
remainder of this paper, we present the implementation and Trajectory
describeoursolutions.
|     |     |     |     |     |     |     |     |     |     |         | Query |     | Query     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | ----- | --- | --------- | --- |
|     |     |     |     |     |     |     |     |     |     | Results |       |     | Processor |     |
2. TRAJECTORYEXPLORATION
|     |     |     |     |     |     |     |     | Fig.1: | ArchitectureofTraV.Solidrectanglesrepresentma- |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ---------------------------------------------- | --- | --- | --- | --- | --- |
Trajectoryexplorationaimstoidentifynearbytrajectoriesof
jorcomponentsanddottedrectanglesrepresentauxiliarydata
| an input | trajectory. | In the | typical | scenarios |     | we explored | in  |     |     |     |     |     |     |     |
| -------- | ----------- | ------ | ------- | --------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
structures/parameters.
this study (i.e., identifying incorrect road network data and Finally,wedefinetrajectoryexplorationqueryasfollows.
assistingusersinexploringunfamiliargeographicalregions),
whatweareinterestedinarethetrajectoriesthatpassthrough Given an input trajectory
|     |     |     |     |     |     |     |     | Definition |     | 2.4. |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ---- | --- | --- | --- | --- |
the same path/road of the input trajectory. However, exist- T q =<p 1 ,p 2 ,...,p n >, and a set of N trajectories
ingtrajectorysimilaritysearch[12]ortrajectoryjoin[11]im- (<T ,T ,...,T >), the trajectory exploration query
|     |     |     |     |     |     |     |     | 1   | 2   | N   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
plementations may consider the input trajectory to be very should identify all trajectories (< T ,T ,...,T >) that are
|     |     |     |     |     |     |     |     |     |     |     |     | 1   | 2 k |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
differentfromanyunderlyingtrajectorybecauseoftheirdif- near-bytrajectoriesofT.
| ferentresolutionsandlengths. |     |     |            | Asaresult,weneedtorevisit |     |        |        |     |     |     |     |     |     |     |
| ---------------------------- | --- | --- | ---------- | ------------------------- | --- | ------ | ------ | --- | --- | --- | --- | --- | --- | --- |
| new implementations          |     | of  | trajectory | exploration               |     | query. | In the |     |     |     |     |     |     |     |
following, we present the formal definition of the trajectory 3. SYSTEMARCHITECTURE
explorationquery.
Followingpreviousworks, suchas[11], wedefineatra- ThesystemarchitectureofTraVisshowninFigure1. TraV
adoptsaclient-servermodeltoallowwideusageofthesys-
| jectory as | follows. | Note | that, | TraV | is not | restricted | by the |     |     |     |     |     |     |     |
| ---------- | -------- | ---- | ----- | ---- | ------ | ---------- | ------ | --- | --- | --- | --- | --- | --- | --- |
point-based representation used in this section and can be tem by a variety of users while also taking advantage of the
adapted to use other representations such as segment-based massivecomputationalcapabilityofmodernserverhardware.
|     |     |     |     |     |     |     |     | Overall | TraV | comprises | of three | main | units: 1) | a GUI unit |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---- | --------- | -------- | ---- | --------- | ---------- |
trajectorydatawithease.
thatallowsuserstoexpresstheirinterestedtrajectorybysim-
Definition 2.1. A trajectory of a specific object is an or- plydrawingonamapofageographicalregionusingamouse
deredsequenceofpoints,denotedbyT =<p ,p ,...,p >, or other input means (touch, stylus etc.), 2) a Calibration
|            |                                        |     |     |     |     | 1 2 | n   |     |     |     |     |     |     |     |
| ---------- | -------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| whereeachp | isacoordinatecorrespondingtothesameob- |     |     |     |     |     |     |     |     |     |     |     |     |     |
i Unit that calibrates the input trajectories being expressed by
ject. Further, these coordinates are ordered based on their theuserbasedontheunderlyingroadnetworkdataand3)a
timestamp, such that T(p ) < T(p ), where T(p ) repre- Query Processing Unit that is responsible for exploring the
|     |     |     | i   | i+1 |     |     | i   |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sentsthetimestampassociatedwithp . underlyingtrajectorydatacorrespondingtotheuserinput.
i
| Definition2.2. |           | Giventwotrajectories,T |                           |             | =<l | ,l ,...,l | >     |                             |     |     |     |     |     |     |
| -------------- | --------- | ---------------------- | ------------------------- | ----------- | --- | --------- | ----- | --------------------------- | --- | --- | --- | --- | --- | --- |
|                |           |                        |                           |             | l   | 1 2       | n     |                             |     |     |     |     |     |     |
|                |           |                        |                           |             |     |           |       | 3.1. GraphicalUserInterface |     |     |     |     |     |     |
| andT r =<      | r 1 ,r    | 2 ,...,r m             | >, ifthereexisttwopointsr |             |     |           | i and |                             |     |     |     |     |     |     |
| r in T         | such that | i <                    | j and                     | both dist(r | ,l  | ), dist(r | ,l )  |                             |     |     |     |     |     |     |
j r i 1 j n TheGraphicalUserInterface(GUI)ofTraVrunsontheclient
| are smaller | than    | a threshold | δ.     | Then,       | all consecutive |                | points |          |        |          |            |         |             |      |
| ----------- | ------- | ----------- | ------ | ----------- | --------------- | -------------- | ------ | -------- | ------ | -------- | ---------- | ------- | ----------- | ---- |
|             |         |             |        |             |                 |                |        | side and | allows | the user | to express | his/her | trajectory. | Fur- |
| between     | r i and | r j in T    | r form | a candidate |                 | sub-trajectory |        |          |        |          |            |         |             |      |
thermore,itisconnectedtoboththeCalibrationUnitandthe
thatneedstobeexploredcorrespondingtoT.
|     |     |     |     |     |     | l   |     | QueryProcessingUnitwhicharebothrunningontheserver |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- |
inaremotelocation.
| Note, | that there | might | be  | multiple | sub-trajectories |     | that |     |     |     |     |     |     |     |
| ----- | ---------- | ----- | --- | -------- | ---------------- | --- | ---- | --- | --- | --- | --- | --- | --- | --- |
couldbeconstructedfromT thatsatisfytheaboveconditions Initially,theuserispresentedwithanoverviewofthemap
r
|     |     |     |     |     |     |     |     | of a geographical |     | region. | Note, | the user | can freely | interact |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | ------- | ----- | -------- | ---------- | -------- |
andallsuchtrajectoriesneedtobeexploredbythesystemto
|     |     |     |     |     |     |     |     | with the | map | (e.g move | to a different |     | geographical | region, |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --------- | -------------- | --- | ------------ | ------- |
ensurehighaccuracy.
|     |     |     |     |     |     |     |     | zoom | in, zoom | out etc). | As soon | as  | the user | starts draw- |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | -------- | --------- | ------- | --- | -------- | ------------ |
Definition2.3. Giventwotrajectories,T ,T ,T isanear-by ing,theGUIstartssamplingtheusermouse/touchinputsand
|     |     |     |     |     | l r | r   |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
trajectoryofT ifthereisatleastonecandidatesub-trajectory, sends them to the Calibration Unit running in the server, as
l
T r(cid:1) , of T r such that sim(T r(cid:1) ,T l ) is smaller than a predefined twodimensionalcoordinates(Latitude,Longitude). Overall,
threshold. Finally, sim(x,y) can be computed using any theGUIdoesnotwaitfortheentireinputtrajectorytocom-
similarity metric such as Fre´chet distance [8], dynamic time plete and progressively sends the input actions to the server
warping[9]etc. forprocessingtoensureveryfastresponsetotheuserquery.
310
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:16:01 UTC from IEEE Xplore.  Restrictions apply.

Astheuserisexpressinghis/hertrajectory,thecalibrated calibration algorithm as a continuous streaming application
results will be presented back to the user. Furthermore, the onApacheFlink[2],consistingofthefollowingoperators:1)
usercangointoan“Edit”modetoapproveorignorethecal- a Spout that continuously receives input coordinates from
ibrated results. This is especially useful when trying to find the GUI, 2) a Localization operator that identifies the
missing roads or road segments in the underlying road net- candidate GPS coordinates in the road network correspond-
work. Once the user determines the appropriate calibration ing to each input coordinate (using an R-Tree Index and a
points, the calibrated trajectory is transmitted to the server. predefinedthreshold),3)aPreCalibrationoperatorthat
Theserverthenreturnsthenearbytrajectoriesassociatedwith computestheemissionprobabilitiesorthelikelihoodofeach
thecalibratedinputtrajectory,whichispresentedtotheuser. candidatepointidentifiedbytheLocalizationoperatorbased
|     |     |     |     |     |     | on their geographical |     | distance |     | from the | point | plotted | by the |
| --- | --- | --- | --- | --- | --- | --------------------- | --- | -------- | --- | -------- | ----- | ------- | ------ |
3.2. CalibrationUnit user, 4) a PostCalibration operator that computes the
transitionprobabilitesorthelikelihoodoftheusermovingto
TraVallowsuserstosimplydrawonaGUItoexpresstheirin- eachoneofthecandidatepointsfromthepreviouspointand
| terestedtrajectory. |     | However,handdrawingishardlyaccurate |     |     |     |           |            |     |       |      |             |             |     |
| ------------------- | --- | ----------------------------------- | --- | --- | --- | --------- | ---------- | --- | ----- | ---- | ----------- | ----------- | --- |
|                     |     |                                     |     |     |     | 5) a Sink | that sends | the | point | with | the highest | probability |     |
andcalibrationoftheuserinputisessentialtofixanymistakes
|     |     |     |     |     |     | back to the | visual | interface | so  | that it | can be | presented | back |
| --- | --- | --- | --- | --- | --- | ----------- | ------ | --------- | --- | ------- | ------ | --------- | ---- |
inuserinputandtoprovideagooduserexperience. Tothis totheuser. AlloperatorsexceptthePostCalibrationoperator
| end, the | Calibration | Unit | maps | each input coordinate | from |     |     |     |     |     |     |     |     |
| -------- | ----------- | ---- | ---- | --------------------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
canbeparallelisedinourimplementation.
theusertoacorrespondingGPScoordinateintheunderlying
roadnetworkdataobtainedfromtheLandTransportAuthor-
3.3. QueryProcessingUnit
| ity, Singapore[1]. |             | Note, | themajorchallengeinthiscalibra- |                   |          |     |     |     |     |     |     |     |     |
| ------------------ | ----------- | ----- | ------------------------------- | ----------------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| tion stage         | is choosing | a     | route that                      | is geographically | close to |     |     |     |     |     |     |     |     |
TheQueryProcessingUnitinTraVisresponsibleforidenti-
| thecoordinatesexpressedbytheuser, |     |     |     | whilealsotakinginto |     |     |     |     |     |     |     |     |     |
| --------------------------------- | --- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
fyingthenearbytrajectoriesofthecalibratedinputtrajectory
| consideration | the | likelihood | of choosing | a given | route. This |     |     |     |     |     |     |     |     |
| ------------- | --- | ---------- | ----------- | ------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
providedbytheuser(ornoncalibratedifallcalibrationpoints
| is especially | important |     | in regions | like Singapore | which has |             |        |        |          |     |         |     |           |
| ------------- | --------- | --- | ---------- | -------------- | --------- | ----------- | ------ | ------ | -------- | --- | ------- | --- | --------- |
|               |           |     |            |                |           | are ignored | by the | user). | However, | the | process | of  | identify- |
extremely dense road networks. To achieve this, we adopt ingnearbytrajectoriesfrombillionsofunderlyingtrajectory
aHidden-Markov-Model(HMM)basedmapmatchingalgo-
pointsiscomputationallyintensiveandcouldhenceleadtoa
rithmpresentedinpreviousstudies[10,7]thattakeintocon-
pooruserexperienceinaninteractivesystemlikeTraV.
siderationboththelikelihoodoftakingaspecificroute(based
|                 |              |            |         |                   |              | To minimize   |             | the amount | of     | computation |       | and for    | quick  |
| --------------- | ------------ | ---------- | ------- | ----------------- | ------------ | ------------- | ----------- | ---------- | ------ | ----------- | ----- | ---------- | ------ |
| on the previous |              | trajectory | points  | already expressed | by user)     |               |             |            |        |             |       |            |        |
|                 |              |            |         |                   |              | processing    | of large    | amounts    | of     | trajectory  | data, | TraV       | adopts |
| and the         | geographical | distance   | between | a point           | expressed by |               |             |            |        |             |       |            |        |
|                 |              |            |         |                   |              | the following | techniques. |            | First, | to minimize |       | the number | of     |
theuserandarouteintheunderlyingroadnetwork. candidate sub-trajectories that are explored, we build an R-
| AlgorithmOverview. |     |     | Overall,ourcalibrationalgorithm |     |     |            |        |        |            |            |     |      |          |
| ------------------ | --- | --- | ------------------------------- | --- | --- | ---------- | ------ | ------ | ---------- | ---------- | --- | ---- | -------- |
|                    |     |     |                                 |     |     | Tree index | on the | entire | underlying | trajectory |     | data | set. The |
isimplementedasfollows.
|     |     |     |     |     |     | Query Processing |     | Unit module |     | then | only selects | those | sub- |
| --- | --- | --- | --- | --- | --- | ---------------- | --- | ----------- | --- | ---- | ------------ | ----- | ---- |
trajectoriesthatbeginandendwithinaspecifiedthresholdof
Asmentionedbefore,theinputcoordinatesarecontin-
•
uously streamed into the Calibration Unit by the GUI the start and end points of the calibrated trajectory for ex-
|     |                |     |                    |        |           | ploration. | Second,weleverageApacheFlinkanditsparallel |     |     |     |     |     |     |
| --- | -------------- | --- | ------------------ | ------ | --------- | ---------- | ------------------------------------------ | --- | --- | --- | --- | --- | --- |
| as  | the trajectory |     | is being expressed | by the | user. The |            |                                            |     |     |     |     |     |     |
processingenginetomakeefficientuseofmodernmassively
| Calibration |     | Unit | first performs | down-sampling | on this |     |     |     |     |     |     |     |     |
| ----------- | --- | ---- | -------------- | ------------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
inputdata. Thisisbecausedirectlytreatingthepoints parallel multi-/many- core hardware to quickly compute the
|     |     |     |     |     |     | distance between |     | each candidate |     | sub-trajectory |     | and | the cali- |
| --- | --- | --- | --- | --- | --- | ---------------- | --- | -------------- | --- | -------------- | --- | --- | --------- |
sampledbytheGUIisbothcomputationallyintensive
bratedinputtrajectory.
andunnecessary,especiallyiftheunderlyingtrajectory
datahasasignificantlylowerresolution. AlgorithmOverview.OverallourQueryProcessingUnit
worksasfollows.
Next,theCalibrationUnitidentifiespotentialGPSco-
•
ordinatesintheunderlyingroadnetwork,foreachinput
|             |     |          |            |                   |      | First, | the Query |     | Processing | Unit | receives | the | (cali- |
| ----------- | --- | -------- | ---------- | ----------------- | ---- | ------ | --------- | --- | ---------- | ---- | -------- | --- | ------ |
| coordinate. |     | Naively, | all points | in the underlying | road |        |           |     |            |      |          |     |        |
•
network data are candidates for this computation. To brated)inputtrajectoryfromthevisualinterface.
|                                                |     |     |     |     |     | It           | then quickly |       | retrieves  | a set | of        | candidate | sub- |
| ---------------------------------------------- | --- | --- | --- | --- | --- | ------------ | ------------ | ----- | ---------- | ----- | --------- | --------- | ---- |
| minimizethecomputation,ourCalibrationUnitmakes |     |     |     |     |     | •            |              |       |            |       |           |           |      |
|                                                |     |     |     |     |     | trajectories |              | which | are within | a     | threshold | distance  | of   |
useofasimpleR-Treebasedindexingtofirstidentifya
setofroadnetworkpointswhicharewithinδmetersof the start and end points of the calibrated input trajec-
|     |     |     |     |     |     | tory. | The candidate |     | sub-trajectories |     | are | then | grouped |
| --- | --- | --- | --- | --- | --- | ----- | ------------- | --- | ---------------- | --- | --- | ---- | ------- |
eachinputcoordinate.Note,δisatune-ableparameter,
togetherbytheirparenttrajectoryIDtoleverageover-
whichcanbevariedbyusers.
Finally, the Calibration Unit applies the Viterbi algo- lappingofGPScoordinatedataacrosssub-trajectories.
| •                                             |     |     |     |     |     | The | distance | between | each | group | of  | sub-trajectories |     |
| --------------------------------------------- | --- | --- | --- | --- | --- | --- | -------- | ------- | ---- | ----- | --- | ---------------- | --- |
| rithm[6]tocomputethemostlikelysequenceofcali- |     |     |     |     |     | •   |          |         |      |       |     |                  |     |
andthecalibratedinputtrajectoryisthencomputedby
bratedGPScoordinatesasthecalibratedtrajectory.
|     |     |     |     |     |     | a predefined |     | number | of threads |     | in parallel. | To  | further |
| --- | --- | --- | --- | --- | --- | ------------ | --- | ------ | ---------- | --- | ------------ | --- | ------- |
Algorithm Implementation. We implement the above minimize the cost of computing the distance of each
311
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:16:01 UTC from IEEE Xplore.  Restrictions apply.

Fig.2: AutoCalibrationinTraV. Fig.3:ResultoftrajectoryexplorationinTraV(exploredtra-
jectoriesshowninred).
| group | of sub-trajectories |     | with | the | input | trajectory, we |     |     |     |     |     |     |     |
| ----- | ------------------- | --- | ---- | --- | ----- | -------------- | --- | --- | --- | --- | --- | --- | --- |
leverage the overlap in GPS coordinates across differ- satisfy most user queries and ensure an interactive user ex-
entsub-trajectoriesofthesameparenttrajectory. perience. Further, we use road network data collected from
Finally, the trajectories which have at least one sub- LandTransportAuthority, Singapore[1]consistingof250K
•
| trajectorywithinathresholddistanceofthecalibrated |     |     |     |     |     |     | GPScoordinates. |     |     |     |     |     |     |
| ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- | --- |
inputtrajectoryisidentifiedasnearbytrajectories.
Note,inthisstudyweusetheFre´chetmetric[4]formea- 4.2. DemonstrationObjectives
suringthedistancebetweenasub-trajectoryandthecalibrated Theobjectivesofourdemonstrationare: 1)demonstratethe
| input trajectory. | Our | implementation |     | can | be easily | modified |     |     |     |     |     |     |     |
| ----------------- | --- | -------------- | --- | --- | --------- | -------- | --- | --- | --- | --- | --- | --- | --- |
effectivenessofourautomaticcalibrationinassistingtheuser
touseanyothermetrics[5].
|     |     |     |     |     |     |     | in expressing | the trajectories. |     | 2)  | demonstrate | the | ability of |
| --- | --- | --- | --- | --- | --- | --- | ------------- | ----------------- | --- | --- | ----------- | --- | ---------- |
AlgorithmImplementation. Theabovealgorithmisim- oursystemtoquicklyexplorelargetrajectorydatasetsatthe
| plemented | as a streaming |     | application |     | using Apache | Flink |     |     |     |     |     |     |     |
| --------- | -------------- | --- | ----------- | --- | ------------ | ----- | --- | --- | --- | --- | --- | --- | --- |
scaleofbillionsoftrajectories.
| and consists | of the | following | operators: |     | 1) a | Spout that |                   |     |          |     |             |        |        |
| ------------ | ------ | --------- | ---------- | --- | ---- | ---------- | ----------------- | --- | -------- | --- | ----------- | ------ | ------ |
|              |        |           |            |     |      |            | The demonstration |     | workflow | is  | as follows. | First, | we al- |
receives the calibrated input trajectory from the GUI, 2) low the user to draw trajectories using our GUI module and
| a CandidateGenerator |            |     | which          | generates   |          | the candidate  |                                         |                 |                |     |                 |             |             |
| -------------------- | ---------- | --- | -------------- | ----------- | -------- | -------------- | --------------------------------------- | --------------- | -------------- | --- | --------------- | ----------- | ----------- |
|                      |            |     |                |             |          |                | the GUI                                 | will present    | the calibrated |     | results         | while       | the trajec- |
| sub-trajectories     | which      | are | within         | a threshold | distance | of the         |                                         |                 |                |     |                 |             |             |
|                      |            |     |                |             |          |                | toryisbeingpopulatedbytheuser(Figure2). |                 |                |     |                 | Second,once |             |
| start and            | end points | of  | the calibrated |             | input    | trajectory, 3) |                                         |                 |                |     |                 |             |             |
|                      |            |     |                |             |          |                | the user makes                          | a determination |                | of  | the appropriate |             | trajectory  |
| a DistanceCalculator |            |     | that           | computes    | the      | distance be-   |                                         |                 |                |     |                 |             |             |
dataforexploration(i.eeithertheoriginalinputtrajectoryor
| tween each | group | of sub-trajectories |     | and | the | calibrated in- |     |     |     |     |     |     |     |
| ---------- | ----- | ------------------- | --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
thecalibratedtrajectory),TraVstartsprocessingandpresents
puttrajectoryand4)Sinkthatsendsthetrajectorieswithin
|     |     |     |     |     |     |     | the nearby | trajectories | back | to the | user along | with | the time |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------------ | ---- | ------ | ---------- | ---- | -------- |
a threshold distance of the calibrated input trajectory to the takenforthecomputation,helpingtheusertounderstandthe
| GUI to be | presented | to  | the user. | All | operators | except the |     |     |     |     |     |     |     |
| --------- | --------- | --- | --------- | --- | --------- | ---------- | --- | --- | --- | --- | --- | --- | --- |
capabilitiesofourmachine(Figure3).
CandidateGeneratorinourimplementationcanbeexe-
| cutedusingmultiplethreads. |     |     | TheDistanceCalculator |     |     |     |     |     |     |     |     |     |     |
| -------------------------- | --- | --- | --------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
operator is the most computationally intensive one, and is 5. CONCLUSIONSANDFUTUREWORK
henceallocatedrelativelymorecomputingresources.
Wedemonstrateaninteractiveexplorationsystemforbillions
|     |     |     |     |     |     |     | oftrajectories. | Theindexingandstreaming-basedimplemen- |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --------------- | -------------------------------------- | --- | --- | --- | --- | --- |
4. DEMONSTRATION
|     |     |     |     |     |     |     | tation can | reduce | the response | time | significantly |     | even with |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------ | ------------ | ---- | ------------- | --- | --------- |
4.1. DemoSetup suchalargescaleoftrajectories. Weplantofurtherenhance
theresponsetimewithbetterstreamingsystemtechnologies
Ourdemonstrationsetupconsistsofaclientandaserver.The
(suchasutilizingscale-upserverarchitectures[13]).
| client device | (Mobile | or  | Laptop | PC) runs | the | GUI module |     |     |     |     |     |     |     |
| ------------- | ------- | --- | ------ | -------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
depictedinFigure1andtheserver(aworkstationlocatedin
our Lab at NUS, Singapore) runs the calibration and query 6. ACKNOWLEDGEMENT
| processingmodule. |     | Theusercanthendrawthetrajectoryon |     |     |     |     |     |     |     |     |     |     |     |
| ----------------- | --- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
theGUImoduleasdescribedinSection3. ThisworkwasfundedbytheGrab-NUSAILab,ajointcol-
Our demonstration uses trajectory data collected from laborationbetweenGrabTaxiHoldingsPte.Ltd.andNational
Grab drivers in Singapore. The underlying trajectory data University of Singapore. We would like to thank Prof. See
setconsistsofbillionsofGPScoordinatesandourmassively KiongNg,XiangHuiNicholasLimandYongLiangGohfor
| parallel trajectory |     | exploration | application |     | is able | to quickly | theirsupport. |     |     |     |     |     |     |
| ------------------- | --- | ----------- | ----------- | --- | ------- | ---------- | ------------- | --- | --- | --- | --- | --- | --- |
312
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:16:01 UTC from IEEE Xplore.  Restrictions apply.

|          |           | 7.  | REFERENCES |     |              |     |
| -------- | --------- | --- | ---------- | --- | ------------ | --- |
| [1] Land | transport |     | authority. |     | https://www. |     |
mytransport.sg/content/mytransport/
home/dataMall.html.
| [2] Apache | flink. | https://flink.apache.org/, |     |     |     |     |
| ---------- | ------ | -------------------------- | --- | --- | --- | --- |
2018.
| [3] Grab | transport, | food | delivery | &   | payment solutions. |     |
| -------- | ---------- | ---- | -------- | --- | ------------------ | --- |
https://www.grab.com/,2019.
| [4] H.                     | Alt and | M. Godau. | Computing |                        | the fre´chet distance |     |
| -------------------------- | ------- | --------- | --------- | ---------------------- | --------------------- | --- |
| betweentwopolygonalcurves. |         |           |           | InternationalJournalof |                       |     |
ComputationalGeometry&Applications,5(01n02):75–
91,1995.
| [5] L.                                       | Chen, M. | T. O¨zsu, | and | V. Oria. | Robust and | fast   |
| -------------------------------------------- | -------- | --------- | --- | -------- | ---------- | ------ |
| similaritysearchformovingobjecttrajectories. |          |           |     |          |            | InPro- |
ceedingsofthe2005ACMSIGMODInternationalCon-
| ference | on  | Management | of  | Data, SIGMOD | ’05, | pages |
| ------- | --- | ---------- | --- | ------------ | ---- | ----- |
491–502,NewYork,NY,USA,2005.ACM.
| [6] G.D.Forney. |     | Theviterbialgorithm. |     |     | Proceedingsofthe |     |
| --------------- | --- | -------------------- | --- | --- | ---------------- | --- |
IEEE,61(3):268–278,1973.
[7] C.Y.Goh,J.Dauwels,N.Mitrovic,M.T.Asif,A.Oran,
| and | P. Jaillet. | Online | map-matching |     | based | on hid- |
| --- | ----------- | ------ | ------------ | --- | ----- | ------- |
denmarkovmodelforreal-timetrafficsensingapplica-
| tions. | In 2012 | 15th | International | IEEE | Conference | on  |
| ------ | ------- | ---- | ------------- | ---- | ---------- | --- |
IntelligentTransportationSystems,pages776–781,Sep.
2012.
| [8] S.Har-PeledandB.Raichel. |           |     |                                  | Thefre´chetdistancerevis- |           |       |
| ---------------------------- | --------- | --- | -------------------------------- | ------------------------- | --------- | ----- |
| itedandextended.             |           |     | InProceedingsofthetwenty-seventh |                           |           |       |
| annual                       | symposium |     | on Computational                 |                           | geometry, | pages |
448–457.ACM,2011.
| [9] M. | Mu¨ller. | Dynamic | time | warping. | Information | re- |
| ------ | -------- | ------- | ---- | -------- | ----------- | --- |
trievalformusicandmotion,pages69–84,2007.
| [10] P.NewsonandJ.Krumm. |         |       | Hiddenmarkovmapmatch- |     |                |     |
| ------------------------ | ------- | ----- | --------------------- | --- | -------------- | --- |
| ing                      | through | noise | and sparseness.       |     | In Proceedings | of  |
the17thACMSIGSPATIALInternationalConferenceon
AdvancesinGeographicInformationSystems,GIS’09,
pages336–343,NewYork,NY,USA,2009.ACM.
[11] S.Shang,L.Chen,Z.Wei,C.S.Jensen,K.Zheng,and
| P.Kalnis. |     | Trajectorysimilarityjoininspatialnetworks. |     |     |     |     |
| --------- | --- | ------------------------------------------ | --- | --- | --- | --- |
Proc.VLDBEndow.,10(11):1178–1189,Aug.2017.
| [12] D.Xie, | F.Li, | andJ.M.Phillips. |            | Distributedtrajectory |              |     |
| ----------- | ----- | ---------------- | ---------- | --------------------- | ------------ | --- |
| similarity  |       | search.          | Proc. VLDB | Endow.,               | 10(11):1478– |     |
1489,Aug.2017.
| [13] S. Zhang, |     | J. He, A. | C. Zhou, | and B. | He. Briskstream: |     |
| -------------- | --- | --------- | -------- | ------ | ---------------- | --- |
Scalingdatastreamprocessingonshared-memorymul-
ticorearchitectures.InProceedingsofthe2019Interna-
| tional | Conference |     | on Management |     | of Data, SIGMOD |     |
| ------ | ---------- | --- | ------------- | --- | --------------- | --- |
’19,pages705–722,NewYork,NY,USA,2019.ACM.
313
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:16:01 UTC from IEEE Xplore.  Restrictions apply.