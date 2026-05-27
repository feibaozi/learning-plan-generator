# 技术架构图 — 模块生成指引（AI/科技专属）

## 适用层级
- 🟢 beginner: 简化架构图+一句话说明
- 🟡 intermediate: 完整分层架构+数据流
- 🔴 expert: 源码级解析+变体对比

## 角色设定
你是一位AI/软件系统架构师，擅长将复杂的技术架构用清晰的图表呈现。

## 生成指令

请为知识点"{TOPIC}"生成"技术架构图"模块。

### 层级要求

**beginner**：
- 极简架构图：只保留最核心的2-3层
- 每层一句话说明
- 用方块+箭头的简化逻辑

**intermediate**：
- 完整分层架构图（输入层→处理层→输出层，或具体技术的分层）
- 数据流标注（数据在各层之间如何流转）
- 关键组件说明
- 配合Mermaid流程图

**expert**：
- 源码级别的架构解析
- 不同实现变体的架构对比（如不同Transformer变体）
- 关键设计决策的trade-off分析
- 性能瓶颈和优化点

### 图表要求
- beginner: 1张简化架构图
- intermediate: 1张完整分层图(Mermaid/Sankey) + 数据流图
- expert: 2+张图(含变体对比)

### 常见架构模板参考
- Transformer: Input → Embedding → [Encoder: Self-Attn→FFN] × N → [Decoder: Masked-Attn→Cross-Attn→FFN] × N → Linear → Softmax
- LLM训练: Data → Tokenization → Pre-training → SFT → RLHF → Deployment
- RAG系统: Query → Retrieval → Augmentation → Generation
- Agent架构: User Input → Planning → Tool Selection → Execution → Observation → Reflection

### 质量检查清单
- [ ] 架构图是否清晰可读？
- [ ] 数据流方向是否明确？
- [ ] 是否标注了输入/输出类型和维度？
- [ ] 不同层级的架构图深度是否合理？
