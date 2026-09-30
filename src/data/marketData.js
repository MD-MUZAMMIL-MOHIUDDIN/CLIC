// ============================================================
// Market Prices, Mandis & Geographic Hierarchy Data Model
// ============================================================

export const marketPrices = [
  { id: 1, crop: 'Paddy (Fine)', variety: 'BPT 5204', market: 'Miryalaguda APMC', price: 2180, unit: 'quintal', change: +45, trend: 'up', date: 'Jul 17', buyers: ['RB Trading', 'Surya Traders'] },
  { id: 2, crop: 'Paddy (Coarse)', variety: 'Swarna', market: 'Nalgonda APMC', price: 1980, unit: 'quintal', change: -20, trend: 'down', date: 'Jul 17', buyers: ['Lakshmi Rice Mill'] },
  { id: 3, crop: 'Cotton', variety: 'Bunny BT-II', market: 'Suryapet APMC', price: 6850, unit: 'quintal', change: +120, trend: 'up', date: 'Jul 17', buyers: ['Gujarat Traders', 'Cotton Corp'] },
  { id: 4, crop: 'Red Gram (Tur)', variety: 'LRG-41', market: 'Nalgonda APMC', price: 7200, unit: 'quintal', change: 0, trend: 'flat', date: 'Jul 17', buyers: ['Akash Agro'] },
  { id: 5, crop: 'Groundnut', variety: 'K-6', market: 'Miryalaguda APMC', price: 5600, unit: 'quintal', change: -80, trend: 'down', date: 'Jul 17', buyers: ['Ruchi Soya', 'Cargill India'] },
  { id: 6, crop: 'Maize', variety: 'DKC 9141', market: 'Suryapet APMC', price: 1850, unit: 'quintal', change: +30, trend: 'up', date: 'Jul 17', buyers: ['Poultry Feed Co.', 'Sridhar Agro'] },
  { id: 7, crop: 'Jowar', variety: 'SPV 462', market: 'Nalgonda APMC', price: 2150, unit: 'quintal', change: +10, trend: 'up', date: 'Jul 17', buyers: ['State Food Corp'] },
  { id: 8, crop: 'Green Gram', variety: 'Samrat', market: 'Miryalaguda APMC', price: 6800, unit: 'quintal', change: -150, trend: 'down', date: 'Jul 17', buyers: ['Rajesh Pulses'] },
  { id: 9, crop: 'Bengalgram', variety: 'Desi', market: 'Nalgonda APMC', price: 5250, unit: 'quintal', change: +60, trend: 'up', date: 'Jul 17', buyers: ['Haldiram Suppliers'] },
  { id: 10, crop: 'Onion', variety: 'Bellary Red', market: 'Suryapet APMC', price: 1200, unit: 'quintal', change: -200, trend: 'down', date: 'Jul 17', buyers: ['Nashik Traders'] },
  { id: 11, crop: 'Tomato', variety: 'Hybrid F1', market: 'Miryalaguda APMC', price: 800, unit: 'quintal', change: +300, trend: 'up', date: 'Jul 17', buyers: ['Fresh Foods Ltd'] },
  { id: 12, crop: 'Turmeric', variety: 'Nizamabad', market: 'Nalgonda APMC', price: 8500, unit: 'quintal', change: +200, trend: 'up', date: 'Jul 17', buyers: ['Sunrise Spices'] },
];

export const defaultStates = ['Telangana', 'Andhra Pradesh'];

export const defaultDistricts = [
  { id: 'd1', name: 'Nalgonda', state: 'Telangana' },
  { id: 'd2', name: 'Suryapet', state: 'Telangana' },
];

export const defaultVillages = [
  { id: 'v1', name: 'Chandampet', districtId: 'd1' },
  { id: 'v2', name: 'Munchireddypally', districtId: 'd1' },
  { id: 'v3', name: 'Chityala', districtId: 'd1' },
  { id: 'v4', name: 'Marriguda', districtId: 'd1' },
  { id: 'v5', name: 'Tripuraram', districtId: 'd1' },
];

export const defaultCommodities = [
  'Cotton',
  'Paddy (Fine)',
  'Paddy (Coarse)',
  'Red Gram (Tur)',
  'Maize',
  'Groundnut',
  'Jowar',
  'Turmeric',
];

export const defaultVillagePrices = [
  { id: 1, crop: 'Paddy (Fine)', variety: 'BPT 5204', villageId: 'v1', price: 2200, trend: 'up', change: 50, date: 'Jul 21' },
  { id: 2, crop: 'Paddy (Fine)', variety: 'BPT 5204', villageId: 'v3', price: 2180, trend: 'flat', change: 0, date: 'Jul 21' },
  { id: 3, crop: 'Cotton', variety: 'Bunny BT-II', villageId: 'v2', price: 6900, trend: 'up', change: 100, date: 'Jul 21' },
  { id: 4, crop: 'Cotton', variety: 'Bunny BT-II', villageId: 'v4', price: 6850, trend: 'down', change: -50, date: 'Jul 21' },
  { id: 5, crop: 'Red Gram (Tur)', variety: 'LRG-41', villageId: 'v1', price: 7200, trend: 'flat', change: 0, date: 'Jul 21' },
  { id: 6, crop: 'Maize', variety: 'DKC 9141', villageId: 'v5', price: 1880, trend: 'up', change: 40, date: 'Jul 21' },
];

export const markets = ['All Markets', 'Nalgonda APMC', 'Miryalaguda APMC', 'Suryapet APMC'];

// Backward compatibility re-exports from dedicated files
export { chcEquipment } from './chcData';
export { inputStore } from './inputStoreData';

export default marketPrices;
