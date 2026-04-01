// ============================================================
// TrendChart — GMV & Gross Margin trend line chart
// ============================================================

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { gmvTrendData } from '../ontology/mock-data';

const TrendChart: React.FC = () => {
  const months = gmvTrendData.map((d) => d.month.replace('20', ''));
  const gmvData = gmvTrendData.map((d) => Math.round(d.gmv / 10000));
  const marginData = gmvTrendData.map((d) => parseFloat((d.grossMargin * 100).toFixed(2)));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e2532',
      borderColor: '#2d3748',
      textStyle: { color: '#e2e8f0' },
      formatter: (params: Array<{ seriesName: string; value: number; marker: string }>) => {
        return params.map((p) => {
          const unit = p.seriesName === 'GMV(万元)' ? '万' : '%';
          return `${p.marker} ${p.seriesName}: ${p.value}${unit}`;
        }).join('<br/>');
      },
    },
    legend: {
      data: ['GMV(万元)', '毛利率(%)'],
      textStyle: { color: '#a0aec0', fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: { color: '#718096', fontSize: 11, fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
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
        name: '毛利率(%)',
        nameTextStyle: { color: '#718096', fontSize: 11, fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
        axisLabel: { color: '#718096', fontSize: 11, formatter: '{value}%', fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif" },
        splitLine: { show: false },
        min: 40,
        max: 48,
      },
    ],
    series: [
      {
        name: 'GMV(万元)',
        type: 'line',
        data: gmvData,
        smooth: true,
        yAxisIndex: 0,
        lineStyle: { color: '#4299e1', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(66,153,225,0.3)' },
              { offset: 1, color: 'rgba(66,153,225,0.02)' },
            ],
          },
        },
        itemStyle: { color: '#4299e1' },
        symbol: 'circle',
        symbolSize: 6,
      },
      {
        name: '毛利率(%)',
        type: 'line',
        data: marginData,
        smooth: true,
        yAxisIndex: 1,
        lineStyle: { color: '#f6ad55', width: 2 },
        itemStyle: { color: '#f6ad55' },
        symbol: 'circle',
        symbolSize: 6,
      },
    ],
    grid: { left: 55, right: 55, top: 40, bottom: 30 },
  };

  return (
    <div className="chart-card">
      <div className="chart-card__title">GMV &amp; 毛利率趋势（近12个月）</div>
      <ReactECharts option={option} style={{ height: 220 }} />
    </div>
  );
};

export default TrendChart;
