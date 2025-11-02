import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme(next)}
      className="rounded-xl border px-3 py-1 text-sm bg-white dark:bg-gray-800 dark:text-gray-100"
      title="Toggle theme"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
