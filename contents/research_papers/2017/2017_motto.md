Multi-Query Optimization for Complex Event
Processing in SAP ESP

Shuhao Zhang1,2, Hoang Tam Vo3∗, Daniel Dahlmeier1, Bingsheng He2
1SAP Innovation Center Singapore, 2National University of Singapore, 3IBM Research, Australia

Abstract—SAP Event Stream Processor (ESP) platform aims
at delivering real-time stream processing and analytics in many
time-critical areas such as Capital Markets, Internet of Things
(IoT) and Data Center Intelligence. SAP ESP allows users to
realize complex event processing (CEP) in the form of pattern
queries. In this paper, we present MOTTO – a multi-query
optimizer in SAP ESP in order to improve the performance
of many concurrent pattern queries. This is motivated by the
observations that many real-world applications usually have
concurrent pattern queries working on the same data streams,
leading to tremendous sharing opportunities among queries. In
MOTTO, we leverage three major sharing techniques, namely
merge, decomposition and operator transformation sharing,
to reduce redundant computation among pattern queries. In
addition, MOTTO supports nested pattern queries as well as
pattern queries with different window sizes. The experiments
the MOTTO with real-world
demonstrate the efﬁciency of
application scenarios and sensitivity studies.

I. INTRODUCTION

Complex event processing (CEP) has been successfully
applied in many areas such as Capital Markets [1], Internet
of Things (IoT) [2] and Data Center Intelligence [3]. Those
domains are usually “big data” applications with high velocity.
SAP ESP aims at delivering real-time stream processing and
analytics in time-critical applications. In SAP ESP, users can
implement their complex event processing tasks in Continuous
Computation Language (CCL).

Figure 1 illustrates an application scenario of stock market
analysis in SAP ESP. Financial analysts may deﬁne their
interested events generated from market data such as <
buy order, stockId > event (i.e., a signiﬁcant buy order
of stock with id of stockId posted in stock market), and
< sell order, stockId > event (i.e., a signiﬁcant sell order
of stock with id of stockId). The analyst may also deﬁne
events generated from other tools such as a report of uptrend
of stock with id of stockId as < uptrend, stockId > and
a report of relative strength index (RSI) of stock with id of
stockId is currently below 30 as < RSIlow, stockId >. The
analyst can then express CEP pattern queries based on those
events in CCL. For instance, Q1 monitors the event that, within
10 minutes, < sell order, M SF T > event happens followed
by < buy order, AAP L > and < buy order, IBM > and
< RSIlow, IBM > is received. Those queries (illustrated in

This work was done while the ﬁrst author was working at SAP. This is
the author’s version of the work. It is posted here for your personal use. Not
for redistribution. The deﬁnitive Version of Record was published in IEEE
33rd International Conference on Data Engineering (ICDE), April 2017, San
Diego, CA, USA, https://doi.org/10.1109/ICDE.2017.166

the middle of Figure 1) continuously monitor input data stream
(illustrated on the left side of Figure 1) and report output
(illustrated on the right side of Figure 1), once the predeﬁned
event patterns are detected. We formally deﬁne the pattern
query in Section II.

Many pattern queries can be registered to the system on
the same data streams. Similarities among pattern queries
create opportunities for sharing optimization. For instance, in
Figure 1, Q1, Q2, and Q3 are all interested in the event of <
buy order, IBM >, and Q1 and Q2 share a common interest
in the event of < RSIlow, IBM >. Evaluating each pattern
query individually results in redundant computing efforts.
Thus, a multi-query optimizer is needed to determine the
sharing opportunities and to realize the sharing for efﬁciency.
We have faced the following challenges in building a multi-

query optimizer for SAP ESP.

1) There can be a large number of pattern queries registered
in SAP ESP. To identify an optimal execution plan
involves the challenge of solving a complex optimization
problem.

2) Pattern queries have different conﬁgurations and struc-
tures, although they may have sharing opportunities.
First, they may have different window constraints. This
poses challenges on correctly sharing among queries
even those with an identical pattern of interest. Second,
pattern queries may be expressed with nested patterns.
Speciﬁcally, a pattern query may involve a complex event
that is the monitoring results of another pattern query.
This further increases the space of identifying sharing.

In this paper, we present MOTTO – a multi-query optimizer
for pattern query processing in SAP ESP. With the ﬂavor of
multi-query optimizations in relational databases, MOTTO is
specially designed for complex event processing in SAP ESP.
To achieve more substantial sharing opportunities, MOTTO
has three sharing techniques that are applied together to
eliminate redundant computation among pattern queries. The
ﬁrst technique, called merge sharing technique (MST), serves
as the basic sharing technique allows the results of one
query to be shared by another
to reduce computational
cost. The second technique, called decomposition sharing
technique (DST), allows sharing computation after proper
decomposition of pattern queries. More precisely, we can
efﬁciently decompose the original pattern query into multiple
sub-queries, so that sharing opportunities based on these sub-
queries can be enabled in a ﬁne-grained manner. The third

Fig. 1: Stock market monitoring application scenario.

technique, called operator transformation technique (OTT),
provides a set of rules for transforming one pattern operator
to another, so that we can discover sharing opportunities for
pattern queries even with different types of operators. We
further extend these sharing techniques (i.e., merge sharing,
decomposition and transformation) to support nested pattern
queries and queries with different window sizes. To ﬁnd the
optimal plan, we map the multi-query optimization problem
into the Directed Steiner Minimum Tree (DSMT) problem [4]
and adopt existing DSMT solvers [4, 5, 6, 7] for the efﬁcient
solution of this problem.

We conduct experimental studies with both real application
scenarios and sensitivity studies. The experimental results
conﬁrm the efﬁciency of MOTTO in improving the efﬁciency
of complex event processing in SAP ESP.

The rest of the paper is organized as follows. Section II
presents preliminary and background. Section III gives an
overview of MOTTO. The sharing techniques are discussed
in detail in Section IV. Section V presents the optimization
problem and our solution. We describe the cost model for
pattern query and sharing techniques in Section VI. We present
the experimental results in Section VII, followed by related
work in Section VIII. We conclude the paper in Section IX.

II. PRELIMINARY

In this section, we brieﬂy introduce the event processing
language named Continuous Computation Language (CCL)
in SAP ESP. CCL is based on SQL and adapted for stream
processing. CCL supports pattern matching on real-time data
streams. The basic structure of a pattern query is speciﬁed as
follows.

SELECT O p e r a n d L i s t
FROM S t r e a m s
MATCHING : [ w i n d o w C o n s t r a i n t : P a t t e r n L i s t ]

We introduce the following terminologies related to this
query structure. Data streams consist of event instances. We
use lower-case letters (e.g., e) to denote event instances, which
can be either primitive events or composite events. Primitive
events are predeﬁned single-occurrence events according to
user interests, which cannot be further divided. Each primitive
event has a timestamp (ts) that denotes the occurrence of the
event (e.g., timestamp of a trade event). Composite events are

a collection of primitive events detected by pattern queries,
such as a composite event (denoted as {e1,e2}) consisting
of an event e1 followed by an event e2, which can be
further used as input to pattern queries. The time-stamp of
a composite event can be a time range depends on the
corresponding pattern query. We force a complete-history
temporal model [8] when a composite event is further used
as input by adding additional time ﬁlter whenever necessary.
An event
type denotes the unique feature associated with
event instances, which is used in pattern query to specify
the desired event pattern. We use uppercase letters to denote
event type (e.g., Ei denotes the type of event instance ei).
The event types speciﬁed in the pattern query is called operand
and forming the OperandList. PatternList connects operands
together by pattern operators to form a pattern of event types
to be monitored. WindowConstraint requires that the events
composing the monitoring event pattern of the query occur
within the speciﬁed time interval.

