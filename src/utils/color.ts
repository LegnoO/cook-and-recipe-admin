const rgbTupleRegex = /^\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const cssRgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
const cssRgbaRegex =
  /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/;
const hexColorRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;

export function hexToRGBA(
  hexColor: string,
  opacity: number,
  percent?: number,
): string {
  if (!hexColorRegex.test(hexColor)) {
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

  if (percent) {
    return `rgba(${r + percent}, ${g + percent}, ${b + percent}, ${opacity})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
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

export function logColor(inputColor: string) {
  if (rgbTupleRegex.test(inputColor)) {
    console.log(`%c${inputColor} ▇▇▇▇▇▇▇▇▇ `, `color: rgb(${inputColor})`);
  } else if (cssRgbRegex.test(inputColor)) {
    console.log(`%c${inputColor} ▇▇▇▇▇▇▇▇▇`, `color: ${inputColor}`);
  } else if (cssRgbaRegex.test(inputColor)) {
    console.log(`%c${inputColor} ▇▇▇▇▇▇▇▇▇`, `color: ${inputColor}`);
  } else if (hexColorRegex.test(inputColor)) {
    console.log(`%c${inputColor} ▇▇▇▇▇▇▇▇▇`, `color: ${inputColor}`);
  } else {
    throw new Error("Invalid input color!");
  }
}
