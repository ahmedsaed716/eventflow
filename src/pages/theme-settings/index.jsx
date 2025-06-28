// src/pages/theme-settings/index.jsx
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { RefreshCw, Save, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

// Component imports
import ThemeCard from "./components/ThemeCard";
import ThemePreview from "./components/ThemePreview";
import AccentColorPicker from "./components/AccentColorPicker";
import AdvancedOptions from "./components/AdvancedOptions";
import Breadcrumb from "./components/Breadcrumb";

const ThemeSettings = () => {
  const {
    theme,
    accentColor,
    useSystemTheme,
    isHighContrast,
    reducedMotion,
    themes,
    accentColors,
    changeTheme,
    changeAccentColor,
    toggleSystemTheme,
    toggleHighContrast,
    toggleReducedMotion,
    resetToDefaults,
    isDark,
  } = useTheme();

  const [isResetting, setIsResetting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to save theme settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      resetToDefaults();
    } catch (error) {
      console.error("Failed to reset theme settings:", error);
    } finally {
      setIsResetting(false);
    }
  };

  const themeOptions = [
    {
      theme: themes.light,
      title: "Light Theme",
      description: "Clean and bright interface with light backgrounds",
      preview: <ThemePreview theme="light" />
    },
    {
      theme: themes.dark,
      title: "Dark Theme", 
      description: "Modern dark interface perfect for low-light environments",
      preview: <ThemePreview theme="dark" />
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary dark:text-dark-text-primary">
            Theme Settings
          </h1>
          <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
            Customize your visual experience by selecting themes and adjusting display preferences
          </p>
        </div>

        <div className="space-y-8">
          {/* Theme Selection */}
          <section>
            <h2 className="mb-6 text-xl font-medium text-text-primary dark:text-dark-text-primary">
              Choose Your Theme
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {themeOptions.map(({ theme: themeValue, title, description, preview }) => (
                <motion.div
                  key={themeValue}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ThemeCard
                    theme={themeValue}
                    title={title}
                    description={description}
                    preview={preview}
                    isSelected={theme === themeValue && !useSystemTheme}
                    onSelect={changeTheme}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Theme Preview */}
          <section>
            <h2 className="mb-6 text-xl font-medium text-text-primary dark:text-dark-text-primary">
              Live Preview
            </h2>
            <div className="overflow-hidden rounded-lg border border-border dark:border-dark-border shadow-md">
              <ThemePreview theme={theme} />
            </div>
            <p className="mt-2 text-sm text-text-muted dark:text-dark-text-muted">
              Preview how your selected theme affects the interface
            </p>
          </section>

          {/* Accent Color Picker */}
          <section className="rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-6">
            <AccentColorPicker
              selectedColor={accentColor}
              colors={accentColors}
              onColorChange={changeAccentColor}
            />
          </section>

          {/* Advanced Options */}
          <section>
            <AdvancedOptions
              useSystemTheme={useSystemTheme}
              onSystemThemeToggle={toggleSystemTheme}
              isHighContrast={isHighContrast}
              onHighContrastToggle={toggleHighContrast}
              reducedMotion={reducedMotion}
              onReducedMotionToggle={toggleReducedMotion}
            />
          </section>

          {/* Action Buttons */}
          <section className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              onClick={handleReset}
              disabled={isResetting}
              className={`
                flex items-center justify-center space-x-2 rounded-lg border border-border dark:border-dark-border
                bg-surface dark:bg-dark-surface px-4 py-2 text-sm font-medium
                text-text-secondary dark:text-dark-text-secondary transition-all duration-200
                hover:bg-secondary-50 dark:hover:bg-dark-surface-secondary
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isResetting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
              <span>Reset to Default</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`
                flex items-center justify-center space-x-2 rounded-lg px-6 py-2 text-sm font-medium
                text-white transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${saveSuccess 
                  ? 'bg-success hover:bg-success-600' :'bg-primary hover:bg-primary-700'
                }
              `}
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : saveSuccess ? (
                <span>Saved!</span>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;