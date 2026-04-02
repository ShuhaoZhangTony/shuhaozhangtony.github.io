| Article |     |     |     |     |     | https://doi.org/10.1038/s41467-024-53431-x |     |     |
| ------- | --- | --- | --- | --- | --- | ------------------------------------------ | --- | --- |
MatSwarm
|              | : trusted |             | swarm |     | transfer |     | learning |     |
| ------------ | --------- | ----------- | ----- | --- | -------- | --- | -------- | --- |
| driven       | materials | computation |       |     |          | for | secure   | big |
| data sharing |           |             |       |     |          |     |          |     |
Received:11November2023 RanWang 1,2,3,ChengXu 1,2,4 ,ShuhaoZhang3,FangwenYe 1,
|     |     | YusenTang1,SisuiTang |     |     | 1,HangningZhang | 1,WendiDu1& |     |     |
| --- | --- | -------------------- | --- | --- | --------------- | ----------- | --- | --- |
Accepted:7October2024
|     |     | XiaotongZhang |     | 1,2,4 |     |     |     |     |
| --- | --- | ------------- | --- | ----- | --- | --- | --- | --- |
Checkforupdates TherapidadvancementofIndustry4.0necessitatesclosecollaborationamong
;,:)(0987654321 ;,:)(0987654321
materialresearchinstitutionstoacceleratethedevelopmentofnovelmaterials.
However,multi-institutionalcooperationfacessignificantchallengesinpro-
tectingsensitivedata,leadingtodatasilos.Additionally,theheterogeneousand
non-independentandidenticallydistributed(non-i.i.d.)natureofmaterialdata
hindersmodelaccuracyandgeneralizationincollaborativecomputing.Inthis
paper,weintroducetheMatSwarmframework,builtonswarmlearning,which
integratesfederatedlearningwithblockchaintechnology.MatSwarmfeatures
twokeyinnovations:aswarmtransferlearningmethodwitharegularization
termtoenhancethealignmentoflocalmodelparameters,andtheuseof
TrustedExecutionEnvironments(TEE)withIntelSGXforheightenedsecurity.
Theseadvancementssignificantlyenhanceaccuracy,generalization,andensure
dataconfidentialitythroughoutthemodeltrainingandaggregationprocesses.
ImplementedwithintheNationalMaterialDataManagementandServices
(NMDMS)platform,MatSwarmhassuccessfullyaggregatedover14million
materialdataentriesfrommorethanthirtyresearchinstitutionsacrossChina.
Theframeworkhasdemonstratedsuperioraccuracyandgeneralizationcom-
paredtomodelstrainedindependentlybyindividualinstitutions.
The integration of Industrial Internet of Things (IIoT) and machine However, creating accurate predictive models requires large,
learning is revolutionizing research and development in materials diverse training datasets. Today, various materials and big data
science1,2.TheadventofIndustry4.0hasrevolutionizedmaterialssci- platforms6–8 have been developed, providing researchers with
ence through the integration of IIoT. Advanced sensors and data aggregateddata.Nonetheless,forsensitivedatasetsthatcannotbe
acquisitiontechnologiesenablereal-timemonitoringofmaterialpara- publiclyshared,materialdataminingandanalysisremainlimiteddue
meterssuchastemperature,hardness,meltingpoint,andboilingpoint, tosmallsamplesizes9,10.Thisposesachallengefortrainingeffective
providingunprecedenteddatasupport3.Concurrently,machinelearn- augmentation11,12
|     |     |     |     | models. | While data |     | offers a potential | solution, |
| --- | --- | --- | --- | ------- | ---------- | --- | ------------------ | --------- |
ing algorithms analyze this vast data, allowing researchers to predict relying on simulated data can compromise model accuracy and
materialproperties,optimizedesigns,anddiscovernewmaterialsbased generalization13,14. Additionally, even with sufficient samples, stan-
onperformance,structuralproperties,andpreparatoryconditions4,5. dardized testing environments and methodologies can limit data
1SchoolofComputerandCommunicationEngineering,UniversityofScienceandTechnologyBeijing,100083Beijing,China.2BeijingAdvancedInnovation
CenterforMaterialsGenomeEngineering,UniversityofScienceandTechnologyBeijing,100083Beijing,China.3CollegeofComputingandDataScience,
NanyangTechnologicalUniversity,639798Singapore,Singapore.4ShundeInnovationSchool,UniversityofScienceandTechnologyBeijing,528399
| Guangdong,China. | e-mail:xucheng@ustb.edu.cn;zxt@ies.ustb.edu.cn |     |     |     |     |     |     |     |
| ---------------- | ---------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
1
| NatureCommunications|(        2024)1  | 5:9290  |     |     |     |     |     |     |     |
| ------------------------------------- | ------- | --- | --- | --- | --- | --- | --- | --- |

Article https://doi.org/10.1038/s41467-024-53431-x
diversity,furtherhinderingmodelgeneralizationfornewmaterials. Results
Transferlearning15isoftenusedasasolution,butitinvolvessharing To date, the MatSwarm platform for material genome engineering
completemodelswiththirdparties,whichraisesconcernsaboutdata (MGE)hascollectedover14millionpiecesofvalidmaterialdata27.The
securityandpotentialleakage. platformpredominantlyencompassesdataonspecialalloys,material
To accelerate the development of new materials, a secure and thermodynamics/kinetics, composite functional materials, catalytic
collaborative computing methodology is essential. This approach materials,first-principlescalculations,andbiomedicalmaterials.Data
must ensure data protection while allowing collaborative modeling consumers from various fields cansubmitsharing tasks viathe fra-
across different organizations to improve model accuracy and gen- mework according to their specific needs, enabling collaborative
eralization. federated learning (FL)16 offers a viable solution by predictionofmaterialpropertiesandthedevelopmentofnewmate-
enablingorganizationstocollaboratewithoutrevealingtheiroriginal rialswithotherstakeholders.Inourexperiments,weutilizethepre-
data,sharingonlyinsightsfromlocalmodels.Thisprotectssensitive dictionofperovskiteformationenergiesasanillustrativeexampleto
datawhileallowingeffectiveaggregation17.However,thetraditionalFL evaluatetheperformanceoftheMatSwarmframework.Thefollowing
framework,whichreliesonacentralservertoaggregatelocalmodel researchquestions(RQs)areaddressed:
parameters18,raisesconcernsabouttheintegrityandauthenticityof RQ1:HowdoesMatSwarmaddresssecurityissuesduringthecol-
theglobalmodel19.Thiscentralizationalsomakestheserversuscep- laborativecomputingprocessinthematerialsciencedomain?
tibletointernalandexternalattacks20,21. RQ 2: What are the advantages of MatSwarm compared to other
Moreover, most existing FL solutions have primarily been vali- methodologieswithintheMatSwarm?
datedtheoretically,usingpubliclyavailabledatasetsandfocusingon RQ3:HowdodifferentfactorsaffecttheperformanceofMatSwarm,
classificationproblems22,23.Thistheoreticalfocusfailstoaddressthe suchasdatadistribution(non-i.i.d.vsi.i.d.),differentlocalmodels
practical challenges faced by non-i.i.d. datasets owned by different andaggregationmethods,andTEE?
organizations,whereissuesofmodelaccuracyandgeneralizationare RQ 4: How scalable is MatSwarm in terms of its performance,
more pronounced. The lack of empirical validation in real-world includingthesizeofthedataset,thenumberoffeatures,andthe
applicationsfurtherquestionsthepracticalityandfeasibilityofthese numberofparticipants?
solutions.TotrulyharnessthepotentialofFLinmaterialsscience,itis
crucialtodevelopmethodologiesthatnotonlyperformwellincon- Experimentalsetup
trolled, theoretical settings but also demonstrate robustness and In this experiment, all services and participants’ applications were
effectivenessindiverse,real-worldenvironments.Thiswillensurethe deployedoncloudservers.The16-coreIntelXeon(IceLake)Platinum
models are reliable, secure, and capable of advancing material dis- 8369Bprocessorwith32GBRAM(16GBastrustedRAM)wasusedto
coveryanddevelopment. enable Intel ®Software Guard Extensions, allowing organizations to
To accelerate materials science research and development, employ enclaves for protecting the confidentiality and integrity of
building on the Materials Genome Engineering (MGE) project24, we theircodeanddata.TheMatSwarmframeworkwasimplementedona
developed the NMDMS platform25,26 to facilitate the collection, sto- consortiumblockchainbasedonHyperledgerFabric,witheachnode
rage,retrieval,andcomputationofmaterialdata.Asthecornerstone initiatedasaDockercontainerandconnectedtotheblockchainnet-
of MGE’s data applications, NMDMS platform provides data con- workusingDockerSwarm28.Localmodelsandaggregationmethods
sumerswithaccesstoanextensiverepositoryofmaterialdatacon- areavailableforparticipantstochoosefromontheMatSwarmplat-
tributed by over thirty research institutions across China. This form.Thebatchsizewassetto128,thenumberofiterationswas200,
platformalsoservesasadataexchangeandsharinghubformaterials andthelearningratewas0.002.Inthetrainingobjective,γandλwere
researchers. Although the NMDMS platform provides basic colla- setto0.5and1,respectively.
borative computing services, it lacks solutions for handling the DatasetandModelSelection.Inourexperiments,weillustrateour
inherent limitations of FL in the context of material science. For approachusingthepredictionofperovskiteformationenergiesasa
example,whileitachievesrelativelyhighpredictionaccuracyfori.i.d. casestudy.WeutilizedperovskitedatafromourNMDMSplatformto
(independentandidenticallydistributed)trainingsets,itfallsshortin evaluatetheperformanceoftheMatSwarmframework,selecting4016
generalizationcapabilityfornon-i.i.d.trainingsetsandcannotensure perovskitesamples.Thetrainingsetconsistsof3694samples,evenly
the confidentiality and integrity of parameters during the training distributedamongorganizations.Thetestsetcomprises322samples.
process. Detailed feature engineering on the dataset is described in Supple-
Here,weintroduceMatSwarmaspartoftheNMDMSplatformto mentary Note 4. Unless specified otherwise, the number of partici-
addressthelimitationsinmaterialssciencecollaboration,particularly pantsintheexperimentissettothree.Thisexperimentaimedtotest
in the context of Industry 4.0, where efficient cooperation among theperformanceofMatSwarmfornon-i.i.d.materialdata.Tothisend,
researchinstitutionsiscrucialforacceleratingnovelmaterialdevel- wedividedthetrainingdatasetintonon-independentandidentically
opment.MatSwarmtacklesthechallengesposedbynon-i.i.d.dataand distributed (non-i.i.d.) and independent and identically distributed
ensures the confidentiality and integrity of sensitive material infor- (i.i.d.)datasetsforcomparativetesting.Forthenon-i.i.d.dataset,since
mationthroughadecentralizedcollaborativecomputingframework. thelabelvaluesarenormallydistributed,wedividedthetrainingset
Tothebestofourknowledge,thisapplicationoftheMatSwarmfra- intothreedatasetswithdifferentmeansandvariances.Thedistribu-
meworkis unprecedented inthe materials field. Validated with real tion of label values in these datasets is illustrated in Supplemen-
datasets from NMDMS, MatSwarm significantly enhances model taryFig.10.
trainingaccuracyandgeneralizationunderheterogeneousdatacon- Regardingmodelselection,unlessotherwisespecified,thelocal
ditions.Additionally,byintegratingtrustedexecutionenvironments trainingmodelsutilizeaMultilayerPerceptron(MLP)neuralnetwork
(TEE)basedonIntelSGX,theframeworkensuressecureandaccurate fortraining,withahiddensizeof32andthreenetworklayers.Onthe
model aggregations. Ultimately, MatSwarm not only addresses the MatSwarmframework,thetaskissuercanselectdifferentlocaltraining
collaborativecomputingchallengesbutalsounlocksthefullpotential modelsandaggregationmethodsbasedonthesharingtask.Forjoint
ofmaterialdata,drivinginnovationandmeetingthedemandsofhigh- training,allorganizations’datawascombined,andmodeltrainingwas
throughputcomputingandexperimentation,thusacceleratingmate- alsoconductedusingtheMLPneuralnetwork.
rial discovery. A general introduction on MatSwarm is available in EvaluatedAttacks.Inthisscenario,fournodesparticipateinthe
SupplementaryMovie1. collaborativetask,withoneactingasaByzantinenodelaunchingthe
NatureCommunications|( 2024)1 5:9290 2

Article https://doi.org/10.1038/s41467-024-53431-x
attack.Sinceallattackmethodstargetthegradients,wemodifythe global model storage and preventing network attacks. Additionally,
modelupdatesinthisexperimenttogradientsinsteadofthemodel digitalsignaturesandhashesprotectmodelupdates,furtherenhan-
parameters.Theaggregationmethodsincludethefiveprovidedbythe cing the security of model training and preventing tampering or
MatSwarm framework. We evaluate the impact of different attack contamination.
methodsontheaccuracyoftheseaggregationmethodsbothinside Impactofattacksondifferentaggregationmethodsinside/out-
andoutsidetheTEE.Giventhesusceptibilityofexistingswarmlearn- side TEE: as shown in Fig. 1a–e present test results in a non-TEE
ingframeworkstodatapoisoningattacks29,ourexperimentaimsto environment.Theresultsindicatethatdifferentaggregationmethods,
demonstrate the robustness of MatSwarm against such attacks. We bydesign,canresistvariousdatapoisoningattacks.However,nosin-
considerthefollowingpopularpoisoningattacks: gleaggregationmethodcanresistalltypesofdatapoisoningattacks.
(cid:129) NoiseAttack.TheByzantinenodessendnoise-perturbedgradients The convergence speed and final model accuracy are affected to
generatedbyaddingGaussiannoisetothehonestgradients30.We varying degrees depending on the specific attack and aggregation
settheGaussiandistributionparametersasNð0:1,0:1Þ. methodused.ToverifytheTEE’sresistancetodatapoisoningattacks,
(cid:129) Label-Flipping.TheByzantinenodesflipthelocalsamplelabels wetestedtheaggregationmethodsthatwereineffectiveinthenon-
duringthetrainingprocesstogeneratefaultygradients31.Speci- TEEwithintheTEE.Figure.1f–jshowthattheTEEeffectivelyresistsall
fically,alabellisflippedas −l,wherelistheformationenergyof typesofdatapoisoningattacks.Theconvergencespeedandmodel
perovskiteinourexperiment. accuracy remain virtually unaffected, closely matching the perfor-
(cid:129) Sign-Flipping.Duringeachroundoflearning,participantscalcu- mance observed in the absence of attacks. This demonstrates that
latethegradients∇fθofthelocalmodel,whicharethenuploaded MatSwarmcaneffectivelymitigatetheriskofdatapoisoningattacks.
to a centralserver for aggregation32. After calculating the local
gradients,theByzantinenodesflipthesignsofthesegradients Methodologiescomparison(RQ2)
andsend −∇fθ. WithintheMatSwarmframework,weconductedcomparativeexperi-
(cid:129) ALittleisEnough.TheByzantinenodessendmaliciousgradient mentsonpredictionaccuracyandresponsetimebetweenMatSwarm,
vector with elements crafted33. For each node i∈[d], where d local independent training (referred to as “Solo”), joint data training
is the number of Byzantine nodes, the Byzantine nodes (referredtoas“Joint”),andotherexistingsolutions,includingFedAvg35,
calculate mean (μ) and standard deviation (σ) over benign FedProx36, Homomorphic Encryption Federated Transfer Learning
i i
updates, and set corrupted updates Δ to values in the range (referred to as “HE-FTM”)37, and a similar framework proposed by
i
ðμ (cid:2)z σ,μ +z σÞ, wherez ranges from 0 to 1. We set Kalapaakingetal.(referredtoas“Trust-FL”)38,toillustratetheperfor-
i max i i max i max
z =0:3inourexperiment. mance advantages of this framework. The performance comparison
max
(cid:129) InnerProductManipulation.TheprimarygoalofIPMistodisrupt betweenMatSwarmandothermethodologiesispresentedinFig.2.
model performance by manipulating the inner product of gra- The results of model accuracy, evaluated using mean squared
dientstoaffectthedirectionandspeedofmodeltraining34.For error (MSE), are shown in Fig. 2. MatSwarm significantly improves
example, an attacker could enhance or diminish the effects of predictionaccuracycomparedtoSolowhilemaintainingtheprivacyof
gradientsinaparticulardimension.Wesetthescalingfactorα=2, localdatasetsacrossvariousorganizations.Amongthemethodologies
thegradientmeantobe∇fθ,andthegradientoftheattacksentto compared,MatSwarmachievespredictionaccuracyclosesttothatof
be(cid:2)∇fθ*α. Joint,whichcanbeconsideredtheupperboundofaccuracyforcol-
laborative computation. In contrast, HE-FTM involves polynomial
Securityanalysis(RQ1) approximationforevaluatingnonlinearfunctions,resultinginsome
Confidentialityprotectionforlocaldatasets:thisframeworkenables accuracy loss during training. Trust-FL, employing a horizontal FL
collaborative computing among multiple organizations while main- model, is more suited for i.i.d. training data and is less effective at
taining the confidentiality of local datasets. Traditional centralized predicting non-i.i.d. material data models. In terms of prediction
machine learning methods require storing all datasets on a central accuracy,ourmodelismoresuitableforthematerialsciencedomain,
server,posingrisksofsensitivedataleakage.ThroughMatSwarm,each demonstratingbetterpredictionaccuracy.
organization trains models on its local dataset without sharing the Regarding response time, as shown in Fig. 2, Solo exhibits the
original data. Instead, organizations only share encrypted model shortestresponsetimeforeachorganization.Duetothecommunica-
parameters,not rawdata. Thisapproach prevents the disclosure of tionrequiredbetweenorganizations,MatSwarmtakeslongertoexe-
sensitive information without disrupting the task processes of the cute compared to Solo and Joint. The average response time of
participatingorganizations. MatSwarmincreasesbyapproximately4secondscomparedtoJoint.
Securemodeltrainingandaggregationbasedon TEE:ensuring Despitethisincrease,thesecurityandprivacyprotectionofferedby
thesecurityofmodeltrainingprocessesduringswarmlearningisa MatSwarm are highly valuable. Moreover, in practical applications,
significantchallenge.Toaddressthisissue,MatSwarmemploysaTEE organizationstypicallydonotrequirereal-timemodeltraining,andthe
established by Intel SGX. In this framework, the original dataset is responsetimedifferenceremainswithinanacceptablerange.Notably,
encrypted before being sent to the blockchain, using a shared key comparedtoHE-FTM,ourmodeldemonstrateslowercomputational
established through the Diffie-Hellmankey exchange protocol.This complexity and significantly improved response time. Compared to
ensures that data cannot be stolen or tampered with during trans- Trust-FL, our framework shows a slight increase in response time,
mission. During model training and aggregation, the SGX Enclave primarilyduetotheenhancedsecuritymeasures.Modeltraininginour
performstheseoperationsinatrustedexecutionenvironment,pre- frameworkoccursinatrustedexecutionenvironment,addingsome
ventingattackersfromaccessingoralteringmodelparameters. communication overhead. Additionally, the blockchain consensus
Blockchain-basedsecurestorage:thisframeworkusesblockchain algorithm,inspired byPBFT,effectivelyaddresses securityconcerns
technologytoreplaceuntrustedthirdparties,significantlyreducing arising from Byzantine nodes. Although the consensus algorithm
theriskofdataleakage.Smartcontractsareemployedtostandardize slightly impacts response time by increasing communication fre-
andautomatemodeltrainingandaggregationprocesses.Transactions quency,thetrade-offisjustifiedbytheimprovedsecurityperformance.
arestoredontheblockchaininhashform,andduetotheuniqueness
of hash values, any tampering with transaction data will result in a Ablationexperiment(RQ3)
changeinthehashvalue.Duringtheconsensusprocess,nodesreject To understand how different factors affect the performance of
transactions with inconsistenthashvalues,ensuringtheintegrityof MatSwarm, we conducted ablation experiments varying data label
NatureCommunications|( 2024)1 5:9290 3

Article https://doi.org/10.1038/s41467-024-53431-x
Fig.1|Comparisonofthemeansquarederror(MSE)acrossdifferentaggre- Xaxisrepresentsthenumberoftrainingrounds,whiletheYaxisdenotesprediction
gationmethodsundervariousattackscenarios.Here,MSEindicatesthemean accuracymeasuredbytheMSEvalue.a–edisplayresultstestedinanon-TEE(Non-
squarederrorbetweenthepredictedandlabelvaluesofperovskiteformation TrustedExecutionEnvironment),whereasf–jpresentresultstestedinaTEE(Trusted
energy.Thetotalnumberofsamplesinthetrainingdataset(n=3694)isevenly ExecutionEnvironment),specificallywithintheMatSwarmframework,utilizing
distributedamongtheorganizations,andthetestsetconsistsof322samples.The variousglobalaggregationmethods.SourcedataareprovidedasaSourceDatafile.
NatureCommunications|( 2024)1 5:9290 4

Article https://doi.org/10.1038/s41467-024-53431-x
problemsincludeMLP,recurrentneuralnetwork(RNN),Lasso,andlong
short-termmemory(LSTM).Theaggregationmethodsconsideredare
Mean,Median,MultiKrum,CenteredClipping,andGeoMed.
Ultimately,weobtainedthepredictionresultsshowninFig.3c,d,
andTable1.TheresultsindicatethatusingMLPwithinMatSwarmisthe
mostsuitableforpredictingperovskiteformationenergy.Buildingon
theMLPlocalmodelarchitecture,wetestedtheimpactofdifferent
aggregationmethodsonmodelaccuracyandresponsetime.Interms
ofaccuracy,Mean and CenteredClippingachievedthehigherpreci-
sion, while Mean was the most efficient in terms of response time.
Therefore,tochooseasuitableaggregationmethod,oneshouldbal-
ance the trade-offs among the needs of efficiency, accuracy, and
security to achieve an optimal solution. This modular development
approachfacilitates participantsinselecting the mostsuitablesolu-
tionsfortrainingtasksandsimplifiesplatformiterationsandupdates
tomeetdiversetrainingdemandsinthematerialsciencedomain.
Fig.2|PerformancecomparisonbetweenMatSwarmandothermethodologies
3)non-TEEvsTEE:ToevaluatetheimpactofTEEontheaccuracy
acrossthreeorganizations.Thetotalnumberofsamplesinthetrainingdataset
andefficiencyoftheMatSwarmframework,wecomparedtheMSEand
(n=3694)isevenlydistributedamongtheorganizations,andthetestsetconsists
responsetimeofMatSwarmbeforeandafterusingTEE.Thecompar-
of322samples.ThemethodsevaluatedincludeSolo(individualtraining),FedAvg,
ison,showninFig.4,indicatesthatusingTEEdoesnotsignificantly
FedProx,HE-FTM(HomomorphicEncryption-basedFederatedTransferLearning),
Trust-FL(TrustedExecutionEnvironment-basedFederatedLearning),MatSwarm, affectthepredictionaccuracyofthemodel,whethertrainingiscon-
andJoint(centralizedtraining).Theleftyaxisrepresentsthemeansquarederror
ductedindividually,withMatSwarm,oronjointdata.However,theuse
(MSE,eV/atom),indicatingpredictionaccuracy,andtherighty-axisshowsthe of TEE introduces some communication overhead, leading to an
ResponseTime(seconds)foreachmethodology.TheboxplotsdepicttheMSE increaseinresponsetime.Inthematerialssciencedomain,unlikein
distributionover10experimentalruns,showingthemean,quartiles,andoutliers, transactionsystems,thereistypicallynostrongdemandforreal-time
whilethelineplotwitherrorbarsindicatestheaverageresponsetime.Toenhance response,andlargemodeltrainingoftentakeshours.Therefore,the
thevisibilityofthestandarddeviation,azoomeffectisappliedintheinsetblack increaseinresponsetimedue toTEEisnegligiblecompared tothe
boxes,emphasizingthevariability.SourcedataareprovidedasaSourceDatafile. enhancementinsecurityitprovides.TheTEE-basedMatSwarmfully
meets the performance requirements for model prediction in the
materialssciencefield.
distribution,localmodelarchitectures,andw/woaTEE.Unlessspe-
cifiedotherwise,alllocalmodelsusethesameMLParchitecture,and Scalabilitytesting(RQ4)
theaggregationalgorithmisMean. In this experiment, we evaluated the scalability of MatSwarm by
1) non-i.i.d. VS i.i.d.: To demonstrate the performance of the examining the impactof different dataset sizes,the number of fea-
MatSwarmonnon-i.i.d.materialdata,wetestedbothnon-i.i.d.andi.i.d. tures,andthenumberofparticipants.Itisimportanttonotethatour
datasets. NMDMSplatformoperateswithinalimitednumberofmaterialorga-
(cid:129) i.i.d.TrainingSets:Fig.3adepictsthepredictionresultsforper- nizations.Currently,theplatformaccommodatesupto30registered
ovskiteformationenergyusingi.i.d.trainingsetsselectedinde- materialorganizations,withtypicallyno>10participantsinasharing
pendently for each organization. Our algorithm exhibits task.Therefore,inourexperiments,wetestedtheframeworkwitha
extremelyhighpredictionaccuracyforthei.i.d.dataset,nearing maximumof15participants(materialorganizations).
theaccuracyofJoint. 1)Datasetsize:Fig.5aillustratestheMSEandresponsetimeof
(cid:129) Non-i.i.d.TrainingSets:AsshowninFig.3b,thepredictionaccu- MatSwarm across varying dataset sizes. The results indicate that
racyfor the non-i.i.d. dataset is slightly lower compared tothe datasetsizehasanegligibleimpactontheresponsetimeofMatSwarm,
i.i.d.datasetbutstillclosetotheaccuracyofJoint.Comparedto while the model accuracy continues to improve with increasing
Solo,theaccuracyforOrg1decreasesduetothedifferentlabel amounts of data. Notably, even when each organization’s dataset
distributionsbetweenitsdataandthetestset.Asimilartrendis comprisesonly30%oftheoriginaldataset,ourmethoddemonstrates
observedforOrg3. high accuracy. This indicates that our approach can achieve highly
accurate training models even with small sample sizes within each
However,asdisplayedinTable1,usingMatSwarmforpredictions, organization,effectivelyaddressingthesmallsampleprobleminthe
the prediction MSE for Organization 1 decreased from 1.0291 to materialssciencedomain.
0.2096,andforOrganization3,itdecreasedfrom1.6159to0.5849, 2)Numberoffeatures:asshowninFig.5b,increasingthenumber
withtheglobalmodelachievinganaccuracyaslowas0.0903.Despite offeaturesdoesnotsignificantlyaffecttheresponsetimeofMatS-
Organization2havingasimilarlabeldistributiontothetestsetand warm,demonstratinggoodscalabilityintermsofcomputationaleffi-
thus showing good prediction accuracy, its local model prediction ciency. In terms of prediction accuracy, even with sample features
accuracy also improved slightly after training with MatSwarm. This constitutingonly30%ofthetotalfeatures,ourmethodachievesan
demonstratesthatMatSwarmhasstronggeneralizationcapabilitiesfor MSEvalueaslowas0.155,indicatinghighaccuracy.Therefore,using
non-i.i.d.materialdata. MatSwarm,evenifeachorganizationcanonlyobtainalimitednumber
2)Differentlocalmodelsandaggregationmethods:SinceMatSwarm offeaturevalues,itisstillpossibletoachievehighlyaccuratetraining
willperformvarioustrainingtasksbeyondpredictingperovskiteforma- models.Thismakesourapproachparticularlyeffectiveforscenarios
tionenergy,thechoiceoflocalmodelsandaggregationmethodssig- whereorganizationshavelimiteddataorfeatureavailability,ensuring
nificantlyimpactstheaccuracyofmodeltrainingfordifferenttasks.In robustandreliablemodelperformance.Furthermore,afterreaching
thisexperiment,wecomparedtheperformanceofMatSwarmusingdif- ~90%ofallfeatures,theadditionoflessimportantfeaturesdoesnot
ferentlocalmodelsandaggregationmethodstoidentifythemostsui- substantially impact accuracy. In practicalapplications,selecting an
table collaborative computing scheme for predicting perovskite appropriatesetoffeaturesiscrucialforbalancingaccuracyandeffi-
formation energy. The local models capable of solving regression ciency,ofteninvolvingfeatureextractionoptimizationmethods39,40.
NatureCommunications|( 2024)1 5:9290 5

