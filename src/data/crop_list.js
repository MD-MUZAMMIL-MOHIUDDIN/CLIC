// ============================================================
// Master Crop List Data for CLIC (Category-Linked)
// ============================================================

export const DEFAULT_CROP_LIST = [
  // ==========================================
  // 1. CEREALS (ధాన్యాలు)
  // ==========================================
  { id: 1, categoryId: 1, categoryCode: 'CEREALS', code: 'PADDY', name: 'Paddy (Rice)', telugu: 'వరి' },
  { id: 2, categoryId: 1, categoryCode: 'CEREALS', code: 'MAIZE', name: 'Maize (Corn)', telugu: 'మొక్కజొన్న' },
  { id: 3, categoryId: 1, categoryCode: 'CEREALS', code: 'WHEAT', name: 'Wheat', telugu: 'గోధుమ' },
  { id: 4, categoryId: 1, categoryCode: 'CEREALS', code: 'JOWAR', name: 'Jowar (Sorghum)', telugu: 'జొన్నలు' },
  { id: 5, categoryId: 1, categoryCode: 'CEREALS', code: 'BAJRA', name: 'Bajra (Pearl Millet)', telugu: 'సజ్జలు' },

  // ==========================================
  // 2. PULSES (పప్పుధాన్యాలు)
  // ==========================================
  { id: 6, categoryId: 2, categoryCode: 'PULSES', code: 'RED_GRAM', name: 'Red Gram (Pigeonpea / Tur Dal)', telugu: 'కందులు' },
  { id: 7, categoryId: 2, categoryCode: 'PULSES', code: 'BENGAL_GRAM', name: 'Bengal Gram (Chickpea / Chana)', telugu: 'శనగలు' },
  { id: 8, categoryId: 2, categoryCode: 'PULSES', code: 'GREEN_GRAM', name: 'Green Gram (Moong Dal)', telugu: 'పెసలు' },
  { id: 9, categoryId: 2, categoryCode: 'PULSES', code: 'BLACK_GRAM', name: 'Black Gram (Urad Dal)', telugu: 'మినుములు' },
  { id: 10, categoryId: 2, categoryCode: 'PULSES', code: 'COWPEA', name: 'Cowpea (Alasandalu)', telugu: 'అలసందలు' },
  { id: 11, categoryId: 2, categoryCode: 'PULSES', code: 'HORSE_GRAM', name: 'Horse Gram (Ulavalu)', telugu: 'ఉలవలు' },

  // ==========================================
  // 3. OILSEEDS (నూనెగింజలు)
  // ==========================================
  { id: 12, categoryId: 3, categoryCode: 'OILSEEDS', code: 'GROUNDNUT', name: 'Groundnut (Peanut)', telugu: 'వేరుశనగ' },
  { id: 13, categoryId: 3, categoryCode: 'OILSEEDS', code: 'SUNFLOWER', name: 'Sunflower', telugu: 'పొద్దుతిరుగుడు' },
  { id: 14, categoryId: 3, categoryCode: 'OILSEEDS', code: 'SESAME', name: 'Sesame (Til / Gingelly)', telugu: 'నువ్వులు' },
  { id: 15, categoryId: 3, categoryCode: 'OILSEEDS', code: 'MUSTARD', name: 'Mustard', telugu: 'ఆవాలు' },
  { id: 16, categoryId: 3, categoryCode: 'OILSEEDS', code: 'SOYBEAN', name: 'Soybean', telugu: 'సోయాబీన్' },
  { id: 17, categoryId: 3, categoryCode: 'OILSEEDS', code: 'CASTOR', name: 'Castor', telugu: 'ఆముదం' },

  // ==========================================
  // 4. CASH CROPS (వాణిజ్య పంటలు)
  // ==========================================
  { id: 18, categoryId: 4, categoryCode: 'CASH_CROPS', code: 'COTTON', name: 'Cotton (Bt / Desi)', telugu: 'పత్తి' },
  { id: 19, categoryId: 4, categoryCode: 'CASH_CROPS', code: 'SUGARCANE', name: 'Sugarcane', telugu: 'చెరకు' },
  { id: 20, categoryId: 4, categoryCode: 'CASH_CROPS', code: 'CHILLI', name: 'Chilli (Red Pepper)', telugu: 'మిరప' },
  { id: 21, categoryId: 4, categoryCode: 'CASH_CROPS', code: 'TURMERIC', name: 'Turmeric', telugu: 'పసుపు' },
  { id: 22, categoryId: 4, categoryCode: 'CASH_CROPS', code: 'TOBACCO', name: 'Tobacco', telugu: 'పొగాకు' },

  // ==========================================
  // 5. MILLETS (చిరుధాన్యాలు)
  // ==========================================
  { id: 23, categoryId: 5, categoryCode: 'MILLETS', code: 'FOXTAIL_MILLET', name: 'Foxtail Millet (Korra)', telugu: 'కొర్రలు' },
  { id: 24, categoryId: 5, categoryCode: 'MILLETS', code: 'FINGER_MILLET', name: 'Finger Millet (Ragi)', telugu: 'రాగులు' },
  { id: 25, categoryId: 5, categoryCode: 'MILLETS', code: 'LITTLE_MILLET', name: 'Little Millet (Samalu)', telugu: 'సామలు' },
  { id: 26, categoryId: 5, categoryCode: 'MILLETS', code: 'KODO_MILLET', name: 'Kodo Millet (Arikelu)', telugu: 'అరికెలు' },
  { id: 27, categoryId: 5, categoryCode: 'MILLETS', code: 'BARNYARD_MILLET', name: 'Barnyard Millet (Oodalu)', telugu: 'ఊదలు' },
  { id: 28, categoryId: 5, categoryCode: 'MILLETS', code: 'PROSO_MILLET', name: 'Proso Millet (Varigalu)', telugu: 'వరిగలు' },

  // ==========================================
  // 6. HORTICULTURE & VEGETABLES (కూరగాయలు & పండ్లు)
  // ==========================================
  { id: 29, categoryId: 6, categoryCode: 'HORTICULTURE', code: 'TOMATO', name: 'Tomato', telugu: 'టమోటా' },
  { id: 30, categoryId: 6, categoryCode: 'HORTICULTURE', code: 'ONION', name: 'Onion', telugu: 'ఉల్లిపాయ' },
  { id: 31, categoryId: 6, categoryCode: 'HORTICULTURE', code: 'BHENDI', name: 'Bhendi (Okra / Lady Finger)', telugu: 'బెండకాయ' },
  { id: 32, categoryId: 6, categoryCode: 'HORTICULTURE', code: 'BRINJAL', name: 'Brinjal (Eggplant)', telugu: 'వంకాయ' },
  { id: 33, categoryId: 6, categoryCode: 'HORTICULTURE', code: 'MANGO', name: 'Mango (Orchard)', telugu: 'మామిడి' },
  { id: 34, categoryId: 6, categoryCode: 'HORTICULTURE', code: 'SWEET_LIME', name: 'Sweet Lime (Mosambi)', telugu: 'బత్తాయి' },
  { id: 35, categoryId: 6, categoryCode: 'HORTICULTURE', code: 'BANANA', name: 'Banana', telugu: 'అరటి' },

  // ==========================================
  // 7. SPICES (సుగంధ ద్రవ్యాలు)
  // ==========================================
  { id: 36, categoryId: 7, categoryCode: 'SPICES', code: 'CORIANDER', name: 'Coriander (Dhania)', telugu: 'ధనియాలు' },
  { id: 37, categoryId: 7, categoryCode: 'SPICES', code: 'CUMIN', name: 'Cumin (Jeera)', telugu: 'జీలకర్ర' },
  { id: 38, categoryId: 7, categoryCode: 'SPICES', code: 'GINGER', name: 'Ginger (Adrak)', telugu: 'అల్లం' },
  { id: 39, categoryId: 7, categoryCode: 'SPICES', code: 'GARLIC', name: 'Garlic (Lahsun)', telugu: 'వెల్లుల్లి' }
];

export default DEFAULT_CROP_LIST;
