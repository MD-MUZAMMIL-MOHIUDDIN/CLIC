// ============================================================
// Fisheries & Aquaculture Management Data Model
// ============================================================

export const FISH_SPECIES = [
  {
    id: 'carps',
    name: 'Indian Major Carps (Catla, Rohu, Mrigal)',
    telugu: 'భారతీయ ప్రధాన కార్ప్ చేపలు (బొచ్చె, రోహు, ఎర్రమోసు)',
    icon: '🐟',
    speciesList: 'Catla catla, Labeo rohita, Cirrhinus mrigala',
    density: '3,000 - 4,000 fingerlings/acre (30:40:30 ratio)',
    feedingZone: 'Surface (Catla), Column (Rohu), Bottom (Mrigal)',
    growthPeriod: '10 - 12 Months',
    harvestWeight: '1.0 - 1.5 kg per fish',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'catfish',
    name: 'Pangasius & Catfish (Venjami / Pandugappa)',
    telugu: 'పంకాసియస్ & క్యాట్‌ఫిష్',
    icon: '🐠',
    speciesList: 'Pangasius hypophthalmus, Clarias batrachus',
    density: '8,000 - 10,000 fingerlings/acre with high aeration',
    feedingZone: 'Column & Bottom feeder (Floating high protein pellets)',
    growthPeriod: '6 - 8 Months',
    harvestWeight: '1.2 - 2.0 kg per fish',
    thumbnail: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tilapia',
    name: 'GIFT Monosex Tilapia',
    telugu: 'గిఫ్ట్ తిలాపియా',
    icon: '🐡',
    speciesList: 'Oreochromis niloticus (Genetically Improved Farmed Tilapia)',
    density: '6,000 - 8,000 fingerlings/acre',
    feedingZone: 'All-zone omnivore feeder (Algae, plankton & pellets)',
    growthPeriod: '5 - 6 Months',
    harvestWeight: '500g - 750g per fish',
    thumbnail: 'https://images.unsplash.com/photo-1534043464124-3be32fe00099?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'murrel',
    name: 'Murrel / Snakehead Fish (Korrameenu)',
    telugu: 'కొర్రమీను (ముర్రెల్)',
    icon: '🦈',
    speciesList: 'Channa striata, Channa punctata',
    density: '2,500 - 3,000 fingerlings/acre with live forage fish or moist paste',
    feedingZone: 'Predatory carnivore (High market value in Telangana)',
    growthPeriod: '8 - 10 Months',
    harvestWeight: '750g - 1.2 kg per fish',
    thumbnail: 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'shrimp_scampi',
    name: 'Freshwater Giant Prawn (Scampi)',
    telugu: 'మంచినీటి రొయ్యలు (స్కాంపి)',
    icon: '🦐',
    speciesList: 'Macrobrachium rosenbergii',
    density: '15,000 - 20,000 post-larvae/acre',
    feedingZone: 'Bottom detritivore with PVC hideouts',
    growthPeriod: '6 - 7 Months',
    harvestWeight: '50g - 80g count per prawn',
    thumbnail: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80'
  }
];

