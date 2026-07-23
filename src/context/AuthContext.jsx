import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
  FARMER: 'farmer',
  FACILITATOR: 'facilitator',
  MANAGEMENT: 'management',
};

const DEMO_USERS = [
  { id: 1, name: 'Ramu Farmer',       email: 'farmer@clic.in',       role: ROLES.FARMER,      village: 'Chandampet',     avatar: '👨‍🌾', landHolding: '3.5 acres' },
  { id: 2, name: 'Suresh Facilitator',email: 'facilitator@clic.in',  role: ROLES.FACILITATOR,  village: 'Nalgonda Block', avatar: '👨‍💼', designation: 'CLIC Facilitator' },
  { id: 3, name: 'PJK Committee',     email: 'management@clic.in',   role: ROLES.MANAGEMENT,   village: 'District Level', avatar: '🏛️',  designation: 'Management Committee' },
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
    const found = DEMO_USERS.find(u => u.email === email);
    if (found && password === 'clic@2025') {
      setUser(found);
      localStorage.setItem('clic_user', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Demo: farmer@clic.in / clic@2025' };
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
