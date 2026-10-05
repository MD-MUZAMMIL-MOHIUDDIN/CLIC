// ============================================================
// Crops - Pests & Crops - Diseases Master Knowledge Data
// Covers: Crops -> Pests (Sucking, Chewing, Borers -> Life Cycle -> Stages -> Controls -> Inoculum -> Video -> Input Shop)
// Covers: Crops -> Diseases (Symptoms -> Severity -> Controls -> Inoculum -> Video -> Input Shop)
// ============================================================

export const CROP_THEMES = [
  { id: 'paddy', name: 'Paddy (Rice)', telugu: 'వరి', icon: '🌾', category: 'Cereals' },
  { id: 'cotton', name: 'Cotton', telugu: 'పత్తి', icon: '🌿', category: 'Cash Crop' },
  { id: 'chilli', name: 'Chilli', telugu: 'మిరప', icon: '🌶️', category: 'Commercial / Vegetable' },
  { id: 'redgram', name: 'Red Gram (Tur)', telugu: 'కందులు', icon: '🫘', category: 'Pulses' },
  { id: 'groundnut', name: 'Groundnut', telugu: 'వేరుశనగ', icon: '🥜', category: 'Oilseeds' },
  { id: 'maize', name: 'Maize (Corn)', telugu: 'మొక్కజొన్న', icon: '🌽', category: 'Cereals' },
  { id: 'tomato', name: 'Tomato', telugu: 'టమోటా', icon: '🍅', category: 'Vegetable' },
  { id: 'sugarcane', name: 'Sugarcane', telugu: 'చెరకు', icon: '🎋', category: 'Cash Crop' }
];

export const PEST_CATEGORIES = [
  { id: 'sucking', label: 'Sucking Pests', telugu: 'రసం పీల్చే పురుగులు', icon: '🪲', desc: 'Insects that pierce plant tissues and suck sap (BPH, Aphids, Thrips, Whiteflies, Jassids)' },
  { id: 'chewing', label: 'Chewing Pests', telugu: 'ఆకు తినే / కొరికే పురుగులు', icon: '🐛', desc: 'Defoliators and caterpillars that chew leaves and stems (Spodoptera, Leaf Folder, Armyworm)' },
  { id: 'borers', label: 'Borers', telugu: 'కాండం / కాయ తొలుచు పురుగులు', icon: '🪱', desc: 'Internal tissue feeders boring into stems, pods, shoots and bolls (Stem Borer, Pod Borer, Bollworm)' }
];

