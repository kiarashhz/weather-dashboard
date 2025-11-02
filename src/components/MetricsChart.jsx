import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip } from "recharts";
import { memo, useMemo } from "react";
import { usePrefs } from "../context/PrefsContext";
import { groupForecastToDays } from "../utils/formatters";

function avg(nums){ return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0; }

function MetricsChart({ forecast }) {
  const { unit } = usePrefs();

  const data = useMemo(() => {
    if (!forecast?.list?.length) return [];
    // از list خام، میانگین humidity/pressure هر روز را حساب کن
    const byDay = {};
    for (const it of forecast.list) {
      const d = it.dt_txt.split(" ")[0];
      (byDay[d] ||= { humidity: [], pressure: [], wind: [] }).humidity.push(it.main?.humidity ?? 0);
      byDay[d].pressure.push(it.main?.pressure ?? 0);
      byDay[d].wind.push(it.wind?.speed ?? 0);
    }
    return Object.entries(byDay).slice(0, 6).map(([date, v]) => ({
      date: date.slice(5), // MM-DD
      humidityAvg: Math.round(avg(v.humidity)),
      windAvg: Math.round(avg(v.wind) * (unit === "F" ? 2.236936 : 1)), // mph اگر F
      pressureAvg: Math.round(avg(v.pressure)),
    }));
  }, [forecast?.list, unit]);

  if (!data.length) return null;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="humidityAvg" />
          <Line type="monotone" dataKey="windAvg" strokeDasharray="3 3" dot={false} />
          <Line type="monotone" dataKey="pressureAvg" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
export default memo(MetricsChart);
