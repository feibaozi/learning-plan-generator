# 智能学习系统 — Skills 说明文档

基于 Claude Code 的两套 AI Skill，协同工作实现**从学习路线规划到知识深度加工**的全流程自动化。

---

## 概览

| Skill | 定位 | 输入 | 输出 |
|-------|------|------|------|
| **learning-plan-generator** | 学习方案生成器 | 任意学习主题 | Markdown 方案 + 交互式 HTML 页面 |
| **smart-learning-materials** | 知识深度加工引擎 | 单个知识点/概念 | 结构化深度研读 HTML 页面（侧边栏导航+ECharts动态图表） |

两个 Skill 通过 **context_plan 标记** + **manifest.json** 实现深度联动——从学习方案的任意知识点可一键生成深度资料，深度资料可精准跳回学习方案对应位置。

---

## 系统架构

```
用户输入主题
    │
    ▼
┌─────────────────────────────────────┐
│  learning-plan-generator             │
│  (.claude v3.9.0 / .trae v3.9.0)    │
│  · 主题自动分类 (60主题库)             │
│  · 4D画像分析 (抽象/系统/数学/演化)    │
│  · 纹理选择 (G1-G8)                   │
│  · 模板匹配 (6套视觉主题)              │
│  · 生成 Markdown + HTML 学习方案       │
└──────────┬──────────────────────────┘
           │ 方案中含 KP 知识点卡片
           │ 每个 KP 有 "深度研读" 按钮
           ▼
┌─────────────────────────────────────┐
│  smart-learning-materials            │
│  (v3.8.0)                            │
│  · 接收 context_plan 上下文标记       │
│  · 模块评分 → 编排 (16核心+8可选)     │
│  · 纹理感知内容生成 (G1-G8风格)       │
│  · 左侧侧边栏目录导航 (280px)        │
│  · ECharts 5.x 动态图表              │
│  · %TEMPLATE_CSS% 占位符注入机制    │
│  · deep_dive.css 外部引用（6主题）   │
│  · 图表/公式/案例/文献 多模态输出     │
│  · 生成深度研读 HTML + 回写 manifest  │
└──────────┬──────────────────────────┘
           │ 返回链接精准定位到
           │ 学习方案中的对应 KP
           ▼
        回到学习方案 (hash锚点自动展开)
```

### 共享配置层

两个 Skill 共享同一套配置系统，位于 `.claude/skills/` 下：

| 配置文件 | 用途 |
|----------|------|
| `smart-learning-materials/resources/topic_profiles.json` | 60 个主题的 4D 画像库 |
| `smart-learning-materials/resources/heuristic_rules.json` | R1-R8 启发式推理规则 |
| `smart-learning-materials/resources/texture_templates.json` | G1-G8 学习纹理定义 |
| `smart-learning-materials/resources/module_weights.json` | 模块相关度评分权重 |
| `smart-learning-materials/resources/module-mapping.json` | 模块定义与排序规则 |
| `learning-plan-generator/resources/plan_params.json` | 方案专属动态参数 |
| `_shared/manifest_schema.json` | 共享文件清单格式 |
| `_shared/templates/manifest.json` | 6 套视觉模板注册表 |

---

## Skill 1: learning-plan-generator (v3.9.0)

**生成自适应、纹理感知的学习方案（Markdown + 交互式 HTML），适用于任意领域。**

### 核心能力

- **主题自动分类**：匹配 60 主题库或启发式推理，输出 4D 画像（抽象度/系统性/数学密度/演化速度）
- **动态参数计算**：根据画像自动决定阶段数(3-10)、周数、知识点数(12-50)、练习数(8-35)
- **8 种学习纹理 (G1-G8)**：公式推导/可视化/模型拆解/叙事驱动/平衡型/系统图解/趋势案例/教程实操
- **6 套视觉模板**：靛蓝之夜/雪松晨曦/石墨工作室/深海碧波/琥珀日暮/极光冰霜，按领域自动匹配
- **FLIP 知识卡片**：交互式 HTML 页面，含知识图谱、搜索、进度追踪、公式渲染、深色/浅色主题

### 触发方式

