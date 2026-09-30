// ============================================================
// Custom Hiring Centers (CHC) Directory & Equipment Data
// ============================================================

export const INITIAL_CHC_HUBS = [
  {
    id: 'chc-1',
    name: 'Chandampet Central CHC Hub',
    inCharge: 'Kishan Goud (CHC Supervisor)',
    phone: '9876500112',
    email: 'chc@clic.in',
    role: 'chc_operator',
    village: 'Chandampet',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    fleetCount: 8,
    operatorCount: 4,
    bankAccount: 'SBI - 2093847192',
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'chc-2',
    name: 'Marriguda PACS Agri Hiring Center',
    inCharge: 'Venkataiah (PACS Lead)',
    phone: '9848099881',
    email: 'chc.marriguda@clic.in',
    role: 'chc_operator',
    village: 'Marriguda',
    district: 'Nalgonda',
    mandal: 'Marriguda',
    fleetCount: 5,
    operatorCount: 3,
    bankAccount: 'Andhra Bank - 551029381',
    status: 'Active',
    createdDate: '2026-09-10'
  },
  {
    id: 'chc-3',
    name: 'Munchireddypally Farmer Cooperative CHC',
    inCharge: 'N. Yellaiah (FPO Director)',
    phone: '9848123456',
    email: 'chc.munchi@clic.in',
    role: 'chc_operator',
    village: 'Munchireddypally',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    fleetCount: 6,
    operatorCount: 3,
    bankAccount: 'UBI - 8812938192',
    status: 'Active',
    createdDate: '2026-09-15'
  }
];

export { chcEquipment, DEFAULT_CHC_EQUIPMENT } from './chcEquipment';

export default INITIAL_CHC_HUBS;