For the ease of presentation on sharing opportunities, we
focus on the techniques for pattern queries on the same
stream (i.e., no sharing otherwise). Also, we assume they have
the same window sizes, and extend the support for different
window sizes and nested pattern query in Section IV-D. In the
following, we denote query in the form of “Pattern operator
(OperandList)” for compactness.

SAP ESP supports the following pattern operators:

• Conjunction (CONJ or &) requires the occurrence of all
operands, regardless of their arrival order. For example,
CONJ(E1&E2) produces a composite event of
type
{E1&E2} if both events of type E1 and E2 happen
within window constraint regardless of their occurrence
sequence.

• Disjunction (DISJ or |) requires, at least, one occurrence
of operands in order to generate output. For example,
DISJ (E1|E2) produces an event of type (a) {E1&E2}
if both events of type E1 and E2 occurred, or (b) {E1
(E2)} if the only event of type E1 (E2) occurred. To
simplify notation, we use {E1|E2} to denote both cases.
• Sequence (SEQ or ,) requires the ordered occurrence
of all operands linked by it. For instance, SEQ(E1, E2)
generates a composite event of type {E1, E2} if an event
of type E1 and E2 occurred sequentially, not necessary

Market dataTimestampEvent14:50/11/16/2001<sell_order, MSFT>14:50/11/16/2001<buy_order, AAPL>14:52/11/16/2001<buy_order, YHOO>14:53/11/16/2001<buy_order, IBM>……Tools reportTimestampEvent14:51/11/16/2001<RSIlow, IBM>14:52/11/16/2001<uptrend, AAPL>……OutputQidQueryexpressionQ1SELECT*FROMMarket data, Tools reportMATCHING[10 minutes: <sell_order, MSFT>,<buy_order, AAPL>,<buy_order, IBM>)&<RSIlow, IBM> ]Q2SELECT*FROMMarket data, Tools reportMATCHING[5 minutes: <RSIlow, IBM> & <buy_order, AAPL>,<buy_order, YHOO>,<buy_order, IBM> ]Q3SELECT*FROMMarket data, Tools reportMATCHING[3 minutes: <buy_order, AAPL>,<buy_order, IBM>,!(<RSIlow, AAPL>)]……SAP ESPTimestampEvent14:51/11/16/2001Output of Q114:53/11/16/2001Output of Q214:53/11/16/2001Output of Q3……External DatabasesFig. 2: Jumbo Query Plan.

continuously (i.e., other events may happen in between).
• Negation (NEG or !) is an unary operator and must be
used with SEQ or CONJ. For instance, SEQ(E1, E3,
NEG(E2)) requires an event of type E1, and E3 occur
sequentially, but no event of E2 happen (regardless of
the arrival order of E2) within the speciﬁed window
constraint. In SAP ESP, pattern matching on NEG is
evaluated to be successful only after the expiration of
the speciﬁed time interval. When NEG is used with
SEQ, changing the ordering or grouping of it does
not change semantic. We assume NEG always be the
last component of the query, which is because events
succeeding the NEG will never be evaluated by the
pattern match engine owing to the expiration of the
time interval. For example, SEQ(E1,NEG(E2),E3) is
equivalent to SEQ(E1,E3,NEG(E2)).

We discuss

two key properties

(commutativity and
associativity) for each operator, which are important for
the sharing techniques. 1) Commutativity: CONJ and DISJ
are commutative, but SEQ is not
[9]. 2) Associativity:
CONJ and DISJ are associative since they do not require
the associativity for
order of the operands [9]. However,
SEQ does not naturally hold but depends on the temporal
model
time
[8]. Here, we need to use an additional
constraint to preserve associative property for SEQ operator.
instance, we preserve semantic equivalence between
For
SEQ((E1, E2), E3) (left-associative plan) and SEQ(E1, (E2,
E3)) (right-associative plan), by adding additional time ﬁlter
operation E2.ts < E3.ts and E1.ts < E2.ts after the pattern
queries, respectively. This effectively forces complete-history
temporary model and is being used when the composite event
is used as input event as mentioned before.

III. MOTTO WORKFLOW OVERVIEW

In this section, we present

the workﬂow overview for
MOTTO, a multi-query optimizer in SAP ESP. The multi-
query optimization is motivated by many applications
consisting of queries with a lot of sharing opportunities.

We use jumbo query plan (JQP) to denote the query
execution plans involving a set of pattern queries. We illustrate
the notation of JQP in Figure 2. This JQP represents the
execution plan that all queries are directly connected to the
data source, and no sharing optimization are applied.

There are two main modules in MOTTO:
(1) Query Rewriter. This module applies sharing techniques
to a given workload and produces different execution plans.

Fig. 3: Multi-query optimization workﬂow of MOTTO.

In this paper, we present
the
basic merge sharing, and two ﬁne-grained sharing techniques
namely decomposition sharing and operator transformation.

three sharing techniques:

(2) Query Planner. This module examines all possible
execution plans produced by query rewriter and selects the
most efﬁcient one. It employs a search strategy based on
branch and bound. A cost model
is used to estimate the
cost of each execution plan with or without applying sharing
techniques.

Given a workload consisting of multiple pattern queries,
MOTTO identiﬁes the sharing opportunities among pattern
queries and ﬁnds the most efﬁcient JQP for those queries.
The optimal JQP is submitted to SAP ESP for execution. The
workﬂow of MOTTO is shown in Figure 3, where the input
is a workload containing multiple pattern queries.

IV. QUERY REWRITER

In this section, we introduce the detailed design for sharing
techniques in MOTTO. We start with a basic sharing technique
named merge sharing, and then two ﬁne-grained techniques
named decomposition sharing and operator transformation.
For each technique, we present its deﬁnition, followed by how
to apply the techniques on queries and discuss the correctness
regarding semantic equivalence. We also give some simple
examples to illustrate our techniques. At
the end of this
section, we extend the sharing techniques to nested pattern
queries and queries with different window constraints.

We ﬁrst deﬁne sharing dependency between two queries as

follows.

DEFINITION 1. A source query is a query whose generated
composite events are shared by its beneﬁciary query. Each
source query can have multiple beneﬁciaries and vice versa.

A. Merge Sharing Technique

The main idea of Merge Sharing Technique (MST) is that
we can conceptually merge the results of one query into
another. It applies to queries with the same pattern operator
and same window constraint. This basic sharing strategy is
inspired by the previous study [10].

Given two pattern queries, q = OP(L), q(cid:48) = OP(L(cid:48)), where
OP stands for SEQ/CONJ/DISJ, we consider the following two
cases for merge sharing. In both cases, q is the source query,
and q(cid:48) is the beneﬁciary query.

(a) Substring case: L is a substring of L(cid:48). Then, L and L(cid:48)
can share their common pre/in/sufﬁx, which is straightforward.
(b) Non-substring case: L is subsequence, but not
the

substring of L(cid:48).

The detailed procedure of the merge operation depends on
the type of pattern query: (1) if OP is SEQ, then merge
operation stands for linking operands of the type of generated

: Data flow (from left to right): E3E2E1Pattern queriesqi...q2q1Subscriber: Final output to user: Primitive event buffer:Send the corresponding type of events continuously: E1,E2...q..…QueryiMOTTOQuery RewriterQuery PlannerQueryOptSAP ESPFig. 4: Example of applying merge sharing technique.

