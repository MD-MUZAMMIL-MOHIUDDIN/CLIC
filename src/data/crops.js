// ============================================================
// Mock Data – Crops, Livestock, Fisheries & Learning Materials
// ============================================================

export const defaultCategories = ['Cereals', 'Pulses', 'Oilseeds', 'Cash Crops'];

export const crops = [
  {
    id: 'paddy',
    name: 'Paddy (Rice)',
    telugu: 'వరి',
    category: 'Cereals',
    icon: '🌾',
    season: 'Kharif (June–November)',
    sowingWindow: 'June 15 – July 15',
    variety: 'BPT 5204, Swarna Sub1, MTU 1001',
    soilType: 'Clay loam, heavy soils with water retention',
    pop: [
      { stage: 'Land Preparation', days: '15–20 days before sowing', advice: 'Deep plough 2–3 times. Apply 5 tons FYM/acre. Maintain puddle consistency.', inputs: 'FYM 5t/acre' },
      { stage: 'Seed Treatment',   days: '1 day before sowing',      advice: 'Treat seeds with Pseudomonas fluorescens 10g/kg + Trichoderma 4g/kg seed. Soak 24hrs then germinate.', inputs: 'Pseudomonas, Trichoderma' },
      { stage: 'Nursery',          days: 'Day 0–25',                 advice: 'Raise nursery in 1/10th of main field. Sow 20kg/acre. Drench with Azospirillum at 7 DAT.', inputs: 'Azospirillum 2kg/acre nursery' },
      { stage: 'Transplanting',    days: 'Day 25–30',                advice: 'Transplant 2–3 seedlings/hill at 20×15 cm spacing. SRI method: single seedling at 25×25 cm.', inputs: 'Rhizobium at transplanting' },
      { stage: 'Basal Fertilizer', days: 'At transplanting',         advice: 'Apply NPK 40:20:20 kg/acre. Use Neem Coated Urea for N application.', inputs: 'NPK 40:20:20 kg/acre' },
      { stage: 'Top Dressing 1',   days: '25–30 DAT',               advice: 'Apply 20 kg N/acre (Urea 43 kg) at active tillering. Use weed-free conditions.', inputs: 'Urea 43 kg/acre' },
      { stage: 'Top Dressing 2',   days: '50–55 DAT',               advice: 'Apply 20 kg N/acre at panicle initiation. Ensures grain filling.', inputs: 'Urea 43 kg/acre' },
      { stage: 'Irrigation',       days: 'Throughout season',        advice: 'Maintain 5 cm water in vegetative stage. AWD (Alternate Wetting Drying) saves 20–30% water.', inputs: 'Water management' },
      { stage: 'Harvest',          days: '120–130 DAT',             advice: 'Harvest when 80% grains turn golden. Moisture 20–22%. Avoid early harvest.', inputs: 'Combine harvester / manual' },
    ],
  },
  {
    id: 'cotton',
    name: 'Cotton (Bt)',
    telugu: 'పత్తి',
    category: 'Cash Crops',
    icon: '🌿',
    season: 'Kharif (June–December)',
    sowingWindow: 'June 1 – July 10',
    variety: 'Bunny BT II, Amizone, Brahma',
    soilType: 'Black cotton soils, well-drained red soils',
    pop: [
      { stage: 'Land Preparation', days: 'Pre-sowing',    advice: 'Deep summer ploughing. Apply 4–5 t FYM/acre. Form ridges and furrows.', inputs: 'FYM 4–5t/acre' },
      { stage: 'Seed Treatment',   days: 'Before sowing', advice: 'Treat with Imidacloprid 70 WS @ 7ml/kg for sucking pest protection. Then Trichoderma 4g/kg.', inputs: 'Imidacloprid, Trichoderma' },
      { stage: 'Sowing',           days: 'Day 0',         advice: 'Sow at 90×60 cm spacing. Dibble method. 2 seeds/hill. Ensure soil moisture.', inputs: '1 packet (450g)/acre' },
      { stage: 'Basal Fertilizer', days: 'At sowing',     advice: 'Apply NPK 20:20:0 kg/acre. Mix in soil before covering.', inputs: 'DAP 44kg + Urea 22kg/acre' },
      { stage: 'Top Dressing',     days: '30 & 60 DAS',   advice: 'Apply 20 kg N/acre at each dose. Foliar spray of 0.5% Boron at flowering.', inputs: 'Urea 43kg × 2 + Borax' },
      { stage: 'Irrigation',       days: 'Critical stages',advice: 'Irrigate at germination, squaring, flowering, boll development. Avoid waterlogging.', inputs: '6–8 irrigations' },
      { stage: 'Harvest',          days: '150–180 DAS',   advice: 'Pick 3–5 rounds at 15-day intervals. Separate grade A and B bolls.', inputs: 'Manual picking' },
    ],
  },
  {
    id: 'redgram',
    name: 'Red Gram (Tur Dal)',
    telugu: 'కందులు',
    category: 'Pulses',
    icon: '🫘',
    season: 'Kharif (June–January)',
    sowingWindow: 'June 15 – July 15',
    variety: 'LRG-41, ICPH 2671, Maruti',
    soilType: 'Well-drained red sandy loam soils',
    pop: [
      { stage: 'Land Preparation', days: 'Pre-sowing',   advice: 'Deep plough once. Light harrowing. No need for puddle. Prepare fine seedbed.', inputs: 'FYM 3t/acre' },
      { stage: 'Seed Treatment',   days: 'Before sowing',advice: 'Treat with Rhizobium 4 packets/8kg seed + Trichoderma. Improves N-fixation.', inputs: 'Rhizobium, PSB, Trichoderma' },
      { stage: 'Sowing',           days: 'Day 0',        advice: 'Sow at 90×30 cm spacing. 6–8 kg/acre. 4–5 cm depth. Intercrop with sunflower or maize.', inputs: '6–8 kg seed/acre' },
      { stage: 'Fertilizer',       days: 'At sowing',    advice: 'Apply only 8 kg N + 20 kg P/acre as basal. No top dressing needed due to N-fixation.', inputs: 'SSP 125 kg + Urea 17 kg' },
      { stage: 'Weed Management',  days: '20–40 DAS',    advice: 'One hand weeding at 20 DAS. Pendimethalin spray as pre-emergence herbicide.', inputs: 'Pendimethalin 1 litre/acre' },
      { stage: 'Harvest',          days: '155–170 DAS',  advice: 'Harvest when 70–80% pods turn brown. Thresh immediately to avoid shattering.', inputs: 'Combine / manual threshing' },
    ],
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    telugu: 'వేరుశనగ',
    category: 'Oilseeds',
    icon: ' Peanut ',
    season: 'Kharif (June–October)',
    sowingWindow: 'June 15 – July 10',
    variety: 'K-6, ICGV 91114, TMV-2',
    soilType: 'Light red loamy soils, well-drained sandy loam',
    pop: [
      { stage: 'Land Preparation', days: 'Pre-sowing',   advice: 'Deep plough. Add gypsum 200 kg/acre to improve pod filling. Form ridges 30 cm apart.', inputs: 'FYM 4t + Gypsum 200 kg' },
      { stage: 'Seed Treatment',   days: 'Before sowing',advice: 'Shell 24hrs before sowing. Treat with Thiram 3g/kg + Rhizobium + PSB.', inputs: 'Thiram, Rhizobium, PSB' },
      { stage: 'Sowing',           days: 'Day 0',        advice: 'Sow 2 seeds/hole. 30×10 cm spacing. Kernels not seeds for bold varieties.', inputs: '80 kg seed/acre' },
      { stage: 'Fertilizer',       days: 'At sowing + 30 DAS', advice: 'Apply 8:16:16 NPK kg/acre. Spray 19:19:19 water soluble fertilizer at peg formation.', inputs: 'DAP 35kg, MOP 27kg, Urea 17kg' },
      { stage: 'Gypsum Application', days: '40–45 DAS',   advice: 'Apply 200 kg gypsum/acre around peg zone for calcium. Critical for pod filling.', inputs: 'Gypsum 200 kg/acre' },
      { stage: 'Harvest',          days: '100–110 DAS',   advice: 'Harvest when leaves turn yellow and inner pod wall shows dark marks. Dry to 10% moisture.', inputs: 'Digger + manual' },
    ],
  },
];

