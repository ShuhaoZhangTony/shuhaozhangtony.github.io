Select Edges Wisely: Monotonic Path Aware Graph Layout
Optimization for Disk-based ANN Search

Ziyang Yue
Huazhong University of Science and
Technology

Bolong Zheng∗
Huazhong University of Science and
Technology

Ling Xu
Shuyi Technology

Kanru Xu
Shuyi Technology

Shuhao Zhang
Huazhong University of Science and
Technology

Yajuan Du
Wuhan University of Technology

Yunjun Gao
Zhejiang University

Xiaofang Zhou
HKUST

Christian S. Jensen
Aalborg University

ABSTRACT
Approximate nearest neighbor (ANN) search is a critical problem
in various real-world applications. However, as one of the most
promising solutions to ANN search, graph-based indexes often
suffer from high memory consumption. Although a few studies at-
tempt to alleviate this issue by storing the index on inexpensive disk
storage, they still face challenges such as insufficient data locality
and low efficiency when optimizing the graph layout on disk. There-
fore, we propose MARGO, a monotonic path-aware graph layout
optimization method for disk-based ANN search. First, we present
the essence of graph layout optimization in disk-based ANN search,
and design a monotonic path-aware objective function that weighs
the edges based on their importance in monotonic paths, supported
by rigorous theoretical analysis. Second, we propose a greedy al-
gorithm that prioritizes high-weight edges to accommodate more
monotonic paths. To enhance efficiency, MARGO introduces a two
stage decoupling method that processes intra-cluster edges in paral-
lel first, followed by inter-cluster edges. Third, we develop a weight
computation strategy that computes edge weights on-the-fly during
index construction with almost no additional overhead. A compre-
hensive experimental study demonstrates that MARGO improves
search efficiency by up to 26.6% while maintaining the same recall,
and accelerates the graph layout optimization by up to 5.5×.

PVLDB Reference Format:
Ziyang Yue, Bolong Zheng, Ling Xu, Kanru Xu, Shuhao Zhang, Yajuan Du,
Yunjun Gao, Xiaofang Zhou, and Christian S. Jensen. Select Edges Wisely:
Monotonic Path Aware Graph Layout Optimization for Disk-based ANN
Search. PVLDB, 18(11): 4337 - 4349, 2025.
doi:10.14778/3749646.3749697

PVLDB Artifact Availability:
The source code, data, and/or other artifacts have been made available at
https://github.com/CodenameYZY/MARGO.

∗Bolong Zheng is the corresponding author
This work is licensed under the Creative Commons BY-NC-ND 4.0 International
License. Visit https://creativecommons.org/licenses/by-nc-nd/4.0/ to view a copy of
this license. For any use beyond those covered by this license, obtain permission by
emailing info@vldb.org. Copyright is held by the owner/author(s). Publication rights
licensed to the VLDB Endowment.
Proceedings of the VLDB Endowment, Vol. 18, No. 11 ISSN 2150-8097.
doi:10.14778/3749646.3749697

1 INTRODUCTION
Recent advancements in Large Language Model (LLM) revolutionize
various domains, from natural language processing [6] to computer
vision [40]. LLM demonstrates remarkable performance in gener-
ating, understanding, and reasoning with human language, which
is powered by vectorized data representations. Vast cross-modal
data, such as text, images, and videos, are embedded into high
dimensional vectors, correlating by the distances between their vec-
tor representations. Approximate nearest neighbor (ANN) search
plays a critical role in LLM by facilitating the discovery of relevant
knowledge for inference [3, 24]. It is also a fundamental function in
various traditional tasks, including image search [31], information
retrieval [20], and recommendation systems [27]. So far, various
ANN search methods are proposed, including tree-based [1, 5, 12],
hashing-based [21, 39, 44, 46, 48, 49], quantization-based [16, 22, 47],
and graph-based [29, 30, 33, 45] methods. Among these methods,
graph-based methods are regarded as one of the most promising
directions, exhibiting both high efficiency and accuracy in ANN
search [4, 25, 26, 38].

Despite the advantages, graph-based methods, or alternatively
graph-based indexes, often suffer from excessive memory footprint.
This is because they require storing both the graph index and raw
vectors in memory. As a result, graph-based indexes struggle to fit
into main memory and cannot scale well as the number of vectors
increases. For instance, it requires up to 1100GB of memory to build
an in-memory Vamana graph for billion-scale datasets [37], which
goes beyond what a single machine can accommodate. To address
this issue, prominent vector databases [17, 42] distribute and in-
dex the vectors onto different search nodes, instead of building an
entire index, where each search node performs ANN search inde-
pendently, and the results from all nodes are merged to generate
final ANN search results. However, it still suffers from high cost due
to extensive memory usage in commercial databases. Therefore, it
is critical to develop a disk-based graph index that stores vectors
and performs ANN search on inexpensive disk storage.

Existing disk-based graph indexes focus on reducing random
disk I/Os in ANN search to improve efficiency. DiskANN [37] em-
ploys Product Quantization [22] and uses approximate distances to
guide the search path. Since the computation of such approximate
distances does not require loading the vectors from the disk, a large

4337

number of random disk I/Os are hence avoided. However, it se-
quentially stores vectors on the disk based on IDs, resulting in poor
data locality. Starling [43] enhances data locality by optimizing the
layout of the graph index. It stores each vertex and its neighbors
in a same page as much as possible. This approach ensures that a
single random I/O can access more relevant vertices. Despite the
improvements, they still face two major challenges:

• Insufficient data locality. When optimizing the graph layout,
Starling only considers the benefit of storing a pair of neighbors
in the same page from the perspective of a single hop in the search
path, so that each pair of neighbors is supposed to be equally
important. This lacks the perspective of the entire search path
and results in a tunnel vision. In fact, the importance varies across
pairs of neighbors, among which those frequently passed by
search paths offer greater potential in reducing random disk I/Os.
Therefore, it is essential to design a graph layout optimization
strategy that takes the entire search path into account.

• Low efficiency of graph layout optimization. Starling opti-
mizes the graph layout in an iterative manner, where the number
of iterations controls the trade-off between data locality and
efficiency. To achieve a high data locality, a large number of iter-
ations is required, which leads to low efficiency. The efficiency
of graph layout optimization can be greatly enhanced if it is
completed in a single pass.

To address above challenges, we propose MARGO, a monotonic
path-aware graph layout optimization method for disk-based ANN
search that achieves both high data locality and efficiency. We
begin by rethinking the graph layout optimization (GLO) problem
from a novel perspective: its essence lies in selecting edges, not
vertices. Based on this perspective, MARGO employs a monotonic
path-aware objective function that aims to accommodate most
important edges. Each edge is delicately weighed through rigorous
theoretical analysis, to quantify its importance in the entire search
path. Next, we prove that the GLO problem is equivalent to the
minimum 𝑛𝑝 -cut problem with equal-size constrains on subsets,
which is known to be NP-hard. We introduce a greedy algorithm as
the solution, which prioritizes high-weight edges to accommodate
more monotonic paths. To improve efficiency and fully leverage
the parallel capabilities of multi-core processors, we propose two
stage decoupling, where intra-cluster edges are processed in parallel
first, followed by the inter-cluster edges. Finally, we propose an
on-the-fly weight computation strategy during index construction.
By reusing the computed distances, it obtains the edge weights
with almost no additional overheads.

The main contributions are summarized as follows:

• We offer a novel perspective on the graph layout optimization
problem, and design a monotonic path-aware objective function
based on rigorous theoretical analysis.

• We prove GLO problem is NP-hard, and introduce a greedy al-
gorithm as the solution. To enhance efficiency, we propose two
stage decoupling tailored to the nature of the graph index.
• We introduce a weight computation strategy that obtains edge
weights on-the-fly during index construction. It avoids computa-
tionally expensive distance computations by completely reusing
the already computed distances.

• We conduct extensive experiments in 4 real-world datasets, thor-

oughly verifying the accuracy and efficiency of MARGO.

2 PRELIMINARIES
2.1 Problem Setting
We focus on the 𝑘 nearest neighbor (𝑘NN) search problem for high
dimensional vectors, which is formally defined as follows.

Definition 1 (𝑘 nearest neighbor (𝑘NN) search). Given a
set of 𝑑-dimensional vectors 𝐷 = {𝑝1, . . . , 𝑝𝑛 } ⊆ R𝑑 , a query vector
𝑞, and a positive integer 𝑘, the 𝑘NN search aims to find a set of 𝑘
vectors 𝑆𝑘 ⊆ 𝐷 such that for ∀𝑝𝑖 ∈ 𝑆𝑘 and ∀𝑝 𝑗 ∈ 𝐷 \𝑆𝑘 , dist(𝑝𝑖, 𝑞) ≤
dist(𝑝 𝑗 , 𝑞), where dist(·, ·) denotes the distance function.

However, solving the exact 𝑘NN search problem in high dimen-
sional space is time-consuming. Therefore, recent studies trade off
between accuracy and efficiency, seeking an approximate solution
instead. This is formally referred to as 𝑘 approximate nearest neigh-
bor (𝑘ANN) search. The most widely adopted metric to evaluate the
accuracy of 𝑘ANN search is Recall@𝑘, which is computed as the
ratio of true nearest neighbors in the returned set over 𝑘. Specifi-
cally, given the set of returned 𝑘 ANNs 𝑆ˆ𝑘 , Recall@𝑘 = |𝑆ˆ𝑘 ∩ 𝑆𝑘 |/𝑘,
where 𝑆𝑘 is the set of true nearest neighbors.

2.2 ANN Search in Vector Databases
In real-world applications, vector collections can exceed billions
in scale. Managing massive vectors within a single index proves
impractical due to severe memory bottlenecks and lack of essential
system features [17, 42]. For instance, building an entire in-memory
Vamana graph for billion-scale datasets consumes 1100GB memory
and takes over five days [37], severely degrading system availability.
Moreover, a single index fails to deliver critical capabilities such as
scalability, load balancing, and fault tolerance [17].

To overcome this, leading vector databases [17, 42] partition
vectors into segments distributed across search nodes. Each node
hosts multiple segments, each managing millions of vectors under
strict resource constraints—typically less than 2GB of memory and
10GB of disk space [17, 42]. Upon receiving a query, a query coordi-
nator determines the relevant segments to activate for ANN search,
whose results are merged to produce the final output.

