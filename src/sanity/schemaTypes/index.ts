import { type SchemaTypeDefinition } from "sanity";

import { page } from "./collections/page";
import { post } from "./collections/post";
import { breed } from "./collections/breed";
import { eventDetailsBlock } from "./blocks/eventDetailsBlock";
import { galleryBlock } from "./blocks/galleryBlock";
import { localisationBlock } from "./blocks/localisationBlock";
import { linkBlock } from "./blocks/linkBlock";
import { richTextBlock } from "./blocks/richTextBlock";
import { articleSection } from "./sections/articleSection";
import { breedProfileSection } from "./sections/breedProfileSection";
import { breedsSection } from "./sections/breedsSection";
import { contactSection } from "./sections/contactSection";
import { heroSection } from "./sections/heroSection";
import { imageLinksSection } from "./sections/imageLinksSection";
import { newsSection } from "./sections/newsSection";
import { profilesSection } from "./sections/profilesSection";
import { socialMediaSection } from "./sections/socialMediaSection";
import { sponsorsSection } from "./sections/sponsorsSection";
import { aboutPage } from "./singletons/aboutPage";
import { homePage } from "./singletons/homePage";
import { siteSettings } from "./singletons/siteSettings";
import { link } from "./objects/link";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    breed,
    page,
    homePage,
    aboutPage,
    siteSettings,
    articleSection,
    breedProfileSection,
    breedsSection,
    contactSection,
    heroSection,
    imageLinksSection,
    newsSection,
    profilesSection,
    socialMediaSection,
    sponsorsSection,
    richTextBlock,
    linkBlock,
    galleryBlock,
    eventDetailsBlock,
    localisationBlock,
    link,
  ],
};
