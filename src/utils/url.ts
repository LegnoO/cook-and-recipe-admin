function convertPatternToRegex(pattern: string) {
  const newRegex = new RegExp(
    "^" + pattern.replace(/:[^\s/]+/g, "[^/]+") + "$",
  );

  return newRegex;
}

export function isUrlMatching(currentUrl: string, allUrls: string[]) {
  const regexPatterns = allUrls.map((url) => convertPatternToRegex(url));

  return regexPatterns.some((regex) => regex.test(currentUrl));
}
