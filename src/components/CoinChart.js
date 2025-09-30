import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CoinChart = ({ coin, currencySymbol = '$' }) => {
 if (!coin) {
  return null;
}

if (coin.hasError || !coin.chartData || coin.chartData.length === 0) {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>{coin.name} Price Information</h2>
        <div className="current-price">
          <span className="price">{currencySymbol}{coin.current_price?.toLocaleString()}</span>
          <span className={`change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="chart-error">
        <h3>📈 Chart temporarily unavailable</h3>
        <p>Price data for {coin.name} is shown above. Chart will load when API limit resets.</p>
        <div className="coin-stats-detailed">
          <div className="stat-item">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">{currencySymbol}{(coin.market_cap / 1e9).toFixed(2)}B</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">24h Volume</span>
            <span className="stat-value">{currencySymbol}{(coin.total_volume / 1e6).toFixed(2)}M</span>
          </div>
        </div>
      </div>
    </div>
  );
}


  const priceChangeClass = coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';

  const formatPrice = (value) => {
    const num = parseFloat(value);
    if (num >= 1) {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      });
    } else {
      return num.toFixed(8);
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>{coin.name} Price Chart (7 Days)</h2>
        <div className="current-price">
          <span className="price">{currencySymbol}{formatPrice(coin.current_price)}</span>
          <span className={`change ${priceChangeClass}`}>
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={coin.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            stroke="rgba(255,255,255,0.7)"
            fontSize={12}
            tickFormatter={(value) => `${currencySymbol}${formatPrice(value)}`}
          />
          <Tooltip
            formatter={(value) => [`${currencySymbol}${formatPrice(value)}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: 'rgba(20, 20, 20, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={coin.price_change_percentage_24h >= 0 ? '#00ff88' : '#ff4757'}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#f7931e' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoinChart;
