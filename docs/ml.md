# 机器学习 系统学习方案 — 标准学习 · G5 全面平衡型

> 本方案基于 **全面平衡型** 学习纹理生成，适合希望在 **14周** 内系统掌握机器学习的理论与实践的学习者。共 **7阶段14周**，包含 **25个知识要点** 和 **18道练习**。

> **核心理念**：均衡是最好的学习策略——不要为了速度牺牲深度，也不必为了细节迷失方向。每个阶段至少融合公式推导+可视化理解+动手实践三种学习方式。

---

## 目录

1. [总体学习路线图](#总体学习路线图)
2. [图解学习法](#图解学习法)
3. [第1阶段：数学基础奠基（第1-2周）](#第1阶段数学基础奠基第1-2周)
4. [第2阶段：机器学习入门（第3-4周）](#第2阶段机器学习入门第3-4周)
5. [第3阶段：线性模型（第5-6周）](#第3阶段线性模型第5-6周)
6. [第4阶段：非线性模型（第7-8周）](#第4阶段非线性模型第7-8周)
7. [第5阶段：集成学习（第9-10周）](#第5阶段集成学习第9-10周)
8. [第6阶段：实战整合（第11-12周）](#第6阶段实战整合第11-12周)
9. [第7阶段：深度学习入门（第13-14周）](#第7阶段深度学习入门第13-14周)
10. [核心公式与概念速查表](#核心公式与概念速查表)
11. [实操练习题库](#实操练习题库)
12. [学习资料清单](#学习资料清单)
13. [学习进度检查清单](#学习进度检查清单)

---

## 总体学习路线图

### 学习目标

1. 掌握机器学习的三大数学支柱：线性代数、概率统计、优化理论
2. 深入理解核心算法原理并能手动推导关键公式
3. 具备 Python 编程实现经典模型的能力（NumPy + Scikit-learn）
4. 理解模型评估、选择与调优的系统方法论
5. 入门深度学习并建立从经典ML到现代DL的知识桥梁

### 路线图总览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         机器学习 14周学习路线图 (G5 平衡型)                      │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│第 1-2 周│第 3-4 周│第 5-6 周│第 7-8 周│第 9-10 周│第11-12 周│第13-14 周│
│ 数学基础  │ ML 入门  │ 线性模型  │ 非线性模型│ 集成学习  │ 实战整合  │深度学习入门│
│   2周    │   2周    │   2周    │   2周    │   2周    │   2周    │   2周    │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│·线性代数  │·ML概览   │·线性回归  │·SVM推导  │·Bagging  │·模型调优  │·神经网络  │
│·概率统计  │·梯度下降  │·逻辑回归  │·决策树   │·Boosting │·特征工程  │·反向传播  │
│·微积分    │·过拟合    │·正则化    │·核方法   │·随机森林  │·交叉验证  │·CNN/RNN  │
│·NumPy    │·模型评估  │·GLM      │·贝叶斯   │·XGBoost  │·Kaggle项目│·Transformer│
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

### 标注说明

| 标注 | 含义 |
|------|------|
| 📐 | 关键公式推导 |
| 📊 | 可视化理解 |
| 💻 | 代码实践 |
| 💡 | 核心概念/直觉 |
| ⚠️ | 常见误区 |

---

## 图解学习法

作为全面平衡型学习方案，采用三层递进的学习方法：

### 三层学习法

```
Layer 1: 直觉理解  →  一图胜千言——画出模型的数据流和决策面
        ↓
Layer 2: 公式推导  →  关键公式动手推演——理解数学本质
        ↓
Layer 3: 代码验证  →  用NumPy/scikit-learn实现——检验理解
```

### 必画核心图解清单

| 图表名称 | 所属阶段 | 关键表达 |
|----------|----------|----------|
| 梯度下降轨迹图 | P2 | 损失曲面+不同学习率路径对比 |
| 偏差-方差权衡曲线 | P2 | Total Error = Bias² + Variance + Noise |
| 正则化几何解释 | P3 | L1菱形 vs L2圆形 与等高线交点 |
| SVM最大间隔示意图 | P4 | 支持向量+超平面+间隔边界 |
| Bagging vs Boosting对比 | P5 | 并行投票vs串行残差拟合 |
| 学习曲线诊断图 | P6 | train/cv gap诊断过拟合/欠拟合 |
| 全连接网络结构图 | P7 | 输入→隐藏→输出+激活函数标注 |

---

## 第1阶段：数学基础奠基（第1-2周，共2周）

📌 **阶段目标**：建立机器学习的数学语言体系——线性代数的矩阵运算、概率统计的分布推断、微积分的链式求导，三者构成机器学习的地基。

### 🔑 核心知识点

- 📐 **线性代数为ML而生**：向量空间→矩阵乘法→特征值与特征向量。重点：PCA推导中协方差矩阵的特征分解 `Σ = VΛVᵀ`。几何直觉：SVD=旋转×缩放×旋转。
- 📐 **概率论的ML视角**：贝叶斯定理 `P(θ|D)∝P(D|θ)P(θ)`、MLE vs MAP 的对立统一。推导"为什么MSE损失等价于高斯误差的极大似然"。
- 📐 **微积分：梯度即方向**：链式法则 `∂f/∂x = ∂f/∂g · ∂g/∂x` 是反向传播的前身。Jacobian矩阵追踪维度变化。
- 💡 **ML的数学框架**：理解ML本质=在三根支柱上搭建——线性代数（数据表示）、概率论（不确定性建模）、优化（从数据到决策）。

### 📊 关键图示

```
  PCA降维几何解释
                        ↙ 主成分 PC1（方差最大方向）
    ·  ·  ·              ·
      ·    ·        →     ·  ·  ·  （从二维投影到一维）
    ·      ·
  原始数据            降维结果

  贝叶斯更新示意
  Prior P(θ) ──→ Posterior P(θ|D)
                    ↑
              Likelihood P(D|θ)
  先验信念 + 观测数据 = 更新后的信念
```

### 💻 代码示例

```python
import numpy as np
# SVD 分解验证：任意矩阵 = U @ Σ @ Vᵀ
A = np.random.randn(4, 3)
U, S, Vt = np.linalg.svd(A, full_matrices=False)
reconstructed = U @ np.diag(S) @ Vt
assert np.allclose(A, reconstructed)

# PCA 手写实现
def pca(X, k):
    X_centered = X - X.mean(axis=0)
    cov = (X_centered.T @ X_centered) / (len(X) - 1)
    eigenvalues, eigenvectors = np.linalg.eigh(cov)
    top_k = eigenvectors[:, -k:]  # 取最大的k个特征值对应的特征向量
    return X_centered @ top_k
```

### 📐 关键公式

| 公式 | 含义 |
|------|------|
| A = UΣVᵀ | SVD分解：任意矩阵=旋转×缩放×旋转 |
| Σ = (1/n)XᵀX = VΛVᵀ | 协方差矩阵的特征分解→PCA |
| P(θ\|D) = P(D\|θ)P(θ)/P(D) | 贝叶斯定理：后验∝似然×先验 |
| ∂L/∂x = ∂L/∂g · ∂g/∂x | 链式法则：反向传播的数学前身 |

---

## 第2阶段：机器学习入门（第3-4周，共2周）

📌 **阶段目标**：理解什么是"从数据中学习"，掌握梯度下降的推导与实现，建立过拟合/欠拟合的诊断直觉，学会模型评估的正确姿势。

### 🔑 核心知识点

- 📐 **梯度下降全推导**：从一阶泰勒展开 `f(θ_t+Δθ)≈f(θ_t)+∇fᵀΔθ` → 令 Δθ=−α∇f → `θ_{t+1}=θ_t−α∇J(θ_t)`。对比批量梯度下降(BGD)、随机梯度下降(SGD)、小批量(Mini-batch)的方差-收敛速度权衡。
- 💡 **偏差-方差分解**：推导 `E[(y−f̂)²]=Bias²+Variance+σ²`，理解为什么"复杂模型=低偏差高方差，简单模型=高偏差低方差"。
- ⚠️ **过拟合的识别与防御**：通过学习曲线(train/cv gap)诊断。正则化、早停、数据增强、Dropout——四种防过拟合武器的适用场景对比。
- 💻 **第一个ML流水线**：数据加载→探索性分析(EDA)→训练/测试划分→模型训练→评估(Accuracy/F1/RMSE)→可视化预测结果。

### 📊 关键图示

```
  梯度下降轨迹
  Loss
  │ ╲              学习率 α=0.1 → 稳定收敛
  │  ╲____
  │       ╲──        α=0.5 → 震荡收敛
  │           ╲╱╲
  │              ╲   α=1.0 → 发散!
  └────────────────→ Iterations

  偏差-方差权衡
  Error
  │              ╱
  │  Bias²     ╱  Total
  │   ╲       ╱
  │    ╲     ╱
  │     ╲   ╱  Variance
  └──────────────→ Model Complexity
      最优复杂度 ↑
```

### 💻 代码示例

```python
import numpy as np

# 梯度下降——从零实现
def gradient_descent(X, y, lr=0.01, epochs=1000):
    m, n = X.shape
    theta = np.zeros(n)
    for epoch in range(epochs):
        grad = (1/m) * X.T @ (X @ theta - y)
        theta -= lr * grad
    return theta

# 偏差-方差分解实验
def bias_variance_decomp(model_factory, X_train, y_train, X_test, n_repeats=100):
    preds = np.zeros((n_repeats, len(X_test)))
    for i in range(n_repeats):
        model = model_factory()
        model.fit(X_train, y_train)
        preds[i] = model.predict(X_test)
    avg_pred = preds.mean(axis=0)
    bias_sq = np.mean((avg_pred - y_test_true)**2)
    variance = np.mean(np.var(preds, axis=0))
    return bias_sq, variance
```

### 📐 关键公式

| 公式 | 含义 |
|------|------|
| θ_{t+1} = θ_t − α∇J(θ_t) | 梯度下降更新：沿负梯度方向走一步 |
| E[(y−f̂)²] = Bias² + Var + σ² | 误差三来源分解：偏差+方差+噪声 |
| J_{reg}(θ) = MSE(θ) + λR(θ) | 正则化损失=数据拟合+惩罚复杂度 |

---

## 第3阶段：线性模型（第5-6周，共2周）

📌 **阶段目标**：掌握监督学习的核心——线性模型族。从最小二乘到逻辑回归，从L1稀疏到L2收缩，理解正则化的贝叶斯本质。

### 🔑 核心知识点

- 📐 **线性回归四种推导视角**：代数导（令梯度=0→正规方程）、几何导（y在col(X)投影→H=X(XᵀX)⁻¹Xᵀ）、概率导（高斯误差MLE→MSE）、优化导（凸函数梯度为0全局最优）。
- 📐 **逻辑回归与GLM**：推导伯努利分布→指数族形式→规范链接函数logit→Sigmoid不是"设计出来的"而是"指数族推导出来的"。交叉熵 `J=−[y log h+(1−y)log(1−h)]` = 负对数似然。
- 📐 **正则化的贝叶斯解释**：高斯先验→L2(Ridge)→参数收缩但不稀疏；拉普拉斯先验→L1(Lasso)→菱形约束→坐标轴交点→稀疏解。
- 💻 **Scikit-learn实践**：LinearRegression vs Ridge vs Lasso 在真实数据集上的系数路径对比。

### 📊 关键图示

```
  L1(Lasso) vs L2(Ridge) 几何解释
    β₂                     β₂
    │  ◇ ←L1              │  ○ ←L2
    │  ·╲                 │  ·╲
    │ ·  ╲←交点=稀疏    │ ·  ╲←交点=非稀疏
    │·    ╲               │·    ╲
    └───────β₁           └───────β₁
  L1使参数在坐标轴上=零     L2使参数近似但非零

  Sigmoid函数与决策边界
  1.0│    ╭────╮
     │   ╱      ╲
  0.5│——╱        ╲—— ← P(y=1)=0.5 决策边界
     │ ╱          ╲
  0.0│╱            ╲
     └────────────────→ z=θᵀx
```

### 💻 代码示例

```python
from sklearn.linear_model import LinearRegression, Ridge, Lasso, LogisticRegression
from sklearn.model_selection import cross_val_score
import numpy as np

# 对比三种线性模型的系数
def compare_coefs(X, y, alphas=[0.1, 1.0, 10.0]):
    ols = LinearRegression().fit(X, y)
    print(f"OLS coefs:     {ols.coef_}")
    for a in alphas:
        ridge = Ridge(alpha=a).fit(X, y)
        lasso = Lasso(alpha=a, max_iter=5000).fit(X, y)
        print(f"Ridge(α={a}):  {ridge.coef_}")
        print(f"Lasso(α={a}):  {lasso.coef_}")
        print(f"  Lasso 零系数: {np.sum(np.abs(lasso.coef_) < 1e-6)}")

# 逻辑回归——手写Sigmoid验证
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# 用Scikit-learn做5折交叉验证
def evaluate_model(model, X, y):
    scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
    return scores.mean(), scores.std()
```

### 📐 关键公式

| 公式 | 含义 |
|------|------|
| θ̂ = (XᵀX)⁻¹Xᵀy | OLS闭式解：正规方程求解 |
| h_θ(x) = 1/(1+e^(−θᵀx)) | Sigmoid假设函数：线性→概率 |
| J_{L1} = MSE + λ‖θ‖₁ | Lasso：拉普拉斯先验→稀疏解 |
| θ̂_{Ridge} = (XᵀX+λI)⁻¹Xᵀy | Ridge：高斯先验→收缩但不为零 |

---

## 第4阶段：非线性模型（第7-8周，共2周）

📌 **阶段目标**：掌握非线性分类与建模方法——SVM的核技巧之美、决策树的贪心分裂、贝叶斯方法的概率建模。理解从线性到非线性的演进逻辑。

### 🔑 核心知识点

- 📐 **SVM完整推导**：硬间隔 `min ½‖w‖² s.t. y_i(wᵀx_i+b)≥1` → 拉格朗日对偶 → `max Σα_i−½Σα_iα_j y_i y_j ⟨x_i,x_j⟩`。软间隔引入松弛变量ξ_i→对偶唯一变化：`0≤α_i≤C`。支持向量的本质：只有α_i>0的样本影响决策边界。
- 💡 **核方法与Mercer定理**：`K(x,z)=⟨φ(x),φ(z)⟩`→在原始空间计算内积=高维空间线性分类。RBF核 `exp(−γ‖x−z‖²)` 展开→无穷维特征空间！Mercer定理：Gram矩阵半正定⇔合法核。
- 📐 **决策树与信息论**：信息熵 `H=−Σp_k log₂ p_k`→信息增益→选择IG最大的特征分裂。CART用基尼系数 `G=1−Σp_k²` 替代熵计算。
- 💡 **朴素贝叶斯**：条件独立假设(几乎从不成立但work)→`P(y|x)∝P(y)∏P(x_j|y)`。关键理解：分类只需要后验排序正确，不需要概率值精确。

### 📊 关键图示

```
  SVM核函数映射
  原始空间(不可分)      RBF核映射后(可分)
       ○ △ ○         ○○           △△
     △     ○  △  →   ○ ○    |    △ △
       △ ○ △         ○○   分隔超平面  △△
                              │
  决策树分裂示意
           [根: 收入>50K?]
           ╱             ╲
       [是]              [否]
       ╱  ╲             ╱  ╲
  [高信用] [中信用]  [年龄] [拒贷]
                   IG=0.72
```

### 💻 代码示例

```python
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.naive_bayes import GaussianNB
import matplotlib.pyplot as plt

# SVM不同核函数效果对比
for kernel in ['linear', 'poly', 'rbf']:
    svm = SVC(kernel=kernel, C=1.0).fit(X_train, y_train)
    acc = svm.score(X_test, y_test)
    print(f"SVM({kernel}): accuracy={acc:.3f}, #SV={len(svm.support_)}")

# 决策树可视化
tree = DecisionTreeClassifier(max_depth=3).fit(X, y)
plt.figure(figsize=(12, 6))
plot_tree(tree, feature_names=feature_names, filled=True)
plt.show()
```

### 📐 关键公式

| 公式 | 含义 |
|------|------|
| min ½‖w‖² s.t. y_i(wᵀx_i+b)≥1 | 硬间隔SVM原问题：最大化间隔 |
| max Σα_i−½Σα_iα_j y_i y_j K(x_i,x_j) | SVM对偶问题+核技巧 |
| H = −Σ p(x)log₂ p(x) | 信息熵：不确定性的度量 |
| IG(A) = H(D) − Σ(\|D_v\|/\|D\|)H(D_v) | 信息增益：分裂带来信息量 |
| P(y\|x) ∝ P(y)∏P(x_j\|y) | 朴素贝叶斯：条件独立假设 |

---

## 第5阶段：集成学习（第9-10周，共2周）

📌 **阶段目标**：掌握将弱学习器组合成强学习器的艺术——Bagging降方差、Boosting降偏差。深入理解随机森林的去相关性机制和XGBoost的二阶优化精要。

### 🔑 核心知识点

- 📐 **Bagging vs Boosting 数学对比**：Bagging并行独立训练B棵树→`Var[f̄]=ρσ²+(1−ρ)σ²/B`→B↑→Var↓但Bias不变→适合高方差低偏差模型。Boosting串行拟合残差→降低偏差但方差递增→需要早停或正则化。
- 📐 **随机森林去相关**：每个分裂只随机考虑 `m=√p` 个特征→降低树之间相关性ρ→进一步降低方差。核心公式：`Var[RF] = ρσ²/m + (1−ρ)σ²`。
- 📐 **XGBoost二阶推导**：加法模型 `ŷ_i^(t)=ŷ_i^(t−1)+f_t(x_i)` → 二阶泰勒展开 `L̂≈Σ[l(y,ŷ^(t−1))+g_i f_t+(1/2)h_i f_t²]+Ω(f_t)` → 令∂L̂/∂w_j=0 → `w_j*=−Σg_i/(Σh_i+λ)` 叶子权重闭式解！这是GBDT的精髓进化。
- 💻 **实战对比**：用RandomForest、AdaBoost、GradientBoosting、XGBoost在相同数据集上对比精度和速度。

### 📊 关键图示

```
  Bagging (并行→降方差)              Boosting (串行→降偏差)
     Tree₁ Tree₂ ... Tree_n          Tree₁ → Tree₂ → ... → Tree_n
       │     │         │               ↓       ↓            ↓
       └─────┴─────────┘            残差₁   残差₂        残差ₙ
              ↓ Vote            F₁(x)→F₂(x)→...→F_n(x)
           最终预测

  随机森林特征随机性示意
  全部p=100个特征 → 每分裂随机选m=√100=10个特征 → 树之间相关度降低
     Tree₁: [f1,f7,f22,...]    Tree₂: [f3,f15,f89,...]    Tree₃: [f2,f41,f67,...]
                    ↑ 10个随机特征/分裂 ↑ → 多样性 = 更低的方差!
```

### 💻 代码示例

```python
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
import time

models = {
    "RandomForest": RandomForestClassifier(n_estimators=100),
    "GradientBoost": GradientBoostingClassifier(n_estimators=100),
    "XGBoost": XGBClassifier(n_estimators=100, use_label_encoder=False)
}

for name, model in models.items():
    t0 = time.time()
    model.fit(X_train, y_train)
    acc = model.score(X_test, y_test)
    elapsed = time.time() - t0
    print(f"{name}: acc={acc:.3f}, time={elapsed:.2f}s")

# 特征重要性对比
for name, model in models.items():
    importance = model.feature_importances_[:5]
    top5_idx = np.argsort(importance)[-5:]
    print(f"\n{name} Top5 features:")
    for idx in top5_idx:
        print(f"  {feature_names[idx]}: {importance[idx]:.4f}")
```

### 📐 关键公式

| 公式 | 含义 |
|------|------|
| Var[f̄_Bag] = ρσ² + (1−ρ)σ²/B | Bagging方差分析：B↑方差↓ |
| F_m(x) = F_{m−1}(x) + η·h_m(x) | Boosting递推：串行残差拟合 |
| w_j* = −Σg_i/(Σh_i+λ) | XGBoost叶子最优权重（二阶推导闭式解） |
| Gain = ½[(Σg_L)²/(Σh_L+λ)+(Σg_R)²/(Σh_R+λ)−(Σg)²/(Σh+λ)]−γ | XGBoost分裂增益计算 |

---

## 第6阶段：实战整合（第11-12周，共2周）

📌 **阶段目标**：将所有知识整合为一个完整的ML实践流水线——特征工程、交叉验证、超参调优、模型选择。完成端到端Kaggle项目，建立工业级ML实践能力。

### 🔑 核心知识点

- 📊 **特征工程方法论**：缺失值处理（均值填充/模型预测/插值）、类别编码（One-Hot/Label/Ordinal/Target Encoding）、特征缩放（Standardization/Normalization）、特征构造（多项式交叉/比率/时间窗口）。
- 📐 **交叉验证策略**：k-fold 的本质——数据重复划分训练/验证集→无偏估计泛化误差。留一法(LOOCV)→无偏但高方差；5/10-fold→偏差-方差的Goldilocks折中。
- ⚠️ **超参调优对比**：Grid Search(穷举O(dⁿ))/Random Search(随机采样O(n))/Bayesian Optimization(高斯过程代理+采集函数)。在高维超参空间中，随机搜索远优于网格搜索（Bergstra & Bengio 2012）。
- 💡 **模型选择框架**：从简单到复杂依次尝试：Baseline(均值/Dummy)→线性模型→树模型→集成→(可选)神经网络。每步记录性能、训练时间、可解释性。

### 📊 关键图示

```
  k-fold Cross Validation 示意 (k=5)
    ┌─────┬─────┬─────┬─────┬─────┐
    │Fold1│Fold2│Fold3│Fold4│Fold5│
    ┌─────┬─────┬─────┬─────┬─────┐
   Iter1: Train │ Val                         → E_val₁
   Iter2:     Train │ Val                     → E_val₂
   ...
   CV Error = (E_val₁ + ... + E_val₅) / 5

  超参调优策略效率对比
  性能
  │                ╱ Bayesian Opt(智能探索)
  │               ╱
  │              ╱
  │  ────────────  Random Search
  │ ╱
  │╱  Grid Search(穷举, O(dⁿ))
  └────────────────────→ 迭代次数
```

### 💻 代码示例

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier

# 完整的ML流水线
numeric_features = ['age', 'income', 'credit_score']
categorical_features = ['education', 'occupation']

preprocessor = ColumnTransformer([
    ('num', StandardScaler(), numeric_features),
    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

# 贝叶斯优化（optuna库）
import optuna
def objective(trial):
    n_estimators = trial.suggest_int('n_estimators', 50, 500)
    max_depth = trial.suggest_int('max_depth', 3, 20)
    min_samples_split = trial.suggest_int('min_samples_split', 2, 20)
    
    model = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        min_samples_split=min_samples_split
    )
    return cross_val_score(model, X, y, cv=5).mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=50)
print(f"Best params: {study.best_params}")
```

---

## 第7阶段：深度学习入门（第13-14周，共2周）

📌 **阶段目标**：建立从经典ML到深度学习的知识桥梁。理解神经网络如何推广线性模型、掌握反向传播的计算图推导、了解CNN/RNN/Transformer的核心创新点，为后续深入学习打下基础。

### 🔑 核心知识点

- 💡 **从浅层到深层**：单隐藏层NN已经通过万能逼近定理证明有能力逼近任意连续函数。深层网络的核心优势在**参数效率**——浅层需要指数级神经元逼近某函数，深层只需多项式级。
- 📐 **反向传播完整推导**：前向 `a^(l)=σ(W^(l)a^(l−1)+b^(l))` → 计算Loss → 反向：`δ^(L)=∇_a J⊙σ'(z^(L))` → `δ^(l)=(W^(l+1))ᵀδ^(l+1)⊙σ'(z^(l))` → `∂L/∂W^(l)=δ^(l)(a^(l−1))ᵀ`。本质=从最终输出逐层"归因"每参数的贡献。
- 💡 **CNN/RNN/Transformer核心创新**：CNN=局部感受野+权值共享→空间不变性；RNN=循环连接→序列记忆→信息传播矩阵→梯度消失/爆炸；Transformer=Self-Attention `Attention(Q,K,V)=softmax(QKᵀ/√d_k)V` → 全局依赖无距离衰减。

### 📊 关键图示

```
  ML→DL演进脉络
  线性模型 → 广义线性 → 浅层NN → 深层NN → CNN/RNN/Transformer
     └─经典机器学习────────┘   └────── 深度学习 ──────────┘
     SVM/树/贝叶斯/集成  (非线性替代路线)
                             ↓
  神经网络核心 = 矩阵乘法 + 非线性激活 + 链式求导

  反向传播计算图（以2→3→1网络为例）
  x → z^(1) → a^(1) → z^(2) → a^(2) → Loss
       ↑W^(1)    ↑σ       ↑W^(2)   ↑σ
   ←—— ∂L/∂z^(1) ←—— δ^(1) ←—— ∂L/∂z^(2) ←—— δ^(2)
       ∂L/∂W^(1)                   ∂L/∂W^(2)
  误差从输出层反向流动，每层乘以权重矩阵的转置×激活函数的导数
```

### 💻 代码示例

```python
import torch
import torch.nn as nn

# PyTorch 实现简单MLP
class SimpleMLP(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, output_dim)
        )
    
    def forward(self, x):
        return self.net(x)

# 手写反向传播（2→3→1 网络）——验证与PyTorch一致
def manual_forward(x, W1, b1, W2, b2):
    z1 = W1 @ x + b1       # (3,1)
    a1 = torch.sigmoid(z1)  # (3,1)
    z2 = W2 @ a1 + b2       # (1,1)
    a2 = torch.sigmoid(z2)  # (1,1)
    loss = (a2 - y)**2
    return loss, (z1, a1, z2, a2)

model = SimpleMLP(input_dim=10, hidden_dim=64, output_dim=2)
x = torch.randn(32, 10)      # batch_size=32
y_pred = model(x)            # 自动前向+计算图
print(f"Output shape: {y_pred.shape}")  # (32, 2)
```

### 📐 关键公式

| 公式 | 含义 |
|------|------|
| a^(l) = σ(W^(l)a^(l−1)+b^(l)) | 前向传播：逐层线性变换+非线性激活 |
| δ^(L) = ∇_a J ⊙ σ'(z^(L)) | 输出层误差（反向传播起点） |
| δ^(l) = (W^(l+1))ᵀδ^(l+1) ⊙ σ'(z^(l)) | 隐藏层误差：反向递推公式 |
| ∂L/∂W^(l) = δ^(l)(a^(l−1))ᵀ | 权重梯度：当前层误差×上层激活 |
| Attention(Q,K,V)=softmax(QKᵀ/√d_k)V | Self-Attention：查询×键→相似度→加权值 |

---

## 核心公式与概念速查表

### 表1：线性模型与优化

| 概念 | 公式 | 核心洞察 |
|------|------|----------|
| OLS闭式解 | `θ̂ = (XᵀX)⁻¹Xᵀy` | 几何意义：y在col(X)上的投影 |
| 梯度下降 | `θ := θ − α∇J(θ)` | 学习率α是唯一超参，α太大发散太小慢收敛 |
| 交叉熵损失 | `J = −Σ[y·log(h)+(1−y)·log(1−h)]` | 等价于伯努利分布的负对数似然 |
| L1正则(Lasso) | `J + λ‖θ‖₁` | 拉普拉斯先验→菱形约束→稀疏解 |
| L2正则(Ridge) | `J + (λ/2)‖θ‖₂²` | 高斯先验→圆形约束→收缩但不为零 |
| R²决定系数 | `R² = 1 − SS_res/SS_tot` | 模型解释的方差比例，越接近1越好 |

### 表2：非线性模型与集成

| 概念 | 公式 | 核心洞察 |
|------|------|----------|
| Sigmoid | `σ(z) = 1/(1+e^(−z))` | 不是设计的，是从伯努利指数族推导的 |
| SVM对偶 | `max Σα_i − ½Σα_iα_j y_iy_jK(x_i,x_j)` | 只有α>0的支持向量影响决策边界 |
| RBF核 | `K(x,z) = exp(−γ‖x−z‖²)` | 对应无穷维特征空间！γ控"相似度衰减半径" |
| 信息熵 | `H = −Σp_k log₂ p_k` | 均匀分布最大熵(=最不确定)，确定=0 |
| Bagging方差 | `Var[f̄] = ρσ² + (1−ρ)σ²/B` | 增加B棵子树=降低方差，ρ越小降越多 |
| XGBoost叶子权重 | `w_j* = −Σg_i/(Σh_i+λ)` | 来自二阶泰勒展开令导数为0 |
| 偏差-方差 | `E[(y−f̂)²] = Bias² + Var + σ²` | ML最重要的恒等式：误差=偏差²+方差+噪声 |

### 表3：深度学习基础

| 概念 | 公式 | 核心洞察 |
|------|------|----------|
| 前向传播 | `a^(l) = σ(W^(l)a^(l−1)+b^(l))` | 逐层：矩阵乘+偏置+激活 |
| 输出层误差 | `δ^(L) = ∇_a J ⊙ σ'(z^(L))` | 反向传播的起点——损失对输出的梯度 |
| 隐藏层BP | `δ^(l) = (W^(l+1))ᵀδ^(l+1) ⊙ σ'(z^(l))` | 误差反向流动×权重转置×激活导数 |
| 权重梯度 | `∂L/∂W^(l) = δ^(l)(a^(l−1))ᵀ` | 梯度=外层积：当前误差×上层激活 |
| Self-Attention | `Attention = softmax(QKᵀ/√d_k)V` | 查询和键的相似度→加权聚合→无距离衰减 |
| 万能逼近定理 | `∀f,∃NN: \|f−NN\| < ε` | 存在性≠可学习性→深层优势在参数效率 |

---

## 实操练习题库

> 难度分布：🟢 基础 5题 | 🟡 进阶 6题 | 🔴 挑战 4题 | 📦 项目 3题

### 🟢 基础题

1. **梯度下降实战**：在二维函数 `f(x,y)=x²+2y²` 上实现梯度下降，对比不同学习率的收敛轨迹，叠加等高线画路径图。

2. **MLE推导与验证**：假设数据来自正态分布 N(μ,σ²)，从MLE推导μ̂和σ̂²。用numpy验证推导结果。

3. **正则化效果对比**：用OLS、Ridge(λ=0.1,1,10)、Lasso(λ=0.1,1,10)在同一数据集上对比系数变化与预测误差。

4. **决策树手动分裂**：对10个样本小数据集，手算每个分裂点的信息增益，画完整决策树，与sklearn结果对照。

5. **偏差-方差分解实验**：多项式回归(degree=1,3,10,20)拟合sin(x)+noise，重复100次从实验中分解Bias²、Var、Noise。

### 🟡 进阶题

6. **SVM对偶推导**：从硬间隔SVM原问题→拉格朗日函数→KKT条件→对偶问题→互补松弛验证。用5个点手算。

7. **朴素贝叶斯从零实现**：用numpy实现高斯朴素贝叶斯，在iris上测试，手算一个样本的各类后验概率。

8. **XGBoost目标函数推导**：加性模型→二阶泰勒展开→最优叶子权重闭式解，小例子数值验证。

9. **LASSO系数路径**：实现坐标下降法求解LASSO，画不同λ的系数路径图，观察特征被压缩到零的顺序。

10. **核函数构造验证**：自定义核函数 K(x,z)=(xᵀz+1)²，验证Gram矩阵半正定性，在非线性数据上测试核SVM。

11. **集成模型全方位对比**：RandomForest vs AdaBoost vs GBDT vs XGBoost vs LightGBM 在相同数据上的精度/速度/特征重要性三元对比。

### 🔴 挑战题

12. **拉格朗日对偶与SVM**：证明强对偶(Slater条件验证)，推导支持向量满足的KKT条件，证明只有SV影响决策面。

13. **反向传播手推**：两层全连接网络(2→3→1)，手写前向→损失→反向推导全过程，标注矩阵维度，与PyTorch自动求导对比。

14. **自定义损失函数推导**：从指数族分布出发推导一个新的损失函数(如Huber loss、Focal loss的数学形式)，理解"损失函数=假设分布的负对数似然"。

15. **实现Mini-batch SGD收敛分析**：在不同batch size(1,16,64,256,全量)下训练，画收敛曲线+训练时间对比，验证batch size的方差-效率权衡。

### 📦 项目题

16. **Kaggle入门赛**：Titanic或House Prices→完整流水线(EDA→特征工程→4+模型对比→超参调优→集成→Kaggle提交)。报告必须推导至少一个模型的核心公式。

17. **Kaggle进阶赛**：选择一个结构化数据比赛(如Telco Customer Churn/Hotel Booking Cancellation)→自动化特征工程→模型Stacking→最终精度提升→输出一份2页项目报告。

18. **自选项目**：选择一个你感兴趣的真实问题(金融风控/医疗诊断/推荐系统/时间序列预测)——收集数据→建模→调优→部署推理API。这是学习成果的最终检验。

---

## 学习资料清单

### 📚 核心教材

1. **《统计学习方法》(李航, 第2版)** — 中文经典，公式推导密度高，适合中文学者精读。每章一个算法，推导完整。

2. **《The Elements of Statistical Learning》(Hastie, 2009)** — 统计学习圣经，偏统计视角，PDF免费获取。强烈推荐。

3. **《Machine Learning: A Probabilistic Perspective》(Murphy, 2012)** — 概率图模型视角，覆盖面极广，公式推导清晰，适合进阶。

4. **《Pattern Recognition and Machine Learning》(Bishop, 2006)** — ML理论最深处，贝叶斯视角。需要较强数学基础。

5. **《Hands-On Machine Learning》(Géron, 第3版)** — 实操最佳伴侣，TensorFlow/Keras + Scikit-learn双轨，推导完理论的动手验证之选。

### 🎓 在线课程

6. **CS229: Machine Learning (Stanford, Andrew Ng)** — 数学推导最完整的ML课程，作业含大量手推公式题。YouTube免费。

7. **CS229 讲义** — 比视频更精炼的推导版本，Bishop/Murphy教材的课程化浓缩，强烈推荐配合阅读。

8. **Mathematics for Machine Learning (Coursera/Imperial College)** — 三件套专项：线性代数→多变量微积分→PCA。ML数学前置强化利器。

9. **CS229 历年习题集** — 每道题都是完整推导训练。全部做完=对ML的理论理解质变。

### 💻 实践资源

10. **Scikit-learn 官方文档** — 每个算法的User Guide含数学公式说明，源码是推导的最佳验证。

11. **Kaggle Learn** — 免费微课程：Intro to ML、Intermediate ML、Feature Engineering，快速入门。

12. **《Approaching Almost Any ML Problem》(Thakur, 2020)** — 实战方法论的圣经：特征工程/交叉验证/模型选择的工程视角。

13. **Made With ML** — 在线开源项目：端到端ML从设计→开发→部署的完整教程（工业级标准）。

### 🔬 经典论文

14. **"Random Forests"(Breiman, 2001)** — 随机森林原论文，理解Bagging与特征随机性的数学动机。

15. **"XGBoost"(Chen & Guestrin, 2016)** — 梯度提升到XGBoost的优化链路完整推导。

16. **"A Few Useful Things"(Domingos, 2012)** — 十二条ML从业者必读经验法则（偏差-方差/维度灾难/特征为王）。

17. **"ImageNet Classification"(Krizhevsky et al., 2012)** — AlexNet论文，深度学习在CV爆发的里程碑，理解CNN的设计哲学。

---

## 学习进度检查清单

### [ ] 第1阶段：数学基础奠基（第1-2周）
- [ ] 1.1 线性代数复习：矩阵运算→特征分解→SVD→PCA手推完整过程
- [ ] 1.2 概率统计复习：贝叶斯定理→MLE/MAP推导→"为什么MSE=高斯MLE"
- [ ] 1.3 微积分复习：导数→梯度→链式法则→Jacobian维度追踪
- [ ] 1.4 NumPy基础：矩阵运算→广播→向量化→完成数学概念代码化

### [ ] 第2阶段：机器学习入门（第3-4周）
- [ ] 2.1 梯度下降全推导（泰勒展开→更新规则→收敛分析 BGD/SGD/Mini-batch）
- [ ] 2.2 偏差-方差分解推导（MSE三项的数学来源—每个成分的物理意义）
- [ ] 2.3 过拟合诊断（学习曲线→正则化→早停→数据增强→Dropout对比）
- [ ] 2.4 第一个ML流水线（加载→EDA→划分→训练→评估→可视化）
- [ ] 2.5 完成基础练习1-3

### [ ] 第3阶段：线性模型（第5-6周）
- [ ] 3.1 线性回归全视角推导（代数/几何/概率/优化，理解全四条=真正掌握）
- [ ] 3.2 逻辑回归与GLM推导（伯努利→指数族→logit→Sigmoid→交叉熵=负对数似然）
- [ ] 3.3 正则化贝叶斯解释（高斯先验→L2，拉普拉斯→L1，几何直觉L1稀疏原因）
- [ ] 3.4 Scikit-learn实践（对比OLS/Ridge/Lasso系数路径+交叉验证）
- [ ] 3.5 完成进阶练习4-5

### [ ] 第4阶段：非线性模型（第7-8周）
- [ ] 4.1 SVM推导全链路（硬间隔→拉格朗日→对偶→核技巧→软间隔+C控）
- [ ] 4.2 核函数+Mercer定理（Gram半正定⇔合法核，RBF=无穷维！）
- [ ] 4.3 决策树手动分裂+信息论基础（熵/IG/基尼/CART分裂准则→贪心为何最优）
- [ ] 4.4 朴素贝叶斯+GDA（条件独立假设虽不成立但work的原因→GDA=特殊Sigmoid）
- [ ] 4.5 完成进阶练习6-8

### [ ] 第5阶段：集成学习（第9-10周）
- [ ] 5.1 Bagging数学分析（并行训练→方差缩减→随机森林去相关→特征随机性）
- [ ] 5.2 Boosting原理推导（串行拟合残差→偏差递减→GD提升→XGBoost=二阶进化学）
- [ ] 5.3 XGBoost目标闭合推导（加法模型→二阶泰勒展开→叶子权重闭式解→分裂增益）
- [ ] 5.4 集成对比实战（RF/Ada/GBDT/XGBoost四模型在同一数据集的全方位对比）
- [ ] 5.5 完成进阶练习9-11

### [ ] 第6阶段：实战整合（第11-12周）
- [ ] 6.1 特征工程系统方法论（EDA/缺失/编码/缩放/构造——每个技巧的适用场景）
- [ ] 6.2 交叉验证深度理解（k值选择/偏差方差权衡/Stratified vs Time Series CV）
- [ ] 6.3 超参调优三种策略对比（Grid/Random/Bayesian——计算量与效果的数据化对比）
- [ ] 6.4 Kaggle端到端项目（练习16：Titanic/House Prices→流水线→报告→Kaggle提交）
- [ ] 6.5 学习曲线/验证曲线/混淆矩阵/ROC PR曲线——全部画一次

### [ ] 第7阶段：深度学习入门（第13-14周）
- [ ] 7.1 理解NN如何推广线性模型（激活函数必要性→万能逼近定理→深层vs浅层参数效率）
- [ ] 7.2 反向传播手推（2→3→1→正向→损失→反向→每步标注矩阵维度→与PyTorch对照）
- [ ] 7.3 CNN/RNN/Transformer架构差异理解（局部vs序列vs全局依赖→各自优劣）
- [ ] 7.4 PyTorch入门（定义MLP→加载数据→训练循环→验证→TensorBoard监控）
- [ ] 7.5 制定个性化后续学习计划（选方向：NLP/CV/RL/GNN/推荐系统...）

---

> **报告完。**  
> **版本**：learning-plan-generator v2（动态阶段系统 + G5 全面平衡型纹理）  
> **数据来源**：同花顺、东方财富、雪球、证券时报、CS229讲义、Kaggle等公开渠道  
> **声明**：本方案为体系化学习指导，不构成投资建议。股市有风险，入市需谨慎。