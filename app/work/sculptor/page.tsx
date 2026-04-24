import { Metadata } from 'next';
import SculptorPageClient from './PageClient';

export const metadata: Metadata = {
  title: 'The Sculptor — 3D Design Services | The Anthracite Limited',
  description: 'High-fidelity 3D modelling, digital twins, VR/XR experiences and parametric design through The Sculptor, our sister 3D design studio based in Kumasi, Ghana.',
  alternates: {
    canonical: 'https://www.theanthracite.com/work/sculptor',
  },
  openGraph: {
    title: 'The Sculptor — 3D Design Services | The Anthracite Limited',
    description: 'High-fidelity 3D modelling, digital twins, VR/XR experiences and parametric design through The Sculptor, our sister 3D design studio.',
    url: 'https://www.theanthracite.com/work/sculptor',
    images: [{ url: 'https://www.theanthracite.com/og-image.png', width: 1200, height: 630, alt: 'The Sculptor 3D Design — The Anthracite Limited' }],
  },
};

export default function SculptorPage() {
  return <SculptorPageClient />;
}
