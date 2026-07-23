// ============================================================
// Mock Data – Market Prices & CHC
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

// Custom Hiring Centre (CHC) Equipment
export const chcEquipment = [
  { id: 1, name: 'Tractor (45 HP)', icon: 'tractor', available: 3, total: 5, rate: '₹600/hr', deposit: '₹1,000', description: 'John Deere 5050E with trailer. Suitable for field preparation.' },
  { id: 2, name: 'Paddy Transplanter', icon: 'leaf', available: 1, total: 2, rate: '₹800/hr', deposit: '₹2,000', description: '6-row semi-automatic. Reduces labor cost by 60%.' },
  { id: 3, name: 'Power Tiller', icon: 'settings', available: 4, total: 4, rate: '₹250/hr', deposit: '₹500', description: 'Kirloskar 7HP. Suitable for small holdings and kitchen gardens.' },
  { id: 4, name: 'Sprayer (Power)', icon: 'zap', available: 2, total: 3, rate: '₹150/hr', deposit: '₹300', description: 'Knapsack power sprayer. 16L capacity. Used for pest management.' },
  { id: 5, name: 'Thresher (Maize)', icon: 'wind', available: 1, total: 2, rate: '₹500/hr', deposit: '₹1,000', description: 'Combined thresher-sheller for maize. 2 ton/hr capacity.' },
  { id: 6, name: 'SRI Drum Seeder', icon: 'circle-dot', available: 2, total: 2, rate: '₹100/day', deposit: '₹200', description: 'System of Rice Intensification seeder. 8-row.' },
  { id: 7, name: 'Drip Irrigation Kit', icon: 'droplets', available: 5, total: 8, rate: '₹200/day', deposit: '₹500', description: 'Complete drip kit for 0.5 acre. Reduces water use by 50%.' },
  { id: 8, name: 'Laser Leveler', icon: 'minimize-2', available: 1, total: 1, rate: '₹2000/day', deposit: '₹5,000', description: 'Precise field leveling. Saves 20-30% irrigation water.' },
];

// Input Store
export const inputStore = [
  { id: 1, category: 'Bio-Fertilizer', name: 'Rhizobium Culture', price: 35, unit: '200g packet', stock: 150, description: 'For legume crops. Fixes atmospheric nitrogen.' },
  { id: 2, category: 'Bio-Fertilizer', name: 'PSB (Phosphate Solubilizing Bacteria)', price: 40, unit: '200g packet', stock: 200, description: 'Solubilizes phosphate. Improves root growth.' },
  { id: 3, category: 'Bio-Fertilizer', name: 'Azospirillum', price: 35, unit: '200g packet', stock: 180, description: 'N-fixing for non-legumes. Promotes cereal growth.' },
  { id: 4, category: 'Bio-Fertilizer', name: 'Mycorrhiza', price: 80, unit: '1kg', stock: 60, description: 'Improves nutrient and water uptake. Works with most crops.' },
  { id: 5, category: 'Seeds', name: 'Paddy – BPT 5204', price: 65, unit: 'kg', stock: 500, description: 'Fine grain. Milling yield 67%. Suitable for Nalgonda soils.' },
  { id: 6, category: 'Seeds', name: 'Red Gram – LRG-41', price: 120, unit: 'kg', stock: 200, description: 'Medium duration 150-160 days. Wilt resistant.' },
  { id: 7, category: 'Seeds', name: 'Foxtail Millet – SiA 3085', price: 55, unit: 'kg', stock: 100, description: 'Nutritious traditional grain. Drought tolerant.' },
  { id: 8, category: 'Seeds', name: 'Little Millet (Sama)', price: 70, unit: 'kg', stock: 80, description: '60-day crop. High iron content. Kitchen garden suitable.' },
  { id: 9, category: 'Botanical', name: 'Neem Oil (5% EC)', price: 180, unit: 'litre', stock: 120, description: 'Broad-spectrum botanical pesticide. OMRI listed.' },
  { id: 10, category: 'Botanical', name: 'Pongamia Seed Extract', price: 90, unit: '500ml', stock: 150, description: 'Local botanical. Effective against sucking pests.' },
  { id: 11, category: 'Botanical', name: 'Trichogramma Cards', price: 25, unit: 'card (1 acre)', stock: 500, description: 'Egg parasitoid for borer control. Bio-control agent.' },
  { id: 12, category: 'Botanical', name: 'Beauveria bassiana', price: 120, unit: '500g', stock: 80, description: 'Entomopathogenic fungus. Controls thrips, white flies.' },
];
