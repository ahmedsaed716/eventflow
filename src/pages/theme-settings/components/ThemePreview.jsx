// src/pages/theme-settings/components/ThemePreview.jsx
import React from "react";
import { User, Calendar, Settings, Search, Bell, Home, FileText } from "lucide-react";
import Icon from '../../../components/AppIcon';


const ThemePreview = ({ theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <div className={`w-full ${isDark ? 'dark' : ''}`}>
      <div className="h-48 bg-background dark:bg-dark-background transition-colors duration-200">
        {/* Simulated header */}
        <div className="flex items-center justify-between border-b border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary"></div>
            <span className="text-sm font-medium text-text-primary dark:text-dark-text-primary">
              EventApp
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-text-secondary dark:text-dark-text-secondary" />
            <Settings className="h-4 w-4 text-text-secondary dark:text-dark-text-secondary" />
          </div>
        </div>

        {/* Simulated navigation */}
        <div className="flex border-b border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-2">
          <div className="flex space-x-4">
            {[
              { icon: Home, label: 'Dashboard', active: true },
              { icon: Calendar, label: 'Events' },
              { icon: User, label: 'Users' },
              { icon: FileText, label: 'Reports' }
            ].map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center space-x-1 rounded px-2 py-1 text-xs ${
                  active
                    ? 'bg-primary text-white' :'text-text-secondary dark:text-dark-text-secondary hover:bg-secondary-100 dark:hover:bg-dark-surface-secondary'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated content area */}
        <div className="p-4 space-y-3">
          {/* Search bar */}
          <div className="flex items-center space-x-2 rounded border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-3 py-2">
            <Search className="h-4 w-4 text-text-muted dark:text-dark-text-muted" />
            <div className="h-3 w-24 rounded bg-secondary-200 dark:bg-secondary-600"></div>
          </div>

          {/* Content cards */}
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="rounded border border-border dark:border-dark-border bg-surface dark:bg-dark-surface p-3 shadow-sm dark:shadow-dark-sm"
              >
                <div className="mb-2 h-3 w-16 rounded bg-secondary-300 dark:bg-secondary-600"></div>
                <div className="space-y-1">
                  <div className="h-2 w-full rounded bg-secondary-200 dark:bg-secondary-700"></div>
                  <div className="h-2 w-3/4 rounded bg-secondary-200 dark:bg-secondary-700"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <div className="rounded bg-primary px-3 py-1">
              <div className="h-3 w-12 rounded bg-white/90"></div>
            </div>
            <div className="rounded border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-3 py-1">
              <div className="h-3 w-10 rounded bg-text-muted dark:bg-dark-text-muted"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;