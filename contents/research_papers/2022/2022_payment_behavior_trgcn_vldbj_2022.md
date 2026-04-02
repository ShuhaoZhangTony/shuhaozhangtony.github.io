TheVLDBJournal(2022)31:1035–1058
https://doi.org/10.1007/s00778-021-00722-0
SPECIAL ISSUE PAPER
Payment behavior prediction on shared parking lots with TR-GCN
Qingyu Xu1·Feng Zhang1 ·Mingde Zhang1·Jidong Zhai2·Bingsheng He3,4·Cheng Yang5·Shuhao Zhang6·
Jiazao Lin7,8·Haidi Liu9·Xiaoyong Du1
Received:21February2021/Revised:26September2021/Accepted:3December2021/Publishedonline:9January2022
©TheAuthor(s),underexclusivelicencetoSpringer-VerlagGmbHGermany,partofSpringerNature2022
Abstract
Sharedparkinglotsarenewtypesofsharingeconomyandgeneratealargesocialimpactinourdailylives.Post-usepayment
isahallmarkmethodinthesharedparkinglots:itreflectstrustinusersandbringsconvenience toeveryone. Accordingly,
paymentbehaviorpredictionviadatasciencetechnologybecomesextremelyimportant.Wecooperatewitharealintelligent
parkingplatform,ThsParking,whichisoneofthetopsmartparkingplatformsinChina,tostudypaymentprediction,and
encounterthreechallenges.First,weneedtoprocessalargevolumeofdatageneratedeveryday.Second,avarietyofparking
relateddatashallbeutilizedtobuildthepredictionmodel.Third,weneedtoconsiderthetemporalcharacteristicsofinput
data.Inresponse,weproposeTR-GCN,atemporalrelationalgraphconvolutionalnetworkforpaymentbehaviorpredictionon
sharedparkinglots,andwebuildaremindertoremindunpaidusers.TR-GCNaddressestheaforementionedchallengeswith
threemodules.1)Wedevelopanefficientdatapreprocessingmoduletoextractkeyinformationfrombigdata.2)Webuild
aGCN-basedmodulewithuserassociationgraphsfromthreedifferentperspectivestodescribethediversehiddenrelations
among data, including relations between user profile, temporal relations between parking patterns, and spatial relations
between different parking lots. 3) We build an LSTM-based module to capture the temporal information from historical
events.Experimentsbasedon50realparkinglotsshowthatourTR-GCNachieves91.2%accuracy,whichisabout7%higher
thanthestate-of-the-artandthereminderservicemakesmorethanhalfofthelate-paymentuserspay,saving1.9%lossfor
sharedparkinglots.
B
FengZhang
fengzhang@ruc.edu.cn
1 KeyLaboratoryofDataEngineeringandKnowledge
QingyuXu
Engineering(MOE),andSchoolofInformation,Renmin
qingyuxu@ruc.edu.cn
UniversityofChina,Beijing,China
MingdeZhang 2 DepartmentofComputerScienceandTechnology,Tsinghua
2019202191@ruc.edu.cn
University,Beijing,China
JidongZhai 3 SchoolofComputing,NationalUniversityofSingapore,
zhaijidong@tsinghua.edu.cn
Singapore,Singapore
BingshengHe 4 NUSCenterforTrustInternetandCommunity,Singapore,
hebs@comp.nus.edu.sg
Singapore
ChengYang 5 SchoolofComputerScience,BeijingUniversityofPostsand
albertyang33@gmail.com
Telecommunications,Beijing,China
ShuhaoZhang 6 InformationSystemsTechnologyandDesignpillar,Singapore
shuhaozhang@sutd.edu.sg
UniversityofTechnologyandDesign,Singapore,Singapore
JiazaoLin 7 DepartmentofInformationManagement,PekingUniversity,
linzj@pku.edu.cn
Beijing,China
HaidiLiu 8 InstituteofAutomation,ChineseAcademyofSciences,
liuhd@huaching.com
Beijing,China
XiaoyongDu 9 ZhongzhiHuaching(Beijing)TechnologyCo.,Beijing,China
duyong@ruc.edu.cn
123

| 1036 |     |     |     |     |     |     |     |     |     |     |     |     |     | Q.Xuetal. |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
1 Introduction
| Sharing        | economy | is booming |         | in most | countries,    |     | and many |     |     |     |     |     |     |     |
| -------------- | ------- | ---------- | ------- | ------- | ------------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
| manifestations |         | of sharing | economy |         | have emerged, |     | such as  |     |     |     |     |     |     |     |
e-scooters[60],ZipCar[64],andsharedbicycles[70].Intel-
ligentsharedparkinglots,asanewrepresentativeofsharing
economy,arebecomingpopularandgeneratemoreandmore
socialimpactinrecentdays.Post-usepayment,whichmeans
thatuserspayafteruse,isahallmarkmethodintheshared
parkinglots:itreflectstrustinusersandbringsconvenience
| to everyone. | However, |         | users         | may forget | to       | pay on | time. In |     |     |     |     |     |     |     |
| ------------ | -------- | ------- | ------------- | ---------- | -------- | ------ | -------- | --- | --- | --- | --- | --- | --- | --- |
| a shared     | parking  | system, | correctly     | predicting |          | the    | payment  |     |     |     |     |     |     |     |
| behavior     | of each  | user,   | i.e., payment |            | duration | after  | parking, |     |     |     |     |     |     |     |
isimportantforthreereasons.First,weneedtounderstand
thedifferenceinthepaymentbehaviorofpeopleindifferent
| regions | and remind | users | who | forget | to pay, | which | relates |     |     |     |     |     |     |     |
| ------- | ---------- | ----- | --- | ------ | ------- | ----- | ------- | --- | --- | --- | --- | --- | --- | --- |
to the income of the parking lot [1]. Note that we should Fig.1 Dataprocessingpipelineinsharedparkinglots
| not remind  | all     | users, | as it could | degrade       | users’ | experience. |          |     |     |     |     |     |     |     |
| ----------- | ------- | ------ | ----------- | ------------- | ------ | ----------- | -------- | --- | --- | --- | --- | --- | --- | --- |
| Second,     | we need | to     | identify    | the potential |        | high-risk   | users    |     |     |     |     |     |     |     |
| and require | them    | to pay | a deposit   | before        | the    | next        | parking. |     |     |     |     |     |     |     |
inglots,detailedinSect.5.3.3)Tosolvethetimingchallenge,
Third,basedonpaymentbehaviorprediction,wecanprovide
|     |     |     |     |     |     |     |     | we build | an LSTM-based |     | module | to  | capture | the temporal |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------------- | --- | ------ | --- | ------- | ------------ |
reminderserviceandincentivemechanismtohelpusersbuild
|     |     |     |     |     |     |     |     | information | from | users’ | historical | transactions, |     | detailed in |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ---- | ------ | ---------- | ------------- | --- | ----------- |
goodpaymenthabits[55].
Sect.5.4.ConsideringtheefficiencyofLSTM,wesavethe
| In collaboration |     | with | an  | intelligent | parking |     | platform, |     |     |     |     |     |     |     |
| ---------------- | --- | ---- | --- | ----------- | ------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- |
datalocallytoincreasetheprocessingspeed.
| ThsParking1       | (developed |             | by  | Huaching   | Tech2),      | we  | explore |         |            |     |        |      |                |       |
| ----------------- | ---------- | ----------- | --- | ---------- | ------------ | --- | ------- | ------- | ---------- | --- | ------ | ---- | -------------- | ----- |
|                   |            |             |     |            |              |     |         | We have | integrated |     | TR-GCN | into | the ThsParking | plat- |
| the opportunities |            | of applying |     | artificial | intelligence |     | to pay- |         |            |     |        |      |                |       |
form,asshowninFig.1.Theoverallworkflowcontainsthree
mentpredictionforsharedparkinglots.Buildinganaccurate
steps.First,userinformationandparkingspaceinformation
| payment         | behavior | prediction   |     | model             | for large-scale |        | shared    |               |        |                |            |            |            |          |
| --------------- | -------- | ------------ | --- | ----------------- | --------------- | ------ | --------- | ------------- | ------ | -------------- | ---------- | ---------- | ---------- | -------- |
|                 |          |              |     |                   |                 |        |           | are sent      | to the | cloud. Second, |            | the system | executes   | the data |
| parking         | lots is  | non-trivial, | and | we encounter      |                 | the    | following |               |        |                |            |            |            |          |
|                 |          |              |     |                   |                 |        |           | preprocessing |        | module         | to perform | data       | collection | and data |
| three technical |          | challenges.  |     | First, ThsParking |                 | covers | more      |               |        |                |            |            |            |          |
cleaning,followedbyadatadecisiontodeterminewhether
than20citieswithmorethan1,700parkinglots,providing
thisisavalidorderforfurtherdataprocessing.Third,thesys-
| more than    | 60     | thousand | parking | spaces.   | We    | need | to pro- |             |              |     |     |        |                   |     |
| ------------ | ------ | -------- | ------- | --------- | ----- | ---- | ------- | ----------- | ------------ | --- | --- | ------ | ----------------- | --- |
|              |        |          |         |           |       |      |         | temexecutes | theGCN-based |     |     | module | and theLSTM-based |     |
| cess a large | volume | of       | data    | generated | every | day. | Second, |             |              |     |     |        |                   |     |
module,toanalyzeuserpaymentbehaviors.Finally,theout-
| a large | variety | of parking | related | data | (e.g., | user | profiles |     |     |     |     |     |     |     |
| ------- | ------- | ---------- | ------- | ---- | ------ | ---- | -------- | --- | --- | --- | --- | --- | --- | --- |
putofthepaymentorderissenttotheusers.
| and spatial, | temporal |     | parking | patterns) | need | to be | utilized |     |     |     |     |     |     |     |
| ------------ | -------- | --- | ------- | --------- | ---- | ----- | -------- | --- | --- | --- | --- | --- | --- | --- |
WeevaluateTR-GCNonfiftyparkinglotsfromninecities
tobuildanaccuratepredictionmodel.Third,weneedtocap-
withvarioussurroundings.Wecollect131thousandpayment
turethetimingcharacteristicsofinputdataasparkingorders
recordsforevaluation,andeachrecordincludesthepayment
| are chronologically |     | generated. |     | Characteristics |     | such | as the |     |     |     |     |     |     |     |
| ------------------- | --- | ---------- | --- | --------------- | --- | ---- | ------ | --- | --- | --- | --- | --- | --- | --- |
amount,thetimeintervalfromthepreviousorder(0ifthere
suddenspikesduringpeakhoursmustbeconsideredinthe
|     |     |     |     |     |     |     |     | is only one | order), | parking | lot | ID, coupon | usage, | and date. |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ------- | ------- | --- | ---------- | ------ | --------- |
predictionmodel.
Wehaveclassifiedthepredictionresultsintotwocategories,
Inthispaper,weproposeTR-GCN,atemporalrelational
|     |     |     |     |     |     |     |     | which are | on-time | payment | and | delayed | payment. | Experi- |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------- | ------- | --- | ------- | -------- | ------- |
graphconvolutionalnetwork.TR-GCNcontainsthreemod-
mentsshowthatTR-GCNachieves91.2%accuracy,which
| ules. 1) | To solve | the | volume | challenge, |     | we develop | an  |     |     |     |     |     |     |     |
| -------- | -------- | --- | ------ | ---------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
isabout7%higherthanthestate-of-the-artpaymentpredic-
| efficient | data | preprocessing |     | module | to extract | key | infor- |     |     |     |     |     |     |     |
| --------- | ---- | ------------- | --- | ------ | ---------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
tionmethod[74].Moreover,ourreminderservicecouldsave
| mation | from big | data, | detailed | in  | Sect. 5.2. | 2)  | To solve |     |     |     |     |     |     |     |
| ------ | -------- | ----- | -------- | --- | ---------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
1.9%lossforsharedparkinglotsandhelpusersbuildgood
| the variety | challenge, |     | we build | a GCN-based |     | module | with |     |     |     |     |     |     |     |
| ----------- | ---------- | --- | -------- | ----------- | --- | ------ | ---- | --- | --- | --- | --- | --- | --- | --- |
paymenthabits,whichbringsobvioussocialimpact.
| user association |     | graphs | from | three different |     | dimensions | to  |     |     |     |     |     |     |     |
| ---------------- | --- | ------ | ---- | --------------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
Wesummarizeourcontributionsasfollows.
describethediversehiddenrelationsamongdata,including
| relations | between | user | profile, | temporal | relations |     | between |     |     |     |     |     |     |     |
| --------- | ------- | ---- | -------- | -------- | --------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
parkingpatterns,andspatialrelationsbetweendifferentpark-
|     |     |     |     |     |     |     |     | – We | discover | the hidden | relations |     | between | users, and |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | -------- | ---------- | --------- | --- | ------- | ---------- |
1 http://www.thsparking.com developnovelmethodstocapturetheassociationgraphs
| 2 http://www.huaching.com |     |     |     |     |     |     |     | fromvariousaspects. |     |     |     |     |     |     |
| ------------------------- | --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- |
123

| PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… |         |       |            |          |     |     |     |     |     |     | 1037 |
| ------------------------------------------------------- | ------- | ----- | ---------- | -------- | --- | --- | --- | --- | --- | --- | ---- |
| – We develop                                            | TR-GCN, | which | integrates | temporal | and |     |     |     | !   |     |      |
"
| spatial | pattern features | to predict | payment |     | behavior for |     |     |     |     |     |     |
| ------- | ---------------- | ---------- | ------- | --- | ------------ | --- | --- | --- | --- | --- | --- |
#
sharedparkinglots.
| – We evaluate | TR-GCN | with | real payment |     | records and |     |     |     |     |     |     |
| ------------- | ------ | ---- | ------------ | --- | ----------- | --- | --- | --- | --- | --- | --- |
achieve91.2%accuracy,whichisabout7%higherthan
thestate-of-the-artmethod.
Theremainderofthepaperisorganizedasfollows.Sec-
| tion 2 introduces | the background |     | of payment |     | behavior in |     |     |     |     |     |     |
| ----------------- | -------------- | --- | ---------- | --- | ----------- | --- | --- | --- | --- | --- | --- |
Fig.2 Parkingprocessinsharedparkinglots
sharedparkinglots,graphconvolutionalnetwork,andLSTM
inprediction.Section3presentstheobservationandfinding
ofsharedparking,andmotivationofthiswork,followedby
usersbetterexperience:thesharedparkinglotsdonotcon-
thedefinitionoftheproblemandchallenges inSect.4.We tain toll stations or roadblocks to stop users from leaving.
presenttheoverviewofTR-GCNandthedetaileddesignin
|     |     |     |     |     |     | Accordingly, | users | can | pay at any time | and anywhere | after |
| --- | --- | --- | --- | --- | --- | ------------ | ----- | --- | --------------- | ------------ | ----- |
Sect. 5. We show our evaluation in Sect. 6 and the related theyleave.Thisbecomesahallmarkinsharingeconomy.In
workinSect.7.Finally,weshowtheconclusioninSect.8.
addition,thesharedparkinglotsarenationwideandcanhave
alargescale,soitisnotcost-effectivetoinstalltollstations
orroadblocks.
2 Backgroundandpreliminaries In the literature, many studies have been conducted on
|     |     |     |     |     |     |                 |     |            |                  |     | et al. |
| --- | --- | --- | --- | --- | --- | --------------- | --- | ---------- | ---------------- | --- | ------ |
|     |     |     |     |     |     | parking payment |     | prediction | [6,19,30,74,80]. | Xu  | [74]   |
Inthissection,weintroducethebackgroundandpreliminar- applied decision tree for payment prediction, which is the
closestworktoours.However,thework[74]hasthreelimita-
iesofpaymentbehaviorprediction.
tions.1)Volume.Onlyasmalldatasetfromoneparkinglotis
usedintheirevaluation,whichisnotrepresentative.2)Vari-
2.1 Paymentbehaviorinsharedparkinglots
|     |     |     |     |     |     | ety. They     | analyze | only     | parking records, | but ignore  | hidden |
| --- | --- | --- | --- | --- | --- | ------------- | ------- | -------- | ---------------- | ----------- | ------ |
|     |     |     |     |     |     | relationships | from    | multiple | dimensions.      | 3) Temporal | rela-  |
Followingpreviouswork[74],wemodelthepaymentbehav-
|            |                    |       |      |     |             | tionship.Onlyasimpledecisiontreemodelhas |             |     |                         |     | been built,  |
| ---------- | ------------------ | ----- | ---- | --- | ----------- | ---------------------------------------- | ----------- | --- | ----------------------- | --- | ------------ |
| ior as the | process of whether | users | will | pay | for parking |                                          |             |     |                         |     |              |
|            |                    |       |      |     |             | which fails                              | to consider |     | timing characteristics. |     | In response, |
ontime.Differentfrompaymentintraditionalparkinglots,
|     |     |     |     |     |     | our work | addresses | these | three limitations | by  | developing |
| --- | --- | --- | --- | --- | --- | -------- | --------- | ----- | ----------------- | --- | ---------- |
intelligentparkinglotsadoptanunmannedpaymentmethod
|           |                     |        |        |              |     | three modules | in  | TR-GCN: | 1)data | preprocessing, | 2)GCN |
| --------- | ------------------- | ------ | ------ | ------------ | --- | ------------- | --- | ------- | ------ | -------------- | ----- |
| and users | pay after use. This | brings | higher | requirements | to  |               |     |         |        |                |       |
modeling,and3)LSTMmodeling.Weelaboratethedetailed
| users: in order | to improve | the user | experience, |     | we try not |     |     |     |     |     |     |
| --------------- | ---------- | -------- | ----------- | --- | ---------- | --- | --- | --- | --- | --- | --- |
designinSect.5.
| to use too | many reminders | to remind | users | to pay. | Instead, |     |     |     |     |     |     |
| ---------- | -------------- | --------- | ----- | ------- | -------- | --- | --- | --- | --- | --- | --- |
weletuserspaybythemselvesattheiravailabletimewitha
minimalnumberofreminders.Therefore,paymentbehavior 2.2 Graphconvolutionalnetwork
predictiononsharedparkinglotbecomesextremelyimpor-
| tant. |     |     |     |     |     | GCN[32]isaneffectivevariantofconvolutionalneuralnet- |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | ---------------------------------------------------- | --- | --- | --- | --- | --- |
Ourintelligentparkingplatformcanoperateautomatically works[35]thatrunsdirectlyongraphstructureddata.Graph
without being guarded, as shown in Fig. 2. The process of neural network can fuse the features of current users with
parkinginasharedparkingspaceisasfollows.First,users those of their neighbors so the representation of the fea-
use their electronic devices to scan the QR code to obtain tures can be improved. GCN has been applied to various
theparkingspaceinformationviaourAPP.Second,ourAPP predictionscenarios[26,40,53].Yangetal.[76]usedGCN
uploadstheparkingspaceanduserinformationtoourcloud to extract spatial and temporal features to predict parking
servers.Third,afterthecloudserverreceivestheorder,the spacesbasedontrafficinformation.Chuetal.[10]proposed
server sends the unlock signal to the electric lock and the asemi-supervisedclassificationmodelbasedonGCNtopre-
lockshallgodown.Then,userscandrivetheircarintothe dictthewaitinglevelofpublictransportationplatforms.Liu
spacedirectlywithnoadditionaloperationsrequired.After etal.[44]proposedthefirstheterogeneousgraphneuralnet-
parking, the users can just drive away. When the car lock worktodetectmaliciousaccounts.Kimetal.[31]proposed
sensordetectsthatthecarhasbeendrivenaway,itwillraise adeepdenseconvolutionalnetworkthatcanpredictthebor-
thelockandsendtheendtimetotheserverforbilling. rower’s repayment. Tam et al. [65] proposed an algorithm
Whywedonotuseinstantpayment.Wedonotuseinstant based on end-to-end GCN to learn node and edge embed-
paymentmethods,suchasETC[29],inourintelligentshared ding, which can be used to detect abnormal transactions in
parkinglotsbecausethepay-after-usemechanismsprovide electronic payment networks. There are also other variants
123

