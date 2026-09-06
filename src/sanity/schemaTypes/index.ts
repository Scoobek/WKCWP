import { type SchemaTypeDefinition } from "sanity";

import { page } from "./collections/page";
import { post } from "./collections/post";
import { eventDetailsBlock } from "./blocks/eventDetailsBlock";
import { galleryBlock } from "./blocks/galleryBlock";
import { richTextBlock } from "./blocks/richTextBlock";
import { heroSection } from "./sections/heroSection";
import { newsSection } from "./sections/newsSection";
import { aboutPage } from "./singletons/aboutPage";
import { homePage } from "./singletons/homePage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    page,
    homePage,
    aboutPage,
    heroSection,
    newsSection,
    richTextBlock,
    galleryBlock,
    eventDetailsBlock,
  ],
};
