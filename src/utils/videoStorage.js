// Video storage and sharing utilities

export const saveVideo = async (videoBlob, exerciseData, subscriptionTier) => {
  const { canSaveVideo, getMaxSavedVideos } = await import('./subscriptionTiers.js');
  
  if (!canSaveVideo()) {
    return {
      success: false,
      message: 'Video saving requires Video Save or Premium subscription'
    };
  }

  // Check video limit
  const maxVideos = getMaxSavedVideos();
  const savedVideos = getSavedVideos();
  
  if (maxVideos > 0 && savedVideos.length >= maxVideos) {
    return {
      success: false,
      message: `Video limit reached (${maxVideos} videos). Upgrade to Premium for unlimited storage.`
    };
  }

  // Create video object
  const videoData = {
    id: Date.now(),
    exerciseId: exerciseData.taskId,
    exerciseTitle: exerciseData.taskTitle,
    exerciseType: exerciseData.taskType,
    date: new Date().toISOString(),
    videoBlob: videoBlob,
    videoUrl: URL.createObjectURL(videoBlob),
    duration: exerciseData.duration || 0,
    verificationScore: exerciseData.verificationScore || 0,
    shared: false,
    analysis: null // Will be populated if Premium tier
  };

  // Save to localStorage (in production, this would be cloud storage)
  savedVideos.push(videoData);
  localStorage.setItem('icepulse_saved_videos', JSON.stringify(savedVideos.map(v => ({
    ...v,
    videoBlob: null, // Don't store blob in JSON, use videoUrl
  }))));

  return {
    success: true,
    video: videoData,
    message: 'Video saved successfully'
  };
};

export const getSavedVideos = () => {
  try {
    const stored = localStorage.getItem('icepulse_saved_videos');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading saved videos:', error);
  }
  return [];
};

export const shareVideo = async (videoId, shareWith) => {
  const { canSaveVideo } = await import('./subscriptionTiers.js');
  
  if (!canSaveVideo()) {
    return {
      success: false,
      message: 'Video sharing requires Video Save or Premium subscription'
    };
  }

  const videos = getSavedVideos();
  const video = videos.find(v => v.id === videoId);
  
  if (!video) {
    return {
      success: false,
      message: 'Video not found'
    };
  }

  // Mark as shared (in production, this would send to server)
  video.shared = true;
  video.sharedWith = shareWith;
  video.sharedAt = new Date().toISOString();
  
  localStorage.setItem('icepulse_saved_videos', JSON.stringify(videos));

  return {
    success: true,
    message: 'Video shared successfully'
  };
};

export const deleteVideo = (videoId) => {
  const videos = getSavedVideos();
  const filtered = videos.filter(v => v.id !== videoId);
  localStorage.setItem('icepulse_saved_videos', JSON.stringify(filtered));
  return { success: true };
};

export const analyzeVideoWithAI = async (videoId) => {
  const { hasAIAnalysis } = await import('./subscriptionTiers.js');
  
  if (!hasAIAnalysis()) {
    return {
      success: false,
      message: 'AI analysis requires Premium subscription'
    };
  }

  const videos = getSavedVideos();
  const video = videos.find(v => v.id === videoId);
  
  if (!video) {
    return {
      success: false,
      message: 'Video not found'
    };
  }

  // Get pose data if available
  const progressData = JSON.parse(localStorage.getItem('icepulse_progress_data') || '{}');
  const exerciseHistory = progressData.exercises?.[video.exerciseId] || [];
  const matchingExercise = exerciseHistory.find(e => e.date === video.date);
  
  if (matchingExercise && matchingExercise.poseData) {
    const { analyzeVideoTechnique } = await import('./videoAnalysis.js');
    const analysis = await analyzeVideoTechnique(
      video.videoBlob,
      video.exerciseType,
      matchingExercise.poseData
    );

    // Save analysis to video
    video.analysis = analysis;
    localStorage.setItem('icepulse_saved_videos', JSON.stringify(videos));

    return {
      success: true,
      analysis: analysis.analysis,
      message: 'Video analyzed successfully'
    };
  }

  return {
    success: false,
    message: 'Pose data not available for analysis'
  };
};

