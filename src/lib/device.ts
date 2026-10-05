const MOBILE_UA_REGEX = /Mobi|Android(?!.*Tablet)|iPhone|iPod/i;

/** Rough UA-based mobile check for SSR-only responsive decisions (e.g. how
 * many items to fetch per page). Doesn't react to live browser resize. */
export function isMobileUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return MOBILE_UA_REGEX.test(userAgent);
}
