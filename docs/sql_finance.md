# SQL 金融方向完整学习方案与实操指南

---

## 目录

1. [总体学习路线图](#一总体学习路线图)
2. [第一阶段：SQL 基础语法 + 金融数据认知（第1-2周）](#二第一阶段sql-基础语法--金融数据认知)
3. [第二阶段：聚合与分组分析（第3-4周）](#三第二阶段聚合与分组分析)
4. [第三阶段：多表联查与子查询（第5-6周）](#四第三阶段多表联查与子查询)
5. [第四阶段：窗口函数（第7-8周）](#五第四阶段窗口函数)
6. [第五阶段：CTE 与复杂报表（第9-10周）](#六第五阶段cte-与复杂报表)
7. [第六阶段：金融专项实战大案例（第11-13周）](#七第六阶段金融专项实战大案例)
8. [第七阶段：性能优化与生产级写法（第14-15周）](#八第七阶段性能优化与生产级写法)
9. [学习资料清单](#九学习资料清单)
10. [常用公式速查表](#十常用公式速查表)
11. [实操练习题库](#十一实操练习题库)

---

## 一、总体学习路线图

### 学习目标
能够在金融行业（银行、证券、基金、保险、互联网金融）独立完成：
- 日常数据提取与报表制作
- 风险指标计算与监控
- 投资组合分析
- 客户画像与精准营销分析
- 监管报送数据加工

### 时间规划：15周（约3.5个月）

```
第1-2周    基础语法 + 金融数据类型认知
第3-4周    聚合函数 + 分组 + 日期处理
第5-6周    多表 JOIN + 子查询
第7-8周    窗口函数（核心分水岭）
第9-10周   CTE + 复杂报表构建
第11-13周  金融专项实战大案例
第14-15周  性能优化 + 生产级规范
```

### 学习方式建议
- **每天 1.5-2 小时**：理论学习 + 动手敲代码
- 推荐在线练习平台：LeetCode 数据库题、牛客网 SQL 实战、HackerRank SQL
- 自建本地 MySQL/PostgreSQL 环境，构造金融模拟数据练习

---

## 二、第一阶段：SQL 基础语法 + 金融数据认知

> **学习时长**：第 1-2 周 | **目标**：能独立写 SELECT 查询，理解金融数据表结构

### 2.1 环境搭建

**推荐安装**：
- **MySQL 8.0+** 或 **PostgreSQL 15+**（金融行业主流）
- 客户端工具：DBeaver（免费，推荐）/ Navicat / DataGrip
- 可选：Docker 一键部署

```bash
# Docker 快速部署 MySQL（如已安装Docker）
docker run --name mysql-fin -e MYSQL_ROOT_PASSWORD=123456 -p 3306:3306 -d mysql:8.0
```

### 2.2 核心语法清单

| 语法 | 说明 | 金融场景 |
|------|------|----------|
| `SELECT` / `FROM` | 基础查询 | 查询交易记录 |
| `WHERE` | 条件过滤 | 筛选特定日期或产品 |
| `AND` / `OR` / `NOT` | 逻辑运算 | 多条件组合筛选 |
| `IN` / `BETWEEN` / `LIKE` | 范围/模糊匹配 | 筛选多个产品代码 |
| `ORDER BY` | 排序 | 按交易金额降序 |
| `LIMIT` / `TOP` | 限制行数 | Top N 客户 |
| `DISTINCT` | 去重 | 统计去重客户数 |
| `CASE WHEN` | 条件表达式 | 资产分类、风险分级 |
| `COALESCE` / `IFNULL` | 空值处理 | 缺失值填补 |
| `CAST` / `CONVERT` | 类型转换 | 字符串转日期/数值 |

### 2.3 金融数据表结构认知（模拟建表）

```sql
-- ============================================
-- 金融行业核心数据表结构（模拟）
-- ============================================

-- 1. 客户信息表
CREATE TABLE dim_customer (
    customer_id     VARCHAR(20) PRIMARY KEY,   -- 客户ID
    customer_name   VARCHAR(50),               -- 客户姓名
    gender          CHAR(1),                   -- 性别 M/F
    birth_date      DATE,                      -- 出生日期
    risk_level      VARCHAR(10),               -- 风险等级：保守/稳健/进取
    register_date   DATE,                      -- 注册日期
    city            VARCHAR(30),               -- 所在城市
    occupation      VARCHAR(30)                -- 职业
);

-- 2. 账户信息表
CREATE TABLE dim_account (
    account_id      VARCHAR(20) PRIMARY KEY,   -- 账户ID
    customer_id     VARCHAR(20),               -- 客户ID
    account_type    VARCHAR(20),               -- 账户类型：储蓄/理财/信用
    open_date       DATE,                      -- 开户日期
    status          VARCHAR(10),               -- 状态：正常/冻结/销户
    balance         DECIMAL(18,2)              -- 当前余额
);

-- 3. 交易流水表（金融最核心的表）
CREATE TABLE fact_transaction (
    trans_id        BIGINT PRIMARY KEY,        -- 交易ID
    account_id      VARCHAR(20),               -- 账户ID
    trans_date      DATE,                      -- 交易日期
    trans_time      TIME,                      -- 交易时间
    trans_type      VARCHAR(20),               -- 交易类型：存款/取款/转账/消费/理财申购/理财赎回
    amount          DECIMAL(18,2),             -- 交易金额
    currency        VARCHAR(5) DEFAULT 'CNY',  -- 币种
    channel         VARCHAR(20),               -- 渠道：柜面/网银/手机APP/ATM
    counterparty    VARCHAR(50),               -- 交易对手
    remark          VARCHAR(200)               -- 备注
);

-- 4. 产品/标的表（基金、理财、股票等）
CREATE TABLE dim_product (
    product_id      VARCHAR(20) PRIMARY KEY,   -- 产品代码
    product_name    VARCHAR(100),              -- 产品名称
    product_type    VARCHAR(20),               -- 类型：货币基金/债券基金/股票基金/理财产品
    risk_level      VARCHAR(10),               -- 风险等级
    issue_date      DATE,                      -- 发行日期
    nav             DECIMAL(10,4),             -- 最新净值
    annual_return   DECIMAL(10,4),             -- 年化收益率
    max_drawdown    DECIMAL(10,4)              -- 最大回撤
);

-- 5. 持仓表
CREATE TABLE fact_holding (
    holding_id      BIGINT PRIMARY KEY,
    account_id      VARCHAR(20),               -- 账户ID
    product_id      VARCHAR(20),               -- 产品代码
    hold_date       DATE,                      -- 持仓日期
    hold_quantity   DECIMAL(18,4),             -- 持有份额
    market_value    DECIMAL(18,2),             -- 持仓市值
    cost_amount     DECIMAL(18,2),             -- 成本金额
    pnl             DECIMAL(18,2)              -- 浮动盈亏
);

-- 6. 日净值/行情表
CREATE TABLE fact_nav (
    product_id      VARCHAR(20),               -- 产品代码
    nav_date        DATE,                      -- 净值日期
    unit_nav        DECIMAL(10,4),             -- 单位净值
    accum_nav       DECIMAL(10,4),             -- 累计净值
    daily_return    DECIMAL(10,6),             -- 日收益率
    PRIMARY KEY (product_id, nav_date)
);
```

### 2.4 基础语法金融实操

```sql
-- 【案例1】查询2024年1月所有大额交易（>50万）
SELECT trans_id, account_id, trans_date, amount, trans_type
FROM fact_transaction
WHERE trans_date BETWEEN '2024-01-01' AND '2024-01-31'
  AND amount > 500000
ORDER BY amount DESC;

-- 【案例2】客户风险等级分类（CASE WHEN）
SELECT 
    customer_id,
    customer_name,
    balance,
    CASE 
        WHEN balance < 10000 THEN '低净值'
        WHEN balance BETWEEN 10000 AND 500000 THEN '中净值'
        WHEN balance BETWEEN 500000 AND 1000000 THEN '高净值'
        ELSE '超高净值'
    END AS wealth_level
FROM dim_account a
JOIN dim_customer c ON a.customer_id = c.customer_id;

-- 【案例3】处理空值——将没有备注的标记为“无备注”
SELECT 
    trans_id,
    COALESCE(remark, '无备注') AS remark_filled
FROM fact_transaction;

-- 【案例4】模糊查询——查找股票型基金产品
SELECT product_id, product_name
FROM dim_product
WHERE product_name LIKE '%股票%';
```

---

## 三、第二阶段：聚合与分组分析

> **学习时长**：第 3-4 周 | **目标**：能做日报、周报、月报等汇总统计

### 3.1 核心语法

| 函数/语法 | 说明 | 金融应用 |
|-----------|------|----------|
| `COUNT` / `COUNT(DISTINCT)` | 计数/去重计数 | 统计交易笔数、去重客户数 |
| `SUM` | 求和 | 总交易金额、总资产 |
| `AVG` | 平均值 | 平均交易金额、平均持仓 |
| `MAX` / `MIN` | 最大/最小值 | 最大单笔交易、最小净值 |
| `GROUP BY` | 分组 | 按日期/产品/客户分组统计 |
| `HAVING` | 分组后过滤 | 筛选交易笔数>100的客户 |
| `DATE_FORMAT` / `TO_CHAR` | 日期格式化 | 按月/按季度汇总 |

### 3.2 日期函数（金融核心）

```sql
-- MySQL 日期函数
DATE_FORMAT(trans_date, '%Y-%m')        -- 提取年月
DATE_FORMAT(trans_date, '%Y')           -- 提取年份
QUARTER(trans_date)                     -- 季度
WEEK(trans_date)                        -- 周
DATEDIFF(date1, date2)                  -- 日期差
DATE_ADD(date, INTERVAL 1 MONTH)        -- 日期加减
LAST_DAY(date)                          -- 月末日期
TIMESTAMPDIFF(YEAR, birth_date, NOW())  -- 计算年龄

-- PostgreSQL 日期函数
TO_CHAR(trans_date, 'YYYY-MM')
EXTRACT(QUARTER FROM trans_date)
EXTRACT(YEAR FROM AGE(birth_date))      -- 计算年龄
```

### 3.3 聚合分析金融案例

```sql
-- 【案例1】每日交易汇总报表（银行日报核心SQL）
SELECT 
    trans_date,
    COUNT(*) AS trans_cnt,                    -- 交易笔数
    COUNT(DISTINCT account_id) AS cust_cnt,   -- 交易客户数
    SUM(amount) AS total_amount,              -- 交易总额
    AVG(amount) AS avg_amount,                -- 笔均金额
    SUM(CASE WHEN trans_type = '理财申购' THEN amount ELSE 0 END) AS finance_buy,  -- 理财申购
    SUM(CASE WHEN trans_type = '理财赎回' THEN amount ELSE 0 END) AS finance_sell  -- 理财赎回
FROM fact_transaction
WHERE trans_date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY trans_date
ORDER BY trans_date;

-- 【案例2】按渠道统计交易量与占比
SELECT 
    channel,
    COUNT(*) AS trans_cnt,
    SUM(amount) AS total_amount,
    ROUND(SUM(amount) * 100.0 / SUM(SUM(amount)) OVER(), 2) AS pct  -- 占比
FROM fact_transaction
WHERE trans_date = '2024-01-15'
GROUP BY channel
ORDER BY total_amount DESC;

-- 【案例3】筛选月均交易>50笔的高频客户
SELECT 
    account_id,
    COUNT(*) AS monthly_trans,
    SUM(amount) AS monthly_amount,
    AVG(amount) AS avg_amount
FROM fact_transaction
WHERE trans_date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY account_id
HAVING COUNT(*) > 50
ORDER BY monthly_trans DESC;

-- 【案例4】按月、按产品类型统计销售额趋势
SELECT 
    DATE_FORMAT(trans_date, '%Y-%m') AS month,
    p.product_type,
    COUNT(DISTINCT t.account_id) AS buyer_cnt,
    SUM(t.amount) AS total_sales
FROM fact_transaction t
JOIN dim_product p ON t.counterparty = p.product_id
WHERE t.trans_type IN ('理财申购', '理财赎回')
  AND t.trans_date >= '2024-01-01'
GROUP BY DATE_FORMAT(trans_date, '%Y-%m'), p.product_type
ORDER BY month, p.product_type;
```

---

## 四、第三阶段：多表联查与子查询

> **学习时长**：第 5-6 周 | **目标**：能关联多张表完成业务分析

### 4.1 JOIN 类型详解

| JOIN 类型 | 说明 | 金融场景 |
|-----------|------|----------|
| `INNER JOIN` | 取交集 | 交易+客户：只保留有交易的客户 |
| `LEFT JOIN` | 左表全保留 | 客户+交易：保留所有客户（含无交易） |
| `RIGHT JOIN` | 右表全保留 | 较少用 |
| `FULL OUTER JOIN` | 两边全保留 | 对比两期客户名单差异 |
| `CROSS JOIN` | 笛卡尔积 | 生成日期序列 |
| `SELF JOIN` | 自连接 | 计算环比/同比 |

### 4.2 子查询类型

```sql
-- 【类型1】标量子查询：作为一列值
SELECT account_id, amount,
    (SELECT AVG(amount) FROM fact_transaction) AS overall_avg
FROM fact_transaction;

-- 【类型2】FROM子查询：作为临时表
SELECT * FROM (
    SELECT account_id, SUM(amount) AS total
    FROM fact_transaction
    GROUP BY account_id
) t WHERE total > 1000000;

-- 【类型3】WHERE子查询：IN / EXISTS
SELECT * FROM dim_customer
WHERE customer_id IN (
    SELECT DISTINCT customer_id FROM dim_account WHERE balance > 1000000
);

-- 【类型4】相关子查询：引用外层列
SELECT account_id, trans_date, amount,
    (SELECT AVG(amount) FROM fact_transaction t2 
     WHERE t2.account_id = t1.account_id) AS cust_avg
FROM fact_transaction t1;
```

### 4.3 多表联查金融案例

```sql
-- 【案例1】客户360画像：客户+账户+交易汇总
SELECT 
    c.customer_id,
    c.customer_name,
    c.risk_level,
    COUNT(DISTINCT a.account_id) AS account_cnt,
    SUM(a.balance) AS total_balance,
    COUNT(DISTINCT t.trans_id) AS trans_cnt_6m,
    SUM(t.amount) AS trans_amount_6m
FROM dim_customer c
LEFT JOIN dim_account a ON c.customer_id = a.customer_id AND a.status = '正常'
LEFT JOIN fact_transaction t ON a.account_id = t.account_id 
    AND t.trans_date >= DATE_ADD(CURDATE(), INTERVAL -6 MONTH)
GROUP BY c.customer_id, c.customer_name, c.risk_level
ORDER BY total_balance DESC;

-- 【案例2】找出从未发生交易的沉默客户（LEFT JOIN + IS NULL）
SELECT 
    c.customer_id,
    c.customer_name,
    c.register_date
FROM dim_customer c
LEFT JOIN dim_account a ON c.customer_id = a.customer_id
LEFT JOIN fact_transaction t ON a.account_id = t.account_id
WHERE t.trans_id IS NULL;

-- 【案例3】环比计算（自连接）
SELECT 
    t1.trans_date,
    t1.total_amount AS today_amount,
    t2.total_amount AS yesterday_amount,
    ROUND((t1.total_amount - t2.total_amount) / t2.total_amount * 100, 2) AS dod_change_pct  -- 日环比
FROM 
    (SELECT trans_date, SUM(amount) AS total_amount 
     FROM fact_transaction GROUP BY trans_date) t1
LEFT JOIN 
    (SELECT trans_date, SUM(amount) AS total_amount 
     FROM fact_transaction GROUP BY trans_date) t2
ON t1.trans_date = DATE_ADD(t2.trans_date, INTERVAL 1 DAY)
ORDER BY t1.trans_date;

-- 【案例4】Union 合并——合并存款和理财申购为"入金"统计
SELECT account_id, trans_date, amount, '存款' AS source
FROM fact_transaction WHERE trans_type = '存款'
UNION ALL
SELECT account_id, trans_date, amount, '理财赎回' AS source
FROM fact_transaction WHERE trans_type = '理财赎回';
```

---

## 五、第四阶段：窗口函数

> **学习时长**：第 7-8 周 | **目标**：这是 SQL 能力的分水岭，金融分析的核心技能

### 5.1 窗口函数速查

| 函数 | 说明 | 金融应用 |
|------|------|----------|
| `ROW_NUMBER()` | 排名（不重复） | 每个客户最新一笔交易 |
| `RANK()` / `DENSE_RANK()` | 排名（可重复） | 产品收益率排名 |
| `LAG()` / `LEAD()` | 前/后行值 | 计算收益率、环比 |
| `SUM() OVER()` | 累计求和 | 累计交易额、累计收益 |
| `AVG() OVER()` | 移动平均 | MA均线（5日/10日/20日） |
| `FIRST_VALUE()` / `LAST_VALUE()` | 首/末值 | 区间首个净值 |
| `NTILE(N)` | N等分 | 客户分群（5档分层） |
| `PERCENT_RANK()` | 百分比排名 | 客户百分位排名 |

### 5.2 窗口函数语法结构

```sql
函数名() OVER (
    PARTITION BY 分组列      -- 分组
    ORDER BY 排序列          -- 排序
    ROWS/RANGE BETWEEN ...   -- 窗口范围
)

-- 窗口范围子句（ROWS）：
-- ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW     -- 从第1行到当前行（累计）
-- ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING             -- 前1行+当前+后1行
-- ROWS BETWEEN 5 PRECEDING AND CURRENT ROW             -- 前5行+当前行（5日移动窗口）
```

### 5.3 窗口函数金融案例（重点！）

```sql
-- ============================================
-- 【案例1】累计交易额（CUSUM）——监控账户资金变化
-- ============================================
SELECT 
    account_id,
    trans_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY account_id 
        ORDER BY trans_date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_amount
FROM fact_transaction
WHERE account_id = 'ACC001'
ORDER BY trans_date;

-- ============================================
-- 【案例2】移动平均（MA）——计算5日/10日/20日均线（技术分析核心）
-- ============================================
SELECT 
    nav_date,
    unit_nav,
    ROUND(AVG(unit_nav) OVER (ORDER BY nav_date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW), 4) AS ma_5,
    ROUND(AVG(unit_nav) OVER (ORDER BY nav_date ROWS BETWEEN 9 PRECEDING AND CURRENT ROW), 4) AS ma_10,
    ROUND(AVG(unit_nav) OVER (ORDER BY nav_date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW), 4) AS ma_20
FROM fact_nav
WHERE product_id = 'FUND001'
ORDER BY nav_date;

-- ============================================
-- 【案例3】日收益率计算（LAG）
-- 公式：日收益率 = (当日净值 - 前日净值) / 前日净值
-- ============================================
SELECT 
    nav_date,
    unit_nav,
    LAG(unit_nav, 1) OVER (ORDER BY nav_date) AS prev_nav,
    ROUND((unit_nav - LAG(unit_nav, 1) OVER (ORDER BY nav_date)) 
          / LAG(unit_nav, 1) OVER (ORDER BY nav_date) * 100, 4) AS daily_return_pct
FROM fact_nav
WHERE product_id = 'FUND001'
ORDER BY nav_date;

-- ============================================
-- 【案例4】客户排名——按交易金额排名（ROW_NUMBER vs RANK）
-- ============================================
SELECT 
    account_id,
    SUM(amount) AS total_amount,
    ROW_NUMBER() OVER (ORDER BY SUM(amount) DESC) AS rn,
    RANK()       OVER (ORDER BY SUM(amount) DESC) AS rk,
    DENSE_RANK() OVER (ORDER BY SUM(amount) DESC) AS dr
FROM fact_transaction
WHERE trans_date = '2024-01-15'
GROUP BY account_id
ORDER BY total_amount DESC;

-- ============================================
-- 【案例5】找出每个客户最新一笔交易
-- ============================================
SELECT * FROM (
    SELECT 
        t.*,
        ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY trans_date DESC, trans_time DESC) AS rn
    FROM fact_transaction t
) ranked
WHERE rn = 1;

-- ============================================
-- 【案例6】客户分层（NTILE 分5档）
-- ============================================
SELECT 
    account_id,
    total_balance,
    NTILE(5) OVER (ORDER BY total_balance DESC) AS wealth_quintile
FROM dim_account;

-- ============================================
-- 【案例7】最大回撤计算（金融风控核心指标）
-- 最大回撤 = MAX((历史最高净值 - 当前净值) / 历史最高净值)
-- ============================================
WITH nav_with_max AS (
    SELECT 
        nav_date,
        unit_nav,
        MAX(unit_nav) OVER (ORDER BY nav_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_max
    FROM fact_nav
    WHERE product_id = 'FUND001'
)
SELECT 
    nav_date,
    unit_nav,
    running_max,
    ROUND((running_max - unit_nav) / running_max * 100, 4) AS drawdown_pct
FROM nav_with_max
ORDER BY nav_date;

-- ============================================
-- 【案例8】月环比增长率
-- ============================================
WITH monthly AS (
    SELECT 
        DATE_FORMAT(trans_date, '%Y-%m') AS month,
        SUM(amount) AS total_amount
    FROM fact_transaction
    GROUP BY DATE_FORMAT(trans_date, '%Y-%m')
)
SELECT 
    month,
    total_amount,
    LAG(total_amount) OVER (ORDER BY month) AS prev_month_amount,
    ROUND((total_amount - LAG(total_amount) OVER (ORDER BY month)) 
          / LAG(total_amount) OVER (ORDER BY month) * 100, 2) AS mom_growth_pct
FROM monthly
ORDER BY month;
```

---

## 六、第五阶段：CTE 与复杂报表

> **学习时长**：第 9-10 周 | **目标**：能构建复杂的多层嵌套分析报表

### 6.1 CTE（Common Table Expression）

```sql
-- CTE 基本语法
WITH cte_name AS (
    SELECT ...  -- 子查询
)
SELECT ... FROM cte_name;

-- 多个CTE串联（金融中非常常用）
WITH 
cte1 AS (...),
cte2 AS (...),
cte3 AS (...)
SELECT ... FROM cte1 JOIN cte2 ON ... JOIN cte3 ON ...

-- 递归CTE（生成日期序列、组织架构树）
WITH RECURSIVE date_series AS (
    SELECT '2024-01-01' AS dt
    UNION ALL
    SELECT DATE_ADD(dt, INTERVAL 1 DAY) FROM date_series WHERE dt < '2024-12-31'
)
SELECT dt FROM date_series;
```

### 6.2 复杂报表金融案例

```sql
-- ============================================
-- 【案例1】客户生命周期价值报表（LTV）
-- 将客户按注册月份分组，统计6个月内累计贡献
-- ============================================
WITH customer_monthly AS (
    SELECT 
        c.customer_id,
        DATE_FORMAT(c.register_date, '%Y-%m') AS cohort,
        COUNT(DISTINCT t.trans_id) AS trans_cnt,
        SUM(t.amount) AS total_amount
    FROM dim_customer c
    LEFT JOIN dim_account a ON c.customer_id = a.customer_id
    LEFT JOIN fact_transaction t ON a.account_id = t.account_id 
        AND t.trans_date BETWEEN c.register_date 
        AND DATE_ADD(c.register_date, INTERVAL 6 MONTH)
    GROUP BY c.customer_id, DATE_FORMAT(c.register_date, '%Y-%m')
)
SELECT 
    cohort,
    COUNT(DISTINCT customer_id) AS cohort_size,
    SUM(total_amount) AS cohort_revenue,
    ROUND(SUM(total_amount) / COUNT(DISTINCT customer_id), 2) AS ltv_per_customer
FROM customer_monthly
GROUP BY cohort
ORDER BY cohort;

-- ============================================
-- 【案例2】用户留存分析（金融产品核心）
-- ============================================
WITH active_users AS (
    SELECT DISTINCT 
        account_id, 
        DATE_FORMAT(trans_date, '%Y-%m') AS active_month
    FROM fact_transaction
),
first_month AS (
    SELECT 
        account_id, 
        MIN(active_month) AS first_active_month
    FROM active_users
    GROUP BY account_id
)
SELECT 
    f.first_active_month AS cohort,
    a.active_month,
    COUNT(DISTINCT f.account_id) AS retained_users
FROM first_month f
JOIN active_users a ON f.account_id = a.account_id
WHERE a.active_month >= f.first_active_month
GROUP BY f.first_active_month, a.active_month
ORDER BY f.first_active_month, a.active_month;

-- ============================================
-- 【案例3】投资组合分析报表
-- 结合持仓、净值、客户信息
-- ============================================
WITH holdings_enriched AS (
    SELECT 
        h.account_id,
        h.product_id,
        p.product_name,
        p.product_type,
        p.risk_level AS product_risk,
        h.hold_quantity,
        h.market_value,
        h.cost_amount,
        h.pnl,
        ROUND(h.pnl / h.cost_amount * 100, 2) AS return_pct  -- 收益率
    FROM fact_holding h
    JOIN dim_product p ON h.product_id = p.product_id
    WHERE h.hold_date = '2024-01-31'
)
SELECT 
    a.customer_id,
    c.customer_name,
    SUM(he.market_value) AS total_market_value,
    SUM(he.pnl) AS total_pnl,
    ROUND(SUM(he.pnl) / SUM(he.cost_amount) * 100, 2) AS total_return_pct,
    SUM(CASE WHEN he.product_risk = '高' THEN he.market_value ELSE 0 END) AS high_risk_value,
    ROUND(SUM(CASE WHEN he.product_risk = '高' THEN he.market_value ELSE 0 END) 
          / SUM(he.market_value) * 100, 2) AS high_risk_pct  -- 高风险占比
FROM holdings_enriched he
JOIN dim_account a ON he.account_id = a.account_id
JOIN dim_customer c ON a.customer_id = c.customer_id
GROUP BY a.customer_id, c.customer_name
ORDER BY total_market_value DESC;

-- ============================================
-- 【案例4】监管报送——反洗钱大额可疑交易监测
-- 规则：单日累计 > 200万 或 单笔 > 100万
-- ============================================
WITH daily_agg AS (
    SELECT 
        account_id,
        trans_date,
        SUM(amount) AS daily_total,
        MAX(amount) AS max_single,
        COUNT(*) AS trans_cnt
    FROM fact_transaction
    GROUP BY account_id, trans_date
)
SELECT 
    d.account_id,
    d.trans_date,
    d.daily_total,
    d.max_single,
    d.trans_cnt,
    CASE 
        WHEN d.max_single > 1000000 OR d.daily_total > 2000000 THEN '可疑'
        ELSE '正常'
    END AS alert_flag
FROM daily_agg d
WHERE d.max_single > 1000000 OR d.daily_total > 2000000
ORDER BY d.daily_total DESC;
```

---

## 七、第六阶段：金融专项实战大案例

> **学习时长**：第 11-13 周 | **目标**：独立完成金融业务场景综合分析

### 7.1 风控专题：滚动逾期计算

```sql
-- 场景：信用卡/贷款逾期天数计算
-- 输入：还款计划表+实际还款表
-- 输出：每笔贷款当前逾期天数、逾期金额

WITH loan_status AS (
    SELECT 
        l.loan_id,
        l.customer_id,
        l.loan_amount,
        l.due_date,
        COALESCE(SUM(r.repay_amount), 0) AS total_repaid,
        l.loan_amount - COALESCE(SUM(r.repay_amount), 0) AS outstanding
    FROM dim_loan l
    LEFT JOIN fact_repayment r ON l.loan_id = r.loan_id AND r.repay_date <= CURDATE()
    WHERE l.due_date <= CURDATE()
    GROUP BY l.loan_id, l.customer_id, l.loan_amount, l.due_date
)
SELECT 
    loan_id,
    customer_id,
    loan_amount,
    outstanding,
    DATEDIFF(CURDATE(), due_date) AS overdue_days,
    CASE 
        WHEN DATEDIFF(CURDATE(), due_date) <= 30 THEN 'M1'
        WHEN DATEDIFF(CURDATE(), due_date) <= 60 THEN 'M2'
        WHEN DATEDIFF(CURDATE(), due_date) <= 90 THEN 'M3'
        ELSE 'M4+'
    END AS overdue_bucket  -- 逾期账龄
FROM loan_status
WHERE outstanding > 0
ORDER BY overdue_days DESC;
```

### 7.2 投资分析专题：夏普比率计算

```sql
-- ============================================
-- 夏普比率（Sharpe Ratio）计算
-- 公式：Sharpe = (Rp - Rf) / σp
--   Rp = 投资组合年化收益率
--   Rf = 无风险利率（通常取3%）
--   σp = 年化波动率（收益率标准差 * √252）
-- ============================================
WITH daily_returns AS (
    SELECT 
        nav_date,
        ROUND((unit_nav - LAG(unit_nav) OVER (ORDER BY nav_date)) 
              / LAG(unit_nav) OVER (ORDER BY nav_date), 6) AS daily_return
    FROM fact_nav
    WHERE product_id = 'FUND001'
      AND nav_date >= '2024-01-01'
),
stats AS (
    SELECT 
        COUNT(*) - 1 AS trading_days,                    -- 交易日数
        AVG(daily_return) * 252 AS annual_return,        -- 年化收益率
        STDDEV(daily_return) * SQRT(252) AS annual_volatility  -- 年化波动率
    FROM daily_returns
    WHERE daily_return IS NOT NULL
)
SELECT 
    ROUND(annual_return * 100, 2) AS annual_return_pct,
    ROUND(annual_volatility * 100, 2) AS annual_volatility_pct,
    ROUND((annual_return - 0.03) / annual_volatility, 4) AS sharpe_ratio
FROM stats;

-- ============================================
-- 最大回撤（Max Drawdown）完整计算
-- ============================================
WITH cumulative AS (
    SELECT 
        nav_date,
        unit_nav * (1 + SUM(daily_return) OVER (ORDER BY nav_date)) AS cumulative_nav
    FROM daily_returns
),
drawdown AS (
    SELECT 
        nav_date,
        cumulative_nav,
        MAX(cumulative_nav) OVER (ORDER BY nav_date 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS peak,
        (cumulative_nav - MAX(cumulative_nav) OVER (ORDER BY nav_date 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)) 
        / MAX(cumulative_nav) OVER (ORDER BY nav_date 
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS dd
    FROM cumulative
)
SELECT 
    ROUND(MIN(dd) * 100, 2) AS max_drawdown_pct   -- 最大回撤（负值）
FROM drawdown;
```

### 7.3 智能营销专题：RFM 客户分群

```sql
-- ============================================
-- RFM 模型（金融客户价值分层）
-- R = Recency（最近交易距今天数）
-- F = Frequency（交易频率）
-- M = Monetary（交易金额）
-- ============================================
WITH rfm AS (
    SELECT 
        account_id,
        DATEDIFF(CURDATE(), MAX(trans_date)) AS recency,          -- R: 距今天数
        COUNT(DISTINCT trans_id) AS frequency,                     -- F: 交易次数
        SUM(amount) AS monetary,                                   -- M: 交易总金额
        AVG(amount) AS avg_trans_amount
    FROM fact_transaction
    WHERE trans_date >= DATE_ADD(CURDATE(), INTERVAL -12 MONTH)
    GROUP BY account_id
),
rfm_scored AS (
    SELECT 
        account_id,
        recency,
        frequency,
        monetary,
        -- R评分：越小越好（最近交易），5档打分
        NTILE(5) OVER (ORDER BY recency DESC) AS r_score,
        -- F评分：越高越好
        NTILE(5) OVER (ORDER BY frequency ASC) AS f_score,
        -- M评分：越高越好
        NTILE(5) OVER (ORDER BY monetary ASC) AS m_score
    FROM rfm
)
SELECT 
    account_id,
    recency,
    frequency,
    monetary,
    r_score,
    f_score,
    m_score,
    r_score + f_score + m_score AS total_score,
    CASE 
        WHEN r_score + f_score + m_score >= 13 THEN '高价值客户'
        WHEN r_score + f_score + m_score >= 9  THEN '潜力客户'
        WHEN r_score + f_score + m_score >= 5  THEN '一般客户'
        ELSE '低价值客户'
    END AS customer_segment
FROM rfm_scored
ORDER BY total_score DESC;
```

### 7.4 银行资产负债专题：流动性覆盖率 LCR

```sql
-- ============================================
-- 简化版流动性覆盖率（LCR）
-- LCR = 优质流动性资产 / 未来30天净现金流出
-- ============================================
WITH hqla AS (
    -- 优质流动性资产：现金 + 超额准备金 + 高等级债券
    SELECT 
        '2024-01-31' AS calc_date,
        SUM(CASE WHEN asset_type IN ('现金', '存放央行超额准备金', '国债') 
            THEN market_value * haircut_rate ELSE 0 END) AS hqla_value
    FROM dim_asset
    WHERE asset_date = '2024-01-31'
),
outflow_30d AS (
    -- 未来30天预计现金流出
    SELECT 
        '2024-01-31' AS calc_date,
        SUM(daily_expected_outflow) AS total_outflow,
        SUM(daily_expected_inflow * inflow_cap_rate) AS capped_inflow  -- 流入有上限
    FROM cashflow_projection
    WHERE proj_date BETWEEN '2024-02-01' AND '2024-03-01'
)
SELECT 
    ROUND(h.hqla_value / NULLIF(o.total_outflow - o.capped_inflow, 0) * 100, 2) AS lcr_pct,
    CASE 
        WHEN ROUND(h.hqla_value / NULLIF(o.total_outflow - o.capped_inflow, 0) * 100, 2) < 100 
        THEN '不达标'
        ELSE '达标'
    END AS lcr_status
FROM hqla h
CROSS JOIN outflow_30d o;
```

### 7.5 监管专题：资本充足率 CAR

```sql
-- ============================================
-- 资本充足率 = (核心资本 + 附属资本) / 风险加权资产(RWA)
-- 简化版示例
-- ============================================
WITH capital AS (
    SELECT 
        calc_date,
        SUM(CASE WHEN capital_type = '核心一级资本' THEN amount ELSE 0 END) AS tier1,
        SUM(CASE WHEN capital_type = '其他一级资本' THEN amount ELSE 0 END) AS at1,
        SUM(CASE WHEN capital_type = '二级资本' THEN amount ELSE 0 END) AS tier2
    FROM dim_capital
    WHERE calc_date = '2024-01-31'
    GROUP BY calc_date
),
rwa AS (
    -- 风险加权资产 = SUM(各类资产 × 风险权重)
    SELECT 
        calc_date,
        SUM(market_value * risk_weight) AS total_rwa
    FROM dim_asset
    WHERE calc_date = '2024-01-31'
    GROUP BY calc_date
)
SELECT 
    ROUND((c.tier1 + c.at1 + c.tier2) / r.total_rwa * 100, 2) AS car_pct,
    ROUND(c.tier1 / r.total_rwa * 100, 2) AS tier1_car_pct,
    CASE 
        WHEN ROUND((c.tier1 + c.at1 + c.tier2) / r.total_rwa * 100, 2) >= 10.5 
        THEN '达标' ELSE '不达标' 
    END AS car_status
FROM capital c, rwa r;
```

---

## 八、第七阶段：性能优化与生产级写法

> **学习时长**：第 14-15 周 | **目标**：写出高效、可维护的生产级 SQL

### 8.1 索引优化

```sql
-- 【优化前】全表扫描
SELECT * FROM fact_transaction 
WHERE trans_date = '2024-01-15' AND amount > 10000;

-- 【创建覆盖索引】交易日期+金额
CREATE INDEX idx_trans_date_amount ON fact_transaction(trans_date, amount);

-- 【用 EXPLAIN 查看执行计划】
EXPLAIN SELECT * FROM fact_transaction WHERE trans_date = '2024-01-15';
-- type=ref 说明走了索引，type=ALL 说明全表扫描
```

### 8.2 SQL 书写规范（金融生产环境）

```sql
-- ===== 推荐写法模板 =====
-- [功能] 每日交易汇总
-- [作者] 张三
-- [日期] 2024-01-15
-- [表依赖] fact_transaction
SELECT 
    t.trans_date,
    COUNT(1)                                 AS trans_cnt,
    SUM(t.amount)                            AS total_amount,
    ROUND(AVG(t.amount), 2)                  AS avg_amount
FROM fact_transaction t                                 -- 表别名
WHERE t.trans_date BETWEEN '2024-01-01' AND '2024-01-31'  -- 日期范围
  AND t.amount > 0                                        -- 排除异常数据
  AND t.status = 'SUCCESS'                                -- 仅成功交易
GROUP BY t.trans_date
ORDER BY t.trans_date
;
```

### 8.3 常见性能陷阱

| 陷阱 | 说明 | 优化方案 |
|------|------|----------|
| `SELECT *` | 返回所有列 | 只选需要的列 |
| `WHERE 函数(列)` | 索引失效 | 改写为范围条件 |
| `LIKE '%xxx'` | 前缀模糊不走索引 | 用全文索引或 ES |
| `JOIN` 大表未索引 | 笛卡尔积爆炸 | JOIN 键必须建索引 |
| `OR` 条件过多 | 索引选择困难 | 用 UNION ALL 拆分 |
| 子查询未去重 | 重复计算 | 改用 CTE 物化 |

### 8.4 大数据量处理技巧

```sql
-- 分批处理（避免锁表/超时）
SELECT * FROM fact_transaction
WHERE trans_id > 0
ORDER BY trans_id
LIMIT 10000 OFFSET 0;

-- 使用临时表存储中间结果
CREATE TEMPORARY TABLE tmp_daily_agg AS
SELECT trans_date, SUM(amount) AS total
FROM fact_transaction
WHERE trans_date >= '2024-01-01'
GROUP BY trans_date;

-- 分区表（按日期分区）
ALTER TABLE fact_transaction 
PARTITION BY RANGE (TO_DAYS(trans_date)) (
    PARTITION p202401 VALUES LESS THAN (TO_DAYS('2024-02-01')),
    PARTITION p202402 VALUES LESS THAN (TO_DAYS('2024-03-01')),
    PARTITION p202403 VALUES LESS THAN (TO_DAYS('2024-04-01'))
);
```

---

## 九、学习资料清单

### 9.1 必读书籍

| 书名 | 推荐理由 | 难度 |
|------|----------|------|
| 《SQL必知必会》(第5版) | 入门圣经，2天通读 | ⭐ |
| 《SQL基础教程》MICK | 日本人写的，循序渐进 | ⭐⭐ |
| 《高性能MySQL》(第4版) | 生产级优化必读 | ⭐⭐⭐⭐ |
| 《SQL反模式》 | 避坑指南 | ⭐⭐⭐ |
| 《数据密集型应用系统设计》| 进阶必读，理解数据系统全貌 | ⭐⭐⭐⭐ |

### 9.2 在线学习平台

| 平台 | 适合内容 | 地址 |
|------|----------|------|
| 牛客网 | SQL 实战（有金融题） | nowcoder.com |
| LeetCode | 数据库专项练习 | leetcode.cn |
| HackerRank | SQL 闯关 | hackerrank.com |
| SQLZoo | 交互式学习 | sqlzoo.net |
| W3Schools | 语法速查 | w3schools.com |
| Mode Analytics | 带商业案例的 SQL 教程 | mode.com/sql-tutorial |

### 9.3 金融数据源（实战用）

| 数据源 | 说明 |
|--------|------|
| Tushare | A股/基金/期货数据接口（Python+SQL） |
| Wind 万得 | 金融终端（高校通常有免费版） |
| 聚宽 JoinQuant | 量化平台，自带金融数据 |
| Yahoo Finance | 美股历史数据 |
| 中国人民银行官网 | 利率、汇率、宏观数据 |

### 9.4 推荐关注的公众号/社区

- **数据管道**：SQL 和数据分析实战
- **俊红的数据分析之路**：结合金融场景
- **CSDN SQL 专区**：问题解答
- **知乎 SQL 话题**：深度文章

---

## 十、常用公式速查表

### 10.1 收益率计算

| 指标 | 公式 | SQL 实现 |
|------|------|----------|
| 简单收益率 | `(P_t - P_{t-1}) / P_{t-1}` | `(unit_nav - LAG(unit_nav) OVER(ORDER BY dt)) / LAG(unit_nav) OVER(ORDER BY dt)` |
| 对数收益率 | `ln(P_t / P_{t-1})` | `LN(unit_nav / LAG(unit_nav) OVER(ORDER BY dt))` |
| 累计收益率 | `(P_t - P_0) / P_0` | `(LAST_VALUE(unit_nav) - FIRST_VALUE(unit_nav)) / FIRST_VALUE(unit_nav)` |
| 年化收益率 | `(1+R_total)^(252/n) - 1` | 见文中案例 |

### 10.2 风险指标

| 指标 | 公式 | SQL 实现 |
|------|------|----------|
| 波动率（年化） | `σ_daily × √252` | `STDDEV(daily_return) * SQRT(252)` |
| 夏普比率 | `(R_p - R_f) / σ_p` | 见 §7.2 |
| 最大回撤 | `min((P_t - max_{0≤s≤t} P_s) / max_{0≤s≤t} P_s)` | 见 §5.3 案例7 |
| VaR(95%) | 收益率分布的第5百分位数 | `PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY daily_return)` |
| 贝塔 β | `Cov(R_p, R_m) / Var(R_m)` | 需与基准指数联表计算 |

### 10.3 业务分析指标

| 指标 | SQL 实现思路 |
|------|-------------|
| 客户留存率 | 当月有交易 ∩ 上月有交易 / 上月有交易 |
| ARPU | `SUM(amount) / COUNT(DISTINCT user)` |
| 资金净流入 | `SUM(CASE WHEN 流入 THEN amount ELSE -amount END)` |
| 转化率 | `COUNT(购买)/COUNT(浏览)` |
| 不良贷款率 | `逾期贷款余额 / 总贷款余额` |
| 净息差 NIM | `(利息收入-利息支出) / 生息资产` |

### 10.4 日期计算速查

```sql
-- MySQL
CURDATE()                          -- 今天
DATE_FORMAT(d, '%Y%m%d')          -- 格式化
DATE_ADD(d, INTERVAL 1 MONTH)     -- 加一个月
TIMESTAMPDIFF(DAY, d1, d2)        -- 相差天数
LAST_DAY(d)                        -- 月末
YEARWEEK(d)                        -- 年+周

-- PostgreSQL
CURRENT_DATE
TO_CHAR(d, 'YYYYMMDD')
d + INTERVAL '1 month'
d2 - d1                             -- 直接相减得天数
DATE_TRUNC('month', d) + INTERVAL '1 month - 1 day'  -- 月末
EXTRACT(WEEK FROM d)
```

---

## 十一、实操练习题库

### 初级练习题（第1-4周）

1. 查询2024年1月所有消费类交易，按金额降序排列
2. 统计每个渠道的交易笔数和总金额
3. 找出余额最高的10个客户及其账户数
4. 统计各城市客户数，筛选客户数>100的城市
5. 计算每个客户的平均交易金额

### 中级练习题（第5-8周）

6. 查询每个产品的最新净值及较前一日的涨跌幅
7. 计算每个客户每个月的交易金额季环比增长率
8. 找出连续3个月有小额交易的客户（小额=单笔<100元）
9. 对客户按持仓市值分为5档，统计每档人数和总市值
10. 计算某基金的20日收益率波动率

### 高级练习题（第9-13周）

11. 构建完整 RFM 分群，并输出分群画像统计
12. 计算投资组合的夏普比率和最大回撤（见 §7.2）
13. 构建反洗钱监测报表：日累计超200万或单笔超100万的交易
14. 计算客户留存率矩阵（cohort retention matrix）
15. 写一个全自动日报脚本：交易日报+风险指标日报+客户活跃日报

### 综合大作业（第14-15周）

16. **券商日终报表**：包含交易汇总、持仓分析、风控指标、异常监控四大模块
17. **银行月度经营分析报表**：客户增长、存贷款变动、中间业务收入、不良率、资本充足率
18. **基金业绩归因分析**：将组合收益分解为资产配置贡献+个券选择贡献+交互效应

---

## 附录：学习进度跟踪表

| 周次 | 阶段 | 核心技能 | 检验标准 |
|------|------|----------|----------|
| 1-2 | 基础语法 | SELECT/WHERE/CASE WHEN | 独立写20条查询 |
| 3-4 | 聚合分组 | GROUP BY/HAVING/日期函数 | 写出日报SQL |
| 5-6 | 多表联查 | JOIN/子查询/UNION | 完成客户360画像 |
| 7-8 | 窗口函数 | ROW_NUMBER/LAG/移动平均 | 写出MA均线和回撤SQL |
| 9-10 | CTE+报表 | CTE/复杂嵌套 | 完成留存分析报表 |
| 11-13 | 金融实战 | 风控/投资/营销/监管 | 独立完成4个专题 |
| 14-15 | 优化规范 | 索引/分区/执行计划 | 优化过的SQL跑得更快 |

---

> **最终建议**：每天坚持敲代码，不要只看不写。金融 SQL 的核心在于理解业务+熟练窗口函数。建议用 Tushare 拉真实金融数据建库练习，效果远超模拟数据。

> 本文档版本 v1.0 | 生成日期 2026-05-06
</parameter>
</｜DSML｜inv