向 Claude Code 描述你的学习需求即可：

```
帮我生成一份"计量经济学"的学习方案，15周
我想系统学习"深度学习"，偏理论推导方向
帮我做一个"Python数据分析"的学习计划，重点是实操
```

### 产出文件

| 文件 | 说明 |
|------|------|
| `[主题]学习方案.md` | Markdown 格式完整方案 |
| `[缩写]_learning.html` | 交互式 HTML 页面 |
| `manifest.json` | 方案注册到共享清单 |

---

## Skill 2: smart-learning-materials (v3.8.1)

**针对单个知识点/概念/术语，生成结构化、多层级、多模态的高质量深度研读资料。**

### 核心能力

- **主题自动匹配**：与 learning-plan-generator 共享 60 主题库，确保分类一致
- **3×3 深度×广度矩阵**：概览/理解/精通 × 核心/标准/全景，共 9 档
- **模块智能编排**：28 个预定义模块，按相关度评分自动筛选和排序（必选≥0.80，可选0.40-0.80）
- **纹理感知写作**：根据 G1-G8 纹理自动调整每个模块的内容比例（公式/图表/案例/代码）
- **CSS 模板化注入 (v3.8)**：`%TEMPLATE_CSS%` 占位符机制，base_deep_dive.html 骨架零硬编码 CSS，deep_dive.css 作为 6 主题样式的单一权威源，生成时读取并注入
- **左侧侧边栏目录导航 (v3.7)**：280px 固定宽度，模块名全量显示，IntersectionObserver 自动追踪高亮，≤1024px 隐藏
- **ECharts 5.x 动态图表 (v3.7)**：CDN 加载，tooltip/图例切换/响应式 resize/深浅主题联动，替代 Canvas 静态绘制
- **表格样式统一 (v3.7)**：`.table-container` 模式，深色卡片风表头 + 青色标题 + hover 行高亮
- **流体铺满布局 (v3.5)**：`max-width: calc(100% - 48px)` 流式布局，窗口缩放时无留白
- **CDN 增强层**：ECharts（已内置）+ KaTeX 公式渲染（可选）
- **学习路线感知**：通过 context_plan 标记感知当前知识点在完整学习方案中的位置
- **表格数据结构校验 (v3.4.1)**：生成后自动校验 tables 字段的 JSON 结构（caption 位置、rows 维度、行列一致性），从源头杜绝白屏

### 触发方式

**方式一**：在学习方案 HTML 中点击知识点卡片上的 "深度研读" 按钮（自动嵌入 context_plan 标记）

**方式二**：直接向 Claude Code 提问：

```
帮我整理"Black-Scholes期权定价模型"的学习资料
解释一下"Transformer自注意力机制"的原理
什么是"蒙特卡洛模拟"？给我做一份知识页面
```

### 28 个内容模块

| 类别 | 模块（部分列举） |
|------|-----------------|
| 通用核心 | 背景、概念、原理、发展历程、应用场景、案例分析 |
| 深度加工 | 风险与局限性、行业格局、争议与问题、未来展望 |
| 学习方法 | 学习路径、常见误区、术语表、创新方向、努力方向 |
| 金融专属 | 量化模型、监管框架、微观结构、跨市场分析、危机回顾 |
| AI 科技专属 | 架构设计、计算成本、开源生态、基准评测、伦理、研究地图 |
| 条件模块 | learning_journey（仅在有学习路线上下文时启用） |

### 产出文件

| 文件 | 说明 |
|------|------|
| `p{阶段}_{序号}_{知识点}_deep.html` | 深度研读 HTML 页面 |
| `manifest.json` | 注册资料到共享清单（自动关联所属学习方案） |

---

## 深度联动机制

两个 Skill 通过三层机制实现无缝协作：

### Layer 1: context_plan 标记（pristine — 零失败）

学习方案 HTML 中的 "深度研读" 按钮自动生成嵌入上下文标记的 prompt：

```
[context_plan: plan_id="econometrics-learning";
 plan_name="计量经济学 系统学习方案";
 plan_file="econ_learning.html";
 template_id="indigo-night";
 phase_id="p3"; phase_name="多元回归分析";
 kp_id="p3_4"; kp_name="异方差性诊断";
 ...]
```

