// Audio countdown utilities using Web Audio API

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const createBeepTone = (frequency, duration, type = 'sine') => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const playCountdownBeep = (number) => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  // Different tones for different numbers
  if (number === 0) {
    // Final beep - higher pitch
    createBeepTone(800, 0.3, 'sine');
  } else if (number <= 3) {
    // Countdown beeps - medium pitch
    createBeepTone(600, 0.2, 'sine');
  } else {
    // Early countdown - lower pitch
    createBeepTone(400, 0.15, 'sine');
  }
};

export const playSuccessSound = () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  // Play a success chord
  const frequencies = [523.25, 659.25, 783.99]; // C, E, G major chord
  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      createBeepTone(freq, 0.3, 'sine');
    }, index * 50);
  });
};

export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
};

export const countdownWithAudio = async (seconds, onCount, onComplete) => {
  for (let i = seconds; i > 0; i--) {
    onCount(i);
    playCountdownBeep(i);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  playCountdownBeep(0); // Final beep
  onComplete();
};

