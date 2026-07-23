import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { defaultCategories, crops, pests, livestock, fisheries } from '../data/crops';
import {
  Check, ChevronDown, ChevronUp, Bug, Leaf,
  Upload, Sparkles, ShieldAlert, ShieldCheck, Compass, Info,
  Calculator, Plus, Trash2, Edit2, FolderPlus, Save
} from 'lucide-react';
import '../styles/advisory.css';

const MAIN_TABS = ['Crops Advisory', 'Livestock Advisory', 'Fisheries Advisory', '🔧 Manage Advisories'];
const CROP_SUBTABS = ['Package of Practices', 'Pest & Disease Management'];
const MGMT_SECTIONS = ['Categories', 'Crops Database', 'Pests & Diseases', 'Livestock DB', 'Fisheries Guides'];

export default function Advisory() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeMainTab, setActiveMainTab] = useState('Crops Advisory');

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam) {
      const match = MAIN_TABS.find(t => t.toLowerCase().includes(tabParam.toLowerCase()));
      if (match) setActiveMainTab(match);
    }
  }, [tabParam]);

  // Dynamic States for Data Management
  const [categories, setCategories] = useState([]);
  const [cropsList, setCropsList] = useState([]);
  const [pestsList, setPestsList] = useState([]);
  const [livestockList, setLivestockList] = useState([]);
  const [fisheriesData, setFisheriesData] = useState(null);

  // Initialize data from localStorage or crops.js seeds
  useEffect(() => {
    // Categories
    const savedCats = localStorage.getItem('clic_categories');
    if (savedCats) {
      try { setCategories(JSON.parse(savedCats)); } catch { setCategories(defaultCategories); }
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('clic_categories', JSON.stringify(defaultCategories));
    }

    // Crops
    const savedCrops = localStorage.getItem('clic_crops');
    if (savedCrops) {
      try { setCropsList(JSON.parse(savedCrops)); } catch { setCropsList(crops); }
    } else {
      setCropsList(crops);
      localStorage.setItem('clic_crops', JSON.stringify(crops));
    }

    // Pests
    const savedPests = localStorage.getItem('clic_pests');
    if (savedPests) {
      try { setPestsList(JSON.parse(savedPests)); } catch { setPestsList(pests); }
    } else {
      setPestsList(pests);
      localStorage.setItem('clic_pests', JSON.stringify(pests));
    }

    // Livestock
    const savedLivestock = localStorage.getItem('clic_livestock');
    if (savedLivestock) {
      try { setLivestockList(JSON.parse(savedLivestock)); } catch { setLivestockList(livestock); }
    } else {
      setLivestockList(livestock);
      localStorage.setItem('clic_livestock', JSON.stringify(livestock));
    }

    // Fisheries
    const savedFisheries = localStorage.getItem('clic_fisheries');
    if (savedFisheries) {
      try { setFisheriesData(JSON.parse(savedFisheries)); } catch { setFisheriesData(fisheries); }
    } else {
      setFisheriesData(fisheries);
      localStorage.setItem('clic_fisheries', JSON.stringify(fisheries));
    }
  }, []);

  const saveCategories = (updated) => {
    setCategories(updated);
    localStorage.setItem('clic_categories', JSON.stringify(updated));
  };

  const saveCrops = (updated) => {
    setCropsList(updated);
    localStorage.setItem('clic_crops', JSON.stringify(updated));
  };

  const savePests = (updated) => {
    setPestsList(updated);
    localStorage.setItem('clic_pests', JSON.stringify(updated));
  };

  const saveLivestock = (updated) => {
    setLivestockList(updated);
    localStorage.setItem('clic_livestock', JSON.stringify(updated));
  };

  const saveFisheries = (updated) => {
    setFisheriesData(updated);
    localStorage.setItem('clic_fisheries', JSON.stringify(updated));
  };

  const canManage = user?.role === 'facilitator' || user?.role === 'management';
  const visibleTabs = canManage ? MAIN_TABS : MAIN_TABS.filter(t => t !== '🔧 Manage Advisories');

  return (
    <div className="advisory-page">
      <div className="page-header animate-fade-in-up">
        <h1>🌿 Farmer Support Advisory</h1>
        <p className="text-secondary">
          Agricultural practices, pest diagnosis, livestock healthcare, and fisheries management guidelines.
        </p>
      </div>

      {/* Main Category Tabs */}
      <div className="advisory-tabs animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        {visibleTabs.map(t => (
          <button
            key={t}
            className={`advisory-tab ${activeMainTab === t ? 'active' : ''}`}
            onClick={() => setActiveMainTab(t)}
          >
            {t === 'Crops Advisory' ? '🌾 Crops' :
             t === 'Livestock Advisory' ? '🐄 Livestock' :
             t === 'Fisheries Advisory' ? '🐟 Fisheries' : '🔧 Manage'}
          </button>
        ))}
      </div>

      <div className="advisory-content animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {activeMainTab === 'Crops Advisory' && (
          <CropsAdvisoryView
            categories={categories}
            cropsList={cropsList}
            pestsList={pestsList}
          />
        )}
        {activeMainTab === 'Livestock Advisory' && (
          <LivestockAdvisoryView livestockList={livestockList} />
        )}
        {activeMainTab === 'Fisheries Advisory' && (
          <FisheriesAdvisoryView fisheriesData={fisheriesData} />
        )}
        {activeMainTab === '🔧 Manage Advisories' && canManage && (
          <ManageAdvisoriesView
            categories={categories}
            saveCategories={saveCategories}
            cropsList={cropsList}
            saveCrops={saveCrops}
            pestsList={pestsList}
            savePests={savePests}
            livestockList={livestockList}
            saveLivestock={saveLivestock}
            fisheriesData={fisheriesData}
            saveFisheries={saveFisheries}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// CROPS ADVISORY VIEW
// ============================================================
function CropsAdvisoryView({ categories, cropsList, pestsList }) {
  const [activeSubTab, setActiveSubTab] = useState('Package of Practices');

  return (
    <div className="crops-advisory">
      <div className="subtabs-bar">
        {CROP_SUBTABS.map(st => (
          <button
            key={st}
            className={`subtab-btn ${activeSubTab === st ? 'active' : ''}`}
            onClick={() => setActiveSubTab(st)}
          >
            {st}
          </button>
        ))}
      </div>
      {activeSubTab === 'Package of Practices' && (
        <PoPView categories={categories} cropsList={cropsList} />
      )}
      {activeSubTab === 'Pest & Disease Management' && (
        <PestView pestsList={pestsList} />
      )}
    </div>
  );
}

function PoPView({ categories, cropsList }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [expandedStage, setExpandedStage] = useState(0);

  // Filter crops by category
  const filteredCrops = useMemo(() => {
    return cropsList.filter(c => activeCategory === 'All' || c.category === activeCategory);
  }, [cropsList, activeCategory]);

  // Sync selected crop when filtered list or category changes
  useEffect(() => {
    if (filteredCrops.length > 0) {
      setSelectedCrop(filteredCrops[0]);
    } else {
      setSelectedCrop(null);
    }
    setExpandedStage(0);
  }, [filteredCrops]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
  };

  return (
    <div className="pop-view">
      {/* Category Filter Chips */}
      <div className="category-filter">
        <span className="filter-label">Crop Category:</span>
        <div className="filter-chips">
          <button
            className={`cat-chip ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('All')}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="pop-grid-layout">
        {/* Left: Crop Selector */}
        <div className="crop-selector">
          {filteredCrops.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: 'var(--space-4)' }}>No crops in this category.</p>
          ) : (
            filteredCrops.map(c => (
              <button
                key={c.id}
                className={`crop-btn ${selectedCrop && selectedCrop.id === c.id ? 'active' : ''}`}
                onClick={() => { setSelectedCrop(c); setExpandedStage(0); }}
              >
                <span className="crop-emoji">{c.icon || '🌱'}</span>
                <div>
                  <div className="crop-btn-name">{c.name}</div>
                  <div className="crop-btn-telugu">{c.telugu}</div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Right: Selected Crop Details */}
        <div className="crop-practices-details">
          {selectedCrop ? (
            <>
              {/* Crop Info Banner */}
              <div className="crop-info-banner card">
                <div className="cib-header">
                  <span className="cib-icon">{selectedCrop.icon || '🌱'}</span>
                  <div>
                    <h2>{selectedCrop.name} <span className="telugu-text">({selectedCrop.telugu})</span></h2>
                    <p>{selectedCrop.season} · <span className="text-sky">{selectedCrop.category}</span></p>
                  </div>
                  <div className="cib-badges">
                    <span className="badge badge-amber">🗓️ Sow: {selectedCrop.sowingWindow}</span>
                    <span className="badge badge-sky">🌱 {selectedCrop.variety}</span>
                  </div>
                </div>
                <div className="cib-soil"><span className="text-muted">Recommended Soil:</span> {selectedCrop.soilType}</div>
              </div>

              {/* PoP Stages Accordion */}
              <div className="pop-stages">
                <div className="section-title">Package of Practices – Stage-wise</div>
                {selectedCrop.pop && selectedCrop.pop.length > 0 ? (
                  selectedCrop.pop.map((stage, i) => (
                    <div key={i} className={`pop-stage-card card ${expandedStage === i ? 'expanded' : ''}`}>
                      <button
                        className="pop-stage-header"
                        onClick={() => setExpandedStage(expandedStage === i ? -1 : i)}
                      >
                        <div className="pop-stage-num">{i + 1}</div>
                        <div className="pop-stage-title-area">
                          <div className="pop-stage-name">{stage.stage}</div>
                          <div className="pop-stage-timing">{stage.days}</div>
                        </div>
                        <div className="pop-stage-toggle">
                          {expandedStage === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>
                      {expandedStage === i && (
                        <div className="pop-stage-body">
                          <div className="pop-stage-advice"><Check size={14} /> {stage.advice}</div>
                          <div className="pop-stage-inputs">
                            <span className="badge badge-green">📦 Inputs required:</span> {stage.inputs}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="card text-center text-muted">No practices defined for this crop yet.</div>
                )}
              </div>
            </>
          ) : (
            <div className="card text-center text-muted" style={{ padding: 'var(--space-8)' }}>
              Select a crop from the selector to view cultivation practices.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PestView({ pestsList }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPest, setSelectedPest] = useState(null);

  // Image diagnosis states
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const filtered = pestsList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.crop.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || p.type === filterType;
    return matchSearch && matchType;
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      runMockDiagnosis(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      runMockDiagnosis(e.target.files[0].name);
    }
  };

  const runMockDiagnosis = (fileName) => {
    setDiagnosing(true);
    setDiagnosisResult(null);
    setTimeout(() => {
      setDiagnosing(false);
      if (pestsList.length === 0) return;
      const randomItem = pestsList[Math.floor(Math.random() * pestsList.length)];
      setDiagnosisResult({
        item: randomItem,
        confidence: (85 + Math.random() * 14).toFixed(1),
        fileName: fileName || "leaf_sample.jpg"
      });
    }, 2000);
  };

  return (
    <div className="pest-view">
      {/* AI Image Upload Diagnosis Widget */}
      <div className="card image-diagnosis-card">
        <div className="diagnosis-grid">
          <div className="diagnosis-uploader">
            <div className="section-title">
              <Sparkles size={18} className="text-amber animate-pulse" />
              <span>Plant Health Diagnosis (AI Uploader)</span>
            </div>
            <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
              Upload a photo of the affected crop leaf to diagnose pests or diseases.
            </p>

            <div
              className={`dropzone ${dragActive ? 'active' : ''} ${diagnosing ? 'loading' : ''}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              {diagnosing ? (
                <div className="loading-spinner-area">
                  <div className="loading-spinner" />
                  <p>Analyzing leaf patterns & symptoms...</p>
                </div>
              ) : (
                <>
                  <Upload size={40} className="text-muted upload-icon" />
                  <p className="dropzone-text">Drag plant image here, or <span>browse files</span></p>
                  <span className="text-muted" style={{ fontSize: '10px' }}>Supports JPG, PNG up to 10MB</span>
                  <input
                    type="file"
                    className="file-input-hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                    id="pest-file-uploader"
                  />
                </>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="sample-selector">
              <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Or test with a sample:</span>
              <div className="sample-buttons">
                <button className="btn btn-secondary btn-sm" onClick={() => runMockDiagnosis("cotton_bollworm_damage.png")}>
                  Cotton Bollworm Leaf 🐛
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => runMockDiagnosis("paddy_blast_brownspot.jpg")}>
                  Paddy Blast Spot 🍃
                </button>
              </div>
            </div>
          </div>

          <div className="diagnosis-result-container">
            {diagnosisResult ? (
              <div className="diagnosis-result-box card border-green animate-fade-in">
                <div className="dr-header">
                  <ShieldCheck size={20} className="text-green" />
                  <div>
                    <h4>Diagnosis Result</h4>
                    <span className="dr-filename text-muted">{diagnosisResult.fileName}</span>
                  </div>
                  <span className="badge badge-green dr-confidence">{diagnosisResult.confidence}% match</span>
                </div>

                <div className="dr-body">
                  <div className="dr-crop-disease">
                    <span className="pest-modal-icon">{diagnosisResult.item.image || '🪲'}</span>
                    <div>
                      <h5>{diagnosisResult.item.name}</h5>
                      <span className="scientific text-muted">{diagnosisResult.item.scientificName}</span>
                    </div>
                  </div>

                  <div className="dr-details">
                    <div className="dr-detail-row">
                      <span className="label">Target Crop:</span>
                      <span className="badge badge-green">{diagnosisResult.item.crop}</span>
                    </div>
                    <div className="dr-detail-row">
                      <span className="label">Severity Level:</span>
                      <span className={`badge ${diagnosisResult.item.severity === 'High' ? 'badge-red' : 'badge-amber'}`}>
                        {diagnosisResult.item.severity}
                      </span>
                    </div>
                  </div>

                  <div className="dr-advice">
                    <h6>🔍 Symptoms Identified:</h6>
                    <p>{diagnosisResult.item.symptom}</p>
                  </div>

                  <div className="dr-advice border-top-glow">
                    <h6>🛡️ Treatment & Management:</h6>
                    <p>{diagnosisResult.item.control}</p>
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 'var(--space-2)' }} onClick={() => setDiagnosisResult(null)}>
                  Clear & Run New Scan
                </button>
              </div>
            ) : (
              <div className="diagnosis-placeholder card">
                <Compass size={32} className="text-muted placeholder-icon animate-bounce-slow" />
                <h4>No Scan Results Yet</h4>
                <p className="text-secondary text-center" style={{ fontSize: 'var(--text-xs)', maxWidth: 220 }}>
                  Upload an image or pick a test sample on the left to start the crop health analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid gallery of known pests */}
      <div className="pest-search-controls">
        <div className="section-title">Common Pests & Diseases Gallery</div>
        <div className="pest-controls">
          <input
            type="search"
            className="input-field"
            placeholder="Search pest or crop name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
          <div className="filter-btns">
            {['all', 'pest', 'disease'].map(t => (
              <button key={t} className={`filter-btn ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
                {t === 'all' ? 'All' : t === 'pest' ? <><Bug size={14} /> Pests</> : <><Leaf size={14} /> Diseases</>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pest-grid">
        {filtered.length === 0 ? (
          <p className="text-muted text-center" style={{ gridColumn: 'span 3', padding: 'var(--space-8)' }}>No pests or diseases found.</p>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="pest-card card" onClick={() => setSelectedPest(p)}>
              {p.outbreak && <div className="outbreak-badge badge badge-red">🚨 Active Outbreak</div>}
              <div className="pest-icon">{p.image || '🪲'}</div>
              <div className="pest-name">{p.name}</div>
              <div className="pest-scientific">{p.scientificName}</div>
              <div className="pest-crop-tags">
                <span className="badge badge-green">{p.crop}</span>
                <span className={`badge ${p.severity === 'High' ? 'badge-red' : p.severity === 'Medium' ? 'badge-amber' : 'badge-sky'}`}>{p.severity}</span>
              </div>
              <div className="pest-symptom-preview">{p.symptom}</div>
            </div>
          ))
        )}
      </div>

      {/* Pest Detail Modal */}
      {selectedPest && (
        <div className="pest-modal-overlay" onClick={() => setSelectedPest(null)}>
          <div className="pest-modal glass-card" onClick={e => e.stopPropagation()}>
            <button className="pest-modal-close btn btn-secondary btn-sm" onClick={() => setSelectedPest(null)}>✕ Close</button>
            {selectedPest.outbreak && <div className="badge badge-red" style={{ marginBottom: 'var(--space-4)', alignSelf: 'flex-start' }}>🚨 Active Outbreak Reported</div>}
            <div className="pest-modal-icon">{selectedPest.image || '🪲'}</div>
            <h2>{selectedPest.name}</h2>
            <p className="pest-modal-sci">{selectedPest.scientificName}</p>
            <div className="pest-modal-tags">
              <span className="badge badge-green">{selectedPest.crop}</span>
              <span className={`badge ${selectedPest.type === 'pest' ? 'badge-amber' : 'badge-sky'}`}>{selectedPest.type}</span>
              <span className={`badge ${selectedPest.severity === 'High' ? 'badge-red' : 'badge-amber'}`}>Severity: {selectedPest.severity}</span>
            </div>
            <div className="pest-modal-section">
              <h4>🔍 Symptoms</h4>
              <p>{selectedPest.symptom}</p>
            </div>
            <div className="pest-modal-section">
              <h4>✅ Management & Control</h4>
              <p>{selectedPest.control}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// LIVESTOCK ADVISORY VIEW
// ============================================================
function LivestockAdvisoryView({ livestockList }) {
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [expandedSection, setExpandedSection] = useState(0);

  useEffect(() => {
    if (livestockList.length > 0) {
      setSelectedLivestock(livestockList[0]);
    } else {
      setSelectedLivestock(null);
    }
    setExpandedSection(0);
  }, [livestockList]);

  return (
    <div className="livestock-view">
      {/* Species selector */}
      <div className="livestock-selector">
        {livestockList.map(l => (
          <button
            key={l.id}
            className={`livestock-btn ${selectedLivestock && selectedLivestock.id === l.id ? 'active' : ''}`}
            onClick={() => { setSelectedLivestock(l); setExpandedSection(0); }}
          >
            <span className="livestock-emoji">{l.icon || '🐄'}</span>
            <div>
              <div className="livestock-btn-name">{l.name}</div>
              <div className="livestock-btn-telugu">{l.telugu}</div>
            </div>
          </button>
        ))}
      </div>

      {selectedLivestock ? (
        <div className="livestock-details card">
          <div className="cib-header">
            <span className="cib-icon">{selectedLivestock.icon || '🐄'}</span>
            <div>
              <h2>{selectedLivestock.name} Advisory <span className="telugu-text">({selectedLivestock.telugu})</span></h2>
              <p><span className="text-sky">Key Species / Breeds:</span> {selectedLivestock.species}</p>
            </div>
          </div>

          <div className="livestock-tabs-container">
            {/* Disease Prevention Section */}
            <div className="advisory-section">
              <div className="section-title">
                <ShieldCheck size={18} className="text-green" />
                <span>Disease Prevention Guidelines</span>
              </div>
              <div className="guidelines-list">
                {selectedLivestock.prevention && selectedLivestock.prevention.map((item, index) => (
                  <div key={index} className="guideline-card card border-green">
                    <h5>🛡️ {item.disease}</h5>
                    <p>{item.advice}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Curative Measures Section */}
            <div className="advisory-section" style={{ marginTop: 'var(--space-6)' }}>
              <div className="section-title">
                <ShieldAlert size={18} className="text-amber" />
                <span>Curative Measures & Treatments</span>
              </div>
              <div className="guidelines-list">
                {selectedLivestock.curative && selectedLivestock.curative.map((item, index) => (
                  <div key={index} className="guideline-card card border-amber">
                    <h5>💊 {item.disease}</h5>
                    <p>{item.treatment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Husbandry POP practices */}
            <div className="advisory-section" style={{ marginTop: 'var(--space-6)' }}>
              <div className="section-title">
                <Info size={18} className="text-sky" />
                <span>General Husbandry Packages of Practices</span>
              </div>
              <div className="pop-stages">
                {selectedLivestock.pop && selectedLivestock.pop.map((item, index) => (
                  <div key={index} className={`pop-stage-card card ${expandedSection === index ? 'expanded' : ''}`}>
                    <button className="pop-stage-header" onClick={() => setExpandedSection(expandedSection === index ? -1 : index)}>
                      <div className="pop-stage-num">{index + 1}</div>
                      <div className="pop-stage-title-area">
                        <div className="pop-stage-name">{item.stage}</div>
                      </div>
                      <div className="pop-stage-toggle">
                        {expandedSection === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    {expandedSection === index && (
                      <div className="pop-stage-body">
                        <p style={{ fontSize: 'var(--text-sm)' }}>{item.detail}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center text-muted">No livestock advisory records available.</div>
      )}
    </div>
  );
}

// ============================================================
// FISHERIES ADVISORY VIEW
// ============================================================
function FisheriesAdvisoryView({ fisheriesData }) {
  const [expandedFishSection, setExpandedFishSection] = useState('varieties');

  // Calculator states
  const [pondLength, setPondLength] = useState(40);
  const [pondWidth, setPondWidth] = useState(25);
  const [pondDepth, setPondDepth] = useState(1.8);

  if (!fisheriesData) return <div className="card text-center text-muted">Loading fisheries guidelines...</div>;

  const surfaceArea = pondLength * pondWidth;
  const volume = surfaceArea * pondDepth;
  const recommendedDensity = Math.round(volume * 1.2);

  return (
    <div className="fisheries-view">
      {/* Calculator Widget */}
      <div className="card calculator-card">
        <div className="calc-header">
          <Calculator size={22} className="text-sky animate-pulse" />
          <div>
            <h3>📐 Fish Pond Size & Stocking Calculator</h3>
            <p className="text-secondary" style={{ fontSize: 'var(--text-xs)' }}>
              Calculate pond water capacity and recommended fingerling stocking densities based on pond dimensions.
            </p>
          </div>
        </div>

        <div className="calc-grid">
          <div className="calc-inputs">
            <div className="form-group">
              <label>Pond Length (meters)</label>
              <input
                type="number"
                className="input-field"
                value={pondLength}
                min={5}
                onChange={e => setPondLength(Math.max(0, +e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Pond Width (meters)</label>
              <input
                type="number"
                className="input-field"
                value={pondWidth}
                min={5}
                onChange={e => setPondWidth(Math.max(0, +e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Average Water Depth (meters)</label>
              <input
                type="number"
                className="input-field"
                value={pondDepth}
                min={0.5}
                step={0.1}
                onChange={e => setPondDepth(Math.max(0, +e.target.value))}
              />
            </div>
          </div>

          <div className="calc-results-box card">
            <div className="calc-results-grid">
              <div className="calc-stat">
                <span className="val">{surfaceArea.toLocaleString()} m²</span>
                <span className="key">Pond Surface Area</span>
              </div>
              <div className="calc-stat">
                <span className="val text-sky">{volume.toLocaleString()} m³</span>
                <span className="key">Water Volume</span>
              </div>
              <div className="calc-stat highlight border-green">
                <span className="val text-green">{recommendedDensity.toLocaleString()}</span>
                <span className="key">Fingerlings Stocking Recommendation</span>
              </div>
            </div>

            <div className="fish-species-ratio">
              <h6>Recommended Species Poly-Culture Ratio:</h6>
              <div className="ratio-bar">
                <div className="ratio-segment surface" style={{ width: '30%' }} title="30% Catla (Surface Feeder)">Catla 30%</div>
                <div className="ratio-segment column" style={{ width: '40%' }} title="40% Rohu (Column Feeder)">Rohu 40%</div>
                <div className="ratio-segment bottom" style={{ width: '30%' }} title="30% Mrigal (Bottom Feeder)">Mrigal 30%</div>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                Poly-culture utilizes food from all pond depths, maximizing yield and feed efficiency.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Tabs Selector */}
      <div className="fish-guides-container" style={{ marginTop: 'var(--space-6)' }}>
        <div className="fish-guide-selector">
          <button className={`guide-tab-btn ${expandedFishSection === 'varieties' ? 'active' : ''}`} onClick={() => setExpandedFishSection('varieties')}>
            🐟 Varieties & Stocking
          </button>
          <button className={`guide-tab-btn ${expandedFishSection === 'weeding' ? 'active' : ''}`} onClick={() => setExpandedFishSection('weeding')}>
            🌿 Weeding Management
          </button>
          <button className={`guide-tab-btn ${expandedFishSection === 'manuring' ? 'active' : ''}`} onClick={() => setExpandedFishSection('manuring')}>
            💩 Manuring & Liming
          </button>
        </div>

        <div className="fish-guide-content card">
          {/* Varieties */}
          {expandedFishSection === 'varieties' && (
            <div className="fish-guide-varieties">
              <div className="section-title">Stocking Varieties & Details</div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                {fisheriesData.pondsize ? fisheriesData.pondsize.guide : ''}
              </p>
              <div className="fish-varieties-grid">
                {fisheriesData.varieties && fisheriesData.varieties.map((v, i) => (
                  <div key={i} className="card variety-item border-sky">
                    <h4>{v.name}</h4>
                    <ul className="variety-details-list">
                      <li><span>Target Density:</span> <strong>{v.density}</strong></li>
                      <li><span>Feeding Style:</span> <strong>{v.feed}</strong></li>
                      <li><span>Culture Period:</span> <strong>{v.period}</strong></li>
                      <li><span>Harvest Size:</span> <strong>{v.size}</strong></li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weeding */}
          {expandedFishSection === 'weeding' && (
            <div className="fish-guide-weeding">
              <div className="section-title">Aquatic Weed Control</div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                Aquatic weeds consume nutrients, deplete dissolved oxygen, and restrict fish movements. Manage them actively.
              </p>
              <div className="weeding-table-container">
                {fisheriesData.weeding && fisheriesData.weeding.map((w, i) => (
                  <div key={i} className="weeding-row card">
                    <div className="weeding-header">
                      <span className="num-circle">{i + 1}</span>
                      <h5>{w.type}</h5>
                    </div>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginLeft: '40px' }}>
                      <strong>Control Strategy:</strong> {w.control}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manuring */}
          {expandedFishSection === 'manuring' && (
            <div className="fish-guide-manuring">
              <div className="section-title">Pond Manuring & Liming Guidelines</div>
              <p className="text-secondary" style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
                Fertilizers promote plankton bloom which forms the base feed for fishes. Liming stabilizes pH and water quality.
              </p>
              <div className="manuring-schedule">
                {fisheriesData.manuring && fisheriesData.manuring.map((m, i) => (
                  <div key={i} className="schedule-item card border-amber">
                    <h5>{m.type}</h5>
                    <p style={{ fontSize: 'var(--text-sm)' }}>{m.application}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MANAGEMENT VIEW (CRUD)
// ============================================================
function ManageAdvisoriesView({
  categories, saveCategories,
  cropsList, saveCrops,
  pestsList, savePests,
  livestockList, saveLivestock,
  fisheriesData, saveFisheries
}) {
  const [activeSubSection, setActiveSubSection] = useState('Categories');

  return (
    <div className="manage-advisories-view">
      <div className="subtabs-bar">
        {MGMT_SECTIONS.map(s => (
          <button
            key={s}
            className={`subtab-btn ${activeSubSection === s ? 'active' : ''}`}
            onClick={() => setActiveSubSection(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mgmt-content" style={{ marginTop: 'var(--space-4)' }}>
        {activeSubSection === 'Categories' && (
          <CategoriesManager categories={categories} saveCategories={saveCategories} />
        )}
        {activeSubSection === 'Crops Database' && (
          <CropsManager categories={categories} cropsList={cropsList} saveCrops={saveCrops} />
        )}
        {activeSubSection === 'Pests & Diseases' && (
          <PestsManager cropsList={cropsList} pestsList={pestsList} savePests={savePests} />
        )}
        {activeSubSection === 'Livestock DB' && (
          <LivestockManager livestockList={livestockList} saveLivestock={saveLivestock} />
        )}
        {activeSubSection === 'Fisheries Guides' && (
          <FisheriesManager fisheriesData={fisheriesData} saveFisheries={saveFisheries} />
        )}
      </div>
    </div>
  );
}

// ── 1. CATEGORIES MANAGER ───────────────────────────────────
function CategoriesManager({ categories, saveCategories }) {
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert('Category already exists.');
      return;
    }
    const updated = [...categories, trimmed];
    saveCategories(updated);
    setNewCatName('');
  };

  const handleDeleteCategory = (catToDelete) => {
    if (window.confirm(`Are you sure you want to delete category "${catToDelete}"?`)) {
      const updated = categories.filter(c => c !== catToDelete);
      saveCategories(updated);
    }
  };

  return (
    <div className="categories-manager card">
      <div className="section-title">
        <FolderPlus size={18} className="text-sky" />
        <span>Manage Crop Categories</span>
      </div>
      <p className="text-secondary" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>
        Add or delete crop categories. These categories organize Package of Practices in the Crops view.
      </p>

      <form onSubmit={handleAddCategory} className="cat-add-form" style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Vegetables, Horticulture"
          value={newCatName}
          onChange={e => setNewCatName(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary">
          <Plus size={14} /> Add Category
        </button>
      </form>

      <h5>Current Categories</h5>
      <div className="categories-table-wrapper" style={{ marginTop: 'var(--space-3)' }}>
        <table className="logs-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={i}>
                <td className="font-semibold text-green">{c}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-icon text-alert" title="Delete" onClick={() => handleDeleteCategory(c)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── 2. CROPS MANAGER ────────────────────────────────────────
function CropsManager({ categories, cropsList, saveCrops }) {
  const [editingCropId, setEditingCropId] = useState(null);

  // Crop Form states
  const [cropId, setCropId] = useState('');
  const [name, setName] = useState('');
  const [telugu, setTelugu] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Cereals');
  const [icon, setIcon] = useState('🌾');
  const [season, setSeason] = useState('');
  const [sowingWindow, setSowingWindow] = useState('');
  const [variety, setVariety] = useState('');
  const [soilType, setSoilType] = useState('');
  const [popStages, setPopStages] = useState([]);

  // Sync category state when categories load
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleEdit = (crop) => {
    setEditingCropId(crop.id);
    setCropId(crop.id);
    setName(crop.name);
    setTelugu(crop.telugu);
    setCategory(crop.category);
    setIcon(crop.icon || '🌾');
    setSeason(crop.season);
    setSowingWindow(crop.sowingWindow);
    setVariety(crop.variety);
    setSoilType(crop.soilType);
    setPopStages(crop.pop ? [...crop.pop] : []);
  };

  const handleAddNewForm = () => {
    setEditingCropId('new');
    setCropId('');
    setName('');
    setTelugu('');
    setCategory(categories[0] || 'Cereals');
    setIcon('🌾');
    setSeason('');
    setSowingWindow('');
    setVariety('');
    setSoilType('');
    setPopStages([{ stage: '', days: '', advice: '', inputs: '' }]);
  };

  const handleSaveCrop = (e) => {
    e.preventDefault();
    if (!name || !season) {
      alert('Name and Season are required.');
      return;
    }

    const calculatedId = cropId.trim().toLowerCase() || name.replace(/\s+/g, '-').toLowerCase();

    const newCropObj = {
      id: calculatedId,
      name,
      telugu,
      category,
      icon,
      season,
      sowingWindow,
      variety,
      soilType,
      pop: popStages.filter(s => s.stage)
    };

    let updatedCrops;
    if (editingCropId === 'new') {
      if (cropsList.some(c => c.id === calculatedId)) {
        alert('Crop ID already exists. Please choose a unique name.');
        return;
      }
      updatedCrops = [...cropsList, newCropObj];
    } else {
      updatedCrops = cropsList.map(c => c.id === editingCropId ? newCropObj : c);
    }

    saveCrops(updatedCrops);
    setEditingCropId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      const updated = cropsList.filter(c => c.id !== id);
      saveCrops(updated);
    }
  };

  const handleStageChange = (index, field, value) => {
    const updated = popStages.map((s, idx) => {
      if (idx === index) return { ...s, [field]: value };
      return s;
    });
    setPopStages(updated);
  };

  const addStageRow = () => {
    setPopStages([...popStages, { stage: '', days: '', advice: '', inputs: '' }]);
  };

  const removeStageRow = (index) => {
    setPopStages(popStages.filter((_, idx) => idx !== index));
  };

  return (
    <div className="crops-manager">
      {editingCropId ? (
        <div className="card crop-form-card">
          <div className="section-title">
            <Save size={18} className="text-sky" />
            <span>{editingCropId === 'new' ? 'Create Crop Record' : `Edit Crop: ${name}`}</span>
          </div>

          <form onSubmit={handleSaveCrop}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Crop Identifier/ID (alphanumeric)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. tomato"
                  value={cropId}
                  onChange={e => setCropId(e.target.value)}
                  disabled={editingCropId !== 'new'}
                />
              </div>

              <div className="form-group">
                <label>Crop Name (English) *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Tomato"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Name in Telugu (తెలుగు పేరు)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. టమోటా"
                  value={telugu}
                  onChange={e => setTelugu(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="input-field select-field"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Emoji Icon</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 🍅"
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Sowing Season *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Rabi (November–March)"
                  value={season}
                  onChange={e => setSeason(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Sowing Window</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Nov 1 – Dec 15"
                  value={sowingWindow}
                  onChange={e => setSowingWindow(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Variety</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Pusa Ruby, Arka Vikas"
                  value={variety}
                  onChange={e => setVariety(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Soil Type</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Well-drained sandy loam, pH 6.0–7.0"
                  value={soilType}
                  onChange={e => setSoilType(e.target.value)}
                />
              </div>
            </div>

            <div className="pop-form-stages-area" style={{ marginTop: 'var(--space-6)' }}>
              <div className="pop-stages-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <h5>Cultivation Stages (Package of Practices)</h5>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addStageRow}>
                  <Plus size={12} /> Add Stage
                </button>
              </div>

              {popStages.map((stage, i) => (
                <div key={i} className="pop-stage-row card" style={{ padding: 'var(--space-4) !important', marginBottom: 'var(--space-3)', borderStyle: 'dashed' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <strong>Stage #{i + 1}</strong>
                    <button type="button" className="btn-icon text-alert" title="Remove Stage" onClick={() => removeStageRow(i)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="register-form-grid" style={{ gap: 'var(--space-3)' }}>
                    <div className="form-group">
                      <label>Stage Name</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Land Preparation"
                        value={stage.stage}
                        onChange={e => handleStageChange(i, 'stage', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Days / Timing</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. 10 days before sowing"
                        value={stage.days}
                        onChange={e => handleStageChange(i, 'days', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Advice / Action</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Cultivation steps..."
                        value={stage.advice}
                        onChange={e => handleStageChange(i, 'advice', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Inputs / Fertilizers / Quantities</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="e.g. Neem Cake 100kg/acre"
                        value={stage.inputs}
                        onChange={e => handleStageChange(i, 'inputs', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Crop Record</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingCropId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card crops-list-card">
          <div className="library-action-header">
            <div className="section-title">Crops Records Database</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNewForm}>
              <Plus size={14} /> Add Crop
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Telugu Name</th>
                  <th>Category</th>
                  <th>Season</th>
                  <th>Pop Stages</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cropsList.map(c => (
                  <tr key={c.id}>
                    <td>
                      <span style={{ marginRight: '8px' }}>{c.icon || '🌱'}</span>
                      <strong>{c.name}</strong>
                    </td>
                    <td>{c.telugu || '-'}</td>
                    <td><span className="badge badge-sky">{c.category}</span></td>
                    <td className="text-secondary">{c.season}</td>
                    <td>{c.pop ? c.pop.length : 0} stages</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} title="Edit" onClick={() => handleEdit(c)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" title="Delete" onClick={() => handleDelete(c.id)}>
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

// ── 3. PESTS MANAGER ────────────────────────────────────────
function PestsManager({ cropsList, pestsList, savePests }) {
  const [editingPestId, setEditingPestId] = useState(null);

  // Pest form state
  const [pestName, setPestName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [targetCrop, setTargetCrop] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [type, setType] = useState('pest');
  const [symptom, setSymptom] = useState('');
  const [control, setControl] = useState('');
  const [image, setImage] = useState('🐛');
  const [season, setSeason] = useState('Kharif');
  const [outbreak, setOutbreak] = useState(false);

  useEffect(() => {
    if (cropsList.length > 0 && !targetCrop) {
      setTargetCrop(cropsList[0].name);
    }
  }, [cropsList, targetCrop]);

  const handleEdit = (p) => {
    setEditingPestId(p.id);
    setPestName(p.name);
    setScientificName(p.scientificName);
    setTargetCrop(p.crop);
    setSeverity(p.severity);
    setType(p.type);
    setSymptom(p.symptom);
    setControl(p.control);
    setImage(p.image || '🐛');
    setSeason(p.season || 'Kharif');
    setOutbreak(p.outbreak || false);
  };

  const handleAddNew = () => {
    setEditingPestId('new');
    setPestName('');
    setScientificName('');
    setTargetCrop(cropsList[0]?.name || 'Paddy');
    setSeverity('Medium');
    setType('pest');
    setSymptom('');
    setControl('');
    setImage('🐛');
    setSeason('Kharif');
    setOutbreak(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!pestName || !symptom || !control) {
      alert('Please fill in Name, Symptoms, and Control fields.');
      return;
    }

    const newObj = {
      id: editingPestId === 'new' ? Date.now() : editingPestId,
      name: pestName,
      scientificName,
      crop: targetCrop,
      severity,
      type,
      symptom,
      control,
      image,
      season,
      outbreak
    };

    let updatedList;
    if (editingPestId === 'new') {
      updatedList = [newObj, ...pestsList];
    } else {
      updatedList = pestsList.map(p => p.id === editingPestId ? newObj : p);
    }

    savePests(updatedList);
    setEditingPestId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updated = pestsList.filter(p => p.id !== id);
      savePests(updated);
    }
  };

  return (
    <div className="pests-manager">
      {editingPestId ? (
        <div className="card pest-form-card">
          <div className="section-title">
            <Save size={18} className="text-sky" />
            <span>{editingPestId === 'new' ? 'Add Pest / Disease Entry' : `Edit: ${pestName}`}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Identifier Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Yellow Stem Borer"
                  value={pestName}
                  onChange={e => setPestName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Scientific Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Scirpophaga incertulas"
                  value={scientificName}
                  onChange={e => setScientificName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Target Crop</label>
                <select
                  className="input-field select-field"
                  value={targetCrop}
                  onChange={e => setTargetCrop(e.target.value)}
                >
                  {cropsList.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  {!cropsList.some(c => c.name === 'Maize') && <option value="Maize">Maize</option>}
                </select>
              </div>

              <div className="form-group">
                <label>Severity</label>
                <select className="input-field select-field" value={severity} onChange={e => setSeverity(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="form-group">
                <label>Advisory Type</label>
                <select className="input-field select-field" value={type} onChange={e => setType(e.target.value)}>
                  <option value="pest">Pest (Bug/Worm)</option>
                  <option value="disease">Disease (Bacterial/Fungal)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Emoji Symbol</label>
                <input
                  type="text"
                  className="input-field"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Active Season</label>
                <input
                  type="text"
                  className="input-field"
                  value={season}
                  onChange={e => setSeason(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24 }}>
                <input
                  type="checkbox"
                  id="outbreak-checkbox"
                  checked={outbreak}
                  onChange={e => setOutbreak(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--color-alert-red)' }}
                />
                <label htmlFor="outbreak-checkbox" style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-alert-red)' }}>
                  🚨 Active Outbreak Active in District
                </label>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Identified Symptoms *</label>
                <textarea
                  className="input-field"
                  placeholder="Describe leaf spotting, bored holes, color patterns..."
                  value={symptom}
                  onChange={e => setSymptom(e.target.value)}
                  rows={2}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Recommended Control & Treatment *</label>
                <textarea
                  className="input-field"
                  placeholder="Chemical spray formulas, ratios, biological agents, soil modifications..."
                  value={control}
                  onChange={e => setControl(e.target.value)}
                  rows={2}
                  required
                />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Entry</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingPestId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card pests-list-card">
          <div className="library-action-header">
            <div className="section-title">Pests & Diseases Registry</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Entry
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Crop</th>
                  <th>Severity</th>
                  <th>Type</th>
                  <th>Outbreak</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pestsList.map(p => (
                  <tr key={p.id}>
                    <td>
                      <span style={{ marginRight: '8px' }}>{p.image || '🪲'}</span>
                      <strong>{p.name}</strong>
                    </td>
                    <td><span className="badge badge-green">{p.crop}</span></td>
                    <td>
                      <span className={`badge ${p.severity === 'High' ? 'badge-red' : p.severity === 'Medium' ? 'badge-amber' : 'badge-sky'}`}>
                        {p.severity}
                      </span>
                    </td>
                    <td className="text-secondary">{p.type}</td>
                    <td>{p.outbreak ? <span className="text-alert font-bold">Active 🚨</span> : 'No'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} title="Edit" onClick={() => handleEdit(p)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" title="Delete" onClick={() => handleDelete(p.id)}>
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

// ── 4. LIVESTOCK MANAGER ────────────────────────────────────
function LivestockManager({ livestockList, saveLivestock }) {
  const [editingLiveId, setEditingLiveId] = useState(null);

  // Form states
  const [lName, setLName] = useState('');
  const [lTelugu, setLTelugu] = useState('');
  const [lIcon, setLIcon] = useState('🐄');
  const [lSpecies, setLSpecies] = useState('');
  const [preventionList, setPreventionList] = useState([]);
  const [curativeList, setCurativeList] = useState([]);
  const [popList, setPopList] = useState([]);

  const handleEdit = (l) => {
    setEditingLiveId(l.id);
    setLName(l.name);
    setLTelugu(l.telugu || '');
    setLIcon(l.icon || '🐄');
    setLSpecies(l.species || '');
    setPreventionList(l.prevention ? [...l.prevention] : []);
    setCurativeList(l.curative ? [...l.curative] : []);
    setPopList(l.pop ? [...l.pop] : []);
  };

  const handleAddNew = () => {
    setEditingLiveId('new');
    setLName('');
    setLTelugu('');
    setLIcon('🐄');
    setLSpecies('');
    setPreventionList([{ disease: '', advice: '' }]);
    setCurativeList([{ disease: '', treatment: '' }]);
    setPopList([{ stage: '', detail: '' }]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!lName) {
      alert('Livestock Name is required.');
      return;
    }

    const calculatedId = editingLiveId === 'new' ? `live-${Date.now()}` : editingLiveId;

    const newObj = {
      id: calculatedId,
      name: lName,
      telugu: lTelugu,
      icon: lIcon,
      species: lSpecies,
      prevention: preventionList.filter(p => p.disease),
      curative: curativeList.filter(c => c.disease),
      pop: popList.filter(p => p.stage)
    };

    let updatedList;
    if (editingLiveId === 'new') {
      updatedList = [...livestockList, newObj];
    } else {
      updatedList = livestockList.map(l => l.id === editingLiveId ? newObj : l);
    }

    saveLivestock(updatedList);
    setEditingLiveId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this livestock record?')) {
      const updated = livestockList.filter(l => l.id !== id);
      saveLivestock(updated);
    }
  };

  return (
    <div className="livestock-manager">
      {editingLiveId ? (
        <div className="card live-form-card">
          <div className="section-title">
            <Save size={18} className="text-sky" />
            <span>{editingLiveId === 'new' ? 'Register Livestock Category' : `Edit: ${lName}`}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid" style={{ marginBottom: 'var(--space-5)' }}>
              <div className="form-group">
                <label>Species Name (English) *</label>
                <input type="text" className="input-field" value={lName} onChange={e => setLName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Name in Telugu (తెలుగు పేరు)</label>
                <input type="text" className="input-field" value={lTelugu} onChange={e => setLTelugu(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Emoji Icon</label>
                <input type="text" className="input-field" value={lIcon} onChange={e => setLIcon(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Key Breeds / Varieties</label>
                <input type="text" className="input-field" placeholder="Jersey, Ongole..." value={lSpecies} onChange={e => setLSpecies(e.target.value)} />
              </div>
            </div>

            {/* Prevention Subforms */}
            <div className="pop-form-stages-area" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div className="pop-stages-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5>Disease Prevention Guidelines</h5>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPreventionList([...preventionList, { disease: '', advice: '' }])}>
                  <Plus size={12} /> Add Rule
                </button>
              </div>
              {preventionList.map((item, idx) => (
                <div key={idx} className="pop-stage-row card" style={{ padding: 'var(--space-3) !important', marginTop: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong>Rule #{idx + 1}</strong>
                    <button type="button" className="btn-icon text-alert" onClick={() => setPreventionList(preventionList.filter((_, i) => i !== idx))}><Trash2 size={12} /></button>
                  </div>
                  <div className="register-form-grid" style={{ gap: '8px' }}>
                    <input type="text" className="input-field" placeholder="Disease Name (e.g. Foot and Mouth)" value={item.disease} onChange={e => setPreventionList(preventionList.map((p, i) => i === idx ? { ...p, disease: e.target.value } : p))} required />
                    <input type="text" className="input-field" placeholder="Preventative action / vaccine timing" value={item.advice} onChange={e => setPreventionList(preventionList.map((p, i) => i === idx ? { ...p, advice: e.target.value } : p))} required />
                  </div>
                </div>
              ))}
            </div>

            {/* Curative Subforms */}
            <div className="pop-form-stages-area" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div className="pop-stages-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5>Curative Measures & Treatments</h5>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCurativeList([...curativeList, { disease: '', treatment: '' }])}>
                  <Plus size={12} /> Add Treatment
                </button>
              </div>
              {curativeList.map((item, idx) => (
                <div key={idx} className="pop-stage-row card" style={{ padding: 'var(--space-3) !important', marginTop: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong>Treatment #{idx + 1}</strong>
                    <button type="button" className="btn-icon text-alert" onClick={() => setCurativeList(curativeList.filter((_, i) => i !== idx))}><Trash2 size={12} /></button>
                  </div>
                  <div className="register-form-grid" style={{ gap: '8px' }}>
                    <input type="text" className="input-field" placeholder="Ailment / Infection name" value={item.disease} onChange={e => setCurativeList(curativeList.map((c, i) => i === idx ? { ...c, disease: e.target.value } : c))} required />
                    <input type="text" className="input-field" placeholder="Curative dosage / medicine" value={item.treatment} onChange={e => setCurativeList(curativeList.map((c, i) => i === idx ? { ...c, treatment: e.target.value } : c))} required />
                  </div>
                </div>
              ))}
            </div>

            {/* Husbandry POP Subforms */}
            <div className="pop-form-stages-area" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
              <div className="pop-stages-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5>Husbandry Practices</h5>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPopList([...popList, { stage: '', detail: '' }])}>
                  <Plus size={12} /> Add Practice
                </button>
              </div>
              {popList.map((item, idx) => (
                <div key={idx} className="pop-stage-row card" style={{ padding: 'var(--space-3) !important', marginTop: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <strong>Practice #{idx + 1}</strong>
                    <button type="button" className="btn-icon text-alert" onClick={() => setPopList(popList.filter((_, i) => i !== idx))}><Trash2 size={12} /></button>
                  </div>
                  <div className="register-form-grid" style={{ gap: '8px' }}>
                    <input type="text" className="input-field" placeholder="Stage / Practice Title" value={item.stage} onChange={e => setPopList(popList.map((p, i) => i === idx ? { ...p, stage: e.target.value } : p))} required />
                    <input type="text" className="input-field" placeholder="Husbandry detailed advice" value={item.detail} onChange={e => setPopList(popList.map((p, i) => i === idx ? { ...p, detail: e.target.value } : p))} required />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Livestock Record</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingLiveId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card livestock-list-card">
          <div className="library-action-header">
            <div className="section-title">Livestock Advisory Database</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Category
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Telugu Translation</th>
                  <th>Breeds List</th>
                  <th>Prevention Rules</th>
                  <th>Treatments</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {livestockList.map(l => (
                  <tr key={l.id}>
                    <td>
                      <span style={{ marginRight: '8px' }}>{l.icon || '🐄'}</span>
                      <strong>{l.name}</strong>
                    </td>
                    <td>{l.telugu || '-'}</td>
                    <td className="text-secondary">{l.species}</td>
                    <td>{l.prevention ? l.prevention.length : 0} rules</td>
                    <td>{l.curative ? l.curative.length : 0} treatments</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} title="Edit" onClick={() => handleEdit(l)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" title="Delete" onClick={() => handleDelete(l.id)}>
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

// ── 5. FISHERIES MANAGER ────────────────────────────────────
function FisheriesManager({ fisheriesData, saveFisheries }) {
  const [pondGuide, setPondGuide] = useState(fisheriesData?.pondsize?.guide || '');
  const [varieties, setVarieties] = useState(fisheriesData?.varieties || []);
  const [weeding, setWeeding] = useState(fisheriesData?.weeding || []);
  const [manuring, setManuring] = useState(fisheriesData?.manuring || []);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      varieties,
      pondsize: {
        guide: pondGuide,
        calculator: fisheriesData.pondsize.calculator
      },
      weeding,
      manuring
    };
    saveFisheries(updated);
    alert('Fisheries guidelines updated successfully!');
  };

  const handleVarietyChange = (index, field, value) => {
    const updated = varieties.map((v, i) => i === index ? { ...v, [field]: value } : v);
    setVarieties(updated);
  };

  const handleWeedChange = (index, field, value) => {
    const updated = weeding.map((w, i) => i === index ? { ...w, [field]: value } : w);
    setWeeding(updated);
  };

  const handleManureChange = (index, field, value) => {
    const updated = manuring.map((m, i) => i === index ? { ...m, [field]: value } : m);
    setManuring(updated);
  };

  return (
    <div className="fisheries-manager card">
      <div className="section-title">
        <Edit2 size={18} className="text-sky" />
        <span>Manage Fisheries Advisory Guidelines</span>
      </div>

      <form onSubmit={handleSave}>
        {/* Pond Guide */}
        <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
          <label>Pond Size Guidelines Text</label>
          <textarea
            className="input-field"
            value={pondGuide}
            onChange={e => setPondGuide(e.target.value)}
            rows={2}
            required
          />
        </div>

        {/* Varieties Grid */}
        <div className="advisory-section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <h5>Fish Varieties (Surface, Column, Bottom)</h5>
          {varieties.map((v, idx) => (
            <div key={idx} className="variety-item card" style={{ padding: 'var(--space-3) !important', marginTop: 'var(--space-3)' }}>
              <h6><strong>{v.name}</strong></h6>
              <div className="register-form-grid" style={{ gap: '8px', marginTop: 4 }}>
                <div className="form-group">
                  <label>Stocking Density</label>
                  <input type="text" className="input-field" value={v.density} onChange={e => handleVarietyChange(idx, 'density', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Feed details</label>
                  <input type="text" className="input-field" value={v.feed} onChange={e => handleVarietyChange(idx, 'feed', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Culture Period</label>
                  <input type="text" className="input-field" value={v.period} onChange={e => handleVarietyChange(idx, 'period', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Harvest Average Weight</label>
                  <input type="text" className="input-field" value={v.size} onChange={e => handleVarietyChange(idx, 'size', e.target.value)} required />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weeds */}
        <div className="advisory-section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <h5>Weeding Management Methods</h5>
          {weeding.map((w, idx) => (
            <div key={idx} className="variety-item card" style={{ padding: 'var(--space-3) !important', marginTop: 'var(--space-3)' }}>
              <h6><strong>{w.type}</strong></h6>
              <div className="form-group" style={{ marginTop: 4 }}>
                <label>Weeding Control Strategy</label>
                <input type="text" className="input-field" value={w.control} onChange={e => handleWeedChange(idx, 'control', e.target.value)} required />
              </div>
            </div>
          ))}
        </div>

        {/* Manuring */}
        <div className="advisory-section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <h5>Manuring Schedules</h5>
          {manuring.map((m, idx) => (
            <div key={idx} className="variety-item card" style={{ padding: 'var(--space-3) !important', marginTop: 'var(--space-3)' }}>
              <h6><strong>{m.type}</strong></h6>
              <div className="form-group" style={{ marginTop: 4 }}>
                <label>Schedule & Dosage details</label>
                <textarea rows={2} className="input-field" value={m.application} onChange={e => handleManureChange(idx, 'application', e.target.value)} required />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          <Save size={16} /> Save Fisheries Guidelines
        </button>
      </form>
    </div>
  );
}
