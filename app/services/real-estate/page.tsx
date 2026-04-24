import { Metadata } from 'next';
import RealEstatePageClient from './PageClient';

export const metadata: Metadata = {
  title: 'Real Estate & Construction | The Anthracite Limited',
  description: "End-to-end real estate development and construction management in Ghana, anchored by Ghana's first 3D-printed Green Building estate in Kumasi.",
  alternates: {
    canonical: 'https://www.theanthracite.com/services/real-estate',
  },
  openGraph: {
    title: 'Real Estate & Construction | The Anthracite Limited',
    description: "End-to-end real estate development and construction management, anchored by Ghana's first 3D-printed Green Building estate.",
    url: 'https://www.theanthracite.com/services/real-estate',
    images: [{ url: 'https://www.theanthracite.com/og-image.png', width: 1200, height: 630, alt: 'Real Estate & Construction — The Anthracite Limited' }],
  },
};

export default function RealEstatePage() {
  return <RealEstatePageClient />;
}
