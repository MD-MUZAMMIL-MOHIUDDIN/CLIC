import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  SUPERADMIN: 'superadmin',
  MANAGEMENT: 'management',
  FACILITATOR: 'facilitator',
  FARMER: 'farmer',
  CHC_OPERATOR: 'chc_operator',
  FMC_DEALER: 'fmc_dealer',
};

const DEFAULT_USERS = [
  { id: 0, name: 'Super Admin',           phone: '9999900000', email: 'superadmin@clic.in',   role: ROLES.SUPERADMIN,    roles: [ROLES.SUPERADMIN], village: 'State HQ',       district: 'Hyderabad', state: 'Telangana', avatar: '👑',  designation: 'Platform Super Administrator', password: 'clic@2025', status: 'Active' },
  { id: 1, name: 'Ramu Farmer',           phone: '9876543210', email: 'farmer@clic.in',       role: ROLES.FARMER,        roles: [ROLES.FARMER],     village: 'Chandampet',     district: 'Nalgonda',  state: 'Telangana', avatar: '👨‍🌾', landHolding: '3.5 acres', password: 'clic@2025', status: 'Active' },
  { id: 2, name: 'Suresh Facilitator',    phone: '9848011223', email: 'facilitator@clic.in',  role: ROLES.FACILITATOR,   roles: [ROLES.FACILITATOR],village: 'Nalgonda Block', district: 'Nalgonda',  state: 'Telangana', avatar: '👨‍💼', designation: 'CLIC Facilitator', password: 'clic@2025', status: 'Active' },
  { id: 3, name: 'PJK Committee Admin',   phone: '9848099000', email: 'management@clic.in',   role: ROLES.MANAGEMENT,    roles: [ROLES.MANAGEMENT], village: 'District Level', district: 'Nalgonda',  state: 'Telangana', avatar: '🏛️',  designation: 'Management Committee', password: 'clic@2025', status: 'Active' },
  { id: 4, name: 'Kishan CHC Supervisor', phone: '9876500112', email: 'chc@clic.in',          role: ROLES.CHC_OPERATOR,  roles: [ROLES.CHC_OPERATOR],village: 'Chandampet Hub', district: 'Nalgonda', state: 'Telangana', avatar: '🚜',  designation: 'CHC Center In-Charge', password: 'clic@2025', status: 'Active' },
  { id: 5, name: 'Rajesh FMC Dealer',     phone: '9440188772', email: 'fmc@clic.in',          role: ROLES.FMC_DEALER,    roles: [ROLES.FMC_DEALER], village: 'Nalgonda Town',  district: 'Nalgonda',  state: 'Telangana', avatar: '🏪',  designation: 'Authorized FM Dealership', password: 'clic@2025', status: 'Active' },
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
