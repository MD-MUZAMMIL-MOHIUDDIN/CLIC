import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { 
  Users, UserPlus, ShieldCheck, Phone, Mail, MapPin, 
  Search, CheckCircle2, AlertTriangle, RefreshCw, KeyRound, 
  Trash2, UserCheck, UserX, Building2, Store, Wrench, Tractor, Sprout,
  Shield, Plus, X, User as UserIcon
} from 'lucide-react';
import '../styles/admin.css';

const DEFAULT_ROLES = [
  { 
    id: ROLES.SUPERADMIN, 
    label: 'SuperAdmin', 
    color: 'badge-management', 
    isDefault: true
  },
  { 
    id: ROLES.MANAGEMENT, 
    label: 'Admin', 
    color: 'badge-management', 
    isDefault: true
  },
  { 
    id: ROLES.FACILITATOR, 
    label: 'Facilitator', 
    color: 'badge-facilitator', 
    isDefault: true
  },
  { 
    id: ROLES.FARMER, 
    label: 'Farmer', 
    color: 'badge-farmer', 
    isDefault: true
  },
  { 
    id: ROLES.CHC_OPERATOR, 
    label: 'CHC Hub Operator', 
    color: 'badge-chc_operator', 
    isDefault: true
  },
  { 
    id: ROLES.FMC_DEALER, 
    label: 'FMC Dealer', 
    color: 'badge-fmc_dealer', 
    isDefault: true
  },
];

