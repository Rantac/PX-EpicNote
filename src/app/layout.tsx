import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ResponsiveShell } from '@/components/ResponsiveShell';

export const metadata: Metadata = {
  title: 'PXNote',
  description: 'Track your epic notes and weekly analysis.',
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ResponsiveShell>
          {children}
        </ResponsiveShell>
        <Toaster />
      </body>
    </html>
  );
}
