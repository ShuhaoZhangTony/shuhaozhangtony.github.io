ProceedingsoftheTwenty-NinthInternationalJointConferenceonArtificialIntelligence(IJCAI-20)
SpecialTrackonAIforComputationalSustainabilityandHumanWell-being
PewLSTM: Periodic LSTM with Weather-Aware Gating Mechanism for
|     |     |     |     |     | Parking | Behavior | Prediction |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | ------- | -------- | ---------- | --- | --- | --- | --- | --- | --- |
FengZhang1, NingxuanFeng2, YaniLiu1, ChengYang3, JidongZhai2,
|     |     | ShuhaoZhang4;5, |     |     | BingshengHe5, |     | JiazaoLin6 |     | and XiaoyongDu1 |     |     |     |     |
| --- | --- | --------------- | --- | --- | ------------- | --- | ---------- | --- | --------------- | --- | --- | --- | --- |
1KeyLaboratoryofDataEngineeringandKnowledgeEngineering(MOE),andSchoolofInformation,
RenminUniversityofChina
2DepartmentofComputerScienceandTechnology,TsinghuaUniversity,BNRist
3SchoolofComputerScience,BeijingUniversityofPostsandTelecommunications
4DIMA,TechnischeUniversitätBerlin
5SchoolofComputing,NationalUniversityofSingapore
6DepartmentofInformationManagement,PekingUniversity
fengzhang@ruc.edu.cn,whitycatty@gmail.com,liuyn1999@gmail.com,albertyang33@gmail.com,
zhaijidong@tsinghua.edu.cn,shuhao.zhang@tu-berlin.de,hebs@comp.nus.edu.sg,linjz@pku.edu.cn,
duyong@ruc.edu.cn
Abstract lionon-streetparkingspaces1,buthasonly1.4millioncars2.
|     |     |     |     |     |     |     | The reason | why | it is not | easy to | find a | parking | place, espe- |
| --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --------- | ------- | ------ | ------- | ------------ |
In big cities, there are plenty of parking spaces, ciallyduringpeakhours,isthelackofpredictionofparking
but we often find nowhere to park. For example, behavior. In this paper, for a parking lot, we express park-
NewYorkhas1.4millioncarsand4.4millionon- ing behavior as the number of parking arrivals and depar-
streetparkingspaces,butitisstillnoteasytofinda turesinonehour,whichcanalsobeconvertedintothenum-
parking place near our destination, especially dur- berofavailableparkingspaces. Clearly,ifwecouldprovide
ing peak hours. The reason is the lack of predic- theparkingbehaviorinadvance,wecaneasesuchaparking
tionofparkingbehavior. Ifwecouldprovidepark- problemthataffectshumanwell-being.
ing behavior in advance, we can ease this parking AItechnologyhastransformedoureverydaylivesinmany
problem that affects human well-being. We ob- aspects, and now AI is shaping our parking behavior. More
serve that parking lots have periodic parking pat- intelligentparkinglotswithAImanagementsystemsappear
| terns, | which | is an important |     | factor | for parking | be- |     |     |     |     |     |     |     |
| ------ | ----- | --------------- | --- | ------ | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
inourcities.Amongtheintelligentparkingmanagementsys-
| haviorprediction. |     | Unfortunately,existingworkig- |     |     |     |     |                 |     |             |          |            |     |             |
| ----------------- | --- | ----------------------------- | --- | --- | --- | --- | --------------- | --- | ----------- | -------- | ---------- | --- | ----------- |
|                   |     |                               |     |     |     |     | tems, providing |     | the parking | behavior | prediction |     | is the most |
noressuchperiodicparkingpatternsinparkingbe- criticalandbeneficialfunction.First,accuratepredictionscan
havior prediction, and thus incurs low accuracy. save us time and effort to find a proper parking space. For
To solve this problem, we propose PewLSTM, a example, a motorist in New York spends an average of 107
| novel        | periodic | weather-aware |             | LSTM | model    | that  |             |      |            |           | space3, |             |           |
| ------------ | -------- | ------------- | ----------- | ---- | -------- | ----- | ----------- | ---- | ---------- | --------- | ------- | ----------- | --------- |
|              |          |               |             |      |          |       | hours per   | year | on finding | a parking |         | while       | such time |
| successfully |          | predicts      | the parking |      | behavior | based |             |      |            |           |         |             |           |
|              |          |               |             |      |          |       | waste could | be   | saved when | we        | obtain  | the parking | behavior  |
on historical records, weather, environments, and for the expected parking lots in advance. Second, based on
weekdays. PewLSTM has been successfully in- thepreciseparkingbehaviorprediction, theparkinglotscan
tegrated into a real parking space reservation sys- be utilized more efficiently, and parking space reservations
tem, ThsParking, which is one of the top smart canalsobemadebasedontheprediction.Third,basedonthe
| parking | platforms |     | in China. | Based | on  | 452,480 |     |     |     |     |     |     |     |
| ------- | --------- | --- | --------- | ----- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
parkingbehaviorprediction,thedepartmentoftransportation
real parking records in 683 days from 10 park- isbetterabletounderstandthetrafficconditionsanddispatch
ing lots, PewLSTM yields 85.3% parking predic- resourcessuchastrafficpolice.However,parkingbehavioris
tion accuracy, which is about 20% higher than hardtopredict,sinceitcanbeaffectedbymanyfactors,such
the state-of-the-art parking behavior prediction asweather,weekdays,andenvironments.
| method. | The | code | and data | can be | obtained | from |      |             |         |         |     |         |           |
| ------- | --- | ---- | -------- | ------ | -------- | ---- | ---- | ----------- | ------- | ------- | --- | ------- | --------- |
|         |     |      |          |        |          |      | Many | intelligent | parking | methods | and | systems | have been |
https://github.com/NingxuanFeng/PewLSTM. developedinrecentyears,suchaspricingparking[Pierceand
|     |     |     |     |     |     |     | Shoup, 2013], |     | on-streetparking[Romanetal., |     |     |     | 2018], smart |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | ---------------------------- | --- | --- | --- | ------------ |
1 Introduction 1https://www.statista.com/statistics/183505/number-of-vehicles-
in-the-united-states-since-1990
| In big cities, | we  | often | find it hard | to  | find a | parking space. |     |     |     |     |     |     |     |
| -------------- | --- | ----- | ------------ | --- | ------ | -------------- | --- | --- | --- | --- | --- | --- | --- |
2https://edc.nyc/article/new-yorkers-and-their-cars
However,inbuildingcities,designersusuallyreserveenough 3https://www.thedrive.com/sheetmetal/12389/new-study-shows-
parkingspaces. Forexample,NewYorkhasatleast4.4mil- how-much-time-and-money-we-waste-on-parking
4424

