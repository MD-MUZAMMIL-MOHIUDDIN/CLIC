import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  FARMER: 'farmer',
  FACILITATOR: 'facilitator',
  MANAGEMENT: 'management',
  CHC_OPERATOR: 'chc_operator',
  FMC_DEALER: 'fmc_dealer',
};

const DEFAULT_USERS = [
  { id: 1, name: 'Ramu Farmer',          email: 'farmer@clic.in',       role: ROLES.FARMER,       village: 'Chandampet',     avatar: '👨‍🌾', landHolding: '3.5 acres' },
  { id: 2, name: 'Suresh Facilitator',   email: 'facilitator@clic.in',  role: ROLES.FACILITATOR,   village: 'Nalgonda Block', avatar: '👨‍💼', designation: 'CLIC Facilitator' },
  { id: 3, name: 'PJK Committee Admin',  email: 'management@clic.in',   role: ROLES.MANAGEMENT,    village: 'District Level', avatar: '🏛️',  designation: 'Management Committee' },
  { id: 4, name: 'Kishan CHC Supervisor', email: 'chc@clic.in',          role: ROLES.CHC_OPERATOR,  village: 'Chandampet Hub', avatar: '🚜',  designation: 'CHC Center In-Charge' },
  { id: 5, name: 'Rajesh FMC Dealer',    email: 'fmc@clic.in',          role: ROLES.FMC_DEALER,    village: 'Nalgonda Town',  avatar: '🏪',  designation: 'Authorized FM Dealership' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('clic_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Check default users or custom onboarded users
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const allUsers = [...DEFAULT_USERS, ...customUsers];
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (found && (password === 'clic@2025' || password === found.password)) {
      setUser(found);
      localStorage.setItem('clic_user', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Demo password: clic@2025' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clic_user');
  };

  const hasRole = (...roles) => user && roles.includes(user.role);

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