1038 Q.Xuetal.
(a) (b)
Fig.3 Potentialrelationbetweenuserprofileandpaymentbehavior
ofconvolutionalneuralnetworkssuchasgraphautoencoder patterns, and 3) spatial relations between different parking
(GAE) [58]. Autoencoder (AE) and its variants are widely lots.
usedinunsupervisedlearning.Itissuitableforlearningnode
representationofgraphswithoutsupervisedinformation.As
forourwork,GCNismoresuitableandefficient.Thereason
3.1 Hiddenrelation1:userprofile
isthatGAEaremorepowerfulinunsupervisedtasks,while
GCN has been proved to be efficient in graph embedding
Observation(1):Theuserpaymentbehaviorhasastrong
bymanyworks[26,40,53].Moreover,therearemanyworks
correlationwiththeusers’paymentprofiles.
usingGCNtomodeldynamicgraph-structureddata[47,92].
Insight(1):Profilecontactneedstobeinvolvedinpayment
behaviorprediction.
2.3 Longshort-termmemory Weexploretherelationbetweenusers’historicalrecords
andtheirneworders.Weshowthepaymentcorrelationfrom
LSTM [21] is a recurrent neural network (RNN) and has theuserprofiledimensioninFig.3.
been applied to capture the impact of historical events in Wefirstfindthatcorrelationsexistbetweenusers’histor-
manyfields[42,61,72,75,85,87].LSTMisgoodatprocess- icalpaymentbehaviorandusers’averagepaymenttime.We
ing and predicting events with long intervals and delays randomlyselect100usersanddemonstratethecorrelations
in time series. An LSTM network is composed of LSTM in Fig. 3a. In Fig. 3a, the x axis shows different user IDs,
blocks, which include input gates, forget gates, and output andthe yaxisshowsthepaymenttimeintermsofdays.We
gates.SuchspecialarchitecturesenableLSTMtocapturethe plot the average payment time for each user and show the
complexnonlinearrelationshipsbetweendifferentfeaturesin standardvariance,whichisthetwolinesaroundtheaverage
timeseries.Zhangetal.[80]proposedanovelLSTMmethod paymenttimeline.Wecanseethatthestandardvarianceis
withweatherfactorsandperiodicparkingpatternstopredict correlatedtotheaveragepaymenttime,whichmeansusers
parking behaviors. Zhao et al. [91] used LSTM for short- withhighaveragepaymenttimetendtofluctuateandareless
term traffic forecasts. Han et al. [24] developed a fast and likelytopayintime.
energy-efficientLSTMinspeechrecognition. Weobservethatcouponhistoryhascorrelationsonusers’
willingness to pay in time, as shown in Fig. 3b. Figure 3b
exhibits the relationship between the number of coupons a
user bought (x axis) and the payment time of the order (y
3 Observationandmotivation axis). Coupons can reduce the payment cost and have use
period,andwefindthatpeoplewhoboughtcouponsaremore
We select fifty parking lots in nine cities from a real intel- willingtopayintime.
ligent parking system. In addition to the payment records, Basedonthesefindings,wehavetheinsightthatthemajor-
theplatformalsoprovidesparkingcoupons,whichcouldbe ityofusers’paymentbehaviorsrelatetotheirpastpayment
usedtoanalyzethecorrelationsindataandminethehidden behaviors.Itrevealsthatusers’profilefeatureshaveconnec-
relations between users. In our study, we find three hidden tionswiththeirpaymentbehaviors.Thus,weneedtomake
relationsthatmayaffectthepaymentbehavior:1)relations use of the users’ profile data for future payment behavior
betweenuserprofile,2)temporalrelationsbetweenparking prediction.
123

PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… 1039
(a) (b)
(a) (b)
Fig.5 Influenceofspatialrelationsonpayments
Fig.4 Relationbetweentemporalparkingpatternsandpaymenttime
Therefore, parking period patterns need to be involved to
refinethepaymentbehaviormodelinsharedparkinglots.
3.2 Hiddenrelation2:users’temporalparking
patterns
3.3 Hiddenrelation3:spatialrelationsbetween
Observation(2):Userswithsimilarparkingbehaviorstend parkinglots
tohavesimilarpaymentbehaviors.
Insight(2):Parkingperiodpatternsshouldbeconsidered Observation(3):Userswhohavesimilarhistoricaltrajec-
inpaymentbehaviormodeling. tories are likely to behave similarly when they pay their
orders.
We find that users have potential correlations with each
Insight(3):Capturingusers’hiddenrelationsbyutilizing
other,anduserswithsimilarparkingpatternscanhavesimilar
their parking spatial patterns can be helpful to payment
paymentpatterns.Forexample,theusersmaybecolleagues
behaviormodeling.
whohavethesamecommutingtime.Sincewelackusers’pri-
vatefriendshiprelations,weproposeanotherwaytoexplore Inspiredbypracticalexperiences,weconsiderthatusers
what range of users are more likely to be colleagues or whohavesimilartrajectoriescansharesimilarpaymentpat-
have the same working identities. We show the correla- terns, and they are likely to belong to the same identity.
tion between payment time and temporal parking patterns Moreover,wecanverifythatuserswhooftengotothesame
inFig.4. locations have similar payment behaviors from our park-
Figure4ashowsthestatisticsofuserarrivalanddeparture ing platform. The payment rates in different parking lots
timesofparkinglotP10(detailedinSect.6.1). are different. We show the unpaid rates of different park-
In Fig. 4 (b), we analyze 53,168 parking records from ing lots in Fig. 5a. We can see that parking lots around
October 20, 2017, to October 20, 2018, and compare the residential areas have the lowest unpaid rate while parking
payment similarities between user pairs with similar tem- lots around office buildings have the highest rate. More-
poral parking patterns and random user pairs in different over, we find that users who go to similar parking lots
typesofparkinglots.Thepaymentsimilarityofauserpairis have similar payment times. Figure 5b shows the payment
definedas1/(|AvgPaytime −AvgPaytime |+1),where similarity comparison between user pairs with similar spa-
i j
AvgPaytime denotes the average paytime of user i. For tial relations and random user pairs in different types of
i
userpairswithsimilartemporalparkingpatterns,wegroup parking lots, from October 20, 2017, to October 20, 2018.
theuserswhosearrivaltimegapiswithinonehouranddepar- We define the similarity between two users’ average pay-
turetimegapisalsowithinonehour(detailedinSect.5.3).In time as 1/(|AvgPaytime − AvgPaytime | + 1), where
i j
contrast,forrandomuserpairs,werandomlyselectusersto AvgPaytime denotes the average paytime of user i. We
i
formuserpairs.Figure4bshowsthatthepaymentsimilarity regard users’ trajectories as their movements among dif-
withsimilartemporalparkingpatternsreaches0.81,whichis ferent parking locations. When the number of two users’
muchhigherthantherandomlypickeduserpairswhoseaver- co-occurrence parking lots exceeds our threshold (default
agesimilarityisonly0.75.Furthermore,theminimumpoint 2),anedgeshallbebuiltbetweenthem,whichistosay,they
ofpaymentsimilaritywithsimilartemporalparkingpatterns have similar trajectories. Figure 5b shows that the average
isclosertotheaveragecomparedtotherandomone. payment similarity of user pairs with similar spatial rela-
Accordingly,thesedatacanbeusedinpaymentprediction: tionsreaches0.85,whichishigherthantherandomlypicked
if we identify that two users belong to the same group, we user pairs whose average similarity is 0.74. Moreover, the
canperformcross-userpaymentprediction. paymentbehaviorsofsimilarspatialrelationsaremorecon-
Basedontheobservation,wehavetheinsightthatpeople centrated, while those of the random user pairs are more
whosharethesametemporalparkingpatterns,suchassimilar scattered.Theabovefindingsprovetheeffectivenessofour
arrivalanddeparturepatterns,havethesamepaymenthabits. method.
123

| 1040 |     |     |     |     |     |     |     |     |     |     |     |     | Q.Xuetal. |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
3.5 Motivation
| Therefore, | we  | have the | insight that | users who | have the |     |     |     |     |     |     |     |     |
| ---------- | --- | -------- | ------------ | --------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
samehistoricaltrajectoriescanbelongtothesameusergroup.
Forexample,usersgotothesameparkinglotsthatarenear Previous studies [6,15,25,68,69,74] ignore these important
thebusinesscenter,andtheycanbevisitorswhomayforget hiddenrelations.Weshouldabstractandinvolvethesehidden
to pay after they leave. Accordingly, we should utilize this relationsinourpaymentprediction.Moreover,theperiodic
relationtobuildaspatialconnectiongraphbasedonhistor- paymenthistoryshouldalsobeutilizedinpaymentbehavior
icaltrajectories.Wecanalsospeculatethatunpaidratesare prediction. A graph convolutional network can be used to
differentinvarioustypesofparkinglot,soweshouldcon- capture the complicated relations between users while an
siderusersfromdifferenttypesofparkinglots,respectively. LSTM-based layer can be applied to capture the temporal
relationsduringpaymentprediction.
3.4 Hiddenrelation4:typesofparkinglotsand
4 Problemdefinition
weekdays
|     |     |     |     |     |     | The problem |     | we are | trying to | solve | is to predict | whether | a   |
| --- | --- | --- | --- | --- | --- | ----------- | --- | ------ | --------- | ----- | ------------- | ------- | --- |
Observation(4):Itcanbeobservedthatparkinglottypes
userwillpayontimewhenanorderisgenerated.
andweekdayshavecorrelationwiththeunpaidrates.
Insight(4):Weshouldinvolvedateinformationandpark-
4.1 Parkingpaymentbehavior
inglottypesinourfeaturestobettermodelusers’payment
behaviors.
Thepaymentbehaviorreferstothepaymentprocessforauser
Previous study [80] has demonstrated the influence of afterparking.Consideri(cid:2)nga(cid:3)setofparkingrecordsassociated
parkinglottypeandweekdaysonparkingbehavior.Itwould withtheusera, Pa = Pa ,i ∈ [0,N −1],where N is
|                      |     |     |                 |           |         |     |     |     | i   |     | a   |     | a   |
| -------------------- | --- | --- | --------------- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
| be interestingtofind |     | out | whether certain | relations | between |     |     |     |     |     |     |     |     |
thenumberofparkingrecordsthatbelongtotheusera.The
typesofparkinglotsandpaymentbehaviorsexistinshared paymentbehaviorof1)timelypayment,2)latepayment,and
| parking | scenarios, | or whether | the date | feature | has an influ- |     |     |     |     |     |     |     |     |
| ------- | ---------- | ---------- | -------- | ------- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- |
3)unpaid,relatestotwoconsiderations,usercharacteristics
enceonoursharedparkingpaymentinanon-trivialway. Ua andordercharacteristics Oa:
|                                                   |             |      |                |              |              | i    |      |         |     | i         |               |     |      |
| ------------------------------------------------- | ----------- | ---- | -------------- | ------------ | ------------ | ---- | ---- | ------- | --- | --------- | ------------- | --- | ---- |
| We observe                                        | that        | the  | unpaid rates   | of different | types of     |      |      |         |     |           |               |     |      |
| parking                                           | lots differ | from | each other and | vary         | on different |      | R1×M |         |     |           |               |     |      |
|                                                   |             |      |                |              |              | – Ua | ∈    | denotes | the | extracted | M-dimensional |     | fea- |
| weekdays.Indetail,inFigure6a,weshowtheunpaidrates |             |      |                |              |              | i    |      |         |     |           |               |     |      |
(e.g.,
|     |     |     |     |     |     | ture | vector |     | recency, | frequency, |     | and monetary), |     |
| --- | --- | --- | --- | --- | --- | ---- | ------ | --- | -------- | ---------- | --- | -------------- | --- |
ofthreetypesofparkinglots.ParkinglotP7islocatednear
|                                                      |             |        |          |                    |     | whichbelongstotheuserainthetimeofherorder |        |                              |     |     |     |     | Pa.     |
| ---------------------------------------------------- | ----------- | ------ | -------- | ------------------ | --- | ----------------------------------------- | ------ | ---------------------------- | --- | --- | --- | --- | ------- |
| abusinesscenter,parkinglotP10islocatedbesideanoffice |             |        |          |                    |     |                                           |        |                              |     |     |     |     | i       |
|                                                      |             |        |          |                    |     | Oa                                        | ∈ R1×V |                              |     |     |     | Pa  | (e.g ., |
|                                                      |             |        |          |                    |     | –                                         |        | denotesthepropertyoftheorder |     |     |     |     |         |
| building,                                            | and parking | lotP18 | isnear a | residentialarea.We |     |                                           | i      |                              |     |     |     |     | i       |
parkingdurationanddate).
canseethatthesethreetypesofparkinglotsshowtotallydif-
ferentbehaviors.Toexplainthis,peoplecangoshoppingin
thebusinessstreet,soonweekends,P7hasthehighestunpaid Indetail,the M-dimensionalfeaturevectorcontainstra-
|     |     |     |     |     |     | ditional | features | used | in RFM | model | [8], which | can | reveal |
| --- | --- | --- | --- | --- | --- | -------- | -------- | ---- | ------ | ----- | ---------- | --- | ------ |
rate.Peopleoftenvisitofficebuildingsonworkingdaysso
P10hasahighunpaidrateonweekdays.Incontrast,theres- thepatternsinusers’purchasehistory.
| idential | area has      | a relatively | stable structure, |            | and residents |          |        |            |             |           |             |       |          |
| -------- | ------------- | ------------ | ----------------- | ---------- | ------------- | -------- | ------ | ---------- | ----------- | --------- | ----------- | ----- | -------- |
|          |               |              |                   |            |               | Criteria |        | We use     | the average | payment   | time        | of    | all paid |
| who live | for a long    | time         | are more likely   | to develop | a fixed       |          |        |            |             |           |             |       |          |
|          |               |              |                   |            |               | orders   | as the | threshold  | to decide   | whether   | an          | order | is paid  |
| payment  | habit. Hence, | P18          | has the lowest    | unpaid     | rate. We      |          |        |            |             |           |             |       |          |
|          |               |              |                   |            |               | on time. | In     | detail, we | first       | calculate | the average |       | payment  |
alsodemonstratetheaverageunpaidratesforallfiftyparking
|           |                   |     |                   |             |               | timeofallhistoricalordersast           |     |     |     | .Wefindthatt |     |               | variesin |
| --------- | ----------------- | --- | ----------------- | ----------- | ------------- | -------------------------------------- | --- | --- | --- | ------------ | --- | ------------- | -------- |
|           |                   |     |                   |             |               |                                        |     |     |     | avg          |     | avg           |          |
| lots used | in our evaluation |     | in Fig. 6 b.      | On average, | we can        |                                        |     |     |     |              |     |               |          |
|           |                   |     |                   |             |               | differenttypesofparkinglots,sowecountt |     |     |     |              | avg | separatelyfor |          |
| see that  | unpaid rates      | are | high on weekends. | In          | detail, there |                                        |     |     |     |              |     |               |          |
eachparkinglot.Weleavethetimeintervalforre-evaluating
| are 29 parking | lots | located | near a business | center. | Besides, |          |           |     |             |      |             |       |        |
| -------------- | ---- | ------- | --------------- | ------- | -------- | -------- | --------- | --- | ----------- | ---- | ----------- | ----- | ------ |
|                |      |         |                 |         |          | t avg to | the owner | of  | the parking | lot. | By default, | t avg | is re- |
peoplearewillingtogooutonweekendsandmayforgetto
|     |     |     |     |     |     | evaluated | every | three | months. | Then, | given | an order | Pa, if |
| --- | --- | --- | --- | --- | --- | --------- | ----- | ----- | ------- | ----- | ----- | -------- | ------ |
i
paywhentheygohome.
|       |          |              |               |     |             | itspaymenttimeislongerthant |     |     |     | avg | ,itisregardedasalate |     |     |
| ----- | -------- | ------------ | ------------- | --- | ----------- | --------------------------- | --- | --- | --- | --- | -------------------- | --- | --- |
| Based | on these | observations | and analysis, |     | we conclude |                             |     |     |     |     |                      |     |     |
payment;otherwise,itisatimelypayment.
thattheunpaidrateshaveastrongcorrelationwithparking
lot types and weekdays. This also reveals that the specific Importanceofpaymentbehaviorprediction.Ourpay-
influenceofweekdayinformationonvarioustypesofparking mentbehaviorpredictionisimportantforsharedparkinglots.
lotsisdifferent.Thisfindingdirectlyleadstotheconclusion First,sincetheintelligentsharedparkinglotsuseunmanned
thatwecanmakemoreprecisepredictionsbyinvolvingthe methodstooperate,userscanpayatanytimeafterleavingthe
parkinglottypeandweekdayinformation. parkinglots.Thus,delayedpaymentsoccurandcanleadtoa
123

| PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… |     |     |     |     |     |     |     |     |     |     |     |     | 1041 |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
|                                                         | (a) |     |     |     |     |     |     | (b) |     |     |     |     |      |
Fig.6 Unpaidratesindifferenttypesofparkinglotsandweekdays
highincomelossofthesharedparkinglots.Ifwecandetect supplementtheirrelationshipbyminingtheirparkingbehav-
| thedelayedpaymentinadvance,wecantakecorresponding |     |     |     |     |     |     |     | iors. |     |     |     |     |     |
| ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- |
actions.Forexample,wecanbuildareminderafterwardto AbstractionforpaymentpredictionWefurtherabstract
remind these users to pay. Second, besides shared parking, the payment(cid:2)pred(cid:3)iction problem. Given the features of the
|     |     |     |     |     |     |     |     | orders(cid:2)= |     | ,i ∈[0,N | −   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | -------- | --- | --- | --- |
manyintelligentproductsofthesharingeconomyadoptthe O a (cid:2)1],(cid:3)andfeaturesoftheusers
|     |     |     |     |     |     |     |     |     | i   |     | a   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
businessmodeofunmannedpaymentmethods.However,we in different time periods υ = Ua ,i ∈ [0,N −1], our
|     |     |     |     |     |     |     |     |     |     |     | i   |     | a   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Pa
havenotfoundanymethodsthatcanbeusedinthepayment problem is to predict whether the order will be paid on
i
predictionsituationswithhiddenrelations.Thus,itisneces- time,asshowninEquation1.Iftheorderispaidintime,y
(·)isthemappingfunctionwe
saryforustoputforwardaneffectiveandpracticalpayment isequalto1;otherwise,0. f
prediction model for shared parking lots. It is notable that wanttolearnbyourmodels.
ourmodelcanbeadaptedtoothersimilarproblems,detailed
inSect.6.4.Third,inspiredbypreviousworkssuchasfraud f((cid:2),υ)→ y,y ∈{0,1}
(1)
detection[13],detectingtheuserswhoarepotentiallyunwill-
ingtopaycangeneratepositivesocialimpacts.
SignificanceAItechniqueshavebeenwidelyadoptedin
datasciencedomain[78,86].Thesocialimpactofintelligent
| Necessity | of  | payment | behavior |     | prediction |     | Parking is |                 |     |            |                 |            |        |
| --------- | --- | ------- | -------- | --- | ---------- | --- | ---------- | --------------- | --- | ---------- | --------------- | ---------- | ------ |
|           |     |         |          |     |            |     |            | parking payment |     | prediction | is significant, | especially | in the |
becomingapartofourlivesandintheeraofsharingecon-
backgroundofthesharingeconomyera.Inaddition,thepark-
| omy, shared | parking   |     | lots have | become | an  | inevitable | trend.  |             |            |     |                         |     |           |
| ----------- | --------- | --- | --------- | ------ | --- | ---------- | ------- | ----------- | ---------- | --- | ----------------------- | --- | --------- |
|             |           |     |           |        |     |            |         | ing payment | prediction |     | has not been adequately |     | addressed |
| The basis   | of shared |     | parking   | spaces | and | even the   | sharing |             |            |     |                         |     |           |
bytheAIcommunity.Inthispaper,weproposeaneffective
economyistrust,soourplatformdoesnotrequireadepositin
neuron-basedapproachtosolveitinanAImechanism.
advance.Accordingly,paymentbehaviorpredictionbecomes
| extremely | important, |     | based | on three | reasons. | First, | we can |     |     |     |     |     |     |
| --------- | ---------- | --- | ----- | -------- | -------- | ------ | ------ | --- | --- | --- | --- | --- | --- |
4.2 Challenges
| understand | the   | payment | behaviors |         | of different |      | users and  |     |     |     |     |     |     |
| ---------- | ----- | ------- | --------- | ------- | ------------ | ---- | ---------- | --- | --- | --- | --- | --- | --- |
| remind the | users | who     | forget    | to pay. | Note         | that | users have |     |     |     |     |     |     |
Tosolvetheparkingpaymentbehaviorproblem,weneedto
| different | payment | habits | which | should | be  | respected, | so we |     |     |     |     |     |     |
| --------- | ------- | ------ | ----- | ------ | --- | ---------- | ----- | --- | --- | --- | --- | --- | --- |
cannotsimplyremindthembyrules.Second,wecaniden- handlethefollowingthreechallenges.
| tify the | potential | high-risk |     | users, and | then | require | them to |     |     |     |     |     |     |
| -------- | --------- | --------- | --- | ---------- | ---- | ------- | ------- | --- | --- | --- | --- | --- | --- |
Challenge1:VolumeOurintelligentsharedparkinglots
| pay a deposit | before |     | the next | parking. | Third, | by  | user pay- |                 |     |             |                 |          |         |
| ------------- | ------ | --- | -------- | -------- | ------ | --- | --------- | --------------- | --- | ----------- | --------------- | -------- | ------- |
|               |        |     |          |          |        |     |           | are distributed |     | in multiple | cities over the | country, | and the |
mentbehaviorprediction,wecanprovidereminderservice
dailyuserflowislarge,especiallyinpeakhours.Forexam-
andincentivemechanismtohelpusersbuildgoodpayment
ple,oursystemcontain11millionparkingrecordsintotal.
habits.
|     |     |     |     |     |     |     |     | Currently, | the daily | user | flow is 11,352. | In peak | hours, we |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --------- | ---- | --------------- | ------- | --------- |
needtoprocess2,058MBperminute.Ourserviceisplaced
| Privacy | versus | accuracy |     | If we | can directly |     | obtain the |     |     |     |     |     |     |
| ------- | ------ | -------- | --- | ----- | ------------ | --- | ---------- | --- | --- | --- | --- | --- | --- |
user’s detailed information and the relationship between onAlibabaCloudandisresponsiblefornationwidebusiness.
|           |           |     |          |         |     |            |        | We need | to process | the | uploaded data from | shared | parking |
| --------- | --------- | --- | -------- | ------- | --- | ---------- | ------ | ------- | ---------- | --- | ------------------ | ------ | ------- |
| users, we | can build | an  | accurate | payment |     | prediction | model. |         |            |     |                    |        |         |
However,duetoprivacyissues,weareunabletoobtainthe lots in time. Moreover, with the increase of the amount of
data,noisedatagraduallyappearandweshouldalsohandle
| personal | information |     | of users. | Fortunately, |     | we can | roughly |     |     |     |     |     |     |
| -------- | ----------- | --- | --------- | ------------ | --- | ------ | ------- | --- | --- | --- | --- | --- | --- |
theproblemofdirtydata.Inthelargeamountofdatainput,
thereareissuesofmissingdata(suchasattributemissingin
123

| 1042 |     |     |     |     |     |     |     |     |     |     |     |     | Q.Xuetal. |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
a record), wrong data (data format is not correct, outliers, buildtheirconnectionsbydifferentdatatypes.MatrixArep-
etc.),anddataunavailability[93]. resents the relations between different users. A graph node
|           |     |            |         |            |     |              | represents | a user  | and the | edges     | in the | graph        | represent the |
| --------- | --- | ---------- | ------- | ---------- | --- | ------------ | ---------- | ------- | ------- | --------- | ------ | ------------ | ------------- |
| Challenge |     | 2: variety | We need | to involve |     | various data |            |         |         |           |        |              |               |
|           |     |            |         |            |     |              | relations  | between | users.  | In matrix | A,     | each element | repre-        |
typestodescribethehiddenrelationsinourinput.Forexam-
sentswhetherthereisanedgeexitingbetweenthetwonodes.
ple,wecanuseuserpaymentrecordsandmemberpurchase
|          |         |             |      |               |     |          | Matrix D | represents   | the    | features | of each     | user. | In matrix D, |
| -------- | ------- | ----------- | ---- | ------------- | --- | -------- | -------- | ------------ | ------ | -------- | ----------- | ----- | ------------ |
| records. | We need | tojointhese | data | fromdifferent |     | perspec- |          |              |        |          |             |       |              |
|          |         |             |      |               |     |          | each row | is a feature | vector | and      | each column |       | represents a |
tivestogenerateourfinalfeatures.Inaddition,weareunable
differentattribute.GCNtakesthesetwomatricesasinputs.
| toextractusers’connections |     |     | directlydue |     | toprivacy | issues. |     |     |     |     |     |     |     |
| -------------------------- | --- | --- | ----------- | --- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- |
Foruserswhohavesimilarparkingpatterns,webuildedges
Hence,weneedtodivedeepintodifferenttypesofdataand
betweenthem.Withsuchmethods,webuildthreeassociation
minethehiddenrelationshipsbetweenusers.However,there graphs,includingcontactgraphGT,patterngraphGT,and
|         |       |           |            |             |     |            |     |     |     |     | p   |     | t   |
| ------- | ----- | --------- | ---------- | ----------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
| are few | works | about how | to extract | association |     | graphs for |     |     |     |     |     |     |     |
spatialconnectiongraphGT.Wenextdesignafusionmodel
S
| users in | the parking | scenario. | Even | worse, | we  | do not have |     |     |     |     |     |     |     |
| -------- | ----------- | --------- | ---- | ------ | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
tointegratethethreeassociationgraphsintothesameone.At
users’friendshipinformationoranyobviouspersonalinfor-
|     |     |     |     |     |     |     | atimestep,eachusergeneratesanadjacencymatrix |     |     |     |     |     | AT and |
| --- | --- | --- | --- | --- | --- | --- | -------------------------------------------- | --- | --- | --- | --- | --- | ------ |
mation in our platform. Thus, this is the most difficult part DT.TheLSTM-basedmod-
afeaturerepresentationmatrix
ofourworkandworthlotsofinvestigation.
elingincludesanLSTMlayertocapturetherelationshipsin
Challenge 3: timing Our parking records, payment atemporalmechanism,followedbyafully-connectedlayer,
whichoutputsthepredictedresults.
records,andthepurchaserecordsallcomeastimeseriesdata,
whichmeansthatweneedtoeithersummarizetheinforma-
|     |     |     |     |     |     |     | Necessity | for | data preprocessing |     | To  | tackle | the volume |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | ------------------ | --- | --- | ------ | ---------- |
tioninhistoricalrecordsorfindanotherwaytoutilizeusers’
challengementionedinSect.4,weperformdatapreprocess-
| historical | behaviors. | Previous | work | [74] | extracted | features |     |     |     |     |     |     |     |
| ---------- | ---------- | -------- | ---- | ---- | --------- | -------- | --- | --- | --- | --- | --- | --- | --- |
ingtoensurethehighqualityofourinputparkingdata.The
| from historical |     | data and | used the | decision | tree | model for |     |     |     |     |     |     |     |
| --------------- | --- | -------- | -------- | -------- | ---- | --------- | --- | --- | --- | --- | --- | --- | --- |
generalpreprocessingmethodisnotoptimizedforthepark-
| parking | behavior | prediction. | However, |     | it relied | heavily on |     |     |     |     |     |     |     |
| ------- | -------- | ----------- | -------- | --- | --------- | ---------- | --- | --- | --- | --- | --- | --- | --- |
ingpaymentscenario.Thepreprocessingforparkingdatacan
featureengineering,whichisnotuniversal.Thus,weneedto
bedividedintothreeparts.Thefirstpartisdatacollection.At
developothermethodstohandlethetimeseriesdata.There
thisstageweselecttheparkingattributesrequiredfortrain-
areseveralvariantsoftemporalneuralnetworksthatcanbe
|     |     |     |     |     |     |     | ing. We | face special | difficulties |     | in data | merging. | The data |
| --- | --- | --- | --- | --- | --- | --- | ------- | ------------ | ------------ | --- | ------- | -------- | -------- |
utilizedtohandletimeseriesdata,sospecialdesignsneedto
|     |     |     |     |     |     |     | resources | are various, | and | we need | to merge |     | different user |
| --- | --- | --- | --- | --- | --- | --- | --------- | ------------ | --- | ------- | -------- | --- | -------------- |
bemadetochooseandadapttemporalnetworksinparking
datatogether,suchasusers’parkingrecordsandmembership
situations.
|     |     |     |     |     |     |     | records.    | The second      | part | is data | cleaning, | which | includes    |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --------------- | ---- | ------- | --------- | ----- | ----------- |
|     |     |     |     |     |     |     | data format | transformation, |      | missing | attribute |       | supplement, |
andoutlieranalysis.Weneedtodevelopdatacleaningmeth-
5 TR-GCN
|         |          |          |      |            |     |            | ods targeting | the   | parking | scenario. | The              | third | part is data |
| ------- | -------- | -------- | ---- | ---------- | --- | ---------- | ------------- | ----- | ------- | --------- | ---------------- | ----- | ------------ |
|         |          |          |      |            |     |            | decision,     | which | is used | to input  | the preprocessed |       | data into    |
| In this | section, | we start | with | our TR-GCN |     | framework, |               |       |         |           |                  |       |              |
themodel.Afterdatacleaning,weapplysamplingmethods
whichconsistsofadatapreprocessingmodule,aGCNmod-
tosolvetheimbalanceproblem.Moredetailscanbefound
ule,andanLSTMmodule.Then,weshowourdetaileddata
inSect.5.2.
| preprocessing, |     | design of | GCN-based | modeling |     | for hidden |     |     |     |     |     |     |     |
| -------------- | --- | --------- | --------- | -------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
relationsbetweenusers,andLSTM-basedmodelingfortem- GCNTohandlethevarietychallengementionedinSect.
poralrelations. 4, we need to use multi-dimensional information and mine
|     |     |     |     |     |     |     | hidden | relationships. | As  | discussed | in Sect. | 3,  | we find that |
| --- | --- | --- | --- | --- | --- | --- | ------ | -------------- | --- | --------- | -------- | --- | ------------ |
5.1 Overview hidden relations exist between users, which should be uti-
|     |     |     |     |     |     |     | lized in | payment | behavior | prediction. |     | GCN | is a powerful |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------- | -------- | ----------- | --- | --- | ------------- |
We show our TR-GCN framework in Fig. 7. We find that variant of convolutional neural network and it can capture
graph neural network combined with time series model is thecomplicatedhiddenrelationsbetweenusers.
| very suitable | for | parking | payment | prediction. |     | The input is |     |     |     |     |     |     |     |
| ------------- | --- | ------- | ------- | ----------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
LSTMLSTMcancapturethetemporalinformationfrom
theadjacencymatrixandcharacteristicmatrixofgraphsand
historicalevents.First,therelationgraphsarechangingtem-
theoutputistheclassificationresult.Theinputdataconsistof
|     |     |     |     |     |     |     | porally. | Second, | user payment |     | may relate | to  | different time |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------- | ------------ | --- | ---------- | --- | -------------- |
threeparts:theuserpurchasehistory,theuserpaymenthis-
points.Forexample,9:00onThursdaycouldbeagoodtime
toryforbuyingmembershipsandcoupons,andtheparking
but9:00onSaturdaycouldnot(detailedinSect.6.3).Third,
lotlocation.
userpaymentrecordswithtimestampsbelongtotimeseries
Framework In our TR-GCN shown in Fig. 7, we treat dataandLSTMiscapableoflearningsuchlong-termdepen-
eachuserasanodeinagraph,anduseaclusteringstepto
123

| PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… |     |     |     |     |     |     |     |     |     |     | 1043 |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
Fig.7 TR-GCNoverview
dencies. Considering the efficiency of LSTM, we save the thenextfeaturevectorofuserstopredictthefinalpayment
datalocallytoincreasetheLSTMprocessingspeed.Wehave behavior.Fourth,weusethelatentvectorofLSTMoutputas
followedthedesignofthepreviouswork[48]tosupportfast globalembeddingsandlocalfeaturesofthecurrentorderto
data ingestion in our system. Due to space limitations, we inputintoafullyconnectedlayerforfinalclassification.We
leaveadetaileddiscussiontoseparatework. find that such a design can obtain the hidden relationships
betweenusers,usingonlytheparkinginformation.
DifferencefrompreviousworkWefocusonthespecial
scene of parking payment on shared parking lots and pay SolutiontochallengesOurwork,TR-GCN,ismotivated
special attention to the mining of hidden information from bythreechallenges,asdiscussedinSect.1,whicharesuc-
users.AsdiscussedinSect.3,weobservethattherelations cessfully solved in this paper. First, the data collections of
ofuserprofile,users’temporalparkingpatterns,andspatial paymentrelations,especiallytheusers’hiddenrelations,are
relationsbetweenparkinglotsallrelatetoparkingpayment difficulttohandle.Tosolvethischallenge,webuildthreeuser
behavior.Previousparkingrelatedresearchworks[3,6,15,17, associationgraphstocapturethehiddenrelationsfromdif-
25,43,68,69,74,89,96]donotconsiderthesehiddenfactors. ferentperspectives.Second,thepaymentmodelingproblem
WeshowindetailhowtobuildGCN-basedmodelstoabstract isatime-intensiveactivity,whichinvolvesunderstandingthe
thesehiddenrelationsinSect.5.3. payment behavior from both temporal and spatial perspec-
|          |     |          |        |        |             | tives. To | handle this challenge, |     | we develop | a GCN-based |     |
| -------- | --- | -------- | ------ | ------ | ----------- | --------- | ---------------------- | --- | ---------- | ----------- | --- |
| Workflow | The | workflow | of our | TR-GCN | is shown in |           |                        |     |            |             |     |
modelingapproachtocapturethehiddenrelationsbetween
| Fig. 8. The                | matrix | X represents | the | output               | of GCN and it |                                                      |                       |     |          |          |     |
| -------------------------- | ------ | ------------ | --- | -------------------- | ------------- | ---------------------------------------------------- | --------------------- | --- | -------- | -------- | --- |
|                            |        |              |     |                      |               | users and                                            | develop an LSTM-based |     | modeling | approach | to  |
| alsoworksastheinputofLSTM. |        |              | Xt  | isthefeaturematrixof |               |                                                      |                       |     |          |          |     |
|                            |        |              | i   |                      |               | utilizethetemporalapproach.Third,thesocialimpactfrom |                       |     |          |          |     |
useri intimet,andithasbeenprocessedbyGCNtoserve
intelligentparkingpaymentpredictionishardtomeasure.To
| astheinputmatrixforLSTM. |     |     | Rrepresentstherealnumber |     |     |     |     |     |     |     |     |
| ------------------------ | --- | --- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
solvethischallenge,wedevelopnovelexperimentaldesigns
field.N anddeinFig.8representthenumberofinputorders
|     |     |     |     |     |     | to analyze | the social impact | of  | our neuron-based |     | payment |
| --- | --- | --- | --- | --- | --- | ---------- | ----------------- | --- | ---------------- | --- | ------- |
andthedimensionalityofinputfeatures.TheLSTMmodelin
predictionmethod.
parkingpaymentpredictionisfurtherelaboratedinSect.5.4.
TR-GCNincludesfourmajorsteps.Thefirststepistocon- NoveltyOurnoveltyismainlyreflectedinthefollowing
struct the user association graphs according to the relevant threeaspects.First,fortheparkingscenario,weintegratethe
observations.Weconsiderthreetypesofassociationgraphs temporal relational model with graph convolutional model,
inoursystem.Ineachassociationgraph,wespecificallycre- which can capture both the spatial relations between users
ateedgesthatcanaggregateusers’information.Accordingly, andthetemporalrelationsbetweenparkingrecords.Second,
wecanmapusers’featurestohiddenvectors.Thesecondstep wedevelopanoveldatagatheringtechnologytoobtainhid-
istoconstructagraphneuralnetworkthatcanlearntheuser’s denrelationshipsbetweenuserswithoutknowingtheuser’s
hiddenvector.Theusernetworkdiagramconstructedinthe private data. Third, we prove that a novel reminder can be
first step is used as input and put into our GCN for train- builtbasedonTR-GCNtohelpusersestablishgoodpayment
ing.AfterobtainingtheoutputofGCN,wehaveabehavior habitsandsavelosses.
| sequence | of users. | In the third | step, | we input | the sequence |     |     |     |     |     |     |
| -------- | --------- | ------------ | ----- | -------- | ------------ | --- | --- | --- | --- | --- | --- |
RelevancetoresponsibledatascienceTR-GCNnotonly
| features | into our | LSTM module | for | training | and then use |          |                 |          |        |          |         |
| -------- | -------- | ----------- | --- | -------- | ------------ | -------- | --------------- | -------- | ------ | -------- | ------- |
|          |          |             |     |          |              | explores | the application | of graph | neural | networks | to data |
123

