import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Eye, EyeOff, CloudRain, Sprout, Phone, Mail } from 'lucide-react';
import '../styles/login.css';

const DEMO_CREDENTIALS = [
  { role: 'SuperAdmin', phone: '9999900000', email: 'superadmin@clic.in', password: 'clic@2025', icon: '👑', desc: 'Mobile: 9999900000' },
  { role: 'Admin', phone: '9848099000', email: 'management@clic.in', password: 'clic@2025', icon: '🏛️', desc: 'Mobile: 9848099000' },
  { role: 'Facilitator', phone: '9848011223', email: 'facilitator@clic.in', password: 'clic@2025', icon: '👨‍💼', desc: 'Mobile: 9848011223' },
  { role: 'Farmer', phone: '9876543210', email: 'farmer@clic.in', password: 'clic@2025', icon: '👨‍🌾', desc: 'Mobile: 9876543210' },
  { role: 'CHC Hub', phone: '9876500112', email: 'chc@clic.in', password: 'clic@2025', icon: '🚜', desc: 'Mobile: 9876500112' },
  { role: 'FMC Shop', phone: '9440188772', email: 'fmc@clic.in', password: 'clic@2025', icon: '🏪', desc: 'Mobile: 9440188772' },
  { role: 'Input Store', phone: '9876500334', email: 'inputstore@clic.in', password: 'clic@2025', icon: '🏬', desc: 'Mobile: 9876500334' },
  { role: 'LS Mart', phone: '9876511223', email: 'livestock@clic.in', password: 'clic@2025', icon: '🐄', desc: 'Mobile: 9876511223' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 400));
    const result = login(identifier, password);
    if (result.success) {
      if (result.user?.role === 'superadmin' || result.user?.role === 'management') {
        navigate('/admin');
      } else if (result.user?.role === 'chc_operator') {
        navigate('/chc-portal');
      } else if (result.user?.role === 'fmc_dealer') {
        navigate('/fmc-portal');
      } else if (result.user?.role === 'store_manager') {
        navigate('/input-store-portal');
      } else if (result.user?.role === 'livestock_entrepreneur') {
        navigate('/livestock-portal');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
      setLoading(false);
    }
  };


  const quickLogin = (cred, usePhone = true) => {
    setIdentifier(usePhone ? cred.phone : cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-blob blob-1" />
        <div className="login-blob blob-2" />
        <div className="login-blob blob-3" />
      </div>

      <div className="login-container">
        {/* Left Panel */}
        <div className="login-left">
          <div className="login-logo">
            <div className="logo-icon"><Sprout size={40} /></div>
            <div>
              <h1>CLIC</h1>
              <p>Climate Information & Learning Centre</p>
            </div>
          </div>
          <div className="login-tagline">
            <h2>Empowering Farmers with Scientific Knowledge</h2>
            <p>Access weather forecasts, market prices, crop advisory, government schemes, and expert support — all in one place.</p>
          </div>
          <div className="login-features">
            {[
              { icon: <CloudRain size={20}/>, text: 'Real-time Agro-Met Advisories' },
              { icon: <Leaf size={20}/>,      text: 'Package of Practices (PoP)' },
              { icon: '📊',                   text: 'Live Market Prices' },
              { icon: '🏛️',                   text: 'Government Scheme Guidance' },
            ].map((f, i) => (
              <div key={i} className="login-feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <div className="login-location">
            <span className="badge badge-green">📍 Nalgonda District, Telangana</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right glass-card">
          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in with your <strong>Mobile Number</strong> or <strong>Email</strong></p>
          </div>

          {/* Demo quick-login */}
          <div className="demo-roles">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p className="demo-label" style={{ margin: 0 }}>Quick Demo Login (Click to fill):</p>
            </div>
            <div className="demo-role-cards">
              {DEMO_CREDENTIALS.map(c => (
                <button key={c.role} className="demo-role-card" onClick={() => quickLogin(c, true)}>
                  <span className="role-icon">{c.icon}</span>
                  <div>
                    <div className="role-name">{c.role}</div>
                    <div className="role-desc">{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-identifier" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mobile Number / Email Address</span>
                <span style={{ fontSize: '11px', color: 'var(--color-mint)', fontWeight: 'bold' }}>📱 Mobile or ✉️ Mail</span>
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
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
              {loading ? <span className="loading-spinner" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="login-hint">Demo password for all accounts: <strong>clic@2025</strong></p>
        </div>
      </div>
    </div>
  );
}
