import { FEATURES } from "@/app/constants/features";

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="grid gap-8 sm:gap-5 sm:grid-cols-2 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={`flex flex-col overflow-hidden ${
              feature.className || ""
            }${feature.colSpan ? " sm:col-span-2 md:col-span-2" : ""}`}
          >
            {feature.visual ? (
              feature.visual
            ) : (
              <div className="h-64 sm:h-96 rounded-xl bg-neutral-200" />
            )}
            <div className="mt-4">
              <h3 className="text-lg">
                {feature.title}
              </h3>
              <p
                className={`mt-1 text-sm ${feature.className ? "opacity-80" : "text-neutral-600"}`}
              >
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