// Pest & Disease gallery
export const pests = [
  { id: 1, name: 'Fall Armyworm (FAW)', crop: 'Maize', severity: 'High', type: 'pest', scientificName: 'Spodoptera frugiperda', symptom: 'Ragged leaf damage, saw dust frass in whorl', control: 'Emamectin Benzoate, Neem oil 3%, Spinetoram, release of Telenomus remus', image: '🐛', season: 'Kharif', outbreak: true },
  { id: 2, name: 'Yellow Stem Borer', crop: 'Paddy', severity: 'High', type: 'pest', scientificName: 'Scirpophaga incertulas', symptom: 'Dead hearts in vegetative stage, white ears at panicle stage', control: 'Cartap hydrochloride, Fipronil, Trichogramma japonicum @ 1.5 lakh/week', image: '🦟', season: 'Kharif', outbreak: false },
  { id: 3, name: 'BPH (Brown Planthopper)', crop: 'Paddy', severity: 'Medium', type: 'pest', scientificName: 'Nilaparvata lugens', symptom: 'Hopper burn – circular yellowing patches from bottom', control: 'Avoid excess N. Buprofezin, Pymetrozine. Drain water intermittently.', image: '🪲', season: 'Kharif', outbreak: false },
  { id: 4, name: 'Bollworm', crop: 'Cotton', severity: 'High', type: 'pest', scientificName: 'Helicoverpa armigera', symptom: 'Bored entry holes in bolls, frass near damage', control: 'Spinosad, Indoxacarb, HaNPV spray, Pheromone traps @ 5/acre', image: '🐛', season: 'Kharif', outbreak: true },
  { id: 5, name: 'Sucking Pests', crop: 'Cotton', severity: 'Medium', type: 'pest', scientificName: 'Bemisia tabaci (Whitefly)', symptom: 'Yellowing, leaf curl, sooty mould – honeydew excretion', control: 'Neem oil 3% + garlic extract. Imidacloprid if >5/leaf. Yellow sticky traps.', image: '🦗', season: 'Kharif', outbreak: false },
  { id: 6, name: 'Blast Disease', crop: 'Paddy', severity: 'High', type: 'disease', scientificName: 'Magnaporthe oryzae', symptom: 'Diamond-shaped grey lesions with brown borders on leaves', control: 'Tricyclazole 0.06%, Isoprothiolane. Apply at boot leaf and panicle emergence.', image: '🍃', season: 'Kharif', outbreak: false },
  { id: 7, name: 'Collar Rot', crop: 'Groundnut', severity: 'Medium', type: 'disease', scientificName: 'Sclerotium rolfsii', symptom: 'White mycelial growth at soil surface. Plant wilts and dries.', control: 'Trichoderma 4kg/acre soil treatment. Carbendazim seed treatment.', image: '🌱', season: 'Kharif', outbreak: false },
  { id: 8, name: 'Early Leaf Spot', crop: 'Groundnut', severity: 'Low', type: 'disease', scientificName: 'Cercospora arachidicola', symptom: 'Brown circular spots with yellow halo on upper leaf surface', control: 'Mancozeb 2g/litre spray. Apply at 30, 45, 60 DAS intervals.', image: '🍂', season: 'Kharif', outbreak: false },
];

// Learning Hub Data (Knowledge Bank)
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

export const millets = [
  { name: 'Foxtail Millet (Korralu)', telugu: 'కొర్రలు', protein: '11.2g/100g', iron: '2.8mg/100g', fiber: '8g/100g', calories: 331, benefit: 'High in iron. Good for anaemia. Diabetic-friendly.', season: '60–75 days' },
  { name: 'Little Millet (Samalu)', telugu: 'సామలు', protein: '7.7g/100g', iron: '9.3mg/100g', fiber: '7.6g/100g', calories: 341, benefit: 'Highest iron of all millets. Excellent for children and pregnant women.', season: '65–75 days' },
  { name: 'Sorghum (Jowar)', telugu: 'జొన్నలు', protein: '10.4g/100g', iron: '4.1mg/100g', fiber: '6.3g/100g', calories: 329, benefit: 'Gluten-free. Anti-oxidant rich. Good for heart health.', season: '100–115 days' },
  { name: 'Desi Rice (Karuppukavuni)', telugu: 'నల్ల బియ్యం', protein: '8.9g/100g', iron: '3.5mg/100g', fiber: '2.8g/100g', calories: 356, benefit: 'Rich in anthocyanins. Anti-inflammatory. Prevents lifestyle diseases.', season: '145–150 days' },
];

