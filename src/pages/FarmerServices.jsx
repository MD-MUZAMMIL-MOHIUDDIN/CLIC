import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MACHINERY_OPERATIONS,
  FARM_MACHINES,
  INITIAL_CHC_HUBS,
  INITIAL_FMC_SHOPS
} from '../data/machinery/machineryData';
import { FISH_SPECIES, FISH_DISEASES } from '../data/fisheries/fisheriesData';
import { LIVESTOCK_ANIMALS, LIVESTOCK_DISEASES } from '../data/livestock/livestockData';
import {
  CROP_THEMES,
  PEST_CATEGORIES,
  CROP_PESTS_DATA,
  CROP_DISEASES_DATA
} from '../data/crops/cropPestDiseaseData';
import { INITIAL_DISEASE_PRESCRIPTIONS, INITIAL_DISEASE_ALERTS } from '../data/crops/diseasePrescriptionsData';
import { INITIAL_INPUT_STORES } from '../data/inputs/inputStoreData';
import {
  Tractor, Store, Wrench, Activity, Fish, Stethoscope,
  CheckCircle2, ArrowRight, ArrowLeft, Play, X, ShoppingCart,
  Bell, FileText, Send, Sparkles, Printer, Plus, RefreshCw,
  Layers, Check, HelpCircle, Calendar, ShieldCheck, User,
  Bug, Sprout, Info, ExternalLink, ShieldAlert, CheckCircle, Package
} from 'lucide-react';
import '../styles/diseaseWorkflow.css';

// Clean 4-step workflow exclusively tailored for farmers
const FARMER_STEPS = [
  { id: 'theme', num: 1, label: '1. Select Service', desc: 'Choose Farm Machinery, Crop Pests, Crop Diseases, Fish or Livestock' },
  { id: 'explore', num: 2, label: '2. Explore & Diagnose', desc: 'Select crop, disease/pest stage & watch video guide' },
  { id: 'shop', num: 3, label: '3. Choose Hub / Shop', desc: 'Select rental duration, subsidy purchase or medicines' },
  { id: 'confirm', num: 4, label: '4. Confirm & Book', desc: 'Instant booking dispatch & SMS confirmation' }
];

