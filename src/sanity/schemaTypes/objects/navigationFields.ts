import { defineField } from "sanity";

/** Collapsed "Navigation" box shown at the bottom of a section's form. */
export const navigationFieldsets = [
  {
    name: "navigation",
    title: "Navigation",
    options: { collapsible: true, collapsed: true },
  },
];

/**
 * Lets a section appear in the header menu. Spread into each section type that
 * can sit on the Home page, with `fieldsets: navigationFieldsets`. Only the Home
 * page menu reads these; the same section types on other pages ignore them.
 */
export const navigationFields = [
  defineField({
    name: "showInNav",
    title: "Show in navigation",
    description: "Adds this section to the header menu (Home page).",
    type: "boolean",
    initialValue: false,
    fieldset: "navigation",
  }),
  defineField({
    name: "navLabel",
    title: "Menu label",
    description: "Leave empty to use the section heading.",
    type: "string",
    fieldset: "navigation",
    hidden: ({ parent }) => !parent?.showInNav,
  }),
];
