import Link from "next/link";
import { getLocale } from "next-intl/server";

import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";
import RichText from "@/components/RichText";
import { type Locale } from "@/i18n/config";
import { getCachedGlobal } from "@/utilities/getGlobals";

import type { Footer } from "@/payload-types";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const footerData: Footer = await getCachedGlobal("footer", locale, 1)();
  const navItems = footerData?.navItems ?? [];

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        {/* Logo Section */}
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {navItems.map(({ link }, i) => (
            <CMSLink className="text-white hover:underline" key={i} {...link} />
          ))}
        </nav>
      </div>

      {/* Attribution Section */}
      {footerData.attribution ? (
        <div className="flex border-t p-4 text-xs">
          <div className="container">
            <RichText data={footerData.attribution} />
          </div>
        </div>
      ) : null}
    </footer>
  );
}