Existing ANN search methods struggle in the segment-based
scenario, each facing distinct limitations. Among in-memory meth-
ods, graph-based methods such as HNSW [30] and NSG [14] be-
come prohibitively costly at very large vector collections [8, 37].
Quantization-based methods like Faiss [11] suffer from a substan-
tial drop in accuracy. For example, the recall@1 is only about 0.5
when memory is far smaller than the vector collections [37]. Among
disk-based methods, SPANN [8] duplicates vectors extensively, in-
curring excessive disk usage and violating the resource constraints
of segments. DiskANN [37] and Starling [43] yield unsatisfactory
search efficiency due to insufficient data locality. Therefore, it is
crucial to design a disk-based ANN search method that balances
search efficiency and disk usage, while also enhancing data locality.

2.3 Graph-based Index
Proximity graph (PG). The graph index is regarded as the most
promising approach due to its high accuracy, efficiency, and low disk

4338

(a) The short edge priority rule of SNG

(b) Plan A for the graph layout

(c) Plan B for the graph layout

Figure 1: A toy example

overhead [37, 43]. The core idea of the graph index is to construct
a proximity graph 𝐺 = (𝑉 , 𝐸), which can be either directed or
undirected, to represent the vectors. 𝑉 is the vertex set, where
there is a one-to-one correspondence between the vertices and the
vectors. 𝐸 is the edge set that is generated by a delicately designed
rule. Each edge represents the neighborhood relationship between
the two connected vertices.

When the query arrives, the graph index performs a greedy
search strategy to find the approximate nearest neighbor. Specifi-
cally, the search starts from an entry vertex, which can be either
fixed or selected by some mechanisms. Then, during each hop, it
evaluates the out-neighbors of the current vertex, and moves to the
one with the smallest distance to the query. If the current vertex is
closer to the query than any of its out-neighbors, it is returned as
the search result, and the search terminates.

Monotonic search network (MSNET). MSNET [10] is a subset
of PG. Given a proximity graph 𝐺 = (𝑉 , 𝐸), it is an MSNET iff.
the following condition is satisfied. For ∀𝑝𝑖, 𝑝 𝑗 ∈ 𝑉 , there exists
a path [𝑣1, . . . , 𝑣𝑙 ] such that dist(𝑣𝑖, 𝑣𝑙 ) > dist(𝑣𝑖+1, 𝑣𝑙 ) holds for
∀𝑖 = 1, . . . , 𝑙 − 1, where 𝑣1 = 𝑝𝑖, 𝑣𝑙 = 𝑝 𝑗 . Such a path is called a
monotonic path from 𝑝𝑖 to 𝑝 𝑗 , and is denoted as MP(𝑝𝑖, 𝑝 𝑗 ).

This property ensures that the greedy search starting from an
arbitrary entry vertex can find the nearest neighbor without back-
tracking. Hence, it provides theoretical support for accuracy of the
MSNET-based graph index.

Sparse neighborhood graph (SNG). However, to achieve the
above property, MSNET often requires excessive edges to form
enough monotonic paths, which results in low search efficiency.
SNG [2] is a well-adopted directed graph index with MSNET prop-
erty. The core idea is the short edge priority rule, where short edges
occlude long edges. When selecting a vertex 𝑝’s out-neighbors
during index construction, the other vertices are evaluated in the
ascending order of their distances to 𝑝. Given that 𝑝∗ is already se-
lected as 𝑝’s out-neighbor, i.e., the edge (𝑝, 𝑝∗) ∈ 𝐸, for another ver-
tex 𝑝′, if dist(𝑝′, 𝑝∗) < dist(𝑝′, 𝑝), then (𝑝, 𝑝′) cannot exist. In this
case, we say that (𝑝, 𝑝∗) occludes (𝑝, 𝑝′), or alternatively, (𝑝, 𝑝∗)
occludes 𝑝′ for 𝑝. With this rule, redundant long edges are excluded,
so SNG retains the property of MSNET with fewer edges.

Example 1. Fig. 1(a) illustrates an SNG in 2D space with 12 vertices,
i.e., {𝑝1, . . . , 𝑝12}. When selecting the out-neighbors of 𝑝4, 𝑝1 and
𝑝9 are selected first, because they are the top-2 closest vertices to
𝑝4. Then, 𝑝2 is selected and the edge (𝑝4, 𝑝2) (in red) is connected,

whose perpendicular bisector is denoted by a dashed red line. Since
the vertices to the right of this line (in gray) are closer to 𝑝2 than to
𝑝4, e.g., dist(𝑝6, 𝑝2) < dist(𝑝6, 𝑝4), (𝑝4, 𝑝2) occludes these vertices for
𝑝4, except the already connected 𝑝2. Therefore, 𝑝4 has no out-edges
towards these vertices.

2.4 Graph Layout Optimization
Graph layout on disk. For the disk-based graph index, the storage
format of a vertex on disk includes its corresponding vector, along
with the number and IDs of its out-neighbors. Given a graph index
with the maximum out-degree of 𝑅, which is often set to a small
constant in practice, the length of each vertex’s out-neighbor ID
list is padded to 𝑅 for alignment purposes. As a result, each vertex
occupies the same amount of disk space, denoted as 𝑠𝑣 bytes. Since
a page is the smallest disk I/O unit, a vertex is not split across
multiple pages. Given that the page size is 𝑠𝑝 bytes, a page can
accommodate up to 𝑛𝑣 = ⌊𝑠𝑝 /𝑠𝑣⌋ vertices. Based on the disk graph
layout format, we give a general definition of the graph layout
optimization problem.

Definition 2 (Graph Layout Optimization (GLO)). Given a
proximity graph 𝐺 = (𝑉 , 𝐸), GLO aims to assign the 𝑛 vertices to 𝑛𝑝
pages, where each page contains at most 𝑛𝑣 vertices. The assignment
seeks to maximize an objective function F subject to constraints C.

We intentionally omit the specific form of F and C here to allow
for flexible problem settings, which is detailed in the next section.

3 MONOTONIC PATH AWARE OBJECTIVE

FUNCTION

We proceed to introduce a monotonic path-aware objective function.
We first analyze the essence of GLO. Then, we depict the objective
function design in detail.

3.1 The Essence of GLO
Before analyzing the essence of GLO, we explain how it benefits the
disk-based graph index. For a disk-based graph index, the bottleneck
in search efficiency is the time-consuming random disk I/O, which
occurs when the search hops from the current vertex to its out-
neighbor located in a different page. On the contrary, if the search
hops to an out-neighbor located in the same page as the current
vertex, the need for a random disk I/O is avoided.

4339

𝑝1𝑝2𝑝3𝑝5𝑝6𝑝7𝑝8𝑝9𝑝10𝑝11𝑝12𝑝4𝑝1𝑝2𝑝3𝑝5𝑝6𝑝7𝑝8𝑝9𝑝10𝑝11𝑝12𝑝4𝑝1𝑝2𝑝3𝑝5𝑝6𝑝7𝑝8𝑝9𝑝10𝑝11𝑝12𝑝4Table 1: The search paths and numbers of random disk I/Os of different queries

Query
𝑝1
𝑝2
𝑝3
𝑝4

Search path
[𝑝6, 𝑝4, 𝑝1]
[𝑝6, 𝑝2]
[𝑝6, 𝑝2, 𝑝3]
[𝑝6, 𝑝4]

# of I/Os
Plan A Plan B

2
2
3
1

2
1
2
2

Query
𝑝5
𝑝6
𝑝7
𝑝8

Search path
[𝑝6, 𝑝9, 𝑝8, 𝑝5]
[𝑝6]
[𝑝6, 𝑝11, 𝑝12, 𝑝7]
[𝑝6, 𝑝9, 𝑝8]

# of I/Os
Plan A Plan B

2
1
2
2

2
1
2
2

Query
𝑝9
𝑝10
𝑝11
𝑝12

Search path
[𝑝6, 𝑝9]
[𝑝6, 𝑝11, 𝑝10]
[𝑝6, 𝑝11]
[𝑝6, 𝑝11, 𝑝12]

# of I/Os
Plan A Plan B

1
2
2
2

1
2
1
2

Example 2. Fig. 1(b) illustrates a graph layout plan of the SNG in
Fig. 1(a), where the 12 vertices are assigned to 3 pages, with each page
containing 4 vertices. Vertices in the same color belong to the same
page. Assume that the current vertex is 𝑝6. If the search hops to 𝑝2, a
random disk I/O is triggered to load the page {𝑝1, 𝑝2, 𝑝5, 𝑝8}. However,
if it hops to 𝑝4, there is no need to load the page {𝑝4, 𝑝6, 𝑝9, 𝑝10}, as
it is already loaded when 𝑝6 is accessed.

Therefore, GLO benefits the disk-based graph index by making
hops happen within a page as much as possible. Since a hop is
equivalent to passing an edge in PG, we contend that the essence
of GLO is to select edges, so that the number of random disk
I/Os is minimized when both endpoints of each selected edge
are assigned to the same page.

However, Starling [43] presents this problem from a vertex-wise
perspective. It aims to assign each vertex and its out-neighbors to
the same page. The objective function of Starling is designed as the
average ratio of each vertex’s (say 𝑝) out-neighbors in the same
page as 𝑝 over all vertices in this page except 𝑝 itself. That is:

FStarling =

∑︂

1
|𝑉 |

|𝐵(𝑝) ∩ 𝑁 (𝑝)|
|𝐵(𝑝)| − 1

,

(1)

𝑝 ∈𝑉
where 𝑁 (𝑝) is the set of 𝑝’s out-neighbors, and 𝐵(𝑝) represents
the page of 𝑝. The constraints CStarling are as follows. First, for all
𝐵(𝑝𝑖 ), |𝐵(𝑝𝑖 )| = 𝑛𝑣, which means that all pages are full. Second,
each vertex is assigned to exactly one page. However, we prove
that such a vertex-wise optimization objective is equivalent to one
selecting edges with each edge having the same importance.

Lemma 1. The optimization objective of Starling is essentially
equivalent to maximizing the number of edges whose both endpoints
are assigned to a same page.

Proof. For all 𝑝𝑖, 𝑝 𝑗 , |𝐵(𝑝𝑖 )| = |𝐵(𝑝 𝑗 )| = 𝑛𝑣, hence

arg max
𝐵 (·)

FStarling ⇔ arg max
𝐵 (·)

= arg max
𝐵 (·)

= arg max
𝐵 (·)

∑︂

𝑝 ∈𝑉
∑︂

|𝐵(𝑝) ∩ 𝑁 (𝑝)|

∑︂

I𝐵 (𝑝 )=𝐵 (𝑝∗ ) (𝑝, 𝑝∗)

𝑝 ∈𝑉

𝑝∗ ∈𝑁 (𝑝 )

∑︂

I𝐵 (𝑝 )=𝐵 (𝑝∗ ) (𝑝, 𝑝∗),

