import { formatDateShort, formatTemp, groupForecastToDays } from "../utils/formatters";
import { usePrefs } from "../context/PrefsContext";
import { memo } from "react";

function ForecastList({ forecast }) {
  const { unit } = usePrefs();
  if (!forecast?.list?.length) return null;

  const days = groupForecastToDays(forecast.list);

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {days.map(d => (
        <div key={d.date} className="rounded-2xl border bg-white p-3 text-center">
          <div className="text-xs text-gray-700">{formatDateShort(d.date)}</div>
          {d.icon && <img alt="" src={`https://openweathermap.org/img/wn/${d.icon}.png`} className="mx-auto h-10 w-10" />}
          <div className="mt-1 text-gray-500 font-semibold">{formatTemp(d.max, unit)}° / {formatTemp(d.min, unit)}°</div>
          <div className="text-xs text-blue-700 mt-1">POP: {d.pop}%</div>
        </div>
      ))}
    </div>
  );
}
export default memo(ForecastList);
