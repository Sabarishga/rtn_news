const cron = require('node-cron');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { fetchNewsByCategory } = require('../services/newsService');
const { sendNewsAlertEmail } = require('../services/emailService');

const FREQUENCY_MS = {
  immediate: 0,
  hourly: 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
};

// Checks each subscribed user and sends alerts if their frequency interval has elapsed.
const runNewsAlertCheck = async () => {
  const users = await User.find({ subscribed: true });

  for (const user of users) {
    const interval = FREQUENCY_MS[user.frequency];
    const due =
      !user.lastSentAt || Date.now() - new Date(user.lastSentAt).getTime() >= interval;

    if (!due) continue;

    let articles = [];
    for (const category of user.categories) {
      const categoryArticles = await fetchNewsByCategory(category);
      articles = articles.concat(
        categoryArticles.map((a) => ({ ...a, category }))
      );
    }

    if (!articles.length) continue;

    // Save to notification history
    const notifications = articles.map((a) => ({
      user: user._id,
      title: a.title,
      description: a.description,
      url: a.url,
      category: a.category,
    }));
    await Notification.insertMany(notifications);

    await sendNewsAlertEmail(user.email, articles);

    user.lastSentAt = new Date();
    await user.save();
  }
};

// Runs the check every 15 minutes; each user is only actually alerted once their
// own frequency preference (immediate/hourly/daily) has elapsed.
const startNewsAlertJob = () => {
  cron.schedule('*/15 * * * *', () => {
    console.log('Running news alert check...');
    runNewsAlertCheck().catch((err) => console.error('News alert job failed:', err.message));
  });
};

module.exports = { startNewsAlertJob, runNewsAlertCheck };
