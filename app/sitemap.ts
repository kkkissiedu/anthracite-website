import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://theanthracite.com';
  const lastModified = new Date();

  return [
    { url: baseUrl, lastModified, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/work/architectural-structural`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/work/sculptor`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/real-estate`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
