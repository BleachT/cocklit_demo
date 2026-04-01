// ============================================================
// CategoryChart — Category sales bar chart
// ============================================================

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { getCategorySales } from '../analysis/attribution';

const CategoryChart: React.FC = () => {
  const data = getCategorySales();
  const categories = data.map((d) => d.category);
  const gmvData = data.map((d) => Math.round(d.gmv / 10000 * 10) / 10);
  const marginData = data.map((d) => parseFloat((d.margin * 100).toFixed(1)));
  const yoyData = data.map((d) => parseFloat((d.yoy * 100).toFixed(1)));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e2532',
      borderColor: '#2d3748',
      textStyle: { color: '#e2e8f0' },
      axisPointer: { type: 'shadow' },
    },
    legend: {
      data: ['GMV(万元)', '毛利率(%)', '同比增长(%)'],
      textStyle: { color: '#a0aec0', fontSize: 11, fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: '#a0aec0', fontSize: 12, fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
      axisLine: { lineStyle: { color: '#2d3748' } },
    },
    yAxis: [
      {
        type: 'value',
        name: 'GMV(万)',
        nameTextStyle: { color: '#718096', fontSize: 11, fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
        axisLabel: { color: '#718096', fontSize: 11, formatter: '{value}万', fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
        splitLine: { lineStyle: { color: '#2d3748' } },
      },
      {
        type: 'value',
        name: '%',
        nameTextStyle: { color: '#718096', fontSize: 11, fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
        axisLabel: { color: '#718096', fontSize: 11, formatter: '{value}%', fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'GMV(万元)',
        type: 'bar',
        data: gmvData,
        yAxisIndex: 0,
        itemStyle: { color: '#4299e1', borderRadius: [4, 4, 0, 0] },
        barMaxWidth: 40,
      },
      {
        name: '毛利率(%)',
        type: 'line',
        data: marginData,
        yAxisIndex: 1,
        lineStyle: { color: '#f6ad55' },
        itemStyle: { color: '#f6ad55' },
        symbol: 'circle',
        symbolSize: 8,
      },
      {
        name: '同比增长(%)',
        type: 'line',
        data: yoyData,
        yAxisIndex: 1,
        lineStyle: { color: '#68d391', type: 'dashed' },
        itemStyle: { color: '#68d391' },
        symbol: 'triangle',
        symbolSize: 8,
      },
    ],
    grid: { left: 55, right: 45, top: 45, bottom: 30 },
  };

  return (
    <div className="chart-card">
      <div className="chart-card__title">品类销售分析</div>
      <ReactECharts option={option} style={{ height: 220 }} />
    </div>
  );
};

export default CategoryChart;
