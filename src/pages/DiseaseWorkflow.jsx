import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MACHINERY_OPERATIONS,
  FARM_MACHINES,
  DEMO_FARMERS,
  INITIAL_CHC_HUBS,
  INITIAL_FMC_SHOPS,
  INITIAL_FARMER_QUERIES
} from '../data/machinery/machineryData';
import { chcEquipment } from '../data/machinery/chcEquipment';
import { fmcInventory } from '../data/machinery/fmcInventory';
import { FISH_SPECIES, FISH_DISEASES } from '../data/fisheries/fisheriesData';
import { LIVESTOCK_ANIMALS, LIVESTOCK_DISEASES } from '../data/livestock/livestockData';
import {
  CROP_THEMES,
  PEST_CATEGORIES,
  CROP_PESTS_DATA,
  CROP_DISEASES_DATA
} from '../data/crops/cropPestDiseaseData';
import { INITIAL_DISEASE_PRESCRIPTIONS, INITIAL_DISEASE_ALERTS } from '../data/crops/diseasePrescriptionsData';
import { livestockShops, INITIAL_LIVESTOCK_SHOPS } from '../data/livestock/livestockShops';
import { INITIAL_INPUT_STORES } from '../data/inputs/inputStoreData';
import {
  Tractor, Store, Wrench, Activity, Fish, Stethoscope, Search, User, Phone, MapPin,
  CheckCircle2, ArrowRight, ArrowLeft, Play, X, ShoppingCart,
  Bell, AlertTriangle, ShieldCheck, FileText, Send, Sparkles,
  Printer, Plus, RefreshCw, Layers, Check, ExternalLink, HelpCircle, Calendar,
  Clock, DollarSign, Building2, UserPlus, ShoppingBag, Filter,
  Bug, Sprout, Info, ShieldAlert, Database
} from 'lucide-react';
import '../styles/diseaseWorkflow.css';

// 5-Step Facilitator Workflow (Step 1 immediately integrates Farmer Profile Retrieval)
const WORKFLOW_STEPS = [
  { id: 'step1', num: 1, label: 'Walk-in & Profile', desc: 'Farmer selection, stated query & retrieved land/asset dossier' },
  { id: 'step2', num: 2, label: 'Identify Theme', desc: 'Menu Board: Machinery, Crop Pests, Crop Diseases, Fish or Livestock' },
  { id: 'step3', num: 3, label: 'Retrieve Info & Options', desc: 'Choose operations / crop / species, diagnosis, video & details' },
  { id: 'step4', num: 4, label: 'Purchase / Hub Choice', desc: 'Rental from CHC, FMC Purchase or Input Store / LS Shop' },
  { id: 'step5', num: 5, label: 'Alerts & Closure', desc: 'Alerts to Shop/CHC, Farmer & Final Close' }
];

