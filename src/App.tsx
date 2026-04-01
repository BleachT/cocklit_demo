// ============================================================
// App.tsx — Main application with drill-down navigation
// ============================================================

import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import KPICards from './components/KPICards';
import WaterfallChart from './components/WaterfallChart';
import ObjectCard from './components/ObjectCard';
import TrendChart from './components/TrendChart';
import CategoryChart from './components/CategoryChart';
import ChannelChart from './components/ChannelChart';

import { computeKPIs, grossMarginAttribution, activeCustomerAttribution } from './analysis/attribution';
import { ontologyEngine } from './ontology/engine';
import type { KPIMetric, AttributionFactor, ObjectInstance } from './ontology/types';
import type { ObjectTypeId } from './ontology/types';

// ---- View State ----
type ViewState =
  | { level: 0 }
  | { level: 1; metricId: string }
  | { level: 2; object: ObjectInstance };

const OBJECT_TYPES: Array<{ id: ObjectTypeId; label: string; emoji: string }> = [
  { id: 'Product', label: '商品', emoji: '🛍️' },
  { id: 'Order', label: '订单', emoji: '📦' },
  { id: 'Customer', label: '客户', emoji: '👤' },
  { id: 'Supplier', label: '供应商', emoji: '🏭' },
  { id: 'Campaign', label: '营销活动', emoji: '📢' },
];

// ---- Level 0: Global KPI Overview ----
const Level0: React.FC<{
  onDrillToL1: (metric: KPIMetric) => void;
}> = ({ onDrillToL1 }) => {
  const kpis = computeKPIs();
  const metrics = Object.values(kpis);

  return (
    <div className="level0-layout">
      <div className="panel-title">
        <span className="panel-title__badge">L0</span>
        全局态势感知
        <span className="panel-title__sub">— 点击异常指标（橙色）可下钻归因分析</span>
      </div>
      <KPICards metrics={metrics} onDrillDown={onDrillToL1} />
      <div className="charts-row">
        <TrendChart />
        <CategoryChart />
        <ChannelChart />
      </div>
    </div>
  );
};

// ---- Level 1: Attribution Analysis ----
const Level1: React.FC<{
  metricId: string;
  onDrillToL2: (obj: ObjectInstance) => void;
}> = ({ metricId, onDrillToL2 }) => {
  const result = metricId === 'grossMargin'
    ? grossMarginAttribution()
    : activeCustomerAttribution();

  const handleFactorClick = useCallback((factor: AttributionFactor) => {
    if (!factor.linkedObjectType || !factor.linkedObjectId) return;
    const obj = ontologyEngine.getObject(factor.linkedObjectType, factor.linkedObjectId);
    if (obj) onDrillToL2(obj);
  }, [onDrillToL2]);

  return (
    <div className="level1-layout">
      <div className="panel-title">
        <span className="panel-title__badge">L1</span>
        归因分析
        <span className="panel-title__sub">— 点击最大因子可下钻对象 360° 视图</span>
      </div>
      <WaterfallChart result={result} onFactorClick={handleFactorClick} />
    </div>
  );
};

// ---- Level 2: Object 360° View ----
const Level2: React.FC<{
  object: ObjectInstance;
  onNavigate: (obj: ObjectInstance) => void;
}> = ({ object, onNavigate }) => {
  return (
    <div className="level2-layout">
      <div className="panel-title">
        <span className="panel-title__badge">L2</span>
        对象 360° 视图
        <span className="panel-title__sub">— 点击关联对象继续探索</span>
      </div>
      <ObjectCard object={object} onNavigate={onNavigate} />
    </div>
  );
};

