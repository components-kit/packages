import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

function RootComponent() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
