import { type SchemaTypeDefinition } from "sanity";

import { page } from "./collections/page";
import { post } from "./collections/post";
import { eventDetailsBlock } from "./blocks/eventDetailsBlock";
import { galleryBlock } from "./blocks/galleryBlock";
import { localisationBlock } from "./blocks/localisationBlock";
import { richTextBlock } from "./blocks/richTextBlock";
import { articleSection } from "./sections/articleSection";
import { contactSection } from "./sections/contactSection";
import { heroSection } from "./sections/heroSection";
import { newsSection } from "./sections/newsSection";
import { socialMediaSection } from "./sections/socialMediaSection";
import { sponsorsSection } from "./sections/sponsorsSection";
import { aboutPage } from "./singletons/aboutPage";
import { homePage } from "./singletons/homePage";
import { link } from "./objects/link";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    page,
    homePage,
    aboutPage,
    articleSection,
    contactSection,
    heroSection,
    newsSection,
    socialMediaSection,
    sponsorsSection,
    richTextBlock,
    galleryBlock,
    eventDetailsBlock,
    localisationBlock,
    link,
  ],
};
