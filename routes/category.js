var express = require('express');
var router = express.Router();
var upload = require("./multer");
var pgPool = require('./pool'); // Use PostgreSQL pool
const { default: axios } = require('axios');

router.post('/search', async function (req, res) {
  try {
    console.log('Request Body:', req.body);
    const { city, country } = req.body;

    if (!city || !country) {
      console.error("Error: Missing city or country", req.body);
      return res.status(400).json({ status: false, message: 'City and country are required' });
    }

    // const API_KEY = '2face7b7c13de7ad0b08359cd89b3e7e';
    const url = `https://api.weatherstack.com/current?access_key=dcfdb9fd46b1fd3d047e6eb4216876f4&query=${city},GB&units=m`;
    const response = await axios.get(url);
    const weatherData = response.data;

    console.log('Weather Data Fetched:', weatherData);

    // Save to PostgreSQL database
    const query = `
      INSERT INTO weather_reports (city, country, weather_data)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
    await pgPool.query(query, [city, country, JSON.stringify(weatherData)]);

    return res.status(200).json({
      status: true,
      message: 'Weather data fetched successfully!',
      data: weatherData,
    });
  } catch (error) {
    console.error('Error fetching weather:', error.response ? error.response.data : error.message);
    return res.status(400).json({
      status: false,
      message: error.response?.data?.message || 'Failed to fetch weather data. Check API key or endpoint.',
    });
  }
});

router.get('/get_weather_data', async function (req, res) {
  try {
    const { city, country } = req.query;

    if (!city || !country) {
      return res.status(400).json({ status: false, message: 'City and country are required' });
    }

    const query = `
      SELECT weather_data
      FROM weather_reports
      WHERE city = $1 AND country = $2
      ORDER BY fetch_date DESC
      LIMIT 1;
    `;
    const result = await pgPool.query(query, [city, country]);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: false, message: 'No weather data found for the given city and country' });
    }

    const weatherData = result.rows[0].weather_data; // JSON is automatically parsed by pg driver

    return res.status(200).json({
      status: true,
      message: 'Success!',
      data: weatherData,
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ status: false, message: 'Server error' });
  }
});

module.exports = router;