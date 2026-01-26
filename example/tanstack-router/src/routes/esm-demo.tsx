import { createFileRoute } from "@tanstack/react-router";

const CK_HOST =
  import.meta.env.VITE_COMPONENTS_KIT_URL ?? "http://localhost:4000";
const CK_API_KEY = import.meta.env.VITE_COMPONENTS_KIT_KEY ?? "";

// Helper to load CK component (used by loader)
async function loadCKComponent(componentName: string) {
  const cdnUrl = `${CK_HOST}/v1/esm/${componentName}.mjs?key=${CK_API_KEY}`;
  const module = await import(/* @vite-ignore */ cdnUrl);
  return module.default;
}

export const Route = createFileRoute("/esm-demo")({
  // eslint-disable-next-line no-use-before-define
  component: EsmDemoPage,

  // Error boundary for loader failures
  errorComponent: ({ error }) => (
    <div style={{ padding: "2rem" }}>
      <h1>Dynamic Component Demo (CSR)</h1>
      <p style={{ color: "red" }}>Error: {(error as Error).message}</p>
    </div>
  ),
  // Loader runs BEFORE component renders - no loading flash!
  loader: async () => {
    const CardComponent = await loadCKComponent("Card");
    return { CardComponent };
  },

  // Only show pending UI if loader takes >200ms
  pendingComponent: () => (
    <div style={{ padding: "2rem" }}>
      <h1>Dynamic Component Demo (CSR)</h1>
      <p>Loading component...</p>
    </div>
  ),

  pendingMs: 200,
});

function EsmDemoPage() {
  // Component is already loaded via the route loader!
  const { CardComponent } = Route.useLoaderData();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dynamic Component Demo (CSR)</h1>
      <p>This Card was preloaded via route loader:</p>
      <CardComponent
        description="Preloaded via route loader - no loading flash!"
        title="Welcome"
        // eslint-disable-next-line no-console
        onButtonClick={() => console.log("Button clicked!")}
      />
    </div>
  );
}