smart-learning-materials 解析此标记后：
- 精确感知当前知识点在完整方案中的位置
- 启用 `learning_journey` 条件模块（前置/后续知识导航）
- 底部返回链接精准跳转到 `plan_file#kc-kp_id`（hash 锚点自动展开对应卡片）
- 继承主方案的视觉模板（template_id），保持外观一致

### Layer 2: manifest.json 注册（元数据同步）

两份 Skill 生成的方案和资料都注册到同一 `manifest.json`：
- `plans[]` — 学习方案条目（含阶段、知识点列表、`has_deep_dive` 状态）
- `materials[]` — 深度资料条目（含 `belongs_to_plan`/`belongs_to_phase`/`belongs_to_kp` 关联字段）

### Layer 3: syncKPsFromManifest()（运行时兜底）

学习方案 HTML 加载时自动执行，从 `manifest.json` 读取已生成的深度资料，动态更新 KP 状态并注入 "已研读 ↗" 按钮。确保即使 Layer 1 写入失败，Layer 3 也能在下次页面加载时恢复完整链接。

---

## 视觉模板系统

6 套可切换的外观主题，主方案与深度资料共享 CSS 变量体系，确保视觉一致性：

| 模板 | 风格 | 适合领域 |
|------|------|----------|
| 靛蓝之夜 (indigo-night) | 深邃、专业、学术 | 数学、物理、计量经济学 |
| 雪松晨曦 (cedar-dawn) | 温暖、自然、有机 | 生物学、生态学、人文 |
| 石墨工作室 (graphite-studio) | 极简、黑白灰、瑞士风格 | 编程、架构设计、工程 |
| 深海碧波 (ocean-depth) | 清凉、科技感 | AI、数据科学、机器学习 |
| 琥珀日暮 (sunset-amber) | 温暖、浓郁、经典 | 金融、历史、哲学 |
| 极光冰霜 (arctic-frost) | 清冽、北欧、创意 | 设计、前端、UX |

模板自动匹配算法根据用户输入的关键词、领域标签和纹理特征计算得分，也可手动指定。

---

## 学习纹理 (G1-G8)

决定内容表达的方式和比例分配：

| 纹理 | 名称 | 公式占比 | 图表占比 | 案例占比 | 特点 |
|------|------|----------|----------|----------|------|
| G1 | 公式推导驱动 | 30-35% | 10-15% | 0-5% | 连续推导链，从基本假设到结论 |
| G2 | 公式+可视化 | 18-22% | 25-30% | 8-10% | 每个公式配示意图 |
| G3 | 模型拆解 | 15-20% | 20-25% | 15-20% | 先拆后合，对比表是核心手法 |
| G4 | 叙事驱动 | 5-8% | 12-15% | 10-12% | 论点→论据→反驳→综合 |
| G5 | 平衡型 | 15-18% | 18-22% | 12-15% | 每模块至少2种表达元素 |
| G6 | 系统图解 | 8-10% | 35-40% | 12-15% | 以图为主以文为辅 |
| G7 | 趋势案例 | 5-8% | 25-30% | 18-22% | 时间线与趋势对比是核心 |
| G8 | 教程实操 | 12-15% | 15-20% | 15-18% | 编号步骤+预期输出+常见错误 |

---

## 使用示例

### 场景一：从零开始学习一个领域

```
用户: 帮我生成一份"金融衍生品定价"的深度学习方案，8周

Claude Code 自动调用 learning-plan-generator：
1. 匹配 topic_profiles.json → 金融衍生品/quantitative finance
2. 4D画像: 抽象0.82 系统0.60 数学0.92 演化0.30
3. 选择 G1(公式推导) 纹理 + amber-dusk(琥珀日暮) 模板
4. 计算: 7阶段/8周/32KP/18练习/5公式表
5. 生成 deriv_learning.html + 金融衍生品及其定价学习方案.md
```

### 场景二：在方案中深入某个知识点

