// ============================================================
// Farm Machinery Data & Workflow Model for CLIC
// ============================================================

export { INITIAL_CHC_HUBS, chcEquipment, DEFAULT_CHC_EQUIPMENT } from './chcData';
export { INITIAL_FMC_SHOPS } from './fmcData';
export { DEFAULT_FMC_INVENTORY, fmcInventory } from './fmcInventory';
export { INITIAL_FMC_PURCHASE_ORDERS, INITIAL_CHC_RENTAL_ORDERS } from './machineryOrdersData';


export const MACHINERY_OPERATIONS = [
  {
    id: 'land-prep',
    name: 'Land Preparation / Tillage',
    telugu: 'భూమి తయారీ / దుక్కి',
    icon: '🚜',
    description: 'Deep ploughing, rotavating, bund formation, and laser land leveling.',
    bannerColor: '#2563EB',
    count: 4
  },
  {
    id: 'sowing',
    name: 'Sowing & Planting',
    telugu: 'విత్తడం & నాట్లు',
    icon: '🌱',
    description: 'Seed drills, mechanized paddy transplanters, and SRI drum seeders.',
    bannerColor: '#059669',
    count: 3
  },
  {
    id: 'spraying',
    name: 'Plant Protection & Spraying',
    telugu: 'సస్యరక్షణ & స్ప్రేయింగ్',
    icon: '⚡',
    description: 'Knapsack battery sprayers, high-pressure boom sprayers, and agri drones.',
    bannerColor: '#0284C7',
    count: 3
  },
  {
    id: 'harvesting',
    name: 'Harvesting',
    telugu: 'కోత యంత్రాలు',
    icon: '🌾',
    description: 'Multi-crop combine harvesters, paddy reapers, and cutter-binders.',
    bannerColor: '#D97706',
    count: 3
  },
  {
    id: 'threshing',
    name: 'Threshing & Post-Harvest',
    telugu: 'నూర్పిడి & నిల్వ',
    icon: '💨',
    description: 'Maize shellers, multi-crop threshers, grain cleaners, and chaff cutters.',
    bannerColor: '#7C3AED',
    count: 3
  },
  {
    id: 'irrigation',
    name: 'Irrigation & Pumping',
    telugu: 'నీటిపారుదల',
    icon: '💧',
    description: 'Solar water pumps, portable diesel pumpsets, and micro-drip kits.',
    bannerColor: '#0891B2',
    count: 2
  }
];

