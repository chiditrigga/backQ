const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;


app.set('trust proxy', true);

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Visitor';


  const clientIp = req.ip 

  try {
    const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    const { city, country_name } = geoResponse.data;

    if (!city || !country_name) {
      throw new Error('Invalid location data');
    }

    // Fetch weather information based on the city
    const weatherApiKey = '0ce2bb03697e4f0dbae74642240207';
    const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`;
    console.log(`Fetching weather info for city: ${city}`);
    const weatherResponse = await axios.get(weatherApiUrl);
    const temperature = weatherResponse.data.current.temp_c;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
    });
  } catch (error) {
    console.error('Error fetching data:', error.message || error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


 





// const express = require('express');
// const axios = require('axios');
// const app = express();
// const port = process.env.PORT || 3000;

// app.get('/api/hello', async (req, res) => {
//   const visitorName = req.query.visitor_name;

//   // Fetch IP and location
//   const ip = req.ip; // This will give the IP address of the requester
//   const location = "New York"; // Simplifying to a static location for now

//   // Fetch weather information
//   const weatherApiKey = 'YOUR_WEATHER_API_KEY'; // You need to sign up for a weather API and get the API key
//   const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${location}`;

//   try {
//     const weatherResponse = await axios.get(weatherApiUrl);
//     const temperature = weatherResponse.data.current.temp_c;

//     res.json({
//       client_ip: ip,
//       location: location,
//       greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch weather data' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
