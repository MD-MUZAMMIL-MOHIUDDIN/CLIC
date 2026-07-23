// ============================================================
// Mock Data – Government Schemes
// ============================================================

export const schemes = [
  {
    id: 1,
    category: 'Income Support',
    name: 'PM-KISAN Samman Nidhi',
    benefit: '₹6,000/year (3 installments of ₹2,000)',
    eligibility: 'All small and marginal farmers owning cultivable land',
    applicationMode: 'Online / CSC / Agriculture Office',
    status: 'Active',
    deadline: 'No deadline – ongoing',
    documents: ['Aadhaar Card', 'Land Records (Pahani)', 'Bank Passbook', 'Mobile Number'],
    helpline: '155261',
    description: 'Direct income support of ₹6,000/year to farmer families. Amount transferred directly to bank accounts in 3 installments.',
    link: 'https://pmkisan.gov.in',
    supportDoc: 'https://pmkisan.gov.in/Documents/PMKISANManual.pdf'
  },
  {
    id: 2,
    category: 'Crop Insurance',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    benefit: 'Insurance cover up to sum insured; premium 2% for Kharif',
    eligibility: 'All farmers growing notified crops in notified areas',
    applicationMode: 'Through bank / CSC within cut-off date',
    status: 'Active – Enrol by Aug 31',
    deadline: 'August 31, 2025',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Sowing Certificate'],
    helpline: '14447',
    description: 'Comprehensive crop insurance covering sowing failure, mid-season adversity, post-harvest losses. Premium subsidized by government.',
    link: 'https://pmfby.gov.in',
    supportDoc: 'https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf'
  },
  {
    id: 3,
    category: 'Subsidies',
    name: 'RKVY – Soil Health Card',
    benefit: 'Free soil testing & nutrient recommendations',
    eligibility: 'All farmers',
    applicationMode: 'At Village Agriculture Assistants office',
    status: 'Active',
    deadline: 'Ongoing',
    documents: ['Aadhaar Card', 'Land Records'],
    helpline: '1800-180-1551',
    description: 'Free soil testing every 2 years. Provides crop-wise recommendations for nutrients and micro-nutrients based on your actual soil.',
    link: 'https://soilhealth.dac.gov.in',
    supportDoc: 'https://soilhealth.dac.gov.in/assets/Manual.pdf'
  },
  {
    id: 4,
    category: 'Animal Husbandry',
    name: 'NABARD Dairy Entrepreneurship Scheme',
    benefit: 'Subsidy of 25-33% on project cost (₹2.5L–₹3.3L max)',
    eligibility: 'Farmers, SHGs, NGOs with dairy units',
    applicationMode: 'Through Nationalized Banks / RRBs',
    status: 'Active',
    deadline: 'Ongoing',
    documents: ['Aadhaar', 'Project Report', 'Land Documents', 'Bank Statements'],
    helpline: '022-26539895',
    description: 'Capital subsidy for setting up dairy units, milch animal purchase, milk processing units. Promotes backyard dairy farming.',
    link: 'https://nabard.org',
    supportDoc: 'https://www.nabard.org/auth/writereaddata/File/DAIRY%20SCHEME.pdf'
  },
  {
    id: 5,
    category: 'Subsidies',
    name: 'National Food Security Mission (NFSM)',
    benefit: 'Seed subsidy, equipment subsidy up to 50%',
    eligibility: 'Farmers growing rice, wheat, pulses, coarse cereals',
    applicationMode: 'Agriculture Extension Officer at Mandal HQ',
    status: 'Active',
    deadline: 'Seasonal',
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
    helpline: '011-23381513',
    description: 'Subsidized certified seeds, demonstration plots, farm machinery and improved technology for food grain crops.',
    link: 'https://nfsm.gov.in',
    supportDoc: 'https://nfsm.gov.in/Guidelines/Guidelines_NFSM_2023.pdf'
  },
  {
    id: 6,
    category: 'Natural Farming',
    name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    benefit: '₹31,500/hectare over 3 years for cluster certification',
    eligibility: 'Farmer clusters (minimum 50 farmers, 50 acres)',
    applicationMode: 'District Agriculture Officer',
    status: 'Active',
    deadline: 'November 30, 2025',
    documents: ['Farmer Group Registration', 'Individual Aadhaar & Land Records', 'Bank Account'],
    helpline: '011-23382477',
    description: 'Promotes organic/natural farming through cluster-based approach. Covers inputs, certification, marketing linkage.',
    link: 'https://pgsindia-ncof.gov.in',
    supportDoc: 'https://pgsindia-ncof.gov.in/PKVY_Guidelines.pdf'
  },
];

export const schemeCategories = ['All', 'Income Support', 'Crop Insurance', 'Subsidies', 'Animal Husbandry', 'Natural Farming'];

// Application Tracker Mock Data
export const applications = [
  { id: 'APP-2025-0341', scheme: 'PM-KISAN Samman Nidhi', applied: 'Jun 10, 2025', status: 'Approved', amount: '₹2,000', steps: ['Submitted', 'Verified', 'Approved', 'Disbursed'] },
  { id: 'APP-2025-0287', scheme: 'PMFBY – Kharif 2025', applied: 'Jul 5, 2025', status: 'Under Review', amount: 'TBD', steps: ['Submitted', 'Verified', 'Under Review'] },
  { id: 'APP-2025-0190', scheme: 'Soil Health Card', applied: 'May 22, 2025', status: 'Completed', amount: 'Free', steps: ['Submitted', 'Soil Sample Collected', 'Lab Testing', 'Card Issued'] },
];