Article https://doi.org/10.1038/s41467-024-53431-x
Fig.3|Performancecomparisonontheinfluenceofdifferentdatalabeldis- (MatSwarm(Global)),andthemodeltrainedafteraggregatingalltrainingdatasets
tributions.a,brespectivelyrepresentthemeansquarederror(MSE)andresponse (Joint).cScatterplotofpredictionresultsundervariouslocalmodels.
timewhenpredictingperovskiteformationenergyunderiid(independentand dComparisonofMSEandresponsetimeacrossdifferentaggregationmethods.
identicallydistributed)andnon-iid(non-independentandidenticallydistributed) Thetotalnumberofsamplesinthetrainingdataset(n=3694)isevenlydistributed
conditions.Themodelstestedincludetheindependentlytrainedmodelsbyeach amongtheorganizations,andthetestsetconsistsof322samples.Sourcedataare
organization(Solo-Org1,2,3),thelocalmodelsundertheMatSwarmframework providedasaSourceDatafile.
(MatSwarm(Org1,2,3)),theglobalmodelundertheMatSwarmframework
3)Numberofparticipants:asshowninFig.5c,theresponsetimeof code and data from external attacks during computation. This
MatSwarm increases linearly with the number of participants. This approacheffectivelymitigatespoisoningattacksassociatedwithtra-
increaseisprimarilyduetotheadditionaltimerequiredforcommu- ditional FL setups. Furthermore, our experimental setup included
nicationanddatacoordination.Theobservedincreaseinresponsetime various attack scenarios to test the resilience of the MatSwarm fra-
alignswiththeoreticalexpectations.Intermsofaccuracy,thepredic- mework.ThesetestsdemonstratedthatMatSwarmeffectivelymain-
tion accuracy of MatSwarm shows a notable upward trend as the tainsdataintegrityandmodelaccuracy,eveninthefaceofmalicious
numberofparticipantsincreases.However,afteracertainthreshold, attemptstocorruptthetrainingprocess.
theaccuracymayslightlydeclineduetoissuessuchascommunication Feasibility: MatSwarm is crucialfor enabling collaborative com-
delays, data inconsistencies, and model overfitting introduced by a putationovernon-i.i.d.materialdata,acommonchallengeduetothe
highernumberofparticipants.Therefore,intheparticipantselection diversenatureofdatasourcesandformatsinthisfield.Comparedto
process,moreisnotnecessarilybetter.ThisdemonstratesthatMatS- independenttrainingbyorganizationsandotherFLmethodologies,
warmcaneffectivelylearnthedatacharacteristicsofeachorganization, ourmethodsignificantlyimprovespredictionaccuracyandgeneral-
achievinghighlyaccuratetrainingmodelswithouttheneedforalarge izationability.ThishighlightsMatSwarm’spotentialtounlockthefull
number of participants for collaborative training. Consequently, this valueofmaterialdata,facilitatingmoreinformedandaccuratemate-
approachcanalsoenhancetheefficiencyofmodeltraining. rialsdiscoveryanddevelopmentprocesses.Extensivetestingwithreal-
worlddatafromthematerialsciencedomainvalidatedtheusabilityof
Discussion the MatSwarm framework. By engaging with actual datasets from
AdvantagesoftheMatSwarmframework participating institutions,we demonstrated the feasibility and accu-
Security: MatSwarm incorporates advanced security measures to racyofthemodelsgeneratedthroughourplatform.Thisuseofreal
ensure data confidentiality and integrity. A key component of our data underscores the framework’s ability to address the ‘data silos’
securitystrategyistheuseofTEEs,specificallyIntelSGX,whichprotect problemprevalentinmaterialsscience.
NatureCommunications|( 2024)1 5:9290 6

