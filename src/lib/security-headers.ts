type Header = { key: string; value: string };

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

function getAppOrigin(): string | null {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) {
    return null;
  }

  try {
    return trimTrailingSlash(new URL(appUrl).origin);
  } catch {
    return null;
  }
}

function getSupabaseOrigins(): string[] {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) {
    return [];
  }

  try {
    const parsed = new URL(supabaseUrl);
    return [parsed.origin, `wss://${parsed.host}`];
  } catch {
    return [];
  }
}

function getStarPayOrigin(): string | null {
  const baseUrl = process.env.STARPAY_API_BASE_URL?.trim();
  if (!baseUrl) {
    return null;
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    return null;
  }
}

/**
 * Content-Security-Policy tuned for StarMart (Next.js App Router, Supabase, Google OAuth).
 * Uses pragmatic defaults so Next.js hydration and Tailwind inline styles keep working.
 */
export function buildContentSecurityPolicy(): string {
  const appOrigin = getAppOrigin();
  const supabaseOrigins = getSupabaseOrigins();
  const starPayOrigin = getStarPayOrigin();

  const connectSources = [
    "'self'",
    ...supabaseOrigins,
    'https://accounts.google.com',
    'https://*.google.com',
    ...(starPayOrigin ? [starPayOrigin] : []),
  ];

  const scriptSources = ["'self'", "'unsafe-inline'", "'unsafe-eval'"];
  if (appOrigin) {
    scriptSources.push(appOrigin);
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(' ')}`,
    "frame-src 'self' https://accounts.google.com https://*.supabase.co",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    "media-src 'self' https: blob:",
  ];

  if (process.env.NODE_ENV === 'production') {
    directives.push('upgrade-insecure-requests');
  }

  return directives.join('; ');
}

export function buildPermissionsPolicy(): string {
  return [
    'accelerometer=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'battery=()',
    'camera=()',
    'cross-origin-isolated=()',
    'display-capture=()',
    'document-domain=()',
    'encrypted-media=()',
    'fullscreen=(self)',
    'geolocation=()',
    'gyroscope=()',
    'magnetometer=()',
    'microphone=()',
    'midi=()',
    'payment=()',
    'picture-in-picture=()',
    'publickey-credentials-get=(self)',
    'screen-wake-lock=()',
    'usb=()',
    'web-share=()',
    'xr-spatial-tracking=()',
  ].join(', ');
}

export function getSecurityHeaders(): Header[] {
  const appOrigin = getAppOrigin();

  const headers: Header[] = [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value: buildPermissionsPolicy(),
    },
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'on',
    },
    {
      key: 'Content-Security-Policy',
      value: buildContentSecurityPolicy(),
    },
    {
      key: 'Cross-Origin-Opener-Policy',
      value: 'same-origin-allow-popups',
    },
    {
      key: 'Cross-Origin-Resource-Policy',
      value: 'same-site',
    },
  ];

  // Prefer explicit app origin over platform default `Access-Control-Allow-Origin: *` on HTML.
  if (appOrigin) {
    headers.push({
      key: 'Access-Control-Allow-Origin',
      value: appOrigin,
    });
    headers.push({
      key: 'Vary',
      value: 'Origin',
    });
  }

  return headers;
}
