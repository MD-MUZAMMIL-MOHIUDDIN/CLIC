// ============================================================
// Farm Machinery Orders & Bookings Data Model for CLIC
// Separated from FMC and CHC Center Directory Lists
// ============================================================

// 1. FMC Purchase Orders (Equipment Sale with Subsidy)
export const INITIAL_FMC_PURCHASE_ORDERS = [
  {
    id: 'FMC-ORD-1001',
    date: '2026-09-28',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    machineId: 'm1',
    machineName: 'John Deere 5050E 4WD Tractor (50 HP)',
    dealerShop: 'Sri Lakshmi Agro Automotives & Dealership',
    dealerContact: '9848011223',
    mrp: 850000,
    subsidyApplied: 340000,
    subsidyScheme: 'SMAM - Small/Marginal Farmer Subsidy (40%)',
    netPayable: 510000,
    status: 'Alert to FMC Dealer Sent · Confirmation Pending',
    stage: 'alert_dispatched',
    timeline: [
      { time: '10:15 AM', text: 'Farmer Yellaiah walk-in query recorded by Facilitator Anjaiah' },
      { time: '10:25 AM', text: 'Operation chosen: Land Preparation' },
      { time: '10:30 AM', text: 'Selected John Deere 5050E · Scheme SMAM 40% applied' },
      { time: '10:35 AM', text: 'Purchase order generated · Ref: FMC-ORD-1001' },
      { time: '10:36 AM', text: 'Alert sent to FM Shop Dealer (Sri Lakshmi Agro)' },
      { time: '10:36 AM', text: 'SMS with quote breakdown dispatched to Farmer Yellaiah' }
    ]
  }
];

// 2. CHC Rental Orders (Custom Hiring Center Equipment Booking)
export const INITIAL_CHC_RENTAL_ORDERS = [
  {
    id: 'CHC-RNT-2001',
    date: '2026-09-28',
    farmerId: 'f1',
    farmerName: 'Ramu Farmer',
    farmerPhone: '9876543210',
    village: 'Chandampet',
    machineId: 'm3',
    machineName: 'Kubota NSP-4W 4-Row Walk-Behind Paddy Transplanter',
    chcHub: 'Chandampet Central CHC Hub',
    chcContact: '9876500112',
    rentalUnits: '2 Days',
    startDate: '2026-09-30',
    rate: '₹4,200/day',
    deposit: '₹1,200',
    totalEstimated: 9600,
    withOperator: true,
    operatorName: 'Srinivas (Certified Kubota Operator)',
    status: 'Alert to CHC Sent · Back Alert Received',
    stage: 'back_alert_received',
    timeline: [
      { time: '09:30 AM', text: 'Farmer Ramu query logged at CLIC Hub' },
      { time: '09:40 AM', text: 'Operation chosen: Sowing & Planting' },
      { time: '09:45 AM', text: 'Selected Kubota Transplanter · Rental requested' },
      { time: '09:50 AM', text: 'Rental booking closed · Ref: CHC-RNT-2001' },
      { time: '09:51 AM', text: 'Alert dispatched to CHC Hub Operator' },
      { time: '09:51 AM', text: 'Confirmation Alert SMS sent to Farmer Ramu' },
      { time: '10:05 AM', text: 'Alert Back from CHC: Srinivas operator assigned · Machine ready for dispatch on Sep 30 7:00 AM' }
    ],
    backAlert: {
      received: true,
      from: 'CHC Operator (Srinivas)',
      message: 'Machine fueled, serviced and assigned with trained driver. Will arrive at Ramu field on Sep 30 at 07:00 AM.',
      statusUpdate: 'CHC Dispatched Schedule Confirmed'
    }
  }
];

// 3. Consolidated Machinery Orders
export const INITIAL_ORDERS = [
  {
    id: 'FM-PUR-1001',
    type: 'purchase',
    date: '2026-09-28',
    farmerId: 'f2',
    farmerName: 'Yellaiah Goud',
    farmerPhone: '9848123456',
    village: 'Munchireddypally',
    machineId: 'm1',
    machineName: 'Rotavator 7 Feet (Heavy Duty Rotary Tiller)',
    dealer: 'Sri Lakshmi Agro Automotives (Nalgonda)',
    dealerPhone: '9848011223',
    msrp: 145000,
    subsidyAmount: 58000,
    netPayable: 87000,
    paymentMode: 'Kisan Credit Card (KCC) + 40% Subsidy',
    status: 'Alert Dispatched to FM Shop',
    stage: 'fm_shop_alerted',
    timeline: [
      { time: '10:15 AM', text: 'Farmer walk-in at CLIC Munchireddypally center' },
      { time: '10:22 AM', text: 'Farmer selected Rotavator 7 Feet for Purchase' },
      { time: '10:25 AM', text: 'Order closed in CLIC · Order Ref: FM-PUR-1001' },
      { time: '10:26 AM', text: 'Alert sent to FM Shop: Sri Lakshmi Agro Automotives' },
      { time: '10:27 AM', text: 'Alert sent to Farmer Yellaiah via SMS' }
    ]
  }
];

export default {
  INITIAL_FMC_PURCHASE_ORDERS,
  INITIAL_CHC_RENTAL_ORDERS,
  INITIAL_ORDERS
};
