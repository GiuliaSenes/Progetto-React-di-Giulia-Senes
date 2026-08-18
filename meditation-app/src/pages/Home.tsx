import React, { useEffect, useState } from 'react';
import { fetchMeditationQuote,type Quote } from '../services/quoteService';

export const Home: React.FC = () => {
  // Stato per salvare la citazione scaricata
  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  
  // Stato per mostrare un indicatore di caricamento
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Chiamata al servizio Axios quando la pagina viene montata
    fetchMeditationQuote().then((data) => {
      setQuoteData(data);
      setLoading(false); // Disattiva il caricamento appena arrivano i dati
    });
  }, []); // Array vuoto = viene eseguito solo una volta all'avvio della pagina

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Benvenuto nella tua Oasi di Pace 🧘‍♀️</h1>
      <p style={{ color: '#666', fontSize: '1.1rem' }}>
        Prenditi un momento per respirare e ritrovare l'equilibrio interiore.
      </p>

      {/* Card per la Citazione Motivazionale */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        borderLeft: '4px solid #0284c7',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#0369a1' }}>Pensiero del Giorno 💡</h3>
        
        {loading ? (
          <p style={{ fontStyle: 'italic', color: '#888' }}>Caricamento citazione...</p>
        ) : (
          <blockquote>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#334155' }}>
              "{quoteData?.quote}"
            </p>
            <footer style={{ fontWeight: 'bold', color: '#64748b', marginTop: '0.5rem' }}>
              — {quoteData?.author}
            </footer>
          </blockquote>
        )}
      </div>
    </div>
  );
};