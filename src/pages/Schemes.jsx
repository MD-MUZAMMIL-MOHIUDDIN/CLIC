import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { schemes as initialSchemes, schemeCategories as initialCategories } from '../data/schemes';
import { ChevronDown, ChevronUp, ExternalLink, FileText, Plus, Save } from 'lucide-react';
import '../styles/schemes.css';

export default function Schemes() {
  const { user } = useAuth();
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [schemesList, setSchemesList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for creating a scheme
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

  const saveSchemes = (updated) => {
    setSchemesList(updated);
    localStorage.setItem('clic_schemes', JSON.stringify(updated));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !link) {
      alert('Scheme Name, Description and Portal URL are required.');
      return;
    }

    const docArray = documents ? documents.split(',').map(d => d.trim()).filter(Boolean) : ['Aadhaar Card'];

    const newScheme = {
      id: Date.now(),
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

    const updated = [newScheme, ...schemesList];
    saveSchemes(updated);

    // Reset Form
    setName('');
    setBenefit('');
    setEligibility('');
    setApplicationMode('Online / CSC');
    setDeadline('Ongoing');
    setHelpline('');
    setDocuments('');
    setDescription('');
    setLink('');
    setSupportDoc('');
    setShowAddForm(false);

    alert('Government Scheme added successfully!');
  };

  const filtered = schemesList.filter(s => cat === 'All' || s.category === cat);
  const canManage = user?.role === 'facilitator' || user?.role === 'management';

  return (
    <div className="schemes-page">
      <div className="page-header animate-fade-in-up">
        <span className="badge badge-sky" style={{ marginBottom: 'var(--space-2)' }}>🏛️ SERVICES PORTAL</span>
        <h1>Government Schemes & Subsidies</h1>
        <p className="text-secondary">
          Find and apply for government assistance, subsidies, crop insurance, and resource grants.
        </p>
      </div>

      {/* Facilitator Add Action */}
      {canManage && (
        <div className="schemes-action-bar animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={14} /> Add Government Scheme
          </button>
        </div>
      )}

      {/* Add Scheme Form */}
      {showAddForm && canManage && (
        <div className="card add-scheme-form-card animate-fade-in" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="section-title">
            <Save size={16} className="text-sky" />
            <span>Register New Government Scheme</span>
          </div>
          <form onSubmit={handleAddSubmit}>
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

            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary">
                Save & Publish Scheme
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </form>
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
            No schemes found matching this category.
          </div>
        ) : (
          filtered.map((scheme) => {
            const isUrgent = scheme.deadline.includes('Aug') || scheme.deadline.includes('Nov') || scheme.deadline.includes('31');
            return (
              <div key={scheme.id} className={`scheme-card card ${expanded === scheme.id ? 'expanded' : ''}`}>
                <button
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
                    <div className={`scheme-status badge ${scheme.deadline.toLowerCase().includes('ongoing') ? 'badge-green' : 'badge-amber'}`}>
                      {scheme.status}
                    </div>
                    {expanded === scheme.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

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
                        {scheme.documents.map((d, i) => (
                          <span key={i} className="badge badge-green">{d}</span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Portal Link and Support PDF Guidelines */}
                    <div className="scheme-actions">
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
