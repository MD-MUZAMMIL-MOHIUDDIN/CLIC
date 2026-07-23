import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, MapPin, LogOut } from 'lucide-react';
import { alerts } from '../../data/weatherData';
import '../../styles/header.css';

const FARMER_NAV = [
  { path: '/',            label: 'Dashboard' },
  { path: '/advisory',    label: 'Advisory' },
  { path: '/groundwater', label: 'Groundwater' },
  { path: '/market',      label: 'Market & CHC' },
  { path: '/learning',    label: 'Learning Hub' },
  { path: '/schemes',     label: 'Schemes' },
  { path: '/weather',     label: 'Weather' }
];

export default function Header({ sidebarCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [lang, setLang] = useState('EN');

  const unread = alerts.filter(a => a.type === 'danger').length;

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isFarmer = user?.role === 'farmer';

  return (
    <header className={`app-header ${isFarmer ? 'farmer-header' : sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Location */}
      <div className="header-location">
        <MapPin size={14} />
        <span>Nalgonda District, Telangana</span>
      </div>

      {/* Top Navigation for Farmer (instead of sidebar) */}
      {isFarmer ? (
        <nav className="header-nav">
          {FARMER_NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      ) : (
        /* Search Bar for Admin/Facilitator only */
        <form className="header-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input
            type="search"
            className="search-input"
            placeholder="Search crops, schemes, market prices..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            id="header-search-input"
          />
        </form>
      )}

      {/* Right actions */}
      <div className="header-actions">
        {/* Language Toggle */}
        <div className="lang-toggle">
          {['EN', 'తె', 'हि'].map(l => (
            <button
              key={l}
              className={`lang-btn ${lang === l ? 'active' : ''}`}
              onClick={() => setLang(l)}
              title={l === 'EN' ? 'English' : l === 'తె' ? 'Telugu' : 'Hindi'}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div className="notif-wrapper">
          <button
            className="header-icon-btn"
            onClick={() => setShowNotifs(!showNotifs)}
            id="notifications-btn"
          >
            <Bell size={18} />
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>
          {showNotifs && (
            <div className="notif-dropdown glass-card">
              <div className="notif-header">
                <h4>Alerts & Notifications</h4>
                <span className="badge badge-red">{unread} urgent</span>
              </div>
              <div className="notif-list">
                {alerts.map(a => (
                  <div key={a.id} className={`notif-item notif-${a.type}`}>
                    <div className="notif-dot" />
                    <div>
                      <div className="notif-title">{a.title}</div>
                      <div className="notif-time">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        {user && (
          <div className="header-user">
            <span className="header-avatar">{user.avatar}</span>
            <div className="header-user-info">
              <span className="header-username">{user.name.split(' ')[0]}</span>
              <span className={`badge badge-${user.role === 'farmer' ? 'green' : user.role === 'facilitator' ? 'sky' : 'amber'}`}>
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Logout button for Farmers (since they have no sidebar) */}
        {isFarmer && (
          <button
            className="header-icon-btn"
            onClick={handleLogout}
            title="Logout"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: 'var(--color-alert-red-alpha)' }}
          >
            <LogOut size={18} className="text-alert" />
          </button>
        )}
      </div>
    </header>
  );
}
