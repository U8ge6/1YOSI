import { useState, useEffect } from 'react';
import { AppState } from '../types';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Validation function to check if data is valid AppState
  const isValidAppState = (data: any): data is AppState => {
    return data && 
           typeof data === 'object' && 
           Array.isArray(data.buildings) && 
           data.buildings.length > 0 &&
           typeof data.currentBuildingId === 'string' &&
           data.tenants && 
           data.payments && 
           data.expenses && 
           data.pettyCash && 
           Array.isArray(data.employees) && // Changed: employees is now an array
           data.issues && 
           Array.isArray(data.products) &&
           Array.isArray(data.productUsages) &&
           Array.isArray(data.productHistory) &&
           data.electricityReadings &&
           data.settings;
  };

  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedData = JSON.parse(item);
        
        // If this is AppState data, validate it
        if (key === 'building-management-data') {
          if (isValidAppState(parsedData)) {
            return parsedData;
          } else {
            console.warn('Invalid data structure found in localStorage, using default data');
            // Clear the invalid data
            window.localStorage.removeItem(key);
            return initialValue;
          }
        }
        
        return parsedData;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      // Clear potentially corrupted data
      window.localStorage.removeItem(key);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Validate AppState data before storing
      if (key === 'building-management-data' && !isValidAppState(valueToStore)) {
        console.error('Attempted to store invalid AppState data, operation cancelled');
        return;
      }
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch custom event for cross-tab synchronization
      window.dispatchEvent(new CustomEvent('localStorageChange', {
        detail: { key, value: valueToStore }
      }));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsedData = JSON.parse(e.newValue);
          
          // Validate AppState data before updating
          if (key === 'building-management-data') {
            if (isValidAppState(parsedData)) {
              setStoredValue(parsedData);
            } else {
              console.warn('Invalid data received from storage event, ignoring');
            }
          } else {
            setStoredValue(parsedData);
          }
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === key) {
        // Validate AppState data before updating
        if (key === 'building-management-data') {
          if (isValidAppState(e.detail.value)) {
            setStoredValue(e.detail.value);
          } else {
            console.warn('Invalid data received from custom storage event, ignoring');
          }
        } else {
          setStoredValue(e.detail.value);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}