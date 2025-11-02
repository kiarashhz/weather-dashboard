const BASE = "https://api.openweathermap.org";
const KEY = import.meta.env.VITE_WEATHER_API_KEY;
const withKey = (u) => `${u}${u.includes("?") ? "&" : "?"}appid=${KEY}&units=metric`;

export const geocodeCity   = (q, limit=5) => withKey(`${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=${limit}`);
export const currentByCity = (q)         => withKey(`${BASE}/data/2.5/weather?q=${encodeURIComponent(q)}`);
export const currentByLatLon = (lat,lon) => withKey(`${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}`);
export const forecast5dByCity = (q)        => withKey(`${BASE}/data/2.5/forecast?q=${encodeURIComponent(q)}`);
