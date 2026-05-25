***
name: smart-learning-materials
description: >
针对单个知识点/概念/术语，生成结构化、多层级、多模态的高质量学习资料。
覆盖金融与AI/科技两大领域，支持3×3深度×广度矩阵和G1-G8表达纹理自动选择，
输出纯HTML(无CDN基线) + 可选CDN增强层和现代风格PDF。
v3.2: 模板化HTML生成 + 悬浮返回按钮强制实现 + prompt嵌入context_plan标记。
v3.3: 视觉模板继承 — 从 context_plan.template_id 或 manifest 自动获取外观模板。
v3.4.1: 表格数据 Schema 约束 — 在 module-mapping.json 中定义 tables 字段结构规范，Step 5.0 增强表格结构校验。
v3.4: JS数据层防御性规则 — 杜绝深度资料白屏（引号冲突、`</script>`截断、外部JS CORS、语法自检）。
version: "3.4.1"
----------------

# Smart Learning Materials Generator v3.4.1.1.1

## 描述

这是一个"知识深度加工引擎"。接收用户对单个知识点/概念/术语的提问，
自动判定主题领域、分析4D画像(抽象度/系统性/数学密度/演化速度)、
选择最佳表达纹理(G1-G8)、按相关度评分动态编排模块、
生成包含图表/公式/数据/案例/文献的完整学习资料。
最终输出为自包含的现代HTML网页和/或精心排版的PDF。

**v3.1 new**: 返回链接支持 hash 锚点导航 (`#kc-kp_id`) + 命名窗口复用 (`'plan_main'`)，从深度资料返回学习方案时精准定位到对应知识点。
**v3.2 new**: prompt优先解析 `[context_plan: ...]` 标记 + manifest fallback + 悬浮返回按钮，从文档任何位置都可一键返回。

### 版本改进总览

| 维度    | v2.0     | v3.0                           | v3.1                 | v3.2                                              | v3.3                                    |
| ----- | -------- | ------------------------------ | -------------------- | ------------------------------------------ | --------------------------------------- |
| 上下文感知 | 独立生成     | 支持 context\_plan — 感知学习路线位置    | —                    | prompt嵌入标记优先 + manifest fallback             | —                                         |
| 模块系统  | 固定 28 模块 | 新增 learning\_journey 条件模块      | —                    | —                                              | —                                         |
| 文件清单  | 无        | 自动注册到 manifest.json            | —                    | —                                              | —                                         |
| 导航    | 独立页面     | 顶部路线位置导航条 + 底部返回链接             | 返回链接 hash导航 + 命名窗口复用 | 返回链接 + 悬浮返回按钮，任何位置都可一键返回             | —                                         |
| 深度联动  | 无        | 与 learning-plan-generator 双向链接 | 返回时精准展开目标知识点         | prompt标记使上下文传递零失败，双向联动完全可靠             | —                                         |
| 外观模板  | 无        | —                              | —                    | —                                              | 从 context\_plan 继承，与主方案外观统一 |

| 维度    | v1.0                    | v2.0                                            |
| ----- | ----------------------- | ----------------------------------------------- |
| 知识深度  | 固定3级(入门/进阶/专家)          | 3×3矩阵: 概览/理解/精通 × 核心/标准/全景                      |
| 主题分类  | 用户选 finance/ai-tech     | 自动匹配60主题库 or R1-R5启发式推理                         |
| 模块选择  | 硬编码include/exclude列表    | relevance\_score评分(≥0.80必选, ≥0.40可选)            |
| 表达风格  | 统一输出格式                  | G1-G8八种纹理自动匹配                                   |
| 时长估算  | 固定标签(入门XX分钟)            | 动态: word\_count/400 + charts×1.5 + formulas×1.0 |
| Web输出 | mode-a + mode-b + CDN依赖 | 单HTML自包含 + 可选CDN增强层                             |

## 配置文件索引

生成前必须加载以下配置（均位于 `resources/` 目录）：

| 文件                       | 用途                                        | 调用阶段             |
| ------------------------ | ----------------------------------------- | ---------------- |
| `topic_profiles.json`    | 60主题4D画像库 + 匹配规则                          | Phase 1          |
| `heuristic_rules.json`   | R1-R8启发式推理(匹配失败时)                         | Phase 1 fallback |
| `texture_templates.json` | G1-G8纹理模板 + 逐模块Override                   | Phase 2, 3       |
| `module_weights.json`    | relevance\_base + tag\_affinity + 深度×广度上限 | Phase 2          |
| `module-mapping.json`    | 模块定义 + 排序 + 输出模式(v2\_extensions)          | Phase 2, 4       |
| `manifest_schema.json`   | 共享文件清单格式定义 (v3.0 deep integration)        | Phase 5          |
| **templates/manifest.json** | 6-template visual themes registry (v3.3)      | Phase 1.0       |

**v3.3 new**: 深度资料外观模板从 context_plan.template_id 继承，与主方案保持一致。若无 context_plan，根据 topic 领域/标签自动匹配或在 6 套模板中随机选择。

## 触发条件

- 用户询问某个金融概念/方法（如"什么是期权定价"、"解释一下蒙特卡洛模拟"）
- 用户询问某个AI/科技概念/技术（如"Transformer原理是什么"、"解释RLHF"）
- 用户说"帮我整理XX的学习资料"、"帮我做一个关于XX的知识页面"、"生成XX的学习材料"
- 用户提及"学习资料"、"知识卡片"、"知识图谱"并要求生成

## 指令

### Phase 1: 输入解析与主题自动分类

> ⚠️ **第一步（必须 — v3.2 更新）**：
> 1. **优先检查用户输入中是否包含 `[context_plan: ...]` 标记！** 若有，立即解析标记内容填充 `context_plan`，然后删除标记段落，继续 Step 1.1。此方式为 v3.2 新增的 prompt 嵌入传递机制，零失败。
> 2. 若无标记，读取输出目录的 `manifest.json`，检查 topic 是否已注册。若在 `materials[]` 中找到匹配且有 `belongs_to_plan`，启用 `context_plan` 并跳到 Step 1.4 确认。
> 3. 若均无匹配，继续正常流程。

#### Step 1.0: Template Inheritance (NEW v3.3)

Before generating content, determine the visual template. The template CSS defines all color variables, shadows, and accents for both dark/light modes. **The deep-dive material should match the main learning plan's visual template** for a cohesive user experience.

**Resolution Priority**:

1. **`context_plan.template_id`** (最高优先级): If the `[context_plan: ...]` marker includes `template_id="xxx"`, use it directly. The marker is parsed in the same pass as other context_plan fields (see Phase 1 notice above).
2. **manifest.json fallback**: If no context_plan but a manifest.json exists, find the plan by `context_plan.plan_id` → read `plans[N].template_id`.
3. **Auto-match** (无 context_plan 时): Match the topic's `domain` and `tags` against `../_shared/templates/manifest.json` keywords/best_for — same algorithm as learning-plan-generator Phase 0.
4. **Random fallback**: If all above fail, randomly select from the 6 templates. This ensures every deep-dive material has a deliberate visual style, never an unstyled default.

**Loading Template CSS**:

Once `template_id` is determined, read the corresponding CSS:

```
READ ../_shared/templates/<template_id>/deep_dive.css
```

Store the full content as `TEMPLATE_CSS`. This file contains `:root{...}` and `[data-theme="light"]{...}` blocks with all CSS custom properties scoped for deep-dive materials.

