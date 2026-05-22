# 深度研读资料 — file:// 兼容性规范

> 版本: 1.0.0 | 最后更新: 2026-05-19

## 1. 适用范围

本规范适用于所有深度研读 HTML 文件，包括：
- `*_intermediate.html` — 理解×标准 深度研读资料
- `*_deep.html` — 掌握×扩展 深度研读资料
- `ml_learning.html` — 主方案页面

## 2. file:// 协议下的已知限制

当 HTML 文件通过 `file://` 协议（即从本地磁盘直接打开）时，浏览器安全模型的 origin 为 `null`，以下行为受限：

### 2.1 被浏览器静默中止的请求

| 标签/行为 | 影响 | 替代方案 |
|-----------|------|----------|
| `<link rel="preconnect">` | `ERR_ABORTED`，无效 | **移除** |
| `<link rel="dns-prefetch">` | `ERR_ABORTED`，无效 | **移除** |
| `fetch()` 跨域请求 | 被 CORS 阻止 | 内联数据或 CDN script 标签 |
| `SharedArrayBuffer` | 需要 COOP/COEP header | **避免使用** |
| `Service Worker` | 不支持注册 | **避免使用** |

### 2.2 正常工作的外部资源

以下通过 `<script src="...">` 或 `<link href="...">` 加载的 CDN 资源在 `file://` 下**正常工作**：

- ✅ Google Fonts CSS（`fonts.googleapis.com/css2`）
- ✅ KaTeX JS/CSS（`cdn.jsdelivr.net/npm/katex@`）
- ✅ ECharts JS（`cdn.jsdelivr.net/npm/echarts@`）

## 3. 模板禁止清单

以下标签/属性 **不得** 出现在深度研读 HTML 模板中：

```html
<!-- ❌ 禁止：预连接 -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- ❌ 禁止：DNS 预取 -->
<link rel="dns-prefetch" href="//cdn.jsdelivr.net">

<!-- ❌ 禁止：预加载（file:// 下表现不一致） -->
<link rel="preload" href="..." as="script">

<!-- ❌ 禁止：fetch-based 跨域请求 -->
<script>
fetch('https://api.example.com/data')  // 在 file:// 下必然失败
</script>
```

## 4. 运行时 JS 模板规范

### 4.1 变量声明顺序（不可更改）

```javascript
// ✅ 正确顺序:
var activeCharts = {};                          // ① 最前
var sidebarLinks = [];                          // ②
var savedTheme = localStorage.getItem('slm-theme') || 'dark';  // ③
applyTheme(savedTheme);                         // ④ 最后

// ❌ 错误顺序（任何 activeCharts 在 applyTheme 调用之后）:
var savedTheme = ...;
applyTheme(savedTheme);       // TypeError: Object.values(undefined)
var activeCharts = {};        // ← 声明在调用之后
```

**原因**: `applyTheme()` 内部调用 `Object.values(activeCharts)`，如果 `activeCharts` 未初始化则为 `undefined`，导致 TypeError。

### 4.2 必需函数清单

每个深度研读 HTML 文件 **必须** 包含以下函数：

| 函数名 | 用途 |
|--------|------|
| `applyTheme(theme)` | 切换深色/浅色模式，更新 ECharts 图表 |
| `toggleTheme()` | 切换主题入口 |
| `updateThemeIcon()` | 更新主题切换按钮图标 |
| `buildSidebar()` | 构建侧边栏导航 |
| `buildMetaCard()` | 构建元数据卡片 |
| `buildModuleHTML(mod)` | 根据模块数据构建 HTML |
| `renderFormulas(container)` | 渲染 KaTeX 公式 |
| `renderChart(moduleId, config, index)` | 渲染 ECharts 图表 |
| `initPage()` | 页面初始化入口 |
| `exportNotes()` | 导出学习笔记 |

### 4.3 运行时代码完整性验证

生成后运行以下命令确保无遗留占位符：

```powershell
# 检查 RUNTIME 占位符
Select-String -Path "*_intermediate.html","*_deep.html" -Pattern '\{\{RUNTIME\}\}'

# 检查 PHASE_LABEL 占位符
Select-String -Path "*_intermediate.html","*_deep.html" -Pattern '\{\{PHASE_LABEL\}\}'
```

两者输出应为空。

## 5. 生成流程标准

### 5.1 推荐流程

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ PAGE_DATA   │───▶│ HTML 拼接器   │───▶│ 校验脚本      │───▶ 发布
│ (内容JSON)  │    │ (内容+模板)   │    │ validate.ps1 │
└─────────────┘    └──────────────┘    └──────────────┘
```

### 5.2 拼接器规范

1. 固定头部（`<!DOCTYPE html>` ... `<body>`）→ 从模板读取
2. 导航栏（含阶段信息）→ 参数化填充 `{{PHASE_LABEL}}`
3. 内容数据 `PAGE_DATA` → JSON 内联
4. 固定运行时 JS → 从 `runtime-template.js` 读取（不再使用 `{{RUNTIME}}` 占位符）
5. 固定尾部（`</body></html>`）

### 5.3 质量门禁

每次生成后 **必须** 执行：

```powershell
# 快速回归验证（检查致命问题）
powershell -File validate-deepdives.ps1

# 详细完整性检查（可选，生成后首次运行）
powershell -File check-deepdives.ps1
```

`validate-deepdives.ps1` 退出码为 0 方可视为生成成功。

## 6. 修订历史

| 日期 | 版本 | 变更说明 |
|------|------|----------|
| 2026-05-19 | 1.0.0 | 初始版本，归纳已知三类问题及预防方案 |
