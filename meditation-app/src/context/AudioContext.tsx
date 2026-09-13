import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import rainSound from '../assets/sounds/rain.mp3';
import wavesSound from '../assets/sounds/waves.mp3';
import natureSound from '../assets/sounds/nature.mp3';

export interface HistoryItem {
  id: string;
  date: string;
  minutes: number;
}

interface AudioContextType {
  duration: number;
  timeLeft: number;
  isActive: boolean;
  selectedSound: string;
  volume: number;
  isMuted: boolean;
  history: HistoryItem[];
  showCompletedModal: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (newMinutes: number) => void;
  setSelectedSound: (key: string) => void;
  setVolume: (val: number) => void;
  setIsMuted: (val: boolean) => void;
  setShowCompletedModal: (val: boolean) => void;
  clearHistory: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [duration, setDuration] = useState<number>(300);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedSound, setSelectedSound] = useState<string>('rain');
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showCompletedModal, setShowCompletedModal] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('zen_history');
    return saved ? JSON.parse(saved) : [];
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const durationRef = useRef<number>(duration);

  // Mantiene aggiornato il ref della durata senza rieseguire gli effetti
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const SOUND_URLS: Record<string, string> = {
    rain: rainSound,
    waves: wavesSound,
    nature: natureSound,
  };

  useEffect(() => {
    localStorage.setItem('zen_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isActive && audioRef.current) {
      audioRef.current.play().catch(e => console.warn('Riproduzione bloccata:', e));
    }
  }, [selectedSound, isActive]);

  // LOGICA TIMER CORRETTA: dipende SOLO da [isActive]
  useEffect(() => {
    if (!isActive) return;

    if (!endTimeRef.current) {
      endTimeRef.current = Date.now() + timeLeft * 1000;
    }

    const interval = setInterval(() => {
      if (!endTimeRef.current) return;

      const remainingSeconds = Math.ceil((endTimeRef.current - Date.now()) / 1000);

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setIsActive(false);
        endTimeRef.current = null;

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        const minutesCompleted = Math.round(durationRef.current / 60);
        const newEntry: HistoryItem = {
          id: crypto.randomUUID(),
          date: new Date().toLocaleDateString('it-IT', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
          }),
          minutes: minutesCompleted,
        };

        setHistory((prev) => [newEntry, ...prev]);
        setShowCompletedModal(true);
      } else {
        setTimeLeft(remainingSeconds);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isActive]);

  const startTimer = () => {
    endTimeRef.current = Date.now() + timeLeft * 1000;
    setIsActive(true);
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Errore nell'avvio audio:", e));
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
    endTimeRef.current = null;
    if (audioRef.current) audioRef.current.pause();
  };

  const resetTimer = (newMinutes: number) => {
    setIsActive(false);
    endTimeRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const seconds = newMinutes * 60;
    setDuration(seconds);
    setTimeLeft(seconds);
  };

  const clearHistory = () => setHistory([]);

  return (
    <AudioContext.Provider
      value={{
        duration, timeLeft, isActive, selectedSound, volume, isMuted,
        history, showCompletedModal, startTimer, pauseTimer, resetTimer,
        setSelectedSound, setVolume, setIsMuted, setShowCompletedModal, clearHistory,
      }}
    >
      <audio 
        ref={audioRef} 
        src={SOUND_URLS[selectedSound]} 
        loop 
        style={{ display: 'none' }}
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio deve essere usato dentro AudioProvider');
  return context;
};