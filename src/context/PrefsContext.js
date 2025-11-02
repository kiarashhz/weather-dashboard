import { createContext, useContext } from "react";
export const PrefsContext = createContext({ unit: 'C', setUnit: () => {} });
export function usePrefs(){ return useContext(PrefsContext); }
