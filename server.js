// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ CORS: Allow ONLY your GitHub Pages site
const corsOptions = {
  origin: [
    'https://ssrapo.github.io/weather/',
    'http://localhost:5500'            // For local development (optional)
  ],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Health check endpoint (optional but useful for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Proxy server is running' });
});

// ✅ Geocoding endpoint
app.get('/geo', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid query parameter "q"' });
    }

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${process.env.API_KEY}`;
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Geo error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: 'Geocoding failed' });
    }
    res.status(500).json({ error: 'Geocoding service unavailable' });
  }
});

// ✅ Current weather endpoint
app.get('/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing required parameters: lat, lon' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Weather error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: 'Weather data unavailable' });
    }
    res.status(500).json({ error: 'Weather service unavailable' });
  }
});

// ✅ 5-day forecast endpoint
app.get('/forecast', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing required parameters: lat, lon' });
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;
    const response = await axios.get(url, { timeout: 10000 });
    res.json(response.data);
  } catch (error) {
    console.error('Forecast error:', error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: 'Forecast data unavailable' });
    }
    res.status(500).json({ error: 'Forecast service unavailable' });
  }
});

// ✅ Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
  console.log(`🌐 CORS allowed origins: ${corsOptions.origin.join(', ')}`);
});
