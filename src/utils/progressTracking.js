// Progress tracking and improvement analytics

// Store exercise performance data
const STORAGE_KEY = 'icepulse_progress_data';

export const saveExercisePerformance = (exerciseData) => {
  const {
    taskId,
    taskTitle,
    taskType,
    date,
    duration,
    verificationScore,
    poseData,
    videoBlob,
    metrics
  } = exerciseData;

  // Get existing data
  const existingData = getProgressData();
  
  // Create or update exercise history
  if (!existingData.exercises[taskId]) {
    existingData.exercises[taskId] = [];
  }

  const performanceRecord = {
    id: Date.now(),
    date: date || new Date().toISOString(),
    taskTitle,
    taskType,
    duration,
    verificationScore,
    poseData, // Store key pose measurements
    metrics: metrics || {},
    videoUrl: videoBlob ? URL.createObjectURL(videoBlob) : null,
  };

  existingData.exercises[taskId].push(performanceRecord);
  
  // Update overall stats
  updateOverallStats(existingData);
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  
  return performanceRecord;
};

export const getProgressData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading progress data:', error);
  }
  
  // Return default structure
  return {
    exercises: {},
    stats: {
      totalExercises: 0,
      totalMinutes: 0,
      averageScore: 0,
      improvementRate: 0,
      streaks: {},
    },
    createdAt: new Date().toISOString(),
  };
};

const updateOverallStats = (data) => {
  const exercises = Object.values(data.exercises).flat();
  
  data.stats.totalExercises = exercises.length;
  data.stats.totalMinutes = exercises.reduce((sum, e) => sum + (e.duration || 0), 0);
  data.stats.averageScore = exercises.length > 0
    ? exercises.reduce((sum, e) => sum + (e.verificationScore || 0), 0) / exercises.length
    : 0;
    
  // Calculate improvement rate
  if (exercises.length >= 2) {
    const recent = exercises.slice(-5); // Last 5 exercises
    const older = exercises.slice(-10, -5); // Previous 5
    if (older.length > 0) {
      const recentAvg = recent.reduce((s, e) => s + (e.verificationScore || 0), 0) / recent.length;
      const olderAvg = older.reduce((s, e) => s + (e.verificationScore || 0), 0) / older.length;
      data.stats.improvementRate = ((recentAvg - olderAvg) / olderAvg) * 100;
    }
  }
};

// Analyze improvement for a specific exercise
export const analyzeImprovement = (taskId) => {
  const data = getProgressData();
  const exerciseHistory = data.exercises[taskId] || [];
  
  if (exerciseHistory.length < 2) {
    return {
      hasData: false,
      message: 'Complete more exercises to see improvement trends',
    };
  }

  // Sort by date
  const sortedHistory = [...exerciseHistory].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Calculate improvement metrics
  const firstPerformance = sortedHistory[0];
  const latestPerformance = sortedHistory[sortedHistory.length - 1];
  
  const scoreImprovement = latestPerformance.verificationScore - firstPerformance.verificationScore;
  const scoreImprovementPercent = firstPerformance.verificationScore > 0
    ? (scoreImprovement / firstPerformance.verificationScore) * 100
    : 0;

  // Trend analysis
  const recentScores = sortedHistory.slice(-5).map(e => e.verificationScore);
  const trend = calculateTrend(recentScores);

  // Form consistency
  const consistency = calculateConsistency(sortedHistory.map(e => e.verificationScore));

  // Speed improvement (if duration tracked)
  const durationChange = firstPerformance.duration && latestPerformance.duration
    ? ((firstPerformance.duration - latestPerformance.duration) / firstPerformance.duration) * 100
    : 0;

  return {
    hasData: true,
    taskId,
    taskTitle: firstPerformance.taskTitle,
    totalAttempts: sortedHistory.length,
    firstScore: firstPerformance.verificationScore,
    latestScore: latestPerformance.verificationScore,
    scoreImprovement,
    scoreImprovementPercent,
    trend, // 'improving', 'stable', 'declining'
    consistency,
    durationChange,
    history: sortedHistory.map(e => ({
      date: e.date,
      score: e.verificationScore,
      duration: e.duration,
    })),
  };
};

