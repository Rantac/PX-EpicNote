import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/BottomNav";

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
        <div className="relative flex flex-col min-h-screen max-w-[480px] mx-auto bg-background">
          <main className="flex-1 pb-16">
            {children}
          </main>
          <div className="fixed bottom-0 left-1/2 w-full max-w-[480px] -translate-x-1/2">
            <BottomNav />
            <div className="h-safe-bottom bg-background"></div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
