# 车企周边好物商城 · 智能驾驶舱 Demo

> **Palantir Ontology-Powered Cockpit** — 基于本体论建模思想构建的可运行驾驶舱 Demo

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-purple)](https://vite.dev)
[![ECharts](https://img.shields.io/badge/ECharts-5-red)](https://echarts.apache.org)

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

打开浏览器访问 `http://localhost:5173`

---

## 🏗️ 核心设计理念

本项目以 **Palantir OSDK** 的三大设计哲学为核心：

| 理念 | 实现 |
|------|------|
| **本体论建模（Ontology）** | 5 类业务对象 + 6 条关系链 + 5 种可执行 Action |
| **归因分析（Attribution）** | 瀑布图分解 KPI 变化因子，从结果反向追溯根因 |
| **行动闭环（Actionable）** | 每个对象卡片内嵌 AI 建议 + 一键执行按钮 |

---

## 📁 项目结构

```
src/
├── ontology/              # 本体层（Palantir FauxFoundry 思想）
│   ├── types.ts           # 类型定义：Product/Order/Customer/Supplier/Campaign
│   ├── engine.ts          # OntologyEngine：对象注册、Link 遍历、Action 执行
│   ├── mock-data.ts       # Mock 数据（无需后端）
│   └── actions.ts         # (内置于 engine.ts)
├── analysis/
│   └── attribution.ts     # 归因分析算法：KPI 计算 + 瀑布图因子分解
├── components/
│   ├── Layout.tsx         # 驾驶舱外壳：Header、面包屑导航、层级 Tab
│   ├── KPICards.tsx       # Level 0: KPI 卡片（异常高亮 + 趋势箭头）
│   ├── WaterfallChart.tsx # Level 1: 归因瀑布图
│   ├── ObjectCard.tsx     # Level 2: 对象 360° 视图 + 关联对象列表
│   ├── ActionPanel.tsx    # Level 3: AI 建议 + 行动面板
│   ├── TrendChart.tsx     # GMV & 毛利率趋势折线图
│   ├── CategoryChart.tsx  # 品类销售分析柱状图
│   └── ChannelChart.tsx   # 渠道 GMV 分布饼图
└── styles/
    └── global.css         # 暗色主题（Palantir 风格）
```

---

## 🎮 交互流程

```
Level 0 全局态势
    ↓ 点击异常指标（橙色脉冲点）
Level 1 归因分析（瀑布图）
    ↓ 点击最大贡献因子（🔍 查看对象详情）
Level 2 对象 360° 视图
    ↓ 点击关联对象继续探索
Level 2 另一个对象的 360° 视图
    ↓ 点击「⚡ 执行操作」
Level 3 AI 建议 + 行动面板（一键补货/调价/触达）
```

面包屑导航支持**任意层级回跳**。

---

## 🧱 本体层设计

### 对象（Objects）

| 对象 | 属性 | 说明 |
|------|------|------|
| `Product` | productId, category, price, cost, stock, rating, salesVolume, returnRate | 商品 |
| `Order` | orderId, payAmount, channel, status, province | 订单 |
| `Customer` | customerId, customerType, memberLevel, ltv | 客户 |
| `Supplier` | supplierId, leadTime, qualityScore, onTimeRate | 供应商 |
| `Campaign` | campaignId, campaignType, budget, roi | 营销活动 |

### 关系（Links）

```
Order ──────→ Product    (一对多)
Order ──────→ Customer   (多对一)
Product ────→ Supplier   (多对一)
Campaign ───→ Product    (一对多)
Campaign ───→ Order      (一对多)
Customer ───→ Customer   (推荐关系)
```

### 操作（Actions）

| Action | 目标对象 | 说明 |
|--------|---------|------|
| `restock` | Product | 一键补货 |
| `reprice` | Product | 执行调价 |
| `launchCampaign` | Campaign | 启动活动 |
| `reachCustomer` | Customer | 客户触达 |
| `flagSupplier` | Supplier | 供应商预警 |

---

## 🎨 样式风格

- **暗色主题**（`#0d1117` 深色背景 + 高对比度文字）
- **卡片化布局**（每个业务实体独立卡片）
- **异常高亮**：橙色脉冲点 + 橙色边框
- **增长绿色**（`#48bb78`），下滑红色（`#fc8181`）
- 整体参考 Palantir Foundry UI 风格

---

## 技术栈

- **React 19** + **TypeScript 5.7**
- **Vite 8** (构建工具)
- **ECharts 5** + **echarts-for-react** (图表)
- 纯前端项目，**无需后端**，内置 FauxFoundry Mock 数据