ProceedingsoftheTwenty-NinthInternationalJointConferenceonArtificialIntelligence(IJCAI-20)
SpecialTrackonAIforComputationalSustainabilityandHumanWell-being
vehicle parking [Shahzad et al., 2018], and smart parking Wesummarizeourcontributionsasfollows.
guidance[Fangetal., 2017]. However, noneoftheseworks 1) We exhibit our observations, insights, and rules about
involve parking behavior prediction. A real-time parking theperiodicpatternsfromdifferentparkingrecords,typesof
spaceavailabilitysystem[Caicedoetal.,2012]hasbeende- parkinglots,andweatherfactors.
veloped,butthisworkonlyconsidershistoricalrecords. The 2)WeproposePewLSTM,aperiodicLSTMwithweather-
state-of-the-artparkingbehaviorpredictionresearch[Fenget awaregatingmechanism,whichincorporatestheweatherand
al.,2019]usedregressionmethodsregardingparkingrecords periodicparkingpatternsforparkingbehaviorprediction.
and weather, but we find that their method only considers 3)WeevaluatePewLSTMwithrealparkingrecordsandit
parkingarrivalswithoutdepartures,andignorestheperiodic achieves85.3%accuracy,whichisabout20%higherthanthe
parking patterns and thus incurs low accuracy. Even worse, state-of-the-artmethod.
theycanonlypredictparkingbehaviorinonehour,whilewe
| arelookingforwardtoalong-termprediction. |     |     |     |     |     |     | 2 RelatedWork |     |     |     |     |     |
| ---------------------------------------- | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- |
Building an accurate long-term parking behavior predic- As far as we know, this work is the first to use the LSTM-
| tion system | requires | overcoming |     | three | challenges. | The first |              |                    |          |     |          |         |
| ----------- | -------- | ---------- | --- | ----- | ----------- | --------- | ------------ | ------------------ | -------- | --- | -------- | ------- |
|             |          |            |     |       |             |           | based method | to predict parking | behavior |     | by using | records |
challengeistofindanappropriatemodelthatcanunderstand
alongwithweatherinformation.
thecomplicatedparking-relatedbehaviorsbyusinghistorical
recordsandotherfactorssuchasweatherandtimeinforma- 2.1 VehicleParking
tion. The second challenge is how to involve the complex Many studies have been conducted on different aspects of
periodicparkingpatterns,includingtheinfluencefromaspe- vehicle parking, including parking demand prediction [Alho
cific time in the past. For example, customers would like to 2014], [Yoo et al.,
|     |     |     |     |     |     |     | and Silva, | smart parking | guidance |     |     | 2008; |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------------- | -------- | --- | --- | ----- |
drivetoashoppingmalleveryFridaynightfordiscounts,and
|     |     |     |     |     |     |     | Idris et al., | 2009; Fang et | al., 2017], | parking | space | predic- |
| --- | --- | --- | --- | --- | --- | --- | ------------- | ------------- | ----------- | ------- | ----- | ------- |
suchpatternsshouldbeintegrated.Thethirdchallengeishow
tion[Caicedoetal.,2012;Hössingeretal.,2014;Chen,2014;
topredictparkingbehaviorforalongtimeinthefuturewith Zheng et al., 2015; Vlahogianni et al., 2016; Badii et al.,
thecurrentdata. 2018], and parking behavior prediction [Feng et al., 2019].
WeproposePewLSTM,aperiodicweather-awareLSTM The regression-based parking behavior prediction [Feng et
| model for | long-term | car | parking | behavior | prediction. | First, |     |     |     |     |     |     |
| --------- | --------- | --- | ------- | -------- | ----------- | ------ | --- | --- | --- | --- | --- | --- |
al.,2019]istheclosestworktoPewLSTM,whichalsocon-
todepicttheparkingbehaviorforaparkinglot,weuseboth
|     |     |     |     |     |     |     | siders weather | conditions. | They explored |     | linear regression, |     |
| --- | --- | --- | --- | --- | --- | --- | -------------- | ----------- | ------------- | --- | ------------------ | --- |
the arrivals and departures, because these two indicators de- ridge regression [Le Cessie and Van Houwelingen, 1992],
pictchangesinparkingvehicles. Second,toinvolveweather Lasso regression [Hans, 2009], decision tree [Safavian and
information,weaddinputgatesforweatherinformationinto Landgrebe, 1991], and random forest [Liaw et al., 2002] to
| theLSTMblock.    |     | Thecellstateandhiddenstatearedecided |             |              |     |           |             |                  |              |     |       |           |
| ---------------- | --- | ------------------------------------ | ----------- | ------------ | --- | --------- | ----------- | ---------------- | ------------ | --- | ----- | --------- |
|                  |     |                                      |             |              |     |           | predict the | parking arrivals | in one hour, | and | found | that ran- |
| by both previous |     | states                               | and weather | information. |     | Third, to |             |                  |              |     |       |           |
domforestachievesthehighestaccuracy.
utilize the periodic parking patterns from historical records, However, the work [Feng et al., 2019] has three limita-
weaddspecialgatesintotheLSTMblocktoinputthehidden tions. First, it provides the prediction for only parking ar-
states from past specific time steps when certain conditions rivals, without departures. Departures are equally important
aremet,suchasthesametimeinpreviousweekdays.
|     |     |     |     |     |     |     | as to arrivals, | and they together | define | the | parking | behavior. |
| --- | --- | --- | --- | --- | --- | --- | --------------- | ----------------- | ------ | --- | ------- | --------- |
Our proposed periodic LSTM with weather-aware gating Second, it does not provide the prediction results for more
mechanism,PewLSTM,hasbeenintegratedintoarealpark- thanonehour,whichlimitstheapplicability,sinceusersmay
ing system, ThsParking4 (developed by Huaching Tech5), plan to book a parking space in an uncertain future. Third,
which is one of the top smart parking platforms in China. their methods fail to capture the periodic patterns from long
Basedontheprediction,theparkingsystemcanlaunchaseg-
|     |     |     |     |     |     |     | periods of | time. For example, | the parking |     | space availability |     |
| --- | --- | --- | --- | --- | --- | --- | ---------- | ------------------ | ----------- | --- | ------------------ | --- |
mented pricing strategy to utilize parking spaces better and mayhavestrongcorrelationswithpreviousparkingpatterns,
gainmoreprofit. suchasweekdayandholidaypatterns.Evenworse,thatwork
WeevaluatePewLSTMwithrealparkingrecords. Wecol- usedrecordsfromonlyoneparkinglotforvalidation,which
lect 452,480 parking records from 10 parking lots. These cannot represent all parking lots. Different types of parking
| records come | from | different |     | environments, |     | including ho- |              |                 |            |     |               |     |
| ------------ | ---- | --------- | --- | ------------- | --- | ------------- | ------------ | --------------- | ---------- | --- | ------------- | --- |
|              |      |           |     |               |     |               | lots exhibit | various parking | behaviors, | and | the locations | of  |
tels, shopping malls, and streets. Along with these parking parkinglotshaveahighinfluenceonparkingbehaviors. For
records, we have collected related weather and date infor- example, in holidays, the parking lots near a shopping mall
mation. When predicting parking behavior in the next hour, arebusywhiletheparkinglotsinanindustrialareaareidle.
| PewLSTM | achieves | 85.3% | arrival | accuracy |     | and 84.6% de- |     |     |     |     |     |     |
| ------- | -------- | ----- | ------- | -------- | --- | ------------- | --- | --- | --- | --- | --- | --- |
partureaccuracy;forthenexttwohours,PewLSTMachieves 2.2 RecurrentNeuralNetwork
|               |          |     |           |           |     |               | Recurrentneuralnetwork(RNN)[Rumelhartetal., |     |     |     |     | 1986]is |
| ------------- | -------- | --- | --------- | --------- | --- | ------------- | ------------------------------------------- | --- | --- | --- | --- | ------- |
| 76.4% arrival | accuracy |     | and 73.1% | departure |     | accuracy; and |                                             |     |     |     |     |         |
for the next three hours, its arrival accuracy is 68.6% and aneuralnetworkthatincorporatestemporalsequencedataas
its departure accuracy is 68.5%. On average, PewLSTM input. RNNperformsrecursionalongthetemporalsequence.
achieves20%higheraccuracythanthestate-of-the-artpark- LongShort-TermMemory(LSTM)[HochreiterandSchmid-
ingpredictionmethod[Fengetal.,2019]. huber, 1997] is a kind of RNN and its basic unit is a cell or
|     |     |     |     |     |     |     | called LSTM | block. An LSTM | block | is  | usually | composed |
| --- | --- | --- | --- | --- | --- | --- | ----------- | -------------- | ----- | --- | ------- | -------- |
4http://www.thsparking.com ofinputgates,forgetgates,andoutputgates,whichcancap-
5http://www.huaching.com turethecomplexnon-linearrelationsamongdifferentfactors.
4425

