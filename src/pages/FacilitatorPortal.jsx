import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CloudRain, Droplets, Users, Upload, CheckCircle, Plus, Tractor, 
  ArrowRight, UserPlus, Search, Edit2, Trash2, X, Filter, Download,
  Eye, FileText, Video, Link as LinkIcon, BookOpen, AlertTriangle,
  RefreshCw, CheckCircle2, MapPin, Phone, Layers
} from 'lucide-react';
import { defaultStates, defaultDistricts, defaultVillages } from '../data/marketData';
import { DEMO_FARMERS, INITIAL_FARMER_QUERIES } from '../data/machineryData';
import { videos as initialVideos } from '../data/crops';
import { getCreateAudit, getUpdateAudit } from '../data/referenceData';
import { useReferenceData } from '../context/ReferenceContext';
import '../styles/facilitator.css';

// Initial Seed Data for Rainfall
const DEFAULT_RAINFALL_RECORDS = [
  { id: 'rf-1', village: 'Chandampet', date: '2026-07-16', rainfall: 14.2, gauge: 'Manual', observer: 'Ramu Reddy', notes: 'Moderate showers throughout morning', enteredBy: 'Facilitator (u12)', createdAt: '2026-07-16 10:30 AM' },
  { id: 'rf-2', village: 'Munchireddypally', date: '2026-07-16', rainfall: 8.6, gauge: 'Automatic', observer: 'Suresh Goud', notes: 'Light drizzle, optimal for cotton sowing', enteredBy: 'Facilitator (u12)', createdAt: '2026-07-16 11:15 AM' },
  { id: 'rf-3', village: 'Marriguda', date: '2026-07-16', rainfall: 22.0, gauge: 'Manual', observer: 'Padmavathi', notes: 'Heavy downpour, minor water accumulation in lowlands', enteredBy: 'Facilitator (u12)', createdAt: '2026-07-16 02:45 PM' },
  { id: 'rf-4', village: 'Chityala', date: '2026-07-15', rainfall: 6.4, gauge: 'Manual', observer: 'Raghu Naik', notes: 'Brief afternoon showers', enteredBy: 'Facilitator (u12)', createdAt: '2026-07-15 05:00 PM' },
  { id: 'rf-5', village: 'Nidamanur', date: '2026-07-15', rainfall: 0.0, gauge: 'IMD Station', observer: 'Kavitha SHG', notes: 'Clear skies, high humidity', enteredBy: 'Facilitator (u12)', createdAt: '2026-07-15 06:30 PM' },
];

// Initial Seed Data for Groundwater
const DEFAULT_GROUNDWATER_RECORDS = [
  { id: 'gw-1', village: 'Chandampet', wellId: 'NLG-BW-012', date: '2026-07-16', depth: 12.4, unit: 'mbgl', method: 'Electric sounder', observer: 'Ramu Reddy', notes: 'Recharge observed post-monsoon start', status: 'Safe', createdAt: '2026-07-16 10:45 AM' },
  { id: 'gw-2', village: 'Munchireddypally', wellId: 'NLG-BW-045', date: '2026-07-16', depth: 15.1, unit: 'mbgl', method: 'Measuring tape', observer: 'Suresh Goud', notes: 'Moderate level, stable pump discharge', status: 'Moderate', createdAt: '2026-07-16 11:30 AM' },
  { id: 'gw-3', village: 'Marriguda', wellId: 'NLG-BW-089', date: '2026-07-16', depth: 11.8, unit: 'mbgl', method: 'Pressure transducer', observer: 'Padmavathi', notes: 'Significant water table rise due to check dam', status: 'Safe', createdAt: '2026-07-16 03:00 PM' },
  { id: 'gw-4', village: 'Chityala', wellId: 'NLG-BW-031', date: '2026-07-15', depth: 18.2, unit: 'mbgl', method: 'Measuring tape', observer: 'Raghu Naik', notes: 'Deep water table, advisories issued for drip irrigation', status: 'Critical', createdAt: '2026-07-15 05:15 PM' },
  { id: 'gw-5', village: 'Nidamanur', wellId: 'NLG-BW-067', date: '2026-07-15', depth: 19.5, unit: 'mbgl', method: 'Measuring tape', observer: 'Kavitha SHG', notes: 'Over-exploited aquifer zone', status: 'Critical', createdAt: '2026-07-15 06:45 PM' },
];