(2)

(𝑝,𝑝∗ ) ∈𝐸
where I𝐵 (𝑝 )=𝐵 (𝑝∗ ) (𝑝, 𝑝∗) is an indicator function. When 𝑝 and 𝑝∗
□
are in the same page, its value is 1. Otherwise, it is 0.

𝑖 , 𝑝∗

Given 𝑝∗

𝑗 ∈ 𝑁 (𝑝), either selecting (𝑝, 𝑝∗

𝑖 ) or selecting (𝑝, 𝑝∗
𝑗 )
equally contributes to the objective function by 1, which corre-
sponds to assigning 𝑝∗
𝑗 to the same page as 𝑝, respectively.
Therefore, Starling selects edges under the assumption that all edges

𝑖 or 𝑝∗

are equally important. However, we argue that the edges should
not be considered as equally important, which is elaborated in the
next section.

3.2 Objective Function Design
Intuitively, the importance of edges varies. Specifically, some edges
are frequently passed by search paths, while others are rarely visited.
Compared to rarely visited edges, it would improve greatly the
search efficiency by selecting frequently passed edges and assigning
both endpoints to the same page.

Intuition of MARGO. Fig. 1(b) and 1(c) present two different
graph layout plans. Dashed edges represent those whose both end-
points are assigned to the same page. Solid edges represent those
whose both endpoints are assigned to different pages. In plans A
and B, the numbers of dashed edges are 19 and 16, respectively.
Since SNG is directed, forward and backward edges are considered
distinct (e.g., (𝑝2, 𝑝6) and (𝑝6, 𝑝2) are different edges). Since 19 > 16,
if evaluated by FStarling (Eq. 2), plan A outperforms plan B.

However, if we take 𝑝6 as the entry vertex, and {𝑝1, . . . , 𝑝12} as
queries, plan B requires fewer random disk I/Os in total than plan
A. The search path and number of random disk I/Os for each query
are shown in Table 1. Compared to plan A, plan B increases the
number of random disk I/Os by 1 for 𝑝4, but reduces the number
of random disk I/Os by 1 for 𝑝2, 𝑝3, 𝑝11. This is because the edge
selected in plan B are passed by search paths more frequently. For
example, (𝑝6, 𝑝11) is passed in four queries, i.e., 𝑝7, 𝑝10, 𝑝11, 𝑝12,
while (𝑝9, 𝑝10) is passed in no queries. Therefore, (𝑝6, 𝑝11) is more
important than (𝑝9, 𝑝10), and is able to reduce more random disk
I/Os when selected.

Based on this intuition, we contend that the edges should be
weighed and selected based on the frequencies with which they are
passed by search paths. The challenge lies in how to quantify such
frequency for an arbitrary edge (𝑝, 𝑝∗). To address this, we first
analyze a special case, and then extend the analysis to general cases.
The following analysis is under the assumption that the queries
and indexed vectors follow the same distribution.

Search from 𝑝. Specially, we consider the case that 𝑝 is the
entry vertex. To facilitate the analysis, we begin with the definition
of Monotonically Reach.

Definition 3 (Monotonically Reach). Given an edge (𝑝, 𝑝∗)
and a vertex 𝑝′, if there exists a monotonic path MP(𝑝, 𝑝′) that passes
(𝑝, 𝑝∗), we say that (𝑝, 𝑝∗) can monotonically reach 𝑝′.

According to the greedy search strategy, the search path defi-
nitely follows a monotonic path. Therefore, given an edge (𝑝, 𝑝∗),
we use the number of vertices that it can monotonically reach,
denoted as 𝑚(𝑝, 𝑝∗), to quantify the frequency with which it is

4340

passed by search paths in the special case. The more vertices that
it can monotonically reach, it is more likely to be passed during
the search. Next, we derive the number of vertices that (𝑝, 𝑝∗) can
monotonically reach in an SNG by Lemmas 2 and 3.

Lemma 2. In an SNG, a monotonic path of the form [𝑝, 𝑝∗, . . . , 𝑝′]

exists iff. (𝑝, 𝑝∗) occludes (𝑝, 𝑝′).

Proof. Necessity. If the path [𝑝, 𝑝∗, . . . , 𝑝′] is a monotonic path,
then we have dist(𝑝∗, 𝑝′) < dist(𝑝, 𝑝′). According to the short
edge priority rule of SNG, (𝑝, 𝑝∗) occludes (𝑝, 𝑝′). Sufficiency.
If (𝑝, 𝑝∗) occludes (𝑝, 𝑝′), we have dist(𝑝, 𝑝′) > dist(𝑝∗, 𝑝′). The
property of SNG guarantees that there exists a monotonic path
from 𝑝∗ to 𝑝′, denoted as [𝑣1, . . . , 𝑣𝑙 ], where 𝑣1 = 𝑝∗, and 𝑣𝑙 = 𝑝′. It
holds that dist(𝑝, 𝑣𝑙 ) > dist(𝑣1, 𝑣𝑙 ) > · · · > dist(𝑣𝑙 −1, 𝑣𝑙 ). Therefore,
[𝑝, 𝑣1, . . . , 𝑣𝑙 ] = [𝑝, 𝑝∗, . . . , 𝑝′] is a monotonic path.
□

Lemma 3. In an SNG, for an arbitrary edge (𝑝, 𝑝∗), the number
of vertices that it can monotonically reach equals to the number of
edges it occludes, plus one.

Proof. We address the cases separately depending on the length
of the monotonic path. Case 1. For a monotonic path of length 1,
there is only one such path, namely [𝑝, 𝑝∗]. Case 2. For a monotonic
path of length greater than 1, which takes the form [𝑝, 𝑝∗, . . . , 𝑝′],
Lemma 2 implies that each such 𝑝′ corresponds to an edge oc-
cluded by (𝑝, 𝑝∗). To sum up, the number of vertices that (𝑝, 𝑝∗)
can monotonically reach equals to the number of edges it occludes,
□
plus one.

Search to 𝑝. It does not always hold that 𝑝 is the entry vertex.
Therefore, we consider the process before 𝑝 is reached by the search.
Once the search reaches 𝑝, the problem reduces to the special case
discussed above. Given that the number of vertices that (𝑝, 𝑝∗)
can monotonically reach remains unchanged, the more likely 𝑝
is to be reached by the search, the more frequently that (𝑝, 𝑝∗) is
passed. To quantify this likelihood, we employ the number of edges
that can monotonically reach 𝑝, denoted as 𝑚(𝑝). This is because
when 𝑝 is the query, once the search passes one of these edges, it is
guaranteed to reach 𝑝. We derive this number by Lemma 4.

Lemma 4. In an SNG, the number of edges that can monotonically
reach 𝑝 is equal to the number of edges that occlude 𝑝 plus 𝑝’s in-
degree.

Proof (Sketch). As in Lemma 3, we consider the cases sepa-
rately. The number of edges that can monotonically reach 𝑝 with
a monotonic path of length 1 is equal to the in-degree of 𝑝. The
number of edges that can monotonically reach 𝑝 with a monotonic
path of length greater than 1 is equal to the number of edges that
□
occlude 𝑝.

Inspired by the multiplication rule of conditional probability, the
frequency with which (𝑝, 𝑝∗) is passed by search paths is estimated
by the product of 𝑚(𝑝, 𝑝∗) and 𝑚(𝑝). That is:
𝑤 (𝑝, 𝑝∗) = 𝑚(𝑝, 𝑝∗) · 𝑚(𝑝).

(3)

To prioritize edges that are frequently passed by search paths, the
GLO objective function of MARGO is designed as:
∑︂

𝑤 (𝑝, 𝑝∗) · I𝐵 (𝑝 )=𝐵 (𝑝∗ ) (𝑝, 𝑝∗),

FMARGO =

(4)

(𝑝,𝑝∗ ) ∈𝐸

4341

so that an edge with a larger 𝑤 (·) can contribute more to the ob-
jective function, when it is selected. MARGO shares the same con-
strains with Starling, i.e., CMARGO = CStarling.

It is worth noting that the objective function of Starling (Eq. 1)
is a special case of Eq. 4, where the weights 𝑤 (·) are set to 1. This
is because Starling only considers the effect of an edge in one hop,
and neglects its impact in an entire monotonic path.

Discussion on approximate SNG. Due to the high construction
complexity of SNG, existing graph indexes turn to approximate
SNG, where the short edge priority rule is applied only within a
vertex’s neighborhood. Specifically, for a vertex 𝑝, its neighborhood
Δ(𝑝) is first identified using ANN search, and then edges are added
between 𝑝 and Δ(𝑝) according to the short edge priority rule. Note
that Δ(𝑝) differs from the out-neighbor set 𝑁 (𝑝), as only a portion
of vertices from Δ(𝑝) follow the rule and constitute 𝑁 (𝑝). In this
case, the induced subgraph of the neighborhood can be regarded
as an SNG. Based on recent observations [35, 41], most of the hops
during ANN search in the graph index occur within the query’s
neighborhood. Therefore, we contend that it is still reasonable to
employ the conclusions derived in Lemma 3 and 4 in the context of
an approximate SNG.

4 THE MARGO SOLUTION TO GLO
We proceed to introduce the graph layout optimization under the
monotonic path-aware objective function. First, we prove that this
problem is NP-hard. Next, a greedy algorithm is proposed. At last,
two stage decoupling is introduced to improve efficiency. We as-
sume that both the graph index and the edge weights are already
obtained, the details of which are covered in Sec. 5.

4.1 Problem Reduction
Substitute our objective function (Eq. 4) and constraints into the
general definition of GLO (Def. 2), we have the following definition.

Definition 4 (GLO of MARGO). Given a PG with 𝑛 vertices,
denoted as 𝐺 = (𝑉 , 𝐸), positive integers 𝑛𝑝 and 𝑛𝑣, and the edge
weights 𝑤 (·) : 𝐸 → N+, GLO of MARGO aims to assign the 𝑛 vertices
to 𝑛𝑝 pages, where each page contains exactly 𝑛𝑣 vertices, and each
vertex is assigned to exactly one page. The optimization objective of
the assignment is:

arg max
𝐵 (·)

∑︂

𝑤 (𝑝, 𝑝∗) · I𝐵 (𝑝 )=𝐵 (𝑝∗ ) (𝑝, 𝑝∗),

(5)

(𝑝,𝑝∗ ) ∈𝐸
where 𝐵(·) maps each vertex to its assigned page.

Theorem 1. The problem in Def. 4 is NP-hard.

Proof. Construct an undirected graph with positive weights,
denoted as 𝐺𝑢 = (𝑉 𝑢, 𝐸𝑢, 𝑤𝑢 (·)), which satisfies the following
conditions:
• For the vertex set, it is the same as the vertex set in the proximity

