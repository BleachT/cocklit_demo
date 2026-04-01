// ============================================================
// ActionPanel — Level 3: Action Execution
// ============================================================

import React, { useState } from 'react';
import type { ObjectInstance, ActionDefinition, ActionResult } from '../ontology/types';
import type { ActionTypeId } from '../ontology/types';
import { ontologyEngine } from '../ontology/engine';

interface ActionPanelProps {
  object: ObjectInstance;
  onClose?: () => void;
  recommendations?: string[];
}

const AI_RECOMMENDATIONS: Record<string, string[]> = {
  Product: [
    '该商品库存低于安全水位，建议立即补货',
    '近30天退货率偏高，建议调整定价或更换供应商',
    '结合当前活动，可以搭配套餐提升客单价',
  ],
  Supplier: [
    '该供应商准时率下滑，建议预警并启动备选评估',
    '质量评分低于基准，建议安排质检',
  ],
  Customer: [
    '该客户30天未下单，建议定向触达激活',
    '推荐关系活跃，建议发放专属邀请码提升裂变效率',
  ],
  Campaign: [
    'ROI 低于预期，建议暂停并调整投放策略',
    '活动覆盖商品库存不足，建议先补货再启动',
  ],
  Order: [
    '该订单已退货，建议跟进客户售后反馈',
    '订单关联商品评分偏低，建议关注品质问题',
  ],
};

function ActionButton({
  action,
  object,
  onResult,
}: {
  action: ActionDefinition;
  object: ObjectInstance;
  onResult: (r: ActionResult) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Simulate async execution
    await new Promise((r) => setTimeout(r, 800));
    const result = ontologyEngine.executeAction(action.id as ActionTypeId, object);
    setLoading(false);
    onResult(result);
  };

  return (
    <div className="action-item">
      <div className="action-item__info">
        <div className="action-item__label">{action.label}</div>
        <div className="action-item__desc">{action.description}</div>
      </div>
      <button
        className={`btn-execute ${loading ? 'btn-execute--loading' : ''}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? '⏳ 执行中…' : '▶ 执行'}
      </button>
    </div>
  );
}

const ActionPanel: React.FC<ActionPanelProps> = ({ object, onClose }) => {
  const actions = ontologyEngine.getAvailableActions(object.__type);
  const recs = AI_RECOMMENDATIONS[object.__type] || [];
  const [results, setResults] = useState<ActionResult[]>([]);

  const handleResult = (r: ActionResult) => {
    setResults((prev) => [r, ...prev].slice(0, 5));
  };

  return (
    <div className="action-panel">
      <div className="action-panel__header">
        <span>⚡ AI 建议 &amp; 行动面板</span>
        {onClose && (
          <button className="btn-close" onClick={onClose}>✕</button>
        )}
      </div>

      {recs.length > 0 && (
        <div className="action-panel__recs">
          <div className="section-title">🤖 AI 推荐建议</div>
          {recs.map((r, i) => (
            <div key={i} className="rec-item">
              <span className="rec-item__icon">💡</span>
              {r}
            </div>
          ))}
        </div>
      )}

      <div className="action-panel__actions">
        <div className="section-title">可执行操作</div>
        {actions.length === 0 && (
          <div className="empty-actions">该对象类型暂无可用操作</div>
        )}
        {actions.map((a) => (
          <ActionButton key={a.id} action={a} object={object} onResult={handleResult} />
        ))}
      </div>

      {results.length > 0 && (
        <div className="action-panel__results">
          <div className="section-title">执行结果</div>
          {results.map((r, i) => (
            <div
              key={i}
              className={`result-item ${r.success ? 'result-item--success' : 'result-item--fail'}`}
            >
              {r.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionPanel;
