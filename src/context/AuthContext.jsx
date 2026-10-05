import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  SUPERADMIN: 'superadmin',
  MANAGEMENT: 'management',
  FACILITATOR: 'facilitator',
  FARMER: 'farmer',
  CHC_OPERATOR: 'chc_operator',
  FMC_DEALER: 'fmc_dealer',
  STORE_MANAGER: 'store_manager',
  LIVESTOCK_ENTREPRENEUR: 'livestock_entrepreneur',
};

export const DEFAULT_USERS = [
  // 👨‍🌾 4 DISTINCT FARMER PERSPECTIVES
  { 
    id: 1, 
    name: 'Ramu Farmer', 
    phone: '9876543210', 
    email: 'farmer@clic.in', 
    role: ROLES.FARMER, 
    roles: [ROLES.FARMER], 
    village: 'Chandampet', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '👨‍🌾', 
    landHolding: '3.5 acres', 
    cropFocus: 'Paddy (Rice) & Cotton', 
    perspective: 'Smallholder Crop Farmer: Tests Stage-wise PoP, Weather Alerts & CHC Tractor Rental Bookings',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 102, 
    name: 'Laxmi Bai (Lead Farmer)', 
    phone: '9876543211', 
    email: 'laxmi.farmer@clic.in', 
    role: ROLES.FARMER, 
    roles: [ROLES.FARMER], 
    village: 'Peddavoora', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '👩‍🌾', 
    landHolding: '2.0 acres', 
    cropFocus: 'Red Gram & Jowar (Millets)', 
    perspective: 'Organic & Traditional Farmer: Tests Bio-Pest Prescriptions, Millets Advisory & Bio-fertilizer Orders',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 103, 
    name: 'Venkat Reddy (Commercial)', 
    phone: '9876543212', 
    email: 'venkat.farmer@clic.in', 
    role: ROLES.FARMER, 
    roles: [ROLES.FARMER], 
    village: 'Narketpally', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '👨‍🌾', 
    landHolding: '7.5 acres', 
    cropFocus: 'Chilli & Mango Orchards', 
    perspective: 'Commercial Horticulture: Tests Disease Diagnosis, Micro-Irrigation Schemes & Market Prices',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 104, 
    name: 'Koteshwar Rao (Integrated)', 
    phone: '9876543213', 
    email: 'koteshwar.farmer@clic.in', 
    role: ROLES.FARMER, 
    roles: [ROLES.FARMER], 
    village: 'Miryalaguda', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '👨‍🌾', 
    landHolding: '5.0 acres', 
    cropFocus: 'Fish Culture (Carps) & Dairy (4 Buffaloes)', 
    perspective: 'Integrated Mixed Farmer: Tests Fisheries Disease Diagnostic, Water Quality & Livestock Health Desks',
    password: 'clic@2025', 
    status: 'Active' 
  },

  // 🏢 FACILITATOR & ENTERPRISE HUBS
  { 
    id: 2, 
    name: 'Suresh Facilitator', 
    phone: '9848011223', 
    email: 'facilitator@clic.in', 
    role: ROLES.FACILITATOR, 
    roles: [ROLES.FACILITATOR], 
    village: 'Nalgonda Block', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '👨‍💼', 
    designation: 'CLIC Field Facilitator', 
    perspective: 'Field Extension Desk: Walk-in Farmer Diagnostics, Rx Slips, District Booking Fulfillment & Registry',
    password: 'clic@2025', 
    status: 'Active' 
  },
  // 🚜 CUSTOM HIRING CENTERS (3 Distinct CHC Hubs)
  { 
    id: 4, 
    name: 'Kishan Goud (CHC 1 - Chandampet Hub)', 
    phone: '9876500112', 
    email: 'chc@clic.in', 
    role: ROLES.CHC_OPERATOR, 
    roles: [ROLES.CHC_OPERATOR], 
    village: 'Chandampet', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🚜', 
    designation: 'Chandampet Central CHC Hub Supervisor', 
    perspective: 'CHC Hub 1 (Chandampet): 8 rental units (John Deere 50HP, Kubota Transplanter, Harvester), operator dispatch & booking logs',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 402, 
    name: 'Venkataiah (CHC 2 - Marriguda PACS)', 
    phone: '9848099882', 
    email: 'chc.marriguda@clic.in', 
    role: ROLES.CHC_OPERATOR, 
    roles: [ROLES.CHC_OPERATOR], 
    village: 'Marriguda', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🚜', 
    designation: 'Marriguda PACS Agri Hiring Lead', 
    perspective: 'CHC Hub 2 (Marriguda): 5 rental units (Multi-crop Threshers, Rotavators, Seed drills) & PACS member booking calendar',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 403, 
    name: 'N. Yellaiah (CHC 3 - Munchireddypally FPO)', 
    phone: '9848123457', 
    email: 'chc.munchi@clic.in', 
    role: ROLES.CHC_OPERATOR, 
    roles: [ROLES.CHC_OPERATOR], 
    village: 'Munchireddypally', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🚜', 
    designation: 'Farmer Cooperative CHC Lead', 
    perspective: 'CHC Hub 3 (Munchireddypally): 6 rental units (Laser Land Levelers, Drone Sprayers, Reapers) & FPO seasonal rentals',
    password: 'clic@2025', 
    status: 'Active' 
  },

  // 🏪 FARM MACHINERY CENTERS & DEALERSHIPS (3 Distinct FMC Dealers)
  { 
    id: 5, 
    name: 'Rajesh Kumar (FMC 1 - Nalgonda Dealer)', 
    phone: '9440188772', 
    email: 'fmc@clic.in', 
    role: ROLES.FMC_DEALER, 
    roles: [ROLES.FMC_DEALER], 
    village: 'Nalgonda Town', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🏪', 
    designation: 'Sri Lakshmi Agro Automotives & Dealership', 
    perspective: 'FMC Dealer 1 (Nalgonda): John Deere, Kubota & Shaktiman rotavators, transplanters, SMAM subsidy sales & 14 stock units',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 502, 
    name: 'M. Sridhar Reddy (FMC 2 - Miryalaguda Plaza)', 
    phone: '9848033445', 
    email: 'fmc.miryala@clic.in', 
    role: ROLES.FMC_DEALER, 
    roles: [ROLES.FMC_DEALER], 
    village: 'Miryalaguda', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🏪', 
    designation: 'Kisan Machinery Plaza & Service Hub', 
    perspective: 'FMC Dealer 2 (Miryalaguda): Mahindra, Sonalika, VST Shakti & Garuda Agri Drones with RTK GPS, 18 stock units',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 503, 
    name: 'B. Venkat Ramana (FMC 3 - Suryapet Mart)', 
    phone: '9440188773', 
    email: 'fmc.suryapet@clic.in', 
    role: ROLES.FMC_DEALER, 
    roles: [ROLES.FMC_DEALER], 
    village: 'Suryapet', 
    district: 'Suryapet', 
    state: 'Telangana', 
    avatar: '🏪', 
    designation: 'Telangana Agri Equipment Mart', 
    perspective: 'FMC Dealer 3 (Suryapet): Lemken ploughs, Falcon power weeders, Fieldking multi-crop seed drills & 11 stock units',
    password: 'clic@2025', 
    status: 'Active' 
  },
  // 🏬 INPUT SHOPS & ENTERPRISES (3 Distinct Shops)
  { 
    id: 6, 
    name: 'K. Ramchander Rao (Shop 1 - PACS Bio-Input)', 
    phone: '9876500334', 
    email: 'inputstore@clic.in', 
    role: ROLES.STORE_MANAGER, 
    roles: [ROLES.STORE_MANAGER], 
    village: 'Chandampet', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🏬', 
    designation: 'Chandampet PACS Bio-Input Center', 
    perspective: 'Shop 1 (PACS Bio-Input): Subsidized bio-fertilizers, Trichoderma, seed kits & farmer prescription billing',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 602, 
    name: 'B. Srinivasulu (Shop 2 - Agri Kendra)', 
    phone: '9848099881', 
    email: 'inputs.marriguda@clic.in', 
    role: ROLES.STORE_MANAGER, 
    roles: [ROLES.STORE_MANAGER], 
    village: 'Marriguda', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🏬', 
    designation: 'Marriguda Rythu Seva Agri Kendra', 
    perspective: 'Shop 2 (Private Agro Kendra): Certified hybrid seeds, micro-nutrients, soluble fertilizers & retail billing',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 603, 
    name: 'N. Yellaiah (Shop 3 - Organic FPO Mart)', 
    phone: '9848123456', 
    email: 'inputs.munchi@clic.in', 
    role: ROLES.STORE_MANAGER, 
    roles: [ROLES.STORE_MANAGER], 
    village: 'Munchireddypally', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🏬', 
    designation: 'Organic Farmers FPO Store', 
    perspective: 'Shop 3 (Organic FPO Store): Botanical formulations, bio-pesticides, neem oil sprays & FPO member credits',
    password: 'clic@2025', 
    status: 'Active' 
  },
  // 🐄 LIVESTOCK ENTERPRISES & MARTS (3 Distinct Livestock Hubs)
  { 
    id: 7, 
    name: 'P. Mallesh Yadav (LS 1 - Gokulam Hub)', 
    phone: '9876511223', 
    email: 'livestock@clic.in', 
    role: ROLES.LIVESTOCK_ENTREPRENEUR, 
    roles: [ROLES.LIVESTOCK_ENTREPRENEUR], 
    village: 'Chandampet Hub', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🐄', 
    designation: 'Gokulam Dairy & Livestock Inputs Hub', 
    perspective: 'Livestock Hub 1 (Chandampet): Cattle concentrate feed, mineral blocks, Milking machines, calcium tonics & veterinary prescriptions',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 702, 
    name: 'K. Anjaiah Kuruma (LS 2 - Deccan Mart)', 
    phone: '9848099334', 
    email: 'ls.marriguda@clic.in', 
    role: ROLES.LIVESTOCK_ENTREPRENEUR, 
    roles: [ROLES.LIVESTOCK_ENTREPRENEUR], 
    village: 'Marriguda', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🐄', 
    designation: 'Deccan Small Ruminants & Fodder Mart', 
    perspective: 'Livestock Hub 2 (Marriguda): Sheep/goat dewormers, PPR vaccines, mineral lick blocks, green fodder sorghum seeds & flock records',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 703, 
    name: 'Smt. Renuka Devi (LS 3 - Poultry & Pashu Kendra)', 
    phone: '9848123889', 
    email: 'ls.munchi@clic.in', 
    role: ROLES.LIVESTOCK_ENTREPRENEUR, 
    roles: [ROLES.LIVESTOCK_ENTREPRENEUR], 
    village: 'Munchireddypally', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🐔', 
    designation: 'Telangana Backyard Poultry & Pashu Seva Kendra', 
    perspective: 'Livestock Hub 3 (Munchireddypally): Day-old country chicks (Aseel/Kadaknath), grower poultry feed, anti-stress electrolytes & biosecurity',
    password: 'clic@2025', 
    status: 'Active' 
  },

  // 🏛️ MANAGEMENT & SUPERADMIN
  { 
    id: 3, 
    name: 'PJK Committee Admin', 
    phone: '9848099000', 
    email: 'management@clic.in', 
    role: ROLES.MANAGEMENT, 
    roles: [ROLES.MANAGEMENT], 
    village: 'District HQ', 
    district: 'Nalgonda', 
    state: 'Telangana', 
    avatar: '🏛️', 
    designation: 'PJK Management Committee', 
    perspective: 'Governance & Analytics: District Aggregates, Master Data Tables, Ingestion Hub & Policy Oversight',
    password: 'clic@2025', 
    status: 'Active' 
  },
  { 
    id: 0, 
    name: 'Super Admin', 
    phone: '9999900000', 
    email: 'superadmin@clic.in', 
    role: ROLES.SUPERADMIN, 
    roles: [ROLES.SUPERADMIN], 
    village: 'State HQ', 
    district: 'Hyderabad', 
    state: 'Telangana', 
    avatar: '👑', 
    designation: 'Platform Super Administrator', 
    perspective: 'System Admin: User Access Matrix, Master Backup Engine, Role Provisioning & Security Audits',
    password: 'clic@2025', 
    status: 'Active' 
  },
];


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('clic_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (identifier, password) => {
    if (!identifier) return { success: false, error: 'Please enter Mobile Number or Email Address.' };
    const cleanIdent = identifier.trim();
    const cleanPhone = cleanIdent.replace(/\D/g, '');

    // Check custom registered users from Admin / Onboarding, plus farmers registry
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const registeredFarmers = JSON.parse(localStorage.getItem('clic_farmers') || '[]').map(f => ({
      ...f,
      role: ROLES.FARMER,
      roles: [ROLES.FARMER],
      avatar: '👨‍🌾',
      password: f.password || 'clic@2025',
      status: 'Active'
    }));

    const allUsers = [...DEFAULT_USERS, ...customUsers, ...registeredFarmers];

    // Find by either Mobile Number OR Email Address
    const found = allUsers.find(u => {
      const uPhoneClean = (u.phone || '').toString().replace(/\D/g, '');
      const uEmail = (u.email || '').toLowerCase();
      
      const phoneMatch = cleanPhone.length >= 10 && uPhoneClean === cleanPhone;
      const emailMatch = uEmail && uEmail === cleanIdent.toLowerCase();
      
      return phoneMatch || emailMatch;
    });
    
    if (found) {
      if (found.status === 'Inactive') {
        return { success: false, error: 'Account is deactivated. Please contact CLIC Admin.' };
      }
      if (password === 'clic@2025' || password === found.password) {
        setUser(found);
        localStorage.setItem('clic_user', JSON.stringify(found));
        return { success: true, user: found };
      }
      return { success: false, error: 'Invalid password. (Demo default: clic@2025)' };
    }
    
    return { success: false, error: 'No user registered with this Mobile Number or Email. Please check credentials or register with Admin.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clic_user');
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    if (user.role === ROLES.SUPERADMIN || (user.roles && user.roles.includes(ROLES.SUPERADMIN))) return true;
    const userRoleList = user.roles || [user.role];
    return roles.some(r => userRoleList.includes(r));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole, ROLES }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
