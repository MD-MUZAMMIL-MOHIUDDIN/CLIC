import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { videos as initialVideos, successStories, millets } from '../data/crops';
import {
  Play, Eye, Users, Wheat, FileText, Link2, BookOpen, Tag,
  Plus, Search, CheckCircle2, AlertCircle, Trash2, Edit2, Save
} from 'lucide-react';
import '../styles/learning.css';

const TABS = ['Digital Library', 'Success Stories', 'Nutritional Info'];
const MATERIAL_TYPES = ['All', 'video', 'pdf', 'article', 'link'];
const AVAILABLE_TAGS = ['Organic', 'Water Conservation', 'Millets', 'Soil Health', 'Livestock', 'Fisheries', 'Paddy', 'Cotton', 'Schemes', 'Support'];

export default function LearningHub() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('Digital Library');

  const tabParam = searchParams.get('tab');
  useEffect(() => {
    if (tabParam) {
      const allTabs = [...TABS, '🔧 Manage Hub'];
      let match = allTabs.find(t => t.toLowerCase().includes(tabParam.toLowerCase()));
      if (!match && (tabParam.toLowerCase().includes('traditional') || tabParam.toLowerCase().includes('grains'))) {
        match = 'Nutritional Info';
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

  const categories = useMemo(() => {
    return ['All', ...new Set(materials.map(m => m.category))];
  }, [materials]);

  // Filtering Logic for Digital Library
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(searchVid.toLowerCase()) ||
                          m.description.toLowerCase().includes(searchVid.toLowerCase());
      const matchCat = selectedCat === 'All' || m.category === selectedCat;
      const matchType = selectedType === 'All' || m.type === selectedType;
      const matchTags = selectedTags.length === 0 ||
                        selectedTags.every(tag => m.tags && m.tags.includes(tag));

      return matchSearch && matchCat && matchType && matchTags;
    });
  }, [materials, searchVid, selectedCat, selectedType, selectedTags]);

  const toggleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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
            
            {/* Search and Filters panel */}
            <div className="library-filters-card card" style={{ marginBottom: 'var(--space-5)' }}>
              <div className="search-bar-row">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="search"
                    className="input-field"
                    placeholder="Search material title or description..."
                    value={searchVid}
                    onChange={e => setSearchVid(e.target.value)}
                  />
                </div>

                <div className="filter-dropdowns">
                  <div className="form-group-inline">
                    <label>Category:</label>
                    <select
                      className="input-field select-field select-sm"
                      value={selectedCat}
                      onChange={e => setSelectedCat(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group-inline">
                    <label>Format:</label>
                    <select
                      className="input-field select-field select-sm"
                      value={selectedType}
                      onChange={e => setSelectedType(e.target.value)}
                    >
                      {MATERIAL_TYPES.map(type => (
                        <option key={type} value={type}>{type.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tag filters */}
              <div className="tag-filters-row" style={{ marginTop: 'var(--space-3)' }}>
                <span className="tags-label"><Tag size={12} /> Filter Tags:</span>
                <div className="tags-list">
                  {AVAILABLE_TAGS.map(tag => (
                    <button
                      key={tag}
                      className={`tag-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                      onClick={() => toggleTagFilter(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                  {selectedTags.length > 0 && (
                    <button className="clear-tags-btn" onClick={() => setSelectedTags([])}>Clear All ({selectedTags.length})</button>
                  )}
                </div>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="video-grid stagger">
              {filteredMaterials.length === 0 ? (
                <div className="card text-center text-muted" style={{ gridColumn: 'span 3', padding: 'var(--space-8)' }}>
                  No materials found matching the search filters.
                </div>
              ) : (
                filteredMaterials.map(m => (
                  <div key={m.id} className="video-card card">
                    <div className="video-thumb">
                      <span className="video-emoji">{m.thumbnail}</span>
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
                          {m.type}
                        </span>
                      </div>
                      <div className="video-title">{m.title}</div>
                      <div className="video-desc">{m.description}</div>
                      
                      {/* Tags List */}
                      {m.tags && (
                        <div className="card-tags-list">
                          {m.tags.map(t => (
                            <span key={t} className="card-tag">#{t}</span>
                          ))}
                        </div>
                      )}

                      {/* Clickable links if externalUrl exists */}
                      {m.externalUrl && m.externalUrl !== '#' && (
                        <a href={m.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm ext-source-link" style={{ marginTop: 'var(--space-3)', width: '100%', textDecoration: 'none' }}>
                          View External Source <Link2 size={12} />
                        </a>
                      )}

                      <div className="video-meta"><Eye size={12} /> {m.views ? m.views.toLocaleString() : 0} views</div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
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
