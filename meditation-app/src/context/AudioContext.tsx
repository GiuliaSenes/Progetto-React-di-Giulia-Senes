import React, { createContext, useState, type ReactNode } from 'react';

// Interfaccia per il nostro Context
interface AudioContextType {
  selectedSound: string | null;
  setSelectedSound: (sound: string | null) => void;
  isPlayingSound: boolean;
  setIsPlayingSound: (playing: boolean) => void;
}

// Creazione del Context con un valore iniziale predefinito
export const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Interfaccia per le Props del Provider (usiamo type ReactNode esplicito)
interface AudioProviderProps {
  children: ReactNode;
}

// Provider che avvolgerà l'intera applicazione
export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [selectedSound, setSelectedSound] = useState<string | null>('rain');
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);

  return (
    <AudioContext.Provider value={{ selectedSound, setSelectedSound, isPlayingSound, setIsPlayingSound }}>
      {children}
    </AudioContext.Provider>
  );
};