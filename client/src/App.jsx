import { useState } from "react";
import SubscribeForm from "./components/SubscribeForm";
import Dashboard from "./components/Dashboard";
import {
  subscribe,
  unsubscribe,
  getNotifications,
  clearNotifications,
} from "./api";

function App() {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState(["general"]);
  const [frequency, setFrequency] = useState("daily");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (targetEmail) => {
    setLoading(true);
    setMessage("");
    try {
      await subscribe(targetEmail, categories, frequency);
      setEmail(targetEmail);
      setMessage(
        "Subscribed! You will receive alerts based on your preferences.",
      );
      const data = await getNotifications(targetEmail);
      setNotifications(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (targetEmail) => {
    setLoading(true);
    setMessage("");
    try {
      await unsubscribe(targetEmail);
      setMessage("You have been unsubscribed.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const data = await getNotifications(email);
      setNotifications(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearNotifications = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await clearNotifications(email);
      setNotifications([]);
      setMessage("Notifications cleared.");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Real-Time News Alerts
      </h1>

      {message && (
        <p className="max-w-xl mx-auto text-center text-sm text-blue-700 mb-4">
          {message}
        </p>
      )}

      <SubscribeForm
        email={email}
        setEmail={setEmail}
        categories={categories}
        setCategories={setCategories}
        frequency={frequency}
        setFrequency={setFrequency}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
        loading={loading}
      />

      <Dashboard
        notifications={notifications}
        onRefresh={handleRefresh}
        onClearNotifications={handleClearNotifications}
        loading={loading}
      />
    </div>
  );
}

export default App;
