import React, { useState, useEffect } from 'react';
import { fetchMeditationQuote, type Quote } from './services/quoteService';
import { Timer } from './components/Timer';
import { Flower } from 'lucide-react';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quote' | 'meditation'>('quote');
  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadQuote = async () => {
    setLoading(true);
    const data = await fetchMeditationQuote();
    setQuoteData(data);
    setLoading(false);
  };

  useEffect(() => {
    loadQuote();
  }, []);

  return (
    <div className="app-wrapper">
      {/* NAVBAR TRASPARENTE */}
      <nav className="navbar">
        <div className="brand-logo">
        <Flower size={24} color="#22c55e" />
    <span>ZenSpace</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-btn ${activeTab === 'quote' ? 'active' : ''}`}
            onClick={() => setActiveTab('quote')}
          >
            Citazione del Giorno
          </button>
          <button 
            className={`nav-btn ${activeTab === 'meditation' ? 'active' : ''}`}
            onClick={() => setActiveTab('meditation')}
          >
            Spazio Meditazione
          </button>
        </div>
      </nav>

      {/* PAGINA CITAZIONE */}
      {activeTab === 'quote' && (
        <div 
          className="page-bg-container"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1920&auto=format&fit=crop')` }}
        >
          <div className="content-above-bg">
            <h1 className="hero-title">Ispirazione del Giorno</h1>
            <div className="glass-card">
              {loading ? (
                <p className="quote-text">Caricamento citazione...</p>
              ) : (
                <>
                  <p className="quote-text">"{quoteData?.quote}"</p>
                  <p className="quote-author">— {quoteData?.author}</p>
                </>
              )}

              <button 
                className="btn-primary-action" 
                style={{ marginTop: '2rem' }}
                onClick={loadQuote} 
                disabled={loading}
              >
                {loading ? 'Caricamento...' : 'Nuova Citazione 🔄'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGINA MEDITAZIONE */}
      {activeTab === 'meditation' && <Timer />}
    </div>
  );
};

export default App;