composite event from q and the rest type of events of q(cid:48) by a
CONJ operator. An extra ﬁlter operation may be required to
enforce the correct sequence; (2) if OP is CONJ/DISJ, then
merge operation stands for linking operands of the type of
generated composite event from q and the rest type of events of
q(cid:48) by the same operator. Essentially, the original q(cid:48) is replaced
by the merge operation, which takes results from another query
as its input.

Example 1. Figure 4 illustrates one example of applying MST
upon q1 = SEQ(E1, E2, E3) and q2 = SEQ(E1, E3). Note
that, q(cid:48)
1 = CONJ({E1,E3}&E2), which is essentially the merge
operation. Although an extra ﬁlter E1.ts < E2.ts < E3.ts is
needed to enforce the correct time sequence of event of type
E2, the pattern detection process of events of type E1 and E3
is shared, which reduces the total computing cost.

Application of MST. Given two pattern queries with
operand list L and L(cid:48), the searching for sharing opportunities
based on MST essentially involves checking whether L (L(cid:48)) is
substring or subsequence of L(cid:48) (L). This can be simply done
by traversing through one of the lists, which requires O(n)
where n is the length of the shorter one of L and L(cid:48).
Semantic equivalence. After applying MST,

there is a
possibility of changing the grouping of operands in the
substring case, and a possibility of changing in operand
order in the non-substring case. We brieﬂy show that MST
has semantic equivalence in both cases. For CONJ/DISJ, the
semantic equivalence in both cases is guaranteed by their
associative and commutative property. In other words, merging
the results with the rest in any order should produce the same
results. For SEQ, the correctness in substring case is given
by its associative property. In non-substring case, after we
merge the results using a CONJ operator, an extra time ﬁlter
to enforce the correct sequence as shown in Example 1.

B. Decomposition Sharing Technique

One of the restrictions of MST is that a query can only
share its results entirely with another or none. We propose
decomposition sharing technique (DST) in MOTTO to enable
more sharing among queries.

Pattern query decomposition. A pattern query can be
decomposed into multiple sub-queries without changing its
semantic meaning [9, 11]. We call a query plan is left (resp.
right) decomposed plan if we sequentially break its original
query plan in such a way that we always break the preﬁx (resp.
sufﬁx) two operands into one sub-query, which then connect

Fig. 5: Decomposed query plan of q3 and q4

with the rest. By mixing left and right decomposition, we can
get a decomposed plan with decomposition at arbitrary places.
We denote decomposed query plan with the form of “sub-
query” → “the rest part of original query”, where → means
connecting the output of left operation (upstream) to the input
of right operation (downstream).

Essentially, a sub-query is a source query of its original
query. Applying DST reduces global execution cost because
the generated sub-queries from multiple queries may be simply
combined (if they are identical) or may be optimized by
applying sharing techniques such as MST. Figure 5 (a) and
(b) illustrate one of decomposed query plans of q3 = SEQ(E1,
E2, E4) and q4 = SEQ(E2, E4, E3), respectively. Each of the
decomposed query plans can be denoted as SEQ(E2,E4) →
SEQ(E1,{E2,E4}), and SEQ(E2,E4) → SEQ({E2,E4},E3),
where {E2,E4} stands for the composite event type generated
from SEQ(E2,E4). Note that
they employ common sub-
queries: q(cid:48)
4 = qx = SEQ(E2,E4), we can therefore simply
combine them to serve both queries.

3 = q(cid:48)

Given two pattern queries (q, q(cid:48)), we apply DST in the

following two steps.

Step 1: rewrite the query plan into different decomposed

plans.

Step 2: for each pair of sub-queries from the decomposed
they are combined into one if they are identical.

plans,
Otherwise, apply MST between them.

Example 2. As shown in Figures 6, (a) represents the original
JQP of q3 and q4; (b) represents the JQP of combined
decomposed plan of q3 and q4; (c) represents the JQP
after combining their common sub-queries: q(cid:48)
4 = qx =
SEQ(E2,E4).

3 = q(cid:48)

