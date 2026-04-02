5896 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.34,NO.12,DECEMBER2022
Periodic Weather-Aware LSTM With Event
Mechanism for Parking Behavior Prediction
FengZhang ,YaniLiu,NingxuanFeng,ChengYang ,JidongZhai ,ShuhaoZhang,BingshengHe,
JiazaoLin,XiaoZhang,andXiaoyongDu
Abstract—Thereareplentyofparkingspacesinbigcities,butweoftenfindnowheretopark.Forexample,NewYorkhas1.4million
carsand4.4millionon-streetparkingspaces,butitisstillnoteasytofindaparkingplacenearourdestination,especiallyduringpeak
hours.Thereasonisthelackofpredictionofparkingbehavior.Ifwecouldprovideparkingbehaviorinadvance,wecaneasethis
parkingproblemthataffectshumanwell-being.Weobservethatparkinglotshaveperiodicparkingpatterns,whichisanimportant
factorforparkingbehaviorprediction.Unfortunately,existingworkignoressuchperiodicparkingpatternsinparkingbehavior
prediction,andthusincurslowaccuracy.Tosolvethisproblem,weproposePewLSTM,anovelperiodicweather-awareLSTMmodel
thatsuccessfullypredictstheparkingbehaviorbasedonhistoricalrecords,weather,environments,weekdays,andevents.PewLSTM
includesaperiodicweather-awareLSTMpredictionmoduleandaneventpredictionmodule,forpredictingparkingbehaviorsinregular
daysandevents.PewLSTMisextremelyusefulfordriversandparkinglotownerstoimprovecustomerexperience.Forexample,the
probabilityofparkingspacethatwillbeavailablesooncanbeprovidedeveniftheparkinglotisfull.Basedon910,477realparking
recordsin904daysfrom13parkinglots,PewLSTMyields93.84%parkingpredictionaccuracy,whichisabout30%higherthanthe
state-of-the-artparkingbehaviorpredictionmethod.Additionally,wehaveanalyzedparkingbehaviorsineventslikeholidaysand
COVID-19.PewLSTMcanhandleparkingbehaviorpredictionineventsandreaches90.68percentaccuracy.
IndexTerms—Periodic,weather-aware,LSTM,eventmechanism,parkingbehaviorprediction,COVID-19
Ç
1 INTRODUCTION which can also be converted into the number of available
parking spaces. Clearly, if we could provide the parking
WEoftenfind it hard to find a parkingspace in bigcit-
behavior in advance, we can ease such a parking problem
ies. However, in building cities, designers usually
thataffectshumanwell-being.
reserve enough parking spaces. For example, New York
AI technology has transformed our everyday lives in
has at least 4.4 million on-street parking spaces [1], but
manyaspects,andnowAIisshapingourparkingbehavior.
hasonly1.4millioncars[2].The reasonwhyitisnot easy
MoreintelligentparkinglotswithAImanagementsystems
to find a parking place, especially during peak hours, is
appearinourcities.Amongtheintelligentparkingmanage-
the lack of prediction of parking behavior. In this paper,
mentsystems,providingtheparkingbehaviorpredictionis
for a parking lot, we express parking behavior as the
themostcriticalandbeneficialfunction.First,accuratepre-
number of parking arrivals and departures in one hour,
dictionscansaveustimeandefforttofindaproperparking
space.Forexample,amotoristinNewYorkspendsanaver-
(cid:1) FengZhang,YaniLiu,XiaoZhang,andXiaoyongDuarewiththeKey age of 107 hours per year on finding a parking space [3],
LaboratoryofDataEngineeringandKnowledgeEngineering,Ministryof while such time waste could be saved when we obtain the
Education, School of Information, Renmin University of China, Beijing
parking behavior for the expected parking lots in advance.
100872, China. E-mail: {fengzhang, zhangxiao, duyong}@ruc.edu.cn,
liuyn1999@gmail.com. Second, based on the precise parking behavior prediction,
(cid:1) Ningxuan Feng and Jidong Zhai are with the Department of Computer the parking lots can be utilized more efficiently, and park-
ScienceandTechnology,TsinghuaUniversity,Beijing100084,China.
ing space reservations can also be made based on the pre-
E-mail:whitycatty@gmail.com,zhaijidong@tsinghua.edu.cn.
diction. Third, based on the parking behavior prediction,
(cid:1) ChengYangiswiththeSchoolofComputerScience,BeijingUniversityof
PostsandTelecommunications,Beijing100876,China. the department of transportation is better able to under-
E-mail:albertyang33@gmail.com. stand the traffic conditions and dispatch resources such as
(cid:1) ShuhaoZhangiswithInformationSystemsTechnologyandDesignpil-
trafficpolice.However,parkingbehaviorishardtopredict,
lar,SingaporeUniversityofTechnologyandDesign,487372,Singapore.
E-mail:shuhao_zhang@sutd.edu.sg. since it can be affected by many factors, such as weather,
(cid:1) Bingsheng He is with the School of Computing, National University of weekdays,andenvironments.
Singapore,Singapore119077,Singapore.E-mail:hebs@comp.nus.edu.sg. Many intelligent parking methods and systems have
(cid:1) Jiazao Lin is with the Department of Information Management, Peking
beendevelopedinrecentyears,suchaspricingparking[4],
University,Beijing100871,China,andalsowiththeInstituteofAutoma-
tion,ChineseAcademyofSciences,Beijing100190,China. on-street parking [5], smart vehicle parking [6], and smart
E-mail:linjz@pku.edu.cn. parking guidance [7]. However, none of these works
Manuscriptreceived11Aug.2020;revised21Jan.2021;accepted17Mar.2021. involve parking behavior prediction. A real-time parking
Dateofpublication31Mar.2021;dateofcurrentversion7Nov.2022. space availability system [8] has been developed, but this
(Correspondingauthors:JidongZhaiandXiaoyongDu.)
work only considers historical records. The state-of-the-art
RecommendedforacceptancebyM.Cheema.
DigitalObjectIdentifierno.10.1109/TKDE.2021.3070202 parking behavior prediction research [9] used regression
1041-4347©2021IEEE.Personaluseispermitted,butrepublication/redistributionrequiresIEEEpermission.
Seeht_tps://www.ieee.org/publications/rights/index.htmlformoreinformation.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore. Restrictions apply.

ZHANGETAL.:PERIODICWEATHER-AWARELSTMWITHEVENTMECHANISMFORPARKINGBEHAVIORPREDICTION 5897
methodsregardingparkingrecordsandweather.However, parking system, ThsParking [12] (developed by Huaching
Tech1),
we find that their method only considers parking arrivals which is one of the top smart parking platforms in
without departures, and ignores the periodic parking pat- China. Based on the prediction, the parking system can
terns,whichincurslowaccuracy.Evenworse,theycanonly launch a segmented pricing strategy to utilize parking
predictparkingbehaviorinonehour,whilewearelooking spacesbetterandgainmoreprofit.
forwardtoalong-termprediction. We evaluate PewLSTM with real parking records. We
Buildinganaccuratelong-termparkingbehaviorpredic- collect 910,477 parking records from 13 parking lots. These
tion system requires overcoming four challenges. The first recordscomefromdifferentenvironments,includinghotels,
challenge is to find an appropriate model that can under- shopping malls, and streets. Along with these parking
stand the complicated parking-related behaviors by using records, we have collected related weather and date infor-
historical records and other factors such as weather and mation.Whenpredictingparkingbehaviorinthenexthour,
time information. The second challenge is how to involve PewLSTM achieves 93.84% arrival accuracy and 93.34%
the complex periodic parking patterns, including the influ- departure accuracy. For the next two hours, PewLSTM
ence from a specific time in the past.For example,custom- achieves 76.78% arrival accuracy and 73.45% departure
ers would like to drive to a shopping mall every Friday accuracy. For the next three hours, its arrival accuracy is
nightfordiscounts,andsuchpatternsshouldbeintegrated. 67.54% and its departure accuracy is 67.48%. On average,
Thethirdchallengeishowtopredictparkingbehaviorfora PewLSTM achieves 30% higher accuracy than the state-of-
long time in the future with the current data. The fourth the-artparkingpredictionmethod[9].
challengeishowtopredictparkingbehaviorinevents. We further evaluate PewLSTM in supporting parking
WeproposePewLSTM,aperiodicweather-awareLSTM
|     |     |     |     |     |     |     |     | behavior |     | prediction | in events. | We  | have | analyzed | the park- |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | ---------- | ---------- | --- | ---- | -------- | --------- |
model for long-term car parking behavior prediction. ing behaviors in regular events like holidays, and unex-
PewLSTM is extremely useful for drivers and parking lot pected events like coronavirus pandemic (COVID-19) [11].
owners to improve customer experience. For example, the Wedevelopsolutionstoidentifyeventsbasedonhistorical
probabilityofparkingspacethatwillbeavailablesooncan records and perform prediction for parking behaviors in
beprovidedeveniftheparkinglotisfull.Ourpreliminary events in the future. In our experiments, we measure the
workhasbeenpresentedin[10],whichsupportsonlydaily prediction accuracy at day granularity for the event one to
parking behavior prediction, and we extend it to support three months ahead. For the one month ahead prediction,
parking behavior prediction in events in this work. In con- PewLSTM achieves 89.52 percent accuracy. For the two
trast to [10], we develop novel technologies for PewLSTM monthsaheadprediction,PewLSTMachieves90.68percent
to predict parking behaviors in events, because large-scale accuracy.Forthethreemonthsaheadprediction,PewLSTM
events, such as festival activities and COVID-19 [11], also achieves89.89percentaccuracy.
haveagreatimpactonparkingbehaviors.Weanalyzeregu- Wesummarizeourcontributionsasfollows.
lareventssuchasnewyear,andunexpectedeventssuchas
|          |     |             |      |           |     |        |         |     | (cid:1) We | exhibit | our | observations, | insights, |     | and rules |
| -------- | --- | ----------- | ---- | --------- | --- | ------ | ------- | --- | ---------- | ------- | --- | ------------- | --------- | --- | --------- |
| COVID-19 | in  | this paper. | When | impactful |     | events | happen, |     |            |         |     |               |           |     |           |
PewLSTMswitchestotheneweventpredictionmodulefor about the periodic patterns from different parking
records,typesofparkinglots,andweatherfactors.
| parking           | behavior | prediction |                    | in events. | Moreover, |          | we add  |     |            |         |          |            |          |               |     |
| ----------------- | -------- | ---------- | ------------------ | ---------- | --------- | -------- | ------- | --- | ---------- | ------- | -------- | ---------- | -------- | ------------- | --- |
|                   |          |            |                    |            |           |          |         |     | (cid:1) We | propose | PewLSTM, | a          | periodic | weather-aware |     |
| new optimizations |          | on         | datapreprocessing, |            |           | accuracy | tuning, |     |            |         |          |            |          |               |     |
|                   |          |            |                    |            |           |          |         |     | LSTM       | with    | event    | mechanism, | which    | incorporates  |     |
andperformanceaccelerationtoimprovebothaccuracyand
|              |     |             |     |             |     |     |         |     | the | weather | and periodic | parking |     | patterns | for park- |
| ------------ | --- | ----------- | --- | ----------- | --- | --- | ------- | --- | --- | ------- | ------------ | ------- | --- | -------- | --------- |
| performance, |     | and conduct | new | experiments |     | on  | PewLSTM |     |     |         |              |         |     |          |           |
ingbehaviorprediction.
| to verify | the performance |     | benefits |     | from our | new | optimiza- |     |     |     |     |     |     |     |     |
| --------- | --------------- | --- | -------- | --- | -------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
(cid:1) Weanalyzetheparkingbehaviorsinevents,includ-
tionswithlargerdatasets.
Our system consists of four parts: an input layer with a ing regular events like holidays and unexpected
eventslikeCOVID-19,andprovideoursolution.
| classifier, | a deep | PewLSTM |     | module, | an  | event | prediction |     |            |          |         |      |      |         |         |
| ----------- | ------ | ------- | --- | ------- | --- | ----- | ---------- | --- | ---------- | -------- | ------- | ---- | ---- | ------- | ------- |
|             |        |         |     |         |     |       |            |     | (cid:1) We | evaluate | PewLSTM | with | real | parking | records |
module,andanoutputlayerintegratedwithalinearlayer.
anditachieves93.84%accuracy,whichisabout30%
| First, to | depict | the parking |     | behavior | for | a parking | lot, we |     |     |     |     |     |     |     |     |
| --------- | ------ | ----------- | --- | -------- | --- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
higherthanthestate-of-the-artmethod.
| use both   | the    | arrivals | and | departures, | because   |     | these two  |     |     |     |     |     |     |     |     |
| ---------- | ------ | -------- | --- | ----------- | --------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
| indicators | depict | changes  | in  | parking     | vehicles. |     | Second, to |     |     |     |     |     |     |     |     |
involve weather information, we add input gates for 2 BACKGROUND
weatherinformationintotheLSTMblock.Thecellstateand
|        |       |             |     |         |          |     |            | As  | far as | we know, | this | work is the | first | to use | the LSTM- |
| ------ | ----- | ----------- | --- | ------- | -------- | --- | ---------- | --- | ------ | -------- | ---- | ----------- | ----- | ------ | --------- |
| hidden | state | are decided |     | by both | previous |     | states and |     |        |          |      |             |       |        |           |
basedmethodtopredictparkingbehaviorbyusingrecords
| weather | information. |     | Third, | to utilize | the | periodic | parking |     |     |     |     |     |     |     |     |
| ------- | ------------ | --- | ------ | ---------- | --- | -------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
alongwithweatherinformation.
| patterns | from | historical | records, | we  | add | special | gates into |     |     |     |     |     |     |     |     |
| -------- | ---- | ---------- | -------- | --- | --- | ------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
theLSTMblocktoinputthehiddenstatesfrompastspecific
2.1 VehicleParking
| time steps | when | certain | conditions |     | are | met, | such as the |     |     |     |     |     |     |     |     |
| ---------- | ---- | ------- | ---------- | --- | --- | ---- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
sametimeinpreviousweekdays.Fourth,topredictparking Many studies have been conducted on different aspects of
behaviorinevents,webuildapolynomialmodeltoanalyze vehicleparking,includingparkingdemandprediction[13],
|            |     |          |             |     |          |            |     | smart | parking |     | guidance | [7], [14], | [15], | parking | space pre- |
| ---------- | --- | -------- | ----------- | --- | -------- | ---------- | --- | ----- | ------- | --- | -------- | ---------- | ----- | ------- | ---------- |
| the events | in  | history. | For parking |     | behavior | prediction | in  |       |         |     |          |            |       |         |            |
events,wefindthepatternsinhistory,performpolynomial diction [8], [16], [17], [18], [19], [20], and parking behavior
modelfitting,andthenperformmodeladaptation. prediction [9]. The regression-based parking behavior
Ourproposedperiodicweather-awareLSTMwithevent
mechanism, PewLSTM, has been integrated into a real 1.http://www.huaching.com/
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

