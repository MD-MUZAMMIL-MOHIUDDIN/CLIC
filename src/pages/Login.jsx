import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Eye, EyeOff, CloudRain, Sprout } from 'lucide-react';
import '../styles/login.css';

const DEMO_CREDENTIALS = [
  { role: 'Farmer', email: 'farmer@clic.in', password: 'clic@2025', icon: '👨‍🌾', desc: 'Simplified info view' },
  { role: 'Facilitator', email: 'facilitator@clic.in', password: 'clic@2025', icon: '👨‍💼', desc: 'Data entry & management' },
  { role: 'Management', email: 'management@clic.in', password: 'clic@2025', icon: '🏛️', desc: 'Full admin access' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    if (result.success) navigate('/');
    else { setError(result.error); setLoading(false); }
  };

  const quickLogin = (cred) => {
    setEmail(cred.email);
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
            <p>Sign in to access your CLIC dashboard</p>
          </div>

          {/* Demo quick-login */}
          <div className="demo-roles">
            <p className="demo-label">Demo Accounts (click to fill):</p>
            <div className="demo-role-cards">
              {DEMO_CREDENTIALS.map(c => (
                <button key={c.role} className="demo-role-card" onClick={() => quickLogin(c)}>
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
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
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
