IEEE 23rd International Symposium on Modeling, Analysis, and Simulation of Computer and Telecommunication Systems
| To  | Co-Run, |       |       | or       | Not        |            | To          | Co-Run:          |            | A   | Performance |       |     |     |     |
| --- | ------- | ----- | ----- | -------- | ---------- | ---------- | ----------- | ---------------- | ---------- | --- | ----------- | ----- | --- | --- | --- |
|     |         | Study |       |          | on         | Integrated |             | Architectures    |            |     |             |       |     |     |     |
|     |         |       |       | ∗        |            | ∗          |             | ∗                |            | †   |             | †     |     |     |     |
|     |         | Feng  | Zhang | , Jidong | Zhai       | , Wenguang |             | Chen , Bingsheng | He         | and | Shuhao      | Zhang |     |     |     |
|     |         |       |       | ∗        | Department | of         | Computer    | Science and      | Technology |     |             |       |     |     |     |
|     |         |       |       |          |            | Tsinghua   | University, | Beijing,         | China      |     |             |       |     |     |     |
Email: feng-zhang12@mails.tsinghua.edu.cn, zhaijidong@tsinghua.edu.cn, cwg@tsinghua.edu.cn
|     |     |     |     |     | † Nanyang | Technological    |     | University,            | Singapore |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --------- | ---------------- | --- | ---------------------- | --------- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     | Email:    | bshe@ntu.edu.sg, |     | szhang026@e.ntu.edu.sg |           |     |     |     |     |     |     |
Abstract—Architecture designers tend to integrate both CPU Inthispaper,weexploretheseproblemsthroughadoptinga
and GPU on the same chip to deliver energy-efficient designs. strategyofdatapartitionthatcanutilizetheGPUandCPUre-
| To effectively | leverage | the | power | of both | CPUs | and GPUs | on  |            |            |                |     |          |     |               |     |
| -------------- | -------- | --- | ----- | ------- | ---- | -------- | --- | ---------- | ---------- | -------------- | --- | -------- | --- | ------------- | --- |
|                |          |     |       |         |      |          |     | sources on | integrated | architectures. |     | We focus | on  | data-parallel |     |
integratedarchitectures,researchershaverecentlyputsubstantial
|     |     |     |     |     |     |     |     | workloads. | We have | ported | Rodinia | benchmark |     | suite | [3], 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------- | ------ | ------- | --------- | --- | ----- | ------- |
effortsintoco-runningasingleapplicationonboththeCPUand
|            |                     |                |            |             |             |              |        | parallel programs |               | in total, | and        | co-run these | programs |               | on an  |
| ---------- | ------------------- | -------------- | ---------- | ----------- | ----------- | ------------ | ------ | ----------------- | ------------- | --------- | ---------- | ------------ | -------- | ------------- | ------ |
| the GPU    | of such             | architectures. |            | However,    | few studies | have         | been   |                   |               |           |            |              |          |               |        |
|            |                     |                |            |             |             |              |        | integrated        | architecture. |           | We rewrite | these        | programs | to            | enable |
| performed  | to analyze          | a              | wide range | of parallel |             | computation  | pat-   |                   |               |           |            |              |          |               |        |
| terns on   | such architectures. |                | In this    | paper,      | we port     | all programs |        |                   |               |           |            |              |          |               |        |
|            |                     |                |            |             |             |              |        | them to           | co-run        | on both   | CPUs       | and GPUs,    | and      | the partition |        |
| in Rodinia | benchmark           |                | suite and  | co-run      | these       | programs     | on the |                   |               |           |            |              |          |               |        |
pointofCPUsandGPUscanbeadjustedinaflexiblemanner
| integrated    | architecture. |         | We find | that co-running |     | results | are not |            |      |               |     |         |          |     |         |
| ------------- | ------------- | ------- | ------- | --------------- | --- | ------- | ------- | ---------- | ---- | ------------- | --- | ------- | -------- | --- | ------- |
|               |               |         |         |                 |     |         |         | to achieve | good | load balance. |     | This is | a simple | yet | general |
| always better | than          | running | the     | application     | on  | the CPU | only or |            |      |               |     |         |          |     |         |
approachforimplementingco-running,andmoreoptimization
| the GPU | only. Among | the | 20 programs, |     | 3 programs | can | benefit |     |     |     |     |     |     |     |     |
| ------- | ----------- | --- | ------------ | --- | ---------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
from co-running, 12 programs using GPU only and 2 programs through re-designing algorithms are left for future work.
using CPU only achieve the best performance. The remaining 3 Thestudyhasshedlightonthefutureresearchofco-running
programsshownoperformancepreferencefordifferentdevices.
|         |              |     |          |     |           |     |          | the application.  |     | More research |          | and optimizations |     | are | needed |
| ------- | ------------ | --- | -------- | --- | --------- | --- | -------- | ----------------- | --- | ------------- | -------- | ----------------- | --- | --- | ------ |
| We also | characterize | the | workload | and | summarize | the | patterns |                   |     |               |          |                   |     |     |        |
|         |              |     |          |     |           |     |          | to take advantage |     | of our        | workload | characterization  |     | for | better |
forthesysteminsightsofco-runningonintegratedarchitectures.
|     |     |     |              |     |     |     |     | performance. | We       | make    | two main  | contributions |       | in this | work:  |
| --- | --- | --- | ------------ | --- | --- | --- | --- | ------------ | -------- | ------- | --------- | ------------- | ----- | ------- | ------ |
|     |     |     |              |     |     |     |     | • We         | port the | Rodinia | benchmark | suite.        | Among |         | the 20 |
|     |     | I.  | INTRODUCTION |     |     |     |     |              |          |         |           |               |       |         |        |
portedprograms,3programsareco-run-friendly(thepro-
| Integrating | GPUs | with | CPUs | on the | same | chip is | increas- |      |             |     |               |     |          |     |     |
| ----------- | ---- | ---- | ---- | ------ | ---- | ------- | -------- | ---- | ----------- | --- | ------------- | --- | -------- | --- | --- |
|             |      |      |      |        |      |         |          | gram | performance |     | of co-running | on  | both CPU | and | GPU |
ingly common in current processor architectures. In 2011, isthebest),12programsareGPUdominant(theprogram
AMDreleaseditsintegratedarchitecture[7],calledaccelerated performance of only running on GPU is the best), 2
processing units (APUs). Subsequently, Intel also released an programs are CPU dominant (the program performance
| integrated | architecture |     | in the | processors | of  | Ivy Bridge | and |         |         |     |     |               |     |            |     |
| ---------- | ------------ | --- | ------ | ---------- | --- | ---------- | --- | ------- | ------- | --- | --- | ------------- | --- | ---------- | --- |
|            |              |     |        |            |     |            |     | of only | running | on  | CPU | is the best), | and | 3 programs |     |
Haswell [1]. A main advantage of integrated architectures is show no performance preference for devices.
that both CPUs and GPUs share the same physical memory, • We further characterize the workloads and find that the
whichcansignificantlyreducedatatransmissionrequirements key indicators are local memory usage, kernel execution
| through | PCIe bus | in traditional |     | architectures |     | using | discrete |        |           |          |     |           |                |     |        |
| ------- | -------- | -------------- | --- | ------------- | --- | ----- | -------- | ------ | --------- | -------- | --- | --------- | -------------- | --- | ------ |
|         |          |                |     |               |     |       |          | time,  | partition | number,  | and | the ratio | of computation |     | to     |
| GPUs.   |          |                |     |               |     |       |          | memory | access.   | Finally, | we  | provide   | a summary      | to  | assist |
To effectively leverage the power of both CPUs and GPUs in choosing devices when using integrated architectures.
| on integrated | architectures, |          | researchers |     | have    | recently | focused |               |     |         |       |              |     |          |      |
| ------------- | -------------- | -------- | ----------- | --- | ------- | -------- | ------- | ------------- | --- | ------- | ----- | ------------ | --- | -------- | ---- |
|               |                |          |             |     |         |          |         | The remainder |     | of this | paper | is organized | as  | follows. | Sec- |
| on co-running |                | the same | application |     | on both | the CPU  | and     |               |     |         |       |              |     |          |      |
tionIIreviewstheintegratedarchitecture.SectionIIIdescribes
the GPU on such architectures. He et al. [8], [9] employ ourmethodology.SectionIVdetailstheexperimentsandsum-
an integrated architecture to optimize Hash Join, which is an marizesthecharacteristics.SectionVprovidestheconclusion.
| important | type of | operations | in  | databases. | Delorme | et  | al. [6] |     |     |     |     |     |     |     |     |
| --------- | ------- | ---------- | --- | ---------- | ------- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- |
implementaparallelradixsortusinganintegratedarchitecture. II. BACKGROUND
Daga et al. [5] show the promising performance of Breadth- We focus on AMD’s integrated architecture, the A-Series
First Search using an integrated architecture. Chen et al. [4] APU A10-7850K (codenamed “Kaveri [2]”). We show its
accelerateMapReduceonanintegratedarchitecture.Different structureinFigure1.TheCPUhasfourcoresandeachcoreis
fromtheco-runstudyinourpaper,Zhuetal.[10]rundifferent referred as a computing unit in OpenCL. The GPU has eight
applicationssimultaneouslyonbothCPU-andGPU-integrated computing units. For APUs, the GPU and CPU are on the
architectures. However, few studies have been performed to same die and share the same memory. The CPU and GPU
analyzeawiderangeofco-runningsingleapplicationsonsuch also share the same memory controller. Therefore, memory
architectures. bandwidthcontentionoccurs.OntheAPU,althoughtheCPU
| 1526-7539/15 $31.00 © 2015 IEEE |     |     |     |     |     |     |     | 89  |     |     |     |     |     |     |     |
| ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
DOI 10.1109/MASCOTS.2015.27
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:17:28 UTC from IEEE Xplore.  Restrictions apply.

