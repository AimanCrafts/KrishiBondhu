import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function useMarketListings({ limit = 4 } = {}) {
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const token = localStorage.getItem("kb_token");
        const res = await fetch(
          `${API_BASE}/api/buyer/marketplace?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error("Failed to fetch listings");
        const data = await res.json();
        setListings(data.listings || []);
      } catch (err) {
        console.error("useMarketListings:", err);
        setListingsError(err.message);
      } finally {
        setListingsLoading(false);
      }
    }

    fetchListings();
  }, [limit]);

  return { listings, listingsLoading, listingsError };
}