**Context_plan field addition**:

When parsing `[context_plan: ...]`, extract the new `template_id` field along with existing fields:

```
template_id = regex match: template_id="(.*?)"
```

If the field is absent (older plan generated before v3.8), fall back to priority 2 (manifest.json lookup).

#### Step 1.1: 提取知识点名称

从用户输入中识别核心概念/术语。如果用户表述模糊，主动追问确认：

- "您指的是Black-Scholes期权定价模型，还是二叉树期权定价法？"
- "您想了解的是Transformer架构本身，还是基于Transformer的大语言模型？"

#### Step 1.2: 匹配 topic\_profiles.json

按以下优先级尝试匹配：

1. **精确匹配**: topic name 或 aliases 与用户输入完全相同
2. **子串匹配**: 用户输入包含 topic name 或 alias
3. **关键词命中**: 用户输入中的关键词命中 `tag_index` → 推荐该 tag 下最相关的 topic
4. **Jaccard相似度**: 用户输入与 aliases 的交集/并集 > 0.3 → 取最高分

若匹配成功 → 直接获得该 topic 的完整信息：

```json
{
  "topic_id": "option-pricing",
  "topic_name": "期权定价",
  "domain": "finance",
  "tags": ["derivatives", "pricing", "quant-models"],
  "profile": {"abstract": 0.80, "systemic": 0.55, "math_density": 0.90, "temporal": 0.25},
  "suggested_texture": "G1",
  "texture_reason": "高数学密度+高抽象度→需要公式驱动的推导式表达"
}
```

#### Step 1.3: Fallback — 启发式推理 (heuristic\_rules.json)

若所有匹配均失败，按 R1→R5 顺序推理：

- **R1 领域判定**: 关键词加权投票 → `finance` | `ai-tech` | `unknown`(询问用户)
- **R2 数学密度**: baseline + 关键词boost/reduce → clamp 到 \[0.05, 0.98]
- **R3 抽象度**: baseline + 关键词boost/reduce → clamp 到 \[0.05, 0.95]
- **R4 系统性**: baseline + 关键词boost/reduce → clamp 到 \[0.10, 0.98]
- **R5 演化速度**: baseline + 关键词boost/reduce → clamp 到 \[0.05, 0.95]
- **R6 纹理选择**: 计算8个 texture\_score → 取最高分

#### Step 1.4: 提取学习路线上下文 (v3.1: manifest自动推断)

如果用户从学习方案中触发深度研读（输入中包含方案上下文信息），提取 `context_plan` 参数：

**识别标志（优先级从高到低 — v3.2 重新排序）**：

1. **`[context_plan: ...]` 标记**（最高优先级 — v3.2 new）：用户输入中包含 `[context_plan: plan_id="..."; plan_name="..."; ...]` 格式的标记。这是从学习方案页面复制 prompt 时自动嵌入的上下文。解析方式：正则匹配 `plan_id="(.*?)"` `plan_name="(.*?)"` `plan_file="(.*?)"` `phase_id="(.*?)"` `phase_name="(.*?)"` `kp_id="(.*?)"` `kp_name="(.*?)"` `prerequisites="(.*?)"` `next_kps="(.*?)"`。解析后删除标记段落，继续正常流程。
   - `phase_position` 从 manifest 中反查 phase 和 kp 的位置关系确定，或从 `context_plan` 解析
   - `plan_profile` 和 `plan_texture` 从 manifest 的 plans[] 中获取
2. **manifest 自动推断**（第二优先级）：如果 topic 能在 `manifest.json` 的 `materials[]` 中找到匹配条目，且该条目有 `belongs_to_plan`（按 `created_at` 降序取最新记录）
3. **用户输入文本标志**（第三优先级）：输入包含 "从学习方案中"、"这个知识点在XX方案的第X阶段"

注意：优先级1和2提取的字段完全相同（格式见下方 `context_plan` JSON），区别仅在于来源。

**提取字段**：

```json
{
  "enabled": true,
  "plan_name": "量化交易系统学习方案",
  "plan_id": "quant-trading-learning",
  "plan_file": "quant_learning.html",
  "phase_id": "p3",
  "phase_name": "核心策略",
  "kp_id": "p3_1",
  "kp_name": "期权定价基础",
  "position": "阶段3/7 · 第1个知识点",
  "prerequisites": ["概率论基础", "随机过程"],
  "next_kps": ["Black-Scholes模型", "希腊字母"],
  "plan_profile": {"abstract": 0.70, "systemic": 0.65, "math_density": 0.80, "temporal": 0.30},
  "plan_texture": "G1",
  "plan_depth": "标准学习"
}
```

**优先级规则**：

1. 如果提供了 `context_plan.plan_profile`，优先使用其中的 4D 画像（保证与方案纹理一致）
2. 如果方案 profile 与本 skill 自动匹配的 profile 差异 > 0.2（任何维度），使用方案的 profile
3. `context_plan.plan_texture` 不变 — 深度资料纹理由自身 topic 决定，方案纹理仅作参考

**输出确认**（根据触发方式不同选择对应格式）：

```
🔗 [context_plan 标记解析]: 【量化交易系统学习方案】→ 阶段3/7: 核心策略 → 第1个知识点
   前置=概率论基础/随机过程 | 后续=Black-Scholes模型/希腊字母
   plan_file: deriv_learning.html | kp_id: p2_3
```

或 manifest 推断时：

```
🔗 从 manifest 自动推断学习路线上下文: 【量化交易系统学习方案】→ 阶段3/7: 核心策略 → 第1个知识点
   前置=概率论基础/随机过程 | 后续=Black-Scholes模型/希腊字母
   plan_file: deriv_learning.html | hash: #kc-p2_3
```

#### Step 1.5: 确认深度×广度 (默认值)

v2 不再要求用户选择"入门/进阶/专家"。改为两个维度：

**深度 (ContentDepth)**:

- `概览` (multiplier=0.5) — 精简表达，每模块200-400字
- `理解` (multiplier=1.0) — **默认值**，标准深度500-800字
- `精通` (multiplier=1.6) — 深度展开800-1500字

**广度 (CoverageBreadth)**:

- `核心` (max\_modules=8) — 仅必选模块(≥0.80)
- `标准` (max\_modules=16) — **默认值**，核心+高相关可选
- `全景` (max\_modules=24) — 核心+全部可选

用户未明确选择时，默认: **理解 × 标准**。

如果用户表达了深度/广度偏好（如"简单了解一下"→概览，"全面深入了解"→精通+全景），据此调整。

#### Step 1.6: 确认输出模式

用户可选择: `web`(默认) / `pdf` / `both`

v2 不再有 mode-a/mode-b 之分，web 输出统一为自包含 HTML。
如用户需要交互图表+公式渲染，使用 CDN 增强层（见 Phase 4）。

#### Step 1.7: 向用户确认

在开始生成前，用1-2句话确认解析结果：

```
已识别主题：【期权定价】 → 领域:金融 | 标签:衍生品/定价/量化模型
4D画像: 抽象度0.80 | 系统性0.55 | 数学密度0.90 | 演化速度0.25
表达纹理: G1(公式推导驱动型) | 深度:理解 | 广度:标准(≤16模块)
开始生成...
```

### Phase 2: 模块评分与编排

#### Step 2.1: 计算每个模块的 relevance\_score

加载 `module_weights.json`，对每个模块：

