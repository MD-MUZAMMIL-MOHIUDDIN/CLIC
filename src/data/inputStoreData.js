// ============================================================
// Agri Input Stores & PACS Onboarding Directory Data
// ============================================================

export const INITIAL_INPUT_STORES = [
  {
    id: 'store-1',
    name: 'Chandampet PACS Bio-Input Center',
    inCharge: 'K. Ramchander Rao (Store Manager)',
    phone: '9876500112',
    email: 'inputs.chandampet@clic.in',
    role: 'store_manager',
    village: 'Chandampet',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    licenseNumber: 'TS-NLG-INP-2024-001',
    specialty: 'Bio-Fertilizers & Soil Amendments',
    productCount: 4,
    bankAccount: 'SBI - 3099482109',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'store-2',
    name: 'Marriguda Rythu Seva Agri Kendra',
    inCharge: 'B. Srinivasulu (Seed Specialist)',
    phone: '9848099881',
    email: 'inputs.marriguda@clic.in',
    role: 'store_manager',
    village: 'Marriguda',
    district: 'Nalgonda',
    mandal: 'Marriguda',
    licenseNumber: 'TS-NLG-INP-2024-042',
    specialty: 'Certified Seeds & Bio-Inoculants',
    productCount: 4,
    bankAccount: 'Andhra Bank - 6019284712',
    status: 'Active',
    createdDate: '2026-09-05'
  },
  {
    id: 'store-3',
    name: 'Munchireddypally Organic Farmers FPO Store',
    inCharge: 'N. Yellaiah (FPO In-Charge)',
    phone: '9848123456',
    email: 'inputs.munchi@clic.in',
    role: 'store_manager',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    licenseNumber: 'TS-NLG-INP-2024-089',
    specialty: 'Botanicals & Biological Pest Control',
    productCount: 4,
    bankAccount: 'UBI - 8812938192',
    status: 'Active',
    createdDate: '2026-09-10'
  }
];

export {
  DEFAULT_INPUT_PRODUCTS,
  inputProducts,
  inputStore,
  inputStoreCategories
} from './inputProducts';

export default INITIAL_INPUT_STORES;
