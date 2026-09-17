import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, CloudRain, Sprout, BookOpen,
  ShoppingCart, Building2, Users, LogOut,
  ChevronLeft, ChevronRight, Leaf, Droplets, MapPin,
  ChevronDown, ChevronUp, X
} from 'lucide-react';
import '../../styles/sidebar.css';

const NAV_ITEMS = [
  { path: '/',            label: 'Dashboard',      icon: <LayoutDashboard size={20}/>,  roles: ['farmer','facilitator','management'] },
  { 
    path: '/advisory',    
    label: 'Advisory',        
    icon: <Sprout size={20}/>,            
    roles: ['farmer','facilitator','management'],
    submenus: [
      { path: '/advisory?tab=Crops', label: 'Crops', roles: ['farmer','facilitator','management'] },
      { path: '/advisory?tab=Livestock', label: 'Livestock', roles: ['farmer','facilitator','management'] },
      { path: '/advisory?tab=Fisheries', label: 'Fisheries', roles: ['farmer','facilitator','management'] }
    ]
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
    label: 'Market & CHC',    
    icon: <ShoppingCart size={20}/>,      
    roles: ['farmer','facilitator','management'],
    submenus: [
      { path: '/market?tab=Market Prices', label: 'Market Prices', roles: ['farmer','facilitator','management'] },
      { path: '/market?tab=Equipment Hire', label: 'Equipment Hire', roles: ['farmer','facilitator','management'] },
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
      { path: '/learning?tab=Success Stories', label: 'Success Stories', roles: ['farmer','facilitator','management'] },
      { path: '/learning?tab=Traditional Grains', label: 'Traditional Grains', roles: ['farmer','facilitator','management'] }
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
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({});

  const visibleItems = NAV_ITEMS.filter(item => !user || item.roles.includes(user.role));

  // Sync open dropdowns on mount and route change
  useEffect(() => {
    visibleItems.forEach(item => {
      if (location.pathname === item.path && item.submenus) {
        setOpenMenus(prev => ({ ...prev, [item.path]: true }));
      }
    });
  }, [location.pathname]);

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
          const isParentActive = location.pathname === item.path;
          const hasSubs = item.submenus && item.submenus.length > 0;
          const visibleSubs = hasSubs ? item.submenus.filter(sub => !user || sub.roles.includes(user.role)) : [];

          return (
            <div key={item.path} className="sidebar-menu-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
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
                      const searchPart = sub.path.split('?')[1] || '';
                      const isSubActive = location.search.includes(searchPart);

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