| Article |     |     |     |     |     | https://doi.org/10.1038/s41467-024-53431-x |     |     |     |     |
| ------- | --- | --- | --- | --- | --- | ------------------------------------------ | --- | --- | --- | --- |
Table1|Meansquarederrors(MSEs,eV/atom)forthepredictionofperovskiteformationenergiesusingvariouslocalmodels
| LocalModel | RNN | Lasso |     | MLP |     |     |     | LSTM |     |     |
| ---------- | --- | ----- | --- | --- | --- | --- | --- | ---- | --- | --- |
Solo-Org1 0.9146±0.1382 1.3946±0.0298 1.0291±0.0551 1.1483±0.0845
Solo-Org2 0.2681±0.0169 0.4313±0.0026 0.2746±0.0233 0.3481±0.0292
Solo-Org3 1.4023±0.0692 2.1218±0.0029 1.6159±0.0405 1.5687±0.0586
MatSwarm(Org1) 0.2341±0.0232 1.1829±0.0045 0.2096±0.0474 0.1388±0.0302
MatSwarm(Org2) 0.2156±0.0199 0.2862±0.0032 0.1176±0.0143 0.1291±0.0273
MatSwarm(Org3)
|     | 0.3769±0.0866 | 1.2222±0.0044 |     | 0.5849±0.0386 |     |     |     | 0.1987±0.0759 |     |     |
| --- | ------------- | ------------- | --- | ------------- | --- | --- | --- | ------------- | --- | --- |
MatSwarm(Global) 0.0869±0.0148 0.2595±0.0035 0.0903±0.0073 0.0941±0.0194
| Joint | 0.0147±0.0021 | 0.0191±0.0039 |     | 0.0138±0.004 |     |     |     | 0.0125±0.0024 |     |     |
| ----- | ------------- | ------------- | --- | ------------ | --- | --- | --- | ------------- | --- | --- |
Thetotalnumberofsamplesinthetrainingdataset(n=3694)isevenlydistributedamongtheorganizations,andthetestsetconsistsof322samples.“Solo-Org1,”“Solo-Org2,”and“Solo-Org3”
representpredictionsmadeusingonlythelocaldatasetsfromeachorganization,while“MatSwarm(Org1),”“MatSwarm(Org2),”“MatSwarm(Org3),”and“MatSwarm(Global)”correspondtothelocal
andcollaborativemodelpredictionsfacilitatedbyMatSwarm.“Joint”denotestheresultsofjointtrainingwhereallrawdataaresharedacrossorganizations.Dataarepresentedasmeanvalueswith
thestandarddeviation(mean±standarddeviation).SourcedataareprovidedasaSourceDatafile.
|     |     |     | Adaptability: |          | MatSwarm       | is  | a secure collaborative |               | computing | fra-   |
| --- | --- | --- | ------------- | -------- | -------------- | --- | ---------------------- | ------------- | --------- | ------ |
|     |     |     | mework        | designed | for non-public |     | data across            | organizations |           | on the |
specifically
|     |     |     | NMDMS, |     | addressing |     | key regression |     | challenges | in the |
| --- | --- | --- | ------ | --- | ---------- | --- | -------------- | --- | ---------- | ------ |
materialssciencedomain.Inthispaper,wedemonstratethecapabilities
oftheMatSwarmframeworkbyusingittopredictperovskiteformation
|     |     |     | energies, | selecting | a perovskite |     | dataset as | our example |     | case. To be |
| --- | --- | --- | --------- | --------- | ------------ | --- | ---------- | ----------- | --- | ----------- |
noted,ourframeworkissuitableforgeneralregressiontaskswithinthe
materialssciencedomain,suchaspredictingtheelasticpropertiesof
|     |     |     | silicon     | materials | and | optimizing | the          | microstructure |     | of high-   |
| --- | --- | --- | ----------- | --------- | --- | ---------- | ------------ | -------------- | --- | ---------- |
|     |     |     | performance | alloys.   | For | each       | shared task, | participants   |     | can choose |
relevantdatasetsfromtheirorganizationbasedonthetask’srequire-
specific
|     |     |     | ments. This | ensures | that | the framework |     | is not restricted |     | to  |
| --- | --- | --- | ----------- | ------- | ---- | ------------- | --- | ----------------- | --- | --- |
datasetsduringimplementation;instead,itdynamicallyadaptstoselect
appropriatelocaldatasetsaccordingtothespecificneedsofeachtask.
Moreover,althoughMatSwarmisspecificallydesignedforcolla-
borativecomputinginthematerialssciencedomain,itsdesignprin-
|     |     |     | ciples can | be leveraged |                 | by other | domains       | with | similar   | needs to |
| --- | --- | --- | ---------- | ------------ | --------------- | -------- | ------------- | ---- | --------- | -------- |
|     |     |     | construct  | their        | own swarm-based |          | collaborative |      | computing | frame-   |
works.Forotherdomainswithsimilarapplicationrequirements,the
frameworkcanbeadaptedbymodifyingtheobjectivefunctionand
Fig.4|PerformancecomparisonofMatSwarmbetweentrustedexecution
selectingsuitablelocalmodelsandaggregationmethodstofitspecific
environment(TEE)andnon-TEEconditions.Thefigurepresentsacomparisonof
needs.Additionally,inSection6oftheSupplementaryMaterials,we
theMeanSquaredError(MSE)andresponsetimesforvariousframeworksunder
provideadetailedguideonhowtoextendandapplytheMatSwarm
TEEandnon-TEEsettingsacross10experimentalruns.Thetrainingdatasetconsists
frameworktootherdomains.
of3694samples,evenlydistributedamongtheorganizations,withatestsetof
322samples.TheevaluatedframeworksincludeSolo-Org1,Solo-Org2,Solo-Org3,
LimitationsoftheMatSwarmframework
MatSwarm,andJoint.Solo-Org1,Solo-Org2,andSolo-Org3representindependent
trainingapproacheswhereeachorganizationtrainsitsmodelusingonlylocaldata. Implementationcomplexity:whileincorporatingTEEsenhancessecur-
TheJointframeworkinvolvescentralizedtrainingwherealldatasetsarecombined ityandprivacy,italsoincreasesthecomplexityofsystemsetupand
intoasinglemodel.SourcedataareprovidedasaSourceDatafile. operations,necessitatingrobustinfrastructureandspecializedexper-
|     |     |     | tise. To mitigate |               | this, we | provide | detailed          | platform | deployment | and   |
| --- | --- | --- | ----------------- | ------------- | -------- | ------- | ----------------- | -------- | ---------- | ----- |
|     |     |     | configuration     | documentation |          | in      | the supplementary |          | materials, | which |
Scalability:MatSwarmhasbeenrigorouslytestedacrossmultiple
stakeholderscanusetodeploynewtrainingtasksonthisplatform.
dimensions, including varying dataset sizes, feature quantities, and Potentiallatencyissues: the decentralized nature ofblockchain
participantcounts.Theresultsshowthatthemodelmaintainshighand andremoteattestationbasedonTEEscanintroducedelaysinmodel
stable predictive accuracy, demonstrating excellent scalability and trainingandaggregation.However,inthefieldofmaterialsscience,
practicalapplicability.Thisconsistentperformance,evenwithsmaller real-time requirements for training are not stringent. The minor
samplesizesandfewerfeatures,underscoresMatSwarm’scapabilityto increaseinlatencyisnegligiblecomparedtothebenefitsofresolving
adapt to a broad range of scenarios. Such robustness enhances its theissueofdatasilosinmaterialdata.
potential for widespread adoption in collaborative settings that Hardwaredependency:dependenceonTEEs,suchasIntelSGX,to
requirehandlingcomplex,heterogeneousdatalandscapes.Addition- protect data during computation may limit the applicability of our
ally,theMatSwarmplatformutilizesamodulararchitecture,allowing frameworkin environments without suchhardware support. Never-
participants to select appropriate local models and aggregation theless,ourdemonstrationsystemofferstheoptiontochoosewhe-
methodsbasedontheirtrainingtasks.Astaskdemandsincrease,we thertouseTEEstosecuretheconfidentialityofthemodelaggregation
willcontinuouslyiterateandupdatetheplatform’slocalmodelsand process.EvenwithoutTEEprotection,datasecurityduringtransmis-
aggregation methods. This approach aims to address various chal- sionisensuredthroughdataencryptionandsecurecommunication
lenges in the material science domain, including performance pre- channels.Inthefuture,weplantoofferadditionalprivacyprotection
diction,materialclassification,andstructuraloptimization,ultimately
technologies,suchashomomorphicencryptionanddifferentialpriv-
creatingaversatilecollaborativecomputingplatform. acy,tosupportabroaderrangeofapplicationscenarios.
7
| NatureCommunications|(        2024)1  | 5:9290  |     |     |     |     |     |     |     |     |     |
| ------------------------------------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

