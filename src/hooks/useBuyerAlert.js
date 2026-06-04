import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function useBuyerAlert() {
  const [alertText, setAlertText] = useState("");
  const [alertLoading, setAlertLoading] = useState(true);

  useEffect(() => {
    async function fetchAlert() {
      try {
        const res = await fetch(`${API_BASE}/api/buyer/content/buyer_alert`);
        if (!res.ok) throw new Error("Failed to fetch alert");
        const data = await res.json();
        setAlertText(data.value || "");
      } catch (err) {
        console.error("useBuyerAlert:", err);
        setAlertText("");
      } finally {
        setAlertLoading(false);
      }
    }

    fetchAlert();
  }, []);

  return { alertText, alertLoading };
}