graph 𝐺 = (𝑉 , 𝐸), i.e., 𝑉 𝑢 = 𝑉 .

• For the edge set 𝐸𝑢 , an edge (𝑝, 𝑝∗)𝑢 ∈ 𝐸𝑢 iff. (𝑝, 𝑝∗) ∈ 𝐸 or
(𝑝∗, 𝑝) ∈ 𝐸. Here we use a superscript to distinguish between
directed and undirected edges.

• The edge weights 𝑤𝑢 (·) : 𝐸𝑢 → N+ are defined as follows.
For (𝑝, 𝑝∗)𝑢 ∈ 𝐸𝑢 , if both (𝑝, 𝑝∗) and (𝑝∗, 𝑝) belong to 𝐸, then

𝑤𝑢 (𝑝, 𝑝∗) = 𝑤 (𝑝, 𝑝∗) + 𝑤 (𝑝∗, 𝑝). Otherwise, 𝑤𝑢 (𝑝, 𝑝∗) is equal
to either 𝑤 (𝑝, 𝑝∗) or 𝑤 (𝑝∗, 𝑝), depending on which edge exists.

The problem in Def. 4 is equivalent to the following problem.
Given an undirected graph with positive weights and a positive
integer 𝑛𝑝 , partition the vertices into 𝑛𝑝 subsets, each containing
exactly 𝑛𝑣 vertices. The goal is to maximize the weight sum of edges
whose both endpoints belong to the same subset.

Since the total weight sum of all edges in 𝐸𝑢 is constant, max-
imizing the weight sum of edges within subsets corresponds to
minimizing the weight sum of edges cut by the partition. Thus,
the problem is equivalent to the minimum 𝑛𝑝 -cut problem with
□
equal-size subsets, which is known to be NP-hard [15].

This problem can be solved by Semidefinite programming (SDP).
However, SDP is not applicable to large-scale datasets. Even without
considering the equal-size constraints on subsets, the exact solution
to this problem has a time complexity of 𝑂 (|𝑉 | (1.981+𝑜 (1)𝑛𝑝 ) ) [18].
Although there exists polynomial-time approximation algorithms
with 2(1 − 1/𝑛𝑝 )-approximation ratio [32, 36], these methods are
still insufficient for solving the GLO problem of MARGO. On one
hand, their time complexities are too high for a graph index that
contains millions of vertices, with the number of pages on a similar
order of magnitude. On the other hand, they cannot enforce the
equal-size constraints on subsets. To the best of our knowledge, no
existing solution currently addresses the GLO of MARGO.

4.2 Greedy Algorithm
We propose a greedy algorithm to solve the GLO of MARGO. First,
an undirected graph is constructed as described in the proof of
Theorem 4.1. Then, we assign the vertices to pages, with higher-
weight edges given priority.

As the construction of the undirected graph is straightforward,
we omit the details due to the space limitation. Next, to prioritize
edges with higher weights, we sort the edges in descending order
on their weights. When assigning vertices to an empty page, say
𝐵𝑖 , we greedily select the edge with maximum weight whose both
endpoints are not yet assigned, and assign these endpoints to 𝐵𝑖 .
While 𝐵𝑖 is not full, we have two strategies for determining the
next vertex to assign. (1) Select a vertex that is not a neighbor (in
the undirected graph there is no distinction between in- and out-
neighbors) of the already-assigned vertices in 𝐵𝑖 . In this case, we
select the edge with the maximum weight, whose both endpoints
are unassigned, and assign them to 𝐵𝑖 , similar to how we handle an
empty page. (2) Select the vertex from the neighbors. We scan all
unassigned neighbors, compute the contribution of each neighbor
to the objective function if it is assigned to 𝐵𝑖 , and select the vertex
with the highest contribution. The contribution is computed as the
weight sum of edges between the vertex to assign and the vertices
already in 𝐵𝑖 .

However, we find that assigning non-neighbor vertices often
leads to unsatisfactory results, even if they may contribute more
to the objective function at the moment. This is because it may
negatively affect the contributions of subsequent pages. For exam-
ple, suppose that 𝐵𝑖 has room for two more vertices. If we assign
non-neighbor vertices, such as the endpoints of the edge (𝑝, 𝑝∗)𝑢 ,
the contribution is just 𝑤𝑢 (𝑝, 𝑝∗). However, if we assign 𝑝, 𝑝∗ along

(a) Construct the graph

(b) Select an edge for 1st page

(c) Assign following vertices to 1st page

(d) Assign vertices to 2nd page

(e) Assign vertices to 3th page

(f) 𝑝10 remains unassigned

Figure 2: A running example of the greedy algorithm

with other vertices in 𝑁 (𝑝) and 𝑁 (𝑝∗) to a new page, the contri-
bution could exceed 𝑤𝑢 (𝑝, 𝑝∗). Therefore, we prioritize the second
strategy that selects vertices from the neighbors for assignment,
until 𝐵𝑖 is full, or there is no more unassigned neighbors. At last,
any remaining unassigned vertex after all pages are processed are
assigned to pages not yet full.

Example 3. Fig. 2 illustrates the graph layout procedure in Fig. 1(c)
using the greedy algorithm. First, the undirected graph corresponding
to the SNG in Fig. 1(a) is constructed, as shown in Fig. 2(a), with edge
weights annotated besides the respective edges.

The first page begins with the edge having the maximum weight,
i.e., (𝑝6, 𝑝11)𝑢 . After assigning 𝑝6 and 𝑝11 to the first page (denoted by
red in Fig. 2(b)), their neighbors become the candidates for the vertex to
assign next, i.e., 𝑝2, 𝑝3, 𝑝4, 𝑝9, 𝑝10, 𝑝12. The respective contributions of
these candidates are 4, 1, 2, 4, 2, 3, with larger contributions represented
by darker colors in Fig. 2(b). Both 𝑝2 and 𝑝9 have the maximum
contribution, so we choose 𝑝2 which has the smaller ID , and assign it to
the first page. Afterward, the candidates become 𝑝1, 𝑝3, 𝑝4, 𝑝9, 𝑝10, 𝑝12
(Fig. 2(c)), with contributions of 1, 3, 3, 4, 2, 3, respectively. Therefore,
the next vertex is 𝑝9. At this point, the first page is full.

The second page starts with (𝑝7, 𝑝12)𝑢 , the edge with the maximum
weight among the remaining edges, as shown in Fig. 2(d). Following
a similar process, the second page includes 𝑝3, 𝑝7, 𝑝12, and the third
page includes 𝑝1, 𝑝4, 𝑝5, 𝑝8 (Fig. 2(f)). Since 𝑝10 remains unassigned
and the second page is not yet full, 𝑝10 is assigned to the second page.

Time complexity analysis. The time complexities of sorting
all edges and assigning vertices to pages are 𝑂 (|𝐸𝑢 | log |𝐸𝑢 |) and
𝑂 (|𝐸𝑢 | + 𝑛𝑝𝑅ˆ𝑛2
𝑣), respectively. Here, 𝑅ˆ denotes the average degree

4342

𝑝7𝑝10𝑝1𝑝2𝑝5𝑝6𝑝8𝑝9𝑝11𝑝12𝑝4𝑝3424521213211112132𝑝7𝑝10𝑝1𝑝2𝑝5𝑝6𝑝8𝑝9𝑝11𝑝12𝑝4𝑝3𝑝7𝑝10𝑝1𝑝2𝑝5𝑝6𝑝8𝑝9𝑝11𝑝12𝑝4𝑝3𝑝7𝑝10𝑝1𝑝2𝑝5𝑝6𝑝8𝑝9𝑝11𝑝12𝑝4𝑝3𝑝7𝑝10𝑝1𝑝2𝑝5𝑝6𝑝8𝑝9𝑝11𝑝12𝑝4𝑝3𝑝7𝑝10𝑝1𝑝2𝑝5𝑝6𝑝8𝑝9𝑝11𝑝12𝑝4𝑝3of 𝐺𝑢 , which is comparable to the maximum out-degree 𝑅 of the
graph index, e.g., 64. 𝑛𝑣 is the number of vertices per page, typically
around 5 for a common 4KB page. 𝑛𝑝 is the number of pages, which
is computed as ⌈𝑛𝑝 = 𝑛/𝑛𝑣⌉. In the term 𝑂 (|𝐸𝑢 | + 𝑛𝑝𝑅ˆ𝑛2
𝑣), the
first term corresponds to the complexity of scanning the edges
and selecting the first two vertices for each page. Since selecting
subsequent vertices for a page is 𝑂 (𝑅ˆ𝑛2
𝑣), the total complexity for
𝑛𝑝 pages is 𝑂 (𝑛𝑝𝑅ˆ𝑛2
𝑣). Hence, the overall complexity of the greedy
algorithm is 𝑂 (|𝐸𝑢 | log |𝐸𝑢 | + 𝑛𝑝𝑅ˆ𝑛2
𝑣). Given that 𝑛 = 𝑛𝑣𝑛𝑝 and
|𝐸𝑢 | = 𝑅ˆ𝑛, the complexity simplifies to 𝑂 (𝑅ˆ𝑛 log 𝑅ˆ𝑛 + 𝑛𝑣𝑅ˆ𝑛). If 𝑛𝑣
and 𝑅ˆ are regarded as constants, the complexity becomes 𝑂 (𝑛 log 𝑛).

4.3 Two Stage Decoupling
The greedy algorithm faces two critical issues when applied in
practice. First, it requires sorting a large number of edges, which
typically outnumbers the vertices by orders of magnitude. Second,
both edge sorting and vertices assignment are executed serially:
each page is processed only after the assignments for the previ-
ous one are completed. These issues result in low efficiency of the
greedy algorithm. To address these issues, we propose two stage
decoupling that leverages the idea of divide-and-conquer and sig-
nificantly improves efficiency. It divides the vertices into smaller
subsets, processes each subset using the greedy algorithm, and then
combines the results of each subset to generate a final graph layout.
Divide with clustering. In a proximity graph, edges represent
the neighborhood relationships between vertices. Although the out-
neighbors of a vertex may not necessarily be its nearest neighbors
due to the short edge priority rule of SNG, vertices that are far apart
are less likely to be connected by edges. Based on this intuition,
we divide the vertices into nlist clusters, denoted as {𝐶1, . . . , 𝐶nlist},
and process each cluster independently. This division reduces the
original problem into smaller sub-problems, with minimal edges
cutting. In this way, instead of sorting all edges at once, we only sort
smaller sets of edges decoupled into each cluster. In addition, the
processes of clusters can be parallelized without synchronization,
allowing us to fully exploit the parallel capabilities of multi-core
processors. In practice, we only sample a small portion of vertices
for clustering, making it computationally efficient.

