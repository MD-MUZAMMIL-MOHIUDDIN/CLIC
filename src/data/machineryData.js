// ============================================================
// Farm Machinery Data & Workflow Model for CLIC
// ============================================================

export const MACHINERY_OPERATIONS = [
  {
    id: 'land-prep',
    name: 'Land Preparation',
    telugu: 'భూమి తయారీ',
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
    id: 'm1',
    name: 'John Deere 5050E 4WD Tractor (50 HP)',
    telugu: 'జాన్ డీర్ 5050E ట్రాక్టర్ (50 HP)',
    operationId: 'land-prep',
    operationName: 'Land Preparation',
    category: 'Tractor & Heavy Implements',
    powerHP: '50 HP',
    fuelType: 'Diesel (4.2 L/hr)',
    capacity: '2.5 - 3.0 acres/day',
    brand: 'John Deere India',
    thumbnail: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1000&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'John Deere 5050E Field Demonstration & Heavy Ploughing in Black Soil',
    description: 'High-torque 3-cylinder turbocharged engine tractor equipped with Power Steering, Dual Clutch, and Oil Immersed Brakes. Ideal for heavy deep ploughing, puddling, trailer hauling, and laser land leveling.',
    specs: {
      'Engine Power': '50 HP @ 2100 RPM',
      'Cylinders': '3 Cylinders Turbocharged',
      'Transmission': '8 Forward + 4 Reverse Collarshift',
      'Lifting Capacity': '1800 kg at lower links',
      'Fuel Tank': '68 Litres',
      'Compatible Crops': 'Paddy, Cotton, Maize, Sugarcane, Chilly',
      'Recommended Implements': '3-Bottom MB Plough, 7-Tine Cultivator, 6ft Rotavator'
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
      msrp: 865000,
      subsidyScheme: 'SMAM (Sub-Mission on Agricultural Mechanization)',
      subsidyPercent: 40,
      subsidyAmount: 346000,
      effectivePrice: 519000,
      dealers: [
        { name: 'Sri Lakshmi Agro Automotives', city: 'Nalgonda', stock: 2, contact: '9848011223' },
        { name: 'Kisan Machinery Plaza', city: 'Miryalaguda', stock: 1, contact: '9848033445' }
      ]
    }
  },
  {
    id: 'm2',
    name: 'Precision Laser Land Leveler (7ft Blade)',
    telugu: 'లేజర్ ల్యాండ్ లెవెలర్',
    operationId: 'land-prep',
    operationName: 'Land Preparation',
    category: 'Land Grading & Leveling',
    powerHP: 'Requires 45+ HP Tractor',
    fuelType: 'Tractor PTO Driven',
    capacity: '1.5 - 2.0 acres/hr',
    brand: 'Trimble Agro Tech',
    thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Precision Laser Land Leveling: Saving 30% Irrigation Water & Yield Optimization',
    description: 'Advanced dual-transmitter laser-guided leveling scraper. Levels the field to millimeter precision, eliminating uneven irrigation puddles, reducing water consumption by 25-30%, and increasing fertilizer efficiency.',
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
    id: 'm3',
    name: 'Kubota NSP-4W 4-Row Walk-Behind Paddy Transplanter',
    telugu: 'కుబోటా వరి నాటు యంత్రం (4 వరుసలు)',
    operationId: 'sowing',
    operationName: 'Sowing & Planting',
    category: 'Mechanized Planting',
    powerHP: '4.3 HP Petrol Engine',
    fuelType: 'Petrol (0.8 L/hr)',
    capacity: '2.5 - 3.5 acres/day',
    brand: 'Kubota Agricultural Machinery',
    thumbnail: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Kubota Paddy Transplanter Operation & Mat Nursery Preparation',
    description: 'Lightweight compact 4-row mechanized paddy transplanting machine. Replaces 12-15 manual laborers per acre, ensures uniform plant-to-plant spacing (30cm x 15cm), and promotes maximum tillering for higher paddy yields.',
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
    id: 'm4',
    name: 'Automatic Multi-Crop Seed-cum-Fertilizer Drill (9 Tines)',
    telugu: 'విత్తన & ఎరువుల డ్రిల్ యంత్రం',
    operationId: 'sowing',
    operationName: 'Sowing & Planting',
    category: 'Seeding Implements',
    powerHP: 'Requires 35+ HP Tractor',
    fuelType: 'Tractor Ground Wheel Driven',
    capacity: '6.0 - 8.0 acres/day',
    brand: 'National Agro Industries',
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Zero-Till Multi Crop Seed & Fertilizer Drill in Action',
    description: 'Simultaneously drops seeds and fertilizer at calibrated depths in uniform rows. Prevents seed loss from birds, ensures excellent germination moisture contact, and reduces seed requirement by 20%.',
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
    id: 'm5',
    name: '10-Litre Agri Drone Sprayer (DGCA Type Certified)',
    telugu: 'వ్యవసాయ డ్రోన్ స్ప్రేయర్ (10 లీటర్లు)',
    operationId: 'spraying',
    operationName: 'Plant Protection & Spraying',
    category: 'Smart Agriculture & Drone Tech',
    powerHP: 'Smart LiPo Battery (16000 mAh)',
    fuelType: 'Electric / Fast Charging',
    capacity: '20 - 25 acres/day (6 min/acre)',
    brand: 'Garuda Kisan Drones',
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Kisan Drone Spraying in Cotton & Paddy Fields - Complete Flight & Safety Protocols',
    description: 'GPS and radar-guided autonomous aerial pesticide/bio-fertilizer spraying drone. Reaches tall crops like cotton and red gram without human exposure to chemicals, providing ultra-fine droplet penetration and 90% water saving.',
    specs: {
      'Tank Capacity': '10 Litres',
      'Spray Swath': '3.5 - 4.5 meters',
      'Flight Time': '15-18 mins per battery set',
      'Obstacle Avoidance': '360° Millimeter-Wave Radar',
      'Water Requirement': 'Only 8-10 Litres/acre (vs 150L manual)',
      'Compatible Crops': 'Cotton, Paddy, Chilly, Maize, Mango Orchards'
    },
    chcAvailability: {
      total: 2,
      available: 1,
      rateHourly: 900,
      rateDaily: 6000,
      ratePerAcre: 450,
      deposit: 2000,
      chcHub: 'Chandampet Central CHC Hub',
      operatorAvailable: true,
      operatorRateExtra: 0 // Certified drone pilot mandatory & included
    },
    purchaseInfo: {
      msrp: 450000,
      subsidyScheme: 'Kisan Drone Promotion Scheme (FPO / CHC 75% Subsidy)',
      subsidyPercent: 50,
      subsidyAmount: 225000,
      effectivePrice: 225000,
      dealers: [
        { name: 'Garuda Aerospace Hub', city: 'Hyderabad Regional Center', stock: 2, contact: '9848088990' }
      ]
    }
  },
  {
    id: 'm6',
    name: 'Aspee Knapsack High-Pressure Power Sprayer (25L)',
    telugu: 'పవర్ స్ప్రేయర్ (25 లీటర్లు)',
    operationId: 'spraying',
    operationName: 'Plant Protection & Spraying',
    category: 'Portable Sprayers',
    powerHP: '1.2 HP 2-Stroke Engine',
    fuelType: 'Petrol + 2T Oil (0.5 L/hr)',
    capacity: '4 - 5 acres/day',
    brand: 'Aspee Agri Tools',
    thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1000&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Aspee Power Sprayer Maintenance, Nozzle Selection and Pressure Calibration',
    description: 'Rugged brass pump power sprayer with twin lances and extendable telescopic lance. Provides mist spray up to 25 feet height for effective pest coverage on leaves underside.',
    specs: {
      'Tank Capacity': '25 Litres Chemical Resistant HDPE',
      'Discharge Rate': '7.5 L/min at 30 kg/cm²',
      'Pressure': '20 - 35 bar',
      'Weight': '9.5 kg (dry)',
      'Compatible Crops': 'Cotton, Vegetables, Pulses, Horticulture'
    },
    chcAvailability: {
      total: 6,
      available: 4,
      rateHourly: 120,
      rateDaily: 800,
      ratePerAcre: 200,
      deposit: 400,
      chcHub: 'Marriguda CHC Station',
      operatorAvailable: false,
      operatorRateExtra: 0
    },
    purchaseInfo: {
      msrp: 14500,
      subsidyScheme: 'Horticulture Mechanization Subsidy',
      subsidyPercent: 50,
      subsidyAmount: 7250,
      effectivePrice: 7250,
      dealers: [
        { name: 'Deccan Agri Machinery Hub', city: 'Nalgonda', stock: 12, contact: '9848044332' },
        { name: 'Kisan Machinery Plaza', city: 'Miryalaguda', stock: 8, contact: '9848033445' }
      ]
    }
  },
  {
    id: 'm7',
    name: 'CLAAS Crop Tiger 30 Multi-Crop Combine Harvester (Wheel)',
    telugu: 'క్లాస్ కంబైన్ హార్వెస్టర్',
    operationId: 'harvesting',
    operationName: 'Harvesting',
    category: 'Heavy Harvesting Machinery',
    powerHP: '76 HP Ashok Leyland Turbo Diesel',
    fuelType: 'Diesel (7.5 L/hr)',
    capacity: '1.2 - 1.5 acres/hr',
    brand: 'CLAAS India',
    thumbnail: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'CLAAS Multi-Crop Combine Harvester Field Demo: Clean Threshing & Minimum Grain Loss',
    description: 'Renowned German-engineered compact combine harvester for paddy, maize, soybean, and pulses. Features tangential threshing with high cleaning efficiency (<0.5% grain loss) and large grain tank for continuous harvesting.',
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
      operatorRateExtra: 0 // Driver & helper included in combine rate
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
    id: 'm8',
    name: 'Paddy Reaper-cum-Binder (Self-Propelled 3-Wheel)',
    telugu: 'వరి కోత & కట్టల బైండర్',
    operationId: 'harvesting',
    operationName: 'Harvesting',
    category: 'Small Harvester',
    powerHP: '10.5 HP Air-Cooled Diesel Engine',
    fuelType: 'Diesel (1.1 L/hr)',
    capacity: '1.0 acre per 2.5 hours',
    brand: 'BCS India / Bomet',
    thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Self-Propelled Reaper Binder: Clean Cutting at 5cm Ground Level & Auto Bundling',
    description: 'Cuts cereal crops close to the ground (leaving long straw for animal fodder) and automatically ties them into tight bundles using jute twine. Eliminates backbreaking manual harvesting for small & marginal farmers.',
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
      subsidyScheme: 'State Horticulture & Agriculture Mechanization',
      subsidyPercent: 50,
      subsidyAmount: 170000,
      effectivePrice: 170000,
      dealers: [
        { name: 'Sri Lakshmi Agro Automotives', city: 'Nalgonda', stock: 2, contact: '9848011223' }
      ]
    }
  },
  {
    id: 'm9',
    name: 'Multi-Crop High Output Thresher & Cleaner (Tractor PTO)',
    telugu: 'మల్టీ క్రాప్ త్రెషర్ & క్లీనర్',
    operationId: 'threshing',
    operationName: 'Threshing & Post-Harvest',
    category: 'Post-Harvest Threshing',
    powerHP: 'Requires 35+ HP Tractor PTO',
    fuelType: 'Tractor PTO Driven',
    capacity: '1.5 - 2.5 tonnes/hr',
    brand: 'Kisan Craft Agro',
    thumbnail: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Multi-Crop Thresher Operation: Maize, Pulses, Soya & Millets Setup Guide',
    description: 'Heavy duty multi-crop thresher with dual winnowing blowers and vibrating grading sieves. Delivers 99% clean grain directly into bags while converting crop residues into fine chaff for livestock feed.',
    specs: {
      'Drum Type': 'Peg tooth / Beater type with interchangeable concave',
      'Blowers': 'Double centrifugal winnowing fans',
      'Cleaning Efficiency': '99.2% clean grain output',
      'Grain Damage': 'Under 1% breakage',
      'Compatible Crops': 'Maize, Red Gram, Bengal Gram, Soya, Jowar, Bajra'
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
    id: 'm10',
    name: '5 HP Solar Photovoltaic DC Submersible Water Pump Set',
    telugu: '5 HP సోలార్ నీటి పంపు సెట్',
    operationId: 'irrigation',
    operationName: 'Irrigation & Pumping',
    category: 'Solar Agri Energy',
    powerHP: '5 HP DC Submersible (4800W Array)',
    fuelType: 'Zero Fuel (100% Solar Powered)',
    capacity: '1,20,000 to 1,50,000 Litres/day',
    brand: 'Shakti Solar Pumps India',
    thumbnail: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'PM-KUSUM Solar Water Pump Installation, MPPT Controller & Drip Integration',
    description: 'High-efficiency stainless steel solar water pumping system complete with auto-tracking structure, MPPT controller, and remote GSM monitoring. Operates uninterrupted from sunrise to sunset without grid power dependence.',
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
    machineName: 'John Deere 5050E 4WD Tractor (50 HP)',
    dealer: 'Sri Lakshmi Agro Automotives (Nalgonda)',
    dealerPhone: '9848011223',
    msrp: 865000,
    subsidyAmount: 346000,
    netPayable: 519000,
    paymentMode: 'Kisan Credit Card (KCC) + 40% Subsidy',
    status: 'Alert Dispatched to FM Shop', // Alert to FM shop -> Alert to farmer -> Alert back from FM shop -> Closed
    stage: 'fm_shop_alerted',
    timeline: [
      { time: '10:15 AM', text: 'Farmer walk-in at CLIC Munchireddypally center' },
      { time: '10:22 AM', text: 'Farmer selected John Deere 5050E for Purchase' },
      { time: '10:25 AM', text: 'Order closed in CLIC · Order Ref: FM-PUR-1001' },
      { time: '10:26 AM', text: 'Alert sent to FM Shop: Sri Lakshmi Agro Automotives' },
      { time: '10:26 AM', text: 'SMS Quotation alert sent to Farmer (9848123456)' }
    ],
    backAlert: {
      received: true,
      from: 'FM Shop (Sri Lakshmi Agro)',
      message: 'Dealer accepted purchase quotation. Stock unit allocated. Pre-delivery inspection scheduled for Sep 30.',
      statusUpdate: 'Dealer Confirmed · Ready for Subsidy Sanction'
    }
  },
  {
    id: 'CHC-RNT-2001',
    type: 'rental',
    date: '2026-09-28',
    farmerId: 'f1',
    farmerName: 'Ramu Farmer',
    farmerPhone: '9876543210',
    village: 'Chandampet',
    machineId: 'm3',
    machineName: 'Kubota NSP-4W 4-Row Walk-Behind Paddy Transplanter',
    chcHub: 'Chandampet Central CHC Hub',
    chcContact: '9876500112',
    rentalUnits: '2 Days',
    startDate: '2026-09-30',
    rate: '₹4,200/day',
    deposit: '₹1,200',
    totalEstimated: 9600,
    withOperator: true,
    operatorName: 'Srinivas (Certified Kubota Operator)',
    status: 'Alert to CHC Sent · Back Alert Received',
    stage: 'back_alert_received',
    timeline: [
      { time: '09:30 AM', text: 'Farmer Ramu query logged at CLIC Hub' },
      { time: '09:40 AM', text: 'Operation chosen: Sowing & Planting' },
      { time: '09:45 AM', text: 'Selected Kubota Transplanter · Rental requested' },
      { time: '09:50 AM', text: 'Rental booking closed · Ref: CHC-RNT-2001' },
      { time: '09:51 AM', text: 'Alert dispatched to CHC Hub Operator' },
      { time: '09:51 AM', text: 'Confirmation Alert SMS sent to Farmer Ramu' },
      { time: '10:05 AM', text: 'Alert Back from CHC: Srinivas operator assigned · Machine ready for dispatch on Sep 30 7:00 AM' }
    ],
    backAlert: {
      received: true,
      from: 'CHC Operator (Srinivas)',
      message: 'Machine fueled, serviced and assigned with trained driver. Will arrive at Ramu field on Sep 30 at 07:00 AM.',
      statusUpdate: 'CHC Dispatched Schedule Confirmed'
    }
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
    theme: 'Farm Machinery',
    status: 'In Progress'
  },
  {
    id: 'QRY-2026-102',
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
    theme: 'Farm Machinery',
    status: 'Converted to Order'
  },
  {
    id: 'QRY-2026-103',
    farmerId: 'f3',
    farmerName: 'Kavitha Devi (SHG Lead)',
    farmerPhone: '9440567890',
    village: 'Marriguda',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Needs power sprayer and drum seeder rental for women collective farming',
    facilitatorId: 'fac-1',
    facilitatorName: 'Kishan Goud (CLIC Lead)',
    facilitatorEmail: 'facilitator@clic.in',
    timestamp: '2026-09-27 02:45 PM',
    theme: 'Farm Machinery',
    status: 'Logged'
  },
  {
    id: 'QRY-2026-104',
    farmerId: 'f4',
    farmerName: 'Raghu Naik',
    farmerPhone: '9989012345',
    village: 'Chityala',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Needs laser land leveler booking before nursery sowing',
    facilitatorId: 'fac-3',
    facilitatorName: 'Sunitha R (CLIC Coordinator)',
    facilitatorEmail: 'sunitha@clic.in',
    timestamp: '2026-09-27 11:20 AM',
    theme: 'Farm Machinery',
    status: 'Logged'
  },
  {
    id: 'QRY-2026-105',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Requested urgent summer deep ploughing with MB Plough attachment (3 acres)',
    facilitatorId: 'fac-1',
    facilitatorName: 'Kishan Goud (CLIC Lead)',
    facilitatorEmail: 'facilitator@clic.in',
    timestamp: '2026-09-20 03:30 PM',
    theme: 'Farm Machinery',
    status: 'Service Completed'
  },
  {
    id: 'QRY-2026-106',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Inquired about Agri Drone 10L spraying rental rate for Pink Bollworm control in Cotton',
    facilitatorId: 'fac-2',
    facilitatorName: 'Anjaiah M (Field Facilitator)',
    facilitatorEmail: 'anjaiah@clic.in',
    timestamp: '2026-09-14 11:45 AM',
    theme: 'Crop Advisory & Machinery',
    status: 'Advisory Given'
  },
  {
    id: 'QRY-2026-107',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    state: 'Telangana',
    query: 'Checked availability for 7-tine cultivator hire from Marriguda PACS CHC center',
    facilitatorId: 'fac-1',
    facilitatorName: 'Kishan Goud (CLIC Lead)',
    facilitatorEmail: 'facilitator@clic.in',
    timestamp: '2026-09-02 09:10 AM',
    theme: 'Farm Machinery',
    status: 'Fulfilled'
  }
];

