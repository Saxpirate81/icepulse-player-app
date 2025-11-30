// Rep counting and tracking utilities using AI pose detection

export const countRepsFromPose = (currentPose, previousPose, exerciseType, repCount) => {
  if (!currentPose || !previousPose || !currentPose.keypoints || !previousPose.keypoints) {
    return { count: repCount, confidence: 0 };
  }

  const keypoints = currentPose.keypoints;
  const prevKeypoints = previousPose.keypoints;

  switch (exerciseType) {
    case 'pushups':
    case 'Push-Ups':
      return countPushupRep(keypoints, prevKeypoints, repCount);
    
    case 'squats':
    case 'Bulgarian Split Squats':
    case 'Lower Body':
      return countSquatRep(keypoints, prevKeypoints, repCount);
    
    case 'pullups':
    case 'Pull-Ups':
      return countPullupRep(keypoints, prevKeypoints, repCount);
    
    case 'shooting':
    case 'Shooting':
    case 'Toe Drag & Shoot':
    case 'Quick Release Snap Shots':
      return countShootingShot(keypoints, prevKeypoints, repCount);
    
    case 'stick handling':
    case 'Stick Handling':
    case 'Cone Stickhandling Figure-8':
    case 'Puck Protection Circles':
      return countStickHandlingRep(keypoints, prevKeypoints, repCount);
    
    default:
      return { count: repCount, confidence: 0.5 };
  }
};

// Count push-up reps (down then up = 1 rep)
const countPushupRep = (keypoints, prevKeypoints, currentCount) => {
  const nose = keypoints[0];
  const leftWrist = keypoints[9];
  const rightWrist = keypoints[10];
  const leftShoulder = keypoints[5];
  const rightShoulder = keypoints[6];

  const prevNose = prevKeypoints[0];
  const prevLeftWrist = prevKeypoints[9];
  const prevRightWrist = prevKeypoints[10];

  if (!nose || !leftWrist || !rightWrist || !prevNose) {
    return { count: currentCount, confidence: 0 };
  }

  // Calculate if body is going down (nose moving toward wrists) or up
  const currentNoseWristDistance = Math.min(
    Math.abs(nose.y - leftWrist.y),
    Math.abs(nose.y - rightWrist.y)
  );
  const prevNoseWristDistance = Math.min(
    Math.abs(prevNose.y - prevLeftWrist.y),
    Math.abs(prevNose.y - prevRightWrist.y)
  );

  // If nose is moving down toward wrists (decreasing distance), going down
  // If nose is moving up away from wrists (increasing distance), going up
  const isGoingDown = currentNoseWristDistance < prevNoseWristDistance;
  const isAtBottom = currentNoseWristDistance < 50; // Threshold for "down" position
  const wasAtBottom = prevNoseWristDistance < 50;

  // Rep completed if we were at bottom and now going up
  if (wasAtBottom && !isGoingDown && currentNoseWristDistance > 100) {
    return { 
      count: currentCount + 1, 
      confidence: 0.8,
      repCompleted: true 
    };
  }

  return { count: currentCount, confidence: 0.3, repCompleted: false };
};

// Count squat reps (down then up = 1 rep)
const countSquatRep = (keypoints, prevKeypoints, currentCount) => {
  const leftHip = keypoints[11];
  const leftKnee = keypoints[13];
  const leftAnkle = keypoints[15];
  const rightHip = keypoints[12];
  const rightKnee = keypoints[14];
  const rightAnkle = keypoints[16];

  const prevLeftHip = prevKeypoints[11];
  const prevLeftKnee = prevKeypoints[13];

  if (!leftHip || !leftKnee || !prevLeftHip || !prevLeftKnee) {
    return { count: currentCount, confidence: 0 };
  }

  // Calculate knee angle to detect squat depth
  const calculateKneeAngle = (hip, knee, ankle) => {
    if (!hip || !knee || !ankle) return 180;
    const angle = Math.atan2(hip.y - knee.y, hip.x - knee.x) - 
                  Math.atan2(ankle.y - knee.y, ankle.x - knee.x);
    return Math.abs(angle * 180 / Math.PI);
  };

  const currentAngle = calculateKneeAngle(leftHip, leftKnee, leftAnkle);
  const prevAngle = calculateKneeAngle(prevLeftHip, prevLeftKnee, prevKeypoints[15]);

  const isGoingDown = currentAngle < prevAngle;
  const isAtBottom = currentAngle < 90; // Deep squat
  const wasAtBottom = prevAngle < 90;
  const isStanding = currentAngle > 150;

  // Rep completed if we were at bottom and now standing
  if (wasAtBottom && isStanding) {
    return { 
      count: currentCount + 1, 
      confidence: 0.85,
      repCompleted: true 
    };
  }

  return { count: currentCount, confidence: 0.4, repCompleted: false };
};

