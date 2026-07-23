import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Navigation, CheckCircle2, AlertCircle,
  Plus, Activity, ClipboardList, Database
} from 'lucide-react';
import '../styles/groundwater.css';

const DEFAULT_BOREWELLS = [
  {
    id: 'well-1',
    farmerName: 'Yellamma Raju',
    wellName: 'Main Paddy Field Well',
    type: 'Borewell',
    latitude: '17.0583',
    longitude: '79.2667',
    depth: 180,
    casingSize: 6.5,
    pumpHp: 7.5,
    drillDate: '2023-04-12',
    status: 'Active',
    logs: [
      { date: '2026-07-10', waterLevel: 65, yieldLh: 4200, ph: 7.2, tds: 450, runningHours: 6 },
      { date: '2026-06-15', waterLevel: 72, yieldLh: 4000, ph: 7.1, tds: 460, runningHours: 8 },
      { date: '2026-05-20', waterLevel: 85, yieldLh: 3800, ph: 7.3, tds: 480, runningHours: 9 }
    ]
  },
  {
    id: 'well-2',
    farmerName: 'Srinivas Goud',
    wellName: 'Cotton Field North',
    type: 'Borewell',
    latitude: '17.0620',
    longitude: '79.2701',
    depth: 220,
    casingSize: 6.5,
    pumpHp: 5.0,
    drillDate: '2024-05-18',
    status: 'Active',
    logs: [
      { date: '2026-07-05', waterLevel: 98, yieldLh: 3000, ph: 7.6, tds: 520, runningHours: 5 },
      { date: '2026-06-08', waterLevel: 110, yieldLh: 2800, ph: 7.5, tds: 540, runningHours: 7 }
    ]
  },
  {
    id: 'well-3',
    farmerName: 'Ramaiah Naik',
    wellName: 'Orchard Open Well',
    type: 'Open Well',
    latitude: '17.0498',
    longitude: '79.2550',
    depth: 45,
    casingSize: 20.0,
    pumpHp: 3.0,
    drillDate: '2022-11-05',
    status: 'Low Level',
    logs: [
      { date: '2026-07-15', waterLevel: 38, yieldLh: 1200, ph: 7.8, tds: 610, runningHours: 4 },
      { date: '2026-06-20', waterLevel: 42, yieldLh: 900, ph: 7.9, tds: 630, runningHours: 4 }
    ]
  }
];

