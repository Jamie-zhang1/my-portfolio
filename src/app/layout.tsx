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
        <header className="sticky top-0 z-50 border-b border-line bg-paper-clean/88 backdrop-blur-xl">
          <div className="site-shell py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-[6px] bg-ink text-paper-clean font-mono text-xs font-black transition-colors group-hover:bg-accent-sage group-hover:text-ink">
                JZ
              </span>
              <span
                className="font-serif text-xl font-bold text-ink"
                style={{ fontFamily: "var(--font-noto-serif-sc)" }}
              >
                {siteConfig.name}
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full border border-line-light px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink-muted">
                Live Portfolio
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs sm:gap-x-3 sm:text-sm text-ink-light">
              {navigation.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="rounded-full border border-transparent px-3 py-1.5 font-medium transition-colors hover:border-line hover:bg-surface hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line bg-ink text-paper-clean">
          <div className="site-shell py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow mb-3 text-ink-faint">AI Product Field Lab</p>
                <p
                  className="font-serif text-2xl font-bold"
                  style={{ fontFamily: "var(--font-noto-serif-sc)" }}
                >
                  {siteConfig.name}
                </p>
                <p className="mt-2 text-sm text-paper/70">
                  AI 产品实践者 · 从需求到原型
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-paper/70">
                {navigation.footer.map((item, index) => (
                  <span key={item.href} className="flex items-center gap-3">
                    {index > 0 && <span className="text-paper/25">/</span>}
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="rounded-full border border-white/10 px-3 py-1.5 transition-colors hover:border-accent-sage hover:text-accent-sage"
                    >
                      {item.label}
                    </a>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
              <p>
              © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js &
              Tailwind CSS.
              </p>
              <p className="font-mono">/ → portfolio · /sheep → live product</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