```
# 按 |tag_affinity[tag][module_id]| 降序排列 topic.tags，取前 min(N, top_n_cap) 个
relevance_score = CLAMP(
    relevance_base[module_id] 
    + Σ_{rank=1..min(N,6)} tag_affinity[tag_rank][module_id] × 0.85^(rank-1),
    0, 1
)
# 正负 affnity 均参与排序和折扣；仅 |affinity|>0 的 tag 参与
```

**跨领域过滤**: 非本领域的专属模块直接 `relevance_score = 0`

- finance 专属: quant\_model, regulation, micro\_structure, cross\_market, crisis\_review, institution\_diff
- ai-tech 专属: architecture, compute\_cost, open\_source, benchmark, ethics, research\_map
- 通用模块不受影响

#### Step 2.2: 模块分类与选择

```
MANDATORY (relevance_score >= 0.80):
  无条件包含，不占用 max_modules 配额外的限制
  
OPTIONAL (0.40 <= relevance_score < 0.80):
  按 relevance_score 降序排列
  取前 (max_modules - mandatory_count) 个
  
EXCLUDED (relevance_score < 0.40):
  不包含在当前主题的资料中
```

**实际 max\_modules**: 取 `module_weights.json` 中 `depth_breadth_module_cap[深度_广度].max_modules`

#### Step 2.2a: `learning_journey` 条件模块 (NEW v3.0)

仅当 `context_plan.enabled === true` 时启用：

1. **强制包含**: `learning_journey` 模块的 `relevance_score` 强制设为 0.82（≥ 0.80 MANDATORY 阈值）
2. **不占用配额**: `learning_journey` 不计入 `max_modules` 限制（额外插入）
3. **排序位置**: 始终排在所有模块**最前面**（在 `background` 之前），作为阅读入口
4. **内容要求**:
   - 📍 当前位置：`context_plan.plan_name` 中 `phase_name` 阶段的第 `kp_index` 个知识点
   - ← 前置依赖：列出 `context_plan.prerequisites` 中的概念（如果这些概念在本资料中有涉及，简单提及即可）
   - → 后续学习：列出 `context_plan.next_kps`
   - ⏱️ 建议投入时间：根据 `context_plan.plan_depth` 估算
   - 🔗 返回链接：`context_plan.plan_file`（如果提供）
5. **内容长度**: 300-400 字（比核心模块短，作为导航而非主内容）
6. **纹理适配**: 根据模块自身纹理调整但保持简洁

#### Step 2.3: 加载纹理模板

根据 Phase 1 确定的 `suggested_texture`，从 `texture_templates.json` 加载对应纹理的:

- `global_params` — 全局内容比例和风格参数
- `module_overrides` — 部分模块的覆盖配置

纹理选择规则: 优先使用 topic\_profiles 中的 `suggested_texture`；
若为 heuristic 推理得到的 topic，则使用 R6 计算的最优纹理。

#### Step 2.4: 模块排序

使用 `module-mapping.json` 中 `module_ordering` 的对应领域排序，
选中的模块按此顺序排列。
`texture module_overrides` 中存在 override 的模块，在同类别中优先排列。

#### Step 2.5: 动态时长估算

```
ESTIMATED_MINUTES = CEIL(
    total_words / 400 
    + total_charts × 1.5 
    + total_formulas × 1.0 
    + total_tables × 0.8
)
```

在 Phase 3 生成完成后使用实际数据重新计算。

### Phase 3: 逐模块内容生成规则

#### Step 3.0: 初始化内容去重追踪器

为避免不同模块间内容重叠，在生成第一个模块前创建全局去重清单：

```
ALREADY_COVERED = {
  "concepts": [],       // 已详细解释的核心概念 (name + brief)
  "formulas": [],       // 已出现的公式 (latex 签名)
  "examples": [],       // 已使用的案例/场景描述
  "key_terms": [],      // 已定义的关键术语
  "focus_areas": []     // 各模块已覆盖的聚焦领域
}
```

**每生成完一个模块后**，将其关键标识追加到 ALREADY\_COVERED：

- concepts: 提取该模块阐释的 1-2 个核心概念名
- formulas: 提取所有公式的 latex 前 40 字符作为签名
- examples: 提取使用的案例/场景的简短描述
- key\_terms: 提取首次定义的专业术语
- focus\_areas: 该模块的 module\_id + 核心主题

**生成下一个模块前**，必须输出去重提示：

```
🔍 去重检查 — 已在前面模块覆盖的内容请勿重复：
  · 已讲概念: {ALREADY_COVERED.concepts}
  · 已出现公式: {ALREADY_COVERED.formulas}
  · 已用案例: {ALREADY_COVERED.examples}
  · 已定义术语: {ALREADY_COVERED.key_terms}

  ✅ 本模块应聚焦于: [module_specific_focus — 取自 module_overrides 或模块定义]
  ⚠️  如需引用前面的概念/公式，只需提及名称，不要重新推导。
```

#### Step 3.1: 动态内容参数计算

对于每个选中的模块，按以下公式计算最低字数:

```
word_count = WORD_BASE × content_depth_multiplier × texture_word_factor

其中:
  WORD_BASE: 根据模块类型取值
    - 核心模块(concept/principle): 600
    - 应用模块(application/case_study): 500
    - 发展模块(development/landscape/risk): 450
    - 补充模块(glossary/learning_path/misconceptions): 350
    
  content_depth_multiplier: depth_params[深度].multiplier (0.5/1.0/1.6)
  
  texture_word_factor: 
    - 纹理中存在 module_overrides[module_id].word_count_multiplier → 使用该值
    - 否则: 1.0
```

公式和图表数量:

```
formula_count = CEIL(
    MATH_DENSITY × FORMULA_DENSITY(texture) × 3 × content_depth_multiplier
    × module_overrides中的formula_count_multiplier(默认1.0)
)

chart_count = CEIL(
    CHART_PRIORITY(texture) × 2 × content_depth_multiplier
    × module_overrides中的chart_count_multiplier(默认1.0)
)
```

#### Step 3.2: 每个模块的 JSON 输出结构

```json
{
  "module_id": "principle",
  "module_title": "核心原理",
  "module_tag": "核心概念",
  "content_type": "mixed",
  "texture_note": "G1纹理: 完整推导链，从基本假设到最终结论",
  "hook": "一句话抓住读者注意力，引发好奇或共鸣",
  "content": "Markdown格式的正文内容...",
  "formulas": [
    {
      "latex": "$$E = mc^2$$",
      "caption": "质能方程",
      "expandable": true,
      "derivation": "推导过程..."
    }
  ],
  "charts": [
    {
      "type": "echarts",
      "chart_id": "chart_principle_01",
      "echarts_option": {},
      "caption": "图：XXX示意图",
      "data_source": "数据来源：XXX",
      "responsive": true
    }
  ],
  "tables": [
    {
      "headers": ["维度", "说明", "备注"],
      "rows": [["行1列1", "行1列2", "行1列3"]],
      "caption": "表：XXX对比表"
    }
  ],
  "references": [
    {
      "title": "论文/文献标题",
      "authors": "作者",
      "year": 2024,
      "doi": "10.xxx",
      "url": "https://...",
      "type": "paper"
    }
  ],
  "key_takeaway": "一句话总结本模块核心要点"
}
```

#### Step 3.3: 纹理感知的内容风格

根据纹理 `global_params` 调整每个模块的写作风格：

