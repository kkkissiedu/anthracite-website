# The Anthracite Limited — Project Context

## Project
Company website for The Anthracite Limited.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** GSAP, Framer Motion, Lenis (smooth scroll)
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **CMS:** Sanity (next-sanity, @sanity/image-url)
- **Email:** Resend
- **Hosting:** Vercel

## Brand Colors
| Token | Hex |
|-------|-----|
| Dark background | `#0D0D0D` |
| Gold | `#C9952A` |
| Gold highlight | `#D4AF37` |
| Light background | `#F5F0E8` |
| Dark text | `#1A1A1A` |

## Typography
- **Headings:** Cormorant Garamond
- **Body:** Inter

## Page Sections
1. Navbar
2. Hero
3. About
4. Services
5. Projects
6. Team
7. Contact
8. Footer

## Git Workflow
Always commit changes in the worktree before merging to main. Never push the feature branch before verifying git log shows the new commits on that branch. Use git push origin HEAD:main for all pushes to main, never git push origin main.

## Sanity Deployment

The `.env.local` file lives in the main project root and is not available in the worktree.
When running `npx sanity deploy` or any command requiring `NEXT_PUBLIC_SANITY_PROJECT_ID`,
prefix the command with the env var inline:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=$(grep NEXT_PUBLIC_SANITY_PROJECT_ID $(git rev-parse --show-toplevel)/../../.env.local | cut -d '=' -f2) npx sanity deploy
```

If that path resolution fails, fall back to reading the project root .env.local manually
and running:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<value> npx sanity deploy
```

The project ID can always be found at https://sanity.io/manage under project settings.
