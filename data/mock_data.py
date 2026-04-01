"""
Mock data generator for the car accessories mall dashboard.
Generates realistic time-series and categorical data for demonstration.
"""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

# ── constants ──────────────────────────────────────────────────────────────────
CATEGORIES = ["车内装饰", "座椅配件", "电子配件", "清洁护理", "改装精品", "驾驶辅助", "车载音响", "儿童安全"]
CHANNELS = ["APP", "小程序", "H5", "PC官网", "线下门店"]
REGIONS = ["华东", "华南", "华北", "华中", "西南", "西北", "东北"]
BRANDS = ["奔驰", "宝马", "奥迪", "特斯拉", "比亚迪", "大众", "丰田", "本田", "蔚来", "小鹏"]


# ── daily GMV & order data (90 days) ─────────────────────────────────────────
def get_daily_kpi(days: int = 90) -> pd.DataFrame:
    dates = pd.date_range(end=datetime.today(), periods=days, freq="D")
    base_gmv = 500_000
    trend = np.linspace(0, 80_000, days)
    weekly_seasonality = 30_000 * np.sin(np.arange(days) * 2 * np.pi / 7)
    noise = np.random.normal(0, 15_000, days)
    # simulate a sudden drop in the last 7 days (problem to detect)
    anomaly = np.zeros(days)
    anomaly[-7:] = -120_000
    gmv = base_gmv + trend + weekly_seasonality + noise + anomaly
    gmv = np.maximum(gmv, 50_000)

    orders = (gmv / np.random.uniform(280, 320, days)).astype(int)
    new_users = (orders * np.random.uniform(0.35, 0.55, days)).astype(int)
    return_rate = np.clip(0.05 + np.random.normal(0, 0.01, days), 0.02, 0.15)
    # spike in return rate last 5 days
    return_rate[-5:] = np.clip(return_rate[-5:] + 0.06, 0, 0.25)

    df = pd.DataFrame(
        {
            "date": dates,
            "gmv": gmv.round(2),
            "orders": orders,
            "new_users": new_users,
            "return_rate": return_rate.round(4),
            "avg_order_value": (gmv / orders).round(2),
        }
    )
    return df


# ── category sales breakdown ─────────────────────────────────────────────────
def get_category_sales(days: int = 30) -> pd.DataFrame:
    dates = pd.date_range(end=datetime.today(), periods=days, freq="D")
    records = []
    cat_base = {
        "车内装饰": 80_000, "座椅配件": 65_000, "电子配件": 120_000,
        "清洁护理": 40_000, "改装精品": 55_000, "驾驶辅助": 95_000,
        "车载音响": 72_000, "儿童安全": 30_000,
    }
    for d in dates:
        for cat, base in cat_base.items():
            noise = np.random.normal(0, base * 0.1)
            sales = max(base + noise, 1000)
            records.append({"date": d, "category": cat, "sales": round(sales, 2),
                             "orders": int(sales / np.random.uniform(260, 340))})
    return pd.DataFrame(records)


# ── channel contribution ──────────────────────────────────────────────────────
def get_channel_sales(days: int = 30) -> pd.DataFrame:
    dates = pd.date_range(end=datetime.today(), periods=days, freq="D")
    channel_share = {"APP": 0.38, "小程序": 0.28, "H5": 0.12, "PC官网": 0.10, "线下门店": 0.12}
    records = []
    for d in dates:
        daily_total = np.random.uniform(450_000, 650_000)
        for ch, share in channel_share.items():
            noise = np.random.normal(0, 0.02)
            sales = daily_total * max(share + noise, 0.01)
            records.append({"date": d, "channel": ch, "sales": round(sales, 2)})
    return pd.DataFrame(records)


# ── regional heatmap ──────────────────────────────────────────────────────────
def get_regional_sales() -> pd.DataFrame:
    region_base = {
        "华东": 2_200_000, "华南": 1_800_000, "华北": 1_600_000,
        "华中": 1_100_000, "西南": 900_000, "西北": 500_000, "东北": 700_000,
    }
    records = []
    for region, base in region_base.items():
        gmv = base + np.random.normal(0, base * 0.08)
        growth = np.random.uniform(-0.05, 0.20)
        records.append({"region": region, "gmv": round(max(gmv, 100_000), 2),
                         "growth_rate": round(growth, 4)})
    return pd.DataFrame(records)


# ── inventory status ──────────────────────────────────────────────────────────
def get_inventory_status() -> pd.DataFrame:
    products = [
        ("行车记录仪 Pro", "电子配件", 850), ("方向盘套装", "车内装饰", 120),
        ("座椅按摩垫", "座椅配件", 45), ("车载无线充电", "电子配件", 980),
        ("汽车香薰套装", "清洁护理", 1200), ("HUD抬头显示", "驾驶辅助", 60),
        ("儿童安全座椅", "儿童安全", 30), ("改装轮毂贴", "改装精品", 500),
        ("车载冰箱", "电子配件", 15), ("真皮座椅套", "座椅配件", 200),
        ("倒车雷达系统", "驾驶辅助", 8), ("车载蓝牙音响", "车载音响", 400),
        ("漆面保护膜", "清洁护理", 680), ("车内氛围灯", "车内装饰", 950),
        ("行李箱固定架", "改装精品", 5),
    ]
    records = []
    for name, cat, stock in products:
        daily_sales = np.random.randint(5, 40)
        safety_stock = daily_sales * 14
        overstock_threshold = daily_sales * 90
        status = "正常"
        if stock < safety_stock * 0.5:
            status = "严重缺货"
        elif stock < safety_stock:
            status = "库存预警"
        elif stock > overstock_threshold:
            status = "库存积压"
        records.append({
            "product": name, "category": cat, "stock": stock,
            "daily_sales": daily_sales, "safety_stock": safety_stock,
            "days_of_supply": round(stock / max(daily_sales, 1), 1),
            "status": status,
        })
    return pd.DataFrame(records)


