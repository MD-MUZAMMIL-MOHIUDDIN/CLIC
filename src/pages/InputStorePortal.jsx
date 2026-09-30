import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Plus, Search, Filter, CheckCircle, Clock,
  MapPin, Phone, ShieldCheck, Edit2, Trash2, Save, X,
  Building2, Sparkles, AlertCircle, Package, ArrowRight, Store, UserCheck
} from 'lucide-react';
import { INITIAL_INPUT_STORES } from '../data/inputStoreData';
import { DEFAULT_INPUT_PRODUCTS, inputStoreCategories } from '../data/inputProducts';
import '../styles/market.css';

export const STORAGE_KEY_INPUT_STORES = 'clic_input_stores_master';
export const STORAGE_KEY_INPUT_PRODUCTS = 'clic_input_products_master';

export default function InputStorePortal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Role permissions
  const isSuperAdmin = user?.role === 'superadmin' || user?.roles?.includes('superadmin');
  const isManagement = user?.role === 'management' || user?.roles?.includes('management');
  const isFacilitator = user?.role === 'facilitator' || user?.roles?.includes('facilitator');
  const isAdminOrFacilitator = isSuperAdmin || isManagement || isFacilitator;
  const isStoreManager = user?.role === 'store_manager' || user?.roles?.includes('store_manager');

  // Active Main Tab
  const [activeTab, setActiveTab] = useState(isStoreManager ? 'inventory' : 'stores');

  // 1. Onboarded Input Stores State
  const [stores, setStores] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INPUT_STORES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_INPUT_STORES;
  });

  // 2. Input Products State
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INPUT_PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_INPUT_PRODUCTS;
  });

  // Identify My Assigned Store for Store Manager
  const myStore = useMemo(() => {
    if (!user) return stores[0];
    const uPhone = (user.phone || '').toString().replace(/\D/g, '');
    const uEmail = (user.email || '').toLowerCase().trim();

    const matched = stores.find(s => {
      const sPhone = (s.phone || '').toString().replace(/\D/g, '');
      const sEmail = (s.email || '').toLowerCase().trim();
      return (uEmail && (sEmail === uEmail || uEmail.includes(s.id))) || (uPhone && sPhone === uPhone);
    });

    return matched || stores[0];
  }, [stores, user]);

  // Scoped Stores List for current user
  const scopedStores = useMemo(() => {
    if (isAdminOrFacilitator) return stores;
    if (isStoreManager) return myStore ? [myStore] : stores;
    return stores;
  }, [stores, isAdminOrFacilitator, isStoreManager, myStore]);

  // Selected Store for Filtering
  const [selectedStoreId, setSelectedStoreId] = useState(isStoreManager ? myStore?.id || 'store-1' : 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [onboardSuccess, setOnboardSuccess] = useState(null);

  // Sync selectedStoreId when store manager logs in
  useEffect(() => {
    if (isStoreManager && myStore) {
      setSelectedStoreId(myStore.id);
    }
  }, [isStoreManager, myStore]);

  // Onboarding Form
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    inCharge: '',
    phone: '',
    email: '',
    village: 'Chandampet',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    licenseNumber: '',
    specialty: 'Bio-Fertilizers & Certified Seeds',
    bankAccount: ''
  });

  // Product Form
  const [productForm, setProductForm] = useState({
    storeId: isStoreManager ? myStore?.id || 'store-1' : (stores[0]?.id || 'store-1'),
    name: '',
    telugu: '',
    category: 'Bio-Fertilizer',
    price: '',
    unit: '200g packet',
    stock: '',
    dosage: '',
    description: ''
  });

  // Persist Changes
  const saveStores = (updated) => {
    setStores(updated);
    localStorage.setItem(STORAGE_KEY_INPUT_STORES, JSON.stringify(updated));
  };

  const saveProducts = (updated) => {
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY_INPUT_PRODUCTS, JSON.stringify(updated));
  };

  // Handle Onboard Store (Admins & Facilitators only)
  const handleOnboardStore = (e) => {
    e.preventDefault();
    if (!isAdminOrFacilitator) {
      alert('Only Admins and Facilitators have permission to onboard new stores.');
      return;
    }
    if (!onboardForm.name || !onboardForm.inCharge || !onboardForm.phone) {
      alert('Please fill all required store details.');
      return;
    }

    const email = onboardForm.email || `input.${onboardForm.village.toLowerCase().replace(/\s+/g, '')}@clic.in`;
    const newStore = {
      id: `store-${Date.now()}`,
      name: onboardForm.name,
      inCharge: onboardForm.inCharge,
      phone: onboardForm.phone,
      email: email,
      role: 'store_manager',
      village: onboardForm.village,
      district: onboardForm.district,
      mandal: onboardForm.mandal,
      licenseNumber: onboardForm.licenseNumber || `TS-NLG-INP-${Date.now().toString().slice(-4)}`,
      specialty: onboardForm.specialty,
      productCount: 0,
      bankAccount: onboardForm.bankAccount || 'SBI - Agri Account',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Auto-create user account in custom users for direct login
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const newUser = {
      id: Date.now(),
      name: onboardForm.inCharge,
      phone: onboardForm.phone,
      email: email,
      password: 'clic@2025',
      role: 'store_manager',
      roles: ['store_manager'],
      village: `${onboardForm.village} Store`,
      district: onboardForm.district,
      state: 'Telangana',
      avatar: '🏬',
      designation: 'PACS Bio-Input Store In-Charge',
      status: 'Active'
    };
    localStorage.setItem('clic_custom_users', JSON.stringify([...customUsers, newUser]));

    const updated = [newStore, ...stores];
    saveStores(updated);
    setOnboardSuccess({
      type: 'Agri Input Store',
      name: newStore.name,
      inCharge: newStore.inCharge,
      email: email,
      phone: newStore.phone
    });

    setOnboardForm({
      name: '',
      inCharge: '',
      phone: '',
      email: '',
      village: 'Chandampet',
      district: 'Nalgonda',
      mandal: 'Chandampet',
      licenseNumber: '',
      specialty: 'Bio-Fertilizers & Certified Seeds',
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

    const targetStoreId = isStoreManager ? myStore.id : productForm.storeId;
    const linkedStore = stores.find(s => s.id === targetStoreId) || myStore || stores[0];

    const newProduct = {
      id: Date.now(),
      productId: `INP_${Date.now().toString().slice(-4)}`,
      storeId: linkedStore.id,
      storeName: linkedStore.name,
      storeVillage: linkedStore.village,
      storePhone: linkedStore.phone,
      name: productForm.name,
      telugu: productForm.telugu || productForm.name,
      category: productForm.category,
      price: Number(productForm.price),
      unit: productForm.unit,
      stock: Number(productForm.stock),
      dosage: productForm.dosage || 'Standard agronomic dose',
      description: productForm.description || 'Quality agricultural input certified for crop nourishment and protection.',
      status: Number(productForm.stock) > 0 ? 'In Stock' : 'Out of Stock'
    };

    const updated = [newProduct, ...products];
    saveProducts(updated);

    // Update store product count
    const updatedStores = stores.map(s => s.id === linkedStore.id ? { ...s, productCount: (s.productCount || 0) + 1 } : s);
    saveStores(updatedStores);

    setProductForm({
      storeId: isStoreManager ? myStore.id : (stores[0]?.id || 'store-1'),
      name: '',
      telugu: '',
      category: 'Bio-Fertilizer',
      price: '',
      unit: '200g packet',
      stock: '',
      dosage: '',
      description: ''
    });
    setShowAddProductModal(false);
  };

  // Filtered Products (Store Manager sees ONLY their store's products)
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Store scope check
      if (isStoreManager) {
        if (p.storeId !== myStore?.id) return false;
      } else if (selectedStoreId !== 'all') {
        if (p.storeId !== selectedStoreId) return false;
      }

      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.storeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, isStoreManager, myStore, selectedStoreId, selectedCategory, searchTerm]);

  return (
    <div className="market-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* Header */}
      <div className="page-header animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>🏪</span> Agri Input Store Portal
          </h1>
          <p className="text-secondary">
            {isStoreManager 
              ? `Logged in as Store In-Charge: ${myStore?.name} (${myStore?.village}) · Managing your store inventory.`
              : 'Admin & Facilitator Console: Onboard input retail centers & manage village-wise stock.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Onboard Button ONLY for Admin and Facilitator */}
          {isAdminOrFacilitator && (
            <button className="btn btn-primary" onClick={() => setShowOnboardModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={16} /> ➕ Onboard New Store
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => setShowAddProductModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> 📦 Add Store Product
          </button>
        </div>
      </div>

      {/* Logged-in Store Manager Banner */}
      {isStoreManager && myStore && (
        <div className="card border-sky" style={{ background: 'rgba(37, 99, 235, 0.05)', padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🏬</span>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{myStore.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                📍 {myStore.village}, {myStore.district} · In-Charge: <strong>{myStore.inCharge}</strong> ({myStore.phone})
              </div>
            </div>
          </div>
          <span className="badge badge-green">🟢 Active Store Account</span>
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
                In-Charge: {onboardSuccess.inCharge} · Phone: {onboardSuccess.phone} · Login ID: {onboardSuccess.email} · Password: <code>clic@2025</code>
              </p>
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => setOnboardSuccess(null)}>Dismiss</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="market-tabs" style={{ marginBottom: 'var(--space-4)' }}>
        {isAdminOrFacilitator && (
          <button className={`market-tab ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>
            🏛️ All Onboarded Stores ({scopedStores.length})
          </button>
        )}
        <button className={`market-tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          📦 {isStoreManager ? 'My Store Products Catalog' : 'Store Products Catalog'} ({filteredProducts.length})
        </button>
      </div>

      {/* TAB 1: STORES DIRECTORY (Admin & Facilitator view) */}
      {activeTab === 'stores' && isAdminOrFacilitator && (
        <div className="stores-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
          {scopedStores.map(store => {
            const storeProdCount = products.filter(p => p.storeId === store.id).length;
            return (
              <div key={store.id} className="card border-sky" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-green" style={{ fontSize: '11px', marginBottom: '4px' }}>{store.status}</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{store.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      📍 {store.village}, {store.district}
                    </div>
                  </div>
                  <div style={{ background: 'var(--color-bg-secondary)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{storeProdCount}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Products</div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', background: 'var(--color-bg-alt)', padding: '10px', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>👤 In-Charge:</strong> {store.inCharge}</div>
                  <div><strong>📞 Mobile:</strong> {store.phone}</div>
                  <div><strong>✉️ Login Email:</strong> <code>{store.email}</code></div>
                  <div><strong>📜 License:</strong> {store.licenseNumber}</div>
                  <div><strong>🌱 Specialty:</strong> {store.specialty}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setSelectedStoreId(store.id);
                      setActiveTab('inventory');
                    }}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    View Products <ArrowRight size={12} style={{ marginLeft: 4 }} />
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setProductForm(prev => ({ ...prev, storeId: store.id }));
                      setShowAddProductModal(true);
                    }}
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    ➕ Add Item
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: STORE PRODUCTS INVENTORY */}
      {activeTab === 'inventory' && (
        <div>
          {/* Filter Bar */}
          <div className="card" style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="search"
                className="input-field"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 32, width: '100%' }}
              />
            </div>

            {/* Store switcher visible ONLY for Admin and Facilitator */}
            {isAdminOrFacilitator && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Store:</label>
                <select
                  className="input-field select-field"
                  value={selectedStoreId}
                  onChange={e => setSelectedStoreId(e.target.value)}
                  style={{ width: 'auto', minWidth: '180px' }}
                >
                  <option value="all">All Stores ({stores.length})</option>
                  {stores.map(s => (
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
                {['All', 'Bio-Fertilizer', 'Seeds', 'Botanical'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="input-grid stagger">
            {filteredProducts.length === 0 ? (
              <div className="text-muted text-center card" style={{ gridColumn: 'span 3', padding: 'var(--space-8)' }}>
                No products found matching filters. Click <strong>"➕ Add Store Product"</strong> above to list inventory.
              </div>
            ) : (
              filteredProducts.map(item => (
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
                  {item.telugu && <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 2 }}>{item.telugu}</div>}
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
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ONBOARD STORE (Admin & Facilitator Only) */}
      {showOnboardModal && isAdminOrFacilitator && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="var(--color-primary)" /> Onboard New Agri Input Store
              </h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowOnboardModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleOnboardStore} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Store / Kendra Name *</label>
                <input
                  type="text"
                  className="input-field"
                  required
                  placeholder="e.g. Nalgonda Farmers PACS Input Center"
                  value={onboardForm.name}
                  onChange={e => setOnboardForm({ ...onboardForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>In-Charge Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. K. Ramchander Rao"
                    value={onboardForm.inCharge}
                    onChange={e => setOnboardForm({ ...onboardForm, inCharge: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    className="input-field"
                    required
                    placeholder="e.g. 9876500112"
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
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>License Number</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. TS-NLG-INP-2026-089"
                  value={onboardForm.licenseNumber}
                  onChange={e => setOnboardForm({ ...onboardForm, licenseNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Product Specialty</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Bio-Fertilizers, Certified Paddy & Pulse Seeds"
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

      {/* MODAL 2: ADD PRODUCT FOR STORE */}
      {showAddProductModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="var(--color-primary)" /> Add Product to Store
              </h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowAddProductModal(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Store selector: locked if Store Manager, selectable if Admin */}
              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Target Store *</label>
                {isStoreManager ? (
                  <input
                    type="text"
                    className="input-field"
                    disabled
                    value={`${myStore?.name} (${myStore?.village})`}
                    style={{ background: 'var(--color-bg-alt)', opacity: 0.8 }}
                  />
                ) : (
                  <select
                    className="input-field select-field"
                    required
                    value={productForm.storeId}
                    onChange={e => setProductForm({ ...productForm, storeId: e.target.value })}
                  >
                    {stores.map(s => (
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
                    placeholder="e.g. Mycorrhiza Root Booster"
                    value={productForm.name}
                    onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Telugu Name</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. మైకోరైజా బూస్టర్"
                    value={productForm.telugu}
                    onChange={e => setProductForm({ ...productForm, telugu: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Category *</label>
                  <select
                    className="input-field select-field"
                    value={productForm.category}
                    onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Bio-Fertilizer">Bio-Fertilizer</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Botanical">Botanical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Price (₹) *</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    placeholder="e.g. 80"
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
                    placeholder="e.g. 1kg / 500ml"
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
                    placeholder="e.g. 100"
                    value={productForm.stock}
                    onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Dosage / Usage</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 200g per 10kg seed"
                    value={productForm.dosage}
                    onChange={e => setProductForm({ ...productForm, dosage: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Product Description</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Clinical benefits, soil health impact..."
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
