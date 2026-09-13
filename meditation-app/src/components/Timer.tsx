import React, { useState } from 'react';
import { CloudRain, Waves, Trees, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const SOUNDS = [
  {
    id: 'rain',
    label: 'Pioggia',
    icon: CloudRain,
    bg: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 'waves',
    label: 'Onde del Mare',
    icon: Waves,
    bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 'nature',
    label: 'Natura',
    icon: Trees,
    bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1920&auto=format&fit=crop'
  }
];

export const Timer: React.FC = () => {
  const {
    duration,
    timeLeft,
    isActive,
    selectedSound,
    volume,
    isMuted,
    history,
    showCompletedModal,
    startTimer,
    pauseTimer,
    resetTimer,
    setSelectedSound,
    setVolume,
    setIsMuted,
    setShowCompletedModal,
    clearHistory,
  } = useAudio();

  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

  const currentSoundObj = SOUNDS.find((s) => s.id === selectedSound) || SOUNDS[0];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="page-bg-container"
      style={{ backgroundImage: `url('${currentSoundObj.bg}')` }}
    >
      <div className="content-above-bg">
        <h1 className="hero-title">
          {isActive ? 'Respira Profondamente' : 'Pronto a Meditare'}
        </h1>

        <div className="glass-card">
          <div className="timer-display">{formatTime(timeLeft)}</div>

          {/* Selezione Durata */}
          <div style={{ width: '100%' }}>
            <div className="section-label">Durata Sessione</div>
            <div className="btn-group">
              {[3, 5, 10].map((m) => (
                <button
                  key={m}
                  className={`btn-glass ${duration === m * 60 ? 'active' : ''}`}
                  onClick={() => resetTimer(m)}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {/* Selezione Suono */}
          <div style={{ width: '100%', marginTop: '1rem' }}>
            <div className="section-label">Ambiente & Suono</div>
            <div className="btn-group">
              {SOUNDS.map((sound) => {
                const IconComponent = sound.icon;
                return (
                  <button
                    key={sound.id}
                    className={`btn-glass ${selectedSound === sound.id ? 'active' : ''}`}
                    onClick={() => setSelectedSound(sound.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <IconComponent size={18} />
                    <span>{sound.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regolazione Volume */}
          <div className="volume-box" style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', display: 'flex', alignItems: 'center' }}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              className="volume-slider"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: '30px' }}>
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>

          {/* Azioni Principali */}
          <div className="btn-group" style={{ marginTop: '1.2rem', marginBottom: 0 }}>
            <button
              className="btn-primary-action"
              onClick={isActive ? pauseTimer : startTimer}
              style={{
                backgroundColor: isActive ? '#f59e0b' : 'var(--accent-green)',
                minWidth: '160px'
              }}
            >
              {isActive ? 'Pausa' : 'Avvia Sessione'}
            </button>
            <button
              className="btn-glass"
              onClick={() => resetTimer(duration / 60)}
            >
              Reset
            </button>
          </div>

          {/* Storico Sessioni */}
          <div className="history-box">
            <div className="history-header">
              <span className="section-label" style={{ margin: 0 }}>Storico Sessioni</span>
              {history.length > 0 && !showConfirmDelete && (
                <button
                  onClick={() => setShowConfirmDelete(true)}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Cancella
                </button>
              )}
            </div>

            {showConfirmDelete && (
              <div className="inline-confirm">
                <p style={{ margin: 0, color: '#f87171' }}>Vuoi davvero cancellare lo storico?</p>
                <div className="btn-group" style={{ marginTop: '8px' }}>
                  <button className="btn-glass" onClick={() => { clearHistory(); setShowConfirmDelete(false); }}>
                    Sì, cancella
                  </button>
                  <button className="btn-glass" onClick={() => setShowConfirmDelete(false)}>
                    Annulla
                  </button>
                </div>
              </div>
            )}

            {history.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Nessuna sessione completata.
              </p>
            ) : (
              <div>
                {history.map((item) => (
                  <div key={item.id} className="history-item">
                    <span>{item.date}</span>
                    <strong style={{ color: '#ffffff' }}>{item.minutes} min</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCompletedModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-card">
            <h2>✨ Sessione Completata!</h2>
            <p style={{ margin: '1rem 0' }}>Hai completato {Math.round(duration / 60)} minuti di meditazione.</p>
            <button className="btn-primary-action" onClick={() => setShowCompletedModal(false)}>
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};