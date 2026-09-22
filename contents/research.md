真实系统持续面对三类变化：任务产生新的依赖，数据和知识不断演化，负载与可用资源持续波动。我们的研究分别以任务、信息和在线服务为直接管理对象，研究系统如何在变化中保持高效、可控与可靠。

<div class="system-map" aria-label="研究方向：任务执行、信息维护与在线服务调控">
  <div class="map-core"><span class="eyebrow">DATA-INTENSIVE SYSTEMS</span><h3>动态环境下的数据密集型系统</h3><p>面向任务、信息与资源的持续变化</p></div>
  <div class="map-connector">三条科学研究路线</div>
  <div class="module-grid">
    <div><h3>依赖驱动的任务执行</h3><p>多阶段推理<br>并发与异构执行</p><span>识别任务之间真正的依赖，根据负载和硬件选择合适的执行方式</span></div>
    <div><h3>持续变化信息的维护与复用</h3><p>动态数据与检索<br>历史结果与外部记忆</p><span>降低持续更新的维护成本，并判断哪些历史信息值得继续使用</span></div>
    <div><h3>资源约束下的在线服务调控</h3><p>容量与负载变化<br>恢复与状态迁移</p><span>在资源紧张或配置变化时调整请求和状态，使服务持续稳定运行</span></div>
  </div>
  <div class="map-connector">跨路线统筹系统</div>
  <div class="integration-grid">
    <div><span class="eyebrow">MECHANISMS</span><h3>ECPA · 机制契约与组合</h3><p>统一扩展的声明、接入、验证、隔离与退出，使不同优化机制能够安全组合。</p></div>
    <div><span class="eyebrow">STATE</span><h3>StateAxis · 状态原生执行</h3><p>统一状态的所有权、布局、访问、迁移与生命周期，使执行和服务共享一致的状态基础。</p></div>
  </div>
  <div class="map-support"><strong>共享支撑：</strong>工作负载、基准、性能剖析、故障注入与回归验证</div>
  <div class="map-application"><h3>当前重点：面向国产算力的高性能推理引擎</h3><p>以 vLLM-HUST 为工程载体，在真实模型、硬件与负载上验证系统方法</p></div>
</div>

三条路线回答不同的科学问题；ECPA 统一机制，StateAxis 统一状态。二者不是新的平行方向，而是将任务执行、信息维护与服务调控连接为完整系统。应用场景用于检验方法的通用性，不替代科学问题本身。

[代表机制、系统实现与论文 →](systems.html)
