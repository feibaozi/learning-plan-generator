# Deep Integration Linking Guide (v3.0)

快速参考：learning-plan-generator 与 smart-learning-materials 的联动开发指南。

## Architecture Overview

```
learning-plan-generator (LP)          smart-learning-materials (SLM)
         │                                        │
         │  生成方案 + KP.deep_dive                │  生成资料 + context_plan
         │          │                              │          │
         │          ▼                              │          ▼
         │   写入 manifest.json             读取 manifest.json
         │   (plans[])                             │   (materials[])
         │          │                              │          │
         ▼          ▼                              ▼          ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                     manifest.json                             │
  │  plans[]: [{id, phases[{kps[{topic_id, has_deep_dive}]}]}]  │
  │  materials[]: [{topic_id, belongs_to_plan/phase/kp}]         │
  └──────────────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
  HTML 中检测 has_deep_dive      HTML 中显示 journey bar
  渲染 📖 深度研读/✅ 已研读      渲染 📍 路线位置 + 🔗 返回链接
```

## Shared Files

| File | Path | Accessible By | Notes |
|------|------|---------------|-------|
| `topic_profiles.json` | `smart-learning-materials/resources/` | LP, SLM | LP uses for topic matching; SLM uses for domain/level calibration |
| `heuristic_rules.json` | `smart-learning-materials/resources/` | LP, SLM | Fallback rules R1-R6 when topic_profiles.json match fails |
| `texture_templates.json` | `smart-learning-materials/resources/` | LP (primary) | G1-G8 texture definitions; SLM does NOT currently use this file |
| `manifest_schema.json` | `_shared/` | LP, SLM | Schema + depth value domain mapping (see `_depth_mapping` in schema) |
| `manifest.json` | per-plan folder (e.g. `学习资料/[plan_name]/`) | LP (write plans), SLM (write materials, read plans) | Each plan has its own manifest.json in its own folder. Both skills must backup before write (`.manifest.json.bak`) |

## Folder Convention (v3.9)

All plans and their associated deep-dive materials live in a single self-contained folder per plan:

```
学习资料/
├── 计量经济学 系统学习方案/
│   ├── econ_learning.html
│   ├── 计量经济学学习方案.md
│   ├── manifest.json
│   ├── p1_1_econometrics-intro_intermediate.html
│   ├── p2_2_ols-estimator-derivation_intermediate.html
│   └── ...
├── 提示工程 系统学习方案/
│   ├── pe_learning.html
│   ├── 提示工程学习方案.md
│   ├── manifest.json
│   ├── p1_1_zero-shot-few-shot_intermediate.html
│   ├── p2_3_multi-step-reasoning_intermediate.html
│   └── ...
└── (NO standalone .html or .md plan files at this level)
```

**Key invariants**:
- Each plan folder is self-contained with its own `manifest.json`
- All files within a folder reference each other by **pure filenames** (no path prefix)
- Deep dive materials use `[kp_id]_[topic-slug]_[depth].html` naming convention
- The root-level `manifest.json` is **deprecated** — new plans write to their own folder only
- Existing root-level entries remain for backward compatibility but should not be extended

## Key Data Flow: KP → Deep Dive

1. LP generates plan with KPS[].deep_dive = {topic_id, prompt, status}
2. User clicks "📖 深度研读" → prompt copied to clipboard
3. User pastes prompt into chat → SLM invoked
4. SLM generates material with context_plan (if user pasted from option)
5. SLM writes material entry to manifest.json (materials[])
6. LP HTML re-reads manifest.json → updates has_deep_dive status

## Key Data Flow: Material → Plan

1. SLM generates material with context_plan
2. SLM HTML has journey bar showing plan→phase→KP position
3. Footer has "🔗 返回学习路线" link to plan file
4. Manifest updated with belongs_to_plan/phase/kp

## Implementation Checklist

### LP Side
- [x] C2 KP Object: deep_dive field (with `html_file` since v3.7)
- [x] C4 PHASES: deep_dive_batch field
- [x] IX6: 📖 深度研读 button + Toast + clipboard copy
- [x] IX7: 📦 批量深度研读 button
- [x] Phase 5.3: DV1-DV5 verification
- [x] 5.4: Manifest registration (write plans[])
- [x] Phase 4E: context_plan marker format documentation
- [x] `_ml_llm_nav` cross-window navigation listener (v3.7 — built into base_plan.html)
- [x] Phase 6: Updated delivery message
- [x] v3.7: Folder convention (constraint #18) + C10 body.loading charset docs

### SLM Side
- [x] Phase 1 Step 1.4: context_plan extraction
- [x] Phase 2 Step 2.2a: learning_journey conditional module
- [x] Phase 4C: goBack() with `_ml_llm_nav` localStorage + `_ml_llm_main` window.open
- [x] Phase 4D: Navigation listener injection for legacy plans
- [x] Phase 1.6 Step 5: Manifest registration with backup (.manifest.json.bak) + JSON validation
- [x] Phase 1.6 Step 5: materials[] writes belongs_to_plan/phase/kp fields
- [x] Phase 5A Step 5.2: Updated delivery message
- [x] v3.7: Shared resources dependency declaration (Phase 0 header)

### Shared
- [x] manifest_schema.json (with depth value domain mapping)
- [x] module_weights.json: learning_journey module + tag_affinity
- [x] This linking_guide.md

## Critical Constraints

1. **No backend**: Everything is static files. Each HTML is self-contained.
2. **LLM as executor**: All "logic" is implemented via LLM instruction, not code execution.
3. **Manifest writes are additive**: Never overwrite; always read→merge→write.
4. **Matching is best-effort**: topic_id matching uses Jaccard similarity. Unmatched stays null.
5. **User is the bridge**: LP → SLM flow is triggered by user copy-pasting a prompt.
