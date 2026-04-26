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
  // Sub-pages
  pages?: {
    architectural?: { heroHeading?: string; heroSubtitle?: string };
    sculptor?: { heroHeading?: string; heroSubtitle?: string };
    realEstate?: { heroHeading?: string; heroSubtitle?: string };
  };
};

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  ...,
  pages {
    architectural { heroHeading, heroSubtitle },
    sculptor { heroHeading, heroSubtitle },
    realEstate { heroHeading, heroSubtitle }
  }
}`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(siteSettingsQuery);
}

export type FeaturedProject = {
  _id: string;
  title: string;
  category: string;
  subcategory?: string;
  description?: string;
  overview?: unknown[];
  mainImage?: unknown;
  gallery?: unknown[];
  videoUrl?: string;
  videoFile?: { asset: { url: string } };
  model3d?: { asset: { url: string } };
  panorama?: unknown[];
  client?: string;
  location?: string;
  year?: number;
  tools?: string[];
};

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(order asc) {
      _id, title, category, subcategory, description, overview,
      mainImage, gallery, videoUrl, videoFile, panorama, model3d,
      client, location, year, tools
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export type RawTeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photo: unknown;
  linkedinUrl: string | null;
};

export async function getTeamMembers(): Promise<RawTeamMember[]> {
  return client.fetch(
    `*[_type == "teamMember"] | order(_createdAt asc) {
      _id, name, role, bio, photo, linkedinUrl
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export type SanityProperty = {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  shortDescription?: string;
  images?: unknown[];
  videoUrl?: string;
  panoramaUrl?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  pricePerNight?: number;
  available?: boolean;
  amenities?: string[];
  whatsappNumber?: string;
  phoneNumber?: string;
};

export async function getProperties(): Promise<SanityProperty[]> {
  return client.fetch(
    `*[_type == "property" && available == true] | order(_createdAt desc) {
      _id, title, slug, description, shortDescription, images,
      videoUrl, panoramaUrl, location, bedrooms, bathrooms,
      pricePerNight, available, amenities, whatsappNumber, phoneNumber
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}
