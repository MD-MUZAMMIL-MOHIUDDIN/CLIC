import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { CloudRain, Droplets, Thermometer, Wind, Sun, Cloud, Zap, Download, FileSpreadsheet, Calendar, AlertTriangle, TrendingUp, History, Filter } from 'lucide-react';
import {
  currentWeather, weeklyForecast, seasonalOutlook,
  rainfallTrend, groundwaterData, soilMoistureData, tempHumidityData
} from '../data/weather/weatherData';
import {
  HUNDRED_YEARS_WEATHER_DATA,
  DECADAL_SUMMARY_DATA,
  HISTORIC_DROUGHT_EVENTS,
  LPA_NORMAL_RAINFALL,
  downloadHistoricalWeatherExcel,
  downloadHistoricalWeatherCSV
} from '../data/weather/old_100_years_weather';
import '../styles/weather.css';

const TABS = ['Daily', 'Weekly', 'Seasonal', '100-Year Archive', 'Resource Monitoring'];

export default function Weather() {
  const [activeTab, setActiveTab] = useState('Daily');

  return (
    <div className="weather-page">
      <div className="page-header">
        <h1>🌦️ Weather Services (Agro-Met)</h1>
        <p className="text-secondary">Real-time, forecast, and 100-Year (1925–2025) historical climate analytics · Nalgonda District, Telangana</p>
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
      {activeTab === '100-Year Archive' && <CenturyHistoricalView />}
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

function ClimateComparatorWidget() {
  const [targetYear, setTargetYear] = useState(2025); // Current / Reference Year
  const [compareYear, setCompareYear] = useState(1972); // Past benchmark year

  const currentData = HUNDRED_YEARS_WEATHER_DATA.find(d => d.year === targetYear) || HUNDRED_YEARS_WEATHER_DATA[HUNDRED_YEARS_WEATHER_DATA.length - 1];
  const pastData = HUNDRED_YEARS_WEATHER_DATA.find(d => d.year === compareYear) || HUNDRED_YEARS_WEATHER_DATA[47]; // default 1972

  // Rainfall difference
  const rainDiff = currentData.annualRainfall - pastData.annualRainfall;
  const rainPctDiff = ((rainDiff / pastData.annualRainfall) * 100).toFixed(1);

  // Monsoon difference
  const monsoonDiff = currentData.monsoonRainfall - pastData.monsoonRainfall;

  // Temperature difference
  const tempDiff = (currentData.avgMaxTemp - pastData.avgMaxTemp).toFixed(1);

  // Rainy days difference
  const daysDiff = currentData.rainyDays - pastData.rainyDays;

  // Chart data for comparison
  const comparisonChartData = [
    {
      metric: 'Annual Rain (mm)',
      [`${targetYear} (Current)`]: currentData.annualRainfall,
      [`${compareYear} (Past)`]: pastData.annualRainfall,
      '100-Yr LPA Baseline': 750,
    },
    {
      metric: 'Monsoon Rain (mm)',
      [`${targetYear} (Current)`]: currentData.monsoonRainfall,
      [`${compareYear} (Past)`]: pastData.monsoonRainfall,
      '100-Yr LPA Baseline': 580,
    },
    {
      metric: 'Winter Rain (mm)',
      [`${targetYear} (Current)`]: currentData.winterRainfall,
      [`${compareYear} (Past)`]: pastData.winterRainfall,
      '100-Yr LPA Baseline': 105,
    },
    {
      metric: 'Rainy Days (x10)',
      [`${targetYear} (Current)`]: currentData.rainyDays * 10,
      [`${compareYear} (Past)`]: pastData.rainyDays * 10,
      '100-Yr LPA Baseline': 480,
    },
  ];

  const presets = [
    { label: '🔥 1972 (Great Drought)', year: 1972 },
    { label: '🌊 1983 (Record Deluge)', year: 1983 },
    { label: '☀️ 1987 (El Niño Drought)', year: 1987 },
    { label: '🌾 2002 (Worst July Drought)', year: 2002 },
    { label: '⚠️ 2015 (Back-to-Back Drought)', year: 2015 },
    { label: '🌧️ 2020 (Historic Oct Floods)', year: 2020 },
  ];

  return (
    <div className="card climate-comparator-card">
      <div className="comparator-header">
        <div>
          <div className="comparator-badge">
            <TrendingUp size={15} /> Climate Comparator & Time Machine
          </div>
          <h3>Compare Current Weather & Year with Past 100-Year Records</h3>
          <p className="text-secondary">
            Benchmark present agricultural conditions against historical drought and surplus seasons in Nalgonda.
          </p>
        </div>

        {/* Quick Benchmarks */}
        <div className="comparator-presets">
          <span className="preset-title">Quick Benchmarks:</span>
          {presets.map(p => (
            <button
              key={p.year}
              className={`preset-chip ${compareYear === p.year ? 'active' : ''}`}
              onClick={() => setCompareYear(p.year)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selector controls */}
      <div className="comparator-selectors-grid">
        <div className="selector-box highlight-current">
          <span className="selector-tag">Reference / Current Year (A)</span>
          <select
            className="input-field select-field"
            value={targetYear}
            onChange={e => setTargetYear(Number(e.target.value))}
          >
            {HUNDRED_YEARS_WEATHER_DATA.map(d => (
              <option key={d.year} value={d.year}>
                {d.year} {d.year === 2025 ? '(Current / Recent)' : ''} – {d.annualRainfall} mm ({d.category})
              </option>
            ))}
          </select>
          <div className="box-meta">
            <span>Status: <strong className="text-primary">{currentData.category}</strong></span>
            <span>Onset: <strong>{currentData.monsoonOnset}</strong></span>
          </div>
        </div>

        <div className="vs-badge">VS</div>

        <div className="selector-box highlight-past">
          <span className="selector-tag">Past Benchmark Year (B)</span>
          <select
            className="input-field select-field"
            value={compareYear}
            onChange={e => setCompareYear(Number(e.target.value))}
          >
            {HUNDRED_YEARS_WEATHER_DATA.map(d => (
              <option key={d.year} value={d.year}>
                {d.year} – {d.annualRainfall} mm ({d.category})
              </option>
            ))}
          </select>
          <div className="box-meta">
            <span>Status: <strong className="text-primary">{pastData.category}</strong></span>
            <span>Onset: <strong>{pastData.monsoonOnset}</strong></span>
          </div>
        </div>
      </div>

      {/* Variance Matrix Grid */}
      <div className="variance-matrix-grid">
        <div className="variance-card">
          <div className="var-label">Annual Rainfall</div>
          <div className="var-compare-vals">
            <span className="val-a">{currentData.annualRainfall} mm</span>
            <span className="val-sep">vs</span>
            <span className="val-b">{pastData.annualRainfall} mm</span>
          </div>
          <div className={`var-delta ${rainDiff >= 0 ? 'delta-pos' : 'delta-neg'}`}>
            {rainDiff >= 0 ? `+${rainDiff} mm (+${rainPctDiff}%)` : `${rainDiff} mm (${rainPctDiff}%)`}
          </div>
        </div>

        <div className="variance-card">
          <div className="var-label">Monsoon Rainfall</div>
          <div className="var-compare-vals">
            <span className="val-a">{currentData.monsoonRainfall} mm</span>
            <span className="val-sep">vs</span>
            <span className="val-b">{pastData.monsoonRainfall} mm</span>
          </div>
          <div className={`var-delta ${monsoonDiff >= 0 ? 'delta-pos' : 'delta-neg'}`}>
            {monsoonDiff >= 0 ? `+${monsoonDiff} mm higher` : `${monsoonDiff} mm lower`}
          </div>
        </div>

        <div className="variance-card">
          <div className="var-label">Rainy Days</div>
          <div className="var-compare-vals">
            <span className="val-a">{currentData.rainyDays} days</span>
            <span className="val-sep">vs</span>
            <span className="val-b">{pastData.rainyDays} days</span>
          </div>
          <div className={`var-delta ${daysDiff >= 0 ? 'delta-pos' : 'delta-neg'}`}>
            {daysDiff >= 0 ? `+${daysDiff} more days` : `${daysDiff} fewer days`}
          </div>
        </div>

        <div className="variance-card">
          <div className="var-label">Avg Max Temperature</div>
          <div className="var-compare-vals">
            <span className="val-a">{currentData.avgMaxTemp}°C</span>
            <span className="val-sep">vs</span>
            <span className="val-b">{pastData.avgMaxTemp}°C</span>
          </div>
          <div className={`var-delta ${tempDiff > 0 ? 'delta-warm' : 'delta-cool'}`}>
            {tempDiff > 0 ? `+${tempDiff}°C Warmer` : `${tempDiff}°C Cooler`}
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="comparator-chart-wrap">
        <div className="section-title" style={{ fontSize:'var(--text-sm)' }}>
          📊 Multi-Metric Comparison: {targetYear} vs {compareYear} vs 100-Yr LPA Baseline
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={comparisonChartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
            <Bar dataKey={`${targetYear} (Current)`} fill="#48CAE4" radius={[4, 4, 0, 0]} />
            <Bar dataKey={`${compareYear} (Past)`} fill="#E63946" radius={[4, 4, 0, 0]} />
            <Bar dataKey="100-Yr LPA Baseline" fill="#E9C46A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Agro-Met Diagnostic Card */}
      <div className="comparator-diagnostic-card">
        <div className="diag-header">
          <span className="diag-icon">🌾</span>
          <strong>Comparative Agro-Met Assessment ({targetYear} vs {compareYear})</strong>
        </div>
        <div className="diag-body">
          <p>
            In <strong>{targetYear}</strong>, Nalgonda recorded <strong>{currentData.annualRainfall} mm</strong> ({currentData.category}, {currentData.departure > 0 ? `+${currentData.departure}%` : `${currentData.departure}%`} departure from 750mm LPA), compared to <strong>{pastData.annualRainfall} mm</strong> in <strong>{compareYear}</strong> ({pastData.category}).
          </p>
          <div className="diag-points">
            <div className="diag-point">
              🔹 <strong>Historical Context ({compareYear}):</strong> {pastData.notableEvent}.
            </div>
            <div className="diag-point">
              🔹 <strong>Agro-Economic Impact:</strong> {
                rainDiff > 150
                  ? `Substantially reduced drought risk (+${rainPctDiff}% more moisture). Ideal for double cropping (Paddy/Cotton followed by Rabi pulses).`
                  : rainDiff < -150
                  ? `Severe moisture deficit compared to benchmark. Water conservation techniques (Drip, AWD, Tank rejuvenation) strongly advised.`
                  : `Hydrological and temperature patterns closely aligned within ±15% of benchmark.`
              }
            </div>
            <div className="diag-point">
              🔹 <strong>Live Field Status:</strong> Today's current temperature is <strong>{currentWeather.temp}°C</strong> with <strong>{currentWeather.humidity}%</strong> relative humidity and <strong>{currentWeather.rainfall} mm</strong> current daily precipitation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CenturyHistoricalView() {
  const [selectedDecade, setSelectedDecade] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;

  const decades = ['All', '1920s', '1930s', '1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

  const filteredData = useMemo(() => {
    return HUNDRED_YEARS_WEATHER_DATA.filter(item => {
      // Decade filter
      if (selectedDecade !== 'All') {
        const decYear = parseInt(selectedDecade.slice(0, 4));
        if (item.year < decYear || item.year > decYear + 9) return false;
      }
      // Category filter
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesYear = item.year.toString().includes(q);
        const matchesEvent = item.notableEvent.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesYear && !matchesEvent && !matchesCat) return false;
      }
      return true;
    });
  }, [selectedDecade, categoryFilter, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Excess': return 'badge-sky';
      case 'Normal': return 'badge-green';
      case 'Deficit': return 'badge-amber';
      case 'Severe Drought': return 'badge-red';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="century-climate-view">
      {/* Overview Hero / KPI */}
      <div className="century-hero card">
        <div className="century-hero-header">
          <div>
            <div className="century-title-row">
              <span className="century-hero-icon">🏛️</span>
              <div>
                <h2>100-Year Historical Climate Archive (1925 – 2025)</h2>
                <p className="text-secondary">Official gridded Agro-Met & IMD dataset for Nalgonda & Southern Telangana Agro-Climatic Zone</p>
              </div>
            </div>
          </div>
          <div className="century-actions">
            <button className="btn btn-primary export-btn" onClick={downloadHistoricalWeatherExcel} title="Download Microsoft Excel file">
              <FileSpreadsheet size={16} /> Download Excel (.xlsx)
            </button>
            <button className="btn btn-secondary export-btn" onClick={downloadHistoricalWeatherCSV} title="Download CSV spreadsheet">
              <Download size={16} /> Export CSV (.csv)
            </button>
          </div>
        </div>

        {/* 100-Year KPI Stats Grid */}
        <div className="century-kpi-grid">
          <div className="century-kpi-card">
            <div className="kpi-icon-wrap bg-forest"><CloudRain size={20} /></div>
            <div>
              <div className="kpi-value">{LPA_NORMAL_RAINFALL} mm</div>
              <div className="kpi-label">100-Yr Normal LPA Baseline</div>
            </div>
          </div>
          <div className="century-kpi-card">
            <div className="kpi-icon-wrap bg-amber"><Thermometer size={20} /></div>
            <div>
              <div className="kpi-value">33.1°C <span className="kpi-sub">(+0.85°C warming)</span></div>
              <div className="kpi-label">Century Mean Max Temp</div>
            </div>
          </div>
          <div className="century-kpi-card">
            <div className="kpi-icon-wrap bg-red"><AlertTriangle size={20} /></div>
            <div>
              <div className="kpi-value">9 Droughts <span className="kpi-sub">(8.9% freq)</span></div>
              <div className="kpi-label">Severe Historic Droughts</div>
            </div>
          </div>
          <div className="century-kpi-card">
            <div className="kpi-icon-wrap bg-sky"><Droplets size={20} /></div>
            <div>
              <div className="kpi-value">21 Deluges <span className="kpi-sub">(20.7% freq)</span></div>
              <div className="kpi-label">Excess Flood Years</div>
            </div>
          </div>
        </div>
      </div>

      {/* ⚖️ Climate Time Machine & Past vs Present Comparator */}
      <ClimateComparatorWidget />

      {/* Main 100-Year Rainfall Trend Chart */}
      <div className="card">
        <div className="section-title-row">
          <div>
            <div className="section-title">📊 100-Year Annual & Monsoon Rainfall Trajectory (1925 – 2025)</div>
            <p className="text-secondary" style={{ fontSize:'var(--text-xs)', marginTop:4 }}>
              Comparing Annual Rainfall (mm) against Monsoon Rainfall (mm) and the official 750 mm Long Period Average (LPA)
            </p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={HUNDRED_YEARS_WEATHER_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="year" interval={9} tick={{ fontSize: 11 }} />
            <YAxis domain={[300, 1200]} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }}
              formatter={(val, name) => [`${val} mm`, name]}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
            <ReferenceLine y={750} stroke="#E9C46A" strokeWidth={2} strokeDasharray="5 5" label={{ value: '750 mm LPA Normal', fill: '#E9C46A', fontSize: 11, position: 'insideTopRight' }} />
            <Bar dataKey="annualRainfall" fill="#48CAE4" radius={[3, 3, 0, 0]} name="Annual Rainfall (mm)" />
            <Bar dataKey="monsoonRainfall" fill="#2D6A4F" radius={[3, 3, 0, 0]} name="Monsoon Rainfall (mm)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Decadal Climate Evolution Trend */}
      <div className="grid-2-col">
        <div className="card">
          <div className="section-title">📈 Decadal Rainfall Shifts (10-Year Epochs)</div>
          <p className="text-secondary" style={{ fontSize:'var(--text-xs)', marginBottom:'var(--space-4)' }}>Average decadal precipitation showing recent intensification</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={DECADAL_SUMMARY_DATA}>
              <defs>
                <linearGradient id="decadeRainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#40916C" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#40916C" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="decade" tick={{ fontSize: 10 }} />
              <YAxis domain={[600, 950]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }} />
              <Area type="monotone" dataKey="avgRainfall" stroke="#40916C" strokeWidth={2.5} fill="url(#decadeRainGrad)" name="Decade Avg Rain (mm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="section-title">🌡️ Decadal Temperature Rise (°C)</div>
          <p className="text-secondary" style={{ fontSize:'var(--text-xs)', marginBottom:'var(--space-4)' }}>Steady +0.7°C - +0.85°C warming trend observed across Deccan zone</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={DECADAL_SUMMARY_DATA}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="decade" tick={{ fontSize: 10 }} />
              <YAxis domain={[32.0, 34.0]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background:'var(--color-bg-elevated)', border:'1px solid var(--color-border)', borderRadius:'8px', color:'var(--color-text-primary)' }} />
              <Line type="monotone" dataKey="avgTemp" stroke="#E63946" strokeWidth={2.5} dot={{ fill:'#E63946', r:4 }} name="Decade Avg Max Temp (°C)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historic Drought Milestones */}
      <div className="card">
        <div className="section-title">⚠️ Major Historic Drought Epochs in Telangana</div>
        <div className="drought-milestones-grid">
          {HISTORIC_DROUGHT_EVENTS.map((event, idx) => (
            <div key={idx} className="drought-card">
              <div className="drought-card-header">
                <span className="drought-year">{event.year}</span>
                <span className="badge badge-red">{event.departure}</span>
              </div>
              <div className="drought-rainfall-val">{event.rainfall} mm <span className="text-muted">(LPA: 750 mm)</span></div>
              <div className="drought-severity">{event.severity}</div>
              <p className="drought-desc">{event.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filterable Historical Records Table */}
      <div className="card century-table-card">
        <div className="table-controls-header">
          <div className="section-title">📜 101-Year Historical Weather Archive Records</div>
          <div className="century-filters">
            {/* Decade Selector */}
            <div className="filter-item">
              <label><Calendar size={13} /> Decade:</label>
              <select className="input-field select-field small-select" value={selectedDecade} onChange={e => { setSelectedDecade(e.target.value); setPage(1); }}>
                {decades.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {/* Category Selector */}
            <div className="filter-item">
              <label><Filter size={13} /> Status:</label>
              <select className="input-field select-field small-select" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
                <option value="All">All Categories</option>
                <option value="Excess">Excess (&gt;+20%)</option>
                <option value="Normal">Normal (±19%)</option>
                <option value="Deficit">Deficit (-20% to -27%)</option>
                <option value="Severe Drought">Severe Drought (&lt;-27%)</option>
              </select>
            </div>
            {/* Search */}
            <input
              type="text"
              className="input-field table-search-input"
              placeholder="Search year or event..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="century-data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Annual Rain</th>
                <th>Monsoon Rain</th>
                <th>Winter Rain</th>
                <th>Rainy Days</th>
                <th>Avg Max Temp</th>
                <th>Monsoon Onset</th>
                <th>Category</th>
                <th>LPA Departure</th>
                <th>Agro-Met Landmark & Event</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map(row => (
                  <tr key={row.year}>
                    <td className="font-bold">{row.year}</td>
                    <td><strong className="text-sky">{row.annualRainfall} mm</strong></td>
                    <td>{row.monsoonRainfall} mm</td>
                    <td>{row.winterRainfall} mm</td>
                    <td>{row.rainyDays} days</td>
                    <td>{row.avgMaxTemp}°C</td>
                    <td>{row.monsoonOnset}</td>
                    <td>
                      <span className={`badge ${getCategoryBadgeClass(row.category)}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className={row.departure < 0 ? 'text-red font-medium' : 'text-green font-medium'}>
                      {row.departure > 0 ? `+${row.departure}%` : `${row.departure}%`}
                    </td>
                    <td className="event-notes-cell">{row.notableEvent}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
                    No historical records match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="century-pagination">
            <div className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
              Showing {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} records
            </div>
            <div className="pagination-buttons">
              <button className="btn btn-secondary small-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                Previous
              </button>
              <span className="page-indicator">Page {page} of {totalPages}</span>
              <button className="btn btn-secondary small-btn" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
