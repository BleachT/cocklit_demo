// ============================================================
// ChannelChart — Channel distribution pie chart
// ============================================================

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { getChannelDistribution } from '../analysis/attribution';

const ChannelChart: React.FC = () => {
  const data = getChannelDistribution();

  const pieData = data.map((d) => ({
    name: d.channel,
    value: d.value,
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1e2532',
      borderColor: '#2d3748',
      textStyle: { color: '#e2e8f0' },
      formatter: (params: { name: string; value: number; percent: number }) => {
        const item = data.find((d) => d.channel === params.name);
        const amount = item ? `¥${(item.amount / 10000).toFixed(1)}万` : '';
        return `${params.name}<br/>占比：${params.percent.toFixed(1)}%<br/>金额：${amount}`;
      },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#a0aec0', fontSize: 12 },
    },
    color: ['#4299e1', '#48bb78', '#f6ad55', '#9f7aea'],
    series: [
      {
        name: '渠道分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          color: '#e2e8f0',
          fontSize: 12,
          formatter: '{b}\n{d}%',
        },
        labelLine: { lineStyle: { color: '#4a5568' } },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
        data: pieData,
      },
    ],
  };

  return (
    <div className="chart-card">
      <div className="chart-card__title">渠道 GMV 分布</div>
      <ReactECharts option={option} style={{ height: 220 }} />
    </div>
  );
};

export default ChannelChart;