Application of DST. A naive solution to identify sharing
opportunities between two pattern queries with n operands
based on DST is that we shall ﬁrst generate all possible sub-
queries, i.e., n∗(n−1)
of one query, and then check each pair
of sub-queries whether applying MST on them brings beneﬁts.
Identifying sharing between two pattern queries hence requires
O(n4). Therefore,
identifying among m queries based on
(cid:1) ∗ n4), which is computationally
this approach requires O((cid:0)m
2
expensive considering m can also be large in practice.

2

In the following, we introduce a simple yet effective
approach to realize the sharing by DST. Our approach is
based on a concept named interesting sub-query, which is a
common sub-query between a pair of two queries that may be
used to generate optimized query plan by sharing the result of
it. There can be multiple interesting sub-queries between two

E2.ts > E1.tsE2.ts < E3.tsE3E2E1E3E2(b) Optimized JQP of q1 and q2(a) Original JQP of q1 and q2q2q1E1q2q1'E3E4E2q4''q4'E1E4E2(b) Left decomposed query plan of q4(a) Right decomposed query plan of q3q3''q3'M S2 is used to build q(cid:48)
build q(cid:48)(cid:48)
s = SEQ(E7, E8). qs, q(cid:48)
interesting sub-queries of q6 and q7.

s = SEQ(E1, E3, E6), S5 is used to
s are then marked as

s and q(cid:48)(cid:48)

It is noteworthy that there might be sharing opportunities
between the generated sub-queries as well. After we identify
all the interesting sub-queries, we need to search recursively
among them. This process may create further sub-queries. The
searching only stops when no more interesting sub-queries can
be identiﬁed.

There are two issues worth noting. First, we maintain all
interesting sub-queries between every pair of two queries. The
selecting of those sub-queries are left to the query planner
to decide as we discuss in Section V. Second, given the
commutative and associative properties of CONJ/DISJ, we
pre-sort non-ordered operators on their operand list according
to a predeﬁned order (e.g., lexicographical order), so that the
same method can be used for them.

Here, we further highlights an example where MST and
DST work in combination to enable sharing between two
queries, which otherwise have to be executed independently.

q9

not

only

does

generate

4. Only

applying MST or

= SEQ(E1,E3,E4)

applying
Example
DST without MST between q8 = SEQ(E1,E2,E3,E5)
and
any
alternative plans. However, we can decompose them into
SEQ(E1,E2,E3) → SEQ({E1,E2,E3},E5) and SEQ(E1,E3)
→ SEQ({E1,E3},E4), respectively. After that, MST can
be applied between the sub-queries SEQ(E1,E2,E3) and
SEQ(E1,E3)
to reduce the total computing cost. Note,
this example also reafﬁrms that sub-expression sharing is
inadequate compared to our techniques. As according to
sub-expression sharing, we can only merge the common preﬁx
E1 between two queries.

Semantic equivalence. Essentially, decomposition changes
the operands grouping of the original query plan. Since
associative property holds for SEQ/CONJ/DISJ pattern query,
changing the operands grouping does not alter the semantic
of the query. Therefore, the decomposed plan is semantic
equivalent to the original.

C. Operator Transformation Technique

It

is noteworthy that only queries that use the same
type of pattern operators can share computation between
each other based on MST and DST. For instance, sharing
opportunities between SEQ(E1, E2, E3) and CONJ(E1& E2&
E3) are overlooked even they look at the same event types.
However, we observe that the pattern operator itself can be
transformed to each other. Thus, it is possible to create sharing
opportunities with operator transformation. Based on this, we
develop another technique called Operator Transformation
Technique (OTT).

Table I

summarizes

the formulation and description
of
the three transformation rules. The transformation is
comprehensive for the operators that are considered in this
paper. Examples are further presented in Figure 7.

Fig. 6: Example of
technique.

applying decomposition sharing

queries. We introduce an approach to identify the interesting
sub-queries quickly.

The idea is that we directly search based on the operand
list of each two queries. As a result, this problem can be
essentially transformed into the problem of ﬁnding all common
substrings.

A simple solution for ﬁnding all common substrings
between string L and L(cid:48) works as follows. First, build a sufﬁx
tree for the L, all the nodes in the developed sufﬁx tree are
marked as left. Then, all the sufﬁxes of L(cid:48) are inserted in
the sufﬁx tree. During the insertion, all old nodes that the
sufﬁxes pass through (or new node created) are marked as
right. Finally, the paths of every node that are marked with
both left and right are all common substrings of L and L(cid:48).
The construction of sufﬁx tree can be done in linear time [12].
Hence, the run-time complexity of this method is in linear time
and is proportional to the number of matches.

After that, all identiﬁed common substrings with the length
greater than one can be used to build common sub-queries that
can be naturally combined to serve both queries. All common
strings of length one are sequentially combined into “long”
string. To preserve correct sequence, common strings of length
one that appears in reverse order must be separate into different
“long” string, when SEQ is used. Then, these “long” strings
are used to build an MST applicable sub-queries that can be
shared by both queries by merging its results.

Example 3. We use q6 = SEQ(E1,E2,E3,E5,E6,E7,E8),
q7 = SEQ(E1,E3,E6,E5,E7,E8) as an example to illustrate
the searching for sharing opportunities. First, we identify
all common substrings based on their operand list. Five
common substrings can be identiﬁed as follows, S1:“E1”;
S2:“E3”; S3:“E5”; S4:“E6”; S5:“E7, E8”. Next, we merge
all common substrings of length one into one string. Since
S3 and S4 appear in reverse order in two SEQ queries, they
are separated. As a result, three common strings are ﬁnally
generated, M S1: “E1, E3, E5”; M S2: “E1, E3, E6”; S5:
“E7, E8”. Then, M S1 is used to build qs = SEQ(E1, E3, E5),

identicalq4''E3qxE1E4E2q3''q4''E3q4'E3E1E4E2E1E4E2q3''q3'(c) Optimized JQP of q3 and q4(b) Decomposed JQP of q3 and q4(a) Original JQP of q3 and q4q4q3TABLE I: Details of the three transformation rules. L stands for the operand list involving E1,E2,...,En.

Name
SEQ to CONJ

Formulation
SEQ(L)=Filtersc(CONJ(L))

CONJ to DISJ

CONJ(L)=Filtercd(DISJ(L))

SEQ to DISJ

SEQ(L)=Filtersc(Filtercd(DISJ(L)))

Description
Filtersc (op) works as follows: for each composite event generated by op, Filtersc output it if
and only if E1.ts < E2.ts <...< En.ts, where ts refer to the timestamp of the event.
Filtercd (op) works as follows: for each composite event generated by op, Filtercd eliminates
it unless the result is a composite event consist of all types of events in L.
It can be naturally derived by composing SEQ to CONJ and CONJ to DISJ.

Fig. 7: Examples of three transformation rules.

Given two pattern queries q, q(cid:48), according to Table I, if there
is a rule to transform the operator of q into the operator of q(cid:48),
we can enable sharing of OTT in the following two steps.

Step 1:

transform q into q∗ based on the operator

transformation rules so that q∗ use the same operator as q(cid:48).

Step 2: apply DST between q∗ and q(cid:48).
Application of OTT. When OTT is enabled, the same
method applied to DST can be further used for pattern queries
with different operators based on transformation rules.

Semantic

equivalence. The semantic equivalence of
operator transformation is naturally given by the deﬁnition of
pattern operators.

Example 5. Consider q2 = SEQ(E1, E3) and q5 = CONJ(E1&
E3). Since q2 requires different pattern operators to q5, there
is no way to share computation between them. Figure 8
illustrates an example of applying operator transformation
technique based on q2 and q5. (a) represents the original
jumbo query plan (JQP) where q2 and q5 are executed
independently; (b) represents the JQP after applying operator
transformation on q2; (c) represents the optimized query plan,
where q5 is combined with q∗
2. Effectively, the optimized plan
replaces q2 with a F iltersc operation, which results in a more
efﬁcient JQP because of the signiﬁcantly reduced input size.

Furthermore, the following example highlights how OTT

can work in combination with DST.

Example 6. Consider query q10 = CONJ(E1&E2&E4) and q1
= SEQ(E1, E2, E3). According to the transformation rules, q1
can be transformed into q∗
1 = CONJ(E1
&E2&E3). There is still no way to share computation between
q10 and q∗
1 each
can be decomposed with sub-query: qx = qy = CONJ(E1&E2),

1 even with MST applied. However, q10 and q∗

1 → F iltersc, where q∗

Fig. 8: Example of applying operator
technique.

transformation

Fig. 9: Example of applying OTT in combination with DST.

which can be simply combined to serve both q10 and q1, as
shown in Figure 9.

D. Extension of sharing techniques

The previous

subsections assume the same window
constraints for all pattern queries. We now discuss how to
extend our sharing techniques to handle nested pattern queries
and queries with different window sizes.

Handling Nested Pattern Query. To efﬁciently and
correctly identify sharing opportunities within and between
nested CEP queries, we divide nested CEP queries into
multiple non-nested sub-queries, and then apply sharing
techniques between every pair of generated non-nested pattern
queries.

DEFINITION 2. The nested level speciﬁes the nested layer
of nested pattern queries. We denote the most inner nested
layer as level 1, its closest outer layer as level 2, and so on
until most outer layer as level n.

We divide an nested pattern query into a series of non-nested
sub-queries in an iterative process. Given an nested pattern

E3E1E2E1.ts<E2.tsE2.ts<E3.tsE1!=nullE2!=nullE3!=nullDISJ(E1|E2|E3)E3E1E2CONJ (E1&E2&E3)E3E1E2SEQ (E1,E2,E3)E3E1E2E3E1E2(c) SEQ to DISJ.E1!=nullE2!=nullE3!=nullDISJ(E1|E2|E3)CONJ (E1&E2&E3)E3E1E2E1.ts<E2.tsE2.ts<E3.ts(a) SEQ to CONJ.SEQ (E1,E2,E3)(b) CONJ to DISJ.E1.ts<E3.tsE3E1E3E1E1.ts<E3.tsidenticalq5E3q2*(b) Transformed JQP of q2 and q5q5(c) Optimized JQP of q2 and q5(a) Original JQP of q2 and q5q5q2E1E1.ts<E2.tsE2.ts<E3.tsE1.ts<E2.tsE2.ts<E3.tsE3E1E4E2E3E1E4E2E3E1E4E2E1.ts<E2.tsE2.ts<E3.tsidenticalqxq10q1*qyqxq10q1*q10q1*E3E1E4E2(b) Transformed JQP of q1 and q10(c) Decomposed JQP of q1 and q10(d) Optimized JQP of q1 and q10(a) Original JQP of q1 and q10q10q1query q, start from level n−1, divide it into a sub-query qinner
and connect qinner to q by replacing the corresponding part
of PatternList by event type of output of qinner. Thereafter,
q can be denoted as qinner → q∗, where q∗ becomes non-
nested. Repeat the procedure on qinner until there is no more
nested pattern query. If more than one nested sub-queries in
the same nested level, we divide them together as (qinner1 ,
qinner2 , ..., , qinnern ) → q∗, where qinner1 , qinner2 , ..., ,
qinnern are all connected to q∗.

After dividing both queries, we can apply the aforemen-
tioned three sharing techniques among the generated non-
nested sub-queries.

Example 7. Table II illustrates the process of dividing q11 =
SEQ(E1, DISJ(E4|E5), CONJ(E2&E3)) and q12 = SEQ(E1,
CONJ(E2&E3)). Note that, Eγ(cid:48) = {E4 | E5} and Eγ(cid:48)(cid:48)
= {E2 & E3} denote the composite event type generated
from corresponding inner nested sub-queries (i.e., qinner1
and
qinner2
11

).

11

Table III illustrates the searching process of identifying
sharing opportunities among the generated non-nested sub-
queries of q11 and q12, which requires six iterations. At
3rd iteration, we identify CONJ(E2&E3) as a common sub-
query, which is then marked as “interesting sub-query.” At 6th
iteration, we identify SEQ(E1, Eγ(cid:48)(cid:48)) as MST applicable sub-
query, which is also marked as “interesting sub-query”. Both
“interesting sub-queries” are kept, and let the query planner
decide which one should be eventually selected to optimize the
jumbo query plan globally.

TABLE II: Divide q11 and q12.

Target

Final divided query plan

q11

q12

(qinner1
11

, qinner2
11
→ q∗
11

)

12nner → q∗
qi
12

Detail explanations on terms
qinner1
= DISJ(E4| E5),
11
qinner2
= CONJ(E2&E3),
11
q∗
11 = SEQ(E1,Eγ(cid:48) , Eγ(cid:48)(cid:48) )
qinner
= CONJ(E2&E3),
12
q∗
12 = SEQ(E1, Eγ(cid:48)(cid:48) )

TABLE III: Identifying sharing opportunities between q11
and q12.

Iteration

1
2
3
4
5
6

sub-queries
of q11
qinner1
11

qinner2
11

q∗
11

sub-queries
of q12
qinner
12
q∗
12
qinner
12
q∗
12
qinner
12
q∗
12

output

null
null
CONJ(E2&E3)
null
null
SEQ(E1, Eγ(cid:48)(cid:48) )

Handling Different Window Constraints. Pattern queries
subscribed by multiple users may have different window
constraints. We now discuss how to apply the sharing
techniques discussed before to pattern queries with different
window constraints.

Consider applying sharing techniques as before on two
queries with different window constraints, the resulting source
query (denoted as qs), and the beneﬁciary query (denoted as
qb) may have different window constraints. We denote their
shared composite event as Ecompo, and denote Ef irst and

Elast as the ﬁrst and the last primitive events in Ecompo,
respectively. For example, consider q2 (as qs) = SEQ(E1,E3)
and q1 (as qb) = SEQ(E1,E2,E3). Ef irst = E1, Elast = E3,
and Ecompo is {E1,E3}. Ecompo should be detected by q2,
and be shared to q1. Intuitively, if Elast arrives exceeding the
larger window constraint of them, no composite event should
be produced.

The basic idea is that we ﬁrst assume qs and qb are
shareable, and then ﬁlter out
the results which violate
window constraint. We analyze two cases of varying window
constraints between qs and qb, and we have following
observations for each case.

Case 1: qs has a larger window than qb. In this case, we
have three scenarios to consider: 1) If Elast arrives within
qb’s window, Ecompo is detected by qs, and is shared by
qb (denoted as “shared”); 2) If Elast arrives exceeding qb’s
window but within qs’s window, Ecompo is being detected by
qb, but should not be shared by qb (denoted as “ﬁltered”); 3) If
Elast arrives exceeding qs’s window, Ecompo is not generated
and can be safely discarded since it violates both queries’
window constraints (denoted as “discard”).