- **G1(公式推导驱动)**:
  - hook 从核心公式/方程出发
  - 推导过程连续递进，每步标注假设
  - 40-45%正文 + 30-35%公式 + 10-15%图表 + 0-5%案例
- **G2(公式+可视化)**:
  - 每个公式配一张示意图
  - hook 从可视化现象或结构问题切入
  - 35-40%正文 + 18-22%公式 + 25-30%图表 + 8-10%案例
- **G3(模型拆解)**:
  - 先拆后合：逐组件→组件交互→整体行为
  - 对比表是核心表达手法
  - 30-35%正文 + 15-20%公式 + 20-25%图表 + 15-20%对比
- **G4(叙事驱动)**:
  - 论点→论据→反驳→综合的辩论式结构
  - hook 从争议或反常识现象切入
  - 60-65%正文 + 5-8%公式 + 12-15%图表 + 10-12%案例
- **G5(平衡型)**:
  - 每个模块至少包含2种表达元素
  - 40-45%正文 + 15-18%公式 + 18-22%图表 + 12-15%案例
- **G6(系统图解)**:
  - 以图为主以文为辅
  - hook 展示全景系统图
  - 30-35%正文 + 8-10%公式 + 35-40%图表 + 12-15%案例
- **G7(叙事案例趋势)**:
  - 时间线和趋势对比图是核心
  - 优先引用2024-2026最新数据
  - 35-40%正文 + 5-8%公式 + 25-30%图表 + 18-22%案例
- **G8(教程实操)**:
  - numbered步骤+每步预期输出+常见错误
  - 核心代码片段用 syntax-highlighted block
  - 25-30%教程步骤 + 18-20%原理 + 12-15%公式 + 15-20%图表 + 15-18%代码

#### Step 3.4: 内容质量通用要求

- 所有事实性数据须有可靠来源，无法确定的标注 `[需验证]`
- 不同模块间内容不可重叠
- 语言现代、年轻化，避免教科书式僵硬表述
- 中文撰写，专业术语首次出现时附带英文原文
- 适当使用短句和留白，避免信息墙

**公式规范**:

- 使用 LaTeX 语法，`$$...$$`（块级公式）或 `$...$`（行内公式）包裹
- content\_depth >= 1.0 时，公式必须提供可展开的推导过程
- 所有符号首次出现时必须在上下文中定义
- 金融公式符号规范：\(S\)(标的价格)、\(K\)(行权价)、\(r\)(无风险利率)、\(\sigma\)(波动率)、\(T\)(到期时间)

**LaTeX 语法最佳实践**（防止渲染错误）：

- **条件概率用 `\mid` 而非 `|`**：`$P(A \mid B)$` ⟹ \(P(A \mid B)\)（正确间距）；`$P(A|B)$` ⟹ \(P(A|B)\)（无间距）
- **多字母运算符必须用 `\operatorname{}` 包裹**：KaTeX 数学模式下，任何多字母名称（≥2 字母）都会被解释为单字母变量的乘积。必须用 `\operatorname{}` 包裹以下常见运算符：
  - 统计学：`\operatorname{Var}`, `\operatorname{Cov}`, `\operatorname{SD}`, `\operatorname{SE}`, `\operatorname{MSE}`, `\operatorname{plim}`
  - 回归诊断：`\operatorname{SSR}`, `\operatorname{SST}`, `\operatorname{SSE}`, `\operatorname{VIF}`, `\operatorname{DW}`
  - 计量/经济学：`\operatorname{WLS}`, `\operatorname{GLS}`, `\operatorname{IV}`, `\operatorname{2SLS}`, `\operatorname{GMM}`, `\operatorname{DID}`, `\operatorname{HAC}`, `\operatorname{FE}`, `\operatorname{RE}`
  - 因果推断：`\operatorname{do}(X)`, `\operatorname{ATE}`, `\operatorname{LATE}`, `\operatorname{ITT}`
  - 机器学习：`\operatorname{AUC}`, `\operatorname{ROC}`, `\operatorname{MSE}`, `\operatorname{KL}`, `\operatorname{ELBO}`
  - **例外**：单字母运算符（`E`, `P`, `H`）和标准 LaTeX 命令（`\sin`, `\log`, `\arg`, `\max`, `\min`, `\lim`, `\det`, `\Pr`, `\ln`）无需包裹
  - ⚠️ 下标归属规则：`\operatorname{Var}(\hat{\beta})` 中括号属于 Var；`\hat{\beta}_{\operatorname{WLS}}` 中 WLS 是 β 的下标，需嵌套 `_{\operatorname{WLS}}`
- **`<` 和 `>` 用 `\lt` 和 `\gt`**（数学模式内）：`$\hat{\beta} \lt 0$` ⟹ \(\hat{\beta} \lt 0\)——避免 `<` 被 HTML 解析器误读为标签
- **文本用 `\text{}` 包裹**：`$Y = X\beta + \varepsilon \quad \text{(结构方程)}$`——`\text{}` 内的中文/英文均以正文字体渲染
- **花括号 `{}` 和 `\` 在 JS 字符串中须双写**：在 HTML 文件的 `<script>` 块中，`\\` 表示一个字面反斜杠，故 `\frac{1}{n}` 须写为 `\\frac{1}{n}`

**非公式文本中 `$` 符号的处理**（防止 KaTeX 误解析）：

当使用 CDN 增强层（KaTeX）时，`renderMathInElement` 会将页面中**任何位置**的 `$...$` 识别为行内数学公式。因此：

- 表示美元金额的 `$` 必须替换为 HTML 实体 `&#36;`：
  - 错误：`"价格从 $4.25 涨到 $5.05"`
  - 正确：`"价格从 &#36;4.25 涨到 &#36;5.05"`
- 此规则适用于所有文本字段：`content`、`hook`、`derivation`、`caption`、`key_takeaway`
- **必须在写入 HTML 文件时已转义完成**——不要依赖运行时 JS 处理

**图表规范**:

- 使用 ECharts 完整 option JSON 配置
- 图表配色使用 CSS 变量引用（确保深浅主题一致切换）
- 浅色主题色板: `['#6366f1','#8b5cf6','#a78bfa','#22d3ee','#f59e0b','#10b981','#ef4444']`
- 深色主题色板: `['#818cf8','#a78bfa','#c4b5fd','#67e8f9','#fbbf24','#34d399','#f87171']`
- 金融图表偏好: 折线图/柱状图/散点图/雷达图/热力图
- AI图表偏好: 流程图/桑基图/树图/关系图/旭日图

**引用规范**:

- 优先引用近3年顶会/顶刊论文
- 金融: Journal of Finance, Review of Financial Studies, NBER
- AI: NeurIPS, ICML, ICLR, ACL, CVPR, arXiv
- 数据来源必须标注

#### Step 3.5: 内容去重重审

所有模块生成完毕后，执行以下审核：

1. **提取关键词**: 对每个模块提取 3-5 个核心关键词（不含通用词如"模型""方法""分析"）
2. **两两对比**: 计算每对模块的关键词 Jaccard 相似度 = |交集| / |并集|
3. **标记潜在重复**: 相似度 > 0.50 的模块对标记为 ⚠️ 潜在重复
4. **处理方式**:
   - 相似度 > 0.70: 两个模块可能讲了同一件事，合并或删减一个模块中的重复段落
   - 相似度 0.50-0.70: 检查两个模块的 `focus_areas` 是否不同。如有不同，在较弱模块开头加一句"如\[强模块名]中所述..." 进行交叉引用替代重复内容
