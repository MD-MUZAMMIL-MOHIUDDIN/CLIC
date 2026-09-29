import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Store, UploadCloud, Bell, Send, CheckCircle,
  Clock, ShieldCheck, MapPin, Phone, Settings,
  AlertCircle, Play, Image, FileText, X, Save,
  Layers, RefreshCw, Smartphone, Search, Filter, ShoppingBag, BadgePercent
} from 'lucide-react';
import {
  MACHINERY_OPERATIONS,
  FARM_MACHINES,
  INITIAL_ORDERS
} from '../data/machineryData';
import '../styles/machinery.css';

export default function FMCPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load Custom FMC Dealerships from localStorage
  const [fmcDealers, setFmcDealers] = useState(() => {
    const saved = localStorage.getItem('clic_custom_fmc');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'fmc-1',
        name: 'Sri Lakshmi Agro Automotives & Dealership',
        dealerOwner: 'Rajesh Kumar (Authorized Dealer)',
        inCharge: 'Rajesh Kumar (Authorized Dealer)',
        phone: '9848011223',
        email: 'fmc@clic.in',
        role: 'fmc_dealer',
        city: 'Nalgonda Town',
        village: 'Nalgonda Town',
        district: 'Nalgonda',
        brands: 'John Deere, Kubota, Aspee Sprayers',
        gstNumber: '36AAACL8912P1ZX',
        gstin: '36AAACL8912P1ZX',
        bankAccount: 'HDFC - 50100293847192',
        status: 'Active'
      },
      {
        id: 'fmc-2',
        name: 'Kisan Machinery Plaza & Service Hub',
        dealerOwner: 'M. Sridhar Reddy',
        inCharge: 'M. Sridhar Reddy',
        phone: '9848033445',
        email: 'fmc.miryala@clic.in',
        role: 'fmc_dealer',
        city: 'Miryalaguda',
        village: 'Miryalaguda',
        district: 'Nalgonda',
        brands: 'Mahindra, Trimble Laser, Shakti Solar Pumps',
        gstNumber: '36BBBCM4419Q2ZY',
        gstin: '36BBBCM4419Q2ZY',
        bankAccount: 'SBI - 3084729182',
        status: 'Active'
      }
    ];
  });

  const [selectedDealerId, setSelectedDealerId] = useState(() => {
    if (user?.email) {
      const match = fmcDealers.find(d => d.email?.toLowerCase() === user.email.toLowerCase());
      if (match) return match.id;
    }
    return fmcDealers[0]?.id || 'fmc-1';
  });

  // Current active FMC Dealership
  const activeDealer = useMemo(() => {
    const found = fmcDealers.find(d => d.id === selectedDealerId);
    if (found) return found;
    if (user?.email) {
      const match = fmcDealers.find(d => d.email?.toLowerCase() === user.email.toLowerCase());
      if (match) return match;
    }
    return fmcDealers[0] || {
      id: 'fmc-1',
      name: 'Sri Lakshmi Agro Automotives & Dealership',
      dealerOwner: 'Rajesh Kumar',
      inCharge: 'Rajesh Kumar',
      phone: '9848011223',
      city: 'Nalgonda Town',
      district: 'Nalgonda',
      gstNumber: '36AAACL8912P1ZX'
    };
  }, [fmcDealers, selectedDealerId, user]);

  // Master Machines State
  const [machines, setMachines] = useState(() => {
    const saved = localStorage.getItem('clic_custom_machines');
    if (!saved) return FARM_MACHINES;
    try {
      const parsed = JSON.parse(saved);
      return parsed.map(m => {
        const def = FARM_MACHINES.find(d => d.id === m.id);
        if (def && m.id === 'm1') {
          return { ...m, thumbnail: def.thumbnail, gallery: def.gallery };
        }
        return m;
      });
    } catch {
      return FARM_MACHINES;
    }
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('clic_machinery_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Filter purchase orders relevant to this active FMC Dealership
  const purchaseOrders = useMemo(() => {
    return orders.filter(o => {
      if (o.type !== 'purchase') return false;
      const dealerTarget = (o.dealer || o.fmcShop || o.seller || '').toLowerCase();
      const activeName = (activeDealer.name || '').toLowerCase();
      const activeCity = (activeDealer.city || activeDealer.village || '').toLowerCase();
      if (!dealerTarget) return true; // generic purchase order visible to active console
      return dealerTarget.includes(activeName) || activeName.includes(dealerTarget) || (activeCity && dealerTarget.includes(activeCity));
    });
  }, [orders, activeDealer]);

  // Dealership catalog models - specifically filtered to FMC inventory
  const dealerCatalog = useMemo(() => {
    return machines.filter(m => {
      // Must have commercial purchase info
      if (!m.purchaseInfo || !m.purchaseInfo.msrp) return false;
      // Exclude CHC-only implements
      if (m.isChcOnly || m.type === 'chc') return false;

      const mDealerId = m.purchaseInfo?.dealerId || m.dealerId;
      const mDealerName = (m.purchaseInfo?.dealer || m.dealerName || m.purchaseInfo?.dealers?.[0]?.name || '').toLowerCase();
      const activeName = (activeDealer.name || '').toLowerCase();
      const activeCity = (activeDealer.city || activeDealer.village || '').toLowerCase();

      if (mDealerId) {
        return mDealerId === activeDealer.id;
      }
      if (mDealerName) {
        return mDealerName.includes(activeName) || activeName.includes(mDealerName) || (activeCity && mDealerName.includes(activeCity));
      }
      // If no specific dealer assigned yet, associate with primary dealer
      return activeDealer.id === 'fmc-1';
    });
  }, [machines, activeDealer]);

  // Modal & Edit State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [quickEditMachine, setQuickEditMachine] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'inventory'

  // New Dealership Machine Form
  const [newDealerForm, setNewDealerForm] = useState({
    name: '',
    telugu: '',
    operationId: 'land-prep',
    category: 'Tractor & Heavy Implements',
    powerHP: '50 HP',
    fuelType: 'Diesel (4.0 L/hr)',
    capacity: '3.5 acres/day',
    brand: 'Mahindra / Swaraj',
    thumbnail: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Product Demonstration & Features',
    description: '',
    msrp: 650000,
    subsidyPercent: 40,
    warranty: '2 Years Manufacturer Warranty + 3 Free Services',
    stockUnits: 4
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('clic_custom_machines', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('clic_machinery_orders', JSON.stringify(orders));
  }, [orders]);

  // Real-time live sync across Facilitator, CHC, and FMC consoles
  useEffect(() => {
    const handleSync = () => {
      const savedMach = localStorage.getItem('clic_custom_machines');
      if (savedMach) {
        try { setMachines(JSON.parse(savedMach)); } catch (e) { /* ignore */ }
      }
      const savedOrders = localStorage.getItem('clic_machinery_orders');
      if (savedOrders) {
        try { setOrders(JSON.parse(savedOrders)); } catch (e) { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Handle Equipment Registration by FMC
  const handleRegisterDealerMachine = (e) => {
    e.preventDefault();
    if (!newDealerForm.name.trim()) {
      alert('Please provide machine model name.');
      return;
    }

    const opObj = MACHINERY_OPERATIONS.find(op => op.id === newDealerForm.operationId) || MACHINERY_OPERATIONS[0];
    const msrpNum = Number(newDealerForm.msrp) || 500000;
    const subPct = Number(newDealerForm.subsidyPercent) || 40;
    const subsidyAmount = Math.round(msrpNum * (subPct / 100));
    const effectivePrice = msrpNum - subsidyAmount;

    const newMach = {
      id: `m-fmc-${Date.now()}`,
      name: newDealerForm.name.trim(),
      telugu: newDealerForm.telugu.trim() || newDealerForm.name.trim(),
      type: 'fmc',
      isFmc: true,
      isChc: false,
      dealerId: activeDealer.id,
      dealerName: activeDealer.name,
      operationId: opObj.id,
      operationName: opObj.name,
      category: newDealerForm.category,
      powerHP: newDealerForm.powerHP,
      fuelType: newDealerForm.fuelType,
      capacity: newDealerForm.capacity,
      brand: newDealerForm.brand,
      thumbnail: newDealerForm.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
      gallery: [newDealerForm.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'],
      videoUrl: newDealerForm.videoUrl || 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
      videoTitle: newDealerForm.videoTitle || `${newDealerForm.name} Commercial Walkaround Video`,
      description: newDealerForm.description.trim() || `${newDealerForm.name} supplied and serviced by ${activeDealer.name}. Eligible for SMAM DBT subsidy scheme.`,
      specs: {
        'Engine Power': newDealerForm.powerHP,
        'Fuel Consumption': newDealerForm.fuelType,
        'Field Capacity': newDealerForm.capacity,
        'Dealership': activeDealer.name,
        'Dealer Contact': `${activeDealer.dealerOwner || activeDealer.inCharge} (${activeDealer.phone})`,
        'Warranty': newDealerForm.warranty
      },
      purchaseInfo: {
        msrp: msrpNum,
        subsidyPercent: subPct,
        subsidyAmount: subsidyAmount,
        effectivePrice: effectivePrice,
        dealer: activeDealer.name,
        dealerId: activeDealer.id,
        dealers: [
          {
            name: activeDealer.name,
            city: activeDealer.district || activeDealer.city,
            contact: activeDealer.phone,
            stockUnits: Number(newDealerForm.stockUnits) || 3
          }
        ]
      }
    };

    setMachines(prev => [newMach, ...prev]);
    setShowUploadModal(false);
    showToast(`✓ Machine model "${newMach.name}" registered to ${activeDealer.name} Catalog!`);

    setNewDealerForm({
      name: '',
      telugu: '',
      operationId: 'land-prep',
      category: 'Tractor & Heavy Implements',
      powerHP: '50 HP',
      fuelType: 'Diesel (4.0 L/hr)',
      capacity: '3.5 acres/day',
      brand: 'Mahindra / Swaraj',
      thumbnail: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
      videoTitle: 'Product Demonstration & Features',
      description: '',
      msrp: 650000,
      subsidyPercent: 40,
      warranty: '2 Years Manufacturer Warranty + 3 Free Services',
      stockUnits: 4
    });
  };

  // Handle Quick Edit Save
  const handleSaveQuickEdit = (e) => {
    e.preventDefault();
    if (!quickEditMachine) return;
    setMachines(prev => prev.map(m => m.id === quickEditMachine.id ? quickEditMachine : m));
    setQuickEditMachine(null);
    showToast(`✓ Dealership price and stock updated for "${quickEditMachine.name}"!`);
  };

  // Dispatch Alert Back from FMC Dealership
  const handleSendAlertBack = (orderId, customMsg = null) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultMsg = `Unit inspected (Pre-Delivery Inspection Passed). SMAM Subsidy registration paperwork generated. Quotation & Invoice ready for farmer handover.`;

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'Alert Back from FMC Dispatched · Ready',
          stage: 'back_alert_received',
          dealerConfirmedBy: activeDealer.dealerOwner,
          timeline: [
            ...ord.timeline,
            { time: currentTime, text: `Alert Back from FMC: Verified by ${activeDealer.dealerOwner} (${activeDealer.name}). Machine PDI complete & subsidy papers ready.` }
          ],
          backAlert: {
            received: true,
            from: `${activeDealer.name} (${activeDealer.dealerOwner})`,
            message: customMsg || defaultMsg,
            statusUpdate: 'FMC Stock Reserved & SMAM Paperwork Cleared'
          }
        };
      }
      return ord;
    }));

    showToast(`✓ Alert Back sent to Farmer & CLIC Facilitator for Work Order ${orderId}!`);
  };

  return (
    <div className="machinery-page animate-fade-in">
      {/* Header Banner */}
      <div className="card border-purple" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08), #fff)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: 'var(--shadow-sm)' }}>
              🏪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-purple">Farm Machinery Commercial (FMC) Dealer Console</span>
                <span className="badge badge-green">Authorized Dealership Mode</span>
              </div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: '4px 0 2px 0' }}>
                {activeDealer.name}
              </h1>
              <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
                📍 {activeDealer.city || activeDealer.village || 'Nalgonda'}, {activeDealer.district || 'Nalgonda'} · Proprietor: <strong>{activeDealer.inCharge || activeDealer.dealerOwner || 'Authorized Proprietor'}</strong> (📱 {activeDealer.phone || '9848011223'}) · GST: <code>{activeDealer.gstin || activeDealer.gstNumber || '36AAACL8912P1ZX'}</code> · Role: <code>fmc_dealer</code>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Dealership Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>DEALER:</span>
              <select
                className="input-field select-field"
                value={activeDealer.id}
                onChange={e => setSelectedDealerId(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '12px', minWidth: '180px' }}
              >
                {fmcDealers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.city || d.village || d.district})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <UploadCloud size={16} /> + Register New Machine Model
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/machinery?tab=alerts')}
            >
              <Bell size={15} /> All Alerts Feed
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="card animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(147, 51, 234, 0.08))', border: '1px solid var(--color-mint)', padding: '10px 18px', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-forest-dark)', fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
            <CheckCircle size={18} className="text-forest" />
            <span>{toastMsg}</span>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setToastMsg(null)}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Role Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
        <button
          className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={15} /> 1. Purchase Work Orders & Inquiries ({purchaseOrders.length})
        </button>
        <button
          className={`btn ${activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('inventory')}
        >
          <Store size={15} /> 2. Dealership Inventory & SMAM Catalog ({dealerCatalog.length} Models)
        </button>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: INCOMING PURCHASE ORDERS & FACILITATOR ALERTS     */}
      {/* ============================================================ */}
      {activeTab === 'alerts' && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} className="text-purple" />
              <span>Incoming Machinery Purchase Inquiries & Walk-in Queries</span>
            </div>
            <span className="badge badge-purple">{purchaseOrders.length} Work Orders in Queue</span>
          </div>

          <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', margin: '0 0 var(--space-2) 0' }}>
            Review walk-in purchase requirements recorded at CLIC center, inspect the logged query, and dispatch the confirmation <strong>"Alert Back from FM Shop"</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {purchaseOrders.length > 0 ? (
              purchaseOrders.map(p => {
                const isConfirmed = p.backAlert?.received;
                return (
                  <div
                    key={p.id}
                    className="card"
                    style={{
                      background: 'var(--color-bg-elevated)',
                      borderLeft: `5px solid ${isConfirmed ? 'var(--color-mint)' : 'var(--color-purple)'}`,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="font-mono text-purple" style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{p.id}</span>
                          <span className="badge badge-purple">🏪 Purchase Work Order</span>
                          <span className={`badge ${isConfirmed ? 'badge-green' : 'badge-amber'}`}>
                            {isConfirmed ? '✓ Confirmed by FMC Shop' : '⏳ Awaiting Dealer Stock Confirmation'}
                          </span>
                          <span className="text-muted" style={{ fontSize: '11px' }}>Date: {p.date}</span>
                        </div>

                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: '6px' }}>{p.machineName}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                          <strong>Farmer Buyer:</strong> {p.farmerName} (📱 +91 {p.farmerPhone}) · 📍 Location: <strong>{p.village}</strong>
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '2px' }}>
                          MSRP: ₹{p.msrp?.toLocaleString()} · SMAM Subsidy: <strong className="text-forest">₹{p.subsidyAmount?.toLocaleString()} ({p.subsidyPercent}%)</strong> · Farmer Share: <strong className="text-mint">₹{p.effectivePrice?.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Dealer Action Button */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 230 }}>
                        {!isConfirmed ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSendAlertBack(p.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                          >
                            <Send size={14} /> Send "Alert Back from FM Shop"
                          </button>
                        ) : (
                          <div className="badge badge-green" style={{ justifyContent: 'center', padding: '6px 10px', fontSize: '12px' }}>
                            ✓ Unit Reserved & PDI Approved
                          </div>
                        )}
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                          {isConfirmed ? `Logged at ${p.timeline?.[p.timeline.length - 1]?.time}` : 'Click to send quotation & confirmation alert'}
                        </div>
                      </div>
                    </div>

                    {/* PROMINENT FARMER WALK-IN QUERY BOX */}
                    <div style={{ background: 'rgba(147, 51, 234, 0.05)', border: '1px solid rgba(147, 51, 234, 0.2)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-purple)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={13} /> Farmer's Walk-in Requirement / Query (Recorded by CLIC Facilitator):
                        </span>
                        <span className="badge badge-forest" style={{ fontSize: '10px' }}>
                          Facilitator: {p.facilitatorName || 'CLIC Desk In-Charge'}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', margin: 0, fontWeight: '500' }}>
                        "{p.farmerQuery || 'Farmer visited CLIC desk inquiring about subsidized machinery purchase under SMAM scheme.'}"
                      </p>
                    </div>

                    {/* Confirmed Dispatch Note */}
                    {isConfirmed && p.backAlert?.message && (
                      <div className="sms-preview-card" style={{ background: 'rgba(5, 150, 105, 0.05)', borderColor: 'var(--color-mint)' }}>
                        🟢 <strong>FM SHOP CONFIRMATION LOGGED:</strong><br />
                        {p.backAlert.message}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                No incoming purchase inquiries in queue for this FMC Dealership.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: REGISTER & MANAGE DEALERSHIP INVENTORY            */}
      {/* ============================================================ */}
      {activeTab === 'inventory' && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Dealership Machinery Catalog & SMAM Rates</h2>
              <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                Register commercial machinery models, MSRP pricing, and available showroom stock.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowUploadModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <UploadCloud size={14} /> + Register New Machine Model
            </button>
          </div>

          <div className="table-responsive">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Machine Model</th>
                  <th>Category</th>
                  <th>Power & Fuel</th>
                  <th>Showroom MSRP</th>
                  <th>SMAM Subsidy</th>
                  <th>Farmer Net Share</th>
                  <th>Warranty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dealerCatalog.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={m.thumbnail} alt={m.name} style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        <div>
                          <strong style={{ fontSize: '12px' }}>{m.name}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--color-forest)', fontFamily: 'var(--font-telugu)' }}>{m.telugu}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ fontSize: '10px' }}>{m.operationName}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px' }}>⚡ {m.powerHP}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{m.fuelType}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>₹{m.purchaseInfo?.msrp?.toLocaleString()}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-forest)' }}>
                        ₹{m.purchaseInfo?.subsidyAmount?.toLocaleString()} ({m.purchaseInfo?.subsidyPercent}%)
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-mint)' }}>
                        ₹{m.purchaseInfo?.effectivePrice?.toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-green" style={{ fontSize: '10px' }}>
                        {m.specs?.['Warranty'] || '2 Years Warranty'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setQuickEditMachine({ ...m })}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
                      >
                        <Settings size={12} /> Edit Price/Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* REGISTER NEW MACHINE MODAL                                    */}
      {/* ============================================================ */}
      {showUploadModal && (
        <div className="details-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="details-modal" style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Store size={18} className="text-purple" />
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>
                    Register Commercial Machine to {activeDealer.name}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Add machinery specs, MSRP pricing, SMAM subsidy eligibility, and demo video
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setShowUploadModal(false)} style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterDealerMachine} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="machine-upload-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Machine Model & Brand *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Kubota MU4501 4WD Tractor (45 HP)"
                    value={newDealerForm.name}
                    onChange={e => setNewDealerForm({ ...newDealerForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Telugu Model Name (తెలుగు)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. కుబోటా ట్రాక్టర్"
                    value={newDealerForm.telugu}
                    onChange={e => setNewDealerForm({ ...newDealerForm, telugu: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Operation Category *</label>
                  <select
                    className="input-field select-field"
                    value={newDealerForm.operationId}
                    onChange={e => setNewDealerForm({ ...newDealerForm, operationId: e.target.value })}
                    required
                  >
                    {MACHINERY_OPERATIONS.map(op => (
                      <option key={op.id} value={op.id}>{op.icon} {op.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Power Rating (HP / kW)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 45 HP"
                    value={newDealerForm.powerHP}
                    onChange={e => setNewDealerForm({ ...newDealerForm, powerHP: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Fuel Consumption</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Diesel (3.8 L/hr)"
                    value={newDealerForm.fuelType}
                    onChange={e => setNewDealerForm({ ...newDealerForm, fuelType: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Showroom MSRP / Ex-Showroom (₹) *</label>
                  <input
                    type="number"
                    min={10000}
                    className="input-field"
                    value={newDealerForm.msrp}
                    onChange={e => setNewDealerForm({ ...newDealerForm, msrp: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>SMAM Subsidy Percentage (%) *</label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    className="input-field"
                    value={newDealerForm.subsidyPercent}
                    onChange={e => setNewDealerForm({ ...newDealerForm, subsidyPercent: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Showroom Ready Stock Units *</label>
                  <input
                    type="number"
                    min={1}
                    className="input-field"
                    value={newDealerForm.stockUnits}
                    onChange={e => setNewDealerForm({ ...newDealerForm, stockUnits: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Warranty Terms</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 2 Years + 3 Free Services"
                    value={newDealerForm.warranty}
                    onChange={e => setNewDealerForm({ ...newDealerForm, warranty: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Commercial Demonstration Video (YouTube Embed Link)</label>
                  <input
                    className="input-field"
                    placeholder="https://www.youtube-nocookie.com/embed/..."
                    value={newDealerForm.videoUrl}
                    onChange={e => setNewDealerForm({ ...newDealerForm, videoUrl: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UploadCloud size={16} /> Save Machine to FMC Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* QUICK EDIT MODAL                                             */}
      {/* ============================================================ */}
      {quickEditMachine && (
        <div className="details-modal-overlay" onClick={() => setQuickEditMachine(null)}>
          <div className="details-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>
                  ⚙️ Update Commercial Terms: {quickEditMachine.name}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Update MSRP price and SMAM subsidy percentage
                </div>
              </div>
              <button className="btn-icon" onClick={() => setQuickEditMachine(null)} style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label>Showroom MSRP (₹) *</label>
                  <input
                    type="number"
                    min={10000}
                    className="input-field"
                    value={quickEditMachine.purchaseInfo?.msrp ?? 500000}
                    onChange={e => {
                      const newMsrp = Number(e.target.value);
                      const subPct = quickEditMachine.purchaseInfo?.subsidyPercent ?? 40;
                      const subAmt = Math.round(newMsrp * (subPct / 100));
                      setQuickEditMachine({
                        ...quickEditMachine,
                        purchaseInfo: {
                          ...quickEditMachine.purchaseInfo,
                          msrp: newMsrp,
                          subsidyAmount: subAmt,
                          effectivePrice: newMsrp - subAmt
                        }
                      });
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Subsidy Percentage (%) *</label>
                  <input
                    type="number"
                    min={0}
                    max={80}
                    className="input-field"
                    value={quickEditMachine.purchaseInfo?.subsidyPercent ?? 40}
                    onChange={e => {
                      const newPct = Number(e.target.value);
                      const msrpVal = quickEditMachine.purchaseInfo?.msrp ?? 500000;
                      const subAmt = Math.round(msrpVal * (newPct / 100));
                      setQuickEditMachine({
                        ...quickEditMachine,
                        purchaseInfo: {
                          ...quickEditMachine.purchaseInfo,
                          subsidyPercent: newPct,
                          subsidyAmount: subAmt,
                          effectivePrice: msrpVal - subAmt
                        }
                      });
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setQuickEditMachine(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Save Price Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
