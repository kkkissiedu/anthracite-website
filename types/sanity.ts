import type { SanityImageSource } from "@sanity/image-url";

export type { SanityImageSource };

export type SanityPortableTextBlock = {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text: string; marks?: string[] }[];
};

export type ResolvedImage = {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  alt?: string;
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
  mainImage?: ResolvedImage;
  gallery?: ResolvedImage[];
  panorama?: ResolvedImage[];
  displayOrder?: number;
  videoUrl?: string;
  videoFile?: { asset: { url: string } };
  model3d?: { asset: { url: string } };
  panoramaUrl?: string;
  client?: string;
  location?: string;
  year?: number;
  projectType?: string;
  tools?: string[];
};

export type Property = {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  shortDescription?: string;
  images?: ResolvedImage[];
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
  photo: ResolvedImage | null;
  linkedinUrl: string | null;
};