ProceedingsoftheTwenty-NinthInternationalJointConferenceonArtificialIntelligence(IJCAI-20)
SpecialTrackonAIforComputationalSustainabilityandHumanWell-being
| 40           |     |     |     |     |     |     |               | 500 |     |     | 150           |     |     |     |
| ------------ | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | ------------- | --- | --- | --- |
|              |     |     |     |     |     |     | tnuoc gnikrap |     |     |     | tnuoc gnikrap |     |     |     |
| tnuocgnikrap |     |     |     |     |     |     |               | 400 |     |     |               |     |     |     |
| 30           |     |     |     |     |     |     |               | 300 |     |     | 100           |     |     |     |
200
| 20  |     |     |     |     |     |     |     | 100      |               |                 | 50    |           |                   |        |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------------- | --------------- | ----- | --------- | ----------------- | ------ |
| 10  |     |     |     |     |     |     |     | 0        |               |                 | 0     |           |                   |        |
|     |     |     |     |     |     |     |     | y        | y y ursday    | y turday Sunday |       | y y       | y ursday y turday | Sunday |
| 0   |     |     |     |     |     |     |     | Monda sd | a nesd a Frid | a               | Monda | sd a nesd | a Frid a          |        |
|     |     |     |     |     |     |     |     | ue       |               |                 |       | ue        |                   |        |
00:0 00:3 00:6 00:9 00:21 00:51 00:81 00:12 00:0 00:3 00:6 00:9 00:21 00:51 00:81 00:12 00:0 00:3 00:6 00:9 00:21 00:51 00:81 00:12 T d T h S a T d T h S a
|     |     |     |     |     |     |     |     | W                      | e   |     |     | W e            |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------------- | --- | --- | --- | -------------- | --- | --- |
|     |     |     |     |     |     |     |     | (a) P4:industrialpark. |     |     |     | (b) P6:market. |     |     |
Figure1:PeriodicparkingpatternsforP2athourgranularity.
Figure2:Differenttypesofparkinglots.
LSTMhasbeenappliedtodifferentaspectsofourdailylife,
| suchasfinancialmarketprediction[Wangetal., |     |     |     |     | 2019], | dis- |     |     |     |     |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | --- | ------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
|                                            |     |     |     |     |        |      |     | 20  |     |     | 20  |     |     |     |
ease progression modeling [Zhang et al., 2019], predictive tnuoc gnikrap tnuoc gnikrap
|             |     |        |      |                |        |     |     | 15  |     |     | 15  |     |     |     |
| ----------- | --- | ------ | ---- | -------------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|             | [Fu | 2019], |      |                | [Huang |     |     |     |     |     | 10  |     |     |     |
| phenotyping | et  | al.,   | text | categorization |        | et  |     | 10  |     |     |     |     |     |     |
5
| al.,2019],andsentimentanalysis[Xingetal.,2019]. |     |     |     |     |     | Partic- |     | 5   |     |     | 0   |     |     |     |
| ----------------------------------------------- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
ularly,LSTMconquersthelimitationsthatthestate-of-the-art 0 i r e sh breeze moderate fresh gale
|     |     |     |     |     |     |     |     | dry mi-dry | suitable | wet wet | light a | ht bree z |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | -------- | ------- | ------- | --------- | --- | --- |
parkingbehaviorpredictionmethod[Fengetal.,2019]failed
mi-
| toconsiderfromlongandshortterms. |     |     |     |     |     |     |     | se                    | se  |     |     | li g fr e      |     |     |
| -------------------------------- | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | --- | -------------- | --- | --- |
|                                  |     |     |     |     |     |     |     | (a) Relativehumidity. |     |     |     | (b) Windspeed. |     |     |
3 Observations
Inthissection,weexhibitourparkingbehaviorobservations Figure3:WeatherinfluenceonparkingbehaviorforP3.
andanalysis,whicharealsothemotivationofthiswork.
Data. Wecollectbothparkingandweatherdata. Forpark- show in Figure 3 the average parking count of the parking
ing data, we collect 452,480 real parking records from 10 lot P3 (see Table 1), which is close to a shopping mall. We
parking lots (detailed in Section 5.1). In our study, we re- showtherelationshipbetweentheparkingcountandtherel-
ducetheanalysisgranularitytoonehour, whichisthesame ativehumidityinFigure3(a),whichimpliesthattheparking
| as [Feng | et al., 2019]. | In  | this section, | we use | roughly | the |     |     |     |     |     |     |     |     |
| -------- | -------------- | --- | ------------- | ------ | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
behaviorhasastrongrelationshipwiththerelativehumidity.
parking counts of arriving cars in the parking lot within one Figure3(a)furtherimpliesthatpeoplearemorewillingtogo
hour as an indicator to reflect the parking behavior. For tothemallinfineweatherinsteadofrainyweather. Weshow
weatherinformation,wecollecttheweatherdata, including therelationshipbetweenparkingcountandthewindspeedin
temperature, humidity, wind speed, and precipitation, from Figure 3 (b). We find that for this shopping mall, the wind
thenationalweatherservice.
speedshowslesscorrelationwithparkingbehavior.
| Observation1:PeriodicParkingPatterns. |     |     |     |     | Periodicpark- |     |     |                           |     |     |     |     |     |     |
| ------------------------------------- | --- | --- | --- | --- | ------------- | --- | --- | ------------------------- | --- | --- | --- | --- | --- | --- |
|                                       |     |     |     |     |               |     | 4   | ParkingBehaviorPrediction |     |     |     |     |     |     |
ingpatternsrefertothatthearrivalsanddeparturesofapark-
| ing lot repeat | in a cyclical |        | and predictable | manner.  |         | We find |     |                   |     |     |     |     |     |     |
| -------------- | ------------- | ------ | --------------- | -------- | ------- | ------- | --- | ----------------- | --- | --- | --- | --- | --- | --- |
|                |               |        |                 |          |         |         | 4.1 | ProblemDefinition |     |     |     |     |     |     |
| that most      | parking lots  | follow | certain         | periodic | parking | pat-    |     |                   |     |     |     |     |     |     |
terns.Forillustration,weshowinFigure1theparkingcounts Theproblemwearetryingtosolveishowtopredictthepark-
athourgranularityforparkinglotP2(seeTable1),whichis ingbehaviorforagivenhourinthefuturebyusingtheprevi-
ousparkingrecordsandweatherinformation.
| closetoacommercialstreet. |     |     | Figure1showsthattheparking |     |     |     |     |     |     |     |     |     |     |     |
| ------------------------- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
lotfollowsapatternthatitisbusyduringtheday(from9am
|     |     |     |     |     |     |     | ParkingBehaviorDefinition. |     |     |     | Inthisstudy,theparkingbe- |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | ------------------------- | --- | --- | --- |
to9pm). Thereasonisthatthenearbyshopsopenat9amand
|                                   |             |       |       |                        |     |         | havior | for      | a parking | lot is defined | by  | its arrivals | and    | depar- |
| --------------------------------- | ----------- | ----- | ----- | ---------------------- | --- | ------- | ------ | -------- | --------- | -------------- | --- | ------------ | ------ | ------ |
| close at                          | 9pm. People | go to | these | shops during           | the | day and |        |          |           | N              |     |              |        |        |
|                                   |             |       |       |                        |     |         | tures, | as shown | below.    | represents     |     | the natural  | number | do-    |
| thisactivitylastsuntiltheevening. |             |       |       | Similarperiodicparking |     |         |        |          |           |                |     |              |        |        |
main.
patternsalsoexistatweekandmonthgranularities.
|                                  |     |     |     |                 |     |     | (cid:15) | Arrivals.         | Thesequenceofthenumberofarrivalsforthe |     |           |                  |              |     |
| -------------------------------- | --- | --- | --- | --------------- | --- | --- | -------- | ----------------- | -------------------------------------- | --- | --------- | ---------------- | ------------ | --- |
| Observation2:TypesofParkingLots. |     |     |     | Thetypesofpark- |     |     |          |                   |                                        |     |           |                  | g2NK,        |     |
|                                  |     |     |     |                 |     |     |          | pastKtimestepsisC |                                        | =fc | t(cid:0)K | ;:::;c t(cid:0)2 | ;c t(cid:0)1 |     |
inglotsalsomaketheparkingbehaviorsdifferentfromeach
|            |               |     |        |            |     |         |     | wheretrepresentsthecurrenttimeandc |     |     |     |     | representsthe |     |
| ---------- | ------------- | --- | ------ | ---------- | --- | ------- | --- | ---------------------------------- | --- | --- | --- | --- | ------------- | --- |
| other. For | illustration, | in  | Figure | 2, we show | the | parking |     |                                    |     |     |     |     | i             |     |
parkingnumberofarrivalsofthepasti-thhour.
| counts of | two parking | lots: | the parking | lot P4 | located | in an |     |     |     |     |     |     |     |     |
| --------- | ----------- | ----- | ----------- | ------ | ------- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
industrialpark, andtheparkinglotP6locatednearamarket (cid:15) Departures. The sequence of the number of de-
|            |            |     |            |             |      |      |     | partures | for    | the past | K time | steps | is  | D = |
| ---------- | ---------- | --- | ---------- | ----------- | ---- | ---- | --- | -------- | ------ | -------- | ------ | ----- | --- | --- |
| (see Table | 1). We can | see | that these | two parking | lots | show |     |          |        |          |        |       |     |     |
|            |            |     |            |             |      |      |     | fd       | ;:::;d | ;d g     | 2 NK,  |       | t   |     |
totally different behaviors. For explanation, people drive to t(cid:0)K t(cid:0)2 t(cid:0)1 where represents the
workduringworkingdays,soP4isbusyonlyfromMonday currenttimeandd i representstheparkingnumberofde-
to Friday. In contrast, people tend to go to the market on parturesofthepasti-thhour.
weekends,soP6isbusyonSaturdayandSunday.
|     |     |     |     |     |     |     | Significance. |     | Different | from | parking | space | prediction, |     |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --------- | ---- | ------- | ----- | ----------- | --- |
Observation3: InfluenceofDifferentWeatherFactorson parking behavior prediction contains more information for
ParkingBehavior. Theparkingbehaviorexhibitsdifferent bothusersandownersofparkinglots. Forexample, apark-
correlationswithvariousweatherfactors. Forillustration,we ing lot is worth waiting if the number of departures d is
t
4426

