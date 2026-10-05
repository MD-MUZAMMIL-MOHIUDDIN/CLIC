// ============================================================
// Livestock Advisory, Health Management & Enterprise Data Model
// ============================================================

export { INITIAL_LIVESTOCK_SHOPS, livestockShops } from './livestockShops';
export { DEFAULT_LIVESTOCK_PRODUCTS, livestockProducts, livestockProductCategories } from './livestockProducts';

export const LIVESTOCK_ANIMALS = [
  {
    id: 'cattle',
    name: 'Cattle & Dairy Buffalo',
    telugu: 'పాడి పశువులు (ఆవులు & గేదెలు)',
    icon: '🐄',
    speciesList: 'Jersey, HF Cross, Sahiwal, Gir, Ongole, Murrah Buffalo',
    feedingNorms: '25-30 kg green fodder, 5-6 kg dry fodder, 2-3 kg fortified concentrate feed daily',
    waterReq: '50 - 70 Litres clean drinking water per day',
    thumbnail: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'goat_sheep',
    name: 'Goat & Sheep (Small Ruminants)',
    telugu: 'మేకలు & గొర్రెలు',
    icon: '🐐',
    speciesList: 'Nellore Brown, Deccani, Osmanabadi, Boer Cross',
    feedingNorms: '6-8 hours daily grazing + 250g concentrate feed + mineral lick block',
    waterReq: '5 - 8 Litres fresh water daily',
    thumbnail: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'poultry',
    name: 'Poultry (Backyard Desi & Broiler)',
    telugu: 'కోళ్లు (నాటు & బ్రాయిలర్)',
    icon: '🐓',
    speciesList: 'Rajashri, Vanaraja, Kadaknath, Aseel, Commercial Broiler',
    feedingNorms: 'Chick starter mash (0-4 wks) followed by grower/scavenging grains',
    waterReq: 'Continuous ad libitum clean cool water with electrolytes during summer',
    thumbnail: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'
  }
];