# ── user funnel ───────────────────────────────────────────────────────────────
def get_user_funnel() -> pd.DataFrame:
    stages = ["访问", "浏览商品", "加入购物车", "发起支付", "支付成功"]
    users = [100_000, 62_000, 28_000, 18_500, 15_200]
    return pd.DataFrame({"stage": stages, "users": users})


# ── retention cohort (8 weeks) ────────────────────────────────────────────────
def get_retention_cohort() -> pd.DataFrame:
    cohort_size = 5000
    weeks = 8
    retention = np.zeros((weeks, weeks))
    for i in range(weeks):
        cohort_users = cohort_size + np.random.randint(-300, 300)
        retention[i][0] = cohort_users
        decay = np.random.uniform(0.35, 0.50)
        for j in range(1, weeks - i):
            prev = retention[i][j - 1]
            retention[i][j] = round(prev * (1 - decay + np.random.uniform(-0.05, 0.05)))
    labels = [f"W{i+1}" for i in range(weeks)]
    df = pd.DataFrame(retention.astype(int), index=labels, columns=labels)
    # mask future cells
    for i in range(weeks):
        for j in range(i + 1, weeks):
            df.iloc[i, j] = np.nan
    return df


# ── brand affinity ────────────────────────────────────────────────────────────
def get_brand_affinity() -> pd.DataFrame:
    records = []
    for brand in BRANDS:
        gmv = np.random.uniform(200_000, 1_500_000)
        orders = int(gmv / np.random.uniform(250, 350))
        avg_price = round(gmv / orders, 2)
        repeat_rate = round(np.random.uniform(0.15, 0.55), 2)
        records.append({"brand": brand, "gmv": round(gmv, 2),
                         "orders": orders, "avg_price": avg_price,
                         "repeat_rate": repeat_rate})
    return pd.DataFrame(records).sort_values("gmv", ascending=False)


# ── alert / problem discovery ─────────────────────────────────────────────────
def get_alerts() -> list[dict]:
    alerts = [
        {
            "level": "🔴 严重",
            "module": "销售",
            "title": "近7日GMV环比下滑 19.3%",
            "detail": "近7日累计GMV约 ¥2,891,000，较上一周期下滑19.3%，已触发下滑告警阈值（-15%）。",
            "root_cause": "分析：主要由「电子配件」品类下滑37%驱动，APP渠道流量损失约22%。",
            "actions": [
                "立即排查 APP 首页「电子配件」入口曝光是否异常（需产品团队）",
                "启动电子配件品类紧急促销活动（需运营团队）",
                "联系头部 KOL 发布行车记录仪测评内容（需市场团队）",
            ],
        },
        {
            "level": "🔴 严重",
            "module": "库存",
            "title": "3 款 SKU 库存告急（<3天供应量）",
            "detail": "行李箱固定架（5件）、倒车雷达系统（8件）、儿童安全座椅（30件）当前库存不足3天销售量。",
            "root_cause": "近14日销售加速 + 补货周期未提前调整。",
            "actions": [
                "立即触发紧急补货采购申请（需供应链团队）",
                "临时下架该商品或添加「预计补货」说明防止超卖",
                "检查并缩短供应商补货周期 SLA",
            ],
        },
        {
            "level": "🟡 警告",
            "module": "用户",
            "title": "近5日退货率上升至 11.2%（正常水平 5%）",
            "detail": "退货率环比上升 6.2 个百分点，集中在「座椅按摩垫」和「行车记录仪 Pro」两款产品。",
            "root_cause": "初步判断为最近一批次产品质量问题或描述与实物不符。",
            "actions": [
                "抽检近期入库的上述两款产品质量（需品控团队）",
                "审核商品详情页描述和图片是否存在夸大宣传",
                "主动联系近期购买用户，提前介入售后避免差评扩散",
            ],
        },
        {
            "level": "🟡 警告",
            "module": "库存",
            "title": "2 款 SKU 库存严重积压（>90天供应量）",
            "detail": "汽车香薰套装（1200件）、车内氛围灯（950件）库存周转天数超90天，占用资金约¥68万。",
            "root_cause": "预测偏差 + 采购量过大，需要清仓处理。",
            "actions": [
                "策划「清仓特卖」专场活动，设置折扣定价",
                "将积压商品加入满减凑单推荐位",
                "调整下一采购周期采购量，优化预测模型",
            ],
        },
        {
            "level": "🟢 提示",
            "module": "用户",
            "title": "「驾驶辅助」品类搜索量环比增长 45%",
            "detail": "过去7日「驾驶辅助」相关搜索词增长显著，但该品类转化率仅3.2%（大盘均值6.8%）。",
            "root_cause": "需求增长但供给/内容未跟上，存在显著商业机会。",
            "actions": [
                "丰富驾驶辅助品类 SKU，引入新品牌/新产品",
                "优化该品类搜索结果页排序逻辑",
                "制作驾驶辅助专题内容页提升转化",
            ],
        },
    ]
    return alerts