Case 2: qs has a smaller window than qb. In this case, we
have two scenarios to consider: 1) If Elast arrives within qs’s
window, Ecompo is detected by qs, and is shared by qb (denoted
as “shared”). 2) If Elast arrives exceeding qs’s window but
within qb’s window, Ecompo cannot be detected by qs (denoted
as “fail to share”).

Based on the above analysis, we propose a window mark-

point strategy to handle each case described as follows.

For the ﬁrst case, we align the beneﬁciary query (qb)’s
upper window bound to the source query (qs) and make
the alignment point as the mark point. The results from qs
can be used to answer qb by ﬁltering out those composite
events spanning across the mark point, which violate qb’s
window constraint. For the second case, in order to solve
the aforementioned “fail-to-share” issue, we propose to ﬁrst
extend the window of qs into the same of qb, resulting in
q(cid:48)
s. Thereafter, the extended source query (q(cid:48)
s) can be used to
answer qb as they have same window constraint. To answer
the source query (qs), we mark the alignment point of qs and
q(cid:48)
s similar to the ﬁrst case. Then, we can let the generated
composite events from q(cid:48)
s answer qs, but ﬁlter out the events
spanning across the mark point, since they violate window
constraint of qs.

Figure 10 illustrates the details of how to realize sharing
opportunities between pattern queries with different window
sizes: (a) where qs has a larger window than qb; (b) where qs
has a smaller window than qb, with the “fail to share” issue;
(c) how to extend qs’s window to solve the “fail to share”
issue.

Finally, we analyze the overhead of the two cases in
handling the window constraints. In the ﬁrst case, the overhead
of adding the additional ﬁlter operation is negligible. In
the second case,
the overhead mainly originates from the
additional cost of extended source query compare to the
original source query due to the larger window size. If the

Fig. 10: Window mark-point strategy.

overhead of extending the window offsets its beneﬁts, we
choose not to apply sharing techniques on this pair of queries.

V. QUERY PLANER

After applying the aforementioned sharing techniques in
the previous section among multiple queries in a workload,
MOTTO generates many query plans. The query planner is
used to identify the most efﬁcient query plan. In this section,
we introduce the implementation details. We ﬁrst formulate
the problem and subsequently describe our solution to the
problem.

A. Problem Formulation

Applying sharing technique (i.e., MST/DST/OTT) between
two queries causes a JQP transformation since it essentially
causes a change in JQP. If a workload contains many queries, a
signiﬁcant number of alternative JQPs can be generated. This
process can be conceptually modeled as a JQP search tree
deﬁned as below.

DEFINITION 3. JQP Search Tree. Given a batch of queries,
the default JQP stands for every pattern queries executed
independently. Let
the root of a tree be the default JQP.
Starting from the root, for every JQP transformation, we add
a new node to the tree and add an edge from the old node to
the new node. The old node and the new node correspond to
original JQP and new JQP, respectively. The edge represents
the sharing techniques applied to make the transformation
happen. The resulting tree is called a JQP search tree.

DEFINITION 4. The optimal jumbo query plan, denoted by
JQPopt is the JQP such that ∀JQP s in the JQP search tree,
Cost(JQPopt) ≤ Cost(JQP ).

Given a set of input queries, our optimization problem is
to ﬁnd an optimal JQP, which is the JQPopt in the JQP
search tree. From each node of the JQP search tree, we ideally
need to consider all three sharing techniques for the JQP
transformation. However, in practice, we only need to consider
feasible JQP transformation.

Figure 11 illustrates the search process for conceptual JQP
search tree for an example workload contains the following

Fig. 11: Conceptual search tree of the example workload.

queries: q1= SEQ(E1, E2, E3), q2= SEQ(E1, E3), q3=
SEQ(E1, E2, E4), q4= SEQ(E2, E4, E3), and q5= CONJ(E1&
E3). Although each of the three techniques can be applied
the decision of one sharing plan between two
together,
queries may be in conﬂict with the decision of sharing
plan considering another query. For instance, the decision to
share sub-query qx= SEQ(E1,E2) between q1 and q3 and the
decision to share computing of q2 entirely to q1 by MST are in
conﬂict. Because the former requires q1 been decomposed into
SEQ(E1,E2) → SEQ({E1,E2},E3), while the later requires q1
been replaced by a merge operation CONJ({E1,E3}&E2).

