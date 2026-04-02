Elastic Multi-Resource Fairness: Balancing Fairness
and Efﬁciency in Coupled CPU-GPU Architectures

Shanjiang Tang1, BingSheng He2, Shuhao Zhang2,4, Zhaojie Niu3
1School of Computer Science & Technology, Tianjin University
2School of Computing, National University of Singapore
3Interdisciplinary Graduate School, Nanyang Technological University
4SAP Research & Innovation, Singapore

1tashj@tju.edu.cn, 2hebs@comp.nus.edu.sg,

2tonyzhang19900609,3nzjemail
{

}

@gmail.com

Abstract—Fairness and efﬁciency are two important concerns
for users in a shared computer system, and there tends to
be a tradeoff between them. Heterogeneous computing poses
new challenging issues on the fair allocation of computational
resources among users due to the availability of different kinds
of computing devices (e.g., CPU and GPU). Prior work either
considers the fair resource allocation separately for each com-
puting device or is unable to balance ﬂexibly the tradeoff between
the fairness and system utilization.

In this work, we consider an emerging heterogeneous com-
puting system with coupled CPU and GPU into a single chip.
We ﬁrst show that it is essential to have a new fair policy for
coupled CPU-GPU architectures that is capable of considering
both the CPU and the GPU as a whole in fair resource allocation
and being aware of the system utilization maximization. We
then propose a fair policy called Elastic Multi-Resource Fairness
(EMRF) for coupled CPU-GPU architectures, by modeling CPU
and GPU as two resource types and viewing the resource fairness
problem as a multi-resource fairness problem. It extends DRF
by adding a knob that allows users to tune and balance fairness
and performance ﬂexibly, and considers the fair allocation of
computational resources as a whole for CPU and GPU devices.
We show that EMRF satisﬁes fairness properties of sharing
incentive, envy-freeness and pareto efﬁciency. Finally, we evaluate
EMRF using real experiments, and the results show that EMRF
can achieve better performance and fairness.

Index Terms—Coupled CPU-GPU Architecture, Fairness, Per-

formance, EMRF, APU.

I. INTRODUCTION
The recent advancement of accelerator technologies (e.g.,
GPU, FPGA and DSP) has made heterogeneous computing
become common and a trend for High Performance Computing
(HPC) systems [31]. By removing the PCI-e bus, the coupled
CPU-GPU architecture (CCGA) [4], which integrates CPU and
GPU into a single chip, is a new emerging heterogeneous
computing system that aims to achieve extreme-scale, cost-
effective, and power-efﬁcient high performance computing.

Sharing computing devices (e.g., CPU and GPU) is essential
to achieve high resource utilization and cost efﬁciency for a
heterogeneous computing system. First, it generally involves
a high degree of parallelism for a single GPU that consists
of many computing cores, and individual users often cannot
fully utilize it exclusively [26]. Second, even for a single user,
the resource demand of its workload is varying over time,
implying that it is difﬁcult to keep the high utilization all the

SC16; Salt Lake City, Utah, USA; November 2016
978-1-4673-8815-3/16/$31.00 c
⃝

2016 IEEE

time. Resource sharing can address this problem by allowing
multiple users concurrently running their workloads in the
system so that overloaded users can possess unused resources
from underloaded users. Hence, obtaining high utilization by
resource sharing is also an effective manner for high cost
efﬁciency.

GFLOPS (Giga FLoating-point Operations Per Second) is a
key metric widely used to measure and compare the capacities
for different computing devices. However, there are several
challenges for CCGA in providing performance isolation and
Quality of Service (QoS) guarantees. Due to the signiﬁcant
architectural differences between CPU and GPU cores, it is not
suitable to simply consider CCGA as a black box with a certain
capacity of aggregate GFLOPS. The system performance is
essentially associated with the relative frequencies of ﬂoat-
point operations at which the applications invoke with different
kinds of computing devices. Moreover, the performance is also
related to how CPU and GPU capacities are divided across
different applications.

In addition to system efﬁciency (i.e., performance), fairness
is also a major concern for users in the shared heterogeneous
computing environment. Previous studies have shown that
there is a general tradeoff between the fairness and system
efﬁciency in resource allocation [20]. Strictly keeping the
fairness among users can result in allocations with low system
efﬁciency. On the contrary, pursing for a high system efﬁciency
is often at the expense of compromised fairness.

One of the most popular fair policies is proportional re-
source sharing, which allocates resources to users in propor-
tion to their weights [34]. It has been widely applied to a
variety of computer components such as storage systems [37]
and network link bandwidth [13]. When it comes to the
heterogeneous computing, although there is some work for
CPU only [33] and GPU only [7], [21], all of them consider
the fair resource allocation separately for each computing
device. For the computation in the CCGA, a user’s workload
is computed on both computing devices simultaneously. From
a user’s perspective, it is most likely that the user mainly
concerns with the ﬁnal GFLOPS allocation and performance
improvement entirely received from the system, rather than
the result of separate resource allocation and performance
improvement from each computing device. It means that we

should not consider them separately as the single resource
fair allocation for each computing device. Instead, we should
consider CPU and GPU of CCGA as a whole in resource
it can be modeled as
allocation. Typically, we show that
a multi-resource fair allocation problem for CPU and GPU
allocation in the CCGA.

In multi-resource allocation, Dominant Resource Fairness
(DRF) is one of the most popular fair allocation policies [15].
It achieves fairness by equalizing the share of each user’s
dominant resource, referring to as the resource that is most
heavily used (as a fraction of its capacity) by a user. Although
there are a number of extensions [8], [23], [25], [36] (See
Section VII), the impact on the system efﬁciency receives little
attention. Many recent studies have shown that there tends to
be a tradeoff between fairness and efﬁciency in multi-resource
allocation [20]. DRF and its extensions are prone to over-
constrain the system for meeting rigid fairness requirements,
resulting in allocations with poor system efﬁciency.

s

r

0, 1

In this paper, we propose Elastic Multi-Resource Fairness
(EMRF), an elastic fairness-efﬁciency allocation policy, to
be aware of the tradeoff between fairness and efﬁciency
for CCGA in resource allocation. It allows users to balance
fairness and system efﬁciency ﬂexibly in the CCGA with a
knob argument in the range of
. EMRF then improves
the system efﬁciency while guaranteeing the QoS of δ-fairness
with the user’s setting of knob, where δ is the maximum
difference of GFLOPS allocations between any two users
in the CCGA. To the best of our knowledge, EMRF is the
ﬁrst fair policy that integrates CPU and GPU as a whole
in resource allocation for CCGA. We show that EMRF can
ensure that each user in the CCGA can at least get the amount
of resources as that under the exclusively partitioned non-
sharing environment (“Sharing Incentive”). It can also ensure
that every user prefers to its own allocation and no user
envies the allocation of others (“Envy-freeness”). Moreover,
EMRF enables the system fully utilized by ensuring that it is
impossible for a user to get more resources without decreasing
the resource of at least one user (“Pareto Efﬁciency”). We
evaluate EMRF with testbed experiments in an AMD APU
platform. The experimental results show that our approach is
highly elastic and can achieve high efﬁciency and fairness in
the CCGA. We conjecture that the results and ﬁndings in this
paper can be extended to supercomputers and clusters.

Organization. Section II overviews the background of
CCGA and describes a computing model on the CCGA.
Section III motivates our work by showing the difﬁculties of
achieving both fairness and efﬁciency in the CCGA, followed
by formal deﬁnitions of several desirable fairness properties
in Section IV. We describe and analyze our model and
approach in Section V. The experimental evaluation is given
in Section VI. We review the related work in Section VII.
Finally, Section VIII concludes the paper.

II. BACKGROUND AND PRELIMINARY

This section starts by reviewing Coupled CPU-GPU Archi-
tecture (CCGA), and then introduces a heterogeneous comput-

ing model for CCGA.

A. Coupled CPU-GPU Architectures (CCGA)

In traditional discrete CPU-GPU heterogeneous computing
system, the GPU has separated memory space from the CPU,
and the data transfer between the CPU and the GPU is
achieved via a connection bus (e.g., PCIe bus). It tends to
incur large communication overheads between CPU and GPU,
and meanwhile requires a lot of programming effort, since the
data that is manipulated by both the CPU and the GPU have
to be explicitly managed by the programmer carefully [24].
To resolve these limitations, Coupled CPU-GPU Architectures
(CCGA) has emerged, which integrates the CPU and the
GPU into a single chip and allows the CPU and the GPU
to communicate with each other through the shared physical
memory by featuring shared memory space between them.
This reduces the data transfer time signiﬁcantly, especially for
those applications that need large communication between the
CPU and the GPU, since it enables the CPU and the GPU to
transfer their data in the shared physical memory only without
going through the connection bus and allows them to have
zero-copy for the shared data [4]. Having these merits, CCGA
is a trend for future heterogeneous computing system and
many such processors have been produced, including AMD
APU [10], Ivy Bridge [12] and Intel Sandy Bridge [39].

To better support the programming for CPU-GPU heteroge-
neous computing, OpenCL [16] is proposed by industry and
becomes popular in recent years, as a uniﬁed programming
model for both CPU and GPU computing units. It enables
applications written in OpenCL to run on either CPU or GPU
devices, and also allows multiple applications to share and
execute on each device at the same time [38]. Due to the
limited chip area,
the GPU in the CCGA is usually less
powerful than the high-end GPU in discrete architectures.
Thus, the GPU in the CCGA usually cannot deliver a dominant
performance speedup as it does in discrete architectures. An
application must carefully assign workloads to both processors
and keep them busy for the maximized speedup (named as co-
run computation) [11], [17], [18], [41].

