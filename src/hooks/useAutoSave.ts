import { useEffect, useRef } from 'react';
import { AppState } from '../types';

export function useAutoSave(data: AppState, setData: (data: AppState) => void) {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  // Auto-save function with debouncing
  const autoSave = (currentData: AppState) => {
    const dataString = JSON.stringify(currentData);
    
    // Only save if data actually changed
    if (dataString === lastSavedRef.current) {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for saving
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('building-management-data', dataString);
        lastSavedRef.current = dataString;
        
        // Show save indicator
        const saveIndicator = document.getElementById('save-indicator');
        if (saveIndicator) {
          saveIndicator.textContent = 'נשמר ✓';
          saveIndicator.className = 'text-green-600 text-sm';
          setTimeout(() => {
            if (saveIndicator) {
              saveIndicator.textContent = '';
            }
          }, 2000);
        }
      } catch (error) {
        console.error('Error saving data:', error);
        const saveIndicator = document.getElementById('save-indicator');
        if (saveIndicator) {
          saveIndicator.textContent = 'שגיאה בשמירה ✗';
          saveIndicator.className = 'text-red-600 text-sm';
        }
      }
    }, 1000); // Save after 1 second of inactivity
  };

  // Load data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('building-management-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        lastSavedRef.current = savedData;
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, [setData]);

  // Auto-save when data changes
  useEffect(() => {
    autoSave(data);
  }, [data]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Manual save function
  const forceSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    const dataString = JSON.stringify(data);
    localStorage.setItem('building-management-data', dataString);
    lastSavedRef.current = dataString;
  };

  return { forceSave };
}