export function delay<T>(time: number, value: T): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), time));
  }
  