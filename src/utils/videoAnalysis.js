// AI video analysis for technique feedback

export const analyzeVideoTechnique = async (videoBlob, exerciseType, poseData) => {
  // This would integrate with an AI service in production
  // For now, we'll use pose data to provide analysis
  
  if (!poseData || !poseData.keypoints) {
    return {
      success: false,
      message: 'Insufficient data for analysis'
    };
  }

  const keypoints = poseData.keypoints;
  const analysis = {
    overallScore: 0,
    balance: { score: 0, feedback: [] },
    technique: { score: 0, feedback: [] },
    form: { score: 0, feedback: [] },
    recommendations: []
  };

  // Analyze based on exercise type
  switch (exerciseType) {
    case 'Shooting':
      return analyzeShootingTechnique(keypoints, analysis);
    case 'Stick Handling':
      return analyzeStickHandlingTechnique(keypoints, analysis);
    case 'Strength':
      return analyzeStrengthTechnique(keypoints, analysis);
    default:
      return analyzeGenericTechnique(keypoints, analysis);
  }
};

// Analyze shooting technique
const analyzeShootingTechnique = (keypoints, analysis) => {
  const rightShoulder = keypoints[6];
  const rightElbow = keypoints[8];
  const rightWrist = keypoints[10];
  const leftShoulder = keypoints[5];
  const leftElbow = keypoints[7];
  const leftWrist = keypoints[9];
  const leftHip = keypoints[11];
  const rightHip = keypoints[12];

  // Balance analysis
  const hipAlignment = Math.abs((leftHip?.y || 0) - (rightHip?.y || 0));
  if (hipAlignment < 10) {
    analysis.balance.score = 90;
    analysis.balance.feedback.push('Excellent balance - hips are level');
  } else if (hipAlignment < 20) {
    analysis.balance.score = 75;
    analysis.balance.feedback.push('Good balance - slight hip misalignment');
  } else {
    analysis.balance.score = 60;
    analysis.balance.feedback.push('Work on balance - hips are uneven');
  }

  // Technique analysis
  if (rightShoulder && rightElbow && rightWrist) {
    const elbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    
    if (elbowAngle > 150 && elbowAngle < 180) {
      analysis.technique.score = 85;
      analysis.technique.feedback.push('Good arm extension on release');
    } else {
      analysis.technique.score = 70;
      analysis.technique.feedback.push('Work on full arm extension for more power');
    }

    // Check for weight transfer
    const shoulderHipDistance = Math.abs((rightShoulder.y || 0) - (rightHip?.y || 0));
    if (shoulderHipDistance > 100) {
      analysis.technique.feedback.push('Good weight transfer - using lower body');
      analysis.technique.score += 10;
    } else {
      analysis.technique.feedback.push('Add more weight transfer from lower body');
    }
  }

  // Form analysis
  const shoulderAlignment = Math.abs((leftShoulder?.y || 0) - (rightShoulder?.y || 0));
  if (shoulderAlignment < 15) {
    analysis.form.score = 80;
    analysis.form.feedback.push('Good shoulder alignment');
  } else {
    analysis.form.score = 65;
    analysis.form.feedback.push('Keep shoulders level for better accuracy');
  }

  // Overall score
  analysis.overallScore = Math.round(
    (analysis.balance.score + analysis.technique.score + analysis.form.score) / 3
  );

  // Recommendations
  if (analysis.overallScore < 75) {
    analysis.recommendations.push('Focus on balance drills to improve stability');
    analysis.recommendations.push('Practice weight transfer from back leg to front');
  }
  if (analysis.technique.score < 75) {
    analysis.recommendations.push('Work on full arm extension for maximum shot power');
  }

  return {
    success: true,
    analysis,
    timestamp: new Date().toISOString()
  };
};

// Analyze stick handling technique
const analyzeStickHandlingTechnique = (keypoints, analysis) => {
  const leftWrist = keypoints[9];
  const rightWrist = keypoints[10];
  const leftShoulder = keypoints[5];
  const rightShoulder = keypoints[6];
  const leftHip = keypoints[11];
  const rightHip = keypoints[12];

  // Balance analysis
  const hipAlignment = Math.abs((leftHip?.y || 0) - (rightHip?.y || 0));
  if (hipAlignment < 10) {
    analysis.balance.score = 85;
    analysis.balance.feedback.push('Good balance - maintain low center of gravity');
  } else {
    analysis.balance.score = 70;
    analysis.balance.feedback.push('Keep hips level for better puck control');
  }

  // Technique - hand positioning
  if (leftWrist && rightWrist) {
    const handDistance = Math.sqrt(
      Math.pow(leftWrist.x - rightWrist.x, 2) +
      Math.pow(leftWrist.y - rightWrist.y, 2)
    );
    
    if (handDistance > 30 && handDistance < 60) {
      analysis.technique.score = 80;
      analysis.technique.feedback.push('Good hand spacing on stick');
    } else {
      analysis.technique.score = 70;
      analysis.technique.feedback.push('Adjust hand spacing for better control');
    }
  }

  // Form - body position
  const shoulderAlignment = Math.abs((leftShoulder?.y || 0) - (rightShoulder?.y || 0));
  if (shoulderAlignment < 15) {
    analysis.form.score = 75;
    analysis.form.feedback.push('Good body position');
  } else {
    analysis.form.score = 65;
    analysis.form.feedback.push('Keep body square to maintain control');
  }

  analysis.overallScore = Math.round(
    (analysis.balance.score + analysis.technique.score + analysis.form.score) / 3
  );

  return {
    success: true,
    analysis,
    timestamp: new Date().toISOString()
  };
};

// Analyze strength exercise technique
const analyzeStrengthTechnique = (keypoints, analysis) => {
  const leftHip = keypoints[11];
  const rightHip = keypoints[12];
  const leftKnee = keypoints[13];
  const rightKnee = keypoints[14];
  const leftAnkle = keypoints[15];
  const rightAnkle = keypoints[16];

  // Balance
  const hipAlignment = Math.abs((leftHip?.y || 0) - (rightHip?.y || 0));
  analysis.balance.score = hipAlignment < 10 ? 85 : 70;
  analysis.balance.feedback.push(hipAlignment < 10 ? 'Excellent balance' : 'Work on maintaining level hips');

  // Form - knee tracking
  if (leftKnee && leftAnkle && leftHip) {
    const kneeAlignment = Math.abs(leftKnee.x - leftAnkle.x);
    if (kneeAlignment < 20) {
      analysis.form.score = 80;
      analysis.form.feedback.push('Good knee tracking - knees over toes');
    } else {
      analysis.form.score = 65;
      analysis.form.feedback.push('Keep knees aligned over toes to prevent injury');
    }
  }

  analysis.technique.score = 75;
  analysis.technique.feedback.push('Maintain controlled movement throughout');

  analysis.overallScore = Math.round(
    (analysis.balance.score + analysis.technique.score + analysis.form.score) / 3
  );

  return {
    success: true,
    analysis,
    timestamp: new Date().toISOString()
  };
};

// Generic technique analysis
const analyzeGenericTechnique = (keypoints, analysis) => {
  const leftHip = keypoints[11];
  const rightHip = keypoints[12];

  const hipAlignment = Math.abs((leftHip?.y || 0) - (rightHip?.y || 0));
  analysis.balance.score = hipAlignment < 10 ? 80 : 70;
  analysis.technique.score = 75;
  analysis.form.score = 75;

  analysis.overallScore = Math.round(
    (analysis.balance.score + analysis.technique.score + analysis.form.score) / 3
  );

  return {
    success: true,
    analysis,
    timestamp: new Date().toISOString()
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

