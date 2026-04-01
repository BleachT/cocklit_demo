// ============================================================
// WaterfallChart — Level 1: Attribution Analysis
// ============================================================

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { AttributionResult, AttributionFactor } from '../ontology/types';

interface WaterfallChartProps {
  result: AttributionResult;
  onFactorClick?: (factor: AttributionFactor) => void;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ result, onFactorClick }) => {
  const isPercent = result.kpiId === 'grossMargin';
  const multiplier = isPercent ? 100 : 1;

  const fmt = (v: number) =>
    isPercent
      ? `${(v * 100).toFixed(1)}%`
      : v.toLocaleString();

  const fmtDelta = (v: number) =>
    isPercent
      ? `${v >= 0 ? '+' : ''}${(v * 100).toFixed(1)}ppt`
      : `${v >= 0 ? '+' : ''}${v.toLocaleString()}`;

  const { categories, bases, increases, decreases } = useMemo(() => {
    const cats: string[] = ['基准值', ...result.factors.map((f) => f.factor), '当前值'];
    const bases: number[] = [];
    const increases: number[] = [];
    const decreases: number[] = [];

    let running = result.baseValue * multiplier;

    // First bar: base value (transparent base = 0, increase = value)
    bases.push(0);
    increases.push(running);
    decreases.push(0);

    for (const f of result.factors) {
      const v = f.contribution * multiplier;
      bases.push(running);
      if (v >= 0) {
        increases.push(v);
        decreases.push(0);
        running += v;
      } else {
        increases.push(0);
        decreases.push(-v);
        running += v;
      }
    }

    // Final bar: current value
    bases.push(0);
    increases.push(result.currentValue * multiplier);
    decreases.push(0);

    return { categories: cats, bases, increases, decreases };
  }, [result, multiplier]);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: Array<{ seriesName: string; value: number; dataIndex: number }>) => {
        const idx = params[0].dataIndex;
        const label = categories[idx];
        if (idx === 0) return `基准值：${fmt(result.baseValue)}`;
        if (idx === categories.length - 1) return `当前值：${fmt(result.currentValue)}`;
        const factor = result.factors[idx - 1];
        const sign = factor.contribution >= 0 ? '+' : '';
        return `<b>${label}</b><br/>${sign}${fmt(factor.contribution)}<br/>${factor.description}`;
      },
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        color: '#a0aec0',
        rotate: 20,
        fontSize: 11,
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      },
      axisLine: { lineStyle: { color: '#2d3748' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#a0aec0',
        formatter: (v: number) => isPercent ? `${v.toFixed(1)}%` : v.toLocaleString(),
        fontSize: 11,
        fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      },
      splitLine: { lineStyle: { color: '#2d3748' } },
    },
    series: [
      {
        name: '基础',
        type: 'bar',
        stack: 'waterfall',
        itemStyle: { borderColor: 'transparent', color: 'transparent' },
        emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
        data: bases,
      },
      {
        name: '增加',
        type: 'bar',
        stack: 'waterfall',
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            if (params.dataIndex === 0 || params.dataIndex === categories.length - 1)
              return '#4299e1';
            return '#48bb78';
          },
        },
        data: increases,
      },
      {
        name: '减少',
        type: 'bar',
        stack: 'waterfall',
        itemStyle: { color: '#fc8181' },
        data: decreases,
      },
    ],
    grid: { left: 60, right: 20, top: 30, bottom: 60 },
  };

  return (
    <div className="waterfall-chart">
      <div className="waterfall-chart__header">
        <div className="waterfall-chart__title">
          {result.kpiLabel} 归因分析
          <span className="waterfall-chart__delta">
            {fmt(result.baseValue)} → {fmt(result.currentValue)}
            （{fmtDelta(result.delta)}）
          </span>
        </div>
        <div className="waterfall-chart__legend">
          <span className="legend-dot" style={{ background: '#48bb78' }} />正向贡献
          <span className="legend-dot" style={{ background: '#fc8181', marginLeft: 16 }} />负向拖累
        </div>
      </div>
      <ReactECharts option={option} style={{ height: 280 }} />
      <div className="waterfall-chart__factors">
        {result.factors.map((f) => (
          <div
            key={f.factor}
            className={`factor-item ${f.contribution < 0 ? 'factor-item--negative' : 'factor-item--positive'} ${f.linkedObjectType ? 'factor-item--clickable' : ''}`}
            onClick={() => f.linkedObjectType && onFactorClick && onFactorClick(f)}
          >
            <span className={`factor-item__badge ${f.contribution < 0 ? 'badge--neg' : 'badge--pos'}`}>
              {f.contribution >= 0 ? '+' : ''}{isPercent ? `${(f.contribution * 100).toFixed(1)}ppt` : f.contribution.toLocaleString()}
            </span>
            <span className="factor-item__name">{f.factor}</span>
            <span className="factor-item__desc">{f.description}</span>
            {f.linkedObjectType && (
              <span className="factor-item__drill">🔍 查看对象详情 →</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterfallChart;
