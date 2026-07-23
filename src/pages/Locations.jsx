import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  defaultStates,
  defaultDistricts,
  defaultVillages
} from '../data/marketData';
import { Plus, Trash2, MapPin, Edit2, Save, X } from 'lucide-react';
import '../styles/market.css';

export default function Locations() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [activeLocTab, setActiveLocTab] = useState('States');

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam) {
      const allTabs = ['States', 'Districts', 'Villages'];
      const match = allTabs.find(t => t.toLowerCase().includes(tabParam.toLowerCase()));
      if (match) {
        setActiveLocTab(match);
      }
    }
  }, [tabParam]);

  // Input states (Add Forms)
  const [stateName, setStateName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [villageName, setVillageName] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // Inline Editing States
  const [editingState, setEditingState] = useState(null); // stores name of state being edited
  const [editStateValue, setEditStateValue] = useState('');

  const [editingDistrictId, setEditingDistrictId] = useState(null);
  const [editDistrictName, setEditDistrictName] = useState('');
  const [editDistrictState, setEditDistrictState] = useState('');

  const [editingVillageId, setEditingVillageId] = useState(null);
  const [editVillageName, setEditVillageName] = useState('');
  const [editVillageState, setEditVillageState] = useState('');
  const [editVillageDistId, setEditVillageDistId] = useState('');

  // Load from localStorage or fallback to seeds
  useEffect(() => {
    // States
    const savedStates = localStorage.getItem('clic_states');
    if (savedStates) {
      try { setStates(JSON.parse(savedStates)); } catch { setStates(defaultStates); }
    } else {
      setStates(defaultStates);
      localStorage.setItem('clic_states', JSON.stringify(defaultStates));
    }

    // Districts
    const savedDist = localStorage.getItem('clic_districts');
    if (savedDist) {
      try { setDistricts(JSON.parse(savedDist)); } catch { setDistricts(defaultDistricts); }
    } else {
      setDistricts(defaultDistricts);
      localStorage.setItem('clic_districts', JSON.stringify(defaultDistricts));
    }

    // Villages
    const savedVillages = localStorage.getItem('clic_market_villages');
    if (savedVillages) {
      try { setVillages(JSON.parse(savedVillages)); } catch { setVillages(defaultVillages); }
    } else {
      setVillages(defaultVillages);
      localStorage.setItem('clic_market_villages', JSON.stringify(defaultVillages));
    }
  }, []);

  // Sync selectors
  useEffect(() => {
    if (states.length > 0 && !selectedState) {
      setSelectedState(states[0]);
    }
  }, [states, selectedState]);

  useEffect(() => {
    const stateDists = districts.filter(d => d.state === selectedState);
    if (stateDists.length > 0) {
      setSelectedDistrict(stateDists[0].id);
    } else {
      setSelectedDistrict('');
    }
  }, [districts, selectedState]);

  const saveStates = (updated) => {
    setStates(updated);
    localStorage.setItem('clic_states', JSON.stringify(updated));
  };

  const saveDistricts = (updated) => {
    setDistricts(updated);
    localStorage.setItem('clic_districts', JSON.stringify(updated));
  };

  const saveVillages = (updated) => {
    setVillages(updated);
    localStorage.setItem('clic_market_villages', JSON.stringify(updated));
  };

  // Add Handlers
  const handleAddState = (e) => {
    e.preventDefault();
    const trimmed = stateName.trim();
    if (!trimmed) return;
    if (states.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      alert('State already registered.');
      return;
    }
    saveStates([...states, trimmed]);
    setStateName('');
    alert('State added.');
  };

  const handleAddDistrict = (e) => {
    e.preventDefault();
    const trimmed = districtName.trim();
    if (!trimmed || !selectedState) return;
    if (districts.some(d => d.name.toLowerCase() === trimmed.toLowerCase() && d.state === selectedState)) {
      alert('District already registered under this State.');
      return;
    }
    const newDist = {
      id: `d-${Date.now()}`,
      name: trimmed,
      state: selectedState
    };
    saveDistricts([...districts, newDist]);
    setDistrictName('');
    alert('District added.');
  };

  const handleAddVillage = (e) => {
    e.preventDefault();
    const trimmed = villageName.trim();
    if (!trimmed || !selectedDistrict) {
      alert('Please register a district first.');
      return;
    }
    if (villages.some(v => v.name.toLowerCase() === trimmed.toLowerCase() && v.districtId === selectedDistrict)) {
      alert('Village already registered under this District.');
      return;
    }
    const newVil = {
      id: `v-${Date.now()}`,
      name: trimmed,
      districtId: selectedDistrict
    };
    saveVillages([...villages, newVil]);
    setVillageName('');
    alert('Village added.');
  };

  // Delete Handlers
  const handleDeleteState = (sName) => {
    if (window.confirm(`Delete State "${sName}"? (Districts and villages in it will be orphaned)`)) {
      saveStates(states.filter(s => s !== sName));
    }
  };

  const handleDeleteDistrict = (id) => {
    if (window.confirm('Delete this district? (Villages inside it will be orphaned)')) {
      saveDistricts(districts.filter(d => d.id !== id));
    }
  };

  const handleDeleteVillage = (id) => {
    if (window.confirm('Delete this village?')) {
      saveVillages(villages.filter(v => v.id !== id));
    }
  };

  // State Edit Handlers
  const startEditState = (s) => {
    setEditingState(s);
    setEditStateValue(s);
  };

  const handleSaveStateEdit = (e) => {
    e.preventDefault();
    const trimmed = editStateValue.trim();
    if (!trimmed) return;
    if (states.some(s => s.toLowerCase() === trimmed.toLowerCase() && s !== editingState)) {
      alert('State name already exists.');
      return;
    }
    // Update States
    const updatedStates = states.map(s => s === editingState ? trimmed : s);
    saveStates(updatedStates);

    // Cascade update to Districts belonging to this state
    const updatedDistricts = districts.map(d => d.state === editingState ? { ...d, state: trimmed } : d);
    saveDistricts(updatedDistricts);

    setEditingState(null);
    alert('State updated successfully.');
  };

  // District Edit Handlers
  const startEditDistrict = (d) => {
    setEditingDistrictId(d.id);
    setEditDistrictName(d.name);
    setEditDistrictState(d.state);
  };

  const handleSaveDistrictEdit = (e) => {
    e.preventDefault();
    const trimmed = editDistrictName.trim();
    if (!trimmed) return;
    const updatedDistricts = districts.map(d =>
      d.id === editingDistrictId ? { ...d, name: trimmed, state: editDistrictState } : d
    );
    saveDistricts(updatedDistricts);
    setEditingDistrictId(null);
    alert('District updated successfully.');
  };

  // Village Edit Handlers
  const startEditVillage = (v) => {
    const d = districts.find(dist => dist.id === v.districtId) || { state: states[0] || 'Telangana' };
    setEditingVillageId(v.id);
    setEditVillageName(v.name);
    setEditVillageState(d.state);
    setEditVillageDistId(v.districtId);
  };

  const handleSaveVillageEdit = (e) => {
    e.preventDefault();
    const trimmed = editVillageName.trim();
    if (!trimmed || !editVillageDistId) {
      alert('Village name and district are required.');
      return;
    }
    const updatedVillages = villages.map(v =>
      v.id === editingVillageId ? { ...v, name: trimmed, districtId: editVillageDistId } : v
    );
    saveVillages(updatedVillages);
    setEditingVillageId(null);
    alert('Village updated successfully.');
  };

  const currentDistrictsList = districts.filter(d => d.state === selectedState);
  const editVillageDistrictsList = districts.filter(d => d.state === editVillageState);
  const isAuthorized = user?.role === 'facilitator' || user?.role === 'management';

  if (!isAuthorized) {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-8)' }}>
        <h2>Access Denied</h2>
        <p className="text-secondary">You do not have the required permissions to view location directories.</p>
      </div>
    );
  }

  return (
    <div className="locations-grains-page animate-fade-in-up">
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <h1>📍 Locations Directory</h1>
        <p className="text-secondary">Manage regional hierarchies (States, Districts, Villages) and crop commodities.</p>
      </div>

      <div className="locations-grains-manager card">
        <div className="section-title">
          <MapPin size={18} className="text-sky" />
          <span>Manage Directories</span>
        </div>

        <div className="sub-submenu-bar" style={{ display: 'flex', gap: 'var(--space-2)', margin: 'var(--space-4) 0', borderBottom: '1px dashed var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          {['States', 'Districts', 'Villages'].map(tab => (
            <button
              key={tab}
              type="button"
              className={`subtab-btn ${activeLocTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveLocTab(tab);
                setEditingState(null);
                setEditingDistrictId(null);
                setEditingVillageId(null);
              }}
              style={{ fontSize: 'var(--text-xs)', padding: '4px 10px' }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="loc-tab-content animate-fade-in">
          {/* States Submenu */}
          {activeLocTab === 'States' && (
            <div>
              <form onSubmit={handleAddState} style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="State Name (e.g. Telangana)"
                  value={stateName}
                  onChange={e => setStateName(e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary"><Plus size={14} /> Add State</button>
              </form>
              <table className="logs-table">
                <thead><tr><th>State Name</th><th style={{ width: '120px', textAlign: 'center' }}>Actions</th></tr></thead>
                <tbody>
                  {states.map((s, i) => (
                    <tr key={i}>
                      {editingState === s ? (
                        <td colSpan={2}>
                          <form onSubmit={handleSaveStateEdit} style={{ display: 'flex', gap: 10 }}>
                            <input
                              type="text"
                              className="input-field"
                              value={editStateValue}
                              onChange={e => setEditStateValue(e.target.value)}
                              required
                              style={{ flex: 1 }}
                            />
                            <button type="submit" className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingState(null)}><X size={14} /> Cancel</button>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="font-semibold text-green">{s}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="btn-icon text-sky" style={{ marginRight: 12 }} onClick={() => startEditState(s)}><Edit2 size={14} /></button>
                            <button className="btn-icon text-alert" onClick={() => handleDeleteState(s)}><Trash2 size={14} /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Districts Submenu */}
          {activeLocTab === 'Districts' && (
            <div>
              <form onSubmit={handleAddDistrict} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr auto', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <select className="input-field select-field" value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  type="text"
                  className="input-field"
                  placeholder="District Name (e.g. Nalgonda)"
                  value={districtName}
                  onChange={e => setDistrictName(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary"><Plus size={14} /> Add District</button>
              </form>
              <table className="logs-table">
                <thead><tr><th>District Name</th><th>State</th><th style={{ width: '120px', textAlign: 'center' }}>Actions</th></tr></thead>
                <tbody>
                  {districts.map(d => (
                    <tr key={d.id}>
                      {editingDistrictId === d.id ? (
                        <td colSpan={3}>
                          <form onSubmit={handleSaveDistrictEdit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr auto auto', gap: 10 }}>
                            <select className="input-field select-field" value={editDistrictState} onChange={e => setEditDistrictState(e.target.value)}>
                              {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input
                              type="text"
                              className="input-field"
                              value={editDistrictName}
                              onChange={e => setEditDistrictName(e.target.value)}
                              required
                            />
                            <button type="submit" className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingDistrictId(null)}><X size={14} /> Cancel</button>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="font-semibold text-green">{d.name}</td>
                          <td><span className="badge badge-sky">{d.state}</span></td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="btn-icon text-sky" style={{ marginRight: 12 }} onClick={() => startEditDistrict(d)}><Edit2 size={14} /></button>
                            <button className="btn-icon text-alert" onClick={() => handleDeleteDistrict(d.id)}><Trash2 size={14} /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Villages Submenu */}
          {activeLocTab === 'Villages' && (
            <div>
              <form onSubmit={handleAddVillage} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr auto', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <select className="input-field select-field" value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="input-field select-field" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
                  {currentDistrictsList.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                  {currentDistrictsList.length === 0 && <option value="">No districts registered</option>}
                </select>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Village Name (e.g. Chandampet)"
                  value={villageName}
                  onChange={e => setVillageName(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary"><Plus size={14} /> Add Village</button>
              </form>
              <table className="logs-table">
                <thead><tr><th>Village Name</th><th>District</th><th>State</th><th style={{ width: '120px', textAlign: 'center' }}>Actions</th></tr></thead>
                <tbody>
                  {villages.map(v => {
                    const d = districts.find(dist => dist.id === v.districtId) || { name: 'Unknown', state: '-' };
                    return (
                      <tr key={v.id}>
                        {editingVillageId === v.id ? (
                          <td colSpan={4}>
                            <form onSubmit={handleSaveVillageEdit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr auto auto', gap: 10 }}>
                              <select className="input-field select-field" value={editVillageState} onChange={e => setEditVillageState(e.target.value)}>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <select className="input-field select-field" value={editVillageDistId} onChange={e => setEditVillageDistId(e.target.value)} required>
                                {editVillageDistrictsList.map(dist => (
                                  <option key={dist.id} value={dist.id}>{dist.name}</option>
                                ))}
                                {editVillageDistrictsList.length === 0 && <option value="">No districts</option>}
                              </select>
                              <input
                                type="text"
                                className="input-field"
                                value={editVillageName}
                                onChange={e => setEditVillageName(e.target.value)}
                                required
                              />
                              <button type="submit" className="btn btn-primary btn-sm"><Save size={14} /> Save</button>
                              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingVillageId(null)}><X size={14} /> Cancel</button>
                            </form>
                          </td>
                        ) : (
                          <>
                            <td className="font-semibold text-green">{v.name}</td>
                            <td>{d.name}</td>
                            <td><span className="badge badge-sky">{d.state}</span></td>
                            <td style={{ textAlign: 'center' }}>
                              <button className="btn-icon text-sky" style={{ marginRight: 12 }} onClick={() => startEditVillage(v)}><Edit2 size={14} /></button>
                              <button className="btn-icon text-alert" onClick={() => handleDeleteVillage(v.id)}><Trash2 size={14} /></button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
