export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Anthracite Limited',
    url: 'https://theanthracite.com',
    logo: 'https://theanthracite.com/logo-icon.svg',
    description:
      'Pioneering AI-driven construction and 3D-printed green buildings to shape a sustainable, modern Ghana.',
    foundingDate: '2024',
    email: 'hello@theanthracite.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kumasi',
      addressRegion: 'Ashanti',
      addressCountry: 'GH',
    },
    sameAs: [],
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://theanthracite.com/#business',
    name: 'The Anthracite Limited',
    image: 'https://theanthracite.com/og-image.png',
    url: 'https://theanthracite.com',
    telephone: '',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kumasi',
      addressRegion: 'Ashanti',
      addressCountry: 'GH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 6.6885,
      longitude: -1.6244,
    },
    areaServed: [
      { '@type': 'Country', name: 'Ghana' },
      { '@type': 'Place', name: 'Accra' },
      { '@type': 'Place', name: 'Kumasi' },
    ],
  };

  const servicesSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Architectural & Structural Design',
      provider: { '@type': 'Organization', name: 'The Anthracite Limited' },
      areaServed: { '@type': 'Country', name: 'Ghana' },
      description:
        'Precision-engineered architectural and structural designs informed by physics-based simulations, computational methods, and real-world performance targets.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: '3D Design Services',
      provider: { '@type': 'Organization', name: 'The Anthracite Limited' },
      areaServed: { '@type': 'Country', name: 'Ghana' },
      description:
        'High-fidelity 3D modelling, digital twins, and parametric design through our sister studio, The Sculptor.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Real Estate & Construction',
      provider: { '@type': 'Organization', name: 'The Anthracite Limited' },
      areaServed: { '@type': 'Country', name: 'Ghana' },
      description:
        "End-to-end real estate development and construction management, anchored by Ghana's first 3D-printed Green Building estate.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {servicesSchema.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
