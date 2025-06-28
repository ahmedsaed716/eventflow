// src/pages/theme-settings/components/Breadcrumb.jsx
import React from "react";
import { ChevronRight } from "lucide-react";


const Breadcrumb = () => {
  const breadcrumbItems = [
    { label: "Settings", href: "#", disabled: true },
    { label: "Appearance", href: "#", disabled: true },
    { label: "Theme", current: true },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mr-2 h-4 w-4 text-text-muted dark:text-dark-text-muted" />
            )}
            {item.current ? (
              <span 
                className="text-sm font-medium text-text-primary dark:text-dark-text-primary"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <span
                className={`text-sm ${
                  item.disabled
                    ? "text-text-muted dark:text-dark-text-muted cursor-not-allowed" :"text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-400"
                }`}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;