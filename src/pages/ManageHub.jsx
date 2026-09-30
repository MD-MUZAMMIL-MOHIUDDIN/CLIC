import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReferenceData } from '../context/ReferenceContext';
import {
  Search, Filter, Download, Plus, Edit2, Trash2, X,
  ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, ListFilter,
  Layers, Database
} from 'lucide-react';
import '../styles/manage.css';

export default function ManageHub() {
  const { user, hasRole } = useAuth();

  if (!hasRole('facilitator', 'management', 'superadmin')) {
    return (
      <div className="access-denied card" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔒</div>
        <h2>Access Restricted</h2>
        <p className="text-secondary">
          The Master Reference Tables & Dropdown Management Console is accessible to CLIC Facilitators and System Admins.
        </p>
        <div className="badge badge-amber" style={{ display: 'inline-block', marginTop: '12px' }}>
          Current role: {user?.role || 'User'}
        </div>
      </div>
    );
  }

  return <MasterReferenceConsole />;
}

function MasterReferenceConsole() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const {
    refTypes,
    dropdownList,
    addDropdownItem,
    updateDropdownItem,
    deleteDropdownItem,
    addRefType,
    updateRefType,
    deleteRefType,
    exportData
  } = useReferenceData();

  // Active view: 'dropdowns' (Dropdown List) or 'refTypes' (Reference Types)
  const activeTab = tabParam === 'reftypes' ? 'refTypes' : 'dropdowns';

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName === 'refTypes' ? 'reftypes' : 'dropdowns' });
  };

  // ==========================================
  // DROPDOWN LIST STATE
  // ==========================================
  const [ddSearch, setDdSearch] = useState('');
  const [ddRefFilter, setDdRefFilter] = useState('ALL');
  const [ddFieldFilter, setDdFieldFilter] = useState('value');
  const [ddSortField, setDdSortField] = useState('id');
  const [ddSortAsc, setDdSortAsc] = useState(true);

  // Modals for Dropdown items
  const [showAddDdModal, setShowAddDdModal] = useState(false);
  const [editingDdItem, setEditingDdItem] = useState(null);
  const [ddFormData, setDdFormData] = useState({
    id: '',
    referenceType: 'LAND_TYPE',
    value: '',
    text: '',
    telugu: ''
  });

  // ==========================================
  // REFERENCE TYPES STATE
  // ==========================================
  const [refSearch, setRefSearch] = useState('');
  const [refFieldFilter, setRefFieldFilter] = useState('value');
  const [refSortField, setRefSortField] = useState('id');
  const [refSortAsc, setRefSortAsc] = useState(true);

  // Modals for Reference Types
  const [showAddRefModal, setShowAddRefModal] = useState(false);
  const [editingRefType, setEditingRefType] = useState(null);
  const [refTypeFormData, setRefTypeFormData] = useState({
    key: '',
    name: '',
    description: ''
  });

  // Toast message
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==========================================
  // FILTERED & SORTED: DROPDOWN LIST
  // ==========================================
  const filteredDropdownList = useMemo(() => {
    let list = [...dropdownList];

    // Filter by Reference Type
    if (ddRefFilter !== 'ALL') {
      list = list.filter(item => item.referenceType === ddRefFilter);
    }

    // Filter by Search Query
    if (ddSearch.trim()) {
      const q = ddSearch.toLowerCase();
      list = list.filter(item => {
        if (ddFieldFilter === 'value') {
          return (item.value || '').toLowerCase().includes(q);
        } else if (ddFieldFilter === 'text') {
          return (item.text || '').toLowerCase().includes(q);
        } else if (ddFieldFilter === 'id') {
          return String(item.id).includes(q);
        } else {
          return (
            String(item.id).includes(q) ||
            (item.referenceType || '').toLowerCase().includes(q) ||
            (item.value || '').toLowerCase().includes(q) ||
            (item.text || '').toLowerCase().includes(q) ||
            (item.telugu || '').includes(q)
          );
        }
      });
    }

    // Sorting
    list.sort((a, b) => {
      let valA = a[ddSortField];
      let valB = b[ddSortField];

      if (ddSortField === 'id') {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return ddSortAsc ? numA - numB : numB - numA;
      }

      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
      if (valA < valB) return ddSortAsc ? -1 : 1;
      if (valA > valB) return ddSortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [dropdownList, ddRefFilter, ddSearch, ddFieldFilter, ddSortField, ddSortAsc]);

  // ==========================================
  // FILTERED & SORTED: REFERENCE TYPES
  // ==========================================
  const filteredRefTypes = useMemo(() => {
    let list = [...refTypes];

    if (refSearch.trim()) {
      const q = refSearch.toLowerCase();
      list = list.filter(item => {
        if (refFieldFilter === 'value') {
          return (item.value || item.key || '').toLowerCase().includes(q);
        } else if (refFieldFilter === 'id') {
          return String(item.id).includes(q);
        } else {
          return (
            String(item.id).includes(q) ||
            (item.value || item.key || '').toLowerCase().includes(q) ||
            (item.name || '').toLowerCase().includes(q) ||
            (item.description || '').toLowerCase().includes(q)
          );
        }
      });
    }

    list.sort((a, b) => {
      let valA = a[refSortField];
      let valB = b[refSortField];

      if (refSortField === 'id') {
        const numA = Number(valA) || 0;
        const numB = Number(valB) || 0;
        return refSortAsc ? numA - numB : numB - numA;
      }

      valA = (valA || '').toString().toLowerCase();
      valB = (valB || '').toString().toLowerCase();
      if (valA < valB) return refSortAsc ? -1 : 1;
      if (valA > valB) return refSortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [refTypes, refSearch, refFieldFilter, refSortField, refSortAsc]);

  // ==========================================
  // HANDLERS: DROPDOWN ITEMS CRUD
  // ==========================================
  const handleCreateDropdownItem = (e) => {
    e.preventDefault();
    if (!ddFormData.value.trim() || !ddFormData.text.trim()) {
      alert('Please fill in both Value and Text.');
      return;
    }

    try {
      const created = addDropdownItem(ddFormData, user);
      showToast(`✓ Dropdown Option "${created.text}" (ID: ${created.id}) added to ${created.referenceType}!`);
      setShowAddDdModal(false);
      setDdFormData({ id: '', referenceType: ddFormData.referenceType, value: '', text: '', telugu: '' });
    } catch (err) {
      alert(err.message || 'Failed to add dropdown item.');
    }
  };

  const handleUpdateDropdownItem = (e) => {
    e.preventDefault();
    if (!editingDdItem || !editingDdItem.value.trim()) return;

    try {
      updateDropdownItem(editingDdItem, user);
      showToast(`✓ Dropdown Option "${editingDdItem.text || editingDdItem.value}" updated!`);
      setEditingDdItem(null);
    } catch (err) {
      alert(err.message || 'Failed to update dropdown item.');
    }
  };

  const handleDeleteDropdownItem = (item) => {
    const displayName = item.text || item.value || item.id;
    if (window.confirm(`Are you sure you want to delete "${displayName}" (ID: ${item.id}) from ${item.referenceType}?`)) {
      deleteDropdownItem(item.id);
      showToast(`Deleted "${displayName}".`);
    }
  };

  // ==========================================
  // HANDLERS: REFERENCE TYPES CRUD
  // ==========================================
  const handleCreateRefType = (e) => {
    e.preventDefault();
    try {
      const created = addRefType(refTypeFormData, user);
      showToast(`✓ Reference Type "${created.key}" created!`);
      setShowAddRefModal(false);
      setRefTypeFormData({ key: '', name: '', description: '' });
    } catch (err) {
      alert(err.message || 'Failed to add reference type.');
    }
  };

  const handleUpdateRefType = (e) => {
    e.preventDefault();
    if (!editingRefType) return;
    try {
      updateRefType(editingRefType, user);
      showToast(`✓ Reference Type "${editingRefType.value || editingRefType.key}" updated!`);
      setEditingRefType(null);
    } catch (err) {
      alert(err.message || 'Failed to update reference type.');
    }
  };

  const handleDeleteRefType = (item) => {
    const typeName = item.value || item.key;
    if (window.confirm(`Are you sure you want to delete Reference Type "${typeName}"?`)) {
      deleteRefType(item.id);
      showToast(`Deleted Reference Type "${typeName}".`);
    }
  };

  return (
    <div className="ref-management-container">
      {/* Top Switcher Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="ref-main-switcher">
          <button
            className={`ref-switcher-btn ${activeTab === 'dropdowns' ? 'active' : ''}`}
            onClick={() => handleTabChange('dropdowns')}
          >
            <ListFilter size={16} /> Dropdown List
          </button>
          <button
            className={`ref-switcher-btn ${activeTab === 'refTypes' ? 'active' : ''}`}
            onClick={() => handleTabChange('refTypes')}
          >
            <Layers size={16} /> Reference Types
          </button>
        </div>

        <div className="badge badge-forest" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span>Master Dropdowns & Ref Tables</span>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="submit-success" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 1: DROPDOWN LIST (Matches Screenshot 2)                 */}
      {/* ============================================================ */}
      {activeTab === 'dropdowns' && (
        <div className="ref-dropdown-list-view">
          {/* Header Row */}
          <div className="ref-header-row" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="ref-title-group">
              <h1 className="ref-main-title">Dropdown List</h1>
            </div>
            <button
              className="btn-ref-add"
              onClick={() => {
                setDdFormData({
                  id: '',
                  referenceType: ddRefFilter !== 'ALL' ? ddRefFilter : 'LAND_TYPE',
                  value: '',
                  text: '',
                  telugu: ''
                });
                setShowAddDdModal(true);
              }}
            >
              <Plus size={16} /> + Add
            </button>
          </div>

          {/* Controls Bar */}
          <div className="ref-controls-bar" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="ref-controls-left">
              {/* Search Box */}
              <div className="ref-search-input-wrapper">
                <Search size={16} className="ref-search-icon" />
                <input
                  type="text"
                  className="ref-search-input"
                  placeholder="Search..."
                  value={ddSearch}
                  onChange={(e) => setDdSearch(e.target.value)}
                />
              </div>

              {/* Filters Dropdown 1: Ref Type */}
              <div className="ref-filter-wrapper">
                <Filter size={15} color="var(--color-text-muted)" />
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Filters:</span>
                <select
                  className="ref-filter-select"
                  value={ddRefFilter}
                  onChange={(e) => setDdRefFilter(e.target.value)}
                >
                  <option value="ALL">Ref (All)</option>
                  {refTypes.map(t => {
                    const key = t.key || t.value;
                    return (
                      <option key={t.id} value={key}>
                        {key}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Filters Dropdown 2: Field */}
              <div className="ref-filter-wrapper">
                <select
                  className="ref-filter-select"
                  value={ddFieldFilter}
                  onChange={(e) => setDdFieldFilter(e.target.value)}
                >
                  <option value="value">Value</option>
                  <option value="text">Text</option>
                  <option value="id">ID</option>
                  <option value="all">All Fields</option>
                </select>
              </div>
            </div>

            {/* Export Button */}
            <button
              className="btn-ref-export"
              onClick={() => exportData('dropdown_values', filteredDropdownList, 'csv')}
              title="Export Dropdown Values to CSV"
            >
              Export <Download size={15} />
            </button>
          </div>

          {/* Data Table */}
          <div className="ref-table-card">
            <table className="ref-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>
                    <div
                      className="ref-th-sortable"
                      onClick={() => {
                        if (ddSortField === 'id') setDdSortAsc(!ddSortAsc);
                        else { setDdSortField('id'); setDdSortAsc(true); }
                      }}
                    >
                      ID
                      {ddSortField === 'id' ? (
                        ddSortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </th>
                  <th>
                    <div
                      className="ref-th-sortable"
                      onClick={() => {
                        if (ddSortField === 'referenceType') setDdSortAsc(!ddSortAsc);
                        else { setDdSortField('referenceType'); setDdSortAsc(true); }
                      }}
                    >
                      REFERENCE TYPE
                      {ddSortField === 'referenceType' ? (
                        ddSortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </th>
                  <th>
                    <div
                      className="ref-th-sortable"
                      onClick={() => {
                        if (ddSortField === 'value') setDdSortAsc(!ddSortAsc);
                        else { setDdSortField('value'); setDdSortAsc(true); }
                      }}
                    >
                      VALUE
                      {ddSortField === 'value' ? (
                        ddSortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </th>
                  <th>
                    <div
                      className="ref-th-sortable"
                      onClick={() => {
                        if (ddSortField === 'text') setDdSortAsc(!ddSortAsc);
                        else { setDdSortField('text'); setDdSortAsc(true); }
                      }}
                    >
                      TEXT
                      {ddSortField === 'text' ? (
                        ddSortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </th>
                  <th style={{ textAlign: 'right', width: '180px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredDropdownList.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="ref-empty-state">
                        <div className="ref-empty-icon">🔍</div>
                        <p>No dropdown options found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDropdownList.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {item.id}
                      </td>
                      <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        {item.referenceType}
                      </td>
                      <td>
                        {item.value}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{item.text}</span>
                          {item.telugu && (
                            <span style={{ fontSize: '12px', color: 'var(--color-forest-pale)', fontFamily: 'var(--font-telugu, inherit)' }}>
                              ({item.telugu})
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="ref-actions-cell">
                          <button
                            className="dropdown-action-link-edit"
                            onClick={() => setEditingDdItem({ ...item })}
                          >
                            <Edit2 size={15} /> Edit
                          </button>
                          <button
                            className="dropdown-action-link-delete"
                            onClick={() => handleDeleteDropdownItem(item)}
                          >
                            <Trash2 size={15} /> Delete
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

      {/* ============================================================ */}
      {/* VIEW 2: REFERENCE TYPES (Matches Screenshot 1)               */}
      {/* ============================================================ */}
      {activeTab === 'refTypes' && (
        <div className="ref-types-view">
          {/* Header Row */}
          <div className="ref-header-row" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="ref-title-group">
              <h1 className="ref-main-title">Reference Types</h1>
            </div>
            <button
              className="btn-ref-add"
              onClick={() => {
                setRefTypeFormData({ key: '', name: '', description: '' });
                setShowAddRefModal(true);
              }}
            >
              <Plus size={16} /> + Add
            </button>
          </div>

          {/* Controls Bar */}
          <div className="ref-controls-bar" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="ref-controls-left">
              <div className="ref-search-input-wrapper">
                <Search size={16} className="ref-search-icon" />
                <input
                  type="text"
                  className="ref-search-input"
                  placeholder="Search..."
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.target.value)}
                />
              </div>

              <div className="ref-filter-wrapper">
                <Filter size={15} color="var(--color-text-muted)" />
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Filters:</span>
                <select
                  className="ref-filter-select"
                  value={refFieldFilter}
                  onChange={(e) => setRefFieldFilter(e.target.value)}
                >
                  <option value="value">Value</option>
                  <option value="id">ID</option>
                  <option value="all">All Fields</option>
                </select>
              </div>
            </div>

            <button
              className="btn-ref-export"
              onClick={() => exportData('reference_types', filteredRefTypes, 'csv')}
              title="Export Reference Types to CSV"
            >
              Export <Download size={15} />
            </button>
          </div>

          {/* Data Table */}
          <div className="ref-table-card">
            <table className="ref-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>
                    <div
                      className="ref-th-sortable"
                      onClick={() => {
                        if (refSortField === 'id') setRefSortAsc(!refSortAsc);
                        else { setRefSortField('id'); setRefSortAsc(true); }
                      }}
                    >
                      ID
                      {refSortField === 'id' ? (
                        refSortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </th>
                  <th>
                    <div
                      className="ref-th-sortable"
                      onClick={() => {
                        if (refSortField === 'value') setRefSortAsc(!refSortAsc);
                        else { setRefSortField('value'); setRefSortAsc(true); }
                      }}
                    >
                      VALUE
                      {refSortField === 'value' ? (
                        refSortAsc ? <ArrowUp size={13} /> : <ArrowDown size={13} />
                      ) : (
                        <ArrowUpDown size={13} color="var(--color-text-muted)" />
                      )}
                    </div>
                  </th>
                  <th style={{ textAlign: 'right', width: '160px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefTypes.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="ref-empty-state">
                        <div className="ref-empty-icon">📋</div>
                        <p>No reference types found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRefTypes.map((item) => {
                    const count = dropdownList.filter(d => d.referenceType === (item.value || item.key)).length;
                    return (
                      <tr key={item.id}>
                        <td style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                          {item.id}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 500, letterSpacing: '0.2px' }}>{item.value || item.key}</span>
                            <span
                              className="badge"
                              style={{ fontSize: '11px', background: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', padding: '2px 8px', borderRadius: '12px', cursor: 'pointer' }}
                              onClick={() => {
                                setDdRefFilter(item.value || item.key);
                                handleTabChange('dropdowns');
                              }}
                              title="Click to view dropdown values for this type"
                            >
                              {count} values
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="ref-actions-cell">
                            <button
                              className="btn-icon-edit"
                              onClick={() => setEditingRefType({ ...item })}
                              title="Edit Reference Type"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-icon-delete"
                              onClick={() => handleDeleteRefType(item)}
                              title="Delete Reference Type"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD DROPDOWN OPTION                                   */}
      {/* ============================================================ */}
      {showAddDdModal && (
        <div className="ref-modal-overlay" onClick={() => setShowAddDdModal(false)}>
          <div className="ref-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <h3><Plus size={18} /> Add Dropdown Value</h3>
              <button className="ref-modal-close-btn" onClick={() => setShowAddDdModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateDropdownItem}>
              <div className="ref-modal-body">
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Reference Type *
                  </label>
                  <select
                    className="input-field"
                    value={ddFormData.referenceType}
                    onChange={(e) => setDdFormData({ ...ddFormData, referenceType: e.target.value })}
                    required
                  >
                    {refTypes.map(t => {
                      const k = t.key || t.value;
                      return <option key={t.id} value={k}>{k} ({t.name})</option>;
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Value (Storage Key / Identifier) *
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. Mid-land or Sandy"
                    value={ddFormData.value}
                    onChange={(e) => {
                      const v = e.target.value;
                      setDdFormData({
                        ...ddFormData,
                        value: v,
                        text: ddFormData.text === '' || ddFormData.text === ddFormData.value ? v : ddFormData.text
                      });
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Text (Display Label in Dropdown) *
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. Mid Land or Sandy Soil"
                    value={ddFormData.text}
                    onChange={(e) => setDdFormData({ ...ddFormData, text: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Telugu / Local Translation (తెలుగు)
                  </label>
                  <input
                    className="input-field"
                    placeholder="ఉదా. మధ్యస్థ నేలలు"
                    value={ddFormData.telugu}
                    onChange={(e) => setDdFormData({ ...ddFormData, telugu: e.target.value })}
                    style={{ fontFamily: 'var(--font-telugu, inherit)' }}
                  />
                </div>
              </div>
              <div className="ref-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddDdModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Dropdown Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT DROPDOWN OPTION                                  */}
      {/* ============================================================ */}
      {editingDdItem && (
        <div className="ref-modal-overlay" onClick={() => setEditingDdItem(null)}>
          <div className="ref-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <h3><Edit2 size={18} /> Edit Dropdown Value</h3>
              <button className="ref-modal-close-btn" onClick={() => setEditingDdItem(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateDropdownItem}>
              <div className="ref-modal-body">
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Reference Type *
                  </label>
                  <select
                    className="input-field"
                    value={editingDdItem.referenceType}
                    onChange={(e) => setEditingDdItem({ ...editingDdItem, referenceType: e.target.value })}
                    required
                  >
                    {refTypes.map(t => {
                      const k = t.key || t.value;
                      return <option key={t.id} value={k}>{k} ({t.name})</option>;
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Value *
                  </label>
                  <input
                    className="input-field"
                    value={editingDdItem.value}
                    onChange={(e) => setEditingDdItem({ ...editingDdItem, value: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Text *
                  </label>
                  <input
                    className="input-field"
                    value={editingDdItem.text}
                    onChange={(e) => setEditingDdItem({ ...editingDdItem, text: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Telugu / Local Translation (తెలుగు)
                  </label>
                  <input
                    className="input-field"
                    value={editingDdItem.telugu || ''}
                    onChange={(e) => setEditingDdItem({ ...editingDdItem, telugu: e.target.value })}
                    style={{ fontFamily: 'var(--font-telugu, inherit)' }}
                  />
                </div>
              </div>
              <div className="ref-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingDdItem(null)}>
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

      {/* ============================================================ */}
      {/* MODAL: ADD REFERENCE TYPE                                    */}
      {/* ============================================================ */}
      {showAddRefModal && (
        <div className="ref-modal-overlay" onClick={() => setShowAddRefModal(false)}>
          <div className="ref-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <h3><Plus size={18} /> Add Reference Type</h3>
              <button className="ref-modal-close-btn" onClick={() => setShowAddRefModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateRefType}>
              <div className="ref-modal-body">
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Reference Type Key / Value *
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. IRRIGATION_TYPE"
                    value={refTypeFormData.key}
                    onChange={(e) => setRefTypeFormData({ ...refTypeFormData, key: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Display Name
                  </label>
                  <input
                    className="input-field"
                    placeholder="e.g. Irrigation Type"
                    value={refTypeFormData.name}
                    onChange={(e) => setRefTypeFormData({ ...refTypeFormData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Brief description..."
                    value={refTypeFormData.description}
                    onChange={(e) => setRefTypeFormData({ ...refTypeFormData, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="ref-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddRefModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Reference Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT REFERENCE TYPE                                   */}
      {/* ============================================================ */}
      {editingRefType && (
        <div className="ref-modal-overlay" onClick={() => setEditingRefType(null)}>
          <div className="ref-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="ref-modal-header">
              <h3><Edit2 size={18} /> Edit Reference Type</h3>
              <button className="ref-modal-close-btn" onClick={() => setEditingRefType(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateRefType}>
              <div className="ref-modal-body">
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Reference Type Key / Value *
                  </label>
                  <input
                    className="input-field"
                    value={editingRefType.value || editingRefType.key}
                    onChange={(e) => setEditingRefType({ ...editingRefType, value: e.target.value.toUpperCase(), key: e.target.value.toUpperCase() })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Display Name
                  </label>
                  <input
                    className="input-field"
                    value={editingRefType.name || ''}
                    onChange={(e) => setEditingRefType({ ...editingRefType, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows={2}
                    value={editingRefType.description || ''}
                    onChange={(e) => setEditingRefType({ ...editingRefType, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="ref-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setEditingRefType(null)}>
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
  );
}
