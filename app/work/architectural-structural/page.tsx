import { Metadata } from 'next';
import ArchitecturalPageClient from './PageClient';
import { getSiteSettings } from '@/lib/sanity';

export const metadata: Metadata = {
  title: 'Architectural & Structural Design | The Anthracite Limited',
  description: 'Precision-engineered architectural and structural designs informed by physics-based simulations, computational methods, and real-world performance targets. Based in Kumasi, Ghana.',
  alternates: {
    canonical: 'https://theanthracite.com/work/architectural-structural',
  },
  openGraph: {
    title: 'Architectural & Structural Design | The Anthracite Limited',
    description: 'Precision-engineered architectural and structural designs informed by physics-based simulations, computational methods, and real-world performance targets.',
    url: 'https://theanthracite.com/work/architectural-structural',
    images: [{ url: 'https://theanthracite.com/og-image.png', width: 1200, height: 630, alt: 'Architectural & Structural Design — The Anthracite Limited' }],
  },
};

export default async function ArchitecturalPage() {
  const settings = await getSiteSettings();
  return (
    <ArchitecturalPageClient
      heroHeading={settings?.pages?.architectural?.heroHeading}
      heroSubtitle={settings?.pages?.architectural?.heroSubtitle}
    />
  );
}
