// ============================================================
// Livestock Advisory, Health Management & Enterprise Data Model
// ============================================================

export { INITIAL_LIVESTOCK_SHOPS, livestockShops } from './livestockShops';
export { DEFAULT_LIVESTOCK_PRODUCTS, livestockProducts, livestockProductCategories } from './livestockProducts';

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
