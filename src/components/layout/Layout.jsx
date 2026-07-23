import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/globals.css';

export default function Layout() {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--color-bg)' }}>
      <div style={{ textAlign:'center' }}>
        <div className="loading-spinner" style={{ width:40, height:40, borderWidth:3, margin:'0 auto 16px' }} />
        <p style={{ color:'var(--color-text-muted)' }}>Loading CLIC...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  const isFarmer = user?.role === 'farmer';

  return (
    <div className={`page-layout ${isFarmer ? 'farmer-layout' : ''}`}>
      {!isFarmer && <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />}
      <div className={`main-content ${isFarmer ? 'farmer-main-content' : collapsed ? 'sidebar-collapsed' : ''}`}>
        <Header sidebarCollapsed={collapsed} />
        <div className="page-wrapper animate-fade-in">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
