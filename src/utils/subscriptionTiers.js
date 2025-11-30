// Subscription tiers and features

export const SUBSCRIPTION_TIERS = {
  BASIC: {
    id: 'basic',
    name: 'Basic',
    price: 0,
    priceDisplay: 'Free',
    features: [
      'Video verification for drills',
      'Progress tracking',
      'Team chat',
      'Access to all drills',
      'Basic analytics'
    ],
    limitations: {
      videoSaving: false,
      videoSharing: false,
      aiAnalysis: false,
      maxSavedVideos: 0
    }
  },
  VIDEO_SAVE: {
    id: 'video_save',
    name: 'Video Save',
    price: 9.99,
    priceDisplay: '$9.99/month',
    features: [
      'Everything in Basic',
      'Save practice videos',
      'Share videos with coach/team',
      'Video library access',
      'Download videos'
    ],
    limitations: {
      videoSaving: true,
      videoSharing: true,
      aiAnalysis: false,
      maxSavedVideos: 50
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    priceDisplay: '$19.99/month',
    features: [
      'Everything in Video Save',
      'AI video analysis',
      'Technique feedback',
      'Balance analysis',
      'Form corrections',
      'Personalized recommendations',
      'Unlimited saved videos',
      'Advanced progress insights'
    ],
    limitations: {
      videoSaving: true,
      videoSharing: true,
      aiAnalysis: true,
      maxSavedVideos: -1 // Unlimited
    }
  }
};

// Get current user subscription (mock for now)
export const getCurrentSubscription = () => {
  const stored = localStorage.getItem('icepulse_subscription');
  if (stored) {
    return JSON.parse(stored);
  }
  return SUBSCRIPTION_TIERS.BASIC;
};

// Set user subscription
export const setSubscription = (tierId) => {
  const tier = SUBSCRIPTION_TIERS[tierId.toUpperCase()] || SUBSCRIPTION_TIERS.BASIC;
  localStorage.setItem('icepulse_subscription', JSON.stringify(tier));
  return tier;
};

// Check if user has feature access
export const hasFeature = (feature) => {
  const subscription = getCurrentSubscription();
  return subscription.limitations[feature] === true;
};

// Check if user can save videos
export const canSaveVideo = () => {
  return hasFeature('videoSaving');
};

// Check if user has AI analysis
export const hasAIAnalysis = () => {
  return hasFeature('aiAnalysis');
};

// Get max saved videos
export const getMaxSavedVideos = () => {
  const subscription = getCurrentSubscription();
  return subscription.limitations.maxSavedVideos;
};

