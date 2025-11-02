import { usePrefs } from "../context/PrefsContext";

export default function UnitToggle(){
  const { unit, setUnit } = usePrefs();
  return (
    <button
      className="rounded-xl border px-3 py-1 text-sm bg-white hover:bg-gray-50"
      onClick={()=> setUnit(unit === 'C' ? 'F' : 'C')}
      aria-label="Toggle temperature unit"
      title="Toggle °C/°F"
    >
      °{unit} ▾
    </button>
  );
}
