// src/pages/theme-settings/components/ThemeCard.jsx
import React from "react";
import { Check } from "lucide-react";

const ThemeCard = ({ 
  theme, 
  isSelected, 
  onSelect, 
  title, 
  description, 
  preview 
}) => {
  return (
    <div
      className={`
        relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200
        hover:shadow-md active:scale-95
        ${isSelected 
          ? 'border-primary bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400' :'border-border dark:border-dark-border bg-surface dark:bg-dark-surface hover:border-primary-300 dark:hover:border-primary-600'
        }
      `}
      onClick={() => onSelect?.(theme)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(theme);
        }
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${title} theme`}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
            <Check className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Theme preview */}
      <div className="mb-4 overflow-hidden rounded-md border border-border dark:border-dark-border">
        {preview}
      </div>

      {/* Theme info */}
      <div className="space-y-1">
        <h3 className="font-medium text-text-primary dark:text-dark-text-primary">
          {title}
        </h3>
        <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
          {description}
        </p>
      </div>

      {/* Radio button for accessibility */}
      <input
        type="radio"
        name="theme"
        value={theme}
        checked={isSelected}
        onChange={() => onSelect?.(theme)}
        className="sr-only"
        aria-describedby={`${theme}-description`}
      />
    </div>
  );
};

export default ThemeCard;