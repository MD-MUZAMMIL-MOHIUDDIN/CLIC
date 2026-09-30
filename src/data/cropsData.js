// ============================================================
// Crops & Agronomy Data Model
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
    variety: 'BPT 5204, Swarna Sub1, MTU 1001, Telangana Sona',
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
    variety: 'Bunny BT II, Amizone, Brahma, RCH 659',
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
    variety: 'LRG-41, ICPH 2671, Maruti, PRG 176',
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
    icon: '🥜',
    season: 'Kharif (June–October)',
    sowingWindow: 'June 15 – July 10',
    variety: 'K-6, ICGV 91114, TMV-2, Kadiri 9',
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
  {
    id: 'maize',
    name: 'Maize (Corn)',
    telugu: 'మొక్కజొన్న',
    category: 'Cereals',
    icon: '🌽',
    season: 'Kharif & Rabi (June–Oct, Nov–March)',
    sowingWindow: 'June 20 – July 15',
    variety: 'DKC 9141, Pioneer 3396, Kaveri 50',
    soilType: 'Deep, well-drained fertile loamy to silt loam soils',
    pop: [
      { stage: 'Land Preparation', days: 'Pre-sowing', advice: 'Plough 2–3 times with disc harrow. Apply 6 tons FYM/acre. Make ridges at 60cm distance.', inputs: 'FYM 6t/acre' },
      { stage: 'Seed Treatment', days: '1 day prior', advice: 'Treat with Cyantraniliprole 19.8% + Thiamethoxam 19.8% FS @ 6ml/kg to protect against Fall Armyworm.', inputs: 'Insecticide seed coating' },
      { stage: 'Sowing', days: 'Day 0', advice: 'Dibble 1 seed per hill at 60×20 cm spacing. Seed rate 7-8 kg/acre.', inputs: '8 kg hybrid seed/acre' },
      { stage: 'Fertilizer Doses', days: 'Basal + 30 + 55 DAS', advice: 'Total 48:24:20 kg NPK/acre. Apply 1/3rd N + full P & K basal, remaining N at knee-high and tasseling.', inputs: 'Urea, DAP, MOP' },
      { stage: 'Harvest', days: '100–115 DAS', advice: 'Harvest when cob sheaths dry and turn brownish-straw color.', inputs: 'Maize sheller / manual' }
    ]
  }
];

// Pest & Disease Diagnostic Gallery
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

export const millets = [
  { name: 'Foxtail Millet (Korralu)', telugu: 'కొర్రలు', protein: '11.2g/100g', iron: '2.8mg/100g', fiber: '8g/100g', calories: 331, benefit: 'High in iron. Good for anaemia. Diabetic-friendly.', season: '60–75 days' },
  { name: 'Little Millet (Samalu)', telugu: 'సామలు', protein: '7.7g/100g', iron: '9.3mg/100g', fiber: '7.6g/100g', calories: 341, benefit: 'Highest iron of all millets. Excellent for children and pregnant women.', season: '65–75 days' },
  { name: 'Sorghum (Jowar)', telugu: 'జొన్నలు', protein: '10.4g/100g', iron: '4.1mg/100g', fiber: '6.3g/100g', calories: 329, benefit: 'Gluten-free. Anti-oxidant rich. Good for heart health.', season: '100–115 days' },
  { name: 'Desi Rice (Karuppukavuni)', telugu: 'నల్ల బియ్యం', protein: '8.9g/100g', iron: '3.5mg/100g', fiber: '2.8g/100g', calories: 356, benefit: 'Rich in anthocyanins. Anti-inflammatory. Prevents lifestyle diseases.', season: '145–150 days' },
];

export default crops;
