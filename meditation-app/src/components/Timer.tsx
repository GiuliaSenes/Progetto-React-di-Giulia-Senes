import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Waves, Trees, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { useAudio } from '../context/useAudio';

const SOUNDS = [
  {
    id: 'rain',
    label: 'Pioggia',
    icon: CloudRain,
    url: '/sounds/rain.mp3',
    bg: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 'waves',
    label: 'Onde del Mare',
    icon: Waves,
    url: '/sounds/waves.mp3',
    bg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop'
  },
  {
    id: 'nature',
    label: 'Natura',
    icon: Trees,
    url: '/sounds/nature.mp3',
    bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1920&auto=format&fit=crop'
  }
];

export const Timer: React.FC = () => {
  const [duration, setDuration] = useState<number>(300);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [history, setHistory] = useState<number[]>([]);

  const { selectedSound, setSelectedSound } = useAudio();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSoundObj = SOUNDS.find((s) => s.id === selectedSound) || SOUNDS[0];

  useEffect(() => {
    const saved = localStorage.getItem('meditationHistory');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = volume;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isActive && currentSoundObj) {
      if (audio.src !== window.location.origin + currentSoundObj.url) {
        audio.src = currentSoundObj.url;
        audio.load();
      }
      audio.play().catch(console.warn);
    } else {
      audio.pause();
    }
  }, [isActive, selectedSound]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsActive(false);
      audioRef.current?.pause();

      const minutesCompleted = Math.round(duration / 60);
      const newHistory = [...history, minutesCompleted];
      setHistory(newHistory);
      localStorage.setItem('meditationHistory', JSON.stringify(newHistory));

      alert('Sessione completata! Ben fatto. 🧘‍♂️');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, duration, history]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectDuration = (minutes: number): void => {
    setIsActive(false);
    const newSeconds = minutes * 60;
    setDuration(newSeconds);
    setTimeLeft(newSeconds);
  };

  const clearHistory = (): void => {
    if (window.confirm('Vuoi davvero cancellare tutto lo storico delle sessioni?')) {
      setHistory([]);
      localStorage.removeItem('meditationHistory');
    }
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
                  onClick={() => handleSelectDuration(m)}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {/* Selezione Suono */}
          <div style={{ width: '100%' }}>
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
          <div className="volume-box">
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
          <div className="btn-group" style={{ marginBottom: 0 }}>
            <button
              className="btn-primary-action"
              onClick={() => setIsActive(!isActive)}
              style={{
                backgroundColor: isActive ? '#f59e0b' : 'var(--accent-green)',
                minWidth: '160px'
              }}
            >
              {isActive ? 'Pausa' : 'Avvia Sessione'}
            </button>
            <button
              className="btn-glass"
              onClick={() => { setIsActive(false); setTimeLeft(duration); }}
            >
              Reset
            </button>
          </div>

          {/* Storico Sessioni */}
          <div className="history-box">
            <div className="history-header">
              <span className="section-label" style={{ margin: 0 }}>Storico Sessioni</span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={14} /> Cancella
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Nessuna sessione completata.
              </p>
            ) : (
              <div>
                {history.map((minutes, index) => (
                  <div key={index} className="history-item">
                    <span>Sessione {index + 1}</span>
                    <strong style={{ color: '#ffffff' }}>{minutes} min</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};