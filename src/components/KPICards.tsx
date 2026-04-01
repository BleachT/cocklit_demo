// ============================================================
// KPICards — Level 0: Global Situational Awareness
// ============================================================

import React from 'react';
import type { KPIMetric } from '../ontology/types';

interface KPICardsProps {
  metrics: KPIMetric[];
  onDrillDown?: (metric: KPIMetric) => void;
}

function formatValue(metric: KPIMetric): string {
  const { value, format } = metric;
  if (format === 'percent') return `${(value * 100).toFixed(1)}%`;
  if (format === 'currency') {
    if (value >= 10000) return `¥${(value / 10000).toFixed(1)}万`;
    return `¥${value.toLocaleString()}`;
  }
  if (format === 'count') return value.toLocaleString();
  return value.toLocaleString();
}

function formatDelta(metric: KPIMetric): string {
  const { value, previousValue, format } = metric;
  const delta = value - previousValue;
  if (format === 'percent') {
    const ppt = (delta * 100).toFixed(1);
    return `${delta >= 0 ? '+' : ''}${ppt}ppt`;
  }
  if (format === 'currency') {
    if (Math.abs(delta) >= 10000) {
      return `${delta >= 0 ? '+' : ''}${(delta / 10000).toFixed(1)}万`;
    }
    return `${delta >= 0 ? '+' : ''}¥${Math.abs(delta).toLocaleString()}`;
  }
  if (format === 'count') {
    return `${delta >= 0 ? '+' : ''}${delta.toLocaleString()}`;
  }
  return `${delta >= 0 ? '+' : ''}${delta}`;
}

const KPICard: React.FC<{ metric: KPIMetric; onClick?: () => void }> = ({ metric, onClick }) => {
  const isUp = metric.trend === 'up';
  const isAnomaly = metric.isAnomaly;
  // For return rate, "up" is bad
  const isGoodTrend = metric.id === 'returnRate' ? !isUp : isUp;

  return (
    <div
      className={`kpi-card ${isAnomaly ? 'kpi-card--anomaly' : ''} ${onClick ? 'kpi-card--clickable' : ''}`}
      onClick={onClick}
      title={isAnomaly ? '点击查看归因分析' : undefined}
    >
      <div className="kpi-card__label">
        {isAnomaly && <span className="kpi-card__anomaly-dot" />}
        {metric.label}
      </div>
      <div className="kpi-card__value">{formatValue(metric)}</div>
      <div className={`kpi-card__delta ${isGoodTrend ? 'kpi-card__delta--good' : 'kpi-card__delta--bad'}`}>
        <span className="kpi-card__arrow">{isUp ? '▲' : '▼'}</span>
        {formatDelta(metric)}
        <span className="kpi-card__vs"> vs 上月</span>
      </div>
      {isAnomaly && (
        <div className="kpi-card__drill-hint">⚡ 点击归因分析</div>
      )}
    </div>
  );
};

const KPICards: React.FC<KPICardsProps> = ({ metrics, onDrillDown }) => {
  return (
    <div className="kpi-cards">
      {metrics.map((m) => (
        <KPICard
          key={m.id}
          metric={m}
          onClick={m.isAnomaly && onDrillDown ? () => onDrillDown(m) : undefined}
        />
      ))}
    </div>
  );
};

export default KPICards;
