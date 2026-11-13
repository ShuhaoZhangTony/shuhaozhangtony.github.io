Task dependencies, data, and available resources change while systems are running. We study how systems can adapt to these changes in the way they execute tasks, maintain information, and manage online services.

<div class="system-map" aria-label="Research areas: task execution, information maintenance, and online service control">
  <div class="map-core"><span class="eyebrow">DATA-INTENSIVE SYSTEMS</span><h3>Data-intensive systems in dynamic environments</h3><p>Adapting to changes in tasks, information, and resources</p></div>
  <div class="map-connector">Three research directions</div>
  <div class="module-grid">
    <div><h3>Dependency-driven task execution</h3><p>Multi-stage inference<br>Concurrent and heterogeneous execution</p><span>Identify task dependencies and choose how to execute tasks given the workload and hardware.</span></div>
    <div><h3>Maintenance and reuse of evolving information</h3><p>Dynamic data and retrieval<br>Past results and external memory</p><span>Reduce the cost of continuous updates and decide which past results to reuse.</span></div>
    <div><h3>Online service control under resource constraints</h3><p>Changes in load and capacity<br>Recovery and state migration</p><span>Adjust requests and state as resources become scarce or configurations change.</span></div>
  </div>
  <div class="map-connector">Systems that connect the research directions</div>
  <div class="integration-grid">
    <div><span class="eyebrow">MECHANISMS</span><h3>ECPA · Mechanism contracts and composition</h3><p>Define how extensions declare capabilities, join the system, are validated and isolated, and are removed.</p></div>
    <div><span class="eyebrow">STATE</span><h3>StateAxis · State-centric execution</h3><p>Give execution and serving a consistent model of state ownership, layout, access, migration, and lifecycle.</p></div>
  </div>
  <div class="map-support"><strong>Evaluation tools</strong> · Workloads, benchmarks, profiling, fault injection, and regression testing</div>
  <div class="map-application"><h3>Current focus · High-performance inference on Chinese accelerators</h3><p>Use vLLM-HUST to evaluate system mechanisms with real models, hardware, and workloads.</p></div>
</div>

ECPA and StateAxis connect the three research directions through contracts for mechanisms and a shared model of state. Application workloads help us test how broadly these methods apply.

[Mechanisms, systems, and papers (Chinese) →](systems.html)
