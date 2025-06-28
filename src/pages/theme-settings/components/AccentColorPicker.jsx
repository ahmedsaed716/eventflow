// src/pages/theme-settings/components/AccentColorPicker.jsx
import React from "react";
import { Check } from "lucide-react";

const AccentColorPicker = ({ selectedColor, colors, onColorChange }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
        Accent Color
      </h3>
      <div className="flex flex-wrap gap-3">
        {Object.entries(colors).map(([name, color]) => (
          <button
            key={name}
            className={`
              relative h-10 w-10 rounded-full border-2 transition-all duration-200
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              ${selectedColor === color 
                ? 'border-text-primary dark:border-dark-text-primary' :'border-border dark:border-dark-border'
              }
            `}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange?.(color)}
            aria-label={`Select ${name} accent color`}
            title={`${name.charAt(0).toUpperCase() + name.slice(1)} accent color`}
          >
            {selectedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="h-5 w-5 text-white drop-shadow-sm" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccentColorPicker;