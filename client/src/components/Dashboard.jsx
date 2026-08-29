export default function Dashboard({
  notifications,
  onRefresh,
  onClearNotifications,
  loading,
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Notifications
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={onClearNotifications}
            disabled={loading || notifications.length === 0}
            className="text-sm text-red-600 hover:underline disabled:opacity-40 disabled:no-underline"
          >
            Clear
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((n) => (
            <li key={n._id} className="py-3">
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 font-medium hover:underline"
              >
                {n.title}
              </a>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                {n.category} &middot; {new Date(n.sentAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
