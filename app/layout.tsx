import type { Metadata } from "next";
import localFont from "next/font/local";
import "./global.css";

/* Load custom fonts with appropriate weights */
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

/* Metadata for the site */
export const metadata: Metadata = {
  title: "Meme Drunk - Infinite Memes",
  description: "Meme Drunk: Scroll infinitely, like, and save your favorite memes!",
  keywords: "memes, humor, infinite scroll, meme platform, meme drunk",
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
        <link rel="icon" href="./IMG_2745.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
