// ============================================================
// Master Dropdown List Data for CLIC
// ============================================================

export const DEFAULT_DROPDOWN_LIST = [
  // ==========================================
  // 1. LAND_TYPE
  // ==========================================
  { id: 1, referenceType: 'LAND_TYPE', value: 'Mid-land', text: 'Mid Land', telugu: 'మధ్యస్థ నేలలు' },
  { id: 2, referenceType: 'LAND_TYPE', value: 'Upper-midland', text: 'Upper-mid land', telugu: 'ఎగువ మధ్యస్థ నేలలు' },
  { id: 3, referenceType: 'LAND_TYPE', value: 'Upland', text: 'Upland', telugu: 'మెట్ట / ఎగువ భూమి' },
  { id: 4, referenceType: 'LAND_TYPE', value: 'Wetland', text: 'Wetland', telugu: 'తరి నేలలు' },
  { id: 5, referenceType: 'LAND_TYPE', value: 'Dryland', text: 'Dryland', telugu: 'మెట్ట నేలలు' },
  { id: 6, referenceType: 'LAND_TYPE', value: 'Garden Land', text: 'Garden Land', telugu: 'తోట భూమి' },
  { id: 7, referenceType: 'LAND_TYPE', value: 'Rainfed', text: 'Rainfed', telugu: 'వర్షాధార భూమి' },

  // ==========================================
  // 2. SOIL_TYPE
  // ==========================================
  { id: 8, referenceType: 'SOIL_TYPE', value: 'Sandy', text: 'Sandy', telugu: 'ఇసుక నేలలు' },
  { id: 9, referenceType: 'SOIL_TYPE', value: 'Red', text: 'Red', telugu: 'ఎర్ర నేలలు' },
  { id: 10, referenceType: 'SOIL_TYPE', value: 'Laterite', text: 'Laterite', telugu: 'లేటరైట్ నేలలు' },
  { id: 11, referenceType: 'SOIL_TYPE', value: 'Black Cotton', text: 'Black Cotton', telugu: 'నల్ల రేగడి నేలలు' },
  { id: 12, referenceType: 'SOIL_TYPE', value: 'Clay Loam', text: 'Clay Loam', telugu: 'బంక నేలలు' },
  { id: 13, referenceType: 'SOIL_TYPE', value: 'Alluvial', text: 'Alluvial', telugu: 'ఒండ్రు నేలలు' },
  { id: 14, referenceType: 'SOIL_TYPE', value: 'Saline Soil', text: 'Saline Soil', telugu: 'చౌడు నేలలు' },

  // ==========================================
  // 3. SEASON
  // ==========================================
  { id: 15, referenceType: 'SEASON', value: 'Kharif', text: 'Kharif', telugu: 'ఖరీఫ్ (జూన్ - అక్టోబర్)' },
  { id: 16, referenceType: 'SEASON', value: 'Rabi', text: 'Rabi', telugu: 'రబీ (నవంబర్ - మార్చి)' },
  { id: 17, referenceType: 'SEASON', value: 'Zaid', text: 'Zaid', telugu: 'వేసవి / జైద్ (మార్చి - మే)' },
  { id: 18, referenceType: 'SEASON', value: 'Annual', text: 'Annual', telugu: 'వార్షిక / శాశ్వత' },

  // ==========================================
  // 4. OPERATION_TYPE
  // ==========================================
  { id: 19, referenceType: 'OPERATION_TYPE', value: 'Tillage', text: 'Tillage', telugu: 'దుక్కి / భూమి తయారీ' },
  { id: 20, referenceType: 'OPERATION_TYPE', value: 'Sowing', text: 'Sowing', telugu: 'విత్తడం / నాట్లు' },
  { id: 21, referenceType: 'OPERATION_TYPE', value: 'Plant Protection', text: 'Plant Protection', telugu: 'సస్యరక్షణ & స్ప్రేయింగ్' },
  { id: 22, referenceType: 'OPERATION_TYPE', value: 'Harvesting', text: 'Harvesting', telugu: 'కోత యంత్రాలు' },

  // ==========================================
  // 5. PURPOSE_OF_CONCOCTION
  // ==========================================
  { id: 23, referenceType: 'PURPOSE_OF_CONCOCTION', value: 'Pest Repellent', text: 'Pest Repellent', telugu: 'కీటక నివారణ' },
  { id: 24, referenceType: 'PURPOSE_OF_CONCOCTION', value: 'Disease Control', text: 'Disease Control', telugu: 'తెగుళ్ల నివారణ' },
  { id: 25, referenceType: 'PURPOSE_OF_CONCOCTION', value: 'Soil Fertility', text: 'Soil Fertility', telugu: 'నేల సారవంతం' },
  { id: 26, referenceType: 'PURPOSE_OF_CONCOCTION', value: 'Growth Promoter', text: 'Growth Promoter', telugu: 'మొక్కల పెరుగుదల' },
  { id: 27, referenceType: 'PURPOSE_OF_CONCOCTION', value: 'Seed Treatment', text: 'Seed Treatment', telugu: 'విత్తన శుద్ధి' },
  { id: 28, referenceType: 'PURPOSE_OF_CONCOCTION', value: 'Flower & Fruit Setting', text: 'Flower & Fruit Setting', telugu: 'పూత, పిందె నిలుపుదల' },

  // ==========================================
  // 6. CONCOCTION_NAME
  // ==========================================
  { id: 29, referenceType: 'CONCOCTION_NAME', value: 'Jeevamrutham', text: 'Jeevamrutham', telugu: 'జీవామృతం' },
  { id: 30, referenceType: 'CONCOCTION_NAME', value: 'Ghanajeevamrutham', text: 'Ghanajeevamrutham', telugu: 'ఘనజీవామృతం' },
  { id: 31, referenceType: 'CONCOCTION_NAME', value: 'Beejamrutham', text: 'Beejamrutham', telugu: 'బీజామృతం' },
  { id: 32, referenceType: 'CONCOCTION_NAME', value: 'Neemastram', text: 'Neemastram', telugu: 'నీమాస్త్రం' },
  { id: 33, referenceType: 'CONCOCTION_NAME', value: 'Brahmastram', text: 'Brahmastram', telugu: 'బ్రహ్మాస్త్రం' },
  { id: 34, referenceType: 'CONCOCTION_NAME', value: 'Agniastram', text: 'Agniastram', telugu: 'అగ్నియాస్త్రం' },
  { id: 35, referenceType: 'CONCOCTION_NAME', value: 'Dashaparni Kashayam', text: 'Dashaparni Kashayam', telugu: 'దశపర్ణి కషాయం' },
  { id: 36, referenceType: 'CONCOCTION_NAME', value: 'Panchagavya', text: 'Panchagavya', telugu: 'పంచగవ్య' },

  // ==========================================
  // 7. APPLICATION_TYPE
  // ==========================================
  { id: 37, referenceType: 'APPLICATION_TYPE', value: 'Foliar Spray', text: 'Foliar Spray', telugu: 'ఆకులపై పిచికారీ' },
  { id: 38, referenceType: 'APPLICATION_TYPE', value: 'Soil Drenching', text: 'Soil Drenching', telugu: 'మొక్క మొదట్లో పోయడం' },
  { id: 39, referenceType: 'APPLICATION_TYPE', value: 'Seed Treatment', text: 'Seed Treatment', telugu: 'విత్తన శుద్ధి' },
  { id: 40, referenceType: 'APPLICATION_TYPE', value: 'Fertigation', text: 'Fertigation', telugu: 'నీటి కాల్వ / బిందు సేద్యం ద్వారా' },
  { id: 41, referenceType: 'APPLICATION_TYPE', value: 'Root Dipping', text: 'Root Dipping', telugu: 'నారు వేర్లు ముంచడం' },
  { id: 42, referenceType: 'APPLICATION_TYPE', value: 'Basal Application', text: 'Basal Application', telugu: 'నేలలో చల్లడం / కలియదున్నడం' },

  // ==========================================
  // 8. MACHINERY_OPERATION
  // ==========================================
  { id: 43, referenceType: 'MACHINERY_OPERATION', value: 'Land Prep', text: 'Land Preparation', telugu: 'భూమి తయారీ' },
  { id: 44, referenceType: 'MACHINERY_OPERATION', value: 'Sowing', text: 'Sowing & Planting', telugu: 'విత్తడం & నాట్లు' },
  { id: 45, referenceType: 'MACHINERY_OPERATION', value: 'Inter-Cultivation', text: 'Inter-Cultivation & Weeding', telugu: 'అంతర సాగు' },
  { id: 46, referenceType: 'MACHINERY_OPERATION', value: 'Spraying', text: 'Plant Protection & Spraying', telugu: 'సస్యరక్షణ & స్ప్రేయింగ్' },
  { id: 47, referenceType: 'MACHINERY_OPERATION', value: 'Harvesting', text: 'Harvesting', telugu: 'కోత యంత్రాలు' },
  { id: 48, referenceType: 'MACHINERY_OPERATION', value: 'Threshing', text: 'Threshing & Post-Harvest', telugu: 'నూర్పిడి & నిల్వ' },

  // ==========================================
  // 9. SUBSIDY_CATEGORY
  // ==========================================
  { id: 49, referenceType: 'SUBSIDY_CATEGORY', value: 'SF/MF', text: 'Small / Marginal Farmer (SF/MF)', telugu: 'చిన్న / సన్నకారు రైతు' },
  { id: 50, referenceType: 'SUBSIDY_CATEGORY', value: 'Women SHG', text: 'Women Farmer / SHG Collective', telugu: 'మహిళా రైతులు / స్వయం సహాయక సంఘాలు' },
  { id: 51, referenceType: 'SUBSIDY_CATEGORY', value: 'SC/ST', text: 'SC / ST Category Farmer', telugu: 'ఎస్సీ / ఎస్టీ రైతులు' },
  { id: 52, referenceType: 'SUBSIDY_CATEGORY', value: 'General', text: 'General / Large Farmer', telugu: 'సాధారణ రైతులు' },
  { id: 53, referenceType: 'SUBSIDY_CATEGORY', value: 'FPO/CHC', text: 'FPO / Custom Hiring Center (CHC)', telugu: 'రైతు ఉత్పత్తిదారుల సంఘం' },

  // ==========================================
  // 10. MEASUREMENT_UNIT
  // ==========================================
  { id: 54, referenceType: 'MEASUREMENT_UNIT', value: 'Quintal', text: 'Quintal (100 kg)', telugu: 'క్వింటాల్' },
  { id: 55, referenceType: 'MEASUREMENT_UNIT', value: 'Kilogram', text: 'Kilogram (kg)', telugu: 'కిలోగ్రాము' },
  { id: 56, referenceType: 'MEASUREMENT_UNIT', value: 'Acre', text: 'Acre (ac)', telugu: 'ఎకరం' },
  { id: 57, referenceType: 'MEASUREMENT_UNIT', value: 'Guntha', text: 'Guntha (1/40th acre)', telugu: 'గుంట' },
  { id: 58, referenceType: 'MEASUREMENT_UNIT', value: 'Litre', text: 'Litres (L)', telugu: 'లీటర్లు' }
];

export default DEFAULT_DROPDOWN_LIST;
