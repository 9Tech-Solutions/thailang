import type { Metadata, Viewport } from "next";
import {
  Bai_Jamjuree,
  Chonburi,
  JetBrains_Mono,
  Sarabun,
} from "next/font/google";
import { site } from "@/shared/config/site";
import { ReactGrabDev } from "@/shared/dev/ReactGrabDev";
import { LangProvider } from "@/shared/i18n/LangProvider";
import "./globals.css";

const chonburi = Chonburi({
  subsets: ["thai", "latin"],
  weight: ["400"],
  variable: "--font-chonburi",
  display: "swap",
});

const baiJamjuree = Bai_Jamjuree({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bai-jamjuree",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sarabun",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name}, ${site.taglineEn}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Thailang",
    "Thai programming language",
    "ภาษาโปรแกรมมิงไทย",
    "Rust compiler",
    "WebAssembly",
    "JavaScript transpiler",
  ],
  openGraph: {
    type: "website",
    title: `${site.name}, ${site.taglineEn}`,
    description: site.description,
    siteName: site.name,
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1030",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${chonburi.variable} ${baiJamjuree.variable} ${sarabun.variable} ${jetBrainsMono.variable}`}
    >
      <body className="min-h-screen">
        <ReactGrabDev />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