// ---- Object Browser (embedded in L0 bottom) ----
const ObjectBrowser: React.FC<{
  onSelect: (obj: ObjectInstance) => void;
}> = ({ onSelect }) => {
  const [activeType, setActiveType] = useState<ObjectTypeId>('Product');
  const objects = ontologyEngine.listObjects(activeType);

  const getDisplayName = (obj: ObjectInstance) => {
    const props = obj.properties as unknown as Record<string, unknown>;
    const nameKey = Object.keys(props).find((k) => k.toLowerCase().includes('name')) || Object.keys(props)[0];
    return props[nameKey] ? String(props[nameKey]) : obj.__id;
  };

  const getMetaInfo = (obj: ObjectInstance) => {
    const props = obj.properties as unknown as Record<string, unknown>;
    const metaKeys: Record<string, string[]> = {
      Product: ['category', 'price', 'stock'],
      Order: ['payAmount', 'channel', 'status'],
      Customer: ['memberLevel', 'totalSpend'],
      Supplier: ['qualityScore', 'onTimeRate'],
      Campaign: ['campaignType', 'roi'],
    };
    const keys = metaKeys[obj.__type] || [];
    return keys.map((k) => {
      const v = props[k];
      if (k === 'price' || k === 'payAmount' || k === 'totalSpend') return `¥${Number(v).toLocaleString()}`;
      if (k === 'onTimeRate') return `准时率${(Number(v) * 100).toFixed(0)}%`;
      if (k === 'roi') return `ROI ${v}x`;
      return String(v ?? '');
    }).filter(Boolean).join(' · ');
  };

  return (
    <div className="obj-browser">
      <div className="panel-title" style={{ marginBottom: 10 }}>
        <span className="panel-title__badge">对象浏览器</span>
        本体对象探索
        <span className="panel-title__sub">— 点击任意对象查看 360° 详情</span>
      </div>
      <div className="obj-browser__tabs">
        {OBJECT_TYPES.map(({ id, label, emoji }) => (
          <div
            key={id}
            className={`obj-tab ${activeType === id ? 'obj-tab--active' : ''}`}
            onClick={() => setActiveType(id)}
          >
            {emoji} {label} ({ontologyEngine.listObjects(id).length})
          </div>
        ))}
      </div>
      <div className="obj-list">
        {objects.map((obj) => (
          <div
            key={obj.__id}
            className="obj-list-item"
            onClick={() => onSelect(obj)}
          >
            <div className="obj-list-item__name">{getDisplayName(obj)}</div>
            <div className="obj-list-item__meta">{obj.__id} · {getMetaInfo(obj)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---- Root App ----
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>({ level: 0 });
  const [history, setHistory] = useState<ViewState[]>([]);

  const navigate = useCallback((next: ViewState) => {
    setHistory((prev) => [...prev, view]);
    setView(next);
  }, [view]);

  const goBack = useCallback((index: number) => {
    if (index === 0) {
      setView({ level: 0 });
      setHistory([]);
    } else {
      const target = history[index - 1];
      setView(target);
      setHistory((prev) => prev.slice(0, index - 1));
    }
  }, [history]);

  // Build breadcrumbs from history + current view
  const buildCrumb = (v: ViewState): string => {
    if (v.level === 0) return '全局态势';
    if (v.level === 1 && 'metricId' in v)
      return `归因分析 · ${v.metricId === 'grossMargin' ? '毛利率' : '活跃客户数'}`;
    if (v.level === 2 && 'object' in v) {
      const props = v.object.properties as unknown as Record<string, unknown>;
      const nameKey = Object.keys(props).find((k) => k.toLowerCase().includes('name')) || Object.keys(props)[0];
      return `${v.object.__type} · ${String(props[nameKey] || v.object.__id)}`;
    }
    return '—';
  };

  const breadcrumbs = [
    ...history.map(buildCrumb),
    buildCrumb(view),
  ];

  const handleDrillToL1 = useCallback((metric: KPIMetric) => {
    navigate({ level: 1, metricId: metric.id });
  }, [navigate]);

  const handleDrillToL2 = useCallback((obj: ObjectInstance) => {
    navigate({ level: 2, object: obj });
  }, [navigate]);

  return (
    <Layout level={view.level} breadcrumbs={breadcrumbs} onBreadcrumbClick={goBack}>
      {view.level === 0 && (
        <>
          <Level0 onDrillToL1={handleDrillToL1} />
          <ObjectBrowser onSelect={handleDrillToL2} />
        </>
      )}
      {view.level === 1 && 'metricId' in view && (
        <Level1 metricId={view.metricId} onDrillToL2={handleDrillToL2} />
      )}
      {view.level === 2 && 'object' in view && (
        <Level2 object={view.object} onNavigate={handleDrillToL2} />
      )}
    </Layout>
  );
};

export default App;
