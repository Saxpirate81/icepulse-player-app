// Storage for published drills/workout plans

const DRILLS_STORAGE_KEY = 'icepulse_published_drills';
const DRAFTS_STORAGE_KEY = 'icepulse_draft_drills';
const ARCHIVED_STORAGE_KEY = 'icepulse_archived_drills';
const STOCK_INITIALIZED_KEY = 'icepulse_stock_initialized';

/**
 * Save a published drill/workout plan
 * @param {Object} drill - Drill/workout plan object
 * @returns {Object} Saved drill with ID
 */
export const savePublishedDrill = (drill) => {
  try {
    const drills = getPublishedDrills();
    const drillWithId = {
      ...drill,
      id: drill.id || Date.now(),
      publishedAt: drill.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published'
    };
    
    // Update existing or add new
    const existingIndex = drills.findIndex(d => d.id === drillWithId.id);
    if (existingIndex >= 0) {
      drills[existingIndex] = drillWithId;
    } else {
      drills.push(drillWithId);
    }
    
    localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify(drills));
    return drillWithId;
  } catch (error) {
    console.error('Error saving published drill:', error);
    return null;
  }
};

/**
 * Save a draft drill/workout plan
 * @param {Object} drill - Drill/workout plan object
 * @returns {Object} Saved drill with ID
 */
export const saveDraftDrill = (drill) => {
  try {
    const drafts = getDraftDrills();
    const drillWithId = {
      ...drill,
      id: drill.id || Date.now(),
      createdAt: drill.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    // Update existing or add new
    const existingIndex = drafts.findIndex(d => d.id === drillWithId.id);
    if (existingIndex >= 0) {
      drafts[existingIndex] = drillWithId;
    } else {
      drafts.push(drillWithId);
    }
    
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    return drillWithId;
  } catch (error) {
    console.error('Error saving draft drill:', error);
    return null;
  }
};

/**
 * Initialize stock drills if not already initialized
 * This should be called once on app load
 */
export const initializeStockDrills = async () => {
  try {
    const initialized = localStorage.getItem(STOCK_INITIALIZED_KEY);
    if (initialized === 'true') {
      return; // Already initialized
    }

    // Import stock drills
    const { STOCK_DRILLS } = await import('../data/stockDrills.js');
    
    const published = [];
    const drafts = [];

    STOCK_DRILLS.forEach(drill => {
      if (drill.status === 'published') {
        published.push(drill);
      } else {
        drafts.push(drill);
      }
    });

    // Get existing drills and merge (don't overwrite)
    const existingPublished = getPublishedDrillsSync();
    const existingDrafts = getDraftDrillsSync();
    
    // Only add stock drills that don't already exist
    const newPublished = published.filter(s => !existingPublished.find(e => e.id === s.id));
    const newDrafts = drafts.filter(s => !existingDrafts.find(e => e.id === s.id));

    // Save to storage
    if (newPublished.length > 0 || existingPublished.length > 0) {
      localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify([...existingPublished, ...newPublished]));
    }
    if (newDrafts.length > 0 || existingDrafts.length > 0) {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify([...existingDrafts, ...newDrafts]));
    }

    // Mark as initialized
    localStorage.setItem(STOCK_INITIALIZED_KEY, 'true');
  } catch (error) {
    console.error('Error initializing stock drills:', error);
  }
};

// Helper functions that don't trigger initialization (to avoid circular calls)
const getPublishedDrillsSync = () => {
  try {
    const data = localStorage.getItem(DRILLS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading published drills:', error);
  }
  return [];
};

const getDraftDrillsSync = () => {
  try {
    const data = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading draft drills:', error);
  }
  return [];
};

/**
 * Get all published drills
 * @returns {Array} Array of published drills
 */
export const getPublishedDrills = () => {
  try {
    const data = localStorage.getItem(DRILLS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading published drills:', error);
  }
  return [];
};

/**
 * Get all draft drills
 * @returns {Array} Array of draft drills
 */
export const getDraftDrills = () => {
  try {
    const data = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading draft drills:', error);
  }
  return [];
};

/**
 * Archive a drill (move to archived storage)
 * @param {number} id - Drill ID
 * @returns {boolean} Success
 */
export const archiveDrill = (id) => {
  try {
    // Get all drills
    const published = getPublishedDrills();
    const drafts = getDraftDrills();
    const allDrills = [...published, ...drafts];
    
    // Find the drill
    const drill = allDrills.find(d => d.id === id);
    if (!drill) return false;
    
    // Remove from published or drafts
    const filteredPublished = published.filter(d => d.id !== id);
    const filteredDrafts = drafts.filter(d => d.id !== id);
    
    localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify(filteredPublished));
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
    
    // Add to archived
    const archived = getArchivedDrills();
    archived.push({
      ...drill,
      archivedAt: new Date().toISOString()
    });
    localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify(archived));
    
    return true;
  } catch (error) {
    console.error('Error archiving drill:', error);
    return false;
  }
};

/**
 * Get all archived drills
 * @returns {Array} Array of archived drills
 */
export const getArchivedDrills = () => {
  try {
    const data = localStorage.getItem(ARCHIVED_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading archived drills:', error);
  }
  return [];
};

/**
 * Unarchive a drill (restore from archived)
 * @param {number} id - Drill ID
 * @returns {boolean} Success
 */
export const unarchiveDrill = (id) => {
  try {
    const archived = getArchivedDrills();
    const drill = archived.find(d => d.id === id);
    if (!drill) return false;
    
    // Remove from archived
    const filteredArchived = archived.filter(d => d.id !== id);
    localStorage.setItem(ARCHIVED_STORAGE_KEY, JSON.stringify(filteredArchived));
    
    // Add back to published or drafts
    if (drill.status === 'published') {
      const published = getPublishedDrills();
      published.push(drill);
      localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify(published));
    } else {
      const drafts = getDraftDrills();
      drafts.push(drill);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    }
    
    return true;
  } catch (error) {
    console.error('Error unarchiving drill:', error);
    return false;
  }
};

/**
 * Get a drill by ID (checks both published and drafts)
 * @param {number} id - Drill ID
 * @returns {Object|null} Drill object or null
 */
export const getDrillById = (id) => {
  const published = getPublishedDrills();
  const drafts = getDraftDrills();
  const allDrills = [...published, ...drafts];
  return allDrills.find(d => d.id === id) || null;
};

/**
 * Delete a drill
 * @param {number} id - Drill ID
 * @returns {boolean} Success
 */
export const deleteDrill = (id) => {
  try {
    // Remove from published
    const published = getPublishedDrills();
    const filteredPublished = published.filter(d => d.id !== id);
    localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify(filteredPublished));
    
    // Remove from drafts
    const drafts = getDraftDrills();
    const filteredDrafts = drafts.filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
    
    return true;
  } catch (error) {
    console.error('Error deleting drill:', error);
    return false;
  }
};

/**
 * Publish a draft (move from drafts to published)
 * @param {number} id - Draft ID
 * @returns {Object|null} Published drill
 */
export const publishDraft = (id) => {
  try {
    const drafts = getDraftDrills();
    const draft = drafts.find(d => d.id === id);
    if (!draft) return null;
    
    // Remove from drafts
    const filteredDrafts = drafts.filter(d => d.id !== id);
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
    
    // Add to published
    const published = getPublishedDrills();
    const publishedDrill = {
      ...draft,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    published.push(publishedDrill);
    localStorage.setItem(DRILLS_STORAGE_KEY, JSON.stringify(published));
    
    return publishedDrill;
  } catch (error) {
    console.error('Error publishing draft:', error);
    return null;
  }
};

