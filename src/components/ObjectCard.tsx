// ============================================================
// ObjectCard — Level 2: Object 360° View
// ============================================================

import React, { useState } from 'react';
import type { ObjectInstance, ObjectTypeId, LinkTypeId } from '../ontology/types';
import { ontologyEngine } from '../ontology/engine';
import ActionPanel from './ActionPanel';

interface ObjectCardProps {
  object: ObjectInstance;
  onNavigate?: (obj: ObjectInstance) => void;
}

const TYPE_LABELS: Record<ObjectTypeId, string> = {
  Product: '🛍️ 商品',
  Order: '📦 订单',
  Customer: '👤 客户',
  Supplier: '🏭 供应商',
  Campaign: '📢 营销活动',
};

const LINKS_FOR_TYPE: Record<ObjectTypeId, Array<{ linkId: LinkTypeId; label: string; direction: 'forward' | 'reverse' }>> = {
  Product: [
    { linkId: 'Product_Supplier', label: '供应商', direction: 'forward' },
    { linkId: 'Order_Product',    label: '关联订单', direction: 'reverse' },
    { linkId: 'Campaign_Product', label: '所属活动', direction: 'reverse' },
  ],
  Order: [
    { linkId: 'Order_Customer', label: '下单客户', direction: 'forward' },
    { linkId: 'Order_Product',  label: '商品明细', direction: 'forward' },
    { linkId: 'Campaign_Order', label: '所属活动', direction: 'reverse' },
  ],
  Customer: [
    { linkId: 'Order_Customer',   label: '历史订单', direction: 'reverse' },
    { linkId: 'Customer_Referral',label: '推荐下线', direction: 'forward' },
  ],
  Supplier: [
    { linkId: 'Product_Supplier', label: '供货商品', direction: 'reverse' },
  ],
  Campaign: [
    { linkId: 'Campaign_Product', label: '活动商品', direction: 'forward' },
    { linkId: 'Campaign_Order',   label: '关联订单', direction: 'forward' },
  ],
};

function renderProperties(obj: ObjectInstance): React.ReactNode {
  const props = obj.properties as unknown as Record<string, unknown>;
  const excluded = new Set(['productIds', 'orderIds', 'referredBy', 'supplierId', 'customerId']);
  return (
    <div className="obj-properties">
      {Object.entries(props)
        .filter(([k]) => !excluded.has(k))
        .map(([key, val]) => {
          let displayVal = String(val);
          if (typeof val === 'number') {
            if (key.toLowerCase().includes('price') || key.toLowerCase().includes('amount') ||
                key.toLowerCase().includes('spend') || key.toLowerCase().includes('ltv') ||
                key.toLowerCase().includes('budget') || key.toLowerCase().includes('cost')) {
              displayVal = `¥${(val as number).toLocaleString()}`;
            } else if (
              key.toLowerCase().includes('rate') ||
              key.toLowerCase().includes('margin') ||
              (!(key.toLowerCase().includes('roi') || key.toLowerCase().includes('score')) &&
               (val as number) < 1 && (val as number) > 0)
            ) {
              displayVal = `${((val as number) * 100).toFixed(1)}%`;
            }
          }
          return (
            <div key={key} className="obj-property">
              <span className="obj-property__key">{key}</span>
              <span className="obj-property__val">{displayVal}</span>
            </div>
          );
        })}
    </div>
  );
}

function LinkedObjectList({ objects, label, onNavigate }: {
  objects: ObjectInstance[];
  label: string;
  onNavigate?: (o: ObjectInstance) => void;
}) {
  if (!objects.length) return null;
  return (
    <div className="linked-list">
      <div className="linked-list__label">{label} ({objects.length})</div>
      <div className="linked-list__items">
        {objects.slice(0, 5).map((o) => {
          const p = o.properties as unknown as Record<string, unknown>;
          const nameKey = Object.keys(p).find((k) => k.toLowerCase().includes('name')) || Object.keys(p)[1];
          const name = p[nameKey] ? String(p[nameKey]) : o.__id;
          return (
            <div
              key={o.__id}
              className="linked-item"
              onClick={() => onNavigate?.(o)}
            >
              <span className="linked-item__type">{TYPE_LABELS[o.__type]}</span>
              <span className="linked-item__name">{name}</span>
              <span className="linked-item__id">{o.__id}</span>
              <span className="linked-item__arrow">→</span>
            </div>
          );
        })}
        {objects.length > 5 && (
          <div className="linked-item linked-item--more">+{objects.length - 5} 更多…</div>
        )}
      </div>
    </div>
  );
}

const ObjectCard: React.FC<ObjectCardProps> = ({ object, onNavigate }) => {
  const [showActions, setShowActions] = useState(false);
  const links = LINKS_FOR_TYPE[object.__type] || [];

  const linkedGroups = links.map(({ linkId, label, direction }) => {
    const objects = direction === 'forward'
      ? ontologyEngine.getLinkedObjects(object, linkId)
      : ontologyEngine.getReverseLinkedObjects(object, linkId);
    return { label, objects };
  });

  const props = object.properties as unknown as Record<string, unknown>;
  const nameKey = Object.keys(props).find((k) => k.toLowerCase().includes('name')) || Object.keys(props)[0];
  const displayName = props[nameKey] ? String(props[nameKey]) : object.__id;

  return (
    <div className="object-card">
      <div className="object-card__header">
        <div>
          <div className="object-card__type-badge">{TYPE_LABELS[object.__type]}</div>
          <div className="object-card__name">{displayName}</div>
          <div className="object-card__id">ID: {object.__id}</div>
        </div>
        <button
          className="btn-action"
          onClick={() => setShowActions((v) => !v)}
        >
          ⚡ 执行操作
        </button>
      </div>

      {showActions && (
        <ActionPanel object={object} onClose={() => setShowActions(false)} />
      )}

      <div className="object-card__body">
        <div className="object-card__props-section">
          <div className="section-title">属性详情</div>
          {renderProperties(object)}
        </div>

        <div className="object-card__links-section">
          <div className="section-title">关联对象</div>
          {linkedGroups.map(({ label, objects }) => (
            <LinkedObjectList key={label} objects={objects} label={label} onNavigate={onNavigate} />
          ))}
          {linkedGroups.every(({ objects }) => !objects.length) && (
            <div className="empty-links">暂无关联对象</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectCard;