export const FARM_MACHINES = [
  {
    machineId: 'FM_001',
    id: 'm1',
    machineName: 'Rotavator 7 Feet (Heavy Duty Rotary Tiller)',
    name: 'Rotavator 7 Feet (Heavy Duty Rotary Tiller)',
    telugu: 'రోటవేటర్ 7 అడుగులు (జాన్ డీర్ 5050E ట్రాక్టర్)',
    operationType: 'Tillage',
    operationId: 'land-prep',
    operationName: 'Land Preparation / Tillage',
    category: 'Tillage & Rotary Implements',
    powerHP: '50 HP Required',
    fuelType: 'Tractor PTO Driven',
    capacity: '2.5 - 3.0 acres/day',
    brand: 'Shaktiman / John Deere',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1000&q=80',
    shortDescription: 'Heavy-duty 7-feet PTO rotary tiller for secondary tillage, soil pulverization, and green manure puddling.',
    fullTechnicalDescription: 'High-torque multi-speed gearbox 7ft rotavator equipped with 48 boron steel L-type curved blades. Prepares optimal fine seedbed in single pass across black cotton and wet clay soils, reducing fuel consumption by 20%.',
    description: 'High-torque multi-speed gearbox 7ft rotavator equipped with 48 boron steel L-type curved blades. Prepares optimal fine seedbed in single pass across black cotton and wet clay soils, reducing fuel consumption by 20%.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1200&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1200&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Rotavator 7 Feet Field Demonstration: Soil Pulverization & Puddling',
    purchasable: 'Yes',
    isPurchasable: true,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Tillage Width': '7 Feet (2.1 meters)',
      'Blades': '48 Boron Steel L-Type Blades',
      'Gearbox': 'Multi-Speed with Heavy Duty Bevel Gears',
      'Tractor Power': '45 - 55 HP with 540 RPM PTO',
      'Depth of Cut': '6 to 8 inches adjustable',
      'Compatible Crops': 'Paddy, Cotton, Maize, Sugarcane, Chilly',
      'Recommended Implements': '3-Bottom MB Plough, 7-Tine Cultivator'
    },
    chcAvailability: {
      total: 5,
      available: 3,
      rateHourly: 650,
      rateDaily: 4800,
      ratePerAcre: 1200,
      deposit: 1500,
      chcHub: 'Chandampet Central CHC Hub',
      operatorAvailable: true,
      operatorRateExtra: 150
    },
    purchaseInfo: {
      msrp: 145000,
      subsidyScheme: 'SMAM (Sub-Mission on Agricultural Mechanization)',
      subsidyPercent: 40,
      subsidyAmount: 58000,
      effectivePrice: 87000,
      dealers: [
        { name: 'Sri Lakshmi Agro Automotives', city: 'Nalgonda', stock: 3, contact: '9848011223' },
        { name: 'Kisan Machinery Plaza', city: 'Miryalaguda', stock: 2, contact: '9848033445' }
      ]
    }
  },
  {
    machineId: 'FM_002',
    id: 'm3',
    machineName: 'Paddy Transplanter (4-Row)',
    name: 'Paddy Transplanter (4-Row)',
    telugu: 'కుబోటా వరి నాటు యంత్రం (4 వరుసలు)',
    operationType: 'Sowing',
    operationId: 'sowing',
    operationName: 'Sowing & Planting',
    category: 'Mechanized Planting',
    powerHP: '4.3 HP Petrol Engine',
    fuelType: 'Petrol (0.8 L/hr)',
    capacity: '2.5 - 3.5 acres/day',
    brand: 'Kubota Agricultural Machinery',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Self-propelled walk-behind transplanter',
    fullTechnicalDescription: 'Self-propelled 4-row mechanical walk-behind paddy transplanter. Replaces 12-15 manual laborers per acre, ensuring uniform seedling spacing (30cm x 15cm) and promoting higher tillering for maximum paddy yields.',
    description: 'Self-propelled 4-row mechanical walk-behind paddy transplanter. Replaces 12-15 manual laborers per acre, ensuring uniform seedling spacing (30cm x 15cm) and promoting higher tillering for maximum paddy yields.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Kubota Paddy Transplanter Operation & Mat Nursery Preparation',
    purchasable: 'Yes',
    isPurchasable: true,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Planting Rows': '4 Rows simultaneously',
      'Row Spacing': '300 mm (Fixed)',
      'Hill Distance': '120 mm - 180 mm (Adjustable)',
      'Seedling Type': 'Mat Nursery (14-18 days old)',
      'Labor Reduction': 'Saves 85% manual transplanting labor',
      'Compatible Crops': 'Paddy (All Varieties: BPT, MTU, Swarna)'
    },
    chcAvailability: {
      total: 3,
      available: 2,
      rateHourly: 550,
      rateDaily: 4200,
      ratePerAcre: 1100,
      deposit: 1200,
      chcHub: 'Chandampet Central CHC Hub',
      operatorAvailable: true,
      operatorRateExtra: 100
    },
    purchaseInfo: {
      msrp: 295000,
      subsidyScheme: 'NFSM Rice Mechanization Subsidy',
      subsidyPercent: 50,
      subsidyAmount: 147500,
      effectivePrice: 147500,
      dealers: [
        { name: 'Kubota Authorized Dealership', city: 'Suryapet', stock: 2, contact: '9848077665' },
        { name: 'Telangana Agri Tools & Spares', city: 'Nalgonda', stock: 1, contact: '9848066554' }
      ]
    }
  },
  {
    machineId: 'FM_003',
    id: 'm5',
    machineName: 'Tractor Mounted Boom Sprayer',
    name: 'Tractor Mounted Boom Sprayer',
    telugu: 'ట్రాక్టర్ మౌంటెడ్ బూమ్ స్ప్రేయర్',
    operationType: 'Plant Protection',
    operationId: 'spraying',
    operationName: 'Plant Protection & Spraying',
    category: 'Smart Agriculture & Boom Sprayers',
    powerHP: 'Requires 35+ HP Tractor',
    fuelType: 'Tractor PTO Driven',
    capacity: '25 - 30 acres/day',
    brand: 'Aspee / Mitra Agro',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    shortDescription: '500L tank tractor-mounted folding boom sprayer for extensive row crop pest management.',
    fullTechnicalDescription: 'Tractor-mounted 12-meter hydraulic folding boom sprayer equipped with high-pressure diaphragm pump and anti-drip brass nozzles. Covers wide swath with precision droplet distribution, ideal for cotton, chilli, and pulses.',
    description: 'Tractor-mounted 12-meter hydraulic folding boom sprayer equipped with high-pressure diaphragm pump and anti-drip brass nozzles. Covers wide swath with precision droplet distribution, ideal for cotton, chilli, and pulses.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Tractor Mounted Boom Sprayer: Pressure Calibration & Anti-Drip Nozzles',
    purchasable: 'No',
    isPurchasable: false,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Tank Capacity': '500 Litres UV-Stabilized Polyethylene',
      'Boom Length': '12 meters (40 feet) folding',
      'Nozzles': '24 Anti-Drip Ceramic Fan Nozzles',
      'Pump Capacity': '55 L/min at 40 bar',
      'Compatible Crops': 'Cotton, Paddy, Chilly, Maize, Red Gram'
    },
    chcAvailability: {
      total: 3,
      available: 2,
      rateHourly: 450,
      rateDaily: 3200,
      ratePerAcre: 350,
      deposit: 1500,
      chcHub: 'Chandampet Central CHC Hub',
      operatorAvailable: true,
      operatorRateExtra: 100
    },
    purchaseInfo: {
      msrp: 185000,
      subsidyScheme: 'Horticulture & Plant Protection Scheme',
      subsidyPercent: 50,
      subsidyAmount: 92500,
      effectivePrice: 92500,
      dealers: [
        { name: 'Mitra Agro Dealership', city: 'Suryapet', stock: 1, contact: '9848044332' }
      ]
    }
  },
  {
    machineId: 'FM_004',
    id: 'm7',
    machineName: 'Multi-Crop Combine Harvester',
    name: 'Multi-Crop Combine Harvester',
    telugu: 'మల్టీ క్రాప్ కంబైన్ హార్వెస్టర్',
    operationType: 'Harvesting',
    operationId: 'harvesting',
    operationName: 'Harvesting',
    category: 'Heavy Harvesting Machinery',
    powerHP: '76 HP Ashok Leyland Turbo Diesel',
    fuelType: 'Diesel (7.5 L/hr)',
    capacity: '1.2 - 1.5 acres/hr',
    brand: 'CLAAS India / Preet',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Heavy-duty self-propelled tracked multi-crop combine harvester for paddy and maize.',
    fullTechnicalDescription: 'High-throughput tangential threshing combine harvester capable of cutting, threshing, and cleaning grains in a single continuous pass with certified under 0.5% grain loss rate.',
    description: 'High-throughput tangential threshing combine harvester capable of cutting, threshing, and cleaning grains in a single continuous pass with certified under 0.5% grain loss rate.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'CLAAS Multi-Crop Combine Harvester Field Demo: Clean Threshing & Minimum Grain Loss',
    purchasable: 'No',
    isPurchasable: false,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Cutter Bar Width': '2.1 meters (7 feet)',
      'Threshing Drum': 'Tangential with 6 rasp bars',
      'Grain Tank Capacity': '1200 Litres (approx 900 kg grain)',
      'Grain Loss Rate': 'Under 0.5% certified',
      'Compatible Crops': 'Paddy, Maize, Soybean, Green Gram, Black Gram'
    },
    chcAvailability: {
      total: 2,
      available: 1,
      rateHourly: 2200,
      rateDaily: 18000,
      ratePerAcre: 2600,
      deposit: 5000,
      chcHub: 'Chandampet Central CHC Hub',
      operatorAvailable: true,
      operatorRateExtra: 0
    },
    purchaseInfo: {
      msrp: 2350000,
      subsidyScheme: 'SMAM CHC Establishment Scheme',
      subsidyPercent: 40,
      subsidyAmount: 940000,
      effectivePrice: 1410000,
      dealers: [
        { name: 'CLAAS Authorized Sales & Service', city: 'Suryapet', stock: 1, contact: '9848055443' }
      ]
    }
  },
  {
    machineId: 'FM_005',
    id: 'm2',
    machineName: 'Precision Laser Land Leveler (7ft Blade)',
    name: 'Precision Laser Land Leveler (7ft Blade)',
    telugu: 'లేజర్ ల్యాండ్ లెవెలర్',
    operationType: 'Tillage',
    operationId: 'land-prep',
    operationName: 'Land Preparation / Tillage',
    category: 'Land Grading & Leveling',
    powerHP: 'Requires 45+ HP Tractor',
    fuelType: 'Tractor PTO Driven',
    capacity: '1.5 - 2.0 acres/hr',
    brand: 'Trimble Agro Tech',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Dual-transmitter laser scraper for sub-millimeter field leveling and 30% water saving.',
    fullTechnicalDescription: 'Advanced dual-transmitter laser-guided leveling scraper. Levels the field to millimeter precision, eliminating uneven irrigation puddles and reducing pumping hours by 25-30%.',
    description: 'Advanced dual-transmitter laser-guided leveling scraper. Levels the field to millimeter precision, eliminating uneven irrigation puddles and reducing pumping hours by 25-30%.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Precision Laser Land Leveling: Saving 30% Irrigation Water & Yield Optimization',
    purchasable: 'Yes',
    isPurchasable: true,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Blade Width': '7 Feet (2.13 meters)',
      'Laser Range': '800 meter diameter coverage',
      'Control Box': 'Automatic hydraulic proportional control',
      'Accuracy': '±2 mm per 10 meters',
      'Water Saving': '25% - 30% reduction in irrigation pumping hours',
      'Compatible Crops': 'Paddy, Cotton, Groundnut, Wheat'
    },
    chcAvailability: {
      total: 2,
      available: 1,
      rateHourly: 950,
      rateDaily: 7000,
      ratePerAcre: 1800,
      deposit: 3000,
      chcHub: 'Munchireddypally CHC Point',
      operatorAvailable: true,
      operatorRateExtra: 200
    },
    purchaseInfo: {
      msrp: 385000,
      subsidyScheme: 'RKVY Precision Farming Support',
      subsidyPercent: 50,
      subsidyAmount: 192500,
      effectivePrice: 192500,
      dealers: [
        { name: 'Trimble India Agri Hub', city: 'Hyderabad / Nalgonda', stock: 3, contact: '9848099881' }
      ]
    }
  },
  {
    machineId: 'FM_006',
    id: 'm4',
    machineName: 'Automatic Multi-Crop Seed-cum-Fertilizer Drill (9 Tines)',
    name: 'Automatic Multi-Crop Seed-cum-Fertilizer Drill (9 Tines)',
    telugu: 'విత్తన & ఎరువుల డ్రిల్ యంత్రం',
    operationType: 'Sowing',
    operationId: 'sowing',
    operationName: 'Sowing & Planting',
    category: 'Seeding Implements',
    powerHP: 'Requires 35+ HP Tractor',
    fuelType: 'Tractor Ground Wheel Driven',
    capacity: '6.0 - 8.0 acres/day',
    brand: 'National Agro Industries',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Simultaneous seed and fertilizer placement with fluted roller depth control.',
    fullTechnicalDescription: 'Simultaneously drops seeds and fertilizer at calibrated depths in uniform rows. Prevents seed loss from birds and reduces seed requirement by 20%.',
    description: 'Simultaneously drops seeds and fertilizer at calibrated depths in uniform rows. Prevents seed loss from birds and reduces seed requirement by 20%.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Zero-Till Multi Crop Seed & Fertilizer Drill in Action',
    purchasable: 'Yes',
    isPurchasable: true,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Tines': '9 Tines with inverted T openers',
      'Row Spacing': '7 inches - 9 inches (Adjustable)',
      'Hopper Capacity': 'Seed 60 kg + Fertilizer 65 kg',
      'Metering System': 'Fluted roller metering',
      'Compatible Crops': 'Maize, Red Gram, Bengal Gram, Groundnut, Wheat'
    },
    chcAvailability: {
      total: 4,
      available: 4,
      rateHourly: 350,
      rateDaily: 2600,
      ratePerAcre: 600,
      deposit: 800,
      chcHub: 'Chityala CHC Hub',
      operatorAvailable: true,
      operatorRateExtra: 80
    },
    purchaseInfo: {
      msrp: 78000,
      subsidyScheme: 'SMAM Women & Small Farmer Subsidy',
      subsidyPercent: 50,
      subsidyAmount: 39000,
      effectivePrice: 39000,
      dealers: [
        { name: 'Kisan Machinery Plaza', city: 'Miryalaguda', stock: 4, contact: '9848033445' }
      ]
    }
  },
  {
    machineId: 'FM_007',
    id: 'm8',
    machineName: 'Paddy Reaper-cum-Binder (Self-Propelled 3-Wheel)',
    name: 'Paddy Reaper-cum-Binder (Self-Propelled 3-Wheel)',
    telugu: 'వరి కోత & కట్టల బైండర్',
    operationType: 'Harvesting',
    operationId: 'harvesting',
    operationName: 'Harvesting',
    category: 'Small Harvester',
    powerHP: '10.5 HP Air-Cooled Diesel Engine',
    fuelType: 'Diesel (1.1 L/hr)',
    capacity: '1.0 acre per 2.5 hours',
    brand: 'BCS India / Bomet',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Cuts cereal crops at 5cm height and auto-bundles straw for animal fodder.',
    fullTechnicalDescription: 'Cuts cereal crops close to the ground and automatically ties them into tight bundles using twine. Saves 100% straw for dairy fodder.',
    description: 'Cuts cereal crops close to the ground and automatically ties them into tight bundles using twine. Saves 100% straw for dairy fodder.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Self-Propelled Reaper Binder: Clean Cutting & Auto Bundling',
    purchasable: 'Yes',
    isPurchasable: true,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Cutting Width': '1.2 meters (4 feet)',
      'Cutting Height': '30 mm - 50 mm from soil',
      'Binding Mechanism': 'Automatic twine knotter with tensioner',
      'Straw Recovery': '100% straw saved for dairy livestock',
      'Compatible Crops': 'Paddy, Wheat, Oats, Foxtail Millet'
    },
    chcAvailability: {
      total: 3,
      available: 2,
      rateHourly: 600,
      rateDaily: 4500,
      ratePerAcre: 1300,
      deposit: 1500,
      chcHub: 'Tripuraram CHC Point',
      operatorAvailable: true,
      operatorRateExtra: 100
    },
    purchaseInfo: {
      msrp: 340000,
      subsidyScheme: 'State Agriculture Mechanization Support',
      subsidyPercent: 50,
      subsidyAmount: 170000,
      effectivePrice: 170000,
      dealers: [
        { name: 'Sri Lakshmi Agro Automotives', city: 'Nalgonda', stock: 2, contact: '9848011223' }
      ]
    }
  },
  {
    machineId: 'FM_008',
    id: 'm9',
    machineName: 'Multi-Crop High Output Thresher & Cleaner',
    name: 'Multi-Crop High Output Thresher & Cleaner',
    telugu: 'మల్టీ క్రాప్ త్రెషర్ & క్లీనర్',
    operationType: 'Threshing',
    operationId: 'threshing',
    operationName: 'Threshing & Post-Harvest',
    category: 'Post-Harvest Threshing',
    powerHP: 'Requires 35+ HP Tractor PTO',
    fuelType: 'Tractor PTO Driven',
    capacity: '1.5 - 2.5 tonnes/hr',
    brand: 'Kisan Craft Agro',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Dual winnowing blower multi-crop thresher delivering 99% clean grain output.',
    fullTechnicalDescription: 'Heavy duty multi-crop thresher with dual winnowing blowers and vibrating grading sieves. Delivers 99% clean grain directly into bags while converting crop residues into fine chaff for livestock feed.',
    description: 'Heavy duty multi-crop thresher with dual winnowing blowers and vibrating grading sieves. Delivers 99% clean grain directly into bags while converting crop residues into fine chaff for livestock feed.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Multi-Crop Thresher Operation: Maize, Pulses, Soya Setup Guide',
    purchasable: 'Yes',
    isPurchasable: true,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Drum Type': 'Peg tooth with interchangeable concave',
      'Blowers': 'Double centrifugal winnowing fans',
      'Cleaning Efficiency': '99.2% clean grain output',
      'Grain Damage': 'Under 1% breakage',
      'Compatible Crops': 'Maize, Red Gram, Bengal Gram, Soya, Jowar'
    },
    chcAvailability: {
      total: 3,
      available: 2,
      rateHourly: 450,
      rateDaily: 3500,
      ratePerAcre: 900,
      deposit: 1000,
      chcHub: 'Chandampet Central CHC Hub',
      operatorAvailable: true,
      operatorRateExtra: 100
    },
    purchaseInfo: {
      msrp: 185000,
      subsidyScheme: 'Post-Harvest Management Infrastructure Fund',
      subsidyPercent: 50,
      subsidyAmount: 92500,
      effectivePrice: 92500,
      dealers: [
        { name: 'Kisan Machinery Plaza', city: 'Miryalaguda', stock: 2, contact: '9848033445' }
      ]
    }
  },
  {
    machineId: 'FM_009',
    id: 'm10',
    machineName: '5 HP Solar DC Submersible Water Pump Set',
    name: '5 HP Solar DC Submersible Water Pump Set',
    telugu: '5 HP సోలార్ నీటి పంపు సెట్',
    operationType: 'Irrigation',
    operationId: 'irrigation',
    operationName: 'Irrigation & Pumping',
    category: 'Solar Agri Energy',
    powerHP: '5 HP DC Submersible (4800W Array)',
    fuelType: 'Zero Fuel (100% Solar Powered)',
    capacity: '1,20,000 to 1,50,000 Litres/day',
    brand: 'Shakti Solar Pumps India',
    thumbnailImageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    shortDescription: 'Grid-independent stainless steel solar irrigation pump delivering 1.4 lakh litres/day.',
    fullTechnicalDescription: 'High-efficiency stainless steel solar water pumping system complete with auto-tracking structure, MPPT controller, and remote GSM monitoring. Operates uninterrupted from sunrise to sunset without grid power dependence.',
    description: 'High-efficiency stainless steel solar water pumping system complete with auto-tracking structure, MPPT controller, and remote GSM monitoring. Operates uninterrupted from sunrise to sunset without grid power dependence.',
    galleryMediaUrls: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'PM-KUSUM Solar Water Pump Installation, MPPT Controller & Drip Integration',
    purchasable: 'Yes',
    isPurchasable: true,
    rentable: 'Yes',
    isRentable: true,
    specs: {
      'Motor Rating': '5 HP Brushless DC (BLDC) Submersible',
      'Solar PV Array': '16 x 330W Mono-PERC Panels (4800 Watts)',
      'Discharge Head': 'Up to 90 meters (300 feet)',
      'Water Output': 'Avg 1.4 Lakh Litres per sunny day',
      'Warranty': '25 Years PV Module Performance, 5 Years System'
    },
    chcAvailability: {
      total: 1,
      available: 1,
      rateHourly: 150,
      rateDaily: 1000,
      ratePerAcre: 300,
      deposit: 1000,
      chcHub: 'Chandampet Central CHC Hub',
      operatorAvailable: false,
      operatorRateExtra: 0
    },
    purchaseInfo: {
      msrp: 245000,
      subsidyScheme: 'PM-KUSUM Component-B (60% Govt Subsidy + 30% Bank Loan)',
      subsidyPercent: 60,
      subsidyAmount: 147000,
      effectivePrice: 98000,
      dealers: [
        { name: 'Shakti Solar Authorized Energy Center', city: 'Nalgonda', stock: 5, contact: '9848022114' }
      ]
    }
  }
];

