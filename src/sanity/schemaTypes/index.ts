import { type SchemaTypeDefinition } from "sanity";

import { page } from "./collections/page";
import { post } from "./collections/post";
import { eventDetailsBlock } from "./blocks/eventDetailsBlock";
import { galleryBlock } from "./blocks/galleryBlock";
import { localisationBlock } from "./blocks/localisationBlock";
import { richTextBlock } from "./blocks/richTextBlock";
import { contactSection } from "./sections/contactSection";
import { heroSection } from "./sections/heroSection";
import { newsSection } from "./sections/newsSection";
import { sponsorsSection } from "./sections/sponsorsSection";
import { aboutPage } from "./singletons/aboutPage";
import { homePage } from "./singletons/homePage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    page,
    homePage,
    aboutPage,
    contactSection,
    heroSection,
    newsSection,
    sponsorsSection,
    richTextBlock,
    galleryBlock,
    eventDetailsBlock,
    localisationBlock,
  ],
};
