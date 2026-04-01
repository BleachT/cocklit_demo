// ============================================================
// Mock Data — FauxFoundry-style simulated data
// ============================================================

import type { Product, Order, Customer, Supplier, Campaign } from './types';

// ---- Suppliers ----
export const suppliersRaw: Supplier[] = [
  { supplierId: 'S001', supplierName: '东莞精工模型', leadTime: 14, qualityScore: 92, onTimeRate: 0.96 },
  { supplierId: 'S002', supplierName: '深圳车品科技', leadTime: 7,  qualityScore: 88, onTimeRate: 0.91 },
  { supplierId: 'S003', supplierName: '上海时尚服饰', leadTime: 10, qualityScore: 85, onTimeRate: 0.88 },
  { supplierId: 'S004', supplierName: '广州生活优选', leadTime: 5,  qualityScore: 90, onTimeRate: 0.94 },
  { supplierId: 'S005', supplierName: '杭州数码配件', leadTime: 8,  qualityScore: 78, onTimeRate: 0.82 },
];

// ---- Products ----
export const productsRaw: Product[] = [
  { productId: 'P001', productName: 'BYD 海豹 1:18 合金车模', category: '车模', brand: 'BYD', price: 398, cost: 180, stock: 245, status: 'active', rating: 4.8, salesVolume: 1230, returnRate: 0.02, supplierId: 'S001' },
  { productId: 'P002', productName: '特斯拉 Model Y 车模套装', category: '车模', brand: 'Tesla', price: 458, cost: 210, stock: 88, status: 'active', rating: 4.7, salesVolume: 980, returnRate: 0.03, supplierId: 'S001' },
  { productId: 'P003', productName: '华为问界 M9 限量车模', category: '车模', brand: 'AITO', price: 599, cost: 280, stock: 32, status: 'active', rating: 4.9, salesVolume: 560, returnRate: 0.01, supplierId: 'S001' },
  { productId: 'P004', productName: '碳纤维方向盘套', category: '配件', brand: '车享', price: 128, cost: 45, stock: 520, status: 'active', rating: 4.5, salesVolume: 3400, returnRate: 0.04, supplierId: 'S002' },
  { productId: 'P005', productName: '无线车载充电支架', category: '配件', brand: '车享', price: 189, cost: 70, stock: 380, status: 'active', rating: 4.6, salesVolume: 2800, returnRate: 0.05, supplierId: 'S005' },
  { productId: 'P006', productName: '智能HUD 抬头显示器', category: '配件', brand: '科沃斯', price: 369, cost: 185, stock: 150, status: 'active', rating: 4.4, salesVolume: 890, returnRate: 0.08, supplierId: 'S005' },
  { productId: 'P007', productName: '车主定制帆布袋', category: '生活用品', brand: '好物集', price: 59, cost: 18, stock: 1200, status: 'active', rating: 4.3, salesVolume: 5600, returnRate: 0.02, supplierId: 'S004' },
  { productId: 'P008', productName: '新能源车主保温杯', category: '生活用品', brand: '好物集', price: 89, cost: 32, stock: 680, status: 'active', rating: 4.5, salesVolume: 4200, returnRate: 0.03, supplierId: 'S004' },
  { productId: 'P009', productName: '品牌联名卫衣（BYD×潮牌）', category: '服饰', brand: 'BYD', price: 299, cost: 120, stock: 340, status: 'active', rating: 4.6, salesVolume: 1800, returnRate: 0.06, supplierId: 'S003' },
  { productId: 'P010', productName: '极氪车主 polo 衫', category: '服饰', brand: 'ZEEKR', price: 199, cost: 75, stock: 15, status: 'oos', rating: 4.4, salesVolume: 920, returnRate: 0.04, supplierId: 'S003' },
];

// ---- Customers ----
export const customersRaw: Customer[] = [
  { customerId: 'C001', customerName: '张伟',   customerType: '车主', carModel: 'BYD 海豹',    memberLevel: '钻石', totalSpend: 12800, ltv: 38000 },
  { customerId: 'C002', customerName: '李敏',   customerType: '车主', carModel: '特斯拉 Model Y', memberLevel: '金卡', totalSpend: 8600, ltv: 22000 },
  { customerId: 'C003', customerName: '王强',   customerType: '潜客', carModel: '',             memberLevel: '普通', totalSpend: 460,  ltv: 3200,  referredBy: 'C001' },
  { customerId: 'C004', customerName: '赵丽',   customerType: '车主', carModel: '问界 M9',      memberLevel: '金卡', totalSpend: 9200, ltv: 26000 },
  { customerId: 'C005', customerName: '钱浩',   customerType: '粉丝', carModel: '',             memberLevel: '银卡', totalSpend: 2400, ltv: 8500,  referredBy: 'C002' },
  { customerId: 'C006', customerName: '孙静',   customerType: '车主', carModel: '极氪 001',     memberLevel: '钻石', totalSpend: 16000, ltv: 42000 },
  { customerId: 'C007', customerName: '周明',   customerType: '车主', carModel: 'BYD 汉',       memberLevel: '银卡', totalSpend: 3800, ltv: 11000 },
  { customerId: 'C008', customerName: '吴芳',   customerType: '潜客', carModel: '',             memberLevel: '普通', totalSpend: 260,  ltv: 1800,  referredBy: 'C001' },
];

