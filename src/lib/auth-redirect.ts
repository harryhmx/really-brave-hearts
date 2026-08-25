const DEFAULT_CALLBACK_URL = "/dashboard";

export function getSafeCallbackUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_CALLBACK_URL;
  }

  return value;
}

export function callbackHref(path: string, callbackUrl: string): string {
  const params = new URLSearchParams({ callbackUrl });
  return `${path}?${params.toString()}`;
}
