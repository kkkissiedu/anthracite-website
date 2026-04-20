import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first. Use gaps like 10, 20, 30 to leave room for future projects.",
      initialValue: 99,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Architectural & Structural", value: "architectural-structural" },
          { title: "3D Design", value: "3d-design" },
          { title: "Real Estate & Construction", value: "real-estate-construction" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory",
      type: "string",
      options: {
        list: [
          { title: "Residential", value: "Residential" },
          { title: "Commercial", value: "Commercial" },
          { title: "Industrial", value: "Industrial" },
          { title: "Mixed-Use", value: "Mixed-Use" },
          { title: "Digital Twins", value: "Digital Twins" },
          { title: "Parametric Design", value: "Parametric Design" },
          { title: "Visualisation", value: "Visualisation" },
        ],
      },
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "string",
      description: "YouTube or Vimeo URL",
    }),
    defineField({
      name: "videoFile",
      title: "Video File",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "panorama",
      title: "360° Panorama Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Equirectangular panorama images",
    }),
    defineField({
      name: "model3d",
      title: "3D Model",
      type: "file",
      options: { accept: ".fbx,.gltf,.glb" },
      description: "Accepts .fbx, .gltf, or .glb files",
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "mainImage" },
  },
});
