import { useCallback, useEffect, useState } from "react";
import { apiGet } from "../services/apiClient";
import {
  currentByCity,
  currentByLatLon,
  forecast5dByCity,
} from "../services/weatherAPI";
import { formatTemp, mpsToMph } from "../utils/formatters";
import { usePrefs } from "../context/PrefsContext";
import ForecastList from "./ForecastList";
import TemperatureTrendChart from "./TemperatureTrendChart";
import MetricsChart from "./MetricsChart";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import { memo } from "react";
import StarBorder from "./StarBorder";

function CityCard({ city, coords }) {
  const [now, setNow] = useState(null);
  const [fc, setFc] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const { unit } = usePrefs();

  const reload = useCallback(
    async (signal) => {
      const urlNow = city
        ? currentByCity(city)
        : coords
        ? currentByLatLon(coords.lat, coords.lon)
        : null;

      if (!urlNow) return;

      const [nowData, fcData] = await Promise.all([
        apiGet(urlNow, { signal, ttl: 0 }),
        city
          ? apiGet(forecast5dByCity(city), { signal, ttl: 0 })
          : Promise.resolve(null),
      ]);

      setNow(nowData);
      setFc(fcData);
    },
    [city, coords?.lat, coords?.lon]
  );

  useAutoRefresh(() => reload(), 1 * 60_000, true);

  useEffect(() => {
    let active = true;
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        await reload(ctrl.signal);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      ctrl.abort();
    };
  }, [reload]);

  if (loading)
    return (
      <div className="rounded-2xl border p-4 animate-pulse bg-white dark:bg-gray-800">
        Loading…
      </div>
    );
  if (err)
    return (
      <div className="rounded-2xl border p-4 text-red-600 bg-white dark:bg-gray-800">
        Error: {err}
      </div>
    );
  if (!now) return null;

  const icon = now.weather?.[0]?.icon;
  const cond = now.weather?.[0]?.main ?? "—";
  const temp = formatTemp(now.main?.temp, unit);
  const feels = formatTemp(now.main?.feels_like, unit);
  const wind =
    unit === "F"
      ? `${mpsToMph(now.wind?.speed ?? 0).toFixed(1)} mph`
      : `${now.wind?.speed ?? 0} m/s`;

  // --- 6) UI
  return (
    <div className="rounded-2xl border p-5 shadow-sm bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {now.name}, {now.sys?.country}
        </h3>
        {icon && (
          <img
            alt={cond}
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            className="h-12 w-12"
          />
        )}
      </div>

      <div className="mt-3 text-4xl font-bold text-gray-900 dark:text-gray-100">
        {temp}°{" "}
        <span className="text-base text-gray-500 dark:text-gray-300 ml-2">
          {cond}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-800 dark:text-gray-200">
        <div>
          Feels: <b>{feels}°</b>
        </div>
        <div>
          Humidity: <b>{now.main?.humidity}%</b>
        </div>
        <div>
          Wind: <b>{wind}</b>
        </div>
        <div>
          Visibility: <b>{(now.visibility ?? 0) / 1000} km</b>
        </div>
        <div>
          Sunrise:{" "}
          <b>{new Date((now.sys?.sunrise ?? 0) * 1000).toLocaleTimeString()}</b>
        </div>
        <div>
          Sunset:{" "}
          <b>{new Date((now.sys?.sunset ?? 0) * 1000).toLocaleTimeString()}</b>
        </div>
      </div>

      {fc && (
        <>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Next days
          </div>
          <ForecastList forecast={fc} />

          <div className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
            Temperature trend
          </div>
          <TemperatureTrendChart forecast={fc} />

          <div className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
            Metrics
          </div>
          <MetricsChart forecast={fc} />
        </>
      )}
    </div>
  );
}
export default memo(CityCard);