5898 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.34,NO.12,DECEMBER2022
| prediction | [9]     | is the closest | work  | to    | PewLSTM,   |        | which also  |     |     |     |     |     |     |     |     |
| ---------- | ------- | -------------- | ----- | ----- | ---------- | ------ | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| considers  | weather | conditions.    |       | They  | explored   | linear | regres-     |     |     |     |     |     |     |     |     |
| sion [21], | ridge   | regression     | [22], | Lasso | regression |        | [23], deci- |     |     |     |     |     |     |     |     |
siontree[24],andrandomforest[25]topredicttheparking
arrivalsinonehour,andfoundthatrandomforestachieves
thehighestaccuracy.
However,thework[9]hasthreelimitations.First,itpro-
videsthepredictionforonlyparkingarrivals,withoutdepar-
| tures. Departures |        | are equally |         | important | as   | to arrivals, | and       |     |     |     |     |     |     |     |     |
| ----------------- | ------ | ----------- | ------- | --------- | ---- | ------------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
| they together     | define | the         | parking | behavior. |      | Second,      | it does   |     |     |     |     |     |     |     |     |
| not provide       | the    | prediction  | results | for       | more | than         | one hour, |     |     |     |     |     |     |     |     |
whichlimitstheapplicability,sinceusersmayplantobooka
| parking | space | in an uncertain |     | future. | Third, | their | method |     |     |     |     |     |     |     |     |
| ------- | ----- | --------------- | --- | ------- | ------ | ----- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
failstocapturetheperiodicpatternsfromlongperiods.For
example,theparkingspaceavailabilitymayhavestrongcor-
| relations | with | previous | parking | patterns, |     | such as | weekday |     |     |     |     |     |     |     |     |
| --------- | ---- | -------- | ------- | --------- | --- | ------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
andholidaypatterns.Evenworse,thework[9]usedrecords
fromonlyoneparkinglotforvalidation,whichcannotrepre-
| sent all | parking | lots. Different |     | types | of parking |     | lots exhibit |     |     |     |     |     |     |     |     |
| -------- | ------- | --------------- | --- | ----- | ---------- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
variousparkingbehaviors,andthelocationsofparkinglots
haveahighinfluenceonparkingbehaviors.Forexample,in
Fig.1.Systemoverview.
| holidays, | the parking |     | lots near | a shopping |     | mall | are busy |     |     |     |     |     |     |     |     |
| --------- | ----------- | --- | --------- | ---------- | --- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
whiletheparkinglotsinanindustrialareaareidle.
ParkingBehaviorDefinition.Inthisstudy,theparkingbehav-
iorforaparkinglotisdefinedbyitsarrivalsanddepartures,as
2.2 RecurrentNeuralNetwork
shownbelow.Nrepresentsthenaturalnumberdomain.
Recurrentneuralnetwork(RNN)[26]isaneuralnetworkthat
incorporatestemporalsequencedataasinput.RNNperforms (cid:1) Arrivals. The sequence of the number of arrivals for
|     |     |     |     |     |     |     |     |     | the | past | K time | steps is CC ¼fc | ;... | ;c t(cid:4)2;c | t(cid:4)1g2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | ------ | --------------- | ---- | -------------- | ----------- |
recursionalongthetemporalsequence.LongShort-TermMem- t(cid:4)K
NK,wheretrepresentsthecurrenttimeandc
| ory(LSTM)[27]isakindofRNNanditsbasicunitisacellor |     |     |     |     |     |     |     |     |     |     |     |     |     |     | irepre- |
| ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- |
called LSTM block. An LSTM block is usually composed of sents the parking number of arrivals of the past ith
| inputgates,forgetgates,andoutputgates,whichcancapture |     |     |     |     |     |     |     |     | hour.               |     |     |             |            |     |           |
| ----------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------- | --- | --- | ----------- | ---------- | --- | --------- |
|                                                       |     |     |     |     |     |     |     |     | (cid:1) Departures. |     | The | sequence of | the number |     | of depar- |
thecomplexnon-linearrelationsamongdifferentfactors.LSTM
;...;
hasbeenappliedtodifferentaspectsofourdailylife,suchas tures for the past K time steps is DD¼fd t(cid:4)K
t(cid:4)1g2NK,wheretrepresentsthecurrenttime
financial market prediction [28], disease progression model- d t(cid:4)2;d
|     |     |     |     |     |     |     |     |     | andd | representsthe |     | parking | number | of departures |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | ------------- | --- | ------- | ------ | ------------- | --- |
ing [29], predictive phenotyping [30], text categorization [31], i
ofthepastithhour.
| and sentiment |     | analysis | [32]. Particularly, |     | LSTM | conquers | the |     |     |     |     |     |     |     |     |
| ------------- | --- | -------- | ------------------- | --- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
limitationsthatthestate-of-the-artparkingbehaviorprediction EventPrediction.Inthispaper,theeventpredictionrefers
method[9]failstoconsiderfromlongandshortterms. to the parking behavior prediction with event influence,
|     |     |     |     |     |     |     |     | including |     | the arrivals | and | departures, | in  | the entire | event |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --- | ------------ | --- | ----------- | --- | ---------- | ----- |
AtypicalLSTMmodelcanbeformulizedasthefollowing
equations,whereatthetimestept,h representsthehidden timeframe.
t
state,x trepresentstheinputvector,c trepresentsthecellsate, Significance. Different from parking space prediction,
andf i ando parking behavior prediction contains more information for
| t,  | t,  | t arethe | forget | gate, | inputgate, |     | andoutput |     |     |     |     |     |     |     |     |
| --- | --- | -------- | ------ | ----- | ---------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
andbarerelatedtoweightmatrices.Additionally,s
| gate.W |     |     |     |     |     |     |     | bothusersandownersofparkinglots.Forexample,apark- |     |     |     |     |     |     |     |
| ------ | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
indicates the sigmoid activation function, (cid:3) indicates ele- ing lot is worth waiting if the number of departures d is
t
ment-wisemultiplication,andfindicatesthetanhfunction. large,eveniftheparkinglotisfull.Notethatparkingspace
|     |     |     |     |     |     |     |     | prediction |     | is useless | in  | this case since | the predicted |     | results |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ---------- | --- | --------------- | ------------- | --- | ------- |
¼sðW
ff xx þW hh t(cid:4)1þbb Þ show no vacancy. When we obtain the number of arrivals
|     |     | t   | fx t | fh  |     | f   |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
¼sðW and departures for a parking lot, we can further obtain its
|     |     | ii t | ix xx t þW | ih hh | t(cid:4)1þbb | i Þ |     |        |     |         |       |          |             |     |        |
| --- | --- | ---- | ---------- | ----- | ------------ | --- | --- | ------ | --- | ------- | ----- | -------- | ----------- | --- | ------ |
|     |     |      |            |       |              |     |     | growth | of  | parking | space | usage by | subtracting | the | amount |
¼fðW
|     |     | gg t             | gx xx t þW | gh hh              | t(cid:4)1þbb | g Þ |     |                               |            |      |     |           |           |       |         |
| --- | --- | ---------------- | ---------- | ------------------ | ------------ | --- | --- | ----------------------------- | ---------- | ---- | --- | --------- | --------- | ----- | ------- |
|     |     |                  |            |                    |              |     | (1) | of                            | departures | from | the | amount of | arrivals, | which | is very |
|     |     | oo ¼sðW          | xx þW      | hh                 | t(cid:4)1þbb | Þ   |     |                               |            |      |     |           |           |       |         |
|     |     | t                | ox t       | oh                 |              | o   |     | usefulforsmartparkingsystems. |            |      |     |           |           |       |         |
|     |     | cc ¼gg (cid:3)ii | þcc        | t(cid:4)1(cid:3)ff |              |     |     |                               |            |      |     |           |           |       |         |
|     |     | t t              | t          |                    | t            |     |     |                               |            |      |     |           |           |       |         |
hh ¼fðccÞ(cid:3)oo:
|     |     | t   | t t |     |     |     |     | 3.2 | SystemOverview |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | --- | --- | --- | --- |
WeshowoursystemoverviewinFig.1.Oursystemconsists
|     |     |     |     |     |     |     |     | of  | four | parts: | an input | layer with | a classifier, |     | a deep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---- | ------ | -------- | ---------- | ------------- | --- | ------ |
3 OVERVIEW
PewLSTMmodule,aneventpredictionmodule,andanout-
3.1 ProblemDefinition putlayerintegratedwithalinearlayer.Theclassifieralong
The problem we are trying to solve is how to predict the the input layer provides the probability p of an event at
ti
t
parkingbehaviorforagivenhourinthefuturebyusingthe time by cosine similarity [33], presented in Equation (2),
previousparkingrecordsandweatherinformation. where d and d represent standard and current input. The
|     |     |     |     |     |     |     |     |     | s   |     | i   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

