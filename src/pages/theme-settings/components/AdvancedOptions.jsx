// src/pages/theme-settings/components/AdvancedOptions.jsx
import React from "react";
import { Monitor, Eye, Zap } from "lucide-react";
import Icon from '../../../components/AppIcon';


const AdvancedOptions = ({
  useSystemTheme,
  onSystemThemeToggle,
  isHighContrast,
  onHighContrastToggle,
  reducedMotion,
  onReducedMotionToggle,
}) => {
  const ToggleOption = ({ 
    icon: Icon, 
    title, 
    description, 
    checked, 
    onChange, 
    id 
  }) => (
    <div className="flex items-start space-x-3 rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-4">
      <div className="flex-shrink-0">
        <Icon className="h-5 w-5 text-text-secondary dark:text-dark-text-secondary" />
      </div>
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="cursor-pointer">
          <h4 className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
            {title}
          </h4>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
            {description}
          </p>
        </label>
      </div>
      <div className="flex-shrink-0">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`
              h-6 w-11 rounded-full transition-colors duration-200 ease-in-out
              ${checked 
                ? 'bg-primary' :'bg-secondary-300 dark:bg-secondary-600'
              }
            `}
          >
            <div
              className={`
                inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out
                ${checked ? 'translate-x-5' : 'translate-x-0.5'}
              `}
              style={{ marginTop: '2px' }}
            />
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-text-primary dark:text-dark-text-primary">
        Advanced Options
      </h3>
      
      <div className="space-y-3">
        <ToggleOption
          icon={Monitor}
          title="Use System Theme"
          description="Automatically switch between light and dark themes based on your device settings"
          checked={useSystemTheme}
          onChange={onSystemThemeToggle}
          id="system-theme"
        />
        
        <ToggleOption
          icon={Eye}
          title="High Contrast"
          description="Increase color contrast for better accessibility and readability"
          checked={isHighContrast}
          onChange={onHighContrastToggle}
          id="high-contrast"
        />
        
        <ToggleOption
          icon={Zap}
          title="Reduce Motion"
          description="Minimize animations and transitions for a calmer experience"
          checked={reducedMotion}
          onChange={onReducedMotionToggle}
          id="reduced-motion"
        />
      </div>
    </div>
  );
};

export default AdvancedOptions;