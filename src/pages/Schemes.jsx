import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { schemes as initialSchemes, schemeCategories as initialCategories } from '../data/schemes';
import {
  ChevronDown, ChevronUp, ExternalLink, FileText, Plus, Save,
  Edit2, Trash2, CheckCircle2, AlertCircle, X, Search, Building2
} from 'lucide-react';
import '../styles/schemes.css';

export default function Schemes() {
  const { user } = useAuth();
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [schemesList, setSchemesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form states for creating / editing a scheme
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Income Support');
  const [benefit, setBenefit] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [applicationMode, setApplicationMode] = useState('Online / CSC');
  const [deadline, setDeadline] = useState('Ongoing');
  const [helpline, setHelpline] = useState('');
  const [documents, setDocuments] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [supportDoc, setSupportDoc] = useState('');

  // Load from localStorage or seeds
  useEffect(() => {
    const saved = localStorage.getItem('clic_schemes');
    if (saved) {
      try {
        setSchemesList(JSON.parse(saved));
      } catch {
        setSchemesList(initialSchemes);
      }
    } else {
      setSchemesList(initialSchemes);
      localStorage.setItem('clic_schemes', JSON.stringify(initialSchemes));
    }
  }, []);

  const showNotice = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const saveSchemes = (updated) => {
    setSchemesList(updated);
    localStorage.setItem('clic_schemes', JSON.stringify(updated));
  };

  const resetForm = () => {
    setName('');
    setCategory('Income Support');
    setBenefit('');
    setEligibility('');
    setApplicationMode('Online / CSC');
    setDeadline('Ongoing');
    setHelpline('');
    setDocuments('');
    setDescription('');
    setLink('');
    setSupportDoc('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleEditClick = (scheme, e) => {
    if (e) e.stopPropagation();
    setEditingId(scheme.id);
    setName(scheme.name || '');
    setCategory(scheme.category || 'Income Support');
    setBenefit(scheme.benefit || '');
    setEligibility(scheme.eligibility || '');
    setApplicationMode(scheme.applicationMode || 'Online / CSC');
    setDeadline(scheme.deadline || 'Ongoing');
    setHelpline(scheme.helpline || '');
    setDocuments(Array.isArray(scheme.documents) ? scheme.documents.join(', ') : (scheme.documents || ''));
    setDescription(scheme.description || '');
    setLink(scheme.link || '');
    setSupportDoc(scheme.supportDoc || '');
    setShowAddForm(true);
  };

  const handleDeleteClick = (scheme, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete the scheme "${scheme.name}"? This action cannot be undone.`)) {
      const updated = schemesList.filter(s => s.id !== scheme.id);
      saveSchemes(updated);
      if (editingId === scheme.id) {
        resetForm();
      }
      showNotice('success', `Scheme "${scheme.name}" was deleted successfully.`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !link) {
      alert('Scheme Name, Description, and Portal URL are required.');
      return;
    }

    const docArray = documents
      ? documents.split(',').map(d => d.trim()).filter(Boolean)
      : ['Aadhaar Card'];

    const schemeData = {
      id: editingId ? editingId : Date.now(),
      category,
      name,
      benefit,
      eligibility,
      applicationMode,
      status: deadline.toLowerCase().includes('ongoing') ? 'Active' : `Active – Enroll by ${deadline}`,
      deadline,
      documents: docArray,
      helpline: helpline || '1800-180-1551',
      description,
      link,
      supportDoc: supportDoc || 'https://pmkisan.gov.in/Documents/PMKISANManual.pdf'
    };

    let updated;
    if (editingId) {
      updated = schemesList.map(s => s.id === editingId ? schemeData : s);
      showNotice('success', `Scheme "${name}" updated successfully!`);
    } else {
      updated = [schemeData, ...schemesList];
      showNotice('success', `New government scheme "${name}" registered successfully!`);
    }

    saveSchemes(updated);
    resetForm();
  };

  const filtered = schemesList.filter(s => {
    const matchCat = cat === 'All' || s.category === cat;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.benefit && s.benefit.toLowerCase().includes(q));

    return matchCat && matchSearch;
  });

  const isSuperAdmin = user && (user.role === 'superadmin' || user.roles?.includes('superadmin'));
  const canManage = isSuperAdmin || user?.role === 'facilitator' || user?.role === 'management';

  return (
    <div className="schemes-page">
      <div className="page-header animate-fade-in-up">
        <span className="badge badge-sky" style={{ marginBottom: 'var(--space-2)' }}>🏛️ SERVICES PORTAL</span>
        <h1>Government Schemes & Subsidies</h1>
        <p className="text-secondary">
          Find and apply for government assistance, subsidies, crop insurance, and resource grants.
        </p>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`notification-toast alert-${notification.type} animate-slide-left`}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Controls Bar: Search + Add Button */}
      <div className="schemes-controls-bar card animate-fade-in-up" style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search government schemes, benefits, keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {canManage && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingId(null);
              resetForm();
              setShowAddForm(true);
            }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
          >
            <Plus size={14} /> Register New Scheme
          </button>
        )}
      </div>

      {/* 🏛️ ADD / EDIT SCHEME MODAL POPUP */}
      {showAddForm && canManage && (
        <div className="modal-overlay animate-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div
            className="card add-scheme-modal animate-scale-up"
            style={{ width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', background: 'var(--color-bg-card)', border: editingId ? '1.5px solid var(--color-sky)' : '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
              <div className="section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                {editingId ? <Edit2 size={18} className="text-sky" /> : <Plus size={18} className="text-sky" />}
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
                  {editingId ? `Edit Government Scheme: ${name || 'Scheme'}` : 'Register New Government Scheme'}
                </span>
              </div>
              <button className="btn-icon" onClick={resetForm} style={{ padding: 6, borderRadius: '50%' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="register-form-grid">
                <div className="form-group">
                  <label>Scheme Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Rythu Bandhu Scheme"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select className="input-field select-field" value={category} onChange={e => setCategory(e.target.value)}>
                    {initialCategories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Financial / Subsidized Benefit</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. ₹5,000 per acre per season"
                    value={benefit}
                    onChange={e => setBenefit(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Eligibility Criteria</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Landowning farmers in Telangana"
                    value={eligibility}
                    onChange={e => setEligibility(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Application Mode</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. MeeSeva Portal / Agriculture Office"
                    value={applicationMode}
                    onChange={e => setApplicationMode(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Application Deadline</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. August 31, 2026 or Ongoing"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Official Portal URL *</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://officialscheme.gov.in"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Support Guidelines PDF Guide URL</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://officialscheme.gov.in/guidelines.pdf"
                    value={supportDoc}
                    onChange={e => setSupportDoc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Helpline Phone Number</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 1800-200-3000"
                    value={helpline}
                    onChange={e => setHelpline(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Required Documents (comma-separated list)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Aadhaar Card, Land Record (Pahani), Bank Account Details"
                    value={documents}
                    onChange={e => setDocuments(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description & Scope *</label>
                  <textarea
                    className="input-field"
                    placeholder="Provide a detailed description of the scheme, payouts, crop coverage, and benefits..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    required
                    style={{ fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="form-submit-row" style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Save size={14} /> {editingId ? 'Save & Update Scheme' : 'Save & Publish Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="schemes-cat-filter animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {initialCategories.map(c => (
          <button key={c} className={`cat-chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Schemes Accordion */}
      <div className="schemes-list animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        {filtered.length === 0 ? (
          <div className="card text-center text-muted" style={{ padding: 'var(--space-8)' }}>
            <Building2 size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3>No Schemes Found</h3>
            <p style={{ fontSize: 13 }}>Try adjusting your search keywords or category filter.</p>
          </div>
        ) : (
          filtered.map((scheme) => {
            const isUrgent = scheme.deadline && (scheme.deadline.includes('Aug') || scheme.deadline.includes('Nov') || scheme.deadline.includes('31'));
            return (
              <div key={scheme.id} className={`scheme-card card ${expanded === scheme.id ? 'expanded' : ''}`}>
                <div
                  className="scheme-header"
                  onClick={() => setExpanded(expanded === scheme.id ? null : scheme.id)}
                >
                  <div className="scheme-header-left">
                    <div className={`scheme-status-dot ${isUrgent ? 'urgent' : 'ok'}`} />
                    <div>
                      <div className="scheme-name">{scheme.name}</div>
                      <div className="scheme-category badge badge-sky" style={{ marginTop: 4 }}>{scheme.category}</div>
                    </div>
                  </div>
                  <div className="scheme-header-right">
                    <div className="scheme-benefit-preview">{scheme.benefit}</div>
                    <div className={`scheme-status badge ${scheme.deadline?.toLowerCase().includes('ongoing') ? 'badge-green' : 'badge-amber'}`}>
                      {scheme.status}
                    </div>

                    {/* Management Quick Actions */}
                    {canManage && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8 }} onClick={e => e.stopPropagation()}>
                        <button
                          className="btn-icon text-sky"
                          title="Edit Scheme"
                          onClick={(e) => handleEditClick(scheme, e)}
                          style={{ padding: '6px', borderRadius: 4 }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon text-alert"
                          title="Delete Scheme"
                          onClick={(e) => handleDeleteClick(scheme, e)}
                          style={{ padding: '6px', borderRadius: 4 }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}

                    <div style={{ cursor: 'pointer', padding: 4 }}>
                      {expanded === scheme.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {expanded === scheme.id && (
                  <div className="scheme-body animate-fade-in">
                    <p className="scheme-desc">{scheme.description}</p>
                    <div className="scheme-details-grid">
                      <div className="scheme-detail">
                        <div className="scheme-detail-label">Eligibility</div>
                        <div className="scheme-detail-val">{scheme.eligibility}</div>
                      </div>
                      <div className="scheme-detail">
                        <div className="scheme-detail-label">Application Mode</div>
                        <div className="scheme-detail-val">{scheme.applicationMode}</div>
                      </div>
                      <div className="scheme-detail">
                        <div className="scheme-detail-label">Deadline</div>
                        <div className="scheme-detail-val" style={{ color: isUrgent ? 'var(--color-alert-orange)' : 'inherit' }}>
                          {scheme.deadline}
                        </div>
                      </div>
                      <div className="scheme-detail">
                        <div className="scheme-detail-label">Helpline</div>
                        <div className="scheme-detail-val">📞 {scheme.helpline}</div>
                      </div>
                    </div>
                    <div className="scheme-docs">
                      <div className="scheme-detail-label">Required Documents</div>
                      <div className="scheme-docs-list">
                        {scheme.documents?.map((d, i) => (
                          <span key={i} className="badge badge-green">{d}</span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Portal Link, Guidelines, and Edit/Delete Actions */}
                    <div className="scheme-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {scheme.link && (
                          <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm click-portal-link">
                            <ExternalLink size={14} /> Visit Official Portal
                          </a>
                        )}
                        {scheme.supportDoc && (
                          <a href={scheme.supportDoc} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm click-support-doc">
                            <FileText size={14} /> View Guidelines PDF
                          </a>
                        )}
                      </div>

                      {canManage && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => handleEditClick(scheme, e)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                          >
                            <Edit2 size={13} className="text-sky" /> Edit Scheme
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => handleDeleteClick(scheme, e)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-alert-red)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                          >
                            <Trash2 size={13} /> Delete Scheme
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
