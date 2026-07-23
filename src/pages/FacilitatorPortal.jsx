import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { CloudRain, Droplets, Users, Upload, CheckCircle, Plus } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState('rainfall');
  const [submitted, setSubmitted] = useState(false);
  const [rainfallForm, setRainfallForm] = useState({ village:'', date:'', rainfall:'', gauge:'Manual', observer:'', notes:'' });
  const [gwForm, setGwForm] = useState({ village:'', date:'', depth:'', unit:'mbgl', wellId:'', method:'Measuring tape' });
  const [farmerForm, setFarmerForm] = useState({ name:'', telugu:'', village:'', phone:'', aadhaar:'', landholding:'', crops:'', bankAccount:'' });

  const handleSubmit = (e, form, setForm, defaults) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm(defaults); }, 3000);
  };

  return (
    <div className="facilitator-page">
      <div className="page-header">
        <div>
          <h1>👨‍💼 Facilitator Portal</h1>
          <p className="text-secondary">Data entry and management for CLIC village-level observations</p>
        </div>
        <div className="badge badge-sky">Logged in as Facilitator</div>
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
      </div>

      {submitted && (
        <div className="submit-success">
          <CheckCircle size={20}/> Data submitted successfully! Synced to CLIC database.
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

      {/* Farmer Registration */}
      {activeSection === 'farmer' && (
        <div className="facilitator-form-card card">
          <div className="section-title"><Users size={20}/> Farmer Registration</div>
          <p className="text-secondary" style={{ marginBottom:'var(--space-6)', fontSize:'var(--text-sm)' }}>
            Register new farmers in CLIC database. All fields support Telugu/Hindi Unicode input.
          </p>
          <form onSubmit={e => handleSubmit(e, farmerForm, setFarmerForm, { name:'', telugu:'', village:'', phone:'', aadhaar:'', landholding:'', crops:'', bankAccount:'' })}>
            <div className="form-grid">
              <div className="form-group">
                <label>Farmer Name (English)</label>
                <input className="input-field" placeholder="Full name" value={farmerForm.name} onChange={e=>setFarmerForm({...farmerForm, name:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Name in Telugu (తెలుగులో పేరు)</label>
                <input className="input-field" placeholder="e.g. రాము రెడ్డి" value={farmerForm.telugu} onChange={e=>setFarmerForm({...farmerForm, telugu:e.target.value})} style={{ fontFamily:'var(--font-telugu)' }} />
              </div>
              <div className="form-group">
                <label>Village (గ్రామం)</label>
                <input className="input-field" placeholder="Village name" value={farmerForm.village} onChange={e=>setFarmerForm({...farmerForm, village:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="tel" className="input-field" placeholder="10-digit mobile" value={farmerForm.phone} onChange={e=>setFarmerForm({...farmerForm, phone:e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Aadhaar Number (Last 4 digits)</label>
                <input type="text" maxLength={4} className="input-field" placeholder="XXXX" value={farmerForm.aadhaar} onChange={e=>setFarmerForm({...farmerForm, aadhaar:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Land Holding (acres)</label>
                <input type="number" step="0.5" min="0" className="input-field" placeholder="e.g. 3.5" value={farmerForm.landholding} onChange={e=>setFarmerForm({...farmerForm, landholding:e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Main Crops (పంటలు)</label>
                <input className="input-field" placeholder="e.g. Paddy, Cotton, Red Gram / వరి, పత్తి, కందులు" value={farmerForm.crops} onChange={e=>setFarmerForm({...farmerForm, crops:e.target.value})} style={{ fontFamily:'var(--font-telugu)' }} />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Bank Account (for schemes)</label>
                <input className="input-field" placeholder="Account number (optional)" value={farmerForm.bankAccount} onChange={e=>setFarmerForm({...farmerForm, bankAccount:e.target.value})} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg">Register Farmer</button>
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
