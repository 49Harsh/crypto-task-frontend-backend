import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

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
      console.log(response.data);
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
    <div className="bg-gray-900 text-white min-h-screen">
      <header className="flex justify-between items-center p-4">
        <div className="text-3xl font-bold text-teal-400">HODLINFO</div>
        <div className="flex items-center space-x-4">
          <select className="bg-gray-800 p-2 rounded">
            <option>INR</option>
          </select>
          <select className="bg-gray-800 p-2 rounded">
            <option>BTC</option>
          </select>
          <button className="bg-teal-400 text-gray-900 px-4 py-2 rounded">BUY BTC</button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-teal-400 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center">57</div>
          <button className="bg-teal-400 text-gray-900 px-4 py-2 rounded flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
            Connect Telegram
          </button>
        </div>
      </header>

      <div className="flex justify-between items-center px-8 py-12">
        {Object.entries(percentChanges).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-2xl font-bold text-teal-400">{value}%</div>
            <div className="text-gray-400">{key}</div>
          </div>
        ))}
      </div>

      <div className="text-center mb-12">
        <h2 className="text-gray-400 text-xl mb-2">Best Price to Trade</h2>
        <div className="text-6xl font-bold mb-2">₹ {bestPrice.toLocaleString('en-IN')}</div>
        <p className="text-gray-400">Average BTC/INR net price including commission</p>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="text-gray-400">
            <th className="p-2">#</th>
            <th className="p-2">Platform</th>
            <th className="p-2">Last Traded Price</th>
            <th className="p-2">Buy / Sell Price</th>
            <th className="p-2">Difference</th>
            <th className="p-2">Savings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const difference = ((parseFloat(item.last) - bestPrice) / bestPrice * 100).toFixed(2);
            const savings = (parseFloat(item.last) - bestPrice).toFixed(2);
            return (
              <tr key={index} className="border-b border-gray-800">
                <td className="p-2 text-center">{index + 1}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">₹ {parseFloat(item.last).toLocaleString('en-IN')}</td>
                <td className="p-2">₹ {parseFloat(item.buy).toLocaleString('en-IN')} / ₹ {parseFloat(item.sell).toLocaleString('en-IN')}</td>
                <td className={`p-2 ${parseFloat(difference) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {parseFloat(difference) >= 0 ? <ArrowUpCircle className="inline mr-1" /> : <ArrowDownCircle className="inline mr-1" />}
                  {Math.abs(difference)}%
                </td>
                <td className={`p-2 ${parseFloat(savings) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹ {Math.abs(parseFloat(savings)).toLocaleString('en-IN')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <footer className="text-center pb-8">
        <button className="bg-gray-800 text-teal-400 px-6 py-2 rounded">
          Add hodlinfo to home screen
        </button>
      </footer>
    </div>
  );
};

export default CryptoPriceDashboard;