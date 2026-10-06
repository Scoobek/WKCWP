import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { HiUser } from "react-icons/hi2";

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

  const isSingleAuthor = validAuthors.length === 1;
  const heading = t(isSingleAuthor ? "aboutAuthor" : "aboutAuthors");

  return (
    <div className="border-border bg-muted/30 mt-10 rounded-lg border p-6">
      <p className="text-muted-foreground mb-6 text-xs font-semibold tracking-wide uppercase">
        {heading}
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-6">
        {validAuthors.map((a, index) => {
          const fullName = [a.firstName, a.lastName].filter(Boolean).join(" ");
          const photoUrl = a.photo?.asset
            ? urlFor(a.photo.asset).width(200).height(200).url()
            : null;

          return (
            <div key={index} className="flex min-w-0 flex-1 basis-64 gap-4">
              <div className="shrink-0">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={a.photo?.alt ?? ""}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-20 w-20 items-center justify-center rounded-full">
                    <HiUser className="h-10 w-10" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                {fullName && (
                  <p className="text-foreground mb-1 font-semibold">
                    {fullName}
                  </p>
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
    </div>
  );
}
