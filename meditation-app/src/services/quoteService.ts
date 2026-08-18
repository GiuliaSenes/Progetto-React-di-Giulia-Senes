import axios from 'axios';

export interface Quote {
  quote: string;
  author: string;
}

export const fetchMeditationQuote = async (): Promise<Quote> => {
  try {
    // 1. Chiamata all'API originale in inglese
    const response = await axios.get('https://dummyjson.com/quotes/random');
    const englishQuote = response.data.quote;
    const author = response.data.author;

    // 2. Traduzione in italiano
    try {
      const translationResponse = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishQuote)}&langpair=en|it`
      );

      const translatedText = translationResponse.data?.responseData?.translatedText;

      if (translatedText && typeof translatedText === 'string') {
        return {
          quote: translatedText,
          author: author
        };
      }
    } catch (translationError) {
      console.warn('Traduzione fallita, uso testo originale:', translationError);
    }

    return {
      quote: englishQuote,
      author: author
    };

  } catch (error) {
    console.error('Errore durante il recupero della citazione:', error);
    return {
      quote: 'La pace viene da dentro. Non cercarla fuori.',
      author: 'Buddha'
    };
  }
};