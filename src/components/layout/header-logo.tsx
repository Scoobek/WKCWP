import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/queries";

const BRAND = "WKCwP";

/**
 * Header brand: the company logo from Studio's site settings, or the text
 * brand when no logo has been uploaded. SVGs are served unoptimized so they
 * stay vector; `next/image` doesn't process them by default.
 */
export function HeaderLogo({ logo }: { logo: SiteSettings["logo"] }) {
  if (!logo?.asset) {
    return (
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-white"
      >
        {BRAND}
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="inline-flex items-center rounded-md bg-white px-3 py-1.5"
    >
      <Image
        src={urlFor(logo.asset).height(96).fit("max").url()}
        alt={logo.alt || BRAND}
        width={logo.width ?? 96}
        height={logo.height ?? 96}
        priority
        unoptimized
        className="h-9 w-auto"
      />
    </Link>
  );
}
