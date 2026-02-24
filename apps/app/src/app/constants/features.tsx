import type { Feature } from "@/app/types/landing";

import { AccessibleVisual } from "@/app/components/sections/features/accessible-visual";
import { LlmsVisual } from "@/app/components/sections/features/llms-visual";
import { ModularVisual } from "@/app/components/sections/features/modular-visual";
import { PropsDrivenVisual } from "@/app/components/sections/features/props-driven-visual";
import { TypeGenVisual } from "@/app/components/sections/features/type-gen-visual";
import { VariantSyncVisual } from "@/app/components/sections/features/variant-sync-visual";
import { ZeroDepsVisual } from "@/app/components/sections/features/zero-deps-visual";

export const INSTALL_CMD = "pnpm add @components-kit/react";

export const FEATURES: Feature[] = [
  {
    colSpan: 2,
    description:
      "Eliminate wrapper hell with a flat, props-driven API. By using direct prop control and Slot composition, you get a cleaner DOM and high-performance structures that AI agents can generate with surgical precision.",
    title: "Props-Driven API",
    visual: <PropsDrivenVisual />,
  },
  {
    description:
      "Zero bloat, zero conflicts. React is our only required peer dependency. Modular logic for tables or dropdowns is strictly opt-in, ensuring you only ship the code your application actually needs.",
    title: "Zero Forced Dependencies",
    visual: <ZeroDepsVisual />,
  },
  {
    description:
      "Design shifts, your code adapts. Our global CSS bundle delivers designer-managed styles and semantic tokens instantly, allowing you to update visual themes across your entire app without a single redeploy.",
    title: "Automated Style Sync", // Changed "Variant" to "Style" to distinguish from the Props/Types
    visual: <VariantSyncVisual />,
  },
  {
    description:
      "Type safety, delivered from the cloud. Our CLI fetches your design system’s metadata directly from our servers to generate global Module Augmentations—instantly syncing your remote variants into first-class TypeScript interfaces for your IDE.",
    title: "Dynamic Type Generation",
    visual: <TypeGenVisual />,
  },
  {
    description:
      "Built for Copilots. Standardized llms.txt manifests provide machine-readable maps of your library, helping AI agents understand your architecture and generate error-free UI code out of the box.",
    title: "Agent-First Documentation",
    visual: <LlmsVisual />,
  },
  {
    description:
      "WAI-ARIA compliance baked in. From focus trapping to roving tabindex, we handle complex interaction mechanics under the hood to ensure your UI is semantic and inclusive by default.",
    title: "Accessible by Default",
    visual: <AccessibleVisual />,
  },
  {
    colSpan: 2,
    description:
      "Scale without the penalty. Leverage industry-leading primitives like TanStack Table and Sonner as optional peers. Enjoy powerful, complex logic while keeping your core bundle ultra-light.",
    title: "Modular Peer Architecture",
    visual: <ModularVisual />,
  },
];
