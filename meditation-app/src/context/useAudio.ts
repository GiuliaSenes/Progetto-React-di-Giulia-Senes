import { useContext } from 'react';
import { AudioContext } from './AudioContext';

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio deve essere usato all\'interno di un AudioProvider');
  }
  return context;
};