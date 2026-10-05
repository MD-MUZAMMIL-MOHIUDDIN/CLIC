// ============================================================
// Master Reference Types Data for CLIC
// ============================================================

export const DEFAULT_REF_TYPES = [
  { id: 1, key: 'LAND_TYPE', value: 'LAND_TYPE', name: 'Land Type', description: 'Agricultural land classification and topography' },
  { id: 2, key: 'SOIL_TYPE', value: 'SOIL_TYPE', name: 'Soil Type', description: 'Soil texture, composition, and characteristics' },
  { id: 3, key: 'SEASON', value: 'SEASON', name: 'Season', description: 'Cropping seasons in Andhra Pradesh / Telangana' },
  { id: 4, key: 'OPERATION_TYPE', value: 'OPERATION_TYPE', name: 'Operation Type', description: 'Farm machinery operations: Tillage, Sowing, Plant Protection, Harvesting' },
  { id: 5, key: 'PURPOSE_OF_CONCOCTION', value: 'PURPOSE_OF_CONCOCTION', name: 'Purpose of Concoction', description: 'Bio-formulation objectives and target application' },
  { id: 6, key: 'CONCOCTION_NAME', value: 'CONCOCTION_NAME', name: 'Concoction Name', description: 'Traditional and natural farming botanical concoctions' },
  { id: 7, key: 'APPLICATION_TYPE', value: 'APPLICATION_TYPE', name: 'Application Type', description: 'Method of spraying, drenching, or seed treatment' },
  { id: 8, key: 'MACHINERY_OPERATION', value: 'MACHINERY_OPERATION', name: 'Machinery Operation', description: 'Mechanization stages (Land prep, Sowing, Harvesting)' },
  { id: 9, key: 'SUBSIDY_CATEGORY', value: 'SUBSIDY_CATEGORY', name: 'Subsidy Category', description: 'Government scheme beneficiary categories' },
  { id: 10, key: 'PEST_TYPE', value: 'PEST_TYPE', name: 'Pest & Disease Type', description: 'Diagnostic categories for pests and pathogens' },
  { id: 11, key: 'INPUT_CATEGORY', value: 'INPUT_CATEGORY', name: 'Input Store Category', description: 'Organic & bio-input classifications' },
  { id: 12, key: 'MEASUREMENT_UNIT', value: 'MEASUREMENT_UNIT', name: 'Measurement Unit', description: 'Units for area, yield, rates, volume, and depth' },
  { id: 13, key: 'GAUGE_TYPE', value: 'GAUGE_TYPE', name: 'Rain Gauge Type', description: 'Weather instruments (Manual, AWS, IMD)' },
  { id: 14, key: 'GW_METHOD', value: 'GW_METHOD', name: 'Groundwater Method', description: 'Water table measurement tools and sensors' }
];

// Helper to get audit stamp for creating
export const getCreateAudit = (user) => {
  const name = user?.name || (user?.role === 'facilitator' ? 'CLIC Facilitator' : user?.role === 'management' ? 'CLIC Admin' : 'Field Operator');
  const email = user?.email || (user?.role === 'facilitator' ? 'facilitator@clic.in' : 'admin@clic.in');
  const role = user?.role || 'facilitator';
  const id = user?.id || `usr-${Date.now().toString().slice(-4)}`;
  const timestamp = new Date().toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  return {
    createdById: id,
    createdByName: name,
    createdByEmail: email,
    createdByRole: role,
    createdAt: timestamp,
    createdBy: `${name} (${email})`,
    createdDate: timestamp
  };
};

// Helper to get audit stamp for updating
export const getUpdateAudit = (user) => {
  const name = user?.name || 'CLIC Lead';
  const email = user?.email || 'user@clic.in';
  const role = user?.role || 'management';
  const id = user?.id || 'usr-mod';
  const timestamp = new Date().toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  return {
    updatedById: id,
    updatedByName: name,
    updatedByEmail: email,
    updatedByRole: role,
    updatedAt: timestamp,
    lastModifiedBy: `${name} (${email})`,
    lastModifiedDate: timestamp
  };
};

export default DEFAULT_REF_TYPES;