// Calculate trend direction
const calculateTrend = (scores) => {
  if (scores.length < 2) return 'stable';
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.ceil(scores.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const change = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (change > 5) return 'improving';
  if (change < -5) return 'declining';
  return 'stable';
};

// Calculate consistency (lower variance = more consistent)
const calculateConsistency = (scores) => {
  if (scores.length < 2) return 100;
  
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Convert to consistency percentage (inverse of coefficient of variation)
  const consistency = Math.max(0, 100 - (stdDev / avg) * 100);
  return Math.round(consistency);
};

// Compare two pose data sets to detect form improvements
export const comparePoseForm = (currentPose, previousPose) => {
  if (!currentPose || !previousPose || !currentPose.keypoints || !previousPose.keypoints) {
    return null;
  }

  const improvements = [];
  const issues = [];

  // Compare key joint angles and positions
  const keypoints = currentPose.keypoints;
  const prevKeypoints = previousPose.keypoints;

  // Check knee bend (for squat-like exercises)
  const leftKneeIdx = 13;
  const leftHipIdx = 11;
  const rightKneeIdx = 14;
  const rightHipIdx = 12;

  if (keypoints[leftKneeIdx] && prevKeypoints[leftKneeIdx]) {
    const currentKneeAngle = calculateAngle(
      keypoints[leftHipIdx],
      keypoints[leftKneeIdx],
      keypoints[15] // ankle
    );
    const prevKneeAngle = calculateAngle(
      prevKeypoints[leftHipIdx],
      prevKeypoints[leftKneeIdx],
      prevKeypoints[15]
    );

    if (currentKneeAngle > prevKneeAngle) {
      improvements.push('Deeper knee bend - better range of motion');
    }
  }

  // Check shoulder alignment
  const leftShoulderIdx = 5;
  const rightShoulderIdx = 6;

  if (keypoints[leftShoulderIdx] && keypoints[rightShoulderIdx]) {
    const shoulderAlignment = Math.abs(
      keypoints[leftShoulderIdx].y - keypoints[rightShoulderIdx].y
    );
    
    if (prevKeypoints[leftShoulderIdx] && prevKeypoints[rightShoulderIdx]) {
      const prevAlignment = Math.abs(
        prevKeypoints[leftShoulderIdx].y - prevKeypoints[rightShoulderIdx].y
      );

      if (shoulderAlignment < prevAlignment) {
        improvements.push('Better shoulder alignment');
      }
    }
  }

  return {
    improvements,
    issues,
    overallFormScore: calculateFormScore(keypoints),
  };
};

// Calculate angle between three points
const calculateAngle = (point1, point2, point3) => {
  if (!point1 || !point2 || !point3) return 0;
  
  const radians = Math.atan2(
    point3.y - point2.y,
    point3.x - point2.x
  ) - Math.atan2(
    point1.y - point2.y,
    point1.x - point2.x
  );
  
  let angle = Math.abs(radians * 180.0 / Math.PI);
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
};

// Calculate overall form score based on pose keypoints
const calculateFormScore = (keypoints) => {
  if (!keypoints || keypoints.length === 0) return 0;

  let score = 0;
  let visiblePoints = 0;

  keypoints.forEach(kp => {
    if (kp.score > 0.5) {
      score += kp.score;
      visiblePoints++;
    }
  });

  return visiblePoints > 0 ? (score / visiblePoints) * 100 : 0;
};

// Get overall improvement summary
export const getImprovementSummary = () => {
  const data = getProgressData();
  const exercises = Object.keys(data.exercises);
  
  const improvements = exercises.map(taskId => analyzeImprovement(taskId))
    .filter(result => result.hasData);

  const overallImprovement = improvements.length > 0
    ? improvements.reduce((sum, imp) => sum + imp.scoreImprovementPercent, 0) / improvements.length
    : 0;

  const improvingExercises = improvements.filter(imp => imp.trend === 'improving').length;
  const stableExercises = improvements.filter(imp => imp.trend === 'stable').length;
  const decliningExercises = improvements.filter(imp => imp.trend === 'declining').length;

  return {
    overallImprovement: Math.round(overallImprovement * 10) / 10,
    totalExercises: exercises.length,
    improvingExercises,
    stableExercises,
    decliningExercises,
    improvements,
    averageConsistency: improvements.length > 0
      ? Math.round(improvements.reduce((sum, imp) => sum + imp.consistency, 0) / improvements.length)
      : 0,
  };
};

