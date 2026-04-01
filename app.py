"""
车企车周边好物商城 · 数据驾驶舱
Car Accessories Mall · Data Cockpit Dashboard

Architecture:
  Data Layer  → Mock data (production: ClickHouse / Hive)
  Compute Layer → Pandas (production: Flink real-time + Spark offline)
  Presentation → Streamlit + Plotly
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from data.mock_data import (
    get_daily_kpi,
    get_category_sales,
    get_channel_sales,
    get_regional_sales,
    get_inventory_status,
    get_user_funnel,
    get_retention_cohort,
    get_brand_affinity,
    get_alerts,
)

# ── page config ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="好物商城数据驾驶舱",
    page_icon="🚗",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── global CSS ─────────────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
    .metric-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 1px solid #0f3460;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 8px;
    }
    .alert-critical { border-left: 4px solid #ff4b4b; background: #2d1b1b; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
    .alert-warning  { border-left: 4px solid #ffa500; background: #2d2010; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
    .alert-info     { border-left: 4px solid #00cc88; background: #0d2b20; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; }
    .section-title  { font-size: 1.2rem; font-weight: 700; color: #e0e0e0; margin: 16px 0 8px 0; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── sidebar ────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.image(
        "https://img.icons8.com/fluency/96/null/dashboard.png",
        width=60,
    )
    st.title("🚗 好物商城驾驶舱")
    st.caption("Car Accessories Mall · Data Cockpit")
    st.divider()

    page = st.radio(
        "📍 导航",
        [
            "🏠 总览大盘",
            "📊 销售分析",
            "📦 库存监控",
            "👥 用户洞察",
            "🔔 问题发现 & 行动建议",
        ],
        label_visibility="collapsed",
    )

    st.divider()
    st.caption("数据更新：准实时（5分钟延迟）")
    st.caption("数据来源：订单系统 · 用户系统 · 库存系统")

# ── data loading (cached) ─────────────────────────────────────────────────────
@st.cache_data(ttl=300)
def load_all():
    return {
        "kpi": get_daily_kpi(90),
        "cat": get_category_sales(30),
        "channel": get_channel_sales(30),
        "region": get_regional_sales(),
        "inventory": get_inventory_status(),
        "funnel": get_user_funnel(),
        "retention": get_retention_cohort(),
        "brand": get_brand_affinity(),
        "alerts": get_alerts(),
    }


data = load_all()

# ══════════════════════════════════════════════════════════════════════════════
# PAGE 1 · 总览大盘
# ══════════════════════════════════════════════════════════════════════════════
if page == "🏠 总览大盘":
    st.title("🏠 总览大盘")
    st.caption("核心指标一览 · 快速感知经营健康度")

    kpi = data["kpi"]
    recent7 = kpi.tail(7)
    prev7 = kpi.iloc[-14:-7]

    def delta_pct(cur, prev):
        diff = (cur - prev) / prev * 100
        return f"{'+' if diff >= 0 else ''}{diff:.1f}%"

    gmv_now = recent7["gmv"].sum()
    gmv_prev = prev7["gmv"].sum()
    orders_now = int(recent7["orders"].sum())
    orders_prev = int(prev7["orders"].sum())
    users_now = int(recent7["new_users"].sum())
    users_prev = int(prev7["new_users"].sum())
    aov_now = recent7["avg_order_value"].mean()
    aov_prev = prev7["avg_order_value"].mean()
    rr_now = recent7["return_rate"].mean() * 100
    rr_prev = prev7["return_rate"].mean() * 100

    col1, col2, col3, col4, col5 = st.columns(5)
    col1.metric("💰 近7日GMV", f"¥{gmv_now/1e6:.2f}M", delta_pct(gmv_now, gmv_prev))
    col2.metric("📦 近7日订单量", f"{orders_now:,}", delta_pct(orders_now, orders_prev))
    col3.metric("🆕 近7日新增用户", f"{users_now:,}", delta_pct(users_now, users_prev))
    col4.metric("🛒 客单价", f"¥{aov_now:.0f}", delta_pct(aov_now, aov_prev))
    col5.metric(
        "↩️ 退货率",
        f"{rr_now:.1f}%",
        f"{'+' if rr_now - rr_prev >= 0 else ''}{rr_now - rr_prev:.1f}pp",
        delta_color="inverse",
    )

    st.divider()

    # GMV trend with anomaly annotation
    fig_gmv = px.area(
        kpi,
        x="date",
        y="gmv",
        title="90日GMV趋势（近7日出现下滑异常）",
        labels={"gmv": "GMV (¥)", "date": "日期"},
        color_discrete_sequence=["#4dabf7"],
    )
    # highlight anomaly window
    fig_gmv.add_vrect(
        x0=kpi["date"].iloc[-7],
        x1=kpi["date"].iloc[-1],
        fillcolor="rgba(255, 75, 75, 0.15)",
        line_width=0,
        annotation_text="⚠️ 异常下滑",
        annotation_position="top left",
    )
    fig_gmv.update_layout(
        plot_bgcolor="#0e1117", paper_bgcolor="#0e1117",
        font_color="#c0c0c0", height=320,
    )
    st.plotly_chart(fig_gmv, use_container_width=True)

    col_a, col_b = st.columns(2)
    with col_a:
        fig_ord = px.bar(
            kpi.tail(30),
            x="date",
            y="orders",
            title="近30日日订单量",
            color_discrete_sequence=["#74c0fc"],
        )
        fig_ord.update_layout(plot_bgcolor="#0e1117", paper_bgcolor="#0e1117",
                               font_color="#c0c0c0", height=280)
        st.plotly_chart(fig_ord, use_container_width=True)

    with col_b:
        fig_rr = px.line(
            kpi.tail(30),
            x="date",
            y="return_rate",
            title="近30日退货率趋势",
            color_discrete_sequence=["#ff6b6b"],
            labels={"return_rate": "退货率"},
        )
        fig_rr.add_hline(y=0.05, line_dash="dash", line_color="orange",
                          annotation_text="正常基线 5%")
        fig_rr.update_layout(plot_bgcolor="#0e1117", paper_bgcolor="#0e1117",
                              font_color="#c0c0c0", height=280,
                              yaxis_tickformat=".1%")
        st.plotly_chart(fig_rr, use_container_width=True)

    # alert summary banner
    alerts = data["alerts"]
    critical = [a for a in alerts if "严重" in a["level"]]
    warning = [a for a in alerts if "警告" in a["level"]]
    info = [a for a in alerts if "提示" in a["level"]]
    st.info(
        f"🔔 当前告警：**{len(critical)} 个严重** · **{len(warning)} 个警告** · **{len(info)} 个提示** "
        f"→ 前往「🔔 问题发现 & 行动建议」查看详情",
        icon="🚨",
    )


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 2 · 销售分析
# ══════════════════════════════════════════════════════════════════════════════
elif page == "📊 销售分析":
    st.title("📊 销售分析")
    st.caption("品类 · 渠道 · 区域 · 品牌多维度拆解")

    tab1, tab2, tab3, tab4 = st.tabs(["品类分析", "渠道分析", "区域分析", "品牌分析"])

    with tab1:
        cat_df = data["cat"]
        cat_agg = cat_df.groupby("category")[["sales", "orders"]].sum().reset_index()
        cat_agg["avg_order_value"] = (cat_agg["sales"] / cat_agg["orders"]).round(2)
        cat_agg = cat_agg.sort_values("sales", ascending=False)

        col1, col2 = st.columns(2)
        with col1:
            fig_pie = px.pie(
                cat_agg,
                names="category",
                values="sales",
                title="品类GMV占比（近30日）",
                hole=0.4,
            )
            fig_pie.update_layout(paper_bgcolor="#0e1117", font_color="#c0c0c0", height=380)
            st.plotly_chart(fig_pie, use_container_width=True)
        with col2:
            fig_bar = px.bar(
                cat_agg,
                x="sales",
                y="category",
                orientation="h",
                title="品类销售额排行",
                color="sales",
                color_continuous_scale="Blues",
                text_auto=".2s",
            )
            fig_bar.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                   font_color="#c0c0c0", height=380, showlegend=False,
                                   coloraxis_showscale=False)
            st.plotly_chart(fig_bar, use_container_width=True)

        # time series by category
        cat_top4 = cat_agg.nlargest(4, "sales")["category"].tolist()
        fig_line = px.line(
            cat_df[cat_df["category"].isin(cat_top4)],
            x="date",
            y="sales",
            color="category",
            title="Top4 品类销售额趋势（近30日）",
        )
        fig_line.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                font_color="#c0c0c0", height=320)
        st.plotly_chart(fig_line, use_container_width=True)

    with tab2:
        ch_df = data["channel"]
        ch_agg = ch_df.groupby("channel")["sales"].sum().reset_index().sort_values("sales", ascending=False)

        col1, col2 = st.columns(2)
        with col1:
            fig_ch_pie = px.pie(ch_agg, names="channel", values="sales",
                                 title="渠道GMV占比（近30日）", hole=0.4)
            fig_ch_pie.update_layout(paper_bgcolor="#0e1117", font_color="#c0c0c0", height=360)
            st.plotly_chart(fig_ch_pie, use_container_width=True)
        with col2:
            fig_ch_trend = px.area(
                ch_df, x="date", y="sales", color="channel",
                title="各渠道日销售额趋势（近30日）",
            )
            fig_ch_trend.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                        font_color="#c0c0c0", height=360)
            st.plotly_chart(fig_ch_trend, use_container_width=True)

    with tab3:
        reg_df = data["region"]
        col1, col2 = st.columns(2)
        with col1:
            fig_reg = px.bar(
                reg_df.sort_values("gmv"),
                x="gmv",
                y="region",
                orientation="h",
                title="区域GMV（近30日）",
                color="gmv",
                color_continuous_scale="Teal",
                text_auto=".2s",
            )
            fig_reg.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                   font_color="#c0c0c0", height=360,
                                   coloraxis_showscale=False)
            st.plotly_chart(fig_reg, use_container_width=True)
        with col2:
            reg_df["growth_label"] = reg_df["growth_rate"].apply(
                lambda x: f"{'+' if x >= 0 else ''}{x*100:.1f}%"
            )
            reg_df["color"] = reg_df["growth_rate"].apply(
                lambda x: "#ff6b6b" if x < 0 else "#51cf66"
            )
            fig_growth = px.bar(
                reg_df.sort_values("growth_rate"),
                x="growth_rate",
                y="region",
                orientation="h",
                title="区域增长率",
                color="growth_rate",
                color_continuous_scale="RdYlGn",
                text="growth_label",
            )
            fig_growth.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                      font_color="#c0c0c0", height=360,
                                      coloraxis_showscale=False)
            fig_growth.update_traces(textposition="outside")
            st.plotly_chart(fig_growth, use_container_width=True)

    with tab4:
        brand_df = data["brand"]
        col1, col2 = st.columns(2)
        with col1:
            fig_brand = px.bar(
                brand_df,
                x="brand",
                y="gmv",
                title="各车系品牌用户GMV贡献",
                color="gmv",
                color_continuous_scale="Purples",
                text_auto=".2s",
            )
            fig_brand.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                     font_color="#c0c0c0", height=360,
                                     coloraxis_showscale=False)
            st.plotly_chart(fig_brand, use_container_width=True)
        with col2:
            fig_scatter = px.scatter(
                brand_df,
                x="avg_price",
                y="repeat_rate",
                size="orders",
                color="brand",
                title="品牌用户客单价 vs 复购率（气泡大小=订单量）",
                labels={"avg_price": "客单价 (¥)", "repeat_rate": "复购率"},
            )
            fig_scatter.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                       font_color="#c0c0c0", height=360)
            st.plotly_chart(fig_scatter, use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 3 · 库存监控
# ══════════════════════════════════════════════════════════════════════════════
elif page == "📦 库存监控":
    st.title("📦 库存监控")
    st.caption("实时库存健康度 · 自动识别缺货/积压风险")

    inv = data["inventory"]

    # summary cards
    total_sku = len(inv)
    critical_sku = len(inv[inv["status"] == "严重缺货"])
    warning_sku = len(inv[inv["status"] == "库存预警"])
    overstock_sku = len(inv[inv["status"] == "库存积压"])
    normal_sku = len(inv[inv["status"] == "正常"])

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("📋 监控SKU总数", total_sku)
    c2.metric("🔴 严重缺货", critical_sku, delta="需立即处理", delta_color="inverse")
    c3.metric("🟡 库存预警", warning_sku, delta="需关注", delta_color="off")
    c4.metric("📦 库存积压", overstock_sku, delta="占用资金", delta_color="inverse")

    st.divider()

    # color-coded inventory table
    status_color = {
        "严重缺货": "🔴",
        "库存预警": "🟡",
        "库存积压": "🔵",
        "正常": "🟢",
    }
    inv_display = inv.copy()
    inv_display["状态"] = inv_display["status"].map(status_color) + " " + inv_display["status"]
    inv_display = inv_display.rename(columns={
        "product": "商品名称",
        "category": "品类",
        "stock": "当前库存",
        "daily_sales": "日均销量",
        "safety_stock": "安全库存",
        "days_of_supply": "可售天数",
    })[["商品名称", "品类", "当前库存", "日均销量", "安全库存", "可售天数", "状态"]]

    st.dataframe(
        inv_display.sort_values("可售天数"),
        use_container_width=True,
        height=420,
    )

    st.divider()
    col1, col2 = st.columns(2)

    with col1:
        fig_dos = px.bar(
            inv.sort_values("days_of_supply"),
            x="days_of_supply",
            y="product",
            orientation="h",
            color="status",
            title="各SKU可售天数（Days of Supply）",
            color_discrete_map={
                "严重缺货": "#ff4b4b",
                "库存预警": "#ffa500",
                "库存积压": "#339af0",
                "正常": "#51cf66",
            },
            labels={"days_of_supply": "可售天数", "product": "商品"},
        )
        fig_dos.add_vline(x=14, line_dash="dash", line_color="orange",
                           annotation_text="安全线(14天)")
        fig_dos.add_vline(x=90, line_dash="dash", line_color="#339af0",
                           annotation_text="积压线(90天)")
        fig_dos.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                               font_color="#c0c0c0", height=500)
        st.plotly_chart(fig_dos, use_container_width=True)

    with col2:
        status_counts = inv["status"].value_counts().reset_index()
        status_counts.columns = ["status", "count"]
        fig_status = px.pie(
            status_counts,
            names="status",
            values="count",
            title="库存健康分布",
            color="status",
            color_discrete_map={
                "严重缺货": "#ff4b4b",
                "库存预警": "#ffa500",
                "库存积压": "#339af0",
                "正常": "#51cf66",
            },
            hole=0.5,
        )
        fig_status.update_layout(paper_bgcolor="#0e1117", font_color="#c0c0c0", height=300)
        st.plotly_chart(fig_status, use_container_width=True)

        cat_inv = inv.groupby("category")["stock"].sum().reset_index().sort_values("stock", ascending=False)
        fig_cat_inv = px.bar(
            cat_inv,
            x="category",
            y="stock",
            title="各品类库存量",
            color="stock",
            color_continuous_scale="Blues",
            text_auto=True,
        )
        fig_cat_inv.update_layout(paper_bgcolor="#0e1117", plot_bgcolor="#0e1117",
                                   font_color="#c0c0c0", height=280,
                                   coloraxis_showscale=False)
        st.plotly_chart(fig_cat_inv, use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 4 · 用户洞察
# ══════════════════════════════════════════════════════════════════════════════
elif page == "👥 用户洞察":
    st.title("👥 用户洞察")
    st.caption("转化漏斗 · 留存分析 · 品牌偏好")

    col1, col2 = st.columns(2)

    with col1:
        funnel_df = data["funnel"]
        funnel_df["conversion"] = funnel_df["users"] / funnel_df["users"].iloc[0]
        fig_funnel = go.Figure(go.Funnel(
            y=funnel_df["stage"],
            x=funnel_df["users"],
            textinfo="value+percent initial",
            marker=dict(color=["#4dabf7", "#339af0", "#1c7ed6", "#1864ab", "#0b4884"]),
        ))
        fig_funnel.update_layout(
            title="购买转化漏斗",
            paper_bgcolor="#0e1117",
            plot_bgcolor="#0e1117",
            font_color="#c0c0c0",
            height=400,
        )
        st.plotly_chart(fig_funnel, use_container_width=True)

        # key metrics
        purchase_rate = funnel_df["users"].iloc[-1] / funnel_df["users"].iloc[0] * 100
        cart_abandon = (1 - funnel_df["users"].iloc[-1] / funnel_df["users"].iloc[-3]) * 100
        st.metric("整体购买转化率", f"{purchase_rate:.1f}%")
        st.metric("购物车放弃率", f"{cart_abandon:.1f}%", delta="高于行业均值 68%", delta_color="inverse")

    with col2:
        retention = data["retention"]
        # convert to percentage relative to cohort week 1
        ret_pct = retention.copy()
        for col in ret_pct.columns:
            ret_pct[col] = (retention[col] / retention.iloc[:, 0] * 100).round(1)

        fig_ret = go.Figure(
            go.Heatmap(
                z=ret_pct.values,
                x=ret_pct.columns.tolist(),
                y=ret_pct.index.tolist(),
                colorscale="Blues",
                text=ret_pct.values,
                texttemplate="%{text:.0f}%",
                showscale=True,
            )
        )
        fig_ret.update_layout(
            title="用户留存率热力图（队列分析 · 8周）",
            paper_bgcolor="#0e1117",
            plot_bgcolor="#0e1117",
            font_color="#c0c0c0",
            height=400,
            xaxis_title="第N周",
            yaxis_title="入组周",
        )
        st.plotly_chart(fig_ret, use_container_width=True)

        # avg w2 and w4 retention
        w2_ret = ret_pct.iloc[:-1, 1].mean()
        w4_ret = ret_pct.iloc[:-3, 3].mean()
        st.metric("平均次周留存率", f"{w2_ret:.1f}%")
        st.metric("平均4周留存率", f"{w4_ret:.1f}%")

    st.divider()

    # KPI daily new users trend
    kpi = data["kpi"]
    fig_users = make_subplots(specs=[[{"secondary_y": True}]])
    fig_users.add_trace(
        go.Bar(x=kpi["date"].tail(30), y=kpi["new_users"].tail(30),
               name="新增用户", marker_color="#4dabf7"),
        secondary_y=False,
    )
    fig_users.add_trace(
        go.Scatter(x=kpi["date"].tail(30), y=kpi["avg_order_value"].tail(30),
                   name="客单价", line=dict(color="#ffd43b"), mode="lines+markers"),
        secondary_y=True,
    )
    fig_users.update_layout(
        title="近30日新增用户 & 客单价趋势",
        paper_bgcolor="#0e1117",
        plot_bgcolor="#0e1117",
        font_color="#c0c0c0",
        height=320,
        legend=dict(bgcolor="#0e1117"),
    )
    fig_users.update_yaxes(title_text="新增用户数", secondary_y=False)
    fig_users.update_yaxes(title_text="客单价 (¥)", secondary_y=True)
    st.plotly_chart(fig_users, use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
# PAGE 5 · 问题发现 & 行动建议
# ══════════════════════════════════════════════════════════════════════════════
elif page == "🔔 问题发现 & 行动建议":
    st.title("🔔 问题发现 & 行动建议")
    st.caption("基于数据异常自动识别问题 · 给出结构化行动建议")

    alerts = data["alerts"]

    level_filter = st.multiselect(
        "筛选告警级别",
        ["🔴 严重", "🟡 警告", "🟢 提示"],
        default=["🔴 严重", "🟡 警告", "🟢 提示"],
    )
    module_filter = st.multiselect(
        "筛选模块",
        list({a["module"] for a in alerts}),
        default=list({a["module"] for a in alerts}),
    )

    filtered = [
        a for a in alerts
        if a["level"] in level_filter and a["module"] in module_filter
    ]

    if not filtered:
        st.info("当前筛选条件下无告警。")
    else:
        for alert in filtered:
            level = alert["level"]
            if "严重" in level:
                css_class = "alert-critical"
            elif "警告" in level:
                css_class = "alert-warning"
            else:
                css_class = "alert-info"

            with st.expander(f"{alert['level']} | [{alert['module']}] {alert['title']}", expanded=("严重" in level)):
                st.markdown(f"**📋 问题描述**\n\n{alert['detail']}")
                st.markdown(f"**🔍 根因分析**\n\n{alert['root_cause']}")
                st.markdown("**✅ 建议行动**")
                for i, action in enumerate(alert["actions"], 1):
                    st.markdown(f"{i}. {action}")

    st.divider()

    # problem discovery methodology diagram
    st.subheader("🏗️ 问题发现机制说明")
    cols = st.columns(3)
    with cols[0]:
        st.markdown(
            """
            **📡 数据采集层**
            - 订单事件流（Kafka）
            - 用户行为日志（埋点SDK）
            - 库存变更消息队列
            - 营销活动数据同步
            """
        )
    with cols[1]:
        st.markdown(
            """
            **⚙️ 实时计算层**
            - Flink CEP 复杂事件检测
            - 滑动窗口 GMV 环比告警
            - 退货率异常检测（3σ规则）
            - 库存预测模型（安全库存线）
            """
        )
    with cols[2]:
        st.markdown(
            """
            **📢 通知与行动层**
            - 驾驶舱实时告警面板
            - 钉钉/企微 Webhook 推送
            - 工单系统自动创建
            - 行动建议 RAG 生成
            """
        )

    st.divider()
    st.subheader("📐 整体数据架构")
    st.markdown(
        """
        ```
        ┌─────────────────────────────────────────────────────────────────┐
        │                     数据源（Source Layer）                        │
        │  订单系统  用户系统  商品系统  库存系统  营销系统  外部数据（天气/节假日）   │
        └────────────────────────┬────────────────────────────────────────┘
                                 │ CDC / Kafka 消息流
        ┌────────────────────────▼────────────────────────────────────────┐
        │                   数据采集层（Ingestion）                          │
        │           Kafka + Debezium CDC + 埋点 SDK（神策/GrowingIO）        │
        └────────────────────────┬────────────────────────────────────────┘
                      ┌──────────┴──────────┐
                      │ 实时流              │ 批量
        ┌─────────────▼──────────┐  ┌───────▼──────────────────────────┐
        │ 实时计算（Flink）         │  │ 离线计算（Spark on Hive/Iceberg）  │
        │ · CEP 异常检测           │  │ · T+1 宽表加工                  │
        │ · 实时 GMV / 订单聚合    │  │ · 用户标签 / RFM 分层            │
        │ · 滑动窗口告警            │  │ · 归因分析 / 漏斗还原            │
        └─────────────┬──────────┘  └───────┬──────────────────────────┘
                      └──────────┬──────────┘
        ┌─────────────────────────▼───────────────────────────────────────┐
        │                   数据存储层（Storage）                            │
        │  ClickHouse（OLAP/驾驶舱查询）  +  Redis（实时指标缓存）              │
        │  Hive/Iceberg（离线数仓）  +  Elasticsearch（搜索/行为日志）         │
        └─────────────────────────┬───────────────────────────────────────┘
                                  │
        ┌─────────────────────────▼───────────────────────────────────────┐
        │                   数据服务层（API Layer）                          │
        │     指标平台 API  +  查询引擎代理  +  告警引擎  +  LLM 行动建议生成    │
        └─────────────────────────┬───────────────────────────────────────┘
                                  │
        ┌─────────────────────────▼───────────────────────────────────────┐
        │                   展示层（Presentation）                           │
        │            驾驶舱 Dashboard（本系统）  +  报表系统  +  移动端        │
        └─────────────────────────────────────────────────────────────────┘
        ```
        """
    )
