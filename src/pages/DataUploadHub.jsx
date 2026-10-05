import React, { useState, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReferenceData } from '../context/ReferenceContext';
import { CROP_THEMES, PEST_CATEGORIES } from '../data/crops/cropPestDiseaseData';
import { chcEquipment } from '../data/machinery/chcEquipment';
import { fmcInventory } from '../data/machinery/fmcInventory';
import { LIVESTOCK_ANIMALS, LIVESTOCK_DISEASES } from '../data/livestock/livestockData';
import { FISH_SPECIES, FISH_DISEASES } from '../data/fisheries/fisheriesData';
import {
  Upload, Download, FileText, CheckCircle2, AlertTriangle, Trash2, Edit3,
  Plus, Search, Filter, RefreshCw, X, Eye, FileSpreadsheet,
  Database, Sprout, Bug, ShieldAlert, Stethoscope, ArrowRight,
  Printer, Sparkles, Layers, Info, Check, HelpCircle, ChevronRight,
  FolderTree, Tractor, Activity, Fish, Store
} from 'lucide-react';
import '../styles/uploadHub.css';

export default function DataUploadHub() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Top Domain Tab: 'crops' | 'machinery' | 'livestock' | 'fisheries' | 'bulk'
  const domainParam = searchParams.get('tab') || 'crops';
  const activeDomain = ['crops', 'machinery', 'livestock', 'fisheries', 'bulk'].includes(domainParam) ? domainParam : 'crops';

  // Sub-tabs per domain: 'categories' | 'species' | 'croplist' | 'pests' | 'diseases' | 'prescriptions'
  const currentSubParam = searchParams.get('sub') || 'categories';
  const [activeSubTab, setActiveSubTab] = useState(currentSubParam);

  React.useEffect(() => {
    const rawSub = searchParams.get('sub');
    if (rawSub) {
      setActiveSubTab(rawSub === 'crops' ? 'croplist' : rawSub);
    } else {
      setActiveSubTab('categories');
    }
  }, [searchParams]);

  const setDomainTab = (tab) => {
    setSearchParams({ tab, sub: 'categories' });
    setActiveSubTab('categories');
  };

  const setSubSection = (domain, sub) => {
    const targetSub = sub === 'crops' ? 'croplist' : sub;
    setActiveSubTab(targetSub);
    setSearchParams({ tab: domain, sub: targetSub });
  };

  const {
    cropCategories,
    cropList,
    cropPests,
    cropDiseases,
    diseasePrescriptions,
    addCropCategory,
    updateCropCategory,
    deleteCropCategory,
    addCrop,
    updateCrop,
    deleteCrop,
    addCropPest,
    updateCropPest,
    deleteCropPest,
    importCropPests,
    addCropDisease,
    updateCropDisease,
    deleteCropDisease,
    importCropDiseases,
    addDiseasePrescription,
    updateDiseasePrescription,
    deleteDiseasePrescription,
    importDiseasePrescriptions,
    resetDatasetToDefault,
    exportData
  } = useReferenceData();

  // Toast Alert
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedCropFilter, setSelectedCropFilter] = useState('ALL');

  // Modals state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showAddPestModal, setShowAddPestModal] = useState(false);
  const [showAddDiseaseModal, setShowAddDiseaseModal] = useState(false);
  const [showAddRxModal, setShowAddRxModal] = useState(false);
  const [inspectItem, setInspectItem] = useState(null);

  const fileInputRef = useRef(null);

  // ==========================================
  // FILTERED DATASETS
  // ==========================================
  const filteredCrops = useMemo(() => {
    let list = [...cropList];
    if (selectedCategoryFilter !== 'ALL') {
      list = list.filter(c => String(c.categoryId) === String(selectedCategoryFilter) || c.categoryCode === selectedCategoryFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => (c.name || '').toLowerCase().includes(q) || (c.telugu || '').includes(q) || (c.code || '').toLowerCase().includes(q));
    }
    return list;
  }, [cropList, selectedCategoryFilter, searchTerm]);

  const filteredPests = useMemo(() => {
    let list = [...cropPests];
    if (selectedCropFilter !== 'ALL') {
      list = list.filter(p => (p.cropId || '').toLowerCase() === selectedCropFilter.toLowerCase());
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.telugu || '').includes(q) ||
        (p.scientificName || '').toLowerCase().includes(q) ||
        (p.damageSymptoms || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [cropPests, selectedCropFilter, searchTerm]);

  const filteredDiseases = useMemo(() => {
    let list = [...cropDiseases];
    if (selectedCropFilter !== 'ALL') {
      list = list.filter(d => (d.cropId || '').toLowerCase() === selectedCropFilter.toLowerCase());
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(d =>
        (d.name || '').toLowerCase().includes(q) ||
        (d.telugu || '').includes(q) ||
        (d.pathogen || '').toLowerCase().includes(q) ||
        (d.symptoms || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [cropDiseases, selectedCropFilter, searchTerm]);

  const filteredPrescriptions = useMemo(() => {
    let list = [...diseasePrescriptions];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(r =>
        (r.id || '').toLowerCase().includes(q) ||
        (r.farmerName || '').toLowerCase().includes(q) ||
        (r.farmerPhone || '').includes(q) ||
        (r.diseaseName || '').toLowerCase().includes(q) ||
        (r.village || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [diseasePrescriptions, searchTerm]);

  return (
    <div className="upload-hub-container">
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#ef4444' : '#1b4332',
          color: '#ffffff',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {toast.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="upload-hub-header">
        <div className="upload-hub-title-group">
          <span className="upload-hub-badge">
            <Database size={14} /> CLIC MASTER DATA INGESTION & UPLOAD CENTER
          </span>
          <h1 className="upload-hub-main-title">
            <Upload size={28} /> Master Agronomy & Services Ingestion Hub
          </h1>
          <p className="upload-hub-subtitle">
            Consolidated central hub to upload and govern <strong>Crops</strong> (Categories ➔ Crops List ➔ Pests ➔ Diseases ➔ Prescriptions), <strong>Farm Machinery</strong>, <strong>Livestock</strong>, and <strong>Fisheries</strong> master tables.
          </p>
        </div>

        <div className="upload-hub-header-stats">
          <div className="hub-stat-pill">
            <span className="hub-stat-pill-val">{cropList.length}</span>
            <span className="hub-stat-pill-lbl">Crops</span>
          </div>
          <div className="hub-stat-pill">
            <span className="hub-stat-pill-val">{cropPests.length + cropDiseases.length}</span>
            <span className="hub-stat-pill-lbl">Pests & Diseases</span>
          </div>
          <div className="hub-stat-pill">
            <span className="hub-stat-pill-val">{diseasePrescriptions.length}</span>
            <span className="hub-stat-pill-lbl">Prescriptions</span>
          </div>
          <div className="hub-stat-pill">
            <span className="hub-stat-pill-val">{chcEquipment.length + fmcInventory.length}</span>
            <span className="hub-stat-pill-lbl">Machines</span>
          </div>
        </div>
      </div>



      {/* ============================================================ */}
      {/* 🌾 DOMAIN 1: CROPS MASTER HUB (ALL CROP RELATED INSIDE)      */}
      {/* ============================================================ */}
      {activeDomain === 'crops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Inner Crop Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div className="ref-main-switcher" style={{ margin: 0 }}>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'categories' ? 'active' : ''}`}
                onClick={() => setSubSection('crops', 'categories')}
              >
                <FolderTree size={16} /> 1. Categories ({cropCategories.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'croplist' ? 'active' : ''}`}
                onClick={() => setSubSection('crops', 'croplist')}
              >
                <Sprout size={16} /> 2. Crops List ({cropList.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'pests' ? 'active' : ''}`}
                onClick={() => setSubSection('crops', 'pests')}
              >
                <Bug size={16} /> 3. Crop Pests ({cropPests.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'diseases' ? 'active' : ''}`}
                onClick={() => setSubSection('crops', 'diseases')}
              >
                <ShieldAlert size={16} /> 4. Crop Diseases ({cropDiseases.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'prescriptions' ? 'active' : ''}`}
                onClick={() => setSubSection('crops', 'prescriptions')}
              >
                <Stethoscope size={16} /> 5. Prescriptions ({diseasePrescriptions.length})
              </button>
            </div>

            <button
              className="btn-primary-action"
              onClick={() => {
                if (activeSubTab === 'categories') setShowAddCategoryModal(true);
                else if (activeSubTab === 'croplist') setShowAddCropModal(true);
                else if (activeSubTab === 'pests') setShowAddPestModal(true);
                else if (activeSubTab === 'diseases') setShowAddDiseaseModal(true);
                else if (activeSubTab === 'prescriptions') setShowAddRxModal(true);
              }}
            >
              <Plus size={16} /> Add {activeSubTab === 'categories' ? 'Category' : activeSubTab === 'croplist' ? 'Crop' : activeSubTab === 'pests' ? 'Pest' : activeSubTab === 'diseases' ? 'Disease' : 'Prescription'}
            </button>
          </div>

          {/* 1.1 CROP CATEGORIES */}
          {activeSubTab === 'categories' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <FolderTree size={18} color="#2d6a4f" />
                  <span>Crop Categories Master (Step 1)</span>
                </div>
                <button className="btn-outline-action" onClick={() => exportData('crop_categories', cropCategories, 'json')}>
                  <Download size={14} /> Export JSON
                </button>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Category Code</th>
                      <th>Category Name (English)</th>
                      <th>Telugu Regional</th>
                      <th>Crops Attached</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cropCategories.map((cat) => {
                      const count = cropList.filter(c => String(c.categoryId) === String(cat.id) || c.categoryCode === cat.code).length;
                      return (
                        <tr key={cat.id}>
                          <td><strong>#{cat.id}</strong></td>
                          <td><code>{cat.code}</code></td>
                          <td><strong>{cat.name}</strong></td>
                          <td style={{ color: '#2d6a4f', fontWeight: '600' }}>{cat.telugu || '-'}</td>
                          <td><span className="badge" style={{ background: '#ecfdf5', color: '#166534', padding: '3px 8px' }}>{count} Crops</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="btn-outline-action"
                              style={{ padding: '4px 8px', color: '#ef4444' }}
                              onClick={() => {
                                if (window.confirm(`Delete category "${cat.name}"?`)) {
                                  deleteCropCategory(cat.id);
                                  showToast(`Deleted category "${cat.name}"`);
                                }
                              }}
                            >
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

          {/* 1.2 CROPS LIST */}
          {activeSubTab === 'croplist' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <Sprout size={18} color="#2d6a4f" />
                  <span>Crops List Master (Step 2 - Category Linked)</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">All Categories ({cropCategories.length})</option>
                    {cropCategories.map(c => (
                      <option key={c.id} value={c.code || c.id}>{c.name} ({c.telugu})</option>
                    ))}
                  </select>
                  <button className="btn-outline-action" onClick={() => exportData('crop_list', cropList, 'json')}>
                    <Download size={14} /> Export JSON
                  </button>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Category</th>
                      <th>Crop Code</th>
                      <th>Crop Name</th>
                      <th>Telugu</th>
                      <th>Linked Pests & Diseases</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCrops.map((crop) => (
                      <tr key={crop.id}>
                        <td><strong>#{crop.id}</strong></td>
                        <td><span className="pill-crop">{crop.categoryCode || 'CEREALS'}</span></td>
                        <td><code>{crop.code}</code></td>
                        <td><strong>{crop.name}</strong></td>
                        <td style={{ color: '#2d6a4f', fontWeight: '600' }}>{crop.telugu || '-'}</td>
                        <td>
                          <span className="badge" style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px' }}>
                            {cropPests.filter(p => (p.cropId || '').toLowerCase() === (crop.code || crop.name).toLowerCase()).length} Pests • {cropDiseases.filter(d => (d.cropId || '').toLowerCase() === (crop.code || crop.name).toLowerCase()).length} Diseases
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-outline-action"
                            style={{ padding: '4px 8px', color: '#ef4444' }}
                            onClick={() => {
                              if (window.confirm(`Delete crop "${crop.name}"?`)) {
                                deleteCrop(crop.id);
                                showToast(`Deleted crop "${crop.name}"`);
                              }
                            }}
                          >
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

          {/* 1.3 CROP PESTS */}
          {activeSubTab === 'pests' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <Bug size={18} color="#2d6a4f" />
                  <span>Crop Pests Master (Step 3 - Crop Linked)</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    value={selectedCropFilter}
                    onChange={(e) => setSelectedCropFilter(e.target.value)}
                  >
                    <option value="ALL">All Crops ({CROP_THEMES.length})</option>
                    {CROP_THEMES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.telugu})</option>
                    ))}
                  </select>
                  <button className="btn-outline-action" onClick={() => exportData('crop_pests', cropPests, 'json')}>
                    <Download size={14} /> Export JSON
                  </button>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Pest ID</th>
                      <th>Target Crop</th>
                      <th>Pest Name</th>
                      <th>Category</th>
                      <th>Damage Symptoms</th>
                      <th>Bio-Inoculum Formula</th>
                      <th>Pharmacy Pack</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPests.map((pest) => (
                      <tr key={pest.id}>
                        <td><code>{pest.id}</code></td>
                        <td><span className="pill-crop">{pest.cropId}</span></td>
                        <td>
                          <div><strong>{pest.name}</strong></div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{pest.telugu}</div>
                        </td>
                        <td><span style={{ textTransform: 'capitalize', fontWeight: '600', color: '#2563eb' }}>{pest.category}</span></td>
                        <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pest.damageSymptoms}</td>
                        <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>{pest.inoculum?.formula || 'Standard Inoculum'}</td>
                        <td><span className="badge" style={{ background: '#ecfdf5', color: '#166534', padding: '3px 8px' }}>{pest.recommendedProducts?.length || 0} Products</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-outline-action"
                            style={{ padding: '4px 8px', color: '#ef4444' }}
                            onClick={() => {
                              if (window.confirm(`Delete pest "${pest.name}"?`)) {
                                deleteCropPest(pest.id);
                                showToast(`Deleted "${pest.name}"`);
                              }
                            }}
                          >
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

          {/* 1.4 CROP DISEASES */}
          {activeSubTab === 'diseases' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <ShieldAlert size={18} color="#2d6a4f" />
                  <span>Crop Diseases Master (Step 4 - Crop Linked)</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    value={selectedCropFilter}
                    onChange={(e) => setSelectedCropFilter(e.target.value)}
                  >
                    <option value="ALL">All Crops ({CROP_THEMES.length})</option>
                    {CROP_THEMES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.telugu})</option>
                    ))}
                  </select>
                  <button className="btn-outline-action" onClick={() => exportData('crop_diseases', cropDiseases, 'json')}>
                    <Download size={14} /> Export JSON
                  </button>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Disease ID</th>
                      <th>Target Crop</th>
                      <th>Disease Name</th>
                      <th>Pathogen</th>
                      <th>Symptoms</th>
                      <th>Severity Levels</th>
                      <th>Pharmacy Pack</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiseases.map((d) => (
                      <tr key={d.id}>
                        <td><code>{d.id}</code></td>
                        <td><span className="pill-crop">{d.cropId}</span></td>
                        <td>
                          <div><strong>{d.name}</strong></div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{d.telugu}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', fontWeight: '600' }}>{d.pathogen}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{d.causalAgent}</div>
                        </td>
                        <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.symptoms}</td>
                        <td><span className="badge" style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px' }}>{d.severityLevels?.length || 3} Tiers</span></td>
                        <td><span className="badge" style={{ background: '#ecfdf5', color: '#166534', padding: '3px 8px' }}>{d.recommendedProducts?.length || 0} Products</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-outline-action"
                            style={{ padding: '4px 8px', color: '#ef4444' }}
                            onClick={() => {
                              if (window.confirm(`Delete disease "${d.name}"?`)) {
                                deleteCropDisease(d.id);
                                showToast(`Deleted "${d.name}"`);
                              }
                            }}
                          >
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

          {/* 1.5 PRESCRIPTIONS */}
          {activeSubTab === 'prescriptions' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <Stethoscope size={18} color="#2d6a4f" />
                  <span>Phytosanitary Prescriptions & Diagnostic Records</span>
                </div>
                <button className="btn-outline-action" onClick={() => exportData('prescriptions', diseasePrescriptions, 'json')}>
                  <Download size={14} /> Export JSON
                </button>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Rx ID</th>
                      <th>Date</th>
                      <th>Farmer Name & Phone</th>
                      <th>Diagnosed Disease / Pest</th>
                      <th>Prescribed Pharmacy Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrescriptions.map((rx) => (
                      <tr key={rx.id}>
                        <td><strong style={{ color: '#2d6a4f' }}>{rx.id}</strong></td>
                        <td>{rx.date}</td>
                        <td>
                          <div><strong>{rx.farmerName}</strong></div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>📞 {rx.farmerPhone} • {rx.village}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{rx.diseaseName}</div>
                          <div style={{ fontSize: '11px', color: '#dc2626' }}>{rx.severity}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px' }}>{rx.prescribedProducts?.map(p => p.name).join(', ') || 'Prescribed Pack'}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>🏪 {rx.prescribedProducts?.[0]?.shopName || 'PACS Hub'}</div>
                        </td>
                        <td><strong style={{ color: '#1b4332' }}>₹{rx.totalAmount || 0}</strong></td>
                        <td><span className="badge" style={{ background: '#ecfdf5', color: '#065f46', padding: '3px 8px' }}>{rx.status}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-outline-action"
                            style={{ padding: '4px 8px' }}
                            title="Print Slip"
                            onClick={() => setInspectItem({ type: 'prescription', data: rx })}
                          >
                            <Printer size={14} />
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
      )}

      {/* ============================================================ */}
      {/* 🚜 DOMAIN 2: FARM MACHINERY HUB                              */}
      {/* ============================================================ */}
      {activeDomain === 'machinery' && (
        <div className="preview-staging-card">
          <div className="staging-header">
            <div className="staging-title">
              <Tractor size={20} color="#2d6a4f" />
              <span>Custom Hiring Centers (CHC) & FMC Machinery Dealers</span>
            </div>
            <button className="btn-outline-action" onClick={() => exportData('chc_equipment', chcEquipment, 'json')}>
              <Download size={14} /> Export JSON
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Manage {chcEquipment.length} CHC rental machines and {fmcInventory.length} FMC dealership equipment with daily rental tariffs and government subsidy parameters.
          </p>
          <div className="upload-table-wrapper">
            <table className="upload-table">
              <thead>
                <tr>
                  <th>Machine Code</th>
                  <th>Machine Name</th>
                  <th>Operation Category</th>
                  <th>Daily Rental (₹)</th>
                  <th>MSRP Purchase (₹)</th>
                  <th>Govt Subsidy (₹)</th>
                </tr>
              </thead>
              <tbody>
                {chcEquipment.map((eq) => (
                  <tr key={eq.id}>
                    <td><code>{eq.id}</code></td>
                    <td><strong>{eq.name}</strong></td>
                    <td><span className="pill-crop">{eq.operationCategory || 'Primary Tillage'}</span></td>
                    <td><strong style={{ color: '#2563eb' }}>₹{eq.dailyRate || 2500}/day</strong></td>
                    <td>₹{eq.purchasePrice?.toLocaleString('en-IN') || '1,50,000'}</td>
                    <td><span style={{ color: '#16a34a', fontWeight: '700' }}>₹{eq.subsidyAmount?.toLocaleString('en-IN') || '75,000'} (50%)</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 🐄 DOMAIN 3: LIVESTOCK HUB (ALL LIVESTOCK RELATED INSIDE)     */}
      {/* ============================================================ */}
      {activeDomain === 'livestock' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Inner Livestock Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div className="ref-main-switcher" style={{ margin: 0 }}>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'categories' ? 'active' : ''}`}
                onClick={() => setSubSection('livestock', 'categories')}
              >
                <FolderTree size={16} /> 1. Categories (4)
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'species' ? 'active' : ''}`}
                onClick={() => setSubSection('livestock', 'species')}
              >
                <Activity size={16} /> 2. Livestock List ({LIVESTOCK_ANIMALS.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'diseases' ? 'active' : ''}`}
                onClick={() => setSubSection('livestock', 'diseases')}
              >
                <ShieldAlert size={16} /> 3. Diseases ({LIVESTOCK_DISEASES.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'prescriptions' ? 'active' : ''}`}
                onClick={() => setSubSection('livestock', 'prescriptions')}
              >
                <Stethoscope size={16} /> 4. Prescriptions & Care
              </button>
            </div>

            <button className="btn-outline-action" onClick={() => exportData('livestock_master', { animals: LIVESTOCK_ANIMALS, diseases: LIVESTOCK_DISEASES }, 'json')}>
              <Download size={14} /> Export Livestock JSON
            </button>
          </div>

          {/* 3.1 LIVESTOCK CATEGORIES */}
          {activeSubTab === 'categories' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <FolderTree size={18} color="#2d6a4f" />
                  <span>Livestock Species Categories</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Category Code</th>
                      <th>Category Name</th>
                      <th>Telugu Name</th>
                      <th>Primary Husbandry Focus</th>
                      <th>Feeding & Care Protocols</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>BOVINE</code></td>
                      <td><strong>Dairy Cattle & Buffalo</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>పాడి పశువులు</td>
                      <td>Milk Production & Breeding</td>
                      <td>Green Fodder (25-30kg), Concentrate Feed (3-4kg), Mineral Block</td>
                    </tr>
                    <tr>
                      <td><code>RUMINANT</code></td>
                      <td><strong>Sheep & Goat (Small Ruminants)</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>మేకలు & గొర్రెలు</td>
                      <td>Meat & Fiber Production</td>
                      <td>Grazing (6-8 hrs) + Silage & Deworming schedule</td>
                    </tr>
                    <tr>
                      <td><code>AVIAN</code></td>
                      <td><strong>Poultry & Backyard Desi</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>కోళ్లు (నాటు & బ్రాయిలర్)</td>
                      <td>Egg & Meat Production</td>
                      <td>Chick Starter, Layer Mash & Clean Water with Vitamin A/D3</td>
                    </tr>
                    <tr>
                      <td><code>SWINE</code></td>
                      <td><strong>Piggery Enterprise</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>పందుల పెంపకం</td>
                      <td>Commercial Pork Production</td>
                      <td>Balanced Swine Grist, Kitchen Greens & Biosecurity Dips</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3.2 LIVESTOCK LIST */}
          {activeSubTab === 'species' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <Activity size={18} color="#2d6a4f" />
                  <span>Livestock Species & Breed Profiles</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Animal Code</th>
                      <th>Species & Breed Name</th>
                      <th>Telugu Name</th>
                      <th>Popular Breeds</th>
                      <th>Daily Water & Feed Norms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIVESTOCK_ANIMALS.map(anim => (
                      <tr key={anim.id}>
                        <td><code>{anim.id.toUpperCase()}</code></td>
                        <td><strong>{anim.icon} {anim.name}</strong></td>
                        <td style={{ color: '#2d6a4f', fontWeight: '600' }}>{anim.telugu}</td>
                        <td style={{ fontSize: '12px' }}>{anim.speciesList}</td>
                        <td style={{ fontSize: '12px', maxWidth: '300px' }}>
                          <div><strong>Water:</strong> {anim.waterReq}</div>
                          <div><strong>Feed:</strong> {anim.feedingNorms}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3.3 LIVESTOCK DISEASES */}
          {activeSubTab === 'diseases' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <ShieldAlert size={18} color="#2d6a4f" />
                  <span>Livestock Disease Protocols & Pathologies</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Disease ID</th>
                      <th>Animal Species</th>
                      <th>Disease Name</th>
                      <th>Pathogen Type</th>
                      <th>Diagnostic Symptoms</th>
                      <th>Emergency Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LIVESTOCK_DISEASES.map((ld) => (
                      <tr key={ld.id}>
                        <td><code>{ld.id}</code></td>
                        <td><span className="pill-crop">{ld.animalId || 'Cattle'}</span></td>
                        <td>
                          <div><strong>{ld.name}</strong></div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{ld.telugu}</div>
                        </td>
                        <td><span style={{ fontWeight: '600', color: '#dc2626' }}>{ld.pathogen || 'Bacterial / Viral'}</span></td>
                        <td style={{ maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {Array.isArray(ld.symptoms) ? ld.symptoms.join('; ') : ld.symptoms}
                        </td>
                        <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {Array.isArray(ld.controlMeasures) ? ld.controlMeasures[0] : (ld.treatment?.medication || 'Antiseptic Wash + Antibiotic')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3.4 LIVESTOCK PRESCRIPTIONS */}
          {activeSubTab === 'prescriptions' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <Stethoscope size={18} color="#2d6a4f" />
                  <span>Livestock Veterinary Prescriptions & Store Linkages</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Protocol Code</th>
                      <th>Disease / Condition</th>
                      <th>Prescribed Veterinary Product</th>
                      <th>Recommended Dosage & Administration</th>
                      <th>Procurement Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>RX-VET-01</code></td>
                      <td><strong>Mastitis (Udder Inflammation)</strong></td>
                      <td>Masti-Plus Herbal Bolus + Iodine Teat Dip 0.5%</td>
                      <td>2 Bolus twice daily for 5 days + Dip teats after milking</td>
                      <td><span className="pill-crop">PACS Bio-Input Store</span></td>
                    </tr>
                    <tr>
                      <td><code>RX-VET-02</code></td>
                      <td><strong>Foot & Mouth Disease (FMD)</strong></td>
                      <td>Raksha-Ovac Polyvalent Vaccine + Boroglycerine Gel</td>
                      <td>Annual vaccination (2ml SubQ) + Apply gel on oral ulcers</td>
                      <td><span className="pill-crop">Vet Dispensary / PACS</span></td>
                    </tr>
                    <tr>
                      <td><code>RX-VET-03</code></td>
                      <td><strong>Gastrointestinal Helminths</strong></td>
                      <td>Albendazole 10% Suspension / Bio-Wormer</td>
                      <td>10 mg/kg live body weight every 3 months</td>
                      <td><span className="pill-crop">PACS Bio-Input Store</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 🐟 DOMAIN 4: FISHERIES HUB (ALL FISHERIES RELATED INSIDE)    */}
      {/* ============================================================ */}
      {activeDomain === 'fisheries' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Inner Fisheries Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff',
            padding: '8px 12px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div className="ref-main-switcher" style={{ margin: 0 }}>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'categories' ? 'active' : ''}`}
                onClick={() => setSubSection('fisheries', 'categories')}
              >
                <FolderTree size={16} /> 1. Categories (4)
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'species' ? 'active' : ''}`}
                onClick={() => setSubSection('fisheries', 'species')}
              >
                <Fish size={16} /> 2. Fish Species ({FISH_SPECIES.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'diseases' ? 'active' : ''}`}
                onClick={() => setSubSection('fisheries', 'diseases')}
              >
                <ShieldAlert size={16} /> 3. Diseases ({FISH_DISEASES.length})
              </button>
              <button
                className={`ref-switcher-btn ${activeSubTab === 'prescriptions' ? 'active' : ''}`}
                onClick={() => setSubSection('fisheries', 'prescriptions')}
              >
                <Stethoscope size={16} /> 4. Prescriptions & Treatments
              </button>
            </div>

            <button className="btn-outline-action" onClick={() => exportData('fisheries_master', { species: FISH_SPECIES, diseases: FISH_DISEASES }, 'json')}>
              <Download size={14} /> Export Fisheries JSON
            </button>
          </div>

          {/* 4.1 FISHERIES CATEGORIES */}
          {activeSubTab === 'categories' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <FolderTree size={18} color="#2d6a4f" />
                  <span>Fisheries & Aquaculture Culture Systems</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Culture System</th>
                      <th>Name (English)</th>
                      <th>Telugu Regional</th>
                      <th>Water Quality Parameters</th>
                      <th>Recommended Stocking Regimes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>FRESH_POND</code></td>
                      <td><strong>Freshwater Earthen Ponds</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>మంచినీటి చెరువులు</td>
                      <td>DO &gt; 5.0 ppm, pH 7.5 - 8.5, Alkalinity &gt; 100 ppm</td>
                      <td>3,000 - 4,000 fingerlings/acre (Catla, Rohu, Mrigal)</td>
                    </tr>
                    <tr>
                      <td><code>BIOFLOC_RAS</code></td>
                      <td><strong>Biofloc & Recirculating Aquaculture (RAS)</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>బయోఫ్లాక్ & ఆర్.ఏ.ఎస్ ట్యాంకులు</td>
                      <td>High Aeration, C:N Ratio 10:1 - 15:1, TAN &lt; 0.5 ppm</td>
                      <td>High density Tilapia & Pangasius (80-100 fish/m³)</td>
                    </tr>
                    <tr>
                      <td><code>CAGE_CULTURE</code></td>
                      <td><strong>Reservoir Floating Cages</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>రిజర్వాయర్ కేజ్ కల్చర్</td>
                      <td>Continuous water exchange, Minimum 5m water depth</td>
                      <td>Pangasius & Tilapia in 6m x 4m x 4m HDPE cages</td>
                    </tr>
                    <tr>
                      <td><code>SHRIMP_POND</code></td>
                      <td><strong>Freshwater Scampi Farming</strong></td>
                      <td style={{ color: '#2d6a4f', fontWeight: '600' }}>మంచినీటి రొయ్యల సాగు</td>
                      <td>Hardness &gt; 100 ppm, Plankton bloom control</td>
                      <td>15,000 - 20,000 post-larvae/acre</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4.2 FISH SPECIES LIST */}
          {activeSubTab === 'species' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <Fish size={18} color="#2d6a4f" />
                  <span>Fish Species Master & Culture Characteristics</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Species ID</th>
                      <th>Common & Scientific Name</th>
                      <th>Telugu Name</th>
                      <th>Stocking Density</th>
                      <th>Feeding & Growth Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FISH_SPECIES.map((sp) => (
                      <tr key={sp.id}>
                        <td><code>{sp.id.toUpperCase()}</code></td>
                        <td>
                          <div><strong>{sp.icon} {sp.name}</strong></div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}><em>{sp.speciesList}</em></div>
                        </td>
                        <td style={{ color: '#2d6a4f', fontWeight: '600' }}>{sp.telugu}</td>
                        <td><span className="pill-crop">{sp.density || '3000-4000 / acre'}</span></td>
                        <td style={{ fontSize: '12px' }}>
                          <div><strong>Feeding:</strong> {sp.feedingZone}</div>
                          <div><strong>Period:</strong> {sp.growthPeriod} (Target: {sp.harvestWeight})</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4.3 FISH DISEASES */}
          {activeSubTab === 'diseases' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <ShieldAlert size={18} color="#2d6a4f" />
                  <span>Fish Pathologies & Disease Diagnostics</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Disease ID</th>
                      <th>Host Species</th>
                      <th>Pathology Name</th>
                      <th>Pathogen Category</th>
                      <th>Diagnostic Symptoms</th>
                      <th>Recommended Pond Treatment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FISH_DISEASES.map((fd) => (
                      <tr key={fd.id}>
                        <td><code>{fd.id}</code></td>
                        <td><span className="pill-crop">{fd.speciesId || 'Carps'}</span></td>
                        <td>
                          <div><strong>{fd.name}</strong></div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{fd.telugu}</div>
                        </td>
                        <td><span style={{ fontWeight: '600', color: '#dc2626' }}>{fd.pathogen || 'Fungal / Parasitic'}</span></td>
                        <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {Array.isArray(fd.symptoms) ? fd.symptoms.join('; ') : fd.symptoms}
                        </td>
                        <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {Array.isArray(fd.controlMeasures) ? fd.controlMeasures[0] : (fd.treatment?.medication || 'CIFAX or Salt Treatment')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4.4 FISH PRESCRIPTIONS */}
          {activeSubTab === 'prescriptions' && (
            <div className="preview-staging-card">
              <div className="staging-header">
                <div className="staging-title">
                  <Stethoscope size={18} color="#2d6a4f" />
                  <span>Aquaculture Water Treatments & Prescriptions</span>
                </div>
              </div>
              <div className="upload-table-wrapper">
                <table className="upload-table">
                  <thead>
                    <tr>
                      <th>Rx Code</th>
                      <th>Pathology / Water Condition</th>
                      <th>Prescribed Treatment / Chemical</th>
                      <th>Pond Application Dosage</th>
                      <th>Procurement Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>RX-FISH-01</code></td>
                      <td><strong>Epizootic Ulcerative Syndrome (EUS)</strong></td>
                      <td>CIFAX (CIFA Formulation) + Quicklime (CaO)</td>
                      <td>CIFAX @ 1 Litre/acre-meter water depth + Lime @ 100 kg/acre</td>
                      <td><span className="pill-crop">PACS Aqua Supply Center</span></td>
                    </tr>
                    <tr>
                      <td><code>RX-FISH-02</code></td>
                      <td><strong>Argulus (Fish Lice Infestation)</strong></td>
                      <td>Ivermectin 1% Oral Feed Premix + Delta-Plus dip</td>
                      <td>Ivermectin @ 50 mg/kg fish body weight in feed for 3 days</td>
                      <td><span className="pill-crop">PACS Aqua Supply Center</span></td>
                    </tr>
                    <tr>
                      <td><code>RX-FISH-03</code></td>
                      <td><strong>Bacterial Gill & Fin Rot</strong></td>
                      <td>Benzalkonium Chloride (BKC 50%) / Potassium Permanganate</td>
                      <td>BKC @ 1.5 - 2.0 Litres/acre-meter diluted in 50L pond water</td>
                      <td><span className="pill-crop">PACS Aqua Supply Center</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* ⚡ DOMAIN 5: BULK MASTER BACKUP                              */}
      {/* ============================================================ */}
      {activeDomain === 'bulk' && (
        <div className="preview-staging-card">
          <div className="staging-header">
            <div className="staging-title">
              <Sparkles size={20} color="#2d6a4f" />
              <span>Consolidated Master Platform Backup Engine</span>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6' }}>
            Download complete master schemas for offline field deployments or restore factory demo databases for farmer training.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4>🌾 Crops Full Dataset</h4>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{cropCategories.length} Categories, {cropList.length} Crops, {cropPests.length + cropDiseases.length} Diseases</p>
              <button className="btn-outline-action" style={{ width: '100%' }} onClick={() => exportData('crops_master_dataset', { categories: cropCategories, crops: cropList, pests: cropPests, diseases: cropDiseases }, 'json')}>
                <Download size={14} /> Export Crops JSON
              </button>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4>🚜 Machinery Dataset</h4>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{chcEquipment.length} CHC Machines & FMC Dealers</p>
              <button className="btn-outline-action" style={{ width: '100%' }} onClick={() => exportData('machinery_dataset', chcEquipment, 'json')}>
                <Download size={14} /> Export Machinery JSON
              </button>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4>🐄 Livestock & Fisheries</h4>
              <p style={{ fontSize: '12px', color: '#64748b' }}>{LIVESTOCK_ANIMALS.length} Animals & {FISH_SPECIES.length} Fish Species</p>
              <button className="btn-outline-action" style={{ width: '100%' }} onClick={() => exportData('livestock_fisheries_dataset', { livestock: LIVESTOCK_ANIMALS, fisheries: FISH_SPECIES }, 'json')}>
                <Download size={14} /> Export LS & Fish JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onSave={(cat) => {
            addCropCategory(cat, user);
            showToast(`✓ Created Category "${cat.name}"!`);
            setShowAddCategoryModal(false);
          }}
        />
      )}

      {showAddCropModal && (
        <AddCropModal
          categories={cropCategories}
          onClose={() => setShowAddCropModal(false)}
          onSave={(crop) => {
            addCrop(crop, user);
            showToast(`✓ Added Crop "${crop.name}"!`);
            setShowAddCropModal(false);
          }}
        />
      )}

      {showAddPestModal && (
        <AddPestModal
          crops={cropList}
          onClose={() => setShowAddPestModal(false)}
          onSave={(pest) => {
            addCropPest(pest);
            showToast(`✓ Added Crop Pest "${pest.name}"!`);
            setShowAddPestModal(false);
          }}
        />
      )}

      {showAddDiseaseModal && (
        <AddDiseaseModal
          crops={cropList}
          onClose={() => setShowAddDiseaseModal(false)}
          onSave={(disease) => {
            addCropDisease(disease);
            showToast(`✓ Added Crop Disease "${disease.name}"!`);
            setShowAddDiseaseModal(false);
          }}
        />
      )}

      {showAddRxModal && (
        <AddPrescriptionModal
          pests={cropPests}
          diseases={cropDiseases}
          onClose={() => setShowAddRxModal(false)}
          onSave={(rx) => {
            addDiseasePrescription(rx);
            showToast(`✓ Created Prescription "${rx.id}"!`);
            setShowAddRxModal(false);
          }}
        />
      )}

      {inspectItem && (
        <InspectModal item={inspectItem} onClose={() => setInspectItem(null)} />
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Simple Modal Forms
// ------------------------------------------------------------
function AddCategoryModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [telugu, setTelugu] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Category Name is required.');
    onSave({ name: name.trim(), code: code.trim() || name.toUpperCase().replace(/\s+/g, '_'), telugu: telugu.trim() });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '500px', width: '100%', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1b4332' }}>Add Crop Category</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-field-group">
            <label>Category Name (English) *</label>
            <input type="text" placeholder="e.g. Cereals, Pulses, Spices" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-field-group">
            <label>Category Code</label>
            <input type="text" placeholder="e.g. CEREALS" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="form-field-group">
            <label>Telugu Regional Name</label>
            <input type="text" placeholder="e.g. ధాన్యాలు" value={telugu} onChange={(e) => setTelugu(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="btn-outline-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-action">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddCropModal({ categories, onClose, onSave }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 1);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [telugu, setTelugu] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Crop Name is required.');
    const selectedCat = categories.find(c => String(c.id) === String(categoryId));
    onSave({
      categoryId: Number(categoryId),
      categoryCode: selectedCat?.code || 'CEREALS',
      name: name.trim(),
      code: code.trim() || name.toUpperCase().replace(/\s+/g, '_'),
      telugu: telugu.trim()
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '500px', width: '100%', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1b4332' }}>Add Crop (Linked to Category)</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-field-group">
            <label>Select Category *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.telugu})</option>
              ))}
            </select>
          </div>
          <div className="form-field-group">
            <label>Crop Name (English) *</label>
            <input type="text" placeholder="e.g. Paddy (Rice), Cotton" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-field-group">
            <label>Crop Code</label>
            <input type="text" placeholder="e.g. PADDY, COTTON" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="form-field-group">
            <label>Telugu Regional Name</label>
            <input type="text" placeholder="e.g. వరి, పత్తి" value={telugu} onChange={(e) => setTelugu(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="btn-outline-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-action">Save Crop</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddPestModal({ crops, onClose, onSave }) {
  const [cropId, setCropId] = useState(crops[0]?.code?.toLowerCase() || 'paddy');
  const [name, setName] = useState('');
  const [telugu, setTelugu] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState('sucking');
  const [damageSymptoms, setDamageSymptoms] = useState('');
  const [inoculumFormula, setInoculumFormula] = useState('');
  const [productName, setProductName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Pest Name is required.');
    onSave({
      id: `${cropId}-pest-${Date.now().toString().slice(-4)}`,
      cropId,
      name: name.trim(),
      telugu: telugu.trim(),
      scientificName: scientificName.trim(),
      category,
      damageSymptoms: damageSymptoms.trim(),
      inoculum: { formula: inoculumFormula.trim() || 'Standard Bio-Formulation', dosagePerAcre: '1 kg per acre' },
      recommendedProducts: productName.trim() ? [{ id: `prod-p-${Date.now()}`, name: productName.trim(), unitPrice: 350, storeName: 'Chandampet PACS Bio-Input Center' }] : []
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1b4332' }}>Add Crop Pest Record</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-field-group">
            <label>Select Target Crop *</label>
            <select value={cropId} onChange={(e) => setCropId(e.target.value)}>
              {crops.map(c => (
                <option key={c.id} value={(c.code || c.name).toLowerCase()}>{c.name} ({c.telugu})</option>
              ))}
            </select>
          </div>
          <div className="modal-grid-2">
            <div className="form-field-group">
              <label>Pest Name *</label>
              <input type="text" placeholder="e.g. Brown Plant Hopper (BPH)" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-field-group">
              <label>Telugu Regional Name</label>
              <input type="text" placeholder="e.g. గోధుమ రంగు దోమ" value={telugu} onChange={(e) => setTelugu(e.target.value)} />
            </div>
          </div>
          <div className="modal-grid-2">
            <div className="form-field-group">
              <label>Scientific Name</label>
              <input type="text" placeholder="e.g. Nilaparvata lugens" value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
            </div>
            <div className="form-field-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="sucking">Sucking Pest</option>
                <option value="chewing">Chewing / Defoliator</option>
                <option value="borers">Borer / Fruit Feeder</option>
              </select>
            </div>
          </div>
          <div className="form-field-group">
            <label>Damage Symptoms</label>
            <textarea rows={2} placeholder="Describe hopper burn, yellowing..." value={damageSymptoms} onChange={(e) => setDamageSymptoms(e.target.value)} />
          </div>
          <div className="modal-grid-2">
            <div className="form-field-group">
              <label>Bio-Inoculum Formula</label>
              <input type="text" placeholder="e.g. Beauveria bassiana Inoculum" value={inoculumFormula} onChange={(e) => setInoculumFormula(e.target.value)} />
            </div>
            <div className="form-field-group">
              <label>PACS Store Input Product</label>
              <input type="text" placeholder="e.g. Beauveria Bio-Pesticide (1kg)" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="btn-outline-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-action">Save Pest Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddDiseaseModal({ crops, onClose, onSave }) {
  const [cropId, setCropId] = useState(crops[0]?.code?.toLowerCase() || 'paddy');
  const [name, setName] = useState('');
  const [telugu, setTelugu] = useState('');
  const [pathogen, setPathogen] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [productName, setProductName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Disease Name is required.');
    onSave({
      id: `${cropId}-disease-${Date.now().toString().slice(-4)}`,
      cropId,
      name: name.trim(),
      telugu: telugu.trim(),
      pathogen: pathogen.trim(),
      causalAgent: 'Fungus',
      symptoms: symptoms.trim(),
      recommendedProducts: productName.trim() ? [{ id: `prod-d-${Date.now()}`, name: productName.trim(), unitPrice: 380, storeName: 'Chandampet PACS Bio-Input Center' }] : []
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1b4332' }}>Add Crop Disease Record</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-field-group">
            <label>Select Target Crop *</label>
            <select value={cropId} onChange={(e) => setCropId(e.target.value)}>
              {crops.map(c => (
                <option key={c.id} value={(c.code || c.name).toLowerCase()}>{c.name} ({c.telugu})</option>
              ))}
            </select>
          </div>
          <div className="modal-grid-2">
            <div className="form-field-group">
              <label>Disease Name *</label>
              <input type="text" placeholder="e.g. Blast (Leaf & Neck Blast)" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-field-group">
              <label>Telugu Regional Name</label>
              <input type="text" placeholder="e.g. వరి అగ్గి తెగులు" value={telugu} onChange={(e) => setTelugu(e.target.value)} />
            </div>
          </div>
          <div className="form-field-group">
            <label>Pathogen / Causal Agent</label>
            <input type="text" placeholder="e.g. Magnaporthe oryzae (Fungus)" value={pathogen} onChange={(e) => setPathogen(e.target.value)} />
          </div>
          <div className="form-field-group">
            <label>Symptoms</label>
            <textarea rows={2} placeholder="Spindle-shaped lesions with ash grey center..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
          </div>
          <div className="form-field-group">
            <label>Recommended PACS Pharmacy Product</label>
            <input type="text" placeholder="e.g. Tricyclazole 75% WP Blast Shield" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="btn-outline-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-action">Save Disease Record</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddPrescriptionModal({ pests, diseases, onClose, onSave }) {
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [village, setVillage] = useState('Chandampet');
  const [diseaseName, setDiseaseName] = useState(diseases[0]?.name || 'Crop Disease');
  const [productName, setProductName] = useState('Tricyclazole 75% WP Formulation');
  const [dosage, setDosage] = useState('0.6g per Litre water');
  const [price, setPrice] = useState(340);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!farmerName.trim()) return alert('Farmer Name is required.');
    onSave({
      id: `RX-CLIC-${Date.now().toString().slice(-4)}`,
      farmerName: farmerName.trim(),
      farmerPhone: farmerPhone.trim() || '9876543210',
      village: village.trim(),
      district: 'Nalgonda',
      diseaseName,
      severity: 'High Infection',
      prescribedProducts: [{ id: `prod-${Date.now()}`, name: productName, price: Number(price), quantity: 2, dosage, shopName: 'Chandampet PACS Bio-Input Center' }],
      totalAmount: Number(price) * 2,
      status: 'Prescription Generated & Dispatched'
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '600px', width: '100%', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1b4332' }}>Generate Walk-in Prescription</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="modal-grid-2">
            <div className="form-field-group">
              <label>Farmer Name *</label>
              <input type="text" placeholder="e.g. Ramu Farmer" value={farmerName} onChange={(e) => setFarmerName(e.target.value)} required />
            </div>
            <div className="form-field-group">
              <label>Farmer Phone *</label>
              <input type="tel" placeholder="e.g. 9876543210" value={farmerPhone} onChange={(e) => setFarmerPhone(e.target.value)} required />
            </div>
          </div>
          <div className="form-field-group">
            <label>Diagnosed Disease / Pest</label>
            <select value={diseaseName} onChange={(e) => setDiseaseName(e.target.value)}>
              {[...diseases, ...pests].map((item, idx) => (
                <option key={idx} value={item.name}>{item.name} ({item.telugu || item.cropId})</option>
              ))}
            </select>
          </div>
          <div className="modal-grid-2">
            <div className="form-field-group">
              <label>Prescribed Formulation</label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div className="form-field-group">
              <label>Dosage Instructions</label>
              <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" className="btn-outline-action" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-action">Generate Prescription</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InspectModal({ item, onClose }) {
  const { data } = item;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ background: '#fff', borderRadius: '14px', maxWidth: '600px', width: '100%', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1b4332' }}>Prescription Slip: {data.id}</h3>
        <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
          <div><strong>Farmer:</strong> {data.farmerName} ({data.farmerPhone}) - {data.village}</div>
          <div><strong>Diagnosis:</strong> {data.diseaseName}</div>
          <div style={{ marginTop: '12px' }}><strong>Prescribed Items:</strong></div>
          <ul>
            {data.prescribedProducts?.map((p, idx) => (
              <li key={idx}>{p.name} - Qty: {p.quantity} (Dosage: {p.dosage})</li>
            ))}
          </ul>
          <div style={{ marginTop: '12px', fontWeight: 'bold' }}>Total Cost: ₹{data.totalAmount}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn-primary-action" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
