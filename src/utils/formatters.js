export function cToF(c){ return (c * 9/5) + 32; }
export function mpsToMph(m){ return m * 2.236936; }

export function formatTemp(v, unit){ // unit: 'C' | 'F'
  if (v == null) return "—";
  const n = unit === 'F' ? cToF(v) : v;
  return Math.round(n);
}

export function groupForecastToDays(list) {
  // ورودی: forecast 3h list — خروجی: آرایه‌ای از روزها با min/max و آیکون غالب و POP میانگین
  const byDay = {};
  for (const it of list) {
    const d = it.dt_txt.split(" ")[0]; // YYYY-MM-DD
    byDay[d] ||= { temps: [], icons: {}, pop: [], wind: [] };
    byDay[d].temps.push(it.main.temp);
    byDay[d].pop.push(it.pop ?? 0);
    byDay[d].wind.push(it.wind?.speed ?? 0);
    const ic = it.weather?.[0]?.icon;
    if (ic) byDay[d].icons[ic] = (byDay[d].icons[ic]||0)+1;
  }
  const days = Object.entries(byDay).map(([date, v]) => {
    const min = Math.min(...v.temps);
    const max = Math.max(...v.temps);
    // شایع‌ترین آیکون
    const icon = Object.entries(v.icons).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? null;
    const popAvg = Math.round((v.pop.reduce((a,b)=>a+b,0)/v.pop.length) * 100);
    const windAvg = v.wind.reduce((a,b)=>a+b,0)/v.wind.length;
    return { date, min, max, icon, pop: popAvg, windAvg };
  });
  // فقط 5–7 روز بعدی
  return days.slice(0, 6);
}

export function formatDateShort(dateStr){
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