ZHANGETAL.:PERIODICWEATHER-AWARELSTMWITHEVENTMECHANISMFORPARKINGBEHAVIORPREDICTION 5899
deep PewLSTM module and event prediction module are
the major components of our system. The deep PewLSTM
layer consists of PewLSTM blocks, which predicts periodic
weather-aware parking behaviors. The event prediction
module predicts the parking behaviors in events. Both the
results from LSTM module and event prediction module
arefusedasout iandthenfedtotheoutputlayer.
(cid:1) (cid:3)
1 dd (cid:5)dd
pp ¼ 1(cid:4) s i Fig.2.PeriodicparkingpatternsforP2athourgranularity.
ti 2 kdd kkddk
(cid:4) s i (cid:5)
pp
t
¼ pp
t1
;pp
t2
;...;pp
tn
(2)
Observation 1: Periodic Parking Patterns. Periodic park-
oouutt ¼hh (cid:5)ðee(cid:4)ppÞþvv (cid:5)pp
t t t t t ing patterns refer to that the arrivals and departures of a
rr ¼W oouutt þbb :
t ro t r parking lot repeat in a cyclical and predictable manner.
We find that most parking lots follow certain periodic
3.3 Workflow parking patterns. For illustration, we show in Fig. 2 the
parking counts at hour granularity for parking lot P2
The workflow of our system prediction is as follows. First,
(see Table 1), which is close to a commercial street.
the parking records and weather data are input into the
Fig. 2 shows that the parking lot follows a pattern that it
inputlayer.Theinputlayerpreprocessestheinputdataand
is busy during the day (from 9am to 9pm). The reason is
outputstoboththedeepPewLSTMlayerandeventpredic-
that the nearby shops open at 9am and close at 9pm.
tion module. The deep PewLSTM layer outputs the gener-
People go to these shops during the day and this activity
ateddatatotheoutputlayer.Iftheeventpredictionmodule
lasts until the evening. Similar periodic parking patterns
identifiesaspecialevent,themodulealsooutputstheevent
also exist at week and month granularities.
predictionresultstotheoutputlayer.Theoutputlayerana-
Observation 2:Types ofParkingLots. Thetypes ofparking
lyzesitsinputandgeneratesthefinalresults.
lots also make the parking behaviors different from each
Inthefollowingsections,Section4showshowtopredict
other.Forillustration,inFig.3,weshowtheparkingcounts
periodicweather-awareparkingbehaviors.Section5shows
of two parking lots: the parking lot P4 located in an indus-
the parking behavior prediction in events. Section 6 shows
trialpark,andtheparkinglotP6locatednearamarket(see
ouroptimizations.
Table1).Wecanseethatthesetwoparkinglotsshowtotally
different behaviors. For explanation, people drive to work
4 PERIODICWEATHER-AWAREPARKING
during working days, so P4 is busy only from Monday to
BEHAVIORPREDICTION
Friday.Incontrast,peopletendtogotothemarketonweek-
4.1 Observations ends,soP6isbusyonSaturdayandSunday.Moreover,we
In this part, we exhibit our parking behavior observations can analyze the parking lots from the two categories: 1)
andanalysis,whicharealsothemotivationofthiswork. mandatory for living, and 2) entertainment. The parking
Data.Wecollectbothparkingandweatherdata.Forparking lots that relate to mandatory for living usually exhibit
data, we collect 910,477 real parking records from 13 parking strong periodicity and have relatively low correlation with
lots(detailedinSection7.1).Inourstudy,wereducetheanalysis weather conditions. In contrast, the parking lots that relate
granularitytoonehour,whichisthesameas[9].Inthissection, toentertainmentaremorelikelyinfluencedbyotherfactors.
weuseroughlytheparkingcountsofarrivingcarsintheparking P4islocatedinanindustrialpark,whichbelongstomanda-
lotwithinonehourasanindicatortoreflecttheparkingbehav- tory for living, while P6 is near a market, which relates to
ior.Forweatherinformation,wecollecttheweatherdata,includ- entertainment. We can see that P4 shows a more regular
ingtemperature,humidity,windspeed,andprecipitation. parkingbehaviorwaveform.
TABLE1
ParkinglotInformation
ParkingLot Space# StartTime EndTime Record# Surrounding Location(district/city/province)
P1 23 2017/10/16 2019/10/6 22,955 hotel Haishu,Ningbo,Zhejiang
P2 87 2017/10/20 2020/4/7 280,687 commercialstreet Haishu,Ningbo,Zhejiang
P3 9 2018/6/29 2020/4/7 38,509 shoppingmall Yinzhou,Ningbo,Zhejiang
P4 62 2019/3/12 2020/4/7 13,476 industrialpark Yinzhou,Ningbo,Zhejiang
P5 46 2017/11/6 2019/9/11 29,131 hotel Yinzhou,Ningbo,Zhejiang
P6 16 2018/4/27 2019/8/24 32,009 market Yuelu,Changsha,Hunan
P7 31 2018/5/9 2019/8/22 49,708 market Yuelu,Changsha,Hunan
P8 27 2018/5/29 2020/4/7 63,502 shoppingmall Yuelu,Changsha,Hunan
P9 49 2018/6/22 2020/4/7 55,631 shoppingmall Yuhua,Changsha,Hunan
P10 65 2018/12/25 2020/4/7 38,581 community Yuhua,Changsha,Hunan
P11 11 2018/12/19 2020/4/7 10,156 commercialstreet Yuhang,Hangzhou,Zhejiang
P12 152 2018/5/11 2020/4/7 140,034 commercialstreet Yuhang,Hangzhou,Zhejiang
P13 114 2018/6/27 2020/4/7 136,098 shoppingmall Yuhang,Hangzhou,Zhejiang
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore. Restrictions apply.

5900 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.34,NO.12,DECEMBER2022
Fig.5.Illustrationofperiodicweather-awareLSTMprediction.
|     |     |     |     | Model   | Overview.    | We      | show     | the        | model | overview of     |
| --- | --- | --- | --- | ------- | ------------ | ------- | -------- | ---------- | ----- | --------------- |
|     |     |     |     | PewLSTM | for          | parking | behavior | prediction |       | in Fig. 5. To   |
|     |     |     |     | involve | the periodic | parking |          | patterns,  | we    | add input gates |
forhiddenstatesfrompreviousLSTMfunctionsatthesame
|     |     |     |     | time at | day, weekday, |     | and month | granularities. |     | For exam- |
| --- | --- | --- | --- | ------- | ------------- | --- | --------- | -------------- | --- | --------- |
ple,foratimet,thecurrentparkingbehaviormaybeinflu-
|     |     |     |     | enced        | by the  | parking            | behavior | at                   | the same     | time from      |
| --- | --- | --- | --- | ------------ | ------- | ------------------ | -------- | -------------------- | ------------ | -------------- |
|     |     |     |     | previous     | days    | (day granularity). |          | Hence,               | we           | add a gate for |
|     |     |     |     | hidden       | states  | from the           | previous | “t(cid:4)24(cid:5)n” |              | time step,     |
|     |     |     |     | where n      | is a    | positive integer.  |          | For example,         |              | people would   |
|     |     |     |     | like to park | cars    | at a parking       |          | lot near             | a restaurant | at noon,       |
|     |     |     |     | and the      | parking | behavior           | at noon  | has                  | a strong     | correlation    |
withpreviousbehaviorsatnooninthepastdays.Thepark-
Fig.3.Differenttypesofparkinglots.
ingbehaviormaybeinfluencedbythesametimefromlast
Observation3:InfluenceofDifferentWeatherFactorsonPark- weekandlastmonth,soweaddgatesforinputtingthetime
|     |     |     |     | pattern | influence | at the | same | time | from | the past LSTM |
| --- | --- | --- | --- | ------- | --------- | ------ | ---- | ---- | ---- | ------------- |
ingBehavior.Theparkingbehaviorexhibitsdifferentcorrela-
|     |     |     |     | states. | As for | model input, | each | LSTM | function | receives |
| --- | --- | --- | --- | ------- | ------ | ------------ | ---- | ---- | -------- | -------- |
tionswithvariousweatherfactors.Forillustration,weshow
inFig.4theaverageparkingcountoftheparkinglotP3(see both weather information and records: for weather input,
Table 1), which is close to a shopping mall. We show the we design special gates for receiving weather information,
includingtemperature,humidity,windspeed,andprecipi-
| relationship | between | the parking count | and the relative |     |     |     |     |     |     |     |
| ------------ | ------- | ----------------- | ---------------- | --- | --- | --- | --- | --- | --- | --- |
humidityinFig.4a,whichimpliesthattheparkingbehavior tation. For parking record input, the record includes the
hasaclearrelationshipwiththerelativehumidity.Thereare arrival and departure times, date, and weekday informa-
tion.Furthermore,wealsoaddaneventpredictionmodule
twoparksandarestaurantnearthisparkinglot.Fig.4afur-
therimpliesthatpeoplearemorewillingtogotothesepla- to predict parking behaviors in events, which shall be dis-
ces in dry weather instead of wet weather. We show the cussedinSection5.
relationship between parking count and wind speed in PewLSTMBlock.TheLSTMfunctioninPewLSTMiscom-
|     |     |     |     | posed of | PewLSTM | blocks, | as  | shown | in Fig. | 6. Traditional |
| --- | --- | --- | --- | -------- | ------- | ------- | --- | ----- | ------- | -------------- |
Fig.4b.Wefindthatforthisshoppingmall,thewindspeed
showslesscorrelationwithparkingbehavior. LSTM block uses input gate i t, output gate o t, and forget
Challenges.WemeettwochallengesinapplyingLSTMin gatef ttocontroldataflowinLSTM.Wearguethatforpark-
|     |     |     |     | ingbehaviorprediction,weneed |     |     |     | toadditionally |     | involve1) |
| --- | --- | --- | --- | ---------------------------- | --- | --- | --- | -------------- | --- | --------- |
parkingbehaviorpredictioninthispart.Thefirstishowto
involve periodic parking patterns since typical LSTM does periodic pattern influence and 2) weather information. We
not have the periodic design. The second is how to design consider these two factors as new gates involved in our
thepathfromsourcesofparkingpatternsandweatherinto PewLSTM model. We show our periodic weather-aware
|     |     |     |     | LSTM block | in  | Fig. 6. | The main | difference |     | between our |
| --- | --- | --- | --- | ---------- | --- | ------- | -------- | ---------- | --- | ----------- |
thevariouspartswithintheLSTMblock.
PewLSTMblockandtraditionalLSTMblockliesinthegates
|     |     |     |     | for previous |     | periodic | records | h   |     | and weather |
| --- | --- | --- | --- | ------------ | --- | -------- | ------- | --- | --- | ----------- |
day=week=mon
4.2 PeriodicWeather-AwareLSTMModel inputweather t.First,forperiodictimeinfluence,thehidden
In this part, we show our design of PewLSTM for parking statesatthesametimefrompreviousstepsarerepresented
behavior prediction and our solutions to the challenges ash day,h week,andh mon,andwedesignaspecialweightgate
mentionedinSection4.1.
Fig.4.WeatherinfluenceonparkingbehaviorforP3. Fig.6.PewLSTMblock.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

