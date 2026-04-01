// ============================================================
// OntologyEngine — Simplified FauxFoundry implementation
// ============================================================

import type {
  ObjectInstance,
  ObjectTypeId,
  LinkTypeId,
  ActionTypeId,
  LinkDefinition,
  ActionDefinition,
  ActionResult,
  OntologyObject,
} from './types';

import {
  productsRaw,
  ordersRaw,
  customersRaw,
  suppliersRaw,
  campaignsRaw,
} from './mock-data';

// ---------- Link registry ----------

const LINK_DEFINITIONS: LinkDefinition[] = [
  { id: 'Order_Product',    fromType: 'Order',    toType: 'Product',  cardinality: 'one-to-many' },
  { id: 'Order_Customer',   fromType: 'Order',    toType: 'Customer', cardinality: 'many-to-one' },
  { id: 'Product_Supplier', fromType: 'Product',  toType: 'Supplier', cardinality: 'many-to-one' },
  { id: 'Campaign_Product', fromType: 'Campaign', toType: 'Product',  cardinality: 'one-to-many' },
  { id: 'Campaign_Order',   fromType: 'Campaign', toType: 'Order',    cardinality: 'one-to-many' },
  { id: 'Customer_Referral',fromType: 'Customer', toType: 'Customer', cardinality: 'many-to-many' },
];

// ---------- Action registry ----------

const ACTION_DEFINITIONS: ActionDefinition[] = [
  {
    id: 'restock',
    label: '一键补货',
    description: '向供应商发起补货申请，将库存补充至安全水位',
    targetType: 'Product',
    execute: (target, params) => {
      const qty = (params?.qty as number) || 200;
      return {
        success: true,
        message: `✅ 补货指令已发送至供应商，申请数量 ${qty} 件，预计 ${(target.properties as { leadTime?: number }).leadTime || 14} 天到货`,
      };
    },
  },
  {
    id: 'reprice',
    label: '执行调价',
    description: '按策略自动调整商品售价',
    targetType: 'Product',
    execute: (_target, params) => {
      const pct = (params?.pct as number) || -5;
      const dir = pct < 0 ? '降价' : '涨价';
      return {
        success: true,
        message: `✅ 价格调整完成：${dir} ${Math.abs(pct)}%，新定价已同步至全渠道`,
      };
    },
  },
  {
    id: 'launchCampaign',
    label: '启动活动',
    description: '立即启动选定的营销活动',
    targetType: 'Campaign',
    execute: (_target, params) => {
      return {
        success: true,
        message: `✅ 营销活动「${params?.name || '新活动'}」已启动，预算 ¥${(params?.budget as number)?.toLocaleString() || '—'} 已释放`,
      };
    },
  },
  {
    id: 'reachCustomer',
    label: '客户触达',
    description: '通过短信/推送对目标客群发起定向触达',
    targetType: 'Customer',
    execute: (_target, params) => {
      return {
        success: true,
        message: `✅ 已向 ${(params?.count as number) || 1} 位目标客户发送定向触达消息，预计回流率 12%`,
      };
    },
  },
  {
    id: 'flagSupplier',
    label: '供应商预警',
    description: '标记供应商风险，启动备选供应商评估流程',
    targetType: 'Supplier',
    execute: (target) => {
      return {
        success: true,
        message: `⚠️ 供应商「${(target.properties as { supplierName?: string }).supplierName || ''}」已被标记为风险供应商，备选评估流程已启动`,
      };
    },
  },
];

// ---------- OntologyEngine ----------

class OntologyEngine {
  private store: Map<string, ObjectInstance> = new Map();
  private links: LinkDefinition[] = LINK_DEFINITIONS;
  private actions: Map<ActionTypeId, ActionDefinition> = new Map();

  constructor() {
    this.seed();
    ACTION_DEFINITIONS.forEach((a) => this.actions.set(a.id, a));
  }

  // ---- Seeding ----

  private seed() {
    productsRaw.forEach((p) => this.register('Product', p.productId, p));
    ordersRaw.forEach((o) => this.register('Order', o.orderId, o));
    customersRaw.forEach((c) => this.register('Customer', c.customerId, c));
    suppliersRaw.forEach((s) => this.register('Supplier', s.supplierId, s));
    campaignsRaw.forEach((cp) => this.register('Campaign', cp.campaignId, cp));
  }