```
用户在学习方案 HTML 中点击 "Black-Scholes模型" 卡片的 📖深度研读

自动复制含 context_plan 标记的 prompt → 粘贴给 Claude Code

Claude Code 自动调用 smart-learning-materials：
1. 解析 context_plan 标记
2. 匹配 topic: Black-Scholes模型
3. 启用 learning_journey 模块（显示学习路线位置）
4. 按 G1 纹理生成内容，包含推导过程/ECharts图表/参考文献
5. 生成 p2_2_black_scholes_model_deep.html
6. 注册到 manifest.json，回写主方案 KP 状态
```

### 场景三：单独查询一个知识点

```
用户: 解释一下"随机梯度下降(SGD)"，全面一点

Claude Code 自动调用 smart-learning-materials：
1. 匹配 topic: 优化算法/SGD
2. domain: ai-tech, 纹理: G2(公式+可视化)
3. 深度: 理解(默认), 广度: 标准(最多16模块)
4. 生成含公式推导+ECharts可视化+代码示例的完整 HTML
```

---

## 文件结构

```
学习资料/
├── README.md                          # 本文档
├── validate_templates.ps1             # 模板校验脚本（流体布局/响应断点/ECharts resize）
├── sync_skills.ps1                    # Skill 同步脚本（.trae → .claude + .trae-cn）
├── .trae/
│   ├── rules/
│   │   └── project_rules.md           # 项目规范（SSOT 单一真相源 + HTML 生成强制规范）
│   └── skills/                        # ★ 单一真相源 — 所有 Skill 文档的唯一权威副本
│       ├── _shared/
│       │   ├── templates/
│       │   │   ├── manifest.json      # 6套视觉模板注册表
│       │   │   ├── indigo-night/      # 靛蓝之夜
│       │   │   ├── cedar-dawn/        # 雪松晨曦
│       │   │   ├── graphite-studio/   # 石墨工作室
│       │   │   ├── ocean-depth/       # 深海碧波
│       │   │   ├── sunset-amber/      # 琥珀日暮
│       │   │   └── arctic-frost/      # 极光冰霜
│       │   │       ├── plan.css       #   方案页 CSS 变量
│       │   │       └── deep_dive.css  #   深度资料完整 CSS（CSS 变量+布局+组件+响应式）
│       │   ├── manifest_schema.json   # 共享文件清单格式
│       │   └── linking_guide.md       # 联动指南
│       ├── learning-plan-generator/
│       │   ├── SKILL.md               # Skill 定义
│       │   └── resources/
│       │       ├── plan_params.json   # 方案动态参数引擎
│       │       └── templates/
│       │           └── base_plan.html # HTML 骨架模板
│       └── smart-learning-materials/
│           ├── SKILL.md               # Skill 定义（v3.8.0）
│           ├── resources/
│           │   ├── topic_profiles.json    # 60主题4D画像库
│           │   ├── heuristic_rules.json   # R1-R8启发式推理
│           │   ├── texture_templates.json # G1-G8纹理模板
│           │   ├── module_weights.json    # 模块权重与评分
│           │   ├── module-mapping.json    # 模块定义与排序
│           │   └── templates/
│           │       └── base_deep_dive.html # 深度资料 HTML 骨架（%TEMPLATE_CSS% 注入零硬编码）
│           ├── modules/
│           │   ├── common/            # 通用模块 (16个)
│           │   ├── finance/           # 金融专属模块 (6个)
│           │   └── ai-tech/           # AI专属模块 (6个)
│           └── test/
│               └── test_template.html # 模板验证测试页面（6主题+12组件）
│
├── .claude/skills/                    # Claude IDE 运行时读取（仅通过 sync_skills.ps1 同步，禁止直接修改）
├── .trae-cn/skills/                   # Trae IDE 运行时读取（仅通过 sync_skills.ps1 同步，禁止直接修改）
│
├── [学习主题]/                         # 各领域学习方案目录
│   ├── [主题]学习方案.md               # Markdown 格式方案
│   ├── [缩写]_learning.html           # 交互式 HTML 学习方案
│   ├── manifest.json                  # 方案注册清单
│   └── p*_*_*_*.html                 # 深度研读 HTML 资料
```

