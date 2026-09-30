import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, CheckCircle, Clock,
  MapPin, Phone, ShieldCheck, Edit2, Trash2, Save, X,
  Building2, Sparkles, AlertCircle, Package, ArrowRight, Activity, UserCheck
} from 'lucide-react';
import { INITIAL_LIVESTOCK_SHOPS } from '../data/livestockShops';
import { DEFAULT_LIVESTOCK_PRODUCTS, livestockProductCategories } from '../data/livestockProducts';
import '../styles/market.css';

export const STORAGE_KEY_LS_SHOPS = 'clic_livestock_shops_master';
export const STORAGE_KEY_LS_PRODUCTS = 'clic_livestock_products_master';

export default function LivestockPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Role permissions
  const isSuperAdmin = user?.role === 'superadmin' || user?.roles?.includes('superadmin');
  const isManagement = user?.role === 'management' || user?.roles?.includes('management');
  const isFacilitator = user?.role === 'facilitator' || user?.roles?.includes('facilitator');
  const isAdminOrFacilitator = isSuperAdmin || isManagement || isFacilitator;
  const isLivestockEntrepreneur = user?.role === 'livestock_entrepreneur' || user?.roles?.includes('livestock_entrepreneur');

  // Active Main Tab
  const [activeTab, setActiveTab] = useState(isLivestockEntrepreneur ? 'inventory' : 'shops');

  // 1. Onboarded Livestock Shops State
  const [shops, setShops] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LS_SHOPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_LIVESTOCK_SHOPS;
  });

  // 2. Livestock Products State
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LS_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_LIVESTOCK_PRODUCTS;
  });

  // Identify My Assigned Shop for Livestock Entrepreneur
  const myShop = useMemo(() => {
    if (!user) return shops[0];
    const uPhone = (user.phone || '').toString().replace(/\D/g, '');
    const uEmail = (user.email || '').toLowerCase().trim();

    const matched = shops.find(s => {
      const sPhone = (s.phone || '').toString().replace(/\D/g, '');
      const sEmail = (s.email || '').toLowerCase().trim();
      return (uEmail && (sEmail === uEmail || uEmail.includes(s.id))) || (uPhone && sPhone === uPhone);
    });

    return matched || shops[0];
  }, [shops, user]);

  // Scoped Shops List for current user
  const scopedShops = useMemo(() => {
    if (isAdminOrFacilitator) return shops;
    if (isLivestockEntrepreneur) return myShop ? [myShop] : shops;
    return shops;
  }, [shops, isAdminOrFacilitator, isLivestockEntrepreneur, myShop]);

  // Filters
  const [selectedShopId, setSelectedShopId] = useState(isLivestockEntrepreneur ? myShop?.id || 'ls-shop-1' : 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [onboardSuccess, setOnboardSuccess] = useState(null);

  // Sync selectedShopId when LS entrepreneur logs in
  useEffect(() => {
    if (isLivestockEntrepreneur && myShop) {
      setSelectedShopId(myShop.id);
    }
  }, [isLivestockEntrepreneur, myShop]);

  // Onboarding Form
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    entrepreneurName: '',
    phone: '',
    email: '',
    village: 'Chandampet',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    licenseNumber: '',
    specialty: 'Cattle Feed, Mineral Mixtures & Dairy Equipment',
    bankAccount: ''
  });

  // Product Form
  const [productForm, setProductForm] = useState({
    shopId: isLivestockEntrepreneur ? myShop?.id || 'ls-shop-1' : (shops[0]?.id || 'ls-shop-1'),
    name: '',
    telugu: '',
    category: 'Feed & Fodder',
    species: 'Cattle & Buffalo',
    price: '',
    unit: '50kg bag',
    stock: '',
    dosage: '',
    description: ''
  });

  // Persist
  const saveShops = (updated) => {
    setShops(updated);
    localStorage.setItem(STORAGE_KEY_LS_SHOPS, JSON.stringify(updated));
  };

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY_LS_PRODUCTS, JSON.stringify(updated));
  };

  // Handle Onboard LS Shop (Admins & Facilitators only)
  const handleOnboardShop = (e) => {
    e.preventDefault();
    if (!isAdminOrFacilitator) {
      alert('Only Admins and Facilitators have permission to onboard new Livestock shops.');
      return;
    }
    if (!onboardForm.name || !onboardForm.entrepreneurName || !onboardForm.phone) {
      alert('Please fill all required shop details.');
      return;
    }

    const email = onboardForm.email || `ls.${onboardForm.village.toLowerCase().replace(/\s+/g, '')}@clic.in`;
    const newShop = {
      id: `ls-shop-${Date.now()}`,
      name: onboardForm.name,
      entrepreneurName: onboardForm.entrepreneurName,
      inCharge: onboardForm.entrepreneurName,
      phone: onboardForm.phone,
      email: email,
      role: 'livestock_entrepreneur',
      village: onboardForm.village,
      district: onboardForm.district,
      mandal: onboardForm.mandal,
      licenseNumber: onboardForm.licenseNumber || `TS-NLG-VET-${Date.now().toString().slice(-4)}`,
      specialty: onboardForm.specialty,
      productCount: 0,
      bankAccount: onboardForm.bankAccount || 'SBI - LS Account',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Auto-create user account in custom users for direct login
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const newUser = {
      id: Date.now(),
      name: onboardForm.entrepreneurName,
      phone: onboardForm.phone,
      email: email,
      password: 'clic@2025',
      role: 'livestock_entrepreneur',
      roles: ['livestock_entrepreneur'],
      village: `${onboardForm.village} Hub`,
      district: onboardForm.district,
      state: 'Telangana',
      avatar: '🐄',
      designation: 'Livestock Entrepreneur & Mart Lead',
      status: 'Active'
    };
    localStorage.setItem('clic_custom_users', JSON.stringify([...customUsers, newUser]));

    const updated = [newShop, ...shops];
    saveShops(updated);
    setOnboardSuccess({
      type: 'Livestock Entrepreneur Shop',
      name: newShop.name,
      inCharge: newShop.entrepreneurName,
      email: email,
      phone: newShop.phone
    });

    setOnboardForm({
      name: '',
      entrepreneurName: '',
      phone: '',
      email: '',
      village: 'Chandampet',
      district: 'Nalgonda',
      mandal: 'Chandampet',
      licenseNumber: '',
      specialty: 'Cattle Feed, Mineral Mixtures & Dairy Equipment',
      bankAccount: ''
    });
    setShowOnboardModal(false);
  };

  // Handle Add Product
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) {
      alert('Please fill required product name, price, and stock quantity.');
      return;
    }

    const targetShopId = isLivestockEntrepreneur ? myShop.id : productForm.shopId;
    const linkedShop = shops.find(s => s.id === targetShopId) || myShop || shops[0];

    const newProduct = {
      id: Date.now(),
      productId: `LSP_${Date.now().toString().slice(-4)}`,
      shopId: linkedShop.id,
      shopName: linkedShop.name,
      shopVillage: linkedShop.village,
      shopPhone: linkedShop.phone,
      name: productForm.name,
      telugu: productForm.telugu || productForm.name,
      category: productForm.category,
      species: productForm.species,
      price: Number(productForm.price),
      unit: productForm.unit,
      stock: Number(productForm.stock),
      dosage: productForm.dosage || 'Standard veterinary dose',
      description: productForm.description || 'Quality veterinary input certified for livestock health and productivity.',
      status: Number(productForm.stock) > 0 ? 'In Stock' : 'Out of Stock'
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);

    // Update shop count
    const updatedShops = shops.map(s => s.id === linkedShop.id ? { ...s, productCount: (s.productCount || 0) + 1 } : s);
    saveShops(updatedShops);

    setProductForm({
      shopId: isLivestockEntrepreneur ? myShop.id : (shops[0]?.id || 'ls-shop-1'),
      name: '',
      telugu: '',
      category: 'Feed & Fodder',
      species: 'Cattle & Buffalo',
      price: '',
      unit: '50kg bag',
      stock: '',
      dosage: '',
      description: ''
    });
    setShowAddProductModal(false);
  };

  // Filtered Products (LS Entrepreneur sees ONLY their shop's products)
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Shop scope check
      if (isLivestockEntrepreneur) {
        if (p.shopId !== myShop?.id) return false;
      } else if (selectedShopId !== 'all') {
        if (p.shopId !== selectedShopId) return false;
      }

      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.species?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, isLivestockEntrepreneur, myShop, selectedShopId, selectedCategory, searchTerm]);

  return (
    <div className="market-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* Header */}
      <div className="page-header animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>🐄</span> Livestock Entrepreneur Portal
          </h1>
          <p className="text-secondary">
            {isLivestockEntrepreneur
              ? `Logged in as LS Entrepreneur: ${myShop?.name} (${myShop?.village}) · Managing your shop catalog.`
              : 'Admin & Facilitator Console: Onboard livestock enterprises & manage animal nutrition supplies.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Onboard Button ONLY for Admin and Facilitator */}
          {isAdminOrFacilitator && (
            <button className="btn btn-primary" onClick={() => setShowOnboardModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} /> ➕ Onboard LS Shop
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => setShowAddProductModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> 💊 Add LS Product
          </button>
        </div>
      </div>

      {/* Logged-in LS Entrepreneur Banner */}
      {isLivestockEntrepreneur && myShop && (
        <div className="card border-sky" style={{ background: 'rgba(37, 99, 235, 0.05)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🐄</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{myShop.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                📍 {myShop.village}, {myShop.district} · Owner: <strong>{myShop.entrepreneurName || myShop.inCharge}</strong> ({myShop.phone})
              </div>
            </div>
          </div>
          <span className="badge badge-green">🟢 Active Enterprise Account</span>
        </div>
      )}

      {/* Success Toast */}
      {onboardSuccess && (
        <div className="card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={24} color="#10B981" />
            <div>
              <h4 style={{ margin: 0, color: '#065F46', fontWeight: 'bold' }}>Successfully Onboarded {onboardSuccess.name}!</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#047857' }}>
                Entrepreneur: {onboardSuccess.inCharge} · Phone: {onboardSuccess.phone} · Login ID: {onboardSuccess.email} · Password: <code>clic@2025</code>
              </p>
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => setOnboardSuccess(null)}>Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="market-tabs" style={{ marginBottom: 'var(--space-4)' }}>
        {isAdminOrFacilitator && (
          <button className={`market-tab ${activeTab === 'shops' ? 'active' : ''}`} onClick={() => setActiveTab('shops')}>
            🏛️ All Onboarded LS Shops ({scopedShops.length})
          </button>
        )}
        <button className={`market-tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          💊 {isLivestockEntrepreneur ? 'My Veterinary & Feed Inventory' : 'Veterinary & Feed Inventory'} ({filteredProducts.length})
        </button>
      </div>

      {/* TAB 1: SHOPS DIRECTORY (Admin & Facilitator view) */}
      {activeTab === 'shops' && isAdminOrFacilitator && (
        <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
          {scopedShops.map(shop => {
            const shopProdCount = products.filter(p => p.shopId === shop.id).length;
            return (
              <div key={shop.id} className="card border-sky" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-green" style={{ fontSize: '11px', marginBottom: '4px' }}>{shop.status}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{shop.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      📍 {shop.village}, {shop.district}
                    </div>
                  </div>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{shopProdCount}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Products</div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', background: 'var(--color-bg-alt)', padding: '10px', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>👤 Entrepreneur:</strong> {shop.entrepreneurName || shop.inCharge}</div>
                  <div><strong>📞 Mobile:</strong> {shop.phone}</div>
                  <div><strong>✉️ Login Email:</strong> <code>{shop.email}</code></div>
                  <div><strong>📜 License:</strong> {shop.licenseNumber}</div>
                  <div><strong>🐄 Specialty:</strong> {shop.specialty}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setSelectedShopId(shop.id);
                      setActiveTab('inventory');
                    }}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    View Catalog <ArrowRight size={12} style={{ marginLeft: 4 }} />
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setProductForm(prev => ({ ...prev, shopId: shop.id }));
                      setShowAddProductModal(true);
                    }}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    ➕ Add Product
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: LS PRODUCTS INVENTORY */}
      {activeTab === 'inventory' && (
        <div>
          {/* Filters */}
          <div className="card" style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="search"
                className="input-field"
                placeholder="Search feeds, minerals, vaccines..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 32, width: '100%' }}
              />
            </div>

            {/* Shop switcher visible ONLY for Admin and Facilitator */}
            {isAdminOrFacilitator && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Shop:</label>
                <select
                  className="input-field select-field"
                  value={selectedShopId}
                  onChange={e => setSelectedShopId(e.target.value)}
                  style={{ width: 'auto', minWidth: '180px' }}
                >
                  <option value="all">All LS Shops ({shops.length})</option>
                  {shops.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.village})</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Category:</label>
              <select
                className="input-field select-field"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{ width: 'auto' }}
              >
                {livestockProductCategories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="input-grid stagger">
            {filteredProducts.length === 0 ? (
              <div className="text-muted text-center card" style={{ gridColumn: 'span 3', padding: 'var(--space-8)' }}>
                No livestock products found matching filters. Click <strong>"➕ Add LS Product"</strong> above to list inventory.
              </div>
            ) : (
              filteredProducts.map(item => (
                <div key={item.id} className="input-card card">
                  <div className="input-card-top">
                    <span className="badge badge-sky" style={{ fontSize: '10px' }}>
                      {item.category}
                    </span>
                    {item.species && (
                      <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                        🐾 {item.species}
                      </span>
                    )}
                    <span className="input-stock" style={{ marginLeft: 'auto' }}>
                      {item.stock > 10 ? '🟢 In Stock' : item.stock > 0 ? '🟡 Low Stock' : '🔴 Out'}
                    </span>
                  </div>
                  <div className="input-name">{item.name}</div>
                  {item.telugu && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 2 }}>{item.telugu}</div>}
                  {item.shopName && (
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>🏪 {item.shopName}</span>
                      {item.shopVillage && <span className="text-muted">({item.shopVillage})</span>}
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
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ONBOARD LS SHOP (Admin & Facilitator Only) */}
      {showOnboardModal && isAdminOrFacilitator && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="var(--color-primary)" /> Onboard Livestock Entrepreneur Shop
              </h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowOnboardModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleOnboardShop} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Shop / Enterprise Name *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Gokulam Dairy & Livestock Inputs Hub"
                  value={onboardForm.name}
                  onChange={e => setOnboardForm({ ...onboardForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Entrepreneur / Owner Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. P. Mallesh Yadav"
                    value={onboardForm.entrepreneurName}
                    onChange={e => setOnboardForm({ ...onboardForm, entrepreneurName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    className="input-field"
                    required
                    placeholder="e.g. 9876511223"
                    value={onboardForm.phone}
                    onChange={e => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Village / Location *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    value={onboardForm.village}
                    onChange={e => setOnboardForm({ ...onboardForm, village: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>District *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    value={onboardForm.district}
                    onChange={e => setOnboardForm({ ...onboardForm, district: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>License / Reg Number</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. TS-NLG-VET-2026-042"
                  value={onboardForm.licenseNumber}
                  onChange={e => setOnboardForm({ ...onboardForm, licenseNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Livestock Specialty</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Dairy Cattle Feeds, Sheep Mineral Licks, Backyard Chicks"
                  value={onboardForm.specialty}
                  onChange={e => setOnboardForm({ ...onboardForm, specialty: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowOnboardModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Onboarding</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PRODUCT FOR LS SHOP */}
      {showAddProductModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="var(--color-primary)" /> Add Livestock Product to Shop
              </h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowAddProductModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Shop selector: locked if LS Entrepreneur, selectable if Admin */}
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Target Livestock Shop *</label>
                {isLivestockEntrepreneur ? (
                  <input
                    type="text"
                    className="input-field"
                    disabled
                    value={`${myShop?.name} (${myShop?.village})`}
                    style={{ background: 'var(--color-bg-alt)', opacity: 0.8 }}
                  />
                ) : (
                  <select
                    className="input-field select-field"
                    required
                    value={productForm.shopId}
                    onChange={e => setProductForm({ ...productForm, shopId: e.target.value })}
                  >
                    {shops.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.village})</option>
                    ))}
                  </select>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Product Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Chelated Mineral Mixture"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Telugu Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. ఖనిజ లవణ మిశ్రమం"
                    value={productForm.telugu}
                    onChange={e => setProductForm({ ...productForm, telugu: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Category *</label>
                  <select
                    className="input-field select-field"
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    {livestockProductCategories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Target Species *</label>
                  <select
                    className="input-field select-field"
                    value={productForm.species}
                    onChange={e => setProductForm({ ...productForm, species: e.target.value })}
                  >
                    <option value="Cattle & Buffalo">Cattle & Buffalo</option>
                    <option value="Goat & Sheep">Goat & Sheep</option>
                    <option value="Poultry">Poultry</option>
                    <option value="Multi-Species">Multi-Species</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Price (₹) *</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    placeholder="e.g. 180"
                    value={productForm.price}
                    onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Unit *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. 1kg pack / 50kg bag"
                    value={productForm.unit}
                    onChange={e => setProductForm({ ...productForm, unit: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Initial Stock Qty *</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    placeholder="e.g. 50"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Dosage / Feeding Rate</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 50g daily per cow"
                    value={productForm.dosage}
                    onChange={e => setProductForm({ ...productForm, dosage: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Description</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Veterinary benefits, milk yield impact..."
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'var(--space-3)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddProductModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
