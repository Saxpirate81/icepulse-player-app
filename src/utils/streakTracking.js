// Streak tracking with game/practice day exclusions

const STREAK_STORAGE_KEY = 'icepulse_streak_data';
const EXCLUDED_DATES_KEY = 'icepulse_excluded_dates';

// Get all excluded dates (games, practices, etc.)
export const getExcludedDates = () => {
  try {
    const data = localStorage.getItem(EXCLUDED_DATES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading excluded dates:', error);
  }
  return [];
};

// Add a date to excluded dates (game, practice, etc.)
export const addExcludedDate = (date, reason = 'game') => {
  const excluded = getExcludedDates();
  const dateStr = formatDateKey(date);
  
  // Check if already excluded
  if (!excluded.find(e => e.date === dateStr)) {
    excluded.push({
      date: dateStr,
      reason, // 'game', 'practice', 'other'
      addedAt: new Date().toISOString(),
    });
    localStorage.setItem(EXCLUDED_DATES_KEY, JSON.stringify(excluded));
  }
  return excluded;
};

// Remove a date from excluded dates
export const removeExcludedDate = (dateStr) => {
  const excluded = getExcludedDates();
  const filtered = excluded.filter(e => e.date !== dateStr);
  localStorage.setItem(EXCLUDED_DATES_KEY, JSON.stringify(filtered));
  return filtered;
};

// Format date as YYYY-MM-DD key
const formatDateKey = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
};

// Check if a date is excluded
export const isDateExcluded = (date) => {
  const excluded = getExcludedDates();
  const dateStr = formatDateKey(date);
  return excluded.some(e => e.date === dateStr);
};

// Get streak data
export const getStreakData = () => {
  try {
    const data = localStorage.getItem(STREAK_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading streak data:', error);
  }
  return {
    lastActivityDate: null,
    currentStreak: 0,
    longestStreak: 0,
    totalDaysActive: 0,
  };
};

// Save streak data
const saveStreakData = (streakData) => {
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streakData));
};

// Record activity for today
export const recordActivity = () => {
  const today = new Date();
  const todayStr = formatDateKey(today);
  const streakData = getStreakData();
  const excluded = getExcludedDates();
  
  // Don't record if today is excluded
  if (isDateExcluded(today)) {
    return streakData;
  }
  
  // If last activity was today, no change needed
  if (streakData.lastActivityDate === todayStr) {
    return streakData;
  }
  
  // Calculate new streak
  let newStreak = 1;
  if (streakData.lastActivityDate) {
    const lastDate = new Date(streakData.lastActivityDate);
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day - continue streak
      newStreak = streakData.currentStreak + 1;
    } else if (daysDiff > 1) {
      // Check if any days in between were excluded
      let consecutiveDays = 1;
      for (let i = 1; i < daysDiff; i++) {
        const checkDate = new Date(lastDate);
        checkDate.setDate(checkDate.getDate() + i);
        const checkDateStr = formatDateKey(checkDate);
        
        if (isDateExcluded(checkDate)) {
          // This day was excluded (game/practice), so streak continues
          consecutiveDays++;
        } else {
          // Found a non-excluded day with no activity - streak broken
          consecutiveDays = 0;
          break;
        }
      }
      
      if (consecutiveDays > 0) {
        // All days in between were excluded, streak continues
        newStreak = streakData.currentStreak + consecutiveDays;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }
  }
  
  const updatedData = {
    lastActivityDate: todayStr,
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, streakData.longestStreak),
    totalDaysActive: streakData.totalDaysActive + (streakData.lastActivityDate !== todayStr ? 1 : 0),
  };
  
  saveStreakData(updatedData);
  return updatedData;
};

