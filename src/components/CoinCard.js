import React from 'react';

const CoinCard = ({ coin, isWatchlisted, onToggleWatchlist, onSelectCoin, currencySymbol }) => {

  const {
    id,
    name,
    symbol,
    current_price,
    price_change_percentage_24h,
    market_cap,
    image
  } = coin;

  const priceChangeClass = price_change_percentage_24h >= 0 ? 'positive' : 'negative';

  return (
    <div className="coin-card" onClick={() => onSelectCoin(id)}>
      <div className="coin-header">
        <img src={image} alt={name} className="coin-image" />
        <div className="coin-info">
          <h3>{name}</h3>
          <span className="coin-symbol">{symbol.toUpperCase()}</span>
        </div>
        <button
          className={`watchlist-btn ${isWatchlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(id);
          }}
        >
          {isWatchlisted ? '⭐' : '☆'}
        </button>
      </div>

      <div className="coin-price">
        <h2>{currencySymbol}{current_price?.toLocaleString()}</h2>

        <span className={`price-change ${priceChangeClass}`}>
          {price_change_percentage_24h?.toFixed(2)}%
        </span>
      </div>

      <div className="coin-stats">
        <div className="stat">
          <span className="stat-label">Market Cap</span>
          <span className="stat-value">
                 {currencySymbol}{(market_cap / 1e9).toFixed(2)}B
         </span>

        </div>
      </div>
    </div>
  );
};

export default CoinCard;
