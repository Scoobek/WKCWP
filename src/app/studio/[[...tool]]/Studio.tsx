"use client";

/**
 * The Studio and its config are imported inside a Client Component boundary so
 * Sanity's browser-oriented code (and its `swr` dependency) is compiled for the
 * client environment. Importing the config directly in the server-component
 * `page.tsx` would pull it into the React Server Component layer, where `swr`
 * resolves to its `react-server` build that has no default export.
 */
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export default function Studio() {
  return <NextStudio config={config} />;
}