// Calculate current streak (including checking for excluded days)
export const calculateCurrentStreak = () => {
  const streakData = getStreakData();
  const excluded = getExcludedDates();
  
  if (!streakData.lastActivityDate) {
    return 0;
  }
  
  const lastDate = new Date(streakData.lastActivityDate);
  const today = new Date();
  const todayStr = formatDateKey(today);
  
  // If last activity was today, return current streak
  if (streakData.lastActivityDate === todayStr) {
    return streakData.currentStreak;
  }
  
  // Check if streak is still active
  const daysSinceLastActivity = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastActivity === 0) {
    return streakData.currentStreak;
  }
  
  // Check if any days since last activity were excluded
  let consecutiveDays = 0;
  for (let i = 0; i <= daysSinceLastActivity; i++) {
    const checkDate = new Date(lastDate);
    checkDate.setDate(checkDate.getDate() + i);
    const checkDateStr = formatDateKey(checkDate);
    
    if (i === 0) {
      // First day (last activity) - always counts
      consecutiveDays = streakData.currentStreak;
    } else if (isDateExcluded(checkDate)) {
      // Excluded day - streak continues
      continue;
    } else if (checkDateStr === todayStr) {
      // Today - if we haven't done activity, streak might be broken
      // But if today is excluded, it's fine
      if (isDateExcluded(today)) {
        return streakData.currentStreak;
      }
      // Today is not excluded and no activity - streak broken
      return 0;
    } else {
      // Found a non-excluded day with no activity - streak broken
      return 0;
    }
  }
  
  return streakData.currentStreak;
};

// Get activity dates from progress tracking
export const getActivityDatesFromProgress = () => {
  try {
    const progressData = localStorage.getItem('icepulse_progress_data');
    if (!progressData) return [];
    
    const data = JSON.parse(progressData);
    const exercises = Object.values(data.exercises || {}).flat();
    
    // Get unique dates
    const dates = [...new Set(exercises.map(e => {
      const date = new Date(e.date);
      return formatDateKey(date);
    }))];
    
    return dates.sort();
  } catch (error) {
    console.error('Error getting activity dates:', error);
    return [];
  }
};

// Recalculate streak based on actual activity and excluded dates
export const recalculateStreak = () => {
  const activityDates = getActivityDatesFromProgress();
  const excluded = getExcludedDates();
  
  if (activityDates.length === 0) {
    saveStreakData({
      lastActivityDate: null,
      currentStreak: 0,
      longestStreak: 0,
      totalDaysActive: 0,
    });
    return 0;
  }
  
  // Sort dates
  const sortedDates = [...activityDates].sort();
  const todayStr = formatDateKey(new Date());
  
  // Calculate current streak (working backwards from today or last activity)
  let currentStreak = 0;
  let checkDate = new Date();
  
  // Start from today and work backwards
  while (true) {
    const checkDateStr = formatDateKey(checkDate);
    
    if (sortedDates.includes(checkDateStr)) {
      // Activity on this day
      currentStreak++;
    } else if (isDateExcluded(checkDate)) {
      // Excluded day - doesn't break streak, but doesn't add to it
      // Continue checking previous day
    } else {
      // No activity and not excluded - streak broken
      break;
    }
    
    // Move to previous day
    checkDate.setDate(checkDate.getDate() - 1);
    
    // Stop if we've gone back too far (e.g., more than 365 days)
    const daysBack = Math.floor((new Date() - checkDate) / (1000 * 60 * 60 * 24));
    if (daysBack > 365) {
      break;
    }
  }
  
  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
    
    if (prevDate) {
      const daysDiff = Math.floor((date - prevDate) / (1000 * 60 * 60 * 24));
      
      // Check if gap is only excluded days
      let gapIsValid = true;
      if (daysDiff > 1) {
        for (let j = 1; j < daysDiff; j++) {
          const gapDate = new Date(prevDate);
          gapDate.setDate(gapDate.getDate() + j);
          if (!isDateExcluded(gapDate)) {
            gapIsValid = false;
            break;
          }
        }
      }
      
      if (daysDiff === 1 || (daysDiff > 1 && gapIsValid)) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);
  
  const lastActivityDate = sortedDates[sortedDates.length - 1];
  
  const streakData = {
    lastActivityDate,
    currentStreak,
    longestStreak,
    totalDaysActive: sortedDates.length,
  };
  
  saveStreakData(streakData);
  return currentStreak;
};