ZHANGETAL.:PERIODICWEATHER-AWARELSTMWITHEVENTMECHANISMFORPARKINGBEHAVIORPREDICTION 5901
d to integrate these hidden input states with h t(cid:4)1. The
weight gate d iterates continuously during training, adjust-
ing the weight of each parameter in the model to achieve
better results, as shown in Equation 3. Second, for weather
influence,aweather-awaregatingmechanismhasbeeninte-
grated into the PewLSTM block, as represented in Equa-
tion 4. We argue that the current weather information,
along with the parking records and the previous parking
patternstogetherdecidetheparkingbehaviorsinthefuture.
Basedonthisassumption,afterasigmoidfunctionprocess- Fig.7.P2:InfluencefromChineseNewYearathourgranularity.
ing, the weather aspect vector e t is integrated to f t, i t, and
o t. Therefore, the cell state c t and the hidden state h t are input data include different dimensions like weekdays and
influencedbytheprevioushiddenstates,cellstates,thecur- months, and numerical ranges like temperature and wind
rentweatherinformation,andtheperiodicpatterns. speed.Therefore,weaddaninputlayerfordataprocessing.
To capture the complex relations among periodic time pat-
hh
o
¼dðW
d
hh
day
þW
w
hh
week
þW
m
hh
mon
þW t(cid:4)1hh t(cid:4)1Þ (3)
terns, weather information, and parking records, we stack
severalPewLSTMblockstogetherforprediction.Tooutput
ee
t
¼sðW
e
weather
t
þbb
f
Þ: (4)
thepredictedresults,weaddanoutputlayer.
Input Layer. The input layer receives the input data for
InputGates.Theinputgatei t decidestheamountofdata preprocessing. In our model, the processing granularity is
thatcanbeaccumulatedtothecellstatec tfromtheprevious
one hour, so parking records are converted on an hourly
state c t(cid:4)1. Different from the traditional input gates, the
granularity. Along with the parking records, the input
input gate in our model integrates the input vector x t, the
weatherdata,includingtemperatureT,humidityH,precip-
weighted hidden state h o, and the weather input e t, as
itation P, and wind speed W, are normalized to [0,1]. For
showninEquation(5).
example, as for temperature, the corresponding sequence
ii ¼sðW xx þW hh þW ee þbbÞ for the past K time steps is TT ¼fT t(cid:4)K ;... ;T t(cid:4)2;T t(cid:4)1g,
gg
t
¼fðW
ix
xx
t
þW
ih
hh
o
þbb
f
Þ
e
:
t i (5) whereT irepresentsthetemperatureofthepastithhour.
t gx t gh o g Deep PewLSTM Layers. Different from traditional single-
layerLSTM,westackmultiplePewLSTMlayerstogetherto
ForgetGates.Theforgetgateabandonsunnecessaryinfor-
formadeepneuralnetworktocapturetherelationsamong
mationsothatonlytheusefulinformationisretainedinthe
parking records and other useful factors. Between two
cell state.Similarto theinputgate,alongwithh t(cid:4)1 andthe PewLSTM layers, the output of a PewLSTM block in one
input vector x t, the weather information and periodic hid-
layer is the input to a PewLSTM block in the following
denstatesfromprevioustimestepsalsoaffecttheretention
layer.
fromthec t(cid:4)1statetothec tstate,asshowninEquation(6).
OutputLayer.Becausethefinaloutputfromthemodelis
ff ¼sðW xx þW hh þW ee þbb Þ: (6) the predicted parking numbers of arrivals and departures,
t fx t fo o fe t f
we add a feed-forward neural network following the deep
PewLSTM layers for post-processing. Similar processes
OutputGates.Theoutputgateisusedtocontrolthedata
havebeenconductedinpreviousresearch,suchas[34].
flowfromthecurrentinputtothehiddenstateh,asshown
t
in Equation (7). Similarly, the weighted hidden state h o,
inputvectorx t,andweatherinformationtogetherdecidethe 5 PARKINGBEHAVIORPREDICTIONWITHEVENT
outputo t,whichisdifferentfromthetraditionaloutputgate. INFLUENCE
oo
t
¼sðW
ox
xx
t
þW
oh
hh
o
þW
fe
ee
t
þbb
o
Þ: (7) Large-scale events, such as festival activities, also have a
great impact on parking behaviors. When an impactful
Cell States. Traditional cell state is decided by previous event happens, PewLSTM switches to the event prediction
state c t(cid:4)1, forget gate f t, input gate i t, and g t. We need to module for parking behavior event prediction. In this sec-
involve the periodic and weather information into the cell tion, we analyze the influence on parking behavior from
state.However,f t andi t alreadypreservethisinformation. regularsocialeventsandunexpectedevents,andthenpro-
Hence, the expression of the cell state c t keeps the same as videoursolution.
inEquation(1),andsodoestothehiddenstateh t.
Future Prediction. To predict the parking behavior in a 5.1 RegularEvent
futuretimesteptþk(kisapositiveinteger),werecursively Regular events refer to the events that appear periodically
predictthestatesinthenearfuture,andinputthepredicted accordingtocertainrules,suchasholidays.WeusetheChi-
states into the model to predict the farther future states. neseNewYearasanexampletoshowtheinfluenceofregu-
Note that the periodic pattern influence also applies to the lareventsonparking.
futureprediction. Hour Granularity. Fig. 7 shows the parking behavior of
parking lot P2, which is close to a commercial street in
4.3 ModelDetails Ningbo, in non-holiday and holiday for 24 hours. Fig. 7a
OurPewLSTMmodelproposedinSection4.2needsfurther shows its parking behavior on March 8th, 2018. This park-
developments for different data formats. For example, the ing pattern is common for the other non-holidays. The
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore. Restrictions apply.

5902 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.34,NO.12,DECEMBER2022
Fig.8.P2:InfluencefromChineseNewYearatdaygranularity.
parkinglotturnstobebusyfromthemorningtillthenight.
Themaximumparkingcountreaches81.Incontrast,Fig.7b
| shows the | parking     | behavior  |     | on February |             | 16th, 2018, | which       |     |     |     |     |     |     |     |     |
| --------- | ----------- | --------- | --- | ----------- | ----------- | ----------- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| is during | the Chinese |           | New | Year. The   | utilization |             | rate of the |     |     |     |     |     |     |     |     |
| parking   | lot is 8.76 | percent   | on  | average,    | and         | the         | parking lot |     |     |     |     |     |     |     |     |
| turns to  | be idle     | in almost | all | the time.   | The         | reason      | for such    |     |     |     |     |     |     |     |     |
differencesbetweennon-holidayandholidayisthatpeople
| turn to | go home | from | big | cities | during | the | new year. |     |     |     |     |     |     |     |     |
| ------- | ------- | ---- | --- | ------ | ------ | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
Accordingly,theparkinglotbecomesidle.
DayGranularity.Fig.8showstheparkingbehaviordiffer-
|              |         |          |                |                 |       |             |           | Fig. 10.       | P2: Accumulated |            | parking | count         | of  | long-term     | COVID-19 |
| ------------ | ------- | -------- | -------------- | --------------- | ----- | ----------- | --------- | -------------- | --------------- | ---------- | ------- | ------------- | --- | ------------- | -------- |
| ence of      | parking | lot P2   | in non-holiday |                 | and   | holiday     | at day    | influence.     |                 |            |         |               |     |               |          |
| granularity. | Fig.    | 8a       | shows          | the non-holiday |       | parking     | from      |                |                 |            |         |               |     |               |          |
| April 1st    | 2019    | to April | 30th           | 2019,           | while | Fig. 8b     | shows the |                |                 |            |         |               |     |               |          |
|              |         |          |                |                 |       |             |           | the government |                 | encourages |         | everyone      | to  | stay at       | home and |
| holiday      | parking | from     | February       | 1st             | 2018  | to February | 28th      |                |                 |            |         |               |     |               |          |
|              |         |          |                |                 |       |             |           | not to go      | out.            | Second,    | many    | non-essential |     | entertainment |          |
2018, in which the new year holidays start from February venues are closed. Employees stay at home and wait for
| 10th 2018 | to February |           | 26th | 2018. From | Fig. | 8, we         | can see |               |        |         |              |        |       |              |       |
| --------- | ----------- | --------- | ---- | ---------- | ---- | ------------- | ------- | ------------- | ------ | ------- | ------------ | ------ | ----- | ------------ | ----- |
|           |             |           |      |            |      |               |         | notification. | Third, |         | the epidemic |        | news  | has brought  | fear, |
| that the  | parking     | lot turns | to   | be empty   | at   | the beginning | of      |               |        |         |              |        |       |              |       |
|           |             |           |      |            |      |               |         | worries,      | and    | anxiety | to the       | public | [36]. | Accordingly, | the   |
the new year holiday, and returns to normal close to the parkinglotbecamevacantandunderutilized.
endoftheNewYearholiday.Suchphenomenaconfirmour
|             |             |     |            |     |           |     |            | Long-Term | Recovery.     |     | With    | effective | measures     |     | in various |
| ----------- | ----------- | --- | ---------- | --- | --------- | --- | ---------- | --------- | ------------- | --- | ------- | --------- | ------------ | --- | ---------- |
| conjecture: | large-scale |     | population |     | movements |     | will occur |           |               |     |         |           |              |     |            |
|             |             |     |            |     |           |     |            | aspects   | and effective |     | control | of        | the COVID-19 |     | epidemic,  |
duringlongholidayssuchasNewYear.Someparkinglots
peoplegraduallyregainedtheirconfidence,andtheparking
willbevacantwhileotherswillbetheopposite. lot gradually resumed use. We show such a long-term
SmallCities.Notethatinsmallcities,theparkingbehav-
|     |     |     |     |     |     |     |     | recovery | in Fig. | 10. | Fig. | 10a shows | the | normal | parking |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ------- | --- | ---- | --------- | --- | ------ | ------- |
iorcouldbecometheopposite.Peopleflowoutofbigcities
|     |     |     |     |     |     |     |     | behavior | from | October | to  | December, | 2019, | while | Fig. 10b |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | ---- | ------- | --- | --------- | ----- | ----- | -------- |
duringNewYearandflowintotheirhometowns.Afterthe showstheparkingbehaviorwithCOVID-19influencefrom
| new year, | a large | number | of  | people | return | to the | big cities |         |           |       |     |             |     |        |             |
| --------- | ------- | ------ | --- | ------ | ------ | ------ | ---------- | ------- | --------- | ----- | --- | ----------- | --- | ------ | ----------- |
|           |         |        |     |        |        |        |            | January | to April, | 2020. | The | utilization |     | of the | parking lot |
fromtheirhometownsandreturntowork.
dropswithin20daysfrom66.57to8.00percent.OnFebru-
ary8th,theparkinglotutilizationratedroppedtothefreez-
5.2 UnexpectedEvent
|     |     |     |     |     |     |     |     | ing point, | and | this state | lasted | for | 10 days. | Fortunately, | on  |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ---------- | ------ | --- | -------- | ------------ | --- |
The parking behavior could also be influenced by unex- February 18th, the government sent a positive signal:
pected events. In this section, we analyze the influence of COVID-19 pandemic has been efficiently controlled. Next,
coronaviruspandemic(COVID-19)[11]onparking. such information has promoted the normal operation of
Short-TermImpact.WeusetheparkinglotP2toshowthe
|     |     |     |     |     |     |     |     | society and | the | restoration |     | of normal | use | of parking | lots. |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ----------- | --- | --------- | --- | ---------- | ----- |
short-term impact of COVID-19 on parking behavior in TillMarch25th2020,theparkinglothasresumed74.39per-
Fig.9.TheChinesepulmonologistZhongNanshanwarned centofitsprevioususage.
thatCOVID-19canbetransmittedfrompersontopersonin
Insights.Basedontheseobservations,wehavethefollow-
aninterviewwithCCTVonJanuary20th,2020[35],andwe inginsights.First,theparkingbehaviorhasastrongcorrela-
can see that this warning had a great impact on parking tion with the news. For example, the news reports the
behavior:within4days,thenumberofparkingatthepeak COVID-19 control situation. Second, no fixed pattern in
droppedby76.53percent.Thereasonsareasfollows.First, parking behavior exists in unexpected events, since the
|     |     |     |     |     |     |     |     | parking | behavior | greatly | depends |     | on the | current | situation. |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | -------- | ------- | ------- | --- | ------ | ------- | ---------- |
Third,manyfactorsneedtobeinvolvedtopredictthepark-
|     |     |     |     |     |     |     |     | ingbehaviors |     | inunexpected |     | events,such |     | asthetime | when |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | --- | ------------ | --- | ----------- | --- | --------- | ---- |
theepidemicwasundercontrol.
|     |     |     |     |     |     |     |     | 5.3 EventPredictionSolution |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --------------------------- | --- | --- | --- | --- | --- | --- | --- |
Weshowoursolutiontosuchaneventinfluenceonparking
behaviorpredictioninthispart.
Fig.9.P2:Short-termCOVID-19influencefromJanuary21toJanuary Event Identification. Before predicting the parking behav-
| 25,2020. |     |     |     |     |     |     |     | iorduringevents,weneedtoidentifytheeventsthataffect |     |     |     |     |     |     |     |
| -------- | --- | --- | --- | --- | --- | --- | --- | --------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

