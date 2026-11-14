import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lotvale — Make the whole order work",
  description:
    "Turn supplier quotes into a feasible buying plan and supplier-specific order drafts.",
  openGraph: {
    title: "Lotvale — Make the whole order work",
    description:
      "Turn supplier quotes into a feasible buying plan and supplier-specific order drafts.",
    type: "website",
    images: [
      {
        url: "https://raw.githubusercontent.com/ShalyX/lotvale/main/public/og.png",
        width: 1200,
        height: 630,
        alt: "Lotvale — Make the whole order work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://raw.githubusercontent.com/ShalyX/lotvale/main/public/og.png",
    ],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