B. Generating Query Plan

We solve the problem by formulating the search process of
JQP search tree to the problem of solving the Directed Steiner
Minimum Tree (DSMT) problem [4].

The Directed Steiner Minimum Tree (DSMT) Problem
is deﬁned as follows. Given a directed weighted graph
G = (V, E) with a cost ci on each edge ei, a speciﬁed root r
∈ V , and a subset of vertices X ⊆ V (called Terminal nodes).
The goal is to ﬁnd a tree with minimum cost rooted at r and
spanning all the vertices in X (in other words, r should have
a path to every vertex in X). The cost of the tree is deﬁned
as the sum of the costs of the edges in the tree. Note that the
tree may include vertices not in X as well (these are known
as Steiner nodes).

Our optimization problem can be mapped to DSMT as
follows. Queries in the submitted workload are treated as
Terminal nodes since they are required by users and must be
selected. “Interesting sub-queries” identiﬁed by application of
sharing techniques are treated as Steiner nodes since they may
or may not need to be selected (executed). We add one special
query q0 with no execution cost as root into G, called virtual
ground. q0 is treated as a Terminal node. For every query
(including sub-query) we insert an edge from q0 representing
computing from scratch. If a query can be computed based on
results of another, either query (in the case of MST &/ OTT)
or sub-query (in the case of DST &/ OTT), then add an edge
from the source query to the beneﬁciary query. The weight on

qb.wqs.w(a) qshas a larger window than qb.Mark pointqs.wqb.w(b) qshas a smaller window than qb.qs.wqb.wMark point(c) Extend qswindow and mark the alignment.q's.wtimetimetimeEstartsharedfiltereddiscardsharedsharedfiltereddiscardEstartElastEstartElastElastElastElastElastElastElastFail to share............E3E1E4E2q4q3q1Rootq5q2E3E1E4E2q4q3q5Node 1q1'q2OTT(q2,q5)Node 5Node 3OTT(q2,q5)Node 2DST(q1,q3)....Node 4Node 1RootMST(q1,q2)DST(q3,q4)E2.ts > E1.tsE2.ts < E3.tsOTT. With OTT, queries with different pattern operator
that otherwise have to be executed independently can now
share their computation. Take q2 = SEQ(E1, E3) and q5 =
CONJ(E1& E3) to illustrate. q2 can be transformed to q(cid:48)
2 =
CONJ (E1&E3) → ﬁltersc. Thus,

Cost(q2)=Cost(q(cid:48)

2) + Cost(f iltersc).

In this case, q(cid:48)
compute cost) since they are identical,

2 can be answered by q5 entirely (i.e., no

Cost(q2|q5)=Cost(q(cid:48)

2) + Cost(f iltersc)=Cost(f iltersc).

VII. EXPERIMENTS

In this section, we experimentally evaluate MOTTO in SAP
ESP. Overall,
there are two groups of experiments. First,
we show the performance comparison of different sharing
techniques in two real application scenarios (Section VII-B).
Second, we perform sensitivity studies to gain a better
understanding of the effectiveness of MOTTO in varies aspects
(Section VII-C).

A. Experimental Setup

All experiments are conducted on a virtual machine (VM)
in SAP Monsoon cloud infrastructure with the conﬁguration
as follows. The VM is running on Intel Xeon-E7-4830 CPU
processors (2.2 GHz) with Ubuntu 14.10. We ﬁx one core to
publish streaming data and all other cores for running MOTTO
on top of SAP ESP. We vary the number of CPU cores used
for MOTTO and SAP ESP for sensitivity studies and ﬁx each
core with 2GB memory. By default, the experiments run on a
VM with 4 CPU cores and 8GB of memory.

To evaluate MOTTO, we have also implemented a number

of sharing techniques:

• NA: the baseline executes pattern queries independently

(without any sharing).

• MST (merge sharing technique): this approach requires
one query to be shared entirely with other queries. This
technique has been used in the previous study [10].
• LCSE (longest common sub-expression sharing):

this
approach identiﬁes the longest common sub-expression
among pattern queries to be shared. It has more sharing
opportunities than MST and has been used in many
previous studies (e.g., [13, 14, 15]).

Application Scenario. We consider two different applica-
tion scenarios, namely stock market monitoring and data center
monitoring [3]. According to the application scenarios, pattern
queries in stock market monitoring have relatively longer
operand lists compared to data center monitoring workload.

Since Figure 1 has already demonstrated the scenario of
stock market monitoring, we here illustrate two sample queries
for data center monitoring. qa = SEQ(Es,Ed,Ee,NEG(Ea))
is used to identify if any network transmitting problem. Es
and Ee stand for “Start transmit” and “End transmit” events,
which are generated on the packet-sending-site to indicate
the successful starting and ending of packet
transmission.
Ed denotes “Delivery successful notiﬁcation” event, which

Fig. 12: Optimal plan of the example workload represented
by Steiner Minimum Tree.

edge represents the cost of executing the query based on the
source (either q0 or other queries).

The DSMT problem is well studied in the literature and
it
is NP-complete [4]. To consider the tradeoff between
optimization overhead and quality of the solution, we apply
branch-and-bound algorithm [4] to get an exact solution when
optimization process takes less than the conﬁgured time budget
(e.g., 5 minutes) and switch to a simulated-annealing-based
approximate solution [6] for larger problem sizes.

Example 8. Figure 12 illustrates the optimal plan of the
example workload represented by Steiner Minimum Tree
(highlighted by the bold lines).

VI. COST MODEL
As discussed in Section V, in order to solve the DSMT
problem, we need to compare the cost of different jumbo query
plan. Hence, in this section, we brieﬂy show how to estimate
the cost of query plan with one of the sharing techniques
applied. By substituting the cost model for each individual
query (the original query or sub-pattern query) of SAP ESP,
we can then estimate the cost of query plan with or without
sharing techniques applied. We denote the cost to calculate qi
based on qx as Cost(qi | qx), which is the weight of the edge
from qx to qi.

MST. Consider q1 = SEQ(E1, E2, E3) and q2 = SEQ(E1,
E3). q1 can be computed based on q2 through a merge
operation (q(cid:48)
1) as illustrated previously in Figure 4. Therefore,
Cost(q1|q2)=Cost(q(cid:48)

1) + Cost(f ilter),

where q(cid:48)
1 = CONJ({E1,E3}&E2), and its cost can be obtained
by substituting the cost model for each individual query of
SAP ESP. Note that {E1,E3} denotes the type of event
generated from q2.

DST. Consider q3 = SEQ(E1, E2, E4) and q4 = SEQ(E2,
E4, E3). Right decomposed query plan of q3 can be
represented as SEQ(E2,E4) → SEQ (E1,{E2,E4}), and q4 can
be left composed into SEQ(E2,E4) → SEQ({E2,E4},E3). Let
qx = SEQ(E2,E4), which is shared by both q3 and q4.

Cost(q3|qx)=Cost(q(cid:48)

3), Cost(q4|qx) = Cost(q(cid:48)

4),

3 = SEQ(E1,{E2,E4}), q(cid:48)
where q(cid:48)
their cost can be calculated similarly as q(cid:48)
1.

4 = SEQ({E2,E4},E3), and

MSTDSTDSTq5interesting sub-queriesSEQ(..)query xqxVirtual Groundq3SEQ(E2,E4)SEQ(E1,E2)q4q2q1Execute fromscratchOTT DSTMST (point tobeneficiary)OTTis generated by the network routers that
indicates the
successful receive and re-route the corresponding packet. Ea
denotes “Acknowledgment” event, which is generated from the
receiving site. The sending site closes the transmitting with no
“Acknowledgment” may indicate some problems happened. qb
= SEQ(Es,Ee,Ea) is used with a post-aggregation operation
to continuously calculate the average round-trip network
communication time. These two pattern queries can be
optimized by realizing sharing computation of Es and Ee.

Data sets: For stock market monitoring study, we use
real stock trade event data set [16]. The trade event data
set includes 2 million trade events sorted according to the
timestamp. Each event contains a stock symbol, timestamp
and price information. Event types are deﬁned according to
the stock symbol attribute (13 different types). For example,
trade events of stock symbols “AAPL”, “MSFT”, “INTC”, and
“FB” are denoted as event types E1, E2, E3, and E4.

In data center monitoring, there are two catalogs of events:
1) network transmission related event data, 2) virtual machine
logging event data. For instance, we can deﬁne event E1 as
“one package received from IP: xx.xx.149.22 is less than 5
byte”, E2 as “one package received from the same IP and
is larger than 5 kb”, and E3 represents the rest events. We
generate a data set containing 4 million events of 36 different
event types based on a small sample set of real operation data
provided by SAP HANA Data Center Intelligence [3].

