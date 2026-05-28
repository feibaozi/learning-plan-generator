# Skill 文档管理规范

## 单一真相源

`学习资料\.trae\skills\` 是所有 skill 文档的**唯一权威副本**。

- 所有修改必须先在 `.trae\skills` 中完成
- 修改后运行 `sync_skills.ps1` 同步到 `.claude\skills` 和 `.trae-cn\skills`
- 禁止直接修改 `.claude\skills` 或 `.trae-cn\skills` 中的文件

## 目录职责

| 目录 | 职责 | 可修改 |
|------|------|--------|
| `.trae\skills\` | 开发维护（单一真相源） | ✅ |
| `.claude\skills\` | Claude IDE 运行时读取 | ❌ 仅通过 sync |
| `.trae-cn\skills\` | Trae IDE 运行时读取 | ❌ 仅通过 sync |

## 同步流程

1. 在 `.trae\skills` 中修改文件
2. 运行 `powershell -ExecutionPolicy Bypass -File sync_skills.ps1`
3. 检查验证输出，确认所有文件显示 OK

## 版本号规范

- 格式：`MAJOR.MINOR.PATCH`（如 3.5.0）
- 禁止出现 `v3.4.1.1.1` 这种重复版本号
- 每次修改 SKILL.md 必须更新版本号和更新日志

## 模板版本标记

每个模板 HTML 文件头部应包含版本注释：
```html
<!-- template-version: X.Y.Z -->
```
便于未来比对不同副本的一致性。

## 深度研读 HTML 生成规范（强制）

生成深度研读 HTML 文件时，**必须**严格遵循以下规范。违反任何一条都会导致页面缩放留白、图表不自适应、样式不一致等问题。

### 1. 必须使用 base_deep_dive.html 模板骨架

**禁止从零手写 HTML/CSS/JS。** 每次生成时：

1. 读取 `resources/templates/base_deep_dive.html` 获取完整骨架
2. 读取 `../_shared/templates/<template_id>/deep_dive.css` 获取完整 CSS（含 CSS 变量 + 全部布局/组件/响应式规则）
3. 将 `%TEMPLATE_CSS%` 占位符替换为 deep_dive.css 的**完整内容**（一字不改）
4. 填充其他 `%PLACEHOLDER%` 标记
5. 删除不需要的 `<!-- CONDITIONAL -->` 条件块

核心原则：**模板的 CSS 和 JS 骨架是经过验证的。唯一需要改变的是数据值和模块内容。不要重写 CSS 或 JS 逻辑。**

### 2. CSS 来源规范

```
✅ REQUIRED: <style>%TEMPLATE_CSS%</style> — 通过占位符注入 deep_dive.css 的完整内容
✅ REQUIRED: 生成时先 READ ../_shared/templates/<template_id>/deep_dive.css
✅ REQUIRED: deep_dive.css 包含 :root{}+[data-theme="light"]{}+全部布局/组件/响应式规则
❌ FORBIDDEN: 从零手写内联 <style> 块（除数据注入外不要自己写CSS）
❌ FORBIDDEN: 在模板的 <style> 块中硬编码布局CSS（布局CSS已在deep_dive.css中）
```

例外：生成时可在 `<style>` 的 `%TEMPLATE_CSS%` 之前追加少量临时覆盖规则（如模块特定的 `:root{}` 变量覆盖）。

### 3. 流体布局（禁止固定宽度）

```css
/* ✅ 正确：流体铺满 */
.content-area{margin-left:280px;width:calc(100% - 280px)}
.container{max-width:calc(100% - 48px);margin:0 auto;padding:calc(var(--nav-h) + 24px) 24px 80px}

/* ❌ 错误：固定宽度导致缩放留白 */
.main{max-width:860px;margin-left:280px;padding:40px 48px 80px}
```

### 4. 三断点响应式设计

```css
@media(max-width:1024px){.sidebar{display:none}.content-area{margin-left:0;width:100%}}
@media(max-width:768px){.hero h1{font-size:1.6rem}.module{padding:20px}...}
```

### 5. ECharts 图表必须监听 resize

```javascript
window.addEventListener('resize',function(){charts.forEach(function(c){c.resize()})});
```

### 6. 校验脚本

生成文件后，运行校验脚本确认合规：

```powershell
powershell -ExecutionPolicy Bypass -File "validate_templates.ps1" -PlanDir "<计划目录路径>"
```

所有检查项必须通过（OK），FAIL 项必须修复后才能交付。
