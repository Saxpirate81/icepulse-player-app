// Video capture utilities for camera access and recording

export const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user', // Front camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });
    return stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
    throw new Error('Camera access denied. Please allow camera access in your browser settings.');
  }
};

export const stopCameraStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

export const startRecording = async (mediaStream) => {
  try {
    const mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    const chunks = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        resolve({ blob, videoUrl, chunks });
      };
      
      mediaRecorder.onerror = (error) => {
        reject(error);
      };
      
      mediaRecorder.start();
      
      // Return recorder so we can stop it
      resolve({ recorder: mediaRecorder });
    });
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

export const stopRecording = (recorder) => {
  if (recorder && recorder.state !== 'inactive') {
    recorder.stop();
  }
};