| Article |     |     |     | https://doi.org/10.1038/s41467-024-53431-x |     |     |     |     |
| ------- | --- | --- | --- | ------------------------------------------ | --- | --- | --- | --- |
Fig.5|ScalabilitytestingofMatSwarm.Theboxplotsdepictthevariabilityin indicatingimprovedmodelperformance.bItexaminestheeffectoffeature
MeanSquaredError(MSE)across10experimentalruns,whiletheresponsetime(in selectiononMSEandresponsetime,withatotalof147features;thexaxisshows
seconds)isrepresentedbytheorangelinewitherrorbars.aItillustratestheimpact thepercentageoffeaturesused,from30%to100%.cItexploreshowthenumberof
ofdatasetsizeonMSEandresponsetime.Thetotaltrainingdatasetconsistsof participantsinfluencesMSEandresponsetime,with3694trainingsamplesevenly
3694samples,evenlydistributedamongtheorganizations,withatestsetof distributedamongparticipants,rangingfrom3to15,andatestsetof322samples.
322samples.Thexaxisrepresentsdifferentpercentagesofthedataset,ranging SourcedataareprovidedintheSourceDatafile.
from10%to100%.Asthedatasetsizeincreases,MSE(eV/atom)decreases,
Methods environmentfortheparticipatingorganizationsandstoreaggregated
OverallarchitectureofMatSwarm
models.Additionally,thetrustedexecutionenvironmentensuresthe
MatSwarm,
In this section, we present our proposed framework, secureaggregationoflocalmodelparametersandcollaborateswith
designed for the secure sharing of material big data using swarm theblockchaintogeneratetheswarmglobalmodel.
transferlearningcombinedwithTEEs.Table2summarizesthecritical 1. Organizations:withintheMatSwarmframework,organizationO
i
symbolsusedinourframework.TheorganizationsillustratedinFig.6 (1≤i≤N) collaboratively trains models to meet shared material
represent examples of entities involved in materials science. It is performancepredictionrequirements.Initially,eachorganization
noteworthythatourMatSwarmframeworkisprimarilyusedtoaddress conducts material features sampling locally, and the collected
challengesincollaborativecomputingwithinthedomainofmaterials samples are stored as local datasets on their respective cloud
science,asevidencedbyitsapplicationtoaregressionproblem,such servers. Subsequently, organizations choose an appropriate
aspredictingmaterialpropertieslikeperovskiteformationenergies,as machine learning method to train a local model. To ensure
discussed in this paper. Nevertheless, the framework possesses the securityduringmodeltraining,eachorganizationdeploysatleast
potentialforextensionandapplicationinotherfieldsfacinganalogous oneblockchainnodeonanIntelSGX-enabledcloudserver,and
collaborativecomputingchallenges.Furtherelaborationonthisaspect the local model training is performed in SGX’s application
canbefoundinSupplementaryNote5. enclave. This setup establishes encrypted and authenticated
TheMatSwarmframeworkenablescollaborativecomputingtasks channels, allowing sensitive data to be securely transferred
MatSwarm
between material organizations. As depicted in Fig. 6, betweenthecloudserverandtheIntelSGXEnclave.
BlockchainNetwork:MatSwarmleveragesthedecentralizednat-
| involvesmultipleorganizations(denotedasN)collaboratingtoexe- |     | 2.  |     |     |     |     |     |     |
| ------------------------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
cutesharedtasks.Eachorganizationisresponsiblefortrainingitsown ure ofblockchainto create a collaborative computing environ-
localmodels.Theblockchainnodesprovideadistributedcomputing ment. Each organization joins the blockchain network at local
blockchainnodes.WithintheMatSwarmframework,threetrans-
|     |     | action types | aredefined: | retrieval,sharing, |     |     | and uploading. | The |
| --- | --- | ------------ | ----------- | ------------------ | --- | --- | -------------- | --- |
Table2|Notations retrieval transaction verifies the existence of relevant sharing
globalmodelsontheblockchainbeforeinitiatinganewsharing
| Symbol | Definition |     |     |     |     |     |     |     |
| ------ | ---------- | --- | --- | --- | --- | --- | --- | --- |
task.Thesharingtransactionsinvolveorganizationsinitiatingnew
| O   | Organization |     |     |     |     |     |     |     |
| --- | ------------ | --- | --- | --- | --- | --- | --- | --- |
tasks,suchasmaterialperformanceprediction,withtheoption
BN Blockchainnode forotherorganizationstoparticipate.Theuploadingtransactions
TEE Trustedexecutionenvironment store the final global model on the blockchain, ensuring its
AE Applicationenclave integrity and preventing tampering, thus facilitating model
retrievalandusagebyotherorganizations.
| QE  | Quotingenclave |     |     |     |     |     |     |     |
| --- | -------------- | --- | --- | --- | --- | --- | --- | --- |
DL Localdataset 3. TrustedExecutionEnvironment:theTEE,implementedviaIntel
SGX,ensurestheconfidentialityandintegrityoflocalandglobal
| Kr  | Symmetricencryptionkey |     |     |     |     |     |     |     |
| --- | ---------------------- | --- | --- | --- | --- | --- | --- | --- |
models.EachorganizationappliesfortwoApplicationEnclaves
| Er(.,Kr) | Symmetricencryptionalgorithm |                                                          |           |         |         |         |           |       |
| -------- | ---------------------------- | -------------------------------------------------------- | --------- | ------- | ------- | ------- | --------- | ----- |
|          |                              | (denoted                                                 | as AE) in | SGX. AE | is used | to load | encrypted | local |
| M        | Theparametersetoflocalmodel  |                                                          |           |         | 1       |         |           |       |
| L        |                              | datasetsandexecutelocalmodels,ensuringconfidentialityand |           |         |         |         |           |       |
M G Theparameterofglobalmodel integrity during execution. AE is used to aggregate global
2
(PK ,PR ) Public-privatekeypairsgeneratedbyIntelauthen- models. This approach ensures the integrity of model aggre-
IAS IAS
ticationservices
gation,withallorganizationsautomaticallyexecutingthesame
| QG  | Quotationforglobalmodel |                                                 |     |     |     |     |     |          |
| --- | ----------------------- | ----------------------------------------------- | --- | --- | --- | --- | --- | -------- |
|     |                         | modelaggregationcodethroughsmartcontracts41inAE |     |     |     |     |     | 2 .Smart |
R REPORTstructureinformation contracts automate the enforcement and management of
M Enclaveidentityinformation agreed-upon processes and conditions, ensuring consistent
|                         |                                               | execution,  | eliminating | discrepancies, |                | enhancing       | security,            | and    |
| ----------------------- | --------------------------------------------- | ----------- | ----------- | -------------- | -------------- | --------------- | -------------------- | ------ |
| MAC                     | Messageauthenticationcode                     |             |             |                |                |                 |                      |        |
|                         |                                               | reducing    | reliance    | on third-party |                | intermediaries. | Additionally,        |        |
| (AKp,AKr)               | (public,private)keypairsforauthenticationkeys |             |             |                |                |                 |                      |        |
|                         |                                               | the Quoting | Enclave     | (denoted       |                | as QE)          | generate attestation |        |
| Sign(.,AKr)             | signaturealgorithm                            |             |             |                |                |                 |                      |        |
|                         |                                               | REPORT      | R to assist | in remote      | authentication |                 | between              | AEs in |
| verify(Sign(.,AKr),AKp) | Validationfunction                            |             |             |                |                |                 |                      |        |
variousorganizations.
| ½(cid:3)(cid:4) | Authenticatedpublickeyencryption |     |     |     |     |     |     |     |
| --------------- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- |
PKIAS
8
| NatureCommunications|(        2024)1  | 5:9290  |     |     |     |     |     |     |     |
| ------------------------------------- | ------- | --- | --- | --- | --- | --- | --- | --- |

