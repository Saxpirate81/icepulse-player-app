// Pose detection utilities using TensorFlow.js

let detector = null;
let isInitialized = false;

export const initializePoseDetector = async () => {
  if (isInitialized && detector) {
    return detector;
  }

  try {
    // Dynamic imports to reduce bundle size
    const poseDetection = await import('@tensorflow-models/pose-detection');
    const tf = await import('@tensorflow/tfjs-core');
    // Ensure the WebGL backend is registered and ready before using the model
    await import('@tensorflow/tfjs-backend-webgl');

    // Prefer WebGL (faster); fall back to CPU if WebGL is unavailable
    try {
      await tf.setBackend('webgl');
    } catch (e) {
      console.warn('WebGL backend unavailable, falling back to CPU:', e);
      try {
        await tf.setBackend('cpu');
      } catch (e2) {
        console.warn('CPU backend initialization failed:', e2);
      }
    }

    // Wait for TensorFlow.js to finish initializing the chosen backend
    await tf.ready();

    // Use MoveNet for fast, lightweight pose detection
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: true,
    };

    detector = await poseDetection.createDetector(model, detectorConfig);
    isInitialized = true;
    
    return detector;
  } catch (error) {
    console.error('Error initializing pose detector:', error);
    throw new Error('Failed to initialize pose detection. Please check your connection.');
  }
};

export const detectPose = async (videoElement) => {
  if (!detector || !videoElement) {
    return null;
  }

  try {
    const poses = await detector.estimatePoses(videoElement, {
      flipHorizontal: false,
      maxPoses: 1,
      scoreThreshold: 0.3,
    });
    
    return poses.length > 0 ? poses[0] : null;
  } catch (error) {
    console.error('Error detecting pose:', error);
    return null;
  }
};

export const verifyExerciseCompletion = (pose, exerciseType) => {
  if (!pose || !pose.keypoints) {
    return { verified: false, confidence: 0, feedback: 'No pose detected' };
  }

  const keypoints = pose.keypoints;
  const confidence = pose.score || 0;

  // Keypoint indices (MoveNet format)
  const KEYPOINTS = {
    NOSE: 0,
    LEFT_EYE: 1,
    RIGHT_EYE: 2,
    LEFT_EAR: 3,
    RIGHT_EAR: 4,
    LEFT_SHOULDER: 5,
    RIGHT_SHOULDER: 6,
    LEFT_ELBOW: 7,
    RIGHT_ELBOW: 8,
    LEFT_WRIST: 9,
    RIGHT_WRIST: 10,
    LEFT_HIP: 11,
    RIGHT_HIP: 12,
    LEFT_KNEE: 13,
    RIGHT_KNEE: 14,
    LEFT_ANKLE: 15,
    RIGHT_ANKLE: 16,
  };

  // Verify based on exercise type
  switch (exerciseType) {
    case 'Skating':
    case 'Stretching':
      // Check if person is visible and standing
      const hipVisible = keypoints[KEYPOINTS.LEFT_HIP]?.score > 0.5 || 
                         keypoints[KEYPOINTS.RIGHT_HIP]?.score > 0.5;
      const kneeVisible = keypoints[KEYPOINTS.LEFT_KNEE]?.score > 0.5 || 
                          keypoints[KEYPOINTS.RIGHT_KNEE]?.score > 0.5;
      
      return {
        verified: hipVisible && kneeVisible && confidence > 0.5,
        confidence: confidence,
        feedback: hipVisible && kneeVisible ? 'Good form detected' : 'Please position yourself in frame'
      };

    case 'Strength':
      // Check for squat-like movements
      const leftKnee = keypoints[KEYPOINTS.LEFT_KNEE];
      const rightKnee = keypoints[KEYPOINTS.RIGHT_KNEE];
      const leftHip = keypoints[KEYPOINTS.LEFT_HIP];
      const rightHip = keypoints[KEYPOINTS.RIGHT_HIP];
      
      if (!leftKnee || !rightKnee || !leftHip || !rightHip) {
        return {
          verified: false,
          confidence: 0,
          feedback: 'Position yourself fully in frame'
        };
      }

      // Check if knees are bent (squat position)
      const kneeBent = Math.abs(leftKnee.y - leftHip.y) < Math.abs(rightKnee.y - rightHip.y) * 1.5;
      
      return {
        verified: kneeBent && confidence > 0.6,
        confidence: confidence,
        feedback: kneeBent ? 'Exercise detected' : 'Please perform the exercise'
      };

    case 'Hands':
    case 'Shooting':
      // Check for arm/wrist visibility (stick handling or shooting)
      const leftWrist = keypoints[KEYPOINTS.LEFT_WRIST];
      const rightWrist = keypoints[KEYPOINTS.RIGHT_WRIST];
      const wristVisible = (leftWrist?.score > 0.5) || (rightWrist?.score > 0.5);
      
      return {
        verified: wristVisible && confidence > 0.5,
        confidence: confidence,
        feedback: wristVisible ? 'Arms detected - keep going!' : 'Please show your arms in frame'
      };

    default:
      // Generic verification - just check if person is visible
      return {
        verified: confidence > 0.5,
        confidence: confidence,
        feedback: confidence > 0.5 ? 'Activity detected' : 'Please position yourself in frame'
      };
  }
};

export const drawPoseOnCanvas = (canvas, video, pose, ctx) => {
  if (!pose || !canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Draw keypoints
  const keypoints = pose.keypoints || [];
  keypoints.forEach(keypoint => {
    if (keypoint.score > 0.3) {
      ctx.beginPath();
      ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'cyan';
      ctx.fill();
    }
  });

  // Draw skeleton connections (simplified)
  const connections = [
    [5, 6], // shoulders
    [5, 7], [7, 9], // left arm
    [6, 8], [8, 10], // right arm
    [5, 11], [6, 12], // torso
    [11, 13], [13, 15], // left leg
    [12, 14], [14, 16], // right leg
  ];

  ctx.strokeStyle = 'cyan';
  ctx.lineWidth = 2;
  
  connections.forEach(([start, end]) => {
    const startPoint = keypoints[start];
    const endPoint = keypoints[end];
    
    if (startPoint?.score > 0.3 && endPoint?.score > 0.3) {
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.stroke();
    }
  });
};

