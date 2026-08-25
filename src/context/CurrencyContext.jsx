import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Approximate exchange rates relative to 1 KES (Base)
const RATES = {
  KES: 1,
  USD: 0.0077,  // 1 USD ≈ 130 KES
  EUR: 0.0071,  // 1 EUR ≈ 140 KES
  BTC: 0.00000012, // 1 BTC ≈ 8,300,000 KES
};

const SYMBOLS = {
  KES: 'KES ',
  USD: '$',
  EUR: '€',
  BTC: '₿',
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('preferred_currency') || 'KES';
  });

  useEffect(() => {
    localStorage.setItem('preferred_currency', currency);
  }, [currency]);

  const convert = (amountInKES) => amountInKES * RATES[currency];

  const format = (amountInKES) => {
    const converted = convert(amountInKES);
    const symbol = SYMBOLS[currency];
    
    if (currency === 'BTC') {
      return `${symbol}${converted.toFixed(8)}`;
    }
    return `${symbol}${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};