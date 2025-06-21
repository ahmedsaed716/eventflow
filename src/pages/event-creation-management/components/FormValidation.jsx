import React from 'react';
import Icon from 'components/AppIcon';

const FormValidation = ({ errors, field, children }) => {
  const hasError = errors && errors[field];

  return (
    <div className="space-y-1">
      {children}
      {hasError && (
        <div className="flex items-center space-x-1 text-error text-sm">
          <Icon name="AlertCircle" size={14} />
          <span>{errors[field]}</span>
        </div>
      )}
    </div>
  );
};

export default FormValidation;