export const DEMO_FARMERS = [
  {
    id: 'f1',
    name: 'Ramu Farmer',
    telugu: 'రాము రెడ్డి',
    village: 'Chandampet',
    district: 'Nalgonda',
    phone: '9876543210',
    aadhaar: '4821',
    landHolding: '3.5 acres',
    soilType: 'Red Sandy Loam',
    crops: ['Paddy (Fine)', 'Cotton', 'Red Gram'],
    bankAccount: 'SBI - 30891283891',
    subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
    activeQuery: 'Looking for a mechanized paddy transplanter and combine harvester booking for Kharif season'
  },
  {
    id: 'f2',
    name: 'Yellaiah Goud',
    telugu: 'ఎల్లయ్య గౌడ్',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    phone: '9848123456',
    aadhaar: '8912',
    landHolding: '5.0 acres',
    soilType: 'Black Cotton Soil',
    crops: ['Cotton', 'Maize'],
    bankAccount: 'Andhra Bank - 5510294812',
    subsidyCategory: 'General Farmer',
    activeQuery: 'Inquiring about 50 HP John Deere tractor purchase with SMAM subsidy & drone spraying booking'
  },
  {
    id: 'f3',
    name: 'Kavitha Devi (SHG Lead)',
    telugu: 'కవిత దేవి',
    village: 'Marriguda',
    district: 'Nalgonda',
    phone: '9440567890',
    aadhaar: '7341',
    landHolding: '2.0 acres',
    soilType: 'Red Loam',
    crops: ['Paddy', 'Groundnut', 'Vegetables'],
    bankAccount: 'Canara Bank - 1100293849',
    subsidyCategory: 'Women Farmer / SHG (Priority 50% Subsidy)',
    activeQuery: 'Needs power sprayer and drum seeder rental for women collective farming'
  },
  {
    id: 'f4',
    name: 'Raghu Naik',
    telugu: 'రఘు నాయక్',
    village: 'Chityala',
    district: 'Nalgonda',
    phone: '9989012345',
    aadhaar: '6019',
    landHolding: '6.5 acres',
    soilType: 'Sandy Loam',
    crops: ['Paddy', 'Maize', 'Turmeric'],
    bankAccount: 'HDFC - 5010029381',
    subsidyCategory: 'ST Category (Special 50% Subsidy)',
    activeQuery: 'Needs laser land leveler booking before nursery sowing'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'FM-PUR-1001',
    type: 'purchase',
    date: '2026-09-28',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    machineId: 'm1',
    machineName: 'Rotavator 7 Feet (Heavy Duty Rotary Tiller)',
    dealer: 'Sri Lakshmi Agro Automotives (Nalgonda)',
    dealerPhone: '9848011223',
    msrp: 145000,
    subsidyAmount: 58000,
    netPayable: 87000,
    paymentMode: 'Kisan Credit Card (KCC) + 40% Subsidy',
    status: 'Alert Dispatched to FM Shop',
    stage: 'fm_shop_alerted',
    timeline: [
      { time: '10:15 AM', text: 'Farmer walk-in at CLIC Munchireddypally center' },
      { time: '10:22 AM', text: 'Farmer selected Rotavator 7 Feet for Purchase' },
      { time: '10:25 AM', text: 'Order closed in CLIC · Order Ref: FM-PUR-1001' },
      { time: '10:26 AM', text: 'Alert sent to FM Shop: Sri Lakshmi Agro Automotives' },
      { time: '10:27 AM', text: 'Alert sent to Farmer Yellaiah via SMS' }
    ]
  }
];