ProceedingsoftheTwenty-NinthInternationalJointConferenceonArtificialIntelligence(IJCAI-20)
SpecialTrackonAIforComputationalSustainabilityandHumanWell-being
large, even if the parking lot is full (parking space predic- January same time in different months
8
tion is useless in this case since the predicted results show same time in different weeks T ue sd a y
|     |     |     |     |     |     |     |     |     |     |     | T u e | .   |     | prediction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | ---------- |
same time in different days
| novacancy). |     | Whenweobtainthenumberofarrivalsandde- |     |     |     |     |     |     |     |     |     |     |     |     |
| ----------- | --- | ------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
parturesforaparkinglot,wecanfurtherobtainitsgrowthof … LSTM … LSTM … LSTM … LSTM … LSTM … LSTM …
parkingspaceusagebysubtractingtheamountofdepartures
January
from the amount of arrivals, which is very useful for smart time
parkingsystems.
Figure4:PewLSTMoverview.
4.2 Preliminaries
|     |     |     |     |     |     |     |     | c   |     | •   |     | +   |     | c   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
A typical LSTM model can be formulized as the following t-1 t
| equations, |     | whereatthetimestept, |     | h   | representsthehidden |     |     | x   |     |     |     |     |     | 𝜙   |
| ---------- | --- | -------------------- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|            |     |                      |     | t   |                     |     |     | t   |     |     |     |     |     |     |
state,x representstheinputvector,c representsthecellsate, f i o
|     | t   |     |     | t   |     |     | h   |      |     | t   | t   | •   | t   | •   |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- |
|     | f i | o   |     |     |     |     |     | day/ |     |     |     |     |     |     |
and t , t , and t are the forget gate, input gate, and output  
|     |     |     |     |     |     |     | week/mon |     |     |    |     | g   |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- |
gate.W a ndbare relatedweightmatrices.Additionally,(cid:27)in- + t
dicatesthesigmoidactivationfunction,(cid:12)indicateselement- + + 𝜙 +
h
| wisemultiplication,and(cid:30)indicatesthetanhfunction. |     |     |     |     |     |     |     |     |     | o   |     |     |     |     |
| ------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|                                                         |     |     |     |     |     |     |     | h   | 𝛿   |     |     |     |     |     |
t-1
e
|     |                 |           |                |        |     |     |         |     |     | t   |     |     |     | h t |
| --- | --------------- | --------- | -------------- | ------ | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
|     |                 |           |                |        |     |     | weather |     |     |    |     |     |     |     |
|     | f =(cid:27)(W   | x +W      | h              | +b     | )   |     |         | t   |     |     |     |     |     |     |
|     | t               | fx t      | fh t(cid:0)1   | f      |     |     |         |     |     |     |     |     |     |     |
|     | i t =(cid:27)(W | ix x t +W | ih h t(cid:0)1 | +b i ) |     |     |         |     |     |     |     |     |     |     |
Figure5:PewLSTMblock.
|     | g =(cid:30)(W | x +W | h            | +b ) |     |     |     |     |     |     |     |     |     |     |
| --- | ------------- | ---- | ------------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | t             | gx t | gh t(cid:0)1 | g    |     |     |     |     |     |     |     |     |     |     |
(1)
|     | o =(cid:27)(W | x +W | h   | +b ) |     |     |     |     |     |     |     |     |     |     |
| --- | ------------- | ---- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
t ox t oh t(cid:0)1 o PewLSTM Block. The LSTM function in PewLSTM is
c =g (cid:12)i +c (cid:12)f composed of PewLSTM blocks, as shown in Figure 5. Tra-
|     | t   | t t t(cid:0)1 | t   |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
h t =(cid:30)(c t )(cid:12)o t ditional LSTM block uses input gate i t , output gate o t , and
|     |     |     |     |     |     |     | forget | gate | f to | control | dataflow | in LSTM. | We  | argue that |
| --- | --- | --- | --- | --- | --- | --- | ------ | ---- | ---- | ------- | -------- | -------- | --- | ---------- |
t
Challenges. WemeettwochallengesinapplyingLSTMin for parking behavior prediction, we need to additionally in-
parkingbehaviorprediction. Thefirstishowtoinvolveperi- volve 1) periodic pattern influence and 2) weather informa-
odic parking patterns since typical LSTM does not have the tion. We consider these two factors as new gates involved
| periodic | design. | The second | is  | how to | design the | path from |     |             |     |        |     |          |          |      |
| -------- | ------- | ---------- | --- | ------ | ---------- | --------- | --- | ----------- | --- | ------ | --- | -------- | -------- | ---- |
|          |         |            |     |        |            |           | in  | our PewLSTM |     | model. | We  | show our | periodic | LSTM |
sourcesofparkingpatternsandweatherintothevariousparts blockwithweather-awaregatingmechanisminFigure5.The
withintheLSTMblock. maindifferencebetweenourPewLSTMblockandtraditional
|     |               |     |     |     |     |     | LSTM         | block | lies                   | in the gates | for | previous | periodic | records  |
| --- | ------------- | --- | --- | --- | --- | --- | ------------ | ----- | ---------------------- | ------------ | --- | -------- | -------- | -------- |
| 4.3 | PewLSTMDesign |     |     |     |     |     | h            |       | andweatherinputweather |              |     |          | . First, | forperi- |
|     |               |     |     |     |     |     | day=week=mon |       |                        |              |     |          | t        |          |
In this part, we show our design of PewLSTM for parking odic time influence, the hidden states at the same time from
behaviorpredictionandoursolutionstothechallengesmen- previousstepsarerepresentedash ,h ,andh ,and
|     |     |     |     |     |     |     |     |     |     |     |     | day week |     | mon |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- |
wedesignaspecialweightgate(cid:14)tointegratetheseinputhid-
tionedinSection4.2.
|     |     |     |     |     |     |     | denstateswithh |     |     | . Theweightgate(cid:14)iteratescontinuously |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | ------------------------------------------- | --- | --- | --- | --- |
t(cid:0)1
Model Overview. We show the model overview of PewL- duringtraining,adjustingtheweightofeachparameterinthe
| STMforparkingbehaviorpredictioninFigure4. |          |                   |     |           |       | Toinvolve  |                                                 |             |     |            |                 |     |        |        |
| ----------------------------------------- | -------- | ----------------- | --- | --------- | ----- | ---------- | ----------------------------------------------- | ----------- | --- | ---------- | --------------- | --- | ------ | ------ |
|                                           |          |                   |     |           |       |            | modeltoachievebetterresults,asshowninEquation2. |             |     |            |                 |     |        | Sec-   |
| the                                       | periodic | parking patterns, | we  | add input | gates | for hidden |                                                 |             |     |            |                 |     |        |        |
|                                           |          |                   |     |           |       |            | ond,                                            | for weather |     | influence, | a weather-aware |     | gating | mecha- |
statesfrompreviousLSTMfunctionsatthesametimeatday, nism has been integrated into the PewLSTM block, as rep-
weekday,andmonthgranularities. Forexample,foratimet, resented in Equation 3. We argue that the current weather
thecurrentparkingbehaviormaybeinfluencedbythepark- information,alongwiththeparkingrecordsandtheprevious
ingbehavioratthesametimefrompreviousdays(daygran-
parkingpatternstogetherdecidetheparkingbehaviorsinthe
ularity),soweaddagateforhiddenstatesfromtheprevious
|     |     |     |     |     |     |     | future. | Based | on  | this assumption, |     | after | a sigmoid | function |
| --- | --- | --- | --- | --- | --- | --- | ------- | ----- | --- | ---------------- | --- | ----- | --------- | -------- |
“t(cid:0)24(cid:1)n”timestep,wherenisapositiveinteger.
|     |     |     |     |     |     | Forex- | processing, |     | the weather | aspect | vector | e   | is integrated | to f , |
| --- | --- | --- | --- | --- | --- | ------ | ----------- | --- | ----------- | ------ | ------ | --- | ------------- | ------ |
|     |     |     |     |     |     |        |             |     |             |        |        | t   |               | t      |
ample, people would like to park cars at a parking lot near i ,ando . Therefore,thecellstatec andthehiddenstateh
|     |     |     |     |     |     |     | t   | t   |     |     |     | t   |     | t   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
a restaurant atnoon, and the parking behavior at noonhas a are influenced by the previous hidden states, cell states, the
strongcorrelationwithpreviousbehaviorsatnooninthepast currentweatherinformation,andtheperiodicpatterns.
| days. | The  | parking behavior | may         | be influenced |              | by the same |     |             |     |      |     |     |     |         |
| ----- | ---- | ---------------- | ----------- | ------------- | ------------ | ----------- | --- | ----------- | --- | ---- | --- | --- | --- | ------- |
| time  | from | last week and    | last month, | so            | we add gates | for in-     |     |             |     |      |     |     |     |         |
|       |      |                  |             |               |              |             | h   | =(cid:14)(W | h   | +W h | +W  | h   | +W  | h ) (2) |
putting the time pattern influence at the same time from the o d day w week m mon t(cid:0)1 t(cid:0)1
| pastLSTMstates. |      | Asformodelinput,eachLSTMfunction |     |     |          |             |     |     |     |     |     |     |     |     |
| --------------- | ---- | -------------------------------- | --- | --- | -------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| receives        | both | weather information              |     | and | records: | for weather |     |     |     |     |     |     |     |     |
input,wedesignspecialgatesforreceivingweatherinforma- e =(cid:27)(W weather +b ) (3)
|       |           |              |           |     |             |          |     | t   | e   | t   | f   |     |     |     |
| ----- | --------- | ------------ | --------- | --- | ----------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
| tion, | including | temperature, | humidity, |     | wind speed, | and pre- |     |     |     |     |     |     |     |     |
cipitation; for parking record input, the record includes the InputGates. Theinputgatei t decidestheamountofdata
arrivalanddeparturetimes,date,andweekdayinformation. thatcanbeaccumulatedtothecellstatec fromtheprevious
t
4427