| and GPU | are on | the same | chip, | they | still have different |     |     |     |     |     |     |     |     |
| ------- | ------ | -------- | ----- | ---- | -------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
cl_intclEnqueueNDRangeKernel(…, command_queue,kernel,
global_work_size, local_work_size,…){
| memory bandwidths. |     | The | bandwidth | provided | for GPUs | is  |     |     |     |     |     |     |     |
| ------------------ | --- | --- | --------- | -------- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
}
| higher than | the bandwidth |     | provided | for CPUs. |     |     |     |                                                        |     |     |     |     |     |
| ----------- | ------------- | --- | -------- | --------- | --- | --- | --- | ------------------------------------------------------ | --- | --- | --- | --- | --- |
|             |               |     |          |           |     |     | GPU | cl_intclEnqueueNDRangeKernel_fusion(…, command_queue,  |     |     |     |     |     |
kernel, global_work_size,local_work_size,…){
GPU GPU GPU //Step 1: Calculate the number of work-items for CPUs and
|         |     |     | CU 0 | CU 1 | … CU 7 |     |     |                          |     |     |     |     |     |
| ------- | --- | --- | ---- | ---- | ------ | --- | --- | ------------------------ | --- | --- | --- | --- | --- |
| CPU CPU | CPU | CPU |      |      |        |     |     | GPUs and get the offset. |     |     |     |     |     |
core core core core gpu_global_work_size= compute_gpu_global_size(…);
L1 Local L1 Local L1 Local IPA cpu_global_work_size= compute_cpu_global_size(…);
global_work_offset= compute_global_offset(…);
LCnepO
L2
L1 L1 L1 L1 //Step 2: If the related number of work-items is not zero,
launch the kernels for CPUs and GPUs.
L2 L2 CPU i f ( G P U _ R U N )   c l E n q u e u e N D R a n g e K e r n e l ( … ) ;
|     |     |     | IOMMU |     |     |     |     | i f ( CP U _ | R U N )   c l E n q | u e u e N D R a | n g e K e r n e l | ( … ) ; |     |
| --- | --- | --- | ----- | --- | --- | --- | --- | ------------ | ------------------- | --------------- | ----------------- | ------- | --- |
if(GPU_RUN) clFlush(gpu_command_queue);
if(CPU_RUN) clFlush(cpu_command_queue);
Unified North Bridge
//Step 3: Synchronization.
if(CPU_RUN)   error|=clWaitForEvents(&cpu_event);
System DRAM if(GPU_RUN)   error|=clWaitForEvents(&gpu_event);
}
| Fig.1. | AMDintegratedarchitecture(AMDA10-7850K) |               |           |     |              |      |        |                                       |     |     |     |     |     |
| ------ | --------------------------------------- | ------------- | --------- | --- | ------------ | ---- | ------ | ------------------------------------- | --- | --- | --- | --- | --- |
|        |                                         |               |           |     |              |      | Fig.2. | ReplacementforclEnqueueNDRangeKernel. |     |     |     |     |     |
| OpenCL | is an                                   | open standard | computing |     | language and | uses |        |                                       |     |     |     |     |     |
a context for managing objects. An OpenCL context can Our pseudo-code is presented in Figure 2. In Step 1, we
associate with a number of computing devices such as CPUs calculate the work item numbers for CPUs and GPUs, and
and GPUs. For each device, we need to create a separate their starting number. In Step 2, we launch kernels for CPUs
command queue to launch kernels. In OpenCL, each thread and GPUs. In Step 3, we use two queues and two events to
is a work item, and a certain number of work items are perform the synchronization. Third, we release two devices
organized as a workgroup. A work group can run on only and two queues. We define a global offset to determine the
one computing unit. The work items within a group can workload proportion for CPUs and GPUs. If the global offset
communicate through local memory and global memory, and is 0 or 100 %, we only execute the program on one device.
they are synchronized through barrier operations. Work items Moreover,anOpenCLprogramcanhavemorethanonekernel.
from different workgroups cannot communicate directly, and Weselectthemainkernelcontributingtothemostfractionof
we cannot synchronize them through barrier operations. This the execution time for preventing inter-kernel impact of co-
flexibilityallowsustoseparatepartofworkgroupstoCPUsif run, which facilitates characteristics analysis.
| the original | program | only | uses GPUs. | Similar | ideas are | used |             |                   |     |     |     |     |     |
| ------------ | ------- | ---- | ---------- | ------- | --------- | ---- | ----------- | ----------------- | --- | --- | --- | --- | --- |
|              |         |      |            |         |           |      | B. Workload | Characterizations |     |     |     |     |     |
in [6], [8].
|     |     |     |     |     |     |     | We divide | the tested | programs | into | two | categories: | co-run |
| --- | --- | --- | --- | --- | --- | --- | --------- | ---------- | -------- | ---- | --- | ----------- | ------ |
III. METHODOLOGY friendly and co-run unfriendly. We then subdivide the co-run
In the integrated architecture, we distribute workloads to unfriendly category into three subcategories: GPU dominant,
bothCPUsandGPUs.Mostcurrentbenchmarksaredesigned CPU dominant, and performance similar.
for CPU-only or GPU-only, and few benchmarks are for co- Co-run-friendly programs: Co-run-friendly programs
run.Inthisstudy,wefocusondata-parallelprogramsthatare achieve the best performance when we use GPUs and CPUs
| written in | OpenCL. |     |     |     |     |     | together to  | process the | workload. |              |     |     |          |
| ---------- | ------- | --- | --- | --- | --- | --- | ------------ | ----------- | --------- | ------------ | --- | --- | -------- |
|            |         |     |     |     |     |     | GPU-dominant | programs:   |           | GPU-dominant |     |     | programs |
A. Implementation
|          |           |     |          |          |         |        | achieve the | best performance |     | when | we only | use | GPUs to |
| -------- | --------- | --- | -------- | -------- | ------- | ------ | ----------- | ---------------- | --- | ---- | ------- | --- | ------- |
| To write | an OpenCL |     | program, | we first | need to | create | process the | workload.        |     |      |         |     |         |
a context, and create command queues within the context. CPU-dominant programs: CPU-dominant programs
| Second, we | use the | function | clEnqueueNDRangeKernel() |     |     | to  |             |                  |     |      |         |     |         |
| ---------- | ------- | -------- | ------------------------ | --- | --- | --- | ----------- | ---------------- | --- | ---- | ------- | --- | ------- |
|            |         |          |                          |     |     |     | achieve the | best performance |     | when | we only | use | CPUs to |
enqueueacommandtoexecuteakernelonadevice.Afterthe process the workload.
enqueueoperation,weusethefunctionclFlush()toguarantee Performance similar programs: Performance similar pro-
those OpenCL commands have been issued to the associated grams are programs that exhibit no preference for devices
| CPU or GPU. | Third, | we  | use the | function | clWaitForEvents() |     |                 |              |                |     |     |     |     |
| ----------- | ------ | --- | ------- | -------- | ----------------- | --- | --------------- | ------------ | -------------- | --- | --- | --- | --- |
|             |        |     |         |          |                   |     | using different | proportional | distributions. |     |     |     |     |
to wait for executions to complete. After the execution of the We provide the classification results in Table I. To
kernel, we need to release OpenCL resources. avoid the effect of random errors, we define the thresh-
In our implementation, we first change the code and create old for each category. We define the CorunIndicator and
| two devices | and two | command | queues | ina | shared context | in- |                         |     |     |          |          |     |          |
| ----------- | ------- | ------- | ------ | --- | -------------- | --- | ----------------------- | --- | --- | -------- | -------- | --- | -------- |
|             |         |         |        |     |                |     | DeviceChoosingIndicator |     | as  | follows. | Programs |     | are con- |
steadofonedeviceandonecommandqueue.Second,weim- sidered co-run-friendly only when CorunIndicator is less
plement a new function, clEnqueueNDRangeKernel fusion(), than 0.85. For co-run unfriendly programs, the programs
instead of the original clEnqueueNDRangeKernel() function. with DeviceChoosingIndicator less than -0.4 are considered
90
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:17:28 UTC from IEEE Xplore.  Restrictions apply.

