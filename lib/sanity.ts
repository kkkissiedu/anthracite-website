import { createClient } from "next-sanity";
import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
import { cache } from "react";
import type { Project, Property, TeamMember, SanityImageSource } from "@/types/sanity";

export type { SanityImageSource };

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
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

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  return client.fetch(siteSettingsQuery);
});

export type FeaturedProject = Project;

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  return client.fetch(
    `*[_type == "project" && featured == true] | order(displayOrder asc) [0...6] {
      _id,
      title,
      slug,
      shortDescription,
      description,
      overview,
      category,
      subcategory,
      displayOrder,
      client,
      location,
      year,
      projectType,
      tools,
      videoUrl,
      panoramaUrl,
      videoFile { asset-> { url } },
      model3d { asset-> { url } },
      mainImage { asset-> { _id, url, metadata { dimensions } } },
      gallery[] { asset-> { _id, url, metadata { dimensions } } },
      panorama[] { asset-> { _id, url, metadata { dimensions } } }
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getProjectsByCategory(
  category: string
): Promise<FeaturedProject[]> {
  return client.fetch(
    `*[_type == "project" && category == $category] | order(displayOrder asc) {
      _id, title, slug, category, subcategory, description, shortDescription,
      overview, client, location, year, projectType, tools, videoUrl, panoramaUrl, displayOrder,
      videoFile { asset-> { url } },
      model3d { asset-> { url } },
      mainImage { asset-> { _id, url, metadata { dimensions } } },
      gallery[] { asset-> { _id, url, metadata { dimensions } } },
      panorama[] { asset-> { _id, url, metadata { dimensions } } }
    }`,
    { category },
    { next: { revalidate: 60 } }
  );
}

export type RawTeamMember = TeamMember;

export async function getTeamMembers(): Promise<RawTeamMember[]> {
  return client.fetch(
    `*[_type == "teamMember"] | order(_createdAt asc) {
      _id,
      name,
      role,
      bio,
      photo {
        asset-> {
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      linkedinUrl
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export type SanityProperty = Property;

export async function getProperties(): Promise<SanityProperty[]> {
  return client.fetch(
    `*[_type == "property" && available == true] | order(_createdAt desc) {
      _id, title, slug, description, shortDescription,
      images[] {
        asset-> {
          _id,
          url,
          metadata {
            dimensions
          }
        },
        alt
      },
      videoUrl, panoramaUrl, location, bedrooms, bathrooms,
      pricePerNight, available, amenities, whatsappNumber, phoneNumber
    }`,
    {},
    { next: { revalidate: 60 } }
  );
}
