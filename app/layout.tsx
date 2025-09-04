import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import BackgroundEffects from '@/components/background-effects';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sage AI - Decentralized Intelligence Platform',
  description: 'A native generative AI layer built directly into Somnia Blockchain\'s ecosystem to revolutionize decentralized intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={spaceGrotesk.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundEffects />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}