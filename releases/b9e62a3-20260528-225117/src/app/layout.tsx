import type { Metadata } from "next";
import { Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { navigation } from "@/data/navigation";
import "./globals.css";

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSerifSC.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/sheep-mascot-main.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Header */}
        <header className="w-full border-b border-line-light bg-paper/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-3 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span
                className="font-serif text-xl font-bold text-ink tracking-tight"
                style={{ fontFamily: "var(--font-noto-serif-sc)" }}
              >
                {siteConfig.name}
              </span>
              <span className="hidden sm:inline text-xs text-ink-muted tracking-widest uppercase">
                Portfolio
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:gap-6 sm:text-sm text-ink-light">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-line-light bg-paper">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p
                  className="font-serif text-lg font-bold text-ink"
                  style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                >
                  {siteConfig.name}
                </p>
                <p className="text-sm text-ink-muted mt-1">
                  AI 产品实践者 · 从需求到原型
                </p>
              </div>
              <div className="flex items-center gap-6 text-sm text-ink-muted">
                {navigation.footer.map((item, index) => (
                  <span key={item.href} className="flex items-center gap-6">
                    {index > 0 && <span className="text-ink-faint">·</span>}
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="hover:text-ink transition-colors"
                    >
                      {item.label}
                    </a>
                  </span>
                ))}
              </div>
            </div>
            <hr className="line-editorial mt-8 mb-4" />
            <p className="text-xs text-ink-faint">
              © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js &
              Tailwind CSS.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
