import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MACHINERY_OPERATIONS,
  FARM_MACHINES,
  DEMO_FARMERS,
  INITIAL_ORDERS,
  INITIAL_FARMER_QUERIES
} from '../data/machineryData';
import {
  defaultStates,
  defaultDistricts,
  defaultVillages
} from '../data/marketData';
import {
  Tractor, Search, ArrowRight, ArrowLeft, CheckCircle,
  Play, Image, FileText, ShoppingCart, Calendar,
  Bell, Building2, User, Phone, MapPin, Sparkles,
  Info, ExternalLink, ShieldCheck, X, RefreshCw, Send,
  Layers, ChevronRight, AlertCircle, Wrench, Clock,
  Check, FileCheck, Truck, UserCheck, Smartphone, Plus,
  Shield, KeyRound, Mail, MapPinned, Award, MessageCircle, Share2,
  UserPlus, FileQuestion, History, Filter, ChevronLeft, Save, CheckCircle2,
  UploadCloud, Edit3, SlidersHorizontal, Settings
} from 'lucide-react';
import '../styles/machinery.css';

// All Steps matching the diagram exactly
const WORKFLOW_STEPS = [
  { id: 'walkin', stepNum: 1, label: 'Farmer Walk-in & Query', desc: 'Farmer walks into CLIC & states requirement' },
  { id: 'farmer_data', stepNum: 2, label: 'Retrieve Farmer Data', desc: 'Identify farmer profile & farmholding' },
  { id: 'theme_select', stepNum: 3, label: 'Identify Theme & Menu Board', desc: 'Click Farm Machinery module on CLIC Menu' },
  { id: 'operations_info', stepNum: 4, label: 'Retrieve Info & Operations', desc: 'Display operations & machine list (Video/Pic/Text)' },
  { id: 'select_action', stepNum: 5, label: 'Select Equipment & Choice', desc: 'Farmer chooses Purchase or Rental' },
  { id: 'finalize_alert', stepNum: 6, label: 'Close & Workflow Alerts', desc: 'Alerts to FM Shop / CHC, Farmer & Back Alerts' }
];

const INITIAL_CHC_HUBS = [
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
    status: 'Active',
    createdDate: '2026-09-01'
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
    fleetCount: 5,
    operatorCount: 3,
    bankAccount: 'Andhra Bank - 551029381',
    status: 'Active',
    createdDate: '2026-09-10'
  }
];

const INITIAL_FMC_SHOPS = [
  {
    id: 'fmc-1',
    name: 'Sri Lakshmi Agro Automotives & Dealership',
    inCharge: 'Rajesh Kumar (Authorized Dealer)',
    phone: '9848011223',
    email: 'fmc@clic.in',
    role: 'fmc_dealer',
    city: 'Nalgonda Town',
    district: 'Nalgonda',
    gstin: '36AAACL8912P1ZX',
    brands: ['John Deere', 'Kubota', 'Aspee Sprayers'],
    subsidyCode: 'SMAM-TS-NLG-048',
    stockUnits: 14,
    status: 'Active',
    createdDate: '2026-09-01'
  },
  {
    id: 'fmc-2',
    name: 'Kisan Machinery Plaza & Service Hub',
    inCharge: 'M. Sridhar Reddy',
    phone: '9848033445',
    email: 'fmc.miryala@clic.in',
    role: 'fmc_dealer',
    city: 'Miryalaguda',
    district: 'Nalgonda',
    gstin: '36BBBCM4419Q2ZY',
    brands: ['Mahindra', 'Trimble Laser', 'Shakti Solar Pumps'],
    subsidyCode: 'PMKUSUM-TS-012',
    stockUnits: 9,
    status: 'Active',
    createdDate: '2026-09-08'
  }
];

