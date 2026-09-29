import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { CloudRain, Droplets, Users, Upload, CheckCircle, Plus, Tractor, ArrowRight, UserPlus, FileQuestion } from 'lucide-react';
import { defaultStates, defaultDistricts, defaultVillages } from '../data/marketData';
import { DEMO_FARMERS, INITIAL_FARMER_QUERIES } from '../data/machineryData';
import '../styles/facilitator.css';

const VILLAGE_DATA = [
  { village:'Chandampet',   date:'Jul 16', rainfall:14.2, groundwater:12.4, observers:'Ramu/Yellaiah' },
  { village:'Munchireddypally', date:'Jul 16', rainfall:8.6, groundwater:15.1, observers:'Suresh Goud' },
  { village:'Marriguda',    date:'Jul 16', rainfall:22.0, groundwater:11.8, observers:'Padmavathi' },
  { village:'Chityala',     date:'Jul 15', rainfall:6.4,  groundwater:18.2, observers:'Raghu Naik' },
  { village:'Nidamanur',    date:'Jul 15', rainfall:0.0,  groundwater:19.5, observers:'Kavitha SHG' },
];

export default function FacilitatorPortal() {
  const { user, hasRole } = useAuth();

  if (!hasRole('facilitator', 'management')) {
    return (
      <div className="access-denied card">
        <div className="denied-icon">🔒</div>
        <h2>Access Restricted</h2>
        <p>This section is available only to CLIC Facilitators and Management. Please login with appropriate credentials.</p>
        <div className="badge badge-amber">Current role: {user?.role}</div>
      </div>
    );
  }

  return <FacilitatorContent />;
}

function FacilitatorContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('rainfall');
  const [submitted, setSubmitted] = useState(false);
  const [submittedFarmer, setSubmittedFarmer] = useState(null);
  
  const [rainfallForm, setRainfallForm] = useState({ village:'', date:'', rainfall:'', gauge:'Manual', observer:'', notes:'' });
  const [gwForm, setGwForm] = useState({ village:'', date:'', depth:'', unit:'mbgl', wellId:'', method:'Measuring tape' });
  
  // Location Cascades for Farmer Form
  const [states] = useState(() => {
    const saved = localStorage.getItem('clic_states');
    return saved ? JSON.parse(saved) : defaultStates;
  });
  const [districts] = useState(() => {
    const saved = localStorage.getItem('clic_districts');
    return saved ? JSON.parse(saved) : defaultDistricts;
  });
  const [villages, setVillages] = useState(() => {
    const saved = localStorage.getItem('clic_market_villages');
    return saved ? JSON.parse(saved) : defaultVillages;
  });

  const [farmerForm, setFarmerForm] = useState({
    name: '',
    telugu: '',
    phone: '',
    state: 'Telangana',
    districtId: 'd1',
    districtName: 'Nalgonda',
    villageId: 'v1',
    villageName: 'Chandampet',
    isCustomVillage: false,
    customVillageName: '',
    landholding: '3.0',
    soilType: 'Red Sandy Loam',
    crops: '',
    bankAccount: '',
    subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
    query: ''
  });

  const existingFarmerWithPhone = useMemo(() => {
    const raw = (farmerForm.phone || '').trim().replace(/\D/g, '');
    if (!raw || raw.length < 10) return null;
    return farmers.find(f => f.phone && f.phone.replace(/\D/g, '') === raw) || null;
  }, [farmerForm.phone, farmers]);

  const handleStateChange = (newState) => {
    const stateDists = districts.filter(d => d.state === newState);
    const firstDist = stateDists[0] || { id: '', name: '' };
    const distVils = villages.filter(v => v.districtId === firstDist.id);
    const firstVil = distVils[0] || { id: '', name: '' };

    setFarmerForm(prev => ({
      ...prev,
      state: newState,
      districtId: firstDist.id,
      districtName: firstDist.name,
      villageId: firstVil.id,
      villageName: firstVil.name,
      isCustomVillage: false,
      customVillageName: ''
    }));
  };

  const handleDistrictChange = (newDistId) => {
    const distObj = districts.find(d => d.id === newDistId);
    const distVils = villages.filter(v => v.districtId === newDistId);
    const firstVil = distVils[0] || { id: '', name: '' };

    setFarmerForm(prev => ({
      ...prev,
      districtId: newDistId,
      districtName: distObj?.name || '',
      villageId: firstVil.id,
      villageName: firstVil.name,
      isCustomVillage: false,
      customVillageName: ''
    }));
  };

  const handleVillageChange = (newVilId) => {
    if (newVilId === '__other__') {
      setFarmerForm(prev => ({
        ...prev,
        villageId: '__other__',
        villageName: 'Other',
        isCustomVillage: true
      }));
    } else {
      const vilObj = villages.find(v => v.id === newVilId);
      setFarmerForm(prev => ({
        ...prev,
        villageId: newVilId,
        villageName: vilObj?.name || '',
        isCustomVillage: false
      }));
    }
  };

  const handleSubmit = (e, form, setForm, defaults) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(defaults); }, 3000);
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    if (!farmerForm.name.trim() || !farmerForm.phone.trim()) {
      alert('Please provide Farmer Name and Mobile Number.');
      return;
    }

    const finalVillage = farmerForm.isCustomVillage
      ? (farmerForm.customVillageName.trim() || 'Custom Village')
      : farmerForm.villageName;

    if (farmerForm.isCustomVillage && farmerForm.customVillageName.trim()) {
      const newVil = {
        id: `v-${Date.now()}`,
        name: farmerForm.customVillageName.trim(),
        districtId: farmerForm.districtId
      };
      const updatedVils = [...villages, newVil];
      setVillages(updatedVils);
      localStorage.setItem('clic_market_villages', JSON.stringify(updatedVils));
    }

    // Mobile as Primary Key & duplicate check
    const cleanPhone = farmerForm.phone.trim().replace(/\D/g, '');
    const duplicate = farmers.find(f => f.phone && f.phone.replace(/\D/g, '') === cleanPhone);
    if (duplicate) {
      alert(`Farmer with mobile number +91 ${cleanPhone} already exists as ${duplicate.name}. Cannot add duplicate.`);
      return;
    }

    const newFarmer = {
      id: `f-${cleanPhone}`,
      name: farmerForm.name.trim(),
      telugu: farmerForm.telugu.trim() || farmerForm.name.trim(),
      state: farmerForm.state,
      district: farmerForm.districtName,
      village: finalVillage,
      phone: cleanPhone,
      landHolding: `${farmerForm.landholding} acres`,
      soilType: farmerForm.soilType || 'Red Sandy Loam',
      crops: farmerForm.crops ? farmerForm.crops.split(',').map(c => c.trim()).filter(Boolean) : ['Paddy', 'Cotton'],
      bankAccount: farmerForm.bankAccount.trim() || 'SBI - Main Branch',
      subsidyCategory: farmerForm.subsidyCategory || 'Small / Marginal Farmer (SF/MF)',
      activeQuery: farmerForm.query.trim() || 'Walk-in farmer registration at CLIC Hub'
    };

    // Save to clic_farmers
    const savedFarmers = JSON.parse(localStorage.getItem('clic_farmers') || '[]');
    const existingList = savedFarmers.length > 0 ? savedFarmers : DEMO_FARMERS;
    const updatedFarmers = [newFarmer, ...existingList];
    localStorage.setItem('clic_farmers', JSON.stringify(updatedFarmers));

    // If query given, save to clic_farmer_queries
    if (farmerForm.query.trim()) {
      const currentTimestamp = new Date().toLocaleString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
      });
      const facName = user?.name || 'CLIC Facilitator';
      const qRecord = {
        id: `QRY-${Date.now().toString().slice(-6)}`,
        farmerId: newFarmer.id,
        farmerName: newFarmer.name,
        farmerPhone: newFarmer.phone,
        village: newFarmer.village,
        district: newFarmer.district,
        state: newFarmer.state,
        query: farmerForm.query.trim(),
        facilitatorId: user?.id || 'fac-lead',
        facilitatorName: facName,
        facilitatorEmail: user?.email || 'facilitator@clic.in',
        facilitatorRole: user?.role || 'facilitator',
        timestamp: currentTimestamp,
        theme: 'Farm Machinery',
        status: 'Logged',
        notes: 'Captured during farmer registration in Facilitator Portal'
      };
      const savedQueries = JSON.parse(localStorage.getItem('clic_farmer_queries') || '[]');
      const existingQueries = savedQueries.length > 0 ? savedQueries : INITIAL_FARMER_QUERIES;
      localStorage.setItem('clic_farmer_queries', JSON.stringify([qRecord, ...existingQueries]));
    }

    setSubmittedFarmer(newFarmer);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFarmerForm({
        name: '',
        telugu: '',
        phone: '',
        aadhaar: '',
        state: 'Telangana',
        districtId: 'd1',
        districtName: 'Nalgonda',
        villageId: 'v1',
        villageName: 'Chandampet',
        isCustomVillage: false,
        customVillageName: '',
        landholding: '3.0',
        soilType: 'Red Sandy Loam',
        crops: '',
        bankAccount: '',
        subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
        query: ''
      });
    }, 4000);
  };

  return (
    <div className="facilitator-page">
      <div className="page-header">
        <div>
          <h1>👨‍💼 Facilitator Portal</h1>
          <p className="text-secondary">Data entry and management for CLIC village-level observations</p>
        </div>
        <div className="badge badge-sky">Logged in as Facilitator ({user?.name || 'CLIC Lead'})</div>
      </div>

      {/* Section Nav */}
      <div className="facilitator-nav">
        {[
          { id:'rainfall', icon:<CloudRain size={18}/>, label:'Rainfall Entry' },
          { id:'groundwater', icon:<Droplets size={18}/>, label:'Groundwater' },
          { id:'farmer', icon:<Users size={18}/>, label:'Farmer Registration' },
          { id:'knowledge', icon:<Upload size={18}/>, label:'Knowledge Bank' },
          { id:'dashboard', icon:<CheckCircle size={18}/>, label:'Village Dashboard' },
        ].map(s => (
          <button key={s.id} className={`facilitator-nav-btn ${activeSection===s.id?'active':''}`} onClick={()=>{ setActiveSection(s.id); setSubmitted(false); }}>
            {s.icon} {s.label}
          </button>
        ))}
        <button
          className="facilitator-nav-btn"
          style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(5, 150, 105, 0.1))', color: 'var(--color-forest)', fontWeight: 'bold' }}
          onClick={() => navigate('/machinery')}
        >
          <Tractor size={18} /> 🚜 Farm Machinery Desk
        </button>
      </div>

      {/* Walk-in Machinery Fast Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)', padding: 'var(--space-4) var(--space-5)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            🚜
          </div>
          <div>
            <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0, color: '#fff' }}>
              Farmer Walk-in Machinery Workflow
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: '#94A3B8', margin: '2px 0 0 0' }}>
              Standardized CLIC Pipeline: Farmer Query → Retrieve Profile → Operations Catalog → Video/Specs → FM Shop Purchase / CHC Rental Alerts.
            </p>
          </div>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/machinery')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Launch Walk-in Desk <ArrowRight size={14} />
        </button>
      </div>

      {submitted && (
        <div className="submit-success">
          <CheckCircle size={20}/>
          <span>Data submitted successfully! Synced to CLIC database.</span>
          {submittedFarmer && (
            <button
              className="btn btn-primary btn-sm"
              style={{ marginLeft: '12px', fontSize: '11px' }}
              onClick={() => navigate('/machinery')}
            >
              Open in Walk-in Desk <ArrowRight size={12} />
            </button>
          )}
        </div>
      )}

      {/* Rainfall Entry */}
      {activeSection === 'rainfall' && (
        <div className="facilitator-form-card card">
          <div className="section-title"><CloudRain size={20}/> Daily Rainfall Data Entry</div>
          <p className="text-secondary" style={{ marginBottom:'var(--space-6)', fontSize:'var(--text-sm)' }}>
            Enter rainfall readings from manual rain gauge. Support for Unicode input in Telugu/Hindi.
          </p>
          <form onSubmit={e => handleSubmit(e, rainfallForm, setRainfallForm, { village:'', date:'', rainfall:'', gauge:'Manual', observer:'', notes:'' })}>
            <div className="form-grid">
              <div className="form-group">
                <label>Village Name (గ్రామం పేరు)</label>
                <input className="input-field" placeholder="Village name / గ్రామం పేరు" value={rainfallForm.village} onChange={e=>setRainfallForm({...rainfallForm, village:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date (తేదీ)</label>
                <input type="date" className="input-field" value={rainfallForm.date} onChange={e=>setRainfallForm({...rainfallForm, date:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Rainfall (mm) (వర్షపాతం)</label>
                <input type="number" step="0.1" min="0" className="input-field" placeholder="e.g. 14.2" value={rainfallForm.rainfall} onChange={e=>setRainfallForm({...rainfallForm, rainfall:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Gauge Type (కొలమానం రకం)</label>
                <select className="input-field select-field" value={rainfallForm.gauge} onChange={e=>setRainfallForm({...rainfallForm, gauge:e.target.value})}>
                  <option>Manual</option>
                  <option>Automatic</option>
                  <option>IMD Station</option>
                </select>
              </div>
              <div className="form-group">
                <label>Observer Name (పరిశీలకుడు)</label>
                <input className="input-field" placeholder="Name / పేరు" value={rainfallForm.observer} onChange={e=>setRainfallForm({...rainfallForm, observer:e.target.value})} style={{ fontFamily:'var(--font-telugu)' }} required />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Notes (గమనికలు)</label>
                <textarea className="input-field" rows={3} placeholder="Additional observations, damage, flooding... / అదనపు పరిశీలనలు..." value={rainfallForm.notes} onChange={e=>setRainfallForm({...rainfallForm, notes:e.target.value})} style={{ fontFamily:'var(--font-telugu)', resize:'vertical' }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Submit Rainfall Data</button>
          </form>
        </div>
      )}

      {/* Groundwater Entry */}
      {activeSection === 'groundwater' && (
        <div className="facilitator-form-card card">
          <div className="section-title"><Droplets size={20}/> Groundwater Level Entry</div>
          <form onSubmit={e => handleSubmit(e, gwForm, setGwForm, { village:'', date:'', depth:'', unit:'mbgl', wellId:'', method:'Measuring tape' })}>
            <div className="form-grid">
              <div className="form-group">
                <label>Village (గ్రామం)</label>
                <input className="input-field" placeholder="Village / గ్రామం" value={gwForm.village} onChange={e=>setGwForm({...gwForm, village:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Date (తేదీ)</label>
                <input type="date" className="input-field" value={gwForm.date} onChange={e=>setGwForm({...gwForm, date:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Water Table Depth</label>
                <div style={{ display:'flex', gap:'var(--space-2)' }}>
                  <input type="number" step="0.1" min="0" className="input-field" placeholder="Depth (e.g. 14.5)" value={gwForm.depth} onChange={e=>setGwForm({...gwForm, depth:e.target.value})} required />
                  <select className="input-field select-field" style={{ width:'120px' }} value={gwForm.unit} onChange={e=>setGwForm({...gwForm, unit:e.target.value})}>
                    <option value="mbgl">m bgl</option>
                    <option value="feet">feet</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Well/Borewell ID</label>
                <input className="input-field" placeholder="e.g. NLG-BW-024" value={gwForm.wellId} onChange={e=>setGwForm({...gwForm, wellId:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Measurement Method</label>
                <select className="input-field select-field" value={gwForm.method} onChange={e=>setGwForm({...gwForm, method:e.target.value})}>
                  <option>Measuring tape</option>
                  <option>Electric sounder</option>
                  <option>Pressure transducer</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Submit Groundwater Data</button>
          </form>
        </div>
      )}

      {/* Farmer Registration with State -> District -> Village Selection */}
      {activeSection === 'farmer' && (
        <div className="facilitator-form-card card">
          <div className="section-title"><Users size={20}/> Farmer Registration (రైతు నమోదు)</div>
          <p className="text-secondary" style={{ marginBottom:'var(--space-6)', fontSize:'var(--text-sm)' }}>
            Register new walk-in farmers into the CLIC master registry with State → District → Village cascading hierarchy and query logging.
          </p>
          <form onSubmit={handleFarmerSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Farmer Name (English) *</label>
                <input className="input-field" placeholder="Full name" value={farmerForm.name} onChange={e=>setFarmerForm({...farmerForm, name:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Name in Telugu (తెలుగులో పేరు)</label>
                <input className="input-field" placeholder="ఉదా. రాము రెడ్డి" value={farmerForm.telugu} onChange={e=>setFarmerForm({...farmerForm, telugu:e.target.value})} style={{ fontFamily:'var(--font-telugu)' }} />
              </div>
              <div className="form-group">
                <label>Mobile Number (10 digits) *</label>
                <input type="tel" maxLength={10} className="input-field" placeholder="10-digit mobile number" value={farmerForm.phone} onChange={e=>setFarmerForm({...farmerForm, phone:e.target.value.replace(/\D/g,'')})} required />
              </div>

              {/* ── LOCATION SELECTION: State -> District -> Village ── */}
              <div className="form-group">
                <label>State (రాష్ట్రం) *</label>
                <select
                  className="input-field select-field"
                  value={farmerForm.state}
                  onChange={e => handleStateChange(e.target.value)}
                  required
                >
                  {states.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>District (జిల్లా) *</label>
                <select
                  className="input-field select-field"
                  value={farmerForm.districtId}
                  onChange={e => handleDistrictChange(e.target.value)}
                  required
                >
                  {districts
                    .filter(d => d.state === farmerForm.state)
                    .map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: farmerForm.isCustomVillage ? 'auto' : 'span 2' }}>
                <label>Village (గ్రామం) *</label>
                <select
                  className="input-field select-field"
                  value={farmerForm.villageId}
                  onChange={e => handleVillageChange(e.target.value)}
                  required
                >
                  {villages
                    .filter(v => v.districtId === farmerForm.districtId)
                    .map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  <option value="__other__">+ Enter Other Village...</option>
                </select>
              </div>

              {farmerForm.isCustomVillage && (
                <div className="form-group">
                  <label>Enter Village Name *</label>
                  <input
                    className="input-field"
                    placeholder="Type village name"
                    value={farmerForm.customVillageName}
                    onChange={e => setFarmerForm({ ...farmerForm, customVillageName: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Land Holding (acres)</label>
                <input type="number" step="0.5" min="0" className="input-field" placeholder="e.g. 3.5" value={farmerForm.landholding} onChange={e=>setFarmerForm({...farmerForm, landholding:e.target.value})} />
              </div>

              <div className="form-group">
                <label>Soil Type</label>
                <select className="input-field select-field" value={farmerForm.soilType} onChange={e=>setFarmerForm({...farmerForm, soilType:e.target.value})}>
                  <option value="Red Sandy Loam">Red Sandy Loam</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Red Loam">Red Loam</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Alluvial Soil">Alluvial Soil</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Main Crops (పంటలు)</label>
                <input className="input-field" placeholder="e.g. Paddy, Cotton, Red Gram / వరి, పత్తి, కందులు" value={farmerForm.crops} onChange={e=>setFarmerForm({...farmerForm, crops:e.target.value})} style={{ fontFamily:'var(--font-telugu)' }} />
              </div>

              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Farmer Subsidy Category</label>
                <select className="input-field select-field" value={farmerForm.subsidyCategory} onChange={e=>setFarmerForm({...farmerForm, subsidyCategory:e.target.value})}>
                  <option value="Small / Marginal Farmer (SF/MF)">Small / Marginal Farmer (SF/MF) - 40% Subsidy</option>
                  <option value="Women Farmer / SHG (Priority 50% Subsidy)">Women Farmer / SHG (Priority 50% Subsidy)</option>
                  <option value="SC/ST Category (Special 50% Subsidy)">SC/ST Category (Special 50% Subsidy)</option>
                  <option value="General Farmer">General Farmer - 30% Subsidy</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Bank Account (for schemes & DBT)</label>
                <input className="input-field" placeholder="Account number (optional)" value={farmerForm.bankAccount} onChange={e=>setFarmerForm({...farmerForm, bankAccount:e.target.value})} />
              </div>

              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Initial Walk-in Machinery Requirement / Query (Optional)</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Looking for combine harvester booking or power sprayer"
                  value={farmerForm.query}
                  onChange={e => setFarmerForm({ ...farmerForm, query: e.target.value })}
                />
              </div>
            </div>
            {existingFarmerWithPhone && (
              <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '12px', marginTop: 'var(--space-2)' }}>
                ⛔ Cannot register: Mobile number is already registered to {existingFarmerWithPhone.name} ({existingFarmerWithPhone.village}).
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={Boolean(existingFarmerWithPhone) || farmerForm.phone.length !== 10 || !farmerForm.name.trim()}
              style={{
                marginTop: 'var(--space-3)',
                opacity: (existingFarmerWithPhone || farmerForm.phone.length !== 10 || !farmerForm.name.trim()) ? 0.45 : 1,
                cursor: (existingFarmerWithPhone || farmerForm.phone.length !== 10 || !farmerForm.name.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              Register Farmer & Sync to CLIC
            </button>
          </form>
        </div>
      )}

      {/* Knowledge Bank */}
      {activeSection === 'knowledge' && (
        <div className="facilitator-form-card card">
          <div className="section-title"><Upload size={20}/> Knowledge Bank – Upload Resources</div>
          <p className="text-secondary" style={{ marginBottom:'var(--space-6)', fontSize:'var(--text-sm)' }}>
            Upload technical manuals, advice documents, and training materials in local languages.
          </p>
          <div className="knowledge-upload-area">
            <div className="upload-dropzone" onClick={() => document.getElementById('file-upload').click()}>
              <Upload size={40} className="upload-icon" />
              <div className="upload-title">Drag & Drop or Click to Upload</div>
              <div className="upload-sub">Supports: PDF, JPG, PNG, MP4, MP3 · Max 50MB</div>
              <div className="upload-langs">
                <span className="badge badge-green">English</span>
                <span className="badge badge-amber">తెలుగు</span>
                <span className="badge badge-sky">हिंदी</span>
              </div>
              <input type="file" id="file-upload" hidden multiple accept=".pdf,.jpg,.jpeg,.png,.mp4,.mp3" onChange={e => alert(`${e.target.files.length} file(s) selected. Ready to upload.`)} />
            </div>
          </div>
          <div className="form-grid" style={{ marginTop:'var(--space-5)' }}>
            <div className="form-group">
              <label>Resource Title</label>
              <input className="input-field" placeholder="e.g. SRI Paddy Guide / SRI వరి సాగు మార్గదర్శి" style={{ fontFamily:'var(--font-telugu)' }} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="input-field select-field">
                <option>Crop Guide</option><option>Pest Management</option><option>Soil Health</option>
                <option>Water Management</option><option>Scheme Information</option><option>Training Material</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select className="input-field select-field">
                <option>Telugu</option><option>Hindi</option><option>English</option>
              </select>
            </div>
            <div className="form-group">
              <label>Target Audience</label>
              <select className="input-field select-field">
                <option>All Farmers</option><option>Paddy Farmers</option><option>Cotton Farmers</option>
                <option>Women Farmers</option><option>SHG Groups</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary btn-lg">Upload to Knowledge Bank</button>
        </div>
      )}

      {/* Village Dashboard */}
      {activeSection === 'dashboard' && (
        <div className="village-dashboard">
          <div className="section-title">Recent Village Observations</div>
          <div className="village-table-wrapper card" style={{ padding:0 }}>
            <table className="market-table">
              <thead>
                <tr>
                  <th>Village</th><th>Date</th><th>Rainfall (mm)</th><th>GW Depth (m bgl)</th><th>Observer</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {VILLAGE_DATA.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.village}</strong></td>
                    <td className="text-muted">{row.date}</td>
                    <td>
                      <span style={{ color: row.rainfall > 15 ? '#52B788' : row.rainfall > 0 ? 'var(--color-amber)' : 'var(--color-text-muted)' }}>
                        {row.rainfall} mm
                      </span>
                    </td>
                    <td>
                      <span style={{ color: row.groundwater > 15 ? '#FF6B6B' : '#52B788' }}>{row.groundwater} m</span>
                    </td>
                    <td className="text-muted">{row.observers}</td>
                    <td><span className="badge badge-green">Synced</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={()=>alert('Exporting to CSV...')}>📥 Export as CSV</button>
        </div>
      )}
    </div>
  );
}
