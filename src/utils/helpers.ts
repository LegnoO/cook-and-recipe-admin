export function isObjectEmpty(objectName: Object) {
  return Object.keys(objectName).length === 0;
}

// const rgbTupleRegex = /^\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const cssRgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
// const cssRgbaRegex =
//   /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;

const hexColorRegex = /^#([A-Fa-f0-9]{3,8})$/;

const rgbaStrRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/;

export function rgbaToHex(rgba: string) {
  const result = rgba.match(rgbaStrRegex);

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

  // Convert alpha from 0-1 range to 0-255 range and then to hex
  const alpha = Math.round(a * 255);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`;
}

export function hexToRGBA(
  hexColor: string,
  opacity?: number,
  percent?: number,
): string {
  if (!hexColorRegex.test(hexColor)) {
    throw new Error(`Invalid color format: ${hexColor}`);
  }

  let hex = hexColor.substring(1);

  // Handle 3-character shorthand hex (e.g., #FFF)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Extract RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  let alpha = 1; // Default alpha value

  // If it's an 8-character hex code, extract and convert the alpha channel
  if (hex.length === 8) {
    alpha = parseInt(hex.substring(6, 8), 16) / 255;
  }

  // If the `opacity` argument is provided, use it instead of the alpha from the hex
  if (typeof opacity === "number") {
    alpha = opacity;
  }

  // Apply percentage adjustment to RGB if needed
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
  const rgbMatch = rgbColor.match(cssRgbRegex);
  const hexMatch = rgbColor.match(hexColorRegex);

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
  let formattedAddress = `${address.number}, ${address.street}, ${address.ward}, ${address.district}, ${address.city}`;

  if (formattedAddress.length > maxLength) {
    return formattedAddress.slice(0, maxLength - 3) + "...";
  }

  return formattedAddress;
}

export function isUndefined<T>(value: T) {
  return value === undefined;
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

export function formatPhoneNumber(number: string) {
  // const vnRegex = /^(0[9|8|7|3|5|4][0-9]{8}|(0[1-9]{1}[0-9]{8}))$/;
  let splitNumber = number.split("");

  if (splitNumber.length >= 4 && splitNumber[4] !== " ") {
    splitNumber.push(" ");
  }
  if (splitNumber.length >= 8 && splitNumber[8] !== " ") {
    splitNumber.push(" ");
  }

  return splitNumber.join("");
}

export function removeWhiteSpace(input: string) {
  return input.replace(/\s+/g, "");
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function createSearchParams(filter: Object) {
  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value) {
      params.append(key, String(value));
    }
  });

  return params;
}

export function createFormData(data: Object) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
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
  firstArray: Array<any>,
  secondArray: Array<any>,
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
