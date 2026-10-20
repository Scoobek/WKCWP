import {
  navigationFields,
  navigationFieldsets,
} from "../objects/navigationFields";
import { defineField, defineType } from "sanity";

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact Section",
  type: "object",
  fieldsets: navigationFieldsets,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "street",
      type: "string",
    }),
    defineField({
      name: "buildingNumber",
      type: "string",
    }),
    defineField({
      name: "postalCode",
      type: "string",
    }),
    defineField({
      name: "town",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? true
            : "Must be a valid email";
        }),
    }),
    defineField({
      name: "phone",
      type: "string",
    }),
    defineField({
      name: "registrationName",
      title: "Organisation name",
      type: "string",
    }),
    defineField({
      name: "nip",
      title: "NIP",
      type: "string",
    }),
    defineField({
      name: "regon",
      title: "REGON",
      type: "string",
    }),
    defineField({
      name: "krs",
      title: "KRS",
      type: "string",
    }),
    defineField({
      name: "oppStatus",
      title: "Public benefit status (OPP)",
      type: "string",
    }),
    defineField({
      name: "bankAccount",
      title: "Bank account number",
      type: "string",
    }),
    defineField({
      name: "bankName",
      title: "Bank name",
      type: "string",
    }),
    ...navigationFields,
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title, subtitle: "Contact Section" };
    },
  },
});
