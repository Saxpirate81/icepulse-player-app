// Track last workout type for alternating upper/lower body days

const LAST_WORKOUT_KEY = 'icepulse_last_workout_type';
const LAST_WORKOUT_DATE_KEY = 'icepulse_last_workout_date';

/**
 * Get the last workout type performed
 * @returns {string|null} 'upper', 'lower', or null if no workout recorded
 */
export const getLastWorkoutType = () => {
  try {
    const data = localStorage.getItem(LAST_WORKOUT_KEY);
    return data || null;
  } catch (error) {
    console.error('Error getting last workout type:', error);
    return null;
  }
};

/**
 * Get the date of the last workout
 * @returns {string|null} Date string (YYYY-MM-DD) or null
 */
export const getLastWorkoutDate = () => {
  try {
    const data = localStorage.getItem(LAST_WORKOUT_DATE_KEY);
    return data || null;
  } catch (error) {
    console.error('Error getting last workout date:', error);
    return null;
  }
};

/**
 * Record that a workout type was completed
 * @param {string} workoutType - 'upper' or 'lower'
 * @param {string} date - Optional date string (YYYY-MM-DD), defaults to today
 */
export const recordWorkoutType = (workoutType, date = null) => {
  try {
    const dateStr = date || new Date().toISOString().split('T')[0];
    localStorage.setItem(LAST_WORKOUT_KEY, workoutType);
    localStorage.setItem(LAST_WORKOUT_DATE_KEY, dateStr);
  } catch (error) {
    console.error('Error recording workout type:', error);
  }
};

/**
 * Determine next workout type based on last workout
 * Alternates: upper -> lower -> upper -> lower
 * @returns {string} 'upper' or 'lower'
 */
export const getNextWorkoutType = () => {
  const lastType = getLastWorkoutType();
  
  // If no last workout, start with upper
  if (!lastType) {
    return 'upper';
  }
  
  // Alternate: if last was upper, next is lower, and vice versa
  return lastType === 'upper' ? 'lower' : 'upper';
};

/**
 * Check if we should use alternating logic (if there's a recent workout)
 * @param {string} date - Date to check (YYYY-MM-DD)
 * @returns {boolean}
 */
export const shouldAlternate = (date) => {
  const lastDate = getLastWorkoutDate();
  if (!lastDate) return false;
  
  // If last workout was today or yesterday, use alternating logic
  const lastWorkout = new Date(lastDate);
  const checkDate = new Date(date);
  const daysDiff = Math.floor((checkDate - lastWorkout) / (1000 * 60 * 60 * 24));
  
  return daysDiff <= 1; // Within 1 day
};