| Article |     |     |     |     |     |     |     | https://doi.org/10.1038/s41467-024-53431-x |     |     |
| ------- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------ | --- | --- |
Fig.6|TheoverallarchitectureofMatSwarmframework.TheMatSwarm localdatasetsinadatabase,withapplicationsmanagingdataprocessingandmodel
frameworkfacilitatescollaborativematerialperformancepredictionacrossmulti- execution.Localmodelsaretrainedwithinthetrustedexecutionenvironment
pleorganizationsbyensuringsecurelocalmodeltrainingandglobalmodel (TEE)inApplicationEnclave1throughsmartcontracts,whichautomateandsecure
aggregation.Thebluedashedlinesinthefigurerepresentmessagespassing theexecutionprocess.Theblockchainnetworkunderpinsdecentralizedcomput-
betweenblockchainnodes(BN).Thebluesolidlinesrepresentmessagespassing ing,securelystoringandsharingtheaggregatedglobalmodels.Globalmodel
betweencomponentswithintheorganization’scloudserver.Theblacksolidlines
aggregationisperformedinApplicationEnclave2,ensuringdataintegrityand
confidentiality.ThequotingenclavewithintheTEEgeneratesattestationreportsto
representmessagespassingbetweenthelocalcloudserverofeachorganization
anditslocalblockchainnode.Eachorganizationutilizesitscloudservertostore supportremoteauthenticationbetweenenclavesacrossorganizations.
Problemformulation The training objective is typically formulated as the following
| WeconsideraMatSwarmframeworkconstructedbyN(N>2)orga- |     |                                  |     |          |            | algorithm: |     |     |     |     |
| ---------------------------------------------------- | --- | -------------------------------- | --- | -------- | ---------- | ---------- | --- | --- | --- | --- |
| nizations, whereK(K≤N)organizationsarein             |     |                                  |     | asharing | task, each |            |     |     |     |     |
| possessingalocaldatasetDL                            |     | ,∀i∈K.Eachorganizationmaintainsa |     |          |            |            |     |     |     |     |
|                                                      |     | i                                |     |          |            |            |     |     | XK  |     |
l o c a l m o d el f : X ! y w i t h p a r a m e te r s θ , w h er e X a n d y m i n fðX ,y Þ= L ðX ,y Þ+γL ðX Þ
θ i p r ei i i p re θ i,i+1modK imodK 1 imodK imodK 2 i,i+1modK
d e n o t e th e in p u i t an do u t p u t s p ac e s , r e sp e c ti v e ly . In o u r s tu d y, w e i i, i+1 m odK i=1 ð1Þ
|             |                   |     |          |                   |          |     |     |     | λ(cid:2)        | (cid:3) |
| ----------- | ----------------- | --- | -------- | ----------------- | -------- | --- | --- | --- | --------------- | ------- |
|             |                   |     |          |                   | specifi- |     |     |     | kθ k2+ kθ       | k2      |
| assume that | all organizations |     | have the | same input/output |          |     |     |     | +               |         |
|             |                   |     |          |                   |          |     |     |     | 2 imodK i+1modK |         |
cationsandhomogeneouslocalmodelarchitectures.However,they
maychoosedifferentlocalmodelsandaggregationmethodsbased
onthesharingtask.Theobjectiveistocollaborativelytrainthelocal
|     |     |     |     |     |     |     | LðX | ,y  | Þ=ðy (cid:2)φðX | ÞÞ2 ð2Þ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------- | ------- |
models to ensure that each generalizes wellon the joint data dis- 1 imodK imodK imodK imodK
| tribution, thereby |     | improving | prediction | accuracy | for non-i.d.d. |     |     |     |     |     |
| ------------------ | --- | --------- | ---------- | -------- | -------------- | --- | --- | --- | --- | --- |
materialdata.
|     |     |     |     |     |     |     |     | (cid:4)      |              | (cid:4)          |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ------------ | ---------------- |
|     |     |     |     |     |     | L   | ðX  | Þ= (cid:4) u | ðX Þ(cid:2)u | ðX Þ(cid:4)2 ð3Þ |
Toachievethisobjective,weproposeaswarmtransferlearning 2 i,i+1modK imodK imodK i+1modK i+1modK F
methodwithintheMatSwarmframework.Thecoreofourmethodisto
identify invariances between resource-rich source domains and The loss function in Equation (1) is formulated to optimize
resource-scarcetargetdomains,facilitatingthelearningofcommon theparametersθ.Itaimstominimizetheoveralllossbyintegrating
representation spaces and enabling knowledge transfer across multiplecomponents,includingL,L ,andregularizationterms.
1 2
domains.Theobjectivefunctionrevealsthatduringtheswarmtransfer L:Thistermrepresentsthefirstcomponentofthelossfunc-
1
learningprocessbetweenorganizationO andorganizationO ,local tion,capturingthediscrepancybetweenthepredictedoutputsand
|     |     |     |     | i   | i+1 |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
thetruelabels.Specifically,y
model training is interdependent, necessitating the exchange of imodK denotesthelabeloforganization
O.Theformoftheobjectivefunctionφdependsonthenatureof
| intermediatetrainingresults.Thetrainingprocessadherestoalinear |     |     |     |     |     | i   |     |     |     |     |
| -------------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
cyclemethod,withsequentialtrainingconductedbetweenorganiza- thesharingtask,suchasclassificationorregression,andthechosen
| tions in the | order [O→O | →. . | .→O →O]. | The completion | of training | localmodel. |     |     |     |     |
| ------------ | ---------- | ---- | -------- | -------------- | ----------- | ----------- | --- | --- | --- | --- |
|              |            | 1 2  | K 1      |                |             |             |     |     |     |     |
betweenorganizationsO andO signifiestheendofalocaltraining L :ThetermL typicallycorrespondstoaregularizationtech-
|     |     | K   | 1   |     |     | 2   |     | 2   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
round.Aftereachroundoflocalmodelparameterupdates,thepara- nique,suchasL2regularization,whichhelpspreventoverfittingand
metersareaggregated,andtheupdatedglobalmodelparametersare promotesmodelgeneralization,whereudenotestherepresentation
convertedfromtheoriginaldata,andk(cid:3)k2
sent back to each organization for the next round of local model F referstothesquareofthe
updates.Thisiterativeprocesscontinuesuntilthemodelconvergesto Frobeniusnorm.Itpenalizeslargeparametervaluestocreateamore
| aspecifiedthreshold. |     |     |     |     |     | balancedandrobustmodel. |     |     |     |     |
| -------------------- | --- | --- | --- | --- | --- | ----------------------- | --- | --- | --- | --- |
9
| NatureCommunications|(        2024)1  |     |     | 5:9290  |     |     |     |     |     |     |     |
| ------------------------------------- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |

