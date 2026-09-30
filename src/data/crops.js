// ============================================================
// Agronomy, Crops, Livestock, Fisheries & Learning Hub Master Module
// ============================================================

export * from './cropsData';
export * from './livestockData';
export * from './fisheriesData';

// Learning Hub Video Tutorials
export const videos = [
  { id: 1, title: 'SRI Method of Paddy Cultivation', duration: '18 min', category: 'Paddy', type: 'video', tags: ['Paddy', 'Water Conservation', 'Cereals'], views: 1240, thumbnail: '🌾', description: 'Step-by-step guide to System of Rice Intensification. Saves 30% water, 25% seed.' },
  { id: 2, title: 'Natural Pest Management in Cotton', duration: '22 min', category: 'Cotton', type: 'video', tags: ['Cotton', 'Organic', 'Pests'], views: 890, thumbnail: '🌿', description: 'Biological and botanical methods. Trichogramma, HaNPV, Neem oil application.' },
  { id: 3, title: 'Drip Irrigation Installation', duration: '15 min', category: 'Water Mgmt', type: 'video', tags: ['Water Conservation', 'Soil Health'], views: 2100, thumbnail: '💧', description: 'Installing drip system for vegetable crops. Calculate flow rate and emitter spacing.' },
  { id: 4, title: 'Kitchen Garden Setup', duration: '12 min', category: 'Kitchen Garden', type: 'video', tags: ['Organic', 'Soil Health'], views: 3200, thumbnail: '🥬', description: 'How to set up a productive kitchen garden using organic methods in 10 cents.' },
  { id: 5, title: 'Composting & Vermicompost', duration: '20 min', category: 'Organic', type: 'video', tags: ['Organic', 'Soil Health'], views: 1560, thumbnail: '🌱', description: 'Making quality compost and vermicompost from farm and kitchen waste.' },
  { id: 6, title: 'Millet Cultivation Guide', duration: '25 min', category: 'Millets', type: 'video', tags: ['Millets', 'Water Conservation', 'Cereals'], views: 720, thumbnail: '🌾', description: 'Foxtail, little millet, finger millet – cultivation, nutrition, and market.' },
  { id: 7, title: 'Livestock Health & Vaccination', duration: '18 min', category: 'Animal Husb.', type: 'video', tags: ['Livestock', 'Animal Husbandry'], views: 980, thumbnail: '🐄', description: 'Common cattle diseases, vaccination schedule, and foot-and-mouth prevention.' },
  { id: 8, title: 'Using Soil Health Card Results', duration: '10 min', category: 'Soil Health', type: 'video', tags: ['Soil Health', 'Organic'], views: 1340, thumbnail: '🌍', description: 'Interpreting your soil health card and applying the right nutrient doses.' },
  { id: 9, title: 'PM-KISAN Scheme Step-by-Step Guide', duration: '10 pages', category: 'Schemes', type: 'pdf', tags: ['Govt Schemes', 'Support'], views: 4200, thumbnail: '📄', description: 'Official PDF guidelines to register and verify your details for PM-KISAN payouts.' },
  { id: 10, title: 'Integrated Fish Farming Manual', duration: '15 mins read', category: 'Fisheries', type: 'article', tags: ['Fisheries', 'Water Conservation', 'Organic'], views: 1050, thumbnail: '🐟', description: 'How to combine fish farming with poultry or duck breeding to recycle nutrients.' },
  { id: 11, title: 'Borewell Recharging Techniques', duration: 'External Link', category: 'Water Mgmt', type: 'link', tags: ['Water Conservation', 'Soil Health'], views: 2450, thumbnail: '🔗', description: 'External video case studies and instructions by the National Water Mission on recharging borewells.' }
];

export const successStories = [
  { id: 1, name: 'Yellamma Raju', village: 'Chandampet, Nalgonda', crop: 'SRI Paddy', achievement: 'Reduced water use by 35%, increased yield to 32 bags/acre', income: '₹85,000 net profit (up from ₹52,000)', photo: '👩‍🌾', year: '2024' },
  { id: 2, name: 'Srinivas Goud', village: 'Munchireddypally, Suryapet', crop: 'Natural Cotton', achievement: 'Zero pesticide cost. Certified organic after 3 years', income: '₹15,000/quintal premium price (vs ₹6,800 market)', photo: '👨‍🌾', year: '2024' },
  { id: 3, name: 'Savitri SHG Group (12 women)', village: 'Chityala, Nalgonda', crop: 'Kitchen Garden + Millets', achievement: '12 families food-secure year-round. Selling surplus millets.', income: 'Average ₹3,200/month additional income per family', photo: '👩‍🌾', year: '2025' },
  { id: 4, name: 'Ramaiah Naik', village: 'Marriguda, Nalgonda', crop: 'Red Gram + Maize (Intercrop)', achievement: 'Intercropping reduced pest pressure by 40%', income: '₹92,000 from 3 acres (vs ₹64,000 monocrop)', photo: '👨‍🌾', year: '2025' },
];