5. **最终确认**: 输出去重报告：

```
✅ 去重审核完成:
  · 共 X 个模块，Y 对关键词交集 > 50%
  · 其中 Z 对已通过交叉引用处理
  · W 对已合并/删减重复内容
```

### ⚠️ 表格数据格式规范（v3.4.1 new — 防止 JSON 结构错误导致白屏）

在 Phase 3 每个模块生成 `tables` 字段时，必须严格遵守以下结构约束。表格数据结构错误是导致白屏的常见根因之一。

#### 基本结构

```json
{
  "tables": [
    {
      "headers": ["维度", "说明", "备注"],
      "rows": [
        ["行1列1", "行1列2", "行1列3"],
        ["行2列1", "行2列2", "行2列3"]
      ],
      "caption": "表：XXX对比表"
    }
  ]
}
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `headers` | `string[]` | ✅ 是 | 表头数组，一维 |
| `rows` | `string[][]` | ✅ 是 | 行数据，**必须为二维数组**，每行元素数量 = headers 长度 |
| `caption` | `string` | ✅ 是 | 表格标题，**必须在表格对象内部**，不可在对象外部 |

#### ❌ 常见错误

**错误 1：`caption` 在对象外面**

```json
// ❌ 错误 — caption 在对象外部，导致 JSON 解析失败
"tables": [{"headers":["A","B"],"rows":[["a1","b1"]]},"caption":"表：XX"]

// ✅ 正确 — caption 在对象内部
"tables": [{"headers":["A","B"],"rows":[["a1","b1"]],"caption":"表：XX"}]
```

**错误 2：`rows` 为一维数组**

```json
// ❌ 错误 — rows 是一维数组
"rows": ["a1","b1","a2","b2"]

// ✅ 正确 — rows 是二维数组，每行是独立的子数组
"rows": [["a1","b1"],["a2","b2"]]
```

**错误 3：行元素数量与表头不一致**

```json
// ❌ 错误 — 第2行只有1个元素，但headers长度为2
"headers": ["维度","说明"],
"rows": [["a1","b1"],["a2"]]

// ✅ 正确
"rows": [["a1","b1"],["a2","b2"]]
```

#### 生成检查清单

在写入 HTML 前逐项确认：
- [ ] 每个 tables 数组元素都是独立的对象 `{headers, rows, caption}`
- [ ] `caption` 字段在对象内部，不在数组外层
- [ ] `rows` 是二维数组，每个子数组元素数量等于 `headers.length`
- [ ] 所有表格对象包含全部三个必填字段

### ⚠️ CRITICAL — TEMPLATE-BASED GENERATION (NEW v3.2)

**Use the verified skeleton template `resources/templates/base_deep_dive.html` as the BASE for ALL HTML output.**

```
WORKFLOW:
1. READ  resources/templates/base_deep_dive.html  →  get the full skeleton
2. READ  ../_shared/templates/<template_id>/deep_dive.css  →  get TEMPLATE_CSS (v3.3)
3. DETECT context_plan → determine HAS_CONTEXT_PLAN (= true/false)
4. FILL all %PLACEHOLDER% markers with computed data
5. REMOVE <!-- CONDITIONAL: HAS_CONTEXT_PLAN --> blocks if context_plan is absent
6. WRITE the final HTML file
```

**Core principle**: The template's CSS and JS skeleton are **proven working**. The ONLY things that change between materials are the DATA values and modules. Do NOT rewrite the CSS or JS logic — only inject data.

**Placeholder Reference**:
| Placeholder | Source | Required |
|---|---|---|
| `%TEMPLATE_CSS%` | **NEW v3.3** — Full `:root{...}` + `[data-theme="light"]{...}` from `../_shared/templates/<id>/deep_dive.css` | ✅ |
| `%PAGE_TITLE%` | `{kp_name}深度研读` | ✅ |
| `%NAV_TITLE%` | `{truncated kp_name}` | ✅ |
| `%HERO_TITLE%` | Full KP title | ✅ |
| `%HERO_TAGS_HTML%` | Tags as `<span>` elements | ✅ |
| `%META_STATS_HTML%` | Module count, est time, depth level | ✅ |
| `%PLAN_FILE%` | From context_plan → plan_file | ⚠️ if context_plan |
| `%KP_ID%` | From context_plan → kp_id | ⚠️ if context_plan |
| `%PLAN_NAME%` | From context_plan → plan_name | ⚠️ if context_plan |
| `%PHASE_NAME%` | From context_plan → phase_name | ⚠️ if context_plan |
| `%KP_NAME%` | KP name | ⚠️ if context_plan |
| `%POSITION%` | e.g. "第3/8个知识点" | ⚠️ if context_plan |
| `%PREREQUISITES%` | From context_plan → prerequisites | ⚠️ if context_plan |
| `%NEXT_KPS%` | From context_plan → next_kps | ⚠️ if context_plan |
| `%MODULES_HTML%` | Generated module blocks | ✅ |
| `%MODULE_IDS_JSON%` | JSON array of module element IDs | ✅ |
| `%SEARCH_INDEX_JSON%` | JSON array of {id, t(title), c(content)} | ✅ |

**Conditional Block Handling**:
- If `HAS_CONTEXT_PLAN = true`: Keep `<!-- CONDITIONAL: HAS_CONTEXT_PLAN -->` blocks (journey-bar, journey-footer, deep-floating-back)
- If `HAS_CONTEXT_PLAN = false`: REMOVE all blocks between `<!-- CONDITIONAL: HAS_CONTEXT_PLAN -->` and `<!-- /CONDITIONAL -->`

### Phase 4: Generate HTML Page

#### 4A — HTML 网页输出 (默认)

**基线模式 (无CDN)**:

1. 生成纯 HTML + 内联 CSS + 轻量 JS 的自包含文件
2. 不依赖任何外部 CDN 资源
3. 图表用纯 CSS/SVG 实现（静态展示版）
4. 公式用 Unicode 或简单 HTML 标记表示

**HTML 基结构**:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[知识点名称] - 学习资料</title>
  <style>/* 内联 CSS 变量 + 主题 + 布局 + 动画 */</style>
</head>
<body>
  <!-- 进度条 -->
  <!-- 主题切换按钮 -->
  <!-- [v3.0] 学习路线位置导航条 (仅 context_plan 启用时) -->
  <!-- 元信息Hero卡片 -->
  <!-- 侧边栏导航 -->
  <!-- 模块内容区 (每个模块一个 <section>) -->
  <!-- [v3.0] 页脚返回学习路线链接 (仅 context_plan 启用时) -->
  <!-- [v3.2] 悬浮返回按钮 (仅 context_plan 启用时) — 固定在右下角，任何滚动位置可见 -->
  <!-- 页脚导出按钮 -->
  <script>/* 轻量交互 JS: 主题切换/导航高亮/滚动动画/搜索 */</script>
</body>
</html>
```

**CDN 增强层 (可选)**:

如果用户需要交互图表和精美公式渲染，在基线 HTML 基础上注入 CDN 标签：

```html
<!-- 在 <head> 中添加 -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>
```

注入 CDN 后：

- ECharts 图表获得完整交互能力（hover提示/缩放/图例切换）
- KaTeX 渲染所有 LaTeX 公式为美观的数学符号
- 页面顶部自动添加 \[互动增强版] 标签

**KaTeX 渲染的标准调用范式**：

