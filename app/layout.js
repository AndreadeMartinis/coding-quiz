import localFont from "next/font/local";
import { Codystar } from "next/font/google";

import "./globals.css";

const codystar = Codystar({
  subsets: ["latin"], // Specifica il sottinsieme (es. 'latin', 'cyrillic', ecc.)
  weight: "400", // Specifica il peso (es. '400' per Regular, '700' per Bold)
  variable: "--font-codystar", // Nome della variabile CSS opzionale
});

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

export const metadata = {
  title: "Coding Quiz",
  description:
    "Metti alla prova le tue conoscenze in ambito web con questo quiz su React, Nextjs e Javascript. Un ottimo strumento per il ripasso per ogni sviluppatore" /* FIXME: */,
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <link rel="icon" href="/logoviola.png" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${codystar.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
