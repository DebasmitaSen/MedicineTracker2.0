import { useCallback } from 'react';

export const useAudioAlert = () => {
  const playWarningBell = useCallback(() => {
    const audio = new Audio('/warning-bell.mp3');
    // Enforce high volume and loop for critical alerts
    audio.volume = 1.0; 
    audio.loop = true;
    
    audio.play().catch(error => console.error("Audio playback blocked by browser policies:", error));
    
    // Provide a way to stop the alarm (Acknowledgement)
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return { playWarningBell };
};