ZHANGETAL.:PERIODICWEATHER-AWARELSTMWITHEVENTMECHANISMFORPARKINGBEHAVIORPREDICTION 5903
theparkingbehavior.Wecategorytheeventsintolong-term information, and parking environment, as well as the data
eventsthatmaylastseveraldays,andshort-termeventsthat filteringandcorrelationanalysis.
lastonlyafewhours. Parking Records. We use real parking records from 13
1)Long-termevents.Toidentifythelong-termeventsthat parking lots. The format of the original parking records
potentiallyaffectparkingbehavior,weusetheLSTMmodel includesthestarttime,endtime,andtheparkingspaceID.
to find all possible events in the training dataset. In detail, In our design, we reduce the analysis granularity to one
we first mark some events in one parking lot: we map the hour. We roughly use the number of cars parked in the
records in events to a higher weight while remaining the parkinglotatthehourgranularityasanindicatortoreflect
otherrecordstoalowerweight.Second,wetrainourmodel theparkingbehavior.
on the manuallylabeled dataset. Third, we use our trained Weather Information. The weather condition also affects
modeltoidentifyevents. the parking behavior. For instance, as discussed in Sec-
2) Short-term events. Because parking behavior exhibits tion4.1,wefindthatpeopletendtodriveinwindyweather.
obviousperiodicpatternsandthecrestsandtroughsarerela- Indetail,wecollectthefollowingweatherinformationfrom
tivelyfixed,wecandetecttheshort-termeventsbycompar- the local weather bureau where the parking lot is located:
ing the current waveform to a generalized average temperature, humidity, wind speed, and precipitation.
waveform. In detail, we first generate the average parking Thesedataneedtobenormalized.
countsineachhourofonedaytoformabaselinevector.Sec- Parking Environment. The surroundings of a parking lot
ond,weusethecosinesimilarity[33]tocalculatethesimilari- play an important role in the parking behaviors of the
tiesbetweendifferentwaveformsandthebaseline.Third,we parking lot. As discussed in Section 4.1, parking lots with
^
mark the identified short-term events. A Using the above different surroundings can have totally different parking
method can identify both long-term and short-term events. behaviors. We categorize the parking environments into
However, most of the identified short-term events relate to seventypes:hotel,commercialstreet,shoppingmall,indus-
unpredictablehumanfactorssuchasshoppingmallpromo- trial park, hotel, market, and community. Accordingly, we
tion, which is hard to be controlled, so we only consider traineachtypeofparkinglotsseparately.
long-term events in PewLSTM. Long-term events include Data Filtering. In our study, we mainly meet two data
bothregularandunexpectedlong-termevents. issues: noisy data and missing attributes. We perform data
EventPrediction.Basedontheeventidentification,weper- filteringto solve thesetwo issues.For noisy datain adata-
formtheeventprediction,whichincludesthreesteps:find- set, we perform outlier analysis and remove the outlier
ingpattern,polynomialmodelfitting,andmodeladaptation. data.Formissingattributesofarecord,ifmorethan20per-
1) Finding the pattern. We first need to find the parking centofattributevaluesaremissing,weabandonthatrecord.
pattern of the event. The event identification provides the Correlation Analysis. We perform correlation analysis for
length of the event, and we record the trend of parking the involved attributes. We only keep the attributes that
behaviorsduringtheinterval.Wealsorecordthenumberof havealowcorrelationwitheachothertoreducethemodel
parkingspacesforfurtherparkingbehaviorprediction. complexity.
2) Polynomial model fitting. After we collect the data to
depict the parking pattern during the event, we then use a
high-orderpolynomialmodeltofittheparkingdatachange 6.2 AccuracyTuning
pattern. Higher-order models usually fit better, but it can ManyconfigurationscouldaffecttheaccuracyofPewLSTM,
alsobringaboutover-fittingproblems.Theexperiencevalue andwediscusstheaccuracytuningfortheseconfigurations
is15inourexperiments. inthissection.
3)Modeladaptation.Ourmodelcanbeappliedtothreesit- Hidden Size. Hidden size refers to the number of output
uations. The first is to predict parking behaviors for the featuresofthehiddenstateh inLSTMblocks.Wefindthat
o
same parking lot in the future. The second is to predict thehiddensizeofLSTMblocksaffectstheparkingbehavior
parking behaviors cross different events. Because events prediction accuracy. A larger hidden size represents park-
cansharesimilarities,weneedtoadjustthelengthtofitdif- ing behavior from more dimensions but can contain more
ferentevents.Thethirdistopredictparkingbehaviorscross redundant information. We have explored a wide range of
different parking lots, which needs further adjustment to hidden size and find that PewLSTM achieves the highest
proportionallyputorreducethecapacityoftheparkinglot. accuracywhenthehiddensizeis64.
Notethatonlythesametypeofparkinglotcanmakecross- Training Epochs. In PewLSTM, an epoch represents the
parkingbehaviorpredictions. trainingprocessfortheinputdataset.Inourtuning,wefind
After these steps, we can conduct event prediction on thattheaccuracyofthemodelincreaseswiththenumberof
upcomingeventsforparkingbehaviors. epochs. However, when the number of training epochs
reaches 300, the accuracy reaches its maximum. Hence, we
6 OPTIMIZATION setthenumberoftrainingepochsto300.
NumberofLSTMLayers.AsstatedinSection4.3,westack
In this section, we describe our optimizations on data pre-
PewLSTMblockstogethertoformdeepPewLSTMlayersto
processingandaccuracytuning.
capture the complicated non-linear relations in parking
behavior.TodecidethenumberofPewLSTMlayers,weuse
6.1 DataPreprocessing asmalltrainingsetforvalidationandchoosethenumberof
The data preprocessing is important to our method, which layers that can provide the best results. In PewLSTM, we
includes data selection of parking records, weather usetwoLSTMlayers.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore. Restrictions apply.

5904 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.34,NO.12,DECEMBER2022
Fig.11.Arrivalpredictionaccuracy.
Fig.12.Departurepredictionaccuracy.
|     |     |     |     |     |     |     |     |     | (cid:6) |     |     |     | (cid:6) |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | ------- | --- |
|     |     |     |     |     |     |     |     |     | (cid:6) |     |     |     | (cid:6) |     |
OutputLayer.AlthoughwecanconfiguretheLSTMblock count (cid:4)count
|     |     |     |     |     |     |     | accuracy¼1(cid:4) |     |     | observed |     | predicted |     | (8) |
| --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | -------- | --- | --------- | --- | --- |
:
| tooutputthepredictionresults,wefindthataddinganother |     |     |     |     |     |     |     |     |     |     | count |     |     |     |
| ---------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- |
observed
transformationcanfurtherimprovetheaccuracy.Aftertry-
| ing different | strategies,  | such      | as linear | transformation |                | and |           |         |             |      |         |          |      |           |
| ------------- | ------------ | --------- | --------- | -------------- | -------------- | --- | --------- | ------- | ----------- | ---- | ------- | -------- | ---- | --------- |
|               |              |           |           |                |                |     | Datasets. | In      | this paper, | our  | parking | datasets |      | are com-  |
| softmax       | function, we | find that | the       | linear         | transformation |     |           |         |             |      |         |          |      |           |
|               |              |           |           |                |                |     | posed of  | parking | records     | from | 13      | parking  | lots | in China, |
achievestheoptimalresults.
includingshoppingmalls,hotels,communities,andsoon.2
Welistthetotalnumberofparkingspaces,parkingrecords,
7 EXPERIMENTS
|                  |             |     |         |            |     |         | surroundings, |       | and location | for    | each | parking | lot in | Table 1. |
| ---------------- | ----------- | --- | ------- | ---------- | --- | ------- | ------------- | ----- | ------------ | ------ | ---- | ------- | ------ | -------- |
| In this section, | we evaluate |     | PewLSTM | on 910,477 |     | records |               |       |              |        |      |         |        |          |
|                  |             |     |         |            |     |         | The dataset   | spans | 30           | months | from | October | 20th,  | 2017 to  |
from13parkinglotsandcompareitwiththestate-of-the-art April7th,2020,whichconsistsof910,477parkingrecordsin
parkingbehaviorpredictionmethod. 904 days. For each record, we obtain the parking informa-
|     |     |     |     |     |     |     | tion including |     | the arrival | time, | the | departure | time, | date, |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ----------- | ----- | --- | --------- | ----- | ----- |
7.1 ExperimentalSetup parking space, and the price. Please note that the parking
|              |             |     |            |          |     |         | records | with | a duration | of  | fewer | than | five minutes | are |
| ------------ | ----------- | --- | ---------- | -------- | --- | ------- | ------- | ---- | ---------- | --- | ----- | ---- | ------------ | --- |
| Methodology. | We evaluate | the | prediction | accuracy |     | of four |         |      |            |     |       |      |              |     |
regardedasnoisedata.Therelatedweatherdatasetincludes
| methods | for the future | three | hours. | The | “PewLSTM” |     |     |     |     |     |     |     |     |     |
| ------- | -------------- | ----- | ------ | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
method is our periodic weather-aware LSTM with event the hourly weather data from five districts where the 13
mechanism based on all influencing factors. The “simple parking lots are built. For each hour, we collect the related
|              |            |                |     |     |       |         | weather | information, |     | including | temperature, |     | wind | speed, |
| ------------ | ---------- | -------------- | --- | --- | ----- | ------- | ------- | ------------ | --- | --------- | ------------ | --- | ---- | ------ |
| LSTM” method | is an LSTM | implementation |     |     | based | on only |         |              |     |           |              |     |      |        |
precipitation,andhumidity.
| parking       | records without | other     | factors. | We use | the        | regres- |                                  |     |     |     |     |     |     |     |
| ------------- | --------------- | --------- | -------- | ------ | ---------- | ------- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- |
| sion method   | of random       | forest    | from     | [9],   | denoted    | as      |                                  |     |     |     |     |     |     |     |
|               |                 |           |          |        |            |         | 7.2 PredictionAccuracyEvaluation |     |     |     |     |     |     |     |
| “regression”, | as our          | baseline. | Because  | the    | regression |         |                                  |     |     |     |     |     |     |     |
method only supports the prediction for arrivals in one WeshowthearrivalpredictionaccuracyinFig.11,andthe
hour, we extend it to support prediction for two and three departure prediction accuracy in Fig. 12. We have the fol-
hours. We use the baseline implementation with the data- lowingfindings.
|                |       |                 |     |               |     |     | First, | our | periodic | weather-aware |     | LSTM | with | event |
| -------------- | ----- | --------------- | --- | ------------- | --- | --- | ------ | --- | -------- | ------------- | --- | ---- | ---- | ----- |
| sets described | below | for comparison. |     | Additionally, |     | we  |        |     |          |               |     |      |      |       |
show ourpreliminaryversionwithoutthe optimizations in mechanism achieves the highest prediction accuracy in
Section 6, denoted as “PewLSTM(original)”, which is also mostcases.Forarrivals,PewLSTMachievesanaccuracyof
theinitialversionofPewLSTMpresentedin[10].Theaccu-
racyisdefinedinEquation(8). 2.https://github.com/NingxuanFeng/PewLSTM
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

