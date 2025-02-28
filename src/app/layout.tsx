import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'React Video Audio Player 🎬🎵 | Video & Audio Player for React',
  description: 'React Video Audio Player is a lightweight, customisable React video player and React audio player that supports video, audio, and streaming playback. Perfect for building modern media applications.',
  keywords: 'React, react player, video player, audio player, media player, React video player, React audio player, streaming playback, customisable player, modern media applications, React components, multimedia, video streaming, audio streaming, React media player, React AV player, React music player, React streaming player, React video streaming, React audio streaming, React video streaming player, React audio streaming player, React player, HTML5 video player, HTML5 audio player, responsive media player, ReactJS, frontend development, web development, media controls, video controls, audio controls, media library, media integration, React hooks, React context, media playback, video playback, audio playback, media customisation, media features, media support, cross-browser compatibility, mobile-friendly player, adaptive streaming, media API, media events, media handling, media management, media performance, media optimisation, media enhancements, media UX, media UI, media design, media experience, media functionality, media tools, media utilities, media plugins, media extensions, media frameworks, media libraries, media solutions, media applications'
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <meta name="google-site-verification" content="RYIqjAUiKFN5mbAANUR0kHmuUEgYMzdVCLtlUdB7HjY" />
      <meta name="robots" content="index, follow" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}