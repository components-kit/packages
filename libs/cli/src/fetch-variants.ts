export interface ComponentVariant {
  variants: string[];
}

export interface VariantsResponse {
  components: Record<string, ComponentVariant>;
}

/**
 * Fetch component variants from the ComponentsKit API.
 */
export async function fetchVariants(apiUrl: string): Promise<VariantsResponse> {
  const url = `${apiUrl}/v1/public/variants`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch variants from ${url}: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as VariantsResponse;

  if (!data.components || typeof data.components !== "object") {
    throw new Error("Invalid response: missing 'components' field");
  }

  return data;
}
