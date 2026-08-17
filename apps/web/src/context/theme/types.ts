import { ThemePreference } from "@/types/theme";

export interface ArcThemeContext {
    theme: ThemePreference;
    setTheme: React.Dispatch<React.SetStateAction<ThemePreference>>;
    applyTheme: (theme: ThemePreference) => void;
    cycleTheme: () => void;
}