CPU-dominant,theprogramswithDeviceChoosingIndicator 2) GPU-dominant programs (PF, HS, BP, LC, SRAD, SC,
greater than 0.4 are considered GPU-dominant, while others CFD, PTHF, MD, BT, DWT, and LU): GPU-dominant pro-
are performance similar. We choose the boundary values grams usually have well-structured parallelism, which can
artificially. fullyutilizeGPUperformance.Moreover,ifthekerneltimeis
short or the partition number is high, which gives the CPU
CorunIndicator = min all (1) limited performance space, the program is GPU-dominant.
min atipodes Local memory is friendlier to GPUs than to CPUs; therefore,
programs that use local memory intensively are likely to be
t −t
DeviceChoosingIndicator = cpu 100 cpu 0 (2) GPU dominant.
min atipodes
3) CPU-dominant programs (NN, and MC): If programs
have low vector compute to memory ratios or the average
min all=min(t cpu 0 ,...,t cpu 100 ) (3) kernel time is low, the programs will run poorly on GPUs.
These programs will be CPU dominant.
min atipodes=min(t cpu 0 ,t cpu 100 ) (4) 4) Performancesimilarprograms(NW,BFS,andHS): For
performance similar programs, programs running on GPUs
t cpu i is the time when the CPU process i% workloads. performwellbutdonotrepresentthebestconfiguration.This
min(t cpu i ,t cpu j )istheminimumvalueoft cpu i andt cpu j. typeofprogramtypicallyhassubstantialpartitionnumbersor
min(t cpu i ,...,t cpu j ) is the minimum value from t cpu i to inadequate threads in a workgroup.
t cpu j. The i and j can be a number from 0 to 100. As an example, we show the profiling results for the KM,
which is a co-run friendly program. The average kernel time
IV. EXPERIMENTALEVALUATION
is 24 ms that is sufficient and it does not use local memory.
A. Co-run Results The partition number is 1930 that is considered reasonable.
Moreover, the execution time for CPU only and GPU only
We evaluate the Rodinia benchmark suite [3] according to
are 2.1 sec and 2.8 sec, which are similar.
ourclassificationandconductexperimentsonA10-7850K.We
varytheCPUworkloadportionfrom0to100%ataninterval V. CONCLUSION
of 10%. We list the input size for each program in Table I.
In this paper, we analyze the characteristics of co-running
We also list the name of the main kernel for each program.
a single application on both the CPU and the GPU of an
Certain programs have more than one dominant function. We
integrated architecture. On AMD’s APU A10-7850K, we
then choose the kernel according to the significance in the
demonstrate that 1) co-running a single application may not
program. The Rodinia benchmark suite divides the running
alwaysdeliverabetterperformancethanrunningitonasingle
time into different stages. For example, Leukocyte provides
processor due to memory contention, 2) careful design and
six stages: device initialization, data allocation, data copy in,
optimizations are required for future research of co-running a
kernelrunning,datacopyout,andresourcerelease.Thekernel
single application on the integrated architecture.
running stage takes more than 90% of the time. Because we
co-run CPUs and GPUs to parallelize the kernel, we are only
VI. ACKNOWLEDGEMENT
concerned about the kernel stage of the programs. We refer
to the kernel stage as the computation stage because certain This work is supported by the National High Tech-
programshavemorethanonekernelstageandcontainasmall nology Research and Development Program of China
amount of data transmission between different kernels. The (2012AA010901), Natural Science Foundation of China
co-run results are shown in Figure 3. project(61472201),andaMoEAcRFTier2grant(MOE2012-
T2-2-067) in Singapore.
B. Performance Characteristics Profile
REFERENCES
Wefindthatthekeyindicatorsare(1)localmemoryusage,
(2)kernelexecutiontime,(3)partitionnumber(wherepartition [1] The Compute Architecture of Intel Processor Graphics Gen7.5.
https://software.intel.com/sites/default/files/managed/4f/e0/Compute
number refers to the total thread number divided by the
Architecture of Intel Processor Graphics Gen7dot5 Aug4 2014.pdf.
thread number equals the partition number on the selected [2] D.BouvierandB.Sander. ApplyingAMDsKaveriAPUforHeteroge-
dimension), and (5) the ratio of computation to memory neousComputing. InHotChips,2014.
[3] S.Che,M.Boyer,J.Meng,D.Tarjan,J.W.Sheaffer,S.-H.Lee,and
access. In addition, insufficient thread number also influences
K.Skadron. Rodinia:Abenchmarksuiteforheterogeneouscomputing.
co-running results. The characteristics of the four types of In Workload Characterization, 2009. IISWC 2009. IEEE International
programs are given below. Symposiumon,pages44–54.IEEE,2009.
[4] L. Chen, X. Huo, and G. Agrawal. Accelerating MapReduce on a
1) Co-run-friendly programs (KM, HW, and GE): Co-run-
coupled CPU-GPU architecture. In Proceedings of the International
friendlyprogramshavesufficientkernelexecutiontimeanddo ConferenceonHighPerformanceComputing,Networking,Storageand
notuselocalmemory.Thepartitionnumberofco-run-friendly Analysis,page25.IEEEComputerSocietyPress,2012.
[5] M. Daga, M. Nutter, and M. Meswani. Efficient breadth-first search
programsisnotexcessive.TheprogramperformanceonGPUs
on a heterogeneous processor. In Big Data (Big Data), 2014 IEEE
is similar to the performance on CPUs. InternationalConferenceon,pages373–382.IEEE,2014.
91
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:17:28 UTC from IEEE Xplore. Restrictions apply.

