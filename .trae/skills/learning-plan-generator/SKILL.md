---
name: "learning-plan-generator"
description: "Generate adaptive, texture-aware learning plans (Markdown + interactive HTML) for ANY domain. Auto-classifies topics, dynamically determines phase count/week allocation, and selects optimal learning texture (G1-G8). Invoke when user asks for: learning plan, study roadmap, course outline, 学习方案, 学习计划, 学习路线."
version: "3.8.1"
changelog: |
  v3.8.1: 批量生成 sub-agent 协调验证 — 防止并行深度资料生成的结构不一致
  - 新增 Batch Deep-Dive Verification: 批量触发深度资料时的 sub-agent 一致性检查清单
  - Phase 6 交付确认新增 sub-agent 输出验证步骤：文件结构、JS 语法、manifest 一致性
  - 新增 Constraint #21: 批量生成后必须逐文件 node --check + 结构一致性对比
  - 新增 Common Pitfall: sub-agent 输出文件结构不一致导致某些资料无法通过链接访问
  v3.8.0: 视觉模板系统 — 6 套可切换的外观主题 + 自动匹配
  - 新增 Phase 0: 模板选择 — 根据用户描述/领域/标签自动匹配 6 套模板
  - base_plan.html 硬编码 CSS 变量替换为 %TEMPLATE_CSS% 占位符
  - 模板 CSS 从 _shared/templates/<id>/plan.css 读取后注入
  - buildKPDeepDivePrompt() 新增 template_id 字段，通过 context_plan 传递
  - manifest 注册新增 template_id 字段，确保主方案与深度资料外观一致
  - 用户可通过描述指定模板（如"深色专业风格"）或让系统自动匹配
  - 6 套模板: 靛蓝之夜/雪松晨曦/石墨工作室/深海碧波/琥珀日暮/极光冰霜
  v3.5.0: L2 运行时自动同步 — syncKPsFromManifest()
  - base_plan.html 新增 syncKPsFromManifest() 函数: 页面加载时从 manifest.json 读取已生成的深度资料
  - 自动更新 KPS 数组中 deep_dive.status/ html_file 字段
  - 自动更新 UI: 深度研读按钮文案(✅) + 动态注入 ↗ 按钮
  - 在 init() 末尾调用，作为 Step 5.1.4 (smart-learning-materials) 的运行时兜底
  - 新增验证项 #28: syncKPsFromManifest 存在于模板
  - 新增 Common Pitfalls 条目: manifest 同步失败兜底机制
  - 新增 Constraint #17: syncKPsFromManifest() 必须在 init() 结尾调用
  v3.4.0: 代码清理 + 知识图谱优化
  - 删除过时的 js_templates/*.js (已被 base_plan.html 模板完全替代)
  - 知识图谱节点位置改为确定性哈希 (替代 Math.random 随机抖动)
  - 知识图谱改为首次绘制 + resize 重绘 (替代 setInterval 持续空转)
  - clipboard fallback 提取为公共 fallbackCopy() 函数
  - 新增 localStorage 异常处理安全网
  v3.3.0: 模板化 HTML 生成 — 数据注入 + 验证骨架
  - 新增 resources/templates/base_plan.html: 完整验证的 CSS+JS 骨架模板
  - ALL HTML 输出基于模板生成: 只替换 %PLACEHOLDER% 数据标记
  - CSS 和 JS 交互逻辑永不修改 — 从根本上杜绝作用域/class缺失/渲染变异
  - Phase 4 重写: 模板占位符参考表 + 条件段移除规则 + 数据生成指南
  - 新增 Anti-Bug Pattern B0: 严禁 IIFE 包裹（inline onclick 需全局作用域）
  - kf() 使用 innerHTML 字符串拼接 + inline style 标签 ← 验证可靠模式
  - math-tag 由 kf() 自动生成 (PHASES[n].color) ← 不需要 MATH_TAGS_DATA
  - 保留已验证的完整 JS 骨架: 28+ 函数、init、hash路由、主题切换
  v3.2.0: prompt 嵌入 context_plan 标记 + 悬浮返回按钮
  - ddTrigger() 新增: 复制 prompt 时自动嵌入 [context_plan: ...] 标记
  - 新增 buildKPDeepDivePrompt(): 构建带完整上下文的 prompt
  - 新增 encodeForContext(): 处理特殊字符转义
  - 新增 PLAN 全局变量: 提供 plan.id/title/html_file 供 ddTrigger 使用
  - card_styles.css v2.3: 新增 deep-floating-back 悬浮按钮样式
  - 新增 showDDToast(): Toast 提示反馈
  - 新增 ddBatch(): 批量生成含 context_plan 的 prompt
  v3.1.0: 双向导航修复 — phase_kps精确映射、ddOpen直接打开、hash路由、窗口复用
  - PHASES 新增 phase_kps 字段: 与 skills 一一对应的 KP ID 数组
  - IX6 新增 ddOpen() 函数: 命名窗口直接打开已生成的深度资料
  - smart-learning-materials 返回链接: hash导航(#kc-kp_id) + 窗口复用(plan_main)
  - 主方案 init 新增 hash 路由: 检测 #kc- 锚点自动展开目标 KP
  - CSS 新增 expanded 卡片 grid-column:1/-1 规则 (替代全局 grid 列数变更)
  - render_utils.js 新增 AHDS(ph): 阶段详情渲染含 phase_kps 精确映射
  - 新增 Common Pitfalls: phase_kps缺失、grid布局、ddOpen缺失、返回链接无hash
  - Phase 5.3 新增 6 项验证 (check #18-#23)
  v3.0.0: 深度联动 — KP 可一键触发 deep_dive 生成；manifest.json 自动注册；方案与资料双向链接
  - KP Object 新增 deep_dive 字段: {query, topic_id, prompt, status, html_file}
  - KP 卡片渲染 "📖 深度研读" 按钮 — 点击复制提示词
  - PHASES 新增 deep_dive_batch 批量生成提示词
  - IX6: 深度研读触发交互模式 + IX7: 学习进度状态徽标
  - Phase 5.3 新增 5 项联动验证 (DV1-DV5)
  - Phase 6 新增 manifest.json 自动注册
  - 新增 _shared/manifest_schema.json 共享清单格式定义
  v2.1.0: 新增 Phase 4D UX交互规范、JS Component Anti-Bug Patterns、Phase 5.3 交互验证
  - AP1-AP5 反Bug规则: 禁用event全局变量、early return、scroll去重、KaTeX安全网、计数器全局化
  - IX1-IX5 交互规范: 卡片头点击、双向跳转、展开全部Toggle、计数器不受筛选影响、Diagram密度规则
  - 新增 resources/js_templates/ 目录: render_utils.js, interactions.js, exercises.js, diagram_guide.txt
  - 更新 Common Pitfalls → 新增 v2.1 Interaction Pitfalls 表
---

# Learning Plan Generator v3.0

Generate adaptive learning plans for any domain. v3.0 replaces the rigid 7-phase/15-week/21-exercise template with a **texture-aware dynamic system** that auto-classifies the topic, determines the optimal phase count and week allocation, and tailors the learning style to the domain's nature. **v3.0 adds deep integration with `smart-learning-materials` — each knowledge point can trigger one-click deep-dive generation, and generated materials are tracked in a shared manifest.**

This skill produces TWO deliverables:
1. **Markdown learning plan** — adaptive phases, formula tables, exercises, resources
2. **Interactive HTML page** — FLIP knowledge cards, knowledge graph, search, progress tracking, **SVG diagrams, deep-dive triggers**

---

## Shared Configuration Files

v3 shares its topic classification and texture system with `smart-learning-materials`. Load these before generation:

| File | Path | Role |
|------|------|------|
| topic_profiles.json | `../smart-learning-materials/resources/topic_profiles.json` | 60-topic 4D profile library |
| heuristic_rules.json | `../smart-learning-materials/resources/heuristic_rules.json` | R1-R8 fallback inference rules |
| texture_templates.json | `../smart-learning-materials/resources/texture_templates.json` | G1-G8 texture definitions |
| **plan_params.json** | `resources/plan_params.json` | LP-specific dynamic parameters |
| **manifest_schema.json** | `../_shared/manifest_schema.json` | Shared file manifest format (v3 deep integration) |
| **templates/manifest.json** | `../_shared/templates/manifest.json` | 6-template visual themes registry (v3.8) |

---

## v2 Core Improvements

| Dimension | v1.0 | v2.0 |
|---|---|---|
| Phase count | Fixed 7 | Dynamic 3-10 |
| Week allocation | Fixed 15 weeks | User constraint + domain-adaptive |
| KP count | Fixed ~25 | `PHASE_COUNT × 3.5 × depth × texture` |
| Exercises | Fixed 21 (5+7+6+3) | Dynamic count + adaptive difficulty ratio |
| Formula tables | Fixed 5×5 | math_density-driven: 0-5 tables |
| Topic matching | 4-class manual | Auto-match 60-topic library + R1-R8 inference |
| Learning texture | Uniform dark theme | G1-G8 adaptive (derivation/visual/narrative/hands-on...) |
| Phase ordering | Fixed P1→P7 | Texture-aware reordering (G8 starts with practice, G3 starts with dissection) |
| User flexibility | None | Time constraint, depth preference, learning style |

---

## Workflow Overview

```
Phase 1: Topic Auto-Classification + User Preference Extraction
  → Match topic_profiles.json or heuristic_rules.json → 4D profile → texture

Phase 2: Dynamic Parameter Calculation
  → PHASE_COUNT → TOTAL_WEEKS → KP_COUNT → EXERCISE_COUNT → FORMULA_TABLES → RESOURCE_COUNT

Phase 3: Generate Markdown Plan
  → Adaptive sections, dynamic counts, texture-aware ordering

Phase 4: Generate HTML Page
  → Condition-aware features, texture-driven theme, dynamic JS data

Phase 5: Quality Verification
  → JS syntax check, dynamic content completeness

Phase 6: Delivery Confirmation
  → Stats report with texture & depth labels
```

---
## Phase 0: Template Selection (NEW v3.8)

Before any content generation, determine the visual template for the learning plan. The selected template defines the entire CSS variable system (colors, shadows, borders, accents) for both dark and light modes, ensuring a cohesive visual identity.

### Step 0.1: Load Template Manifest

Read `../_shared/templates/manifest.json`. It registers 6 templates:

| Template ID | Name | Mood | Best For |
|-------------|------|------|----------|
| `indigo-night` | 靛蓝之夜 | professional, academic, deep | 数学, 物理, 计量经济学, 理论学科 |
| `cedar-dawn` | 雪松晨曦 | warm, natural, organic | 生物学, 生态学, 人文, 可持续 |
| `graphite-studio` | 石墨工作室 | minimal, clean, neutral | 编程, 架构设计, 工程, 系统设计 |
| `ocean-depth` | 深海碧波 | cool, tech, refreshing | AI, 数据科学, 机器学习, 海洋学 |
| `sunset-amber` | 琥珀日暮 | warm, rich, classic | 金融, 历史, 哲学, 人文社科 |
| `arctic-frost` | 极光冰霜 | crisp, nordic, creative | 设计, 前端开发, UX, 创意学科 |

### Step 0.2: Template Scoring Algorithm

Compute a score for each template based on the user's input, detected domain/tags, and explicit style requests:

```
score[tpl] = Σ( keyword_match × 2 + best_for_match × 3 + mood_match × 1 ) + random_jitter(0, 0.5)

Where:
  keyword_match: user_input contains any keyword from tpl.keywords[]
  best_for_match: detected domain or tags match any item in tpl.best_for[]
  mood_match: detected texture mood aligns with tpl.mood[]
```

**Mood-to-texture mapping**:
| Texture | Mood keywords |
|---------|--------------|
| G1 (公式推导) | academic, professional, deep |
| G2 (可视化) | creative, refreshing, crisp |
| G3 (模型拆解) | clean, neutral, professional |
| G4 (叙事驱动) | warm, rich, natural |
| G5 (平衡型) | neutral, clean |
| G6 (系统图解) | tech, creative |
| G7 (趋势案例) | warm, rich, classic |
| G8 (教程实操) | minimal, clean, tech |

### Step 0.3: Template Resolution Rules

1. **User explicitly specifies**: Use that template directly — skip scoring. Match user input against template `id` or `name`. Example: "用靛蓝之夜模板" → `indigo-night`.
2. **User describes a style**: Match the description against `keywords[]` + `description` + `mood[]` of each template → highest score wins. Example: "喜欢深色专业风格" → high score on `indigo-night` (keywords: 深色, 专业, 学术).
3. **No style input from user**: Compute scores from `domain` + `tags` + texture `mood` → highest score wins. Example: topic=计量经济学 → best_for hits 计量经济学 → `indigo-night`.
4. **Tie**: Random jitter breaks it. If still tied, fall back to `indigo-night` as the universal default.

**Edge cases**:
- Non-standard domain (e.g. "王者荣耀打野位"): Skip `best_for` scoring, rely on `mood` from texture + `keywords` from user input.
- User says "随机" or "随便": Randomly pick from all 6.

### Step 0.4: Read Template CSS

Once the template is selected (e.g. `indigo-night`), read the corresponding CSS file:

```
READ ../_shared/templates/<template_id>/plan.css
```

This file contains the complete `:root{...} body.light{...} body.light .knowledge-card.expanded{...} body.dark .knowledge-card.expanded{...}` CSS variable blocks. Store as `TEMPLATE_CSS` for injection into `base_plan.html` at the `%TEMPLATE_CSS%` placeholder.

### Step 0.5: Store Template ID

Store the selected `template_id` for:
- Injection into `base_plan.html` as part of `%PLAN_JSON%` (the PLAN object includes `template_id` field)
- Registration in `manifest.json` plans[].template_id
- Propagation to `smart-learning-materials` via `context_plan.template_id`

---

## Phase 1: Topic Auto-Classification + User Preference Extraction

### Step 1.1: Extract User Intent

Parse the user's message for:
- **Topic**: the domain they want to learn (e.g. "核物理", "SQL", "机器学习")
- **Time constraint**: "X周", "X个月", "快速", "详细" (optional)
- **Depth preference**: "快速概览" / "标准学习" / "深度掌握" (default: 标准学习)
- **Focus area**: "重点是XX方面", "偏实操" (optional)
- **Learning style preference**: "喜欢看图" / "喜欢推导" / "喜欢动手" (default: auto)

If the topic is ambiguous, ask for clarification.

### Step 1.2: Match Against topic_profiles.json

Load `../smart-learning-materials/resources/topic_profiles.json`. Match in priority order:
1. **Exact match**: topic name or alias
2. **Substring match**: user input contains topic name/alias
3. **Keyword hit**: user keywords hit `tag_index` → recommend closest topic
4. **Jaccard similarity** > 0.3 → highest score

On match → extract:
```json
{
  "topic_id": "deep-learning",
  "topic_name": "深度学习基础",
  "domain": "ai-tech",
  "tags": ["deep-learning", "foundation", "math-heavy", "classic"],
  "profile": {"abstract": 0.55, "systemic": 0.60, "math_density": 0.75, "temporal": 0.20},
  "suggested_texture": "G1",
  "texture_reason": "中高数学密度→公式推导驱动"
}
```

### Step 1.3: Fallback — Heuristic Inference

If no match, load `../smart-learning-materials/resources/heuristic_rules.json` and run R1→R6:
- **R1**: Domain detection (finance/ai-tech/unknown)
- **R2**: math_density estimation
- **R3**: abstract estimation
- **R4**: systemic estimation
- **R5**: temporal estimation
- **R6**: Texture selection (compute 8 texture_scores, pick highest)

For completely non-standard domains (e.g. "王者荣耀打野位"), accept the inferred values and set appropriate tags manually.

### Step 1.4: Extract User Preferences

| Preference | Detection Keywords | Default |
|---|---|---|
| Depth: 快速概览 | "快速" / "简单了解" / "概览" | 标准学习 |
| Depth: 深度掌握 | "深入" / "全面" / "精通" / "详细" | — |
| Time: explicit | "X周" / "X个月" / "X天" | 默认识别为 weeks |
| Focus | "重点是" / "偏XX" | — |
| Learning style | "看图"→G2 / "推导"→G1 / "动手"→G8 | auto(texture) |

User style preference overrides auto-detected texture if explicitly stated.

### Step 1.5: Confirm with User

```
已识别主题：【XXX】 → 领域:XXX | 标签:[tag1, tag2]
4D画像: 抽象度XX | 系统性XX | 数学密度XX | 演化速度XX
学习纹理: GX(XXX) | 深度:XXX | 时间:XX周
🎨 外观模板: [模板名称] — [模板描述]
开始生成...
```

---

## Phase 2: Dynamic Parameter Calculation

Load `resources/plan_params.json`. Compute all parameters before generating content.

### Step 2.1: PHASE_COUNT (Continuous Engine Preferred)

**Priority**: Use `continuous_engine` from `plan_params.json` when profile comes from `topic_profiles.json` (high confidence). Fall back to discrete `adders` only when profile is heuristic-inferred with confidence < 0.6.

**Continuous Engine** (primary):
```
PHASE_COUNT = round(clamp(
  4   // base_phases
  + 2.0 × (profile.math_density - 0.5)
  + 1.5 × (profile.systemic - 0.5)
  - 1.5 × (profile.abstract - 0.5)
  + 0.5 × (profile.temporal - 0.5)
  + user_depth_adjustment[深度偏好],
  3, 10
))
```
This ensures fine-grained differentiation — e.g. math_density=0.76 adds +0.52 while math_density=0.95 adds +0.90, instead of both getting the same +1.0 from the discrete adder.

**Discrete Adders** (fallback, when confidence < 0.6):
```
PHASE_COUNT = round(clamp(
  4   // base_phases
  + Σ(adder.add if adder.condition matches)   // from phase_count_engine.adders
  + user_depth_adjustment[深度偏好],
  3, 10
))
```

### Step 2.2: Phase Type Assignment

Look up `phase_type_classifier.phase_type_mapping[PHASE_COUNT + '_phases']` to get the ordered list of phase types. Apply texture reordering from `texture_phase_reordering` if the texture specifies a non-default order.

### Step 2.3: TOTAL_WEEKS

```
If user_explicit_weeks: TOTAL_WEEKS = user_value
Else: TOTAL_WEEKS = week_allocation_engine.user_time_defaults[深度偏好]
```

### Step 2.4: Weeks Per Phase (Largest Remainder Method)

Look up `week_allocation_engine.phase_weight_profiles[texture]`.
For each phase i with phase type t:
```
quotas[i] = TOTAL_WEEKS × phase_weight[t] / Σphase_weights
```

Then apply **Largest Remainder (Hare Quota)** to guarantee Σweeks = TOTAL_WEEKS:
```
1. weeks[i] = max(1, floor(quotas[i]))   // ensure >=1 week per phase
2. remainder = TOTAL_WEEKS - sum(weeks)
3. Sort phases by (quotas[i] - floor(quotas[i])) DESC
4. Add +1 to the top 'remainder' phases
```

### Step 2.5: KP_COUNT

```
KP_COUNT = round(
  PHASE_COUNT × kp_per_phase_base × depth_multiplier × texture_multiplier
)
clamp to [12, 50]
```

Distribute KPs across phases proportionally to weeks:
```
kp_per_phase[i] = round(KP_COUNT × weeks[i] / TOTAL_WEEKS)
```

### Step 2.6: EXERCISE_COUNT + Difficulty Distribution

```
EXERCISE_COUNT = round(PHASE_COUNT × exercises_per_phase_base × depth_multiplier)
clamp to [8, 35]
```

Auto-select difficulty distribution:
- `profile.math_density > 0.70` → `theory_heavy`
- `profile.abstract < 0.35` AND (`'practitioner'` or `'engineering'` in tags) → `hands_on`
- else → `balanced`

Apply percentages to EXERCISE_COUNT:
```
EASY = round(EXERCISE_COUNT × easy_pct / 100)
MEDIUM = round(EXERCISE_COUNT × medium_pct / 100)
HARD = round(EXERCISE_COUNT × hard_pct / 100)
PROJECT = EXERCISE_COUNT - EASY - MEDIUM - HARD
```

### Step 2.7: FORMULA_TABLES

Look up `formula_table_engine.thresholds` with `profile.math_density`:
- ≥ 0.70 → 5 tables × 5 concepts
- ≥ 0.40 → 3 tables × 5 concepts
- ≥ 0.15 → 1 table × 4 concepts
- < 0.15 → 0 tables (skip formula section)

### Step 2.8: RESOURCE_COUNT

```
RESOURCE_COUNT = round(
  10 + PHASE_COUNT × 1 × (1 - 0.3 × (profile.temporal > 0.70 ? 1 : 0))
)
clamp to [8, 22]
```

---

## Phase 3: Generate Markdown Plan

Write the complete `.md` file in a single Write call.

### 3.1 Required Sections (Adaptive)

| Section | Always? | Condition |
|---|---|---|
| Title + overview | ✅ | Includes texture & depth labels |
| Table of Contents | ✅ | |
| 总体学习路线图 | ✅ | Learning objectives, core philosophy (use `texture_learning_philosophies[texture]`), annotation table, ASCII timeline |
| 图解学习法 / 替代方法论 | ✅ | Based on `drawing_section_rule`: G2/G6→图解学习法; G1→推导方法论; G8→项目驱动学习法; G7→趋势追踪法 |
| Phase sections | ✅ | PHASE_COUNT sections (not fixed 7) |
| 学习资料清单 | ✅ | RESOURCE_COUNT resources |
| 核心公式与概念速查表 | ⚠️ | Only if FORMULA_TABLES > 0 |
| 实操练习题库 | ✅ | EXERCISE_COUNT exercises, adaptive difficulty ratio |
| 学习进度检查清单 | ✅ | PHASE_COUNT sections |

### 3.2 Scheme Overview Format

```markdown
# [领域名] 系统学习方案 — [深度标签] · [纹理标签]

> 本方案基于 **[纹理名]** 学习纹理生成，适合 **[深度描述]**。共 **[PHASE_COUNT] 阶段 [TOTAL_WEEKS] 周**，包含 [KP_COUNT] 个知识要点和 [EXERCISE_COUNT] 道练习。
```

### 3.3 Phase Section Format

Each phase gets:
```markdown
## 第X阶段：[阶段名称]（第Y-Z周，共W周）

📌 阶段目标：[目标]
🔑 核心知识点：
  - [标签1] 知识点1
  - [标签2] 知识点2

📊 关键图示：
[2-3 ASCII diagrams]

💻 代码示例：[仅在 abstract < 0.55 时出现]

📐 关键公式：[仅在 math_density ≥ 0.15 时出现]
```

### 3.4 Texture-Aware Content Emphasis

Per-phase content density follows the phase_weight_profile:
- G1: foundation phases have longest content, more derivation depth
- G8: foundation phases short, integration phases longest with project details
- G3: core_toolkit phases have most detail (component breakdowns)
- G7: advance_frontier phases have most detail (latest trends/cases)

---

## Phase 4: Generate HTML Page

### ⚠️ CRITICAL — TEMPLATE-BASED GENERATION (NEW v3.3)

**Use the verified skeleton template `resources/templates/base_plan.html` as the BASE for ALL HTML output.**

```
WORKFLOW:
1. READ  resources/templates/base_plan.html  →  get the full skeleton
2. READ  ../_shared/templates/<template_id>/plan.css  →  get TEMPLATE_CSS (v3.8)
3. COMPUTE all data (PHASES, KPS, EXERCISES, ...) as JSON
4. REPLACE %PLACEHOLDER% markers with computed data
5. REMOVE <!-- CONDITIONAL: ... --> blocks that don't apply
6. WRITE the final HTML file
```

**Core principle**: The template's CSS and JS skeleton are **proven working** across multiple plans (SQL, derivatives). The ONLY things that change between plans are the DATA values. Do NOT rewrite the CSS or JS logic — only inject data.

### 4A: Template Placeholder Reference

| Placeholder | Type | Description |
|---|---|---|
| `%PAGE_TITLE%` | string | `<title>` tag text, e.g. `"金融衍生品及其定价 系统学习方案"` |
| `%KAETX_CDN%` | string | KaTeX CDN link tag if `math_density > 0.30`, else empty string |
| `%TEMPLATE_CSS%` | CSS | **NEW v3.8** — Full `:root{...} body.light{...} expanded-card{...}` from `../_shared/templates/<id>/plan.css` |
| `%HERO_GRADIENT_COLOR1%` | color | First gradient color from `plan_params.gradient_defaults[texture][0]` |
| `%HERO_GRADIENT_COLOR2%` | color | Second gradient color from `plan_params.gradient_defaults[texture][1]` |
| `%THEME_DEFAULT%` | string | `"dark"` or `"light"` based on `plan_params.theme_defaults[texture]` |
| `%HERO_TITLE%` | string | Plan title for hero `<h1>` |
| `%HERO_SUBTITLE%` | string | Plan subtitle for hero `<p>` |
| `%HERO_STATS_HTML%` | HTML | Hero stat cards HTML (weeks, phases, exercises, kp counts) |
| `%PHASE_TAG_CSS%` | CSS | Phase tag classes (tag-p1...tag-pN) using `phase_colors` — or empty if using inline `style` in kf() |
| `%FOOTER_TEXT%` | string | Footer copyright text |
| `%METHOD_STEPS_HTML%` | HTML | Derivation methodology steps HTML (only used if HAS_METHOD) |
| `%STORAGE_KEY%` | string | localStorage key prefix, e.g. `"derivatives_pricing"` |
| `%PLAN_JSON%` | JSON literal | PLAN object: `{id:"...", title:"...", html_file:"...", template_id:"..."}` |
| `%PHASES_JSON%` | JSON literal | PHASES array (see C4 structure below) |
| `%KPS_JSON%` | JSON literal | KPS array (see C2 structure below) |
| `%FORMULA_TABS_JSON%` | JSON literal or `[]` | FORMULA_TABS array (see C5) |
| `%FORMULAS_JSON%` | JSON literal or `[]` | FORMULAS array (see C5) |
| `%EXERCISES_JSON%` | JSON literal or `[]` | EXERCISES array (see C6) |
| `%RESOURCES_JSON%` | JSON literal or `[]` | RESOURCES array (see C7) |
| `%TRACKER_ITEMS_JSON%` | JSON literal | TRACKER_ITEMS array (see C8) |

### 4B: Conditional Section Removal

After data replacement, remove `<!-- CONDITIONAL: ... -->` blocks that don't apply:

| Markers to remove | Remove condition |
|---|---|
| `<!-- CONDITIONAL: HAS_GRAPH -->` ... `<!-- /CONDITIONAL -->` | `profile.systemic <= 0.50` |
| `<!-- CONDITIONAL: HAS_METHOD -->` ... `<!-- /CONDITIONAL -->` | `profile.abstract >= 0.60` (not for G4/G8/texture-abstraction) |
| `<!-- CONDITIONAL: HAS_FORMULAS -->` ... `<!-- /CONDITIONAL -->` | `FORMULA_TABLES == 0` |
| `<!-- CONDITIONAL: HAS_DRAWING -->` ... `<!-- /CONDITIONAL -->` | `drawing_section_rule` doesn't match |

In the `init()` function, if a conditional section was removed, the corresponding render call (e.g. `hFs()`, `hDS()`) can remain — the helper checks for element existence. Similarly, `drawGraph()` checks `if(document.getElementById('graphCanvas'))` before running.

### 4C: Data Generation Guidelines (unchanged from v2)

#### C1: Phase Colors
Phase colors cycle through `plan_params.phase_colors`. If a `PHASES` entry includes its own `.color`, use that; otherwise assign from the palette.

#### C2: KP Object Structure
```javascript
{id:'p1_1', n:'知识点名称', p:'p1', tag:'tag-name',
 d:'详细描述（50-200字）',
 f:'数学公式（LaTeX）',           // optional: only if math_density >= 0.15
 s:'一句话总结（≤20字）',        // optional
 rel:['p1_2','p2_1'],            // optional: related KP IDs
 deep_dive:{                     // REQUIRED for every KP
   query:'搜索词',
   topic_id:'topic-id',          // null if no match; null does NOT prevent UI rendering
   prompt:'完整提示词',
   status:'none',                // 'none'|'generating'|'ready'
   html_file:''                  // '' initially; set to 'xxx.html' by SLM after deep-dive generation (Phase 5B)
 }}
```

#### C2a: LaTeX 公式编写规则（v3.6 new）

在填写 KP 的 `f:` 字段和 `FORMULAS` 数组时，必须遵守以下规则。违反将导致公式不可渲染或显示异常。

**规则 1：多字母运算符必须用 `\operatorname{}` 包裹**

KaTeX 将多字母名称解释为单字母乘积（如 `Var` → \(V \cdot a \cdot r\)）。必须包裹：

| 类别 | 需包裹的运算符 | 示例 |
|------|--------------|------|
| 统计 | Var, Cov, SD, SE, MSE, plim | `\operatorname{Var}(\hat{\beta})` |
| 回归 | SSR, SST, SSE, VIF, DW | `\operatorname{VIF}_j` |
| 计量 | WLS, GLS, IV, 2SLS, GMM, DID, HAC, FE, RE | `\hat{\beta}_{\operatorname{IV}}` |

- `\operatorname{}` 内的文本以正体（upright）渲染且自动获得运算符间距
- 单字母运算符（E, P）和标准 LaTeX 命令（`\sin`, `\log`, `\arg`）无需包裹

**规则 2：`<` 和 `>` 在数学模式内用 `\lt` 和 `\gt`**

**规则 3：JS 字符串中 `\` 须双写**

在 KPS 数组的 JS 字符串中，`\\` 表示一个字面反斜杠：
- 正确：`f:'\\hat{\\beta} = (X\\'X)^{-1}X\\'Y'`
- 错误：`f:'\hat{\beta} = (X'X)^{-1}X'Y'`（`\'` 被 JS 解析为转义单引号）

#### C3: Knowledge Tags (auto-generated by kf())
The template's `kf()` function auto-generates tag labels (`P1`, `P2`, ...) and colors using inline `style="background:PHASES[n].color"`. No separate MATH_TAGS_DATA array needed.

#### C4: PHASES Array Structure
```javascript
{id:'p1', week:'第1-4周', title:'阶段标题', sub:'副标题',
 color:'#4fc3f7', icon:'🏗️', cls:'c1',
 skills:['技能1','技能2',...],
 phase_kps:['p1_1','p1_2',...],   // MUST match skills.length
 codes:[...],                      // optional: code snippets
 drawings:[...],                   // optional: drawing names
 deep_dive_batch:'批量提示词'     // optional: batch prompt string
}
```

#### C5: FORMULA_TABS + FORMULAS
- FORMULA_TABS: `[{n:'Tab Name'},...]`
- FORMULAS: `[{r:[['名称','公式LaTeX'],...]},...]`
- If `FORMULA_TABLES == 0`: both as `[]`, and remove `HAS_FORMULAS` conditional block

#### C6: EXERCISES Array
```javascript
[{n:1, t:'题目名称', d:'easy'|'medium'|'hard'|'project'},...]
```

#### C7: RESOURCES Array
```javascript
[{t:'book'|'paper'|'site'|'tool', n:'名称', d:'描述'},...]
```

#### C8: TRACKER_ITEMS Array
```javascript
[{id:'phase1', n:'阶段1：...'},...]
```
Length = `PHASE_COUNT`, each matching one phase.

#### C9: KaTeX CDN 标签（v3.6 — 强制确切格式）

当 `profile.math_density > 0.30` 时，`%KAETX_CDN%` 占位符必须替换为以下**确切**内容（一字不差）：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
```

**强制约束**：
- **禁止** `defer` 属性 — 需在 `init()` 执行前加载完成
- **禁止** `integrity` 属性 — jsDelivr CDN 可能微调文件内容导致 SRI 哈希不匹配，浏览器将拒绝执行
- **禁止** `crossorigin` 属性 — jsDelivr CORS 头可能不一致
- **版本固定为 0.16.8** — 与 smart-learning-materials 保持一致
- **CSS 在前，JS 在后** — KaTeX 渲染依赖 CSS 变量先加载
- 不使用 `auto-render.min.js` — 主方案用 `katex.render()` 而非 `renderMathInElement()`
- 若 `profile.math_density <= 0.30`，`%KAETX_CDN%` = 空字符串

> ⚠️ **历史上的 C9 只说了"link tag"但未指定确切格式，导致生成时使用了带 `defer`/`integrity`/`crossorigin` 的标签，浏览器因 SRI 校验失败拒绝执行 → 全页公式无法渲染。** 此强制约束防止重现。

#### C10: Charset + Body Loading (MANDATORY)

The template already enforces these critical rules. Do NOT remove or alter them during generation.

**10a — `<meta charset="UTF-8">` 必须作为 `<head>` 的第一个子元素。** 遗漏将导致中文乱码。

**10b — `body.loading` 防闪烁机制**（模板已内建，三步协同）：
- **CSS**（第35行）: `body.loading{opacity:0}` / `body.loaded{opacity:1;transition:opacity 0.4s ease}` — body 初始不可见，防止未渲染内容闪烁
- **HTML**（第211行）: `<body class="loading %THEME_DEFAULT%">` — body 标签必须带有 `loading` class
- **JS**（init() 末尾）: `document.body.classList.remove('loading');document.body.classList.add('loaded');` — 在所有渲染完成后移除 loading class，触发 fade-in

> ⚠️ **关键约束**: `body.loading` 移除必须在 `init()` 的**末尾**执行（与深度资料模板不同，后者在 DOMContentLoaded 开头执行）。这是因为学习方案页面需要完成所有阶段卡片、知识点网格、图表等的渲染后才显示内容，防止大段 DOM 操作产生的闪烁。

### 4D: JS Skeleton (VERIFIED — DO NOT MODIFY)

The template's `<script>` section contains ALL core interactive functions pre-verified:
- `renderFormula`, `collapseCard`, `kf`, `kfP`, `AHDS` — rendering
- `tKCT`, `tKC_go`, `tKC_bk`, `eAK`, `gP`, `sFT` — interactions
- `ddOpen`, `ddTrigger`, `ddBatch`, `showDDToast`, `buildKPDeepDivePrompt` — deep dive
- `syncKPsFromManifest` — **L2 runtime manifest sync (v3.5)**: reads manifest.json, updates KPS states, injects ↗ buttons into already-rendered cards
- `hES`, `fE`, `tE`, `uEC` — exercises
- `drawGraph` — knowledge graph
- `hRS`, `hTR`, `tTR`, `uPB` — resources & tracker
- `hFs`, `hDS` — formula & drawing sections
- `searchOpen`, `searchClose`, `searchKPs` — search
- `loadTheme`, `toggleTheme` — theme
- `_ml_llm_nav` listener — **cross-window navigation (v3.7)**: receives `localStorage` signals from deep-dive materials, calls `kf('all')` + `tKC_go(kpId)` to locate and expand the target KP card
- `init()` — complete initialization flow (ends with `syncKPsFromManifest()` call)
- Keyboard + hash routing

**These functions are defined at GLOBAL scope** (no IIFE wrapping). This is critical — inline `onclick` handlers require global access. See Anti-Bug Pattern B0.

**The `_ml_llm_nav` listener** is an exception: it is wrapped in an IIFE to isolate its internal `CH_KEY` and `processNav` variables, preventing pollution of the global scope. This is safe because the listener communicates via `window.addEventListener('storage', ...)` and does not need to be called from inline `onclick` handlers.

### 4E: context_plan Marker Format (Cross-Skill Contract)

When the user clicks "📖 深度研读" on a KP card, `buildKPDeepDivePrompt()` generates a prompt with a `[context_plan: ...]` marker. **smart-learning-materials** parses this marker to establish bidirectional linkage.

```
[context_plan: plan_id="id"; plan_name="name"; plan_file="filename.html"; template_id="xxx"; phase_id="px"; phase_name="名称"; phase_position="X/N"; kp_id="px_y"; kp_name="知识点"; prerequisites="..."; next_kps="..."]
```

| Field | Source | Required |
|-------|--------|----------|
| `plan_id` | `PLAN.id` | ✅ |
| `plan_name` | `PLAN.title` | ✅ |
| `plan_file` | `PLAN.html_file` (文件名，不含路径) | ✅ |
| `template_id` | `PLAN.template_id` (v3.8) — template identifier from `../_shared/templates/manifest.json` | ✅ |
| `phase_id` | `PHASES[n].id` | ✅ |
| `phase_name` | `PHASES[n].title` | ✅ |
| `phase_position` | `(phaseIndex+1)/PHASES.length` | ✅ |
| `kp_id` | `KP.id` | ✅ |
| `kp_name` | `KP.n` | ✅ |
| `prerequisites` | `KP.prerequisites` (逗号分隔) | ⚠️ |
| `next_kps` | `KP.next_kps` (逗号分隔) | ⚠️ |

> ⚠️ **跨 skill 一致性**: `plan_file` 只写**文件名**（不含文件夹路径），因为深度资料与主方案在同一文件夹内。这与 smart-learning-materials SKILL.md Phase 1.6 的 `html_file` 规则一致。

**Dual-class expansion mechanism** (verified in template): `tKCT()` and `tKC_go()` add BOTH `expanded` AND `open` classes to `.knowledge-card`. The CSS uses `.knowledge-card.open .card-detail, .knowledge-card.expanded .card-detail{display:block}`. `collapseCard()` removes both classes via two separate `classList.remove()` calls (not the comma-separated form). This ensures reliable expand/collapse across all browsers.

#### HARD CONSTRAINT: Anti-Bug Pattern B0 — NO IIFE WRAPPING

```
❌ FORBIDDEN: (function(){ ... all functions ... })();
✅ REQUIRED:   <script> ... all functions at top level ... </script>
```

**Why**: Inline `onclick="tKCT('p1_1')"` handlers execute in the global scope. If functions are wrapped in an IIFE, they are scope-private and the browser throws `ReferenceError: tKCT is not defined`.

The template already complies with this constraint. When generating the output HTML, do NOT wrap the script content in an IIFE.

---

## Phase 5: Quality Verification

### 5.1 JS Syntax Check

Same as v1: extract JS, run `node --check`.

### 5.2 Dynamic Content Completeness

| Check | v1 Fixed | v2 Dynamic |
|---|---|---|
| Phase sections | 7 | = PHASE_COUNT |
| ASCII diagrams per phase | 2-3 | = 2-3 (constant) |
| Formula tables | 5 | = FORMULA_TABLES.table_count |
| Exercises | 21 (5+7+6+3) | = EXERCISE_COUNT (adaptive ratio) |
| Resources | 12-15 | = RESOURCE_COUNT |
| Tracker items | 7 | = PHASE_COUNT |
| KP count | ~25 | = KP_COUNT |
| Knowledge graph columns | 7 | = PHASE_COUNT (if enabled) |
| Drawing section | always | conditional |
| Drawing level items per phase | as per PHASES | texture-dependent |
| **KP with diagram** (NEW) | 0 | ≥ target_diagram_count |

### 5.3 UX Interaction Verification

**These checks MUST pass before delivery. The v3.7 code templates are designed to pass them by default.**

Checklist items are grouped by severity. Check in order: 🔴 first, then 🟠, finally 🟡.

**🔴 致命级（遗漏将导致白屏/JS报错/功能完全失效）：**

| # | Check | How to Verify | Expected | Ref |
|---|-------|---------------|----------|-----|
| 24 | 🔴 无 IIFE 包裹 | grep `(function()\s*\{` 在 `<script>` 标签内 | **不存在**包裹全部函数的 IIFE | B0 |
| 25 | 🔴 所有 %PLACEHOLDER% 已替换 | grep `%[A-Z]` 在输出 HTML 中 | **0 匹配** | template |
| 26 | 🔴 双 class 展开机制 | 检查 `tKCT` 和 `tKC_go` 函数体 | 同时包含 `.add('expanded')` 和 `.add('open')` | B0b |
| 27 | 🔴 collapseCard 分两次移除 | 检查 `collapseCard` 函数体 | 两条 `.remove()`，不是 `remove('expanded','open')` | B0c |
| 28 | 🔴 syncKPsFromManifest 存在 | grep `syncKPsFromManifest` | 函数定义存在，`init()` 结尾调用 | L2 |
| 29 | 🔴 `_ml_llm_nav` 监听器存在 | grep `_ml_llm_nav` | IIFE 定义存在，含 `storage` 事件 + DOMContentLoaded 双重路径 | v3.7 |
| 30 | 🔴 `<meta charset>` 第一子元素 | 检查 `<head>` 第一个子元素 | `<meta charset="UTF-8">` | C10 |
| 12 | 🔴 `event` 全局变量检查 | grep `[^.]event[^.]` JS 代码 | 无裸用 event（strict mode 报错） | AP1 |
| 9 | 🔴 sFT 不报错 | 点击公式 Tab 切换 | 控制台无 event 错误 | AP1 |
| 8 | 🔴 KaTeX 不重复渲染 | 重复展开同一 KP 卡片 | 公式不重叠/不错位 | AP4 |
| 33 | 🟠 公式速查表可渲染 | 切换到每个 Formula Tab | 所有公式显示为数学符号，**非** LaTeX 源码 | hFs |
| 34 | 🟠 renderAllFormulas 存在 | grep `renderAllFormulas` | 函数定义存在，`init()` 末尾调用 | — |
| 35 | 🟠 公式表单元格带 ft-formula class | grep `ft-formula` | hFs() 在公式 `<td>` 上设置 class | — |
| 11 | 🔴 Diagram 无 XML 注入 | 检查所有 diagram SVG | 无破损标签 | IX5 |

**🟠 重要级（遗漏将导致功能异常但不致白屏/崩溃）：**

| # | Check | How to Verify | Expected | Ref |
|---|-------|---------------|----------|-----|
| 1 | 卡片头可点击收缩 | 展开一个 KP→点击标题头 | 卡片收缩 | AP2+IX1 |
| 2 | 卡片头无重复闪烁 | 连续点击同一个未展开的卡片 | 无闪烁/无重复渲染 | AP2 |
| 3 | math-tag 可点击跳转 | 点击 P1 标签 | 跳转到 #phase-p1 并自动展开 | IX2 |
| 4 | rel 关联可点击 | 点击卡片内 .cr-link | 展开对应关联 KP 卡片 | IX2 |
| 5 | skill-link 可点击 | 阶段卡片中点击 skill-link | 跳转到对应 KP 并展开 | IX2 |
| 6 | 展开全部 Toggle | 点击展开全部→再点一次 | 先全展开→再全收缩 | IX3 |
| 7 | 练习计数器不受筛选影响 | 切换筛选→看计数器分母 | 始终为 EXERCISE_COUNT | AP5 |
| 10 | Scroll 不注册多次 | 控制台检查 | 全局仅一处 addEventListener | AP3 |
| 13 | deep_dive 字段完整 | 检查所有 KPS 条目 | 每个 KP 都有 deep_dive 字段 | DV1 |
| 14 | topic_id 匹配 | 检查 deep_dive.topic_id | topic_id 为 null 时不影响深度研读功能，仅影响 L2 manifest 自动主题匹配（可选） | DV2 |
| 15 | 深度研读按钮可点击 | 点击 📖 按钮 | 提示词复制到剪贴板+Toast | DV3 |
| 16 | 批量按钮存在 | 所有阶段（只要有 PHASES.deep_dive_batch） | 阶段底部有 📦 批量按钮 | DV4 |
| 17 | ddTrigger/ddBatch 无全局 event | grep ddTrigger\|ddBatch | 显式传参，无裸用 event | DV5 |
| 18 | phase_kps 与 skills 长度一致 | 每个阶段检查 | phase_kps.length === skills.length | IX2 |
| 19 | skill-link 使用 phase_kps[idx] | grep skill-link onclick | 含 `kfP(phase_kps[idx])` | IX2 |
| 21 | ddOpen 按钮存在(ready 状态) | 检查 ready 的 KP 卡片 | 有 ↗ 按钮，点击打开深度资料 | IX6 |
| 22 | hash 路由正常工作 | 访问 `...html#kc-p1_1` | 展开对应 KP，滚动到视野 | C13 |
| 23 | AHDS 函数被调用 | 搜索 `AHDS(` | init 中 PHASES.forEach(AHDS) | C9 |
| 31 | 🔴 `body.loading` 三步机制 | 检查 CSS/HTML/JS | loading class → CSS opacity:0 → init() 末尾移除 | C10 |

**🟡 确认级（建议检查，遗漏影响较小）：**

| # | Check | How to Verify | Expected | Ref |
|---|-------|---------------|----------|-----|
| 20 | 展开卡片不破坏 grid 布局 | 展开 KP→检查 grid | `.expanded` 卡片 grid-column:1/-1 | CSS |
| 32 | `syncKPsFromManifest()` 仅 HTTP 下生效 | 了解机制 | 通过 `fetch('manifest.json')` 实现，`file://` 协议下因 CORS 静默失败 | L2 |

> ⚠️ **检查优先级**: 先清 🔴 致命级（必须 0 错误），再清 🟠 重要级，最后确认 🟡 级。

---

### 5.4 Manifest Registration (NEW in v3.0)

After successful delivery, register the plan in `manifest.json` at the output directory root:

1. Read existing `manifest.json` (if exists). If not, create from `../_shared/manifest_schema.json` template.
2. Append a new entry to `plans[]`:
```json
{
  "id": "<domain>-learning",
  "title": "<领域名> 系统学习方案",
  "domain": "<finance|ai-tech|cross-domain>",
  "texture": "G1-G8",
  "depth": "<快速概览|标准学习|深度掌握>",
  "template_id": "<indigo-night|cedar-dawn|graphite-studio|ocean-depth|sunset-amber|arctic-frost>",
  "markdown_file": "<Topic>学习方案.md",
  "html_file": "<abbr>_learning.html",
  "generated_at": "<ISO date>",
  "topic_profile": {"abstract": 0.xx, "systemic": 0.xx, "math_density": 0.xx, "temporal": 0.xx},
  "phases": [
    {
      "id": "p1",
      "title": "阶段标题",
      "weeks": "第X-Y周",
      "kps": [
        {"id": "p1_1", "name": "KP名称", "topic_id": "option-pricing", "has_deep_dive": false}
      ]
    }
  ]
}
```
3. Validate JSON before writing. Keep `.manifest.json.bak` backup.
4. If any existing `materials[]` entries match this plan's KP topic_ids, set `has_deep_dive: true`.
5. Write the merged manifest with 2-space indentation.

---
## Phase 6: Delivery Confirmation (v3.0)

```
✅ 学习方案生成完成！

📖 主题: [名称]
🏷️ 领域: [domain]  |  标签: [tags]
🎯 学习深度: [快速概览/标准学习/深度掌握]
🎨 学习纹理: [G1-G8] — [纹理描述]
🖌️ 外观模板: [模板名称] — [模板描述]
⏱️ 时间规划: [TOTAL_WEEKS] 周 / [PHASE_COUNT] 阶段

📊 方案统计:
   · [KP_COUNT] 个知识要点 ([N] 个可触发深度研读)
   · [EXERCISE_COUNT] 道练习 (易:中:难:项目 = [E]:[M]:[H]:[P])
   · [FORMULA_TABLES] 张公式表 ([math_density >= 0.15时])
   · [RESOURCE_COUNT] 个推荐资源

📄 产出文件:
   · Markdown: [Topic]学习方案.md
   · HTML: [abbr]_learning.html
   · Manifest: manifest.json (已注册)

🔗 深度研读:
   · [N] 个知识点可触发深度资料生成 — 点击卡片上的 "📖 深度研读" 按钮
   · 阶段详情中有 "📦 批量深度研读" 一键复制
   · 已注册到 manifest.json，下次生成资料时会自动关联
```

### 6.1 Batch Deep-Dive Sub-Agent Verification (NEW v3.8.1)

当用户通过 `ddBatch()` 批量触发多个知识点的深度资料生成时，多个 sub-agent 会**并行**工作。由于 sub-agent 之间彼此独立，可能产出不一致的文件结构、模板选择、或 JS 模式。以下验证步骤必须在所有 sub-agent 完成后执行。

**Step 6.1.1: 文件存在性检查**

```
FOR EACH deep_dive KP in manifest.json:
  VERIFY html_file exists on disk
  IF NOT FOUND → 标记为缺失，提示用户重新生成
```

**Step 6.1.2: JS 语法逐文件验证**

```
FOR EACH generated deep-dive HTML file:
  1. EXTRACT all inline <script> blocks
  2. RUN node --check on extracted JS
  3. IF SYNTAX ERROR → 报告文件路径 + 错误行号 → 标记需要修复
  4. VERIFY init() function exists and calls body.classList.remove('loading')
```

**Step 6.1.3: 结构一致性对比**

并行生成的深度资料必须使用相同的模板和文件结构。对比所有产出文件：

| 检查项 | 方法 | 通过标准 |
|--------|------|----------|
| 模板 CSS 相同 | grep `--bg-primary` 在所有文件中的值 | 所有文件的 `:root{}` 块一致 |
| JS 内联 vs 外部一致 | 检查是否使用 `<script src="...">` | **全部内联**（无外部 JS 引用） |
| body.loading 机制一致 | grep `body.loading` | 所有文件均存在三步机制 |
| journey-bar 存在性 | grep `journey-bar` | 所有文件一致（要么全有，要么全无） |
| manifest.json 注册完整 | 逐条比对 `materials[]` | 每个产出文件对应一条 manifest 记录 |

**Step 6.1.4: Manifest 双向链接验证**

```
1. READ manifest.json
2. FOR EACH materials[] entry:
     VERIFY belongs_to_plan matches plan_id
     VERIFY belongs_to_kp matches the KP ID in plans[].phases[].kps[]
     SET plans[].phases[].kps[].has_deep_dive = true
3. WRITE manifest.json (backup to .manifest.json.bak first)
```

**Step 6.1.5: 主方案 HTML 中的 KP 链接更新**

并行 sub-agent 各自写入主方案 HTML 时可能产生冲突。需做最终一致性检查：

```
1. READ plan HTML file
2. FOR EACH KP that should have deep_dive ready:
     VERIFY deep_dive.status === 'ready'
     VERIFY deep_dive.html_file is set and non-empty
3. IF ANY KP MISSING → 手动更新 KPS 数组中的对应条目
```

**为什么需要此步骤**: 在实测中，4 个并行 sub-agent 产出了 3 种不同的文件结构（内联脚本、外部 JS、混合），其中外部 JS 文件在 `file://` 协议下因 CORS 无法加载，直接导致白屏。通过这 5 步验证可确保并行生成的资料质量和一致性。

---

## Important Constraints

1. All fixed numbers (7/15/21/25) replaced with dynamic variables from Phase 2
2. Phase count, KP count, exercise count MUST match computed values exactly
3. Texture affects: phase ordering, content emphasis, theme, hero gradient
4. Drawing section conditional on `drawing_section_rule`
5. Formula section conditional on `math_density >= 0.15`
6. Knowledge graph canvas conditional on `systemic > 0.50`
7. KaTeX CDN conditional on `math_density > 0.30`
8. User time constraint always overrides default TOTAL_WEEKS
9. User style preference always overrides auto-detected texture
10. JS syntax MUST pass `node --check` before delivery
11. **v3.0**: Every KP MUST have a `deep_dive` field
12. **v3.0**: manifest.json MUST be written or updated after generation
13. **v3.0**: `ddTrigger()` and `ddBatch()` MUST use `navigator.clipboard.writeText()` for copy
14. **🔴 v3.3**: ALWAYS start HTML generation by reading `resources/templates/base_plan.html` — never write CSS or JS from scratch
15. **🔴 v3.3**: After replacing placeholders, grep the output for `%[A-Z]` to confirm ALL markers were replaced
16. **🔴 v3.3**: Grep the output for `(function()\s*\{` inside `<script>` — must NOT find a wrapper IIFE
17. **🔴 v3.5**: `syncKPsFromManifest()` function must exist in output and be called at the end of `init()` — this is the L2 runtime fallback for deep dive linkage
18. **🟠 v3.7 文件夹约定**: 主方案 HTML 应生成在以 `plan_name`（或 `plan_id`）命名的子文件夹中，与 manifest.json 同目录。smart-learning-materials 生成深度资料时，会按 `context_plan` 中的 `plan_file`（纯文件名）在同一文件夹中查找主方案。若主方案在根目录而深度资料在子文件夹，`goBack()` 的相对路径将 404。**推荐结构**：`学习资料/[plan_name]/[abbr]_learning.html` + `学习资料/[plan_name]/manifest.json`。
19. **🔴 v3.8 模板 CSS 注入**: `%TEMPLATE_CSS%` 必须替换为 `../_shared/templates/<template_id>/plan.css` 的完整内容（一字不改）。模板 CSS 包含 `:root{}`、`body.light{}`、和 expanded card 规则。读取后直接注入，不修改任何变量名或值。
20. **🔴 v3.8 模板 ID 传播**: PLAN JSON 必须包含 `template_id` 字段，通过 context_plan 传递给 smart-learning-materials，确保深度资料与主方案外观一致。

21. **🔴 v3.8.1 批量深度研读后验证**: 当用户通过 `ddBatch()` 批量触发多个深度资料生成时，必须在所有 sub-agent 完成后执行 Step 6.1.1-6.1.5 的验证流程。逐文件 `node --check`、结构一致性对比、manifest 双向链接验证缺一不可。

---

## Common Pitfalls & Solutions

### 🔴 CRITICAL (v3.3 B0 — MUST NOT HAPPEN AGAIN)

| Pitfall | Symptom | Root Cause | Solution |
|---------|---------|------------|----------|
| **B0: JS functions wrapped in IIFE** | Clicking any card → `ReferenceError: tKCT is not defined` in console. **ALL interactive features dead.** | `<script>(function(){...all code...})();</script>` makes functions scope-private. Inline `onclick="tKCT(...)"` looks in global scope, finds nothing. | **Use the template.** The template's `<script>` has no IIFE. When replacing placeholders, do NOT add `(function(){` or `})()` around the JS. Every function must be at top-level `<script>` scope. |
| **B0b: tKCT missing `open` class** | Card gets green `.expanded` border but `.card-detail` stays `display:none`. Card appears to "expand" but content invisible. | `el.classList.add('expanded')` without `el.classList.add('open')`. CSS only checks `.knowledge-card.open .card-detail` or `.knowledge-card.expanded .card-detail` — both must be set for maximum compatibility. | **Use the template.** The template's `tKCT()` already does `el.classList.add('expanded'); el.classList.add('open')` and `collapseCard()` does `el.classList.remove('expanded'); el.classList.remove('open')` separately (not comma-separated). |
| **B0c: collapseCard removes with comma** | Card sometimes fails to collapse, stays in half-open state. | `el.classList.remove('expanded','open')` — some browsers don't reliably remove multiple classes in one call. | **Use the template.** Template does two separate `classList.remove()` calls. |
| **L2: Deep dive button doesn't appear** | After generating deep-dive material via smart-learning-materials, the main plan HTML doesn't show the ↗ button — only the 📖 copy-prompt button. | Two-layer design: (1) smart-learning-materials Step 5.1.4 updates the plan HTML's KPS data on disk (L1 — primary/治本); (2) `syncKPsFromManifest()` in the plan HTML read manifest.json at runtime to update KP states and inject ↗ buttons (L2 — fallback/兜底). If L1 fails (plan file not found, parse error), L2 catches it on next page load. | **Ensure both layers exist**: (1) Step 5.1.4 in smart-learning-materials SKILL.md; (2) `syncKPsFromManifest()` in base_plan.html template, called in `init()`. |

### Other Pitfalls

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| PHASE_COUNT ≠ PHASES.length | Rendering errors | Verify PHASES array has exactly PHASE_COUNT entries |
| Knowledge graph columns mismatch | Graph nodes misaligned | drawGraph must use PHASE_COUNT columns |
| Formula tabs count = 0 but section rendered | Empty formula section | Omit `#formulas` entirely when 0 |
| drawing_section_rule mismatch | Missing/extra section | Check profile.systemic and texture before rendering `#drawing` |
| Phase reordering not applied | Wrong phase order | For G3/G7/G8: apply texture_phase_reordering before generating content |
| Week allocation doesn't sum to TOTAL_WEEKS | Inconsistent timeline | Use Largest Remainder method: floor first, then distribute remainder to phases with largest fractional parts |
| User time constraint ignored | Wrong week count | Check user_preference extraction in Phase 1 before defaulting |
| **Sub-agent 输出结构不一致** (v3.8.1 new) | 批量深度研读后，部分 HTML 白屏/无法打开/链接 404 | 并行 sub-agent 各自决策导致：有的使用外部 JS（`<script src="data.js">`）有的内联；有的使用不同模板；有的缺失 `body.loading` 机制。外部 JS 在 `file://` 下 CORS 失败。 | 在所有 sub-agent 完成后执行 Step 6.1.1-6.1.5：文件存在性 → `node --check` 逐文件语法验证 → 结构一致性对比（模板/JSmode/loading） → manifest 双向链接 → 主方案 KP 状态更新 |

### v2.1 Interaction Pitfalls (NEW)

| Pitfall | Symptom | Solution |
|---------|---------|----------|
| `event` global variable used | `sFT` TypeError on tab click | AP1: always use `sFT(id, this)` pattern |
| No early return in toggle | Card flickers on repeated click | AP2: check `.expanded` state first, return immediately |
| Multiple scroll listeners | Laggy scrolling, duplicate logs | AP3: merge all scroll logic into one handler |
| KaTeX renders twice on reopen | Overlapping/misaligned formulas | AP4: check `fk.querySelector('.katex')` before render |
| Counter uses filtered.length | "已打卡 3/5" after filter (should be /18) | AP5: always use `EXERCISES.length` as denominator |
| Card header not clickable | User can only use "收起" button | IX1: card-header `onclick` must call `tKCT(id)` |
| Phase tags not clickable | No navigation from KP to phase | IX2: math-tag must have `onclick="gP('{id}')"` with `stopPropagation` |
| Expand-all doesn't toggle | Button only expands, never collapses | IX3: check button text for "收起" to detect current state |
| Diagram missing on key KPs | Text-heavy cards hard for beginners | IX5: check `diagram_density_rules` → ≥ 50% KPs for math_density > 0.40 |
| Phase→KP skill-link broken | Click skill-chip in phase detail → nothing happens | IX2 v3.1: each PHASE must have `phase_kps:['p1_1','p1_2',...]` matching `skills` length; render with `kfP(phase_kps[idx])`, **never use fuzzy string matching** |
| Grid collapses when card expands | Expanding one card makes all cards full-width | CSS: use `.knowledge-card.expanded{grid-column:1/-1}` on individual card, **do not** change `.knowledge-grid` column count |
| No direct open for deep dive | "已研读" but no button to open HTML | IX6 v3.1: add `ddOpen()` function with named window reuse; KP needs `deep_dive.html_file` field |
| Return link doesn't navigate to KP | Back from deep dive → lands at top of plan page | Return link must use `window.open('plan.html#kc-kp_id','plan_main')`; plan init must detect `location.hash` |

---

## Reference Implementations

**🔴 PRIMARY REFERENCE (v3.3):** Use `resources/templates/base_plan.html` as the **single source of truth** for all HTML output. Its CSS and JS skeleton are proven working across multiple plans and contain all B0 fixes.

**Working output examples** (for structural reference only — do NOT copy their JS/CSS, the template supersedes them):

| Plan | Markdown | HTML | KP Count | Notes |
|------|----------|------|----------|-------|
| AI/大模型 金融方向 | `AI与大模型金融方向学习方案.md` | `ai_learning.html` | 47 | Most complete KP system |
| 核物理 | `核物理学习方案.md` | `nuclear_learning.html` | 30 | Theoretical sciences reference |
| 基因工程 | `基因工程学习方案.md` | `gene_learning.html` | 25 | Applied sciences reference |
| 王者荣耀打野位 | `王者荣耀打野位学习方案.md` | `hok_learning.html` | 28 | FLIP animation + knowledge graph |

Use `base_plan.html` template for all layout, interaction, and rendering patterns. Examples above are for data structure reference only.

---

## Output File Naming Convention

- Markdown: `<Topic>学习方案.md` (e.g., `机器学习学习方案.md`)
- HTML: `<abbreviation>_learning.html` (e.g., `ml_learning.html`)