export default function Groundwater() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [borewells, setBorewells] = useState([]);
  const [selectedWellId, setSelectedWellId] = useState('');
  const [activeView, setActiveView] = useState('list'); // 'list', 'register', 'log'

  const canRegister = user?.role === 'management';
  const canLog = user?.role === 'facilitator' || user?.role === 'management';

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam) {
      const allViews = ['list', 'register', 'log'];
      const match = allViews.find(v => v.toLowerCase() === tabParam.toLowerCase());
      if (match) {
        if (match === 'register' && !canRegister) return;
        if (match === 'log' && !canLog) return;
        setActiveView(match);
      }
    }
  }, [tabParam, canRegister, canLog]);

  // Form States for Registration
  const [farmerName, setFarmerName] = useState('');
  const [wellName, setWellName] = useState('');
  const [wellType, setWellType] = useState('Borewell');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [depth, setDepth] = useState('');
  const [casingSize, setCasingSize] = useState('');
  const [pumpHp, setPumpHp] = useState('');
  const [drillDate, setDrillDate] = useState(new Date().toISOString().split('T')[0]);

  // Geolocation States
  const [geoStatus, setGeoStatus] = useState('idle'); // 'idle', 'detecting', 'success', 'error'
  const [geoErrorMsg, setGeoErrorMsg] = useState('');

  // Form States for Data Logging
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logWaterLevel, setLogWaterLevel] = useState('');
  const [logYield, setLogYield] = useState('');
  const [logPh, setLogPh] = useState('7.2');
  const [logTds, setLogTds] = useState('');
  const [logHours, setLogHours] = useState('');

  // Notifications
  const [notification, setNotification] = useState(null);

  // Load from LocalStorage or Fallback to Defaults
  useEffect(() => {
    const saved = localStorage.getItem('clic_borewells');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBorewells(parsed);
        if (parsed.length > 0) setSelectedWellId(parsed[0].id);
      } catch {
        setBorewells(DEFAULT_BOREWELLS);
        setSelectedWellId(DEFAULT_BOREWELLS[0].id);
      }
    } else {
      setBorewells(DEFAULT_BOREWELLS);
      setSelectedWellId(DEFAULT_BOREWELLS[0].id);
      localStorage.setItem('clic_borewells', JSON.stringify(DEFAULT_BOREWELLS));
    }
  }, []);

  const saveBorewells = (updatedList) => {
    setBorewells(updatedList);
    localStorage.setItem('clic_borewells', JSON.stringify(updatedList));
  };

  // Get GPS Location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      setGeoErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setGeoStatus('detecting');
    setGeoErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setGeoStatus('success');
      },
      (error) => {
        setGeoStatus('error');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoErrorMsg('GPS permission denied. Please enter coordinates manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoErrorMsg('Location info unavailable. Enter coordinates manually.');
            break;
          case error.TIMEOUT:
            setGeoErrorMsg('GPS request timed out. Enter coordinates manually.');
            break;
          default:
            setGeoErrorMsg('An unknown error occurred getting location.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Submit Borewell Registration
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!farmerName || !wellName || !depth) {
      showNotice('error', 'Please fill in Farmer Name, Well Identifier and Depth.');
      return;
    }

    const newWell = {
      id: `well-${Date.now()}`,
      farmerName,
      wellName,
      type: wellType,
      latitude: latitude || '0.000000',
      longitude: longitude || '0.000000',
      depth: parseFloat(depth),
      casingSize: casingSize ? parseFloat(casingSize) : 6.5,
      pumpHp: pumpHp ? parseFloat(pumpHp) : 5.0,
      drillDate,
      status: 'Active',
      logs: []
    };

    const updated = [newWell, ...borewells];
    saveBorewells(updated);
    setSelectedWellId(newWell.id);

    // Reset Form
    setFarmerName('');
    setWellName('');
    setLatitude('');
    setLongitude('');
    setDepth('');
    setCasingSize('');
    setPumpHp('');
    setGeoStatus('idle');

    showNotice('success', 'Borewell registered successfully!');
    setActiveView('list');
  };

  // Submit Water Log Data
  const handleLogSubmit = (e) => {
    e.preventDefault();

    if (!selectedWellId) {
      showNotice('error', 'No borewell selected.');
      return;
    }

    if (!logWaterLevel || !logYield) {
      showNotice('error', 'Please enter Water Level and Yield discharge.');
      return;
    }

    const newLog = {
      date: logDate,
      waterLevel: parseFloat(logWaterLevel),
      yieldLh: parseFloat(logYield),
      ph: parseFloat(logPh),
      tds: logTds ? parseFloat(logTds) : 500,
      runningHours: logHours ? parseFloat(logHours) : 6
    };

    const updated = borewells.map(w => {
      if (w.id === selectedWellId) {
        // Evaluate well status based on water level vs depth
        let newStatus = 'Active';
        const percentFilled = ((w.depth - newLog.waterLevel) / w.depth) * 100;
        if (percentFilled < 20) newStatus = 'Critical Dry';
        else if (percentFilled < 45) newStatus = 'Low Level';

        return {
          ...w,
          status: newStatus,
          logs: [newLog, ...w.logs].sort((a,b) => b.date.localeCompare(a.date))
        };
      }
      return w;
    });

    saveBorewells(updated);

    // Reset Form
    setLogWaterLevel('');
    setLogYield('');
    setLogTds('');
    setLogHours('');

    showNotice('success', 'Water metrics logged successfully!');
    setActiveView('list');
  };

  const showNotice = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const selectedWell = borewells.find(w => w.id === selectedWellId);
  const latestLog = selectedWell?.logs[0] || null;

  return (
    <div className="groundwater-page">
      <div className="page-header animate-fade-in-up">
        <span className="badge badge-sky" style={{ marginBottom: 'var(--space-2)' }}>📊 WATER RESOURCE REGISTER</span>
        <h1>Groundwater & Borewell Database</h1>
        <p className="text-secondary">
          Register borewells/open wells, capture precise geolocations, track water table depletion, and monitor quality.
        </p>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`notification-toast alert-${notification.type} animate-slide-left`}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="groundwater-controls animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <button
          className={`btn ${activeView === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveView('list')}
        >
          <ClipboardList size={16} /> View Active Registers
        </button>
        {canRegister && (
          <button
            className={`btn ${activeView === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('register')}
            id="btn-register-borewell"
          >
            <Plus size={16} /> Register Water Point
          </button>
        )}
        {canLog && (
          <button
            className={`btn ${activeView === 'log' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              if (borewells.length === 0) {
                showNotice('error', 'Please register a water point first.');
              } else {
                setActiveView('log');
              }
            }}
          >
            <Activity size={16} /> Log Measurement Data
          </button>
        )}
      </div>

      {/* Main Area */}
      <div className="groundwater-content animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {activeView === 'list' && (
          <div className="groundwater-list-layout">
            
            {/* Left Sidebar: List of points */}
            <div className="wells-sidebar">
              <div className="section-title">Registered Points</div>
              <div className="wells-list-container">
                {borewells.length === 0 ? (
                  <p className="text-muted text-center" style={{ padding: 'var(--space-6)' }}>No borewells registered.</p>
                ) : (
                  borewells.map(w => {
                    const latest = w.logs[0];
                    return (
                      <button
                        key={w.id}
                        className={`well-item-card card ${selectedWellId === w.id ? 'active' : ''}`}
                        onClick={() => setSelectedWellId(w.id)}
                      >
                        <div className="well-item-header">
                          <span className="well-emoji">{w.type === 'Borewell' ? '🚰' : '🌀'}</span>
                          <div>
                            <span className="well-item-name">{w.wellName}</span>
                            <span className="well-item-farmer">Farmer: {w.farmerName}</span>
                          </div>
                          <span className={`badge badge-sm ${
                            w.status === 'Active' ? 'badge-green' : w.status === 'Low Level' ? 'badge-amber' : 'badge-red'
                          }`}>
                            {w.status}
                          </span>
                        </div>
                        {latest && (
                          <div className="well-item-sub">
                            <span>Water Level: <strong>{latest.waterLevel} ft</strong></span>
                            <span>Yield: <strong>{latest.yieldLh} L/h</strong></span>
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Selected Well details & Visualizer */}
            <div className="well-details-pane">
              {selectedWell ? (
                <div className="well-details-card card">
                  <div className="cib-header">
                    <span className="cib-icon">{selectedWell.type === 'Borewell' ? '🚰' : '🌀'}</span>
                    <div>
                      <h2>{selectedWell.wellName}</h2>
                      <p>Registered to: <strong>{selectedWell.farmerName}</strong> · Type: {selectedWell.type}</p>
                    </div>
                    <div className="cib-badges">
                      <span className="badge badge-green">Drilled: {selectedWell.drillDate}</span>
                      <span className="badge badge-sky">GPS: {selectedWell.latitude}, {selectedWell.longitude}</span>
                    </div>
                  </div>

                  <div className="well-spec-grid">
                    <div className="spec-stat">
                      <span className="val">{selectedWell.depth} ft</span>
                      <span className="key">Total Depth</span>
                    </div>
                    <div className="spec-stat">
                      <span className="val">{selectedWell.casingSize} in</span>
                      <span className="key">Casing Diameter</span>
                    </div>
                    <div className="spec-stat">
                      <span className="val">{selectedWell.pumpHp} HP</span>
                      <span className="key">Pump Capacity</span>
                    </div>
                    <div className="spec-stat">
                      <span className="val text-sky">
                        {latestLog ? `${latestLog.waterLevel} ft` : 'N/A'}
                      </span>
                      <span className="key">Latest Water Level</span>
                    </div>
                  </div>

                  {/* Depth Visualizer & History */}
                  <div className="details-visualizer-split">
                    {/* Visualizer */}
                    <div className="well-visualizer card">
                      <h5>Borewell Depth Profile</h5>
                      <div className="well-column-container">
                        <div className="well-casing" style={{ height: '35%' }} title="Casing Pipe" />
                        <div className="well-shaft">
                          {/* Ground line */}
                          <div className="visual-ground-label">Ground Level</div>
                          {/* Water Level line */}
                          {latestLog ? (
                            (() => {
                              const pct = Math.min(100, Math.max(0, (latestLog.waterLevel / selectedWell.depth) * 100));
                              return (
                                <>
                                  <div className="water-level-line" style={{ top: `${pct}%` }}>
                                    <span>Water Table ({latestLog.waterLevel} ft bgl)</span>
                                  </div>
                                  <div className="water-column" style={{ top: `${pct}%`, height: `${100 - pct}%` }} />
                                </>
                              );
                            })()
                          ) : (
                            <div className="water-level-line" style={{ top: '90%' }}>
                              <span>Dry / Unknown Level</span>
                            </div>
                          )}
                          <div className="visual-depth-label">{selectedWell.depth} ft (Bottom)</div>
                        </div>
                      </div>
                    </div>

                    {/* Historical Table */}
                    <div className="well-logs-history">
                      <h5>Measurement Logs History</h5>
                      <div className="table-responsive">
                        <table className="logs-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Water Level (ft)</th>
                              <th>Discharge (L/h)</th>
                              <th>pH / TDS</th>
                              <th>Pump Hrs</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedWell.logs.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-muted text-center" style={{ padding: 'var(--space-4)' }}>
                                  No logs recorded yet. Use 'Log Measurement Data' to add logs.
                                </td>
                              </tr>
                            ) : (
                              selectedWell.logs.map((log, index) => (
                                <tr key={index}>
                                  <td>{log.date}</td>
                                  <td className="font-bold text-sky">{log.waterLevel} ft</td>
                                  <td className="font-semibold text-green">{log.yieldLh} L/h</td>
                                  <td>{log.ph} pH / {log.tds} ppm</td>
                                  <td>{log.runningHours} hrs/day</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card text-center text-muted">Please select or register a water point.</div>
              )}
            </div>

          </div>
        )}

        {/* Register Form View */}
        {activeView === 'register' && (
          <div className="card registration-card-form">
            <div className="section-title">
              <Database size={18} className="text-sky" />
              <span>Register Water Point or Borewell</span>
            </div>
            <form onSubmit={handleRegisterSubmit} className="register-form-grid">
              
              <div className="form-group">
                <label>Farmer Name <span className="text-alert">*</span></label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Yellamma Raju"
                  value={farmerName}
                  onChange={e => setFarmerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Water Point / Well Identifier <span className="text-alert">*</span></label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Main Paddy Field Well"
                  value={wellName}
                  onChange={e => setWellName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Water Point Type</label>
                <select className="input-field select-field" value={wellType} onChange={e => setWellType(e.target.value)}>
                  <option value="Borewell">Borewell</option>
                  <option value="Open Well">Open Well / Dug Well</option>
                  <option value="Farm Pond">Farm Pond / Recharge Body</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date of Drilling / Excavation</label>
                <input
                  type="date"
                  className="input-field"
                  value={drillDate}
                  onChange={e => setDrillDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Borewell Depth (feet) <span className="text-alert">*</span></label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 200"
                  value={depth}
                  onChange={e => setDepth(e.target.value)}
                  min={10}
                  required
                />
              </div>

              <div className="form-group">
                <label>Casing Diameter (inches)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 6.5"
                  value={casingSize}
                  onChange={e => setCasingSize(e.target.value)}
                  step={0.1}
                />
              </div>

              <div className="form-group">
                <label>Pump Capacity (HP)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 7.5"
                  value={pumpHp}
                  onChange={e => setPumpHp(e.target.value)}
                  step={0.5}
                />
              </div>

              {/* Geolocation Section */}
              <div className="form-group geo-integration-field">
                <label>Borewell Geolocation (Latitude / Longitude)</label>
                <div className="geo-inputs-wrapper">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Latitude (e.g. 17.0583)"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Longitude (e.g. 79.2667)"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                  />
                  <button
                    type="button"
                    className={`btn geo-detect-btn ${geoStatus === 'detecting' ? 'btn-secondary' : 'btn-amber'}`}
                    onClick={handleGetLocation}
                    disabled={geoStatus === 'detecting'}
                  >
                    <Navigation size={14} className={geoStatus === 'detecting' ? 'animate-spin' : ''} />
                    {geoStatus === 'detecting' ? 'Detecting...' : 'Get GPS location'}
                  </button>
                </div>
                {geoStatus === 'success' && (
                  <span className="geo-status success-msg"><CheckCircle2 size={12} /> Location captured successfully!</span>
                )}
                {geoStatus === 'error' && (
                  <span className="geo-status error-msg"><AlertCircle size={12} /> {geoErrorMsg}</span>
                )}
              </div>

              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary">
                  Register Well & Water Point
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveView('list')}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Data Logger View */}
        {activeView === 'log' && (
          <div className="card logging-card-form">
            <div className="section-title">
              <Activity size={18} className="text-sky" />
              <span>Log Water Point Measurements</span>
            </div>
            <form onSubmit={handleLogSubmit} className="register-form-grid">
              
              <div className="form-group">
                <label>Select Water Point <span className="text-alert">*</span></label>
                <select
                  className="input-field select-field"
                  value={selectedWellId}
                  onChange={e => setSelectedWellId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Select a registered well --</option>
                  {borewells.map(w => (
                    <option key={w.id} value={w.id}>{w.wellName} (Farmer: {w.farmerName})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date of Log</label>
                <input
                  type="date"
                  className="input-field"
                  value={logDate}
                  onChange={e => setLogDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Water Level (feet below ground level) <span className="text-alert">*</span></label>
                <div className="water-level-slider-wrapper">
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g. 80"
                    value={logWaterLevel}
                    onChange={e => setLogWaterLevel(e.target.value)}
                    max={selectedWell ? selectedWell.depth : 1000}
                    min={0}
                    required
                  />
                  {selectedWell && (
                    <span className="text-muted" style={{ fontSize: '11px' }}>
                      Must be less than total depth: {selectedWell.depth} ft
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Discharge Yield (Liters per Hour) <span className="text-alert">*</span></label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 3500"
                  value={logYield}
                  onChange={e => setLogYield(e.target.value)}
                  min={0}
                  required
                />
              </div>

              <div className="form-group">
                <label>Water Quality pH (optimum 6.5–8.5)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 7.2"
                  value={logPh}
                  onChange={e => setLogPh(e.target.value)}
                  step={0.1}
                  min={1}
                  max={14}
                />
              </div>

              <div className="form-group">
                <label>Total Dissolved Solids (TDS in ppm)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 450"
                  value={logTds}
                  onChange={e => setLogTds(e.target.value)}
                  min={0}
                />
              </div>

              <div className="form-group">
                <label>Daily Pump Running Duration (hours)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 6"
                  value={logHours}
                  onChange={e => setLogHours(e.target.value)}
                  min={0}
                  max={24}
                />
              </div>

              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary">
                  Log Water Metrics
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveView('list')}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
