'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function CustomThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem
      storageKey="starmart-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