| Article |     |     |     |     |     | https://doi.org/10.1038/s41467-024-53431-x |     |     |     |
| ------- | --- | --- | --- | --- | --- | ------------------------------------------ | --- | --- | --- |
| γ:      | γ   |     |     | L   |     |                                            |     |     |     |
This parameter represents the weight assigned to the attestation,encryptedlocalmodelsaresharedamongorganizationsto
2
componentintheoveralllossfunction.Adjustingγcontrolsthetrade- generatetheglobalmodel.
offbetweenfittingthetrainingdataandapplyingregularization. To ensure the integrity and confidentiality of the aggregation
λ: The parameter λ determines the weight assigned to the reg- process,eachorganization’sblockchainnodeperformsmodelaggre-
ularization terms that penalize the magnitude of the parameters gation in its AE . The steps involved are as follows: the task issuer
2
| θ   | θ   |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
imodK and i+1modK . It controls the strength of the regularization, deploystheaggregationalgorithmontothesmartcontractSC2run-
helpingmanagethemodel’scomplexity.
|     |     |     |     | ningintheAE | 2 .OtherparticipantsinvokeSC2fromtheblockchain, |     |     |     |     |
| --- | --- | --- | --- | ----------- | ----------------------------------------------- | --- | --- | --- | --- |
Basedon the aboveillustration,Equation(1)represents acom- subsequentlyloadingthesmartcontractandencryptedlocalmodel
bined loss function designed to optimize the parameters θ. This setssubmittedbyothersintotheirrespectiveAE .Eachparticipant’s
2
functionintegratesthetask-specificlossL,aregularizationtermL , AE independentlyaggregatesthemodelstogenerateaglobalmodel.
|     |     | 1   |     | 2 2 |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
andaregularizationofparametermagnitudes.Thecomponentsare Toensurethecredibilityofeachorganization’sAE andtheintegrityof
2
weighted by γ and λ to achieve a balance between data fitting and theglobalmodel,theblockchainnetworkmustreceiveallattestation
organization’s
modelcomplexitycontrol. reports generated by each AE 2 . Consequently, the
Toensuretheconfidentialityandintegrityofthelocalmodeland
blockchainnodescompleteremoteattestationthroughaconsensus
MatSwarm
| global model | generation, | incorporates | TEE utilizing | Intel mechanism. |     |     |     |     |     |
| ------------ | ----------- | ------------ | ------------- | ---------------- | --- | --- | --- | --- | --- |
SGX.Eachorganization’scloudserverisenabledwithIntelSGXand 3) Task Archive: during each round of training, organizations
includes M(M≥N) blockchain nodes withinthe blockchain network. obtainthecurrentglobalmodelanduseittoupdatetheirlocalmodel
Eachorganizationcandeploymultipleblockchainnodes.Tofacilitate until the loss function converges to a specific threshold. However,
understanding, we assume that each organization has deployed a beforeacredibleglobalmodelisultimatelygenerated,aconsensus
(i≤M).Theblockchainnode
singleblockchainnode,denotedasBN i mustbereachedamongparticipants.Onceaconsensusisachieved,
BN i mustbedeployedonanIntelSGX-enabledcloudserver.Totrain theglobalmodelisstoredontheblockchaintopreventtampering.
final
localandglobalmodels,each organizationrequeststhecreationof Therefore, participants must ensure that the global model is
twoAEs.AE isusedtoloadencryptedlocaldatasetsandsmartcon- recognizedbyallparticipantsthroughaconsensusmechanism.The
1
tractSC1fortraininglocalmodels.AE isusedtoloadencryptedlocal modelisthensecurelystoredforfutureretrievalanduse.
2
modelparametersandsmartcontractSC2foraggregatinglocalmodel
parameters. Local model generation. The initial step in local model training
involvesloadingtheencryptedlocaldataset.Toensuresecurity,Intel
SGX’sAEonlyacceptsencrypteddata.Therefore,beforesendingthe
Workingmechanisms
MatSwarm
The overall working mechanism of includes three main localdatasetDL i tothelocalAE,theblockchainnodeBN 1 i mustencrypt
stages:tasksubmission,taskexecution,andtaskarchive.Videosonthe itusingasymmetricencryptionalgorithmsuchasadvancedencryption
proceduresandoperationsofMatSwarmareavailableasSupplemen- standard(AES)42orTripleDataEncryptionStandard43,representedas
taryMovies2and3. Er(.,Kr).SymmetricencryptionanddecryptionbetweenBN anditsAE
|     |     |     |     |     |     |     |     |     | i 1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
1) Task Submission: assume that all material organizations areperformedusingthekeyKr.ThisprocessisdenotedasEr(.,Kr).
|     |     |     |     |     |     |     | i   |     | i   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
willingtoconductjointmodeltraininghaveregisteredandstored ThekeyEr(.,Kr)istransmittedthroughasecurechannelestablishedby
theDiffie-Hellmankeyexchangeprotocol44,whichallowstwopartiesto
| theirmetadataontheblockchain.OrganizationO,asthetaskissuer |     | 1   |     |     |     |     |     |     |     |
| ---------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
amongparticipants,initiatesaretrievaltransactionrequesttothe establishasharedsecretoveranunsecuredcommunicationchannel,
local blockchain node with a task information digest. The local providing a foundation for encrypting further communications. BN
i
blockchain node retrieves the blockchain history to determine generatesanencryptedlocaldatasetEr(DL,Kr)andsendsittoAE.
|     |     |     |     |     |     |     | i   | i   | 1   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
whetheranarchivedtaskrelatedtothetaskinformationdigesthas Upon receipt, AE uses the key Kr to decrypt Er(DL, Kr)(1≤i≤M),
|     |     |     |     |     | 1   |     | i   | i   | i   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
been generated. If such a task exists, the corresponding retrieval obtaining the plaintext DL of the local dataset. This process can be
i
resultisreturned.IforganizationO doesnotobtainretrievalresults represented as BN∣Er(DL, Kr) → AE∣Dr(Er(DL, Kr), Kr). The second
|     |     | 1   |     |     |     | i i i | 1   | i i | i   |
| --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- |
forthearchivedtask,itwillretrievethemetadataoforganizations step involves local model training. Organizations deploy the local
identifies
from the blockchain. Once the task issuer the organiza- modelusingthesmartcontractSC1totraintheirlocaldatasetsinAE. 1
tionstobeinvited,itwilldesignthesharingtaskscheme,including Forlocalmodeltraining,participantsonourplatformcanselect
thetaskdescription,metadatadescription,andtheselectionoflocal theappropriatemachinelearningmodelbasedontheirtaskrequire-
models and aggregation methods. The task issuer subsequently ments,includingMLP45,Lasso46,RNN47,andLSTM48.Astheplatform
initiatesasharingtransactionrequesttoorganizationswithrelevant evolves,itwillofferabroaderrangeoflocaltrainingmodelstomeet
datasets to join the sharing task as participants. The blockchain diverse task requirements. In this paper, we demonstrate the local
nodes of participating organizations become active nodes, while model training process using an example of predicting perovskite
thoseofnon-participatingorganizationsremainpassive.Theactive formationenergy,employingtheMLPneuralnetworkforlocalmodel
nodes participate in the global model consensus mechanism for trainingandthestochasticgradientdescentalgorithmforparameter
| thetask. |     |     |     | updating. |     |     |     |     |     |
| -------- | --- | --- | --- | --------- | --- | --- | --- | --- | --- |
2)TaskExecution:tofacilitatemodelaggregation,itisessentialto AsshowninFig.7,considerthetrainingbetweenorganizationO
1
standardize the structure and format of the input datasets among andorganizationO asanexample.OrganizationO calculatesinter-
|     |     |     |     |     |     | 2   |     | 2   |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
participants. The task issuer should create a virtual dataset and mediateresultsandencryptsthemwiththepublickeyPK fromIntel
IAS
broadcastittotheblockchainnetwork,enablingeachparticipantto Authentication Service (IAS). The encrypted intermediate results
|     |     |     |     | ½ut(cid:4) | and½θt(cid:4) |     |     |     |     |
| --- | --- | --- | --- | ---------- | ------------- | --- | --- | --- | --- |
aligntheirlocaldatasetswiththestandardizedformat.Subsequently, aresenttoorganizationO.TheorganizationO 1 1
|     |     |     |     | 2PKIAS | 2PKIAS |     |     |     |     |
| --- | --- | --- | --- | ------ | ------ | --- | --- | --- | --- |
participants can use their standardized datasets to train their local decryptstheintermediateresultsusingtheprivatekeyPR andcal-
|     |     |     |     |     |     |     | ∂Lt |     | IAS |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
models.Thetaskissuertrainsalocalmodelanddeploysthecodeinto culatesthelocalmodelgradient 1 andlossfunctionLt.Similarly,
|     |     |     |     |     |     |     | ∂θt |     | 1   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
SmartContract1(SC1)runninginitsAE.Otherparticipantscaninvoke organizationO calculatesasetofin1termediateresults,encryptsthem
|     |     | 1   |     |     | 1   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
SC1viatheblockchaintotraintheirlocalmodelsinasimilarmanner, with the public key PK , and sends the encrypted intermediate
IAS
ensuringuniformityinthelocalmodeltrainingcode.Aftereachround results ½θt(cid:4) and ½ut(cid:4) aresent to organization O , whichthen
|     |     |     |     |     | 1 P K | 1 P K |       |     | 2   |
| --- | --- | --- | --- | --- | ----- | ----- | ----- | --- | --- |
|     |     |     |     |     | IAS   | IA S  | ∂ L t |     | Lt  |
oflocalmodeltraining,remoteattestationisrequiredbetweentheAE 1 calculates t h e local m o d e l gradient θt 2 and loss funct ion 2 . Both
|     |     |     |     | organizationsupdatetheirlocalmodelp2arametersθt+1andθt+1using |     |     | ∂   |     |     |
| --- | --- | --- | --- | ------------------------------------------------------------- | --- | --- | --- | --- | --- |
ofeachparticipanttoverifythecredibilityoftheremotenodesandthe
1 2
integrity and confidentiality of the local model. Following remote the calculated local model gradients. After each organization
10
| NatureCommunications|(        2024)1  |     | 5:9290  |     |     |     |     |     |     |     |
| ------------------------------------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |

| Article |     |     |     |     | https://doi.org/10.1038/s41467-024-53431-x |     |     |
| ------- | --- | --- | --- | --- | ------------------------------------------ | --- | --- |
Fig.7|Theflowchartoflocalmodelgeneration.Thebluedashedlinesrepresent
intermediateresultsarecalculated.Theseencryptedresults,usingapublickey
messagespassingbetweenblockchainnodes.Thebluesolidlinesrepresentmes- (PKIAS)issuedbyIntelAttestationService,arethensecurelyexchangedbetween
sagepassingwithinthetrustedexecutionenvironments(TEEs)oflocalorganiza- organizationsthroughtheblockchainnetwork.Afterexchangingintermediates,
tions.Theblacksolidlinesrepresentmessagepassingbetweentrustedexecution (AE1)decryptsthereceiveddataandcalculatesthelocalmodelgradientandthe
lossfunction.Thelocalmodelparametersθt+1aresubsequentlyupdated.Before
environmentsacrossorganizations.Initially,thelocalblockchainnode(BN)
invokesthesmartcontract(SC1)generatedbythelocalmodel,andthenboththe exchangingmodelparameters,theQuotingEnclavewithintheTEE,alongwiththe
smartcontractandtheencryptedlocaldataset(DL),usingasymmetrickey(Kr) IntelAttestationService(IAS),performsremoteattestationtoverifytheintegrity
establishedviatheDiffie-Hellmanprotocol,areloadedintotheTrustedExecution andsecurityoftheTEEsinallparticipatingorganizations.
Environment(TEE).InApplicationEnclave1(AE1),thedatasetisdecrypted,and
2)Modelaggregation:theglobalmodelparametersMt+1
completesthisroundoflocalmodeltraining,theblockchainnodesof calcu-
G
eachorganization perform remote certification of all AE through a latedineachparticipant’sAE aregivenby:
|     |     |     | 1   |     |     | 2   |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
consensusmechanism.Subsequently,organizationsencryptandshare
theupdatedlocalmodelparametersθt +1 withotherparticipantsto XK jDL j XK
|                                                  |     | i   |     |     | Mt+1= | i Mt jDLj | ð4Þ |
| ------------------------------------------------ | --- | --- | --- | --- | ----- | --------- | --- |
| aggregatelocalmodelparametersforthecurrentround. |     |     |     |     |       | ,n= i     |     |
|                                                  |     |     |     |     | G     | n Li      |     |
i=1 i=1
whereMt+1representstheglobalmodelupdatedinthet+1round,K
| Globalmodelgeneration.Thissectionwillelaborateongenerating |     |     |     |     | G   |     |     |
| ---------------------------------------------------------- | --- | --- | --- | --- | --- | --- | --- |
∣DL∣
global models, covering crucial aspects such as smart contract denotes the number ofparticipants, i represents the number of
deployment, model aggregation, remote attestation, and consensus samplesusedbythei-thparticipanttotrainthelocalmodel,andnis
mechanisms. Figure 8 illustrates the process of global model thetotalnumberofsamplesusedtotrainalllocalmodels.Mt isthe
Li
generation. local model parameters set updated by the i-th participant in the t
| 1) Smart contract | deployment: | the task issuer | O deploys the | rounds. |     |     |     |
| ----------------- | ----------- | --------------- | ------------- | ------- | --- | --- | --- |
1
model aggregation algorithm to the blockchain via the local block- Notably, parameter aggregation is illustrated using the Mean
|     |     |     |     | method35 | MatSwarm, |     |     |
| --- | --- | --- | --- | -------- | --------- | --- | --- |
chainnodeBN 1 asasmartcontract.Eachparticipantcanretrieveand in which is the most widely used approach.
invokethesmartcontractfromtheblockchain.Theblockchainnode However, various aggregation methods are available, such as
BN loadsthesmartcontractandencryptedlocalmodelparameterset MultiKrum49, CenteredClipping50, GeoMed51, and Median52, among
i
½½Mt(cid:4)(cid:4) intoAE ofTEE.Theparametersarethendecryptedusing others. On our platform, participants can choose different model
| L PKIAS                    | 2 i                   |                    |               |             |               |                      |             |
| -------------------------- | --------------------- | ------------------ | ------------- | ----------- | ------------- | -------------------- | ----------- |
|                            |                       |                    |               | aggregation | methods based | on task requirements | and robust- |
| PR IAS(cid:5) to construct | (cid:6) the plaintext | of the local model | parameter set |             |               |                      |             |
nessneeds.
Mt= θt,θt,(cid:3)(cid:3)(cid:3),θt
L 1 2 K . The calculation of global model parameters 3) Remote attestation: during the global model generation
| occursinAE | ofTEE toensuretheconfidentialityofsensitivepara- |     |     |     |     |     |     |
| ---------- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- |
2 i process, remote attestation is used to verify the integrity of the
meters. Smart contracts facilitate the transfer of global model global model generated by AE 2 . In this method, the blockchain
parameters. node BN facilitates interaction between the AE of TEE and
|     |     |     |     |     | i   |     | 2 i |
| --- | --- | --- | --- | --- | --- | --- | --- |
11
| NatureCommunications|(        2024)1  |     | 5:9290  |     |     |     |     |     |
| ------------------------------------- | --- | ------- | --- | --- | --- | --- | --- |