| 1044 |     |     |     |     |     |     |     |     |     | Q.Xuetal. |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
Fig.8 TR-GCNworkflow.Thenodesontheleftrepresentusersindifferentassociationgraphs,andtheedgesbetweennodesrepresenttheir
relations
management, which can increase our knowledge from the addition,westoretheinputdataintomemoryinblocks,and
data we have, but also can validate the reliability of this thenmergetheblockstogether,insteadofputtingallthedata
method on realdatasets and setup the systemtoverifythe intomemoryatonce.
reliabilityoftherelationshipswefound.Specifically,wepro-
DatacollectionOurplatformcoversmajorcitiesinChina
| vide a real-world | AI application | scenario in | data science |     |     |     |     |     |     |     |
| ----------------- | -------------- | ----------- | ------------ | --- | --- | --- | --- | --- | --- | --- |
domain.Wealsoconductdatadrivenanalysisandobserva- and has accumulated a large number of users. The number
|     |     |     |     | of our registered |     | users | reaches | two million. |     | However, the |
| --- | --- | --- | --- | ----------------- | --- | ----- | ------- | ------------ | --- | ------------ |
tions,andprovetheeffectivenessofAI-powereddatascience
technologies.Moreover,weinvolvedatacleaningandselec- parkinglotscouldbeoutofserviceduetoconstruction,dis-
asters,andactivities.Parkinglotscanberecentlyputintouse
| tion for effective | learning, detailed | in Sect. | 5.2. All these |     |     |     |     |     |     |     |
| ------------------ | ------------------ | -------- | -------------- | --- | --- | --- | --- | --- | --- | --- |
withonlyasmallamountofdata.Wecollectedalargenum-
resultscanshedlightsonthefutureresearchofAI-powered
berofparkingrecordsfromdifferentparkinglotsinvarious
datascienceapplications.
|     |     |     |     | cities. More | details | can | be found | in Sect. | 6.1. | These park- |
| --- | --- | --- | --- | ------------ | ------- | --- | -------- | -------- | ---- | ----------- |
Intherestpartofthissection,weintroducethedataprepro-
inglotsarerepresentativeandrelativelystableinoperation.
cessing,GCN-basedmodeling,andLSTM-basedmodeling
|     |     |     |     | Due to various |     | data resources, |     | we need | to merge | the data |
| --- | --- | --- | --- | -------------- | --- | --------------- | --- | ------- | -------- | -------- |
ofTR-GCN,whicharethesolutionstothechallengesmen-
|     |     |     |     | together. | For example, |     | we need | to connect | users’ | parking |
| --- | --- | --- | --- | --------- | ------------ | --- | ------- | ---------- | ------ | ------- |
tionedinSect.4.2.
|     |     |     |     | records         | with their | membership |            | information | through | a tele-     |
| --- | --- | --- | --- | --------------- | ---------- | ---------- | ---------- | ----------- | ------- | ----------- |
|     |     |     |     | phone number-ID |            | table.     | We collect | their       | user    | IDs, coupon |
5.2 Datapreprocessing usage,contactinformation,parkinglotID,parkinglotloca-
tion,environment,parkingstarttime,endtime,paymenttime
Theoriginalordersarebothdirtyandmessy,withlargedata afterparking,andpaymentamount.
volumes,sothedatapreprocessingisimportantinoursys-
DatacleaningAfterdatacollection,weneedtoperform
tem.
datacleaningandselectionforeffectiveGCN-basedmodel-
SolvingtheproblemofalargevolumeofdataThelarge
|     |     |     |     | ing. Although | the | AI-powered |     | technology | has | been proved |
| --- | --- | --- | --- | ------------- | --- | ---------- | --- | ---------- | --- | ----------- |
volumechallengebringsusgreatdifficulties.Asdiscussedin
|     |     |     |     | to be successful |     | in parking | behavior | prediction |     | [74,80,81], |
| --- | --- | --- | --- | ---------------- | --- | ---------- | -------- | ---------- | --- | ----------- |
Sect.4.2,thelargedatavolumeaddsmassiveburdentoboth
|     |     |     |     | the accuracy | of  | payment | behavior | prediction |     | of TR-GCN |
| --- | --- | --- | --- | ------------ | --- | ------- | -------- | ---------- | --- | --------- |
dataanalysisandmodeltraining.Consequently,weneedto
|                      |           |              |              | depends | on the | quality | of input | data. | For | example, the |
| -------------------- | --------- | ------------ | ------------ | ------- | ------ | ------- | -------- | ----- | --- | ------------ |
| develop an efficient | mechanism | to solve the | volume chal- |         |        |         |          |       |     |              |
variousdataformat,missingattributes,andoutliersinpark-
lenge.First,weusethedatapreprocessingmoduletocorrect
|     |     |     |     | ing records | generate | adverse | effects | on  | the decision | model |
| --- | --- | --- | --- | ----------- | -------- | ------- | ------- | --- | ------------ | ----- |
thedirtydataandgatherusefuldatawithproperformat,soas
|     |     |     |     | of parking | payment | prediction. |     | The general |     | preprocessing |
| --- | --- | --- | --- | ---------- | ------- | ----------- | --- | ----------- | --- | ------------- |
toreduceouranalysisandtrainingtime.Second,inparameter
|     |     |     |     | method | is not optimized |     | for the | parking | payment | scenario. |
| --- | --- | --- | --- | ------ | ---------------- | --- | ------- | ------- | ------- | --------- |
setting,weusesamplingmethodstosetparametersthrougha
Weutilizeresponsibledataprocessingtomaximizethequal-
smallamountofdata.Third,weusethepreprocesseddatafor
|     |     |     |     | ity of data, | including |     | data format | transformation, |     | missing |
| --- | --- | --- | --- | ------------ | --------- | --- | ----------- | --------------- | --- | ------- |
training,insteadoftheoriginaldata,whichcanhelpusstore
attributesupplement,andoutlieranalysis,asshowninFig.9.
thedatainamorecompactformandsavememoryspace.In
123

| PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… |     |     |     |     |     |     |     |     |     |     |     |     | 1045 |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
|                                                         |     |     |     | (a) |     |     | (b) |     |     |     |     |     |      |
(c)
Fig.9 Datacleaningandselectionforeffectivelearning
1)Dataformat.Thefirstdifficultyisdataformat,because 5.3 GCN-basedmodeling
| the collected | data | attributes | are of | various | data types, | such |     |     |     |     |     |     |     |
| ------------- | ---- | ---------- | ------ | ------- | ----------- | ---- | --- | --- | --- | --- | --- | --- | --- |
as date, unique integers, float, and text. We need to design InGCN-based modeling, wefirstgenerate userassociation
anefficientstructuredformattostorethecollecteddata.We graphs from different dimensions. Second, we merge these
usedescriptivevariablesforparkinglotsurroundingsviatext userassociationgraphs.Third,weinputthemintoGCNfor
analysisandfeatureselectionmethod.Inaddition,weallowa training.Asimilarprocesshasalsobeenusedin[59,88].
parkinglottobelongtomultiplecategories.Wealsoturnthe
|     |     |     |     |     |     |     | Clustering | for | user connection | graphs |     | We develop | an  |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --------------- | ------ | --- | ---------- | --- |
dateformatfromstringtoaspeciallydesigneddateformat.
adaptiveclusteringmethodforuserconnectiongraphsbased
2)Missingattributes.Thecollectedrecordsinvolvemiss-
onthetraditionalK-means[33].Intermsofuserclustering,
| ing attributes, | which | could | be caused | by  | power | failure or |     |     |     |     |     |     |     |
| --------------- | ----- | ----- | --------- | --- | ----- | ---------- | --- | --- | --- | --- | --- | --- | --- |
whatwemainlyuseareusers’paymentfeatures.
| other device | problems. |     | We do not | simply | drop the | record |           |                 |     |             |      |          |      |
| ------------ | --------- | --- | --------- | ------ | -------- | ------ | --------- | --------------- | --- | ----------- | ---- | -------- | ---- |
|              |           |     |           |        |          |        | Regarding | the traditional |     | RFM profile | user | features | [8], |
withmissingfeaturesbecausethatmeanswewilldropother
wedefineauserinfivedimensions:1)theintervalbetween
| useful information. |     | For | example, | for the | missing | categori- |            |               |        |         |         |           |     |
| ------------------- | --- | --- | -------- | ------- | ------- | --------- | ---------- | ------------- | ------ | ------- | ------- | --------- | --- |
|                     |     |     |          |         |         |           | the user’s | last payment, | 2) the | current | payment | (recency, | 0   |
calfeatures,suchastheparkinglot,weaddanewcategory
ifitisanewcustomer),3)thepaymentamountofthistime,
andlabeltheattributeas“missing.”Forthemissingnumer-
|                |     |          |            |          |       |         | 4) users’ | membership, | and 5) | coupon | usage. | We use | these |
| -------------- | --- | -------- | ---------- | -------- | ----- | ------- | --------- | ----------- | ------ | ------ | ------ | ------ | ----- |
| ical features, | we  | fill the | blank with | the mean | value | of this |           |             |        |        |        |        |       |
featurestoclusterusers.Notethatauserisstillapointafter
| attribute. | However, | for | missing important |     | features | such as |     |     |     |     |     |     |     |
| ---------- | -------- | --- | ----------------- | --- | -------- | ------- | --- | --- | --- | --- | --- | --- | --- |
clustering.Wecanmeasurethedistancebetweentwopoints
parkingtime,wehavetoremovetherecord.
andregarditasthesimilarityoftwousers’profilefeatures.
| 3) Outliers. |     | There are | also noise | data | that affect | accu- |     |     |     |     |     |     |     |
| ------------ | --- | --------- | ---------- | ---- | ----------- | ----- | --- | --- | --- | --- | --- | --- | --- |
Ifthedistancebetweentwopointsislessthanthethreshold
racy.Forexample,iftheintervalbetweenstartandendtimes
|              |       |          |              |            |            |          | or the distance   | between | k nearest                 | neighbors, |          | an edge     | shall      |
| ------------ | ----- | -------- | ------------ | ---------- | ---------- | -------- | ----------------- | ------- | ------------------------- | ---------- | -------- | ----------- | ---------- |
| is extremely | short | or long, | then         | this could | be an      | outlier. |                   |         |                           |            |          |             |            |
|              |       |          |              |            |            |          | be established    | between | the                       | two users. | We       | standardize | the        |
| There are    | many  | studies  | on detecting | and        | processing | noise    |                   |         |                           |            |          |             |            |
|              |       |          |              |            |            |          | numeric features, |         | an(cid:4)d we(cid:5)count | the        | distance | between     | tw(cid:5)o |
data[4,14,34],andanoutlieranalysisneedstobeconducted (cid:5) featurenode2(cid:5)
|     |     |     |     |     |     |     | nodes as | dist = | 5 featurenode1− |     |     |     | ,   |
| --- | --- | --- | --- | --- | --- | --- | -------- | ------ | --------------- | --- | --- | --- | --- |
to remove noise records. Basically, we follow the rule of i=1 i i
|                 |     |             |         |      |                 |     | where i denotes | the | i-th feature | of  | the node. | Because | the |
| --------------- | --- | ----------- | ------- | ---- | --------------- | --- | --------------- | --- | ------------ | --- | --------- | ------- | --- |
| Pauta criterion |     | [66], which | assumes | that | the possibility | of  |                 |     |              |     |           |         |     |
clusteringresultsfromK-meansareaffectedbythecentroid
| values that | lies | in the | band between | (μ−3σ,μ+3σ) |     | is  |     |     |     |     |     |     |     |
| ----------- | ---- | ------ | ------------ | ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
about99.73%.μisthemeanofthevalue,andσ ofrandominitializationatthebeginning,whichmayfallinto
isthestan-
localoptimum,weutilizethegridsearchmethod[5]togen-
darddeviationofthevalue.Anyvalueliesoutsidethebound
eratetenrandomnumbersineachcluster,andselecttheresult
willbelabeledasanoutlier.
withthesmallestclusteringSSE[50].
Data decision After data cleaning, we input the prepro- T represents a timestamp. We set T at day granularity
cessed data into TR-GCN. The GCN-based model builds basedonthefollowingreasons.First,weobservethatmost
the relation graphs from user connection, parking pattern, usersgenerateoneortwoparkingordersperday.Second,the
andspatialconnectiondimensions,andthedynamicgraphs day granularity is accurate enough from the perspective of
are then input into the LSTM-based model. Itisnoticeable theparkingplatform.Third,smallergranularitycanincrease
thattheimbalanceddatarequireextrasamplingmethodsfor thegraphconstructiontime.
processing, which shall be discussed in Sect. 6.4. After an The three types of association graphs are generated as
| orderisgenerated,TR-GCNprovidestheinformationabout |     |     |     |     |     |     | follows. |     |     |     |     |     |     |
| -------------------------------------------------- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- |
whethertoremindtheusertopayontime. 1)ProfilecontactgraphFor(cid:6)agiventi(cid:7)meT,weconstruct
|     |     |     |     |     |     |     |                   |       | GT = | UT,ET |       |          |     |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | ----- | ---- | ----- | ----- | -------- | --- |
|     |     |     |     |     |     |     | a profile contact | graph |      |       | . The | sequence | of  |
|     |     |     |     |     |     |     |                   |       | p    |       | p     |          |     |
123

1046 Q.Xuetal.
the profile contact graphs for the past T time steps is G co-occurrencematrixcapturesthesimilaritiesofuserparking
p
={Gt−T,Gt−T+1,...,Gt−2,Gt−1},wheret
representsthe timehabits.
p p p p
currenttimeand Gi representstheprofilecontactgraphof BasicideaOurbasicideaisthatiftwousershavesimilar
p (cid:2) (cid:3)
the users arrived before day i. UT = (cid:8)u(cid:6)a T is th(cid:7)e(cid:9)list of parkingtimesandparkingduration,theyarelikelytobelong
tothesameidentitygroup.Forexample,inanofficeregion,
usersappearedbeforetimeT,and ET = uT,uT isthe
p i j theparkingtimeanddurationoftheemployeesinthesame
set of edges that connect users according to similar profile
companycouldbesimilar.
properties.
BuildingedgesIndetail,wecreatetheparkingtimepat-
Basic idea The idea of constructing this graph is that if
terngraphinthefollowingthreesteps.First,toidentifythe
theattributesbetween twousersaresimilar,theyarelikely nodesofourgraph,wecollecttheuserlistut thatcontainsthe
a
to belong to the same type of consumers, so their payment
usersappearedbeforethegiventimeT.Second,wecreatea
behaviorsmayalsobesimilar.Wetrytousethisconnection co-occurrencematrix Aofusertimeperiods,with A = {0}
toimprovetherepresentationoftheoriginalfeatures.
initially.Westipulatethatifuserianduser jparkatthesame
BuildingedgesThegraphconstructionprocessisasfol-
timeonthesameday(withatimedifferenceofnomorethan
lows.First,wesetupauserprofileattributeassociationgraph.
onehour)andthedurationoftheparkingisalsosimilar,then
Wearemainlyconcernedaboutthepaymenthabitsandpay- weseta i,j =a i,j +1,a i,j ∈ A.Wedefinethattheduration
mentamountofusers.Weusetheintervalbetweentheuser’s
of two parking records are similar only when the follow-
last payment and the current payment (recency, 0 if it is a
ingtworestrictionsaremet:theirlockdowntimeshouldnot
newcustomer),thepaymentamountofthistime,andcoupon
exceedanhour,andtheirparkingdurationshouldnotexceed
usage,astheuser’sprofilefeatures.Second,wefollowtra-
twohours.Thesetwothresholdsaresetaccordingtoexperi-
ditionaluserprofiledivisionmethods(RMFmodel)anduse
ments.MoredetailsareshowninSect.6.4.Third,giventhe
the clustering method to divide users into three categories thresholdγ,ifa
i,j
≥γ,anedgeshallbebuiltbetweenuser
withreferenceto[8,9].
i anduser j,asshowninEq.3.Inourexperiments,wehave
Third, after clustering, we specify that if the distance
95,849userpairswithsimilartemporalparkingpatterns,and
between user features is less than the threshold value (set
eachpairofsimilarusershas8parkingrecordsonaverage.
bygrid-search[38])orthedistancebetweenknearestneigh-
Werandomlyselect100,000userpairs,andonaverage,each
bors,anedgeshallbeestablishedbetweenthetwousers,as
randomuserpairhas14parkingrecords.
showninEq.2.
(cid:15)
e i,j =
⎧ ⎨
⎩
1, dist (cid:13) u i ,u j (cid:14) ≤α||max((cid:6),dist knn (u i )),i (cid:5)= j e i,j =
0
1,
,
a
o
i
t
,
h
j
e
≥
rw
γ
i
,
s
i
e
(cid:5)= j (3)
0, otherwise
(2) Parameter setting We also set the parameter γ by grid-
search.Wehavestrictconstraintsforuserstohavetemporal
connections.MoredetailsareintroducedinSect.6.1.
Parameter setting Here, we specify the threshold value
α by using grid-search [38]. Because there are few studies
3)SpatialconnectiongraphFor(cid:13)agivent(cid:14)imeT,wecon-
structaspatialpatterngraphGT = UT,ET .Thesequence
of constructing association graphs in our parking scenario, s s
ofthespatialpatterngraphsforthepastT timestepsisG
we utilize automatic methods to help us find the suitable p
={Gt−T,Gt−T+1,...,Gt−2,Gt−1},wheret
representsthe
parameter in this situation. There are several unsupervised s s s s
clusteringmethods.WechooseK-means[33]foritssimplic-
current time and Gi
s
represents the spa(cid:2)tial(cid:3)pattern graph of
ityandstronginterpretability.SincewechooseK-meansas theusers arrived before dayi.UT (cid:8) = (cid:6) u a T i(cid:7)s(cid:9)thesame list
our clusteringmethod, weset k according totheclustering ofusersinGT p andG t T,and E s T = u i T,uT j isthesetof
resulttheuserbelongsto. edgesbuiltbasedontheusers’spatialtrajectories.
2) Parking period pattern graph For a(cid:6)given ti(cid:7)me T, Basic idea Our idea in constructing spatial connection
we construct a time pattern graph GT = UT,ET . The graph is to use users’ spatial co-occurrence information to
tp tp
exploretheconnectionsofthetrajectoriesofdifferentusers.
sequenceofthetimepatterngraphsforthepastL timesteps
is G =
{Gt−T,Gt−T+1,...,Gt−2,Gt−1},
where t repre-
Forexample,ifagroupofusersoftengotothesamegroupof
tp tp tp tp tp
parkinglots,therecouldbeconnectionsbetweentheseusers
sents the current time and Gi represents the time pattern
tp (cid:2) (cid:3) duetothesametrajectory.
graph of the users arrived before da(cid:8)y(cid:6)i.UT (cid:7) = (cid:9) u a T is the Building edges In detail, we try to capture the users’
samelistofusersinGT p ,andE t T = u i T,uT j isthesetof spatialrelevancethrough(cid:2)theirtrajectories.Weestabl(cid:3)ishaco-
constructededgesbasedonuserco-occurrencematrix.The occurrencematrix S = s i,j |∀s i,j ∈ S,s i,j =cs i,j ,where
123

PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… 1047
cs i,j is equal to the number of co-occurrence parking lots ingraph G t , G p ,or G s ,then,thereshallbeanedgeinthis
two users have co-appeared. We define the number of co- fusiongraphwithedgeweightadjustedappropriately.Third,
occurrenceparkinglotsasthenumberofdifferentcommon we obtain the adjacency matrix AT and the feature repre-
parkinglotsusedbytwousers.Whentwousersusethesame sentationmatrix DT ofthecompleteuserassociationgraph
parkinglotmultipletimes,westillconsiderthisasoneco- GT at a given time T. Given time T, our original features
occurrenceparkinglot.Here,welimitthetimeperiodwithin include the amount of the user’s last payment, the interval
three months, which means that if useri parks in the same between the user’s last two payments, the parking lot ID,
parking lot before or after three months compared to the coupon usage, and the parking time and date of the user’s
parkingtimeofuser j,wedonotcountthisrecordasaco- latest parking record. The feature xT becomes 10 dimen-
a
occurrence. We do not consider the factor of parking time sions, represented as xT , when it passes through the first
ga
because we already have a temporal connection graph for layerofGCNandbecomesfivedimensionsxT afterpass-
gga
it. For the threshold, we set it to be two to keep the con- ingthroughthesecondlayerofGCN.Differenttypesofuser
nection graphs dense and credible. Given the threshold γ, parkingrelationshipscanbemergedtogether.
if s i,j ≥ γ, an edge shall be built between user i and user Details.Whenconstructingthethreeconnectiongraphs,
j, as shown in Equation 4. By building this graph, we can we define the weights as “1/distance” between two users
capturethespatialrelationsbetweenusersthatthefirsttwo fortheuserprofileconnectiongraph.Forthetemporalcon-
association graphs ignore. In our experiments, we find that nection graph and spatial connection graph, we define the
thereare483,092userpairswithsimilarspatialparkingpat- weight as their co-occurrence times. Accordingly, we add
terns,andonaverage,eachuserinthesepairshassixparking the weights from temporal connection graph, spatial con-
records.Werandomlyselect600,000randomuserpairs,and nection graph, and profile contact graph together, and then
onaverage,eachrandomuserpairhas12parkingrecords. normalizetheweight.Inourmethod,weconsiderthesethree
graphsareofthesameimportance.Thus,wedonotchange
(cid:15) theweightofeachgraph.However,wefindthatadjustment
e i,j =
0
1,
, o
s i
t
,
h
j
e
≥
rw
γ
i
,
s
i
e
(cid:5)= j (4) o
W
n
e
t
c
h
o
e
n
w
du
e
c
ig
t
h
w
ts
ei
a
g
f
h
f
t
ec
a
t
d
s
ju
th
st
e
m
p
e
e
n
r
t
fo
to
rm
d
a
e
n
m
c
o
e
n
o
st
f
ra
th
te
e
t
fi
he
na
in
l
fl
m
u
o
e
d
n
e
c
l
e
.
of choosing different weight for each graph on the overall
ParametersettingHere,wesettheparameterγ thesame performance.WeshowtheweightadjustmentinFig.11.By
astheparameterγ intheparkingperiodpatterngraph.The default,theweightofeachgraphis1/3.Thexaxisrepresents
reasonsthatwedonotchangethewaywesetγ areasfollows. the weight of the corresponding graph w g . The weights of
theothertwographsareequallydivided.Whenweincrease
First, as we mentioned before, grid-search is an effective
ordecreasetheweightofacertaingraph,theweightsofthe
automaticmethodthatcanhelpustofindthesuitableparam-
othertwographswillalsodecreaseorincrease,andtheaccu-
eter.Second,inourobservation,theparkingspacesofmost
racyofthesystemwillalsochange.Throughexperiments,we
usersarestable,sotheco-occurrencevaluesoftwousersare
findthatthreegraphscontributeequallytotheoverallperfor-
smallinmostcases.Third,theprocessofsettingparameters
mance.Therefore,wethinkthattheyareequallyimportant.
canbeconsistent.
Weuseatwo-layerGCN,whichcanfullyutilizetherela-
In summary, we improve the significance of the users’
tionsbetweenneighborsefficiently.WechooseGCNbecause
characteristics by using their similarities in different cor-
itcancapturethenoderelationsingraphsviamessagepass-
relations, so that the users’ characteristics are more repre-
ingbetweenthenodes,whichisverysuitableforourparking
sentative. Through creating the co-occurrence matrix and
paymentapplicationscenarios.Indetail,inourparkingpay-
clustering,wecaptureusers’connectionsandbuilddifferent
mentbehavior analysis,wetreateachuserasanodeinthe
association graphs accordingly. Based on the three associ-
graphwhiletheirrelationsasedges.Furthermore,previous
ation graphs, we next construct the multi-dimensional user
works[26,40,53]similartothisproblemarealsohandledby
association graph. Similar ideas have also been applied in
GCNandcanachievegoodresults.Therefore,weuseGCN
otherdomains,suchas[73,77,90,97].
inpaymentbehaviorprediction.WealsocompareGCNwith
GraphfusionAfterobtainingtheuserassociationgraphs other methods such as CART, LSTM, and CNN, which is
from the three different dimensions, we next fuse the three detailedinSect.6.2.
associationgraphstobuildacompleteuserassociationgraph.
WeextendGCN,awidelyusedvariantofconvolutionalneu-
ral network, to process the graph data. First, we obtain the 5.4 LSTM-basedmodeling
nodelistandedgesfromthreeassociationgraphs.Second,we
traversetheedgesofthesegraphsandfusethethreegraphs, We propose an LSTM-based method in TR-GCN to model
asshowninFig.10.Weassumethatiftwousershaveanedge thetemporaldependenciesamongusers’historicaltransac-
123

1048 Q.Xuetal.
Fig.10 Graphfusionprocess.“A,”“B,”and“C”ontheleftsiderepresentdifferentclustersineachassociationgraph
| (a) |     |     | (b) |     |     | (c) |
| --- | --- | --- | --- | --- | --- | --- |
Fig.11 Accuracywithweightadjustment
tions,includinganLSTMlayerandafullyconnectedlayer. LSTM has been proven to be suitable for parking behav-
WithLSTM,TR-GCNcanlearnthepaymenthabitsfromthe ior prediction [2,80]. Based on these analyses, we believe
historyofusers,suchaswhethertheuserpreferstopayinthe thatLSTMissuitableforcapturingthetemporalrelationsin
morningorafternoon.Theplatformalsoprovideareminder parkingpaymentprediction.
servicedetailedinSect.6.3.Theremindershouldalsorespect Consid(cid:6)ering previous T step p(cid:7)ayment inputs of user i,
xt−T+1,xt−T+2,...,xt
suchhabitsandsendnotificationinthetimeperioduserspre- whichis ,wedenotethestatusof
|     |     |     |     |     | i   | i i |
| --- | --- | --- | --- | --- | --- | --- |
fertopay.
|     |     |     |     | useri attimestept-1andt       |     | asht−1andht,respectively.The |
| --- | --- | --- | --- | ----------------------------- | --- | ---------------------------- |
|     |     |     |     | temporaldependencybetweenht−1 |     | i i                          |
LSTMlayerWeuseLSTMtocapturethetemporalrela- andht canbemodeled
i i
| tions among | users’ | historical payment | records instead | of byEquation5. |     |     |
| ----------- | ------ | ------------------ | --------------- | --------------- | --- | --- |
simplyfusingthemforthreereasons.First,LSTMcancap-
|     |     |     |     | (cid:13)  | (cid:14) | (cid:16) |
| --- | --- | --- | --- | --------- | -------- | -------- |
|     |     |     |     | ht = 1−zt | ◦ht−1+zt | ◦h t     |
ture the temporal information from historical events. Since (5)
|          |             |                  |           | i                                                    | i i | i i |
| -------- | ----------- | ---------------- | --------- | ---------------------------------------------------- | --- | --- |
| LSTM has | a long-term | memory function, | which can | solve                                                |     |     |
|          |             |                  |           | tandh (cid:16) taredefinedinEquation6,whe(cid:17)reW |     |     |
theproblemofgradientdisappearanceorexplosionbygat- z ,W ,andW(cid:16) are
|     |     |     |     | i i |     | r z h |
| --- | --- | --- | --- | --- | --- | ----- |
ingmechanism,LSTMcanwellutilizethetemporalirregular paymentparameterslearntbyLSTM. representsthecon-
catenationoperation,and◦standsfortheHadamardproduct.
historicalpaymentdata.Second,LSTMisanonlinearneu-
ralnetwork,whichmeansthatitnotonlycapturesthedirect Then, the hidden payment state ht obtained from LSTM is
i
relationslinearmodelscanobtain,butalsodigsdeeperinto usedastheinputofournextfullyconnectedlayer.
| the hidden | relationship       | between payment | records, so | as to  |     |     |
| ---------- | ------------------ | --------------- | ----------- | ------ | --- | --- |
| improve    | the representation | of the selected | features.   | Third, |     |     |
123

| PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… |         |          |                 |     |     |     |                          |     |     |     |                    |     | 1049 |
| ------------------------------------------------------- | ------- | -------- | --------------- | --- | --- | --- | ------------------------ | --- | --- | --- | ------------------ | --- | ---- |
|                                                         | (cid:6) | (cid:19) | (cid:20)(cid:7) |     |     |     | imprecise.Incontrast,ifγ |     |     |     |                    |     |      |
| ⎧                                                       |         | (cid:17) |                 |     |     |     | and                      |     |     |     | istoohigh,thegraph |     | tobe |
t−1
⎪⎪⎪⎪⎨ z t =σ W h x t b u i lt w il l b e c om e t o o s p a r s e a n d w e c an n o t uti li z e al l u s ef u l
| i   |         | z i      | i               |     |     |     |     |     |     |     |     |     |     |
| --- | ------- | -------- | --------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | (cid:6) | (cid:19) | (cid:20)(cid:7) |     |     |     |     |     |     |     |     | γ   |     |
(cid:17) in f o rm a t io n . H en c e , w e s e t t h e r an ge o f f r om 0 t o 5 ( w e fi n d
| t   | = σ | t − 1 | t   |     |     |     |     |     |     |     |     |     |     |
| --- | --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
r W r h x (6) u s e r s r a r e t o h a v e c o n n e c t i o n s m o r e t h a n fi v e t i m e s ) . A f t e r
| ⎪⎪⎪⎪⎩ i |     | i                | i   |                          |     |     |     |     |     |     |     |     |     |
| ------- | --- | ---------------- | --- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|         |     | (cid:6) (cid:19) |     | (cid:17) (cid:20)(cid:7) |     |     |     |     | γ   |     |     |     |     |
(cid:16) − e x p l o r a t i on , w e s e t t o 2 t o b u i ld t h e p a r ki n g p e r i o d p a t t e r n
| h t | = tanh | W r t | ∗h t 1 | x t |     |     |     |     |     |     |     |     |     |
| --- | ------ | ----- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
i (cid:16) h i i i g r a p h a n d t h e s p a t i a l c o n n e c ti o n g r a p h . W e l e v e r a g e a t w o -
|     |     |     |     |     |     |     | layer GCN | due | to its effectiveness |     | in  | modeling | graph data. |
| --- | --- | --- | --- | --- | --- | --- | --------- | --- | -------------------- | --- | --- | -------- | ----------- |
FullyconnectedlayerToobtainbetterresults,weadopt ThedimensionofthefirstlayerofGCNisfixedto10,andthe
themethodofaddingafullyconnectedlayertocarryoutthe
|     |     |     |     |     |     |     | dimension | ofthesecond |     | layer | isfixed | to5.The | dimension |
| --- | --- | --- | --- | --- | --- | --- | --------- | ----------- | --- | ----- | ------- | ------- | --------- |
final classification. In this part, the input of the fully con- ofthehiddenlayerofLSTMissetto52,andthedimension
| nected | layer | is the three-dimensional |     | hidden | payment | state |     |     |     |     |     |     |     |
| ------ | ----- | ------------------------ | --- | ------ | ------- | ----- | --- | --- | --- | --- | --- | --- | --- |
oftheoutputlayerofLSTMissetto3.Atlast,weuseafully
ht
that we get from LSTM. To note that we do not add a connectedneuralnetworkwiththedimensionofthehidden
i
normalizationlayerbeforethefullyconnectedlayerandwe
layersetto5.
apply relu [56] as our activation layer because it can avoid TheaccuracyisdefinedinEq.7.Accordingto[62],TP
vanishinggradientproblems.Thereisonlyonehiddenlayer
denotesthenumberofcorrectlypredicteddelayedpayments,
in this part and the output is two-dimensional because we and TN denotesthenumberofcorrectlypredictedon-time
| needtogettheprobability.Similarideahasalsobeenused |     |     |     |     |     |     |           | FP  |         |            |     |        |              |
| -------------------------------------------------- | --- | --- | --- | --- | --- | --- | --------- | --- | ------- | ---------- | --- | ------ | ------------ |
|                                                    |     |     |     |     |     |     | payments. |     | denotes | the number | of  | orders | mispredicted |
byZhangetal.[80]. asdelayedpayment,and FN denotesthenumberoforders
Details. In our work, we use LSTM to integrate users’ mispredictedason-timepayment.
| historical | payment | information. |     | There are | many | kinds of |     |     |     |     |     |     |     |
| ---------- | ------- | ------------ | --- | --------- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- |
+TN
| temporal | neural    | networks, | such   | as TCN [37],       | RNN  | [49],   |          |     | TP  |     |     |     |     |
| -------- | --------- | --------- | ------ | ------------------ | ---- | ------- | -------- | --- | --- | --- | --- | --- | --- |
|          |           |           |        |                    |      |         | accuracy | =   |     |     |     |     | (7) |
|          |           |           |        |                    |      |         |          | FP  | +TP | +FN | +FP |     |     |
| and GRU  | [11].     | We choose |        | LSTM to process    | time | series  |          |     |     |     |     |     |     |
| data     | for three | reasons.  | First, | LSTM is a powerful |      | variant |          |     |     |     |     |     |     |
PlatformTR-GCNhasbeendeployedonanodewithIntel
ofRNNthatcanavoidseriousproblemslikevanishinggra-
|     |     |     |     |     |     |     | Core i7-10750H |     | CPU | equipped | with | a NVIDIA | GeForce |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | -------- | ---- | -------- | ------- |
dient.Second,LSTMprovidesusmorespaceforadjusting
RTX2070GPU.
parameters.Third,LSTMhasbeenprovedtobeaneffective
modelinsharedparkingbehaviorprediction[80].Basedon Dataset We collect the payment record from 50 park-
thesereasons,weuseLSTMinourworktointegrateusers’ ing lots in nine cities. We randomly show ten parking lots
information.Tofurtherextractthefeaturesforamoreprecise in Table 1. These parking lots have various surroundings,
predictionresult,weaddasingle-layerfullyconnectionnet- including hospitals, commercial streets, residential areas,
workaftertheLSTM.Inthefullyconnectedlayer,wesetthe and so on. The dataset spans 36 months, from October 20,
numberofneuronsinthehiddenlayertofivebyexperience.
2017,toOctober20,2020,withatotalof705,155payment
records.Afterdatacleaning,wehave655,008ordersintotal,
with451,474ordersbelongtothecaseofauserwithmore
6 Evaluation than10records.Thereare104,442usersinthedataset,with
|     |     |     |     |     |     |     | 10,144 | users have | more | than | 10 records. | For | each record, |
| --- | --- | --- | --- | --- | --- | --- | ------ | ---------- | ---- | ---- | ----------- | --- | ------------ |
In this section, we first introduce the experimental setup, theattributesweextractincludetheorderamount,thetime
includingourmethodologyanddataset.Second,weshowour intervalfromthepreviousorder(0ifthereisonlyoneorder),
evaluationresultswithdetailedanalysis.Third,weanalyze parkinglotID,couponusage,membership,anddate.Weuse
ourgraphfusionprocess. 20%ofourdatasetastestset,andtheremainingrecordsas
|     |     |     |     |     |     |     | the training | set. | For users | who | have | less than | 10 records, |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ---- | --------- | --- | ---- | --------- | ----------- |
6.1 Experimentalsetup westillusethetraditionalpredictionmethodsinceTR-GCN
reliesonhistoricalrecords.
MethodologyWeuseaccuracyastheevaluationmetricand
compareourTR-GCNwiththestate-of-the-artpaymentpre- 6.2 Predictionaccuracyevaluation
| diction | method | [74] | which | applies CART | model | [63] in |     |     |     |     |     |     |     |
| ------- | ------ | ---- | ----- | ------------ | ----- | ------- | --- | --- | --- | --- | --- | --- | --- |
parking payment prediction, and the LSTM model without AccuracyWeshowthepredictionaccuracyofthefiftypark-
hiddenuserrelationships. inglotsinFig.12,andwehavethefollowingobservations.
InTR-GCN,wesettheparametersmainlybasedongrid First,ourTR-GCNachievesthehighestaccuracyof91.2%,
search [38], which we find powerful in the parameter set- whichisabout7.1%higherthanthestate-of-the-artmethod
tings.Inbothtrainingandtestingcases, T valuesrepresent and4%higherthantheLSTMmethod.Second,ourmodel
differenttimestampsatdaygranularity.Astothethreshold performs well in all kinds of surroundings, which proves
γ,ifγ istoolow,theconnectionsbetweenusersareunstable the practicality of our model. TR-GCN performs the best
123

