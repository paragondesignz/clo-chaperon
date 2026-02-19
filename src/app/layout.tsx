import type { Metadata } from "next";
import { raleway } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Clo Chaperon — Jazz Vocalist",
    template: "%s | Clo Chaperon",
  },
  description:
    "Clo Chaperon — Auckland-based jazz vocalist blending Mauritian heritage with the freedom of jazz.",
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
      </body>
    </html>
  );
}