// ---- Orders ----
export const ordersRaw: Order[] = [
  { orderId: 'O001', orderTime: '2024-03-01T10:23:00', payAmount: 796,  channel: 'APP',  status: 'delivered', province: '广东', city: '深圳', customerId: 'C001', productIds: ['P001', 'P004'] },
  { orderId: 'O002', orderTime: '2024-03-02T14:10:00', payAmount: 458,  channel: '小程序', status: 'delivered', province: '上海', city: '上海', customerId: 'C002', productIds: ['P002'] },
  { orderId: 'O003', orderTime: '2024-03-03T09:30:00', payAmount: 599,  channel: '官网',  status: 'returned',  province: '北京', city: '北京', customerId: 'C004', productIds: ['P003'] },
  { orderId: 'O004', orderTime: '2024-03-05T16:45:00', payAmount: 317,  channel: 'APP',  status: 'delivered', province: '广东', city: '广州', customerId: 'C003', productIds: ['P007', 'P008'] },
  { orderId: 'O005', orderTime: '2024-03-08T11:20:00', payAmount: 189,  channel: '小程序', status: 'shipped',  province: '浙江', city: '杭州', customerId: 'C005', productIds: ['P005'] },
  { orderId: 'O006', orderTime: '2024-03-10T20:05:00', payAmount: 498,  channel: '4S店', status: 'delivered', province: '江苏', city: '南京', customerId: 'C006', productIds: ['P009', 'P007'] },
  { orderId: 'O007', orderTime: '2024-03-12T08:55:00', payAmount: 369,  channel: 'APP',  status: 'delivered', province: '四川', city: '成都', customerId: 'C007', productIds: ['P006'] },
  { orderId: 'O008', orderTime: '2024-03-14T13:30:00', payAmount: 199,  channel: '官网',  status: 'cancelled', province: '湖北', city: '武汉', customerId: 'C008', productIds: ['P010'] },
  { orderId: 'O009', orderTime: '2024-03-15T17:00:00', payAmount: 1197, channel: 'APP',  status: 'delivered', province: '广东', city: '深圳', customerId: 'C001', productIds: ['P003', 'P004', 'P007'] },
  { orderId: 'O010', orderTime: '2024-03-18T10:40:00', payAmount: 856,  channel: '小程序', status: 'delivered', province: '北京', city: '北京', customerId: 'C004', productIds: ['P001', 'P008'] },
  { orderId: 'O011', orderTime: '2024-03-20T09:10:00', payAmount: 278,  channel: 'APP',  status: 'shipped',  province: '上海', city: '上海', customerId: 'C002', productIds: ['P007', 'P008'] },
  { orderId: 'O012', orderTime: '2024-03-22T15:20:00', payAmount: 458,  channel: '官网',  status: 'delivered', province: '浙江', city: '杭州', customerId: 'C006', productIds: ['P002'] },
  { orderId: 'O013', orderTime: '2024-03-25T14:00:00', payAmount: 629,  channel: '4S店', status: 'delivered', province: '江苏', city: '苏州', customerId: 'C007', productIds: ['P005', 'P009'] },
  { orderId: 'O014', orderTime: '2024-03-28T11:30:00', payAmount: 398,  channel: 'APP',  status: 'returned',  province: '广东', city: '深圳', customerId: 'C003', productIds: ['P001'] },
  { orderId: 'O015', orderTime: '2024-03-30T19:45:00', payAmount: 966,  channel: '小程序', status: 'delivered', province: '北京', city: '北京', customerId: 'C001', productIds: ['P002', 'P006'] },
];

// ---- Campaigns ----
export const campaignsRaw: Campaign[] = [
  {
    campaignId: 'CP001',
    campaignName: '3.8 女神节车主专属折扣',
    campaignType: '折扣',
    budget: 50000,
    actualSpend: 48200,
    roi: 3.2,
    productIds: ['P009', 'P010', 'P007'],
    orderIds: ['O006', 'O013'],
  },
  {
    campaignId: 'CP002',
    campaignName: '318 车迷节车模买赠活动',
    campaignType: '赠品',
    budget: 80000,
    actualSpend: 72500,
    roi: 4.1,
    productIds: ['P001', 'P002', 'P003'],
    orderIds: ['O001', 'O002', 'O009', 'O010', 'O015'],
  },
  {
    campaignId: 'CP003',
    campaignName: '配件满199减30',
    campaignType: '满减',
    budget: 30000,
    actualSpend: 29800,
    roi: 2.8,
    productIds: ['P004', 'P005', 'P006'],
    orderIds: ['O005', 'O007', 'O013'],
  },
  {
    campaignId: 'CP004',
    campaignName: '限时秒杀：HUD 特价199',
    campaignType: '限时秒杀',
    budget: 20000,
    actualSpend: 18600,
    roi: 1.9,
    productIds: ['P006'],
    orderIds: ['O007'],
  },
];

// ---- GMV Trend (last 12 months) ----
export const gmvTrendData = [
  { month: '2023-04', gmv: 280000, orders: 820, grossMargin: 0.441 },
  { month: '2023-05', gmv: 310000, orders: 910, grossMargin: 0.438 },
  { month: '2023-06', gmv: 295000, orders: 870, grossMargin: 0.435 },
  { month: '2023-07', gmv: 340000, orders: 980, grossMargin: 0.442 },
  { month: '2023-08', gmv: 365000, orders: 1050, grossMargin: 0.440 },
  { month: '2023-09', gmv: 320000, orders: 940, grossMargin: 0.436 },
  { month: '2023-10', gmv: 390000, orders: 1120, grossMargin: 0.439 },
  { month: '2023-11', gmv: 520000, orders: 1480, grossMargin: 0.432 },
  { month: '2023-12', gmv: 480000, orders: 1360, grossMargin: 0.430 },
  { month: '2024-01', gmv: 350000, orders: 1020, grossMargin: 0.427 },
  { month: '2024-02', gmv: 380000, orders: 1100, grossMargin: 0.423 },
  { month: '2024-03', gmv: 418500, orders: 1205, grossMargin: 0.420 },
];