export const LIVESTOCK_DISEASES = [
  {
    id: 'ld-1',
    animalId: 'cattle',
    name: 'Mastitis / Udder Inflammation (Gundu Vapu)',
    telugu: 'పొదుగు వాపు వ్యాధి (మస్టిటిస్)',
    icon: '🥛',
    severity: 'High (Severe Milk Loss & Teat Damage)',
    pathogen: 'Bacterial (Streptococcus agalactiae, Staphylococcus aureus)',
    symptoms: [
      'Severe swelling, redness, heat, and intense pain in one or more udder quarters',
      'Milk turning watery, yellowish, blood-tinged, or containing thick curd-like clots',
      'High body fever (104°F - 106°F) and animal refusing to let calves nurse or be milked',
      'Hardening and fibrosis of teat tissues leading to permanent quarter blindness'
    ],
    diagnosisText: 'Mastitis is primarily caused by unhygienic milking floors, dirty milkers hands, and failure to apply post-milking teat dips. The California Mastitis Test (CMT) enables early sub-clinical detection.',
    controlMeasures: [
      'Dip teats immediately after every milking in 0.5% Iodine Teat Dip Solution using non-return cup',
      'Wash udder with warm Potassium Permanganate solution (1:1000) before milking with clean cloth',
      'Administer Herbal Mastitis bolus (Masti-Plus) 2 bolus twice daily for 5 days',
      'Complete milking of infected quarter into separate bowl and consult veterinary surgeon for intramammary infusion'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Mastitis Early Detection (CMT Test), Teat Dip Application & Hygiene Guide',
    linkedProducts: [
      {
        id: 'lsp-1',
        name: 'Teat Dip Disinfectant Cup & 0.5% Available Iodine Solution',
        telugu: 'పొదుగు వాపు నివారణ ద్రావణం & కప్',
        category: 'Dairy Equipment',
        price: 240,
        unit: '500ml kit',
        stock: 40,
        dosage: 'Dip teats immediately after morning & evening milking',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopId: 'ls-shop-1',
        shopPhone: '9876511223'
      },
      {
        id: 'lsp-2',
        name: 'Chelated Area-Specific Mineral Mixture (Bio-Available)',
        telugu: 'పశువుల ఖనిజ లవణ మిశ్రమం',
        category: 'Health & Minerals',
        price: 180,
        unit: '1kg pack',
        stock: 120,
        dosage: '50g daily per cow mixed with concentrate',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopId: 'ls-shop-1',
        shopPhone: '9876511223'
      }
    ]
  },
  {
    id: 'ld-2',
    animalId: 'cattle',
    name: 'Foot and Mouth Disease (FMD / Gali Kuntu)',
    telugu: 'గాలి కుంటు వ్యాధి (FMD)',
    icon: '🦶',
    severity: 'Extremely Contagious (National Surveillance)',
    pathogen: 'Aphthovirus (Picornaviridae Family, Types O, A, Asia-1)',
    symptoms: [
      'Profuse ropy salivation and smacking sound of lips',
      'Painful fluid-filled blisters/vesicles on tongue, gums, muzzle, and interdigital cleft of hooves',
      'Severe lameness and inability to walk or graze',
      'Drastic reduction in milk yield and high fever'
    ],
    diagnosisText: 'FMD spreads rapidly through aerosols, shared water troughs, and farm visitors. Prompt quarantine and ring vaccination are vital to contain outbreak.',
    controlMeasures: [
      'Prophylactic vaccination twice a year (Pre-monsoon in May and Pre-winter in November)',
      'Wash mouth lesions with 1% Alum or 0.1% Potassium Permanganate solution',
      'Apply herbal antiseptic fly-repellent wound spray on foot lesions to prevent maggot infestation',
      'Quarantine infected animals immediately in dry shed and isolate feeding troughs'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'FMD Foot & Mouth Lesion Care, Alum Wash & Biosecurity Protocol',
    linkedProducts: [
      {
        id: 'lsp-3',
        name: 'Antiseptic Fly Repellent & Wound Healing Aerosol Spray',
        telugu: 'పుండ్ల స్ప్రే & ఈగల నివారిణి',
        category: 'Dewormers & Medicine',
        price: 130,
        unit: '100ml aerosol',
        stock: 75,
        dosage: 'Spray twice daily on foot and hoof lesions',
        shopName: 'Deccan Small Ruminants & Fodder Mart',
        shopId: 'ls-shop-2',
        shopPhone: '9848099334'
      }
    ]
  },
  {
    id: 'ld-3',
    animalId: 'cattle',
    name: 'Acute Rumen Bloat / Tympany (Kadupu Ubbam)',
    telugu: 'కడుపు ఉబ్బరం (బ్లోట్)',
    icon: '💨',
    severity: 'Emergency (Can Cause Asphyxiation)',
    pathogen: 'Non-Infectious (Excessive fermentation of lush green legumes / grain overload)',
    symptoms: [
      'Sudden swelling and tight drum-like distension of left flank (Rumen)',
      'Animal showing severe discomfort, kicking at belly, and groaning',
      'Labored breathing with open mouth, extended neck, and tongue protruding',
      'Frequent urination and sudden collapse if pressure is not relieved'
    ],
    diagnosisText: 'Frothy bloat happens when cattle graze heavily on wet young lucerne, berseem, or cowpea. Stable foam traps fermentation gases inside rumen.',
    controlMeasures: [
      'Drench 50-100 ml Turpentine Oil mixed with 500 ml Linseed or Groundnut Oil immediately',
      'Place a wooden gag in animal mouth to stimulate continuous chewing and belching',
      'Keep animal standing with front quarters elevated; walk gently',
      'In extreme emergency, call veterinarian for trocar & cannula rumen puncture'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Emergency Bloat Relief Drenching Technique & Rumen Gas Decompression',
    linkedProducts: [
      {
        id: 'lsp-4',
        name: 'Fortified Cattle Feed Pellets (High Fiber & Buffer Mix)',
        telugu: 'మేలైన పశువుల దాణా (22% బైపాస్ ప్రోటీన్)',
        category: 'Feed & Fodder',
        price: 1150,
        unit: '50kg bag',
        stock: 80,
        dosage: '3 - 4 kg daily per milch cow',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopId: 'ls-shop-1',
        shopPhone: '9876511223'
      }
    ]
  },
  {
    id: 'ld-4',
    animalId: 'goat_sheep',
    name: 'PPR (Peste des Petits Ruminants / Goat Plague)',
    telugu: 'పీ.పీ.ఆర్ వ్యాధి (మేకల ప్లేగు)',
    icon: '🐐',
    severity: 'Fatal (Up to 90% Mortality in Unvaccinated Flocks)',
    pathogen: 'Morbillivirus (Paramyxoviridae Family)',
    symptoms: [
      'High fever (105°F - 107°F) with crusty discharge from eyes and nose',
      'Foul-smelling sores and necrotic erosion inside mouth and gums',
      'Severe profuse watery to bloody diarrhea causing rapid dehydration',
      'Severe pneumonia, coughing, and rapid deaths across young kids and lambs'
    ],
    diagnosisText: 'PPR is the single most destructive disease of sheep and goats in semi-arid zones. Airborne transmission occurs through close contact at village grazing lands.',
    controlMeasures: [
      'Vaccinate all sheep and goats aged above 3 months with PPR live vaccine (provides 3 years immunity)',
      'Strict quarantine of newly purchased livestock for 21 days before joining resident flock',
      'Oral rehydration therapy with electrolytes + supportive broad-spectrum antibiotic injection under veterinary guidance'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'PPR Goat Plague Symptoms, Ring Vaccination & Supportive Care',
    linkedProducts: [
      {
        id: 'lsp-5',
        name: 'Mineral & Salt Lick Block for Sheep & Goat',
        telugu: 'గొర్రెలు & మేకల సాల్ట్ లిక్ బ్లాక్',
        category: 'Health & Minerals',
        price: 95,
        unit: '2kg block',
        stock: 90,
        dosage: 'Free-choice licking in shed',
        shopName: 'Deccan Small Ruminants & Fodder Mart',
        shopId: 'ls-shop-2',
        shopPhone: '9848099334'
      },
      {
        id: 'lsp-6',
        name: 'Broad-Spectrum Deworming Suspension (Albendazole 2.5%)',
        telugu: 'నట్టల నివారణ మందు (ఆల్బెండజోల్)',
        category: 'Dewormers & Medicine',
        price: 140,
        unit: '500ml bottle',
        stock: 100,
        dosage: '5-7.5 mg/kg body weight pre-monsoon',
        shopName: 'Deccan Small Ruminants & Fodder Mart',
        shopId: 'ls-shop-2',
        shopPhone: '9848099334'
      }
    ]
  },
  {
    id: 'ld-5',
    animalId: 'poultry',
    name: 'Ranikhet Disease (Newcastle Disease / Kokkera Rogam)',
    telugu: 'రాణీఖేత్ వ్యాధి (కొక్కెర రోగం)',
    icon: '🐓',
    severity: 'Extremely Lethal (100% Flock Wipeout)',
    pathogen: 'Avian Paramyxovirus Serotype 1 (APMV-1)',
    symptoms: [
      'Gasping, coughing, sneezing, and whistling respiratory sounds',
      'Greenish watery diarrhea with soiled vent feathers',
      'Twisting of head and neck (Torticolis / Star-gazing posture) and wing paralysis',
      'Sudden death of healthy-looking birds with high morning mortality'
    ],
    diagnosisText: 'Ranikhet is an acute viral pathogen spread by wild birds and infected air. There is NO curative treatment once birds develop nervous torticollis signs; prevention through cold-chain vaccination is mandatory.',
    controlMeasures: [
      'Day 5-7: Administer F1 / LaSota live vaccine (1 drop in eye/nostril)',
      'Day 21: Booster dose of LaSota vaccine in drinking water',
      'Week 8-9: Administer Ranikhet R2B / Mukteswar strain subcutaneous injection',
      'Provide Vitamin AD3E + C in drinking water to mitigate vaccine stress and heat prostration'
    ],
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Ranikhet Disease Eye-Drop Vaccine Administration Demonstration',
    linkedProducts: [
      {
        id: 'lsp-7',
        name: 'Ranikhet (LaSota) & IBD Vaccine Cold-Chain Kit',
        telugu: 'రాణీఖేత్ & గంబోరో టీకాలు (కోల్డ్ చైన్)',
        category: 'Dewormers & Medicine',
        price: 220,
        unit: 'Kit (100 doses)',
        stock: 30,
        dosage: '1 drop per chick at Day 7 & Day 21',
        shopName: 'Telangana Backyard Poultry & Pashu Seva Kendra',
        shopId: 'ls-shop-3',
        shopPhone: '9848123889'
      },
      {
        id: 'lsp-8',
        name: 'Poultry Electrolyte & Anti-Heat Stress Vitamin C Formulation',
        telugu: 'ఎండ తీవ్రత నివారణ ఎలక్ట్రోలైట్ & విటమిన్ సి',
        category: 'Health & Minerals',
        price: 110,
        unit: '200g pouch',
        stock: 60,
        dosage: '1g per 2 litres drinking water',
        shopName: 'Telangana Backyard Poultry & Pashu Seva Kendra',
        shopId: 'ls-shop-3',
        shopPhone: '9848123889'
      }
    ]
  }
];

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

export default livestock;
