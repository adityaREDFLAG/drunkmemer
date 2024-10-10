import type { Metadata } from "next";
import localFont from "next/font/local";
import "./global.css";

/* Metadata for the site */
export const metadata: Metadata = {
  title: "Drunk Memer - Infinite Memes",
  description: "Drunk Memer: Scroll infinitely, like, and save your favorite memes!",
  keywords: ["memes", "humor", "infinite scroll", "meme platform", "meme drunk"],
  openGraph: {
    title: "Meme Drunk - Infinite Memes",
    description: "The ultimate meme scrolling experience. Enjoy endless memes!",
    url: "https://memedrunk.vercel.app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Metadata integration */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" /> {/* Favicon path */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