ZHANGETAL.:PERIODICWEATHER-AWARELSTMWITHEVENTMECHANISMFORPARKINGBEHAVIORPREDICTION 5905
TABLE2
RMSEResultsofP1forDifferentMethods
|                   |        |       | Arrival |        |        | Departure |           |     |     |     |     |     |     |     |
| ----------------- | ------ | ----- | ------- | ------ | ------ | --------- | --------- | --- | --- | --- | --- | --- | --- | --- |
| Method            |        | 1hour | 2hours  | 3hours | 1hour  | 2hours    | 3hours    |     |     |     |     |     |     |     |
| simpleLSTM        |        | 0.99  | 1.28    | 1.36   | 1.09   | 1.28      | 1.45      |     |     |     |     |     |     |     |
| PewLSTM(original) |        | 0.92  | 0.99    | 1.08   | 0.99   | 0.87      | 1.19      |     |     |     |     |     |     |     |
| PewLSTM           |        | 0.90  | 0.89    | 0.96   | 0.94   | 0.88      | 1.02      |     |     |     |     |     |     |     |
| 93.84%            | in one | hour, | 76.78%  | in two | hours, | and       | 67.54% in |     |     |     |     |     |     |     |
threehours.Incontrast,theregressionmethodachieves57.8
| percent  | accuracy | in       | one hour, | 51.2 | percent     | in  | two hours, |     |     |     |     |     |     |     |
| -------- | -------- | -------- | --------- | ---- | ----------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- |
| and 50.0 | percent  | in three | hours.    | For  | departures, |     | PewLSTM    |     |     |     |     |     |     |     |
Fig.13.Accuracyunderdifferentlayers.
| achieves | an accuracy |     | of 93.34% | in  | one hour, | 73.45% | in two |     |     |     |     |     |     |     |
| -------- | ----------- | --- | --------- | --- | --------- | ------ | ------ | --- | --- | --- | --- | --- | --- | --- |
hours,and67.48%inthreehours.The“PewLSTM(original)”
achieves a moderate accuracy that is higher than the accu- in departure behaviors. Additionally, the regression-based
racy of simple LSTM, which implies that periodic patterns method only predicts arrivals and has high RMSE results
thataremorethan1.5.Hence,wedonotshowitinTable2.
| and weather | information |     | are | useful | for | improving | predic- |     |     |     |     |     |     |     |
| ----------- | ----------- | --- | --- | ------ | --- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- |
tionaccuracy. LSTM Configuration. We analyze the influence of
Second, with the growth of the prediction time, the pre- PewLSTM configuration over the model accuracy, and we
mainlyadjustthenumberofPewLSTMlayers.Theaccuracy
| diction | accuracydecreases.In |     |     | ourmethod,to |     | predictpark- |     |     |     |     |     |     |     |     |
| ------- | -------------------- | --- | --- | ------------ | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
ing behavior at a far time point, we recursively input the resultsofdifferentlayersareshowninFig.13,whichshows
predicted results in a near time point into the model. We thatwhenthe numberoflayersistwo, ourmodelachieves
use the predicted results as training data, which inevitably the highest accuracy; when the number of layers further
|            |               |     |     |       |          |          |     | increases, | the | accuracy decreases. |     | The optimal | number | of  |
| ---------- | ------------- | --- | --- | ----- | -------- | -------- | --- | ---------- | --- | ------------------- | --- | ----------- | ------ | --- |
| introduces | uncertainties |     | and | noise | factors. | However, | our |            |     |                     |     |             |        |     |
PewLSTM still maintains high accuracy in terms of long- layers relates to both the input data and the problem. We
term predictions: for every additional hour of prediction, mainlyobtainitempiricallybasedonthetrainingset.
theaccuracydropsbyonly13.1percentforarrivalsand12.9
percentfordeparturesonaverage.
|        |             |     |            |          |     |           |          | 7.4 EventAnalysis |     |     |     |     |     |     |
| ------ | ----------- | --- | ---------- | -------- | --- | --------- | -------- | ----------------- | --- | --- | --- | --- | --- | --- |
| Third, | the arrival |     | prediction | accuracy |     | is higher | than the |                   |     |     |     |     |     |     |
departure prediction accuracy. The reason is that departure Inthispart,weevaluatetheaccuracyoftheeventprediction
ofPewLSTM.Becausetheparkingbehaviorwiththehourly
situationsaremorecomplexthanarrivalsituations.Thedepar-
ture is also affected by the purpose or event from the driver granularityisgreatlyaffectedbyenvironmentalfactors,we
sideduringparking,whichishardtocapture.However,even mainly use the day as the granularity to predict parking
behaviors.
inthedepartureprediction,ourpredictionaccuracyisonly1.3
percentlowerthanthatinarrivalprediction. SelectedEvents.Weusetheeventidentificationmethodin
Section5.3todetectthetrainingsetandselectthreeregular
7.3 QualitativeAnalysis events:NationalDay,SpringFestival,andMayDay,which
Weusetheroot-mean-squaredeviation(RMSE)tomeasure are the three longest holidays in China. Parking behaviors
thedeviationbetweenthepredictedresultsandtheobserved intheseeventsexhibitdistinctwaveformscomparedto the
otherperiods.Notethatwedonotconsidertheunexpected
results.LowRMSEvaluesindicatehigheraccuracyandsta-
|            |                 |     |      |     |         |             |      | events here, | though | we have | identified | them. | The | reasons |
| ---------- | --------------- | --- | ---- | --- | ------- | ----------- | ---- | ------------ | ------ | ------- | ---------- | ----- | --- | ------- |
| bility. In | our evaluation, |     | RMSE | is  | defined | in Equation | (9). |              |        |         |            |       |     |         |
Assumethatwe performN predictions.For the ith predic- areasfollows.First,theunexpectedeventsusuallyhappen
tion,predicted by different reasons, which can be hard to be reproduced.
irepresentsthepredictedparkingresult,while
Second,onlysimilareventscanberelatedtoeachotherfor
observed irepresentstheobservedparkingresult.
sffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffiffi prediction, and the unexpected events are hard to use.
|     |     | P   |                      |     |                  |     |     | Third, the | records | of most | parking | lots are | only about | one |
| --- | --- | --- | -------------------- | --- | ---------------- | --- | --- | ---------- | ------- | ------- | ------- | -------- | ---------- | --- |
|     |     |     | N(cid:4)1 ðpredicted |     | (cid:4)observedÞ | 2   |     |            |         |         |         |          |            |     |
i¼0 i i (9) y e a r . T h e r efore, we only use the three regular events for
| RMSE | count | ¼   |     |     |     |     | :   |                 |            |         |          |                 |     |     |
| ---- | ----- | --- | --- | --- | --- | --- | --- | --------------- | ---------- | ------- | -------- | --------------- | --- | --- |
|      |       |     |     | N   |     |     |     | v a li d a ti o | n .        |         |          |                 |     |     |
|      |       |     |     |     |     |     |     | Event           | Validation | Method. | Weusethe | parkinglots,P2, |     | P5, |
We show the RMSE results of P1 in Table 2 for illustra- P6,P7,P8,P12,andP13forevaluation,becausethesepark-
tion.TheotherparkinglotsshowsimilarRMSEresults.We ing lots exhibit clear event patterns, and have enough
have the following observations. First, our PewLSTM recordswitharelativelylongtimerange.Indetail,thevali-
achieves the lowest RMSE results for both arrivals and dation involves three types of model adaptation: 1) same
departures.Thisimpliesthatperiodicpatternsandweather event prediction in one parking lot, like P2, which has
informationareusefulforreducingdeviation,andtheopti- enough records across two years; 2) cross event prediction
mizations in Section 6 are effective. Second, as the predic- inoneparkinglot,sincenoenoughrecordsexistbutdiffer-
tion time becomes longer, the RMSE result increases. ent events show similar parking patterns; 3) cross parking
However, even so, PewLSTM can still maintain a small lot prediction, for the parking lots that are similar to each
deviation. Third, the arrival RMSE results are lower than other.Furthermore,theinputisfromtwosources.Thefirst
thedepartureRMSEresults,whichisduetothecomplexity oneisthepre-trainedfittingmodelforexpressingpatterns.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

5906 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.34,NO.12,DECEMBER2022
Fig.14.Parkingbehaviorpredictioninevents.“3months”,“2months”,and“1month”indicateutilizingPewLSTMtopredicttheparkingbehaviorfor
theeventbasedonthecurrentdatathreemonths,twomonths,andonemonthahead.“original”indicatesthePewLSTMwithouteventmechanism.
Thesecondoneisthebasedataaheadoftheeventformodel SpringFestivalof2018,alongwiththemonthdataahead,to
adjustment.Inourexperiments,weconductparkingbehav- predicttheparkingbehaviorinSpringFestivalof2019.For
ior prediction within one month, two months, and three Fig.14d,weusetherecordsfromP2inthe2018SpringFes-
months. tivaltopredicttheP12parkingbehavioroftheSpringFesti-
Event Prediction Results. We show our event prediction valof 2019.ForNational DayandMay Dayprediction, the
| average prediction |     | accuracies |     | are 79.60 | and | 80.09 percent |     |
| ------------------ | --- | ---------- | --- | --------- | --- | ------------- | --- |
resultsinFig.14.Onaverage,ourPewLSTMachieves72.91,
77.19, and 78.90 percent prediction accuracy for three respectively.Figs.14aand14garefromthesameeventpre-
months, two months, and one month respectively. For dictioninoneparkinglot.Figs.14eisfromcrosseventpre-
SpringFestival,theaveragepredictionaccuracyis64.42per- diction in one parking lot, and Figs. 14b, 14f, 14h, and 14i
arefromcrossparkingprediction.Notethattheaccuracyof
cent.ForFig.14c,weperformthesameeventprediction in
one parking lot, in which we use the parking records in theoriginalmethodislow.Thereasonisthatitrecursively
| inputs the | predicted | results |     | into the | model | for further | pre- |
| ---------- | --------- | ------- | --- | -------- | ----- | ----------- | ---- |
diction,withoutconsideringtheeventinfluence.
Theunexpectedevents,suchasCOVID-19,couldberare
| and lack information. |     |     | However, | similar | events | sometimes |     |
| --------------------- | --- | --- | -------- | ------- | ------ | --------- | --- |
happen.Forexample,in2002,SARSbrokeoutinChina[37],
| in which traffic |     | restrictions |     | in major | cities | are similar | to  |
| ---------------- | --- | ------------ | --- | -------- | ------ | ----------- | --- |
thoseduringCOVID-19.Ifwecancollectsufficientdataand
buildmodels,wecanprepareforthenextsimilareventsin
| the future. | When   | we have | no        | similar     | records, | cross-event  |     |
| ----------- | ------ | ------- | --------- | ----------- | -------- | ------------ | --- |
| prediction  | can be | used    | by expert | experience. |          | For example, |     |
Fig.15.P2:ParkingbehaviorpredictioninCOVID-19. Chinese pulmonologist Zhong Nanshan predicted on
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

