// src/components/NotificationBell.jsx
// Import and use in farmer_dashboard.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationBell.css";

const API = "http://localhost:5000/api";

const TYPE_ICON = {
  new_crop: { icon: "fa-seedling", color: "#16a34a" },
  new_disease: { icon: "fa-virus", color: "#dc2626" },
  status_change: { icon: "fa-circle-check", color: "#2563eb" },
  alert: { icon: "fa-triangle-exclamation", color: "#d97706" },
  general: { icon: "fa-bell", color: "#6b7280" },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("kb_token");

  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page load
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) fetchNotifications(); // fetch fresh data when opening
  };

  const handleNotifClick = async (notif) => {
    // Mark as read
    if (!notif.isRead) {
      try {
        await fetch(`${API}/notifications/${notif._id}/read`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        /* silent */
      }
    }

    // Navigate
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* silent */
    }
  };

  return (
    <div className="nb-wrap" ref={dropdownRef}>
      {/* Bell Button */}
      <button className="nb-btn" onClick={handleOpen} title="Notifications">
        <i className="fa-regular fa-bell" />
        {unreadCount > 0 && (
          <span className="nb-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="nb-dropdown">
          {/* Header */}
          <div className="nb-header">
            <div className="nb-header-title">
              <i className="fa-solid fa-bell" /> Notifications
              {unreadCount > 0 && (
                <span className="nb-header-count">{unreadCount} unread</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button className="nb-mark-all" onClick={handleMarkAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="nb-list">
            {loading ? (
              <div className="nb-loading">
                <i className="fa-solid fa-spinner fa-spin" /> Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="nb-empty">
                <i className="fa-regular fa-bell-slash" />
                <p>No notifications available</p>
              </div>
            ) : (
              notifications.map((n) => {
                const meta = TYPE_ICON[n.type] || TYPE_ICON.general;
                return (
                  <div
                    key={n._id}
                    className={`nb-item ${!n.isRead ? "nb-unread" : ""}`}
                    onClick={() => handleNotifClick(n)}
                  >
                    <div
                      className="nb-item-icon"
                      style={{
                        background: meta.color + "18",
                        color: meta.color,
                      }}
                    >
                      <i className={`fa-solid ${meta.icon}`} />
                    </div>
                    <div className="nb-item-body">
                      <div className="nb-item-title">{n.title}</div>
                      <div className="nb-item-msg">{n.message}</div>
                      <div className="nb-item-time">{timeAgo(n.createdAt)}</div>
                    </div>
                    {!n.isRead && <div className="nb-unread-dot" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
