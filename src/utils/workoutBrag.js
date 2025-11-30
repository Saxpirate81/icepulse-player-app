// Automatic celebratory messages when players complete workouts

const CHAT_STORAGE_KEY = 'icepulse_team_chat';

// Generate a celebratory message based on workout completion
const generateBragMessage = (taskTitle, verificationScore, playerName = 'Beckham M.') => {
  const score = Math.round(verificationScore * 100);
  const emojis = ['🏒', '💪', '🔥', '⚡', '🏆', '⭐', '🎯', '🚀', '💯', '🎉'];
  
  // Different message templates based on score
  let message;
  
  if (score >= 90) {
    const templates = [
      `Just crushed ${taskTitle}! ${emojis[Math.floor(Math.random() * emojis.length)]} ${score}% form score! Feeling unstoppable! ${emojis[Math.floor(Math.random() * emojis.length)]}`,
      `Nailed ${taskTitle} with ${score}% verification! ${emojis[Math.floor(Math.random() * emojis.length)]} That's what I'm talking about! ${emojis[Math.floor(Math.random() * emojis.length)]}`,
      `${taskTitle} complete! ${score}% form score! ${emojis[Math.floor(Math.random() * emojis.length)]} Getting stronger every day! ${emojis[Math.floor(Math.random() * emojis.length)]}`,
      `Just finished ${taskTitle}! ${emojis[Math.floor(Math.random() * emojis.length)]} ${score}% verified! On fire! ${emojis[Math.floor(Math.random() * emojis.length)]}`,
    ];
    message = templates[Math.floor(Math.random() * templates.length)];
  } else if (score >= 75) {
    const templates = [
      `Completed ${taskTitle}! ${score}% form score ${emojis[Math.floor(Math.random() * emojis.length)]} Feeling good!`,
      `Just finished ${taskTitle}! ${emojis[Math.floor(Math.random() * emojis.length)]} ${score}% verified! Progress!`,
      `${taskTitle} done! ${score}% form! ${emojis[Math.floor(Math.random() * emojis.length)]} Keep grinding!`,
    ];
    message = templates[Math.floor(Math.random() * templates.length)];
  } else {
    const templates = [
      `Finished ${taskTitle}! ${score}% verified ${emojis[Math.floor(Math.random() * emojis.length)]} Every rep counts!`,
      `Completed ${taskTitle}! ${emojis[Math.floor(Math.random() * emojis.length)]} ${score}% form! Building strength!`,
    ];
    message = templates[Math.floor(Math.random() * templates.length)];
  }
  
  return message;
};

// Post a workout completion message to team chat
export const postWorkoutCompletion = (taskTitle, verificationScore, playerName = 'Beckham M.', playerId = 'beckham') => {
  try {
    // Get existing chat messages
    const existingChat = localStorage.getItem(CHAT_STORAGE_KEY);
    let messages = [];
    
    if (existingChat) {
      try {
        messages = JSON.parse(existingChat);
      } catch (e) {
        console.error('Error parsing chat messages:', e);
      }
    }
    
    // Generate celebratory message
    const bragMessage = generateBragMessage(taskTitle, verificationScore, playerName);
    
    // Create new message
    const newMessage = {
      id: Date.now(),
      sender: playerId,
      senderName: playerName,
      text: bragMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      liked: false,
      isSystemBrag: true, // Mark as auto-generated brag
    };
    
    // Add to messages
    messages.push(newMessage);
    
    // Keep only last 100 messages to prevent storage bloat
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    
    // Save to localStorage
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    
    return newMessage;
  } catch (error) {
    console.error('Error posting workout completion:', error);
    return null;
  }
};

// Get all chat messages (including system brags)
export const getChatMessages = () => {
  try {
    const chatData = localStorage.getItem(CHAT_STORAGE_KEY);
    if (chatData) {
      return JSON.parse(chatData);
    }
  } catch (error) {
    console.error('Error loading chat messages:', error);
  }
  return [];
};

// Merge system brags with mock team chat
export const getMergedChatMessages = (mockChat) => {
  const systemBrags = getChatMessages();
  const allMessages = [...mockChat, ...systemBrags];
  
  // Sort by time (most recent first, then reverse for display)
  return allMessages.sort((a, b) => {
    // Simple time comparison - in production, use proper date parsing
    return b.id - a.id;
  }).reverse();
};