---

## 版本历史

| 版本 | 日期 | 关键变更 |
|------|------|----------|
| learning-plan-generator v3.9.0 | 2026-05-28 | 三模块交互化改造：知识图谱 Canvas→ECharts 交互式导航仪表盘（语义布局、节点可点击、连线分类型、状态同步）；方法论静态HTML→纹理感知交互式学习画布（G1-G8自适应、步骤可勾选、关联板块跳转）；图表指南名称列表→视觉知识画廊（SVG预览、类型筛选、lightbox放大、深度资料联动）；新增占位符 %GRAPH_DATA%/%METHOD_STEPS%；废弃 %METHOD_STEPS_HTML%；新增 plan_params.json method_texture_templates/drawing_type_taxonomy；6模板plan.css同步新增graph/method/gallery/lightbox样式；ECharts CDN(v5.5.0)引入主方案 |
| smart-learning-materials v3.8.1 | 2026-05-28 | 图表容器选择器精确化：修复 `.chart-wrap > div` 泛选择器导致 `.ch-cap` 标题 div 被强制 height:280px 产生大量留白；新增 `.chart-canvas` 专用 class 按语义精确选择图表容器；6 个模板 deep_dive.css 同步更新；图表容器 HTML 规范更新为 `<div id="chart-xxx" class="chart-canvas">` |
| smart-learning-materials v3.8.0 | 2026-05-27 | CSS 模板化注入完整落地：`%TEMPLATE_CSS%` 占位符机制，base_deep_dive.html 移除全部硬编码 CSS，deep_dive.css 作为 6 主题样式的单一权威源（含完整布局/组件/响应式规则，每主题 200+ 行）；project_rules.md 深度研读 HTML 生成强制规范；validate_templates.ps1 校验脚本加强（流体布局检测/响应断点检测/ECharts resize 检测）；文档管理 SSOT 规范建立（.trae/skills/ 单一真相源 + sync_skills.ps1 同步） |
| smart-learning-materials v3.7.0 | 2026-05-26 | 侧边栏目录导航+ECharts 5.x 动态图表+表格样式统一+流体铺满布局模板化 |
| smart-learning-materials .trae v1.1.0 / .claude v3.4.1 | 2026-05-25 | Web模板稳健性加固：CDN脚本异步(`defer`)、`body.loading`安全超时兜底、初始化双路径(`readyState`+`DOMContentLoaded`)、ECharts重试机制(10次×500ms)、全局初始化时序约束、主题闪烁消除；修复`applyTheme()` TypeError；两个环境模板与文档完全同步 |
| smart-learning-materials v3.4.1 | 2026-05-25 | 表格数据结构约束：table_schema定义 + Step 5.0表格校验 + SKILL.md规范章节 |
| smart-learning-materials v3.4.0 | 2026-05-25 | JS数据层防御性规则：引号冲突、`</script>`转义、外部JS禁止、语法自检 |
| learning-plan-generator v3.8.1 | 2026-05-25 | 批量生成sub-agent协调验证：文件结构一致性、JS语法逐文件验证、manifest链接完整性 |
| learning-plan-generator v3.8.0 | — | 视觉模板系统：6套可切换外观主题 + 自动匹配 |
| learning-plan-generator v3.5.0 | — | L2 运行时自动同步：syncKPsFromManifest() |
| learning-plan-generator v3.3.0 | — | 模板化 HTML 生成：base_plan.html 骨架 |
| learning-plan-generator v3.0.0 | — | 深度联动：KP→deep_dive触发 + manifest.json注册 |
| smart-learning-materials v3.3.0 | — | 视觉模板继承：从 context_plan 自动获取外观 |
| smart-learning-materials v3.2.0 | — | context_plan 标记优先解析 + 悬浮返回按钮 |
| smart-learning-materials v3.1.0 | — | hash锚点导航 + 命名窗口复用 |
| smart-learning-materials v3.0.0 | — | 深度联动：manifest.json + learning_journey模块 |
| smart-learning-materials v2.0.0 | — | 3×3 矩阵 + 60主题库 + G1-G8纹理 |