Workload generations:

In order to extensively study the
performance of MOTTO, we generate multiple workloads
based on the application scenarios. The workload does not
contain duplicate queries, and the total number of queries
generated is 100 for each case.

We use the same methodology for the workload generations
of these two application scenarios. Speciﬁcally, we divide
the workload into two groups with seven types of sharing
opportunities shown in Table IV. The ﬁrst group (basic
workload group) contains non-nested pattern query of the same
operator, and the same window constraint and can be used to
evaluate the power of realizing the sharing opportunities from
different approaches. The second group (complex workload
group) contains pattern queries with different operators, and
different window constraints as well as nested pattern queries.
The sharing opportunities in the second group are overlooked
in the comparison approaches (except MOTTO).

Queries in the ﬁrst group are generated from query
templates (Types 1 ∼ 4 in Table IV) with the following four
types of sharing opportunities: 1) L is a preﬁx of L(cid:48), 2) L is
a sufﬁx of L(cid:48), 3) L is a subsequence but not a substring of L(cid:48)
and 4) L and L(cid:48) have substrings but do not have the ﬁrst three
types of sharing opportunities. Queries of the ﬁrst group are
conﬁgured with the same window constraint of 10 seconds.

The second group contains the rest three types of sharing
opportunities (Types 5 ∼ 7 in Table IV): 5) queries with
different window constraints, 6) queries with same pattern list
but different pattern operators, and 7) nested pattern queries
with common sub-query in the most inner layer. The nested
level is set to 2 by default, and their common sub-patterns are

of

types

opportunities,
TABLE IV: Seven
sharing
Ex, Ey, Ex(cid:48) and Ey(cid:48) belongs to one of
the primitive
types, and x, y, x(cid:48) and y(cid:48) are distinct. Example
event
queries q and q(cid:48) are shown in the last column with the
patterns L and L(cid:48), respectively. Both queries are assumed
to have the same window size (e.g., 10 seconds), unless
speciﬁed in Type 5.

Group
1)
basic
workload
group

2)
complex
workload
group

Type
1
2

3

4

5

6

7

Description
L is a preﬁx of L(cid:48)
L is a sufﬁx of L(cid:48)
L is a subsequence but
not a substring of L(cid:48)
L and L(cid:48) have substrings
but do not have the ﬁrst three
types of sharing opportunities
queries with different
window constraints
queries with same pattern list
but different pattern operators
nested pattern queries with
common sub-query in the
most inner layer

Examples: q and q(cid:48)
SEQ (E1,E2,E3) and SEQ (E1,E2,E3,Ex).
CONJ (E1 & E2) and CONJ(Ex & E1 &E2).

SEQ(E1,E2,E3) and SEQ(E1,E2,Ex,E3).

SEQ(Ex,E1,E2,Ey) and SEQ(Ex(cid:48) ,E1,E2,Ey).

SEQ (E1,E2,E3) and SEQ (E1,E2,E3,Ex).

SEQ (E1,E2,E3) and CONJ(E1,E2,E3).

SEQ(Ex, SEQ(E1,E2),Ey) and
CONJ(Ex(cid:48) & SEQ(E1,E2) & Ey(cid:48) ).

uniformly generated from samples according to Table IV.

We deﬁne a basic workload ratio r as the ratio of queries of
the ﬁrst group in the workload. Our goal is to understand the
comparison of MOTTO to other techniques on different values
of r in the workload, where r is varied from 0% to 100%. We
generate query workloads with different sharing opportunity
types randomly in a uniform distribution.

B. Overall Comparison

Figures 13a and 13b show the normalized throughput
of the two applications of MOTTO in comparison with
other techniques. All
the measurements are normalized to
the baseline (NA). The experiments are conducted on the
VM with the default setting. We have made the following
observations. First, as the basic workload ratio (r) decreases,
the workload contains an increasing number of queries from
the second group. As expected, the throughput of MST and
LCSE decreases. MST and LCSE have limitations in realizing
all sharing capabilities, especially from the second group.
In contrast, MOTTO gives much more efﬁcient execution
solution. Second, as r decreases, the throughput of MOTTO
decreases, because the sharing opportunities in queries from
the second group tend to be more strict, which we study
in detail in the sensitivity study. Third, the improvement is
more signiﬁcant in the stock market monitoring than in data
center monitoring. As the stock market monitoring workload
has longer operand lists, the sharing opportunities tend to be
more. MOTTO takes advantage of those sharing opportunities
and effectively reduces global execution cost.

C. Sensitivity Studies

In this section, we perform sensitivity studies on stock
market monitoring and have observed similar results on data
center monitoring. Particularly, we use the stock market
monitoring workload of r=100% (except that we use r=0%
for nested pattern query studies).

Varying the number of queries. We study the impact of
varying the number of queries to evaluate the overhead of

(a) Stock Market Monitoring

(b) Data Center Monitoring

Fig. 13: Normalized throughput of the two applications.

(a) Varying the number of queries

(b) Varying the number of CPU cores

(c) Varying the window constraints

(d) Varying the nested level of pattern queries

Fig. 14: Sensitivity Studies.

the exact and approximate optimization approaches as well as
their beneﬁts in throughput. Figure 14a shows results on the
throughput and the overhead. We have two major observations
here. First,
the improvement with both approaches scales
with an increasing number of queries. As expected, the exact
algorithm gives a better performance improvement. Second,
the approximate solution coverages in a constant running
time of 20 seconds with signiﬁcant
improvements, while
the overhead of exact solution increases fast with increasing
number of queries. As a balance in the tradeoff, we choose the
setting that MOTTO has to converge within 5 minutes with an
exact solution. Otherwise, it switches to approximate solution
with a constant time budget.

Varying the number of CPU cores. Figure 14b shows
the throughput of varying the number of CPU cores from
1 to 6. MOTTO demonstrates excellent scalability. Although

our sharing techniques compose multiple queries into one, the
parallelism does not decrease because of the sufﬁcient number
of sub-queries in the global query plan. It is our future work to
study how MOTTO can scale to multi-socket and multi-core
machines [17].

Varying the window constraints. In this experiment, we
study the effectiveness of MOTTO of realizing sharing among
queries of different window constraints. We denote the window
constraint of all the source queries as sw and the window
constraint of the corresponding beneﬁciary query as bw. Figure
14c shows the results when the relative window constraints
between sw and bw is varied from 4:1 to 1:4. MOTTO
improves the throughput on all settings. We have the following
observations. First, the performance gain for the case where
sw = bw is the highest since sharing is enabled without extra
overhead on handling different window constraints. Second,

