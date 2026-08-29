import { useState } from "react";

const CATEGORIES = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

export default function SubscribeForm({
  email,
  setEmail,
  categories,
  setCategories,
  frequency,
  setFrequency,
  onSubscribe,
  onUnsubscribe,
  loading,
}) {
  const [localEmail, setLocalEmail] = useState(email);

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Manage Your News Alerts
      </h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        value={localEmail}
        onChange={(e) => setLocalEmail(e.target.value)}
        onBlur={() => setEmail(localEmail)}
        placeholder="you@example.com"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Categories
      </label>
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`px-3 py-1 rounded-full text-sm border capitalize ${
              categories.includes(cat)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Alert Frequency
      </label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="immediate">Immediate</option>
        <option value="hourly">Hourly</option>
        <option value="daily">Daily</option>
      </select>

      <div className="flex gap-3">
        <button
          onClick={() => onSubscribe(localEmail)}
          disabled={loading || !localEmail}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Save / Subscribe
        </button>
        <button
          onClick={() => onUnsubscribe(localEmail)}
          disabled={loading || !localEmail}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Unsubscribe
        </button>
      </div>
    </div>
  );
}
