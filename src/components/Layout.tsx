// ============================================================
// Layout — Cockpit Shell: header, breadcrumb, nav tabs
// ============================================================

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  level: number;
  breadcrumbs: string[];
  onBreadcrumbClick?: (index: number) => void;
}

const LEVEL_LABELS = ['L0 全局态势', 'L1 归因分析', 'L2 对象详情'];

const Layout: React.FC<LayoutProps> = ({ children, level, breadcrumbs, onBreadcrumbClick }) => {
  return (
    <div className="cockpit-shell">
      {/* Top Bar */}
      <header className="cockpit-header">
        <div className="cockpit-header__brand">
          <span className="cockpit-header__logo">◈</span>
          <div>
            <div className="cockpit-header__title">车企周边好物商城 · 智能驾驶舱</div>
            <div className="cockpit-header__subtitle">Palantir Ontology-Powered Cockpit Demo</div>
          </div>
        </div>

        <div className="cockpit-header__meta">
          <div className="cockpit-header__time">
            <span className="meta-dot meta-dot--live" />
            实时数据
          </div>
          <div className="cockpit-header__period">统计周期：2024年3月</div>
        </div>
      </header>

      {/* Breadcrumb & Level Tabs */}
      <div className="cockpit-nav">
        <div className="breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="breadcrumb__sep">›</span>}
              <span
                className={`breadcrumb__item ${i === breadcrumbs.length - 1 ? 'breadcrumb__item--active' : 'breadcrumb__item--link'}`}
                onClick={() => i < breadcrumbs.length - 1 && onBreadcrumbClick?.(i)}
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="level-tabs">
          {LEVEL_LABELS.map((label, i) => (
            <div
              key={i}
              className={`level-tab ${level === i ? 'level-tab--active' : ''}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="cockpit-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="cockpit-footer">
        <span>Inspired by Palantir OSDK · FauxFoundry Mock Data · Built with React + ECharts</span>
        <span style={{ color: '#4a5568' }}>  //  本体对象: 5类 · 关系链路: 6条 · 可执行 Action: 5种</span>
      </footer>
    </div>
  );
};

export default Layout;
