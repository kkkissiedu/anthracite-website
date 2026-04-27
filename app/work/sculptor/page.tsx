import { Metadata } from 'next';
import SculptorPageClient from './PageClient';
import { getSiteSettings, getProjectsByCategory } from '@/lib/sanity';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Sculptor — 3D Design Services | The Anthracite Limited',
  description: 'High-fidelity 3D modelling, digital twins, VR/XR experiences and parametric design through The Sculptor, our sister 3D design studio based in Kumasi, Ghana.',
  alternates: {
    canonical: 'https://theanthracite.com/work/sculptor',
  },
  openGraph: {
    title: 'The Sculptor — 3D Design Services | The Anthracite Limited',
    description: 'High-fidelity 3D modelling, digital twins, VR/XR experiences and parametric design through The Sculptor, our sister 3D design studio.',
    url: 'https://theanthracite.com/work/sculptor',
    images: [{ url: 'https://theanthracite.com/og-image.png', width: 1200, height: 630, alt: 'The Sculptor 3D Design — The Anthracite Limited' }],
  },
};

export default async function SculptorPage() {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getProjectsByCategory('3d-design'),
  ]);
  return (
    <SculptorPageClient
      heroHeading={settings?.pages?.sculptor?.heroHeading}
      heroSubtitle={settings?.pages?.sculptor?.heroSubtitle}
      projects={projects}
    />
  );
}