export const INITIAL_FARMER_QUERIES = [
  {
    id: 'QRY-2026-101',
    farmerId: 'f1',
    farmerName: 'Ramu Farmer',
    farmerPhone: '9876543210',
    village: 'Chandampet',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Looking for a mechanized paddy transplanter and combine harvester booking for Kharif season',
    facilitatorId: 'fac-1',
    facilitatorName: 'Kishan Goud (CLIC Lead)',
    facilitatorEmail: 'facilitator@clic.in',
    timestamp: '2026-09-28 09:30 AM',
    theme: 'machinery',
    themeLabel: 'Farm Machinery',
    status: 'Completed & Dispensed'
  },
  {
    id: 'QRY-2026-102',
    farmerId: 'f1',
    farmerName: 'Ramu Farmer',
    farmerPhone: '9876543210',
    village: 'Chandampet',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Fish showing white-red ulcer spots on skin and gasping near surface in pond #2 (EUS disease)',
    facilitatorId: 'fac-1',
    facilitatorName: 'Suresh Babu (CLIC Chandampet)',
    facilitatorEmail: 'suresh@clic.in',
    timestamp: '2026-09-29 11:30 AM',
    theme: 'fish',
    themeLabel: 'Fish Diseases',
    status: 'Completed & Dispensed'
  },
  {
    id: 'QRY-2026-103',
    farmerId: 'f1',
    farmerName: 'Ramu Farmer',
    farmerPhone: '9876543210',
    village: 'Chandampet',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Cotton crop showing leaf curling, yellowing and whitefly infestation in 2 acres plot',
    facilitatorId: 'fac-1',
    facilitatorName: 'Suresh Babu (CLIC Chandampet)',
    facilitatorEmail: 'suresh@clic.in',
    timestamp: '2026-09-20 03:15 PM',
    theme: 'crop_pests',
    themeLabel: 'Crop Pests',
    status: 'Resolved & Sprayed'
  },
  {
    id: 'QRY-2026-104',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Inquiring about 50 HP John Deere tractor purchase with SMAM subsidy & drone spraying booking',
    facilitatorId: 'fac-2',
    facilitatorName: 'Anjaiah M (Field Facilitator)',
    facilitatorEmail: 'anjaiah@clic.in',
    timestamp: '2026-09-28 10:15 AM',
    theme: 'machinery',
    themeLabel: 'Farm Machinery',
    status: 'Converted to Order'
  },
  {
    id: 'QRY-2026-105',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Cow has acute udder swelling on right quarter with watery clotted milk and fever (Mastitis)',
    facilitatorId: 'fac-2',
    facilitatorName: 'Suresh Babu (CLIC Chandampet)',
    facilitatorEmail: 'suresh@clic.in',
    timestamp: '2026-09-30 09:45 AM',
    theme: 'livestock',
    themeLabel: 'Livestock Care',
    status: 'Prescription Dispatched'
  },
  {
    id: 'QRY-2026-106',
    farmerId: 'f3',
    farmerName: 'Kavitha Devi (SHG Lead)',
    farmerPhone: '9440567890',
    village: 'Marriguda',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Needs power sprayer and drum seeder rental for women collective farming group (SHG subsidy)',
    facilitatorId: 'fac-1',
    facilitatorName: 'Kishan Goud (CLIC Lead)',
    facilitatorEmail: 'facilitator@clic.in',
    timestamp: '2026-09-25 02:00 PM',
    theme: 'machinery',
    themeLabel: 'Farm Machinery',
    status: 'Booked & Delivered'
  },
  {
    id: 'QRY-2026-107',
    farmerId: 'f3',
    farmerName: 'Kavitha Devi (SHG Lead)',
    farmerPhone: '9440567890',
    village: 'Marriguda',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Chilli crop showing leaf curl virus and thrips damage symptoms with upward cupping',
    facilitatorId: 'fac-1',
    facilitatorName: 'Suresh Babu (CLIC Chandampet)',
    facilitatorEmail: 'suresh@clic.in',
    timestamp: '2026-09-27 10:30 AM',
    theme: 'crop_pests',
    themeLabel: 'Crop Pests',
    status: 'Prescribed Bio-Formulation'
  },
  {
    id: 'QRY-2026-108',
    farmerId: 'f4',
    farmerName: 'Raghu Naik',
    farmerPhone: '9989012345',
    village: 'Chityala',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Needs laser land leveler booking before nursery sowing for 6.5 acres',
    facilitatorId: 'fac-2',
    facilitatorName: 'Anjaiah M (Field Facilitator)',
    facilitatorEmail: 'anjaiah@clic.in',
    timestamp: '2026-09-26 11:00 AM',
    theme: 'machinery',
    themeLabel: 'Farm Machinery',
    status: 'Scheduled & Completed'
  },
  {
    id: 'QRY-2026-109',
    farmerId: 'f4',
    farmerName: 'Raghu Naik',
    farmerPhone: '9989012345',
    village: 'Chityala',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Paddy crop showing brown eye-shaped lesions and neck blast discoloration on panicles',
    facilitatorId: 'fac-2',
    facilitatorName: 'Suresh Babu (CLIC Chandampet)',
    facilitatorEmail: 'suresh@clic.in',
    timestamp: '2026-09-29 04:20 PM',
    theme: 'crop_diseases',
    themeLabel: 'Crop Diseases',
    status: 'Fungicide Kit Dispensed'
  }
];