export default function FarmerServices() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active top-level view: 'workflow' | 'my_bookings' | 'my_alerts'
  const [activeTab, setActiveTab] = useState('workflow');

  // Active Service Theme: 'machinery' | 'crop_pests' | 'crop_diseases' | 'fish' | 'livestock'
  const [theme, setTheme] = useState('machinery');

  // Step state (1 to 4)
  const [currentStep, setCurrentStep] = useState(1);

  // Machinery States
  const [selectedOperationId, setSelectedOperationId] = useState('land-prep');
  const [selectedMachine, setSelectedMachine] = useState(FARM_MACHINES[0]);
  const [machineryChoice, setMachineryChoice] = useState('rental');
  const [selectedChcHubId, setSelectedChcHubId] = useState(INITIAL_CHC_HUBS[0]?.id || 'chc-1');
  const [rentalDays, setRentalDays] = useState(2);
  const [rentalDate, setRentalDate] = useState('2026-10-02');
  const [includeOperator, setIncludeOperator] = useState(true);
  const [selectedFmcShopId, setSelectedFmcShopId] = useState(INITIAL_FMC_SHOPS[0]?.id || 'fmc-1');
  const [purchasePaymentMode, setPurchasePaymentMode] = useState('Kisan Credit Card (KCC) + Govt Subsidy');

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
    const customDiseases = localStorage.getItem('clic_crop_diseases');
    if (customDiseases) {
      try { extra = [...extra, ...JSON.parse(customDiseases)]; } catch (e) {}
    }
    const advisoryPests = localStorage.getItem('clic_pests');
    if (advisoryPests) {
      try {
        const parsed = JSON.parse(advisoryPests);
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
    const customPests = localStorage.getItem('clic_crop_pests');
    if (customPests) {
      try { extra = [...extra, ...JSON.parse(customPests)]; } catch (e) {}
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

  // Crops - Pests States
  const [selectedCropId, setSelectedCropId] = useState('paddy');
  const [selectedPestCategory, setSelectedPestCategory] = useState('sucking');
  const [selectedPest, setSelectedPest] = useState(cropPestsList[0] || CROP_PESTS_DATA[0]);
  const [selectedPestStage, setSelectedPestStage] = useState('Nymph');

  // Crops - Diseases States
  const [selectedCropDisease, setSelectedCropDisease] = useState(cropDiseasesList[0] || CROP_DISEASES_DATA[0]);
  const [selectedSeverity, setSelectedSeverity] = useState('mild');

  // Fisheries & Livestock States
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  // Video Modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState({ url: '', title: '' });

  // Confirmation Stage
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Orders and Alerts History (Strictly filtered for THIS logged in farmer)
  const [allOrders, setAllOrders] = useState(() => {
    const saved = localStorage.getItem('clic_disease_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_DISEASE_PRESCRIPTIONS;
  });

  const [allAlerts, setAllAlerts] = useState(() => {
    const saved = localStorage.getItem('clic_disease_alerts');
    return saved ? JSON.parse(saved) : INITIAL_DISEASE_ALERTS;
  });

  // Current Farmer Profile (from logged-in session - NO OTHER FARMER DATA)
  const currentFarmerProfile = useMemo(() => {
    return {
      name: user?.name || 'Ramu Farmer',
      telugu: user?.telugu || 'రాము రెడ్డి',
      phone: user?.phone || '9876543210',
      village: user?.village || 'Chandampet',
      district: user?.district || 'Nalgonda',
      landHolding: user?.landHolding || '3.5 Acres',
      soilType: 'Red Sandy Loam',
      subsidyCategory: 'Small / Marginal Farmer (SF/MF)'
    };
  }, [user]);

  // Filter ONLY this farmer's orders
  const myOrders = useMemo(() => {
    const pName = currentFarmerProfile.name.toLowerCase();
    const pPhone = currentFarmerProfile.phone;
    return allOrders.filter(o =>
      (o.farmerPhone && o.farmerPhone === pPhone) ||
      (o.farmerName && o.farmerName.toLowerCase().includes(pName.split(' ')[0]))
    );
  }, [allOrders, currentFarmerProfile]);

  // Filter ONLY this farmer's alerts
  const myAlerts = useMemo(() => {
    const pName = currentFarmerProfile.name.toLowerCase();
    const pPhone = currentFarmerProfile.phone;
    return allAlerts.filter(a =>
      (a.recipient && (a.recipient.includes(pPhone) || a.recipient.toLowerCase().includes(pName.split(' ')[0]))) ||
      (a.message && a.message.toLowerCase().includes(pName.split(' ')[0]))
    );
  }, [allAlerts, currentFarmerProfile]);

  // Initialize from search params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['workflow', 'my_bookings', 'my_alerts'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const themeParam = searchParams.get('theme');
    if (themeParam && ['machinery', 'crop_pests', 'crop_diseases', 'fish', 'livestock'].includes(themeParam)) {
      setTheme(themeParam);
    }
  }, [searchParams]);

  // Set default items on theme change
  useEffect(() => {
    if (theme === 'machinery') {
      setSelectedOperationId('land-prep');
      const firstMach = FARM_MACHINES.find(m => m.operationId === 'land-prep') || FARM_MACHINES[0];
      setSelectedMachine(firstMach);
    } else if (theme === 'crop_pests') {
      const matchPest = CROP_PESTS_DATA.find(p => p.cropId === selectedCropId && p.category === selectedPestCategory) || CROP_PESTS_DATA.find(p => p.cropId === selectedCropId) || CROP_PESTS_DATA[0];
      setSelectedPest(matchPest);
      if (matchPest?.lifeCycle?.length) {
        setSelectedPestStage(matchPest.lifeCycle.find(s => s.keyStage)?.stage || matchPest.lifeCycle[0].stage);
      }
    } else if (theme === 'crop_diseases') {
      const matchDis = CROP_DISEASES_DATA.find(d => d.cropId === selectedCropId) || CROP_DISEASES_DATA[0];
      setSelectedCropDisease(matchDis);
    } else if (theme === 'fish') {
      setSelectedSpeciesId(FISH_SPECIES[0].id);
      setSelectedDisease(FISH_DISEASES[0]);
    } else if (theme === 'livestock') {
      setSelectedSpeciesId(LIVESTOCK_ANIMALS[0].id);
      setSelectedDisease(LIVESTOCK_DISEASES[0]);
    }
    setPrescriptionItems([]);
    setOrderConfirmed(false);
  }, [theme]);

  // Handle crop change for pest / disease
  useEffect(() => {
    if (theme === 'crop_pests') {
      const matchPest = CROP_PESTS_DATA.find(p => p.cropId === selectedCropId && p.category === selectedPestCategory) || CROP_PESTS_DATA.find(p => p.cropId === selectedCropId) || CROP_PESTS_DATA[0];
      setSelectedPest(matchPest);
      if (matchPest?.lifeCycle?.length) {
        setSelectedPestStage(matchPest.lifeCycle.find(s => s.keyStage)?.stage || matchPest.lifeCycle[0].stage);
      }
    } else if (theme === 'crop_diseases') {
      const matchDis = CROP_DISEASES_DATA.find(d => d.cropId === selectedCropId) || CROP_DISEASES_DATA[0];
      setSelectedCropDisease(matchDis);
    }
  }, [selectedCropId]);

  // Handle pest category change
  useEffect(() => {
    if (theme === 'crop_pests') {
      const matchPest = CROP_PESTS_DATA.find(p => p.cropId === selectedCropId && p.category === selectedPestCategory) || CROP_PESTS_DATA.find(p => p.category === selectedPestCategory) || CROP_PESTS_DATA[0];
      setSelectedPest(matchPest);
      if (matchPest?.lifeCycle?.length) {
        setSelectedPestStage(matchPest.lifeCycle.find(s => s.keyStage)?.stage || matchPest.lifeCycle[0].stage);
      }
    }
  }, [selectedPestCategory]);

  // Species and Disease lists for fisheries / livestock
  const speciesList = theme === 'fish' ? FISH_SPECIES : LIVESTOCK_ANIMALS;
  const diseasesList = theme === 'fish' ? FISH_DISEASES : LIVESTOCK_DISEASES;

  const filteredMachines = useMemo(() => {
    return FARM_MACHINES.filter(m => m.operationId === selectedOperationId);
  }, [selectedOperationId]);

  const filteredDiseases = useMemo(() => {
    if (['crop_pests', 'crop_diseases', 'machinery'].includes(theme)) return [];
    return diseasesList.filter(d => (theme === 'fish' ? d.speciesId : d.animalId) === selectedSpeciesId);
  }, [diseasesList, selectedSpeciesId, theme]);

  // Filtered crop pests for active crop & category
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

  // Filtered crop diseases for active crop
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

  // Submit Order & Dispatch SMS
  const handleFarmerSubmitOrder = () => {
    const isMach = theme === 'machinery';
    let serviceName = '';
    let categoryDesc = '';
    let totalAmt = 0;
    let recipientShop = '';

    if (theme === 'machinery') {
      serviceName = selectedMachine.name;
      categoryDesc = machineryChoice === 'rental' ? 'CHC Equipment Rental' : 'FMC Subsidized Purchase';
      totalAmt = machineryChoice === 'rental' ? machineryRentalTotal.total : machineryPurchaseTotal.net;
      recipientShop = machineryChoice === 'rental' ? 'Chandampet CHC Central Hub' : 'Nalgonda FMC Machinery Dealer';
    } else if (theme === 'crop_pests') {
      serviceName = `${selectedPest?.name} (${selectedCropId.toUpperCase()})`;
      categoryDesc = `Crop Pest (${selectedPestCategory.toUpperCase()}) - Stage: ${selectedPestStage}`;
      totalAmt = totalPrescriptionBill;
      recipientShop = prescriptionItems[0]?.storeName || 'Chandampet PACS Bio-Input Center';
    } else if (theme === 'crop_diseases') {
      serviceName = `${selectedCropDisease?.name} (${selectedCropId.toUpperCase()})`;
      categoryDesc = `Crop Disease - Severity: ${selectedSeverity.toUpperCase()}`;
      totalAmt = totalPrescriptionBill;
      recipientShop = prescriptionItems[0]?.storeName || 'Chandampet PACS Bio-Input Center';
    } else {
      serviceName = selectedDisease?.name || 'Veterinary Care';
      categoryDesc = theme === 'fish' ? `Fish: ${selectedSpeciesId}` : `Livestock: ${selectedSpeciesId}`;
      totalAmt = totalPrescriptionBill;
      recipientShop = theme === 'fish' ? 'Aqua Care Input Center' : 'Pashu Seva Kendra';
    }

    const orderRefId = isMach
      ? (machineryChoice === 'rental' ? `FARM-RENT-${Date.now().toString().slice(-4)}` : `FARM-PUR-${Date.now().toString().slice(-4)}`)
      : (theme === 'crop_pests' ? `FARM-PEST-${Date.now().toString().slice(-4)}` :
         theme === 'crop_diseases' ? `FARM-DIS-${Date.now().toString().slice(-4)}` :
         `FARM-RX-${Date.now().toString().slice(-4)}`);

    const newOrder = {
      id: orderRefId,
      theme,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      farmerId: `farmer-${user?.id || 'self'}`,
      farmerName: currentFarmerProfile.name,
      farmerTelugu: currentFarmerProfile.telugu,
      farmerPhone: currentFarmerProfile.phone,
      village: currentFarmerProfile.village,
      district: currentFarmerProfile.district,
      query: `Farmer Self-Service Order for ${serviceName}`,
      serviceName,
      category: categoryDesc,
      pathogen: isMach ? selectedMachine.powerHP : (selectedPest?.scientificName || selectedCropDisease?.pathogen || selectedDisease?.pathogen),
      prescribedProducts: isMach ? [
        {
          name: selectedMachine.name,
          quantity: 1,
          unit: machineryChoice === 'rental' ? `${rentalDays} Days Rental` : 'New Machine',
          price: machineryChoice === 'rental' ? machineryRentalTotal.total : machineryPurchaseTotal.net,
          shopName: recipientShop
        }
      ] : prescriptionItems,
      totalAmount: totalAmt,
      status: 'Confirmed & Alert Dispatched',
      stage: 'final_closed',
      shopAlertStatus: 'Dispatched to Shop',
      farmerAlertStatus: 'Delivered via SMS',
      facilitatorName: 'Self-Service Portal'
    };

    // Save order
    const updatedOrders = [newOrder, ...allOrders];
    setAllOrders(updatedOrders);
    localStorage.setItem('clic_disease_prescriptions', JSON.stringify(updatedOrders));

    // Create Bidirectional Alerts
    const newAlerts = [
      {
        id: `ALT-SHOP-${Date.now()}-1`,
        prescriptionId: orderRefId,
        type: 'shop_notification',
        sender: `Farmer ${currentFarmerProfile.name} (${currentFarmerProfile.phone})`,
        recipient: recipientShop,
        message: `📢 New Self-Service Booking #${orderRefId} received from Farmer ${currentFarmerProfile.name} (${currentFarmerProfile.village}). Item: ${serviceName}. Total Amount: ₹${totalAmt.toLocaleString('en-IN')}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Dispatched',
        icon: '📲'
      },
      {
        id: `ALT-SMS-${Date.now()}-2`,
        prescriptionId: orderRefId,
        type: 'farmer_sms_receipt',
        sender: 'CLIC Farmer Services Desk',
        recipient: `${currentFarmerProfile.name} (${currentFarmerProfile.phone})`,
        message: `✅ Booking Confirmed! Ref #${orderRefId}. Service: ${serviceName}. Shop: ${recipientShop}. Please collect with OTP #${Math.floor(1000 + Math.random() * 9000)}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Delivered',
        icon: '📩'
      }
    ];

    const updatedAlerts = [newAlerts[0], newAlerts[1], ...allAlerts];
    setAllAlerts(updatedAlerts);
    localStorage.setItem('clic_disease_alerts', JSON.stringify(updatedAlerts));

    setLastOrderDetails(newOrder);
    setOrderConfirmed(true);
  };

  const restartFlow = () => {
    setCurrentStep(1);
    setOrderConfirmed(false);
    setPrescriptionItems([]);
  };

  return (
    <div className="disease-workflow-page animate-fade-in-up">
      {/* Top Banner Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: 'var(--space-2)' }}>
              🌱 Farmer Self-Service Portal
            </span>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Tractor className="text-forest animate-pulse" size={28} />
              <span>Farmer Services & Direct Booking</span>
            </h1>
            <p className="text-secondary" style={{ marginTop: '4px' }}>
              Logged in as <strong>{currentFarmerProfile.name}</strong> · {currentFarmerProfile.village}, {currentFarmerProfile.district} ({currentFarmerProfile.landHolding})
            </p>
          </div>

          {/* Module Switcher */}
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
                <Bug size={14} /> 🐛 Crops - Pests
              </button>
              <button
                className={`theme-pill-btn ${theme === 'crop_diseases' ? 'active' : ''}`}
                style={theme === 'crop_diseases' ? { background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff' } : {}}
                onClick={() => { setTheme('crop_diseases'); setSearchParams({ theme: 'crop_diseases' }); }}
              >
                <Sprout size={14} /> 🌿 Crops - Diseases
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
            <button className="btn btn-secondary btn-sm" onClick={restartFlow}>
              <RefreshCw size={14} /> New Booking
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="wf-tabs-row">
        <button
          className={`wf-tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => { setActiveTab('workflow'); setSearchParams({ tab: 'workflow', theme }); }}
        >
          <Layers size={16} /> 4-Step Direct Booking & Diagnosis
        </button>
        <button
          className={`wf-tab-btn ${activeTab === 'my_bookings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('my_bookings'); setSearchParams({ tab: 'my_bookings' }); }}
        >
          <FileText size={16} /> My Bookings & Prescriptions ({myOrders.length})
        </button>
        <button
          className={`wf-tab-btn ${activeTab === 'my_alerts' ? 'active' : ''}`}
          onClick={() => { setActiveTab('my_alerts'); setSearchParams({ tab: 'my_alerts' }); }}
        >
          <Bell size={16} /> My SMS Receipts & Alerts ({myAlerts.length})
        </button>
      </div>

      {/* TAB 1: 4-Step Direct Workflow */}
      {activeTab === 'workflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Stepper Header Bar */}
          <div className="wf-stepper-box">
            <div className="wf-stepper-top">
              <div className="wf-stepper-title">
                <span>
                  {theme === 'machinery' ? '🚜 Farm Machinery Rental & Subsidized Purchase' :
                   theme === 'crop_pests' ? '🐛 Crops - Pests Life Cycle & IPM Solution' :
                   theme === 'crop_diseases' ? '🌿 Crops - Diseases & Fungicide Solution' :
                   theme === 'fish' ? '🐟 Fish Health & Aqua Pharmacy Services' :
                   '🐄 Livestock Healthcare & Medicine Store'}
                </span>
                <span className="badge badge-sky" style={{ fontSize: '11px' }}>Step {currentStep} of 4</span>
              </div>
              <span className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
                {FARMER_STEPS[currentStep - 1]?.desc || ''}
              </span>
            </div>

            <div className="wf-step-bar-scroll">
              {FARMER_STEPS.map((s) => {
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

          {/* STEP 1: Select Service (Menu Board) */}
          {currentStep === 1 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2><Layers className="text-forest" size={22} /> Step 1: Select Service (Menu Board)</h2>
                  <p>Choose what you need assistance with today: Farm Machinery, Crop Pests, Crop Diseases, Fish or Livestock.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                  Proceed to Step 2 <ArrowRight size={16} />
                </button>
              </div>

              <div className="menuboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
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
                    వ్యవసాయ యంత్రాల అద్దె & కొనుగోలు
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Custom Hiring Center (CHC) equipment rental & subsidized machine purchase with KCC financing.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-sky">{FARM_MACHINES.length} Machines</span>
                    {theme === 'machinery' && <span className="badge badge-green">✓ Selected</span>}
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
                    Crops - Pests Management
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    పంటలలో చీడపీడల నివారణ
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Sucking pests, Chewing pests & Borers across Paddy, Cotton, Chilli, Red Gram with life-cycle IPM.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-amber">{CROP_PESTS_DATA.length} Pests Cataloged</span>
                    {theme === 'crop_pests' && <span className="badge badge-green">✓ Selected</span>}
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
                    Crops - Diseases & Fungicides
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    పంట తెగుళ్లు & శిలీంధ్రనాశిని
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    Symptom recognition & severity staging (Mild/Moderate/Severe) for Blast, BLB, Wilt, Anthracnose.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-green">{CROP_DISEASES_DATA.length} Diseases Protocol</span>
                    {theme === 'crop_diseases' && <span className="badge badge-green">✓ Selected</span>}
                  </div>
                </div>

                {/* Fish Diseases */}
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
                    <span className="badge badge-teal">{FISH_DISEASES.length} Protocols</span>
                    {theme === 'fish' && <span className="badge badge-green">✓ Selected</span>}
                  </div>
                </div>

                {/* Livestock Care */}
                <div
                  className={`menuboard-card ${theme === 'livestock' ? 'selected livestock' : ''}`}
                  onClick={() => setTheme('livestock')}
                >
                  <div className="menuboard-icon">🐄</div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', marginBottom: '4px' }}>
                    Livestock Care & Health
                  </h3>
                  <span className="telugu-text" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                    పశువుల వ్యాధులు & మందులు
                  </span>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
                    FMD, Mastitis, HS & BQ diagnosis with Livestock Entrepreneur shop inventory integration.
                  </p>
                  <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-amber">{LIVESTOCK_DISEASES.length} Health Guides</span>
                    {theme === 'livestock' && <span className="badge badge-green">✓ Selected</span>}
                  </div>
                </div>
              </div>

              <div className="wf-nav-actions" style={{ marginTop: 'var(--space-6)' }}>
                <div></div>
                <button className="btn btn-primary" onClick={() => setCurrentStep(2)}>
                  Proceed to Explore & Diagnose <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Explore & Diagnose */}
          {currentStep === 2 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2>
                    {theme === 'machinery' ? <Tractor className="text-forest" size={22} /> :
                     theme === 'crop_pests' ? <Bug className="text-amber" size={22} /> :
                     theme === 'crop_diseases' ? <Sprout className="text-forest" size={22} /> :
                     theme === 'fish' ? <Fish className="text-sky" size={22} /> :
                     <Activity className="text-amber" size={22} />}
                    <span>Step 2: Explore & Diagnose</span>
                  </h2>
                  <p>
                    {theme === 'machinery' ? 'Browse farming operations & equipment specs.' :
                     theme === 'crop_pests' ? 'Choose crop, pest category, life-cycle stage & view preparation video.' :
                     theme === 'crop_diseases' ? 'Choose crop, diagnose symptoms, set severity level & view preparation video.' :
                     'Select species, examine clinical signs, control measures & tutorial videos.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                    Choose Hub / Shop <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Machinery Flow */}
              {theme === 'machinery' && (
                <div>
                  <div className="section-title" style={{ marginBottom: 'var(--space-3)' }}>1. Select Agricultural Operation</div>
                  <div className="operations-pill-row">
                    {MACHINERY_OPERATIONS.map(op => (
                      <button
                        key={op.id}
                        className={`op-pill-btn ${selectedOperationId === op.id ? 'active' : ''}`}
                        onClick={() => handleSelectOperation(op.id)}
                      >
                        <span className="op-pill-icon">{op.icon}</span>
                        <span>{op.name}</span>
                        <span className="telugu-text" style={{ fontSize: '11px', opacity: 0.8 }}>({op.telugu})</span>
                      </button>
                    ))}
                  </div>

                  <div className="section-title" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>
                    2. Available Equipment for {MACHINERY_OPERATIONS.find(o => o.id === selectedOperationId)?.name}
                  </div>
                  <div className="machine-cards-grid">
                    {filteredMachines.map(m => (
                      <div
                        key={m.id}
                        className={`machine-card ${selectedMachine?.id === m.id ? 'selected' : ''}`}
                        onClick={() => setSelectedMachine(m)}
                      >
                        <div className="machine-card-header">
                          <span className="machine-type-tag">{m.category}</span>
                          <span className="badge badge-sky">{m.powerHP}</span>
                        </div>
                        <div className="machine-title-row">
                          <span className="machine-icon-lg">{m.icon}</span>
                          <div>
                            <h4>{m.name}</h4>
                            <span className="telugu-text text-secondary">{m.telugu}</span>
                          </div>
                        </div>
                        <p className="machine-desc">{m.description}</p>
                        <div className="machine-cost-preview">
                          <div>
                            <span className="cost-label">CHC Rent</span>
                            <span className="cost-val text-green">₹{m.chcAvailability?.rateDaily || 2500}/day</span>
                          </div>
                          <div>
                            <span className="cost-label">FMC Subsidy (50%)</span>
                            <span className="cost-val text-amber">₹{(m.purchaseInfo?.msrp * 0.5 || 75000).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedMachine && (
                    <div className="card mt-4 border-green" style={{ background: 'var(--color-bg-card)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                        <div>
                          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>🎬 Training & Demonstration Video</h3>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                            Learn optimal field calibration, depth adjustment, and fuel efficiency tips for {selectedMachine.name}.
                          </p>
                        </div>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openVideo(selectedMachine.videoTutorial?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ', `Operator Training: ${selectedMachine.name}`)}
                        >
                          <Play size={14} className="text-green" /> Watch Video Tutorial
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Crops - Pests Flow */}
              {theme === 'crop_pests' && (
                <div>
                  {/* Crop Selector */}
                  <div className="section-title" style={{ marginBottom: 'var(--space-2)' }}>1. Select Your Crop</div>
                  <div className="operations-pill-row">
                    {CROP_THEMES.map(c => (
                      <button
                        key={c.id}
                        className={`op-pill-btn ${selectedCropId === c.id ? 'active' : ''}`}
                        onClick={() => setSelectedCropId(c.id)}
                      >
                        <span className="op-pill-icon">{c.icon}</span>
                        <span>{c.name}</span>
                        <span className="telugu-text" style={{ fontSize: '11px', opacity: 0.8 }}>({c.telugu})</span>
                      </button>
                    ))}
                  </div>

                  {/* Pest Category Selector */}
                  <div className="section-title" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>
                    2. Select Pest Category for {CROP_THEMES.find(c => c.id === selectedCropId)?.name}
                  </div>
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
                              {countInCrop > 0 ? `${countInCrop} Pests Cataloged` : 'General Category'}
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
                              {isSel ? '✓ Selected Category' : 'Click to View Pests'}
                            </span>
                            <ArrowRight size={14} className={isSel ? 'text-amber' : 'text-muted'} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pest Cards List */}
                  <div className="section-title" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-2)' }}>
                    3. Select Observed Pest
                  </div>
                  <div className="machine-cards-grid">
                    {filteredCropPests.map(p => (
                      <div
                        key={p.id}
                        className={`machine-card ${selectedPest?.id === p.id ? 'selected' : ''}`}
                        style={selectedPest?.id === p.id ? { borderColor: '#d97706', background: 'rgba(217, 119, 6, 0.04)' } : {}}
                        onClick={() => {
                          setSelectedPest(p);
                          if (p.lifeCycle?.length) {
                            setSelectedPestStage(p.lifeCycle.find(s => s.keyStage)?.stage || p.lifeCycle[0].stage);
                          }
                        }}
                      >
                        <div className="machine-card-header">
                          <span className="machine-type-tag" style={{ background: '#d97706', color: '#fff' }}>{p.category.toUpperCase()}</span>
                          <span className="badge badge-amber">ETL: {p.economicThreshold?.slice(0, 25)}...</span>
                        </div>
                        <div className="machine-title-row">
                          <span className="machine-icon-lg">🐛</span>
                          <div>
                            <h4>{p.name}</h4>
                            <span className="telugu-text text-secondary">{p.telugu}</span>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{p.scientificName}</div>
                          </div>
                        </div>
                        <p className="machine-desc">{p.damageSymptoms}</p>
                      </div>
                    ))}
                  </div>

                  {/* Life Cycle & Stage Selection */}
                  {selectedPest && (
                    <div className="card mt-4 border-amber" style={{ background: 'var(--color-bg-card)' }}>
                      <div className="section-title" style={{ color: '#d97706' }}>
                        <span>🔄 Pest Life Cycle & Identify Current Stage</span>
                        <span className="badge badge-amber">Click to select active stage</span>
                      </div>
                      <div className="lifecycle-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                        {selectedPest.lifeCycle?.map(stageItem => {
                          const isSelStage = selectedPestStage === stageItem.stage;
                          return (
                            <div
                              key={stageItem.stage}
                              className={`card ${isSelStage ? 'border-amber shadow-md' : ''}`}
                              style={{
                                cursor: 'pointer',
                                background: isSelStage ? 'rgba(217, 119, 6, 0.12)' : 'var(--color-bg-secondary)',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-md)',
                                transition: 'all 0.2s ease'
                              }}
                              onClick={() => setSelectedPestStage(stageItem.stage)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '24px' }}>{stageItem.icon}</span>
                                {stageItem.keyStage && <span className="badge badge-red" style={{ fontSize: '10px' }}>Target Window</span>}
                              </div>
                              <h4 style={{ margin: '6px 0 2px 0', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{stageItem.stage}</h4>
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Duration: {stageItem.duration}</div>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 0 }}>
                                {stageItem.desc}
                              </p>
                              <div style={{ marginTop: '8px', fontSize: '10px', color: '#d97706', fontWeight: 'bold' }}>
                                🎯 {stageItem.vulnerability}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Control Measures */}
                      <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
                        <div className="card" style={{ background: 'rgba(5, 150, 105, 0.06)', borderLeft: '4px solid #059669', padding: 'var(--space-3)' }}>
                          <h4 style={{ color: '#059669', fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            🌿 Cultural Management
                          </h4>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                            {selectedPest.controlMeasures?.cultural}
                          </p>
                        </div>
                        <div className="card" style={{ background: 'rgba(37, 99, 235, 0.06)', borderLeft: '4px solid #2563eb', padding: 'var(--space-3)' }}>
                          <h4 style={{ color: '#2563eb', fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            🐞 Biological & Botanical Control
                          </h4>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                            {selectedPest.controlMeasures?.biological}
                          </p>
                        </div>
                        <div className="card" style={{ background: 'rgba(217, 119, 6, 0.06)', borderLeft: '4px solid #d97706', padding: 'var(--space-3)' }}>
                          <h4 style={{ color: '#d97706', fontSize: 'var(--text-xs)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            🧪 Target Spray / Bio-Pesticide
                          </h4>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                            {selectedPest.controlMeasures?.chemical}
                          </p>
                        </div>
                      </div>

                      {/* Video & Inoculum Card */}
                      <div className="card mt-3" style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                          <div>
                            <h4 style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>📄 Inoculum & Spray Preparation:</span>
                              <span className="text-amber">{selectedPest.inoculum?.formula}</span>
                            </h4>
                            <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                              {selectedPest.inoculum?.preparationSteps?.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                            <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              <strong>Dosage:</strong> {selectedPest.inoculum?.dosagePerAcre} · <strong>Precaution:</strong> {selectedPest.inoculum?.precautions}
                            </div>
                          </div>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openVideo(selectedPest.video?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ', selectedPest.video?.title || `Preparation Video: ${selectedPest.name}`)}
                          >
                            <Play size={14} className="text-amber" /> Watch Video Tutorial
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Crops - Diseases Flow */}
              {theme === 'crop_diseases' && (
                <div>
                  {/* Crop Selector */}
                  <div className="section-title" style={{ marginBottom: 'var(--space-2)' }}>1. Select Your Crop</div>
                  <div className="operations-pill-row">
                    {CROP_THEMES.map(c => (
                      <button
                        key={c.id}
                        className={`op-pill-btn ${selectedCropId === c.id ? 'active' : ''}`}
                        onClick={() => setSelectedCropId(c.id)}
                      >
                        <span className="op-pill-icon">{c.icon}</span>
                        <span>{c.name}</span>
                        <span className="telugu-text" style={{ fontSize: '11px', opacity: 0.8 }}>({c.telugu})</span>
                      </button>
                    ))}
                  </div>

                  {/* Disease Cards List */}
                  <div className="section-title" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-2)' }}>
                    2. Select Observed Disease for {CROP_THEMES.find(c => c.id === selectedCropId)?.name}
                  </div>
                  <div className="machine-cards-grid">
                    {filteredCropDiseases.map(d => (
                      <div
                        key={d.id}
                        className={`machine-card ${selectedCropDisease?.id === d.id ? 'selected' : ''}`}
                        style={selectedCropDisease?.id === d.id ? { borderColor: '#059669', background: 'rgba(5, 150, 105, 0.04)' } : {}}
                        onClick={() => setSelectedCropDisease(d)}
                      >
                        <div className="machine-card-header">
                          <span className="machine-type-tag" style={{ background: '#059669', color: '#fff' }}>{d.causalAgent}</span>
                          <span className="badge badge-green">Fungicide Protocol</span>
                        </div>
                        <div className="machine-title-row">
                          <span className="machine-icon-lg">🌿</span>
                          <div>
                            <h4>{d.name}</h4>
                            <span className="telugu-text text-secondary">{d.telugu}</span>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{d.pathogen}</div>
                          </div>
                        </div>
                        <p className="machine-desc">{d.symptoms}</p>
                      </div>
                    ))}
                  </div>

                  {/* Severity Staging & Control Measures */}
                  {selectedCropDisease && (
                    <div className="card mt-4 border-green" style={{ background: 'var(--color-bg-card)' }}>
                      <div className="section-title" style={{ color: '#059669' }}>
                        <span>📊 Identify Infection Severity Level</span>
                        <span className="badge badge-green">Select to tailor fungicide dosage</span>
                      </div>
                      <div className="severity-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                        {selectedCropDisease.severityLevels?.map(sev => {
                          const isSel = selectedSeverity === sev.level;
                          return (
                            <div
                              key={sev.level}
                              className={`card ${isSel ? 'border-green shadow-md' : ''}`}
                              style={{
                                cursor: 'pointer',
                                background: isSel ? 'rgba(5, 150, 105, 0.12)' : 'var(--color-bg-secondary)',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-md)'
                              }}
                              onClick={() => setSelectedSeverity(sev.level)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={`badge ${sev.level === 'mild' ? 'badge-green' : sev.level === 'moderate' ? 'badge-amber' : 'badge-red'}`}>
                                  {sev.urgency} Urgency
                                </span>
                              </div>
                              <h4 style={{ margin: '8px 0 4px 0', fontSize: 'var(--text-sm)', fontWeight: 'bold' }}>{sev.label}</h4>
                              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                {sev.advice}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Control Measures */}
                      <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' }}>
                        <div className="card" style={{ background: 'rgba(5, 150, 105, 0.06)', borderLeft: '4px solid #059669', padding: 'var(--space-3)' }}>
                          <h4 style={{ color: '#059669', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🌿 Organic / Bio-Fungicide</h4>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                            {selectedCropDisease.controlMeasures?.organic_biocontrol}
                          </p>
                        </div>
                        <div className="card" style={{ background: 'rgba(37, 99, 235, 0.06)', borderLeft: '4px solid #2563eb', padding: 'var(--space-3)' }}>
                          <h4 style={{ color: '#2563eb', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🧪 Chemical Fungicide / Bactericide</h4>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                            {selectedCropDisease.controlMeasures?.chemical_fungicide}
                          </p>
                        </div>
                        <div className="card" style={{ background: 'rgba(217, 119, 6, 0.06)', borderLeft: '4px solid #d97706', padding: 'var(--space-3)' }}>
                          <h4 style={{ color: '#d97706', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>🛡️ Preventive Sanitation</h4>
                          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                            {selectedCropDisease.controlMeasures?.preventive_measures}
                          </p>
                        </div>
                      </div>

                      {/* Video & Inoculum */}
                      <div className="card mt-3" style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                          <div>
                            <h4 style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>📄 Inoculum Preparation:</span>
                              <span className="text-green">{selectedCropDisease.inoculum?.formula}</span>
                            </h4>
                            <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                              {selectedCropDisease.inoculum?.preparationSteps?.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                            <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              <strong>Dosage:</strong> {selectedCropDisease.inoculum?.dosagePerAcre} · <strong>Precaution:</strong> {selectedCropDisease.inoculum?.precautions}
                            </div>
                          </div>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openVideo(selectedCropDisease.video?.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ', selectedCropDisease.video?.title || `Preparation Video: ${selectedCropDisease.name}`)}
                          >
                            <Play size={14} className="text-green" /> Watch Spray Technique Video
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fish / Livestock Flow */}
              {(theme === 'fish' || theme === 'livestock') && (
                <div>
                  <div className="section-title" style={{ marginBottom: 'var(--space-3)' }}>
                    1. Choose {theme === 'fish' ? 'Fish Species' : 'Livestock Breed / Animal'}
                  </div>
                  <div className="operations-pill-row">
                    {speciesList.map(sp => (
                      <button
                        key={sp.id}
                        className={`op-pill-btn ${selectedSpeciesId === sp.id ? 'active' : ''}`}
                        onClick={() => handleSelectSpecies(sp.id)}
                      >
                        <span className="op-pill-icon">{sp.icon}</span>
                        <span>{sp.name}</span>
                        <span className="telugu-text" style={{ fontSize: '11px', opacity: 0.8 }}>({sp.telugu})</span>
                      </button>
                    ))}
                  </div>

                  <div className="section-title" style={{ marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>
                    2. Select Disease Protocol
                  </div>
                  <div className="machine-cards-grid">
                    {filteredDiseases.map(d => (
                      <div
                        key={d.id}
                        className={`machine-card ${selectedDisease?.id === d.id ? 'selected' : ''}`}
                        onClick={() => setSelectedDisease(d)}
                      >
                        <div className="machine-card-header">
                          <span className="machine-type-tag">{d.type || 'Infection'}</span>
                          <span className={`badge ${d.severity === 'High' ? 'badge-red' : 'badge-amber'}`}>{d.severity}</span>
                        </div>
                        <div className="machine-title-row">
                          <span className="machine-icon-lg">{theme === 'fish' ? '🐟' : '🐄'}</span>
                          <div>
                            <h4>{d.name}</h4>
                            <span className="telugu-text text-secondary">{d.telugu}</span>
                          </div>
                        </div>
                        <p className="machine-desc">{d.symptoms}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="wf-nav-actions" style={{ marginTop: 'var(--space-6)' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} /> Previous
                </button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                  Step 3: Choose Hub / Store & Products <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Hub / Store & Products */}
          {currentStep === 3 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2><Store className="text-forest" size={22} /> Step 3: Choose Hub / Store & Products</h2>
                  <p>
                    {theme === 'machinery' ? 'Configure CHC rental period or FMC subsidized purchase.' :
                     'Select recommended medicines, bio-inoculants & test kits from registered PACS Input Stores / LS Shops.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
                    Proceed to Review & Book <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Machinery Store Setup */}
              {theme === 'machinery' && (
                <div>
                  <div className="choice-pill-toggle">
                    <button
                      className={`choice-toggle-btn ${machineryChoice === 'rental' ? 'active' : ''}`}
                      onClick={() => setMachineryChoice('rental')}
                    >
                      <Wrench size={16} /> Custom Hiring Center (CHC) Equipment Rental
                    </button>
                    <button
                      className={`choice-toggle-btn ${machineryChoice === 'purchase' ? 'active' : ''}`}
                      onClick={() => setMachineryChoice('purchase')}
                    >
                      <ShoppingCart size={16} /> Farm Machinery Corporation (FMC) 50% Subsidized Purchase
                    </button>
                  </div>

                  {machineryChoice === 'rental' ? (
                    <div className="card mt-4 p-4 border-sky">
                      <h3 className="section-title">CHC Rental Configuration</h3>
                      <div className="grid-2-col">
                        <div>
                          <label className="form-label">Selected CHC Hub:</label>
                          <select
                            className="input-field"
                            value={selectedChcHubId}
                            onChange={e => setSelectedChcHubId(e.target.value)}
                          >
                            {INITIAL_CHC_HUBS.map(h => (
                              <option key={h.id} value={h.id}>{h.name} ({h.village}, {h.district})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Rental Start Date:</label>
                          <input
                            type="date"
                            className="input-field"
                            value={rentalDate}
                            onChange={e => setRentalDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label">Rental Duration (Days):</label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            className="input-field"
                            value={rentalDays}
                            onChange={e => setRentalDays(Number(e.target.value))}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '24px' }}>
                          <input
                            type="checkbox"
                            id="farmer-op-check"
                            checked={includeOperator}
                            onChange={e => setIncludeOperator(e.target.checked)}
                          />
                          <label htmlFor="farmer-op-check" style={{ fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
                            Include Trained Operator & Fuel Assist (+₹800/day)
                          </label>
                        </div>
                      </div>

                      <div className="total-calculation-box mt-4">
                        <div className="calc-row">
                          <span>Base Daily Rental Rate:</span>
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
                          <span className="text-green">₹{machineryRentalTotal.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card mt-4 p-4 border-amber">
                      <h3 className="section-title">FMC Subsidized Purchase Configuration</h3>
                      <div className="grid-2-col">
                        <div>
                          <label className="form-label">Authorized FMC Dealer:</label>
                          <select
                            className="input-field"
                            value={selectedFmcShopId}
                            onChange={e => setSelectedFmcShopId(e.target.value)}
                          >
                            {INITIAL_FMC_SHOPS.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.village}, {s.district})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Financing & Payment Mode:</label>
                          <select
                            className="input-field"
                            value={purchasePaymentMode}
                            onChange={e => setPurchasePaymentMode(e.target.value)}
                          >
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

              {/* Crops Pests / Crops Diseases / Fish / Livestock Input Store & Medicines */}
              {theme !== 'machinery' && (
                <div>
                  <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Recommended Inputs & Medicines for {theme === 'crop_pests' ? selectedPest?.name : theme === 'crop_diseases' ? selectedCropDisease?.name : selectedDisease?.name}</span>
                    <span className="badge badge-sky">{prescriptionItems.length} Added to Cart</span>
                  </div>

                  <div className="products-grid-list mt-3">
                    {/* Render recommended products */}
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
                              {isAdded ? 'Remove' : '+ Add to Order'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Prescription Summary Table */}
                  {prescriptionItems.length > 0 && (
                    <div className="card mt-4 border-green p-4">
                      <h4 className="section-title">Your Selected Products</h4>
                      <table className="data-table" style={{ marginTop: 'var(--space-2)' }}>
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
                              <td className="text-green">₹{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ textAlign: 'right', marginTop: 'var(--space-3)', fontSize: 'var(--text-base)', fontWeight: 'bold' }}>
                        Grand Total: <span className="text-green">₹{totalPrescriptionBill.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="wf-nav-actions" style={{ marginTop: 'var(--space-6)' }}>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={16} /> Previous
                </button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(4)}>
                  Step 4: Review & Place Booking <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirm Booking */}
          {currentStep === 4 && (
            <div className="wf-stage-card animate-fade-in">
              <div className="wf-stage-header">
                <div className="wf-stage-meta">
                  <h2><CheckCircle2 className="text-forest" size={22} /> Step 4: Review & Instant Booking</h2>
                  <p>Review booking terms tied to your profile ({currentFarmerProfile.name}) and receive instant SMS confirmation.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft size={16} /> Back to Products
                </button>
              </div>

              {!orderConfirmed ? (
                <div>
                  <div className="card p-4 border-green" style={{ background: 'var(--color-bg-card)' }}>
                    <h3 className="section-title">Order Summary & Dispatch Details</h3>
                    <div className="grid-2-col mt-3">
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Farmer Name & Mobile:</div>
                        <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{currentFarmerProfile.name} ({currentFarmerProfile.phone})</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Village & District:</div>
                        <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{currentFarmerProfile.village}, {currentFarmerProfile.district}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Service Theme:</div>
                        <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
                          {theme === 'machinery' ? '🚜 Farm Machinery' :
                           theme === 'crop_pests' ? `🐛 Crop Pests (${selectedPest?.name})` :
                           theme === 'crop_diseases' ? `🌿 Crop Diseases (${selectedCropDisease?.name})` :
                           theme === 'fish' ? `🐟 Fish Health (${selectedSpeciesId})` :
                           `🐄 Livestock Care (${selectedSpeciesId})`}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Total Payable Amount:</div>
                        <div style={{ fontWeight: 'bold', fontSize: 'var(--text-lg)', color: 'var(--color-mint)' }}>
                          ₹{theme === 'machinery'
                            ? (machineryChoice === 'rental' ? machineryRentalTotal.total : machineryPurchaseTotal.net).toLocaleString('en-IN')
                            : totalPrescriptionBill.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="alert-box-info mt-4" style={{ background: 'rgba(5, 150, 105, 0.08)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={18} className="text-green" />
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>
                          <strong>Automated Dispatch Action:</strong> Submitting will instantly alert the local PACS Store / Dealer and deliver an official SMS receipt with an OTP collection token to your phone ({currentFarmerProfile.phone}).
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: 'var(--space-5)' }}>
                      <button className="btn btn-primary btn-lg" onClick={handleFarmerSubmitOrder}>
                        <Send size={18} /> Confirm Booking & Send SMS
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card p-5 text-center animate-fade-in border-green">
                  <div style={{ fontSize: '48px', marginBottom: 'var(--space-2)' }}>🎉</div>
                  <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--color-mint)' }}>
                    Booking Confirmed Successfully!
                  </h2>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '8px auto' }}>
                    Reference Number: <strong>#{lastOrderDetails?.id}</strong>. A confirmation SMS with dispatch instructions has been delivered to <strong>{currentFarmerProfile.phone}</strong>.
                  </p>

                  <div className="mt-4" style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
                    <button className="btn btn-primary" onClick={() => setActiveTab('my_bookings')}>
                      <FileText size={16} /> View My Bookings
                    </button>
                    <button className="btn btn-secondary" onClick={() => setActiveTab('my_alerts')}>
                      <Bell size={16} /> View SMS Receipt
                    </button>
                    <button className="btn btn-secondary" onClick={restartFlow}>
                      <Plus size={16} /> Book Another Service
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Bookings & Prescriptions */}
      {activeTab === 'my_bookings' && (
        <div className="card p-4 animate-fade-in">
          <div className="section-title" style={{ justifyContent: 'space-between', display: 'flex' }}>
            <span>My Active Bookings & Prescriptions ({myOrders.length})</span>
            <span className="badge badge-green">Private to {currentFarmerProfile.name}</span>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center p-5 text-secondary">
              No orders or bookings placed yet. Use the 4-step booking workflow to schedule machinery or request medicines!
            </div>
          ) : (
            <table className="data-table mt-3">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date & Time</th>
                  <th>Service / Crop</th>
                  <th>Details & Products</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myOrders.map(o => (
                  <tr key={o.id}>
                    <td><strong>#{o.id}</strong></td>
                    <td>{o.date} {o.time}</td>
                    <td>
                      <div>{o.serviceName}</div>
                      <span className="badge badge-sky" style={{ fontSize: '10px' }}>{o.category}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px' }}>
                        {o.prescribedProducts?.map((p, idx) => (
                          <div key={idx}>• {p.name} ({p.unit || `${p.quantity || 1} units`})</div>
                        ))}
                      </div>
                    </td>
                    <td className="text-green font-bold">₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                    <td><span className="badge badge-green">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 3: My SMS Receipts & Alerts */}
      {activeTab === 'my_alerts' && (
        <div className="card p-4 animate-fade-in">
          <div className="section-title" style={{ justifyContent: 'space-between', display: 'flex' }}>
            <span>My SMS Receipts & Mobile Notifications ({myAlerts.length})</span>
            <span className="badge badge-sky">Mobile: {currentFarmerProfile.phone}</span>
          </div>

          {myAlerts.length === 0 ? (
            <div className="text-center p-5 text-secondary">
              No SMS receipts received yet. Alerts will appear here when you confirm a service or booking.
            </div>
          ) : (
            <div className="alerts-feed-list mt-3">
              {myAlerts.map(a => (
                <div key={a.id} className="alert-feed-card" style={{ borderLeft: '4px solid var(--color-mint)' }}>
                  <div className="alert-feed-header">
                    <span style={{ fontSize: '20px' }}>{a.icon || '📩'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{a.type?.replace(/_/g, ' ').toUpperCase()}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>From: {a.sender} · {a.timestamp}</div>
                    </div>
                    <span className="badge badge-green">{a.status}</span>
                  </div>
                  <p style={{ margin: '8px 0 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                    {a.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video Tutorial Modal */}
      {videoModalOpen && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setVideoModalOpen(false)}>
          <div className="modal-card video-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🎬 {activeVideo.title}</h3>
              <button className="modal-close-btn" onClick={() => setVideoModalOpen(false)}>
                <X size={18} />
              </button>
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