ZHANGETAL.:PERIODICWEATHER-AWARELSTMWITHEVENTMECHANISMFORPARKINGBEHAVIORPREDICTION 5907
TABLE3 applied LSTM to predict the trends in financial markets.
AccuracyandRMSEforEventPrediction
Zhangetal.[29]proposedATTAIN,whichusesLSTMnet-
|     |     |             |     |     |     |      |     | works to | model | disease | progression. | Fu  | et al. | [30] | studied |
| --- | --- | ----------- | --- | --- | --- | ---- | --- | -------- | ----- | ------- | ------------ | --- | ------ | ---- | ------- |
|     |     | Accuracy(%) |     |     |     | RMSE |     |          |       |         |              |     |        |      |         |
howtoapplyLSTMtopredictivephenotyping.Huangetal.
| ParkingLot/Event |     | 3months 2months |     | 1month | 3months | 2months | 1month |              |     |         |                      |     |      |     |          |
| ---------------- | --- | --------------- | --- | ------ | ------- | ------- | ------ | ------------ | --- | ------- | -------------------- | --- | ---- | --- | -------- |
|                  |     |                 |     |        |         |         |        | [31] applied |     | LSTM to | text categorization. |     | Xing | et  | al. [32] |
P2:NationalDay 82.07 82.50 89.52 262.24 257.05 158.50 proposed an aspect-aware LSTM for sentiment analysis.
P12:NationalDay 75.76 86.91 87.28 55.33 29.32 28.50 Differentfromtheseworks,weintegratetheperiodicityand
P2:SpringFestival 53.60 67.00 83.76 518.13 354.41 122.28 weatherinformationintotheLSTMmodel,andapplieditto
| P12:SpringFestival |     | 61.72 | 62.49 | 63.25 | 27.93 | 27.11 | 26.38 |     |     |     |     |     |     |     |     |
| ------------------ | --- | ----- | ----- | ----- | ----- | ----- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
theparkingbehaviorprediction.
| P6:MayDay       |     | 81.61 | 78.12 | 83.32 | 17.87 | 26.62 | 15.95 |               |           |            |                 |        |        |              |     |
| --------------- | --- | ----- | ----- | ----- | ----- | ----- | ----- | ------------- | --------- | ---------- | --------------- | ------ | ------ | ------------ | --- |
|                 |     |       |       |       |       |       |       | Event         | Analysis. | With       | event analysis, |        | we can | understand   |     |
| P8:NationalDay  |     | 60.99 | 57.65 | 57.50 | 25.52 | 28.65 | 28.75 |               |           |            |                 |        |        |              |     |
|                 |     |       |       |       |       |       |       | the influence |           | of events, | and respond     | better | to     | emergencies. |     |
| P13:NationalDay |     | 78.99 | 86.30 | 86.39 | 36.12 | 22.30 | 22.51 |               |           |            |                 |        |        |              |     |
P5:MayDay 71.58 83.06 82.87 46.03 33.68 33.97 Cortez et al. [42] presented a novel architecture for event
P7:NationalDay 89.89 90.68 81.58 30.29 30.34 38.13 prediction based on LSTM. Yuen et al. [43] developed a
modeltoidentifyunusualeventsinvideoswithreferenceto
alargecollectionsofvideos.Antunesetal.[44]developeda
February 27th that COVID-19 could be controlled in the Bayesian predictive method to give event prediction for
ChinesemainlandbytheendofApril[38],sowecanusea alarm systems. Jin et al. [45] studied the event stream dis-
cross-eventpredictionsuchasNewYearmodelwithlength seminationinlarge-scaleonlinesocialnetworksystems.Du
setfromFebruary28thtoApril30th.Thepredictedparking et al. [46], [47] developed an event recommendation frame-
behavior of P2 is shown in Fig. 15, which is similar to the work to help people with upcoming social events. Aa et al.
realsituation. [48] studied the conformance checking based on the analy-
EventAnalysis.Weanalyzetheeventpredictionresultsin sis of observed events. In this work, we model the event
Table 3, and we have the following observations and influence on parking behaviors and enable PewLSTM to
insights.First,inmostcases,theclosertotheevent,thebet- predictparkingbehaviorsinevents.
| ter prediction | accuracy |     | PewLSTM | can | achieve. | The | reason |     |     |     |     |     |     |     |     |
| -------------- | -------- | --- | ------- | --- | -------- | --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
is that the input data are closer to the event data. Second, 9 CONCLUSION
| the event | RMSE | results | are higher | than | the | hourly | RMSE |     |     |     |     |     |     |     |     |
| --------- | ---- | ------- | ---------- | ---- | --- | ------ | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
results of Section 7.3, because of the longer forecast time In this paper, we argue that periodic patterns shall be
|           |      |             |          |     |        |      |         | involved | in parking | behavior | prediction. |     | We  | have | shown |
| --------- | ---- | ----------- | -------- | --- | ------ | ---- | ------- | -------- | ---------- | -------- | ----------- | --- | --- | ---- | ----- |
| range and | more | uncertainty | factors. |     | Third, | even | in such |          |            |          |             |     |     |      |       |
thatparkingbehaviorsexhibitstrongperiodicpatterns,and
| complicated | situations |     | where | the prediction |     | time | range | is  |     |     |     |     |     |     |     |
| ----------- | ---------- | --- | ----- | -------------- | --- | ---- | ----- | --- | --- | --- | --- | --- | --- | --- | --- |
long and the training data are limited, PewLSTM can still such parking patterns shall be retained in classic LSTM
achieve significant prediction results, which proves the models.Toaddressthisproblem,weproposedanovelperi-
odicweather-awareLSTMwitheventmechanismsforpark-
effectivenessofourmethod.Notethatanunexpectedevent
can also be predicted if we could obtain its event type and ing behavior prediction, which considers the periodic
havesimilarhistoricaleventrecords. patterns from parking records and weather data. We also
|     |     |     |     |     |     |     |     | support | event            | prediction | for PewLSTM. |            | We  | exhibited  | our |
| --- | --- | --- | --- | --- | --- | --- | --- | ------- | ---------------- | ---------- | ------------ | ---------- | --- | ---------- | --- |
|     |     |     |     |     |     |     |     | model,  | data collection, |            | and data     | processing |     | in detail. | We  |
8 RELATEDWORK
evaluateourproposedmodelwith13parkinglotsindiffer-
|           |             |                          |     |     |     |     |         | ent cities, | and | experiments | show | that | our model | achieves |     |
| --------- | ----------- | ------------------------ | --- | --- | --- | --- | ------- | ----------- | --- | ----------- | ---- | ---- | --------- | -------- | --- |
| In recent | years,there | havebeenmanystudiesabout |     |     |     |     | differ- |             |     |             |      |      |           |          |     |
93.84%predictionaccuracy,whichisabout30%higherthan
| ent aspects | of  | parking | prediction, | LSTM | application, |     | and |     |     |     |     |     |     |     |     |
| ----------- | --- | ------- | ----------- | ---- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
eventanalysis,andweshowtheserelatedworksasfollows. thestate-of-the-artpredictionmethod.
| Parking | Prediction. | Parking |     | relates | to our | daily | life and |     |     |     |     |     |     |     |     |
| ------- | ----------- | ------- | --- | ------- | ------ | ----- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
ACKNOWLEDGMENTS
hasbeenahotresearchtopicformanyyears.Accuratepark-
| ing prediction |        | can help     | car owners | to     | choose     | parking | lots.   |                        |     |           |                |     |     |            |     |
| -------------- | ------ | ------------ | ---------- | ------ | ---------- | ------- | ------- | ---------------------- | --- | --------- | -------------- | --- | --- | ---------- | --- |
|                |        |              |            |        |            |         |         | This work              | was | supported | in part        | by  | the | National   | Key |
| Caicedo        | et al. | [8] proposed | a          | method | to perform |         | parking |                        |     |           |                |     |     |            |     |
|                |        |              |            |        |            |         |         | ResearchandDevelopment |     |           | ProgramofChina |     |     | underGrant |     |
space prediction in intelligent parking reservations. 2018YFB1004401, in part by the National Natural Science
| Chen [17] | studied     | parking  | occupancy |                | and | patterns, | and    |            |     |             |            |            |         |           |      |
| --------- | ----------- | -------- | --------- | -------------- | --- | --------- | ------ | ---------- | --- | ----------- | ---------- | ---------- | ------- | --------- | ---- |
|           |             |          |           |                |     |           |        | Foundation | of  | China under | Grants     | U20A20226, |         | 61732014, |      |
| Zheng     | et al. [18] | analyzed | the       | sensor-enabled |     | car       | parks. |            |     |             |            |            |         |           |      |
|           |             |          |           |                |     |           |        | 61802412,  | and | 62002029,   | in part by | the        | Beijing | Natural   | Sci- |
Hossingeretal.[16]presentedareal-timemodelforparking
enceFoundationunderGrants4202031andL192027,inpart
space occupancy prediction. Vlahogianni et al. [19] devel- by the Tsinghua University Initiative Scientific Research
| oped a | framework | for smart | real-time |     | parking | availability |     |         |       |       |              |     |      |        |     |
| ------ | --------- | --------- | --------- | --- | ------- | ------------ | --- | ------- | ----- | ----- | ------------ | --- | ---- | ------ | --- |
|        |           |           |           |     |         |              |     | Program | under | Grant | 20191080594, | in  | part | by the | MoE |
prediction.Weexploredtheuseofweatherinformationand
AcRFunderGrantsT1251RES1824andMOE2017-T2-1-122,
regression models in parking prediction, which has been and in part by the SUTD Start-up Research under Grant
presentedin[9],[10].Moreover,high-qualitysmartparking
|          |         |      |         |       |     |            |     | SRT3IS21164, |     | in Singapore. | Jidong | Zhai | and | Xiaoyong | Du  |
| -------- | ------- | ---- | ------- | ----- | --- | ---------- | --- | ------------ | --- | ------------- | ------ | ---- | --- | -------- | --- |
| guidance | systems | also | appear, | which | are | convenient | for |              |     |               |        |      |     |          |     |
arethecorrespondingauthorsofthispaper.
users[7],[14],[15],[39],[40].
LSTM. As a variant of RNN [26], LSTM [27] has been REFERENCES
| widely | used | in knowledge |     | and data | engineering. |     | For |     |     |     |     |     |     |     |     |
| ------ | ---- | ------------ | --- | -------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
instance, Yu et al. [41] applied reinforcement learning with [1] NoahKazis,“NewYorkhas81,875meteredparkingspaces,and
|     |     |     |     |     |     |     |     | millions | of  | free ones,” | 2011. [Online]. | Available: |     | https://www. |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | ----------- | --------------- | ---------- | --- | ------------ | --- |
tree-structured LSTM to join order selection in data man- statista.com/statistics/183505/number-of-vehicles-in-the-united-
agementsystems.Wangetal.[28]developedCLVSA,which states-since-1990/
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.

