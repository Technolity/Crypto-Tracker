import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CoinCard from './components/CoinCard';
import CoinChart from './components/CoinChart';
import SearchBar from './components/SearchBar';
import './App.css';

const App = () => {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [currency, setCurrency] = useState('usd');
  const chartRef = useRef(null);


      const getCurrencySymbol = (currency) => {
  const symbols = {
    'usd': '$',
    'eur': '€',
    'gbp': '£',
    'inr': '₹'
  };
  return symbols[currency] || '$';
};


  // Fetch top cryptocurrencies
useEffect(() => {
  fetchCoins();
  loadWatchlist();
}, [currency]);


const fetchCoins = async () => {
  try {
    setLoading(true);
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: currency,
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      }
    );
    
    setCoins(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching coins:', error);
    setLoading(false);
  }
};


const fetchCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: currency,
          days: 7
        }
      }
    );
    
    const coinData = coins.find(coin => coin.id === coinId);
    
    if (response.data && response.data.prices) {
      const chartData = response.data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: parseFloat(price.toFixed(6))
      }));

      setSelectedCoin({
        ...coinData,
        chartData: chartData
      });
      
      // Auto-scroll to chart after a short delay
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);
      
    }
  } catch (error) {
    console.error('Error fetching coin details:', error);
    
    // Set selectedCoin with error state
    const coinData = coins.find(coin => coin.id === coinId);
    setSelectedCoin({
      ...coinData,
      chartData: null,
      hasError: true
    });
    
    // Still scroll to show the error message
    setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 300);
  }
};



  const toggleWatchlist = (coinId) => {
    const newWatchlist = watchlist.includes(coinId)
      ? watchlist.filter(id => id !== coinId)
      : [...watchlist, coinId];
    
    setWatchlist(newWatchlist);
    localStorage.setItem('cryptoWatchlist', JSON.stringify(newWatchlist));
  };

  const loadWatchlist = () => {
    const saved = localStorage.getItem('cryptoWatchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cryptocurrency data...</p>
      </div>
    );
  }

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>


     <header className="app-header">
  <div className="header-content">
    <h1>₿🚀 Crypto Tracker</h1>

    <button 
      className="theme-toggle"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  </div>
  <p>Track real-time cryptocurrency prices</p>
</header>


<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

<div className="currency-selector">
  <select 
    value={currency} 
    onChange={(e) => setCurrency(e.target.value)}
    className="currency-dropdown"
  >
    <option value="usd">🇺🇸 USD ($)</option>
    <option value="eur">🇪🇺 EUR (€)</option>
    <option value="gbp">🇬🇧 GBP (£)</option>
    <option value="inr">🇮🇳 INR (₹)</option>
  </select>
</div>

<div className="main-content">
  <div className="coins-grid">

          {filteredCoins.map(coin => (
          <CoinCard
                key={coin.id}
                coin={coin}
                isWatchlisted={watchlist.includes(coin.id)}
                onToggleWatchlist={toggleWatchlist}
                onSelectCoin={fetchCoinDetails}
                currencySymbol={getCurrencySymbol(currency)}
          />

          ))}
        </div>

  {selectedCoin && (
  <div className="chart-section" ref={chartRef}>
    <CoinChart coin={selectedCoin} currencySymbol={getCurrencySymbol(currency)} />
  </div>
)}



      </div>
    </div>
  );
};

export default App;