// ============================================================
// New Livestock Advisory Mock Data
// ============================================================
export const livestock = [
  {
    id: 'cattle',
    name: 'Cattle (Cow & Buffalo)',
    telugu: 'పశువులు (ఆవులు & గేదెలు)',
    icon: '🐄',
    species: 'Jersey, HF, Sahiwal, Gir, Ongole, Murrah (Buffalo)',
    prevention: [
      { disease: 'Foot and Mouth Disease (FMD)', advice: 'Vaccinate twice a year (before monsoon in May and winter in November). Keep shed clean and dry. Avoid contact with infected herds.' },
      { disease: 'Black Quarter (BQ)', advice: 'Annual vaccination before rainy season. Clean dung and disinfect the feeding area daily.' },
      { disease: 'Brucellosis', advice: 'Vaccinate calves aged 4-8 months once. Screen breeding herds regularly. Quarantine new animals.' }
    ],
    curative: [
      { disease: 'Mastitis (Udder Swelling)', treatment: 'Wash udder with warm potassium permanganate solution. Keep milking area hygienic. Inject antibiotics after consulting a vet.' },
      { disease: 'Bloat (Indigestion)', treatment: 'Administer 50ml turpentine oil mixed with linseed oil. Walk the animal. Avoid excessive feeding of green legumes.' },
      { disease: 'Deworming', treatment: 'Deworm calves monthly till 6 months, then every 3-4 months. Use Albendazole or Fenbendazole.' }
    ],
    pop: [
      { stage: 'Feeding Management', detail: 'Provide 25-30 kg green fodder, 5-6 kg dry fodder, and 1-2 kg concentrate feed daily. Give 40-50 liters of clean drinking water.' },
      { stage: 'Shed Maintenance', detail: 'Ensure proper ventilation, non-slippery dry flooring, and daily cleaning of urine and dung. Spray disinfectants weekly.' },
      { stage: 'Calf Care', detail: 'Feed colostrum within 1-2 hours of birth. Maintain warming bed during winter.' }
    ]
  },
  {
    id: 'goat_sheep',
    name: 'Goat & Sheep',
    telugu: 'మేకలు & గొర్రెలు',
    icon: '🐐',
    species: 'Nellore Brown, Deccani, Osmanabadi',
    prevention: [
      { disease: 'PPR (Peste des Petits Ruminants)', advice: 'Vaccinate once in 3 years. Quarantine new stock for 14 days before introducing them to the flock.' },
      { disease: 'Sheep Pox', advice: 'Annual vaccination in December/January before season onset. Disinfect enclosures.' },
      { disease: 'Enterotoxemia (ET)', advice: 'Vaccinate twice a year (May & November). Avoid sudden feed changes to high grains.' }
    ],
    curative: [
      { disease: 'Coccidiosis (Diarrhea)', treatment: 'Administer Amprolium or sulfa drugs. Clean feeding troughs and keep bedding dry.' },
      { disease: 'Foot Rot', treatment: 'Footbath in 5% copper sulfate solution. Trim hooves regularly. Keep animals on dry ground.' }
    ],
    pop: [
      { stage: 'Deworming Schedule', detail: 'Regular deworming 4 times a year, especially pre-monsoon and post-monsoon.' },
      { stage: 'Grazing', detail: 'Graze for 6-8 hours daily. Provide mineral blocks for licking in the shed.' }
    ]
  },
  {
    id: 'poultry',
    name: 'Poultry (Backyard & Broiler)',
    telugu: 'కోళ్లు',
    icon: '🐓',
    species: 'Rajashri, Vanaraja, Kadaknath, Vencobb',
    prevention: [
      { disease: 'Ranikhet Disease (Newcastle)', advice: 'Vaccinate chicks at Day 5-7 (F1 strain), Day 21 (Lasota), and week 9 (R2B). Crucial for flock survival.' },
      { disease: 'Gumboro Disease (IBD)', advice: 'Vaccination at Day 14 and Day 24. Clean litter regularly and spray disinfectant.' }
    ],
    curative: [
      { disease: 'Coccidiosis (Bloody droppings)', treatment: 'Mix Anticoccidial drugs (e.g., Amprolium) in drinking water. Replace damp litter immediately.' },
      { disease: 'Fowl Pox', treatment: 'Apply antiseptic ointments on lesions. Isolation of infected birds. Vaccinate healthy ones.' }
    ],
    pop: [
      { stage: 'Brooding Management', detail: 'Maintain temperature around 32-35°C for new chicks using bulbs. Use clean wood shavings for bedding.' },
      { stage: 'Feed and Water', detail: 'Provide chick starter mash for first 4 weeks. Keep drinking water fresh and cool.' }
    ]
  }
];

