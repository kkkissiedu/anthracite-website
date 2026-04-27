import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: "production",
  },
  deployment: {
    appId: "pm090dg5n39liwyc1vzi9yxk",
  },
});
