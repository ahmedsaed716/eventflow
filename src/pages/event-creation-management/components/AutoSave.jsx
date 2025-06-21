import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';

const AutoSave = ({ data, onSave, interval = 30000 }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(true);
  }, [data]);

  useEffect(() => {
    if (!hasChanges) return;

    const timer = setTimeout(async () => {
      if (data.title || data.description) {
        setIsSaving(true);
        try {
          await onSave(data);
          setLastSaved(new Date());
          setHasChanges(false);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, interval);

    return () => clearTimeout(timer);
  }, [data, hasChanges, interval, onSave]);

  if (!lastSaved && !isSaving) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-text-secondary">
      {isSaving ? (
        <>
          <Icon name="Loader2" size={14} className="animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        <>
          <Icon name="Check" size={14} className="text-success" />
          <span>Saved {lastSaved?.toLocaleTimeString()}</span>
        </>
      )}
    </div>
  );
};

export default AutoSave;