ProceedingsoftheTwenty-NinthInternationalJointConferenceonArtificialIntelligence(IJCAI-20)
SpecialTrackonAIforComputationalSustainabilityandHumanWell-being
statec .Differentfromthetraditionalinputgates,theinput ParkingLot Space# Record# Surrounding Location(district/city/province)
t(cid:0)1
gateinourmodelintegratestheinputvectorx ,theweighted P1 23 22,388 hotel Haishu,Ningbo,Zhejiang
t
P2 87 208,472 commercialstreet Haishu,Ningbo,Zhejiang
hiddenstateh ,andtheweatherinpute ,asshowninEqua-
o t P3 9 31,187 shoppingmall Yinzhou,Ningbo,Zhejiang
tion4. P4 62 4,335 industrialpark Yinzhou,Ningbo,Zhejiang
P5 46 28,804 hotel Yinzhou,Ningbo,Zhejiang
P6 16 32,009 market Yuelu,Changsha,Hunan
P7 31 49,707 market Yuelu,Changsha,Hunan
i t =(cid:27)(W ix x t +W ih h o +W fe e t +b i ) P8 27 46,365 shoppingmall Yuelu,Changsha,Hunan
(4) P9 49 5,808 shoppingmall Yuhua,Changsha,Hunan
g t =(cid:30)(W gx x t +W gh h o +b g ) P10 65 23,405 community Yuhua,Changsha,Hunan
ForgetGates. Theforgetgateabandonsunnecessaryinfor- Table1:Parkinglotinformation.
mation so that only the useful information is retained in the
cellstate. Similartotheinputgate,alongwithh andthe
t(cid:0)1
inputvectorx ,theweatherinformationandperiodichidden OutputLayer. Becausethefinaloutputfromthemodelis
t
statesfromprevioustimestepsalsoaffecttheretentionfrom thepredictedparkingnumbersofarrivalsanddepartures,we
thec statetothec state,asshowninEquation5. addafeed-forwardneuralnetworkfollowingthedeepPewL-
t(cid:0)1 t
STMlayersforpost-processing. Similarprocesseshavebeen
conductedinpreviousresearch,suchas[Kongetal.,2017].
f =(cid:27)(W x +W h +W e +b ) (5)
t fx t fo o fe t f
Output Gates. The output gate is used to control the data 5 Experiments
flow from the current input to the hidden state h , as shown
t
5.1 ExperimentalSetup
inEquation6. Similarly,theweightedhiddenstateh ,input
o
vectorx ,andweatherinformationtogetherdecidetheoutput
t Methodology. We evaluate the prediction accuracy of five
o ,whichisdifferentfromthetraditionaloutputgate.
t methodsforthefuturethreehours. The“PewLSTM”method
isourperiodicLSTMwithweather-awaregatingmechanism
basedonallinfluencingfactors.The“simpleLSTM”method
o =(cid:27)(W x +W h +W e +b ) (6)
t ox t oh o fe t o
is an LSTM implementation based on only parking records
Cell States. Traditional cell state is decided by previous without other factors. The “regression” method is the state-
state c , forget gate f , input gate i , and g . We need of-the-art parking behavior prediction method [Feng et al.,
t(cid:0)1 t t t
toinvolvetheperiodicandweatherinformationintothecell 2019]. The “regression” method in [Feng et al., 2019] only
state. However,f andi alreadypreservetheseinformation. provides results in one hour, and we extend their work for
t t
Hence,theexpressionofthecellstatec keepsthesameasin thefuturethreehours. Additionally, weevaluatePewLSTM
t
Equation1,andsodoestothehiddenstateh . without periodic patterns denoted as “PewLSTM (w/o peri-
t
odic)”,andPewLSTMwithoutweatherinformationdenoted
FuturePrediction. Topredicttheparkingbehaviorinafu-
as “PewLSTM (w/o weather)”. Note that the algorithms in-
ture time step t+k (k is a positive integer), we recursively
volve a data preprocessing procedure to filter the noisy data
predict the states in the near future, and input the predicted
andthetrainingprocesshas300epochs. Theaccuracyisde-
statesintothemodeltopredictthefartherfuturestates. Note
finedinEquation7.
that the periodic pattern influence also applies to the future
prediction.
jcount (cid:0)count j
4.4 ModelDetails accuracy =1(cid:0) observed predicted (7)
count
observed
OurPewLSTMmodelproposedinSection4.3needsfurther
developmentsfordifferentdataformats. Datasets. Inthispaper,ourparkingdatasetsarecomposed
of parking records from 10 parking lots in China, including
InputLayer. Theinputlayerreceivestheinputdataforpre- shoppingmalls,hotels,communities,andsoon6. Welistthe
processing. In our model, the processing granularity is one
total number of parking spaces, parking records, surround-
hour,soparkingrecordsareconvertedonanhourlygranular-
ings,andlocationforeachparkinglotinTable1. Thedataset
ity. Along with the parking records, the input weather data,
spans 23 months from October 16th, 2017 to August 30th,
including temperature T, humidity H, precipitation P, and
2019,whichconsistsof452,480parkingrecordsin683days.
windspeedW, arenormalizedto[0,1]. Forexample, asfor
For each record, we obtain the parking information includ-
temperature,thecorrespondingsequenceforthepastK time
ing the arrival time, the departure time, date, parking space,
steps is T = fT ;:::;T ;T g, where T represents
t(cid:0)K t(cid:0)2 t(cid:0)1 i andtheprice. Pleasenotethattheparkingrecordswithadu-
thetemperatureofthepasti-thhour.
ration of less than five minutes are regarded as noise data.
DeepPewLSTMLayers. Differentfromtraditionalsingle- Therelatedweatherdatasetincludesthehourlyweatherdata
layerLSTM,westackmultiplePewLSTMlayerstogetherto from four districts where the 10 parking lots are built. For
form a deep neural network to capture the relations among eachhour,wecollecttherelatedweatherinformationinclud-
parkingrecordsandotherusefulfactors.BetweentwoPewL- ingtemperature,windspeed,precipitation,andhumidity.
STMlayers,theoutputofaPewLSTMblockinonelayeris
theinputtoaPewLSTMblockinthefollowinglayer. 6https://github.com/NingxuanFeng/PewLSTM
4428

