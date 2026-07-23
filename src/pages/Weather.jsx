import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CloudRain, Droplets, Thermometer, Wind, Sun, Cloud, Zap } from 'lucide-react';
import {
  currentWeather, weeklyForecast, seasonalOutlook,
  rainfallTrend, groundwaterData, soilMoistureData, tempHumidityData
} from '../data/weatherData';
import '../styles/weather.css';

const TABS = ['Daily', 'Weekly', 'Seasonal', 'Resource Monitoring'];

export default function Weather() {
  const [activeTab, setActiveTab] = useState('Daily');

  return (
    <div className="weather-page">
      <div className="page-header">
        <h1>🌦️ Weather Services (Agro-Met)</h1>
        <p className="text-secondary">Real-time and forecast data for Nalgonda District, Telangana · Source: IMD & Local Observations</p>
      </div>

      {/* Tabs */}
      <div className="weather-tabs">
        {TABS.map(t => (
          <button key={t} className={`weather-tab ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {activeTab === 'Daily' && <DailyView />}
      {activeTab === 'Weekly' && <WeeklyView />}
      {activeTab === 'Seasonal' && <SeasonalView />}
      {activeTab === 'Resource Monitoring' && <ResourceView />}
    </div>
  );
}

function DailyView() {
  return (
    <div className="weather-daily">
      {/* Hero */}
      <div className="daily-hero card">
        <div className="daily-hero-left">
          <div className="daily-condition">
            <Cloud size={64} className="daily-weather-icon" />
            <div>
              <div className="daily-temp">{currentWeather.temp}°C</div>
              <div className="daily-condition-name">{currentWeather.condition}</div>
              <div className="daily-feels">Feels like {currentWeather.feelsLike}°C</div>
            </div>
          </div>
        </div>
        <div className="daily-hero-right">
          <div className="daily-stats-grid">
            {[
              { icon: <Droplets size={18}/>, label:'Humidity',    val:`${currentWeather.humidity}%` },
              { icon: <CloudRain size={18}/>,label:'Rainfall',    val:`${currentWeather.rainfall} mm` },
              { icon: <Wind size={18}/>,     label:'Wind',         val:`${currentWeather.windSpeed} km/h ${currentWeather.windDir}` },
              { icon: <Sun size={18}/>,      label:'UV Index',     val:`${currentWeather.uvIndex} (Very High)` },
              { icon: <Thermometer size={18}/>,label:'Pressure',  val:`${currentWeather.pressure} hPa` },
              { icon: <Cloud size={18}/>,    label:'Visibility',   val:`${currentWeather.visibility} km` },
            ].map((s,i) => (
              <div key={i} className="daily-stat">
                <span className="daily-stat-icon">{s.icon}</span>
                <div><div className="daily-stat-val">{s.val}</div><div className="daily-stat-label">{s.label}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Hourly Temp/Humidity */}
      <div className="card">
        <div className="section-title">Today – Temperature & Humidity Trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={tempHumidityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }} />
            <Legend />
            <Line type="monotone" dataKey="temp"     stroke="#E9C46A" strokeWidth={2.5} dot={{ fill:'#E9C46A', r:4 }} name="Temp (°C)" />
            <Line type="monotone" dataKey="humidity" stroke="#48CAE4" strokeWidth={2.5} dot={{ fill:'#48CAE4', r:4 }} name="Humidity (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Agri Advisory for today */}
      <div className="advisory-strip card">
        <div className="section-title">🌾 Today's Agro-Met Advisory</div>
        <div className="advisory-pills">
          {[
            { color:'amber', text:'🌡️ Heat stress risk for livestock – ensure shade and water by 11am' },
            { color:'sky',   text:'💧 Moderate rain expected – delay spraying operations' },
            { color:'green', text:'🌱 Suitable day for nursery bed preparation in the morning' },
            { color:'red',   text:'⚡ Thunderstorm risk after 4pm – avoid open field work' },
          ].map((p,i) => (
            <div key={i} className={`advisory-pill pill-${p.color}`}>{p.text}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeeklyView() {
  return (
    <div className="weather-weekly">
      <div className="weekly-cards stagger">
        {weeklyForecast.map((day, i) => (
          <div key={i} className={`weekly-card card ${i===0?'today':''}`}>
            <div className="wc-header">
              <span className="wc-day">{day.day}</span>
              <span className="wc-date">{day.date}</span>
            </div>
            <div className="wc-icon">
              {day.icon === 'sun' ? <Sun size={32}/> : day.icon === 'zap' ? <Zap size={32}/> : <Cloud size={32}/>}
            </div>
            <div className="wc-condition">{day.condition}</div>
            <div className="wc-temps">
              <span className="wc-high">{day.high}°C</span>
              <span className="wc-sep">/</span>
              <span className="wc-low">{day.low}°C</span>
            </div>
            <div className="wc-rain">
              <Droplets size={12}/> Rain: {day.rain}%
            </div>
          </div>
        ))}
      </div>
      {/* Rainfall Bar Chart */}
      <div className="card" style={{ marginTop:'var(--space-6)' }}>
        <div className="section-title">Weekly Rainfall Probability (%)</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyForecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0,100]} />
            <Tooltip contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }} />
            <Bar dataKey="rain" fill="#48CAE4" radius={[4,4,0,0]} name="Rain probability (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SeasonalView() {
  const pct = Math.round((seasonalOutlook.totalSoFar / seasonalOutlook.totalExpected) * 100);
  return (
    <div className="seasonal-view">
      <div className="seasonal-hero card">
        <div className="sh-badge"><span className="badge badge-sky">🌧️ Kharif 2025 – Seasonal Forecast</span></div>
        <div className="sh-main">
          <div className="sh-prediction gradient-text">{seasonalOutlook.prediction}</div>
          <div className="sh-sub">IMD Long Range Forecast · {seasonalOutlook.confidence}% Confidence</div>
        </div>
        <p className="sh-desc">{seasonalOutlook.description}</p>
        <div className="sh-meta">
          <div className="sh-meta-item"><span>Monsoon Onset</span><strong>{seasonalOutlook.onset}</strong></div>
          <div className="sh-meta-item"><span>Expected Withdrawal</span><strong>{seasonalOutlook.withdrawal}</strong></div>
          <div className="sh-meta-item"><span>Received So Far</span><strong>{seasonalOutlook.totalSoFar} mm</strong></div>
          <div className="sh-meta-item"><span>LPA</span><strong>{seasonalOutlook.lpa} mm</strong></div>
        </div>
        <div className="sh-progress">
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:'var(--text-xs)', color:'var(--color-text-muted)' }}>
            <span>Seasonal Progress</span><span>{pct}% of expected</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width:`${pct}%` }} />
          </div>
        </div>
      </div>

      {/* Rainfall trend */}
      <div className="card">
        <div className="section-title">Cumulative Rainfall Trend (Last 30 Days)</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={rainfallTrend}>
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#48CAE4" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#48CAE4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize:11 }} />
            <YAxis />
            <Tooltip contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }} />
            <Area type="monotone" dataKey="rainfall" stroke="#48CAE4" fill="url(#rainGrad)" strokeWidth={2.5} name="Rainfall (mm)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ResourceView() {
  return (
    <div className="resource-view">
      {/* Groundwater */}
      <div className="card">
        <div className="section-title">
          <span>Groundwater Levels (m below GL) – Nalgonda District</span>
          <span className="badge badge-amber" style={{ marginLeft:'auto' }}>Critical: {groundwaterData[4].level}m (May)</span>
        </div>
        <p className="text-secondary" style={{ marginBottom:'var(--space-4)', fontSize:'var(--text-sm)' }}>
          Lower values = shallower water table (good). Values above 15m indicate critical depletion.
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={groundwaterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 30]} reversed />
            <Tooltip contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }} />
            <Legend />
            <Line type="monotone" dataKey="level" stroke="#48CAE4" strokeWidth={2.5} name="Water table (m bgl)" dot={{ r:4 }} />
            <Line type="monotone" dataKey="safe" stroke="#E9C46A" strokeDasharray="5 5" strokeWidth={2} name="Safe limit (15m)" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Soil Moisture */}
      <div className="card">
        <div className="section-title">Soil Moisture Index (0–100) – This Week</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={soilMoistureData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis domain={[0,100]} />
            <Tooltip contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }} />
            <Legend />
            <Bar dataKey="topsoil" fill="#40916C" radius={[4,4,0,0]} name="Topsoil (0-30cm)" />
            <Bar dataKey="subsoil" fill="#74C69D" radius={[4,4,0,0]} name="Subsoil (30-60cm)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Water Budgeting Widget */}
      <WaterBudgetWidget />
    </div>
  );
}

function WaterBudgetWidget() {
  const [crop, setCrop] = useState('paddy');
  const [area, setArea] = useState(2);

  const budgets = {
    paddy:      { water: 1200, savings_drip: 40, savings_awd: 25 },
    cotton:     { water: 600,  savings_drip: 45, savings_awd: 0 },
    groundnut:  { water: 450,  savings_drip: 50, savings_awd: 0 },
    redgram:    { water: 300,  savings_drip: 30, savings_awd: 0 },
  };
  const b = budgets[crop];
  const total = b.water * area;

  return (
    <div className="card water-budget-widget">
      <div className="section-title">💧 Water Budget Calculator</div>
      <div className="wb-controls">
        <div className="form-group">
          <label>Crop</label>
          <select className="input-field select-field" value={crop} onChange={e=>setCrop(e.target.value)}>
            <option value="paddy">Paddy</option>
            <option value="cotton">Cotton</option>
            <option value="groundnut">Groundnut</option>
            <option value="redgram">Red Gram</option>
          </select>
        </div>
        <div className="form-group">
          <label>Area (acres)</label>
          <input type="number" className="input-field" value={area} min={0.5} max={20} step={0.5} onChange={e=>setArea(+e.target.value)} />
        </div>
      </div>
      <div className="wb-results">
        <div className="wb-stat"><div className="wb-val">{total.toLocaleString()} mm</div><div className="wb-key">Total water required</div></div>
        <div className="wb-stat highlight"><div className="wb-val text-sky">{Math.round(total*(1-b.savings_drip/100)).toLocaleString()} mm</div><div className="wb-key">With Drip Irrigation (save {b.savings_drip}%)</div></div>
        {b.savings_awd > 0 && <div className="wb-stat"><div className="wb-val text-amber">{Math.round(total*(1-b.savings_awd/100)).toLocaleString()} mm</div><div className="wb-key">With AWD Method (save {b.savings_awd}%)</div></div>}
      </div>
    </div>
  );
}