在 CDN 增强模式下，必须在所有模块 HTML 通过 `innerHTML` 注入完成后，执行以下标准调用：

```javascript
renderMathInElement(container, {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false }
  ],
  throwOnError: false,
  strict: false
});
```

关键约束：

- `container`：包含所有模块内容的 DOM 元素（通常是 `modulesContainer` 或 `#main-content`）
- `throwOnError: false`：单条公式语法错误不阻断全页渲染——错误公式以原始 LaTeX 源码显示
- `strict: false`：容忍 LaTeX 中的 Unicode 字符（如 `\text{}` 中的中文）
- **调用位置**：在 `DOMContentLoaded` 回调中，`innerHTML` 注入之后，图表初始化之前
- **禁止重复调用**：后续 JS 操作如修改 DOM 内容，不要再调用 `renderMathInElement`——重新注入 innerHTML 会清除已渲染的公式

**ECharts 初始化前的检查**：

```javascript
if (typeof echarts === 'undefined') {
  // CDN 不可达，图表区域静默为空——不阻断页面
  return;
}
```

**Google Fonts 降级**：

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/..." onerror="this.onerror=null;this.href=''">
```

#### 4A-prime: HTML 输出安全与转义规范（必须）

以下规则防止公式乱码、HTML 注入和 XSS 风险。在生成 HTML 时必须执行。

**规则 1：`content` 字段的 HTML 实义转义**

`content` 字段最终通过 `innerHTML` 注入到 DOM（模板中用 `${parsed_content}` 或 `modulesContainer.innerHTML += html`）。因此，在 Markdown 转换之前，必须对原始 content 执行基础转义：

| 字符 | 替换为 |
|------|--------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |

转义**顺序**：先 `&`，再 `<`、`>`。**例外**：已经被 KaTeX `$...$` 或 `$$...$$` 包裹的内容不参与 HTML 转义（但 `$` 的数量必须匹配）。

之后再进行 Markdown 语法转换（`**bold**`、行内代码等）。

**规则 2：`derivation` 字段的完整转义**

`derivation` 字段通过 `innerHTML` 注入（模板中用 `${formula.derivation}`），必须执行**全部**以下转义：

| 字符 | 替换为 | 原因 |
|------|--------|------|
| `&` | `&amp;` | HTML 实体的起始字符 |
| `<` | `&lt;` | HTML 标签的起始字符（如 `a < b` ⟹ `a &lt; b`） |
| `>` | `&gt;` | HTML 标签的结束字符 |
| `$` | `&#36;` | KaTeX 定界符（如 `成本 < $100` ⟹ `成本 &lt; &#36;100`） |

转义**顺序**：`&` → `<` → `>` → `$`。

⚠️ **如 derivation 中包含 LaTeX 公式，`$` 和 `<` 应使用 LaTeX 命令替代**：`<` → `\lt`，`$` → `\$`（在 KaTeX 渲染后生效）。纯文本部分仍用 HTML 实体。

**规则 3：`hook` / `caption` / `key_takeaway` 字段的 `$` 转义**

这三个字段也通过 `innerHTML` 注入。仅需处理 `$` 符（通常不含 `<`/`>`）：

- 非公式的 `$` → `&#36;`
- LaTeX 公式内的 `$` 保持原样（KaTeX 会将其解析为定界符）

**规则 4：CDN 模式下 `renderMathInElement` 的调用时机与隔离**

KaTeX 的 `renderMathInElement` 会在 DOM 中**扫描所有 `$...$` 和 `$$...$$`** 并渲染。关键约束：

- **调用时机**：在**所有**模块 HTML 通过 `innerHTML` 注入完成之后，**一次性**调用
- **隔离原则**：如果后续有 JS 操作会修改 DOM 内容（如搜索过滤/图表重绘），不要再次 `renderMathInElement`——已被渲染的公式区域不应被覆盖
- **throwOnError**：必须设为 `false`，防止单条公式语法错误阻断全页渲染

**规则 5：不可注入可执行代码**

所有通过 `innerHTML` 注入的内容禁止包含以下字符串（即使由 AI 自然生成也不允许）：

- `<script` + `>`（完整 script 标签）
- `onerror=`、`onclick=`、`onload=` 等事件处理器
- `javascript:` 伪协议

若 AI 生成的 content 或 derivation 偶然包含这些字符串，必须在写入前移除。例如替换 `script` → `scr&#105;pt`（零宽断字）。

**生成检查清单**（写入 HTML 前逐项确认）：

- [ ] content 字段已执行 `&` → `&amp;` → `<` → `&lt;` → `>` → `&gt;`
- [ ] derivation 字段已执行 `&` → `<` → `>` → `$` 的完整转义链
- [ ] hook/caption/key_takeaway 中非公式的 `$` 已替换为 `&#36;`
- [ ] `renderMathInElement` 调用在 `innerHTML` 注入之后，且 `throwOnError: false`
- [ ] 所有 `innerHTML` 注入的内容不含 `<script>` 或事件处理器

#### 4B — 通用高级 UX 标准

以下标准所有 HTML 输出必须达标：

**主题系统**:

- CSS 自定义属性 (`:root` / `[data-theme="dark"]`) 实现双主题
- localStorage 持久化主题偏好 (key: `slm-theme`)
- 切换按钮含太阳/月亮图标动画

**导航与进度**:

- 顶部固定导航栏，`backdrop-filter: blur(20px)` 毛玻璃效果
- 滚动进度条：navbar 下方 2-3px 渐变色条
- 每个模块标题旁显示 "⏱ 约 X 分钟" 阅读时间
- 桌面端右侧固定圆点导航，hover 显示模块名

**元信息卡片** (页面顶部):

```
┌──────────────────────────────────────────────────────────────┐
│  📖 [知识点名称]   🏷️ [领域]   🎯 [深度×广度]   🎨 [纹理]      │
│  ⏱️ 约X分钟阅读   📦 Y个模块   📊 Z张图表   📐 W条公式          │
└──────────────────────────────────────────────────────────────┘
```

**学习路线位置导航条 (NEW v3.0)** (仅 `context_plan.enabled` 时渲染，位于 Hero 卡片下方):

```html
<div class="journey-bar" id="journeyBar">
  <div class="journey-path">
    <span class="journey-icon">📍</span>
    <span class="journey-plan" onclick="var w=window.open('[plan_file]#kc-[kp_id]','plan_main');if(w)w.focus()">[plan_name]</span>
    <span class="journey-sep">〉</span>
    <span class="journey-phase">[phase_name]</span>
    <span class="journey-sep">〉</span>
    <span class="journey-kp">[kp_name]</span>
    <span class="journey-pos">([position])</span>
  </div>
  <div class="journey-nav">
    <span class="journey-prev" title="前置: [prerequisites]">← 前置</span>
    <span class="journey-divider">|</span>
    <span class="journey-next" title="后续: [next_kps]">后续 →</span>
  </div>
</div>
```

CSS 要求:

```css
.journey-bar{background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);
  padding:12px 20px;margin:16px auto 0;max-width:900px;display:flex;align-items:center;
  justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:0.82rem;box-shadow:var(--shadow-elevated)}
.journey-path{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.journey-icon{font-size:1rem}
.journey-plan{color:var(--accent-purple);font-weight:700;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.journey-plan:hover{color:var(--accent-gold)}
.journey-sep{color:var(--text-muted);font-size:0.7rem}
.journey-phase{color:var(--text-secondary);font-weight:600}
.journey-kp{color:var(--text-primary);font-weight:700}
.journey-pos{color:var(--text-muted);font-size:0.72rem}
.journey-nav{display:flex;align-items:center;gap:8px;font-size:0.75rem}
.journey-prev,.journey-next{color:var(--text-muted);cursor:default}
.journey-divider{color:var(--border-subtle)}
```

