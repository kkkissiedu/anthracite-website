import { createClient } from "next-sanity";

const client = createClient({
  projectId: "x9ubqazh",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log("Seeding siteSettings...");

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",

    // Hero
    heroTagline: "Building Ghana's Future",
    heroGoldWord: "Future",
    heroSubtitle:
      "Pioneering AI-driven construction and 3D-printed green buildings to shape a sustainable, modern Ghana.",
    heroCtaPrimary: "Our Services",
    heroCtaSecondary: "View Projects",

    // About
    aboutLabel: "About Us",
    aboutHeading: "Ghana's First 3D-Printed Green Estate",
    aboutHeadingGoldWords: "3D-Printed",
    aboutBody:
      "The Anthracite Limited is pioneering Ghana's first 3D-printed Green Building estate, fusing Physics-Informed AI, computational design, and sustainable construction into a complete workflow from digital twin to physical structure.",
    statOneValue: "12+",
    statOneLabel: "Projects",
    statTwoValue: "3",
    statTwoLabel: "Services",
    statThreeValue: "2",
    statThreeLabel: "Engineers",

    // Services
    servicesLabel: "What We Do",
    servicesHeading: "Our Services",
    servicesHeadingGoldWord: "Services",

    // Service 1 — Architectural & Structural Design
    serviceOneTitle: "Architectural & Structural Design",
    serviceOneSubtitle: null,
    serviceOneDescription:
      "From concept to construction documentation — precision-engineered designs informed by physics-based simulations, computational methods, and real-world performance targets.",
    serviceOneModalDescription:
      "From concept to construction documentation, we deliver precision-engineered designs informed by physics-based simulations, computational methods, and real-world performance targets. Our workflow integrates structural analysis in ABAQUS and ProtaStructure with BIM documentation in Autodesk Revit and AutoCAD.",
    serviceOneServices: [
      "Structural Analysis & Design",
      "BIM Documentation",
      "Construction Drawings",
      "Seismic & Load Analysis",
      "Foundation Design",
      "Structural Detailing",
    ],

    // Service 2 — 3D Design Services
    serviceTwoTitle: "3D Design Services",
    serviceTwoSubtitle: "via The Sculptor",
    serviceTwoDescription:
      "High-fidelity 3D modelling, digital twins, and parametric design through our sister studio, enabling seamless transitions from virtual model to physical printed structure.",
    serviceTwoModalDescription:
      "High-fidelity 3D modelling, digital twins, and parametric design through our sister studio. We bridge the gap between virtual model and physical structure, producing assets for visualisation, construction simulation, and additive manufacturing workflows.",
    serviceTwoServices: [
      "3D Modelling & Visualisation",
      "Digital Twins",
      "Parametric Design",
      "Synthetic Data Generation",
      "VR/AR Experiences",
      "3D Printing Preparation",
    ],

    // Service 3 — Real Estate & Construction
    serviceThreeTitle: "Real Estate & Construction",
    serviceThreeSubtitle: null,
    serviceThreeDescription:
      "End-to-end real estate development and construction management, anchored by our flagship 3D-printed Green Building estate — built for durability, sustainability, and scale.",
    serviceThreeModalDescription:
      "End-to-end real estate development and construction management, anchored by our flagship 3D-printed Green Building estate. We manage projects from site acquisition through to handover, built for durability, sustainability, and scale across Ghana and West Africa.",
    serviceThreeServices: [
      "Real Estate Development",
      "Construction Management",
      "Green Building Design",
      "3D-Printed Construction",
      "Project Management",
      "Sustainability Consulting",
    ],

    // Contact
    contactLabel: "Get In Touch",
    contactHeading: "Let's Build Together",
    contactHeadingGoldWord: "Together",
    contactSubtext:
      "We're pioneering the future of construction in Ghana. Reach out to discuss your project, partnership, or investment opportunities.",
    contactEmail: "hello@theanthracite.com",
    contactLocation: "Kumasi, Ghana",

    // Footer
    footerCopyright: "© 2025 The Anthracite Limited. All Rights Reserved.",
    footerTagline: "Kumasi, Ghana",
  });

  console.log("siteSettings seeded successfully.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
