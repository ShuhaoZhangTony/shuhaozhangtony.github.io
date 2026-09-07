智能体的每一轮交互，都可能带来新的推理请求、记忆写入和知识更新。我们的核心问题是：**如何在国产算力上高效执行推理，并在数据和状态持续变化时维持端到端服务质量？**

<div class="system-map" aria-label="研究架构：推理引擎内核、扩展组件与智能体应用">
  <div class="map-core"><span class="eyebrow">系统内核 · INFERENCE ENGINE</span><h3>面向国产算力的极致性能推理引擎</h3><p>vLLM-HUST · 请求调度 · KV 驻留与复用 · 执行与通信优化</p></div>
  <p class="map-connector">围绕推理内核扩展系统能力 ↕</p>
  <div class="module-grid">
    <div><h3>编排与观测</h3><p>SAGE</p><span>组织检索、记忆、工具与推理的数据流</span></div>
    <div><h3>持续数据与状态</h3><p>Neuromem · FlowRAG<br>StreamFP · GRACE</p><span>记忆生命周期、检索更新、数据选择与动态图维护</span></div>
    <div><h3>评测与反馈</h3><p>CANDOR-Bench<br>引擎 Benchmark</p><span>动态检索质量、更新成本与推理服务性能</span></div>
  </div>
  <p class="map-connector">由应用负载驱动，共同验证 ↕</p>
  <div class="map-application"><h3>智能体应用</h3><p>Sage Mate（Faculty Twin）· 持续知识问答</p></div>
</div>

这里的 mod 指围绕推理内核扩展的系统组件与研究能力；具体实现和接入方式以各项目公开代码为准。

[组件机制、性能评价与开源入口 →](systems.html)
