import { Button } from "@/app/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 sm:px-6">
      <h1 className="text-4xl font-medium tracking-tighter">404</h1>
      <p className="mt-3 text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <div className="mt-6 flex gap-4">
        <Button href="/" variant="primary">
          Go home
        </Button>
        <Button href="https://github.com/components-kit/packages" variant="outline">
          GitHub
        </Button>
      </div>
    </main>
  );
}
