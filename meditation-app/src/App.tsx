import React, { useState, useEffect } from 'react';
import { Timer } from './components/Timer';
import { fetchMeditationQuote, type Quote } from './services/quoteService';
import { RefreshCw, Flower } from 'lucide-react';
import './App.css';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'quote' | 'timer'>('quote');
  
  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState<boolean>(false);

  const loadNewQuote = async () => {
    setLoadingQuote(true);
    try {
      const data = await fetchMeditationQuote();
      setQuoteData(data);
    } catch (error) {
      console.error('Errore nel caricamento della citazione:', error);
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    loadNewQuote();
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar" role="navigation">
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Flower size={28} color="#22c55e" aria-hidden="true" />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>
            ZenSpace
          </span>
        </div>
        <div className="nav-links" role="tablist">
          <button
            role="tab"
            aria-selected={currentPage === 'quote'}
            className={`btn-glass ${currentPage === 'quote' ? 'active' : ''}`}
            onClick={() => setCurrentPage('quote')}
          >
            Citazione del Giorno
          </button>
          <button
            role="tab"
            aria-selected={currentPage === 'timer'}
            className={`btn-glass ${currentPage === 'timer' ? 'active' : ''}`}
            onClick={() => setCurrentPage('timer')}
          >
            Spazio Meditazione
          </button>
        </div>
      </nav>

      <main style={{ width: '100%' }}>
        {currentPage === 'quote' ? (
          <div
            className="page-bg-container"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop')",
            }}
          >
            <div className="content-above-bg">
              <div className="glass-card">
                <h2 className="hero-title" style={{ fontSize: '1.8rem' }}>
                  Citazione del Giorno
                </h2>

                {loadingQuote ? (
                  <p style={{ margin: '2rem 0', color: 'var(--text-muted)' }}>
                    Caricamento e traduzione in corso...
                  </p>
                ) : (
                  <>
                    <p
                      style={{
                        fontSize: '1.15rem',
                        fontStyle: 'italic',
                        margin: '1.5rem 0 0.8rem 0',
                        lineHeight: '1.5',
                      }}
                    >
                      "{quoteData?.quote || 'La pace viene da dentro. Non cercarla fuori.'}"
                    </p>
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem',
                        display: 'block',
                        marginBottom: '1.5rem',
                      }}
                    >
                      — {quoteData?.author || 'Buddha'}
                    </span>
                  </>
                )}

                <button
                  className="btn-glass"
                  onClick={loadNewQuote}
                  disabled={loadingQuote}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    cursor: loadingQuote ? 'not-allowed' : 'pointer'
                  }}
                >
                  <RefreshCw size={16} className={loadingQuote ? 'spin' : ''} />
                  <span>{loadingQuote ? 'Caricamento...' : 'Nuova Citazione'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Timer />
        )}
      </main>
    </div>
  );
};

export default App;