export default function FacilitatorPortal() {
  const { user, hasRole } = useAuth();

  if (!hasRole('facilitator', 'management', 'superadmin')) {
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
  const { refTables } = useReferenceData();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('rainfall');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // =========================================================================
  // 1. RAINFALL STATE & CRUD
  // =========================================================================
  const [rainfallRecords, setRainfallRecords] = useState(() => {
    const saved = localStorage.getItem('clic_rainfall_records');
    return saved ? JSON.parse(saved) : DEFAULT_RAINFALL_RECORDS;
  });
  const [rainfallSubView, setRainfallSubView] = useState('list'); // 'list' | 'create'
  const [rainfallSearch, setRainfallSearch] = useState('');
  const [rainfallVillageFilter, setRainfallVillageFilter] = useState('all');
  const [rainfallForm, setRainfallForm] = useState({
    village: 'Chandampet',
    date: new Date().toISOString().split('T')[0],
    rainfall: '',
    gauge: 'Manual',
    observer: user?.name || 'CLIC Field Lead',
    notes: ''
  });
  const [editingRainfall, setEditingRainfall] = useState(null);

  const saveRainfallRecordsToStorage = (updated) => {
    setRainfallRecords(updated);
    localStorage.setItem('clic_rainfall_records', JSON.stringify(updated));
  };

  const handleCreateRainfall = (e) => {
    e.preventDefault();
    if (!rainfallForm.village.trim() || rainfallForm.rainfall === '') {
      alert('Please fill all required rainfall fields.');
      return;
    }
    const audit = getCreateAudit(user);
    const newRecord = {
      id: `rf-${Date.now()}`,
      village: rainfallForm.village.trim(),
      date: rainfallForm.date,
      rainfall: parseFloat(rainfallForm.rainfall),
      gauge: rainfallForm.gauge,
      observer: rainfallForm.observer.trim() || (user?.name || 'CLIC Facilitator'),
      notes: rainfallForm.notes.trim() || 'Recorded via Facilitator Desk',
      enteredBy: user?.name ? `${user.name} (${user.role})` : 'CLIC Facilitator',
      ...audit
    };

    const updated = [newRecord, ...rainfallRecords];
    saveRainfallRecordsToStorage(updated);
    showToast(`✓ Rainfall entry for ${newRecord.village} (${newRecord.rainfall} mm) saved successfully!`);
    setRainfallForm({
      village: 'Chandampet',
      date: new Date().toISOString().split('T')[0],
      rainfall: '',
      gauge: 'Manual',
      observer: user?.name || 'CLIC Field Lead',
      notes: ''
    });
    setRainfallSubView('list');
  };

  const handleUpdateRainfall = (e) => {
    e.preventDefault();
    if (!editingRainfall) return;
    const updated = rainfallRecords.map(r => r.id === editingRainfall.id ? { ...editingRainfall, rainfall: parseFloat(editingRainfall.rainfall) } : r);
    saveRainfallRecordsToStorage(updated);
    setEditingRainfall(null);
    showToast(`✓ Rainfall record for ${editingRainfall.village} updated successfully!`);
  };

  const handleDeleteRainfall = (id, village) => {
    if (window.confirm(`Are you sure you want to delete rainfall record for ${village}?`)) {
      const updated = rainfallRecords.filter(r => r.id !== id);
      saveRainfallRecordsToStorage(updated);
      showToast(`Deleted rainfall record for ${village}.`);
    }
  };

  const filteredRainfall = useMemo(() => {
    return rainfallRecords.filter(r => {
      const matchSearch = r.village.toLowerCase().includes(rainfallSearch.toLowerCase()) ||
        (r.observer && r.observer.toLowerCase().includes(rainfallSearch.toLowerCase())) ||
        (r.notes && r.notes.toLowerCase().includes(rainfallSearch.toLowerCase()));
      const matchVillage = rainfallVillageFilter === 'all' || r.village === rainfallVillageFilter;
      return matchSearch && matchVillage;
    });
  }, [rainfallRecords, rainfallSearch, rainfallVillageFilter]);

  // =========================================================================
  // 2. GROUNDWATER STATE & CRUD
  // =========================================================================
  const [gwRecords, setGwRecords] = useState(() => {
    const saved = localStorage.getItem('clic_groundwater_records');
    return saved ? JSON.parse(saved) : DEFAULT_GROUNDWATER_RECORDS;
  });
  const [gwSubView, setGwSubView] = useState('list'); // 'list' | 'create'
  const [gwSearch, setGwSearch] = useState('');
  const [gwVillageFilter, setGwVillageFilter] = useState('all');
  const [gwForm, setGwForm] = useState({
    village: 'Chandampet',
    wellId: 'NLG-BW-101',
    date: new Date().toISOString().split('T')[0],
    depth: '',
    unit: 'mbgl',
    method: 'Measuring tape',
    observer: user?.name || 'CLIC Field Lead',
    notes: ''
  });
  const [editingGw, setEditingGw] = useState(null);

  const saveGwRecordsToStorage = (updated) => {
    setGwRecords(updated);
    localStorage.setItem('clic_groundwater_records', JSON.stringify(updated));
  };

  const handleCreateGw = (e) => {
    e.preventDefault();
    if (!gwForm.village.trim() || gwForm.depth === '') {
      alert('Please fill all required groundwater fields.');
      return;
    }
    const depthVal = parseFloat(gwForm.depth);
    const status = depthVal > 18 ? 'Critical' : depthVal > 12 ? 'Moderate' : 'Safe';
    const audit = getCreateAudit(user);
    const newRecord = {
      id: `gw-${Date.now()}`,
      village: gwForm.village.trim(),
      wellId: gwForm.wellId.trim() || `BW-${Math.floor(100 + Math.random() * 900)}`,
      date: gwForm.date,
      depth: depthVal,
      unit: gwForm.unit,
      method: gwForm.method,
      observer: gwForm.observer.trim() || (user?.name || 'CLIC Facilitator'),
      notes: gwForm.notes.trim() || 'Recorded via Facilitator Portal',
      status: status,
      enteredBy: user?.name ? `${user.name} (${user.role})` : 'CLIC Facilitator',
      ...audit
    };

    const updated = [newRecord, ...gwRecords];
    saveGwRecordsToStorage(updated);
    showToast(`✓ Groundwater log for ${newRecord.village} (${newRecord.depth} ${newRecord.unit}) saved!`);
    setGwForm({
      village: 'Chandampet',
      wellId: 'NLG-BW-102',
      date: new Date().toISOString().split('T')[0],
      depth: '',
      unit: 'mbgl',
      method: 'Measuring tape',
      observer: user?.name || 'CLIC Field Lead',
      notes: ''
    });
    setGwSubView('list');
  };

  const handleUpdateGw = (e) => {
    e.preventDefault();
    if (!editingGw) return;
    const depthVal = parseFloat(editingGw.depth);
    const status = depthVal > 18 ? 'Critical' : depthVal > 12 ? 'Moderate' : 'Safe';
    const updated = gwRecords.map(r => r.id === editingGw.id ? { ...editingGw, depth: depthVal, status: status } : r);
    saveGwRecordsToStorage(updated);
    setEditingGw(null);
    showToast(`✓ Groundwater log for ${editingGw.village} updated successfully!`);
  };

  const handleDeleteGw = (id, village) => {
    if (window.confirm(`Are you sure you want to delete groundwater record for ${village}?`)) {
      const updated = gwRecords.filter(r => r.id !== id);
      saveGwRecordsToStorage(updated);
      showToast(`Deleted groundwater record for ${village}.`);
    }
  };

  const filteredGw = useMemo(() => {
    return gwRecords.filter(r => {
      const matchSearch = r.village.toLowerCase().includes(gwSearch.toLowerCase()) ||
        (r.wellId && r.wellId.toLowerCase().includes(gwSearch.toLowerCase())) ||
        (r.observer && r.observer.toLowerCase().includes(gwSearch.toLowerCase()));
      const matchVillage = gwVillageFilter === 'all' || r.village === gwVillageFilter;
      return matchSearch && matchVillage;
    });
  }, [gwRecords, gwSearch, gwVillageFilter]);

  // =========================================================================
  // 3. FARMER REGISTRY STATE & CRUD
  // =========================================================================
  const [farmers, setFarmers] = useState(() => {
    const saved = localStorage.getItem('clic_farmers');
    return saved ? JSON.parse(saved) : DEMO_FARMERS;
  });
  const [farmerSubView, setFarmerSubView] = useState('list'); // 'list' | 'create'
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerVillageFilter, setFarmerVillageFilter] = useState('all');
  const [farmerSubsidyFilter, setFarmerSubsidyFilter] = useState('all');
  const [editingFarmer, setEditingFarmer] = useState(null);

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
    crops: 'Paddy, Cotton',
    bankAccount: '',
    subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
    query: ''
  });

  const saveFarmersToStorage = (updated) => {
    setFarmers(updated);
    localStorage.setItem('clic_farmers', JSON.stringify(updated));
  };

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

  const handleCreateFarmer = (e) => {
    e.preventDefault();
    if (!farmerForm.name.trim() || !farmerForm.phone.trim()) {
      alert('Please provide Farmer Name and 10-digit Mobile Number.');
      return;
    }

    const cleanPhone = farmerForm.phone.trim().replace(/\D/g, '');
    const duplicate = farmers.find(f => f.phone && f.phone.replace(/\D/g, '') === cleanPhone);
    if (duplicate) {
      alert(`Farmer with mobile number +91 ${cleanPhone} already exists as ${duplicate.name}. Cannot add duplicate.`);
      return;
    }

    const finalVillage = farmerForm.isCustomVillage
      ? (farmerForm.customVillageName.trim() || 'Custom Village')
      : farmerForm.villageName;

    const audit = getCreateAudit(user);
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
      activeQuery: farmerForm.query.trim() || 'Walk-in farmer registration at CLIC Hub',
      registeredBy: user?.name || 'CLIC Facilitator',
      ...audit
    };

    const updated = [newFarmer, ...farmers];
    saveFarmersToStorage(updated);

    // If query given, save to clic_farmer_queries
    if (farmerForm.query.trim()) {
      const currentTimestamp = new Date().toLocaleString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
      });
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
        facilitatorName: user?.name || 'CLIC Facilitator',
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

    showToast(`✓ Farmer ${newFarmer.name} (${newFarmer.phone}) registered & synced to CLIC!`);
    setFarmerForm({
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
      crops: 'Paddy, Cotton',
      bankAccount: '',
      subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
      query: ''
    });
    setFarmerSubView('list');
  };

  const handleUpdateFarmer = (e) => {
    e.preventDefault();
    if (!editingFarmer) return;
    const cleanPhone = (editingFarmer.phone || '').toString().replace(/\D/g, '');
    const updated = farmers.map(f => f.id === editingFarmer.id ? {
      ...editingFarmer,
      phone: cleanPhone,
      crops: typeof editingFarmer.crops === 'string' ? editingFarmer.crops.split(',').map(c => c.trim()).filter(Boolean) : editingFarmer.crops
    } : f);
    saveFarmersToStorage(updated);
    setEditingFarmer(null);
    showToast(`✓ Farmer record for ${editingFarmer.name} updated successfully!`);
  };

  const handleDeleteFarmer = (id, name) => {
    if (window.confirm(`Are you sure you want to delete farmer ${name}?`)) {
      const updated = farmers.filter(f => f.id !== id);
      saveFarmersToStorage(updated);
      showToast(`Deleted farmer ${name} from registry.`);
    }
  };

  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const nameMatch = (f.name || '').toLowerCase().includes(farmerSearch.toLowerCase()) ||
        (f.telugu || '').toLowerCase().includes(farmerSearch.toLowerCase()) ||
        (f.phone || '').includes(farmerSearch) ||
        (f.village || '').toLowerCase().includes(farmerSearch.toLowerCase());
      const villageMatch = farmerVillageFilter === 'all' || f.village === farmerVillageFilter;
      const subsidyMatch = farmerSubsidyFilter === 'all' || (f.subsidyCategory || '').includes(farmerSubsidyFilter);
      return nameMatch && villageMatch && subsidyMatch;
    });
  }, [farmers, farmerSearch, farmerVillageFilter, farmerSubsidyFilter]);

  // =========================================================================
  // 4. KNOWLEDGE BANK STATE & CRUD
  // =========================================================================
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('clic_materials');
    return saved ? JSON.parse(saved) : initialVideos;
  });
  const [knowledgeSubView, setKnowledgeSubView] = useState('list'); // 'list' | 'create'
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [knowledgeCatFilter, setKnowledgeCatFilter] = useState('All');
  const [knowledgeLangFilter, setKnowledgeLangFilter] = useState('All');
  const [knowledgeForm, setKnowledgeForm] = useState({
    title: '',
    category: 'Crop Guide',
    type: 'video',
    language: 'Telugu',
    duration: '15 min',
    targetAudience: 'All Farmers',
    tags: 'Paddy, Organic',
    description: '',
    url: ''
  });
  const [editingMaterial, setEditingMaterial] = useState(null);

  const saveMaterialsToStorage = (updated) => {
    setMaterials(updated);
    localStorage.setItem('clic_materials', JSON.stringify(updated));
  };

  const handleCreateMaterial = (e) => {
    e.preventDefault();
    if (!knowledgeForm.title.trim()) {
      alert('Please enter a Resource Title.');
      return;
    }

    const typeIcons = { video: '📹', pdf: '📄', article: '📰', link: '🔗' };
    const audit = getCreateAudit(user);
    const newMat = {
      id: `mat-${Date.now()}`,
      title: knowledgeForm.title.trim(),
      category: knowledgeForm.category,
      type: knowledgeForm.type,
      language: knowledgeForm.language,
      duration: knowledgeForm.duration || '10 min',
      tags: knowledgeForm.tags ? knowledgeForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [knowledgeForm.category],
      views: 0,
      thumbnail: typeIcons[knowledgeForm.type] || '📚',
      description: knowledgeForm.description.trim() || 'Agricultural resource uploaded by CLIC Facilitator',
      url: knowledgeForm.url.trim() || '#',
      uploadedBy: user?.name ? `${user.name} (${user.role})` : 'CLIC Facilitator',
      ...audit
    };

    const updated = [newMat, ...materials];
    saveMaterialsToStorage(updated);
    showToast(`✓ Resource "${newMat.title}" uploaded to Knowledge Bank!`);
    setKnowledgeForm({
      title: '',
      category: 'Crop Guide',
      type: 'video',
      language: 'Telugu',
      duration: '15 min',
      targetAudience: 'All Farmers',
      tags: 'Paddy, Organic',
      description: '',
      url: ''
    });
    setKnowledgeSubView('list');
  };

  const handleUpdateMaterial = (e) => {
    e.preventDefault();
    if (!editingMaterial) return;
    const updated = materials.map(m => m.id === editingMaterial.id ? {
      ...editingMaterial,
      tags: typeof editingMaterial.tags === 'string' ? editingMaterial.tags.split(',').map(t => t.trim()).filter(Boolean) : editingMaterial.tags
    } : m);
    saveMaterialsToStorage(updated);
    setEditingMaterial(null);
    showToast(`✓ Resource "${editingMaterial.title}" updated successfully!`);
  };

  const handleDeleteMaterial = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from Knowledge Bank?`)) {
      const updated = materials.filter(m => m.id !== id);
      saveMaterialsToStorage(updated);
      showToast(`Deleted "${title}" from Knowledge Bank.`);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSearch = (m.title || '').toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
        (m.description || '').toLowerCase().includes(knowledgeSearch.toLowerCase()) ||
        (m.tags || []).some(t => t.toLowerCase().includes(knowledgeSearch.toLowerCase()));
      const matchCat = knowledgeCatFilter === 'All' || m.category === knowledgeCatFilter;
      const matchLang = knowledgeLangFilter === 'All' || (m.language && m.language === knowledgeLangFilter);
      return matchSearch && matchCat && matchLang;
    });
  }, [materials, knowledgeSearch, knowledgeCatFilter, knowledgeLangFilter]);

  // =========================================================================
  // 5. VILLAGE DASHBOARD CSV EXPORT
  // =========================================================================
  const handleExportCSV = () => {
    const headers = ['Type', 'Village', 'Date', 'Value', 'Unit', 'Observer/Source', 'Notes/Status'];
    const rows = [
      ...rainfallRecords.map(r => ['Rainfall', r.village, r.date, r.rainfall, 'mm', r.observer, r.notes]),
      ...gwRecords.map(g => ['Groundwater', g.village, g.date, g.depth, g.unit, g.observer, `${g.status} - ${g.notes}`])
    ];

    let csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clic_village_observations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Village observation records exported to CSV successfully!');
  };

  // Village list for dropdown filters
  const uniqueVillages = useMemo(() => {
    const set = new Set();
    rainfallRecords.forEach(r => set.add(r.village));
    gwRecords.forEach(g => set.add(g.village));
    farmers.forEach(f => f.village && set.add(f.village));
    return Array.from(set).sort();
  }, [rainfallRecords, gwRecords, farmers]);

  return (
    <div className="facilitator-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>👨‍💼 Facilitator Portal & Master CRUD Console</h1>
          <p className="text-secondary">
            Manage, log, review, edit, and export village-level observations, farmer records, and knowledge bank resources in real-time.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="badge badge-sky">Logged in: {user?.name || 'CLIC Field Lead'} ({user?.role})</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="facilitator-nav">
        {[
          { id: 'rainfall', icon: <CloudRain size={18} />, label: `Rainfall Records (${rainfallRecords.length})` },
          { id: 'groundwater', icon: <Droplets size={18} />, label: `Groundwater (${gwRecords.length})` },
          { id: 'farmer', icon: <Users size={18} />, label: `Farmer Registry (${farmers.length})` },
          { id: 'knowledge', icon: <Upload size={18} />, label: `Knowledge Bank (${materials.length})` },
          { id: 'dashboard', icon: <CheckCircle size={18} />, label: 'Village Dashboard & Export' },
        ].map(s => (
          <button
            key={s.id}
            className={`facilitator-nav-btn ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            {s.icon} {s.label}
          </button>
        ))}
        <button
          className="facilitator-nav-btn"
          style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(5, 150, 105, 0.12))', color: 'var(--color-forest)', fontWeight: 'bold' }}
          onClick={() => navigate('/machinery')}
        >
          <Tractor size={18} /> 🚜 Farm Machinery Desk
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="submit-success">
          <CheckCircle size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================================================================= */}
      {/* 1. RAINFALL TAB (Full CRUD)                                       */}
      {/* ================================================================= */}
      {activeSection === 'rainfall' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* KPI Summary */}
          <div className="facilitator-kpi-grid">
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <CloudRain size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">{rainfallRecords.length}</div>
                <div className="facilitator-kpi-label">Total Readings Logged</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                💧
              </div>
              <div>
                <div className="facilitator-kpi-val">
                  {(rainfallRecords.reduce((acc, r) => acc + (r.rainfall || 0), 0) / (rainfallRecords.length || 1)).toFixed(1)} mm
                </div>
                <div className="facilitator-kpi-label">Average Rainfall</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                ⚡
              </div>
              <div>
                <div className="facilitator-kpi-val">
                  {rainfallRecords.filter(r => r.rainfall >= 15).length}
                </div>
                <div className="facilitator-kpi-label">Heavy Rain Days (&ge;15mm)</div>
              </div>
            </div>
          </div>

          {/* Sub-view switcher */}
          <div className="facilitator-subtabs">
            <div className="facilitator-subtab-group">
              <button
                className={`facilitator-subtab-btn ${rainfallSubView === 'list' ? 'active' : ''}`}
                onClick={() => setRainfallSubView('list')}
              >
                📋 View Entered Records ({filteredRainfall.length})
              </button>
              <button
                className={`facilitator-subtab-btn ${rainfallSubView === 'create' ? 'active' : ''}`}
                onClick={() => setRainfallSubView('create')}
              >
                ➕ Log New Rainfall Entry
              </button>
            </div>
          </div>

          {/* List View */}
          {rainfallSubView === 'list' && (
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              {/* Filter Toolbar */}
              <div className="facilitator-filter-bar">
                <div className="facilitator-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by village, observer, notes..."
                    value={rainfallSearch}
                    onChange={e => setRainfallSearch(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={14} className="text-muted" />
                  <select
                    className="input-field select-field"
                    style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                    value={rainfallVillageFilter}
                    onChange={e => setRainfallVillageFilter(e.target.value)}
                  >
                    <option value="all">All Villages ({uniqueVillages.length})</option>
                    {uniqueVillages.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setRainfallSearch(''); setRainfallVillageFilter('all'); }}
                >
                  <RefreshCw size={12} /> Reset Filters
                </button>
              </div>

              {/* Table */}
              <div className="village-table-wrapper" style={{ border: 'none' }}>
                <table className="market-table">
                  <thead>
                    <tr>
                      <th>Village</th>
                      <th>Date</th>
                      <th>Rainfall (mm)</th>
                      <th>Gauge Type</th>
                      <th>Observer</th>
                      <th>Notes / Damage</th>
                      <th>Entered By</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRainfall.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          No rainfall records found matching your filters. Click <strong>➕ Log New Rainfall Entry</strong> to add one.
                        </td>
                      </tr>
                    ) : (
                      filteredRainfall.map(row => (
                        <tr key={row.id}>
                          <td><strong>{row.village}</strong></td>
                          <td className="text-muted">{row.date}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background: row.rainfall >= 20 ? 'rgba(239, 68, 68, 0.15)' : row.rainfall >= 10 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                                color: row.rainfall >= 20 ? '#ef4444' : row.rainfall >= 10 ? '#10b981' : '#3b82f6',
                                fontWeight: 'bold'
                              }}
                            >
                              {row.rainfall} mm
                            </span>
                          </td>
                          <td>{row.gauge || 'Manual'}</td>
                          <td className="text-muted">{row.observer}</td>
                          <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {row.notes || '—'}
                          </td>
                          <td className="text-muted" style={{ fontSize: '11px' }}>{row.enteredBy || 'Facilitator'}</td>
                          <td>
                            <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                              <button
                                className="action-btn btn-edit"
                                onClick={() => setEditingRainfall({ ...row })}
                                title="Edit record"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                className="action-btn btn-delete"
                                onClick={() => handleDeleteRainfall(row.id, row.village)}
                                title="Delete record"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create View */}
          {rainfallSubView === 'create' && (
            <div className="facilitator-form-card card">
              <div className="section-title"><CloudRain size={20} /> Daily Rainfall Data Entry</div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Enter rainfall readings from manual or automatic rain gauge. Data updates live across CLIC Weather and Village Dashboards.
              </p>
              <form onSubmit={handleCreateRainfall}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Village Name (గ్రామం పేరు) *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Chandampet"
                      value={rainfallForm.village}
                      onChange={e => setRainfallForm({ ...rainfallForm, village: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Observation Date (తేదీ) *</label>
                    <input
                      type="date"
                      className="input-field"
                      value={rainfallForm.date}
                      onChange={e => setRainfallForm({ ...rainfallForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rainfall Amount (mm) (వర్షపాతం) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="input-field"
                      placeholder="e.g. 14.5"
                      value={rainfallForm.rainfall}
                      onChange={e => setRainfallForm({ ...rainfallForm, rainfall: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gauge Type (కొలమానం రకం)</label>
                    <select
                      className="input-field select-field"
                      value={rainfallForm.gauge}
                      onChange={e => setRainfallForm({ ...rainfallForm, gauge: e.target.value })}
                    >
                      {(refTables.gaugeTypes || []).map(g => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Observer / Lead Name (పరిశీలకుడు) *</label>
                    <input
                      className="input-field"
                      placeholder="Name / పేరు"
                      value={rainfallForm.observer}
                      onChange={e => setRainfallForm({ ...rainfallForm, observer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Crop / Soil Impact Notes (గమనికలు)</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Optimal for sowing, no waterlogging"
                      value={rainfallForm.notes}
                      onChange={e => setRainfallForm({ ...rainfallForm, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Plus size={16} /> Save Rainfall Entry & Sync
                  </button>
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => setRainfallSubView('list')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Modal for Rainfall */}
          {editingRainfall && (
            <div className="facilitator-modal-overlay" onClick={() => setEditingRainfall(null)}>
              <div className="facilitator-modal-box" onClick={e => e.stopPropagation()}>
                <div className="facilitator-modal-header">
                  <h3><Edit2 size={18} /> Edit Rainfall Entry – {editingRainfall.village}</h3>
                  <button className="modal-close-btn" onClick={() => setEditingRainfall(null)}><X size={18} /></button>
                </div>
                <form onSubmit={handleUpdateRainfall}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Village Name *</label>
                      <input
                        className="input-field"
                        value={editingRainfall.village}
                        onChange={e => setEditingRainfall({ ...editingRainfall, village: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={editingRainfall.date}
                        onChange={e => setEditingRainfall({ ...editingRainfall, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Rainfall (mm) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="input-field"
                        value={editingRainfall.rainfall}
                        onChange={e => setEditingRainfall({ ...editingRainfall, rainfall: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Gauge Type</label>
                      <select
                        className="input-field select-field"
                        value={editingRainfall.gauge}
                        onChange={e => setEditingRainfall({ ...editingRainfall, gauge: e.target.value })}
                      >
                        <option value="Manual">Manual</option>
                        <option value="Automatic">Automatic</option>
                        <option value="IMD Station">IMD Station</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Observer</label>
                      <input
                        className="input-field"
                        value={editingRainfall.observer}
                        onChange={e => setEditingRainfall({ ...editingRainfall, observer: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Notes</label>
                      <input
                        className="input-field"
                        value={editingRainfall.notes}
                        onChange={e => setEditingRainfall({ ...editingRainfall, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingRainfall(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. GROUNDWATER TAB (Full CRUD)                                    */}
      {/* ================================================================= */}
      {activeSection === 'groundwater' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* KPI Summary */}
          <div className="facilitator-kpi-grid">
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                <Droplets size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">{gwRecords.length}</div>
                <div className="facilitator-kpi-label">Borewells Logged</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                📏
              </div>
              <div>
                <div className="facilitator-kpi-val">
                  {(gwRecords.reduce((acc, r) => acc + (r.depth || 0), 0) / (gwRecords.length || 1)).toFixed(1)} m
                </div>
                <div className="facilitator-kpi-label">Average Water Table Depth</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">
                  {gwRecords.filter(r => r.depth > 18).length}
                </div>
                <div className="facilitator-kpi-label">Critical Depletion Wells (&gt;18m)</div>
              </div>
            </div>
          </div>

          {/* Subtabs */}
          <div className="facilitator-subtabs">
            <div className="facilitator-subtab-group">
              <button
                className={`facilitator-subtab-btn ${gwSubView === 'list' ? 'active' : ''}`}
                onClick={() => setGwSubView('list')}
              >
                📋 View Groundwater Logs ({filteredGw.length})
              </button>
              <button
                className={`facilitator-subtab-btn ${gwSubView === 'create' ? 'active' : ''}`}
                onClick={() => setGwSubView('create')}
              >
                ➕ Log Water Table Depth
              </button>
            </div>
          </div>

          {/* List View */}
          {gwSubView === 'list' && (
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <div className="facilitator-filter-bar">
                <div className="facilitator-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by well ID, village, observer..."
                    value={gwSearch}
                    onChange={e => setGwSearch(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={14} className="text-muted" />
                  <select
                    className="input-field select-field"
                    style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                    value={gwVillageFilter}
                    onChange={e => setGwVillageFilter(e.target.value)}
                  >
                    <option value="all">All Villages ({uniqueVillages.length})</option>
                    {uniqueVillages.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setGwSearch(''); setGwVillageFilter('all'); }}
                >
                  <RefreshCw size={12} /> Reset
                </button>
              </div>

              <div className="village-table-wrapper" style={{ border: 'none' }}>
                <table className="market-table">
                  <thead>
                    <tr>
                      <th>Village</th>
                      <th>Well / Borewell ID</th>
                      <th>Date</th>
                      <th>Water Table Depth</th>
                      <th>Aquifer Status</th>
                      <th>Method</th>
                      <th>Observer</th>
                      <th>Notes</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGw.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          No groundwater logs found. Click <strong>➕ Log Water Table Depth</strong> to record an entry.
                        </td>
                      </tr>
                    ) : (
                      filteredGw.map(row => (
                        <tr key={row.id}>
                          <td><strong>{row.village}</strong></td>
                          <td><code>{row.wellId || 'NLG-BW'}</code></td>
                          <td className="text-muted">{row.date}</td>
                          <td>
                            <strong>{row.depth} {row.unit || 'mbgl'}</strong>
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background: row.depth > 18 ? 'rgba(239, 68, 68, 0.15)' : row.depth > 12 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: row.depth > 18 ? '#ef4444' : row.depth > 12 ? '#f59e0b' : '#10b981',
                                fontWeight: 'bold'
                              }}
                            >
                              {row.depth > 18 ? '⚠️ Critical' : row.depth > 12 ? '⚡ Moderate' : '✓ Safe'}
                            </span>
                          </td>
                          <td className="text-muted">{row.method || 'Tape'}</td>
                          <td className="text-muted">{row.observer}</td>
                          <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {row.notes || '—'}
                          </td>
                          <td>
                            <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                              <button
                                className="action-btn btn-edit"
                                onClick={() => setEditingGw({ ...row })}
                                title="Edit log"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                className="action-btn btn-delete"
                                onClick={() => handleDeleteGw(row.id, row.village)}
                                title="Delete log"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create View */}
          {gwSubView === 'create' && (
            <div className="facilitator-form-card card">
              <div className="section-title"><Droplets size={20} /> Groundwater Level Entry</div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Log borewell and open well water depth readings. Directly integrates with CLIC Groundwater monitoring tables.
              </p>
              <form onSubmit={handleCreateGw}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Village Name (గ్రామం) *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Chandampet"
                      value={gwForm.village}
                      onChange={e => setGwForm({ ...gwForm, village: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Observation Date (తేదీ) *</label>
                    <input
                      type="date"
                      className="input-field"
                      value={gwForm.date}
                      onChange={e => setGwForm({ ...gwForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Water Table Depth *</label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="input-field"
                        placeholder="Depth (e.g. 14.5)"
                        value={gwForm.depth}
                        onChange={e => setGwForm({ ...gwForm, depth: e.target.value })}
                        required
                      />
                      <select
                        className="input-field select-field"
                        style={{ width: '120px' }}
                        value={gwForm.unit}
                        onChange={e => setGwForm({ ...gwForm, unit: e.target.value })}
                      >
                        <option value="mbgl">m bgl</option>
                        <option value="feet">feet</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Well / Borewell ID (బావి / బోర్ ఐడీ)</label>
                    <input
                      className="input-field"
                      placeholder="e.g. NLG-BW-102"
                      value={gwForm.wellId}
                      onChange={e => setGwForm({ ...gwForm, wellId: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Measurement Method</label>
                    <select
                      className="input-field select-field"
                      value={gwForm.method}
                      onChange={e => setGwForm({ ...gwForm, method: e.target.value })}
                    >
                      {(refTables.gwMethods || []).map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Observer / Facilitator Name *</label>
                    <input
                      className="input-field"
                      value={gwForm.observer}
                      onChange={e => setGwForm({ ...gwForm, observer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Aquifer Remarks & Observations</label>
                    <textarea
                      className="input-field"
                      rows={2}
                      placeholder="e.g. Pumping yield steady, recharge observed after check dam overflow"
                      value={gwForm.notes}
                      onChange={e => setGwForm({ ...gwForm, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Plus size={16} /> Save Groundwater Reading
                  </button>
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => setGwSubView('list')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Modal for Groundwater */}
          {editingGw && (
            <div className="facilitator-modal-overlay" onClick={() => setEditingGw(null)}>
              <div className="facilitator-modal-box" onClick={e => e.stopPropagation()}>
                <div className="facilitator-modal-header">
                  <h3><Edit2 size={18} /> Edit Groundwater Log – {editingGw.village}</h3>
                  <button className="modal-close-btn" onClick={() => setEditingGw(null)}><X size={18} /></button>
                </div>
                <form onSubmit={handleUpdateGw}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Village *</label>
                      <input
                        className="input-field"
                        value={editingGw.village}
                        onChange={e => setEditingGw({ ...editingGw, village: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Well ID</label>
                      <input
                        className="input-field"
                        value={editingGw.wellId}
                        onChange={e => setEditingGw({ ...editingGw, wellId: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        className="input-field"
                        value={editingGw.date}
                        onChange={e => setEditingGw({ ...editingGw, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Depth ({editingGw.unit || 'mbgl'}) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="input-field"
                        value={editingGw.depth}
                        onChange={e => setEditingGw({ ...editingGw, depth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Measurement Method</label>
                      <select
                        className="input-field select-field"
                        value={editingGw.method}
                        onChange={e => setEditingGw({ ...editingGw, method: e.target.value })}
                      >
                        <option value="Measuring tape">Measuring tape</option>
                        <option value="Electric sounder">Electric sounder</option>
                        <option value="Pressure transducer">Pressure transducer</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Observer</label>
                      <input
                        className="input-field"
                        value={editingGw.observer}
                        onChange={e => setEditingGw({ ...editingGw, observer: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label>Notes</label>
                      <input
                        className="input-field"
                        value={editingGw.notes}
                        onChange={e => setEditingGw({ ...editingGw, notes: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingGw(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. FARMER REGISTRATION TAB (Full CRUD)                            */}
      {/* ================================================================= */}
      {activeSection === 'farmer' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* KPI Summary */}
          <div className="facilitator-kpi-grid">
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                <Users size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">{farmers.length}</div>
                <div className="facilitator-kpi-label">Registered Farmers</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                🌾
              </div>
              <div>
                <div className="facilitator-kpi-val">
                  {farmers.filter(f => (f.subsidyCategory || '').includes('Small / Marginal') || (f.subsidyCategory || '').includes('SF/MF')).length}
                </div>
                <div className="facilitator-kpi-label">Small / Marginal Farmers (SF/MF)</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                🗺️
              </div>
              <div>
                <div className="facilitator-kpi-val">
                  {farmers.reduce((acc, f) => {
                    const acres = parseFloat(f.landHolding) || 0;
                    return acc + acres;
                  }, 0).toFixed(0)} ac
                </div>
                <div className="facilitator-kpi-label">Total Land Holding Serviced</div>
              </div>
            </div>
          </div>

          {/* Subtabs */}
          <div className="facilitator-subtabs">
            <div className="facilitator-subtab-group">
              <button
                className={`facilitator-subtab-btn ${farmerSubView === 'list' ? 'active' : ''}`}
                onClick={() => setFarmerSubView('list')}
              >
                👥 View Registered Farmers ({filteredFarmers.length})
              </button>
              <button
                className={`facilitator-subtab-btn ${farmerSubView === 'create' ? 'active' : ''}`}
                onClick={() => setFarmerSubView('create')}
              >
                ➕ Register Walk-in Farmer
              </button>
            </div>
          </div>

          {/* List View */}
          {farmerSubView === 'list' && (
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <div className="facilitator-filter-bar">
                <div className="facilitator-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by name, Telugu name, mobile, village..."
                    value={farmerSearch}
                    onChange={e => setFarmerSearch(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={14} className="text-muted" />
                  <select
                    className="input-field select-field"
                    style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                    value={farmerVillageFilter}
                    onChange={e => setFarmerVillageFilter(e.target.value)}
                  >
                    <option value="all">All Villages</option>
                    {uniqueVillages.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    className="input-field select-field"
                    style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                    value={farmerSubsidyFilter}
                    onChange={e => setFarmerSubsidyFilter(e.target.value)}
                  >
                    <option value="all">All Subsidy Categories</option>
                    <option value="Small / Marginal">Small / Marginal (SF/MF)</option>
                    <option value="Women">Women / SHG</option>
                    <option value="SC/ST">SC/ST Category</option>
                    <option value="General">General Farmer</option>
                  </select>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setFarmerSearch(''); setFarmerVillageFilter('all'); setFarmerSubsidyFilter('all'); }}
                >
                  <RefreshCw size={12} /> Reset
                </button>
              </div>

              <div className="village-table-wrapper" style={{ border: 'none' }}>
                <table className="market-table">
                  <thead>
                    <tr>
                      <th>Farmer Name & Telugu</th>
                      <th>Mobile Number</th>
                      <th>Location</th>
                      <th>Landholding</th>
                      <th>Crops & Soil</th>
                      <th>Subsidy Category</th>
                      <th>Active Query</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFarmers.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          No farmers found matching filters. Click <strong>➕ Register Walk-in Farmer</strong> to add one.
                        </td>
                      </tr>
                    ) : (
                      filteredFarmers.map(farmer => (
                        <tr key={farmer.id || farmer.phone}>
                          <td>
                            <div>
                              <strong>{farmer.name}</strong>
                              {farmer.telugu && <div style={{ fontSize: '11px', color: 'var(--color-forest)', fontFamily: 'var(--font-telugu)' }}>{farmer.telugu}</div>}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                              +91 {farmer.phone}
                            </span>
                          </td>
                          <td>
                            <div>{farmer.village}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{farmer.district || 'Nalgonda'}, {farmer.state || 'Telangana'}</div>
                          </td>
                          <td>
                            <span className="badge badge-sky">{farmer.landHolding || '3.0 acres'}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {(Array.isArray(farmer.crops) ? farmer.crops : (farmer.crops ? farmer.crops.split(',') : ['Paddy'])).map((c, i) => (
                                <span key={i} className="badge badge-green" style={{ fontSize: '10px' }}>{c.trim()}</span>
                              ))}
                            </div>
                            <div className="text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>{farmer.soilType || 'Red Loam'}</div>
                          </td>
                          <td>
                            <span className="badge badge-amber" style={{ fontSize: '11px' }}>
                              {farmer.subsidyCategory || 'SF/MF (40%)'}
                            </span>
                          </td>
                          <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {farmer.activeQuery || '—'}
                          </td>
                          <td>
                            <div className="action-btn-group" style={{ justifyContent: 'center' }}>
                              <button
                                className="action-btn"
                                style={{ color: 'var(--color-forest)' }}
                                onClick={() => navigate('/machinery')}
                                title="Open in Machinery Walk-in Desk"
                              >
                                <Tractor size={12} /> Assist
                              </button>
                              <button
                                className="action-btn btn-edit"
                                onClick={() => setEditingFarmer({ ...farmer, crops: Array.isArray(farmer.crops) ? farmer.crops.join(', ') : farmer.crops })}
                                title="Edit farmer profile"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                              <button
                                className="action-btn btn-delete"
                                onClick={() => handleDeleteFarmer(farmer.id, farmer.name)}
                                title="Delete farmer"
                              >
                                <Trash2 size={12} /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Create View */}
          {farmerSubView === 'create' && (
            <div className="facilitator-form-card card">
              <div className="section-title"><UserPlus size={20} /> Farmer Registration (రైతు నమోదు)</div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Register new walk-in farmers into the CLIC master registry with State → District → Village cascading hierarchy and query logging.
              </p>
              <form onSubmit={handleCreateFarmer}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Farmer Name (English) *</label>
                    <input
                      className="input-field"
                      placeholder="Full name"
                      value={farmerForm.name}
                      onChange={e => setFarmerForm({ ...farmerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Name in Telugu (తెలుగులో పేరు)</label>
                    <input
                      className="input-field"
                      placeholder="ఉదా. రాము రెడ్డి"
                      value={farmerForm.telugu}
                      onChange={e => setFarmerForm({ ...farmerForm, telugu: e.target.value })}
                      style={{ fontFamily: 'var(--font-telugu)' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number (10 digits) *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      className="input-field"
                      placeholder="10-digit mobile number"
                      value={farmerForm.phone}
                      onChange={e => setFarmerForm({ ...farmerForm, phone: e.target.value.replace(/\D/g, '') })}
                      required
                    />
                  </div>

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
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      className="input-field"
                      placeholder="e.g. 3.5"
                      value={farmerForm.landholding}
                      onChange={e => setFarmerForm({ ...farmerForm, landholding: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Soil Type</label>
                    <select
                      className="input-field select-field"
                      value={farmerForm.soilType}
                      onChange={e => setFarmerForm({ ...farmerForm, soilType: e.target.value })}
                    >
                      {(refTables.soilTypes || []).map(st => (
                        <option key={st.id} value={st.name}>{st.name} ({st.telugu || ''})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Main Crops (పంటలు)</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Paddy, Cotton, Red Gram / వరి, పత్తి, కందులు"
                      value={farmerForm.crops}
                      onChange={e => setFarmerForm({ ...farmerForm, crops: e.target.value })}
                      style={{ fontFamily: 'var(--font-telugu)' }}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Farmer Subsidy Category</label>
                    <select
                      className="input-field select-field"
                      value={farmerForm.subsidyCategory}
                      onChange={e => setFarmerForm({ ...farmerForm, subsidyCategory: e.target.value })}
                    >
                      {(refTables.subsidyCategories || []).map(sub => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name} {sub.subsidyPercent ? `(${sub.subsidyPercent}% Subsidy)` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Bank Account (for DBT & Subsidies)</label>
                    <input
                      className="input-field"
                      placeholder="Account number / Bank Name (optional)"
                      value={farmerForm.bankAccount}
                      onChange={e => setFarmerForm({ ...farmerForm, bankAccount: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Initial Walk-in Requirement / Query (Optional)</label>
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
                  <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '12px', marginBottom: 'var(--space-3)' }}>
                    ⛔ Cannot register: Mobile number is already registered to {existingFarmerWithPhone.name} ({existingFarmerWithPhone.village}).
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={Boolean(existingFarmerWithPhone) || farmerForm.phone.length !== 10 || !farmerForm.name.trim()}
                  >
                    <UserPlus size={16} /> Register Farmer & Sync to CLIC
                  </button>
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => setFarmerSubView('list')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Modal for Farmer */}
          {editingFarmer && (
            <div className="facilitator-modal-overlay" onClick={() => setEditingFarmer(null)}>
              <div className="facilitator-modal-box" onClick={e => e.stopPropagation()}>
                <div className="facilitator-modal-header">
                  <h3><Edit2 size={18} /> Edit Farmer Profile – {editingFarmer.name}</h3>
                  <button className="modal-close-btn" onClick={() => setEditingFarmer(null)}><X size={18} /></button>
                </div>
                <form onSubmit={handleUpdateFarmer}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Farmer Name *</label>
                      <input
                        className="input-field"
                        value={editingFarmer.name}
                        onChange={e => setEditingFarmer({ ...editingFarmer, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Name in Telugu</label>
                      <input
                        className="input-field"
                        value={editingFarmer.telugu || ''}
                        onChange={e => setEditingFarmer({ ...editingFarmer, telugu: e.target.value })}
                        style={{ fontFamily: 'var(--font-telugu)' }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        maxLength={10}
                        className="input-field"
                        value={editingFarmer.phone}
                        onChange={e => setEditingFarmer({ ...editingFarmer, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Village *</label>
                      <input
                        className="input-field"
                        value={editingFarmer.village}
                        onChange={e => setEditingFarmer({ ...editingFarmer, village: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Land Holding</label>
                      <input
                        className="input-field"
                        value={editingFarmer.landHolding || ''}
                        onChange={e => setEditingFarmer({ ...editingFarmer, landHolding: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Soil Type</label>
                      <select
                        className="input-field select-field"
                        value={editingFarmer.soilType || 'Red Sandy Loam'}
                        onChange={e => setEditingFarmer({ ...editingFarmer, soilType: e.target.value })}
                      >
                        <option value="Red Sandy Loam">Red Sandy Loam</option>
                        <option value="Black Cotton Soil">Black Cotton Soil</option>
                        <option value="Red Loam">Red Loam</option>
                        <option value="Clay Loam">Clay Loam</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label>Crops (comma-separated)</label>
                      <input
                        className="input-field"
                        value={editingFarmer.crops || ''}
                        onChange={e => setEditingFarmer({ ...editingFarmer, crops: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label>Subsidy Category</label>
                      <select
                        className="input-field select-field"
                        value={editingFarmer.subsidyCategory || 'Small / Marginal Farmer (SF/MF)'}
                        onChange={e => setEditingFarmer({ ...editingFarmer, subsidyCategory: e.target.value })}
                      >
                        <option value="Small / Marginal Farmer (SF/MF)">Small / Marginal Farmer (SF/MF) - 40% Subsidy</option>
                        <option value="Women Farmer / SHG (Priority 50% Subsidy)">Women Farmer / SHG (Priority 50% Subsidy)</option>
                        <option value="SC/ST Category (Special 50% Subsidy)">SC/ST Category (Special 50% Subsidy)</option>
                        <option value="General Farmer">General Farmer - 30% Subsidy</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingFarmer(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. KNOWLEDGE BANK TAB (Full CRUD)                                 */}
      {/* ================================================================= */}
      {activeSection === 'knowledge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* KPI Summary */}
          <div className="facilitator-kpi-grid">
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                <BookOpen size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">{materials.length}</div>
                <div className="facilitator-kpi-label">Knowledge Items</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                🌐
              </div>
              <div>
                <div className="facilitator-kpi-val">3</div>
                <div className="facilitator-kpi-label">Languages (EN, TE, HI)</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                <Eye size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">
                  {materials.reduce((acc, m) => acc + (m.views || 0), 0).toLocaleString()}
                </div>
                <div className="facilitator-kpi-label">Total Farmer Views</div>
              </div>
            </div>
          </div>

          {/* Subtabs */}
          <div className="facilitator-subtabs">
            <div className="facilitator-subtab-group">
              <button
                className={`facilitator-subtab-btn ${knowledgeSubView === 'list' ? 'active' : ''}`}
                onClick={() => setKnowledgeSubView('list')}
              >
                📚 Resource Library ({filteredMaterials.length})
              </button>
              <button
                className={`facilitator-subtab-btn ${knowledgeSubView === 'create' ? 'active' : ''}`}
                onClick={() => setKnowledgeSubView('create')}
              >
                ➕ Upload New Resource
              </button>
            </div>
          </div>

          {/* List View */}
          {knowledgeSubView === 'list' && (
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <div className="facilitator-filter-bar">
                <div className="facilitator-search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by title, tag, or description..."
                    value={knowledgeSearch}
                    onChange={e => setKnowledgeSearch(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={14} className="text-muted" />
                  <select
                    className="input-field select-field"
                    style={{ padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                    value={knowledgeCatFilter}
                    onChange={e => setKnowledgeCatFilter(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Crop Guide">Crop Guide</option>
                    <option value="Paddy">Paddy</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Millets">Millets</option>
                    <option value="Water Mgmt">Water Mgmt</option>
                    <option value="Organic">Organic</option>
                    <option value="Soil Health">Soil Health</option>
                    <option value="Schemes">Schemes</option>
                    <option value="Fisheries">Fisheries</option>
                  </select>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setKnowledgeSearch(''); setKnowledgeCatFilter('All'); setKnowledgeLangFilter('All'); }}
                >
                  <RefreshCw size={12} /> Reset
                </button>
              </div>

              {/* Grid of Knowledge Cards */}
              <div className="knowledge-grid">
                {filteredMaterials.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                    No resources found. Click <strong>➕ Upload New Resource</strong> to add material.
                  </div>
                ) : (
                  filteredMaterials.map(mat => (
                    <div key={mat.id} className="knowledge-card">
                      <div className="knowledge-card-header">
                        <div className="knowledge-card-icon">
                          {mat.thumbnail || '📄'}
                        </div>
                        <span className="badge badge-sky" style={{ textTransform: 'capitalize' }}>
                          {mat.type || 'video'} · {mat.duration || '10 min'}
                        </span>
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                          {mat.title}
                        </h4>
                        <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                          {mat.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(mat.tags || []).map((t, idx) => (
                          <span key={idx} className="badge badge-green" style={{ fontSize: '10px' }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
                        <span className="text-muted" style={{ fontSize: '11px' }}>
                          👁️ {mat.views || 0} views
                        </span>
                        <div className="action-btn-group">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => setEditingMaterial({ ...mat, tags: Array.isArray(mat.tags) ? mat.tags.join(', ') : mat.tags })}
                            title="Edit resource"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                            title="Delete resource"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Create View */}
          {knowledgeSubView === 'create' && (
            <div className="facilitator-form-card card">
              <div className="section-title"><Upload size={20} /> Knowledge Bank – Upload New Resource</div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
                Upload training materials, pop guides, crop videos, or scheme manuals for farmers and field teams.
              </p>
              <form onSubmit={handleCreateMaterial}>
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Resource Title (English / Telugu) *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. SRI Method of Paddy Cultivation / శ్రీ వరి సాగు విధానం"
                      value={knowledgeForm.title}
                      onChange={e => setKnowledgeForm({ ...knowledgeForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      className="input-field select-field"
                      value={knowledgeForm.category}
                      onChange={e => setKnowledgeForm({ ...knowledgeForm, category: e.target.value })}
                    >
                      <option value="Crop Guide">Crop Guide</option>
                      <option value="Paddy">Paddy</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Millets">Millets</option>
                      <option value="Pest Management">Pest Management</option>
                      <option value="Water Mgmt">Water Management</option>
                      <option value="Organic">Organic Farming</option>
                      <option value="Soil Health">Soil Health</option>
                      <option value="Schemes">Govt Schemes</option>
                      <option value="Fisheries">Fisheries & Livestock</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Material Type *</label>
                    <select
                      className="input-field select-field"
                      value={knowledgeForm.type}
                      onChange={e => setKnowledgeForm({ ...knowledgeForm, type: e.target.value })}
                    >
                      <option value="video">Video Tutorial</option>
                      <option value="pdf">PDF Document / Manual</option>
                      <option value="article">Article / Guide</option>
                      <option value="link">External Resource Link</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      className="input-field select-field"
                      value={knowledgeForm.language}
                      onChange={e => setKnowledgeForm({ ...knowledgeForm, language: e.target.value })}
                    >
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Duration / Length</label>
                    <input
                      className="input-field"
                      placeholder="e.g. 15 min or 12 pages"
                      value={knowledgeForm.duration}
                      onChange={e => setKnowledgeForm({ ...knowledgeForm, duration: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Tags (comma-separated)</label>
                    <input
                      className="input-field"
                      placeholder="e.g. SRI, Paddy, Water Conservation"
                      value={knowledgeForm.tags}
                      onChange={e => setKnowledgeForm({ ...knowledgeForm, tags: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Resource Description & Key Takeaways</label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="Detailed overview of technical instructions provided in this resource..."
                      value={knowledgeForm.description}
                      onChange={e => setKnowledgeForm({ ...knowledgeForm, description: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Upload size={16} /> Publish to Knowledge Bank
                  </button>
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => setKnowledgeSubView('list')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Modal for Knowledge */}
          {editingMaterial && (
            <div className="facilitator-modal-overlay" onClick={() => setEditingMaterial(null)}>
              <div className="facilitator-modal-box" onClick={e => e.stopPropagation()}>
                <div className="facilitator-modal-header">
                  <h3><Edit2 size={18} /> Edit Knowledge Resource</h3>
                  <button className="modal-close-btn" onClick={() => setEditingMaterial(null)}><X size={18} /></button>
                </div>
                <form onSubmit={handleUpdateMaterial}>
                  <div className="form-grid">
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label>Title *</label>
                      <input
                        className="input-field"
                        value={editingMaterial.title}
                        onChange={e => setEditingMaterial({ ...editingMaterial, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input
                        className="input-field"
                        value={editingMaterial.category}
                        onChange={e => setEditingMaterial({ ...editingMaterial, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration / Pages</label>
                      <input
                        className="input-field"
                        value={editingMaterial.duration || ''}
                        onChange={e => setEditingMaterial({ ...editingMaterial, duration: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label>Tags (comma-separated)</label>
                      <input
                        className="input-field"
                        value={editingMaterial.tags || ''}
                        onChange={e => setEditingMaterial({ ...editingMaterial, tags: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1/-1' }}>
                      <label>Description</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        value={editingMaterial.description || ''}
                        onChange={e => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingMaterial(null)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* 5. VILLAGE DASHBOARD & EXPORT TAB                                 */}
      {/* ================================================================= */}
      {activeSection === 'dashboard' && (
        <div className="village-dashboard">
          {/* Summary KPIs */}
          <div className="facilitator-kpi-grid">
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                <CloudRain size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">{rainfallRecords.length}</div>
                <div className="facilitator-kpi-label">Rainfall Entries</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
                <Droplets size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">{gwRecords.length}</div>
                <div className="facilitator-kpi-label">Groundwater Logs</div>
              </div>
            </div>
            <div className="facilitator-kpi-card">
              <div className="facilitator-kpi-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                <Users size={22} />
              </div>
              <div>
                <div className="facilitator-kpi-val">{farmers.length}</div>
                <div className="facilitator-kpi-label">Registered Farmers</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0 }}>📊 Live Village Observations Consolidated Master</h3>
                <p className="text-secondary" style={{ margin: 0, fontSize: 'var(--text-xs)' }}>
                  Real-time combined readings recorded by CLIC field facilitators.
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
                <Download size={14} /> Export Live Records as CSV
              </button>
            </div>

            <div className="village-table-wrapper" style={{ border: 'none' }}>
              <table className="market-table">
                <thead>
                  <tr>
                    <th>Observation Type</th>
                    <th>Village</th>
                    <th>Date</th>
                    <th>Reading Value</th>
                    <th>Observer</th>
                    <th>Notes & Remarks</th>
                    <th>Sync Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rainfallRecords.slice(0, 5).map((r, i) => (
                    <tr key={`rf-${i}`}>
                      <td><span className="badge badge-sky">🌧️ Rainfall</span></td>
                      <td><strong>{r.village}</strong></td>
                      <td className="text-muted">{r.date}</td>
                      <td><strong style={{ color: r.rainfall >= 15 ? '#10b981' : '#3b82f6' }}>{r.rainfall} mm</strong></td>
                      <td className="text-muted">{r.observer}</td>
                      <td className="text-muted">{r.notes}</td>
                      <td><span className="badge badge-green"><CheckCircle2 size={12} /> Synced</span></td>
                    </tr>
                  ))}
                  {gwRecords.slice(0, 5).map((g, i) => (
                    <tr key={`gw-${i}`}>
                      <td><span className="badge badge-amber">💧 Groundwater</span></td>
                      <td><strong>{g.village}</strong> ({g.wellId || 'BW'})</td>
                      <td className="text-muted">{g.date}</td>
                      <td><strong style={{ color: g.depth > 18 ? '#ef4444' : '#10b981' }}>{g.depth} {g.unit || 'mbgl'}</strong></td>
                      <td className="text-muted">{g.observer}</td>
                      <td className="text-muted">{g.status} · {g.notes}</td>
                      <td><span className="badge badge-green"><CheckCircle2 size={12} /> Synced</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
