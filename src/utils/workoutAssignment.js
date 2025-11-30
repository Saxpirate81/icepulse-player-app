// Workout assignment utilities - assign workouts to players or entire team

const ASSIGNMENTS_STORAGE_KEY = 'icepulse_workout_assignments';

// Assign a workout to specific players or entire team
export const assignWorkout = (workout, assignedTo) => {
  try {
    // Get existing assignments
    const existing = getAssignments();
    
    // Create assignment record
    const assignment = {
      id: Date.now(),
      workoutId: workout.id || Date.now(),
      workout: workout,
      assignedTo: assignedTo, // 'all' or array of player IDs
      assignedAt: new Date().toISOString(),
      status: 'active',
    };
    
    // Add to assignments
    existing.push(assignment);
    
    // Save to localStorage
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(existing));
    
    return assignment;
  } catch (error) {
    console.error('Error assigning workout:', error);
    return null;
  }
};

// Get all assignments
export const getAssignments = () => {
  try {
    const data = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading assignments:', error);
  }
  return [];
};

// Get workouts assigned to a specific player
export const getPlayerWorkouts = (playerId) => {
  const assignments = getAssignments();
  
  return assignments
    .filter(assignment => {
      if (assignment.assignedTo === 'all') {
        return true; // All team assignments
      }
      if (Array.isArray(assignment.assignedTo)) {
        return assignment.assignedTo.includes(playerId);
      }
      return assignment.assignedTo === playerId;
    })
    .filter(assignment => assignment.status === 'active')
    .map(assignment => assignment.workout)
    .sort((a, b) => {
      // Sort by assigned date (most recent first)
      const aDate = assignments.find(ass => ass.workoutId === a.id)?.assignedAt || '';
      const bDate = assignments.find(ass => ass.workoutId === b.id)?.assignedAt || '';
      return new Date(bDate) - new Date(aDate);
    });
};

// Get workouts assigned to all team
export const getTeamWorkouts = () => {
  return getPlayerWorkouts('all');
};

// Unassign a workout
export const unassignWorkout = (workoutId) => {
  try {
    const assignments = getAssignments();
    const updated = assignments.map(assignment => {
      if (assignment.workoutId === workoutId) {
        return { ...assignment, status: 'inactive' };
      }
      return assignment;
    });
    localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error unassigning workout:', error);
    return false;
  }
};

// Get assignment details for a workout
export const getWorkoutAssignment = (workoutId) => {
  const assignments = getAssignments();
  return assignments.find(ass => ass.workoutId === workoutId && ass.status === 'active');
};

