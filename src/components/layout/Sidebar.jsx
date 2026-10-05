import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CloudRain, Sprout, BookOpen,
  ShoppingCart, Building2, Users, LogOut,
  ChevronLeft, ChevronRight, Leaf, Droplets, MapPin,
  ChevronDown, ChevronUp, X, Tractor, Store, Wrench, ShieldCheck, Settings,
  ShoppingBag, Activity, Stethoscope, Database, Fish
} from 'lucide-react';
import '../../styles/sidebar.css';

const NAV_ITEMS = [
  { path: '/',            label: 'Dashboard',      icon: <LayoutDashboard size={20}/>,  roles: ['farmer','facilitator','management','chc_operator','fmc_dealer','store_manager','livestock_entrepreneur'] },
  
  // 🌿 ADVISORY
  { 
    path: '/advisory',       
    label: 'Advisory',  
    icon: <Leaf size={20}/>,      
    roles: ['farmer','facilitator','management','livestock_entrepreneur','chc_operator','fmc_dealer','store_manager'],
    submenus: [
      { path: '/advisory?tab=Crops', label: '🌾 Crop Advisory & POP', roles: ['farmer','facilitator','management'] },
      { path: '/advisory?tab=Livestock', label: '🐄 Livestock Advisory', roles: ['farmer','facilitator','management','livestock_entrepreneur'] },
      { path: '/advisory?tab=Fisheries', label: '🐟 Fisheries Advisory', roles: ['farmer','facilitator','management'] },
      { path: '/advisory?tab=manage', label: '🔧 Manage Advisories', roles: ['facilitator','management'] }
    ]
  },
  
  // 🌾 CROPS
  { 
    path: '/crops',       
    label: 'Crops',  
    icon: <Sprout size={20}/>,      
    roles: ['farmer','facilitator','management'],
    submenus: [
      { path: '/data-upload?tab=crops&sub=categories', label: '📂 Crop Category', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=crops&sub=croplist', label: '🌱 Crop List', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=crops&sub=pests', label: '🐛 Crop Pest', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=crops&sub=diseases', label: '🌿 Crop Disease', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=crops&sub=prescriptions', label: '💊 Prescriptions & Linkages', roles: ['facilitator','management'] },
      { path: '/advisory?tab=Crops', label: '🌾 Crop Advisory & POP', roles: ['farmer','facilitator','management'] },
      { path: '/disease-workflow?tab=workflow&theme=crop_pests', label: '🩺 Diagnostic & Treatment Desk', roles: ['facilitator','management'] },
      { path: '/farmer-services?tab=workflow&theme=crop_pests', label: '🩺 Pest & Disease Self-Check', roles: ['farmer'] },
      { path: '/learning?tab=Traditional+Grains', label: '🌾 Traditional Grains Hub', roles: ['farmer','facilitator','management'] }
    ]
  },

  // 🐄 LIVESTOCK
  { 
    path: '/livestock',       
    label: 'Livestock',  
    icon: <Activity size={20}/>,      
    roles: ['farmer','facilitator','management','livestock_entrepreneur'],
    submenus: [
      { path: '/data-upload?tab=livestock&sub=categories', label: '📂 Livestock Category', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=livestock&sub=species', label: '🐄 Livestock List', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=livestock&sub=diseases', label: '🌿 Livestock Disease', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=livestock&sub=prescriptions', label: '💊 Prescriptions & Care', roles: ['facilitator','management'] },
      { path: '/advisory?tab=Livestock', label: '🐄 Livestock Advisory', roles: ['farmer','facilitator','management'] },
      { path: '/disease-workflow?tab=workflow&theme=livestock', label: '🩺 Livestock Health Desk', roles: ['facilitator','management'] },
      { path: '/farmer-services?tab=workflow&theme=livestock', label: '🩺 Livestock Health Self-Check', roles: ['farmer'] },
      { path: '/livestock-portal', label: '🏪 LS Entrepreneur Hub', roles: ['livestock_entrepreneur','facilitator','management'] }
    ]
  },

  // 🐟 FISHERIES
  { 
    path: '/fisheries',       
    label: 'Fisheries',  
    icon: <Fish size={20}/>,      
    roles: ['farmer','facilitator','management'],
    submenus: [
      { path: '/data-upload?tab=fisheries&sub=categories', label: '📂 Fisheries Category', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=fisheries&sub=species', label: '🐟 Fish Species List', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=fisheries&sub=diseases', label: '🌿 Fish Disease', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=fisheries&sub=prescriptions', label: '💊 Prescriptions & Treatments', roles: ['facilitator','management'] },
      { path: '/advisory?tab=Fisheries', label: '🐟 Fisheries Advisory', roles: ['farmer','facilitator','management'] },
      { path: '/disease-workflow?tab=workflow&theme=fish', label: '🩺 Fish Health Desk', roles: ['facilitator','management'] },
      { path: '/farmer-services?tab=workflow&theme=fish', label: '🩺 Fish Health Self-Check', roles: ['farmer'] }
    ]
  },

  // 🚜 FARMER SERVICES (Machinery & general)
  { 
    path: '/farmer-services',   
    label: 'Farmer Services', 
    icon: <Tractor size={20}/>,          
    roles: ['farmer'],
    submenus: [
      { path: '/farmer-services?tab=workflow&theme=machinery', label: '🚜 Farm Machinery', roles: ['farmer'] },
      { path: '/farmer-services?tab=my_bookings', label: '📋 My Active Bookings', roles: ['farmer'] },
      { path: '/farmer-services?tab=my_alerts', label: '🔔 My SMS Receipts', roles: ['farmer'] }
    ]
  },

  // 🩺 FACILITATOR DESK
  { 
    path: '/disease-workflow',   
    label: 'Facilitator Desk', 
    icon: <Stethoscope size={20}/>,          
    roles: ['facilitator','management'],
    submenus: [
      { path: '/disease-workflow?tab=workflow&theme=machinery', label: '🚜 Machinery Walk-in', roles: ['facilitator','management'] },
      { path: '/disease-workflow?tab=orders', label: '📋 District Orders Registry', roles: ['facilitator','management'] },
      { path: '/disease-workflow?tab=alerts', label: '🔔 Central Alerts Feed', roles: ['facilitator','management'] },
      { path: '/disease-workflow?tab=onboarding', label: '🏛️ Onboard Entities', roles: ['facilitator','management'] },
      { path: '/disease-workflow?tab=queries', label: '📝 Farmer Queries Log', roles: ['facilitator','management'] }
    ]
  },

  // 📂 MASTER DATA UPLOAD HUB
  { 
    path: '/data-upload',       
    label: 'Upload Master Data',  
    icon: <Database size={20}/>,      
    roles: ['facilitator','management'],
    submenus: [
      { path: '/data-upload?tab=crops', label: '🌾 Crops Master Hub', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=livestock', label: '🐄 Livestock Hub', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=fisheries', label: '🐟 Fisheries Hub', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=machinery', label: '🚜 Farm Machinery Hub', roles: ['facilitator','management'] },
      { path: '/data-upload?tab=bulk', label: '⚡ Master Backup & Restore', roles: ['facilitator','management'] }
    ]
  },

  // ⚙️ REF & DROPDOWNS
  { 
    path: '/manage',       
    label: 'Ref & Dropdowns',  
    icon: <Settings size={20}/>,      
    roles: ['facilitator','management'],
    submenus: [
      { path: '/manage?tab=reftypes', label: 'Reference Types', roles: ['facilitator','management'] },
      { path: '/manage?tab=dropdowns', label: 'Dropdown List', roles: ['facilitator','management'] }
    ]
  },

  // PORTALS
  {
    path: '/chc-portal',
    label: 'CHC Hub',
    icon: <Wrench size={20}/>,
    roles: ['chc_operator','facilitator','management']
  },
  {
    path: '/fmc-portal',
    label: 'FMC Dealer',
    icon: <Store size={20}/>,
    roles: ['fmc_dealer','facilitator','management']
  },
  {
    path: '/input-store-portal',
    label: 'Input Store Hub',
    icon: <ShoppingBag size={20}/>,
    roles: ['store_manager','facilitator','management']
  },
  { 
    path: '/groundwater', 
    label: 'Groundwater',     
    icon: <Droplets size={20}/>,          
    roles: ['farmer','facilitator','management'],
    submenus: [
      { path: '/groundwater?tab=list', label: 'View Registers', roles: ['farmer','facilitator','management'] },
      { path: '/groundwater?tab=register', label: 'Register Point', roles: ['management'] },
      { path: '/groundwater?tab=log', label: 'Log Water Metrics', roles: ['facilitator','management'] }
    ]
  },
  { 
    path: '/market',      
    label: 'Market',    
    icon: <ShoppingCart size={20}/>,      
    roles: ['farmer','facilitator','management'],
    submenus: [
      { path: '/market?tab=Market Prices', label: 'Market Prices', roles: ['farmer','facilitator','management'] },
      { path: '/market?tab=Input Store', label: 'Input Store', roles: ['farmer','facilitator','management'] }
    ]
  },
  { 
    path: '/learning',    
    label: 'Learning Hub',    
    icon: <BookOpen size={20}/>,          
    roles: ['farmer','facilitator','management'],
    submenus: [
      { path: '/learning?tab=Digital Library', label: 'Digital Library', roles: ['farmer','facilitator','management'] },
      { path: '/learning?tab=CHC Machinery', label: 'CHC Machinery', roles: ['farmer','facilitator','management'] },
      { path: '/learning?tab=FMC Machinery', label: 'FMC Machinery', roles: ['farmer','facilitator','management'] },
      { path: '/learning?tab=Success Stories', label: 'Success Stories', roles: ['farmer','facilitator','management'] }
    ]
  },
  { path: '/schemes',     label: 'Schemes',         icon: <Building2 size={20}/>,         roles: ['farmer','facilitator','management'] },
  { path: '/weather',     label: 'Weather Services',icon: <CloudRain size={20}/>,         roles: ['farmer','facilitator','management'] },
  { path: '/facilitator', label: 'Facilitator',     icon: <Users size={20}/>,             roles: ['facilitator','management'] },
  { 
    path: '/locations',   
    label: 'Locations',         
    icon: <MapPin size={20}/>,        
    roles: ['facilitator','management'],
    submenus: [
      { path: '/locations?tab=States', label: 'States', roles: ['facilitator','management'] },
      { path: '/locations?tab=Districts', label: 'Districts', roles: ['facilitator','management'] },
      { path: '/locations?tab=Villages', label: 'Villages', roles: ['facilitator','management'] }
    ]
  },
  { 
    path: '/admin',       
    label: 'Admin Console',  
    icon: <ShieldCheck size={20}/>,      
    roles: ['management'],
    submenus: [
      { path: '/admin?tab=users', label: 'Users', roles: ['management'] },
      { path: '/admin?tab=roles', label: 'Roles', roles: ['management'] }
    ]
  },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({});

  const isSuperAdmin = user && (user.role === 'superadmin' || user.roles?.includes('superadmin'));
  const visibleItems = NAV_ITEMS.filter(item => !user || isSuperAdmin || item.roles.includes(user.role) || (user.roles && user.roles.some(r => item.roles.includes(r))));

  // Helper to determine if a sub-route matches the current URL
  const checkSubActive = (subPathStr) => {
    const [subPath, subQuery] = subPathStr.split('?');
    if (location.pathname !== subPath) return false;
    if (!subQuery) return !location.search || location.search === '';
    
    // Check all search params in subQuery match current location.search
    const requiredParams = new URLSearchParams(subQuery);
    const currentParams = new URLSearchParams(location.search);
    for (const [key, val] of requiredParams.entries()) {
      if (currentParams.get(key) !== val) return false;
    }
    return true;
  };

  // Sync open dropdowns on mount and route change
  useEffect(() => {
    visibleItems.forEach(item => {
      const isDirectPath = location.pathname === item.path;
      const isAnySubActive = item.submenus && item.submenus.some(sub => checkSubActive(sub.path));
      if ((isDirectPath || isAnySubActive) && item.submenus) {
        setOpenMenus(prev => ({ ...prev, [item.path]: true }));
      }
    });
  }, [location.pathname, location.search]);

  const handleParentClick = (item) => {
    setOpenMenus(prev => ({
      ...prev,
      [item.path]: !prev[item.path]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Leaf size={22} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-brand">CLIC</span>
            <span className="sidebar-sub">PJK Agriculture</span>
          </div>
        )}
        <button className="mobile-close-btn" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      {/* User Card */}
      {!collapsed && user && (
        <div className="sidebar-user-card">
          <div className="sidebar-avatar">{user.avatar}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-username">{user.name}</div>
            <div className="sidebar-role badge badge-green">{user.role}</div>
          </div>
        </div>
      )}
      {collapsed && user && (
        <div className="sidebar-user-collapsed" title={user.name}>
          {user.avatar}
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className={`nav-section-label ${collapsed ? 'hidden' : ''}`}>Navigation</p>
        {visibleItems.map(item => {
          const isDirectActive = location.pathname === item.path;
          const hasSubs = item.submenus && item.submenus.length > 0;
          const visibleSubs = hasSubs ? item.submenus.filter(sub => !user || isSuperAdmin || sub.roles.includes(user.role) || (user.roles && user.roles.some(r => sub.roles.includes(r)))) : [];
          const isAnyChildActive = visibleSubs.some(s => checkSubActive(s.path));
          const isItemActive = isDirectActive || isAnyChildActive;

          return (
            <div key={item.path} className="sidebar-menu-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={() => `sidebar-link ${isItemActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
                onClick={() => {
                  if (visibleSubs.length > 0) {
                    handleParentClick(item);
                  }
                }}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-link-label">{item.label}</span>}
                {!collapsed && visibleSubs.length > 0 && (
                  <span
                    className="sidebar-chevron"
                    style={{
                      marginLeft: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      transform: openMenus[item.path] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform var(--transition-fast) ease'
                    }}
                  >
                    <ChevronDown size={14} />
                  </span>
                )}
              </NavLink>

              {/* Submenu Rendering */}
              {!collapsed && visibleSubs.length > 0 && (
                <div className={`sidebar-submenu-wrapper ${openMenus[item.path] ? 'expanded' : 'collapsed'}`}>
                  <div className="sidebar-submenu-inner" style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: 'var(--space-8)', borderLeft: '1px solid var(--color-border)', marginLeft: '24px', marginTop: '4px' }}>
                    {visibleSubs.map(sub => {
                      const isSubActive = checkSubActive(sub.path);

                      return (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          className={`submenu-link ${isSubActive ? 'active' : ''}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            color: isSubActive ? 'var(--color-mint)' : 'var(--color-text-muted)',
                            fontSize: '12px',
                            fontWeight: isSubActive ? 'bold' : 'normal',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <div className="submenu-dot" style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: isSubActive ? 'var(--color-mint)' : 'var(--color-text-muted)' }} />
                          <span>{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-link logout-btn" onClick={handleLogout} title="Logout">
          <span className="sidebar-link-icon"><LogOut size={20}/></span>
          {!collapsed && <span className="sidebar-link-label">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand' : 'Collapse'}>
        {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
      </button>
    </aside>
  );
}
