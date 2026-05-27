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