| 1050 |     |     |     |     |     |     |     |     |     |     |     | Q.Xuetal. |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
Table1 Parkinglotinformation
|     |     |     | ParkingLot |     | Record# |     | Surrounding |     |     |     |     | Location |
| --- | --- | --- | ---------- | --- | ------- | --- | ----------- | --- | --- | --- | --- | -------- |
(50parkinglotsintotal)
|     |     |     | P1  |     | 13446  |     | Business,residentialdistrict |     |     |     |     | CityA |
| --- | --- | --- | --- | --- | ------ | --- | ---------------------------- | --- | --- | --- | --- | ----- |
|     |     |     | P2  |     | 10122  |     | Business                     |     |     |     |     | CityB |
|     |     |     | P3  |     | 4872   |     | Business                     |     |     |     |     | CityB |
|     |     |     | P4  |     | 7990   |     | Business                     |     |     |     |     | CityC |
|     |     |     | P5  |     | 125409 |     | Second-handcarmall           |     |     |     |     | CityD |
|     |     |     | P6  |     | 19326  |     | Hospital                     |     |     |     |     | CityD |
|     |     |     | P7  |     | 38599  |     | Business                     |     |     |     |     | CityE |
|     |     |     | P8  |     | 90627  |     | Business,office              |     |     |     |     | CityE |
|     |     |     | P9  |     | 8374   |     | Business,office              |     |     |     |     | CityE |
|     |     |     | P10 |     | 11911  |     | Office                       |     |     |     |     | CityF |
|     |     |     | P11 |     | 9216   |     | Business                     |     |     |     |     | CityC |
|     |     |     | P12 |     | 18370  |     | Uptown                       |     |     |     |     | CityD |
|     |     |     | P13 |     | 1769   |     | Office                       |     |     |     |     | CityC |
|     |     |     | P14 |     | 9621   |     | Business                     |     |     |     |     | CityB |
|     |     |     | P15 |     | 11315  |     | Business                     |     |     |     |     | CityF |
|     |     |     | P16 |     | 9940   |     | Business                     |     |     |     |     | CityE |
|     |     |     | P17 |     | 8942   |     | Uptown                       |     |     |     |     | CityF |
|     |     |     | P18 |     | 36079  |     | Uptown                       |     |     |     |     | CityA |
|     |     |     | P19 |     | 13332  |     | Business                     |     |     |     |     | CityG |
|     |     |     | P20 |     | 40926  |     | Office                       |     |     |     |     | CityC |
|     |     |     | ... |     | ...    |     | ...                          |     |     |     |     | ...   |
100 CNN GCN LSTM TR-GCN Table2 Predictionanalysisofdifferentapproaches
|     | )%( ycarucca |     |     |     |     | Approach | Accuracy |     | F1  |     | Recall | Precision |
| --- | ------------ | --- | --- | --- | --- | -------- | -------- | --- | --- | --- | ------ | --------- |
90
|     |      |     |     |     |     | TR-GCN | 91.2% |     | 65.9% |     | 73.7% | 53.1% |
| --- | ---- | --- | --- | --- | --- | ------ | ----- | --- | ----- | --- | ----- | ----- |
|     | 80   |     |     |     |     | CNN    | 86.3% |     | 39.8% |     | 59.7% | 30.0% |
|     |      |     |     |     |     | CART   | 84.1% |     | 30.9% |     | 63.6% | 20.4% |
|     | 70   |     |     |     |     | LSTM   | 87.8% |     | 42.0% |     | 54.8% | 28.6% |
|     | 0 10 | 20  | 30  | 40  | 50  |        |       |     |       |     |       |       |
parking lot ID
Fig.12 Predictionaccuracy
PredictionanalysisWefurtheranalyzetheoverallindi-
|     |     |     |     |     |     | catorsinTable2.The |     | precisionisdefinedas“TP/(FP+ |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ------------------ | --- | ---------------------------- | --- | --- | --- | --- |
TP),”whichshowsthatTR-GCNcanbetteravoidmispre-
| in 40 | out of 50 parking   | lots. TR-GCN |     | performs | worse in      |                                                 |     |                            |     |     |     |     |
| ----- | ------------------- | ------------ | --- | -------- | ------------- | ----------------------------------------------- | --- | -------------------------- | --- | --- | --- | --- |
|       |                     |              |     |          |               | dictingon-timepaymentasdelayedpayment.Therecall |     |                            |     |     |     | is  |
| those | parking lots mainly | because      | of  | the data | distribution. |                                                 |     |                            |     |     |     |     |
|       |                     |              |     |          |               | definedas“TP/(FN                                |     | +TP),”whichshowsthatTR-GCN |     |     |     |     |
Forexample,inparkinglotP35,only35outof16,282orders
canbetteravoidmispredictingdelayedpaymentason-time
arelatepaymentorders.Thetwobaselinemodels,LSTMand
|     |     |     |     |     |     |     |     |     |     |     | × (precision | ×   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- |
CART,tend topredictallorders asin-timepayment, while payment. The F1 score is defined as “2
|     |     |     |     |     |     | recall)/(precision |     | +   | recall),” | which | shows | that TR- |
| --- | --- | --- | --- | --- | --- | ------------------ | --- | --- | --------- | ----- | ----- | -------- |
ourTR-GCNcandetectmoredelayedpayments.Third,com-
pared with the traditional method that depends on feature GCNachievessignificantadvantagesovercurrentstrategies.
|             |              |      |       |       |                | Moreover, | compared | with | the | baseline, | TR-GCN | does not |
| ----------- | ------------ | ---- | ----- | ----- | -------------- | --------- | -------- | ---- | --- | --------- | ------ | -------- |
| engineering | and the LSTM | that | needs | a lot | of users’ his- |           |          |      |     |           |        |          |
toricaldatafortraining,TR-GCNutilizesthevarioushidden need to carry out special feature engineering processing,
whichgreatlyincreasesitsadaptability.
relationsbetweenusers,whichgreatlyincreasesitsaccuracy.
Moreover,wemeasurethethroughputofTR-GCN.TR-GCN
|     |     |     |     |     |     | Precision | versus | accuracy |     | TR-GCN | achieves | a high |
| --- | --- | --- | --- | --- | --- | --------- | ------ | -------- | --- | ------ | -------- | ------ |
handles235orderspersecond,whichsatisfiesthecurrentsit-
accuracyscore,whichmeansthatourpredictionresultsare
uation.
accurateandprecise.However,accuracyrepresentsallcor-
|     |     |     |     |     |     | rectly predicted |       | samples. | Although | accuracy         |     | is commonly  |
| --- | --- | --- | --- | --- | --- | ---------------- | ----- | -------- | -------- | ---------------- | --- | ------------ |
|     |     |     |     |     |     | used, it cannot  | fully | meet     | all      | the requirements |     | of classifi- |
123

PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… 1051
(a) (b)
Fig.13 Averageaccuracy
cation tasks, especially when data are unbalanced. Hence, Table3 F1indifferentcities
we also analyze the results from the precision perspective.
Approach(#Records) CART LSTM CNN TR-GCN
Precisiondescribestheproportionoftruepositiveexamples
dividedbyallpositiveexamples,predictedbytheclassifier, A(887944) 31.4% 44.2% 58.0% 62.1%
thatis,theratioofaccuratepositiveexamplespredictedby B(44742) 36.9% 42.7% 40.5% 55.3%
theclassifier.Inourscenario,weregardthepositiveexamples C(73332) 32.8% 47.0% 49.8% 60.6%
asthedelayedpayments. D(37696) 32.2% 41.9% 53.7% 70.1%
Consideringtheunbalanceddata,weuseseveralmetrics E(184835) 26.1% 51.9% 68.6% 73.4%
includingaccuracy,F1,recall,andprecision,toevaluateour F(61572) 38.0% 45.1% 53.3% 59.6%
experimentalresults.AsshowninTable2,ourmethod,TR- G(204002) 25.5% 46.6% 60.5% 76.0%
GCN,achieves91.2%inaccuracywhiletheprecisionscore H(5908) 48.4% 38.2% 48.6% 56.2%
is 53.1%, which is relatively low. The reasons are as fol- I(5124) 52.9% 43.0% 50.8% 52.6%
lows.First,TR-GCNusesunbalanceddata,sotheprecision
resultcanbeinfluenced.Second,weaddweightadjustment
withupsampling,soTR-GCNtendstopredictmoreorders
asFP/(FP+TN).FP denotesthenumberofordersmis-
asdelayedpayments.Third,althoughtheprecisionresultis
predicted as delayed payment. TN denotes the number of
nothigh,weobtain73.7%recall,whichmeanswecanfind
correctly predicted on-time payments. We first analyze the
more than 70% of the delayed payments and is satisfying.
falsepositiverates(FPR)ofusersindifferenttypesofpark-
Notethatprecisionandrecallaretwooppositeindicators.
inglots,asshowninFig.14a.LSTMandCARTmodelstend
Detailed analysis We also exhibit the average accura- topredictallordersasbeingpaidontime,whileourTR-GCN
ciesofdifferenttypesofparkinglotsandcities,asshownin modelcandetectmoredelayedpaymentorders.Notethatthe
Fig.13.Weclassifyparkinglotsintothreemajorcategories falsepositiverateofTR-GCNwiththreeassociationgraphs
in Fig. 13 a. The office, business, and residence categories is lower than that with only one association graph (TRG-
include9,31,and10parkinglotsseparately.Wecanseethat temporal,TRG-portrait,andTRG-spatial),whichmeansthat
TR-GCNachievesclearadvantagesinallcases.Figure13b ourmethodobtainsmoreusefulinformationmakingthepre-
showstheaverageaccuraciesofdifferentcities,andTR-GCN diction more accurate. Then, we analyze the false positive
achieves the highest accuracy in all cities. For city I, it has ratesofusergroupswithmorethanandlessthantenpark-
onlyfiveparkinglotswith5,061recordsintotalspanningsix ing records, as shown in Fig. 14b. For users with less than
months,andtheconnectiongraphsarealsosparse,whichis ten orders, the false positive rate of TR-GCN is satisfying,
insufficientfortraining.Therefore,TR-GCNachievesminor which is 3.15%◦. For the user group with more than ten
advantageoverCART.WereportinTable3theF1scorein orders, TR-GCN achieves 12.4%◦ false positive rate. The
differentcities.FromTable3,wecanseethatinmostcities, reasonwhywemeasureFPRisthatinourparkingscenario,
TRGCN outperforms the other three models, but in cities the proportion of users who have delayed payment is very
withsmallnumberofordersandusers,ourmodelisaffected small,whichislessthan4.5%,andthedistributionofusers
bythesparsityofdata.However,withthegrowingnumber isunbalanced.Inthiscase,itisinappropriatetouseaccuracy
of users and orders in all cities, we believe that our model asthemainindicatoroftheevaluationmodel.Ontheother
cansatisfytheneedforallcities. hand,FPRfocusesonexaminingthenumberofsamplesthat
We also analyze the false positive rate in different user areincorrectlypredictedinnegativesamples.Therefore,as
groups,asshowninFig.14.Thefalsepositiverateisdefined acomprehensiveevaluationindicator,FPRcanbetterreflect
123

| 1052 |     |     |     |     |     |     |     |     |     | Q.Xuetal. |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- |
|      |     | (a) |     |     | (b) |     |     |     |     |           |
Fig.14 Falsepositiveratesindifferentusergroups
theabilityofmodelstoidentifyuserswhohavedelayedpay- ourpaymentremindingresultsfromNovember11,2020to
ments. Experiments in our paper show that the final FPR November 16, 2020, in Table 4. Approximately half of the
indexofTR-GCNreaches3.52%,whichismuchlowerthan delayedpaymentscanbepaidafterbeingreminded.Wehave
theFPRindexesoftheothermodels.Furthermore,thisresult thefollowingfindings.First,ifauserclicksonourpayment
showsthatourmodelhasalowprobabilityofhavingdispar- reminder,thentheuserisverylikelytopay(95.6%accuracy).
ityanddoesnothurtinterestsofcertaingroups.Accordingly, Second,thepaymentalsorelatestothedayoftheweek.For
itislesslikelytohave wrongpredictionsandlesslikelyto example, we send messages around nine on November 12
harm the interests of users that are wrongly predicted with and November 14, but the results vary greatly. The reason
delayedpayment. is that November 12 is Thursday; users could be working
andmissourmessage.November14isSaturdaysotheyare
|     |     |     |     |     | available | to pay. Third, | after | receiving | our reminder, | some |
| --- | --- | --- | --- | --- | --------- | -------------- | ----- | --------- | ------------- | ---- |
6.3TR-GCN-basedpaymentreminder
usersstillneedfourhourstodelaypayment.
ChallengesinreminderserviceProvidingreminderservice
|     |     |     |     |     | Payment | behavior | comparison |     | before | and after |
| --- | --- | --- | --- | --- | ------- | -------- | ---------- | --- | ------ | --------- |
involvesthreechallengestohandle.First,everyuserhasher
reminderWespecifythedistributionofusers’paymenttime
ownpaymenthabitsandneedstoberespected.Second,few
|     |     |     |     |     | longer than | one day | with and | without our | reminder | system |
| --- | --- | --- | --- | --- | ----------- | ------- | -------- | ----------- | -------- | ------ |
usershavemorethanthreeremindingrecords,whichmakes
|            |          |              |         |                   | in Fig. 15.  | Figure 15a | shows      | the distribution | before | using        |
| ---------- | -------- | ------------ | ------- | ----------------- | ------------ | ---------- | ---------- | ---------------- | ------ | ------------ |
| us lack of | training | data. Third, | payment | may be related to |              |            |            |                  |        |              |
|            |          |              |         |                   | our reminder | service    | while Fig. | 15b shows        | the    | distribution |
manyfactors,suchasthedayoftheweek.
afterusingTR-GCNreminder.Wecanseethattheproportion
Solution Our TR-GCN can solve the above challenges oftheuserswhopayformorethanfivedayshasdecreased
significantly,whichprovestheeffectivenessofTR-GCN.
andbeusedtoprovidepaymentreminderservice.Wedivide
users into different user groups. Users in each group have Indetail,beforeourreminderservice,thereareabout4%
|     |     |     |     |     | orders that | belong to | the late | payment. | We further | analyze |
| --- | --- | --- | --- | --- | ----------- | --------- | -------- | -------- | ---------- | ------- |
similarpaymenthabits,andweremindthemuniformly.For
users lacking records, we use rule-based methods to assist theselatepaymentorders.Amongtheseorders,40%orders
arepaidwithinonetothreedays,31%ordersarepaidwithin
| in reminder, | such | as reminding | users at their | average pay- |     |     |     |     |     |     |
| ------------ | ---- | ------------ | -------------- | ------------ | --- | --- | --- | --- | --- | --- |
menttime.Additionally,weproposesomerelevantfactorsby three to five days, and 29% orders are paid after five days,
|     |     |     |     |     | as illustrated | in Fig. | 15a. Among | these | orders, | 40% orders |
| --- | --- | --- | --- | --- | -------------- | ------- | ---------- | ----- | ------- | ---------- |
experience,includingweekdayandtime.Finally,weverify
themandinvolvethemtoourmodel.Wealsoneedtoconsider arepaidwithinonetothreedays,31%ordersarepaidwithin
|     |     |     |     |     | three to | five days, and | 29% orders | are | paid after | five days. |
| --- | --- | --- | --- | --- | -------- | -------------- | ---------- | --- | ---------- | ---------- |
thedatasecurityaswellasthetrainingefficiency,giventhat
|     |     |     |     |     | Incontrasttotheoriginalpayment |     |     | distribution,Figure15b |     |     |
| --- | --- | --- | --- | --- | ------------------------------ | --- | --- | ---------------------- | --- | --- |
thesystemneedstobeplacedinthecloud[51,52,79,82,84].
showsthebenefitsofourreminderservice.Theordersthat
Effectiveness 4.43% users have delayed payment more belongtolatepaymentarereducedtoaround2.5%afterwe
thanthreedays,andTR-GCNremindermakes63.1%ofthese apply our reminder system. Specifically, we can see from
users pay within a day. Previously, 3.83% users have late Fig.15bthatthenumberofordersthatarepaidwithinone
paymentmorethanfivedays,andTR-GCNreminderreduces tofivedaysincreases,andthenumberofordersthatarepaid
thisratioby13.8%to3.32%.Moreover,2.9%usershavelate morethanfivedaysdecreases.Additionally,45%ordersare
paymentmorethanaweek,andTR-GCNremindercanmake paidwithinonetothreedays,and33%ordersarepaidwithin
more than half of these users pay. Accordingly, TR-GCN three to five days. Hence, the orders that are paid for more
canhelptheseusersestablishgoodpaymenthabitsandhelp thanfivedaysdecreaseto21%.Toconclude,thetotalnumber
| the intelligent |     | platform recover | 1.9% profit | loss. We show |     |     |     |     |     |     |
| --------------- | --- | ---------------- | ----------- | ------------- | --- | --- | --- | --- | --- | --- |
123

| PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… |     |     |     |     |     |     |     | 1053 |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---- |
Table4 Effectivenessofpaymentreminder
Date Sendingtime #Sendingorders #Userclicks #Payments Timerange Paymentrate(%)
| 2020-11-11 | 12:23 | 84  | 52  |     | 50  | 12:23∼14:49 | 57.14 |     |
| ---------- | ----- | --- | --- | --- | --- | ----------- | ----- | --- |
| 2020-11-12 | 9:00  | 252 | 118 |     | 116 | 9:23∼10:42  | 22.22 |     |
| 2020-11-13 | 12:50 | 98  | 62  |     | 69  | 12:50∼13:49 | 55.10 |     |
9:21∼13:41
| 2020-11-14 | 9:21  | 116 | 82  |     | 92  |             | 65.52 |     |
| ---------- | ----- | --- | --- | --- | --- | ----------- | ----- | --- |
| 2020-11-15 | 14:49 | 414 | 127 |     | 106 | 14:49∼16:47 | 27.78 |     |
13:36∼15:58
| 2020-11-16 | 13:36 | 125 | 83  |     | 60  |     | 54.40 |     |
| ---------- | ----- | --- | --- | --- | --- | --- | ----- | --- |
| ...        | ...   | ... | ... |     | ... | ... | ...   |     |
Second,wecanseefromFig.17bthatfordifferentpark-
|     |     |     |     | ing lots, | the unpaid rate | is increasing year | by year, | and the |
| --- | --- | --- | --- | --------- | --------------- | ------------------ | -------- | ------- |
differencebetweenparkinglotsisrelativelylarge.Forexam-
|     |     |     |     | ple,forparkinglot                                    | P1,theunpaidratein2020evenexceeds |     |                |     |
| --- | --- | --- | --- | ---------------------------------------------------- | --------------------------------- | --- | -------------- | --- |
|     |     |     |     | 10%,whichseriouslyaffectstheprofitof                 |                                   |     | P1.Third,wecan |     |
| (a) |     | (b) |     | seethatcurrently,theoverallunpaidrateisnothigh,butwe |                                   |     |                |     |
shouldnotignoresuchrisingtrends.Consequently,predict-
Fig.15 Userdistributioninlatepaymentsofdifferentperiodsbefore
ingcustomers’paymentbehaviorandmakingcorresponding
andafterreminder
remindersareofgreatsignificance.
| of late payment | orders decreases. | Our reminder | system is | 6.4 Discussion |     |     |     |     |
| --------------- | ----------------- | ------------ | --------- | -------------- | --- | --- | --- | --- |
effectiveforuserswhoforgettopayforalongtime.
Inthispart,wesummarizeourcontributionsanddiscussthe
| Comparison | with rule-based | reminder | We compare |     |     |     |     |     |
| ---------- | --------------- | -------- | ---------- | --- | --- | --- | --- | --- |
biasedissuesandtheapplicabilitytootherscenarios.
| our TR-GCN-based | reminder | to the baseline | of rule-based |     |     |     |     |     |
| ---------------- | -------- | --------------- | ------------- | --- | --- | --- | --- | --- |
method, which was used by the parking platform before. SummaryoffindingsTobettersummarizeourcontribu-
In addition, we also add a simpler LSTM-based neural tionsandtheeffectivenessofourmodel,welistourfindings
method for comparison. The baseline reminds users when learntfromourexperiments.
their unpaid time exceeds the average payment time. The First,ourmodelisabletominehiddeninformationamong
LSTM-basedmethodutilizesLSTMtopredictareminding users,andoutperformsthestate-of-the-artmethod[74].Due
time. However, this method cannot utilize the hidden rela- todataimbalance,weapplyfourdifferentmetricstoevaluate
tionshipsandthusitspaymentrateisnotashighasthatofthe ourpredictionresults.Overall,ourmodelachievesthebest
| proposedTR-GCNmethod.Theplatformadjuststhethresh- |     |     |     | result. |     |     |     |     |
| ------------------------------------------------- | --- | --- | --- | ------- | --- | --- | --- | --- |
old every three months. We show the comparison results Second,ourGCNformodelinghiddenrelationsplaysan
betweenTR-GCNandthebaselinesinFig.16.Fig.16ashows important role in payment prediction. To verify the effec-
thecomparisonofpaymentratesindifferentcities.Onaver- tivenessofGCNindelayedpayment,weevaluatethemodel
age, TR-GCN outperforms the rule-based method by 18%. withGCNremovedforcomparison.Table2showsthatwith-
Fig.16bshowsthecomparisonofpaymentratesindifferent outGCN,onlyLSTMcannotobtainsatisfactoryresults.We
types of parking lots. TR-GCN outperforms the rule-based believethatotherhiddeninformationcanfurtherimprovethe
methodby14.3%onaverageandoutperformsLSTM-based accuracyofpaymentprediction,whichweleavetoexplore
| methodby11%onaverage.Figure16cshowsthepayment |     |     |     | inthefuture. |     |     |     |     |
| --------------------------------------------- | --- | --- | --- | ------------ | --- | --- | --- | --- |
rates using different methods in 50 parking lots. TR-GCN Third, TR-GCN not only predicts the delayed payments
achievesthebestpaymentratesin44outof50parkinglots. but also provides reminder service afterward. TR-GCN
Therefore,TR-GCNisaneffectivemethodthatcanbeused greatlysavestheincomelossofthesharedparkingplatform
inparkingpaymentremindersystems. andhelpsuserstobuildbetterpaymenthabits.
SocialimpactWeusethefirsttenparkinglotstodemon- Biased issue Among the parking records, in-time pay-
stratethesocialimpactontrendsandunpaidratesinFig.17. ments account for the majority of the records. To identify
First, we can see from Fig. 17a that the number of orders the delayed payments, we have explored several possible
increases dramatically every year, but the unpaid rate also solutions, such as upsampling and downsampling [22]. In
showsanincreasingtrend. ourwork,wecombineresamplingandweightadjustmentto
123

1054 Q.Xuetal.
(a) (b) (c)
Fig.16 Paymentratecomparison
(a) (b)
Fig.17 Socialimpactontrendsandunpaidrates.P1,P2,P5,andP7arebuiltin2019.P3andP4arebuiltin2018.P6isbuiltin2017.P8,P9,and
P10arebuiltin2020
solve the biased data issue. We use upsampling instead of
downsampling because it can utilize more data so that our
modelcanbemorepreciseandrepresentative.First,wecre-
ate a dictionary that records data from all users, including
theirfeaturesandthepaymentresult.Second,foreachuser,
werandomlyselectoneoftheuser’sdelayedrecordsasthe
upsamplingdata.Third,weinserttheupsamplingdatainto (a) (b)
theuser’srecordsequence.Ifthedelayedpaymentsconsist
of 30% of the user’s records, we stop the upsampling pro- Fig.18 Illustrationfordynamicclusteringresults
cess.Wedonotgeneratetoomanydelayedrecordsbecause
thiswilldegradeourmodel’sabilitytopredictin-timepay-
ments. Additionally, we add weight adjustment to further whileFig.18b shows the clusteringresultonSeptember 1,
improveTR-GCN’sperformance.Wesetthelossweightof 2020. We can see that the proportion of the three types of
mispredictedin-timepaymentsas1.5,whilethelossweight usershaschangedsignificantly.OurLSTMmodulecancap-
ofmispredicteddelayedpaymentsas1. turethecharacteristicsofsuchchanges.
Visualization The user relation graphs are changing Applicability to other scenarios Our model can be
dynamically. To visualize this changing process, we use t- appliedtoothersimilarparkingproblems.Forexample,our
SNE plot [45], which utilizes PCA [57] and KLD [36], to methodcanbeusedinissuanceofcouponsforsharedparking
reducethefourdimensionstotwodimensions,asshownin lots.TR-GCNsuccessfullydiscovershiddenrelationsamong
Fig.18. users and builds association graphs without the personal
We can see that our clustering method successfully par- information of users. With the hidden relationship mining
titions the users into different groups. Moreover, the user in TR-GCN, we can identify the users with more parking
relation graphs are changing dynamically. For example, choices, and then we can distribute coupons to these users
Fig. 18a shows the clustering result on September 1, 2019, toincreasetheirfavorability.Otherfactors,suchasweather
information,canalsobeintegratedintothesystem.
123

| PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… |     |     |     |     |     |     |     |     |     |     |     |     |     | 1055 |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
95
NotethatTR-GCNisnotsuitableforhigh-riskdomains
sincemodelsneedtobeinterpretableinthesescenarios.Ina
)%( ycarucca
| high-risk                                               | scenario, | in which   | a positive |         | classification |     | means    | 90  |     |     |     |     |     |     |
| ------------------------------------------------------- | --------- | ---------- | ---------- | ------- | -------------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
| that access                                             | to        | a resource | will be    | denied, | incorrect      |     | positive |     |     |     |     |     |     |     |
| classificationscanhurtusers,whileincorrectnegativeclas- |           |            |            |         |                |     |          | 85  |     |     |     |     |     |     |
sificationscanhurttheserviceprovider’sbusinessobjectives.
Regardingtheinterpretability,wehaveexploredothermod-
80
| els with | better         | interpretability, |          | such     | as CART | (baseline). |       |           |                 |         |       |               |       |       |
| -------- | -------------- | ----------------- | -------- | -------- | ------- | ----------- | ----- | --------- | --------------- | ------- | ----- | ------------- | ----- | ----- |
|          |                |                   |          |          |         |             |       | (0.5,0.5) | (0.5,1) (0.5,2) | (1,0.5) | (1,1) | (1,2) (2,0.5) | (2,1) | (2,2) |
| However, | the prediction |                   | accuracy | of these | models  | is          | lower |           |                 |         |       |               |       |       |
thanthatofTR-GCN.Hence,weregardTR-GCNasagood
(threshold1, threshold2)
choiceintheparkinglotscenario,whichisnothigh-stake.
For the limitations of the analysis, although the number Fig.19 Relationbetweenthresholdandaccuracy
| of features | in  | our model | is limited, |     | we propose | a   | simple |          |            |       |               |     |                |     |
| ----------- | --- | --------- | ----------- | --- | ---------- | --- | ------ | -------- | ---------- | ----- | ------------- | --- | -------------- | --- |
|             |     |           |             |     |            |     |        | est work | to ours is | [74], | which applied | a   | simple machine |     |
buteffectivesolutiontoextractthehiddenrelationships.The
learningmethod,LSTM,topredictlatepayments.Ourwork
modelcansuccessfullyhandletheinputofuserswithlesshis-
|               |          |        |           |             |        |            |         | differs from | [74] in   | many       | aspects. | First, Xu | et al.   | [74] did |
| ------------- | -------- | ------ | --------- | ----------- | ------ | ---------- | ------- | ------------ | --------- | ---------- | -------- | --------- | -------- | -------- |
| torical data. | Although | adding | other     | demographic |        | attributes |         |              |           |            |          |           |          |          |
|               |          |        |           |             |        |            |         | not solve    | the three | challenges | we       | mentioned | in Sect. | 4.2:     |
| can further   | extract  | hidden | relations | to          | reduce | FPR,       | we find |              |           |            |          |           |          |          |
thevolumechallenge,thevarietychallenge,andthetiming
thatthecurrentsolutioncanalreadygeneratequalifiedresults
that meet the requirements. Therefore, we leave the explo- challenge.Theyonlyusedasmallamountofdata,andfailed
toconsidertimingissuesandheavilyreliedonfeatureengi-
rationfortheotherdemographicattributesinthefuture.
neering.Incontrast,ourworkusesalargeamountofdataand
MaximumprocessingcapacityWeperformasimulation managestostoreandreadparkingrecordsefficiently.Inaddi-
toconfirmthemaximumthroughputofoursystem.Weletthe tion,weabstracttheassociationgraphsbetweenusersfrom
systemprocessmillionsofordersdirectlyfrommemoryfor threehiddendimensionsaswellasconsideringthehistorical
pressuretesting,andfindthatitcanprocess720,349orders information.Oursystemcanalsobeappliedtoothersimilar
perminute,whichismuchhigherthanthecurrentdataflow problems,suchaspaymentpredictionforsharedbicycles.
inpeakhours.Accordingly,oursystemstillcanbeefficient
GraphstructureddatamodelingWeuseGCNtoopti-
asthescaleofworkloadgrows.Moreover,itcanbefurther
acceleratedbyotheroptimizationssuchas[79,83]. mize feature vectors due to its applicability and efficiency.
|     |     |     |     |     |     |     |     | Previous | works [26,27,40,53,71] |     |     | often extract | user | con- |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ---------------------- | --- | --- | ------------- | ---- | ---- |
Threshold setting for temporal connection graph In nections by using their personal information like friend
Sect. 5.3, we mention the thresholds for lockdown time relationships or contact information. Jiang et al. [27] used
(threshold1)andparkingduration(threshold2).Wedemon- graphical convolutional reinforcement learning to address
stratetheimpactofdifferentthresholdvaluesintheFig.19. the difficulty of rapidly changing relationships in a multi-
We evaluate nine different combinations of threshold1 and agent environment. Xiong et al. [71] developed a new
threshold2,withboththreshold1andthreshold2rangefrom reinforcement learning framework for learning multi-hop
0.5to2.Ifboththreshold1andthreshold2aresmall,suchas relational paths. Additionally, many works used GCN and
(0.5,0.5),wefindthatthiscombinationcanincurthelowest othervariantsofgraphneuralnetworksfordifferentpredic-
accuracy.Thereasonisthattheconnectiongraphissosparse tionscenarios[26,40,53].
| and we | can hardly | obtain | useful | information |     | from the | con- |     |     |     |     |     |     |     |
| ------ | ---------- | ------ | ------ | ----------- | --- | -------- | ---- | --- | --- | --- | --- | --- | --- | --- |
nectiongraph.However,whenthethresholdsarebothlarge, UserbehaviormodelingandfeatureembeddingThere
aremanyworksaboutrelationmodelingandfeatureembed-
| such as | (2, 2), | the accuracy | is  | also low. | The | reason | is that |     |     |     |     |     |     |     |
| ------- | ------- | ------------ | --- | --------- | --- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- |
the scope of the time period is too large, and the extracted ding [7,20,23,46,54,67,94]. Guo et al. [23] proposed a
|               |     |           |       |        |     |         |        | solution | for vehicle | routing | based | on context | and | routing |
| ------------- | --- | --------- | ----- | ------ | --- | ------- | ------ | -------- | ----------- | ------- | ----- | ---------- | --- | ------- |
| relationships | can | no longer | hold. | Hence, | we  | set (1, | 2) for |          |             |         |       |            |     |         |
threshold1andthreshold2. preferences.Pauletal.[54]extendedtheconceptofseman-
ticembeddingofPOIS(pointsofinterest)Magdyetal.[46]
appliedautomatedmachinelearningtechniquestodesigna
7 Relatedwork simpleandefficientcache-basednegativesamplingmethod,
NSCaching.Zhouetal.[94]usedthecontextofsocialusers
Parkingpaymentpredictionhasbecomeahotresearchtopic forvideorecommendationsbasedoncontentandsocialrela-
| inrecentdays[6,19,30,74,80].Toourknowledge,thisisthe |     |     |     |     |     |     |     | tionships. |     |     |     |     |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- |
first work to mine user hidden connections in shared park- TimeseriesmodelingManystudiesleveragetimeseries
ing payment prediction under the circumstance of lacking dataforprediction[12,16,18,28,39,41,95].Lietal.[41]intro-
users’personalinformationduetoprivacyissues.Theclos- ducedtheDCRNN(DiffusionConvolutionRecurrentNeural
123

| 1056 |     |     |     |     |     |     |     |     |     |     |     | Q.Xuetal. |     |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- |
Network),whichcapturesspatialdependenceandtemporal 5. Bergstra,J.,Bengio,Y.:Randomsearchforhyper-parameteropti-
dependence. Donkers et al. [16] extended the RNN so that mization.J.MachLearn.Res.13(2),(2012)
|     |     |     |     |     |     |     | 6. Chen,C.,Chiang,R.,Wu,T.,Chu,H.:Acombinedmining-based |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
theextendedRNNbetteradaptstothetaskofrecommenda-
frameworkforpredictingtelecommunicationscustomerpayment
tionsystems.Cinietal.[12]appliedRNNtohigh-precision
behaviors.ExpertSystemsAppl.(2013)
electricitydemandforecasting,whichisoneofthemainchal- 7. Chen,L.,Koutris,P.,Kumar,A.:Towardsmodel-basedpricingfor
lenges for smart grids. Farha et al. [18] used a TCN-based machinelearninginadatamarketplace.In:InternationalConfer-
enceonManagementofData,(2019)
| model to | classify | video | frames. Zhu | et al. | [95] proposed | a   |                                                              |     |     |     |     |     |     |
| -------- | -------- | ----- | ----------- | ------ | ------------- | --- | ------------------------------------------------------------ | --- | --- | --- | --- | --- | --- |
|          |          |       |             |        |               |     | 8. Chen,Y.-L.,Kuo,M.-H.,Wu,S.-Y.,Tang,K.:Discoveringrecency, |     |     |     |     |     |     |
spatial-temporalconvolutionalnetworkfordetectinghuman
|     |     |     |     |     |     |     | frequency, | and monetary | (RFM) | sequential | patterns | from | cus- |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------------ | ----- | ---------- | -------- | ---- | ---- |
actionboundaries.Lietal.[39]proposedasystemthatlever- tomers’purchasingdata.Electron.CommerceRes.Appl.,(2009)
ageshistoricaltrajectorytopredictthebestrouteontimeto 9. Cho,Y.S.,Moon,S.C.,Noh,S.C.,Ryu,K.H.:Implementationof
PersonalizedrecommendationSystemusingk-meansClusteringof
minimizeon-roadtime.
ItemCategorybasedonRFM.In:IEEEInternationalConference
onManagementofInnovation&Technology,(2012)
|     |     |     |     |     |     |     | 10. Chu,K.-F.,Lam,A.Y.,Loo,B.P.,Li,V.O.:PublicTransportWait- |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------------ | --- | --- | --- | --- | --- | --- |
8 Conclusion
ingTimeEstimationUsingSemi-SupervisedGraphConvolutional
Networks.InIEEEIntelligentTransportationSystemsConference,
| Inthispaper,wepresentTR-GCN,whichisatemporalrela- |               |     |         |             |            |     | (2019)                                                        |     |     |     |     |     |     |
| ------------------------------------------------- | ------------- | --- | ------- | ----------- | ---------- | --- | ------------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|                                                   |               |     |         |             |            |     | 11. Chung,J.,Gulcehre,C.,Cho,K.,Bengio,Y.:Empiricalevaluation |     |     |     |     |     |     |
| tional graph                                      | convolutional |     | network | for payment | prediction |     |                                                               |     |     |     |     |     |     |
ofgatedrecurrentneuralnetworksonsequencemodeling.arXiv
| on shared | parking | lots. | We first propose | a   | novel approach |     |     |     |     |     |     |     |     |
| --------- | ------- | ----- | ---------------- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- |
preprintarXiv:1412.3555,(2014)
tocapturethemulti-dimensionalrelationsbetweenusersto 12. Cini,A.,Lukovic,S.,Alippi,C.:Cluster-basedAggregateLoad
constructuserrelationalgraphsaccordingtouserbehaviors. Forecasting with Deep Neural Networks. In: 2020 International
JointConferenceonNeuralNetworks(IJCNN),(2020)
Second,weconstructaneuron-basedmodelwithGCNand
|     |     |     |     |     |     |     | 13. DalPozzolo,A.,Boracchi,G.,Caelen,O.,Alippi,C.,Bontempi, |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
LSTMtolearnusers’hiddenrelationships.Third,TR-GCN
G.:Creditcardfrauddetection:arealisticmodelingandanovel
has been integrated into a real intelligent parking system. learningstrategy.IEEEtransactionsonneuralnetworksandlearn-
WeinputallhistoricalrecordsinTR-GCNfortrainingand ingsystems,(2017)
|     |     |     |     |     |     |     | 14. Dolatshah, | M.: Cleaning | crowdsourced |     | labels using | oracles | for |
| --- | --- | --- | --- | --- | --- | --- | -------------- | ------------ | ------------ | --- | ------------ | ------- | --- |
providepaymentreminderservice.
statisticalclassification.PhDthesis,AppliedSciences:Schoolof
Experimentsbasedon655thousandrealpaymentrecords
ComputingScience,(2018)
show that from 50 intelligent shared parking lots, our TR- 15. Dong,G.,Liu,H.:Featureengineeringformachinelearningand
GCNachieves91.2%predictionaccuracy,whichisabout7% dataanalytics.CRCPress,NY(2018)
|             |     |                  |         |           |     |         | 16. Donkers,T.,Loepp,B.,Ziegler,J.:Sequentialuser-basedrecurrent |     |     |     |     |     |     |
| ----------- | --- | ---------------- | ------- | --------- | --- | ------- | ---------------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| higher than | the | state-of-the-art | method. | Moreover, |     | the TR- |                                                                  |     |     |     |     |     |     |
neuralnetworkrecommendations.In:ProceedingsoftheEleventh
GCN-basedpaymentreminderservicegenerateslargesocial
ACMConferenceonRecommenderSystems,(2017)
impactbyhelpingusersestablishgoodpaymenthabitsand 17. Fan, W., Xu, J., Wu, Y., Yu, W., Jiang, J.: GRAPE: Paralleliz-
reducinglossesforparkingplatforms. ingsequentialgraphcomputations.In:ProceedingsoftheVLDB
Endowment,(2017)
|                  |     |      |                   |     |              |     | 18. Farha,Y.A.,Gall,J.:Ms-tcn:Multi-stagetemporalconvolutional |     |     |     |     |     |     |
| ---------------- | --- | ---- | ----------------- | --- | ------------ | --- | -------------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
| Acknowledgements |     | This | work is supported | by  | the National | Key |                                                                |     |     |     |     |     |     |
networkforactionsegmentation.In:ProceedingsoftheIEEE/CVF
| R&D Program | of  | China (2020AAA0105200), |     | National | Natural | Sci- |     |     |     |     |     |     |     |
| ----------- | --- | ----------------------- | --- | -------- | ------- | ---- | --- | --- | --- | --- | --- | --- | --- |
ConferenceonComputerVisionandPatternRecognition,(2019)
enceFoundationofChina(No.61732014,62172419,U20A20226,and
|     |     |     |     |     |     |     | 19. Feng,N.,Zhang,F.,Lin,J.,Zhai,J.,Du,X.:StatisticalAnalysis |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
61802412),TsinghuaUniversityInitiativeScientificResearchProgram
andPredictionofParkingBehavior.In:IFIPInternationalConfer-
(20191080594),andGHfundA(No.20210701).Thisworkisalsospon-
enceonNetworkandParallelComputing,pages93–104.Springer,
soredbyCCF-TencentOpenResearchFund.Bingsheng’sworkisinpart
(2019)
supportedbyaresearchprojectgrantunderNUSCentreforTrusted
|     |     |     |     |     |     |     | 20. Gao,J.,Chen,J.,Li,Z.,Zhang,J.:ICS-GNN:lightweightinterac- |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
InternetandCommunity.FengZhangisthecorrespondingauthorof
tivecommunitysearchviagraphneuralnetwork.PVLDB,(2021)
thispaper.
|     |     |     |     |     |     |     | 21. Gers, | F. A., Schmidhuber, | J., | Cummins, | F.: Learning | to  | forget: |
| --- | --- | --- | --- | --- | --- | --- | --------- | ------------------- | --- | -------- | ------------ | --- | ------- |
ContinualpredictionwithLSTM.NeuralComput.12(10),2451–
| References |     |     |     |     |     |     | 2471(2000)                                                  |     |     |     |     |     |     |
| ---------- | --- | --- | --- | --- | --- | --- | ----------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|            |     |     |     |     |     |     | 22. Gopinath,R.A.,Burrus,C.S.:Onupsampling,downsampling,and |     |     |     |     |     |     |
rationalsamplingratefilterbanks.IEEETransactionsonSignal
Processing,(1994)
| 1. Azayite, | F. Z., | Achchab, | S.: The impact | of payment |     | delays on |                                                             |     |     |     |     |     |     |
| ----------- | ------ | -------- | -------------- | ---------- | --- | --------- | ----------------------------------------------------------- | --- | --- | --- | --- | --- | --- |
|             |        |          |                |            |     |           | 23. Guo,C.,Yang,B.,Hu,J.,Jensen,C.S.,Chen,L.:Context-aware, |     |     |     |     |     |     |
bankruptcyprediction:Acomparativeanalysisofvariablesselec-
|     |     |     |     |     |     |     | preference-based | vehicle | routing. | VLDB | J. 29(5), | 1149–1170 |     |
| --- | --- | --- | --- | --- | --- | --- | ---------------- | ------- | -------- | ---- | --------- | --------- | --- |
tionmodelsandneuralnetworks.In:InternationalConferenceof
| CloudComputingTechnologiesandApplications,(2017) |     |     |     |     |     |     | (2020) |     |     |     |     |     |     |
| ------------------------------------------------ | --- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | --- | --- |
2. Babaev, D., Savchenko, M., Tuzhilin, A., Umerenkov, D.: ET- 24. Han,S.,Kang,J.,Mao,H.,Hu,Y.,Li,X.,Li,Y.,Xie,D.,Luo,
RNN: Applying Deep Learning to Credit Loan Applications. In H., Yao, S., Wang, Y., et al.: Ese: Efficient speech recognition
SIGKDD,(2019) enginewithsparseLSTMonFPGA.In:Proceedingsofthe2017
3. Barceló,P.,Kostylev,E.V.,Monet,M.,Pérez,J.,Reutter,J.L., ACM/SIGDA International Symposium on Field-Programmable
| Silva,J.-P.:Theexpressivepowerofgraphneuralnetworksasa |     |     |     |     |     |     | GateArrays,(2017) |     |     |     |     |     |     |
| ------------------------------------------------------ | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- |
querylanguage.SIGMODRec,(2020) 25. Hovanesyan,A.:Latepaymentpredictionofinvoicesthroughgraph
4. Bergman, M., Milo, T., Novgorodov, S., Tan, W.-C.: Query- features.Masterthesis,TDelftUniversityofTechnology,(2019)
orienteddatacleaningwithoracles.InSIGMOD,(2015)
123

PaymentbehaviorpredictiononsharedparkinglotswithTR-GCN… 1057
26. Huang,Z.,Li,X.,Ye,Y.,Ng,M.K.:MR-GCN:Multi-Relational ofSquaredError(SSE)optimizedbyusingtheElbowMethod.In:
GraphConvolutionalNetworksbasedonGeneralizedTensorProd- JournalofPhysics:ConferenceSeries,(2019)
uct.InIJCAI,(2020) 51. Pan,Z.,Zhang,F.,Li,H.,Zhang,C.,Du,X.,Deng,D.:G-SLIDE:
27. Jiang, J., Dun, C., Huang, T., Lu, Z.: Graph convolutional rein- AGPU-BasedSub-LinearDeepLearningEngineviaLSHSparsi-
forcementlearning.arXivpreprintarXiv:1810.09202,(2018) fication.IEEETPDS,(2021)
28. Jin,Y.,Guo,W.,Zhang,Y.:Atime-awaredynamicservicequality 52. Pan, Z., Zhang, F., Zhou, Y., Zhai, J., Shen, X., Mutlu, O., Du,
prediction approach for services. Tsinghua Sci. Technol. 25(2), X.:Exploringdataanalyticswithoutdecompressiononembedded
227–238(2019) GPUsystems.IEEETPDS33(7),1553–1568(2021)
29. Jou,R.-C.,Chiou,Y.-C.,Ke,J.-C.:Impactsofimpressionchanges 53. A.Pareja,G.Domeniconi,J.Chen,T.Ma,T.Suzumura,H.Kaneza-
onfreewaydriverintentiontoadoptelectronictollcollectionser- shi, T. Kaler, T. B. Schardl, and C. E. Leiserson. EvolveGCN:
vice.Transp.Res.PartCEmerg.Technol.,(2011) EvolvingGraphConvolutionalNetworksforDynamicGraphs.In
30. Kim,J.,Kang,P.:Latepaymentpredictionmodelsforfairalloca- AAAI,(2020)
tionofcustomercontactliststocallcenteragents.Decis.Support 54. Paul,D.,Li,F.,Phillips,J.M.:Semanticembeddingforregionsof
Syst.85,84–101(2016) interest.TheVLDBJ.,(2021)
31. Kim,J.-Y.,Cho,S.-B.:Predictingrepaymentofborrowsinpeer-to- 55. Pfohl,H.-C.,Gomm,M.:Supplychainfinance:optimizingfinan-
peersociallendingwithdeepdenseconvolutionalnetwork.Expert cialflowsinsupplychains.Logisti.Res.1(3-4),149–161(2009)
Syst.36(4),e12403(2019) 56. Ramachandran,P.,Zoph,B.,Le,Q.V.:Searchingforactivation
32. Kipf,T.N.,Welling,M.:Semi-supervisedclassificationwithgraph functions.arXivpreprintarXiv:1710.05941,(2017)
convolutionalnetworks.arXivpreprintarXiv:1609.02907,(2016) 57. Ringnér, M.: What is principal component analysis? Nature
33. Krishna, K., Murty, M. N.: Genetic K-means algorithm. IEEE Biotechnology,(2008)
TransactionsonSystems,Man,andCybernetics,PartB(Cyber- 58. Salha,G.,Hennequin,R.,Vazirgiannis,M.:Keepitsimple:Graph
netics),(1999) autoencoderswithoutgraphconvolutionalnetworks.arXivpreprint
34. Krishnan, S., Wang, J., Wu, E., Franklin, M. J., Goldberg, K.: arXiv:1910.00942,(2019)
Activeclean: Interactive data cleaning for statistical modeling. 59. Schlichtkrull,M.,Kipf,T.N.,Bloem,P.,VanDenBerg,R.,Titov,
PVLDB,(2016) I.,Welling,M.:Modelingrelationaldatawithgraphconvolutional
35. Krizhevsky,A.,Sutskever,I.,Hinton,G.E.:Imagenetclassification networks.In:EuropeanSemanticWebConference,(2018)
withdeepconvolutionalneuralnetworks.In:Advancesinneural 60. Sikka, N., Vila, C., Stratton, M., Ghassemi, M., Pourmand, A.:
informationprocessingsystems,(2012) Sharingthesidewalk:acaseofE-scooterrelatedpedestrianinjury.
36. Kullback,S.,Leibler,R.A.:Oninformationandsufficiency.Ann. Am.J.EmergencyMed.,(2019)
Math.Statist.22(1),79–86(1951) 61. Song, K., Jang, J., Shin, S., Moon, I.: Bivariate Beta-LSTM. In
37. Lea,C.,Flynn,M.D.,Vidal,R.,Reiter,A.,Hager,G.D.:Temporal AAAI,(2020)
convolutionalnetworksforactionsegmentationanddetection.In 62. Stehman,S.V.:Selectingandinterpretingmeasuresofthematic
CVPR,(2017) classificationaccuracy.RemoteSens.Environ.62(1),77–89(1997)
38. Lerman,P.:Fittingsegmentedregressionmodelsbygridsearch.J. 63. Steinberg,D.,Colla,P.:Cart:classificationandregressiontrees.
R.Statist.Soc.Ser.C(AppliedStatistics),(1980) Thetoptenalgorithmsindatamining,(2009)
39. Li, L., Zheng, K., Wang, S., Hua, W., Zhou, X.: Go slow to go 64. Sundararajan,A.:FromZipcartothesharingeconomy.Harvard
fast:minimalon-roadtimerouteschedulingwithparkingfacilities businessReview,1(1),1–2(2013)
usinghistoricaltrajectory.VLDBJ.27(3),321–345(2018) 65. Tam,D.S.H.,Lau,W.C.,Hu,B.,Ying,Q.F.,Chiu,D.M.,Liu,H.:
40. Li,S.,Li,W.,Wang,W.:Co-GCNforMulti-ViewSemi-Supervised IdentifyingIllicitAccountsinLargeScaleE-paymentNetworks–
Learning.InAAAI,(2020) AGraphRepresentationLearningApproach.arXiv:1906.05546,
41. Li,Y.,Yu,R.,Shahabi,C.,Liu,Y.:Diffusionconvolutionalrecur- (2019)
rentneuralnetwork:Data-driventrafficforecasting.arXivpreprint 66. Wang,C.,Caja,J.,Gómez,E.:Comparisonofmethodsforoutlier
arXiv:1707.01926,(2017) identificationinsurfacecharacterization.Measurement,117,312–
42. Lin, Z., Li, M., Zheng, Z., Cheng, Y., Yuan, C.: Self-Attention 325(2018)
ConvLSTMforSpatiotemporalPrediction.InAAAI,(2020) 67. Wang,W.,Guo,J.,Li,Z.,Zhao,R.:Behaviormodelconstruction
43. Liu,H.,Lu,S.,Chen,X.,He,B.:G3:whengraphneuralnetworks forclientsideofmodernwebapplications.TsinghuaSci.Technol.
meetparallelgraphprocessingsystemsonGPUs.In:Proceedings 26(1),112–134(2020)
oftheVLDBEndowment,(2020) 68. Wen, Y. T., Yeh, P. W., Tsai, T. H., Peng, W. C., Shuai, H. H.:
44. Liu,Z.,Chen,C.,Yang,X.,Zhou,J.,Li,X.,Song,L.:Heteroge- CustomerPurchaseBehaviorPredictionfromPaymentDatasets.
neousgraphneuralnetworksformaliciousaccountdetection.In In:EleventhACMInternationalConferenceonWebSearch&Data
CIKM,(2018) Mining,(2018)
45. Maaten,L.V.d.,Hinton,G.:Visualizingdatausingt-SNE.J.Mach. 69. Weytjens,H.,Lohmann,E.,Kleinsteuber,M.:Cashflowprediction:
Learn.Rese(2008) MLP and LSTM compared to ARIMA and Prophet. Electronic
46. Magdy, A., Abdelhafeez, L., Kang, Y., Ong, E., Mokbel, M. F.: CommerceResearch,(2019)
Microblogsdatamanagement:asurvey.VLDBJ.29(1),177–216 70. Wu,J.,Si,S.,Yan,H.:Reducingpovertythroughthesharedecon-
(2020) omy:creatinginclusiveentrepreneurshiparoundinstitutionalvoids
47. Manessi,F.,Rozza,A.,Manzo,M.:Dynamicgraphconvolutional inChina.AsianBusinessManagement,1–29(2020)
networks.PatternRecognit.97,107000(2020) 71. Xiong, W., Hoang, T., Wang, W. Y.: Deeppath: A rein-
48. Meehan,J.,Aslantas,C.,Zdonik,S.,Tatbul,N.,Du,J.:DataInges- forcement learning method for knowledge graph reasoning.
tionfortheConnectedWorld.InCIDR,(2017) arXiv:1707.06690,(2017)
49. Mikolov, T., Karafiát, M., Burget, L., Cˇernocky`, J., Khudanpur, 72. D.Xu,W.Cheng,B.Zong,D.Song,J.Ni,W.Yu,Y.Liu,H.Chen,
S.:Recurrentneuralnetworkbasedlanguagemodel.In:Eleventh andX.Zhang.TensorizedLSTMwithAdaptiveSharedMemory
annualconferenceoftheinternationalspeechcommunicationasso- forLearningTrendsinMultivariateTimeSeries.InAAAI,(2020)
ciation,(2010) 73. Xu,D.,Ruan,C.,Korpeoglu,E.,Kumar,S.,Achan,K.:Inductive
50. Nainggolan,R.,Perangin-angin,R.,Simarmata,E.,Tarigan,A.F.: RepresentationLearningonTemporalGraphs.arXiv:2002.07962,
ImprovedthePerformanceoftheK-MeansClusterUsingtheSum (2020)
123

1058 Q.Xuetal.
74. Xu,Q.,Zhang,F.,Zhang,M.,Zhai,J.,Lin,J.,Liu,H.,Du,X.: 87. Zhang,L.,Ma,D.,Zhang,X.,Yan,X.,Wang,H.:GraphLSTMwith
PaymentBehaviorPredictionandStatisticalAnalysisforShared Context-GatedMechanismforSpokenLanguageUnderstanding.
ParkingLots.In:IFIPInternationalConferenceonNetworkand InAAAI,(2020)
ParallelComputing,(2020) 88. Zhang,W.,Liu,H.,Liu,Y.,Zhou,J.,Xiong,H.:Semi-Supervised
75. Xu, Y., Yang, J., Du, S.: CF-LSTM: Cascaded Feature-Based HierarchicalRecurrentGraphNeuralNetworkforCity-WidePark-
LongShort-TermNetworksforPredictingPedestrianTrajectory. ingAvailabilityPrediction.InAAAI,(2020)
InAAAI,(2020) 89. Zhang,W.,Miao,X.,Shao,Y.,Jiang,J.,Chen,L.,Ruas,O.,Cui,
76. Yang,S.,Ma,W.,Pi,X.,Qian,S.:Adeeplearningapproachto B.:ReliableDataDistillationonGraphConvolutionalNetwork.In
real-timeparkingoccupancypredictionintransportationnetworks SIGMOD,(2020)
incorporatingmultiplespatio-temporaldatasources.Transp.Res. 90. Zhao,L.,Song,Y.,Zhang,C.,Liu,Y.,Wang,P.,Lin,T.,Deng,
PartCEmerg.Technol.107,248–265(2019) M.,Li,H.:T-GCN:Atemporalgraphconvolutionalnetworkfor
77. Yang,Y.,Liu,Z.,Tan,C.,Wu,F.,Zhuang,Y.,Li,Y.:Tostayorto trafficprediction.IEEETransactionsonIntelligentTransportation
leave:Churnpredictionforurbanmigrantsintheinitialperiod.In Systems,(2019)
WWW,(2018) 91. Zhao,Z.,Chen,W.,Wu,X.,Chen,P.C.,Liu,J.:LSTMnetwork:
78. Yu,W.,He,X.,Pei,J.,Chen,X.,Xiong,L.,Liu,J.,Qin,Z.:Visu- adeeplearningapproachforshort-termtrafficforecast.IETIntell.
allyawarerecommendationwithaestheticfeatures.VLDBJ.1–19 Transp.Syst.11(2),68–75(2017)
(2021) 92. Zheng,L.,Li,Z.,Li,J.,Li,Z.,Gao,J.:AddGraph:AnomalyDetec-
79. Zhang,F.,Chen,Z.,Zhang,C.,Zhou,A.C.,Zhai,J.,Du,X.:An tioninDynamicGraphUsingAttention-basedTemporalGCN.In
efficient parallel secure machine learning framework on GPUs. IJCAI,(2019)
IEEETrans.ParallelDistrib.Syst.32(9),2262–2276(2021) 93. Zhong,W.,Yu,N.,Ai,C.:Applyingbigdatabaseddeeplearning
80. F.Zhang,N.Feng,Y.Liu,C.Yang,J.Zhai,S.Zhang,B.He,J.Lin, systemtointrusiondetection.BigDataMin.Anal.3(3),181–195
andX.Du.PewLSTM:PeriodicLSTMwithWeather-AwareGat- (2020)
ingMechanismforParkingBehaviorPrediction.InIJCAI,2020 94. Zhou,X.,Chen,L.,Zhang,Y.,Qin,D.,Cao,L.,Huang,G.,Wang,
81. F.Zhang,Y.Liu,N.Feng,C.Yang,J.Zhai,S.Zhang,B.He,J.Lin, C.: Enhancing online video recommendation using social user
X.Zhang,andX.Du.PeriodicWeather-AwareLSTMwithEvent interactions.VLDBJ.26(5),637–656(2017)
MechanismforParkingBehaviorPrediction.TKDE,2021 95. Zhu,H.,Vial,R.,Lu,S.:Tornado:Aspatio-temporalconvolutional
82. Zhang,F.,Zhai,J.,He,B.,Zhang,S.,Chen,W.:Understanding regressionnetworkforvideoactionproposal.In:Proceedingsof
co-runningbehaviorsonintegratedCPU/GPUarchitectures.IEEE theIEEEInternationalConferenceonComputerVision,(2017)
Trans.ParallelDistrib.Syst.28(3),905–918(2016) 96. Zhu,R.,Zhao,K.,Yang,H.,Lin,W.,Zhou,C.,Ai,B.,Li,Y.,Zhou,
83. Zhang,F.,Zhai,J.,Shen,X.,Mutlu,O.,Du,X.:POCLib:ahigh- J.:AliGraph:AComprehensiveGraphNeuralNetworkPlatform.
performanceframeworkforenablingnearorthogonalprocessing Proc.VLDBEndow.,(2019)
oncompression.IEEETrans.ParallelDistrib.Syst.33(2),459–475 97. Zuo,Y.,Liu,G.,Lin,H.,Guo,J.,Hu,X.,Wu,J.:Embeddingtem-
(2022) poralnetworkvianeighborhoodformation.InSIGKDD,(2018)
84. Zhang,F.,Zhai,J.,Shen,X.,Wang,D.,Chen,Z.,Mutlu,O.,Chen,
W.,Du,X.:TADOC:textanalyticsdirectlyoncompression.VLDB
J30(2),163–188(2021)
Publisher’sNote SpringerNatureremainsneutralwithregardtojuris-
85. Zhang, H., Wang, X., Chen, J., Wang, C., Li, J.: D2D-LSTM:
dictionalclaimsinpublishedmapsandinstitutionalaffiliations.
LSTM-BasedPathPredictionofContentDiffusionTreeinDevice-
to-DeviceSocialNetworks.InAAAI,(2020)
86. Zhang,J.,Zhou,K.,Li,G.,Liu,Y.,Xie,M.,Cheng,B.,Xing,J.:
CDBTune+:Anefficientdeepreinforcementlearning-basedauto-
maticclouddatabasetuningsystem.TheVLDBJournal,(2021)
123