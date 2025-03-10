export const regex = {
  number: /[^0-9]/g,
  space: /\s+/g,
  hex: /^#([A-Fa-f0-9]{3,8})$/,
  rgb: /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
  rgba: /^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/,
};

export function isObjectEmpty(objectName: Record<string, unknown>) {
  return Object.keys(objectName).length === 0;
}

export function rgbaToHex(rgba: string) {
  const result = rgba.match(regex.rgba);

  if (!result) {
    return null;
  }

  const r = parseInt(result[1], 10);
  const g = parseInt(result[2], 10);
  const b = parseInt(result[3], 10);
  const a = parseFloat(result[4]);

  const toHex = (value: number) => {
    const hex = Math.round(value).toString(16).padStart(2, "0");
    return hex.toUpperCase();
  };

  const alpha = Math.round(a * 255);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;
}

export function hexToRGBA(
  hexColor: string,
  opacity?: number,
  percent?: number,
): string {
  if (!regex.hex.test(hexColor)) {
    throw new Error(`Invalid color format: ${hexColor}`);
  }

  let hex = hexColor.substring(1);

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  let alpha = 1;

  if (hex.length === 8) {
    alpha = parseInt(hex.substring(6, 8), 16) / 255;
  }

  if (typeof opacity === "number") {
    alpha = opacity;
  }

  const adjustedR = percent ? Math.min(255, r + percent) : r;
  const adjustedG = percent ? Math.min(255, g + percent) : g;
  const adjustedB = percent ? Math.min(255, b + percent) : b;

  return `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
}

export function adjustRgbColor(
  rgbColor: string,
  factor: number,
  type: string,
): string {
  let r, g, b;
  const rgbMatch = rgbColor.match(regex.rgb);
  const hexMatch = rgbColor.match(regex.hex);

  if (rgbMatch) {
    [r, g, b] = rgbMatch.slice(1).map(Number);
  } else if (hexMatch) {
    const hexValue = hexMatch[1];
    r = parseInt(hexValue.slice(0, 2), 16);
    g = parseInt(hexValue.slice(2, 4), 16);
    b = parseInt(hexValue.slice(4, 6), 16);
  } else {
    throw new Error(`Invalid color format: ${rgbColor}`);
  }

  // Adjust the RGB values based on the factor
  r = Math.floor(r * factor);
  g = Math.floor(g * factor);
  b = Math.floor(b * factor);

  // Ensure RGB values are within the range of 0 to 255
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Convert the result to the desired format
  if (type === "hex") {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  } else if (type === "rgb") {
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    throw new Error("Invalid type");
  }
}

export function isUrlPatternMatched(inputUrl: string, all_url: string[]) {
  const baseUrls = all_url.map((url) => url.split("/:")[0]);
  const inputBaseUrl = inputUrl.split("/").slice(0, 2).join("/");

  return baseUrls.some((baseUrl) => baseUrl === inputBaseUrl);
}

export function formatAddress(address: Address, maxLength: number = 100) {
  const formattedAddress = `${address.number}, ${address.street}, ${address.ward}, ${address.district}, ${address.city}`;

  if (formattedAddress.length > maxLength) {
    return formattedAddress.slice(0, maxLength - 3) + "...";
  }

  return formattedAddress;
}

export function uuid(length = 36) {
  return crypto.randomUUID().substring(0, length);
}

export function removeDuplicates<T>(data: T[]): T[] {
  const uniqueArray = [];
  const stringifiedElements = [];
  for (let i = 0; i < data.length; i++) {
    const stringified = JSON.stringify(data[i]);
    if (stringifiedElements.indexOf(stringified) === -1) {
      uniqueArray.push(data[i]);
      stringifiedElements.push(stringified);
    }
  }

  return uniqueArray;
}

export const formatPhoneNumber = (phoneNumber: string) => {
  const numberOnly = phoneNumber.replace(regex.number, "");

  const part1 = numberOnly.slice(0, 4);
  const part2 = numberOnly.slice(4, 7);
  const part3 = numberOnly.slice(7, 10);

  return `${part1} ${part2} ${part3}`.trim();
};

export function removeSpace(input: string) {
  return input.replace(regex.space, "");
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function createFormData(
  data: Record<
    string,
    string | number | boolean | Date | File | Blob | null | undefined
  >,
) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (
        typeof value === "string" ||
        value instanceof File ||
        value instanceof Blob
      ) {
        formData.append(key, value);
      } else if (typeof value === "number" || typeof value === "boolean") {
        formData.append(key, value.toString());
      }
    }
  });

  return formData;
}

export function formatDateTime(dateInput: Date) {
  const date = new Date(dateInput);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate}, ${formattedTime}`;
}

export function compareArrayLengths(
  firstArray: unknown[],
  secondArray: unknown[],
): number {
  if (!Array.isArray(firstArray) || !Array.isArray(secondArray)) {
    return -1;
  }

  return firstArray.length - secondArray.length;
}

export function handleToastMessages(toastCallback: (msg: string) => void) {
  return (messages: string | string[]) => {
    if (Array.isArray(messages)) {
      messages.forEach((message) => toastCallback(message));
    } else {
      toastCallback(messages);
    }
  };
}

export function extractPaths(routes: Route[]) {
  const paths: string[] = [];

  function traverse(items: Route[]) {
    items.forEach((item) => {
      if (item.path) {
        paths.push(item.path);
      }

      if (item.children) {
        traverse(item.children);
      }
    });
  }

  traverse(routes);

  return paths;
}

export function getTruthyObject(obj: Record<string, unknown>) {
  const result: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value) {
      result[key] = value;
    }
  });

  return result;
}

export function stringifyObjectValues(
  obj: Record<string, unknown>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, String(value)]),
  );
}

export function shallowCompareObject(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