**页脚返回学习路线链接 (v3.1: hash导航 + 窗口复用)** (仅 `context_plan.enabled` 时渲染):

```html
<footer class="journey-footer" style="text-align:center;padding:40px 32px 60px;opacity:0.8">
  <a href="#" class="back-to-plan" style="display:inline-flex;align-items:center;gap:8px;
    padding:10px 24px;background:var(--bg-card);border:1px solid var(--border-glow);border-radius:50px;
    color:var(--text-secondary);text-decoration:none;font-size:0.85rem;font-weight:600;
    transition:all var(--transition-smooth)"
    onclick="event.preventDefault();var w=window.open('[plan_file]#kc-[kp_id]','plan_main');if(w)w.focus()">
    🔗 返回学习路线: [plan_name] → [phase_name]
  </a>
  <p style="margin-top:12px;font-size:0.72rem;color:var(--text-muted)">
    本资料是 <strong>[plan_name]</strong> 第 [phase_index] 阶段 "[phase_name]" 的深度研读材料
  </p>
</footer>
```

- **v3.1 关键规则**:
  - 使用 `window.open('[plan_file]#kc-[kp_id]', 'plan_main')` 而非普通的 `<a href>`
  - 窗口名固定为 `'plan_main'` — 确保同一学习方案不重复打开标签页
  - hash `#kc-[kp_id]` 使主方案页面自动展开对应知识点

#### 4B-z: 悬浮返回按钮 (NEW v3.2) — 仅 `context_plan` 启用时

**设计目的**: 无论用户滚动到深度资料的哪个位置，右下角始终有一个显眼的悬浮按钮可以一键返回主方案对应知识点。与页脚返回链接互补（页脚 = 精准导航，悬浮按钮 = 随时随地可达）。

**HTML** (放在 `</body>` 前、`<script>` 之前):
```html
<!-- 悬浮返回按钮（固定在右下角）-->
<div class="deep-floating-back" style="position:fixed;right:20px;bottom:20px;z-index:10000">
  <button style="padding:12px 20px;background:linear-gradient(135deg,var(--accent-color),var(--accent-dark));
    color:white;border:none;border-radius:24px;font-size:0.85rem;font-weight:600;
    cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);
    transition:transform 0.2s,box-shadow 0.2s"
    onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'"
    onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
    onclick="event.preventDefault();var w=window.open('[plan_file]#kc-[kp_id]','plan_main');if(w)w.focus()">
    ← 返回学习方案
  </button>
</div>
```

**规则**:
- `[plan_file]` = `context_plan.html_file` 的值
- `[kp_id]` = `context_plan.kp_id` 的值
- 窗口名固定为 `'plan_main'`（与页脚返回链接共享，确保不重复开标签页）
- 必须使用 `position:fixed` + `z-index:10000` 确保始终在最顶层
- 移动端适配: `@media(max-width:768px){.deep-floating-back{right:15px;bottom:15px}.deep-floating-back button{padding:10px 16px;font-size:0.8rem}}`
- 按钮颜色使用 `var(--accent-color)` + `var(--accent-dark)` CSS 变量，跟随主题上下文自动适配
- 按钮文案固定为 `← 返回学习方案`

**与 journey bar + footer link 的职责分离**:
| 组件 | 位置 | 导航能力 | viewport-invariant |
|------|------|---------|--------------------|
| Journey bar (v3.0) | 页面顶部 | 显示当前 KP 在学习路线中的位置 | ❌ 需滚动到顶部 |
| Footer link (v3.0) | 页脚 | 精确跳转到主方案对应 KP 并自动展开 | ❌ 需滚动到底部 |
| **Floating button (v3.2)** | **右下角 fixed** | **一键跳转到主方案对应 KP 并自动展开** | **✅ 任何滚动位置** |

**键盘快捷键**:

- `Ctrl+K` / `Cmd+K`: 打开搜索
- `Escape`: 关闭弹窗/搜索
- `Ctrl+D` / `Cmd+D`: 切换深色/浅色主题

**搜索系统**:

- `Ctrl+K` 触发搜索弹窗，半透明背景遮罩
- 实时过滤 (最小2字符触发)，匹配词 `<mark>` 高亮
- 搜索结果可点击跳转

**滚动与动画**:

- 模块渐显: IntersectionObserver + `translateY(24px)→0` + `opacity 0→1`
- 卡片 hover: `translateY(-2px)` + `box-shadow` 增强

**响应式设计**:

- 3断点: 桌面(>1024px) / 平板(768-1024px) / 手机(<768px)
- 手机端侧边栏隐藏，底部导航替代
- 图表容器 ResizeObserver 自适应

**导出功能**:

- "导出笔记": 收集内容生成 Markdown 复制到剪贴板
- "打印": `window.print()`，print CSS 隐藏导航等非内容元素

#### 4C — PDF 输出

1. 收集所有模块内容
2. 按序填充进 `templates/pdf/template.tex`
3. 公式使用 LaTeX 原生渲染
4. 编译: `xelatex -interaction=nonstopmode output.tex`
5. PDF 元信息: 标题=知识点名称, 关键词=领域+纹理

### Phase 5: 交付确认 (v3.0)

生成完成后：

#### Step 5.1: Manifest Registration (NEW v3.0)

注册生成的资料到共享 `manifest.json`：

1. 读取输出目录的 `manifest.json`（如不存在，基于 `../../_shared/manifest_schema.json` 创建）
2. 追加条目到 `materials[]`:

```json
{
  "id": "<topic_id>-deep",
  "topic_id": "option-pricing",
  "topic_name": "期权定价",
  "depth": "理解",
  "breadth": "标准",
  "texture": "G1",
  "html_file": "option_pricing_deep.html",
  "generated_at": "<ISO date>",
  "template_id": "<indigo-night|cedar-dawn|...>",
  "belongs_to_plan": "[plan_id, if context_plan]",
  "belongs_to_phase": "[phase_id, if context_plan]",
  "belongs_to_kp": "[kp_id, if context_plan]"
}
```

1. 如果 `context_plan.enabled`，自动匹配 `plans[]` 中对应 KP 的 `has_deep_dive` 设为 `true`
2. 验证 JSON 后再写入，保留 `.manifest.json.bak` 备份

#### Step 5.1.4: 同步主方案 HTML 的 KP 数据 (NEW v3.3 — 治本)

**问题背景**: manifest.json 中的 `has_deep_dive` 是元数据标志，但主方案 HTML 中 `↗` 按钮的渲染逻辑读取的是页内 `var KPS = [...]` 数组中的 `deep_dive.status` 和 `deep_dive.html_file`。仅更新 manifest.json **不会**让按钮出现。必须同时编辑主方案 HTML 文件中的 KPS 数据。

**触发条件**: `context_plan.enabled === true` 且 `plan_file` 存在且可访问。

**操作流程**:

