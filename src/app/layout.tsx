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
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-body antialiased bg-white text-[#111714]">
        <div className="relative flex size-full min-h-screen flex-col justify-between">
          <div>
            <main>{children}</main>
          </div>
          <div>
            <BottomNav />
            <div className="h-5 bg-white max-w-[480px] mx-auto"></div>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
