require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { startNewsAlertJob } = require('./jobs/newsJob');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('News Alert API is running');
});

startNewsAlertJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
