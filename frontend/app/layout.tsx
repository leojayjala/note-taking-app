import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes",
  description:
    "A simple, elegant note-taking app to organize your ideas. No clutter, no complexity—just you and your notes.",
  authors: [{ name: "Notes App" }],
  openGraph: {
    title: "Notes",
    description:
      "A simple, elegant note-taking app to organize your ideas. No clutter, no complexity—just you and your notes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@NotesApp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
