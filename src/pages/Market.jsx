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
  chcEquipment,
  inputStore
} from '../data/marketData';
import {
  TrendingUp, TrendingDown, Minus, Search, ShoppingBag, Tractor,
  Leaf, Zap, Wind, Settings, CircleDot, Droplets, MinimizeIcon,
  Plus, Trash2, Edit2, Save, MapPin
} from 'lucide-react';
import '../styles/market.css';

const TABS = ['Market Prices', 'Equipment Hire (CHC)', 'Input Store'];
const iconMap = {
  tractor: <Tractor size={24} />,
  leaf: <Leaf size={24} />,
  settings: <Settings size={24} />,
  zap: <Zap size={24} />,
  wind: <Wind size={24} />,
  'circle-dot': <CircleDot size={24} />,
  droplets: <Droplets size={24} />,
  'minimize-2': <MinimizeIcon size={24} />
};

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
  const [equipmentList, setEquipmentList] = useState([]);
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

    // Equipment
    const savedChc = localStorage.getItem('clic_chc_equipment');
    if (savedChc) {
      try { setEquipmentList(JSON.parse(savedChc)); } catch { setEquipmentList(chcEquipment); }
    } else {
      setEquipmentList(chcEquipment);
      localStorage.setItem('clic_chc_equipment', JSON.stringify(chcEquipment));
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

  const saveEquipment = (updated) => {
    setEquipmentList(updated);
    localStorage.setItem('clic_chc_equipment', JSON.stringify(updated));
  };

  const saveProducts = (updated) => {
    setInputProducts(updated);
    localStorage.setItem('clic_input_store', JSON.stringify(updated));
  };

  const canManage = user?.role === 'facilitator' || user?.role === 'management';
  const visibleTabs = canManage ? [...TABS, '🔧 Manage Business'] : TABS;

  return (
    <div className="market-page">
      <div className="page-header animate-fade-in-up">
        <h1>🛒 Market & Business Services</h1>
        <p className="text-secondary">Live APMC rates, village-level commodity pricing, CHC equipment, and input ordering.</p>
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
        {activeTab === 'Equipment Hire (CHC)' && (
          <CHCView equipmentList={equipmentList} />
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
            equipmentList={equipmentList}
            saveEquipment={saveEquipment}
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
// CHC VIEW
// ============================================================
function CHCView({ equipmentList }) {
  const [booking, setBooking] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDays, setBookingDays] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  const handleBook = (eq) => { setBooking(eq); setConfirmed(false); };
  const handleConfirm = () => { setConfirmed(true); };

  return (
    <div className="chc-view">
      <div className="chc-intro card">
        <div className="section-title"><Tractor size={20} /> Custom Hiring Centre – Equipment Booking</div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Book farm machinery at subsidized rates. Available 7 days a week. Contact: 9876543210</p>
      </div>
      <div className="chc-grid stagger">
        {equipmentList.map(eq => (
          <div key={eq.id} className="chc-card card">
            <div className="chc-card-header">
              <div className="chc-icon">{iconMap[eq.icon] || <Tractor size={24} />}</div>
              <div className={`availability ${eq.available > 0 ? 'av-yes' : 'av-no'}`}>
                {eq.available > 0 ? `${eq.available}/${eq.total} Available` : 'All Booked'}
              </div>
            </div>
            <div className="chc-name">{eq.name}</div>
            <div className="chc-desc">{eq.description}</div>
            <div className="chc-pricing">
              <div className="chc-rate"><span className="rate-val">{eq.rate}</span><span className="rate-label">Hire Rate</span></div>
              <div className="chc-rate"><span className="rate-val">{eq.deposit}</span><span className="rate-label">Deposit</span></div>
            </div>
            <button
              className={`btn ${eq.available > 0 ? 'btn-primary' : 'btn-secondary'} w-full`}
              onClick={() => eq.available > 0 && handleBook(eq)}
              disabled={eq.available === 0}
            >
              {eq.available > 0 ? '📅 Book Now' : '⏳ Join Waitlist'}
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {booking && (
        <div className="pest-modal-overlay" onClick={() => setBooking(null)}>
          <div className="booking-modal glass-card" onClick={e => e.stopPropagation()}>
            {confirmed ? (
              <div className="booking-success text-center">
                <div className="success-icon" style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <h2>Booking Confirmed!</h2>
                <p>Your {booking.name} has been booked for {bookingDate}.<br />A confirmation SMS will be sent to your registered mobile.</p>
                <div className="badge badge-green" style={{ marginTop: 8 }}>Ref: CHC-{Math.floor(Math.random() * 9000) + 1000}</div>
                <br />
                <button className="btn btn-secondary" onClick={() => setBooking(null)} style={{ marginTop: 'var(--space-4)', width: '100%' }}>Close</button>
              </div>
            ) : (
              <>
                <h2>Book: {booking.name}</h2>
                <div className="chc-pricing" style={{ marginBottom: 'var(--space-4)', marginTop: 12 }}>
                  <div className="chc-rate"><span className="rate-val">{booking.rate}</span><span className="rate-label">Rate</span></div>
                  <div className="chc-rate"><span className="rate-val">{booking.deposit}</span><span className="rate-label">Deposit</span></div>
                </div>
                <div className="form-group">
                  <label>Date Required</label>
                  <input type="date" className="input-field" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label>Duration (days)</label>
                  <input type="number" className="input-field" value={bookingDays} min={1} max={7} onChange={e => setBookingDays(+e.target.value)} />
                </div>
                <div className="booking-actions" style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleConfirm} disabled={!bookingDate}>Confirm Booking</button>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setBooking(null)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// INPUT STORE VIEW
// ============================================================
function InputStoreView({ inputProducts }) {
  const [cat, setCat] = useState('All');
  const [cart, setCart] = useState([]);

  const categories = useMemo(() => {
    return ['All', ...new Set(inputProducts.map(i => i.category))];
  }, [inputProducts]);

  const filtered = inputProducts.filter(i => cat === 'All' || i.category === cat);

  const addToCart = (item) => {
    setCart(prev => prev.find(c => c.id === item.id) ? prev : [...prev, { ...item, qty: 1 }]);
  };

  return (
    <div className="input-store-view">
      {cart.length > 0 && (
        <div className="cart-bar card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-4)' }}>
          <ShoppingBag size={18} />
          <span>{cart.length} item{cart.length > 1 ? 's' : ''} in cart</span>
          <div className="cart-items-preview" style={{ flex: 1, display: 'flex', gap: 8, overflowX: 'auto' }}>
            {cart.map(c => <span key={c.id} className="cart-chip">{c.name}</span>)}
          </div>
          <button className="btn btn-amber btn-sm" onClick={() => { alert('Order placed! CLIC facilitator will contact you.'); setCart([]); }}>Place Order</button>
        </div>
      )}
      <div className="cat-chips" style={{ marginBottom: 'var(--space-4)' }}>
        {categories.map(c => <button key={c} className={`cat-chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div className="input-grid stagger">
        {filtered.map(item => (
          <div key={item.id} className="input-card card">
            <div className="input-card-top">
              <span className={`badge ${item.category === 'Bio-Fertilizer' ? 'badge-green' : item.category === 'Seeds' ? 'badge-amber' : 'badge-sky'}`}>{item.category}</span>
              <span className="input-stock">{item.stock > 50 ? '🟢 In Stock' : item.stock > 0 ? '🟡 Low Stock' : '🔴 Out of Stock'}</span>
            </div>
            <div className="input-name">{item.name}</div>
            <div className="input-desc">{item.description}</div>
            <div className="input-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <div className="input-price">₹{item.price}<span>/{item.unit}</span></div>
              <button className="btn btn-primary btn-sm" onClick={() => addToCart(item)} disabled={item.stock === 0}>
                {cart.find(c => c.id === item.id) ? '✓ Added' : '+ Add to Order'}
              </button>
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
  equipmentList, saveEquipment,
  inputProducts, saveProducts
}) {
  const [subTab, setSubTab] = useState('Village Rates');

  return (
    <div className="manage-business-view">
      <div className="subtabs-bar">
        {['Village Rates', 'CHC Equipment', 'Input Store Products'].map(st => (
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
        {subTab === 'CHC Equipment' && (
          <EquipmentManager equipmentList={equipmentList} saveEquipment={saveEquipment} />
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

  // Hierarchy States
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
            <Save size={16} className="text-sky" />
            <span>{editingId === 'new' ? 'Log New Village Price' : 'Edit Rate Entry'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Commodity / Crop *</label>
                <select className="input-field select-field" value={crop} onChange={e => setCrop(e.target.value)}>
                  {commodities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {commodities.length === 0 && <option value="Cotton">Cotton</option>}
                </select>
              </div>

              <div className="form-group">
                <label>State *</label>
                <select
                  className="input-field select-field"
                  value={selectedState}
                  onChange={e => {
                    const s = e.target.value;
                    setSelectedState(s);
                    const sDists = districts.filter(d => d.state === s);
                    const initialDId = sDists[0]?.id || '';
                    setSelectedDistrictId(initialDId);
                    const dVils = villages.filter(v => v.districtId === initialDId);
                    setVillageId(dVils[0]?.id || '');
                  }}
                  required
                >
                  {states.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>District *</label>
                <select
                  className="input-field select-field"
                  value={selectedDistrictId}
                  onChange={e => {
                    const dId = e.target.value;
                    setSelectedDistrictId(dId);
                    const dVils = villages.filter(v => v.districtId === dId);
                    setVillageId(dVils[0]?.id || '');
                  }}
                  required
                >
                  {districts.filter(d => d.state === selectedState).map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Village *</label>
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
                    <option value="">No villages in district</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Variety</label>
                <input type="text" className="input-field" placeholder="e.g. Swarna / BPT 5204" value={variety} onChange={e => setVariety(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Price (₹/qtl) *</label>
                <input type="number" className="input-field" placeholder="e.g. 6850" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Price Shift Trend</label>
                <select className="input-field select-field" value={trend} onChange={e => setTrend(e.target.value)}>
                  <option value="up">Price Up (Increasing)</option>
                  <option value="down">Price Down (Decreasing)</option>
                  <option value="flat">No Shift (Flat)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price Change Amount (₹)</label>
                <input type="number" className="input-field" placeholder="e.g. 50 or -30" value={change} onChange={e => setChange(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Reporting Date</label>
                <input type="text" className="input-field" placeholder="e.g. Jul 21" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Price Log</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card list-card">
          <div className="library-action-header">
            <div className="section-title">Village procurement rates database</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Log Price
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Variety</th>
                  <th>Village</th>
                  <th>Rate</th>
                  <th>Shift</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {villagePrices.map(vp => {
                  const v = villages.find(vil => vil.id === vp.villageId) || { name: 'Unknown', districtId: '' };
                  const d = districts.find(dist => dist.id === v.districtId) || { name: 'Unknown' };
                  return (
                    <tr key={vp.id}>
                      <td className="font-semibold text-green">{vp.crop}</td>
                      <td className="text-secondary">{vp.variety || '-'}</td>
                      <td><strong>{v.name}</strong> ({d.name})</td>
                      <td><strong>₹{vp.price}</strong>/qtl</td>
                      <td>
                        <span className={`change-badge cb-${vp.trend}`} style={{ fontSize: '10px' }}>
                          {vp.trend === 'up' ? '+' : ''}{vp.change}
                        </span>
                      </td>
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

// ── 3. CHC EQUIPMENT MANAGER ───────────────────────────────
function EquipmentManager({ equipmentList, saveEquipment }) {
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tractor');
  const [available, setAvailable] = useState(1);
  const [total, setTotal] = useState(1);
  const [rate, setRate] = useState('');
  const [deposit, setDeposit] = useState('');
  const [description, setDescription] = useState('');

  const handleEdit = (eq) => {
    setEditingId(eq.id);
    setName(eq.name);
    setIcon(eq.icon || 'tractor');
    setAvailable(eq.available);
    setTotal(eq.total);
    setRate(eq.rate);
    setDeposit(eq.deposit);
    setDescription(eq.description);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setName('');
    setIcon('tractor');
    setAvailable(1);
    setTotal(1);
    setRate('₹500/hr');
    setDeposit('₹1,000');
    setDescription('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) {
      alert('Equipment Name is required.');
      return;
    }

    const newObj = {
      id: editingId === 'new' ? Date.now() : editingId,
      name,
      icon,
      available: Number(available),
      total: Number(total),
      rate,
      deposit,
      description
    };

    let updated;
    if (editingId === 'new') {
      updated = [...equipmentList, newObj];
    } else {
      updated = equipmentList.map(item => item.id === editingId ? newObj : item);
    }

    saveEquipment(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this equipment?')) {
      saveEquipment(equipmentList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="equipment-manager">
      {editingId ? (
        <div className="card form-card animate-fade-in">
          <div className="section-title">
            <Save size={16} className="text-sky" />
            <span>{editingId === 'new' ? 'Add CHC Machinery' : 'Edit Machinery details'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Machinery Name *</label>
                <input type="text" className="input-field" placeholder="e.g. Combined Harvester" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Icon Symbol</label>
                <select className="input-field select-field" value={icon} onChange={e => setIcon(e.target.value)}>
                  <option value="tractor">🚜 Tractor</option>
                  <option value="leaf">🍃 Transplanter</option>
                  <option value="settings">⚙️ Tiller / Rotavator</option>
                  <option value="zap">⚡ Sprayer</option>
                  <option value="wind">💨 Thresher</option>
                  <option value="circle-dot">🔘 Drum Seeder</option>
                  <option value="droplets">💧 Irrigation Kit</option>
                  <option value="minimize-2">📏 Leveler</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subsidized Hire Rate *</label>
                <input type="text" className="input-field" placeholder="e.g. ₹600/hr or ₹1500/day" value={rate} onChange={e => setRate(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Refundable Deposit *</label>
                <input type="text" className="input-field" placeholder="e.g. ₹1,000" value={deposit} onChange={e => setDeposit(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Total Quantity in Fleet</label>
                <input type="number" className="input-field" value={total} onChange={e => setTotal(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Currently Available</label>
                <input type="number" className="input-field" value={available} onChange={e => setAvailable(e.target.value)} />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Machinery Description & Specs *</label>
                <textarea className="input-field" placeholder="Capacity, HP, fuel details..." value={description} onChange={e => setDescription(e.target.value)} rows={2} required />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Equipment</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card list-card">
          <div className="library-action-header">
            <div className="section-title">Custom hiring center machinery logs</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Machinery
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Hire Rate</th>
                  <th>Deposit</th>
                  <th>Fleet Status</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipmentList.map(eq => (
                  <tr key={eq.id}>
                    <td>
                      <span style={{ marginRight: 8, display: 'inline-block', verticalAlign: 'middle' }}>
                        {iconMap[eq.icon] || <Tractor size={18} />}
                      </span>
                      <strong>{eq.name}</strong>
                    </td>
                    <td>{eq.rate}</td>
                    <td>{eq.deposit}</td>
                    <td>{eq.available} / {eq.total} available</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} onClick={() => handleEdit(eq)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" onClick={() => handleDelete(eq.id)}>
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
  const [stock, setStock] = useState(100);
  const [description, setDescription] = useState('');

  const handleEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category || 'Bio-Fertilizer');
    setPrice(p.price);
    setUnit(p.unit || 'kg');
    setStock(p.stock || 100);
    setDescription(p.description);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setName('');
    setCategory('Bio-Fertilizer');
    setPrice('');
    setUnit('kg');
    setStock(100);
    setDescription('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert('Product Name and Price are required.');
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
      updated = [...inputProducts, newObj];
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
            <Save size={16} className="text-sky" />
            <span>{editingId === 'new' ? 'Add Input Store Product' : 'Edit Product details'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" className="input-field" placeholder="e.g. Azotobacter culture" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Product Category</label>
                <select className="input-field select-field" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Bio-Fertilizer">Bio-Fertilizer</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Botanical">Botanical (Biopesticide)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Subsidized Price (₹) *</label>
                <input type="number" className="input-field" placeholder="e.g. 50" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Selling Unit *</label>
                <input type="text" className="input-field" placeholder="e.g. kg / 200g packet / litre" value={unit} onChange={e => setUnit(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Stock Available (quantity)</label>
                <input type="number" className="input-field" value={stock} onChange={e => setStock(e.target.value)} />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Product Description & Specs *</label>
                <textarea className="input-field" placeholder="Dosage, crop usage guidelines, manufacturing date..." value={description} onChange={e => setDescription(e.target.value)} rows={2} required />
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
            <div className="section-title">Agri-input store catalog</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Product
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Stock status</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inputProducts.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><span className="badge badge-sky">{p.category}</span></td>
                    <td className="font-semibold text-green">₹{p.price}</td>
                    <td>{p.unit}</td>
                    <td>{p.stock} units</td>
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