// ============================================================
// New Fisheries Advisory Mock Data
// ============================================================
export const fisheries = {
  varieties: [
    { name: 'Catla (Surface Feeder)', density: '1,000 - 1,200 fingerlings/acre', feed: 'Plankton, rice bran, mustard oil cake', period: '10-12 months', size: '1 - 1.2 kg' },
    { name: 'Rohu (Column Feeder)', density: '1,500 - 1,800 fingerlings/acre', feed: 'Detritus, supplemental pellets', period: '10-12 months', size: '900g - 1 kg' },
    { name: 'Mrigal (Bottom Feeder)', density: '1,200 - 1,500 fingerlings/acre', feed: 'Decaying organic matter, bran mixture', period: '12 months', size: '800g - 1 kg' }
  ],
  pondsize: {
    guide: 'Ideal fish pond size ranges from 0.5 to 2.0 acres. Water depth should be maintained at 1.5 to 2.0 meters (5 to 6.5 feet). Soil must have at least 20-30% clay content to retain water.',
    calculator: {
      waterVolumeFormula: 'Length (m) × Width (m) × Avg Depth (m) = Volume (cubic meters)',
      densityFormula: 'Stocking Density = Water Volume (m³) × 1.2 fingerlings'
    }
  },
  weeding: [
    { type: 'Floating Weeds (Eichhornia, Pistia)', control: 'Manual physical removal. Maintain water flow.' },
    { type: 'Submerged Weeds (Hydrilla, Vallisneria)', control: 'Introduce Grass Carp fish (consumes weed). Dry the pond during preparation.' },
    { type: 'Emergent Weeds (Typha, Nymphaea)', control: 'Manual cutting below water level or chemical spraying on bunds.' }
  ],
  manuring: [
    { type: 'Basal Manuring', application: 'Apply 2,000 - 3,000 kg/acre Organic Raw Cow Dung (RCD) or Compost 15 days before stocking fingerlings.' },
    { type: 'Monthly Schedule', application: 'Apply 250 kg RCD, 10 kg Urea, and 15 kg Single Super Phosphate (SSP) per acre every month to maintain plankton bloom.' },
    { type: 'Lime Treatment', application: 'Apply 100 - 150 kg/acre of Agricultural Lime (CaCO3) annually to stabilize pH (optimum pH: 7.5 - 8.5).' }
  ]
};