export default function DiseaseWorkflow() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isFarmer = user?.role === 'farmer';

  // Active top-level view: 'workflow' | 'orders' | 'alerts' | 'onboarding' | 'queries'
  const [activeTab, setActiveTab] = useState('workflow');

  // Active Workflow Module / Theme: 'machinery' | 'crop_pests' | 'crop_diseases' | 'fish' | 'livestock'
  const [theme, setTheme] = useState('machinery');

  // Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Workflow Data States
  const [farmersList, setFarmersList] = useState(() => {
    const saved = localStorage.getItem('clic_farmers');
    return saved ? JSON.parse(saved) : DEMO_FARMERS;
  });

  const [selectedFarmer, setSelectedFarmer] = useState(() => {
    return farmersList[0] || DEMO_FARMERS[0];
  });

  const [farmerQueryText, setFarmerQueryText] = useState('Looking for advice and treatment for crop management.');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [showAddFarmerModal, setShowAddFarmerModal] = useState(false);
  const [showFarmerDetailsModal, setShowFarmerDetailsModal] = useState(false);
  const [farmerToInspect, setFarmerToInspect] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // New Farmer Form State
  const [newFarmerForm, setNewFarmerForm] = useState({
    name: '',
    telugu: '',
    phone: '',
    village: 'Chandampet',
    district: 'Nalgonda',
    landHolding: '3.0 acres',
    soilType: 'Red Sandy Loam',
    crops: 'Paddy, Cotton',
    subsidyCategory: 'Small / Marginal Farmer (SF/MF)',
    activeQuery: ''
  });

  // Helper to map any crop string cleanly to standard CROP_THEMES id
  const resolveCropId = (raw) => {
    if (!raw) return 'paddy';
    const str = raw.toLowerCase().replace(/[^a-z]/g, '');
    if (str.includes('paddy') || str.includes('rice')) return 'paddy';
    if (str.includes('cotton')) return 'cotton';
    if (str.includes('chilli') || str.includes('chili')) return 'chilli';
    if (str.includes('redgram') || str.includes('tur') || str.includes('pigeonpea') || str.includes('kandulu')) return 'redgram';
    if (str.includes('groundnut') || str.includes('peanut')) return 'groundnut';
    if (str.includes('maize') || str.includes('corn')) return 'maize';
    if (str.includes('tomato')) return 'tomato';
    if (str.includes('sugarcane')) return 'sugarcane';
    return 'paddy';
  };

  // Helper to normalize any pest/disease added via Advisory or localStorage into the full workflow schema
  const normalizeDisease = (item) => {
    const rawCrop = item.cropId || item.crop || item.cropName || 'paddy';
    const cleanCropId = resolveCropId(rawCrop);
    return {
      id: item.id || `dis-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      cropId: cleanCropId,
      name: item.name || 'Crop Disease',
      telugu: item.telugu || item.name,
      pathogen: item.pathogen || item.scientificName || 'Fungal / Bacterial Pathogen',
      causalAgent: item.causalAgent || 'Pathogen',
      symptoms: item.symptoms || item.symptom || 'Foliar lesions and discoloration observed on crop.',
      favorableConditions: item.favorableConditions || 'High humidity and warm temperatures.',
      severityLevels: item.severityLevels || [
        { level: 'mild', label: 'Mild (Initial localized symptoms)', advice: item.control || 'Apply organic bio-agent preventive spray.', urgency: 'Moderate' },
        { level: 'moderate', label: 'Moderate (Spreading across canopy)', advice: item.control || 'Apply recommended systemic fungicide.', urgency: 'High' },
        { level: 'severe', label: 'Severe (Extensive damage & lodging risk)', advice: item.control || 'Targeted emergency curative application.', urgency: 'Critical' }
      ],
      controlMeasures: item.controlMeasures || {
        organic_biocontrol: 'Spray Neem Seed Kernel Extract (NSKE 5%) or Pseudomonas fluorescens @ 10g/L.',
        chemical_fungicide: item.control || 'Spray recommended protective/curative fungicide as per label.',
        preventive_measures: 'Clean crop residue and practice crop rotation.'
      },
      video: item.video || {
        title: `${item.name} Management Guide`,
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '5 mins',
        thumbnail: '🌿'
      },
      inoculum: item.inoculum || {
        formula: `${item.name} Control Formulation`,
        preparationSteps: [
          `Dissolve recommended dosage in clean water.`,
          `Spray evenly on upper and lower leaf foliage during early morning or late afternoon.`
        ],
        dosagePerAcre: '200 Litres water per acre',
        precautions: 'Wear protective gear during application.'
      },
      recommendedProducts: item.recommendedProducts || [
        { id: `prod-${item.id || 'custom'}-1`, name: `${item.name} Curative Kit (500g)`, unitPrice: 350, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 50, pack: '500g pack' }
      ]
    };
  };

  const normalizePest = (item) => {
    const rawCrop = item.cropId || item.crop || item.cropName || 'paddy';
    const cleanCropId = resolveCropId(rawCrop);
    const cat = item.category || (item.name?.toLowerCase().includes('borer') ? 'borers' : item.name?.toLowerCase().includes('caterpillar') || item.name?.toLowerCase().includes('folder') || item.name?.toLowerCase().includes('spodoptera') ? 'chewing' : 'sucking');
    return {
      id: item.id || `pest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      cropId: cleanCropId,
      name: item.name || 'Crop Pest',
      telugu: item.telugu || item.name,
      scientificName: item.scientificName || 'Pest species',
      category: cat,
      damageSymptoms: item.damageSymptoms || item.symptom || 'Feeding damage and sap sucking on crop.',
      economicThreshold: item.economicThreshold || '5–10 pests per hill/plant',
      lifeCycle: item.lifeCycle || [
        { stage: 'Egg', duration: '5–7 days', desc: 'Eggs deposited on plant surface.', vulnerability: 'Protected stage.', icon: '🥚' },
        { stage: 'Nymph / Larva', duration: '10–14 days', desc: 'Active feeding stage causing maximum crop damage.', vulnerability: 'Target spray window.', icon: '🐛', keyStage: true },
        { stage: 'Adult', duration: '12–18 days', desc: 'Mated adults laying eggs.', vulnerability: 'Pheromone & light traps.', icon: '🦟' }
      ],
      controlMeasures: item.controlMeasures || {
        cultural: 'Field sanitation and clean weed-free bunds.',
        biological: 'Conserve predatory spiders and spray Beauveria bassiana @ 5g/L.',
        chemical: item.control || 'Targeted spray with recommended insecticide.'
      },
      video: item.video || {
        title: `${item.name} IPM Management Technique`,
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: '6 mins',
        thumbnail: '🌾'
      },
      inoculum: item.inoculum || {
        formula: `${item.name} Bio-Formulation`,
        preparationSteps: [
          'Mix recommended formulation in chlorine-free water.',
          'Spray targeting active feeding sites on foliage.'
        ],
        dosagePerAcre: '200 Litres spray solution per acre'
      },
      recommendedProducts: item.recommendedProducts || [
        { id: `prod-${item.id || 'custom'}-p1`, name: `${item.name} Protection Pack (250ml)`, unitPrice: 380, storeId: 'store-1', storeName: 'Chandampet PACS Bio-Input Center', stock: 40, pack: '250ml pack' }
      ]
    };
  };

  const loadDynamicDiseases = () => {
    let extra = [];
    const masterDiseases = localStorage.getItem('clic_crop_diseases_master') || localStorage.getItem('clic_crop_diseases');
    if (masterDiseases) {
      try { extra = [...extra, ...JSON.parse(masterDiseases)]; } catch (e) {}
    }
    const advisoryPests = localStorage.getItem('clic_pests');
    if (advisoryPests) {
      try {
        const parsed = JSON.parse(advisoryPests);
        // Include any disease entry, or entries with 'disease' in the name / type
        const diseasesOrNamed = parsed.filter(p => p.type === 'disease' || p.type === 'pest_disease' || p.name?.toLowerCase().includes('disease') || p.name?.toLowerCase().includes('blight') || p.name?.toLowerCase().includes('rot') || p.name?.toLowerCase().includes('wilt') || p.name?.toLowerCase().includes('rust') || p.name?.toLowerCase().includes('blast') || p.name?.toLowerCase().includes('spot') || p.name?.toLowerCase().includes('mosaic') || !p.type);
        extra = [...extra, ...diseasesOrNamed];
      } catch (e) {}
    }
    const combined = [...CROP_DISEASES_DATA, ...extra.map(normalizeDisease)];
    const map = new Map();
    combined.forEach(d => {
      const key = `${(d.cropId || '').toLowerCase()}_${(d.name || '').toLowerCase().trim()}`;
      if (!map.has(key)) map.set(key, d);
    });
    return Array.from(map.values());
  };

  const loadDynamicPests = () => {
    let extra = [];
    const masterPests = localStorage.getItem('clic_crop_pests_master') || localStorage.getItem('clic_crop_pests');
    if (masterPests) {
      try { extra = [...extra, ...JSON.parse(masterPests)]; } catch (e) {}
    }
    const advisoryPests = localStorage.getItem('clic_pests');
    if (advisoryPests) {
      try {
        const parsed = JSON.parse(advisoryPests);
        const pestsOrNamed = parsed.filter(p => p.type === 'pest' || p.name?.toLowerCase().includes('pest') || p.name?.toLowerCase().includes('borer') || p.name?.toLowerCase().includes('hopper') || p.name?.toLowerCase().includes('worm') || p.name?.toLowerCase().includes('bug') || p.name?.toLowerCase().includes('fly') || p.name?.toLowerCase().includes('caterpillar') || p.type !== 'disease');
        extra = [...extra, ...pestsOrNamed];
      } catch (e) {}
    }
    const combined = [...CROP_PESTS_DATA, ...extra.map(normalizePest)];
    const map = new Map();
    combined.forEach(p => {
      const key = `${(p.cropId || '').toLowerCase()}_${(p.name || '').toLowerCase().trim()}`;
      if (!map.has(key)) map.set(key, p);
    });
    return Array.from(map.values());
  };

  // Dynamic Master lists combining cropPestDiseaseData + localStorage
  const [cropDiseasesList, setCropDiseasesList] = useState(loadDynamicDiseases);
  const [cropPestsList, setCropPestsList] = useState(loadDynamicPests);

  useEffect(() => {
    setCropDiseasesList(loadDynamicDiseases());
    setCropPestsList(loadDynamicPests());
  }, [activeTab, theme]);

  // Step 3 Selection States
  // Machinery states
  const [selectedOperationId, setSelectedOperationId] = useState('land-prep');
  const [selectedMachine, setSelectedMachine] = useState(FARM_MACHINES[0]);

  // Crop Pests states
  const [selectedCropId, setSelectedCropId] = useState('paddy');
  const [selectedPestCategory, setSelectedPestCategory] = useState('sucking');
  const [selectedPest, setSelectedPest] = useState(cropPestsList[0] || CROP_PESTS_DATA[0]);
  const [selectedPestStage, setSelectedPestStage] = useState('Nymph');

  // Crop Diseases states
  const [selectedCropDisease, setSelectedCropDisease] = useState(cropDiseasesList[0] || CROP_DISEASES_DATA[0]);
  const [selectedSeverity, setSelectedSeverity] = useState('mild');

  // Fisheries & Livestock states
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);

  // Video modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: '', title: '' });

  // Step 4 Fulfillment States
  const [machineryChoice, setMachineryChoice] = useState('rental');
  const [selectedChcHubId, setSelectedChcHubId] = useState(INITIAL_CHC_HUBS[0]?.id || 'chc-1');
  const [rentalDays, setRentalDays] = useState(2);
  const [rentalDate, setRentalDate] = useState('2026-10-02');
  const [includeOperator, setIncludeOperator] = useState(true);
  const [selectedFmcShopId, setSelectedFmcShopId] = useState(INITIAL_FMC_SHOPS[0]?.id || 'fmc-1');
  const [purchasePaymentMode, setPurchasePaymentMode] = useState('Kisan Credit Card (KCC) + Govt Subsidy');

  // Cart / Prescription items
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  // Step 5 Alerts & Multi-Stage Close states
  const [closureStage, setClosureStage] = useState('ready_for_dispatch');
  const [dispatchedAlerts, setDispatchedAlerts] = useState([]);
  const [prescriptionsHistory, setPrescriptionsHistory] = useState([]);

  // Onboarded Entities State
  const [chcHubs, setChcHubs] = useState(() => {
    const saved = localStorage.getItem('clic_custom_chc');
    return saved ? JSON.parse(saved) : INITIAL_CHC_HUBS;
  });
  const [fmcShops, setFmcShops] = useState(() => {
    const saved = localStorage.getItem('clic_custom_fmc');
    return saved ? JSON.parse(saved) : INITIAL_FMC_SHOPS;
  });
  const [inputStores, setInputStores] = useState(() => {
    const saved = localStorage.getItem('clic_input_stores');
    return saved ? JSON.parse(saved) : INITIAL_INPUT_STORES;
  });
  const [lsShops, setLsShops] = useState(() => {
    const saved = localStorage.getItem('clic_livestock_shops');
    return saved ? JSON.parse(saved) : INITIAL_LIVESTOCK_SHOPS;
  });

  // Onboarding Sub-Tab: 'chc' | 'fmc' | 'input' | 'ls'
  const [onboardType, setOnboardType] = useState('chc');
  const [onboardForm, setOnboardForm] = useState({
    name: '',
    inCharge: '',
    phone: '',
    email: '',
    village: 'Chandampet',
    district: 'Nalgonda',
    mandal: 'Chandampet',
    fleetCount: 6,
    operatorCount: 3,
    gstin: '',
    brands: 'John Deere, Mahindra',
    stockUnits: 10,
    specialty: 'Dairy & Small Ruminants'
  });

  // Orders Filter
  const [ordersFilterModule, setOrdersFilterModule] = useState('all');
  const [ordersSearch, setOrdersSearch] = useState('');

  // Synchronize with search params and local storage
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['workflow', 'orders', 'alerts', 'onboarding', 'queries'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const themeParam = searchParams.get('theme');
    if (themeParam && ['machinery', 'crop_pests', 'crop_diseases', 'fish', 'livestock'].includes(themeParam)) {
      setTheme(themeParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const savedAlerts = localStorage.getItem('clic_disease_alerts');
    if (savedAlerts) {
      try { setDispatchedAlerts(JSON.parse(savedAlerts)); } catch (e) { setDispatchedAlerts(INITIAL_DISEASE_ALERTS); }
    } else {
      setDispatchedAlerts(INITIAL_DISEASE_ALERTS);
    }

    const savedPrescriptions = localStorage.getItem('clic_disease_prescriptions');
    if (savedPrescriptions) {
      try { setPrescriptionsHistory(JSON.parse(savedPrescriptions)); } catch (e) { setPrescriptionsHistory(INITIAL_DISEASE_PRESCRIPTIONS); }
    } else {
      setPrescriptionsHistory(INITIAL_DISEASE_PRESCRIPTIONS);
    }
  }, []);

  // Theme change default bindings
  useEffect(() => {
    if (theme === 'machinery') {
      setSelectedOperationId('land-prep');
      const firstMach = FARM_MACHINES.find(m => m.operationId === 'land-prep') || FARM_MACHINES[0];
      setSelectedMachine(firstMach);
    } else if (theme === 'crop_pests') {
      const matchPest = cropPestsList.find(p => p.cropId === selectedCropId && p.category === selectedPestCategory) || cropPestsList.find(p => p.cropId === selectedCropId) || cropPestsList[0];
      setSelectedPest(matchPest);
      if (matchPest?.lifeCycle?.length) {
        setSelectedPestStage(matchPest.lifeCycle.find(s => s.keyStage)?.stage || matchPest.lifeCycle[0].stage);
      }
    } else if (theme === 'crop_diseases') {
      const matchDis = cropDiseasesList.find(d => d.cropId === selectedCropId) || cropDiseasesList[0];
      setSelectedCropDisease(matchDis);
    } else if (theme === 'fish') {
      setSelectedSpeciesId(FISH_SPECIES[0].id);
      setSelectedDisease(FISH_DISEASES[0]);
    } else if (theme === 'livestock') {
      setSelectedSpeciesId(LIVESTOCK_ANIMALS[0].id);
      setSelectedDisease(LIVESTOCK_DISEASES[0]);
    }
    setPrescriptionItems([]);
  }, [theme, cropPestsList, cropDiseasesList]);

  // Crop change for pest / disease
  useEffect(() => {
    if (theme === 'crop_pests') {
      const matchPest = cropPestsList.find(p => p.cropId === selectedCropId && p.category === selectedPestCategory) || cropPestsList.find(p => p.cropId === selectedCropId) || cropPestsList[0];
      setSelectedPest(matchPest);
      if (matchPest?.lifeCycle?.length) {
        setSelectedPestStage(matchPest.lifeCycle.find(s => s.keyStage)?.stage || matchPest.lifeCycle[0].stage);
      }
    } else if (theme === 'crop_diseases') {
      const matchDis = cropDiseasesList.find(d => d.cropId === selectedCropId) || cropDiseasesList[0];
      setSelectedCropDisease(matchDis);
    }
  }, [selectedCropId, cropPestsList, cropDiseasesList]);

  // Pest category change
  useEffect(() => {
    if (theme === 'crop_pests') {
      const matchPest = cropPestsList.find(p => p.cropId === selectedCropId && p.category === selectedPestCategory) || cropPestsList.find(p => p.category === selectedPestCategory) || cropPestsList[0];
      setSelectedPest(matchPest);
      if (matchPest?.lifeCycle?.length) {
        setSelectedPestStage(matchPest.lifeCycle.find(s => s.keyStage)?.stage || matchPest.lifeCycle[0].stage);
      }
    }
  }, [selectedPestCategory, cropPestsList]);

  const speciesList = theme === 'fish' ? FISH_SPECIES : LIVESTOCK_ANIMALS;
  const diseasesList = theme === 'fish' ? FISH_DISEASES : LIVESTOCK_DISEASES;

  const filteredFarmers = useMemo(() => {
    if (!farmerSearch.trim()) return farmersList;
    const q = farmerSearch.toLowerCase();
    return farmersList.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.phone.includes(q) ||
      f.village.toLowerCase().includes(q)
    );
  }, [farmersList, farmerSearch]);

  const [farmerQueries, setFarmerQueries] = useState(() => {
    const saved = localStorage.getItem('clic_farmer_queries');
    return saved ? JSON.parse(saved) : INITIAL_FARMER_QUERIES;
  });

  // Previous Queries History for the currently selected farmer
  const selectedFarmerPreviousQueries = useMemo(() => {
    if (!selectedFarmer) return [];
    const sId = selectedFarmer.id;
    const sPhone = selectedFarmer.phone;
    const sName = selectedFarmer.name?.toLowerCase() || '';

    // 1. From INITIAL_FARMER_QUERIES / farmerQueries
    const fromQueries = farmerQueries.filter(q =>
      (q.farmerId && q.farmerId === sId) ||
      (q.farmerPhone && q.farmerPhone === sPhone) ||
      (q.farmerName && q.farmerName.toLowerCase().includes(sName.split(' ')[0]))
    ).map(q => ({
      id: q.id,
      date: q.timestamp || 'Recorded Query',
      theme: q.theme || 'machinery',
      themeLabel: q.themeLabel || (q.theme === 'crop_pests' ? 'Crop Pests' : q.theme === 'crop_diseases' ? 'Crop Diseases' : q.theme === 'fish' ? 'Fish Diseases' : q.theme === 'livestock' ? 'Livestock Care' : 'Farm Machinery'),
      query: q.query,
      status: q.status || 'Recorded',
      facilitatorName: q.facilitatorName || 'CLIC Facilitator'
    }));

    // 2. From prescriptions history
    const fromOrders = prescriptionsHistory.filter(o =>
      (o.farmerPhone && o.farmerPhone === sPhone) ||
      (o.farmerName && o.farmerName.toLowerCase().includes(sName.split(' ')[0]))
    ).map(o => ({
      id: o.id,
      date: `${o.date} ${o.time || ''}`,
      theme: o.theme || 'machinery',
      themeLabel: o.theme === 'crop_pests' ? 'Crop Pests' : o.theme === 'crop_diseases' ? 'Crop Diseases' : o.theme === 'fish' ? 'Fish Diseases' : o.theme === 'livestock' ? 'Livestock Care' : 'Farm Machinery',
      query: o.query || `Prescription for ${o.diseaseName || o.serviceName || 'treatment'}`,
      status: o.status || 'Completed',
      facilitatorName: o.facilitatorName || 'CLIC Facilitator'
    }));

    // 3. Matching from selected farmer's active query if available
    const fromProfile = selectedFarmer.activeQuery ? [{
      id: `QRY-${selectedFarmer.id}`,
      date: 'Prior Intake Dossier',
      theme: 'machinery',
      themeLabel: 'Farm Machinery',
      query: selectedFarmer.activeQuery,
      status: 'Intake Registered',
      facilitatorName: 'CLIC Helpdesk'
    }] : [];

    // Combine & remove duplicate query texts
    const combined = [...fromQueries, ...fromOrders, ...fromProfile];
    const uniqueMap = new Map();
    combined.forEach(item => {
      const key = item.query?.trim().toLowerCase();
      if (key && !uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, [selectedFarmer, farmerQueries, prescriptionsHistory]);

  const filteredMachines = useMemo(() => {
    return FARM_MACHINES.filter(m => m.operationId === selectedOperationId);
  }, [selectedOperationId]);

  const filteredDiseases = useMemo(() => {
    if (['crop_pests', 'crop_diseases', 'machinery'].includes(theme)) return [];
    return diseasesList.filter(d => (theme === 'fish' ? d.speciesId : d.animalId) === selectedSpeciesId);
  }, [diseasesList, selectedSpeciesId, theme]);

  const filteredCropPests = useMemo(() => {
    return cropPestsList.filter(p => {
      if (!p) return false;
      const cid = (p.cropId || '').toLowerCase();
      const cname = (p.crop || p.cropName || '').toLowerCase();
      const sel = selectedCropId.toLowerCase();
      const cropMatch = cid === sel || cname.includes(sel) || (sel === 'paddy' && cname.includes('rice'));
      const catMatch = !selectedPestCategory || p.category === selectedPestCategory;
      return cropMatch && catMatch;
    });
  }, [cropPestsList, selectedCropId, selectedPestCategory]);

  const filteredCropDiseases = useMemo(() => {
    return cropDiseasesList.filter(d => {
      if (!d) return false;
      const cid = (d.cropId || '').toLowerCase();
      const cname = (d.crop || d.cropName || '').toLowerCase();
      const sel = selectedCropId.toLowerCase();
      return cid === sel || cname.includes(sel) || (sel === 'paddy' && cname.includes('rice'));
    });
  }, [cropDiseasesList, selectedCropId]);

  const handleSelectOperation = (opId) => {
    setSelectedOperationId(opId);
    const firstMatch = FARM_MACHINES.find(m => m.operationId === opId);
    if (firstMatch) setSelectedMachine(firstMatch);
  };

  const handleSelectSpecies = (spId) => {
    setSelectedSpeciesId(spId);
    const firstMatch = diseasesList.find(d => (theme === 'fish' ? d.speciesId : d.animalId) === spId);
    if (firstMatch) setSelectedDisease(firstMatch);
  };

  const togglePrescriptionProduct = (prod) => {
    setPrescriptionItems(prev => {
      const exists = prev.find(p => p.id === prod.id);
      if (exists) return prev.filter(p => p.id !== prod.id);
      return [...prev, { ...prod, quantity: 1 }];
    });
  };

  const updateProductQty = (prodId, delta) => {
    setPrescriptionItems(prev => prev.map(p => {
      if (p.id === prodId) {
        return { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) };
      }
      return p;
    }));
  };

  // Pricing calculations
  const machineryRentalTotal = useMemo(() => {
    if (!selectedMachine?.chcAvailability) return { base: 2500, deposit: 1000, total: 3500 };
    const dailyRate = selectedMachine.chcAvailability.rateDaily || 2500;
    const operatorRate = includeOperator ? (selectedMachine.chcAvailability.operatorRateExtra || 100) * 8 : 0;
    const base = (dailyRate + operatorRate) * rentalDays;
    const deposit = selectedMachine.chcAvailability.deposit || 1000;
    return { base, deposit, total: base + deposit };
  }, [selectedMachine, includeOperator, rentalDays]);

  const machineryPurchaseTotal = useMemo(() => {
    if (!selectedMachine?.purchaseInfo) return { msrp: 150000, subsidy: 75000, net: 75000 };
    const msrp = selectedMachine.purchaseInfo.msrp || 150000;
    const subsidyAmount = selectedMachine.purchaseInfo.subsidyAmount || (msrp * 0.5);
    const net = msrp - subsidyAmount;
    return { msrp, subsidy: subsidyAmount, net };
  }, [selectedMachine]);

  const totalPrescriptionBill = useMemo(() => {
    return prescriptionItems.reduce((acc, item) => acc + ((item.unitPrice || item.price || 0) * (item.quantity || 1)), 0);
  }, [prescriptionItems]);

  const openVideo = (url, title) => {
    setActiveVideo({ url, title });
    setVideoModalOpen(true);
  };

  // Dispatch Alerts
  const handleDispatchAlerts = () => {
    setClosureStage('alerts_dispatched');
    const isMach = theme === 'machinery';
    const orderRefId = isMach
      ? (machineryChoice === 'rental' ? `CHC-RENT-${Date.now().toString().slice(-4)}` : `FMC-PUR-${Date.now().toString().slice(-4)}`)
      : (theme === 'crop_pests' ? `PEST-DISP-${Date.now().toString().slice(-4)}` :
         theme === 'crop_diseases' ? `DIS-DISP-${Date.now().toString().slice(-4)}` :
         `RX-${theme.toUpperCase()}-${Date.now().toString().slice(-4)}`);

    let recipientShop = '';
    let shopMsg = '';
    let farmerMsg = '';

    if (theme === 'machinery') {
      recipientShop = machineryChoice === 'rental'
        ? (chcHubs.find(h => h.id === selectedChcHubId)?.name || 'Chandampet CHC Central Hub')
        : (fmcShops.find(s => s.id === selectedFmcShopId)?.name || 'Nalgonda FMC Machinery Dealer');
      shopMsg = `📢 New Order #${orderRefId} from CLIC Desk! Farmer ${selectedFarmer.name} (${selectedFarmer.phone}) needs ${selectedMachine.name} for ${machineryChoice === 'rental' ? `${rentalDays} days on ${rentalDate}` : 'Subsidized Purchase'}. Total Value: ₹${(machineryChoice === 'rental' ? machineryRentalTotal.total : machineryPurchaseTotal.net).toLocaleString('en-IN')}. Please confirm allocation.`;
      farmerMsg = `✅ CLIC Booking Confirmed: Ref #${orderRefId}. Service: ${selectedMachine.name} with ${recipientShop}. Please keep your KCC/ID ready.`;
    } else if (theme === 'crop_pests') {
      recipientShop = prescriptionItems[0]?.storeName || inputStores[0]?.name || 'Chandampet PACS Bio-Input Center';
      shopMsg = `📢 New Pest Rx #${orderRefId} from CLIC! Farmer ${selectedFarmer.name} needs: ${prescriptionItems.map(p => `${p.name} (Qty: ${p.quantity})`).join(', ')}. Total: ₹${totalPrescriptionBill.toLocaleString('en-IN')}. Please prepare stock.`;
      farmerMsg = `✅ CLIC Prescription #${orderRefId}: Treatment for ${selectedPest?.name} in ${selectedCropId.toUpperCase()}. Collect items at ${recipientShop}. Total: ₹${totalPrescriptionBill}.`;
    } else if (theme === 'crop_diseases') {
      recipientShop = prescriptionItems[0]?.storeName || inputStores[0]?.name || 'Chandampet PACS Bio-Input Center';
      shopMsg = `📢 New Crop Disease Rx #${orderRefId} from CLIC! Farmer ${selectedFarmer.name} needs: ${prescriptionItems.map(p => `${p.name} (Qty: ${p.quantity})`).join(', ')}. Total: ₹${totalPrescriptionBill.toLocaleString('en-IN')}. Please prepare stock.`;
      farmerMsg = `✅ CLIC Prescription #${orderRefId}: Treatment for ${selectedCropDisease?.name} in ${selectedCropId.toUpperCase()}. Collect items at ${recipientShop}. Total: ₹${totalPrescriptionBill}.`;
    } else {
      recipientShop = prescriptionItems[0]?.shopName || (theme === 'fish' ? 'Aqua Care Input Center' : 'Pashu Seva Kendra');
      shopMsg = `📢 New Clinical Rx #${orderRefId} from CLIC! Farmer ${selectedFarmer.name} needs: ${prescriptionItems.map(p => `${p.name} (Qty: ${p.quantity})`).join(', ')}. Total: ₹${totalPrescriptionBill.toLocaleString('en-IN')}. Please prepare stock.`;
      farmerMsg = `✅ CLIC Health Rx #${orderRefId}: Diagnosis confirmed for ${selectedDisease?.name}. Total: ₹${totalPrescriptionBill}. Pick up from ${recipientShop}.`;
    }

    const newAlerts = [
      {
        id: `ALT-DISP-${Date.now()}-1`,
        prescriptionId: orderRefId,
        type: 'shop_work_order',
        sender: 'CLIC Service Desk',
        recipient: recipientShop,
        message: shopMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Dispatched',
        icon: '📲'
      },
      {
        id: `ALT-DISP-${Date.now()}-2`,
        prescriptionId: orderRefId,
        type: 'farmer_advisory_sms',
        sender: 'CLIC Service Desk',
        recipient: `Farmer ${selectedFarmer.name} (${selectedFarmer.phone})`,
        message: farmerMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
        icon: '📩'
      }
    ];

    const updated = [newAlerts[0], newAlerts[1], ...dispatchedAlerts];
    setDispatchedAlerts(updated);
    localStorage.setItem('clic_disease_alerts', JSON.stringify(updated));

    setTimeout(() => {
      setClosureStage('shop_ack_received');
      const ackAlert = {
        id: `ALT-ACK-${Date.now()}-3`,
        prescriptionId: orderRefId,
        type: 'shop_acknowledgement',
        sender: recipientShop,
        recipient: `CLIC Facilitator & Farmer ${selectedFarmer.name}`,
        message: theme === 'machinery'
          ? `✅ Equipment Verified & Ready! ${recipientShop} confirmed availability of ${selectedMachine.name} for Farmer ${selectedFarmer.name}.`
          : `✅ Stock Acknowledged & Packed! ${recipientShop} has verified medications/inputs for Farmer ${selectedFarmer.name}. Ready for counter collection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
        icon: '📦'
      };
      setDispatchedAlerts(prev => {
        const nextList = [ackAlert, ...prev];
        localStorage.setItem('clic_disease_alerts', JSON.stringify(nextList));
        return nextList;
      });
    }, 2000);
  };

  const handleFinalClose = () => {
    const isMach = theme === 'machinery';
    const orderRefId = isMach
      ? (machineryChoice === 'rental' ? `CHC-RENT-${Date.now().toString().slice(-4)}` : `FMC-PUR-${Date.now().toString().slice(-4)}`)
      : (theme === 'crop_pests' ? `PEST-DISP-${Date.now().toString().slice(-4)}` :
         theme === 'crop_diseases' ? `DIS-DISP-${Date.now().toString().slice(-4)}` :
         `RX-${theme.toUpperCase()}-${Date.now().toString().slice(-4)}`);

    let serviceName = '';
    let categoryName = '';
    let pathogenName = '';

    if (theme === 'machinery') {
      serviceName = selectedMachine.name;
      categoryName = machineryChoice === 'rental' ? 'CHC Rental Fleet' : 'FMC Subsidy Purchase';
      pathogenName = selectedMachine.powerHP;
    } else if (theme === 'crop_pests') {
      serviceName = `${selectedPest?.name} (${selectedCropId.toUpperCase()})`;
      categoryName = `Crop Pest (${selectedPestCategory.toUpperCase()})`;
      pathogenName = selectedPest?.scientificName;
    } else if (theme === 'crop_diseases') {
      serviceName = `${selectedCropDisease?.name} (${selectedCropId.toUpperCase()})`;
      categoryName = `Crop Disease (Severity: ${selectedSeverity.toUpperCase()})`;
      pathogenName = selectedCropDisease?.pathogen;
    } else {
      serviceName = selectedDisease?.name;
      categoryName = selectedSpeciesId;
      pathogenName = selectedDisease?.pathogen;
    }

    const rxRecord = {
      id: orderRefId,
      theme,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerTelugu: selectedFarmer.telugu,
      farmerPhone: selectedFarmer.phone,
      village: selectedFarmer.village,
      district: selectedFarmer.district,
      query: farmerQueryText,
      serviceName,
      category: categoryName,
      pathogen: pathogenName,
      prescribedProducts: isMach ? [
        {
          name: selectedMachine.name,
          quantity: 1,
          unit: machineryChoice === 'rental' ? `${rentalDays} Days Rental` : 'New Machine',
          price: machineryChoice === 'rental' ? machineryRentalTotal.total : machineryPurchaseTotal.net,
          shopName: machineryChoice === 'rental' ? 'CHC Central Hub' : 'FMC Dealer'
        }
      ] : prescriptionItems,
      totalAmount: isMach ? (machineryChoice === 'rental' ? machineryRentalTotal.total : machineryPurchaseTotal.net) : totalPrescriptionBill,
      status: 'Completed & Dispensed',
      stage: 'final_closed',
      shopAlertStatus: 'Acknowledged & Scheduled',
      farmerAlertStatus: 'Delivered via SMS',
      facilitatorName: user?.name || 'Suresh Babu (CLIC Facilitator)'
    };

    const newQueryRecord = {
      id: `QRY-${Date.now().toString().slice(-4)}`,
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.phone,
      village: selectedFarmer.village,
      district: selectedFarmer.district,
      state: 'Telangana',
      query: farmerQueryText,
      facilitatorId: user?.id || 'fac-1',
      facilitatorName: user?.name || 'Suresh Babu (CLIC Facilitator)',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      theme,
      themeLabel: theme === 'crop_pests' ? 'Crop Pests' : theme === 'crop_diseases' ? 'Crop Diseases' : theme === 'fish' ? 'Fish Diseases' : theme === 'livestock' ? 'Livestock Care' : 'Farm Machinery',
      status: 'Completed & Dispensed'
    };

    const nextQueries = [newQueryRecord, ...farmerQueries.filter(q => q.query !== farmerQueryText)];
    setFarmerQueries(nextQueries);
    localStorage.setItem('clic_farmer_queries', JSON.stringify(nextQueries));

    const updatedRx = [rxRecord, ...prescriptionsHistory];
    setPrescriptionsHistory(updatedRx);
    localStorage.setItem('clic_disease_prescriptions', JSON.stringify(updatedRx));
    setClosureStage('final_closed');
  };

  const handleSaveCurrentQuery = () => {
    if (!farmerQueryText.trim() || !selectedFarmer) return;
    const newQueryRecord = {
      id: `QRY-${Date.now().toString().slice(-4)}`,
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.phone,
      village: selectedFarmer.village,
      district: selectedFarmer.district,
      state: 'Telangana',
      query: farmerQueryText.trim(),
      facilitatorId: user?.id || 'fac-1',
      facilitatorName: user?.name || 'Suresh Babu (CLIC Facilitator)',
      timestamp: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      theme,
      themeLabel: theme === 'crop_pests' ? 'Crop Pests' : theme === 'crop_diseases' ? 'Crop Diseases' : theme === 'fish' ? 'Fish Diseases' : theme === 'livestock' ? 'Livestock Care' : 'Farm Machinery',
      status: 'Logged & Active'
    };

    const nextQueries = [newQueryRecord, ...farmerQueries.filter(q => q.query !== farmerQueryText.trim())];
    setFarmerQueries(nextQueries);
    localStorage.setItem('clic_farmer_queries', JSON.stringify(nextQueries));

    const updatedFarmers = farmersList.map(f => f.id === selectedFarmer.id ? { ...f, activeQuery: farmerQueryText.trim() } : f);
    setFarmersList(updatedFarmers);
    localStorage.setItem('clic_farmers', JSON.stringify(updatedFarmers));

    setToastMsg(`✅ Stated query saved for ${selectedFarmer.name}!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setClosureStage('ready_for_dispatch');
    setPrescriptionItems([]);
  };

  const handleQuickRegisterFarmer = (e) => {
    e.preventDefault();
    if (!newFarmerForm.name || !newFarmerForm.phone) return;
    const created = {
      id: `f-${Date.now().toString().slice(-4)}`,
      name: newFarmerForm.name,
      telugu: newFarmerForm.telugu || newFarmerForm.name,
      phone: newFarmerForm.phone,
      village: newFarmerForm.village,
      district: newFarmerForm.district,
      landHolding: newFarmerForm.landHolding,
      soilType: newFarmerForm.soilType,
      crops: newFarmerForm.crops.split(',').map(c => c.trim()),
      subsidyCategory: newFarmerForm.subsidyCategory,
      activeQuery: newFarmerForm.activeQuery || farmerQueryText
    };

    const nextList = [created, ...farmersList];
    setFarmersList(nextList);
    localStorage.setItem('clic_farmers', JSON.stringify(nextList));
    setSelectedFarmer(created);
    if (newFarmerForm.activeQuery) setFarmerQueryText(newFarmerForm.activeQuery);
    setShowAddFarmerModal(false);
    setToastMsg(`Farmer ${created.name} registered successfully!`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="disease-workflow-page animate-fade-in-up">
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: 'var(--color-forest)', color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', fontWeight: 'bold', fontSize: 'var(--text-sm)' }} className="animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Top Banner Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Stethoscope className="text-forest animate-pulse" size={28} />
              <span>CLIC Diagnosis & Services Desk (Facilitator Central)</span>
            </h1>
            <p className="text-secondary" style={{ marginTop: '4px' }}>
              Complete walk-in facility for <strong>Farm Machinery (CHC/FMC)</strong>, <strong>Crops - Pests</strong>, <strong>Crops - Diseases</strong>, <strong>Fish Diseases</strong>, <strong>Livestock Care</strong>.
            </p>
          </div>

          {/* Module Switcher & Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="theme-pill-selector">
              <button
                className={`theme-pill-btn ${theme === 'machinery' ? 'active machinery' : ''}`}
                style={theme === 'machinery' ? { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff' } : {}}
                onClick={() => { setTheme('machinery'); setSearchParams({ theme: 'machinery' }); }}
              >
                <Tractor size={14} /> 🚜 Farm Machinery
              </button>
              <button
                className={`theme-pill-btn ${theme === 'crop_pests' ? 'active' : ''}`}
                style={theme === 'crop_pests' ? { background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#fff' } : {}}
                onClick={() => { setTheme('crop_pests'); setSearchParams({ theme: 'crop_pests' }); }}
              >
                <Bug size={14} /> 🐛 Crop Pests
              </button>
              <button
                className={`theme-pill-btn ${theme === 'crop_diseases' ? 'active' : ''}`}
                style={theme === 'crop_diseases' ? { background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff' } : {}}
                onClick={() => { setTheme('crop_diseases'); setSearchParams({ theme: 'crop_diseases' }); }}
              >
                <Sprout size={14} /> 🌿 Crop Diseases
              </button>
              <button
                className={`theme-pill-btn ${theme === 'fish' ? 'active fish' : ''}`}
                onClick={() => { setTheme('fish'); setSearchParams({ theme: 'fish' }); }}
              >
                <Fish size={14} /> 🐟 Fish Diseases
              </button>
              <button
                className={`theme-pill-btn ${theme === 'livestock' ? 'active livestock' : ''}`}
                onClick={() => { setTheme('livestock'); setSearchParams({ theme: 'livestock' }); }}
              >
                <Activity size={14} /> 🐄 Livestock Care
              </button>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={resetWorkflow}>
              <RefreshCw size={14} /> New Query
            </button>
            <a
              href="/data-upload"
              className="btn btn-forest btn-sm"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Database size={14} /> 📤 Upload Master / Rx Data
            </a>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="wf-tabs-row">
        <button
          className={`wf-tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => { setActiveTab('workflow'); setSearchParams({ tab: 'workflow', theme }); }}
        >
          <Layers size={16} /> 5-Step Guided Walk-in Workflow
        </button>
        <button
          className={`wf-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => { setActiveTab('orders'); setSearchParams({ tab: 'orders' }); }}
        >
          <FileText size={16} /> All Orders & Prescriptions ({prescriptionsHistory.length})
        </button>
        <button
          className={`wf-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => { setActiveTab('alerts'); setSearchParams({ tab: 'alerts' }); }}
        >
          <Bell size={16} /> Workflow Alerts Feed ({dispatchedAlerts.length})
        </button>
        <button
          className={`wf-tab-btn ${activeTab === 'onboarding' ? 'active' : ''}`}
          onClick={() => { setActiveTab('onboarding'); setSearchParams({ tab: 'onboarding' }); }}
        >
          <Building2 size={16} /> 🏛️ Onboard Entities (CHC/FMC/Stores)
        </button>
        <button
          className={`wf-tab-btn ${activeTab === 'queries' ? 'active' : ''}`}
          onClick={() => { setActiveTab('queries'); setSearchParams({ tab: 'queries' }); }}
        >
          <HelpCircle size={16} /> Farmer Queries Log
        </button>
      </div>

      {/* TAB 1: Main 5-Step Workflow */}
      {activeTab === 'workflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Stepper Header Bar */}
          <div className="wf-stepper-box">
            <div className="wf-stepper-top">
              <div className="wf-stepper-title">
                <span>
                  {theme === 'machinery' ? '🚜 Farm Machinery (CHC & FMC) Workflow' :
                   theme === 'crop_pests' ? '🐛 Crops - Pests Life Cycle & IPM Solution' :
                   theme === 'crop_diseases' ? '🌿 Crops - Diseases & Fungicide Solution' :
                   theme === 'fish' ? '🐟 Fish Diseases Advisory Workflow' :
                   '🐄 Livestock Diseases Healthcare Workflow'}
                </span>
                <span className="badge badge-sky" style={{ fontSize: '11px' }}>Step {currentStep} of 5</span>
              </div>
              <span className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                {WORKFLOW_STEPS[currentStep - 1]?.desc || ''}
              </span>
            </div>

            <div className="wf-step-bar-scroll">
              {WORKFLOW_STEPS.map((s) => {
                const isDone = currentStep > s.num;
                const isCur = currentStep === s.num;
                return (
                  <button
                    key={s.id}
                    className={`wf-step-item ${isCur ? 'active' : isDone ? 'completed' : ''}`}
                    onClick={() => setCurrentStep(s.num)}
                  >
                    <div className="wf-step-badge">
                      {isDone ? <Check size={12} /> : s.num}
                    </div>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 1: Farmer Walks in, Query & Retrieved Profile Dossier */}
          {currentStep === 1 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2><User className="text-forest" size={22} /> Step 1: Walk-in Farmer, Query & Retrieved Profile</h2>
                  <p>Select or register walk-in farmer; stated query and full landholding dossier are retrieved simultaneously.</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowAddFarmerModal(true)}>
                    <UserPlus size={14} /> + Quick Register Farmer
                  </button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                    Step 2: Identify Theme <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="walkin-split-grid">
                {/* Farmer Selection */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <label className="form-label" style={{ fontWeight: 'var(--font-bold)', margin: 0 }}>
                      Select Walk-in Farmer:
                    </label>
                    <input
                      type="search"
                      className="input-field"
                      style={{ width: '180px', padding: '4px 8px', fontSize: 'var(--text-xs)' }}
                      placeholder="Search farmer / phone..."
                      value={farmerSearch}
                      onChange={e => setFarmerSearch(e.target.value)}
                    />
                  </div>
                  <div className="farmer-picker-list">
                    {filteredFarmers.map(f => {
                      const isSel = selectedFarmer.id === f.id;
                      return (
                        <div
                          key={f.id}
                          className={`farmer-select-card ${isSel ? 'selected' : ''}`}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}
                          onClick={() => {
                            setSelectedFarmer(f);
                            if (f.activeQuery) setFarmerQueryText(f.activeQuery);
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
                              {f.name} <span className="telugu-text">({f.telugu})</span>
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                              📞 {f.phone} · 📍 {f.village} ({f.landHolding || '3.5 Acres'})
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '3px 8px', fontSize: '11px' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setFarmerToInspect(f);
                                setShowFarmerDetailsModal(true);
                              }}
                            >
                              <Info size={12} className="text-forest" /> More Details
                            </button>
                            {isSel && <span className="badge badge-green" style={{ fontSize: '10px' }}>Active</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Farmer Query Text */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ fontWeight: 'var(--font-bold)', margin: 0 }}>
                      Farmer's Stated Requirement / Walk-in Query:
                    </label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', padding: '3px 10px', color: 'var(--color-forest)', fontWeight: 'bold' }}
                      onClick={handleSaveCurrentQuery}
                      title="Save this query into the farmer's previous query history"
                    >
                      💾 Save / Log Query
                    </button>
                  </div>
                  <textarea
                    className="input-field"
                    rows="4"
                    value={farmerQueryText}
                    onChange={e => setFarmerQueryText(e.target.value)}
                    placeholder="Enter what the farmer is asking for (e.g., paddy blast diagnosis, stem borer medicine, tractor rotavator rental)..."
                  />

                  <div className="card mt-3 p-3" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Quick Suggested Queries:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={() => { setFarmerQueryText('Severe yellowing and hopper burn patches in paddy field.'); setTheme('crop_pests'); }}>
                        🐛 Paddy BPH / Pest
                      </button>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={() => { setFarmerQueryText('Spindle shaped eye lesions on paddy leaves and neck blast.'); setTheme('crop_diseases'); }}>
                        🌿 Paddy Blast Disease
                      </button>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={() => { setFarmerQueryText('Need tractor rotavator for 3.5 acres land prep.'); setTheme('machinery'); }}>
                        🚜 Tractor Rotavator Rental
                      </button>
                    </div>
                  </div>

                  {/* Previous Queries Record Section for Selected Farmer */}
                  <div className="card mt-3 p-3 border-sky" style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} className="text-sky" />
                        <span>📋 Previous Queries Record ({selectedFarmer.name}):</span>
                      </div>
                      <span className="badge badge-sky" style={{ fontSize: '10px' }}>
                        {selectedFarmerPreviousQueries.length} Past Records
                      </span>
                    </div>

                    {selectedFarmerPreviousQueries.length === 0 ? (
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                        No previous queries logged for {selectedFarmer.name}. This inquiry will be logged automatically upon completion.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '175px', overflowY: 'auto', paddingRight: '4px' }}>
                        {selectedFarmerPreviousQueries.map((item, idx) => {
                          const themeIcon = item.theme === 'machinery' ? '🚜' :
                                            item.theme === 'crop_pests' ? '🐛' :
                                            item.theme === 'crop_diseases' ? '🌿' :
                                            item.theme === 'fish' ? '🐟' : '🐄';
                          return (
                            <div
                              key={item.id || idx}
                              className="card p-2"
                              style={{ background: 'var(--color-bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', borderLeft: '3px solid var(--color-sky)' }}
                            >
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
                                  <span className="badge badge-sky" style={{ fontSize: '9px', padding: '1px 5px' }}>
                                    {themeIcon} {item.themeLabel || item.theme?.toUpperCase().replace(/_/g, ' ')}
                                  </span>
                                  <span className="badge badge-green" style={{ fontSize: '9px', padding: '1px 5px' }}>{item.status}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>⏱ {item.date}</span>
                                </div>
                                <p style={{ fontSize: '11px', color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                  "{item.query}"
                                </p>
                              </div>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '10px', padding: '3px 8px', whiteSpace: 'nowrap', color: 'var(--color-forest)', fontWeight: 'bold' }}
                                title="Load this query into the text field and activate theme"
                                onClick={() => {
                                  setFarmerQueryText(item.query);
                                  if (item.theme && ['machinery', 'crop_pests', 'crop_diseases', 'fish', 'livestock'].includes(item.theme)) {
                                    setTheme(item.theme);
                                  }
                                }}
                              >
                                Load ↗
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="wf-nav-actions" style={{ marginTop: 'var(--space-5)' }}>
                <div></div>
                <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                  Step 2: Identify Theme (Menu Board) <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Identify Theme on Menu Board */}
          {currentStep === 2 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2><Layers className="text-forest" size={22} /> Step 2: Identify Theme / Module on Menu Board</h2>
                  <p>Choose the target module to retrieve operations, equipment catalog, or clinical diagnosis protocols.</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft size={16} /> Back to Walk-in
                  </button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                    Proceed to Retrieve Info <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="menuboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {/* Machinery */}
                <div
                  className={`menuboard-card ${theme === 'machinery' ? 'selected' : ''}`}
                  style={theme === 'machinery' ? { borderColor: '#2563eb', background: 'linear-gradient(180deg, rgba(37, 99, 235, 0.05) 0%, var(--color-bg-card) 100%)' } : {}}
                  onClick={() => setTheme('machinery')}
                >
                  <div className="menuboard-icon">🚜</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '4px' }}>
                    Farm Machinery (CHC & FMC)
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    వ్యవసాయ యంత్రాలు & ఉపకరణాలు
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Custom Hiring Center (CHC) rental fleet & FMC 50% subsidized purchase across land prep, sowing, spraying & harvesting.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-sky">{MACHINERY_OPERATIONS.length} Ops · {FARM_MACHINES.length} Machines</span>
                    {theme === 'machinery' && <span className="badge badge-green">✓ Active</span>}
                  </div>
                </div>

                {/* Crops - Pests */}
                <div
                  className={`menuboard-card ${theme === 'crop_pests' ? 'selected' : ''}`}
                  style={theme === 'crop_pests' ? { borderColor: '#d97706', background: 'linear-gradient(180deg, rgba(217, 119, 6, 0.05) 0%, var(--color-bg-card) 100%)' } : {}}
                  onClick={() => setTheme('crop_pests')}
                >
                  <div className="menuboard-icon">🐛</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '4px' }}>
                    Crops - Pests Module
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    పంటలలో చీడపీడల నివారణ
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Sucking pests, Chewing pests & Borers across Paddy, Cotton, Chilli, Red Gram with life-cycle IPM & shop links.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-amber">{CROP_PESTS_DATA.length} Pests Cataloged</span>
                    {theme === 'crop_pests' && <span className="badge badge-green">✓ Active</span>}
                  </div>
                </div>

                {/* Crops - Diseases */}
                <div
                  className={`menuboard-card ${theme === 'crop_diseases' ? 'selected' : ''}`}
                  style={theme === 'crop_diseases' ? { borderColor: '#059669', background: 'linear-gradient(180deg, rgba(5, 150, 105, 0.05) 0%, var(--color-bg-card) 100%)' } : {}}
                  onClick={() => setTheme('crop_diseases')}
                >
                  <div className="menuboard-icon">🌿</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '4px' }}>
                    Crops - Diseases Module
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    పంట తెగుళ్లు & నివారణ
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Symptom recognition & severity staging (Mild/Moderate/Severe) for Blast, BLB, Wilt, Anthracnose.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-green">{CROP_DISEASES_DATA.length} Diseases Protocol</span>
                    {theme === 'crop_diseases' && <span className="badge badge-green">✓ Active</span>}
                  </div>
                </div>

                {/* Fish */}
                <div
                  className={`menuboard-card ${theme === 'fish' ? 'selected fish' : ''}`}
                  onClick={() => setTheme('fish')}
                >
                  <div className="menuboard-icon">🐟</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '4px' }}>
                    Fish - Diseases Advisory
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    చేపల వ్యాధులు & సంరక్షణ
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Clinical diagnosis for Catla, Rohu, Tilapia & Murrel with water sanitizers and antibiotic feeds.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-teal">{FISH_SPECIES.length} Species · {FISH_DISEASES.length} Pathogens</span>
                    {theme === 'fish' && <span className="badge badge-green">✓ Active</span>}
                  </div>
                </div>

                {/* Livestock */}
                <div
                  className={`menuboard-card ${theme === 'livestock' ? 'selected livestock' : ''}`}
                  onClick={() => setTheme('livestock')}
                >
                  <div className="menuboard-icon">🐄</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '4px' }}>
                    Livestock - Diseases Advisory
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    పశువుల వ్యాధులు & చికిత్స
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Veterinary healthcare protocols for Cattle, Dairy Buffalo, Goats, Sheep, and Poultry covering Mastitis & FMD.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-green">{LIVESTOCK_ANIMALS.length} Animals · {LIVESTOCK_DISEASES.length} Diseases</span>
                    {theme === 'livestock' && <span className="badge badge-green">✓ Active</span>}
                  </div>
                </div>
              </div>

              <div className="wf-nav-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} /> Previous: Walk-in & Profile
                </button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                  Step 3: Retrieve Info for {theme.toUpperCase().replace(/_/g, ' ')} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Retrieve Info & Operations / Diagnosis Details */}
          {currentStep === 3 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2>
                    {theme === 'machinery' ? <Tractor className="text-forest" size={22} /> :
                     theme === 'crop_pests' ? <Bug className="text-amber" size={22} /> :
                     theme === 'crop_diseases' ? <Sprout className="text-forest" size={22} /> :
                     theme === 'fish' ? <Fish className="text-sky" size={22} /> :
                     <Activity className="text-amber" size={22} />}
                    <span> Step 3: Retrieve Info & Operations / Clinical Protocols</span>
                  </h2>
                  <p>
                    {theme === 'machinery' ? 'Display operations $\rightarrow$ Farmer chooses operation $\rightarrow$ Display machinery $\rightarrow$ Identify machine $\rightarrow$ Video & Specs.' :
                     theme === 'crop_pests' ? 'Display crops $\rightarrow$ Choose crop $\rightarrow$ Retrieve pest categories $\rightarrow$ List of pests $\rightarrow$ Life cycle of pest $\rightarrow$ Identify stage $\rightarrow$ Control measures & video.' :
                     theme === 'crop_diseases' ? 'Display crops $\rightarrow$ Choose crop $\rightarrow$ Retrieve diseases with symptoms $\rightarrow$ Identify disease $\rightarrow$ Identify severity $\rightarrow$ Control measures & video.' :
                     'Display species $\rightarrow$ Choose animal/fish $\rightarrow$ Retrieve diseases with symptoms $\rightarrow$ Identify disease $\rightarrow$ Control measures & video.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft size={16} /> Back to Theme
                  </button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
                    Proceed to Step 4: Purchase Choice <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Machinery */}
              {theme === 'machinery' && (
                <div>
                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                    1. Display Operations (Farmer chooses operation):
                  </label>
                  <div className="species-carousel">
                    {MACHINERY_OPERATIONS.map(op => (
                      <div
                        key={op.id}
                        className={`species-tile ${selectedOperationId === op.id ? 'active' : ''}`}
                        onClick={() => handleSelectOperation(op.id)}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '6px' }}>{op.icon}</div>
                        <div className="species-tile-name">{op.name.split('/')[0]}</div>
                        <div className="species-tile-telugu">{op.telugu.split('/')[0]}</div>
                      </div>
                    ))}
                  </div>

                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                    2. Display Machines for {MACHINERY_OPERATIONS.find(o => o.id === selectedOperationId)?.name} (Farmer identifies machine):
                  </label>
                  <div className="diseases-grid">
                    {filteredMachines.map(m => (
                      <div
                        key={m.id}
                        className={`disease-card ${selectedMachine?.id === m.id ? 'selected' : ''}`}
                        onClick={() => setSelectedMachine(m)}
                      >
                        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                          <span style={{ fontSize: '36px' }}>{m.icon}</span>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)' }}>{m.name}</h4>
                            <span className="telugu-text text-secondary" style={{ fontSize: 'var(--text-xs)' }}>{m.telugu}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                          {m.description}
                        </p>
                        <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="badge badge-sky">{m.powerHP}</span>
                          <span className="text-forest font-bold" style={{ fontSize: 'var(--text-xs)' }}>
                            {selectedMachine?.id === m.id ? '✓ Selected Machine' : 'Click to Select'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crops - Pests */}
              {theme === 'crop_pests' && (
                <div>
                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                    1. Display All Crops (Farmer chooses the crop):
                  </label>
                  <div className="species-carousel">
                    {CROP_THEMES.map(c => (
                      <div
                        key={c.id}
                        className={`species-tile ${selectedCropId === c.id ? 'active' : ''}`}
                        onClick={() => setSelectedCropId(c.id)}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '6px' }}>{c.icon}</div>
                        <div className="species-tile-name">{c.name.split('(')[0]}</div>
                        <div className="species-tile-telugu">{c.telugu}</div>
                      </div>
                    ))}
                  </div>

                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                    2. Retrieve & Display Pest Categories (i.e. Sucking Pests, Chewing Pests, Borers):
                  </label>
                  <div className="pest-category-grid">
                    {PEST_CATEGORIES.map(cat => {
                      const isSel = selectedPestCategory === cat.id;
                      const countInCrop = CROP_PESTS_DATA.filter(p => p.cropId === selectedCropId && p.category === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className={`pest-category-card ${isSel ? 'selected' : ''}`}
                          onClick={() => setSelectedPestCategory(cat.id)}
                        >
                          <div className="pest-cat-top">
                            <div className="pest-cat-icon-badge">{cat.icon}</div>
                            <span className={`badge ${isSel ? 'badge-amber' : 'badge-secondary'}`} style={{ fontSize: '11px' }}>
                              {countInCrop > 0 ? `${countInCrop} Pests in ${CROP_THEMES.find(c => c.id === selectedCropId)?.name || 'Crop'}` : 'General Category'}
                            </span>
                          </div>

                          <div className="pest-cat-title-block">
                            <div className="pest-cat-name">
                              {cat.label}
                            </div>
                            <span className="pest-cat-telugu telugu-text">
                              {cat.telugu}
                            </span>
                          </div>

                          <p className="pest-cat-desc">
                            {cat.desc}
                          </p>

                          <div className="pest-cat-footer">
                            <span style={{ color: isSel ? '#d97706' : 'var(--color-text-muted)', fontWeight: isSel ? 'bold' : 'normal' }}>
                              {isSel ? '✓ Active Category Selected' : 'Click to View Pests'}
                            </span>
                            <ArrowRight size={14} className={isSel ? 'text-amber' : 'text-muted'} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                    3. List of Pests in Category (Farmer chooses the pest):
                  </label>
                  <div className="diseases-grid">
                    {filteredCropPests.map(p => (
                      <div
                        key={p.id}
                        className={`disease-card ${selectedPest?.id === p.id ? 'selected' : ''}`}
                        style={selectedPest?.id === p.id ? { borderColor: '#d97706', background: 'rgba(217, 119, 6, 0.04)' } : {}}
                        onClick={() => {
                          setSelectedPest(p);
                          if (p.lifeCycle?.length) {
                            setSelectedPestStage(p.lifeCycle.find(s => s.keyStage)?.stage || p.lifeCycle[0].stage);
                          }
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{p.name}</h4>
                            <span className="telugu-text text-secondary" style={{ fontSize: '11px' }}>{p.telugu}</span>
                          </div>
                          <span className="badge badge-amber" style={{ fontSize: '10px' }}>{p.category.toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                          {p.damageSymptoms}
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '11px', color: '#d97706', fontWeight: 'bold' }}>
                          {selectedPest?.id === p.id ? '✓ Active Diagnosed Pest' : 'Click to Select'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Life Cycle & Identification of Stage */}
                  {selectedPest && (
                    <div className="card mt-4 p-4 border-amber" style={{ background: 'var(--color-bg-card)' }}>
                      <div className="section-title" style={{ color: '#d97706', display: 'flex', justifyContent: 'space-between' }}>
                        <span>4. Pest Life Cycle (Farmer identifies the stage of the pest)</span>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVideo(selectedPest.video?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ', `Pest Management Video: ${selectedPest.name}`)}
                        >
                          <Play size={14} className="text-amber" /> 🎬 Video on Preparation
                        </button>
                      </div>

                      <div className="grid-4-col mt-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                        {selectedPest.lifeCycle?.map(stageItem => {
                          const isSel = selectedPestStage === stageItem.stage;
                          return (
                            <div
                              key={stageItem.stage}
                              className={`card p-3 ${isSel ? 'border-amber shadow-md' : ''}`}
                              style={{
                                cursor: 'pointer',
                                background: isSel ? 'rgba(217, 119, 6, 0.12)' : 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)'
                              }}
                              onClick={() => setSelectedPestStage(stageItem.stage)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '24px' }}>{stageItem.icon}</span>
                                {stageItem.keyStage && <span className="badge badge-red" style={{ fontSize: '9px' }}>Critical Window</span>}
                              </div>
                              <h4 style={{ margin: '4px 0 2px 0', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{stageItem.stage}</h4>
                              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Duration: {stageItem.duration}</div>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                                {stageItem.desc}
                              </p>
                              <div style={{ fontSize: '10px', color: '#d97706', fontWeight: 'bold', marginTop: '6px' }}>
                                🎯 {stageItem.vulnerability}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Control Measures & Inoculum */}
                      <div className="grid-3-col mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                        <div className="card p-3" style={{ background: 'rgba(5, 150, 105, 0.06)', borderLeft: '4px solid #059669' }}>
                          <h5 style={{ color: '#059669', margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🌿 Cultural Control:</h5>
                          <p style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.4 }}>{selectedPest.controlMeasures?.cultural}</p>
                        </div>
                        <div className="card p-3" style={{ background: 'rgba(37, 99, 235, 0.06)', borderLeft: '4px solid #2563eb' }}>
                          <h5 style={{ color: '#2563eb', margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🐞 Biological Control:</h5>
                          <p style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.4 }}>{selectedPest.controlMeasures?.biological}</p>
                        </div>
                        <div className="card p-3" style={{ background: 'rgba(217, 119, 6, 0.06)', borderLeft: '4px solid #d97706' }}>
                          <h5 style={{ color: '#d97706', margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🧪 Target Chemical / Bio-Pesticide:</h5>
                          <p style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.4 }}>{selectedPest.controlMeasures?.chemical}</p>
                        </div>
                      </div>

                      <div className="card mt-3 p-3" style={{ background: 'var(--color-bg-secondary)' }}>
                        <h5 style={{ margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>📄 Inoculum / Formulation Text:</h5>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          <strong>Formula:</strong> {selectedPest.inoculum?.formula} · <strong>Dosage:</strong> {selectedPest.inoculum?.dosagePerAcre}
                        </div>
                        <ul style={{ margin: '6px 0 0 16px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          {selectedPest.inoculum?.preparationSteps?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Crops - Diseases */}
              {theme === 'crop_diseases' && (
                <div>
                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                    1. Display All Crops (Farmer chooses the crop):
                  </label>
                  <div className="species-carousel">
                    {CROP_THEMES.map(c => (
                      <div
                        key={c.id}
                        className={`species-tile ${selectedCropId === c.id ? 'active' : ''}`}
                        onClick={() => setSelectedCropId(c.id)}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '6px' }}>{c.icon}</div>
                        <div className="species-tile-name">{c.name.split('(')[0]}</div>
                        <div className="species-tile-telugu">{c.telugu}</div>
                      </div>
                    ))}
                  </div>

                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                    2. Retrieve and Display All Diseases with Symptoms:
                  </label>
                  <div className="diseases-grid">
                    {filteredCropDiseases.map(d => (
                      <div
                        key={d.id}
                        className={`disease-card ${selectedCropDisease?.id === d.id ? 'selected' : ''}`}
                        style={selectedCropDisease?.id === d.id ? { borderColor: '#059669', background: 'rgba(5, 150, 105, 0.04)' } : {}}
                        onClick={() => setSelectedCropDisease(d)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{d.name}</h4>
                            <span className="telugu-text text-secondary" style={{ fontSize: '11px' }}>{d.telugu}</span>
                          </div>
                          <span className="badge badge-green" style={{ fontSize: '10px' }}>{d.causalAgent}</span>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                          {d.symptoms}
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '11px', color: '#059669', fontWeight: 'bold' }}>
                          {selectedCropDisease?.id === d.id ? '✓ Identified Disease' : 'Click to Diagnose'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Severity Identification & Control Measures */}
                  {selectedCropDisease && (
                    <div className="card mt-4 p-4 border-green" style={{ background: 'var(--color-bg-card)' }}>
                      <div className="section-title" style={{ color: '#059669', display: 'flex', justifyContent: 'space-between' }}>
                        <span>3. Severity Staging (Farmer identifies severity)</span>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVideo(selectedCropDisease.video?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ', `Spray Guide: ${selectedCropDisease.name}`)}
                        >
                          <Play size={14} className="text-green" /> 🎬 Video on Spraying Technique
                        </button>
                      </div>

                      <div className="grid-3-col mt-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
                        {selectedCropDisease.severityLevels?.map(sev => {
                          const isSel = selectedSeverity === sev.level;
                          return (
                            <div
                              key={sev.level}
                              className={`card p-3 ${isSel ? 'border-green shadow-md' : ''}`}
                              style={{
                                cursor: 'pointer',
                                background: isSel ? 'rgba(5, 150, 105, 0.12)' : 'var(--color-bg-secondary)',
                                borderRadius: 'var(--radius-md)'
                              }}
                              onClick={() => setSelectedSeverity(sev.level)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={`badge ${sev.level === 'mild' ? 'badge-green' : sev.level === 'moderate' ? 'badge-amber' : 'badge-red'}`}>
                                  {sev.urgency} Urgency
                                </span>
                              </div>
                              <h4 style={{ margin: '6px 0 2px 0', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{sev.label}</h4>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                                {sev.advice}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Control Measures */}
                      <div className="grid-3-col mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-3)' }}>
                        <div className="card p-3" style={{ background: 'rgba(5, 150, 105, 0.06)', borderLeft: '4px solid #059669' }}>
                          <h5 style={{ color: '#059669', margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🌿 Organic / Bio-Control:</h5>
                          <p style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.4 }}>{selectedCropDisease.controlMeasures?.organic_biocontrol}</p>
                        </div>
                        <div className="card p-3" style={{ background: 'rgba(37, 99, 235, 0.06)', borderLeft: '4px solid #2563eb' }}>
                          <h5 style={{ color: '#2563eb', margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🧪 Chemical Fungicide:</h5>
                          <p style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.4 }}>{selectedCropDisease.controlMeasures?.chemical_fungicide}</p>
                        </div>
                        <div className="card p-3" style={{ background: 'rgba(217, 119, 6, 0.06)', borderLeft: '4px solid #d97706' }}>
                          <h5 style={{ color: '#d97706', margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🛡️ Preventive Sanitation:</h5>
                          <p style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.4 }}>{selectedCropDisease.controlMeasures?.preventive_measures}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fish / Livestock */}
              {(theme === 'fish' || theme === 'livestock') && (
                <div>
                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
                    1. Display All Types of {theme === 'fish' ? 'Fish' : 'Livestock'} (Farmer chooses):
                  </label>
                  <div className="species-carousel">
                    {speciesList.map(sp => (
                      <div
                        key={sp.id}
                        className={`species-tile ${selectedSpeciesId === sp.id ? 'active' : ''}`}
                        onClick={() => handleSelectSpecies(sp.id)}
                      >
                        <div style={{ fontSize: '32px', marginBottom: '6px' }}>{sp.icon}</div>
                        <div className="species-tile-name">{sp.name.split('(')[0]}</div>
                        <div className="species-tile-telugu">{sp.telugu}</div>
                      </div>
                    ))}
                  </div>

                  <label className="form-label" style={{ fontWeight: 'var(--font-bold)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
                    2. Retrieve and Display Diseases with Symptoms:
                  </label>
                  <div className="diseases-grid">
                    {filteredDiseases.map(d => (
                      <div
                        key={d.id}
                        className={`disease-card ${selectedDisease?.id === d.id ? 'selected' : ''}`}
                        onClick={() => setSelectedDisease(d)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{d.name}</h4>
                            <span className="telugu-text text-secondary" style={{ fontSize: '11px' }}>{d.telugu}</span>
                          </div>
                          <span className="badge badge-red">{d.severity}</span>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
                          {d.symptoms}
                        </p>
                        <div style={{ marginTop: 'auto', paddingTop: '8px', fontSize: '11px', color: 'var(--color-forest)', fontWeight: 'bold' }}>
                          {selectedDisease?.id === d.id ? '✓ Active Diagnosis' : 'Click to Select'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="wf-nav-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={16} /> Previous: Theme Selection
                </button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
                  Proceed to Step 4: Purchase / Service Fulfillment <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Shop / Hub Fulfillment Choice */}
          {currentStep === 4 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2><ShoppingCart className="text-forest" size={22} /> Step 4: Purchase — Link to Input Shop / Hub</h2>
                  <p>
                    {theme === 'machinery'
                      ? 'Farmer chooses between CHC Hub Equipment Rental or FMC Authorized Dealership Purchase.'
                      : 'Purchase remedies linked directly to Onboarded PACS Input Stores / LS Shops with live inventory and pricing.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                    <ArrowLeft size={16} /> Back to Details
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(5)}
                    disabled={theme !== 'machinery' && prescriptionItems.length === 0}
                  >
                    Step 5: Alerts & Closure <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Machinery */}
              {theme === 'machinery' && (
                <div>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                    <button
                      className={`btn ${machineryChoice === 'rental' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '14px' }}
                      onClick={() => setMachineryChoice('rental')}
                    >
                      <Wrench size={18} /> Option A: CHC Hub Rental Fleet
                    </button>
                    <button
                      className={`btn ${machineryChoice === 'purchase' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '14px' }}
                      onClick={() => setMachineryChoice('purchase')}
                    >
                      <Store size={18} /> Option B: FMC Dealer Purchase with Subsidy
                    </button>
                  </div>

                  {machineryChoice === 'rental' ? (
                    <div style={{ background: 'var(--color-bg-elevated)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Wrench className="text-forest" size={20} /> Custom Hiring Center (CHC) Rental Booking
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                        <div>
                          <label className="form-label">Select CHC Hub Center:</label>
                          <select className="input-field" value={selectedChcHubId} onChange={e => setSelectedChcHubId(e.target.value)}>
                            {chcHubs.map(h => (
                              <option key={h.id} value={h.id}>{h.name} ({h.village})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label">Rental Duration (Days):</label>
                          <input type="number" className="input-field" min={1} max={30} value={rentalDays} onChange={e => setRentalDays(Math.max(1, +e.target.value))} />
                        </div>

                        <div>
                          <label className="form-label">Rental Start Date:</label>
                          <input type="date" className="input-field" value={rentalDate} onChange={e => setRentalDate(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '28px' }}>
                          <input type="checkbox" id="fac-operator-check" checked={includeOperator} onChange={e => setIncludeOperator(e.target.checked)} />
                          <label htmlFor="fac-operator-check" style={{ fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                            Include Trained Operator & Fuel (+₹800/day)
                          </label>
                        </div>
                      </div>

                      <div className="total-calculation-box mt-4">
                        <div className="calc-row">
                          <span>Base Machine Daily Rent:</span>
                          <span>₹{selectedMachine?.chcAvailability?.rateDaily || 2500} × {rentalDays} Days</span>
                        </div>
                        {includeOperator && (
                          <div className="calc-row">
                            <span>Operator Assistance:</span>
                            <span>₹800 × {rentalDays} Days</span>
                          </div>
                        )}
                        <div className="calc-row">
                          <span>Security Deposit (Refundable):</span>
                          <span>₹{machineryRentalTotal.deposit}</span>
                        </div>
                        <div className="calc-row grand-total">
                          <span>Total Rental Amount:</span>
                          <span className="text-forest">₹{machineryRentalTotal.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: 'var(--color-bg-elevated)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                      <h4 style={{ fontWeight: 'bold', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Store className="text-amber" size={20} /> Farm Machinery Corporation (FMC) Subsidized Dealership
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                        <div>
                          <label className="form-label">Select Authorized FMC Dealer:</label>
                          <select className="input-field" value={selectedFmcShopId} onChange={e => setSelectedFmcShopId(e.target.value)}>
                            {fmcShops.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.village})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="form-label">Financing & Subsidy Method:</label>
                          <select className="input-field" value={purchasePaymentMode} onChange={e => setPurchasePaymentMode(e.target.value)}>
                            <option>Kisan Credit Card (KCC) + Govt Subsidy</option>
                            <option>Direct Bank Transfer + DBT Subsidy</option>
                            <option>PACS Primary Society Loan</option>
                          </select>
                        </div>
                      </div>

                      <div className="total-calculation-box mt-4">
                        <div className="calc-row">
                          <span>Manufacturer MSRP:</span>
                          <span>₹{machineryPurchaseTotal.msrp.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="calc-row text-green">
                          <span>Govt Farm Mechanization Subsidy (50%):</span>
                          <span>- ₹{machineryPurchaseTotal.subsidy.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="calc-row grand-total">
                          <span>Net Farmer Payable:</span>
                          <span className="text-amber">₹{machineryPurchaseTotal.net.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Crop Pests / Crop Diseases / Fish / Livestock Input Store & Medicines */}
              {theme !== 'machinery' && (
                <div>
                  <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                      🏬 Purchase: Link to Input Shop / Pharmacy (Inventory with Price) for{' '}
                      {theme === 'crop_pests' ? selectedPest?.name :
                       theme === 'crop_diseases' ? selectedCropDisease?.name :
                       selectedDisease?.name}
                    </span>
                    <span className="badge badge-sky">{prescriptionItems.length} Added to Cart</span>
                  </div>

                  <div className="products-grid-list mt-3">
                    {(theme === 'crop_pests' ? selectedPest?.recommendedProducts :
                      theme === 'crop_diseases' ? selectedCropDisease?.recommendedProducts :
                      selectedDisease?.recommendedMedicines)?.map((prod, idx) => {
                      const isAdded = prescriptionItems.some(p => p.id === (prod.id || `rec-${idx}`));
                      const prodObj = {
                        id: prod.id || `rec-${idx}`,
                        name: prod.name,
                        unitPrice: prod.unitPrice || prod.price || 250,
                        storeName: prod.storeName || (theme === 'crop_pests' || theme === 'crop_diseases' ? 'Chandampet PACS Bio-Input Center' : 'Pashu Seva Kendra'),
                        stock: prod.stock || 50,
                        pack: prod.pack || prod.dosage || '1 unit'
                      };

                      return (
                        <div key={prodObj.id} className={`product-order-card ${isAdded ? 'selected' : ''}`}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', margin: 0 }}>{prodObj.name}</h4>
                              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>📍 {prodObj.storeName} ({prodObj.pack})</span>
                            </div>
                            <span className="cost-val text-green">₹{prodObj.unitPrice}</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                            <span className="badge badge-green" style={{ fontSize: '10px' }}>In Stock ({prodObj.stock})</span>
                            <button
                              className={`btn btn-sm ${isAdded ? 'btn-danger' : 'btn-primary'}`}
                              onClick={() => togglePrescriptionProduct(prodObj)}
                            >
                              {isAdded ? 'Remove' : '+ Add to Cart'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {prescriptionItems.length > 0 && (
                    <div className="card mt-4 border-green p-4">
                      <h4 className="section-title">Selected Prescription Order Items</h4>
                      <table className="data-table mt-2">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Shop / Store</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptionItems.map(item => (
                            <tr key={item.id}>
                              <td><strong>{item.name}</strong></td>
                              <td>{item.storeName}</td>
                              <td>₹{item.unitPrice}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <button className="btn btn-secondary btn-sm" onClick={() => updateProductQty(item.id, -1)}>-</button>
                                  <span>{item.quantity || 1}</span>
                                  <button className="btn btn-secondary btn-sm" onClick={() => updateProductQty(item.id, 1)}>+</button>
                                </div>
                              </td>
                              <td className="text-green font-bold">₹{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ textAlign: 'right', marginTop: 'var(--space-3)', fontSize: 'var(--text-base)', fontWeight: 'bold' }}>
                        Total Prescription Bill: <span className="text-green">₹{totalPrescriptionBill.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="wf-nav-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft size={16} /> Previous: Info & Details
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(5)}
                  disabled={theme !== 'machinery' && prescriptionItems.length === 0}
                >
                  Proceed to Step 5: Alerts & Closure <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Multi-Stage Alert Dispatch & Closure */}
          {currentStep === 5 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2><Bell className="text-forest" size={22} /> Step 5: Close Workflow & Multi-Stage Alert Exchange</h2>
                  <p>
                    Follow the closed-loop communication cycle: Alert to Hub / Shop $\rightarrow$ Alert to Farmer $\rightarrow$ Alert back from Hub / Shop $\rightarrow$ Final Case Close.
                  </p>
                </div>
                {closureStage === 'final_closed' && (
                  <button className="btn btn-secondary" onClick={resetWorkflow}>
                    <Plus size={16} /> Start New Walk-in Query
                  </button>
                )}
              </div>

              <div className="alert-workflow-pipeline">
                {/* Stage 1: Dispatches to Hub/Shop & Farmer */}
                <div className={`alert-stage-box ${closureStage === 'ready_for_dispatch' ? 'active' : 'completed'}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-sky">Stage 5A</span>
                      <span>Dispatch Alert to Shop / Hub & Alert to Farmer</span>
                    </h4>
                    {closureStage !== 'ready_for_dispatch' && (
                      <span className="badge badge-green">✓ Dispatched</span>
                    )}
                  </div>

                  <div className="alert-bubbles-row">
                    <div className="alert-bubble-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xs)' }}>
                        <Send size={14} className="text-forest" /> Outgoing Alert $\rightarrow$ Shop / Hub
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-card)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                        {theme === 'machinery'
                          ? `"New Order from CLIC: Farmer ${selectedFarmer.name} (${selectedFarmer.phone}) booked ${selectedMachine?.name}. Total: ₹${(machineryChoice === 'rental' ? machineryRentalTotal.total : machineryPurchaseTotal.net).toLocaleString('en-IN')}."`
                          : `"New Rx Order from CLIC: Farmer ${selectedFarmer.name} needs: ${prescriptionItems.map(p => `${p.name} (x${p.quantity})`).join(', ')}. Total: ₹${totalPrescriptionBill}."`}
                      </div>
                    </div>

                    <div className="alert-bubble-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xs)' }}>
                        <Send size={14} className="text-sky" /> Outgoing SMS $\rightarrow$ Farmer {selectedFarmer.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-card)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                        {theme === 'machinery'
                          ? `"CLIC Booking Alert: Your request for ${selectedMachine?.name} has been placed."`
                          : `"CLIC Health Rx: Diagnosis confirmed. Total: ₹${totalPrescriptionBill}. Pick up from local Input Store / Shop."`}
                      </div>
                    </div>
                  </div>

                  {closureStage === 'ready_for_dispatch' && (
                    <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={handleDispatchAlerts}>
                      <Send size={14} /> Close Alert to Shop & Alert to Farmer
                    </button>
                  )}
                </div>

                {/* Stage 2: Alert back from Hub/Shop */}
                {closureStage !== 'ready_for_dispatch' && (
                  <div className={`alert-stage-box ${closureStage === 'alerts_dispatched' ? 'active animate-pulse' : 'completed'} animate-fade-in`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-amber">Stage 5B</span>
                        <span>Alert to Back from Shop / Hub</span>
                      </h4>
                      {closureStage === 'shop_ack_received' || closureStage === 'final_closed' ? (
                        <span className="badge badge-green">✓ Response Received</span>
                      ) : (
                        <span className="badge badge-amber">Awaiting Operator Confirmation...</span>
                      )}
                    </div>

                    <div style={{ marginTop: 'var(--space-3)' }}>
                      {closureStage === 'alerts_dispatched' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Waiting for shop / hub operator to confirm stock / equipment...</span>
                        </div>
                      ) : (
                        <div className="alert-bubble-card" style={{ background: 'rgba(5, 150, 105, 0.06)', borderColor: 'var(--color-mint)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xs)', color: 'var(--color-mint)' }}>
                            <CheckCircle2 size={14} /> Incoming Confirmation Alert
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-primary)' }}>
                            {theme === 'machinery'
                              ? `"Equipment allocation verified and reserved for Farmer ${selectedFarmer.name}! Ready for scheduled dispatch."`
                              : `"Prescription verified & inputs packed for Farmer ${selectedFarmer.name}! Ready for counter collection."`}
                          </div>
                        </div>
                      )}
                    </div>

                    {closureStage === 'shop_ack_received' && (
                      <button className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }} onClick={handleFinalClose}>
                        <CheckCircle2 size={14} /> Final Case Close & Log Transaction
                      </button>
                    )}
                  </div>
                )}

                {/* Final Closed Confirmation Box */}
                {closureStage === 'final_closed' && (
                  <div className="card p-4 text-center border-green animate-fade-in" style={{ background: 'rgba(5, 150, 105, 0.08)' }}>
                    <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--color-mint)' }}>
                      Walk-in Case Closed Successfully!
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '6px auto' }}>
                      Order transaction has been recorded in the District Orders Registry and alerts dispatched to both the shop and the farmer.
                    </p>
                    <div className="mt-3" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('orders')}>
                        <FileText size={14} /> View in District Registry
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={resetWorkflow}>
                        <Plus size={14} /> Start New Query
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Orders & Prescriptions Registry */}
      {activeTab === 'orders' && (
        <div className="card p-4 animate-fade-in">
          <div className="section-title" style={{ justifyContent: 'space-between', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <span>District Orders & Prescriptions Registry ({prescriptionsHistory.length})</span>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <select
                className="input-field"
                style={{ width: '160px', padding: '4px 8px', fontSize: '12px' }}
                value={ordersFilterModule}
                onChange={e => setOrdersFilterModule(e.target.value)}
              >
                <option value="all">All Modules</option>
                <option value="machinery">Farm Machinery</option>
                <option value="crop_pests">Crop Pests</option>
                <option value="crop_diseases">Crop Diseases</option>
                <option value="fish">Fish Diseases</option>
                <option value="livestock">Livestock Care</option>
              </select>
              <input
                type="search"
                className="input-field"
                style={{ width: '180px', padding: '4px 8px', fontSize: '12px' }}
                placeholder="Search farmer / ID..."
                value={ordersSearch}
                onChange={e => setOrdersSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="data-table mt-3">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Farmer Profile</th>
                <th>Module & Service</th>
                <th>Prescribed Items / Machine</th>
                <th>Total Value</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {prescriptionsHistory
                .filter(o => ordersFilterModule === 'all' || o.theme === ordersFilterModule)
                .filter(o => !ordersSearch || (o.farmerName && o.farmerName.toLowerCase().includes(ordersSearch.toLowerCase())) || o.id.toLowerCase().includes(ordersSearch.toLowerCase()))
                .map(o => (
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong></td>
                    <td>{o.date} {o.time}</td>
                    <td>
                      <div><strong>{o.farmerName}</strong></div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>📞 {o.farmerPhone} · 📍 {o.village}</div>
                    </td>
                    <td>
                      <div>{o.serviceName}</div>
                      <span className="badge badge-sky" style={{ fontSize: '10px' }}>{o.category}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px' }}>
                        {o.prescribedProducts?.map((p, idx) => (
                          <div key={idx}>• {p.name} ({p.unit || `${p.quantity || 1} units`})</div>
                        ))}
                      </div>
                    </td>
                    <td className="text-forest font-bold">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-green">{o.status}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Workflow Alerts Feed */}
      {activeTab === 'alerts' && (
        <div className="card p-4 animate-fade-in">
          <div className="section-title">Central Alerts Feed ({dispatchedAlerts.length})</div>
          <div className="alerts-feed-list mt-3">
            {dispatchedAlerts.map(a => (
              <div key={a.id} className="alert-feed-card">
                <div className="alert-feed-header">
                  <span style={{ fontSize: '20px' }}>{a.icon || '📩'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{a.type?.replace(/_/g, ' ').toUpperCase()}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>From: {a.sender} $\rightarrow$ To: {a.recipient} · {a.timestamp}</div>
                  </div>
                  <span className="badge badge-green">{a.status}</span>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                  {a.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Entity Onboarding Hub */}
      {activeTab === 'onboarding' && (
        <div className="card p-4 animate-fade-in">
          <div className="section-title">🏛️ Onboard Operational Centers & Hubs</div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Register new Custom Hiring Centers (CHC), FMC Machinery Dealerships, PACS Agri-Input Centers, and Livestock Entrepreneur Shops into the CLIC district network.
          </p>

          <div className="choice-pill-toggle mb-4">
            <button className={`choice-toggle-btn ${onboardType === 'chc' ? 'active' : ''}`} onClick={() => setOnboardType('chc')}>
              🚜 CHC Hubs ({chcHubs.length})
            </button>
            <button className={`choice-toggle-btn ${onboardType === 'fmc' ? 'active' : ''}`} onClick={() => setOnboardType('fmc')}>
              🏪 FMC Dealers ({fmcShops.length})
            </button>
            <button className={`choice-toggle-btn ${onboardType === 'input' ? 'active' : ''}`} onClick={() => setOnboardType('input')}>
              🌱 PACS Input Stores ({inputStores.length})
            </button>
            <button className={`choice-toggle-btn ${onboardType === 'ls' ? 'active' : ''}`} onClick={() => setOnboardType('ls')}>
              🐄 LS Shops ({lsShops.length})
            </button>
          </div>

          <div className="grid-2-col">
            {/* List */}
            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '8px' }}>Active Registered Entities:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(onboardType === 'chc' ? chcHubs : onboardType === 'fmc' ? fmcShops : onboardType === 'input' ? inputStores : lsShops).map(ent => (
                  <div key={ent.id} className="card p-3" style={{ background: 'var(--color-bg-secondary)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{ent.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      In-Charge: {ent.inCharge} · 📞 {ent.phone} · 📍 {ent.village}, {ent.district}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Register Form */}
            <div className="card p-4 border-green">
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: '12px' }}>
                + Onboard New {onboardType.toUpperCase()} Center
              </h4>
              <form onSubmit={e => {
                e.preventDefault();
                if (!onboardForm.name || !onboardForm.phone) return;
                const newEnt = {
                  id: `${onboardType}-${Date.now().toString().slice(-4)}`,
                  name: onboardForm.name,
                  inCharge: onboardForm.inCharge || 'Supervisor',
                  phone: onboardForm.phone,
                  email: onboardForm.email || `${onboardType}@clic.in`,
                  village: onboardForm.village,
                  district: onboardForm.district,
                  status: 'Active'
                };
                if (onboardType === 'chc') {
                  const updated = [newEnt, ...chcHubs];
                  setChcHubs(updated);
                  localStorage.setItem('clic_custom_chc', JSON.stringify(updated));
                } else if (onboardType === 'fmc') {
                  const updated = [newEnt, ...fmcShops];
                  setFmcShops(updated);
                  localStorage.setItem('clic_custom_fmc', JSON.stringify(updated));
                } else if (onboardType === 'input') {
                  const updated = [newEnt, ...inputStores];
                  setInputStores(updated);
                  localStorage.setItem('clic_input_stores', JSON.stringify(updated));
                } else {
                  const updated = [newEnt, ...lsShops];
                  setLsShops(updated);
                  localStorage.setItem('clic_livestock_shops', JSON.stringify(updated));
                }
                setToastMsg(`${onboardForm.name} onboarded successfully!`);
                setOnboardForm({ name: '', inCharge: '', phone: '', email: '', village: 'Chandampet', district: 'Nalgonda' });
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Center / Store Name *"
                    required
                    value={onboardForm.name}
                    onChange={e => setOnboardForm({ ...onboardForm, name: e.target.value })}
                  />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="In-Charge Officer / Manager"
                    value={onboardForm.inCharge}
                    onChange={e => setOnboardForm({ ...onboardForm, inCharge: e.target.value })}
                  />
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="Contact Phone Number *"
                    required
                    value={onboardForm.phone}
                    onChange={e => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Village / Location"
                      value={onboardForm.village}
                      onChange={e => setOnboardForm({ ...onboardForm, village: e.target.value })}
                    />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="District"
                      value={onboardForm.district}
                      onChange={e => setOnboardForm({ ...onboardForm, district: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">
                    <Plus size={14} /> Register & Onboard Center
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Farmer Queries Log */}
      {activeTab === 'queries' && (
        <div className="card p-4 animate-fade-in">
          <div className="section-title">Farmer Walk-in Queries Log</div>
          <table className="data-table mt-3">
            <thead>
              <tr>
                <th>Farmer Name</th>
                <th>Mobile</th>
                <th>Village</th>
                <th>Stated Query</th>
                <th>Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {farmersList.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong> ({f.telugu})</td>
                  <td>{f.phone}</td>
                  <td>{f.village}</td>
                  <td>{f.activeQuery || 'General Agronomy & Support'}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedFarmer(f);
                        setFarmerQueryText(f.activeQuery || '');
                        setActiveTab('workflow');
                        setCurrentStep(2);
                      }}
                    >
                      Process in Workflow $\rightarrow$
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Farmer Register Modal */}
      {showAddFarmerModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowAddFarmerModal(false)}>
          <div className="modal-card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><UserPlus size={18} className="text-forest" /> Quick Register Walk-in Farmer</h3>
              <button className="modal-close-btn" onClick={() => setShowAddFarmerModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleQuickRegisterFarmer} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Farmer Full Name (English) *"
                required
                value={newFarmerForm.name}
                onChange={e => setNewFarmerForm({ ...newFarmerForm, name: e.target.value })}
              />
              <input
                type="text"
                className="input-field"
                placeholder="రైతు పేరు (తెలుగు)"
                value={newFarmerForm.telugu}
                onChange={e => setNewFarmerForm({ ...newFarmerForm, telugu: e.target.value })}
              />
              <input
                type="tel"
                className="input-field"
                placeholder="Mobile Phone (10 digits) *"
                required
                value={newFarmerForm.phone}
                onChange={e => setNewFarmerForm({ ...newFarmerForm, phone: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Village"
                  value={newFarmerForm.village}
                  onChange={e => setNewFarmerForm({ ...newFarmerForm, village: e.target.value })}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Landholding (e.g. 3.5 Acres)"
                  value={newFarmerForm.landHolding}
                  onChange={e => setNewFarmerForm({ ...newFarmerForm, landHolding: e.target.value })}
                />
              </div>
              <textarea
                className="input-field"
                rows="2"
                placeholder="Initial Query / Requirement"
                value={newFarmerForm.activeQuery}
                onChange={e => setNewFarmerForm({ ...newFarmerForm, activeQuery: e.target.value })}
              />
              <button type="submit" className="btn btn-primary mt-2">
                Register & Select Farmer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Farmer Full Details Modal (Dynamic for any inspected farmer) */}
      {showFarmerDetailsModal && (() => {
        const activeF = farmerToInspect || selectedFarmer;
        return (
          <div className="modal-backdrop animate-fade-in" onClick={() => setShowFarmerDetailsModal(false)}>
            <div className="modal-card" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>👨‍🌾 Farmer Profile Dossier: {activeF.name}</h3>
                <button className="modal-close-btn" onClick={() => setShowFarmerDetailsModal(false)}><X size={18} /></button>
              </div>
              <div style={{ padding: 'var(--space-4)' }}>
                <div className="farmer-profile-dossier" style={{ margin: 0 }}>
                  <div className="farmer-avatar-block">
                    <div className="farmer-avatar-circle">
                      {activeF.name.charAt(0)}
                    </div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '2px' }}>
                      {activeF.name}
                    </h3>
                    <span className="telugu-text" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                      {activeF.telugu}
                    </span>
                    <span className="badge badge-green" style={{ marginBottom: 'var(--space-3)' }}>
                      Verified Farmer (ID: #{activeF.id.toUpperCase()})
                    </span>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                      Aadhaar: ****-****-{activeF.aadhaar || '4821'}
                    </div>
                  </div>

                  <div className="farmer-meta-grid">
                    <div className="meta-field-card">
                      <div className="meta-field-label">Mobile Phone</div>
                      <div className="meta-field-value text-forest">📞 {activeF.phone}</div>
                    </div>
                    <div className="meta-field-card">
                      <div className="meta-field-label">Village & Mandal</div>
                      <div className="meta-field-value">📍 {activeF.village}, Chandampet</div>
                    </div>
                    <div className="meta-field-card">
                      <div className="meta-field-label">Total Land Holding</div>
                      <div className="meta-field-value">🌾 {activeF.landHolding || '3.5 Acres'}</div>
                    </div>
                    <div className="meta-field-card">
                      <div className="meta-field-label">Soil / Water Source</div>
                      <div className="meta-field-value">💧 {activeF.soilType || 'Red Sandy Loam'}</div>
                    </div>
                    <div className="meta-field-card">
                      <div className="meta-field-label">Subsidy Category</div>
                      <div className="meta-field-value text-amber">
                        {activeF.subsidyCategory || 'Small / Marginal Farmer (SF/MF)'}
                      </div>
                    </div>
                    <div className="meta-field-card">
                      <div className="meta-field-label">Bank Account / KCC</div>
                      <div className="meta-field-value text-sky">
                        {activeF.bankAccount || 'SBI - 30891283891'}
                      </div>
                    </div>
                    <div className="meta-field-card" style={{ gridColumn: 'span 2' }}>
                      <div className="meta-field-label">Registered Crops & Season</div>
                      <div className="meta-field-value">
                        {Array.isArray(activeF.crops) ? activeF.crops.join(', ') : activeF.crops || 'Paddy, Cotton'} (Kharif Season)
                      </div>
                    </div>
                    {activeF.activeQuery && (
                      <div className="meta-field-card" style={{ gridColumn: 'span 2' }}>
                        <div className="meta-field-label">Past Query / Requirement</div>
                        <div className="meta-field-value" style={{ fontStyle: 'italic', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          "{activeF.activeQuery}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border)' }}>
                  {selectedFarmer.id !== activeF.id ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setSelectedFarmer(activeF);
                        if (activeF.activeQuery) setFarmerQueryText(activeF.activeQuery);
                        setShowFarmerDetailsModal(false);
                      }}
                    >
                      ✓ Select This Farmer for Workflow
                    </button>
                  ) : <div></div>}
                  <button className="btn btn-secondary" onClick={() => setShowFarmerDetailsModal(false)}>
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Video Modal */}
      {videoModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setVideoModalOpen(false)}>
          <div className="modal-card video-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎬 {activeVideo.title}</h3>
              <button className="modal-close-btn" onClick={() => setVideoModalOpen(false)}><X size={18} /></button>
            </div>
            <div className="video-player-container">
              <iframe
                src={activeVideo.url}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
