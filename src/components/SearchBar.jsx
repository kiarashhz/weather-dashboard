import { useEffect, useRef, useState } from "react";
import { apiGet } from "../services/apiClient";
import { geocodeCity } from "../services/weatherAPI";

export default function SearchBar({ onSelect }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef();

  useEffect(() => {
    if (!q.trim()) { setItems([]); return; }
    setLoading(true);
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController(); abortRef.current = ctrl;

    const id = setTimeout(async () => {
      try {
        const url = geocodeCity(q, 5);
        const data = await apiGet(url, { signal: ctrl.signal, ttl: 120000 });
        setItems(data.map(d => ({ label: `${d.name}${d.state?`, ${d.state}`:""} — ${d.country}`, name: d.name, country: d.country, lat: d.lat, lon: d.lon })));
      } catch (e) { if (e.name !== "AbortError") console.error(e); }
      finally { setLoading(false); }
    }, 350);

    return () => { clearTimeout(id); ctrl.abort(); };
  }, [q]);

  return (
    <div className="relative">
      <input
        className="w-full rounded-xl border px-4 py-2 outline-none focus:ring"
        placeholder="Search city..."
        value={q}
        onChange={(e)=>setQ(e.target.value)}
      />
      {loading && <div className="absolute right-3 top-2 text-xs">…</div>}
      {!!items.length && (
        <ul className="absolute z-10 mt-2 w-full rounded-xl border bg-gray-900 shadow">
          {items.map((it,i)=>(
            <li key={i} className="px-4 py-2 hover:bg-black cursor-pointer"
                onClick={()=>{ onSelect(it); setQ(""); setItems([]); }}>
              {it.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
