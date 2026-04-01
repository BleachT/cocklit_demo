// ============================================================
// Attribution Analysis — Root-cause decomposition engine
// ============================================================

import type { AttributionResult } from '../ontology/types';
import { gmvTrendData } from '../ontology/mock-data';

/**
 * Compute KPI metrics for the current period vs. previous period.
 */
export function computeKPIs() {
  const current = gmvTrendData[gmvTrendData.length - 1];
  const previous = gmvTrendData[gmvTrendData.length - 2];

  return {
    gmv: {
      id: 'gmv',
      label: 'GMV',
      value: current.gmv,
      previousValue: previous.gmv,
      unit: '¥',
      trend: current.gmv >= previous.gmv ? 'up' as const : 'down' as const,
      isAnomaly: false,
      format: 'currency' as const,
    },
    orders: {
      id: 'orders',
      label: '订单量',
      value: current.orders,
      previousValue: previous.orders,
      unit: '单',
      trend: current.orders >= previous.orders ? 'up' as const : 'down' as const,
      isAnomaly: false,
      format: 'count' as const,
    },
    grossMargin: {
      id: 'grossMargin',
      label: '毛利率',
      value: current.grossMargin,
      previousValue: previous.grossMargin,
      unit: '%',
      trend: current.grossMargin >= previous.grossMargin ? 'up' as const : 'down' as const,
      isAnomaly: current.grossMargin < 0.43,
      format: 'percent' as const,
    },
    activeCustomers: {
      id: 'activeCustomers',
      label: '活跃客户数',
      value: 3842,
      previousValue: 4128,
      unit: '人',
      trend: 'down' as const,
      isAnomaly: true,
      format: 'count' as const,
    },
    avgOrderValue: {
      id: 'avgOrderValue',
      label: '客单价',
      value: Math.round(current.gmv / current.orders),
      previousValue: Math.round(previous.gmv / previous.orders),
      unit: '¥',
      trend: 'up' as const,
      isAnomaly: false,
      format: 'currency' as const,
    },
    returnRate: {
      id: 'returnRate',
      label: '退货率',
      value: 0.068,
      previousValue: 0.054,
      unit: '%',
      trend: 'up' as const,
      isAnomaly: true,
      format: 'percent' as const,
    },
  };
}

/**
 * Gross-margin attribution: decompose the ∆ from 44.1% → 42.0%
 * using a waterfall breakdown of contributing factors.
 */
export function grossMarginAttribution(): AttributionResult {
  return {
    kpiId: 'grossMargin',
    kpiLabel: '毛利率',
    baseValue: 0.441,   // 2023-04
    currentValue: 0.420, // 2024-03
    delta: -0.021,
    factors: [
      {
        factor: '原材料涨价',
        contribution: -0.012,
        description: '主要供应商（S002、S005）原材料成本上涨 8-12%，直接压缩配件品类毛利',
        linkedObjectType: 'Supplier',
        linkedObjectId: 'S005',
      },
      {
        factor: '品类结构变化',
        contribution: -0.008,
        description: '低毛利配件品类销售占比从 32% 上升至 39%，拉低整体毛利率',
        linkedObjectType: 'Product',
        linkedObjectId: 'P005',
      },
      {
        factor: '促销折扣加深',
        contribution: -0.005,
        description: '3.8 女神节、318 车迷节两大促销活动折扣力度加大，ROI 下滑',
        linkedObjectType: 'Campaign',
        linkedObjectId: 'CP001',
      },
      {
        factor: '运费补贴',
        contribution: -0.003,
        description: '免运费门槛从 ¥99 降至 ¥59，运费补贴总额增加 ¥18.6 万',
      },
      {
        factor: '高毛利新品贡献',
        contribution: +0.008,
        description: '问界 M9 限量车模（P003）等高毛利新品上市，部分对冲了毛利下滑',
        linkedObjectType: 'Product',
        linkedObjectId: 'P003',
      },
    ],
  };
}

/**
 * Active-customer attribution: decompose the drop 4128 → 3842
 */
export function activeCustomerAttribution(): AttributionResult {
  return {
    kpiId: 'activeCustomers',
    kpiLabel: '活跃客户数',
    baseValue: 4128,
    currentValue: 3842,
    delta: -286,
    factors: [
      {
        factor: '老客户流失',
        contribution: -420,
        description: '钻石/金卡会员活跃度下降，流失率较上期提升 2.3ppt',
        linkedObjectType: 'Customer',
        linkedObjectId: 'C006',
      },
      {
        factor: '活动吸引新客',
        contribution: +198,
        description: '318 车迷节吸引 198 位新客户完成首单',
        linkedObjectType: 'Campaign',
        linkedObjectId: 'CP002',
      },
      {
        factor: '渠道流量下降',
        contribution: -148,
        description: 'APP 渠道自然流量环比下降 18%，获客效率降低',
      },
      {
        factor: '推荐裂变贡献',
        contribution: +84,
        description: '老客户推荐裂变带来 84 位新注册用户',
        linkedObjectType: 'Customer',
        linkedObjectId: 'C001',
      },
    ],
  };
}

/**
 * Channel distribution data for pie chart
 */
export function getChannelDistribution() {
  return [
    { channel: 'APP',   value: 38.5, amount: 161123 },
    { channel: '小程序', value: 29.2, amount: 122202 },
    { channel: '官网',   value: 20.3, amount: 84966  },
    { channel: '4S店',  value: 12.0, amount: 50220  },
  ];
}

/**
 * Category sales data for bar chart
 */
export function getCategorySales() {
  return [
    { category: '配件',   gmv: 186000, margin: 0.388, yoy: 0.142 },
    { category: '车模',   gmv: 142000, margin: 0.524, yoy: 0.218 },
    { category: '生活用品', gmv: 58000, margin: 0.614, yoy: 0.089 },
    { category: '服饰',   gmv: 32500, margin: 0.578, yoy: -0.032 },
  ];
}
