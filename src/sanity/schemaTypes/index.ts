import { type SchemaTypeDefinition } from "sanity";

import { page } from "./collections/page";
import { post } from "./collections/post";
import { heroSection } from "./sections/heroSection";
import { homePage } from "./singletons/homePage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post, page, homePage, heroSection],
};
