# SQL及其在工作中应用 系统学习方案 — 标准学习 · 教程实操型

> 本方案基于 **教程实操型** 学习纹理生成，适合 **希望在14周内系统掌握SQL并将其应用于实际工作场景** 的学习者。共 **4 阶段 14 周**，包含 12 个知识要点和 10 道练习。

---

## 目录

1. [总体学习路线图](#总体学习路线图)
2. [项目驱动学习法](#项目驱动学习法)
3. [第1阶段：SQL查询实战入门（第1-4周）](#第1阶段sql查询实战入门第1-4周)
4. [第2阶段：工作中综合应用（第5-9周）](#第2阶段工作中综合应用第5-9周)
5. [第3阶段：数据库理论基础（第10-12周）](#第3阶段数据库理论基础第10-12周)
6. [第4阶段：进阶优化与新特性（第13-14周）](#第4阶段进阶优化与新特性第13-14周)
7. [学习资料清单](#学习资料清单)
8. [核心语法速查表](#核心语法速查表)
9. [实操练习题库](#实操练习题库)
10. [学习进度检查清单](#学习进度检查清单)

---

## 总体学习路线图

### 学习目标

- 能独立编写工作中常见的SQL查询语句（SELECT/JOIN/子查询/窗口函数）
- 理解关系数据库的设计原理，能设计合理的表结构
- 能分析SQL执行计划并优化慢查询
- 掌握数据增删改操作和事务控制
- 了解各主流数据库的差异和新特性

### 核心学习理念

> 不要等到"准备好"才开始——最好的学习方式是立即动手做项目

SQL是一门"做中学"的技能。本方案采用**教程实操型**学习策略：跳过冗长理论先动手 → 项目实践 → 按需回补基础 → 前沿选学。

### 学习路径概览

```
第1-4周         第5-9周          第10-12周       第13-14周
⌨️ 查询实战  →  🔗 综合应用  →  📐 理论基础  →  🚀 进阶优化
  入门              (核心技能)        (原理深入)       (能力提升)

先动手写查询      项目驱动练习      回补底层原理    前沿技术选学
```

### 阶段注解

| 阶段 | 名称 | 周数 | 类型 | 核心内容 |
|------|------|------|------|----------|
| P1 | SQL查询实战入门 | 4周 | 核心工具 | SELECT/WHERE/GROUP BY等基础查询 |
| P2 | 工作中综合应用 | 5周 | 整合应用 | JOIN/子查询/窗口函数/事务操作 |
| P3 | 数据库理论基础 | 3周 | 基础奠基 | 范式设计/索引原理/执行计划 |
| P4 | 进阶优化与新特性 | 2周 | 进阶前沿 | 性能调优/JSON/递归CTE/新特性 |

---

## 项目驱动学习法

G8（教程实操型）的核心学习策略是"项目驱动"——以真实工作场景中的项目任务为主线，在动手过程中逐步掌握知识和技能。

### 四步项目学习法

**Step 1: 拿到任务就动手**
不要等把所有语法都学完。拿到一个数据分析需求后，先尝试写出SQL，哪怕写得不完美。边做边查，这是最快的学习方式。

**Step 2: 对照参考答案复盘**
对比自己的SQL和标准答案之间的差距。重点关注：为什么别人用了JOIN而我用了子查询？为什么这个索引能提升100倍性能？

**Step 3: 抽象出通用模式**
从具体任务中提炼出可复用的SQL模式。例如：排名前N → ROW_NUMBER + 子查询；环比计算 → LAG窗口函数；树形结构 → 递归CTE。

**Step 4: 建立个人SQL片段库**
将常用的查询模式、分析模板保存为SQL片段，工作中可快速复用。GitHub Gist、Notion或本地文件夹都是不错的选择。

---

## 第1阶段：SQL查询实战入门（第1-4周，共4周）

📌 阶段目标：能够独立编写基础查询语句，从单表中提取和统计所需数据。

🔑 核心知识点：

- [基础] SELECT查询基础 — SQL的第一块基石
- [基础] 数据过滤与排序 — 工作中最常用的SQL技能  
- [基础] 聚合函数与分组 — 从海量数据中提取统计信息

💻 代码示例：

```sql
-- SELECT查询基础
SELECT name, salary, department
FROM employees
WHERE salary > 50000
ORDER BY salary DESC;

-- 数据过滤与排序
SELECT product_name, price, category
FROM products
WHERE category IN ('电子', '家电')
  AND price BETWEEN 1000 AND 5000
  AND product_name LIKE '%Pro%'
ORDER BY price ASC;

-- 聚合函数与分组
SELECT department,
       COUNT(*) AS employee_count,
       AVG(salary) AS avg_salary,
       MAX(salary) AS max_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY avg_salary DESC;
```

📊 关键图示：

```
SQL语句执行顺序（逻辑顺序）：
  FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
  
  书写顺序 ≠ 执行顺序！（这是初学者最容易混淆的地方）

单表查询数据流：
  ┌──────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐
  │ 原始表   │ → │ WHERE过滤  │ → │ GROUP聚合  │ → │ 输出结果  │
  │ 10000行  │    │  2000行    │    │   50行     │    │   50行    │
  └──────────┘    └───────────┘    └───────────┘    └──────────┘
```

---

## 第2阶段：工作中综合应用（第5-9周，共5周）

📌 阶段目标：掌握工作中最核心的多表查询、子查询、窗口函数和数据操作技能。

🔑 核心知识点：

- [核心] 多表JOIN查询 — 工作中90%的复杂查询都需要JOIN
- [核心] 子查询与CTE — 让复杂查询分层清晰
- [核心] 窗口函数实战 — 排名分析、同比环比等场景必备
- [核心] 数据增删改与事务 — 数据安全与完整性保障

💻 代码示例：

```sql
-- 多表JOIN查询
SELECT e.name, e.department, d.manager_name, s.amount
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
LEFT JOIN salaries s ON e.id = s.emp_id AND s.year = 2025
WHERE e.status = 'active';

-- 子查询 + CTE
WITH dept_avg AS (
  SELECT department, AVG(salary) AS avg_sal
  FROM employees GROUP BY department
)
SELECT e.name, e.salary, d.avg_sal,
       ROUND((e.salary - d.avg_sal) / d.avg_sal * 100, 1) AS pct_above_avg
FROM employees e
JOIN dept_avg d ON e.department = d.department;

-- 窗口函数
SELECT department, name, salary,
       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank,
       LAG(salary, 1, 0) OVER (PARTITION BY department ORDER BY salary DESC) AS prev_salary,
       ROUND(AVG(salary) OVER (PARTITION BY department), 0) AS dept_avg
FROM employees;

-- 事务控制
BEGIN;
UPDATE accounts SET balance = balance - 1000 WHERE id = 1;
UPDATE accounts SET balance = balance + 1000 WHERE id = 2;
-- 如果一切正常
COMMIT;
-- 如果出现问题
-- ROLLBACK;
```

📊 关键图示：

```
JOIN类型速查：
  INNER JOIN     LEFT JOIN      RIGHT JOIN    FULL JOIN
  ┌───┬───┐      ┌───┬───┐      ┌───┬───┐      ┌───┬───┐
  │A∩B│   │      │A  │A∩B│      │   │A∩B│B     │A  │A∩B│B
  └───┴───┘      └───┴───┘      └───┴───┘      └───┴───┘
  只保留匹配      左表全部保留    右表全部保留    两边全部保留

窗口函数 vs GROUP BY：
  GROUP BY: 10行 → 3行（压缩数据，丢失明细）
  窗口函数: 10行 → 10行（保留明细，每行可"看见"同组其他行）
```

---

## 第3阶段：数据库理论基础（第10-12周，共3周）

📌 阶段目标：理解关系数据库的底层原理，掌握数据库设计和索引优化的核心理论。

🔑 核心知识点：

- [理论] 数据库设计范式 — 好的表结构是高性能SQL的前提
- [理论] 索引原理与优化 — SQL性能优化的核心手段
- [理论] 执行计划分析 — 慢查询排查的必备技能

💻 代码示例：

```sql
-- 创建索引
CREATE INDEX idx_emp_dept ON employees(department);
CREATE INDEX idx_emp_dept_salary ON employees(department, salary);

-- 查看执行计划（MySQL）
EXPLAIN SELECT e.name, d.manager_name
FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE e.salary > 50000
ORDER BY e.name;

-- 分析慢查询
-- 关注 type 字段: ALL(全表扫) < index < range < ref < eq_ref < const
-- 关注 rows 字段: 扫描行数越少越好
-- 关注 Extra: Using filesort(需要排序优化), Using temporary(需要临时表)
```

📊 关键图示：

```
B+树索引结构（简化）：
               [50 | 100]
              /    |    \
    [10|20|30]  [60|70|80]  [120|150|180]
     /  |  | \   /  |  | \   /   |   |   \
  叶子节点(双向链表): [→数据页1→数据页2→数据页3→...→]

查询 age=70 的过程: 根节点(50→100间) → 中间节点(60-80) → 叶子节点找到70
复杂度: O(log n)，百万级数据只需3-4次磁盘IO

三大范式速记：
  1NF: 列不可再分（每个字段都是一个原子值）
  2NF: 非主键列必须完全依赖于主键（消除部分依赖）
  3NF: 非主键列不能依赖于其他非主键列（消除传递依赖）
```

---

## 第4阶段：进阶优化与新特性（第13-14周，共2周）

📌 阶段目标：掌握SQL性能调优的系统方法论，了解各数据库的现代特性。

🔑 核心知识点：

- [进阶] SQL性能调优 — 系统性解决慢查询问题
- [进阶] 高级SQL与现代特性 — JSON、递归CTE与数据库最新功能

💻 代码示例：

```sql
-- 分页优化：延迟关联
SELECT e.name, e.salary, d.manager_name
FROM employees e
JOIN departments d ON e.dept_id = d.id
JOIN (
  SELECT id FROM employees
  ORDER BY hire_date DESC
  LIMIT 20 OFFSET 100000
) AS tmp ON e.id = tmp.id;

-- JSON查询（MySQL 5.7+）
SELECT 
  JSON_EXTRACT(profile, '$.skills') AS skills,
  JSON_UNQUOTE(JSON_EXTRACT(profile, '$.city')) AS city
FROM users
WHERE JSON_CONTAINS(profile, '"Python"', '$.skills');

-- 递归CTE：查询组织架构树
WITH RECURSIVE org_tree AS (
  SELECT id, name, manager_id, 1 AS level
  FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, t.level + 1
  FROM employees e
  JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level, name;
```

📊 关键图示：

```
SQL优化决策树：
  查询慢？
  ├── type=ALL（全表扫描）→ 建索引或优化WHERE条件
  ├── rows很大（>10万）→ 检查索引选择性，加复合索引
  ├── Extra=Using filesort → 优化ORDER BY，利用索引排序
  ├── Extra=Using temporary → 简化GROUP BY/DISTINCT
  └── 回表次数多 → 考虑覆盖索引或调整SELECT列

优化核心公式：查询时间 ∝ 扫描行数 × 每行处理成本
```

---

## 学习资料清单

| # | 类型 | 名称 | 说明 |
|---|------|------|------|
| 1 | book | 《SQL必知必会》（第5版） | 最佳SQL入门书，短小精悍，适合快速上手 |
| 2 | book | 《高性能MySQL》（第4版） | MySQL性能优化的权威参考，工作中排查问题必备 |
| 3 | book | 《SQL进阶教程》 | 面向中级学习者的经典，涵盖CASE表达式和窗口函数等 |
| 4 | book | 《数据库系统概念》（第7版） | 数据库理论经典教材，适合第3阶段深入阅读 |
| 5 | site | LeetCode SQL题库 | 200+道SQL练习题，覆盖工作中常见场景 |
| 6 | site | SQLZoo | 交互式SQL在线练习平台，适合初学者 |
| 7 | site | HackerRank SQL | 分级SQL挑战，从基础到高级 |
| 8 | site | Mode Analytics SQL教程 | 面向数据分析的SQL教程，真实案例驱动 |
| 9 | site | DB-Fiddle | 在线SQL环境，支持MySQL/PostgreSQL/SQLite |
| 10 | tool | DBeaver | 免费开源的多数据库管理工具 |
| 11 | tool | TablePlus | 现代化的数据库GUI客户端 |
| 12 | tool | Navicat | 功能全面的商业数据库管理工具 |
| 13 | site | Use The Index, Luke | 索引原理与优化的最佳在线教程 |
| 14 | site | PostgreSQL官方文档 | PG是最符合SQL标准的开源数据库，文档质量极高 |

---

## 核心语法速查表

| 名称 | 语法/说明 |
|------|-----------|
| 基本查询 | `SELECT 列名 FROM 表名 WHERE 条件 ORDER BY 列名 LIMIT N` |
| JOIN查询 | `SELECT * FROM A INNER JOIN B ON A.id = B.a_id` (INNER/LEFT/RIGHT/FULL) |
| 聚合分组 | `SELECT 列, COUNT(*) FROM 表 GROUP BY 列 HAVING COUNT(*) > N` |
| 窗口函数 | `ROW_NUMBER() / RANK() / SUM() OVER (PARTITION BY 列 ORDER BY 列)` |

---

## 实操练习题库

### 基础练习（3题）

1. **员工信息查询** — 从employees表查询薪资大于50000的员工姓名和部门，按薪资降序排列。
2. **产品筛选统计** — 从products表统计每个分类下价格在100-1000之间的产品数量。
3. **销售聚合分析** — 从orders表按月份统计销售额总和与订单数，仅显示月销售额>10000的月份。

### 进阶练习（4题）

4. **多表关联报表** — 关联employees、departments、salaries三张表，输出每个员工的姓名、部门经理姓名和最新薪资。
5. **子查询重写** — 将一段使用多层嵌套子查询的SQL改写为CTE形式，要求输出结果一致且逻辑更清晰。
6. **员工排名分析** — 使用窗口函数对每个部门的员工按薪资排名，同时显示该员工与部门平均薪资的差值。
7. **转账事务模拟** — 编写一个转账事务：从A账户扣款、向B账户加款，使用事务确保原子性，余额不足时回滚。

### 挑战练习（2题）

8. **复杂业务报表** — 某电商需要一份"用户留存分析报表"：统计每天新注册用户在第1/3/7/30天后的留存率，需要自连接和时间窗口计算。
9. **慢查询优化实战** — 给出一段100万行数据下运行超过10秒的慢查询SQL和相关表结构，分析执行计划并提出至少3种优化方案。

### 项目练习（1题）

10. **数据分析SQL项目** — 选择一个真实数据集（如Kaggle的电商数据/销售数据），从数据导入、表设计、索引创建开始，完成10个以上的业务分析查询，撰写一份数据洞察报告。

---

## 学习进度检查清单

### 第1阶段：SQL查询实战入门（第1-4周）

- [ ] 能写出正确的SELECT-WHERE-ORDER BY查询
- [ ] 理解AND/OR/IN/BETWEEN/LIKE的用法和优先级
- [ ] 能正确处理NULL值的查询和比较
- [ ] 掌握COUNT/SUM/AVG/MAX/MIN聚合函数
- [ ] 能正确使用GROUP BY + HAVING进行分组统计
- [ ] 完成LeetCode SQL基础题至少15道

### 第2阶段：工作中综合应用（第5-9周）

- [ ] 理解INNER/LEFT/RIGHT/FULL JOIN的区别和适用场景
- [ ] 能使用子查询解决"查询中的查询"问题
- [ ] 能用CTE重构复杂查询，让逻辑分层清晰
- [ ] 掌握ROW_NUMBER/RANK/LAG/LEAD等常用窗口函数
- [ ] 能安全地执行INSERT/UPDATE/DELETE操作
- [ ] 理解事务的ACID特性，能正确使用COMMIT/ROLLBACK
- [ ] 完成LeetCode SQL中等难度题至少20道

### 第3阶段：数据库理论基础（第10-12周）

- [ ] 理解三大范式并能判断表结构是否符合规范
- [ ] 能画出ER图表达实体和关系
- [ ] 理解B+树索引的数据结构和查找原理
- [ ] 能区分聚集索引和非聚集索引的使用场景
- [ ] 能读懂EXPLAIN输出的关键字段
- [ ] 能从执行计划中识别全表扫描、文件排序等性能瓶颈
- [ ] 能够根据慢查询创建合适的索引

### 第4阶段：进阶优化与新特性（第13-14周）

- [ ] 掌握大表分页优化的延迟关联技术
- [ ] 理解覆盖索引、索引下推等优化概念
- [ ] 能用递归CTE处理树形结构数据
- [ ] 了解JSON数据类型的查询方法
- [ ] 能针对具体业务场景提出SQL优化方案
- [ ] 了解工作中常用数据库（MySQL/PG/SQL Server）的关键差异
- [ ] 完成分析项目并产出报告