3".4%"5’6(
#-(,$.$

!"#$%&’(!)*+,)*(-./012&/2#.&(

#-(,$/$

012$3*(*($

!"#$

4"#$

$$$
$$$$$$012$
%&’()*+(,$
%

#-(,$!"

5678$5(91,:$

Fig. 1: The heterogeneous computing model on the CCGA.

B. Heterogeneous Computing Model

Figure 1 illustrates the heterogeneous computing model for
CCGA. We consider the APU, of which the CPU and the GPU
are coupled in the same chip and all data accesses go through
a uniﬁed north bridge (UNB) that connects the CPU, the
GPU, and the main memory. In this study, we limit our focus

!!"*0*),+1!
2%345#67!
!!!.//!

!!"*0*),+1!
2%345#67!
!!!.//!

!!"*0*),+1!
2%345#67!
!!!.//!

!!!ABC!

!!!@/!%345#6!

/!%34

!!!8./!%345#6!

!!!8//!

!!!./!%345#6!!!!8@/!%345#6!

/ %34

!!!>?’:!!!

!!!&’’()*+,(-!!
!!!+(!$<:=!8!!

!!!&’’()*+,(-!
+(!$<:=!@!!

!!HAC!C

!!!D@AEF!
%345#6!

!!!>?’:!!!

!!!&’’()*+,(-!
!!!+(!$<:=!8!!

!!!&’’()*+,(-!
+(!$<:=!@!!

!!!8//!

!!!DBE8%345#6!
!!F@EG%345#6!!!BGED%345#6!

!!!!!"#$!

!!!!!%#$!

!!!9:;,):<!

!!!!!"#$!

!!!!!%#$!

!!!9:;,):<!

!!!B./!%345#6!

!!!>?’:!!!

!!!&’’()*+,(-!
!!!+(!$<:=!8!!

!!!&’’()*+,(-!
+(!$<:=!@!

!!!@/!%345#6!

!!!8//!
!!!8AEA!
A
!%345#6!

!!!.H.
!!!.HEB%345#6!

!!!!!"#$!

!!!!!%#$!

!!!9:;,):<!

9

(a) Proportional resource allocation result under
1:1 resource allocation ratio, with the GPU uti-
lization of 37%.

(b) The DRF allocation with the GPU utilization
of 63%. The allocation ratio is 32 : 9.

(c) Both CPU and GPU are 100% utilized, given
the allocation ratio of 26 : 1.

Fig. 2: Allocations in the CCGA of Example 1. The capacities of CPU and GPU are 100 and 800, respectively. The CPU-to-GPU workload
ratios for User 1 and User 2 are 1

9 and 4
{
on applications written in OpenCL, for which the CPU/GPU
computing dominants the performance and the impact of data
transfer is negligible.

6, respectively.
{

Given GFLOPS as a widely used metric in HPC for
measuring and comparing the computing resource capacities
across different computing devices, we use it in our following
resource allocation to represent the amount of allocated re-
sources. Let Ccpu and Cgpu represent the computing capacity
(measured in GFLOPS) of CPU and GPU, respectively. Those
capacities represent the total amount of resources that can be
allocated to users in the CCGA. Each user has a sequence of
jobs to compute. To fully utilize CCGA, the tasks of a job
can be assigned and execute on both CPU and GPU devices
concurrently (i.e., co-run computation). Let ξcpu
and ξgpu
denote the fraction of the workload of user i dispatched to CPU
and GPU, respectively. By deﬁnition, it has ξgpu
ξcpu
.
i
The ratio of the workload allocated to CPU to that of GPU for
user i is deﬁned as CPU-to-GPU workload ratio, denoted by
ρi (i.e., ρi “
). It is generally different for different
applications.

ξgpu
i
{

i “

ξcpu
i

´

1

i

i

Suppose that there are n users and a job queue that receives
arriving jobs from each user and then dispatches them to
the internal scheduling buffer by a job scheduler. The job
scheduler maintains a certain number of submitted jobs in
its internal scheduling buffer. It monitors the number of
operations performed in both CPU and GPU for each job,
and dynamically assigns weights to users in accordance with
the measured allocation ratios. Based on these weights, the
scheduler dynamically controls the resource allocations of
CPU and GPU to each user so that the computed number
of operations of a user is proportional to its weight. The
weights are computed according to the fairness policies of
EMRF for maximizing system utilization. Particularly, we
consider the resource sharing across multiple users/jobs in the
GFLOPS dimension instead of the time dimension, since the
current GPU kernel written in OpenCL is non-interruptible,
i.e., it cannot be stopped once it is submitted, which makes it
impossible for time division sharing approach.

Let F cpu

i

and F gpu

i

denote the amount of resources in

F cpu

i `

GFLOPS that user i received from the CPU and the GPU,
respectively. Then the total number of allocated resources Fi
F gpu
in GFLOPS for user i in the CCGA is Fi “
.
i
For the sake of load balancing computation between the
CPU and the GPU for a user i’s workload, we make the
ratio of the allocated resources of CPU in GFLOPS to that
of GPU equal to its CPU-to-GPU workload ratio ρi, i.e.,
F cpu
ρi. By learning from the traditional multi-
i
resource allocation problem where there is a ﬁxed ratio among
different resource types for a task resource demand (e.g., CPU
and memory) [15], we can model CPU and GPU allocation as
a multi-resource allocation problem (namely, CPU-GPU multi-
resource allocation problem). Our allocation in the following
sections is based on this.

F gpu
i
{

“

III. MOTIVATIONS
In the single-resource allocation, the fairness is achieved
among users through dividing the system resources to users
in proportion to their assigned weights. For example, if there
is a CPU of 200 GFLOPS capacity shared equally by two
users, the system will allocate 100 GFLOPS to each user.
Many existing fair schedulers like Weighted Fair Queuing [13]
and Proportional Resource Sharing [34] are work-conserving
schedulers, which can ensure that the system is 100% fully
utilized whenever there are pending workloads in the system.
It implies that the system utilization is not a problem in the
single-resource fairness.

However, when it comes to the CCGA, the above claim for
system utilization might no longer hold. Fairness in sharing
CCGA is relatively more complex and challenging, since the
loads of users’ applications can be scheduled to both CPU
and GPU devices for concurrent execution in the CCGA. The
resource utilization of computing devices highly depends on
their CPU-to-GPU workload ratios and the allocation ratios
(the relative fraction of system capacity in GFLOPS allocated
to users) in the CCGA. If the users with high GPU loads are
assigned with relatively small allocation ratios, it may result
in the low utilization for the GPU device due to insufﬁcient
resource requests. Similar case does also hold for the CPU
device. On the contrary, keeping high usage of both CPU and

GPU devices generally causes the unfairness problem, since it
may need to adjust the allocations in a manner that just starves
some users.

1

9 and ρ2 “
{

To demonstrate these points, let’s consider the following ex-
amples for proportional resource sharing and DRF allocations.
Example 1. Consider a CCGA with the capacities of CPU and
GPU to be 100 GFLOPS and 800 GFLOPS, respectively. It is
shared by users 1 and 2 equally with CPU-to-GPU workload
4
ratios of ρ1 “

6, respectively.
{
Proportional Resource Sharing Allocation. We start with
the basic policy for a single resource type [34]. Figure 2(a)
illustrates the allocation results for Example 1 by using
proportional resource sharing. The two users receive the same
number of GFLOPS under the proportional resource sharing
allocation with the allocation ratio of 1 : 1. There is an
allocation of 200 GFLOPS to each user. Speciﬁcally, user 1
receives 20 GFLOPS from the CPU device and 180 GFLOPS
from the GPU device. User 2 obtains 80 GFLOPS and 120
GFLOPS from the CPU and GPU devices, respectively. The
CPU device is 100% fully utilized, whereas the utilization of
GPU device is only 37% due to the relatively small allocation
ratio for user 1.

¨

¨

¨

ă

0.6

100

100

In Example 1,

the dominant
0.9
F1{

resource
DRF Allocation.
800),
F1{
of user 1 is the GPU device (0.1
whereas the dominant resource of user 2 is the CPU device
800). According to DRF, the fairness
(0.4
F2{
is achieved by equalizing the dominant shares for user 1 and
100. As shown in Figure 2(b),
F2{
2, i.e., 0.9
¨
“
¨
470.6
the resulting allocations for user 1 and 2 are F1 “
132.3 GFLOPS, respectively. Still,
GFLOPS and F2 “
the GPU device is underutilized, with approximately 63%
utilization only.

F2{
0.4

ą
F1{

800

¨

The above allocation policies just consider the issue of
how to achieve some measure of fairness by setting users’
allocation ratios, but do not deal with the impact of how
such settings on system utilization. If we want to increase
the system utilization, it needs to adjust the allocations of the
users. As shown in Figure 2(c), both CPU and GPU devices
can be fully utilized if the system allocates 866.7 GFLOPS
to user 1 (86.7 from the CPU and 780 from the GPU), and
33.3 GFLOPS to user 2 (13.3 from the CPU and 20 from
the GPU). In such 100% utilization case, it requires a 26 : 1
allocation ratio (i.e., giving more allocation ratio to user 1),
and increases user 1’s resources from 470.6 (Figure 2 (b))
to 866.7 (Figure 2 (c)) GFLOPS whereas decreasing user 2’s
resources from 132.3 to 33.3 GFLOPS (being unfair for user
2).

Moreover, the system utilization also highly relies on users’
competing workloads, and can be even worse under propor-
tional resource sharing and DRF policies with more users
joining in the system. To illustrate it, we modify Example 1 by
5) to the system, as shown
adding a third user (with ρ3 “
{
by Example 2 below,
Example 2. We extend Example 1 by adding user 3 with ρ3 “
5.
5
{

5

With proportional resource sharing policy, each user in
Example 2 receives 100 GFLOPS (10 from the CPU and 90
from the GPU for user 1; 40 from the CPU and 60 from
the GPU for user 2; 50 from the CPU and 50 from the
GPU for user 3) with 1 : 1 : 1 allocation ratio. It makes
9 being
user 1 with CPU-to-GPU workload ratio of ρ3 “
{
seriously constrained by the allocation ratio, and reduces the
GPU utilization from 37% (Figure 2(a)) to 25%. If using
DRF policy, the system would allocate 303.8, 86.5 and 69.2
GFLOPS to users 1, 2 and 3 respectively with the allocation
ratio of 160 : 45 : 36, and the GPU is 44.93% utilized. In
contrast, when changing the allocation ratio to 87 : 2 : 1, both
devices are 100% utilized, with allocations of 870, 20 and 10
GFLOPS for users 1, 2, and 3, respectively.

1

Summary. Through the examples, we have the following
observations. First, pursuing 100% fairness is prone to result
in poor resource utilization, and reversely achieving for high
resource utilization is generally at the expense of fairness. That
is, there tends to be a tradeoff between fairness and efﬁciency
in resource allocation for users in the CCGA. Second, it can
be more serious for the tradeoff problem between fairness and
efﬁciency when there are more users in the system.

IV. FAIR SHARING PROPERTIES IN CCGA
From the economic point of view, a good allocation policy
for fair sharing in the CCGA should satisfy several game the-
oretic properties, including sharing incentive, envy-freeness,
and pareto efﬁciency [15], [35]. We re-deﬁne those properties
for CCGA.

A. Sharing Incentive (SI)

Resource sharing is an effective approach to improve the
system utilization and efﬁciency by allowing overloaded users
to possess the unused resources from underloaded users [29],
[30], [28]. To enable resource sharing among users sustainably,
an allocation policy should satisfy sharing incentive (SI),
which ensures that each user in the shared system can get at
least the resources it would get under a statically equal division
of the computing system. Otherwise, users would prefer to
split the computing system equally and use their own partitions
exclusively without sharing.

The GFLOPS obtained by user i in the CCGA can be repre-
. Moreover, let F cpu
F cpu
, F gpu
sented by the vector Fi “ x
i
i
y
and F gpu
represent the received resources in GFLOPS for
user i from CPU and GPU devices under its own non-sharing
partition of CCGA, respectively. Formally, an allocation policy
satisﬁes SI if the following holds for each user i

1, n

,

i

i

P r

s

1

where Fi “ x
y
user i under its own non-sharing partition of CCGA.

F cpu
i

, F gpu
i

q
denotes the GFLOPS received for

p

Fi ľ Fi

1.

B. Envy-freeness (EF)

Envy-freeness (EF) is another important criterion for mea-
suring the fairness of an allocation policy. It means that no
user envies the allocation of any other users. That is, each

1For any two vectors a and b, we say a ľ b iff ai ě

bi for

i.

@

user prefers its own allocation to the allocation of any other
user. To achieve EF, we should ensure that each user cannot
increase its resource allocation by exchanging its allocation
with any other user.
Formally, let µip
be the resources in GFLOPS achieved
by user i under the vector Fi. Then EF is guaranteed for an
allocation policy if

Fiq

,

j

µip

µip

Fiqě
for any two users i, j
. Formula (2) is an indication
s
for EF that every user i works the best under its own resource
allocation vector compared to using all other users.

Fj q
p@
1, n

P r

s ^

P r

‰

q

q

p

1, n

j

.

2

i

C. Pareto Efﬁciency (PE)

Pareto efﬁciency (PE) is essential for allocation efﬁciency
and high resource utilization. An allocation policy is PE if
it is not feasible for a user to increase its resource allocation
without decreasing the resource allocation of at least one other
user. That is, there is no other feasible allocation for which at
least one user is strictly better off and all other users are at
least as well off.
Formally, let F

F1, F2, ..., Fny
be the allocation result
for n users generated by an allocation policy. The policy is
PE only when it is true that, for any feasible allocation ˜F
˜F1, ˜F2, ..., ˜Fny
µip
x
must exist a user j satisfying µjp

“
for some user i, there
µjp

Fiq
˜Fjqă

, if µip

˜Fiqą

.
Fjq

“ x

V. ELASTIC MULTI-RESOURCE FAIRNESS

In this section, we describe our resource allocation model
called Elastic Multi-Resource Fairness(EMRF), which is an
elastic fairness-efﬁciency model that can balance the tradeoff
between fairness and allocation efﬁciency ﬂexibly as needed.
We analyze EMRF and show that it meets all the desirable
properties (i.e., SI, EF, PE) shown in Section IV.

A. Allocation Model

We ﬁrst deﬁne some terms used in our model. The fair share
of a user is deﬁned as the resources (GFLOPS) it receives
if each of the resources is divided equally among all the
users. Let’s denote the fair share of user i by Si. Denote the
weight of user i in the CCGA as wi. Then the total amount
of CPU and GPU resources for user i after equal partition
are Ccpu ¨
, respectively. We can
compute fair share with the progressive ﬁlling method [15],
which increases all users’ shares at the same rate, until at
least one resource is saturated. That is, for user i, it must have
max

and Cgpu ¨

1. Hence,

1 wk

1 wk

wi

wi

n
k

n
k

ř

ř

,

“

“

Si¨
Ccpu¨

ξcpu
i
wi
1

n
k

t

wk

Si¨
Cgpu¨

ξgpu
i
wi
1

n
k

“

ř

Si “

max

wk u “
1

ř

“
ξcpu
i

t

Ccpu¨

wi
1

“

n
k

ř

and γgpu

i “

,

wk

ξgpu
i
Cgpu

Let γcpu

i “

above formula as

ξcpu
i
Ccpu

Cgpu¨

ξgpu
i

wi
1

“

n
k

ř

.

wk u

, then we can rewrite the

wi
q
max
Moreover, we call an allocation fair when the resources
1, n
in the shared CCGA is

received by each user i

γcpu
i
t

1 wk ¨

,γ gpu
i

Si “

n
k

ř

3

“

u

p

.

P r

s

proportional to its own fair share. That is, the fairness is
achieved if the following proposition is true,
Fi
Si “

Fj
Sj

1, n

i, j

P r

@

4

p

q

s

,

.

Let fi denote the share of dominant (bottleneck) resources
received by user i in the CCGA. The allocation shares in CPU
and GPU for user i are Fi¨
, respectively. By
deﬁnition, we have
Fi ¨
fi “

ξgpu
i
Cgpu u “

ξcpu
i
Ccpu

and Fi¨

ξcpu
i
Ccpu

ξcpu
i
Ccpu

γcpu
i
t

,γ gpu
i

Fi ¨

Fi ¨

max

max

.
u

5

t

p

q

,

According to Formula (3), we can deduce that,

i, j
Lemma 1.
and vice versa.

@

1, n

s

P r

, if Fi

Si “

Fj
Sj

, there must be fi

wi “

fj
wj

,

Proof: According to Formula (5),
Fj ¨

,γgpu
j

,γgpu
i

max

u

u

max

γcpu
j
t
wj

fi
wi “
Fi¨

n
k

fj
wj ô
wi
Si
wk ¨
1
“
wi

ř

“

ô

Fi¨
Fj ¨

γcpu
i
t
wi
wj
wk ¨

Sj

n
k

1
“
wj

“

Fi
Si “

Fj
Sj

.

ô

ř
By combining Formula (4) and Lemma 1, it provides us
a key information that achieving the fairness of the overall
resources for users in the CCGA is equivalent to guaranteeing
the fairness on their (weighted) dominant resource share.
Thus, the resource fairness problem can be converted to the
dominant resource fairness problem, which can be addressed
with Dominant Resource Fairness (DRF) [15] by ensuring that,

f1
w1 “

f2
w2 “ ¨ ¨ ¨ “

fn
wn

.

6

p

q

i

and F max
i

Formula (6) shows us that there is a proportional rela-
tionship between a user’s dominant share and its received
resources. Let f max
denote the maximum share of
dominant resource and the corresponding overall resource for
user i under the DRF allocation. With the progressive ﬁlling
approach, the allocation of DRF terminates only when there is
at least one resource saturated (e.g., CPU resource is saturated
in Figure 2(b)). In that case, we cannot further increase each
user’s dominant resource, i.e., the dominant resource share
and the overall resource are maximized for each user. We thus
have,

n

n

max

We can get F max

i

i.e.,

Fiγcpu
i

,

Fiγgpu
i

1.

t
1
i
ÿ
“
by resolving Fi with Formula (5) (6) (7),

1
i
ÿ
“

u “

p

q

7

F max
i

“

max

max

n
k

1

t

“
ř
1
γcpu
i
t

wi

wk γ
γ

cpu
k
cpu
k

,γ

t

gpu
k

,

u

n
k

1

“

max

,γ gpu
i

.

u

ř

wk γ
γ

gpu
k
cpu
k

,γ

t

gpu
k

max

¨

u u

8

p

q

However, DRF only seeks for 100% fairness in resource allo-
cation without considering its impact on resource utilization,
making its allocation efﬁciency tend to be poor. For example,
as illustrated in Figure 2(b), the resource utilization of GPU
device under DRF allocation is only 63%. On the contrary,
pursuing for high resource utilization could also result
in
poor fairness. Figure 2(c) shows an allocation of 100% high
resource utilization for both CPU and GPU devices, but its
fairness is much poor since the share of dominant resource

97.5% whereas for user 2 is only
for user 1 is 780
800
{
13.3
13.3%. It implies that there tends to be a tradeoff
between the fairness and allocation efﬁciency in multi-resource
allocation [20].

100
{

“

“

B. EMRF Allocation Policy

We propose a fairness policy called Elastic Multi-Resource
Fairness (EMRF) that allows users to ﬂexibly balance fairness
and allocation efﬁciency in multi-resource allocation. The
basic idea is that,
instead of strictly keeping fairness as
DRF does in multi-resource allocation, we trade fairness for
increasing allocation efﬁciency by allowing some degree of
unfairness. Here, we deﬁne two terms: hard fairness and soft
fairness. The hard fairness refers to that all users get equal
share in resource allocation, i.e., it requires that Formula (4)
must be strictly satisﬁed. In contrast, the soft fairness allows
some degree of δ
unfairness in resource allocation
among users. Formally, we deﬁne δ-fairness by modifying
Formula (4) as

δ
p

ě

0

q

Fi
Si ´

|

Fj
Sj |ď

i, j

δ,

@

1, n

.

s

P r

9

q

p

In summary, DRF returns the allocation of hard fairness,
whereas EMRF is aware of fairness-efﬁciency tradeoff and
considers soft fairness so as to leave some optimization space
for allocation efﬁciency.

Design of EMRF Policy. A tradeoff balancing allocation
can be viewed as a combination of fairness-oriented allocation
(i.e., purely for fairness guarantee) and efﬁciency-oriented al-
location (i.e., purely for efﬁciency optimization). In EMRF, we
provide a knob η
for users to control and balance
such two allocations ﬂexibly. The EMRF ﬁrst performs the
fairness-oriented allocation for soft fairness guarantee. After
that, it makes the efﬁciency-oriented allocation for efﬁciency
optimization with the remaining idle resources across users.

0
p

ď

ď

1

η

q

i

In the fairness-oriented allocation, instead of achieving the
, we guarantee the soft fairness of
η for each user i by using DRF. After the fairness-

hard fairness of F max
F max
i
oriented allocation, the system remains C1
gpuy
idle resources for the successive efﬁciency-oriented alloca-
ξcpu
1 F max
k η and C 1
Ccpu ´
tion, where C 1
gpu “
k
“
ξgpu
k η for users. Let F 1
Cgpu´
i denote the resource
ř
received by user i under the efﬁciency-oriented allocation.
ř
Then we have

cpu “
1 F max
k
“

cpu, C 1

“ x

C 1

n
k

n
k

Fi “

F max
i

η

F 1
i .

`

q
for each user i. The fairness-oriented allocation becomes
dominant (i.e., beneﬁt for fairness optimization) in EMRF
allocation when η is large. On the contrary, the small value of
η beneﬁts more for efﬁciency optimization.

p

In the following, we ﬁrst show that EMRF is a δ

-
q
fairness, determined by the knob η. Next we introduce the
efﬁciency-oriented allocation of EMRF.

δ
p

ě

0

Theorem 1. EMRF is a δ-fairness policy where

δ

max
i
1
ď
ď

nt

“

max

wi
1 wk ¨

“

n
k

ř

γcpu
i
t
max

,γ gpu
i
ξcpu
i
C1cpu

t

.

u

u
, ξgpu
C1gpu u

i

10

Proof: We start by soft fairness deﬁnition. For any two

users i, j

Fi
Si ´

|

Fj
Sj |ď

P r

1, n

,

s
max
Pr

i,j

1,n

@

“

max
Pr

i,j

1,n

@

Fi
Si ´

Fj
Sj |u

t|

s

F max
i

η
Si

p

t|

s

F 1
i q

`

p

´

F max
j

η

F 1
j q

`

|u

Sj
F max
j
Sj

@

i,j

“

1,n

t|p

max
Pr

F 1
i
Si ´

F 1
j
Sj q ` p
According to Formula (6) and Lemma 1, we have F max
F max
j
Sj

. Thus, we have

F max
i
Si ´

.
|u

η

q

i

s

Si “

11

q

p

@

i,j

1,n

max
Pr

Fi
Si ´

Fj
Sj |u “

F 1
j
.
Sj u
12
q
Now our proof turns to be ﬁnding an upper bound δ satisfying

F 1
j
Sj |u “

F 1
i
Si u´

F 1
i
Si ´

max
i
1
ď
ď

max
Pr

min
j
ď
ď

nt

nt

1,n

t|

t|

i,j

p

@

1

s

s

F 1
i
Si u ´

i
ď

nt
ď

min1

that max1
allocations given the idle resource vector of C1 .
ny
stops when at least one resource saturated, i.e.,

For any feasible allocation

2,
1, F 1

F 1
x

nt
ď

, F 1

¨ ¨ ¨

j
ď

F 1
j
Sj uď

δ for all feasible

, its allocation

max

i ξcpu

i

n
i

“

1 F 1
C1cpu

t

ř

,

i ξgpu

i

n
i

“

1 F 1
C1gpu

ř

1.

u “

13

p

q

Moreover, for all feasible allocations, the maximum value of
i for user i occurs when it exclusively possesses all the idle
F 1
resource C1. In that case, there is no resource allocation for
i. According to
, F 1
other users, i.e.,
Formula (13), we get the maximum value of F 1
i as follows

0 if j

j “

j
@

1, n

P r

‰

s

F 1max

i

1

{

“

max

ξcpu
i
C1cpu

,

ξgpu
i
.
C1gpu u

t

14

p

q

We now can get the upper bound δ for Formula (12) regarding
all feasible allocations in the case of Formula (14), i.e.,

δ

“

max
i
1
ď
ď

nt

“

max
i
1
ď
ď

nt

F 1max
i
Si

u

1

min
nt
j
ď
ď
γcpu
max
i
t
max

wk ¨

nt

F 1
j
max
Sj u “
1
i
ď
ď
,γ gpu
i
cpu
ξ
i
C1cpu

u
ξ
,
C1gpu u

gpu
i

t

.
u

F 1
i
Si u ´

wi
1

“

n
k

ř

Finally, according to Formula (11) (12), we have
and our proof completes.

Fi
Si ´

|

Fj
Sj |ď

δ

Theorem 1 shows an important relationship between the
knob η and the upper bound of unfairness degree δ for
EMRF. In practice, given a knob value η, we can estimate
its unfairness upper bound δ for EMRF. Reversely, given the
maximum unfairness degree δ, we can calculate the knob value
η.

Efﬁciency-Oriented Allocation. The efﬁciency-oriented allo-

¨¨¨

, F 1

F 1
x

2,
1, F 1

cation of EMRF is to ﬁnd a feasible allocation
ny
that maximizes the system utilization under the idle resource
vector of C1
. Moreover, for any two users i and j with the
ρj), switching
same CPU-to-GPU workload ratio (i.e., ρi “
resources between them has no impact on efﬁciency but
fairness. In order for better fairness, we still keep Formula (4)
ρj. It can be
hold for any two users i and j given that ρi “
modeled as a linear programming optimization problem with
n unknowns in its formulation representing the allocations of

n users below,
Efﬁciency Allocation Optimization.

n

Maximize

F 1
i .

1
i
ÿ
“

15

p

q

subject to:

n

i ξcpu
F 1

i ď

1
i
ÿ
“
F 1
i
Si “

F 1
j
Sj

.

C1

cpu,

n

1
i
ÿ
“

i ξgpu
F 1

i ď

C1

gpu.

16

p

q

ρi “

p

i, j

ρj @

P r

1, n

sq

17

q

p

Solving the linear program, we can get the optimal (largest)
value, denoted by F 1max, for the objective function of For-
mula (15), i.e., F 1max
1 F 1
i . Then the total resources or
“
n
“
1 Fi) achieved by all users can
allocation efﬁciency (i.e.,
i
be maximized according to Formula (10).

n
i

“

According to Theorem 1, we can now conclude that EMRF
is a knob-based elastic fairness-efﬁciency allocation policy that
can maximize the system utilization whereas guarantee the δ-
fairness, under the given knob η.

ř
ř

0.9
1 “
444.4, S2 “

Let’s now take a look at former Example 1 to see how
0.5. It has

800,γ cpu
2 “
{
125.0, F max
1
“
50, C 1
gpu “

EMRF policy works. Suppose the knob here is η
“
γcpu
100,γ gpu
100,γ gpu
0.4
0.1
2 “
1 “
{
{
470.5, F max
800, S1 “
0.6
2
“
{
132.4. We then have C 1
548.5 and δ
“
1.125. Therefore, we have the following efﬁciency allocation
2 subject to F 1
optimization problem: maximizing F 1
1 ¨
1 `
548.5. By solving
F 1
0.6
0.1
2 ¨
`
ď
ď
0. According
the linear program, it returns F 1
500, F 1
1 “
2 “
66.2, which
735.3 and F2 “
to Formula (10), we have F1 “
increases the GPU resource utilization of DRF from 63% to
88% at the expense of δ

50 and F 1
1 ¨

1.125-fairness.

cpu “

F 1
2 ¨

0.9

0.4

F 1

`

“

C. Scheduling System Implementation

By modeling the resource allocation problem as a linear
programming problem, we solve the problem and develop
a scheduling system. The linear program of Formula (15)
for allocation optimization can be solved by using traditional
optimization solvers. For efﬁciency,
this study uses GNU
Linear Programming Kit (GLPK) [3]. The ratios of these
allocations make up the weights to a weighted fair scheduler
(e.g., WFQ [13] and PRS [34]) that allocates resources based
on users’ weights.

At runtime, the allocations (i.e., the weights to the weighted
scheduler) for users need to be updated dynamically, being
adaptive to system changes. Likewise, if there is a signiﬁcant
change of CPU-to-GPU workload ratio for users’ workloads,
we should re-compute the allocations for users. Algorithm 1
gives the pseudo-code for our EMRF implementation. It
maintains and updates the system status periodically, including
the remaining idle resources, the number of active users (i.e.,
refers to those with running jobs in the system) and their
statistics of CPU-to-GPU workload ratios, etc (Line 1). Next,
it periodically compute the suitable allocations for users, as
the input of relative weights to the weighted fair scheduler,
by invoking the linear program optimization solver GLPK
(Line 2-3). Lastly, it allocates resources to users dynamically
according to their computed weights (Line 4-9). To enable

efﬁciently concurrent kernel execution across different appli-
cations at runtime in the CCGA, we adopt the kernel slicing
technique [42] in our scheduling system. It slices a kernel
of an application into multiple sub-kernels (namely slices)
and dynamically allocates resources to slices for different
applications. The slice size has balanced the overhead and
performance gains of slicing. For more details about slicing,
we refer the readers to the paper [42].

Algorithm 1 Implementation of Elastic Multi-Resource Fairness
(EMRF)
1: Maintain the statistics of CPU-to-GPU workload ratio for each user i over a pre-

conﬁgured time window ∆T .

2: Invoke the linear program optimization solver GLPK for efﬁcient allocation optimiza-
tion (Formula (15)) to compute allocations for users over window ∆T periodically,
according to Formula (10).

3: Use the computed allocations (denoted by F ˚i
weights for users in the following allocation.

for user i) in Line 2 as relative

4: Find user i with the lowest normalized resource share,

“
Resource allocation based on max-min heuristic.

i.e., Fi{

F ˚i

min1

n Fk{

F ˚k .

ď

k
ď
demand of user i’s next task.
Cgpu then

5: D
Ð
6: if Fi `
D
ď
7:
Fi `
Fi “
8: else
9:
System is full and the allocation stops.

Ccpu
D.

Ź

`

D. Analysis of Essential Properties

In this section, we start to analyze EMRF formally with the
three essential fair sharing properties (i.e., SI, EF, PE) listed in
F max
Section IV. We ﬁrst show that by conﬁguring η
,
i
each user under the EMRF allocation can receive at least the
amount of resources when using its own partition of resources
exclusively.

Si{

ě

Theorem 2. (Sharing Incentive): The EMRF allocation ob-
tained by solving Formula (15) and (10) is SI when η
.

Si
F max
i

ě

Proof: We start by specifying the vector Fi and Fi deﬁned

in Section IV-A as follows,
, Fiξgpu
i

Fiξcpu
i

Fi “ x

Fi “ x
According to Formula (10), we have

,
y

Siξcpu
i

, Siξgpu
i

.
y

Fi “ xp

F max
i

η

ξcpu
i

F 1
i q

,

F max
i
p

η

`

`

ξgpu
i

F 1
i q

y

Then,

F 1

F max
i

η

`

Fi “ xp

Fi ´
i ´
When η
, it holds
ξgpu
F max
Siq
η
i
i ě
`
p
our proof completes.

Si
F max
i
F 1

i ´

ě

,

η

F 1

ξcpu
i

F max
i
p

Siq
y
`
F max
0 and
Siq
i
p
0. We therefore have Fi ľ Fi and

i ´
ξcpu
i ě

Siq

i ´

ξgpu
i

F 1

`

η

Next we show that under the EMRF allocation, no user

envies other users’ allocations.

Theorem 3. (Envy-freeness): Every user under the EMRF
allocation prefers its own allocation to others.

Proof: Let’s start proof by contradiction to suppose that
user i envies user j under EMRF policy. Then there must be

µip

Fiqă

µip

Fj q

.

18

p

q

As preparation for the following proof, we ﬁrst deduce
the formula for µip
. Similar to the deduction of For-
Fjq
mula (3), we adopt
the progressive ﬁlling approach and
the allocation stops when one resource is saturated under
. Then there is
the resource vector of Fj “ x
y
, µip
max
u “

F cpu
, F gpu
j
j
1. Hence,

ξgpu
Fj q¨
i
F gpu
j

ξcpu
Fj q¨
i
F cpu
j

µip

t

Then there is
1 µip

n
i

“

n
i

“

Fiq
1 µip

“
ř
γgpu
i
n

γgpu
i
˜Fiq
max

ă
ř

ř

n
i

γcpu
i

1 µip
Fiq
. It gives us that,

ă

n
i

“

1 µip

˜Fiq

γcpu
i

and

ř

µip

˜Fiq

γcpu
i

t

µip

˜Fiq

γgpu
i

uą

1.

n

,

1
i
ÿ
“

i
1
ÿ
“
for allocation ˜F, which is not a feasible allocation and implies
that the premise is false. Hence, EMRF is pareto-efﬁcient.

VI. EVALUATION

We start with experimental setup by describing our comput-
ing platform and workloads. Next, we give the experimental
results for our approach.

19

p

q

µip

Fj q “

max

“

max

t

t

“

p
ρj `

p

1
cpu
i
cpu
j

ξ

F

,

ξ

F

gpu
i
gpu
j

u
1
ρj `
1
p
ρj Fj

q ¨
1

Fj

ρi
ρi`
1
p
ρi `
1
q

q
max

.

ρi
ρj

t

, 1

u

“

max

t

ρi
1
ρi`
p

q

F

1

,

cpu
j

1

1
ρi`
p

F

q

gpu
j

u

q

,

1
1
ρi`
p

q ¨

ρj `
1
p
Fj

q

u

according to Formula (17).

We consider the following three cases,
ρj : we have F 1
Si “
Fj
Sj

(I). ρi “

F 1
j
Sj

i

Si “

Fiq
µj p
Sj

Then there is Fi
according to Formula (10). By
switching the allocation between user i and j, there should be
µip
Fj q
according to the constraint of Formula (17).
Si “
Moreover, according to Formula (19), we have µip
Fj
Fjq “
Fi. We therefore have Fj
and µjp
. Then it
Fiq “
Fj
is true that Fi
Fi
Fj ñ
Si “
Sj
Si {
µip
µip
, which violates Formula (18) and shows that
Fjq
Fiq “
the assumption does not hold.
ρj: Formula (19) is equivalent to µip
(II). ρi ą
ρi`
Fj
1
p
ρi
1
ρj `
ρj “
p
µjp
Fi. Then after exchanging the allocation between
Fj, violating the
µjp
user i and j, we have µip
Fiqă
utilization/efﬁciency maximization requirement in Section V-B
and therefore the assumption is not true.

Fjq “
Fj. Similarly, we can deduce that

. It shows that Fi “

ρiρj `
ρiρj `

Fjq`

Fj ă

Fiqă

Fi `

Fj
Sj {

ρj
ρi ¨

Si “

Fi
Sj

q
q

p

p

ρj: we can equally transform Formula (19) to
(III). ρi ă
Fj
ρi`
1
Fj. Likewise, we can get µjp
µip
Fiq “
Fjq “
q
1
ρj `
q ă
p
Fi
1
ρj `
Fi. If swapping the allocation between user i and
q
1
ρi`
q ă
p
j, there will be µip
Fj, which violates the
Fi `
µjp
Fiqă
utilization/efﬁciency maximization requirement and therefore
the assumption does not hold.

Fjq `

Based on the analysis of the above three cases, we conclude

that EMRF policy is envy-freeness.

Moreover, we show that the allocation of EMRF is efﬁ-
cient, making that no user can improve its allocation without
decreasing that of other users.

Theorem 4. (Pareto Efﬁciency): The allocation of EMRF is
pareto efﬁcient.

¨ ¨ ¨

F1, F2,

Proof: By contradiction, let’s suppose that the alloca-
under the EMRF policy is not

, Fny
satisfying that µip
µjp
Fjq

tion F
“ x
pareto efﬁcient, i.e., it must exist a feasible allocation ˜F
“
˜F1, ˜F2, ..., ˜Fny
for all user i,
µip
x
˜Fjqą
for some user j. Recall in Section V-A,
and µjp
our EMRF policy follows the progressive ﬁlling approach and
the allocation stops when one resource is fulﬁlled. That is, for
allocation F, we have

˜Fiqě

Fiq

max

n

t

1
i
ÿ
“

µip

Fiq

γcpu
i

n

,

1
i
ÿ
“

µip

Fiq

γgpu
i

1.

u “

A. Experimental Setup

We conduct a testbed experiment

in a Linux machine
consisting of an AMD A8-3870K APU, with its speciﬁcation
detailed in Table I. The machine has 8 GB DRAM, and its OS
is Ubuntu 15.10. For the experimental workload, we consider
three types of application programs from Rodinia benchmarks
suite [41], and follow the previous study on categorizing co-
run computation on APU: 1). co-run friendly program (refer-
ring to the program that achieves the best performance when
using both CPU and GPU devices together to deal with the
application), including Gaussian Elimination (GE), K-means
(KM) and Heart Wall (HW); 2). CPU-dominant program
(referring to the program that achieves the best performance
when all its workload runs on CPU), including Myocyte (MY)
and k-Nearest Neighbors (KNN); 3). GPU-dominant program
(referring to the program that gets the best performance when
all its workload runs on GPU), including B+Tree (BT), CFD
Solver (CFD) and LU Decomposition (LUD). The detailed
descriptions of them are presented in Table III. Based on the
benchmarks in Table III, we generate a set of workloads, as
shown in Table II, for the following experimental evaluation.

Platform

# Cores
Clock Frequency(MHz)
Peak FLOPS (GFLOPS)
Zero copy buffer (MB)
Cache size(MB)

A8-3870K

CPU

GPU

400
4
600
800
24
480
512 (shared)
4 (shared)

TABLE I: The conﬁguration of testbed platform.

Workloads

Applications

M1

M2
M3
M4
M5

GE, KM, HW, MY, BT

GE, KM
HW, MY
KM, BT
KNN, CFD

Workload Category
Co-run friendly + GPU-dominant
+ CPU-dominant
Co-run friendly + Co-run friendly
Co-run friendly + CPU-dominant
Co-run friendly + GPU-dominant
CPU-dominant + GPU-dominant

TABLE II: A set of different workloads generated from Rodinia
benchmarks listed in Table III.

B. Experiment Results

We start by evaluating EMRF in a testbed Linux system,
and compare its performance with WFQ (Weighted Fair Queu-
ing) [13] and DRF [15]. Next we show the system efﬁciency
and soft fairness results for EMRF under different knobs.

Applications

Gaussian Elimination (GE)

K-means (KM)

Heart Wall (HW)

Myocyte (MY)

k-Nearest Neighbors (KNN)

B+Tree (BT)

CFD Solver (CFD)

LU Decomposition (LUD)

Description

ˆ

4096.

A classic algorithm used to solve systems of linear equations with a sequence of operations made on the associated matrix of
coefﬁcients [2]. We consider a matrix size of 4096
A popular clustering algorithm in data mining. It identiﬁes related data points by associating each data point with its nearest
cluster, computing new cluster centroids, and iterating until convergence. We take KDD CUP dataset [5] as its input data.
It tracks the movement of a mouse heart over a sequence of ultrasound images to record response to the stimulus [27]. The
number of frame is set to 20.
A biology simulator that models cardiac myocyte (heart muscle cell) and simulates its behavior. It can identify potential
therapeutic targets which may be useful for the treatment of heart failure [27]. In our experiment, we set its simulation time to
be 2000.
A non-parametric lazy learning algorithm used for classiﬁcation and regression. It ﬁnds the k-nearest neighbors from an
unstructured data set by calculating the Euclidean distance from the target latitude and longitude, and evaluating the k nearest
neighbors iteratively. We synthesize an input data with 5000 records using its provided tool.
An n-ary tree data structure often used in the implementation of database indexes. We use the mil data set [6] as its input data.
an unstructured grid ﬁnite volume solver for the three-dimensional Euler equations for compressible ﬂuid ﬂow [9]. The data
set fvcorr.domn.097K [1] is taken as input in our experiment.
A method to calculate the solutions of a set of linear equations by factoring a matrix as the product of a lower triangular matrix
and an upper triangular matrix. We consider a matrix of 2048

2048.

ˆ

Category

Co-run friendly

Co-run friendly

Co-run friendly

CPU-dominant

CPU-dominant

GPU-dominant

GPU-dominant

GPU-dominant

TABLE III: The description of Rodinia benchmarks used in the paper (categorized according to [41]).

Finally, we evaluate various policies under different numbers
of users.

benchmark BT and ξcpu
program benchmark MY.

i

“

100% for the CPU dominant

1

(
=
/
&
6
<
(
&
;
:
9
"
1
2
#
/
&
8
7

(

?;

>;

=;

<;

/;

.;

;

;

.;

/;

<;

>;
>.5/21"9("?(3".4%"5’(?".(!)*(@&A1/&(<B=(

@;

A;

=;

?;

B;

.;;

Fig. 3: The execution time for the HW benchmark under different
workload distributions.

“

1) Throughput and System Efﬁciency: Recall

in Sec-
tion VI-A, there are three types of application programs. In
this section, we conduct two sets of experiments to evaluate
our approach. One set is to mix ﬁve representative benchmarks
(e.g., GE, KM, HW, MY, BT) from Table III. The other set is to
study all possible combinations of co-run computation on the
shared environment (i.e., Co-run friendly program vs Co-run
friendly program, Co-run friendly program vs CPU dominant
program, Co-run friendly program vs GPU dominant program,
and CPU dominant program vs GPU dominant program). The
knob of EMRF policy is conﬁgured to η

0.1.

Mixed Benchmarks Evaluation. This experiment employs
M1 from Table II for ﬁve users with different weighted shares
(i.e., 2 : 1 : 3 : 4 : 1) in the APU system, each submitting
a distinct benchmark (e.g., GE, KM, HW, MY, BT). Each
benchmark does the computation in the co-run execution
manner, i.e., some portion of its workload running on CPU and
others on the GPU. Different ratios of workload distribution
between CPU and GPU devices can have a signiﬁcant impact
on the performance of an application. For example, as shown
in Figure 3, the execution time for HW benchmark is varying
under different workload distributions. There tends to be a
suitable workload distribution for an application, which in fact
has also been explored and discussed by existing work [41]. In
our experiment, for co-run friendly program benchmarks GE,
KM and HW, their suitable ratios ξcpu
of workload distribution
on the CPU device are 21%, 7% and 24%, respectively.
Moreover, we set ξcpu
0% for the GPU-dominant program

i

i “

Figure 4(a) shows the throughput results (normalized to
WFQ) for different allocation policies. The system throughput
(i.e., the aggregated throughput of ﬁve benchmarks) of WFQ is
the lowest (worst) of the three allocation policies. The problem
is that, the WFQ throttles the GPU-bounded applications (e.g.,
KM, BT) severely, resulting in a poor GPU utilization of only
28% shown in Figure 4(d). This is because that the capacity
of CPU is much smaller than that of GPU. In order to achieve
the strict 2 : 1 : 3 : 4 : 1 fairness allocation ratio across ﬁve
benchmarks, WFQ lets CPU-bounded workloads (i.e., MY)
possess much larger amount of CPU throughput (87%) than
GPU-bounded workloads (i.e., KM), as shown in Figure 4(c).
It causes the allocation of GPU-bounded workloads to be
throttled on the CPU device, making it unable to maximally
utilize the GPU device and thereby resulting in the low
utilization for GPU device as illustrated in Figure 4(d).

DRF performs much better than WFQ (i.e., as high as 41%
GPU utilization of DRF in Figure 4(c)). It guarantees that
the dominant (weighted) fair shares are equal across different
benchmarks.

EMRF performs the best. It improves the system throughput
signiﬁcantly by adjusting the allocation weight across ﬁve
benchmarks so that the GPU device is maximally utilized, as
high as 75% GPU utilization for EMRF shown in Figure 4(d).
Moreover, Figure 4(b) gives the speedup result for each policy
relative to WFQ, i.e., the speedup is deﬁned as the ratio of the
execution time of WFQ to that of the corresponding policy. It
shows that EMRF achieves the best performance result among
the three scheduling policies, all of which are attributed to the
dynamic resource allocation mechanism of EMRF.

We study the resource utilization of each device in more
depth. Figure 5 shows the utilizations of CPU and GPU
for ﬁve benchmarks under EMRF policy over time. Initially,
there are ﬁve benchmarks executed concurrently on the APU
device under the EMRF scheduling policy until BT completes
(Figure 5(b)) at the 19th second. In that case, EMRF adjusts
the allocation among the remaining four active benchmarks so
that the released CPU and GPU resources are possessed. At the
38th second, MY ﬁnishes (Figure 5(a)) and likewise, EMRF

(
2
#
$
0
G
#
"
.
0
:
;
&
2
6
F
E
’
&
D
1
%

(

(

5
;
.
"
C

4H

I5 JD 5K

LM

.CA

.C?

.C=

.C/

.

;CA

;C?

;C=

;C/

;

(

$
#
’
&
&
$
E

<

/C>

/

.C>

.

;C>

;

.;;N

4H

I5 JD 5K

LM

(

9
"
1
2
5
D
1
%
1
2
*
*
)
!

(

A;N

?;N

=;N

/;N

;N

4H

I5 JD 5K

LM

(

9
"
1
2
5
D
1
%
1
2
*
*
)
,

(

A;N

@;N

?;N

>;N

=;N

<;N

/;N

.;N

;N

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

(a) System Throughput.
Fig. 4: The experimental results for ﬁve users running different benchmarks in a shared APU machine under different fair allocation policies.
For the EMRF policy, its knob value is conﬁgured to be 0.1.

(b) Speedup (relative to WFQ).

(c) Average CPU Utilizations.

(d) Average GPU Utilizations.

(

9
"
1
2
5
D
1
%
1
2
*
*
)
!

(

4H

I5 JD 5K

LM

.;;N
B;N
A;N
@;N
?;N
>;N
=;N
<;N
/;N
.;N
;N

4H

I5 JD 5K

LM

(

9
"
1
2
5
D
1
%
1
2
*
*
)
,

(

B;N

A;N

@;N

?;N

>;N

=;N

<;N

/;N

.;N

;N

. = @ .;.<.?.B///>/A<.<=<@=;=<=?=B>/>>>A
:1;&(<6&/=(

. = @ .; .< .? .B // /> /A <. <= <@ =; =< =? =B >/ >> >A
:1;&(<6&/=(

(a) CPU utilization.

(b) GPU utilization.

Fig. 5: Stacked chart showing the resource utilization for ﬁve
benchmarks over time under EMRF policy.

scheduler adjusts the resource allocations among GE,KM and
HW. The whole dynamic allocation repeats until all bench-
marks complete.

Different Co-run Combinations. As illustrated in Figure 6,
we further extend our experiment to consider all possible
combinations of different types of application programs by
considering M2, M3, M4 and M5 from Table II, respectively.
Figure 6(a) gives the throughput results of two co-run friendly
program benchmarks GE and KM with equal share under
different allocation policies, which are normalized over that
of WFQ. It shows that EMRF achieves better results than
others, since it is able to adjust the allocations between co-run
friendly programs so as to maximize the system utilization.
Figures 6(b) shows the results of the co-run friendly program
(e.g., HW) sharing with the CPU-dominant program (e.g.,
MY), whereas Figure 6(c) gives the results of the co-run
friendly program (e.g., KM) and the GPU-dominant program
(e.g., BT). In these two cases, our EMRF achieves the best
performance results among the three scheduling policies. Com-
pared to the WFQ and DRF that consider the fairness only,
EMRF additionally considers the efﬁciency with the attempt
to maximize both CPU and GPU utilization in these two cases.
Finally, Figure 6(d) gives the sharing case of CPU-dominant
program (e.g., KNN) and GPU-dominant program (e.g., CFD).
In this case, WFQ performs the worst, since it constrains the
GPU allocation for GPU-dominant program BT in order to
strictly keep the same allocation as that of CPU-dominant
program KNN. However, DRF and EMRF achieves the same
better performance, since in this case they both can allow
KNN and CFD to freely possess CPU and GPU resources
respectively without constraints.

2) EMRF Results Under Different Knobs: EMRF is a knob-
based elastic allocation policy that can balance fairness and

efﬁciency ﬂexibly. In this section, we show the impacts of
different knob conﬁgurations on the system efﬁciency and
fairness with the mix of all ﬁve workloads. Note in Sec-
tion V-B that EMRF is to maximize the system efﬁciency
while guaranteeing the soft fairness. Here we deﬁne a term
soft fairness degree to quantify the soft fairness. The smaller
value of soft fairness degree indicates the better fairness result.
Figure 7 shows the normalized results of throughput (rel-
ative to that when knob is 1) and soft fairness for EMRF
with different knobs. It favors the throughput (or efﬁciency)
but worsens the fairness (i.e., the soft fairness degree is large)
when knob value is very small. In contrast, as we increase
the knob value, the fairness can be better at the expense
of efﬁciency. It indicates that, by controlling such a knob,
users can ﬂexibly balance the tradeoff between fairness and
efﬁciency with our EMRF.

3) Evaluation on Different Numbers of Users: This section
evaluates the throughput under different numbers of users.
Figure 8 presents the experimental results for different poli-
cies. Particularly, we consider three EMRF policy instances
by varying the knob values, namely, EMRF-0.8, EMRF-0.5,
and EMRF-0.1, under different knob settings of 0.8, 0.5 and
0.1, respectively. We have the following observations. First,
for each allocation policy, there is a decreasing trend for
its throughput curve as more users join in the system. The
reason is that, the resource competition and fairness constraint
become more serious as we increase the number of users, lead-
ing to lower resource utilization. Second, DRF outperforms
WFQ, whereas EMRF is better than DRF. Typically, as we
decrease the knob, EMRF achieves much better throughput
results in all users cases. Third, by comparing EMRF with
the throughput curve
it shows that
different knob values,
becomes increasingly stable as the knob becomes smaller.
This is because that smaller knob value leads to more room
or freedom for efﬁciency optimization in all users cases.
Moreover, as discussed previously in Section VI-B2, DRF is
indeed a special case of EMRF given that its knob value is
one, explaining why the curve of DRF drops fast compared to
the three EMRF policy instances.

VII. RELATED WORK
Heterogeneous Computing Schedulers. There are a num-
ber of studies on task scheduling in heterogeneous computing.
Wang et al. [38] proposed a ﬁne-grained fair sharing scheduler
named Simultaneous Multikernel (SMK), which can increase

(

(
2
#
$
0
G
#
"
.
0
:
;
&
2
6
F
E
’
&
D
1
%

(

5
;
.
"
C

4H

I5

.CA
.C?
.C=
.C/
.
;CA
;C?
;C=
;C/
;

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

(

(
2
#
$
0
G
#
"
.
0
:
;
&
2
6
F
E
’
&
D
1
%

(

5
;
.
"
C

JD 5K

.CA
.C?
.C=
.C/
.
;CA
;C?
;C=
;C/
;

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

(

(
2
#
$
0
G
#
"
.
0
:
;
&
2
6
F
E
’
&
D
1
%

(

5
;
.
"
C

I5 LM

.C?

.C=

.C/

.

;CA

;C?

;C=

;C/

;

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

(

(
2
#
$
0
G
#
"
.
0
:
;
&
2
6
F
E
’
&
D
1
%

(

5
;
.
"
C

IOO

!EF

<

/C>

/

.C>

.

;C>

;

DE3

FGE
-%%"/521"9()"%1/F(

H5GE

(a) Co-run friendly program vs Co-
run friendly program.

(b) Co-run friendly program vs CPU
dominant program.

(c) Co-run friendly program vs GPU
dominant program.

(d) CPU dominant program vs GPU
dominant program.

Fig. 6: The normalized throughput results for four possible combinations of co-run programs under different allocation policies. We normalize
them over that of WFQ. We conﬁgure the knob value of EMRF policy to be 0.1.

(
2
#
$
0
G
#
"
.
0
:
;
&
2
6
F
E
’
&
D
1
%

(

(

5
;
.
"
C

DE3

FGE

H5GET;CA

H5GET;C>

H5GET;C.

.C?

.C=

.C/

.

;CA

;C?

;C=

;C/

%:-P(9$M’,1*Q’R*P

%1SP$E67,8(--

=

<C>

<

/C>

/

.C>

.

;C>

;

(

&
&
.
G
&
@
(
6
6
&
9
.
1
5
>
(
2
?
"
E

/;

(
(
2
#
$
0
G
#
"
.
0
:
;
&
2
6
F
E

(

.

>
=C>
=
<C>
<
/C>
/
.C>
.
;C>

;

;C. ;C/ ;C< ;C= ;C> ;C? ;C@ ;CA ;CB
H9"I(

.

/

<

=

>
J("?(*6&.6(

?

@

A

Fig. 7: The system efﬁciency and
soft fairness for EMRF under dif-
ferent knobs.

Fig. 8: The throughput results for
different allocation policies under
different numbers of users.

resource utilization while maintaining the resource fairness
among kernels by scheduling kernels from different applica-
tions dynamically. Observing that GPU memory is a critical
performance factor for applications, Jog et al. [21] proposed a
First-ready Round-robin FCFS (FR-RR-FCFS) memory sched-
uler to improve both fairness and system performance for
concurrent GPGPU applications. Aguilera et al. [7] examined
several different ways to characterize “fairness” for GPU
spatial multitasking, by balancing individual application’s per-
formance and overall system performance. Zhang et al. [41]
had a performance study of scheduling tasks of an applica-
tion to both CPU and GPU simultaneously by developing
a benchmark suite called Rodinia. Moreover, there are also
some optimization studies on the performance improvement
for speciﬁc applications, frameworks or algorithms on hetero-
geneous platforms, including [11], [17], [18]. To summarize,
all of these existing studies focus on performance and fairness
optimization for either CPU only or GPU only. However, there
is no work that systematically studies the tradeoff between
the performance and fairness in heterogeneous computing.
Our proposed EMRF scheduler can address it, since it is an
elastic tradeoff scheduler that can balance the performance and
fairness ﬂexibly for users via combining CPU and GPU as a
whole.

Multi-Resource Fairness. In cluster computing, DRF is
the most popular fair policy in the literature for multi-
resource allocation [15], [36], which achieves fair allocation
of multiple resources on the basis of dominant shares. The
attractiveness of DRF stems from its good properties including
sharing incentive, envy freeness, and pareto efﬁciency. It has
been implemented in many computing frameworks, such as
YARN [32] and Mesos [19]. Subsequently, there have been a
lot of extensions and generalizations for DRF. Wang et al. [36]

extended DRF to a heterogeneous distributed system consist-
ing of a number of heterogeneous machines. Kash et al. [22]
extended the DRF model to a dynamic setting where users can
join the system over time but will never leave. Bhattacharya
et al. [8] generalized DRF to support hierarchical scheduling.
Liu et al. [23] relaxed DRF policy by proposing a Reciprocal
Resource Fairness to allow the trade among different types
of resources between users. Dolev et al. [14] proposed an
alternative to DRF by considering the global system bottleneck
resource. Parkes et al. [25] proposed several schemes to extend
DRF, and particularly focused on the case of indivisible tasks.
Considering that the resource demand vector required by DRF
is hard to get in computer architectures, Zahedi et al. [40]
proposed an alternative multi-resource policy based on Cobb-
Douglas utility function for multiprocessors. Wang et al. [35]
considered the multi-tiered storage consisting of SSD and
HDD and proposed a bottleneck-aware allocation policy to
balance fairness and efﬁciency for users. In comparison with
the previous studies, we consider CCGA and focus on the
tradeoff balancing between the multi-resource fairness and
efﬁciency by proposing an EMRF policy. It extends the DRF
policy for CCGA to allow users to ﬂexibly tune and balance
the tradeoff with a knob.

VIII. CONCLUSION AND FUTURE WORK
Heterogeneity is a trend in achieving energy-efﬁcient com-
puting. By removing PCI-e bus, coupled CPU-GPU archi-
tectures have demonstrate promising results in various ap-
plications. Still, fairness in sharing the CPU and the GPU
on such architectures is an open problem. In this paper, we
show for coupled CPU-GPU architectures that, it is essential
to consider both CPU and GPU as a whole in fair resource
allocation rather than separately for each computing device as
previous studies did. This is because both CPU and GPU are
computing devices and used for computation simultaneously in
heterogeneous computing. To the best of our knowledge, this is
ﬁrst work that combines CPU and GPU devices as a whole in
fair resource allocation for coupled CPU-GPU architectures.
We cast the heterogeneous allocation problem to the multi-
resource fairness allocation problem and consider the tradeoff
between fairness and efﬁciency. We ﬁnd that the approaches
proposed by previous studies are heuristics, which cannot truly
tell and guarantee the QoS of δ-fairness mentioned in this
paper. We propose an elastic multi-resource fairness (EMRF)

to address it. It can allow users to ﬂexibly balance fairness
and efﬁciency using a knob while guaranteeing δ-fairness (See
Theorem 1 in Section V-B). We also show that it satisﬁes
several desirable properties including sharing incentive, envy
freeness and pareto efﬁciency. We evaluate our method with
real experiments, showing that our approach can achieve high
efﬁciency and fairness.

ACKNOWLEDGEMENT

We thank the anonymous reviewers for their constructive
comments. This work is in supported by National Natural
Science Foundation of China (No.61303021). Bingsheng He’s
work is partially supported by an NUS startup grant
in
Singapore. Shuhao Zhang’s work is partially funded by the
Economic Development Board and the National Research
Foundation of Singapore.

REFERENCES

[1] Fvcorr.domn.097k dataset. In https://github.com/kkushagra/rodinia

/tree/master/data/cfd.

[2] Gaussian elimination. In https://en.wikipedia.org/wiki/Gaussian

elimination.

[3] Gnu linear programming kit (glpk). In https://www.gnu.org/

software/glpk/.

[4] Heterogeneous system architecture. In https://en.wikipedia.

org/wiki/Heterogeneous System Architecture.

[5] The kdd cup datasets. In http://www.cs.cornell.edu/projects/kddcup/

datasets.html.

[6] Mil dataset for b+ tree. In https://github.com/kkushagra/rodinia/tree/

master/data/b+tree.

[7] P. Aguilera, K. Morrow, and N. S. Kim. Fair share: Allocation of gpu
resources for both performance and fairness. In ICCD’14, pages 440–
447, Oct 2014.

[8] A. A. Bhattacharya, D. Culler, E. Friedman, A. Ghodsi, S. Shenker, and
I. Stoica. Hierarchical scheduling for diverse datacenter workloads. In
SOCC’13, pages 4:1–4:15, New York, NY, USA, 2013. ACM.

[9] J. Blazek. Computational ﬂuid dynamics: principles and applications.

Butterworth-Heinemann, 2015.

[10] A. Branover, D. Foley, and M. Steinman. Amd fusion apu: Llano. IEEE

Micro, 32(2):28–37, Mar. 2012.

[11] L. Chen, X. Huo, and G. Agrawal. Accelerating mapreduce on a coupled
cpu-gpu architecture. In SC’12, pages 25:1–25:11, Los Alamitos, CA,
USA, 2012. IEEE Computer Society Press.

[12] S. Damaraju, V. George, S. Jahagirdar, T. Khondker, R. Milstrey,
S. Sarkar, S. Siers, I. Stolero, and A. Subbiah. A 22nm ia multi-cpu
and gpu system-on-chip. In ISSCC’12, pages 56–57, Feb 2012.
[13] A. Demers, S. Keshav, and S. Shenker. Analysis and simulation of a
fair queueing algorithm. In SIGCOMM’89, pages 1–12, New York, NY,
USA, 1989. ACM.

[14] D. Dolev, D. G. Feitelson, J. Y. Halpern, R. Kupferman, and N. Linial.
No justiﬁed complaints: On fair sharing of multiple resources.
In
ITCS’12, pages 68–75, New York, NY, USA, 2012. ACM.

[15] A. Ghodsi, M. Zaharia, B. Hindman, A. Konwinski, S. Shenker, and
I. Stoica. Dominant resource fairness: Fair allocation of multiple
resource types. In NSDI’11, pages 323–336, Berkeley, CA, USA, 2011.
USENIX Association.

[16] K. O. W. Group et al. The opencl speciﬁcation, version 1.2, 15 november

2011. Cited on pages, 18(7):30.

[17] J. He, M. Lu, and B. He. Revisiting co-processing for hash joins on
the coupled cpu-gpu architecture. Proc. VLDB Endow., 6(10):889–900,
Aug. 2013.

[18] J. He, S. Zhang, and B. He. In-cache query co-processing on coupled
cpu-gpu architectures. Proc. VLDB Endow., 8(4):329–340, Dec. 2014.
[19] B. Hindman, A. Konwinski, M. Zaharia, A. Ghodsi, A. D. Joseph,
R. Katz, S. Shenker, and I. Stoica. Mesos: A platform for ﬁne-
grained resource sharing in the data center. In NSDI’11, pages 295–308,
Berkeley, CA, USA, 2011. USENIX Association.

[20] C. Joe-Wong, S. Sen, T. Lan, and M. Chiang. Multiresource allocation:
Fairness-efﬁciency tradeoffs in a unifying framework. IEEE/ACM Trans.
Netw., 21(6):1785–1798, Dec. 2013.

[21] A. Jog, E. Bolotin, Z. Guz, M. Parker, S. W. Keckler, M. T. Kandemir,
and C. R. Das. Application-aware memory system for fair and efﬁcient
execution of concurrent gpgpu applications. In GPGPU-7, pages 1:1–
1:8, New York, NY, USA, 2014. ACM.

[22] I. Kash, A. D. Procaccia, and N. Shah. No agent left behind: Dynamic
In AAMAS’13, pages 351–358,
fair division of multiple resources.
Richland, SC, 2013. International Foundation for Autonomous Agents
and Multiagent Systems.

[23] H. Liu and B. He. Reciprocal resource fairness: Towards cooperative
multiple-resource fair sharing in iaas clouds. In SC’14, pages 970–981,
Piscataway, NJ, USA, 2014. IEEE Press.

[24] S. Mittal and J. S. Vetter. A survey of cpu-gpu heterogeneous computing

techniques. ACM Comput. Surv., 47(4):69:1–69:35, July 2015.

[25] D. C. Parkes, A. D. Procaccia, and N. Shah. Beyond dominant resource
fairness: Extensions, limitations, and indivisibilities. ACM Trans. Econ.
Comput., 3(1):3:1–3:22, Mar. 2015.

[26] V. T. Ravi, M. Becchi, G. Agrawal, and S. Chakradhar. Supporting gpu
sharing in cloud environments with a transparent runtime consolidation
framework. In HPDC’11, pages 217–228, New York, NY, USA, 2011.
ACM.

[27] L. G. Szafaryn, K. Skadron, and J. J. Saucerman. Experiences accel-
In Proceedings of the
erating matlab systems biology applications.
Workshop on Biomedicine in Computing: Systems, Architectures, and
Circuits, pages 1–4. Citeseer, 2009.

[28] S. Tang, B. S. Lee, and B. He. Towards economic fairness for big data
processing in pay-as-you-go cloud computing. In CloudCom’14, pages
638–643, Dec 2014.

[29] S. Tang, B. S. Lee, and B. He. Fair resource allocation for data-intensive
IEEE Transactions on Services Computing,

computing in the cloud.
PP(99):1–1, 2016.

[30] S. Tang, B.-s. Lee, B. He, and H. Liu. Long-term resource fairness:
Towards economic fairness on pay-as-you-use computing systems.
In
ICS’14, pages 251–260, New York, NY, USA, 2014. ACM.

[31] R. Ubal, B. Jang, P. Mistry, D. Schaa, and D. Kaeli. Multi2sim: A
simulation framework for cpu-gpu computing. In PACT’12, pages 335–
344, New York, NY, USA, 2012. ACM.

[32] V. K. Vavilapalli, A. C. Murthy, C. Douglas, S. Agarwal, M. Konar,
R. Evans, T. Graves, J. Lowe, H. Shah, S. Seth, B. Saha, C. Curino,
O. O’Malley, S. Radia, B. Reed, and E. Baldeschwieler. Apache hadoop
yarn: Yet another resource negotiator. In SOCC’13, pages 5:1–5:16, New
York, NY, USA, 2013. ACM.

[33] C. A. Waldspurger. Lottery and stride scheduling: Flexible proportional-
share resource management. Technical report, Cambridge, MA, USA,
1995.

[34] C. A. Waldspurger and W. E. Weihl. Lottery scheduling: Flexible
In OSDI’94, Berkeley, CA,

proportional-share resource management.
USA, 1994. USENIX Association.

[35] H. Wang and P. Varman. Balancing fairness and efﬁciency in tiered
In FAST’14, pages

storage systems with bottleneck-aware allocation.
229–242, Berkeley, CA, USA, 2014. USENIX Association.

[36] W. Wang, B. Li, and B. Liang. Dominant resource fairness in cloud
computing systems with heterogeneous servers. In INFOCOM’14, pages
583–591, April 2014.

[37] Y. Wang and A. Merchant. Proportional-share scheduling for distributed
In FAST’07, pages 4–4, Berkeley, CA, USA, 2007.

storage systems.
USENIX Association.

[38] Z. Wang, J. Yang, R. Melhem, B. Childers, Y. Zhang, and M. Guo.
Simultaneous multikernel: Fine-grained sharing of gpgpus. Computer
Architecture Letters, PP(99):1–1, 2015.

[39] M. Yuffe, E. Knoll, M. Mehalel, J. Shor, and T. Kurts. A fully integrated
multi-cpu, gpu and memory controller 32nm processor. In ISSCC’11,
pages 264–266, Feb 2011.

[40] S. M. Zahedi and B. C. Lee. Ref: Resource elasticity fairness with
sharing incentives for multiprocessors. In ASPLOS’14, pages 145–160,
New York, NY, USA, 2014. ACM.

[41] F. Zhang, J. Zhai, W. Chen, B. He, and S. Zhang. To co-run, or not to co-
run: A performance study on integrated architectures. In MASCOTS’15,
pages 89–92, Oct 2015.

[42] J. Zhong and B. He. Kernelet: High-throughput gpu kernel executions
with dynamic slicing and scheduling. IEEE Trans. Parallel Distrib. Syst.,
25(6):1522–1532, June 2014.

