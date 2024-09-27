// ** React Imports
import { useState, useEffect, Dispatch, SetStateAction } from "react";

type StorageType = 'session' | 'local';

const useStorage = <T>(
  key: string,
  defaultValue: T | null = null,
  storageType: StorageType = 'local',
): [T, Dispatch<SetStateAction<T>>] => {
  const getStorage = (): Storage => {
    return storageType === 'local' ? localStorage : sessionStorage;
  };

  const getStoredValue = (): T => {
    if (typeof window === "undefined") {
      return defaultValue as T;
    }

    const storage = getStorage();
    const storedValue = storage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  const [value, setValue] = useState<T>(getStoredValue);

  useEffect(() => {
    const storage = getStorage();
    const storedValue = storage.getItem(key);
    if (storedValue !== null) {
      setValue(JSON.parse(storedValue));
    }
  }, [key, storageType]);

  useEffect(() => {
    const storage = getStorage();
    storage.setItem(key, JSON.stringify(value));
  }, [value, key, storageType]);

  return [value, setValue];
};

export default useStorage;
