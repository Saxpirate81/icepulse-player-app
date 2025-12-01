// Utility to clear all dummy data except workout/skill/stretching data
// This keeps only real accounts from Supabase and workout/skill/stretching data

export const clearDummyData = () => {
  // Keep these keys (workout/skill/stretching data and real accounts):
  const keysToKeep = [
    'icepulse_drills', // Workout/skill/stretching data
    'icepulse_organizations', // Real accounts from Supabase
    'icepulse_teams', // Real accounts from Supabase
    'icepulse_coaches', // Real accounts from Supabase
    'icepulse_players', // Real accounts from Supabase
    'icepulse_invitations', // Real accounts from Supabase
    'icepulse_current_user', // Current logged in user
    'icepulse_current_organization', // Current organization
    'icepulse_auth_token', // Auth token
  ];

  // Get all localStorage keys
  const allKeys = Object.keys(localStorage);
  
  // Remove all keys except the ones to keep
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  // Reset streak data to 0
  localStorage.setItem('icepulse_streak_data', JSON.stringify({
    lastActivityDate: null,
    currentStreak: 0,
    longestStreak: 0,
    totalDaysActive: 0,
  }));

  // Clear excluded dates
  localStorage.removeItem('icepulse_excluded_dates');

  // Clear progress data
  localStorage.removeItem('icepulse_progress_data');

  // Clear chat messages
  localStorage.removeItem('icepulse_team_chat');

  // Clear deleted defaults
  localStorage.removeItem('icepulse_deleted_defaults');

  // Clear first day flag
  localStorage.removeItem('icepulse_first_day_complete');

  // Clear workout tracking
  localStorage.removeItem('icepulse_last_workout_type');

  // Clear any video analysis data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('video_analysis_')) {
      localStorage.removeItem(key);
    }
  });

  console.log('✅ Cleared all dummy data. Kept only workout/skill/stretching data and real accounts from Supabase.');
  console.log('✅ Streak reset to 0.');
};

