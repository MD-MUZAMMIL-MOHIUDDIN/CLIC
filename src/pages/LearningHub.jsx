import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videos as initialVideos, successStories, millets } from '../data/crops';
import { FARM_MACHINES, MACHINERY_OPERATIONS } from '../data/machineryData';
import {
  Play, Eye, Users, Wheat, FileText, Link2, BookOpen, Tag,
  Plus, Search, CheckCircle2, AlertCircle, Trash2, Edit2, Save,
  Tractor, Image as ImageIcon, Video, Sparkles, ExternalLink, X,
  ChevronRight, ChevronLeft, Building2, Wrench, ShieldCheck, Info
} from 'lucide-react';
import '../styles/learning.css';

const TABS = ['Digital Library', 'CHC Machinery', 'FMC Machinery', 'Success Stories', 'Nutritional Info'];
const MATERIAL_TYPES = ['All', 'video', 'pdf', 'article', 'link'];
const AVAILABLE_TAGS = ['Organic', 'Water Conservation', 'Millets', 'Soil Health', 'Livestock', 'Fisheries', 'Paddy', 'Cotton', 'Schemes', 'Support'];

export default function LearningHub() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Digital Library');

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam) {
      const allTabs = [...TABS, 'Machinery & Equipment', '🔧 Manage Hub'];
      let match = allTabs.find(t => t.toLowerCase().includes(tabParam.toLowerCase()));
      if (!match && (tabParam.toLowerCase().includes('traditional') || tabParam.toLowerCase().includes('grains'))) {
        match = 'Nutritional Info';
      }
      if (!match && (tabParam.toLowerCase().includes('machin') || tabParam.toLowerCase().includes('equipment'))) {
        match = 'CHC Machinery';
      }
      if (!match && tabParam.toLowerCase().includes('chc')) {
        match = 'CHC Machinery';
      }
      if (!match && tabParam.toLowerCase().includes('fmc')) {
        match = 'FMC Machinery';
      }
      if (match === 'Machinery & Equipment') {
        match = 'CHC Machinery';
      }
      if (match) {
        setActiveTab(match);
      }
    }
  }, [tabParam]);
  const [searchVid, setSearchVid] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);

  // Database States (synchronized with localStorage)
  const [materials, setMaterials] = useState([]);
  const [successStoriesList, setSuccessStoriesList] = useState([]);
  const [milletsList, setMilletsList] = useState([]);

  // Machinery & Equipment knowledge base from master clic_custom_machines
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

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Materials
    const saved = localStorage.getItem('clic_materials');
    if (saved) {
      try {
        setMaterials(JSON.parse(saved));
      } catch {
        setMaterials(initialVideos);
      }
    } else {
      setMaterials(initialVideos);
      localStorage.setItem('clic_materials', JSON.stringify(initialVideos));
    }

    // Success stories
    const savedStories = localStorage.getItem('clic_success_stories');
    if (savedStories) {
      try {
        setSuccessStoriesList(JSON.parse(savedStories));
      } catch {
        setSuccessStoriesList(successStories);
      }
    } else {
      setSuccessStoriesList(successStories);
      localStorage.setItem('clic_success_stories', JSON.stringify(successStories));
    }

    // Millets / Traditional grains
    const savedMillets = localStorage.getItem('clic_millets');
    if (savedMillets) {
      try {
        setMilletsList(JSON.parse(savedMillets));
      } catch {
        setMilletsList(millets);
      }
    } else {
      setMilletsList(millets);
      localStorage.setItem('clic_millets', JSON.stringify(millets));
    }
  }, []);

  // Real-time synchronization with CHC / FMC additions & updates
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('clic_custom_machines');
      if (saved) {
        try { setMachines(JSON.parse(saved)); } catch (e) { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const saveMaterials = (updated) => {
    setMaterials(updated);
    localStorage.setItem('clic_materials', JSON.stringify(updated));
  };

  const saveSuccessStories = (updated) => {
    setSuccessStoriesList(updated);
    localStorage.setItem('clic_success_stories', JSON.stringify(updated));
  };

  const saveMillets = (updated) => {
    setMilletsList(updated);
    localStorage.setItem('clic_millets', JSON.stringify(updated));
  };

  const [sortBy, setSortBy] = useState('popular');
  const [activeMaterialModal, setActiveMaterialModal] = useState(null);

  const categories = useMemo(() => {
    return ['All', ...new Set(materials.map(m => m.category))];
  }, [materials]);

  // Counts for Format & Categories
  const formatCounts = useMemo(() => {
    const counts = { All: materials.length, video: 0, pdf: 0, article: 0, link: 0 };
    materials.forEach(m => {
      if (counts[m.type] !== undefined) counts[m.type]++;
    });
    return counts;
  }, [materials]);

  const categoryCounts = useMemo(() => {
    const counts = { All: materials.length };
    materials.forEach(m => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [materials]);

  // Filtering & Sorting Logic for Digital Library
  const filteredMaterials = useMemo(() => {
    let result = materials.filter(m => {
      const q = searchVid.toLowerCase().trim();
      const matchSearch = !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.tags && m.tags.some(t => t.toLowerCase().includes(q))) ||
        m.category.toLowerCase().includes(q);

      const matchCat = selectedCat === 'All' || m.category === selectedCat;
      const matchType = selectedType === 'All' || m.type === selectedType;
      const matchTags = selectedTags.length === 0 ||
        selectedTags.every(tag => m.tags && m.tags.includes(tag));

      return matchSearch && matchCat && matchType && matchTags;
    });

    if (sortBy === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'category') {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [materials, searchVid, selectedCat, selectedType, selectedTags, sortBy]);

  const toggleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearAllFilters = () => {
    setSearchVid('');
    setSelectedCat('All');
    setSelectedType('All');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchVid.trim() !== '' || selectedCat !== 'All' || selectedType !== 'All' || selectedTags.length > 0;

  const showNotice = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const renderMaterialIcon = (type) => {
    switch (type) {
      case 'video': return <Play size={12} fill="currentColor" />;
      case 'pdf': return <FileText size={12} />;
      case 'article': return <BookOpen size={12} />;
      case 'link': return <Link2 size={12} />;
      default: return <BookOpen size={12} />;
    }
  };

  const canManage = user?.role === 'facilitator' || user?.role === 'management';
  const visibleTabs = canManage ? [...TABS, '🔧 Manage Hub'] : TABS;

  return (
    <div className="learning-page">
      <div className="page-header animate-fade-in-up">
        <h1>📚 Farmer Knowledge Bank</h1>
        <p className="text-secondary">
          Training material digital library, success stories, and traditional crop nutritional values.
        </p>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`notification-toast alert-${notification.type} animate-slide-left`}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="advisory-tabs animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        {visibleTabs.map(t => (
          <button key={t} className={`advisory-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div className="learning-content animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {activeTab === 'Digital Library' && (
          <div className="video-section">
            
            {/* 🌟 REDESIGNED SEARCH & FILTER PANEL */}
            <div className="library-search-hero-card">
              {/* Row 1: Search Bar + Format Toggles */}
              <div className="library-main-search-row">
                <div className="search-input-premium">
                  <Search size={18} className="search-icon" style={{ color: 'var(--color-forest-pale)', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search agronomy training, pest control, video guides, PDF manuals..."
                    value={searchVid}
                    onChange={e => setSearchVid(e.target.value)}
                  />
                  {searchVid && (
                    <button className="clear-search-btn" onClick={() => setSearchVid('')} title="Clear search">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Format Segmented Buttons */}
                <div className="format-toggle-group">
                  <button
                    className={`format-btn ${selectedType === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedType('All')}
                  >
                    <Sparkles size={13} />
                    <span>All Formats</span>
                    <span className="format-count-badge">{formatCounts.All}</span>
                  </button>
                  <button
                    className={`format-btn ${selectedType === 'video' ? 'active' : ''}`}
                    onClick={() => setSelectedType('video')}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Videos</span>
                    <span className="format-count-badge">{formatCounts.video || 0}</span>
                  </button>
                  <button
                    className={`format-btn ${selectedType === 'pdf' ? 'active' : ''}`}
                    onClick={() => setSelectedType('pdf')}
                  >
                    <FileText size={13} />
                    <span>PDFs</span>
                    <span className="format-count-badge">{formatCounts.pdf || 0}</span>
                  </button>
                  <button
                    className={`format-btn ${selectedType === 'article' ? 'active' : ''}`}
                    onClick={() => setSelectedType('article')}
                  >
                    <BookOpen size={13} />
                    <span>Articles</span>
                    <span className="format-count-badge">{formatCounts.article || 0}</span>
                  </button>
                  <button
                    className={`format-btn ${selectedType === 'link' ? 'active' : ''}`}
                    onClick={() => setSelectedType('link')}
                  >
                    <Link2 size={13} />
                    <span>Links</span>
                    <span className="format-count-badge">{formatCounts.link || 0}</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Category Filter Chips */}
              <div className="category-filter-section">
                <span className="category-filter-label">Categories:</span>
                <div className="category-pills-list">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`category-pill ${selectedCat === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCat(cat)}
                    >
                      {cat}
                      <span className="cat-count">({categoryCounts[cat] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Tag Cloud Row */}
              <div className="tags-filter-bar">
                <span className="category-filter-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Tag size={12} /> Topics:
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {AVAILABLE_TAGS.map(tag => (
                    <button
                      key={tag}
                      className={`tag-interactive-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => toggleTagFilter(tag)}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Active Filters & Results Summary Strip */}
              <div className="active-filters-strip">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Showing <strong>{filteredMaterials.length}</strong> of {materials.length} resources
                  </span>

                  {hasActiveFilters && (
                    <div className="active-filters-chips">
                      {searchVid && (
                        <span className="active-chip-badge">
                          Keyword: "{searchVid}"
                          <button className="active-chip-remove" onClick={() => setSearchVid('')}><X size={12} /></button>
                        </span>
                      )}
                      {selectedType !== 'All' && (
                        <span className="active-chip-badge">
                          Format: {selectedType.toUpperCase()}
                          <button className="active-chip-remove" onClick={() => setSelectedType('All')}><X size={12} /></button>
                        </span>
                      )}
                      {selectedCat !== 'All' && (
                        <span className="active-chip-badge">
                          Category: {selectedCat}
                          <button className="active-chip-remove" onClick={() => setSelectedCat('All')}><X size={12} /></button>
                        </span>
                      )}
                      {selectedTags.map(t => (
                        <span key={t} className="active-chip-badge">
                          #{t}
                          <button className="active-chip-remove" onClick={() => toggleTagFilter(t)}><X size={12} /></button>
                        </span>
                      ))}

                      <button className="clear-all-filters-btn" onClick={clearAllFilters}>
                        Reset All Filters ↺
                      </button>
                    </div>
                  )}
                </div>

                {/* Sort dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>SORT:</span>
                  <select
                    className="input-field select-field select-sm"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}
                  >
                    <option value="popular">Most Popular (Views)</option>
                    <option value="title">Title (A to Z)</option>
                    <option value="category">By Category</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Video & Resource Cards Grid */}
            <div className="video-grid stagger">
              {filteredMaterials.length === 0 ? (
                <div className="card text-center text-muted" style={{ gridColumn: 'span 3', padding: 'var(--space-8)' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
                  <h3>No learning materials match your filters</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Try adjusting your search query, clearing format filters, or resetting topic tags.</p>
                  <button className="btn btn-secondary btn-sm" onClick={clearAllFilters} style={{ marginTop: 12 }}>
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredMaterials.map(m => (
                  <div key={m.id} className="video-card card" style={{ cursor: 'pointer' }} onClick={() => setActiveMaterialModal(m)}>
                    <div className="video-thumb">
                      {m.thumbnail?.startsWith('http') ? (
                        <img src={m.thumbnail} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="video-emoji">{m.thumbnail || '🎥'}</span>
                      )}
                      <div className="play-overlay">
                        {m.type === 'video' ? (
                          <div className="play-btn"><Play size={20} fill="white" /></div>
                        ) : (
                          <div className="play-btn text-forest"><BookOpen size={20} /></div>
                        )}
                      </div>
                      <div className="video-duration">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {renderMaterialIcon(m.type)}
                          {m.duration}
                        </span>
                      </div>
                    </div>
                    
                    <div className="video-info">
                      <div className="meta-badge-row">
                        <span className="video-cat badge badge-green">{m.category}</span>
                        <span className={`badge ${
                          m.type === 'video' ? 'badge-sky' : m.type === 'pdf' ? 'badge-red' : m.type === 'article' ? 'badge-amber' : 'badge-green'
                        }`}>
                          {m.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="video-title">{m.title}</div>
                      <div className="video-desc">{m.description}</div>
                      
                      {/* Tags List */}
                      {m.tags && (
                        <div className="card-tags-list">
                          {m.tags.map(t => (
                            <span
                              key={t}
                              className="card-tag"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTagFilter(t);
                              }}
                              style={{ cursor: 'pointer' }}
                              title={`Filter by #${t}`}
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Clickable links if externalUrl exists */}
                      {m.externalUrl && m.externalUrl !== '#' && (
                        <a
                          href={m.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm ext-source-link"
                          onClick={e => e.stopPropagation()}
                          style={{ marginTop: 'var(--space-3)', width: '100%', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        >
                          View External Resource <ExternalLink size={12} />
                        </a>
                      )}

                      <div className="video-meta"><Eye size={12} /> {m.views ? m.views.toLocaleString() : 0} views</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Interactive Material Lightbox / Modal */}
            {activeMaterialModal && (
              <MaterialDetailModal
                material={activeMaterialModal}
                onClose={() => setActiveMaterialModal(null)}
              />
            )}

          </div>
        )}

        {activeTab === 'CHC Machinery' && (
          <CHCMachinerySection machines={machines} />
        )}

        {activeTab === 'FMC Machinery' && (
          <FMCMachinerySection machines={machines} />
        )}

        {activeTab === 'Success Stories' && (
          <div className="stories-section">
            <div className="stories-grid stagger">
              {successStoriesList.length === 0 ? (
                <div className="card text-center text-muted" style={{ gridColumn: 'span 2', padding: 'var(--space-8)' }}>
                  No success stories registered yet.
                </div>
              ) : (
                successStoriesList.map(s => (
                  <div key={s.id} className="story-card card">
                    <div className="story-header">
                      <div className="story-avatar">{s.photo || '👨‍🌾'}</div>
                      <div>
                        <div className="story-name">{s.name}</div>
                        <div className="story-village">📍 {s.village}</div>
                      </div>
                      <div className="story-year badge badge-amber">{s.year}</div>
                    </div>
                    <div className="story-crop"><span className="badge badge-green">{s.crop}</span></div>
                    <div className="story-achievement">
                      <div className="story-achievement-label">Achievement</div>
                      <div className="story-achievement-text">{s.achievement}</div>
                    </div>
                    <div className="story-income">
                      <div className="story-income-label">Income Impact</div>
                      <div className="story-income-val gradient-text">{s.income}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Stats bar */}
            <div className="stories-stats card">
              <div className="stat-item"><Users size={24} /><div><div className="stat-num">1,240+</div><div className="stat-key">Farmers Trained</div></div></div>
              <div className="stat-item"><div className="stat-num">₹18,000</div><div className="stat-key">Avg Annual Income Increase</div></div>
              <div className="stat-item"><div className="stat-num">32%</div><div className="stat-key">Input Cost Reduction</div></div>
              <div className="stat-item"><div className="stat-num">24</div><div className="stat-key">Villages Covered</div></div>
            </div>
          </div>
        )}

        {activeTab === 'Nutritional Info' && (
          <div className="nutrition-section">
            <div className="nutrition-intro card">
              <div className="section-title"><Wheat size={20} /> Traditional Grains – Nutritional Treasure</div>
              <p>Millets and traditional rice varieties of Telangana are nutritional powerhouses. They are drought-tolerant, low-input crops that support both farm sustainability and family health.</p>
            </div>
            <div className="millets-grid stagger">
              {milletsList.length === 0 ? (
                <div className="card text-center text-muted" style={{ gridColumn: 'span 2', padding: 'var(--space-8)' }}>
                  No grains registered yet.
                </div>
              ) : (
                milletsList.map((m, i) => (
                  <div key={i} className="millet-card card">
                    <div className="millet-header">
                      <div>
                        <div className="millet-name">{m.name}</div>
                        <div className="millet-telugu telugu-text">{m.telugu}</div>
                      </div>
                      <span className="badge badge-sky">{m.season}</span>
                    </div>
                    <div className="millet-nutrients">
                      {[
                        { label: 'Protein', val: m.protein, color: 'green' },
                        { label: 'Iron', val: m.iron, color: 'amber' },
                        { label: 'Fiber', val: m.fiber, color: 'sky' },
                        { label: 'Calories', val: `${m.calories} kcal`, color: 'soil' },
                      ].map((n, j) => (
                        <div key={j} className={`nutrient-badge nb-${n.color}`}>
                          <div className="nb-val">{n.val}</div>
                          <div className="nb-key">{n.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="millet-benefit">
                      <span className="text-muted" style={{ fontSize: 'var(--text-xs)' }}>Health Benefits</span>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 4 }}>{m.benefit}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === '🔧 Manage Hub' && canManage && (
          <ManageHubView
            materials={materials}
            saveMaterials={saveMaterials}
            successStoriesList={successStoriesList}
            saveSuccessStories={saveSuccessStories}
            milletsList={milletsList}
            saveMillets={saveMillets}
            showNotice={showNotice}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// 🔧 MANAGE HUB VIEW
// ============================================================
function ManageHubView({
  materials, saveMaterials,
  successStoriesList, saveSuccessStories,
  milletsList, saveMillets,
  showNotice
}) {
  const [subSection, setSubSection] = useState('Materials');

  return (
    <div className="manage-hub-view">
      <div className="subtabs-bar">
        {['Materials', 'Success Stories', 'Traditional Grains'].map(s => (
          <button
            key={s}
            className={`subtab-btn ${subSection === s ? 'active' : ''}`}
            onClick={() => setSubSection(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mgmt-content" style={{ marginTop: 'var(--space-4)' }}>
        {subSection === 'Materials' && (
          <MaterialsCRUD materials={materials} saveMaterials={saveMaterials} showNotice={showNotice} />
        )}
        {subSection === 'Success Stories' && (
          <StoriesCRUD successStoriesList={successStoriesList} saveSuccessStories={saveSuccessStories} showNotice={showNotice} />
        )}
        {subSection === 'Traditional Grains' && (
          <GrainsCRUD milletsList={milletsList} saveMillets={saveMillets} showNotice={showNotice} />
        )}
      </div>
    </div>
  );
}

// ── 1. MATERIALS CRUD ────────────────────────────────────────
function MaterialsCRUD({ materials, saveMaterials, showNotice }) {
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('video');
  const [category, setCategory] = useState('Organic');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setCategory(item.category);
    setUrl(item.externalUrl === '#' ? '' : item.externalUrl);
    setDescription(item.description);
    setTags(item.tags ? [...item.tags] : []);
  };

  const handleAddNew = () => {
    setEditingId('new');
    setTitle('');
    setType('video');
    setCategory('Organic');
    setUrl('');
    setDescription('');
    setTags([]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Title and Description are required.');
      return;
    }

    const newItem = {
      id: editingId === 'new' ? Date.now() : editingId,
      title,
      duration: type === 'video' ? 'External Video' : type === 'pdf' ? 'PDF Guide' : type === 'article' ? 'Article' : 'Web Link',
      category,
      type,
      tags: tags.length > 0 ? tags : ['Support'],
      views: editingId === 'new' ? 0 : (materials.find(m => m.id === editingId)?.views || 0),
      thumbnail: type === 'video' ? '📺' : type === 'pdf' ? '📄' : type === 'article' ? '📖' : '🔗',
      description,
      externalUrl: url || '#'
    };

    let updated;
    if (editingId === 'new') {
      updated = [newItem, ...materials];
      showNotice('success', 'Library material added successfully!');
    } else {
      updated = materials.map(m => m.id === editingId ? newItem : m);
      showNotice('success', 'Library material updated successfully!');
    }

    saveMaterials(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const updated = materials.filter(m => m.id !== id);
      saveMaterials(updated);
      showNotice('success', 'Material deleted.');
    }
  };

  const handleTagToggle = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="materials-crud">
      {editingId ? (
        <div className="card form-card">
          <div className="section-title">
            <Save size={16} className="text-sky" />
            <span>{editingId === 'new' ? 'Add Digital Library Material' : 'Edit Library Material'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Title *</label>
                <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Material Format</label>
                <select className="input-field select-field" value={type} onChange={e => setType(e.target.value)}>
                  <option value="video">Video (YouTube/External Link)</option>
                  <option value="pdf">Document / PDF Guide</option>
                  <option value="article">Technical Article</option>
                  <option value="link">Reference Website URL</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="input-field select-field" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Organic">Organic Farming</option>
                  <option value="Water Mgmt">Water Management</option>
                  <option value="Soil Health">Soil Health</option>
                  <option value="Paddy">Paddy / Cereals</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Millets">Millets</option>
                  <option value="Animal Husb.">Animal Husbandry</option>
                  <option value="Fisheries">Fisheries</option>
                </select>
              </div>

              <div className="form-group">
                <label>External URL (Video link or PDF link)</label>
                <input type="url" className="input-field" placeholder="https://example.com/file" value={url} onChange={e => setUrl(e.target.value)} />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Select Tags</label>
                <div className="form-tags-list">
                  {AVAILABLE_TAGS.map(t => (
                    <button
                      type="button"
                      key={t}
                      className={`tag-chip ${tags.includes(t) ? 'active' : ''}`}
                      onClick={() => handleTagToggle(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Description & Contents *</label>
                <textarea className="input-field" value={description} onChange={e => setDescription(e.target.value)} rows={2} required />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Material</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card list-card">
          <div className="library-action-header">
            <div className="section-title">Knowledge Materials Registry</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Material
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Tags</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span style={{ marginRight: 6 }}>{m.thumbnail}</span>
                      <strong>{m.title}</strong>
                    </td>
                    <td><span className="badge badge-green">{m.category}</span></td>
                    <td><span className="badge badge-sky">{m.type}</span></td>
                    <td>
                      <div className="card-tags-list" style={{ flexWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                        {m.tags && m.tags.map(t => <span key={t} className="card-tag" style={{ fontSize: '9px' }}>#{t}</span>)}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} onClick={() => handleEdit(m)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" onClick={() => handleDelete(m.id)}>
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

// ── 2. SUCCESS STORIES CRUD ──────────────────────────────────
function StoriesCRUD({ successStoriesList, saveSuccessStories, showNotice }) {
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [crop, setCrop] = useState('');
  const [achievement, setAchievement] = useState('');
  const [income, setIncome] = useState('');
  const [photo, setPhoto] = useState('👩‍🌾');
  const [year, setYear] = useState('2026');

  const handleEdit = (s) => {
    setEditingId(s.id);
    setName(s.name);
    setVillage(s.village);
    setCrop(s.crop);
    setAchievement(s.achievement);
    setIncome(s.income);
    setPhoto(s.photo || '👩‍🌾');
    setYear(s.year || '2026');
  };

  const handleAddNew = () => {
    setEditingId('new');
    setName('');
    setVillage('');
    setCrop('');
    setAchievement('');
    setIncome('');
    setPhoto('👩‍🌾');
    setYear('2026');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !village || !achievement) {
      alert('Farmer Name, Village and Achievement details are required.');
      return;
    }

    const newStory = {
      id: editingId === 'new' ? Date.now() : editingId,
      name,
      village,
      crop,
      achievement,
      income,
      photo,
      year
    };

    let updated;
    if (editingId === 'new') {
      updated = [...successStoriesList, newStory];
      showNotice('success', 'Success story published successfully!');
    } else {
      updated = successStoriesList.map(s => s.id === editingId ? newStory : s);
      showNotice('success', 'Success story updated successfully!');
    }

    saveSuccessStories(updated);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      const updated = successStoriesList.filter(s => s.id !== id);
      saveSuccessStories(updated);
      showNotice('success', 'Story deleted.');
    }
  };

  return (
    <div className="stories-crud">
      {editingId ? (
        <div className="card form-card">
          <div className="section-title">
            <Save size={16} className="text-sky" />
            <span>{editingId === 'new' ? 'Add Success Story' : 'Edit Success Story'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Farmer / Group Name *</label>
                <input type="text" className="input-field" placeholder="e.g. Yellamma Raju" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Village & District *</label>
                <input type="text" className="input-field" placeholder="e.g. Chandampet, Nalgonda" value={village} onChange={e => setVillage(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Crops / Techniques Adopted</label>
                <input type="text" className="input-field" placeholder="e.g. SRI Paddy / Organic Cotton" value={crop} onChange={e => setCrop(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Emoji Avatar / Photo</label>
                <input type="text" className="input-field" value={photo} onChange={e => setPhoto(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Year of Implementation</label>
                <input type="text" className="input-field" value={year} onChange={e => setYear(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Income Impact / Yield Increase</label>
                <input type="text" className="input-field" placeholder="e.g. ₹85,000 net profit (up from ₹52,000)" value={income} onChange={e => setIncome(e.target.value)} />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Core Achievement description *</label>
                <textarea className="input-field" placeholder="Reduced water use by 35%, increased yield to 32 bags/acre..." value={achievement} onChange={e => setAchievement(e.target.value)} rows={2} required />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Story</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card list-card">
          <div className="library-action-header">
            <div className="section-title">Success Stories Registry</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Story
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Village</th>
                  <th>Crop</th>
                  <th>Year</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {successStoriesList.map(s => (
                  <tr key={s.id}>
                    <td>
                      <span style={{ marginRight: 8 }}>{s.photo || '👩‍🌾'}</span>
                      <strong>{s.name}</strong>
                    </td>
                    <td>{s.village}</td>
                    <td><span className="badge badge-green">{s.crop}</span></td>
                    <td className="text-secondary">{s.year}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} onClick={() => handleEdit(s)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" onClick={() => handleDelete(s.id)}>
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

// ── 3. TRADITIONAL GRAINS CRUD ───────────────────────────────
function GrainsCRUD({ milletsList, saveMillets, showNotice }) {
  const [editingIndex, setEditingIndex] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [telugu, setTelugu] = useState('');
  const [protein, setProtein] = useState('');
  const [iron, setIron] = useState('');
  const [fiber, setFiber] = useState('');
  const [calories, setCalories] = useState(300);
  const [benefit, setBenefit] = useState('');
  const [season, setSeason] = useState('');

  const handleEdit = (m, index) => {
    setEditingIndex(index);
    setName(m.name);
    setTelugu(m.telugu || '');
    setProtein(m.protein || '');
    setIron(m.iron || '');
    setFiber(m.fiber || '');
    setCalories(m.calories || 300);
    setBenefit(m.benefit || '');
    setSeason(m.season || '');
  };

  const handleAddNew = () => {
    setEditingIndex('new');
    setName('');
    setTelugu('');
    setProtein('');
    setIron('');
    setFiber('');
    setCalories(330);
    setBenefit('');
    setSeason('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !benefit) {
      alert('Grain Name and Health Benefits are required.');
      return;
    }

    const newGrain = {
      name,
      telugu,
      protein,
      iron,
      fiber,
      calories: Number(calories),
      benefit,
      season
    };

    let updated;
    if (editingIndex === 'new') {
      updated = [...milletsList, newGrain];
      showNotice('success', 'Traditional grain profile registered.');
    } else {
      updated = milletsList.map((m, idx) => idx === editingIndex ? newGrain : m);
      showNotice('success', 'Traditional grain profile updated.');
    }

    saveMillets(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this grain record?')) {
      const updated = milletsList.filter((_, idx) => idx !== index);
      saveMillets(updated);
      showNotice('success', 'Grain profile deleted.');
    }
  };

  return (
    <div className="grains-crud">
      {editingIndex !== null ? (
        <div className="card form-card">
          <div className="section-title">
            <Save size={16} className="text-sky" />
            <span>{editingIndex === 'new' ? 'Register Traditional Grain Profile' : 'Edit Grain Profile'}</span>
          </div>

          <form onSubmit={handleSave}>
            <div className="register-form-grid">
              <div className="form-group">
                <label>Grain Name (English) *</label>
                <input type="text" className="input-field" placeholder="e.g. Foxtail Millet (Korralu)" value={name} onChange={e => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label>Name in Telugu (తెలుగు పేరు)</label>
                <input type="text" className="input-field" placeholder="e.g. కొర్రలు" value={telugu} onChange={e => setTelugu(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Protein per 100g</label>
                <input type="text" className="input-field" placeholder="e.g. 11.2g/100g" value={protein} onChange={e => setProtein(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Iron per 100g</label>
                <input type="text" className="input-field" placeholder="e.g. 2.8mg/100g" value={iron} onChange={e => setIron(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Fiber per 100g</label>
                <input type="text" className="input-field" placeholder="e.g. 8g/100g" value={fiber} onChange={e => setFiber(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Calories per 100g (kcal)</label>
                <input type="number" className="input-field" value={calories} onChange={e => setCalories(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Growing Period / Crop Season</label>
                <input type="text" className="input-field" placeholder="e.g. 60–75 days" value={season} onChange={e => setSeason(e.target.value)} />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Nutritional & Health Benefits *</label>
                <textarea className="input-field" placeholder="High in iron. Good for anaemia. Diabetic-friendly..." value={benefit} onChange={e => setBenefit(e.target.value)} rows={2} required />
              </div>
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">Save Grain Profile</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditingIndex(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card list-card">
          <div className="library-action-header">
            <div className="section-title">Traditional Grains Registry</div>
            <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
              <Plus size={14} /> Add Grain
            </button>
          </div>

          <div className="table-responsive" style={{ marginTop: 'var(--space-3)' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Grain Name</th>
                  <th>Telugu Name</th>
                  <th>Protein</th>
                  <th>Iron</th>
                  <th>Fiber</th>
                  <th>Season</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {milletsList.map((m, idx) => (
                  <tr key={idx}>
                    <td><strong>{m.name}</strong></td>
                    <td className="telugu-text">{m.telugu || '-'}</td>
                    <td>{m.protein || '-'}</td>
                    <td>{m.iron || '-'}</td>
                    <td>{m.fiber || '-'}</td>
                    <td><span className="badge badge-sky">{m.season || '-'}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn-icon text-sky" style={{ marginRight: '12px' }} onClick={() => handleEdit(m, idx)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn-icon text-alert" onClick={() => handleDelete(idx)}>
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

// ============================================================
// 🚜 CHC MACHINERY & IMPLEMENTS LEARNING SECTION
// ============================================================
function CHCMachinerySection({ machines }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOp, setSelectedOp] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeGalleryModal, setActiveGalleryModal] = useState(null);

  // Filter only CHC hiring fleet implements
  const chcFleet = useMemo(() => {
    return machines
      .filter(m => !m.isFmc && m.type !== 'fmc')
      .map(m => {
        const originName = m.chcAvailability?.chcHub || m.chcHub || 'Custom Hiring Center (CHC Hub)';
        const opName = m.operationName || m.category || 'Farm Implement';
        const gallery = m.gallery && m.gallery.length > 0 ? m.gallery : [m.thumbnail].filter(Boolean);
        const videoUrl = m.videoUrl || 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4';
        const videoTitle = m.videoTitle || `${m.name} - Field Demonstration & Operational Guide`;

        return {
          ...m,
          originType: 'Custom Hiring Center (CHC)',
          originName,
          opName,
          gallery,
          videoUrl,
          videoTitle,
          description: m.description || `${m.name} field operation guidelines, agronomic attachments, and operational training.`,
          powerHP: m.powerHP || '50 HP',
          fuelType: m.fuelType || 'Diesel (4.0 L/hr)',
          capacity: m.capacity || '3.0 acres/day',
          hourlyRate: m.chcAvailability?.rateHourly || 650,
          dailyRate: m.chcAvailability?.rateDaily || 4800,
          acreRate: m.chcAvailability?.ratePerAcre || 1200,
          deposit: m.chcAvailability?.deposit || 1500,
          availableUnits: m.chcAvailability?.available ?? 3,
          totalUnits: m.chcAvailability?.total ?? 3,
          operatorIncluded: m.chcAvailability?.operatorAvailable ?? true
        };
      });
  }, [machines]);

  const filtered = useMemo(() => {
    return chcFleet.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        (m.telugu && m.telugu.includes(q)) ||
        m.opName.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.originName.toLowerCase().includes(q);

      const matchOp = selectedOp === 'All' || m.operationId === selectedOp || m.opName.toLowerCase().includes(selectedOp.toLowerCase());
      return matchSearch && matchOp;
    });
  }, [chcFleet, searchQuery, selectedOp]);

  return (
    <div className="machinery-learning-section animate-fade-in">
      {/* Banner */}
      <div className="card border-sky" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(16, 185, 129, 0.04))', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: 'var(--shadow-sm)' }}>
              🚜
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-sky">Custom Hiring Centers (CHC) Fleet</span>
                <span className="badge badge-green">Field Rental & Live Yard Stock</span>
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: '4px 0 2px 0' }}>
                CHC Machinery & Implement Knowledge Base
              </h2>
              <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                Explore tractor attachments, seed drills, sprayers, and harvesters available for hiring at local village CHC hubs with video field guides and photos.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.85)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(2, 132, 199, 0.3)', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--color-sky)', fontWeight: 'bold' }}>CHC FLEET ATTACHMENTS</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{chcFleet.length} Implements Registered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-5)', padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 240, flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search CHC implements, Telugu keyword, hub location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-text-muted)' }}>OPERATION:</span>
            <select
              className="input-field select-field"
              value={selectedOp}
              onChange={e => setSelectedOp(e.target.value)}
              style={{ minWidth: 180, padding: '6px 10px', fontSize: 13 }}
            >
              <option value="All">All Operations</option>
              {MACHINERY_OPERATIONS.map(op => (
                <option key={op.id} value={op.id}>{op.icon} {op.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Showing <strong>{filtered.length}</strong> CHC equipment guides
        </div>
      </div>

      {/* Machinery Cards Grid */}
      <div className="video-grid stagger">
        {filtered.map(m => (
          <div key={m.id} className="video-card card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Media Header */}
            <div className="video-thumb" style={{ position: 'relative', height: 180, background: '#0f172a', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setActiveVideoModal(m)}>
              <img
                src={m.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'}
                alt={m.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              <div className="play-overlay">
                <div className="play-btn" style={{ background: 'rgba(2, 132, 199, 0.9)', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                  <Play size={22} fill="white" />
                </div>
              </div>

              {m.gallery && m.gallery.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveGalleryModal(m); }}
                  className="badge"
                  style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(15, 23, 42, 0.85)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11, backdropFilter: 'blur(4px)', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                >
                  <ImageIcon size={12} /> {m.gallery.length} Photos
                </button>
              )}

              <div className="video-duration" style={{ bottom: 10, right: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                  <Video size={12} /> Field Operation Video
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="video-info" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 'var(--space-4)' }}>
              <div className="meta-badge-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="badge badge-sky" style={{ fontSize: 11 }}>
                  {m.opName}
                </span>
                <span className="badge badge-green" style={{ fontSize: 10 }}>
                  🚜 CHC Fleet ({m.availableUnits}/{m.totalUnits} Ready)
                </span>
              </div>

              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Wrench size={12} className="text-sky" />
                <span style={{ fontWeight: 600 }}>{m.originName}</span>
              </div>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                {m.name}
              </h3>
              {m.telugu && (
                <div style={{ fontSize: 12, color: 'var(--color-forest)', fontFamily: 'var(--font-telugu)', marginBottom: 8, fontWeight: 500 }}>
                  {m.telugu}
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10 }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: 10 }}>⚡ {m.powerHP}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: 10 }}>⛽ {m.fuelType}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: 10 }}>🌱 {m.capacity}</span>
              </div>

              {/* Rental Rates Bar */}
              <div style={{ background: 'rgba(2, 132, 199, 0.06)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '8px 12px', borderRadius: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Hire Rates</div>
                  <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--color-mint)' }}>
                    ₹{m.hourlyRate}/hr <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>· ₹{m.dailyRate}/day</span>
                  </div>
                </div>
                <span className="badge badge-green" style={{ fontSize: 10 }}>
                  {m.operatorIncluded ? '✓ Operator Included' : 'Self-Operated'}
                </span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0', flex: 1 }}>
                {m.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveVideoModal(m)}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11 }}
                >
                  <Play size={12} fill="currentColor" /> Watch Video
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveGalleryModal(m)}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11 }}
                >
                  <ImageIcon size={12} /> View Photos ({m.gallery?.length || 1})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center text-muted" style={{ padding: 'var(--space-8)' }}>
          <Tractor size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3>No CHC Equipment Found</h3>
          <p style={{ fontSize: 13 }}>Try adjusting your search query or operation filter.</p>
        </div>
      )}

      {/* Video Modal */}
      {activeVideoModal && (
        <VideoPlayerModal
          machine={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
        />
      )}

      {/* Lightbox Modal */}
      {activeGalleryModal && (
        <GalleryLightboxModal
          machine={activeGalleryModal}
          onClose={() => setActiveGalleryModal(null)}
          onOpenVideo={(m) => {
            setActiveGalleryModal(null);
            setActiveVideoModal(m);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// 🏪 FMC COMMERCIAL MACHINERY & DEALERSHIP LEARNING SECTION
// ============================================================
function FMCMachinerySection({ machines }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOp, setSelectedOp] = useState('All');
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeGalleryModal, setActiveGalleryModal] = useState(null);

  // Filter only FMC commercial purchase models
  const fmcCatalog = useMemo(() => {
    return machines
      .filter(m => m.isFmc || m.type === 'fmc' || (m.purchaseInfo && m.purchaseInfo.msrp > 0))
      .map(m => {
        const originName = m.purchaseInfo?.dealer || m.dealerName || m.purchaseInfo?.dealers?.[0]?.name || 'Authorized FMC Dealership';
        const opName = m.operationName || m.category || 'Farm Machinery';
        const gallery = m.gallery && m.gallery.length > 0 ? m.gallery : [m.thumbnail].filter(Boolean);
        const videoUrl = m.videoUrl || 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4';
        const videoTitle = m.videoTitle || `${m.name} - Commercial Walkaround & Operational Guide`;

        const msrp = m.purchaseInfo?.msrp || 500000;
        const subsidyPercent = m.purchaseInfo?.subsidyPercent || 50;
        const subsidyAmount = m.purchaseInfo?.subsidyAmount || Math.round(msrp * (subsidyPercent / 100));
        const effectivePrice = m.purchaseInfo?.effectivePrice || (msrp - subsidyAmount);
        const scheme = m.purchaseInfo?.subsidyScheme || 'SMAM (Sub-Mission on Agricultural Mechanization)';

        return {
          ...m,
          originType: 'FMC Dealership',
          originName,
          opName,
          gallery,
          videoUrl,
          videoTitle,
          description: m.description || `${m.name} commercial dealership specifications, warranty coverage, and walkaround overview.`,
          powerHP: m.powerHP || '50 HP',
          fuelType: m.fuelType || 'Diesel (4.0 L/hr)',
          capacity: m.capacity || '3.0 acres/day',
          msrp,
          subsidyPercent,
          subsidyAmount,
          effectivePrice,
          scheme,
          warranty: m.specs?.['Warranty'] || '2 Years Manufacturer Warranty'
        };
      });
  }, [machines]);

  const filtered = useMemo(() => {
    return fmcCatalog.filter(m => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        m.name.toLowerCase().includes(q) ||
        (m.telugu && m.telugu.includes(q)) ||
        m.opName.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.originName.toLowerCase().includes(q) ||
        m.scheme.toLowerCase().includes(q);

      const matchOp = selectedOp === 'All' || m.operationId === selectedOp || m.opName.toLowerCase().includes(selectedOp.toLowerCase());
      return matchSearch && matchOp;
    });
  }, [fmcCatalog, searchQuery, selectedOp]);

  return (
    <div className="machinery-learning-section animate-fade-in">
      {/* Banner */}
      <div className="card border-purple" style={{ background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08), rgba(2, 132, 199, 0.04))', marginBottom: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, boxShadow: 'var(--shadow-sm)' }}>
              🏪
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-purple">Farm Machinery Commercial (FMC) Dealers</span>
                <span className="badge badge-sky">SMAM Subsidy & Showroom Showcase</span>
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', margin: '4px 0 2px 0' }}>
                FMC Commercial Machinery & Subsidized Equipment Catalog
              </h2>
              <p className="text-secondary" style={{ fontSize: '13px', margin: 0 }}>
                Explore commercial tractor models, combine harvesters, laser levelers, and power sprayers with MSRP pricing, SMAM government subsidy calculations, and video walkarounds.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.85)', padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(147, 51, 234, 0.3)', textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--color-purple)', fontWeight: 'bold' }}>COMMERCIAL MODELS</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{fmcCatalog.length} Showroom Models</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="card" style={{ marginBottom: 'var(--space-5)', padding: '14px 18px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 240, flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search commercial machinery, Telugu keyword, dealer, scheme..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-text-muted)' }}>OPERATION:</span>
            <select
              className="input-field select-field"
              value={selectedOp}
              onChange={e => setSelectedOp(e.target.value)}
              style={{ minWidth: 180, padding: '6px 10px', fontSize: 13 }}
            >
              <option value="All">All Operations</option>
              {MACHINERY_OPERATIONS.map(op => (
                <option key={op.id} value={op.id}>{op.icon} {op.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Showing <strong>{filtered.length}</strong> commercial models
        </div>
      </div>

      {/* Machinery Cards Grid */}
      <div className="video-grid stagger">
        {filtered.map(m => (
          <div key={m.id} className="video-card card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Media Header */}
            <div className="video-thumb" style={{ position: 'relative', height: 180, background: '#0f172a', overflow: 'hidden', cursor: 'pointer' }} onClick={() => setActiveVideoModal(m)}>
              <img
                src={m.thumbnail || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'}
                alt={m.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              <div className="play-overlay">
                <div className="play-btn" style={{ background: 'rgba(147, 51, 234, 0.9)', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                  <Play size={22} fill="white" />
                </div>
              </div>

              {m.gallery && m.gallery.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveGalleryModal(m); }}
                  className="badge"
                  style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(15, 23, 42, 0.85)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11, backdropFilter: 'blur(4px)', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                >
                  <ImageIcon size={12} /> {m.gallery.length} Photos
                </button>
              )}

              <div className="video-duration" style={{ bottom: 10, right: 10 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                  <Video size={12} /> Commercial Walkaround
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="video-info" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 'var(--space-4)' }}>
              <div className="meta-badge-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="badge badge-purple" style={{ fontSize: 11 }}>
                  {m.opName}
                </span>
                <span className="badge badge-sky" style={{ fontSize: 10 }}>
                  🏪 FMC Model
                </span>
              </div>

              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={12} className="text-purple" />
                <span style={{ fontWeight: 600 }}>{m.originName}</span>
              </div>

              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: '0 0 2px 0', lineHeight: 1.3 }}>
                {m.name}
              </h3>
              {m.telugu && (
                <div style={{ fontSize: 12, color: 'var(--color-forest)', fontFamily: 'var(--font-telugu)', marginBottom: 8, fontWeight: 500 }}>
                  {m.telugu}
                </div>
              )}

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 10 }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: 10 }}>⚡ {m.powerHP}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: 10 }}>⛽ {m.fuelType}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: 10 }}>🌱 {m.capacity}</span>
              </div>

              {/* SMAM Commercial Price Box */}
              <div style={{ background: 'rgba(147, 51, 234, 0.06)', border: '1px solid rgba(147, 51, 234, 0.2)', padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>MSRP: <strong>₹{m.msrp.toLocaleString()}</strong></span>
                  <span className="badge badge-green" style={{ fontSize: 10 }}>{m.subsidyPercent}% SMAM Subsidy</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-forest)' }}>Subsidy: -₹{m.subsidyAmount.toLocaleString()}</span>
                  <span style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--color-mint)' }}>
                    Farmer Net: ₹{m.effectivePrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 14px 0', flex: 1 }}>
                {m.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: 12 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveVideoModal(m)}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11 }}
                >
                  <Play size={12} fill="currentColor" /> Watch Video
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveGalleryModal(m)}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11 }}
                >
                  <ImageIcon size={12} /> View Photos ({m.gallery?.length || 1})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center text-muted" style={{ padding: 'var(--space-8)' }}>
          <Store size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3>No FMC Commercial Models Found</h3>
          <p style={{ fontSize: 13 }}>Try adjusting your search query or operation filter.</p>
        </div>
      )}

      {/* Video Modal */}
      {activeVideoModal && (
        <VideoPlayerModal
          machine={activeVideoModal}
          onClose={() => setActiveVideoModal(null)}
        />
      )}

      {/* Lightbox Modal */}
      {activeGalleryModal && (
        <GalleryLightboxModal
          machine={activeGalleryModal}
          onClose={() => setActiveGalleryModal(null)}
          onOpenVideo={(m) => {
            setActiveGalleryModal(null);
            setActiveVideoModal(m);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// 🎬 SHARED VIDEO PLAYER MODAL
// ============================================================
function VideoPlayerModal({ machine, onClose }) {
  return (
    <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 780, background: '#0f172a', color: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <span className="badge badge-sky" style={{ fontSize: 10, marginRight: 8 }}>{machine.opName}</span>
            <strong style={{ fontSize: 15 }}>{machine.name}</strong>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player Frame */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
          <iframe
            src={machine.videoUrl}
            title={machine.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
          />
        </div>

        {/* Video Description & Training Notes */}
        <div style={{ padding: '16px 18px', maxHeight: '200px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: 14, fontWeight: 'bold', margin: '0 0 6px 0', color: 'var(--color-sky-light)' }}>
            {machine.videoTitle}
          </h4>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '0 0 10px 0', lineHeight: 1.5 }}>
            {machine.description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
            <span>Provided by: <strong>{machine.originName}</strong> ({machine.originType})</span>
            <span>Power: <strong>{machine.powerHP}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🖼️ SHARED PHOTO GALLERY LIGHTBOX MODAL
// ============================================================
function GalleryLightboxModal({ machine, onClose, onOpenVideo }) {
  const photos = machine.gallery && machine.gallery.length > 0 ? machine.gallery : [machine.thumbnail].filter(Boolean);
  const [photoIndex, setPhotoIndex] = useState(0);

  const nextPhoto = () => setPhotoIndex((photoIndex + 1) % photos.length);
  const prevPhoto = () => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length);

  return (
    <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 760, background: '#0f172a', color: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <span className="badge badge-sky" style={{ fontSize: 10, marginRight: 8 }}>Photo Gallery</span>
            <strong style={{ fontSize: 15 }}>{machine.name}</strong>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Main Image Display */}
        <div style={{ position: 'relative', width: '100%', height: 380, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={photos[photoIndex]}
            alt={`${machine.name} photo ${photoIndex + 1}`}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />

          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextPhoto}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <ChevronRight size={20} />
              </button>
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 11, padding: '4px 12px', borderRadius: 20 }}>
                {photoIndex + 1} / {photos.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails Strip */}
        {photos.length > 1 && (
          <div style={{ display: 'flex', gap: 8, padding: '10px 18px', background: '#090d16', overflowX: 'auto' }}>
            {photos.map((p, idx) => (
              <img
                key={idx}
                src={p}
                alt=""
                onClick={() => setPhotoIndex(idx)}
                style={{ width: 60, height: 42, borderRadius: 4, objectFit: 'cover', cursor: 'pointer', border: photoIndex === idx ? '2px solid var(--color-sky)' : '2px solid transparent', opacity: photoIndex === idx ? 1 : 0.6 }}
              />
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            Uploaded by <strong>{machine.originName}</strong>
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onOpenVideo(machine)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Play size={14} fill="currentColor" /> Watch Field Demo Video
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📖 MATERIAL DETAIL & VIDEO PLAYER MODAL
// ============================================================
function MaterialDetailModal({ material, onClose }) {
  const isVideo = material.type === 'video';
  const videoSrc = material.videoUrl || (isVideo ? 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4' : null);

  return (
    <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: '100%', maxWidth: 780, background: '#0f172a', color: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="badge badge-green" style={{ fontSize: 10 }}>{material.category}</span>
            <span className={`badge ${
              material.type === 'video' ? 'badge-sky' : material.type === 'pdf' ? 'badge-red' : material.type === 'article' ? 'badge-amber' : 'badge-green'
            }`} style={{ fontSize: 10 }}>
              {material.type.toUpperCase()}
            </span>
            <strong style={{ fontSize: 15 }}>{material.title}</strong>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Frame if Video, or Document Preview Header */}
        {isVideo && videoSrc ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#000' }}>
            <iframe
              src={videoSrc}
              title={material.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        ) : (
          <div style={{ background: 'linear-gradient(135deg, rgba(64,145,108,0.2), rgba(2,132,199,0.1))', padding: '32px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {material.type === 'pdf' ? '📄' : material.type === 'article' ? '📖' : '🔗'}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: '0 0 6px 0', color: '#fff' }}>
              {material.title}
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Format: {material.type.toUpperCase()} · Duration / Length: {material.duration}
            </p>
          </div>
        )}

        {/* Content Details & Action */}
        <div style={{ padding: '16px 18px', maxHeight: '240px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: 14, fontWeight: 'bold', margin: '0 0 6px 0', color: 'var(--color-sky-light)' }}>
            About This Learning Material
          </h4>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: '0 0 12px 0', lineHeight: 1.6 }}>
            {material.description}
          </p>

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {material.tags.map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--color-sky-light)', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, flexWrap: 'wrap', gap: 8 }}>
            <span><Eye size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> {material.views ? material.views.toLocaleString() : 0} Views</span>

            {material.externalUrl && material.externalUrl !== '#' && (
              <a
                href={material.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}
              >
                Open External Resource <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


