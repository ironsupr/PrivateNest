import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PrivateNest — Your Private Digital Sanctuary',
  description:
    'Secure, smart bookmarking with real-time sync. Capture your thoughts and links in a private space that evolves with you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} bg-background-white text-navy-900 font-sans antialiased min-h-screen flex flex-col selection:bg-indigo-accent selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