  private register(type: ObjectTypeId, id: string, props: OntologyObject) {
    this.store.set(`${type}:${id}`, { __type: type, __id: id, properties: props });
  }

  // ---- Query ----

  getObject(type: ObjectTypeId, id: string): ObjectInstance | undefined {
    return this.store.get(`${type}:${id}`);
  }

  listObjects(type: ObjectTypeId): ObjectInstance[] {
    return Array.from(this.store.values()).filter((o) => o.__type === type);
  }

  /** Follow a link from a source object, returns resolved linked objects */
  getLinkedObjects(source: ObjectInstance, linkId: LinkTypeId): ObjectInstance[] {
    const def = this.links.find((l) => l.id === linkId);
    if (!def) return [];

    const props = source.properties as unknown as Record<string, unknown>;

    switch (linkId) {
      case 'Order_Product': {
        const ids = (props['productIds'] as string[]) || [];
        return ids.map((id) => this.getObject('Product', id)).filter(Boolean) as ObjectInstance[];
      }
      case 'Order_Customer': {
        const id = props['customerId'] as string;
        const c = this.getObject('Customer', id);
        return c ? [c] : [];
      }
      case 'Product_Supplier': {
        const id = props['supplierId'] as string;
        const s = this.getObject('Supplier', id);
        return s ? [s] : [];
      }
      case 'Campaign_Product': {
        const ids = (props['productIds'] as string[]) || [];
        return ids.map((id) => this.getObject('Product', id)).filter(Boolean) as ObjectInstance[];
      }
      case 'Campaign_Order': {
        const ids = (props['orderIds'] as string[]) || [];
        return ids.map((id) => this.getObject('Order', id)).filter(Boolean) as ObjectInstance[];
      }
      case 'Customer_Referral': {
        // Find customers referred by this customer
        return this.listObjects('Customer').filter((c) => {
          const p = c.properties as unknown as Record<string, unknown>;
          return p['referredBy'] === source.__id;
        });
      }
      default:
        return [];
    }
  }

  /** Reverse link traversal: find objects that link TO this object */
  getReverseLinkedObjects(target: ObjectInstance, linkId: LinkTypeId): ObjectInstance[] {
    switch (linkId) {
      case 'Order_Product': {
        return this.listObjects('Order').filter((o) => {
          const ids = ((o.properties as unknown as Record<string, unknown>)['productIds'] as string[]) || [];
          return ids.includes(target.__id);
        });
      }
      case 'Order_Customer': {
        return this.listObjects('Order').filter((o) => {
          return ((o.properties as unknown as Record<string, unknown>)['customerId'] as string) === target.__id;
        });
      }
      case 'Product_Supplier': {
        return this.listObjects('Product').filter((p) => {
          return ((p.properties as unknown as Record<string, unknown>)['supplierId'] as string) === target.__id;
        });
      }
      case 'Campaign_Product': {
        return this.listObjects('Campaign').filter((cp) => {
          const ids = ((cp.properties as unknown as Record<string, unknown>)['productIds'] as string[]) || [];
          return ids.includes(target.__id);
        });
      }
      case 'Campaign_Order': {
        return this.listObjects('Campaign').filter((cp) => {
          const ids = ((cp.properties as unknown as Record<string, unknown>)['orderIds'] as string[]) || [];
          return ids.includes(target.__id);
        });
      }
      default:
        return [];
    }
  }

  // ---- Actions ----

  getAvailableActions(type: ObjectTypeId): ActionDefinition[] {
    return Array.from(this.actions.values()).filter((a) => a.targetType === type);
  }

  executeAction(actionId: ActionTypeId, target: ObjectInstance, params?: Record<string, unknown>): ActionResult {
    const def = this.actions.get(actionId);
    if (!def) return { success: false, message: `未知 Action: ${actionId}` };
    return def.execute(target, params);
  }
}

// Singleton instance
export const ontologyEngine = new OntologyEngine();
