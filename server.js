const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Weather API (using Open-Meteo - no API key required)
app.get('/api/weather', async (req, res) => {
  try {
    const { lat = '40.7128', lon = '-74.0060' } = req.query; // Default to NYC
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// News API (using RSS to JSON service)
app.get('/api/news', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.bbci.co.uk/news/world/rss.xml'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('News API error:', error);
    res.status(500).json({ error: 'Failed to fetch news data' });
  }
});

// Quote of the day API
app.get('/api/quote', async (req, res) => {
  try {
    const response = await fetch('https://zenquotes.io/api/today');
    const data = await response.json();
    res.json(data[0]);
  } catch (error) {
    console.error('Quote API error:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Random cat fact API
app.get('/api/catfact', async (req, res) => {
  try {
    const response = await fetch('https://catfact.ninja/fact');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Cat fact API error:', error);
    res.status(500).json({ error: 'Failed to fetch cat fact' });
  }
});

// ISS Location API
app.get('/api/iss', async (req, res) => {
  try {
    const response = await fetch('http://api.open-notify.org/iss-now.json');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('ISS API error:', error);
    res.status(500).json({ error: 'Failed to fetch ISS location' });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dashboard server running on port ${PORT}`);
});
