import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Thermometer, Droplets, CloudRain,
  AlertTriangle, TrendingUp, TrendingDown, Minus,
  ShoppingCart, Building2, Bug, Tractor, ArrowRight,
  Cloud, BookOpen, PhoneCall
} from 'lucide-react';
import { currentWeather, alerts } from '../data/weatherData';
import { marketPrices } from '../data/marketData';
import { schemes } from '../data/schemes';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schemeCount, setSchemeCount] = useState(schemes.length);
  const activeOutbreaks = 2;

  useEffect(() => {
    // Sync with localStorage if present
    const savedSchemes = localStorage.getItem('clic_schemes');
    if (savedSchemes) {
      try {
        const parsed = JSON.parse(savedSchemes);
        setSchemeCount(parsed.length);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const topMarket = [...marketPrices].sort((a,b) => Math.abs(b.change)-Math.abs(a.change)).slice(0, 3);
  const dangerousAlerts = alerts.filter(a => a.type === 'danger');

  return (
    <div className="dashboard">
      {/* Support Center Top Banner */}
      <div className="dashboard-welcome animate-fade-in-up">
        <div>
          <span className="badge badge-green" style={{ marginBottom: 'var(--space-2)' }}>
            🤝 Farmer Support Center Active
          </span>
          <h1>Welcome back, {user?.name?.split(' ')[0]} {user?.avatar}</h1>
          <p className="text-secondary">
            Serving {currentWeather.location} · Today is {currentWeather.date}
          </p>
        </div>
        <div className="support-hotline-badge card">
          <PhoneCall size={16} className="text-sky animate-pulse" />
          <div>
            <span className="hotline-label">Support Helpline</span>
            <span className="hotline-number">1800-180-1551</span>
          </div>
        </div>
      </div>

      {/* Danger alerts marquee */}
      {dangerousAlerts.length > 0 && (
        <div className="alert-banner animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="alert-banner-content">
            <AlertTriangle size={18} className="alert-icon-pulse" />
            <strong>⚠ SUPPORT ALERT:</strong>
            <div className="alert-marquee">
              <div className="alert-marquee-inner">
                {dangerousAlerts.map((a, i) => (
                  <span key={i}>{a.title}: {a.message} &nbsp;·&nbsp;&nbsp;</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farmer Center Service Stats */}
      <div className="dashboard-support-stats stagger animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="card support-stat-card border-green">
          <div className="stat-icon icon-green"><Bug size={24} /></div>
          <div className="stat-info">
            <h3>{activeOutbreaks} Active Pests</h3>
            <p>Outbreaks in Nalgonda. Check diagnosis.</p>
            <button className="btn-link" onClick={() => navigate('/advisory')}>
              Diagnose Crop <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="card support-stat-card border-sky">
          <div className="stat-icon icon-sky"><Building2 size={24} /></div>
          <div className="stat-info">
            <h3>{schemeCount} Govt Schemes</h3>
            <p>Active government subsidies & support.</p>
            <button className="btn-link" onClick={() => navigate('/schemes')}>
              View Schemes <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="card support-stat-card border-amber">
          <div className="stat-icon icon-amber"><ShoppingCart size={24} /></div>
          <div className="stat-info">
            <h3>Live Market Rates</h3>
            <p>Daily updates from local APMCs.</p>
            <button className="btn-link" onClick={() => navigate('/market')}>
              Check Rates <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Support Dashboard Grid */}
      <div className="dashboard-grid animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        
        {/* Left Column: Direct Farmer Operations */}
        <div className="dashboard-left-col">
          
          {/* Quick Access Grid */}
          <div className="card operations-card">
            <div className="section-title">Support Services Quick Access</div>
            <div className="ops-grid">
              <button className="ops-btn btn-green" onClick={() => navigate('/advisory')}>
                <div className="ops-icon-container"><Bug size={20} /></div>
                <h4>Pest Management & advisory</h4>
                <p>Stage-wise package of practices & image uploader</p>
              </button>

              <button className="ops-btn btn-sky" onClick={() => navigate('/schemes')}>
                <div className="ops-icon-container"><Building2 size={20} /></div>
                <h4>Government Schemes</h4>
                <p>Apply for subsidies, crop insurance & financial support</p>
              </button>

              <button className="ops-btn btn-amber" onClick={() => navigate('/market')}>
                <div className="ops-icon-container"><Tractor size={20} /></div>
                <h4>Custom Hiring Center (CHC)</h4>
                <p>Rent tractors and harvesters from local operators</p>
              </button>

              <button className="ops-btn btn-soil" onClick={() => navigate('/learning')}>
                <div className="ops-icon-container"><BookOpen size={20} /></div>
                <h4>Farmer Knowledge Bank</h4>
                <p>Access organic farming videos, manuals & resources</p>
              </button>
            </div>
          </div>

          {/* Market Flash Card */}
          <div className="card market-flash-card">
            <div className="section-title" style={{ justifyContent: 'space-between' }}>
              <span>Live Market Pricing</span>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/market')}>
                View All Markets
              </button>
            </div>
            <div className="market-flash-list">
              {topMarket.map(m => (
                <div key={m.id} className="market-flash-row">
                  <div className="mf-crop">
                    <div className="mf-name">{m.crop}</div>
                    <div className="mf-market">📍 {m.market}</div>
                  </div>
                  <div className="mf-price">
                    ₹{m.price.toLocaleString()}<span>/quintal</span>
                  </div>
                  <div className={`mf-change ${m.trend}`}>
                    {m.trend === 'up' ? <TrendingUp size={14}/> : m.trend === 'down' ? <TrendingDown size={14}/> : <Minus size={14}/>}
                    {m.change > 0 ? '+' : ''}{m.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Advisories Card */}
          <div className="card advisories-card">
            <div className="section-title">Critical Farmer Alerts</div>
            <div className="alerts-list">
              {alerts.slice(0, 3).map(a => (
                <div key={a.id} className={`alert-item alert-${a.type}`}>
                  <AlertTriangle size={16} className="alert-item-icon" />
                  <div>
                    <div className="alert-item-title">{a.title}</div>
                    <div className="alert-item-msg">{a.message}</div>
                    <div className="alert-item-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Information & Weather Summary */}
        <div className="dashboard-right-col">
          
          {/* Reduced Weather Card - Agro Met Widget */}
          <div className="card weather-widget-card">
            <div className="section-title">Agro-Met Weather Widget</div>
            
            <div className="ww-main">
              <div className="ww-header">
                <Cloud size={40} className="text-sky animate-bounce-slow" />
                <div>
                  <div className="ww-temp">{currentWeather.temp}°C</div>
                  <div className="ww-condition">{currentWeather.condition}</div>
                </div>
              </div>

              <div className="ww-stats">
                <div className="ww-stat-item">
                  <Thermometer size={14} className="text-amber" />
                  <span>Feels like: <strong>{currentWeather.feelsLike}°C</strong></span>
                </div>
                <div className="ww-stat-item">
                  <Droplets size={14} className="text-sky" />
                  <span>Humidity: <strong>{currentWeather.humidity}%</strong></span>
                </div>
                <div className="ww-stat-item">
                  <CloudRain size={14} className="text-sky" />
                  <span>Rain today: <strong>{currentWeather.rainfall} mm</strong></span>
                </div>
              </div>

              <div className="ww-advice-box">
                <span className="advice-header">🌾 Crop Advisory Tip:</span>
                <p>Thunderstorm and rainfall expected soon. Delay fertilizer application and pesticide spraying on crops for the next 48 hours.</p>
              </div>

              <button className="btn btn-secondary btn-sm ww-btn" onClick={() => navigate('/weather')}>
                View Full Weather Services <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Spotlight Knowledge bank */}
          <div className="card spotlight-card">
            <div className="section-title">Knowledge Spotlight</div>
            <div className="spotlight-content">
              <span className="badge badge-sky" style={{ alignSelf: 'flex-start' }}>Organic Fodder</span>
              <h4>Integrated Dairy & Fodder Management</h4>
              <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', marginTop: '4px' }}>
                Learn how to grow Azolla as a high-protein supplement for cows, lowering feeding costs by 20%.
              </p>
              <div className="divider" style={{ margin: 'var(--space-3) 0' }} />
              <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/learning')}>
                Go to Learning Hub <BookOpen size={14} />
              </button>
            </div>
          </div>

          {/* Govt Schemes Banner */}
          <div className="card schemes-spotlight-card">
            <div className="section-title">Govt Schemes Spotlight</div>
            <div className="scheme-spotlight">
              <div className="scheme-icon-circle"><Building2 size={18} /></div>
              <div>
                <h5>PM Fasal Bima Yojana (PMFBY)</h5>
                <p style={{ fontSize: 'var(--text-xs)' }}>Kharif crop insurance registration closes next week. Protect your crops against excess rains.</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'var(--space-4)', justifyContent: 'center' }} onClick={() => navigate('/schemes')}>
              View Govt Schemes
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
