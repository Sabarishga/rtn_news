const axios = require('axios');

// Fetches top headlines for a given category from NewsAPI.org
const fetchNewsByCategory = async (category) => {
  try {
    const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category,
        language: 'en',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY,
      },
    });
    return data.articles || [];
  } catch (err) {
    console.error(`Failed to fetch news for category "${category}":`, err.message);
    return [];
  }
};

module.exports = { fetchNewsByCategory };
