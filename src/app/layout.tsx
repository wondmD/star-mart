import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { CustomThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "StarMart - Your Trusted Online Marketplace",
  description: "Browse and shop quality products with fast delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      data-theme="light"
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <CustomThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <Header />
              <main className="flex-1 w-full">
                {children}
              </main>
              <Footer />
              <Toaster position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}

