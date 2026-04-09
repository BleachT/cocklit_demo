# 🚗 好物商城数据驾驶舱 · Car Accessories Mall Data Cockpit

车企车周边好物商城一站式数据驾驶舱，帮助运营/商品/供应链/市场团队快速发现问题、理解根因、指导行动。

## 功能模块

| 模块 | 功能描述 |
|------|---------|
| 🏠 **总览大盘** | GMV / 订单 / 用户 / 客单价 / 退货率 核心 KPI，90日趋势，异常区间高亮 |
| 📊 **销售分析** | 品类 / 渠道 / 区域 / 品牌 多维度销售拆解，支持下钻 |
| 📦 **库存监控** | 实时库存健康评分，自动识别缺货 / 积压 SKU，可售天数可视化 |
| 👥 **用户洞察** | 购买转化漏斗，用户留存队列热力图，客单价与复购分析 |
| 🔔 **问题发现 & 行动建议** | 自动告警（严重 / 警告 / 提示），根因分析，结构化行动建议 |

## 快速启动

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 启动驾驶舱
streamlit run app.py
```

浏览器访问 `http://localhost:8501`

## 技术方案

详见 [docs/architecture.md](docs/architecture.md)

### 数据架构概览

```
数据源 → Kafka CDC → Flink(实时) / Spark(离线) → ClickHouse/Hive → API服务 → 驾驶舱
```

### 技术栈

- **前端**：Streamlit + Plotly
- **数据**：Pandas（生产环境替换为 ClickHouse 查询）
- **实时计算**（生产）：Apache Flink + Kafka
- **离线计算**（生产）：Apache Spark + Hive/Iceberg
- **OLAP**（生产）：ClickHouse

## 目录结构

```
cocklit_demo/
├── app.py              # 主驾驶舱应用
├── requirements.txt    # Python 依赖
├── data/
│   └── mock_data.py    # 模拟数据生成（生产替换为 ClickHouse SQL）
└── docs/
    └── architecture.md # 完整技术方案文档
```