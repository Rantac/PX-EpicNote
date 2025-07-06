"use client";

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  const setStoredValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      if (!isHydrated) return;
      setValue(prevValue => {
        const valueToStore = newValue instanceof Function ? newValue(prevValue) : newValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
        return valueToStore;
      });
    },
    [key, isHydrated]
  );

  return [value, setStoredValue, isHydrated];
}
