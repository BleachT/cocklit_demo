// ============================================================
// Ontology Types — Palantir OSDK-inspired type definitions
// ============================================================

export type ObjectTypeId =
  | 'Product'
  | 'Order'
  | 'Customer'
  | 'Supplier'
  | 'Campaign';

export type LinkTypeId =
  | 'Order_Product'
  | 'Order_Customer'
  | 'Product_Supplier'
  | 'Campaign_Product'
  | 'Campaign_Order'
  | 'Customer_Referral';

export type ActionTypeId =
  | 'restock'
  | 'reprice'
  | 'launchCampaign'
  | 'reachCustomer'
  | 'flagSupplier';

// ---------- Object property bags ----------

export interface Product {
  productId: string;
  productName: string;
  category: '车模' | '配件' | '生活用品' | '服饰';
  brand: string;
  price: number;
  cost: number;
  stock: number;
  status: 'active' | 'discontinued' | 'oos';
  rating: number;
  salesVolume: number;
  returnRate: number;
  supplierId: string;
}

export interface Order {
  orderId: string;
  orderTime: string;
  payAmount: number;
  channel: 'APP' | '小程序' | '官网' | '4S店';
  status: 'paid' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
  province: string;
  city: string;
  customerId: string;
  productIds: string[];
}

export interface Customer {
  customerId: string;
  customerName: string;
  customerType: '车主' | '潜客' | '粉丝';
  carModel: string;
  memberLevel: '普通' | '银卡' | '金卡' | '钻石';
  totalSpend: number;
  ltv: number;
  referredBy?: string;
}

export interface Supplier {
  supplierId: string;
  supplierName: string;
  leadTime: number;
  qualityScore: number;
  onTimeRate: number;
}

export interface Campaign {
  campaignId: string;
  campaignName: string;
  campaignType: '满减' | '折扣' | '赠品' | '限时秒杀';
  budget: number;
  actualSpend: number;
  roi: number;
  productIds: string[];
  orderIds: string[];
}

export type OntologyObject = Product | Order | Customer | Supplier | Campaign;

// ---------- Generic ontology wrappers ----------

export interface ObjectInstance<T extends OntologyObject = OntologyObject> {
  __type: ObjectTypeId;
  __id: string;
  properties: T;
}

export interface LinkDefinition {
  id: LinkTypeId;
  fromType: ObjectTypeId;
  toType: ObjectTypeId;
  cardinality: 'one-to-many' | 'many-to-one' | 'many-to-many';
}

export interface ActionDefinition {
  id: ActionTypeId;
  label: string;
  description: string;
  targetType: ObjectTypeId;
  execute: (target: ObjectInstance, params?: Record<string, unknown>) => ActionResult;
}

export interface ActionResult {
  success: boolean;
  message: string;
  updatedObject?: ObjectInstance;
}

// ---------- KPI & Attribution ----------

export interface KPIMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'flat';
  isAnomaly: boolean;
  format: 'number' | 'percent' | 'currency' | 'count';
}

export interface AttributionFactor {
  factor: string;
  contribution: number;
  description: string;
  linkedObjectType?: ObjectTypeId;
  linkedObjectId?: string;
}

export interface AttributionResult {
  kpiId: string;
  kpiLabel: string;
  baseValue: number;
  currentValue: number;
  delta: number;
  factors: AttributionFactor[];
}
