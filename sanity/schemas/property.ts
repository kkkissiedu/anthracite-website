import { defineField, defineType } from "sanity";

export const property = defineType({
  name: "property",
  title: "Property",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "The Penthouse, Kumasi"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
      description: "Full description of the property",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "string",
      description: "One-liner shown on the listing card",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Main photo gallery — first image is the cover",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (optional)",
      type: "string",
      description: "YouTube or Vimeo URL for walkthrough video",
    }),
    defineField({
      name: "panoramaUrl",
      title: "360° Panorama URL (optional)",
      type: "string",
      description: "Equirectangular panorama image URL for Pannellum viewer",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'e.g. "Kumasi, Ashanti Region"',
    }),
    defineField({
      name: "bedrooms",
      title: "Bedrooms",
      type: "number",
    }),
    defineField({
      name: "bathrooms",
      title: "Bathrooms",
      type: "number",
    }),
    defineField({
      name: "pricePerNight",
      title: "Price Per Night (GHS)",
      type: "number",
      description: "Leave blank to show 'Price on enquiry'",
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      initialValue: true,
      description: "Only available properties appear on the listings page",
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      of: [{ type: "string" }],
      description: 'e.g. "WiFi", "Pool", "Air Conditioning"',
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description: "Digits only, no + prefix — e.g. 233244000000",
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      description: "Full phone number including country code — e.g. +233244000000",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "images.0",
    },
  },
});
