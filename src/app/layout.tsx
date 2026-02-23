import type { Metadata } from "next";
import { raleway } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const title = "Clo Chaperon — Jazz Vocalist";
const description =
  "Clo Chaperon — Auckland-based jazz vocalist blending Mauritian heritage with the freedom of jazz.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Clo Chaperon",
  },
  description,
  openGraph: {
    title,
    description,
    siteName: "Clo Chaperon",
    type: "website",
    locale: "en_NZ",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