```
1. READ {plan_file}                    → 获取主方案 HTML 全文
2. SEARCH 该 KP 在 KPS 数组中的行       → 用 kp_id 定位
   模式: id:'{kp_id}',n:'{kp_name}'
3. SEARCH-REPLACE:
   OLD: deep_dive:{query:'...',topic_id:'...',prompt:'深度研读',status:'none'}
   NEW: deep_dive:{query:'...',topic_id:'...',prompt:'深度研读',status:'ready',html_file:'{relative_path_to_deep_html}'}
4. WRITE {plan_file}                   → 覆盖写入
```

**示例**:

```javascript
// 替换前 (OLD)
deep_dive:{query:'Black-Scholes',topic_id:'black-scholes',prompt:'深度研读',status:'none'}

// 替换后 (NEW)
deep_dive:{query:'Black-Scholes',topic_id:'black-scholes',prompt:'深度研读',status:'ready',html_file:'deri/black_scholes_deep.html'}
```

**注意事项**:
- `html_file` 使用相对于主方案的路径（如 `deri/black_scholes_deep.html`）
- 如果 KPS 中已经有 `html_file`（之前生成过），替换整个 `deep_dive:{...}` 字段
- 替换后验证: `grep "status:'ready'" {plan_file} | grep {kp_id}` 必须输出 ≥1
- 如果主方案 HTML 不存在或结构不匹配，输出 warning 但不阻断流程（允许 L2 兜底）

**L2 兜底机制**: 即使 Step 5.1.4 无法完成（plan_file 不存在、结构不匹配等），主方案 HTML 中的 `syncKPsFromManifest()` 函数会在页面加载时从 manifest.json 读取材料状态，动态更新 KPS 状态和注入 ↗ 按钮。因此 `manifest.json` 的更新（Step 5.1）始终是必须的、优先级最高的操作。详见 learning-plan-generator SKILL.md v3.5。

#### Step 5.2: 向用户报告

```
✅ 学习资料生成完成！

📖 知识点: [名称]
🏷️ 领域: [金融/AI科技]  |  标签: [tag1, tag2, ...]
🎯 深度: [概览/理解/精通] × 广度: [核心/标准/全景]
🎨 表达纹理: [G1-G8] — [纹理描述]
🖌️ 外观模板: [模板名称]
[🔗 学习路线: plan_name → phase_name → 第N个知识点]  (仅 context_plan 启用时)

📊 内容统计:
   · 共 X 个内容模块 ([含 learning_journey 路线导航])  (仅 context_plan 启用时)
   · Y 张图表
   · Z 条数学公式
   · W 篇参考文献
   · 约 N 字正文

⏱️ 估算阅读时间: 约 XX 分钟

📄 产出文件:
   · HTML网页: [路径]
   · PDF文档: [路径] (如选择了pdf)
   · 🔗 已注册到 manifest.json

💡 试试这些操作:
   · 按 Ctrl+D 切换深色/浅色模式
   · 按 Ctrl+K 搜索任意模块
   · 点击公式展开推导过程
   [· 点击顶部 📍 返回学习路线]  (仅 context_plan 启用时)
```

## 重要约束

1. **不要编造数据**: 所有事实性数据须有可靠来源。无法确定的标 `[需验证]`
2. **不要跳过模块**: 必须为 relevance\_score ≥ 0.40 且在 max\_modules 范围内的所有模块生成内容
3. **不要输出纯文本**: 图表、公式、表格是强制要求，不可省略
4. **不要生成重复内容**: 不同模块之间的内容不可重叠。必须遵守 Step 3.0 的去重追踪器和 Step 3.5 的去重重审机制。
5. **不要生成未验证的代码**: ECharts option 必须是语法正确的 JSON
6. **基线HTML不要依赖CDN**: 确保文件离线可打开
7. **尊重纹理风格**: Phase 2 确定的纹理必须在每个模块的内容风格中体现
8. **动态时长必须基于实际数据**: 不要使用固定标签
9. **🔴 v3.2: 悬浮返回按钮必须在 context_plan 启用时生成**: 
   - 使用模板 `base_deep_dive.html` 生成 HTML
   - 检测 `context_plan.enabled === true` 时，保留全部 `<!-- CONDITIONAL: HAS_CONTEXT_PLAN -->` 块
   - 输出 HTML 中必须同时包含以下三项（缺一不可）：
     a) `journey-bar` — 顶部学习路线导航条
     b) `journey-footer` — 页脚返回链接 + 学习方案归属说明
     c) `deep-floating-back` — 右下角悬浮返回按钮
   - 验证命令: `grep -c 'deep-floating-back' %OUTPUT_FILE%` 必须输出 ≥1
   - 验证命令: `grep -c 'journey-bar' %OUTPUT_FILE%` 必须输出 ≥1  
   - 验证命令: `grep -c 'journey-footer' %OUTPUT_FILE%` 必须输出 ≥1
   - 验证命令: `grep -c '%[A-Z]' %OUTPUT_FILE%` 必须输出 0 (所有占位符已替换)
   - 验证命令: `grep -c 'CONDITIONAL:' %OUTPUT_FILE%` 必须输出 0 (所有条件标记已处理)
   - 如果 context_plan 未启用: 验证 `grep -c 'CONDITIONAL:' %OUTPUT_FILE%` 必须输出 0 (条件区块已移除)

10. **🔴 v3.2: 必须使用 base_deep_dive.html 模板**: 不要从零手写 HTML CSS/JS。每次生成时第一步先 READ `resources/templates/base_deep_dive.html`，获取完整骨架后进行数据注入。这确保所有产出文件的导航组件、悬浮按钮、搜索、主题切换等行为完全一致。

11. **🔴 v3.3 模板 CSS 注入**: `%TEMPLATE_CSS%` 必须替换为 `../_shared/templates/<template_id>/deep_dive.css` 的完整内容（一字不改）。模板 CSS 包含 `:root{}` 和 `[data-theme="light"]{}` 块。若 context_plan 存在，优先使用 context_plan.template_id；否则从 manifest 查找或自动匹配。

## 示例

### 输入示例

```
我想了解"Black-Scholes期权定价模型"，请生成学习资料
```

### 预期处理流程

1. **Phase 1**:
   - 匹配 topic\_profiles.json → topic: "Black-Scholes模型"
   - domain: finance, tags: \[derivatives, pricing, quant-models, classic-models]
   - profile: {abstract:0.85, systemic:0.50, math\_density:0.95, temporal:0.15}
   - suggested\_texture: G1 (公式推导驱动型)
   - 默认: 理解×标准 (content\_depth=1.0, max\_modules=16)
2. **Phase 2**:
   - 计算28个模块的 relevance\_score
   - quant\_model: 0.72(base) + 0.20(derivatives) + 0.22(pricing) + 0.20(quant-models) = 动态>0.80 → MANDATORY
   - micro\_structure: 0.52(base) + 0.08(derivatives) = 0.60 → OPTIONAL
   - crisis\_review: 0.60(base) + 0(no crisis tag) = 0.60 → OPTIONAL
   - 按 scores 排序取前16个
   - 加载 G1 纹理模板
3. **Phase 3**:
   - 每模块 word\_count = base × 1.0 × texture\_word\_factor
   - 核心模块 principle: 600 × 1.0 × 1.0 = 600字 (G1 纹理下公式占比35%)
   - 按 G1 风格生成: 公式驱动的连续推导
4. **Phase 4**:
   - 生成纯 HTML (无CDN基线) + ECharts SVG 静态图
   - 如用户需要交互版，注入 CDN 增强层
5. **Phase 5**: 交付报告

