// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for your GitHub Pages site
app.use(cors({
  origin: ['https://ssrapo.github.io/weather/'] // Add your GH Pages URL
}));

// Proxy endpoint for current weather
app.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon required' });
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Weather error:', error.message);
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

// Proxy endpoint for geocoding
app.get('/geo', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'q (city name) required' });
    }
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${process.env.API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Geo error:', error.message);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// Proxy endpoint for forecast
app.get('/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon required' });
    }
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Forecast error:', error.message);
    res.status(500).json({ error: 'Forecast fetch failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});