5908 IEEETRANSACTIONSONKNOWLEDGEANDDATAENGINEERING,VOL.34,NO.12,DECEMBER2022
[2] NYCEDC, “New Yorkers and their cars,” 2018. [Online]. Avail- [28] J.Wang,T.Sun,B.Liu,Y.Cao,andH.Zhu,“CLVSA:Aconvolu-
able:https://edc.nyc/article/new-yorkers-and-their-cars tionalLSTMbasedvariationalsequence-to-sequencemodelwith
[3] E. Brandt, “New Study shows how much time and money we attentionforpredictingtrendsoffinancialmarkets,”inProc.28th
waste on parking,” 2017 [Online]. Available: https://www. Int.JointConf.Artif.Intell.,2019,pp.3705–3711.
thedrive.com/sheetmetal/12389/new-study-shows-how-much- [29] Y.Zhang,X.Yang,J.Ivy,andM.Chi,“ATTAIN:Attention-based
time-and-money-we-waste-on-parking time-awareLSTMnetworksfordiseaseprogressionmodeling,”in
[4] G.PierceandD.Shoup,“Gettingthepricesright:Anevaluationof Proc.28thInt.JointConf.Artif.Intell.,2019,pp.4369–4375.
pricingparkingbydemandinSanFrancisco,”J.Amer.Plan.Assoc., [30] T.Fu,T.N.Hoang,C.Xiao,andJ. Sun,“DDL:Deepdictionary
vol.79,no.1,pp.67–81,2013. learningforpredictivephenotyping,”inProc.28thInt.JointConf.
[5] C.Roman,R.Liao,P.Ball,S.Ou,andM.deHeaver,“Detecting Artif.Intell.,2019,pp.5857–5863.
on-street parking spaces in smart cities: Performance evaluation [31] T. Huang, G. Shen, and Z. Deng, “Leap-LSTM: Enhancing long
of fixedandmobilesensingsystems,”IEEETrans.Intell.Transp. short-termmemoryfortextcategorization,”inProc.28thInt.Joint
Syst.,vol.19,no.7,pp.2234–2245,Jul.2018. Conf.Artif.Intell.,2019,pp.5017–5023.
[6] A. Shahzad, J.-Y. Choi, N. Xiong, Y.-G. Kim, and M. Lee, [32] B.Xingetal.,“Earlierattention?Aspect-awareLSTMforaspect-
“Centralizedconnectivityformultiwirelessedgecomputingand basedsentimentanalysis,”inProc.28thInt.JointConf.Artif.Intell.,
cellularplatform:Asmartvehicleparkingsystem,”WirelessCom- 2019,pp.5313–5319.
mun.MobileComput.,vol.2018,pp.1–232018. [33] H.V.NguyenandL.Bai,“Cosinesimilaritymetriclearningforface
[7] J.Fang,A.Ma,H.Fan,M.Cai,andS.Song,“Researchonsmart verification,”inProc.AsianConf.Comput.Vis.,2011,pp.709–720.
parking guidance and parking recommendation algorithm,” in [34] W.Kong,Z.Y.Dong,Y.Jia,D.J.Hill,Y.Xu,andY.Zhang,“Short-
Proc.8thIEEEInt.Conf.Softw.Eng.Serv.Sci.,2017,pp.209–212. termresidentialloadforecastingbasedonLSTMrecurrentneural
[8] F.Caicedo,C.Blazquez,andP.Miranda,“Predictionofparking network,”IEEETrans.SmartGrid,vol.10,no.1,pp.841–851,Jan.
spaceavailabilityinrealtime,”Exp.Syst.Appl.,vol.39,no.8,pp. 2019.
7281–7290,2012. [35] E.Schumaker,“Human-to-humantransmissionofnewcoronavi-
[9] N.Feng,F.Zhang,J.Lin,J.Zhai,andX.Du,“Statisticalanalysis rus reported in China,” 2020. [Online]. Available: https://
andpredictionofparkingbehavior,”inProc.IFIPInt.Conf.Netw. abcnews.go.com/Health/human-human-transmission-coronavirus-
ParallelComput.,2019,pp93–104. reported-china/story?id=68403105
[10] F. Zhang et al., “PewLSTM: Periodic LSTM with weather-aware [36] D.K.Ahorsu,C.-Y.Lin,V.Imani,M.Saffari,M.D.Griffiths,and
gatingmechanismforparkingbehaviorprediction,”inProc.29th A. H. Pakpour, “The fear of COVID-19 scale: Development
Int.JointConf.Artif.Intell.,17thPacificRimInt.Conf.Artif.Intell., and initial validation,” Int. J. Mental Health Addiction, 2020,
2020,pp.4424–4430. doi:10.1007/s11469-020-00270-8.
[11] P.Mehtaetal.,“COVID-19:Considercytokinestormsyndromes [37] Top Chinese expert: Epidemic to be under control by late
and immunosuppression,” Lancet, vol. 395, no. 10229, pp. 1033– April,2020.[Online].Available:https://en.wikipedia.org/wiki/
1034,2020. 2002%E2%80%932004_SARS_outbreak
[12] ThsParking, “ThsParking homepage,” 2020. [online]. Available: [38] China Daily & Xinhua, “Top Chinese expert: Epidemic to be
http://www.thsparking.com under control by late April,” 2020. [Online]. Available: https://
[13] A.R.AlhoandJ.deAbreueSilva,“Freight-tripgenerationmodel: www.chinadailyhk.com/article/122555
Predicting urban freight weekly parking demand from retail [39] A.Deshpande,S.Nath,P.B.Gibbons,andS.Seshan,“IRIS:Inter-
establishmentcharacteristics,”Transp.Res.Rec.,vol.2,pp.45–54, net-scale resource-intensive sensor services,” in Proc. ACM SIG-
2014. MODInt.Conf.Manage.,2003,p.667.
[14] S.-E.Yooetal.,“PGS:ParkingGuidancesystembasedonwireless [40] D.Teodorovi(cid:2)candP.Lu(cid:3)ci(cid:2)c,“Intelligentparkingsystems,”Eur.J.
sensor network,” in Proc. Int. Symp. Wireless Pervasive Comput., Oper.Res.,vol.175,no.3,pp.1666–1681,2006.
2008,pp.218–222. [41] X.Yu,G.Li,C.Chai,andN.Tang,“ReinforcementLearningwith
[15] M.Idris,E.Tamil,N.Noor,Z.Razak,andK.Fong,“Parkingguid- tree-LSTMfor join order selection,”in Proc. IEEE 36th Int. Conf.
ance system utilizing wireless sensor network and ultrasonic DataEng.,2020,pp.1297–1308.
sensor,”Inf.Technol.J.,vol.8,no.2,pp.138–146,2009. [42] B.Cortez,B.Carrera,Y.-J.Kim,andJ.-Y.Jung,“Anarchitecture
[16] R.Ho€ssingeretal.,“Developmentofareal-timemodeloftheoccu- for emergency event prediction using LSTM recurrent neural
pancyofshort-termparkingzones,”Int.J.Intell.Transp.Syst.Res., networks,”Exp.Syst.Appl.,vol.97,pp.315–324,2018.
vol.12,pp.37–47,2014. [43] J.YuenandA.Torralba,“Adata-drivenapproachforeventpre-
[17] X. Chen, “Parking occupancy prediction and pattern analysis,” diction,”inProc.Eur.Conf.Comput.Vis.,2010,pp.707–720.
Dept.Comput.Sci.,StanfordUniv.,Stanford,CA,USA,Tech.Rep. [44] M. Antunes, M. A. Turkman, and K. Turkman, “A Bayesian
CS229–2014,2014. approachtoeventprediction,”J.TimeSer.Anal.,vol.24,no.6,pp.
[18] Y.Zheng,S.Rajasegarar,andC.Leckie,“Parkingavailabilitypre- 631–646,2003.
dictionforsensor-enabledcarparksinsmartcities,”inProc.IEEE [45] H.Jin,C.Lin,H.Chen,andJ.Liu,“QuickPoint:Efficientlyidentify-
10thInt.Conf.Intell.Sensors,SensorNetw.nf.Process.,2015,pp.1–6. ingdensestsub-graphsinonlinesocialnetworksforeventstream
[19] E.I.Vlahogianni,K.Kepaptsoglou,V.Tsetsos,andM.G.Karlaf- dissemination,” IEEE Trans. Knowl. Data Eng., vol. 32, no. 2, pp.
tis, “A real-time parking prediction system for smart cities,” J. 332–346,Feb.2020.
Intell.Transp.Syst.,vol.20,no.2,pp.192–204,2016. [46] Y.Du,X.Meng,Y.Zhang,andP.Lv,“GERF:Agroupeventrec-
[20] C.Badii,P.Nesi,andI.Paoli,“Predictingavailableparkingslots ommendationframeworkbasedonlearning-to-rank,”IEEETrans.
on critical and regular services by exploiting a range of open Knowl.DataEng.,vol.32,no.4,pp.674–687,Apr.2020.
data,”IEEEAccess,vol.6,pp.44059–44071,2018. [47] Y.Du,X.Meng,andY.Zhang,“CVTM:Acontent-venue-aware
[21] G. A. Seber and A. J. Lee, Linear Regression Analysis. New York, topic model for group event recommendation,” IEEE Trans.
NY,USA:Wiley,2012. Knowl.DataEng.,vol.32,no.7,pp.1290–1303,Jul.2020.
[22] S.LeCessieandJ.C.VanHouwelingen,“Ridgeestimatorsinlogis- [48] H.vanderAa,H.Leopold,andH.A.Reijers,“Efficientprocess
ticregression,”J.Roy.Statist.Soc.:Ser.C(App.Stat.),vol.41,no.1, conformancecheckingonthebasisofuncertainevent-to-activ-
pp.191–201,1992. itymappings,”IEEETrans.Knowl.DataEng.,vol.32,no.5,pp.
[23] C. Hans, “Bayesian lasso regression,” Biometrika, vol. 96, pp. 927–940,May2020.
835–845,2009.
[24] S.R.SafavianandD.Landgrebe,“Asurveyofdecisiontreeclassi- FengZhangreceivedthebachelor’sdegreefrom
fiermethodology,”IEEETrans.Syst.,Man,Cybern.,vol.21,no.3, XidianUniversity,in2012andthePh.D.degreein
pp.660–674,May/Jun.1991. computer science from Tsinghua University, in
[25] A. Liaw and M. Wiener, “Classification and regression by ran- 2017.Heiscurrentlyanassociateprofessorwith
domForest,”RNews,vol.23,pp.18–23,2002. the Key Laboratory of Data Engineering and
[26] D.E.Rumelhart,G.E.Hinton,andR.J.Williams,“Learningrep- Knowledge Engineer, Renmin University of
resentations by back-propagating errors,” Nature, vol. 323, pp. China. His research interests include big data
533–536,1986. management systems, and parallel and distrib-
[27] S. Hochreiter and J. Schmidhuber, “Long short-term memory,” utedsystems.
NeuralComput.,vol.9,no.8,pp.1735–1780,1997.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore. Restrictions apply.

ZHANGETAL.:PERIODICWEATHER-AWARELSTMWITHEVENTMECHANISMFORPARKINGBEHAVIORPREDICTION 5909
Yani Liu is currently working toward the under- BingshengHereceivedthebachelor’sdegreein
graduationdegreewiththeSchoolofInformation, computersciencefromShanghaiJiaoTongUni-
Renmin University of China. In 2019, she was versity,in2003andthePhDdegreeincomputer
|     |     |     |     |     |     |     | science | from | the Hong | Kong | University | of Sci- |
| --- | --- | --- | --- | --- | --- | --- | ------- | ---- | -------- | ---- | ---------- | ------- |
withtheKeyLaboratoryofDataEngineeringand
enceandTechnology,in2008.Heiscurrentlyan
| Knowledge | Engineer, | Renmin | University |     | of  |     |     |     |     |     |     |     |
| --------- | --------- | ------ | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
China.Herresearchinterestsincludehigh-perfor- associate professor with the School of Comput-
mancecomputing,machinelearning,andparallel ing, National University of Singapore. His
anddistributedsystems. researchinterestsincludehigh-performancecom-
|     |     |     |     |     |     |     | puting, | distributed |     | and parallel | systems, | and |
| --- | --- | --- | --- | --- | --- | --- | ------- | ----------- | --- | ------------ | -------- | --- |
databasesystems.
Ningxuan Fengrecivedthe BSdegree in com- JiazaoLinreceivedthePhDdegreeincomput-
puter science from the Renmin University of ingmathematicsfromLanzhouUniversity,China,
|     |     |     |     |     |     |     | in 2011. | He  | is currently | a researcher |     | with the |
| --- | --- | --- | --- | --- | --- | --- | -------- | --- | ------------ | ------------ | --- | -------- |
China,in2020.Heiscurrentlyworkingtowardthe
DepartmentofInformationManagement,Peking
| PhD degree | in computer | science | with | Tsinghua |     |     |     |     |     |     |     |     |
| ---------- | ----------- | ------- | ---- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
University. His research interests include neural University, and the Institute of Automation, Chi-
networkandAIsecurity. nese Academy of Sciences, Beijing, China. His
researchinterestsincludetheInternetofThings,
artificialintelligence,anddataanalysis.
|     |     |     |     |     |     |     | Xiao | Zhang | received | the master’s | degree | in  |
| --- | --- | --- | --- | --- | --- | --- | ---- | ----- | -------- | ------------ | ------ | --- |
ChengYangreceivedtheBEandPhDdegrees
|               |             |     |      |           |     |     | computer | science | and | technology | from | Renmin |
| ------------- | ----------- | --- | ---- | --------- | --- | --- | -------- | ------- | --- | ---------- | ---- | ------ |
| from Tsinghua | University, | in  | 2014 | and 2019, |     |     |          |         |     |            |      |        |
respectively. Heis currentlyanassistantprofes- University, in 1998and thePhDdegree in com-
sorwiththeBeijingUniversityofPostsandTele- puterscienceandtechnologyfromtheInstituteof
communications. His research interests include ComputingTechnology,ChineseAcademyofSci-
ence,in2001.Heiscurrentlyaprofessorwiththe
naturallanguageprocessingandnetworkrepre-
|     |     |     |     |     |     |     | School | of  | Information, | Renmin | University | of  |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | ------------ | ------ | ---------- | --- |
sentationlearning.
|     |     |     |     |     |     |     | China. | His | research | interests | include | database |
| --- | --- | --- | --- | --- | --- | --- | ------ | --- | -------- | --------- | ------- | -------- |
architectureandbigdatamanagementsystems.
JidongZhaireceivedtheBSdegreeincomputer
sciencefromtheUniversityofElectronicScience Xiaoyong Du received the BS degree from
and Technology of China, in 2003 and the PhD HangzhouUniversity,Zhengjiang,China,in1983,
degree in computer science from Tsinghua Uni- the ME degree from the Renmin University of
|     |     |     |     |     |     |     | China, | Beijing, | China, | in 1988, | and | the PhD |
| --- | --- | --- | --- | --- | --- | --- | ------ | -------- | ------ | -------- | --- | ------- |
versity,in2010.Heiscurrentlyanassociatepro-
degreefromtheNagoyaInstituteofTechnology,
fessorwiththeDepartmentofComputerScience
and Technology, Tsinghua University. His Nagoya,Japan,in1997.Heiscurrentlyaprofes-
research interests include performance evalua- sorwiththeSchoolofInformation,RenminUni-
tion for high-performance computers, perfor- versity of China. His research interests include
databasesandintelligentinformationretrieval.
| mance analysis, |     | and modeling |     | of parallel |     |     |     |     |     |     |     |     |
| --------------- | --- | ------------ | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
applications.
|     |     |     |     |     | " For more | information |     | on this | or any | other | computing | topic, |
| --- | --- | --- | --- | --- | ---------- | ----------- | --- | ------- | ------ | ----- | --------- | ------ |
Shuhao Zhang received the bachelor degree in pleasevisitourDigitalLibraryatwww.computer.org/csdl.
computerengineeringfromNanyangTechnological
Universityin2014,andthePhDdegreeincomputer
scienceinNationalUniversityofSingaporein2019.
| He is currently | an  | assistant | professor | at the |     |     |     |     |     |     |     |     |
| --------------- | --- | --------- | --------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
SingaporeUniversityofTechnologyandDesign.His
researchinterestsincludehighperformancecom-
| puting, stream |     | processing | systems, | and |     |     |     |     |     |     |     |     |
| -------------- | --- | ---------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
databasesystem.
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:09:52 UTC from IEEE Xplore.  Restrictions apply.