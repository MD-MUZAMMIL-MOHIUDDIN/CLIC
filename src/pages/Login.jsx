import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEFAULT_USERS } from '../context/AuthContext';
import {
  Leaf, Eye, EyeOff, CloudRain, Sprout, Phone, Mail,
  Search, CheckCircle2, Zap, ArrowRight, UserCheck, Shield,
  Tractor, Store, ShoppingBag, Activity, Users, Copy, Check
} from 'lucide-react';
import '../styles/login.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('clic@2025');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Perspective Matrix Filter State
  const [selectedRoleCategory, setSelectedRoleCategory] = useState('all'); // 'all' | 'farmers' | 'hubs' | 'admins'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const routeByRole = (user) => {
    if (user?.role === 'superadmin' || user?.role === 'management') {
      navigate('/admin');
    } else if (user?.role === 'facilitator') {
      navigate('/disease-workflow');
    } else if (user?.role === 'chc_operator') {
      navigate('/chc-portal');
    } else if (user?.role === 'fmc_dealer') {
      navigate('/fmc-portal');
    } else if (user?.role === 'store_manager') {
      navigate('/input-store-portal');
    } else if (user?.role === 'livestock_entrepreneur') {
      navigate('/livestock-portal');
    } else if (user?.role === 'farmer') {
      navigate('/farmer-services');
    } else {
      navigate('/');
    }
  };

  const handlePerformLogin = async (ident, pwd) => {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 350));
    const result = login(ident, pwd);
    if (result.success) {
      routeByRole(result.user);
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePerformLogin(identifier, password);
  };

  const handleAutoFill = (userAccount) => {
    setIdentifier(userAccount.phone);
    setPassword(userAccount.password || 'clic@2025');
    setError('');
  };

  const handleOneClickLogin = (userAccount) => {
    setIdentifier(userAccount.phone);
    setPassword(userAccount.password || 'clic@2025');
    handlePerformLogin(userAccount.phone, userAccount.password || 'clic@2025');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    let list = [...DEFAULT_USERS];

    if (selectedRoleCategory === 'farmers') {
      list = list.filter(u => u.role === 'farmer');
    } else if (selectedRoleCategory === 'chc') {
      list = list.filter(u => u.role === 'chc_operator');
    } else if (selectedRoleCategory === 'fmc') {
      list = list.filter(u => u.role === 'fmc_dealer');
    } else if (selectedRoleCategory === 'stores') {
      list = list.filter(u => u.role === 'store_manager');
    } else if (selectedRoleCategory === 'livestock') {
      list = list.filter(u => u.role === 'livestock_entrepreneur');
    } else if (selectedRoleCategory === 'admins') {
      list = list.filter(u => ['facilitator', 'management', 'superadmin'].includes(u.role));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(u =>
        u.name.toLowerCase().includes(q) ||
        (u.phone || '').includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.village || '').toLowerCase().includes(q) ||
        (u.cropFocus || '').toLowerCase().includes(q) ||
        (u.perspective || '').toLowerCase().includes(q) ||
        (u.designation || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedRoleCategory, searchTerm]);

  const farmerCount = useMemo(() => DEFAULT_USERS.filter(u => u.role === 'farmer').length, []);
  const chcCount = useMemo(() => DEFAULT_USERS.filter(u => u.role === 'chc_operator').length, []);
  const fmcCount = useMemo(() => DEFAULT_USERS.filter(u => u.role === 'fmc_dealer').length, []);
  const storeCount = useMemo(() => DEFAULT_USERS.filter(u => u.role === 'store_manager').length, []);
  const livestockCount = useMemo(() => DEFAULT_USERS.filter(u => u.role === 'livestock_entrepreneur').length, []);
  const adminCount = useMemo(() => DEFAULT_USERS.filter(u => ['facilitator', 'management', 'superadmin'].includes(u.role)).length, []);

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-blob blob-1" />
        <div className="login-blob blob-2" />
        <div className="login-blob blob-3" />
      </div>

      <div className="login-container-wide">
        {/* ============================================================ */}
        {/* LEFT COLUMN: AUTHENTICATION FORM & LOGO                     */}
        {/* ============================================================ */}
        <div className="login-left-card glass-card">
          <div className="login-logo-header">
            <div className="logo-icon-box">
              <Sprout size={32} />
            </div>
            <div>
              <h1 className="logo-title">CLIC</h1>
              <p className="logo-sub">Climate Information & Learning Centre</p>
            </div>
          </div>

          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in with your <strong>Mobile Number</strong> or <strong>Email</strong></p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-identifier" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mobile Number or Email</span>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>📱 Mobile / ✉️ Email</span>
              </label>
              <input
                id="login-identifier"
                type="text"
                className="input-field"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. 9876543210 or farmer@clic.in"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  className="input-field"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : <Zap size={18} />}
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>

          <div className="login-quick-tip">
            <span>💡 <strong>Demo Password:</strong> <code>clic@2025</code></span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Select any persona from the table on the right to test different viewpoints instantly.</span>
          </div>

          <div className="login-brand-footer">
            <span>📍 PJK Agriculture • Nalgonda District, Telangana</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: INTERACTIVE PERSPECTIVE TEST MATRIX TABLE     */}
        {/* ============================================================ */}
        <div className="login-right-table-card glass-card">
          <div className="perspective-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-perspective-live">🧪 Live Testing Matrix</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>({DEFAULT_USERS.length} Demo Personas)</span>
              </div>
              <h2 className="perspective-title">Test Perspectives & Role Logins</h2>
              <p className="perspective-sub">
                Switch between different farmer profiles (Smallholder, Organic, Horticulture, Aquaculture) and operational hubs to evaluate tailored views.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="perspective-filter-bar">
            <div className="perspective-category-tabs">
              <button
                className={`persp-tab ${selectedRoleCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedRoleCategory('all')}
              >
                All ({DEFAULT_USERS.length})
              </button>
              <button
                className={`persp-tab ${selectedRoleCategory === 'farmers' ? 'active' : ''}`}
                onClick={() => setSelectedRoleCategory('farmers')}
              >
                👨‍🌾 Farmers ({farmerCount})
              </button>
              <button
                className={`persp-tab ${selectedRoleCategory === 'chc' ? 'active' : ''}`}
                onClick={() => setSelectedRoleCategory('chc')}
              >
                🚜 CHC Hubs ({chcCount})
              </button>
              <button
                className={`persp-tab ${selectedRoleCategory === 'fmc' ? 'active' : ''}`}
                onClick={() => setSelectedRoleCategory('fmc')}
              >
                🏪 FMC Dealers ({fmcCount})
              </button>
              <button
                className={`persp-tab ${selectedRoleCategory === 'stores' ? 'active' : ''}`}
                onClick={() => setSelectedRoleCategory('stores')}
              >
                🏬 Input Stores ({storeCount})
              </button>
              <button
                className={`persp-tab ${selectedRoleCategory === 'livestock' ? 'active' : ''}`}
                onClick={() => setSelectedRoleCategory('livestock')}
              >
                🐄 Livestock ({livestockCount})
              </button>
              <button
                className={`persp-tab ${selectedRoleCategory === 'admins' ? 'active' : ''}`}
                onClick={() => setSelectedRoleCategory('admins')}
              >
                🏛️ Admins ({adminCount})
              </button>
            </div>

            <div className="perspective-search-box">
              <Search size={14} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search name, phone, crop focus, or perspective..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Perspectives Table */}
          <div className="perspective-table-scroll">
            <table className="perspective-table">
              <thead>
                <tr>
                  <th>Persona & Profile</th>
                  <th>Role / Access</th>
                  <th>What You Experience (Perspective Focus)</th>
                  <th>Credentials</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isCurrent = identifier === u.phone || identifier === u.email;

                  return (
                    <tr key={u.id} className={isCurrent ? 'row-selected' : ''}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="persp-avatar">{u.avatar}</div>
                          <div>
                            <div className="persp-name">
                              <strong>{u.name}</strong>
                              {isCurrent && <span className="pill-current">Active Form</span>}
                            </div>
                            <div className="persp-meta">
                              📍 {u.village} {u.landHolding ? `• ${u.landHolding}` : ''}
                            </div>
                            {u.cropFocus && (
                              <div className="persp-crop-pill">
                                🌱 {u.cropFocus}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`badge-role badge-role-${u.role}`}>
                          {u.role === 'farmer' ? '👨‍🌾 Farmer' :
                           u.role === 'facilitator' ? '👨‍💼 Facilitator' :
                           u.role === 'chc_operator' ? '🚜 CHC Lead' :
                           u.role === 'fmc_dealer' ? '🏪 FMC Dealer' :
                           u.role === 'store_manager' ? '🏬 PACS Store' :
                           u.role === 'livestock_entrepreneur' ? '🐄 LS Mart' :
                           u.role === 'management' ? '🏛️ Admin' : '👑 SuperAdmin'}
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          {u.designation || 'Farmer User'}
                        </div>
                      </td>

                      <td style={{ maxWidth: '300px' }}>
                        <div className="persp-desc">
                          {u.perspective}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div
                            className="copy-chip"
                            onClick={() => handleCopy(u.phone, `p-${u.id}`)}
                            title="Click to copy phone"
                          >
                            <Phone size={11} />
                            <code>{u.phone}</code>
                            {copiedId === `p-${u.id}` ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                          </div>
                          <div
                            className="copy-chip"
                            onClick={() => handleCopy(u.email, `e-${u.id}`)}
                            title="Click to copy email"
                          >
                            <Mail size={11} />
                            <span style={{ fontSize: '11px' }}>{u.email}</span>
                            {copiedId === `e-${u.id}` ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                          </div>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn-persp-fill"
                            onClick={() => handleAutoFill(u)}
                            title="Fill Form with this account"
                          >
                            Fill
                          </button>
                          <button
                            type="button"
                            className="btn-persp-login"
                            onClick={() => handleOneClickLogin(u)}
                            title="Instantly sign in with this perspective"
                          >
                            <Zap size={12} /> 1-Click
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

