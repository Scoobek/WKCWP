import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { urlFor } from "@/sanity/lib/image";
import type { ArticleAuthor } from "@/sanity/lib/queries";

interface ArticleAuthorProps {
  author: ArticleAuthor[] | null | undefined;
}

export async function ArticleAuthor({ author }: ArticleAuthorProps) {
  const t = await getTranslations("sections.article");

  if (!author || author.length === 0) {
    return null;
  }

  const validAuthors = author.filter((a) => a.firstName || a.lastName || a.bio);

  if (validAuthors.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 space-y-6">
      {validAuthors.map((a, index) => {
        const fullName = [a.firstName, a.lastName].filter(Boolean).join(" ");
        const photoUrl = a.photo?.asset
          ? urlFor(a.photo.asset).width(200).height(200).url()
          : null;

        return (
          <div
            key={index}
            className="border-border bg-muted/30 flex gap-4 rounded-lg border p-6"
          >
            {photoUrl && (
              <div className="shrink-0">
                <Image
                  src={photoUrl}
                  alt={a.photo?.alt ?? ""}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">
                {t("aboutAuthor")}
              </p>
              {fullName && (
                <p className="text-foreground mb-2 font-semibold">{fullName}</p>
              )}
              {a.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {a.bio}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
