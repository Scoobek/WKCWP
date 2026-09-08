"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type CopyGpsButtonProps = {
  lat: number;
  lng: number;
  className?: string;
};

export function CopyGpsButton({ lat, lng, className }: CopyGpsButtonProps) {
  const t = useTranslations("posts.localisation");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${lat}, ${lng}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy GPS coordinates");
    }
  };

  const baseClasses =
    "block w-full rounded-md bg-black px-5 py-2.5 text-center text-sm font-medium text-white dark:bg-white dark:text-black";

  return (
    <button
      onClick={handleCopy}
      className={className ? `${baseClasses} ${className}` : baseClasses}
    >
      {copied ? t("copied") : t("copyGps")}
    </button>
  );
}
