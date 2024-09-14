import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CryptoPriceDashboard.css'; // We'll create this CSS file for styling

const CryptoPriceDashboard = () => {
  const [data, setData] = useState([]);
  const [bestPrice, setBestPrice] = useState(0);
  const [percentChanges, setPercentChanges] = useState({ '5m': 0, '1h': 0, '1d': 0, '7d': 0 });

  useEffect(() => {
    fetchData();
    // Fetch data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/crypto-prices");
      setData(response.data);
      console.log(data)
      calculateBestPrice(response.data);
      // In a real scenario, you'd fetch or calculate these values
      setPercentChanges({ '5m': 0.1, '1h': 0.96, '1d': 2.73, '7d': 7.51 });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateBestPrice = (prices) => {
    const best = Math.max(...prices.map(item => parseFloat(item.last)));
    setBestPrice(best);
  };

  return (
    <div className="crypto-dashboard">
      <header>
        <div className="logo">HODLINFO</div>
        <div className="controls">
          <select><option>INR</option></select>
          <select><option>BTC</option></select>
          <button className="buy-btn">BUY BTC</button>
        </div>
        <div className="telegram-btn">
          <span>57</span>
          <button>Connect Telegram</button>
        </div>
      </header>
      
      <div className="percent-changes">
        <div className="change-item"><span>{percentChanges['5m']}%</span><span>5 Mins</span></div>
        <div className="change-item"><span>{percentChanges['1h']}%</span><span>1 Hour</span></div>
        <div className="best-price">
          <h2>Best Price to Trade</h2>
          <div className="price">₹ {bestPrice.toLocaleString('en-IN')}</div>
          <p>Average BTC/INR net price including commission</p>
        </div>
        <div className="change-item"><span>{percentChanges['1d']}%</span><span>1 Day</span></div>
        <div className="change-item"><span>{percentChanges['7d']}%</span><span>7 Days</span></div>
      </div>
      
      <table className="price-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Platform</th>
            <th>Last Traded Price</th>
            <th>Buy / Sell Price</th>
            <th>Difference</th>
            <th>Savings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const difference = ((parseFloat(item.last) - bestPrice) / bestPrice * 100).toFixed(2);
            const savings = (parseFloat(item.last) - bestPrice).toFixed(2);
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>₹ {parseFloat(item.last).toLocaleString('en-IN')}</td>
                <td>₹ {parseFloat(item.buy).toLocaleString('en-IN')} / ₹ {parseFloat(item.sell).toLocaleString('en-IN')}</td>
                <td className={difference > 0 ? 'positive' : 'negative'}>{difference}%</td>
                <td className={savings > 0 ? 'positive' : 'negative'}>₹ {Math.abs(savings).toLocaleString('en-IN')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <footer>
        <button className="add-btn">Add hodlinfo to home screen</button>
      </footer>
    </div>
  );
};

export default CryptoPriceDashboard;