export const FISH_DISEASES = [
  {
    id: 'fd-1',
    speciesId: 'carps',
    name: 'Epizootic Ulcerative Syndrome (EUS / Red Spot Disease)',
    telugu: 'ఎరుపు మచ్చల వ్యాధి (EUS)',
    icon: '🔴',
    severity: 'High (Causes Mass Mortality)',
    pathogen: 'Fungal (Aphanomyces invadans) + Secondary Aeromonas Bacteria',
    symptoms: [
      'Reddish hemorrhagic spots and ulcer lesions across body scales',
      'Deep necrotizing skin ulcers exposing muscle tissue and bone',
      'Sluggish swimming near pond surface and gasping for air',
      'Complete loss of appetite and sudden mass mortality in winter'
    ],
    diagnosisText: 'EUS occurs mainly during winter (November - February) when water temperature drops below 22°C and pond pH becomes acidic. Early stage shows red pin-point spots which rapidly enlarge into deep bleeding ulcers.',
    controlMeasures: [
      'Apply CIFAX formulation @ 1 Litre per hectare-meter water depth (250 ml/acre-meter)',
      'Apply Agricultural Quick Lime (CaO) @ 150 - 200 kg/acre to raise pH to 7.8 - 8.2',
      'Potassium Permanganate (KMnO4) prophylactic dip @ 2-3 ppm for affected stock',
      'Stop organic manuring and net dragging immediately during infection period'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Fish EUS Disease Diagnosis, CIFAX Application & Water Treatment',
    linkedProducts: [
      {
        id: 'fp-1',
        name: 'CIFAX Aquaculture Ulcer Cure Formulation (CIFA Certified)',
        telugu: 'సిఫాక్స్ ఎరుపు మచ్చల నివారణ ద్రావణం',
        category: 'Aquaculture Health',
        price: 450,
        unit: '1 Litre bottle',
        stock: 35,
        dosage: '250 ml per acre-meter pond water',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopId: 'ls-shop-1',
        shopPhone: '9876511223'
      },
      {
        id: 'fp-2',
        name: 'Potassium Permanganate 99% Pure Crystals (KMnO4)',
        telugu: 'పొటాషియం పర్మాంగనేట్ క్రిస్టల్స్',
        category: 'Water Disinfectant',
        price: 180,
        unit: '1kg pack',
        stock: 50,
        dosage: '1 - 2 kg per acre dissolved in water',
        shopName: 'Chandampet PACS Bio-Input Center',
        shopId: 'store-1',
        shopPhone: '9876500112'
      },
      {
        id: 'fp-3',
        name: 'Quick Lime (CaO) Fish Grade High Calcium 85%',
        telugu: 'సున్నం (క్విక్ లైమ్ 85%)',
        category: 'Water Quality Conditioner',
        price: 320,
        unit: '50kg bag',
        stock: 80,
        dosage: '100 - 150 kg per acre',
        shopName: 'Deccan Small Ruminants & Fodder Mart',
        shopId: 'ls-shop-2',
        shopPhone: '9848099334'
      }
    ]
  },
  {
    id: 'fd-2',
    speciesId: 'carps',
    name: 'Argulosis / Fish Lice Infestation (Argulus)',
    telugu: 'చేపల పేను వ్యాధి (ఆర్గులస్)',
    icon: '🪲',
    severity: 'Medium (Stunts Growth & Causes Secondary Infections)',
    pathogen: 'Ectoparasitic Crustacean (Argulus foliaceus / Argulus japonicus)',
    symptoms: [
      'Disc-shaped transparent/greenish lice (4-8mm) crawling on fish skin and fins',
      'Fish violently flashing, rubbing, and scraping bodies against pond dykes',
      'Hemorrhagic puncture marks, severe scale loss, and excessive slime secretion',
      'Severe lethargy, emaciation, and secondary bacterial infections'
    ],
    diagnosisText: 'Argulus lice pierce the fish skin with pre-oral stylets and inject venomous secretions while feeding on fish blood and mucus. Extremely common in overstocked carp ponds with high organic debris.',
    controlMeasures: [
      'Apply Deltamethrin (Butox) @ 0.5 ml per 1,000 Litres pond water (or 40-50 ml per acre-foot)',
      'Install bamboo poles or submersed wood poles in pond corners for lice egg deposition, then remove and sun-dry poles weekly',
      'Apply high-purity organo-copper or herbal bio-parasiticide in morning hours'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Fish Lice (Argulus) Eradication & Bamboo Pole Biological Trapping',
    linkedProducts: [
      {
        id: 'fp-4',
        name: 'Aqua-Lice Destroyer (Deltamethrin EC Formulation)',
        telugu: 'చేపల పేను నివారిణి',
        category: 'Aquaculture Parasiticide',
        price: 280,
        unit: '250ml bottle',
        stock: 25,
        dosage: '40 ml per acre-foot water depth',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopId: 'ls-shop-1',
        shopPhone: '9876511223'
      }
    ]
  },
  {
    id: 'fd-3',
    speciesId: 'catfish',
    name: 'Columnaris / Bacterial Gill & Fin Rot',
    telugu: 'కివిళ్ల కుళ్ళు & తోక కుళ్ళు వ్యాధి',
    icon: '🦠',
    severity: 'High (Destroys Respiratory Function)',
    pathogen: 'Flavobacterium columnare (Flexibacter columnaris)',
    symptoms: [
      'Gill filaments turning pale yellow/brown and rotting away with excess mucus',
      'Cottony whitish-grey patches around mouth (Cotton mouth disease)',
      'Frayed, eroded dorsal and caudal fins with necrotic white margins',
      'Fish gathering near water inflow pipes and gasping heavily for dissolved oxygen'
    ],
    diagnosisText: 'Columnaris thrives in high ammonia, low dissolved oxygen, and high water temperature (>28°C). The bacteria produce chondroitinase enzyme that dissolves cartilage and gill tissues rapidly.',
    controlMeasures: [
      'Feed Oxytetracycline medicated feed pellets @ 75 mg/kg fish biomass for 7-10 days',
      'Apply Pond Oxygen granules (Sodium Percarbonate) @ 1 kg/acre for emergency aeration',
      'Perform 25% pond water exchange and apply water sanitizer BKC (Benzalkonium Chloride 50%) @ 1 Litre/acre'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Columnaris & Gill Rot Treatment with Medicated Feed Pellets',
    linkedProducts: [
      {
        id: 'fp-5',
        name: 'Oxytetracycline Hydro-Chloride 50% (Aquaculture Antibacterial)',
        telugu: 'ఆక్సిటెట్రాసైక్లిన్ 50%',
        category: 'Aquaculture Medicine',
        price: 380,
        unit: '500g pouch',
        stock: 40,
        dosage: '5g mixed per 1kg feed with edible oil binder',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopId: 'ls-shop-1',
        shopPhone: '9876511223'
      },
      {
        id: 'fp-6',
        name: 'Aqua-Oxygen Fast Dissolving Granules (Emergency Aeration)',
        telugu: 'ఆక్వా ఆక్సిజన్ గ్రాన్యూల్స్',
        category: 'Water Aeration',
        price: 220,
        unit: '1kg pack',
        stock: 60,
        dosage: '1 - 2 kg per acre broadcasted uniformly',
        shopName: 'Chandampet PACS Bio-Input Center',
        shopId: 'store-1',
        shopPhone: '9876500112'
      }
    ]
  },
  {
    id: 'fd-4',
    speciesId: 'tilapia',
    name: 'Streptococcosis & Dropsy (Abdominal Swelling)',
    telugu: 'పొట్ట ఉబ్బు & పాప్-ఐ వ్యాధి',
    icon: '🐡',
    severity: 'High (Systemic Septicemia)',
    pathogen: 'Streptococcus iniae & Aeromonas hydrophila',
    symptoms: [
      'Severe abdominal distension filled with yellow ascitic fluid (Dropsy)',
      'Exophthalmos (Unilateral or bilateral protruding pop-eyes)',
      'Erratic spiral swimming behavior and loss of equilibrium',
      'Hemorrhagic vent and dark skin pigmentation'
    ],
    diagnosisText: 'Streptococcal septicemia is the leading killer in intensive Tilapia farming. Elevated organic bottom load and high stocking densities trigger acute bacteremia invading internal organs.',
    controlMeasures: [
      'Apply Multi-Strain Pond Bottom Probiotics (Bacillus subtilis, Nitrosomonas) @ 1 kg/acre',
      'Reduce daily feeding ration by 50% and enrich feed with Vitamin C + Beta-Glucans @ 5g/kg',
      'Water exchange 30% and disinfection with micro-dosed Iodophore @ 500ml/acre'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Tilapia Dropsy & Streptococcosis Management using Probiotics',
    linkedProducts: [
      {
        id: 'fp-7',
        name: 'Multi-Strain Soil & Water Aqua Probiotic (High CFU Concentration)',
        telugu: 'ఆక్వా ప్రోబయోటిక్స్ (నీరు & మట్టి రక్షక్)',
        category: 'Aqua Probiotics',
        price: 550,
        unit: '1kg container',
        stock: 30,
        dosage: '1 kg fermented with 5kg jaggery per acre pond',
        shopName: 'Munchireddypally Organic Farmers FPO Store',
        shopId: 'store-3',
        shopPhone: '9848123456'
      }
    ]
  },
  {
    id: 'fd-5',
    speciesId: 'murrel',
    name: 'Epizootic Saprolegniasis (Water Mold / White Cotton Fungus)',
    telugu: 'బూజు శిలీంద్ర వ్యాధి (సాప్రోలెగ్నియా)',
    icon: '☁️',
    severity: 'Medium to High (Infects Injury Sites)',
    pathogen: 'Fungal Saprophyte (Saprolegnia parasitica)',
    symptoms: [
      'White to brownish cotton-like fungal tufts growing over injured skin, head, and eyes',
      'Blindness caused by fungal growth covering corneal surface',
      'Sluggish movement, isolation at pond edges, and refusal to feed'
    ],
    diagnosisText: 'Saprolegnia is an opportunistic fungus that invades fish skin after physical injury from predator handling, netting abrasion, or sudden cold temperature shock.',
    controlMeasures: [
      'Common Salt (NaCl) bath treatment @ 2-3% (20-30g/L water) for 5-10 minutes',
      'Copper Sulphate (CuSO4) pond application @ 0.2 - 0.5 ppm',
      'Methylene Blue treatment @ 2 ppm for nursery tanks and fingerling ponds'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Saprolegnia Fungal Cotton Tuft Treatment & Salt Bath Demo',
    linkedProducts: [
      {
        id: 'fp-8',
        name: 'Copper Sulphate High Purity (Neela Thutha)',
        telugu: 'మయిలుతుత్తం (కాపర్ సల్ఫేట్)',
        category: 'Aquaculture Fungicide',
        price: 150,
        unit: '1kg pack',
        stock: 45,
        dosage: '500g - 1kg per acre dissolved in warm water',
        shopName: 'Deccan Small Ruminants & Fodder Mart',
        shopId: 'ls-shop-2',
        shopPhone: '9848099334'
      }
    ]
  }
];

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
  ],
  species: FISH_SPECIES,
  diseases: FISH_DISEASES
};

export default fisheries;