export default function FarmMachinery() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active Tab: 'workflow' | 'orders' | 'alerts' | 'onboarding' | 'queries'
  const [activeTab, setActiveTab] = useState('workflow');

  // Derive initial role view based on authenticated user
  const initialRoleView = useMemo(() => {
    if (user?.role === 'farmer') return 'farmer';
    if (user?.role === 'chc_operator') return 'chc';
    if (user?.role === 'fmc_dealer') return 'fm_shop';
    if (user?.role === 'facilitator') return 'facilitator';
    return 'facilitator';
  }, [user?.role]);

  // Active Role View
  const [roleView, setRoleView] = useState(initialRoleView);

  // CHC Operators and FMC Dealers have dedicated files; redirect immediately if they land here
  useEffect(() => {
    if (user?.role === 'chc_operator') {
      navigate('/chc-portal', { replace: true });
    } else if (user?.role === 'fmc_dealer') {
      navigate('/fmc-portal', { replace: true });
    }
  }, [user?.role, navigate]);

  useEffect(() => {
    setRoleView(initialRoleView);
  }, [initialRoleView]);

  // Farmers State & Persistence
  const [farmers, setFarmers] = useState(() => {
    const saved = localStorage.getItem('clic_farmers');
    return saved ? JSON.parse(saved) : DEMO_FARMERS;
  });

  // Farmer Queries & Facilitator Log Persistence
  const [farmerQueries, setFarmerQueries] = useState(() => {
    const saved = localStorage.getItem('clic_farmer_queries');
    if (!saved) return INITIAL_FARMER_QUERIES;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(q => q.id));
      const missingInitials = INITIAL_FARMER_QUERIES.filter(q => !existingIds.has(q.id));
      return [...parsed, ...missingInitials];
    } catch {
      return INITIAL_FARMER_QUERIES;
    }
  });

  // Location Hierarchy for cascading State -> District -> Village selection
  const [locationStates, setLocationStates] = useState(() => {
    const saved = localStorage.getItem('clic_states');
    return saved ? JSON.parse(saved) : defaultStates;
  });

  const [locationDistricts, setLocationDistricts] = useState(() => {
    const saved = localStorage.getItem('clic_districts');
    return saved ? JSON.parse(saved) : defaultDistricts;
  });

  const [locationVillages, setLocationVillages] = useState(() => {
    const saved = localStorage.getItem('clic_market_villages');
    return saved ? JSON.parse(saved) : defaultVillages;
  });

  // Onboarded CHC Hubs & FMC Dealerships
  const [chcHubs, setChcHubs] = useState(() => {
    const saved = localStorage.getItem('clic_custom_chc');
    return saved ? JSON.parse(saved) : INITIAL_CHC_HUBS;
  });

  const [fmcShops, setFmcShops] = useState(() => {
    const saved = localStorage.getItem('clic_custom_fmc');
    return saved ? JSON.parse(saved) : INITIAL_FMC_SHOPS;
  });

  // Workflow State Management
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedFarmer, setSelectedFarmer] = useState(() => farmers[0] || DEMO_FARMERS[0]);
  const [farmerQuery, setFarmerQuery] = useState(() => farmers[0]?.activeQuery || DEMO_FARMERS[0].activeQuery);
  
  // Step 1 Search & Pagination State
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerVillageFilter, setFarmerVillageFilter] = useState('all');
  const [farmerPage, setFarmerPage] = useState(1);
  const farmersPerPage = 6;

  // Extract unique villages from current farmer list for quick chips
  const availableFarmerVillages = useMemo(() => {
    const vils = new Set();
    farmers.forEach(f => {
      if (f.village && f.village.trim()) vils.add(f.village.trim());
    });
    return Array.from(vils);
  }, [farmers]);

  // Add Farmer Modal & Notifications
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);
  const [queryToast, setQueryToast] = useState(null);

  // Cascading Form state for Farmer Registration (Mobile as Primary Key)
  const [newFarmerForm, setNewFarmerForm] = useState({
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
    landHolding: '3.0 acres',
    soilType: 'Red Sandy Loam',
    crops: 'Paddy, Cotton',
    bankAccount: '',
    subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
    initialQuery: ''
  });

  // Check in real time if the entered mobile number already belongs to a registered farmer
  const existingFarmerWithPhone = useMemo(() => {
    const raw = (newFarmerForm.phone || '').trim().replace(/\D/g, '');
    if (!raw || raw.length < 10) return null;
    return farmers.find(f => f.phone && f.phone.replace(/\D/g, '') === raw) || null;
  }, [newFarmerForm.phone, farmers]);

  // Queries Archive tab filters
  const [querySearch, setQuerySearch] = useState('');
  const [queryFilterStatus, setQueryFilterStatus] = useState('all');
  const [queryFilterFacilitator, setQueryFilterFacilitator] = useState('all');

  // Master Machinery State (persisted in LocalStorage)
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

  // Machine Upload Modal & Quick Edit State
  const [showUploadMachineModal, setShowUploadMachineModal] = useState(false);
  const [quickEditMachine, setQuickEditMachine] = useState(null);

  // Form state for CHC & FMC Equipment Upload
  const [newMachineForm, setNewMachineForm] = useState({
    name: '',
    telugu: '',
    operationId: 'land-prep',
    category: 'Tractor & Heavy Implements',
    powerHP: '50 HP',
    fuelType: 'Diesel (4.0 L/hr)',
    capacity: '2.5 acres/day',
    brand: 'Mahindra & Mahindra',
    thumbnail: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoTitle: 'Field Demonstration & Operation Video',
    description: '',
    // CHC Linkage
    chcHubId: 'chc-1',
    chcTotalUnits: 3,
    chcAvailableUnits: 3,
    chcRateHourly: 600,
    chcRateDaily: 4500,
    chcRatePerAcre: 1100,
    chcDeposit: 1500,
    chcOperatorIncluded: true,
    // FMC Linkage
    fmcId: 'fmc-1',
    msrp: 650000,
    subsidyPercent: 40,
    subsidyScheme: 'SMAM Sub-Mission on Agricultural Mechanization'
  });

  // Theme & Operations state
  const [activeTheme, setActiveTheme] = useState('Farm Machinery');
  const [selectedOperation, setSelectedOperation] = useState('all');
  const [searchMachine, setSearchMachine] = useState('');
  const [selectedMachine, setSelectedMachine] = useState(() => machines[0] || FARM_MACHINES[0]);
  
  // Details Modal (Video / Picture / Text)
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalMachine, setDetailModalMachine] = useState(null);
  const [modalTab, setModalTab] = useState('video'); // 'video' | 'picture' | 'text'

  // Purchase vs Rental selection
  const [actionChoice, setActionChoice] = useState('rental'); // 'purchase' | 'rental'

  // Purchase Form & Data
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [purchasePaymentMode, setPurchasePaymentMode] = useState('Kisan Credit Card (KCC) + 40% Subsidy');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  // Rental Form & Data
  const [rentalDurationType, setRentalDurationType] = useState('days'); // 'hours' | 'days' | 'acres'
  const [rentalUnits, setRentalUnits] = useState(2);
  const [rentalStartDate, setRentalStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [includeOperator, setIncludeOperator] = useState(true);

  // Orders and Alerts queue
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('clic_machinery_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [lastDispatchedOrder, setLastDispatchedOrder] = useState(null);

  // Onboarding Form States
  const [onboardType, setOnboardType] = useState('chc'); // 'chc' | 'fmc'
  const [onboardSuccess, setOnboardSuccess] = useState(null);

  // CHC Form
  const [chcForm, setChcForm] = useState({
    name: '',
    inCharge: '',
    phone: '',
    email: '',
    village: 'Chandampet',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    fleetCount: 5,
    operatorCount: 2,
    bankAccount: ''
  });

  // FMC Form
  const [fmcForm, setFmcForm] = useState({
    name: '',
    inCharge: '',
    phone: '',
    email: '',
    city: 'Nalgonda Town',
    district: 'Nalgonda',
    gstin: '',
    brands: 'John Deere, Kubota, Aspee',
    subsidyCode: 'SMAM-TS-2026-NLG',
    stockUnits: 10
  });

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('clic_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem('clic_farmer_queries', JSON.stringify(farmerQueries));
  }, [farmerQueries]);

  useEffect(() => {
    localStorage.setItem('clic_custom_chc', JSON.stringify(chcHubs));
  }, [chcHubs]);

  useEffect(() => {
    localStorage.setItem('clic_custom_fmc', JSON.stringify(fmcShops));
  }, [fmcShops]);

  useEffect(() => {
    localStorage.setItem('clic_machinery_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('clic_custom_machines', JSON.stringify(machines));
  }, [machines]);

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

  // Filter and Paginate Farmers in Step 1
  const filteredFarmers = useMemo(() => {
    let list = farmers;
    if (farmerVillageFilter && farmerVillageFilter !== 'all') {
      list = list.filter(f => f.village?.toLowerCase() === farmerVillageFilter.toLowerCase());
    }
    if (!farmerSearch.trim()) return list;
    const q = farmerSearch.toLowerCase();
    return list.filter(f =>
      (f.name && f.name.toLowerCase().includes(q)) ||
      (f.telugu && f.telugu.includes(q)) ||
      (f.phone && f.phone.includes(q)) ||
      (f.village && f.village.toLowerCase().includes(q)) ||
      (f.district && f.district.toLowerCase().includes(q)) ||
      (f.state && f.state.toLowerCase().includes(q))
    );
  }, [farmers, farmerSearch, farmerVillageFilter]);

  const totalFarmerPages = Math.max(1, Math.ceil(filteredFarmers.length / farmersPerPage));
  const paginatedFarmers = useMemo(() => {
    const start = (farmerPage - 1) * farmersPerPage;
    return filteredFarmers.slice(start, start + farmersPerPage);
  }, [filteredFarmers, farmerPage, farmersPerPage]);

  // Reset page when search or village filter changes
  useEffect(() => {
    setFarmerPage(1);
  }, [farmerSearch, farmerVillageFilter]);

  // Save Query with Facilitator Attribution
  const handleSaveFarmerQuery = (customText = null) => {
    const textToSave = customText !== null ? customText : farmerQuery;
    if (!textToSave || !textToSave.trim() || !selectedFarmer) return;

    const currentTimestamp = new Date().toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
    });
    const facName = user?.name || (user?.role === 'facilitator' ? 'CLIC Facilitator' : 'CLIC Desk In-Charge');
    const facEmail = user?.email || 'facilitator@clic.in';
    const facId = user?.id || 'fac-desk';

    const newRecord = {
      id: `QRY-${Date.now().toString().slice(-6)}`,
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.phone,
      village: selectedFarmer.village,
      district: selectedFarmer.district,
      state: selectedFarmer.state || 'Telangana',
      query: textToSave.trim(),
      facilitatorId: facId,
      facilitatorName: facName,
      facilitatorEmail: facEmail,
      facilitatorRole: user?.role || 'facilitator',
      timestamp: currentTimestamp,
      theme: activeTheme || 'Farm Machinery',
      status: 'Logged',
      notes: 'Walk-in query captured at CLIC assistance desk'
    };

    setFarmerQueries(prev => [newRecord, ...prev]);
    setFarmers(prev => prev.map(f => f.id === selectedFarmer.id ? { ...f, activeQuery: textToSave.trim() } : f));
    setQueryToast(`✓ Query recorded by ${facName} (${currentTimestamp})`);
    setTimeout(() => setQueryToast(null), 3500);
    return newRecord;
  };

  // Step 1 -> Step 2 transition
  const handleProceedStep1 = () => {
    if (farmerQuery && farmerQuery.trim()) {
      handleSaveFarmerQuery(farmerQuery);
    }
    setActiveStepIndex(1);
  };

  // Handle Location Cascades in Add Farmer Modal
  const handleStateChangeInFarmerForm = (newState) => {
    const stateDists = locationDistricts.filter(d => d.state === newState);
    const firstDist = stateDists[0] || { id: '', name: '' };
    const distVils = locationVillages.filter(v => v.districtId === firstDist.id);
    const firstVil = distVils[0] || { id: '', name: '' };

    setNewFarmerForm(prev => ({
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

  const handleDistrictChangeInFarmerForm = (newDistId) => {
    const distObj = locationDistricts.find(d => d.id === newDistId);
    const distVils = locationVillages.filter(v => v.districtId === newDistId);
    const firstVil = distVils[0] || { id: '', name: '' };

    setNewFarmerForm(prev => ({
      ...prev,
      districtId: newDistId,
      districtName: distObj?.name || '',
      villageId: firstVil.id,
      villageName: firstVil.name,
      isCustomVillage: false,
      customVillageName: ''
    }));
  };

  const handleVillageChangeInFarmerForm = (newVilId) => {
    if (newVilId === '__other__') {
      setNewFarmerForm(prev => ({
        ...prev,
        villageId: '__other__',
        villageName: 'Other',
        isCustomVillage: true
      }));
    } else {
      const vilObj = locationVillages.find(v => v.id === newVilId);
      setNewFarmerForm(prev => ({
        ...prev,
        villageId: newVilId,
        villageName: vilObj?.name || '',
        isCustomVillage: false
      }));
    }
  };

  // Handle Add Farmer Submission
  const handleRegisterNewFarmer = (e) => {
    e.preventDefault();
    const cleanPhone = (newFarmerForm.phone || '').trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit Mobile Number.');
      return;
    }

    if (!newFarmerForm.name.trim()) {
      alert('Please fill in the Farmer Name.');
      return;
    }

    // Check for duplicate mobile number (Primary Key uniqueness)
    const duplicate = farmers.find(f => f.phone && f.phone.replace(/\D/g, '') === cleanPhone);
    if (duplicate) {
      alert(`Farmer with mobile number +91 ${cleanPhone} is already registered as ${duplicate.name} (${duplicate.village}). Cannot save duplicate farmer.`);
      return;
    }

    const finalVillage = newFarmerForm.isCustomVillage
      ? (newFarmerForm.customVillageName.trim() || 'Custom Village')
      : newFarmerForm.villageName;

    // If custom village, also add to locationVillages
    if (newFarmerForm.isCustomVillage && newFarmerForm.customVillageName.trim()) {
      const newVilObj = {
        id: `v-${Date.now()}`,
        name: newFarmerForm.customVillageName.trim(),
        districtId: newFarmerForm.districtId
      };
      const updatedVils = [...locationVillages, newVilObj];
      setLocationVillages(updatedVils);
      localStorage.setItem('clic_market_villages', JSON.stringify(updatedVils));
    }

    // Mobile Number is the unique Primary Key
    const newFarmer = {
      id: `f-${cleanPhone}`,
      name: newFarmerForm.name.trim(),
      telugu: newFarmerForm.telugu.trim() || newFarmerForm.name.trim(),
      state: newFarmerForm.state,
      district: newFarmerForm.districtName,
      village: finalVillage,
      phone: cleanPhone,
      landHolding: newFarmerForm.landHolding.trim() || '3.0 acres',
      soilType: newFarmerForm.soilType || 'Red Sandy Loam',
      crops: typeof newFarmerForm.crops === 'string'
        ? newFarmerForm.crops.split(',').map(c => c.trim()).filter(Boolean)
        : newFarmerForm.crops,
      bankAccount: newFarmerForm.bankAccount.trim() || 'SBI - Main Branch',
      subsidyCategory: newFarmerForm.subsidyCategory || 'Small / Marginal Farmer (SF/MF)',
      activeQuery: newFarmerForm.initialQuery.trim() || 'Walk-in farmer registered at CLIC Center'
    };

    const updatedFarmers = [newFarmer, ...farmers];
    setFarmers(updatedFarmers);
    setSelectedFarmer(newFarmer);
    setFarmerQuery(newFarmer.activeQuery);

    // If initial query provided, save to query logs
    if (newFarmerForm.initialQuery.trim()) {
      const currentTimestamp = new Date().toLocaleString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
      });
      const facName = user?.name || (user?.role === 'facilitator' ? 'CLIC Facilitator' : 'CLIC Desk Operator');
      const facEmail = user?.email || 'facilitator@clic.in';
      const qRecord = {
        id: `QRY-${Date.now().toString().slice(-6)}`,
        farmerId: newFarmer.id,
        farmerName: newFarmer.name,
        farmerPhone: newFarmer.phone,
        village: newFarmer.village,
        district: newFarmer.district,
        state: newFarmer.state,
        query: newFarmerForm.initialQuery.trim(),
        facilitatorId: user?.id || 'fac-desk',
        facilitatorName: facName,
        facilitatorEmail: facEmail,
        facilitatorRole: user?.role || 'facilitator',
        timestamp: currentTimestamp,
        theme: 'Farm Machinery',
        status: 'Logged',
        notes: 'Initial requirement captured during farmer onboarding'
      };
      setFarmerQueries(prev => [qRecord, ...prev]);
    }

    setShowAddFarmerModal(false);
    setQueryToast(`✓ Farmer ${newFarmer.name} (📱 +91 ${newFarmer.phone}) registered as Primary Record!`);
    setTimeout(() => setQueryToast(null), 3500);

    // Reset Form
    setNewFarmerForm({
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
      landHolding: '3.0 acres',
      soilType: 'Red Sandy Loam',
      crops: 'Paddy, Cotton',
      bankAccount: '',
      subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
      initialQuery: ''
    });
  };

  // Filtered queries for Queries Archive tab
  const filteredQueries = useMemo(() => {
    return farmerQueries.filter(q => {
      const matchSearch = !querySearch.trim() ||
        q.farmerName.toLowerCase().includes(querySearch.toLowerCase()) ||
        q.farmerPhone.includes(querySearch) ||
        q.query.toLowerCase().includes(querySearch.toLowerCase()) ||
        q.facilitatorName.toLowerCase().includes(querySearch.toLowerCase()) ||
        q.village.toLowerCase().includes(querySearch.toLowerCase()) ||
        q.id.toLowerCase().includes(querySearch.toLowerCase());

      const matchStatus = queryFilterStatus === 'all' || q.status.toLowerCase().replace(/\s+/g, '') === queryFilterStatus.toLowerCase().replace(/\s+/g, '');
      const matchFac = queryFilterFacilitator === 'all' || q.facilitatorName === queryFilterFacilitator;

      return matchSearch && matchStatus && matchFac;
    });
  }, [farmerQueries, querySearch, queryFilterStatus, queryFilterFacilitator]);

  // Unique facilitators in queries
  const uniqueFacilitators = useMemo(() => {
    const list = farmerQueries.map(q => q.facilitatorName).filter(Boolean);
    return Array.from(new Set(list));
  }, [farmerQueries]);

  // Handle Tab Switch & Sync URL
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'workflow') {
      setRoleView('facilitator');
    }
    navigate(`/machinery?tab=${tabKey}`);
  };

  // Sync tab if query param present
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'workflow') {
      setActiveTab('workflow');
      setRoleView('facilitator');
    } else if (tab === 'orders') {
      setActiveTab('orders');
    } else if (tab === 'alerts') {
      setActiveTab('alerts');
    } else if (tab === 'onboarding') {
      setActiveTab('onboarding');
    } else if (tab === 'queries') {
      setActiveTab('queries');
    }
  }, [searchParams]);

  // Set default dealer when machine changes
  useEffect(() => {
    if (selectedMachine && selectedMachine.purchaseInfo?.dealers?.length > 0) {
      setSelectedDealer(selectedMachine.purchaseInfo.dealers[0]);
    }
  }, [selectedMachine]);

  // Filter machines by operation and search
  const filteredMachines = useMemo(() => {
    return machines.filter(m => {
      const matchOp = selectedOperation === 'all' || m.operationId === selectedOperation;
      const matchSearch = m.name.toLowerCase().includes(searchMachine.toLowerCase()) ||
                          m.brand?.toLowerCase().includes(searchMachine.toLowerCase()) ||
                          (m.telugu && m.telugu.includes(searchMachine)) ||
                          m.description?.toLowerCase().includes(searchMachine.toLowerCase());
      return matchOp && matchSearch;
    });
  }, [machines, selectedOperation, searchMachine]);

  // Handle Equipment Upload & Direct CHC/FMC Link
  const handleCreateNewMachine = (e) => {
    e.preventDefault();
    if (!newMachineForm.name.trim()) {
      alert('Please provide Machine / Implement Name.');
      return;
    }

    const selectedOp = MACHINERY_OPERATIONS.find(op => op.id === newMachineForm.operationId) || MACHINERY_OPERATIONS[0];
    const selectedChc = chcHubs.find(h => h.id === newMachineForm.chcHubId) || chcHubs[0];
    const selectedFmc = fmcShops.find(f => f.id === newMachineForm.fmcId) || fmcShops[0];

    const msrpVal = Number(newMachineForm.msrp) || 500000;
    const subPercent = Number(newMachineForm.subsidyPercent) || 40;
    const subsidyAmount = Math.round(msrpVal * (subPercent / 100));
    const effectivePrice = msrpVal - subsidyAmount;

    const newMach = {
      id: `m-custom-${Date.now()}`,
      name: newMachineForm.name.trim(),
      telugu: newMachineForm.telugu.trim() || newMachineForm.name.trim(),
      operationId: selectedOp.id,
      operationName: selectedOp.name,
      category: newMachineForm.category,
      powerHP: newMachineForm.powerHP,
      fuelType: newMachineForm.fuelType,
      capacity: newMachineForm.capacity,
      brand: newMachineForm.brand,
      thumbnail: newMachineForm.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
      gallery: [
        newMachineForm.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: newMachineForm.videoUrl || 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
      videoTitle: newMachineForm.videoTitle || `${newMachineForm.name} Field Operation Video`,
      description: newMachineForm.description.trim() || `${newMachineForm.name} directly onboarded and maintained by ${selectedChc?.name || 'CHC Hub'} and authorized by ${selectedFmc?.name || 'FMC Dealership'}.`,
      specs: {
        'Engine Power': newMachineForm.powerHP,
        'Fuel Type': newMachineForm.fuelType,
        'Field Capacity': newMachineForm.capacity,
        'Assigned CHC Hub': selectedChc?.name || 'Chandampet Central CHC Hub',
        'FMC Dealership': selectedFmc?.name || 'Sri Lakshmi Agro Automotives'
      },
      chcAvailability: {
        total: Number(newMachineForm.chcTotalUnits) || 3,
        available: Number(newMachineForm.chcAvailableUnits) || 3,
        rateHourly: Number(newMachineForm.chcRateHourly) || 600,
        rateDaily: Number(newMachineForm.chcRateDaily) || 4500,
        ratePerAcre: Number(newMachineForm.chcRatePerAcre) || 1100,
        deposit: Number(newMachineForm.chcDeposit) || 1500,
        chcHub: selectedChc?.name || 'Chandampet Central CHC Hub',
        operatorAvailable: Boolean(newMachineForm.chcOperatorIncluded),
        operatorRateExtra: 150
      },
      purchaseInfo: {
        msrp: msrpVal,
        subsidyPercent: subPercent,
        subsidyAmount: subsidyAmount,
        effectivePrice: effectivePrice,
        subsidyScheme: newMachineForm.subsidyScheme,
        dealers: [
          {
            name: selectedFmc?.name || 'Sri Lakshmi Agro Automotives',
            city: selectedFmc?.city || 'Nalgonda',
            contact: selectedFmc?.phone || '9848011223',
            inStock: true
          }
        ]
      }
    };

    const updatedMachines = [newMach, ...machines];
    setMachines(updatedMachines);
    setSelectedMachine(newMach);
    setShowUploadMachineModal(false);
    setQueryToast(`✓ New machine "${newMach.name}" uploaded and linked to ${selectedChc?.name || 'CHC Hub'}!`);
    setTimeout(() => setQueryToast(null), 3500);

    // Reset form
    setNewMachineForm({
      name: '',
      telugu: '',
      operationId: 'land-prep',
      category: 'Tractor & Heavy Implements',
      powerHP: '50 HP',
      fuelType: 'Diesel (4.0 L/hr)',
      capacity: '2.5 acres/day',
      brand: 'Mahindra & Mahindra',
      thumbnail: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
      videoTitle: 'Field Demonstration & Operation Video',
      description: '',
      chcHubId: chcHubs[0]?.id || 'chc-1',
      chcTotalUnits: 3,
      chcAvailableUnits: 3,
      chcRateHourly: 600,
      chcRateDaily: 4500,
      chcRatePerAcre: 1100,
      chcDeposit: 1500,
      chcOperatorIncluded: true,
      fmcId: fmcShops[0]?.id || 'fmc-1',
      msrp: 650000,
      subsidyPercent: 40,
      subsidyScheme: 'SMAM Sub-Mission on Agricultural Mechanization'
    });
  };

  // Quick edit availability & stock
  const handleSaveQuickEditMachine = (e) => {
    e.preventDefault();
    if (!quickEditMachine) return;

    const updated = machines.map(m => m.id === quickEditMachine.id ? quickEditMachine : m);
    setMachines(updated);
    if (selectedMachine?.id === quickEditMachine.id) {
      setSelectedMachine(quickEditMachine);
    }
    setQuickEditMachine(null);
    setQueryToast(`✓ Live availability & rates updated for "${quickEditMachine.name}"!`);
    setTimeout(() => setQueryToast(null), 3500);
  };

  // Native Web Share Handler (like YouTube Share Video)
  const handleNativeShare = async ({ title, text, url }) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'CLIC Farm Machinery',
          text: text,
          url: url || window.location.href,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // User closed share sheet
      }
    }
    // Fallback: Copy to clipboard if Web Share API is not active on browser
    try {
      await navigator.clipboard.writeText(`${title ? `${title}\n` : ''}${text}${url ? `\nLink: ${url}` : ''}`);
      alert('📋 Content copied to clipboard! You can paste and share it anywhere.');
    } catch (e) {
      alert('Sharing is not supported on this browser.');
    }
  };

  const handleShareOrder = (order, target = 'farmer') => {
    const text = target === 'farmer' ? getFarmerWhatsAppMsg(order) : getProviderWhatsAppMsg(order);
    handleNativeShare({
      title: target === 'farmer' ? `CLIC Booking Receipt: ${order.machineName}` : `CLIC Work Order: ${order.id}`,
      text: text,
      url: window.location.origin + `/machinery?tab=orders`
    });
  };

  const handleShareMachine = (machine) => {
    handleNativeShare({
      title: `CLIC Machinery: ${machine.name}`,
      text: getMachineCatalogWhatsAppMsg(machine),
      url: machine.videoUrl || window.location.href
    });
  };

  const handleShareAlert = (order) => {
    handleNativeShare({
      title: `CLIC Alert: ${order.id}`,
      text: `🔔 CLIC Farm Machinery Alert:\nOrder Ref: ${order.id}\nEquipment: ${order.machineName}\nFarmer: ${order.farmerName} (${order.village})\nStatus: ${order.status}`,
      url: window.location.origin + `/machinery?tab=alerts`
    });
  };

  // Open Details modal helper
  const handleOpenDetails = (machine, defaultTab = 'video') => {
    setDetailModalMachine(machine);
    setModalTab(defaultTab);
    setDetailModalOpen(true);
  };

  // Handle CHC Onboarding Submission
  const handleOnboardCHC = (e) => {
    e.preventDefault();
    if (!chcForm.name || !chcForm.inCharge || !chcForm.phone) {
      alert('Please fill all required fields');
      return;
    }

    const email = chcForm.email || `chc.${chcForm.village.toLowerCase().replace(/\s+/g, '')}@clic.in`;
    const newCHC = {
      id: `chc-${Date.now()}`,
      name: chcForm.name,
      inCharge: chcForm.inCharge,
      phone: chcForm.phone,
      email: email,
      role: 'chc_operator',
      village: chcForm.village,
      district: chcForm.district,
      mandal: chcForm.mandal,
      fleetCount: Number(chcForm.fleetCount) || 1,
      operatorCount: Number(chcForm.operatorCount) || 1,
      bankAccount: chcForm.bankAccount || 'SBI - Main Branch',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Register user account in custom users for login
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const newUser = {
      id: Date.now(),
      name: chcForm.inCharge,
      email: email,
      password: 'clic@2025',
      role: 'chc_operator',
      village: `${chcForm.village} CHC Hub`,
      avatar: '🚜',
      designation: 'CHC Center In-Charge'
    };
    localStorage.setItem('clic_custom_users', JSON.stringify([...customUsers, newUser]));

    const updated = [newCHC, ...chcHubs];
    setChcHubs(updated);
    setOnboardSuccess({
      type: 'CHC Center',
      name: newCHC.name,
      inCharge: newCHC.inCharge,
      email: email,
      role: 'chc_operator',
      phone: newCHC.phone
    });

    setChcForm({
      name: '',
      inCharge: '',
      phone: '',
      email: '',
      village: 'Chandampet',
      district: 'Nalgonda',
      mandal: 'Chandampet',
      fleetCount: 5,
      operatorCount: 2,
      bankAccount: ''
    });
  };

  // Handle FMC Dealership Onboarding Submission
  const handleOnboardFMC = (e) => {
    e.preventDefault();
    if (!fmcForm.name || !fmcForm.inCharge || !fmcForm.phone) {
      alert('Please fill all required fields');
      return;
    }

    const email = fmcForm.email || `fmc.${fmcForm.city.toLowerCase().replace(/\s+/g, '')}@clic.in`;
    const newFMC = {
      id: `fmc-${Date.now()}`,
      name: fmcForm.name,
      inCharge: fmcForm.inCharge,
      phone: fmcForm.phone,
      email: email,
      role: 'fmc_dealer',
      city: fmcForm.city,
      district: fmcForm.district,
      gstin: fmcForm.gstin || '36AAACL0000P1ZX',
      brands: fmcForm.brands.split(',').map(b => b.trim()),
      subsidyCode: fmcForm.subsidyCode || 'SMAM-TS-2026',
      stockUnits: Number(fmcForm.stockUnits) || 5,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Register user account in custom users for login
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const newUser = {
      id: Date.now(),
      name: fmcForm.inCharge,
      email: email,
      password: 'clic@2025',
      role: 'fmc_dealer',
      village: `${fmcForm.city} Dealership`,
      avatar: '🏪',
      designation: 'Authorized FM Dealership Lead'
    };
    localStorage.setItem('clic_custom_users', JSON.stringify([...customUsers, newUser]));

    const updated = [newFMC, ...fmcShops];
    setFmcShops(updated);
    setOnboardSuccess({
      type: 'FM Dealership (FMC)',
      name: newFMC.name,
      inCharge: newFMC.inCharge,
      email: email,
      role: 'fmc_dealer',
      phone: newFMC.phone
    });

    setFmcForm({
      name: '',
      inCharge: '',
      phone: '',
      email: '',
      city: 'Nalgonda Town',
      district: 'Nalgonda',
      gstin: '',
      brands: 'John Deere, Kubota, Aspee',
      subsidyCode: 'SMAM-TS-2026-NLG',
      stockUnits: 10
    });
  };

  // Close Purchase Order & Trigger Alerts
  const handleClosePurchaseOrder = () => {
    const newOrderId = `FM-PUR-${Math.floor(1000 + Math.random() * 9000)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: newOrderId,
      type: 'purchase',
      date: new Date().toISOString().split('T')[0],
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.phone,
      village: selectedFarmer.village,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      dealer: `${selectedDealer?.name || fmcShops[0]?.name} (${selectedDealer?.city || fmcShops[0]?.city})`,
      dealerPhone: selectedDealer?.contact || fmcShops[0]?.phone,
      msrp: selectedMachine.purchaseInfo.msrp,
      subsidyAmount: selectedMachine.purchaseInfo.subsidyAmount,
      netPayable: selectedMachine.purchaseInfo.effectivePrice,
      paymentMode: purchasePaymentMode,
      status: 'Alert Dispatched to FM Shop',
      stage: 'fm_shop_alerted',
      timeline: [
        { time: currentTime, text: `Farmer ${selectedFarmer.name} requested purchase for ${selectedMachine.name}` },
        { time: currentTime, text: `Purchase Order Closed · Ref: ${newOrderId}` },
        { time: currentTime, text: `Alert Dispatched to FM Shop: ${selectedDealer?.name || fmcShops[0]?.name}` },
        { time: currentTime, text: `Quotation Alert SMS dispatched to Farmer (${selectedFarmer.phone})` }
      ],
      backAlert: {
        received: false,
        from: `FM Shop (${selectedDealer?.name || fmcShops[0]?.name})`,
        message: 'Pending dealer review and stock allocation.',
        statusUpdate: 'Dealer Review Pending'
      }
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    setLastDispatchedOrder(newOrder);
    setActiveStepIndex(5); // Jump to Close & Alerts step
  };

  // Close Rental Booking & Trigger Alerts
  const handleCloseRentalBooking = () => {
    const newBookingId = `CHC-RNT-${Math.floor(2000 + Math.random() * 8000)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const chc = selectedMachine.chcAvailability;
    let rateStr = '';
    let estimatedTotal = 0;

    if (rentalDurationType === 'hours') {
      rateStr = `₹${chc.rateHourly}/hr`;
      estimatedTotal = (chc.rateHourly + (includeOperator ? chc.operatorRateExtra : 0)) * rentalUnits;
    } else if (rentalDurationType === 'days') {
      rateStr = `₹${chc.rateDaily}/day`;
      estimatedTotal = (chc.rateDaily + (includeOperator ? chc.operatorRateExtra * 8 : 0)) * rentalUnits;
    } else {
      rateStr = `₹${chc.ratePerAcre}/acre`;
      estimatedTotal = chc.ratePerAcre * rentalUnits;
    }

    const assignedHub = chcHubs[0]?.name || chc.chcHub;

    const newOrder = {
      id: newBookingId,
      type: 'rental',
      date: new Date().toISOString().split('T')[0],
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.phone,
      village: selectedFarmer.village,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      chcHub: assignedHub,
      chcContact: chcHubs[0]?.phone || '9876500112',
      rentalUnits: `${rentalUnits} ${rentalDurationType}`,
      startDate: rentalStartDate,
      rate: rateStr,
      deposit: `₹${chc.deposit}`,
      totalEstimated: estimatedTotal,
      withOperator: includeOperator,
      operatorName: includeOperator ? 'Assigned upon CHC Confirmation' : 'Farmer Self-Operated',
      status: 'Alert Dispatched to CHC',
      stage: 'chc_alerted',
      timeline: [
        { time: currentTime, text: `Farmer ${selectedFarmer.name} requested rental of ${selectedMachine.name}` },
        { time: currentTime, text: `Rental Booking Closed · Ref: ${newBookingId}` },
        { time: currentTime, text: `Alert Dispatched to CHC Hub (${assignedHub})` },
        { time: currentTime, text: `Booking Confirmation SMS dispatched to Farmer (${selectedFarmer.phone})` }
      ],
      backAlert: {
        received: false,
        from: `CHC Hub (${assignedHub})`,
        message: 'CHC supervisor reviewing slot availability.',
        statusUpdate: 'CHC Slot Assignment in Progress'
      }
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    setLastDispatchedOrder(newOrder);
    setActiveStepIndex(5); // Jump to Close & Alerts step
  };

  // Simulate Back Alert from CHC or FM Shop
  const handleSimulateBackAlert = (orderId, customMsg = null) => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        if (ord.type === 'purchase') {
          return {
            ...ord,
            status: 'Alert Back from FM Shop Received · Confirmed',
            stage: 'back_alert_received',
            timeline: [
              ...ord.timeline,
              { time: currentTime, text: 'Alert Back from FM Shop: Unit ready in stock. Pre-delivery inspection passed. Subsidy sanction approved!' }
            ],
            backAlert: {
              received: true,
              from: ord.dealer,
              message: customMsg || 'Quotation confirmed & Machinery reserved. Delivery scheduled with field demonstration engineer.',
              statusUpdate: 'Ready for Delivery · Subsidy Verified'
            }
          };
        } else {
          return {
            ...ord,
            status: 'Alert Back from CHC Received · Confirmed',
            stage: 'back_alert_received',
            operatorName: 'Ramesh Kumar (Certified Operator)',
            timeline: [
              ...ord.timeline,
              { time: currentTime, text: `Alert Back from CHC: Machine fueled & reserved. Operator Ramesh assigned. Scheduled for ${ord.startDate}.` }
            ],
            backAlert: {
              received: true,
              from: ord.chcHub,
              message: customMsg || `Equipment checked & pre-serviced. Operator assigned with trailer transport to ${ord.village}.`,
              statusUpdate: 'CHC Booking Confirmed & Dispatched'
            }
          };
        }
      }
      return ord;
    }));

    if (lastDispatchedOrder && lastDispatchedOrder.id === orderId) {
      setLastDispatchedOrder(prev => ({
        ...prev,
        status: 'Alert Back Received · Confirmed',
        stage: 'back_alert_received',
        backAlert: {
          received: true,
          from: prev.type === 'purchase' ? prev.dealer : prev.chcHub,
          message: customMsg || 'Official confirmation and dispatch alert received back.',
          statusUpdate: 'Confirmed & Scheduled'
        }
      }));
    }
  };

  return (
    <div className="machinery-page animate-fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span className="badge badge-sky" style={{ fontSize: '11px', fontWeight: 'bold' }}>🚜 CLIC Core Module</span>
            <span className="badge badge-green" style={{ fontSize: '11px' }}>Full Workflow & Onboarding Active</span>
          </div>
          <h1 style={{ marginTop: 'var(--space-1)' }}>Farm Machinery & Custom Hiring Center</h1>
          <p className="text-secondary">
            End-to-End Walk-in Assistance, Operations Catalog, FM Shop Purchase, CHC Rental & Entity Onboarding.
          </p>
        </div>

        {/* View switcher tabs for Facilitator Desk */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTab === 'workflow' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => handleTabChange('workflow')}
          >
            <Layers size={15} /> 1. Walk-in Workflow (6-Step)
          </button>
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => handleTabChange('orders')}
          >
            <ShoppingCart size={15} /> 2. Orders & CHC Bookings ({orders.length})
          </button>
          <button
            className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => handleTabChange('alerts')}
          >
            <Bell size={15} /> 3. Workflow Alerts Feed
          </button>
          <button
            className={`btn ${activeTab === 'queries' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => handleTabChange('queries')}
          >
            <FileQuestion size={15} /> 4. Farmer Queries Archive ({farmerQueries.length})
          </button>
          {(user?.role === 'management' || user?.role === 'facilitator') && (
            <button
              className={`btn ${activeTab === 'onboarding' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => handleTabChange('onboarding')}
              style={{ borderColor: 'var(--color-forest-light)' }}
            >
              <UserCheck size={15} /> 5. 🏛️ Onboard CHC & FMC ({chcHubs.length + fmcShops.length})
            </button>
          )}
        </div>
      </div>

      {/* Query / Action Notification Toast */}
      {queryToast && (
        <div className="card animate-fade-in" style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.12), rgba(37, 99, 235, 0.08))', border: '1px solid var(--color-mint)', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-forest-dark)', fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
            <CheckCircle2 size={18} className="text-forest" />
            <span>{queryToast}</span>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }} onClick={() => setQueryToast(null)}>
            <X size={12} />
          </button>
        </div>
      )}

      {/* Role Banner / Admin Perspective Switcher */}
      {user?.role === 'management' ? (
        <>
          <div className="role-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Shield size={16} className="text-forest" />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                🏛️ Admin Perspective Switcher:
              </span>
            </div>
            <div className="role-chips">
              {[
                { id: 'facilitator', label: '👨‍💼 CLIC Facilitator Desk', path: '/machinery?tab=workflow' },
                { id: 'farmer', label: '👨‍🌾 Farmer Self-Service', path: '/machinery?tab=workflow' },
                { id: 'chc', label: '🚜 CHC Center Operator (Dedicated .jsx)', path: '/chc-portal' },
                { id: 'fm_shop', label: '🏪 FM Shop Dealer (Dedicated .jsx)', path: '/fmc-portal' }
              ].map(r => (
                <button
                  key={r.id}
                  className={`role-chip-btn ${roleView === r.id ? 'active' : ''}`}
                  onClick={() => {
                    if (r.id === 'chc') {
                      navigate('/chc-portal');
                      return;
                    }
                    if (r.id === 'fm_shop') {
                      navigate('/fmc-portal');
                      return;
                    }
                    setRoleView(r.id);
                    if (activeTab !== 'workflow') handleTabChange('workflow');
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: '10px 16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)' }}>
              <span className="badge badge-sky" style={{ fontWeight: 'bold' }}>Simulating View:</span>
              {roleView === 'facilitator' && <span>👨‍💼 <strong>CLIC Facilitator Walk-in Desk</strong> – Full 6-step guided pipeline for walk-in farmers.</span>}
              {roleView === 'farmer' && <span>👨‍🌾 <strong>Farmer Direct Portal</strong> – Browse machinery by operation, watch video tutorials & track bookings.</span>}
              {roleView === 'chc' && <span>🚜 <strong>Custom Hiring Center (CHC Operator) Dashboard</strong> – Manage rental requests & trigger Back Alerts.</span>}
              {roleView === 'fm_shop' && <span>🏪 <strong>FM Shop Dealership Portal</strong> – Review purchase orders, verify subsidies & dispatch confirmations.</span>}
            </div>
            <span className="text-muted" style={{ fontSize: '11px' }}>Logged in as Admin (Full Control)</span>
          </div>
        </>
      ) : null}

      {/* ============================================================ */}
      {/* 1. ONBOARDING & REGISTRATION TAB (Admin / Management View)  */}
      {/* ============================================================ */}
      {activeTab === 'onboarding' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Header */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)', color: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                  🏛️
                </div>
                <div>
                  <div className="badge badge-green" style={{ marginBottom: '4px' }}>Admin Onboarding & Role Assignment Desk</div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                    Onboard Custom Hiring Centers (CHC) & Machinery Dealerships (FMC)
                  </h2>
                  <p style={{ fontSize: 'var(--text-xs)', color: '#94A3B8', margin: '2px 0 0 0' }}>
                    Register partner CHC hubs and authorized equipment dealers, assign <code>chc_operator</code> and <code>fmc_dealer</code> roles, and auto-generate login credentials.
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  className={`btn ${onboardType === 'chc' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => { setOnboardType('chc'); setOnboardSuccess(null); }}
                >
                  <Tractor size={15} /> + Onboard CHC Hub
                </button>
                <button
                  className={`btn ${onboardType === 'fmc' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => { setOnboardType('fmc'); setOnboardSuccess(null); }}
                >
                  <Building2 size={15} /> + Onboard FMC Dealer
                </button>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {onboardSuccess && (
            <div className="card animate-fade-in" style={{ background: 'rgba(5, 150, 105, 0.08)', border: '2px solid var(--color-mint)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <CheckCircle size={28} className="text-mint" />
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--color-mint)' }}>
                      🎉 New {onboardSuccess.type} Successfully Onboarded!
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', margin: '2px 0' }}>
                      <strong>{onboardSuccess.name}</strong> has been registered. Role <code>{onboardSuccess.role}</code> assigned.
                    </p>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Login Email: <strong>{onboardSuccess.email}</strong> · Demo Password: <strong>clic@2025</strong> · Contact: <strong>{onboardSuccess.phone}</strong>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (onboardSuccess.role === 'chc_operator') {
                        navigate('/chc-portal');
                      } else {
                        navigate('/fmc-portal');
                      }
                    }}
                  >
                    Open {onboardSuccess.role === 'chc_operator' ? 'CHC Hub Portal' : 'FMC Dealer Portal'} <ArrowRight size={14} />
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setOnboardSuccess(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form & Directory Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-5)' }}>
            {/* Left Column: Onboarding Form */}
            <div className="card border-forest" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="section-title">
                {onboardType === 'chc' ? <Tractor size={20} className="text-forest" /> : <Building2 size={20} className="text-forest" />}
                <span>{onboardType === 'chc' ? 'New Custom Hiring Center (CHC) Registration' : 'New Farm Machinery Center (FMC) Dealership Registration'}</span>
              </div>
              <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                {onboardType === 'chc'
                  ? 'Register a community CHC Hub operated by PACS, FPO, or SHG cluster to offer subsidized equipment rentals.'
                  : 'Register an authorized commercial machinery dealer to provide new equipment sales with SMAM/PM-KUSUM subsidies.'}
              </p>

              {onboardType === 'chc' ? (
                <form onSubmit={handleOnboardCHC} className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>CHC Center Hub Name *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Marriguda Farmer Cooperative CHC Hub"
                      value={chcForm.name}
                      onChange={e => setChcForm({ ...chcForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Supervisor / Operator In-Charge *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Suresh Goud"
                      value={chcForm.inCharge}
                      onChange={e => setChcForm({ ...chcForm, inCharge: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="10-digit mobile"
                      value={chcForm.phone}
                      onChange={e => setChcForm({ ...chcForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Assigned Login Email</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="chc.hubname@clic.in"
                      value={chcForm.email}
                      onChange={e => setChcForm({ ...chcForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Village Cluster / Location *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Marriguda Village"
                      value={chcForm.village}
                      onChange={e => setChcForm({ ...chcForm, village: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Fleet Units Count</label>
                    <input
                      type="number"
                      min={1}
                      className="input-field"
                      value={chcForm.fleetCount}
                      onChange={e => setChcForm({ ...chcForm, fleetCount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Trained Operators Count</label>
                    <input
                      type="number"
                      min={1}
                      className="input-field"
                      value={chcForm.operatorCount}
                      onChange={e => setChcForm({ ...chcForm, operatorCount: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Bank Account (for Rental DBT Settlements)</label>
                    <input
                      className="input-field"
                      placeholder="e.g. SBI A/c 3098129381 (Chandampet Branch)"
                      value={chcForm.bankAccount}
                      onChange={e => setChcForm({ ...chcForm, bankAccount: e.target.value })}
                    />
                  </div>

                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                    <button type="submit" className="btn btn-primary w-full">
                      <CheckCircle size={16} /> Register CHC Hub & Assign `chc_operator` Role
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleOnboardFMC} className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Machinery Dealership / Shop Name *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Deccan Agri Machinery & Implements"
                      value={fmcForm.name}
                      onChange={e => setFmcForm({ ...fmcForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dealer In-Charge Name *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. P. Venkatesh (Authorized Dealer)"
                      value={fmcForm.inCharge}
                      onChange={e => setFmcForm({ ...fmcForm, inCharge: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Phone *</label>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="10-digit mobile"
                      value={fmcForm.phone}
                      onChange={e => setFmcForm({ ...fmcForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dealer Login Email</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="fmc.dealer@clic.in"
                      value={fmcForm.email}
                      onChange={e => setFmcForm({ ...fmcForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>City / Showroom Location *</label>
                    <input
                      className="input-field"
                      placeholder="e.g. Suryapet Town"
                      value={fmcForm.city}
                      onChange={e => setFmcForm({ ...fmcForm, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>GSTIN Registration Number</label>
                    <input
                      className="input-field"
                      placeholder="36AAACL8912P1ZX"
                      value={fmcForm.gstin}
                      onChange={e => setFmcForm({ ...fmcForm, gstin: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>SMAM Subsidy Nodal Code</label>
                    <input
                      className="input-field"
                      placeholder="SMAM-TS-2026-NLG"
                      value={fmcForm.subsidyCode}
                      onChange={e => setFmcForm({ ...fmcForm, subsidyCode: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label>Authorized Brands (comma-separated)</label>
                    <input
                      className="input-field"
                      placeholder="John Deere, Kubota, Aspee, Shakti Solar"
                      value={fmcForm.brands}
                      onChange={e => setFmcForm({ ...fmcForm, brands: e.target.value })}
                    />
                  </div>

                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                    <button type="submit" className="btn btn-primary w-full">
                      <CheckCircle size={16} /> Register FMC Dealership & Assign `fmc_dealer` Role
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Registered CHCs & FMCs Directory */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* CHC Directory */}
              <div className="card">
                <div className="section-title" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tractor size={18} className="text-sky" />
                    <span>Registered CHC Hubs ({chcHubs.length})</span>
                  </div>
                  <span className="badge badge-sky">Role: chc_operator</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {chcHubs.map(hub => (
                    <div key={hub.id} className="card" style={{ background: 'var(--color-bg-elevated)', borderLeft: '4px solid var(--color-sky)', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: 0 }}>{hub.name}</h4>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            In-Charge: <strong>{hub.inCharge}</strong> (📱 {hub.phone})
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            📍 {hub.village}, {hub.district} · Fleet: <strong>{hub.fleetCount} machines</strong> · Login: <code>{hub.email}</code>
                          </div>
                        </div>
                        <span className="badge badge-green">Active Hub</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FMC Directory */}
              <div className="card">
                <div className="section-title" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={18} className="text-forest" />
                    <span>Registered FMC Dealerships ({fmcShops.length})</span>
                  </div>
                  <span className="badge badge-forest">Role: fmc_dealer</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {fmcShops.map(fmc => (
                    <div key={fmc.id} className="card" style={{ background: 'var(--color-bg-elevated)', borderLeft: '4px solid var(--color-forest)', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: 0 }}>{fmc.name}</h4>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                            Dealer: <strong>{fmc.inCharge}</strong> (📱 {fmc.phone}) · GSTIN: <code>{fmc.gstin}</code>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            📍 {fmc.city} · Brands: <strong>{Array.isArray(fmc.brands) ? fmc.brands.join(', ') : fmc.brands}</strong> · Login: <code>{fmc.email}</code>
                          </div>
                        </div>
                        <span className="badge badge-green">Authorized</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Full Equipment Inventory & Linked Fleets */}
            <div className="card" style={{ gridColumn: '1 / -1', marginTop: 'var(--space-2)' }}>
              <div className="section-title" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={18} className="text-forest" />
                  <span>Integrated Machinery & Implements Registry ({machines.length} Instruments Linked)</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowUploadMachineModal(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <UploadCloud size={14} /> + Upload New Equipment / Link to Hub
                </button>
              </div>

              <div className="table-responsive">
                <table className="logs-table">
                  <thead>
                    <tr>
                      <th>Equipment Name</th>
                      <th>Operation / Category</th>
                      <th>Assigned CHC Hub</th>
                      <th>Yard Stock</th>
                      <th>Rental Rates</th>
                      <th>Authorized FMC Dealer</th>
                      <th>Purchase Subsidized</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {machines.map(m => (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={m.thumbnail} alt={m.name} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                            <div>
                              <strong style={{ fontSize: '12px' }}>{m.name}</strong>
                              <div style={{ fontSize: '11px', color: 'var(--color-forest)', fontFamily: 'var(--font-telugu)' }}>{m.telugu}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-sky" style={{ fontSize: '10px' }}>{m.operationName}</span>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 2 }}>{m.powerHP}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', fontWeight: '500' }}>{m.chcAvailability?.chcHub || 'Central CHC'}</div>
                        </td>
                        <td>
                          <span className={`hub-avail-pill ${m.chcAvailability?.available > 1 ? 'in-stock' : m.chcAvailability?.available === 1 ? 'low-stock' : 'out-of-stock'}`}>
                            {m.chcAvailability?.available} / {m.chcAvailability?.total} Units
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-mint)' }}>₹{m.chcAvailability?.rateHourly}/hr</div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>₹{m.chcAvailability?.rateDaily}/day</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px' }}>{m.purchaseInfo?.dealers?.[0]?.name || 'Authorized FMC'}</div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{m.purchaseInfo?.dealers?.[0]?.city}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-forest)' }}>
                            ₹{m.purchaseInfo?.effectivePrice?.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                            ({m.purchaseInfo?.subsidyPercent}% SMAM Subsidy)
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setQuickEditMachine({ ...m })}
                              style={{ padding: '3px 6px', fontSize: '11px' }}
                              title="Edit fleet availability and rental prices"
                            >
                              <Settings size={12} /> Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleOpenDetails(m, 'video')}
                              style={{ padding: '3px 6px', fontSize: '11px' }}
                              title="View Demo"
                            >
                              <Play size={12} className="text-alert" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. INTERACTIVE WORKFLOW MODE (When activeTab === 'workflow') */}
      {/* ============================================================ */}
      {activeTab === 'workflow' && (
        <>
          {/* ──────────────────────────────────────────────────────────── */}
          {/* VIEW A: FACILITATOR DESK (Default Standard Workflow Pipeline) */}
          {/* ──────────────────────────────────────────────────────────── */}
          {roleView === 'facilitator' && (
            <>
              {/* Visual Step Progress Navigator (matches image workflow) */}
              <div className="workflow-stepper-container">
                <div className="workflow-header">
                  <div className="workflow-title">
                    <Sparkles size={18} className="text-amber" />
                    <span>Farm Machinery Workflow Pipeline (Facilitator Assisted)</span>
                  </div>
                  <div className="workflow-diagram-badge">
                    <span>Reference: Standard CLIC Farm Machinery Flowchart</span>
                  </div>
                </div>

                <div className="workflow-steps-scroll">
                  {WORKFLOW_STEPS.map((step, idx) => {
                    const isActive = activeStepIndex === idx;
                    const isCompleted = activeStepIndex > idx;
                    return (
                      <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <div
                          className={`wf-step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                          onClick={() => setActiveStepIndex(idx)}
                          title={step.desc}
                        >
                          <div className="wf-step-num">
                            {isCompleted ? '✓' : step.stepNum}
                          </div>
                          <span>{step.label}</span>
                        </div>
                        {idx < WORKFLOW_STEPS.length - 1 && (
                          <div className="wf-arrow-connector">
                            <ChevronRight size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── STEP 1: Farmer Walks into CLIC & Query ── */}
              {activeStepIndex === 0 && (
                <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div className="badge badge-green" style={{ marginBottom: 'var(--space-1)' }}>Step 1 · CLIC Walk-In Desk</div>
                      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Farmer Walks into CLIC & States Query</h2>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                        Search existing farmer records with pagination, register new walk-in farmers with State-District-Village hierarchy, and log requirements with facilitator attribution.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowAddFarmerModal(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <UserPlus size={16} /> + Register New Farmer
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleProceedStep1}
                      >
                        Retrieve Farmer Data <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                    {/* Farmer Search, List & Pagination */}
                    <div className="card" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {/* Search Header */}
                      <div className="farmer-search-header">
                        <div className="farmer-search-title">
                          <span className="farmer-search-title-icon">
                            <Search size={15} />
                          </span>
                          <span>Search & Select Walk-in Farmer:</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="search-count-badge">
                            {filteredFarmers.length} of {farmers.length} Available
                          </span>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowAddFarmerModal(true)}
                            style={{ padding: '3px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Register new walk-in farmer"
                          >
                            <UserPlus size={13} /> + Add
                          </button>
                        </div>
                      </div>

                      {/* Enhanced Search Input */}
                      <div className="farmer-search-box-wrapper">
                        <Search size={16} className="farmer-search-icon" />
                        <input
                          type="search"
                          className="farmer-search-input"
                          placeholder="Search by Name, Telugu name, Mobile Number, Village..."
                          value={farmerSearch}
                          onChange={e => setFarmerSearch(e.target.value)}
                        />
                        <div className="farmer-search-actions">
                          {farmerSearch && (
                            <button
                              type="button"
                              onClick={() => setFarmerSearch('')}
                              className="search-clear-btn"
                              title="Clear search"
                            >
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick Village Filter Chips */}
                      {availableFarmerVillages.length > 0 && (
                        <div className="village-filter-row">
                          <button
                            type="button"
                            className={`village-chip-btn ${farmerVillageFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setFarmerVillageFilter('all')}
                          >
                            📍 All Villages ({farmers.length})
                          </button>
                          {availableFarmerVillages.map(vil => {
                            const count = farmers.filter(f => f.village === vil).length;
                            return (
                              <button
                                key={vil}
                                type="button"
                                className={`village-chip-btn ${farmerVillageFilter.toLowerCase() === vil.toLowerCase() ? 'active' : ''}`}
                                onClick={() => setFarmerVillageFilter(prev => prev.toLowerCase() === vil.toLowerCase() ? 'all' : vil)}
                              >
                                {vil} ({count})
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Search Hint */}
                      <div className="search-hint-text">
                        <Sparkles size={12} style={{ color: 'var(--color-amber)' }} />
                        <span>Filter instantly by typing query or selecting village chips above</span>
                      </div>

                      {/* Paginated Farmers List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minHeight: '210px' }}>
                        {paginatedFarmers.length > 0 ? (
                          paginatedFarmers.map(f => {
                            const isSelected = selectedFarmer?.id === f.id;
                            const initials = f.name
                              ? f.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
                              : 'FM';
                            return (
                              <div
                                key={f.id}
                                className={`farmer-item-card ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                  setSelectedFarmer(f);
                                  setFarmerQuery(f.activeQuery || '');
                                }}
                              >
                                <div className="farmer-avatar-circle">
                                  {initials}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                                      {f.name}
                                    </span>
                                    {f.telugu && (
                                      <span style={{ fontFamily: 'var(--font-telugu)', fontSize: '12px', color: 'var(--color-forest)' }}>
                                        ({f.telugu})
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span>📍 {f.village}, {f.district}</span>
                                    <span>📱 +91 {f.phone}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                                    <span className="badge badge-sky" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                      🌾 {f.landHolding}
                                    </span>
                                    <span className="badge badge-green" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                      ✓ {f.subsidyCategory?.split('(')[0]?.trim()}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  {isSelected ? (
                                    <CheckCircle size={20} className="text-forest" />
                                  ) : (
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--color-border)' }} />
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ textAlign: 'center', padding: 'var(--space-6) var(--space-3)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: '0 0 var(--space-3) 0' }}>
                              No farmers found matching {farmerSearch ? `"${farmerSearch}"` : ''} {farmerVillageFilter !== 'all' ? `in village "${farmerVillageFilter}"` : ''}.
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
                              {(farmerSearch || farmerVillageFilter !== 'all') && (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => {
                                    setFarmerSearch('');
                                    setFarmerVillageFilter('all');
                                  }}
                                >
                                  Reset Filters
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setNewFarmerForm(prev => ({
                                    ...prev,
                                    name: farmerSearch || prev.name,
                                    villageName: farmerVillageFilter !== 'all' ? farmerVillageFilter : prev.villageName
                                  }));
                                  setShowAddFarmerModal(true);
                                }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                <UserPlus size={14} /> + Register New Farmer Now
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pagination Controls */}
                      {filteredFarmers.length > 0 && (
                        <div className="farmer-pagination">
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            Showing {(farmerPage - 1) * farmersPerPage + 1} - {Math.min(farmerPage * farmersPerPage, filteredFarmers.length)} of {filteredFarmers.length}
                          </span>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <button
                              className="page-btn"
                              disabled={farmerPage === 1}
                              onClick={() => setFarmerPage(p => Math.max(1, p - 1))}
                              title="Previous Page"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: totalFarmerPages }, (_, i) => i + 1).map(p => (
                              <button
                                key={p}
                                className={`page-btn ${farmerPage === p ? 'active' : ''}`}
                                onClick={() => setFarmerPage(p)}
                              >
                                {p}
                              </button>
                            ))}
                            <button
                              className="page-btn"
                              disabled={farmerPage === totalFarmerPages}
                              onClick={() => setFarmerPage(p => Math.min(totalFarmerPages, p + 1))}
                              title="Next Page"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Farmer Query Box & Facilitator Log */}
                    <div className="card" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                        <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
                          Farmer's Requirement / Walk-in Query:
                        </label>
                        <div className="facilitator-badge-tag">
                          👨‍💼 Recording Desk: <strong>{user?.name || 'Kishan Goud (Lead)'}</strong>
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <textarea
                          className="input-field"
                          rows={3}
                          value={farmerQuery}
                          onChange={e => setFarmerQuery(e.target.value)}
                          placeholder="Enter farmer query, e.g. looking for tractor for land preparation or paddy harvester rental..."
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          Farmer: <strong>{selectedFarmer?.name}</strong> ({selectedFarmer?.village})
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleSaveFarmerQuery()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                          title="Save this query to the CLIC Facilitator Log immediately"
                        >
                          <Save size={13} /> 💾 Save Query to CLIC Log
                        </button>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                          Suggested Machinery Queries:
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {[
                            'Need tractor for deep summer ploughing',
                            'Looking for paddy transplanter 4-row rental',
                            'Inquiring about 50 HP John Deere purchase with SMAM subsidy',
                            'Need drone pesticide sprayer for cotton crop',
                            'Looking for laser leveler to save irrigation water'
                          ].map((q, i) => (
                            <button
                              key={i}
                              className="badge badge-sky"
                              style={{ cursor: 'pointer', border: 'none', textAlign: 'left', fontSize: '11px' }}
                              onClick={() => setFarmerQuery(q)}
                            >
                              + {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Past Recorded Queries for This Farmer */}
                      {selectedFarmer && (() => {
                        const farmerPastQueries = farmerQueries.filter(q => q.farmerId === selectedFarmer.id || q.farmerName?.toLowerCase() === selectedFarmer.name?.toLowerCase());
                        return (
                          <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px dashed var(--color-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <History size={15} className="text-forest" />
                                <span>Past Queries Logged for {selectedFarmer.name} ({farmerPastQueries.length}):</span>
                              </span>
                              <span className="badge badge-sky" style={{ fontSize: '10px' }}>
                                {farmerPastQueries.length} Historical Record{farmerPastQueries.length === 1 ? '' : 's'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' }}>
                              {farmerPastQueries.length > 0 ? (
                                farmerPastQueries.map(q => (
                                  <div
                                    key={q.id}
                                    className="query-log-item"
                                    style={{
                                      background: 'var(--color-bg-card)',
                                      border: '1px solid var(--color-border)',
                                      borderLeft: '4px solid var(--color-sky)',
                                      borderRadius: 'var(--radius-md)',
                                      padding: '10px 12px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '6px',
                                      boxShadow: 'var(--shadow-xs)'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                        <span className="font-mono text-sky" style={{ fontWeight: 'bold', fontSize: '11px' }}>
                                          {q.id}
                                        </span>
                                        <span className={`badge ${q.status?.includes('Order') || q.status === 'Fulfilled' || q.status === 'Service Completed' ? 'badge-green' : q.status === 'In Progress' ? 'badge-amber' : 'badge-sky'}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                                          {q.status}
                                        </span>
                                        {q.theme && (
                                          <span className="badge badge-forest" style={{ fontSize: '10px', padding: '1px 5px' }}>
                                            {q.theme}
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setFarmerQuery(q.query)}
                                        style={{ padding: '2px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                        title="Copy this query into current walk-in box"
                                      >
                                        ⚡ Load to Desk
                                      </button>
                                    </div>

                                    <div style={{ color: 'var(--color-text-primary)', fontSize: '12px', fontWeight: '500', lineHeight: 1.4 }}>
                                      "{q.query}"
                                    </div>

                                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '4px' }}>
                                      <span style={{ color: 'var(--color-forest)', fontWeight: '500' }}>
                                        👨‍💼 Recorded by: <strong>{q.facilitatorName || 'CLIC Facilitator'}</strong>
                                      </span>
                                      <span>🕒 {q.timestamp}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '10px', textAlign: 'center', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)' }}>
                                  No previous queries recorded for this farmer.
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Retrieve Farmer's Data ── */}
              {activeStepIndex === 1 && (
                <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div className="badge badge-sky" style={{ marginBottom: 'var(--space-1)' }}>Step 2 · Data Verification</div>
                      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Retrieve & Verify Farmer's Profile</h2>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                        Farmer data retrieved from CLIC village registry for subsidy & rental eligibility check.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-secondary" onClick={() => setActiveStepIndex(0)}>
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button className="btn btn-primary" onClick={() => setActiveStepIndex(2)}>
                        Identify Theme in CLIC <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Farmer Profile Card */}
                  <div className="card" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(5, 150, 105, 0.03))', border: '1px solid var(--color-forest-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', boxShadow: 'var(--shadow-sm)' }}>
                          👨‍🌾
                        </div>
                        <div>
                          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
                            {selectedFarmer.name} <span style={{ fontFamily: 'var(--font-telugu)', color: 'var(--color-forest)' }}>({selectedFarmer.telugu})</span>
                          </h3>
                          <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                            📍 {selectedFarmer.village}, District {selectedFarmer.district}, {selectedFarmer.state || 'Telangana'} · 📱 +91 {selectedFarmer.phone}
                          </p>
                          <div className="badge badge-green" style={{ marginTop: '4px' }}>
                            ✓ {selectedFarmer.subsidyCategory}
                          </div>
                        </div>
                      </div>

                      <div style={{ background: '#fff', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', minWidth: 220 }}>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Registered Phone</div>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>📱 +91 {selectedFarmer.phone}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 4 }}>Bank Account (for Subsidy DBTs)</div>
                        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>🏦 {selectedFarmer.bankAccount}</div>
                      </div>
                    </div>

                    <div className="divider" style={{ margin: 'var(--space-4) 0' }} />

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                      <div className="card" style={{ background: '#fff', padding: '10px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Land Holding</span>
                        <h4 style={{ color: 'var(--color-forest)', fontWeight: 'bold' }}>{selectedFarmer.landHolding}</h4>
                      </div>
                      <div className="card" style={{ background: '#fff', padding: '10px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Soil Type</span>
                        <h4 style={{ fontWeight: 'bold' }}>{selectedFarmer.soilType}</h4>
                      </div>
                      <div className="card" style={{ background: '#fff', padding: '10px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Main Crops Cultivated</span>
                        <h4 style={{ fontWeight: 'bold' }}>{Array.isArray(selectedFarmer.crops) ? selectedFarmer.crops.join(', ') : selectedFarmer.crops}</h4>
                      </div>
                      <div className="card" style={{ background: '#fff', padding: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Active Logged Query</span>
                          <span className="facilitator-badge-tag" style={{ fontSize: '10px' }}>
                            👨‍💼 {user?.name || 'Kishan (Lead)'}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-forest-dark)', margin: '4px 0 0 0', fontWeight: '500' }}>
                          {farmerQuery}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Identify Theme & Menu Board ── */}
              {activeStepIndex === 2 && (
                <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div className="badge badge-sky" style={{ marginBottom: 'var(--space-1)' }}>Step 3 · Menu Board</div>
                      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Identify the Theme / Module in CLIC</h2>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                        Click on the identified theme on the CLIC Menu Board to load the operations & machinery workspace.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className="btn btn-secondary" onClick={() => setActiveStepIndex(1)}>
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button className="btn btn-primary" onClick={() => setActiveStepIndex(3)}>
                        Open Farm Machinery Catalog <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Theme Menu Board */}
                  <div className="menu-board-grid">
                    {[
                      { id: 'Farm Machinery', icon: '🚜', title: 'Farm Machinery', telugu: 'వ్యవసాయ యంత్రాలు', desc: 'Equipment Hire (CHC), Purchase, & Implements', active: true },
                      { id: 'Crop Advisory', icon: '🌾', title: 'Crop Advisory', telugu: 'పంట సలహాలు', desc: 'Package of practices & pest diagnostics', active: false },
                      { id: 'Groundwater', icon: '💧', title: 'Groundwater', telugu: 'భూగర్భ జలాలు', desc: 'Water table registers & borehole metrics', active: false },
                      { id: 'Govt Schemes', icon: '🏢', title: 'Govt Schemes', telugu: 'ప్రభుత్వ పథకాలు', desc: 'Subsidies, PMFBY, Rythu Bandhu & SMAM', active: false },
                      { id: 'Weather', icon: '🌦️', title: 'Weather Services', telugu: 'వాతావరణ సేవలు', desc: 'Agro-met advisories & rainfall data', active: false },
                      { id: 'Market Prices', icon: '🛒', title: 'Market Prices', telugu: 'మార్కెట్ ధరలు', desc: 'Live APMC & village commodity rates', active: false }
                    ].map(th => (
                      <div
                        key={th.id}
                        className={`theme-card ${activeTheme === th.id ? 'active-theme' : ''}`}
                        onClick={() => {
                          setActiveTheme(th.id);
                          if (th.id === 'Farm Machinery') {
                            setActiveStepIndex(3);
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <div className="theme-icon-box">{th.icon}</div>
                          {th.active && <span className="badge badge-green">Identified Theme</span>}
                        </div>
                        <div>
                          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{th.title}</h4>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-telugu)' }}>{th.telugu}</div>
                        </div>
                        <p className="text-secondary" style={{ fontSize: '12px' }}>{th.desc}</p>
                        <button
                          className={`btn ${th.active ? 'btn-primary' : 'btn-secondary'} btn-sm w-full`}
                          style={{ marginTop: 'auto' }}
                        >
                          {th.active ? '✓ Enter Farm Machinery' : 'Explore'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── STEP 4: Retrieve Info & Operations (Video / Picture / Text) ── */}
              {activeStepIndex === 3 && (
                <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div className="badge badge-sky" style={{ marginBottom: 'var(--space-1)' }}>Step 4 · Retrieve Info & Operations</div>
                      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Display Operations & Available Machinery</h2>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                        Directly linked to <strong>{chcHubs.length} CHC Hubs</strong> and <strong>{fmcShops.length} FMC Dealerships</strong> with real-time fleet availability & subsidized purchase rates.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowUploadMachineModal(true)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', borderColor: 'var(--color-forest)', color: 'var(--color-forest)' }}
                      >
                        <UploadCloud size={16} /> + Upload Equipment (CHC/FMC Link)
                      </button>
                      <button className="btn btn-secondary" onClick={() => setActiveStepIndex(2)}>
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          if (selectedMachine) setActiveStepIndex(4);
                          else alert('Please select a farm machine first.');
                        }}
                      >
                        Proceed to Select Choice <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* 1. Display All Operations */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)', display: 'block', margin: 0 }}>
                        🚜 1. Display All Operations (Farmer Chooses Type of Operation):
                      </label>
                      <span className="badge badge-forest" style={{ fontSize: '11px' }}>
                        {machines.length} Total Registered Implements
                      </span>
                    </div>
                    <div className="operations-grid">
                      <div
                        className={`op-card-btn ${selectedOperation === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedOperation('all')}
                      >
                        <div className="op-card-icon">⚡</div>
                        <div className="op-card-title">All Operations</div>
                        <div className="op-card-telugu">అన్ని రకాల పనులు ({machines.length} Machines)</div>
                      </div>
                      {MACHINERY_OPERATIONS.map(op => {
                        const count = machines.filter(m => m.operationId === op.id).length;
                        return (
                          <div
                            key={op.id}
                            className={`op-card-btn ${selectedOperation === op.id ? 'active' : ''}`}
                            onClick={() => setSelectedOperation(op.id)}
                          >
                            <div className="op-card-icon">{op.icon}</div>
                            <div className="op-card-title">{op.name}</div>
                            <div className="op-card-telugu">{op.telugu} ({count})</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Retrieve & Display All Available Machines List */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div>
                        <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
                          📋 2. Available Machines & Implements ({filteredMachines.length} Found):
                        </label>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="search-box" style={{ minWidth: 260 }}>
                          <Search size={16} className="sb-icon" />
                          <input
                            type="search"
                            className="input-field"
                            placeholder="Search name, brand, Telugu, specs..."
                            value={searchMachine}
                            onChange={e => setSearchMachine(e.target.value)}
                            style={{ paddingLeft: 36 }}
                          />
                        </div>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setShowUploadMachineModal(true)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                          <Plus size={13} /> Add Machine
                        </button>
                      </div>
                    </div>

                    <div className="machinery-grid">
                      {filteredMachines.map(mach => {
                        const isSelected = selectedMachine?.id === mach.id;
                        const avail = mach.chcAvailability?.available ?? 0;
                        const total = mach.chcAvailability?.total ?? 0;
                        const availClass = avail > 1 ? 'in-stock' : avail === 1 ? 'low-stock' : 'out-of-stock';

                        return (
                          <div
                            key={mach.id}
                            className={`machine-card ${isSelected ? 'border-forest' : ''}`}
                            style={{ outline: isSelected ? '2px solid var(--color-forest)' : 'none' }}
                          >
                            <div className="machine-thumb-wrap">
                              <img src={mach.thumbnail} alt={mach.name} className="machine-thumb-img" />
                              <span className="machine-badge-op">{mach.operationName}</span>
                              <span className={`machine-badge-avail ${availClass}`}>
                                {avail > 0 ? `🟢 ${avail} / ${total} Available` : '🔴 Busy / Out on Rent'}
                              </span>
                            </div>

                            <div className="machine-card-body">
                              <div>
                                <div className="machine-title">{mach.name}</div>
                                <div className="machine-telugu">{mach.telugu}</div>
                              </div>

                              {/* Linked CHC Hub & FMC Dealer tags */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'var(--color-bg-elevated)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '11px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                                  <span style={{ color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <MapPin size={11} className="text-sky" /> <strong>CHC Hub:</strong>
                                  </span>
                                  <span style={{ fontWeight: '500', color: 'var(--color-sky-dark)' }}>
                                    {mach.chcAvailability?.chcHub || 'Central CHC'}
                                  </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                                  <span style={{ color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <Building2 size={11} className="text-forest" /> <strong>FMC Dealer:</strong>
                                  </span>
                                  <span style={{ fontWeight: '500', color: 'var(--color-forest-dark)' }}>
                                    {mach.purchaseInfo?.dealers?.[0]?.name || 'Authorized FMC'}
                                  </span>
                                </div>
                              </div>

                              <div className="machine-specs-pills">
                                <span className="spec-pill">⚡ {mach.powerHP}</span>
                                <span className="spec-pill">⛽ {mach.fuelType}</span>
                                <span className="spec-pill">⏱️ {mach.capacity}</span>
                              </div>

                              <p className="text-secondary" style={{ fontSize: '12px', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {mach.description}
                              </p>

                              <div className="machine-pricing-row">
                                <div className="m-price-box">
                                  <span className="m-price-label">CHC Rental</span>
                                  <span className="m-price-val">₹{mach.chcAvailability?.rateHourly}/hr</span>
                                </div>
                                <div className="m-price-box">
                                  <span className="m-price-label">Purchase (Subsidy)</span>
                                  <span className="m-price-val">₹{mach.purchaseInfo?.effectivePrice?.toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Detail click triggers: Video, Picture, Text, & Quick Edit */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '6px 2px', fontSize: '11px', justifyContent: 'center' }}
                                  onClick={() => handleOpenDetails(mach, 'video')}
                                  title="Play video demonstration"
                                >
                                  <Play size={12} className="text-alert" /> Video
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '6px 2px', fontSize: '11px', justifyContent: 'center' }}
                                  onClick={() => handleOpenDetails(mach, 'picture')}
                                  title="View photo gallery"
                                >
                                  <Image size={12} className="text-sky" /> Photos
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '6px 2px', fontSize: '11px', justifyContent: 'center' }}
                                  onClick={() => handleOpenDetails(mach, 'text')}
                                  title="View technical specifications"
                                >
                                  <FileText size={12} className="text-forest" /> Specs
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '6px 2px', fontSize: '11px', justifyContent: 'center', color: 'var(--color-amber)' }}
                                  onClick={() => setQuickEditMachine({ ...mach })}
                                  title="Edit availability and rates"
                                >
                                  <Settings size={12} /> Edit
                                </button>
                              </div>

                              <div className="machine-actions-row">
                                <button
                                  type="button"
                                  className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} w-full`}
                                  onClick={() => {
                                    setSelectedMachine(mach);
                                    setActiveStepIndex(4);
                                  }}
                                >
                                  {isSelected ? '✓ Selected Equipment' : 'Select this Equipment'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 5: Farmer Selects Equipment & Chooses Purchase OR Rental ── */}
              {activeStepIndex === 4 && (
                <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div>
                      <div className="badge badge-sky" style={{ marginBottom: 'var(--space-1)' }}>Step 5 · Selection & Choice</div>
                      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Farmer Selects Action: Purchase or Rental</h2>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                        Selected Equipment: <strong>{selectedMachine?.name}</strong>
                      </p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setActiveStepIndex(3)}>
                      <ArrowLeft size={16} /> Change Equipment
                    </button>
                  </div>

                  {/* Selected Equipment Snapshot Card */}
                  <div className="card" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <img
                      src={selectedMachine?.thumbnail}
                      alt={selectedMachine?.name}
                      style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{selectedMachine?.name}</h3>
                      <div style={{ fontSize: '12px', color: 'var(--color-forest)', fontFamily: 'var(--font-telugu)' }}>{selectedMachine?.telugu}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        Category: {selectedMachine?.category} · Power: {selectedMachine?.powerHP} · Capacity: {selectedMachine?.capacity}
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenDetails(selectedMachine, 'text')}
                    >
                      <Info size={14} /> Full Specs
                    </button>
                  </div>

                  {/* Two Branches: Purchase vs Rental */}
                  <div className="choice-container">
                    {/* Branch A: Purchase */}
                    <div
                      className={`choice-card purchase-card ${actionChoice === 'purchase' ? 'active' : ''}`}
                      onClick={() => setActionChoice('purchase')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-forest)' }}>
                          <ShoppingCart size={24} />
                        </div>
                        <span className="badge badge-sky">Govt Subsidy: {selectedMachine?.purchaseInfo.subsidyPercent}%</span>
                      </div>

                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Option A: Purchase Machinery</h3>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                        Link to FM Shop inventory with dealer stocks, prices & SMAM/PM-KUSUM subsidy schemes.
                      </p>

                      <div style={{ background: 'var(--color-bg-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                          <span>MSRP Retail Price:</span>
                          <span>₹{selectedMachine?.purchaseInfo.msrp.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-mint)', fontWeight: 'bold' }}>
                          <span>Govt Subsidy Amount:</span>
                          <span>- ₹{selectedMachine?.purchaseInfo.subsidyAmount.toLocaleString()}</span>
                        </div>
                        <div className="divider" style={{ margin: '6px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--color-forest)', fontSize: '14px' }}>
                          <span>Net Farmer Price:</span>
                          <span>₹{selectedMachine?.purchaseInfo.effectivePrice.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        className={`btn ${actionChoice === 'purchase' ? 'btn-primary' : 'btn-secondary'} w-full`}
                        style={{ marginTop: 'auto' }}
                      >
                        {actionChoice === 'purchase' ? '✓ Selected for Purchase' : 'Choose Purchase'}
                      </button>
                    </div>

                    {/* Branch B: Rental */}
                    <div
                      className={`choice-card rental-card ${actionChoice === 'rental' ? 'active' : ''}`}
                      onClick={() => setActionChoice('rental')}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-mint)' }}>
                          <Tractor size={24} />
                        </div>
                        <span className="badge badge-green">Subsidized Custom Hiring</span>
                      </div>

                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Option B: Rental (Hire from CHC)</h3>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                        Link to Custom Hiring Center (CHC) with instant availability, slot booking & operator support.
                      </p>

                      <div style={{ background: 'var(--color-bg-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="text-muted">Hourly Hire Rate:</span>
                          <span className="font-bold">₹{selectedMachine?.chcAvailability.rateHourly}/hr</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="text-muted">Daily Hire Rate:</span>
                          <span className="font-bold">₹{selectedMachine?.chcAvailability.rateDaily}/day</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="text-muted">Per Acre Rate:</span>
                          <span className="font-bold">₹{selectedMachine?.chcAvailability.ratePerAcre}/acre</span>
                        </div>
                        <div className="divider" style={{ margin: '6px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-mint)', fontWeight: 'bold' }}>
                          <span>CHC Fleet Availability:</span>
                          <span>{selectedMachine?.chcAvailability.available} units available</span>
                        </div>
                      </div>

                      <button
                        className={`btn ${actionChoice === 'rental' ? 'btn-primary' : 'btn-secondary'} w-full`}
                        style={{ marginTop: 'auto' }}
                      >
                        {actionChoice === 'rental' ? '✓ Selected for Rental' : 'Choose Rental'}
                      </button>
                    </div>
                  </div>

                  {/* ── Dynamic Form Based on Choice ── */}
                  {actionChoice === 'purchase' && (
                    <div className="card border-forest animate-fade-in" style={{ background: 'rgba(37, 99, 235, 0.02)' }}>
                      <div className="section-title">
                        <Building2 size={20} className="text-forest" />
                        <span>Purchase: Link to FM Shop (Inventory with Prices)</span>
                      </div>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
                        Select authorized machinery dealership and configure payment/subsidy mode before closing the order.
                      </p>

                      <div className="form-grid">
                        <div className="form-group">
                          <label>Select FM Shop / Authorized Dealer *</label>
                          <select
                            className="input-field select-field"
                            value={selectedDealer?.name || fmcShops[0]?.name}
                            onChange={e => {
                              const found = selectedMachine.purchaseInfo.dealers.find(d => d.name === e.target.value) ||
                                            fmcShops.find(s => s.name === e.target.value);
                              if (found) setSelectedDealer(found);
                            }}
                          >
                            {selectedMachine.purchaseInfo.dealers.map(d => (
                              <option key={d.name} value={d.name}>
                                {d.name} ({d.city}) · Stock: {d.stock} units · Contact: {d.contact}
                              </option>
                            ))}
                            {fmcShops.map(s => (
                              <option key={s.id} value={s.name}>
                                🏪 {s.name} ({s.city}) · Authorized Partner · Contact: {s.phone}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Payment & Financing Option *</label>
                          <select
                            className="input-field select-field"
                            value={purchasePaymentMode}
                            onChange={e => setPurchasePaymentMode(e.target.value)}
                          >
                            <option>Kisan Credit Card (KCC) + 40% Subsidy</option>
                            <option>Direct Bank Loan (SBI/NABARD Agri Term Loan)</option>
                            <option>Downpayment (20%) + Balance on Delivery</option>
                            <option>Full Cash / Cheque Payment with DBT Subsidy</option>
                          </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                          <label>Delivery Address & Implements Note</label>
                          <input
                            className="input-field"
                            value={purchaseNotes}
                            onChange={e => setPurchaseNotes(e.target.value)}
                            placeholder={`Delivery to ${selectedFarmer.village}, Nalgonda. Additional implements requested (e.g. trailer hitch, plough)...`}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                        <div>
                          <span className="text-muted" style={{ fontSize: '11px' }}>Net Farmer Payable: </span>
                          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-forest)' }}>
                            ₹{selectedMachine.purchaseInfo.effectivePrice.toLocaleString()}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={handleClosePurchaseOrder}
                        >
                          <CheckCircle size={18} /> Close Purchase Order (Alert FM Shop & Farmer)
                        </button>
                      </div>
                    </div>
                  )}

                  {actionChoice === 'rental' && (
                    <div className="card border-mint animate-fade-in" style={{ background: 'rgba(5, 150, 105, 0.02)' }}>
                      <div className="section-title">
                        <Tractor size={20} className="text-mint" />
                        <span>Rent: Link to CHC (Availability & Rental Price)</span>
                      </div>
                      <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
                        Book machinery slot at local Custom Hiring Center with verified operator support and refundable deposit.
                      </p>

                      <div className="form-grid">
                        <div className="form-group">
                          <label>Assigned CHC Hub Point</label>
                          <select
                            className="input-field select-field"
                            defaultValue={chcHubs[0]?.name || selectedMachine.chcAvailability.chcHub}
                          >
                            {chcHubs.map(h => (
                              <option key={h.id} value={h.name}>
                                🚜 {h.name} ({h.village}) · Supervisor: {hubSupervisor(h)}
                              </option>
                            ))}
                            <option value={selectedMachine.chcAvailability.chcHub}>
                              {selectedMachine.chcAvailability.chcHub} (Available: {selectedMachine.chcAvailability.available} units)
                            </option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Rental Duration Type *</label>
                          <select
                            className="input-field select-field"
                            value={rentalDurationType}
                            onChange={e => setRentalDurationType(e.target.value)}
                          >
                            <option value="days">Daily (₹{selectedMachine.chcAvailability.rateDaily}/day)</option>
                            <option value="hours">Hourly (₹{selectedMachine.chcAvailability.rateHourly}/hr)</option>
                            <option value="acres">Per Acre Field Rate (₹{selectedMachine.chcAvailability.ratePerAcre}/acre)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Duration / Units Quantity *</label>
                          <input
                            type="number"
                            className="input-field"
                            min={1}
                            max={30}
                            value={rentalUnits}
                            onChange={e => setRentalUnits(+e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>Start Date Required *</label>
                          <input
                            type="date"
                            className="input-field"
                            min={new Date().toISOString().split('T')[0]}
                            value={rentalStartDate}
                            onChange={e => setRentalStartDate(e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <input
                            type="checkbox"
                            id="opCheck"
                            checked={includeOperator}
                            onChange={e => setIncludeOperator(e.target.checked)}
                            style={{ width: 18, height: 18 }}
                          />
                          <label htmlFor="opCheck" style={{ cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                            Include Trained CHC Operator / Driver (+₹{selectedMachine.chcAvailability.operatorRateExtra}/hr or included)
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                        <div>
                          <div className="text-muted" style={{ fontSize: '11px' }}>
                            Refundable Deposit: ₹{selectedMachine.chcAvailability.deposit}
                          </div>
                          <div style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--color-mint)' }}>
                            Estimated Total: ₹
                            {(
                              (rentalDurationType === 'hours'
                                ? selectedMachine.chcAvailability.rateHourly * rentalUnits
                                : rentalDurationType === 'days'
                                ? selectedMachine.chcAvailability.rateDaily * rentalUnits
                                : selectedMachine.chcAvailability.ratePerAcre * rentalUnits)
                            ).toLocaleString()}
                          </div>
                        </div>
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={handleCloseRentalBooking}
                        >
                          <CheckCircle size={18} /> Close Rental Booking (Alert CHC & Farmer)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 6: Close & Workflow Alerts (Alert to FM Shop / CHC, Alert to Farmer, Alert Back) ── */}
              {activeStepIndex === 5 && (() => {
                const displayOrder = lastDispatchedOrder || orders[0] || null;

                return (
                  <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      <div>
                        <div className="badge badge-green" style={{ marginBottom: 'var(--space-1)' }}>Step 6 · Workflow Alerts & Confirmation</div>
                        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Order Closed & Workflow Alerts Dispatched</h2>
                        <p className="text-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                          Automated 3-phase dispatch: (1) Work Order to Provider → (2) Booking Confirmation to Farmer → (3) Bi-directional Feedback loop.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary" onClick={() => setActiveStepIndex(0)}>
                          <RefreshCw size={14} /> Start New Walk-in (Step 1)
                        </button>
                        <button className="btn btn-primary" onClick={() => handleTabChange('orders')}>
                          View All Orders <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Order Selection Switcher Bar */}
                    {orders.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-bg-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                          <FileCheck size={16} className="text-forest" />
                          <span style={{ fontWeight: 'bold' }}>Inspecting Alert Dispatch for:</span>
                          <select
                            className="input-field"
                            style={{ padding: '4px 8px', fontSize: '12px', width: 'auto', minWidth: '220px' }}
                            value={displayOrder?.id || ''}
                            onChange={e => {
                              const ord = orders.find(o => o.id === e.target.value);
                              if (ord) setLastDispatchedOrder(ord);
                            }}
                          >
                            {orders.map(o => (
                              <option key={o.id} value={o.id}>
                                {o.id} · {o.machineName} ({o.farmerName} - {o.type.toUpperCase()})
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="badge badge-sky" style={{ fontSize: '11px' }}>
                          {displayOrder?.id === lastDispatchedOrder?.id ? '⚡ Live Session Order' : '📁 Registry Order'}
                        </span>
                      </div>
                    )}

                    {displayOrder ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                        {/* Summary & Live Alert Status */}
                        <div className="card" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="badge badge-sky">Order ID: {displayOrder.id}</span>
                            <span className="badge badge-green">✓ Closed Successfully</span>
                          </div>

                          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{displayOrder.machineName}</h3>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            <strong>Farmer:</strong> {displayOrder.farmerName} (📱 {displayOrder.farmerPhone}) · 📍 {displayOrder.village}
                          </div>

                          <div style={{ background: '#fff', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            {displayOrder.type === 'purchase' ? (
                              <>
                                <div style={{ fontSize: '12px' }}><strong>FM Shop:</strong> {displayOrder.dealer}</div>
                                <div style={{ fontSize: '12px' }}><strong>Payment:</strong> {displayOrder.paymentMode}</div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-forest)', marginTop: 4 }}>
                                  Net Amount: ₹{displayOrder.netPayable?.toLocaleString()}
                                </div>
                              </>
                            ) : (
                              <>
                                <div style={{ fontSize: '12px' }}><strong>CHC Hub:</strong> {displayOrder.chcHub}</div>
                                <div style={{ fontSize: '12px' }}><strong>Duration:</strong> {displayOrder.rentalUnits} (from {displayOrder.startDate})</div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-mint)', marginTop: 4 }}>
                                  Estimated Hire: ₹{displayOrder.totalEstimated?.toLocaleString()}
                                </div>
                              </>
                            )}
                          </div>

                          {/* Timeline */}
                          <div>
                            <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-text-muted)' }}>Workflow Dispatch Timeline:</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 4 }}>
                              {displayOrder.timeline?.map((t, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                                  <span style={{ fontWeight: 'bold', color: 'var(--color-forest)' }}>{t.time}</span>
                                  <span>· {t.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Dispatched Alerts Visuals */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                          {/* Alert 1: Alert to FM Shop / CHC */}
                          <div className="card" style={{ borderLeft: '4px solid var(--color-forest)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Send size={16} className="text-forest" />
                                <strong style={{ fontSize: 'var(--text-sm)' }}>
                                  1. Alert to {displayOrder.type === 'purchase' ? 'FM Shop Dealership' : 'CHC Hub Operator'} [Dispatched]
                                </strong>
                              </div>
                              <button
                                onClick={() => handleShareOrder(displayOrder, 'provider')}
                                className="btn btn-secondary btn-sm"
                                style={{ fontWeight: 'bold', fontSize: '11px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-sm)' }}
                              >
                                <Share2 size={13} className="text-forest" /> Share Work Order
                              </button>
                            </div>
                            <div className="sms-preview-card">
                              🔔 <strong>CLIC WORK ORDER ALERT:</strong><br />
                              {displayOrder.type === 'purchase' ? (
                                <>
                                  New Purchase Request: {displayOrder.machineName}<br />
                                  Buyer: {displayOrder.farmerName} ({displayOrder.village})<br />
                                  Contact: {displayOrder.farmerPhone}<br />
                                  Payment Mode: {displayOrder.paymentMode}<br />
                                  Ref: {displayOrder.id}
                                </>
                              ) : (
                                <>
                                  New CHC Rental Booking: {displayOrder.machineName}<br />
                                  Farmer: {displayOrder.farmerName} ({displayOrder.village})<br />
                                  Schedule: {displayOrder.startDate} ({displayOrder.rentalUnits})<br />
                                  Contact: {displayOrder.farmerPhone}<br />
                                  Ref: {displayOrder.id}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Alert 2: Alert to Farmer */}
                          <div className="card" style={{ borderLeft: '4px solid var(--color-mint)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Bell size={16} className="text-mint" />
                                <strong style={{ fontSize: 'var(--text-sm)' }}>2. Alert to Farmer [SMS / Push Sent]</strong>
                              </div>
                              <button
                                onClick={() => handleShareOrder(displayOrder, 'farmer')}
                                className="btn btn-secondary btn-sm"
                                style={{ fontWeight: 'bold', fontSize: '11px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: 'var(--radius-sm)' }}
                              >
                                <Share2 size={13} className="text-mint" /> Share Receipt with Farmer
                              </button>
                            </div>
                            <div className="sms-preview-card">
                              📱 <strong>SMS to {displayOrder.farmerPhone}:</strong><br />
                              Dear {displayOrder.farmerName}, your {displayOrder.type === 'purchase' ? 'Machinery Purchase Order' : 'CHC Rental Booking'} for {displayOrder.machineName} is confirmed (Ref: {displayOrder.id}). {displayOrder.type === 'purchase' ? `Dealer: ${displayOrder.dealer}` : `Assigned CHC: ${displayOrder.chcHub}`}. CLIC Helpline: 1800-180-1551.
                            </div>
                          </div>

                          {/* Alert 3: Alert Back from FM Shop / CHC */}
                          <div className="card" style={{ borderLeft: '4px solid var(--color-amber)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={16} className="text-amber" />
                                <strong style={{ fontSize: 'var(--text-sm)' }}>
                                  3. Alert Back from {displayOrder.type === 'purchase' ? 'FM Shop' : 'CHC Hub'}
                                </strong>
                              </div>
                              {!displayOrder.backAlert?.received && (
                                <button
                                  className="btn btn-amber btn-sm"
                                  onClick={() => handleSimulateBackAlert(displayOrder.id)}
                                >
                                  Trigger Back Alert
                                </button>
                              )}
                            </div>

                            {displayOrder.backAlert?.received ? (
                              <div className="sms-preview-card" style={{ background: 'rgba(5, 150, 105, 0.05)', borderColor: 'var(--color-mint)' }}>
                                🟢 <strong>BACK ALERT CONFIRMED:</strong><br />
                                From: {displayOrder.backAlert.from}<br />
                                Status: {displayOrder.backAlert.statusUpdate}<br />
                                Message: {displayOrder.backAlert.message}
                              </div>
                            ) : (
                              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                ⏳ Awaiting confirmation alert back from {displayOrder.type === 'purchase' ? 'FM Shop Dealer' : 'CHC Operator'}. Click button above to simulate incoming response.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                        No orders recorded in system yet. Follow the 5-step guided pipeline to place a rental booking or purchase order.
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* VIEW B: FARMER SELF-SERVICE PORTAL                           */}
          {/* ──────────────────────────────────────────────────────────── */}
          {roleView === 'farmer' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Farmer Welcome & Personal Profile Banner */}
              <div className="card border-mint" style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.06), #fff)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-mint)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                    👨‍🌾
                  </div>
                  <div>
                    <span className="badge badge-green">Farmer Self-Service Kiosk</span>
                    <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                      Namaskaram, {selectedFarmer.name} ({selectedFarmer.telugu})
                    </h2>
                    <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
                      📍 {selectedFarmer.village}, {selectedFarmer.district} · Landholding: <strong>{selectedFarmer.landHolding}</strong> · Crops: {Array.isArray(selectedFarmer.crops) ? selectedFarmer.crops.join(', ') : selectedFarmer.crops}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const next = farmers[(farmers.findIndex(f => f.id === selectedFarmer.id) + 1) % farmers.length];
                      setSelectedFarmer(next);
                      setFarmerQuery(next?.activeQuery || '');
                    }}
                  >
                    Switch Farmer Profile
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleTabChange('orders')}
                  >
                    <Smartphone size={14} /> My Bookings & SMS Alerts ({orders.filter(o => o.farmerId === selectedFarmer.id).length})
                  </button>
                </div>
              </div>

              {/* Direct Machinery Catalog for Farmer */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Browse Machinery by Farm Operation</h3>
                    <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>Select an operation below to view equipment with demonstration videos and subsidized hiring rates.</p>
                  </div>
                  <div className="search-box" style={{ minWidth: 240 }}>
                    <Search size={16} className="sb-icon" />
                    <input
                      type="search"
                      className="input-field"
                      placeholder="Search tractor, harvester, sprayer..."
                      value={searchMachine}
                      onChange={e => setSearchMachine(e.target.value)}
                      style={{ paddingLeft: 36 }}
                    />
                  </div>
                </div>

                {/* Operations Filter */}
                <div className="operations-grid" style={{ marginBottom: 'var(--space-4)' }}>
                  <div
                    className={`op-card-btn ${selectedOperation === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedOperation('all')}
                  >
                    <div className="op-card-icon">⚡</div>
                    <div className="op-card-title">All Operations</div>
                    <div className="op-card-telugu">అన్ని రకాలు</div>
                  </div>
                  {MACHINERY_OPERATIONS.map(op => (
                    <div
                      key={op.id}
                      className={`op-card-btn ${selectedOperation === op.id ? 'active' : ''}`}
                      onClick={() => setSelectedOperation(op.id)}
                    >
                      <div className="op-card-icon">{op.icon}</div>
                      <div className="op-card-title">{op.name}</div>
                      <div className="op-card-telugu">{op.telugu}</div>
                    </div>
                  ))}
                </div>

                {/* Machine Cards */}
                <div className="machinery-grid">
                  {filteredMachines.map(mach => (
                    <div key={mach.id} className="machine-card">
                      <div className="machine-thumb-wrap">
                        <img src={mach.thumbnail} alt={mach.name} className="machine-thumb-img" />
                        <span className="machine-badge-op">{mach.operationName}</span>
                        <span className="machine-badge-avail">
                          {mach.chcAvailability.available} available
                        </span>
                      </div>
                      <div className="machine-card-body">
                        <div>
                          <div className="machine-title">{mach.name}</div>
                          <div className="machine-telugu">{mach.telugu}</div>
                        </div>
                        <div className="machine-pricing-row">
                          <div className="m-price-box">
                            <span className="m-price-label">CHC Hire</span>
                            <span className="m-price-val">₹{mach.chcAvailability.rateHourly}/hr</span>
                          </div>
                          <div className="m-price-box">
                            <span className="m-price-label">Buy with Subsidy</span>
                            <span className="m-price-val">₹{mach.purchaseInfo.effectivePrice.toLocaleString()}</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '6px 2px', justifyContent: 'center' }}
                            onClick={() => handleOpenDetails(mach, 'video')}
                          >
                            <Play size={12} className="text-alert" /> Video
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '6px 2px', justifyContent: 'center' }}
                            onClick={() => handleOpenDetails(mach, 'picture')}
                          >
                            <Image size={12} className="text-sky" /> Photos
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '6px 2px', justifyContent: 'center' }}
                            onClick={() => handleOpenDetails(mach, 'text')}
                          >
                            <FileText size={12} className="text-forest" /> Specs
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '6px 2px', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '3px' }}
                            onClick={() => handleShareMachine(mach)}
                            title={`Share ${mach.name} video & details`}
                          >
                            <Share2 size={12} /> Share
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: 'var(--space-2)' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ justifyContent: 'center' }}
                            onClick={() => {
                              setSelectedMachine(mach);
                              setActionChoice('rental');
                              setRoleView('facilitator');
                              setActiveStepIndex(4);
                            }}
                          >
                            🚜 Book CHC
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ justifyContent: 'center' }}
                            onClick={() => {
                              setSelectedMachine(mach);
                              setActionChoice('purchase');
                              setRoleView('facilitator');
                              setActiveStepIndex(4);
                            }}
                          >
                            🛒 Buy ({mach.purchaseInfo.subsidyPercent}% Sub)
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* VIEW C: CHC OPERATOR DISPATCH & CONFIRMATION DESK            */}
          {/* ──────────────────────────────────────────────────────────── */}
          {roleView === 'chc' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* CHC Header Stats */}
              <div className="card border-sky" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05), #fff)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', background: 'var(--color-sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      🚜
                    </div>
                    <div>
                      <span className="badge badge-sky">Custom Hiring Center Console</span>
                      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '2px 0 0 0' }}>
                        {chcHubs[0]?.name || 'Chandampet Central CHC Hub'} – Operator Dispatch Desk
                      </h2>
                      <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
                        Supervisor: {chcHubs[0]?.inCharge} · Contact: {chcHubs[0]?.phone} · Cluster Villages: {chcHubs[0]?.village}, Munchireddypally
                      </p>
                    </div>
                  </div>
                  <div className="badge badge-green" style={{ fontSize: '12px' }}>
                    🟢 {chcHubs[0]?.fleetCount || 8} Fleet Units Ready in Hub
                  </div>
                </div>
              </div>

              {/* Incoming Rental Queue & Back Alert Action */}
              <div className="card">
                <div className="section-title" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={18} className="text-sky" />
                    <span>Incoming CHC Rental Bookings from CLIC</span>
                  </div>
                  <span className="badge badge-sky">{orders.filter(o => o.type === 'rental').length} Total Rentals</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {orders.filter(o => o.type === 'rental').map(r => (
                    <div key={r.id} className="card" style={{ background: 'var(--color-bg-elevated)', borderLeft: '4px solid var(--color-mint)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="font-mono text-forest" style={{ fontWeight: 'bold' }}>{r.id}</span>
                            <span className="badge badge-green">Rental Request</span>
                            <span className="text-muted" style={{ fontSize: '11px' }}>{r.date}</span>
                          </div>
                          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: '4px' }}>{r.machineName}</h4>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            Farmer: <strong>{r.farmerName}</strong> (📱 {r.farmerPhone}) · 📍 Field Location: {r.village}
                          </div>
                          <div style={{ fontSize: '12px', marginTop: '2px' }}>
                            Schedule: <strong>{r.startDate}</strong> ({r.rentalUnits}) · Estimated Hire: <strong>₹{r.totalEstimated.toLocaleString()}</strong>
                          </div>
                        </div>

                        {/* Operator Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 220 }}>
                          {!r.backAlert?.received ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSimulateBackAlert(r.id, `CHC Operator Ramesh Kumar assigned. Machine prepared & fueled. Scheduled arrival at ${r.village} on ${r.startDate} 07:30 AM.`)}
                            >
                              <Send size={14} /> Send "Alert Back from CHC"
                            </button>
                          ) : (
                            <div className="badge badge-green" style={{ justifyContent: 'center', padding: '6px 10px' }}>
                              ✓ Alert Back Dispatched to Farmer
                            </div>
                          )}
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                            {r.backAlert?.received ? `Confirmed: ${r.backAlert.statusUpdate}` : 'Awaiting Operator Confirmation'}
                          </div>
                        </div>
                      </div>

                      {/* Dispatched Alert Details */}
                      {r.backAlert?.received && (
                        <div className="sms-preview-card" style={{ marginTop: 'var(--space-2)', background: '#fff' }}>
                          🟢 <strong>DISPATCH CONFIRMATION LOGGED:</strong><br />
                          {r.backAlert.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* VIEW D: FM SHOP & DEALERSHIP CONSOLE                         */}
          {/* ──────────────────────────────────────────────────────────── */}
          {roleView === 'fm_shop' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* FM Shop Header */}
              <div className="card border-forest" style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), #fff)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', background: 'var(--color-forest)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      🏪
                    </div>
                    <div>
                      <span className="badge badge-sky">Authorized Machinery Dealership</span>
                      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '2px 0 0 0' }}>
                        {fmcShops[0]?.name || 'Sri Lakshmi Agro Automotives & Dealership'}
                      </h2>
                      <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>
                        In-Charge: {fmcShops[0]?.inCharge} · Phone: {fmcShops[0]?.phone} · GSTIN: {fmcShops[0]?.gstin}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: '12px' }}>
                    SMAM Subsidy Nodal Agency
                  </span>
                </div>
              </div>

              {/* Incoming Purchase Inquiries Queue */}
              <div className="card">
                <div className="section-title" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingCart size={18} className="text-forest" />
                    <span>Incoming Purchase Requests from CLIC Farmers</span>
                  </div>
                  <span className="badge badge-forest">{orders.filter(o => o.type === 'purchase').length} Purchase Orders</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {orders.filter(o => o.type === 'purchase').map(p => (
                    <div key={p.id} className="card" style={{ background: 'var(--color-bg-elevated)', borderLeft: '4px solid var(--color-forest)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="font-mono text-forest" style={{ fontWeight: 'bold' }}>{p.id}</span>
                            <span className="badge badge-sky">Machinery Purchase</span>
                            <span className="text-muted" style={{ fontSize: '11px' }}>{p.date}</span>
                          </div>
                          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginTop: '4px' }}>{p.machineName}</h4>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                            Buyer: <strong>{p.farmerName}</strong> (📱 {p.farmerPhone}) · 📍 Delivery: {p.village}
                          </div>
                          <div style={{ fontSize: '12px', marginTop: '2px' }}>
                            MSRP: ₹{p.msrp?.toLocaleString()} · Subsidy: <strong className="text-mint">-₹{p.subsidyAmount?.toLocaleString()}</strong> · Net: <strong className="text-forest">₹{p.netPayable?.toLocaleString()}</strong>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            Payment Term: {p.paymentMode}
                          </div>
                        </div>

                        {/* Dealer Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 220 }}>
                          {!p.backAlert?.received ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSimulateBackAlert(p.id, `Stock allocated from Nalgonda yard. PDI inspection passed. SMAM subsidy token verified. Delivery scheduled for ${p.farmerName}.`)}
                            >
                              <FileCheck size={14} /> Send "Alert Back from FM Shop"
                            </button>
                          ) : (
                            <div className="badge badge-green" style={{ justifyContent: 'center', padding: '6px 10px' }}>
                              ✓ Alert Back Dispatched to Farmer
                            </div>
                          )}
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                            {p.backAlert?.received ? `Status: ${p.backAlert.statusUpdate}` : 'Awaiting Dealer Allocation'}
                          </div>
                        </div>
                      </div>

                      {/* Dispatched Alert Details */}
                      {p.backAlert?.received && (
                        <div className="sms-preview-card" style={{ marginTop: 'var(--space-2)', background: '#fff' }}>
                          🟢 <strong>DEALER CONFIRMATION LOGGED:</strong><br />
                          {p.backAlert.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/* 3. ORDERS & BOOKINGS LIST TAB                               */}
      {/* ============================================================ */}
      {activeTab === 'orders' && (
        <div className="card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>All Farm Machinery Orders & CHC Bookings</h2>
              <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                Track live status, dispatch stages, and return confirmations across CLIC, CHC & FM Shops.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => { handleTabChange('workflow'); setActiveStepIndex(0); }}>
              + New Walk-in Order
            </button>
          </div>

          <div className="table-responsive">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Type</th>
                  <th>Farmer</th>
                  <th>Machinery</th>
                  <th>Provider (FM Shop / CHC)</th>
                  <th>Status & Stage</th>
                  <th>Share</th>
                  <th>Back Alert Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(ord => (
                  <tr key={ord.id}>
                    <td><strong className="font-mono text-sky">{ord.id}</strong><br /><span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{ord.date}</span></td>
                    <td>
                      <span className={`badge ${ord.type === 'purchase' ? 'badge-sky' : 'badge-green'}`}>
                        {ord.type === 'purchase' ? '🛒 Purchase' : '🚜 CHC Rental'}
                      </span>
                    </td>
                    <td>
                      <strong>{ord.farmerName}</strong><br />
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>📍 {ord.village} (📱 {ord.farmerPhone})</span>
                    </td>
                    <td>
                      <strong>{ord.machineName}</strong><br />
                      <span style={{ fontSize: '11px', color: 'var(--color-forest)' }}>
                        {ord.type === 'purchase' ? `₹${ord.netPayable.toLocaleString()} Net` : `${ord.rentalUnits} · ₹${ord.totalEstimated.toLocaleString()}`}
                      </span>
                    </td>
                    <td style={{ fontSize: '12px' }}>
                      {ord.type === 'purchase' ? ord.dealer : ord.chcHub}
                    </td>
                    <td>
                      <span className={`badge ${ord.backAlert?.received ? 'badge-green' : 'badge-amber'}`}>
                        {ord.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleShareOrder(ord, 'farmer')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        title="Share booking receipt with farmer"
                      >
                        <Share2 size={12} /> Share
                      </button>
                    </td>
                    <td>
                      {!ord.backAlert?.received ? (
                        <button
                          className="btn btn-amber btn-sm"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          onClick={() => handleSimulateBackAlert(ord.id)}
                        >
                          Trigger Back Alert
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--color-mint)', fontWeight: 'bold' }}>
                          ✓ Back Alert Logged
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. ALERTS FEED TAB                                          */}
      {/* ============================================================ */}
      {activeTab === 'alerts' && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Farm Machinery Workflow Alerts Feed</h2>
            <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
              Live audit trail of dispatched notifications and return confirmation alerts across CLIC, CHCs, and FM Shops.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {orders.map(ord => (
              <div key={ord.id} className="card" style={{ borderLeft: ord.type === 'purchase' ? '4px solid var(--color-forest)' : '4px solid var(--color-mint)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-sky">{ord.id}</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{ord.machineName}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => handleShareAlert(ord)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Share2 size={12} /> Share Alert
                    </button>
                    <span className="text-muted" style={{ fontSize: '11px' }}>{ord.date}</span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', marginBottom: 8 }}>
                  Farmer: <strong>{ord.farmerName}</strong> ({ord.village}) · Destination: <strong>{ord.type === 'purchase' ? ord.dealer : ord.chcHub}</strong>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-2)' }}>
                  <div className="sms-preview-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-forest)' }}>Outbound Alert to Provider:</span><br />
                      Dispatched to {ord.type === 'purchase' ? 'FM Shop' : 'CHC Hub'}: Request initialized for {ord.farmerName}. Ref {ord.id}.
                    </div>
                  </div>
                  <div className="sms-preview-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-mint)' }}>Farmer Alert [SMS / Push]:</span><br />
                      SMS sent to {ord.farmerPhone}: Confirmation for {ord.machineName}.
                    </div>
                  </div>
                  <div className="sms-preview-card" style={{ background: ord.backAlert?.received ? 'rgba(5, 150, 105, 0.05)' : '#fff' }}>
                    <span style={{ fontWeight: 'bold', color: ord.backAlert?.received ? 'var(--color-mint)' : 'var(--color-amber)' }}>
                      Back Alert from {ord.type === 'purchase' ? 'FM Shop' : 'CHC'}:
                    </span><br />
                    {ord.backAlert?.received ? ord.backAlert.message : '⏳ Pending confirmation alert back.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. FARMER QUERIES ARCHIVE TAB                                */}
      {/* ============================================================ */}
      {activeTab === 'queries' && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Farmer Walk-in Queries Archive & Facilitator Audit Log</h2>
              <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                Comprehensive searchable repository of farmer equipment requests, inquiries, and the facilitators who logged them.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddFarmerModal(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <UserPlus size={14} /> + Register New Farmer
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { handleTabChange('workflow'); setActiveStepIndex(0); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} /> Record Walk-in Query
              </button>
            </div>
          </div>

          {/* Stats Summary Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
            <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Total Logged Queries</span>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-forest)', margin: '2px 0 0 0' }}>
                {farmerQueries.length}
              </h3>
            </div>
            <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Active / In Progress</span>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-amber)', margin: '2px 0 0 0' }}>
                {farmerQueries.filter(q => q.status === 'In Progress' || q.status === 'Logged').length}
              </h3>
            </div>
            <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Converted to Orders</span>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-mint)', margin: '2px 0 0 0' }}>
                {farmerQueries.filter(q => q.status === 'Converted to Order' || q.status === 'Order Placed').length}
              </h3>
            </div>
            <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Unique Walk-in Farmers</span>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-text-primary)', margin: '2px 0 0 0' }}>
                {new Set(farmerQueries.map(q => q.farmerId || q.farmerName)).size}
              </h3>
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            <div className="search-box" style={{ width: '100%' }}>
              <Search size={16} className="sb-icon" />
              <input
                type="search"
                placeholder="Search farmer, phone, query, facilitator..."
                value={querySearch}
                onChange={e => setQuerySearch(e.target.value)}
              />
              {querySearch && (
                <button
                  onClick={() => setQuerySearch('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <select
                className="input-field select-field"
                value={queryFilterStatus}
                onChange={e => setQueryFilterStatus(e.target.value)}
              >
                <option value="all">All Query Statuses</option>
                <option value="logged">Status: Logged</option>
                <option value="inprogress">Status: In Progress</option>
                <option value="convertedtoorder">Status: Converted to Order</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <select
                className="input-field select-field"
                value={queryFilterFacilitator}
                onChange={e => setQueryFilterFacilitator(e.target.value)}
              >
                <option value="all">All Facilitators</option>
                {uniqueFacilitators.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Queries Table */}
          <div className="table-responsive">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Query Ref & Date</th>
                  <th>Farmer Information</th>
                  <th>Requirement / Query Text</th>
                  <th>Recorded By Facilitator</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.length > 0 ? (
                  filteredQueries.map(q => {
                    const farmerObj = farmers.find(f => f.id === q.farmerId || f.name === q.farmerName);
                    return (
                      <tr key={q.id}>
                        <td>
                          <strong className="font-mono text-sky">{q.id}</strong><br />
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>🕒 {q.timestamp}</span>
                        </td>
                        <td>
                          <strong>{q.farmerName}</strong><br />
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            📍 {q.village}, {q.district} · 📱 {q.farmerPhone}
                          </span>
                        </td>
                        <td style={{ maxWidth: '300px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{q.query}</span>
                          <div style={{ marginTop: '2px' }}>
                            <span className="badge badge-sky" style={{ fontSize: '10px', padding: '1px 5px' }}>{q.theme || 'Farm Machinery'}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                              👨‍💼
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{q.facilitatorName}</div>
                              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{q.facilitatorEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${q.status.includes('Order') ? 'badge-green' : q.status === 'In Progress' ? 'badge-amber' : 'badge-sky'}`}>
                            {q.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '11px', padding: '4px 10px', whiteSpace: 'nowrap' }}
                            onClick={() => {
                              if (farmerObj) setSelectedFarmer(farmerObj);
                              setFarmerQuery(q.query);
                              handleTabChange('workflow');
                              setActiveStepIndex(0);
                            }}
                          >
                            🚀 Open in Desk
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
                      No queries found matching your search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD FARMER MODAL (Mobile Number as Unique Primary Key)       */}
      {/* ============================================================ */}
      {showAddFarmerModal && (
        <div className="details-modal-overlay" onClick={() => setShowAddFarmerModal(false)}>
          <div className="details-modal" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={20} className="text-forest" />
                  <span>Register Walk-in Farmer</span>
                </h3>
                <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', margin: '2px 0 0 0' }}>
                  Enter farmer mobile number. Duplicate numbers are verified in real time.
                </p>
              </div>
              <button
                className="btn-icon"
                onClick={() => setShowAddFarmerModal(false)}
                style={{ padding: '6px', borderRadius: '50%', background: 'var(--color-bg-elevated)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterNewFarmer} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              {/* MOBILE NUMBER SECTION */}
              <div style={{ background: 'rgba(37, 99, 235, 0.04)', border: '1.5px solid var(--color-sky)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-forest-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smartphone size={15} className="text-forest" />
                    <span>Farmer Mobile Number (10 Digits) *</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="Enter 10-digit mobile number, e.g. 9848123456"
                      maxLength={10}
                      value={newFarmerForm.phone}
                      onChange={e => setNewFarmerForm({ ...newFarmerForm, phone: e.target.value.replace(/\D/g, '') })}
                      style={{
                        fontSize: '15px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        borderColor: existingFarmerWithPhone ? '#ef4444' : newFarmerForm.phone.length === 10 ? 'var(--color-mint)' : ''
                      }}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* Real-Time Duplicate Phone Warning & Quick-Select */}
                {existingFarmerWithPhone && (
                  <div className="animate-fade-in" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid #ef4444', borderRadius: 'var(--radius-sm)', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ color: '#b91c1c', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertCircle size={14} /> Mobile Already Registered!
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                        Belongs to: <strong>{existingFarmerWithPhone.name}</strong> ({existingFarmerWithPhone.village}, {existingFarmerWithPhone.district})
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ background: '#b91c1c', borderColor: '#b91c1c', fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => {
                        setSelectedFarmer(existingFarmerWithPhone);
                        setFarmerQuery(existingFarmerWithPhone.activeQuery || '');
                        setShowAddFarmerModal(false);
                        setQueryToast(`✓ Selected existing farmer: ${existingFarmerWithPhone.name} (+91 ${existingFarmerWithPhone.phone})`);
                        setTimeout(() => setQueryToast(null), 3500);
                      }}
                    >
                      👉 Select This Farmer & Proceed
                    </button>
                  </div>
                )}

                {/* Valid New Phone Indicator */}
                {!existingFarmerWithPhone && newFarmerForm.phone.length === 10 && (
                  <div className="animate-fade-in" style={{ fontSize: '11px', color: 'var(--color-mint)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={13} /> ✓ Mobile +91 {newFarmerForm.phone} is unique & ready for new registration!
                  </div>
                )}
              </div>

              <div className="farmer-modal-grid">
                {/* Farmer Name */}
                <div className="form-group">
                  <label>Farmer Name (English) *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Ramesh Reddy"
                    value={newFarmerForm.name}
                    onChange={e => setNewFarmerForm({ ...newFarmerForm, name: e.target.value })}
                    required
                  />
                </div>

                {/* Name in Telugu */}
                <div className="form-group">
                  <label>Name in Telugu (తెలుగులో పేరు)</label>
                  <input
                    className="input-field"
                    placeholder="ఉదా. రమేష్ రెడ్డి"
                    value={newFarmerForm.telugu}
                    onChange={e => setNewFarmerForm({ ...newFarmerForm, telugu: e.target.value })}
                    style={{ fontFamily: 'var(--font-telugu)' }}
                  />
                </div>

                {/* ── CASCADING LOCATION SELECTION ── */}
                {/* 1. State */}
                <div className="form-group">
                  <label>State (రాష్ట్రం) *</label>
                  <select
                    className="input-field select-field"
                    value={newFarmerForm.state}
                    onChange={e => handleStateChangeInFarmerForm(e.target.value)}
                    required
                  >
                    {locationStates.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* 2. District (filtered by state) */}
                <div className="form-group">
                  <label>District (జిల్లా) *</label>
                  <select
                    className="input-field select-field"
                    value={newFarmerForm.districtId}
                    onChange={e => handleDistrictChangeInFarmerForm(e.target.value)}
                    required
                  >
                    {locationDistricts
                      .filter(d => d.state === newFarmerForm.state)
                      .map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                  </select>
                </div>

                {/* 3. Village (filtered by district) */}
                <div className="form-group" style={{ gridColumn: newFarmerForm.isCustomVillage ? 'auto' : 'span 2' }}>
                  <label>Village (గ్రామం) *</label>
                  <select
                    className="input-field select-field"
                    value={newFarmerForm.villageId}
                    onChange={e => handleVillageChangeInFarmerForm(e.target.value)}
                    required
                  >
                    {locationVillages
                      .filter(v => v.districtId === newFarmerForm.districtId)
                      .map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    <option value="__other__">+ Enter Other / New Village...</option>
                  </select>
                </div>

                {/* Custom Village Name if Other selected */}
                {newFarmerForm.isCustomVillage && (
                  <div className="form-group">
                    <label>Enter Village Name *</label>
                    <input
                      className="input-field"
                      placeholder="Type custom village name"
                      value={newFarmerForm.customVillageName}
                      onChange={e => setNewFarmerForm({ ...newFarmerForm, customVillageName: e.target.value })}
                      required
                    />
                  </div>
                )}

                {/* Land Holding */}
                <div className="form-group">
                  <label>Land Holding (acres)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 3.5 acres"
                    value={newFarmerForm.landHolding}
                    onChange={e => setNewFarmerForm({ ...newFarmerForm, landHolding: e.target.value })}
                  />
                </div>

                {/* Soil Type */}
                <div className="form-group">
                  <label>Soil Type</label>
                  <select
                    className="input-field select-field"
                    value={newFarmerForm.soilType}
                    onChange={e => setNewFarmerForm({ ...newFarmerForm, soilType: e.target.value })}
                  >
                    <option value="Red Sandy Loam">Red Sandy Loam</option>
                    <option value="Black Cotton Soil">Black Cotton Soil</option>
                    <option value="Red Loam">Red Loam</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Alluvial Soil">Alluvial Soil</option>
                  </select>
                </div>

                {/* Main Crops */}
                <div className="form-group full-width">
                  <label>Main Crops Cultivated (comma separated)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Paddy, Cotton, Red Gram, Maize"
                    value={newFarmerForm.crops}
                    onChange={e => setNewFarmerForm({ ...newFarmerForm, crops: e.target.value })}
                  />
                </div>

                {/* Subsidy Category */}
                <div className="form-group full-width">
                  <label>Farmer Subsidy Category</label>
                  <select
                    className="input-field select-field"
                    value={newFarmerForm.subsidyCategory}
                    onChange={e => setNewFarmerForm({ ...newFarmerForm, subsidyCategory: e.target.value })}
                  >
                    <option value="Small / Marginal Farmer (SF/MF)">Small / Marginal Farmer (SF/MF) - Standard 40% Subsidy</option>
                    <option value="Women Farmer / SHG (Priority 50% Subsidy)">Women Farmer / SHG (Priority 50% Subsidy)</option>
                    <option value="SC/ST Category (Special 50% Subsidy)">SC/ST Category (Special 50% Subsidy)</option>
                    <option value="General Farmer">General Farmer - 30% Subsidy</option>
                  </select>
                </div>

                {/* Initial Walk-in Query */}
                <div className="form-group full-width">
                  <label>Initial Machinery Requirement / Query (Optional)</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Looking for 4-row paddy transplanter rental for Kharif season"
                    value={newFarmerForm.initialQuery}
                    onChange={e => setNewFarmerForm({ ...newFarmerForm, initialQuery: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                {existingFarmerWithPhone ? (
                  <span style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> ⛔ Mobile is not unique! Duplicate registration blocked.
                  </span>
                ) : newFarmerForm.phone && newFarmerForm.phone.length < 10 ? (
                  <span style={{ fontSize: '11px', color: 'var(--color-amber)', fontWeight: '500' }}>
                    ⚠️ Enter full 10 digits ({newFarmerForm.phone.length}/10 entered)
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    All fields marked * are required.
                  </span>
                )}

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddFarmerModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={Boolean(existingFarmerWithPhone) || newFarmerForm.phone.length !== 10 || !newFarmerForm.name.trim()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      opacity: (existingFarmerWithPhone || newFarmerForm.phone.length !== 10 || !newFarmerForm.name.trim()) ? 0.45 : 1,
                      cursor: (existingFarmerWithPhone || newFarmerForm.phone.length !== 10 || !newFarmerForm.name.trim()) ? 'not-allowed' : 'pointer'
                    }}
                    title={
                      existingFarmerWithPhone
                        ? `Cannot register: Mobile +91 ${existingFarmerWithPhone.phone} is already registered to ${existingFarmerWithPhone.name}`
                        : newFarmerForm.phone.length !== 10
                        ? 'Please enter 10-digit mobile number'
                        : !newFarmerForm.name.trim()
                        ? 'Please enter farmer name'
                        : 'Register new farmer'
                    }
                  >
                    <UserPlus size={16} /> Register Farmer & Select
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DETAILS MODAL: Video, Picture, Text                          */}
      {/* ============================================================ */}
      {detailModalOpen && detailModalMachine && (
        <div className="details-modal-overlay" onClick={() => setDetailModalOpen(false)}>
          <div className="details-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header-bar">
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: 0 }}>
                  {detailModalMachine.name}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--color-forest)', fontFamily: 'var(--font-telugu)' }}>
                  {detailModalMachine.telugu} · {detailModalMachine.operationName}
                </div>
              </div>
              <button
                className="btn-icon"
                onClick={() => setDetailModalOpen(false)}
                style={{ padding: '6px', borderRadius: '50%', background: 'var(--color-bg-elevated)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs: Video / Picture / Text */}
            <div className="modal-nav-tabs">
              <button
                className={`modal-tab-btn ${modalTab === 'video' ? 'active' : ''}`}
                onClick={() => setModalTab('video')}
              >
                <Play size={14} className="text-alert" /> 🎬 Video Demonstration
              </button>
              <button
                className={`modal-tab-btn ${modalTab === 'picture' ? 'active' : ''}`}
                onClick={() => setModalTab('picture')}
              >
                <Image size={14} className="text-sky" /> 🖼️ Picture Gallery
              </button>
              <button
                className={`modal-tab-btn ${modalTab === 'text' ? 'active' : ''}`}
                onClick={() => setModalTab('text')}
              >
                <FileText size={14} className="text-forest" /> 📝 Text & Specifications
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content-body">
              {/* Tab 1: Video */}
              {modalTab === 'video' && (
                <div>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: '8px' }}>
                    {detailModalMachine.videoTitle}
                  </h4>
                  <div className="video-container">
                    <iframe
                      src={detailModalMachine.videoUrl}
                      title={detailModalMachine.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ marginTop: 'var(--space-3)', background: 'var(--color-bg-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--color-forest)' }}>💡 Facilitator Field Tip:</span>
                    <p className="text-secondary" style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
                      Show this field video to the walk-in farmer to illustrate field operation speed, fuel consumption, and labor saving benefits.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Picture Gallery */}
              {modalTab === 'picture' && (
                <div>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: '8px' }}>
                    High-Resolution Machine Gallery & Implements
                  </h4>
                  <div className="gallery-grid">
                    {detailModalMachine.gallery.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt={`${detailModalMachine.name} view ${i + 1}`}
                        className="gallery-img"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Text & Specifications */}
              {modalTab === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: '4px' }}>
                      Comprehensive Machine Overview
                    </h4>
                    <p className="text-secondary" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      {detailModalMachine.description}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '8px' }}>
                      Technical Specifications
                    </h4>
                    <table className="specs-table">
                      <tbody>
                        {Object.entries(detailModalMachine.specs).map(([key, val]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: '10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>CHC Rental Pricing</span>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-mint)' }}>
                        ₹{detailModalMachine.chcAvailability.rateHourly}/hr · ₹{detailModalMachine.chcAvailability.rateDaily}/day
                      </div>
                    </div>
                    <div className="card" style={{ background: 'var(--color-bg-elevated)', padding: '10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Purchase Subsidized Price</span>
                      <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-forest)' }}>
                        ₹{detailModalMachine.purchaseInfo.effectivePrice.toLocaleString()} ({detailModalMachine.purchaseInfo.subsidyPercent}% Subsidy)
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Action */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', background: 'var(--color-bg-card)' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => setDetailModalOpen(false)}>
                  Close
                </button>
                <button
                  onClick={() => handleShareMachine(detailModalMachine)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                >
                  <Share2 size={14} /> Share Video & Specs
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedMachine(detailModalMachine);
                  setDetailModalOpen(false);
                  setActiveStepIndex(4);
                }}
              >
                Select this Equipment & Proceed <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* UPLOAD MACHINERY MODAL: Direct CHC & FMC Inventory Linkage  */}
      {/* ============================================================ */}
      {showUploadMachineModal && (
        <div className="details-modal-overlay" onClick={() => setShowUploadMachineModal(false)}>
          <div className="details-modal" style={{ maxWidth: 740, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>
                    Upload & Link New Farm Machinery / Instrument
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Directly onboard equipment to CHC hiring fleet and FMC dealer purchase catalog
                  </div>
                </div>
              </div>
              <button
                className="btn-icon"
                onClick={() => setShowUploadMachineModal(false)}
                style={{ padding: '6px', borderRadius: '50%', background: 'var(--color-bg-elevated)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewMachine} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="machine-upload-grid">
                {/* 1. General Info */}
                <div className="machine-upload-section-title">
                  <Tractor size={16} /> 1. Equipment Basic Info & Operation Category
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Equipment / Implement Name *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Shakti Multi-Crop Pneumatic Planter (4-Row)"
                    value={newMachineForm.name}
                    onChange={e => setNewMachineForm({ ...newMachineForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Telugu Name (తెలుగు పేరు)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. శక్తి న్యూమాటిక్ ప్లాంటర్"
                    value={newMachineForm.telugu}
                    onChange={e => setNewMachineForm({ ...newMachineForm, telugu: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Operation Category *</label>
                  <select
                    className="input-field select-field"
                    value={newMachineForm.operationId}
                    onChange={e => setNewMachineForm({ ...newMachineForm, operationId: e.target.value })}
                    required
                  >
                    {MACHINERY_OPERATIONS.map(op => (
                      <option key={op.id} value={op.id}>{op.icon} {op.name} ({op.telugu})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Brand / Manufacturer</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Mahindra, Kubota, Aspee"
                    value={newMachineForm.brand}
                    onChange={e => setNewMachineForm({ ...newMachineForm, brand: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Power Rating (HP / kW)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 45 HP or 12 V Battery"
                    value={newMachineForm.powerHP}
                    onChange={e => setNewMachineForm({ ...newMachineForm, powerHP: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Fuel Type / Consumption</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Diesel (3.8 L/hr) or Solar DC"
                    value={newMachineForm.fuelType}
                    onChange={e => setNewMachineForm({ ...newMachineForm, fuelType: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Daily Field Capacity</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 4.0 - 5.0 acres/day"
                    value={newMachineForm.capacity}
                    onChange={e => setNewMachineForm({ ...newMachineForm, capacity: e.target.value })}
                  />
                </div>

                {/* 2. CHC Hiring Fleet & Availability Link */}
                <div className="machine-upload-section-title">
                  <MapPin size={16} /> 2. Custom Hiring Center (CHC) Link & Rental Pricing
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Assign to CHC Hub *</label>
                  <select
                    className="input-field select-field"
                    value={newMachineForm.chcHubId}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcHubId: e.target.value })}
                    required
                  >
                    {chcHubs.map(hub => (
                      <option key={hub.id} value={hub.id}>
                        🚜 {hub.name} ({hub.village}, {hub.district}) – In-Charge: {hub.inCharge}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Total Fleet in Hub</label>
                  <input
                    type="number"
                    min={1}
                    className="input-field"
                    value={newMachineForm.chcTotalUnits}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcTotalUnits: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Currently Ready / Available</label>
                  <input
                    type="number"
                    min={0}
                    max={newMachineForm.chcTotalUnits}
                    className="input-field"
                    value={newMachineForm.chcAvailableUnits}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcAvailableUnits: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Rental Rate (₹ / Hour) *</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newMachineForm.chcRateHourly}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcRateHourly: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rental Rate (₹ / Day)</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newMachineForm.chcRateDaily}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcRateDaily: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Rental Rate (₹ / Acre)</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newMachineForm.chcRatePerAcre}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcRatePerAcre: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Security Deposit (₹)</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newMachineForm.chcDeposit}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcDeposit: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="newOpCheck"
                    checked={newMachineForm.chcOperatorIncluded}
                    onChange={e => setNewMachineForm({ ...newMachineForm, chcOperatorIncluded: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="newOpCheck" style={{ cursor: 'pointer', fontSize: '12px' }}>
                    Trained CHC operator / technician service available for this implement
                  </label>
                </div>

                {/* 3. FMC Dealership & Purchase Subsidy Link */}
                <div className="machine-upload-section-title">
                  <Building2 size={16} /> 3. FMC Dealership Link & Purchase Subsidy Rates
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Assign to FMC Dealership *</label>
                  <select
                    className="input-field select-field"
                    value={newMachineForm.fmcId}
                    onChange={e => setNewMachineForm({ ...newMachineForm, fmcId: e.target.value })}
                    required
                  >
                    {fmcShops.map(fmc => (
                      <option key={fmc.id} value={fmc.id}>
                        🏪 {fmc.name} ({fmc.city}) – Dealer: {fmc.inCharge}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Retail Price (MSRP ₹) *</label>
                  <input
                    type="number"
                    min={0}
                    className="input-field"
                    value={newMachineForm.msrp}
                    onChange={e => setNewMachineForm({ ...newMachineForm, msrp: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Govt Subsidy Percentage (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="input-field"
                    value={newMachineForm.subsidyPercent}
                    onChange={e => setNewMachineForm({ ...newMachineForm, subsidyPercent: Number(e.target.value) })}
                  />
                </div>

                {/* 4. Media & Video Links */}
                <div className="machine-upload-section-title">
                  <Play size={16} /> 4. Demonstration Video & Equipment Photos
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Equipment Photo / Thumbnail URL</label>
                  <input
                    className="input-field"
                    placeholder="https://images.unsplash.com/..."
                    value={newMachineForm.thumbnail}
                    onChange={e => setNewMachineForm({ ...newMachineForm, thumbnail: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Field Demonstration Video (YouTube Embed Link)</label>
                  <input
                    className="input-field"
                    placeholder="https://www.youtube-nocookie.com/embed/..."
                    value={newMachineForm.videoUrl}
                    onChange={e => setNewMachineForm({ ...newMachineForm, videoUrl: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Short Technical Overview & Soil Compatibility</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Heavy duty rotavator with boron steel blades suited for red loam and black cotton soils."
                    value={newMachineForm.description}
                    onChange={e => setNewMachineForm({ ...newMachineForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUploadMachineModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UploadCloud size={16} /> Upload & Save to Master Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* QUICK EDIT AVAILABILITY & RATES MODAL                        */}
      {/* ============================================================ */}
      {quickEditMachine && (
        <div className="details-modal-overlay" onClick={() => setQuickEditMachine(null)}>
          <div className="details-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: 0 }}>
                  ⚙️ Quick Edit: {quickEditMachine.name}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Update live fleet stock availability, yard status, and rental rates for CHC
                </div>
              </div>
              <button
                className="btn-icon"
                onClick={() => setQuickEditMachine(null)}
                style={{ padding: '6px', borderRadius: '50%', background: 'var(--color-bg-elevated)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEditMachine} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
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
                  <label>Total Fleet Capacity</label>
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
                  <label>Rental Rate (₹ / Hour) *</label>
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
                  <label>Rental Rate (₹ / Day)</label>
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

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Assigned CHC Hub</label>
                  <select
                    className="input-field select-field"
                    value={quickEditMachine.chcAvailability?.chcHub || chcHubs[0]?.name}
                    onChange={e => setQuickEditMachine({
                      ...quickEditMachine,
                      chcAvailability: {
                        ...quickEditMachine.chcAvailability,
                        chcHub: e.target.value
                      }
                    })}
                  >
                    {chcHubs.map(hub => (
                      <option key={hub.id} value={hub.name}>{hub.name} ({hub.village})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setQuickEditMachine(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to format supervisor
function hubSupervisor(hub) {
  return hub.inCharge ? hub.inCharge.split(' ')[0] : 'Supervisor';
}

// WhatsApp URL generator with exact phone number and ready-made text
export function getWhatsAppLink(phone, message) {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}

// Get Provider Phone Number (FM Shop / CHC Hub)
export function getProviderPhone(order, chcHubs = [], fmcShops = []) {
  if (!order) return '9848011223';
  if (order.type === 'purchase') {
    const shop = fmcShops?.find(s => s.name === order.dealer || order.dealer?.includes(s.name));
    return shop?.phone || '9848011223';
  } else {
    const hub = chcHubs?.find(h => h.name === order.chcHub || order.chcHub?.includes(h.name));
    return hub?.phone || '9876500112';
  }
}

// Ready-made WhatsApp Message for Farmer
export function getFarmerWhatsAppMsg(order) {
  if (!order) return '';
  if (order.type === 'purchase') {
    return `🌾 *CLIC Farm Machinery Purchase Confirmation* 🌾\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *Order Ref:* ${order.id}\n` +
      `👤 *Farmer:* ${order.farmerName} (${order.village})\n` +
      `🚜 *Machinery:* ${order.machineName}\n` +
      `🏪 *Authorized Dealer:* ${order.dealer}\n` +
      `💰 *MSRP:* ₹${order.msrp?.toLocaleString() || 'N/A'}\n` +
      `🎁 *Subsidy Applied:* -₹${order.subsidyAmount?.toLocaleString() || 'N/A'}\n` +
      `💵 *Net Payable:* ₹${order.netPayable?.toLocaleString() || 'N/A'}\n` +
      `💳 *Payment Mode:* ${order.paymentMode}\n` +
      `📅 *Date:* ${order.date}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📞 *CLIC Toll-Free Helpline:* 1800-180-1551\n` +
      `_CLIC - Village Agri-Mechanization Portal_`;
  }
  return `🌾 *CLIC Custom Hiring Center (CHC) Rental Booking* 🌾\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Booking Ref:* ${order.id}\n` +
    `👤 *Farmer:* ${order.farmerName} (${order.village})\n` +
    `🚜 *Machinery:* ${order.machineName}\n` +
    `📍 *Assigned CHC Hub:* ${order.chcHub}\n` +
    `📅 *Start Date:* ${order.startDate}\n` +
    `⏱️ *Duration:* ${order.rentalUnits}\n` +
    `💰 *Estimated Total:* ₹${order.totalEstimated?.toLocaleString() || 'N/A'}\n` +
    `👨‍✈️ *Trained Driver:* ${order.includeOperator ? 'Included' : 'Not Requested'}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📞 *CLIC Toll-Free Helpline:* 1800-180-1551\n` +
    `_CLIC - Subsidized Custom Hiring Services_`;
}

// Ready-made WhatsApp Message for Provider (CHC Hub / FM Dealer)
export function getProviderWhatsAppMsg(order) {
  if (!order) return '';
  if (order.type === 'purchase') {
    return `🚜 *NEW MACHINERY PURCHASE WORK ORDER - CLIC* 🚜\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *Order Ref:* ${order.id}\n` +
      `👤 *Buyer Name:* ${order.farmerName}\n` +
      `📱 *Farmer Mobile:* +91 ${order.farmerPhone}\n` +
      `📍 *Delivery Address:* ${order.village}, Nalgonda\n` +
      `🚜 *Equipment:* ${order.machineName}\n` +
      `💵 *Net Payable:* ₹${order.netPayable?.toLocaleString() || 'N/A'}\n` +
      `💳 *Payment Term:* ${order.paymentMode}\n` +
      `📝 *Notes:* ${order.notes || 'Standard Delivery'}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_Please verify SMAM subsidy allocation and confirm delivery schedule._`;
  }
  return `🚜 *NEW CHC FLEET RENTAL DISPATCH REQUEST - CLIC* 🚜\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📋 *Booking Ref:* ${order.id}\n` +
    `👤 *Farmer Name:* ${order.farmerName}\n` +
    `📱 *Farmer Mobile:* +91 ${order.farmerPhone}\n` +
    `📍 *Field Location:* ${order.village}, Nalgonda\n` +
    `🚜 *Equipment:* ${order.machineName}\n` +
    `📅 *Required On:* ${order.startDate} (${order.rentalUnits})\n` +
    `👨‍✈️ *Operator Required:* ${order.includeOperator ? 'Yes' : 'No'}\n` +
    `💰 *Estimated Total:* ₹${order.totalEstimated?.toLocaleString() || 'N/A'}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Please assign tractor unit & driver and send confirmation back._`;
}

// Ready-made WhatsApp Message for Machine Catalog Sharing
export function getMachineCatalogWhatsAppMsg(machine) {
  if (!machine) return '';
  return `🚜 *Agricultural Machinery Specs & Rates - CLIC* 🚜\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🏷️ *Equipment:* ${machine.name} (${machine.telugu})\n` +
    `⚙️ *Operation:* ${machine.operationName}\n` +
    `⭐ *Brand / Power:* ${machine.brand} · ${machine.hp}\n` +
    `💰 *CHC Hire Rate:* ₹${machine.chcAvailability.rateHourly}/hr · ₹${machine.chcAvailability.rateDaily}/day\n` +
    `🛒 *Purchase with Subsidy:* ₹${machine.purchaseInfo.effectivePrice.toLocaleString()} (${machine.purchaseInfo.subsidyPercent}% SMAM Subsidy)\n` +
    `🎬 *Video Demonstration:* ${machine.videoUrl}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Book at nearest CLIC Village Center or call 1800-180-1551._`;
}
