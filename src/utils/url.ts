export function isUrlPatternMatched(inputUrl: string, all_url: string[]) {
  const baseUrls = all_url.map((url) => url.split("/:")[0]);
  const inputBaseUrl = inputUrl.split("/").slice(0, 2).join("/");
  return baseUrls.some((baseUrl) => baseUrl === inputBaseUrl);
}
