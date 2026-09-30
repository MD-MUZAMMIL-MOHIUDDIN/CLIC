// ============================================================
// Groundwater & Borewell Data Model
// ============================================================

export const groundwaterData = [
  { month: 'Jan', depth: 14.2, normal: 12.0 },
  { month: 'Feb', depth: 15.1, normal: 12.8 },
  { month: 'Mar', depth: 16.8, normal: 14.0 },
  { month: 'Apr', depth: 18.5, normal: 15.5 },
  { month: 'May', depth: 19.8, normal: 16.5 },
  { month: 'Jun', depth: 18.2, normal: 15.0 },
  { month: 'Jul', depth: 14.8, normal: 12.5 },
  { month: 'Aug', depth: 12.4, normal: 10.5 },
  { month: 'Sep', depth: 10.9, normal: 9.8 },
  { month: 'Oct', depth: 11.2, normal: 10.0 },
  { month: 'Nov', depth: 12.5, normal: 11.0 },
  { month: 'Dec', depth: 13.4, normal: 11.5 },
];

export const DEFAULT_BOREWELLS = [
  {
    id: 'bw-1',
    farmerName: 'Ramu Reddy',
    farmerTelugu: 'రాము రెడ్డి',
    wellName: 'Survey No. 42 / East Field',
    wellType: 'Borewell',
    village: 'Chandampet',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    latitude: 16.8524,
    longitude: 79.1245,
    depth: 180,
    casingSize: '6.5 inch',
    pumpHp: '7.5 HP Submersible',
    drillDate: '2023-04-15',
    status: 'Operational',
    logs: [
      { date: '2026-07-15', waterLevel: 14.2, yieldLh: 2200, ph: 7.4, tds: 420, runningHours: 6 },
      { date: '2026-07-01', waterLevel: 16.5, yieldLh: 1900, ph: 7.3, tds: 440, runningHours: 5 },
      { date: '2026-06-15', waterLevel: 18.8, yieldLh: 1600, ph: 7.5, tds: 480, runningHours: 4 }
    ]
  },
  {
    id: 'bw-2',
    farmerName: 'Kavitha Devi',
    farmerTelugu: 'కవిత దేవి',
    wellName: 'SHG Community Borewell',
    wellType: 'Community Borewell',
    village: 'Marriguda',
    district: 'Nalgonda',
    mandal: 'Marriguda',
    latitude: 16.9102,
    longitude: 79.0833,
    depth: 220,
    casingSize: '6.5 inch',
    pumpHp: '10.0 HP Solar Submersible',
    drillDate: '2024-01-20',
    status: 'Operational',
    logs: [
      { date: '2026-07-16', waterLevel: 11.8, yieldLh: 2800, ph: 7.2, tds: 380, runningHours: 7 },
      { date: '2026-07-02', waterLevel: 13.4, yieldLh: 2400, ph: 7.3, tds: 395, runningHours: 6 },
      { date: '2026-06-18', waterLevel: 15.9, yieldLh: 2100, ph: 7.4, tds: 410, runningHours: 5 }
    ]
  },
  {
    id: 'bw-3',
    farmerName: 'Raghu Naik',
    farmerTelugu: 'రఘు నాయక్',
    wellName: 'Thanda Well #3',
    wellType: 'Borewell',
    village: 'Chityala',
    district: 'Nalgonda',
    mandal: 'Chityala',
    latitude: 17.0421,
    longitude: 79.1554,
    depth: 250,
    casingSize: '5.0 inch',
    pumpHp: '5.0 HP Submersible',
    drillDate: '2022-11-10',
    status: 'Critical Level',
    logs: [
      { date: '2026-07-15', waterLevel: 18.2, yieldLh: 1200, ph: 7.8, tds: 590, runningHours: 3 },
      { date: '2026-06-28', waterLevel: 20.4, yieldLh: 950, ph: 7.9, tds: 620, runningHours: 2 }
    ]
  }
];

export const DEFAULT_GROUNDWATER_OBSERVATIONS = [
  { id: 'gw-1', village: 'Chandampet', wellId: 'NLG-BW-012', date: '2026-07-16', depth: 12.4, unit: 'mbgl', method: 'Electric sounder', observer: 'Ramu Reddy', notes: 'Recharge observed post-monsoon start', status: 'Safe' },
  { id: 'gw-2', village: 'Munchireddypally', wellId: 'NLG-BW-045', date: '2026-07-16', depth: 15.1, unit: 'mbgl', method: 'Measuring tape', observer: 'Suresh Goud', notes: 'Moderate level, stable pump discharge', status: 'Moderate' },
  { id: 'gw-3', village: 'Marriguda', wellId: 'NLG-BW-089', date: '2026-07-16', depth: 11.8, unit: 'mbgl', method: 'Pressure transducer', observer: 'Padmavathi', notes: 'Significant water table rise due to check dam', status: 'Safe' },
  { id: 'gw-4', village: 'Chityala', wellId: 'NLG-BW-031', date: '2026-07-15', depth: 18.2, unit: 'mbgl', method: 'Measuring tape', observer: 'Raghu Naik', notes: 'Deep water table, advisories issued for drip irrigation', status: 'Critical' },
  { id: 'gw-5', village: 'Nidamanur', wellId: 'NLG-BW-067', date: '2026-07-15', depth: 19.5, unit: 'mbgl', method: 'Measuring tape', observer: 'Kavitha SHG', notes: 'Over-exploited aquifer zone', status: 'Critical' }
];

export default groundwaterData;