𝑖 (·)), where 𝑉 𝑢

𝑖 , 𝐸𝑢
𝑖 ∧ (𝑝, 𝑝∗)𝑢 ∈ 𝐸𝑢 }, and 𝑤𝑢

Conquer with greedy algorithm. For each cluster 𝐶𝑖 , we con-
struct the corresponding induced subgraph of 𝐺𝑢 . The induced sub-
graph is denoted as 𝐺𝑢
𝑖 , 𝑤𝑢
𝑖 = (𝑉 𝑢
𝑖 = {𝑝 |𝑝 ∈ 𝐶𝑖 },
𝐸𝑢
𝑖 = {(𝑝, 𝑝∗)𝑢 |𝑝, 𝑝∗ ∈ 𝑉 𝑢
𝑖 (𝑝, 𝑝∗) =
𝑤𝑢 (𝑝, 𝑝∗). Then, the greedy algorithm is applied to each cluster
based on its induced subgraph. It is worth noting that the assign-
ments of the vertices that remains unassigned are not handled
within each cluster’s process. Instead, these remaining vertices,
along with those assigned to pages that are not yet full, are marked
for post-processing in the subsequent combination stage.

Combine with post-process. Finally, we combine the results
of all clusters to produce the final graph layout. For the pages that
are full within each cluster, we simply merge them into the final
result. For the vertices that remain unassigned or those assigned to
pages that are not yet full, we apply a post-process step.

The motivation behind the post-process is as follows. If we di-
rectly assign the remaining vertices to the pages not yet full within
their respective cluster, these vertices would contribute nothing

4343

to the objective function. This is because, within any cluster, an
unassigned vertex cannot be a neighbor of any vertex in a page that
is not yet full. Otherwise, it contradicts the policy of the greedy
algorithm. Essentially, the divide phase decouples the edges into
intra-cluster edges and inter-cluster edges. Intra-cluster edges refer
to edges whose both endpoints belong to the same cluster, and
inter-cluster edges are those whose both endpoints are in different
clusters. The conquer phase only handles the intra-cluster edges
that are further decoupled into different clusters in parallel, while
neglects the inter-cluster edges.

To address this, we employ a post-process to select inter-cluster
edges. This step helps ensure that the remaining vertices make
positive contributions to the objective function. For example, con-
sider an inter-cluster edge whose two endpoints are unassigned
and located at the boundaries of different clusters. While these
vertices cannot form a page with neighbors from the same cluster,
selecting this edge allows them to be assigned to the same page
with neighbors from a different cluster. In practice, we treat the
vertices marked for post-processing as a special cluster, 𝐶post. This
cluster is handled in the same way as the other clusters, and in the
final step, the remaining unassigned vertices are assigned to the
pages that are not yet full. At this point, all vertices are assigned,
and the result from 𝐶post is merged into the final graph layout.

5 WEIGHT COMPUTATION
We proceed to introduce how MARGO computes the edge weights
during construction and performs ANN search. We employ Vamana
[37] as the underlying algorithm of MARGO. As an SNG-based
proximity graph, Vamana is the most prominent algorithm for disk-
based graph index, and exhibits outstanding performance in ANN
search. However, Vamana constructs an unweighted graph, lacking
the edge weights discussed in Sec. 3 that are crucial for edge selec-
tion in the GLO of MARGO. To address this, a straight forward
approach is to perform ANN search for each vertex on the built
graph, apply the short edge priority rule to the obtained neighbor-
hood, and compute edge weights based on the occlusions. However,
both ANN search and the application of the short edge priority rule
involve extensive, time-consuming distance computations of high
dimensional vectors, making this approach impractical.

Therefore, we propose MARGO that computes the edge weights
on-the-fly during index construction. By reusing the distances al-
ready computed for the construction, this approach incurs almost
no additional overhead. MARGO initializes with an empty graph,
with the vertex closest to the medoid of all vectors as the entry
vertex. Then, the vertices are incrementally inserted into the graph.
The two counting variables in Eq. 3 are dynamically maintained
during insertion. The construction is completed after all vertices
are inserted, and the edge weights are computed by Eq. 3. Next, we
describe the vertex insertion and counting variable maintenance.
Before a vertex 𝑝 is inserted, the number of edges that can mono-
tonically reach 𝑝 is initially set to 0, i.e., 𝑚(𝑝) = 0. To insert 𝑝 into
the graph, MARGO first performs ANN search to obtain its neigh-
borhood Δ(𝑝) that consists of 𝐿 vertices, where 𝐿 is a user defined
parameter. Then, the short edge priority rule is applied to generate
edges between 𝑝 and Δ(𝑝). Specifically, MARGO scans Δ(𝑝) in
ascending order based on distances to 𝑝. Denote that 𝑝∗ ∈ Δ(𝑝)

is the vertex closest to 𝑝, MARGO attempts to add both forward
and backward edges between 𝑝 and 𝑝∗. At the same time, the two
counting variables of affected edges and vertices are updated. The
details of adding forward and backward edges are as follows.

Add forward edge. The addition of (𝑝, 𝑝∗) is straight forward.
To account for the monotonic path of length 1, the number of
vertices that (𝑝, 𝑝∗) can monotonically reach is initialized to 1, i.e.,
𝑚(𝑝, 𝑝∗) = 1. Then, MARGO removes 𝑝∗ from Δ(𝑝). In addition,
any 𝑝′ ∈ Δ(𝑝) such that dist(𝑝′, 𝑝∗) < dist(𝑝′, 𝑝) is occluded and
also removed from Δ(𝑝), in compliance with the short edge priority
rule. According to Lemmas 3 and 4, 𝑚(𝑝, 𝑝∗) and 𝑚(𝑝′) are both
incremented by 1.

Add backward edge. Adding the backward edge (𝑝∗, 𝑝) is more
complex, as it could cause the out-degree of 𝑝∗ to exceed the max-
imum out-degree limit 𝑅. MARGO first attempts to add (𝑝∗, 𝑝),
where 𝑚(𝑝, 𝑝∗) is initialized to 1. If, after adding (𝑝∗, 𝑝), the out-
degree of 𝑝∗ remains below 𝑅, the addition is complete. However,
if the out-degree exceeds 𝑅, the out-edges of 𝑝∗ must be pruned.
This pruning occludes at least one out-edge, possibly including the
recently added (𝑝∗, 𝑝). Specifically, during the pruning, the original
out-neighbors of 𝑝∗ and 𝑝 are treated as the neighborhood of 𝑝∗, i.e.,
Δ(𝑝∗) = 𝑁 (𝑝∗) ∪ {𝑝}. The short edge priority rule is then applied to
𝑝∗ and Δ(𝑝∗). Since edges between 𝑝∗ and Δ(𝑝∗) are already added,
MARGO only occludes existing edges rather than adding new ones.
Given 𝑝+, 𝑝′ ∈ Δ(𝑝∗), if (𝑝∗, 𝑝+) occludes (𝑝∗, 𝑝′), both 𝑚(𝑝∗, 𝑝+)
and 𝑚(𝑝′) are incremented by 1. Finally, for each occluded 𝑝′, the
edge (𝑝∗, 𝑝′) is deleted.

The connection of 𝑝 terminates when its out-degree reaches 𝑅, or
when Δ(𝑝) becomes empty. Similar to Vamana, MARGO employs
two iterations of insertion to improve the graph quality. In the
second iteration, a parameter 𝛼 ≥ 1 is introduced to relax the
occlusion, so that long edges are retained to serve as shortcuts.
Specifically, given an edge (𝑝, 𝑝∗) and a vertex 𝑝′, (𝑝, 𝑝∗) occludes
𝑝′ iff. 𝛼 · dist(𝑝′, 𝑝∗) < dist(𝑝′, 𝑝). MARGO only computes the
counting variables in the second iteration, for two reasons. First, the
graph yields relatively lower quality in the first iteration, resulting
in inaccurate ANN search and counting variables. Second, a portion
of vertices and edges may be counted multiple times if MARGO
computes the counting variables in both iterations. After the second
iteration, for each vertex 𝑝, 𝑚(𝑝) is incremented by 𝑝’s in-degree.
Then, the weight of each edge is computed according to Eq. 3.

Time complexity analysis. Compared to Vamana, MARGO in-
troduces additional overhead to compute the two counting variables,
i.e., 𝑚(𝑝, 𝑝∗) and 𝑚(𝑝) for each (𝑝, 𝑝∗) ∈ 𝐸 and each vertex 𝑝 ∈ 𝑉 .
However, the update is finished in 𝑂 (1) each time. Therefore, the
overall time complexity of index construction remains 𝑂 (𝑛 log 𝑛).
Since the counting is relatively efficient compared to the distance
computations of high dimensional vectors, MARGO demonstrates
similar empirical construction performance to Vamana (Fig. 8).

Space cost analysis. To maintain the two counting variables,
MARGO requires additional space of 𝑂 (|𝐸| + |𝑉 |). The total space
cost is 𝑂 ((𝑑 + 1)|𝑉 | + 2|𝐸|), which we consider acceptable. In promi-
nent databases [17, 42], the processes of index construction and
search are decoupled onto independent nodes for high elasticity.
Although the memory available on segments is limited, index nodes
typically have sufficient memory. Notably, MARGO incurs no addi-
tional memory cost during the search procedure, as the counting

4344

variables are only used during the GLO, and do not need to be
loaded onto segments.

Search procedure. MARGO employs two search techniques
from existing disk-based graph indexes [37, 43]. First, it employs
the Product Quantization [22] and uses approximate distances to
guide the search path. Second, it expands the search space based on
multiple vertices located in the same page with the current vertex.
Interested readers can refer to the original papers for more details.
It is worth noting that, under the same search strategy and search
parameters, MARGO is able to achieve a higher recall than Starling
(Table 3). This is because the delicately selected edges, which are
useful for monotonic paths, help prevent the search path from
getting stuck in local optima.

6 EXPERIMENTS
6.1 Experimental Setup
We implement MARGO in C++. All experiments are conducted on
a Linux machine with two Intel Xeon Gold 6330 CPU @ 2.00GHz
processors (28 cores), with 125GB DDR4 RAM, and six Samsung
PM883 1.92TB SSDs in RAID-0 configuration. For index construc-
tion and GLO, we do not impose resource constraints, simulating a
resource-rich index node. For ANN search, we limit memory usage
to under 2GB and disk usage to under 10GB, to ensure all meth-
ods operate within the resource constraints typical of segments in
leading vector databases [42].

Datasets. We conduct the experiments in four datasets [9] with
varying dimensionalities under different distance functions. The
details of the datasets are shown in Table 2, where L2 and IP refer to
Euclidean distance and inner product, respectively. We follow the
settings in [43] and limit the vectors to slightly under 4GB, which
is a reasonable scale for a segment in vector databases.

Baselines. We compare MARGO with DiskANN [37], Starling
[43], and SPANN [8]. All methods use the O_DIRECT option for
disk I/O to avoid the influence of operating system-level caching.
Graph partitioning methods such as KMETIS [23] and KGGGP [34]
are excluded from the experiments, because GLO is not identical to
graph partitioning. First, these methods are designed for real-world
graphs, whose structure and properties differ from graph indexes,
leading to unsatisfactory performance in GLO [43]. Second, they
aim to divide vertices into roughly equal-sized subsets, which does
not strictly satisfy the constraints imposed by CMARGO.

Metrics. For the search procedure, we evaluate the accuracy and
efficiency. The accuracy is evaluated by Recall@𝑘, which measures
the recall at 𝑘 NNs. The efficiency is evaluated in terms of average
number of I/Os, query latency, and QPS (queries per second). For
the index construction, we evaluate the execution time required to
build the graph index and optimize the graph layout. In addition,
we measure the memory footprint of the index construction.

Parameter settings. The page size is set to 4KB, which is the
most common configuration. The out-degree limit 𝑅 is set to 64 for
DEEP and SIFT, 127 for Tiny, and 128 for Text2image. The number
𝐿 of neighbors to apply the short edge priority rule during construc-
tion is 125 for DEEP and SIFT, and 250 for Tiny and Text2image. The
parameter 𝛼 is set to 1.2. In all datasets, the number of clusters nlist
is 256 for MARGO, and the number of iterations is 16 for Starling.
The pruning ratio of the page search is set to 1.0. The duplication

Table 2: Dataset Statistics

Datasets

# Vectors

𝑑

dist(·, ·)

# Queries

DEEP
SIFT
Text2image
Tiny

11M
8M
5M
2.7M

96
128
200
384

L2
L2
IP
L2

10K
10K
100K
10K

count of SPANN is set to 2 to meet the resource constrains of seg-
ments. Queries are processed in batch mode for all methods with
56 threads, each handling one query at a time.

6.2 Search Performance Evaluation
We employ recall, average number of I/Os, query latency, and QPS
to evaluate the search performance of MARGO. First, we show
the trade-offs between accuracy and efficiency by comparing the
average number of I/Os, query latency, and QPS under different
recall. Then, we show the search performance of MARGO and
the baseline methods with identical search parameter. Finally, we
present the search performance under varying 𝑘.

Performance under different recall. We present the average
number of I/Os, query latency, and QPS under different recall in Fig.
3, 4, and 5, respectively. Since SPANN performs both random and
sequential disk accesses, its I/O count does not provide a meaning-
ful comparison. Therefore, SPANN is excluded from Fig. 3. Among
all methods, MARGO consistently achieves the best overall perfor-
mance. Notably, MARGO shows the most significant improvements
in Tiny and Text2image. This is because, in theses two datasets, the
storage of a vertex needs more space due to higher dimensionality
of vectors, resulting in fewer vertices per page. In this case, select-
ing edges carefully becomes even more critical. Specifically, at the
recall of 94.8%, MARGO outperforms Starling by 21.8% in query la-
tency and 26.6% in QPS for Tiny. In terms of the number of random
disk I/Os, MARGO requires 13.1% fewer I/Os than Starling at the
recall of 97.9% for Text2image. SPANN significantly lags behind the
graph-based methods in most datasets, because it cannot duplicate
vectors extensively due to the resource limitation of segments. How-
ever, it achieves comparable performance in Text2image, which
we attribute to large quantization errors that hinder navigation of
graph-based methods in this dataset.

Performance with identical parameter. Table 3 shows the
recall@10, average number of I/Os, query latency, and QPS when
𝐿𝑠 , a parameter that controls the trade-off between accuracy and
efficiency, is set to the same value for MARGO and graph-based
baseline methods. With the same search parameter, MARGO not
only achieves the fewest I/Os, the shortest query latency and the
highest QPS, but also yields the highest recall compared to the
baseline methods. This indicates that the delicately selected edges
during GLO not only reduce random disk I/Os, but also prevent
ANN search from stuck in local optima. Hence, both efficiency and
accuracy are improved, even with identical search parameter.

Performance under varying 𝑘. Fig. 6 compares the perfor-
mance of MARGO and baseline methods under varying values of 𝑘.
Due to space limitations, we only report the trade-off between recall
and the average number of random disk I/Os in Tiny. As shown

in Fig. 3 and 6, MARGO consistently outperforms Starling and
DiskANN at 𝑘 = 1, 10, and 50. In addition, the performance trends
remain similar across different values of 𝑘, providing evidence for
the effectiveness and robustness of MARGO.

6.3 Construction Performance Evaluation
We first evaluate the graph layout, including the objective function
values and execution time of the GLO procedure. Then, we compare
the time and space cost for building the graph index.

Objective function values. In the graph layout evaluation, we
exclude DiskANN, as it stores the vertices on disk sequentially
based on their IDs without employing GLO. We compute the val-
ues of both Fstarling (Eq. 1) and FMARGO (Eq. 4) for Starling and
MARGO in Table 4. Although MARGO has a different optimization
objective from Starling, they achieve similar values of Fstarling. This
is consistent with Lemma 1 that Starling is essentially selecting
edges. For FMARGO, MARGO exceeds Starling by over an order of
magnitude. It is worth noting that even in the case where MARGO
achieves a smaller Fstarling than Starling, e.g., in DEEP and SIFT,
MARGO requires fewer random disk I/Os (Fig. 3). This indicates
that it does not necessarily reduce random disk I/Os with more
edges whose both endpoints belong to the same page. Instead, se-
lecting fewer edges that are important for monotonic paths achieves
better results. Therefore, the optimization objective of MARGO is
more reasonable.

Comparison with optimal graph layout. In addition to com-
parisons with baseline methods, it is also valuable to assess how
closely the greedy algorithm approximates the optimal graph lay-
out. To this end, we conduct experiments on small graphs where
computing the optimal graph layout remains tractable. Specifically,
we sample a small subset for each dataset, construct the index with
an out-degree limit of 8, and perform ANN search with 𝑘 = 1. As
shown in Table 5, the greedy algorithm closely approximates the
optimal graph layout, with only a slight gap in both the objective
function value and the average number of I/Os.

Execution time of GLO. Fig. 7 compares the GLO execution
time of MARGO and Starling. MARGO demonstrates significantly
higher efficiency than Starling. The enhancement in efficiency is
attributed to two factors. First, Starling needs to preprocess the
entire graph, which is time-consuming and takes up about 30%
to 40% of the execution time. In contrast, according to the two
stage decoupling, MARGO only processes the induced subgraphs
in parallel without synchronization. Second, GLO of Starling is
performed in an iterative manner. A large number of iterations
leads to low efficiency. However, MARGO completes GLO in nearly
one pass, where each vertex is assigned only once, except for a small
fraction of vertices undergoing post-processing. Overall, MARGO
achieves a 4.0× to 5.5× improvement in the GLO efficiency.

Time cost of index construction. Fig. 8 compares the index
construction time across different methods. Starling and DiskANN
share identical index time, as Starling directly uses a pre-built
DiskANN index. While MARGO incurs additional overhead due
to the computation of edge weights, it exhibits inconsistent per-
formance across different datasets compared to other graph-based
methods. In DEEP, and SIFT, MARGO slightly outperforms Star-
ling and DiskANN. However, an opposite trend is observed in

4345

(a) DEEP

(b) SIFT

(c) Text2image

(d) Tiny

Figure 3: The average number of I/Os under different recall

(a) DEEP

(b) SIFT

(c) Text2image

(d) Tiny

Figure 4: The query latency under different recall

(a) DEEP

(b) SIFT

(c) Text2image

(d) Tiny

Figure 5: The throughput under different recall

Table 3: Search performance with the same parameter

Datasets

DEEP
SIFT
Text2image
Tiny

𝐿𝑠

50
105
370
435

Recall@10 (%)

Average # of I/Os

Query latency (ms)

QPS

DiskANN Starling MARGO DiskANN Starling MARGO DiskANN Starling MARGO DiskANN Starling MARGO

94.31
93.37
92.73
92.12

96.22
95.78
94.17
92.28

96.46
95.78
94.71
92.8

56.06
111.72
378.01
438.81

49.62
101.83
333.86
425.31

47.54
99.58
320.46
413.89

18.1
36.6
90.5
145.1

14.7
30.2
78.5
119.1

14.1
28.2
76.5
99.6

3074
1520
611
425

3720
1825
692
583

3887
1950
710
604

Text2image and Tiny. We attribute these slight differences to poten-
tial implementation issues or fluctuations in server performance.
Nevertheless, there is no evidence suggesting that the index time
is significantly impacted by the weight computation. We notice
that the index construction time of SPANN is highly sensitive to
data scale, incurring substantially higher costs than graph-based
methods in DEEP and SIFT. This is because it requires constructing
a high-quality graph index on a large number of centroids and
preforming costly ANN search to accurately assign each vector
to its nearest clusters. In contrast, graph-based methods are more

influenced by vector dimensionality, taking longer in SIFT than
DEEP. Additionally, they spend more time in Text2image and Tiny,
where higher out-degree limits result in denser graphs.

Space cost of index construction. The space costs across dif-
ferent methods are presented in Fig. 9. MARGO consistently re-
quires more memory than Starling and DiskANN across all datasets.
This is because, in addition to storing vectors and neighbor IDs of
each vertex, MARGO also stores edge weights in memory. Out of
the same reason, the difference in space costs becomes smaller in
datasets with higher vector dimensionality and fewer edges, e.g.,

4346

MARGOStarlingDiskANNSPANN5075100125Number of I/Os0.900.95Recall@10100200Number of I/Os0.900.95Recall@102004006008001000Number of I/Os0.900.95Recall@10200300400500600Number of I/Os0.850.900.95Recall@101020304050Latency (ms)0.900.95Recall@1050100Latency (ms)0.850.900.95Recall@1050100150200250Latency (ms)0.900.95Recall@1050100150200250Latency (ms)0.850.900.95Recall@10200040006000QPS0.900.95Recall@10100020003000QPS0.850.900.95Recall@1025050075010001250QPS0.900.95Recall@102505007501000QPS0.850.900.95Recall@10to higher costs in edge sorting and vertex assignments. However,
when nlist becomes excessively large, the time saved by the process
of each cluster no longer compensates for the increased overhead
due to clustering the vertices into a large number of clusters. It is
worth noting that the number of I/Os remains robust with respect
to changes in nlist, varying by only around 2%. Although the GLO
time fluctuates more noticeably, this variation (about 10 seconds) is
acceptable in practice compared to the cost of index construction.
Based on the empirical results, we set nlist to 256 for all datasets,
though further tuning for each dataset may yield even better results.

6.5 Ablation Study
We conduct an ablation study of the proposed MARGO to evaluate
the improvements provided by different components. Specifically,
we compare the following variants of MARGO:
• Greedy: Employing the greedy algorithm during GLO.
• wo-weight: Setting all edge weights to 1.
The execution time of GLO and the number of random disk I/Os
across four datasets are shown in Fig. 11.

Improvements of two stage decoupling. In Fig. 11(a), we
observe a significant increase in GLO execution time when the
greedy algorithm is adopted. This is due to the fact that the greedy
algorithm sorts a large number of edges and executes serially. Re-
garding the number of random disk I/Os (Fig. 11(b)), the two stage
decoupling lags slightly behind the greedy algorithm, because it
may cut potentially important inter-cluster edges in the divide stage.
However, such marginal difference is acceptable when compared
to the substantial improvements in GLO execution time.

Improvements of edge weights. As Fig. 11(a) shows, the ex-
ecution time of GLO with and without weight computation only
show slight differences, because no matter what weights the edges
are assigned, the two stage decoupling goes through a similar pro-
cess. However, the number of I/Os increases when the edge weight
computation is disabled in Fig. 11(b). For example, the required num-
ber of I/Os at the recall of 93.11% increases from 795.88 to 902.07
in text2image. This indicates that the edge weights successfully
capture the importance of edges.

7 RELATED WORK
7.1 In-Memory Graph index
Graph indexes [7, 13, 14, 19, 26, 28–30, 33, 45] are considered as
the most promising solutions to ANN search, offering both high
accuracy and efficiency [4, 25, 26, 38].

NSW [29] approximates the Delaunay Graph by incrementally
inserting vertices into the graph. Long edges formed in the early
stages of insertion serve as shortcuts, improving search efficiency.
HNSW [30] limits the out-degree and constructs hierarchical nav-
igation graphs. It addresses the hubness issue in NSW that the
out-degrees are extremely skewed to some vertices, and shortens
the search path. NSG [14] proposes the monotonic Relative Neigh-
borhood Graph (RNG). It relaxes the edge generation rule of RNG
to provide sufficient edges that form monotonic paths. NSSG [13]
further explores the potential of monotonic paths in graph indexes.
It generates edges based on both distance and angle information to
ensure that a vertex can guide the search path towards all directions.

(b) 𝑘 = 1 in Tiny

(c) 𝑘 = 50 in Tiny

Figure 6: Performance under varying 𝑘

Table 4: The objective function values

Dataset

DEEP

SIFT

Text2image

Tiny

Objective
FStarling
FMARGO
FStarling
FMARGO
FStarling
FMARGO
FStarling
FMARGO

Starling MARGO
2.2 × 107
2.8 × 107
2.5 × 1012
5.8 × 1010
1.5 × 107
1.8 × 107
8.9 × 1011
4.8 × 1010
8.1 × 106
7.9 × 106
1.1 × 1012
4.5 × 1010
2.6 × 106
2.2 × 106
8.5 × 1010
6.9 × 109

Table 5: Comparison with optimal graph layout

Dataset

Scale

DEEP
SIFT
Text2image
Tiny

54
56
36
36

Objective value Average # of I/Os
Greedy Optimal Greedy Optimal
16921
15777
8893
7517

18158
18234
9841
7604

5.26
4.18
5.57
6.35

5
4.05
5.54
6.2

Tiny. Compared to graph-based methods, SPANN exhibits more
consistent space costs across datasets. This stability stems from the
fact that SPANN mainly stores inverted lists, whose size closely
correlates with the size of the original vectors (about 3.8GB in the
four datasets). In contrast, the memory usage of graph-based meth-
ods varies more significantly due to differences in graph properties
such as the vertex count and average out-degree.

6.4 Parameter Study
Finally, we study the impact of the key parameter nlist on the
performance of MARGO. The graph index layout is optimized under
varying nlist from 64 to 1024. Fig. 10 shows the average number of
I/Os and recall@10 for different nlist settings. As the nlist increases,
the number of random disk I/Os also rises. This is because a larger
nlist results in more inter-cluster edges, some of which may be
potentially important but are cut in the divide stage and fail to
be recovered in the post-process. In contrast, the execution time
of GLO decreases at first, and then increases again. With a small
nlist, each cluster contains more edges and vertices, which leads

4347

MARGOStarlingDiskANNSPANN100150200Number of I/Os0.850.900.95Recall@1750100012501500Number of I/Os0.850.900.95Recall@50Figure 7: The execution time of GLO

Figure 8: Index construction time

Figure 9: Index construction space cost

vertices are stored on disk sequentially according to IDs. The search
path is guided by approximate distances computed using Product
Quantization (PQ) [22], thereby avoiding disk I/Os for accessing
raw vectors. Starling [43] is the first to optimize the graph layout.
The optimization is performed in an iterative manner, where each
vertex is assigned to the same page with its neighbors as much as
possible. Starling proposes a page search strategy, which expands
the search space with not only the target vertex determined based
on the PQ distance, but also the vertices within the same page. For
inverted file index based methods, SPANN [8] partitions the vectors
using a fine-grained balanced clustering algorithm, limiting the
number of vectors that need to be read from disk when a cluster is
visited. Each vector is assigned to multiple clusters, which prevents
missing neighbors located on the boundaries of clusters.

Among these methods, DiskANN and SPANN are designed for
single machines. In contrast, Starling is tailored for distributed
cloud-based vector databases, where vectors are distributed across
segments with limited resources [17, 42]. In this scenario, SPANN
cannot afford to duplicate vectors extensively, and therefore yields
unsatisfactory performance. Compared to inverted file index based
methods, graph index based methods are able to achieve better
trade-offs between search performance and disk overhead.

8 CONCLUSION
We propose MARGO as a GLO method for disk-based ANN search.
First, MARGO employs a monotonic path-aware objective function
that weighs the edges based on their importance in monotonic
paths. Second, we propose a greedy algorithm that prioritizes high-
weight edges to optimize the graph layout on disk. To improve
efficiency, two stage decoupling is put forward, which processes
intra-cluster edges in parallel first, followed by inter-cluster edges.
Third, MARGO leverages an on-the-fly weight computation strat-
egy during index construction to avoid incurring additional over-
head. Extensive experiments demonstrate that compared to the
SOTA method Starling, MARGO achieves up to 26.6% improvement
in search efficiency while maintaining the same accuracy, and up
to 5.5× acceleration in graph layout optimization.

ACKNOWLEDGMENTS
This work was supported in part by NSFC Grant No. 62372194 and
by 2025 Open Research Program of the MIIT Key Laboratory for
Software Integrated Application and Testing & Verification.

(a) DEEP

(b) SIFT

Figure 10: Effects of nlist

(a) GLO execution time

(b) Number of I/Os

Figure 11: Ablation study

𝜏-MNG [33] relaxes the edge generation rule of monotonic RNG,
removing constraints on short edges and loosening restrictions on
long edges. It enables the search path to approach the query faster
and avoid missing neighbors after arriving at the query’s neighbor-
hood. LSH-APG [45] incorporates Locality Sensitive Hashing (LSH)
to dynamically select the entry vertex during insertion, mitigating
the high construction complexity issue.

Despite their excellent performance, graph indexes suffer from

high memory footprint, which limits their scalability.

7.2 Disk-based ANN Search
Disk-based ANN search methods include graph index based meth-
ods [37, 43] and inverted file index based methods [8]. Among
graph index based methods, DiskANN [37] proposes Vamana, an
SNG-based graph index with a relaxed edge generation rule. The

4348

SPANNDiskANNStarlingMARGODEEPSIFTText2imageTinyDatasets0.00.51.01.52.02.53.03.5Execution Time (s)£102DEEPSIFTText2imageTinyDatasets0.00.81.62.43.24.04.85.6Execution Time (s)£103DEEPSIFTText2imageTinyDatasets0.00.20.40.60.81.0Space cost (GB)£101GLO Time# of I/Os641282565121024nlist0204060GLO Time (s)475480485# of I/Os (£0:1)641282565121024nlist02040GLO Time (s)99100101102# of I/OsGreedywo-weightMARGODEEPSIFTText2imageTinyDatasets0200400600Execution time (s)DEEPSIFTText2imageTinyDatasets0100200300400Number of I/OsREFERENCES
[1] Akhil Arora, Sakshi Sinha, Piyush Kumar, and Arnab Bhattacharya. 2018. HD-
Index: Pushing the Scalability-Accuracy Boundary for Approximate kNN Search
in High-Dimensional Spaces. PVLDB. 11, 8 (2018), 906–919.

[2] Sunil Arya and David M. Mount. 1993. Approximate Nearest Neighbor Queries

in Fixed Dimensions. In SODA. 271–280.

[3] Akari Asai, Sewon Min, Zexuan Zhong, and Danqi Chen. 2023. Retrieval-based

Language Models and Applications. In ACL. 41–46.

[4] Martin Aumüller, Erik Bernhardsson, and Alexander John Faithfull. 2020. ANN-
Benchmarks: A benchmarking tool for approximate nearest neighbor algorithms.
Inf. Syst. 87 (2020).

[5] Norbert Beckmann, Hans-Peter Kriegel, Ralf Schneider, and Bernhard Seeger.
1990. The R*-Tree: An Efficient and Robust Access Method for Points and
Rectangles. In SIGMOD Conference. 322–331.

[6] Tom B. Brown, Benjamin Mann, Nick Ryder, et al. 2020. Language Models are

Few-Shot Learners. In NeurIPS.

[7] Meng Chen, Kai Zhang, Zhenying He, Yinan Jing, and X. Sean Wang. 2024.
RoarGraph: A Projected Bipartite Graph for Efficient Cross-Modal Approximate
Nearest Neighbor Search. PVLDB. 17, 11 (2024), 2735–2749.

[8] Qi Chen, Bing Zhao, Haidong Wang, Mingqin Li, Chuanjie Liu, Zengzhong Li,
Mao Yang, and Jingdong Wang. 2021. SPANN: Highly-efficient Billion-scale
Approximate Nearest Neighborhood Search. In NeurIPS. 5199–5212.

[9] Billion-Scale Approximate Nearest Neighbor Search Challenge: NeurIPS’21 com-

petition track. 2021. https://big-annbenchmarks.com/

[10] DW Dearholt, N Gonzales, and G Kurup. 1988. Monotonic search networks for
computer vision databases. In Twenty-Second Asilomar Conference on Signals,
Systems and Computers, Vol. 2. IEEE, 548–553.

[11] Matthijs Douze, Alexandr Guzhva, Chengqi Deng, Jeff Johnson, Gergely Szilvasy,
Pierre-Emmanuel Mazaré, Maria Lomeli, Lucas Hosseini, and Hervé Jégou. 2024.
The Faiss library. (2024). arXiv:2401.08281 [cs.LG]

[12] Karima Echihabi, Panagiota Fatourou, Kostas Zoumpatianos, Themis Palpanas,
and Houda Benbrahim. 2022. Hercules Against Data Series Similarity Search.
PVLDB. 15, 10 (2022), 2005–2018.

[13] Cong Fu, Changxu Wang, and Deng Cai. 2022. High Dimensional Similarity
Search With Satellite System Graph: Efficiency, Scalability, and Unindexed Query
Compatibility. TPAMI. 44, 8 (2022), 4139–4150.

[14] Cong Fu, Chao Xiang, Changxu Wang, and Deng Cai. 2019. Fast Approximate
Nearest Neighbor Search With The Navigating Spreading-out Graph. PVLDB.
12, 5 (2019), 461–474.

[15] M. R. Garey and David S. Johnson. 1979. Computers and Intractability: A Guide

to the Theory of NP-Completeness.

[16] Tiezheng Ge, Kaiming He, Qifa Ke, and Jian Sun. 2013. Optimized Product

Quantization for Approximate Nearest Neighbor Search. In CVPR. 2946–2953.

[17] Rentong Guo, Xiaofan Luan, Long Xiang, Xiao Yan, Xiaomeng Yi, Jigao Luo,
Qianya Cheng, Weizhi Xu, Jiarui Luo, Frank Liu, Zhenshan Cao, Yanliang Qiao,
Ting Wang, Bo Tang, and Charles Xie. 2022. Manu: A Cloud Native Vector
Database Management System. PVLDB. 15, 12 (2022), 3548–3561.

[18] Anupam Gupta, Euiwoong Lee, and Jason Li. 2019. The number of minimum

k-cuts: improving the Karger-Stein bound. In STOC. 229–240.

[19] Ben Harwood and Tom Drummond. 2016. FANNG: Fast Approximate Nearest

[20]

Neighbour Graphs. In CVPR. 5713–5722.
Jui-Ting Huang, Ashish Sharma, Shuying Sun, Li Xia, David Zhang, Philip Pronin,
Janani Padmanabhan, Giuseppe Ottaviano, and Linjun Yang. 2020. Embedding-
based Retrieval in Facebook Search. In KDD. 2553–2561.

[21] Piotr Indyk and Rajeev Motwani. 1998. Approximate Nearest Neighbors: Towards

Removing the Curse of Dimensionality. In STOC. 604–613.

[22] Hervé Jégou, Matthijs Douze, and Cordelia Schmid. 2011. Product Quantization

for Nearest Neighbor Search. TPAMI. 33, 1 (2011), 117–128.

[23] George Karypis and Vipin Kumar. 1998. Multilevel k-way Partitioning Scheme
for Irregular Graphs. J. Parallel Distributed Comput. 48, 1 (1998), 96–129.
[24] The ChatGPT Retrieval Plugin lets you easily search and find personal or work
documents by asking questionsin everyday language. 2023. https://github.com/
openai/chatgpt-retrieval-plugin

[25] Conglong Li, Minjia Zhang, David G. Andersen, and Yuxiong He. 2020.

Im-
proving Approximate Nearest Neighbor Search through Learned Adaptive Early
Termination. In SIGMOD Conference. 2539–2554.

[26] Wen Li, Ying Zhang, Yifang Sun, Wei Wang, Mingjie Li, Wenjie Zhang, and
Xuemin Lin. 2020. Approximate Nearest Neighbor Search on High Dimensional

Data - Experiments, Analyses, and Improvement. TKDE. 32, 8 (2020), 1475–1488.
[27] Defu Lian, Xing Xie, Enhong Chen, and Hui Xiong. 2021. Product Quantized

Collaborative Filtering. TKDE. 33, 9 (2021), 3284–3296.

[28] Kejing Lu, Mineichi Kudo, Chuan Xiao, and Yoshiharu Ishikawa. 2021. HVS: Hi-
erarchical Graph Structure Based on Voronoi Diagrams for Solving Approximate
Nearest Neighbor Search. PVLDB. 15, 2 (2021), 246–258.

[29] Yury Malkov, Alexander Ponomarenko, Andrey Logvinov, and Vladimir Krylov.
2014. Approximate nearest neighbor algorithm based on navigable small world
graphs. Inf. Syst. 45 (2014), 61–68.

[30] Yury A. Malkov and Dmitry A. Yashunin. 2020. Efficient and Robust Approximate
Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs.
TPAMI. 42, 4 (2020), 824–836.

[31] Stanislav Morozov and Artem Babenko. 2019. Unsupervised Neural Quantization

[32]

for Compressed-Domain Similarity Search. In ICCV. 3036–3045.
Joseph Naor and Yuval Rabani. 2001. Tree packing and approximating k-cuts. In
SODA. 26–27.

[33] Yun Peng, Byron Choi, Tsz Nam Chan, Jianye Yang, and Jianliang Xu. 2023.
Efficient Approximate Nearest Neighbor Search in Multi-dimensional Databases.
Proc. ACM Manag. Data 1, 1 (2023), 54:1–54:27.

[34] Maria Predari and Aurélien Esnard. 2016. A k-Way Greedy Graph Partitioning

with Initial Fixed Vertices for Parallel Applications. In PDP. 280–287.

[35] Liudmila Prokhorenkova and Aleksandr Shekhovtsov. 2020. Graph-based Nearest
Neighbor Search: From Practice to Theory. In ICML, Vol. 119. 7803–7813.
[36] Huzur Saran and Vijay V. Vazirani. 1995. Finding k Cuts within Twice the

Optimal. SIAM J. Comput. 24, 1 (1995), 101–108.

[37] Suhas Jayaram Subramanya, Devvrit, Harsha Vardhan Simhadri, Ravishankar
Krishnaswamy, and Rohan Kadekodi. 2019. Rand-NSG: Fast Accurate Billion-
point Nearest Neighbor Search on a Single Node. In NeurIPS. 13748–13758.
[38] Yao Tian, Ziyang Yue, Ruiyuan Zhang, Xi Zhao, Bolong Zheng, and Xiaofang
Zhou. 2023. Approximate Nearest Neighbor Search in High Dimensional Vector
Databases: Current Research and Future Directions. IEEE Data Eng. Bull. 46, 3
(2023), 39–54.

[39] Yao Tian, Xi Zhao, and Xiaofang Zhou. 2022. DB-LSH: Locality-Sensitive Hashing

with Query-based Dynamic Bucketing. In ICDE. 2250–2262.

[40] Michael Tschannen, Manoj Kumar, Andreas Steiner, Xiaohua Zhai, Neil Houlsby,
and Lucas Beyer. 2023. Image Captioners Are Scalable Vision Learners Too. In
NeurIPS.

[42]

[41] Hongya Wang, Zhizheng Wang, Wei Wang, Yingyuan Xiao, Zeng Zhao, and
Kaixiang Yang. 2020. A note on graph-based nearest neighbor search. arXiv
preprint arXiv:2012.11083 (2020).
Jianguo Wang, Xiaomeng Yi, Rentong Guo, Hai Jin, Peng Xu, Shengjun Li, Xi-
angyu Wang, Xiangzhou Guo, Chengming Li, Xiaohai Xu, Kun Yu, Yuxing Yuan,
Yinghao Zou, Jiquan Long, Yudong Cai, Zhenxiang Li, Zhifeng Zhang, Yihua
Mo, Jun Gu, Ruiyi Jiang, Yi Wei, and Charles Xie. 2021. Milvus: A Purpose-Built
Vector Data Management System. In SIGMOD Conference. 2614–2627.

[43] Mengzhao Wang, Weizhi Xu, Xiaomeng Yi, Songlin Wu, Zhangyang Peng, Xi-
angyu Ke, Yunjun Gao, Xiaoliang Xu, Rentong Guo, and Charles Xie. 2024.
Starling: An I/O-Efficient Disk-Resident Graph Index Framework for High-
Dimensional Vector Similarity Search on Data Segment. Proc. ACM Manag.
Data 2, 1 (2024), V2mod014:1–V2mod014:27.

[44] Xi Zhao, Zhonghan Chen, Kai Huang, Ruiyuan Zhang, Bolong Zheng, and Xiao-
fang Zhou. 2024. Efficient Approximate Maximum Inner Product Search Over
Sparse Vectors. In ICDE. 3961–3974.

[45] Xi Zhao, Yao Tian, Kai Huang, Bolong Zheng, and Xiaofang Zhou. 2023. Towards
Efficient Index Construction and Approximate Nearest Neighbor Search in High-
Dimensional Spaces. PVLDB. 16, 8 (2023), 1979–1991.

[46] Xi Zhao, Bolong Zheng, Xiaomeng Yi, Xiaofan Luan, Charles Xie, Xiaofang Zhou,
and Christian S. Jensen. 2023. FARGO: Fast Maximum Inner Product Search via
Global Multi-Probing. PVLDB. 16, 5 (2023), 1100–1112.

[47] Bolong Zheng, Ziyang Yue, Qi Hu, Xiaomeng Yi, Xiaofan Luan, Charles Xie,
Xiaofang Zhou, and Christian S. Jensen. 2023. Learned Probing Cardinality
Estimation for High-Dimensional Approximate NN Search. In ICDE. 3209–3221.
[48] Bolong Zheng, Xi Zhao, Lianggui Weng, Nguyen Quoc Viet Hung, Hang Liu,
and Christian S. Jensen. 2020. PM-LSH: A Fast and Accurate LSH Framework
for High-Dimensional Approximate NN Search. PVLDB. 13, 5 (2020), 643–655.
[49] Bolong Zheng, Xi Zhao, Lianggui Weng, Quoc Viet Hung Nguyen, Hang Liu, and
Christian S. Jensen. 2022. PM-LSH: a fast and accurate in-memory framework
for high-dimensional approximate NN and closest pair search. VLDB J. 31, 6
(2022), 1339–1363.

4349