// Count pull-up reps (up then down = 1 rep)
const countPullupRep = (keypoints, prevKeypoints, currentCount) => {
  const nose = keypoints[0];
  const leftWrist = keypoints[9];
  const rightWrist = keypoints[10];

  const prevNose = prevKeypoints[0];
  const prevLeftWrist = prevKeypoints[9];
  const prevRightWrist = prevKeypoints[10];

  if (!nose || !leftWrist || !rightWrist || !prevNose) {
    return { count: currentCount, confidence: 0 };
  }

  // Calculate if chin is going up (toward wrists) or down
  const currentNoseWristDistance = Math.min(
    Math.abs(nose.y - leftWrist.y),
    Math.abs(nose.y - rightWrist.y)
  );
  const prevNoseWristDistance = Math.min(
    Math.abs(prevNose.y - prevLeftWrist.y),
    Math.abs(prevNose.y - prevRightWrist.y)
  );

  const isGoingUp = currentNoseWristDistance < prevNoseWristDistance;
  const isAtTop = currentNoseWristDistance < 30; // Chin over bar
  const wasAtTop = prevNoseWristDistance < 30;
  const isAtBottom = currentNoseWristDistance > 100;

  // Rep completed if we were at top and now at bottom
  if (wasAtTop && isAtBottom) {
    return { 
      count: currentCount + 1, 
      confidence: 0.8,
      repCompleted: true 
    };
  }

  return { count: currentCount, confidence: 0.3, repCompleted: false };
};

// Count shooting shots (detects windup and release motion)
const countShootingShot = (keypoints, prevKeypoints, currentCount) => {
  const rightShoulder = keypoints[6];
  const rightElbow = keypoints[8];
  const rightWrist = keypoints[10];
  const leftShoulder = keypoints[5];
  const leftElbow = keypoints[7];
  const leftWrist = keypoints[9];

  const prevRightShoulder = prevKeypoints[6];
  const prevRightElbow = prevKeypoints[8];
  const prevRightWrist = prevKeypoints[10];

  if (!rightShoulder || !rightElbow || !rightWrist || !prevRightShoulder || !prevRightElbow) {
    return { count: currentCount, confidence: 0 };
  }

  // Calculate arm extension (shooting motion)
  // Windup: elbow moves back (away from target)
  // Release: arm extends forward (wrist moves forward rapidly)
  
  const currentElbowAngle = Math.atan2(
    rightWrist.y - rightElbow.y,
    rightWrist.x - rightElbow.x
  );
  const prevElbowAngle = Math.atan2(
    prevRightWrist.y - prevRightElbow.y,
    prevRightWrist.x - prevRightElbow.x
  );

  const currentWristSpeed = Math.sqrt(
    Math.pow(rightWrist.x - prevRightWrist.x, 2) +
    Math.pow(rightWrist.y - prevRightWrist.y, 2)
  );

  // Detecting shooting motion: rapid forward extension of arm
  const isWindup = currentElbowAngle < prevElbowAngle && 
                   Math.abs(currentElbowAngle - prevElbowAngle) > 0.3;
  const isRelease = currentWristSpeed > 15 && // Fast movement indicates release
                   rightWrist.x > prevRightWrist.x; // Moving forward

  // Shot detected when we transition from windup to release
  if (isRelease && currentWristSpeed > 20) {
    return { 
      count: currentCount + 1, 
      confidence: Math.min(0.85, currentWristSpeed / 30),
      repCompleted: true,
      type: 'shot'
    };
  }

  return { count: currentCount, confidence: 0.4, repCompleted: false };
};

