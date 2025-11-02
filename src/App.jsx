import { useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import CityCard from "./components/CityCard";
import UnitToggle from "./components/UnitToggle";
import ThemeToggle from "./components/ThemeToggle";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useGeolocation } from "./hooks/useGeolocation";
import { PrefsContext } from "./context/PrefsContext";
import { ThemeContext } from "./context/ThemeContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./index.css";
import GradientText from "./components/GradientText";

export default function App() {
  const [cities, setCities] = useLocalStorage("wd:cities", []);
  const [askedGeo, setAskedGeo] = useLocalStorage("wd:askedGeo", false);
  const [unit, setUnit] = useLocalStorage("wd:unit", "C");
  const [theme, setTheme] = useLocalStorage("wd:theme", "light");
  const { coords } = useGeolocation(!askedGeo);

  useEffect(() => {
    if (!askedGeo) setAskedGeo(true);
  }, [askedGeo, setAskedGeo]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const addCity = useCallback(
    (it) => {
      const label = it.name;
      setCities((prev) =>
        (prev.includes(label) ? prev : [label, ...prev]).slice(0, 5)
      );
    },
    [setCities]
  );

  const removeCity = useCallback(
    (label) => {
      setCities((prev) => prev.filter((c) => c !== label));
    },
    [setCities]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <PrefsContext.Provider value={{ unit, setUnit }}>
        <div className="min-h-screen bg-gray-900 dark:bg-gray-100">
          <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800 backdrop-blur border-b">
            <div className="mx-auto max-w-none p-4 flex items-center gap-4">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="text-3xl sm:text-4xl font-extrabold leading-tight"
              >
                Weather Dashboard
              </GradientText>
              <div className="ml-auto flex items-center gap-3">
                <div className="w-64">
                  <SearchBar onSelect={addCity} />
                </div>
                <UnitToggle />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-none p-4">
            {cities.length === 0 && !coords && (
              <div className="rounded-2xl border bg-white dark:bg-gray-800 p-6 text-gray-600 dark:text-gray-200">
                هیچ شهری اضافه نشده؛ از بالا سرچ کن یا موقعیت مکانی رو فعال کن
                تا شهرت رو پیشنهاد بدم.
              </div>
            )}

            <DragDropContext
              onDragEnd={(result) => {
                const { source, destination } = result;
                if (!destination || source.index === destination.index) return;
                const next = [...cities];
                const [moved] = next.splice(source.index, 1);
                next.splice(destination.index, 0, moved);
                setCities(next);
              }}
            >
              <Droppable droppableId="cities">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {coords && (
                      <div className="relative">
                        <CityCard coords={coords} />
                      </div>
                    )}

                    {cities.map((city, idx) => (
                      <Draggable key={city} draggableId={city} index={idx}>
                        {(pp) => (
                          <div
                            ref={pp.innerRef}
                            {...pp.draggableProps}
                            {...pp.dragHandleProps}
                            className="relative"
                          >
                            <button
                              className="absolute right-1 top-1 h-4 w-4 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-[10px]"
                              onClick={() => removeCity(city)}
                              aria-label="Remove"
                            >
                              ✕
                            </button>
                            <CityCard city={city} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </main>
        </div>
      </PrefsContext.Provider>
    </ThemeContext.Provider>
  );
}