export default function AdminPortal() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Active Sub-tab ('users' or 'roles')
  const currentTab = searchParams.get('tab') === 'roles' ? 'roles' : 'users';

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };
  
  // State for users & roles
  const [usersList, setUsersList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);

  // Modals State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [managingUserRoles, setManagingUserRoles] = useState(null);
  const [currentRolesToManage, setCurrentRolesToManage] = useState([]);
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState('');

  // Role Creation State
  const [newRoleName, setNewRoleName] = useState('');

  // User Form State
  const [selectedRole, setSelectedRole] = useState(ROLES.FARMER);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [village, setVillage] = useState('Chandampet');
  const [district, setDistrict] = useState('Nalgonda');
  const [state, setState] = useState('Telangana');
  const [customPassword, setCustomPassword] = useState('clic@2025');

  // Load Roles
  const loadRoles = () => {
    const savedCustomRoles = JSON.parse(localStorage.getItem('clic_custom_roles') || '[]');
    const deletedRoleIds = JSON.parse(localStorage.getItem('clic_deleted_roles') || '[]');

    const activeDefaults = DEFAULT_ROLES.filter(r => !deletedRoleIds.includes(r.id));
    const combined = [...activeDefaults, ...savedCustomRoles];
    setRolesList(combined);
  };

  // Load all users from localStorage & defaults
  const loadAllUsers = () => {
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const registeredFarmers = JSON.parse(localStorage.getItem('clic_farmers') || '[]').map(f => ({
      ...f,
      role: ROLES.FARMER,
      roles: [ROLES.FARMER],
      password: f.password || 'clic@2025',
      status: f.status || 'Active',
      isFromFarmerRegistry: true
    }));

    // Default users
    const defaultList = [
      { id: 'def-0', name: 'Super Admin', phone: '9999900000', email: 'superadmin@clic.in', role: ROLES.SUPERADMIN, roles: [ROLES.SUPERADMIN], village: 'State HQ', district: 'Hyderabad', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-1', name: 'v2', phone: '9876543210', email: 'v2@wassan.org', role: ROLES.FARMER, roles: [ROLES.FARMER], village: 'Chandampet', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-2', name: 'super', phone: '9848099000', email: 'super@wassan.org', role: ROLES.SUPERADMIN, roles: [ROLES.SUPERADMIN], village: 'District Level', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-3', name: 'u12', phone: '9848011223', email: 'u12@wassan.org', role: ROLES.FACILITATOR, roles: [ROLES.FACILITATOR], village: 'Nalgonda Block', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-4', name: 'gowtam', phone: '9876500112', email: 'gowtam@wassan.org', role: ROLES.CHC_OPERATOR, roles: [ROLES.CHC_OPERATOR], village: 'Chandampet Hub', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-5', name: 'u22', phone: '9440188772', email: 'u22@wassan.org', role: ROLES.FMC_DEALER, roles: [ROLES.FMC_DEALER], village: 'Nalgonda Town', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-6', name: 'd2', phone: '9988776655', email: 'd2@wassan.org', role: ROLES.MANAGEMENT, roles: [ROLES.MANAGEMENT], village: 'Devarakonda', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-7', name: 'd3', phone: '9123456780', email: 'd3@wassan.org', role: ROLES.FARMER, roles: [ROLES.FARMER], village: 'Miryalaguda', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-8', name: 'm1', phone: '9848055443', email: 'm1@wassan.org', role: ROLES.CHC_OPERATOR, roles: [ROLES.CHC_OPERATOR], village: 'Munugode', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
      { id: 'def-9', name: 'manasi', phone: '9700112233', email: 'manasi@wassan.org', role: ROLES.MANAGEMENT, roles: [ROLES.MANAGEMENT], village: 'Nalgonda HQ', district: 'Nalgonda', state: 'Telangana', status: 'Active', isDefault: true },
    ];

    // Merge uniqueness by phone or email
    const combined = [...defaultList];
    
    // Add custom users
    customUsers.forEach(u => {
      if (!combined.some(c => (u.phone && c.phone === u.phone) || (u.email && c.email === u.email))) {
        combined.push(u);
      }
    });

    // Add farmer registry users
    registeredFarmers.forEach(f => {
      if (!combined.some(c => (f.phone && c.phone === f.phone))) {
        combined.push(f);
      }
    });

    setUsersList(combined);
  };

  useEffect(() => {
    loadRoles();
    loadAllUsers();
  }, []);

  // Validation: Check duplicate mobile in real time
  const cleanMobile = mobile.replace(/\D/g, '');
  const isDuplicateMobile = cleanMobile.length >= 10 && usersList.some(u => (u.phone || '').replace(/\D/g, '') === cleanMobile);
  const existingUserWithMobile = isDuplicateMobile ? usersList.find(u => (u.phone || '').replace(/\D/g, '') === cleanMobile) : null;
  const isMobileValid = cleanMobile.length === 10;
  const isFormValid = isMobileValid && !isDuplicateMobile && fullName.trim().length > 0;

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRegisterUser = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const roleConf = rolesList.find(r => r.id === selectedRole);
    const newUser = {
      id: 'USR-' + Date.now(),
      name: fullName.trim(),
      phone: cleanMobile,
      email: email.trim() || undefined,
      role: selectedRole,
      village: village.trim(),
      district: district.trim(),
      state: state.trim(),
      password: customPassword.trim() || 'clic@2025',
      status: 'Active',
      registeredAt: new Date().toISOString(),
      registeredBy: user?.name || 'Admin'
    };

    // Save to custom users list in localStorage
    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    customUsers.push(newUser);
    localStorage.setItem('clic_custom_users', JSON.stringify(customUsers));

    // If role is Farmer, also mirror into clic_farmers
    if (selectedRole === ROLES.FARMER) {
      const farmers = JSON.parse(localStorage.getItem('clic_farmers') || '[]');
      if (!farmers.some(f => f.phone === cleanMobile)) {
        farmers.push({
          id: newUser.id,
          name: newUser.name,
          phone: newUser.phone,
          village: newUser.village,
          district: newUser.district,
          state: newUser.state,
          registeredAt: newUser.registeredAt
        });
        localStorage.setItem('clic_farmers', JSON.stringify(farmers));
      }
    }

    // Refresh UI list
    loadAllUsers();
    setShowAddUserModal(false);
    showToast(`✅ Successfully registered user: ${newUser.name} (${newUser.phone})`);

    // Reset fields
    setMobile('');
    setEmail('');
    setFullName('');
  };

  // Create New Role
  const handleCreateRole = (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const formattedCode = newRoleName.trim().toLowerCase().replace(/\s+/g, '_');

    // Check duplicate code
    if (rolesList.some(r => r.id === formattedCode)) {
      showToast(`Role '${newRoleName.trim()}' already exists!`, 'error');
      return;
    }

    const createdRole = {
      id: formattedCode,
      label: newRoleName.trim(),
      color: 'badge-custom',
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    const savedCustomRoles = JSON.parse(localStorage.getItem('clic_custom_roles') || '[]');
    savedCustomRoles.push(createdRole);
    localStorage.setItem('clic_custom_roles', JSON.stringify(savedCustomRoles));

    loadRoles();
    setShowCreateRoleModal(false);
    setNewRoleName('');
    showToast(`✅ Created new role: ${createdRole.label}`);
  };

  // Delete Role
  const handleDeleteRole = (roleToDelete) => {
    if (!window.confirm(`Are you sure you want to delete the role "${roleToDelete.label}"?`)) {
      return;
    }

    if (roleToDelete.isDefault) {
      const deletedDefaults = JSON.parse(localStorage.getItem('clic_deleted_roles') || '[]');
      deletedDefaults.push(roleToDelete.id);
      localStorage.setItem('clic_deleted_roles', JSON.stringify(deletedDefaults));
    } else {
      const savedCustomRoles = JSON.parse(localStorage.getItem('clic_custom_roles') || '[]');
      const filtered = savedCustomRoles.filter(r => r.id !== roleToDelete.id);
      localStorage.setItem('clic_custom_roles', JSON.stringify(filtered));
    }

    loadRoles();
    showToast(`🗑️ Role "${roleToDelete.label}" deleted.`);
  };

  // Open Manage Roles Modal
  const openManageRolesModal = (targetUser) => {
    const assignedRoles = targetUser.roles && targetUser.roles.length > 0 
      ? targetUser.roles 
      : [targetUser.role || ROLES.FARMER];
    setManagingUserRoles(targetUser);
    setCurrentRolesToManage(assignedRoles);
    setSelectedRoleToAssign('');
  };

  // Add Role Pill
  const handleAddRolePill = () => {
    if (selectedRoleToAssign && !currentRolesToManage.includes(selectedRoleToAssign)) {
      setCurrentRolesToManage([...currentRolesToManage, selectedRoleToAssign]);
      setSelectedRoleToAssign('');
    }
  };

  // Remove Role Pill
  const handleRemoveRolePill = (roleIdToRemove) => {
    setCurrentRolesToManage(currentRolesToManage.filter(r => r !== roleIdToRemove));
  };

  // Save All Assigned Roles
  const handleSaveAllUserRoles = () => {
    if (!managingUserRoles) return;
    const finalRoles = currentRolesToManage;
    const primaryRole = finalRoles[0] || ROLES.FARMER;

    const customUsers = JSON.parse(localStorage.getItem('clic_custom_users') || '[]');
    const cIdx = customUsers.findIndex(u => (u.phone && u.phone === managingUserRoles.phone) || (u.email && u.email === managingUserRoles.email));
    
    if (cIdx >= 0) {
      customUsers[cIdx].roles = finalRoles;
      customUsers[cIdx].role = primaryRole;
      localStorage.setItem('clic_custom_users', JSON.stringify(customUsers));
    }

    setUsersList(prev => prev.map(u => 
      ((u.phone && u.phone === managingUserRoles.phone) || (u.email && u.email === managingUserRoles.email))
        ? { ...u, roles: finalRoles, role: primaryRole }
        : u
    ));

    const userName = managingUserRoles.name;
    setManagingUserRoles(null);
    showToast(`✅ Updated roles for ${userName}`);
  };

  // Filtered Users
  const filteredUsers = usersList.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q)) ||
      (u.village && u.village.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-page">
      {/* Toast notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          padding: '12px 20px',
          borderRadius: '8px',
          backgroundColor: notification.type === 'error' ? '#ef4444' : '#0f5132',
          color: 'white',
          fontWeight: '600',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {notification.msg}
        </div>
      )}

      {/* Sub-Tabs: Users vs Roles */}
      <div className="admin-subnav-container">
        <div className="admin-subnav-tabs">
          <button
            className={`admin-subnav-tab ${currentTab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <Users size={18} />
            <span>Users</span>
          </button>
          <button
            className={`admin-subnav-tab ${currentTab === 'roles' ? 'active' : ''}`}
            onClick={() => setTab('roles')}
          >
            <Shield size={18} />
            <span>Roles</span>
          </button>
        </div>

        <div style={{ fontSize: '13px', color: '#64748b' }}>
          District: <strong>Nalgonda</strong>
        </div>
      </div>

      {/* SUB-TAB 1: USERS (MATCHING IMAGE EXACTLY) */}
      {currentTab === 'users' && (
        <div>
          {/* Header Title Area & + Add User Button */}
          <div className="user-mgmt-header">
            <div className="user-mgmt-title">
              <h1>User Management</h1>
              <p>Register accounts, assign roles, and manage location accesses.</p>
            </div>
            <button 
              className="btn-add-user" 
              onClick={() => setShowAddUserModal(true)}
            >
              <Plus size={18} />
              <span>Add User</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="user-search-wrapper">
            <Search size={18} className="user-search-icon" />
            <input
              type="text"
              className="user-search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Users Card Grid */}
          <div className="user-cards-grid">
            {filteredUsers.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#64748b', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                No users found matching &quot;{searchQuery}&quot;. Click &quot;+ Add User&quot; to register one.
              </div>
            ) : (
              filteredUsers.map(u => (
                <div key={u.id || u.email || u.phone} className="user-profile-card">
                  {/* Top: Avatar & Name/Phone/Email */}
                  <div className="user-card-top">
                    <div className="user-avatar-circle">
                      <UserIcon size={24} />
                    </div>
                    <div className="user-info-text">
                      <div className="user-card-name" title={u.name}>{u.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#0f172a', marginTop: '1px' }}>
                        <Phone size={12} style={{ color: '#0f5132' }} />
                        <span>{u.phone || 'No Mobile'}</span>
                      </div>
                      {u.email && (
                        <div className="user-card-email" title={u.email} style={{ fontSize: '12px', color: '#64748b', marginTop: '1px' }}>
                          {u.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manage Roles Button */}
                  <button 
                    className="btn-manage-roles"
                    onClick={() => openManageRolesModal(u)}
                  >
                    <Shield size={16} />
                    <span>Manage Roles</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ROLES LIST */}
      {currentTab === 'roles' && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2>List of Roles ({rolesList.length})</h2>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                System roles and privileges configured across CLIC platform
              </span>
            </div>
            
            <button 
              className="btn-add-user"
              onClick={() => setShowCreateRoleModal(true)}
            >
              <Plus size={18} />
              <span>Create Role</span>
            </button>
          </div>

          {/* Roles Table */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ minWidth: '260px' }}>Role Title</th>
                  <th style={{ width: '180px', textAlign: 'center' }}>Assigned Users</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {rolesList.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                      No roles configured in the system. Click &quot;Create Role&quot; above to add one.
                    </td>
                  </tr>
                ) : (
                  rolesList.map(r => {
                    const assignedUsersCount = usersList.filter(u => u.role === r.id).length;
                    return (
                      <tr key={r.id}>
                        <td>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>
                            {r.label}
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${assignedUsersCount > 0 ? 'badge-green' : 'badge-gray'}`} style={{ fontSize: '11px' }}>
                            {assignedUsersCount} {assignedUsersCount === 1 ? 'User' : 'Users'}
                          </span>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn btn-icon btn-sm"
                            onClick={() => handleDeleteRole(r)}
                            title={`Delete role ${r.label}`}
                            style={{ color: '#ef4444' }}
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* MODAL 1: ADD USER MODAL */}
      {showAddUserModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddUserModal(false)}>
          <div className="admin-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3><UserPlus size={18} style={{ color: '#0f5132' }} /> Register New User</h3>
              <button 
                className="btn btn-icon btn-sm" 
                onClick={() => setShowAddUserModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterUser}>
              <div className="admin-modal-body">
                {/* Full Name */}
                <div className="admin-field-group">
                  <label>Full Name / Username *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. gowtam or Suresh Facilitator"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {/* Role Picker */}
                <div className="admin-field-group">
                  <label>Select Role *</label>
                  <select
                    className="input-field"
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                  >
                    {rolesList.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Number (Primary Key) */}
                <div className="admin-field-group">
                  <label>
                    <span>Mobile Number *</span>
                    <span className="opt-tag" style={{ color: '#0f5132', fontWeight: 'bold' }}>Primary Login Key</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    className={`input-field ${isDuplicateMobile ? 'input-error' : isMobileValid ? 'input-valid' : ''}`}
                    placeholder="10-digit mobile number (e.g. 9848011223)"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    required
                  />

                  {isDuplicateMobile && (
                    <div style={{ fontSize: '11px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <AlertTriangle size={13} />
                      <span>Mobile already registered with <strong>{existingUserWithMobile?.name}</strong></span>
                    </div>
                  )}
                </div>

                {/* Email Address (Optional) */}
                <div className="admin-field-group">
                  <label>
                    <span>Email Address</span>
                    <span className="opt-tag">(Optional - for members with email)</span>
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="e.g. user@wassan.org (optional)"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                {/* Village / Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="admin-field-group">
                    <label>Village / Block</label>
                    <input
                      type="text"
                      className="input-field"
                      value={village}
                      onChange={e => setVillage(e.target.value)}
                      placeholder="e.g. Chandampet"
                    />
                  </div>
                  <div className="admin-field-group">
                    <label>District</label>
                    <input
                      type="text"
                      className="input-field"
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      placeholder="e.g. Nalgonda"
                    />
                  </div>
                </div>

                {/* Password Notice */}
                <div className="admin-field-group">
                  <label>Initial Login Password</label>
                  <input
                    type="text"
                    className="input-field"
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="Default: clic@2025"
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-add-user"
                  disabled={!isFormValid}
                  style={{ opacity: !isFormValid ? 0.5 : 1 }}
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE ROLES MODAL (MATCHING SCREENSHOT EXACTLY) */}
      {managingUserRoles && (
        <div className="admin-modal-backdrop" onClick={() => setManagingUserRoles(null)}>
          <div className="modal-manage-roles-card" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="manage-roles-modal-header">
              <div>
                <h2>Manage Roles: {managingUserRoles.name}</h2>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                  {managingUserRoles.phone && <span>📱 {managingUserRoles.phone}</span>}
                  {managingUserRoles.phone && managingUserRoles.email && <span>•</span>}
                  {managingUserRoles.email && <span>✉️ {managingUserRoles.email}</span>}
                </p>
              </div>
              <button 
                className="btn-modal-close-icon" 
                onClick={() => setManagingUserRoles(null)}
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Current Roles Section */}
            <div className="current-roles-block">
              <span className="current-roles-label">CURRENT ROLES</span>
              <div className="current-roles-pills">
                {currentRolesToManage.length === 0 ? (
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No roles assigned</span>
                ) : (
                  currentRolesToManage.map(roleId => {
                    const roleObj = rolesList.find(r => r.id === roleId);
                    const displayName = roleObj?.label || (roleId === 'management' ? 'SuperAdmin' : roleId);
                    return (
                      <span key={roleId} className="role-pill-teal">
                        <span>{displayName}</span>
                        <button
                          type="button"
                          className="role-pill-remove"
                          onClick={() => handleRemoveRolePill(roleId)}
                          title={`Remove ${displayName}`}
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Assign a role Section */}
            <div className="assign-role-block">
              <label className="assign-role-label">Assign a role</label>
              <div className="assign-role-row">
                <select
                  className="assign-role-select"
                  value={selectedRoleToAssign}
                  onChange={e => setSelectedRoleToAssign(e.target.value)}
                >
                  <option value="">Select a role...</option>
                  {rolesList
                    .filter(r => !currentRolesToManage.includes(r.id))
                    .map(r => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="btn-assign-action"
                  onClick={handleAddRolePill}
                  disabled={!selectedRoleToAssign}
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="manage-roles-modal-footer">
              <button
                type="button"
                className="btn-done-action"
                onClick={handleSaveAllUserRoles}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE ROLE MODAL */}
      {showCreateRoleModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowCreateRoleModal(false)}>
          <div className="admin-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3><Shield size={18} style={{ color: '#0f5132' }} /> Create New Role</h3>
              <button 
                className="btn btn-icon btn-sm" 
                onClick={() => setShowCreateRoleModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRole}>
              <div className="admin-modal-body">
                <div className="admin-field-group">
                  <label>Role Title *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Agronomist Specialist"
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCreateRoleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-add-user"
                  disabled={!newRoleName.trim()}
                >
                  Add Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
