import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Liora — IA pour vos documents",
  description:
    "Résumez vos PDFs, générez CV & lettres de motivation, corrigez vos textes avec l'IA Groq.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Liora — IA pour vos documents",
    description: "L'IA au service de vos documents. Résumés, CV, correction de texte.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7041686131640404"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9rem",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
