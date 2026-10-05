// ============================================================
// Disease Prescriptions & Walk-in Diagnosis Data Model
// ============================================================

export const INITIAL_DISEASE_PRESCRIPTIONS = [
  {
    id: 'RX-FISH-2026-001',
    theme: 'fish',
    date: '2026-09-29',
    time: '11:30 AM',
    farmerId: 'f1',
    farmerName: 'Ramu Farmer',
    farmerTelugu: 'రాము రెడ్డి',
    farmerPhone: '9876543210',
    village: 'Chandampet',
    district: 'Nalgonda',
    pondArea: '1.5 Acres (Pond #2)',
    query: 'Fish showing white-red ulcer spots on skin and gasping near surface in the morning.',
    speciesId: 'carps',
    speciesName: 'Indian Major Carps (Catla, Rohu, Mrigal)',
    diseaseId: 'fd-1',
    diseaseName: 'Epizootic Ulcerative Syndrome (EUS / Red Spot Disease)',
    diseaseTelugu: 'ఎరుపు మచ్చల వ్యాధి (EUS)',
    severity: 'High (Mass Mortality)',
    pathogen: 'Fungal (Aphanomyces invadans) + Aeromonas Bacteria',
    controlMeasures: [
      'Apply CIFAX formulation @ 250 ml/acre-meter pond water depth',
      'Apply Quick Lime (CaO) @ 150 kg/acre to raise pond pH to 8.0',
      'Stop organic manuring and net dragging immediately'
    ],
    prescribedProducts: [
      {
        id: 'fp-1',
        name: 'CIFAX Aquaculture Ulcer Cure Formulation',
        quantity: 2,
        price: 450,
        unit: '1 Litre bottle',
        shopId: 'ls-shop-1',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopPhone: '9876511223',
        dosage: '250 ml per acre-meter'
      },
      {
        id: 'fp-3',
        name: 'Quick Lime (CaO) Fish Grade High Calcium 85%',
        quantity: 3,
        price: 320,
        unit: '50kg bag',
        shopId: 'ls-shop-2',
        shopName: 'Deccan Small Ruminants & Fodder Mart',
        shopPhone: '9848099334',
        dosage: '100 - 150 kg per acre'
      }
    ],
    totalAmount: 1860,
    status: 'Completed & Dispensed',
    stage: 'final_closed',
    shopAlertStatus: 'Acknowledged & Packed',
    farmerAlertStatus: 'Delivered via SMS',
    facilitatorName: 'Suresh Babu (CLIC Chandampet)'
  },
  {
    id: 'RX-LS-2026-002',
    theme: 'livestock',
    date: '2026-09-30',
    time: '09:45 AM',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerTelugu: 'ఎల్లయ్య గౌడ్',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    livestockDetails: '3 Murrah Buffaloes + 2 Jersey Cross Cows',
    query: 'Cow has acute udder swelling on right quarter with watery clotted milk and fever.',
    speciesId: 'cattle',
    speciesName: 'Cattle & Dairy Buffalo',
    diseaseId: 'ld-1',
    diseaseName: 'Mastitis / Udder Inflammation (Gundu Vapu)',
    diseaseTelugu: 'పొదుగు వాపు వ్యాధి (మస్టిటిస్)',
    severity: 'High',
    pathogen: 'Bacterial (Streptococcus agalactiae, S. aureus)',
    controlMeasures: [
      'Dip teats immediately after every milking in 0.5% Iodine Teat Dip Solution',
      'Wash udder with warm Potassium Permanganate solution (1:1000)',
      'Administer Area-Specific Chelated Mineral Mixture @ 50g daily'
    ],
    prescribedProducts: [
      {
        id: 'lsp-1',
        name: 'Teat Dip Disinfectant Cup & 0.5% Available Iodine Solution',
        quantity: 1,
        price: 240,
        unit: '500ml kit',
        shopId: 'ls-shop-1',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopPhone: '9876511223',
        dosage: 'Dip teats after morning & evening milking'
      },
      {
        id: 'lsp-2',
        name: 'Chelated Area-Specific Mineral Mixture (Bio-Available)',
        quantity: 2,
        price: 180,
        unit: '1kg pack',
        shopId: 'ls-shop-1',
        shopName: 'Gokulam Dairy & Livestock Inputs Hub',
        shopPhone: '9876511223',
        dosage: '50g daily per cow mixed with concentrate'
      }
    ],
    totalAmount: 600,
    status: 'Alert Dispatched to LS Shop',
    stage: 'alert_dispatched',
    shopAlertStatus: 'Pending Confirmation',
    farmerAlertStatus: 'Delivered via SMS',
    facilitatorName: 'Suresh Babu (CLIC Chandampet)'
  }
];

export const INITIAL_DISEASE_ALERTS = [
  {
    id: 'ALT-DX-101',
    prescriptionId: 'RX-FISH-2026-001',
    type: 'shop_acknowledgement',
    sender: 'Gokulam Dairy & Livestock Inputs Hub',
    recipient: 'CLIC Facilitator Desk & Farmer Ramu',
    message: 'Prescription Order #RX-FISH-2026-001 ready! CIFAX (2L) reserved for Farmer Ramu. Ready for immediate pickup.',
    timestamp: '2026-09-29 11:42 AM',
    status: 'Delivered',
    icon: '📦'
  },
  {
    id: 'ALT-DX-102',
    prescriptionId: 'RX-LS-2026-002',
    type: 'dispatch_to_shop',
    sender: 'CLIC Chandampet Facilitator',
    recipient: 'Gokulam Dairy & Livestock Inputs Hub (9876511223)',
    message: 'New Veterinary Rx from CLIC: Farmer Yellaiah Goud (9848123456) needs Teat Dip Kit + 2kg Chelated Mineral Mixture for Mastitis.',
    timestamp: '2026-09-30 09:46 AM',
    status: 'Sent',
    icon: '📲'
  },
  {
    id: 'ALT-DX-103',
    prescriptionId: 'RX-LS-2026-002',
    type: 'farmer_advisory_sms',
    sender: 'CLIC Diagnosis System',
    recipient: 'Farmer Yellaiah Goud (9848123456)',
    message: 'CLIC Diagnosis Rx: Mastitis (Udder Swelling) detected. Prescribed Teat Dip & Minerals ready at Gokulam Hub. Wash udder with warm water.',
    timestamp: '2026-09-30 09:47 AM',
    status: 'Delivered',
    icon: '📩'
  }
];
