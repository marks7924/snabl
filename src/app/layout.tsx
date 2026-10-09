import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/language-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'إل فيلا | El Villa — Café, Restaurant & Event Venue',
  description: 'كافيه، مطعم، وقاعة مناسبات خاصة متكاملة. استمتع بأحدث قائمة طعام، اطلب مباشرة عبر الـ QR للطاولات، أو احجز قاعة مناسبتك الخاصة.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[#faf8f5] text-[#1c1917] antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