0%100%200%300%400%500%600%100%75%50%25%0%Normalized ThroughputPercentage of basic workloads (r)MSTLCSEMOTTO0%50%100%150%200%250%300%350%100%75%50%25%0%Normalized ThroughputPercentage of basic workloads (r)MSTLCSEMOTTO0501001502002503000%100%200%300%400%500%600%1530456075100Running time (seconds)Normalized throughputNumber of queriesRunning time (Exact)Running time (Approximate)ExactApproximate010203040501246Throughput (k events /s)CPU coresNAMSTLCSEMOTTO051015202530354:12:11:11:21:4Throughput (k events/s)Relative window constraints (sw:bw)NAMOTTO0246810122468Throughput (k events/s)Nested LevelNAMOTTOwhen sw > bw, the performance gain decreases slightly due
to the additional ﬁlter operation. Third, the performance gain
for the case where sw < bw is the lowest because we need
to extend the window of the source query, which essentially
increases the chance of detecting the composite event of source
query and hence adds computation cost.

Varying the nested level of pattern queries. We now study
the sharing beneﬁts among nested pattern queries. We vary the
nested levels of all the nested queries in the workload from
2 (default) to 8, where the common sub-query is in the most
inner layer. MOTTO is still able to signiﬁcantly reduce the
execution cost of multiple nested pattern queries, even though
the deeper nested level decreases the sharing opportunities (as
shown in Figure 14d).

IX. CONCLUSION

This paper presents MOTTO, a multi-query optimizer for
complex event processing in SAP ESP. MOTTO realizes
more sharing opportunities by introducing pattern query
decomposition and transformation. Those sharing techniques
are also extented to support multiple nested pattern queries and
pattern queries with different window constraints. Experiments
demonstrate the efﬁciency of MOTTO with both real-world
application scenarios and sensitivity studies.

ACKNOWLEDGEMENT

This work is partially funded by the Economic Development
Board and the National Research Foundation of Singapore.
Bingsheng’s work is partially funded by a MoE AcRF Tier 1
grant (T1 251RES1610) in Singapore.

VIII. RELATED WORK

REFERENCES

research effort

[9, 11, 14, 17, 18, 19].

Data stream processing systems have attracted a great
In
amount of
the literature, a considerable amount of
research has
been devoted to the query optimization on complex event
processing (CEP) [9, 11, 14, 18, 19]. Recently, several CEP
systems have gained popularity such as IBM System-S [20],
APAMA [21], StreamInsight
[22], TIBCO
Event Processing [23] and HP CHAOS [24]. In the reminder
of this section, we brieﬂy describe those systems.

(TimeStream)

IBM System-S [20]: Pattern queries are treated as stateful
operators in a stream application in IBM System-S. Schneider
et al. [25] proposed a compiler and runtime system for IBM
System-S that are capable of automatically extracting data
parallelism from streaming applications for stateful operators.
StreamInsight [22]: TimeStream [22] extends programming
model of StreamInsight for CEP to large-scale distributed
execution by providing automatic supports
for parallel
execution, fault tolerance, and dynamic reconﬁguration.

[10]

HP CHAOS [24]: Mo et al. [19] proposed several rewriting
rules for efﬁcient evaluation of nested pattern query on
CHAOS. However, such single query optimization strategy
overlooks the sharing opportunities among multiple queries.
introduced on-line analytical processing
Mo et al.
(OLAP)
for multidimensional event pattern analysis at
different levels of abstraction into CHAOS, where they have
considered sharing results from one level query to another.
MOTTO implements a similar technique called MST, and our
experiment has shown the insufﬁciency of MST in realizing
sharing opportunities in complex query workloads. A more
recent work based on CHAOS [26] proposed an optimizer
for CEP, which identiﬁes opportunities for effectively shared
processing by leveraging time-based event correlations among
queries. In contrast, MOTTO, a multi-query optimizer in SAP
ESP, is based on decomposition and operator transformation on
pattern query processing. Moreover, MOTTO is successfully
extended to handle both nested pattern query and queries with
different window constraints, which are not explicit mentioned
in any existing works.

[1] “Complex
Capital
complex-event-processing-beyond-capital-markets.

Event
Markets,”

Beyond
http://aitegroup.com/report/

Processing:

[2] W. Fengjuan and et al., “The Research on Complex Event
Processing Method of Internet of Things,” in ICMTMA, 2013.
[3] “Overview - SAP HANA Data Center Intelligence,” https:

//archive.sap.com/documents/docs/DOC-60065.

[4] A. Lucena and J. E. Beasley, “A Branch and Cut Algorithm for

the Steiner Problem in Graphs,” Networks, 1998.

[5] M. Charikar and et al., “Approximation Algorithms for Directed

Steiner Problems,” in SODA, 1998.

[6] A. Zelikovsky, “A Series of Approximation Algorithms for the
Acyclic Directed Steiner Tree Problem,” Algorithmica, 1997.
[7] J. W. Van Laarhoven, “Exact and heuristic algorithms for the

Euclidean Steiner tree problem,” 2010.

[8] W. White and et al., “What is “Next” in Event Processing?” in

PODS, 2007.

[9] N. P. Schultz-Møller and et al., “Distributed Complex Event

Processing with Query Rewriting,” in DEBS, 2009.

[10] M. Liu and et al., “E-Cube: Multi-dimensional Event Sequence
Analysis Using Hierarchical Pattern Query Sharing,” in
SIGMOD, 2011.

[11] L. Brenna and et al., “Distributed Event Stream Processing with

Non-deterministic Finite Automata,” in DEBS, 2009.

[12] E. Ukkonen, “On-line construction of sufﬁx trees,” Algorith-

mica, 1995.

[13] M. Hong and et al., “Rule-based Multi-query Optimization,” in

EDBT, 2009.

[14] M. Akdere and et al., “Plan-based Complex Event Detection
Across Distributed Sources,” Proc. VLDB Endow., 2008.
[15] A. Bremler-Barr and et al., “CompactDFA: Scalable Pattern
Matching Using Longest Preﬁx Match Solutions,” IEEE/ACM
Trans. Netw., 2014.

[16] “netfonds,” http://www.netfonds.no.
[17] S. Zhang and et al., “Revisiting the Design of Data Stream
Processing Systems on Multi-Core Processors,” in ICDE, 2017.
[18] Y. Mei and S. Madden, “ZStream: A Cost-based Query
Processor for Adaptively Detecting Composite Events,” in
SIGMOD, 2009.

[19] M. Liu and et al., “High-Performance Nested CEP Query

Processing over Event Streams,” in ICDE, 2011.

[20] H. Andrade and et al., “Processing High Data Rate Streams in

System S,” J. Parallel Distrib. Comput., 2011.

[21] “Apama Complex Event Processing Engine,” http://www.

softwareag.com/corporate/products/az/apama/.

[22] Z. Qian and et al., “TimeStream: Reliable Stream Computation

in the Cloud,” in EuroSys, 2013.

[23] “TIBCO Event Processing,” http://www.tibco.com/products/

event-processing.

[24] C. Gupta and et al., “CHAOS: A Data Stream Analysis
Architecture for Enterprise Applications,” in CEC, 2009.
[25] S. Schneider and et al., “Auto-parallelizing Stateful Distributed

Streaming Applications,” in PACT, 2012.

[26] M. Ray and et al., “Scalable Pattern Sharing on Event Streams,”

in SIGMOD, 2016.