export const CROP_PESTS_DATA = [
  // -------------------------------------------------------------
  // PADDY PESTS
  // -------------------------------------------------------------
  {
    id: 'paddy-bph',
    cropId: 'paddy',
    name: 'Brown Plant Hopper (BPH)',
    telugu: 'గోధుమ రంగు దోమ',
    scientificName: 'Nilaparvata lugens',
    category: 'sucking',
    damageSymptoms: 'Circular yellowing and drying patches in field known as "Hopper Burn". Nymphs and adults suck sap from leaf sheath bases.',
    economicThreshold: '10–15 insects / hill in vegetative stage; 20–25 insects / hill after panicle emergence',
    lifeCycle: [
      { stage: 'Egg', duration: '7–9 days', desc: 'Eggs laid in clusters inside leaf sheath midribs.', vulnerability: 'Protected inside sheath. Avoid excess nitrogen.', icon: '🥚' },
      { stage: 'Nymph', duration: '12–15 days', desc: '5 instars, brown to grayish wingless hoppers clustered at base.', vulnerability: 'Highest chemical & botanical vulnerability. Target spray at stem base.', icon: '🪳', keyStage: true },
      { stage: 'Adult', duration: '10–20 days', desc: 'Macropterous (winged) and brachypterous (short winged) forms migrate rapidly.', vulnerability: 'Light traps at night (6:30–9:30 PM); alley formation for air circulation.', icon: '🦟' }
    ],
    controlMeasures: {
      cultural: 'Provide 30 cm alley ways (aarla thiragadam) for every 2 meters. Drain standing water completely for 3–4 days (alternate wetting & drying). Avoid excess urea.',
      biological: 'Conserve natural predators like Mirid bugs (Cyrtorhinus lividipennis) and spiders (Lycosa pseudoannulata). Spray Beauveria bassiana 1 × 10^8 CFU @ 5g/L.',
      chemical: 'Direct spray to the base of the plant: Triflumezopyrim 10% SC @ 0.5ml/L OR Pymetrozine 50% WDG @ 0.6g/L OR Dinotefuran 20% SG @ 0.4g/L.'
    },
    video: {
      title: 'BPH Management & Base Spray Technique in Paddy',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '7 mins',
      thumbnail: '🌾'
    },
    inoculum: {
      formula: 'Beauveria bassiana Bio-Pesticide Suspended Inoculum + Neem Oil',
      preparationSteps: [
        'Mix 1 kg of Beauveria bassiana 1.15% WP in 200 Litres of chlorine-free pond/well water.',
        'Add 1 Litre of Neem Seed Kernel Extract (NSKE 5%) or cold-pressed Neem Oil with 100ml soap solution emulsifier.',
        'Stir vigorously and let it activate for 30 minutes in shade.',
        'Direct spray nozzle towards the bottom base of paddy tillers during late afternoon (4 PM).'
      ],
      dosagePerAcre: '1 kg Bio-agent + 1 L Neem Emulsion per acre',
      precautions: 'Do not mix bio-fungicides with chemical fungicides. Use clean water with neutral pH.'
    },
    recommendedProducts: [
      { id: 'prod-p1', name: 'Beauveria Bassiana Bio-Pesticide (1kg)', unitPrice: 280, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 65, pack: '1 kg pouch' },
      { id: 'prod-p2', name: 'Pymetrozine 50% WDG Hopper Special (120g)', unitPrice: 580, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 42, pack: '120g pack' },
      { id: 'prod-p3', name: 'Neem Oil 10,000 PPM Emulsion (1L)', unitPrice: 350, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 80, pack: '1 Litre bottle' }
    ]
  },
  {
    id: 'paddy-stem-borer',
    cropId: 'paddy',
    name: 'Yellow Stem Borer',
    telugu: 'కాండం తొలుచు పురుగు',
    scientificName: 'Scirpophaga incertulas',
    category: 'borers',
    damageSymptoms: 'Larvae bore into main tillers producing "Dead Heart" in vegetative stage and chaffy white panicles known as "White Earhead" in flowering stage.',
    economicThreshold: '1 egg mass/m² or 5% dead hearts at tillering / 1 moth/m²',
    lifeCycle: [
      { stage: 'Egg', duration: '5–8 days', desc: 'Flat egg masses covered with yellowish-brown velvety maternal hairs near leaf tips.', vulnerability: 'Clipping seedling leaf tips during transplanting kills 80% egg masses.', icon: '🥚' },
      { stage: 'Larva', duration: '20–30 days', desc: 'Dirty white/yellow caterpillar bores inside stem and eats vascular pith.', vulnerability: 'Penetration stage before entering stem. Systemic bio/chemical spray.', icon: '🐛', keyStage: true },
      { stage: 'Pupa', duration: '6–10 days', desc: 'Silken cocoon inside the stem stubble near root zone.', vulnerability: 'Deep summer ploughing and stubble burning destroys pupae.', icon: '🪺' },
      { stage: 'Adult', duration: '4–6 days', desc: 'Yellowish moth with a distinct black spot on each forewing in females.', vulnerability: 'Pheromone traps (Scirpo-Lure) @ 5/acre.', icon: '🦋' }
    ],
    controlMeasures: {
      cultural: 'Clip the seedling tips before transplanting. Set up yellow stem borer pheromone traps @ 5/acre. Avoid excessive application of nitrogenous fertilizers.',
      biological: 'Release egg parasitoid Trichogramma japonicum @ 20,000/acre (1 Tricho card) weekly for 3 weeks from 30 DAT. Spray Bacillus thuringiensis (Bt) @ 2g/L.',
      chemical: 'Cartap Hydrochloride 4G granules @ 7.5kg/acre OR Chlorantraniliprole 0.4% G @ 4kg/acre OR Chlorantraniliprole 18.5% SC @ 0.3ml/L spray.'
    },
    video: {
      title: 'Stem Borer Identification, Tricho Card Installation & Control',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '8 mins',
      thumbnail: '🌾'
    },
    inoculum: {
      formula: 'Trichogramma Parasitoid Card Attachment + Bt Kurstaki Inoculum',
      preparationSteps: [
        'Cut the Trichogramma japonicum card into 8 small strips containing parasitized egg clusters.',
        'Staple each strip underneath the paddy leaf on the underside at 15m grid intervals across 1 acre.',
        'For Bt spray: Mix 400g of Bacillus thuringiensis var kurstaki wettable powder in 200L water.',
        'Spray during early morning or sunset when temperature is low.'
      ],
      dosagePerAcre: '1 Card (20,000 parasitized eggs) + 400g Bt per acre',
      precautions: 'Do not spray chemical insecticides within 7 days of Tricho card release.'
    },
    recommendedProducts: [
      { id: 'prod-p4', name: 'Trichogramma Japonicum Egg Cards (Pack of 3)', unitPrice: 150, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 110, pack: '3 Cards' },
      { id: 'prod-p5', name: 'Bacillus Thuringiensis (Bt) WP (500g)', unitPrice: 320, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 55, pack: '500g box' },
      { id: 'prod-p6', name: 'Pheromone Traps + Lures for Stem Borer (Set of 5)', unitPrice: 250, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 90, pack: '5 Traps + Lures' }
    ]
  },
  {
    id: 'paddy-leaf-folder',
    cropId: 'paddy',
    name: 'Rice Leaf Folder',
    telugu: 'ఆకు ముడుత పురుగు',
    scientificName: 'Cnaphalocrocis medinalis',
    category: 'chewing',
    damageSymptoms: 'Larvae fold leaf blades longitudinally and scrape chlorophyll from inside, creating white transparent streaks.',
    economicThreshold: '1–2 damaged leaves per hill with live larvae',
    lifeCycle: [
      { stage: 'Egg', duration: '4–6 days', desc: 'Small oval eggs laid singly or in pairs on leaf blades.', vulnerability: 'Conserve predatory spiders and damselflies.', icon: '🥚' },
      { stage: 'Larva', duration: '15–25 days', desc: 'Yellowish-green caterpillar with dark brown head feeds inside folded leaf.', vulnerability: 'Bio-pesticide spray or Flubendiamide early instars.', icon: '🐛', keyStage: true },
      { stage: 'Adult', duration: '5–8 days', desc: 'Golden-yellow moth with dark brown wavy lines on wings.', vulnerability: 'Light traps attracted.', icon: '🦋' }
    ],
    controlMeasures: {
      cultural: 'Pass thorny rope or bamboo pole across the field at 30–40 DAT to dislodge larvae. Avoid shaded over-fertilized patches.',
      biological: 'Release Trichogramma chilonis @ 20,000/acre. Spray Azadirachtin 1% (10,000 ppm) @ 2ml/L.',
      chemical: 'Flubendiamide 39.35% SC @ 0.2ml/L OR Acephate 75% SP @ 1.5g/L OR Chlorantraniliprole 18.5% SC @ 0.3ml/L.'
    },
    video: {
      title: 'Rice Leaf Folder Biological Management',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5 mins',
      thumbnail: '🌾'
    },
    inoculum: {
      formula: 'Botanical Neem Seed Kernel Extract (NSKE 5%) Formulation',
      preparationSteps: [
        'Take 5 kg well-dried neem seed kernels and grind into fine powder.',
        'Tie powder in clean muslin cloth and soak in 10 Litres water overnight.',
        'Squeeze bag repeatedly to extract milk. Filter extract and dilute to 100 Litres.',
        'Add 100g washing soap or liquid detergent as spreading adjuvant and spray.'
      ],
      dosagePerAcre: '5 kg seed kernel extract in 200 Litres water per acre',
      precautions: 'Use fresh extract within 24 hours of preparation.'
    },
    recommendedProducts: [
      { id: 'prod-p7', name: 'Neem Kernel Extract Powder NSKE (5kg)', unitPrice: 220, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 75, pack: '5 kg bag' },
      { id: 'prod-p8', name: 'Flubendiamide 39.35% SC (50ml)', unitPrice: 420, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 35, pack: '50ml bottle' }
    ]
  },

  // -------------------------------------------------------------
  // COTTON PESTS
  // -------------------------------------------------------------
  {
    id: 'cotton-pink-bollworm',
    cropId: 'cotton',
    name: 'Pink Bollworm',
    telugu: 'గులాబీ రంగు కాయ తొలుచు పురుగు',
    scientificName: 'Pectinophora gossypiella',
    category: 'borers',
    damageSymptoms: 'Rosette flowers (petals twisted/closed). Caterpillars bore into developing bolls, eating seeds and staining lint.',
    economicThreshold: '8 moths/trap/day for 3 consecutive days or 10% infested flowers/bolls',
    lifeCycle: [
      { stage: 'Egg', duration: '3–6 days', desc: 'Flat greenish eggs laid under calyx of flowers and green bolls.', vulnerability: 'Monitoring with pheromone traps.', icon: '🥚' },
      { stage: 'Larva', duration: '14–20 days', desc: 'Pinkish caterpillar with dark head inside bolls.', vulnerability: 'Early instar spray before larva enters boll (1st 24–48 hours).', icon: '🐛', keyStage: true },
      { stage: 'Pupa', duration: '7–12 days', desc: 'Brown pupa inside dropped bolls or soil crevices.', vulnerability: 'Destroy crop residues & terminate crop by December.', icon: '🪺' },
      { stage: 'Adult', duration: '8–14 days', desc: 'Small grayish-brown nocturnal moth.', vulnerability: 'Pheromone traps (Pectino-Lure) & Light traps.', icon: '🦋' }
    ],
    controlMeasures: {
      cultural: 'Install 8 pheromone traps/acre at 45 DAS. Stoppage of irrigation after Nov to prevent late flushes. Shred and burn stalks immediately after harvest.',
      biological: 'Release Trichogrammatoidea bactrae @ 40,000/acre 4 times at weekly intervals. Spray Beauveria bassiana @ 5g/L.',
      chemical: 'Profenofos 50% EC @ 2ml/L OR Emamectin Benzoate 5% SG @ 0.5g/L OR Spinetoram 11.7% SC @ 1ml/L.'
    },
    video: {
      title: 'Pink Bollworm Pheromone Trap Installation & IPM',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '9 mins',
      thumbnail: '🌿'
    },
    inoculum: {
      formula: 'Beauveria Bassiana + Emamectin Target Spray',
      preparationSteps: [
        'Mix 100g of Emamectin Benzoate 5% SG in 200 Litres clean water.',
        'Add 500ml Neem Azadirachtin 10,000 ppm.',
        'Stir thoroughly and spray with hollow cone nozzle directly over squares and flowering bolls in late afternoon.'
      ],
      dosagePerAcre: '100g Emamectin + 500ml Neem per acre',
      precautions: 'Do not use synthetic pyrethroids early in the season to prevent whitefly resurgence.'
    },
    recommendedProducts: [
      { id: 'prod-p9', name: 'Cotton Pink Bollworm Pheromone Lure Kit (8 traps)', unitPrice: 380, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 85, pack: '8 Traps + Lures' },
      { id: 'prod-p10', name: 'Emamectin Benzoate 5% SG Pro-Defender (100g)', unitPrice: 390, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 60, pack: '100g pack' }
    ]
  },
  {
    id: 'cotton-whitefly',
    cropId: 'cotton',
    name: 'Whitefly & Sucking Complex',
    telugu: 'తెల్ల దోమ & రసం పీల్చే పురుగులు',
    scientificName: 'Bemisia tabaci',
    category: 'sucking',
    damageSymptoms: 'Yellowing and upward curling of leaves. Excretion of honeydew causing Black Sooty Mould on leaves and lint.',
    economicThreshold: '6–8 whiteflies or nymphs per leaf',
    lifeCycle: [
      { stage: 'Egg', duration: '4–7 days', desc: 'Tiny stalked yellowish eggs laid on lower leaf surfaces.', vulnerability: 'Yellow sticky traps.', icon: '🥚' },
      { stage: 'Nymph', duration: '9–14 days', desc: 'Scale-like oval translucent nymphs sucking sap on leaf underside.', vulnerability: 'Insect growth regulators & Verticillium lecanii spray.', icon: '🪳', keyStage: true },
      { stage: 'Adult', duration: '15–20 days', desc: 'Minute snowy-white winged flies active on top leaves.', vulnerability: 'Yellow sticky cards (10/acre) & systemic sprays.', icon: '🦟' }
    ],
    controlMeasures: {
      cultural: 'Install 10 Yellow Sticky Traps/acre at crop canopy level. Grow barrier crops like Bajra or Maize in 4 border rows.',
      biological: 'Spray Verticillium lecanii bio-fungicide @ 5g/L or 5% Neem Seed Kernel Extract.',
      chemical: 'Pyriproxyfen 10% EC @ 2ml/L OR Diafenthiuron 50% WP @ 1.25g/L OR Spiromesifen 22.9% SC @ 1ml/L.'
    },
    video: {
      title: 'Whitefly Control using Yellow Sticky Traps & Bio-agents',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '6 mins',
      thumbnail: '🌿'
    },
    inoculum: {
      formula: 'Verticillium Lecanii Entomopathogenic Inoculant Suspension',
      preparationSteps: [
        'Mix 1 kg of Verticillium lecanii wettable powder in 200 Litres lukewarm water.',
        'Add 200g jaggery and 50ml non-ionic sticker agent to enhance spore germination.',
        'Let it stand for 1 hour in shade.',
        'Spray with high volume sprayer ensuring thorough coverage under leaf canopy.'
      ],
      dosagePerAcre: '1 kg bio-agent per acre',
      precautions: 'Spray during high humidity (>70%) for maximum fungal spore infectivity.'
    },
    recommendedProducts: [
      { id: 'prod-p11', name: 'Verticillium Lecanii Bio-Insecticide (1kg)', unitPrice: 310, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 50, pack: '1 kg pack' },
      { id: 'prod-p12', name: 'Yellow Sticky Traps Weatherproof (Pack of 10)', unitPrice: 180, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 120, pack: '10 Sheets' }
    ]
  },

  // -------------------------------------------------------------
  // CHILLI & VEGETABLES PESTS
  // -------------------------------------------------------------
  {
    id: 'chilli-thrips-mites',
    cropId: 'chilli',
    name: 'Black Thrips & Murda Mites',
    telugu: 'నల్ల తామర పురుగులు & నల్లి (ముడత)',
    scientificName: 'Thrips parvispinus / Polyphagotarsonemus latus',
    category: 'sucking',
    damageSymptoms: 'Upward leaf curling (Thrips) and downward leaf curling (Mites - Boat shaped leaves). Flower dropping and fruit scarring.',
    economicThreshold: '2–3 thrips or mites / leaf or flower bud',
    lifeCycle: [
      { stage: 'Egg', duration: '3–5 days', desc: 'Kidney-shaped eggs inserted inside tender leaf tissue.', vulnerability: 'Blue/Yellow sticky traps for monitoring.', icon: '🥚' },
      { stage: 'Nymph / Larva', duration: '6–10 days', desc: 'Slender yellowish/black crawling nymphs feeding inside flowers.', vulnerability: 'Targeted botanical & systemic spray at flowering.', icon: '🪳', keyStage: true },
      { stage: 'Adult', duration: '12–18 days', desc: 'Fringe-winged fast-moving black thrips in flowers.', vulnerability: 'Blue sticky traps (15/acre).', icon: '🦟' }
    ],
    controlMeasures: {
      cultural: 'Install 15 Blue Sticky Traps/acre for thrips and 10 Yellow traps for whiteflies. Sprinkle water with overhead sprinkler to wash thrips.',
      biological: 'Spray Lecanicillium lecanii @ 5g/L. Spray Pongamia oil (Karanja) @ 3ml/L.',
      chemical: 'Spinetoram 11.7% SC @ 0.9ml/L OR Fipronil 80% WG @ 0.2g/L OR Broflanilide 300 SC @ 0.15ml/L for invasive black thrips.'
    },
    video: {
      title: 'Black Thrips (Thrips Parvispinus) Control Strategy in Chilli',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '8 mins',
      thumbnail: '🌶️'
    },
    inoculum: {
      formula: 'Blue Sticky Trap Matrix + Botanical Pongamia Emulsion',
      preparationSteps: [
        'Erect 15 Blue sticky sheets across the field at 1 foot above crop canopy.',
        'Mix 600ml Pongamia (Karanja) oil with 50g mild soap in 150L water.',
        'Spray during early morning directly into flowers and top tender leaves.'
      ],
      dosagePerAcre: '15 Blue Sheets + 600ml Botanical Oil per acre',
      precautions: 'Do not spray during peak midday heat to prevent leaf scorching.'
    },
    recommendedProducts: [
      { id: 'prod-p13', name: 'Blue Sticky Traps for Black Thrips (Pack of 15)', unitPrice: 240, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 95, pack: '15 Sheets' },
      { id: 'prod-p14', name: 'Spinetoram 11.7% SC Thrips Fighter (100ml)', unitPrice: 750, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 30, pack: '100ml bottle' }
    ]
  },

  // -------------------------------------------------------------
  // RED GRAM & PULSES PESTS
  // -------------------------------------------------------------
  {
    id: 'redgram-pod-borer',
    cropId: 'redgram',
    name: 'Gram Pod Borer (Helicoverpa)',
    telugu: 'శనగ పచ్చ పురుగు (కాయ తొలుచు పురుగు)',
    scientificName: 'Helicoverpa armigera',
    category: 'borers',
    damageSymptoms: 'Larva enters pods keeping head inside and body outside. Circular feeding holes on pods with hollowed-out seeds.',
    economicThreshold: '1 larva / plant or 5–10% damaged pods',
    lifeCycle: [
      { stage: 'Egg', duration: '3–4 days', desc: 'Spherical yellowish dome eggs laid singly on leaves and flower buds.', vulnerability: 'Release Trichogramma chilonis egg parasitoid.', icon: '🥚' },
      { stage: 'Larva', duration: '15–20 days', desc: 'Greenish/brown caterpillar with broken longitudinal lateral lines.', vulnerability: 'HaNPV viral spray @ 2nd instar stage or Bt spray.', icon: '🐛', keyStage: true },
      { stage: 'Pupa', duration: '8–12 days', desc: 'Pupa in soil chamber up to 10cm deep.', vulnerability: 'Inter-cultivation & bird perches.', icon: '🪺' },
      { stage: 'Adult', duration: '8–15 days', desc: 'Stout brown moth with kidney-shaped spot on forewings.', vulnerability: 'Helilure Pheromone traps @ 5/acre.', icon: '🦋' }
    ],
    controlMeasures: {
      cultural: 'Install 5 Helilure pheromone traps/acre. Install 20 "T" shaped bird perches/acre. Grow Marigold as trap crop (1:10 ratio).',
      biological: 'Spray HaNPV (Nuclear Polyhedrosis Virus) @ 250 LE/acre with 0.1% jaggery. Release Trichogramma @ 20,000/acre.',
      chemical: 'Chlorantraniliprole 18.5% SC @ 0.3ml/L OR Flubendiamide 480 SC @ 0.2ml/L OR Emamectin Benzoate 5% SG @ 0.5g/L.'
    },
    video: {
      title: 'Helicoverpa Pod Borer Management & HaNPV Preparation',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '7 mins',
      thumbnail: '🫘'
    },
    inoculum: {
      formula: 'HaNPV (Helicoverpa NPV 250 LE) Bio-Viral Formulation',
      preparationSteps: [
        'Mix 250 LE of HaNPV viral liquid in 200 Litres clean non-chlorinated water.',
        'Add 200g powdered jaggery as feeding stimulant and UV-protectant.',
        'Add 50ml wetting agent and spray during late evening.'
      ],
      dosagePerAcre: '250 LE per acre',
      precautions: 'Apply in evening hours as virus is sensitive to solar ultraviolet radiation.'
    },
    recommendedProducts: [
      { id: 'prod-p15', name: 'HaNPV Bio-Virus Inoculum 250 LE (100ml)', unitPrice: 320, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 40, pack: '100ml bottle' },
      { id: 'prod-p16', name: 'Helilure Pod Borer Pheromone Kit (5 Traps)', unitPrice: 220, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 70, pack: '5 Traps' }
    ]
  },

  // -------------------------------------------------------------
  // MAIZE PESTS
  // -------------------------------------------------------------
  {
    id: 'maize-faw',
    cropId: 'maize',
    name: 'Fall Armyworm (FAW)',
    telugu: 'కత్తెర పురుగు',
    scientificName: 'Spodoptera frugiperda',
    category: 'chewing',
    damageSymptoms: 'Ragged whorl feeding with large irregular holes and abundant sawdust-like fecal matter inside maize whorls.',
    economicThreshold: '5% infested plants in seedling stage; 10% in mid-whorl stage',
    lifeCycle: [
      { stage: 'Egg', duration: '2–4 days', desc: 'Dome-shaped eggs laid in masses covered in gray felt-like scales.', vulnerability: 'Hand picking egg masses at 7–15 DAS.', icon: '🥚' },
      { stage: 'Larva', duration: '14–22 days', desc: 'Larva with inverted Y shape on head and 4 square dots on 8th abdominal segment.', vulnerability: 'Poison baiting / whorl application of bio-agents.', icon: '🐛', keyStage: true },
      { stage: 'Pupa', duration: '7–10 days', desc: 'Reddish brown pupa in soil 2–8 cm deep.', vulnerability: 'Deep summer ploughing.', icon: '🪺' },
      { stage: 'Adult', duration: '7–10 days', desc: 'Mottled brown moth with white triangle markings.', vulnerability: 'FAW Pheromone traps @ 5/acre.', icon: '🦋' }
    ],
    controlMeasures: {
      cultural: 'Deep summer ploughing. Timely uniform sowing. Intercrop maize with pulses/cowpea. Install 5 FAW pheromone traps/acre.',
      biological: 'Release Telenomus remus egg parasitoid. Whorl application of Metarhizium rileyi or Beauveria bassiana @ 5g/L.',
      chemical: 'Whorl application of Chlorantraniliprole 18.5% SC @ 0.4ml/L OR Emamectin Benzoate 5% SG @ 0.4g/L OR Spinetoram 11.7% SC @ 0.5ml/L.'
    },
    video: {
      title: 'Fall Armyworm (FAW) Whorl Application & Poison Bait Method',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '8 mins',
      thumbnail: '🌽'
    },
    inoculum: {
      formula: 'Metarhizium Rileyi + Rice Bran / Jaggery Poison Bait Formula',
      preparationSteps: [
        'Mix 10 kg Rice Bran (Thowdu) + 1 kg Jaggery (Gur) in 3 Litres water and let ferment 24 hours.',
        'Add 100g Thiodicarb 75% WP or 1 kg Metarhizium rileyi bio-fungus.',
        'Make small dough balls and drop into central leaf whorls in evening.'
      ],
      dosagePerAcre: '10 kg bait mixture per acre',
      precautions: 'Use gloves while preparing poison bait. Keep away from domestic animals.'
    },
    recommendedProducts: [
      { id: 'prod-p17', name: 'Metarhizium Rileyi FAW Bio-Whorl Powder (1kg)', unitPrice: 340, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 45, pack: '1 kg box' },
      { id: 'prod-p18', name: 'FAW Fall Armyworm Pheromone Traps (Pack of 5)', unitPrice: 280, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 60, pack: '5 Traps' }
    ]
  }
];

