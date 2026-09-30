import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  marketPrices,
  defaultStates,
  defaultDistricts,
  defaultVillages,
  defaultCommodities,
  defaultVillagePrices,
  markets,
  inputStore
} from '../data/marketData';
import {
  TrendingUp, TrendingDown, Minus, Search,
  Leaf, Zap, Wind, Settings, CircleDot, Droplets, MinimizeIcon,
  Plus, Trash2, Edit2, Save, MapPin, CheckCircle, Clock, ShieldCheck, User, Phone, Calendar,
  Building2, Award, FileText, Send, Sparkles, AlertCircle
} from 'lucide-react';
import '../styles/market.css';

const TABS = ['Market Prices', 'Input Store'];

export default function Market() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Market Prices');

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam) {
      const allTabs = [...TABS, '🔧 Manage Business'];
      const match = allTabs.find(t => t.toLowerCase().includes(tabParam.toLowerCase()));
      if (match) {
        setActiveTab(match);
      }
    }
  }, [tabParam]);

  // Database States (persisted via localStorage)
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [villagePrices, setVillagePrices] = useState([]);
  const [inputProducts, setInputProducts] = useState([]);

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

    // Commodities
    const savedComms = localStorage.getItem('clic_market_commodities');
    if (savedComms) {
      try { setCommodities(JSON.parse(savedComms)); } catch { setCommodities(defaultCommodities); }
    } else {
      setCommodities(defaultCommodities);
      localStorage.setItem('clic_market_commodities', JSON.stringify(defaultCommodities));
    }

    // Village Prices
    const savedRates = localStorage.getItem('clic_village_prices');
    if (savedRates) {
      try { setVillagePrices(JSON.parse(savedRates)); } catch { setVillagePrices(defaultVillagePrices); }
    } else {
      setVillagePrices(defaultVillagePrices);
      localStorage.setItem('clic_village_prices', JSON.stringify(defaultVillagePrices));
    }

    // Store products
    const savedStore = localStorage.getItem('clic_input_store');
    if (savedStore) {
      try { setInputProducts(JSON.parse(savedStore)); } catch { setInputProducts(inputStore); }
    } else {
      setInputProducts(inputStore);
      localStorage.setItem('clic_input_store', JSON.stringify(inputStore));
    }
  }, []);

  const saveVillages = (updated) => {
    setVillages(updated);
    localStorage.setItem('clic_market_villages', JSON.stringify(updated));
  };

  const saveVillagePrices = (updated) => {
    setVillagePrices(updated);
    localStorage.setItem('clic_village_prices', JSON.stringify(updated));
  };

  const saveProducts = (updated) => {
    setInputProducts(updated);
    localStorage.setItem('clic_input_store', JSON.stringify(updated));
  };

  const canManage = user?.role === 'facilitator' || user?.role === 'management' || user?.role === 'admin';
  const visibleTabs = canManage ? [...TABS, '🔧 Manage Business'] : TABS;

  return (
    <div className="market-page">
      <div className="page-header animate-fade-in-up">
        <h1>🛒 Market & Input Store</h1>
        <p className="text-secondary">Live APMC commodity rates, village-level market buying prices, and agro-input ordering.</p>
      </div>

      <div className="market-tabs animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        {visibleTabs.map(t => (
          <button
            key={t}
            className={`market-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="market-content animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {activeTab === 'Market Prices' && (
          <MarketPricesView
            villages={villages}
            districts={districts}
            commodities={commodities}
            villagePrices={villagePrices}
          />
        )}
        {activeTab === 'Input Store' && (
          <InputStoreView inputProducts={inputProducts} />
        )}
        {activeTab === '🔧 Manage Business' && canManage && (
          <ManageBusinessView
            states={states}
            villages={villages}
            districts={districts}
            commodities={commodities}
            villagePrices={villagePrices}
            saveVillagePrices={saveVillagePrices}
            inputProducts={inputProducts}
            saveProducts={saveProducts}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// MARKET PRICES VIEW (FARMER VIEW)
// ============================================================
function MarketPricesView({ villages, districts, commodities, villagePrices }) {
  const [search, setSearch] = useState('');
  const [market, setMarket] = useState('All Markets');
  const [sortBy, setSortBy] = useState('crop');

  // Commodity near village selector states
  const [selectedCommodity, setSelectedCommodity] = useState('Cotton');
  const [villageSearch, setVillageSearch] = useState('');

  // Sync default commodity when list is loaded
  useEffect(() => {
    if (commodities.length > 0 && !commodities.includes(selectedCommodity)) {
      setSelectedCommodity(commodities[0]);
    }
  }, [commodities, selectedCommodity]);

  // Filter APMC Prices
  const filteredAPMC = useMemo(() => {
    return marketPrices.filter(m => {
      const matchSearch = m.crop.toLowerCase().includes(search.toLowerCase()) || m.variety.toLowerCase().includes(search.toLowerCase());
      const matchMarket = market === 'All Markets' || m.market === market;
      return matchSearch && matchMarket;
    }).sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'change') return Math.abs(b.change) - Math.abs(a.change);
      return a.crop.localeCompare(b.crop);
    });
  }, [search, market, sortBy]);

  // Filter Village Prices for the Selected Commodity
  const filteredVillagePrices = useMemo(() => {
    return villagePrices
      .filter(vp => vp.crop === selectedCommodity)
      .map(vp => {
        const vInfo = villages.find(v => v.id === vp.villageId) || { name: 'Unknown', districtId: '' };
        const dInfo = districts.find(d => d.id === vInfo.districtId) || { name: 'Unknown', state: 'Telangana' };
        return {
          ...vp,
          villageName: vInfo.name,
          district: dInfo.name,
          state: dInfo.state
        };
      })
      .filter(vp => {
        return vp.villageName.toLowerCase().includes(villageSearch.toLowerCase()) ||
               vp.district.toLowerCase().includes(villageSearch.toLowerCase()) ||
               vp.state.toLowerCase().includes(villageSearch.toLowerCase());
      })
      .sort((a, b) => b.price - a.price); // Highest price first
  }, [villagePrices, villages, districts, selectedCommodity, villageSearch]);

  return (
    <div className="market-prices-view" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      
      {/* Village Prices Commodity Finder Widget */}
      <div className="card village-prices-finder-card" style={{ background: 'linear-gradient(135deg, var(--color-bg-card), rgba(82, 183, 136, 0.03))', borderLeft: '4px solid var(--color-forest-light)' }}>
        <div className="calc-header" style={{ marginBottom: 'var(--space-4)' }}>
          <MapPin size={22} className="text-green animate-pulse" />
          <div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>🔍 Find Prices in Surrounding Villages</h3>
            <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
              Select a crop commodity to instantly compare current farm-gate buying prices across surrounding villages.
            </p>
          </div>
        </div>

        <div className="village-prices-controls" style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ minWidth: '180px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Select Commodity</label>
            <select
              className="input-field select-field"
              value={selectedCommodity}
              onChange={e => setSelectedCommodity(e.target.value)}
            >
              {commodities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              {commodities.length === 0 && <option value="Cotton">Cotton</option>}
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Search Location (Village / District / State)</label>
            <div className="search-box" style={{ position: 'relative' }}>
              <Search size={16} className="sb-icon" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="search"
                className="input-field"
                placeholder="Type name, e.g. Munchireddypally or Nalgonda..."
                value={villageSearch}
                onChange={e => setVillageSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
        </div>

        {/* Village rate cards */}
        <div className="village-rates-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          {filteredVillagePrices.length === 0 ? (
            <div className="text-muted text-center" style={{ gridColumn: 'span 3', padding: 'var(--space-5)' }}>
              No village rates logged for commodity "{selectedCommodity}".
            </div>
          ) : (
            filteredVillagePrices.map(vp => (
              <div key={vp.id} className="village-rate-card card border-sky" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{vp.villageName}</h4>
                    <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>📍 {vp.district}, {vp.state}</span>
                  </div>
                  <span className={`change-badge cb-${vp.trend}`}>
                    {vp.trend === 'up' ? <TrendingUp size={10} /> : vp.trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                    {vp.change > 0 ? '+' : ''}{vp.change}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-2)', marginTop: 'var(--space-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="price-cell" style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span className="price-val" style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-forest-pale)' }}>₹{vp.price}</span>
                    <span className="price-unit" style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginLeft: 2 }}>/qtl</span>
                  </div>
                  <span className="text-muted" style={{ fontSize: '10px' }}>Updated: {vp.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* APMC Live rates table */}
      <div>
        <div className="section-title" style={{ marginBottom: 'var(--space-3)' }}>APMC Market Rates (Live Feed)</div>
        <div className="mp-controls">
          <div className="search-box">
            <Search size={16} className="sb-icon" />
            <input type="search" className="input-field" placeholder="Search crop or variety..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
          <select className="input-field select-field" value={market} onChange={e => setMarket(e.target.value)} style={{ width: 'auto' }}>
            {markets.map(m => <option key={m}>{m}</option>)}
          </select>
          <select className="input-field select-field" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 'auto' }}>
            <option value="crop">Sort: A–Z</option>
            <option value="price">Sort: Price ↓</option>
            <option value="change">Sort: Change ↓</option>
          </select>
        </div>
        
        <div className="mp-update-bar" style={{ marginTop: 'var(--space-3)' }}>
          <span className="badge badge-green">🟢 Live APMC Feed</span>
          <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Rates updated today · Source: AGMARKNET Telangana</span>
        </div>

        <div className="market-table-wrapper" style={{ marginTop: 'var(--space-3)' }}>
          <table className="market-table">
            <thead>
              <tr>
                <th>Crop</th><th>Variety</th><th>Market</th>
                <th>Price (₹/qtl)</th><th>Change</th><th>Buyers</th>
              </tr>
            </thead>
            <tbody>
              {filteredAPMC.map(m => (
                <tr key={m.id}>
                  <td className="crop-cell"><span className="crop-name">{m.crop}</span></td>
                  <td className="variety-cell"><span className="text-muted">{m.variety}</span></td>
                  <td><span className="market-name">{m.market}</span></td>
                  <td className="price-cell">
                    <span className="price-val">₹{m.price.toLocaleString()}</span>
                    <span className="price-unit">/qtl</span>
                  </td>
                  <td className="change-cell">
                    <span className={`change-badge cb-${m.trend}`}>
                      {m.trend === 'up' ? <TrendingUp size={12} /> : m.trend === 'down' ? <TrendingDown size={12} /> : <Minus size={12} />}
                      {m.change > 0 ? '+' : ''}{m.change}
                    </span>
                  </td>
                  <td className="buyers-cell">
                    <div className="buyers-list">
                      {m.buyers.map((b, i) => <span key={i} className="buyer-chip">{b}</span>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// INPUT STORE VIEW
// ============================================================
function InputStoreView({ inputProducts }) {
  const [cat, setCat] = useState('All');

  const categories = useMemo(() => {
    return ['All', ...new Set(inputProducts.map(i => i.category))];
  }, [inputProducts]);

  const filtered = inputProducts.filter(i => cat === 'All' || i.category === cat);

  return (
    <div className="input-store-view">
      <div className="cat-chips" style={{ marginBottom: 'var(--space-4)' }}>
        {categories.map(c => (
          <button
            key={c}
            className={`cat-chip ${cat === c ? 'active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="input-grid stagger">
        {filtered.map(item => (
          <div key={item.id} className="input-card card">
            <div className="input-card-top">
              <span className={`badge ${item.category === 'Bio-Fertilizer' ? 'badge-green' : item.category === 'Seeds' ? 'badge-amber' : 'badge-sky'}`}>
                {item.category}
              </span>
              <span className="input-stock">
                {item.stock > 50 ? '🟢 In Stock' : item.stock > 0 ? '🟡 Low Stock' : '🔴 Out of Stock'}
              </span>
            </div>
            <div className="input-name">{item.name}</div>
            {item.storeName && (
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>🏪 {item.storeName}</span>
                {item.storeVillage && <span className="text-muted">({item.storeVillage})</span>}
              </div>
            )}
            <div className="input-desc">{item.description}</div>
            {item.dosage && (
              <div style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px', fontStyle: 'italic' }}>
                💊 Dosage: {item.dosage}
              </div>
            )}
            <div className="input-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="input-price">₹{item.price}<span>/{item.unit}</span></div>
              <span className="text-secondary" style={{ fontSize: '11px' }}>Available: <strong>{item.stock} {item.unit}s</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// 🔧 MANAGE BUSINESS VIEW (CRUD)
// ============================================================
function ManageBusinessView({
  states,
  villages,
  districts,
  commodities,
  villagePrices, saveVillagePrices,
  inputProducts, saveProducts
}) {
  const [subTab, setSubTab] = useState('Village Rates');

  return (
    <div className="manage-business-view">
      <div className="subtabs-bar">
        {['Village Rates', 'Input Store Products'].map(st => (
          <button
            key={st}
            className={`subtab-btn ${subTab === st ? 'active' : ''}`}
            onClick={() => setSubTab(st)}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="mgmt-content" style={{ marginTop: 'var(--space-4)' }}>
        {subTab === 'Village Rates' && (
          <RatesManager
            states={states}
            villages={villages}
            districts={districts}
            commodities={commodities}
            villagePrices={villagePrices}
            saveVillagePrices={saveVillagePrices}
          />
        )}
        {subTab === 'Input Store Products' && (
          <ProductsManager inputProducts={inputProducts} saveProducts={saveProducts} />
        )}
      </div>
    </div>
  );
}


// ── 2. RATES MANAGER ────────────────────────────────────────
function RatesManager({ states, villages, districts, commodities, villagePrices, saveVillagePrices }) {
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [crop, setCrop] = useState(commodities[0] || 'Cotton');
  const [variety, setVariety] = useState('');
  const [villageId, setVillageId] = useState('');
  const [price, setPrice] = useState('');
  const [trend, setTrend] = useState('up');
  const [change, setChange] = useState('');
  const [date, setDate] = useState('Jul 21');

  // Hierarchy filter states in form
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrictId, setSelectedDistrictId] = useState('');

  // Sync crop selection when commodities change
  useEffect(() => {
    if (commodities.length > 0 && !commodities.includes(crop)) {
      setCrop(commodities[0]);
    }
  }, [commodities, crop]);

  // Sync initial selectors when lists load
  useEffect(() => {
    if (states.length > 0 && districts.length > 0 && villages.length > 0 && !selectedState) {
      const initialSt = states[0] || '';
      setSelectedState(initialSt);
      const sDists = districts.filter(d => d.state === initialSt);
      const initialDId = sDists[0]?.id || '';
      setSelectedDistrictId(initialDId);
      const dVils = villages.filter(v => v.districtId === initialDId);
      setVillageId(dVils[0]?.id || '');
    }
  }, [states, districts, villages, selectedState]);

  const handleEdit = (vp) => {
    setEditingId(vp.id);
    setCrop(vp.crop);
    setVariety(vp.variety || '');
    setVillageId(vp.villageId);
    setPrice(vp.price);
    setTrend(vp.trend || 'up');
    setChange(vp.change || '');
    setDate(vp.date || 'Jul 21');

    // Find state and district of the village
    const v = villages.find(vil => vil.id === vp.villageId);
    const d = districts.find(dist => dist.id === v?.districtId);
    setSelectedState(d ? d.state : (states[0] || ''));
    setSelectedDistrictId(v ? v.districtId : '');
  };

  const handleAddNew = () => {
    setEditingId('new');
    setCrop(commodities[0] || 'Cotton');
    setVariety('');
    setPrice('');
    setTrend('up');
    setChange('');
    setDate('Jul 21');

    // Setup initial state, district, village hierarchy
    const initialSt = states[0] || '';
    setSelectedState(initialSt);
    
    const sDists = districts.filter(d => d.state === initialSt);
    const initialDId = sDists[0]?.id || '';
    setSelectedDistrictId(initialDId);

    const dVils = villages.filter(v => v.districtId === initialDId);
    setVillageId(dVils[0]?.id || '');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!price || !villageId) {
      alert('Price and Village are required.');
      return;
    }

    const newObj = {
      id: editingId === 'new' ? Date.now() : editingId,
      crop,
      variety,
      villageId,
      price: Number(price),
      trend,
      change: Number(change) || 0,
      date
    };

    let updated;
    if (editingId === 'new') {
      updated = [newObj, ...villagePrices];
    } else {
      updated = villagePrices.map(item => item.id === editingId ? newObj : item);
    }

    saveVillagePrices(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this price entry?')) {
      saveVillagePrices(villagePrices.filter(item => item.id !== id));
    }
  };

  return (
    <div className="rates-manager">
      {editingId ? (
        <div className="card form-card animate-fade-in">
          <div className="section-title">
            <Save size={16} className="text-green" />
            <span>{editingId === 'new' ? 'Record New Village Commodity Price' : 'Edit Village Price'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              
              {/* State Filter */}
              <div className="form-group">
                <label>State</label>
                <select
                  className="input-field select-field"
                  value={selectedState}
                  onChange={e => {
                    const st = e.target.value;
                    setSelectedState(st);
                    const sDists = districts.filter(d => d.state === st);
                    const firstDId = sDists[0]?.id || '';
                    setSelectedDistrictId(firstDId);
                    const dVils = villages.filter(v => v.districtId === firstDId);
                    setVillageId(dVils[0]?.id || '');
                  }}
                >
                  {states.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div className="form-group">
                <label>District</label>
                <select
                  className="input-field select-field"
                  value={selectedDistrictId}
                  onChange={e => {
                    const dId = e.target.value;
                    setSelectedDistrictId(dId);
                    const dVils = villages.filter(v => v.districtId === dId);
                    setVillageId(dVils[0]?.id || '');
                  }}
                >
                  {districts.filter(d => d.state === selectedState).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Target Village */}
              <div className="form-group">
                <label>Target Village *</label>
                <select
                  className="input-field select-field"
                  value={villageId}
                  onChange={e => setVillageId(e.target.value)}
                  required
                >
                  {villages.filter(v => v.districtId === selectedDistrictId).map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                  {villages.filter(v => v.districtId === selectedDistrictId).length === 0 && (
                    <option value="">No villages mapped in this district</option>
                  )}
                </select>
              </div>

              {/* Commodity */}
              <div className="form-group">
                <label>Commodity *</label>
                <select
                  className="input-field select-field"
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                >
                  {commodities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Variety */}
              <div className="form-group">
                <label>Variety / Grade</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Medium Staple, Desi"
                  value={variety}
                  onChange={e => setVariety(e.target.value)}
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label>Buying Price (₹ / Quintal) *</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 7200"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                />
              </div>

              {/* Trend */}
              <div className="form-group">
                <label>Trend Direction</label>
                <select
                  className="input-field select-field"
                  value={trend}
                  onChange={e => setTrend(e.target.value)}
                >
                  <option value="up">📈 Up (Price Increased)</option>
                  <option value="down">📉 Down (Price Decreased)</option>
                  <option value="flat">➖ Flat (Stable)</option>
                </select>
              </div>

              {/* Change */}
              <div className="form-group">
                <label>Daily Change (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g. 50"
                  value={change}
                  onChange={e => setChange(e.target.value)}
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label>Date String</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Jul 21"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Village Price</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card list-card">
          <div className="library-action-header">
            <div>
              <div className="section-title" style={{ margin: 0 }}>Village Commodity Farm-Gate Prices</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Current buying prices at village collection centres
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Village Price
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Location (Village & District)</th>
                  <th>Price (₹/qtl)</th>
                  <th>Trend</th>
                  <th>Change</th>
                  <th>Date</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {villagePrices.map(vp => {
                  const v = villages.find(vil => vil.id === vp.villageId);
                  const d = districts.find(dist => dist.id === v?.districtId);
                  return (
                    <tr key={vp.id}>
                      <td>
                        <strong>{vp.crop}</strong>
                        {vp.variety && <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{vp.variety}</div>}
                      </td>
                      <td>
                        <strong>{v ? v.name : vp.villageId}</strong>
                        {d && <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>📍 {d.name}, {d.state}</div>}
                      </td>
                      <td><strong>₹{vp.price}</strong></td>
                      <td>
                        <span className={`change-badge cb-${vp.trend}`} style={{ display: 'inline-flex' }}>
                          {vp.trend === 'up' ? <TrendingUp size={10} /> : vp.trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                          {vp.trend}
                        </span>
                      </td>
                      <td>{vp.change > 0 ? `+₹${vp.change}` : vp.change < 0 ? `-₹${Math.abs(vp.change)}` : '₹0'}</td>
                      <td>{vp.date}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="btn-icon text-sky" style={{ marginRight: '12px' }} onClick={() => handleEdit(vp)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn-icon text-alert" onClick={() => handleDelete(vp.id)}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// INPUT STORE PRODUCTS MANAGER ──────────────────────────
// ============================================================
function ProductsManager({ inputProducts, saveProducts }) {
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Bio-Fertilizer');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');

  const handleEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setUnit(p.unit);
    setStock(p.stock);
    setDescription(p.description);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setName('');
    setCategory('Bio-Fertilizer');
    setPrice('');
    setUnit('kg');
    setStock('');
    setDescription('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      alert('Name, price and stock are required.');
      return;
    }

    const newObj = {
      id: editingId === 'new' ? Date.now() : editingId,
      name,
      category,
      price: Number(price),
      unit,
      stock: Number(stock),
      description
    };

    let updated;
    if (editingId === 'new') {
      updated = [newObj, ...inputProducts];
    } else {
      updated = inputProducts.map(item => item.id === editingId ? newObj : item);
    }

    saveProducts(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      saveProducts(inputProducts.filter(item => item.id !== id));
    }
  };

  return (
    <div className="products-manager">
      {editingId ? (
        <div className="card form-card animate-fade-in">
          <div className="section-title">
            <Save size={16} className="text-green" />
            <span>{editingId === 'new' ? 'Add Input Store Product' : 'Edit Product'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" className="input-field" placeholder="e.g. Bio-Potash" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select className="input-field select-field" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Bio-Fertilizer">Bio-Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Micro-Nutrients">Micro-Nutrients</option>
                  <option value="Bio-Pesticide">Bio-Pesticide</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" className="input-field" placeholder="e.g. 450" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Unit</label>
                <input type="text" className="input-field" placeholder="e.g. kg, liter, bag" value={unit} onChange={e => setUnit(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Available Stock (Units) *</label>
                <input type="number" className="input-field" placeholder="e.g. 100" value={stock} onChange={e => setStock(e.target.value)} required />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Description</label>
                <textarea className="input-field" placeholder="Short description of product..." value={description} onChange={e => setDescription(e.target.value)} rows={2} />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Product</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card list-card">
          <div className="library-action-header">
            <div>
              <div className="section-title" style={{ margin: 0 }}>Input Store Inventory</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Manage seeds, bio-fertilizers, and farm input stocks
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Product
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Available</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inputProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                      {p.description && <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{p.description}</div>}
                    </td>
                    <td><span className="badge badge-sky">{p.category}</span></td>
                    <td><strong>₹{p.price}/{p.unit}</strong></td>
                    <td>
                      <span className={`badge ${p.stock > 50 ? 'badge-green' : p.stock > 0 ? 'badge-amber' : 'badge-alert'}`}>
                        {p.stock} {p.unit}s
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} onClick={() => handleEdit(p)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" onClick={() => handleDelete(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
