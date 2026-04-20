export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────────
    {
      name: "heroTagline",
      title: "Hero Tagline",
      type: "string",
      description: 'e.g. "Building Ghana\'s Future"',
    },
    {
      name: "heroGoldWord",
      title: "Hero Gold Word",
      type: "string",
      description: "The single word rendered in gold (must appear in the tagline)",
    },
    {
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "string",
    },
    {
      name: "heroCtaPrimary",
      title: "Hero CTA Primary",
      type: "string",
      description: 'e.g. "Our Services"',
    },
    {
      name: "heroCtaSecondary",
      title: "Hero CTA Secondary",
      type: "string",
      description: 'e.g. "View Projects"',
    },

    // ── About ─────────────────────────────────────────────────────────────────
    {
      name: "aboutLabel",
      title: "About Label",
      type: "string",
      description: 'e.g. "About Us"',
    },
    {
      name: "aboutHeading",
      title: "About Heading",
      type: "string",
      description: 'e.g. "Ghana\'s First 3D-Printed Green Estate"',
    },
    {
      name: "aboutHeadingGoldWords",
      title: "About Heading Gold Words",
      type: "string",
      description: "Substring of the heading to render in gold, e.g. \"3D-Printed\"",
    },
    {
      name: "aboutBody",
      title: "About Body",
      type: "text",
    },
    {
      name: "statOneValue",
      title: "Stat 1 Value",
      type: "string",
      description: 'e.g. "12+"',
    },
    {
      name: "statOneLabel",
      title: "Stat 1 Label",
      type: "string",
      description: 'e.g. "Projects"',
    },
    {
      name: "statTwoValue",
      title: "Stat 2 Value",
      type: "string",
    },
    {
      name: "statTwoLabel",
      title: "Stat 2 Label",
      type: "string",
    },
    {
      name: "statThreeValue",
      title: "Stat 3 Value",
      type: "string",
    },
    {
      name: "statThreeLabel",
      title: "Stat 3 Label",
      type: "string",
    },

    // ── Services ──────────────────────────────────────────────────────────────
    {
      name: "servicesLabel",
      title: "Services Label",
      type: "string",
      description: 'e.g. "What We Do"',
    },
    {
      name: "servicesHeading",
      title: "Services Heading",
      type: "string",
      description: 'e.g. "Our Services"',
    },
    {
      name: "servicesHeadingGoldWord",
      title: "Services Heading Gold Word",
      type: "string",
    },
    // Service 1
    {
      name: "serviceOneTitle",
      title: "Service 1 Title",
      type: "string",
    },
    {
      name: "serviceOneSubtitle",
      title: "Service 1 Subtitle",
      type: "string",
    },
    {
      name: "serviceOneDescription",
      title: "Service 1 Card Description",
      type: "text",
    },
    {
      name: "serviceOneModalDescription",
      title: "Service 1 Modal Description",
      type: "text",
    },
    {
      name: "serviceOneServices",
      title: "Service 1 Services List",
      type: "array",
      of: [{ type: "string" }],
    },
    // Service 2
    {
      name: "serviceTwoTitle",
      title: "Service 2 Title",
      type: "string",
    },
    {
      name: "serviceTwoSubtitle",
      title: "Service 2 Subtitle",
      type: "string",
    },
    {
      name: "serviceTwoDescription",
      title: "Service 2 Card Description",
      type: "text",
    },
    {
      name: "serviceTwoModalDescription",
      title: "Service 2 Modal Description",
      type: "text",
    },
    {
      name: "serviceTwoServices",
      title: "Service 2 Services List",
      type: "array",
      of: [{ type: "string" }],
    },
    // Service 3
    {
      name: "serviceThreeTitle",
      title: "Service 3 Title",
      type: "string",
    },
    {
      name: "serviceThreeSubtitle",
      title: "Service 3 Subtitle",
      type: "string",
    },
    {
      name: "serviceThreeDescription",
      title: "Service 3 Card Description",
      type: "text",
    },
    {
      name: "serviceThreeModalDescription",
      title: "Service 3 Modal Description",
      type: "text",
    },
    {
      name: "serviceThreeServices",
      title: "Service 3 Services List",
      type: "array",
      of: [{ type: "string" }],
    },

    // ── Contact ───────────────────────────────────────────────────────────────
    {
      name: "contactLabel",
      title: "Contact Label",
      type: "string",
      description: 'e.g. "Get In Touch"',
    },
    {
      name: "contactHeading",
      title: "Contact Heading",
      type: "string",
      description: 'e.g. "Let\'s Build Together"',
    },
    {
      name: "contactHeadingGoldWord",
      title: "Contact Heading Gold Word",
      type: "string",
      description: 'e.g. "Together"',
    },
    {
      name: "contactSubtext",
      title: "Contact Subtext",
      type: "text",
    },
    {
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    },
    {
      name: "contactLocation",
      title: "Contact Location",
      type: "string",
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    {
      name: "footerCopyright",
      title: "Footer Copyright",
      type: "string",
      description: 'e.g. "© 2025 The Anthracite Limited. All Rights Reserved."',
    },
    {
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
      description: "Optional short tagline shown under the logo or at bottom",
    },
  ],
};
