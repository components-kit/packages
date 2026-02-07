import { ShowcaseLayout } from "@components-kit/example-shared";
import { createFileRoute } from "@tanstack/react-router";

function HomePage() {
  return <ShowcaseLayout />;
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
