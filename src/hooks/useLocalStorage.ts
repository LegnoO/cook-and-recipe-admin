// ** React Imports
import { useState, useEffect, Dispatch, SetStateAction } from "react";

const useLocalStorage = <T>(
  key: string,
  defaultValue?: T,
): [T, Dispatch<SetStateAction<T>>] => {
  
  const getLocalStorageValue = (): T => {
    if (typeof window === "undefined") {
      return defaultValue as T;
    }

    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  };

  
  const [value, setValue] = useState<T>(getLocalStorageValue);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      setValue(JSON.parse(storedValue));
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, setValue, key]);

  return [value, setValue];
};

export default useLocalStorage;
