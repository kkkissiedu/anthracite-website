import { createClient } from "next-sanity";
import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const client = createClient({
  projectId: "x9ubqazh",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type SiteSettings = {
  // Hero
  heroTagline: string;
  heroGoldWord: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  // About
  aboutLabel: string;
  aboutHeading: string;
  aboutHeadingGoldWords: string;
  aboutBody: string;
  statOneValue: string;
  statOneLabel: string;
  statTwoValue: string;
  statTwoLabel: string;
  statThreeValue: string;
  statThreeLabel: string;
  // Services
  servicesLabel: string;
  servicesHeading: string;
  servicesHeadingGoldWord: string;
  serviceOneTitle: string;
  serviceOneSubtitle: string | null;
  serviceOneDescription: string;
  serviceOneModalDescription: string;
  serviceOneServices: string[];
  serviceTwoTitle: string;
  serviceTwoSubtitle: string | null;
  serviceTwoDescription: string;
  serviceTwoModalDescription: string;
  serviceTwoServices: string[];
  serviceThreeTitle: string;
  serviceThreeSubtitle: string | null;
  serviceThreeDescription: string;
  serviceThreeModalDescription: string;
  serviceThreeServices: string[];
  // Contact
  contactLabel: string;
  contactHeading: string;
  contactHeadingGoldWord: string;
  contactSubtext: string;
  contactEmail: string;
  contactLocation: string;
  // Footer
  footerCopyright: string;
  footerTagline: string | null;
};

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(siteSettingsQuery);
}