ProceedingsoftheTwenty-NinthInternationalJointConferenceonArtificialIntelligence(IJCAI-20)
SpecialTrackonAIforComputationalSustainabilityandHumanWell-being
100 regression simple LSTM PewLSTM (w/o periodic) PewLSTM (w/o weather) PewLSTM
80
)%( ycarucca
60
40
20
0
P1 P2 P3 P4 P5 P6 P7 P8 P9 P10 P1 P2 P3 P4 P5 P6 P7 P8 P9 P10 P1 P2 P3 P4 P5 P6 P7 P8 P9 P10
|     |     |     | 1 hour |     |     | 2 hours |     |     | 3 hours |     |     |
| --- | --- | --- | ------ | --- | --- | ------- | --- | --- | ------- | --- | --- |
Figure6:Arrivalpredictionaccuracy.
100
|     |     |     | simple LSTM | PewLSTM (w/o periodic) |     | PewLSTM (w/o weather) |     | PewLSTM |     |     |     |
| --- | --- | --- | ----------- | ---------------------- | --- | --------------------- | --- | ------- | --- | --- | --- |
)%( ycarucca 80
60
40
20
0
P1 P2 P3 P4 P5 P6 P7 P8 P9 P10 P1 P2 P3 P4 P5 P6 P7 P8 P9 P10 P1 P2 P3 P4 P5 P6 P7 P8 P9 P10
|     |     |     | 1 hour |     |     | 2 hours |     |     | 3 hours |     |     |
| --- | --- | --- | ------ | --- | --- | ------- | --- | --- | ------- | --- | --- |
Figure7:Departurepredictionaccuracy.
| 5.2 PredictionAccuracyEvaluation |     |     |     |     |     | 5.3 Deployment |      |      |               |        |        |
| -------------------------------- | --- | --- | --- | --- | --- | -------------- | ---- | ---- | ------------- | ------ | ------ |
|                                  |     |     |     |     |     | Our periodic   | LSTM | with | weather-aware | gating | mecha- |
WeshowthearrivalpredictionaccuracyinFigure6,andthe nism has been integrated into a real smart parking system,
departure prediction accuracy in Figure 7. We have the fol- ThsParking, whichisdesignedtoprovideuserswithconve-
lowingfindings. nientandfastparking. Thesystemmainlyprovidesservices
ofonlinepayment,smartself-parkingbyphones,andparking
First,ourperiodicLSTMwithweather-awaregatingmech-
spacereservation.
anismachievesthehighestpredictionaccuracyinmostcases.
Forarrivals,PewLSTMachievesanaccuracyof85.3%inone
|                                            |     |     |     |     |        | 6 Conclusion |     |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | --- | ------ | ------------ | --- | --- | --- | --- | --- |
| hour,76.4%intwohours,and68.6%inthreehours. |     |     |     |     | Incon- |              |     |     |     |     |     |
trast, theregressionmethodachieves57.8%accuracyinone Inthispaper,wearguethatperiodicpatternsshallbeinvolved
hour,51.2%intwohours,and50.0%inthreehours. Forde- inparkingbehaviorprediction. Wehaveshownthatparking
| partures,   | PewLSTM | achieves | an accuracy | of 84.6%        | in one |                |                |          |              |          |         |
| ----------- | ------- | -------- | ----------- | --------------- | ------ | -------------- | -------------- | -------- | ------------ | -------- | ------- |
|             |         |          |             |                 |        | behaviors      | exhibit strong | periodic | patterns,    | and such | parking |
| hour, 73.1% | in two  | hours,   | and 68.5%   | in three hours. | The    |                |                |          |              |          |         |
|             |         |          |             |                 |        | patterns shall | be retained    | in       | classic LSTM | models.  | To ad-  |
“PewLSTM (w/o periodic)” and “PewLSTM(w/o weather)” dressthisproblem,weproposedanovelperiodicLSTMwith
achieve a moderate accuracy that is higher than the simple weather-awaregatingmechanismsforparkingbehaviorpre-
LSTM.Thisimpliesthatperiodicpatternsandweatherinfor- diction, which considers the periodic patterns from parking
mationareusefulforimprovingpredictionaccuracy.
|     |     |     |     |     |     | recordsandweatherdata. |     | Weexhibitedourmodel,datacol- |     |     |     |
| --- | --- | --- | --- | --- | --- | ---------------------- | --- | ---------------------------- | --- | --- | --- |
Second, with the growth of the prediction time, the pre- lection, and data processing in detail. We evaluate our pro-
diction accuracy decreases. In our method, to predict park- posedmodelwith10parkinglotsindifferentcities, andex-
perimentsshowthatourmodelachieves85.3%predictionac-
ingbehavioratafartimepoint,werecursivelyinputthepre-
|                                                          |     |     |                         |          |     | curacy, which     | is about | 20% | higher than | the state-of-the-art |     |
| -------------------------------------------------------- | --- | --- | ----------------------- | -------- | --- | ----------------- | -------- | --- | ----------- | -------------------- | --- |
| dictedresultsinaneartimepointintothemodel.               |     |     |                         | Weusethe |     |                   |          |     |             |                      |     |
| predictedresultsastrainingdata,whichinevitablyintroduces |     |     |                         |          |     | predictionmethod. |          |     |             |                      |     |
| uncertaintiesandnoisefactors.                            |     |     | However,ourPewLSTMstill |          |     |                   |          |     |             |                      |     |
maintains high accuracy in terms of long-term predictions: Acknowledgments
foreveryadditionalhourofprediction,theaccuracydropsby This work is supported by the National Key R&D Program
only8.5%forarrivalsand7.9%fordeparturesonaverage. of China (Grant No. 2017YFB1003103), National Natu-
Third,thearrivalpredictionaccuracyishigherthanthede- ral Science Foundation of China (Grant No. 61802412,
parturepredictionaccuracy. Thereasonisthatdeparturesit- 61732014, 61972403), Beijing Natural Science Foundation
uationsaremorecomplexthanarrivalsituations. Thedepar- (4202031, L192027), Beijing Academy of Artificial Intelli-
ture is also affected by the purpose or event from the driver gence (BAAI), Tsinghua University Initiative Scientific Re-
sideduringparking,whichishardtocapture. However,even searchProgram(20191080594),andHuachingTech. Jidong
in the departure prediction, our prediction accuracy is only Zhai,JiazaoLin,andXiaoyongDuarethecorrespondingau-
| 1.2%lowerthanthatinarrivalprediction. |     |     |     |     |     | thorsofthispaper. |     |     |     |     |     |
| ------------------------------------- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- |
4429

ProceedingsoftheTwenty-NinthInternationalJointConferenceonArtificialIntelligence(IJCAI-20)
SpecialTrackonAIforComputationalSustainabilityandHumanWell-being
References [Liawetal.,2002] AndyLiaw,MatthewWiener,etal. Clas-
|                     |     |       |        |      |     |         | sificationandregressionbyrandomForest. |     |     |     | Rnews,2002. |
| ------------------- | --- | ----- | ------ | ---- | --- | ------- | -------------------------------------- | --- | --- | --- | ----------- |
| [AlhoandSilva,2014] |     | André | Romano | Alho | and | João de |                                        |     |     |     |             |
Abreu e Silva. Freight-trip generation model: predicting [PierceandShoup,2013] Gregory Pierce and Donald
urban freight weekly parking demand from retail estab- Shoup. Getting the prices right: an evaluation of pricing
lishmentcharacteristics. TransportationResearchRecord, parking by demand in San Francisco. Journal of the
| 2014. |     |     |     |     |     |     | AmericanPlanningAssociation,2013. |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | --------------------------------- | --- | --- | --- | --- |
[Badiietal.,2018] Claudio Badii, Paolo Nesi, and Irene [Romanetal.,2018] Cristian Roman, Ruizhi Liao, Peter
Paoli. Predicting available parking slots on critical and Ball, Shumao Ou, and Martin de Heaver. Detecting on-
regularservicesbyexploitingarangeofopendata. IEEE streetparkingspacesinsmartcities: performanceevalua-
Access,2018. tionoffixedandmobilesensingsystems. IEEETransac-
[Caicedoetal.,2012] tionsonIntelligentTransportationSystems,2018.
|     |     | Felix | Caicedo, | Carola | Blazquez, | and |     |     |     |     |     |
| --- | --- | ----- | -------- | ------ | --------- | --- | --- | --- | --- | --- | --- |
PabloMiranda. Predictionofparkingspaceavailabilityin [Rumelhartetal.,1986] David E Rumelhart, Geoffrey E
realtime. ExpertSystemswithApplications,2012. Hinton,andRonaldJWilliams. Learningrepresentations
|             |           |     |                               |     |     |     | byback-propagatingerrors. |     | nature,1986. |     |     |
| ----------- | --------- | --- | ----------------------------- | --- | --- | --- | ------------------------- | --- | ------------ | --- | --- |
| [Chen,2014] | XiaoChen. |     | Parkingoccupancypredictionand |     |     |     |                           |     |              |     |     |
patternanalysis. Dept.Comput.Sci.,StanfordUniv.,Stan- [SafavianandLandgrebe,1991] S Rasoul Safavian and
ford,CA,USA,Tech.Rep.CS229-2014,2014. David Landgrebe. A survey of decision tree classifier
|                  |     |                                |     |     |     |     | methodology. | IEEE transactions | on  | systems, | man, and |
| ---------------- | --- | ------------------------------ | --- | --- | --- | --- | ------------ | ----------------- | --- | -------- | -------- |
| [Fangetal.,2017] |     | JuanFang,AonanMa,HaokunFan,Min |     |     |     |     |              |                   |     |          |          |
cybernetics,1991.
| Cai,andShuyingSong. |     |     | Researchonsmartparkingguid- |     |     |     |     |     |     |     |     |
| ------------------- | --- | --- | --------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
[Shahzadetal.,2018]
anceandparkingrecommendationalgorithm. In8thIEEE Aamir Shahzad, Jae-young Choi,
International Conference on Software Engineering and Naixue Xiong, Young-Gab Kim, and Malrey Lee. Cen-
ServiceScience,2017. tralizedconnectivityformultiwirelessedgecomputingand
cellularplatform:asmartvehicleparkingsystem.Wireless
| [Fengetal.,2019] |     | NingxuanFeng,FengZhang,JiazaoLin, |     |     |     |     |     |     |     |     |     |
| ---------------- | --- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
CommunicationsandMobileComputing,2018.
| Jidong | Zhai, and | Xiaoyong | Du. | Statistical | analysis | and |                         |                                |     |     |     |
| ------ | --------- | -------- | --- | ----------- | -------- | --- | ----------------------- | ------------------------------ | --- | --- | --- |
|        |           |          |     |             |          |     | [Vlahogiannietal.,2016] | EleniIVlahogianni,Konstantinos |     |     |     |
predictionofparkingbehavior.InIFIPInternationalCon-
ferenceonNetworkandParallelComputing,2019. Kepaptsoglou, Vassileios Tsetsos, and Matthew G Kar-
|                |                                    |     |     |     |     |     | laftis. A | real-time parking | prediction | system | for smart |
| -------------- | ---------------------------------- | --- | --- | --- | --- | --- | --------- | ----------------- | ---------- | ------ | --------- |
| [Fuetal.,2019] | TianfanFu,TrongNghiaHoang,CaoXiao, |     |     |     |     |     |           |                   |            |        |           |
cities.JournalofIntelligentTransportationSystems,2016.
| andJimengSun. |     | DDL:Deepdictionarylearningforpre- |     |     |     |     |     |     |     |     |     |
| ------------- | --- | --------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
dictivephenotyping. InIJCAI,2019. [Wangetal.,2019] Jia Wang, Tong Sun, Benyuan Liu,
|             |       |       |          |       |             |     | Yu Cao, | and Hongwei Zhu. | CLVSA: | A   | convolutional |
| ----------- | ----- | ----- | -------- | ----- | ----------- | --- | ------- | ---------------- | ------ | --- | ------------- |
| [Hans,2009] | Chris | Hans. | Bayesian | lasso | regression. |     |         |                  |        |     |               |
LSTMbasedvariationalsequence-to-sequencemodelwith
Biometrika,2009.
|                                 |     |     |     |      |            |     | attentionforpredictingtrendsoffinancialmarkets. |     |     |     | InIJ- |
| ------------------------------- | --- | --- | --- | ---- | ---------- | --- | ----------------------------------------------- | --- | --- | --- | ----- |
| [HochreiterandSchmidhuber,1997] |     |     |     | Sepp | Hochreiter | and |                                                 |     |     |     |       |
CAI,2019.
Neural
| Jürgen | Schmidhuber. | Long | short-term |     | memory. |     |                  |                                  |     |     |     |
| ------ | ------------ | ---- | ---------- | --- | ------- | --- | ---------------- | -------------------------------- | --- | --- | --- |
|        |              |      |            |     |         |     | [Xingetal.,2019] | BowenXing,LejianLiao,DandanSong, |     |     |     |
computation,1997.
|     |     |     |     |     |     |     | Jingang Wang, | Fuzhen Zhang, | Zhongyuan |     | Wang, and |
| --- | --- | --- | --- | --- | --- | --- | ------------- | ------------- | --------- | --- | --------- |
[Hössingeretal.,2014] Reinhard Hössinger, Peter Wid- HeyanHuang. Earlierattention? aspect-awareLSTMfor
halm, Michael Ulm, Klaus Heimbuchner, Eike Wolf, aspect-basedsentimentanalysis. InIJCAI,2019.
| RolandApel,andTinaUhlmann. |     |     |     | Developmentofareal- |     |     |                 |           |          |            |         |
| -------------------------- | --- | --- | --- | ------------------- | --- | --- | --------------- | --------- | -------- | ---------- | ------- |
|                            |     |     |     |                     |     |     | [Yooetal.,2008] | Seong-eun | Yoo, Poh | Kit Chong, | Taehong |
timemodeloftheoccupancyofshort-termparkingzones.
|               |         |     |             |                |     |      | Kim, Jonggu                   | Kang, Daeyoung | Kim, | Changsub         | Shin, |
| ------------- | ------- | --- | ----------- | -------------- | --- | ---- | ----------------------------- | -------------- | ---- | ---------------- | ----- |
| International | Journal | of  | Intelligent | Transportation |     | Sys- |                               |                |      |                  |       |
|               |         |     |             |                |     |      | KyungbokSung,andByungtaeJang. |                |      | PGS:ParkingGuid- |       |
temsResearch,2014.
anceSystembasedonwirelesssensornetwork.InInterna-
[Huangetal.,2019] Ting Huang, Gehui Shen, and Zhi- tionalSymposiumonWirelessPervasiveComputing,2008.
| Hong                         | Deng. Leap-LSTM: |     | Enhancing | Long          | Short-Term |     |                   |             |     |       |                |
| ---------------------------- | ---------------- | --- | --------- | ------------- | ---------- | --- | ----------------- | ----------- | --- | ----- | -------------- |
|                              |                  |     |           |               |            |     | [Zhangetal.,2019] | Yuan Zhang, | Xi  | Yang, | Julie Ivy, and |
| MemoryforTextCategorization. |                  |     |           | InIJCAI,2019. |            |     |                   |             |     |       |                |
MinChi.ATTAIN:attention-basedtime-awareLSTMnet-
[Idrisetal.,2009] MYI Idris, EM Tamil, NM Noor, worksfordiseaseprogressionmodeling. InIJCAI,2019.
ZRazak,andKWFong.Parkingguidancesystemutilizing
|     |     |     |     |     |     |     | [Zhengetal.,2015] | Yanxu Zheng, | Sutharshan |     | Rajasegarar, |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | ------------ | ---------- | --- | ------------ |
wirelesssensornetworkandultrasonicsensor.Information
andChristopherLeckie.Parkingavailabilitypredictionfor
TechnologyJournal,2009.
|     |     |     |     |     |     |     | sensor-enabledcarparksinsmartcities. |     |     | InIEEETenthIn- |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------------ | --- | --- | -------------- | --- |
[Kongetal.,2017]
Weicong Kong, Zhao Yang Dong, ternationalConferenceonIntelligentSensors,SensorNet-
YouweiJia,DavidJHill,YanXu,andYuanZhang. Short- worksandInformationProcessing,2015.
termresidentialloadforecastingbasedonLSTMrecurrent
| neuralnetwork.                   |             | IEEETransactionsonSmartGrid,2017. |     |           |             |        |     |     |     |     |     |
| -------------------------------- | ----------- | --------------------------------- | --- | --------- | ----------- | ------ | --- | --- | --- | --- | --- |
| [LeCessieandVanHouwelingen,1992] |             |                                   |     | Saskia    | Le          | Cessie |     |     |     |     |     |
| and Johannes                     | C           | Van Houwelingen.                  |     | Ridge     | estimators  | in     |     |     |     |     |     |
| logistic                         | regression. | Journal                           | of  | the Royal | Statistical | Soci-  |     |     |     |     |     |
ety: SeriesC(AppliedStatistics),1992.
4430