import { useEffect, useState } from "react";
export function useGeolocation(enabled=false) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;
    const onOk = (p) => setCoords({ lat: p.coords.latitude, lon: p.coords.longitude });
    const onErr = (e) => setError(e?.message || "Geolocation error");
    navigator.geolocation.getCurrentPosition(onOk, onErr, { timeout: 8000, maximumAge: 10_000 });
  }, [enabled]);
  return { coords, error };
}