| Article |     |     |     |     |     |     |     |     | https://doi.org/10.1038/s41467-024-53431-x |     |     |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------------------------------ | --- | --- |
Fig.8|Theflowdiagramofthelocalmodelparametersaggregationprocess.
theTrustedExecutionEnvironment(TEE),remoteattestationisperformedtoverify
Initially,thetaskissuer’sblockchainnode(BN1)deploysthemodelaggregation
theintegrityoftheglobalmodelcomputation.Theglobalmodelisthencomputed
algorithmasasmartcontract(SC2),andotherblockchainnodesinvokeit.All withinAE2,andtheresultingglobalmodelparametersaresenttotheQuoting
participants'blockchainnodesextracttheencryptedlocalmodelparameters. EnclaveforgeneratingQuotes(QG).TheseQuotesareusedintheconsensus
processtofinalizeandstoretheglobalmodelontheblockchain.
BeforesendingSC2andlocalmodelparametersintoApplicationEnclave2(AE2)of
theblockchainnetwork,servingasbothanaggregatorandverifierin hasbeenagreeduponbyall.Ifconsensusisachieved,theybroadcast
the attestation process. TEE generates a REPORT structure infor- confirmationmessagestotheotherparticipants.
i
mation R containing the current enclave identity information M, Replystage:theconsensusrequestisconsideredcompletewhen
|     | i   |     |     |     |     |     |     | i   |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
andothermetadatathroughtheEREPORTfunction,andsignsR to each participant receives confirmation messages from at least two-
i
produceaMessageAuthenticationCode(MAC)tagMAC.AE i 2 sends thirdsofthenodes.AReplymessageisthenconstructedandsentto
confirmation
R i andMACtagstotheQuotingEnclaveinTEE i formutualattesta- O. 1 Once O 1 receives messages from more than two-
itfinalizes
tion.TheQuotingEnclavecallstheEGETKEYcommandtodecrypt thirds of the nodes, the globalmodeland broadcasts its
the MAC and verifies the decrypted information against R. After hashtoallactiveandpassivenodesforstorage.
|     | i   |     |     |     |     |     | i   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
successfulmutualattestationwithinTEE,theQuotingEnclaveuses Theprocessesoflocalandglobalmodelgenerationarerepeated
i
theprivatekey(AKr)oftheattestationkeygeneratedbytheIntel roundandrounduntilthemodelconvergestoathreshold.Intheend,
i
ProvisioningService’sProvisioningSealKey,tosignR andcreatea thefinalglobalmodelisstoredontheblockchain,ensuringtamper
i
resistancewhilefacilitatingefficientretrievalbyothers.
| QuoteQG  | i =Sign(R,AKr).OnlyQuotingEnclavecanaccessthekey | i   | i         |              |     |         |               |     |     |     |     |
| -------- | ------------------------------------------------ | --- | --------- | ------------ | --- | ------- | ------------- | --- | --- | --- | --- |
| used for | attestation                                      | in  | the Intel | Provisioning |     | Service | to verify the |     |     |     |     |
credibility of TEE . The QG is then sent through the blockchain Reportingsummary
|     |     | i   | i   |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
network to the blockchain nodes of other participants for Further information on research design is available in the Nature
verification.
PortfolioReportingSummarylinkedtothisarticle.
| OnceBN | receivesK-1Quotes,itwillverifyeachQuoteusingthe |     |     |     |     |     |     |     |     |     |     |
| ------ | ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
i
| publickeyAKp |     | generatedbytheIntelProvisioningService.Thever- |     |     |     |     |     |                  |     |     |     |
| ------------ | --- | ---------------------------------------------- | --- | --- | --- | --- | --- | ---------------- | --- | --- | --- |
|              | i   |                                                |     |     |     |     |     | Dataavailability |     |     |     |
ificationiscompletedutilizingthefunctionverify(Sign(QG
|     |     |     |     |     |     | i   | ,AKr i ),AKp | i ). All datasets | used are publicly | available | at https://github.com/SICC- |
| --- | --- | --- | --- | --- | --- | --- | ------------ | ----------------- | ----------------- | --------- | --------------------------- |
Once (cid:5)the Quote is validat(cid:6)ed, BN i will e(cid:2)xtract the global m(cid:3)odel Group/MatSwarm.gitandZenodo54.Alldatasupportingthefindings
| Mt +1= Mt | + 1,Mt + | 1,...,Mt | + 1 |     |     | ,...,QG |     |     |     |     |     |
| --------- | -------- | -------- | --- | --- | --- | ------- | --- | --- | --- | --- | --- |
from QG= QG ,QG for described in this manuscript are available in the article and in the
| G   | G 1 G | 2   | G K |     |     | 1 2 | K   |     |     |     |     |
| --- | ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
subsequentconsensus. SupplementaryInformationandfromthecorrespondingauthorupon
| 4) Global |     | Model | Consensus: | at  | this stage, | the | consensus |     |     |     |     |
| --------- | --- | ----- | ---------- | --- | ----------- | --- | --------- | --- | --- | --- | --- |
request.Sourcedataareprovidedwiththispaper.
| mechanism     | is used | to  | determine  | the globalmodel |     | accepted | by the       |     |     |     |     |
| ------------- | ------- | --- | ---------- | --------------- | --- | -------- | ------------ | --- | --- | --- | --- |
| participants. | We      | use | the PBFT53 | consensus,      |     | which    | can tolerate |     |     |     |     |
Codeavailability
fByzantinefaultnodes.Weassumethatthreeorganizationsarepar-
|     |     |     |     |     |     |     |     | The codes | are available in open | source | at https://github.com/SICC- |
| --- | --- | --- | --- | --- | --- | --- | --- | --------- | --------------------- | ------ | --------------------------- |
ticipatinginthesharedtask.TheblockchainnodeBN 1 isablockchain Group/MatSwarm.gitandZenodo54.
| nodeofthetaskissuerO                      |     |     | 1 actingastheprimarynode;BN |     |     |      | 2 andBN 3 are |            |     |     |     |
| ----------------------------------------- | --- | --- | --------------------------- | --- | --- | ---- | ------------- | ---------- | --- | --- | --- |
| blockchainnodesoftheothertwoparticipantsO |     |     |                             |     |     | andO | participating | References |     |     |     |
2 3
| intheconsensusmechanismasactivenodes;BN |     |     |     |     |     | (j∈M)denotesthe |     |     |     |     |     |
| --------------------------------------- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | --- |
j 1. Liu,C.etal.Atransferlearningcnn-lstmnetwork-basedproduction
| blockchain | node | of organizations |     | that | are not | participating | in the |     |     |     |     |
| ---------- | ---- | ---------------- | --- | ---- | ------- | ------------- | ------ | --- | --- | --- | --- |
progresspredictionapproachiniiot-enabledmanufacturing.Int.J.
sharingtask,referredtoaspassivenodes.Theconsensusmechanism
Prod.Res.61,4045–4068(2023).
five
consists of steps: request, pre-prepare, prepare, commit, 2. Chaudry,U.M.,Hamad,K.&Abuhmed,T.Machinelearning-aided
andreply. designofaluminumalloyswithhighperformance.Mater.Today
Request phase: the task issuer O 1 initiates a global model con- Commun.26,897(2021).
sensusrequesttothedeployedblockchainnodeBN . 3. Malik,P.K.etal.Industrialinternetofthingsanditsapplicationsin
1
Pr e - p r e p a r e s ta g e : B N ca l c u lat e s H as h ðM t + 1 ,M t + 1 , .. ., M t + 1 Þ a n d –
1 G 1 G 2 G K in d us t ry 4 . C o m p u t . C o m m u n . 1 6 6 , 12 5 13 9 ( 2 0 2 1 ) .
| broad c a s | t s H a s h | ð M t + 1Þ | t o B N a | n d B N if | th e H a | s h of a ll g | lo b al m o d e | l s |     |     |     |
| ----------- | ----------- | ---------- | --------- | ---------- | -------- | ------------- | --------------- | --- | --- | --- | --- |
G 2 3 4. D a m e w o o d ,J . et a l . R e p re se n t a t io n s o f m a te r ia l s f o rmachine
| isequal. |     | 1   |     |     |     |     |     |     |     |     |     |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
learning.Annu.Rev.Mater.Res.53,399–426(2023).
| P r e p | a r e s t a g | e : a f t e | r r e c e i v | i n g t h e | H a s h ð M | t + 1 Þ s e n t | b y B N , B N | ,   |     |     |     |
| ------- | ------------- | ----------- | ------------- | ----------- | ----------- | --------------- | ------------- | --- | --- | --- | --- |
G 1 2 5 . S t e r g i o u , K . e t a l . E n h a n c i n g p r o p e r t y p r e d i c t i o n a n d p r o c e s s
|     |     |     |     |     |     | 1   | t + 1 ð ≤ ≤ | Þ   |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --- | --- | --- | --- |
a n d B N 3 , c a l c u l a t e t h e H a s h v a l u e o f t h e g l o b a l m o d e l M G 1 i K o p t i m i z a t i o n i n b u il d i n g m a t e r i a l s t h r o u g h m a c h in e l e a r n in g : a
|     |     |     |     |     |     |     | i ð t + | 1 Þ |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | --- |
se n t b y e a c h o r g a n i z a t i o n . I f a ll h a s h v a lu e s a r e e q u a l t o H a s h M , r e v i e w . C o m p u t . M a t e r . S c i. 2 2 0 , 0 3 1 ( 2 0 2 3 ) .
G 1
B N a n d B N b r o a d c a s t H a s h ð M t + 1Þ a n d H a s h ð M t + 1 Þ t o t h e o t h e r t w o 6 . A fl o w - A u t o m a t i c F L O W f o r m a t e r i a l s d i s c o v e r y . h tt p s : / /a fl o w lib.
| 2   | 3   |     |     | G 2 |     | G 3 |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
participants,respectively.
org/(2024).
| Commit | stage: | after | receiving | the | calculation | results | from the |     |     |     |     |
| ------ | ------ | ----- | --------- | --- | ----------- | ------- | -------- | --- | --- | --- | --- |
7. Crystallographyopendatabase.http://www.crystallography.net/
othernodes,allparticipantsverifywhetheraconsistentglobalmodel
cod/(2024).
12
| NatureCommunications|(        2024)1  |     |     |     | 5:9290  |     |     |     |     |     |     |     |
| ------------------------------------- | --- | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |

