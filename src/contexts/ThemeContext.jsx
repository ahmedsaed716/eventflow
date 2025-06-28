// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const THEME_KEY = "app-theme";
const THEMES = {
  light: "light",
  dark: "dark",
};

const ACCENT_COLORS = {
  blue: "#2563EB",
  amber: "#F59E0B",
  emerald: "#10B981",
  purple: "#8B5CF6",
  rose: "#F43F5E",
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(THEMES.light);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS.blue);
  const [useSystemTheme, setUseSystemTheme] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize theme from localStorage and system preferences
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      const savedSettings = savedTheme ? JSON.parse(savedTheme) : null;

      if (savedSettings) {
        setTheme(savedSettings.theme || THEMES.light);
        setAccentColor(savedSettings.accentColor || ACCENT_COLORS.blue);
        setUseSystemTheme(savedSettings.useSystemTheme || false);
        setIsHighContrast(savedSettings.isHighContrast || false);
        setReducedMotion(savedSettings.reducedMotion || false);
      }

      // Check system theme preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!savedSettings?.useSystemTheme) {
        setTheme(savedSettings?.theme || (prefersDark ? THEMES.dark : THEMES.light));
      } else {
        setTheme(prefersDark ? THEMES.dark : THEMES.light);
      }

      setReducedMotion(prefersReducedMotion);
    } catch (error) {
      console.warn("Failed to load theme settings:", error);
      setTheme(THEMES.light);
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;
    
    // Apply theme class
    root.classList.remove(THEMES.light, THEMES.dark);
    root.classList.add(theme);

    // Apply high contrast
    if (isHighContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply reduced motion
    if (reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    // Apply accent color as CSS custom property
    root.style.setProperty("--accent-color", accentColor);
  }, [theme, accentColor, isHighContrast, reducedMotion, loading]);

  // Listen for system theme changes
  useEffect(() => {
    if (!useSystemTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      setTheme(e.matches ? THEMES.dark : THEMES.light);
    };

    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [useSystemTheme]);

  // Save theme settings to localStorage
  const saveThemeSettings = (settings) => {
    try {
      const themeSettings = {
        theme: settings.theme || theme,
        accentColor: settings.accentColor || accentColor,
        useSystemTheme: settings.useSystemTheme !== undefined ? settings.useSystemTheme : useSystemTheme,
        isHighContrast: settings.isHighContrast !== undefined ? settings.isHighContrast : isHighContrast,
        reducedMotion: settings.reducedMotion !== undefined ? settings.reducedMotion : reducedMotion,
      };
      
      localStorage.setItem(THEME_KEY, JSON.stringify(themeSettings));
    } catch (error) {
      console.warn("Failed to save theme settings:", error);
    }
  };

  // Change theme
  const changeTheme = (newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) return;
    
    setTheme(newTheme);
    setUseSystemTheme(false);
    saveThemeSettings({ theme: newTheme, useSystemTheme: false });
  };

  // Change accent color
  const changeAccentColor = (color) => {
    setAccentColor(color);
    saveThemeSettings({ accentColor: color });
  };

  // Toggle system theme detection
  const toggleSystemTheme = (enabled) => {
    setUseSystemTheme(enabled);
    
    if (enabled) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? THEMES.dark : THEMES.light);
    }
    
    saveThemeSettings({ useSystemTheme: enabled });
  };

  // Toggle high contrast
  const toggleHighContrast = (enabled) => {
    setIsHighContrast(enabled);
    saveThemeSettings({ isHighContrast: enabled });
  };

  // Toggle reduced motion
  const toggleReducedMotion = (enabled) => {
    setReducedMotion(enabled);
    saveThemeSettings({ reducedMotion: enabled });
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setTheme(THEMES.light);
    setAccentColor(ACCENT_COLORS.blue);
    setUseSystemTheme(false);
    setIsHighContrast(false);
    setReducedMotion(false);
    
    try {
      localStorage.removeItem(THEME_KEY);
    } catch (error) {
      console.warn("Failed to clear theme settings:", error);
    }
  };

  const value = {
    // Current state
    theme,
    accentColor,
    useSystemTheme,
    isHighContrast,
    reducedMotion,
    loading,
    
    // Available options
    themes: THEMES,
    accentColors: ACCENT_COLORS,
    
    // Theme management functions
    changeTheme,
    changeAccentColor,
    toggleSystemTheme,
    toggleHighContrast,
    toggleReducedMotion,
    resetToDefaults,
    
    // Utility functions
    isDark: theme === THEMES.dark,
    isLight: theme === THEMES.light,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;