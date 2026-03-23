import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free - Landing Page | FlyonUI - Dashboard PRO",
  description: "FlyonUIPro is the best FlyonUI dashboard for responsive web apps. Streamline your app development process with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" data-assets-path="assets/" data-layout-path="free-landing-page/" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function () {
              try {
                const root = document.documentElement;
                const layoutPath = root.getAttribute('data-layout-path')?.replace('/', '') || 'dashboard-default';
                const localStorageKey = \`\${layoutPath}-theme\`;

                // Theme configuration loaded from page-config.json at build time
                window.THEME_CONFIG = { 'free-landing-page': { default: 'light', light: 'light', dark: 'dark', system: { light: 'light', dark: 'dark' } } };

                // Get current system theme preference
                const getSystemPreference = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

                // Resolve theme based on user selection and layout configuration
                const resolveTheme = (selectedTheme, layoutPath) => {
                  const layoutConfig = window.THEME_CONFIG?.[layoutPath];
                  if (!layoutConfig) return selectedTheme === 'system' ? (getSystemPreference() ? 'dark' : 'light') : selectedTheme;

                  if (selectedTheme === 'system') {
                    const systemConfig = layoutConfig.system;
                    const prefersDark = getSystemPreference();
                    return prefersDark ? systemConfig.dark : systemConfig.light;
                  }

                  return layoutConfig[selectedTheme] || selectedTheme || layoutConfig.default || 'light';
                };

                const savedTheme = localStorage.getItem(localStorageKey) || 'system';
                const resolvedTheme = resolveTheme(savedTheme, layoutPath);

                root.setAttribute('data-theme', resolvedTheme);
              } catch (e) {
                console.warn('Early theme script error:', e);
              }
            })();
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen bg-base-100 font-sans text-base antialiased`}>
        {children}
        
        {/* Vendors JS */}
        <Script src="/assets/dist/libs/flyonui/flyonui.js" strategy="afterInteractive" />
        {/* Helper JS from template */}
        {/* These scripts should probably be in public folder */}
      </body>
    </html>
  );
}