// Count stick handling reps (detects puck movement patterns)
const countStickHandlingRep = (keypoints, prevKeypoints, currentCount) => {
  const rightWrist = keypoints[10];
  const leftWrist = keypoints[9];
  const rightShoulder = keypoints[6];
  const leftShoulder = keypoints[5];

  const prevRightWrist = prevKeypoints[10];
  const prevLeftWrist = prevKeypoints[9];

  if (!rightWrist || !leftWrist || !prevRightWrist || !prevLeftWrist) {
    return { count: currentCount, confidence: 0 };
  }

  // Calculate stick movement (both wrists move together for stick handling)
  const rightHandMovement = Math.sqrt(
    Math.pow(rightWrist.x - prevRightWrist.x, 2) +
    Math.pow(rightWrist.y - prevRightWrist.y, 2)
  );
  const leftHandMovement = Math.sqrt(
    Math.pow(leftWrist.x - prevLeftWrist.x, 2) +
    Math.pow(leftWrist.y - prevLeftWrist.y, 2)
  );

  // Stick handling involves coordinated movement of both hands
  const coordinatedMovement = rightHandMovement > 10 && leftHandMovement > 10;
  const lateralMovement = Math.abs(rightWrist.x - prevRightWrist.x) > 15 || 
                         Math.abs(leftWrist.x - prevLeftWrist.x) > 15;

  // Rep completed when we see a full lateral movement pattern (left to right or right to left)
  const movementDirection = rightWrist.x - prevRightWrist.x;
  const prevMovementDirection = prevKeypoints[10]?.x - prevKeypoints[9]?.x || 0;

  // Detect direction change (one rep = move left then right, or vice versa)
  if (coordinatedMovement && lateralMovement && 
      Math.sign(movementDirection) !== Math.sign(prevMovementDirection)) {
    return { 
      count: currentCount + 1, 
      confidence: 0.75,
      repCompleted: true,
      type: 'stickhandling'
    };
  }

  return { count: currentCount, confidence: 0.3, repCompleted: false };
};

// Get adaptive recommendations based on performance
export const getAdaptiveRecommendations = (exerciseId, completedReps, targetReps, difficulty) => {
  const performanceRatio = completedReps / targetReps;
  
  if (performanceRatio >= 1.0) {
    // Completed all reps easily - suggest progression
    return {
      action: 'progress',
      message: `Great work! You completed ${completedReps} reps. Ready to increase difficulty?`,
      suggestions: [
        'Increase reps by 2-3',
        'Add weight/resistance',
        'Try advanced variation'
      ]
    };
  } else if (performanceRatio >= 0.8) {
    // Close to target - keep current level
    return {
      action: 'maintain',
      message: `Almost there! You completed ${completedReps}/${targetReps} reps. Keep working at this level.`,
      suggestions: [
        'Continue with current reps',
        'Focus on perfect form',
        'Rest properly between sets'
      ]
    };
  } else if (performanceRatio >= 0.5) {
    // Struggling - reduce difficulty
    return {
      action: 'reduce',
      message: `You completed ${completedReps}/${targetReps} reps. Let's adjust to build strength gradually.`,
      suggestions: [
        'Reduce reps to build up gradually',
        'Use assisted variation',
        'Focus on form over quantity'
      ]
    };
  } else {
    // Significant struggle - use easier variation
    return {
      action: 'modify',
      message: `You completed ${completedReps}/${targetReps} reps. Let's try an easier variation first.`,
      suggestions: [
        'Try beginner variation',
        'Reduce reps significantly',
        'Use lighter/no weight',
        'Build foundational strength first'
      ]
    };
  }
};

// Calculate next target reps based on performance
export const calculateNextTarget = (currentTarget, completedReps, attempts) => {
  const avgCompleted = attempts.reduce((sum, a) => sum + a, 0) / attempts.length;
  
  if (avgCompleted >= currentTarget * 0.95 && attempts.length >= 3) {
    // Consistently hitting target - increase
    return Math.min(currentTarget + 2, currentTarget * 1.2); // Cap at 20% increase
  } else if (avgCompleted < currentTarget * 0.7 && attempts.length >= 2) {
    // Struggling - decrease
    return Math.max(Math.ceil(currentTarget * 0.8), 3); // Minimum 3 reps
  }
  
  return currentTarget; // Maintain current
};