Article https://doi.org/10.1038/s41467-024-53431-x
8. Materialsdatarepositoryhome.https://materialsdata.nist.gov/. 30. Romano,Y.,Aberdam,A.,Sulam,J.&Elad,M.Adversarialnoise
(2024). attacksofdeeplearningarchitectures:stabilityanalysisviasparse-
9. Morgan,D.&Jacobs,R.Opportunitiesandchallengesformachine modeledsignals.J.Math.ImagingVis.62,313–327(2020).
learninginmaterialsscience.Annu.Rev.Mater.Res.50,71–103 31. Fang,M.,Cao,X.,Jia,J.,Gong,N.,Localmodelpoisoningattacksto
(2020). byzantine-robustfederatedlearning.29thUSENIXsecuritysym-
10. Xu,P.,Ji,X.,Li,M.&Lu,W.Smalldatamachinelearninginmaterials posium(USENIXSecurity20),pp.1605–1622(2020).
science.npjComput.Mater.9,42(2023). 32. Li,L.,Xu,W.,Chen,T.,Giannakis,G.B.&Ling,Q.Rsa:Byzantine-
11. Kim,Y.etal.Deeplearningframeworkformaterialdesignspace robuststochasticaggregationmethodsfordistributedlearning
explorationusingactivetransferlearninganddataaugmentation. fromheterogeneousdatasets.Proc.AAAIConf.Artif.Intell.33,
npjComput.Mater.7,140(2021). 1544–1551(2019).
12. Jain,S.,Seth,G.,Paruthi,A.,Soni,U.&Kumar,G.Syntheticdata 33. Baruch,G.,Baruch,M.,Goldberg,Y.,Alittleisenough:cir-
augmentationforsurfacedefectdetectionandclassificationusing cumventingdefensesfordistributedlearning.Adv.NeuralInf.Pro-
deeplearning.J.Intell.Manuf.33,1007–1020(2022). cess.Syst.,32(2019).
13. Hnewa,M.&Radha,H.Objectdetectionunderrainyconditionsfor 34. Xie,C.,Koyejo,O.,Gupta,I.Fallofempires:breakingbyzantine-
autonomousvehicles:areviewofstate-of-the-artandemerging tolerantSGDbyinnerproductmanipulation.https://arxiv.org/abs/
techniques.IEEESignalProcess.Mag.38,53–67(2020). 1903.03936(2020).
14. Wen,Y.,Tran,D.,Izmailov,P.,Wilson,A.G.Combiningensembles 35. Li,X.,Huang,K.,Yang,W.,Wang,S.,Zhang,Z.Ontheconvergence
anddataaugmentatio.ncanharmyourcalibration.In:International offedavgonnon-iiddata.In:InternationalConferenceonLearning
ConferenceonLearningRepresentationshttps://arxiv.org/abs/ Representations,https://openreview.net/forum?id=HJxNAnVtDS
2010.09875(2021). (2020).
15. Lejeune,E.&Zhao,B.Exploringthepotentialoftransferlearningfor 36. Li,T.etal.Federatedoptimizationinheterogeneousnetworks.Proc.
metamodelsofheterogeneousmaterialdeformation.J.Mech. Mach.Learn.Syst.2,429–450(2020).
Behav.Biomed.Mater.117,104,276(2021). 37. Liu,Y.,Kang,Y.,Xing,C.,Chen,T.&Yang,Q.Securefederated
16. Zhang,C.etal.Asurveyonfederatedlearning.Knowl.BasedSyst. transferlearning.IEEEIntell.Syst.35,70–82(2020).
216,106,775(2021). 38. Kalapaaking,A.P.etal.Blockchain-basedfederatedlearningwith
17. Mothukuri,V.etal.Asurveyonsecurityandprivacyoffederated secureaggregationintrustedexecutionenvironmentforinternet-
learning.FutureGener.Comput.Syst.115,619–640(2021). of-things.IEEETrans.Ind.Inform.19,1703–1714(2022).
18. Kairouz,P.etal.Advancesandopenproblemsinfederatedlearn- 39. Chowdhury,S.,Mayilvahanan,P.&Govindaraj,R.Optimalfeature
ing.Found.TrendsMach.Learn.14,1–210(2021). extractionandclassification-orientedmedicalinsuranceprediction
19. Zhang,J.etal.Securityandprivacythreatstofederatedlearning: model:machinelearningintegratedwiththeinternetofthings.Int.
Issues,methods,andchallenges.Secur.Commun.Netw.2022 J.Comput.Appl.44,278–290(2022).
(2022). 40. Fatani,A.,Dahou,A.,Al-Qaness,M.A.,Lu,S.&AbdElaziz,M.
20. Tolpegin,V.,Truex,S.,Gursoy,M.E.,Liu,L.Datapoisoningattacks Advancedfeatureextractionandselectionapproachusingdeep
againstfederatedlearningsystems.In:Computer learningandaquilaoptimizerforiotintrusiondetectionsystem.
Security–ESORICS2020:25thEuropeanSymposiumonResearch Sensors22,140(2022).
inComputerSecurity,pp.480–501(2020). 41. Hewa,T.,Ylianttila,M.&Liyanage,M.Surveyonblockchainbased
21. Xiao,X.,Tang,Z.,Li,C.,Xiao,B.&Li,K.Sca:sybil-basedcollusion smartcontracts:applications,opportunitiesandchallenges.J.
attacksofiiotdatapoisoninginfederatedlearning.IEEETrans.Ind. Netw.Comput.Appl.177,102,857(2021).
Inform.19,2608–2618(2022). 42. Daemen,J.&Rijmen,V.Reijndael:theadvancedencryptionstan-
22. Bakopoulou,E.,Tillman,B.&Markopoulou,A.Fedpacket:afeder- dard.Dobb’s.J.26,137–139(2001).
atedlearningapproachtomobilepacketclassification.IEEETrans. 43. Barker,E.,Mouha,N.Recommendationforthetripledataencryp-
Mob.Comput.21,3609–3628(2021). tionalgorithm(tdea)blockcipher.Technicalreport,NationalInsti-
23. Wang,B.,Li,A.,Pang,M.,Li,H.,Chen,Y.Graphfl:afederated tuteofStandardsandTechnology(2017).
learningframeworkforsemi-supervisednodeclassificationon 44. Naresh,V.,Sivaranjani,R.&Murthy,N.Provablesecurelightweight
graphs.In:2022IEEEInternationalConferenceonDataMining multiplesharedkeyagreementbasedonhyperellipticcurvediffie-
(ICDM)pp.498–507(2022). hellmanforwirelesssensornetworks.Int.J.Crit.Infrastruct.Prot.
24. Xie,J.,Su,Y.,Zhang,D.&Feng,Q.Avisionofmaterialsgenome 28,100,371(2020).
engineeringinchina.Engineering10,10–12(2022). 45. Trzepieciński,T.&Lemu,H.G.Improvingpredictionofspringback
25. Wang,R.etal.Asecuredbig-datasharingplatformformaterials insheetmetalformingusingmultilayerperceptron-basedgenetic
genomeengineering:state-of-the-art,challengesandarchitecture. algorithm.Materials13,3129(2020).
FutureGener.Comput.Syst.142,59–74(2023). 46. Maulud,D.&Abdulazeez,A.M.Areviewonlinearregression
26. Wang,R.,Xu,C.,Ye,F.,Tang,S.,Zhang,X.,S-mbda:ablockchain- comprehensiveinmachinelearning.J.Appl.Sci.Technol.Trends1,
basedarchitectureforsecurestorageandsharingofmaterialbig- 140–147(2020).
data.IEEEInternetThingsJ.11,15(2024). 47. Wu,L.etal.Arecurrentneuralnetwork-acceleratedmulti-scale
27. Liu,S.etal.Aninfrastructurewithuser-centeredpresentationdata modelforelasto-plasticheterogeneousmaterialssubjectedto
modelforintegratedmanagementofmaterialsdataandservices. randomcyclicandnon-proportionalloadingpaths.Comput.
npjComput.Mater.7,88(2021). MethodsAppl.Mech.Eng.369,113,234(2020).
28. Ileana,M.,Oproiu,M.I.,C.V.,Marian,Usingdockerswarmto 48. Meng,H.,Geng,M.&Han,T.Longshort-termmemorynetworkwith
improveperformanceindistributedwebsystems.In:International bayesianoptimizationforhealthprognosticsoflithium-ionbatteries
ConferenceonDevelopmentandApplicationSystems(DAS)pp. basedonpartialincrementalcapacityanalysis.Reliab.Eng.Syst.
1–6(2024). Saf.236,109,288(2023).
29. Jere,M.S.,Farnan,T.&Koushanfar,F.Ataxonomyofattackson 49. Blanchard,P.,ElMhamdi,E.M.,Guerraoui,R.,Stainer,J.,Machine
federatedlearning.IEEESecur.Priv.19,20–28(2020). learningwithadversaries:byzantinetolerantgradientdescent.
NatureCommunications|( 2024)1 5:9290 13

Article https://doi.org/10.1038/s41467-024-53431-x
In:InternationalConferenceonNeuralInformationProcessing Additionalinformation
Systemsp.118–128(2017). SupplementaryinformationTheonlineversioncontains
50. Karimireddy,S.P.,He,L.,Jaggi,M.,Learningfromhistoryfor supplementarymaterialavailableat
byzantinerobustoptimization.In:InternationalConferenceon https://doi.org/10.1038/s41467-024-53431-x.
MachineLearning,pp.5311–5319(2021).
51. Chen,Y.,Su,L.&Xu,J.Distributedstatisticalmachinelearningin Correspondenceandrequestsformaterialsshouldbeaddressedto
adversarialsettings:Byzantinegradientdescent.Proc.ACMMeas. ChengXuorXiaotongZhang.
Anal.Comput.Syst.1,1–25(2017).
52. Yin,D.,Chen,Y.,Kannan,R.,Bartlett,P.,Byzantine-robustdis- PeerreviewinformationNatureCommunicationsthanksErnestina
tributedlearning:towardsoptimalstatisticalrates.In:International Mensalvasandtheotheranonymousreviewer(s)fortheircontributionto
ConferenceonMachineLearning,pp.5650–5659(2018). thepeerreviewofthiswork.Apeerreviewfileisavailable.
53. Zhang,G.etal.Reachingconsensusinthebyzantineempire:a
comprehensivereviewofBFTconsensusalgorithms.ACMComput. Reprintsandpermissionsinformationisavailableat
Surv.56,1–41(2024). http://www.nature.com/reprints
54. Wang,R.etal.Matswarm:trustedswarmtransferlearningdriven
materialscomputationforsecurebigdatasharing,https://zenodo. Publisher’snoteSpringerNatureremainsneutralwithregardtojur-
org/records/13622509(2024). isdictionalclaimsinpublishedmapsandinstitutionalaffiliations.
Acknowledgements OpenAccessThisarticleislicensedunderaCreativeCommons
ThisworkissupportedinpartbytheNationalKeyResearchandDevel- Attribution4.0InternationalLicense,whichpermitsuse,sharing,
opmentProgramofChinaunderGrant2021YFB3702403,andinpartby adaptation,distributionandreproductioninanymediumorformat,as
theNationalNaturalScienceFoundationofChinaunderGrant longasyougiveappropriatecredittotheoriginalauthor(s)andthe
62101029.R.W.hasbeensupportedbytheChinaScholarshipCouncil source,providealinktotheCreativeCommonslicence,andindicateif
AwardunderGrant202306460078.C.X.hasbeensupportedinpartby changesweremade.Theimagesorotherthirdpartymaterialinthis
theChinaScholarshipCouncilAwardunderGrant202006465043. articleareincludedinthearticle’sCreativeCommonslicence,unless
indicatedotherwiseinacreditlinetothematerial.Ifmaterialisnot
Authorcontributions includedinthearticle’sCreativeCommonslicenceandyourintended
R.W.andC.X.conceivedthisproject.C.X.andX.Z.fundedandsuper- useisnotpermittedbystatutoryregulationorexceedsthepermitted
visedtheresearch.R.W.andF.Y.implementedthealgorithm,performed use,youwillneedtoobtainpermissiondirectlyfromthecopyright
theexperiments,andpreparedtheplots.Y.T.,S.T.,H.Z.,andW.D. holder.Toviewacopyofthislicence,visithttp://creativecommons.org/
implementedtheopen-sourceprototype.R.W.andC.X.analyzedthe licenses/by/4.0/.
resultsanddraftedthemaintext.C.X.,S.Z.andX.Z.revisedthemanu-
script.Allauthorscommentedonthemanuscript. ©TheAuthor(s)2024
Competinginterests
Theauthorsdeclarenocompetinginterests.
NatureCommunications|( 2024)1 5:9290 14