import React from 'react';
import { Timer } from '../components/Timer';

export const TimerPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Sessione di Meditazione ⏱️</h1>
      <p>Scegli la durata, avvia il timer e concentrati sul tuo respiro.</p>
      
      {/* Inseriamo il nostro componente Timer */}
      <Timer />
    </div>
  );
};