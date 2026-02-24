// Debounced callback hook
export { useDebouncedCallback } from "./use-debounced-callback";

// Exit transition hook for delayed unmount animations
export { useExitTransition } from "./use-exit-transition";
export type {
  UseExitTransitionOptions,
  UseExitTransitionReturn,
} from "./use-exit-transition";

// Generic Floating UI hook (reusable for all floating components)
export { useFloating } from "./use-floating";
export type { UseFloatingOptions, UseFloatingReturn } from "./use-floating";

// Select-specific Floating UI hook
export { useFloatingSelect } from "./use-floating-select";
export type {
  UseFloatingSelectOptions,
  UseFloatingSelectReturn,
} from "./use-floating-select";

// Mobile viewport sync for floating elements (e.g. iOS keyboard shifts)
export { useFloatingViewportSync } from "./use-floating-viewport-sync";
