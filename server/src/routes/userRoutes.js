const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/Notification");

// Subscribe (create user) or update an existing subscription
router.post("/subscribe", async (req, res) => {
  try {
    const { email, categories, frequency } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        email: email.toLowerCase(),
        categories: categories && categories.length ? categories : ["general"],
        frequency: frequency || "daily",
        subscribed: true,
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a user's current preferences
router.get("/preferences/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update preferences (categories / frequency)
router.put("/preferences/:email", async (req, res) => {
  try {
    const { categories, frequency } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.params.email.toLowerCase() },
      { ...(categories && { categories }), ...(frequency && { frequency }) },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unsubscribe
router.post("/unsubscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { subscribed: false },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Notification history for a user
router.get("/notifications/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const notifications = await Notification.find({ user: user._id })
      .sort({ sentAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Clear all notifications for a user
router.delete("/notifications/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const result = await Notification.deleteMany({ user: user._id });
    res.json({
      message: "Notifications cleared",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