export const CROP_DISEASES_DATA = [
  // -------------------------------------------------------------
  // PADDY DISEASES
  // -------------------------------------------------------------
  {
    id: 'paddy-blast',
    cropId: 'paddy',
    name: 'Rice Blast (Leaf & Neck Blast)',
    telugu: 'వరి అగ్గితెగులు (ఆకు & మెడ విరుపు తెగులు)',
    pathogen: 'Magnaporthe oryzae (Pyricularia oryzae)',
    causalAgent: 'Fungus',
    symptoms: 'Spindle-shaped / diamond-shaped lesions with ash-grey center and dark brown margin on leaves. Rotten blackened neck node leading to complete grain loss.',
    favorableConditions: 'High relative humidity (>90%), night temp 19–22°C, cloudy weather and excess nitrogen fertilizer.',
    severityLevels: [
      { level: 'mild', label: 'Mild / Early (1–5% spindle spots)', advice: 'Immediate foliar spray with Pseudomonas fluorescens 10g/L. Stop top-dressing urea.', urgency: 'Moderate' },
      { level: 'moderate', label: 'Moderate (6–20% leaf area with expanding eye-spots)', advice: 'Systemic curative fungicide spray with Tricyclazole 75% WP @ 0.6g/L.', urgency: 'High' },
      { level: 'severe', label: 'Severe (>20% leaf death / Neck blast onset)', advice: 'Emergency tank mix: Tricyclazole 75% WP + Kasugamycin 3% SL. Drain and re-flood fields.', urgency: 'Critical' }
    ],
    controlMeasures: {
      organic_biocontrol: 'Seed treatment with Pseudomonas fluorescens @ 10g/kg. Foliar spray of fermented sour buttermilk + ginger garlic extract @ 50ml/L.',
      chemical_fungicide: 'Tricyclazole 75% WP @ 0.6g/L OR Isoprothiolane 40% EC @ 1.5ml/L OR Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L.',
      preventive_measures: 'Grow resistant varieties like BPT 5204 (moderate), Telangana Sona. Avoid application of excess urea in split doses.'
    },
    video: {
      title: 'Paddy Blast Disease Identification & Spray Management',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '7 mins',
      thumbnail: '🌾'
    },
    inoculum: {
      formula: 'Pseudomonas Fluorescens Liquid Bio-Fungicide Inoculum',
      preparationSteps: [
        'Mix 1 Litre of liquid Pseudomonas fluorescens (1 × 10^9 CFU/ml) in 200 Litres clean well water.',
        'Add 100g powdered jaggery as carrier nutrient.',
        'Stir for 5 minutes and spray thoroughly on crop canopy during early morning.'
      ],
      dosagePerAcre: '1 Litre liquid bio-formulation in 200L water per acre',
      precautions: 'Do not mix bio-agents with copper or systemic chemical fungicides.'
    },
    recommendedProducts: [
      { id: 'prod-d1', name: 'Pseudomonas Fluorescens Liquid Bio-Fungicide (1L)', unitPrice: 260, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 80, pack: '1 Litre bottle' },
      { id: 'prod-d2', name: 'Tricyclazole 75% WP Blast Conqueror (120g)', unitPrice: 480, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 50, pack: '120g pack' },
      { id: 'prod-d3', name: 'Azoxystrobin + Difenoconazole SC (100ml)', unitPrice: 620, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 35, pack: '100ml bottle' }
    ]
  },
  {
    id: 'paddy-sheath-blight',
    cropId: 'paddy',
    name: 'Sheath Blight',
    telugu: 'వరి పొడ తెగులు',
    pathogen: 'Rhizoctonia solani',
    causalAgent: 'Soil-borne Fungus',
    symptoms: 'Oval or irregular greenish-grey water-soaked spots with dark brown margins developing on leaf sheaths near water level, spreading upward to canopy.',
    favorableConditions: 'High temperature (28–32°C), high humidity (>95%), close planting and dense canopy.',
    severityLevels: [
      { level: 'mild', label: 'Mild / Early (Lesions confined to lower leaf sheaths)', advice: 'Drain field water for 3 days to lower humidity. Spray Trichoderma viride 5g/L.', urgency: 'Moderate' },
      { level: 'moderate', label: 'Moderate (Lesions reach 3rd leaf sheath from top)', advice: 'Spray Hexaconazole 5% SC @ 2ml/L or Validamycin 3% L @ 2.5ml/L.', urgency: 'High' },
      { level: 'severe', label: 'Severe (Lesions spread to flag leaf causing lodging)', advice: 'Spray Trifloxystrobin 25% + Tebuconazole 50% WG @ 0.4g/L.', urgency: 'Critical' }
    ],
    controlMeasures: {
      organic_biocontrol: 'Soil application of Trichoderma viride @ 2kg enriched with 100kg FYM/acre before transplanting.',
      chemical_fungicide: 'Hexaconazole 5% SC @ 2ml/L OR Validamycin 3% L @ 2.5ml/L OR Thifluzamide 24% SC @ 0.75ml/L.',
      preventive_measures: 'Avoid dense planting; maintain 20 × 15 cm spacing. Keep bunds clean of grassy weeds which act as alternate hosts.'
    },
    video: {
      title: 'Sheath Blight Diagnosis, Drainage & Fungicide Spray Guide',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '6 mins',
      thumbnail: '🌾'
    },
    inoculum: {
      formula: 'Trichoderma Viride + Validamycin Dual Stage Treatment',
      preparationSteps: [
        'Mix 500ml of Validamycin 3% L in 200 Litres water.',
        'Target spray at the lower base and sheaths of paddy tillers near the water line.',
        'Repeat after 12 days if humid weather persists.'
      ],
      dosagePerAcre: '500ml Validamycin in 200L water per acre',
      precautions: 'Ensure spray penetrates dense canopy to reach lower stem sheaths.'
    },
    recommendedProducts: [
      { id: 'prod-d4', name: 'Validamycin 3% L Sheath Shield (1L)', unitPrice: 380, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 60, pack: '1 Litre bottle' },
      { id: 'prod-d5', name: 'Hexaconazole 5% SC (1L)', unitPrice: 420, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 45, pack: '1 Litre bottle' },
      { id: 'prod-d6', name: 'Trichoderma Viride Bio-Fungicide (1kg)', unitPrice: 190, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 90, pack: '1 kg box' }
    ]
  },

  // -------------------------------------------------------------
  // COTTON DISEASES
  // -------------------------------------------------------------
  {
    id: 'cotton-blb',
    cropId: 'cotton',
    name: 'Bacterial Leaf Blight (Black Arm / Angular Leaf Spot)',
    telugu: 'పత్తి బాక్టీరియా ఆకుమచ్చ / నల్ల కొమ్మ తెగులు',
    pathogen: 'Xanthomonas citri pv. malvacearum',
    causalAgent: 'Bacterium',
    symptoms: 'Angular water-soaked lesions bounded by veins on leaves. Lesions turn reddish brown. Black elongated lesions on stem called "Black Arm".',
    favorableConditions: 'Intermittent rainfall, warm temperatures (28–30°C), hail damage or wounds.',
    severityLevels: [
      { level: 'mild', label: 'Mild (Angular spots on bottom leaves)', advice: 'Spray Copper Oxychloride 50% WP 3g/L + Streptocycline 100mg/L.', urgency: 'Moderate' },
      { level: 'moderate', label: 'Moderate (Lesions coalescing on main canopy)', advice: 'Spray Streptocycline 18g + Copper Oxychloride 500g in 200L water.', urgency: 'High' },
      { level: 'severe', label: 'Severe (Stem black arm & boll rotting)', advice: 'Emergency spray: Kresoxim methyl + Copper Hydroxide + Streptocycline.', urgency: 'Critical' }
    ],
    controlMeasures: {
      organic_biocontrol: 'Seed delinting with concentrated H2SO4 @ 100ml/kg seed. Spray Pseudomonas fluorescens @ 10g/L.',
      chemical_fungicide: 'Copper Oxychloride 50% WP @ 3g/L + Streptocycline @ 0.1g/L (18g pouch in 200L water).',
      preventive_measures: 'Crop rotation with non-host crops. Deep ploughing to bury crop residues.'
    },
    video: {
      title: 'Cotton Angular Leaf Spot & Black Arm Control',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '5 mins',
      thumbnail: '🌿'
    },
    inoculum: {
      formula: 'Streptocycline Antibiotic + Copper Oxychloride Fungicide Formulation',
      preparationSteps: [
        'Dissolve 18g of Streptocycline powder in 2 Litres of lukewarm water in a plastic bucket.',
        'Mix 500g Copper Oxychloride 50% WP in 10 Litres water into smooth slurry.',
        'Combine both solutions and dilute to 200 Litres in the spray tank.',
        'Spray evenly covering both upper and lower leaf surfaces.'
      ],
      dosagePerAcre: '18g Streptocycline + 500g Copper Oxychloride per acre',
      precautions: 'Do not use metal containers for preparing antibiotic stock solutions.'
    },
    recommendedProducts: [
      { id: 'prod-d7', name: 'Streptocycline Plant Bactericide (Pack of 3 x 6g)', unitPrice: 160, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 120, pack: '18g Pack' },
      { id: 'prod-d8', name: 'Copper Oxychloride 50% WP Blue Shield (500g)', unitPrice: 290, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 70, pack: '500g box' }
    ]
  },
  {
    id: 'cotton-wilt',
    cropId: 'cotton',
    name: 'Fusarium & Verticillium Wilt',
    telugu: 'పత్తి ఎండు తెగులు (విల్ట్)',
    pathogen: 'Fusarium oxysporum f.sp. vasinfectum',
    causalAgent: 'Soil-borne Fungus',
    symptoms: 'Yellowing of leaf veins followed by browning and wilting from bottom upwards. Vascular browning in split stem.',
    favorableConditions: 'Heavy clay soils, low soil pH, root-knot nematode infestation.',
    severityLevels: [
      { level: 'mild', label: 'Mild (Initial yellowing of lower leaves in patches)', advice: 'Drench root zone of affected plants with Carbendazim 1g/L + Trichoderma.', urgency: 'Moderate' },
      { level: 'moderate', label: 'Moderate (Wilting in 5–10% plants in field)', advice: 'Soil drenching around root base with Copper Oxychloride 3g/L + humic acid.', urgency: 'High' },
      { level: 'severe', label: 'Severe (Complete collapse & vascular blackening)', advice: 'Uproot infected plants and destroy. Drench spot with 0.1% Carbendazim.', urgency: 'Critical' }
    ],
    controlMeasures: {
      organic_biocontrol: 'Apply Trichoderma harzianum @ 2kg mixed with 100kg well-rotted FYM per acre in root zone.',
      chemical_fungicide: 'Spot drenching with Carbendazim 50% WP @ 1g/L OR Copper Oxychloride 50% WP @ 3g/L around root zone.',
      preventive_measures: 'Apply potash fertilizer @ 20kg/acre. Avoid waterlogging.'
    },
    video: {
      title: 'Cotton Wilt Prevention & Soil Drenching Protocol',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '6 mins',
      thumbnail: '🌿'
    },
    inoculum: {
      formula: 'Trichoderma Harzianum Soil Inoculum Enrichment',
      preparationSteps: [
        'Mix 2 kg Trichoderma harzianum powder in 100 kg moist farmyard manure (FYM).',
        'Cover with gunny bag and maintain moisture in shade for 7 days for fungal multiplication.',
        'Broadcast enriched compost in root zone furrow and irrigate lightly.'
      ],
      dosagePerAcre: '2 kg bio-agent + 100 kg FYM per acre',
      precautions: 'Do not apply chemical fungicides to soil for 15 days after Trichoderma.'
    },
    recommendedProducts: [
      { id: 'prod-d9', name: 'Trichoderma Harzianum Bio-Inoculum (1kg)', unitPrice: 200, storeId: 'store-3', storeName: 'Munchireddypally Organic FPO Store', stock: 65, pack: '1 kg bag' },
      { id: 'prod-d10', name: 'Carbendazim 50% WP Systemic Fungicide (500g)', unitPrice: 310, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 40, pack: '500g box' }
    ]
  },

  // -------------------------------------------------------------
  // CHILLI & TOMATO DISEASES
  // -------------------------------------------------------------
  {
    id: 'chilli-anthracnose',
    cropId: 'chilli',
    name: 'Anthracnose & Dieback (Fruit Rot)',
    telugu: 'మిరప కొమ్మ ఎండు & కాయకుళ్లు తెగులు',
    pathogen: 'Colletotrichum capsici',
    causalAgent: 'Fungus',
    symptoms: 'Dieback of branches from top downwards. Circular sunken spots with concentric rings of black acervuli on ripe red chillies.',
    favorableConditions: 'High humidity (>85%), temp 25–30°C during fruit ripening stage.',
    severityLevels: [
      { level: 'mild', label: 'Mild (Isolated spots on twigs/leaves)', advice: 'Foliar spray with Mancozeb 75% WP @ 2.5g/L or Azoxystrobin @ 1ml/L.', urgency: 'Moderate' },
      { level: 'moderate', label: 'Moderate (10–15% damaged fruits)', advice: 'Spray Difenoconazole 25% EC @ 1ml/L or Tebuconazole 25.9% EC @ 1.5ml/L.', urgency: 'High' },
      { level: 'severe', label: 'Severe (>25% fruit rot and dieback)', advice: 'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/L.', urgency: 'Critical' }
    ],
    controlMeasures: {
      organic_biocontrol: 'Seed treatment with Trichoderma viride @ 4g/kg seed. Spray fermented butter milk + asafoetida.',
      chemical_fungicide: 'Difenoconazole 25% EC @ 1ml/L OR Pyraclostrobin 20% WG @ 1g/L OR Mancozeb 75% WP @ 2.5g/L.',
      preventive_measures: 'Collect and burn dry diseased twigs before flowering. Use disease-free certified seeds.'
    },
    video: {
      title: 'Chilli Anthracnose / Fruit Rot Management',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '7 mins',
      thumbnail: '🌶️'
    },
    inoculum: {
      formula: 'Difenoconazole Systemic Curative Spray Formulation',
      preparationSteps: [
        'Mix 150ml of Difenoconazole 25% EC in 150 Litres clean water.',
        'Add 50ml sticker/spreader agent.',
        'Spray thoroughly targeting ripe green and red chilli fruits.'
      ],
      dosagePerAcre: '150ml in 150L water per acre',
      precautions: 'Observe 7-day pre-harvest waiting interval (PHI) before plucking ripe fruits.'
    },
    recommendedProducts: [
      { id: 'prod-d11', name: 'Difenoconazole 25% EC Fruit Care (150ml)', unitPrice: 420, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 45, pack: '150ml bottle' },
      { id: 'prod-d12', name: 'Mancozeb 75% WP Contact Fungicide (1kg)', unitPrice: 380, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 85, pack: '1 kg pack' }
    ]
  },

  // -------------------------------------------------------------
  // GROUNDNUT DISEASES
  // -------------------------------------------------------------
  {
    id: 'groundnut-tikka',
    cropId: 'groundnut',
    name: 'Tikka Leaf Spot (Early & Late Tikka)',
    telugu: 'వేరుశనగ తిక్క ఆకుమచ్చ తెగులు',
    pathogen: 'Cercospora arachidicola / Phaeoisariopsis personata',
    causalAgent: 'Fungus',
    symptoms: 'Circular reddish-brown to dark spots with prominent yellow halos on leaf surface. Severe defoliation leading to poor pod filling.',
    favorableConditions: 'High humidity, intermittent rain, and prolonged dew.',
    severityLevels: [
      { level: 'mild', label: 'Mild (Few spots on lower leaves)', advice: 'Spray Mancozeb 75% WP @ 2g/L as preventive barrier.', urgency: 'Moderate' },
      { level: 'moderate', label: 'Moderate (Spots on 15–25% foliage)', advice: 'Spray Hexaconazole 5% EC @ 2ml/L or Tebuconazole @ 1ml/L.', urgency: 'High' },
      { level: 'severe', label: 'Severe (>50% defoliation of plant)', advice: 'Spray Carbendazim 12% + Mancozeb 63% WP @ 2g/L immediately.', urgency: 'Critical' }
    ],
    controlMeasures: {
      organic_biocontrol: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens @ 10g/L.',
      chemical_fungicide: 'Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2g/L OR Hexaconazole 5% EC @ 2ml/L.',
      preventive_measures: 'Treat kernels with Thiram or Captan @ 3g/kg seed before sowing.'
    },
    video: {
      title: 'Groundnut Tikka Leaf Spot Control & Yield Protection',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '6 mins',
      thumbnail: '🥜'
    },
    inoculum: {
      formula: 'Carbendazim + Mancozeb Dual Action Spray',
      preparationSteps: [
        'Mix 400g of Carbendazim 12% + Mancozeb 63% WP in 200 Litres clean water.',
        'Stir into smooth solution and spray uniformly on foliage.'
      ],
      dosagePerAcre: '400g in 200L water per acre',
      precautions: 'Spray in early morning before leaves close.'
    },
    recommendedProducts: [
      { id: 'prod-d13', name: 'Carbendazim + Mancozeb 75% WP (500g)', unitPrice: 320, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 70, pack: '500g pack' },
      { id: 'prod-d14', name: 'Tebuconazole 25.9% EC (250ml)', unitPrice: 490, storeId: 'store-2', storeName: 'Marriguda Rythu Seva Agri Kendra', stock: 30, pack: '250ml bottle' }
    ]
  }
];
