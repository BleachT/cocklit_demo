# 量价分解完全教学指南

> 适用项目：车企周边好物商城驾驶舱  
> 面向读者：项目负责人（无需统计学背景）  
> 更新日期：2026-04

---

## 目录

1. [量价分解是什么（通俗解释）](#1-量价分解是什么通俗解释)
2. [数学原理（从最简单讲起）](#2-数学原理从最简单讲起)
3. [在车企商城业务中的应用](#3-在车企商城业务中的应用)
4. [量价分解 + 维度下钻（组合使用）](#4-量价分解--维度下钻组合使用)
5. [量价分解在不同维度的应用](#5-量价分解在不同维度的应用)
6. [六种量价组合情景速查表](#6-六种量价组合情景速查表)
7. [瀑布图的设计规范](#7-瀑布图的设计规范)
8. [常见误区和注意事项](#8-常见误区和注意事项)
9. [结构效应（高级话题）](#9-结构效应高级话题)
10. [量价分解的代码实现](#10-量价分解的代码实现)

---

## 1. 量价分解是什么（通俗解释）

### 1.1 用生活中的例子解释

想象你在菜市场开了一个水果摊，卖苹果。

**上个月**：卖了 100 斤，每斤 5 元，总收入 **500 元**。  
**这个月**：卖了 120 斤，每斤 6 元，总收入 **720 元**。

总收入增加了 **220 元**，但这 220 元是怎么来的？

```
方法一（感觉法）：哦，卖得更多了，价格也涨了，所以收入多了。
方法二（量价分解）：把"多卖了"和"价格涨了"分别算清楚贡献了多少。

──────────────────────────────────────────────────
 量的贡献 = 多卖的数量 × 上月价格
           = (120-100) × 5 = 20斤 × 5元 = +100元

 价的贡献 = 价格涨幅 × 上月数量
           = (6-5) × 100 = 1元 × 100斤 = +100元

 交叉项   = 多卖的数量 × 价格涨幅
           = 20 × 1 = +20元

 合计     = 100 + 100 + 20 = +220元 ✅ 吻合
──────────────────────────────────────────────────
```

现在你能清楚地说：**收入增加 220 元，其中量的增长贡献了 100 元，价格提升贡献了 100 元，另有 20 元是两者共同效应产生的交叉项。**

### 1.2 一句话定义

> **量价分解**，是将一个指标（如销售额）的变动，拆解为"量变化的贡献"和"价变化的贡献"，从而精确回答"是卖多了还是卖贵了"的分析方法。

### 1.3 为什么它是经营分析的核心方法

| 问题 | 不做量价分解 | 做量价分解 |
|------|------------|-----------|
| 销售额下降了 | "卖得不好" | "量降了 15%，价格反而升了 3%，所以根因是销量问题" |
| 毛利增长了 | "盈利能力提升" | "量增长贡献了 80%，单车盈利贡献了 20%，主要靠走量" |
| T3 完成率不达标 | "目标没完成" | "量差了 500 台，但单车收入超目标 2%，问题在产量不足" |

量价分解的三大价值：

```
1. 找根因  ── 是量的问题还是价的问题？
2. 定责任  ── 量→销售/生产团队；价→定价/产品团队
3. 做决策  ── 量不足：加推力（促销/铺货）；价偏低：调价格策略
```

---

## 2. 数学原理（从最简单讲起）

### 2.1 基础公式

设某指标 Revenue = Q × P（数量 × 价格）

**期初**（基准期）：Revenue₀ = Q₀ × P₀  
**期末**（对比期）：Revenue₁ = Q₁ × P₁  
**变化量**：ΔRevenue = Revenue₁ - Revenue₀

展开推导：

```
ΔRevenue = Q₁×P₁ - Q₀×P₀

         = (Q₀+ΔQ) × (P₀+ΔP) - Q₀×P₀

         = Q₀P₀ + Q₀·ΔP + ΔQ·P₀ + ΔQ·ΔP - Q₀P₀

         = Q₀·ΔP + ΔQ·P₀ + ΔQ·ΔP
           ──────   ──────   ──────
           价贡献   量贡献   交叉项
```

**标准公式**：

$$\Delta Revenue = \underbrace{\Delta Q \cdot P_0}_{\text{量贡献}} + \underbrace{\Delta P \cdot Q_0}_{\text{价贡献}} + \underbrace{\Delta Q \cdot \Delta P}_{\text{交叉项}}$$

### 2.2 三项的含义

| 项 | 公式 | 含义 | 直觉解释 |
|----|------|------|---------|
| **量贡献** | ΔQ × P₀ | 在价格不变的前提下，数量变化带来的收入变化 | "如果价格没动，光靠多卖能多赚多少" |
| **价贡献** | ΔP × Q₀ | 在数量不变的前提下，价格变化带来的收入变化 | "如果销量没动，光靠涨价能多赚多少" |
| **交叉项** | ΔQ × ΔP | 数量和价格同时变化产生的额外效应 | "量和价一起动带来的'叠加红利'或'双杀损失'" |

### 2.3 为什么会有交叉项（面积图解释）

用面积图来理解，Revenue = Q × P，就是一个矩形的面积：

```
价格
P₁ │         ┌──────────────┬─────────┐
   │         │              │         │
   │         │   ④ 价贡献   │ ③ 交叉  │
ΔP │         │  ΔP × Q₀    │ ΔQ×ΔP  │
   │         │              │         │
P₀ │─────────┼──────────────┼─────────┤
   │         │              │         │
   │         │   ① 期初     │ ② 量贡献 │
   │         │   Q₀ × P₀   │ ΔQ × P₀ │
   │         │              │         │
   └─────────┴──────────────┴─────────→ 数量
             Q₀            Q₁

① 期初收入 = Q₀ × P₀
② 量贡献   = ΔQ × P₀  （右下角新增面积）
③ 交叉项   = ΔQ × ΔP  （右上角小矩形）
④ 价贡献   = ΔP × Q₀  （左上角新增面积）

期末收入 = ① + ② + ③ + ④
```

**交叉项的直觉**：量增加了 ΔQ，与此同时价格也涨了 ΔP，这多出来的量也能享受到价格上涨的额外收益，这就是交叉项。

### 2.4 交叉项怎么处理（3 种常见方式）

| 处理方式 | 做法 | 适用场景 | 优缺点 |
|---------|------|---------|--------|
| **方式一：单独列出** | 量贡献 + 价贡献 + 交叉项 | 需要精确拆解时（如审计、财务） | ✅ 精确 ❌ 解释成本高 |
| **方式二：归入量** | 量贡献 = ΔQ×P₀ + ΔQ×ΔP = ΔQ×P₁ | 强调"量是主因"时 | ✅ 突出量的变化 ❌ 价贡献被低估 |
| **方式三：归入价** | 价贡献 = ΔP×Q₀ + ΔQ×ΔP = ΔP×Q₁ | 强调"价是主因"时 | ✅ 突出价的变化 ❌ 量贡献被低估 |
| **方式四：均摊（最常用）** | 量贡献 = ΔQ×(P₀+P₁)/2，价贡献 = ΔP×(Q₀+Q₁)/2 | 日常经营分析 | ✅ 平衡 ✅ 无残差 |

> **推荐**：车企商城驾驶舱中使用**方式一（单独列出交叉项）**，让分析结果可解释、可验证。

### 2.5 用具体数字完整计算一遍

**场景**：某月销售额分析

```
基准期（目标）：提车量 Q₀ = 1,000 台，单车收入 P₀ = 50,000 元
对比期（实际）：提车量 Q₁ = 1,100 台，单车收入 P₁ = 52,000 元

─────────────────────────────────────────────────────
Step 1：计算变化量
  ΔQ = Q₁ - Q₀ = 1,100 - 1,000 = +100 台
  ΔP = P₁ - P₀ = 52,000 - 50,000 = +2,000 元

Step 2：计算三项贡献
  量贡献 = ΔQ × P₀ = 100 × 50,000 = +5,000,000 元（+500万）
  价贡献 = ΔP × Q₀ = 2,000 × 1,000 = +2,000,000 元（+200万）
  交叉项 = ΔQ × ΔP = 100 × 2,000 = +200,000 元（+20万）

Step 3：验证
  总变化 = 500 + 200 + 20 = 720 万元
  
  期初销售额 = 1,000 × 50,000 = 5,000 万元
  期末销售额 = 1,100 × 52,000 = 5,720 万元
  实际变化   = 5,720 - 5,000 = 720 万元 ✅ 吻合

Step 4：结论
  销售额增长720万元：
    ├── 量的贡献：+500万（贡献率 69%）← 主要因素
    ├── 价的贡献：+200万（贡献率 28%）
    └── 交叉项：  +20万（贡献率  3%）
─────────────────────────────────────────────────────
```

---

## 3. 在车企商城业务中的应用

### 核心公式体系

```
销售额 = 提车量 × 单车收入
  │         │         │
  │         │         └── 单车收入 = 销售额 / 提车量
  │         └── 量（销量驱动）
  │
  ├── 毛利 = 提车量 × 单车盈利
  │              └── 单车盈利 = 毛利 / 提车量
  │
  ├── 毛利率 = 单车盈利 / 单车收入 = 毛利 / 销售额
  │
  └── T3完成率 = 销售额 / T3目标
```

> **注意**：单车收入和单车盈利都是**派生指标**（由总量/台数计算得出），不是直接采集的值。这对量价分解的理解很重要——"价"其实反映的是平均水平。

### 3.1 销售额的量价分解

**量 = 提车量，价 = 单车收入**

**示例数据**：

| 指标 | 目标（基准期） | 实际（对比期） | 变化 |
|------|-------------|-------------|------|
| 提车量（台） | 2,000 | 1,800 | -200（-10%） |
| 单车收入（元） | 48,000 | 51,000 | +3,000（+6.25%） |
| **销售额（万元）** | **9,600** | **9,180** | **-420（-4.375%）** |

**量价分解计算**：

```
ΔQ = 1,800 - 2,000 = -200 台
ΔP = 51,000 - 48,000 = +3,000 元

量贡献 = ΔQ × P₀ = -200 × 48,000 = -960 万元
价贡献 = ΔP × Q₀ = +3,000 × 2,000 = +600 万元
交叉项 = ΔQ × ΔP = -200 × 3,000 = -60 万元

总变化 = -960 + 600 + (-60) = -420 万元 ✅

贡献率分析（各项贡献 / |总变化| × 100%，正号=扩大降幅，负号=对冲降幅）：
  量贡献：-960万 / -420万 × 100% = +229%（量减少是主要拖累）
  价贡献：+600万 / -420万 × 100% = -143%（价格提升对冲了部分降幅）
  交叉项：  -60万 / -420万 × 100% =  +14%（轻微放大降幅）
  合计：229% - 143% + 14% = 100% ✅
  净效果：-420 万（-4.4%）
```

**瀑布图展示**：

```
销售额（万元）

9,600 ┤████████████████████████████████████ 目标 9,600万
      │
      │           -960
      │        ┌─────────┐
      │        │  量贡献  │（提车量减少200台）
      │        │  -960万  │
      │        └─────────┘
      │                        +600
      │                    ┌─────────┐
      │                    │  价贡献  │（单车收入提升3000元）
      │                    │  +600万  │
      │                    └─────────┘
      │                               -60
      │                           ┌───────┐
      │                           │ 交叉项│
      │                           │ -60万 │
      │                           └───────┘
9,180 ┤████████████████████████████████ 实际 9,180万

分析结论：
  ⚠️ 销售额未达标（差距-420万/-4.4%）
  根因：提车量不足是主要拖累（-960万）
  亮点：单车收入超目标，价格策略有效（+600万）
  建议：聚焦提车量提升，特别是量价双杀的产品线
```

### 3.2 毛利的量效分解

**量 = 提车量，效 = 单车盈利**

> "效"代替"价"，因为单车盈利反映的是盈利效率，不是售价，所以更准确叫"量效分解"。

**示例数据**（延续上例）：

| 指标 | 目标 | 实际 | 变化 |
|------|------|------|------|
| 提车量（台） | 2,000 | 1,800 | -200（-10%） |
| 单车盈利（元） | 9,600 | 10,200 | +600（+6.25%） |
| **毛利（万元）** | **1,920** | **1,836** | **-84（-4.375%）** |

**量效分解计算**：

```
ΔQ = -200 台
Δ单车盈利 = +600 元

量贡献 = -200 × 9,600 = -192 万元
效贡献 = +600 × 2,000 = +120 万元
交叉项 = -200 × 600 = -12 万元

总变化 = -192 + 120 + (-12) = -84 万元 ✅
```

**与销售额分解的关系对比**：

```
          销售额分解          毛利分解
          ──────────         ──────────
量贡献    -960万（-10%）      -192万（-10%）   ← 量的拖累比例相同
效/价贡献 +600万（+6.25%）    +120万（+6.25%） ← 比例也相同
交叉项    -60万               -12万

规律：
  毛利率 = 单车盈利 / 单车收入 = 10,200 / 51,000 = 20%
  毛利变化 ≈ 销售额变化 × 毛利率（在毛利率稳定时）
  -84 ≈ -420 × 20% = -84 ✅
```

**当毛利率本身也在变化时**，需要三因素分解：量 × 价 × 率（见第 9 节）。

### 3.3 单车盈利的进一步拆解

**单车盈利 = 单车收入 × 毛利率**

这是一个乘积公式，可以做量价分解的变体——**价率分解**。

**示例数据**：

| 指标 | 目标 | 实际 | 变化 |
|------|------|------|------|
| 单车收入（元） | 48,000 | 51,000 | +3,000（+6.25%） |
| 毛利率（%） | 20.0% | 20.0% | 0% |
| **单车盈利（元）** | **9,600** | **10,200** | **+600（+6.25%）** |

情景一：毛利率不变，单车收入提升（上例）

```
单车盈利提升完全来自单车收入（价格贡献）
单车盈利变化 = 单车收入变化 × 毛利率 = 3,000 × 20% = 600元 ✅
```

情景二：单车收入和毛利率都变化

| 指标 | 目标 | 实际 | 变化 |
|------|------|------|------|
| 单车收入（元） | 48,000 | 51,000 | +3,000（+6.25%） |
| 毛利率（%） | 20.0% | 18.0% | -2%（-10%） |
| **单车盈利（元）** | **9,600** | **9,180** | **-420（-4.375%）** |

```
Δ单车收入 = +3,000 元，Δ毛利率 = -2%

价的贡献  = Δ单车收入 × 毛利率₀ = 3,000 × 20% = +600 元
率的贡献  = Δ毛利率 × 单车收入₀ = -2% × 48,000 = -960 元
交叉项    = Δ单车收入 × Δ毛利率 = 3,000 × (-2%) = -60 元

总变化 = 600 - 960 - 60 = -420 元 ✅

结论：
  虽然收入单价提升了，但毛利率下降（成本上涨/折扣增加）
  抵消了价格提升的效果，单车盈利反而下降
```

### 3.4 APP 商城的量价分解

APP 商城的业务逻辑与终端不同，指标体系稍有差别：

**方式一：直接量价分解**  
量 = 订单量，价 = 客单价（单笔订单金额）

```
APP 销售额 = 订单量 × 客单价
```

**方式二：漏斗展开（更细)**  
量 = 访客数 × 转化率（= 下单人数），价 = 客单价

```
APP 销售额 = 访客数 × 转化率 × 客单价
           = 订单量 × 客单价
```

**示例数据**：

| 指标 | 上月 | 本月 | 变化 |
|------|------|------|------|
| 访客数（人） | 50,000 | 60,000 | +10,000（+20%） |
| 转化率（%） | 3.0% | 2.5% | -0.5%（-16.7%） |
| 订单量（单） | 1,500 | 1,500 | 0（0%） |
| 客单价（元） | 2,000 | 2,200 | +200（+10%） |
| **APP销售额（万元）** | **300** | **330** | **+30（+10%）** |

**量价分解（订单量维度）**：

```
ΔQ（订单量） = 0
ΔP（客单价） = +200 元

量贡献 = 0 × 2,000 = 0 万元
价贡献 = 200 × 1,500 = 30 万元
交叉项 = 0

结论：APP销售额增长全部来自客单价提升，订单量持平
```

**漏斗分析（更深一层）**：

```
虽然订单量不变，但背后发生了结构变化：
  访客数 +20%（引流增加）
  转化率 -16.7%（转化效率下降）
  
净效果 = +20% × (-16.7%) ≈ 0（互相抵消）

启示：流量投放增加了，但转化率在下降
      如果转化率维持3%，订单量会是1,800单
      说明商城体验或商品匹配度有问题
```

**与选装模块对比**：

| 维度 | APP 商城 | 选装模块 |
|------|---------|---------|
| "量"的定义 | 订单量 | 装配台数 |
| "价"的定义 | 客单价 | 单套选装均价 |
| 量的驱动力 | 流量×转化率 | 提车量×选装渗透率 |
| 价的驱动力 | 商品结构+促销 | 选装包组合+价格策略 |

---

## 4. 量价分解 + 维度下钻（组合使用）

### 分析框架：4 步法

```
Step 1: 总量量价分解
  → 找到根因是"量问题"还是"价问题"

Step 2: 按产品维度拆贡献度
  → 各产品分别贡献了多少销售额变化？

Step 3: 对最大贡献者再做量价分解
  → 最大贡献者内部，是量还是价驱动的？

Step 4: 继续按产品线下钻
  → 定位到具体产品
```

### 完整数字示例

**背景**：本月销售额 vs 目标，差了 420 万，需要找原因。

---

**Step 1：总量量价分解**

```
总销售额：
  目标 9,600万 → 实际 9,180万，差距 -420万

量价分解结果：
  量贡献：-960万（提车量 2000→1800，降200台）
  价贡献：+600万（单车收入 48000→51000，涨3000元）
  交叉项：  -60万
  合计：   -420万

初步结论：问题在量，不在价。单车收入反而超目标。
          下一步重点：量为什么少了200台？
```

---

**Step 2：按产品维度拆贡献度**

```
各产品对销售额变化的贡献：

产品                目标(万)  实际(万)  变化(万)  贡献率
──────────────────────────────────────────────────────
车生长（选装/前装）   4,800     5,200    +400      -95%
车改装               3,200     2,680    -520     +124%  ← 主要拖累
车生活               1,600     1,300    -300      +71%  ← 次要拖累
合计                 9,600     9,180    -420      100%

结论：车改装是主要拖累（贡献了124%的下降），优先分析车改装。
      车生长反而超目标，形成正向对冲。
```

---

**Step 3：对"车改装"做量价分解**

```
车改装：
  目标：提车量 600台 × 单车收入 53,333元 = 3,200万
  实际：提车量 500台 × 单车收入 53,600元 = 2,680万

  ΔQ = 500 - 600 = -100 台
  ΔP = 53,600 - 53,333 = +267 元

  量贡献 = -100 × 53,333 = -533万
  价贡献 = +267 × 600 =   +16万
  交叉项 = -100 × 267 =    -3万
  合计   = -533 + 16 + (-3) = -520万 ✅

  结论：车改装下滑 520 万，几乎全部是量的问题。
        单车收入略有提升，但完全补不回量的损失。
```

---

**Step 4：按产品线下钻（车改装内部）**

```
车改装包含的产品线：T1N, T1P, T1K, T1J, T1L, D01

产品线   目标提车量  实际提车量  差距  单车收入(目标)  单车收入(实际)  销售额差距(万)
───────────────────────────────────────────────────────────────────────────
T1N       200        180        -20     55,000         56,000         -94
T1P       150        110        -40     52,000         54,000        -188  ← 最大拖累
T1K       100         90        -10     50,000         50,000         -50
T1J       100         80        -20     53,000         51,000        -122
T1L        30         25         -5     55,000         56,000         -27
D01        20         15         -5     57,000         55,000         -39
合计      600        500       -100                                  -520

深度结论：
  T1P 缺口最大（少40台，贡献了 36% 的差距）
  T1J 单车收入也下降了（量价双杀）
  → 下一步动作：
    T1P：查产能/库存/区域分布，确认是否有追货空间
    T1J：查折扣率/促销政策，了解价格下行原因
```

**4 步分析路径总结**：

```
总体差距 -420万
   ↓ Step 1: 量价分解
   量贡献 -960万，价贡献 +600万 → 量是根因
   ↓ Step 2: 产品维度
   车改装贡献了主要下滑 -520万
   ↓ Step 3: 车改装量价分解
   几乎全是量的问题，量降 100 台
   ↓ Step 4: 产品线下钻
   T1P 少 40 台，T1J 量价双杀
   ↓ 行动
   T1P 追产能/库存，T1J 排查定价
```

---

## 5. 量价分解在不同维度的应用

### 5.1 按渠道做量价分解

渠道结构：终端 57%、APP 商城 18%、其他 19%、内销 7%

```
渠道      目标提车量  实际提车量  目标单车收入  实际单车收入  销售额差距(万)  量贡献  价贡献
─────────────────────────────────────────────────────────────────────────────────────
终端         1,140       980       50,000       53,000       -880          -800   +171
APP商城       360        370       46,000       48,000         85          +46    +36
其他          380        330       47,000       46,000        -281         -235   +(-19)
内销          120        120       52,000       52,000          0            0      0
合计         2,000      1,800      加权均值     加权均值       -420       -...   +...

重点：终端渠道贡献了绝大部分量的下滑（少160台），同时单车收入也有提升。
```

**渠道分析要注意**：不同渠道的单车收入口径可能不同（是否含税、是否含服务费等），需确认定义一致。

### 5.2 按大区做量价分解

```
大区    目标提车量  实际提车量  ΔQ    目标单车收入  实际单车收入  ΔP     量贡献(万)  价贡献(万)
──────────────────────────────────────────────────────────────────────────────────────
华东       500        480       -20     50,000        51,000    +1,000      -100      +50
华南       400        350       -50     49,000        52,000    +3,000      -245     +120
华北       380        350       -30     47,000        48,000    +1,000      -141      +38
华中       280        250       -30     48,000        50,000    +2,000      -144      +56
西南       200        200         0     46,000        46,000         0         0        0
西北       140        100       -40     45,000        46,000    +1,000      -180      +14
东北       100         70       -30     45,000        47,000    +2,000      -135      +20
合计      2,000      1,800     -200                                        -945     +298

发现：
  西北 (-40台) 和 华南 (-50台) 量的缺口最大
  所有大区单车收入都有提升（价格策略全面执行）
  华南量差但价格提升最多，可能是主动控量提价
```

### 5.3 按时间做量价分解（环比/同比）

**环比分析**（本月 vs 上月）：

```
指标           上月        本月        变化
提车量（台）   1,850       1,800        -50（-2.7%）
单车收入（元） 50,500      51,000       +500（+1.0%）
销售额（万元） 9,342.5     9,180        -162.5（-1.7%）

环比量价分解：
  量贡献 = -50 × 50,500 = -252.5 万
  价贡献 = +500 × 1,850 = +92.5 万
  交叉项 = -50 × 500 = -2.5 万
  合计   = -162.5 万 ✅

环比结论：月环比小幅下滑，主要是季节性量降，价格稳中有升。
```

**同比分析**（本月 vs 去年同月）：

```
指标           去年同月    本月        变化
提车量（台）   1,600       1,800       +200（+12.5%）
单车收入（元） 45,000      51,000      +6,000（+13.3%）
销售额（万元） 7,200       9,180       +1,980（+27.5%）

同比量价分解：
  量贡献 = +200 × 45,000 = +900 万（贡献率45%）
  价贡献 = +6,000 × 1,600 = +960 万（贡献率49%）
  交叉项 = +200 × 6,000 = +120 万（贡献率  6%）
  合计   = +1,980 万 ✅

同比结论：量价齐升，业务健康增长。价格提升略大于量的增长。
```

### 5.4 交叉维度：如"华南的选装件"的量价分解

交叉维度 = 同时固定多个筛选维度，对剩余指标做量价分解。

```
筛选条件：大区=华南 AND 产品=车生长（选装）

华南·选装：
  目标：装配台数 180台 × 选装均价 8,000元 = 144万
  实际：装配台数 165台 × 选装均价 8,500元 = 140.25万
  差距：-3.75万

  量贡献 = (165-180) × 8,000 = -120,000元（-12万）
  价贡献 = (8,500-8,000) × 180 = +90,000元（+9万）
  交叉项 = -15 × 500 = -7,500元（-0.75万）
  合计   = -12 + 9 - 0.75 = -3.75万 ✅

交叉维度结论：
  华南选装件轻微下滑，量降价升。
  华南区域对高价选装包接受度较高（+500元均价）
  但装配台次略有减少，需要关注终端推荐率。
```

---

## 6. 六种量价组合情景速查表

| 情景 | 量 | 价 | 总额 | 名称 | 现象描述 | 可能原因 | 建议行动 |
|------|----|----|------|------|---------|---------|---------|
| **① 最佳** | ↑ | ↑ | ↑↑ | 量价齐升 | 销量和单价同步提升，收入大幅增长 | 产品受欢迎、供不应求、市场扩张 | 保持势头，扩大产能，防止竞品跟进 |
| **② 危险** | ↑ | ↓ | ↑或→ | 以量补价 | 卖得更多但每台更便宜 | 大规模促销、折扣过高、产品老化 | 审查折扣政策，检查是否用价格换量，不可持续 |
| **③ 高端化** | ↓ | ↑ | →或↑ | 以价补量 | 销量减少但单价提升 | 主动控量、产品升级、目标客群缩小 | 确认是战略选择还是被动失量，监控毛利率 |
| **④ 最差** | ↓ | ↓ | ↓↓ | 量价齐跌 | 销量和单价双双下滑，收入大幅下降 | 竞争加剧、产品过时、市场萎缩 | 立即行动：查根因，必要时产品重组或退出 |
| **⑤ 增量侵蚀** | ↑ | ↓ | ↑ | 增量但价格侵蚀 | 总额增长，但价格跌幅显著 | 折扣换量、低价冲量、渠道政策过激 | 总额虽增但毛利可能恶化，需同步看毛利率 |
| **⑥ 高端流失** | ↓ | ↑ | ↓ | 高端化但客户流失 | 均价提升但客户在流失，总额下降 | 定价过高、产品溢价与价值不匹配 | 重新审视定价策略，找回流失的价格敏感客户 |

### 情景判断矩阵（快速诊断用）

```
                    价格变化
                  ↑ 升      → 平      ↓ 降
          ┌────────────────────────────────────┐
  ↑ 升   │  ① 量价齐升  │  量增价平  │  ② 以量补价  │
          │  （最佳）    │  （健康）  │  （危险）    │
  量      ├────────────────────────────────────┤
  变      │  量平价升    │  量价均平  │  量平价跌    │
  化 → 平 │  （检查成本）│  （停滞）  │  （价格侵蚀）│
          ├────────────────────────────────────┤
  ↓ 降   │  ③ 以价补量  │  量降价平  │  ④ 量价齐跌  │
          │  （高端化）  │  （失量）  │  （最差）    │
          └────────────────────────────────────┘
```

### 各情景的毛利影响

```
情景①  量↑价↑  →  毛利额大幅提升，毛利率通常稳定或提升
情景②  量↑价↓  →  毛利额可能减少（走量不走利），毛利率下降 ⚠️
情景③  量↓价↑  →  毛利额变化不确定，毛利率可能提升
情景④  量↓价↓  →  毛利额大幅下降，毛利率也可能下降 ❌
情景⑤  量↑价↓总额↑  →  需检查毛利率是否健康
情景⑥  量↓价↑总额↓  →  毛利率高但规模萎缩，长期风险大
```

---

## 7. 瀑布图的设计规范

### 7.1 瀑布图的结构

```
标准瀑布图结构（Sales Bridge）：

  ┌─────┐
  │起点  │
  │（目标）       ┌─────┐
  └──┬──┘         │终点  │
     │              │（实际）
     ▼              └─────┘
  [量贡献]
  [价贡献]
  [交叉项]
     │
     └──────────────→

可视化：

万元
9,600 ██████████████████████████████████████  起点（目标）
       
       ▼
       ████████████ -960  量贡献（红色，向下）
       
                    ▲
                    ████████ +600  价贡献（绿色，向上）
                    
                          ▼
                          ███ -60  交叉项（红色，向下）
                          
9,180  ████████████████████████████████  终点（实际）
```

### 7.2 颜色规范

| 颜色 | 用于 | 示例 |
|------|------|------|
| 🟩 绿色（#52C41A） | 正向贡献（量↑或价↑） | 价格提升 +600万 |
| 🟥 红色（#FF4D4F） | 负向贡献（量↓或价↓） | 量减少 -960万 |
| 🟦 蓝色（#1890FF） | 起点/终点/基准值 | 目标 9,600万，实际 9,180万 |
| 🟧 橙色（#FA8C16） | 交叉项（中性展示） | 交叉效应 -60万 |
| ⬜ 灰色（#8C8C8C） | 透明支撑柱（不可见部分） | 瀑布图的"悬空"部分 |

### 7.3 标注规范

每个瀑布柱需要标注：

```
┌─────────────┐
│   -960万    │  ← 绝对值（万元）
│   (-10.0%)  │  ← 相对于起点的百分比
│   量贡献    │  ← 标签名称
└─────────────┘
```

完整标注示例：

```
          ┌──────────────────────────────────────────────────────────┐
目标 9600 │██████████████████████████████████████████  9,600万 (基准) │
          └──────────────────────────────────────────────────────────┘
                                    ↓
          ┌──────────────────┐
量贡献    │██████████ -960万 │（-10.0%）  提车量 2000→1800 台
          └──────────────────┘
                                    ↑
                    ┌─────────┐
价贡献              │████ +600│（+6.25%）  单车收入 48000→51000 元
                    └─────────┘
                                    ↓
                              ┌──┐
交叉项                        │-60│（-0.6%）
                              └──┘
          ┌──────────────────────────────────────────┐
实际 9180 │████████████████████████████████  9,180万 │（-4.4% vs目标）
          └──────────────────────────────────────────┘
```

### 7.4 多级瀑布图

**第一级**：总体销售额（目标 vs 实际）
```
总量级瀑布：目标 → 量贡献 → 价贡献 → 交叉项 → 实际
```

**第二级**：按产品分解量贡献（下钻到量贡献的内部）
```
量贡献(-960万) = 车生长量贡献 + 车改装量贡献 + 车生活量贡献
               = +200        + (-800)       + (-360)
```

**第三级**：对最大拖累产品做进一步分解
```
车改装量贡献(-800万) = T1P量贡献 + T1N量贡献 + ...
```

**多级瀑布图布局建议**：

```
屏幕布局：
┌─────────────────────────┬──────────────────────────────────┐
│  Level 1: 总量           │  Level 2: 产品分解               │
│  瀑布图（点击可下钻）      │  点击 Level 1 的量柱后显示        │
│                          │                                  │
│  目标→量贡献→价贡献→实际  │  车生长量贡献                    │
│                          │  车改装量贡献（点击→Level 3）     │
│                          │  车生活量贡献                    │
└─────────────────────────┴──────────────────────────────────┘
```

### 7.5 Tableau / ECharts 实现要点

**Tableau 实现**：

```
1. 数据准备：
   每行数据 = 一个瀑布柱
   字段：类别、值（正负）、悬浮高度（累计值）

2. 图表类型：甘特图（Gantt Bar）变体
   - X轴：类别（有序）
   - Y轴：Size = 柱子高度，Offset = 悬浮起点
   - 颜色：IF 值>0 THEN '正向' ELSE '负向' END

3. 关键计算字段：
   [RunningTotal] = RUNNING_SUM([值])
   [Offset] = [RunningTotal] - [值]  // 起点位置

4. 颜色设置：
   正向 → 绿色 #52C41A
   负向 → 红色 #FF4D4F
   起点/终点 → 蓝色 #1890FF
```

**ECharts 实现**（驾驶舱前端）：

```javascript
// ECharts 瀑布图配置
const waterfallOption = {
  xAxis: {
    type: 'category',
    data: ['目标', '量贡献', '价贡献', '交叉项', '实际']
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      stack: 'waterfall',
      itemStyle: { color: 'transparent' }, // 透明支撑
      data: [0, 9600, 8640, 9240, 9180]    // 累计起点
    },
    {
      type: 'bar',
      stack: 'waterfall',
      data: [
        { value: 9600, itemStyle: { color: '#1890FF' } }, // 目标
        { value: -960, itemStyle: { color: '#FF4D4F' } }, // 量贡献（负）
        { value: 600,  itemStyle: { color: '#52C41A' } }, // 价贡献（正）
        { value: -60,  itemStyle: { color: '#FA8C16' } }, // 交叉项
        { value: 9180, itemStyle: { color: '#1890FF' } }, // 实际
      ]
    }
  ]
};
```

---

## 8. 常见误区和注意事项

### 误区一：忽略交叉项

```
❌ 错误做法：
  量贡献 + 价贡献 = -960 + 600 = -360万
  实际变化 -420万，对不上！差60万哪来的？
  "算法有问题？" "数据错了？"

✅ 正确做法：
  量贡献 + 价贡献 + 交叉项 = -960 + 600 + (-60) = -420万 ✅
  
交叉项在量价变化都不大时（<5%）可能很小，但在变化较大时不可忽视。
例：量降10%，价涨6.25% → 交叉项约为 -0.625%，对-4.4%的总变化贡献14%，不可忽视。
```

### 误区二：只看绝对值，不看贡献度百分比

```
❌ 场景：
  产品A：量贡献 -500万
  产品B：量贡献 -100万
  结论："产品A问题更大"

✅ 应该同时看：
  产品A：销售额基数 5000万，量贡献 -500万，贡献率 -10%
  产品B：销售额基数 500万，量贡献 -100万，贡献率 -20%
  
  产品B的量下滑比例（20%）远高于产品A（10%）
  产品B可能更需要关注！（虽然绝对金额小）
```

### 误区三：在数据粒度不够的层级强行做量价分解

```
❌ 场景：
  只有"总销售额"数据，没有"提车量"的明细
  强行用"总销售额/总台数"做量价分解
  
问题：
  如果产品结构变了（低价产品卖多了），
  计算出来的"单车收入"变化不代表真实价格变化，
  而是结构变化的混合效果。

✅ 正确做法：
  至少需要以下数据才能做量价分解：
  - 各维度的量（提车量）
  - 各维度的销售额（可以反算出单车收入）
  - 分析维度要与数据粒度匹配
```

### 误区四：量价分解后不继续下钻

```
❌ 场景：
  发现"量的贡献是 -960万"后停止分析
  在报告里写："主要是量的问题"
  
问题：
  这只回答了"是什么"，没有回答"为什么"和"怎么办"
  
✅ 正确做法：
  量贡献 -960万
    → 哪个产品的量减少了？（按产品下钻）
      → 车改装减少 100台
        → 哪个产品线？哪个大区？（继续下钻）
          → T1P 在西北大区减少最多
            → 查原因：库存不足？终端推力不够？竞品抢占？
              → 行动：补货/激励/促销
```

### 误区五：把"结构变化"误认为"价格变化"

```
❌ 场景：
  整体单车收入从 48,000 降到 46,000 元
  结论："价格降了 2,000 元"

❌ 实际情况可能是：
  T1N（高价产品）：单车收入 55,000 元，本月台数比例从 40% → 20%
  T1P（低价产品）：单车收入 42,000 元，本月台数比例从 60% → 80%
  
  T1N 和 T1P 各自的单车收入都没有变！
  但由于低价产品卖得更多，"整体单车收入"下降了。
  这是结构效应，不是价格变化。

✅ 正确做法：
  先固定产品结构做量价分解
  再单独分析结构变化的影响
  （详见第 9 节：结构效应）
```

---

## 9. 结构效应（高级话题）

### 9.1 什么是结构效应（辛普森悖论）

**辛普森悖论**：每个子群体中，指标都没有变化（或都在提升），但汇总后的整体指标却发生了变化（或下降）。原因是各子群体的**权重（占比）变化了**。

### 9.2 示例：每条产品线单车收入都没降，但总体单车收入降了

```
情况：T1N ~ D01 六条产品线，本月 vs 上月

产品线   上月单车收入  本月单车收入  变化   上月台数  本月台数  上月占比  本月占比
─────────────────────────────────────────────────────────────────────────────
T1N      55,000       55,000       0%      400      200     20%      10%
T1P      52,000       52,000       0%      400      600     20%      30%
T1K      50,000       50,000       0%      300      300     15%      15%
T1J      53,000       53,000       0%      400      400     20%      20%
T1L      55,000       55,000       0%      250      300     12.5%   15%
D01      57,000       57,000       0%      250      200     12.5%   10%
合计                               0%    2,000    2,000    100%    100%

上月加权平均单车收入：
  = (55000×400 + 52000×400 + 50000×300 + 53000×400 + 55000×250 + 57000×250) / 2000
  = (22,000,000 + 20,800,000 + 15,000,000 + 21,200,000 + 13,750,000 + 14,250,000) / 2000
  = 107,000,000 / 2000
  = 53,500 元

本月加权平均单车收入：
  = (55000×200 + 52000×600 + 50000×300 + 53000×400 + 55000×300 + 57000×200) / 2000
  = (11,000,000 + 31,200,000 + 15,000,000 + 21,200,000 + 16,500,000 + 11,400,000) / 2000
  = 106,300,000 / 2000
  = 53,150 元

变化：53,150 - 53,500 = -350 元 (-0.65%)

结论：
  每条产品线的单车收入都没变！
  但总体单车收入降了 350 元。
  原因：低价产品 T1P（52,000元）的比例从 20% → 30%
       高价产品 T1N（55,000元）的比例从 20% → 10%
  这是纯粹的结构效应，与定价无关。
```

### 9.3 如何将量价分解扩展为"量-价-结构"三因素分解

**三因素分解公式**：

```
总销售额变化 = 量效应 + 价效应 + 结构效应 + 交叉项

其中：
  量效应   = 总量变化 × 上期加权单车收入
  价效应   = Σ（各产品单车收入变化 × 上期各产品台数）
  结构效应 = Σ（上期单车收入 × 各产品台数变化 - 量效应分配）
```

**简化版（实操常用）**：

```
Step 1: 固定结构，算纯价格变化
  = Σ（各产品 ΔP × Q₀）

Step 2: 固定价格，算纯结构变化
  = Σ（各产品 P₀ × ΔQ）- 总量变化 × 总体均价₀
  （这一部分是结构变化的贡献，排除了纯量增减）

Step 3: 纯量变化
  = 总台数变化 × 总体均价₀

验证：Step 1 + Step 2 + Step 3 + 交叉项 = 总变化
```

**驾驶舱展示建议**：

```
四因素瀑布图：

目标 → [量效应] → [价效应] → [结构效应] → [交叉项] → 实际

标注说明：
  结构效应：低价产品占比上升，拖累整体均价 -350元×台数
  
  当结构效应为负时，要判断：
  ├── 是主动策略？（主动推广低价产品，扩大市场）
  └── 是被动结果？（高价产品卖不动，低价产品凑数）
  两种原因对策完全不同。
```

---

## 10. 量价分解的代码实现

### 10.1 Python 实现（pandas）

```python
import pandas as pd
from typing import Optional

def volume_price_decomposition(
    base_quantity: float,
    base_price: float,
    target_quantity: float,
    target_price: float,
    label: str = "分析项"
) -> dict:
    """
    量价分解核心函数
    
    参数：
        base_quantity   : 基准期数量（如目标提车量）
        base_price      : 基准期价格（如目标单车收入）
        target_quantity : 对比期数量（如实际提车量）
        target_price    : 对比期价格（如实际单车收入）
        label           : 分析项名称（如 "T1P车改装"）
    
    返回：
        dict: 包含量贡献、价贡献、交叉项、总变化的字典
    
    示例：
        result = volume_price_decomposition(
            base_quantity=2000,
            base_price=48000,
            target_quantity=1800,
            target_price=51000,
            label="总销售额"
        )
    """
    delta_q = target_quantity - base_quantity
    delta_p = target_price - base_price
    
    base_revenue = base_quantity * base_price
    target_revenue = target_quantity * target_price
    total_change = target_revenue - base_revenue
    
    quantity_contribution = delta_q * base_price
    price_contribution = delta_p * base_quantity
    cross_term = delta_q * delta_p
    
    # 验证
    calculated_total = quantity_contribution + price_contribution + cross_term
    assert abs(calculated_total - total_change) < 0.01, \
        f"量价分解验证失败: |{calculated_total} - {total_change}| >= 0.01"
    
    return {
        "label": label,
        "base_revenue": base_revenue,
        "target_revenue": target_revenue,
        "total_change": total_change,
        "total_change_pct": total_change / base_revenue * 100,
        "delta_q": delta_q,
        "delta_p": delta_p,
        "quantity_contribution": quantity_contribution,
        "price_contribution": price_contribution,
        "cross_term": cross_term,
        "quantity_contribution_pct": quantity_contribution / abs(total_change) * 100 if total_change != 0 else 0,
        "price_contribution_pct": price_contribution / abs(total_change) * 100 if total_change != 0 else 0,
    }


def batch_decomposition(df: pd.DataFrame) -> pd.DataFrame:
    """
    批量对多个产品/维度做量价分解
    
    输入 DataFrame 必须包含以下列：
        label           : 分析项名称
        base_quantity   : 基准期数量
        base_price      : 基准期价格
        target_quantity : 对比期数量
        target_price    : 对比期价格
    
    示例数据：
        data = {
            'label': ['T1N', 'T1P', 'T1K', 'T1J', 'T1L', 'D01'],
            'base_quantity': [200, 150, 100, 100, 30, 20],
            'base_price': [55000, 52000, 50000, 53000, 55000, 57000],
            'target_quantity': [180, 110, 90, 80, 25, 15],
            'target_price': [56000, 54000, 50000, 51000, 56000, 55000],
        }
        df = pd.DataFrame(data)
        result = batch_decomposition(df)
    """
    results = []
    for _, row in df.iterrows():
        result = volume_price_decomposition(
            base_quantity=row['base_quantity'],
            base_price=row['base_price'],
            target_quantity=row['target_quantity'],
            target_price=row['target_price'],
            label=row['label']
        )
        results.append(result)
    
    result_df = pd.DataFrame(results)
    
    # 汇总行
    total_base = result_df['base_revenue'].sum()
    total_target = result_df['target_revenue'].sum()
    total_q_contribution = result_df['quantity_contribution'].sum()
    total_p_contribution = result_df['price_contribution'].sum()
    total_cross = result_df['cross_term'].sum()
    total_change = total_target - total_base
    
    summary = pd.DataFrame([{
        'label': '合计',
        'base_revenue': total_base,
        'target_revenue': total_target,
        'total_change': total_change,
        'total_change_pct': total_change / total_base * 100,
        'quantity_contribution': total_q_contribution,
        'price_contribution': total_p_contribution,
        'cross_term': total_cross,
        'quantity_contribution_pct': total_q_contribution / abs(total_change) * 100 if total_change != 0 else 0,
        'price_contribution_pct': total_p_contribution / abs(total_change) * 100 if total_change != 0 else 0,
    }])
    
    return pd.concat([result_df, summary], ignore_index=True)


def print_waterfall(result: dict, unit: str = "元") -> None:
    """
    打印量价分解瀑布图（ASCII版）
    
    示例：
        result = volume_price_decomposition(2000, 48000, 1800, 51000, "总销售额")
        print_waterfall(result, unit="万元")
    """
    scale = 1
    if unit == "万元":
        scale = 10000
    
    def fmt(value, unit):
        if unit == "万元":
            return f"{value/10000:+.0f}万"
        return f"{value:+.0f}{unit}"
    
    print(f"\n{'='*60}")
    print(f"  量价分解瀑布图：{result['label']}")
    print(f"{'='*60}")
    print(f"  基准期收入: {result['base_revenue']/scale:.0f}{unit}")
    print(f"  对比期收入: {result['target_revenue']/scale:.0f}{unit}")
    print(f"  总变化:     {fmt(result['total_change'], unit)} ({result['total_change_pct']:.1f}%)")
    print(f"{'-'*60}")
    print(f"  量贡献 (ΔQ×P₀): {fmt(result['quantity_contribution'], unit)}"
          f"  ({result['quantity_contribution_pct']:.1f}%)")
    print(f"  价贡献 (ΔP×Q₀): {fmt(result['price_contribution'], unit)}"
          f"  ({result['price_contribution_pct']:.1f}%)")
    print(f"  交叉项 (ΔQ×ΔP): {fmt(result['cross_term'], unit)}")
    print(f"{'='*60}\n")


# 完整使用示例
if __name__ == "__main__":
    # 单项分解
    result = volume_price_decomposition(
        base_quantity=2000,
        base_price=48000,
        target_quantity=1800,
        target_price=51000,
        label="总销售额（目标vs实际）"
    )
    print_waterfall(result, unit="万元")
    
    # 批量分解（多产品线）
    data = {
        'label': ['T1N', 'T1P', 'T1K', 'T1J', 'T1L', 'D01'],
        'base_quantity':   [200, 150, 100, 100, 30, 20],
        'base_price':      [55000, 52000, 50000, 53000, 55000, 57000],
        'target_quantity': [180, 110, 90, 80, 25, 15],
        'target_price':    [56000, 54000, 50000, 51000, 56000, 55000],
    }
    df = pd.DataFrame(data)
    result_df = batch_decomposition(df)
    
    # 打印汇总表
    cols = ['label', 'base_revenue', 'target_revenue', 'total_change',
            'quantity_contribution', 'price_contribution', 'cross_term']
    print("\n产品线量价分解汇总（单位：元）：")
    print(result_df[cols].to_string(index=False))
```

### 10.2 JavaScript/TypeScript 实现（驾驶舱前端）

```typescript
// 量价分解类型定义
interface VolumePriceInput {
  label: string;
  baseQuantity: number;   // 基准期数量（如目标提车量）
  basePrice: number;      // 基准期价格（如目标单车收入）
  targetQuantity: number; // 对比期数量（如实际提车量）
  targetPrice: number;    // 对比期价格（如实际单车收入）
}

interface VolumePriceResult {
  label: string;
  baseRevenue: number;
  targetRevenue: number;
  totalChange: number;
  totalChangePct: number;
  deltaQ: number;
  deltaP: number;
  quantityContribution: number;   // 量贡献 = ΔQ × P₀
  priceContribution: number;      // 价贡献 = ΔP × Q₀
  crossTerm: number;              // 交叉项 = ΔQ × ΔP
  quantityContributionPct: number;
  priceContributionPct: number;
  scenario: VolumePriceScenario;  // 六种情景分类
}

type VolumePriceScenario =
  | 'VOLUME_UP_PRICE_UP'      // ① 量价齐升（最好）
  | 'VOLUME_UP_PRICE_DOWN'    // ② 以量补价（危险）
  | 'VOLUME_DOWN_PRICE_UP'    // ③ 以价补量
  | 'VOLUME_DOWN_PRICE_DOWN'  // ④ 量价齐跌（最差）
  | 'FLAT';                   // 量价均平

/**
 * 量价分解核心函数
 * 
 * @param input 量价分解输入参数
 * @returns 量价分解结果
 * 
 * @example
 * const result = volumePriceDecomposition({
 *   label: "总销售额",
 *   baseQuantity: 2000,
 *   basePrice: 48000,
 *   targetQuantity: 1800,
 *   targetPrice: 51000,
 * });
 * console.log(result.quantityContribution); // -9600000
 * console.log(result.priceContribution);    // +6000000
 */
export function volumePriceDecomposition(
  input: VolumePriceInput
): VolumePriceResult {
  const { label, baseQuantity, basePrice, targetQuantity, targetPrice } = input;

  const deltaQ = targetQuantity - baseQuantity;
  const deltaP = targetPrice - basePrice;

  const baseRevenue = baseQuantity * basePrice;
  const targetRevenue = targetQuantity * targetPrice;
  const totalChange = targetRevenue - baseRevenue;

  const quantityContribution = deltaQ * basePrice;
  const priceContribution = deltaP * baseQuantity;
  const crossTerm = deltaQ * deltaP;

  // 验证（浮点数误差容忍）
  const calculated = quantityContribution + priceContribution + crossTerm;
  if (Math.abs(calculated - totalChange) > 0.01) {
    throw new Error(`量价分解验证失败: 差异 ${Math.abs(calculated - totalChange)} 超过容忍度 0.01`);
  }

  const totalAbsChange = Math.abs(totalChange);
  const quantityContributionPct =
    totalAbsChange > 0 ? (quantityContribution / totalAbsChange) * 100 : 0;
  const priceContributionPct =
    totalAbsChange > 0 ? (priceContribution / totalAbsChange) * 100 : 0;

  // 判断情景
  const scenario = classifyScenario(deltaQ, deltaP);

  return {
    label,
    baseRevenue,
    targetRevenue,
    totalChange,
    totalChangePct: baseRevenue > 0 ? (totalChange / baseRevenue) * 100 : 0,
    deltaQ,
    deltaP,
    quantityContribution,
    priceContribution,
    crossTerm,
    quantityContributionPct,
    priceContributionPct,
    scenario,
  };
}

/**
 * 判断量价组合情景（六种分类）
 */
function classifyScenario(deltaQ: number, deltaP: number): VolumePriceScenario {
  if (deltaQ > 0 && deltaP > 0) return 'VOLUME_UP_PRICE_UP';
  if (deltaQ > 0 && deltaP < 0) return 'VOLUME_UP_PRICE_DOWN';
  if (deltaQ < 0 && deltaP > 0) return 'VOLUME_DOWN_PRICE_UP';
  if (deltaQ < 0 && deltaP < 0) return 'VOLUME_DOWN_PRICE_DOWN';
  return 'FLAT';
}

/**
 * 情景中文描述映射
 */
export const SCENARIO_LABELS: Record<VolumePriceScenario, {
  name: string;
  color: string;
  description: string;
}> = {
  VOLUME_UP_PRICE_UP: {
    name: '量价齐升',
    color: '#52C41A',
    description: '销量和单价同步提升，最佳状态',
  },
  VOLUME_UP_PRICE_DOWN: {
    name: '以量补价',
    color: '#FA8C16',
    description: '以销量增长弥补单价下降，需关注毛利率',
  },
  VOLUME_DOWN_PRICE_UP: {
    name: '以价补量',
    color: '#1890FF',
    description: '单价提升，但销量下降，注意规模效应',
  },
  VOLUME_DOWN_PRICE_DOWN: {
    name: '量价齐跌',
    color: '#FF4D4F',
    description: '销量和单价双双下滑，最差状态，需立即行动',
  },
  FLAT: {
    name: '量价均平',
    color: '#8C8C8C',
    description: '量价均无明显变化，业务停滞',
  },
};

/**
 * 批量量价分解（多产品线/多维度）
 * 
 * @example
 * const inputs = [
 *   { label: 'T1N', baseQuantity: 200, basePrice: 55000, targetQuantity: 180, targetPrice: 56000 },
 *   { label: 'T1P', baseQuantity: 150, basePrice: 52000, targetQuantity: 110, targetPrice: 54000 },
 * ];
 * const results = batchDecomposition(inputs);
 */
export function batchDecomposition(inputs: VolumePriceInput[]): {
  items: VolumePriceResult[];
  summary: {
    totalBaseRevenue: number;
    totalTargetRevenue: number;
    totalChange: number;
    totalChangePct: number;
    totalQuantityContribution: number;
    totalPriceContribution: number;
    totalCrossTerm: number;
  };
} {
  const items = inputs.map((input) => volumePriceDecomposition(input));

  const totalBaseRevenue = items.reduce((sum, r) => sum + r.baseRevenue, 0);
  const totalTargetRevenue = items.reduce((sum, r) => sum + r.targetRevenue, 0);
  const totalChange = totalTargetRevenue - totalBaseRevenue;
  const totalQuantityContribution = items.reduce(
    (sum, r) => sum + r.quantityContribution, 0
  );
  const totalPriceContribution = items.reduce(
    (sum, r) => sum + r.priceContribution, 0
  );
  const totalCrossTerm = items.reduce((sum, r) => sum + r.crossTerm, 0);

  return {
    items,
    summary: {
      totalBaseRevenue,
      totalTargetRevenue,
      totalChange,
      totalChangePct:
        totalBaseRevenue > 0 ? (totalChange / totalBaseRevenue) * 100 : 0,
      totalQuantityContribution,
      totalPriceContribution,
      totalCrossTerm,
    },
  };
}

/**
 * 将量价分解结果转换为 ECharts 瀑布图数据
 * 
 * @example
 * const result = volumePriceDecomposition({...});
 * const chartData = toWaterfallChartData(result);
 * // 直接传入 ECharts option.series[].data
 */
export function toWaterfallChartData(result: VolumePriceResult): {
  xAxisData: string[];
  supportData: number[];  // 透明支撑柱（用于悬浮效果）
  barData: Array<{ value: number; itemStyle: { color: string } }>;
} {
  const { baseRevenue, quantityContribution, priceContribution, crossTerm, targetRevenue } = result;

  const COLOR_BASE = '#1890FF';
  const COLOR_POSITIVE = '#52C41A';
  const COLOR_NEGATIVE = '#FF4D4F';
  const COLOR_CROSS = '#FA8C16';

  // 瀑布图各柱的起点（支撑高度）
  const q_end = baseRevenue + quantityContribution;
  const p_end = q_end + priceContribution;

  const xAxisData = ['基准期（目标）', '量贡献', '价贡献', '交叉项', '对比期（实际）'];
  
  const supportData = [
    0,
    Math.min(baseRevenue, q_end),
    Math.min(q_end, p_end),
    Math.min(p_end, p_end + crossTerm),
    0,
  ];

  const barData = [
    { value: baseRevenue,          itemStyle: { color: COLOR_BASE } },
    { value: quantityContribution, itemStyle: { color: quantityContribution >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE } },
    { value: priceContribution,    itemStyle: { color: priceContribution >= 0 ? COLOR_POSITIVE : COLOR_NEGATIVE } },
    { value: crossTerm,            itemStyle: { color: COLOR_CROSS } },
    { value: targetRevenue,        itemStyle: { color: COLOR_BASE } },
  ];

  return { xAxisData, supportData, barData };
}

// 完整使用示例
const example = volumePriceDecomposition({
  label: "总销售额",
  baseQuantity: 2000,
  basePrice: 48000,
  targetQuantity: 1800,
  targetPrice: 51000,
});

console.log(`
量价分解结果：${example.label}
──────────────────────────
基准期收入: ${(example.baseRevenue / 10000).toFixed(0)} 万元
对比期收入: ${(example.targetRevenue / 10000).toFixed(0)} 万元
总变化: ${(example.totalChange / 10000).toFixed(0)} 万元 (${example.totalChangePct.toFixed(1)}%)

量贡献: ${(example.quantityContribution / 10000).toFixed(0)} 万元
价贡献: ${(example.priceContribution / 10000).toFixed(0)} 万元
交叉项: ${(example.crossTerm / 10000).toFixed(0)} 万元

情景判断: ${SCENARIO_LABELS[example.scenario].name}
`);
```

---

## 附录：快速参考卡片

### 公式速查

```
核心公式
─────────────────────────────────────────
销售额   = 提车量 × 单车收入
毛利     = 提车量 × 单车盈利
毛利率   = 单车盈利 / 单车收入
T3完成率 = 销售额 / T3目标

单车收入 = 销售额 / 提车量
单车盈利 = 毛利 / 提车量

量价分解
─────────────────────────────────────────
ΔRevenue = ΔQ×P₀（量贡献）
         + ΔP×Q₀（价贡献）
         + ΔQ×ΔP（交叉项）

其中：
  ΔQ = Q₁ - Q₀（数量变化）
  ΔP = P₁ - P₀（价格变化）
  Q₀, P₀ 为基准期数值
```

### 分析路径速查

```
销售额异常
  ↓ Step 1: 量价分解
  量问题? → 按产品下钻 → 按产品线下钻 → 按大区下钻
  价问题? → 按渠道下钻 → 查折扣率/促销 → 查产品结构

毛利异常
  ↓ Step 1: 量效分解（量×单车盈利）
  量问题? → 同销售额路径
  效问题? → 单车盈利分解（单车收入×毛利率）
           价降? → 查折扣、促销
           率降? → 查成本、退货、服务费
```

### 交叉项处理速查

```
交叉项大小    处理方式
< 1%          可忽略或合并到量/价
1% ~ 5%       单独列出，备注说明
> 5%          必须单独列出，深入分析
量价同向变化  交叉项为正（放大效果）
量价反向变化  交叉项为负（抵消效果）
```

---

*本文档持续更新，如有业务逻辑变化请同步更新示例数据和公式。*