TABLEI
EXPERIMENTINPUT.
Applications MainKernel Input Co-runIndicator DeviceChoosingIndicator Type
Leukocyte(LC) IMGVF kernel testfile.avi 1.00 -40.56 GPUdominant
HeartWall(HW) kernel gpu opencl numberofframe20 0.76 -1.56 Co-runfriendly
CFDSolver(CFD) compute flux fvcorr.domn.097K 1.00 -3.31 GPUdominant
LUDecomposition(LU) lud internal s2048 1.00 -113.34 GPUdominant
| HotSpot(HS) |     |     | hotspot |     | 51221000 |     |     | 1.00 | -506.87 |     |     | GPUdominant |     |
| ----------- | --- | --- | ------- | --- | -------- | --- | --- | ---- | ------- | --- | --- | ----------- | --- |
BackPropagation(BP) bpnn adjust weights ocl 524288 1.00 -1.60 GPUdominant
Needleman-Wunsch(NW) nw kernel2 409610 1.00 -0.31 Performancesimilar
| Kmeans(KM) |     |     | kmeans | kernel c | kdd | cup |     | 0.84 | -0.29 |     |     | Co-runfriendly |     |
| ---------- | --- | --- | ------ | -------- | --- | --- | --- | ---- | ----- | --- | --- | -------------- | --- |
Breadth-FirstSearch(BFS) BFS 1 graph1MW6.txt 0.93 -0.07 Performancesimilar
| SRAD(SRAD) |     |     | srad | kernel | 1000.5502458 |     |     | 1.00 | -0.55 |     |     | GPUdominant |     |
| ---------- | --- | --- | ---- | ------ | ------------ | --- | --- | ---- | ----- | --- | --- | ----------- | --- |
Streamcluster(SC) pgain kernel 102025665536655361000 1.00 -53.68 GPUdominant
ParticleFilter(PF) find index kernel x128y128z10np400000 0.99 -6.29 GPUdominant
PathFinder(PTHF) dynproc kernel 10000010020 1.00 -2217.29 GPUdominant
| GaussianElimination(GE) |     |     | Fan2 |     | s1024 |     |     | 0.79 | -0.20 |     |     | Co-runfriendly |     |
| ----------------------- | --- | --- | ---- | --- | ----- | --- | --- | ---- | ----- | --- | --- | -------------- | --- |
k-NearestNeighbors(NN) NearestNeighbor r5lat30lng90 1.00 5.08 CPUdominant
LavaMD(MD) kernel gpu opencl boxes1d20 1.00 -10.85 GPUdominant
| Myocyte(MC) |     |     | kernel     | gpu opencl | time100     |     |     | 0.93 | 8.59    |     |     | CPUdominant |     |
| ----------- | --- | --- | ---------- | ---------- | ----------- | --- | --- | ---- | ------- | --- | --- | ----------- | --- |
| B+Tree(BT)  |     |     | findRangeK |            | j6553610000 |     |     | 1.00 | -256.43 |     |     | GPUdominant |     |
GPUDWT(DWT) cl fdwt53Kernel rgb.bmpd1024x1024f5l3 1.00 -2.71 GPUdominant
| HybridSort(HS) |       |     | bucketsort |     | r   |         |     | 0.98    | 0.01 |     |     | Performancesimilar |     |
| -------------- | ----- | --- | ---------- | --- | --- | ------- | --- | ------- | ---- | --- | --- | ------------------ | --- |
|                |  2500 |     |            |     |     |  100000 |     |  150000 |      |     |     |                    |     |
)sm( emit  2000 )sm( emit  7500  6000 )sm( emit  80000 )sm( emit  120000 )sm( emit  75000  60000
|     |  1500 |     |     |  4500 |     |  60000 |     |  90000 |     |     |  45000 |     |     |
| --- | ----- | --- | --- | ----- | --- | ------ | --- | ------ | --- | --- | ------ | --- | --- |
|     |  1000 |     |     |  3000 |     |  40000 |     |  60000 |     |     |  30000 |     |     |
|     |  500  |     |     |  1500 |     |  20000 |     |  30000 |     |     |  15000 |     |     |
|     |  0    |     |     |  0    |     |  0     |     |        |  0  |     |        |  0  |     |
 0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100
CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%)
(a) Kmeans(KM) (b) HeartWall(HW) (c) GaussianElimination(GE) (d) ParticleFilter(PF) (e) HotSpot(HS)
)sm( emit  1500 )sm( emit  2500 )sm( emit  1000 )sm( emit  600000 )sm( emit  40000
|     |  1200  900 |     |     |  2000       |     |  800  600 |     |  450000 |     |     |  32000        |     |     |
| --- | ---------- | --- | --- | ----------- | --- | --------- | --- | ------- | --- | --- | ------------- | --- | --- |
|     |  600       |     |     |  1500  1000 |     |  400      |     |  300000 |     |     |  24000  16000 |     |     |
|     |  300       |     |     |  500        |     |  200      |     |  150000 |     |     |  8000         |     |     |
|     |  0         |     |     |  0          |     |  0        |     |         |  0  |     |               |  0  |     |
 0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100
CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%)
(f) BackPropagation(BP) (g) Leukocyte(LC) (h) SRAD(SRAD) (i) Streamcluster(SC) (j) CFDSolver(CFD)
)sm( emit  100000 )sm( emit  12500 )sm( emit  6000 )sm( emit  250 )sm( emit  25000
|     |  80000 |     |     |  10000 |     |  4500 |     |  200 |     |     |  20000 |     |     |
| --- | ------ | --- | --- | ------ | --- | ----- | --- | ---- | --- | --- | ------ | --- | --- |
|     |  60000 |     |     |  7500  |     |  3000 |     |  150 |     |     |  15000 |     |     |
|     |  40000 |     |     |  5000  |     |  1500 |     |  100 |     |     |  10000 |     |     |
|     |  20000 |     |     |  2500  |     |       |     |  50  |     |     |  5000  |     |     |
|     |  0     |     |     |  0     |     |  0    |     |  0   |     |     |        |  0  |     |
 0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100
CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%)
(k) PathFinder(PTHF) (l) LavaMD(MD) (m) B+Tree(BT) (n) GPUDWT(DWT) (o) LUDecomposition(LU)
|     |     |     |     |  1250 |     |     |     |  100 |     |     |  900 |     |     |
| --- | --- | --- | --- | ----- | --- | --- | --- | ---- | --- | --- | ---- | --- | --- |
)sm( emit  4 )sm( emit  1000 )sm( emit  250 )sm( emit  75 )sm( emit  750
|     |  3  |     |     |  750 |     |  200  150 |     |     |     |     |  600  450 |     |     |
| --- | --- | --- | --- | ---- | --- | --------- | --- | --- | --- | --- | --------- | --- | --- |
|     |  2  |     |     |  500 |     |  100      |     |  50 |     |     |  300      |     |     |
|     |  1  |     |     |  250 |     |  50       |     |  25 |     |     |  150      |     |     |
|     |  0  |     |     |  0   |     |  0        |     |  0  |     |     |  0        |     |     |
 0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100  0  20  40  60  80  100
CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%) CPU Percentage (%)
(p) k-NearestNeighbors(NN) (q) Myocyte(MC) (r) Needleman-Wunsch(NW) (s) Breadth-FirstSearch(BFS) (t) HybridSort(HS)
Fig.3. ExecutiontimefortheRodiniabenchmarksuite.Co-run-friendlyprogramsare(a,b,c),GPU-dominantprogramsare(d,e,f,g,h,i,j,k,l,m,n,
o),CPU-dominantprogramsare(p,q),andperformancesimilarprogramsare(r,s,t).
| [6] | M.C.Delorme,T.S.Abdelrahman,andC.Zhao.ParallelRadixSorton |     |     |     |     |     | 6(10):889–900,2013. |     |     |     |     |     |     |
| --- | --------------------------------------------------------- | --- | --- | --- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- |
theAMDFusionAcceleratedProcessingUnit. InParallelProcessing [9] J. He, S. Zhang, and B. He. In-cache query co-processing on cou-
(ICPP),201342ndInternationalConferenceon,pages339–348.IEEE, pled CPU-GPU architectures. Proceedings of the VLDB Endowment,
|     | 2013.     |               |       |                     |           |               | 8(4):329–340,2014. |              |               |          |               |                     |        |
| --- | --------- | ------------- | ----- | ------------------- | --------- | ------------- | ------------------ | ------------ | ------------- | -------- | ------------- | ------------------- | ------ |
| [7] | D. Foley, | M. Steinman,  | A.    | Branover, G. Smaus, | A. Asaro, | S. Punya-     |                    |              |               |          |               |                     |        |
|     |           |               |       |                     |           |               | [10] Q.            | Zhu, B. Wu,  | X. Shen,      | L. Shen, | and Z.        | Wang. Understanding | Co-    |
|     | murtula,  | and L. Bajic. | AMD’s | ‘Llano’Fusion       | APU.      | In Hot Chips, |                    |              |               |          |               |                     |        |
|     |           |               |       |                     |           |               | Run                | Degradations | on Integrated |          | Heterogeneous | Processors.         | In The |
volume23,2011.
[8] J.He,M.Lu,andB.He.RevisitingCo-processingforHashJoinsonthe 27thInternationalWorkshoponLanguagesandCompilersforParallel
Computing,page15,2014.
CoupledCPU-GPUArchitecture.ProceedingsoftheVLDBEndowment,
92
Authorized licensed use limited to: Huazhong University of Science and Technology. Downloaded on April 02,2026 at 11:17:28 UTC from IEEE Xplore.  Restrictions apply.