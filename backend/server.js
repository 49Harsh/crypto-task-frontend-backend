const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors')



const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

mongoose.connect('mongodb://localhost:27017/crypto_prices');

const PriceSchema = new mongoose.Schema({
  name: String,
  last: String,
  buy: String,
  sell: String,
  volume: String,
  base_unit: String
});

const Price = mongoose.model('Price', PriceSchema);

app.get('/api/crypto-prices', async (req, res) => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10);

    await Price.deleteMany({});
    await Price.insertMany(tickers.map(ticker => ({
      name: ticker.name,
      last: ticker.last,
      buy: ticker.buy,
      sell: ticker.sell,
      volume: ticker.volume,
      base_unit: ticker.base_unit
    })));

    const storedPrices = await Price.find();
    res.json(storedPrices);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});