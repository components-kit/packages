import { CKComponent } from "@components-kit/loader-nextjs/client";

import { ckLoader } from "@/lib/ck-loader";

export default async function EsmDemoPage() {
  const cardData = await ckLoader.renderComponent("Card", {
    description: "This is a dynamic component loaded from the server.",
    title: "Welcome",
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dynamic Component Demo (SSR)</h1>
      <p>This Card is pre-rendered on the server:</p>
      <CKComponent host={ckLoader.getHost()} renderData={cardData} />
    </div>
  );
}
