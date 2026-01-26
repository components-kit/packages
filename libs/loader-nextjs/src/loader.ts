import type { CKLoaderConfig, RenderResponse } from "./types";

export class CKLoader {
  constructor(private config: CKLoaderConfig) {}

  getHost(): string {
    return this.config.host;
  }

  async renderComponent(
    componentName: string,
    props?: Record<string, unknown>,
    children?: string,
  ): Promise<RenderResponse> {
    const url = `${this.config.host}/v1/esm/${componentName}/render`;
    const response = await fetch(url, {
      body: JSON.stringify({ children, props }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Failed to render component: ${response.statusText}`);
    }
    return response.json();
  }
}

export function initCKLoader(config: CKLoaderConfig): CKLoader {
  return new CKLoader(config);
}
