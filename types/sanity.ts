import type { SanityImageSource } from "@sanity/image-url";

export type { SanityImageSource };

export type SanityPortableTextBlock = {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text: string; marks?: string[] }[];
};

export type Project = {
  _id: string;
  title: string;
  slug?: { current: string };
  category: string;
  subcategory?: string;
  shortDescription?: string;
  description?: string;
  overview?: SanityPortableTextBlock[];
  images?: SanityImageSource[];
  mainImage?: SanityImageSource;
  gallery?: SanityImageSource[];
  displayOrder?: number;
  videoUrl?: string;
  videoFile?: { asset: { url: string } };
  model3d?: { asset: { url: string } };
  panorama?: SanityImageSource[];
  client?: string;
  location?: string;
  year?: number;
  tools?: string[];
};

export type Property = {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  shortDescription?: string;
  images?: SanityImageSource[];
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

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photo: SanityImageSource | null;
  linkedinUrl: string | null;
};
