import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { groupForecastToDays, formatDateShort, formatTemp } from "../utils/formatters";
import { usePrefs } from "../context/PrefsContext";
import { memo, useMemo } from "react";

function TemperatureTrendChart({ forecast }) {
  const { unit } = usePrefs();
  const data = useMemo(() => {
    if (!forecast?.list?.length) return [];
    return groupForecastToDays(forecast.list).map(d => ({
      date: formatDateShort(d.date),
      min: formatTemp(d.min, unit),
      max: formatTemp(d.max, unit),
    }));
  }, [forecast?.list, unit]);

  if (!data.length) return null;

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="max" dot={false} />
          <Line type="monotone" dataKey="min" strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default memo(TemperatureTrendChart);
