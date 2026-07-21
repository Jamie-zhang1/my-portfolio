"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { SmoothScroll } from "@/components/interaction/smooth-scroll";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export function ClientChromeShell({ children, locale, messages }: Readonly<{ children: React.ReactNode; locale: string; messages: AbstractIntlMessages }>) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Shanghai">
      <SmoothScroll />
      <SiteHeader />
      <main key={locale} className="locale-frame flex-1">{children}</main>
      <SiteFooter />
    </NextIntlClientProvider>
  );
}