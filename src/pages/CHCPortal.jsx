import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Tractor, UploadCloud, Bell, Send, CheckCircle,
  Clock, ShieldCheck, MapPin, Phone, Settings,
  AlertCircle, Play, Image, FileText, X, Save,
  Layers, RefreshCw, Smartphone, Search, Filter, Wrench
} from 'lucide-react';
import {
  MACHINERY_OPERATIONS,
  FARM_MACHINES,
  INITIAL_ORDERS
} from '../data/machineryData';
import '../styles/machinery.css';

export default function CHCPortal() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load Custom Hubs & Machines from localStorage
  const [chcHubs] = useState(() => {
    const saved = localStorage.getItem('clic_custom_chc');
    return saved ? JSON.parse(saved) : [
      {
        id: 'chc-1',
        name: 'Chandampet Central CHC Hub',
        inCharge: 'Kishan Goud (CHC Supervisor)',
        phone: '9876500112',
        email: 'chc@clic.in',
        role: 'chc_operator',
        village: 'Chandampet',
        district: 'Nalgonda',
        mandal: 'Chandampet',
        fleetCount: 8,
        operatorCount: 4,
        bankAccount: 'SBI - 2093847192',
        status: 'Active'
      },
      {
        id: 'chc-2',
        name: 'Marriguda PACS Agri Hiring Center',
        inCharge: 'Venkataiah (PACS Lead)',
        phone: '9848099881',
        email: 'chc.marriguda@clic.in',
        role: 'chc_operator',
        village: 'Marriguda',
        district: 'Nalgonda',
        mandal: 'Marriguda',
        fleetCount: 6,
        operatorCount: 3,
        bankAccount: 'UBI - 8812938192',
        status: 'Active'
      }
    ];
  });

  // Current active CHC Hub
  const activeHub = useMemo(() => {
    if (user?.email) {
      const match = chcHubs.find(h => h.email?.toLowerCase() === user.email.toLowerCase());
      if (match) return match;
    }
    return chcHubs[0];
  }, [chcHubs, user]);

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

  // Filter rental orders relevant to this CHC Hub
  const rentalOrders = useMemo(() => {
    return orders.filter(o => o.type === 'rental');
  }, [orders]);

  // Machines linked to this CHC Hub
  const hubFleet = useMemo(() => {
    return machines.filter(m => {
      const hubName = m.chcAvailability?.chcHub?.toLowerCase() || '';
      return hubName.includes(activeHub.name.toLowerCase()) || hubName.includes(activeHub.village.toLowerCase()) || !m.chcAvailability?.chcHub;
    });
  }, [machines, activeHub]);

  // Upload Implement Modal & Form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [quickEditMachine, setQuickEditMachine] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [filterSearch, setFilterSearch] = useState('');
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'fleet'

  // New Implement Form
  const [newImplementForm, setNewImplementForm] = useState({
    name: '',
    telugu: '',
    operationId: 'land-prep',
    category: 'Tractor & Heavy Implements',
    powerHP: '50 HP',
    fuelType: 'Diesel (4.0 L/hr)',
    capacity: '3.0 acres/day',
    brand: 'Mahindra / Swaraj',
    thumbnail: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Field Demonstration & Working Video',
    description: '',
    totalUnits: 3,
    availableUnits: 3,
    rateHourly: 650,
    rateDaily: 4800,
    ratePerAcre: 1200,
    deposit: 1500,
    operatorAvailable: true
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

  // Handle Equipment Registration
  const handleRegisterImplement = (e) => {
    e.preventDefault();
    if (!newImplementForm.name.trim()) {
      alert('Please provide equipment name.');
      return;
    }

    const opObj = MACHINERY_OPERATIONS.find(op => op.id === newImplementForm.operationId) || MACHINERY_OPERATIONS[0];

    const newMach = {
      id: `m-chc-${Date.now()}`,
      name: newImplementForm.name.trim(),
      telugu: newImplementForm.telugu.trim() || newImplementForm.name.trim(),
      operationId: opObj.id,
      operationName: opObj.name,
      category: newImplementForm.category,
      powerHP: newImplementForm.powerHP,
      fuelType: newImplementForm.fuelType,
      capacity: newImplementForm.capacity,
      brand: newImplementForm.brand,
      thumbnail: newImplementForm.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
      gallery: [newImplementForm.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'],
      videoUrl: newImplementForm.videoUrl || 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
      videoTitle: newImplementForm.videoTitle || `${newImplementForm.name} Field Operation Video`,
      description: newImplementForm.description.trim() || `${newImplementForm.name} registered and maintained directly by ${activeHub.name}.`,
      specs: {
        'Engine Power': newImplementForm.powerHP,
        'Fuel Consumption': newImplementForm.fuelType,
        'Field Capacity': newImplementForm.capacity,
        'Assigned CHC Hub': activeHub.name,
        'Hub In-Charge': activeHub.inCharge
      },
      chcAvailability: {
        total: Number(newImplementForm.totalUnits) || 2,
        available: Number(newImplementForm.availableUnits) || 2,
        rateHourly: Number(newImplementForm.rateHourly) || 600,
        rateDaily: Number(newImplementForm.rateDaily) || 4500,
        ratePerAcre: Number(newImplementForm.ratePerAcre) || 1200,
        deposit: Number(newImplementForm.deposit) || 1500,
        chcHub: activeHub.name,
        operatorAvailable: Boolean(newImplementForm.operatorAvailable),
        operatorRateExtra: 150
      },
      purchaseInfo: {
        msrp: 550000,
        subsidyPercent: 40,
        subsidyAmount: 220000,
        effectivePrice: 330000,
        dealers: [{ name: 'CLIC Central Agri Dealership', city: activeHub.district, contact: activeHub.phone }]
      }
    };

    setMachines(prev => [newMach, ...prev]);
    setShowUploadModal(false);
    showToast(`✓ Equipment "${newMach.name}" registered to ${activeHub.name}!`);

    setNewImplementForm({
      name: '',
      telugu: '',
      operationId: 'land-prep',
      category: 'Tractor & Heavy Implements',
      powerHP: '50 HP',
      fuelType: 'Diesel (4.0 L/hr)',
      capacity: '3.0 acres/day',
      brand: 'Mahindra / Swaraj',
      thumbnail: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
      videoTitle: 'Field Demonstration & Working Video',
      description: '',
      totalUnits: 3,
      availableUnits: 3,
      rateHourly: 650,
      rateDaily: 4800,
      ratePerAcre: 1200,
      deposit: 1500,
      operatorAvailable: true
    });
  };

  // Handle Quick Edit Save
  const handleSaveQuickEdit = (e) => {
    e.preventDefault();
    if (!quickEditMachine) return;
    setMachines(prev => prev.map(m => m.id === quickEditMachine.id ? quickEditMachine : m));
    setQuickEditMachine(null);
    showToast(`✓ Live fleet availability updated for "${quickEditMachine.name}"!`);
  };

  // Dispatch Alert Back from CHC
  const handleSendAlertBack = (orderId, customMsg = null) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const defaultMsg = `CHC Unit reserved & pre-fueled. Certified operator assigned with trailer transport. Scheduled arrival at farmer field on time.`;

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'Alert Back from CHC Dispatched · Confirmed',
          stage: 'back_alert_received',
          operatorName: `${activeHub.inCharge.split(' ')[0]} Assigned Operator`,
          timeline: [
            ...ord.timeline,
            { time: currentTime, text: `Alert Back from CHC: Confirmed by ${activeHub.inCharge} (${activeHub.name}). Machine ready for deployment.` }
          ],
          backAlert: {
            received: true,
            from: `${activeHub.name} (${activeHub.inCharge})`,
            message: customMsg || defaultMsg,
            statusUpdate: 'CHC Schedule Confirmed & Unit Reserved'
          }
        };
      }
      return ord;
    }));

    showToast(`✓ Alert Back sent to Farmer & CLIC Facilitator for Order ${orderId}!`);
  };

  return (
    <div className="machinery-page animate-fade-in">
      {/* Header Banner */}
      <div className="card border-sky" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), #fff)', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: 'var(--shadow-sm)' }}>
              🚜
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-sky">Custom Hiring Center (CHC) Operator Console</span>
                <span className="badge badge-green">Dedicated Provider Mode</span>
              </div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: '4px 0 2px 0' }}>
                {activeHub.name}
              </h1>
              <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
                📍 {activeHub.village}, {activeHub.district} · In-Charge: <strong>{activeHub.inCharge}</strong> (📱 {activeHub.phone}) · Role: <code>chc_operator</code>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <UploadCloud size={16} /> + Register New CHC Implement
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
        <div className="card animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(37, 99, 235, 0.08))', border: '1px solid var(--color-mint)', padding: '10px 18px', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
          <Bell size={15} /> 1. Incoming Rental Requests & Alerts ({rentalOrders.length})
        </button>
        <button
          className={`btn ${activeTab === 'fleet' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('fleet')}
        >
          <Tractor size={15} /> 2. Manage CHC Fleet & Availability ({hubFleet.length} Machines)
        </button>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: INCOMING RENTAL REQUESTS & FACILITATOR ALERTS     */}
      {/* ============================================================ */}
      {activeTab === 'alerts' && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} className="text-sky" />
              <span>Incoming Rental Bookings & Walk-in Queries from CLIC Facilitator</span>
            </div>
            <span className="badge badge-sky">{rentalOrders.length} Bookings in Queue</span>
          </div>

          <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', margin: '0 0 var(--space-2) 0' }}>
            Review walk-in farmer requirements recorded at CLIC center, inspect the logged query, and dispatch the confirmation <strong>"Alert Back from CHC"</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {rentalOrders.length > 0 ? (
              rentalOrders.map(r => {
                const isConfirmed = r.backAlert?.received;
                return (
                  <div
                    key={r.id}
                    className="card"
                    style={{
                      background: 'var(--color-bg-elevated)',
                      borderLeft: `5px solid ${isConfirmed ? 'var(--color-mint)' : 'var(--color-amber)'}`,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span className="font-mono text-forest" style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{r.id}</span>
                          <span className="badge badge-sky">🚜 CHC Rental Booking</span>
                          <span className={`badge ${isConfirmed ? 'badge-green' : 'badge-amber'}`}>
                            {isConfirmed ? '✓ Confirmed by CHC' : '⏳ Awaiting Operator Dispatch'}
                          </span>
                          <span className="text-muted" style={{ fontSize: '11px' }}>Date: {r.date}</span>
                        </div>

                        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: '6px' }}>{r.machineName}</h3>
                        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                          <strong>Farmer:</strong> {r.farmerName} (📱 +91 {r.farmerPhone}) · 📍 Field Location: <strong>{r.village}</strong>
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '2px' }}>
                          Schedule: <strong>{r.startDate}</strong> ({r.rentalUnits}) · Deposit: {r.deposit} · Est. Total: <strong className="text-mint">₹{r.totalEstimated?.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Operator Action Button */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 230 }}>
                        {!isConfirmed ? (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSendAlertBack(r.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                          >
                            <Send size={14} /> Send "Alert Back from CHC"
                          </button>
                        ) : (
                          <div className="badge badge-green" style={{ justifyContent: 'center', padding: '6px 10px', fontSize: '12px' }}>
                            ✓ Schedule & Driver Confirmed
                          </div>
                        )}
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                          {isConfirmed ? `Logged at ${r.timeline?.[r.timeline.length - 1]?.time}` : 'Click button to confirm availability'}
                        </div>
                      </div>
                    </div>

                    {/* PROMINENT FARMER WALK-IN QUERY BOX */}
                    <div style={{ background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.2)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-forest)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={13} /> Farmer's Walk-in Requirement / Query (Recorded by CLIC Facilitator):
                        </span>
                        <span className="badge badge-forest" style={{ fontSize: '10px' }}>
                          Facilitator: {r.facilitatorName || 'CLIC Desk In-Charge'}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', margin: 0, fontWeight: '500' }}>
                        "{r.farmerQuery || 'Farmer walked into CLIC Center requesting urgent machinery hire for Kharif farm operations.'}"
                      </p>
                    </div>

                    {/* Confirmed Dispatch Note */}
                    {isConfirmed && r.backAlert?.message && (
                      <div className="sms-preview-card" style={{ background: 'rgba(5, 150, 105, 0.05)', borderColor: 'var(--color-mint)' }}>
                        🟢 <strong>CHC DISPATCH CONFIRMATION LOGGED:</strong><br />
                        {r.backAlert.message}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                No incoming rental requests in queue for this CHC Hub.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: REGISTER & MANAGE CHC FLEET EQUIPMENT             */}
      {/* ============================================================ */}
      {activeTab === 'fleet' && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>CHC Fleet Inventory & Live Availability</h2>
              <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                Register new implements and update available units parked in the yard for real-time CLIC facilitation.
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowUploadModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <UploadCloud size={14} /> + Register New Implement
            </button>
          </div>

          <div className="table-responsive">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Equipment / Implement</th>
                  <th>Category</th>
                  <th>Power & Fuel</th>
                  <th>Yard Stock</th>
                  <th>Rental Rates</th>
                  <th>Security Deposit</th>
                  <th>Operator</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hubFleet.map(m => (
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
                      <span className="badge badge-sky" style={{ fontSize: '10px' }}>{m.operationName}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px' }}>⚡ {m.powerHP}</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{m.fuelType}</div>
                    </td>
                    <td>
                      <span className={`hub-avail-pill ${m.chcAvailability?.available > 1 ? 'in-stock' : m.chcAvailability?.available === 1 ? 'low-stock' : 'out-of-stock'}`}>
                        {m.chcAvailability?.available} / {m.chcAvailability?.total} Ready
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-mint)' }}>₹{m.chcAvailability?.rateHourly}/hr</div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>₹{m.chcAvailability?.rateDaily}/day</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px' }}>₹{m.chcAvailability?.deposit || 1500}</div>
                    </td>
                    <td>
                      <span className="badge badge-green" style={{ fontSize: '10px' }}>
                        {m.chcAvailability?.operatorAvailable ? '✓ Driver Included' : 'Self-Operated'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setQuickEditMachine({ ...m })}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
                      >
                        <Settings size={12} /> Edit Status
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
      {/* REGISTER IMPLEMENT MODAL                                     */}
      {/* ============================================================ */}
      {showUploadModal && (
        <div className="details-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="details-modal" style={{ maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tractor size={18} className="text-sky" />
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>
                    Register New Equipment to {activeHub.name}
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Add implement specs, fleet count, and hire rates for walk-in farmers
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setShowUploadModal(false)} style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterImplement} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="machine-upload-grid">
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Equipment / Implement Name *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Swaraj 744 FE 4WD Tractor (48 HP)"
                    value={newImplementForm.name}
                    onChange={e => setNewImplementForm({ ...newImplementForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Telugu Name (తెలుగు)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. స్వరాజ్ ట్రాక్టర్"
                    value={newImplementForm.telugu}
                    onChange={e => setNewImplementForm({ ...newImplementForm, telugu: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Operation Category *</label>
                  <select
                    className="input-field select-field"
                    value={newImplementForm.operationId}
                    onChange={e => setNewImplementForm({ ...newImplementForm, operationId: e.target.value })}
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
                    placeholder="e.g. 50 HP"
                    value={newImplementForm.powerHP}
                    onChange={e => setNewImplementForm({ ...newImplementForm, powerHP: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Fuel Consumption</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Diesel (4.0 L/hr)"
                    value={newImplementForm.fuelType}
                    onChange={e => setNewImplementForm({ ...newImplementForm, fuelType: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Total Units in Hub *</label>
                  <input
                    type="number"
                    min={1}
                    className="input-field"
                    value={newImplementForm.totalUnits}
                    onChange={e => setNewImplementForm({ ...newImplementForm, totalUnits: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Available Units in Yard *</label>
                  <input
                    type="number"
                    min={0}
                    max={newImplementForm.totalUnits}
                    className="input-field"
                    value={newImplementForm.availableUnits}
                    onChange={e => setNewImplementForm({ ...newImplementForm, availableUnits: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hourly Hire Rate (₹ / hr) *</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newImplementForm.rateHourly}
                    onChange={e => setNewImplementForm({ ...newImplementForm, rateHourly: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Daily Hire Rate (₹ / day)</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newImplementForm.rateDaily}
                    onChange={e => setNewImplementForm({ ...newImplementForm, rateDaily: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Per-Acre Rate (₹ / acre)</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newImplementForm.ratePerAcre}
                    onChange={e => setNewImplementForm({ ...newImplementForm, ratePerAcre: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Refundable Deposit (₹)</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newImplementForm.deposit}
                    onChange={e => setNewImplementForm({ ...newImplementForm, deposit: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Demonstration Video (YouTube Embed Link)</label>
                  <input
                    className="input-field"
                    placeholder="https://www.youtube-nocookie.com/embed/..."
                    value={newImplementForm.videoUrl}
                    onChange={e => setNewImplementForm({ ...newImplementForm, videoUrl: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UploadCloud size={16} /> Save Equipment to CHC Fleet
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
                  ⚙️ Update Status: {quickEditMachine.name}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Update live units in yard and rental rates
                </div>
              </div>
              <button className="btn-icon" onClick={() => setQuickEditMachine(null)} style={{ padding: '6px', borderRadius: '50%' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label>Available Units in Yard *</label>
                  <input
                    type="number"
                    min={0}
                    max={quickEditMachine.chcAvailability?.total || 10}
                    className="input-field"
                    value={quickEditMachine.chcAvailability?.available ?? 0}
                    onChange={e => setQuickEditMachine({
                      ...quickEditMachine,
                      chcAvailability: {
                        ...quickEditMachine.chcAvailability,
                        available: Number(e.target.value)
                      }
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Total Fleet Capacity *</label>
                  <input
                    type="number"
                    min={1}
                    className="input-field"
                    value={quickEditMachine.chcAvailability?.total ?? 1}
                    onChange={e => setQuickEditMachine({
                      ...quickEditMachine,
                      chcAvailability: {
                        ...quickEditMachine.chcAvailability,
                        total: Number(e.target.value)
                      }
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Hourly Hire Rate (₹/hr) *</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={quickEditMachine.chcAvailability?.rateHourly ?? 0}
                    onChange={e => setQuickEditMachine({
                      ...quickEditMachine,
                      chcAvailability: {
                        ...quickEditMachine.chcAvailability,
                        rateHourly: Number(e.target.value)
                      }
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Daily Rate (₹/day)</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={quickEditMachine.chcAvailability?.rateDaily ?? 0}
                    onChange={e => setQuickEditMachine({
                      ...quickEditMachine,
                      chcAvailability: {
                        ...quickEditMachine.chcAvailability,
                        rateDaily: Number(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setQuickEditMachine(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
