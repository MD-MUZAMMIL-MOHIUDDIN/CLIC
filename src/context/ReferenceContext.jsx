import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_REF_TYPES, getCreateAudit, getUpdateAudit } from '../data/referenceData';
import { DEFAULT_DROPDOWN_LIST } from '../data/dropdownData';
import { DEFAULT_CROP_CATEGORIES } from '../data/crop_categories';
import { DEFAULT_CROP_LIST } from '../data/crop_list';

const ReferenceContext = createContext(null);

export const STORAGE_KEY_REF_TYPES = 'clic_ref_master_types';
export const STORAGE_KEY_DROPDOWN_LIST = 'clic_dropdown_master_list';
export const STORAGE_KEY_CROP_CATEGORIES = 'clic_crop_categories_master';
export const STORAGE_KEY_CROP_LIST = 'clic_crop_list_master';

export function ReferenceProvider({ children }) {
  // 1. Reference Types State (from referenceData.js)
  const [refTypes, setRefTypes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REF_TYPES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(t => !['CROP_NAME', 'CROP_CATEGORY', 'CROPS'].includes(t.key || t.value));
          const existingKeys = new Set(filtered.map(t => t.key || t.value));
          const missing = DEFAULT_REF_TYPES.filter(t => !existingKeys.has(t.key || t.value));
          return [...filtered, ...missing];
        }
      }
    } catch (e) {
      console.error('Failed to load ref types from storage', e);
    }
    return DEFAULT_REF_TYPES;
  });

  // 2. Dropdown List State (from dropdownData.js: ID, REFERENCE TYPE, VALUE, TEXT)
  const [dropdownList, setDropdownList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DROPDOWN_LIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(item => !['CROP_NAME', 'CROP_CATEGORY', 'CROPS'].includes(item.referenceType));
          const existingTuples = new Set(filtered.map(i => `${i.referenceType}___${i.value}`));
          const missingDefaults = DEFAULT_DROPDOWN_LIST.filter(i => !existingTuples.has(`${i.referenceType}___${i.value}`));
          return [...filtered, ...missingDefaults];
        }
      }
    } catch (e) {
      console.error('Failed to load dropdown list from storage', e);
    }
    return DEFAULT_DROPDOWN_LIST;
  });

  // 3. Crop Categories State (from crop_categories.js)
  const [cropCategories, setCropCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CROP_CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load crop categories from storage', e);
    }
    return DEFAULT_CROP_CATEGORIES;
  });

  // 4. Crop List State (from crop_list.js)
  const [cropList, setCropList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CROP_LIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load crop list from storage', e);
    }
    return DEFAULT_CROP_LIST;
  });

  // Save helpers
  const saveTypes = (newTypes) => {
    setRefTypes(newTypes);
    try {
      localStorage.setItem(STORAGE_KEY_REF_TYPES, JSON.stringify(newTypes));
    } catch (e) {
      console.error('Failed to persist ref types', e);
    }
  };

  const saveDropdownList = (newList) => {
    setDropdownList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_DROPDOWN_LIST, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to persist dropdown list', e);
    }
  };

  const saveCropCategories = (newList) => {
    setCropCategories(newList);
    try {
      localStorage.setItem(STORAGE_KEY_CROP_CATEGORIES, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to persist crop categories', e);
    }
  };

  const saveCropList = (newList) => {
    setCropList(newList);
    try {
      localStorage.setItem(STORAGE_KEY_CROP_LIST, JSON.stringify(newList));
    } catch (e) {
      console.error('Failed to persist crop list', e);
    }
  };

  // ==========================================
  // REFERENCE TYPES CRUD
  // ==========================================
  const addRefType = (typeData, user) => {
    const key = (typeData.key || typeData.value || '').trim().toUpperCase().replace(/\s+/g, '_');
    if (!key) throw new Error('Reference Type Value/Key is required.');

    if (refTypes.some(t => (t.key || t.value) === key)) {
      throw new Error(`Reference Type "${key}" already exists.`);
    }

    const nextId = refTypes.length > 0 ? Math.max(...refTypes.map(t => Number(t.id) || 0)) + 1 : 1;
    const audit = getCreateAudit(user);

    const newType = {
      id: nextId,
      key,
      value: key,
      name: typeData.name?.trim() || key,
      description: typeData.description?.trim() || `Reference options for ${key}`,
      ...audit
    };

    const updatedTypes = [...refTypes, newType];
    saveTypes(updatedTypes);
    return newType;
  };

  const updateRefType = (typeData, user) => {
    const updateAudit = getUpdateAudit(user);
    const updatedTypes = refTypes.map(t => {
      if (t.id === typeData.id) {
        return {
          ...t,
          ...typeData,
          key: (typeData.key || typeData.value || t.key || t.value).trim().toUpperCase().replace(/\s+/g, '_'),
          value: (typeData.value || typeData.key || t.value || t.key).trim().toUpperCase().replace(/\s+/g, '_'),
          ...updateAudit
        };
      }
      return t;
    });
    saveTypes(updatedTypes);
  };

  const deleteRefType = (typeId) => {
    const target = refTypes.find(t => t.id === typeId);
    const updatedTypes = refTypes.filter(t => t.id !== typeId);
    saveTypes(updatedTypes);

    if (target) {
      const key = target.key || target.value;
      const updatedDropdowns = dropdownList.filter(d => d.referenceType !== key);
      saveDropdownList(updatedDropdowns);
    }
  };

  // ==========================================
  // DROPDOWN LIST CRUD
  // ==========================================
  const addDropdownItem = (itemData, user) => {
    const nextId = dropdownList.length > 0 ? Math.max(...dropdownList.map(i => Number(i.id) || 0)) + 1 : 1;
    const audit = getCreateAudit(user);

    const newItem = {
      id: itemData.id ? Number(itemData.id) || nextId : nextId,
      referenceType: (itemData.referenceType || 'LAND_TYPE').trim().toUpperCase(),
      value: (itemData.value || itemData.text || '').trim(),
      text: (itemData.text || itemData.value || '').trim(),
      telugu: itemData.telugu?.trim() || '',
      ...audit
    };

    const updated = [...dropdownList, newItem];
    saveDropdownList(updated);
    return newItem;
  };

  const updateDropdownItem = (itemData, user) => {
    const updateAudit = getUpdateAudit(user);
    const updated = dropdownList.map(item => {
      if (Number(item.id) === Number(itemData.id)) {
        return {
          ...item,
          ...itemData,
          referenceType: (itemData.referenceType || item.referenceType).trim().toUpperCase(),
          value: (itemData.value || item.value).trim(),
          text: (itemData.text || item.text).trim(),
          ...updateAudit
        };
      }
      return item;
    });
    saveDropdownList(updated);
  };

  const deleteDropdownItem = (itemId) => {
    const updated = dropdownList.filter(item => Number(item.id) !== Number(itemId));
    saveDropdownList(updated);
  };

  // ==========================================
  // CROP CATEGORIES CRUD (crop_categories.js)
  // ==========================================
  const addCropCategory = (catData, user) => {
    const nextId = cropCategories.length > 0 ? Math.max(...cropCategories.map(c => Number(c.id) || 0)) + 1 : 1;
    const code = (catData.code || catData.name || '').trim().toUpperCase().replace(/\s+/g, '_');

    const newCat = {
      id: nextId,
      code,
      name: catData.name?.trim() || code,
      telugu: catData.telugu?.trim() || ''
    };

    const updated = [...cropCategories, newCat];
    saveCropCategories(updated);
    return newCat;
  };

  const updateCropCategory = (catData, user) => {
    const updated = cropCategories.map(c => {
      if (c.id === catData.id) {
        return { ...c, ...catData };
      }
      return c;
    });
    saveCropCategories(updated);
  };

  const deleteCropCategory = (catId) => {
    const target = cropCategories.find(c => c.id === catId);
    const updated = cropCategories.filter(c => c.id !== catId);
    saveCropCategories(updated);

    if (target) {
      // Also cascade delete crops in this category
      const updatedCrops = cropList.filter(crop => crop.categoryId !== catId && crop.categoryCode !== target.code && crop.categoryName !== target.name);
      saveCropList(updatedCrops);
    }
  };

  // ==========================================
  // CROP LIST CRUD (crop_list.js)
  // ==========================================
  const addCrop = (cropData, user) => {
    const nextId = cropList.length > 0 ? Math.max(...cropList.map(c => Number(c.id) || 0)) + 1 : 1;
    const code = (cropData.code || cropData.name || '').trim().toUpperCase().replace(/\s+/g, '_');

    const newCrop = {
      id: nextId,
      categoryId: Number(cropData.categoryId) || 1,
      categoryCode: cropData.categoryCode || 'CEREALS',
      code,
      name: cropData.name?.trim() || code,
      telugu: cropData.telugu?.trim() || ''
    };

    const updated = [...cropList, newCrop];
    saveCropList(updated);
    return newCrop;
  };

  const updateCrop = (cropData, user) => {
    const updated = cropList.map(c => {
      if (c.id === cropData.id) {
        return { ...c, ...cropData };
      }
      return c;
    });
    saveCropList(updated);
  };

  const deleteCrop = (cropId) => {
    const updated = cropList.filter(c => c.id !== cropId);
    saveCropList(updated);
  };

  const getCropsByCategory = (categoryKeyOrName) => {
    if (!categoryKeyOrName || categoryKeyOrName === 'ALL') return cropList;
    return cropList.filter(
      c => c.categoryCode === categoryKeyOrName ||
           c.categoryName?.toLowerCase() === categoryKeyOrName.toLowerCase() ||
           String(c.categoryId) === String(categoryKeyOrName)
    );
  };

  // Helper: Return standardized Dropdown Options for form selects
  const getDropdownOptions = (refTypeKey) => {
    const matched = dropdownList.filter(i => i.referenceType === refTypeKey);
    return matched.map(item => ({
      value: item.value,
      label: item.text || item.value,
      telugu: item.telugu || '',
      display: item.telugu ? `${item.text || item.value} (${item.telugu})` : (item.text || item.value),
      raw: item
    }));
  };

  // Helper: Export data to CSV / JSON
  const exportData = (filename, data, format = 'csv') => {
    if (!data || data.length === 0) {
      alert('No data available to export.');
      return;
    }

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const headers = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object');
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers.map(field => {
            const val = row[field] ?? '';
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
          }).join(',')
        )
      ];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const value = {
    refTypes,
    dropdownList,
    cropCategories,
    cropList,
    addDropdownItem,
    updateDropdownItem,
    deleteDropdownItem,
    addRefType,
    updateRefType,
    deleteRefType,
    addCropCategory,
    updateCropCategory,
    deleteCropCategory,
    addCrop,
    updateCrop,
    deleteCrop,
    getCropsByCategory,
    getDropdownOptions,
    exportData
  };

  return (
    <ReferenceContext.Provider value={value}>
      {children}
    </ReferenceContext.Provider>
  );
}

export function useReferenceData() {
  const context = useContext(ReferenceContext);
  if (!context) {
    throw new Error('useReferenceData must be used within a ReferenceProvider');
  }
  return context;
}

export default ReferenceContext;
